import React, {PropTypes} from 'react';

import TextField from 'material-ui/lib/text-field';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';

import IconButton from 'material-ui/lib/icon-button';
import ActionSearch from 'material-ui/lib/svg-icons/action/search';

const section_style = {
  margin: 16,
  marginTop: 0,
  width: '100%',
  zIndex: 0
};

const style = {
  container: {
    position: 'relative'
  },
  refresh: {
    display: 'inline-block',
    position: 'relative'
  }
};

import dbConn from '../store/db_connection.js';

// -----------------------------------------------------------------
export default class CompCompanyDetails extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ""
    , searchResults: []
    , entry_id: null
    , entry_data: null
    };
  }

  onChangeSearchFld(e) {
    var new_text = e.target.value;
    this.setState({searchTerm: new_text});
    if( new_text.length > 3 ) {
      dbConn.get( 'EmpresasLike', new_text, this, (data) => {
        this.setState({searchResults: data});
      });
    }
  }

  onTouchSearchRow(id) {
    console.log( id );
    this.setState({entry_id: id, entry_data:null});
    dbConn.get( 'EmpresaByID', id, this, (data) => {
      this.setState({entry_data: data[0]});
    });
  }

  onTouchSearchButton() {
    this.setState({entry_id: null, entry_data:null});
  }

  render() {

    if( this.state.entry_id ) {
      if( this.state.entry_data) {
        var raw_obj = JSON.stringify( this.state.entry_data, null, '  ');
        return ( 
          <div>
          <IconButton tooltip="Buscar de nuevo" onClick={this.onTouchSearchButton.bind(this)}><ActionSearch/></IconButton>
          <pre>{raw_obj}</pre>
          </div>
          );
      } else {
        return ( <div>
          <RefreshIndicator
              size={40}
              left={10}
              top={0}
              status="loading"
              style={style.refresh} />
          </div>);
      }

    } else {

      var filter = new RegExp(this.state.searchTerm, "i");
      var data_results = this.state.searchResults.map( (e) => {
        if( e.name.match( filter )) {
          return (<tr key={e.id} onClick={this.onTouchSearchRow.bind(this,e.id)}><td>{e.id}</td><td>{e.name}</td></tr>);
        }
      });

      var all_results = (
        <table className="search_results">
        <colgroup><col width="30"/></colgroup><tbody>
        <tr><th>ID</th><th>Nombre</th></tr>
        {data_results}</tbody>
        </table>
      );

      return (
        <div style={section_style}>
          
          <TextField fullWidth hintText="Nombre de la Empresa" 
                     floatingLabelText="Nombre de la Empresa"
                     value={this.state.searchTerm}
                     onChange={this.onChangeSearchFld.bind(this)}
                     />

          {all_results}

        </div>
      );
    }
  }
}

CompCompanyDetails.propTypes = {
};

