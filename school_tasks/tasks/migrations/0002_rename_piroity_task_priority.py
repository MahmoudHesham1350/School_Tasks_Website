# Generated by Django 5.2.1 on 2025-05-15 09:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='piroity',
            new_name='priority',
        ),
    ]
