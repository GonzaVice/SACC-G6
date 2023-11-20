from django.db import models

# Create your models here.

#Modelo usuario
class User(models.Model):
    CLIENTE = 'cliente'
    OPERADOR = 'operador'
    ADMIN = 'admin'

    USER_TYPES = [
        (CLIENTE, 'Cliente'),
        (OPERADOR, 'Operador'),
        (ADMIN, 'Admin'),
    ]

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Use a hash solution to store passwords
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default=CLIENTE)

    def __str__(self):
        return self.email
    
class Reservation(models.Model):
    # Define constantes para los estados
    LOADING = 0
    LOADED = 1
    CONFIRMED = 2

    # Opciones para los estados
    RESERVATION_STATES = [
        (LOADING, 'Cargando'),
        (LOADED, 'Cargado'),
        (CONFIRMED, 'Confirmado'),
    ]

    # Campos existentes
    description = models.CharField(max_length=200, default='Default Reservation')
    datetime = models.DateTimeField(auto_now_add=True)
    users = models.ManyToManyField(User, related_name='reservations')  # Nuevo campo para el estado de la reserva
    state = models.IntegerField(choices=RESERVATION_STATES, default=LOADING)

    def __str__(self):
        return f"Reservation: {self.description} at {self.datetime}"

## Modelo Estación de Casilleros
class Station(models.Model):
    state = models.BooleanField(default=True)  # True: Casilleros disponibles, False: Ningún casillero disponible

    def __str__(self):
        return f"Station (ID: {self.id}) - Available: {self.state}"


class Locker(models.Model):

    STATE_CHOICES = (
        (0, "Disponible"),
        (1, "Reservado"),
        (2, "Confirmado"),
        (3, "Cargado"),
    )

    length = models.IntegerField()  # Campo para la longitud en centímetros
    width = models.IntegerField()   # Campo para el ancho en centímetros
    height = models.IntegerField()  # Campo para la altura en centímetros
    state = models.IntegerField(choices=STATE_CHOICES, default=0)  
    station = models.ForeignKey(Station, on_delete=models.CASCADE)  # Un casillero pertenece a una estación

    reservation = models.ForeignKey(
        Reservation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='locker_reservation'
    )


    def __str__(self):
        return f"Locker (ID: {self.id}) - State: {self.get_state_display()}"
    

