from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .mqtt_util import mqtt_connect_and_publish, mqtt_subscribe, received_messages, mqtt_disconnect

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
    mqtt_connect_and_publish('msg/reservation', 'Reserva realizada')
    return JsonResponse({'status': 'success'})

def send_load_message(request):
    mqtt_connect_and_publish('msg/load', 'Carga realizada')
    return JsonResponse({'status': 'success'})

def send_unload_message(request):
    mqtt_connect_and_publish('msg/unload', 'Descarga realizada')
    return JsonResponse({'status': 'success'})