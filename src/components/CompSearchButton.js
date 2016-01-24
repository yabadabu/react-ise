import React, {PropTypes} from 'react';

const CompSearchButton = (props) => {
  return (
    <IconButton 
      tooltip="Buscar de nuevo" 
      onClick={this.props.onClick(this, null, null)}>
      <ActionSearch/>
    </IconButton>
  )
}

CompSearchButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default FuelSavingsApp;