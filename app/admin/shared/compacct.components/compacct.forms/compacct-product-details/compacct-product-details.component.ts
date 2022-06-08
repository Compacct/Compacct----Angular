import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { CompacctCommonApi } from "../../../compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/primeng';
declare var $: any;

@Component({
  selector: 'app-compacct-product-details',
  templateUrl: './compacct-product-details.component.html',
  styleUrls: ['./compacct-product-details.component.css'],
  providers: [MessageService],
})
export class CompacctProductDetailsComponent implements OnInit,OnChanges {
  ObjproductDetails = new product();
  productData = [];
  AllproductData = [];
  productSubData = [];
  AllproductSubData = [];
  ProDetailsFormSubmit = false;
  ProductTypeFormSubmitted = false;
  ProductSubTypeFormSubmitted = false;
  UOMTypeFormSubmitted = false;
  MaterialTypeName = undefined;
  ProductTypeName = undefined;
  ProductSubTypeName = undefined;
  ProTypeModal = false;
  ProTypeSubModal = false;
  viewProTypeModal = false;
  ViewSubProTypeModal = false;
  protypeid = undefined;
  protypesubid = undefined;
  is_Active = false;
  Is_View = false;
  Spinner = false;
  private _required: boolean;

  @Output() ProDetailsObj = new EventEmitter <product>();
  @Input() requirPro :any;

  constructor(
    private $CompacctAPI: CompacctCommonApi,
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
  ) { }

  ngOnInit() {
    this.getProductTyp();
  }
//Product Type
getProductTyp(){
  this.productData=[]; 
   this.AllproductData = [];
      const obj = {
       "SP_String": "SP_Master_Product_New",
       "Report_Name_String":"Master_Product_Type_Dropdown",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.productData = data;
      console.log("productData==",this.productData);
      this.productData.forEach((el : any) => {
          this.AllproductData.push({
           label: el.Product_Type,
           value: el.Product_Type_ID,
         });
      });
     })
}
ProTypePopup(){
  this.ProductTypeFormSubmitted = false;
  this.ProductTypeName = undefined;
  this.ProTypeModal = true;
  this.Spinner = false;
 }
CreateProductType(valid){
 this.ProductTypeFormSubmitted = true;
   if(valid){
      this.Spinner = true;
      const saveData = {
        Product_Type : this.ProductTypeName,
      }
       const obj = {
         "SP_String": "SP_Master_Product_New",
         "Report_Name_String" : "Master_Product_Type_Create ",
         "Json_Param_String": JSON.stringify([saveData])
     
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
           summary: "Product Type ID  " + tempID,
           detail: "Succesfully Created" //+ mgs
         });
         this.ProductTypeFormSubmitted = false;
         this.ProductTypeName = undefined;
         this.ProTypeModal = false;
         this.Spinner = false;
         this.getProductTyp();
     
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
ViewProductType(){
  this.productData = [];
   this.getProductTyp();
  setTimeout(() => {
    this.viewProTypeModal = true;
  }, 200);
}
deleteProductType(protype){
  this.protypeid = undefined;
  this.protypesubid = undefined;
  if(protype.Product_Type_ID){
  this.is_Active = false;
  this.Is_View = true;
    this.protypeid = protype.Product_Type_ID;
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
//Product Sub Type
getProductSubTyp(){
  if(this.ObjproductDetails.Product_Type_ID){
  this.productSubData=[]; 
   this.AllproductSubData = [];
    const obj = {
      "SP_String": "SP_Master_Product_New",
      "Report_Name_String":"Master_Product_Sub_Type_Dropdown",
      "Json_Param_String": JSON.stringify([{Product_Type_ID:this.ObjproductDetails.Product_Type_ID}]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.productSubData = data;
     console.log("productSubData==",this.productSubData);
     this.productSubData.forEach((el : any) => {
         this.AllproductSubData.push({
          label: el.Product_Sub_Type,
          value: el.Product_Sub_Type_ID ,
        });
     });
    })
    this.ProDetailsObj.emit(this.ObjproductDetails);
   }
   else{
    this.productSubData = [];
    this.ObjproductDetails.Product_Sub_Type_ID = undefined;

  }      
}
ViewProductSubType(){
  this.productSubData = [];
  this.getProductSubTyp();
  setTimeout(() => {
    this.ViewSubProTypeModal = true;
    }, 200);
}
CreateProductSubType(valid){
  this.ProductSubTypeFormSubmitted = true;
  if(valid){
    this.Spinner = true;
    const Obj = {
      Product_Sub_Type : this.ProductSubTypeName,
      Product_Type_ID : this.ObjproductDetails.Product_Type_ID
    }
    if(valid){
       const obj = {
         "SP_String": "SP_Master_Product_New",
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
           summary: "ProductSub_Type_ID  " + tempID,
           detail: "Succesfully Created" //+ mgs
         });
         this.ProductTypeFormSubmitted = false;
         this.ProductSubTypeName = undefined;
         this.ProTypeSubModal = false;
         this.Spinner = false;
         this.getProductSubTyp();
     
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
}
deleteProSubT(protypesub){
  this.protypesubid = undefined;
  this.protypeid = undefined
  if(protypesub.Product_Sub_Type_ID){
    this.is_Active = false;
    this.Is_View = true;
    this.protypesubid = protypesub.Product_Sub_Type_ID;
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
  this.ProTypeSubModal = true;
  this.Spinner = false;
}
EventEmitDefault(){
  this.ProDetailsObj.emit(this.ObjproductDetails);
}
//common Delete
onConfirm(){
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
    FunctionRefresh = 'getProductTyp';
  }
   if (this.protypesubid) {
    ReportName = "Delete_Product_Sub_Type"
    ObjTemp = {
      Product_Sub_Type_ID: this.protypesubid
    }
    FunctionRefresh = 'getProductSubTyp';
  }
    const obj = {
      "SP_String": "SP_Master_Product_New",
      "Report_Name_String" : ReportName,
      "Json_Param_String": JSON.stringify(ObjTemp),
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      var msg = data[0].Column1;
      if (data[0].Column1 || data[0].Column1==="Done") {
      this.onReject();
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
  }
onReject(){
  this.compacctToast.clear("c");
}
clear() {
  // this.VendorAddressLists = [];
  this.ObjproductDetails = new product();
}
ngOnChanges(changes: SimpleChanges) {
        
  //this.doSomething(changes.categoryId.currentValue);
  // You can also use categoryId.previousValue and 
  // categoryId.firstChange for comparing old and new values
  console.log("changes >>",changes);
  this.ProDetailsFormSubmit = changes.requirPro.currentValue
}
}
class product{
  Product_Type_ID	:number;	
  Product_Sub_Type_ID	:number;
  Product_Code : any;
  Product_Description : string;
  Rack_NO : any;
  }
