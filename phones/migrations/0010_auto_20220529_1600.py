# Generated by Django 3.2.13 on 2022-05-29 16:00

from django.db import migrations, models
import phones.models


class Migration(migrations.Migration):

    dependencies = [
        ('phones', '0009_realphone_verification_sent_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='realphone',
            name='number',
            field=models.CharField(max_length=15),
        ),
        migrations.AlterField(
            model_name='realphone',
            name='verification_code',
            field=models.CharField(default=phones.models.verification_code_default, max_length=8),
        ),
    ]
