import _ from 'lodash';
import dbConn from './db_connection.js';

var all_combo_sqls = {
  'Provincias.ID': "select IDProvincia as id, NameProvincia as name from [Codigos Provincias]"
, 'Recambios.REF': "select REF as id, Nombre as name from [Referencias]"
};

var all_combos = {

  executed: false,
  luts: {},

  createLut( lut_id, results ) {
    let lut = { id2name:{}, name2id:{}};
    _.each( results, (v)=>{
      if( v.name ) {
        lut.id2name[ v.id ] = v.name;
        lut.name2id[ v.name ] = v.id;
      }
    });
    lut.names = _.values( lut.id2name );
    lut.ids   = _.keys( lut.id2name );
    this.luts[ lut_id ] = lut;    
  },

  queryData() {

    _.each( all_combo_sqls, (v,k)=>{
      console.log( "Sending query " + v );

      dbConn.DBRunSQL( v, (results)=>{
        //console.log( "All combos recv for " + k + " " + v )
        this.createLut( k, results );
      });
    });

    // Hard coded values
    this.createLut( 'Proformas.Detail.Tipo', [
        {id:0, name:'NORMAL'}
      , {id:1, name:'SIN CARGO'}
      , {id:2, name:'EN GARANTIA'}
      , {id:3, name:'PRECIO ESPECIAL'}
      ]);

    // Hard coded values
    this.createLut( 'Proformas.Estado', [
        {id:0, name:'CREACION'}
      , {id:1, name:'APROBADO POR CLIENTE'}
      , {id:2, name:'COMPLETADO'}
      ]);

  }
};

dbConn.on( 'DB.connectionStatusChanged', (connected)=>{
  if( !connected )
    return;
  console.log( "Combo aware of db connected", all_combos.executed);
  all_combos.queryData();
});

export default all_combos;

