import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import {CompacctGetDistinctService } from "../../../shared/compacct.services/compacct-get-distinct.service"
import * as moment from "moment";
declare var $:any;
import * as XLSX from 'xlsx';
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { ActivatedRoute } from '@angular/router';
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { map, catchError } from 'rxjs/operators';
import { param } from 'jquery';

@Component({
  selector: 'app-nepal-sup-tkt-sales-return-approve',
  templateUrl: './nepal-sup-tkt-sales-return-approve.component.html',
  styleUrls: ['./nepal-sup-tkt-sales-return-approve.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalSupTktSalesReturnApproveComponent implements OnInit {
  items:any = []
  tabIndexToView: number = 0;
  buttonname = "Save";
  pendinglistHeader:any = []
  pendinglist:any = []
  UpdateList:any = []
  DocDate:any = []
  DocDateShow:any = []
  viewModal:boolean = false
  Spinner:boolean = false
  browseDataList:any = []
  browseDataListheader:any = []
  ShowModal:boolean = false
  showdataList:any = []
  bckupbrowseDataList: any = [];
  DistUserSelect1: any = [];
  DistCustomerSelect1: any = [];
  DistStatusSelect1: any = [];
  DistEmployeeSelect1: any = [];
  DistUser1: any = [];
  DistEmployee1: any = [];
  DistStatus1: any = [];
  DistCustomer1: any = [];
  colsAdv: any = [];
  colsAdv1: any = [];
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService: DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService,
  ) { }

  ngOnInit() {
    this.items = ["APPROVED", "PENDING"];
    this.Header.pushHeader({
      Header: "Sales Return Approve",
      Link: "Ticket Management -> Sales Return Approve"
    });
    this.getpendinglist()
    this.getBrowse()
  }
  TabClick(e:any){
    this.tabIndexToView = e.index;
    this.items = ["APPROVED", "PENDING"];
    this.buttonname = "Save";
    this.clearData()
  }
  clearData(){
    this.Spinner = false
    this.ShowModal = false
    this.viewModal = false
  }
  onReject() {
    this.compacctToast.clear("c");
    this.ngxService.stop();
  }
  onConfirm(){

  }
  getpendinglist(){
    this.pendinglist = []
    this.pendinglistHeader = []
    const obj = {
      'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
      'Report_Name_String':  "Pending_Browse_Return_Approve",
      'Json_Param_String': JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}]),
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      if(data.length){
        if(data[0].hasOwnProperty('Return_Date')){
          data.forEach((ele:any) => {
            ele.Return_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(ele.Return_Date);
          });
        }
      this.pendinglist = data
        this.pendinglistHeader = Object.keys(data[0])
          this.pendinglistHeader.forEach(element => {
          this.colsAdv1.push({
            header : element
          })
        });
      }
    })
  }
  getUpdateList(col:any){
    this.UpdateList = []
    this.Spinner = false
    if(col.Ticket_No){
      
      const obj = {
        'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
        'Report_Name_String':  "Get_Pending_Return_Approve",
        'Json_Param_String': JSON.stringify([{Ticket_No : col.Ticket_No}]),
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        this.DocDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].Request_Date);
       this.UpdateList = data
       this.UpdateList.forEach((ele:any) => {
        ele.Approved_Amount = ele.Amount
        ele.Approved_Qty = ele.Qty
        ele.Approved_Rate = ele.Rate
        ele.Approved_Tax_Amount = ele.Tax_Amount
        ele.Approve_User_ID = this.$CompacctAPI.CompacctCookies.User_ID
       });
       this.viewModal = true
      })
    }
  }
  calculatAmount(ind:any){
    let convert = (v) =>{
      return v? v : 0
    }
    this.UpdateList.forEach((ele:any) => {
      if(ele.Approved_Qty && ele.Approved_Rate){
        ele.Approved_Amount = ((Number(convert(ele.Approved_Qty)) * Number(convert(ele.Approved_Rate))) + Number(convert(ele.Approved_Tax_Amount))).toFixed(2) 
      }
      else {
        ele.Approved_Amount = 0.00
      }
     
    });
  }
  SavesaleApprove(){
    if(this.UpdateList.length){
      this.Spinner = true
      let saveDataList:any = []
      this.UpdateList.forEach((ele:any) => {
        if(ele.Approved_Qty){
          saveDataList.push({
            Ticket_No: ele.Ticket_No,
            Product_ID: ele.Product_ID,
            Rate: ele.Rate,
            Approved_Qty: ele.Approved_Qty? ele.Approved_Qty : 0,
            Approved_Rate: ele.Approved_Rate ? ele.Approved_Rate : 0,
            Approved_Tax_Amount: ele.Approved_Tax_Amount ? ele.Approved_Tax_Amount:0,
            Approved_Amount: ele.Approved_Amount ? ele.Approved_Amount : 0,
            Approve_User_ID: ele.Approve_User_ID? ele.Approve_User_ID : 0
          })
        }
      });
      const obj = {
        'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
        'Report_Name_String':  "Update_Return_For_Approve",
        'Json_Param_String': JSON.stringify(saveDataList),
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        if(data[0].Column1 == "Done"){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Sales Return Approved",
            detail: "Succesfully Update",
          });
          this.tabIndexToView = 0;
          this.viewModal = false;
          this.clearData();
          this.getBrowse();
          this.getpendinglist();
        }
      })
    }
  }
  getBrowse(){
    this.browseDataListheader = [];
    this.browseDataList = [];
    this.bckupbrowseDataList = [];
    const obj = {
      'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request ",
      'Report_Name_String':  "Approved_Browse_Return_Approve",
      'Json_Param_String': JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}]),
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      if(data.length){
        if(data[0].hasOwnProperty('Return_Date')){
          data.forEach((ele:any) => {
            ele.Return_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(ele.Return_Date);
          });
        }
        this.browseDataListheader = Object.keys(data[0])
         this.browseDataListheader.forEach(element => {
          this.colsAdv.push({
            header : element
          })
        });
        this.browseDataList = data
        this.bckupbrowseDataList = data;
        this.GetDistinct1();
      }
    })
  }
   GetDistinct1() {
    let Status: any = [];
    this.DistCustomer1 = [];
    this.DistUser1 = [];
    this.DistStatus1 = [];
    this.DistEmployee1 = [];
    this.browseDataList.forEach((item) => {
      if (Status.indexOf(item.Customer) === -1) {
        Status.push(item.Customer);
        this.DistCustomer1.push({ label: item.Customer, value: item.Customer });
      }
      if (Status.indexOf(item.Status) === -1) {
        Status.push(item.Status);
        this.DistStatus1.push({ label: item.Status, value: item.Status });
      }
       if (Status.indexOf(item.Sales_Executive) === -1) {
        Status.push(item.Sales_Executive);
        this.DistEmployee1.push({ label: item.Sales_Executive, value: item.Sales_Executive });
      }
      if (Status.indexOf(item.User_name) === -1) {
        Status.push(item.User_name);
        this.DistUser1.push({ label: item.User_name, value: item.User_name });
      }    
    });
      this.bckupbrowseDataList = [...this.browseDataList];
  }
  FilterDist1() {
    let First: any = [];
    let Second: any = [];
    let three: any = [];
    let fore: any = [];
    let SearchFields: any = [];
    if (this.DistEmployeeSelect1.length) {
      SearchFields.push('Sales_Executive');
      First = this.DistEmployeeSelect1;
    }
    if (this.DistStatusSelect1.length) {
      SearchFields.push('Status');
      Second = this.DistStatusSelect1;
    }
    if (this.DistCustomerSelect1.length) {
      SearchFields.push('Customer');
      three = this.DistCustomerSelect1;
    }
     if (this.DistUserSelect1.length) {
      SearchFields.push('User_name');
      fore = this.DistUserSelect1;
    }
    this.browseDataList = [];
    if (SearchFields.length) {
      let LeadArr = this.bckupbrowseDataList.filter(function (e) {
        return (First.length ? First.includes(e['Sales_Executive']) : true)
          && (Second.length ? Second.includes(e['Status']) : true)
          && (three.length ? three.includes(e['Customer']) : true)
          &&(fore.length ? fore.includes(e['User_name']) : true)
      });
      this.browseDataList = LeadArr.length ? LeadArr : [];
    } else {
      this.browseDataList = [...this.bckupbrowseDataList];
    }

  }
  getView(col:any){
     this.showdataList = []
      this.Spinner = false
      if(col.Ticket_No){
        const obj = {
          'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
          'Report_Name_String':  "Get_Approved_Return_Approve",
          'Json_Param_String': JSON.stringify([{Ticket_No : col.Ticket_No}]),
        }
        this.GlobalAPI.postData(obj).subscribe((data:any)=>{
          this.DocDateShow = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].Request_Date);
          this.showdataList = data
          this.ShowModal = true
        })
      }
    

  }
  getStatusWiseColor(Status:any) {
   switch (Status) {
            case 'CREATED':
                return 'red';
                break;
            case 'APPROVED':
                return 'blue';
                break;
            case 'MATERIAL PICKED':
                return 'orange';
                break;
            case 'ACCOUNTS ENTRY DONE':
              return 'green';
              break;
           default:
        }
    
    return
  }
}
