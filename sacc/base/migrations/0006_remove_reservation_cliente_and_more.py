# Generated by Django 4.1.3 on 2023-11-20 20:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_reservation_cliente_reservation_operador'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reservation',
            name='cliente',
        ),
        migrations.RemoveField(
            model_name='reservation',
            name='operador',
        ),
    ]