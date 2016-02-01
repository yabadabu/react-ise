import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import * as layouts from '../../store/db_layouts.js';

import Table from 'material-ui/lib/table/table';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

import CompFormText from './CompFormText';
import CompFormTableLayoutHeaders from './CompFormTableLayoutHeaders';

const CompFormTable = (props) => {
  const f      = props.field;
  const layout = layouts.get( f.layout );
  const values = props.value;
  var key = 0;

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
  _.forEach( values, (v)=>{

    // For each field
    var unique_id = v[ layout.key_field ];
    //console.log( "Unique id is " + unique_id );
    var cells = [];
    _.forEach( layout.fields, (f)=>{

      var value = v[f.field];

      if( f.type === "text" || f.type == "number" || f.type == "money") 
        value = (<CompFormText key={key} field={f} value={value} inside_table onChange={handleChanges.bind(this, f, unique_id, row_idx)}/>);
      key++;

      cells.push( <TableRowColumn key={key}>{value}</TableRowColumn>);
      key++;
    });

    data_rows.push(<TableRow key={key}>{cells}</TableRow>);
    row_idx++;
    key++;
  });

  return (

    <Table key={props.key} selectable={false}>
      <CompFormTableLayoutHeaders layout={layout}/>)
      <TableBody>
        {data_rows}
      </TableBody>
    </Table>
    );
};

CompFormTable.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.array.isRequired
};

export default CompFormTable;