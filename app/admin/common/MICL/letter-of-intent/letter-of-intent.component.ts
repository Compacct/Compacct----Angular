import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
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
  selector: 'app-letter-of-intent',
  templateUrl: './letter-of-intent.component.html',
  styleUrls: ['./letter-of-intent.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class LetterOfIntentComponent implements OnInit {
  items: any = [];
  menuList: any = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Create";
  DocDate = new Date();
  SupplierBillDate = new Date();
  VendorList: any = [];
  StateList: any = [];
  CostCenterList: any = [];
  ProductDetails: any = [];
  LetterOfIntentFormSubmitted = false;
  ObjLetterOfIntent :LetterOfIntent = new LetterOfIntent();
  Objcostcenter :costcenter = new costcenter();
  Supplierlist: any = [];
  Godownlist: any = [];
  POorderlist: any = [];
  podatedisabled = true;
  ProductDetailslist: any = [];

  Productlist: any = [];
  productaddSubmit: any = [];

  Searchedlist: any = [];
  EditList: any = [];
  SpinnerShow = false;
  inputBoxDisabled = false;
  companyList: any = [];
  
  openProject = "N"
  projectMand = "N";
  validatation = {
    required: false,
    projectMand: 'N'
  }
  projectEditData: any = []
  @ViewChild("project", { static: false })
  PurOrderList: any = [];
  ObjProductInfo :ProductInfo = new ProductInfo();
  ProductInfoSubmitted = false;
  expiryDate: Date;
  ProductExpirydisabled = false;
  GRNDate: Date;
  headerData = ""
  GRNList: any = [];
  PONoProList: any = [];
  GRNNoProlist: any = [];
  Maintain_Serial_No = false;
  Is_Service = false;
  AddProductDetails: any = [];
  LedgerList: any = [];
  SubLedgerList: any = [];
  AddTdsDetails: any = [];

  ObjBrowsePurBill :BrowsePurBill = new BrowsePurBill();
  SerarchPurBillList: any = [];
  AddProdList: any = [];
  DocNo = undefined;
  SaveAddress: any = [];

  PendingPOFormSubmitted = false;
  PendingPOList: any = [];
  DynamicHeaderforPPO: any = [];
  PendingGRNFormSubmitted = false;
  PendingGRNList: any = [];
  DynamicHeaderforPGRN: any = [];
  deleteError = false;
  hrYeatList: any = [];
  HR_Year_ID: any;
  initDate: any = [];
  POList: any = [];
  DistProject: any = []
  SelectedDistProject: any = []
  DistSubledger: any = []
  SelectedSubledger: any = []
  bckUpQty: any = undefined
  bckUpQtyValid: boolean = false
  Same_as_Bill: boolean = true;
  DisableField: boolean = false;
  SaveAddress1: any = [];
  AllPinList: any = [];
  CenterList: any = [];
  ProductType: any = [];
  ProductSub: any = [];
  ProductDetalist: any = [];
  TaxCategoryList:any = [];
  LotNolist: any = [];
  UomList: string = '';
  Tax: any = undefined;
  CGST: any = undefined;
  SGST: any = undefined;
  IGST: any = undefined;
  NetAMT: any = undefined;
  BatchQtyCheck: any = undefined;
  SaveLowerData: any = [];
  SerarchOwterBillList: any = [];
  SerarchOwterBillListHeader: any = [];
  VendorListbrowse: any = [];
  TermFormSubmitted: boolean = false;
  Cost_Cen_ID:any;
  Tax_Category:any;
  challanno:any;
  subledgerid:any;
  Choose_Address:any;
  pindisabled:boolean = false;
  Reference_Doc_No:any;
  Reference_Doc_Date:Date;
  editlist:any = [];
  editDocNo: any;
  editorDis:boolean = false;
  Remarks_For_Amendment:any;

  constructor(
    private Header: CompacctHeader,
    private router: Router,
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    $(document).prop('title', this.headerData ? this.headerData : $('title').text());
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: 'Edit', icon: 'pi pi-fw pi-user-edit' },
      { label: 'Delete', icon: 'fa fa-fw fa-trash' }
    ];
    this.Header.pushHeader({
      Header: "Letter of Intent",
      Link: "Letter of Intent"
    });
    this.getDisable();
    this.Finyear();
    this.GetVendor();
    this.GetStateList();
    this.GetCostcenter();
    this.Costcenter();
    this.getProduct();
    this.GetTaxCategory();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.Spinner = false;
    this.Same_as_Bill = true;
    this.getDisable()
    this.productaddSubmit = [];
    this.Spinner = false;
    this.POorderlist = [];
    this.ObjProductInfo = new ProductInfo(); 
    this.SaveAddress = [];
    this.SaveAddress1 = [];
    this.ObjProductInfo.Cost_Cen_ID = this.CenterList[0].Cost_Cen_ID ? this.CenterList[0].Cost_Cen_ID : undefined;
    this.GetGodown();
    this.clearData();
    this.Choose_Address = undefined;
    this.ObjLetterOfIntent.Vehicle_Type = "Regular";
    this.Reference_Doc_No = undefined;
    this.Reference_Doc_Date = new Date();
    this.editDocNo = undefined;
    this.editlist = [];
  }
  clearData() { 
    this.LetterOfIntentFormSubmitted = false;
    this.TermFormSubmitted = false;
    this.ObjLetterOfIntent.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;  
    this.DocDate = new Date();
    this.SupplierBillDate = new Date();
    this.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.GetCosCenAddress();
    this.Tax = undefined;
    this.CGST = undefined;
    this.SGST = undefined;
    this.IGST = undefined;
    this.NetAMT = undefined;
    this.AddProdList = [];
    this.ProductSub = [];
    this.ProductDetalist = [];
    this.LotNolist = [];
    // this.SerarchOwterBillList = [];
    this.ObjLetterOfIntent.Sub_Ledger_Billing_Name = '';
    this.ObjLetterOfIntent.Choose_Address2 = undefined;
    this.ObjLetterOfIntent.Choose_Address = undefined;
    this.ObjLetterOfIntent.Sub_Ledger_ID = undefined;
    this.ObjLetterOfIntent.Sub_Ledger_Address_1 = "";
    this.ObjLetterOfIntent.Sub_Ledger_District = "";
    this.ObjLetterOfIntent.Sub_Ledger_State = undefined;
    this.ObjLetterOfIntent.Sub_Ledger_Pin = undefined;
    this.ObjLetterOfIntent.Sub_Ledger_GST_No = undefined;
    this.ObjLetterOfIntent.Sub_Ledger_Address_2 = '';
    this.ObjLetterOfIntent.Sub_Ledger_District_2 = '';
    this.ObjLetterOfIntent.Sub_Ledger_State_2 = undefined;
    this.ObjLetterOfIntent.Sub_Ledger_Pin_2 = undefined;
    this.ObjLetterOfIntent.Sub_Ledger_GST_No_2 = undefined;
    this.ObjLetterOfIntent.Mode_Of_Delivery = undefined;
    this.ObjLetterOfIntent.Delivery_Point = undefined;
    this.ObjLetterOfIntent.Vehicle_No = undefined;
    this.ObjLetterOfIntent.Transporterr = undefined;
    this.ObjLetterOfIntent.LR_No = undefined;
    this.editorDis = true
    setTimeout(() => {
      this.editorDis = false
    }, 500);
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
        let data = JSON.parse(res)
        // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
        // this.voucherminDate = new Date(data[0].Fin_Year_Start);
        // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
        this.initDate = [new Date(data[0].Fin_Year_Start), new Date(data[0].Fin_Year_End)]
      });
  }
  GetSerarchBrowse(Valid: any) {
    const start = this.ObjBrowsePurBill.start_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowsePurBill.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowsePurBill.end_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowsePurBill.end_date))
      : this.DateService.dateConvert(new Date());
    const tempobj = {
      From_Date: start,
      To_Date: end,
      Sub_Ledger_ID: this.ObjBrowsePurBill.Sub_Ledger_ID ? this.ObjBrowsePurBill.Sub_Ledger_ID : 0,
    }
    if (Valid) {
      const obj = {
        "SP_String": "SP_BL_Txn_Letter_Of_Intent",
        "Report_Name_String": "browse_BL_Txn_Letter_Of_Intent",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("SerarchOwterBillList", data)
        this.SerarchOwterBillList = data;
        this.SerarchOwterBillListHeader = data.length ? Object.keys(data[0]): []
      });
    }
  }
  getDisable() {
    if (this.Same_as_Bill === true) {
      this.DisableField = true
    }
    else {
      this.DisableField = false
      this.ObjLetterOfIntent.Choose_Address2 = undefined
    }
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowsePurBill.start_date = dateRangeObj[0];
      this.ObjBrowsePurBill.end_date = dateRangeObj[1];
    }
  }
  GetVendor() {
    const obj = {
      "SP_String": "SP_BL_Txn_Letter_Of_Intent",
      "Report_Name_String": "Get_Subledger",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.VendorList = data;
      this.VendorListbrowse = data;
      console.log("vendor list======", this.VendorList);
    });
  }
  VenderNameChange() {
    this.ObjLetterOfIntent.Sub_Ledger_Billing_Name = '';
    this.SaveAddress = [];
    this.SaveAddress1 = [];
    if (this.ObjLetterOfIntent.Sub_Ledger_ID) {
      const ctrl = this;
      const vendorObj = $.grep(ctrl.VendorList, function (item: any) { return item.value == ctrl.ObjLetterOfIntent.Sub_Ledger_ID })[0];
      this.ObjLetterOfIntent.Sub_Ledger_Billing_Name = vendorObj.Sub_Ledger_Billing_Name;
      this.ObjLetterOfIntent.Sub_Ledger_Name = vendorObj.label;
      this.GetChooseAddress();
    } else {
    this.ObjLetterOfIntent.Sub_Ledger_Billing_Name = '';
    }
  }
  GetChooseAddress() {
    this.SaveAddress = []
    const TempObj = {
      Sub_Ledger_ID: this.ObjLetterOfIntent.Sub_Ledger_ID,
    }
    const obj = {
      "SP_String": "SP_BL_Txn_Letter_Of_Intent",
      "Report_Name_String": "Get_Subledger_Address",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log("GetChooseAddress  ===", data);
      this.SaveAddress = data;
      this.SaveAddress1 = data;
    })

  }
  onChangeAdd() {
    if (this.Choose_Address) {
      const address1 = this.SaveAddress.filter(item=> item.Address_Caption == this.Choose_Address)
        this.ObjLetterOfIntent.Sub_Ledger_Address_1 = address1.length ? address1[0].Address_1 : undefined;
        this.ObjLetterOfIntent.Sub_Ledger_District = address1.length ? address1[0].District : undefined;
        this.ObjLetterOfIntent.Sub_Ledger_State = address1.length ? address1[0].State : undefined;
        this.GetStateList()
        this.ObjLetterOfIntent.Sub_Ledger_Pin = address1.length ? address1[0].Pin : undefined;
        this.ObjLetterOfIntent.Sub_Ledger_GST_No = address1.length ? address1[0].Sub_Ledger_GST_No : undefined;
    }
   
    if (this.ObjLetterOfIntent.Choose_Address2) {
      const address2 = this.SaveAddress.filter(item=> item.Address_Caption == this.ObjLetterOfIntent.Choose_Address2)
      this.ObjLetterOfIntent.Sub_Ledger_Address_2 = address2.length ? address2[0].Address_1 : undefined;
        this.ObjLetterOfIntent.Sub_Ledger_District_2 = address2.length ? address2[0].District : undefined;
        this.ObjLetterOfIntent.Sub_Ledger_State_2 = address2.length ? address2[0].State : undefined;
        this.GetStateList()
      this.ObjLetterOfIntent.Sub_Ledger_Pin_2 = address2.length ? address2[0].Pin : undefined;
      this.ObjLetterOfIntent.Sub_Ledger_GST_No_2 = address2.length ? address2[0].Sub_Ledger_GST_No : undefined;
    }
   
  }
  GetStateList() {
    const obj = {
      "SP_String": "SP_MICL_Purchase_Bill_New",
      "Report_Name_String": "Get_State_List",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.StateList = data;
      console.log('StateList', this.StateList)
    })
  }
  StateDistrictChange(pin: any) {
    this.AllPinList = [];
    this.pindisabled = false;
    if (pin.length === 6) {
      const obj = {
        "SP_String": "SP_BL_Txn_Letter_Of_Intent",
        "Report_Name_String": "Get_District_State",
        "Json_Param_String": JSON.stringify([{ PIN: pin }])
      }
      this.GlobalAPI.getData(obj).subscribe((data) => {
        console.log("pin.length", data)
        this.AllPinList = data;
        this.ObjLetterOfIntent.Sub_Ledger_State_2 = this.AllPinList.length ? this.AllPinList[0].StateName : undefined
        this.GetStateList();
        this.ObjLetterOfIntent.Sub_Ledger_District_2 = this.AllPinList.length ? this.AllPinList[0].DistrictName : undefined
        this.pindisabled = true;
      });
    }
  }
  GetCostcenter() {
    const obj = {
      "SP_String": "SP_BL_Txn_Letter_Of_Intent",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.CostCenterList = data;
      console.log("this.CostCenterList", this.CostCenterList)
      this.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.GetCosCenAddress();
    })
  }
  GetGodown() {
    this.ObjProductInfo.godown_id = undefined;
    this.Godownlist = [];
    if (this.ObjProductInfo.Cost_Cen_ID) {
      const TempObj = {
        Cost_Cen_ID: this.ObjProductInfo.Cost_Cen_ID,
      }
      const obj = {
        "SP_String": "SP_BL_Txn_Letter_Of_Intent",
        "Report_Name_String": "Get_Godown_list",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("GodownList  ===", data);
        this.Godownlist = data;
      })
    }
   
  }
  GetCosCenAddress() {
    //this.ExpiredProductFLag = false;
      this.Objcostcenter.Cost_Cen_Address1 = undefined;
      this.Objcostcenter.Cost_Cen_Address2 = undefined;
      this.Objcostcenter.Cost_Cen_State = undefined;
      this.Objcostcenter.Cost_Cen_GST_No = undefined;
      this.Objcostcenter.Cost_Cen_Location = undefined;
      this.Objcostcenter.Cost_Cen_PIN = undefined;
      this.Objcostcenter.Cost_Cen_District = undefined;
      this.Objcostcenter.Cost_Cen_Country = undefined;
      this.Objcostcenter.Cost_Cen_Mobile = undefined;
      this.Objcostcenter.Cost_Cen_Phone = undefined;
      this.Objcostcenter.Cost_Cen_Email = undefined;
      this.Objcostcenter.Cost_Cen_Name = undefined;
    if (this.Cost_Cen_ID) {
      const ctrl = this;
      const costcenObj = $.grep(ctrl.CostCenterList, function (item: any) { return item.Cost_Cen_ID == ctrl.Cost_Cen_ID })[0];
      // console.log(costcenObj);
      // this.ObjPurChaseBill = costcenObj
      this.Objcostcenter.Cost_Cen_Address1 = costcenObj.Cost_Cen_Address1;
      this.Objcostcenter.Cost_Cen_Address2 = costcenObj.Cost_Cen_Address2;
      this.Objcostcenter.Cost_Cen_State = costcenObj.Cost_Cen_State;
      this.Objcostcenter.Cost_Cen_GST_No = costcenObj.Cost_Cen_GST_No;
      this.Objcostcenter.Cost_Cen_Location = costcenObj.Cost_Cen_Location;
      this.Objcostcenter.Cost_Cen_PIN = costcenObj.Cost_Cen_PIN;
      this.Objcostcenter.Cost_Cen_District = costcenObj.Cost_Cen_District;
      this.Objcostcenter.Cost_Cen_Country = costcenObj.Cost_Cen_Country;
      this.Objcostcenter.Cost_Cen_Mobile = costcenObj.Cost_Cen_Mobile;
      this.Objcostcenter.Cost_Cen_Phone = costcenObj.Cost_Cen_Phone;
      this.Objcostcenter.Cost_Cen_Email = costcenObj.Cost_Cen_Email1;
      this.Objcostcenter.Cost_Cen_Name = costcenObj.Cost_Cen_Name;
    }
  }
  Costcenter() {
    this.CenterList = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Letter_Of_Intent",
      "Report_Name_String": "Get_Finish_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.CenterList = data;
      console.log("this.CostCenterList222222", this.CenterList)
    })
  }
  // CALCULATE DISTANCE
  CalculateDistance(){
    if (this.ObjLetterOfIntent.Sub_Ledger_Pin_2 && this.Objcostcenter.Cost_Cen_PIN) {
      const sendObj = {
        fromPincode : this.ObjLetterOfIntent.Sub_Ledger_Pin_2,
        toPincode : this.Objcostcenter.Cost_Cen_PIN
      }
      this.$http.get("https://pro.mastersindia.co/distance?access_token=67de68c055600f7732171e73e14475bc53954950&fromPincode="+this.ObjLetterOfIntent.Sub_Ledger_Pin_2+"&toPincode="+this.Objcostcenter.Cost_Cen_PIN)
     .subscribe((data:any)=>{
      console.log("data",data)
     })
    }
  }
  getProduct() {
    const obj = {
      "SP_String": "SP_BL_Txn_Letter_Of_Intent",
      "Report_Name_String": "Get_Master_Product_Type_For_Production",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.ProductType = data;
      console.log("this.ProductType", this.ProductType)
    })
  }
  ChangeProdoctTyp() {
    this.ProductSub = [];
    this.ObjProductInfo.Product_Sub_Type_ID = undefined;
    this.ObjProductInfo.Product_Specification = undefined;
    this.UomList = ''
    this.ObjProductInfo.Batch_Number = undefined
    if (this.ObjProductInfo.Product_Type_ID) {
      const TempObj = {
        Product_Type_ID: this.ObjProductInfo.Product_Type_ID,
      }
      const obj = {
        "SP_String": "SP_BL_Txn_Letter_Of_Intent",
        "Report_Name_String": "Get_Master_Product_Sub_Type",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("ProductSub  ===", data);
        this.ProductSub = data;
      })
    }
    
  }
  ProductDetal() {
    this.ProductDetalist = [];
    this.ObjProductInfo.Product_Specification = undefined;
    this.UomList = '';
    this.ObjProductInfo.Batch_Number = undefined
    if (this.ObjProductInfo.Product_Type_ID && this.ObjProductInfo.Product_Sub_Type_ID) {
      const TempObj = {
        Product_Type_ID: this.ObjProductInfo.Product_Type_ID,
        Product_Sub_Type_ID: this.ObjProductInfo.Product_Sub_Type_ID,
      }
      const obj = {
        "SP_String": "SP_BL_Txn_Letter_Of_Intent",
        "Report_Name_String": "Get_Products",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("ProductDetalist  ===", data);
        this.ProductDetalist = data;
      })
    }
  
  }
  GetTaxCategory() {
    this.TaxCategoryList = [];
      const obj = {
        "SP_String": "SP_BL_Txn_Letter_Of_Intent",
        "Report_Name_String": "Get_TAX_Catagory",
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("TaxCategoryList  ===", data);
        this.TaxCategoryList = data;
      })
  
  }
  getUom() {
    this.UomList = '';
    this.Tax_Category = undefined;
    if (this.ObjProductInfo.Product_Specification) {
      const TempArry: any = this.ProductDetalist.filter((el: any) => Number(el.value) === Number(this.ObjProductInfo.Product_Specification))
      this.UomList = TempArry[0].UOM;
      this.Tax_Category = TempArry.length ? TempArry[0].Cat_ID : undefined;
    }
  }
  GetTaxAmt() {
    if (this.ObjProductInfo.Qty && this.ObjProductInfo.Rate) {
      this.ObjProductInfo.Taxable_Amount = (this.ObjProductInfo.Qty * this.ObjProductInfo.Rate).toFixed(2);
    }
    else {
      this.ObjProductInfo.Taxable_Amount = undefined;
    }
  }
  AddProduct(valid: any) {
    this.TermFormSubmitted = true;
    if (valid) {
      
      const ProductDArry: any = this.ProductDetalist.filter((el: any) => Number(el.value) === Number(this.ObjProductInfo.Product_Specification));
      const TaxCatArry: any = this.TaxCategoryList.filter((el: any) => Number(el.Cat_ID) === Number(this.Tax_Category));
      
      var gstper = Number(TaxCatArry[0].GST_Tax_Per / 2).toFixed(2);
      this.ObjProductInfo.CGST_Rate = Number(gstper);
      this.ObjProductInfo.SGST_Rate = Number(gstper);
      this.ObjProductInfo.IGST_Rate = Number(TaxCatArry[0].GST_Tax_Per);
      const SubLedgerState = this.ObjLetterOfIntent.Sub_Ledger_State
        ? this.ObjLetterOfIntent.Sub_Ledger_State.toUpperCase()
        : undefined;
      const CostCenterState = this.Objcostcenter.Cost_Cen_State
        ? this.Objcostcenter.Cost_Cen_State.toUpperCase()
        : undefined;
      if (SubLedgerState && CostCenterState) {
        if (SubLedgerState === CostCenterState) {
          this.ObjProductInfo.CGST_Amount = Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.CGST_Rate) / 100).toFixed(2));
          this.ObjProductInfo.SGST_Amount = Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.SGST_Rate) / 100).toFixed(2));
          this.ObjProductInfo.Net_Amt = Number(Number(this.ObjProductInfo.Taxable_Amount) + Number(this.ObjProductInfo.CGST_Amount) + Number(this.ObjProductInfo.SGST_Amount)).toFixed(2);
          this.ObjProductInfo.IGST_Amount = 0;
          this.ObjProductInfo.IGST_Rate = 0;
          
        }
        else {
          this.ObjProductInfo.IGST_Amount = Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.IGST_Rate) / 100).toFixed(2));
          this.ObjProductInfo.Net_Amt = Number(Number(this.ObjProductInfo.Taxable_Amount) + Number(this.ObjProductInfo.IGST_Amount)).toFixed(2);
          this.ObjProductInfo.CGST_Amount = 0;
          this.ObjProductInfo.CGST_Rate = 0;
          this.ObjProductInfo.SGST_Amount = 0;
          this.ObjProductInfo.SGST_Rate = 0;
        }
      }
      const GdwonArry: any = this.Godownlist.filter((el: any) => Number(el.godown_id) === Number(this.ObjProductInfo.godown_id));
      const ProductArry: any = this.ProductType.filter((el: any) => Number(el.Product_Type_ID) === Number(this.ObjProductInfo.Product_Type_ID));
      const ProductSubArry: any = this.ProductSub.filter((el: any) => Number(el.Product_Sub_Type_ID) === Number(this.ObjProductInfo.Product_Sub_Type_ID));
      const TemopArry = {
        Product_ID :this.ObjProductInfo.Product_Specification,
        Product_Name : ProductDArry[0].label,
        HSL_No : ProductDArry[0].HSN_No,
        Product_Specification: ProductDArry[0].label,
        HSN_No : ProductDArry[0].HSN_No,
        Product_Type_ID : this.ObjProductInfo.Product_Type_ID,
        Product_Type: ProductArry[0].Product_Type,
        Product_Sub_Type_ID : this.ObjProductInfo.Product_Sub_Type_ID,
        Product_Sub_Type: ProductSubArry[0].Product_Sub_Type,
        UOM: this.UomList,
        Qty: this.ObjProductInfo.Qty,
        MRP: this.ObjProductInfo.Rate,
        Rate: this.ObjProductInfo.Rate,
        Amount: Number(this.ObjProductInfo.Taxable_Amount).toFixed(2),
        Taxable_Amount: Number(this.ObjProductInfo.Taxable_Amount).toFixed(2),
        Taxable_unt: Number(this.ObjProductInfo.Taxable_Amount).toFixed(2),
        CGST_Rate: this.ObjProductInfo.CGST_Rate,
        CGST_Amount: Number(this.ObjProductInfo.CGST_Amount).toFixed(2),
        SGST_Rate: this.ObjProductInfo.SGST_Rate,
        SGST_Amount: Number(this.ObjProductInfo.SGST_Amount).toFixed(2),
        IGST_Rate: this.ObjProductInfo.IGST_Rate,
        IGST_Amount: Number(this.ObjProductInfo.IGST_Amount).toFixed(2),
        Line_Total_Amount: Number(this.ObjProductInfo.Net_Amt).toFixed(2),
        Cat_ID : this.Tax_Category
      };
      this.AddProdList.push(TemopArry)
      this.TotalCalculation();
      console.log("this.AddProdList", this.AddProdList)
      this.TermFormSubmitted = false;
      this.ObjProductInfo.godown_id = undefined;
      this.ObjProductInfo.Product_Type_ID = undefined;
      this.ProductSub = [];
      this.ProductDetalist = [];
      this.LotNolist = [];
      this.ObjProductInfo.Product_Specification = undefined;
      this.ObjProductInfo.Qty = undefined;
      this.UomList = '';
      this.ObjProductInfo.Rate = undefined;
      this.ObjProductInfo.Taxable_Amount = undefined;
      this.Tax_Category = undefined;
    }
  }
  Deteteaddlist(index){
    this.AddProdList.splice(index,1);
    this.TotalCalculation();
  }
  TotalCalculation() {
    this.Tax = undefined;
    this.CGST = undefined;
    this.SGST = undefined;
    this.IGST = undefined;
    this.NetAMT = undefined;
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;
    let count5 = 0;
    this.AddProdList.forEach(item => {
      count1 = count1 + Number(item.Taxable_unt);
      count2= count2 + Number(item.CGST_Amount);
      count3 = count3 + Number(item.SGST_Amount);
      count4= count4 + Number(item.IGST_Amount);
      count5 = count5 + Number(item.Line_Total_Amount);
    });
    this.Tax = count1.toFixed(2);
    this.CGST = count2.toFixed(2);
    this.SGST = count3.toFixed(2);
    this.IGST = count4.toFixed(2);
    this.NetAMT = count5.toFixed(2);
  }
  SaveLI(valid: any){
    this.SaveLowerData = [];
    this.LetterOfIntentFormSubmitted = true;
    if (valid && this.AddProdList.length) {
      this.compacctToast.clear();
     this.compacctToast.add({
       key: "s",
       sticky: true,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
    }
  }
  onConfirmSave() {
      let savedata:any = [];
      const T_Elemnts = {
        Doc_No: this.editDocNo ? this.editDocNo : 'A',
        Doc_Date: this.DateService.dateConvert(this.DocDate),
          
        Address_Type: this.Choose_Address,
        Cost_Cen_ID: this.Cost_Cen_ID,
          
        Bill_Net_Amt: this.NetAMT,
        User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
        Fin_Year_ID: this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
          
        Ref_Doc_No: this.Reference_Doc_No,
        Ref_Doc_Date: this.DateService.dateConvert(new Date(this.Reference_Doc_Date)),
        Mode_Of_Delivery: this.ObjLetterOfIntent.Mode_Of_Delivery,
        Vehicle_Type:this.ObjLetterOfIntent.Vehicle_Type,
        Transportation_Distance : this.ObjLetterOfIntent.Transportation_Distance,
        Transporter_ID: this.ObjLetterOfIntent.Transporter_ID,
        Delivery_Point: this.ObjLetterOfIntent.Delivery_Point,
        Vehicle_No: this.ObjLetterOfIntent.Vehicle_No,
        Transporter: this.ObjLetterOfIntent.Transporterr,
        LR_No: this.ObjLetterOfIntent.LR_No,
        LR_Date: this.DateService.dateConvert(this.SupplierBillDate),
        Remarks_For_Amendment: this.Remarks_For_Amendment ? this.Remarks_For_Amendment : '',
        L_element: this.AddProdList
      }
      savedata = {...this.ObjLetterOfIntent,...this.Objcostcenter,...T_Elemnts};
      const obj = {
        "SP_String": "SP_BL_Txn_Letter_Of_Intent",
        "Report_Name_String": "Create_BL_Txn_Letter_Of_Intent",
        "Json_Param_String": JSON.stringify([savedata])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        var tempID = data[0].Column1;
        this.challanno = data[0].Column1;
        this.subledgerid = data[0].Column2;
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: tempID,
            detail: "successfully Create ",
          });
          // this.compacctToast.clear();
          // this.compacctToast.add({
          //   key: "bill",
          //   sticky: true,
          //   severity: "warn",
          //   summary: "Successfully create challan no ("+tempID+")." + "Do you want to create a Bill ?",
          //   detail: "Confirm to proceed"
          // });
      this.ObjLetterOfIntent = new LetterOfIntent();
      this.DocDate = new Date();
      this.SupplierBillDate = new Date();
      this.Reference_Doc_No = undefined;
      this.Reference_Doc_Date = new Date();
      this.LetterOfIntentFormSubmitted = false
      if(this.buttonname = "Update"){
        this.tabIndexToView = 0;
        this.items = ["BROWSE", "CREATE"];
        this.buttonname = "Create";
        this.editDocNo = undefined;
      }
      this.Tax = undefined;
      this.CGST = undefined;
      this.SGST = undefined;
      this.IGST = undefined;
      this.NetAMT = undefined;
      this.AddProdList = [];
      this.ProductSub = [];
      this.ProductDetalist = [];
      this.LotNolist = [];
      this.ObjLetterOfIntent.Vehicle_Type = "Regular";
      this.Choose_Address = undefined;
      this.GetSerarchBrowse(true);
     }
    }); 
     
    // }
  }
  onReject() {
    this.compacctToast.clear("c");
    this.compacctToast.clear("s");
    this.compacctToast.clear("bill");
  }
  Print(DocNo) {
    if (DocNo) {
      const objtemp = {
        "SP_String": "SP_BL_Txn_Letter_Of_Intent",
        "Report_Name_String": "BL_Txn_Letter_Of_Intent_Print"
      }
      this.GlobalAPI.getData(objtemp).subscribe((data: any) => {
        var printlink = data[0].Column1;
        window.open(printlink + "?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      })
    }
  }
  onConfirmDel() {
    if (this.DocNo) {
      const obj = {
        "SP_String": "SP_BL_Txn_Letter_Of_Intent",
        "Report_Name_String": "Delete_BL_Txn_Letter_Of_Intent",
        "Json_Param_String": JSON.stringify([{ Doc_No: this.DocNo, User_ID: this.$CompacctAPI.CompacctCookies.User_ID }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        var terd = data[0].Column1
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: terd === "Can not delete ! Chanllan Already generated" ? "error" :"success" ,
            summary: terd,
            detail: terd === "Can not delete ! Chanllan Already generated" ? "" :  "Succesfully Delete",
          });
          this.DocNo = undefined;
          this.GetSerarchBrowse(true);
        }
      });
    }
  }
  Delete(col){
    this.DocNo = undefined;
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

   Edit(col){
    this.clearData();
    this.editDocNo = undefined;
    if(col.Doc_No){
      this.editDocNo = col.Doc_No;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.getedit(col.Doc_No);
     }
   }
   getedit(Dno){
    this.editlist = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Letter_Of_Intent",
      "Report_Name_String": "Get_Edit_BL_Txn_Letter_Of_Intent_Data",
      "Json_Param_String": JSON.stringify([{Doc_No : Dno}])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editlist = data;
      this.ObjLetterOfIntent.Sub_Ledger_ID = data[0].Sub_Ledger_ID;
      this.VenderNameChange();
      this.Choose_Address = data[0].Address_Type;
      setTimeout(() => {
      this.onChangeAdd();
      }, 300);
      this.Cost_Cen_ID = data[0].Cost_Cen_ID;
      this.GetCosCenAddress();
      this.Reference_Doc_No = data[0].Ref_Doc_No;
      this.Reference_Doc_Date = new Date(data[0].Ref_Doc_Date);
      this.DocDate = new Date(data[0].Doc_Date);
      this.Remarks_For_Amendment = data[0].Remarks_For_Amendment ? data[0].Remarks_For_Amendment : undefined;
      // this.RDBListAdd = data[0].L_element;
      this.editorDis = true
      data.forEach(element => {
        const  productObj = {
            Product_Type_ID : element.Product_Type_ID,
            Product_Type: element.Product_Type,
            Product_Sub_Type_ID : element.Product_Sub_Type_ID,
            Product_Sub_Type: element.Product_Sub_Type,
            Ref_Doc_No : element.Ref_Doc_No,
            Ref_Doc_Date : element.Ref_Doc_No ? element.Ref_Doc_Date : undefined,
            Product_ID: Number(element.Product_ID),
            Product_Name: element.Product_Name,
            Product_Specification: element.Product_Name,
            HSL_No: element.HSL_No,
            UOM: element.UOM,
            LI_Qty: Number(element.LI_Qty),
            Qty: Number(element.Qty),
            Sale_Order_Qty: Number(element.Sale_Order_Qty),
            Sale_Bill_Qty: Number(element.Sale_Bill_Qty),
            MRP: Number(element.MRP),
            Rate: Number(element.Rate),
            Amount: Number(element.Amount),
            Taxable_unt: Number(element.Taxable_Amount),
            Taxable_Amount: Number(element.Taxable_Amount),
            CGST_Rate: Number(element.CGST_Rate),
            CGST_Amount: Number(element.CGST_Amount),
            SGST_Rate: Number(element.SGST_Rate),
            SGST_Amount: Number(element.SGST_Amount),
            IGST_Rate: Number(element.IGST_Rate),
            IGST_Amount: Number(element.IGST_Amount),
            Line_Total_Amount: (element.Line_Total_Amount),
            Cat_ID : Number(element.Cat_ID)
          };
    
          this.AddProdList.push(productObj);
          this.TotalCalculation();
        });
        setTimeout(() => {
          this.editorDis = false
        }, 700);
    })
   }
  //  DynamicRedirectTo (obj){
  //   const navigationExtras: NavigationExtras = {
  //     queryParams: obj,
  //   };
  //   this.router.navigate([obj.Redirect_To], navigationExtras);
  // }
  //  RedrectEdit() {
  //   if (this.challanno) {
  //     const TempObj = {
  //       Redirect_To : './MICL_Sale_Bill',
  //       Challan_No : this.challanno,
  //       Sub_Ledger_ID : this.subledgerid,
  //       Cost_Cen_ID : this.Cost_Cen_ID,
  //       Choose_Address : this.Choose_Address
  //     }
  //     this.DynamicRedirectTo(TempObj); 
  //   }// CHALLAN TO BILL

  // }
}
class LetterOfIntent {
  Receiver_Name: any;
  Choose_Address: any;
  Choose_Address2: any;
  Doc_Date : any;
  Company_ID: any;
  Sub_Ledger_Pin_2: any;
  Sub_Ledger_ID : any;
  Sub_Ledger_Name : string;
  Sub_Ledger_Billing_Name : string;
  Sub_Ledger_Address_1 : string;
  Sub_Ledger_Address_2 : string;
  Sub_Ledger_Address_3 : string;
  Sub_Ledger_Land_Mark : string;
  Sub_Ledger_Pin : any;
  Sub_Ledger_District: string;
  Sub_Ledger_District_2: string;
  Sub_Ledger_State: any; 
  Sub_Ledger_State_2: any;
  Sub_Ledger_GST_No_2: any;
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
  Cost_Cen_Name : any;
  Cost_Cen_Address1 : any;
  Cost_Cen_Address2 : any;
  Cost_Cen_Location : any;
  Cost_Cen_District : any;
  Cost_Cen_State : any;
  Cost_Cen_Country : any;
  Cost_Cen_PIN : any;
  Cost_Cen_Mobile : any;
  Cost_Cen_Phone : any;
  Cost_Cen_Email : any;
  Cost_Cen_VAT_CST : any;
  Cost_Cen_CST_NO : any;
  Cost_Cen_SRV_TAX_NO : any;
  Cost_Cen_GST_No : any;

  Delivery_Point : any;
  Mode_Of_Delivery : any;
  Transportation_Distance = 0;
  Vehicle_Type : any;
  Vehicle_No : any;
  Transporterr : any;
  Transporter_ID : any;
  Supp_Ref_Date : any;
  LR_No : any;
  CN_Date : any;
  RCM : any;

  Bill_Gross_Amt : number;
  Bill_Net_Amt : number;
  Rounded_Off : number;
  User_ID : number;
  Fin_Year_ID : number;
 }
 class costcenter {
  Cost_Cen_ID : any;
  Cost_Cen_Name : any;
  Cost_Cen_Address1 : any;
  Cost_Cen_Address2 : any;
  Cost_Cen_Location : any;
  Cost_Cen_District : any;
  Cost_Cen_State : any;
  Cost_Cen_Country : any;
  Cost_Cen_PIN : any;
  Cost_Cen_Mobile : any;
  Cost_Cen_Phone : any;
  Cost_Cen_Email : any;
  Cost_Cen_VAT_CST : any;
  Cost_Cen_CST_NO : any;
  Cost_Cen_SRV_TAX_NO : any;
  Cost_Cen_GST_No : any;
 }
 class BrowsePurBill {
  start_date : Date;
  end_date : Date;
  Sub_Ledger_ID : any;
}

class ProductInfo {
  Cost_Cen_ID: any;
  Cost_Cen_Name: any;
  Cost_Cen_State: any;
  godown_id :any ;
  godown_name: string;
  Product_Type_ID: any;
  Product_Sub_Type_ID: any;
  Product_ID: any;
  Product_Name: string;
  Product_Specification: any;
  Batch_Number: any;
  Taxable_Amount: any;
  Qty: any;
  UOM: any;
  Rate: any;
  CGST_Rate: number;
  CGST_Amount: number;
  SGST_Rate: number;
  SGST_Amount: number;
  IGST_Rate: number;
  IGST_Amount: number;
  Net_Amt: any =0;
  Total: number;
  CGST_Input_Ledger_ID: number;
  SGST_Input_Ledger_Id: number;
  IGST_Input_Ledger_ID: number;
}
