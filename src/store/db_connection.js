const EventEmitter = require('events');
import _ from 'lodash';

class DBConnection extends EventEmitter {

  constructor() {
    super();
    this.connection = new WebSocket('ws://127.0.0.1:1337');
    this.callback_ctx = null;
    this.callback = null;
    this.is_connected = false;
    this.trace = false;
    this.next_id = 1;
    this.running_queries = {};
    this.connectToServer();
  }

  disconnect( ) {
    if( this.is_connected ) {
      this.is_connected = false;
      this.emit('DB.connectionStatusChanged', 0);
      console.log( "DB.Disconnected!");
    }
  }

  // ---------------------------------------------------------------
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
      setTimeout( this.connectToServer(this), 3000 );
    };
    
    this.connection.onmessage = (message) => {
      //console.log( "message from the ws server");
      try {
        var json = JSON.parse(message.data);
      } catch (e) {
        console.log('Server answered something that doesn\'t look like a valid JSON: ', message.data);
        return;
      }
      if( this.trace ) console.log( json );
      if( json.query_id ) {
        var cb = this.running_queries[json.query_id]; 
        if( cb ) {
          cb( json.data );
          delete this.running_queries[ json.query_id ];
        }
      } else {
        console.log( "Server recv query answer without a query id!");
      }
    };

    this.connection.onerror = (err) => {
      //console.log( "ws error");
      //console.log( err );
      this.disconnect();
    };
  }

  // ---------------------------------------------------------------
  isConnected() {
    return this.is_connected;
  }

  // ---------------------------------------------------------------
  launch( arg, callback ) {
    arg.query_id = this.next_id;
    //console.log( "Registering queryID " + arg.query_id )
    this.running_queries[ this.next_id ] = callback;
    if( this.trace ) console.log( this.next_id, arg );
    this.next_id++;
    this.connection.send( JSON.stringify(arg) );
  }

  // ---------------------------------------------------------------
  DBLookUp( field, table, filter, callback ) {
    var arg = {q:"select", fields:[field], table:table, filter:filter };
    this.launch( arg, (data)=>{callback( _.values( data[0] )[0] );});
  } 

  // ---------------------------------------------------------------
  DBSelect( table, fields, filter, callback ) {
    var arg = {q:"select", fields:fields, table:table, filter:filter };
    this.launch( arg, callback );
  } 

  // ---------------------------------------------------------------
  DBRunSQL( sql, callback ) {
    var arg = {q:"rawSql", sql:sql };
    this.launch( arg, callback );
  } 

  // ---------------------------------------------------------------
  DBUpdate( table, fields, filter, callback ) {
    var arg = {q:"update", table:table, fields:fields, filter:filter };
    this.launch( arg, callback );
  } 

  // ---------------------------------------------------------------
  DBDelete( table, filter, callback ) {
    var arg = {q:"delete", table:table, filter:filter };
    this.launch( arg, callback );
  } 

  // ---------------------------------------------------------------
  DBInsert( table, fields, callback ) {
    var arg = {q:"insert", table:table, fields:fields };
    this.launch( arg, callback );
  } 
}

let theDBConnection = new DBConnection();
export default theDBConnection;
