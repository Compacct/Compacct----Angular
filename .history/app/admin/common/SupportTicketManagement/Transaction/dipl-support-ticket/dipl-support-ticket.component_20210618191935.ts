import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalUrlService } from '../../../../shared/compacct.global/global.service.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from "primeng/api";
@Component({
  selector: 'app-dipl-support-ticket',
  templateUrl: './dipl-support-ticket.component.html',
  styleUrls: ['./dipl-support-ticket.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DiplSupportTicketComponent implements OnInit {

  tabIndexToView = 0;
  seachSpinner = false;
  items = [];

  ObjSupportTkt = new SupportTkt();
  ObjSearch = new Search();
  SupportTktSearchFormSubmitted = false;
  SupportTktFormSubmitted = false;
  ExistingList = [];
  LeadList = [];
  ExistingAdressCaptionList = [];
  SupportLocationList = [];
  SupportChargeTypeList = [];
  SupportTypeList = [];
  SupportSymptomTypeList = [];
  StatusList = [];

  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
     this.Header.pushHeader({
      Header: "Loan EMI Transfer",
      Link: " Financial Management -> Transaction -> Loan EMI Transfer"
     });
     this.GetSupportLocationList();
     this.GetSupportChargeTypeList();
     this.GetStatusList();
  }
  TabClick(e){
    console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.clearData();

  }
  clearData() {
    this.ObjSupportTkt = new SupportTkt();
    this.SupportTktSearchFormSubmitted = false;
    this.SupportTktFormSubmitted = false;
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  // GET DATA
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjLoanSearch.st_dt_time = dateRangeObj[0];
      this.ObjLoanSearch.end_dt_time = dateRangeObj[1];
    }
  }

  GetExistingList() {
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts_Voucher",
      "Report_Name_String": "GET_LOAN_LEDGERS"
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          this.LoanCompanyList = data.length ? data : [];
    });
  }
  GetLeadList() {
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts_Voucher",
      "Report_Name_String": "GET_LOAN_TRF_LEDGERS"
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          this.BankLedgerList = data.length ? data : [];
    });
  }
  GetExistingAdressCaptionList() {
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "Get_Bank_Tran_Type"
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          this.BankTrnTypeList = data.length ? data : [];
    });
  }
  GetSupportLocationList() {
    const obj = {
      "Report_Name": "Get_Support_Location"
    }
    this.GlobalAPI
        .CommonTaskData2(obj)
        .subscribe((data: any) => {
          this.SupportLocationList = data.length ? data : [];
    });
  }
  GetSupportChargeTypeList() {
    const obj = {
      "Report_Name": "Get_Support_Location"
    }
    this.GlobalAPI
        .CommonTaskData2(obj)
        .subscribe((data: any) => {
          this.SupportChargeTypeList = data.length ? data : [];
    });
  }
  GetStatusList() {
    const obj = {
      "Report_Name": "Get_SUP_Master_Status"
    }
    this.GlobalAPI
        .CommonTaskData2(obj)
        .subscribe((data: any) => {
          this.StatusList = data.length ? data : [];
    });
  }
  GetSupportTypeList() {
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "Get_Bank_Tran_Type"
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          this.BankTrnTypeList = data.length ? data : [];
    });
  }

  GetSupportSymptomTypeList() {
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "Get_Bank_Tran_Type"
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          this.SupportSymptomTypeList = data.length ? data : [];
    });
  }


  // SEARCH
  SearchTransferedLoan(valid) {
    this.TransferedLoanBillList = [];
    if (valid) {
     // this.seachSpinner = true;
      const start = this.ObjLoanSearch.st_dt_time
        ? this.DateService.dateConvert(new Date(this.ObjLoanSearch.st_dt_time))
        : this.DateService.dateConvert(new Date());
      const end = this.ObjLoanSearch.end_dt_time
        ? this.DateService.dateConvert(new Date(this.ObjLoanSearch.end_dt_time))
        : this.DateService.dateConvert(new Date());
        const obj = {
          "SP_String": "Tutopia_Subscription_Accounts_Voucher",
          "Report_Name_String": "BROWSE_EMI_TRANSFER_VOUCHER",
          "Json_Param_String": JSON.stringify([{'Start_Date': start,'End_Date':end , 'Cost_Cen_ID' : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
        }
        this.GlobalAPI
            .getData(obj)
            .subscribe((data: any) => {
              this.TransferedLoanBillList = data.length ? data : [];
              this.seachSpinner = false;
        });
    }
  }


  // SAVE
  SaveLoanTransfer(valid) {
    this.VoucherSubmitted = true;
    if(valid && this.PendingLoanBillList.length && this.UpdateLoanTotalAmt) {
     const TempArr = this.FetchJSONdataForSave();
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts_Voucher",
        "Report_Name_String": "CREATE_EMI_TRANSFER_VOUCHER",
        "Json_1_String": JSON.stringify(TempArr)
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
            console.log(data)
            if(data[0].Next_Voucher_No) {
              this.SearchTransferedLoan(true);
              this.clearData();
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: data[0].Next_Voucher_No,
                detail: "Succesfully Created."
              });
            }
      });
    }
  }
  FetchJSONdataForSave() {
    let TempArr = [];
    let IsTopperYbill =  {
        Txn_ID : 0,
        Voucher_Date : this.DateService.dateConvert(new Date(this.ObjLedger.Voucher_Date)),
        Ledger_ID : this.ObjCommonUseObj.Bank_Ledger,
        Fin_Year_ID : this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
        Cheque_No :this.ObjLedger.Cheque_No,
        Cheque_Date :this.ObjLedger.Cheque_Date ?  this.DateService.dateConvert(new Date(this.ObjLedger.Cheque_Date)) : '"01/Jan/1900"',
        Bank_Name : this.ObjLedger.Bank_Name,
        Bank_Txn_Type : this.ObjLedger.Bank_Txn_Type,
        Bank_Branch_Name : this.ObjLedger.Bank_Branch_Name,
        Naration: this.ObjLedger.Naration,
        DR_Amt: 0,
        CR_Amt: this.UpdateLoanTotalAmt,
        Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        Cost_Cen_ID_Trn: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
        Is_Topper: 'Y',
    }
    TempArr.push(IsTopperYbill);
    let IsTopperNbill = this.PendingLoanBillList.filter(item=> item.Selected);
    IsTopperNbill.forEach(el=> {
       const obj = {
        Txn_ID : el.Txn_ID,
        Voucher_Date : this.DateService.dateConvert(new Date(this.ObjLedger.Voucher_Date)),
        Ledger_ID : el.Loan_Ledger_ID,
        Fin_Year_ID : this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
        Cheque_No :this.ObjLedger.Cheque_No,
        Cheque_Date :this.ObjLedger.Cheque_Date ?  this.DateService.dateConvert(new Date(this.ObjLedger.Cheque_Date)) : '"01/Jan/1900"',
        Bank_Name : this.ObjLedger.Bank_Name,
        Bank_Txn_Type : this.ObjLedger.Bank_Txn_Type,
        Bank_Branch_Name : this.ObjLedger.Bank_Branch_Name,
        Naration: this.ObjLedger.Naration,
        DR_Amt: el.Emi_To_Be_Tran,
        CR_Amt: 0,
        Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        Cost_Cen_ID_Trn: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
        Is_Topper: 'N',
       }
       TempArr.push(obj);
    });
    console.log(TempArr)
    return TempArr;
  }

  PrintOrderAspx(obj){
    if(obj.Order_No) {
      window.open("/Report/Crystal_Files/Tutopia/Receipt_Cum_Invoice.aspx?Order_No=" + obj.Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }
}
class Search {
  st_dt_time: string;
  end_dt_time: string;
  Cost_Cen_ID: string;
  Loan_Company_Ledger: string;
}

class SupportTkt {
  Sup_Ticket_ID	:string;
Foot_Fall_ID	  :string;
Sub_Ledger_ID	:string;
Customer_Name	:string;
Address	:string;
PIN_Code	:string;
Customer_Mobile	 :string;
Contact_Peson_Name:string;
Customer_Email	  :string;
Support_Loation	  :string;
Support_Charge_Type	:string;
Call_Recieved_By	 :string;
Product_Name	    :string;
Product_Serial_No	    :string;
Support_Type_ID	    :string;
Symptom_ID:string;
Problem_Brief_Description	:string;
Status_ID	    :string;
Created_On	  :string;
Created_By	   :string;
Last_Updated_On	:string;
Assigned_To	    :string;
}
