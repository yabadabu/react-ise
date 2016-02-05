import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import * as layouts from '../../store/db_layouts.js';

import CompFormTableRow from './CompFormTableRow';
import CompFormTableLayoutHeaders from './CompFormTableLayoutHeaders';
import CompFormDataList from './CompFormDataList.js';

const CompFormTable = (props) => {
  const f      = props.field;
  const layout = layouts.get( f.layout );
  const values = props.value;

  // ---------------------------------------------------------------------
  // Collect information about which row/field has changed, and sent it back
  var handleChanges = ( field, row_id, row_idx, e ) => {
    /*
    console.log( "Table: handleChanges ");
    console.log( field );
    console.log( row_id );
    console.log( e.target.value );
    */
    props.onChange( field, row_id, row_idx, e.target.value );
  };

  // For each row
  var row_idx = 0;
  var data_rows = [];
  _.forEach( values, (row_values)=>{
    // For each field
    var row = (<CompFormTableRow 
                  layout={layout} 
                  values={row_values} 
                  onChange={handleChanges}
                  row_idx={row_idx}
                  key={row_idx}
                  />);
    data_rows.push(row);
    row_idx++;
  });

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
  value: PropTypes.array.isRequired
};

export default CompFormTable;