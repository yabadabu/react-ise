var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
  console.log('WebSocket Client Connected');
  connection.on('error', function(error) {
      console.log("Connection Error: " + error.toString());
  });
  connection.on('close', function() {
      console.log('echo-protocol Connection Closed');
  });
  connection.on('message', function(message) {
      if (message.type === 'utf8') {
        var json;
        try {
            json = JSON.parse(message.utf8Data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        console.log( JSON.stringify( json, null, '  '  ));
      }
  });

  function send( txt ) {
      if (connection.connected) {
          console.log( "Sending " + txt );
          connection.sendUTF( txt );
      }
  }

  send( process.argv[2] );
});

 
client.connect('ws://localhost:1337/');


