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
        cmd: "Recambios.Proforma.ByID",
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
      { field:"Notas", type:"text", multiLine:true, hint:"Notas adicionales", fullWidth:true }
    ]
  }
};

export default function getLayout( name ) {
  return all_layouts[name];
}
