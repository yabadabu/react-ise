import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import CompFormText from './CompFormText';
import CompFormAutoComplete from './CompFormAutoComplete.js';
import db_combo_selects from '../../store/db_combo_selects';
import CompFormDataList from './CompFormDataList.js';
import ActionDelete from 'material-ui/lib/svg-icons/action/delete';

// -----------------------------------------------------------------
export default class CompFormTableRow extends React.Component {

  onAutoCompleteChanges( new_value ) {
    console.log( "RowAutoComplete", new_value )
    //props.onChange.bind(this, f, unique_id, row_idx)}
  }

  onClick( f, row) {
    console.log( f.field, row );
  }

  render() {

    //console.log( this.props.layout );
    var key = 1;
    var row = [];
    var layout = this.props.layout;
    var values = this.props.values;
    var row_idx = this.props.row_idx;
    var unique_id = values[ layout.key_field ];

    _.forEach( layout.fields, (f)=>{

      if( f.type == "hidden")
        return;

      var value = values[f.field];

      if( f.type === "text" || f.type == "number" || f.type == "money") { 
        value = (<CompFormText 
                    key={key} 
                    field={f} 
                    value={value} 
                    inside_table 
                    onChange={this.props.onChange.bind(this, f, unique_id, row_idx)}
                  /> );
      } 

      // Show the text associated to an id of a lut. Not editable, just the name
      // of the reference
      else if( f.type === "lut_text" ) {
        const lut = db_combo_selects.luts[ f.lut ];
        var id  = values[ f.link ];
        value = lut.id2name[ id ];
      }

      // Must show the id of a lut, but show the text close to it.
      // For example a REF which is a valid id but has the text close
      else if( f.type === "lut_id" ) {
        const lut = db_combo_selects.luts[ f.lut ];
        value = (
          <input list={f.lut} 
                 value={value} 
                 type="text"
                 onChange={this.props.onChange.bind(this,f,unique_id,row_idx)}>
          </input>
          );
      } 

      // Show the Name, and store the ID in the field. Provincias for example
      else if( f.type === "lut" ) {
        var str_value = value ? value.toString : null
        value = (<CompFormAutoComplete 
                    key={key} 
                    field={f} 
                    value={str_value} 
                    onChange={this.onAutoCompleteChanges.bind(this)}
                    />)
      }
      
      else if( f.type === "action" ) {
        value = (<ActionDelete 
            key={key}
            onClick={this.onClick.bind(this,f,row)}
          />);
      }

      key++;

      row.push( <td key={key}>{value}</td>);
      key++;
    });

    //console.log( headers_row );
    return (
      <tr row_idx={row_idx}>
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
};

export default CompFormTableRow;