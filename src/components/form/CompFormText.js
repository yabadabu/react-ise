import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/lib/text-field';

const CompFormText = (props) => {
  const f  = props.field;
  let label = props.inside_table ? "" : f.field;
  return (
    <TextField 
      className="form_input"
      hintText={f.hint}
      floatingLabelText={label}
      value={props.value}
      style={f.style}
      fullWidth={f.fullWidth}
      multiLine={f.multiLine}
      id={f.field}
      key={props.key}
      onChange={props.onChange}
      />
  );
};

CompFormText.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.string,
  key: PropTypes.number.isRequired,
  inside_table: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

export default CompFormText;