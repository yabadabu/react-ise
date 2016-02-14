var WebSocketServer = require('websocket').server;
var http = require('http');
var db = require( 'odbc' )();
var async = require( 'async' );

var server = http.createServer(function(request, response) {});
server.listen(1337, function() { });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

// ----------------------------------------------------------
function connectToDB( callback, conn_str ) {
  db.open( conn_str, function ( err ) {
    if( err ) {
      console.log( "Failed to connect to database " + conn_str );
      return console.error( err );
      process.exit( -1 );
    }
    console.log( "Connected to DB " + conn_str);
    callback(err);
  });
}

function connectToDBClientes( callback ) {
  connectToDB( callback, "DSN=clientes");
}

function connectToDBRecambios( callback ) {
  connectToDB( callback, "DSN=Recambios");
}

function connectToDBProformas( callback ) {
  connectToDB( callback, "DSN=Proformas");
}

function connectToDBPiezas( callback ) {
  connectToDB( callback, "DSN=AllPiezas");
}

// ----------------------------------------------------------
function startWSServer( ) {
  // WebSocket server
  wsServer.on('request', function(request) {
      var connection = request.accept(null, request.origin);

      // This is the most important callback for us, we'll handle
      // all messages from users here.
      connection.on('message', function(message) {
          if (message.type === 'utf8') {
            console.log( "Client sent message");
            var json;
            try {
                json = JSON.parse(message.utf8Data);
            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ', message.data);
                return;
            }
            console.log( JSON.stringify( json, null, ' '));
            onClientRequest( connection, json );
          }
      });

      connection.on('close', function(connection) {
          // close user connection
      });
  });
}

// ----------------------------------------------------------
function quoted( x ) {
  return "'" + x + "'";
}

function isNumber( x ) {
  var nx = Number( x  );
  if( x && !isNaN(nx) ) { 
    if( nx.toString() == x )      // Must use ==, not ===
      return true;
  }
  return false;
}

function asSQLValue( value ) {
  // nodejs does not seem to be properly run number.toLocaleString()
  // The numbers... replace '.' for ',' 
  if( Number( value ) == value ) {
    var str_value = value.toString();
    value = str_value.replace( '.', ',');
  } else {
    // Check there are no unescaped ' in the string
  }
  return quoted( value );
}

// ----------------------------------------------------------
function genSQL( fields, table, filter ) {
  return 'select ' + fields.join(", ") + ' from ' + table + ' where ' + filter;
}

// ----------------------------------------------------------
function genUpdateSQL( table, fields, filter ) {
  console.log( "genUpdateSQL" )
  console.log( table )
  console.log( fields )
  console.log( filter )

  var changes = []
  for( var f in fields ) {
    var value = fields[f];
    if( Array.isArray( value ) )
      continue;
    if( value == null )
      changes.push( f + " = null " );
    else if( value == 'now()' && f === "ChangeDate")
      changes.push( f + " = now() " );
    else {
      changes.push( f + " = " + asSQLValue( value ) );
    }
  }
  sql = "UPDATE " + table + " SET " + changes.join(", ") + " WHERE " + filter;
  return sql;
}


// ----------------------------------------------------------
function genInsertSQL( table, fields ) {
  console.log( "genInsertSQL" )
  console.log( table )
  console.log( fields )

  var field_names = []
  var field_values = []
  for( var f in fields ) {
    var value = fields[f];
    if( Array.isArray( value ) )
      continue;
    field_names.push( f );
    if( value == null )
      field_values.push( value );
    else {
      field_values.push( asSQLValue( value ) );
    }
  }
  sql = "INSERT INTO " + table + " (" + field_names.join(", ") + ") VALUES (" + field_values.join(", ") + ")";
  return sql;
}

// ----------------------------------------------------------
function genDeleteSQL( table, filter ) {
  console.log( "genDeleteSQL" )
  console.log( table )
  console.log( filter )
  sql = "DELETE FROM " + table + " WHERE " + filter;
  return sql;
}

// ----------------------------------------------------------
function execRequest( inmsg, request_callback ) {
  var tasks= [];
  
  if( inmsg.q === "select" ) {
    tasks.push( { sql: genSQL( inmsg.fields, inmsg.table, inmsg.filter ) } );
  } 

  else if( inmsg.q === "update" ) {
    tasks.push( { sql: genUpdateSQL( inmsg.table, inmsg.fields, inmsg.filter ) } );
  } 

  else if( inmsg.q === "insert" ) {
    tasks.push( { sql: genInsertSQL( inmsg.table, inmsg.fields ) } );
  } 

  else if( inmsg.q === "delete" ) {
    tasks.push( { sql: genDeleteSQL( inmsg.table, inmsg.filter ) } );
  } 

  else if( inmsg.q === "rawSql" ) {
    tasks.push( { sql: inmsg.sql } );
  }

  else {
    request_callback("Invalid query type " + inmsg.q, { status:'ko', data:{} });
    return;
  }

  var final_data;

  var dbtasks = [];
  tasks.map( (t) => {
    dbtasks.push( (cb) => { 
      console.log( t.sql )
      db.query( t.sql, function (err, data ) {
        console.log( data );
        if( t.root ) {
          if( final_data )
            final_data[ t.root ] = data;
        }
        else {
          if( t.single ) {
            console.log( "Got single from " );
            final_data = data[0];
          } else {
            final_data = data;
          }
        }
        cb(err);
      })
    })
  })

  async.series( dbtasks, (err) => {
    if( err ) {
      console.log( "error!")
      console.log( err );
    }
    console.log( "Async completed for queryId:" + inmsg.query_id);
    console.log( JSON.stringify( final_data, null, '  ' ) );
    request_callback(null, { status:'ok', query_id:inmsg.query_id, data:final_data });
  });
}

// ----------------------------------------------------------
function test( ) {
  var r = {q:"PiezasFacturaByID", text:"01-I0951"};
  r = {q:"PiezasFacturasLike", text:"01-I0988"};
  r = {q:"PiezasFacturaByID", text:"11-0482-M"};
  execRequest( r, (err,data) => {
    console.log( JSON.stringify( data ), null, '  ');
    process.exit( 0 );
  })
}


// ----------------------------------------------------------
function onClientRequest( conn, inmsg ) {
  execRequest( inmsg, (err,data) => {
    conn.sendUTF(JSON.stringify(data));
  })
}

connectToDBProformas( startWSServer );
//connectToDBPiezas( test );
