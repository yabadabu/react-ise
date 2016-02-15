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

  componentDidMount() {
    // Check if any search field wants the focus.
    // Requires 'ref={..} when instantiating the field'
    _.each( this.props.layout.search.fuzzy.fields, (f)=>{
      if( f.focus_on_mount ) 
        this.refs[ f.field ].focus();
    });
  }

  // When the search field changed and we have enough characters
  // then we start a search in the db
  onChangeSearchFld(field, e) {
    var field_name = field.field;
    //console.log( "onChangeSearchFld" );
    //console.log( field, field_name );
    //console.log( e );
    var new_value = e.target.value;
    var new_state = this.state;
    new_state.searchTerms[field_name] = new_value;
    //console.log( new_state );
    this.setState(new_state);

    if( new_value.length >= field.min_num_chars ) 
      this.requestDataToDB();
  }

  // ----------------------------------------------------------
  requestDataToDB() {
    //console.log( "requestDataToDB" );
    //console.log( this.state );

    const layout = this.props.layout;
    const fields_defs = layout.search.fuzzy.fields;
    var fields = [];
    var filters = [];
    for( var idx in fields_defs ) {
      var f = fields_defs[idx];
      fields.push( f.field );
      //console.log( f )
      if( this.state.searchTerms[f.field] ) {
        var resolved_filter = f.filter.replace( /__FIELD__/, this.state.searchTerms[f.field] );
        //console.log( resolved_filter );
        filters.push( resolved_filter );
      } else {
        //console.log( "Filter " + f.field + " term is empty");
      }
    }
    var all_filters = filters.join( " AND ");
    //console.log( fields )
    //console.log( all_filters )
    
    // Do the fuzzy query and get the results back to me
    dbConn.DBSelect( layout.table
                   , fields
                   , all_filters
                   , (data) => {
      //console.log( "Received from the db connection callback" );
      //console.log( data );
      this.setState({searchResults: data});
    });  
  }

  // When the user touches one of the results
  onTouchSearchRow(id) {
    const layout = this.props.layout;
    //console.log( id );
    if( layout.search.return_exact_query ) {
      // If they want the full row, just get the full row and call it back
      var resolved_filter = layout.search.exact.filter.replace( /__FIELD__/, id );
      //console.log( "resolved_filter", resolved_filter);
      dbConn.DBSelect( layout.table
                     , ["*"]
                     , resolved_filter
                     , (data) => { 
                        //console.log( "Got the full data from the db", data[0]);
                        this.props.onClickSearchResult( data[0], this.state, null );
                     });
    } else {
      // Notify we start searching for item with ID id
      this.props.onClickSearchResult( id, this.state, null );
    }

  }  

  onClickRecent() {
    var layout = this.props.layout;

    var fields_defs = layout.search.fuzzy.fields;
    var fields = [];
    for( var idx in fields_defs ) {
      var f = fields_defs[idx];
      fields.push( f.field );
    }

    // console.log( "Sending recent sql", layout );

    // Do the fuzzy query and get the results back to me
    dbConn.DBSelect( layout.table
                   , fields
                   , layout.search.recent.filter
                   , (data) => {
      this.setState({searchResults: data});
    });  

  }

  // -----------------------------------------------
  renderSearchForm() {
    const layout = this.props.layout;

    var key = 1000;
    var entries = [];
    _.map( layout.search.fuzzy.fields, ( f ) => {
      entries.push (
        <TextField 
          key={f.field}
          hintText={f.hint} 
          floatingLabelText={f.hint}
          value={this.state.searchTerms[f.field]}
          style={f.style}
          onChange={this.onChangeSearchFld.bind(this,f)}
          ref={f.field}
          />);
    });

    var recent_button;
    if( this.props.layout.search.recent ) {
      recent_button = (<RaisedButton label="Recientes" onClick={this.onClickRecent.bind(this)}/>);
    }

    if( !this.props.no_action_buttons ) {
      const buttons_group_style = {float:"right"};
      entries.push( 
      <CardActions key={"buttons"} style={buttons_group_style}>
        {recent_button}
        <RaisedButton label="Nuevo" onClick={this.props.onClickNew}/>
      </CardActions>
      );
    }

    return (<div key="search_form">{entries}</div>);
  }

  // --------------------------------------------------------------------
  renderColHeaders() {
    // Add the table format, we already have the rows contents
    var col_headers=[];
    _.each(_.map( this.props.layout.search.fuzzy.fields, "field" ), (f)=>{
      col_headers.push( <th key={f}>{f}</th> );
    });
    return (<tr key="col_headers">{col_headers}</tr>);
  }

  renderSearchBodyResults() {
    var data_results;
    var key = 0;

    var key_field = this.props.layout.key_field;
    if( Array.isArray( this.state.searchResults ) ) {
      data_results = this.state.searchResults.map( (row) => {
        key++;
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
            tds.push( <td key={key}>{value}</td> );
            key++;
          }
          var unique_id = row[key_field];
          return (
            <tr key={key} onClick={this.onTouchSearchRow.bind(this,unique_id)}>{tds}</tr>
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
    var headers;
    if( !this.props.no_headers ) headers = this.renderColHeaders();
    var body = this.renderSearchBodyResults();
    return (
      <table key="search_results" className="search_results">
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
    return (<div >{search_form}{data_results}</div>);
  }
}

// --------------------------------------------------------------------
CompSearchDB.propTypes = {
  layout: PropTypes.object.isRequired,
  search_state: PropTypes.object,
  no_headers: PropTypes.bool,
  no_action_buttons: PropTypes.bool,
  onClickNew: PropTypes.func,
  onClickSearchResult: PropTypes.func.isRequired
};

