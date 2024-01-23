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
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-common-purchase-bill-gst',
  templateUrl: './common-purchase-bill-gst.component.html',
  styleUrls: ['./common-purchase-bill-gst.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CommonPurchaseBillGstComponent implements OnInit {
  items:any = [];
  menuList:any = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Create";
  currentdate = new Date();
  DocDate = new Date();
  CNDate : Date;
  SupplierBillDate : Date;

  CustomerList:any = [];
  maindisabled = false;
  StateList:any = [];
  CostCenterList:any = [];
  
  ProductDetails:any = [];

  CommonPurchaseBillFormSubmitted = false;
  ObjPurChaseBill = new PurChaseBill();
  // ObjGRN : GRN = new GRN ();
  // GRNDate = new Date();
  Supplierlist:any = [];
  CostCenterlist:any = [];
  Godownlist:any = [];
  POorderlist:any = [];
  // PODate : any = new Date();
  podatedisabled = true;
  ProductDetailslist:any = [];

  Productlist:any = [];
  productaddSubmit:any = [];

  Searchedlist:any = [];
  EditList:any = [];
  doc_no: any;
  SpinnerShow = false;
  inputBoxDisabled = false;
  
  openProject = "N"
  projectMand = "N";
  objproject : project = new project();
  validatation = {
    required : false,
    projectMand : 'N'
  }
  projectEditData:any =[]
  CurrencyList:any = [];
  GodownList:any = [];
  PODate : Date;
  PurOrderList:any = [];
  ObjProductInfo = new ProductInfo();
  ProductInfoSubmitted = false;
  expiryDate : Date;
  ProductExpirydisabled = false;
  GRNDate : Date;
  headerData = ""
  GRNList:any = [];
  PONoProList:any = [];
  GRNNoProlist:any = [];
  Maintain_Serial_No = false;
  // Product_Expiry = false;
  Is_Service = false;
  Batch_No = undefined;
  AddProductDetails:any = [];
  // @ViewChild("serialnumber", { static: false }) SerialNumber: ElementRef;
  // @ViewChild("serialnumber") SerialNumber: ElementRef;
  Total_Amount : any;
  Dis_Amount : any;
  Total_Taxable : any;
  CGST_Amount : any;
  SGST_Amount : any;
  IGST_Amount : any;
  CESS : any;
  Gross_Amount : any;
  Round_off : any;
  Net_Amt : any;
  Total_GST : any;
  Total_Tax : any;

  ObjTDS = new TDS();
  TDSFormSubmitted = false;
  LedgerList:any = [];
  SubLedgerList:any = [];
  AddTdsDetails:any = [];

  
  ObjBrowsePurBill = new BrowsePurBill();
  SerarchPurBillList:any = [];
  bckUpSerarchPurBillList:any = []
  SearchPurBillFormSubmitted = false;
  initDateValid:any = [];
  // Objsave = new save();
  Cess_Ledger_ID = undefined;
  cessdisabled = false;

  objProjectPurBillHarb:any = {};
  ObjTerm = new Term();
  TermFormSubmitted = false;
  TermList:any = [];
  AddTermList:any = [];
  Total_Term_Amount : any;
  Taxable_Amount : any;
  DocNo = undefined;

  Save = false;
  Del = false;

  deleteError = false;
  hrYeatList:any = [];
  HR_Year_ID:any;
  initDate:any = [];
  POList:any = [];
  DistProject:any = []
  SelectedDistProject:any = []
  DistSubledger:any = []
  SelectedSubledger:any = []
  bckUpQty:any = undefined
  bckUpQtyValid:boolean = false
  TCSTaxRequiredValidation:boolean = false;
  Productbutton : any;
  TCSTaxRequired: any;
  TCSInputLedger: any;
  TCS_Persentage: any;
  TCS_Amount: any;
  expirydatepickerflag:boolean = false;
  TCS_Per: any;
  TCSdataList:any = [];
  editDocNo: any;

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
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];
    this.Header.pushHeader({
      Header: "Purchase Bill GST",
      Link: " Financial Management -> Purchase -> Purchase Bill GST"
    });
    this.Finyear();
    this.GetVendor();
    this.GetStateList();
    this.GetCostcenter();
    this.GetCurrency();
    this.ObjPurChaseBill.RCM = "N";
    this.GetLedger();
    this.GetTerm();
  }

  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Create";
     this.Spinner = false;
     this.clearData();
     
     this.productaddSubmit = [];
     this.Spinner = false;
    //  this.Godownlist = [];
     this.POorderlist = [];
     this.GetProductdetails();
     this.ObjProductInfo = new ProductInfo();
   }
   clearData(){
     this.ObjPurChaseBill = new PurChaseBill();
     this.ObjPurChaseBill.Choose_Address = "MAIN";
     this.CommonPurchaseBillFormSubmitted = false;
     this.TCSTaxRequiredValidation = false;
     this.validatation.required = false;
     this.maindisabled = false;
     this.ObjPurChaseBill.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.ObjPurChaseBill.Revenue_Cost_Cent_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.GetCosCenAddress();
     this.DocDate = new Date();
     this.SupplierBillDate = undefined;
     this.CNDate = undefined;
     this.bckUpQtyValid = false
     this.PurOrderList = [];
     this.bckUpQty = undefined
     this.POList = [];
     this.PODate = undefined;
    //  this.GetProductdetails();
     this.PONoProList = [];
     this.GRNNoProlist = [];
     this.ObjPurChaseBill.Currency_ID = 1;
     this.ObjPurChaseBill.RCM = "N";
     this.AddProductDetails = [];
     this.clearlistamount();
     this.AddTdsDetails = [];
     this.ObjTDS = new TDS();
     this.AddTermList = [];
     this.ObjTerm = new Term();
    //  this.cleartotaltermamount();
    this.deleteError = false;
    this.expirydatepickerflag = false;
    this.TCSTaxRequired = undefined;
    this.TCSInputLedger = undefined;
    this.TCS_Persentage = undefined;
    this.TCS_Amount = undefined;
    this.TCS_Per = undefined;
    this.TCSdataList = [];
    this.editDocNo = undefined;
  
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
   GetVendor(){
    const obj = {
      "SP_String": "SP_Common_Purchase_Bill",
      "Report_Name_String": "Get_Subledger_SC",
     // "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.CustomerList = data;
    // console.log("vendor list======",this.CustomerList);
   });
  }
  CustomerNameChange(){
     //this.ExpiredProductFLag = false;
   if(this.ObjPurChaseBill.Sub_Ledger_ID) {
    const ctrl = this;
    const vendorObj = $.grep(ctrl.CustomerList,function(item: any) {return item.value == ctrl.ObjPurChaseBill.Sub_Ledger_ID})[0];
   // console.log(vendorObj);
    this.ObjPurChaseBill.Sub_Ledger_Billing_Name = vendorObj.Sub_Ledger_Billing_Name;
    this.ObjPurChaseBill.Sub_Ledger_Name = vendorObj.label;
    this.GetChooseAddress();
    this.GetPurOrderNoList();
   } else{
    this.PurOrderList = [];
    this.POList = [];
    this.PODate = undefined;
    this.GRNList = [];
    this.GRNDate = undefined;
    // this.GetProductdetails();
    // this.ProductDetails = [];
    this.ObjProductInfo.Product_Specification = undefined;
   }
   }
   GetChooseAddress(){
    //this.ExpiredProductFLag = false;
  // if(this.ObjPurChaseBill.Sub_Ledger_ID) {
    // this.GetProductdetails();
    this.PODate = undefined;
    this.GRNList = [];
    this.GRNDate = undefined;
    this.ObjProductInfo.Product_Specification = undefined;
    if(this.ObjPurChaseBill.Choose_Address) {
   const ctrl = this;
   const MainObj = $.grep(ctrl.CustomerList,function(item: any) {return item.value == ctrl.ObjPurChaseBill.Sub_Ledger_ID})[0];
  // console.log(MainObj);
   this.maindisabled = true;
   this.ObjPurChaseBill.Sub_Ledger_State = MainObj.Sub_Ledger_State;
   this.ObjPurChaseBill.Sub_Ledger_GST_No = MainObj.GST;
   this.ObjPurChaseBill.Sub_Ledger_Address_1 = MainObj.Sub_Ledger_Address_1;//+','+ MainObj.Sub_Ledger_Address_2 +','+ MainObj.Sub_Ledger_Address_3;
   this.ObjPurChaseBill.Sub_Ledger_Address_2 = MainObj.Sub_Ledger_Address_2;
   this.ObjPurChaseBill.Sub_Ledger_Address_3 = MainObj.Sub_Ledger_Address_3;
   this.ObjPurChaseBill.Sub_Ledger_Land_Mark = MainObj.Sub_Ledger_Land_Mark;
   this.ObjPurChaseBill.Sub_Ledger_Pin = MainObj.Sub_Ledger_Pin;
   this.ObjPurChaseBill.Sub_Ledger_District = MainObj.Sub_Ledger_District;
   this.ObjPurChaseBill.Sub_Ledger_Country = MainObj.Sub_Ledger_Country;
   this.ObjPurChaseBill.Sub_Ledger_Email = MainObj.Sub_Ledger_Email;
   this.ObjPurChaseBill.Sub_Ledger_Mobile_No = MainObj.Sub_Ledger_Mobile_No;
   this.ObjPurChaseBill.Sub_Ledger_PAN_No = MainObj.Sub_Ledger_PAN_No;
   this.ObjPurChaseBill.Sub_Ledger_CIN_No = MainObj.CIN;
   this.ObjPurChaseBill.Sub_Ledger_TIN_No = MainObj.Sub_Ledger_TIN_No;
   this.ObjPurChaseBill.Sub_Ledger_CST_No = MainObj.Sub_Ledger_CST_No;
   this.ObjPurChaseBill.Sub_Ledger_SERV_REG_NO = MainObj.Sub_Ledger_SERV_REG_NO;
   this.ObjPurChaseBill.Sub_Ledger_UID_NO = MainObj.Sub_Ledger_UID_NO;
   this.ObjPurChaseBill.Sub_Ledger_EXID_NO = MainObj.Sub_Ledger_EXID_NO;
  }
  else {
    this.maindisabled = false;
  }
  // }
  }
   GetStateList() {
    const obj = {
      "SP_String": "SP_Common_Purchase_Bill",
      "Report_Name_String": "Get_State_List",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.StateList = data;
         // console.log('StateList',this.StateList)
    })
  }
  GetCostcenter(){
    const obj = {
      "SP_String": "SP_Common_Purchase_Bill",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log("costcenterList  ===",data);
      this.CostCenterList = data;
      // this.ObjPurChaseBill.Cost_Cen_ID = this.CostCenterList.length === 1 ? this.CostCenterList[0].Cost_Cen_ID : undefined;
      this.ObjBrowsePurBill.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.ObjPurChaseBill.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.GetCosCenAddress();
      this.ObjPurChaseBill.Revenue_Cost_Cent_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      })
  }
  GetCosCenAddress(){
    //this.ExpiredProductFLag = false;
    if(this.ObjPurChaseBill.Cost_Cen_ID) {
   const ctrl = this;
   const costcenObj = $.grep(ctrl.CostCenterList,function(item: any) {return item.Cost_Cen_ID == ctrl.ObjPurChaseBill.Cost_Cen_ID})[0];
  // console.log(costcenObj);
   this.ObjPurChaseBill.Cost_Cen_Name = costcenObj.Cost_Cen_Name;
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
   this.ObjPurChaseBill.Cost_Cen_VAT_CST = costcenObj.Cost_Cen_VAT_CST;
   this.ObjPurChaseBill.Cost_Cen_CST_NO = costcenObj.Cost_Cen_CST_NO;
   this.ObjPurChaseBill.Cost_Cen_SRV_TAX_NO = costcenObj.Cost_Cen_SRV_TAX_NO;
   this.ObjPurChaseBill.Cost_Cen_GST_No = costcenObj.Cost_Cen_GST_No;
   this.GetGodown();
  }
  }
  GetGodown(){
    const TempObj = {
      Cost_Cen_ID : this.ObjPurChaseBill.Cost_Cen_ID,
      }
    const obj = {
      "SP_String": "SP_Common_Purchase_Bill",
      "Report_Name_String": "Get_Godown_list",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("GodownList  ===",data);
      this.GodownList = data;
      this.ObjProductInfo.Godown_Id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
      this.ObjProductInfo.Godown_Id = this.openProject == 'Y' ? 1 : undefined
      // this.ObjPurChaseBill.Cost_Cen_ID = this.CostCenterList.length === 1 ? this.CostCenterList[0].Cost_Cen_ID : undefined;
      // this.ObjPurChaseBill.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      // this.GetCosCenAddress();
      })
  }
  
  GetCurrency(){
    const obj = {
      "SP_String": "SP_Common_Purchase_Bill",
      "Report_Name_String": "Get_Currency_Details",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log("costcenterList  ===",data);
      this.CurrencyList = data;
      // console.log("CurrencyList===",this.CurrencyList)
      // this.ObjPurChaseBill.Cost_Cen_ID = this.CostCenterList.length === 1 ? this.CostCenterList[0].Cost_Cen_ID : undefined;
      this.ObjPurChaseBill.Currency_ID = 1;
      // this.GetCosCenAddress();
      })
  }
  GetPurOrderNoList(){
    this.POList = [];
    this.PurOrderList = [];
    this.ObjProductInfo.Pur_Order_No = undefined;
    if( this.ObjPurChaseBill.Sub_Ledger_ID){
      const TempObj = {
        Sub_Ledger_ID : this.ObjPurChaseBill.Sub_Ledger_ID,
       }
     const obj = {
      "SP_String": "SP_Common_Purchase_Bill",
      "Report_Name_String" : "Get_PO_list",
     "Json_Param_String": JSON.stringify([TempObj])
 
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // this.POList = data;
      if(data.length) {
      data.forEach(element => {
          element['label'] = element.label + " (" + "PO Date: " + this.DateService.dateConvert(new Date(element.Doc_Date)) + " )",
          element['value'] = element.value
        });
        this.PurOrderList = data;
      } else {
        this.PurOrderList = [];
        
      }
      })
    }
   
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
      // this.GetPurOrderProductdetails();
      // setTimeout(() => {
      // if (this.PONoProList.length) {
      //  // console.log("this.PONoProList",this.PONoProList)
        this.GetPurOrderProductdetails();
      // } 
      // else {
      //   this.GetProductdetails();
      // }
      // }, 200);
     }
     else {
       this.PODate = undefined;
       this.GetProductdetails();
      //  this.ObjProductInfo.GRN_No = undefined;
       this.ObjProductInfo.Product_ID = undefined;
       this.ObjProductInfo.Product_Specification = undefined;
      //  this.podatedisabled = true;
     }
  }
  ProductRefresh(){
    if (this.Productbutton === "(Show PO Product)"){
      this.GetPurOrderProductdetails();
    }
    else {
      this.GetProductdetails();
    }
   }
   GetProductdetails(){
    this.ProductDetails = [];
    this.ObjProductInfo.Product_ID = undefined;
      const obj = {
        "SP_String": "SP_Common_Purchase_Bill",
        "Report_Name_String": "Get_All_Products"
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=> {
        // data.forEach(element => {
        //   element['label'] = element.Product_Description,
        //   element['value'] = element.Product_ID
        // });
        this.ProductDetails = data;
        this.Productbutton = "(Show PO Product)"
      // } else {
      //   this.ProductDetails = [];
      // }
        //this.SpinnerShow = false;
       // console.log("this.ProductDetails",this.ProductDetails);
      })
    //  }
  
  }
  GetPurOrderProductdetails(){
    this.PONoProList = [];
    const obj = {
      "SP_String": "SP_Common_Purchase_Bill",
      "Report_Name_String": "Get_PO_Products",
      "Json_Param_String": JSON.stringify([{PO_Doc_No : this.ObjProductInfo.Pur_Order_No,}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=> {
      // data.forEach(element => {
      //   element['label'] = element.Product_Description,
      //   element['value'] = element.Product_ID
      // });
      this.PONoProList = data;
      this.ProductDetails = data;
      this.Productbutton = "(Show All Product)"
    // else {
    //   this.PONoProList = [];
    //   this.ProductDetails = [];
    // }
      //this.SpinnerShow = false;
     // console.log("this.PONoProList",this.PONoProList);
      // console.log("this.ProductDetails",this.ProductDetails);
    })
  // }

}
  ProductChange(){
    this.ObjProductInfo.Product_Specification = undefined;
    this.Is_Service = false;
    this.Maintain_Serial_No = false;
    this.ObjProductInfo.Product_Expiry = false;
    this.ObjProductInfo.HSN_No = undefined;
    this.ObjProductInfo.Qty = 0;
    this.ObjProductInfo.UOM = undefined;
    this.ObjProductInfo.Rate = undefined;
    this.Cess_Ledger_ID = undefined;
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
       this.bckUpQty = this.ObjProductInfo.Qty
      this.Batch_No = ProductObj.Batch_No
      this.ObjProductInfo.Batch_Number = ProductObj.Batch_No;
      this.ObjProductInfo.Product_Expiry = ProductObj.Product_Expiry;
      if (this.ObjProductInfo.Product_Expiry === true) {
        this.ProductExpirydisabled = true;
      } else {
        this.ProductExpirydisabled = false;
      }
      this.ObjProductInfo.HSN_No = ProductObj.HSN_NO;
      this.ObjProductInfo.UOM = ProductObj.UOM;
      this.ObjProductInfo.Rate = ProductObj.MRP;
       this.CalCulateTotalAmt();
      this.ObjProductInfo.CGST_Rate = ProductObj.CGST_Rate;
      this.ObjProductInfo.SGST_Rate = ProductObj.SGST_Rate;
      this.ObjProductInfo.IGST_Rate = ProductObj.IGST_Rate;
      this.Cess_Ledger_ID = ProductObj.Cess_Ledger_ID;
      if (this.Cess_Ledger_ID == 0)
        this.cessdisabled = true;
     } else {
      this.cessdisabled = false;
     }
  }
  CalCulateTotalAmt(){
    this.ObjProductInfo.Amount = 0;
    if (this.ObjProductInfo.Qty && this.ObjProductInfo.Rate) {
      // this.chkqut()
      var amt;
      amt = Number(this.ObjProductInfo.Qty * this.ObjProductInfo.Rate).toFixed(2);
      this.ObjProductInfo.Amount = amt;
      this.ObjProductInfo.Taxable_Amount = Number(this.ObjProductInfo.Amount);
    }
  }
  chkqut(){
    let flg = false
   if(this.ObjProductInfo.Pur_Order_No && this.ObjProductInfo.Product_ID){
    if((this.bckUpQty > this.ObjProductInfo.Qty || this.bckUpQty == this.ObjProductInfo.Qty)){
      flg = false
      return false
    }
    else {
      flg = true
      return true
     }
  
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
    this.ObjProductInfo.Discount_Type_Amt = 0;
    this.ObjProductInfo.Taxable_Amount = 0;
    if (this.ObjProductInfo.Discount) { 
      var disamt;
      var taxamt;
    if(this.ObjProductInfo.Discount_Type == "%") {
      disamt = Number((Number(this.ObjProductInfo.Amount) * Number(this.ObjProductInfo.Discount)) / 100).toFixed(2);
      this.ObjProductInfo.Discount_Type_Amt =Number(disamt);
    }
    if(this.ObjProductInfo.Discount_Type == "AMT") {
      this.ObjProductInfo.Discount_Type_Amt = Number(this.ObjProductInfo.Discount);
    }
    taxamt = Number(Number(this.ObjProductInfo.Amount) - Number(this.ObjProductInfo.Discount_Type_Amt)).toFixed(2);
    this.ObjProductInfo.Taxable_Amount = Number(taxamt);
    // this.ObjTDS.Taxable_Amount = Number(this.ObjProductInfo.Taxable_Amount);
    }
    else {
      this.ObjProductInfo.Discount_Type_Amt = 0;
      this.ObjProductInfo.Taxable_Amount = Number(this.ObjProductInfo.Amount);
    }
  }
  CalculateCessAmt(){
    this.ObjProductInfo.CESS_AMT = 0;
    var cessamount;
    if (this.ObjProductInfo.CESS_Percentage) {
    cessamount = Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.CESS_Percentage) / 100).toFixed(2));
    this.ObjProductInfo.CESS_AMT = Number(cessamount);
    }
    else {
      this.ObjProductInfo.CESS_AMT = 0;
    }
  }
  LastDayOfMonth(Year, Month) {
    return new Date(Number(new Date(Year, Month, 1)) - 1);
  }
  AddProductInfo(valid) {
    //console.log(this.ObjaddbillForm.Product_ID)
    this.ProductInfoSubmitted = true;
    if(valid) { //&& !this.chkqut()
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
      this.ObjProductInfo.CESS_AMT = this.ObjProductInfo.CESS_AMT ? Number(this.ObjProductInfo.CESS_AMT) : 0;
      var netamount = (Number(this.ObjProductInfo.CGST_Amount) + Number(this.ObjProductInfo.SGST_Amount) 
                    + Number(this.ObjProductInfo.IGST_Amount) + Number(this.ObjProductInfo.CESS_AMT)).toFixed(2);

      var stockpoint = this.GodownList.filter(item=> Number(item.godown_id) === Number(this.ObjProductInfo.Godown_Id));
      var date:any = this.expiryDate ? new Date(this.expiryDate) : "";
      this.ObjProductInfo.Expiry_Date = date ? this.expirydatepickerflag == false ? this.DateService.dateConvert(this.LastDayOfMonth(date.getFullYear(), date.getMonth() + 1)) : this.DateService.dateConvert(new Date(this.expiryDate)) : "";
    var productObj = {
      Product_ID : this.ObjProductInfo.Product_ID,
      Product_Name : this.ObjProductInfo.Product_Specification,
      Product_Specification : this.ObjProductInfo.Product_Specification,
      // HSN_Code : this.ObjProductInfo.HSN_No,
      HSL_No : this.ObjProductInfo.HSN_No,
      Batch_Number : this.ObjProductInfo.Batch_Number,
      Serial_No : this.ObjProductInfo.Serial_No,
      Product_Expiry : this.ObjProductInfo.Product_Expiry ? 1 : 0,
      Expiry_Date : this.ObjProductInfo.Expiry_Date,
      Qty : this.ObjProductInfo.Qty,
      UOM : this.ObjProductInfo.UOM,
      MRP : this.ObjProductInfo.Rate,
      Rate : this.ObjProductInfo.Rate,
      Amount : Number(this.ObjProductInfo.Amount),
      Discount_Type : this.ObjProductInfo.Discount_Type,
      Discount : this.ObjProductInfo.Discount ? Number(this.ObjProductInfo.Discount) : 0,
      Discount_Type_Amount : this.ObjProductInfo.Discount_Type_Amt ? Number(this.ObjProductInfo.Discount_Type_Amt) : 0,
      Taxable_Amount : Number(this.ObjProductInfo.Taxable_Amount),
      CGST_Rate : Number(this.ObjProductInfo.CGST_Rate),
      CGST_Amount : Number(this.ObjProductInfo.CGST_Amount),
      SGST_Rate : Number(this.ObjProductInfo.SGST_Rate),
      SGST_Amount : Number(this.ObjProductInfo.SGST_Amount),
      IGST_Rate : Number(this.ObjProductInfo.IGST_Rate),
      IGST_Amount : Number(this.ObjProductInfo.IGST_Amount),
      CESS_Percentage : this.ObjProductInfo.CESS_Percentage ? Number(this.ObjProductInfo.CESS_Percentage) : 0,
      CESS_Amount : this.ObjProductInfo.CESS_AMT ? Number(this.ObjProductInfo.CESS_AMT) : 0,

      Net_Value : Number(netamount),
      godown_id : this.ObjProductInfo.Godown_Id ? Number(this.ObjProductInfo.Godown_Id) : 0,
      Godown_Name : stockpoint.length ? stockpoint[0].godown_name : undefined,
      Pur_Order_No : this.ObjProductInfo.Pur_Order_No,
      Pur_Order_Date : this.PODate ? this.DateService.dateConvert(new Date(this.PODate)) : "01/Jan/1900",
  
    };
    this.AddProductDetails.push(productObj);
    // console.log('this.AddProductDetails===',this.AddProductDetails)
    // this.ObjProductInfo = new ProductInfo();
    // this.GRNList = [];
    // this.GetProductdetails();
    // this.ProductInfoSubmitted = false;
    // this.ListofTotalAmount();
    this.PODate = undefined;
    this.expirydatepickerflag = false;
    this.expiryDate = undefined;
    if(this.Maintain_Serial_No){
      this.ProductInfoSubmitted = false;
      this.ObjProductInfo.Serial_No = undefined;
    setTimeout(function(){
      const elem  = document.getElementById('serialnumber');
      elem.focus();
    },500)
    }
    else {
     // console.log('this.AddProductDetails===',this.AddProductDetails)
      this.ObjProductInfo = new ProductInfo();
      this.ObjProductInfo.Godown_Id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
      this.GRNList = [];
      this.GetProductdetails();
      this.ProductInfoSubmitted = false;
      this.ListofTotalAmount();
      this.TcsAmtCalculation();
    }
    }
  }
  delete(index) {
  this.AddProductDetails.splice(index,1);
  this.ListofTotalAmount();
  this.TcsAmtCalculation();
  }
  GetTCSdat(){
    if (this.TCSTaxRequired === 'YES') {
    this.ngxService.start();
      this.TCS_Per = undefined;
    const obj = {
      "SP_String": "SP_Common_Purchase_Bill",
      "Report_Name_String": "Get_Tcs_Percentage_And Ledger",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log(data)
    this.TCSdataList = data;
    this.ngxService.stop();
    if(this.buttonname === "Update"){
    this.TcsAmtCalculation();
    }
  }); 
    }  
    else {
      this.TCSInputLedger = 0;
      this.TCS_Persentage = 0;
      this.TCS_Amount = 0;
      this.ListofTotalAmount();
      this.ngxService.stop();
      // this.objaddPurchacse.Grand_Total = this.objaddPurchacse.Net_Amt;
      // this.ObjVoucherTopper.DR_Amt = this.ObjSaleBillNew.Grand_Total;
  }
  }
  TcsAmtCalculation(){
    if (this.TCS_Per) {
        // this.ngxService.start();
        var tcspercentage = this.TCSdataList.filter(el=> Number(el.TCS_Persentage) === Number(this.TCS_Per))
          this.TCSInputLedger = tcspercentage[0].TCS_Ledger_ID;
          this.TCS_Persentage = tcspercentage[0].TCS_Persentage;
          this.TCS_Amount = Number(Number(this.Gross_Amount * this.TCS_Persentage) / 100).toFixed(2);
          this.ListofTotalAmount();
          this.ngxService.stop();  
    }
      else {
        this.TCS_Persentage = 0;
        this.TCS_Amount = 0;
        this.ListofTotalAmount();
        this.ngxService.stop();
    }
  }
  // TcsAmtCalculation(){
  //   this.TCSInputLedger = 0;
  //   if (this.TCSTaxRequired === 'YES') {
  //       this.ngxService.start();
  //       // this.$http.get("/Common/Get_TCS_Persentage_Sale?TCS_Enabled=YES",{responseType: 'text'}).subscribe((data: any) => {
  //         const obj = {
  //           "SP_String": "SP_Common_Purchase_Bill",
  //           "Report_Name_String": "Get_Tcs_Percentage_And Ledger",
  //           }
  //         this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //         console.log(data)
  //         this.TCSInputLedger = data[0].TCS_Ledger_ID;
  //         this.TCS_Persentage = data[0].TCS_Persentage;
  //         this.TCS_Amount = Number(Number(this.Gross_Amount * this.TCS_Persentage) / 100).toFixed(2);
  //         this.ListofTotalAmount();
  //         this.ngxService.stop();
  //       });   
  //   }
  //     else {
  //       this.TCS_Persentage = 0;
  //       this.TCS_Amount = 0;
  //       this.ListofTotalAmount();
  //   }
  // }
  
  GetTerm() {
    const obj = {
      "SP_String": "SP_Common_Purchase_Bill",
      "Report_Name_String": "Get_Term_Tax_Pur_GST",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.TermList = data;
         // console.log('TermList',this.TermList)
    })
  }
  TermChange(){
    this.GetProductdetails();
    this.ObjTerm.HSN_No = undefined;
    if(this.ObjTerm.Term_ID) {
   const ctrl = this;
   const termobj = $.grep(ctrl.TermList,function(item: any) {return item.Term_ID == ctrl.ObjTerm.Term_ID})[0];
  // console.log(termobj);
   this.ObjTerm.Term_Name = termobj.Term_Name;
   this.ObjTerm.HSN_No = termobj.HSN_No;
   this.ObjTerm.CGST_Rate = termobj.CGST_Tax_Per;
   this.ObjTerm.SGST_Rate = termobj.SGST_Tax_Per;
   this.ObjTerm.IGST_Rate = termobj.IGST_Tax_Per;
  }
  }
  AddTerm(valid){
    //console.log(this.ObjaddbillForm.Product_ID)
    this.TermFormSubmitted = true;
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
          this.ObjTerm.CGST_Amount = Number(((this.ObjTerm.Term_Amount * this.ObjTerm.CGST_Rate) / 100).toFixed(2));
          this.ObjTerm.SGST_Amount = Number(((this.ObjTerm.Term_Amount * this.ObjTerm.SGST_Rate) / 100).toFixed(2));
          this.ObjTerm.IGST_Amount = 0;
          this.ObjTerm.IGST_Rate = 0;
        }
        else {
          this.ObjTerm.IGST_Amount = Number(((this.ObjTerm.Term_Amount * this.ObjTerm.IGST_Rate) / 100).toFixed(2));
          this.ObjTerm.CGST_Amount = 0;
          this.ObjTerm.CGST_Rate = 0;
          this.ObjTerm.SGST_Amount = 0;
          this.ObjTerm.SGST_Rate = 0;
        }
      } 
    var TERMobj = {
      Sale_Pur : 0,
      Term_ID : this.ObjTerm.Term_ID,
      Term_Name : this.ObjTerm.Term_Name,
      HSN_No : this.ObjTerm.HSN_No,
      Term_Amount : Number(this.ObjTerm.Term_Amount),
      SGST_Rate : this.ObjTerm.SGST_Rate,
      SGST_Amount : this.ObjTerm.SGST_Amount,
      CGST_Rate : this.ObjTerm.CGST_Rate,
      CGST_Amount : this.ObjTerm.CGST_Amount,
      IGST_Rate : this.ObjTerm.IGST_Rate,
      IGST_Amount : this.ObjTerm.IGST_Amount,
      Exp_Term_Amount_Fr : 0
  
    };
    this.AddTermList.push(TERMobj);
     // console.log('this.AddProductDetails===',this.AddProductDetails)
      this.ObjTerm = new Term();
      this.GetProductdetails();
      this.TermFormSubmitted = false;
      this.ListofTotalAmount();
      this.TcsAmtCalculation();
    }
  }
  DeteteTerm(index) {
    this.AddTermList.splice(index,1);
    this.ListofTotalAmount();
    this.TcsAmtCalculation();
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
    this.Total_Term_Amount = 0;
  
  
    this.AddProductDetails.forEach(item => {
      count = count + Number(item.Amount);
      count1 = count1 + Number(item.Discount_Type_Amount);
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
    var CGST_Amount = (count3).toFixed(2);
    var SGST_Amount = (count4).toFixed(2);
    var IGST_Amount = (count5).toFixed(2);

    this.Total_Term_Amount = 0;
    let countT = 0;
    let countT1 = 0;
    let countT2 = 0;
    let counTt3 = 0;
    // var CGST_Term_Amount:any = 0;
    // var SGST_Term_Amount:any = 0;
    // var IGST_Term_Amount:any = 0;
    this.AddTermList.forEach(item => {
      countT = countT + Number(item.Term_Amount);
      countT1 = countT1 + Number(item.CGST_Amount);
      countT2 = countT2 + Number(item.SGST_Amount);
      counTt3 = counTt3 + Number(item.IGST_Amount);
    });
    var CGST_Term_Amount = (countT1).toFixed(2);
    var SGST_Term_Amount = (countT2).toFixed(2);
    var IGST_Term_Amount = (counTt3).toFixed(2);

    this.Total_Amount = (count).toFixed(2);
    this.Total_Term_Amount = (countT).toFixed(2);
    this.Dis_Amount = (count1).toFixed(2);
    this.Total_Taxable = (count2).toFixed(2);
    
    this.Taxable_Amount = ((Number(this.Total_Amount) + Number(this.Total_Term_Amount)) - Number(this.Dis_Amount)).toFixed(2) ;
    this.CGST_Amount = (Number(CGST_Amount) + Number(CGST_Term_Amount)).toFixed(2);
    this.SGST_Amount = (Number(SGST_Amount) + Number(SGST_Term_Amount)).toFixed(2)
    this.IGST_Amount = (Number(IGST_Amount) + Number(IGST_Term_Amount)).toFixed(2)
    this.Total_GST = Number(Number(this.CGST_Amount) + Number(this.SGST_Amount) + Number(this.IGST_Amount)).toFixed(2);
    this.CESS = (count6).toFixed(2);
    this.Total_Tax = Number(Number(this.Total_GST) + Number(this.CESS)).toFixed(2);
    this.Gross_Amount = Number(Number(this.Taxable_Amount) + Number(this.Total_Tax)).toFixed(2);
    // this.TCS_Amount = Number(this.TCS_Amount) ? Number(this.TCS_Amount) : 0;
    var grandtotal:any = Number(Number(this.Gross_Amount) + Number(this.TCS_Amount)).toFixed(2);
    this.Round_off = (Number(Math.round(grandtotal)) - Number(grandtotal)).toFixed(2);
    this.Net_Amt = Number(Math.round(grandtotal)).toFixed(2);
    this.ObjTDS.Taxable_Amount = Number(this.Taxable_Amount);
  }
  clearlistamount(){
    this.Total_Amount = undefined;
    this.Dis_Amount = undefined;
    this.Total_Taxable = undefined;
    this.Taxable_Amount = undefined;
    this.CGST_Amount = undefined;
    this.SGST_Amount = undefined;
    this.IGST_Amount = undefined;
    this.Total_GST = undefined;
    this.CESS = undefined;
    this.Total_Tax = undefined;
    this.Gross_Amount = undefined;
    this.Round_off = undefined;
    this.Net_Amt = undefined;
    this.Total_Term_Amount = undefined;
  }
  GetLedger(){
    const obj = {
      "SP_String": "SP_Common_Purchase_Bill",
      "Report_Name_String": "Get_Master_Accounting_Ledger_Dropdown",
     // "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.LedgerList = data;
    // console.log("Ledger list======",this.LedgerList);
   });
  }
  GetSubLedger(){
    const obj = {
      "SP_String": "SP_Common_Purchase_Bill",
      "Report_Name_String": "Get_Sub_Ledger_Dropdown",
      "Json_Param_String": JSON.stringify([{Ledger_ID : this.ObjTDS.Ledger_ID}])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.SubLedgerList = data;
    // console.log("SubLedger list======",this.SubLedgerList);
   });
  }
  CalculateTDSAmt(){
    this.ObjTDS.TDS_Amount = 0;
    var tdsamt;
    if (this.ObjTDS.TDS_Percentage) { 
      tdsamt = Number((Number(this.ObjTDS.Taxable_Amount) * Number(this.ObjTDS.TDS_Percentage)) / 100).toFixed(2);
      this.ObjTDS.TDS_Amount =Number(tdsamt);
    }
    else {
      this.ObjTDS.TDS_Amount = 0;
    }
  }
  AddTDS(valid){
    this.TDSFormSubmitted = true;
    if (valid) {
      var ledgername = this.LedgerList.filter(el=>Number(el.value) === Number(this.ObjTDS.Ledger_ID))
      var subledgername = this.SubLedgerList.filter(ele=>Number(ele.value) === Number(this.ObjTDS.Sub_Ledger_ID))
      var tdsobj = {
      Ledger_ID : this.ObjTDS.Ledger_ID,
      Ledger_Name : ledgername[0].label,
      Sub_Ledger_ID : this.ObjTDS.Sub_Ledger_ID,
      Sub_Ledger_Name : subledgername[0].label,
      Taxable_Amount : Number(this.ObjTDS.Taxable_Amount),
      TDS_Percentage : this.ObjTDS.TDS_Percentage ? Number(this.ObjTDS.TDS_Percentage) : 0,
      TDS_Amount : this.ObjTDS.TDS_Amount ? Number(this.ObjTDS.TDS_Amount) : 0
      }
      this.AddTdsDetails.push(tdsobj);
     // console.log('this.AddTdsDetails===',this.AddTdsDetails)
      this.ObjTDS = new TDS();
      this.ObjTDS.Taxable_Amount = Number(this.Taxable_Amount);
      this.TDSFormSubmitted = false;;

    }
  }
  TDSdelete(index) {
    this.AddTdsDetails.splice(index,1)
    }
  getProjectData(e){
   // console.log("Project Data",e);
    this.objproject = e
    this.objproject.Budget_Group_ID = Number(e.Budget_Group_ID)
    this.objproject.Budget_Sub_Group_ID = Number(e.Budget_Sub_Group_ID)
    this.objProjectPurBillHarb = e
   // console.log("objProjectRequi",this.objProjectPurBillHarb)
    let temparr = Object.keys(this.objProjectPurBillHarb)
   // console.log(temparr)
    // if(temparr.indexOf("PROJECT_ID") != -1 && temparr.indexOf("Budget_Group_ID") != -1 && temparr.indexOf("Budget_Sub_Group_ID") != -1 && temparr.indexOf("SITE_ID") != -1 && temparr.indexOf("Work_Details_ID") != -1){
    //  this.getProductType();
    //  this.GetRequlist();
    // }
    // else{
    //  this.ObjProductInfo.Product_Type_ID = undefined;
    //  this.ObjProductInfo.Product_ID = undefined;
    //  this.ObjProductInfo.Product_Specification = undefined;
    // }
   }
 
   whateverCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
  async SaveProject(docNo){
    if(docNo){
     this.objproject.DOC_NO = docNo,
     this.objproject.DOC_TYPE = "PURCHASE BILL",
     this.objproject.DOC_DATE = this.DateService.dateConvert(this.DocDate)
    }
    const obj = {
     "SP_String": "SP_BL_CRM_TXN_Project_Doc",
     "Report_Name_String": "Create_BL_CRM_TXN_Project_Doc",
     "Json_Param_String": JSON.stringify([this.objproject]) 
    }
    const projectData = await  this.GlobalAPI.getData(obj).toPromise();
   // console.log("projectData",projectData);
    return projectData
   }
  DataForSavePurchaseBill(){
    this.ObjPurChaseBill.Doc_No = this.editDocNo ? this.editDocNo : "A";
    this.ObjPurChaseBill.Doc_Date = this.DateService.dateConvert(new Date(this.DocDate));
    this.ObjPurChaseBill.Supp_Ref_Date = this.SupplierBillDate ? this.DateService.dateConvert(new Date(this.SupplierBillDate)) : "01/Jan/0001";
    this.ObjPurChaseBill.CN_Date = this.CNDate ? this.DateService.dateConvert(new Date(this.CNDate)) : "01/Jan/1900";
    // this.ObjPurChaseBill.CN_Date = this.DateService.dateConvert(new Date(this.CNDate));
    this.ObjPurChaseBill.Bill_Gross_Amt = Number(this.Gross_Amount);
    this.ObjPurChaseBill.Bill_Net_Amt = Number(this.Net_Amt);
    this.ObjPurChaseBill.Rounded_Off = Number(this.Round_off);
    this.ObjPurChaseBill.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjPurChaseBill.Fin_Year_ID = Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID);
    if(this.AddProductDetails.length) {
      // this.Spinner = true;
      // this.ngxService.start();
      // let tempArr = [];
      // tempArr = {...this.ObjPurChaseBill}
      // this.Objsave.T_Elemnts = this.ObjPurChaseBill;
      var termamt:any = [];
      const termamonth = { 
        Sale_Pur: 0,
        Term_ID: 0,
        Term_Name: "",
        HSN_No: "",
        Term_Amount: 0,
        SGST_Rate: 0,
        SGST_Amount: 0,
        CGST_Rate: 0,
        CGST_Amount: 0,
        IGST_Rate: 0,
        IGST_Amount: 0,
        Exp_Term_Amount_Fr: 0
      }
      termamt.push(termamonth);
      this.ObjPurChaseBill.L_element = this.AddProductDetails;
      this.ObjPurChaseBill.TERM_element = this.AddTermList.length ? this.AddTermList : termamt;
      this.ObjPurChaseBill.TCSTaxRequired = this.TCSTaxRequired;
      this.ObjPurChaseBill.TCSInputLedger =  this.TCSInputLedger;
      this.ObjPurChaseBill.TCS_Persentage = this.TCS_Persentage;
      this.ObjPurChaseBill.TCS_Amount = Number(this.TCS_Amount);
     // console.log("Create ====>",this.ObjPurChaseBill)
  //   } else {
  //     setTimeout(()=>{
  //     this.Spinner = false;
  //     this.ngxService.stop();
  //   this.compacctToast.clear();
  //   this.compacctToast.add({
  //      key: "compacct-toast",
  //     severity: "error",
  //     summary: "Warn Message",
  //     detail: "Error in Taxable amount"
  //   });
  //   },600)
  // }
   // console.log("save bill =" , tempArr)
    return JSON.stringify([this.ObjPurChaseBill]);
    }
     else {
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
    }
  }
  SavePurchaseBill(valid){
    this.DocNo = undefined;
    this.CommonPurchaseBillFormSubmitted = true;
    this.TCSTaxRequiredValidation = true;
    this.validatation.required = true
    if(valid && this.TCSTaxRequired){
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
    }
   }
  async onConfirmSave(){
      const obj = {
      "SP_String": "SP_Common_Purchase_Bill",
      "Report_Name_String": "Purchase_Bill_Create",
      "Json_Param_String": this.DataForSavePurchaseBill()
      }
      this.GlobalAPI.postData(obj).subscribe(async (data:any)=>{
     this.validatation.required = false;
     //console.log(data);
     if(data.length){
     var tempID = data[0].Column1;
     if(data[0].Column1 != "Total Dr Amt And Cr Amt Not matched" && data[0].Success != "False"){
        const mgs = this.buttonname === 'Create' ? "Created" : "updated";
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Purchase_Bill_ID  " + tempID,
         detail: "Succesfully " + mgs
       });
       this.CommonPurchaseBillFormSubmitted = false;
       this.TCSTaxRequiredValidation = false;
       this.clearData();
       if (this.buttonname === "Update"){
       this.tabIndexToView = 0;
       this.items = ["BROWSE", "CREATE"];
       }
       this.GetSerarchPurBill(true);
     }
    else if (data[0].Column1 === "Total Dr Amt And Cr Amt Not matched") {
      this.Spinner = false;
      this.ngxService.stop();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: tempID
      });
    }
    else {
      this.Spinner = false;
      this.ngxService.stop();
      this.compacctToast.clear();
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
  // datechange(){
  //  // console.log(this.DateService.dateConvert(new Date(this.expiryDate)))
  // }
  
  // BROWSE
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowsePurBill.start_date = dateRangeObj[0];
      this.ObjBrowsePurBill.end_date = dateRangeObj[1];
    }
    }
    // FilterPeriod(){
    //   if(this.ObjCosdHead.Fin_Year_Name){
    //    const FinancialYearFilter:any = this.FinancialDataList.find((el:any)=> el.Fin_Year_Name === this.ObjCosdHead.Fin_Year_Name)
    //   // console.log("FinancialYearFilter",FinancialYearFilter)
    //     this.initDateValid = [new Date(FinancialYearFilter.Fin_Year_Start), new Date(FinancialYearFilter.Fin_Year_End)]
    //    //console.log("initDate",this.initDate)
    //   }
    //   } 
  GetSerarchPurBill(valid){
  this.SearchPurBillFormSubmitted = true;
  const start = this.ObjBrowsePurBill.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowsePurBill.start_date))
  : this.DateService.dateConvert(new Date());
  const end = this.ObjBrowsePurBill.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowsePurBill.end_date))
  : this.DateService.dateConvert(new Date());
  const tempobj = {
   From_Date : start,
   To_Date : end,
   Cost_Cen_ID : this.ObjBrowsePurBill.Cost_Cen_ID ? this.ObjBrowsePurBill.Cost_Cen_ID : 0
  }
  if (valid) {
  const obj = {
    "SP_String": "SP_Common_Purchase_Bill",
    "Report_Name_String": "Purchase_Bill_Browse",
    "Json_Param_String": JSON.stringify([tempobj])
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.SerarchPurBillList = data;
    // this.BackupSearchedlist = data;
    // this.GetDistinct();
    // if(this.getAllDataList.length){
    //   this.DynamicHeader = Object.keys(data[0]);
    // }
    this.seachSpinner = false;
    this.SearchPurBillFormSubmitted = false;
   // console.log("Get All Data",this.SerarchPurBillList);
  })
  }
  }
  Print(DocNo) {
    if(DocNo) {
      window.open("/Report/Crystal_Files/Finance/Purchase/Purchase_Bill_GST_Print.aspx?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }
  Delete(col){
   // console.log("Delete Col",col);
    this.DocNo = undefined;
    if(col.Doc_No){
     this.DocNo = col.Doc_No
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "d",
       sticky: true,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
    }
   }
   onConfirmDel(){
    if(this.DocNo){
     const obj = {
       "SP_String": "SP_Common_Purchase_Bill",
       "Report_Name_String":"Purchase_Bill_Delete",
       "Json_Param_String": JSON.stringify([{Doc_No : this.DocNo , User_ID : this.$CompacctAPI.CompacctCookies.User_ID}]) 
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("data ==",data[0].Column1);
       if (data[0].Column1 === "Done"){
         this.compacctToast.clear();
         this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Purchase Bill ",
           detail: "Succesfully Delete"
         });
         this.DocNo = undefined;
         this.GetSerarchPurBill(true);
         }
          
        else {
          this.compacctToast.clear();
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "error",
           summary: "Warn Message",
           detail: "Error Occured "
         });
          this.DocNo = undefined;
          this.GetSerarchPurBill(true);
        }
        });
    }
   }
   onReject() {
    this.compacctToast.clear("c");
    this.compacctToast.clear("d");
    this.Spinner = false;
    this.ngxService.stop();
    this.deleteError = false;
  }

  EditPurchaseBill(col){
    this.editDocNo = undefined;
    if(col.Doc_No){
     this.editDocNo = col.Doc_No
     this.tabIndexToView = 1;
    this.items = [ 'BROWSE', 'UPDATE'];
    this.buttonname = "Update";
    this.geteditData(col.Doc_No);
    }
  }
  geteditData(Dno){
    const obj = {
      "SP_String": "SP_Common_Purchase_Bill",
      "Report_Name_String": "Purchase_Bill_Edit_Data",
      "Json_Param_String": JSON.stringify([{Doc_No : Dno}])
   }
    this.GlobalAPI.getData(obj).subscribe((res:any)=>{
      let data = JSON.parse(res[0].Column1)
      console.log("Edit data",data);
      this.ObjPurChaseBill = data[0],
      this.TCSTaxRequired = data[0].TCS_Amount ? "YES" : "NO";
      this.GetTCSdat();
      // this.GetGRNno();
      this.maindisabled = true;
      this.ObjPurChaseBill.Choose_Address = "MAIN";
      // this.getreq();
      this.DocDate = new Date(data[0].Doc_Date);
      this.SupplierBillDate = new Date(data[0].Supp_Ref_Date);
      this.CNDate = new Date(data[0].CN_Date);
      this.TCS_Per = data[0].TCS_Persentage;
      this.AddProductDetails = data[0].L_element;
      this.AddTermList = data[0].TERM_element ? data[0].TERM_element : [] ;
      // console.log("addPurchaseList",this.addPurchaseList)
      if(this.AddProductDetails.length || this.AddTermList.length){
        this.ListofTotalAmount()
        this.TcsAmtCalculation()
      }
    })
  }


  // FilterChangen
  GlobalFilterChangenUpdate() {
    let searchFields:any = [];
    let ProjectFilter:any = [];
    let subLedgerFilter:any = [];
   
  if (this.SelectedDistProject.length) {
     searchFields.push('Project_Description');
      ProjectFilter = this.SelectedDistProject;
    }
    if (this.SelectedSubledger.length) {
      searchFields.push('Sub_Ledger_Name');
      subLedgerFilter = this.SelectedSubledger;
    }
    this.SerarchPurBillList = [];
    if (searchFields.length) {
      let LeadArr = this.bckUpSerarchPurBillList.filter(function (e) {
        return ((ProjectFilter.length ? ProjectFilter.includes(e['Project_Description']) : true)
          && (subLedgerFilter.length ? subLedgerFilter.includes(e['Sub_Ledger_Name']) : true)
         );
      });
      this.SerarchPurBillList = LeadArr.length ? LeadArr : [];
    } else {
      this.SerarchPurBillList = this.bckUpSerarchPurBillList;
    }
  }
}
class PurChaseBill {
  Doc_No : any;
  Choose_Address : any;
  Doc_Date : any;
  Company_ID: any;
  Sub_Ledger_ID : any;
  Sub_Ledger_Name : string;
  Sub_Ledger_Billing_Name : string;
  Sub_Ledger_Address_1 : string;
  Sub_Ledger_Address_2 : string;
  Sub_Ledger_Address_3 : string;
  Sub_Ledger_Land_Mark : string;
  Sub_Ledger_Pin : any;
  Sub_Ledger_District : string;
  Sub_Ledger_State : any;
  Sub_Ledger_Country : string;
  Sub_Ledger_Email : any;
  Sub_Ledger_Mobile_No : number;
  Sub_Ledger_PAN_No : any;
  Sub_Ledger_TIN_No : any;
  Sub_Ledger_CST_No : any;
  Sub_Ledger_SERV_REG_NO : any;
  Sub_Ledger_UID_NO : any;
  Sub_Ledger_EXID_NO : any;
  Sub_Ledger_GST_No : any;
  Sub_Ledger_CIN_No : any;

  Cost_Cen_ID : any;
  Cost_Cen_Name : string;
  Cost_Cen_Address1 : string;
  Cost_Cen_Address2 : string;
  Cost_Cen_Location : string;
  Cost_Cen_District : string;
  Cost_Cen_State : string;
  Cost_Cen_Country : string;
  Cost_Cen_PIN : any;
  Cost_Cen_Mobile : number;
  Cost_Cen_Phone : number;
  Cost_Cen_Email : any;
  Cost_Cen_VAT_CST : any;
  Cost_Cen_CST_NO : any;
  Cost_Cen_SRV_TAX_NO : any;
  Cost_Cen_GST_No : any;

  
  Project_ID : number;
  Currency_ID : number;
  Currency_Symbol : any;
  Revenue_Cost_Cent_ID : number;
  Revenue_Cost_Cent_Name : string;
  Supp_Ref_No : any;
  Supp_Ref_Date : any;
  CN_No : any;
  CN_Date : any;
  RCM : any;
  Remarks : any;

  Bill_Gross_Amt : number;
  Bill_Net_Amt : number;
  Rounded_Off : number;
  User_ID : number;
  Fin_Year_ID : number;

  // HSN_No : any;

  L_element : any;
  TERM_element : any;
  TCSTaxRequired: any;
  TCSInputLedger: any;
  TCS_Persentage: any;
  TCS_Amount: any;


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
 class BrowsePurBill {
  Company_ID : any;
  start_date : Date;
  end_date : Date;
  Cost_Cen_ID : any;
}

class ProductInfo {
  Pur_Order_No: string;
  Pur_Order_Date: string;
  Product_ID: any;
  Product_Name: string;
  Product_Specification: any;
  Batch_Number: string;
  Serial_No: any;
  HSN_No: any;
  No_Of_Bag: number;
  Gross_Wt: number; // new field
  Qty: number;
  UOM: any;
  Rate: any;
  MRP = 0;
  Amount: number;
  Discount_Type = undefined;
  Discount_Type_Amt : number;
  Discount : number;
  Taxable_Amount : number;
  Godown_Id: any;
  CESS_Percentage: number;
  // GRN_No: any;

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

  Product_Expiry : any;
  Expiry_Date: string;
  CESS_AMT: number;
  

}
class Term {
  Txn_ID: string;
  DOC_No: string;
  Sale_Pur = 0;
  Term_ID: number;
  Term_Name: number;
  Term_Amount: number;
  SGST_Rate: number;
  SGST_Amount: number;
  CGST_Rate: number;
  CGST_Amount: number;
  IGST_Rate: number;
  IGST_Amount: number;

  CGST_Input_Ledger_ID: number;
  SGST_Input_Ledger_Id: number;
  IGST_Input_Ledger_ID: number;
  Purchase_Ac_Ledger: number;
  HSN_No: number;
  Exp_Term_Amount_Fr: any;
}

class TDS{
  Ledger_ID : number;
  Sub_Ledger_ID : number;
  Taxable_Amount : number;
  TDS_Percentage : number;
  TDS_Amount : number;

}
