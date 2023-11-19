import smtplib
from decouple import config

message = "MAILLLL"
subject = "SACC-G6"

message = "Subject: {}\n\n{}".format(subject, message)
server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login("jtqueirolo@miuandes.cl", "")

server.sendmail("jtqueirolo@miuandes.cl", "jtqueirolo@miuandes.cl", message)

server.quit()

print("Email sent successfully to %s:" % (message))