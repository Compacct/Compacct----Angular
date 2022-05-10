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
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class GrnComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save";
  CurrentDate = new Date();

  GRNFormSubmitted = false;
  ObjGRN1 : GRN1 = new GRN1();
  ObjGRN : GRN = new GRN ();
  Supplierlist = [];
  POorderlist = [];
  PODate : any = "09/May/2022";//new Date();
  ProductDetailslist = [];

  GRN2FormSubmitted = false;
  ObjGRN2 : GRN2 = new GRN2();
  uomdisabeld = false;
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
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "GRN",
      Link: " Material Management -> Inward -> GRN"
    });
    this.GetSupplier();
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Save";
     this.Spinner = false;
    //  this.clearData();
   }
   GetSupplier(){
      this.producttypelist = [];
      const obj = {
        "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
        "Report_Name_String": "Get_Sub_Ledger"

     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.Supplierlist = data;
       console.log("Supplierlist======",this.Supplierlist);
     });
   }
   GetPOorder(){
    this.POorderlist = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "Get_Pending_PO_Order_Nos",
      "Json_Param_String": JSON.stringify([{Sub_Ledger_ID : this.ObjGRN1.Supplier}])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.POorderlist = data;
     console.log("POorderlist======",this.POorderlist);
   });
  }

  GetProductDetails(){
    this.ProductDetailslist = [];
    const postobj = {
      Doc_No : this.ObjGRN1.PO_Order
    }
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "Get_product_Details",
      "Json_Param_String": JSON.stringify([postobj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ProductDetailslist = data;
     console.log("POorderlist======",this.ProductDetailslist);
   });
   this.GetPODate();
 }
 GetRate(){
  this.ObjGRN.Rate = undefined;
  this.ObjGRN.Product_Details = undefined;
  this.ObjGRN.GST_Tax_Per = undefined;
  console.log(this.ObjGRN.Rate)
  if(this.ObjGRN.Product_ID) {
    const ctrl = this;
    const RateObj = $.grep(ctrl.ProductDetailslist,function(item: any) {return item.Product_ID == ctrl.ObjGRN.Product_ID})[0];
    console.log(RateObj);
    this.ObjGRN.Rate = RateObj.Rate;
    this.ObjGRN.Product_Details = RateObj.Product_Name;
    this.ObjGRN.GST_Tax_Per = RateObj.GST_Percentage;
 
   }
}
 GetPODate(){
  this.ObjGRN1.PO_Date = undefined;
  if(this.ObjGRN1.PO_Order) {
    const ctrl = this;
    const DateObj = $.grep(ctrl.POorderlist,function(item: any) {return item.Doc_No == ctrl.ObjGRN1.PO_Order})[0];
    console.log(DateObj);
    this.ObjGRN1.PO_Date = new Date(DateObj.Doc_Date);
    this.PODate = new Date(this.ObjGRN1.PO_Date);
 
   }
}
 Calculate() {
  //this.ExpiredProductFLag = false;
 if(Number(this.ObjGRN.Challan)) {
   this.ObjGRN.Rejected = Number(Number(this.ObjGRN.Challan) - Number(this.ObjGRN.Received)).toFixed(2);
   this.ObjGRN.Accepted = Number(Number(this.ObjGRN.Challan) - Number(this.ObjGRN.Rejected)).toFixed(2);
  }
  }
  
  Add(valid){
    this.GRNFormSubmitted = true;
    if(valid){
      var amount = Number(this.ObjGRN.Accepted * this.ObjGRN.Rate).toFixed(2);
      // var taxablevalue = Number((Number(amount) * 100) / Number(this.ObjGRN1.GST_Tax_Per) + 100).toFixed(2);
      var taxsgstcgst =  (Number(Number(amount) * Number(this.ObjGRN.GST_Tax_Per)) / 100).toFixed(2);
      var totalamount = (Number(amount) + Number(taxsgstcgst)).toFixed(2);
      // var PT = this.producttypelist.filter((el) => el.Product_Type_ID == this.ObjMPtype.Product_Type)[0];
      var productObj = {
      //Product_Type_ID : this.ObjPurchasePlan.Product_Type_ID,
    // Product_Type : this.ObjPurchasePlan.product_type,
      Product_ID : this.ObjGRN.Product_ID,
      Product_Details : this.ObjGRN.Product_Details,
      HSN_Code : this.ObjGRN.HSN_Code,
      Unit : this.ObjGRN.Unit,
      Challan : this.ObjGRN.Challan,
      Received : this.ObjGRN.Received,
      Rejected : this.ObjGRN.Rejected,
      Accepted : this.ObjGRN.Accepted,
      // Rate : this.DateService.dateConvert(new Date(this.LastPurDate)),
      Rate : this.ObjGRN.Rate,
      Taxable_Value : Number(amount).toFixed(2),
      GST_Tax_Per : Number(this.ObjGRN.GST_Tax_Per),
      //Last_Purchase_With_GST : Number(lastpurchaseGST),
      Tax : Number(taxsgstcgst).toFixed(2),
      Total_Amount : Number(totalamount).toFixed(2)
    };
    this.productaddSubmit.push(productObj);
    console.log("Product Submit",this.productaddSubmit);
    this.GRNFormSubmitted = false;
    // this.clearData();
    this.ObjGRN = new GRN();
    //this.localpurchaseFLag = false;
    }
   }
   delete(index) {
    this.productaddSubmit.splice(index,1)

  }
  dataforSaveProduct(){
    // // console.log(this.DateService.dateConvert(new Date(this.myDate)))
    // // this.ObjSaveForm.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    // if(this.productaddSubmit.length) {
    //   let tempArr =[]
    //   this.productaddSubmit.forEach(item => {
    //     const obj = {
    //         //Product_Type_ID : item.Product_Type_ID,
    //         Product_Type : item.Product_Type,
    //         Product_ID : item.Product_ID,
    //         Product_Description : item.Product_Description,
    //         Weekly_Avg_Cons : Number(item.Weekly_Avg_Cons),
    //         UOM : item.UOM,
    //         Weekly_Cons_Value : Number(item.Weekly_Cons_Value),
    //         Last_Puchase_Date : item.Last_Puchase_Date,
    //         Last_Puchase_Qty : Number(item.Last_Puchase_Qty),
    //         Order_UOM : item.UOM,
    //         Last_Purchase_Rate : Number(item.Last_Purchase_Rate),
    //        // Last_Purchase_With_GST : item.Last_Purchase_With_GST,
    //         Current_Stock : Number(item.Current_Stock),
    //         Due_Payment : item.Due_Payment,
    //         //Order_Qty : item.Stock_Qty,
    //         //Current_Rate : item.Sale_rate,
    //         Stock_Qty : Number(item.Stock_Qty),
    //         Rate : Number(item.Sale_rate),
    //         Order_Value : item.Order_Value,
    //         Order_Stock_Qty : item.Stock_Qty,
    //         Order_Stock_UOM : item.Stock_UOM,
    //         Estimated_Time_Of_Delivery : Number(item.Estimated_Time_Of_Delivery),
    //         Indent_Qty : 0,
    //         //Total_Amount_With_GST : item.Total_Amount_With_GST,
    //         Remarks : item.Remarks,
    //         Sub_Ledger_ID : item.Vendor_ID,
    //         Vendor_Name : item.Vendor,
    //         Credit_days : item.Credit_days,

    //         GST_PER	 : 0,
    //         Last_Purchase_With_GST	: 0,
    //         Monthly_Req_Value	 : 0,
    //         Order_Qty	: Number(item.Order_Qty),
    //         Amount	: item.Order_Value,
    //         Total_Amount_With_GST	: 0,
    //         Created_By	: '',
    //         Created_On	: '',
    //         Autho_One	 : '',
    //         Autho_Two	: '',
    //         Autho_Two_Staus	: 'NA',
    //         Ref_PO_Doc_No	: 'NA',
    //         Ref_PO_Doc_Date	: '',
    //         Confirm_Qty	: 0,
    //         Confirm_Rate	: 0,
    //         Confirm_Amount	: 0,
    //         Confirm_Amount_With_GST	 : 0,

    //     }

    //     const TempObj = {
    //      // UOM : "PCS",
    //       Doc_No : this.PPdoc_no ? this.PPdoc_no : "A",
    //       Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
    //       User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
    //       Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    //       //Return_Reason_ID : this.ObjProductaddForm.Return_Reason_ID
    //       Autho_One_Staus : "NO"

    //     }
    //     tempArr.push({...obj,...TempObj})
    //   });
    //   console.log(tempArr)
    //   return JSON.stringify(tempArr);

    // }
   }
   SaveGRN(valid){
    this.Spinner = true;
    this.GRN2FormSubmitted = true;
    if (valid && this.productaddSubmit.length) {
    // const obj = {
    //   "SP_String": "SP_Purchase_Planning",
    //   "Report_Name_String" : "Save Purchase Order Planning",
    //  "Json_Param_String": this.dataforSaveProduct()

    // }
    // this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    //   console.log(data);
    //   var tempID = data[0].Column1;
    //   this.PPdoc_no = data[0].Column1;
    //   if(data[0].Column1){
    //     this.compacctToast.clear();
    //     //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
    //     this.compacctToast.add({
    //      key: "compacct-toast",
    //      severity: "success",
    //      summary: "Return_ID  " + tempID,
    //      detail: "Succesfully Created" //+ mgs
    //    });
    //    this.clearData();
    //    this.Vendor_ID = undefined;
    //    this.Credit_Days = undefined;
    //    this.getproduct();
    //    this.producttypelist = [];
    //    this.data = "(Show Requisition Products)"
    //   // this.Productlist = [];
    //    this.todayDate = new Date();
    //    this.ObjMPtype.Material_Type = undefined;
    //    this.ObjMPtype.Product_Type = undefined;
    //    this.productaddSubmit =[];
    //    this.Spinner = false;
    //    //this.ObjSaveForm = new SaveForm();
    //    this.GetDataforUpdate();

    //   } else{
    //     this.Spinner = false;
    //     this.compacctToast.clear();
    //     this.compacctToast.add({
    //       key: "compacct-toast",
    //       severity: "error",
    //       summary: "Warn Message",
    //       detail: "Error Occured "
    //     });
    //   }
    // })
    }

   }
   GetDataforUpdate(){
  //    this.EditList = [];
  //   //console.log(this.ObjBrowse.Doc_No);
  //   const obj = {
  //     "SP_String": "SP_Purchase_Planning",
  //     "Report_Name_String": "Get Data For Approved",
  //     "Json_Param_String": JSON.stringify([{Doc_No : this.PPdoc_no}])

  //   }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //      this.EditList = data;
  //      this.PPdoc_no = data[0].Doc_No;
  //      this.todayDate = new Date(data[0].Doc_Date);
  //      this.ObjMPtype.Material_Type = data[0].Material_Type;
  //      this.getproducttype(data[0].Product_Type_ID);
  //      this.ObjMPtype.Product_Type = data[0].Product_Type_ID;
  //      this.LastPurDate = new Date(data[0].Last_Puchase_Date);
  //      this.Vendor_ID = data[0].Sub_Ledger_ID;
  //      this.Credit_Days = data[0].Credit_days;
  //     console.log("this.EditList  ===",this.EditList);
  //     this.EditList.forEach(ele => {
  //       const  productObj = {
  //         Material_Type : ele.Material_Type,
  //         //Product_Type_ID : ele.Product_Type_ID,
  //         Product_Type : ele.Product_Type ? ele.Product_Type : '-',
  //         Product_ID : ele.Product_ID,
  //         Product_Description : ele.Product_Description,
  //         Weekly_Avg_Cons : ele.Weekly_Avg_Cons,
  //         UOM : ele.Order_UOM,
  //         Weekly_Cons_Value : ele.Weekly_Cons_Value,
  //         Last_Puchase_Date : this.DateService.dateConvert(new Date(ele.Last_Puchase_Date)),
  //         Last_Puchase_Qty : ele.Last_Puchase_Qty,
  //         AL_UOM : ele.Order_Stock_UOM,
  //         Last_Purchase_Rate : ele.Last_Purchase_Rate,
  //         //Last_Purchase_With_GST : Number(lastpurchaseGST),
  //         Current_Stock : ele.Current_Stock,
  //         Pcs_UOM : ele.Order_Stock_UOM,
  //         Due_Payment : ele.Due_Payment,
  //         Order_Qty : ele.Order_Qty,
  //         Alt_UOM : ele.Order_UOM,
  //         Sale_rate : ele.Rate,
  //         // Order_Qty :  this.ObjPurchasePlan.Stock_Qty,
  //         // Current_Rate : this.ObjPurchasePlan.Sale_rate,
  //         Order_Value : Number(ele.Order_Qty) * ele.Rate,
  //         Stock_Qty : ele.Order_Stock_Qty,
  //         Stock_UOM : ele.Order_Stock_UOM,
  //         Estimated_Time_Of_Delivery : ele.Estimated_Time_Of_Delivery,
  //         //Total_Amount_With_GST : Number(AmtWithGST),
  //        // Indent_Qty : this.ObjPurchasePlan.Indent_Qty ? this.ObjPurchasePlan.Indent_Qty : '-',
  //         Remarks : ele.Remarks ? ele.Remarks : '-',
  //        // Vendor :  VV.Sub_Ledger_Name ? VV.Sub_Ledger_Name : this.ObjPurchasePlan.Vendor,
  //         Vendor_ID :  ele.Sub_Ledger_ID,
  //         Vendor : ele.Vendor_Name,
  //         Credit_days : ele.Credit_days
  //      };
  //       this.productaddSubmit.push(productObj);
  //  });
  //   })
   }

   // CREATE TAB END

   getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  //  GetSearchedlist(){
  //   //this.SearchFactoryFormSubmit = true;
  //   this.seachSpinner = true;
  //   this.Searchedlist = [];
  //   const start = this.ObjBrowse.start_date
  //   ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
  //   : this.DateService.dateConvert(new Date());
  // const end = this.ObjBrowse.end_date
  //   ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
  //   : this.DateService.dateConvert(new Date());
  //  // if(valid){
  // const tempobj = {
  //   From_Date : start,
  //   To_Date : end
  // }
  // const obj = {
  //   "SP_String": "SP_Purchase_Planning",
  //   "Report_Name_String": "Browse Purchase Order Planning",
  //   "Json_Param_String": JSON.stringify([tempobj])
  // }
  //  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //    this.Searchedlist = data;
  //    this.BackupSearchedlist = data;
  //    //console.log('Search list=====',this.Searchedlist)
  //    this.seachSpinner = false;
  //   // this.SearchFactoryFormSubmit = false;
  //  })
  // // }
  //  }
  //  getTotalValue(key){
  //   let Amtval = 0;
  //   this.AuthorizedList.forEach((item)=>{
  //     Amtval += Number(item[key]);
  //   });

  //   return Amtval ? Amtval : '-';
  // }
   GetCostCen(){
    // const obj = {
    //   "SP_String": "SP_Production_Voucher",
    //   "Report_Name_String": "Get - Non Outlet Cost Centre"
    // }
    // this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //   this.costcenlist = data;
    //   //this.Objproduction.From_Cost_Cen_ID = this.Fcostcenlist.length === 21 ? this.Fcostcenlist[0].From_Cost_Cen_ID : undefined;
    //   this.ObjStockLevel.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    //   //console.log("Cost Cen List ===",this.Fcostcenlist);
    //   this.GetGodown();
    // })
  }
  GetGodown(){
    // const tempObj = {
    //   //Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    //   Cost_Cen_ID : this.ObjStockLevel.Cost_Cen_ID
    // }
    // const obj = {
    //   "SP_String": "SP_Production_Voucher",
    //   "Report_Name_String": "Get - Godown",
    //   "Json_Param_String": JSON.stringify([tempObj])
    // }
    // this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //   this.GodownList = data;
    //   this.ObjStockLevel.Godown_ID = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
    //  // this.ObjStockLevel.Godown_ID = data[0].godown_id;
    //    //console.log("From Godown List ===",this.FromGodownList);
    // })
  }
   Order(pro_id){
    //  //this.clearData();
    // if(pro_id.Product_ID){
    // this.ObjStockLevel.Product_ID = pro_id.Product_ID;
    // this.tabIndexToView = 1;
    // this.productdisabled = true;
    // this.uomdisabeld = true;
    // //this.items = ["BROWSE", "CREATE", "ORDER-STOCK REPORT"];
    // // this.buttonname = "Save";
    // // console.log("this.EditDoc_No ", this.Adv_Order_No );
    // this.getOrderdetails(this.ObjStockLevel.Product_ID);
    // }
  }
  getOrderdetails(Product_ID){
    // const tempobj = {
    //   Product_ID : this.ObjStockLevel.Product_ID,
    //   Material_Type : this.ObjStockLevel.Material_Type,
    //   Cost_Cen_ID : this.ObjStockLevel.Cost_Cen_ID,
    //   Godown_ID : this.ObjStockLevel.Godown_ID
    // }
    // const obj = {
    //   "SP_String": "SP_Purchase_Planning",
    //   "Report_Name_String": "Product Details For Order",
    //   "Json_Param_String": JSON.stringify([tempobj])
    // }
    //  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //    this.Orderlist = data;
    //    console.log('Orderlist list=====',this.Orderlist)
    //   //  this.ObjMPtype.Material_Type = data[0].Material_Type;
    //   //  this.getproducttype(data[0].Product_Type_ID);
    //   //  this.ObjMPtype.Product_Type = data[0].Product_Type_ID;
    //   //  this.ObjPurchasePlan.Product_ID = data[0].Product_ID;
    //   //  this.getproduct(data[0].Product_ID);
    //   //  this.ObjPurchasePlan.Product_Description = data[0].Product_Description;
    //   //  this.ObjPurchasePlan.Weekly_Avg_Cons = data[0].Weekly_Avg_Cons;
    //   //  this.ObjPurchasePlan.UOM = data[0].UOM;
    //   //  this.ObjPurchasePlan.Weekly_Cons_Value = data[0].Weekly_Cons_Value;
    //   //  this.LastPurDate = this.DateService.dateConvert(new Date(data[0].Last_Purchase_Date));
    //   //  this.ObjPurchasePlan.Last_Purchase_Qty = data[0].Last_Purchase_Qty;
    //   //  this.ObjPurchasePlan.AL_UOM = data[0].Alt_UOM;
    //   //  this.ObjPurchasePlan.Last_Purchase_Rate = data[0].Last_Purchase_Rate;
    //   //  this.ObjPurchasePlan.Current_Stock = data[0].Stock_Qty;
    //   //  this.ObjPurchasePlan.Pcs_UOM = data[0].UOM;
    //   //  this.ObjPurchasePlan.Alt_UOM = data[0].Alt_UOM;
    //   //  this.ObjPurchasePlan.Stock_UOM = data[0].UOM;
    //   //  this.ObjPurchasePlan.UOM_Qty = data[0].UOM_Qty;
    //   //  this.ObjPurchasePlan.Due_Payment = data[0].Due_Payment;
    //   //  this.ObjPurchasePlan.Sale_rate = data[0].Last_Purchase_Rate;

    //  })
  }
  onReject(){}

  // ORDER STOCK REPORT END

  clearData(){
    this.ObjGRN = new GRN();
    // this.localpurchaseFLag = false;
    // this.vendordisabled = false;
    // //this.getproduct();
    // this.uomdisabeld = false;
    // //this.productaddSubmit = [];
    // // this.todayDate = new Date();
    // this.LastPurDate = new Date();
    // this.ovaldisabled = false;
    // this.stockqtydisabled = false;
    // // this.ObjStockLevel.Material_Type = undefined;
    // // this.ObjStockLevel.Godown_ID = undefined;
    // // this.StockReportSearchlist = [];
    // this.productdisabled = false;
    // this.Orderlist = [];
  }
  // Refresh(){
  //   this.ObjMPtype = new MPtype();
  //   this.ObjPurchasePlan = new PurchasePlan();
  //   this.localpurchaseFLag = false;
  //   this.vendordisabled = false;
  //   this.getproduct();
  //   this.uomdisabeld = false;
  //   //this.productaddSubmit = [];
  //   this.todayDate = new Date();
  //   this.LastPurDate = new Date();
  //   this.ovaldisabled = false;
  //   this.stockqtydisabled = false;
  //   // this.ObjStockLevel.Material_Type = undefined;
  //   // this.ObjStockLevel.Godown_ID = undefined;
  //   // this.StockReportSearchlist = [];
  //   this.productdisabled = false;
  //   this.Orderlist = [];
  // }

}

class GRN1 {
  Supplier : any;
  RDB_No_Date : any;
  SE_No_Date : any;
  PO_Order : any;
  PO_Date : any;
  Mode_of_Transport : any;
  LR_No_Date : any;
  Vehicle_No : any;
}

class GRN {
  Product_ID : any;
  Product_Details : string;
  Rate : any;
  GST_Tax_Per : any;
  HSN_Code : any;
  Unit : string;
  Challan : any;
  Received : any;
  Rejected : any;
  Accepted : any;
  Doc_No : string;
  // Product_Type_ID : any;
  // Product_Type : string;
  //product_type : string;
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
 class GRN2 {
  Qty_Remarks : string;
  Quality_Remarks : string;
  Deduction_for_Rejection : string;
 }
 class Browse {
  Doc_No : any;
  start_date : Date ;
  end_date : Date;
}




