from django.urls import path
from .views import publish_message, receive_message, send_reservation_message, send_load_message, send_unload_message, email, details

urlpatterns = [
    path('publish/', publish_message, name='publish_message'),
    path('receive/', receive_message, name='receive_message'),
    path('reservation-message/', send_reservation_message, name='send_reservation_message'),
    path('load-message/', send_load_message, name='send_load_message'),
    path('unload-message/', send_unload_message, name='send_unload_message'),
    path('email/', email, name='email'),
    path('details/',details, name='details'),
]