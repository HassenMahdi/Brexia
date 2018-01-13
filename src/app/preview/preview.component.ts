import { OnChanges, Input, Component, OnInit } from '@angular/core';
import { Column, GridOption , FieldType } from 'angular-slickgrid';
import { Router } from '@angular/router';
import { FileService } from '../file.service'

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  @Input() data:any;

  columns:any
  columnDefinitions: Column[]
  gridOptions: GridOption
  dataset: any
  show: boolean = true
  pageNumber: number = 0
  pages: any

  dataviewObj: any

  constructor( private fs:FileService, private router:Router) { }

  goToMap(e){
    e.preventDefault()

    if (this.columns){
      this.fs.saveColumns(this.columns)
      this.router.navigateByUrl("/map")
    }

  }

  ngOnInit() {

    this.pages= this.data.feuilles

    this.openPage(0)

  }

  dataviewReady(dataview) {
    this.dataviewObj = dataview;
  }
  
  openPage(i){

    this.pageNumber=i

    let page = this.data.feuilles[this.pageNumber]
    
        this.columns = page.rows[0].cells
    
        this.fs.saveColumns(this.columns)
    
        this.columnDefinitions = []
    
        for ( let i in this.columns){
          var col = { id: this.columns[i] , name: this.columns[i], field: this.columns[i], sortable: true}
          this.columnDefinitions.push(col) 
        }
    
        this.gridOptions = {
          enableAutoResize: true,       // true by default
          enableCellNavigation: false,
          enableFiltering: false,
        };
        
        // fill the dataset with your data
        // VERY IMPORTANT, Angular-Slickgrid uses Slickgrid DataView which REQUIRES a unique "id" and it has to be lowercase "id" and be part of the dataset
        this.dataset = [];
        
        // for demo purpose, let's mock a 1000 lines of data
        for (let i = 1; i < page.rows.length; i++) {
    
          let rowdata = {
            id: i, // again VERY IMPORTANT to fill the "id" with unique values
          };
    
          for (let j in this.columns){
            let s= this.columns[j]
            rowdata[s] = page.rows[i].cells[j]
          }
          
          this.dataset.push(rowdata)
        }
        console.log(this.dataset)

        //this.dataviewObj.invalidate()
        //this.dataviewObj.render()
  }

}
