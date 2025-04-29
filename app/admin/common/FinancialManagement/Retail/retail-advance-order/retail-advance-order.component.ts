import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-retail-advance-order',
  templateUrl: './retail-advance-order.component.html',
  styleUrls: ['./retail-advance-order.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class RetailAdvanceOrderComponent implements OnInit {
  tabIndexToView: number = 0;
  HearingAdvanceFormseachSpinner: boolean = false;
  HearingAdvanceFormSubmitted: boolean = false;
  HearingAdvanceBillList: any = [];
  ObjSearch = new Search();
  AdvBillDocId: any = undefined;
  aspxFileName: any = undefined;

  items:any = [];
  CostCenterList: any =[];
  CostCenterListAll: any = [];
  SEarchFilter: any = [];

  DocDate: Date = new Date();
  AdvanceOrderFormSubmitted: boolean= false;
  CustomerList: any=[];

  ProductOrderFormSubmitted: boolean= false;
  ProductList: any=[];
  Expected_Delivery_Date: Date= new Date();
  mindate: any = new Date();
  addProductList: any=[];

  buttonname : any= "Create";
  Spinner: boolean=false;
  DOCNO: any=undefined;

  displayJournalPopup: boolean=false;
  JournalSpinner: boolean=false;
  JournalFormSubmitted: boolean=false;
  LedgerList: any=[];
  BankTRNtypeList: any=[];
  PaymentTypeList:any=[];
  BankDate: any= new Date();
  addJournalList: any=[];
  backupTotalAmount: number= 0; 
  JournalDateLabel: any='DATE';
  JournalNOLabel: any='NO.';
  Received: any=undefined;
  Due: any=undefined;
  Total: any=undefined;
  TotalReceived: number=0;
  backupCustomer: any= undefined;
  backupDOCNO: any= undefined; 
  backupFootFallID: any=undefined; 
  backup_patient_LedgerID:any=undefined;
  bakcup_patient_subLedgerID: any=undefined;
  backup_patient_subLedgerName: any=undefined;
  obj:any=[];
  EditDisabled: boolean= false;

  displayPaymentPopup: boolean=false;
  PaymentSpinner: boolean=false;
  PaymentFormSubmitted: boolean=false;
  BankPaymentDate: any = new Date();
  addPaymentList: any=[];
  backupPatient: any=undefined;
  backupPatientID: any=undefined;
  backup_patient_LedgerName: any=undefined;
  backup_Recv_VoucharNo: any=undefined;
  backupRecvAmount: any= undefined;
  backup_AO_No: any=undefined;

  objPayment= new Payment();
  objJournal= new Journal();
  objActivityLog = new ActivityLog();
  objProduct = new Product();
  objCommon = new Common();
  databaseName:any
  USER_IP:any;
  City:any;
  ISP:any;
  Lat:any;
  Lon:any;
  constructor(
    private $http: HttpClient,
    private GlobalAPI:CompacctGlobalApiService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Advance Order",
      Link: "Patient Management -> Transaction -> Advance Order"
    });
    this.objCommon.Cost_Cen_ID=this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.PaymentTypeList=[{"DATE": "Authorize Date", "MODE": "FINANCE", "NO": "Authorize No"},
      {"DATE": "Authorize Date", "MODE": "CARD", "NO": "Authorize No"},
      {"DATE": "NEFT Date", "MODE": "CASH", "NO": "NEFT No"},
      {"DATE": "Bank Transfer Date", "MODE": "BANK-TRANSFER", "NO": "Bank Transfer No"},
      {"DATE": "Cheque Date", "MODE": "CHEQUE", "NO": "Cheque No"},
      {"DATE": "NEFT Date", "MODE": "NEFT/RTGS", "NO": "NEFT No"},
      {"DATE": "Authorize Date", "MODE": "WALLET", "NO": "Authorize No"}
    ];    
    this.GetIpInfo();   
    this.Get_Patient_Subledger_ID();
    this.Get_Fin_Year_Date();
    this.Get_Allowed_Entry_Days();
    this.GetAllCostCenter();
    this.GetCustomerList();
    this.GetProductList();
    this.GetaspxFileName();
    this.DataBaseCheck()
  }

  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.clearData();
    this.buttonname = "Create";
  }

  clearData(){
    this.objActivityLog = new ActivityLog();
    this.objProduct = new Product();
    this.objCommon = new Common();

    this.HearingAdvanceFormseachSpinner=false;
    this.HearingAdvanceFormSubmitted=false;
    this.AdvBillDocId=undefined;

    this.DocDate=new Date();
    this.AdvanceOrderFormSubmitted=false;

    this.ProductOrderFormSubmitted=false;
    this.Expected_Delivery_Date= new Date();
    this.mindate= new Date();
    this.addProductList= [];

    this.Spinner= false;
    this.DOCNO= undefined;

    this.displayJournalPopup=false;
    this.EditDisabled=false;
    this.objJournal= new Journal();
    this.JournalSpinner=false;
    this.JournalFormSubmitted=false;
    this.BankDate= new Date();
    this.addJournalList=[];
    this.JournalDateLabel='DATE';
    this.JournalNOLabel='NO.';
  }

  DataBaseCheck() {
    this.$http.get("/Common/Get_Database_Name",
        {responseType: 'text'})
        .subscribe((data: any) => {
          this.databaseName = data;
          //console.log(data) BSHPL
        });
        //this.databaseName = 'BSHPL'
  }


  Get_Patient_Subledger_ID(){
    this.$http
      .get("/Common/Get_Patient_Subledger_ID")
      .subscribe((data: any) => {
        const temp = data ? JSON.parse(data) : [];
        //console.log("Get_Patient_Subledger_ID",temp);
        this.bakcup_patient_subLedgerID=temp[0].Sub_Ledger_ID;
        this.backup_patient_LedgerID=temp[0].Ledger_ID

        this.Get_SubLedger_DR_without_Salesman(this.bakcup_patient_subLedgerID);
        this.Get_Master_Accounting_Ledger(this.backup_patient_LedgerID);
      });
  }

  Get_SubLedger_DR_without_Salesman(bakcup_patient_subLedgerID:any){
    this.$http
      .get("/Common/Get_SubLedger_DR_without_Salesman")
      .subscribe((data: any) => {
        const temp = data ? JSON.parse(data) : [];
        //console.log("Get_SubLedger_DR_without_Salesman",temp);

        const tempFilter = temp.filter((el:any)=> Number(el.Sub_Ledger_ID) === Number(bakcup_patient_subLedgerID));
        this.backup_patient_subLedgerName=tempFilter[0].Sub_Ledger_Name;
      });
  }

  Get_Fin_Year_Date(){
    const QueryStr = 'Fin_Year_ID='+Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      this.$http
      .get("Common/Get_Fin_Year_Date?"+QueryStr)
      .subscribe((data: any) => {
        const temp = data ? JSON.parse(data) : [];
        //console.log("Get_Fin_Year_Date",temp);
      }); 
  }

  Get_Allowed_Entry_Days(){
    const QueryStr = 'User_ID='+Number(this.$CompacctAPI.CompacctCookies.User_ID)
      this.$http
      .get("/Common/Get_Allowed_Entry_Days?"+QueryStr)
      .subscribe((data: any) => {
        const temp = data ? JSON.parse(data) : [];
        //console.log("Get_Allowed_Entry_Days",temp);
      }); 
  }

  GetAllCostCenter() {
    this.$http
      .get("/Common/Get_Cost_Center")
      .subscribe((data: any) => {
        const temp = data ? JSON.parse(data) : [];
        this.CostCenterListAll = temp;
        //console.log("this.CostCenterListAll",this.CostCenterListAll);
        temp.forEach(obj=>{
          obj['label'] = obj.Cost_Cen_Name;
          obj['value'] = obj.Cost_Cen_ID;
        });
        if(this.$CompacctAPI.CompacctCookies.User_Type === 'U') {
          this.CostCenterList = temp.filter(obj=> obj.Cost_Cen_ID == this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
        }else {
          this.CostCenterList = temp;
        }
        this.ObjSearch.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      });
  }

  GetCustomerList() {
    this.$http
      .get("/Hearing_CRM_Lead/Get_All_Patient_Lead")
      .subscribe((data: any) => {
        const temp = data ? JSON.parse(data) : [];
        //console.log("CustomerList",temp);
        if(temp.length) {
          temp.forEach(element => {
            element['label'] = element.Lead_Details,
            element['value'] = element.Foot_Fall_ID
          });
          this.CustomerList = temp;
        }
        else {
            this.CustomerList = [];
        }
      });
  }

  GetProductList() {
    this.$http
      .get("/Common/Get_Product_Salable")
      .subscribe((data: any) => {
        const temp = data ? JSON.parse(data) : [];
        //console.log("ProductList",temp);
        if(temp.length) {
          temp.forEach(element => {
            element['label'] = element.Product_Name,
            element['value'] = element.Product_ID
          });
          this.ProductList = temp;
        }
        else {
            this.ProductList = [];
        }
      });
  }

  getCustomerDetails(){
    this.objCommon.Address=undefined;
    this.objCommon.Remarks=undefined;
    if(this.objCommon.FOOT_Fall_ID){
      const QueryStr = 'FootFallID='+Number(this.objCommon.FOOT_Fall_ID)
      this.$http
      .get("/Hearing_CRM_Lead/Get_CRM_One_Lead_Hearing?"+QueryStr)
      .subscribe((data: any) => {
        const temp = data ? JSON.parse(data) : [];
        //console.log("getCustomerDetails",temp);
        this.objCommon.Address=temp[0].Address+" "+temp[0].District+" "+temp[0].State+" "+temp[0].Pin;
        this.objCommon.Location= temp[0].Location;
        this.objCommon.Remarks=temp[0].Remarks;

        this.backupCustomer=temp[0].Contact_Name;
        //console.log('this.backupCustomer',this.backupCustomer);
      });
    }
  }

  getProductDetails(){
    let Product_ID= this.objProduct.Product_ID;
    this.objProduct = new Product();
    this.objProduct.Product_ID = Product_ID;
    this.Expected_Delivery_Date= new Date();

    if(this.objProduct.Product_ID){
      const tempFilter = this.ProductList.filter((el:any)=> Number(el.Product_ID) === Number(this.objProduct.Product_ID));

      this.objProduct.Product_Specification= tempFilter[0].Product_Spec;
      this.objProduct.UOM= tempFilter[0].UOM;
      this.objProduct.Rate= Number(tempFilter[0].MRP);
    }
    

  }

  getCostCenterName(id){
    return id ? this.CostCenterListAll.filter(obj=> obj.Cost_Cen_ID == id)[0].Cost_Cen_Name : '-'
  }
  
  GetaspxFileName() {
    this.$http
      .get("/Hearing_Advance_Order/Get_Advance_Order_Aspx")
      .subscribe((data: any) => {
        //console.log('GetaspxFileName',data);
        this.aspxFileName = data;
      });
  }

  getDateRange1(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearch.from_date = dateRangeObj[0];
      this.ObjSearch.to_date = dateRangeObj[1];
    }
  }

  Search(valid) {
      this.HearingAdvanceBillList = [];
      this.HearingAdvanceFormSubmitted = true;
    if (valid) {
        this.HearingAdvanceFormseachSpinner = true;
        this.ObjSearch.from_date = this.ObjSearch.from_date
        ? this.DateService.dateConvert(new Date(this.ObjSearch.from_date))
        : this.DateService.dateConvert(new Date());
        this.ObjSearch.to_date = this.ObjSearch.to_date
        ? this.DateService.dateConvert(new Date(this.ObjSearch.to_date))
        : this.DateService.dateConvert(new Date());
        this.ObjSearch.Cost_Cen_ID = this.ObjSearch.Cost_Cen_ID ? this.ObjSearch.Cost_Cen_ID : '0';
        const QueryStr = Object.entries(this.ObjSearch).map(([key, val]) => `${key}=${val}`).join('&');
        //console.log('QueryStr',QueryStr);
      
      this.$http
      .get("/Hearing_Advance_Order_V2/Get_All_Data?"+QueryStr)
      .subscribe((data: any) => {
        const temp = data ? JSON.parse(data) : [];
        //console.log('Search Data',temp);
          this.HearingAdvanceBillList =   temp;
          this.HearingAdvanceFormSubmitted = false;
          this.HearingAdvanceFormseachSpinner = false;
          if (this.HearingAdvanceBillList.length) {
            this.SEarchFilter = Object.keys(this.HearingAdvanceBillList[0]);
            //console.log('SEarchFilter=====',this.SEarchFilter);
          }
      });
    }
  }

  GetTotal(arr,field) {
    return arr.reduce((n,obj) => n + Number(obj[field]), 0).toFixed(2)
  }

  PdfPrint (obj) {
    if (obj) {
      window.open('Report/Crystal_Files/Finance/SaleBill/' + this.aspxFileName + '?Doc_No=' + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }

  onReject() {
    this.compacctToast.clear("c");
  }

  DeleteAdvanceBill(docID){
    this.AdvBillDocId = undefined;
    if(docID){
      this.AdvBillDocId = docID;
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

  DelteBill() {
  if (this.AdvBillDocId) {
    this.$http
      .post('/Hearing_Advance_Order/Delete', { id: this.AdvBillDocId })
      .subscribe((data: any) => {
        if (data.success === true) {
          
          this.Search(true);
          this.onReject();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'Doc ID : ' + this.AdvBillDocId,
            detail: "Succesfully Deleted"
          });
        }
      });
  }
  }

  ProductCalculation(){
    if(this.objProduct.Product_ID){
      this.objProduct.Qty= this.objProduct.Qty ? Number(this.objProduct.Qty): 0;
      this.objProduct.Discount= this.objProduct.Discount ? Number(this.objProduct.Discount) : 0;
      this.objProduct.Rate= this.objProduct.Rate ? Number(this.objProduct.Rate) : 0;

      this.objProduct.Amount=Number(Number(this.objProduct.Qty)*Number(this.objProduct.Rate)-Number(this.objProduct.Discount)).toFixed(2);
    }
  }

  addProductDetalis(valid:any){
    this.ProductOrderFormSubmitted=true;
    if(valid){
      if(!this.objProduct.Qty){
        this.ProductOrderFormSubmitted = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Quatity ",
          detail:"Quantity can't be Zero "
        });
        return
      }
      if(!this.objProduct.Rate && this.databaseName !=='GN_Anand_Chandigarh'){
        this.ProductOrderFormSubmitted = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Rate ",
          detail:"Rate can't be Zero "
        });
        return
      }

      const SameProductFilter = this.addProductList.filter((el:any)=> (el.Product_ID) == this.objProduct.Product_ID);
      if(SameProductFilter.length){ 
        this.ProductOrderFormSubmitted = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "You Can't choose same Product Name ",
          detail:" "
        });
        return

      }

      const tempFilter = this.ProductList.filter((el:any)=> Number(el.Product_ID) === Number(this.objProduct.Product_ID));

      this.objProduct.Expected_Delivery_Date=this.DateService.dateConvert(this.Expected_Delivery_Date);
      this.objProduct.Product_Name= tempFilter[0].Product_Name;
      this.objProduct.Tax_Amount=0;
      this.objProduct.Tax_Rate=0;

      this.addProductList.push(this.objProduct);
      //console.log('addProductList',this.addProductList);
      this.objProduct = new Product();
      this.Expected_Delivery_Date = new Date();
      this.ProductOrderFormSubmitted=false;
    }
  }

  DeleteProduct(index:any){
    this.addProductList.splice(index, 1);
  }

  calTotal(){
    let totalAmount  = 0;
    this.addProductList.forEach((ele:any) =>{
      totalAmount += Number(ele.Amount);
    })
    this.backupTotalAmount=totalAmount;
    return Number(totalAmount).toFixed(2);
  }

  SaveData(valid: any){
    this.AdvanceOrderFormSubmitted=true;
    //console.log('AdvanceOrderFormSubmitted',valid);
    if(valid){
      if(!this.addProductList.length){
        this.AdvanceOrderFormSubmitted = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Required ",
          detail:"Select atleast one product "
        });
        return
      }

      this.Spinner = true;
      this.objCommon.Doc_Date=this.DateService.dateConvert(this.DocDate);
      this.objCommon.Sales_Man_ID=null;
      this.objCommon.Customer_Order_No=null;
      this.objCommon.Customer_Order_Date=null;
      this.objCommon.Quote_Doc_No=null;
      this.objCommon.Dispenser=null;
      this.objCommon.Audiologist=null;
      this.objCommon.Currency_ID=Number(this.$CompacctAPI.CompacctCookies.Currency_ID);
      this.objCommon.User_ID=Number(this.$CompacctAPI.CompacctCookies.User_ID);
      this.objCommon.Entry_Date=this.DateService.dateTimeConvert(new Date());
      this.objCommon.Fin_Year_ID=Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID);
      this.objCommon.Sub_Ledger_ID=this.bakcup_patient_subLedgerID;
      //console.log('this.objCommon',this.objCommon);

      let objCommon: any = this.objCommon;
      let saveData: any = [];
      this.addProductList.forEach((ele: any) => {
        saveData.push({ ...objCommon, ...ele });
      });
      //console.log('objsaveData', saveData);

      this.$http
      .post('/Hearing_Advance_Order/Insert_Advance_Order', {"Advance_Order_String": JSON.stringify(saveData) })
      .subscribe((data: any) => {
        //console.log('save data',data);
        if (data.success){
          if(!this.DOCNO){
            this.backupDOCNO=data.Doc_No;
            this.backupFootFallID=this.objCommon.FOOT_Fall_ID;
          }
          this.Create_User_Activity_Log(data.Doc_No);
        }
        else {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail:"Error occured "
          });
        }
      });
    }
  }
  GetIpInfo() {
    this.USER_IP = undefined;
    this.City = undefined;
    this.ISP = undefined;
    this.Lat = undefined;
    this.Lon = undefined;
    this.$http.get("http://ip-api.com/json").subscribe((data: any) => {
      if(data){
        // this.objActivityLog.Activity_Date = this.DateService.dateTimeConvert(new Date());
        // this.objActivityLog.USER_ID = this.$CompacctAPI.CompacctCookies.User_ID;
        this.USER_IP = data.query;
        this.City = data.city;
        // this.objActivityLog.Country = data.country;
        this.ISP = data.isp;
        this.Lat = data.lat;
        this.Lon = data.lon;
        // this.objActivityLog.Region_Name = data.regionName;
      }
    });
  }
  Create_User_Activity_Log(Doc_No){
    //console.log('Doc_No',Doc_No);
    this.objActivityLog.DOC_NO=Doc_No;
    this.objActivityLog.Activity_Type= this.DOCNO ? "Updated" : "Create" ;
    this.objActivityLog.Region_Name= this.$CompacctAPI.CompacctCookies.State;
    this.objActivityLog.Country=this.$CompacctAPI.CompacctCookies.Country;
    this.objActivityLog.USER_ID= Number(this.$CompacctAPI.CompacctCookies.User_ID);
    this.objActivityLog.Activity_Date=this.DateService.dateTimeConvert(new Date());
    this.objActivityLog.USER_IP = this.USER_IP;
    this.objActivityLog.City = this.City;
    this.objActivityLog.ISP = this.ISP;
    this.objActivityLog.Lat = this.Lat;
    this.objActivityLog.Lon = this.Lon;
    //console.log('this.objActivityLog',this.objActivityLog);

    this.$http
      .post('/Common/Create_User_Activity_Log_Ajax', this.objActivityLog)
      .subscribe((data: any) => {
        //console.log('save ActivityLog data',data);
        let msg='';
        msg = this.DOCNO ? 'Updated' : 'Save';

        if (data.success) {
          this.clearData();
          this.Search(true);
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          this.buttonname = "Create";
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Advance Order",
            detail: "Succesfully "+msg
            });
          if(msg == 'Save'){
            this.displayJournalPopup=true;
            this.objJournal.Amount=this.backupTotalAmount.toFixed(2);
            this.journalCal(0);
            this.Get_Notification();
          }
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
      });
  }

  Get_Notification(){
    if(this.$CompacctAPI.CompacctCookies.User_ID){
      const QueryStr = 'user_id='+Number(this.$CompacctAPI.CompacctCookies.User_ID);
      this.$http
      .get("/Common/Get_Notification?"+QueryStr)
      .subscribe((data: any) => {
        const temp = data ? JSON.parse(data) : [];
        //console.log("Get_Notification",temp);
      });
    }
  }

  Get_Master_Accounting_Ledger(backup_patient_LedgerID:any){
    this.$http
    .get("/Common/Get_Master_Accounting_Ledger")
    .subscribe((data: any) => {
      const temp = data ? JSON.parse(data) : [];
      //console.log("Get_Master_Accounting_Ledger",temp);

      const tempLedgerFilter = temp.filter((el:any)=> Number(el.Ledger_ID) === Number(backup_patient_LedgerID));
        this.backup_patient_LedgerName=tempLedgerFilter[0].Ledger_Name;

      const LedgerListFilter = temp.filter((el:any)=> (el.Accounting_Group_ID == 14) || (el.Ledger_ID==571) );
      //console.log('LedgerListFilter',LedgerListFilter);

      LedgerListFilter.forEach((ele: any) => {
        this.LedgerList.push({value: ele.Ledger_ID, label: ele.Ledger_Name});
      });
      //console.log('this.LedgerList',this.LedgerList);

    });
  }

  SelectLedger(Ledger:any){
    this.BankTRNtypeList=[];
    this.objJournal.TRN=undefined;
    
    this.JournalDateLabel='DATE';
    this.JournalNOLabel='NO.';
    this.BankDate=this.objJournal.TRN=='CASH' ? null : new Date();
    this.objJournal.BankDate=undefined;
    this.objJournal.No=undefined;
    this.objJournal.Bank_Name=undefined;
    this.objJournal.Bank_Branch_Name=undefined;

    this.objPayment.TRN=undefined;
    this.BankPaymentDate=this.objJournal.TRN=='CASH' ? null : new Date();
    this.objPayment.BankDate=undefined;
    this.objPayment.No=undefined;
    this.objPayment.Bank_Name=undefined;
    this.objPayment.Bank_Branch_Name=undefined;

    if(Ledger){
      const QueryStr = 'ledger_id='+Number(Ledger)
      this.$http
      .get("/Common/Get_Bank_Txn_Type?"+QueryStr)
      .subscribe((data: any) => {
        const temp = data ? JSON.parse(data) : [];
        //console.log("Get_Bank_Txn_Type",temp);

        temp.forEach((ele: any) => {
          this.BankTRNtypeList.push(ele.Txn_Type_Name);
        });
        //console.log('this.BankTRNtypeList',this.BankTRNtypeList);
      });
    }

  }

  SelectBankTRNtype(TRNtype: any){
    this.JournalDateLabel='DATE';
    this.JournalNOLabel='NO.';
    this.BankDate=this.objJournal.TRN=='CASH' ? null : new Date();
    this.objJournal.BankDate=undefined;
    this.objJournal.No=undefined;
    this.objJournal.Bank_Name=undefined;
    this.objJournal.Bank_Branch_Name=undefined;

    this.BankPaymentDate=this.objPayment.TRN=='CASH' ? null : new Date();
    this.objPayment.BankDate=undefined;
    this.objPayment.No=undefined;
    this.objPayment.Bank_Name=undefined;
    this.objPayment.Bank_Branch_Name=undefined;

    const TRNtypeFilter = this.PaymentTypeList.filter((el:any)=> (el.MODE) == TRNtype);
    //console.log('TRNtypeFilter',TRNtypeFilter);

    TRNtypeFilter.forEach((ele: any) => {
      this.JournalDateLabel=ele.DATE;
      this.JournalNOLabel=ele.NO;
    });

    //console.log('this.JournalDateLabel',this.JournalDateLabel);
    //console.log('this.JournalNOLabel',this.JournalNOLabel);
  }

  journalCal(Received_value){
    this.Received= Number(Received_value).toFixed(2); 
    this.Total=Number(this.backupTotalAmount).toFixed(2);
    this.Due=Number(Number(this.Total)-Number(this.Received)).toFixed(2); 
    //console.log('this.Received',this.Received);
    //console.log('this.Total',this.Total);
    //console.log('this.Due',this.Due);
  }

  addJournalDetalis(valid:any){
    this.JournalFormSubmitted=true;
    //console.log('JournalFormSubmitted',valid);
    if(valid){
      if(!this.objJournal.Amount){ 
        this.JournalFormSubmitted = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Amount can't be zero ",
          detail:" "
        });
        return
      }

      if(Number(this.objJournal.Amount)>Number(this.Due)){ 
        this.JournalFormSubmitted = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Received Amount Exceed ",
          detail:" "
        });
        return
      }

      const SameLedgerFilter = this.addJournalList.filter((el:any)=> (el.Ledger) == this.objJournal.Ledger);
      //console.log('SameLedgerFilter',SameLedgerFilter);

      if(SameLedgerFilter.length){ 
        this.JournalFormSubmitted = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "You Can't choose same Ledger Name ",
          detail:" "
        });
        return
      }

      this.TotalReceived = this.TotalReceived + Number(this.objJournal.Amount); 
      //console.log('TotalReceived',this.TotalReceived);
      this.journalCal(this.TotalReceived);
      
      this.objJournal.BankDate=this.DateService.dateConvert(this.BankDate);
      this.addJournalList.push(this.objJournal);
      //console.log('addJournalList',this.addJournalList);
      this.objJournal = new Journal();
      this.BankTRNtypeList=[];
      this.objJournal.Amount= Number(0).toFixed(2);
      this.BankDate = new Date();
      this.JournalFormSubmitted=false;
    }
  }

  DeleteJournal(index){
    this.addJournalList.splice(index, 1);
  }

  PrintJournal(){
    //console.log('this.backupDOCNO',this.backupDOCNO);
    window.open('Report/Crystal_Files/Finance/SaleBill/' + this.aspxFileName + '?Doc_No=' + this.backupDOCNO, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }

  getLedgerName(id){
    return id ? this.LedgerList.filter(obj=> obj.value == id)[0].label : '-'
  }

  SaveJournal(){
    //console.log('this.backupTotalAmount',this.backupTotalAmount);
    if(this.backupTotalAmount){
      
      if(!this.addJournalList.length){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Required ",
          detail:"add atleast one payment amount "
        });
        return
      }

      //console.log('this.addJournalList',this.addJournalList);

      this.addJournalList.forEach((ele:any) =>{
        this.obj=[];
        this.SaveJournalPart(ele);
      });

    }
  }

  SaveJournalPart(ele){
    let TempDR={
      DR_Amt: Number(ele.Amount),
      Cheque_Date: ele.BankDate,
      Ledger_ID: Number(ele.Ledger),
      Bank_Txn_Type: ele.TRN,

      Voucher_Date: this.DateService.dateConvert(new Date()),
      Fin_Year_ID: Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID),
      Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Cost_Cen_ID_Trn: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Posted_On: this.DateService.dateTimeConvert(new Date()),
      User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
      Prev_doc_no: this.backupDOCNO,
      Foot_Fall_ID: Number(this.backupFootFallID),
      To_Voucher_No: this.backupDOCNO,
      To_Voucher_Date: this.DateService.dateConvert(new Date()),
      Adjustment_Doc_No: this.backupDOCNO,

      Voucher_Type_ID: 1,
      Reconsil_Date: "1/Jan/1900",
      Reconsil_Tag: "N",
      Naration: "",
      Project_ID: 0,
      Auto_Posted: "N",
      Status: "A",
      Sub_Ledger_ID: 0,
      Is_Topper: "Y",
      To_Voucher_Type: 5,
      CR_Amt: 0
    };

    let TempCR={
      CR_Amt: Number(ele.Amount),
      Cheque_Date: ele.BankDate,

      Ledger_ID: Number(this.backup_patient_LedgerID),
      Sub_Ledger_ID: Number(this.bakcup_patient_subLedgerID),
      Sub_Ledger_Name: this.backup_patient_subLedgerName,
      Voucher_Date: this.DateService.dateConvert(new Date()),
      Fin_Year_ID: Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID),
      Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Cost_Cen_ID_Trn: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Posted_On: this.DateService.dateTimeConvert(new Date()),
      User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
      Prev_doc_no: this.backupDOCNO,
      Foot_Fall_ID: Number(this.backupFootFallID),

      Is_Topper: "N",
      To_Voucher_No: "",
      Voucher_Type_ID: 1,
      Reconsil_Date: "1/Jan/1900",
      Reconsil_Tag: "N",
      Naration: "",
      Project_ID: 0,
      Auto_Posted: "N",
      Status: "A",
      DR_Amt: 0
    };

    this.obj=[TempDR,TempCR];
    //console.log('this.obj',this.obj);
    //console.log('ele',ele)
    this.JournalSpinner = true;

    this.$http
      .post('/Retail_ACC_Txn_Acc_Journal/Create_ACC_Txn_Acc_Journal_Ajax_for_vouchers', this.obj)
      .subscribe((data: any) => {
        //console.log('save Create_ACC_Txn_Acc_Journal_Ajax_for_vouchers data',data);
        
        if (data.success) {
          this.Search(true);
          this.EditDisabled=true;
          this.JournalSpinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Receive Journal",
            detail: "Succesfully Save"
          });
        }
        else{
          this.JournalSpinner = false;
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

  EditAdvOrd(col:any){
    this.DOCNO = undefined;
    if(col.Doc_No){
      this.DOCNO = col.Doc_No;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.GetEditAdvOrd(this.DOCNO);
    }
  }

  GetEditAdvOrd(DOCNO:any){
    const obj = {
      "SP_String": "SP_Bl_Txn_AO_Order",
      "Report_Name_String":"Retrieve_Bl_Txn_AO_Order",
      "Json_Param_String": JSON.stringify([{ DOC_No : DOCNO}]) 
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log("GetEditAdvOrd",data);
      
      if(data[0]){
        this.DocDate=new Date(data[0].Doc_Date);

        this.objCommon.Doc_No=data[0].Doc_No;
        this.objCommon.Sales_Man_ID=data[0].Sales_Man_ID;
        this.objCommon.Cost_Cen_ID=data[0].Cost_Cen_ID;
        this.objCommon.Sub_Ledger_ID=data[0].Sub_Ledger_ID;
        this.objCommon.Customer_Order_No=data[0].Customer_Order_No;
        this.objCommon.Customer_Order_Date=data[0].Customer_Order_Date;
        this.objCommon.Remarks=data[0].Remarks;
        this.objCommon.Currency_ID=data[0].Currency_ID;
        this.objCommon.User_ID=data[0].User_ID;
        this.objCommon.Entry_Date=data[0].Entry_Date;
        this.objCommon.Fin_Year_ID=data[0].Fin_Year_ID;
        this.objCommon.Quote_Doc_No=data[0].Quote_Doc_No;
        this.objCommon.Location=data[0].Location;
        this.objCommon.Address=data[0].Address;
        this.objCommon.FOOT_Fall_ID=data[0].FOOT_Fall_ID;
        this.objCommon.Dispenser=data[0].Dispenser;
        this.objCommon.Audiologist=data[0].Audiologist;
        //console.log('this.objCommon',this.objCommon);
      }

      if(data.length){
        data.forEach((ele:any) =>{
          this.addProductList.push({
            Product_ID: ele.Product_ID,
            Product_Name: ele.Product_Name, 
            Product_Specification: ele.Product_Specification,
            Expected_Delivery_Date: this.DateService.dateConvert(ele.Expected_Delivery_Date),
            Qty: ele.Qty,
            UOM: ele.UOM,
            Rate: ele.Rate,
            Discount: ele.Discount,
            Amount: ele.Amount,
            Tax_Rate: ele.Tax_Rate,
            Tax_Amount: ele.Tax_Amount
          });
        });
        //console.log('this.addProductList',this.addProductList);
      }

    });
  }

  closeJournalPopup(){
    this.displayJournalPopup=false;
    this.objJournal= new Journal();
    this.EditDisabled=false;
    this.JournalSpinner=false;
    this.JournalFormSubmitted=false;
    this.BankDate=new Date();
    this.addJournalList=[];
    this.backupTotalAmount=0;
    this.JournalDateLabel='DATE';
    this.JournalNOLabel='NO.';
    this.Received=undefined;
    this.Due=undefined;
    this.Total=undefined;
    this.TotalReceived=0;
    this.backupCustomer= undefined;
    this.backupDOCNO= undefined; 
    this.backupFootFallID=undefined; 
    this.obj=[];
    this.BankTRNtypeList=[];
  }

  ReturnAdvOrd(col:any){
    if(col){
      this.displayPaymentPopup=true;
      this.backupRecvAmount=Number(col.total_DR_Amt)-Number(col.Payment_Amount);
      this.objPayment.Amount=Number(this.backupRecvAmount).toFixed(2);
      this.backupPatient=col.Contact_Name;
      this.backupPatientID=col.FOOT_Fall_ID;
      this.backup_Recv_VoucharNo=col.Received_Doc_NO;
      this.backup_AO_No=col.Doc_No;
    }
  }

  closePaymentPopup(){
    this.displayPaymentPopup=false;

    this.PaymentSpinner=false;
    this.PaymentFormSubmitted=false;
    this.BankPaymentDate= new Date();
    this.addPaymentList=[];
    this.backupPatient=undefined;
    this.backupPatientID=undefined;
    this.backup_Recv_VoucharNo=undefined;
    this.backupRecvAmount= undefined;
    this.backup_AO_No=undefined;

    this.objPayment= new Payment();
    this.objActivityLog= new ActivityLog();

    this.JournalDateLabel='DATE';
    this.JournalNOLabel='NO.';
    this.BankTRNtypeList=[];
  }

  addPaymentDetalis(valid:any){
    this.PaymentFormSubmitted=true;
    //console.log('PaymentFormSubmitted',valid);
    if(valid){
      if(!(this.backupRecvAmount>=this.objPayment.Amount)){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Amount Exceeds ",
          detail:"Return Amount can't be greater than Receive Amount "
        });
        return
      }
      this.objPayment.BankDate=this.DateService.dateConvert(this.BankPaymentDate);
      this.addPaymentList.push(this.objPayment);
      //console.log('addPaymentList',this.addPaymentList);
      this.objPayment = new Payment();
      this.BankTRNtypeList=[];
      this.BankPaymentDate = new Date();
      this.PaymentFormSubmitted=false;
    }
  }

  DeletePayment(index){
    this.addPaymentList.splice(index, 1);
    this.objPayment.Amount=Number(this.backupRecvAmount).toFixed(2);
  }

  SavePayment(){
    if(!this.addPaymentList.length){
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Required ",
        detail:"add atleast one payment amount "
      });
      return
    }

    //console.log('this.addPaymentList',this.addPaymentList);

    let PaymentTempDR={
      CR_Amt: Number(this.addPaymentList[0].Amount),
      Cheque_Date: this.addPaymentList[0].BankDate,
      Ledger_ID: Number(this.addPaymentList[0].Ledger),
      Bank_Txn_Type: this.addPaymentList[0].TRN,
      Naration: this.addPaymentList[0].Naration,

      Voucher_Date: this.DateService.dateConvert(new Date()),
      Fin_Year_ID: Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID),
      Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Cost_Cen_ID_Trn: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Posted_On: this.DateService.dateTimeConvert(new Date()),
      User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
      Foot_Fall_ID: Number(this.backupPatientID),

      Cost_Head_ID: 0,
      Voucher_Type_ID: 2,
      Reconsil_Date: "1/Jan/1900",
      Reconsil_Tag: "N",
      Auto_Posted: "N",
      Status: "A",
      Sub_Ledger_ID: 0,
      Is_Topper: "Y",
      DR_Amt: 0
    };

    let PaymentTempCR={
      DR_Amt: Number(this.addPaymentList[0].Amount),
      Cheque_Date: this.addPaymentList[0].BankDate,
      Naration: this.addPaymentList[0].Naration,

      Ledger_ID: Number(this.backup_patient_LedgerID),
      Sub_Ledger_ID: Number(this.bakcup_patient_subLedgerID),
      Sub_Ledger_Name: this.backup_patient_subLedgerName,
      Ledger_Name: this.backup_patient_LedgerName,
      Voucher_Date: this.DateService.dateConvert(new Date()),
      Fin_Year_ID: Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID),
      Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Cost_Cen_ID_Trn: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Posted_On: this.DateService.dateTimeConvert(new Date()),
      User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
      Foot_Fall_ID: Number(this.backupPatientID),
      To_Voucher_No: this.backup_Recv_VoucharNo,
      Adjustment_Doc_No: this.backup_Recv_VoucharNo,
      To_Voucher_Type: 1,

      Cost_Head_ID: 0,
      Is_Topper: "N",
      Voucher_Type_ID: 2,
      Reconsil_Date: "1/Jan/1900",
      Reconsil_Tag: "N",
      Auto_Posted: "N",
      Status: "A",
      CR_Amt: 0
    };

    let Paymentobj:any=[];
    Paymentobj=[PaymentTempDR,PaymentTempCR];
    //console.log('Paymentobj',Paymentobj);

    this.PaymentSpinner = true;
    this.$http
      .post('/Retail_ACC_Txn_Acc_Journal/Create_ACC_Txn_Acc_Journal_Ajax_for_vouchers', Paymentobj)
      .subscribe((data: any) => {
        //console.log('save Create_ACC_Txn_Acc_Journal_Ajax_for_vouchers data',data);

        if (data.success){
          this.Create_User_Activity_Log_Ajax(data.Voucher_No);
        }
        else {
          this.PaymentSpinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail:"Error occured "
          });
        }

      });
  }

  Create_User_Activity_Log_Ajax(Voucher_No:any){
    //console.log('Voucher_No',Voucher_No);
    this.objActivityLog.DOC_NO=Voucher_No;
    this.objActivityLog.Activity_Type= "Create" ;
    this.objActivityLog.Activity_Details="Payment Voucher";
    this.objActivityLog.Region_Name= this.$CompacctAPI.CompacctCookies.State;
    this.objActivityLog.Country=this.$CompacctAPI.CompacctCookies.Country;
    this.objActivityLog.USER_ID= Number(this.$CompacctAPI.CompacctCookies.User_ID);
    this.objActivityLog.Activity_Date=this.DateService.dateTimeConvert(new Date());
    this.objActivityLog.USER_IP = this.USER_IP;
    this.objActivityLog.City = this.City;
    this.objActivityLog.ISP = this.ISP;
    this.objActivityLog.Lat = this.Lat;
    this.objActivityLog.Lon = this.Lon;
    //console.log('this.objActivityLog',this.objActivityLog);

    this.$http
      .post('/Common/Create_User_Activity_Log_Ajax', this.objActivityLog)
      .subscribe((data: any) => {
        //console.log('save ActivityLog data',data);

        if (data.success) {
          this.Update_AO_Status_Details(Voucher_No);
        }
        else{
          this.PaymentSpinner = false;
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

  Update_AO_Status_Details(Voucher_No:any){
    //console.log('Voucher_No',Voucher_No);
    //console.log('this.backup_AO_No',this.backup_AO_No);

    this.$http
    .post('/Hearing_Advance_Order_V2/Update_AO_Status', { Doc_NO : this.backup_AO_No})
    .subscribe((data: any) => {
      //console.log('save Update_AO_Status_Details data',data);

      if (data.success) {
        this.Search(true);
        this.closePaymentPopup();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Return Voucher",
          detail: "Succesfully Save"
          });
          this.PrintReturnPayment(Voucher_No);
      }
      else{
        this.PaymentSpinner = false;
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

  PrintReturnPayment(Voucher_No:any){
    //console.log('Voucher_No',Voucher_No);
    window.open('/Report/Crystal_Files/Finance/Voucher/report_voucher_print.aspx' + '?Doc_No=' + Voucher_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }

  BillPrint(Bill_No:any,Sale_link:any){
    //console.log('Bill_No',Bill_No);
    //console.log('Sale_link',Sale_link);

    window.open(Sale_link + '?Doc_No=' + Bill_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    
  }

  ReceivedPrint(Received_Doc_NO:any,Rcv_vchr_link:any){
    //console.log('Received_Doc_NO',Received_Doc_NO);
    //console.log('Rcv_vchr_link',Rcv_vchr_link);

    const Multi_Received_Doc_NO=Received_Doc_NO.split(",");
    //console.log("Multi_Received_Doc_NO",Multi_Received_Doc_NO);

    let widthpx=1050;
    let heightpx=600;

    Multi_Received_Doc_NO.forEach((ele:any) =>{
      //console.log('ele',ele);
      widthpx=widthpx-50;
      heightpx=heightpx-50;

      window.open(Rcv_vchr_link + '?Doc_No=' + ele, '_blank', 'fullscreen=yes, scrollbars=auto,width='+widthpx+',height='+heightpx);
    });

  }

  ReturnPrint(Return_Voucher_No: any,Pmt_vchr_link: any){
    //console.log('Return_Voucher_No',Return_Voucher_No);
    //console.log('Pmt_vchr_link',Pmt_vchr_link);

    window.open(Pmt_vchr_link + '?Doc_No=' + Return_Voucher_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');

  }

  getStatusWiseColor(col:any){
    if (col.AO_Status == null) {
      return 'grey'
    }
    else {
      switch (col.AO_Status) {
        case 'Returned':
          return 'orange';
          break;
            
        case 'Billed':
          return 'green';
          break;

        default:
      }
    }
    return
  }

}

class Search{
  Cost_Cen_ID: any;
  from_date:  any;
  to_date:  any;
}

class Common{
  Doc_No: number=0;
  Doc_Date: any;
  Sales_Man_ID: any;
  Cost_Cen_ID: any;
  Sub_Ledger_ID: any;
  Customer_Order_No: any;
  Customer_Order_Date: any;
  Remarks: any;
  Currency_ID: any;
  User_ID: any;
  Entry_Date: any;
  Fin_Year_ID: any;
  Quote_Doc_No: any;
  Location: any;
  Address: any;
  FOOT_Fall_ID: any;
  Dispenser: any;
  Audiologist: any;
}

class Product{
  Product_ID: any;
  Product_Name:any;
  Product_Specification: any;
  Expected_Delivery_Date: any;
  Qty: any;
  UOM: any;
  Rate: any;
  Discount: any;
  Amount: any;
  Tax_Rate: any;
  Tax_Amount: any;
}

class ActivityLog{
  Activity_Date: any;
  USER_ID: any;
  USER_IP: string = '';
  Activity_Type: any;
  Activity_Details: any = 'Advance Order';
  DOC_NO: any;
  City: string='';
  Country: any;
  ISP: string='';
  Lat: string='';
  Lon: string='';
  Region_Name: any;
  Txn_ID: number=0;
}

class Journal{
  Amount: any;
  Ledger: any;
  TRN: any;
  BankDate: any;
  No: any;
  Bank_Name: any;
  Bank_Branch_Name: any;
}

class Payment{
  Narration: any;
  Amount: any;
  Ledger: any;
  TRN: any;
  BankDate: any;
  No: any;
  Bank_Name: any;
  Bank_Branch_Name: any;
}

