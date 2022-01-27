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
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Console } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-tender-budget',
  templateUrl: './tender-budget.component.html',
  styleUrls: ['./tender-budget.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TenderBudgetComponent implements OnInit {
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
  budGetsubList2 = [];
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private router : Router,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems :CompacctGetDistinctService,
    private ngxService: NgxUiLoaderService
    
  ) { }
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
    this.items = ["Pending Budget", "Created Budget", "Create Single Scheme"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Budget",
      Link: "Project Management -> Budget"
    });
    this.budGetreqList = [];
    this.budGetsubList = [];
    this.GetBudgetreq();
    this.GetBudgetSub();

    this.GetExcelGroupDetails();
    this.GetSingleScheCreatedList();
    this.GetSingleScheCreatedList2();
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  GetSingleScheCreatedList(){
    this.budGetsubList = [];
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
  GetSingleScheCreatedList2(){  
    this.budGetsubList2 = [];
    const tempObj = {
      Send_To : this.commonApi.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Budget_Sub_Tab_Multiple",
      "Json_Param_String": JSON.stringify(tempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // if(this.fromQuery) {
      //   this.budGetsubList = this.TenderDocID ? data.filter(i=> i.Tender_Doc_ID === this.TenderDocID) : data;
      // } else {
        this.budGetsubList2 = data;
    //  }
     console.log("SUB",data);
    })
  }

  CreateMulitple(obj) {
    this.ngxService.start();
    setTimeout(()=>{
      const RediRecObj = {
        'TenderIDView' : window.btoa(obj.Tender_ID),
        'TenderID' : window.btoa(obj.Tender_Doc_ID),
        'Tender_CreUserID' : window.btoa(obj.Tender_Create_User_ID),
        'Work_Name' : window.btoa(obj.Work_Name),
        'From' : 'CreatedBudget',
      }
      this.ngxService.stop();
      this.DynamicRedirectToR(RediRecObj,'./BL_CRM_Txn_Enq_Tender_Budget_Multiple')
    },500)

  }

  GotoMultipleListTab(obj) {
      this.CreateMultipleScheme(obj)
  }

  onConfirm(){}
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["Pending Budget", "Created Budget", "Create Single Scheme"];
    this.buttonname = "Create";
    this.clearData();
    this.GetSingleScheCreatedList();
    this.GetSingleScheCreatedList2();
  }
  clearData(){
    this.ShowSingleScheme = false;
    this.createBudgetmodel = false;
  }
  GetBudgetSchemeForAll(){
    const tempObj = {
      Send_To : this.commonApi.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Budget_Required_Budget_Scheme",
      "Json_Param_String": JSON.stringify(tempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.budGetreqList = data.map(t1 => ({...t1, ...this.budGetreqList.find(t2 => t2.Tender_Doc_ID === t1.Tender_Doc_ID)}))
   
     console.log("REQ",this.budGetreqList);
     this.ngxService.stop();
    })
  }
  GetBudgetreq(){
    this.ngxService.start();
    const tempObj = {
      Send_To : this.commonApi.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Budget_Required_Tab",
      "Json_Param_String": JSON.stringify(tempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.budGetreqList = data;
     this.GetBudgetSchemeForAll();
     console.log("REQ",this.budGetreqList);
    })
  }
  GetBudgetSub(){
    const tempObj = {
      Send_To : this.commonApi.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Budget_Sub_Tab",
      "Json_Param_String": JSON.stringify(tempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // this.budGetsubList = data;
     console.log("SUB",data);
    })
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
  
  // ESTIMATE -- Multiple Scheme
  CreateMultipleScheme(obj){
    this.tenderDocID = undefined;
    this.TenderDocID = undefined;
    this.ObjEstimate = {};
    this.editData = [];
    
    this.ShowAddedEstimateProductList = [];
     this.AddedEstimateProductList = [];
   if(obj.Tender_Doc_ID){
     this.ngxService.start();
    // this.ShowSingleScheme = true;
    // this.Spinner = false;
    // this.tenderDocID = obj.Tender_Doc_ID;
    // this.TenderDocID = obj.Tender_Doc_ID;
    // this.ObjEstimate.Budget_Short_Description = obj.Work_Name;
    // this.ObjEstimate.Tender_Create_User_ID = obj.Tender_Create_User_ID;
    // this.GetEditSingleScheme();
    setTimeout(()=>{
      const RediRecObj = {
        'TenderIDView' : window.btoa(obj.Tender_ID),
        'TenderID' : window.btoa(obj.Tender_Doc_ID),
        'Tender_CreUserID' : window.btoa(obj.Tender_Create_User_ID),
        'Work_Name' : window.btoa(obj.Work_Name),
      }
      this.ngxService.stop();
      this.DynamicRedirectToR(RediRecObj,'./BL_CRM_Txn_Enq_Tender_Budget_Multiple')
    },500)
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
   if(obj.Tender_Doc_ID){
     this.ngxService.start();
    // this.ShowSingleScheme = true;
    // this.Spinner = false;
    // this.tenderDocID = obj.Tender_Doc_ID;
    // this.TenderDocID = obj.Tender_Doc_ID;
    // this.ObjEstimate.Budget_Short_Description = obj.Work_Name;
    // this.ObjEstimate.Tender_Create_User_ID = obj.Tender_Create_User_ID;
    // this.GetEditSingleScheme();
    setTimeout(()=>{
      const RediRecObj = {
        'TenderIDView' : window.btoa(obj.Tender_ID),
        'TenderID' : window.btoa(obj.Tender_Doc_ID),
        'Tender_CreUserID' : window.btoa(obj.Tender_Create_User_ID),
        'Work_Name' : window.btoa(obj.Work_Name),
      }
      this.ngxService.stop();
      this.DynamicRedirectToR(RediRecObj,'./BL_CRM_Txn_Enq_Tender_Budget_Single')
    },500)
   }
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
  





  GetAssing(){
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_User"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.assingList = data;
     console.log("assing ",this.assingList);
    })
  }

  
  DynamicRedirectToR (obj,Redirect_To){
    const navigationExtras: NavigationExtras = {
      queryParams: obj,
    };
    this.router.navigate([Redirect_To], navigationExtras);
  }
  
}
