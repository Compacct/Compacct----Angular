import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGetDistinctService } from '../../../shared/compacct.services/compacct-get-distinct.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import * as moment from "moment";
declare var $:any;
import * as XLSX from 'xlsx';
import { FileUpload } from "primeng/primeng";
@Component({
  selector: 'app-tender-single-sch-budget',
  templateUrl: './tender-single-sch-budget.component.html',
  styleUrls: ['./tender-single-sch-budget.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TenderSingleSchBudgetComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  menuList = [];
  Spinner = false;
  buttonname = "Create";

  budGetreqList = [];
  budGetsubList = [];
  createBudgetmodel = false;
  tenderDocID = undefined;

  createBudgetFormSubmitted = false;

  createBudgetbox = undefined
  assingList = [];

  ShowSingleScheme = false;

  saveSpinner = false;
  ViewFlag = false;
  ObjEstimate: any = {};
  EstimateInfoSubmitted = false;
  EstimateGrpSubmitted = false;
  EstimateGrpName = undefined;
  EstimateGrpModal = false;
  EstimateGroupList = [];
  EstimateSubGroupList = [];
  EstimateSubGrpSubmitted = false;
  EstimateSubGrpName = undefined;
  EstimateSubGrpModal = false;

  workdetalisSubmitted = false;
  workdetalisName = undefined;
  workdetalisModal = false;

  rowGroupMetadata: any;
  rowGroupMetadata2: any;
  EstimateGroupProductList = [];
  AddedEstimateProductList = [];
  ShowAddedEstimateProductList = [];
  projectList:any = [];
  siteList = [];
  TenderDocID = undefined;
  EstimateModalFlag = false;
  workdetalisList = [];
  TenderProjectId = undefined;
  TenderSiteId = undefined;
  ProjectSubmitted = false;
  ProjectName = undefined;
  ProjectRemark = undefined;
  projectModal = false;
  Spinnerproject = false;
  siteSubmitted = false;
  siteCreate = undefined;
  siteModal = false;
  Spinnersite = false;
  editData = [];
  Final_Create_Flag = false;

  ViewEstimateGrpModal = false;
  EstGrpeid = undefined;
  ViewEstimateSubGrpModal = false;
  EstSubGrpeid = undefined;
  ViewWorkDetailsModal = false;
  WorkDetlsid = undefined;

  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;
  cols = [
    { field: 'SL_No', header: 'SL No.' },
    { field: 'Budget_Group_Name', header: 'Group Name' },
    { field: 'Budget_Sub_Group_Name', header: 'Sub Group Name' },
    { field: 'Work_Details', header: 'Work Details' },
    { field: 'Product_Description', header: 'Product' },
    { field: 'unit', header: 'Unit' },
    { field: 'Qty', header: 'Qty' },
    { field: 'Nos', header: 'Nos' },
    { field: 'TQty', header: 'Total Qty' },
    { field: 'UOM', header: 'UOM' },
    { field: 'saleRate', header: 'Sale Rate' },
    { field: 'Sale_Amount', header: 'Sale Amount' },
    { field: 'Rate', header: 'Purchase Rate' },
    { field: 'Amount', header: 'Purchase Amount' },
    { field: 'zzzz', header: 'Delete' }
];
ExcelGroupDetails =[];

PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink = undefined;
  ProductPDFFile:any = {};
  SingleSchemeFromFile = [];

  ViewTenderID = undefined;
  viewModel = false;
  fromQuery = false;
  TenderIDView = undefined;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems :CompacctGetDistinctService,
    private ngxService: NgxUiLoaderService,
    private router : Router,
    
  ) {
    this.route.queryParams.subscribe((val:any) => {
      if(val.TenderID) {
        this.fromQuery = true;
        const obj = {
          'Tender_ID' : window.atob(val['TenderIDView']),
          'Tender_Doc_ID' : window.atob(val['TenderID']),
          'Tender_Create_User_ID' : window.atob(val['Tender_CreUserID']),
          'Work_Name' : window.atob(val['Work_Name']),

        }
        this.CreateSingleScheme(obj);
      } else {        
        this.fromQuery = false;
      }
    } ); 


   }
  onSort() {
    this.updateRowGroupMetaData();
}

updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.ShowAddedEstimateProductList) {
        for (let i = 0; i < this.ShowAddedEstimateProductList.length; i++) {
            let rowData = this.ShowAddedEstimateProductList[i];
            let brand = rowData.Budget_Group_Name;
            if (i == 0) {
                this.rowGroupMetadata[brand] = { index: 0, size: 1 };
            }
            else {
                let previousRowData = this.ShowAddedEstimateProductList[i - 1];
                let previousRowGroup = previousRowData.Budget_Group_Name;
                if (brand === previousRowGroup)
                    this.rowGroupMetadata[brand].size++;
                else
                    this.rowGroupMetadata[brand] = { index: i, size: 1 };
            }
        }
    }
}
  
ngOnInit() {
  this.items = ["Created Budget", "Create Single Scheme"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Single Scheme Budget",
      Link: "Budget Management -> Single Scheme Budget"
    });

    this.GetSingleScheCreatedList()
    this.GetEstimateGroup();
    this.getworkDetails();
    this.GetProduct();
    this.GetExcelGroupDetails();
  }
  GetSingleScheCreatedList(){
    const tempObj = {
      Send_To : this.commonApi.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Budget_Sub_Tab",
      "Json_Param_String": JSON.stringify(tempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.budGetsubList = data;
     console.log("SUB",data);
    })
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["Created Budget", "Create Single Scheme"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){
    this.ShowSingleScheme = this.fromQuery ? true : false;
    this.createBudgetmodel = false;
  }

  GetExcelGroupDetails(){
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Group_Sub_Group_for_excel"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.ExcelGroupDetails = data;
    })
  }
  
  viewTender(col:any){
    this.ViewTenderID = undefined;
    if(col.Tender_Doc_ID){
      this.ngxService.start();
     this.ViewTenderID = col.Tender_Doc_ID; 
     setTimeout(()=>{
      this.viewModel = true;
      this.ngxService.stop();
    },1200)
    }
  }

  // ESTIMATE -- Single Scheme
  CreateSingleScheme(obj){
    this.tenderDocID = undefined;
    this.TenderDocID = undefined;
    this.ObjEstimate = {};
    this.editData = [];
    
    this.ShowAddedEstimateProductList = [];
     this.AddedEstimateProductList = [];
     this.TenderIDView = undefined;
   if(obj.Tender_Doc_ID){
     this.ngxService.start();
    this.ShowSingleScheme = true;
    this.Spinner = false;
    this.tenderDocID = obj.Tender_Doc_ID;
    this.TenderDocID = obj.Tender_Doc_ID;
    this.TenderIDView = obj.Tender_ID;
    this.ObjEstimate.Budget_Short_Description = obj.Work_Name;
    this.ObjEstimate.Tender_Create_User_ID = obj.Tender_Create_User_ID;
    this.GetEditSingleScheme();
    setTimeout(()=>{
      this.tabIndexToView = 0;
      this.ngxService.stop();
    },500)
   }
  }
  GetEditSingleScheme(){
    this.editData = [];
    if(this.tenderDocID) {
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get Data Tender Estimate",
        "Json_Param_String": JSON.stringify([{ 'Tender_Doc_ID': this.tenderDocID }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          if(data.length) {
            this.editData = data;
            this.ShowAddedEstimateProductList = data;
            this.AddedEstimateProductList = this.ShowAddedEstimateProductList;
            this.ObjEstimate.Budget_Short_Description = data[0].Budget_Short_Description;
            this.ObjEstimate.No_of_Site = data[0].No_of_Site;
            console.log(data)
          }
        });
    }
  }


  ToggleEstimateGrp() {
    this.EstimateGrpSubmitted = false;
    this.EstimateGrpName = undefined;
    this.EstimateGrpModal = true;
    this.Spinner = false;
    
  }
  GetEstimateGroup() {
    const obj = {
      "SP_String": "SP_Tender_Management_All",
      "Report_Name_String": "Get_Budget_Group_Name",
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
        console.log(data)
        data.forEach(el => {
          el['label'] = el.Budget_Group_Name;
          el['value'] = el.Budget_Group_ID;
        });
        this.EstimateGroupList = data;
        this.GetExcelGroupDetails();
      });
  }
  // View Estimate Group
  ViewEstimateGrp(){
    this.EstimateGroupList = [];
    this.GetEstimateGroup();
    setTimeout(() => {
      this.ViewEstimateGrpModal = true;
    }, 300);
  }
  deleteEstimateGrp(EstimateGrpeid){
    this.EstGrpeid = undefined;
    this.EstSubGrpeid = undefined;
    this.WorkDetlsid = undefined;
    if(EstimateGrpeid.Budget_Group_ID){
      this.EstGrpeid = EstimateGrpeid.Budget_Group_ID;
     // this.cnfrm2_popup = true;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
  }

  GetProject() {
    if(this.TenderDocID){
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get Project",
        "Json_Param_String": JSON.stringify([{ 'Tender_Doc_ID': this.TenderDocID }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log("project", data)
          this.ObjEstimate.project_ID = data[0].Project_ID ? Number(data[0].Project_ID) : undefined;
          data.forEach(el => {
            el['label'] = el.Project_Description;
            el['value'] = el.Project_ID;
          });
  
          this.projectList = data;
          console.log("ProjectList",this.projectList);
          console.log("Project_ID",this.projectList.Project_ID);
          console.log("Project_ID[0]",this.projectList[0].Project_ID);
         
         console.log("this.ObjEstimate.project_ID",this.ObjEstimate.project_ID);
         if(this.ObjEstimate.project_ID){
          this.getSiteList(this.ObjEstimate.project_ID);
         }
        
        });
    }
    
  }
  getSiteList(id,selectId?) {
    this.siteList = [];
    if (id) {
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get Site",
        "Json_Param_String": JSON.stringify([{ 'Project_ID': id }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log("site", data)
          this.ObjEstimate.site_ID  = data[0].Site_ID ? Number(data[0].Site_ID) : undefined;
          data.forEach(el => {
            el['label'] = el.Site_Description;
            el['value'] = el.Site_ID;
          });
          this.siteList = data;
          console.log("this.ObjEstimate.site_ID ",this.ObjEstimate.site_ID );
          this.GetEditdata();
        });
    }
  }
  EstimateGroupChange(id) {
    this.EstimateSubGroupList = [];
    this.ObjEstimate.Budget_Group_Name = undefined;
    this.ObjEstimate.Budget_Sub_Group_ID = undefined;
    this.ObjEstimate.Budget_Sub_Group_Name = undefined;
    if (id) {
      this.ObjEstimate.Budget_Group_Name = this.EstimateGroupList.filter(ob => ob.Budget_Group_ID.toString() === id.toString())[0].Budget_Group_Name;
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get_Budget_Sub_Group_Name",
        "Json_Param_String": JSON.stringify([{ 'Budget_Group_ID': id }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log(data)
          data.forEach(el => {
            el['label'] = el.Budget_Sub_Group_Name;
            el['value'] = el.Budget_Sub_Group_ID;
          });
          this.EstimateSubGroupList = data;
        });
    }

  }
  // View Estimate Sub Group
  ViewEstimateSubGrp(){
    this.EstimateSubGroupList = [];
    this.EstimateGroupChange(this.ObjEstimate.Budget_Group_ID);
    setTimeout(() => {
      this.ViewEstimateSubGrpModal = true;
    }, 300);
  }
  deleteEstimateSubGrp(EstimateSubGrpeid){
    this.EstGrpeid = undefined;
    this.EstSubGrpeid = undefined;
    this.WorkDetlsid = undefined;
    if(EstimateSubGrpeid.Budget_Sub_Group_ID){
      this.EstSubGrpeid = EstimateSubGrpeid.Budget_Sub_Group_ID;
     // this.cnfrm2_popup = true;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
  }
  CreateEstimateGrp(valid) {
    this.EstimateGrpSubmitted = true;
    if (valid) {
      this.Spinner = true;
      const temp = {
        Budget_Group_Name: this.EstimateGrpName
      }
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Budget_Group_Create",
        "Json_Param_String": JSON.stringify([temp])
      }
      this.GlobalAPI
        .postData(obj)
        .subscribe((data: any) => {
          console.log(data)
          if (data[0].Column1) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Budget Group Created"
            });
            this.GetEstimateGroup();
            this.EstimateGrpSubmitted = false;
            this.EstimateGrpName = undefined;
            this.EstimateGrpModal = false;
            this.EstimateSubGroupList = [];
            this.Spinner = false;
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        });
    }
  }
  getworkDetails() {
    const obj = {
      "SP_String": "SP_Tender_Management_All",
      "Report_Name_String": "Get Work Details",
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
        console.log("work Details", data)
        data.forEach(el => {
          el['label'] = el.Work_Details;
          el['value'] = el.Work_Details_ID;
        });

        this.workdetalisList = data;
      });
  }
  // View Work Details
  ViewWorkDetails(){
    this.workdetalisList = [];
    this.getworkDetails();
    setTimeout(() => {
      this.ViewWorkDetailsModal = true;
    }, 300);
  }
  deleteWorkDetails(WorkDetailseid){
    this.EstGrpeid = undefined;
    this.EstSubGrpeid = undefined;
    this.WorkDetlsid = undefined;
    if(WorkDetailseid.Work_Details_ID){
      this.WorkDetlsid = WorkDetailseid.Work_Details_ID;
     // this.cnfrm2_popup = true;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
  }
  ToggleEstimateSubGrp() {
    this.EstimateSubGrpSubmitted = false;
    this.EstimateSubGrpName = undefined;
    this.EstimateSubGrpModal = true;
    this.Spinner = false;
    if (this.ObjEstimate.Budget_Group_ID) {
      this.EstimateSubGrpModal = true;
    }
  }
  ToggleProject() {
    this.ProjectSubmitted = false;
    this.ProjectName = undefined;
    this.ProjectRemark = undefined;
    this.projectModal = true;
    this.Spinnerproject = false;
  }
  ToggleSite(){
    this.siteSubmitted = false;
    this.siteCreate = undefined;
    this.siteModal = true;
    this.Spinnersite = false;
  }
  Toggleworkdetalis() {
    this.workdetalisSubmitted = false;
    this.workdetalisName = undefined;
    this.workdetalisModal = true;
    this.Spinner = false;
    if (this.ObjEstimate.Budget_Group_ID) {
      this.workdetalisModal = true;
    }
  }
  EstimateSubGroupChange(id) {
    this.ObjEstimate.Budget_Sub_Group_Name = undefined;
    if (id) {
      this.ObjEstimate.Budget_Sub_Group_Name = this.EstimateSubGroupList.filter(ob => ob.Budget_Sub_Group_ID.toString() === id.toString())[0].Budget_Sub_Group_Name;

    }
  }
  EstimateworkDetailsChange(id) {
    this.ObjEstimate.Work_Details = undefined;
    if (id) {
      this.ObjEstimate.Work_Details = this.workdetalisList.filter(ob => ob.Work_Details_ID.toString() === id.toString())[0].Work_Details;

    }
  }
  CreateEstimateSubGrp(valid) {
    this.EstimateSubGrpSubmitted = true;
    if (valid) {
      this.Spinner = true;
      const temp = {
        Budget_Group_ID: this.ObjEstimate.Budget_Group_ID,
        Budget_Sub_Group_Name: this.EstimateSubGrpName
      }
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Budget_Sub_Group_Create",
        "Json_Param_String": JSON.stringify([temp])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log(data)
          if (data[0].Column1) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Budget Group Created"
            });
            this.EstimateGroupChange(this.ObjEstimate.Budget_Group_ID);
            this.EstimateSubGrpSubmitted = false;
            this.EstimateSubGrpName = undefined;
            this.EstimateSubGrpModal = false;
            this.Spinner = false;
            this.GetExcelGroupDetails();
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        });
    }
  }
  CreateProject(valid) {
    this.ProjectSubmitted = true;
    if (valid) {
      this.Spinnerproject = true;
      const temp = {
        Project_Description: this.ProjectName,
        Project_Remarks: this.ProjectRemark,
        Tender_Doc_ID : this.TenderDocID
      }
      console.log("Project Save Data",temp);
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Add Project",
        "Json_Param_String": JSON.stringify([temp])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log(data)
          if (data[0].Project_ID) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Project Created"
            });
            this.GetProject();
            this.ProjectSubmitted = false;
            this.ProjectName = undefined;
            this.ProjectRemark = undefined;
            this.projectModal = false;
            this.Spinnerproject = false;
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
            this.Spinnerproject = false;
          }
        });
    }
  }
  CreateSite(valid) {
    this.siteSubmitted = true;
    if (valid) {
      this.Spinnersite = true;
      const temp = {
        Project_ID: this.ObjEstimate.project_ID,
        Site_Description: this.siteCreate
      }
      console.log("Site Save Data",temp);
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Add Site",
        "Json_Param_String": JSON.stringify([temp])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log(data)
          if (data[0].Site_ID ) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Site Created"
            });
            this.getSiteList(this.ObjEstimate.project_ID);
            this.siteSubmitted = false;
            this.siteCreate = undefined;
            this.siteModal = false;
            this.Spinnersite = false;
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
            this.Spinnersite = false;
          }
        });
    }
  }
  CreateEstimateworkdetails(valid) {
    this.workdetalisSubmitted = true;
    if (valid) {
      this.Spinner = true;
      const temp = {
        Work_Details: this.workdetalisName
      }
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Save_BL_CRM_Txn_Enq_Work_Detail",
        "Json_Param_String": JSON.stringify([temp])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log(data)
          if (data[0].Column1) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully work Details Created"
            });
            //this.EstimateGroupChange(this.ObjEstimate.Budget_Group_ID);
            this.getworkDetails();
            this.workdetalisSubmitted = false;
            this.workdetalisName = undefined;
            this.workdetalisModal = false;
            this.Spinner = false;
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        });
    }
  }
  Cleardata3() {
    this.ObjEstimate.Product_ID = undefined;
    this.ObjEstimate.Product_Description = undefined;
    this.ObjEstimate.UOM = undefined;
  }
  GetProduct() {
    const obj = {
      "SP_String": "SP_Tender_Management_All",
      "Report_Name_String": "Get_Product_Name",
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
        console.log(data)
        data.forEach(el => {
          el['label'] = el.Product_Description;
          el['value'] = el.Product_ID;
        });
        this.EstimateGroupProductList = data;
      });
  }
  EstimateGroupProductChange(id) {
    this.ObjEstimate.Product_Description = undefined;
    this.ObjEstimate.UOM = undefined;
    if (id) {
      const arr = this.EstimateGroupProductList.filter(ob => ob.Product_ID.toString() === id.toString());
      this.ObjEstimate.Product_Description = arr[0].Product_Description;
      this.ObjEstimate.UOM = arr[0].UOM;
    }
  }
  validate2 (e) {
    let input = e.target.value;
    const reg = /^\d*(\.\d{0,1})?$/;
  
    if (!reg.test(input)) {
      e.preventDefault();
    }
  }
  validate3 (e) {
    let input = e.target.value;
    const reg = /^\d*(\.\d{0,2})?$/;
  
    if (!reg.test(input)) {
      e.preventDefault();
    }
  }
  CalculateEstimateAmount() {
    this.ObjEstimate.Amount = undefined;
    if (this.ObjEstimate.TQty && this.ObjEstimate.Rate) {
      this.ObjEstimate.Rate = Number(this.ObjEstimate.Rate).toFixed(2);
      this.ObjEstimate.Amount = (Number(this.ObjEstimate.Rate) * Number(this.ObjEstimate.TQty)).toFixed(2);

    }
  }
  CalculateEstimatesaleAmount() {
    this.ObjEstimate.Sale_Amount = undefined;
    if (this.ObjEstimate.TQty && this.ObjEstimate.saleRate) {
      this.ObjEstimate.saleRate = Number(this.ObjEstimate.saleRate).toFixed(2);
      this.ObjEstimate.Sale_Amount = (Number(this.ObjEstimate.saleRate) * Number(this.ObjEstimate.TQty)).toFixed(2);

    }
  }
  CalculateEstimateQty() {
    this.ObjEstimate.TQty = undefined;
    if (this.ObjEstimate.Qty && this.ObjEstimate.Nos) {
      this.ObjEstimate.Qty = Number(this.ObjEstimate.Qty).toFixed(3);
      this.ObjEstimate.TQty = (Number(this.ObjEstimate.Nos) * Number(this.ObjEstimate.Qty)).toFixed(3);
      this.CalculateEstimateAmount();
      this.CalculateEstimatesaleAmount();
    }
  }
  getPurchaseAmt(){
    return this.ShowAddedEstimateProductList.reduce((n, {Amount}) => n + Number(Amount), 0).toFixed(2)
  }
  getSaleAmt() {
    return this.ShowAddedEstimateProductList.reduce((n, {
      Sale_Amount
    }) => n + Number(Sale_Amount), 0)
  }
  getTotalPurchaseAmt(){
    return (Number(this.ObjEstimate.No_of_Site) * this.getPurchaseAmt()).toFixed(2);
  }
  AddEstimate(valid) {
    this.EstimateInfoSubmitted = true;
    if (valid) {
      const extimateObj = { ...this.ObjEstimate , ...{ uid : '_' + Math.random().toString(36).substr(2, 9)}};
      extimateObj.items = [];
      //this.ObjEstimate = {};
      this.ObjEstimate.Product_ID = undefined;
      this.ObjEstimate.Qty = undefined;
      this.ObjEstimate.UOM = undefined;
      this.ObjEstimate.Rate = undefined;
      this.ObjEstimate.Amount = undefined;
      this.ObjEstimate.Product_Req = undefined;
      this.ObjEstimate.Product_Req = undefined;
      this.ObjEstimate.Sale_Amount = undefined;
      this.ObjEstimate.saleRate = undefined;
      this.ObjEstimate.TQty = undefined;
      this.ObjEstimate.Nos = undefined;
      this.ObjEstimate.unit = undefined;
      this.AddedEstimateProductList.push(extimateObj);
      // this.AddedEstimateProductList.sort(function (a, b) {
      //   return parseFloat(a.Budget_Group_ID) - parseFloat(b.Budget_Group_ID);
      // });
      this.EstimateInfoSubmitted = false;
      this.ShowAddedEstimateProductList = this.AddedEstimateProductList;
      let dupSub = [];
      let parentCount = 0;
      for(var i = 0; i < this.ShowAddedEstimateProductList.length; i++) {
        this.ShowAddedEstimateProductList[i]['SL_No'] = i + 1;
      }
      this.updateRowGroupMetaData();
    }

  }
  DeleteEstimate(k) {
    this.AddedEstimateProductList.splice(k,1);
    this.ShowAddedEstimateProductList = this.AddedEstimateProductList;
    for(var i = 0; i < this.ShowAddedEstimateProductList.length; i++) {
      this.ShowAddedEstimateProductList[i]['SL_No'] = i + 1;
    }
    this.updateRowGroupMetaData();
  }
  RowReOrder(e) {
    for(var i = 0; i < this.ShowAddedEstimateProductList.length; i++) {
      this.ShowAddedEstimateProductList[i]['SL_No'] = i + 1;
    }
  }
  getNestedChildren(arr) {
    var out = []
    var WholeArr = [];
    for (var i = 0; i < arr.length; i++) {
      var count = 0;
      var out2 = []
      if (out.indexOf(arr[i]['Budget_Group_ID']) === -1) {
        out.push(arr[i]['Budget_Group_ID']);
        const ParentDub = arr.filter(obj => obj.Budget_Group_ID == arr[i].Budget_Group_ID);
        let childParent = [];
        if (ParentDub.length) {
          for (var k = 0; k < ParentDub.length; k++) {
            var count = 0;
            if (out2.indexOf(ParentDub[k]['Budget_Sub_Group_ID']) === -1) {
              out2.push(ParentDub[k]['Budget_Sub_Group_ID']);
              const childDub = ParentDub.filter(obj => obj.Budget_Group_ID == arr[i].Budget_Group_ID && obj.Budget_Sub_Group_ID == ParentDub[k].Budget_Sub_Group_ID);
              childParent.push({
                'Sl_No': (out.length).toString() + '.' + (out2.length).toString(),
                'Child_Parent_ID': ParentDub[k]['Budget_Sub_Group_ID'],
                'Child_Parent_Name': ParentDub[k]['Budget_Sub_Group_Name'],
                'Total_Sub_Group_Amt': this.TotalByProperty(childDub, 'Amount'),
                'items': childDub
              })
            }
          }
        } else {
          const childDub = ParentDub.filter(obj => obj.Budget_Group_ID == arr[i].Budget_Group_ID && obj.Budget_Sub_Group_ID == arr[i].Budget_Sub_Group_ID);
          childParent.push({
            'Sl_No': (out.length).toString() + '.1',
            'Child_Parent_ID': arr[i]['Budget_Sub_Group_ID'],
            'Child_Parent_Name': arr[i]['Budget_Sub_Group_Name'],
            'Total_Sub_Group_Amt': this.TotalByProperty(childDub, 'Amount'),
            'items': childDub
          })
        }

        const RootObj = {
          'Sl_No': (out.length).toString(),
          'Root_Parent_ID': arr[i]['Budget_Group_ID'],
          'Root_Parent_Name': arr[i]['Budget_Group_Name'],
          'No_of_Child': ParentDub.length,
          'Total_Group_Amt': this.TotalByProperty(ParentDub, 'Amount'),
          'Total_Amt': this.TotalByProperty(arr, 'Amount'),
          'items': childParent
        }
        WholeArr.push(RootObj);
      } else {

      }
    }
    return WholeArr
  }
  TotalByProperty(items, prop) {
    return items.reduce(function (a, b) {
      return Number(a) + Number(b[prop]);
    }, 0);
  };
  SaveEsitimate() {
    if (this.ShowAddedEstimateProductList.length) {
      this.saveSpinner = true;
      // this.ObjEstimate.Appo_Date = this.DateService.dateConvert(new Date(this.ResceduleAppoDate));
      const tempArr = this.FetchEstimateObj();
      console.log("saveData", tempArr);

      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Tender_Estimation_Create",
        "Json_Param_String": JSON.stringify(tempArr)
      }
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      this.GlobalAPI
        .postData(obj)
        .subscribe((data: any) => {
          console.log(data);
          if (data[0].Column1) {
            this.SavefollowUp();
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "error",
              detail: data[0].Remarks
            });
            this.saveSpinner = false;
          }
        })
    }
    if (!this.ShowAddedEstimateProductList.length) {
      this.EstimateInfoSubmitted = true;
    }
  }
  SavefollowUp(){
    if(this.TenderDocID){
      const saveObj = {
        Tender_Doc_ID: this.TenderDocID,									
				Posted_By: this.commonApi.CompacctCookies.User_ID,							 
				Send_To:	this.ObjEstimate.Tender_Create_User_ID,						       			
				Status:	"BUDGET CREATED",
				Remarks: "BUDGET CREATED (SINGLE SCHEME)"
      }
      console.log("follow save",saveObj);
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String": "BL_CRM_Txn_Enq_Tender_Harbauer_Followup_Save",
        "Json_Param_String": JSON.stringify(saveObj)
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("follow up save",data);
        if(data[0].Column1 === "SAVED SUCCESSFULLY"){         
            this.EstimateInfoSubmitted = false;
            this.GetSingleScheCreatedList()
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'Estimate Management ',
              detail: "Succesfully Save."
            });
           // this.ObjEstimate = {};
           // this.TenderDocID = undefined;
            this.EstimateModalFlag = false;
            this.ShowAddedEstimateProductList = [];
            this.saveSpinner = false;
            setTimeout(()=>{
              this.tabIndexToView = 0;
              this.ShowSingleScheme = this.fromQuery ? true : false;
            },500)
        }
      
      })
    }
    else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error Occured ",
        detail: "Select Assing "
      });
    }
  }
  FetchEstimateObj() {
    console.log("ObjEstimate.site_ID", this.ObjEstimate.site_ID);
    let tempArr = [];
    for (var i = 0; i < this.ShowAddedEstimateProductList.length; i++) {
      const temp = this.ShowAddedEstimateProductList[i];
      const tempObj = {
        Sl_No: temp.SL_No,
        Budget_Short_Description : temp.Budget_Short_Description,
        No_of_Site : temp.No_of_Site,
        Budget_Group_ID: temp.Budget_Group_ID,
        Budget_Sub_Group_ID: temp.Budget_Sub_Group_ID,
        Product_ID: temp.Product_ID,
        Product_Description: temp.Product_Description,
        Total_Qty: temp.TQty,
        UOM: temp.UOM,
        Rate: temp.Rate,
        Amount: temp.Amount,
        Tender_Doc_ID: this.TenderDocID,
        Project_ID: temp.project_ID,
        Site_ID: temp.site_ID,
        Work_Details_ID: temp.Work_Details_ID,
        Unit_Description: temp.unit,
        Qty: temp.Qty,
        NOs: temp.Nos,
        Sale_Rate: temp.saleRate,
        Sale_Amount: temp.Sale_Amount,
        Final_Create: this.Final_Create_Flag ? 'Y':'N'
      }
      tempArr.push(tempObj);
    }
    return tempArr;
  }
  testchange(id) {
    console.log(id);
    this.GetEditdata();
  }
 // CSV
 // EXPORT TO EXCEL
 exportexcel(Arr,fileName): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, fileName+'.xlsx');
}
exportexcelDummy(): void {
  let tempArr = [];
  const tempObj = {
    SL_No: null,
    Budget_Short_Description : null,
    No_of_Site : null,
    Budget_Group_ID: null,
    Budget_Sub_Group_ID: null,
    Product_ID: null,
    Product_Description: null,
    TQty: null,
    UOM: null,
    Rate: null,
    Amount: null,
    Tender_Doc_ID: this.TenderDocID,
    project_ID: null,
    site_ID:null,
    Work_Details_ID: null,
    unit: null,
    Qty: null,
    Nos: null,
    saleRate: null,
    Sale_Amount: null,
  }
  tempArr.push(tempObj);
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tempArr);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, 'DummyBudget.xlsx');
}
 handleFileSelect(event) {
  this.PDFFlag = false;
  this.ProductPDFFile = {};
  this.SingleSchemeFromFile = [];
  if (event) {
    console.log(event)
    this.ngxService.start();
    this.ProductPDFFile = event.files[0];
    this.PDFFlag = true;
    var reader : any = new FileReader();
    console.log(reader)
    const ctrl = this;
    reader.onload = function(e){
      console.log(e)
        var fileData = reader.result;
        var wb = XLSX.read(fileData, {type : 'binary' , cellDates: true, dateNF: 'mm/dd/yyyy;@'});

        wb.SheetNames.forEach(function(sheetName){
          ctrl.SingleSchemeFromFile =XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
          
          ctrl.editData = [];
    
          ctrl.ShowAddedEstimateProductList = [];
          ctrl.AddedEstimateProductList = [];
          if(ctrl.ShowAddedEstimateProductList.length) {      
            ctrl.editData = ctrl.ShowAddedEstimateProductList;      
          ctrl.AddedEstimateProductList = ctrl.ShowAddedEstimateProductList;
          ctrl.ObjEstimate.Budget_Short_Description = ctrl.ShowAddedEstimateProductList[0].Budget_Short_Description;
          ctrl.ObjEstimate.No_of_Site = ctrl.ShowAddedEstimateProductList[0].No_of_Site;
          console.log(ctrl.SingleSchemeFromFile);
          }
          this.ngxService.stop();

        })
    };
    reader.readAsBinaryString(event.files[0]);
}
}



  DynamicRedirectTo (){
    // const navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     from : 'tenderESTIMATE'
    //   },
    // };
    // this.router.navigate(['./Project_Estimate'], navigationExtras);
    window.open("/Project_Estimate?from=tenderESTIMATE","_blank")
  }

  cleardata(){
      this.ObjEstimate.Product_ID = undefined;
      this.ObjEstimate.Qty = undefined;
      this.ObjEstimate.UOM = undefined;
      this.ObjEstimate.Rate = undefined;
      this.ObjEstimate.Amount = undefined;
      this.ObjEstimate.Product_Req = undefined;
      this.ObjEstimate.Product_Req = undefined;
      this.ObjEstimate.Sale_Amount = undefined;
      this.ObjEstimate.saleRate = undefined;
      this.ObjEstimate.TQty = undefined;
      this.ObjEstimate.Nos = undefined;
      this.ObjEstimate.unit = undefined;
      this.ObjEstimate.Budget_Group_ID = undefined;
      this.ObjEstimate.Budget_Sub_Group_ID = undefined;
      this.ObjEstimate.Work_Details_ID = undefined;
  }
  GetEditdata(){
    this.editData = [];
    if(this.ObjEstimate.project_ID && this.ObjEstimate.site_ID){
      console.log("ObjEstimate.site_ID ",this.ObjEstimate.site_ID );
      const tempArr = {
        Project_ID : this.ObjEstimate.project_ID,
        Tender_Doc_ID	: this.TenderDocID,
        Site_ID : this.ObjEstimate.site_ID
      }
      const obj = {
        "SP_String":"SP_Tender_Management_All",
        "Report_Name_String": "Get Data Tender Estimate",
        "Json_Param_String" : JSON.stringify(tempArr)
      }
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      this.GlobalAPI
          .postData(obj)
          .subscribe((data: any) => {
            console.log("Edit Data",data);
            this.editData = data ;
            this.ShowAddedEstimateProductList = data;
            this.AddedEstimateProductList = this.ShowAddedEstimateProductList;
            console.log(this.getPurchaseAmt())
          
          })
    }
  }

  DynamicRedirectToR (obj,Redirect_To){
    const navigationExtras: NavigationExtras = {
      queryParams: obj,
    };
    this.router.navigate([Redirect_To], navigationExtras);
  }

  //Common Delete for view Popup
  onConfirm() {
    let ReportName = '';
    let ObjTemp;
    let FunctionRefresh;
    if (this.EstGrpeid) {
      ReportName = "Delete_Budget_Group"
      ObjTemp = {
        Budget_Group_ID: this.EstGrpeid
      }
      FunctionRefresh = 'GetEstimateGroup';
    }
    if (this.EstSubGrpeid) {
      ReportName = "Delete_Budget_Sub_Group"
      ObjTemp = {
        Budget_Sub_Group_ID: this.EstSubGrpeid
      }
      FunctionRefresh = 'EstimateGroupChange';
    }
    if (this.WorkDetlsid) {
      ReportName = "Delete_Work_Details"
      ObjTemp = {
        Work_Details_ID: this.WorkDetlsid
      }
      FunctionRefresh = 'getworkDetails';
    }
      const obj = {
        "SP_String": "SP_Tender_Management_All_Delete_Dropdown",
        "Report_Name_String" : ReportName,
        "Json_Param_String": JSON.stringify(ObjTemp),
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        var msg = data[0].Column1;
        if (data[0].Column1) {
        // this.onReject();
        //this.GetTenderOrgList();
          // this[FunctionRefresh]();
          if (this.EstSubGrpeid) {
            this[FunctionRefresh](this.ObjEstimate.Budget_Group_ID);
          } else {
          this[FunctionRefresh]();
          }
         this.compacctToast.clear();
         this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: msg
          });
            //this.SearchTender(true);
        }
      });
    //}
  }
  onReject() {
    this.compacctToast.clear("c");
  }

}
