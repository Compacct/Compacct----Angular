import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";

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
  GRNDate = new Date();
  Supplierlist = [];
  CostCenterlist = [];
  Godownlist = [];
  POorderlist = [];
  PODate : any = new Date();
  podatedisabled = true;
  ProductDetailslist = [];

  GRN2FormSubmitted = false;
  ObjGRN2 : GRN2 = new GRN2();
  Productlist = [];
  productaddSubmit = [];

  Searchedlist = [];
  EditList = [];
  doc_no: any;

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "GRN",
      Link: " Material Management -> Inward -> GRN"
    });
    this.GetSupplier();
    this.GetCostCenter();
    this.GetSearchedlist();
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Save";
     this.Spinner = false;
    //  this.clearData();
     this.ObjGRN1 = new GRN1();
     this.GRNFormSubmitted = false;
     this.productaddSubmit = [];
     this.ObjGRN2 = new GRN2;
     this.GRN2FormSubmitted = false;
     this.PODate = new Date();
     this.podatedisabled = true;
     this.Spinner = false;
     this.Godownlist = [];
     this.POorderlist = [];
     this.ProductDetailslist = [];
   }
   GetSupplier(){
      this.Supplierlist = [];
      const obj = {
        "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
        "Report_Name_String": "Get_Sub_Ledger"

     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.Supplierlist = data;
       console.log("Supplierlist======",this.Supplierlist);
     });
   }
   GetCostCenter(){
    this.CostCenterlist = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "Get_Cost_Center"

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.CostCenterlist = data;
     console.log("CostCenterlist======",this.CostCenterlist);
   });
 }
 GetGodown(){
  this.Godownlist = [];
  const obj = {
    "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
    "Report_Name_String": "Get_Cost_Center_Godown",
    "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.ObjGRN1.Cost_Cen_ID}])

 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Godownlist = data;
   console.log("Godownlist======",this.Godownlist);
 });
}
   GetPOorder(){
    this.POorderlist = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "Get_Pending_PO_Order_Nos",
      "Json_Param_String": JSON.stringify([{Sub_Ledger_ID : this.ObjGRN1.Sub_Ledger_ID}])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.POorderlist = data;
     console.log("POorderlist======",this.POorderlist);
   });
  }

  GetProductDetails(){
    this.ProductDetailslist = [];
    const postobj = {
      Doc_No : this.ObjGRN1.PO_Doc_No
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
  this.ObjGRN1.PO_Doc_Date = undefined;
  this.podatedisabled = true;
  if(this.ObjGRN1.PO_Doc_No) {
    const ctrl = this;
    const DateObj = $.grep(ctrl.POorderlist,function(item: any) {return item.Doc_No == ctrl.ObjGRN1.PO_Doc_No})[0];
    console.log(DateObj);
    this.ObjGRN1.PO_Doc_Date = new Date(DateObj.Doc_Date);
    this.PODate = new Date(this.ObjGRN1.PO_Doc_Date);
    this.podatedisabled = false;
   }
   else {
     this.PODate = new Date();
     this.podatedisabled = true;
   }
}
 RecQtyValidation(){
   if (Number(this.ObjGRN.Received_Qty) && Number(this.ObjGRN.Received_Qty) > Number(this.ObjGRN.Challan_Qty)){
    // this.ngxService.stop();
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "Received Qty is more than Challan Qty "
  });
  return false;
   }
   this.Calculate();
 }
 Calculate() {
  //this.ExpiredProductFLag = false;
 if(Number(this.ObjGRN.Received_Qty) && Number(this.ObjGRN.Accepted_Qty)) {
   this.ObjGRN.Rejected_Qty = Number(Number(this.ObjGRN.Received_Qty) - Number(this.ObjGRN.Accepted_Qty)).toFixed(2);
  //  this.ObjGRN.Rejected = Number(Number(this.ObjGRN.Challan) - Number(this.ObjGRN.Received)).toFixed(2);
  //  this.ObjGRN.Accepted = Number(Number(this.ObjGRN.Challan) - Number(this.ObjGRN.Rejected)).toFixed(2);
  }
  else {
    this.ObjGRN.Rejected_Qty = 0;
  }
  }
  
  Add(valid){
    this.GRNFormSubmitted = true;
    if(valid){
      if (Number(this.ObjGRN.Received_Qty) && Number(this.ObjGRN.Received_Qty) <= Number(this.ObjGRN.Challan_Qty)){
        if (Number(this.ObjGRN.Rejected_Qty) >= 0) {
      var amount = Number(this.ObjGRN.Accepted_Qty * this.ObjGRN.Rate).toFixed(2);
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
      Challan : this.ObjGRN.Challan_Qty,
      Received : this.ObjGRN.Received_Qty,
      Rejected : this.ObjGRN.Rejected_Qty,
      Accepted : this.ObjGRN.Accepted_Qty,
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
         else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Rejected Qty is less than Zero "
          });
         }
        }
      else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Received Qty is more than Challan Qty "
        });
      }
   }
   }
   delete(index) {
    this.productaddSubmit.splice(index,1)

  }
  DataForSaveProduct(){
    // console.log(this.DateService.dateConvert(new Date(this.myDate)))
     this.ObjGRN1.GRN_Date = this.DateService.dateConvert(new Date(this.GRNDate));
     this.ObjGRN2.Created_By = this.$CompacctAPI.CompacctCookies.User_ID;
    if(this.productaddSubmit.length) {
      let tempArr =[]
      this.productaddSubmit.forEach(item => {
        const obj = {
            Product_ID : item.Product_ID,
            //Product_Description : item.Product_Description,
            HSN_Code : item.HSN_Code,
            UOM : item.Unit,
            Challan_Qty : Number(item.Challan),
            Received_Qty : Number(item.Received),
            Rejected_Qty : Number(item.Rejected),
            Accepted_Qty : Number(item.Accepted),
            Rate : Number(item.Rate),
            Taxable_Value : Number(item.Taxable_Value).toFixed(2),
            Tax_Percentage : item.GST_Tax_Per,
            Total_Tax_Amount : Number(item.Tax).toFixed(2),
            Total_Amount : Number(item.Total_Amount).toFixed(2),
            Remarks : item.Remarks,
        }

        // const TempObj = {
        //  // UOM : "PCS",
        //   Doc_No : this.PPdoc_no ? this.PPdoc_no : "A",
        //   Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
        //   User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
        //   Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        //   //Return_Reason_ID : this.ObjProductaddForm.Return_Reason_ID
        //   Autho_One_Staus : "NO"

        // }
        tempArr.push({...this.ObjGRN1,...obj,...this.ObjGRN2})
      });
      console.log(tempArr)
      return JSON.stringify(tempArr);

    }
   }
   SaveGRN(valid){
    this.Spinner = true;
    this.GRN2FormSubmitted = true;
    this.ngxService.start();
    if (valid && this.productaddSubmit.length) {
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String" : "Create_BL_Txn_Purchase_Challan_GRN",
     "Json_Param_String": this.DataForSaveProduct()

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
         detail: "Succesfully Saved" //+ mgs
       });
       this.ObjGRN1 = new GRN1();
       this.GRNFormSubmitted = false;
       this.productaddSubmit = [];
       this.ObjGRN2 = new GRN2;
       this.GRN2FormSubmitted = false;
       this.PODate = new Date();
       this.podatedisabled = true;
       this.Spinner = false;
       this.Godownlist = [];
       this.POorderlist = [];
       this.ProductDetailslist = [];
       this.ngxService.stop();
       this.GetSearchedlist();

      } 
      else{
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
    else{
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
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

  //  getDateRange(dateRangeObj) {
  //   if (dateRangeObj.length) {
  //     this.ObjBrowse.start_date = dateRangeObj[0];
  //     this.ObjBrowse.end_date = dateRangeObj[1];
  //   }
  // }
   GetSearchedlist(){
    //this.SearchFactoryFormSubmit = true;
    this.seachSpinner = true;
    this.Searchedlist = [];
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
  const obj = {
    "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
    "Report_Name_String": "Browse_BL_Txn_Purchase_Challan_GRN",
    // "Json_Param_String": JSON.stringify([tempobj])
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Searchedlist = data;
    //  this.BackupSearchedlist = data;
     //console.log('Search list=====',this.Searchedlist)
     this.seachSpinner = false;
    // this.SearchFactoryFormSubmit = false;
   })
  // }
   }
   Delete(data){
    this.doc_no = undefined;
    if (data.GRN_No) {
     this.doc_no = data.GRN_No;
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
   onConfirm(){
      const objj = {
       "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
       "Report_Name_String": "Delete_BL_Txn_Purchase_Challan_GRN",
       "Json_Param_String": JSON.stringify([{Doc_No : this.doc_no}])
      }
      this.GlobalAPI.getData(objj).subscribe((data:any)=>{
        //var msg = data[0].Column1;
        if (data[0].Column1){
          //this.onReject();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Doc No.: " + this.doc_no.toString(),
            detail: "Succefully Deleted"
          });
          this.GetSearchedlist();
        }
        else {
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
  onReject(){
   this.compacctToast.clear("c");
  }
  //  Order(pro_id){
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
  // }
  // getOrderdetails(Product_ID){
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
  // }


}

class GRN1 {
  GRN_Date : any;
  Sub_Ledger_ID : any;
  Cost_Cen_ID : any;
  godown_id : any;
  RDB_No_Date : any;
  SE_No_Date : any;
  PO_Doc_No : any;
  PO_Doc_Date : any;
  Mode_Of_transport : any;
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
  Challan_Qty : any;
  Received_Qty : any;
  Rejected_Qty : any;
  Accepted_Qty : any;
 }
 class GRN2 {
  Quantity_Remarks : string;
  Quality_Rejection_Remarks : string;
  Deduction_For_Rejection : string;
  Created_By : string;
 }
 class Browse {
  Doc_No : any;
  start_date : Date ;
  end_date : Date;
}




