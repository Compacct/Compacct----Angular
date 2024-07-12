import { Dropdown } from 'primeng/components/dropdown/dropdown';
import { HttpClient } from '@angular/common/http';
import { Component,Input, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FileUpload, MessageService } from 'primeng/primeng';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
declare var $: any;
import { CompacctProductDetailsComponent } from '../../../shared/compacct.components/compacct.forms/compacct-product-details/compacct-product-details.component';
import { CompacctgstandcustomdutyComponent } from '../../../shared/compacct.components/compacct.forms/compacctgstandcustomduty/compacctgstandcustomduty.component';
import { CompacctFinancialDetailsComponent } from "../../../shared/compacct.components/compacct.forms/compacct.financial-details/compacct.financial-details.component";
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None

})
export class ProductMasterComponent implements OnInit {
  items:any = [];
  menuList:any =[];
  tabIndexToView= 0;
  AllData:any =[];
  buttonname = "Create";
  Objproduct: product =new product();
  ObjFinancialComponentData = new Financial();
  MaterialData:any = [];
  AllMaterialData:any = [];
  gstData:any = [];
  AllgstlData:any = [];
  productData:any= [];
  AllproductData:any = [];
  productSubData:any = [];
  AllproductSubData:any = [];
  UOMData:any =[];
  UomDataList:any = [];
  AllUOMData:any = [];
  AllUomDataList:any = [];
  PurchaseData:any=[]; 
  AllPurchaseData:any = [];
  SalesData:any=[]; 
  AllSalesData:any = [];
  PrData:any=[]; 
  AllPr:any = [];
  SalesReturn:any=[];
  AllSalesR:any= []; 
  DiscountData:any=[]; 
  AllReceiveData:any = [];
  GivenData:any=[]; 
  MfgData:any=[]; 
  AllMfgData:any = [];
  PDFFlag = false;
  PDFViewFlag = false;
  materialPDFLink = undefined;
  AllDiscountData:any = [];
  AllVendorLedger:any=[];
  VendorledgerList:any = [];
  SelectedVendorLedger:any = [];
  Spinner = false;
  MaterialFormSubmit =false;
  materialId = undefined;
  MaterialTypeFormSubmitted = false;
  ProductTypeFormSubmitted = false;
  ProductSubTypeFormSubmitted = false;
  UOMTypeFormSubmitted = false;
  MaterialTypeName = undefined;
  ProductTypeName = undefined;
  ProductSubTypeName = undefined;
  UOMTypeName = undefined;
  MatTypeModal = false;
  ProTypeModal = false;
  ProTypeSubModal = false;
  UOMTypeModal = false;
  ViewMetTypeModal = false;
  viewProTypeModal = false;
  ViewSubProTypeModal = false;
  ViewUomModal = false;
  MaterialPDFFile = {};
  productCode : number ;
  masterProductId : number;
  is_Active = false;
  Is_View = false;
  mettypeid = undefined;
  protypeid = undefined;
  protypesubid = undefined;
  Uomid = undefined;
  CheckifService = false;
  check =undefined
  ObjGstandCustonDuty : any;
  GstAndCustomFormSubmit = false;
  ObjproductDetails : any;
  ObjFinancial: any;
  objCheckFinamcial:any = {};
  objGst:any = {};
  objProductrequ:any = {};
  hsnSac = "HSN"
  @ViewChild("Product", { static: false })
  ProductDetailsInput: CompacctProductDetailsComponent;
  @ViewChild("GstAndCustomDuty", { static: false })
  GstAndCustDutyInput: CompacctgstandcustomdutyComponent;
  @ViewChild("FinacialDetails", { static: false })
  FinacialDetailsInput: CompacctFinancialDetailsComponent;
  LAbelName = 'HSN Code';

  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;
  PurchaseACFlag: any;
  SalesACFlag: any;
  productid = undefined;
  EditList = [];
  deactivateid = undefined;
  can_popup = false;
  activeid = undefined;
  act_popup = false;
  SubCatFilter = [];
  headerData = ""
  EXCELSpinner:boolean = false
  DescriptionCheck:any;
  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header:CompacctHeader, 
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute, ) {
    this.route.queryParams.subscribe(params => {
      console.log(params);
     this.headerData = params['header'];
      console.log ("headerData",this.headerData);
     })
  }

ngOnInit() {
    this.items = ["BROWSE", "CREATE","REPORT"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-product-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.header.pushHeader({
      Header: this.headerData,
      Link: " MICL ->"+this.headerData
    })
    this.check = "Product"
    this.getBrowseProduct();
    this.getMaterialTyp();
    this.getGSTTyp();
    this.getProductTyp();
    this.getUOM();
    this.getAllUOM();
    this.getMfg();
    // this.getPurchaseledger();
    // this.getSalesledger();
    // this.getPrReturn();
    this.getSubLedger();
    // this.getSalesReturn();
    // this.getDiscountReceive();
    // this.getDiscountGiven();
    this.Objproduct.Rate_Form_Quote = "N";
    this.Objproduct.Sale_Rate_Form_Quote = "N";
    }
TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE","REPORT"];
    this.buttonname = "Create";
    this.destroyChild();
    this.productid = undefined;
    this.clearData();
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
    console.log("Product Detalis",e)
   if (e.Product_Type_ID) {
      this.ObjproductDetails = e;
      this.Objproduct.Product_Type_ID = e.Product_Type_ID;
      this.Objproduct.Product_Sub_Type_ID = e.Product_Sub_Type_ID;
      this.Objproduct.Product_Code = e.Product_Code;
      this.Objproduct.Product_Description = e.Product_Description;
      this.Objproduct.Rack_NO = e.Rack_NO;
      this.objProductrequ.Product_Type_ID = e.Product_Type_ID;
      this.objProductrequ.Product_Sub_Type_ID = e.Product_Sub_Type_ID;
      this.objProductrequ.Product_Description = e.Product_Description;
        this.CheckDescription();
    }
    console.log("Product Detalis In master",this.Objproduct)
  }
  getGstAndCustDutyData(e) {
    console.log(e)
    this.ObjGstandCustonDuty = undefined;
    this.Objproduct.Cat_ID = undefined;
    this.Objproduct.HSN_Code = undefined;
    this.Objproduct.Custom_Duty = undefined;
    this.Objproduct.Remarks = undefined;
    if (e.Cat_ID) {
      this.ObjGstandCustonDuty = e;
      this.Objproduct.Cat_ID = e.Cat_ID;
      if (this.CheckifService) {
      this.Objproduct.HSN_NO = e.HSN_NO;
      }
      else {
        this.Objproduct.HSN_NO = e.HSN_NO;
      }
      this.Objproduct.Custom_Duty = e.Custom_Duty;
      this.Objproduct.Remarks = e.Remarks;
      this.Objproduct.RCM_Per = Number(e.RCM_Per)
      this.objGst.Cat_ID = e.Cat_ID;
      this.objGst.HSN_NO = e.HSN_NO;
    }
  }
  FinancialDetailsData(e) {
    console.log("FinancialDetailsData",e)
  
    if (e.Purchase_Ac_Ledger) {
      this.ObjFinancial = e;
      this.Objproduct.Can_Purchase = e.Can_Purchase;
      this.Objproduct.Billable = e.Billable;
      this.Objproduct.Purchase_Ac_Ledger = e.Purchase_Ac_Ledger;
      this.Objproduct.Sales_Ac_Ledger = e.Sales_Ac_Ledger;
      this.Objproduct.Purchase_Return_Ledger_ID = e.Purchase_Return_Ledger_ID;
      this.Objproduct.Sales_Return_Ledger_ID = e.Sales_Return_Ledger_ID;
      this.Objproduct.Discount_Receive_Ledger_ID = e.Discount_Receive_Ledger_ID;
      this.Objproduct.Discount_Given_Ledger_ID = e.Discount_Given_Ledger_ID;
      this.Objproduct.Input_RCM_Ledger_ID = e.Input_RCM_Ledger_ID;
      this.Objproduct.Output_RCM_Ledger_ID = e.Output_RCM_Ledger_ID;
      this.Objproduct.Input_CGST_RCM_Ledger_ID = e.Input_CGST_RCM_Ledger_ID;	
      this.Objproduct.Input_SGST_RCM_Ledger_ID = e.Input_SGST_RCM_Ledger_ID;
      this.Objproduct.Input_IGST_RCM_Ledger_ID = e.Input_IGST_RCM_Ledger_ID;
      this.Objproduct.Output_CGST_RCM_Ledger_ID = e.Output_CGST_RCM_Ledger_ID;
      this.Objproduct.Output_SGST_RCM_Ledger_ID = e.Output_SGST_RCM_Ledger_ID;
      this.Objproduct.Output_IGST_RCM_Ledger_ID = e.Output_IGST_RCM_Ledger_ID;
      this.objCheckFinamcial.Purchase_Ac_Ledger = e.Purchase_Ac_Ledger;
      this.objCheckFinamcial.Sales_Ac_Ledger = e.Sales_Ac_Ledger;
      this.objCheckFinamcial.Purchase_Return_Ledger_ID = e.Purchase_Return_Ledger_ID;
      this.objCheckFinamcial.Sales_Return_Ledger_ID = e.Sales_Return_Ledger_ID;
      this.objCheckFinamcial.Discount_Receive_Ledger_ID = e.Discount_Receive_Ledger_ID;
      this.objCheckFinamcial.Discount_Given_Ledger_ID = e.Discount_Given_Ledger_ID;
    }
  
  }

ChangeValue(){
  //console.log("check",this.CheckifService)
 if(this.CheckifService){
   this.check ="Service"
   this.hsnSac = "SAC"
 }
 else{
   this.check = "Product"
   this.hsnSac = "HSN"
 }
}
//Material Type 
getMaterialTyp(){
  this.MaterialData=[]; 
   this.AllMaterialData = [];
      const obj = {
       "SP_String": "SP_Master_Product_New",
       "Report_Name_String":"Get_Product_Material_Type_Data",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.MaterialData = data;
      console.log("MaterialData==",this.MaterialData);
       this.MaterialData.forEach(el => {
         this.AllMaterialData.push({
           label: el.Material_Type,
           value: el.Material_ID,
         });
       });
     })
}
MaterialChange() {
  this.Objproduct.Material_Type =undefined;
if(this.Objproduct.Material_ID) {
  const ctrl = this;
  const MaterialObj = $.grep(ctrl.MaterialData,function(item) {return item.Material_ID == ctrl.Objproduct.Material_ID})[0];
  // console.log(MaterialObj);
  this.Objproduct.Material_Type = MaterialObj.Material_Type;

}
}
MatTypePopup (){
  this.MaterialTypeFormSubmitted = false;
  this.MaterialTypeName = undefined;
  this.MatTypeModal = true;
  this.Spinner = false;
}
CreateMaterialType(valid){
  this.MaterialTypeFormSubmitted = true;
  //console.log(valid)
   if(valid){
      this.Spinner = true;
      const saveData = {
        Material_Type : this.MaterialTypeName,
      }
       const obj = {
         "SP_String": "SP_Master_Product_New",
         "Report_Name_String" : "Add_Product_Material_Type ",
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
           summary: "Material Type ID  " + tempID,
           detail: "Succesfully Created" //+ mgs
         });
         this.MaterialTypeFormSubmitted = false;
         this.MaterialTypeName = undefined;
         this.MatTypeModal = false;
         this.Spinner = false;
         this.getMaterialTyp();
     
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
  if((getArrValue.length === 2) && (tempHSNString.length === 6 || tempHSNString.length === 8)){
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
ViewMaterialType (){
  this.MaterialData = [];
   this.getMaterialTyp();
  setTimeout(() => {
    this.ViewMetTypeModal = true;
  }, 200);
}
deleteMaterialType(mettype){
  //console.log("view delete")
  this.mettypeid = undefined;
  this.protypeid = undefined
  this.protypesubid = undefined;
  this.Uomid = undefined;
  if(mettype.Material_ID){
  this.is_Active = false;
  this.Is_View = true;
    this.mettypeid = mettype.Material_ID;
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
//GST Dropdown
getGSTTyp(){
  this.gstData=[]; 
   this.AllgstlData = [];
      const obj = {
       "SP_String": "SP_Master_Product_New",
       "Report_Name_String":"GST_Category_Dropdown",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.gstData = data;
      console.log("gstData==",this.gstData);
       this.gstData.forEach((el : any) => {
         this.AllgstlData.push({
           label: el.Cat_Name,
           value: el.Cat_ID,
         });
       });
     })
}
//MFG
getMfg(){
  this.MfgData=[]; 
   this.AllMfgData = [];
      const obj = {
       "SP_String": "SP_Master_Product_New",
       "Report_Name_String":"Get_Mfg_Master_Product",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.MfgData = data;
      console.log("MfgData==",this.MfgData);
      this.MfgData.forEach((el : any) => {
          this.AllMfgData.push({
           label: el.Mfg_Company,
           value: el.Product_Mfg_Comp_ID,
         });
      });
     })
}
GetMfgProCode(){
  this.Objproduct.Mfg_Product_Code = undefined;
  if(this.Objproduct.Product_Mfg_Comp_ID){
    var mfgproductcode = this.MfgData.filter(item => item.Product_Mfg_Comp_ID === this.Objproduct.Product_Mfg_Comp_ID)
  this.Objproduct.Mfg_Product_Code = mfgproductcode[0].Product_Mfg_Comp_ID ;
  }
  else 
  {
    this.Objproduct.Mfg_Product_Code = undefined;
  }
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
  this.mettypeid = undefined;
  this.protypesubid = undefined;
  this.Uomid = undefined;
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
  if(this.Objproduct.Product_Type_ID){
  this.productSubData=[]; 
   this.AllproductSubData = [];
    const obj = {
      "SP_String": "SP_Master_Product_New",
      "Report_Name_String":"Master_Product_Sub_Type_Dropdown",
      "Json_Param_String": JSON.stringify([{Product_Type_ID:this.Objproduct.Product_Type_ID}]) 
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
   }
   else{
    this.productSubData = [];
    this.Objproduct.Product_Sub_Type_ID = undefined;

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
      Product_Type_ID : this.Objproduct.Product_Type_ID
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
  this.mettypeid = undefined;
  this.protypeid = undefined
  this.Uomid = undefined;
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
//Uom
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
ChangeUom(){
  this.Objproduct.Alt_UOM = undefined;
  if(this.Objproduct.UOM){
    var uomname:any = this.AllUOMData.filter((item :any) => item.UOM === this.Objproduct.UOM)
  this.Objproduct.Alt_UOM = uomname[0].UOM ;
  }
  else 
  {
    this.Objproduct.Alt_UOM = undefined;
  }
}
ViewUomType(){
  this.UOMData = [];
  this.getUOM();
  setTimeout(() => {
    this.ViewUomModal = true;
    }, 200);
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
ProUomPopup(){
   this.UOMTypeFormSubmitted = false;
   this.UOMTypeName = undefined;
   this.UOMTypeModal = true;
   this.Spinner = false;
}

getSubLedger(){
  this.AllVendorLedger=[]; 
  this.VendorledgerList = [];
  const obj = {
    "SP_String": "SP_Master_Product_New",
    "Report_Name_String":"Get_Sub_Ledger_Category",
   }
   this.GlobalAPI.getData(obj)
   .subscribe((data : any)=>
   {
     this.AllVendorLedger = data;
     console.log('AllVendorLedger=',this.AllVendorLedger);
     this.AllVendorLedger.forEach(el => {
      this.VendorledgerList.push({
        label: el.Sub_Ledger_Cat_Name,
        value: el.Sub_Ledger_Cat_ID
      });
    });
    
   });
}

// getPurchaseledger(){
//   this.PurchaseData=[]; 
//    this.AllPurchaseData = [];
//       const obj = {
//        "SP_String": "SP_Master_Product_New",
//        "Report_Name_String":"Get_Purchase_AC_Ledger",
//       }
//       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
//        this.PurchaseData = data;
//       console.log("PurchaseData==",this.PurchaseData);
//        this.PurchaseData.forEach((el : any) => {
//          this.AllPurchaseData.push({
//            label: el.Ledger_Name,
//            value: el.Ledger_ID,
           
//          });
//        });
//      })
// }

getSalesledger(){
  this.SalesData=[]; 
   this.AllSalesData = [];
      const obj = {
       "SP_String": "SP_Master_Product_New",
       "Report_Name_String":"Get_Sales_AC_Ledger",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.SalesData = data;
      console.log("SalesData==",this.SalesData);
        this.SalesData.forEach((el : any) => {
          this.AllSalesData.push({
            label: el.Ledger_Name,
           value: el.Ledger_ID,
           
         });
        });
     })
}

getPrReturn(){
  this.PrData=[]; 
   this.AllPr = [];
      const obj = {
       "SP_String": "SP_Master_Product_New",
       "Report_Name_String":"Get_Purchase_AC_Ledger",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.PrData = data;
      console.log("PrData==",this.PrData);
        this.PrData.forEach((el : any) => {
          this.AllPr.push({
            label: el.Ledger_Name,
            value: el.Ledger_ID,
           
         });
        });
     })
}

getSalesReturn(){
  this.SalesReturn=[]; 
   this.AllSalesR = [];
      const obj = {
       "SP_String": "SP_Master_Product_New",
       "Report_Name_String":"Get_Sales_AC_Ledger",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.SalesReturn = data;
      console.log("SalesReturn==",this.SalesReturn);
        this.SalesReturn.forEach((el : any) => {
          this.AllSalesR.push({
            label: el.Ledger_Name,
           value: el.Ledger_ID,
           
         });
        });
     })
}

getDiscountReceive(){
  this.DiscountData=[]; 
   this.AllReceiveData = [];
      const obj = {
       "SP_String": "SP_Master_Product_New",
       "Report_Name_String":"Get_Discount_Receive_Ledger",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.DiscountData = data;
      console.log("DiscountDataRec==",this.DiscountData);
        this.DiscountData.forEach((el : any) => {
          this.AllReceiveData.push({
            label: el.Ledger_Name,
           value: el.Ledger_ID,
           
         });
        });
     })
}

getDiscountGiven(){
  this.GivenData=[]; 
   this.AllDiscountData = [];
      const obj = {
       "SP_String": "SP_Master_Product_New",
       "Report_Name_String":"Get_Discount_Given_Ledger",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.GivenData = data;
      console.log("DataDiscount==",this.GivenData);
        this.GivenData.forEach((el : any) => {
          this.AllDiscountData.push({
            label: el.Ledger_Name,
           value: el.Ledger_ID,
           
         });
        });
     })
}
CheckDescription(){
  const tempobj = {
    Product_Type_ID : this.Objproduct.Product_Type_ID,
    Product_Sub_Type_ID : this.Objproduct.Product_Sub_Type_ID,
    Description_Like : this.Objproduct.Product_Description
  }
  const objtemp = {
    Product_ID : this.Objproduct.Product_ID,
    Description_Like : this.Objproduct.Product_Description
  }
      const obj = {
       "SP_String": "SP_Harbauer_Master_Product_Civil",
       "Report_Name_String":this.buttonname === "Update" ? 'Check_Product_Description_On_Update' : 'Check_Product_Description',
       "Json_Param_String": this.buttonname === "Update" ? JSON.stringify([objtemp]) : JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.DescriptionCheck = data[0].Column1;
      console.log("DescriptionCheck==",this.DescriptionCheck);
      // if(this.DescriptionCheck === "OK") {
      //   this.saveData(true);
      // }
      // else {
      //   this.Spinner = false;
      //      this.compacctToast.clear();
      //      this.compacctToast.add({
      //        key: "compacct-toast",
      //        severity: "error",
      //        summary: "Warn Message",
      //        detail: "Description already exists."
      //      });
      // }
     })

 }
saveData(valid:any){
  console.log("savedata==",this.Objproduct);
  console.log("valid",valid)
  this.MaterialFormSubmit = true;
  // console.log("this.Objproduct",this.Objproduct)
  // this.destroyChild();
  if(valid && this.checkrequ(this.objCheckFinamcial,this.objGst,this.objProductrequ)){
    if(this.DescriptionCheck === "OK") { 
    console.log("buttonname==",this.buttonname);
    
    // var mocdes = this.materialCon.filter(item => Number(item.MOC_ID) === Number(this.Objproduct.MOC_ID))
    // const productFeatureFilter = this.productFetr.filter(el=>Number(el.Product_Feature_ID) === Number(this.Objproduct.Product_Feature_ID))
    // this.Objproduct.Product_Feature_Desc = productFeatureFilter.length ? productFeatureFilter[0].Product_Feature_Desc : undefined;
    // this.Objproduct.Product_Feature_Desc = Number(this.Objproduct.Product_Feature_ID)
    // this.Objproduct.MOC_Description = mocdes.length ? mocdes[0].MOC_Description : 0;
    // this.Objproduct.Product_ID = this.productCode ? this.productCode : 0
    this.Objproduct.Is_Service = this.CheckifService;
    this.Objproduct.Sub_Ledger_Cat_IDS = this.SelectedVendorLedger.toString();
    
     let msg = this.buttonname === "Update" ? "Update" : "Create"
     const obj = {
         "SP_String": "SP_Master_Product_New",
         "Report_Name_String": this.buttonname === "Update" ? 'Update_Master_Product' : 'Create_Master_Product',
         "Json_Param_String": JSON.stringify([{...this.Objproduct}]) 
        }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        console.log("data ==",data);
         if (data[0].Column1){
          this.SelectedVendorLedger = [];
          this.items = ["BROWSE", "CREATE","REPORT"];
           this.compacctToast.clear();
           this.compacctToast.add({
            key: "compacct-toast",
             severity: "success",
            summary: "product Succesfully " +msg,
            detail: "Succesfully " +msg
          });
           }
         this.Spinner = false;
         this.destroyChild();
          this.getBrowseProduct();
          this.productCode = undefined;
          if (this.buttonname === "Update") {
            this.tabIndexToView = 0;
          }
          this.MaterialFormSubmit = false;
          this.GstAndCustomFormSubmit = false;
          this.Objproduct = new product();
          this.CheckifService = false;
         });
        }
         else {
          this.Spinner = false;
             this.compacctToast.clear();
             this.compacctToast.add({
               key: "compacct-toast",
               severity: "error",
               summary: "Warn Message",
               detail: "Description already exists."
             });
        }
     }
     else{
       console.error("Somthing Wrong")
     }    
   }
//common Delete
onConfirm(){
  this.is_Active = false;
  this.Is_View = true;
  let ReportName = '';
  let ObjTemp;
  let FunctionRefresh;
  let secondfuntionrefresh;
  if (this.mettypeid) {
    ReportName = "Delete_Product_Material_Type"
    ObjTemp = {
      Material_ID: this.mettypeid
    }
    FunctionRefresh = 'getMaterialTyp'
  }
  // if (this.protypeid) {
  //   ReportName = "Delete_Master_Product_Type"
  //   ObjTemp = {
  //     Product_Type_ID: this.protypeid
  //   }
  //   FunctionRefresh = 'getProductTyp';
  // }
  //  if (this.protypesubid) {
  //   ReportName = "Delete_Product_Sub_Type"
  //   ObjTemp = {
  //     Product_Sub_Type_ID: this.protypesubid
  //   }
  //   FunctionRefresh = 'getProductSubTyp';
  // }
  if (this.Uomid) {
    ReportName = "Delete_Master_UOM"
    ObjTemp = {
      UOM: this.Uomid
   }
    FunctionRefresh = 'getUOM'
    secondfuntionrefresh = 'getAllUOM'
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
  }

onConfirm2(){
  console.log(this.Objproduct.Product_ID)
    if(this.masterProductId){
      const obj = {
        "SP_String": "SP_Master_Product_New",
        "Report_Name_String": "Active_Master_Product",
        "Json_Param_String": JSON.stringify([{Product_ID : this.masterProductId}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log("del Data===", data[0].Column1)
        if (data[0].Column1 === "Done"){
          this.onReject();
          this.getBrowseProduct();
          this.getMaterialTyp();
          this.getGSTTyp();
          this.getProductTyp();
          this.getUOM();
          this.getMfg();
         // this.getPurchaseledger();
          this.getSalesledger();
          this.getPrReturn();
          this.getSubLedger();
          this.getSalesReturn();
          this.getDiscountReceive();
          this.getDiscountGiven();
          this.act_popup = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Product Id: " + this.masterProductId.toString(),
            detail: "Succesfully Activated"
          });
        }
      })
    }
    //this.ParamFlaghtml = undefined;
}
// Active(masterProduct){ 
//   this.Is_View = false; 
//   this.masterProductId = undefined ;
//    if(masterProduct.Product_ID){
//     this.is_Active = true;
//      this.masterProductId = masterProduct.Product_ID ;
//      this.compacctToast.clear();
//      this.compacctToast.add({
//        key: "c",
//        sticky: true,
//        severity: "warn",
//        summary: "Are you sure?",
//        detail: "Confirm to proceed"
//      });
//    }
// }

// File Upload
  FetchPDFFile(event) {
    this.PDFFlag = false;
    this.MaterialPDFFile = {};
    if (event) {
      this.MaterialPDFFile = event.files[0];
      this.PDFFlag = true;
      this.PDFViewFlag = false;
    }
  }

clearData(){
  this.MaterialFormSubmit = false;
   this.Objproduct = new product();
   this.materialId = undefined;
   this.SelectedVendorLedger = [];  
}

getBrowseProduct(){
  const obj = {
    "SP_String":"SP_Master_Product_New",
    "Report_Name_String":"Browse_Master_Product"
  }
   this.GlobalAPI.getData(obj)
   .subscribe((data:any)=>{
    this.AllData = data;
    console.log("Browse data==",this.AllData);
    });
}
EditProduct(data){
  this.clearData();
  this.productid = undefined;
  if (data.Product_ID) {
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE","REPORT"];
    this.buttonname = "Update";
    this.productid = data.Product_ID;
    this.GetEditData();
  }
}
GetEditData(){
  this.EditList = [];
  const obj = {
    "SP_String":"SP_Master_Product_New",
    "Report_Name_String":"Get_Master_Product",
    "Json_Param_String": JSON.stringify([{Product_ID : this.productid}])
  }
   this.GlobalAPI.getData(obj)
   .subscribe((data:any)=>{
    this.EditList = data;
    this.Objproduct = data[0];
    this.ObjFinancialComponentData = data[0];
    this.ProductDetailsInput.EditProductDetalis(data[0].Product_Type_ID,data[0].Product_Sub_Type_ID,data[0].Product_Description,data[0].Product_Code,data[0].Rack_NO)
     
    //this.FinacialDetailsInput.EditFinalcial(JSON.stringify(data))
    this.GstAndCustDutyInput.GetEdit(JSON.stringify(data))
    console.log("data",data)
    console.log("EditList data==",this.EditList);
    this.CheckifService = data[0].Is_Service;
    this.Objproduct.Material_ID = data[0].Material_ID;
    this.Objproduct.Material_Type = data[0].Material_Type;

    this.Objproduct.Product_Type_ID = data[0].Product_Type_ID;
    // this.ProductDetailsInput.getProductSubTyp();
    this.Objproduct.Product_Sub_Type_ID = data[0].Product_Sub_Type_ID;
    this.Objproduct.Product_Code = data[0].Product_Code;
    this.Objproduct.Product_Description = data[0].Product_Description;
    this.Objproduct.Rack_NO = data[0].Rack_NO;

    this.Objproduct.Product_Mfg_Comp_ID = data[0].Product_Mfg_Comp_ID;
    this.Objproduct.Mfg_Product_Code = data[0].Mfg_Product_Code;
    this.Objproduct.UOM = data[0].UOM;
    this.Objproduct.Alt_UOM = data[0].Alt_UOM;
    this.Objproduct.Reorder_Level = data[0].Reorder_Level;
    this.Objproduct.Cust_Wrnty = data[0].Cust_Wrnty;
    this.Objproduct.Vendor_Wrnty = data[0].Vendor_Wrnty;
    this.Objproduct.BARCODE_COUNT = data[0].BARCODE_COUNT;
    this.Objproduct.Purchase_Rate = data[0].Purchase_Rate;
    this.Objproduct.Sale_rate = data[0].Sale_rate;
    this.Objproduct.Rate_Form_Quote = data[0].Rate_Form_Quote;
    this.Objproduct.Sale_Rate_Form_Quote = data[0].Sale_Rate_Form_Quote;

    setTimeout(() => {
      var subCatids = data[0].Sub_Ledger_Cat_IDS;
    var SubCatArray = subCatids.split(',');
    console.log("SubCatArray",SubCatArray)
    let DSubCat = [];
    SubCatArray.forEach((item) => {
      const subcat = this.AllVendorLedger.filter(el => el.Sub_Ledger_Cat_ID === Number(item))
      if (DSubCat.indexOf(subcat) === -1) {
        DSubCat.push(subcat[0].Sub_Ledger_Cat_ID);
        this.SelectedVendorLedger = [...DSubCat]
        //  this.SelectedVendorLedger.push(subcat[0].Sub_Ledger_Cat_ID);
      }
    });
    }, 200);
    
    this.Objproduct.Product_Expiry = data[0].Product_Expiry;

    this.Objproduct.Can_Purchase = data[0].Can_Purchase;
    this.Objproduct.Billable = data[0].Billable;
    this.Objproduct.Purchase_Ac_Ledger = data[0].Purchase_Ac_Ledger;
    this.Objproduct.Sales_Ac_Ledger = data[0].Sales_Ac_Ledger;
    this.Objproduct.Purchase_Return_Ledger_ID = data[0].Purchase_Return_Ledger_ID;
    this.Objproduct.Sales_Return_Ledger_ID = data[0].Sales_Return_Ledger_ID;
    this.Objproduct.Discount_Receive_Ledger_ID = data[0].Discount_Receive_Ledger_ID;
    this.Objproduct.Discount_Given_Ledger_ID = data[0].Discount_Given_Ledger_ID;

    });
}
Deactivate(deactive){
  this.act_popup = false;
  this.Is_View = false;
  this.is_Active = false;
  this.deactivateid = undefined ;
  if(deactive.Product_ID){
    this.can_popup = true;
    this.deactivateid = deactive.Product_ID ;
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
onConfirm3(){ 
  if(this.deactivateid){
    const obj = {
      "SP_String": "SP_Master_Product_New",
      "Report_Name_String": "Deactive_Master_Product",
      "Json_Param_String": JSON.stringify([{Product_ID : this.deactivateid}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("del Data===", data[0].Column1)
      if (data[0].Column1 === "Done"){

        this.onReject();
        this.getBrowseProduct();
       this.can_popup = false;
       this.deactivateid = undefined ;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Tax Id: " + this.deactivateid.toString(),
          detail: "Succesfully Deactivated"
        });
       }
    })
  }
 // this.ParamFlaghtml = undefined;
}
Active(masterTax){
this.can_popup = false;
this.Is_View = false;
this.is_Active = false;
this.activeid = undefined ;
 if(masterTax.Product_ID){
  this.act_popup = true;
   this.activeid = masterTax.Product_ID ;
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
onConfirm4(){
  if(this.activeid){
    const obj = {
      "SP_String": "SP_Master_Product_New",
      "Report_Name_String": "Active_Master_Product",
      "Json_Param_String": JSON.stringify([{Product_ID : this.activeid}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("del Data===", data[0].Column1)
      if (data[0].Column1 === "Done"){
        this.onReject();
        this.getBrowseProduct();
        this.act_popup = false;
        this.activeid = undefined ;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Tax Id: " + this.activeid.toString(),
          detail: "Succesfully Activated"
        });
      }
    })
  }
  //this.ParamFlaghtml = undefined;
}
onReject(){
  this.compacctToast.clear("c");
}
sendJson(data){
  return JSON.parse(JSON.stringify(data))
 }
 exportexcel(Arr): void {
  this.EXCELSpinner =true
   let excelData:any = []
  Arr.forEach(ele => {
      excelData.push({
          'Material Type': ele.Material_Type,
          'Product Code': ele.Product_Code,
          'Product Type': ele.Product_Type,
          'Product Sub Type': ele.Product_Sub_Type,
          'Manufacturer': ele.Product_Manufacturing_Group,
          'Product Description': ele.Product_Description,
          'GST Category': ele.GST_Tax_Per,
          'HSN Code': ele.HSN_Code,
          })
   });

 const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, 'master_product.xlsx');
  this.EXCELSpinner = false
}
}
class product{
Material_ID:number;	
Material_Type	:any;	
Is_Service: any;		
Product_Code:any;	
Product_Description:string;
Rack_NO	:any;			
Cat_ID:number;	
Product_Mfg_Comp_ID:number;	
Product_Type_ID	:number;	
Product_Sub_Type_ID	:number;
Maintain_Serial_No:any;
UOM		:any;	
Alt_UOM	:any;		
Billable:boolean;			
Can_Purchase:boolean;	
Reorder_Level:number = 0;	
Cust_Wrnty:number = 0;		
Vendor_Wrnty:number = 0;
BARCODE_COUNT	:number = 0;
Sale_rate:number = 0;		
Purchase_Rate:number = 0;	
Rate_Form_Quote:any;	
Sale_Rate_Form_Quote:any;
Mfg_Product_Code:any;		
Product_Expiry:any;	
Remarks	:any;		
Product_Brochure:any;		
Sales_Ac_Ledger:any;	
Purchase_Ac_Ledger:any;	
Sales_Return_Ledger_ID:number;	
Purchase_Return_Ledger_ID	:number;
Custom_Duty	:any;
Discount_Receive_Ledger_ID:number;	
Discount_Given_Ledger_ID:number;	
Cess_Percentage	:any;
HSN_Code:any;		
SAC_Code:any;
Product_ID :number;
Sub_Ledger_Cat_IDS:any;
HSN_NO:any;
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