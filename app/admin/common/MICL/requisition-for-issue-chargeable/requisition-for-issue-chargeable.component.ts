import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { IfStmt, THIS_EXPR, ThrowStmt } from "@angular/compiler/src/output/output_ast";

import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctProjectComponent } from "../../../shared/compacct.components/compacct.forms/compacct-project/compacct-project.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-requisition-for-issue-chargeable',
  templateUrl: './requisition-for-issue-chargeable.component.html',
  styleUrls: ['./requisition-for-issue-chargeable.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class RequisitionForIssueChargeableComponent implements OnInit {
  buttonname = "Create";
  Spinner = false;
  SpinnerShow = false;
  itemList:any =[];
  items:any = [];
  tabIndexToView = 0;
  menuList:any = [];
  ObjBrowseData : BrowseData = new BrowseData ();
  RequistionSearchFormSubmit = false;
  seachSpinner = false;
  allRequDataList:any = [];
  allRequDataListHeader:any = [];
  costcenterList:any = [];
  GodownList:any = [];
  GodownBrowseList:any =[];
  requi_Date = new Date();
  minFromDate = new Date();
  validatation:boolean = false;
  objreqi:reqi = new reqi();
  Requisition_ID :any;
  Material_Type_ID :any;
  requisitionmaterialFormSubmit = false;
  VendorList:any = [];
  WoOrderList:any = [];
  ReqTypeList:any = [];
  MaterialTypeList:any = [];
  objmaterial:material = new material();
  ProductCatList:any = [];
  productTypeList:any = [];
  productList:any = [];
  currentstocklist:any = [];
  Current_Stock:any;
  AddMaterialsList:any = [];
  initDate:any = [];
  docno:any;
  reqDocNo:any;
  ReqNo:any;
  

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    //console.log('Del_Right ==',this.$CompacctAPI.CompacctCookies.Del_Right)
    // $(document).prop('title', this.headerText ? this.headerText : $('title').text());
    this.items =  ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    // console.log("1",$(document).attr('title'))
    // console.log("2",)
    this.Header.pushHeader({
      Header: "Issue Chargeable Requisition",
      Link: "Issue Chargeable Requisition"
    });
    this.Finyear();
    this.getCostcenter();
    this.getSupplier();
    this.getRequisitionType();
    this.getMaterialType();
    // this.getProductCategory();
    // this.GetProductsDetalis();
    // this.userType = this.$CompacctAPI.CompacctCookies.User_Type
    // this.companyname = this.$CompacctAPI.CompacctCookies.Company_Name
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
    this.Current_Stock = undefined;
  }
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
  getCostcenter(){
    const obj = {
       "SP_String": "SP_TXN_REQUISITION_FOR_ISSUE_CHARGABLE",
       "Report_Name_String": "Get_Cost_Center",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       //console.log("costcenterList  ===",data);
      this.costcenterList = data;
      this.objreqi.Cost_Cen_ID = this.costcenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
      this.ObjBrowseData.Cost_Cen_ID = this.costcenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
       this.Getgodown(this.objreqi.Cost_Cen_ID);
       this.GetgodownBrowse(this.ObjBrowseData.Cost_Cen_ID); 
   })
  }
  Getgodown(CostID,edit?){
     this.GodownList = [];
     if(CostID){
       const obj = {
         "SP_String": "SP_TXN_REQUISITION_FOR_ISSUE_CHARGABLE",
         "Report_Name_String": "Get_Cost_Center_Godown",
         "Json_Param_String": JSON.stringify([{Cost_Cen_ID : CostID}])
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.GodownList = data;
         if(edit){
           this.objreqi.Godown_ID = edit;
         }
         else{
           this.objreqi.Godown_ID = this.GodownList.length === 1 ? this.GodownList[0].Godown_ID : undefined;
         }
         
         //console.log("this.toGodownList",this.GodownList);
         })
     }
     else{
       // this.GodownList = [];
       this.objreqi.Godown_ID =undefined;
     }
 
    
  }
  GetgodownBrowse(CostID){
     if(CostID){
       this.GodownBrowseList = [];
       const obj = {
         "SP_String": "SP_TXN_REQUISITION_FOR_ISSUE_CHARGABLE",
         "Report_Name_String": "Get_Cost_Center_Godown",
         "Json_Param_String": JSON.stringify([{Cost_Cen_ID : CostID}])
   
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.GodownBrowseList = data;
         //console.log("this.GodownBrowseList",this.GodownBrowseList);
         // if(this.headerText === "Purchase Indent") {
         this.ObjBrowseData.Godown_ID = this.GodownBrowseList.length ? this.GodownBrowseList[0].Godown_ID : undefined;
         // }
         })
     }
     else{
       this.GodownBrowseList = [];
       this.ObjBrowseData.Godown_ID = undefined;
     }
 
    
  }

  // Browse
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
        proj : "N",
        To_Cost_Cen_ID : 3,
        //Material_Type : '',
        Created_By : this.$CompacctAPI.CompacctCookies.User_ID
      }
      const obj = {
        "SP_String": "SP_TXN_REQUISITION_FOR_ISSUE_CHARGABLE",
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
        //console.log("this.allRequDataList",this.allRequDataList);
      })
  
 
  }

  // Create
  getSupplier(){
    this.VendorList = [];
    const obj = {
      "SP_String": "SP_TXN_REQUISITION_FOR_ISSUE_CHARGABLE",
      "Report_Name_String":"Get_Sub_Ledger_Dropdown",
     }
     this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Sub_Ledger_Name,
          element['value'] = element.Sub_Ledger_ID
        });
        this.VendorList = data;
      } else {
        this.VendorList = [];

      }
      });
  }
  getWoOrder(Sub_Ledger_ID){
    this.WoOrderList=[];
    console.log("ObjRdb.Sub_Ledger_ID",this.objreqi.Sub_Ledger_ID);
    if(Sub_Ledger_ID){
    const obj = {
      "SP_String": "SP_TXN_REQUISITION_FOR_ISSUE_CHARGABLE",
      "Report_Name_String":"Get_Pending_WO_Order_Nos",
      "Json_Param_String": JSON.stringify([{Sub_Ledger_ID: Sub_Ledger_ID}]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data : any)=> {
      //  this.WoOrderList = data;
      //  console.log('WoOrderList=',this.WoOrderList);
       if(data.length) {
        data.forEach(element => {
          element['label'] = element.Doc_No,
          element['value'] = element.Doc_No
        });
       this.WoOrderList = data;
       console.log("PoOrderList======",this.WoOrderList);
      }
       else {
        this.WoOrderList = [];

      }
      //  this.AllPoOrderList.forEach((el : any)=>
      //  {
      //    this.PoOrderList.push({
      //      label: el.Doc_No,
      //      value: el.Doc_No
      //    })
      //  });
       
     });
    }
    else {
      this.objreqi.Wo_Doc_No = undefined;
    }
   
  }
  getRequisitionType(){
    const obj = {
      "SP_String": "SP_TXN_REQUISITION_FOR_ISSUE_CHARGABLE",
      "Report_Name_String": "Get_Requisiton_Type"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ReqTypeList = data;
     //console.log("ReqTypeList",this.ReqTypeList);
     })
  }
  getMaterialType(){
    // this.MaterialTypeList = [];
    const obj = {
      "SP_String": "SP_TXN_REQUISITION_FOR_ISSUE_CHARGABLE",
      "Report_Name_String": "Get_Material_Type"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.MaterialTypeList = data;
    //   var materiallist = data;
    //  //console.log("MaterialTypeList",this.MaterialTypeList);
    //  if (this.headerText === "Maintenance Indent") {
    //   this.MaterialTypeList = materiallist;
    //   this.Material_Type_ID = "M.R.O";
    //   this.mrodisabled = true;
      this.getProductCategory();
    //  } 
    //  else {
    //   var matdata = materiallist.filter(function(value){
    //     return value.Material_Type != "M.R.O";
    //   });
    //   this.MaterialTypeList = matdata;
    //   this.Material_Type_ID = undefined;
    //   this.mrodisabled = false;
    //  }
     })
  }
  getProductCategory(){
    this.ProductCatList = [];
    const obj = {
      "SP_String": "SP_TXN_REQUISITION_FOR_ISSUE_CHARGABLE",
      "Report_Name_String": "Get_Type_Of_Product",
      "Json_Param_String": JSON.stringify([{Material_Type : this.Material_Type_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ProductCatList = data;
     //console.log("ProductCatList",this.ProductCatList);
     })
  }
  getProductType(){
    this.productTypeList = [];
    const materialtype = {
      Type_Of_Product : this.objmaterial.Product_Category
    }
    const obj = {
      "SP_String": "SP_TXN_REQUISITION_FOR_ISSUE_CHARGABLE",
      "Report_Name_String": "Get_product_Type_Details",
      "Json_Param_String": JSON.stringify([materialtype])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Product_Type
        el['value'] = el.Product_Type_ID
      });
       
      this.productTypeList = data;
     //console.log("productTypeList",this.productTypeList);
     })
  }
  GetProductsDetalis(){
    if(this.objmaterial.Product_Type_ID){
      // this.productListview = [];
      this.productList = [];
      this.objmaterial.Product_ID = undefined;
      // let reportname = '';
      // if(this.headerText === "Maintenance Indent") {
      //   reportname = "Get_product_Details_MRO";
      // }
      // else {
      //   reportname = "Get_product_Details";
      // }
      const obj = {
        "SP_String": "SP_TXN_REQUISITION_FOR_ISSUE_CHARGABLE",
        "Report_Name_String": "Get_product_Details",
        "Json_Param_String":  JSON.stringify([{Product_Type_ID : Number(this.objmaterial.Product_Type_ID)}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // this.productListview = data;
       //console.log("productListview",this.productListview);
        if(data.length) {
            data.forEach(element => {
              element['label'] = element.Product_Description,
              element['value'] = element.Product_ID
            });
            this.productList = data;
          } else {
            this.productList = [];
    
          }
      })
    }
    else {
      // this.productListview = [];
      this.productList = [];
      this.objmaterial.Product_ID = undefined;
    }
 
  }
  getUOM(){
    if(this.objmaterial.Product_ID){
      const ProductFilter = this.productList.filter((el:any)=> Number(el.Product_ID) === Number(this.objmaterial.Product_ID))
      //console.log("ProductFilter",ProductFilter);
      // this.productFilterObj = ProductFilter[0];
       this.objmaterial.UOM = ProductFilter[0].UOM
       this.GetCurrentStock();
    }
    else {
      // this.productFilterObj = {}
      this.objmaterial.UOM = undefined;
    }
  }
  GetCurrentStock(){
    this.currentstocklist = [];
    this.Current_Stock = undefined;
    const obj = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Get_Current_Stock_Inside_Store",
      "Json_Param_String": JSON.stringify([{Product_ID : this.objmaterial.Product_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.currentstocklist = data;
      this.Current_Stock = data[0].Bln_Qty;
     //console.log("ProductCatList",this.ProductCatList);
     })
  }
  addMaterials(valid){
    //console.log("valid",valid);
    this.requisitionmaterialFormSubmit = true;
    // this.reqValid = true
    if(valid && this.GetSameProduct()){
      //  if(this.projectMand == 'Y' && (Number(this.productFilterObj.Can_Be_Used_Qty)< Number(this.objmaterial.Req_Qty) || 0 == Number(this.objmaterial.Req_Qty))){
      //   //console.log("done");
      //   this.reqValid = true
      //   return
      //  }
      //  else{
      //   this.reqValid = false
      //  }
       
      const productFilter:any = this.productList.filter((el:any)=>Number(el.Product_ID) === Number(this.objmaterial.Product_ID));
      const productTypeFilter:any = this.productTypeList.filter((el:any)=> Number(el.Product_Type_ID) === Number(this.objmaterial.Product_Type_ID));
       //console.log("productFilter",productFilter);
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
          Product_Category : this.objmaterial.Product_Category,
          Challan_No : null
        })
        this.requisitionmaterialFormSubmit = false;
        this.objmaterial = new material();
        this.Current_Stock = undefined;
        this.productList = [];
        // this.productListview = [];
        // this.projectDisable = true;
        // this.reqValid = false
        // this.productFilterObj = {};
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
  delete(i){
    this.AddMaterialsList.splice(i,1);
    // this.projectDisable = this.AddMaterialsList.length ? true : false
  }
  // checkreq(){
  //   let flg = false
  //   if(this.openProject === "Y" && this.projectMand === "Y"){
  //     let getArrValue = Object.values(this.objProjectRequi);
  //     //console.log("getArrValue",getArrValue.length);
  //     if(getArrValue.indexOf(undefined) == -1){
  //       if(getArrValue.length === 5 || getArrValue.length > 5){
  //         flg = true
  //       }
  //       else {
  //         flg = false
  //       }
  //     }
  //     else {
  //       flg = false
  //     }
  //   }
  //   else {
  //     flg = true
  //   }
  //   return flg
  // }
  SaveRequi(valid){ 
    //console.log("valid",valid);
    this.validatation = true;
    // this.validatation.required = true;
    this.ngxService.start();
    if(valid){
      if(this.AddMaterialsList.length){
       this.Spinner = true;
       this.ngxService.start();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "s",
        sticky: true,
        closable: false,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
      }
      else{
        this.Spinner = false;
        this.ngxService.stop();
       this.compacctToast.add({
         key: "compacct-toast",
         severity: "error",
         summary: "Warn Message",
         detail: "Error Occured "
       });
      }
    }
    else {
      this.Spinner = false;
      this.ngxService.stop();
    }
  }
  onConfirmSave(){
       let saveData:any = [];
       // let mgs = "";
       // if(this.ReqNo){
  
       // }
       // else{
       //  mgs = "Save"
         const consCenterFilter:any = this.costcenterList.filter((el:any)=> Number(el.Cost_Cen_ID) === Number(this.objreqi.Cost_Cen_ID))
         this.AddMaterialsList.forEach((el:any)=>{
         let save = {
          // Req_No: this.reqDocNo ? this.reqDocNo : "A",
          Req_No: "A",
          Req_Date: this.requi_Date ? this.DateService.dateConvert(new Date(this.requi_Date)) : new Date(),
          Sub_Ledger_ID : this.objreqi.Sub_Ledger_ID,
          Wo_Doc_No : this.objreqi.Wo_Doc_No,
          Cost_Cen_ID: Number(this.objreqi.Cost_Cen_ID),
          Cost_Cen_Name: consCenterFilter[0].Cost_Cen_Name,
          Product_ID: Number(el.Product_ID),
          Product_Description: el.Product_Description,
          Req_Qty: Number(el.Req_Qty),
          UOM: el.UOM,
          Purpose: el.Purpose,
          Created_By: el.Created_By ? el.Created_By : this.$CompacctAPI.CompacctCookies.User_ID,
          Godown_ID: this.objreqi.Godown_ID,
          Product_Type_ID : Number(el.Product_Type_ID),
          Product_Type : el.Product_Type,
          Type_Of_Product : el.Product_Category,
          To_Cost_Cen_ID : 3,
          Remarks : this.objreqi.Remarks,
          Requisiton_Type : this.Requisition_ID,
          Material_Type : this.Material_Type_ID,
          Challan_No : el.Challan_No
         }
         saveData.push(save)
         })
         //console.log("Save Data",saveData);
         const obj = {
          "SP_String": "SP_TXN_REQUISITION_FOR_ISSUE_CHARGABLE",
          "Report_Name_String": "Create Requisition",
          "Json_Param_String": JSON.stringify(saveData)
    
        }
        this.GlobalAPI.getData(obj).subscribe(async (data:any)=>{
          //console.log("After Data",data)
          this.docno = data[0].Column1;
          if(data[0].Column1){
           var mgs = this.buttonname === "Save" ? "Save" : "Update"
            //  if(this.objproject.PROJECT_ID){
            //    const projectSaveData = await this.SaveProject(data[0].Column1);
            //    if(projectSaveData){
            //      this.ngxService.stop();
            //      this.compacctToast.clear();
            //       this.compacctToast.add({
            //       key: "compacct-toast",
            //       severity: "success",
            //       summary: "Requisition No: " +data[0].Column1,
            //       detail: "Succesfully " + mgs
            //     });
            //    }
            //  }
             this.ngxService.stop();
             this.compacctToast.clear();
              this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Requisition No: " +data[0].Column1,
              detail: "Succesfully " + mgs
            });
           
            // this.SaveNPrintBill();
            // this.Print(data[0].Column1)
             this.clearData();
             this.Requisition_ID = undefined;
             this.Material_Type_ID = undefined;
             this.Spinner = false;
             this.searchData(true);
             this.tabIndexToView = 0;
             this.items = ["BROWSE", "CREATE"];
             this.buttonname = "Save";
             this.reqDocNo = undefined;
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
       // }
      
  }
  onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("s");
    this.Spinner = false;
    this.ngxService.stop();
  }

  clearData(){
    // if(this.openProject === "Y"){
    //   this.ProjectInput.clearData()
    // }
    this.requisitionmaterialFormSubmit = false;
    this.objmaterial = new material()
    // this.objproject = new project()
    this.objreqi = new reqi();
    this.objreqi.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.Getgodown(this.objreqi.Cost_Cen_ID);
    this.validatation = false;
    this.AddMaterialsList = [];
    this.ReqNo = undefined;
    // this.productListview = [];
    this.productList = [];
    this.requi_Date = new Date();
    // this.validatation.required = false;
    // this.reqValid = false;
    this.ProductCatList = [];
    this.productTypeList = [];
    this.Requisition_ID = undefined;
    // this.Material_Type_ID = undefined;
    // this.getMaterialType();
    // if (this.headerText === "Maintenance Indent") {
    //   this.Material_Type_ID = "M.R.O";
    //   this.mrodisabled = true;
    //   this.getProductCategory();
    //  } 
    //  else {
    //   this.Material_Type_ID = undefined;
    //   this.mrodisabled = false;
    //  }
  }

}
class BrowseData {
  From_Date: string;
  To_Date: string;
  Cost_Cen_ID : any;
  Godown_ID : any;
  To_Cost_Cen_ID :any
  }
  class reqi{
    Sub_Ledger_ID:any;
    Wo_Doc_No:any;
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
