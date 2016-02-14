import _ from 'lodash';

function as_euros(x) {
  return x ? (x.toFixed(2)) : "0";
}

const all_layouts = {
  proforma: {
    class_name: "proforma",
    title: "Recambios - Proformas",
    table: "[Recambios - Proformas]",
    key_field: 'IDProforma',
    ChangeDate: true,           // Update queries add the ChangeDate = now()
    search: {
      fuzzy: {
        fields: [
          { field:"IDProforma", style:{width:"10%"}, hint:"ID Proforma", filter:"IDProforma like '%__FIELD__%'", min_num_chars:1 },
          { field:"Empresa",    style:{width:"60%"}, hint:"Empresa",     filter:"Empresa like '%__FIELD__%'", min_num_chars:3, focus_on_mount:true }
        ],
        title: 'Número de la Proforma'
      },
      exact: { 
        filter: "IDProforma = '__FIELD__'" 
      },
      recent: {
        filter: "now() - ChangeDate < 5 ORDER BY ChangeDate DESC"      // 5 days
      }
    },
    fields: [
      { field:"IDProforma", type:"text", hint:"# Proforma", focus_on_mount:true, read_only:true, style:{ width:"75px"} },
      { field:"dlgIDProforma", type:"db_query_and_update"
             , update_fields: { IDProforma:"IDProforma" } },
      { field:"IDCliente", type:"text", read_only:true, style:{ display:"none"} },
      { field:"Empresa", type:"text", hint:"Nombre de la empresa", style:{ width:"40%"} },
      { field:"dlgIDEmpresa", type:"modal_dialog", layout:"dlg_id_cliente"
             , update_fields:{
                // DB exact search table <=> this table
                "Número cliente":"IDCliente"
              , Empresa:"Empresa"
              , NIF:"NIF"
              , CP:"CP"
              , Calle:"Calle"
              , Poblacion:"Poblacion"
              , IDProvincia:"IDProvincia"
              }
             },
      { field:"NIF", type:"text", hint:"NIF/CIF", style:{ width:"10%"} },
      { type:"separator"} ,
      { field:"Fecha", type:"date", mode:"landscape", hint:"Fecha de Creación", textstyle:{ width:"90px" }, style:{display:"inline-block" } },
      //{ field:"ChangeDate", type:"date", hint:"Fecha de Modificación", textstyle:{ width:"90px" }, style:{display:"inline-block" } },
      { field:"Calle", type:"text", style:{ width:"30%" } },
      { field:"Poblacion", type:"text", style:{ width:"30%" } },
      { field:"CP", type:"text", hint:"CP", style:{ width:"70px" } },
      { field:"IDProvincia", type:"lut", lut:"Provincias.ID", title:"Provincia", hint:"Provincia", style:{ width:"15%" } },
      { type:"separator"},
      { field:"Notas", type:"text", multiLine:true, hint:"Notas adicionales", fullWidth:true, can_be_null:true },
      { field:"details", type:"array_table", layout:"proforma_details"
                       , local:"IDProforma", remote:"IDProforma"
                       }
    ]
  },

  // This is the dialog that popup. It contains a single field, which is in fact a search field + results table
  // with it's own layout
  dlg_id_cliente: {
    title: "Buscar Cliente",
    fields: [
      { field:"SearchEmpresa", type:"db_search", layout:"search_cliente" }
    ]
  },
  search_cliente: {
    table: "[Clientes]",
    key_field: 'Número Cliente',
    search: {
      fuzzy: {
        fields: [
          { field:"[Número Cliente]", style:{width:"10%"}
                                    , filter:"[Número Cliente] like '%__FIELD__%'"
                                    , min_num_chars:1 
                                    , hint: "IDCliente"
                                    },
          { field:"Empresa", focus_on_mount:true
                           , style:{width:"80%"}
                           , filter:"Empresa like '%__FIELD__%'"
                           , hint:"Empresa"
                           , min_num_chars:3 
                         }
        ]
      },
      exact: { 
        filter: "[Número Cliente] = __FIELD__" 
      },
      return_exact_query: true      // Return the full row when clicking a row
    }
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
      { field:"ID", type:"hidden", read_only:true },
      { field:"REF", type:"lut_id", lut:"Recambios.REF", hint:"Referencia", column_style:{width:"60px"} },
      { field:"REF.Name", type:"lut_text", title:"Nombre"
                        , lut:"Recambios.REF", link:"REF", hint:"Referencia"
                        , column_style:{width:"300px"}
                        },
      { field:"Cantidad", type:"number"
                        , column_style:{width:"120px"}
       },
      { field:"EurosUnidad", type:"number", title:"€/Unidad"
                        , column_style:{width:"120px"}
       },
      { field:"SubTotal", type:"computed", className:"currency"
                        , formula:(row)=>{return as_euros(row.Cantidad * row.EurosUnidad);}},
      { field:"Tipo", type:"select", lut:"Proformas.Detail.Tipo", default_value:0
                        , column_style:{width:"60px"}
                        },
      { field:"Delete", type:"action", title:"Borrar" }
     // { field:"Nota", type:"text" }
    ],
    tail_fields: [
      { field:"New", type:"actionNew", title:"New Detail", colSpan:"3" },
      { field:"Total", type:"label" },    
      { field:"ComputedTotal", type:"computed", className:"currency", formula:(rows)=>{ 
          return as_euros(
            _.reduce(rows, (accum,d)=>{ 
              accum += (d.Cantidad*d.EurosUnidad);
              return accum;
            }, 0)
          );
      }}    
    ]
  }
};

// -------------------------------------------------------------------
export function get( name ) {
  return all_layouts[name];
}

// -------------------------------------------------------------------
export function getFieldByname( layout, field_name ) {
  const idx = _.findIndex( layout.fields, (r)=>{ return r.field === field_name; } );
  if( idx >= 0 )
    return layout.fields[idx];
  return undefined;
}

// -------------------------------------------------------------------
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

// -------------------------------------------------------------------
export function validateDates( layout, obj ) {

  _.each( layout.fields, (f)=>{
    if( f.type === "date") {
      var old_value = obj[ f.field ];
      if( typeof old_value === 'string') {
        //console.log( "Correcting string " + f.field + " date from " + old_value)
        let d = new Date( old_value );
        //console.log( "new date_obj " + d)
        let new_value = asYYYYMMDD( d );
        //console.log( "new_value " + new_value)
        obj[ f.field ] = new_value;
      } else {
        //console.log( "Correcting date " + f.field + " date from " + old_value)
        let d = new Date( old_value );
        let new_value = asYYYYMMDD( d );
        //console.log( "new_value " + new_value)
        obj[ f.field ] = new_value;
      }
    }
  });
}

// -------------------------------------------------------------------
export function getNewEmptyRegister( layout ) {
  var data = {};
  _.each( layout.fields, (f)=>{
    if( f.field ) {
      if( f.type == "date") 
        data[f.field] = asYYYYMMDD( new Date() );
      else if( f.type == "array_table") 
        data[f.field] = [];
      else if( f.multiLine ) 
        data[f.field] = "";
      else if( f.type == "lut_text" || f.type =="action")
        return;
      else 
        data[f.field] = f.default_value;
    } 
  });
  return data;
}




