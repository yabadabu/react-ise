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

  sql( fields, table, filter, callback_ctx, callback ) {
    this.callback_ctx = callback_ctx;
    this.callback = callback;
    var arg = {q:"select", fields:fields, table:table, filter:filter };
    console.log( arg );
    this.connection.send( JSON.stringify(arg));
  } 

  update( table, fields, filter, callback_ctx, callback ) {
    this.callback_ctx = callback_ctx;
    this.callback = callback;
    var arg = {q:"update", table:table, fields:fields, filter:filter };
    console.log( arg );
    this.connection.send( JSON.stringify(arg) );
  } 
}

let theDBConnection = new DBConnection();
export default theDBConnection;
