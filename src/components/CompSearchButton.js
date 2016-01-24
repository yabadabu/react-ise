import React, {PropTypes} from 'react';

import IconButton from 'material-ui/lib/icon-button';
import ActionSearch from 'material-ui/lib/svg-icons/action/search';

const CompSearchButton = (props) => {
  return (
    <IconButton 
      tooltip="Buscar de nuevo" 
      onClick={props.onClick}>
      <ActionSearch/>
    </IconButton>
  );
};

CompSearchButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default CompSearchButton;