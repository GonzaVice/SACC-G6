# SACC-G6

Este es el sistema de administación central de casilleros. que maneja las estaciones de casilleros.

Pasos para instalar:

1. Crear una variable de entorno:

```
python -m venv env
```

2. Activar la variable de entorno:

En Windows y CMD:

```
env\Scripts\activate.bat
```

En Windows y Powershell:
i. Cambiar la política de ejecución de PowerShell

```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

ii. Activar la variable de entorno

```
env\Scripts\Activate
```

En MacOS o Linux:

```
source env/bin/activate
```

Para desactivar:

```
deactivate
```

3. Instalar los requierements:

```
pip install -r requirements.txt
```

4. Correr la aplicación:

```
python manage.py runserver
```
