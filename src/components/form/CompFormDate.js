import React, { Component, PropTypes } from 'react';

import DatePicker from 'material-ui/lib/date-picker/date-picker';
import * as layouts from '../../store/db_layouts.js';

function fmtDate( dt ) {
  return dt.toLocaleDateString();
}

const CompFormDate = (props) => {
  const f         = props.field;
  const curr_date = new Date( props.value );

  // Drop the first argument, and send date in a god format for us
  let handleChange = ( this_is_null, new_date ) => {
    props.onChange( f, layouts.asYYYYMMDD( new_date )); 
  };

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
      onChange={handleChange}
      />);
};

CompFormDate.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default CompFormDate;