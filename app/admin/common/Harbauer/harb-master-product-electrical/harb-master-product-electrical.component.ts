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
  selector: 'app-harb-master-product-electrical',
  templateUrl: './harb-master-product-electrical.component.html',
  styleUrls: ['./harb-master-product-electrical.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HarbMasterProductElectricalComponent implements OnInit {
  tabIndexToView = 0;
  // tabIndexToView2 = 0;
  // items2 =['General Information','EMD / Tender Fee','Document','Task'];
  items = ["BROWSE","CREATE"];
  url = window["config"];
  //persons: [];
  buttonname = "Create";
  Spinner = false;
  MasterProductelFormSubmitted = false;
  ObjMasterProductel = new MasterProductel();

  ProductTypeList = [];
  ProductSubTypeList = [];
  ProductCategoryList = [];
  MocList = [];
  CapacitySizeList = [];
  AddFeature1List = [];
  AddFeature2List = [];
  AddFeature3List = [];
  AddFeature4List = [];
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
  AddFeature1Modal = false;
  AddFeature1FormSubmitted = false;
  AddFeature1 = undefined;
  AddFeature2Modal = false;
  AddFeature2FormSubmitted = false;
  AddFeature2 = undefined;
  AddFeature3Modal = false;
  AddFeature3FormSubmitted = false;
  AddFeature3 = undefined;
  AddFeature4Modal = false;
  AddFeature4FormSubmitted = false;
  AddFeature4 = undefined;
  GradeModal = false;
  GradeFormSubmitted = false;
  GradeName = undefined;

  ViewProTypeModal = false;
  ViewProSubTModal = false;
  ViewMocModal = false;
  ViewCapacityModal = false;
  ViewAddFeature1Modal = false;
  ViewAddFeature2Modal = false;
  ViewAddFeature3Modal = false;
  ViewAddFeature4Modal = false;
  ViewGradeModal = false;

  protypeid = undefined;
  protypesubid = undefined;
  mocid = undefined;
  capacityid = undefined;
  addfeatureid1 = undefined;
  addfeaid2 = undefined;
  addfid3 = undefined;
  adfeaiid4 = undefined;
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

  // protyid = undefined;
  // pstypeid = undefined;
  // pcatid = undefined;
  // prodes = undefined;
  // matocid = undefined;
  // sizeid = undefined;
  // pfetureid = undefined;
  // grdid = undefined;
  // rmrk = undefined;
  // hcode = undefined;
  // per = undefined;
  // uom = undefined;

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
      Header: "Master Product Electrical",
      Link: " Tender Management -> Master -> Master Product Electrical"
    });
    
     this.GetProductType();
     //this.GetProductSubType();
     this.GetProductCategory();
     this.GetMOC();
     this.GetCapacity();
     this.GetAddFeature1();
     this.GetAddFeature2();
     this.GetAddFeature3();
     this.GetAddFeature4();
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
     this.ObjMasterProductel = new MasterProductel();
     this.MasterProductelFormSubmitted = false;
     this.Product_Mfg_Comp_ID = undefined;
     this.makedisabled = false;
     this.GetBrowseList();
     this.PDFViewFlag = false;
     if (this.PDFViewFlag === false) {
      this.fileInput.clear();
    }
  
  //PRODUCT TYPE
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
    this.addfeatureid1 = undefined;
    this.addfeaid2 = undefined;
    this.addfid3 = undefined;
    this.adfeaiid4 = undefined;
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
  }

  //PRODUCT SUB TYPE
  GetProductSubType(){
    const Obj = {
      Product_Type_ID : this.ObjMasterProductel.Product_Type_ID
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
    this.addfeatureid1 = undefined;
    this.addfeaid2 = undefined;
    this.addfid3 = undefined;
    this.adfeaiid4 = undefined;
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
        Product_Type_ID : this.ObjMasterProductel.Product_Type_ID
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
  }

  //PRODUCT CATEGORY
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
  
  //MOC
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
    this.addfeatureid1 = undefined;
    this.addfeaid2 = undefined;
    this.addfid3 = undefined;
    this.adfeaiid4 = undefined;
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
  }

  //CAPACITY
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
    this.addfeatureid1 = undefined;
    this.addfeaid2 = undefined;
    this.addfid3 = undefined;
    this.adfeaiid4 = undefined;
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
  }

  // ADDITIONAL FEATURE 1
  GetAddFeature1(){
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_Electrical",
      "Report_Name_String": "Get_Master_Product_Additional_Feature_1_Data"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.AddFeature1List = data;
     console.log('AddFeature1List ==', this.AddFeature1List)
  
    });
  }
  ViewAddFeature1(){
    this.AddFeature1List = [];
    this.GetAddFeature1();
    setTimeout(() => {
    this.ViewAddFeature1Modal = true;
    }, 300);
  }
  deleteAddFeature1(addfeatureid1){
    this.is_Active = false;
    this.Is_View = true;
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.addfeatureid1 = undefined;
    this.addfeaid2 = undefined;
    this.addfid3 = undefined;
    this.adfeaiid4 = undefined;
    this.gradeid = undefined;
    if(addfeatureid1.Additional_Feature_ID_1){
      this.addfeatureid1 = addfeatureid1.Additional_Feature_ID_1;
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
  AddFeature1Popup(){
    this.AddFeature1FormSubmitted = false;
    this.AddFeature1 = undefined;
    this.AddFeature1Modal = true;
    this.Spinner = false;
  }
  CreateAddFeature1(valid){
    this.AddFeature1FormSubmitted = true;
    this.Spinner = true;
      const Obj = {
        Additional_Feature : this.AddFeature1
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_Electrical",
           "Report_Name_String" : "Master_Product_Additional_Feature_1_Create",
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
           this.AddFeature1FormSubmitted = false;
           this.AddFeature1 = undefined;
           this.AddFeature1Modal = false;
           this.Spinner = false;
           this.GetAddFeature1();
       
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
  }

  // ADDITIONAL FEATURE 2
  GetAddFeature2(){
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_Electrical",
      "Report_Name_String": "Get_Master_Product_Additional_Feature_2_Data"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.AddFeature2List = data;
     console.log('AddFeature2List ==', this.AddFeature2List)
  
    });
  }
  ViewAddFeature2(){
    this.AddFeature2List = [];
    this.GetAddFeature2();
    setTimeout(() => {
      this.ViewAddFeature2Modal = true;
    }, 300);
  }
  deleteAddFeature2(addfeatureid2){
    this.is_Active = false;
    this.Is_View = true;
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.addfeatureid1 = undefined;
    this.addfeaid2 = undefined;
    this.addfid3 = undefined;
    this.adfeaiid4 = undefined;
    this.gradeid = undefined;
    if(addfeatureid2.Additional_Feature_ID_2){
      this.addfeaid2 = addfeatureid2.Additional_Feature_ID_2;
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
  AddFeature2Popup(){
    this.AddFeature2FormSubmitted = false;
    this.AddFeature2 = undefined;
    this.AddFeature2Modal = true;
    this.Spinner = false;
  }
  CreateAddFeature2(valid){
    this.AddFeature2FormSubmitted = true;
    this.Spinner = true;
      const Obj = {
        Additional_Feature : this.AddFeature2
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_Electrical",
           "Report_Name_String" : "Master_Product_Additional_Feature_2_Create",
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
           this.AddFeature2FormSubmitted = false;
           this.AddFeature2 = undefined;
           this.AddFeature2Modal = false;
           this.Spinner = false;
           this.GetAddFeature2();
       
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
  }

  // ADDITIONAL FEATURE 3
  GetAddFeature3(){
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_Electrical",
      "Report_Name_String": "Get_Master_Product_Additional_Feature_3_Data"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.AddFeature3List = data;
     console.log('AddFeature3List ==', this.AddFeature3List)
  
    });
  }
  ViewAddFeature3(){
    this.AddFeature3List = [];
    this.GetAddFeature3();
    setTimeout(() => {
      this.ViewAddFeature3Modal = true;
    }, 300);
  }
  deleteAddFeature3(addfeatureid3){
    this.is_Active = false;
    this.Is_View = true;
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.addfeatureid1 = undefined;
    this.addfeaid2 = undefined;
    this.addfid3 = undefined;
    this.adfeaiid4 = undefined;
    this.gradeid = undefined;
    if(addfeatureid3.Additional_Feature_ID_3){
      this.addfid3 = addfeatureid3.Additional_Feature_ID_3;
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
  AddFeature3Popup(){
    this.AddFeature3FormSubmitted = false;
    this.AddFeature3 = undefined;
    this.AddFeature3Modal = true;
    this.Spinner = false;
  }
  CreateAddFeature3(valid){
    this.AddFeature3FormSubmitted = true;
    this.Spinner = true;
      const Obj = {
        Additional_Feature : this.AddFeature3
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_Electrical",
           "Report_Name_String" : "Master_Product_Additional_Feature_3_Create",
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
           this.AddFeature3FormSubmitted = false;
           this.AddFeature3 = undefined;
           this.AddFeature3Modal = false;
           this.Spinner = false;
           this.GetAddFeature3();
       
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
  }

  // ADDITIONAL FEATURE 4
  GetAddFeature4(){
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_Electrical",
      "Report_Name_String": "Get_Master_Product_Additional_Feature_4_Data"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.AddFeature4List = data;
     console.log('AddFeature4List ==', this.AddFeature4List)
  
    });
  }
  ViewAddFeature4(){
    this.AddFeature4List = [];
    this.GetAddFeature4();
    setTimeout(() => {
      this.ViewAddFeature4Modal = true;
    }, 300);
  }
  deleteAddFeature4(addfeatureid4){
    this.is_Active = false;
    this.Is_View = true;
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.addfeatureid1 = undefined;
    this.addfeaid2 = undefined;
    this.addfid3 = undefined;
    this.adfeaiid4 = undefined;
    this.gradeid = undefined;
    if(addfeatureid4.Additional_Feature_ID_4){
      this.adfeaiid4 = addfeatureid4.Additional_Feature_ID_4;
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
  AddFeature4Popup(){
    this.AddFeature4FormSubmitted = false;
    this.AddFeature4 = undefined;
    this.AddFeature4Modal = true;
    this.Spinner = false;
  }
  CreateAddFeature4(valid){
    this.AddFeature4FormSubmitted = true;
    this.Spinner = true;
      const Obj = {
        Additional_Feature : this.AddFeature4
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_Electrical",
           "Report_Name_String" : "Master_Product_Additional_Feature_4_Create",
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
           this.AddFeature4FormSubmitted = false;
           this.AddFeature4 = undefined;
           this.AddFeature4Modal = false;
           this.Spinner = false;
           this.GetAddFeature4();
       
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
  }

  //GRADE
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
    this.addfeatureid1 = undefined;
    this.addfeaid2 = undefined;
    this.addfid3 = undefined;
    this.adfeaiid4 = undefined;
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
  }

  //MAKE (MULTIPLE)
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

 //Common Delete From View
  onConfirm() {
    this.is_Active = false;
    this.Is_View = true;
    let SpName = '';
    let ReportName = '';
    let ObjTemp;
    let FunctionRefresh;
    if (this.protypeid) {
      SpName = "SP_Harbauer_Master_Product_mechanical"
      ReportName = "Delete_Master_Product_Type"
      ObjTemp = {
        Product_Type_ID: this.protypeid
      }
      FunctionRefresh = 'GetProductType'
    }
    if (this.protypesubid) {
      SpName = "SP_Harbauer_Master_Product_mechanical"
      ReportName = "Delete_Product_Sub_Type"
      ObjTemp = {
        Product_Sub_Type_ID: this.protypesubid
      }
      FunctionRefresh = 'GetProductSubType';
    }
    if (this.mocid) {
      SpName = "SP_Harbauer_Master_Product_mechanical"
      ReportName = "Delete_Master_Product_Mech_MOC_Data"
      ObjTemp = {
        MOC_ID: this.mocid
      }
      FunctionRefresh = 'GetMOC';
    }
    if (this.capacityid) {
      SpName = "SP_Harbauer_Master_Product_mechanical"
      ReportName = "Delete_Master_Product_Mech_Capacity_Size_Data"
      ObjTemp = {
        Capacity_Size_ID: this.capacityid
      }
      FunctionRefresh = 'GetCapacity'
    }
    if (this.addfeatureid1) {
      SpName = "SP_Harbauer_Master_Product_Electrical"
      ReportName = "Delete_Master_Product_Additional_Feature_1_Data"
      ObjTemp = {
        Additional_Feature_ID_1 : this.addfeatureid1
      }
      FunctionRefresh = 'GetAddFeature1';
    }
    if (this.addfeaid2) {
      SpName = "SP_Harbauer_Master_Product_Electrical"
      ReportName = "Delete_Master_Product_Additional_Feature_2_Data"
      ObjTemp = {
        Additional_Feature_ID_2 : this.addfeaid2
      }
      FunctionRefresh = 'GetAddFeature2';
    }
    if (this.addfid3) {
      SpName = "SP_Harbauer_Master_Product_Electrical"
      ReportName = "Delete_Master_Product_Additional_Feature_3_Data"
      ObjTemp = {
        Additional_Feature_ID_3 : this.addfid3
      }
      FunctionRefresh = 'GetAddFeature3';
    }
    if (this.adfeaiid4) {
      SpName = "SP_Harbauer_Master_Product_Electrical"
      ReportName = "Delete_Master_Product_Additional_Feature_4_Data"
      ObjTemp = {
        Additional_Feature_ID_4 : this.adfeaiid4
      }
      FunctionRefresh = 'GetAddFeature4';
    }
    if (this.gradeid) {
      SpName = "SP_Harbauer_Master_Product_mechanical"
      ReportName = "Delete_Master_Product_Mech_Grade_Data"
      ObjTemp = {
        Grade_ID: this.gradeid
      }
      FunctionRefresh = 'GetGrade';
    }
      const obj = {
        "SP_String": SpName,
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
  SaveMasterProductel(valid){
    //if(this.Product_Mfg_Comp_ID.length) {
      if (this.productid) {
        this.Spinner = true;
        this.MasterProductelFormSubmitted = true;
      if(valid && this.Product_Mfg_Comp_ID.length) {
      let UpdateArr =[]
      this.Product_Mfg_Comp_ID.forEach(item => {
        const Obj = {
            Product_ID : this.productid,
            Product_Mfg_Comp_ID : item
           // Mfg_Company : item.label
        }
        UpdateArr.push({...Obj,...this.ObjMasterProductel})
    });
    console.log("Update =" , UpdateArr)
    // if(valid && this.productid){
      // const Obj = {
      //   Product_ID  : this.productid,
      //   Product_Mfg_Comp_ID : this.Product_Mfg_Comp_ID
      // }
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_Electrical",
           "Report_Name_String" : "Master_Product_Electrical_Update",
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
          //    summary: '', //"Return_ID  " + tempID,
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
      this.MasterProductelFormSubmitted = true;
      // const Obj = {
      //   Product_Code : this.ObjMachineMaster.Product_Model,
      //   Product_Description : this.ObjMachineMaster.Product_Description,
      //   Product_Mfg_Comp_ID : this.ObjMachineMaster.Manufacturer
      // }
      if(valid && this.Product_Mfg_Comp_ID.length) {
      // if(this.Product_Mfg_Comp_ID.length) {
        let tempArr =[]
        this.Product_Mfg_Comp_ID.forEach(item => {
          const obj = {
              Product_ID : 0,
              Product_Mfg_Comp_ID : item
             // Mfg_Company : item.label
          }
        tempArr.push({...obj,...this.ObjMasterProductel})
      });
      console.log("create =" , tempArr)
     // return JSON.stringify(tempArr);
      // if(valid && this.ProductPDFFile['size']){
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_Electrical",
           "Report_Name_String" : "Master_Product_Electrical_Create",
           "Json_Param_String": JSON.stringify(tempArr)
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           this.ObjMasterProductel.Product_ID = data[0].Product_Manufacturing_Group;
           if(data[0].Product_Manufacturing_Group){
            this.upload(data[0].Product_Manufacturing_Group);
          //   this.compacctToast.clear();
          //   //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
          //   this.compacctToast.add({
          //    key: "compacct-toast",
          //    severity: "success",
          //    summary: '', //"Return_ID  " + tempID,
          //    detail: "Succesfully Saved" //+ mgs
          //  });
          //  this.clearData();
            //this.testchips =[];
       
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
      //   } 
      //   else {
      // //  if(!this.ProductPDFFile['size']) {
      //     this.Spinner = false;
      //     this.compacctToast.clear();
      //     this.compacctToast.add({
      //       key: "compacct-toast",
      //       severity: "error",
      //       summary: "Warn Message",
      //       detail: "Error Occured "
      //     });
      // }
    }
    else {
      //  if(!this.ProductPDFFile['size']) {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
      }
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
      "SP_String": "SP_Harbauer_Master_Product_Electrical",
      "Report_Name_String": "Browse_Master_Product_Electrical"
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
      this.GetEdit(this.productid);
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
      "SP_String": "SP_Harbauer_Master_Product_Electrical",
      "Report_Name_String": "Get_Master_Product_Electrical",
      "Json_Param_String": JSON.stringify(temobj)
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editList = data;
       //this.myDate = data[0].Date;
       this.ObjMasterProductel.Product_Type_ID = data[0].Product_Type_ID;
       this.GetProductSubType();
       this.ObjMasterProductel.Product_Sub_Type_ID = data[0].Product_Sub_Type_ID;
       this.ObjMasterProductel.Cat_ID = data[0].Cat_ID;
       this.ObjMasterProductel.Product_Description = data[0].Product_Description;
       this.ObjMasterProductel.MOC_ID = data[0].MOC_ID ? data[0].MOC_ID : undefined;
       this.ObjMasterProductel.Capacity_Size_ID = data[0].Capacity_Size_ID ? data[0].Capacity_Size_ID : undefined;
       this.ObjMasterProductel.Additional_Feature_ID_1 = data[0].Additional_Feature_ID_1;
       this.ObjMasterProductel.Additional_Feature_ID_2 = data[0].Additional_Feature_ID_2;
       this.ObjMasterProductel.Additional_Feature_ID_3 = data[0].Additional_Feature_ID_3;
       this.ObjMasterProductel.Additional_Feature_ID_4 = data[0].Additional_Feature_ID_4;
       this.ObjMasterProductel.Grade_ID = data[0].Grade_ID ? data[0].Grade_ID : undefined;
       this.ObjMasterProductel.Remarks = data[0].Remarks ? data[0].Remarks : undefined;
       this.ObjMasterProductel.HSN_NO = data[0].HSN_NO;
       this.ObjMasterProductel.GST_Percentage = data[0].GST_Percentage;
       this.ObjMasterProductel.UOM = data[0].UOM;
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
class MasterProductel{
   Product_Type_ID:number;
   Product_Sub_Type_ID:number;
   Cat_ID : number;
   Product_Description:string;
   MOC_ID:number;
   Capacity_Size_ID:number;
   Additional_Feature_ID_1 :number;
   Additional_Feature_ID_2 :number;
   Additional_Feature_ID_3 :number;
   Additional_Feature_ID_4 :number;
   Product_ID:number;
   Grade_ID	:number;
   Remarks	:string;
   HSN_NO:number;
   GST_Percentage:number;
   UOM:string;
  // Product_Mfg_Comp_ID:any;
   Product_Image:any;
 }
