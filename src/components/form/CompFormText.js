import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/lib/text-field';

const CompFormText = (props) => {
  const f  = props.field;
  const label = props.inside_table ? "" : f.field;
  const disabled = f.read_only && !props.creating_new;
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
      disabled={disabled}
      onChange={props.onChange}
      />
  );
};

CompFormText.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.string,
  key: PropTypes.number.isRequired,
  inside_table: PropTypes.bool,
  creating_new: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

export default CompFormText;