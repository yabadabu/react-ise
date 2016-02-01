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
    var key = 1;
    var headers_row = [];
    _.forEach( this.props.layout.fields, (f)=>{
      var style = {};
      var title = f.field;
      if( f.type == "number" || f.type == "money") 
        style.textAlign = ["right"];
      if( f.type == "money")
        title = title + " €";
      headers_row.push( <TableHeaderColumn key={key} style={style}>{title}</TableHeaderColumn> );
      key++;
    });

    return (
      <TableHeader>
        <TableRow>
          {headers_row}
        </TableRow>
      </TableHeader>
    );
  }
}

CompFormTableLayoutHeaders.propTypes = {
  layout: PropTypes.object.isRequired
};

export default CompFormTableLayoutHeaders;