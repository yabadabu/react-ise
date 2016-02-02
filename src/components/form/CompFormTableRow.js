import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import CompFormText from './CompFormText';

// -----------------------------------------------------------------
export default class CompFormTableRow extends React.Component {

  render() {

    //console.log( this.props.layout );
    var key = 1;
    var row = [];
    var layout = this.props.layout;
    var values = this.props.values;
    var row_idx = this.props.row_idx;
    var unique_id = values[ layout.key_field ];

    _.forEach( layout.fields, (f)=>{

      var value = values[f.field];

      if( f.type === "text" || f.type == "number" || f.type == "money") 
        value = (<CompFormText 
                    key={key} 
                    field={f} 
                    value={value} 
                    inside_table 
                    onChange={this.props.onChange.bind(this, f, unique_id, row_idx)}
                  />);
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