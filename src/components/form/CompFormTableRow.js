import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import * as layouts from '../../store/db_layouts.js';

import CompFormText from './CompFormText';
import CompFormAutoComplete from './CompFormAutoComplete.js';
import db_combo_selects from '../../store/db_combo_selects';
import CompFormDataList from './CompFormDataList.js';
import ActionDelete from 'material-ui/lib/svg-icons/action/delete';
import CompFormSelect from './CompFormSelect.js';

// -----------------------------------------------------------------
export default class CompFormTableRow extends React.Component {

  componentDidMount() {
    _.each( this.props.layout.fields, (f)=>{
      if( f.focus_on_mount ) 
        this.refs[ f.field ].focus();
    });
  }

  // -----------------------------------------------------------------
  render() {

    //console.log( this.props.layout );
    var row = [];
    var layout = this.props.layout;
    var values = this.props.values;
    var row_idx = this.props.row_idx;
    var unique_id = values[ layout.key_field ];

    _.forEach( layout.fields, (f)=>{

      if( f.type == "hidden")
        return;

      var value = values[f.field];

      if( f.type === "text" || f.type == "number" ) { 
        value = (<CompFormText 
                    field={f} 
                    value={value} 
                    inside_table 
                    creating_new={this.props.creating_new}
                    onChange={this.props.onChange}/>);
      } 

      // Show the text associated to an id of a lut. Not editable, just the name
      // For example the name of a reference code
      // of the reference
      else if( f.type === "lut_text" ) {
        const lut = db_combo_selects.luts[ f.lut ];
        var id  = values[ f.link ];
        value = lut.id2name[ id ];
      }

      // Must show the id of a lut, but show the text close to it.
      // For example a REF which is a valid id but has the text close
      else if( f.type === "lut_id" ) {
/*
        let handle_blur = (e)=>{
          if( e && e.target && e.target.value && f.onBlur ) {
            const new_value = e.target.value;
            // Call the user defined handler, giving him the new_value, the full row values
            // and a callback to change other fields of the same row
            f.onBlur( new_value, values, ( field_name, field_value )=>{
              console.log( "User wants to update ", field_name, " to ", field_value ); 
              var f_to_update = layouts.getFieldByName( layout, field_name );
              if( !f ) {
                console.log( "Field " + field_name + " does not exist in the layout");
                return;
              }
              var fake_e = { target:{ value: field_value }};
              this.props.onChange(f_to_update,fake_e);
            });
          }
        };
                 onBlur={handle_blur}
                 */
        value = (
          <input list={f.lut} 
                 defaultValue={value} 
                 type="text"
                 ref={f.field}
                 onChange={this.props.onChange}
                 >
          </input>
          );
      } 

      // Show the Name, and store the ID in the field. Provincias for example
      else if( f.type === "lut" ) {
        let str_value = (value != undefined) ? value.toString() : null;
        value = (<CompFormAutoComplete 
                    field={f} 
                    value={str_value} 
                    style={{width:"auto"}}
                    onChange={this.props.onChange}
                    />);
      }

      // Show the Name, and store the ID. Picking just one of the available choices No input text
      else if( f.type === "select" ) {
        let str_value = (value != undefined) ? value.toString() : null;
        value = (<CompFormSelect 
                    value={str_value} 
                    field={f} 
                    onChange={this.props.onChange}/>);
      }
      
      else if( f.type === "computed" ) {
        value = f.formula( values );
      }
      
      else if( f.type === "action" ) {
        if( !values["_is_new"] )
          value = (<ActionDelete 
              onClick={this.props.onClick.bind(this,f,row_idx)}
            />);
      }

      row.push( <td key={f.field} className={f.className}>{value}</td>);
    });

    //console.log( headers_row );
    return (
      <tr row_idx={unique_id}>
      {row}
      </tr>
    );
  }
}

CompFormTableRow.propTypes = {
  layout: PropTypes.object.isRequired
, values: PropTypes.object.isRequired
, row_idx: PropTypes.number.isRequired
, onChange: PropTypes.func.isRequired
, onClick: PropTypes.func
, creating_new: PropTypes.bool
};

export default CompFormTableRow;