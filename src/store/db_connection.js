const EventEmitter = require('events');

class DBConnection extends EventEmitter {

  constructor() {
    super();
    this.connection = new WebSocket('ws://127.0.0.1:1337');
    this.callback_ctx = null;
    this.callback = null;
    this.is_connected = false;
    this.connectToServer();
  }

  disconnect( ) {
    if( this.is_connected ) {
      this.is_connected = false;
      this.emit('DB.connectionStatusChanged', 0);
      console.log( "DB.Disconnected!");
    }
  }

  connectToServer( ) {
    //console.log( "Trying to ws connect...")
    this.connection = new WebSocket('ws://127.0.0.1:1337');

    this.connection.onopen = () => {
      console.log( "DB.Connected!");
      this.is_connected = true;
      this.emit('DB.connectionStatusChanged', 1);
    };

    this.connection.onclose = () => {
      this.disconnect();
      //this.is_connected = false;
      setTimeout( this.connectToServer(this), 3000 );
    };
    
    this.connection.onmessage = (message) => {
      console.log( "message from the ws server");
      try {
        var json = JSON.parse(message.data);
      } catch (e) {
        console.log('Server answered something that doesn\'t look like a valid JSON: ', message.data);
        return;
      }
      //console.log( json );
      if( this.callback ) 
        this.callback.call( this.callback_ctx, json.data );
    };

    this.connection.onerror = (err) => {
      //console.log( "ws error");
      //console.log( err );
      this.disconnect();
    };
  }

  isConnected() {
    return this.is_connected;
  }

  DBSelect( table, fields, filter, callback_ctx, callback ) {
    this.callback_ctx = callback_ctx;
    this.callback = callback;
    var arg = {q:"select", fields:fields, table:table, filter:filter };
    console.log( arg );
    this.connection.send( JSON.stringify(arg));
  } 

  DBUpdate( table, fields, filter, callback_ctx, callback ) {
    this.callback_ctx = callback_ctx;
    this.callback = callback;
    var arg = {q:"update", table:table, fields:fields, filter:filter };
    console.log( arg );
    this.connection.send( JSON.stringify(arg) );
  } 
}

let theDBConnection = new DBConnection();
export default theDBConnection;
