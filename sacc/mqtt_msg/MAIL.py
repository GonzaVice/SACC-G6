# import smtplib
# from decouple import config

# def sendMails(to_address, body):
#     message = body
#     subject = "SACC-G6"

#     message = "Subject: {}\n\n{}".format(subject, message)
#     server = smtplib.SMTP('smtp.gmail.com', 587)
#     server.starttls()
#     server.login("givicente@miuandes.cl", "")

#     server.sendmail("eljoseq@gmail.com", to_address, message)

#     server.quit()

#     print("Email sent successfully to %s:" % (message))

