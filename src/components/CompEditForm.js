import React, {PropTypes} from 'react';
import _ from 'lodash';
import TextField from 'material-ui/lib/text-field';
import ActionSearch from 'material-ui/lib/svg-icons/action/home';
import RaisedButton from 'material-ui/lib/raised-button';

import CompFormText from './form/CompFormText.js';
import CompFormDate from './form/CompFormDate.js';
import CompFormAutoComplete from './form/CompFormAutoComplete.js';
import CompFormTable from './form/CompFormTable.js';
import CompFormSelect from './form/CompFormSelect.js';

import CardActions from 'material-ui/lib/card/card-actions';
import FlatButton from 'material-ui/lib/flat-button';
import Tooltip from 'material-ui/lib/tooltip';
import * as layouts from '../store/db_layouts.js';

export default class CompEditForm extends React.Component {

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
  render() {
    const cfg = this.props.layout;
    const obj = this.props.data;

    var key = 1;
    let entries = [];
    for( let idx in cfg.fields ) {
      key++;
      const f = cfg.fields[ idx ];
      if( f.type === "separator" ) {
        entries.push( <div key={key}></div> );
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

      } else if( f.type === "array_table" ) {
        if( this.props.creating_new )
          continue;
        entries.push(
          <CompFormTable field={f} value={value} key={key}
                         onClick={this.handleTableClick.bind(this,f)}
                         onChange={this.handleTableChange.bind(this,f)}/>
        );
        if( value.length === 0 || !_.last( value )._is_new ) {
          key++;
          entries.push( 
            <CardActions key={key} >
            <RaisedButton label="New Detail" onClick={this.handleAddNewDetailOnTable.bind(this,f)} />
            </CardActions>);
        }

      } else if( f.type === "action" ) {
        entries.push( (
        <ActionSearch 
            key={key}
            onClick={this.props.onClick.bind( f.field )}
          />) );
      }
    }

    key++;
    return (<div key={key} className={this.props.layout.class_name}>{entries}</div>);
  }
}

CompEditForm.propTypes = {
  data:     PropTypes.object.isRequired,
  layout:   PropTypes.object.isRequired,
  onClick:  PropTypes.func,
  onChange: PropTypes.func,
  creating_new: PropTypes.bool, 
  has_changed: PropTypes.bool
};