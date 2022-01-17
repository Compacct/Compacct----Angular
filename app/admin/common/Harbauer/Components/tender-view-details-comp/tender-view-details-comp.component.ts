import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, Input } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import {CompacctGetDistinctService } from "../../../../shared/compacct.services/compacct-get-distinct.service"
import * as moment from "moment";
declare var $:any;
import * as XLSX from 'xlsx';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-tender-view-details-comp',
  templateUrl: './tender-view-details-comp.component.html',
  styleUrls: ['./tender-view-details-comp.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TenderViewDetailsCompComponent implements OnInit {
  tenderOrg =[];
  TenderCallingDivList = [];
  TenderExecutionDivList = [];
  TypeData = [];
  tenderCategoryList = [];
  StateList = [];
  UserList = [];
  TenderInfoEnqList = [];
  private _TenderId: string;


  ObjTender:Tender = new Tender();
  testchips = [];
  viewModel = false;
  InformedDate = new Date();
  BudgetRequidBy = new Date();
  TenderOpenDate = new Date();
  TenderEndDate = new Date();
  TenderPublishDate = new Date()


  TabItems = ['Tender Details','Budget Details','Finance Details','Tender Log','Bidder List','Bid Opening & AOC Details']
  BudgetDetails$: Observable<[any]>;
  FinanceDetails$: Observable<[any]>;
  TenderLogDetails$: Observable<[any]>;
  BidderDetails$: Observable<[any]>;
  BidOpeningAOCDetails$: Observable<[any]>;
  TenderDetails$: Observable<[any]>;
@Input() set TenderId(val:string){
  this._TenderId = val;
  this.FetchValues();
}
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems :CompacctGetDistinctService
  ) { 
     this.GetTenderOrg();
     this.GetTenderCallingDiv();
     this.GetTenderExecutionDiv();
     this.GetType();
     this.GetTenderCategoryList();
     this.GetStateList();
     this.getAssignforbudget();
     this.GetTenderInfoEnqSRC();
  }

  ngOnInit() {
  }
  GetTenderOrg() {
   const obj = {
     "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
     "Report_Name_String" : "Get_Tender_Organization",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.tenderOrg = data;
     console.log("tenderOrg",this.tenderOrg);
 });
 }
 GetTenderCallingDiv() {
   const obj = {
     "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
     "Report_Name_String" : "Get_BL_CRM_Mst_Enq_Tender_Calling_Div",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.TenderCallingDivList = data;
     });
 }
 GetTenderExecutionDiv() {
   const obj = {
     "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
     "Report_Name_String" : "Get_BL_CRM_Mst_Enq_Tender_Execution_Div",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.TenderExecutionDivList = data;
     });
 }
 GetType() {
   const obj = {
     "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
     "Report_Name_String" : "Get_BL_CRM_Mst_Enq_Tender_Type",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.TypeData = data;
     });
 }
 GetTenderCategoryList() {
   const obj = {
     "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
     "Report_Name_String" : "Get_BL_CRM_Mst_Enq_Tender_Category",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.tenderCategoryList = data;
   });
 }
 GetStateList() {
   this.$http
   .get("/Common/Get_State_List")
   .subscribe((data: any) => {
     this.StateList = data.length ? data : [];
   });
  }
  getAssignforbudget(){
   const obj = {
     "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
     "Report_Name_String": "Get_User"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.UserList = data;
      console.log('UserList =',this.UserList)
    })
 }
 GetTenderInfoEnqSRC() {
   const obj = {
     "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
     "Report_Name_String" : "Get_BL_Enq_Source_Master",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.TenderInfoEnqList = data;
       console.log("TenderInfoEnqList",this.TenderInfoEnqList);
     });
 }

 // Tender Details 
 GetAllEditData(){
  const obj = {
    "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
    "Report_Name_String": "Get_BL_CRM_Txn_Enq_Tender_Harbauer_Data",
    "Json_Param_String": JSON.stringify([{Tender_Doc_ID : this._TenderId}])
  }
  this.GlobalAPI
    .getData(obj)
    .subscribe((data: any) => {
      if(data[0]){
        this.ObjTender = data[0];
        this.InformedDate = new Date(data[0].Tender_Informed_Date);
        this.BudgetRequidBy = new Date(data[0].Budget_Required_By);
        this.TenderOpenDate = new Date(data[0].Tender_Bid_Opening_Date);
        this.TenderEndDate = new Date(data[0].Tender_Last_Sub_Date);
        this.TenderPublishDate = new Date(data[0].Tender_Publish_Date);
        const tender = this.tenderOrg.filter(el=> Number(el.Tender_Org_ID) === Number(data[0].Tender_Org_ID));
        this.ObjTender.Tender_Org_ID = tender.length ?   tender[0].Tender_Organization : '';
        const tendercall = this.TenderCallingDivList.filter(el=> Number(el.Tender_Calling_Div_ID) === Number(data[0].Tender_Calling_Div_ID));
        this.ObjTender.Tender_Calling_Div_ID = tendercall.length ?  tendercall[0].Tender_Calling_Div_Name : '';
        const tenderDiv = this.TenderExecutionDivList.filter(el=> Number(el.Tender_Execution_Div_ID) === Number(data[0].Tender_Execution_Div_ID));
        this.ObjTender.Tender_Execution_Div_ID = tenderDiv.length ?  tenderDiv[0].Tender_Execution_Div_Name : '';
        const tenderType = this.TypeData.filter(el=> Number(el.Tender_Type_ID) === Number(data[0].Tender_Type_ID));
        this.ObjTender.Tender_Type_ID = tenderType.length ? tenderType[0].Tender_Type_Name : '';
        const tenderCategory = this.tenderCategoryList.filter(el=> Number(el.Tender_Category_ID) === Number(data[0].Tender_Category_ID));
        this.ObjTender.Tender_Category_ID =  tenderCategory.length ? tenderCategory[0].Tender_Category_Name : '';
       const tendrInformation = this.TenderInfoEnqList.filter(el=> Number(el.Enq_Source_ID) === Number(data[0].Enq_Source_ID));
        this.ObjTender.State = tendrInformation.length ?  tendrInformation[0].Enq_Source_Name : '';
        const tendrAssign = this.UserList.filter(el=> Number(el.User_ID) === Number(data[0].User_ID));
        this.ObjTender.User_ID =  tendrAssign.length ?  tendrAssign[0].User_Name : '';
      }
      console.log("ObjTender",this.ObjTender);
      
    })
}
getThenderWorkLocation(){
  const obj = {
    "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
    "Report_Name_String": "Get_BL_CRM_Txn_Enq_Tender_Work_Location_Data",
    "Json_Param_String": JSON.stringify([{Tender_Doc_ID : this._TenderId}])
  }
  this.GlobalAPI
    .getData(obj)
    .subscribe((data: any) => {
       if(data){
        this.testchips = data;
        // data.forEach(ele => {
        //   this.testchips.push(ele.Work_Location)
        // });
      }
      console.log("testchips",this.testchips);

    })
}
  FetchValues() {
    if(this._TenderId) {
      this.GetAllEditData();
      this.getThenderWorkLocation();
    }
  }

}

class Tender{
  Tender_Doc_ID :number;
  Cost_Cen_ID : number;
  User_ID : number;	
  Work_Name : string;							
  Work_Details : string;
  Tender_Name:string;				
  Tender_Org_ID:number;
  Tender_Calling_Div_ID:number;
  Tender_Execution_Div_ID:number;
  Tender_Ref_No:string;
  Tender_ID:number;
  Tender_Type_ID:number;
  Tender_Category_ID:number;
  Tender_Amount : number;
  State:string;				
  Tender_Value:any;
  Tender_Publish_Date:string;
  Tender_Last_Sub_Date:string;
  Tender_Bid_Opening_Date:string;
  EMD_Amount:string;
  T_Fee_Amount:string;
  Enq_Source_ID:number;
  Tender_Informed_Date:string;
  Period_Of_Working:string;
  Budget_Required_By:string;
  Govt_Proposal:string;
  Tender_Publishing_Info_From:any
}