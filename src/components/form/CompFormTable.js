import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import * as layouts from '../../store/db_layouts.js';

import CompFormTableRow from './CompFormTableRow';
import CompFormTableLayoutHeaders from './CompFormTableLayoutHeaders';
import CompFormDataList from './CompFormDataList.js';
import CompFormTableTailRow from './CompFormTableTailRow';

const CompFormTable = (props) => {
  const f      = props.field;
  const layout = layouts.get( f.layout );
  const values = props.value;

  // ---------------------------------------------------------------------
  // Collect information about which row/field has changed, and sent it back
  var handleChanges = ( row_idx, field, new_value ) => {
    /*
    console.log( "----Table: handleChanges ");
    console.log( "row_idx", row_idx );
    console.log( "field", field );
    console.log( "new_value", new_value );
    */
    props.onChange( row_idx, field, new_value );
  };

  // ---------------------------------------------------------------------
  // Adds the row_idx
  var handleClick = ( row_idx, field ) => {
    /*
    console.log( "----Table: handleClick ");
    console.log( "row_idx", row_idx );
    console.log( "field", field );
    */
    props.onClick( row_idx, field );
  };

  // For each row
  var row_idx = 0;
  var data_rows = [];
  _.forEach( values, (row_values)=>{

    // Discard delete subrows
    if( row_values && !row_values._deleted ) {
      
      // For each field
      var row = (<CompFormTableRow 
                    layout={layout} 
                    values={row_values} 
                    onChange={handleChanges.bind(this, row_idx)}
                    onClick={handleClick.bind(this, row_idx)}
                    row_idx={row_idx}
                    key={row_idx}
                    />);
      data_rows.push(row);
    }
    row_idx++;
  });

  // A last row to show the "Add Detail" button and some totals 
  if( layout.tail_fields ) {
    var tail_row = (<CompFormTableTailRow 
                  layout={layout} 
                  values={values} 
                  key={row_idx}
                  onClickNew={props.onClickNew}
                  />);
    data_rows.push(tail_row);
  }

  return (
    <div>
    <CompFormDataList lut="Recambios.REF"/>
    <table>
    <CompFormTableLayoutHeaders layout={layout}/>
    <tbody>
      {data_rows}
    </tbody>
    </table> 
    </div> 
   );
};

CompFormTable.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onClickNew: PropTypes.func
};

export default CompFormTable;