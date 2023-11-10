from django.urls import path
from . import views

urlpatterns = [
    path('get_users/', views.getUsers, name='get_users'),  # Ruta existente para obtener usuarios
    path('add_users/', views.addUsers, name='add_users'),
    path('get_reservations/', views.getReservations, name='get_reservations'),  # Nueva ruta para obtener reservaciones
    path('add_reservations/', views.addReservation, name='add_reservations'),
    path('control-led/', views.control_led, name='control_led'),
    path('get_esp32/', views.get_esp32, name='get_esp32'),
    path('post_esp32/', views.post_esp32, name='post_esp32'),
]