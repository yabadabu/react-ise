import React, {PropTypes} from 'react';
import _ from 'lodash';

import CompSearchDB from './CompSearchDB';
import dbConn from '../store/db_connection.js';
import CircularProgress from 'material-ui/lib/circular-progress';
import getLayout from '../store/db_layouts.js';
import Snackbar from 'material-ui/lib/snackbar';

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

const layout = getLayout( "proforma" );

function asYYYYMMDD(dt) {
  var r = (1900 + dt.getYear()) + "/";
  var m = 1 + dt.getMonth();
  var d = dt.getDate();
  if( m < 10 ) 
    r += "0" + m;
  else
    r += m;
  if( d < 10 )
    r += "/0" + d;
  else
    r += "/" + d;
  return r;
}

function getPropertiesOfAChangedFromB( a, b ) {
  if( !a || !b )
    return {};
  var diffs = {}
  for( var k in a ) {
    if( !b[k] || b[k] !== a[k] ) 
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
    , connected: dbConn.isConnected()
    , msg_visible: false
    , msg_text: "blah blah"
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

  onClickNew( e ) {
    console.log( "onClickNew" );
    console.log( e );
  }

  onClickSearchResult( e ) {
    this.setState({db_id: e});
    var resolved_filter = layout.search.exact.filter.replace( /__FIELD__/, e );
    console.log( "onClickSearchResult" );
    console.log( this );
    dbConn.DBSelect( layout.table
                   , ["*"]
                   , resolved_filter
                   , this
                   , (data) => {
      console.log( "DBSelect" );
      console.log( data[0] );
      console.log( this );
      this.validateData( {db_data: data[0], db_orig_data:data[0]} )
    });      
  }

  validateData( ns ) {
    if( ns.db_data ) {
      _.each( layout.fields, (f)=>{
        if( f.type == 'date' ) {
          var old_value = ns.db_data[ f.field ];
          if( typeof old_value === 'string') {
            //console.log( "Correcting string " + f.field + " date from " + old_value)
            let d = new Date( old_value )
            //console.log( "new date_obj " + d)
            let new_value = asYYYYMMDD( d );
            //console.log( "new_value " + new_value)
            ns.db_data[ f.field ] = new_value;
          } else {
            //console.log( "Correcting date " + f.field + " date from " + old_value)
            let d = new Date( old_value )
            let new_value = asYYYYMMDD( d );
            //console.log( "new_value " + new_value)
            ns.db_data[ f.field ] = new_value;
          }
        }
      })
      var ref = this.state.db_orig_data
      if( ns.db_orig_data )
        ref = ns.db_orig_data;
      ns.db_delta = getPropertiesOfAChangedFromB( ref, ns.db_data );
      ns.db_changed_rec = ( Object.keys( ns.db_delta ).length != 0 )
    }

    //console.log( "ns is now")
    //console.log( ns );

    this.setState(ns);
  }

  onDataChange( new_db_data ) {
    console.log( "onDataChange" );
    console.log( "new_db_data" );
    this.validateData({db_data:new_db_data});
  }

  // --------------------------------------------------------------
  onClickCancel( e, dummy  ) {
    console.log( "Restoring...")
    this.validateData({db_data:this.state.db_orig_data});
  }

  // --------------------------------------------------------------
  onClickSave( e, dummy ) {
    if( !this.state.db_changed_rec )
      return;
    console.log( "Saving...")
    var changes = this.state.db_delta;
    delete changes[ 'IDProforma' ];
    console.log( changes );
    dbConn.DBUpdate( '[Recambios - Proformas]'
                   , changes
                   , "IDProforma='"+ this.state.db_id + "'"
                   , this
                   , (data)=>{
                    console.log( "Save completed " + this.state.db_id);
                    console.log( data );
                    this.onClickSearchResult( this.state.db_id );
                    this.setState({msg_visible:true, msg_text:"Registro grabado correctamente"});
                   } );
  }

  // --------------------------------------------------------------
  onClickCopy( ) {
    console.log( "Copying to clipboard...")
  }

  // --------------------------------------------------------------
  onClickPaste( ) {
    console.log( "Pasting from clipboard...")
  }

  // --------------------------------------------------------------
  onClickNew( ) {
    console.log( "New register...")
  }

  // --------------------------------------------------------------
  onClick( e, dummy ) {
    console.log( "On click..." + e )
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
        />);
    //return (<div>You are searching <pre>{code}</pre></div>);
  }

  // ---------------------------------------------------------------- 
  renderSaveButton() {
    const buttons_group_style = {float:"right"};
    var changed = this.state.db_changed_rec
    return (
      <CardActions expandable style={buttons_group_style}>
        <IconButton tooltip="Buscar de nuevo" onClick={this.setState.bind(this, {db_id:null})}><ActionSearch/></IconButton>
        <IconButton tooltip="Copiar Valores" onClick={this.onClickCopy.bind(this)}><ActionCopy/></IconButton>
        <IconButton tooltip="Pegar Valores" onClick={this.onClickPaste.bind(this)}><ActionPaste/></IconButton>
        <IconButton disabled={changed} tooltip="Nuevo Registro" onClick={this.onClickPaste.bind(this)}><ActionNew/></IconButton>
        <IconButton disabled={!changed} tooltip="Guardar Cambios" onClick={this.onClickSave.bind(this)}><ActionSave/></IconButton>
        <IconButton disabled={!changed} tooltip="Deshacer Cambios" onClick={this.onClickCancel.bind(this)}><ActionUndo/></IconButton>
      </CardActions> 
    )   
  }

  renderForm() {
    return(
      <CompEditForm 
        data={this.state.db_data} 
        onChange={this.onDataChange.bind(this)} 
        onClick={this.onClick.bind(this)} 
        layout={layout}/>);
  }

  renderSnackBar() {
    var handler = ()=>{this.setState({msg_visible: false})};
    return (
      <Snackbar
        open={this.state.msg_visible}
        message={this.state.msg_text}
        autoHideDuration={1000}
        onRequestClose={handler}/>);
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

    var save = this.renderSaveButton();
    var msg = this.renderSnackBar();
    var form = this.renderForm();
    var json = JSON.stringify( this.state, null, '  ' );
    console.log( this.state );
    return (<div>{save}{form}{msg}<pre>{json}</pre></div>);
  }
}

CompRecambiosProformas.propTypes = {
};

