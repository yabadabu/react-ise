import React, {PropTypes} from 'react';
import Menu from 'material-ui/lib/menus/menu';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';

const style = {
  marginRight: 16,
  marginBottom: 32,
  float: 'left',
  position: 'relative',
  zIndex: 0
};

export default class CompSideMenu extends React.Component {

  //<MenuItem primaryText="Recambios" onTouchTap={this.handleChange.bind(null, "Recambios")}/>
  handleChange(e) {
    //console.log( e );
    this.props.actions.selectMainSection(e);
  }

  render() {

    var idx = 0;
    var titles = [
          "Empresas"
        , "Recambios Proformas"
        , "Recambios"
        , "-"
        , "Consultas"
        , "Settings"
        ];
    var menu_items = titles.map( (title)=>{
      idx = idx + 1;
      if( title == '-') return (<Divider key={idx}/>);
      var checked = ( this.props.selectedMainSection == title ) ;
      //console.log( "Adding idx " + idx);
      return (<MenuItem primaryText={title} 
                        checked={checked} 
                        key={idx}
                        onTouchTap={this.handleChange.bind( this, title )}/>);
    });

    return (
      <LeftNav
          docked={false}
          width={200}
          open={this.props.opened}
        >

        {menu_items}

      </LeftNav>
    );
  }
}

CompSideMenu.propTypes = {
  actions: PropTypes.object.isRequired,
  selectedMainSection: PropTypes.string.isRequired,
  opened: PropTypes.bool.isRequired
};

