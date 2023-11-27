from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
import secrets
import random
# Create your models here.

#Modelo usuario
class User(models.Model):

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Use a hash solution to store passwords

    def __str__(self):
        return self.email
    

class Ecommerce(models.Model):
    name = models.CharField(max_length=255, unique=True)
    key = models.CharField(max_length=50, unique=True, blank=True)


    def __str__(self):
        return self.name
    
@receiver(pre_save, sender=Ecommerce)
def generate_key(sender, instance, **kwargs):
    # Generar una clave solo si no se proporciona
    if not instance.key:
        instance.key = secrets.token_urlsafe(7)

class Reservation(models.Model):
    
    # Define constantes para los estados
    RESERVADO = 0
    CONFIRMADO_RESERVA = 1
    CONFIRMADO_OP = 2
    CANCELADO = 3
    FINALIZADO = 4
    
    # Opciones para los estados
    RESERVATION_STATES = [
        (RESERVADO, 'Reservado'),
        (CONFIRMADO_RESERVA, 'Confirmado_Reserva'),
        (CONFIRMADO_OP, 'Confirmado_OP'),
        (CANCELADO, 'Cancelado'),
        (FINALIZADO, 'Finalizado')
    ]

    # Campos existentes
    identificador = models.IntegerField(default=random.randint(10000, 99999), editable=False)
    name = models.CharField(max_length=200, default='Default Reservation')
    datetime = models.DateTimeField(auto_now_add=True)
    operador = models.CharField(max_length=200,default='ValorPorDefecto') #mail del operador
    operador_password = models.CharField(max_length=200,default='ValorPorDefecto') #mail del operador
    cliente = models.CharField(max_length=200, default='ValorPorDefecto')
    cliente_password = models.CharField(max_length=200, default='ValorPorDefectoPassword')

    state = models.IntegerField(choices=RESERVATION_STATES, default=RESERVADO)  # Agregar el campo 'state'
    ecommerce = models.ForeignKey(Ecommerce, on_delete=models.CASCADE, related_name='reservations', null=True)

    horaConfirmacionReserva = models.DateTimeField(null=True, blank=True)
    horaConfirmacionOperador = models.DateTimeField(null=True, blank=True)
    horaCarga = models.DateTimeField(null=True, blank=True)
    horaDescarga = models.DateTimeField(null=True, blank=True)
    horaFinalizacion = models.DateTimeField(null=True, blank=True)
    horaCancelacion = models.DateTimeField(null=True, blank=True)


    def __str__(self):
        return f"Reservation: {self.name} "


## Modelo Estación de Casilleros
class Station(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self):
        return f"Station (NAME: {self.name})"
    conexion = models.CharField(max_length=255)

class Locker(models.Model):

    STATE_CHOICES = (
        (0, "Disponible"),
        (1, "Reservado"),
        (2, "Confirmado"),
        (3, "Cargado"),
    )

    name = models.CharField(max_length=255)  # Campo para el nombre del casillero
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
        return f"Locker (Name: {self.name}) - State: {self.get_state_display()}"
    

