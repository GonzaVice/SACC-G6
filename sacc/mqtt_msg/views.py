from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .mqtt_util import mqtt_connect_and_publish, mqtt_subscribe, received_messages, mqtt_disconnect
from django.middleware.csrf import get_token
import json
import time
import random
import string
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from django.http import JsonResponse
import os
from . import MAIL
import smtplib
from decouple import config

def send_email(to_address, subject, body):
    SCOPES = ['https://www.googleapis.com/auth/gmail.send']

    creds = None
    token_path = 'token.json'  # Path to the token file

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_path, 'w') as token:
            token.write(creds.to_json())

    service = build('gmail', 'v1', credentials=creds)

    message = MIMEMultipart()
    message['to'] = to_address
    message['subject'] = subject
    msg = MIMEText(body)
    message.attach(msg)

    raw = base64.urlsafe_b64encode(message.as_bytes()).decode("utf-8")
    
    message = service.users().messages().send(userId="me", body={"raw": raw}).execute()

def send_email_2(to_address, body):
    message = body
    subject = "SACC-G6"

    message = "Subject: {}\n\n{}".format(subject, message)
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login("givicente@miuandes.cl", "AlteredPassKey42!") # AQUI AGREGAR GENTE Y CLAVE

    server.sendmail("givicente@miuandes.cl", to_address, message)

    server.quit()

    print("Email sent successfully to %s:" % (message))

def email(message, subject, email_send, email_password, email_receive):
    # Antes ir a la configuración de tu cuenta de Google -> Seguridad -> Acceso de aplicaciones menos seguras

    message = "Subject: {}\n\n{}".format(subject, message)
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(email_send, email_password)

    server.sendmail(email_send, email_receive, message)

    server.quit()

    print("Email sent successfully to %s:" % (message))

client_passwords = {'1': {'password': ''},'2': {'password': ''},'3': {'password': ''}}
operator_passwords = {'1': {'password': ''},'2': {'password': ''},'3': {'password': ''}}


def generar_string():
    caracteres = string.ascii_letters + string.digits  # letras y números
    longitud = 6
    return ''.join(random.choice(caracteres) for i in range(longitud))

def publish_message(request):
    if request.method == 'POST':
        message = request.POST.get('message', '')
        mqtt_connect_and_publish('msg/hi-sacc', message)
        # return HttpResponse("Mensaje publicado con éxito.")
    return render(request, 'publish_message.html', {'message_sent': False})

def receive_message(request):
    mqtt_disconnect()  # Desconectar y limpiar el cliente antes de suscribirse nuevamente
    mqtt_subscribe('msg/hi-web')

    messages = received_messages.copy()  # Copia los mensajes para mostrarlos en la plantilla
    #received_messages.clear()  # Limpia la lista para evitar duplicados
    # Puedes agregar lógica adicional aquí para procesar mensajes recibidos si es necesario
    # return render(request, 'receive_message.html', {'messages': []}) # Pasa una lista vacía por ahora
    return render(request, 'receive_message.html', {'messages': messages})

def send_reservation_message(request):
    print("requestr")
    print(request)
    print(request.method)
    if request.method == 'GET':
        print('GET')
        print(request.GET)
        csrf_token = get_token(request)
        return JsonResponse({'csrfToken': csrf_token}) 

    if request.method == 'POST':
        print('POST')
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        print(body)
        mqtt_subscribe('msg/detail')
        print('RECIEVE MESSAGES')
        print(received_messages)
        while received_messages == []:
            print('WAITING')
            time.sleep(2)
            
        print('RECIEVE con algo')
        print("este es el MENSAJE: \n" ,received_messages[-1])
        json_message = json.loads(received_messages[-1])
        print("ESTE ES EL JSON",json_message)
        print('==========')
# {'station_id': 1, 
# 'lockers': [{'nickname': 1, 'state': 0, 'is_open': True, 'is_empty': True, 'length': 45, 'width': 30, 'height': 35}, 
# {'nickname': 2, 'state': 1, 'is_open': False, 'is_empty': True, 'length': 40, 'width': 40, 'height': 40}, 
# {'nickname': 3, 'state': 2, 'is_open': False, 'is_empty': True, 'length': 50, 'width': 50, 'height': 50}]}

        for locker in json_message['lockers']:
           
            # Check if the item can fit in the locker
            if locker['state'] != 0:
                continue

            if (locker['height'] >= body['height'] and
                locker['width'] >= body['width'] and
                locker['length'] >= body['length']):
                print(f"The item can fit in locker {locker['nickname']}")
                # locker['state'] = 1
                print('==========')
                print(json_message)
                print('==========')

                json_to_esp = {
                    "station_id": 1 , 
                    "nickname": locker['nickname'] 
                }    

                mqtt_connect_and_publish('msg/reservation', json.dumps(json_to_esp))
                #mail a la cliente
                #djgonzalez1@miuandes.cl
                #client_password = generar_string()
                # send_email_2('jtqueirolo@miuandes.cl', 'Your locker is reserved.')

                client_password = "2"
                client_passwords[str(locker['nickname'])]['password'] = client_password
                #operator_password = generar_string()
                operator_password = "1"
                MAIL.sendMails('givicente@miuandes.cl', 'Contrasena: 1')
                operator_passwords[str(locker['nickname'])]['password'] = operator_password
                print('client passwords: ', client_passwords)
                print('operator passwords: ', operator_passwords)

                break

    return JsonResponse({'status': 'success'})

def send_load_message(request):
    
    if request.method == 'POST':
        print('POST')
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        print(body)
        mqtt_subscribe('msg/detail')
        print('RECIEVE MESSAGES')
        print(received_messages)
        while received_messages == []:
            print('WAITING')
            time.sleep(2)
        print('RECIEVE con algo')
        print("este es el MENSAJE: \n" ,received_messages[-1])
        json_message = json.loads(received_messages[-1])
        print("ESTE ES EL JSON",json_message)
        print('==========')



        if json_message['station_id'] == 1:
            for locker in json_message['lockers']:
                if locker['nickname'] == body['nickname'] and body['password'] == operator_passwords[str(locker['nickname'])]['password']:
                    
                    json_to_esp = {
                        "station_id": 1 , 
                        "nickname": locker['nickname'] 
                    }
                    mqtt_connect_and_publish('msg/load', json.dumps(json_to_esp))
                    MAIL.sendMails('givicente@miuandes.cl', f"Producto en locker. Numero: {locker['nickname']} Contrasena: {client_passwords[str(locker['nickname'])]['password']}")
                    break



    return JsonResponse({'status': 'success'})

def send_unload_message(request):
        if request.method == 'POST':
            print('POST')
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            print(body)
            mqtt_subscribe('msg/detail')
            print('RECIEVE MESSAGES')
            print(received_messages)
            while received_messages == []:
                print('WAITING')
                time.sleep(2)
            print('RECIEVE con algo')
            print("este es el MENSAJE: \n" ,received_messages[-1])
            json_message = json.loads(received_messages[-1])
            print("ESTE ES EL JSON",json_message)
            print('==========')

        if json_message['station_id'] == 1:
            for locker in json_message['lockers']:
                if locker['nickname'] == body['nickname'] and body['password'] == client_passwords[str(locker['nickname'])]['password']:
                    
                    json_to_esp = {
                        "station_id": 1 , 
                        "nickname": locker['nickname'] 
                    }
                    mqtt_connect_and_publish('msg/unload', json.dumps(json_to_esp))
                    break


        return JsonResponse({'status': 'success'})

def details(request):
    if request.method == 'GET':
        print('GET')
        print(request.GET)
        csrf_token = get_token(request)
        mqtt_subscribe('msg/detail')
        print(received_messages)
        while received_messages == []:
            print('WAITING')
            time.sleep(3)
            
        print('RECIEVE con algo')
        print("este es el MENSAJE: \n" ,received_messages[-1])
        json_message = json.loads(received_messages[-1])
        print("ESTE ES EL JSON",json_message)
        print('==========')
        return JsonResponse({'details': json_message})
    