import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Data } from '@angular/router';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-k4c-cutoff',
  templateUrl: './k4c-cutoff.component.html',
  styleUrls: ['./k4c-cutoff.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cCutoffComponent implements OnInit {
  items = [];
  menuList = [];
  allData = [];
  Reject_Date = new Date();
  Requisition_Date : Date;
  Requisition_Date_Spl : Date;
  Requision_Time_Spl : string;
  Production_Date : Date;
  Requision_Time : Date;
  Requision_Time_Store : Date;
  Bill_Date : Date;
  Outlet_Bill_Date : Date;
  Outlet_Order_Date : Date;
  Spinner = false;
  CuttoffFormSubmit = false;
  ShiftList = [];
  interval: number = 15;
  shiftTime:Date;
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService
  ) { }
// this.objFollowUpCreation.Next_Followup = this.DateService.dateTimeConvert(new Date(this.NxtFollowupDate));
  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Indent Cutoff Time Manage",
      Link: " Material Management -> Master -> Indent Cutoff Time Manage"
    });
    this.GetAlldate();
    this.GetShift();
  }
  onReject(){}
  onConfirm(){}
 GetAlldate(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Txn_Requsion_Time_Limit",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("data",data);
      this.Requisition_Date = new Date(data[0].Requisition_Date);
      this.Production_Date = new Date(data[0].Production_Date);
      this.Bill_Date = new Date(data[0].Bill_Date);
      this.Outlet_Bill_Date = new Date(data[0].Outlet_Bill_Date);
      this.Outlet_Order_Date = new Date(data[0].Outlet_Order_Date);
      this.Requision_Time = new Date(data[0].Requision_Time);
      this.Requision_Time_Store = new Date(data[0].Requision_Time_Store);
     })
   
 }
 Savecutoff(valid){
   console.log(valid);
   this.CuttoffFormSubmit = true;
   if(valid){
    const Objtemp = {
      Requision_Time: this.DateService.dateTimeConvert(new Date(this.Requision_Time)),
      Requisition_Date: this.DateService.dateConvert(new Date (this.Requisition_Date)),
      Bill_Date: this.DateService.dateConvert(new Date (this.Bill_Date)),
      Requision_Time_Store: this.DateService.dateTimeConvert(new Date(this.Requision_Time_Store)),
      Production_Date: this.DateService.dateConvert(new Date (this.Production_Date)),
      Outlet_Bill_Date: this.DateService.dateConvert(new Date (this.Outlet_Bill_Date)),
      Outlet_Order_Date: this.DateService.dateConvert(new Date (this.Outlet_Order_Date )) 
     }
     console.log("Objtemp",Objtemp);
     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Update Txn_Requsion_Time_Limit",
      "Json_Param_String": JSON.stringify([Objtemp]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("save",data);
       if(data[0].Column1 === "done"){
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Succesfully Updated ",
         detail: "Requisition Cutoff Time is Succesfully Updated"
       });
       this.GetAlldate();
       }
       else{
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
       }
     })
   }
 

 }
 addRequisitionDay(){
   console.log("call");
   const tempTime =  this.Requisition_Date.setDate(this.Requisition_Date.getDate() + 1);
   this.Requisition_Date = new Date(tempTime);
   console.log(this.Requisition_Date);
   
 }
 addTime(){
   console.log("time");
  const tempTime =  this.Requision_Time.setHours(this.Requision_Time.getHours() + 8);
  this.Requision_Time = new Date(tempTime);
  console.log("tempTime",this.Requision_Time);
 }
 addTimeStore(){
  console.log("time");
 const tempTime =  this.Requision_Time_Store.setHours(this.Requision_Time_Store.getHours() + 8);
 this.Requision_Time_Store = new Date(tempTime);
 console.log("tempTime",this.Requision_Time_Store);
}
addDayfactory(){
  const tempTimeProduction =  this.Production_Date.setDate(this.Production_Date.getDate() + 1);
  this.Production_Date = new Date(tempTimeProduction);
  const tempTimeBill =  this.Bill_Date.setDate(this.Bill_Date.getDate() + 1);
  this.Bill_Date = new Date(tempTimeBill);
  }
addDayoutlet(){
  const tempTimeout =  this.Outlet_Bill_Date.setDate(this.Outlet_Bill_Date.getDate() + 1);
  this.Outlet_Bill_Date = new Date(tempTimeout);
  const tempTimeBill =  this.Outlet_Order_Date.setDate(this.Outlet_Order_Date.getDate() + 1);
  this.Outlet_Order_Date = new Date(tempTimeBill);
}
GetShift(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "GET_Shift_Time_For_Update"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ShiftList = data;
      this.shiftTime =  new Date(data[0].Shift_Time);
      this.ShiftList.forEach(el=>{
        el['time'] = new Date(el.Shift_Time); 
      })
      console.log("this.ShiftList",this.ShiftList);
    })
}
shiftUpdate(col){
//console.log(col);
let saveObj = {}
saveObj = {
    Shift_ID : col.Shift_ID,
    Shift_Time : this.DateService.dateTimeConvert(new Date(col.time)),
    User_ID : this.$CompacctAPI.CompacctCookies.User_ID
  }
console.log("save",saveObj);
const obj = {
  "SP_String": "SP_Controller_Master",
  "Report_Name_String": "UPDATE_Shift_Time_For_Update",
  "Json_Param_String": JSON.stringify([saveObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log(data);
     if(data[0].Column1 === "done"){
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Succesfully Updated ",
       detail: "Shift Time is Succesfully Updated"
     });
     }
     else{
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
     }
  })
}

}
