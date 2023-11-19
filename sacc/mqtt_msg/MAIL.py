import smtplib
from decouple import config

def sendMails(to_address, body):
    message = body
    subject = "SACC-G6"

    message = "Subject: {}\n\n{}".format(subject, message)
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login("jtqueirolo@miuandes.cl", "Flaco2205*")

    server.sendmail("jtqueirolo@miuandes.cl", to_address, message)

    server.quit()

    print("Email sent successfully to %s:" % (message))

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