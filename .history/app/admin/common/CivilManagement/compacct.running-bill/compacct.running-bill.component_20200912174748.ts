import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { MessageService } from "primeng/api";
import * as moment from "moment";

import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
declare var $:any;

@Component({
  selector: 'app-compacct-running-bill',
  templateUrl: './compacct.running-bill.component.html',
  styleUrls: ['./compacct.running-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CompacctRunningBillComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Create";
  Spinner = false;
  items = [];

  RoadList = [];
  ProjectList = [];
  ObjSearch = new Search();
  SerachFormSubmitted = false;


  SelectedItemCode:any;
  SelectedSubItemCode:any;
  BOQData = [];
  ItemList = [];
  BridgeItemData =[];
  SubItemList = [];

  RunningFormSubmitted = false;
  RunningDetailList = [];
  ObjRunningBill = new RunningBill();
  RunningDate = new Date();
  CurrencyAmount = undefined;
  public data: Object[] = [];

  constructor(private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
     this.Header.pushHeader({
      Header: "Civil Running Bill Details",
      Link: " Civil -> Civil Running Bill Details"
    });
    this.GetRoad();
    console.log('g')
  }
  GetRoad() {
    this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Project_Short_Name_Json")
      .subscribe((data: any) => {
        const roadData = data ? JSON.parse(data) : [];
        roadData.forEach(el => {
          this.RoadList.push({
            label: el.Project_Short_Name,
            value: el.Project_Short_Name
          });
        });
      });
  }
  Search(valid){
    this.SerachFormSubmitted = true;
    if (valid) {
      this.Spinner = true;
      const obj = new HttpParams()
      .set("Project_Short_Name", this.ObjSearch.Project_Short_Name)
      .set("Agreement_Number", this.ObjSearch.Agreement_Number ?  this.ObjSearch.Agreement_Number : '')
      this.$http
        .get("/BL_Txn_Civil_Daily_Job/Get_Entry_Daily_Job_Browse_Json", { params: obj })
        .subscribe((data: any) => {
          this.ProjectList = data.length ? JSON.parse(data) : [];
          this.Spinner = false;
          this.SerachFormSubmitted = false;
        });
    }
  }

  GetBOQData(id) {
    this.ItemList = [];
    if(id) {
    this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Item_Code_Json?Project_ID="+ id)
      .subscribe((data: any) => {
        this.BOQData = data ? JSON.parse(data) : [];
        this.BOQData.forEach(el => {
          this.ItemList.push({
            label:  el.Sl_No +' ' +el.Item_Code,
            value: el.Item_Code
          });
        });
      });
    }
  }
  ItemCodeChange(obj) {
    this.ObjRunningBill.Item_Code = undefined;
    this.ObjRunningBill.Unit = undefined;
    this.ObjRunningBill.Sub_Item_Code = undefined;
    this.ObjRunningBill.Total_Ex_Qnty = undefined;
    this.ObjRunningBill.Estimated_Rate = undefined;
    this.ObjRunningBill.Item_Sl_No = undefined;
    this.ObjRunningBill.Amount = undefined;
    this.ObjRunningBill.Total_Ex_Qnty_for_This_Bill = undefined;
    this.ObjRunningBill.Estimated_Rate = undefined;
    this.SubItemList = [];
    this.BridgeItemData = [];
    if(obj) {
      const temObj = $.grep(this.BOQData,function(arr){ return arr.Item_Code === obj})[0];
      this.ObjRunningBill.Item_Code = obj;
      this.ObjRunningBill.Unit = temObj.Unit;
      this.ObjRunningBill.Item_Sl_No = temObj.Sl_No;
      this.ObjRunningBill.Estimated_Rate = temObj.Estimated_Rate;
      this.GetSubItems(temObj.BOQ_Txn_ID);
    }
  }
  GetSubItems(boqID){
    if(boqID) {
      this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Bridge_Culvart_Sub_Code_Json?BOQ_Txn_ID="+boqID)
      .subscribe((data: any) => {
        this.BridgeItemData = JSON.parse(data);
        if(this.BridgeItemData.length) {
          this.BridgeItemData.forEach(el => {
            this.SubItemList.push({
              label: el.Sl_No +' ' +el.Item_Code,
              value: el.Item_Code
            });
          });
        }
      });
    }
  }
  SubItemCodeChange(obj) {
    this.ObjRunningBill.Sub_Item_Code = undefined;
    if(obj) {
      this.ObjRunningBill.Sub_Item_Code = obj;
      const temObj = $.grep(this.BridgeItemData,function(arr){ return arr.Item_Code === obj})[0];
      this.ObjRunningBill.Item_Sl_No = temObj.Sl_No;
      if(!this.ObjRunningBill.Unit) {
        this.ObjRunningBill.Unit = temObj.Unit;
      }
      if(!this.ObjRunningBill.Estimated_Rate) {
        this.ObjRunningBill.Estimated_Rate = temObj.Estimated_Rate;
      }
    }
  }

  EntryRunningBillDetails(obj) {
    const crl = this;
    this.ObjRunningBill.Tender_Name = undefined;
    this.ObjRunningBill.Agreement_Number = undefined;
    this.ObjRunningBill.Agreement_Amount = undefined;
    this.ObjRunningBill.Date_of_Commencement = undefined;
    this.ObjRunningBill.Date_of_Completion = undefined;
    this.ObjRunningBill.Bidder_Name = undefined;
    if(obj.Project_ID) {
      this.ObjRunningBill.Tender_Name = obj.Tender_Name;
      this.ObjRunningBill.Agreement_Number = obj.Agreement_Number;
      // this.ObjRunningBill.Agreement_Amount = obj.Agreement_Amount;
      this.ObjRunningBill.Date_of_Commencement = obj.Date_of_Commencement;
      this.ObjRunningBill.Date_of_Completion = obj.Date_of_Completion;
      this.GetBOQData(obj.Project_ID);
      const name  = this.ObjSearch.Project_Short_Name;
      this.items[1] = "CREATE RUNNING BILL DETAILS FOR "+name.toUpperCase();
      setTimeout(function(){
        crl.tabIndexToView = 1;
      })
    }
  }
  GetRunningDate (date) {
    if (date) {
      this.ObjRunningBill.Date = this.DateService.dateConvert(
        moment(date, "YYYY-MM-DD")["_d"]
      );
    }
  }
  AmountChange(e){
    if(e) {
      const x= e.toString();
      const number = Number(e);
     const k =  number.toLocaleString('en-IN', {
         maximumFractionDigits: 2,
         style: 'currency',
         currency: 'INR'
     });
     this.CurrencyAmount = k;
    }
  }
  check3Digit(val:any,field) {
    this.ObjRunningBill[field] = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
    this.calculateAmount();
  }
  calculateAmount() {
    this.ObjRunningBill.Amount = undefined;
    this.CurrencyAmount = undefined;
    if(this.ObjRunningBill.Total_Ex_Qnty && this.ObjRunningBill.Estimated_Rate) {
      const amt = Number(this.ObjRunningBill.Estimated_Rate) * Number(this.ObjRunningBill.Total_Ex_Qnty);
      this.ObjRunningBill.Amount = amt.toFixed(2);
      this.AmountChange(this.ObjRunningBill.Amount);
    }
  }

  AddRunDetailList(valid) {
    if(valid) {
      this.RunningDetailList.push(this.ObjRunningBill);
      this.data = this.RunningDetailList;
      this.clearAddData();
    }
  }
  DeleteRunDetails(index) {
    this.RunningDetailList.splice(index, 1);
  }
  clearAddData() {
    const obj = this.ObjRunningBill;
    this.ObjRunningBill = new RunningBill();
    this.CurrencyAmount = undefined;
    this.ObjRunningBill.Serial_No = obj.Serial_No;
    this.ObjRunningBill.Tender_Name = obj.Tender_Name;
    this.ObjRunningBill.Agreement_Number = obj.Agreement_Number;
    // this.ObjRunningBill.Agreement_Amount = obj.Agreement_Amount;
    this.ObjRunningBill.Date_of_Commencement = obj.Date_of_Commencement;
    this.ObjRunningBill.Date_of_Completion = obj.Date_of_Completion;

  }

   // Clear & Tab
   TabClick(e) {
    this.tabIndexToView = e.index;
    this.buttonname = "Create";
   // this.clearData();
  }
  clearData() {
  }
}
class Search{
  Project_Short_Name:string;
  Agreement_Number:string;
}
class RunningBill{
  Date:string;
  Item_Sl_No:string;;
  Serial_No:string;
  Item_Code:string;
  Sub_Item_Code:string;
  Total_Ex_Qnty:string;
  Unit:string;
  Estimated_Rate:string;
  Amount:string;
  Total_Ex_Qnty_for_This_Bill:string;
  Remarks:string;

  Tender_Name:string;
  Agreement_Number:string;
  Agreement_Amount:string;
  Date_of_Commencement:string;
  Date_of_Completion:string;
  Bidder_Name:string;
}
