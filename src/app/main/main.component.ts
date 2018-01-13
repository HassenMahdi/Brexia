import { Component, OnInit } from '@angular/core';
import { GridExtraUtils,Column, GridOption , FieldType , Formatter ,Formatters, OnEventArgs , Editors} from 'angular-slickgrid';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  dataviewObj: any;

  validateRow(row){
    var valid = true
    for (let key in row){
      if ( row[key] === "" && key != "selected" && key != "valid" && key != "delete" && key != "edit" )
      {
        row.valid = false;
        console.log(key + " is not valid")
        return
      }
    }
    row.valid = true;
    console.log("true")
  }

  gridReady(grid) {
    grid.onCellChange.subscribe((e, args) => {
      console.log('onCellChange', args);
      this.validateRow(args.item)
      this.dataviewObj.refresh();
      console.log(args)
      // for example, CRUD with WebAPI calls
    });
    grid.onClick.subscribe((e, args) => {
      const column = GridExtraUtils.getColumnDefinitionAndData(args);

      if (column.columnDef.id === 'delete') {
        if (confirm('Are you sure?')) {
          this.dataviewObj.deleteItem(column.dataContext.id);
          this.dataviewObj.refresh();
        }
      }
    });

  }
  dataviewReady(dataview) {
    this.dataviewObj = dataview;
  }

  ngOnInit(): void {


    //Validation Formateur
    const validFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) =>
    this.dataset[row].valid ?  `<div class='line'>`+ value + `</div>`: `<div class='line not-valid'>`+ value + `</div>` ;

    const notEmptyFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any)=>{
      if ( !value ){
        this.dataset[row].valid = false;
        return  `<div class='empty-field'>`+ value + `</div>`
      }
      else{
        return value;
      }
    }

    this.columnDefinitions = [
      { id: 'select', field: 'selected', maxWidth : 30,formatter: Formatters.checkbox, editor: Editors.checkbox },
      {
          id: 'edit', field: 'id',
          formatter: Formatters.editIcon,
          maxWidth: 30,
          onCellClick: (args: OnEventArgs) => {
            console.log(args);
          }
      },
        {
          id: 'delete', field: 'id',
          formatter: Formatters.deleteIcon,
          maxWidth: 30,
          onCellClick: (args: OnEventArgs) => {
            alert("Yeah")
            console.log(args);
          }
      },
      { id: 'line', name: 'Line', field: 'line', maxWidth: 100 , sortable: true , type : FieldType.integer  ,filterable: true , formatter: validFormatter},
      { id: 'title', name: 'Title', field: 'title', sortable: true , type : FieldType.number  ,filterable: true, formatter: notEmptyFormatter},
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true ,type : FieldType.string ,filterable: true, formatter: notEmptyFormatter},
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true  ,type : FieldType.integer ,filterable: true, formatter: notEmptyFormatter , editor: Editors.integer},
      { id: 'start', name: 'Start', field: 'start' ,type : FieldType.string ,filterable: true, formatter: notEmptyFormatter},
      { id: 'finish', name: 'Finish', field: 'finish' ,type : FieldType.string ,filterable: true, formatter: notEmptyFormatter},
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true ,type : FieldType.string ,filterable: true, formatter: notEmptyFormatter}
    ];
    this.gridOptions = {
      enableAutoResize: true,       // true by default
      enableCellNavigation: true,
      enableFiltering: true,
      editable: true
    };

    // fill the dataset with your data
    // VERY IMPORTANT, Angular-Slickgrid uses Slickgrid DataView which REQUIRES a unique "id" and it has to be lowercase "id" and be part of the dataset
    this.dataset = [];

    // for demo purpose, let's mock a 1000 lines of data
    for (let i = 0; i < 1000; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 28));
      const randomPercent = Math.round(Math.random() * 100);
      const valid = Math.round(Math.random());

      this.dataset[i] = {
        selected:false,
        id: i, // again VERY IMPORTANT to fill the "id" with unique values
        line:i+1,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: "",
        start: `${randomMonth}/${randomDay}/${randomYear}`,
        finish: `${randomMonth}/${randomDay}/${randomYear}`,
        effortDriven: (i % 5 === 0),
      };

      this.validateRow(this.dataset[i])
    }
  }
}