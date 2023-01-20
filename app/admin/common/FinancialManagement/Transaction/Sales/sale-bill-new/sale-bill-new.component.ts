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
import { Console } from 'console';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-sale-bill-new',
  templateUrl: './sale-bill-new.component.html',
  styleUrls: ['./sale-bill-new.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SaleBillNewComponent implements OnInit {
  items:any = [];
  menuList:any = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Create";
  currentdate = new Date();
  DocDate = new Date();
  CNDate : Date;

  CustomerList:any = [];
  ChooseAddressList:any = [];
  maindisabled = false;
  StateList:any = [];
  CostCenterList:any = [];
  AcceptanceOrderNoList:any = [];
  Acceptance_Order_Date : Date;
  
  ProductDetails:any = [];

  SaleBillNewFormSubmitted = false;
  ObjSaleBillNew = new SaleBillNew();
  Own_Delivery = false;
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
  BatchNoList:any = [];

  Searchedlist:any = [];
  EditList:any = [];
  doc_no: any;
  SpinnerShow = false;
  inputBoxDisabled = false;
  companyList:any = [];
  
  ProjectList:any = [];
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

  ObjBrowseSaleBillNew = new BrowseSaleBillNew();
  SerarchsaleBillNewList:any = [];
  bckUpSerarchPurBillList:any = []
  SearchSaleBillNewFormSubmitted = false;
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

  hrYeatList:any = [];
  HR_Year_ID:any;
  initDate:any = [];
  POList:any = [];
  DistProject:any = []
  SelectedDistProject:any = []
  DistSubledger:any = []
  SelectedSubledger:any = []
  bckUpQty:any = undefined;
  bckUpQtyValid:boolean = false;
  editDocNo : any;
  databaseName : any;
  aodateenabled = false;
  Productbutton : any;

  cols:any =[];


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
    console.log(this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
    $(document).prop('title', this.headerData ? this.headerData : $('title').text());
    this.items = ["BROWSE", "CREATE", "PENDING GRN"];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];
    this.Header.pushHeader({
      Header: "Sale Bill GST",
      Link: " Financial Management -> Transaction -> Sales ->  Sale Bill GST"
    });
    this.getDatabase();
    this.GetCustomer();
    this.GetStateList();
    this.GetCostcenter();
    // this.GetProject();
    // this.ObjSaleBillNew.RCM = "N";
    this.GetTerm();
    // this.GetSearchedlist();

    this.cols = [
      { field: 'Doc_No', header: 'Doc No' },
      { field: 'Doc_Date', header: 'Doc Date' },
      { field: 'Sub_Ledger_Name', header: 'Sub Ledger' },
      { field: 'Cost_Cen_Name', header: 'Cost Center' },
      { field: 'Member_Name', header: 'Member Name' },
      { field: 'Bill_Net_Amt', header: 'Net Amount' },
      { field: 'Sale_Bill_Upload', header: 'Image' },
      { field: 'Fin_Year_Name', header: 'Fin Year' }
    ];
  }
  getDatabase(){
    this.$http
        .get("/Common/Get_Database_Name",
        {responseType: 'text'})
        .subscribe((data: any) => {
          this.databaseName = data;
          console.log(data)
        });
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE", "PENDING GRN"];
     this.buttonname = "Create";
     this.Spinner = false;
     this.seachSpinner = false;
     this.clearData();
     this.clearProject();
     this.productaddSubmit = [];
     this.Spinner = false;
    //  this.Godownlist = [];
     this.POorderlist = [];
    //  this.GetProductdetails();
    //  this.ObjProductInfo = new ProductInfo();
     this.editDocNo = undefined;
   }
   clearData(){
     this.ObjSaleBillNew = new SaleBillNew();
     //this.ObjSaleBillNew.Choose_Address = "MAIN";
     this.SaleBillNewFormSubmitted = false;
    //  this.validatation.required = false;
     this.maindisabled = false;
     this.ObjSaleBillNew.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjSaleBillNew.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.ObjSaleBillNew.Revenue_Cost_Cent_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.ObjProductInfo.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.GetCosCenAddress();
     this.DocDate = new Date();
     this.CNDate = undefined;
     this.bckUpQtyValid = false
     this.PurOrderList = [];
     this.bckUpQty = undefined
     this.POList = [];
     this.PODate = undefined;
     this.GRNList = [];
     this.GRNDate = undefined;
    //  this.GetProductdetails();
     this.PONoProList = [];
     this.GRNNoProlist = [];
    //  this.ObjSaleBillNew.Currency_ID = 1;
    //  this.ObjSaleBillNew.RCM = "N";
     this.AddProductDetails = [];
     this.clearlistamount();
     this.AddTermList = [];
     this.ObjTerm = new Term();
    //  this.cleartotaltermamount();
  
   }
   GetCustomer(){
    const obj = {
      "SP_String": "SP_Sale_Bill_New",
      "Report_Name_String": "Get_Subledger",
     // "Json_Param_String": JSON.stringify([TempObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.CustomerList = data;
   });
   }
   CustomerChange(){
    //this.ExpiredProductFLag = false;
    this.ObjSaleBillNew.Sub_Ledger_Billing_Name = undefined;
    this.ObjSaleBillNew.Sub_Ledger_Billing_State = undefined;
    this.ObjSaleBillNew.IS_SEZ = undefined;
    this.ObjSaleBillNew.Sub_Ledger_Mobile_No = undefined;
    this.ObjSaleBillNew.Payment_Terms = undefined;
    this.Productlist = [];
    this.ChooseAddressList = [];
    this.ObjSaleBillNew.Choose_Address = undefined;
    this.AcceptanceOrderNoList = [];

     this.ObjSaleBillNew.Sub_Ledger_State = undefined;
     this.ObjSaleBillNew.Sub_Ledger_GST_No = undefined;
     this.ObjSaleBillNew.Sub_Ledger_Address_1 = undefined;
     this.ObjSaleBillNew.Sub_Ledger_Land_Mark = undefined;
     this.ObjSaleBillNew.Sub_Ledger_Pin = undefined;
     this.ObjSaleBillNew.Sub_Ledger_District = undefined;
     this.ObjSaleBillNew.Sub_Ledger_Country = undefined;
     this.Acceptance_Order_Date = new Date();
    if(this.ObjSaleBillNew.Sub_Ledger_ID) {
     const customerObj = this.CustomerList.filter(item=> item.value == this.ObjSaleBillNew.Sub_Ledger_ID);
    // console.log(vendorObj);
     this.ObjSaleBillNew.Sub_Ledger_Name = customerObj[0].label;
     this.ObjSaleBillNew.Sub_Ledger_Billing_Name = customerObj[0].Sub_Ledger_Billing_Name;
     this.ObjSaleBillNew.Sub_Ledger_Billing_State = customerObj[0].Sub_Ledger_State;
     this.ObjSaleBillNew.IS_SEZ = customerObj[0].IS_SEZ;
     this.ObjSaleBillNew.Sub_Ledger_Mobile_No = customerObj[0].Sub_Ledger_Mobile_No;
     this.ObjSaleBillNew.Payment_Terms = customerObj[0].CR_Days + " Days";
     this.GetAllProductdetails();
     this.GetChooseAddress();
    }
   }
   GetChooseAddress() {
    this.ChooseAddressList = [];
    this.ngxService.start();
    const obj = {
      "SP_String": "SP_Sale_Bill_New",
      "Report_Name_String": "Get_Subledger_Address",
      "Json_Param_String": JSON.stringify([{Sub_Ledger_ID:this.ObjSaleBillNew.Sub_Ledger_ID}])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.ChooseAddressList = data;
         // console.log('ChooseAddressList',this.ChooseAddressList)
         this.GetAcceptanceOrderNo();
        this.ngxService.stop();
    })
   }
   ChooseAddressChange(){
     //this.ExpiredProductFLag = false;
     this.ObjSaleBillNew.Sub_Ledger_State = undefined;
     this.ObjSaleBillNew.Sub_Ledger_GST_No = undefined;
     this.ObjSaleBillNew.Sub_Ledger_Address_1 = undefined;
     this.ObjSaleBillNew.Sub_Ledger_Land_Mark = undefined;
     this.ObjSaleBillNew.Sub_Ledger_Pin = undefined;
     this.ObjSaleBillNew.Sub_Ledger_District = undefined;
     this.ObjSaleBillNew.Sub_Ledger_Country = undefined;
     // this.ObjSaleBillNew.Sub_Ledger_Email = ChooseaddressObj[0].label;
     // this.ObjSaleBillNew.Sub_Ledger_Mobile_No = ChooseaddressObj[0].Sub_Ledger_Billing_Name;
     // this.ObjSaleBillNew.Sub_Ledger_PAN_No = ChooseaddressObj[0].label;
     // this.ObjSaleBillNew.Sub_Ledger_CIN_No = ChooseaddressObj[0].Sub_Ledger_Billing_Name;
   if(this.ObjSaleBillNew.Choose_Address) {
    const ChooseaddressObj = this.ChooseAddressList.filter(item=> item.Address_Caption == this.ObjSaleBillNew.Choose_Address);
   // console.log(vendorObj);
    this.ObjSaleBillNew.Sub_Ledger_State = ChooseaddressObj[0].State;
    this.ObjSaleBillNew.Sub_Ledger_GST_No = ChooseaddressObj[0].Sub_Ledger_GST_No;
    this.ObjSaleBillNew.Sub_Ledger_Address_1 = ChooseaddressObj[0].Address_1;
    this.ObjSaleBillNew.Sub_Ledger_Land_Mark = ChooseaddressObj[0].Land_Mark;
    this.ObjSaleBillNew.Sub_Ledger_Pin = ChooseaddressObj[0].Pin;
    this.ObjSaleBillNew.Sub_Ledger_District = ChooseaddressObj[0].District;
    this.ObjSaleBillNew.Sub_Ledger_Country = ChooseaddressObj[0].Country;
    // this.ObjSaleBillNew.Sub_Ledger_Email = ChooseaddressObj[0].label;
    // this.ObjSaleBillNew.Sub_Ledger_Mobile_No = ChooseaddressObj[0].Sub_Ledger_Billing_Name;
    // this.ObjSaleBillNew.Sub_Ledger_PAN_No = ChooseaddressObj[0].label;
    // this.ObjSaleBillNew.Sub_Ledger_CIN_No = ChooseaddressObj[0].Sub_Ledger_Billing_Name;
   } 
   }
   GetStateList() {
    const obj = {
      "SP_String": "SP_Sale_Bill_New",
      "Report_Name_String": "Get_State_List",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.StateList = data;
         // console.log('StateList',this.StateList)
    })
    // this.$http
    //   .get("/Common/Get_State_List")
    //   .subscribe((data: any) => {
    //     // this.StateList = data ? JSON.parse(data) : [];
    //     this.StateList = data;
    //    // console.log('StateList',this.StateList)
    //   });
   }
   GetCostcenter(){
    const obj = {
      "SP_String": "SP_Sale_Bill_New",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log("costcenterList  ===",data);
      this.CostCenterList = data;
      this.ObjBrowseSaleBillNew.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.ObjSaleBillNew.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.GetCosCenAddress();
      this.ObjSaleBillNew.Revenue_Cost_Cent_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.ObjProductInfo.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      })
   }
   GetGodown(){
    const TempObj = {
      Cost_Cen_ID : this.ObjSaleBillNew.Cost_Cen_ID,
      }
    const obj = {
      "SP_String": "SP_Sale_Bill_New",
      "Report_Name_String": "Get_Godown_list",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("GodownList  ===",data);
      this.GodownList = data;
      this.ObjProductInfo.Godown_Id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
      })
   }
   GetCosCenAddress(){
    //this.ExpiredProductFLag = false;
    if(this.ObjSaleBillNew.Cost_Cen_ID) {
   const ctrl = this;
   const costcenObj = $.grep(ctrl.CostCenterList,function(item: any) {return item.Cost_Cen_ID == ctrl.ObjSaleBillNew.Cost_Cen_ID})[0];
  // console.log(costcenObj);
   this.ObjSaleBillNew.Cost_Cen_Name = costcenObj.Cost_Cen_Name;
   this.ObjSaleBillNew.Cost_Cen_Address1 = costcenObj.Cost_Cen_Address1;
   this.ObjSaleBillNew.Cost_Cen_Address2 = costcenObj.Cost_Cen_Address2;
   this.ObjSaleBillNew.Cost_Cen_State = costcenObj.Cost_Cen_State;
   this.ObjSaleBillNew.Cost_Cen_GST_No = costcenObj.Cost_Cen_GST_No;
   this.ObjSaleBillNew.Cost_Cen_Location = costcenObj.Cost_Cen_Location;
   this.ObjSaleBillNew.Cost_Cen_PIN = costcenObj.Cost_Cen_PIN;
   this.ObjSaleBillNew.Cost_Cen_District = costcenObj.Cost_Cen_District;
   this.ObjSaleBillNew.Cost_Cen_Country = costcenObj.Cost_Cen_Country;
   this.ObjSaleBillNew.Cost_Cen_Mobile = costcenObj.Cost_Cen_Mobile;
   this.ObjSaleBillNew.Cost_Cen_Phone = costcenObj.Cost_Cen_Phone;
   this.ObjSaleBillNew.Cost_Cen_Email = costcenObj.Cost_Cen_Email1;
   this.ObjSaleBillNew.Cost_Cen_VAT_CST = costcenObj.Cost_Cen_VAT_CST;
   this.ObjSaleBillNew.Cost_Cen_CST_NO = costcenObj.Cost_Cen_CST_NO;
   this.ObjSaleBillNew.Cost_Cen_SRV_TAX_NO = costcenObj.Cost_Cen_SRV_TAX_NO;
   this.ObjSaleBillNew.Cost_Cen_GST_No = costcenObj.Cost_Cen_GST_No;
   this.GetGodown();
  }
   }
   GetAcceptanceOrderNo(){
    const obj = {
      "SP_String": "SP_Sale_Bill_New",
      "Report_Name_String": "Get_Acceptance_Order_Nos",
     "Json_Param_String": JSON.stringify([{Sub_Ledger_ID : this.ObjSaleBillNew.Sub_Ledger_ID}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
         data.forEach(element => {
           element['label'] = element.Doc_No,
           element['value'] = element.Doc_No
         });
         this.AcceptanceOrderNoList = data;
        //  this.backUpproductList = this.Productlist;
        //  this.getproducttype();
       } else {
         this.AcceptanceOrderNoList = [];

       }
    // console.log("vendor list======",this.CustomerList);
   });
   }
   GetAcceptanceOrderDate(){
    this.Acceptance_Order_Date = new Date();
    this.Productlist = [];
    this.ObjProductInfo.Product_ID = undefined;
     this.ObjProductInfo.HSN_No = undefined;
     this.ObjProductInfo.Product_Specification = undefined;
     this.ObjProductInfo.Qty = undefined;
     this.ObjProductInfo.UOM = undefined;
     this.ObjProductInfo.Rate = undefined;
    if(this.ObjSaleBillNew.Acceptance_Order_No) {
      const AceepOrderDate = this.AcceptanceOrderNoList.filter(item=> item.Doc_No == this.ObjSaleBillNew.Acceptance_Order_No);
     // console.log(GRNDateObj);
     this.Acceptance_Order_Date = new Date(AceepOrderDate[0].Doc_Date);
      this.GetProductdetails();
     } 
    else {
      this.GetAllProductdetails();
    }
   }
   GetAllProductdetails(){
    this.Productlist = [];
    this.ngxService.start();
     const orderObj = {
       Doc_Date : this.DateService.dateConvert(new Date())
       }
    const obj = {
      "SP_String": "SP_Sale_Bill_New",
      "Report_Name_String": "Get_All_Products",
      "Json_Param_String": JSON.stringify([orderObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=> {
      this.Productlist = data;
      this.ngxService.stop();
      this.Productbutton = "(Show AO Product)"
     })
 
    }
   GetProductdetails(){
   this.Productlist = [];
   this.ngxService.start();
   if (this.ObjSaleBillNew.Acceptance_Order_No) {
    const orderObj = {
      Doc_No : this.ObjSaleBillNew.Acceptance_Order_No,
      Doc_Date : this.DateService.dateConvert(new Date(this.Acceptance_Order_Date))
      }
   const obj = {
     "SP_String": "SP_Sale_Bill_New",
     "Report_Name_String": "Get_Products_Details",
     "Json_Param_String": JSON.stringify([orderObj])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=> {
     this.Productlist = data;
     this.ngxService.stop();
     this.Productbutton = "(Show All Product)"
    //  this.GRNNoProlist.forEach(item=>{
    //    item.Product_ID = item.value;
    //    item.Product_Name = item.label;
    //    item.Discount_Type = item.Discount_Type ? item.Discount_Type : undefined;
    //    item.Discount_Type_Amount = item.Discount_Type_Amount ? item.Discount_Type_Amount : 0;
    //    item.Discount = item.Discount_Amount ? item.Discount_Amount : 0;
    // })
    // this.CalculateCessAmt();
    // this.calculategstamt();
    // this.calculatenetamt();
    // this.ListofTotalAmount();
    })
  }

   }
   ProductRefresh(){
    if (this.Productbutton === "(Show AO Product)"){
      this.GetProductdetails();
    }
    else {
      this.GetAllProductdetails();
    }
   }
   GetProductDetailsChange(){
     this.ObjProductInfo.HSN_No = undefined;
     this.ObjProductInfo.Product_Specification = undefined;
     this.ObjProductInfo.Qty = undefined;
     this.ObjProductInfo.UOM = undefined;
     this.ObjProductInfo.Rate = undefined;
     this.ObjProductInfo.Weight_in_Pound = 0;
     this.ObjProductInfo.Acompanish = 0;
     this.ObjProductInfo.CGST_Rate = undefined;
     this.ObjProductInfo.CGST_Amount = undefined;
     this.ObjProductInfo.SGST_Rate = undefined;
     this.ObjProductInfo.SGST_Amount = undefined;
     this.ObjProductInfo.IGST_Rate = undefined;
     this.ObjProductInfo.IGST_Amount = undefined;
    if(this.ObjProductInfo.Product_ID) {
     const productObj = this.Productlist.filter(item=> item.value == this.ObjProductInfo.Product_ID);
    // console.log(vendorObj);
     this.ObjProductInfo.HSN_No = productObj[0].HSN_No;
     this.ObjProductInfo.Product_Specification = productObj[0].Product_Spec;
     this.ObjProductInfo.Qty = productObj[0].Qty;
     this.ObjProductInfo.UOM = productObj[0].UOM;
     this.ObjProductInfo.Rate = productObj[0].Rate;
     this.ObjProductInfo.Weight_in_Pound = productObj[0].Weight_in_Pound ? productObj[0].Weight_in_Pound : 0;
     this.ObjProductInfo.Acompanish = productObj[0].Acompanish ? productObj[0].Acompanish : 0;
     this.ObjProductInfo.CGST_Rate = productObj[0].CGST_Rate;
     this.ObjProductInfo.CGST_Amount = productObj[0].CGST_Amount;
     this.ObjProductInfo.SGST_Rate = productObj[0].SGST_Rate;
     this.ObjProductInfo.SGST_Amount = productObj[0].SGST_Amount;
     this.ObjProductInfo.IGST_Rate = productObj[0].IGST_Rate;
     this.ObjProductInfo.IGST_Amount = productObj[0].IGST_Amount;
     this.CalCulateTotalAmt();
    }
   }
   GetBatchNo() {
    this.BatchNoList = [];
    const ProObj = {
      Product_ID : this.ObjProductInfo.Product_ID,
      Cost_Cen_ID : this.ObjProductInfo.Cost_Cen_ID,
      Godown_ID : this.ObjProductInfo.Godown_Id
      }
    const obj = {
      "SP_String": "SP_Sale_Bill_New",
      "Report_Name_String": "Get_Batch_NO",
      "Json_Param_String": JSON.stringify([ProObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.BatchNoList = data;
         // console.log('StateList',this.StateList)
    })
   }
  CalCulateTotalAmt(){
    this.ObjProductInfo.Amount = 0;
      this.ObjProductInfo.Taxable_Amount = 0;
    if (this.ObjProductInfo.Qty && this.ObjProductInfo.Rate) {
      // this.chkqut()
      var amt;
      amt = Number((this.ObjProductInfo.Qty * this.ObjProductInfo.Rate * this.ObjProductInfo.Weight_in_Pound) + this.ObjProductInfo.Acompanish).toFixed(2);
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
    if(this.ObjProductInfo.Discount_Type){
      // this.ObjProductInfo.Discount_Type_Amount = 0;
      this.ObjProductInfo.Discount = 0;
      this.AfterDiscCalChange();
      this.calculategstamt();
      this.CalculateCessAmt();
      this.calculatenetamt();
    } 
    else {
      this.ObjProductInfo.Discount_Type_Amount = undefined;
      this.ObjProductInfo.Discount = undefined;
      this.AfterDiscCalChange();
      this.calculategstamt();
      this.CalculateCessAmt();
      this.calculatenetamt();
    }
  }
  AfterDiscCalChange(){
    this.ObjProductInfo.Discount = 0;
    this.ObjProductInfo.Taxable_Amount = 0;
    if (this.ObjProductInfo.Discount_Type_Amount) { 
      var disamt;
      var taxamt;
    if(this.ObjProductInfo.Discount_Type == "%") {
      disamt = Number((Number(this.ObjProductInfo.Amount) * Number(this.ObjProductInfo.Discount_Type_Amount)) / 100).toFixed(2);
      this.ObjProductInfo.Discount =Number(disamt);
      // this.ListofTotalAmount();
      this.CalculateTotalAmount();
      this.calculateDiscount();
      this.calculateTaxableAmount();
      this.calculateCGSTAmount();
      this.calculateSGSTAmount();
      this.calculateIGST();
      this.calculateTermAmount();
      this.calculateTermCGSTAmount();
      this.calculateTermSGSTAmount();
      this.calculateTermIGST();
      this.calculateGrossAmount();
      this.calculateRoundedOff();
      this.calculateNetAmount();
      this.TcsAmtCalculation();
    }
    if(this.ObjProductInfo.Discount_Type == "AMT") {
      this.ObjProductInfo.Discount = Number(this.ObjProductInfo.Discount_Type_Amount);
      // this.ListofTotalAmount();
      this.CalculateTotalAmount();
      this.calculateDiscount();
      this.calculateTaxableAmount();
      this.calculateCGSTAmount();
      this.calculateSGSTAmount();
      this.calculateIGST();
      this.calculateTermAmount();
      this.calculateTermCGSTAmount();
      this.calculateTermSGSTAmount();
      this.calculateTermIGST();
      this.calculateGrossAmount();
      this.calculateNetAmount();
      this.calculateRoundedOff();
      this.TcsAmtCalculation();
    }
    taxamt = Number(Number(this.ObjProductInfo.Amount) - Number(this.ObjProductInfo.Discount)).toFixed(2);
    this.ObjProductInfo.Taxable_Amount = Number(taxamt);
    this.calculategstamt();
    this.CalculateCessAmt();
    this.calculatenetamt();
    // this.ListofTotalAmount();
      this.CalculateTotalAmount();
      this.calculateDiscount();
      this.calculateTaxableAmount();
      this.calculateCGSTAmount();
      this.calculateSGSTAmount();
      this.calculateIGST();
      this.calculateTermAmount();
      this.calculateTermCGSTAmount();
      this.calculateTermSGSTAmount();
      this.calculateTermIGST();
      this.TcsAmtCalculation();
      this.calculateGrossAmount();
      this.calculateNetAmount();
      this.calculateRoundedOff();
    }
    else {
      this.ObjProductInfo.Discount = 0;
      this.ObjProductInfo.Taxable_Amount = Number(this.ObjProductInfo.Amount);
      this.calculategstamt();
      this.CalculateCessAmt();
      this.calculatenetamt();
      // this.ListofTotalAmount();
      this.CalculateTotalAmount();
      this.calculateDiscount();
      this.calculateTaxableAmount();
      this.calculateCGSTAmount();
      this.calculateSGSTAmount();
      this.calculateIGST();
      this.calculateTermAmount();
      this.calculateTermCGSTAmount();
      this.calculateTermSGSTAmount();
      this.calculateTermIGST();
      this.calculateGrossAmount();
      this.calculateNetAmount();
      this.calculateRoundedOff();
      this.TcsAmtCalculation();
    }
  }
  CalculateCessAmt(){
    this.GRNNoProlist.forEach(el=>{
      el.CESS_AMT = 0;
      var cessamount;
      if (el.CESS_Percentage) {
      cessamount = Number(((el.Taxable_Amount * el.CESS_Percentage) / 100).toFixed(2));
      el.CESS_AMT = Number(cessamount);
      }
      else {
        el.CESS_AMT = 0;
      }
    })
    
  }
  calculategstamt(){
    // // this.Productlist.forEach(ele=>{
    //   const SubLedgerState = this.ObjSaleBillNew.Sub_Ledger_State
    //     ? this.ObjSaleBillNew.Sub_Ledger_State.toUpperCase()
    //     : undefined;
    //   const CostCenterState = this.ObjSaleBillNew.Cost_Cen_State
    //     ? this.ObjSaleBillNew.Cost_Cen_State.toUpperCase()
    //     : undefined;
    //     if (SubLedgerState && CostCenterState) {
    //       if (SubLedgerState === CostCenterState) {
    //         this.ObjProductInfo.CGST_Amount = Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.CGST_Rate) / 100).toFixed(2));
    //         this.ObjProductInfo.SGST_Amount = Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.SGST_Rate) / 100).toFixed(2));
    //         this.ObjProductInfo.IGST_Amount = 0;
    //         this.ObjProductInfo.IGST_Rate = 0;
    //       }
    //       else {
    //         this.ObjProductInfo.IGST_Amount = Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.IGST_Rate) / 100).toFixed(2));
    //         this.ObjProductInfo.CGST_Amount = 0;
    //         this.ObjProductInfo.CGST_Rate = 0;
    //         this.ObjProductInfo.SGST_Amount = 0;
    //         this.ObjProductInfo.SGST_Rate = 0;
    //       }
    //     } 
    // // })
    
  }
  calculatenetamt(){
    // this.GRNNoProlist.forEach(elem => {
      // this.ObjProductInfo.CESS_AMT = elem.CESS_AMT ? Number(elem.CESS_AMT) : 0; + Number(elem.CESS_AMT)
      var grossamt = (Number(this.ObjProductInfo.Taxable_Amount) + Number(this.ObjProductInfo.CGST_Amount) + Number(this.ObjProductInfo.SGST_Amount) 
                    + Number(this.ObjProductInfo.IGST_Amount)).toFixed(2);
          this.ObjProductInfo.Gross_Amount = Number(grossamt)
    // })
    
  }
  AddProductInfo(valid) {
    //console.log(this.ObjaddbillForm.Product_ID)
    this.ProductInfoSubmitted = true;
    if(valid) {
      const SubLedgerState = this.ObjSaleBillNew.Sub_Ledger_State
        ? this.ObjSaleBillNew.Sub_Ledger_State.toUpperCase()
        : undefined;
      const CostCenterState = this.ObjSaleBillNew.Cost_Cen_State
        ? this.ObjSaleBillNew.Cost_Cen_State.toUpperCase()
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
                    + Number(this.ObjProductInfo.IGST_Amount)).toFixed(2);

      var costcenter = this.CostCenterList.filter(item=> Number(item.Cost_Cen_ID) === Number(this.ObjProductInfo.Cost_Cen_ID))
      var stockpoint = this.GodownList.filter(item=> Number(item.godown_id) === Number(this.ObjProductInfo.Godown_Id))
    var productObj = {
      Product_ID : this.ObjProductInfo.Product_ID,
      Product_Name : this.ObjProductInfo.Product_Specification,
      Product_Specification : this.ObjProductInfo.Product_Specification,
      // HSN_Code : this.ObjProductInfo.HSN_No,
      HSL_No : this.ObjProductInfo.HSN_No,
      Batch_Number : this.ObjProductInfo.Batch_Number,
      Serial_No : this.ObjProductInfo.Serial_No,
      // Product_Expiry : this.ObjProductInfo.Product_Expiry ? 1 : 0,
      // Expiry_Date : this.ObjProductInfo.Expiry_Date,
      Qty : this.ObjProductInfo.Qty,
      UOM : this.ObjProductInfo.UOM,
      MRP : this.ObjProductInfo.Rate,
      Rate : this.ObjProductInfo.Rate,
      Weight_in_Pound : Number(this.ObjProductInfo.Weight_in_Pound),
      Acompanish : Number(this.ObjProductInfo.Acompanish),
      Amount : Number(this.ObjProductInfo.Amount),
      Discount_Type : this.ObjProductInfo.Discount_Type,
      Discount_Type_Amount : this.ObjProductInfo.Discount_Type_Amount ? Number(this.ObjProductInfo.Discount_Type_Amount) : 0,
      Discount : this.ObjProductInfo.Discount ? Number(this.ObjProductInfo.Discount) : 0,
      Taxable_Amount : Number(this.ObjProductInfo.Taxable_Amount),
      CGST_Rate : Number(this.ObjProductInfo.CGST_Rate),
      CGST_Amount : Number(this.ObjProductInfo.CGST_Amount),
      SGST_Rate : Number(this.ObjProductInfo.SGST_Rate),
      SGST_Amount : Number(this.ObjProductInfo.SGST_Amount),
      IGST_Rate : Number(this.ObjProductInfo.IGST_Rate),
      IGST_Amount : Number(this.ObjProductInfo.IGST_Amount),
      // CESS_Percentage : this.ObjProductInfo.CESS_Percentage ? Number(this.ObjProductInfo.CESS_Percentage) : 0,
      // CESS_Amount : this.ObjProductInfo.CESS_AMT ? Number(this.ObjProductInfo.CESS_AMT) : 0,
      Gross_Amount : Number(netamount),
      // Net_Value : Number(netamount),
      Cost_Cen_Id : this.ObjProductInfo.Cost_Cen_ID,
      Cost_Cen_Name : costcenter.length ? costcenter[0].Cost_Cen_Name : undefined,
      godown_id : this.ObjProductInfo.Godown_Id ? Number(this.ObjProductInfo.Godown_Id) : 0,
      Godown_Name : stockpoint.length ? stockpoint[0].godown_name : undefined,
      AO_Product : this.ObjSaleBillNew.AO_Product,
      AO_Qty : this.ObjSaleBillNew.AO_Qty,
      AO_Order_No : this.ObjSaleBillNew.Acceptance_Order_No,
      // Pur_Order_No : this.ObjProductInfo.Pur_Order_No,
      // Pur_Order_Date : this.PODate ? this.DateService.dateConvert(new Date(this.PODate)) : "01/Jan/1900",
  
    };
    this.AddProductDetails.push(productObj);
    // console.log('this.AddProductDetails===',this.AddProductDetails)
    // this.ObjProductInfo = new ProductInfo();
    // this.GRNList = [];
    // this.GetProductdetails();
    // this.ProductInfoSubmitted = false;
    // this.ListofTotalAmount();

    // if(this.Maintain_Serial_No){
    //   this.ProductInfoSubmitted = false;
    //   this.ObjProductInfo.Serial_No = undefined;
    // setTimeout(function(){
    //   const elem  = document.getElementById('serialnumber');
    //   elem.focus();
    // },500)
    // }
    // else {
     // console.log('this.AddProductDetails===',this.AddProductDetails)
      this.ObjProductInfo = new ProductInfo();
      // this.ObjProductInfo.Godown_Id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
      // this.GetProductdetails();
      this.ProductInfoSubmitted = false;
      // this.ListofTotalAmount();
      this.CalculateTotalAmount();
      this.calculateDiscount();
      this.calculateTaxableAmount();
      this.calculateCGSTAmount();
      this.calculateSGSTAmount();
      this.calculateIGST();
      this.calculateTermAmount();
      this.calculateTermCGSTAmount();
      this.calculateTermSGSTAmount();
      this.calculateTermIGST();
      this.calculateGrossAmount();
      this.calculateNetAmount();
      this.calculateRoundedOff();
      this.TcsAmtCalculation();
    // }
    }
  }
  delete(index) {
  // this.AddProductDetails.splice(index,1)
  this.AddProductDetails.splice(index,1)
//  this.ListofTotalAmount();
      this.CalculateTotalAmount();
      this.calculateDiscount();
      this.calculateTaxableAmount();
      this.calculateCGSTAmount();
      this.calculateSGSTAmount();
      this.calculateIGST();
      this.calculateTermAmount();
      this.calculateTermCGSTAmount();
      this.calculateTermSGSTAmount();
      this.calculateTermIGST();
      this.calculateGrossAmount();
      this.calculateNetAmount();
      this.calculateRoundedOff();
      this.TcsAmtCalculation();
  }
  
  GetTerm() {
    const obj = {
      "SP_String": "SP_Sale_Bill_New",
      "Report_Name_String": "Get_Term",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.TermList = data;
         // console.log('TermList',this.TermList)
    })
  }
  TermChange(){
    // this.GetProductdetails();
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
      const SubLedgerState = this.ObjSaleBillNew.Sub_Ledger_State
        ? this.ObjSaleBillNew.Sub_Ledger_State.toUpperCase()
        : undefined;
      const CostCenterState = this.ObjSaleBillNew.Cost_Cen_State
        ? this.ObjSaleBillNew.Cost_Cen_State.toUpperCase()
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
      Term_Amount : this.ObjTerm.Term_Amount,
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
      // this.GetProductdetails();
      this.TermFormSubmitted = false;
      // this.ListofTotalAmount();
      this.CalculateTotalAmount();
      this.calculateDiscount();
      this.calculateTaxableAmount();
      this.calculateCGSTAmount();
      this.calculateSGSTAmount();
      this.calculateIGST();
      this.calculateTermAmount();
      this.calculateTermCGSTAmount();
      this.calculateTermSGSTAmount();
      this.calculateTermIGST();
      this.calculateGrossAmount();
      this.calculateNetAmount();
      this.calculateRoundedOff();
      this.TcsAmtCalculation();
    }
  }
  DeteteTerm(index) {
    this.AddTermList.splice(index,1)
    // this.ListofTotalAmount();
      this.CalculateTotalAmount();
      this.calculateDiscount();
      this.calculateTaxableAmount();
      this.calculateCGSTAmount();
      this.calculateSGSTAmount();
      this.calculateIGST();
      this.calculateTermAmount();
      this.calculateTermCGSTAmount();
      this.calculateTermSGSTAmount();
      this.calculateTermIGST();
      this.calculateGrossAmount();
      this.calculateNetAmount();
      this.calculateRoundedOff();
      this.TcsAmtCalculation();
  }
  TcsAmtCalculation(){
    this.ObjSaleBillNew.TCSInputLedger = 0;
    if (this.ObjSaleBillNew.TCSTaxRequired === 'YES') {
        this.ngxService.start();
        this.$http.get("/Common/Get_TCS_Persentage_Sale?TCS_Enabled=YES",{responseType: 'text'}).subscribe((data: any) => {
          // this.databaseName = data;
          console.log(data)
          this.ObjSaleBillNew.TCSInputLedger = data[0].TCS_Output_Ledger_ID;
          this.ObjSaleBillNew.TCS_Persentage = data[0].TCS_Persentage_Sale;
          this.ObjSaleBillNew.TCS_Amount = (this.Net_Amt * this.ObjSaleBillNew.TCS_Persentage / 100).toFixed(2);
          this.ObjSaleBillNew.Grand_Total = (Number(this.Net_Amt) + Number(this.ObjSaleBillNew.TCS_Amount)).toFixed(2);
          // this.Round_off = (Number(Math.round(this.ObjSaleBillNew.Grand_Total)) - Number(this.ObjSaleBillNew.Grand_Total)).toFixed(2);
          // this.Net_Amt = Number(Math.round(this.ObjSaleBillNew.Grand_Total)).toFixed(2);
          this.calculateRoundedOff();
          // this.ObjVoucherTopper.DR_Amt = this.ObjSaleBillNew.Grand_Total;
          this.ngxService.stop();
        });   
    }
      else {
        this.ObjSaleBillNew.TCS_Persentage = 0;
        this.ObjSaleBillNew.TCS_Amount = 0;
        this.ObjSaleBillNew.Grand_Total = this.ObjSaleBillNew.Net_Amt;
        this.calculateRoundedOff();
        // this.ObjVoucherTopper.DR_Amt = this.ObjSaleBillNew.Grand_Total;
    }
  }
  // calculateProductWiswGrossAmount(obj) {
  //   return (parseFloat(obj.Taxable_Amount) + parseFloat(obj.CGST_Amount) + parseFloat(obj.SGST_Amount) + parseFloat(obj.IGST_Amount)).toFixed(2);
  // }

  CalculateTotalAmount() {
    this.ObjSaleBillNew.Total_Amount = 0;
    var totalAmount = 0;
    this.AddProductDetails.forEach(item => {
      totalAmount = totalAmount + Number(item.Amount);
    });
    this.ObjSaleBillNew.Total_Amount = (totalAmount).toFixed(2);
  }
  calculateDiscount() {
    this.ObjSaleBillNew.Discount_Amount = 0;
    var discount = 0;
    this.AddProductDetails.forEach(item => {
      discount = discount + Number(item.Discount);
    });
    this.ObjSaleBillNew.Discount_Amount = (discount).toFixed(2);
  }
  calculateTaxableAmount() {
    this.ObjSaleBillNew.Taxable_Amt = 0;
    var taxableAmount = 0;
    this.AddProductDetails.forEach(item => {
      taxableAmount = taxableAmount + Number(item.Taxable_Amount);
    });
    this.ObjSaleBillNew.Taxable_Amt = (taxableAmount).toFixed(2);

  }
  calculateCGSTAmount() {
    this.ObjSaleBillNew.CGST_Amt = 0;
    var cgstAmount = 0;
    this.AddProductDetails.forEach(item => {
      cgstAmount = cgstAmount + Number(item.CGST_Amount);
    });
    this.ObjSaleBillNew.CGST_Amt = (cgstAmount).toFixed(2);
  }
  calculateSGSTAmount() {
    this.ObjSaleBillNew.SGST_Amt = 0;
    var sgstAmount = 0;
    this.AddProductDetails.forEach(item => {
      sgstAmount = sgstAmount + Number(item.SGST_Amount);
    });
    this.ObjSaleBillNew.SGST_Amt = (sgstAmount).toFixed(2);
  }
  calculateIGST() {
    this.ObjSaleBillNew.IGST_Amt = 0;
    var igstAmount = 0;
    this.AddProductDetails.forEach(item => {
      igstAmount = igstAmount + Number(item.IGST_Amount);
    });
    this.ObjSaleBillNew.IGST_Amt = (igstAmount).toFixed(2);
    // if (this.AddProductDetails.length == null) {
    //     this.ObjSaleBillNew.IGST_Amt = undefined;
    // }
  }
  calculateGrossAmount() {
    this.ObjSaleBillNew.Gross_Amt = (Number(this.ObjSaleBillNew.Taxable_Amt)
                                + Number(this.ObjSaleBillNew.CGST_Amt)
                                + Number(this.ObjSaleBillNew.SGST_Amt)
                                + Number(this.ObjSaleBillNew.IGST_Amt)).toFixed(2);
    //   +parseFloat(ctrl.ObjSaleBill.Term_Amt || 0)
  }

  calculateNetAmount() {
    this.ObjSaleBillNew.Net_Amt = this.ObjSaleBillNew.Gross_Amt;
    //ctrl.ObjVoucherTopper.DR_Amt = ctrl.ObjSaleBill.Net_Amt;
  }
  calculateRoundedOff() {
    const grandRound = Math.round(this.ObjSaleBillNew.Grand_Total);
    this.ObjSaleBillNew.Rounded_Off = (grandRound - this.ObjSaleBillNew.Grand_Total).toFixed(2);
    this.ObjSaleBillNew.Grand_Total = Math.round(this.ObjSaleBillNew.Grand_Total);
  }

  calculateTermAmount() {
    var termamount = 0;
    this.AddTermList.forEach(item => {
      termamount = termamount + Number(item.Term_Amount);
    });
    this.ObjSaleBillNew.Term_Amt = (termamount).toFixed(2);
    this.ObjSaleBillNew.Taxable_Amt = (Number(this.ObjSaleBillNew.Taxable_Amt) + Number(termamount)).toFixed(2);
    if (this.AddTermList.length == null) {
        this.ObjSaleBillNew.Term_Amt = undefined;
    }
  }
  calculateTermCGSTAmount() {
    var TermcgstAmount = 0;
    this.AddTermList.forEach(item => {
      TermcgstAmount = TermcgstAmount + Number(item.CGST_Amount);
    });
    //  console.log(TermcgstAmount);
    this.ObjSaleBillNew.CGST_Amt = (Number(TermcgstAmount) + Number(this.ObjSaleBillNew.CGST_Amt)).toFixed(2);
  }
  calculateTermSGSTAmount() {
    var TermsgstAmount = 0;
    this.AddTermList.forEach(item => {
      TermsgstAmount = TermsgstAmount + Number(item.SGST_Amount);
    });
    //   console.log(TermsgstAmount);
    this.ObjSaleBillNew.SGST_Amt = (Number(TermsgstAmount) + Number(this.ObjSaleBillNew.SGST_Amt)).toFixed(2);
  }
  calculateTermIGST() {
    var TermigstAmount = 0;
    this.AddTermList.forEach(item => {
      TermigstAmount = TermigstAmount + Number(item.IGST_Amount);
    });
    // console.log(TermigstAmount);
    //   ctrl.ObjSaleBill.IGST_Amt = (TermigstAmount).toFixed(2);
    this.ObjSaleBillNew.IGST_Amt = (Number(TermigstAmount) + Number(this.ObjSaleBillNew.IGST_Amt)).toFixed(2);
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
  clearProject(){
    // if(this.openProject === "Y"){
    //   this.ProjectInput.clearData()
    // }
  }
   whateverCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
  DataForSavePurchaseBill(){
    this.ObjSaleBillNew.Doc_No = this.editDocNo ? this.editDocNo : "A";
    this.ObjSaleBillNew.Doc_Date = this.DateService.dateConvert(new Date(this.DocDate));
    this.ObjSaleBillNew.CN_Date = this.ObjSaleBillNew.CN_Date ? this.DateService.dateConvert(new Date(this.CNDate)) : "01/Jan/1900";
    // this.ObjSaleBillNew.CN_Date = this.DateService.dateConvert(new Date(this.CNDate));
    this.ObjSaleBillNew.Bill_Gross_Amt = Number(this.ObjSaleBillNew.Gross_Amt);
    this.ObjSaleBillNew.Bill_Net_Amt = Number(this.ObjSaleBillNew.Net_Amt);
    // this.ObjSaleBillNew.Rounded_Off = Number(this.Round_off);
    this.ObjSaleBillNew.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjSaleBillNew.Fin_Year_ID = this.$CompacctAPI.CompacctCookies.Fin_Year_ID;
    this.ObjSaleBillNew.Previous_Doc_No = this.ObjSaleBillNew.Acceptance_Order_No;
    this.ObjSaleBillNew.Order_No = this.ObjSaleBillNew.Acceptance_Order_No;
    this.ObjSaleBillNew.Order_Date = this.DateService.dateConvert(new Date(this.Acceptance_Order_Date));
    if(this.AddProductDetails.length) {
      // let tempArr:any =[]
      // this.AddProductDetails.forEach(item => {
      //   const obj = {
      //       Product_ID : item.Product_ID,
      //       Product_Name : item.Product_Name,
      //       Product_Specification : item.Product_Specification,
      //       // HSN_Code : this.ObjProductInfo.HSN_No,
      //       HSL_No : item.HSN_No,
      //       Batch_Number : item.Batch_Number,
      //       Serial_No : item.Serial_No,
      //       // Product_Expiry : this.ObjProductInfo.Product_Expiry ? 1 : 0,
      //       // Expiry_Date : this.ObjProductInfo.Expiry_Date,
      //       Qty : Number(item.Qty),
      //       UOM : item.UOM,
      //       MRP : item.Rate,
      //       Rate : item.Rate,
      //       Weight_in_Pound : Number(item.Weight_in_Pound),
      //       Acompanish : Number(item.Acompanish),
      //       Amount : Number(item.Amount),
      //       Discount_Type : item.Discount_Type,
      //       Discount_Type_Amount : Number(item.Discount_Type_Amount),
      //       Discount : Number(item.Discount),
      //       Taxable_Amount : Number(item.Taxable_Amount),
      //       CGST_Rate : Number(item.CGST_Rate),
      //       CGST_Amount : Number(item.CGST_Amount),
      //       SGST_Rate : Number(item.SGST_Rate),
      //       SGST_Amount : Number(item.SGST_Amount),
      //       IGST_Rate : Number(item.IGST_Rate),
      //       IGST_Amount : Number(item.IGST_Amount),
      //       // CESS_Percentage : this.ObjProductInfo.CESS_Percentage ? Number(this.ObjProductInfo.CESS_Percentage) : 0,
      //       // CESS_Amount : this.ObjProductInfo.CESS_AMT ? Number(this.ObjProductInfo.CESS_AMT) : 0,
      //       Gross_Amount : Number(item.Gross_Amount),
      //       // Net_Value : Number(netamount),
      //       Cost_Cen_Id : Number(item.Cost_Cen_Id),
      //       Cost_Cen_Name : item.Cost_Cen_Name,
      //       godown_id : Number(item.godown_id),
      //       Godown_Name : item.Godown_Name,
      //       AO_Product : item.AO_Product,
      //       AO_Qty : item.AO_Qty,
      //       AO_Order_No : item.Acceptance_Order_No,
      //   }
        this.ObjSaleBillNew.L_element = this.AddProductDetails;
        this.ObjSaleBillNew.TERM_element = this.AddTermList;
        return JSON.stringify([this.ObjSaleBillNew]);
        // tempArr.push({...obj,...this.ObjSaleBillNew});
      // });
      
        // return JSON.stringify(tempArr);
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
    this.SaleBillNewFormSubmitted = true;
    // this.validatation.required = true
    if(valid){
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
   }
  async onConfirmSave(){
    // this.SaleBillNewFormSubmitted = true;
    // this.validatation.required = true
    // if(valid){
      // this.Spinner = true;
      // this.ngxService.start();
      // this.DataForSavePurchaseBill();
      const obj = {
      "SP_String": "SP_Sale_Bill_New",
      "Report_Name_String": "Create_Sale_Bill",
      "Json_Param_String": this.DataForSavePurchaseBill()
      }
      this.GlobalAPI.postData(obj).subscribe(async (data:any)=>{
    //  this.validatation.required = false;
     //console.log(data);
     var tempID = data[0].Column1;
    //  this.Objcustomerdetail.Bill_No = data[0].Column1;
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
      //  if (tempID != "Total Dr Amt And Cr Amt Not matched") {
       this.SaleBillNewFormSubmitted = false;
      //  this.clearlistamount();
      //  this.cleartotalamount();
       this.clearData();
       this.AcceptanceOrderNoList = [];
       this.Acceptance_Order_Date = undefined;
       this.Productlist = [];
      //  this.clearProject();
      //  this.GetSerarchSaleBillNew(true);
       if(this.editDocNo) {
        this.editDocNo = undefined;
        this.tabIndexToView = 0;
        this.items = [ 'BROWSE', 'CREATE','PENDING GRN'];
        this.buttonname = "Create";
       }
      // }
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
    else{
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
    // if(data[0].MSG !="Save Sucessfully" && data[0].Column1){
    //   this.Spinner = false;
    //   this.ngxService.stop();
    //   this.compacctToast.clear();
    //   this.compacctToast.add({
    //     key: "compacct-toast",
    //     severity: "error",
    //     summary: "Warn Message",
    //     detail: errormsg
    //   });
    // } else {
    //   this.Spinner = false;
    //   this.ngxService.stop();
    //   this.compacctToast.clear();
    //   this.compacctToast.add({
    //     key: "compacct-toast",
    //     severity: "error",
    //     summary: "Warn Message",
    //     detail: "Error Occured "
    //   });
    // }
  })
    // }
  }
  // datechange(){
  //  // console.log(this.DateService.dateConvert(new Date(this.expiryDate)))
  // }
  
  // BROWSE
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseSaleBillNew.start_date = dateRangeObj[0];
      this.ObjBrowseSaleBillNew.end_date = dateRangeObj[1];
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
  GetSerarchSaleBillNew(valid){
  this.SearchSaleBillNewFormSubmitted = true;
  this.seachSpinner = true;
  const start = this.ObjBrowseSaleBillNew.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowseSaleBillNew.start_date))
  : this.DateService.dateConvert(new Date());
  const end = this.ObjBrowseSaleBillNew.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowseSaleBillNew.end_date))
  : this.DateService.dateConvert(new Date());
  const tempobj = {
   From_Date : start,
   To_Date : end,
  //  Company_ID : this.ObjBrowseSaleBillNew.Company_ID,
   Cost_Cen_ID : this.ObjBrowseSaleBillNew.Cost_Cen_ID ? this.ObjBrowseSaleBillNew.Cost_Cen_ID : 0,
  //  proj : this.openProject
  }
  if (valid) {
  const obj = {
    "SP_String": "SP_Sale_Bill_New",
    "Report_Name_String": "browse_Sale_Bill",
    "Json_Param_String": JSON.stringify([tempobj])
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.SerarchsaleBillNewList = data;
    // this.BackupSearchedlist = data;
    // this.GetDistinct();
    // if(this.getAllDataList.length){
    //   this.DynamicHeader = Object.keys(data[0]);
    // }
    this.seachSpinner = false;
    this.SearchSaleBillNewFormSubmitted = false;
   // console.log("Get All Data",this.SerarchsaleBillNewList);
  })
  }
  }
  EditPurchaseBill(col){
    this.editDocNo = undefined;
    if(col.Doc_No){
     this.editDocNo = col.Doc_No
     this.tabIndexToView = 1;
    this.items = [ 'BROWSE', 'UPDATE','PENDING GRN'];
    this.buttonname = "Update";
    this.geteditData(col.Doc_No);
    }
  }
  geteditData(Dno){
    const obj = {
      "SP_String": "SP_MICL_Purchase_Bill_New",
      "Report_Name_String": "Purchase_Bill_Edit_Data",
      "Json_Param_String": JSON.stringify([{Doc_No : Dno}])
   }
    this.GlobalAPI.getData(obj).subscribe((res:any)=>{
      let data = JSON.parse(res[0].Column1)
      console.log("Edit data",data);
      this.ObjSaleBillNew = data[0],
      // this.GetGRNno();
      this.maindisabled = true;
      //this.ObjSaleBillNew.Choose_Address = "MAIN";
      // this.getreq();
      this.DocDate = new Date(data[0].Doc_Date);
      this.CNDate = new Date(data[0].CN_Date);
      this.GRNNoProlist = data[0].L_element;
      this.AddTermList = data[0].TERM_element ? data[0].TERM_element : [] ;
      // console.log("addPurchaseList",this.addPurchaseList)
      if(this.GRNNoProlist.length || this.AddTermList.length){
        // this.ListofTotalAmount()
        this.CalculateTotalAmount();
        this.calculateDiscount();
        this.calculateTaxableAmount();
        this.calculateCGSTAmount();
        this.calculateSGSTAmount();
        this.calculateIGST();
        this.calculateGrossAmount();
        this.calculateNetAmount();
        this.calculateRoundedOff();
        this.calculateTermAmount();
        this.calculateTermCGSTAmount();
        this.calculateTermSGSTAmount();
        this.calculateTermIGST();
        this.TcsAmtCalculation();
      }
    })
  }
  Print(DocNo) {
    if(DocNo) {
    const objtemp = {
      "SP_String": "SP_MICL_Purchase_Bill_New",
      "Report_Name_String": "Purchase_Bill_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
  }
  DeleteSaleBill(col){
   // console.log("Delete Col",col);
    this.DocNo = undefined;
    this.ngxService.start();
    if(col.Doc_No){
     this.DocNo = col.Doc_No
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
   onConfirmDel(){
    if(this.DocNo){
     const obj = {
       "SP_String": "SP_Sale_Bill_New",
       "Report_Name_String":"Delete_Sale_Bill",
       "Json_Param_String": JSON.stringify([{Doc_No : this.DocNo , User_ID : this.$CompacctAPI.CompacctCookies.User_ID}]) 
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("data ==",data[0].Column1);
       if (data[0].Column1){
         this.compacctToast.clear();
         this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Purchase Bill ",
           detail: "Succesfully Delete"
         });
         this.ngxService.stop();
         this.DocNo = undefined;
         this.GetSerarchSaleBillNew(true);
         }
          
        else {
          // this.onReject();
          // this.compacctToast.clear();
          // this.compacctToast.add({
          //   key: "c", 
          //   sticky: true,
          //   closable: false,
          //   severity: "warn", // "info",
          //   summary: data[0].Column1
          //   // detail: data[0].Column1
          // });
          this.ngxService.stop();
          this.DocNo = undefined;
          this.GetSerarchSaleBillNew(true);
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
        });
    }
   }
   onReject() {
    this.compacctToast.clear("c");
    this.compacctToast.clear("s");
    this.Spinner = false;
    this.ngxService.stop();
   }
   PrintSaleBill(DocNo) {
    if(DocNo) {
    const objtemp = {
      "SP_String": "SP_Sale_Bill_New",
      "Report_Name_String": "Sale_Bill_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
   }

}
class SaleBillNew {
  Doc_No : any;
  Choose_Address : any;
  Doc_Date : any;
  Company_ID: any;
  Sub_Ledger_ID : any;
  Sub_Ledger_Name : string;
  Due_Amount : any;
  Sub_Ledger_Billing_Name : any;
  Sub_Ledger_Billing_State : any;
  IS_SEZ : any;
  Sub_Ledger_Address_1 : any;
  Sub_Ledger_Address_2 : any;
  Sub_Ledger_Address_3 : string;
  Sub_Ledger_Land_Mark : any;
  Sub_Ledger_Pin : any;
  Sub_Ledger_District : any;
  Sub_Ledger_Country : any;
  Sub_Ledger_State : any;
  Sub_Ledger_Email : any;
  Sub_Ledger_Mobile_No : any;
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

  
  Revenue_Cost_Cent_ID : number;
  Revenue_Cost_Cent_Name : string;
  Supp_Ref_No : any;
  Supp_Ref_Date : any;
  CN_No : any;
  CN_Date : any;
  AO_Product : any;
  AO_Qty : any;
  Acceptance_Order_No : any;
  Previous_Doc_No : any;
  Order_No : any;
  Order_Date : any;
  Payment_Terms : any;
  Other_Reference : any;
  Remarks : any;
  Container_No : any;
  Waybill_No : any;

  Bill_Gross_Amt : number;
  Bill_Net_Amt : number;
  CGST_Amt : any;
  SGST_Amt : any;
  IGST_Amt : any;
  Taxable_Amt : any;
  Discount_Amount : any;
  Total_Amount : any;
  Gross_Amt : any;
  Net_Amt : any;
  Rounded_Off : any;
  Term_Amt : any;
  User_ID : number;
  Fin_Year_ID : number;

  TCSInputLedger : any;
  TCSTaxRequired : any;
  TCS_Persentage : any;
  TCS_Amount : any;
  Grand_Total : any;
  // HSN_No : any;

  L_element : any;
  TDS_element : any;
  TERM_element : any;

  Project_ID : any;

 }
 class BrowseSaleBillNew {
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
  Qty: any;
  UOM: any;
  Rate: any;
  MRP = 0;
  Amount: number;
  Weight_in_Pound:any;
  Acompanish:number;
  Discount_Type = undefined;
  Discount_Type_Amount : any;
  Discount_Type_Amt : any;
  Discount : any;
  Taxable_Amount : number;
  Godown_Id: any;
  CESS_Percentage: number;
  GRN_No: any;

  CGST_Rate: any;
  CGST_Amount: any;
  SGST_Rate: any;
  SGST_Amount: any;
  IGST_Rate: any;
  IGST_Amount: any;
  Total: any;
  Gross_Amount:any;

  Cat_ID: string;
  Cat_Name: string;
  Cost_Cen_ID : any;
  godown_id = 0;
  godown_name: string;
  Batch_No: any;
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

