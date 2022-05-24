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

  makedisabled = false;
  is_Active = false;
  Is_View = false;
  Browseproid = undefined;
  isvisible = undefined;

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
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Master Product Mechanical",
      Link: " Tender Management -> Master -> Master Product Mechanical"
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
     this.makedisabled = false;
     this.GetBrowseList();
     this.PDFViewFlag = false;
     if (this.PDFViewFlag === false) {
      this.fileInput.clear();
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
    let ObjTemp;
    let FunctionRefresh;
    if (this.protypeid) {
      ReportName = "Delete_Master_Product_Type"
      ObjTemp = {
        Product_Type_ID: this.protypeid
      }
      FunctionRefresh = 'GetProductType'
    }
    if (this.protypesubid) {
      ReportName = "Delete_Product_Sub_Type"
      ObjTemp = {
        Product_Sub_Type_ID: this.protypesubid
      }
      FunctionRefresh = 'GetProductSubType';
    }
    if (this.mocid) {
      ReportName = "Delete_Master_Product_Mech_MOC_Data"
      ObjTemp = {
        MOC_ID: this.mocid
      }
      FunctionRefresh = 'GetMOC';
    }
    if (this.capacityid) {
      ReportName = "Delete_Master_Product_Mech_Capacity_Size_Data"
      ObjTemp = {
        Capacity_Size_ID: this.capacityid
      }
      FunctionRefresh = 'GetCapacity'
    }
    if (this.Profeatureid) {
      ReportName = "Delete_Master_Product_Mech_Product_Feature_Data"
      ObjTemp = {
        Product_Feature_ID: this.Profeatureid
      }
      FunctionRefresh = 'GetProductFeature';
    }
    if (this.gradeid) {
      ReportName = "Delete_Master_Product_Mech_Grade_Data"
      ObjTemp = {
        Grade_ID: this.gradeid
      }
      FunctionRefresh = 'GetGrade';
    }
    if (this.makemulid) {
      ReportName = "Delete_Master_Product_Manufacture_Data"
      ObjTemp = {
        Product_Mfg_Comp_ID: this.makemulid
      }
      FunctionRefresh = 'GetMake';
    }
      const obj = {
        "SP_String": "SP_Harbauer_Master_Product_mechanical",
        "Report_Name_String" : ReportName,
        "Json_Param_String": JSON.stringify(ObjTemp),
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        var msg = data[0].Column1;
        if (data[0].Column1) {
        // this.onReject();
        //this.GetTenderOrgList();
        this[FunctionRefresh]();
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
    //if(this.Product_Mfg_Comp_ID.length) {
      if (this.productid) {
        this.Spinner = true;
        this.MasterProductmFormSubmitted = true;
      if(valid && this.Product_Mfg_Comp_ID.length){
      let UpdateArr =[]
      this.Product_Mfg_Comp_ID.forEach(item => {
        const Obj = {
            Product_ID : this.productid,
            Product_Mfg_Comp_ID : item
           // Mfg_Company : item.label
        }
        UpdateArr.push({...Obj,...this.ObjMasterProductm})
    });
    console.log("Update =" , UpdateArr)
    // if(valid && this.productid){
      // const Obj = {
      //   Product_ID  : this.productid,
      //   Product_Mfg_Comp_ID : this.Product_Mfg_Comp_ID
      // }
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
          //   this.compacctToast.clear();
          //   //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
          //   this.compacctToast.add({
          //    key: "compacct-toast",
          //    severity: "success",
          //    summary: "Return_ID  " + tempID,
          //    detail: "Succesfully Updated" //+ mgs
          //  });
          //  this.clearData();
           this.productid = undefined;
           this.tabIndexToView = 0;
           this.items = ["BROWSE", "CREATE"];
          //  this.buttonname = "Save";
            // this.testchips =[];
       
           } else{
            // this.ngxService.stop();
             this.compacctToast.clear();
             this.compacctToast.add({
               key: "compacct-toast",
               severity: "error",
               summary: "Warn Message",
               detail: "Error Occured "
             });
           }
         })
       // }
      
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
      // const Obj = {
      //   Product_Code : this.ObjMachineMaster.Product_Model,
      //   Product_Description : this.ObjMachineMaster.Product_Description,
      //   Product_Mfg_Comp_ID : this.ObjMachineMaster.Manufacturer
      // }
      if(valid && this.Product_Mfg_Comp_ID.length){
      // if(this.Product_Mfg_Comp_ID.length) {
        let tempArr =[]
        this.Product_Mfg_Comp_ID.forEach(item => {
          const obj = {
              Product_ID : 0,
              Product_Mfg_Comp_ID : item
             // Mfg_Company : item.label
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
      // Product_Type_ID : this.protyid,
      // Product_Sub_Type_ID : this.pstypeid,
      // Cat_ID : this.pcatid,
      // Product_Description : this.prodes,
      // MOC_Description : this.matocid,
      // Capacity_Size_ID : this.sizeid,
      // Product_Feature_ID : this.pfetureid,
      // Grade_ID : this.grdid,
      // Remarks : this.rmrk,
      // HSN_NO : this.hcode,
      // GST_Percentage : this.per,
      // UOM : this.uom

    }
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String": "Get_Master_Product_Mech",
      "Json_Param_String": JSON.stringify(temobj)
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editList = data;
       //this.myDate = data[0].Date;
       this.ObjMasterProductm.Product_Type_ID = data[0].Product_Type_ID;
       this.GetProductSubType();
       this.ObjMasterProductm.Product_Sub_Type_ID = data[0].Product_Sub_Type_ID;
       this.ObjMasterProductm.Cat_ID = data[0].Cat_ID;
       this.ObjMasterProductm.Product_Description = data[0].Product_Description;
       this.ObjMasterProductm.MOC_ID = data[0].MOC_ID ? data[0].MOC_ID : undefined;
       this.ObjMasterProductm.Capacity_Size_ID = data[0].Capacity_Size_ID ? data[0].Capacity_Size_ID : undefined;
       this.ObjMasterProductm.Product_Feature_ID = data[0].Product_Feature_ID;
       this.ObjMasterProductm.Grade_ID = data[0].Grade_ID ? data[0].Grade_ID : undefined;
       this.ObjMasterProductm.Remarks = data[0].Remarks ? data[0].Remarks : undefined;
       this.ObjMasterProductm.HSN_NO = data[0].HSN_NO;
       this.ObjMasterProductm.GST_Percentage = data[0].GST_Percentage;
       this.ObjMasterProductm.UOM = data[0].UOM;
      // this.Product_Mfg_Comp_ID = data[0].Product_Mfg_Comp_ID;
       this.GetMakedist();
       this.makedisabled = true;
       this.PDFViewFlag = data[0].Product_Image ? true : false;
       this.ProductPDFLink = data[0].Product_Image
      ? data[0].Product_Image
      : undefined;
      console.log("this.editList  ===",this.editList);
  
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
 }
