import React from 'react'
import {
  Button,
  Icon
} from 'material-ui';
import {Text} from 'react-native';
import {default as ExcelFile, ExcelSheet} from "react-data-export";

// this fucntion is to filter connote data
//s
const ExcelExportBtn = (props) => {
  
  // console.log(props.columnList);
  // console.log(props.data);

  let dataSet = [
    {
      columns: props.columnList,
      data: props.data
    }
  ]
  return (
    /*<ExcelFile
      filename={props.filename}
      element={(<Button size="small">
        <Icon>insert_drive_file</Icon>
        <Text>Export</Text>
      </Button>)}
    >
        <ExcelSheet dataSet={dataSet} name={props.orgName} />
    </ExcelFile>*/
    <Button size="small">
      <Icon>insert_drive_file</Icon>
      <Text>Export</Text>
    </Button>
  )
}
export default ExcelExportBtn;