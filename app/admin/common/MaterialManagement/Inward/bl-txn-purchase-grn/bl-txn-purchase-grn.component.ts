import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { CommonUserActivityService } from "../../../../shared/compacct.services/common-user-activity.service";
import { HttpParams } from "@angular/common/http";

@Component({
  selector: 'app-bl-txn-purchase-grn',
  templateUrl: './bl-txn-purchase-grn.component.html',
  styleUrls: ['./bl-txn-purchase-grn.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class BlTxnPurchaseGrnComponent implements OnInit {
  url = window["config"];
  items: any = ["BROWSE", "CREATE"];
  menuList: any = [];
  Spinner = false;
  seachSpinner = false;
  tabIndexToView = 0;
  buttonname = "Create";
  docNumber: any;
  SearchGrnFormSubmitted = false;
  CostCenterList: any = [];
  initDate: any = [];
  ObjBrowseSearch: BrowseSearch = new BrowseSearch();
  getAllDataList:any = [];
  BackupSearchedlist:any = [];
  getAllDataListHeaders: any = [];
  Permission: any;
  PurchaseGrnFormSubmitted = false;
  ObjSubLedger: SubLedger = new SubLedger();
  ObjCostCenter: CostCenter = new CostCenter();
  ObjOther: Other = new Other();
  ObjProductInfo: ProductInfo = new ProductInfo();
  SubLedgerList: any = [];
  states: any = [];
  DocDate = new Date();
  cnnDate:any;
  InwardTypeList:any = [];
  ProductList:any = [];
  ProductInfoSubmitted:boolean = false;
  GodownList:any = [];
  AddProductDetails:any = [];
  Product_Serial:any;
  SerialNostatus:any;
  editDocNo:any;
  ViewButtonDisabled:boolean = false;
  DistSubLedger:any = [];
  SelectedDistSubLedger:any = [];
  DistInwardType:any = [];
  SelectedInwardType:any = [];
  SearchFields:any = [];

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
    private _CommonUserActivity : CommonUserActivityService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Material Inward Challan",
      Link: " Material Management -> Inward -> Material Inward Challan",
    });
    this.Permission = this.$CompacctAPI.CompacctCookies.Del_Right;
    this.GetCostCenter();
    this.GetSubLedger();
    this.GetState();
    this.GetInwardType();
    this.GetProduct();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.Spinner = false;
    this.clearData();
  }
  clearData() {
    this.docNumber = undefined;
    this.DocDate = new Date();
    this.cnnDate = null;
    this.PurchaseGrnFormSubmitted = false;
    this.ObjSubLedger = new SubLedger();
    this.ObjCostCenter = new CostCenter();
    this.ObjOther = new Other();
    this.ObjProductInfo = new ProductInfo();
    this.ProductInfoSubmitted = false;
    this.Spinner = false
    this.ObjCostCenter.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.CostCenterChange(this.ObjCostCenter.Cost_Cen_ID)
    this.AddProductDetails = [];
    this.seachSpinner = false;
    this.editDocNo = undefined;
    this.items = [ 'BROWSE', 'CREATE'];
    this.buttonname = "Create";
    this.docNumber = undefined;
    this.ViewButtonDisabled = false;
  }
  GetSubLedger() {
    this.$http.get(this.url.apiGetSubledgerCr).subscribe((data: any) => {
      this.SubLedgerList = data ? JSON.parse(data) : [];
      if (this.SubLedgerList.length) {
        this.SubLedgerList.forEach((el: any) => {
          el.label = el.Sub_Ledger_Name;
          el.value = el.Sub_Ledger_ID;
        });
      }
    });
  }
  SubledgerChange(SubLedgerID) {
    const obj = this.SubLedgerList.filter((el: any) => el.Sub_Ledger_ID == SubLedgerID)[0];

    this.ObjSubLedger.Sub_Ledger_Name = obj.Sub_Ledger_Name;
    this.ObjSubLedger.Sub_Ledger_Billing_Name = obj.Sub_Ledger_Billing_Name;
    this.ObjSubLedger.Sub_Ledger_Email = obj.Sub_Ledger_Email ? obj.Sub_Ledger_Email : "";
    this.ObjSubLedger.Sub_Ledger_Mobile_No = obj.Sub_Ledger_Mobile_No ? obj.Sub_Ledger_Mobile_No : "";
    this.ObjSubLedger.Sub_Ledger_Address_1 = obj.Sub_Ledger_Address_1 ? obj.Sub_Ledger_Address_1 : ""
    this.ObjSubLedger.Sub_Ledger_Land_Mark = obj.Sub_Ledger_Land_Mark ? obj.Sub_Ledger_Land_Mark : "";
    this.ObjSubLedger.Sub_Ledger_Pin = obj.Sub_Ledger_Pin ? obj.Sub_Ledger_Pin : "";
    this.ObjSubLedger.Sub_Ledger_District = obj.Sub_Ledger_District ? obj.Sub_Ledger_District : "";
    this.ObjSubLedger.Sub_Ledger_State = obj.Sub_Ledger_State ? obj.Sub_Ledger_State : "";
    this.ObjSubLedger.Sub_Ledger_Country = obj.Sub_Ledger_Country ? obj.Sub_Ledger_Country : "";
    this.ObjSubLedger.Sub_Ledger_PAN_No = obj.Sub_Ledger_PAN_No ? obj.Sub_Ledger_PAN_No : "";
    this.ObjSubLedger.Sub_Ledger_TIN_No = obj.Sub_Ledger_TIN_No ? obj.Sub_Ledger_TIN_No : "";
    this.ObjSubLedger.Sub_Ledger_CST_No = obj.Sub_Ledger_CST_No ? obj.Sub_Ledger_CST_No : "";
    this.ObjSubLedger.Sub_Ledger_SERV_REG_NO = obj.Sub_Ledger_SERV_REG_NO ? obj.Sub_Ledger_SERV_REG_NO : "";
    this.ObjSubLedger.Sub_Ledger_CIN_No = obj.Sub_Ledger_CIN_No ? obj.Sub_Ledger_CIN_No : "";
    this.ObjSubLedger.Sub_Ledger_EXID_NO = obj.Sub_Ledger_EXID_NO ? obj.Sub_Ledger_EXID_NO : "";

    // this.ObjSubLedger.Sub_Ledger_ID = obj.Sub_Ledger_ID;
  }
  GetCostCenter() {
    this.CostCenterList = [];
    this.$http.get(this.url.apiGetCostCenter).subscribe((data: any) => {
      this.CostCenterList = data ? JSON.parse(data) : [];
    });
  }
  CostCenterChange(CostCenID) {
    // this.ObjCostCenter.Cost_Cen_ID = undefined;
    const ObjCostCenter = this.CostCenterList.filter((el: any) => el.Cost_Cen_ID == CostCenID)[0];
    // this.ObjCostCenter = ObjCostCenter;
    this.ObjCostCenter.Cost_Cen_ID = ObjCostCenter.Cost_Cen_ID;
    this.ObjCostCenter.Cost_Cen_Name = ObjCostCenter.Cost_Cen_Name ? ObjCostCenter.Cost_Cen_Name : '';
    this.ObjCostCenter.Cost_Cen_Address1 = ObjCostCenter.Cost_Cen_Address1 ? ObjCostCenter.Cost_Cen_Address1 : '';
    this.ObjCostCenter.Cost_Cen_Address2 = ObjCostCenter.Cost_Cen_Address2 ? ObjCostCenter.Cost_Cen_Address2 : '';
    this.ObjCostCenter.Cost_Cen_Location = ObjCostCenter.Cost_Cen_Location ? ObjCostCenter.Cost_Cen_Location : '';
    this.ObjCostCenter.Cost_Cen_PIN = ObjCostCenter.Cost_Cen_PIN ? ObjCostCenter.Cost_Cen_PIN : '';
    this.ObjCostCenter.Cost_Cen_District = ObjCostCenter.Cost_Cen_District ? ObjCostCenter.Cost_Cen_District : '';
    this.ObjCostCenter.Cost_Cen_State = ObjCostCenter.Cost_Cen_State ? ObjCostCenter.Cost_Cen_State : '';
    this.ObjCostCenter.Cost_Cen_Country = ObjCostCenter.Cost_Cen_Country ? ObjCostCenter.Cost_Cen_Country : '';
    this.ObjCostCenter.Cost_Cen_Mobile = ObjCostCenter.Cost_Cen_Mobile ? ObjCostCenter.Cost_Cen_Mobile : '';
    this.ObjCostCenter.Cost_Cen_Phone = ObjCostCenter.Cost_Cen_Phone ? ObjCostCenter.Cost_Cen_Phone : '';
    this.ObjCostCenter.Cost_Cen_Email1 = ObjCostCenter.Cost_Cen_Email1 ? ObjCostCenter.Cost_Cen_Email1 : '';
    this.ObjCostCenter.Cost_Cen_VAT_CST = ObjCostCenter.Cost_Cen_VAT_CST ? ObjCostCenter.Cost_Cen_VAT_CST : '';
    this.ObjCostCenter.Cost_Cen_CST_NO = ObjCostCenter.Cost_Cen_CST_NO ? ObjCostCenter.Cost_Cen_CST_NO : '';
    this.ObjCostCenter.Cost_Cen_SRV_TAX_NO = ObjCostCenter.Cost_Cen_SRV_TAX_NO ? ObjCostCenter.Cost_Cen_SRV_TAX_NO : '';
    this.GetGodown();
  }
  GetState() {
    this.states = [];
    this.$http.get(this.url.apiGetState).subscribe((data: any) => {
      this.states = data;
    });
  }
  GetInwardType(){
    this.InwardTypeList = [];
    // this.$http.get("/Common/Get_INV_Txn_Type?Txn_Type=PURCHASE").subscribe((data: any) => {
    //   this.InwardTypeList = data ? JSON.parse(data) : [];
    // });
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_GRN",
      "Report_Name_String" : "Get_Inward_Type"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.InwardTypeList = data ;
    });
  }
  GetProduct(){
    this.ProductList = [];
    this.$http.get("/Common/Get_Product_Purchasable").subscribe((data: any) => {
      let prodata = JSON.parse(data);
      if(prodata.length){
        prodata.forEach(element => {
          element['value'] = element.Product_ID
          element['label'] = element.Product_Name
        });
      this.ProductList = prodata ;
      }
      else {
        this.ProductList = [] ;
      }
      
    });
  }
  ProductChange(proid){
    this.ObjProductInfo.Product_Name = '';
    this.Product_Serial = '';
    this.ObjProductInfo.UOM = '';
    this.ObjProductInfo.MRP = undefined;
    this.ObjProductInfo.Rate = undefined;
    this.ObjProductInfo.Amount = undefined;
      if(proid){
        const productobj = this.ProductList.filter((el: any) => el.Product_ID == proid)[0];
        // console.log(productobj)
        this.ObjProductInfo.Product_Name = productobj.Product_Name;
        this.Product_Serial = productobj.Product_Serial;
        this.ObjProductInfo.Qty = this.Product_Serial ? 1 : undefined;
        this.ObjProductInfo.UOM = productobj.UOM;
      }
  }
  CalCulateTotalAmt(){
    if(this.ObjProductInfo.Qty && this.ObjProductInfo.Rate){
      this.ObjProductInfo.Amount = Number((Number(this.ObjProductInfo.Qty) * Number(this.ObjProductInfo.Rate)).toFixed(2));
    }
  }
  GetGodown(){
    this.GodownList = [];
    if(this.ObjCostCenter.Cost_Cen_ID){
      this.$http.get("/Common/Get_Godown_list?Cost_Cent_ID="+this.ObjCostCenter.Cost_Cen_ID).subscribe((data: any) => {
      this.GodownList = JSON.parse(data);
      this.ObjProductInfo.godown_id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : '';
    });
    }
  }
  GetSerialNoStatus(): Promise<string> {
  this.SerialNostatus = '';
  return new Promise((resolve, reject) => {
    if (this.ObjCostCenter.Cost_Cen_ID) {
      this.$http.get("/Common/Check_Serial_without_cost_center?Serial_No=" + this.ObjProductInfo.Serial_No + "&Product_ID=" + this.ObjProductInfo.Product_ID, 
        { responseType: 'text' }).subscribe({
          next: (data: string) => {
            this.SerialNostatus = data;
            console.log(this.SerialNostatus)
            resolve(data);
          },
          error: err => {
            reject(err);
          }
      });
    } else {
      resolve(''); // or reject('No Cost Center ID');
    }
  });
  }
  async CheckSerialNo(): Promise<boolean> {
  try {
    const status = await this.GetSerialNoStatus();
    if (status === "NO") {
      return true;
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Serial Number Exist. "
      });
      return false;
    }
  } catch (err) {
    console.error("Error checking serial number:", err);
    return false;
  }
  }
  CheckSameProductSerialNoExit(){
    const sameproduct = this.AddProductDetails.filter(item=> (item.Product_ID === this.ObjProductInfo.Product_ID) && (item.Serial_No === this.ObjProductInfo.Serial_No));
    if(sameproduct.length) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Serial Number Exist."
      });
      return false;
    } 
    else {
      return true;
    }
  }
  async AddProductInfo(valid){
    this.ProductInfoSubmitted = true;
    var stockpoint = this.GodownList.filter(item=> Number(item.godown_id) === Number(this.ObjProductInfo.godown_id))
    if(valid && await this.CheckSerialNo() && this.CheckSameProductSerialNoExit()) {
    var productObj = {
      Product_ID : this.ObjProductInfo.Product_ID,
      Product_Name : this.ObjProductInfo.Product_Name,
      Batch_Number : this.ObjProductInfo.Batch_Number,
      Serial_No : this.ObjProductInfo.Serial_No,
      Qty : Number(this.ObjProductInfo.Qty),
      UOM : this.ObjProductInfo.UOM,
      MRP : Number(this.ObjProductInfo.MRP),
      Challan_Rate : Number(this.ObjProductInfo.Rate),
      Amount : Number(this.ObjProductInfo.Amount),
      godown_id : Number(this.ObjProductInfo.godown_id),
      godown_name : stockpoint.length ? stockpoint[0].godown_name : ''
  
    };
      this.AddProductDetails.push(productObj);
      // this.ObjProductInfo = new ProductInfo();
      this.ObjProductInfo.Product_ID = this.Product_Serial ? this.ObjProductInfo.Product_ID : undefined;
      this.ObjProductInfo.Batch_Number = undefined;
      this.ObjProductInfo.Serial_No = undefined;
      this.ObjProductInfo.Qty = this.Product_Serial ? 1 : undefined;
      this.ObjProductInfo.UOM = this.Product_Serial ? this.ObjProductInfo.UOM : undefined;
      this.ObjProductInfo.MRP = this.Product_Serial ? this.ObjProductInfo.MRP : undefined;;
      this.ObjProductInfo.Rate = this.Product_Serial ? this.ObjProductInfo.Rate : undefined;;
      this.ObjProductInfo.Amount = this.Product_Serial ? this.ObjProductInfo.Amount : undefined;;
      this.ObjProductInfo.godown_id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : '';
      this.ProductInfoSubmitted = false;
      this.GetTotalNetAmount();
    }
  }
  GetTotalNetAmount(){
    this.ObjOther.Bill_Gross_Amt = 0;
    this.ObjOther.Bill_Net_Amt = 0;
    var totalAmount = 0;
    this.AddProductDetails.forEach(item => {
      totalAmount = totalAmount + Number(item.Amount);
    });
    this.ObjOther.Bill_Gross_Amt = (totalAmount).toFixed(2);
    this.ObjOther.Bill_Net_Amt = (totalAmount).toFixed(2);
  }
  delete(index) {
    this.AddProductDetails.splice(index,1);
      this.GetTotalNetAmount();
  }
  DataForSavePurchaseGRN(){
    if(this.AddProductDetails.length) {
      this.ObjOther.Doc_No = this.editDocNo ? this.editDocNo : "A";
      this.ObjOther.Doc_Date = this.DateService.dateConvert(new Date(this.DocDate));
      this.ObjOther.CN_No = this.ObjOther.CN_No;
      this.ObjOther.CN_Date = (this.ObjOther.CN_No && this.cnnDate) ? this.DateService.dateConvert(new Date(this.cnnDate)) : null;
      this.ObjOther.Type_ID = Number(this.ObjOther.Type_ID);
      this.ObjOther.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ObjOther.Fin_Year_ID = Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID);
      this.ObjOther.L_element = this.AddProductDetails;
        let tempArr:any =[]
        tempArr.push({...this.ObjSubLedger,...this.ObjCostCenter,...this.ObjOther});
      //  console.log('save===',JSON.stringify(tempArr))
        return JSON.stringify(tempArr);
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
  SavePurchaseGRN(valid){
    this.PurchaseGrnFormSubmitted = true;
    if(valid){
      this.PurchaseGrnFormSubmitted = false;
      this.Spinner = true;
      const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_GRN",
      "Report_Name_String": "Create_Bl_Txn_Purchase_GRN",
      "Json_Param_String": this.DataForSavePurchaseGRN()
      }
      this.GlobalAPI.postData(obj).subscribe(async (data:any)=>{
        var tempID = data[0].Column1;
        this.Spinner = false;
      if(data[0].Column1){
        const message = this.buttonname === 'Create' ? "Create" : "Update";
        await this.SaveUserActivity(message,data[0].Column1);
        const mgs = this.buttonname === 'Create' ? "Created" : "Updated";
        this.Spinner = false;
        // this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "GRN  " + tempID,
         detail: "Succesfully " + mgs
       });
       if(this.editDocNo) {
        this.editDocNo = undefined;
        this.tabIndexToView = 0;
        this.items = [ 'BROWSE', 'CREATE'];
        this.buttonname = "Create";
       }
        this.clearData();
        this.getSerarch();
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
    else {
      this.Spinner = false;
    }
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseSearch.from_date = dateRangeObj[0];
      this.ObjBrowseSearch.to_date = dateRangeObj[1];
    }
  }
  getSerarch() {
    this.SearchGrnFormSubmitted = true;
    this.seachSpinner = true;
  const start = this.ObjBrowseSearch.from_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowseSearch.from_date))
  : this.DateService.dateConvert(new Date());
  const end = this.ObjBrowseSearch.to_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowseSearch.to_date))
  : this.DateService.dateConvert(new Date());
  const tempobj = {
   start_date : start,
   end_date : end,
   Cost_Cen_ID : this.ObjBrowseSearch.Cost_Cen_ID ? this.ObjBrowseSearch.Cost_Cen_ID : 0,
  }
  const obj = {
    "SP_String": "sp_Bl_Txn_Purchase_GRN",
    "Report_Name_String": "Get_Bl_Txn_Purchase_GRN",
    "Json_Param_String": JSON.stringify([tempobj])
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.getAllDataList = data.length ? data : [];
    this.BackupSearchedlist = data;
    this.getAllDataListHeaders = data.length ? Object.keys(data[0]) : [];
    this.GetDistinct();
    this.seachSpinner = false;
    this.SearchGrnFormSubmitted = false;
  })
  }
  // DISTINCT & FILTER
  GetDistinct() {
    let DSubLedger:any = [];
    let DInwardType:any = [];
    this.DistSubLedger =[];
    this.SelectedDistSubLedger =[];
    this.DistInwardType =[];
    this.SelectedInwardType =[];
    this.SearchFields =[];
    this.getAllDataList.forEach((item) => {
    if (DSubLedger.indexOf(item.Sub_Ledger_ID) === -1) {
     DSubLedger.push(item.Sub_Ledger_ID);
     this.DistSubLedger.push({ label: item.Sub_Ledger_Name, value: item.Sub_Ledger_ID });
    }
    if (DInwardType.indexOf(item.Type_ID) === -1) {
      DInwardType.push(item.Type_ID);
      this.DistInwardType.push({ label: item.Txn_Type, value: item.Type_ID });
      }
  });
     this.BackupSearchedlist = [...this.getAllDataList];
  }
  FilterDist() {
    let DSubLedger:any = [];
    let DInwardType:any = [];
    this.SearchFields =[];
  if (this.SelectedDistSubLedger.length) {
    this.SearchFields.push('Sub_Ledger_ID');
    DSubLedger = this.SelectedDistSubLedger;
  }
  if (this.SelectedInwardType.length) {
    this.SearchFields.push('Type_ID');
    DInwardType = this.SelectedInwardType;
  }
  this.getAllDataList = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupSearchedlist.filter(function (e) {
      return (DSubLedger.length ? DSubLedger.includes(e['Sub_Ledger_ID']) : true)
      && (DInwardType.length ? DInwardType.includes(e['Type_ID']) : true)
    });
  this.getAllDataList = LeadArr.length ? LeadArr : [];
  } else {
  this.getAllDataList = [...this.BackupSearchedlist] ;
  }
  }
  EditPurchaseGRN(docNo){
    this.clearData();
    if (docNo) {
      this.editDocNo = docNo;
      this.tabIndexToView = 1;
      this.items = [ 'BROWSE', 'UPDATE'];
      this.buttonname = "Update";
      this.geteditData(docNo);
    }
  }
  ViewPurchaseGRN(docNo){
    this.clearData();
    if (docNo) {
      this.tabIndexToView = 1;
      this.items = [ 'BROWSE', 'VIEW'];
      this.ViewButtonDisabled = true;
      this.geteditData(docNo);
    }
  }
  geteditData(Dno){
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_GRN",
      "Report_Name_String": "Bl_Txn_Purchase_GRN_Edit_Data",
      "Json_Param_String": JSON.stringify([{Doc_No : Dno}])
    }
    this.GlobalAPI.getData(obj).subscribe((res:any)=>{
      // console.log(res)
      let data = JSON.parse(res[0].Column1)
      this.ObjSubLedger.Sub_Ledger_ID = data[0].Sub_Ledger_ID;
      this.SubledgerChange(data[0].Sub_Ledger_ID);
      this.ObjCostCenter.Cost_Cen_ID = data[0].Cost_Cen_ID;
      this.CostCenterChange(data[0].Cost_Cen_ID);
      this.DocDate = new Date(data[0].Doc_Date);
      this.ObjOther.CN_No = data[0].CN_No;
      this.cnnDate =  data[0].CN_Date? new Date(data[0].CN_Date) : null;
      this.ObjOther.Type_ID = data[0].Type_ID;
      this.AddProductDetails = data[0].L_element;
      this.GetTotalNetAmount();
    })
  }
  CheckProEdit(val,index){
    const sendobj = {
      Serial_No: val.Serial_No,
			type_id: this.ObjOther.Type_ID,     
			Product_ID: val.Product_ID
    }
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_GRN",
      "Report_Name_String" : "check_other_transaction_with_sl_no",
      "Json_Param_String": JSON.stringify([sendobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log('CheckProEditStatus===',data)
      if(data[0].Column1 === "Can Be Possible to Edit"){
        this.delete(index);
      }
      else {
        this.compacctToast.clear();
        this.compacctToast.add({
          // key: "compacct-toast",
          // severity: "error",
          // summary: "Warn Message",
          // detail: data[0].Column1
          key: "di",
          sticky: true,
          severity: "warn",
          // summary: "Are you sure?",
          detail: "The Product ( " + val.Product_Name +" with "+ val.Serial_No +" ) Has been used in other document" + 
          "/ other transaction has been done. Can't change"  +
          "/ edit anything with this at GRN.",
        });
      }
    });
  }
  purchaseBillDelete(docNo) {
    if (docNo) {
      this.docNumber = docNo;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed",
      });
    }
  }
  onConfirm() {
    if (this.docNumber) {
      const sendobj = {
        Doc_No : this.docNumber,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID
      }
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_GRN",
        "Report_Name_String": "Delete_Bl_Txn_Purchase_GRN",
        "Json_Param_String": JSON.stringify([sendobj])
      }
      this.GlobalAPI.getData(obj).subscribe(async (data:any)=>{
          if (data[0].Column1 == "Done") {
            await this.SaveUserActivity('Delete',this.docNumber);
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              detail: "Succesfully Deleted",
            });
            this.docNumber = undefined;
            this.getSerarch();
          }
        });
    }
  }
  onReject() {
    this.compacctToast.clear("c");
    this.compacctToast.clear("di");
  }
  Print(DocNo) {
    if (DocNo) {
      if(DocNo){
       const url = `/Report/Crystal_Files/Finance/SaleBill/Purchase_GRN.html?Doc_No=${DocNo}`;
        window.open(url,"Print",  'fullscreen=yes, scrollbars=auto,width=950,height=500');
      
      }
    }
  }
  async SaveUserActivity(msg,docno){
    const result = await this._CommonUserActivity.GetUserActivity(msg,'Purchase GRN',docno,'0')
    console.log(result)
  }


}

class BrowseSearch {
  from_date: any;
  to_date: any;
  Cost_Cen_ID: any;
  Type_ID: any;
}
class SubLedger {
  Sub_Ledger_ID: any;
  Sub_Ledger_Name: any;
  Sub_Ledger_Billing_Name: any;
  Sub_Ledger_Email: any;
  Sub_Ledger_Mobile_No: any;
  Sub_Ledger_Address_1: any;
  Sub_Ledger_Land_Mark: any;
  Sub_Ledger_Pin: any;
  Sub_Ledger_District: any;
  Sub_Ledger_State: any;
  Sub_Ledger_Country: any;
  Sub_Ledger_PAN_No: any;
  Sub_Ledger_TIN_No: any;
  Sub_Ledger_CST_No: any;
  Sub_Ledger_SERV_REG_NO: any;
  Sub_Ledger_CIN_No: any;
  Sub_Ledger_EXID_NO: any;

  // Sub_Ledger_Mailing_Address_1: any;
  // Sub_Ledger_Address_2: any;
  // Sub_Ledger_Address_3: any;
  // Sub_Ledger_UID_NO: any;
  // Sub_Ledger_GST_No: any;
  // address_caption: any;
}
class CostCenter {
  Cost_Cen_ID: any;
  Cost_Cen_Name: any;
  Cost_Cen_Address1: any;
  Cost_Cen_Address2: any;
  Cost_Cen_Location: any;
  Cost_Cen_PIN: any;
  Cost_Cen_District: any;
  Cost_Cen_State: any;
  Cost_Cen_Country: any;
  Cost_Cen_Mobile: any;
  Cost_Cen_Phone: any;
  Cost_Cen_Email1: any;
  Cost_Cen_VAT_CST: any;
  Cost_Cen_CST_NO: any;
  Cost_Cen_SRV_TAX_NO: any;
  
  // Cost_Cen_GST_No: any;
}
class Other {
  Doc_No: any;
  Doc_Date: any;
  CN_No: any;
  CN_Date: any;
  Type_ID: any;
  User_ID: any;
  Fin_Year_ID: any;
  Bill_Gross_Amt: any;
  Bill_Net_Amt: any;
  L_element: any;
}
class ProductInfo {
  Product_ID: any;
  Product_Name: any;
  Batch_Number: any;
  Serial_No: any;
  Qty: any;
  UOM: any;
  Rate: any;
  MRP: any;
  Amount: any; 
  godown_id: any;
  godown_name: any;
}
