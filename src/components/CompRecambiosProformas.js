import React, {PropTypes} from 'react';

import CompSearchDB from './CompSearchDB';
import CompSearchButton from './CompSearchButton';
import CompEditForm from './CompEditForm';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import dbConn from '../store/db_connection.js';

const style = {
  refresh: {
    display: 'inline-block',
    position: 'relative'
  }
};

// -----------------------------------------------------------------
export default class CompRecambiosProformas extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      entry_id: null
    , entry_data: null
    };
  }

  onNewEntryData( new_entry_id, new_entry_data) {
    this.setState({entry_id:new_entry_id, entry_data:new_entry_data});
  }

  onChange( new_state ) {
    this.setState({entry_data:new_state});
  }

  onClick( e ) {
    console.log( "onClick")
    console.log( this )
    console.log( e )
    var rec = this.state.entry_data;
    delete rec[ 'IDProforma' ];
    var changes = {};
    changes["Poblacion"] = rec.Poblacion
    changes["NIF"] = rec.NIF
    changes["CP"] = rec.CP
    changes["Calle"] = rec.Calle
    changes["Provincia"] = rec.Provincia
    changes["Notas"] = rec.Notas
    changes["Fecha"] = rec.Fecha
    dbConn.update( '[Recambios - Proformas]', changes, "IDProforma='"+ this.state.entry_id + "'" );
  }

  render() {

    var show_results = false;
    var entry = "";
    if( this.state.entry_id ) {
      if( this.state.entry_data) {

        var raw_obj = JSON.stringify( this.state.entry_data, null, '  ');
        entry = ( 
          <div>
          <CompSearchButton onClick={this.onNewEntryData.bind(this, null, null)}/>
          <CompEditForm 
              data={this.state.entry_data} 
              onChange={this.onChange.bind(this)} 
              onClick={this.onClick.bind(this)} 
              layout="proforma"/>
          </div>
          );
      } else {
        entry = ( 
          <RefreshIndicator
              size={40}
              left={10}
              top={0}
              status="loading"
              style={style.refresh} />);
      }
    } else {
      show_results = true;
    }

    const sql = { 
      table:"[Recambios - Proformas]"
    , fields:["IDProforma as id", "Empresa", "Fecha"]
    , filter:"Empresa like '%#searchTerm#%'" 
    };

    return (
      <div className="main_section">
        <CompSearchDB 
            onEntryData={this.onNewEntryData.bind(this)}
            showResults={show_results}
            sql={sql}
            fuzzySearchQuery="Recambios.Proformas.Like"
            exactSearchQuery="Recambios.Proforma.ByID"
            queryTitle="Número de la Proforma"
            />
        {entry}
      </div>
    );
  }
}

CompRecambiosProformas.propTypes = {
};

