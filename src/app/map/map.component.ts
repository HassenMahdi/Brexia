import { Component, OnInit } from '@angular/core';
import { FileService } from '../file.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

  constructor(private fs: FileService, private router:Router) { }

  busy: boolean = false

  ngOnInit() {

    var cols = this.fs.getColumns()
    if ( cols == null  || cols.length <= 0)
      //this.router.navigateByUrl("/home")
      console.log(cols)
    else{
      console.log(cols)

      for ( let i in cols){
        let a = {      
              maps:0,
              "id":i,
              "name":cols[i],
              "mapped":false,
              "required":true,
              }

        this.aFields.push(a)
      }
    }
  }

  allowDrop(e,targetInd){
    if( this.tFields[targetInd].source.length < 3 ){
      //Allow it
      e.preventDefault() 
    }
  }

  drop(e,targetIndex){
    e.preventDefault()
    var sourceIndex: Number = e.dataTransfer.getData("SourceID")
    if( targetIndex>=0 && sourceIndex>=0 ){
      this.mapSource(sourceIndex,targetIndex)
    }
  }

  drag(e, sourceID){
    e.dataTransfer.setData("SourceID", sourceID);
    console.log(sourceID)
  }

  mapSource(sourceInd,targetInd){
    console.log(sourceInd + '--------->' + targetInd)
    if (this.tFields[targetInd].source.indexOf(sourceInd) < 0 )
    {
        this.tFields[targetInd].source.push(sourceInd)  
        this.aFields[sourceInd].mapped = true
        this.aFields[sourceInd].maps++
    }
    }

  removeMap(sourceInd,targetInd){

    var ind = this.tFields[targetInd].source.indexOf(sourceInd) 

    console.log(ind)

    this.tFields[targetInd].source.splice(ind,1);
    this.aFields[sourceInd].maps--

    if (this.aFields[sourceInd].maps<=0)
    {
      this.aFields[sourceInd].mapped = false
    }
  }

  deleteAvailable(e, sourceInd, targetInd){
    e.preventDefault()

    this.removeMap(sourceInd, targetInd)
  }

  numberMandatory(fTab){
    var count=0;
    fTab.forEach((f)=>{
      if (f.source.length <= 0 ){
        count++;
      }
    })
    return count
  }

  sendMap(e){
    e.preventDefault();
    console.log(JSON.stringify({
      map: this.tFields
    }))
    this.router.navigateByUrl('/main')
    if ( !this.numberMandatory(this.tFields) ) //Check Corrcet Mappig before sending
    {
      this.busy = true;
      this.fs.sendMap(this.tFields,1).subscribe(
        (res)=>{
          this.busy = false;
          this.router.navigateByUrl('/main')
          console.log("success")
        },(err)=>{
          this.busy = false;
          this.router.navigateByUrl('/main')
        }
      )
    }
  }

  tFields = [
    {
      source:[],
      target:"Name of the Site",
      type: "String"
    },
    {
      source:[],
      target:"Country",
      type: "String"
    },
    {
      source:[],
      target:"County",
      type: "String"
    },
    {
      source:[],
      target:"City",
      type: "String"
    },
    {
      source:[],
      target:"Street",
      type: "String"
    },
    {
      source:[],
      target:"Address",
      type: "String"
    },
    {
      source:[],
      target:"Longitude",
      type: "Double"
    },
    {
      source:[],
      target:"Latitude",
      type: "Double"
    },
    {
      source:[],
      target:"Montant",
      type: "Double"
    },
    {
      source:[],
      target:"Site Code",
      type: "String"
    },
    {
      source:[],
      target:"Site Class",
      type: "String"
    },
    {
      source:[],
      target:"Reference",
      type: "String"
    },
    {
      source:[],
      target:"Stories",
      type: "Integer"
    },
    {
      source:[],
      target:"Period",
      type: "Integer"
    },
    {
      source:[],
      target:"Year",
      type: "Integer"
    },

  ]

  aFields = []

}
