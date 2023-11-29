import smtplib
from decouple import config

def sendMails(to_address, body):
    message = body
    subject = "SACC-G6"

    message = "Subject: {}\n\n{}".format(subject, message)
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login("givicente@miuandes.cl", "AlteredPassKey42!")

    server.sendmail("givicente@miuandes.cl", to_address, message)

    server.quit()

    print("Email sent successfully to %s:" % (message))

#sendMails('djgonzalez1@miuandes.cl', "asdjk")
# message = "MAILLLL"
# subject = "SACC-G6"

# message = "Subject: {}\n\n{}".format(subject, message)
# server = smtplib.SMTP('smtp.gmail.com', 587)
# server.starttls()
# server.login("jtqueirolo@miuandes.cl", "Flaco2205*")

# server.sendmail("jtqueirolo@miuandes.cl", "jtqueirolo@miuandes.cl", message)

# server.quit()

# print("Email sent successfully to %s:" % (message))

# sendMails("givicente@miuandes.cl", "PRUEBA DE RESERVA")