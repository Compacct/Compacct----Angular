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
import { Console } from 'console';
import { CompacctProductDetailsComponent } from '../../../shared/compacct.components/compacct.forms/compacct-product-details/compacct-product-details.component';
import { CompacctgstandcustomdutyComponent } from '../../../shared/compacct.components/compacct.forms/compacctgstandcustomduty/compacctgstandcustomduty.component';
import { CompacctFinancialDetailsComponent } from '../../../shared/compacct.components/compacct.forms/compacct.financial-details/compacct.financial-details.component';


@Component({
  selector: 'app-harbauer-master-product-mechanical',
  templateUrl: './harbauer-master-product-mechanical.component.html',
  styleUrls: ['./harbauer-master-product-mechanical.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HarbauerMasterProductMechanicalComponent implements OnInit {
  tabIndexToView = 0;
  // tabIndexToView2 = 0;
  // items2 =['General Information','EMD / Tender Fee','Document','Task'];
  items = ["BROWSE","CREATE"];
  url = window["config"];
  //persons: [];
  buttonname = "Create";
  Spinner = false;
  MasterProductmFormSubmitted = false;
  ObjMasterProductm = new MasterProductm();
  ObjFinancialComponentData = new Financial();
  ProductTypeList = [];
  ProductSubTypeList = [];
  ProductCategoryList = [];
  MocList = [];
  CapacitySizeList = [];
  ProductFeatureList = [];
  GradeList = [];
  MakeList = [];
  uploadedFiles: any[] = [];

  ProTypeModal = false;
  ProductTypeFormSubmitted = false;
  ProductTypeName = undefined;
  ProSubTypeModal = false;
  ProductSubTypeFormSubmitted = false;
  ProductSubTypeName = undefined;
  CreateMocModal = false;
  CreateMocFormSubmitted = false;
  MaterialofCons = undefined;
  CapacityModal = false;
  CapacityFormSubmitted = false;
  CapacityName = undefined;
  ProFeatureModal = false;
  ProFeatureFormSubmitted = false;
  ProFeature = undefined;
  GradeModal = false;
  GradeFormSubmitted = false;
  GradeName = undefined;
  MakeMulModal = false;
  MakeMulFormSubmitted = false;
  MakeMulName = undefined;

  ViewProTypeModal = false;
  ViewProSubTModal = false;
  ViewMocModal = false;
  ViewCapacityModal = false;
  ViewProFeatureModal = false;
  ViewGradeModal = false;
  ViewMakeMulModal = false;

  protypeid = undefined;
  protypesubid = undefined;
  mocid = undefined;
  capacityid = undefined;
  Profeatureid = undefined;
  gradeid = undefined;

  BrowseList = [];
  editList = [];
  productid: any;

  PDFViewFlag = false;
  PDFFlag = false;
  ProductPDFFile:any = {};
  ProductPDFLink = undefined;
  tempDocumentArr = [];
  Product_Mfg_Comp_ID:any;

  protyid = undefined;
  pstypeid = undefined;
  pcatid = undefined;
  prodes = undefined;
  matocid = undefined;
  sizeid = undefined;
  pfetureid = undefined;
  grdid = undefined;
  makemulid = undefined;
  rmrk = undefined;
  hcode = undefined;
  per = undefined;
  uom = undefined;
  MakeEdit = undefined;
  makedisabled = false;
  is_Active = false;
  Is_View = false;
  Browseproid = undefined;
  isvisible = undefined;
  headerData = ""
  UOMData=[]; 
  UomDataList = [];
  LAbelName = 'HSN Code';
  ObjproductDetails : any;
  ObjGstandCustonDuty : any;
  ObjFinancial: any;
  ViewUomModal = false;
  UOMTypeFormSubmitted = false;
  UOMTypeName = undefined;
  UOMTypeModal = false;
  AllUOMData = [];
  AllUomDataList = [];
  mettypeid = undefined;
  Uomid = undefined;
  objCheckFinamcial:any = {};
  objGst:any = {};
  objProductrequ:any = {};
  @ViewChild("Product", { static: false })
  ProductDetailsInput: CompacctProductDetailsComponent;
  @ViewChild("GstAndCustomDuty", { static: false })
  GstAndCustDutyInput: CompacctgstandcustomdutyComponent;
  @ViewChild("FinacialDetails", { static: false })
  FinacialDetailsInput: CompacctFinancialDetailsComponent;
  // ObjSearch = new Search();
  @ViewChild("location", { static: false }) locationInput: ElementRef;

  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;

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
    this.route.queryParams.subscribe(params => {
      console.log(params);
     this.headerData = params['header'];
      console.log ("headerData",this.headerData);
     })
   }

  ngOnInit() {
    this.Header.pushHeader({
      Header: this.headerData,
      Link: " Tender Management -> Master -> "+this.headerData
    });
    
     this.GetProductType();
     //this.GetProductSubType();
     this.GetProductCategory();
     this.GetMOC();
     this.GetCapacity();
     this.GetProductFeature();
     this.GetGrade();
     this.GetMake();
     this.GetBrowseList();
     this.getUOM()
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE","CREATE"];
    this.buttonname = "Create";
    this.clearData();
    this.productid = undefined;
  }
  clearData() {
     this.Spinner = false;
    // this.TenderSearchForm = false;
     this.ObjMasterProductm = new MasterProductm();
     this.MasterProductmFormSubmitted = false;
     this.Product_Mfg_Comp_ID = undefined;
     this.MakeEdit = undefined
     this.makedisabled = false;
     this.destroyChild();
     this.GetBrowseList();
     this.PDFViewFlag = false;
     if (this.PDFViewFlag === false) {
      this.fileInput.clear();
    }
  
  }
  destroyChild() {
    if (this.ProductDetailsInput) {
      this.ProductDetailsInput.clear();
    }
    if (this.GstAndCustDutyInput) {
      this.GstAndCustDutyInput.clear();
    }
    if (this.FinacialDetailsInput) {
      this.FinacialDetailsInput.clear();
    }
  }
  getProDetailsData(e) {
    console.log(e)
   // this.ObjMasterProductm = e
    if (e.Product_Type_ID) {
      this.ObjproductDetails = e;
      this.ObjMasterProductm.Product_Type_ID = e.Product_Type_ID;
      this.ObjMasterProductm.Product_Sub_Type_ID = e.Product_Sub_Type_ID;
      this.ObjMasterProductm.Product_Code = e.Product_Code;
      this.ObjMasterProductm.Product_Description = e.Product_Description;
      this.ObjMasterProductm.Rack_NO = e.Rack_NO;
      this.objProductrequ.Product_Type_ID = e.Product_Type_ID;
      this.objProductrequ.Product_Sub_Type_ID = e.Product_Sub_Type_ID;
      this.objProductrequ.Product_Description = e.Product_Description;
    }
  }
  getGstAndCustDutyData(e) {
    console.log(e)
 
    if (e.Cat_ID) {
      this.ObjGstandCustonDuty = e;
      this.ObjMasterProductm.Cat_ID = e.Cat_ID;
      this.ObjMasterProductm.HSN_NO = e.HSN_NO;
      this.ObjMasterProductm.Custom_Duty = e.Custom_Duty;
      this.ObjMasterProductm.Remarks = e.Remarks;
      this.ObjMasterProductm.RCM_Per = Number(e.RCM_Per)
      this.objGst.Cat_ID = e.Cat_ID;
      this.objGst.HSN_NO = e.HSN_NO;
    }
  }
  FinancialDetailsData(e) {
    console.log(e)
    this.ObjMasterProductm.Can_Purchase = undefined;
    this.ObjMasterProductm.Billable = undefined;
    this.ObjFinancial = undefined;
    // this.PurchaseACFlag = undefined;
    this.ObjMasterProductm.Purchase_Ac_Ledger = undefined;
    // this.SalesACFlag = undefined;
    this.ObjMasterProductm.Sales_Ac_Ledger = undefined;
    this.ObjMasterProductm.Purchase_Return_Ledger_ID = undefined;
    this.ObjMasterProductm.Sales_Return_Ledger_ID = undefined;
    this.ObjMasterProductm.Discount_Receive_Ledger_ID = undefined;
    this.ObjMasterProductm.Discount_Given_Ledger_ID = undefined;
    if (e.Purchase_Ac_Ledger) {
      this.ObjFinancial = e;
      this.ObjMasterProductm.Can_Purchase = e.Can_Purchase;
      this.ObjMasterProductm.Billable = e.Billable;
      // this.PurchaseACFlag = e.PurchaseACFlag;
      this.ObjMasterProductm.Purchase_Ac_Ledger = e.Purchase_Ac_Ledger;
      // this.SalesACFlag = e.SalesACFlag;
      this.ObjMasterProductm.Sales_Ac_Ledger = e.Sales_Ac_Ledger;
      this.ObjMasterProductm.Purchase_Return_Ledger_ID = e.Purchase_Return_Ledger_ID;
      this.ObjMasterProductm.Sales_Return_Ledger_ID = e.Sales_Return_Ledger_ID;
      this.ObjMasterProductm.Discount_Receive_Ledger_ID = e.Discount_Receive_Ledger_ID;
      this.ObjMasterProductm.Discount_Given_Ledger_ID = e.Discount_Given_Ledger_ID;
      this.ObjMasterProductm.Input_RCM_Ledger_ID = e.Input_RCM_Ledger_ID;
      this.ObjMasterProductm.Output_RCM_Ledger_ID = e.Output_RCM_Ledger_ID;
      this.ObjMasterProductm.Input_CGST_RCM_Ledger_ID = e.Input_CGST_RCM_Ledger_ID;	
      this.ObjMasterProductm.Input_SGST_RCM_Ledger_ID = e.Input_SGST_RCM_Ledger_ID;
      this.ObjMasterProductm.Input_IGST_RCM_Ledger_ID = e.Input_IGST_RCM_Ledger_ID;
      this.ObjMasterProductm.Output_CGST_RCM_Ledger_ID = e.Output_CGST_RCM_Ledger_ID;
      this.ObjMasterProductm.Output_SGST_RCM_Ledger_ID = e.Output_SGST_RCM_Ledger_ID;
      this.ObjMasterProductm.Output_IGST_RCM_Ledger_ID = e.Output_IGST_RCM_Ledger_ID;
      this.objCheckFinamcial.Purchase_Ac_Ledger = e.Purchase_Ac_Ledger;
      this.objCheckFinamcial.Sales_Ac_Ledger = e.Sales_Ac_Ledger;
      this.objCheckFinamcial.Purchase_Return_Ledger_ID = e.Purchase_Return_Ledger_ID;
      this.objCheckFinamcial.Sales_Return_Ledger_ID = e.Sales_Return_Ledger_ID;
      this.objCheckFinamcial.Discount_Receive_Ledger_ID = e.Discount_Receive_Ledger_ID;
      this.objCheckFinamcial.Discount_Given_Ledger_ID = e.Discount_Given_Ledger_ID;
    }
  }
  GetProductType(){
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String": "Get_Master_Product_Type"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.ProductTypeList = data;
     console.log('ProductTypeList ==', this.ProductTypeList)
  
    });
  }
  ViewProductType(){
    this.ProductTypeList = [];
    this.GetProductType();
    setTimeout(() => {
      this.ViewProTypeModal = true;
    }, 300);
    // const obj = {
    //   "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
    //   "Report_Name_String" : "Get_Tender_Organization",
    // }
    // this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //   this.vieworgList = data;
    //   });
    //this.ViewModal = true;
  }
  deleteProType(protypeid){
    this.is_Active = false;
    this.Is_View = true;
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.Profeatureid = undefined;
    this.gradeid = undefined;
    if(protypeid.Product_Type_ID){
      this.protypeid = protypeid.Product_Type_ID;
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
  GetProductSubType(){
    const Obj = {
      Product_Type_ID : this.ObjMasterProductm.Product_Type_ID
    }
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String": "Get_Master_Product_Sub_Type",
      "Json_Param_String": JSON.stringify([Obj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.ProductSubTypeList = data;
     console.log('ProductSubTypeList ==', this.ProductSubTypeList)
  
    });
  }
  ViewProductSubType(){
    this.ProductSubTypeList = [];
    this.GetProductSubType();
    setTimeout(() => {
      this.ViewProSubTModal = true;
    }, 300);
  }
  deleteProSubT(protypesubid){
    this.is_Active = false;
    this.Is_View = true;
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.Profeatureid = undefined;
    this.gradeid = undefined;
    if(protypesubid.Product_Sub_Type_ID){
      this.protypesubid = protypesubid.Product_Sub_Type_ID;
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
  GetProductCategory(){
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String": "Get_Master_Product_Category"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.ProductCategoryList = data;
     console.log('ProductCategoryList ==', this.ProductCategoryList)
  
    });
  }
  GetMOC(){
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String": "Get_Master_Product_Mech_MOC_Data"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.MocList = data;
     console.log('MocList ==', this.MocList)
  
    });
  }
  ViewMoc(){
    this.MocList = [];
    this.GetMOC();
    setTimeout(() => {
      this.ViewMocModal = true;
    }, 300);
  }
  deleteMoc(mocid){
    this.is_Active = false;
    this.Is_View = true;
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.Profeatureid = undefined;
    this.gradeid = undefined;
    if(mocid.MOC_ID){
      this.mocid = mocid.MOC_ID;
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
  GetCapacity(){
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String": "Get_Master_Product_Mech_Capacity_Size_Data"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.CapacitySizeList = data;
     console.log('CapacitySizeList ==', this.CapacitySizeList)
  
    });
  }
  ViewCapacity(){
    this.CapacitySizeList = [];
    this.GetCapacity();
    setTimeout(() => {
      this.ViewCapacityModal = true;
    }, 300);
  }
  deleteCapacity(capacityid){
    this.is_Active = false;
    this.Is_View = true;
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.Profeatureid = undefined;
    this.gradeid = undefined;
    if(capacityid.Capacity_Size_ID){
      this.capacityid = capacityid.Capacity_Size_ID;
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
  GetProductFeature(){
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String": "Get_Master_Product_Mech_Product_Feature_Data"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.ProductFeatureList = data;
     console.log('ProductFeatureList ==', this.ProductFeatureList)
  
    });
  }
  ViewProFeature(){
    this.ProductFeatureList = [];
    this.GetProductFeature();
    setTimeout(() => {
      this.ViewProFeatureModal = true;
    }, 300);
  }
  deleteProFeature(Profeatureid){
    this.is_Active = false;
    this.Is_View = true;
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.Profeatureid = undefined;
    this.gradeid = undefined;
    if(Profeatureid.Product_Feature_ID){
      this.Profeatureid = Profeatureid.Product_Feature_ID;
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
  GetGrade(){
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String": "Get_Master_Product_Mech_Grade_Data"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.GradeList = data;
     console.log('GradeList ==', this.GradeList)
  
    });
  }
  ViewGrade(){
    this.GradeList = [];
    this.GetGrade();
    setTimeout(() => {
      this.ViewGradeModal = true;
    }, 300);
  }
  deleteGrade(gradeid){
    this.is_Active = false;
    this.Is_View = true;
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.Profeatureid = undefined;
    this.gradeid = undefined;
    if(gradeid.Grade_ID){
      this.gradeid = gradeid.Grade_ID;
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
  GetMake(){
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String": "Get_Master_Product_mfg"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Mfg_Company,
          element['value'] = element.Product_Mfg_Comp_ID
        });
        this.MakeList = data;
      } else {
        this.MakeList = [];
  
       }
    // this.MakeList = data;
     console.log('MakeList ==', this.MakeList)
  
    });
  }
  ViewMakeMul(){
    this.MakeList = [];
    this.GetMake();
    setTimeout(() => {
      this.ViewMakeMulModal = true;
    }, 300);
  }
  deleteMakeMul(makemulid){
    this.is_Active = false;
    this.Is_View = true;
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.Profeatureid = undefined;
    this.gradeid = undefined;
    this.makemulid =undefined;
    if(makemulid.Product_Mfg_Comp_ID){
      this.makemulid = makemulid.Product_Mfg_Comp_ID;
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

 //Common Delete
  onConfirm() {
    this.is_Active = false;
    this.Is_View = true;
    let ReportName = '';
    let SPString = "";
    let ObjTemp;
    let secondfuntionrefresh;
    let FunctionRefresh;
    // if (this.protypeid) {
    //   ReportName = "Delete_Master_Product_Type"
    //   ObjTemp = {
    //     Product_Type_ID: this.protypeid
    //   }
    //   FunctionRefresh = 'GetProductType'
    // }
    // if (this.protypesubid) {
    //   ReportName = "Delete_Product_Sub_Type"
    //   ObjTemp = {
    //     Product_Sub_Type_ID: this.protypesubid
    //   }
    //   FunctionRefresh = 'GetProductSubType';
    // }
    if (this.mocid) {
      SPString ="SP_Harbauer_Master_Product_mechanical"
      ReportName = "Delete_Master_Product_Mech_MOC_Data"
      ObjTemp = {
        MOC_ID: this.mocid
      }
      FunctionRefresh = 'GetMOC';
    }
    if (this.capacityid) {
      SPString ="SP_Harbauer_Master_Product_mechanical"
      ReportName = "Delete_Master_Product_Mech_Capacity_Size_Data"
      ObjTemp = {
        Capacity_Size_ID: this.capacityid
      }
      FunctionRefresh = 'GetCapacity'
    }
    if (this.Profeatureid) {
      SPString ="SP_Harbauer_Master_Product_mechanical"
      ReportName = "Delete_Master_Product_Mech_Product_Feature_Data"
      ObjTemp = {
        Product_Feature_ID: this.Profeatureid
      }
      FunctionRefresh = 'GetProductFeature';
    }
    if (this.gradeid) {
      SPString ="SP_Harbauer_Master_Product_mechanical"
      ReportName = "Delete_Master_Product_Mech_Grade_Data"
      ObjTemp = {
        Grade_ID: this.gradeid
      }
      FunctionRefresh = 'GetGrade';
    }
    if (this.makemulid) {
      SPString ="SP_Harbauer_Master_Product_mechanical"
      ReportName = "Delete_Master_Product_Manufacture_Data"
      ObjTemp = {
        Product_Mfg_Comp_ID: this.makemulid
      }
      FunctionRefresh = 'GetMake';
    }
    if (this.Uomid) {
      SPString = "SP_Master_Product_New"
      ReportName = "Delete_Master_UOM"
      ObjTemp = {
        UOM: this.Uomid
     }
      FunctionRefresh = 'getUOM'
      secondfuntionrefresh = 'getAllUOM'
    }
      const obj = {
        "SP_String": SPString,
        "Report_Name_String" : ReportName,
        "Json_Param_String": JSON.stringify(ObjTemp),
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        var msg = data[0].Column1;
        if (data[0].Column1) {
        // this.onReject();
        //this.GetTenderOrgList();
        this[FunctionRefresh]();
        secondfuntionrefresh = secondfuntionrefresh ? this[secondfuntionrefresh]() : null;
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

  ProTypePopup(){
    this.ProductTypeFormSubmitted = false;
    this.ProductTypeName = undefined;
    this.ProTypeModal = true;
    this.Spinner = false;
  }
  CreateProductType(valid){
    this.ProductTypeFormSubmitted = true;
    this.Spinner = true;
      const Obj = {
        Product_Type : this.ProductTypeName,
        Sub_Ledger_Cat_IDS : 0
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_mechanical",
           "Report_Name_String" : "Master_Product_Type_Create ",
           "Json_Param_String": JSON.stringify([Obj])
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           var tempID = data[0].Column1;
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Return_ID  " + tempID,
             detail: "Succesfully Created" //+ mgs
           });
           this.ProductTypeFormSubmitted = false;
           this.ProductTypeName = undefined;
           this.ProTypeModal = false;
           this.Spinner = false;
           this.GetProductType();
       
           } else{
             this.Spinner = false;
             this.compacctToast.clear();
             this.compacctToast.add({
               key: "compacct-toast",
               severity: "error",
               summary: "Warn Message",
               detail: "Error Occured "
             });
           }
         })
       
        }
        else{
          this.Spinner = false;
        }
  }
  ProSubTypePopup(){
    this.ProductSubTypeFormSubmitted = false;
    this.ProductSubTypeName = undefined;
    this.ProSubTypeModal = true;
    this.Spinner = false;
  }
  CreateProductSubType(valid){
    this.ProductSubTypeFormSubmitted = true;
    this.Spinner = true;
      const Obj = {
        Product_Sub_Type : this.ProductSubTypeName,
        Product_Type_ID : this.ObjMasterProductm.Product_Type_ID
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_mechanical",
           "Report_Name_String" : "Master_Product_Sub_Type_Create",
           "Json_Param_String": JSON.stringify([Obj])
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           var tempID = data[0].Column1;
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Return_ID  " + tempID,
             detail: "Succesfully Created" //+ mgs
           });
           this.ProductTypeFormSubmitted = false;
           this.ProductSubTypeName = undefined;
           this.ProSubTypeModal = false;
           this.Spinner = false;
           this.GetProductSubType();
       
           } else{
             this.Spinner = false;
             this.compacctToast.clear();
             this.compacctToast.add({
               key: "compacct-toast",
               severity: "error",
               summary: "Warn Message",
               detail: "Error Occured "
             });
           }
         })
       
        }
        else{
          this.Spinner = false;
        }
  }
  MocPopup(){
    this.CreateMocFormSubmitted = false;
    this.MaterialofCons = undefined;
    this.CreateMocModal = true;
    this.Spinner = false;
  }
  CreateMoc(valid){
    this.CreateMocFormSubmitted = true;
    this.Spinner = true;
      const Obj = {
        MOC_Description : this.MaterialofCons
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_mechanical",
           "Report_Name_String" : "Master_Product_Mech_MOC_Create",
           "Json_Param_String": JSON.stringify([Obj])
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           var tempID = data[0].Column1;
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Return_ID  " + tempID,
             detail: "Succesfully Created" //+ mgs
           });
           this.CreateMocFormSubmitted = false;
           this.MaterialofCons = undefined;
           this.CreateMocModal = false;
           this.Spinner = false;
           this.GetMOC();
       
           } else{
             this.Spinner = false;
             this.compacctToast.clear();
             this.compacctToast.add({
               key: "compacct-toast",
               severity: "error",
               summary: "Warn Message",
               detail: "Error Occured "
             });
           }
         })
       
        }
        else{
          this.Spinner = false;
        }
  }
  CapacityPopup(){
    this.CapacityFormSubmitted = false;
    this.CapacityName = undefined;
    this.CapacityModal = true;
    this.Spinner = false;
  }
  CreateCapacity(valid){
    this.CapacityFormSubmitted = true;
    this.Spinner = true;
      const Obj = {
        Capacity_Size_Desc : this.CapacityName
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_mechanical",
           "Report_Name_String" : "Master_Product_Mech_Capacity_Size_Create",
           "Json_Param_String": JSON.stringify([Obj])
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           var tempID = data[0].Column1;
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Return_ID  " + tempID,
             detail: "Succesfully Created" //+ mgs
           });
           this.CapacityFormSubmitted = false;
           this.CapacityName = undefined;
           this.CapacityModal = false;
           this.Spinner = false;
           this.GetCapacity();
       
           } else{
             this.Spinner = false;
             this.compacctToast.clear();
             this.compacctToast.add({
               key: "compacct-toast",
               severity: "error",
               summary: "Warn Message",
               detail: "Error Occured "
             });
           }
         })
       
        }
        else{
          this.Spinner = false;
        }
  }
  ProFeaturePopup(){
    this.ProFeatureFormSubmitted = false;
    this.ProFeature = undefined;
    this.ProFeatureModal = true;
    this.Spinner = false;
  }
  CreateProFeature(valid){
    this.ProFeatureFormSubmitted = true;
    this.Spinner = true;
      const Obj = {
        Product_Feature_Desc : this.ProFeature
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_mechanical",
           "Report_Name_String" : "Master_Product_Mech_Product_Feature_Create",
           "Json_Param_String": JSON.stringify([Obj])
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           var tempID = data[0].Column1;
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Return_ID  " + tempID,
             detail: "Succesfully Created" //+ mgs
           });
           this.ProFeatureFormSubmitted = false;
           this.ProFeature = undefined;
           this.ProFeatureModal = false;
           this.Spinner = false;
           this.GetProductFeature();
       
           } else{
             this.Spinner = false;
             this.compacctToast.clear();
             this.compacctToast.add({
               key: "compacct-toast",
               severity: "error",
               summary: "Warn Message",
               detail: "Error Occured "
             });
           }
         })
       
        }
        else{
          this.Spinner = false;
        }
  }
  GradePopup(){
    this.GradeFormSubmitted = false;
    this.GradeName = undefined;
    this.GradeModal = true;
    this.Spinner = false;
  }
  CreateGrade(valid){
    this.GradeFormSubmitted = true;
    this.Spinner = true;
      const Obj = {
        Grade_Description : this.GradeName
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_mechanical",
           "Report_Name_String" : "Master_Product_Mech_Grade_Create",
           "Json_Param_String": JSON.stringify([Obj])
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           var tempID = data[0].Column1;
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Return_ID  " + tempID,
             detail: "Succesfully Created" //+ mgs
           });
           this.GradeFormSubmitted = false;
           this.GradeName = undefined;
           this.GradeModal = false;
           this.Spinner = false;
           this.GetGrade();
       
           } else{
             this.Spinner = false;
             this.compacctToast.clear();
             this.compacctToast.add({
               key: "compacct-toast",
               severity: "error",
               summary: "Warn Message",
               detail: "Error Occured "
             });
           }
         })
       
        }
        else{
          this.Spinner = false;
        }
  }
  MakeMulPopup(){
    this.MakeMulFormSubmitted = false;
    this.MakeMulName = undefined;
    this.MakeMulModal = true;
    this.Spinner = false;
  }
  CreateMakeMul(valid){
    this.MakeMulFormSubmitted = true;
    this.Spinner = true;
      const Obj = {
        Mfg_Company : this.MakeMulName
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_mechanical",
           "Report_Name_String" : "Master_Product_Manufacture_Create",
           "Json_Param_String": JSON.stringify([Obj])
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           var tempID = data[0].Column1;
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Return_ID  " + tempID,
             detail: "Succesfully Created" //+ mgs
           });
           this.MakeMulFormSubmitted = false;
           this.MakeMulName = undefined;
           this.MakeMulModal = false;
           this.Spinner = false;
           this.GetMake();
       
           } else{
             this.Spinner = false;
             this.compacctToast.clear();
             this.compacctToast.add({
               key: "compacct-toast",
               severity: "error",
               summary: "Warn Message",
               detail: "Error Occured "
             });
           }
         })
       
        }
        else{
          this.Spinner = false;
        }
  }
  // onUpload(event) {
  //   for (let file of event.files) {
  //     this.uploadedFiles.push(file);
  //   }
  //   // this.messageService.add({
  //   //   severity: 'info',
  //   //   summary: 'File Uploaded',
  //   //   detail: ''
  //   // });
  //   this.compacctToast.clear();
  //   this.compacctToast.add({
  //     key: "compacct-toast",
  //     severity: "info",
  //     summary: "File Uploaded",
  //     detail: ""
  //   });
  // }
  FetchPDFFile(event) {
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    if (event) {
      this.ProductPDFFile = event.files[0];
      this.PDFFlag = true;
    }
  }
  
  // onClear(e,file){
  //   for(let k=0;k < this.ProductPDFFile.length;k++){
  //     if(this.ProductPDFFile[k].name === file.name){
  //       this.ProductPDFFile.splice(k,1);
  //       this.tempDocumentArr.splice(k,1);
  //       this.fileUpload.remove(e,k);
  //     }
  //   }
  // }
  SaveMasterProductM(valid){
   if (this.productid) {
        this.Spinner = true;
        this.MasterProductmFormSubmitted = true;
        console.log("this.checkrequ()",this.checkrequ(this.objCheckFinamcial,this.objGst,this.objProductrequ))
      if(valid && this.checkrequ(this.objCheckFinamcial,this.objGst,this.objProductrequ)){
      let UpdateArr =[]
     
        const Obj = {
            Product_ID : this.productid,
            Product_Mfg_Comp_ID : this.MakeEdit
        }
        UpdateArr.push({...Obj,...this.ObjMasterProductm})
    
         console.log("Update =" , UpdateArr)
        const obj = {
           "SP_String": "SP_Harbauer_Master_Product_mechanical",
           "Report_Name_String" : "Master_Product_Mech_Update",
           "Json_Param_String": JSON.stringify(UpdateArr)
        }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           var tempID = data[0].Column1;
           if(data[0].Column1){
            this.upload(data[0].Product_Manufacturing_Group);
            this.productid = undefined;
           this.tabIndexToView = 0;
           this.items = ["BROWSE", "CREATE"];
           } else{
          
             this.compacctToast.clear();
             this.compacctToast.add({
               key: "compacct-toast",
               severity: "error",
               summary: "Warn Message",
               detail: "Error Occured "
             });
           }
         })
     
      
      } else {
      this.Spinner = false;
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          // detail: "No Docs Selected"
          detail: "Error Occured "
        });
      }
      }
      else {
      this.Spinner = true;
      this.MasterProductmFormSubmitted = true;
       if(valid && this.Product_Mfg_Comp_ID.length){
         let tempArr =[]
        this.Product_Mfg_Comp_ID.forEach(item => {
          const obj = {
              Product_ID : 0,
              Product_Mfg_Comp_ID : item
          }
        tempArr.push({...obj,...this.ObjMasterProductm})
      });
      console.log("create =" , tempArr)
     // return JSON.stringify(tempArr);
      // if(valid && this.ProductPDFFile['size']){
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_mechanical",
           "Report_Name_String" : "Master_Product_Mech_Create",
           "Json_Param_String": JSON.stringify(tempArr)
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           this.ObjMasterProductm.Product_ID = data[0].Product_Manufacturing_Group;
           if(data[0].Product_Manufacturing_Group){
            this.upload(data[0].Product_Manufacturing_Group);
          //   this.compacctToast.clear();
          //   //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
          //   this.compacctToast.add({
          //    key: "compacct-toast",
          //    severity: "success",
          //    summary: "Return_ID  " + tempID,
          //    detail: "Succesfully Saved" //+ mgs
          //  });
          //  this.clearData();
            // this.testchips =[];
       
           } else{
            // this.ngxService.stop();
             this.Spinner = false;
             this.destroyChild();
             this.compacctToast.clear();
             this.compacctToast.add({
               key: "compacct-toast",
               severity: "error",
               summary: "Warn Message",
               detail: "Error Occured "
             });
           }
         })
        }
        else {
        //if(!this.ProductPDFFile['size']) {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Validation",
            // detail: "No Docs Selected"
            detail: "Error Occured "
          });
      }
    // }
  }
  }
  checkrequ(financial?,Gst?,product?){
    let falg = false
    if(financial){
      let getArrValue = Object.values(financial);
      if(getArrValue.length === 6){
        falg = true
      }
      else {
        falg = false
        return falg
      }
  
    }
   if(Gst){
    let getArrValue = Object.values(Gst);
    let tempHSN = this.objGst.HSN_NO
    console.log("tempHSN",tempHSN.toString());
    let tempHSNString = tempHSN.toString()
    if(getArrValue.length === 2 && tempHSNString.length === 6){
      falg = true
      
    }
    else {
      falg = false
      return falg
    }
   }
   if(product){
    let getArrValue = Object.values(product);
    if(getArrValue.length === 3){
      falg = true
    }
    else {
      falg = false
      return falg
    }
   }
  return falg
  }
  async upload(id){
    const formData: FormData = new FormData();
        formData.append("aFile", this.ProductPDFFile)
        formData.append("Product_Manufacturing_Group", id);
    let response = await fetch('/Harbauer_Master_Product_mechanical/Upload_Doc',{ 
                  method: 'POST',
                  body: formData // This is your file object
                });
    let responseText = await response.text();
    var msg = this.buttonname != "Create" ? "Succesfully Updated " : "Succesfully Created " ;
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: '',//'Return_ID : ' + this.ObjMasterProductm.Product_ID,
        detail: msg
      });
      // this.ObjManualPaymentCnfm = new ManualPaymentCnfm();
      // this.ManualPaymentConfirmFormSubmit = false;
      // this.ManualPaymentConfirmModal = false;
      this.clearData();
  };
  // upload(id) {
  //   const endpoint = "/Harbauer_Master_Product_mechanical/Upload_Doc";
  //   const formData: FormData = new FormData();
  //   formData.append("aFile", this.ProductPDFFile);
  //   formData.append("Product_ID", id);
  //   this.$http.post(endpoint, formData).subscribe(data => {
  //     console.log(data);
  //   });
  // }

  // BROWSE TAB
  GetBrowseList(){
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String": "Browse_Master_Product_Mech"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.BrowseList = data;
     console.log('BrowseList ==', this.BrowseList)
  
    });
  } 
  Edit(masterproducrM){
    if (masterproducrM.Product_Type_ID) {
      this.productid = masterproducrM.Product_ID;
      // this.protyid = masterproducrM.Product_Type_ID;
      // this.pstypeid = masterproducrM.Product_Sub_Type_ID;
      // this.pcatid = masterproducrM.Cat_ID;
      // this.prodes = masterproducrM.Product_Description;
      // this.matocid = masterproducrM.MOC_Description;
      // this.sizeid = masterproducrM.Capacity_Size_ID;
      // this.pfetureid = masterproducrM.Product_Feature_ID;
      // this.grdid = masterproducrM.Grade_ID;
      // this.rmrk = masterproducrM.Remarks;
      // this.hcode = masterproducrM.HSN_NO;
      // this.per = masterproducrM.GST_Percentage;
      // this.uom = masterproducrM.UOM;

      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.clearData();
      this.GetEdit(this.protyid);
      this.makedisabled = true;
    }
  }
  GetEdit(masterproducrM){
    this.editList = [];
    //this.ProductionFormSubmitted = false;
    const temobj = {
      Product_ID  : this.productid,
     }
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String": "Get_Master_Product_Mech",
      "Json_Param_String": JSON.stringify(temobj)
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("mechanical",data);
      this.editList = data;
         this.ObjMasterProductm = data[0];
     //  this.myDate = data[0].Date;
      this.ObjFinancialComponentData = data[0];
      //  console.log("ObjFinancialComponentData",this.ObjFinancialComponentData)
      this.ProductDetailsInput.EditProductDetalis(data[0].Product_Type_ID,data[0].Product_Sub_Type_ID,data[0].Product_Description,data[0].Product_Code,data[0].Rack_NO)
       this.GstAndCustDutyInput.GetEdit(JSON.stringify(data))
      this.GetProductSubType();
      this.ObjMasterProductm.MOC_ID = data[0].MOC_ID ? data[0].MOC_ID : undefined;
      this.ObjMasterProductm.Capacity_Size_ID = data[0].Capacity_Size_ID ? data[0].Capacity_Size_ID : undefined;
      this.ObjMasterProductm.Product_Feature_ID = data[0].Product_Feature_ID;
      this.ObjMasterProductm.Grade_ID = data[0].Grade_ID ? data[0].Grade_ID : undefined;
      this.ObjMasterProductm.UOM = data[0].UOM;
      this.MakeEdit = data[0].Product_Mfg_Comp_ID;
    //  this.GetMakedist();
       this.makedisabled = true;
       this.PDFViewFlag = data[0].Product_Image ? true : false;
       this.ProductPDFLink = data[0].Product_Image
      ? data[0].Product_Image
      : undefined;
      // console.log("this.editList  ===",this.editList);
  
  })
  }
  GetMakedist(){
    let DMake = [];
   // this.IndentFilter = [];
    this.Product_Mfg_Comp_ID =[];
    //this.SelectedDistOrderBy1 = [];
    this.editList.forEach((item) => {
      if (DMake.indexOf(item.Product_Mfg_Comp_ID) === -1) {
        DMake.push(item.Product_Mfg_Comp_ID);
        // this.IndentFilter.push({ label: item.Req_No + '(' + item.Location + ')' , value: item.Req_No });
         this.Product_Mfg_Comp_ID.push(item.Product_Mfg_Comp_ID);
       // console.log("this.TimerangeFilter", this.IndentFilter);
      }
    });
  }

  // Active & Inavtive
  Active(row){
    if(row.Product_ID){
    this.Is_View = false;
    this.is_Active = true;
    //this.CanRemarksPoppup = true;
    this.Browseproid = row.Product_ID;
    this.isvisible = row.Is_Visiable;
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
   Inactive(Row) {
    if(Row.Product_ID){
      this.Is_View = false;
      this.is_Active = true;
      //this.CanRemarksPoppup = true;
      this.Browseproid = Row.Product_ID;
      this.isvisible = Row.Is_Visiable;
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
   onConfirm2() {
    this.Is_View = false;
    this.is_Active = true;
    if (this.isvisible == "N") {
    const Tempobj = {
      Product_ID : this.Browseproid
    }
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_Electrical",
      "Report_Name_String": "Active_Master_Product",
      "Json_Param_String": JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log(data);
      if(data[0].Column1) {
        this.GetBrowseList();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Product ID : " + this.Browseproid,
          detail:  "Active Succesfully "
        });
  
      } else{
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
    })
    }
    else {
      const Tempobj = {
        Product_ID : this.Browseproid
      }
      const obj = {
        "SP_String": "SP_Harbauer_Master_Product_Electrical",
        "Report_Name_String": "InActive_Master_Product",
        "Json_Param_String": JSON.stringify([Tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        //console.log(data);
        if(data[0].Column1) {
          this.GetBrowseList();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Product ID : " + this.Browseproid,
            detail:  "Inactive Succesfully "
          });
    
        } else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      })
      }
  }
    getUOM(){
    this.UOMData=[]; 
      this.UomDataList = [];
        const obj = {
          "SP_String": "SP_Master_Product_New",
          "Report_Name_String":"Get_Master_UOM_Data",
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.UOMData = data;
        console.log("UOMData==",this.UOMData);
          this.UOMData.forEach((el : any) => {
            this.UomDataList.push({
              label: el.UOM,
              value: el.UOM
              
            });
          });
        })
    }
    getAllUOM(){
      this.AllUOMData=[]; 
       this.AllUomDataList = [];
          const obj = {
           "SP_String": "SP_Master_Product_New",
           "Report_Name_String":"Get_Master_UOM_Data",
          }
          this.GlobalAPI.getData(obj).subscribe((data:any)=>{
           this.AllUOMData = data;
          console.log("AllUOMData==",this.AllUOMData);
           this.AllUOMData.forEach((el : any) => {
             this.AllUomDataList.push({
               label: el.UOM,
               value: el.UOM
               
             });
           });
         })
    }
    ViewUomType(){
      this.UOMData = [];
      this.getUOM();
      setTimeout(() => {
        this.ViewUomModal = true;
        }, 200);
    }
    ProUomPopup(){
      this.UOMTypeFormSubmitted = false;
      this.UOMTypeName = undefined;
      this.UOMTypeModal = true;
      this.Spinner = false;
    }
    CreateUomType(valid){
      this.UOMTypeFormSubmitted = true;
        this.Spinner = true;
       
        if(valid){
           const tempSave = {
            UOM : this.UOMTypeName,
          }
         console.log(tempSave)
           const obj = {
             "SP_String": "SP_Master_Product_New",
             "Report_Name_String" : "Add_Master_UOM",
             "Json_Param_String": JSON.stringify([tempSave])
         
           }
           this.GlobalAPI.postData(obj).subscribe((data:any)=>{
             console.log(data);
             var tempID = data[0].Column1;
             if(data[0].Column1){
              this.compacctToast.clear();
              //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
              this.compacctToast.add({
               key: "compacct-toast",
               severity: "success",
               summary: "UOM" + tempID,
               detail: "Succesfully Created" //+ mgs
             });
             this.UOMTypeFormSubmitted = false;
             this.UOMTypeName = undefined;
             this.UOMTypeModal = false;
             this.Spinner = false;
             this.getUOM();
             this.getAllUOM();
         
             } else{
               this.Spinner = false;
               this.compacctToast.clear();
               this.compacctToast.add({
                 key: "compacct-toast",
                 severity: "error",
                 summary: "Warn Message",
                 detail: "Error Occured "
               });
             }
           })
         
        }
        else {
          this.Spinner = false;
        }
    }
    deleteProUom(uom){
      this.protypesubid = undefined;
      this.mettypeid = undefined;
      this.protypeid = undefined
      this.Uomid = undefined;
      if(uom.UOM){
        this.is_Active = false;
        this.Is_View = true;
        this.Uomid = uom.UOM;
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
  // onClear(e,file){
  //   for(let k=0;k < this.ProductPDFFile.length;k++){
  //     if(this.ProductPDFFile[k].name === file.name){
  //       this.ProductPDFFile.splice(k,1);
  //       //this.tempDocumentArr.splice(k,1);
  //       this.fileInput.remove(e,k);
  //     }
  //   }
  // }

}
class MasterProductm{
   Product_Type_ID:number;
   Product_Sub_Type_ID:number;
   Cat_ID:number;
   Product_ID:number;
   Product_Description:string;
   MOC_ID:number;
   Capacity_Size_ID:number;
   Product_Feature_ID:number;
   Grade_ID	:number;
   Remarks	:string;
   HSN_NO:number;
   GST_Percentage:number;
   UOM:string;
  // Product_Mfg_Comp_ID:any;
   Product_Image:any;

   Product_Code:any;
   Rack_NO :any;
   HSN_Code:any;	
   Custom_Duty:any;
   Billable:boolean;			
   Can_Purchase:boolean;
   Purchase_Ac_Ledger:any;
   Sales_Ac_Ledger:any;	
   Purchase_Return_Ledger_ID:number;
   Discount_Receive_Ledger_ID:number;	
   Discount_Given_Ledger_ID:number;	
   Sales_Return_Ledger_ID:number;
   Input_RCM_Ledger_ID:any;
   Output_RCM_Ledger_ID:any; 
   RCM_Per:any;
   Input_CGST_RCM_Ledger_ID:any;	
   Input_SGST_RCM_Ledger_ID:any;
   Input_IGST_RCM_Ledger_ID:any;
   Output_CGST_RCM_Ledger_ID:any;
   Output_SGST_RCM_Ledger_ID:any;
   Output_IGST_RCM_Ledger_ID:any;
 }
 class Financial{
  Can_Purchase : boolean;
  Billable : boolean;
  Purchase_Ac_Ledger:any;
  Sales_Ac_Ledger:any;
  Purchase_Return_Ledger_ID:any;
  Sales_Return_Ledger_ID:any;
  Discount_Receive_Ledger_ID:any;
  Discount_Given_Ledger_ID:any;
  Input_RCM_Ledger_ID:any;
  Output_RCM_Ledger_ID:any;
  Input_CGST_RCM_Ledger_ID:any;	
  Input_SGST_RCM_Ledger_ID:any;
  Input_IGST_RCM_Ledger_ID:any;
  Output_CGST_RCM_Ledger_ID:any;
  Output_SGST_RCM_Ledger_ID:any;
  Output_IGST_RCM_Ledger_ID:any;
}