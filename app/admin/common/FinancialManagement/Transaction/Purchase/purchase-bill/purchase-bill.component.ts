import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CompacctProjectComponent } from '../../../../../shared/compacct.components/compacct.forms/compacct-project/compacct-project.component';
import { Console } from 'console';

@Component({
  selector: 'app-purchase-bill',
  templateUrl: './purchase-bill.component.html',
  styleUrls: ['./purchase-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class PurchaseBillComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Create";
  currentdate = new Date();
  DocDate = new Date();
  CNDate : Date;
  SupplierBillDate : Date;

  VendorList = [];
  maindisabled = false;
  StateList = [];
  CostCenterList = [];
  GRNnoList = [];
  BackupGRNnoList = [];
  GRNFilter = [];
  SelectedGRNno = [];
  
  TGRNnoList = [];
  ProductDetails = [];
  BackUpProductDetails = [];

  PurchaseBillFormSubmitted = false;
  ObjPurChaseBill = new PurChaseBill();
  // ObjGRN : GRN = new GRN ();
  // GRNDate = new Date();
  Supplierlist = [];
  CostCenterlist = [];
  Godownlist = [];
  POorderlist = [];
  // PODate : any = new Date();
  podatedisabled = true;
  ProductDetailslist = [];

  GRN2FormSubmitted = false;
  ObjGRN2 : GRN2 = new GRN2();
  Productlist = [];
  productaddSubmit = [];

  Searchedlist = [];
  EditList = [];
  doc_no: any;
  SpinnerShow = false;
  inputBoxDisabled = false;
  companyList = [];
  
  openProject = "N"
  projectMand = "N";
  objproject : project = new project();
  validatation = {
    required : false,
    projectMand : 'N'
  }
  projectEditData =[]
  @ViewChild("project", { static: false })
  ProjectInput: CompacctProjectComponent;
  CurrencyList = [];
  GodownList = [];
  PODate : Date;
  PurOrderList = [];
  ObjProductInfo = new ProductInfo();
  ProductInfoSubmitted = false;
  expiryDate : Date;
  GRNDate : Date;
  headerData = ""
  GRNList = [];
  PONoProList = [];
  GRNNoProlist = [];
  Maintain_Serial_No = false;
  Product_Expiry = false;
  Is_Service = false;
  Batch_No = undefined;
  AddProductDetails = [];
  @ViewChild("SerialNo", { static: false }) SerialNo: ElementRef;
  Total_Amount = undefined;
  Dis_Amount = undefined;
  Total_Taxable = undefined;
  CGST_Amount = undefined;
  SGST_Amount = undefined;
  IGST_Amount = undefined;
  CESS = undefined;
  Gross_Amount : any;
  Round_off : any;
  Net_Amt : any;
  Total_GST : any;
  Total_Tax : any;

  ObjTDS = new TDS();
  TDSFormSubmitted = false;
  LedgerList = [];
  SubLedgerList = [];
  AddTdsDetails = [];

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService,
    private route: ActivatedRoute,
    ) {
      this.route.queryParams.subscribe(params => {
        console.log(params);
        this.headerData = params['header'];
        this.openProject = params['proj'];
        this.projectMand = params['mand'];
        this.validatation.projectMand = params['mand']
       })
     }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE", "REPORT"];
    this.Header.pushHeader({
      Header: this.headerData,
      Link: " Financial Management -> Purchase -> this.headerData"
    });
    this.GetVendor();
    this.GetStateList();
    this.GetCostcenter();
    this.getcompany();
    this.GetCurrency();
    this.ObjPurChaseBill.RCM = "N";
    this.GetProductdetails();
    this.GetLedger();
    // this.GetSearchedlist();
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE", "REPORT"];
     this.buttonname = "Save";
     this.Spinner = false;
     this.clearData();
    //  this.ObjGRN1 = new GRN1();
    //  this.GRNFormSubmitted = false;
     this.productaddSubmit = [];
     this.ObjGRN2 = new GRN2;
     this.GRN2FormSubmitted = false;
    //  this.PODate = new Date();
    //  this.podatedisabled = true;
     this.Spinner = false;
     this.Godownlist = [];
     this.POorderlist = [];
     this.ProductDetailslist = [];
     this.ObjPurChaseBill.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
   }
   onReject(){}
   clearData(){
     this.ObjPurChaseBill = new PurChaseBill();
     this.ObjPurChaseBill.Sub_Ledger_Address_1 = "MAIN";
     this.ObjPurChaseBill.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.ObjPurChaseBill.Revenue_Cost_Cent_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.GetCosCenAddress();
     this.DocDate = new Date();
     this.PurOrderList = [];
     this.GRNList = [];
     this.GetProductdetails();
     this.PONoProList = [];
     this.GRNNoProlist = [];
     this.ObjPurChaseBill.Currency_ID = 1;
     this.ObjPurChaseBill.RCM = "N";
     this.AddProductDetails = [];
     this.clearlistamount();
   }
   getcompany(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Dropdown_Company",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.companyList = data
     console.log("companyList",this.companyList)
     this.ObjPurChaseBill.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    })
  }
   GetVendor(){
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Subledger_SC",
     // "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.VendorList = data;
      //  if(data.length) {
      //    data.forEach(element => {
      //      element['label'] = element.Sub_Ledger_Name,
      //      element['value'] = element.Sub_Ledger_ID
      //    });
         this.VendorList = data;
        //  this.backUpproductList = this.Productlist;
        //  this.getproducttype();
      //  } else {
        //  this.VendorList = [];

      //  }
     console.log("vendor list======",this.VendorList);
   });
  }
   VenderNameChange(){
     //this.ExpiredProductFLag = false;
   if(this.ObjPurChaseBill.Sub_Ledger_ID) {
    const ctrl = this;
    const vendorObj = $.grep(ctrl.VendorList,function(item: any) {return item.value == ctrl.ObjPurChaseBill.Sub_Ledger_ID})[0];
    console.log(vendorObj);
    this.ObjPurChaseBill.Sub_Ledger_Billing_Name = vendorObj.Sub_Ledger_Billing_Name;
    this.GetChooseAddress();
    this.GetPurOrderNoList();
   }
   }
   GetChooseAddress(){
    //this.ExpiredProductFLag = false;
  // if(this.ObjPurChaseBill.Sub_Ledger_ID) {
    if(this.ObjPurChaseBill.Sub_Ledger_Address_1) {
   const ctrl = this;
   const MainObj = $.grep(ctrl.VendorList,function(item: any) {return item.value == ctrl.ObjPurChaseBill.Sub_Ledger_ID})[0];
   console.log(MainObj);
   this.maindisabled = true;
   this.ObjPurChaseBill.Sub_Ledger_State = MainObj.Sub_Ledger_State;
   this.ObjPurChaseBill.Sub_Ledger_GST_No = MainObj.GST;
   this.ObjPurChaseBill.Sub_Ledger_Address_2 = MainObj.Sub_Ledger_Address_1;//+','+ MainObj.Sub_Ledger_Address_2 +','+ MainObj.Sub_Ledger_Address_3;
   this.ObjPurChaseBill.Sub_Ledger_Land_Mark = MainObj.Sub_Ledger_Land_Mark;
   this.ObjPurChaseBill.Sub_Ledger_Pin = MainObj.Sub_Ledger_Pin;
   this.ObjPurChaseBill.Sub_Ledger_District = MainObj.Sub_Ledger_District;
   this.ObjPurChaseBill.Sub_Ledger_Country = MainObj.Sub_Ledger_Country;
   this.ObjPurChaseBill.Sub_Ledger_Email = MainObj.Sub_Ledger_Email;
   this.ObjPurChaseBill.Sub_Ledger_Mobile_No = MainObj.Sub_Ledger_Mobile_No;
   this.ObjPurChaseBill.Sub_Ledger_PAN_No = MainObj.Sub_Ledger_PAN_No;
   this.ObjPurChaseBill.Sub_Ledger_CIN_No = MainObj.CIN;
  }
  else {
    this.maindisabled = false;
  }
  // }
  }
   GetStateList() {
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_State_List",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.StateList = data;
          console.log('StateList',this.StateList)
    })
    // this.$http
    //   .get("/Common/Get_State_List")
    //   .subscribe((data: any) => {
    //     // this.StateList = data ? JSON.parse(data) : [];
    //     this.StateList = data;
    //     console.log('StateList',this.StateList)
    //   });
  }
  GetCostcenter(){
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("costcenterList  ===",data);
      this.CostCenterList = data;
      // this.ObjPurChaseBill.Cost_Cen_ID = this.CostCenterList.length === 1 ? this.CostCenterList[0].Cost_Cen_ID : undefined;
      this.ObjPurChaseBill.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.GetCosCenAddress();
      this.ObjPurChaseBill.Revenue_Cost_Cent_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      })
  }
  GetGodown(){
    const TempObj = {
      Cost_Cen_ID : this.ObjPurChaseBill.Cost_Cen_ID,
      }
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Godown_list",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("costcenterList  ===",data);
      this.GodownList = data;
      
      // this.ObjPurChaseBill.Cost_Cen_ID = this.CostCenterList.length === 1 ? this.CostCenterList[0].Cost_Cen_ID : undefined;
      // this.ObjPurChaseBill.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      // this.GetCosCenAddress();
      })
  }
  GetCosCenAddress(){
    //this.ExpiredProductFLag = false;
    if(this.ObjPurChaseBill.Cost_Cen_ID) {
   const ctrl = this;
   const costcenObj = $.grep(ctrl.CostCenterList,function(item: any) {return item.Cost_Cen_ID == ctrl.ObjPurChaseBill.Cost_Cen_ID})[0];
   console.log(costcenObj);
   this.ObjPurChaseBill.Cost_Cen_Address1 = costcenObj.Cost_Cen_Address1;
   this.ObjPurChaseBill.Cost_Cen_Address2 = costcenObj.Cost_Cen_Address2;
   this.ObjPurChaseBill.Cost_Cen_State = costcenObj.Cost_Cen_State;
   this.ObjPurChaseBill.Cost_Cen_GST_No = costcenObj.Cost_Cen_GST_No;
   this.ObjPurChaseBill.Cost_Cen_Location = costcenObj.Cost_Cen_Location;
   this.ObjPurChaseBill.Cost_Cen_PIN = costcenObj.Cost_Cen_PIN;
   this.ObjPurChaseBill.Cost_Cen_District = costcenObj.Cost_Cen_District;
   this.ObjPurChaseBill.Cost_Cen_Country = costcenObj.Cost_Cen_Country;
   this.ObjPurChaseBill.Cost_Cen_Mobile = costcenObj.Cost_Cen_Mobile;
   this.ObjPurChaseBill.Cost_Cen_Phone = costcenObj.Cost_Cen_Phone;
   this.ObjPurChaseBill.Cost_Cen_Email = costcenObj.Cost_Cen_Email1;
   this.GetGodown();
  }
  }
  GetCurrency(){
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Currency_Details",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("costcenterList  ===",data);
      this.CurrencyList = data;
      // console.log("CurrencyList===",this.CurrencyList)
      // this.ObjPurChaseBill.Cost_Cen_ID = this.CostCenterList.length === 1 ? this.CostCenterList[0].Cost_Cen_ID : undefined;
      this.ObjPurChaseBill.Currency_ID = 1;
      // this.GetCosCenAddress();
      })
  }
  GetPurOrderNoList(){
     const TempObj = {
      //  Req_Date : this.DateService.dateConvert(new Date(this.ReqDate)),
       Sub_Ledger_ID : this.ObjPurChaseBill.Sub_Ledger_ID,
      }
    const obj = {
     "SP_String": "SP_Purchase_Bill",
     "Report_Name_String" : "Get_PO_list",
    "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //  if(data.length) {
      //     data.forEach(element => {
      //       element['label'] = element.Pur_Order_No,
      //       element['value'] = element.Pur_Order_No
      //     });
          this.PurOrderList = data;
        // } else {
        //   this.PurOrderList = [];
        // }
   })
   }
   ChangePurchaseOrder(){
    this.PODate = new Date();
    // this.podatedisabled = true;
    if(this.ObjProductInfo.Pur_Order_No) {
      const ctrl = this;
      const DateObj = $.grep(ctrl.PurOrderList,function(item: any) {return item.value == ctrl.ObjProductInfo.Pur_Order_No})[0];
      console.log(DateObj);
      // this.ObjGRN1.RDB_Date = new Date(DateObj.RDB_Date);
      this.PODate = new Date(DateObj.Doc_Date);
      // this.podatedisabled = false;
      this.GetGRNno();
      this.GetPurOrderProductdetails();
      setTimeout(() => {
      if (this.PONoProList.length) {
        console.log("this.PONoProList",this.PONoProList)
        this.GetPONoProdetails2();
      } 
      else {
        this.GetProductdetails();
      }
      }, 200);
     }
     else {
       this.PODate = new Date();
       this.GetProductdetails();
       this.ObjProductInfo.GRN_No = undefined;
      //  this.podatedisabled = true;
     }
  }
   GetGRNno(){
    this.GRNList = [];
    const tempobj = {
      PO_Doc_No : this.ObjProductInfo.Pur_Order_No,
      }
    const obj = {
     "SP_String": "SP_Purchase_Bill",
     "Report_Name_String" : "Get_GRN_list",
    "Json_Param_String": JSON.stringify([tempobj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //  if(data.length) {
      //     data.forEach(element => {
      //       element['label'] = element.GRN_No,
      //       element['value'] = element.GRN_No
      //     });
          this.GRNList = data;
        // } else {
        //   this.GRNList = [];
        // }
    // this.GetGRNno();
   })
   }
   ChangeGRN(){
    this.GRNDate = new Date();
    // this.podatedisabled = true;
    if(this.ObjProductInfo.GRN_No) {
      const ctrl = this;
      const GRNDateObj = $.grep(ctrl.GRNList,function(item: any) {return item.value == ctrl.ObjProductInfo.GRN_No})[0];
      console.log(GRNDateObj);
      // this.ObjGRN1.RDB_Date = new Date(DateObj.RDB_Date);
      this.GRNDate = new Date(GRNDateObj.GRN_Date);
      // this.podatedisabled = false;
      this.GetGRNNoProductdetails();
      setTimeout(() => {
      if (this.GRNNoProlist.length) {
        console.log("this.GRNNoProlist",this.GRNNoProlist)
        this.GetGRNNoProlistdetails2();
      }
      else {
        this.GetProductdetails();
      }
      }, 200);
     }
     else {
       this.GRNDate = new Date();
       this.GetProductdetails();
      //  this.podatedisabled = true;
     }
  }
   GetProductdetails(){
    this.ProductDetails = [];
      const obj = {
        "SP_String": "SP_Purchase_Bill",
        "Report_Name_String": "Get_All_Products"
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=> {
        // data.forEach(element => {
        //   element['label'] = element.Product_Description,
        //   element['value'] = element.Product_ID
        // });
        this.ProductDetails = data;
      // } else {
      //   this.ProductDetails = [];
      // }
        //this.SpinnerShow = false;
        console.log("this.ProductDetails",this.ProductDetails);
      })
    //  }
  
  }
  GetPurOrderProductdetails(){
    this.PONoProList = [];
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_PO_Products",
      "Json_Param_String": JSON.stringify([{PO_Doc_No : this.ObjProductInfo.Pur_Order_No,}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=> {
      // data.forEach(element => {
      //   element['label'] = element.Product_Description,
      //   element['value'] = element.Product_ID
      // });
      this.PONoProList = data;
    // else {
    //   this.PONoProList = [];
    //   this.ProductDetails = [];
    // }
      //this.SpinnerShow = false;
      console.log("this.PONoProList",this.PONoProList);
      // console.log("this.ProductDetails",this.ProductDetails);
    })
  // }

}
GetPONoProdetails2(){
  this.ProductDetails = [];
  const obj = {
    "SP_String": "SP_Purchase_Bill",
    "Report_Name_String": "Get_PO_Products",
    "Json_Param_String": JSON.stringify([{PO_Doc_No : this.ObjProductInfo.Pur_Order_No,}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=> {
    this.ProductDetails = data;
    console.log("this.ProductDetails",this.ProductDetails);
  })

}
GetGRNNoProductdetails(){
  this.GRNNoProlist = [];
  const obj = {
    "SP_String": "SP_Purchase_Bill",
    "Report_Name_String": "Get_GRN_Product_list",
    "Json_Param_String": JSON.stringify([{GRN_No : this.ObjProductInfo.GRN_No,}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=> {
    // data.forEach(element => {
    //   element['label'] = element.Product_Description,
    //   element['value'] = element.Product_ID
    // });
    this.GRNNoProlist = data;
      // else {
  //   this.GRNNoProlist = [];
  //   this.ProductDetails = [];
  // }
    //this.SpinnerShow = false;
    console.log("this.GRNNoProlist",this.GRNNoProlist);
    // console.log("this.ProductDetails",this.ProductDetails);
  })
// }

}
GetGRNNoProlistdetails2(){
  this.ProductDetails = [];
  const obj = {
    "SP_String": "SP_Purchase_Bill",
    "Report_Name_String": "Get_GRN_Product_list",
    "Json_Param_String": JSON.stringify([{GRN_No : this.ObjProductInfo.GRN_No,}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=> {
      this.ProductDetails = data;
    console.log("this.ProductDetails",this.ProductDetails);
  })

}
  ProductChange(){
    this.ObjProductInfo.Product_Specification = undefined;
    this.Is_Service = false;
    this.Maintain_Serial_No = false;
    this.Product_Expiry = false;
    this.ObjProductInfo.HSN_No = undefined;
    this.ObjProductInfo.Qty = 0;
    this.ObjProductInfo.UOM = undefined;
    this.ObjProductInfo.Rate = undefined;
    if(this.ObjProductInfo.Product_ID) {
      const ctrl = this;
      const ProductObj = $.grep(ctrl.ProductDetails,function(item: any) {return item.value == ctrl.ObjProductInfo.Product_ID})[0];
      console.log(ProductObj);
      this.ObjProductInfo.Product_Specification = ProductObj.label;
      this.Is_Service = ProductObj.Is_Service;
      this.Maintain_Serial_No = ProductObj.Maintain_Serial_No;
      if (this.Maintain_Serial_No) {
        this.ObjProductInfo.Qty = 1;
      } 
      else {
      this.ObjProductInfo.Qty = ProductObj.Qty;
      }
      this.Batch_No = ProductObj.Batch_No
      this.ObjProductInfo.Batch_Number = ProductObj.Batch_No;
      this.ObjProductInfo.Product_Expiry = ProductObj.Product_Expiry;
      this.ObjProductInfo.HSN_No = ProductObj.HSN_No;
      this.ObjProductInfo.UOM = ProductObj.UOM;
      this.ObjProductInfo.Rate = ProductObj.MRP;
      this.CalCulateTotalAmt();
      this.ObjProductInfo.CGST_Rate = ProductObj.CGST_Rate;
      this.ObjProductInfo.SGST_Rate = ProductObj.SGST_Rate;
      this.ObjProductInfo.IGST_Rate = ProductObj.IGST_Rate;
     }
  }
  CalCulateTotalAmt(){
    this.ObjProductInfo.Amount = 0;
    if (this.ObjProductInfo.Qty && this.ObjProductInfo.Rate) {
      var amt;
      amt = Number(this.ObjProductInfo.Qty * this.ObjProductInfo.Rate).toFixed(2);
      this.ObjProductInfo.Amount = amt;
    }
  }
  DiscChange(){
    if(!this.ObjProductInfo.Discount_Type){
      this.ObjProductInfo.Discount = 0
    } 
    else {
      this.ObjProductInfo.Discount = undefined;
    }
  }
  AfterDiscCalChange(){
    this.ObjProductInfo.Discount_AMT = 0;
    this.ObjProductInfo.Taxable_Amount = 0;
    if (this.ObjProductInfo.Discount) { 
      var disamt;
      var taxamt;
    if(this.ObjProductInfo.Discount_Type == "%") {
      disamt = Number((Number(this.ObjProductInfo.Amount) * Number(this.ObjProductInfo.Discount)) / 100).toFixed(2);
      this.ObjProductInfo.Discount_AMT =Number(disamt);
    }
    if(this.ObjProductInfo.Discount_Type == "AMT") {
      this.ObjProductInfo.Discount_AMT = Number(this.ObjProductInfo.Discount);
    }
    taxamt = Number(Number(this.ObjProductInfo.Amount) - Number(this.ObjProductInfo.Discount_AMT)).toFixed(2);
    this.ObjProductInfo.Taxable_Amount = Number(taxamt);
    this.ObjTDS.Taxable_Amount = Number(this.ObjProductInfo.Taxable_Amount);
    }
    // else {
    //   this.ObjProductInfo.Discount_AMT = 0;
    //   this.ObjProductInfo.Taxable_Amount = 0;
    // }
  }
  CalculateCessAmt(){
    this.ObjProductInfo.CESS_AMT = 0;
    var cessamount;
    if (this.ObjProductInfo.CESS_Percentage) {
    cessamount = Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.CESS_Percentage) / 100).toFixed(2));
    this.ObjProductInfo.CESS_AMT = Number(cessamount);
    }
  }
  
  AddProductInfo(valid) {
    //console.log(this.ObjaddbillForm.Product_ID)
    this.ProductInfoSubmitted = true;
    if(valid) {
      const SubLedgerState = this.ObjPurChaseBill.Sub_Ledger_State
        ? this.ObjPurChaseBill.Sub_Ledger_State.toUpperCase()
        : undefined;
      const CostCenterState = this.ObjPurChaseBill.Cost_Cen_State
        ? this.ObjPurChaseBill.Cost_Cen_State.toUpperCase()
        : undefined;
    // this.ObjProductInfo.Taxable_Amount = Number(
    //   this.ObjProductInfo.Amount ? this.ObjProductInfo.Amount : 0
    // );
    
      if (SubLedgerState && CostCenterState) {
        if (SubLedgerState === CostCenterState) {
          this.ObjProductInfo.CGST_Amount = Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.CGST_Rate) / 100).toFixed(2));
          this.ObjProductInfo.SGST_Amount = Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.SGST_Rate) / 100).toFixed(2));
          this.ObjProductInfo.IGST_Amount = 0;
          this.ObjProductInfo.IGST_Rate = 0;
        }
        else {
          this.ObjProductInfo.IGST_Amount = Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.IGST_Rate) / 100).toFixed(2));
          this.ObjProductInfo.CGST_Amount = 0;
          this.ObjProductInfo.CGST_Rate = 0;
          this.ObjProductInfo.SGST_Amount = 0;
          this.ObjProductInfo.SGST_Rate = 0;
        }
      } 

      // var cessamount = this.ObjProductInfo.CESS_Percentage ? Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.CESS_Percentage) / 100).toFixed(2)) : 0;
      
      var netamount = Number(this.ObjProductInfo.CGST_Amount) + Number(this.ObjProductInfo.SGST_Amount) 
                    + Number(this.ObjProductInfo.IGST_Amount) + Number(this.ObjProductInfo.IGST_Amount)
                    + Number(this.ObjProductInfo.CESS_AMT)

      var stockpoint = this.GodownList.filter(item=> Number(item.godown_id) === Number(this.ObjProductInfo.Godown_Id))
    var productObj = {
      Product_ID : this.ObjProductInfo.Product_ID,
      Product_Description : this.ObjProductInfo.Product_Specification,
      HSN_Code : this.ObjProductInfo.HSN_No,
      Batch_No : this.ObjProductInfo.Batch_Number,
      Serial_No : this.ObjProductInfo.Serial_No,
      Expiry_Date : this.ObjProductInfo.Expiry_Date,
      Qty : this.ObjProductInfo.Qty,
      UOM : this.ObjProductInfo.UOM,
      Rate : this.ObjProductInfo.Rate,
      Total_Amount : this.ObjProductInfo.Amount,
      Discount_Type : this.ObjProductInfo.Discount_Type,
      Discount : Number(this.ObjProductInfo.Discount),
      Discount_AMT : Number(this.ObjProductInfo.Discount_AMT),
      Taxable_Amount : Number(this.ObjProductInfo.Taxable_Amount),
      CGST_Rate : Number(this.ObjProductInfo.CGST_Rate),
      CGST_Amount : Number(this.ObjProductInfo.CGST_Amount),
      SGST_Rate : Number(this.ObjProductInfo.SGST_Rate),
      SGST_Amount : Number(this.ObjProductInfo.SGST_Amount),
      IGST_Rate : Number(this.ObjProductInfo.IGST_Rate),
      IGST_Amount : Number(this.ObjProductInfo.IGST_Amount),
      CESS_Percentage : Number(this.ObjProductInfo.CESS_Percentage),
      CESS_Amount : Number(this.ObjProductInfo.CESS_AMT),

      Net_Amount : Number(netamount).toFixed(2),
      Godown_Name : stockpoint.length ? stockpoint[0].godown_name : undefined,
      Purchase_Order_No : this.ObjProductInfo.Pur_Order_No,
      GRN_No : this.ObjProductInfo.GRN_No
  
    };
    this.AddProductDetails.push(productObj);
    console.log('this.AddProductDetails===',this.AddProductDetails)
    this.ObjProductInfo = new ProductInfo();
    this.GRNList = [];
    this.GetProductdetails();
    this.ProductInfoSubmitted = false;
    this.ListofTotalAmount();
    // setTimeout(function(){
    //   const elem  = document.getElementById('SerialNo');
    //   elem.focus();
    // },500)
    }
  }
  delete(index) {
  this.AddProductDetails.splice(index,1)
  this.ListofTotalAmount();
  }
  ListofTotalAmount(){
    this.Total_Amount = undefined;
    let count = 0;
    this.Dis_Amount = undefined;
    let count1 = 0;
    this.Total_Taxable = undefined;
    let count2 = 0;
    this.CGST_Amount = undefined;
    let count3 = 0;
    this.SGST_Amount = undefined;
    let count4 = 0;
    this.IGST_Amount = undefined;
    let count5 = 0;
    this.Total_GST = undefined;
    // let count6 = 0;
    this.CESS = undefined;
    let count6 = 0;
    this.Total_Tax = undefined;
    this.Gross_Amount = undefined;
    // let count7 = 0;
    this.Round_off = undefined;
    // let count8 = 0;
    this.Net_Amt = undefined;
    // let count9 = 0;
  
  
    this.AddProductDetails.forEach(item => {
      count = count + Number(item.Total_Amount);
      count1 = count1 + Number(item.Discount_AMT);
      count2 = count2 + Number(item.Taxable_Amount);
      count3 = count3 + Number(item.CGST_Amount);
      count4 = count4 + Number(item.SGST_Amount);
      count5 = count5 + Number(item.IGST_Amount);
      // count6 = 
      count6 = count6 + Number(item.CESS_Amount);
      // count8 = count8 + Number(Number(item.Taxable_Amount) - Number(item.Discount_AMT));
      // count8 = count8 + Number(item.Round_off);
      // count9 = count9 + Number(item.Net_Amount);
    });
    this.Total_Amount = (count).toFixed(2);
    this.Dis_Amount = (count1).toFixed(2);
    this.Total_Taxable = (count2).toFixed(2);
    this.CGST_Amount = (count3).toFixed(2);
    this.SGST_Amount = (count4).toFixed(2);
    this.IGST_Amount = (count5).toFixed(2);
    this.Total_GST = Number(Number(this.CGST_Amount) + Number(this.SGST_Amount) + Number(this.IGST_Amount)).toFixed(2);
    this.CESS = (count6).toFixed(2);
    this.Total_Tax = Number(Number(this.Total_GST) + Number(this.CESS)).toFixed(2);
    this.Gross_Amount = Number(Number(this.Total_Taxable) + Number(this.Total_Tax)).toFixed(2);
    this.Round_off = (Number(this.Gross_Amount) - Number(Math.round(this.Gross_Amount))).toFixed(2);
    this.Net_Amt = Number(Math.round(this.Gross_Amount)).toFixed(2);
  }
  clearlistamount(){
    this.Total_Amount = undefined;
    this.Dis_Amount = undefined;
    this.Total_Taxable = undefined;
    this.CGST_Amount = undefined;
    this.SGST_Amount = undefined;
    this.IGST_Amount = undefined;
    this.Total_GST = undefined;
    this.CESS = undefined;
    this.Total_Tax = undefined;
    this.Gross_Amount = undefined;
    this.Round_off = undefined;
    this.Net_Amt = undefined;
  }
  GetLedger(){
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Master_Accounting_Ledger_Dropdown",
     // "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.LedgerList = data;
     console.log("Ledger list======",this.LedgerList);
   });
  }
  GetSubLedger(){
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Sub_Ledger_Dropdown",
      "Json_Param_String": JSON.stringify([{Ledger_ID : this.ObjTDS.Ledger_ID}])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.SubLedgerList = data;
     console.log("SubLedger list======",this.SubLedgerList);
   });
  }
  CalculateTDSAmt(){
    this.ObjTDS.TDS_Amount = 0;
    var tdsamt;
    if (this.ObjTDS.TDS_Per) { 
      tdsamt = Number((Number(this.ObjTDS.Taxable_Amount) * Number(this.ObjTDS.TDS_Per)) / 100).toFixed(2);
      this.ObjTDS.TDS_Amount =Number(tdsamt);
    }
  }
  AddTDS(valid){
    this.TDSFormSubmitted = true;
    if (valid) {
      var ledgername = this.LedgerList.filter(el=>Number(el.value) === Number(this.ObjTDS.Ledger_ID))
      var subledgername = this.SubLedgerList.filter(ele=>Number(ele.value) === Number(this.ObjTDS.Sub_Ledger_ID))
      var tdsobj = {
      Ledger_Name : ledgername[0].label,
      Sub_Ledger_Name : subledgername[0].label,
      Taxable_Amount : Number(this.ObjTDS.Taxable_Amount),
      TDS_Per : Number(this.ObjTDS.TDS_Per),
      TDS_Amt : Number(this.ObjTDS.TDS_Amount)
      }
      this.AddTdsDetails.push(tdsobj);
      console.log('this.AddTdsDetails===',this.AddTdsDetails)
      this.ObjTDS = new TDS();
      this.TDSFormSubmitted = false;;

    }
  }
  TDSdelete(index) {
    this.AddTdsDetails.splice(index,1)
    }
  getProjectData(e){
    console.log("Project Data",e);
    this.objproject = e
    this.objproject.Budget_Group_ID = Number(e.Budget_Group_ID)
    this.objproject.Budget_Sub_Group_ID = Number(e.Budget_Sub_Group_ID)
   }
   clearProject(){
     this.ProjectInput.clearData()
   }
   whateverCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
   SaveGRN(){}
   CalculateTaxandNet(){}
   getDis(){}
   getTaxAble(){}
   GetIndentList(){}
   onKeydownMain(event,nextElemID): void {
    if (event.key === "Enter" && nextElemID){
      if (nextElemID === 'enter'){
        console.log('Table Data last enter')
        const elem  = document.getElementById('row-Add');
        elem.click();
        event.preventDefault();
      }
    }
  }
  // datechange(){
  //   console.log(this.DateService.dateConvert(new Date(this.expiryDate)))
  // }

}
class PurChaseBill {
  Company_ID: any;
  Sub_Ledger_ID : any;
  Sub_Ledger_Billing_Name : string;
  Sub_Ledger_Address_1 : string;
  Sub_Ledger_State : any;
  Sub_Ledger_GST_No : any;
  Sub_Ledger_Address_2 : string;
  Sub_Ledger_Land_Mark : string;
  Sub_Ledger_Pin : any;
  Sub_Ledger_District : string;
  Sub_Ledger_Country : string;
  Sub_Ledger_Email : any;
  Sub_Ledger_Mobile_No : number;
  Sub_Ledger_PAN_No : any;
  Sub_Ledger_CIN_No : any;

  Cost_Cen_ID : any;
  Cost_Cen_Address1 : string;
  Cost_Cen_Address2 : string;
  Cost_Cen_State : string;
  Cost_Cen_GST_No : any;
  Cost_Cen_Location : string;
  Cost_Cen_PIN : any;
  Cost_Cen_District : string;
  Cost_Cen_Country : string;
  Cost_Cen_Mobile : number;
  Cost_Cen_Phone : number;
  Cost_Cen_Email : any;

  Doc_Date : any;
  Project_ID : number;
  CN_No : any;
  CN_Date : any;
  Currency_ID : number;
  Currency_Symbol : any;
  Revenue_Cost_Cent_ID : number;
  Supplier_Bill_No : any;
  Supplier_Bill_Date : any;
  RCM : any;

  Term_Name : any;
  HSN_No : any;
  Term_Amount : number;

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
 class Browse {
  Doc_No : any;
  start_date : Date ;
  end_date : Date;
}

class ProductInfo {
  Pur_Order_No: string;
  Pur_Order_Date: string;
  Product_ID: number;
  Product_Name: string;
  Product_Specification: string;
  Batch_Number: string;
  Serial_No: string;
  HSN_No: string;
  No_Of_Bag: number;
  Gross_Wt: number; // new field
  Qty: number;
  UOM: string;
  Rate: number;
  MRP = 0;
  Amount: number;
  Discount_Type = undefined;
  Discount : number;
  Discount_AMT : number;
  Taxable_Amount : number;
  Godown_Id: 0;
  CESS_Percentage: number;
  GRN_No: any;

  CGST_Rate: number;
  CGST_Amount: number;
  SGST_Rate: number;
  SGST_Amount: number;
  IGST_Rate: number;
  IGST_Amount: number;
  Total: number;

  Cat_ID: string;
  Cat_Name: string;
  godown_id = 0;
  godown_name: string;
  Ledger_ID: string;
  Excise_Tax: string;
  Excise_Tax_Percentage: string;

  CGST_Input_Ledger_ID: number;
  SGST_Input_Ledger_Id: number;
  IGST_Input_Ledger_ID: number;
  Discount_Ledger_ID: number;

  Product_Expiry: string;
  Expiry_Date: string;
  CESS_AMT: number;

}

class TDS{
  Ledger_ID : number;
  Sub_Ledger_ID : number;
  Taxable_Amount : number;
  TDS_Per : number;
  TDS_Amount : number;

}
