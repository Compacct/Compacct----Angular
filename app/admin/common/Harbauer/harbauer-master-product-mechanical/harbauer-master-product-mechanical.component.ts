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

  BrowseList = [];
  editList = [];
  productid: any;

  PDFViewFlag = false;
  PDFFlag = false;
  ProductPDFFile:any = {};
  ProductPDFLink = undefined;
  tempDocumentArr = [];

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
     this.GetProductSubType();
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
     this.GetBrowseList();
     this.PDFViewFlag = false;
     if (this.PDFViewFlag === false) {
      this.fileInput.clear();
    }
  
  }
  onConfirm(){}
  onReject(){}
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
  GetProductSubType(){
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String": "Get_Master_Product_Sub_Type"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.ProductSubTypeList = data;
     console.log('ProductSubTypeList ==', this.ProductSubTypeList)
  
    });
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
  GetMake(){
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String": "Get_Master_Product_mfg"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.MakeList = data;
     console.log('MakeList ==', this.MakeList)
  
    });
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
    if(valid && this.productid){
      const Obj = {
        Product_ID  : this.productid,
        // Product_Code : this.ObjMachineMaster.Product_Model,
        // Product_Description : this.ObjMachineMaster.Product_Description,
        // Product_Mfg_Comp_ID : this.ObjMachineMaster.Manufacturer
      }
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_mechanical",
           "Report_Name_String" : "Master_Product_Mech_Update",
           "Json_Param_String": JSON.stringify([{...Obj,...this.ObjMasterProductm}])
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           var tempID = data[0].Column1;
           this.upload(data[0].Column1);
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Return_ID  " + tempID,
             detail: "Succesfully Updated" //+ mgs
           });
           this.clearData();
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
        } 
        else {
      this.Spinner = true;
      this.MasterProductmFormSubmitted = true;
      // const Obj = {
      //   Product_Code : this.ObjMachineMaster.Product_Model,
      //   Product_Description : this.ObjMachineMaster.Product_Description,
      //   Product_Mfg_Comp_ID : this.ObjMachineMaster.Manufacturer
      // }
      if(valid && this.ProductPDFFile['size']){
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_mechanical",
           "Report_Name_String" : "Master_Product_Mech_Create",
           "Json_Param_String": JSON.stringify([this.ObjMasterProductm])
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           this.ObjMasterProductm.Product_ID = data[0].Column1;
           if(data[0].Column1){
            this.upload(data[0].Column1);
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
        if(!this.ProductPDFFile['size']) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Validation",
            detail: "No Docs Selected"
          });
      }
    }
  }
  async upload(id){
    const formData: FormData = new FormData();
        formData.append("aFile", this.ProductPDFFile)
        formData.append("Product_ID", id);
    let response = await fetch('/Harbauer_Master_Product_mechanical/Upload_Doc',{ 
                  method: 'POST',
                  body: formData // This is your file object
                });
    let responseText = await response.text();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: 'Return_ID : ' + this.ObjMasterProductm.Product_ID,
        detail: "Succesfully Saved "
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
    if (masterproducrM.Product_ID) {
      this.productid = masterproducrM.Product_ID
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.clearData();
      this.GetEdit(this.productid);
    }
  }
  GetEdit(masterproducrM){
    this.editList = [];
    //this.ProductionFormSubmitted = false;
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String": "Get_Master_Product_Mech",
      "Json_Param_String": JSON.stringify([{Product_ID  : this.productid}])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editList = data;
       //this.myDate = data[0].Date;
       this.ObjMasterProductm.Product_Type_ID = data[0].Product_Type_ID;
       this.ObjMasterProductm.Product_Sub_Type_ID = data[0].Product_Sub_Type_ID;
       this.ObjMasterProductm.Cat_ID = data[0].Cat_ID;
       this.ObjMasterProductm.Product_Description = data[0].Product_Description;
       this.ObjMasterProductm.MOC_ID = data[0].MOC_ID;
       this.ObjMasterProductm.Capacity_Size_ID = data[0].Capacity_Size_ID;
       this.ObjMasterProductm.Product_Feature_ID = data[0].Product_Feature_ID;
       this.ObjMasterProductm.Grade_ID = data[0].Grade_ID;
       this.ObjMasterProductm.Remarks = data[0].Remarks;
       this.ObjMasterProductm.HSN_NO = data[0].HSN_NO;
       this.ObjMasterProductm.GST_Percentage = data[0].GST_Percentage;
       this.ObjMasterProductm.UOM = data[0].UOM;
       this.ObjMasterProductm.Product_Mfg_Comp_ID = data[0].Product_Mfg_Comp_ID;
       this.PDFViewFlag = data[0].Product_Image ? true : false;
       this.ProductPDFLink = data[0].Product_Image
      ? data[0].Product_Image
      : undefined;
      console.log("this.editList  ===",this.editList);
  
  })
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
   Product_Mfg_Comp_ID:number;
   Product_Image:any;
 }
