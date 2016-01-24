import React, {PropTypes} from 'react';
import TextField from 'material-ui/lib/text-field';

import dbConn from '../store/db_connection.js';

export default class CompSearchDB extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ""        // Current terms to search
    , searchResults: []     // Current results recovered
    , queryTitle: 'Nombre de la Pieza'
    };
  }

  // When the search field changed and we have enough characters
  // then we start a search in the db
  onChangeSearchFld(e) {
    var new_text = e.target.value;
    this.setState({searchTerm: new_text});
    if( new_text.length > 3 ) {
      // Do the fuzzy query and get the results back to me
      dbConn.get( this.props.fuzzySearchQuery
                , new_text
                , this
                , (data) => {
        this.setState({searchResults: data});
      });
    }
  }

  // When the user touches one of the results
  onTouchSearchRow(id) {
    console.log( id );
    // Notify we start searching for item with ID id
    this.props.onEntryData( id, null );
    //this.setState({entry_id: id, entry_data:null});
    // Search in the db all the details
    dbConn.get( this.props.exactSearchQuery, id, this, (data) => {
      this.props.onEntryData( id, data );
      // Return the full details
      //this.setState({entry_data: data[0]});
    });
  }  

  // Do the render in case we must
  render() {

    if( !this.props.showResults )
      return (<div/>);

    // Do an extra filter, case insensitive, on each result
    var filter = new RegExp(this.state.searchTerm, "i");
    var data_results = this.state.searchResults.map( (e) => {
      // Generate an tr entry, binded with the db.id
      // and bind the click to us
      if( e.name.match( filter )) {
        return (<tr key={e.id} onClick={this.onTouchSearchRow.bind(this,e.id)}><td>{e.id}</td><td>{e.name}</td></tr>);
      }
    });

    // Add the table format, we already have the rows contents
    var all_results = (
      <table className="search_results">
      <colgroup><col width="30"/></colgroup><tbody>
      <tr><th>ID</th><th>Nombre</th></tr>
      {data_results}</tbody>
      </table>
    );

    return (
      <div>
      <TextField fullWidth hintText={this.state.queryTitle} 
                 floatingLabelText={this.state.queryTitle}
                 value={this.state.searchTerm}
                 onChange={this.onChangeSearchFld.bind(this)}
                 />

      {all_results}
      </div>
      );
  }
}

CompSearchDB.propTypes = {
  onEntryData: PropTypes.func.isRequired
, showResults: PropTypes.bool.isRequired
, fuzzySearchQuery: PropTypes.string.isRequired
, exactSearchQuery: PropTypes.string.isRequired
, queryTitle: PropTypes.string.isRequired
};

