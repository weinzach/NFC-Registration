import time
import json
from socketIO_client import SocketIO, LoggingNamespace

#Configuration
serverIP = '192.168.1.102'

print("Connecting to "+serverIP+"...")
socketIO = SocketIO(serverIP, 3000, LoggingNamespace)
print("Connected!")

while True:
    try:
        data = {}
        json_data = json.dumps(data)
        broadcast = raw_input('Enter a message: ')
        if broadcast.strip():
            data['display'] = broadcast
            json_data = json.dumps(data)
            socketIO.emit('broadcast', json_data)
            print("Emitted Message!")
    except:
        # SelectError is raised if no card is in the field.
        pass

    time.sleep(0.5)
