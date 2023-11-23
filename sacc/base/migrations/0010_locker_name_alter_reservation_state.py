# Generated by Django 4.1.3 on 2023-11-23 20:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_remove_station_state_remove_user_user_type_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='locker',
            name='name',
            field=models.CharField(default='null', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='reservation',
            name='state',
            field=models.IntegerField(choices=[(0, 'Reservado'), (1, 'Confirmado_Reserva'), (2, 'Confirmado_OP'), (3, 'Cancelado'), (4, 'Finalizado')], default=0),
        ),
    ]
