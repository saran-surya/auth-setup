import smtplib
import ssl
import email
import sys
import os
from pathlib import Path

OrgMail = sys.argv[1]
OrgPass = sys.argv[2]
port = 587

server = smtplib.SMTP('smtp.gmail.com', port)
server.starttls()
try:
  server.login(OrgMail, OrgPass)
  print("login success ~ python server")
except smtplib.SMTPAuthenticationError or smtplib.SMTPException:
  print("Server error cannot login ~ python server")
finally:
  server.quit()
  sys.exit(0)