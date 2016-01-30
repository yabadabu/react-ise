import React, {PropTypes} from 'react';
import TextField from 'material-ui/lib/text-field';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import AutoComplete from 'material-ui/lib/auto-complete';
import ActionSearch from 'material-ui/lib/svg-icons/action/home';
import RaisedButton from 'material-ui/lib/raised-button';

import CardActions from 'material-ui/lib/card/card-actions';
import FlatButton from 'material-ui/lib/flat-button';
import Tooltip from 'material-ui/lib/tooltip';

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
  renderButtons() {
    const buttons_group_style = {float:"right"};
    if( !this.props.has_changed )
      return "";
    return (
      <CardActions expandable style={buttons_group_style}>
        <RaisedButton label="Save" onClick={this.props.onClick.bind( this, "Save" )} />
        <RaisedButton label="Cancel" onClick={this.props.onClick.bind( this, "Cancel" )} />
      </CardActions>);
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
          <span key={key}><TextField 
            hintText={f.hint}
            floatingLabelText={f.field}
            value={value}
            style={f.style}
            fullWidth={f.fullWidth}
            multiLine={f.multiLine}
            id={f.field}
            onChange={this.handleChange.bind(this,f)}
            /></span>
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
            floatingLabelText={f.field}
            filter={AutoComplete.caseInsensitiveFilter}
            searchText={value}
            key={key}
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
          <div key={key} style={f.style}>
          <DatePicker
            hintText={f.field}
            floatingLabelText={f.field}
            autoOk
            textFieldStyle={f.textstyle}
            style={f.style}
            formatDate={this.fmtDate}
            value={curr_date}
            onChange={this.handleDateChange.bind(this,f)}
            mode="landscape" />
          </div>
          );
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