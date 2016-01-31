import _ from 'lodash';

const all_layouts = {
  proforma: {
    class_name: "proforma",
    title: "Recambios - Proformas",
    table: "[Recambios - Proformas]",
    key_field: 'IDProforma',
    search: {
      fuzzy: {
        fields: [
          { field:"IDProforma", style:{width:"10%"}, filter:"IDProforma like '%__FIELD__%'" },
          { field:"Empresa", style:{width:"70%"}, filter:"Empresa like '%__FIELD__%'" }
        ],
        title: 'Número de la Proforma',
        min_num_chars: 3      // to fire the trigger
      },
      exact: { 
        filter: "IDProforma = '__FIELD__'" 
      }
    },
    fields: [
      //{ field:"Search", type:"action", hint:"Buscar una empresa" },
      { field:"IDProforma", type:"text", hint:"# Proforma", read_only:true, style:{ width:"10%"} },
      { field:"Empresa", type:"text", hint:"Nombre de la empresa", style:{ width:"50%"} },
      { field:"NIF", type:"text", hint:"NIF/CIF", style:{ width:"10%"} },
      { type:"separator"} ,
      { field:"Fecha", type:"date", mode:"landscape", hint:"Fecha de Creación", textstyle:{ width:"90px" }, style:{display:"inline-block" } },
      { field:"Calle", type:"text", style:{ width:"30%" } },
      { field:"Poblacion", type:"text", style:{ width:"30%" } },
      { field:"CP", type:"text", hint:"CP", style:{ width:"10%" } },
      { field:"Provincia", type:"provincia", hint:"Provincia", style:{ width:"15%" } },
      { type:"separator"},
      { field:"Notas", type:"text", multiLine:true, hint:"Notas adicionales", fullWidth:true },
      { field:"details", type:"array_table", layout:"proforma_details", local:"IDProforma", remote:"IDProforma" }
    ]
  },
  proforma_details: {
    key_field: 'ID',
    title: "Details",
    table: "[Recambios - Proformas - Detalles]",
    search: {
      join: { 
        filter: "IDProforma = '__FIELD__'" 
      }
    },
    fields: [
      { field:"REF", type:"text" },
      { field:"Cantidad", type:"number" },
      { field:"EurosUnidad", type:"money" },
      { field:"Total", type:"money" },
      { field:"Tipo", type:"number" },
      { field:"Nota", type:"text" }
    ]
  }
};

export function get( name ) {
  return all_layouts[name];
}

export function getFieldByname( layout, field_name ) {
  const idx = _.findIndex( layout.fields, (r)=>{ return r.field === field_name; } );
  if( idx >= 0 )
    return layout.fields[idx];
  return undefined;
}

export function asYYYYMMDD(dt) {
  var r = (1900 + dt.getYear()) + "/";
  var m = 1 + dt.getMonth();
  var d = dt.getDate();
  if( m < 10 ) 
    r += "0" + m;
  else
    r += m;
  if( d < 10 )
    r += "/0" + d;
  else
    r += "/" + d;
  return r;
}

export function getNewEmptyRegister( layout ) {
  var data = {};
  _.each( layout.fields, (f)=>{
    if( f.field ) {
      if( f.type == "date") 
        data[f.field] = asYYYYMMDD( new Date() );
      else if( f.type == "array_table") 
        data[f.field] = [];
      else if( f.type == "provincia")
        data[f.field] = "";
      else 
        data[f.field] = null;
    } 
  });
  return data;
}



