import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import TableHeader from 'material-ui/lib/table/table-header';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';

// -----------------------------------------------------------------
export default class CompFormTableLayoutHeaders extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.layout !== this.props.layout;
  }

  render() {

    //console.log( "Layout heade rrender");
    //console.log( this.props.layout );
    var key = 1;
    var headers_row = [];
    _.forEach( this.props.layout.fields, (f)=>{

      if( f.type == "hidden")
        return;

      //console.log( f );
      var style = f.column_style || {};
      var title = f.field;
      if( f.title ) 
        title = f.title;
      if( f.type === "number" || f.className === "currency") 
        style.textAlign = ["right"];
      headers_row.push( <th key={key} style={style}>{title}</th> );
      key++;
    });

    return (
      <thead>
      <tr>
      {headers_row}
      </tr>
      </thead>
    );
  }
}

CompFormTableLayoutHeaders.propTypes = {
  layout: PropTypes.object.isRequired
};

export default CompFormTableLayoutHeaders;