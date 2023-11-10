import time
import paho.mqtt.client as mqtt
import ssl

# Configuración del servidor HiveMQ
mqtt_broker = "86718d4d31714885a63c85b39185fb86.s1.eu.hivemq.cloud"
mqtt_port = 8883
mqtt_username = "KaijuRex"
mqtt_password = "Qwerty123"

def on_connect(client, userdata, flags, rc):
    print(f"Conectado al servidor MQTT con resultado: {rc}")

def on_message(client, userdata, msg):
    print(f"Mensaje recibido en el topic {msg.topic}: {msg.payload.decode('utf-8')}")

def mqtt_connect_and_publish(topic, message):
    client = mqtt.Client()
    client.username_pw_set(username=mqtt_username, password=mqtt_password)
    
    ssl_context = ssl.create_default_context()
    ssl_context.set_ciphers('DEFAULT@SECLEVEL=1')

    client.on_connect = on_connect

    client.tls_set_context(context=ssl_context)
    client.connect(mqtt_broker, mqtt_port, 60)

    client.loop_start()

    client.publish(topic, message)

    time.sleep(2)

    client.loop_stop()
    client.disconnect()

def mqtt_subscribe(topic):
    client = mqtt.Client()
    client.username_pw_set(username=mqtt_username, password=mqtt_password)
    
    ssl_context = ssl.create_default_context()
    ssl_context.set_ciphers('DEFAULT@SECLEVEL=1')

    client.on_connect = on_connect
    client.on_message = on_message

    client.tls_set_context(context=ssl_context)
    client.connect(mqtt_broker, mqtt_port, 60)

    client.subscribe(topic)
    client.loop_start()