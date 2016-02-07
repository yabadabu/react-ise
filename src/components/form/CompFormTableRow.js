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
    console.log( "RowAutoComplete", new_value );
    //props.onChange.bind(this, f, unique_id, row_idx)}
  }

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
        var str_value = value ? value.toString : null;
        value = (<CompFormAutoComplete 
                    field={f} 
                    value={str_value} 
                    onChange={this.onAutoCompleteChanges.bind(this)}
                    />);
      }
      
      else if( f.type === "computed" ) {
        value = f.formula( values );
      }
      
      else if( f.type === "action" ) {
        value = (<ActionDelete 
            onClick={this.props.onClick.bind(this,f,unique_id,row_idx)}
          />);
      }

      var style = {};
      if( f.format === "currency" ) 
        style["textAlign"] = "right";

      row.push( <td key={f.field} style={style}>{value}</td>);
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
};

export default CompFormTableRow;