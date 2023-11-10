from django.shortcuts import render
from django.http import HttpResponse
from .mqtt_util import mqtt_connect_and_publish, mqtt_subscribe

def publish_message(request):
    if request.method == 'POST':
        message = request.POST.get('message', '')
        mqtt_connect_and_publish('msg/hi-sacc', message)
        # return HttpResponse("Mensaje publicado con éxito.")
    return render(request, 'publish_message.html', {'message_sent': False})

def receive_message(request):
    mqtt_subscribe('msg/hi-web')
    # Puedes agregar lógica adicional aquí para procesar mensajes recibidos si es necesario
    return render(request, 'receive_message.html', {'messages': []}) # Pasa una lista vacía por ahora