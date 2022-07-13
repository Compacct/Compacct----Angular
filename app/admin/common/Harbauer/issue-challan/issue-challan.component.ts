import { CompacctProjectComponent } from './../../../shared/compacct.components/compacct.forms/compacct-project/compacct-project.component';
import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import {CompacctGetDistinctService } from "../../../shared/compacct.services/compacct-get-distinct.service"
import * as moment from "moment";
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
declare var $:any;

@Component({
  selector: 'app-issue-challan',
  templateUrl: './issue-challan.component.html',
  styleUrls: ['./issue-challan.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class IssueChallanComponent implements OnInit {
  items:any = [];
  menuList =[];
  tabIndexToView= 0;
  AllData =[];
  buttonname = "Create";
  projectFromSubmit = false;
  objProjectRequi:any = {};
  DOC_Date = new Date();
  vouchermaxDate = new Date();
  voucherminDate = new Date();
  voucherdata = new Date();
  AddMaterialsList = []
  projectDisable = false;
  objproject:project = new project();
  ObjBrowse:Browse = new Browse();
  ObjPanding:Panding = new Panding();
  initDate:any = [];
  DynamicHeader:any = [];
  DynamicHeader2:any = [];
  costCenterList = [];
  Stocklist =[];
  buttonList =[];
  SearchedlistPanding:any=[];
  backUPSearchedlistPanding:any=[];
  DistProject:any = [];
  SelectedDistProject:any = [];
  DistSite:any = [];
  SelectedDistSite:any = [];
  DistBudgetGroup:any = [];
  SelectedBudgetGroup:any = [];
  DistBudgetSubGroup:any = [];
  SelectedBudgetSubGroup:any =[];
  DistWorkDetails:any =[];
  SelectedDistWorkDetails:any =[];
  ReqNoId:any =[];
  //createList =[];
  createListObj:any={};
  BatchQtyTotal:number = 0;
  DelQtyTotal:number = 0
  Spinner = false;
  Save = false;
  Del = false;
  Searchedlist : any;
  validatation : any;
  constructor(
    public $http: HttpClient,
    public commonApi: CompacctCommonApi,
    private GlobalAPI:CompacctGlobalApiService,
    public Header: CompacctHeader,
    public DateService: DateTimeConvertService,
    public compacctToast: MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService 
  ) {}

ngOnInit() {
    this.items = ["BROWSE", "PANDING REQUISITION","CREATE"];
       this.Header.pushHeader({
      Header: "Issue Challan",
      Link: " Project Management ->Issue to Project"
    });
    this.getCostCenter();
    this.Finyear();
    this.GetcreateIssueMaster();
  }
TabClick(e:any) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "PANDING REQUISITION","CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  GetSearchedList(){}
  saveData(valid){}
getCostCenter(){
    const obj = {
     "SP_String": "sp_Comm_Controller",
     "Report_Name_String" : "Get_Master_Cost_Center_Dropdown"
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //console.log("LedgerList======",data);
     if(data.length) {
       data.forEach(element => {
         element['label'] = element.Cost_Cen_Name,
         element['value'] = element.Cost_Cen_ID								
       });
       this.costCenterList = data;
     } 
     else {
       this.costCenterList = [];
     }
   console.log("costCenterList======",this.costCenterList);
   });
} 
getStockPoint(){
  var savedata ={}
  this.Stocklist = [];
if(this.objproject.Cost_Cen_ID){
   savedata ={
    Cost_Cen_ID: Number(this.objproject.Cost_Cen_ID),
  }
}
else if(this.ObjBrowse.Cost_Cen_ID)
{
 savedata ={
    Cost_Cen_ID: Number(this.ObjBrowse.Cost_Cen_ID),
  }
}
const obj = {
"SP_String": "SP_Txn_Requisition",
"Report_Name_String": "Get_Cost_Center_Godown",
"Json_Param_String": JSON.stringify([savedata])
}
this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  if(data.length) {
    data.forEach(element => {
      element['label'] = element.godown_name,
      element['value'] = element.Godown_ID	});
 this.Stocklist = data;
 console.log('Stocklist=====',this.Stocklist)
  }
  else{
    this.Stocklist = []; 
  }
})
} 
clearData(){
    this.ObjBrowse = new Browse();
    this.objproject = new project();
    this.SearchedlistPanding =[];
    this.backUPSearchedlistPanding = []
    this.initDate = [];
    this.DOC_Date = this.voucherdata;
    //
    this.DistProject = [];
    this.SelectedDistProject = [];
    this.DistSite = [];
    this.SelectedDistSite = [];
    this.DistBudgetGroup = [];
    this.SelectedBudgetGroup = [];
    this.DistBudgetSubGroup = [];
    this.SelectedBudgetSubGroup =[];
    this.DistWorkDetails =[];
    this.SelectedDistWorkDetails =[];
    this.createListObj = {};
    this.buttonList =[];
}
getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
     this.ObjPanding.From_Date = dateRangeObj[0];
     this.ObjPanding.To_Date = dateRangeObj[1];
    }
}
Finyear() {
  this.$http
    .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
    .subscribe((res: any) => {
    let data = JSON.parse(res)
     this.vouchermaxDate = new Date(data[0].Fin_Year_End);
   this.voucherminDate = new Date(data[0].Fin_Year_Start);
   this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
   this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
    });
}
GetPandingSearch(){
  this.SearchedlistPanding = [];
  this.backUPSearchedlistPanding = [];
  const start = this.ObjPanding.From_Date
  ? this.DateService.dateConvert(new Date(this.ObjPanding.From_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.ObjPanding.To_Date
  ? this.DateService.dateConvert(new Date(this.ObjPanding.To_Date))
  : this.DateService.dateConvert(new Date());
  const tempobj = {
    From_Date : start,
    To_Date : end,
  }
  //console.log("tempobj==",tempobj)
  const obj = {
  "SP_String": "SP_BL_CRM_Issue_Challan",
  "Report_Name_String": "Get_Pending_Requisition",
  "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length){
      this.SearchedlistPanding = data;
      this.DynamicHeader = Object.keys(data[0]);
     this.backUPSearchedlistPanding = data;
     this.GetDistinct()
    }
 
   console.log('SearchedlistPanding===',this.SearchedlistPanding)
  })
}
GetDistinct() {
  let Project:any = [];
  let Site:any = [];
  let BudgetGroup:any = [];
  let BudgetSubGroup:any = [];
  let WorkDetails:any = []
  this.DistProject = [];
  this.SelectedDistProject = [];
  this.DistSite = [];
  this.SelectedDistSite = [];
  this.DistBudgetGroup = [];
  this.SelectedBudgetGroup = [];
  this.DistBudgetSubGroup = [];
  this.SelectedBudgetSubGroup =[];
  this.DistWorkDetails =[];
  this.SelectedDistWorkDetails =[];
  this.SearchedlistPanding.forEach((item) => {
 if (Project.indexOf(item.Project_Description) === -1) {
  Project.push(item.Project_Description);
 this.DistProject.push({ label: item.Project_Description, value: item.Project_Description });
 }
if (Site.indexOf(item.Site_Description) === -1) {
  Site.push(item.Site_Description);
  this.DistSite.push({ label: item.Site_Description, value: item.Site_Description });
  }
if (BudgetGroup.indexOf(item.Budget_Group_Name) === -1) {
  BudgetGroup.push(item.Budget_Group_Name);
  this.DistBudgetGroup.push({ label: item.Budget_Group_Name, value: item.Budget_Group_Name });
  }
if (BudgetSubGroup.indexOf(item.Budget_Sub_Group_Name) === -1) {
  BudgetSubGroup.push(item.Budget_Sub_Group_Name);
  this.DistBudgetSubGroup.push({ label: item.Budget_Sub_Group_Name, value: item.Budget_Sub_Group_Name });
  }
if (WorkDetails.indexOf(item.Work_Details) === -1) {
  WorkDetails.push(item.Work_Details);
  this.DistWorkDetails.push({ label: item.Work_Details, value: item.Work_Details });
  }

});
   this.backUPSearchedlistPanding = [...this.SearchedlistPanding];
}
FilterDist() {
  let Project:any = [];
  let Site:any = [];
  let BudgetGroup:any = [];
  let BudgetSubGroup:any = [];
  let WorkDetails:any = []
  let SearchFields:any =[];
if (this.SelectedDistProject.length) {
   SearchFields.push('Project_Description');
   Project = this.SelectedDistProject;
}
if (this.SelectedDistSite.length) {
  SearchFields.push('Site_Description');
  Site = this.SelectedDistSite;
}
if (this.SelectedBudgetGroup.length) {
  SearchFields.push('Budget_Group_Name');
  BudgetGroup = this.SelectedBudgetGroup;
}
if (this.SelectedBudgetSubGroup.length) {
  SearchFields.push('Budget_Sub_Group_Name');
  BudgetSubGroup = this.SelectedBudgetSubGroup;
}
if (this.SelectedDistWorkDetails.length) {
  SearchFields.push('Work_Details');
  WorkDetails = this.SelectedDistWorkDetails;
}

this.SearchedlistPanding = [];
if (SearchFields.length) {
  let LeadArr = this.backUPSearchedlistPanding.filter(function (e) {
    return (Project.length ? Project.includes(e['Project_Description']) : true)
    && (Site.length ? Site.includes(e['Site_Description']) : true)
    && (BudgetGroup.length ? BudgetGroup.includes(e['Budget_Group_Name']) : true)
    && (BudgetSubGroup.length ? BudgetSubGroup.includes(e['Budget_Sub_Group_Name']) : true)
    && (WorkDetails.length ? WorkDetails.includes(e['Work_Details']) : true)
    
  });
this.SearchedlistPanding = LeadArr.length ? LeadArr : [];
} else {
this.SearchedlistPanding = [...this.backUPSearchedlistPanding] ;
}

}
PrintBill(obj){
  if (obj.Appo_ID) {
    window.open("Report/Crystal_Files/CRM/Clinic/Audiometry_Report_CC_Saha_P1.aspx?Appo_ID=" + obj.Appo_ID, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
}

}
createIssue(ReqnoObj:any){
  this.ReqNoId= undefined
  if (ReqnoObj.Req_No) {
    this.ReqNoId= undefined;
    this.tabIndexToView = 2;
    this.items = ["BROWSE", "PANDING REQUISITION","CREATE"];
    this.buttonname = "Create";
    this.clearData();
    this.ReqNoId = ReqnoObj.Req_No;
    this.createListObj = {};
   this.GetcreateIssueMaster();
  
   }    
}
GetcreateIssueMaster(){
const tempobj = {
  Req_No : this.ReqNoId,
}
const obj = {
  "SP_String": "SP_BL_CRM_Issue_Challan",
  "Report_Name_String":"Get_Requisition_Product_Details",
  "Json_Param_String": JSON.stringify([tempobj]) 
 }
 this.GlobalAPI.getData(obj).subscribe((res:any)=>{
  //let data = JSON.parse(res[0].topper);
 //this.createList= data
 if(res.length){
  this.createListObj = res[0]
  //this.objproject = data[0];
  this.objproject.Req_No = res[0].Req_No;
 }

  
  //this.lowerAddList = data[0].bottom
 // console.log("create==",this.createListObj)
 })
}
getButtomData(){
  this.buttonList = []
const tempobj = {
  Req_No : this.ReqNoId,
  Cost_Cen_ID : Number(this.objproject.Cost_Cen_ID),
  godown_id : Number(this.objproject.Godown_ID)
}
const obj = {
  "SP_String": "SP_BL_CRM_Issue_Challan",
  "Report_Name_String":"Get_Requisition_Product_Details_Batch",
  "Json_Param_String": JSON.stringify([tempobj]) 
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  console.log("getButtomData==",data)
  if(data.length){
    this.buttonList = data;
    this.GetTotalIssue()
  }
  else{
    this.buttonList =[]
  }
  
  //this.createListObj = res[0] 
 })
}
getToFix(n:any){
  return Number(Number(n).toFixed())
 }
GetTotalbatch(){
   let flg:Number = 0
   this.buttonList.forEach((ele:any) => {
     (flg) = Number(ele.Batch_Qty) + Number(flg)
   });
   this.BatchQtyTotal = Number(Number(flg).toFixed())
   return this.BatchQtyTotal
 }
 GetTotalIssue(){
  console.log("check")
  let flg:Number = 0
  this.buttonList.forEach((ele:any) => {
    flg = Number(ele.Del_Qty) + Number(flg)
  });
  this.DelQtyTotal = Number(Number(flg).toFixed())
  return this.DelQtyTotal
}
// saveData(valid:any){
//   //console.log("savedata==",this.ObjHrleave);
//   this.projectFromSubmit= true
//  if(valid){
// var Prod = this.createListObj.filter(item => Number(item.Project_Description) === Number(this.objproject.PROJECT_ID))
// var sitd = this.createListObj.filter(item => Number(item.Site_Description) === Number(this.objproject.SITE_ID))
// var grp = this.createListObj.filter(item => Number(item.Budget_Group_Name) === Number(this.objproject.Budget_Group_ID))
// var sgrp = this.createListObj.filter(item => Number(item.Budget_Sub_Group_Name) === Number(this.objproject.Budget_Sub_Group_ID))
// var wrk = this.createListObj.filter(item => Number(item.Work_Details) === Number(this.objproject.Work_Details_ID))
//   this.objproject.PROJECT_ID = Prod.length ? Prod[0].PROJECT_ID:undefined;
//   this.objproject.User_ID = Number(this.$CompacctAPI.CompacctCookies.User_ID);
//   this.objproject.DOC_Date = this.DateService.dateConvert(new Date(this.voucherdata));
//   this.objproject.Cost_Cen_ID = this.objproject.Cost_Cen_ID;
//   this.objproject.Godown_ID = this.objproject.Godown_ID;
//   this.objproject.Delivery_By = this.objproject.Delivery_By;
//   this.objproject.Remarks = this.objproject.Remarks;
//   this.objproject.Req_No = this.createListObj;
//   this.objproject.PROJECT_ID = this.createListObj;
//   this.objproject.SITE_ID = sitd.length ? sitd[0].SITE_ID:undefined;
//   this.objproject.Budget_Group_ID = grp.length ? grp[0].Budget_Group_ID:undefined;
//   this.objproject.Budget_Sub_Group_ID = sgrp.length ? sgrp[0].Budget_Sub_Group_ID:undefined;
//   this.objproject.Work_Details_ID = wrk.length ? wrk[0].Work_Details_ID:undefined;
//   this.objproject.bottom = this.buttonList;
//  }
//  console.log("data fi",this.objproject)
//   //  const obj = {
//   //       "SP_String": "SP_BL_CRM_Issue_Challan",
//   //       "Report_Name_String": 'Get_Requisition_Product_Details_Batch',
//   //       "Json_Param_String": JSON.stringify([this.objproject])
//   //      }
//   //      this.GlobalAPI.getData(obj)
//   //      .subscribe((data:any)=>{
//   //       console.log("Final save data ==",data);
//   //       if (data[0].Column1){
//   //         this.compacctToast.clear();
//   //         this.compacctToast.add({
//   //           key: "compacct-toast",
//   //           severity: "success",
//   //           summary: "Succesfully " +data[0].Msg,
//   //           detail: "Succesfully "
//   //         });
//   //         this.Spinner = false;
//   //         //this.GetBrowseData();
//   //         //this.HrleaveId = undefined;
//   //         //this.txnId = undefined;
          
//   //         this.tabIndexToView = 0;
//   //         this.projectFromSubmit = false;
//   //         this.objproject = new project();
//   //         //this.FromDatevalue = new Date()
//   //         //this.ToDatevalue = new Date()
          
//   //         }
//   //         else {
//   //           this.Spinner = false;
//   //           this.compacctToast.clear();
//   //           this.compacctToast.add({
//   //             key: "compacct-toast",
//   //             severity: "error",
//   //             summary: "Warn Message ",
//   //             detail: data[0].Msg
//   //           });
//   //         }
         
         
//   //   });
// }

onReject(){
  this.compacctToast.clear("c");
}

}
class project{
PROJECT_ID:any;
Budget_Group_ID:any;
Budget_Sub_Group_ID:any;
Work_Details_ID:any;
Cost_Cen_ID:any;
Godown_ID:any;
Remarks :any;
Delivery_By :any;

DOC_No="NA";	
DOC_Date:any;
Req_No:any;		
Cost_Cen_Name:any	;	
Inv_Type_ID	= 84;	
Product_ID:any;   
Issue_Qty:number;  
UOM:any;	 
User_ID:any;	 
Sub_Ledger_ID	= 0;
Batch_Number:any;	   		
Serial_No	= 0;					
Rate:any;		      				
Product_Expiry:any;	    						
Expiry_Date:any;	      
DOC_TYPE = "ISSUE CHALLAN";     
SITE_ID:any;
bottom:any;
						
Product_Description	:any;	
}           
class Browse{
  Cost_Cen_ID:any;
  From_Date: any;
  To_Date	:any;
  Godown_ID:any;
}
class Panding{
  From_Date: any;
  To_Date	:any;
}
