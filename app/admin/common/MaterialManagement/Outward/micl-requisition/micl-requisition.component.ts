import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR, ThrowStmt } from "@angular/compiler/src/output/output_ast";

import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";

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
  items = [];
  tabIndexToView = 0;
  menuList = [];
  requi_Date = new Date();
  reqiFormSubmitted = false;
  objreqi:reqi = new reqi();
  DepartmentList = [];
  objmaterial:material = new material()
  AddMaterialsList = []
  requisitionmaterialFormSubmit = false;
  allRequDataList = [];
  costcenterList = [];
  GodownList = [];
  GodownBrowseList =[]
  productListview = []
  productList = []
  ReqNo = undefined;
  can_popup = false;
  act_popup = false;
  initDate = [];
  ObjBrowseData : BrowseData = new BrowseData ();
  RequistionSearchFormSubmit = false;
  seachSpinner = false;
  productTypeList = [];
  constructor(private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Requisition",
      Link: "Material Management -> Outward -> Requisition"
    });
    this.getCostcenter();
    this.GetProductsDetalis();
    this.getProductType();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData(){
    this.requisitionmaterialFormSubmit = false;
    this.objmaterial = new material()
    this.objreqi = new reqi();
    this.objreqi.Cost_Cen_ID = this.costcenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
    this.reqiFormSubmitted = false;
    this.AddMaterialsList = [];
    this.ReqNo = undefined;
    this.can_popup = false;
    this.act_popup = false;
    this.productListview = [];
    this.productList = [];
    this.requi_Date = new Date();
   }
  addMaterials(valid){
  console.log("valid",valid);
  this.requisitionmaterialFormSubmit = true;
  if(valid){
    const productFilter = this.productListview.filter(el=>Number(el.Product_ID) === Number(this.objmaterial.Product_ID));
    const productTypeFilter = this.productTypeList.filter(el=> Number(el.Product_Type_ID) === Number(this.objmaterial.Product_Type_ID))
     console.log("productFilter",productFilter);
    if(productFilter.length){
      this.AddMaterialsList.push({
        Product_ID: this.objmaterial.Product_ID,
        Product_Description: productFilter[0].Product_Description,
        Req_Qty: this.objmaterial.Req_Qty,
        UOM: this.objmaterial.UOM,
        Remarks: this.objmaterial.Remarks,
        Created_By: this.$CompacctAPI.CompacctCookies.User_ID,
        Product_Type_ID : this.objmaterial.Product_Type_ID,
        Product_Type : productTypeFilter[0].Product_Type
      })
      this.requisitionmaterialFormSubmit = false;
      this.objmaterial = new material();
      this.productList = [];
      this.productListview = [];

    }
  
  }
  }
  SaveRequi(valid){
   console.log("valid",valid);
   this.reqiFormSubmitted = true;
   if(valid){
     if(this.AddMaterialsList.length){
      let saveData = [];
      let mgs = "";
      if(this.ReqNo){
 
      }
      else{
       mgs = "Save"
        const consCenterFilter = this.costcenterList.filter(el=> Number(el.Cost_Cen_ID) === Number(this.objreqi.Cost_Cen_ID))
        this.AddMaterialsList.forEach(el=>{
        let save = {
         Req_No: "A",
         Req_Date: this.requi_Date ? this.DateService.dateConvert(new Date(this.requi_Date)) : new Date(),
         Cost_Cen_ID: Number(this.objreqi.Cost_Cen_ID),
         Cost_Cen_Name: consCenterFilter[0].Cost_Cen_Name,
         Product_ID: Number(el.Product_ID),
         Product_Description: el.Product_Description,
         Req_Qty: Number(el.Req_Qty),
         UOM: el.UOM,
         Remarks: el.Remarks,
         Created_By: el.Created_By,
         Godown_ID: this.objreqi.Godown_ID,
         Product_Type_ID : Number(el.Product_Type_ID),
         Product_Type : el.Product_Type
        }
        saveData.push(save)
        })
        console.log("Save Data",saveData);
        const obj = {
         "SP_String": "SP_Txn_Requisition",
         "Report_Name_String": "Create_Requisition",
         "Json_Param_String": JSON.stringify(saveData)
   
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log("After Data",data)
         if(data[0].Column1){
           this.ngxService.stop();
           this.compacctToast.clear();
            this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Requisition No: " +data[0].Column1,
            detail: "Succesfully " + mgs
          });
            this.clearData();
            this.searchData(true);
            this.tabIndexToView = 0;
            } else{
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
  delete(i){
    this.AddMaterialsList.splice(i,1);
  }
  onReject(){
    this.compacctToast.clear("c");
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
        })
    }
    else{
      this.GodownBrowseList = [];
      this.ObjBrowseData.Godown_ID = undefined;
    }

   
  }
  getProductType(){
    const obj = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Get_product_Type_Details"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
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
        "Json_Param_String": JSON.stringify([{Product_Type_ID : Number(this.objmaterial.Product_Type_ID)}])
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
      const ProductFilter = this.productListview.filter(el=> Number(el.Product_ID) === Number(this.objmaterial.Product_ID))
      console.log("ProductFilter",ProductFilter);
       this.objmaterial.UOM = ProductFilter[0].UOM
    }
  }
  getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseData.From_Date = dateRangeObj[0];
      this.ObjBrowseData.To_Date = dateRangeObj[1];
    }
  }
  searchData(valid){
    this.RequistionSearchFormSubmit = true;
    if(valid){
      this.seachSpinner = true
      const tempDate = {
        From_Date :this.ObjBrowseData.From_Date
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.From_Date))
        : this.DateService.dateConvert(new Date()),
        To_Date :this.ObjBrowseData.To_Date
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.To_Date))
        : this.DateService.dateConvert(new Date()),
        Cost_Cen_ID :this.ObjBrowseData.Cost_Cen_ID ? this.ObjBrowseData.Cost_Cen_ID : 0,
        Godown_ID : this.ObjBrowseData.Godown_ID ? this.ObjBrowseData.Godown_ID : 0
      }
      const obj = {
        "SP_String": "SP_Txn_Requisition",
        "Report_Name_String": "Browse_Requisition",
        "Json_Param_String": JSON.stringify([tempDate])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.allRequDataList = data;
        this.RequistionSearchFormSubmit = false;
        this.seachSpinner = false
        console.log("this.allRequDataList",this.allRequDataList);
      })
    }
 
  }
  Active(col){
    console.log("col",col);
    this.can_popup = false;
     if(col.Req_No){
      this.act_popup = true;
      this.ReqNo = undefined;
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
  Cancel(col){
    this.act_popup = false;
     if(col.Req_No){
      this.ReqNo = undefined;
      this.ReqNo = col.Req_No;
      this.can_popup = true;
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
  onConfirm2(){
   if(this.ReqNo){

        const obj = {
          "SP_String": "SP_Txn_Requisition",
          // "Report_Name_String": "Active_Requisition",
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
        })
      }
      //this.ParamFlaghtml = undefined;
  }
  onConfirm(){
     if(this.ReqNo){
          const obj = {
            "SP_String": "SP_Txn_Requisition",
            "Report_Name_String": "Active_Requisition",
            // "Report_Name_String": "Cancel_Requisition",
            "Json_Param_String": JSON.stringify([{Req_No : this.ReqNo,Created_By : this.$CompacctAPI.CompacctCookies.User_ID}])
          }
          this.GlobalAPI.getData(obj).subscribe((data:any)=>{
            // console.log("del Data===", data[0].Column1)
            if (data[0].Column1 === "Done"){
            this.onReject();
            this.can_popup = false;
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Requisition No: " + this.ReqNo.toString(),
                detail: "Succesfully Activated"  
              });
              this.ReqNo = undefined;   
              this.searchData(true)
            }
          })
        }
    }
 
}

class reqi{
    Req_No:any;
    Req_Date:any;
    Cost_Cen_ID:any;
    Cost_Cen_Name:any;
    Godown_ID:any
   }

class material{
  Product_ID:any;
  Product_Description:any;
  Req_Qty:any;
  UOM:any;
  Remarks:any;
  Created_By:any;
  Product_Type_ID:any;
}

class BrowseData {
  From_Date: string;
  To_Date: string;
  Cost_Cen_ID : any;
  Godown_ID : any;
  }