# Generated by Django 3.0.8 on 2020-08-12 08:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='details',
            name='profile_image',
            field=models.ImageField(null=True, upload_to='E:\\Freelancing\\fiverr_20-7-2020\\donow_backend\\media\\profile_images'),
        ),
    ]
