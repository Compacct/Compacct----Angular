import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-k4c-purchase-planing',
  templateUrl: './k4c-purchase-planing.component.html',
  styleUrls: ['./k4c-purchase-planing.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cPurchasePlaningComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save";
  CurrentDate = new Date();

  ObjMPtype : MPtype = new MPtype ();
  ObjPurchasePlan : PurchasePlan = new PurchasePlan ();
  uomdisabeld = false;
  PurchaseFormSubmitted = false;
  localpurchaseFLag = false;
  Productlist:any = [];
  productaddSubmit = [];
  vendordisabled = false;
  vendorlist :any = [];
  materialtypelist = [];
  producttypelist = [];
  SelectedProductType :any = [];
  productListFilter = [];
  backUpproductList = [];
  data = "(Show Requisition Products)";

  ObjBrowse : Browse = new Browse ();
  Searchedlist = [];
  ApprovedFLag = false;
  AuthPoppup = false;
  Doc_no = undefined;
  Doc_date = undefined;
  AuthorizedList : any= [];
  BackupSearchedlist = [];
  todayDate : any = new Date();
  LastPurDate : any = new Date();
  ovaldisabled = false;
  stockqtydisabled = false;
  ViewPoppup = false;
  ViewList = [];
  exceldataList = [];
  //filteredData = [];
  ObjStockLevel : StockLevel = new StockLevel ();
  StockLevelFormSubmitted = false;
  costcenlist = [];
  GodownList = [];
  StockReportSearchlist = [];
  Orderlist = [];
  productdisabled = false;
  BackupStockReportSearchlist = [];
  DistMaterialType = [];
  SelectedDistMaterialType = [];
  DistProductType = [];
  SelectedDistProductType = [];
  SearchFields = [];
  Appbuttonname = "Approved"

  Vendor_ID : any;
  Credit_Days : number;
  PPdoc_no : any;
  EditList = [];
  

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE", "ORDER-STOCK REPORT"];
    this.Header.pushHeader({
      Header: "Purchase Planning",
      Link: " Material Management -> Purchase Planning"
    });
    this.getproduct();
    this.getvendor();
    this.getmaterialtype();
    this.GetCostCen();
   // this.getproducttype();
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE", "ORDER-STOCK REPORT"];
     this.buttonname = "Save";
     this.Spinner = false;
    //  this.clearData();
    //  this.getproduct();
    //  this.producttypelist = [];
    //  this.productaddSubmit = [];
    //  this.ObjMPtype.Material_Type = undefined;
    //  this.ObjMPtype.Product_Type = undefined;
    //  this.todayDate = new Date();
      this.productaddSubmit = this.tabIndexToView ? this.productaddSubmit : [];
      this.ObjPurchasePlan = this.tabIndexToView ? this.ObjPurchasePlan : new PurchasePlan();
      this.Vendor_ID = this.tabIndexToView ? this.Vendor_ID : undefined;
      this.Credit_Days = this.tabIndexToView ? this.Credit_Days : undefined;
      this.ObjMPtype.Material_Type = this.tabIndexToView ? this.ObjMPtype.Material_Type : undefined;
      this.ObjMPtype.Product_Type = this.tabIndexToView ? this.ObjMPtype.Product_Type : undefined;
      this.productdisabled = this.tabIndexToView ? this.productdisabled : false;
      this.uomdisabeld = this.tabIndexToView ? this.uomdisabeld : false;
      this.Orderlist = this.tabIndexToView ? this.Orderlist : [];
      this.Productlist = this.tabIndexToView ? this.Productlist : this.getproduct();
     // this.data = "(Show Requisition Products)"
     //this.Productlist = [];
      this.PPdoc_no = undefined;
   }
   getmaterialtype(){
      this.producttypelist = [];
      // this.SelectedProductType = [];
      // let producttypelist = [];
      const obj = {
        "SP_String": "SP_Purchase_Planning",
        "Report_Name_String": "Get - Material Type"

     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.materialtypelist = data;
       console.log("material type list======",this.materialtypelist);
     });
   }
   getproducttype(id?){
    // this.Productlist = [];
    // this.SelectedProductType = [];
    // let producttypelist = [];
    this.ObjMPtype.Product_Type = undefined;
    this.ObjPurchasePlan.Product_ID = undefined;
    let Mtype;
       if(this.ObjMPtype.Material_Type ==='Store Item - N/Saleable') {
        Mtype = 'Store Item - Saleable';
       } else {
        Mtype = this.ObjMPtype.Material_Type;
       }
    const TempObj = {
      Material_Type : Mtype,
    }
    const obj = {
      "SP_String": "SP_Purchase_Planning",
      "Report_Name_String": "Get - Product Type",
      "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.producttypelist = data;
       this.ObjMPtype.Product_Type = id ? id : undefined;
     console.log("product type list======",this.producttypelist);
    //  producttypelist.forEach(el => {
    //   this.SelectedProductType.push(el.Product_Type_ID);
    //   this.productListFilter.push(
    //     {
    //       label: el.Product_Type,
    //       value: el.Product_Type_ID
    //     }
    //   )
    // })
    const d = id ? '' : this.getproduct();
   });
  }
   getproduct(id?){
    this.Productlist = [];
    this.ObjPurchasePlan.Product_ID = undefined;
    //if(this.ObjaddbillForm.Cost_Cen_ID){
     //this.ObjProductaddForm.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    // console.log("Doc_Date =",this.DateService.dateConvert(new Date(this.myDate)))
    const TempObj = {
      Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
      Product_Type_ID : this.ObjMPtype.Product_Type ? this.ObjMPtype.Product_Type : 0,
      Material_Type : this.ObjMPtype.Material_Type ? this.ObjMPtype.Material_Type : ''
    }
      const obj = {
        "SP_String": "SP_Purchase_Planning",
        "Report_Name_String": "Get - Product",
        "Json_Param_String": JSON.stringify([TempObj])

     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
         data.forEach(element => {
           element['label'] = element.Product_Description,
           element['value'] = element.Product_ID
         });
         this.Productlist = data;
         this.ObjPurchasePlan.Product_ID = id ? id : undefined;
        //  this.backUpproductList = this.Productlist;
        //  this.getproducttype();
       } else {
         this.Productlist = [];

       }
       console.log("select Product======",this.Productlist);
       this.data = "(Show Requisition Products)";

     });
  }
  GetIndentProduct(){
    this.Productlist = [];
    const TempObj ={
      Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
      Product_Type_ID  : this.ObjMPtype.Product_Type ? this.ObjMPtype.Product_Type : 0,
      Material_Type : this.ObjMPtype.Material_Type ? this.ObjMPtype.Material_Type : ''
    }
    const obj = {
      "SP_String": "SP_Purchase_Planning",
      "Report_Name_String": "GET_Indent_Product",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Productlist = data;
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Description,
          element['value'] = element.Product_ID
        });
        this.Productlist = data;
      } else {
        this.Productlist = [];

      }
      console.log("select Product======",this.Productlist);
      this.data = "(Show All Products)";

    })

  }
  GetStoreIndentProduct(){
    this.Productlist = [];
    const TempObj ={
      Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
      Product_Type_ID  : this.ObjMPtype.Product_Type ? this.ObjMPtype.Product_Type : 0,
      Material_Type : this.ObjMPtype.Material_Type ? this.ObjMPtype.Material_Type : ''
    }
    const obj = {
      "SP_String": "SP_Purchase_Planning",
      "Report_Name_String": "GET_Indent_Product_Store_Item",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Productlist = data;
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Description,
          element['value'] = element.Product_ID
        });
        this.Productlist = data;
      } else {
        this.Productlist = [];

      }
      console.log("select Product======",this.Productlist);
      this.data = "(Show All Products)";

    })

  }
  ProductDropdownChange(){
    if(this.data == "(Show All Products)"){
       this.getproduct();

    }
    if(this.ObjMPtype.Material_Type == "Raw Material" && this.data == "(Show Requisition Products)"){
     this.GetIndentProduct()

   }
   if(this.ObjMPtype.Material_Type == "Store Item - N/Saleable" && this.data == "(Show Requisition Products)"){
    this.GetStoreIndentProduct()

  }
  if(this.ObjMPtype.Material_Type == "Store Item - Saleable" && this.data == "(Show Requisition Products)"){
    this.GetStoreIndentProduct()

  }
  }
  getproductChange(){
    this.Productlist = [];
    this.ObjPurchasePlan.Product_ID = undefined;
    //if(this.ObjaddbillForm.Cost_Cen_ID){
     //this.ObjProductaddForm.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    // console.log("Doc_Date =",this.DateService.dateConvert(new Date(this.myDate)))
    const TempObj = {
      Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
      Product_Type_ID : this.ObjMPtype.Product_Type ? this.ObjMPtype.Product_Type : 0,
      Material_Type : this.ObjMPtype.Material_Type ? this.ObjMPtype.Material_Type : ''
    }
      const obj = {
        "SP_String": "SP_Purchase_Planning",
        "Report_Name_String": "Get - Product",
        "Json_Param_String": JSON.stringify([TempObj])

     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
         data.forEach(element => {
           element['label'] = element.Product_Description,
           element['value'] = element.Product_ID
         });
         this.Productlist = data;
       } else {
         this.Productlist = [];

       }
      // console.log("select Product======",this.Productlist);

     });
  }
  GetIndentProductChange(){
    this.Productlist = [];
    const TempObj ={
      Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
      Product_Type_ID  : this.ObjMPtype.Product_Type ? this.ObjMPtype.Product_Type : 0,
      Material_Type : this.ObjMPtype.Material_Type ? this.ObjMPtype.Material_Type : ''
    }
    const obj = {
      "SP_String": "SP_Purchase_Planning",
      "Report_Name_String": "GET_Indent_Product",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Productlist = data;
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Description,
          element['value'] = element.Product_ID
        });
        this.Productlist = data;
      } else {
        this.Productlist = [];

      }
    })

  }
  GetStoreIndentProductChange(){
    this.Productlist = [];
    const TempObj ={
      Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
      Product_Type_ID  : this.ObjMPtype.Product_Type ? this.ObjMPtype.Product_Type : 0,
      Material_Type : this.ObjMPtype.Material_Type ? this.ObjMPtype.Material_Type : ''
    }
    const obj = {
      "SP_String": "SP_Purchase_Planning",
      "Report_Name_String": "GET_Indent_Product_Store_Item",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Productlist = data;
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Description,
          element['value'] = element.Product_ID
        });
        this.Productlist = data;
      } else {
        this.Productlist = [];

      }
      console.log("select Product======",this.Productlist);
      //this.data = "(Show All Products)";

    })

  }
  ProductTypeChange(){
    if(this.data == "(Show Requisition Products)"){
       this.getproductChange();

    }
    if(this.ObjMPtype.Material_Type == "Raw Material" && this.data == "(Show All Products)"){
     this.GetIndentProductChange()

   }
   if(this.ObjMPtype.Material_Type == "Store Item - N/Saleable" && this.data == "(Show All Products)"){
    this.GetStoreIndentProductChange()

  }
  if(this.ObjMPtype.Material_Type == "Store Item - Saleable" && this.data == "(Show All Products)"){
    this.GetStoreIndentProductChange()

  }
  }
  // filterProduct(){
  //   if(this.SelectedProductType.length){
  //     let tempProduct = [];
  //     this.SelectedProductType.forEach(item => {
  //       this.backUpproductList.forEach((el,i)=>{

  //         const ProductObj = this.backUpproductList.filter((elem) => elem.Product_Type_ID == item)[i];
  //         //const ProductObj = el;
  //        // console.log("ProductObj",ProductObj);
  //         if(ProductObj)
  //         tempProduct.push(ProductObj)
  //       })
  //       })
  //    this.Productlist  = [...tempProduct];
  //  }
  //   else {
  //   this.Productlist  = [...this.backUpproductList];

  //   }
  // }
  ProductChange() {
  //this.ExpiredProductFLag = false;
 if(this.ObjPurchasePlan.Product_ID) {
   const ctrl = this;
   const productObj:any = $.grep(ctrl.Productlist,function(item:any) {return item.Product_ID == ctrl.ObjPurchasePlan.Product_ID})[0];
   //console.log(productObj);
   //this.ObjPurchasePlan.Product_Type = productObj.Product_Type;
   this.ObjPurchasePlan.Product_Description = productObj.Product_Description;
   this.ObjPurchasePlan.Sale_rate =  productObj.Last_Purchase_Rate;
   this.ObjPurchasePlan.Order_Qty =  productObj.Last_Puchase_Qty;
   this.ObjPurchasePlan.UOM = productObj.UOM;
   this.ObjPurchasePlan.Indent_Qty = productObj.Indent_Qty;
   this.uomdisabeld = true;
   this.ObjPurchasePlan.Last_Purchase_Rate =  productObj.Last_Purchase_Rate;
   this.ObjPurchasePlan.GST_Percentage = productObj.GST_Tax_Per;
   this.ObjPurchasePlan.Last_Purchase_Qty = productObj.Last_Puchase_Qty;
   this.ObjPurchasePlan.Current_Stock =  productObj.Current_Stock;
   this.ObjPurchasePlan.Due_Payment = productObj.Due_Payment;
   this.ObjPurchasePlan.Weekly_Avg_Cons =  productObj.Weekly_Avg_Cons;
   this.ObjPurchasePlan.Weekly_Cons_Value = productObj.Weekly_Cons_Value;
   this.ObjPurchasePlan.Estimated_Time_Of_Delivery = productObj.Estimated_Time_Of_Delivery;
   this.ObjPurchasePlan.GST_Tax_Per = productObj.GST_Tax_Per;
   this.ObjPurchasePlan.AL_UOM = productObj.Alt_UOM;
   this.ObjPurchasePlan.Pcs_UOM = productObj.UOM;
   this.ObjPurchasePlan.Alt_UOM = productObj.Alt_UOM;
   this.ObjPurchasePlan.Stock_UOM = productObj.UOM;
   this.ObjPurchasePlan.UOM_Qty = productObj.UOM_Qty;
  }
  }

  checkboxchange(){
    if(this.localpurchaseFLag){
      this.vendordisabled = true;
      this.Vendor_ID = undefined;
      this.Credit_Days = 0;
    } else {
      this.vendordisabled = false;
      this.Credit_Days = null;
    }
  }
  getvendor(){
     const obj = {
       "SP_String": "SP_Purchase_Planning",
       "Report_Name_String": "Get - vendor",
      // "Json_Param_String": JSON.stringify([TempObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.vendorlist = data;
        if(data.length) {
          data.forEach(element => {
            element['label'] = element.Sub_Ledger_Name,
            element['value'] = element.Sub_Ledger_ID
          });
          this.vendorlist = data;
         //  this.backUpproductList = this.Productlist;
         //  this.getproducttype();
        } else {
          this.vendorlist = [];
 
        }
      console.log("vendor list======",this.vendorlist);
    });
 }
 CreditDaysChange() {
  //this.ExpiredProductFLag = false;
 if(this.Vendor_ID) {
   const ctrl = this;
   const vendorCrDaysObj = $.grep(ctrl.vendorlist,function(item: any) {return item.Sub_Ledger_ID == ctrl.Vendor_ID})[0];
   console.log(vendorCrDaysObj);
   this.Vendor_ID = vendorCrDaysObj.Sub_Ledger_ID;
   this.ObjPurchasePlan.Vendor = vendorCrDaysObj.Sub_Ledger_Name;
   this.Credit_Days = vendorCrDaysObj.CR_Days;
   
  }
  }
  
  //CREATE CREDIT DAYS CHANGE IN GRID
  crdayschange(i){
    this.productaddSubmit[i].Credit_days = 0;
   // this.AuthorizedList[i].Credit_days = 0;
    if(this.productaddSubmit[i].Vendor_ID) {
      const ctrl = this;
      const CrDaysObj = $.grep(ctrl.vendorlist,function(item: any) {return Number(item.Sub_Ledger_ID) === Number(ctrl.productaddSubmit[i].Vendor_ID)});
      console.log(CrDaysObj);
      if(CrDaysObj.length) {
        this.productaddSubmit[i].Credit_days = CrDaysObj[0].CR_Days;
        this.productaddSubmit[i].Vendor = CrDaysObj[0].Sub_Ledger_Name;
        //this.AuthorizedList[i].Credit_days = CrDaysObj[0].CR_Days;
      }      
     }
  }

  // APPROVED CREDIT DAYS CHANGE
  crdchange(i){
    this.AuthorizedList[i].Credit_days = 0;
    if(this.AuthorizedList[i].Sub_Ledger_ID) {
      const ctrl = this;
      const CrObj = $.grep(ctrl.vendorlist,function(item: any) {return Number(item.Sub_Ledger_ID) === Number(ctrl.AuthorizedList[i].Sub_Ledger_ID)});
      console.log(CrObj);
      if(CrObj.length) {
        this.AuthorizedList[i].Credit_days = CrObj[0].CR_Days;
        this.AuthorizedList[i].Vendor_Name = CrObj[0].Sub_Ledger_Name;
      }      
     }
  }
  OrderValueChange(){
    var ordervalue = 0;
    var stockoty = 0;
    ordervalue = Number(this.ObjPurchasePlan.Sale_rate * this.ObjPurchasePlan.Order_Qty);
    this.ObjPurchasePlan.Order_Value = ordervalue;
    stockoty = Number(this.ObjPurchasePlan.Order_Qty * this.ObjPurchasePlan.UOM_Qty);
    this.ObjPurchasePlan.Stock_Qty = stockoty;
    this.ovaldisabled = true;
    this.stockqtydisabled = true;
  }
  addProduct(valid){
    this.PurchaseFormSubmitted = true;
    if(valid){
      var Amount = Number(this.ObjPurchasePlan.Order_Qty * this.ObjPurchasePlan.Sale_rate);
      // var AmtWithGST = Number(Amount * Number(this.ObjPurchasePlan.GST_Tax_Per) / 100);
      // var lastpurchaseGST = Number(Number(this.ObjPurchasePlan.Last_Purchase_Rate * this.ObjPurchasePlan.Last_Purchase_Qty * Number(this.ObjPurchasePlan.GST_Tax_Per)) / 100);
      var PT = this.producttypelist.filter((el) => el.Product_Type_ID == this.ObjMPtype.Product_Type)[0];
    //  var VV = this.vendorlist.filter((elem) => elem.Sub_Ledger_ID == this.Vendor_ID)[0];
      var productObj = {
      //Product_Type_ID : this.ObjPurchasePlan.Product_Type_ID,
    // Product_Type : this.ObjPurchasePlan.product_type,
      Material_Type : this.ObjMPtype.Material_Type,
      Product_Type : this.ObjMPtype.Product_Type ? PT.Product_Type : '-',
      Product_ID : this.ObjPurchasePlan.Product_ID,
      Product_Description : this.ObjPurchasePlan.Product_Description,
      Weekly_Avg_Cons : this.ObjPurchasePlan.Weekly_Avg_Cons,
      UOM : this.ObjPurchasePlan.UOM,
      Weekly_Cons_Value : this.ObjPurchasePlan.Weekly_Cons_Value,
      Last_Puchase_Date : this.DateService.dateConvert(new Date(this.LastPurDate)),
      Last_Puchase_Qty : this.ObjPurchasePlan.Last_Purchase_Qty,
      AL_UOM : this.ObjPurchasePlan.AL_UOM,
      Last_Purchase_Rate : this.ObjPurchasePlan.Last_Purchase_Rate,
      //Last_Purchase_With_GST : Number(lastpurchaseGST),
      Current_Stock : this.ObjPurchasePlan.Current_Stock,
      Pcs_UOM : this.ObjPurchasePlan.Pcs_UOM,
      Due_Payment : this.ObjPurchasePlan.Due_Payment,
      Order_Qty : this.ObjPurchasePlan.Order_Qty,
      Alt_UOM : this.ObjPurchasePlan.Alt_UOM,
      Sale_rate : this.ObjPurchasePlan.Sale_rate,
      // Order_Qty :  this.ObjPurchasePlan.Stock_Qty,
      // Current_Rate : this.ObjPurchasePlan.Sale_rate,
      Order_Value : Number(Amount),
      Stock_Qty : this.ObjPurchasePlan.Stock_Qty,
      Stock_UOM : this.ObjPurchasePlan.Stock_UOM,
      Estimated_Time_Of_Delivery : this.ObjPurchasePlan.Estimated_Time_Of_Delivery,
      //Total_Amount_With_GST : Number(AmtWithGST),
     // Indent_Qty : this.ObjPurchasePlan.Indent_Qty ? this.ObjPurchasePlan.Indent_Qty : '-',
      Remarks : this.ObjPurchasePlan.Remarks ? this.ObjPurchasePlan.Remarks : '-',
     // Vendor :  VV.Sub_Ledger_Name ? VV.Sub_Ledger_Name : this.ObjPurchasePlan.Vendor,
      Vendor_ID :  this.localpurchaseFLag ? 456 : this.Vendor_ID,
      Vendor : this.localpurchaseFLag ? "Local Purchase" : this.ObjPurchasePlan.Vendor,
      Credit_days : this.Credit_Days
    };
    this.productaddSubmit.push(productObj);
    console.log("Product Submit",this.productaddSubmit);
    this.PurchaseFormSubmitted = false;
    this.clearData();
    //this.ObjPurchasePlan = new PurchasePlan();
    //this.localpurchaseFLag = false;
    }
   }
   getClass(obj){
     return  Number(obj.Last_Purchase_Rate) > Number(obj.Sale_rate) ? "text-green-active" : Number(obj.Last_Purchase_Rate) < Number(obj.Sale_rate) ? "text-red-active" : "";
   }
   textcolor(col){
    return  Number(col.Last_Purchase_Rate) > Number(col.Rate) ? "text-green-active" : Number(col.Last_Purchase_Rate) < Number(col.Rate) ? "text-red-active" : "";
  }
   delete(index) {
    this.productaddSubmit.splice(index,1)

  }
  dataforSaveProduct(){
    // console.log(this.DateService.dateConvert(new Date(this.myDate)))
    // this.ObjSaveForm.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    if(this.productaddSubmit.length) {
      let tempArr =[]
      this.productaddSubmit.forEach(item => {
        const obj = {
            //Product_Type_ID : item.Product_Type_ID,
            Product_Type : item.Product_Type,
            Product_ID : item.Product_ID,
            Product_Description : item.Product_Description,
            Weekly_Avg_Cons : Number(item.Weekly_Avg_Cons),
            UOM : item.UOM,
            Weekly_Cons_Value : Number(item.Weekly_Cons_Value),
            Last_Puchase_Date : item.Last_Puchase_Date,
            Last_Puchase_Qty : Number(item.Last_Puchase_Qty),
            Order_UOM : item.UOM,
            Last_Purchase_Rate : Number(item.Last_Purchase_Rate),
           // Last_Purchase_With_GST : item.Last_Purchase_With_GST,
            Current_Stock : Number(item.Current_Stock),
            Due_Payment : item.Due_Payment,
            //Order_Qty : item.Stock_Qty,
            //Current_Rate : item.Sale_rate,
            Stock_Qty : Number(item.Stock_Qty),
            Rate : Number(item.Sale_rate),
            Order_Value : item.Order_Value,
            Order_Stock_Qty : item.Stock_Qty,
            Order_Stock_UOM : item.Stock_UOM,
            Estimated_Time_Of_Delivery : Number(item.Estimated_Time_Of_Delivery),
            Indent_Qty : 0,
            //Total_Amount_With_GST : item.Total_Amount_With_GST,
            Remarks : item.Remarks,
            Sub_Ledger_ID : item.Vendor_ID,
            Vendor_Name : item.Vendor,
            Credit_days : item.Credit_days,

            GST_PER	 : 0,
            Last_Purchase_With_GST	: 0,
            Monthly_Req_Value	 : 0,
            Order_Qty	: Number(item.Order_Qty),
            Amount	: item.Order_Value,
            Total_Amount_With_GST	: 0,
            Created_By	: '',
            Created_On	: '',
            Autho_One	 : '',
            Autho_Two	: '',
            Autho_Two_Staus	: 'NA',
            Ref_PO_Doc_No	: 'NA',
            Ref_PO_Doc_Date	: '',
            Confirm_Qty	: 0,
            Confirm_Rate	: 0,
            Confirm_Amount	: 0,
            Confirm_Amount_With_GST	 : 0,

        }

        const TempObj = {
         // UOM : "PCS",
          Doc_No : this.PPdoc_no ? this.PPdoc_no : "A",
          Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
          User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
          Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
          //Return_Reason_ID : this.ObjProductaddForm.Return_Reason_ID
          Autho_One_Staus : "NO"

        }
        tempArr.push({...obj,...TempObj})
      });
      console.log(tempArr)
      return JSON.stringify(tempArr);

    }
   }
  SaveProduct(){
    this.Spinner = true;
    const obj = {
      "SP_String": "SP_Purchase_Planning",
      "Report_Name_String" : "Save Purchase Order Planning",
     "Json_Param_String": this.dataforSaveProduct()

    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log(data);
      var tempID = data[0].Column1;
      this.PPdoc_no = data[0].Column1;
      if(data[0].Column1){
        this.compacctToast.clear();
        //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Return_ID  " + tempID,
         detail: "Succesfully Created" //+ mgs
       });
       this.clearData();
       this.Vendor_ID = undefined;
       this.Credit_Days = undefined;
       this.getproduct();
       this.producttypelist = [];
       this.data = "(Show Requisition Products)"
      // this.Productlist = [];
       this.todayDate = new Date();
       this.ObjMPtype.Material_Type = undefined;
       this.ObjMPtype.Product_Type = undefined;
       this.productaddSubmit =[];
       this.Spinner = false;
       //this.ObjSaveForm = new SaveForm();
       this.GetDataforUpdate();

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
   GetDataforUpdate(){
     this.EditList = [];
    //console.log(this.ObjBrowse.Doc_No);
    const obj = {
      "SP_String": "SP_Purchase_Planning",
      "Report_Name_String": "Get Data For Approved",
      "Json_Param_String": JSON.stringify([{Doc_No : this.PPdoc_no}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.EditList = data;
       this.PPdoc_no = data[0].Doc_No;
       this.todayDate = new Date(data[0].Doc_Date);
       this.ObjMPtype.Material_Type = data[0].Material_Type;
       this.getproducttype(data[0].Product_Type_ID);
       this.ObjMPtype.Product_Type = data[0].Product_Type_ID;
       this.LastPurDate = new Date(data[0].Last_Puchase_Date);
       this.Vendor_ID = data[0].Sub_Ledger_ID;
       this.Credit_Days = data[0].Credit_days;
      console.log("this.EditList  ===",this.EditList);
      this.EditList.forEach(ele => {
        const  productObj = {
          Material_Type : ele.Material_Type,
          //Product_Type_ID : ele.Product_Type_ID,
          Product_Type : ele.Product_Type ? ele.Product_Type : '-',
          Product_ID : ele.Product_ID,
          Product_Description : ele.Product_Description,
          Weekly_Avg_Cons : ele.Weekly_Avg_Cons,
          UOM : ele.Order_UOM,
          Weekly_Cons_Value : ele.Weekly_Cons_Value,
          Last_Puchase_Date : this.DateService.dateConvert(new Date(ele.Last_Puchase_Date)),
          Last_Puchase_Qty : ele.Last_Puchase_Qty,
          AL_UOM : ele.Order_Stock_UOM,
          Last_Purchase_Rate : ele.Last_Purchase_Rate,
          //Last_Purchase_With_GST : Number(lastpurchaseGST),
          Current_Stock : ele.Current_Stock,
          Pcs_UOM : ele.Order_Stock_UOM,
          Due_Payment : ele.Due_Payment,
          Order_Qty : ele.Order_Qty,
          Alt_UOM : ele.Order_UOM,
          Sale_rate : ele.Rate,
          // Order_Qty :  this.ObjPurchasePlan.Stock_Qty,
          // Current_Rate : this.ObjPurchasePlan.Sale_rate,
          Order_Value : Number(ele.Order_Qty) * ele.Rate,
          Stock_Qty : ele.Order_Stock_Qty,
          Stock_UOM : ele.Order_Stock_UOM,
          Estimated_Time_Of_Delivery : ele.Estimated_Time_Of_Delivery,
          //Total_Amount_With_GST : Number(AmtWithGST),
         // Indent_Qty : this.ObjPurchasePlan.Indent_Qty ? this.ObjPurchasePlan.Indent_Qty : '-',
          Remarks : ele.Remarks ? ele.Remarks : '-',
         // Vendor :  VV.Sub_Ledger_Name ? VV.Sub_Ledger_Name : this.ObjPurchasePlan.Vendor,
          Vendor_ID :  ele.Sub_Ledger_ID,
          Vendor : ele.Vendor_Name,
          Credit_days : ele.Credit_days
       };
        this.productaddSubmit.push(productObj);
   });
    })
   }

   // CREATE TAB END

   getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
   GetSearchedlist(){
    //this.SearchFactoryFormSubmit = true;
    this.seachSpinner = true;
    this.Searchedlist = [];
    const start = this.ObjBrowse.start_date
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
    : this.DateService.dateConvert(new Date());
  const end = this.ObjBrowse.end_date
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
    : this.DateService.dateConvert(new Date());
   // if(valid){
  const tempobj = {
    From_Date : start,
    To_Date : end
  }
  const obj = {
    "SP_String": "SP_Purchase_Planning",
    "Report_Name_String": "Browse Purchase Order Planning",
    "Json_Param_String": JSON.stringify([tempobj])
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Searchedlist = data;
     this.BackupSearchedlist = data;
     //console.log('Search list=====',this.Searchedlist)
     this.seachSpinner = false;
    // this.SearchFactoryFormSubmit = false;
   })
  // }
   }
   ApprovedCheckBox(){
    //  if(this.ApprovedFLag){
    //   var App = this.Searchedlist.filter((elem) => elem.Autho_One_Staus == "APPROVED")[0];
    //   return App ;
    //  }
    //  console.log("approved==",App)
     this.Searchedlist = []
     if(this.ApprovedFLag){
      this.BackupSearchedlist.forEach(el=>{
        if(el.Autho_One_Staus === "APPROVED" || el.Autho_One_Staus === "YES"){
          this.Searchedlist.push(el);
        }
      })
    }
    else{
      this.Searchedlist = this.BackupSearchedlist;
    }
    console.log("approved==",this.Searchedlist)
   }
   getTotalValue(key){
    let Amtval = 0;
    this.AuthorizedList.forEach((item)=>{
      Amtval += Number(item[key]);
    });

    return Amtval ? Amtval.toFixed(2) : '-';
  }
  // getTotalGSTAmtValue(){
  //   let GSTAmtval = 0;
  //   this.AuthorizedList.forEach((item)=>{
  //     GSTAmtval += Number(item.Total_Amount_With_GST)
  //   });

  //   return GSTAmtval ? GSTAmtval : '-';
  // }
  View(DocNo){
    this.Doc_no = undefined;
    this.Doc_date = undefined;
    if(DocNo.Doc_No){
    this.ObjBrowse.Doc_No = DocNo.Doc_No;
    //this.ViewPoppup = true;
    this.getViewdetails(this.ObjBrowse.Doc_No);;
    }
   }
   getViewdetails(Doc_No){
    //console.log(this.ObjBrowse.Doc_No);
    const obj = {
      "SP_String": "SP_Purchase_Planning",
      "Report_Name_String": "Get Data For Approved",
      "Json_Param_String": JSON.stringify([{Doc_No : this.ObjBrowse.Doc_No}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ViewList = data;
      this.Doc_no = data[0].Doc_No;
       this.Doc_date = new Date(data[0].Doc_Date);
      // this.To_Cost_Cent_ID = data[0].To_Cost_Cen_Name;
      // this.To_Godown_ID = data[0].To_godown_name;
      // this.From_outlet = data[0].From_Location;
      // this.To_outlet = data[0].From_Location1;
      // this.Batchno = data[0].Batch_No;
      // this.Return_reason = data[0].Return_Reason;
      console.log("this.ViewList  ===",this.ViewList);
      for(let i = 0; i < this.ViewList.length ; i++){
      this.ViewList[i].Confirm_Qty = this.ViewList[i].Order_Qty;
      this.ViewList[i].Confirm_Rate = this.ViewList[i].Rate;
      this.ViewList[i].Confirm_Amount = this.ViewList[i].Confirm_Qty * this.ViewList[i].Confirm_Rate;
      this.ViewList[i].Confirm_Amount_With_GST = ((this.ViewList[i].Confirm_Qty * this.ViewList[i].Confirm_Rate) * this.ViewList[i].GST_PER) / 100;
      }
       this.ViewPoppup = true;
    })
   }
  //   excel(DocNo){
  //   this.Doc_no = undefined;
  //   this.Doc_date = undefined;
  //   if(DocNo.Doc_No){
  //   this.ObjBrowse.Doc_No = DocNo.Doc_No;
  //   //this.ViewPoppup = true;
  //   this.getexceldata(this.ObjBrowse.Doc_No);;
  //   }
  //  }
  //  getexceldata(Doc_No){
  //   //console.log(this.ObjBrowse.Doc_No);
  //   const obj = {
  //     "SP_String": "SP_Purchase_Planning",
  //     "Report_Name_String": "Get Data For Approved",
  //     "Json_Param_String": JSON.stringify([{Doc_No : this.ObjBrowse.Doc_No}])

  //   }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //     this.exceldataList = data;
  //   })
  //  }
  exportoexcel2(tempobj,fileName){
    const obj = {
      "SP_String": "SP_Purchase_Planning",
      "Report_Name_String": "Get Data For Approved",
      "Json_Param_String": JSON.stringify([{Doc_No : tempobj.Doc_No}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      XLSX.writeFile(workbook, fileName+'.xlsx');
      
    })
  }

   exportoexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
  exportoexcel3(Arr,fileName): void {
    let temp:any = [];
     Arr.forEach(element => {
       const obj = {
        Product_Type : element.Product_Type,
        Product_ID : element.Product_ID,
        Product_Description : element.Product_Description,
        UOM : element.UOM,
        Last_Purchase_Qty : element.Last_Purchase_Qty,
        Last_Purchase_Rate : element.Last_Purchase_Rate,
        Last_Purchase_Date : this.DateService.dateConvert(new Date(element.Last_Purchase_Date)),
        Weekly_Avg_Cons : element.Weekly_Avg_Cons,
        Stock_Qty : element.Stock_Qty,
        Reorder_Level : element.Reorder_Level,
        Critical_Level : element.Critical_Level
       }
       temp.push(obj)
     });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(temp);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
   Authorized(DocNo){
    //this.clearData();
    //this.filteredData = [];
    this.Doc_no = undefined;
    this.Doc_date = undefined;
    // this.To_Cost_Cent_ID = undefined;
    // this.To_Godown_ID = undefined;
    // this.From_outlet = undefined;
    // this.To_outlet = undefined;
    // this.Return_reason = undefined;
    if(DocNo.Doc_No){
    this.ObjBrowse.Doc_No = DocNo.Doc_No;
    // this.AuthPoppup = true;
    //this.ViewPoppup = true;
    if(DocNo.Autho_One_Staus == "YES") {
      this.Appbuttonname = "Re-Approved"
    } else {
      this.Appbuttonname = "Approved"
    }
    //this.tabIndexToView = 1;
     //console.log("this.EditDoc_No ", this.Adv_Order_No );
    this.getAuthdetails(this.ObjBrowse.Doc_No);;
    }
   }
   getAuthdetails(Doc_No){
    //console.log(this.ObjBrowse.Doc_No);
    const obj = {
      "SP_String": "SP_Purchase_Planning",
      "Report_Name_String": "Get Data For Approved",
      "Json_Param_String": JSON.stringify([{Doc_No : this.ObjBrowse.Doc_No}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.AuthorizedList = data;
      this.Doc_no = data[0].Doc_No;
       this.Doc_date = new Date(data[0].Doc_Date);
      // this.To_Cost_Cent_ID = data[0].To_Cost_Cen_Name;
      // this.To_Godown_ID = data[0].To_godown_name;
      // this.From_outlet = data[0].From_Location;
      // this.To_outlet = data[0].From_Location1;
      // this.Batchno = data[0].Batch_No;
      // this.Return_reason = data[0].Return_Reason;
      console.log("this.AuthorizedList  ===",this.AuthorizedList);
      for(let i = 0; i < this.AuthorizedList.length ; i++){
      this.AuthorizedList[i].Confirm_Qty = this.AuthorizedList[i].Order_Qty;
      this.AuthorizedList[i].Confirm_Rate = this.AuthorizedList[i].Rate;
      this.AuthorizedList[i].Confirm_Amount = Number(this.AuthorizedList[i].Confirm_Qty * this.AuthorizedList[i].Confirm_Rate).toFixed(2);
      this.AuthorizedList[i].Confirm_Amount_With_GST = Number(((this.AuthorizedList[i].Confirm_Qty * this.AuthorizedList[i].Confirm_Rate) * this.AuthorizedList[i].GST_PER) / 100).toFixed(2);
      //this.AuthorizedList[i].Vendor_Name = this.AuthorizedList[i].Sub_Ledger_ID;
      }
       this.AuthPoppup = true;
    })
   }
   confirmamountcalculate(indx){
    this.AuthorizedList[indx]['Confirm_Amount'] =  undefined;
    if(this.AuthorizedList[indx]['Order_Qty'] && this.AuthorizedList[indx]['Rate']){
      this.AuthorizedList[indx]['Confirm_Amount'] = Number(this.AuthorizedList[indx]['Confirm_Qty'] * this.AuthorizedList[indx]['Confirm_Rate']).toFixed(2);
      this.AuthorizedList[indx]['Confirm_Amount_With_GST'] = Number(((this.AuthorizedList[indx]['Confirm_Qty'] * this.AuthorizedList[indx]['Confirm_Rate']) * this.AuthorizedList[indx]['GST_PER']) / 100).toFixed(2);
    }
   }
   dataforApproved(){
    // console.log(this.DateService.dateConvert(new Date(this.myDate)))
    // this.ObjSaveForm.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    if(this.AuthorizedList.length) {
      let Arr =[]
      this.AuthorizedList.forEach(item => {
        const Obj = {
            //Product_Type : item.Product_Type,
            Product_ID : item.Product_ID,
            // Product_Description : item.Product_Description,
            // Indent_Qty : item.Indent_Qty,
            // Order_Qty : item.Stock_Qty,
            // Rate : item.Sale_rate,
            // Amount : item.Amount,
            Confirm_Qty : item.Confirm_Qty,
            Confirm_Rate : item.Confirm_Rate,
            Confirm_Amount : item.Confirm_Amount,
            Confirm_Amount_With_GST : item.Confirm_Amount_With_GST,
            // Autho_One : item.Autho_One,
            // Remarks : item.Remarks,
            Sub_Ledger_ID : item.Sub_Ledger_ID,
            Vendor_Name : item.Vendor_Name,
            Credit_days : item.Credit_days

        }

        const ObjTemp = {
         // UOM : "PCS",
          Doc_No : this.ObjBrowse.Doc_No,
          // Doc_Date : this.DateService.dateConvert(new Date(this.CurrentDate)),
          // User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
          // Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
          // //Return_Reason_ID : this.ObjProductaddForm.Return_Reason_ID
          // Autho_One_Staus : "APPROVED"

        }
        Arr.push({...Obj,...ObjTemp})
      });
      console.log(Arr)
      return JSON.stringify(Arr);

    }
   }
  Approved(){
    const obj = {
      "SP_String": "SP_Purchase_Planning",
      "Report_Name_String" : "UPDATE Confirm",
     "Json_Param_String": this.dataforApproved()

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
         detail: "Approved" //+ mgs
       });
       this.AuthPoppup = false;
       this.GetSearchedlist();
       //this.ObjSaveForm = new SaveForm();

      } else{
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

   // BROWSE TAB END

   GetCostCen(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Non Outlet Cost Centre"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.costcenlist = data;
      //this.Objproduction.From_Cost_Cen_ID = this.Fcostcenlist.length === 21 ? this.Fcostcenlist[0].From_Cost_Cen_ID : undefined;
      this.ObjStockLevel.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      //console.log("Cost Cen List ===",this.Fcostcenlist);
      this.GetGodown();
    })
  }
  GetGodown(){
    const tempObj = {
      //Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
      Cost_Cen_ID : this.ObjStockLevel.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.GodownList = data;
      this.ObjStockLevel.Godown_ID = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
     // this.ObjStockLevel.Godown_ID = data[0].godown_id;
       //console.log("From Godown List ===",this.FromGodownList);
    })
  }
  StockReportSearch(valid){
    const tempobj = {
      Cost_Cen_ID : this.ObjStockLevel.Cost_Cen_ID,
      Godown_ID : this.ObjStockLevel.Godown_ID
    }
    if(valid){
    const obj = {
      "SP_String": "SP_Purchase_Planning",
      "Report_Name_String": "Product For Order Stock Report",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      const Red = [];
      const Orange = [];
      const Blue = [];
      const Other = [];
      data.forEach(e=>{
        if(e.Color_Code === 'Red'){
          e['textClass'] = 'text-red';
          Red.push(e);        
        } else if(e.Color_Code === 'Orange') {
          e['textClass'] = 'text-orange';
          Orange.push(e);
        } else if(e.Color_Code === 'Blue'){
          e['textClass'] = 'text-blue';
          Blue.push(e);
        }else {
          e['textClass'] = '';
          Other.push(e);
        }
      })
      const ang = [];
       this.StockReportSearchlist = ang.concat(Red, Orange, Blue,Other);
       this.BackupStockReportSearchlist = data;
       this.GetDistinct();
       console.log('Stock Report search list=====',this.StockReportSearchlist)
       this.seachSpinner = false;
      // this.SearchFactoryFormSubmit = false;
     })
     }
  }
  // DISTINCT & FILTER
  GetDistinct() {
    let DMaterialType = [];
    let DProductType = [];
    this.DistMaterialType =[];
    this.SelectedDistMaterialType =[];
    this.DistProductType =[];
    this.SelectedDistProductType =[];
    this.SearchFields =[];
    this.StockReportSearchlist.forEach((item) => {
   if (DMaterialType.indexOf(item.Material_Type) === -1) {
    DMaterialType.push(item.Material_Type);
   this.DistMaterialType.push({ label: item.Material_Type, value: item.Material_Type });
   }
  if (DProductType.indexOf(item.Product_Type_ID) === -1) {
    DProductType.push(item.Product_Type_ID);
    this.DistProductType.push({ label: item.Product_Type, value: item.Product_Type_ID });
    }
  });
     this.BackupStockReportSearchlist = [...this.StockReportSearchlist];
  }
  FilterDist() {
    let DMaterialType = [];
    let DProductType = [];
    this.SearchFields =[];
  if (this.SelectedDistMaterialType.length) {
    this.SearchFields.push('Material_Type');
    DMaterialType = this.SelectedDistMaterialType;
  }
  if (this.SelectedDistProductType.length) {
    this.SearchFields.push('Product_Type_ID');
    DProductType = this.SelectedDistProductType;
  }
  this.StockReportSearchlist = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupStockReportSearchlist.filter(function (e) {
      return (DMaterialType.length ? DMaterialType.includes(e['Material_Type']) : true)
      && (DProductType.length ? DProductType.includes(e['Product_Type_ID']) : true)
    });
  this.StockReportSearchlist = LeadArr.length ? LeadArr : [];
  } else {
  this.StockReportSearchlist = [...this.BackupStockReportSearchlist] ;
  }
  }
   Order(pro_id){
     //this.clearData();
    if(pro_id.Product_ID){
    this.ObjStockLevel.Product_ID = pro_id.Product_ID;
    this.tabIndexToView = 1;
    this.productdisabled = true;
    this.uomdisabeld = true;
    //this.items = ["BROWSE", "CREATE", "ORDER-STOCK REPORT"];
    // this.buttonname = "Save";
    // console.log("this.EditDoc_No ", this.Adv_Order_No );
    this.getOrderdetails(this.ObjStockLevel.Product_ID);
    }
  }
  getOrderdetails(Product_ID){
    const tempobj = {
      Product_ID : this.ObjStockLevel.Product_ID,
      Material_Type : this.ObjStockLevel.Material_Type,
      Cost_Cen_ID : this.ObjStockLevel.Cost_Cen_ID,
      Godown_ID : this.ObjStockLevel.Godown_ID
    }
    const obj = {
      "SP_String": "SP_Purchase_Planning",
      "Report_Name_String": "Product Details For Order",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Orderlist = data;
       console.log('Orderlist list=====',this.Orderlist)
       this.ObjMPtype.Material_Type = data[0].Material_Type;
       this.getproducttype(data[0].Product_Type_ID);
       this.ObjMPtype.Product_Type = data[0].Product_Type_ID;
       this.ObjPurchasePlan.Product_ID = data[0].Product_ID;
       this.getproduct(data[0].Product_ID);
       this.ObjPurchasePlan.Product_Description = data[0].Product_Description;
       this.ObjPurchasePlan.Weekly_Avg_Cons = data[0].Weekly_Avg_Cons;
       this.ObjPurchasePlan.UOM = data[0].UOM;
       this.ObjPurchasePlan.Weekly_Cons_Value = data[0].Weekly_Cons_Value;
       this.LastPurDate = this.DateService.dateConvert(new Date(data[0].Last_Purchase_Date));
       this.ObjPurchasePlan.Last_Purchase_Qty = data[0].Last_Purchase_Qty;
       this.ObjPurchasePlan.AL_UOM = data[0].Alt_UOM;
       this.ObjPurchasePlan.Last_Purchase_Rate = data[0].Last_Purchase_Rate;
       this.ObjPurchasePlan.GST_Percentage = data[0].GST_Tax_Per;
       this.ObjPurchasePlan.Current_Stock = data[0].Stock_Qty;
       this.ObjPurchasePlan.Pcs_UOM = data[0].UOM;
       this.ObjPurchasePlan.Alt_UOM = data[0].Alt_UOM;
       this.ObjPurchasePlan.Stock_UOM = data[0].UOM;
       this.ObjPurchasePlan.UOM_Qty = data[0].UOM_Qty;
       this.ObjPurchasePlan.Due_Payment = data[0].Due_Payment;
       this.ObjPurchasePlan.Sale_rate = data[0].Last_Purchase_Rate;

     })
  }
  onReject(){}

  // ORDER STOCK REPORT END

  clearData(){
    this.ObjPurchasePlan = new PurchasePlan();
    this.localpurchaseFLag = false;
    this.vendordisabled = false;
    //this.getproduct();
    this.uomdisabeld = false;
    //this.productaddSubmit = [];
    // this.todayDate = new Date();
    this.LastPurDate = new Date();
    this.ovaldisabled = false;
    this.stockqtydisabled = false;
    // this.ObjStockLevel.Material_Type = undefined;
    // this.ObjStockLevel.Godown_ID = undefined;
    // this.StockReportSearchlist = [];
    this.productdisabled = false;
    this.Orderlist = [];
  }
  Refresh(){
    this.ObjMPtype = new MPtype();
    this.ObjPurchasePlan = new PurchasePlan();
    this.localpurchaseFLag = false;
    this.vendordisabled = false;
    this.getproduct();
    this.uomdisabeld = false;
    //this.productaddSubmit = [];
    this.todayDate = new Date();
    this.LastPurDate = new Date();
    this.ovaldisabled = false;
    this.stockqtydisabled = false;
    // this.ObjStockLevel.Material_Type = undefined;
    // this.ObjStockLevel.Godown_ID = undefined;
    // this.StockReportSearchlist = [];
    this.productdisabled = false;
    this.Orderlist = [];
  }



}

class MPtype {
  Material_Type : string;
  Product_Type_ID : any;
  Product_Type : string;
}

class PurchasePlan {
  Doc_No : string;
  // Product_Type_ID : any;
  // Product_Type : string;
  //product_type : string;
  Product_ID : any;
  Product_Description : string;
  Sale_rate : number;
  Order_Qty : number;
  Stock_Qty : number;
  Indent_Qty : number;
  UOM : string;
  Doc_Date : string;
  Remarks : any;
  Vendor : string;
  Vendor_ID : any;
  Last_Purchase_Rate : number;
  GST_Percentage : any;
  Last_Purchase_Qty : number;
  Last_Purchase_With_GST : number;
  Current_Stock : number;
  Due_Payment : any;
  Weekly_Avg_Cons : number;
  Weekly_Cons_Value : number;
  Estimated_Time_Of_Delivery : number;
  GST_Tax_Per : any;
  Order_Value : number;
  // From_godown_id : string;
  // To_godown_id : string;
  // To_Cost_Cen_ID : string;
  // From_Cost_Cen_ID : string;
  // Indent_List : string;
  AL_UOM : string;
  Pcs_UOM : string;
  Alt_UOM : string;
  Stock_UOM : string;
  UOM_Qty : number;
  Credit_Days : number;
 }
 class Browse {
  Doc_No : any;
  start_date : Date ;
  end_date : Date;
}
 class StockLevel {
  Material_Type : string;
  Cost_Cen_ID : any;
  Godown_ID : any ;
  Product_ID : any;
}
