class DBConnection {
  constructor() {
    this.connection = new WebSocket('ws://127.0.0.1:1337');
    this.callback_ctx = null;
    this.callback = null;
    this.connection.onmessage = (message) => {
      //console.log( "Server answered something");
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
  }
  get( what, arg, callback_ctx, callback ) {
    this.callback_ctx = callback_ctx;
    this.callback = callback;
    this.connection.send( JSON.stringify({q:what, text:arg }));
  } 
}

let theDBConnection = new DBConnection();
export default theDBConnection;
