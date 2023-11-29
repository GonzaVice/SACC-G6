from django.shortcuts import render
from django.utils import timezone
from . import MAIL
# Create your views here.
from django.http import JsonResponse
from .models import User
from .models import Ecommerce
from .models import Reservation
from .models import Locker
from .models import Station
from datetime import datetime, timedelta
import json
from django.core import serializers
from .mqtt_util import mqtt_connect_and_publish, mqtt_subscribe, received_messages, mqtt_disconnect
import time

def load(station,locker):
    json_to_esp = {
            "station_name": station , 
            "nickname": locker
        }    

    mqtt_connect_and_publish('load', json.dumps(json_to_esp))
    

def unload(station,locker):
    json_to_esp = {
            "station_name": station , 
            "nickname": locker
        }    

    mqtt_connect_and_publish('unload', json.dumps(json_to_esp))
    


def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        print("Credenciales enviadas al login: ", email, password)
        # Perform user authentication logic here
        # Example: Check if the user exists and the password matches
        try:
            user = User.objects.get(email=email)
            
            if user.password == password:
                user_id = user.id  # Get the user ID
                return JsonResponse({'message': 'Login successful', 'userId': user_id})
            else:
                # Authentication failed
                return JsonResponse({'message': 'Invalid credentials'}, status=401)
        except User.DoesNotExist:
            # User does not exist
            return JsonResponse({'message': 'User does not exist'}, status=404)
    
    # Handle other HTTP methods or invalid requests
    return JsonResponse({'message': 'Method not allowed'}, status=405)

#@csrf_exempt  # Disable CSRF (for demo purposes; handle CSRF properly in production)
def register_user(request):
    if request.method == 'POST':

        data = json.loads(request.body)
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        user_type = data.get('user_type', User.CLIENTE)

        print("first_name: ", first_name)
        print("last_name: ", last_name)
        print("email: ", email)
        print("password: ", password)
        # Check if the email already exists in the database
        if User.objects.filter(email=email).exists():
            return JsonResponse({'message': 'Email already exists'}, status=400)
        
        # Ensure all required data is present
        if not (first_name and last_name and email and password):
            return JsonResponse({'message': 'Incomplete data'}, status=400)

        # Create a new user
        new_user = User.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,  # Note: Storing plain passwords is not secure; Use hashing (e.g., bcrypt) in production
            user_type=user_type
        )

        return JsonResponse({'message': 'User registered successfully'})
    
    # Handle other HTTP methods or invalid requests
    return JsonResponse({'message': 'Method not allowed'}, status=405)


def get_user_by_id(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        #user_data = serializers.serialize('json', [user, ])  # Serialize the user data to JSON

        data_json = {
            'name': user.first_name, 
            'last_name': user.last_name,
            'email': user.email,
            'id': user.id,
            
        }
        
        print("Data json: ", data_json)
        return JsonResponse({'user_data': data_json}, status=200)  # Return the user data in the response
        
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

        
def get_stations(request):
    if request.method == 'GET':
        print("ESTO ES GET STATIONS")
        stations = Station.objects.all()
        stations_info = []
        print("ESTO ES STATIONS: ", stations)
        for station in stations:
            lockers = Locker.objects.filter(station=station, reservation=None)
            lockers_info = []

            for locker in lockers:
                locker_info = {
                    'name' : locker.name,
                    'length': locker.length,
                    'width': locker.width,
                    'height': locker.height,
                    'state': locker.get_state_display()

                }
                lockers_info.append(locker_info)

            station_info = {
                'id': station.name,
                'lockers': lockers_info
            }
            stations_info.append(station_info)

        return JsonResponse({'stations': stations_info})
    return JsonResponse({'details': 'No data found'})


def get_all_stations(request):
    if request.method == 'GET':
        print("ESTO ES GET ALL STATIONS")
        stations = Station.objects.all()
        stations_info = []
        print("ESTO ES STATIONS: ", stations)
        for station in stations:
            lockers = Locker.objects.filter(station=station)
            lockers_info = []

            for locker in lockers:
                locker_info = {
                    'name' : locker.name,
                    'length': locker.length,
                    'width': locker.width,
                    'height': locker.height,
                    'state': locker.get_state_display()

                }
                lockers_info.append(locker_info)

            station_info = {
                'id': station.name,
                'lockers': lockers_info
            }
            stations_info.append(station_info)

        return JsonResponse({'stations': stations_info})
    return JsonResponse({'details': 'No data found'})

#1
def reserva_casillero(request):
    if request.method == 'POST':
        
        #Obtenemos los datos
        data = json.loads(request.body)
        ecommerce_name = data.get('ecommerce')
        key = data.get('key')
        station_name = data.get('station_name')
        #locker_id = data.get('locker_id')
        cliente = data.get('cliente')
        width = data.get('width')
        height = data.get('height')
        length = data.get('length')

        try:
           
            # Verificamos que exista el ecommerce
            ecommerce = Ecommerce.objects.get(name=ecommerce_name)
            print("ESTO ES ECOMMERCE KEY: ", ecommerce.key)
            if key != ecommerce.key: 
                return JsonResponse({'success': False, 'message': 'Invalid key/password'})
            
            # Verificamos si existe la estacion y locker
            station = Station.objects.get(name=station_name)
            #locker = Locker.objects.get(id=locker_id)
            available_lockers = Locker.objects.filter(station=station, reservation=None)

            # Verificamos que el locker este disponible
            if not available_lockers:
                return JsonResponse({'success': False, 'message': 'No lockers available'})

            #Verificamos que quepa en el locker
            for locker in available_lockers:
                if width <= locker.width and height <= locker.height and length <= locker.length:
                    print("ENTRA EN ESTE LOCKER: ", locker.id)
                    # Creamos la reserva
                    reservation = Reservation.objects.create(
                        ecommerce=ecommerce,
                        cliente=cliente,
                        cliente_password="cliente",
                    )
                    locker.reservation = reservation
                    locker.reservation.station = station.name
                    locker.save()
                    locker.reservation.save()
                    return JsonResponse({'success': True, 'message': f'Locker reserved successfully in locker {locker.name} with reservation id: {locker.reservation.identificador}'})
                    
            return JsonResponse({'success': False, 'message': 'Package does not fit in any locker'})

            
        #Excpeciones
        except Ecommerce.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Ecommerce does not exist'})
        except Station.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Station does not exist'})
        except Locker.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Locker does not exist or is not available'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'details': 'No data found'})

#2
def confirmar_reserva(request):

    if request.method == 'POST':
        
        #Obtenemos los datos
        data = json.loads(request.body)
        ecommerce_name = data.get('ecommerce')
        key = data.get('key')
        identificador = data.get('id')
        
        try:
            #Verificamos ecommerce
            ecommerce = Ecommerce.objects.get(name=ecommerce_name)
            print("ESTO ES ECOMMERCE KEY: ", ecommerce.key)
            if key != ecommerce.key: 
                return JsonResponse({'success': False, 'message': 'Invalid key/password'})    

            #Verificamos si existe la reserva
            reservation = Reservation.objects.get(identificador=identificador)

            #Verificamos estado del locker
            if reservation.state != 0:
                return JsonResponse({'success': False, 'message': 'Locker not reserved. Locker state: ' + str(reservation.state)})

            #Verificamos que el tiempo de reserva no haya expirado
            #El tiempo de reserva son 10 minutos
            MAX_TIME = 10
            if reservation.datetime + timedelta(minutes=MAX_TIME) < timezone.now():
                return JsonResponse({'success': False, 'message': 'Reservation time expired. Reservation max time: ' + str(MAX_TIME)})

            #Cambiamos el estado del locker
            reservation.state = 1
            reservation.horaConfirmacionReserva = timezone.now()
            reservation.save()
            return JsonResponse({'success': True, 'message': 'Reservation confirmed successfully'})

        except Reservation.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Reservation does not exist'})
        except Locker.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Locker does not exist'})
        except Station.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Station does not exist'})
        except Ecommerce.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Ecommerce does not exist'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    
#3
def confirmar_paquete(request):

    if request.method == 'POST':
        
        #Obtenemos los datos
        data = json.loads(request.body)
        ecommerce_name = data.get('ecommerce')
        key = data.get('key')
       
        operador = data.get('operador')
        width = data.get('width')
        height = data.get('height')
        length = data.get('length')
        identificador = data.get('id')
        try:
           
            # Verificamos que exista el ecommerce
            ecommerce = Ecommerce.objects.get(name=ecommerce_name)
            print("ESTO ES ECOMMERCE KEY: ", ecommerce.key)
            if key != ecommerce.key: 
                return JsonResponse({'success': False, 'message': 'Invalid key/password'})
            
            #Verificamos si existe la reserva
            reservation = Reservation.objects.get(identificador=identificador)

            #Verificamos que el locker este en estado 1
            if reservation.state != 1:
                return JsonResponse({'success': False, 'message': 'Locker not reserved. Locker state: ' + str(reservation.state)})

            #Verificamos dimensiones del locker
            if width > width or height > height or length > length:
                return JsonResponse({'success': False, 'message': 'Package does not fit in locker'})
                #Hacer logica para cambiar de locker

            # Cambiamos el estado del locker
            reservation.state = 2
            reservation.operador = operador
            #reservation.operador_password = "operador"
            reservation.operador_password = Reservation.generate_random_password()
            reservation.horaConfirmacionOperador = timezone.now()
            reservation.save()

            #Buscar locker que tenga una reserva con el identificador
            locker = Locker.objects.get(reservation=reservation)

            #Mandar mail
            body = f"""Escanear QR de la estacion.\n
                    Ingresar los siguientes datos:\n
                    Estacion: {locker.station.name}\n
                    Casillero: {locker.name}\n
                    Contrasena: {reservation.operador_password}\n
                    Mail: {reservation.operador}\n
                    Tipo de usuario: Operador

                    Una vez mandado los datos, el pestillo del casillero se abrira,
                    y podra dejar el paquete en el casillero.\n
                    Una vez dejado el paquete, CERRAR el casillero, y mantener la
                    puerta cerrada HASTA QUE SE CIERRE  EL PESTILLO (SERVO)
                    """
            MAIL.sendMails(reservation.operador, body)

            return JsonResponse({'success': True, 'message': 'Reservation confirmed: ' + str(reservation.identificador)})

            
            
        #Excpeciones
        except Ecommerce.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Ecommerce does not exist'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'details': 'No data found'})

#4
def cancelar_reserva(request):
    if request.method == 'POST':
        
        #Obtenemos los datos
        data = json.loads(request.body)
        ecommerce_name = data.get('ecommerce')
        key = data.get('key')
        identificador = data.get('id')


        try:
           
            # Verificamos que exista el ecommerce
            ecommerce = Ecommerce.objects.get(name=ecommerce_name)
            print("ESTO ES ECOMMERCE KEY: ", ecommerce.key)
            if key != ecommerce.key: 
                return JsonResponse({'success': False, 'message': 'Invalid key/password'})
            
            #Verificamos si existe la reserva
            reservation = Reservation.objects.get(identificador=identificador)

            #Cambiamos de estado la reserva a cancelado
            reservation.state = 3

            #Desasociamos el locker de la reserva
            reservation = None
            reservation.horaCancelacion = timezone.now()
            reservation.save()

            return JsonResponse({'success': True, 'message': 'Reservation cancelled successfully: ' + str(reservation.identificador)})

        #Excpeciones
        except Ecommerce.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Ecommerce does not exist'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'details': 'No data found'})

#5
def estado_reserva(request):
    if request.method == 'POST':
        
        #Obtenemos los datos
        data = json.loads(request.body)
        ecommerce_name = data.get('ecommerce')
        key = data.get('key')
        identificador = data.get('id')

        try:
           
            # Verificamos que exista el ecommerce
            ecommerce = Ecommerce.objects.get(name=ecommerce_name)
            print("ESTO ES ECOMMERCE KEY: ", ecommerce.key)
            if key != ecommerce.key: 
                return JsonResponse({'success': False, 'message': 'Invalid key/password'})
            
            #Verificamos si existe la reserva
            reservation = Reservation.objects.get(identificador=identificador)

            #Obtenemos json de la reserva
            data = {
                'id': reservation.identificador,
                'state': reservation.state,
                'ecommerce': reservation.ecommerce.name,
                'cliente': reservation.cliente,
                'operador': reservation.operador,
            }

            return JsonResponse({'success': True, 'message': data})
        #Excpeciones
        except Ecommerce.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Ecommerce does not exist'})
        except Station.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Station does not exist'})
        except Locker.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Locker does not exist or is not available'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'details': 'No data found'})

#6
def reservas_activas(request):
    if request.method == 'POST':
        
        #Obtenemos los datos
        data = json.loads(request.body)
        ecommerce_name = data.get('ecommerce')
        key = data.get('key')
        try:
           
            # Verificamos que exista el ecommerce
            ecommerce = Ecommerce.objects.get(name=ecommerce_name)
            print("ESTO ES ECOMMERCE KEY: ", ecommerce.key)
            if key != ecommerce.key: 
                return JsonResponse({'success': False, 'message': 'Invalid key/password'})
            
            #Obtenemos las reservas activas del ecommerce donde el estado sea distinto de 3 o 4
            reservations = Reservation.objects.filter(ecommerce=ecommerce).exclude(state=3).exclude(state=4)           
            
            
            # Construct JSON with reservation data
            data = {
                'reservations': [{
                    'id': reservation.identificador,
                    'datetime': reservation.datetime.strftime('%Y-%m-%d %H:%M:%S'),
                    'operador': reservation.operador,
                    'cliente': reservation.cliente,
                    'state': reservation.get_state_display()
                } for reservation in reservations]
            }

            return JsonResponse({'success': True, 'message': data})
        #Excpeciones
        except Ecommerce.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Ecommerce does not exist'})
        except Station.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Station does not exist'})
        except Locker.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Locker does not exist or is not available'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'details': 'No data found'})

#7
def reservas_historicas(request):
    if request.method == 'POST':
        
        #Obtenemos los datos
        data = json.loads(request.body)
        ecommerce_name = data.get('ecommerce')
        key = data.get('key')
        try:
        
            # Verificamos que exista el ecommerce
            ecommerce = Ecommerce.objects.get(name=ecommerce_name)
            print("ESTO ES ECOMMERCE KEY: ", ecommerce.key)
            if key != ecommerce.key: 
                return JsonResponse({'success': False, 'message': 'Invalid key/password'})
            
            #Obtenemos las reservas activas del ecommerce donde el estado sea distinto de 3 o 4
            reservations = Reservation.objects.filter(ecommerce=ecommerce).exclude(state=1).exclude(state=0).exclude(state=2)           
            
            # Construct JSON with reservation data
            data = {
                'reservations': [{
                    'id': reservation.identificador,
                    'datetime': reservation.datetime.strftime('%Y-%m-%d %H:%M:%S'),
                    'operador': reservation.operador,
                    'cliente': reservation.cliente,
                    'state': reservation.get_state_display()
                } for reservation in reservations]
            }

            return JsonResponse({'success': True, 'message': data})
        
        #Exceptions
        except Ecommerce.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Ecommerce does not exist'})
        except Station.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Station does not exist'})
        except Locker.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Locker does not exist or is not available'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'details': 'No data found'})


def operador_abre(request):

    if request.method == 'POST':
        
        #Obtenemos los datos
        data = json.loads(request.body)
        usuario_clave = data.get('usuario_clave')
        station_name = data.get('station_name')
        locker_name = int(data.get('locker_name'))
        usuario = data.get('usuario')


        try:
           
            # Verificamos si existe la estacion y locker
            station = Station.objects.get(name=station_name)
            #Buscar locker con el nombre de la estacion y nombre del locker
            locker = Locker.objects.get(name=locker_name, station=station)  # Use .first() to get a single object
            print("ESTO ES LOCKER: ", locker)
            available_lockers = Locker.objects.filter(station=station, reservation=None)

            #Verificamos que el locker este en estado 1
            if locker.reservation.state != 2:
                return JsonResponse({'success': False, 'message': 'Locker not in correct state. Locker state: ' + str(locker.reservation.state)})

            if usuario_clave != locker.reservation.operador_password:
                return JsonResponse({'success': False, 'message': 'Invalid key/password'})
            if usuario != locker.reservation.operador:
                return JsonResponse({'success': False, 'message': 'Invalid operator'})
            

            #Abrir locker
            load(station_name,locker_name)
            print("SE MANDO EL LOAD")
            locker.reservation.cliente_password = Reservation.generate_random_password()
            locker.reservation.horaCarga = timezone.now()
            locker.reservation.save()
            #Mandar mail
            body = f"""Escanear QR de la estacion.\n
                    Ingresar los siguientes datos:\n
                    Estacion: {locker.station.name}\n
                    Casillero: {locker.name}\n
                    Contrasena: {locker.reservation.cliente_password}\n
                    Mail: {locker.reservation.cliente}\n
                    Tipo de usuario: Cliente

                    Una vez mandado los datos, el pestillo del casillero se abrira,
                    y podra dejar el paquete en el casillero.\n
                    Una vez dejado el paquete, CERRAR el casillero, y MANTENER la
                    puerta cerrada HASTA que se cierre el pestillo
                    """
            MAIL.sendMails(locker.reservation.cliente, body)
            locker.reservation.operador = 'xxxxxxxx'
            locker.reservation.save()
            return JsonResponse({'success': True, 'message': ' Operador abriendo locker ' + str(locker_name)})

            
            
        #Excpeciones
        except Ecommerce.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Ecommerce does not exist'})
        except Station.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Station does not exist'})
        except Locker.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Locker does not exist or is not available'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'details': 'No data found'})


def cliente_abre(request):

    if request.method == 'POST':
        
        #Obtenemos los datos
        data = json.loads(request.body)
        usuario_clave = data.get('usuario_clave')
        station_name = data.get('station_name')
        locker_name = int(data.get('locker_name'))
        usuario = data.get('usuario')


        try:
            
            # Verificamos si existe la estacion y locker
            station = Station.objects.get(name=station_name)
            locker = Locker.objects.get(name=locker_name,station=station)
            print("ESTO ES LOCKER: ", locker)
            available_lockers = Locker.objects.filter(station=station, reservation=None)

            #Verificamos que el locker este en estado 1
            if locker.reservation.state != 2:
                return JsonResponse({'success': False, 'message': 'Locker not in correct state. Locker state: ' + str(locker.reservation.state)})

            if usuario_clave != locker.reservation.cliente_password:
                return JsonResponse({'success': False, 'message': 'Invalid key/password'})
            if usuario != locker.reservation.cliente:
                return JsonResponse({'success': False, 'message': 'Invalid operator'})
            
            #Abrir locker
            unload(station_name, locker_name)

            locker.reservation.horaDescarga = timezone.now()
            locker.reservation.horaFinalizacion = timezone.now()
            locker.reservation.state = 4
            locker.reservation.cliente = 'xxxxxxxx'
            locker.reservation.save()
            locker.reservation = None
            locker.save()
            
            return JsonResponse({'success': True, 'message': 'Reservation confirmed successfully in locker ' + str(locker_name)})

            
            
        #Excpeciones
        except Ecommerce.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Ecommerce does not exist'})
        except Station.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Station does not exist'})
        except Locker.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Locker does not exist or is not available'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'details': 'No data found'})


def dashboard2(request):
     if request.method == 'GET':
        stations = Station.objects.all()
        station_data = []
        stations_names = []

        all_data = []


        for s in stations:
            stations_names.append(s.name)
        
        ready = False
        start_time = time.time()  # Start the timer
        elapsed = 17
        while not ready:
            # If more than 20 seconds have passed, break the loop
            if time.time() - start_time > elapsed:
                break
            time.sleep(1)
            #Si la lista esta vacia, no hay mensajes
            if received_messages:
                json_message = json.loads(received_messages[-1])
                station_name = json_message['station_name']
                if station_name in stations_names:
                    #Remove that name from stations_names
                    stations_names.remove(station_name)
                    station_info = {
                        'station': {
                            'name': station_name,
                            'lockers': []
                        }
                    }

                    for lockers in json_message['lockers']:
                        station = Station.objects.get(name=station_name)
                        #Chequeamos si el locker existe en la estacion
                        print(Locker.objects.filter(station=station, name=lockers['nickname']))
                        locker = Locker.objects.filter(station=station, name=lockers['nickname']).first()  # Use .first() to get a single object
                        lockerss = Locker.objects.filter(station=station)
                        print("ESTOS SON LOS LOCKER DE LA ESTACION: ", lockerss)
                        print("ESTE ES EL STATIONS NAME: ", station_name)
                        size = lockers['size']
                        height, width, length = map(int, size.split('x'))
                        print("ESTE ES EL LOCKER: ", locker)
                        if locker:
                            locker_info = {
                                'locker': {
                                    'name': lockers['nickname'],
                                    'length': length,
                                    'width': width,
                                    'height': height,
                                    'state': lockers['state'],
                                    'reservation': None,
                                    'is_open': lockers['is_open'],
                                    'is_empty': lockers['is_empty'],
                                    'state': lockers['state'],
                                    
                                }
                            }
                            
                        if locker.reservation:
                            reservation_info = {
                                'reservation': {
                                    'id': locker.reservation.identificador,
                                    'operador': locker.reservation.operador,
                                    'cliente': locker.reservation.cliente,
                                    'state': locker.reservation.get_state_display(),
                                    'datetime': locker.reservation.datetime.strftime('%Y-%m-%d %H:%M:%S') if locker.reservation.datetime else None,
                                    'horaConfirmacionReserva': locker.reservation.horaConfirmacionReserva.strftime('%Y-%m-%d %H:%M:%S') if locker.reservation.horaConfirmacionReserva else None,
                                    'horaConfirmacionOperador': locker.reservation.horaConfirmacionOperador.strftime('%Y-%m-%d %H:%M:%S') if locker.reservation.horaConfirmacionOperador else None,
                                    'horaCarga': locker.reservation.horaCarga.strftime('%Y-%m-%d %H:%M:%S') if locker.reservation.horaCarga else None,
                                    'horaDescarga': locker.reservation.horaDescarga.strftime('%Y-%m-%d %H:%M:%S') if locker.reservation.horaDescarga else None,
                                    'horaFinalizacion': locker.reservation.horaFinalizacion.strftime('%Y-%m-%d %H:%M:%S') if locker.reservation.horaFinalizacion else None,
                                    'horaCancelacion': locker.reservation.horaCancelacion.strftime('%Y-%m-%d %H:%M:%S') if locker.reservation.horaCancelacion else None,
                                }
                            }
                            locker_info['locker']['reservation'] = reservation_info['reservation']
                    
                        station_info['station']['lockers'].append(locker_info['locker'])
                        station_data.append(station_info)
            else:
                print("There are no messages")    
                
            if len(stations_names) == 0:
                ready = True
                return JsonResponse({'data': station_data})
            
        return JsonResponse({'data': station_data})
     

def get_stations_info(request):
    if request.method == 'GET':
        # Obtener todas las estaciones y sus datos básicos
        stations = Station.objects.all()
        station_info = []

        for station in stations:
            station_info.append({
                'name': station.name,
                'conexion': station.conexion,
                'id': station.id
            })

        return JsonResponse({'station_info': station_info})
    

#CRUD de estaciones
def create_station(request):
    if request.method == 'POST':
        # Obtener los datos de la estación
        data = json.loads(request.body)
        name = data.get('name')
        #conexion = data.get('conexion')

        # Crear la estación
        new_station = Station.objects.create(
            name=name,
        )

        return JsonResponse({'message': 'Station created successfully'})
    
    # Handle other HTTP methods or invalid requests
    return JsonResponse({'message': 'Method not allowed'}, status=405)

#CRUD de casilleros
def create_locker(request):
    if request.method == 'POST':
        # Obtener los datos del casillero
        data = json.loads(request.body)
        name = data.get('name')
        length = data.get('length')
        width = data.get('width')
        height = data.get('height')
        station_name = data.get('station_name')

        try:
            station = Station.objects.get(name=station_name)
            existing_locker = Locker.objects.get(name=name, station=station)
            return JsonResponse({'message': 'Ya existe un casillero con este nombre en esta estación'}, status=400)
        except Locker.DoesNotExist:
            # Si no hay un casillero con el mismo nombre, crear uno nuevo
            new_locker = Locker.objects.create(
                name=name,
                length=length,
                width=width,
                height=height,
                station=station
            )
            return JsonResponse({'message': 'Casillero creado correctamente'}, status=201)
    # Handle other HTTP methods or invalid requests
    return JsonResponse({'message': 'Method not allowed'}, status=405)

#CRUD de ecommerce
def create_ecommerce(request):
    if request.method == 'POST':
        # Obtener los datos del ecommerce
        data = json.loads(request.body)
        name = data.get('name')
        key = data.get('key')

        # Crear el ecommerce
        new_ecommerce = Ecommerce.objects.create(
            name=name,
            key=key
        )

        return JsonResponse({'message': 'Ecommerce created successfully'})
    
    # Handle other HTTP methods or invalid requests
    return JsonResponse({'message': 'Method not allowed'}, status=405)

def delete_ecommerce(request):
    if request.method == 'POST':
        # Obtener los datos del ecommerce
        data = json.loads(request.body)
        name = data.get('name')

        #Eliminar el ecommerce
        ecommerce = Ecommerce.objects.get(name=name)
        ecommerce.delete()


        return JsonResponse({'message': 'Ecommerce deleted successfully'})
    
    # Handle other HTTP methods or invalid requests
    return JsonResponse({'message': 'Method not allowed'}, status=405)

def edit_ecommerce(request):
    if request.method == 'POST':
        # Obtener los datos del ecommerce
        data = json.loads(request.body)
        name = data.get('name')
        new_name = data.get('new_name')
        new_key = data.get('key')

        #Editar el ecommerce
        ecommerce = Ecommerce.objects.get(name=name)
        ecommerce.key = new_key
        ecommerce.name = new_name
        ecommerce.save()


        return JsonResponse({'message': 'Ecommerce edited successfully with name: ' + name + ' and key: ' + new_key})
    
    # Handle other HTTP methods or invalid requests
    return JsonResponse({'message': 'Method not allowed'}, status=405)

def get_all_ecommerce(request):
    if request.method == 'GET':
        # Obtener todas los ecommerce y sus datos básicos
        ecommerce = Ecommerce.objects.all()
        ecommerce_info = []

        for ecommerce in ecommerce:
            ecommerce_info.append({
                'name': ecommerce.name,
                'key': ecommerce.key,
            })

        return JsonResponse({'ecommerce_info': ecommerce_info})
    
    # Handle other HTTP methods or invalid requests
    return JsonResponse({'message': 'Method not allowed'}, status=405)


def get_reservations_of_ecommerce(request):
    if request.method == 'POST':
        # Obtener los datos del ecommerce
        data = json.loads(request.body)
        print("ESTO ES DATA: ", data)
        name = data.get('name')
        # key = data.get('key')

        try:
            #Buscar reservas del ecommerce
            ecommerce = Ecommerce.objects.get(name=name)
            reservations = Reservation.objects.filter(ecommerce=ecommerce)
            reservations_json = {
                'reservations': [{
                    'id': reservation.identificador,
                    'operador': reservation.operador,
                    'cliente': reservation.cliente,
                    'state': reservation.get_state_display(),
                    'datetime': reservation.datetime.strftime('%Y-%m-%d %H:%M:%S') if reservation.datetime else None,
                    'horaConfirmacionReserva': reservation.horaConfirmacionReserva.strftime('%Y-%m-%d %H:%M:%S') if reservation.horaConfirmacionReserva else None,
                    'horaConfirmacionOperador': reservation.horaConfirmacionOperador.strftime('%Y-%m-%d %H:%M:%S') if reservation.horaConfirmacionOperador else None,
                    'horaCarga': reservation.horaCarga.strftime('%Y-%m-%d %H:%M:%S') if reservation.horaCarga else None,
                    'horaDescarga': reservation.horaDescarga.strftime('%Y-%m-%d %H:%M:%S') if reservation.horaDescarga else None,
                    'horaFinalizacion': reservation.horaFinalizacion.strftime('%Y-%m-%d %H:%M:%S') if reservation.horaFinalizacion else None,
                    'horaCancelacion': reservation.horaCancelacion.strftime('%Y-%m-%d %H:%M:%S') if reservation.horaCancelacion else None,
                } for reservation in reservations]
            }
        except Ecommerce.DoesNotExist:
            return JsonResponse({'message': 'Ecommerce does not exist'}, status=404)

        return JsonResponse({'message': 'Info of reservations of ecommerce', 'data': reservations_json})

    # Handle other HTTP methods or invalid requests
    return JsonResponse({'message': 'Method not allowed'}, status=405)



def subscribe_mqtt(request):
    if request.method == 'GET':
            mqtt_subscribe('status')
            while received_messages == []:
                print('WAITING')
                time.sleep(3)

            json_message = json.loads(received_messages[-1])
            print("ESTE ES EL JSON",json_message)
           
            return JsonResponse({'details': json_message})


def mqtt_ask(request):
    if request.method == 'GET':
        
        json_message = json.loads(received_messages[-1])
        print("ESTE ES EL JSON",json_message)
        return JsonResponse({'details': json_message})

def locker_list(request):
    if request.method == 'GET':
        lockers = Locker.objects.all()
        lockers_list = []

        for locker in lockers:
            locker_dict = {
                'id': locker.id,
                'name': locker.name,
                'state': locker.get_state_display(),
                'length': locker.length,
                'width': locker.width,
                'height': locker.height
            }
            lockers_list.append(locker_dict)

        return JsonResponse(lockers_list, safe=False)

    return JsonResponse({"message": "Method not allowed"}, status=405)

def delete_locker(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            locker_id = data.get('locker_id')
            locker = Locker.objects.get(id=locker_id)

            # Obtén la reserva asociada al casillero
            reservation = locker.reservation
            #print(locker.reservation.state)
            if reservation:
                # Cambia el estado de la reserva a "Cancelado"
                reservation.state = 3
                reservation.save()

            locker.delete()
            return JsonResponse({'message': 'Locker deleted successfully'})
        except Locker.DoesNotExist:
            return JsonResponse({'message': 'Locker not found'}, status=404)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)
    
def edit_locker(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            locker_id = data.get('locker_id')
            print('HOLAA')
            locker = Locker.objects.get(id=locker_id)
            name = data.get('name')
            length = data.get('length')
            width = data.get('width')
            height = data.get('height')
            locker.name = name
            locker.length = length
            locker.width = width
            locker.height = height
            locker.save()

            return JsonResponse({'message': 'Locker edited successfully'})
    except Locker.DoesNotExist:
        return JsonResponse({'message': 'Locker not found'}, status=404)
    except Exception as e:
        return JsonResponse({'message': f'Error editing locker: {str(e)}'}, status=500)

def delete_station(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            station_id = data.get('station_id')
            station = Station.objects.get(id=station_id)
            station.delete()
            return JsonResponse({'message': 'Station deleted successfully'})
        except Locker.DoesNotExist:
            return JsonResponse({'message': 'Station not found'}, status=404)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)
    
def edit_station(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            station_id = data.get('station_id')
            station = Station.objects.get(id=station_id)
            name = data.get('name')
            station.name = name
            station.save()

            return JsonResponse({'message': 'Station edited successfully'})
    except Locker.DoesNotExist:
        return JsonResponse({'message': 'Station not found'}, status=404)
    except Exception as e:
        return JsonResponse({'message': f'Error editing locker: {str(e)}'}, status=500)
    

def reservas_historicas_estacion(request):
    if request.method == 'POST': 
            
        data = json.loads(request.body)
        station_name = data.get('station_name')

        try:
            station = Station.objects.get(name=station_name)
            lockers = Locker.objects.filter(station=station)
            json_reservations = {}
            #Todas las reservas:
            reservas = Reservation.objects.all()

            for reserva in reservas:
                if reserva.station == station_name:
                    
                    json_reservations[reserva.identificador] = {
                        'datetime': reserva.datetime.strftime('%Y-%m-%d %H:%M:%S'),
                        'operador': reserva.operador,
                        'station': reserva.station,
                        'cliente': reserva.cliente,
                        'state': reserva.get_state_display(),
                        'horaConfirmacionReserva': reserva.horaConfirmacionReserva.strftime('%Y-%m-%d %H:%M:%S') if reserva.horaConfirmacionReserva else None,
                        'horaConfirmacionOperador': reserva.horaConfirmacionOperador.strftime('%Y-%m-%d %H:%M:%S') if reserva.horaConfirmacionOperador else None,
                        'horaCarga': reserva.horaCarga.strftime('%Y-%m-%d %H:%M:%S') if reserva.horaCarga else None,
                        'horaDescarga': reserva.horaDescarga.strftime('%Y-%m-%d %H:%M:%S') if reserva.horaDescarga else None,
                        'horaFinalizacion': reserva.horaFinalizacion.strftime('%Y-%m-%d %H:%M:%S') if reserva.horaFinalizacion else None,
                        'horaCancelacion': reserva.horaCancelacion.strftime('%Y-%m-%d %H:%M:%S') if reserva.horaCancelacion else None,
                    }
            return JsonResponse(json_reservations, status=200)
           

        except Station.DoesNotExist:
            return JsonResponse({'message': 'Station not found'}, status=404)



from django.middleware.csrf import get_token

def set_csrf_token(request):
    get_token(request)
    return JsonResponse({'detail': 'CSRF cookie set'})