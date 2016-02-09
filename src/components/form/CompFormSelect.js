import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import db_combo_selects from '../../store/db_combo_selects';

export default class CompFormSelect extends React.Component {

  render() {
    const props = this.props;
    const f     = props.field;
    const lut   = db_combo_selects.luts[ f.lut ];
    const items = _.map( lut.id2name, (v,k)=>{ return (<MenuItem key={k} value={k} primaryText={v}/>); });

    return (
      <div>
      <SelectField 
        value={this.props.value} 
        onChange={this.props.onChange}
        hintText={f.hint}
        >
        {items}
      </SelectField>
      </div> 
    );
  }
}

CompFormSelect.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

//export default CompFormSelect;