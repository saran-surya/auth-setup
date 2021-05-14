import smtplib
import ssl
import email
import sys
import dotenv
import os

from pathlib import Path
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText



toMail = sys.argv[1]
otp = sys.argv[2]
CompanyName = sys.argv[3]
OrgMail = sys.argv[4]
OrgPass = sys.argv[5]
port = 587


message = MIMEMultipart('alternative')
message['Subject'] =f"Login OTP for {CompanyName}"
message['From'] = OrgMail
message['To'] = toMail

html = f"""
<html>
<body>
<h3>Please enter the below mentioned OTP for logging into {CompanyName}</h3>
	<h2>{otp}</h2>
  <br/>
</body>
</html>
"""

converted = MIMEText(html,'html')
message.attach(converted)
server = smtplib.SMTP('smtp.gmail.com', port)
server.starttls()
try:
  server.login(OrgMail, OrgPass)
  server.sendmail(OrgMail, toMail, message.as_string())
  server.quit()
  print("success sent OTP ~ python server")
except smtplib.SMTPAuthenticationError or smtplib.SMTPException:
  print("Server error cannot send mail ~ python server")
finally:
  sys.exit(0)