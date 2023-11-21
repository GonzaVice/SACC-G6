# Generated by Django 4.2.6 on 2023-11-21 19:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_remove_reservation_user_reservation_users'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ecommerce',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('key', models.CharField(max_length=100)),
            ],
        ),
        migrations.RenameField(
            model_name='reservation',
            old_name='description',
            new_name='name',
        ),
        migrations.RemoveField(
            model_name='reservation',
            name='users',
        ),
        migrations.AddField(
            model_name='reservation',
            name='cliente',
            field=models.CharField(default='ValorPorDefecto', max_length=200),
        ),
        migrations.AddField(
            model_name='reservation',
            name='cliente_password',
            field=models.CharField(default='ValorPorDefectoPassword', max_length=200),
        ),
        migrations.AddField(
            model_name='reservation',
            name='operador',
            field=models.CharField(default='ValorPorDefecto', max_length=200),
        ),
        migrations.AddField(
            model_name='reservation',
            name='operador_password',
            field=models.CharField(default='ValorPorDefecto', max_length=200),
        ),
        migrations.AddField(
            model_name='reservation',
            name='ecommerce',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reservations', to='base.ecommerce'),
        ),
    ]
