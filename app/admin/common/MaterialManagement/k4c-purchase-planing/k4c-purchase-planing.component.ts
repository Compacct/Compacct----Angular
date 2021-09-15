import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { Router } from '@angular/router';

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

  ObjPurchasePlan : PurchasePlan = new PurchasePlan ();
  uomdisabeld = false;
  PurchaseFormSubmitted = false;
  localpurchaseFLag = false;
  Productlist = [];
  productaddSubmit = [];
  vendordisabled = false;
  vendorlist :any = [];
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
  //filteredData = [];

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
      Header: "Purchase Planning",
      Link: " Material Management -> Purchase Planning"
    });
    this.getproduct();
    this.getvendor();
    this.getproducttype();
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Save";
     this.clearData();
     this.productaddSubmit = [];
   }
   getproducttype(){
    //this.Productlist = [];
    // this.SelectedProductType = [];
    // let producttypelist = [];
    const obj = {
      "SP_String": "SP_Purchase_Planning",
      "Report_Name_String": "Get - Product Type",
     // "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.producttypelist = data;
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
   });
  }
   getproduct(){
    this.Productlist = [];
    //if(this.ObjaddbillForm.Cost_Cen_ID){
     //this.ObjProductaddForm.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    // console.log("Doc_Date =",this.DateService.dateConvert(new Date(this.myDate)))
    const TempObj = {
      Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
      Product_Type_ID : this.ObjPurchasePlan.Product_Type ? this.ObjPurchasePlan.Product_Type : 0
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
      Product_Type_ID  : this.ObjPurchasePlan.Product_Type ? this.ObjPurchasePlan.Product_Type : 0
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
  ProductDropdownChange(){
    if(this.data == "(Show All Products)"){
       this.getproduct();

    }
    if(this.data == "(Show Requisition Products)"){
     this.GetIndentProduct()

   }
  }
  getproductChange(){
    this.Productlist = [];
    //if(this.ObjaddbillForm.Cost_Cen_ID){
     //this.ObjProductaddForm.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    // console.log("Doc_Date =",this.DateService.dateConvert(new Date(this.myDate)))
    const TempObj = {
      Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
      Product_Type_ID : this.ObjPurchasePlan.Product_Type ? this.ObjPurchasePlan.Product_Type : 0
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
      Product_Type_ID  : this.ObjPurchasePlan.Product_Type ? this.ObjPurchasePlan.Product_Type : 0
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
  ProductTypeChange(){
    if(this.data == "(Show Requisition Products)"){
       this.getproductChange();

    }
    if(this.data == "(Show All Products)"){
     this.GetIndentProductChange()

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
   this.ObjPurchasePlan.Stock_Qty =  productObj.Last_Puchase_Qty;
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
    ordervalue = Number(this.ObjPurchasePlan.Sale_rate * this.ObjPurchasePlan.Stock_Qty);
    this.ObjPurchasePlan.Order_Value = ordervalue;
    this.ovaldisabled = true;
  }
  addProduct(valid){
    this.PurchaseFormSubmitted = true;
    if(valid){
      var Amount = Number(this.ObjPurchasePlan.Stock_Qty * this.ObjPurchasePlan.Sale_rate);
      // var AmtWithGST = Number(Amount * Number(this.ObjPurchasePlan.GST_Tax_Per) / 100);
      // var lastpurchaseGST = Number(Number(this.ObjPurchasePlan.Last_Purchase_Rate * this.ObjPurchasePlan.Last_Purchase_Qty * Number(this.ObjPurchasePlan.GST_Tax_Per)) / 100);
      var PT = this.producttypelist.filter((el) => el.Product_Type_ID == this.ObjPurchasePlan.Product_Type)[0];
      var VV = this.vendorlist.filter((elem) => elem.Sub_Ledger_ID == this.ObjPurchasePlan.Vendor)[0];
      var productObj = {
      //Product_Type_ID : this.ObjPurchasePlan.Product_Type_ID,
    // Product_Type : this.ObjPurchasePlan.product_type,
      Product_Type : this.ObjPurchasePlan.Product_Type ? PT.Product_Type : '-',
      Product_ID : this.ObjPurchasePlan.Product_ID,
      Product_Description : this.ObjPurchasePlan.Product_Description,
      UOM : this.ObjPurchasePlan.UOM,
      Weekly_Avg_Cons : this.ObjPurchasePlan.Weekly_Avg_Cons,
      Weekly_Cons_Value : this.ObjPurchasePlan.Weekly_Cons_Value,
      Last_Puchase_Date : this.DateService.dateConvert(new Date(this.LastPurDate)),
      Last_Puchase_Qty : this.ObjPurchasePlan.Last_Purchase_Qty,
      Last_Purchase_Rate : this.ObjPurchasePlan.Last_Purchase_Rate,
      //Last_Purchase_With_GST : Number(lastpurchaseGST),
      Current_Stock : this.ObjPurchasePlan.Current_Stock,
      Due_Payment : this.ObjPurchasePlan.Due_Payment,
      Stock_Qty : this.ObjPurchasePlan.Stock_Qty,
      Sale_rate : this.ObjPurchasePlan.Sale_rate,
      // Order_Qty :  this.ObjPurchasePlan.Stock_Qty,
      // Current_Rate : this.ObjPurchasePlan.Sale_rate,
      Order_Value : Number(Amount),
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
            UOM : item.UOM,
            Weekly_Avg_Cons : Number(item.Weekly_Avg_Cons),
            Weekly_Cons_Value : Number(item.Weekly_Cons_Value),
            Last_Puchase_Date : item.Last_Puchase_Date,
            Last_Puchase_Qty : Number(item.Last_Puchase_Qty),
            Last_Purchase_Rate : Number(item.Last_Purchase_Rate),
           // Last_Purchase_With_GST : item.Last_Purchase_With_GST,
            Current_Stock : Number(item.Current_Stock),
            Due_Payment : item.Due_Payment,
            //Order_Qty : item.Stock_Qty,
            //Current_Rate : item.Sale_rate,
            Stock_Qty : Number(item.Stock_Qty),
            Rate : Number(item.Sale_rate),
            Order_Value : item.Order_Value,
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
      //  this.To_Cost_Cent_ID = data[0].To_Cost_Cen_Name;
      // this.To_Godown_ID = data[0].To_godown_name;
      // this.From_outlet = data[0].From_Location;
      // this.To_outlet = data[0].From_Location1;
      // this.Batchno = data[0].Batch_No;
      // this.Return_reason = data[0].Return_Reason;
      //console.log("this.editList  ===",data);
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
  onReject(){}

  clearData(){
    this.ObjPurchasePlan = new PurchasePlan();
    this.localpurchaseFLag = false;
    this.vendordisabled = false;
    this.getproduct();
    this.uomdisabeld = false;
    //this.productaddSubmit = [];
    this.todayDate = new Date();
    this.LastPurDate = new Date();
    this.ovaldisabled = false;
  }



}

class PurchasePlan {
  Doc_No : string;
  Product_Type_ID : any;
  Product_Type : string;
  //product_type : string;
  Product_ID : any;
  Product_Description : string;
  Sale_rate : number;
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
  Estimated_Time_Of_Delivery : string;
  GST_Tax_Per : any;
  Order_Value : number;
  // From_godown_id : string;
  // To_godown_id : string;
  // To_Cost_Cen_ID : string;
  // From_Cost_Cen_ID : string;
  // Indent_List : string;
 }
 class Browse {
  Doc_No : any;
  start_date : Date ;
  end_date : Date;
}
