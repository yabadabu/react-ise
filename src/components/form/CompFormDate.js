import React, { Component, PropTypes } from 'react';

import DatePicker from 'material-ui/lib/date-picker/date-picker';

function fmtDate( dt ) {
  return dt.toLocaleDateString();
}

const CompFormDate = (props) => {
  const f         = props.field;
  const curr_date = new Date( props.value );
  return (
    <DatePicker
      hintText={f.field}
      className="form_input"
      floatingLabelText={f.field}
      autoOk
      textFieldStyle={f.textstyle}
      style={f.style}
      formatDate={fmtDate}
      value={curr_date}
      mode="landscape" 
      onChange={props.onChange}
      />);
};

CompFormDate.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default CompFormDate;