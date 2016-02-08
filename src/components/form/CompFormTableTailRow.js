import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import CompFormText from './CompFormText';
import CompFormAutoComplete from './CompFormAutoComplete.js';
import db_combo_selects from '../../store/db_combo_selects';
import CompFormDataList from './CompFormDataList.js';
import ActionDelete from 'material-ui/lib/svg-icons/action/delete';

import RaisedButton from 'material-ui/lib/raised-button';
import CardActions from 'material-ui/lib/card/card-actions';
import FlatButton from 'material-ui/lib/flat-button';

// -----------------------------------------------------------------
export default class CompFormTableTailRow extends React.Component {

  render() {

    //console.log( "Layout heade rrender");
    //console.log( this.props.layout );
    var key = 1;
    var tail_row = [];
    _.forEach( this.props.layout.tail_fields, (f)=>{

      if( f.type == "hidden")
        return;

      var value = null;
      if( f.type == "computed") {
        value = f.formula(this.props.values);
      
      } else if( f.type == "label") {
        value = f.field;

      } else if( f.type == "actionNew") {
        const new_visible = ( this.props.values.length === 0 || !_.last( this.props.values )._is_new );
        if( new_visible )
          value = (
            <CardActions key={f.field} >
            <RaisedButton label="New Detail" onClick={this.props.onClickNew}/> 
            </CardActions>
            );
        else 
          value = "";

      }

      tail_row.push( <td key={key} style={f.style} colSpan={f.colSpan} className={f.className}>{value}</td> );
      key++;
    });


    //console.log( headers_row );
    return (
      <tr row_idx="tail">
      {tail_row}
      </tr>
    );
  }
}

CompFormTableTailRow.propTypes = {
  layout: PropTypes.object.isRequired
, values: PropTypes.array.isRequired
, onClick: PropTypes.func
, onClickNew: PropTypes.func
};

export default CompFormTableTailRow;
