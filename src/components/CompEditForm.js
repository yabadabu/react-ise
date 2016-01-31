import React, {PropTypes} from 'react';
import _ from 'lodash';
import TextField from 'material-ui/lib/text-field';
import ActionSearch from 'material-ui/lib/svg-icons/action/home';
import RaisedButton from 'material-ui/lib/raised-button';

import CompFormText from './form/CompFormText.js';
import CompFormDate from './form/CompFormDate.js';
import CompFormAutoComplete from './form/CompFormAutoComplete.js';
import CompFormTable from './form/CompFormTable.js';

import CardActions from 'material-ui/lib/card/card-actions';
import FlatButton from 'material-ui/lib/flat-button';
import Tooltip from 'material-ui/lib/tooltip';
import * as layouts from '../store/db_layouts.js';

export default class CompEditForm extends React.Component {

  handleHandle( field, new_value ) {
    var changed = {};
    changed[field.field] = new_value;
    this.props.onChange( Object.assign( {}, this.props.data, changed));
  }

  handleTextChange( field, e ) { 
    this.handleHandle( field, e.target.value); 
  }
  handleAutoCompleteChange( field, new_value ) { 
    this.handleHandle( field, new_value); 
  }
  handleDateChange( field, this_is_null, new_date ) {
    this.handleHandle( field, layouts.asYYYYMMDD( new_date )); 
  }

  // ---------------------------------------------------------------- 
  render() {
    const cfg = this.props.layout;
    const obj = this.props.data;

    var key = 0;
    let entries = [];
    for( let idx in cfg.fields ) {
      key++;
      const f = cfg.fields[ idx ];
      if( f.type === "separator" ) {
        entries.push( <div key={key}></div> );
        continue;
      } 
      let value = obj[ f.field ];

      if( f.type === "text" ) {
        entries.push( 
          <CompFormText field={f} value={value} key={key} creating_new={this.props.creating_new} onChange={this.handleTextChange.bind(this,f)}/>
        );

      } else if( f.type == "provincia" ) {
        entries.push( 
          <CompFormAutoComplete field={f} value={value} key={key} onChange={this.handleAutoCompleteChange.bind(this,f)}/>
        );

      } else if( f.type == "date" ) {
        entries.push(
          <CompFormDate field={f} value={value} key={key} onChange={this.handleDateChange.bind(this,f)}/>
        );

      } else if( f.type == "array_table" ) {
        if( !this.props.creating_new )
          entries.push(
            <CompFormTable field={f} value={value} key={key}/>
          );

      } else if( f.type == "action" ) {
        entries.push( (
        <ActionSearch 
            key={key}
            onClick={this.props.onClick.bind( f.field )}
          />) );
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
  creating_new: PropTypes.bool, 
  has_changed: PropTypes.bool
};