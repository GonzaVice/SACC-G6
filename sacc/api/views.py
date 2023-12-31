from rest_framework.response import Response
from rest_framework.decorators import api_view
from base.models import User, Reservation
from .serializers import UserSerializer, ReservationSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt  # Importa el decorador csrf_exempt
import requests
import json
from django.http import HttpResponse
from .mqtt_manager import MQTTManager

# Configuración de la conexión MQTT
SERVER = "86718d4d31714885a63c85b39185fb86.s1.eu.hivemq.cloud"
PORT = 8883
USER = "KaijuRex"
PASSWORD = "Qwerty123"
CLIENT_ID = "DjangoApp"  # Cambia esto a un identificador único para tu aplicación Django

# Instanciar el gestor MQTT
#mqtt_manager = MQTTManager(SERVER, PORT, USER, PASSWORD, CLIENT_ID)


@api_view(['GET'])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def addUsers(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['GET'])
def getReservations(request):
    reservations = Reservation.objects.all()
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def addReservation(request):
    serializer = ReservationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@csrf_exempt
def control_led(request):
    if request.method == 'GET':
        action = request.GET.get('action')

        if action == 'obtener-reservacion':
            # Supongamos que tienes datos de reservación en forma de un diccionario
            reservation_data = {
                'id': 1000,
                'datetime': '2023-10-26 10:00:00',
                'user': 666
            }
            
            # Devuelve los datos de la reservación como JSON en la respuesta
            return JsonResponse({'status': 'success', 'data': reservation_data})
        else:
            return JsonResponse({'status': 'error', 'message': 'Acción no válida'})
    
    return JsonResponse({'status': 'error', 'message': 'Solicitud no admitida'})

def post_esp32(request):
    # URL del ESP32 y su endpoint para recibir la solicitud POST
    esp32_url = "http://10.33.3.166/your-endpoint"

    # Datos de la reservación en formato JSON
    instruction_data = {
        "locker": "2",  ## 1/2/3
        "servo": "open", ## open/close
        "client_request" : "True" ##True/False
    }

    # Realiza una solicitud POST al ESP32
    response = requests.post(esp32_url, data=json.dumps(instruction_data), headers={'Content-Type': 'application/json'})

    # Verifica la respuesta del ESP32
    if response.status_code == 200:
        return JsonResponse({'status': 'success', 'message': 'Solicitud POST exitosa'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Error en la solicitud POST al ESP32'})

def get_esp32(request):
    # URL del ESP32 y su endpoint para recibir la solicitud GET
    esp32_url = "http://10.33.3.166/your-endpoint"

    # Realiza una solicitud GET al ESP32
    response = requests.get(esp32_url)

    # Verifica la respuesta del ESP32
    if response.status_code == 200:
        # Procesa la respuesta del ESP32 según tus necesidades
        esp32_data = response.json()
        return JsonResponse({'status': 'success', 'data': esp32_data})
    else:
        return JsonResponse({'status': 'error', 'message': 'Error en la solicitud GET al ESP32'})
