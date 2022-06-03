import { Dropdown } from 'primeng/components/dropdown/dropdown';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FileUpload, MessageService } from 'primeng/primeng';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None

})
export class ProductMasterComponent implements OnInit {
  items = [];
  menuList =[];
  tabIndexToView= 0;
  AllData =[];
  buttonname = "Create";
  Objproduct: product =new product();
  MaterialData = [];
  AllMaterialData = [];
  gstData = [];
  AllgstlData = [];
  productData= [];
  AllproductData = [];
  productSubData = [];
  AllproductSubData = [];
  UOMData =[];
  AllUomData = [];
  PurchaseData=[]; 
  AllPurchaseData = [];
  SalesData=[]; 
  AllSalesData = [];
  PrData=[]; 
  AllPr = [];
  SalesReturn=[];
  AllSalesR = []; 
  DiscountData=[]; 
  AllReceiveData = [];
  GivenData=[]; 
  MfgData=[]; 
  AllMfgData = [];
  PDFFlag = false;
  PDFViewFlag = false;
  materialPDFLink = undefined;
  AllDiscountData = [];
  AllVendorLedger=[];
  VendorledgerList = [];
  SelectedVendorLedger = [];
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
  act_popup = false;
  mettypeid = undefined;
  protypeid = undefined;
  protypesubid = undefined;
  Uomid = undefined;
  CheckifService = false;
  check =undefined
  ObjGstandCustonDuty : any;
  GstAndCustomFormSubmit = false;


  
  
 
  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;
  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header:CompacctHeader, 
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    public $CompacctAPI: CompacctCommonApi,
  ) { }

ngOnInit() {
    this.items = ["BROWSE", "CREATE","REPORT"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-product-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.header.pushHeader({
      Header: "Product Master",
      Link: " MICL ->Product-Master"
    })
    this.check = "Product"
    this.getBrowseProduct();
    this.getMaterialTyp();
    this.getGSTTyp();
    this.getProductTyp();
    this.getUOM();
    this.getMfg();
    this.getPurchaseledger();
    this.getSalesledger();
    this.getPrReturn();
    this.getSubLedger();
    this.getSalesReturn();
    this.getDiscountReceive();
    this.getDiscountGiven();
    }
TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE","REPORT"];
    this.buttonname = "Create";
    
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

ChangeValue(){
  //console.log("check",this.CheckifService)
 if(this.CheckifService){
   this.check ="Service"
 }
 else{
   this.check = "Product"
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
   this.AllUomData = [];
      const obj = {
       "SP_String": "SP_Master_Product_New",
       "Report_Name_String":"Get_Master_UOM_Data",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.UOMData = data;
      console.log("UOMData==",this.UOMData);
       this.UOMData.forEach((el : any) => {
         this.AllUomData.push({
           label: el.UOM,
           value: el.UOM_Id
           
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
CreateUomType(valid){
  this.UOMTypeFormSubmitted = true;
  if(valid){
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
ChangeUom(){
  if(this.Objproduct.UOM){
    var uomname = this.UOMData.filter(item => item.UOM_Id === this.Objproduct.UOM)
  this.Objproduct.Alt_UOM = uomname[0].UOM ;
  }
  else 
  {
    this.Objproduct.Alt_UOM = undefined;
  }
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

getPurchaseledger(){
  this.PurchaseData=[]; 
   this.AllPurchaseData = [];
      const obj = {
       "SP_String": "SP_Master_Product_New",
       "Report_Name_String":"Get_Purchase_AC_Ledger",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.PurchaseData = data;
      console.log("PurchaseData==",this.PurchaseData);
       this.PurchaseData.forEach((el : any) => {
         this.AllPurchaseData.push({
           label: el.Ledger_Name,
           value: el.Ledger_ID,
           
         });
       });
     })
}

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

saveData(valid:any){
  console.log("savedata==",this.Objproduct);
  console.log("valid",valid)
  this.MaterialFormSubmit = true;
  if(valid){
    console.log("productCode==",this.productCode);
    
    // var mocdes = this.materialCon.filter(item => Number(item.MOC_ID) === Number(this.Objproduct.MOC_ID))
    // const productFeatureFilter = this.productFetr.filter(el=>Number(el.Product_Feature_ID) === Number(this.Objproduct.Product_Feature_ID))
    // this.Objproduct.Product_Feature_Desc = productFeatureFilter.length ? productFeatureFilter[0].Product_Feature_Desc : undefined;
    // this.Objproduct.Product_Feature_Desc = Number(this.Objproduct.Product_Feature_ID)
    // this.Objproduct.MOC_Description = mocdes.length ? mocdes[0].MOC_Description : 0;
    // this.Objproduct.Product_ID = this.productCode ? this.productCode : 0
    
     let msg = this.productCode ? "Update" : "Create"
     const obj = {
         "SP_String": "SP_Master_Product_New",
         "Report_Name_String": this.productCode ? 'Update_Master_Product' : 'Create_Master_Product',
         "Json_Param_String": JSON.stringify([{...this.Objproduct,...this.ObjGstandCustonDuty}]) 
        }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        console.log("data ==",data);
         if (data[0].Column1){
          this.SelectedVendorLedger = [];
           this.compacctToast.clear();
           this.compacctToast.add({
            key: "compacct-toast",
             severity: "success",
            summary: "product Succesfully " +msg,
            detail: "Succesfully " +msg
          });
           }
         this.Spinner = false;
          this.getBrowseProduct();
          this.productCode = undefined;
          this.tabIndexToView = 0;
          this.MaterialFormSubmit = false;
          this.GstAndCustomFormSubmit = false;
          this.Objproduct = new product();
         });
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
  if (this.mettypeid) {
    ReportName = "Delete_Product_Material_Type"
    ObjTemp = {
      Material_ID: this.mettypeid
    }
    FunctionRefresh = 'getMaterialTyp'
  }
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
  if (this.Uomid) {
    ReportName = "Delete_Master_UOM"
    ObjTemp = {
      UOM: this.Uomid
   }
    FunctionRefresh = 'getUOM'
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
          this.getPurchaseledger();
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
Active(masterProduct){ 
  this.Is_View = false; 
  this.masterProductId = undefined ;
   if(masterProduct.Product_ID){
    this.is_Active = true;
     this.masterProductId = masterProduct.Product_ID ;
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

onReject(){
  this.compacctToast.clear("c");
}
}
class product{
Material_ID:number;	
Material_Type	:any;	
Is_Service: any = 1;		
Product_Code:any;	
Rack_NO	:any;		
Product_Description:any;	
Cat_ID:number;	
Product_Mfg_Comp_ID:number;	
Product_Type_ID	:number;	
Product_Sub_Type_ID	:number;
Maintain_Serial_No:any;
UOM		:any;	
Alt_UOM	:any;		
Billable:any;			
Can_Purchase:any;	
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

}
