import React, {PropTypes} from 'react';
import _ from 'lodash';
import TextField from 'material-ui/lib/text-field';
import ActionSearch from 'material-ui/lib/svg-icons/action/home';
import ActionFindInPage from 'material-ui/lib/svg-icons/action/find-in-page';
import ActionInput from 'material-ui/lib/svg-icons/action/trending-up';

import RaisedButton from 'material-ui/lib/raised-button';

import CompFormText from './form/CompFormText.js';
import CompFormDate from './form/CompFormDate.js';
import CompFormAutoComplete from './form/CompFormAutoComplete.js';
import CompFormTable from './form/CompFormTable.js';
import CompFormSelect from './form/CompFormSelect.js';
import CompSearchDB from './CompSearchDB.js';
 
import Dialog from 'material-ui/lib/dialog';
import CardActions from 'material-ui/lib/card/card-actions';

import * as layouts from '../store/db_layouts.js';

// -------------------------------------------------------------
// From a layout creates instances of form components
// all data changes are forwarded to the props
// -------------------------------------------------------------
export default class CompEditForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modal_dlg_open: false
    , modal_dlg_field: null   // Which ctrl triggered the open dialog action
    };
  }

  // -------------------------------------------------------------
  handleHandle( field, new_value ) {
    var changed = {};
    changed[field.field] = new_value;
    this.props.onChange( Object.assign( {}, this.props.data, changed));
  }

  handleTextChange( field, e ) { 
    this.handleHandle( field, e.target.value); 
  }
  handleAutoCompleteChange( field, new_value ) { 
    this.handleHandle( field, new_value); 
  }
  handleSelectChange( field, event, index, new_value ) { 
    this.handleHandle( field, new_value); 
    //console.log( field, event, index, new_value )
  }
  handleDateChange( field, this_is_null, new_date ) {
    this.handleHandle( field, layouts.asYYYYMMDD( new_date )); 
  }
  handleTableChange( main_field, external_field, external_id, external_idx, new_value ) {
    /*
    console.log( "at handleTableChange" );
    console.log( this );
    console.log( main_field );
    console.log( external_field );
    console.log( external_id );
    console.log( external_idx );
    console.log( new_value );
    console.log( this.props.data );
    */
    var new_data = this.props.data[main_field.field];
    //new_data[ external_idx ] = _.clone( this.props.data[main_field.field][ external_idx ] );
    new_data[ external_idx ][ external_field.field ] = new_value;
    //console.log( new_data );
    this.handleHandle( main_field, new_data); 
  }

  handleTableClick( main_field, external_field, external_id, external_idx ) {
    /*
    console.log( "at handleTableClick" );
    console.log( this );
    console.log( main_field );        // details
    console.log( external_field );    // f.field = Delete
    console.log( external_id );       // unique id of the row
    console.log( external_idx );      // index in props
    console.log( this.props.data );
    */
    var rows = this.props.data[main_field.field];
    //console.log( "About to delete row idx ", external_idx, " from ", rows);
    //rows.splice( external_idx, 1 );
    rows[ external_idx ]._deleted = true;
    //console.log( new_data );
    this.handleHandle( main_field, rows); 
  }

  handleAddNewDetailOnTable( f ) {
    console.log( "Adding new item" );
    console.log( f );
    // Get access to the details layout
    const ext_layout = layouts.get( f.layout );
    var new_rec = layouts.getNewEmptyRegister( ext_layout );
    // Get access to the full 'details'
    var all_details = this.props.data[f.field];
    new_rec._is_new = true;
    all_details.push( new_rec );
    this.handleHandle( f, all_details); 
  }

  // ---------------------------------------------------------------- 
  handleOpenDlgLayout( f ) {
    this.setState({modal_dlg_open:true, modal_dlg_field:f});
  }

  // Cancelling the dialog
  handleDlgClick( f ) {
    this.setState({modal_dlg_open:false});
  }

  handleDlgChooseFromDB(f,row) {
    // Do a bulk update of all the fields at f.update_fields
    var changed = {};
    _.each( f.update_fields, (v,k)=>{
      //console.log( "Update ", v, " to ", k, row[k] );
      changed[v] = row[k];
    });
    //console.log( "Dlg closes and updates: ", changed, row, f.update_fields );
    this.props.onChange( Object.assign( {}, this.props.data, changed));
    this.setState({modal_dlg_open:false});
  }

  // ---------------------------------------------------------------- 
  renderModalDialog() {
    const f = this.state.modal_dlg_field;
    if( !f )
      return;
    const layout = layouts.get( f.layout );

    var actions = (
      <CardActions >
      <RaisedButton label="Cancelar" onClick={this.handleDlgClick.bind(this)}/>
      </CardActions>);

    const title = layout ? layout.title : "";
    return (
      <Dialog modal
        open={this.state.modal_dlg_open}
        title={title}
        actions={actions}
        autoDetectWindowHeight={false}
        autoScrollBodyContent
        >
        <CompEditForm 
          data={this.props.data} 
          onClick={this.handleDlgClick.bind(this, f)}
          onChooseFromDBSearch={this.handleDlgChooseFromDB.bind(this,f)}
          layout={layout}
          creating_new
          />
      </Dialog>
    );
  }

  // ---------------------------------------------------------------- 
  render() {
    const cfg = this.props.layout;
    const obj = this.props.data;

    var key = 1;
    let entries = [];
    for( let idx in cfg.fields ) {
      key++;
      const f = cfg.fields[ idx ];
      if( f.type === "separator" ) {
        entries.push( <div key={key}></div>);
        continue;
      } 
      let value = obj[ f.field ];
      let str_value = value ? value.toString() : null;

      if( f.type === "text" ) {
        entries.push( 
          <CompFormText field={f} value={value} key={key} creating_new={this.props.creating_new} onChange={this.handleTextChange.bind(this,f)}/>
        );

      } else if( f.type === "lut" ) {
        entries.push( 
          <CompFormAutoComplete field={f} value={str_value} key={key} onChange={this.handleAutoCompleteChange.bind(this,f)}/>
        );

      } else if( f.type === "date" ) {
        entries.push(
          <CompFormDate field={f} value={value} key={key} onChange={this.handleDateChange.bind(this,f)}/>
        );

      } else if( f.type === "select" ) {
        entries.push(
          <CompFormSelect field={f} value={str_value} key={key} onChange={this.handleSelectChange.bind(this,f)}/>
        );

      } else if( f.type === "db_search" ) {
        var layout_data = layouts.get( f.layout );    // search_cliente object
        entries.push(
          <CompSearchDB layout={layout_data} key={key} 
                        no_action_buttons 
                        no_headers 
                        onClickSearchResult={this.props.onChooseFromDBSearch.bind(this)}/>
        );

      } else if( f.type === "modal_dialog" ) {
        entries.push( (
        <ActionInput
            key={key}
            onClick={this.handleOpenDlgLayout.bind( this, f )}
          />) );

      } else if( f.type === "computed" ) {
        var computed_value = f.formula( obj );
        entries.push(
          <TextField 
            className="form_input"
            hintText={f.hint}
            value={computed_value}
            disabled
            id={f.field}
            />
        );

      } else if( f.type === "array_table" ) {
        // Don't show the details if we are still creating the main record
        if( this.props.creating_new )
          continue;
        entries.push(
          <CompFormTable field={f} value={value} key={key}
                         onClick={this.handleTableClick.bind(this,f)}
                         onChange={this.handleTableChange.bind(this,f)}
                         onClickNew={this.handleAddNewDetailOnTable.bind(this,f)}
                         />
        );

      } else if( f.type === "action" ) {
        entries.push( (
        <ActionSearch 
            key={key}
            onClick={this.props.onClick.bind( f.field )}
          />) );
      }
    }

    key++;

    var dialog = this.renderModalDialog();
    return (<div key={key} className={this.props.layout.class_name}>{entries}{dialog}</div>);
  }
}

CompEditForm.propTypes = {
  data:     PropTypes.object.isRequired,
  layout:   PropTypes.object.isRequired,
  onClick:  PropTypes.func,
  onChange: PropTypes.func,
  onChooseFromDBSearch: PropTypes.func,
  creating_new: PropTypes.bool, 
  has_changed: PropTypes.bool
};