# Generated by Django 4.1.3 on 2023-11-27 16:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0011_reservation_horacancelacion_reservation_horacarga_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='identificador',
            field=models.IntegerField(default=22878, editable=False),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='horaCancelacion',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='horaCarga',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='horaConfirmacionOperador',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='horaConfirmacionReserva',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='horaDescarga',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='horaFinalizacion',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]