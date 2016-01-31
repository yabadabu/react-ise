import React, {PropTypes} from 'react';
import _ from 'lodash';
import async from 'async';

import CompSearchDB from './CompSearchDB';
import dbConn from '../store/db_connection.js';
import CircularProgress from 'material-ui/lib/circular-progress';
import * as layouts from '../store/db_layouts.js';
import Snackbar from 'material-ui/lib/snackbar';
import Divider from 'material-ui/lib/divider';
import Dialog from 'material-ui/lib/dialog';

import IconButton from 'material-ui/lib/icon-button';
import ActionSearch from 'material-ui/lib/svg-icons/action/search';
import ActionCopy from 'material-ui/lib/svg-icons/content/content-copy';
import ActionPaste from 'material-ui/lib/svg-icons/content/content-paste';
import ActionDelete from 'material-ui/lib/svg-icons/action/delete';
import ActionNew from 'material-ui/lib/svg-icons/action/open-in-new';
import ActionSave from 'material-ui/lib/svg-icons/content/save';
import ActionUndo from 'material-ui/lib/svg-icons/content/undo';

import CompSearchButton from './CompSearchButton';
import CompEditForm from './CompEditForm';
import RaisedButton from 'material-ui/lib/raised-button';
import CardActions from 'material-ui/lib/card/card-actions';

const layout = layouts.get( "proforma" );

function getPropertiesOfAChangedFromB( a, b ) {
  if( !a || !b )
    return {};
  var diffs = {};
  for( var k in a ) {
    if( ( typeof b[k] == undefined ) || b[k] !== a[k] ) 
      diffs[k] = b[k];
  }
  return diffs;
}

// -----------------------------------------------------------------
export default class CompRecambiosProformas extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      db_id:   null
    , db_data: null
    , db_orig_data: null
    , db_delta: null
    , db_changed_rec: false
    , db_creating_new: false
    , connected: dbConn.isConnected()
    , msg_visible: false
    , msg_text: "blah blah"
    , modal_dlg_open: false
    , search_state: null
    };
  }

  componentDidMount() {
    dbConn.on('DB.connectionStatusChanged', this.onDBConnectionChange.bind(this) );
  }

  componentWillUnmount() {
    dbConn.removeListener('DB.connectionStatusChanged', this.onDBConnectionChange );
  }

  // Register to db connection/disconnections
  onDBConnectionChange( ) {
    this.setState({connected:dbConn.isConnected()});
  }

  // e is the unique id of the selected row in the comp search results
  onClickSearchResult( e, search_state ) {
    console.log( "onClickSearchResult" );
    this.setState({db_id:e});

    // Prepare the main query and the subqueries
    var db_all_results = {};
    var tasks = [];
    tasks.push( (callback)=>{
      // Main query
      console.log( "Retrieving main data for key " + e );
      var resolved_filter = layout.search.exact.filter.replace( /__FIELD__/, e );
      dbConn.DBSelect( layout.table
                     , ["*"]
                     , resolved_filter
                     , this
                     , (data) => { 
        console.log( "Main query recv");
        console.log( data );
        db_all_results = Object.assign({},db_all_results,data[0]); 
        console.log( db_all_results );
        callback(null); 
      });
    });

    //tasks.push( (callback)=>{ setTimeout( callback, 2000 ); } );

    // For subqueries if needed
    _.each( layout.fields, (f)=>{
      if( f.type === "array_table" ) {
        tasks.push( (callback)=>{
          console.log( "Retrieving data for field " + f.field );
          console.log( layout );
          var ext_layout = layouts.get( f.layout );
          console.log( "External layout" );
          console.log( ext_layout );
          console.log( "Local field to search is " + f.local );
          var searched_field = layouts.getFieldByname( layout, f.local );
          console.log( "searched_field " );
          console.log( searched_field );
          var searched_value = db_all_results[ searched_field.field ];
          console.log( "searched_value " + searched_value );
          var resolved_filter = ext_layout.search.join.filter.replace( /__FIELD__/, searched_value );
          dbConn.DBSelect( ext_layout.table
                         , ["*"]
                         , resolved_filter
                         , this
                         , (data) => { 
            console.log( "Sub query for " + f.field + " recv");
            console.log( data );
            db_all_results[ f.field ] = data;
            console.log( db_all_results );
            callback(null); 
          });
        });
      }
    });

    console.log( "Running tasks");
    console.log( tasks );
    async.series( tasks, (err)=>{
      console.log( "All data collected");
      console.log( db_all_results );
      this.validateData({
        db_data: db_all_results, 
        db_orig_data:db_all_results, 
        db_creating_new:false, 
        search_state:search_state
      });
    });
  }

  validateData( ns ) {
    if( ns.db_data ) {
      layouts.validateDates( layout, ns.db_data );
      var ref = this.state.db_orig_data;
      if( ns.db_orig_data )
        ref = ns.db_orig_data;
      ns.db_delta = getPropertiesOfAChangedFromB( ref, ns.db_data );
      ns.db_changed_rec = ( Object.keys( ns.db_delta ).length != 0 );
    }
    //console.log( "ns is now")
    //console.log( ns );
    this.setState(ns);
  }

  onDataChange( new_db_data ) {
    //console.log( "onDataChange" );
    this.validateData({db_data:new_db_data});
  }

  // --------------------------------------------------------------
  onClickCancel( e, dummy  ) {
    console.log( "Restoring...");
    this.validateData({db_data:this.state.db_orig_data});
  }

  // --------------------------------------------------------------
  onClickSave( e, dummy ) {
    if( !this.state.db_changed_rec && !this.state.db_creating_new )
      return;
    console.log( "Saving...");
    var changes = this.state.db_delta;
    console.log( changes );

    var handler = 
      (data)=>{
        console.log( "Save completed " + this.state.db_id);
        console.log( data );
        this.onClickSearchResult( this.state.db_id );
        this.setState({msg_visible:true, msg_text:"Registro grabado correctamente"});
       };

    if( this.state.db_creating_new ) {
      const new_id = changes[ layout.key_field ];
      console.log( "Adding new register to the db... " + new_id);
      this.setState({db_id:new_id});
      dbConn.DBInsert( layout.table
                     , changes
                     , this
                     , handler );
    } else {
      delete changes[ layout.key_field ];
      dbConn.DBUpdate( layout.table
                     , changes
                     , layout.key_field + "='"+ this.state.db_id + "'"
                     , this
                     , handler );
    }

  }
  // --------------------------------------------------------------
  onClickNew( ) {
    console.log( "New register...");
    const new_db_data = layouts.getNewEmptyRegister( layout );
    const new_db_orig_data = new_db_data;
    this.validateData( 
      { db_data: new_db_data
      , db_orig_data:new_db_orig_data
      , db_id:"new"
      , db_creating_new:true
      });
  }

  // --------------------------------------------------------------
  onClickDelete( ) {
    this.setState({modal_dlg_open:true}, {modal_dlg_msg:"¿Borrar completamente el registro?"});
  }

  // --------------------------------------------------------------
  onClickCopy( ) {
    console.log( "Copying to clipboard...");
  }

  // --------------------------------------------------------------
  onClickPaste( ) {
    console.log( "Pasting from clipboard...");
  }

  // --------------------------------------------------------------
  onClickSearchAgain() {
    this.setState( {db_id:null} );
  }

  // --------------------------------------------------------------
  onClick( e, dummy ) {
    console.log( "On click..." + e );
  }

  // ------------------------------------------------------------------
  renderDisconnected() {
    const style = {
      margin: "auto",
      textAlign: "center"
    };
    return (<div style={style}>Trying to connect to the database...<CircularProgress mode="indeterminate" /></div>);
  }

  renderSearchForm() {
    var code = JSON.stringify( layout, null, '  ' );
    return (<CompSearchDB 
        data={layout} 
        onClickNew={this.onClickNew.bind(this)}
        onClickSearchResult={this.onClickSearchResult.bind(this)}
        search_state={this.state.search_state}
        />);
    //return (<div>You are searching <pre>{code}</pre></div>);
  }

  // ---------------------------------------------------------------- 
  renderSearchButton( ) {
    return (<IconButton tooltip="Buscar de nuevo" onClick={this.onClickSearchAgain.bind(this)}><ActionSearch/></IconButton>);
  }

  // ---------------------------------------------------------------- 
  renderSaveButton() {
    const buttons_group_style = {float:"right"};
    var changed = this.state.db_changed_rec;
    var is_new = this.state.db_creating_new;
    return (
      <CardActions expandable style={buttons_group_style}>
        <IconButton tooltip="Buscar de nuevo" onClick={this.onClickSearchAgain.bind(this)}><ActionSearch/></IconButton>
        <IconButton tooltip="Copiar Valores" onClick={this.onClickCopy.bind(this)}><ActionCopy/></IconButton>
        <IconButton tooltip="Pegar Valores" onClick={this.onClickPaste.bind(this)}><ActionPaste/></IconButton>
        <IconButton disabled={changed || is_new} tooltip="Nuevo Registro" onClick={this.onClickNew.bind(this)}><ActionNew/></IconButton>
        <IconButton disabled={!changed && !is_new} tooltip="Guardar Cambios" onClick={this.onClickSave.bind(this)}><ActionSave/></IconButton>
        <IconButton disabled={!changed} tooltip="Deshacer Cambios" onClick={this.onClickCancel.bind(this)}><ActionUndo/></IconButton>
        <IconButton disabled={!changed} tooltip="Borrar Registro" onClick={this.onClickDelete.bind(this)}><ActionDelete/></IconButton>
      </CardActions>);
  }

  renderForm() {
    return(
      <CompEditForm 
        data={this.state.db_data} 
        onChange={this.onDataChange.bind(this)} 
        onClick={this.onClick.bind(this)} 
        layout={layout}
        creating_new={this.state.db_creating_new}
        />);
  }

  renderSnackBar() {
    var handler = ()=>{this.setState({msg_visible: false});};
    return (
      <Snackbar
        open={this.state.msg_visible}
        message={this.state.msg_text}
        autoHideDuration={1000}
        onRequestClose={handler}/>);
  }

  renderModalDialog() {
    var handler_no = ()=>{this.setState({modal_dlg_open: false});};
    var handler_yes = ()=>{this.setState({modal_dlg_open: false});};
    var actions = (
      <CardActions >
      <RaisedButton label="No" onClick={handler_no}/>
      <RaisedButton label="Yes" onClick={handler_yes}/>
      </CardActions>);
    return (<Dialog
          title={this.state.modal_dlg_msg}
          modal
          actions={actions}
          open={this.state.modal_dlg_open}
          />);   
  }

  // ------------------------------------------------------------------
  render() {

    if( !this.state.connected ) 
      return this.renderDisconnected();

    if( !this.state.db_id )
      return this.renderSearchForm();

    if( !this.state.db_data ) {
      var search = this.renderSearchButton();
      return (<div>{search}Retrieving data from {this.state.db_id}</div>);
    }

    var dlg = this.renderModalDialog();
    var save = this.renderSaveButton();
    var msg = this.renderSnackBar();
    var form = this.renderForm();
    var json = JSON.stringify( this.state, null, '  ' );
    //console.log( this.state );
    return (<div>{save}{form}<Divider />{msg}{dlg}<pre>{json}</pre></div>);
  }
}

CompRecambiosProformas.propTypes = {
};

