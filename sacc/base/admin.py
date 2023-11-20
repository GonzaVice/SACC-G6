from django.contrib import admin
from .models import User, Reservation, Station, Locker
# Register your models here.

admin.site.register(User)
admin.site.register(Reservation)
admin.site.register(Station)
admin.site.register(Locker)
