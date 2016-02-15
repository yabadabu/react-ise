import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import AutoComplete from 'material-ui/lib/auto-complete';
import db_combo_selects from '../../store/db_combo_selects';

export default class CompFormAutoComplete extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      errorText:null
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  onNewRequest(e) {
    var lut = db_combo_selects.luts[ this.props.field.lut ];
    const value = lut.name2id[ e ];
    if( value == undefined ) {
      this.setState({errorText:"Value " + e + " is not valid"});
    } else if( value === "" || value == null ) {
      this.setState({errorText:"Value required"});
    } else {
      this.props.onChange( this.props.field, value );
      this.setState({errorText:null});
    }
  }

  render() {
    const props = this.props;
    const f     = props.field;

//    console.log( f );
//    console.log( db_combo_selects );
//    console.log( props.value );

    var lut = db_combo_selects.luts[ f.lut ];
    var text_value = lut.id2name[ props.value ];
//    console.log( lut );

    return (
      <AutoComplete
        floatingLabelText={f.title}
        filter={AutoComplete.caseInsensitiveFilter}
        searchText={text_value}
        onNewRequest={this.onNewRequest.bind(this)}
        dataSource={lut.names}
        errorText={this.state.errorText}
        /> 
    );
  }
}

CompFormAutoComplete.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default CompFormAutoComplete;