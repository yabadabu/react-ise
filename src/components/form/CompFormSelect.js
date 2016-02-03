import React, { Component, PropTypes } from 'react';

import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import _ from 'lodash';

import dbConn from '../../store/db_connection.js';

var cb_select_provincias;

export default class CompFormSelect extends React.Component {

  componentDidMount() {
    if( cb_select_provincias ) {
      console.log( "Provincias Select already valid")
      return;
    }
    console.log( "Sending select of provincias")
    dbConn.DBSelect( '[Codigos Provincias]'
                   , ['IDProvincia', 'NameProvincia']
                   , "(1=1)"
                   , this
                   , (data)=>{
      console.log( "Provincias recv")
      //console.log( data )
      cb_select_provincias = _.map(data,(v)=>{
        return <MenuItem value={v.IDProvincia.toString()} primaryText={v.NameProvincia}/>
      })
      this.forceUpdate();
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.value !== this.props.value
        || nextProps.field !== this.props.field;
  }

  render() {
    console.log( "Rendering select" );
    const props = this.props;
    const f     = props.field;

    return (
      <div>{this.props.value}
      <SelectField 
        value={this.props.value} 
        onChange={this.props.onChange}
        hintText={f.hint}
        >
        {cb_select_provincias}
      </SelectField>
      </div> 
    );
  }
}

/*
        <MenuItem value={"10"} primaryText="Never"/>
        <MenuItem value={"20"} primaryText="Every Night"/>
        <MenuItem value={"30"} primaryText="Weeknights"/>
        <MenuItem value={"40"} primaryText="Weekends"/>
        <MenuItem value={"50"} primaryText="Weekly"/>

*/

CompFormSelect.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

//export default CompFormSelect;