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
  selector: 'app-purchase-bill',
  templateUrl: './purchase-bill.component.html',
  styleUrls: ['./purchase-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class PurchaseBillComponent implements OnInit {
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
  ProjectInput: CompacctProjectComponent;
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

  ObjPendingPO = new PendingPO();
  PendingPOFormSubmitted = false;
  PendingPOList:any = [];
  DynamicHeaderforPPO:any = [];

  ObjPendingGRN = new PendingGRN();
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
  // Project
  projectFromSubmit:boolean = false
  ProjectList:any = []
  SiteList = [];
  groupList = [];
  subGorupList = [];
  workList = [];
  projectDis:boolean = false
  overlayPanelText = ""
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
       // console.log(params);
        this.headerData = params['header'];
        this.openProject = params['proj'];
        this.projectMand = params['mand'];
        this.validatation.projectMand = params['mand']
       })
     }
// 
  ngOnInit() {
    // console.log(this.$CompacctAPI.CompacctCookies.Fin_Year_Start)
    $(document).prop('title', this.headerData ? this.headerData : $('title').text());
    this.items = ["BROWSE", "CREATE", "PENDING PURCHASE ORDER", "PENDING GRN"];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];
    this.Header.pushHeader({
      Header: this.headerData,
      Link: " Financial Management -> Purchase -> " + this.headerData
    });
    this.Finyear();
    this.GetVendor();
    this.GetStateList();
    this.GetCostcenter();
    this.getcompany();
    this.GetCurrency();
    this.ObjPurChaseBill.RCM = "N";
    this.GetLedger();
    this.GetTerm();
    // this.GetSearchedlist();
    this.getProject()
    this.GetProductdetails()
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE", "PENDING PURCHASE ORDER", "PENDING GRN"];
     this.buttonname = "Create";
     this.Spinner = false;
     this.clearData();
     this.clearProject();
     this.productaddSubmit = [];
     this.Spinner = false;
    //  this.Godownlist = [];
     this.POorderlist = [];
     this.GetProductdetails();
     this.ObjProductInfo = new ProductInfo();
   }
   clearData(){
    //djfidu
     this.ObjPurChaseBill = new PurChaseBill();
     this.objproject = new project()
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
     this.CNDate = new Date();
     this.bckUpQtyValid = false
     this.PurOrderList = [];
     this.bckUpQty = undefined
     this.POList = [];
     this.PODate = new Date();
     this.GRNList = [];
     this.GRNDate = new Date();
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
    this.overlayPanelText = ""
  
   }
   Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
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
    this.ObjBrowsePurBill.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjPurChaseBill.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjPendingPO.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjPendingGRN.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
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
  
   });
  }
   VenderNameChange(){
    this.ObjPurChaseBill.Sub_Ledger_State = undefined
    this.ObjPurChaseBill.Sub_Ledger_GST_No = undefined
    this.ObjPurChaseBill.Sub_Ledger_Address_1 = ""
    this.ObjPurChaseBill.Sub_Ledger_Address_2 = ""
    this.ObjPurChaseBill.Sub_Ledger_Address_3 = ""
    this.ObjPurChaseBill.Sub_Ledger_Land_Mark = ""
    this.ObjPurChaseBill.Sub_Ledger_Pin = undefined
    this.ObjPurChaseBill.Sub_Ledger_District =""
    this.ObjPurChaseBill.Sub_Ledger_Country = ""
    this.ObjPurChaseBill.Sub_Ledger_Email = undefined
    this.ObjPurChaseBill.Sub_Ledger_Mobile_No = undefined
    this.ObjPurChaseBill.Sub_Ledger_PAN_No = undefined
    this.ObjPurChaseBill.Sub_Ledger_CIN_No =undefined
    this.ObjPurChaseBill.Sub_Ledger_TIN_No = undefined
    this.ObjPurChaseBill.Sub_Ledger_CST_No = undefined
    this.ObjPurChaseBill.Sub_Ledger_SERV_REG_NO = undefined
    this.ObjPurChaseBill.Sub_Ledger_UID_NO = undefined
    this.ObjPurChaseBill.Sub_Ledger_EXID_NO = undefined
    this.ObjPurChaseBill.Sub_Ledger_Billing_Name = ""
    this.ObjPurChaseBill.Sub_Ledger_Name = ""
   if(this.ObjPurChaseBill.Sub_Ledger_ID) {
    const ctrl = this;
    const vendorObj = $.grep(ctrl.VendorList,function(item: any) {return item.value == ctrl.ObjPurChaseBill.Sub_Ledger_ID})[0];
   this.ObjPurChaseBill.Sub_Ledger_Billing_Name = vendorObj.Sub_Ledger_Billing_Name;
    this.ObjPurChaseBill.Sub_Ledger_Name = vendorObj.label;
    this.GetChooseAddress();
    this.GetPurOrderNoList();
   } else{
    this.PurOrderList = [];
    this.POList = [];
    this.PODate = new Date();
    this.GRNList = [];
    this.GRNDate = new Date();
    this.ObjProductInfo.Product_Specification = undefined;
   }
   }
   GetChooseAddress(){
   this.PODate = new Date();
    this.GRNList = [];
    this.GRNDate = new Date();
    this.ObjProductInfo.Product_Specification = undefined;

    this.ObjPurChaseBill.Sub_Ledger_State = undefined
    this.ObjPurChaseBill.Sub_Ledger_GST_No = undefined
    this.ObjPurChaseBill.Sub_Ledger_Address_1 = ""
    this.ObjPurChaseBill.Sub_Ledger_Address_2 = ""
    this.ObjPurChaseBill.Sub_Ledger_Address_3 = ""
    this.ObjPurChaseBill.Sub_Ledger_Land_Mark = ""
    this.ObjPurChaseBill.Sub_Ledger_Pin = undefined
    this.ObjPurChaseBill.Sub_Ledger_District =""
    this.ObjPurChaseBill.Sub_Ledger_Country = ""
    this.ObjPurChaseBill.Sub_Ledger_Email = undefined
    this.ObjPurChaseBill.Sub_Ledger_Mobile_No = undefined
    this.ObjPurChaseBill.Sub_Ledger_PAN_No = undefined
    this.ObjPurChaseBill.Sub_Ledger_CIN_No =undefined
    this.ObjPurChaseBill.Sub_Ledger_TIN_No = undefined
    this.ObjPurChaseBill.Sub_Ledger_CST_No = undefined
    this.ObjPurChaseBill.Sub_Ledger_SERV_REG_NO = undefined
    this.ObjPurChaseBill.Sub_Ledger_UID_NO = undefined
    this.ObjPurChaseBill.Sub_Ledger_EXID_NO = undefined
    if(this.ObjPurChaseBill.Choose_Address) {
   const ctrl = this;
   const MainObj = $.grep(ctrl.VendorList,function(item: any) {return item.value == ctrl.ObjPurChaseBill.Sub_Ledger_ID})[0];
   this.maindisabled = true;
   this.ObjPurChaseBill.Sub_Ledger_State = MainObj.Sub_Ledger_State;
   this.ObjPurChaseBill.Sub_Ledger_GST_No = MainObj.GST;
   this.ObjPurChaseBill.Sub_Ledger_Address_1 = MainObj.Sub_Ledger_Address_1;
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

  }
   GetStateList() {
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_State_List",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.StateList = data;
         
    })

  }
  GetCostcenter(){
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   console.log("costcenterList  ===",data);
      this.CostCenterList = data;
    
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
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Godown_list",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("GodownList  ===",data);
      this.GodownList = data;
      this.ObjProductInfo.Godown_Id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
      this.ObjProductInfo.Godown_Id = this.openProject == 'Y' ? 1 : undefined
    })
  }
  GetCosCenAddress(){
    this.ObjPurChaseBill.Cost_Cen_Name = ""
    this.ObjPurChaseBill.Cost_Cen_Address1 = ""
    this.ObjPurChaseBill.Cost_Cen_Address2 = ""
    this.ObjPurChaseBill.Cost_Cen_State = ""
    this.ObjPurChaseBill.Cost_Cen_GST_No =undefined 
    this.ObjPurChaseBill.Cost_Cen_Location =""
    this.ObjPurChaseBill.Cost_Cen_PIN = undefined
    this.ObjPurChaseBill.Cost_Cen_District = ""
    this.ObjPurChaseBill.Cost_Cen_Country = ""
    this.ObjPurChaseBill.Cost_Cen_Mobile = undefined
    this.ObjPurChaseBill.Cost_Cen_Phone = undefined
    this.ObjPurChaseBill.Cost_Cen_Email = undefined
    this.ObjPurChaseBill.Cost_Cen_VAT_CST = undefined
    this.ObjPurChaseBill.Cost_Cen_CST_NO = 
    this.ObjPurChaseBill.Cost_Cen_SRV_TAX_NO = 
    this.ObjPurChaseBill.Cost_Cen_GST_No = undefined
    if(this.ObjPurChaseBill.Cost_Cen_ID) {
   const ctrl = this;
   const costcenObj = $.grep(ctrl.CostCenterList,function(item: any) {return item.Cost_Cen_ID == ctrl.ObjPurChaseBill.Cost_Cen_ID})[0];
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
  GetCurrency(){
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Currency_Details",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  
      this.CurrencyList = data;
      this.ObjPurChaseBill.Currency_ID = 1;
       })
  }
  GetPurOrderNoList(){
    this.POList = [];
    this.PurOrderList = [];
    this.ObjProductInfo.Pur_Order_No = undefined;
    if( this.ObjPurChaseBill.Sub_Ledger_ID){
      const TempObj = {
        Sub_Ledger_ID : this.ObjPurChaseBill.Sub_Ledger_ID,
        Proj : this.openProject
       }
     const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String" : "Get_PO_list_For_PBIll",
     "Json_Param_String": JSON.stringify([TempObj])
 
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.POList = data;
       if(data.length){
       
        let DOrderBy:any = [];
        this.PurOrderList = [];
        
         data.forEach((item:any) => {
          if (DOrderBy.indexOf(item.value) === -1) {
            DOrderBy.push(item.value);
            this.PurOrderList.push({ label: item.label, value: item.value });
          }
        });
       }
      })
    }
   
   }
   ChangePurchaseOrder(){
    this.PODate = new Date();
    this.ProductDetails = [];
    this.ObjProductInfo.Product_ID = undefined;
    this.ObjProductInfo.Product_Specification = undefined;
    this.ProjectList = []
    this.SiteList = []
    this.groupList = []
    this.subGorupList = []
    this.workList = []
    this.objproject = new project()
    this.projectDis = false
     if(this.ObjProductInfo.Pur_Order_No) {
      const ctrl = this;
      const DateObj = $.grep(ctrl.POList,function(item: any) {return item.value == ctrl.ObjProductInfo.Pur_Order_No})[0];
      console.log(DateObj);
      this.PODate = new Date(DateObj.Doc_Date);
      this.getProject()
      this.GetProductdetails()
     }
     else {
      this.getProject()
       this.PODate = undefined;
       this.GetProductdetails();
       this.ProductDetails = []
      this.ObjProductInfo.Product_ID = undefined;
    
     }
  }
  
   GetProductdetails(){
    this.ProductDetails = [];
    this.ObjProductInfo.Product_ID = undefined;
    let TempObj = {
      Project_ID:0,   
			Site_ID:0,
			Budget_Group_ID:0,
			Budget_Sub_Group_ID:0,
			Work_Details_ID:0,
			Doc_No:this.ObjProductInfo.Pur_Order_No ? this.ObjProductInfo.Pur_Order_No :'0',
    }
      if(Object.keys(this.objproject).length == 5 && !this.ObjProductInfo.Pur_Order_No){
         TempObj = {
          Project_ID: this.objproject.PROJECT_ID,   
          Site_ID: this.objproject.SITE_ID,
          Budget_Group_ID: this.objproject.Budget_Group_ID,
          Budget_Sub_Group_ID: this.objproject.Budget_Sub_Group_ID,
          Work_Details_ID: this.objproject.Work_Details_ID,
          Doc_No:'0',
        }
      }
      if(Object.keys(this.objproject).length == 5 && this.ObjProductInfo.Pur_Order_No){
        TempObj = {
         Project_ID: this.objproject.PROJECT_ID,   
         Site_ID: this.objproject.SITE_ID,
         Budget_Group_ID: this.objproject.Budget_Group_ID,
         Budget_Sub_Group_ID: this.objproject.Budget_Sub_Group_ID,
         Work_Details_ID: this.objproject.Work_Details_ID,
         Doc_No:this.ObjProductInfo.Pur_Order_No,
       }
     }
      const obj = {
        "SP_String": "SP_Purchase_Bill",
        "Report_Name_String": "Get_Products_For_PBill",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=> {
        this.ProductDetails = data;
       })
 
  
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
      if (this.ObjProductInfo.Product_Expiry === 'true') {
        this.ProductExpirydisabled = true;
      } else {
        this.ProductExpirydisabled = false;
      }
      this.ObjProductInfo.HSN_No = ProductObj.HSN_No;
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
      this.chkqut()
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
      this.ObjProductInfo.Discount_Type_Amt = 0
    } 
    else {
      this.ObjProductInfo.Discount_Type_Amt = undefined;
    }
  }
  AfterDiscCalChange(){
    this.ObjProductInfo.Discount = 0;
    this.ObjProductInfo.Taxable_Amount = 0;
    if (this.ObjProductInfo.Discount_Type_Amt) { 
      var disamt;
      var taxamt;
    if(this.ObjProductInfo.Discount_Type == "%") {
      disamt = Number((Number(this.ObjProductInfo.Amount) * Number(this.ObjProductInfo.Discount_Type_Amt)) / 100).toFixed(2);
      this.ObjProductInfo.Discount =Number(disamt);
    }
    if(this.ObjProductInfo.Discount_Type == "AMT") {
      this.ObjProductInfo.Discount = Number(this.ObjProductInfo.Discount_Type_Amt);
    }
    taxamt = Number(Number(this.ObjProductInfo.Amount) - Number(this.ObjProductInfo.Discount)).toFixed(2);
    this.ObjProductInfo.Taxable_Amount = Number(taxamt);
    // this.ObjTDS.Taxable_Amount = Number(this.ObjProductInfo.Taxable_Amount);
    }
    else {
      this.ObjProductInfo.Discount = 0;
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
  
  AddProductInfo(valid,valid2) {
    //console.log(this.ObjaddbillForm.Product_ID)
    console.log("valid2",valid2)
    this.ProductInfoSubmitted = true;
    this.PurchaseBillFormSubmitted = true;
    if(valid && !this.chkqut()) {
      const ProjectListFilter:any = this.ProjectList.filter((el:any)=> el.Project_ID == this.objproject.PROJECT_ID)
      const SiteSiteList:any = this.SiteList.filter((el:any) => el.Site_ID == this.objproject.SITE_ID)
      const groupListFilter:any = this.groupList.filter((el:any) => el.Budget_Group_ID == this.objproject.Budget_Group_ID)
      const subGorupListFilter:any = this.subGorupList.filter((el:any)=> el.Budget_Sub_Group_ID == this.objproject.Budget_Sub_Group_ID )
      const workListFilter:any = this.workList.filter((el:any) => el.Work_Details_ID == this.objproject.Work_Details_ID)
      const SubLedgerState = this.ObjPurChaseBill.Sub_Ledger_State
        ? this.ObjPurChaseBill.Sub_Ledger_State.toUpperCase()
        : undefined;
      const CostCenterState = this.ObjPurChaseBill.Cost_Cen_State
        ? this.ObjPurChaseBill.Cost_Cen_State.toUpperCase()
        : undefined;
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
      this.ObjProductInfo.CESS_AMT = this.ObjProductInfo.CESS_AMT ? Number(this.ObjProductInfo.CESS_AMT) : 0;
      var netamount = (Number(this.ObjProductInfo.Taxable_Amount) + Number(this.ObjProductInfo.CGST_Amount) + Number(this.ObjProductInfo.SGST_Amount) 
                    + Number(this.ObjProductInfo.IGST_Amount) + Number(this.ObjProductInfo.CESS_AMT)).toFixed(2);

      var stockpoint = this.GodownList.filter(item=> Number(item.godown_id) === Number(this.ObjProductInfo.Godown_Id))
    var productObj = {
      Product_ID : this.ObjProductInfo.Product_ID,
      Product_Name : this.ObjProductInfo.Product_Specification,
      Product_Specification : this.ObjProductInfo.Product_Specification,
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
      Discount_Type_Amount : this.ObjProductInfo.Discount_Type_Amt ? Number(this.ObjProductInfo.Discount_Type_Amt) : 0,
      Discount : this.ObjProductInfo.Discount ? Number(this.ObjProductInfo.Discount) : 0,
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
      GRN_No : this.ObjProductInfo.GRN_No,
      GRN_Date : this.GRNDate ? this.DateService.dateConvert(new Date(this.GRNDate)) : "01/Jan/1900",

      SITE_ID	: this.openProject == 'Y' ? this.objproject.SITE_ID : null  ,
      Site_Description : this.openProject == 'Y' && SiteSiteList.length ? SiteSiteList[0].Site_Description : "",
      Budget_Group_ID: this.openProject == 'Y' ? this.objproject.Budget_Group_ID : null,
      Budget_Group_Name:this.openProject == 'Y' && groupListFilter.length ? groupListFilter[0].Budget_Group_Name : "",
      Budget_Sub_Group_ID: this.openProject == 'Y' ? this.objproject.Budget_Sub_Group_ID : null,
      Budget_Sub_Group_Name:this.openProject == 'Y' && subGorupListFilter.length ? subGorupListFilter[0].Budget_Sub_Group_Name : "",	
      Work_Details_ID: this.openProject == 'Y' ? this.objproject.Work_Details_ID : null,
      Work_Details:this.openProject == 'Y' && workListFilter.length ? workListFilter[0].Work_Details : "",
      Project_ID: this.openProject == 'Y' ? this.objproject.Work_Details_ID : null,
      Project_Description: this.openProject == 'Y' && ProjectListFilter.length ? ProjectListFilter[0].Project_Description : "",
  
    };
    this.AddProductDetails.push(productObj);
    
    if(this.Maintain_Serial_No){
      this.ProductInfoSubmitted = false;
      this.ObjProductInfo.Serial_No = undefined;
    setTimeout(function(){
      const elem:any  = document.getElementById('serialnumber');
      elem.focus();
    },500)
    }
    else {
      const tempobjBck = {...this.ObjProductInfo}
      this.ObjProductInfo = new ProductInfo();
      this.ObjProductInfo.Pur_Order_No = tempobjBck.Pur_Order_No
      this.projectDis = true
      this.ObjProductInfo.Godown_Id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
      this.ObjProductInfo.Godown_Id = this.openProject == 'Y' ? 1 : undefined
      this.GRNList = [];
      this.GetProductdetails();
      this.ProductInfoSubmitted = false;
      this.PurchaseBillFormSubmitted = false
      this.ListofTotalAmount();
    }
    }
  }
  delete(index) {
  this.AddProductDetails.splice(index,1)
  this.ListofTotalAmount();
  if(!this.AddProductDetails){
    this.objproject = new project() 
  }
  }
  
  GetTerm() {
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Term",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.TermList = data;
         // console.log('TermList',this.TermList)
    })
    // this.$http
    //   .get("/Common/Get_Term_Tax_Pur_GST")
    //   .subscribe((data: any) => {
    //     this.StateList = data ? JSON.parse(data) : [];
    //     // this.TermList = data;
    //    // console.log('TermList',this.TermList)
    //   });
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
      this.GetProductdetails();
      this.TermFormSubmitted = false;
      this.ListofTotalAmount();
    }
  }
  DeteteTerm(index) {
    this.AddTermList.splice(index,1)
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
    this.Total_Term_Amount = 0;
  
  
    this.AddProductDetails.forEach(item => {
      count = count + Number(item.Amount);
      count1 = count1 + Number(item.Discount);
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
    this.Round_off = (Number(Math.round(this.Gross_Amount)) - Number(this.Gross_Amount)).toFixed(2);
    this.Net_Amt = Number(Math.round(this.Gross_Amount)).toFixed(2);
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
      "SP_String": "SP_Purchase_Bill",
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
      "SP_String": "SP_Purchase_Bill",
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
  clearProject(){
    if(this.openProject === "Y"){
      //this.ProjectInput.clearData()
    }
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
    this.ObjPurChaseBill.Doc_Date = this.DateService.dateConvert(new Date(this.DocDate));
    this.ObjPurChaseBill.Supp_Ref_Date = this.DateService.dateConvert(new Date(this.SupplierBillDate));
    this.ObjPurChaseBill.CN_Date = this.ObjPurChaseBill.CN_Date ? this.DateService.dateConvert(new Date(this.CNDate)) : "01/Jan/1900";
    this.ObjPurChaseBill.Bill_Gross_Amt = Number(this.Gross_Amount);
    this.ObjPurChaseBill.Bill_Net_Amt = Number(this.Net_Amt);
    this.ObjPurChaseBill.Rounded_Off = Number(this.Round_off);
    this.ObjPurChaseBill.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjPurChaseBill.Fin_Year_ID = this.$CompacctAPI.CompacctCookies.Fin_Year_ID;
    this.ObjPurChaseBill.Project_ID = this.objproject.PROJECT_ID
    if(this.AddProductDetails.length) {
      this.ObjPurChaseBill.L_element = this.AddProductDetails;
      this.ObjPurChaseBill.TERM_element = this.AddTermList;
      this.ObjPurChaseBill.TDS_element = this.AddTdsDetails;

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
    this.Save = false;
    this.Del = false;
    this.PurchaseBillFormSubmitted = true;
    this.validatation.required = true
    if(valid && this.AddProductDetails.length){
      this.Save = true;
      this.Del = false;
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
    else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: !valid ? "Fill All Required Fields" : "At Least Add 1 Product"
      });
    }
   }
  async onConfirmSave(){
  const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Purchase_Bill_Create",
      "Json_Param_String": this.DataForSavePurchaseBill()
      }
      this.GlobalAPI.postData(obj).subscribe(async (data:any)=>{
     this.validatation.required = false;
     var tempID = data[0].Column1;
    if(data[0].Column1 != "Total Dr Amt And Cr Amt Not matched" && data[0].Success != "False"){
      if(this.objproject.PROJECT_ID){ 
       const projectSaveData = await this.SaveProject(data[0].Column1);
       if(projectSaveData){
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
   
     this.PurchaseBillFormSubmitted = false;
   
     this.clearData();
     this.clearProject();
     this.GetSerarchPurBill(true);
     this.GetPendingPO(true);
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
      }
      else {
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
   
       this.PurchaseBillFormSubmitted = false;
      
       this.clearData();
       this.clearProject();
       this.GetSerarchPurBill(true);
       this.GetPendingPO(true);
       }
       this.tabIndexToView = 0
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

  })
    // }
  }

  
  // BROWSE
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowsePurBill.start_date = dateRangeObj[0];
      this.ObjBrowsePurBill.end_date = dateRangeObj[1];
    }
    }
   
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
   Company_ID : this.ObjBrowsePurBill.Company_ID,
   Cost_Cen_ID : this.ObjBrowsePurBill.Cost_Cen_ID,
   proj : this.openProject
  }
  if (valid) {
  const obj = {
    "SP_String": "SP_Purchase_Bill",
    "Report_Name_String": "Purchase_Bill_Browse",
    "Json_Param_String": JSON.stringify([tempobj])
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.SerarchPurBillList = data;
  this.GetDistinctArr()
    this.seachSpinner = false;
    this.SearchPurBillFormSubmitted = false;
 
  })
  }
  }
  Print(DocNo) {
    if(DocNo) {
    const objtemp = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Purchase_Bill_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
  }
  Delete(col){
   // console.log("Delete Col",col);
    this.DocNo = undefined;
    this.Del = false;
    this.Save = false;
    if(col.Doc_No){
      this.Del = true;
      this.Save = false;
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
       "SP_String": "SP_Purchase_Bill",
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
          this.onReject();
          this.deleteError = true;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "c", 
            sticky: true,
            closable: false,
            severity: "warn", // "info",
            summary: data[0].Column1
            // detail: data[0].Column1
          });
          this.DocNo = undefined;
          this.GetSerarchPurBill(true);
        }
        });
    }
   }
   onReject() {
    this.compacctToast.clear("c");
    this.Spinner = false;
    this.ngxService.stop();
    this.deleteError = false;
  }

  // PENDING PURCHASE ORDER
  getDateRangeppo(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjPendingPO.start_date = dateRangeObj[0];
      this.ObjPendingPO.end_date = dateRangeObj[1];
    }
  }
  GetPendingPO(valid){
      this.PendingPOFormSubmitted = true;
      const start = this.ObjPendingPO.start_date
      ? this.DateService.dateConvert(new Date(this.ObjPendingPO.start_date))
      : this.DateService.dateConvert(new Date());
      const end = this.ObjPendingPO.end_date
      ? this.DateService.dateConvert(new Date(this.ObjPendingPO.end_date))
      : this.DateService.dateConvert(new Date());
      const tempobj = {
       From_Date : start,
       To_Date : end,
       Company_ID : this.ObjPendingPO.Company_ID,
       proj : this.openProject
      }
      if (valid) {
      const obj = {
        "SP_String": "SP_Purchase_Bill",
        "Report_Name_String": "PENDING_PURCHASE_ORDER_BROWSE",
        "Json_Param_String": JSON.stringify([tempobj])
        }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.PendingPOList = data;
        // this.BackupSearchedlist = data;
        // this.GetDistinct();
        if(this.PendingPOList.length){
          this.DynamicHeaderforPPO = Object.keys(data[0]);
        }
        else {
          this.DynamicHeaderforPPO = [];
        }
        this.seachSpinner = false;
        this.PendingPOFormSubmitted = false;
       // console.log("PendingPOList",this.PendingPOList);
      })
      }
  }
  PrintPPO(DocNo) {
    if(DocNo) {
    const objtemp = {
      "SP_String": "Sp_Purchase_Order",
      "Report_Name_String": "Purchase_Order_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
  }

  // PENDING GRN
  getDateRangepgrn(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjPendingGRN.start_date = dateRangeObj[0];
      this.ObjPendingGRN.end_date = dateRangeObj[1];
    }
  }
 
  PrintPGRN(DocNo) {
    if(DocNo) {
    const objtemp = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_GRN",
      "Report_Name_String": "GRN_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var GRNprintlink = data[0].Column1;
      window.open(GRNprintlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
  }
 // Distinct
  GetDistinctArr() {
    let DProject:any = [];
    let DSubledger:any= [];
    this.DistProject = []
    this.DistSubledger = []
    this.SelectedDistProject = [];
    this.SelectedSubledger = [];
    this.SerarchPurBillList.forEach((item:any) => {
       if (DProject.indexOf(item.Project_Description) === -1) {
        DProject.push(item.Project_Description);
          this.DistProject.push({label: item.Project_Description,value: item.Project_Description});
      }
      if (DSubledger.indexOf(item.Sub_Ledger_Name) === -1) {
        DSubledger.push(item.Sub_Ledger_Name);
          this.DistSubledger.push({label: item.Sub_Ledger_Name,value: item.Sub_Ledger_Name});
      }
    });
    this.bckUpSerarchPurBillList = [...this.SerarchPurBillList];

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

// Project

getProject(){
  this.ProjectList = [];
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Project_For_PBill",
      "Json_Param_String": JSON.stringify({Doc_No : this.ObjProductInfo.Pur_Order_No ? this.ObjProductInfo.Pur_Order_No : 0 })
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Project_Description;
        el['value'] = el.Project_ID;
      });
      this.ProjectList = data;
      console.log("ProjectList",this.ProjectList);
      
   
    })
  }
getSite(){
  let TempObj = {...this.objproject}
  this.objproject = new project()
  this.objproject.PROJECT_ID = TempObj.PROJECT_ID
  this.SiteList = [];
  this.groupList = [];
  this.subGorupList = [];
  this.workList = [];
  this.ObjProductInfo.Product_ID = undefined
  this.ProductDetails = []
  if(this.objproject.PROJECT_ID){
   let projectFilter:any = []
  this.getWork()
  projectFilter = this.ProjectList.filter((el:any)=> Number(el.Project_ID) === Number(this.objproject.PROJECT_ID))
    console.log("projectFilter",projectFilter)
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Site_For_PBill",
      "Json_Param_String": JSON.stringify([{Project_ID : Number(this.objproject.PROJECT_ID),Tender_Doc_ID : projectFilter[0].Tender_Doc_ID,Doc_No:this.ObjProductInfo.Pur_Order_No ? this.ObjProductInfo.Pur_Order_No : 0}]) 
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Site_Description;
        el['value'] = el.Site_ID;
      });
      this.SiteList = data;
      this.GetProductdetails()
       console.log("SiteList",this.SiteList);
    })
  }

}
getGroup(){
  let TempObj = {...this.objproject}
  this.objproject = new project()
  this.objproject.PROJECT_ID = TempObj.PROJECT_ID
  this.objproject.SITE_ID = TempObj.SITE_ID
  this.groupList = [];
  this.subGorupList = [];
  this.workList = [];
  this.ObjProductInfo.Product_ID = undefined
  this.ProductDetails = []
  if(this.objproject.PROJECT_ID && this.objproject.SITE_ID){
   
  
  this.getWork()
     const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Budget_Group_For_PBill",
      "Json_Param_String": JSON.stringify([{Project_ID : Number(this.objproject.PROJECT_ID) ,
                                             Site_ID : Number(this.objproject.SITE_ID),
                                             Doc_No : this.ObjProductInfo.Pur_Order_No ? this.ObjProductInfo.Pur_Order_No : 0}]) 
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Budget_Group_Name;
        el['value'] = el.Budget_Group_ID;
      });
      this.GetProductdetails()
      this.groupList = data;
    })
  }
}
getSubGroup(){
  let TempObj = {...this.objproject}
   this.objproject = new project()
   this.objproject.PROJECT_ID = TempObj.PROJECT_ID
   this.objproject.SITE_ID = TempObj.SITE_ID
   this.objproject.Budget_Group_ID = TempObj.Budget_Group_ID
   this.subGorupList = [];
   this.ObjProductInfo.Product_ID = undefined
  this.ProductDetails = []
  if(this.objproject.PROJECT_ID && this.objproject.SITE_ID && this.objproject.Budget_Group_ID){
   const tampObj = {
      Project_ID : Number(this.objproject.PROJECT_ID),
      Site_ID : Number(this.objproject.SITE_ID),
      Budget_Group_ID : Number(this.objproject.Budget_Group_ID),
      Doc_No : this.ObjProductInfo.Pur_Order_No ? this.ObjProductInfo.Pur_Order_No : 0
    }
    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Budget_Sub_Group_For_PBill",
      "Json_Param_String": JSON.stringify([tampObj]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Budget_Sub_Group_Name;
        el['value'] = el.Budget_Sub_Group_ID;
      });
      this.GetProductdetails()
        this.subGorupList = data;
     })
  }

}
SubGroupChange(){
  this.ObjProductInfo.Product_ID = undefined
  this.ProductDetails = []
  if(this.objproject.Budget_Sub_Group_ID){
    this.GetProductdetails()
  }
}
getWork(){
  this.workList = []
  this.ObjProductInfo.Product_ID = undefined
  this.ProductDetails = []
  if(this.objproject.PROJECT_ID && this.objproject.SITE_ID){

    const obj = {
      "SP_String": "SP_Purchase_Bill",
      "Report_Name_String": "Get_Work_Details_For_PBill",
      "Json_Param_String": JSON.stringify([{Project_ID : Number(this.objproject.PROJECT_ID) , 
                                            Site_ID : Number(this.objproject.SITE_ID),
                                            Doc_No : this.ObjProductInfo.Pur_Order_No ? this.ObjProductInfo.Pur_Order_No : 0}]) 
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Work_Details;
        el['value'] = el.Work_Details_ID;
      });
      this.GetProductdetails()
    this.workList = data
    })
  }
}
workChange(){
  this.ObjProductInfo.Product_ID = undefined
  this.ProductDetails = []
  if(this.objproject.Work_Details_ID){
    this.GetProductdetails()
  }
 
}

stringShort(str,wh) {
  let retuObj:any = {}
  if (str.length > 30) {
    retuObj = {
      field: str.substring(0, 30) + " ...",
      cssClass : "txt"
    }
  }
  else {
     retuObj = {
      field: str,
      cssClass : ""
    }
  }
return wh == "css" ? retuObj.cssClass : retuObj.field
}
selectWork(event,text, overlaypanel) {
  //console.log("col",col)
  if (text.length > 30) {
   this.overlayPanelText= ""
   this.overlayPanelText = text
   overlaypanel.toggle(event); 
  }
 
  }
}
class PurChaseBill {
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
  Cost_Cen_Mobile : any;
  Cost_Cen_Phone : any;
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

class TDS{
  Ledger_ID : number;
  Sub_Ledger_ID : number;
  Taxable_Amount : number;
  TDS_Percentage : number;
  TDS_Amount : number;

}

class PendingPO{
  Company_ID : any;
  start_date : Date;
  end_date : Date;
  Cost_Cen_ID : any;
}

class PendingGRN{
  Company_ID : any;
  start_date : Date;
  end_date : Date;
  Cost_Cen_ID : any;
}
