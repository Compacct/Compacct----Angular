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
  BrowseFromSubmit = false;
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
  initDate2:any =[];
  DynamicHeader:any = [];
  DynamicHeader2:any = [];
  costCenterList:any = [];
  Stocklist:any =[];
  buttonList:any =[];
  buttonListBackUp:any = []
  SearchedlistPanding:any=[];
  SearchedlistBrowse:any=[];
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
  showTost = true;
  ObjCol = {}
  overlayPanelText= ""
  Objproject:any = {}
  validatationBatch_No:boolean = false
  openTab:boolean = false
  DOCNo:any = ""
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
    this.items = ["BROWSE", "PENDING REQUISITION","CREATE"];
       this.Header.pushHeader({
      Header: "Issue Challan",
      Link: " Project Management ->Issue to Project"
    });
    this.getCostCenter();
    this.Finyear();
   // this.GetcreateIssueMaster();
  }
TabClick(e:any) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "PENDING REQUISITION","CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
GetSearchedListBrowse(valid:any){
  this.BrowseFromSubmit = true;
  if(valid){
  this.SearchedlistBrowse = [];
  const start = this.ObjBrowse.From_Date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.From_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.ObjBrowse.To_Date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.To_Date))
  : this.DateService.dateConvert(new Date());
  const tempobj = {
    From_Date : start,
    To_Date : end,
    Cost_Cen_ID: this.ObjBrowse.Cost_Cen_ID,
    Godown_ID : this.ObjBrowse.Godown_ID,
  }
  //console.log("tempobj==",tempobj)
  const obj = {
  "SP_String": "Sp_Issue_Challan",
  "Report_Name_String": "Bl_Txn_Issue_Challan_Browse",
  "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length){
      this.SearchedlistBrowse = data;
      this.DynamicHeader2 = Object.keys(data[0]);

    }
   console.log('SearchedlistBrowse===',this.SearchedlistBrowse)
  })
}
}
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
       this.ObjBrowse.Cost_Cen_ID = this.costCenterList.length ? this.costCenterList[0].Cost_Cen_ID : undefined
       if(this.ObjBrowse.Cost_Cen_ID){
        this.getStockPoint()
       }
       
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
      this.ObjBrowse.Godown_ID = this.Stocklist.length ? this.Stocklist[0].Godown_ID : undefined
  }
  else{
    this.Stocklist = []; 
  }
})
} 
clearData(){
    //this.ObjBrowse = new Browse();
    this.objproject = new project();
    this.SearchedlistPanding =[];
    this.SearchedlistBrowse =[];
    this.backUPSearchedlistPanding = []
    this.initDate = [];
    this.initDate2 = [];
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
    this.buttonListBackUp = []
    this.showTost = true;
    this.DelQtyTotal = 0
    this.Objproject = {}

    this.projectFromSubmit = false
    this.openTab = false
    this.validatationBatch_No = false
    this.DOCNo = ""
    this.compacctToast.clear();
}
getDateRange(dateRangeObj:any) {
    if (dateRangeObj.length) {
     this.ObjPanding.From_Date = dateRangeObj[0];
     this.ObjPanding.To_Date = dateRangeObj[1];
    }
    if(dateRangeObj.length){
      this.ObjBrowse.From_Date = dateRangeObj[0];
      this.ObjBrowse.To_Date = dateRangeObj[1];
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
   this.initDate2 = [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
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
  this.DistProject = [];
  this.SelectedDistProject = [];
  this.SearchedlistPanding.forEach((item) => {
 if (Project.indexOf(item.Project_Description) === -1) {
  Project.push(item.Project_Description);
 this.DistProject.push({ label: item.Project_Description, value: item.Project_Description });
 }
});
   this.backUPSearchedlistPanding = [...this.SearchedlistPanding];
}
GetDistinctbuttonList() {
  let Site:any = [];
  let BudgetGroup:any = [];
  let BudgetSubGroup:any = [];
  let WorkDetails:any = []
  this.DistSite = [];
  this.SelectedDistSite = [];
  this.DistBudgetGroup = [];
  this.SelectedBudgetGroup = [];
  this.DistBudgetSubGroup = [];
  this.SelectedBudgetSubGroup =[];
  this.DistWorkDetails =[];
  this.SelectedDistWorkDetails =[];
  this.buttonList.forEach((item) => {

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
   this.buttonListBackUp = [...this.buttonList];
}
FilterDist() {
  let Project:any = [];

  let SearchFields:any =[];
if (this.SelectedDistProject.length) {
   SearchFields.push('Project_Description');
   Project = this.SelectedDistProject;
}
this.SearchedlistPanding = [];
if (SearchFields.length) {
  let LeadArr = this.backUPSearchedlistPanding.filter(function (e) {
    return (Project.length ? Project.includes(e['Project_Description']) : true)
  });
this.SearchedlistPanding = LeadArr.length ? LeadArr : [];
} else {
this.SearchedlistPanding = [...this.backUPSearchedlistPanding] ;
}

}
FilterDistbuttonList() {
  let Site:any = [];
  let BudgetGroup:any = [];
  let BudgetSubGroup:any = [];
  let WorkDetails:any = []
  let SearchFields:any =[];

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

this.buttonList = [];
if (SearchFields.length) {
  let LeadArr = this.buttonListBackUp.filter(function (e) {
    return (Site.length ? Site.includes(e['Site_Description']) : true)
    && (BudgetGroup.length ? BudgetGroup.includes(e['Budget_Group_Name']) : true)
    && (BudgetSubGroup.length ? BudgetSubGroup.includes(e['Budget_Sub_Group_Name']) : true)
    && (WorkDetails.length ? WorkDetails.includes(e['Work_Details']) : true)
    
  });
this.buttonList = LeadArr.length ? LeadArr : [];
} else {
this.buttonList = [...this.buttonListBackUp] ;
}

}
PrintBill(obj:any){
    if(obj) {
    const objtemp = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Requisition_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Doc_No=" + obj.DOC_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
  }
createIssue(ReqnoObj:any){
  this.ReqNoId= undefined
  if (ReqnoObj.Req_No) {
    this.ReqNoId= undefined;
     this.items = ["BROWSE", "PENDING REQUISITION","CREATE"];
    this.buttonname = "Create";
    this.clearData();
    this.ReqNoId = ReqnoObj.Req_No;
    this.createListObj = {};
    this.createListObj = ReqnoObj;
    this.openTab = true
    this.tabIndexToView = 2;
   }    
}

getButtomData(){
  this.buttonList = []
  this.buttonListBackUp = []
  this.ngxService.start()
const tempobj = {
  Req_No : this.ReqNoId,
  Cost_Cen_ID : Number(this.objproject.Cost_Cen_ID),
  godown_id : Number(this.objproject.Godown_ID)
}
const obj = {
  "SP_String": "SP_BL_CRM_Issue_Challan",
  "Report_Name_String":"Get_Requisition_Product_Details_Batch",
  "Json_Param_String": JSON.stringify([{...tempobj,...this.Objproject}]) 
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  console.log("getButtomData==",data)
  this.ngxService.stop()
  if(data.length){
    this.buttonList = data;
    this.buttonListBackUp = data
    this.GetTotalIssue()
    this.GetDistinctbuttonList()
  }
  else{
    this.buttonList =[]
    this.buttonListBackUp = []
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
saveData(valid:any){
  this.projectFromSubmit= true
  let tempDataSave:any = []
  console.log(this.validatationBatch_No)
 if(valid ){
 
    this.buttonList.forEach((ele:any) => {
      this.showTost = false
    
      if(ele.Del_Qty > ele.Batch_Qty){
        this.showTost = false
        this.validatationBatch_No = true
        this.ngxService.stop()
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          sticky: true,
          summary: "Warn Message ",
          detail:"Issue QTY Must be equal or less than Batch QTY "
        });
       return
      }
      if( Number(ele.Del_Qty) >  Number(ele.Ori_Req_Qty))
      {
        this.showTost = false
        this.validatationBatch_No = true
        this.ngxService.stop()
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          sticky: true,
          summary: "Warn Message ",
          detail:"Issue QTY Must be equal or less than Requisition QTY"
        });
       return
      }
      if(!ele.Batch_No){
        this.validatationBatch_No = true
        this.ngxService.stop()
       return
      }
      if( !(Number(ele.Del_Qty)))
      {
        this.validatationBatch_No = true
        this.showTost = false
        this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            sticky: true,
            summary: "Warn Message ",
            detail:"Issue QTY Must be required"
          });
        return
      }
    });
    if(!this.validatationBatch_No){
      this.compacctToast.clear();
      this.ngxService.start()
      this.showTost = true
      const costCenter:any = this.costCenterList.filter((el:any)=> Number(el.Cost_Cen_ID) == Number(this.objproject.Cost_Cen_ID))
      tempDataSave = {
          DOC_No: "NA",
          DOC_Date: this.DateService.dateConvert(new Date(this.DOC_Date)),
          Req_No: this.createListObj.Req_No,
          Cost_Cen_ID: Number(this.objproject.Cost_Cen_ID) ,
          Cost_Cen_Name	: costCenter.length ? costCenter[0].Cost_Cen_Name : "NA",
          Godown_ID: Number(this.objproject.Godown_ID),
          Inv_Type_ID: 84,	
          User_ID: this.$CompacctAPI.CompacctCookies.User_ID ,	
          DOC_TYPE: "ISSUE CHALLAN",
          PROJECT_ID: Number(this.createListObj.PROJECT_ID),
          Remarks : this.objproject.Remarks,
          Delivery_By: this.objproject.Delivery_By,
          bottom : this.bottomData()
        } 
      const obj = {
            "SP_String": "Sp_Issue_Challan",
            "Report_Name_String": 'Bl_Txn_Issue_Challan_Create',
            "Json_Param_String": JSON.stringify([tempDataSave])
          }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        console.log("Final save data ==",data);
        if (data[0].Column1==='Done'){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Succesfully Issue Challan Create " ,
            detail: "Succesfully "
          });
          this.Spinner = false;
          //this.GetBrowseData();
          this.tabIndexToView = 0;
          this.projectFromSubmit = false;
          this.objproject = new project();
          this.openTab = false
          //this.FromDatevalue = new Date()
          //this.ToDatevalue = new Date()
          this.ngxService.stop()
          
          }
          else {
            this.ngxService.stop()
            this.Spinner = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message ",
              detail:"Issue Challan Not Create "
            });
          }
         
         
    });
    }
   
  
  }
}
bottomData(){
  let tempbottomArr:any = []
  this.buttonListBackUp.forEach((el:any)=>{
    tempbottomArr.push({
      Product_ID:el.Product_ID,
      Product_Description:el.Product_Description,
      Issue_Qty:Number(el.Del_Qty),
      UOM:el.UOM,
      Sub_Ledger_ID:0,
      Batch_Number:el.Batch_No,
      Serial_No:null,
      Rate: el.Rate,
      Product_Expiry:el.Product_Expiry,		
      Expiry_Date:el.Expiry_Date,
      PROJECT_ID :el.PROJECT_ID,     
      SITE_ID  : el.SITE_ID,
      Budget_Group_ID :el.Budget_Group_ID,
      Budget_Sub_Group_ID :el.Budget_Sub_Group_ID,
      Work_Details_ID:el.Work_Details_ID
    })
  })
  return tempbottomArr
}
QTYCheck(col:any){
 // this.GetTotalIssue();
  this.showTost = true
  this.buttonList.forEach((ele:any) => {
    if( Number(ele.Del_Qty) >  Number(ele.Batch_Qty))
    {
      this.showTost = false
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          sticky: true,
          summary: "Warn Message ",
          detail:"Issue QTY Must be equal or less than Batch QTY "
        });
      return
    }
    if( Number(ele.Del_Qty) >  Number(ele.Ori_Req_Qty))
    {
      this.showTost = false
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          sticky: true,
          summary: "Warn Message ",
          detail:"Issue QTY Must be equal or less than Requisition QTY"
        });
      return
    }
    if( !(Number(ele.Del_Qty)))
    {
      this.showTost = false
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          sticky: true,
          summary: "Warn Message ",
          detail:"Issue QTY required"
        });
      return
    }
    });
  

   
}
onReject(){
  this.compacctToast.clear("c");
}
PrintBillBrowse(objj:any){
  //console.log("printData",objj)
  if(objj) {
    const objtemp = {
      "SP_String": "Sp_Issue_Challan",
      "Report_Name_String": "Bl_Txn_Issue_Challan_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Doc_No=" + objj.DOC_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
}
stringShort(str,wh) {
  let retuObj:any = {}
  if(str){
    if (str.length > 30) {
      retuObj = {
        field: str.substring(0, 30) + " ...",
        cssClass : "txt"
      }
    }
    else {
       retuObj = {
        field: str,
        cssClass : ""
      }
    }
  }
 
return wh == "css" ? retuObj.cssClass : retuObj.field
}
selectWork(event,text, overlaypanel) {
  //console.log("col",col)
  if (text.length > 30) {
    this.ObjCol = {}
    this.overlayPanelText= ""
   this.overlayPanelText = text
   overlaypanel.toggle(event); 
  }
 
  }
validatationBatchNo(BatchNo:any){
 this.validatationBatch_No = BatchNo ? false : true
 return !this.validatationBatch_No
}
editIssueChallan(col:any){
  if(col.DOC_No){
    this.clearData()
    this.DOCNo = col.DOC_No
    this.tabIndexToView = 2
    this.items = ["BROWSE", "PENDING REQUISITION","UPDATE"];
    this.buttonname = "Update";
    this.GetEditData(col.DOC_No)
  }
}
GetEditData(DOCNo){
  const obj = {
    "SP_String": "SP_BL_CRM_Issue_Challan",
    "Report_Name_String": "Get_Pending_Requisition",
    "Json_Param_String": JSON.stringify([{DOC_No : DOCNo}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      console.log("Data",data)
    })
}
Deletebutton(i:any){
  this.buttonList.splice(i,1);
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
