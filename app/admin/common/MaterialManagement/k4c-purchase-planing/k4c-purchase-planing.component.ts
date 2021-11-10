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
  items = [];
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
  Productlist = [];
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
  AuthorizedList = [];
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
    //this.getproduct();
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
     this.clearData();
     this.productaddSubmit = [];
     this.ObjMPtype.Material_Type = undefined;
     this.ObjMPtype.Product_Type = undefined;
     this.todayDate = new Date();
     this.data = "(Show Requisition Products)"
     this.Productlist = [];
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
      Material_Type : this.ObjMPtype.Material_Type
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
      Material_Type : this.ObjMPtype.Material_Type
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
      Material_Type : this.ObjMPtype.Material_Type
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
      Material_Type : this.ObjMPtype.Material_Type
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
      Material_Type : this.ObjMPtype.Material_Type
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
      Material_Type : this.ObjMPtype.Material_Type
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
   const productObj = $.grep(ctrl.Productlist,function(item) {return item.Product_ID == ctrl.ObjPurchasePlan.Product_ID})[0];
   //console.log(productObj);
   //this.ObjPurchasePlan.Product_Type = productObj.Product_Type;
   this.ObjPurchasePlan.Product_Description = productObj.Product_Description;
   this.ObjPurchasePlan.Sale_rate =  productObj.Last_Purchase_Rate;
   this.ObjPurchasePlan.Order_Qty =  productObj.Last_Puchase_Qty;
   this.ObjPurchasePlan.UOM = productObj.UOM;
   this.ObjPurchasePlan.Indent_Qty = productObj.Indent_Qty;
   this.uomdisabeld = true;
   this.ObjPurchasePlan.Last_Purchase_Rate =  productObj.Last_Purchase_Rate;
   this.ObjPurchasePlan.Last_Purchase_Qty = productObj.Last_Puchase_Qty;
   this.ObjPurchasePlan.Current_Stock =  productObj.Current_Stock;
   this.ObjPurchasePlan.Due_Payment = productObj.Due_Payment;
   this.ObjPurchasePlan.Weekly_Avg_Cons =  productObj.Weekly_Avg_Cons;
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
    } else {
      this.vendordisabled = false;
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
      console.log("vendor list======",this.vendorlist);
    });
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
      var VV = this.vendorlist.filter((elem) => elem.Sub_Ledger_ID == this.ObjPurchasePlan.Vendor)[0];
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
      Vendor :  this.localpurchaseFLag ? "Local Purchase" : VV.Sub_Ledger_Name,
    };
    this.productaddSubmit.push(productObj);
    console.log("Product Submit",this.productaddSubmit);
    this.PurchaseFormSubmitted = false;
    // this.ObjPurchasePlan = new PurchasePlan();
    // this.localpurchaseFLag = false;
    this.clearData();
    }
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
            Stock_Qty : Number(item.Order_Qty),
            Rate : Number(item.Sale_rate),
            Order_Value : item.Order_Value,
            Order_Stock_Qty : item.Stock_Qty,
            Order_Stock_UOM : item.Stock_UOM,
            Estimated_Time_Of_Delivery : Number(item.Estimated_Time_Of_Delivery),
            Indent_Qty : 0,
            //Total_Amount_With_GST : item.Total_Amount_With_GST,
            Remarks : item.Remarks,
            Vendor_Name : item.Vendor,

            GST_PER	 : 0,
            Last_Purchase_With_GST	: 0,
            Monthly_Req_Value	 : 0,
            Order_Qty	: Number(item.Stock_Qty),
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
          Doc_No : "A",
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
      // this.getproduct();
       this.data = "(Show Requisition Products)"
       this.Productlist = [];
       this.todayDate = new Date();
       this.ObjMPtype.Material_Type = undefined;
       this.ObjMPtype.Product_Type = undefined;
       this.productaddSubmit =[];
       this.Spinner = false;
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

    return Amtval ? Amtval : '-';
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
      console.log("this.AuthorizedList  ===",this.AuthorizedList);
      for(let i = 0; i < this.AuthorizedList.length ; i++){
      this.AuthorizedList[i].Confirm_Qty = this.AuthorizedList[i].Order_Qty;
      this.AuthorizedList[i].Confirm_Rate = this.AuthorizedList[i].Rate;
      this.AuthorizedList[i].Confirm_Amount = this.AuthorizedList[i].Confirm_Qty * this.AuthorizedList[i].Confirm_Rate;
      this.AuthorizedList[i].Confirm_Amount_With_GST = ((this.AuthorizedList[i].Confirm_Qty * this.AuthorizedList[i].Confirm_Rate) * this.AuthorizedList[i].GST_PER) / 100;
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
   exportoexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
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
      this.AuthorizedList[i].Confirm_Amount = this.AuthorizedList[i].Confirm_Qty * this.AuthorizedList[i].Confirm_Rate;
      this.AuthorizedList[i].Confirm_Amount_With_GST = ((this.AuthorizedList[i].Confirm_Qty * this.AuthorizedList[i].Confirm_Rate) * this.AuthorizedList[i].GST_PER) / 100;
      }
       this.AuthPoppup = true;
    })
   }
   confirmamountcalculate(indx){
    this.AuthorizedList[indx]['Confirm_Amount'] =  undefined;
    if(this.AuthorizedList[indx]['Order_Qty'] && this.AuthorizedList[indx]['Rate']){
      this.AuthorizedList[indx]['Confirm_Amount'] = this.AuthorizedList[indx]['Confirm_Qty'] * this.AuthorizedList[indx]['Confirm_Rate'];
      this.AuthorizedList[indx]['Confirm_Amount_With_GST'] = ((this.AuthorizedList[indx]['Confirm_Qty'] * this.AuthorizedList[indx]['Confirm_Rate']) * this.AuthorizedList[indx]['GST_PER']) / 100;
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
            Confirm_Amount_With_GST : item.Confirm_Amount_With_GST
            // Autho_One : item.Autho_One,
            // Remarks : item.Remarks,
            // Vendor_Name : item.Vendor
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
  //   if(this.AuthorizedList.length) {
  //     this.AuthorizedList.forEach(item => {
  //   const tempobj = {
  //     Doc_No : this.ObjBrowse.Doc_No,
  //     Product_ID : item.Product_ID,
  //     Confirm_Qty : item.Confirm_Qty,
  //     Confirm_Rate : item.Confirm_Rate,
  //     Confirm_Amount : item.Confirm_Amount
  //   }
  // })
  // }
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
      Material_Type : this.ObjStockLevel.Material_Type,
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
          e['textClass'] = 'text-red-active';
          Red.push(e);        
        } else if(e.Color_Code === 'Orange') {
          e['textClass'] = 'text-orange-active';
          Orange.push(e);
        } else if(e.Color_Code === 'Blue'){
          e['textClass'] = 'text-blue-active';
          Blue.push(e);
        }else {
          e['textClass'] = '';
          Other.push(e);
        }
      })
      const ang = [];
       this.StockReportSearchlist = ang.concat(Red, Orange, Blue,Other);
       console.log('Stock Report search list=====',this.StockReportSearchlist)
       this.seachSpinner = false;
      // this.SearchFactoryFormSubmit = false;
     })
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
  //   if(this.StockReportSearchlist.length) {
  //     let arr =[]
  //     this.StockReportSearchlist.forEach(item => {
  //       const obj = {
  //           Product_ID : item.Product_ID
  //       }
  //       const objtemp = {
  //         Material_Type : this.ObjStockLevel.Material_Type,
  //         Cost_Cen_ID : this.ObjStockLevel.Cost_Cen_ID,
  //         Godown_ID : this.ObjStockLevel.Godown_ID

  //       }
  //       arr.push({...obj,...objtemp})
  //     });
  //     console.log(arr)
  //     return JSON.stringify(arr);

   // }
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
