import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from '../file.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('fileInput') myFileInput: ElementRef;  

  errMsg : String = null
  succMsg : String = null
  busyMsg : string = null

  data = null

  clearMsgs(){
    this.errMsg = null
    this.succMsg = null
    this.busyMsg = null
  }

  constructor(private fs: FileService, private router:Router) { }

  ngOnInit() {
  }

  fileChanged(event) {
    console.log(event.target.files[0]);
    var file = event.target.files[0]
    this.clearMsgs()
    this.busyMsg = "Processing your request"

    if ( file.name.match( /.xls|.xlsx$/g) ){
      //Upload the file
      this.fs.postWithFile('file',{},file)
      .then((res)=>{
        this.clearMsgs()
        this.data = res
        this.succMsg = "Good to go"
        console.log(res)
      })
      .catch(err=>{
        this.clearMsgs()
        this.errMsg = err
      })
    }else{
      console.log("error: Wrong input file type")
      this.errMsg = "Only XLS or XLXS files"
    }
  }

}
