import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CompacctProjectComponent } from '../../../shared/compacct.components/compacct.forms/compacct-project/compacct-project.component';

@Component({
  selector: 'app-outward-challan',
  templateUrl: './outward-challan.component.html',
  styleUrls: ['./outward-challan.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class OutwardChallanComponent implements OnInit {
  items:any = [];
  menuList:any = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Create";
  currentdate = new Date();
  DocDate = new Date();
  CNDate : Date;
  SupplierBillDate= new Date();

  VendorList:any = [];
  maindisabled = false;
  StateList:any = [];
  CostCenterList:any = [];
  
  ProductDetails:any = [];

  PurchaseBillFormSubmitted = false;
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
  companyList:any = [];
  
  openProject = "N"
  projectMand = "N";
  objproject : project = new project();
  validatation = {
    required : false,
    projectMand : 'N'
  }
  projectEditData:any =[]
  @ViewChild("project", { static: false })
  // ProjectInput: CompacctProjectComponent;
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

  // ObjTDS = new TDS();
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

  // ObjPendingPO = new PendingPO();
  PendingPOFormSubmitted = false;
  PendingPOList:any = [];
  DynamicHeaderforPPO:any = [];

  // ObjPendingGRN = new PendingGRN();
  PendingGRNFormSubmitted = false;
  PendingGRNList:any = [];
  DynamicHeaderforPGRN:any = [];
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
  Same_as_Bill = false;

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
    // console.log(this.$CompacctAPI.CompacctCookies.Fin_Year_Start)
    $(document).prop('title', this.headerData ? this.headerData : $('title').text());
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];
    this.Header.pushHeader({
      Header: "Outward challan",
      Link: " Financial Management -> Sales ->  Outward Challan"
    });
    this.Finyear();
    this.GetVendor();
    this.GetStateList();
    this.GetCostcenter();
    this.getcompany();
    // this.GetCurrency();
    // this.ObjPurChaseBill.RCM = "N";
    // this.GetLedger();
    // this.GetTerm();
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE", "PENDING GRN"];
     this.buttonname = "Create";
     this.Spinner = false;
     this.clearData();
    //  this.clearProject();
     this.productaddSubmit = [];
     this.Spinner = false;
    //  this.Godownlist = [];
     this.POorderlist = [];
    //  this.GetProductdetails();
     this.ObjProductInfo = new ProductInfo();
   }
   clearData(){
     this.ObjPurChaseBill = new PurChaseBill();
     this.ObjPurChaseBill.Choose_Address = "MAIN";
     this.PurchaseBillFormSubmitted = false;
     this.validatation.required = false;
     this.maindisabled = false;
     this.ObjPurChaseBill.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjPurChaseBill.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.ObjPurChaseBill.Revenue_Cost_Cent_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.GetCosCenAddress();
     this.DocDate = new Date();
     this.SupplierBillDate = new Date();
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
     this.ObjPurChaseBill.Currency_ID = 1;
     this.ObjPurChaseBill.RCM = "N";
     this.AddProductDetails = [];
    //  this.clearlistamount();
     this.AddTdsDetails = [];
    //  this.ObjTDS = new TDS();
     this.AddTermList = [];
     this.ObjTerm = new Term();
    //  this.cleartotaltermamount();
    this.deleteError = false;
  
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
   getcompany(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Dropdown_Company",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.companyList = data
    // console.log("companyList",this.companyList)
     this.ObjBrowsePurBill.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjPurChaseBill.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    //  this.ObjPendingPO.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    //  this.ObjPendingGRN.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    })
  }
   GetVendor(){
    const obj = {
      "SP_String": "SP_MICL_Purchase_Bill_New",
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
    // console.log("vendor list======",this.VendorList);
   });
  }
   VenderNameChange(){
     //this.ExpiredProductFLag = false;
   if(this.ObjPurChaseBill.Sub_Ledger_ID) {
    const ctrl = this;
    const vendorObj = $.grep(ctrl.VendorList,function(item: any) {return item.value == ctrl.ObjPurChaseBill.Sub_Ledger_ID})[0];
   // console.log(vendorObj);
    this.ObjPurChaseBill.Sub_Ledger_Billing_Name = vendorObj.Sub_Ledger_Billing_Name;
    this.ObjPurChaseBill.Sub_Ledger_Name = vendorObj.label;
    this.GetChooseAddress();
    // this.GetPurOrderNoList();
    // this.GetGRNno();
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
   const MainObj = $.grep(ctrl.VendorList,function(item: any) {return item.value == ctrl.ObjPurChaseBill.Sub_Ledger_ID})[0];
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
      "SP_String": "SP_MICL_Purchase_Bill_New",
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
      "SP_String": "SP_MICL_Purchase_Bill_New",
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
  GetGodown(){
    const TempObj = {
      Cost_Cen_ID : this.ObjPurChaseBill.Cost_Cen_ID,
      }
    const obj = {
      "SP_String": "SP_MICL_Purchase_Bill_New",
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

}
class PurChaseBill {
  Choose_Address : any;
  Doc_Date : any;
  Company_ID: any;
  Sub_Ledger_ID : any;
  Sub_Ledger_Name : string;
  SEZ : any;
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

  Bill_Gross_Amt : number;
  Bill_Net_Amt : number;
  Rounded_Off : number;
  User_ID : number;
  Fin_Year_ID : number;

  // HSN_No : any;

  L_element : any;
  TDS_element : any;
  TERM_element : any;

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
