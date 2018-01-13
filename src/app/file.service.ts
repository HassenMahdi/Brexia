import { Injectable } from '@angular/core';
import { Http,Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class FileService {

  API_URL = "http://localhost:8181/"
  fileID= 0;
  page: Number = 0;
  MappingID: Number;
  UserID;
  columns:any=[]

  constructor(private http : Http) { }


  saveColumns(cols){
    this.columns = cols;
    localStorage.setItem("cols",JSON.stringify(cols))
  }

  getColumns(){
    if(this.columns.length > 0 )
      return this.columns
    else
      return JSON.parse(localStorage.getItem("cols"))
  }

  sendMap(map,fileID ){
    var data = {
      map:map,
      file:this.fileID,
      page:this.page
    }


    console.log(data)

    return this.http.post(this.API_URL + "map",data)
    // ...and calling .json() on the response to return data
     .map((res:Response) => res.json())
     //...errors if any
     .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  postWithFile (url: string, postData: any, file) {
    
        let headers = new Headers();
        let formData:FormData = new FormData();
        formData.append('file', file, file.name);
    
        if(postData !=="" && postData !== undefined && postData !==null){
          for (var property in postData) {
              if (postData.hasOwnProperty(property)) {
                  formData.append(property, postData[property]);
              }
          }
        }
        var returnReponse = new Promise((resolve, reject) => {
          this.http.post(this.API_URL + "fileupload", formData, {
            headers: headers
          }).subscribe(
              res => {
                this.fileID = res.json().file;
                localStorage.setItem("file",String(this.fileID))
                resolve(res.json());
              },
              error => {
                reject(error);
              }
          );
        });
        return returnReponse;
      }
    

}
