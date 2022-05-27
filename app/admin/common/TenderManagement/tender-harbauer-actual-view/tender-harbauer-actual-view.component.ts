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
import { kill } from 'process';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-tender-harbauer-actual-view',
  templateUrl: './tender-harbauer-actual-view.component.html',
  styleUrls: ['./tender-harbauer-actual-view.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TenderHarbauerActualViewComponent implements OnInit {
  tabIndexToView = 0;
  Objsearch = new search();
  TenderSerachFormSubmit = false;
  filterByList = [];
  financalList = [];
  tenderOrgList = [];
  TypeList = [];
  filteroptionList = [];
  Spinner = false;
  getAllTenderData = [];
  cols =[];
  tenderOrg = [];
  TenderCallingDivList = [];
  TenderExecutionDivList = [];
  TypeData = [];
  tenderCategoryList = [];
  StateList = [];
  UserList = [];
  editTenderId = undefined;
  TenderInfoEnqList = [];
  ObjTender:Tender = new Tender();
  testchips = [];
  viewModel = false;
  InformedDate = new Date();
  BudgetRequidBy = new Date();
  TenderOpenDate = new Date();
  TenderEndDate = new Date();
  TenderPublishDate = new Date()
  constructor(  
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems :CompacctGetDistinctService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Tender View (GOVT.)",
      Link: "Tender Management -> Tender View"
    });
    this.getFinancial();
    this.GetTenderOrgList();
    this.GetTypeList();
    this.filterByList = ['FINANCIAL YEAR','DEPARTMENT',"PRIVATE OR GOVT","TENDER TYPE"];
    this.filteroptionList = ['NOT RECEIVED TENDER','AWARDING THE TENDER','NOT SUBMITTED TENDER','PENDING TENDER'];
    this.cols = [
      { field: 'Work_Name', header: 'Name of Work' },
      { field: 'Tender_Authority', header: 'Tender Authority' },
      { field: 'Tender_Value', header: 'Tender Value' },
      { field: 'Tender_Last_Sub_Date', header: 'Tender Last Sub Date' },
      { field: 'State', header: 'State' },
      { field: 'EMD_Amount', header: 'EMD Amount' },
      { field: 'Tender_Publish_Date', header: 'Tender Publish Date' },
      { field: 'Status', header: 'Status' }
  ];
  }
  clearData(){

  }
  onReject() {
    this.compacctToast.clear("c");
  }
  changefilterType(){
  this.Objsearch.Filter1_Data_Value = undefined;
  }
  getFinancial(){
    this.$http
    .get("Common/Get_Fin_Year")
    .subscribe((data: any) => {
      this.financalList = data ? JSON.parse(data) : [];
    });
  }
  GetTenderOrgList() {
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Organization_Json")
      .subscribe((data: any) => {
        this.tenderOrgList = data ? JSON.parse(data) : [];
      });
  }
  GetTypeList() {
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Type_Json")
      .subscribe((data: any) => {
        this.TypeList = data ? JSON.parse(data) : [];
      });
  }
  SearchTender(valid){
    console.log("valid",valid);
    let searchData:any = []
    this.TenderSerachFormSubmit = true;
    if(valid){
     this.TenderSerachFormSubmit = false
      this.Spinner = true;
     if(this.Objsearch.Filter1_Text === "FINANCIAL YEAR"){
       const filterdata = this.financalList.filter(ob => Number(ob.Fin_Year_ID) === Number(this.Objsearch.Filter1_Data_Value))[0];
       console.log("filterdata",filterdata);
       searchData = {
         Filter1_Text: this.Objsearch.Filter1_Text,
         Filter1_Data_Value:filterdata.Fin_Year_ID,
         Filter1_Data_Text:filterdata.Fin_Year_Name,
         Filter2_Text:this.Objsearch.Filter2_Text ? this.Objsearch.Filter2_Text : "NA"
       }
     }
     else if(this.Objsearch.Filter1_Text === "DEPARTMENT"){
       const filterdata = this.tenderOrgList.filter(ob => Number(ob.Tender_Org_ID) === Number(this.Objsearch.Filter1_Data_Value))[0];
       console.log("filterdata",filterdata);
       searchData = {
         Filter1_Text: this.Objsearch.Filter1_Text,
         Filter1_Data_Value:filterdata.Tender_Org_ID,
         Filter1_Data_Text:filterdata.Tender_Organization,
         Filter2_Text:this.Objsearch.Filter2_Text ? this.Objsearch.Filter2_Text : "NA"
       }
     }
     else if(this.Objsearch.Filter1_Text === "TENDER TYPE"){
       const filterdata = this.TypeList.filter(ob => Number(ob.Tender_Type_ID) === Number(this.Objsearch.Filter1_Data_Value))[0];
       console.log("filterdata",filterdata);
       searchData = {
         Filter1_Text: this.Objsearch.Filter1_Text,
         Filter1_Data_Value:filterdata.Tender_Type_ID,
         Filter1_Data_Text:filterdata.Tender_Type_Name,
         Filter2_Text:this.Objsearch.Filter2_Text ? this.Objsearch.Filter2_Text : "NA"
       }
     }
     else {
       searchData = {
         Filter1_Text: this.Objsearch.Filter1_Text,
         Filter1_Data_Value:this.Objsearch.Filter1_Data_Value,
         Filter1_Data_Text:this.Objsearch.Filter1_Data_Value,
         Filter2_Text:this.Objsearch.Filter2_Text ? this.Objsearch.Filter2_Text : "NA"
       }
     }
   console.log("search data",searchData);
   const obj = {
     "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
     "Report_Name_String": "Get_All_Tender_Browse_V2",
     "Json_Param_String" : JSON.stringify(searchData)
   }
   this.GlobalAPI
       .getData(obj)
       .subscribe((data: any) => {
         console.log(data);
         this.getAllTenderData = data;
         this.Spinner = false;
         
       })
 
    }
   }
   // View
   async view(col:any){
     console.log("View Obj",col);
     if(col.Tender_Doc_ID){
      this.ngxService.start();
      this.editTenderId = col.Tender_Doc_ID; 
      this.testchips = [];
      this.ObjTender = new Tender();
      setTimeout(()=>{
        this.viewModel = true;
        this.ngxService.stop();
      },1200)
    //  await this.GetTenderOrg();
    //  await this.GetTenderCallingDiv();
    //  await this.GetTenderExecutionDiv();
    //  await this.GetType();
    //  await this.GetTenderCategoryList();
    //  await this.GetStateList();
    //  await this.getAssignforbudget();
    //  await this.GetTenderInfoEnqSRC();
    //  await this.GetAllEditData(col.Tender_Doc_ID);
    //  await this.getThenderWorkLocation(col.Tender_Doc_ID);
     
    }
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
  GetAllEditData(DocID){
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_BL_CRM_Txn_Enq_Tender_Harbauer_Data",
      "Json_Param_String": JSON.stringify([{Tender_Doc_ID : DocID}])
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
          this.ObjTender.Tender_Org_ID = tender[0].Tender_Organization;
          const tendercall = this.TenderCallingDivList.filter(el=> Number(el.Tender_Calling_Div_ID) === Number(data[0].Tender_Calling_Div_ID));
          this.ObjTender.Tender_Calling_Div_ID = tendercall[0].Tender_Calling_Div_Name;
          const tenderDiv = this.TenderExecutionDivList.filter(el=> Number(el.Tender_Execution_Div_ID) === Number(data[0].Tender_Execution_Div_ID));
          this.ObjTender.Tender_Execution_Div_ID = tenderDiv[0].Tender_Execution_Div_Name;
          const tenderType = this.TypeData.filter(el=> Number(el.Tender_Type_ID) === Number(data[0].Tender_Type_ID));
          this.ObjTender.Tender_Type_ID = tenderType[0].Tender_Type_Name;
          const tenderCategory = this.tenderCategoryList.filter(el=> Number(el.Tender_Category_ID) === Number(data[0].Tender_Category_ID));
          this.ObjTender.Tender_Category_ID = tenderCategory[0].Tender_Category_Name;
         const tendrInformation = this.TenderInfoEnqList.filter(el=> Number(el.Enq_Source_ID) === Number(data[0].Enq_Source_ID));
          this.ObjTender.State = tendrInformation[0].Enq_Source_Name;
          const tendrAssign = this.UserList.filter(el=> Number(el.User_ID) === Number(data[0].User_ID));
          this.ObjTender.User_ID = tendrAssign[0].User_Name;
        }
        console.log("ObjTender",this.ObjTender);
        
      })
  }
  getThenderWorkLocation(DocID){
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_BL_CRM_Txn_Enq_Tender_Work_Location_Data",
      "Json_Param_String": JSON.stringify([{Tender_Doc_ID : DocID}])
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
  checkChip(e) { 
    const val =  this.testchips.indexOf(e.value);
    this.testchips.splice(val,1);
     this.testchips.push({"Tender_Doc_ID":this.editTenderId,"Work_Location":e.value});
   }
}
class search{
  Filter1_Text:string;
  Filter1_Data_Value:string;
  Filter2_Text :string;
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