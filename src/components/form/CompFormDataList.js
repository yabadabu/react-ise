import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import db_combo_selects from '../../store/db_combo_selects';

export default class CompFormDataList extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.lut !== this.props.lut;
  }

  render() {

    const lut = db_combo_selects.luts[ this.props.lut ];
    var options = _.map(lut.id2name,(v,k)=>{
      return (<option key={k} value={k}>{v}</option>);
    });
    return (
      <datalist id={this.props.lut}>
      {options}
      </datalist> 
    );
  }
}

CompFormDataList.propTypes = {
  lut: PropTypes.string.isRequired
};

