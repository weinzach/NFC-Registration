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
boothID = '1'

mifare = nxppy.Mifare()
print("Connecting to "+serverIP+"...")
socketIO = SocketIO(serverIP, 3000, LoggingNamespace)
print("Connected!")
GPIO.output(36,False)

while True:
    try:
        data = {}
        json_data = json.dumps(data)
        uid = mifare.select()
        GPIO.output(36,True)
        data['id'] = str(uid)
        data['station'] = boothID
        json_data = json.dumps(data)
        socketIO.emit('scan', json_data)
        print("Emitted Scan!")
        GPIO.output(36,False)
    except nxppy.SelectError:
        # SelectError is raised if no card is in the field.
        pass

    time.sleep(0.5)
