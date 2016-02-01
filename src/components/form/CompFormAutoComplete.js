import React, { Component, PropTypes } from 'react';

import AutoComplete from 'material-ui/lib/auto-complete';

const provincias =
  [ "Barcelona"
  , "Leon"
  , "Madrid"
  , "Navarra"
  , "Sevilla"
  ];

export default class CompFormAutoComplete extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.value !== this.props.value;
  }

  render() {
    const props = this.props;
    const f     = props.field;
    return (
      <AutoComplete
        floatingLabelText={f.field}
        filter={AutoComplete.caseInsensitiveFilter}
        searchText={props.value}
        onUpdateInput={props.onChange}
        onNewRequest={props.onChange}
        dataSource={provincias}
        /> 
    );
  }
}

CompFormAutoComplete.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default CompFormAutoComplete;