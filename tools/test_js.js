
function test( x ) {
  var nx = Number( x  );
  console.log( "x: ", x );
  console.log( "nx: ", nx );
  if( x && !isNaN(nx) ) {  //!= Number.NaN ) {
    console.log( "Looks like a number" );
    if( nx.toString() == x )
      console.log( "It's a number.................." );
  }
}

test( "6.03" );
test( 6.03 );
test( null );
test( undefined );
test( "casa" );
