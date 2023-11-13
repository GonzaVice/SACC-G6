from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .mqtt_util import mqtt_connect_and_publish, mqtt_subscribe, received_messages, mqtt_disconnect
from django.middleware.csrf import get_token
import json
import time


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
                locker['state'] = 1
                print('==========')
                print(json_message)
                print('==========')
                mqtt_connect_and_publish('msg/detail', json.dumps(json_message))
                #mail a la cliente
                #djgonzalez1@miuandes.cl

                break

    mqtt_connect_and_publish('msg/reservation', 'Reserva realizada')
    return JsonResponse({'status': 'success'})

def send_load_message(request):
    mqtt_connect_and_publish('msg/load', 'Carga realizada')
    return JsonResponse({'status': 'success'})

def send_unload_message(request):
    mqtt_connect_and_publish('msg/unload', 'Descarga realizada')
    return JsonResponse({'status': 'success'})