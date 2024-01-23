import { MessageService } from 'primeng/primeng';
import { CompacctGlobalApiService } from './../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from './../../../../shared/compacct.services/common.header.service';
import { CompacctCommonApi } from './../../../../shared/compacct.services/common.api.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CompacctProductDetailsComponent } from '../../../../shared/compacct.components/compacct.forms/compacct-product-details/compacct-product-details.component';
import { CompacctgstandcustomdutyComponent } from '../../../../shared/compacct.components/compacct.forms/compacctgstandcustomduty/compacctgstandcustomduty.component';
import { CompacctFinancialDetailsComponent } from '../../../../shared/compacct.components/compacct.forms/compacct.financial-details/compacct.financial-details.component';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-micl-wastage-master-product',
  templateUrl: './micl-wastage-master-product.component.html',
  styleUrls: ['./micl-wastage-master-product.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MiclWastageMasterProductComponent implements OnInit {
  tabIndexToView= 0;
  items:any = [];
  buttonname = "Create";
  menuList:any =[];
  WastageBrowseList:any = [];
  ProductTypeData:any =[];
  productSubTypeData:any=[];
  ObjWastageproduct: product =new product();
  ObjFinancialComponentData = new Financial();
  WastageProductFormSubmitted = false;
  isvisible =undefined
  Spinner = false;
  can_popup = false;
  act_popup = false;
  productCode : any ;
  masterProductId : any;
  masterProductIdActi : any;
  ProductTypeFormSubmitted = false;
  ProductTypeName = undefined;
  ProTypeModal = false;
  viewProTypeModal = false;
  ProTypeSubModal = false;
  ViewSubProTypeModal = false;
  ProductSubTypeFormSubmitted = false;
  CreateMocFormSubmitted = false;
  ProductSubTypeName = undefined;
  ProSubTypeModal = false;
  ProFeatureModal = false;
  ViewGradeModal = false;
  GradeFormSubmitted = false;
  GradeName = undefined;
  GradeModal = false;

  is_Active = false;
  Is_View = false;
  protypeid = undefined;
  protypesubid = undefined;
  mocid = undefined;
  capacityid = undefined;
  Profeatureid = undefined;
  gradeid = undefined;
  headerData = ""
  objCheckFinamcial:any = {};
  GstAndCustomFormSubmit = false;
  LAbelName = 'HSN Code';
  ObjFinancial:any = {};
  ObjGstandCustonDuty:any = {};
  objGst:any = {};
  objProductrequ:any = {};
  @ViewChild("Product", { static: false })
  ProductDetailsInput: CompacctProductDetailsComponent;
  @ViewChild("GstAndCustomDuty", { static: false })
  GstAndCustDutyInput: CompacctgstandcustomdutyComponent;
  @ViewChild("FinacialDetails", { static: false })
  FinacialDetailsInput: CompacctFinancialDetailsComponent;

  MaterialData:any = [];
  AllMaterialData:any = [];
  MaterialTypeFormSubmitted = false;
  MaterialTypeName: any;
  MatTypeModal = false;
  ViewMetTypeModal = false;
  EXCELSpinner:boolean = false;
  DescriptionCheck:any;

  ProDetailsFormSubmit = false;
  UomDataList:any = [];
  mfgData:any = [];
  ViewUomModal = false;
  UOMTypeFormSubmitted = false;
  UOMName: any;
  UOMCreateModal = false;
  Uomid: any;
  uomSpinner = false;
  DesModelSuggPopup = false;
  desmodellist:any = [];
  desmodellistDynamic:any = [];

  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header:CompacctHeader, 
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-product-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.getBrowseFinishProduct();
    this.getProductTyp();
    this.getAllUOM();
    this.mfgName();
    this.header.pushHeader({
      Header: "Wastage Master Product",
      Link: " Production Management -> Wastage Master Product"
    })
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  destroyChild() {
    if (this.GstAndCustDutyInput) {
      this.GstAndCustDutyInput.clear();
    }
    if (this.FinacialDetailsInput) {
      this.FinacialDetailsInput.clear();
    }
  }
  getBrowseFinishProduct(){
    const obj = {
      "SP_String":"SP_Production_Wastage_Master_Product",
      "Report_Name_String":"Browse_Wastage_Master_Product"
    }
  
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.WastageBrowseList = data;
      console.log("Browse data==",this.WastageBrowseList);
      });
}
exportexcel(Arr): void {
  this.EXCELSpinner =true
   let excelData:any = []
  Arr.forEach(ele => {
      excelData.push({
          // 'Material Type': ele.Material_Type,
          'Prodct Type': ele.Product_Type,
          'Product Sub Type': ele.Product_Sub_Type,
          'Product Description': ele.Product_Description,
          // 'MOC (Material of Cons.)': ele.MOC_Description,
          // 'Size/Capacity': ele.Capacity_Size_Desc,
          // 'Product Feature': ele.Product_Feature_Desc,
          // 'Grade': ele.Grade_Description,
          'Unit of Mesurement (UOM)': ele.UOM,
          'HSN Code': ele.HSN_NO,
          'Remarks': ele.Remarks,
          'GST %': ele.GST_Percentage,
          'Manufacture Name (Optional)': ele.Mfg_Company
          })
   });

 const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, 'Wastage_Master_Product.xlsx');
  this.EXCELSpinner = false
}
  //Product Type
getProductTyp(){
   this.ProductTypeData = [];
      const obj = {
       "SP_String": "SP_Production_Wastage_Master_Product",
       "Report_Name_String":"Get_Master_Product_Type",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length) {
          data.forEach(element => {
            element['label'] = element.Product_Type,
            element['value'] = element.Product_Type_ID
          });
          this.ProductTypeData = data;
        }
        else {
          this.ProductTypeData = [];
        }
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
  this.ProductTypeData = [];
   this.getProductTyp();
  setTimeout(() => {
    this.viewProTypeModal = true;
  }, 200);
}
deleteProductType(protype){
  this.protypeid = undefined;
  this.protypesubid = undefined;
  if(protype.Product_Type_ID){
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
getDesModelDetalis(){
  this.desmodellist = [];
  this.desmodellistDynamic = [];
  const tempobj = {
    Product_Type_ID : this.ObjWastageproduct.Product_Type_ID,
    Product_Sub_Type_ID : this.ObjWastageproduct.Product_Sub_Type_ID,
    Description_Like : this.ObjWastageproduct.Product_Description
  }
      const obj = {
       "SP_String": "SP_Harbauer_Master_Product_Civil",
       "Report_Name_String":"Get_Product_Suggestion",
       "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.desmodellist = data;
       if(this.desmodellist.length){
         this.desmodellistDynamic = Object.keys(data[0]);
       }
       this.CheckDescription();
      //  this.DesModelSuggPopup = true
      console.log("desmodellist==",this.desmodellist);
     })

 }
//Product Sub Type
getProductSubTyp(ProductTypeID,sub_Id?){
  if(ProductTypeID){
   this.productSubTypeData = [];
    const obj = {
      "SP_String": "SP_Production_Wastage_Master_Product",
      "Report_Name_String":"Get_Master_Product_Sub_Type",
      "Json_Param_String": JSON.stringify([{Product_Type_ID:ProductTypeID}]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     if(data.length) {
      data.forEach(element => {
        element['label'] = element.Product_Sub_Type,
        element['value'] = element.Product_Sub_Type_ID
      });
      this.productSubTypeData = data;
    }
    else {
      this.productSubTypeData = [];
    }
    })
    
   }
}
ViewProductSubType(){
  this.productSubTypeData = [];
  this.getProductSubTyp(this.ObjWastageproduct.Product_Type_ID);
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
      Product_Type_ID : this.ObjWastageproduct.Product_Type_ID
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
         this.getProductSubTyp(this.ObjWastageproduct.Product_Type_ID);
     
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
  if(protypesub.Product_Sub_Type_ID){
    this.protypesubid = protypesub.Product_Sub_Type_ID;
   // this.cnfrm2_popup = true;
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "p",
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
//product sub type Delete
onConfirmProSubtypedel(){
  // let ReportName = '';
  // let ObjTemp;
  // let FunctionRefresh;
    const obj = {
      "SP_String": "SP_Master_Product_New",
      "Report_Name_String" : "Delete_Product_Sub_Type",
      "Json_Param_String": JSON.stringify({Product_Sub_Type_ID: this.protypesubid}),
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      var msg = data[0].Column1;
      if (data[0].Column1 || data[0].Column1==="Done") {
        this.getProductSubTyp(this.ObjWastageproduct.Product_Type_ID);
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
  getGstAndCustDutyData(e) {
    console.log(e)
    this.ObjGstandCustonDuty = undefined;
    this.ObjWastageproduct.Cat_ID = undefined;
    this.ObjWastageproduct.HSN_NO = undefined;
    this.ObjWastageproduct.Custom_Duty = undefined;
    this.ObjWastageproduct.Remarks = undefined;
    if (e.Cat_ID) {
      this.ObjGstandCustonDuty = e;
      this.ObjWastageproduct.Cat_ID = e.Cat_ID;
      this.ObjWastageproduct.HSN_NO = e.HSN_NO
      this.ObjWastageproduct.Custom_Duty = e.Custom_Duty;
      this.ObjWastageproduct.Remarks = e.Remarks;
      this.ObjWastageproduct.RCM_Per = Number(e.RCM_Per)
      this.objGst.Cat_ID = e.Cat_ID;
      this.objGst.HSN_NO = e.HSN_NO;
    }
  }
  FinancialDetailsData(e) {
    console.log("FinancialDetailsData",e)
    // this.Objproduct.Can_Purchase = undefined;
    // this.Objproduct.Billable = undefined;
    // this.ObjFinancial = undefined;
   
    // this.Objproduct.Purchase_Ac_Ledger = undefined;
   
    // this.Objproduct.Sales_Ac_Ledger = undefined;
    // this.Objproduct.Purchase_Return_Ledger_ID = undefined;
    // this.Objproduct.Sales_Return_Ledger_ID = undefined;
    // this.Objproduct.Discount_Receive_Ledger_ID = undefined;
    // this.Objproduct.Discount_Given_Ledger_ID = undefined;
    if (e.Purchase_Ac_Ledger) {
      this.ObjFinancial = e;
      this.ObjWastageproduct.Can_Purchase = e.Can_Purchase;
      this.ObjWastageproduct.Billable = e.Billable;
      // this.PurchaseACFlag = e.PurchaseACFlag;
      this.ObjWastageproduct.Purchase_Ac_Ledger = e.Purchase_Ac_Ledger;
      // this.SalesACFlag = e.SalesACFlag;
      this.ObjWastageproduct.Sales_Ac_Ledger = e.Sales_Ac_Ledger;
      this.ObjWastageproduct.Purchase_Return_Ledger_ID = e.Purchase_Return_Ledger_ID;
      this.ObjWastageproduct.Sales_Return_Ledger_ID = e.Sales_Return_Ledger_ID;
      this.ObjWastageproduct.Discount_Receive_Ledger_ID = e.Discount_Receive_Ledger_ID;
      this.ObjWastageproduct.Discount_Given_Ledger_ID = e.Discount_Given_Ledger_ID;
      this.ObjWastageproduct.Input_RCM_Ledger_ID = e.Input_RCM_Ledger_ID;
      this.ObjWastageproduct.Output_RCM_Ledger_ID = e.Output_RCM_Ledger_ID;
      this.ObjWastageproduct.Input_CGST_RCM_Ledger_ID = e.Input_CGST_RCM_Ledger_ID;	
      this.ObjWastageproduct.Input_SGST_RCM_Ledger_ID = e.Input_SGST_RCM_Ledger_ID;
      this.ObjWastageproduct.Input_IGST_RCM_Ledger_ID = e.Input_IGST_RCM_Ledger_ID;
      this.ObjWastageproduct.Output_CGST_RCM_Ledger_ID = e.Output_CGST_RCM_Ledger_ID;
      this.ObjWastageproduct.Output_SGST_RCM_Ledger_ID = e.Output_SGST_RCM_Ledger_ID;
      this.ObjWastageproduct.Output_IGST_RCM_Ledger_ID = e.Output_IGST_RCM_Ledger_ID;
      this.objCheckFinamcial.Purchase_Ac_Ledger = e.Purchase_Ac_Ledger;
      this.objCheckFinamcial.Sales_Ac_Ledger = e.Sales_Ac_Ledger;
      this.objCheckFinamcial.Purchase_Return_Ledger_ID = e.Purchase_Return_Ledger_ID;
      this.objCheckFinamcial.Sales_Return_Ledger_ID = e.Sales_Return_Ledger_ID;
      this.objCheckFinamcial.Discount_Receive_Ledger_ID = e.Discount_Receive_Ledger_ID;
      this.objCheckFinamcial.Discount_Given_Ledger_ID = e.Discount_Given_Ledger_ID;
    }
  
  }

  //UOM
  getAllUOM(){
     this.UomDataList = [];
        const obj = {
         "SP_String": "SP_Master_Product_New",
         "Report_Name_String":"Get_Master_UOM_Data",
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data.length) {
          data.forEach(element => {
            element['label'] = element.UOM,
            element['value'] = element.UOM
          });
          this.UomDataList = data;
          // console.log("UomDataList==",this.UomDataList);
        }
        else {
          this.UomDataList = [];
        }
       })
  }
  ViewUomType(){
    this.UomDataList = [];
    this.getAllUOM();
    setTimeout(() => {
      this.ViewUomModal = true;
      }, 250);
  }
  ProUomPopup(){
    this.UOMTypeFormSubmitted = false;
    this.UOMName = undefined;
    this.UOMCreateModal = true;
    this.uomSpinner = false;
  }
  CreateUomType(valid){
    this.UOMTypeFormSubmitted = true;
      this.uomSpinner = true;
     
      if(valid){
         const tempSave = {
          UOM : this.UOMName,
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
           this.UOMName = undefined;
           this.UOMCreateModal = false;
           this.uomSpinner = false;
           this.getAllUOM();
       
           } else{
             this.uomSpinner = false;
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
        this.uomSpinner = false;
      }
  }
  deleteProUom(uom){
    this.Uomid = undefined;
    if(uom.UOM){
      this.Uomid = uom.UOM;
     // this.cnfrm2_popup = true;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "u",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
  }
  //uom Delete
onConfirmuomdel(){
    const obj = {
      "SP_String": "SP_Master_Product_New",
      "Report_Name_String" : "Delete_Master_UOM",
      "Json_Param_String": JSON.stringify({UOM: this.Uomid}),
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      var msg = data[0].Column1;
      if (data[0].Column1 || data[0].Column1==="Done") {
        this.getAllUOM();
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
  //Manufacture Name(Optional)
  mfgName(){
    const obj = {
      "SP_String":"SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String":"Get_Master_Product_mfg"
    }
  
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.mfgData = data;
      console.log("mfg data==",this.mfgData);
      });
  }
  clearData(){
    this.WastageProductFormSubmitted = false;
    this.ObjWastageproduct = new product();
    this.productCode = undefined;
    this.destroyChild();
   }
   onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("p");
    this.compacctToast.clear("u");
    this.compacctToast.clear("ia");
    this.compacctToast.clear("a");
  }

  CheckDescription(){
    const tempobj = {
      Product_Type_ID : this.ObjWastageproduct.Product_Type_ID,
      Product_Sub_Type_ID : this.ObjWastageproduct.Product_Sub_Type_ID,
      Description_Like : this.ObjWastageproduct.Product_Description
    }
    const objtemp = {
      Product_ID : this.ObjWastageproduct.Product_ID,
      Description_Like : this.ObjWastageproduct.Product_Description
    }
        const obj = {
         "SP_String": "SP_Harbauer_Master_Product_Civil",
         "Report_Name_String":this.buttonname === "Update" ? 'Check_Product_Description_On_Update' : 'Check_Product_Description',
         "Json_Param_String": this.buttonname === "Update" ? JSON.stringify([objtemp]) : JSON.stringify([tempobj])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.DescriptionCheck = data[0].Column1;
        console.log("DescriptionCheck==",this.DescriptionCheck);
       })
  
   }
  //Save Data
  SaveWastageData(valid:any){
  console.log("savedata==",this.ObjWastageproduct);
  console.log("valid",valid)
  this.WastageProductFormSubmitted = true;
  console.log("checkrequ",this.checkrequ(this.objCheckFinamcial,this.objGst))
  if(valid && this.checkrequ(this.objCheckFinamcial,this.objGst)){
    if(this.DescriptionCheck === "OK") { 
    console.log("productCode==",this.productCode);
    
    // var mocdes = this.materialCon.filter(item => Number(item.MOC_ID) === Number(this.Objproduct.MOC_ID))
    // const productFeatureFilter = this.productFetr.filter(el=>Number(el.Product_Feature_ID) === Number(this.Objproduct.Product_Feature_ID))
    // this.Objproduct.Product_Feature_Desc = productFeatureFilter.length ? productFeatureFilter[0].Product_Feature_Desc : undefined;
    // this.Objproduct.Product_Feature_Desc = Number(this.Objproduct.Product_Feature_ID)
    // this.Objproduct.MOC_Description = mocdes.length ? mocdes[0].MOC_Description : 0;
    // this.Objproduct.Product_ID = this.productCode ? this.productCode : 0
    
     let msg = this.productCode ? "Update" : "Create"
     const obj = {
         "SP_String": "SP_Production_Wastage_Master_Product",
         "Report_Name_String": this.productCode ? 'Wastage_Master_Product_Update' : 'Wastage_Master_Product_Create',
         "Json_Param_String": JSON.stringify([this.ObjWastageproduct]) 
        }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        console.log("data ==",data);
         if (data[0].Column1){
           this.compacctToast.clear();
           this.compacctToast.add({
            key: "compacct-toast",
             severity: "success",
            summary: "product Succesfully " +msg,
            detail: "Succesfully " +msg
          });
         this.Spinner = false;
         this.destroyChild();
         this.getBrowseFinishProduct();  
          this.productCode = undefined;
          this.tabIndexToView = 0;
          this.GstAndCustomFormSubmit = false;
          this.WastageProductFormSubmitted = false;
          this.ObjWastageproduct = new product();
        }
        else {
          this.Spinner = false;
             this.compacctToast.clear();
             this.compacctToast.add({
               key: "compacct-toast",
               severity: "error",
               summary: "Warn Message",
               detail: "Error Occured"
             });
        }
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

  //Edit
  EditProduct(product:any){
    this.productCode = undefined;
    if (product.Product_ID) {
      this.productCode = undefined;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.clearData();
      this.mfgName();
      this.productCode = product.Product_ID
      this.GetEditMasterProduct(product.Product_ID)
     }  
  }
  GetEditMasterProduct(uid){
    const tempobj = {
      Product_ID : this.productCode,
    }
    const obj = {
      "SP_String": "SP_Production_Wastage_Master_Product",
      "Report_Name_String": "Get_Wastage_Master_Product",
      "Json_Param_String": JSON.stringify([tempobj]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("Edit data==",data);
       this.ObjWastageproduct = data[0];
       this.getDesModelDetalis();
       this.ObjFinancialComponentData = data[0];
      //  this.ProductDetailsInput.EditProductDetalis(data[0].Product_Type_ID,data[0].Product_Sub_Type_ID,data[0].Product_Description,data[0].Product_Code,data[0].Rack_NO)

       //this.FinacialDetailsInput.EditFinalcial(JSON.stringify(data))
       this.GstAndCustDutyInput.GetEdit(JSON.stringify(data))
       console.log("data",data)
       this.ObjWastageproduct.Product_Type_ID = data[0].Product_Type_ID;
       this.getProductSubTyp(this.ObjWastageproduct.Product_Type_ID);
       // this.ProductDetailsInput.getProductSubTyp();
       this.ObjWastageproduct.Product_Sub_Type_ID = data[0].Product_Sub_Type_ID;
      //  this.Objproduct.Product_Code = data[0].Product_Code;
      //  this.Objproduct.Product_Description = data[0].Product_Description;
      //  this.Objproduct.Rack_NO = data[0].Rack_NO;
      //  this.Objproduct.UOM = data[0].UOM;
       
       
       });
   }
   // Active And Inactive
   InactiveProduct(obj){
    this.masterProductId = undefined ;
    if(obj.Product_ID){
      this.Is_View = true;
      this.masterProductId = obj.Product_ID ;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "ia",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
 }
 onConfirmInactive(){
  // console.log(this.Objproduct.Product_ID)
    if(this.masterProductId){
      const obj = {
        "SP_String": "SP_Harbauer_Master_Product_Electrical",
        "Report_Name_String": "InActive_Master_Product",
        "Json_Param_String": JSON.stringify([{Product_ID : this.masterProductId}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log("del Data===", data[0].Column1)
        if (data[0].Column1 === "Done"){
          this.onReject();
          this.getBrowseFinishProduct();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Product Id: " + this.masterProductId.toString(),
            detail: "Succesfully Inactivated"
          });
        }
      })
    }
    //this.ParamFlaghtml = undefined;
 }

Active(masterProduct){ 
  this.masterProductIdActi = undefined;
   if(masterProduct.Product_ID){
    this.is_Active = true;
     this.masterProductIdActi = masterProduct.Product_ID ;
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "a",
       sticky: true,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
   }
}
   onConfirmActive(){
    // console.log(this.Objproduct.Product_ID)
      if(this.masterProductId){
        const obj = {
          "SP_String": "SP_Harbauer_Master_Product_Electrical",
          "Report_Name_String": "Active_Master_Product",
          "Json_Param_String": JSON.stringify([{Product_ID : this.masterProductIdActi}])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          // console.log("del Data===", data[0].Column1)
          if (data[0].Column1 === "Done"){
            this.onReject();
            this.getBrowseFinishProduct();
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

}
class product{
  Material_ID:number;
  Material_Type = "NA";
  Product_Code:any;			
  Product_Description	:any;	
  Cat_ID:number;				
  Product_Mfg_Comp_ID:number;
  UOM:any;					
  MOC_ID:number;	
  MOC_Description : any;	
  Is_Visiable:any;			
  Remarks:any;				
  Product_Type_ID:number;
  Product_Feature_ID:number;	
  Product_Sub_Type_ID:any;	
  HSN_NO:any;					
  Capacity_Size_ID:any;
  Product_ID:number; 
  Product_Feature_Desc:any;
  Grade_ID:any;
  Grade_Description:any;
  GST_Percentage:any;
  Mfg_Company:any;
  Rack_NO :any;
  HSN_Code:any;	
  Custom_Duty:any;
  Can_Purchase : boolean;
  Billable : boolean;
  Purchase_Ac_Ledger:any;
  Sales_Ac_Ledger:any;
  Purchase_Return_Ledger_ID:any;
  Sales_Return_Ledger_ID:any;
  Discount_Receive_Ledger_ID:any;
  Discount_Given_Ledger_ID:any;
  Input_RCM_Ledger_ID:any
  Output_RCM_Ledger_ID:any
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
  Input_RCM_Ledger_ID:any
  Output_RCM_Ledger_ID:any
  Input_CGST_RCM_Ledger_ID:any;	
  Input_SGST_RCM_Ledger_ID:any;
  Input_IGST_RCM_Ledger_ID:any;
  Output_CGST_RCM_Ledger_ID:any;
  Output_SGST_RCM_Ledger_ID:any;
  Output_IGST_RCM_Ledger_ID:any;
}
