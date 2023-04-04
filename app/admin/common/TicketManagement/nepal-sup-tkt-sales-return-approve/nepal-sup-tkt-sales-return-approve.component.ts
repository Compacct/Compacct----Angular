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
  viewModal:boolean = false
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
    this.items = ["BROWSE", "PENDING"];
    this.Header.pushHeader({
      Header: "Sales Return Approve",
      Link: "Ticket Management -> Sales Return Approve"
    });
    this.getpendinglist()
  }
  TabClick(e:any){
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "PENDING"];
    this.buttonname = "Save";
    this.clearData()
  }
  clearData(){}
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
      }
    })
  }
  getUpdateList(col:any){
    this.UpdateList = []
    if(col.Ticket_No){
      
      const obj = {
        'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
        'Report_Name_String':  "Get_Pending_Return_Approve",
        'Json_Param_String': JSON.stringify([{Ticket_No : col.Ticket_No}]),
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        this.DocDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].Request_Date);
       this.UpdateList = data
       this.viewModal = true
      })
    }
  }
}
