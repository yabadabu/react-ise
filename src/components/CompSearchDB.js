import React, {PropTypes} from 'react';
import TextField from 'material-ui/lib/text-field';
import dbConn from '../store/db_connection.js';

export default class CompSearchDB extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ""        // Current terms to search
    , searchResults: []     // Current results recovered
    };
  }

  // When the search field changed and we have enough characters
  // then we start a search in the db
  onChangeSearchFld(e) {
    var new_text = e.target.value;
    this.setState({searchTerm: new_text});
    if( new_text.length > 3 ) {
      console.log( this.props );
      if( this.props.sql ) {
        var resolved_filter = this.props.sql.filter.replace( /#searchTerm#/, this.state.searchTerm );
        // Do the fuzzy query and get the results back to me
        dbConn.sql( this.props.sql.fields
                  , this.props.sql.table
                  , resolved_filter
                  , this
                  , (data) => {
          console.log( "Received from the db connection callback" );
          console.log( data );
          this.setState({searchResults: data});
        });  
      } else {
        // Do the fuzzy query and get the results back to me
        dbConn.get( this.props.fuzzySearchQuery
                  , new_text
                  , this
                  , (data) => {
          //console.log( "Received from the db connection callback" );
          //console.log( data );
          this.setState({searchResults: data});
        });
      }
    }
  }

  // When the user touches one of the results
  onTouchSearchRow(id) {
    console.log( id );
    // Notify we start searching for item with ID id
    this.props.onEntryData( id, null );
    // Search in the db all the details
    dbConn.get( this.props.exactSearchQuery, id, this, (data) => {
    console.log( data );
      this.props.onEntryData( id, data );
      // Return the full details
    });
  }  

  // Do the render in case we must
  render() {

    if( !this.props.showResults )
      return (<div/>);

    // Do an extra filter, case insensitive, on each result
    var filter = new RegExp(this.state.searchTerm, "i");
    var data_results;
    console.log( this.state.searchResults );
    if( Array.isArray( this.state.searchResults ) ) {
      data_results = this.state.searchResults.map( (row) => {
        // Generate an tr entry, binded with the db.id
        // and bind the click to us
        if( !row.name || row.name.match( filter )) {
          var tds = [];
          for( var fld in row ) {
            var value = row[fld];
            tds.push( <td>{value}</td> );
          }
          return (
            <tr key={row.id} onClick={this.onTouchSearchRow.bind(this,row.id)}>
            {tds}
            </tr>
          )
        }
      })
    }
    if( !data_results || data_results.length == 0 ) {
      data_results = (<tr key={"empty_results"}><td></td><td>Sin resultados</td></tr>);
    }

    // Add the table format, we already have the rows contents
    var all_results = (
      <table className="search_results">
      <colgroup><col width="150px"/></colgroup><tbody>
      <tr><th>ID</th><th>Nombre</th></tr>
      {data_results}</tbody>
      </table>
    );

    return (
      <div>
      <TextField 
        fullWidth 
        hintText={this.props.queryTitle} 
        floatingLabelText={this.props.queryTitle}
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
, sql: PropTypes.object
};

