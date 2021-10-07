import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompacctGetDistinctService {

  constructor() { }
  // const arr = this.Distinct.GetMultipleDistinct(this.leadFollowUpListBackup,['Pin','Appointment_For']);
  //   console.log(arr)
  GetMultipleDistinct(arr,fieldArr:string[]) {
    let DFilter = [...Array(fieldArr.length)].fill([]);
    let DFieldName = [...Array(fieldArr.length)].fill([]);
    fieldArr.forEach((elem,i) =>{
      DFilter[i] = [];
      DFieldName[i] = [];
    arr.forEach((item) => {
        if (item[elem] && DFilter[i].indexOf(item[elem]) === -1) {
          DFilter[i].push(item[elem]);
          DFieldName[i].push({ label: item[elem], value: item[elem] });
        }
      });
    });
    return DFieldName;
  }
  
}
