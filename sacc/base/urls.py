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

]
