import React, {PropTypes} from 'react';
import TextField from 'material-ui/lib/text-field';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import AutoComplete from 'material-ui/lib/auto-complete';
import ActionSearch from 'material-ui/lib/svg-icons/action/home';

const provincias = [
  [ "Barcelona"
  , "Leon"
  , "Madrid"
  , "Navarra"
  , "Sevilla"
  ]
];

const all_layouts = {
  proforma: {
    fields: [
      { field:"Search", type:"action", hint:"Buscar una empresa" }
    , { field:"Empresa", type:"text", hint:"Nombre de la empresa", style:{ width:"70%"} }
    , { field:"NIF", type:"text", hint:"NIF/CIF", style:{ width:"10%"} }
    , { field:"Fecha", type:"date", mode:"landscape", hint:"Fecha de Creación", textstyle:{ width:"80px" }, style:{display:"inline-block" } }
    , { type:"separator"}
    , { field:"Calle", type:"text", style:{ width:"30%" } }
    , { field:"Poblacion", type:"text", style:{ width:"30%" } }
    , { field:"CP", type:"text", hint:"CP", style:{ width:"10%" } }
    , { field:"Provincia", type:"provincia", hint:"Provincia", style:{ width:"15%" } }
    , { type:"separator"}
    , { field:"Notas", type:"text", multiLine:true, hint:"Notas adicionales", fullWidth:true }
    ]
  }
};

export default class CompEditForm extends React.Component {

  formatDate( date ) {
    //var dobj = Date( date );
    return date.toLocaleDateString();
  }

/*
  formatDate2(date) {
    var year = date.getFullYear(),
        month = date.getMonth() + 1, // months are zero indexed
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
        minuteFormatted = minute < 10 ? "0" + minute : minute,
        morning = hour < 12 ? "am" : "pm";

    return day + "/" + month + "/" + year + " " + hourFormatted + ":" +
            minuteFormatted + morning;
  }
  */

  handleChange( field, e ) {
    var changed = {};
    changed[field.field] = e.target.value;
    this.props.onChange( Object.assign( {}, this.props.data, changed))
  }

  handleAutoCompleteChange( field, new_value ) {
    var changed = {};
    changed[field.field] = new_value;
    this.props.onChange( Object.assign( {}, this.props.data, changed))
  }

  handleDateChange( field, this_is_null, new_date ) {
    var changed = {};
    changed[field.field] = new_date.toLocaleDateString(); // this.formatDate( new_date );
    this.props.onChange( Object.assign( {}, this.props.data, changed))
  }

  render() {
    const cfg = all_layouts[ this.props.layout ];
    var entries = [];

    var obj = this.props.data;

    for( var idx in cfg.fields ) {
      var f = cfg.fields[ idx ];
      if( f.type === "separator" ) {
        entries.push( <div></div> );
        continue;
      } 
      var value = obj[ f.field ]
      if( f.type === "text" ) {
        entries.push( 
          <span><TextField 
            hintText={f.hint}
            floatingLabelText={f.field}
            value={value}
            style={f.style}
            fullWidth={f.fullWidth}
            multiLine={f.multiLine}
            id={f.field}
            onChange={this.handleChange.bind(this,f)}
            key={idx}/></span>
          );

      } else if( f.type == "action" ) {
        entries.push( (
          <ActionSearch 
            onClick={this.props.onClick.bind( f.field )}
          />
          ) );

      } else if( f.type == "provincia" ) {
        entries.push( 
          <AutoComplete
            floatingLabelText={f.field}
            filter={AutoComplete.caseInsensitiveFilter}
            onUpdateInput={this.handleAutoCompleteChange.bind(this,f)}
            onNewRequest={this.handleAutoCompleteChange.bind(this,f)}
            dataSource={["Barcelona", "Sevilla", "Madrid", "Leon"]}
            /> 
          );

      } else if( f.type == "date" ) {
        entries.push( 
          <div style={f.style}>
          <DatePicker
            hintText={f.hint}
            floatingLabelText={f.field}
            autoOk
            textFieldStyle={f.textstyle}
            style={f.style}
            formatDate={this.formatDate}
            onChange={this.handleDateChange.bind(this,f)}
            mode="landscape" />
            </div>
          );

      }
    }

    var json = JSON.stringify( obj, null, '  ' );
    entries.push( <pre>{json}</pre> )
    return (<div className={this.props.layout}>{entries}</div>);
  }
}

CompEditForm.propTypes = {
  data: PropTypes.object.isRequired
, layout: PropTypes.string.isRequired
, onChange: PropTypes.function
, onClick: PropTypes.function
};