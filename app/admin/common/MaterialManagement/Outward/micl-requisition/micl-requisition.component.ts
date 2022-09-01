import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { IfStmt, THIS_EXPR, ThrowStmt } from "@angular/compiler/src/output/output_ast";

import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctProjectComponent } from "../../../../shared/compacct.components/compacct.forms/compacct-project/compacct-project.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-micl-requisition',
  templateUrl: './micl-requisition.component.html',
  styleUrls: ['./micl-requisition.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MiclRequisitionComponent implements OnInit {

  buttonname = "Create";
  Spinner = false;
  SpinnerShow = false;
  itemList =[];
  items:any = [];
  tabIndexToView = 0;
  menuList:any = [];
  requi_Date = new Date();
  reqiFormSubmitted = false;
  objreqi:reqi = new reqi();
  DepartmentList = [];
  objmaterial:material = new material()
  objproject : project = new project()
  AddMaterialsList:any = []
  requisitionmaterialFormSubmit = false;
  allRequDataList = [];
  allRequDataListHeader:any = [];
  costcenterList = [];
  GodownList = [];
  GodownBrowseList:any =[]
  productListview = []
  productList = []
  ReqNo = undefined;
  can_popup = false;
  act_popup = false;
  initDate:any = [];
  ObjBrowseData : BrowseData = new BrowseData ();
  RequistionSearchFormSubmit = false;
  seachSpinner = false;
  productTypeList = [];
  objProjectRequi:any = {};
  userType = "";
  docno : any;
  openProject = "N";
  minFromDate = new Date();
  projectDisable = false;
  projectMand = "N";
  toCostCenter:number
  headerText:string
  productFilterObj:any = {};
  validatation = {
    required : false,
    projectMand : 'N'
  }
  reqValid = false
  deleteError = false
  @ViewChild("project", { static: false })
  ProjectInput: CompacctProjectComponent;
  Save = false;
  Del = false;
  ProductCatList:any = [];
  hrYeatList:any = [];
  HR_Year_ID: any;
  ReqTypeList:any = [];
  MaterialTypeList:any = [];
  ReqType : any;
  Requisition_ID :any;
  Material_Type_ID :any;

  constructor(private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService) {
      this.route.queryParams.subscribe(params => {
        console.log(params);
        this.openProject = params['proj'];
        this.validatation.projectMand = params['mand'];
        this.projectMand = params['mand'];
        this.toCostCenter = Number(params['CostCenID']);
        this.headerText = params['Caption'];
        this.ReqType = params['ReqType'];
        
       })
     }

  ngOnInit() {
    $(document).prop('title', this.headerText ? this.headerText : $('title').text());
    this.items =  ["BROWSE", "CREATE", "STOCK"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    // console.log("1",$(document).attr('title'))
    // console.log("2",)
    this.Header.pushHeader({
      Header: this.headerText,
      Link: this.headerText
    });
    this.Finyear();
    this.ServerDate();
    this.AllowedEntryDays();
    this.getCostcenter();
    this.getRequisitionType();
    this.getMaterialType();
    this.getProductCategory();
    this.GetProductsDetalis();
    this.userType = this.$CompacctAPI.CompacctCookies.User_Type
    if(this.openProject !== "Y"){
      this.getProductType()
    }
    
  }
  TabClick(e) {
   
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE", "STOCK"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData(){
    if(this.openProject === "Y"){
      this.ProjectInput.clearData()
    }
    this.requisitionmaterialFormSubmit = false;
    this.objmaterial = new material()
    this.objproject = new project()
    this.objreqi = new reqi();
    this.objreqi.Cost_Cen_ID = this.costcenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
    this.Getgodown(this.objreqi.Cost_Cen_ID)
    this.reqiFormSubmitted = false;
    this.AddMaterialsList = [];
    this.ReqNo = undefined;
    this.can_popup = false;
    this.act_popup = false;
    this.productListview = [];
    this.productList = [];
    this.requi_Date = new Date();
    this.validatation.required = false;
    this.projectDisable = false;
    this.reqValid = false;
    this.deleteError = false;
    this.ProductCatList = [];
    this.productTypeList = [];
    this.Requisition_ID = undefined;
    this.Material_Type_ID = undefined;
   }
  addMaterials(valid){
  console.log("valid",valid);
  this.requisitionmaterialFormSubmit = true;
  this.reqValid = true
  if(valid && this.GetSameProduct()){
     if(this.projectMand == 'Y' && (Number(this.productFilterObj.Can_Be_Used_Qty)< Number(this.objmaterial.Req_Qty) || 0 == Number(this.objmaterial.Req_Qty))){
      console.log("done");
      this.reqValid = true
      return
     }
     else{
      this.reqValid = false
     }
     
    const productFilter:any = this.productListview.filter((el:any)=>Number(el.Product_ID) === Number(this.objmaterial.Product_ID));
    const productTypeFilter:any = this.productTypeList.filter((el:any)=> Number(el.Product_Type_ID) === Number(this.objmaterial.Product_Type_ID));
     console.log("productFilter",productFilter);
    if(productFilter.length){
      this.AddMaterialsList.push({
        Product_ID: this.objmaterial.Product_ID,
        Product_Description: productFilter[0].Product_Description,
        Product_Code: productFilter[0].Product_Code,
        Req_Qty: this.objmaterial.Req_Qty,
        UOM: this.objmaterial.UOM,
        Purpose: this.objmaterial.Purpose,
        Created_By: this.$CompacctAPI.CompacctCookies.User_ID,
        Product_Type_ID : this.objmaterial.Product_Type_ID,
        Product_Type : productTypeFilter[0].Product_Type,
        Product_Category : this.objmaterial.Product_Category
      })
      this.requisitionmaterialFormSubmit = false;
      this.objmaterial = new material();
      this.productList = [];
      this.productListview = [];
      this.projectDisable = true;
      this.reqValid = false
      this.productFilterObj = {};
    }
  
  }
  }
  GetSameProduct () {
    const sameproduct = this.AddMaterialsList.filter(item=> Number(item.Product_ID) === Number(this.objmaterial.Product_ID) );
    if(sameproduct.length) {
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Same Product Can't be Added."
          });
      return false;
    } else {
      return true;
    }
    }
  SaveRequi(valid){ 
   console.log("valid",valid);
   this.reqiFormSubmitted = true;
   this.validatation.required = true;
   this.ngxService.start();
   this.Save = false;
   this.Del = false;
   if(valid && this.checkreq()){
     if(this.AddMaterialsList.length){
      this.Save = true;
      this.Del = false;
      this.Spinner = true;
      this.ngxService.start();
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "c",
       sticky: true,
       closable: false,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
    //   let saveData:any = [];
    //   let mgs = "";
    //   if(this.ReqNo){
 
    //   }
    //   else{
    //    mgs = "Save"
    //     const consCenterFilter:any = this.costcenterList.filter((el:any)=> Number(el.Cost_Cen_ID) === Number(this.objreqi.Cost_Cen_ID))
    //     this.AddMaterialsList.forEach((el:any)=>{
    //     let save = {
    //      Req_No: "A",
    //      Req_Date: this.requi_Date ? this.DateService.dateConvert(new Date(this.requi_Date)) : new Date(),
    //      Cost_Cen_ID: Number(this.objreqi.Cost_Cen_ID),
    //      Cost_Cen_Name: consCenterFilter[0].Cost_Cen_Name,
    //      Product_ID: Number(el.Product_ID),
    //      Product_Description: el.Product_Description,
    //      Req_Qty: Number(el.Req_Qty),
    //      UOM: el.UOM,
    //      Remarks: el.Remarks,
    //      Created_By: el.Created_By,
    //      Godown_ID: this.objreqi.Godown_ID,
    //      Product_Type_ID : Number(el.Product_Type_ID),
    //      Product_Type : el.Product_Type,
    //      To_Cost_Cen_ID : Number(this.toCostCenter)
    //     }
    //     saveData.push(save)
    //     })
    //     console.log("Save Data",saveData);
    //     const obj = {
    //      "SP_String": "SP_Txn_Requisition",
    //      "Report_Name_String": "Create_Requisition",
    //      "Json_Param_String": JSON.stringify(saveData)
   
    //    }
    //    this.GlobalAPI.getData(obj).subscribe(async (data:any)=>{
    //      console.log("After Data",data)
    //      this.docno = data[0].Column1;
    //      if(data[0].Column1){
    //         if(this.objproject.PROJECT_ID){
    //           const projectSaveData = await this.SaveProject(data[0].Column1);
    //           if(projectSaveData){
    //             this.ngxService.stop();
    //             this.compacctToast.clear();
    //              this.compacctToast.add({
    //              key: "compacct-toast",
    //              severity: "success",
    //              summary: "Requisition No: " +data[0].Column1,
    //              detail: "Succesfully " + mgs
    //            });
    //           }
    //         }
    //         this.ngxService.stop();
    //         this.compacctToast.clear();
    //          this.compacctToast.add({
    //          key: "compacct-toast",
    //          severity: "success",
    //          summary: "Requisition No: " +data[0].Column1,
    //          detail: "Succesfully " + mgs
    //        });
          
    //        // this.SaveNPrintBill();
    //        this.Print(data[0].Column1)
    //         this.clearData();
    //         this.searchData(true);
    //         this.tabIndexToView = 0;
    //         } else{
    //           this.compacctToast.add({
    //           key: "compacct-toast",
    //           severity: "error",
    //           summary: "Warn Message",
    //           detail: "Something Wrong"
    //         });
    //      }
    //    })
    //   }
     }
     else{
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
     }
   }
  }
  onConfirmSave(){
      let saveData:any = [];
      let mgs = "";
      if(this.ReqNo){
 
      }
      else{
       mgs = "Save"
        const consCenterFilter:any = this.costcenterList.filter((el:any)=> Number(el.Cost_Cen_ID) === Number(this.objreqi.Cost_Cen_ID))
        this.AddMaterialsList.forEach((el:any)=>{
        let save = {
         Req_No: "A",
         Req_Date: this.requi_Date ? this.DateService.dateConvert(new Date(this.requi_Date)) : new Date(),
         Cost_Cen_ID: Number(this.objreqi.Cost_Cen_ID),
         Cost_Cen_Name: consCenterFilter[0].Cost_Cen_Name,
         Product_ID: Number(el.Product_ID),
         Product_Description: el.Product_Description,
         Req_Qty: Number(el.Req_Qty),
         UOM: el.UOM,
         Purpose: el.Purpose,
         Created_By: el.Created_By,
         Godown_ID: this.objreqi.Godown_ID,
         Product_Type_ID : Number(el.Product_Type_ID),
         Product_Type : el.Product_Type,
         Type_Of_Product : el.Product_Category,
         To_Cost_Cen_ID : Number(this.toCostCenter),
         Remarks : this.objreqi.Remarks,
         Requisiton_Type : this.Requisition_ID,
         Material_Type : this.Material_Type_ID
        }
        saveData.push(save)
        })
        console.log("Save Data",saveData);
        const obj = {
         "SP_String": "SP_Txn_Requisition",
         "Report_Name_String": "Create_Requisition",
         "Json_Param_String": JSON.stringify(saveData)
   
       }
       this.GlobalAPI.getData(obj).subscribe(async (data:any)=>{
         console.log("After Data",data)
         this.docno = data[0].Column1;
         if(data[0].Column1){
            if(this.objproject.PROJECT_ID){
              const projectSaveData = await this.SaveProject(data[0].Column1);
              if(projectSaveData){
                this.ngxService.stop();
                this.compacctToast.clear();
                 this.compacctToast.add({
                 key: "compacct-toast",
                 severity: "success",
                 summary: "Requisition No: " +data[0].Column1,
                 detail: "Succesfully " + mgs
               });
              }
            }
            this.ngxService.stop();
            this.compacctToast.clear();
             this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Requisition No: " +data[0].Column1,
             detail: "Succesfully " + mgs
           });
          
           // this.SaveNPrintBill();
           this.Print(data[0].Column1)
            this.clearData();
            this.Requisition_ID = undefined;
            this.Material_Type_ID = undefined;
            this.Spinner = false;
            this.searchData(true);
            this.tabIndexToView = 0;
            } else{
              this.Spinner = false;
              this.ngxService.stop();
              this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Something Wrong"
            });
         }
       })
      }
     
  }
  // checkreq(){
  //   let flg = false
  //   if(this.openProject === "Y" && this.openProject === "Y"){
  //     let getArrValue = Object.values(this.objProjectRequi);
  //     console.log("getArrValue",getArrValue.length);
  //     if(getArrValue.length === 5 || getArrValue.length > 5){
  //       flg = true
  //     }
  //     else {
  //       flg = false
  //     }
  //   }
  //   else {
  //     flg = true
  //   }
  //   return flg
  //  }
   checkreq(){
    let flg = false
    if(this.openProject === "Y" && this.projectMand === "Y"){
      let getArrValue = Object.values(this.objProjectRequi);
      console.log("getArrValue",getArrValue.length);
      if(getArrValue.indexOf(undefined) == -1){
        if(getArrValue.length === 5 || getArrValue.length > 5){
          flg = true
        }
        else {
          flg = false
        }
      }
      else {
        flg = false
      }
    }
    else {
      flg = true
    }
    return flg
   }
  SaveNPrintBill() {
    if (this.docno) {
      window.open("/Report/Crystal_Files/MICL/Txn_Requisition_Print.aspx?DocNo=" + this.docno, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
  
      );
    }
    // console.log('Doc_No ==', this.Objcustomerdetail.Bill_No)
  }
  delete(i){
    this.AddMaterialsList.splice(i,1);
    this.projectDisable = this.AddMaterialsList.length ? true : false
  }
  onReject(){
    this.compacctToast.clear("c");
    this.Spinner = false;
    this.ngxService.stop();
    this.deleteError = false;
  }
  getCostcenter(){
   const obj = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("costcenterList  ===",data);
     this.costcenterList = data;
     this.objreqi.Cost_Cen_ID = this.costcenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
     this.ObjBrowseData.Cost_Cen_ID = this.costcenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
      this.Getgodown(this.objreqi.Cost_Cen_ID);
     this.GetgodownBrowse(this.ObjBrowseData.Cost_Cen_ID);
     this.searchData()
  })
  }
  Getgodown(CostID){
    if(CostID){
      this.GodownList = [];
      const obj = {
        "SP_String": "SP_Txn_Requisition",
        "Report_Name_String": "Get_Cost_Center_Godown",
        "Json_Param_String": JSON.stringify([{Cost_Cen_ID : CostID}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.GodownList = data;
        this.objreqi.Godown_ID = this.GodownList[0].Godown_ID
        console.log("this.toGodownList",this.GodownList);
        })
    }
    else{
      this.GodownList = [];
      this.objreqi.Godown_ID =undefined;
    }

   
  }
  GetgodownBrowse(CostID){
    if(CostID){
      this.GodownBrowseList = [];
      const obj = {
        "SP_String": "SP_Txn_Requisition",
        "Report_Name_String": "Get_Cost_Center_Godown",
        "Json_Param_String": JSON.stringify([{Cost_Cen_ID : CostID}])
  
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.GodownBrowseList = data;
        console.log("this.GodownBrowseList",this.GodownBrowseList);
        // if(this.headerText === "Purchase Indent") {
        this.ObjBrowseData.Godown_ID = this.GodownBrowseList.length ? this.GodownBrowseList[0].Godown_ID : undefined
        this.searchData()
        // }
        })
    }
    else{
      this.GodownBrowseList = [];
      this.ObjBrowseData.Godown_ID = undefined;
    }

   
  }
  getRequisitionType(){
    const obj = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Get_Requisiton_Type"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ReqTypeList = data;
     console.log("ReqTypeList",this.ReqTypeList);
     })
  }
  getMaterialType(){
    const obj = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Get_Material_Type"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.MaterialTypeList = data;
     console.log("MaterialTypeList",this.MaterialTypeList);
     })
  }
  getProductCategory(){
    this.ProductCatList = [];
    const obj = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Get_Type_Of_Product",
      "Json_Param_String": JSON.stringify([{Material_Type : this.Material_Type_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ProductCatList = data;
     console.log("ProductCatList",this.ProductCatList);
     })
  }
  getProductType(){
    this.productTypeList = [];
    const materialtype = {
      Type_Of_Product : this.objmaterial.Product_Category
    }
    const obj = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Get_product_Type_Details",
      "Json_Param_String": Object.keys(this.objProjectRequi).length ? JSON.stringify({...this.objProjectRequi,...materialtype}) : JSON.stringify([{PROJECT_ID : 0,Type_Of_Product : this.objmaterial.Product_Category}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Product_Type
        el['value'] = el.Product_Type_ID
      });
       
      this.productTypeList = data;
     console.log("productTypeList",this.productTypeList);
     })
  }

  GetProductsDetalis(){
    if(this.objmaterial.Product_Type_ID){
      this.productListview = [];
      this.productList = [];
      this.objmaterial.Product_ID = undefined;
      const obj = {
        "SP_String": "SP_Txn_Requisition",
        "Report_Name_String": "Get_product_Details",
        "Json_Param_String":  Object.keys(this.objProjectRequi).length ? JSON.stringify([{...this.objProjectRequi,...{Product_Type_ID : Number(this.objmaterial.Product_Type_ID)}}]) : JSON.stringify([{Product_Type_ID : Number(this.objmaterial.Product_Type_ID)}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.productListview = data;
       console.log("productListview",this.productListview);
        this.productListview.forEach(el => {
          this.productList.push({
            label: el.Product_Description,
            value: el.Product_ID
          });
        });
      })
    }
    else {
      this.productListview = [];
      this.productList = [];
      this.objmaterial.Product_ID = undefined;
    }
 
  }
  getUOM(){
    if(this.objmaterial.Product_ID){
      const ProductFilter = this.productListview.filter((el:any)=> Number(el.Product_ID) === Number(this.objmaterial.Product_ID))
      console.log("ProductFilter",ProductFilter);
      this.productFilterObj = ProductFilter[0];
       this.objmaterial.UOM = ProductFilter[0].UOM
    }
    else {
      this.productFilterObj = {}
    }
  }
  reqiValid(id:any){
   if(id || Number(id) == 0){
    if(this.projectMand == 'Y' && (Number(this.productFilterObj.Can_Be_Used_Qty)< Number(this.objmaterial.Req_Qty) || 0 == Number(this.objmaterial.Req_Qty))){
      this.reqValid = true
    }
    else{
      this.reqValid = false
    }
   }
   else{
    this.reqValid = true
   }
  }
  getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseData.From_Date = dateRangeObj[0];
      this.ObjBrowseData.To_Date = dateRangeObj[1];
    }
  }
  searchData(valid?){
    this.RequistionSearchFormSubmit = true;
    this.seachSpinner = true
      const tempDate = {
        From_Date :this.ObjBrowseData.From_Date
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.From_Date))
        : this.DateService.dateConvert(new Date()),
        To_Date :this.ObjBrowseData.To_Date
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.To_Date))
        : this.DateService.dateConvert(new Date()),
        Cost_Cen_ID :this.ObjBrowseData.Cost_Cen_ID ? this.ObjBrowseData.Cost_Cen_ID : 0,
        Godown_ID : this.ObjBrowseData.Godown_ID ? this.ObjBrowseData.Godown_ID : 0,
        proj : this.openProject ? this.openProject : "N",
        To_Cost_Cen_ID : this.toCostCenter
      }
      const obj = {
        "SP_String": "SP_Txn_Requisition",
        "Report_Name_String": "Browse_Requisition",
        "Json_Param_String": JSON.stringify([tempDate])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.allRequDataList = data;
        if(this.allRequDataList.length){
          this.allRequDataListHeader= Object.keys(data[0])
        }
        this.RequistionSearchFormSubmit = false;
        this.seachSpinner = false
        console.log("this.allRequDataList",this.allRequDataList);
      })
  
 
  }
  headerChange(header:any){
  return header === "Req_No" ? this.headerText+" No" : header.replaceAll('_',' ')
  }
  Active(col){
    console.log("col",col);
    this.can_popup = false;
    this.Del = false;
    this.Save = false;
     if(col.Req_No){
      this.act_popup = true;
      this.ReqNo = undefined;
      this.Del = true;
      this.Save = false;
       this.ReqNo = col.Req_No;
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
  // Cancel(col){
  //   this.act_popup = false;
  //    if(col.Req_No){
  //     this.ReqNo = undefined;
  //     this.ReqNo = col.Req_No;
  //     this.can_popup = true;
  //     this.compacctToast.clear();
  //      this.compacctToast.add({
  //        key: "c",
  //        sticky: true,
  //        severity: "warn",
  //        summary: "Are you sure?",
  //        detail: "Confirm to proceed"
  //      });
       
  //    }
  // }
  onConfirm2(){
   if(this.ReqNo){
     const obj = {
          "SP_String": "SP_Txn_Requisition",
          "Report_Name_String": "Cancel_Requisition",
          "Json_Param_String": JSON.stringify([{Req_No : this.ReqNo,Created_By : this.$CompacctAPI.CompacctCookies.User_ID}])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if (data[0].Column1 === "Done"){
           this.onReject();
           this.act_popup = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Requisition No: " + this.ReqNo.toString(),
              detail: "Succesfully Deleted"
            });
           this.ReqNo = undefined;
           this.searchData(true)
          }
          else {
            this.onReject();
            this.deleteError = true;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "c", 
              sticky: true,
              closable: false,
              severity: "warn", // "info",
              summary: data[0].Column1,
              // detail: data[0].Column1
            });
           this.ReqNo = undefined;
           this.searchData(true)
          }
        })
      }
      //this.ParamFlaghtml = undefined;
  }
  // onConfirm(){
  //    if(this.ReqNo){
  //         const obj = {
  //           "SP_String": "SP_Txn_Requisition",
  //           "Report_Name_String": "Active_Requisition",
  //           // "Report_Name_String": "Cancel_Requisition",
  //           "Json_Param_String": JSON.stringify([{Req_No : this.ReqNo,Created_By : this.$CompacctAPI.CompacctCookies.User_ID}])
  //         }
  //         this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //           // console.log("del Data===", data[0].Column1)
  //           if (data[0].Column1 === "Done"){
  //           this.onReject();
  //           this.can_popup = false;
  //             this.compacctToast.clear();
  //             this.compacctToast.add({
  //               key: "compacct-toast",
  //               severity: "success",
  //               summary: "Requisition No: " + this.ReqNo.toString(),
  //               detail: "Succesfully Activated"  
  //             });
  //             this.ReqNo = undefined;   
  //             this.searchData(true)
  //           }
  //         })
  //       }
  //   }
  getPrint(obj) {  
    if (obj.Req_No) { 
    window.open('/Report/Crystal_Files/MICL/Txn_Requisition_Print.aspx?DocNo=' + obj.Req_No,
      'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');   
}
  }
  getProjectData(e){
    console.log("e",e)
    this.objproject = e
    this.objproject.Budget_Group_ID = Number(e.Budget_Group_ID)
    this.objproject.Budget_Sub_Group_ID = Number(e.Budget_Sub_Group_ID)
    this.objProjectRequi = e
    let temparr = Object.keys(this.objProjectRequi)
    if(temparr.indexOf("PROJECT_ID") != -1 && temparr.indexOf("Budget_Group_ID") != -1 && temparr.indexOf("Budget_Sub_Group_ID") != -1 && temparr.indexOf("SITE_ID") != -1 && temparr.indexOf("Work_Details_ID") != -1){
      this.getProductType();
     }
     else{
      this.objmaterial.Product_Type_ID = undefined;
      this.objmaterial.Product_ID = undefined;
      this.productTypeList = [];
      this.productList = [];
     }
  }
  whateverCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
  showTost(msg,summary){
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "success",
      summary: summary,
      detail: "Succesfully "+msg
    });
  }
  async SaveProject(docNo){
    if(docNo){
    this.objproject.DOC_NO = docNo,
    this.objproject.DOC_TYPE = "REQUISITION",
    this.objproject.DOC_DATE = this.DateService.dateConvert(this.requi_Date)
    }
    const obj = {
    "SP_String": "SP_BL_CRM_TXN_Project_Doc",
    "Report_Name_String": "Create_BL_CRM_TXN_Project_Doc",
    "Json_Param_String": JSON.stringify([this.objproject]) 
    }
    const projectData = await  this.GlobalAPI.getData(obj).toPromise();
    console.log("projectData",projectData);
    return projectData
  }

  ServerDate(){
    this.$http
    .get("/common/Get_Server_Date")
    .subscribe((data: any) => {
     console.log("ServerDate",data)
     this.requi_Date  = new Date(data)
     
    })
  }
  AllowedEntryDays(){
    this.$http
    .get("/Common/Get_Allowed_Entry_Days?User_ID=" + this.$CompacctAPI.CompacctCookies.User_ID)
    .subscribe((rec: any) => {
      console.log("AllowedEntryDays",rec)
     let data = JSON.parse(rec)
      let days = Number(data[0].Allowed_Entry_Day)
      console.log("days",days)
     this.minFromDate = new Date(this.requi_Date.getTime()-(days*24*60*60*1000));
     console.log("minFromDate",this.minFromDate)
      
    })
  }
  Print(DocNo) {
    if(DocNo) {
    const objtemp = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Requisition_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
  }
  // hrYearList(){
  //   this.HR_Year_ID = undefined;
  //   const obj = {
  //     "SP_String":"SP_Leave_Application",
  //     "Report_Name_String":"Get_HR_Year_List"
  //  }
  //  this.GlobalAPI.getData(obj)
  //    .subscribe((data:any)=>{
  //     this.hrYeatList = data;
  //     console.log("Hr Year==",this.hrYeatList);
  //     this.HR_Year_ID =  this.hrYeatList.length ? this.hrYeatList[0].HR_Year_ID : undefined;

  //      // if(this.ObjHrleave.HR_Year_ID){
  //       this.getMaxMindate()
  //    // }
  //     });
  // }
  // getMaxMindate(){
  //   if(this.HR_Year_ID){
  //     const HRFilterValue = this.hrYeatList.filter(el=> Number(el.HR_Year_ID) === Number(this.HR_Year_ID))[0];
  //     this.initDate = [new Date(HRFilterValue.HR_Year_Start), new Date(HRFilterValue.HR_Year_End)];
      
  //   }
  // }
  Finyear() {
      this.$http
        .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
        .subscribe((res: any) => {
        let data = JSON.parse(res)
        // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
        // this.voucherminDate = new Date(data[0].Fin_Year_Start);
        // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
       this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
        });
    }
}

class reqi{
    Req_No:any;
    Req_Date:any;
    Cost_Cen_ID:any;
    Cost_Cen_Name:any;
    Godown_ID:any;
    Remarks:any;
   }

class material{
  Product_Category:any;
  Product_ID:any;
  Product_Description:any;
  Req_Qty:any;
  UOM:any;
  Purpose:any;
  Remarks:any;
  Created_By:any;
  Product_Type_ID:any;
  Material_Type_ID:any;
}

class BrowseData {
  From_Date: string;
  To_Date: string;
  Cost_Cen_ID : any;
  Godown_ID : any;
  To_Cost_Cen_ID :any
  }
class project{
  DOC_NO:any
  DOC_DATE:any
  DOC_TYPE:any
  PROJECT_ID:any
  SITE_ID:any
  Budget_Group_ID:any
  Budget_Sub_Group_ID:any
  Work_Details_ID:any
}