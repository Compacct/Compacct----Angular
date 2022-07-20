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

@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class LeaveApprovalComponent implements OnInit {
  employeelist = [];
  ApprovalList:any = [];

  constructor(
    private route : ActivatedRoute,
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Leave Approval",
      Link: " HR -> Transaction -> Leave Approval"
    });
    this.getemployee();
  }
  getemployee(){
    const obj = {
      "SP_String": "SP_Leave_Application",
      "Report_Name_String": "Get_Emp_ID",
      "Json_Param_String": JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.employeelist = data;
       console.log("employeelist ===", this.employeelist);
       this.getApprovaldetails();
    })
  }
  getApprovaldetails(){
    //console.log(this.ObjBrowse.Doc_No);
    const obj = {
      "SP_String": "SP_Leave_Application",
      "Report_Name_String": "Get_Leave_Apply_Data",
      "Json_Param_String": JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ApprovalList = data;
      console.log("this.ApprovalList  ===",this.ApprovalList);
      this.ApprovalList.forEach(element => {
        element['Approved_Status_Business_Manager'] = undefined;
        element['Approved_Status_Reporting_Manager'] = undefined;
      });
      // for(let i = 0; i < this.AuthorizedList.length ; i++){
      // this.AuthorizedList[i].Confirm_Qty = this.AuthorizedList[i].Order_Qty;
      // this.AuthorizedList[i].Confirm_Rate = this.AuthorizedList[i].Rate;
      // this.AuthorizedList[i].Confirm_Amount = Number(this.AuthorizedList[i].Confirm_Qty * this.AuthorizedList[i].Confirm_Rate).toFixed(2);
      // this.AuthorizedList[i].Confirm_Amount_With_GST = Number(((this.AuthorizedList[i].Confirm_Qty * this.AuthorizedList[i].Confirm_Rate) * this.AuthorizedList[i].GST_PER) / 100).toFixed(2);
      // //this.AuthorizedList[i].Vendor_Name = this.AuthorizedList[i].Sub_Ledger_ID;
      // }
    })
   }

}
