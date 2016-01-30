import React, {PropTypes} from 'react';
import TextField from 'material-ui/lib/text-field';
import dbConn from '../store/db_connection.js';
import _ from 'lodash';

import RaisedButton from 'material-ui/lib/raised-button';
import CardActions from 'material-ui/lib/card/card-actions';

export default class CompSearchDB extends React.Component {

  constructor(props) {
    super(props);
    let init_state = props.search_state;
    if( init_state == null ) init_state = {};
    if( init_state.searchTerms == null )
      init_state.searchTerms = {};
    if( init_state.searchResults == null )
      init_state.searchResults = [];
    this.state = init_state;
  }

  // When the search field changed and we have enough characters
  // then we start a search in the db
  onChangeSearchFld(field, e) {
    console.log( "onChangeSearchFld" );
    console.log( field );
    console.log( e );
    var new_value = e.target.value;
    var new_state = this.state;
    new_state.searchTerms[field] = new_value;
    console.log( new_state );
    this.setState(new_state);

    if( new_value.length >= this.props.data.search.fuzzy.min_num_chars ) 
      this.requestDataToDB();
  }

  // ----------------------------------------------------------
  requestDataToDB() {
    console.log( "requestDataToDB" );
    console.log( this.state );

    var layout = this.props.data;
    var fields_defs = layout.search.fuzzy.fields;
    var fields = [];
    var filters = [];
    for( var idx in fields_defs ) {
      var f = fields_defs[idx];
      fields.push( f.field );
      //console.log( f )
      if( this.state.searchTerms[f.field] ) {
        var resolved_filter = f.filter.replace( /__FIELD__/, this.state.searchTerms[f.field] );
        console.log( resolved_filter );
        filters.push( resolved_filter );
      } else {
        console.log( "Filter " + f.field + " term is empty");
      }
    }
    var all_filters = filters.join( " AND ");
    //console.log( fields )
    //console.log( all_filters )
    
    // Do the fuzzy query and get the results back to me
    dbConn.DBSelect( layout.table
                   , fields
                   , all_filters
                   , this
                   , (data) => {
      //console.log( "Received from the db connection callback" );
      //console.log( data );
      this.setState({searchResults: data});
    });  
  }

  // When the user touches one of the results
  onTouchSearchRow(id) {
    //console.log( id );
    // Notify we start searching for item with ID id
    this.props.onClickSearchResult( id, this.state, null );
  }  

  // -----------------------------------------------
  renderSearchForm() {
    const p = this.props.data;
    const sf = p.search.fuzzy;

    var key = 1000;
    var entries = [];
    _.map( sf.fields, ( search_fld ) => {
      key++;
      var fld_name = search_fld.field;
      var fld_style = search_fld.style;
      var idx = _.findIndex( p.fields, (obj)=>{ return obj.field == fld_name; });
      if( idx == -1 ) {
        entries.push( <div key={key}>"Field {fld_name} is not defined in the layout"</div>);
        return;
      }
      var f = p.fields[ idx ];
      entries.push (
        <TextField 
          hintText={f.hint} 
          floatingLabelText={f.hint}
          value={this.state.searchTerms[f.field]}
          style={fld_style}
          onChange={this.onChangeSearchFld.bind(this,f.field)}
          key={key}
          />);
    });

    const buttons_group_style = {float:"right"};
    entries.push( 
    <CardActions key={"buttons"} style={buttons_group_style}>
      <RaisedButton label="Recientes"/>
      <RaisedButton label="Nuevo" onClick={this.props.onClickNew}/>
    </CardActions>
    );

    return entries;
  }

  // --------------------------------------------------------------------
  renderColHeaders() {
    // Add the table format, we already have the rows contents
    var col_headers=[];
    _.each(_.map( this.props.data.search.fuzzy.fields, "field" ), (f)=>{
      col_headers.push( <th key={f}>{f}</th> );
    });
    return (<tr>{col_headers}</tr>);
  }

  renderSearchBodyResults() {
    var data_results;

    var key_field = this.props.data.key_field;
    if( Array.isArray( this.state.searchResults ) ) {
      data_results = this.state.searchResults.map( (row) => {
        //console.log( row );
        //console.log( key_field );
        //console.log( row[key_field] );
        // Generate an tr entry, binded with the db.id
        // and bind the click to us

        var is_valid = true; //!row.name || row.name.match( filter );
        if( is_valid ) {
          var tds = [];
          for( var fld in row ) {
            var value = row[fld];
            tds.push( <td>{value}</td> );
          }
          var unique_id = row[key_field];
          return (
            <tr key={unique_id} onClick={this.onTouchSearchRow.bind(this,unique_id)}>{tds}</tr>
          );
        }
      });
    }
    if( !data_results || data_results.length == 0 ) {
      return (<tr key={"empty_results"}><td></td><td>Sin resultados</td></tr>);
    }
    return data_results;
  }

  // --------------------------------------------------------------------
  renderSearchResults() {
    var headers = this.renderColHeaders();
    var body = this.renderSearchBodyResults();
    return (
      <table className="search_results">
<colgroup><col width="150px"/></colgroup>
      <tbody>
      {headers}
      {body}
      </tbody>
      </table>
    );
  }

  // --------------------------------------------------------------------
  // Do the render in case we must
  render() {
    const search_form = this.renderSearchForm();
    // Do an extra filter, case insensitive, on each result
    //var filter = new RegExp(this.state.searchTerm, "i");
    const data_results = this.renderSearchResults();
    return (<div>{search_form}{data_results}</div>);
  }
}

// --------------------------------------------------------------------
CompSearchDB.propTypes = {
  data: PropTypes.object.isRequired,
  search_state: PropTypes.object,
  onClickNew: PropTypes.func,
  onClickSearchResult: PropTypes.func.isRequired
};

