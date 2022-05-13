import { MessageService } from 'primeng/primeng';
import { CompacctGlobalApiService } from './../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from './../../../shared/compacct.services/common.header.service';
import { CompacctCommonApi } from './../../../shared/compacct.services/common.api.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

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
  

  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header:CompacctHeader, 
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    public $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-product-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.getBrowseProduct();
    this.getProductTyp();
    this.getProductSize();
    this.getCatgData();
    this.mfgName();
    this.getMaterialCon();
    this.getProductFetr();
    this.getgradeTyp()
    this.header.pushHeader({
      Header: "Master Product General Consumables",
      Link: " MICL -> Master-Product-General-Consumables"
    })
 
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
    
   
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
   }
   //Save Data
   saveData(valid:any){
    console.log("savedata==",this.Objproduct);
    console.log("valid",valid)
    this.ProductFormSubmitted = true;
    if(valid){
      console.log("productCode==",this.productCode);
      
      var mocdes = this.materialCon.filter(item => Number(item.MOC_ID) === Number(this.Objproduct.MOC_ID))
      const productFeatureFilter = this.productFetr.filter(el=>Number(el.Product_Feature_ID) === Number(this.Objproduct.Product_Feature_ID))
      this.Objproduct.Product_Feature_Desc = productFeatureFilter.length ? productFeatureFilter[0].Product_Feature_Desc : undefined;
      this.Objproduct.Product_Feature_Desc = Number(this.Objproduct.Product_Feature_ID)
      this.Objproduct.MOC_Description = mocdes.length ? mocdes[0].MOC_Description : 0;
      this.Objproduct.Product_ID = this.productCode ? this.productCode : 0
      
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
             this.getBrowseProduct();
            this.productCode = undefined;
            this.tabIndexToView = 0;
            this.ProductFormSubmitted = false;
            this.Objproduct = new product();
           });
       }
       else{
         console.error("Somthing Wrong")
       }    
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
      this.getProductTyp();
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
      this.getProductSubTyp()
     })
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
  let ObjTemp;
  let FunctionRefresh;
  if (this.protypeid) {
    ReportName = "Delete_Master_Product_Type"
    ObjTemp = {
      Product_Type_ID: this.protypeid
    }
    FunctionRefresh = 'getProductTyp'
  }
  if (this.protypesubid) {
    ReportName = "Delete_Product_Sub_Type"
    ObjTemp = {
      Product_Sub_Type_ID: this.protypesubid
    }
    FunctionRefresh = 'getProductSubTyp';
  }
  if (this.mocid) {
    ReportName = "Delete_Master_Product_Mech_MOC_Data"
    ObjTemp = {
      MOC_ID: this.mocid
    }
    FunctionRefresh = 'getMaterialCon';
  }
  if (this.capacityid) {
    ReportName = "Delete_Master_Product_Mech_Capacity_Size_Data"
    ObjTemp = {
      Capacity_Size_ID: this.capacityid
    }
    FunctionRefresh = 'getProductSize'
  }
  if (this.Profeatureid) {
    ReportName = "Delete_Master_Product_Mech_Product_Feature_Data"
    ObjTemp = {
      Product_Feature_ID: this.Profeatureid
    }
    FunctionRefresh = 'getProductFetr';
  }
  if (this.gradeid) {
    ReportName = "Delete_Master_Product_Mech_Grade_Data"
    ObjTemp = {
      Grade_ID: this.gradeid
    }
    FunctionRefresh = 'getgradeTyp';
  }
  if(this.masterProductId){
    ReportName = "InActive_Master_Product"
    ObjTemp = {
      Product_ID: this.masterProductId
    }
    FunctionRefresh = 'getBrowseProduct'
  }
    const obj = {
      "SP_String": "SP_Harbauer_Master_Product_mechanical",
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
  Grade_Description:any;
  GST_Percentage:any;
  Mfg_Company:any;
}
