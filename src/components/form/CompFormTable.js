import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import * as layouts from '../../store/db_layouts.js';

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

import CompFormText from './CompFormText.js';

const CompFormTable = (props) => {
  const f      = props.field;
  const layout = layouts.get( f.layout );
  const values = props.value;

  var headers_row = [];
  _.forEach( layout.fields, (f)=>{
    var style = {};
    var title = f.field;
    if( f.type == "number" || f.type == "money") 
      style.textAlign = ["right"];
    if( f.type == "money")
      title = title + " €";
    headers_row.push( <TableHeaderColumn style={style}>{title}</TableHeaderColumn> );
  });

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
  var key = 0;
  var row_idx = 0;
  var data_rows = [];
  _.forEach( values, (v)=>{
    key++;

    // For each field
    var unique_id = v[ layout.key_field ];
    //console.log( "Unique id is " + unique_id );
    var cells = [];
    _.forEach( layout.fields, (f)=>{
      key++;

      var value = v[f.field];

      if( f.type === "text" || f.type == "number" || f.type == "money") 
        value = (<CompFormText field={f} value={value} inside_table onChange={handleChanges.bind(this, f, unique_id, row_idx)}/>);

      cells.push( <TableRowColumn key={key}>{value}</TableRowColumn>);
    });

    data_rows.push(<TableRow key={key}>{cells}</TableRow>);
    row_idx++;
  });

  return (

    <Table key={props.key}>
      <TableHeader>
        <TableRow>
          {headers_row}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data_rows}
      </TableBody>
    </Table>
    );
};

CompFormTable.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.array.isRequired,
  key: PropTypes.number.isRequired
};

export default CompFormTable;