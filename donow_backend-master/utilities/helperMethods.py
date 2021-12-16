import os
import time
from django.core.mail import EmailMessage
from utilities.tokens import account_activation_token
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.urls import reverse



def sendActivationEmail(user):
    to_email = user.email
    email_body = {
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': account_activation_token.make_token(user),
    }

    link = reverse('activate', kwargs={
        'uidb64': email_body['uid'], 'token': email_body['token']})

    email_subject = 'Activate your DoNow account'

    activate_url = 'http://' + "donow.com:8000" + link

    email = EmailMessage(
        email_subject,
        'Hi ' + user.username + ', Please click the link below to activate your account \n' + activate_url,
        from_email='noreply@donow.com',
        to=[to_email],
    )
    email.send(fail_silently=False)

def removeFiles(paths):
    time.sleep(10)
    for p in paths:
        try:
            os.remove(p)
            print("file deleted")
        except OSError as e:  ## if failed, report it back to the user ##
                print("Error: %s - %s." % (e.filename, e.strerror))

