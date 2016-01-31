import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/lib/text-field';

const CompFormText = (props) => {
  const f  = props.field;
  const label = props.inside_table ? "" : f.field;
  const disabled = f.read_only && !props.creating_new;
  let style = f.style;
  let inputStyle = f.inputStyle;
  if( !inputStyle ) inputStyle = {};
  if( !style ) style = {};
  if( f.type === "number" || f.type === "money") {
    inputStyle["textAlign"] = "right";
    style["width"] = null;
  }
  return (
    <TextField 
      className="form_input"
      hintText={f.hint}
      floatingLabelText={label}
      value={props.value}
      style={style}
      inputStyle={inputStyle}
      fullWidth={f.fullWidth}
      multiLine={f.multiLine}
      id={f.field}
      disabled={disabled}
      onChange={props.onChange}
      />
  );
};

CompFormText.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
    ]),
  inside_table: PropTypes.bool,
  creating_new: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

export default CompFormText;