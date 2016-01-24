import React, {PropTypes} from 'react';

import CompSearchDB from './CompSearchDB';
import CompSearchButton from './CompSearchButton';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';

const style = {
  refresh: {
    display: 'inline-block',
    position: 'relative'
  }
};

// -----------------------------------------------------------------
export default class CompPiezasDetails extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      entry_id: null
    , entry_data: null
    };
  }

  onNewEntryData( new_entry_id, new_entry_data) {
    this.setState({entry_id:new_entry_id, entry_data:new_entry_data});
  }

  render() {

    var show_results = false;
    var entry = "";
    if( this.state.entry_id ) {
      if( this.state.entry_data) {
        var raw_obj = JSON.stringify( this.state.entry_data[0], null, '  ');
        entry = ( 
          <div>
          <CompSearchButton onClick={this.onNewEntryData.bind(this, null, null)}/>
          <pre>{raw_obj}</pre>
          </div>
          );
      } else {
        entry = ( 
          <RefreshIndicator
              size={40}
              left={10}
              top={0}
              status="loading"
              style={style.refresh} />);
      }
    } else {
      show_results = true;
    }

    return (
      <div className="main_section">
        <CompSearchDB 
            onEntryData={this.onNewEntryData.bind(this)}
            showResults={show_results}
            fuzzySearchQuery="EmpresasLike"
            exactSearchQuery="EmpresaByID"
            queryTitle="Nombre de la Empresa"
            />
        {entry}
      </div>
    );
  }
}

CompPiezasDetails.propTypes = {
};

