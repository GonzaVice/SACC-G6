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
    path('dashboard/', views.dashboard, name='dashboard')
]


