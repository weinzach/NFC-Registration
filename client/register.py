import nxppy
import time
import json
from time import gmtime, strftime
from socketIO_client import SocketIO, LoggingNamespace
import RPi.GPIO as GPIO ## Import GPIO library

GPIO.setmode(GPIO.BOARD) ## Use board pin numbering
GPIO.setup(36, GPIO.OUT) ## Setup GPIO Pin 7 to OUT

#Configuration
serverIP = '192.168.1.102'

mifare = nxppy.Mifare()
print("Connecting to "+serverIP+"...")
socketIO = SocketIO(serverIP, 3000, LoggingNamespace)
print("Registration Pi Connected!")
print("Please Scan a Card...")
GPIO.output(36,False)

while True:
    try:
        data = {}
        json_data = json.dumps(data)
        uid = mifare.select()
        GPIO.output(36,True)
        print("ID Scanned!")
        data['id'] = str(uid)
        student = raw_input('Student Name: ')
        email = raw_input('Student Email: ')
        data['name'] = student
        data['email'] =  email
        print("ID :"+str(uid))
        print("Name :"+str(student))
        print("Email :"+str(email))
        json_data = json.dumps(data)
        prompt = raw_input('Is this correct? (Y/n): ')
        if(prompt.lower()=="y"):
            socketIO.emit('register', json_data)
            print("Emitted Scan!")
        else:
            print("Please Scan a Card...")
        GPIO.output(36,False)
    except nxppy.SelectError:
        # SelectError is raised if no card is in the field.
        pass

    time.sleep(0.5)
