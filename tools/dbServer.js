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

function quoted( x ) {
  return "'" + x + "'";
}

// ----------------------------------------------------------
function onClientRequest( conn, inmsg ) {
  var filter, fields, table;
  if( inmsg.q === "EmpresasLike" ) {
    filter = "[Empresa] like '%" + inmsg.text + "%'";
    fields = ['[Número Cliente] as id', 'Empresa as name'];
    table = 'Clientes';
  }
  else if( inmsg.q === "EmpresaByID" ) {
    filter = "[Número Cliente] = " + inmsg.text;
    fields = ["*"];
    table = 'Clientes';
  }
  
  else if( inmsg.q === "PiezasFacturasLike" ) {
    filter = "[IDFactura] like '%" + inmsg.text + "%'";
    fields = ['IDFactura as id', 'Empresa as name'];
    table = '[Piezas Facturas]';
  }
  else if( inmsg.q === "PiezasFacturaByID" ) {
    filter = "[IDFactura] = " + quoted( inmsg.text );
    fields = ["*"];
    table = '[Piezas Facturas]';
  }

  else if( inmsg.q === "ReferencesLike" ) {
    filter = "[REF] like '%" + inmsg.text + "%'";
    fields = ['REF as id', 'Nombre as name'];
    table = 'Referencias';
  }
  else if( inmsg.q === "FacturasLike" ) {
    filter = "[REF] like '%" + inmsg.text + "%'";
    fields = ['REF as id', 'Nombre as name'];
    table = 'Referencias';
  }
  else {
    conn.sendUTF( "Invalid query type " + inmsg.q );
    return;
  }

  var sql = 'select ' + fields.join() + ' from ' + table + ' where ' + filter;
  console.log( sql );
  db.query( sql, function (err, data ) {
    if( err ) {
      console.log( err );
    }
    else {
      console.log( JSON.stringify( data, null, '  ' ) );
      conn.sendUTF(JSON.stringify({ status:'ok', data:data }));
    }
  })
}

connectToDBPiezas( startWSServer );
