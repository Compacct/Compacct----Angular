import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';
import { format } from 'url';
declare var $:any;
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-meterial-inspection-of-rdb',
  templateUrl: './meterial-inspection-of-rdb.component.html',
  styleUrls: ['./meterial-inspection-of-rdb.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MeterialInspectionOfRDBComponent implements OnInit {
  items:any = [];
  menuList:any = [];
  tabIndexToView = 0;
  initDate:any = [];

  ObjPending : Pending = new Pending ();
  PendingList:any = [];
  DynamicHeaderforPending:any = [];
  
  ObjDone : Done = new Done ();
  DoneList:any = [];
  DynamicHeaderforDone:any = [];

  Spinner = false;
  RemarksModel = false;
  remarksFormSubmitted = false;
  Remarks:any;
  rdbno: any;
  seachSpinner = false;
  constructor(
    private route : ActivatedRoute,
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService,
  ) { }

  ngOnInit() {
    this.items = ["PENDING", "DONE"];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ]; 
    this.Header.pushHeader({
      Header: "Material Inspection",
      Link: " Material Management -> Material Inspection"
    });
    this.Finyear();
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["PENDING", "DONE"];
    //  this.buttonname = "Save";
    //  this.Spinner = false;
    //  this.clearData();
   }
   onConfirm(){}
   onReject(){}
   Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
      // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
      // this.voucherminDate = new Date(data[0].Fin_Year_Start);
      // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }
  // For Pending 
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjPending.From_date = dateRangeObj[0];
      this.ObjPending.To_date = dateRangeObj[1];
    }
  }
  GetPendingData(){
    this.ngxService.start();
    const From_date = this.ObjPending.From_date
       ? this.DateService.dateConvert(new Date(this.ObjPending.From_date))
       : this.DateService.dateConvert(new Date());
     const To_date = this.ObjPending.To_date
       ? this.DateService.dateConvert(new Date(this.ObjPending.To_date))
       : this.DateService.dateConvert(new Date());
       const tempobjpen = {
        From_date : From_date,
        To_date : To_date
      }
      if (From_date && To_date) {
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
      "Report_Name_String":"Pending_Material_Inspection",
      "Json_Param_String": JSON.stringify([tempobjpen])
     }
     this.GlobalAPI.getData(obj)
      .subscribe((data: any) => {
        this.PendingList = data;
        this.ngxService.stop();
        console.log("PendingList=",this.PendingList);
        if(this.PendingList.length){
          this.DynamicHeaderforPending = Object.keys(data[0]);
        }
        else {
          this.DynamicHeaderforPending = [];
        }
      });
    }
    else {
      this.ngxService.stop();
    }
  }
  // For Done
  getDateRangeDone(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjDone.From_date = dateRangeObj[0];
      this.ObjDone.To_date = dateRangeObj[1];
    }
  }
  GetDoneData(){
    this.ngxService.start();
    const From_date = this.ObjDone.From_date
       ? this.DateService.dateConvert(new Date(this.ObjDone.From_date))
       : this.DateService.dateConvert(new Date());
     const To_date = this.ObjDone.To_date
       ? this.DateService.dateConvert(new Date(this.ObjDone.To_date))
       : this.DateService.dateConvert(new Date());
       const tempobjdone = {
        From_date : From_date,
        To_date : To_date
      }
      if (From_date && To_date) {
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
      "Report_Name_String":"Checked_Material_Inspection",
      "Json_Param_String": JSON.stringify([tempobjdone])
     }
     this.GlobalAPI.getData(obj)
      .subscribe((data: any) => {
        this.DoneList = data;
        this.ngxService.stop();
        console.log("DoneList=",this.DoneList);
        if(this.DoneList.length){
          this.DynamicHeaderforDone = Object.keys(data[0]);
        }
        else {
          this.DynamicHeaderforDone = [];
        }
      });
    }
    else {
      this.ngxService.stop();
    }
  }
  Printrdb(DocNo) {
    if(DocNo) {
    const objtemp = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
      "Report_Name_String": "RDB_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
  }
  ShowPOpup(obj){
    this.rdbno = undefined;
    this.Remarks = undefined;
    this.remarksFormSubmitted = false;
    if(obj.RDB_No) {
      this.rdbno = obj.RDB_No
      this.RemarksModel = true;
    }
  }
  InspectionUpdate(valid){
    this.remarksFormSubmitted = true;
    this.Spinner = true;
    if(valid) {
      const objRemarks = {
        "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
        "Report_Name_String": "Update_Inspection_Details_Of_RDB",
        "Json_Param_String": JSON.stringify([{Doc_No:this.rdbno, Ins_Remarks:this.Remarks}])
        }
      this.GlobalAPI.getData(objRemarks).subscribe((data:any)=>{
        if(data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "RDB NO  " + this.rdbno,
          detail: "Succesfully Update" //+ mgs
        });
        this.rdbno = undefined;
        this.Remarks = undefined;
        this.GetPendingData();
        this.GetDoneData();
        this.RemarksModel = false;
        this.remarksFormSubmitted = false;
        this.Spinner = false;
        }
        else {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail: "Error occured " 
          });
        }
      })
    }
    else {
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message ",
        detail: "Error occured " 
      });
    }
    }

}
class Pending {
  From_date : Date;
  To_date : Date;
 }
 class Done {
  From_date : Date;
  To_date : Date;
 }
