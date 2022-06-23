import { MessageService } from 'primeng/primeng';
import { CompacctGlobalApiService } from './../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from './../../../shared/compacct.services/common.header.service';
import { CompacctCommonApi } from './../../../shared/compacct.services/common.api.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CompacctProductDetailsComponent } from '../../../shared/compacct.components/compacct.forms/compacct-product-details/compacct-product-details.component';
import { CompacctgstandcustomdutyComponent } from '../../../shared/compacct.components/compacct.forms/compacctgstandcustomduty/compacctgstandcustomduty.component';
import { CompacctFinancialDetailsComponent } from '../../../shared/compacct.components/compacct.forms/compacct.financial-details/compacct.financial-details.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-master-product-general-consumables',
  templateUrl: './master-product-general-consumables.component.html',
  styleUrls: ['./master-product-general-consumables.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MasterProductGeneralConsumablesComponent implements OnInit {
  tabIndexToView= 0;
  items = [];
  buttonname = "Create";
  menuList=[];
  AllData = [];
  productData =[];
  productSubData =[];
  sizeData =[];
  materialCon =[];
  catgData =[];
  mfgData =[];
  productFetr =[];
  gradeTyp =[];
  Objproduct: product =new product();
  ObjFinancialComponentData = new Financial();
  ProductFormSubmitted = false;
  isvisible =undefined
  Spinner = false;
  can_popup = false;
  act_popup = false;
  productCode : number ;
  masterProductId : number;
  ProductTypeFormSubmitted = false;
  ProductTypeName = undefined;
  ProTypeModal = false;
  ViewProTypeModal = false;
  ViewProSubTModal = false;
  ProductSubTypeFormSubmitted = false;
  CreateMocFormSubmitted = false;
  ProductSubTypeName = undefined;
  ProSubTypeModal = false;
  ViewMocModal= false;
  MaterialofCons = undefined;
  CreateMocModal = false;
  CapacityFormSubmitted = false;
  CapacityName = undefined;
  CapacityModal = false;
  ViewCapacityModal = false;
  ViewProFeatureModal = false;
  ProFeatureFormSubmitted = false;
  ProFeature = undefined;
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
  ObjproductDetails : any;
  ObjGstandCustonDuty : any;
  ObjFinancial: any;
  UOMData=[]; 
  UomDataList = [];
  ViewUomModal = false;
  UOMTypeFormSubmitted = false;
  UOMTypeName = undefined;
  UOMTypeModal = false;
  mettypeid = undefined;
  Uomid = undefined;
  AllUOMData = [];
  AllUomDataList = [];
  objGst:any = {};
  objProductrequ:any = {};
  @ViewChild("Product", { static: false })
  ProductDetailsInput: CompacctProductDetailsComponent;
  @ViewChild("GstAndCustomDuty", { static: false })
  GstAndCustDutyInput: CompacctgstandcustomdutyComponent;
  @ViewChild("FinacialDetails", { static: false })
  FinacialDetailsInput: CompacctFinancialDetailsComponent;

  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header:CompacctHeader, 
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {
      console.log(params);
     this.headerData = params['header'];
      console.log ("headerData",this.headerData);
     })
   }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-product-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.getBrowseProduct();
    //this.getProductTyp();
    this.getProductSize();
    this.getCatgData();
    this.mfgName();
    this.getMaterialCon();
    this.getProductFetr();
    this.getgradeTyp();
    this.getUOM();
    this.getAllUOM();
    this.header.pushHeader({
      Header: this.headerData,
      Link: " MICL -> "+this.headerData
    })
 
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
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
    console.log(e)
    this.ObjproductDetails = undefined;
    this.Objproduct.Product_Type_ID = undefined;
    this.Objproduct.Product_Sub_Type_ID = undefined;
    this.Objproduct.Product_Code = undefined;
    this.Objproduct.Product_Description = undefined;
    this.Objproduct.Rack_NO = undefined;

    if (e.Product_Type_ID) {
      this.ObjproductDetails = e;
      this.Objproduct.Product_Type_ID = e.Product_Type_ID;
      this.Objproduct.Product_Sub_Type_ID = e.Product_Sub_Type_ID;
      this.Objproduct.Product_Code = Number(e.Product_Code);
      this.Objproduct.Product_Description = e.Product_Description;
      this.Objproduct.Rack_NO = e.Rack_NO;
      this.objProductrequ.Product_Type_ID = e.Product_Type_ID;
      this.objProductrequ.Product_Sub_Type_ID = e.Product_Sub_Type_ID;
      this.objProductrequ.Product_Description = e.Product_Description;
    }
  }
  getGstAndCustDutyData(e) {
    console.log(e)
    this.ObjGstandCustonDuty = undefined;
    this.Objproduct.Cat_ID = undefined;
    this.Objproduct.HSN_NO = undefined;
    this.Objproduct.Custom_Duty = undefined;
    this.Objproduct.Remarks = undefined;
    if (e.Cat_ID) {
      this.ObjGstandCustonDuty = e;
      this.Objproduct.Cat_ID = e.Cat_ID;
      this.Objproduct.HSN_NO = e.HSN_NO
      this.Objproduct.Custom_Duty = e.Custom_Duty;
      this.Objproduct.Remarks = e.Remarks;
      this.Objproduct.RCM_Per = Number(e.RCM_Per)
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
      this.Objproduct.Can_Purchase = e.Can_Purchase;
      this.Objproduct.Billable = e.Billable;
      // this.PurchaseACFlag = e.PurchaseACFlag;
      this.Objproduct.Purchase_Ac_Ledger = e.Purchase_Ac_Ledger;
      // this.SalesACFlag = e.SalesACFlag;
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
  //Browse Api Data
  getBrowseProduct(){
      const obj = {
        "SP_String":"SP_General_Consumables",
        "Report_Name_String":"Browse_Master_Product_General_Consumables"
      }
    
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        this.AllData = data;
        console.log("Browse data==",this.AllData);
        });
  }
  //Product Typ
  getProductTyp(){
    const obj = {
      "SP_String":"SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String":"Get_Master_Product_Type"
    }
  
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.productData = data;
    
      console.log("Product Typ==",this.productData);
      });
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
          Sub_Ledger_Cat_IDS : 0
        }
         const obj = {
           "SP_String": "SP_Harbauer_Master_Product_mechanical",
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
      this.ViewProTypeModal = true;
    }, 200);
  }
  deleteProductType(protype){
    console.log("view delete")
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.Profeatureid = undefined;
    this.gradeid = undefined;
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
  //Sub Product Typ
  getProductSubTyp(){
    if(this.Objproduct.Product_Type_ID){
       this.productSubData = [];
      const obj = {
        "SP_String":"SP_Harbauer_Master_Product_mechanical",
        "Report_Name_String":"Get_Master_Product_Sub_Type",
        "Json_Param_String": JSON.stringify([{Product_Type_ID : this.Objproduct.Product_Type_ID}])
      }
    
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        this.productSubData = data;
        console.log("ProductSub Typ==",this.productSubData);
        });
    }
    else{
      this.productSubData = [];
    }
 
  }
  ViewProductSubType(){
    this.productSubData = [];
    this.getProductSubTyp();
    setTimeout(() => {
      this.ViewProSubTModal = true;
      }, 200);
  }
  CreateProductSubType(valid){
    this.ProductSubTypeFormSubmitted = true;
    this.Spinner = true;
      const Obj = {
        Product_Sub_Type : this.ProductSubTypeName,
        Product_Type_ID : this.Objproduct.Product_Type_ID
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
             summary: "Product_Type_ID  " + tempID,
             detail: "Succesfully Created" //+ mgs
           });
           this.ProductTypeFormSubmitted = false;
           this.ProductSubTypeName = undefined;
           this.ProSubTypeModal = false;
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
  deleteProSubT(protypesubid){
    
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.Profeatureid = undefined;
    this.gradeid = undefined;
    if(protypesubid.Product_Sub_Type_ID){
      this.is_Active = false;
      this.Is_View = true;
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
  //Material con.
  getMaterialCon(){
    const obj = {
      "SP_String":"SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String":"Get_Master_Product_Mech_MOC_Data"
    }
  
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.materialCon = data;
      console.log("material Con==",this.materialCon);
      });
  }
  ViewMoc(){
    this.materialCon = [];
    this.getMaterialCon();
    setTimeout(() => {
      this.ViewMocModal = true;
      }, 200);
  }
  deleteMoc(mocid){
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.Uomid = undefined;
    this.Profeatureid = undefined;
    this.gradeid = undefined;
    if(mocid.MOC_ID){
      this.is_Active = false;
      this.Is_View = true;
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
             summary: "MOC_ID  " + tempID,
             detail: "Succesfully Created" //+ mgs
           });
           this.CreateMocFormSubmitted = false;
           this.MaterialofCons = undefined;
           this.CreateMocModal = false;
           this.Spinner = false;
           this.getMaterialCon();
       
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
  //Product Feature
  getProductFetr(){
    const obj = {
      "SP_String":"SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String":"Get_Master_Product_Mech_Product_Feature_Data"
    }
  
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.productFetr = data;
      console.log("product Fetr==",this.productFetr);
      });
  }
  ViewProFeature(){
    this.productFetr = [];
 this.getProductFetr();
    setTimeout(() => {
    this.ViewProFeatureModal = true;
    }, 200);
  }
  deleteProFeature(Profeatureid){
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.Profeatureid = undefined;
    this.gradeid = undefined;
    if(Profeatureid.Product_Feature_ID){
      this.is_Active = false;
      this.Is_View = true;
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
           this.getProductFetr();
       
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
  //Grade
  getgradeTyp(){
    const obj = {
      "SP_String":"SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String":"Get_Master_Product_Mech_Grade_Data"
    }
  
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.gradeTyp = data;
       console.log("grade Typ==",this.gradeTyp);
      });
  }
  ViewGrade(){
    this.gradeTyp = [];
    this.getgradeTyp();
    setTimeout(() => {
      this.ViewGradeModal = true;
    }, 200);
  }
  deleteGrade(gradeid){
    
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.Uomid = undefined;
    this.Profeatureid = undefined;
    this.gradeid = undefined;
    if(gradeid.Grade_ID){
      this.is_Active = false;
      this.Is_View = true;
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
           this.getgradeTyp();
       
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
  //Product Size/capacity
  getProductSize(){
    const obj = {
      "SP_String":"SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String":"Get_Master_Product_Mech_Capacity_Size_Data"
    }
  
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.sizeData = data;
      console.log("Size Typ==",this.sizeData);
      });
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
           this.getProductSize();
       
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
  ViewCapacity(){
    this.sizeData = [];
    this.getProductSize();
    setTimeout(() => {
      this.ViewCapacityModal = true;
    }, 200);
  }
  deleteCapacity(capacityid){
    this.protypeid = undefined;
    this.protypesubid = undefined;
    this.mocid = undefined;
    this.capacityid = undefined;
    this.Profeatureid = undefined;
    this.Uomid = undefined;
    this.gradeid = undefined;
    if(capacityid.Capacity_Size_ID){
      this.is_Active = false;
    this.Is_View = true;
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
  //Product Category
  getCatgData(){
    const obj = {
      "SP_String":"SP_Harbauer_Master_Product_mechanical",
      "Report_Name_String":"Get_Master_Product_Category"
    }
  
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.catgData = data;
      console.log("catg Typ==",this.catgData);
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
    this.ProductFormSubmitted = false;
    this.Objproduct = new product();
    this.productCode = undefined;
    this.destroyChild();
   }
  
   //Save Data
saveData(valid:any){
    console.log("savedata==",this.Objproduct);
    console.log("valid",valid)
    this.ProductFormSubmitted = true;
    if(valid && this.checkrequ(this.objCheckFinamcial,this.objGst,this.objProductrequ)){
      console.log("productCode==",this.productCode);
      
      // var mocdes = this.materialCon.filter(item => Number(item.MOC_ID) === Number(this.Objproduct.MOC_ID))
      // const productFeatureFilter = this.productFetr.filter(el=>Number(el.Product_Feature_ID) === Number(this.Objproduct.Product_Feature_ID))
      // this.Objproduct.Product_Feature_Desc = productFeatureFilter.length ? productFeatureFilter[0].Product_Feature_Desc : undefined;
      // this.Objproduct.Product_Feature_Desc = Number(this.Objproduct.Product_Feature_ID)
      // this.Objproduct.MOC_Description = mocdes.length ? mocdes[0].MOC_Description : 0;
      // this.Objproduct.Product_ID = this.productCode ? this.productCode : 0
      
       let msg = this.productCode ? "Update" : "Create"
       const obj = {
           "SP_String": "SP_General_Consumables",
           "Report_Name_String": this.productCode ? 'Master_Product_General_Consumables_Update' : 'Master_Product_General_Consumables_Create',
           "Json_Param_String": JSON.stringify([this.Objproduct]) 
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
             }
           this.Spinner = false;
           this.destroyChild();
           this.getBrowseProduct();  
            this.productCode = undefined;
            this.tabIndexToView = 0;
            this.GstAndCustomFormSubmit = false;
            this.ProductFormSubmitted = false;
            this.Objproduct = new product();
           });
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
        }
    
      }
     if(Gst){
      let getArrValue = Object.values(Gst);
      if(getArrValue.length === 2 && this.objGst.HSN_NO.length === 6){
        falg = true
      }
      else {
        falg = false
      }
     }
     if(product){
      let getArrValue = Object.values(product);
      if(getArrValue.length === 3){
        falg = true
      }
      else {
        falg = false
      }
     }
    return falg
    }
  onReject(){
  this.compacctToast.clear("c");
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
     // this.getProductTyp();
      this.getProductSize();
      this.getCatgData();
      this.mfgName();
      this.getMaterialCon();
      this.getProductFetr();
      this.getgradeTyp();
      this.productCode = product.Product_ID
      this.GetEditMasterProduct(product.Product_ID)
     }  
  }
  GetEditMasterProduct(uid){
    const tempobj = {
      Product_ID : this.productCode,
    }
    const obj = {
      "SP_String": "SP_General_Consumables",
      "Report_Name_String": "Get_Master_Product_General_Consumables",
      "Json_Param_String": JSON.stringify([tempobj]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("Edit data==",data);
       this.Objproduct = data[0];
       this.ObjFinancialComponentData = data[0];
       this.ProductDetailsInput.EditProductDetalis(data[0].Product_Type_ID,data[0].Product_Sub_Type_ID,data[0].Product_Description,data[0].Product_Code,data[0].Rack_NO)

       //this.FinacialDetailsInput.EditFinalcial(JSON.stringify(data))
       this.GstAndCustDutyInput.GetEdit(JSON.stringify(data))
       console.log("data",data)
       this.Objproduct.Product_Type_ID = data[0].Product_Type_ID;
       // this.ProductDetailsInput.getProductSubTyp();
       this.Objproduct.Product_Sub_Type_ID = data[0].Product_Sub_Type_ID;
       this.Objproduct.Product_Code = data[0].Product_Code;
       this.Objproduct.Product_Description = data[0].Product_Description;
       this.Objproduct.Rack_NO = data[0].Rack_NO;
       this.Objproduct.UOM = data[0].UOM;
       
       
       });
   }
  //Delete
  DeleteProduct(masterProduct){
    this.is_Active = false; 
    this.masterProductId = undefined ;
    if(masterProduct.Product_ID){
      this.Is_View = true;
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
 //common Delete
 onConfirm(){
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
  //   FunctionRefresh = 'getProductTyp'
 // }
  // if (this.protypesubid) {
  //   ReportName = "Delete_Product_Sub_Type"
  //   ObjTemp = {
  //     Product_Sub_Type_ID: this.protypesubid
  //   }
  //   FunctionRefresh = 'getProductSubTyp';
  // }
  if (this.mocid) {
    SPString = "SP_Harbauer_Master_Product_mechanical"
    ReportName = "Delete_Master_Product_Mech_MOC_Data"
    ObjTemp = {
      MOC_ID: this.mocid
    }
    FunctionRefresh = 'getMaterialCon';
  }
  if (this.capacityid) {
    SPString = "SP_Harbauer_Master_Product_mechanical"
    ReportName = "Delete_Master_Product_Mech_Capacity_Size_Data"
    ObjTemp = {
      Capacity_Size_ID: this.capacityid
    }
    FunctionRefresh = 'getProductSize'
  }
  if (this.Profeatureid) {
    SPString = "SP_Harbauer_Master_Product_mechanical"
    ReportName = "Delete_Master_Product_Mech_Product_Feature_Data"
    ObjTemp = {
      Product_Feature_ID: this.Profeatureid
    }
    FunctionRefresh = 'getProductFetr';
  }
  if (this.gradeid) {
    SPString = "SP_Harbauer_Master_Product_mechanical"
    ReportName = "Delete_Master_Product_Mech_Grade_Data"
    ObjTemp = {
      Grade_ID: this.gradeid
    }
    FunctionRefresh = 'getgradeTyp';
  }
  if(this.masterProductId){
    SPString = "SP_Harbauer_Master_Product_mechanical"
    ReportName = "InActive_Master_Product"
    ObjTemp = {
      Product_ID: this.masterProductId
    }
    FunctionRefresh = 'getBrowseProduct'
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
  //}
}
onConfirm2(){
  console.log(this.Objproduct.Product_ID)
    if(this.masterProductId){
      const obj = {
        "SP_String": "SP_Harbauer_Master_Product_Electrical",
        "Report_Name_String": "Active_Master_Product",
        "Json_Param_String": JSON.stringify([{Product_ID : this.masterProductId}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log("del Data===", data[0].Column1)
        if (data[0].Column1 === "Done"){
          this.onReject();
          this.getBrowseProduct();
          this.getProductTyp();
          this.getProductSize();
          this.getCatgData();
          this.getUOM();
          this.mfgName();
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
}

class product{
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
