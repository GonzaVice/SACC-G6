# urls.py

from django.urls import path
from . import views

urlpatterns = [
    # Endpoint for user login
    path('login/', views.login_user, name='login'),
    # Endpoint for user registration
    path('register/', views.register_user, name='register'),
    # Add other endpoints as needed
    path('user/<int:user_id>/', views.get_user_by_id),

    path('get_stations_info/', views.get_stations_info, name='get_stations_info'),

    path('get_all_stations/', views.get_all_stations, name='get_all_stations'),
    #1 
    path('get_stations/', views.get_stations, name='get_stations'),
    #2
    path('reserva_casillero/', views.reserva_casillero, name='reserva_casillero'),
    #3
    path('confirmar_reserva/', views.confirmar_reserva, name='confirmar_reserva'),
    #4
    path('confirmar_paquete/', views.confirmar_paquete, name='confirmar_paquete'),
    #5
    path('cancelar_reserva/', views.cancelar_reserva, name='cancelar_reserva'),
    #6
    path('estado_reserva/', views.estado_reserva, name='estado_reserva'),
    #7
    path('reservas_activas/', views.reservas_activas, name='reservas_activas'),
    #8
    path('reservas_historicas/', views.reservas_historicas, name='reservas_historicas'),

    #Operador abre puerta
    path('operador_abre/', views.operador_abre, name='operador_abre'),

    #Cliente abre puerta
    path('cliente_abre/', views.cliente_abre, name='cliente_abre'),
    
    
    #Dashboard
    path('dashboard/', views.dashboard2, name='dashboard2'),


    #CRUD de estaciones
    path('create_station/', views.create_station, name='create_station'),
    path('delete_station/', views.delete_station, name='delete_station'),
    path('edit_station/', views.edit_station, name='edit_station'),
    
    #CRUD de casilleros
    path('create_locker/', views.create_locker, name='create_locker'),
    path('lockers/', views.locker_list, name='locker_list'),
    path('delete_locker/', views.delete_locker, name='delete_locker'),
    path('edit_locker/', views.edit_locker, name='edit_locker'),

    #CRUD ecommerce
    path('create_ecommerce/', views.create_ecommerce, name='create_ecommerce'),
    
    path('delete_ecommerce/', views.delete_ecommerce, name='delete_ecommerce'),

    path('edit_ecommerce/', views.edit_ecommerce, name='edit_ecommerce'),

    path('get_all_ecommerce/', views.get_all_ecommerce, name='get_all_ecommerce'),

    path('get_reservations_of_ecommerce/', views.get_reservations_of_ecommerce, name='get_reservations_of_ecommerce'),

    #Get physical data
    path('subscribe_mqtt/', views.subscribe_mqtt, name='subscribe_mqtt'),

    path('mqtt_ask/', views.mqtt_ask, name='mqtt_ask'),

    path('reservas_historicas_estacion/', views.reservas_historicas_estacion, name='reservas_historicas_estacion'),
    path('set_csrf_token/', views.set_csrf_token, name='set_csrf_token')


]


