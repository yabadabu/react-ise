// This file bootstraps the app with the boilerplate necessary
// to support hot reloading in Redux
import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CompSideMenu from '../components/CompSideMenu';
import CompFullLayoutDB from '../components/CompFullLayoutDB';

import AppBar from 'material-ui/lib/app-bar';
import Paper from 'material-ui/lib/paper';

import * as FuelSavingsActions from '../actions/fuelSavingsActions';

class AppMain extends React.Component {

  handleTouchTap() {
    this.props.actions.changeState( 'menuMainSectionOpened', true );
  }

  render() {

    //console.log( this.props );
    const main_section = this.props.fuelSavingsAppState.selectedMainSection;

    // The generated details
    var section_details;
    //if( main_section === "Empresas" ) section_details = (<CompCompanyDetails/>);
    //else 
    //if( main_section === "Piezas Facturas" ) section_details = (<CompPiezasFacturasDetails/>);
    //else 
    if( main_section === "Recambios Proformas" ) section_details = (<CompFullLayoutDB layout="proforma"/>);
    else
      section_details = (<div>{main_section} not implemented</div>);
    // App main is viewing {main_section}

    return (
      <div>
       
        <AppBar
          title= {"Ilpra Systems España, S.L. - " + main_section}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onTouchTap={this.handleTouchTap.bind(this)}
        />

        <CompSideMenu selectedMainSection={this.props.fuelSavingsAppState.selectedMainSection}
                      opened={this.props.fuelSavingsAppState.menuMainSectionOpened}
                      actions={this.props.actions}
                      />

        {section_details}

      </div>
    );
  }
}

AppMain.propTypes = {
  actions: PropTypes.object.isRequired,
  fuelSavingsAppState: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    fuelSavingsAppState: state.fuelSavingsAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(FuelSavingsActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppMain);