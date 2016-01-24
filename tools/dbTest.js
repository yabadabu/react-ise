var db = require( 'odbc' )();

//var conn_str = "Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=C:\\ilpra\\clientes.accdb;Uid=Admin;Pwd=;";
//var conn_str = "Driver={Misdadcrosoft Access Driver (*.mdb, *.accdb)};Dbq=C:\\ilpra\\clientes.accdb;Uid=Admin;Pwd=;";
//var conn_str = "Driver={Microsoft Access Driver (*.mdb)};Dbq=C:\\ilpra\\clientes.mdb;Uid=Admin;Pwd=;";
//var conn_str = "Driver= {MicrosoftAccessDriver(*.mdb)}; DBQ=C:\\ilpra\\Clientes.mdb;Uid=Your_Username; Pwd=Your_Password;";
var conn_str = "DSN=Recambios";
conn_str = "DSN=AllPiezas";
db.open( conn_str, function ( err ) {
  if( err ) {
    console.log( "Failed!\n");
    return console.error( err );
  }

  var q = 'select * from Clientes where [Número Cliente]=23';
  q = "select [Número Cliente], Empresa from Clientes where [Empresa] like '%VIVA%'";
  q = "select * from [Referencias] where REF like '1723%'";
  q = "select * from [Piezas] where IDPieza = 232";
  q = "select * from [Piezas Facturas] where [IDFactura] = '01-I0435'"
  //q = "SELECT Name FROM MSysObjects WHERE Type = 1"
  db.query( q, function (err, data ) {
    if( err ) console.log( err );
    console.log( JSON.stringify( data, null, '  ' ) );
    db.close( function() {
      console.log( 'done' );
    })
  })
});