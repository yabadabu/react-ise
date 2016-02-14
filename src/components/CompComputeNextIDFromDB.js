import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import ActionInput from 'material-ui/lib/svg-icons/action/trending-up';
import dbConn from '../store/db_connection.js';

export default class CompComputeNextIDFromDB extends React.Component {

/*
  ' Buscar un nuevo numero de factura/abono y lo confirma con el usuario
    Public Function BuscarNuevoID(what As String, keyfield As String, preID As String, postID As String, f As Form) As String
    BuscarNuevoID = ""            ' Default exit value
    
    ' Buscar un numero por defecto
    Dim stID As String
    Dim TheYear As String
    Dim TheNumber As String
    
    TheYear = Format(Date, "yy")
    TheNumber = "0001"
    
    ' Buscar el numero maximo de nuestro año en curso
    Dim sql As String
    Dim xpre As String
    Dim strnum As String
    strnum = "Mid([" & keyfield & "]," & CStr(Len(preID) + 4) & ",4)"
    xpres = "Left([" & keyfield & "]," & CStr(Len(preID) + 2) & ") "
    
    sql = "SELECT Max(CLng(" & strnum & ")) AS TheNumber, " & _
          xpres & " AS [Year] " & _
          "FROM [" & what & "] " & _
          "WHERE IsNumeric(" & strnum & ")=true " & _
          "GROUP BY " & xpres & _
          "HAVING (((" & xpres & ")='" & preID & TheYear & "'));"
    Set rs = CurrentDb.OpenRecordset(sql)
    rs.findfirst "1=1"
    ' Si hay alguno utilizar el siguiente
    If Not rs.nomatch Then TheNumber = Format(CLng(rs!TheNumber) + 1, "0000")
    rs.Close
    ' Format usado es YY-SSSS-N donde N es una N mayuscula constante
    stID = preID & TheYear & "-" & TheNumber & postID
*/


  handleClick() {

    var keyfield = "IDProforma";
    var table = "[Recambios - Proformas]";
    var postID = "-N";
    var TheYear = '16';
    var TheNumber = "0001";
    
    // Do the fuzzy query and get the results back to me
    dbConn.DBSelect( table
                   , ["COUNT(*) as n"]
                   , "1=1"
                   , (data) => {
      var val = data[0].n + "";
      console.log( val, val.length );
      if( val.length < 2 ) val = '0' + val; 
      if( val.length < 3 ) val = '0' + val; 
      if( val.length < 4 ) val = '0' + val; 
      var new_id = "16-" + val + postID;
      var answer = {};
      answer[keyfield] = new_id;
      this.props.onDataFound( answer );
    });  

  }

  render() {
    return (<ActionInput onClick={this.handleClick.bind( this )}/>);
  }
}

CompComputeNextIDFromDB.propTypes = {
  field: PropTypes.object.isRequired,
  onDataFound: PropTypes.func.isRequired
};

