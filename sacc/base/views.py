from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from .models import User
from .models import Ecommerce
from .models import Reservation
from .models import Locker
from .models import Station

import json
from django.core import serializers

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
                    'id': locker.id,
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


def reserva_casillero(request):
    if request.method == 'POST':
        
        #Obtenemos los datos
        data = json.loads(request.body)
        ecommerce_name = data.get('ecommerce')
        key = data.get('key')
        station_name = data.get('station_name')
        locker_id = data.get('locker_id')
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
            locker = Locker.objects.get(id=locker_id)
            available_lockers = Locker.objects.filter(station=station, reservation=None)

            # Verificamos que el locker este disponible
            if locker not in available_lockers:
                return JsonResponse({'success': False, 'message': 'Locker not available'})

            #Verificamos que quepa en el locker
            if width > locker.width or height > locker.height or length > locker.length:
                return JsonResponse({'success': False, 'message': 'Package does not fit in locker'})

            # Creamos la reserva
            reservation = Reservation.objects.create(
                ecommerce=ecommerce,
                cliente=cliente,
                cliente_password="cliente",
            )
            locker.reservation = reservation
            locker.save()

            return JsonResponse({'success': True, 'message': f'Locker reserved successfully in locker {locker_id}'})
        
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


def confirmar_reserva(request):

    if request.method == 'POST':
        
        #Obtenemos los datos
        data = json.loads(request.body)
        ecommerce_name = data.get('ecommerce')
        key = data.get('key')
        station_name = data.get('station_name')
        locker_id = data.get('locker_id')

        
        try:
            #Verificamos ecommerce
            ecommerce = Ecommerce.objects.get(name=ecommerce_name)
            print("ESTO ES ECOMMERCE KEY: ", ecommerce.key)
            if key != ecommerce.key: 
                return JsonResponse({'success': False, 'message': 'Invalid key/password'})    

            #Verificamos que exista la estacion y locker
            station = Station.objects.get(name=station_name)
            locker = Locker.objects.get(id=locker_id)
            
            #Verificamos estado del locker
            if locker.reservation.state != 0:
                return JsonResponse({'success': False, 'message': 'Locker not reserved. Locker state: ' + str(locker.reservation.state)})

            #Cambiamos el estado del locker
            locker.reservation.state = 1
            locker.reservation.save()
            locker.save()
            return JsonResponse({'success': True, 'message': 'Reservation confirmed successfully'})

        except Locker.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Locker does not exist'})
        except Station.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Station does not exist'})
        except Ecommerce.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Ecommerce does not exist'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    

def confirmar_paquete(request):

    if request.method == 'POST':
        
        #Obtenemos los datos
        data = json.loads(request.body)
        ecommerce_name = data.get('ecommerce')
        key = data.get('key')
        station_name = data.get('station_name')
        locker_id = data.get('locker_id')
        operador = data.get('operador')
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
            locker = Locker.objects.get(id=locker_id)
            available_lockers = Locker.objects.filter(station=station, reservation=None)

            #Verificamos que el locker este en estado 1
            if locker.reservation.state != 1:
                return JsonResponse({'success': False, 'message': 'Locker not reserved. Locker state: ' + str(locker.reservation.state)})

            #Verificamos dimensiones del locker
            if width > locker.width or height > locker.height or length > locker.length:
                return JsonResponse({'success': False, 'message': 'Package does not fit in locker'})
                #Hacer logica para cambiar de locker

            # Cambiamos el estado del locker
            locker.reservation.state = 2
            locker.reservation.operador = operador
            locker.reservation.operador_password = "operador"
            locker.reservation.save()
            locker.save()
            return JsonResponse({'success': True, 'message': 'Reservation confirmed successfully in locker ' + str(locker_id)})

            
            
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


def cancelar_reserva(request):
    if request.method == 'POST':
        
        #Obtenemos los datos
        data = json.loads(request.body)
        ecommerce_name = data.get('ecommerce')
        key = data.get('key')
        station_name = data.get('station_name')
        locker_id = data.get('locker_id')


        try:
           
            # Verificamos que exista el ecommerce
            ecommerce = Ecommerce.objects.get(name=ecommerce_name)
            print("ESTO ES ECOMMERCE KEY: ", ecommerce.key)
            if key != ecommerce.key: 
                return JsonResponse({'success': False, 'message': 'Invalid key/password'})
            
            # Verificamos si existe la estacion y locker
            station = Station.objects.get(name=station_name)
            locker = Locker.objects.get(id=locker_id)
            
            #Cambiamos de estado la reserva a cancelado
            locker.reservation.state = 3

            #Desasociamos el locker de la reserva
            locker.reservation = None
            locker.reservation.save()
            locker.save()
            return JsonResponse({'success': True, 'message': 'Reservation cancelled successfully in locker ' + str(locker_id)})

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

def estado_reserva(request):
    if request.method == 'POST':
        
        #Obtenemos los datos
        data = json.loads(request.body)
        ecommerce_name = data.get('ecommerce')
        key = data.get('key')
        station_name = data.get('station_name')
        locker_id = data.get('locker_id')


        try:
           
            # Verificamos que exista el ecommerce
            ecommerce = Ecommerce.objects.get(name=ecommerce_name)
            print("ESTO ES ECOMMERCE KEY: ", ecommerce.key)
            if key != ecommerce.key: 
                return JsonResponse({'success': False, 'message': 'Invalid key/password'})
            
            # Verificamos si existe la estacion y locker
            station = Station.objects.get(name=station_name)
            locker = Locker.objects.get(id=locker_id)
            
            #Obtenemos json de la reserva
            data = {
                'id': locker.reservation.id,
                'state': locker.reservation.state,
                'ecommerce': locker.reservation.ecommerce.name,
                'cliente': locker.reservation.cliente,
                'operador': locker.reservation.operador,
                'locker': locker.id
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
                    'id': reservation.id,
                    'name': reservation.name,
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
                    'id': reservation.id,
                    'name': reservation.name,
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
