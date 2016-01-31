import React, {PropTypes} from 'react';
import _ from 'lodash';
import TextField from 'material-ui/lib/text-field';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import AutoComplete from 'material-ui/lib/auto-complete';
import ActionSearch from 'material-ui/lib/svg-icons/action/home';
import RaisedButton from 'material-ui/lib/raised-button';

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

import CardActions from 'material-ui/lib/card/card-actions';
import FlatButton from 'material-ui/lib/flat-button';
import Tooltip from 'material-ui/lib/tooltip';
import * as layouts from '../store/db_layouts.js';

const provincias = [
  [ "Barcelona"
  , "Leon"
  , "Madrid"
  , "Navarra"
  , "Sevilla"
  ]
];

export default class CompEditForm extends React.Component {

  fmtDate( dt ) {
    return dt.toLocaleDateString();
  }

  handleChange( field, e ) {
    var changed = {};
    changed[field.field] = e.target.value;
    this.props.onChange( Object.assign( {}, this.props.data, changed));
  }

  handleAutoCompleteChange( field, new_value ) {
    var changed = {};
    changed[field.field] = new_value;
    this.props.onChange( Object.assign( {}, this.props.data, changed));
  }

  handleDateChange( field, this_is_null, new_date ) {
    console.log( "Ctrl returns " + new_date );
    var changed = {};
    changed[field.field] = new_date; 
    this.props.onChange( Object.assign( {}, this.props.data, changed));
  }

  // ---------------------------------------------------------------- 
  renderTable( layout, data ) {
    var json = JSON.stringify( data, null, '  ' );
    var headers_row = [];
    _.forEach( layout.fields, (f)=>{
      headers_row.push( <TableHeaderColumn>{f.field}</TableHeaderColumn> )
    });
    
    var key = 0;
    var data_rows = [];
    _.forEach( data, (v)=>{
      key++;

      var cells = [];
      _.forEach( layout.fields, (f)=>{
        key++;

        var value = v[f.field];

        if( false && f.field === "Cantidad" ) {
          value = (<TextField 
            hintText={f.hint}
            floatingLabelText={f.field}
            value={value}
            style={f.style}
            fullWidth={f.fullWidth}
            multiLine={f.multiLine}
            id={f.field}
            />)
        } 

        cells.push( <TableRowColumn key={key}>{value}</TableRowColumn>)
      })

      data_rows.push(<TableRow key={key}>{cells}</TableRow>);
    });
    console.log( data_rows );

    return (
      <div>
      <Table>
        <TableHeader>
          <TableRow>
            {headers_row}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data_rows}
        </TableBody>
      </Table>
      <pre>{json}</pre>
      </div>
      )
  }

  // ---------------------------------------------------------------- 
  render() {
    const cfg = this.props.layout;
    const obj = this.props.data;

    var key = 0;
    var entries = [];
    for( var idx in cfg.fields ) {
      key++;
      var f = cfg.fields[ idx ];
      if( f.type === "separator" ) {
        entries.push( <div key={key}></div> );
        continue;
      } 
      var value = obj[ f.field ];

      if( f.type === "text" ) {
        entries.push( 
          <TextField 
            className="form_input"
            hintText={f.hint}
            floatingLabelText={f.field}
            value={value}
            style={f.style}
            fullWidth={f.fullWidth}
            multiLine={f.multiLine}
            id={f.field}
            key={key}
            onChange={this.handleChange.bind(this,f)}
            />
          );

      } else if( f.type == "action" ) {

        entries.push( (
        <ActionSearch 
            key={key}
            onClick={this.props.onClick.bind( f.field )}
          />) );

      } else if( f.type == "provincia" ) {
        entries.push( 
          <AutoComplete
            key={key}
            floatingLabelText={f.field}
            filter={AutoComplete.caseInsensitiveFilter}
            searchText={value}
            onUpdateInput={this.handleAutoCompleteChange.bind(this,f)}
            onNewRequest={this.handleAutoCompleteChange.bind(this,f)}
            dataSource={["Barcelona", "Sevilla", "Madrid", "Leon"]}
            /> 
          );

      } else if( f.type == "date" ) {
        var curr_date = new Date( value );
        //console.log( "Rendering date ")
        //console.log( value )
        //console.log( curr_date)
        entries.push( 
          <DatePicker
            hintText={f.field}
            className="form_input"
            key={key} 
            floatingLabelText={f.field}
            autoOk
            textFieldStyle={f.textstyle}
            style={f.style}
            formatDate={this.fmtDate}
            value={curr_date}
            onChange={this.handleDateChange.bind(this,f)}
            mode="landscape" />
          );

      } else if( f.type == "array_table" ) {
        var ext_layout = layouts.get( f.layout );
        console.log( "Array table " + f.layout )
        console.log( ext_layout )
        entries.push( this.renderTable( ext_layout, value ) );

      }
    }

    return (<div className={this.props.layout.class_name}>{entries}</div>);
  }
}

CompEditForm.propTypes = {
  data:     PropTypes.object.isRequired,
  layout:   PropTypes.object.isRequired,
  onClick:  PropTypes.func,
  onChange: PropTypes.func,
  has_changed: PropTypes.bool
};