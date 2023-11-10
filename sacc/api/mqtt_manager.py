import paho.mqtt.client as mqtt
import ssl

class MQTTManager:
    def __init__(self, server, port, user, password, client_id):
        self.server = server
        self.port = port
        self.user = user
        self.password = password
        self.client_id = client_id

        # Configuración del contexto SSL/TLS
        self.ssl_context = ssl.create_default_context()
        self.ssl_context.set_ciphers('DEFAULT@SECLEVEL=1')  # Ajuste necesario para evitar errores de conexión

        # Configuración del cliente MQTT con TLS
        self.client = mqtt.Client(client_id=client_id)
        self.client.username_pw_set(user, password)

        # Asigna las funciones de conexión y mensaje
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

        # Conéctate al servidor MQTT con TLS
        self.client.tls_set_context(context=self.ssl_context)
        self.client.connect(server, port, 60)

        # Inicia el bucle para mantener la conexión activa
        self.client.loop_start()

    def on_connect(self, client, userdata, flags, rc):
        print(f"Conectado al servidor MQTT con resultado: {rc}")

    def on_message(self, client, userdata, msg):
        print(f"Mensaje recibido en el topic {msg.topic}: {msg.payload.decode('utf-8')}")

    def publish(self, topic, message):
        # Publica un mensaje en el topic especificado
        self.client.publish(topic, message)

    def subscribe(self, topic):
        # Suscríbete al topic especificado
        self.client.subscribe(topic)

    def loop_forever(self):
        # Mantén el bucle activo (útil si necesitas suscripciones)
        self.client.loop_forever()

    def disconnect(self):
        # Detén el bucle y desconéctate del servidor MQTT
        self.client.loop_stop()
        self.client.disconnect()