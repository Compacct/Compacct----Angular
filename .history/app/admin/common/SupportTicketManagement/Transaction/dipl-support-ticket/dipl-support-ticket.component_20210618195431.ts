import { HttpClient, HttpParams } from '@angular/common/http';
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

  url = window["config"];
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

  SubledgerID = undefined;
  FootFallID = undefined;
  SubledgerAdressCap = undefined;

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
     this.GetExistingList();
     this.GetLeadList();
     this.GetSupportLocationList();
     this.GetSupportChargeTypeList();
     this.GetStatusList();
     this.GetSupportTypeList();
     this.GetSupportSymptomTypeList();
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
    this.$http.get(this.url.apiGetSubledgerDr).subscribe((data: any) => {
      this.ExistingList = JSON.parse(data);
      this.ExistingList.forEach(el => {
          el.label = el.Sub_Ledger_Name;
          el.value = el.Sub_Ledger_ID;
      });
    });
  }
  GetLeadList() {
    this.$http.get(this.url.apiGetCRMAllLead).subscribe((data: any) => {
      this.LeadList = JSON.parse(data);
      this.LeadList.forEach(el => {
        el.label = el.Lead_Details;
        el.value = el.Foot_Fall_ID;
    });
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
    this.$http.get(this.url.apiGetAllDataMasterSupportType).subscribe((data: any) => {
      this.SupportTypeList = JSON.parse(data);
    });
  }
  GetSupportSymptomTypeList() {
    this.$http.get(this.url.apiGetAllDataMasterSupportType).subscribe((data: any) => {
      this.SupportSymptomTypeList = JSON.parse(data);
    });
  }

  // CHANGE
  ChangeExitingCus() {
    this.ObjSupportTkt = new SupportTkt();
    this.SubledgerAdressCap = undefined;
    this.FootFallID = undefined;
    this.ExistingAdressCaptionList = [];
    if(this.SubledgerID) {
      this.ObjSupportTkt.Sub_Ledger_ID = this.SubledgerID;
      const obj = this.ExistingList.filter((value) =>  Number(value.Sub_Ledger_ID) === Number(this.SubledgerID))[0];
      this.ObjSupportTkt.Customer_Email = obj.Sub_Ledger_Email;
        this.ObjSupportTkt.Customer_Mobile = obj.Sub_Ledger_Mobile_No;
        this.ObjSupportTkt.PIN_Code = obj.PIN;
        this.ObjSupportTkt.Customer_Email = obj.Email_ID;
        this.ObjSupportTkt.Address = obj.Address;
        this.GetExistingAdressCaptionList(this.SubledgerID);
    }
  }
  GetExistingAdressCaptionList(Sub_Ledger_ID) {
    this.ObjSupportTkt.Address = '';
    this.ObjSupportTkt.PIN_Code = '';
    this.ExistingAdressCaptionList = [];
    if(Sub_Ledger_ID) {
      const para = new HttpParams().set("Sub_Ledger_ID", Sub_Ledger_ID);
      this.$http.get(this.url.apiGetSubledgerAddressDetails_, { params: para }).subscribe((data: any) => {
        this.ExistingAdressCaptionList = JSON.parse(data);
      });
    }
  }
  ChangeExistingAdressCaption (captionName) {
    this.ObjSupportTkt.Address = '';
        this.ObjSupportTkt.PIN_Code = '';
    if (captionName) {
        const obj = this.ExistingAdressCaptionList.filter((value) =>  value.Address_Caption === captionName)[0];
        this.ObjSupportTkt.Address = obj.Address_1;
        this.ObjSupportTkt.PIN_Code = obj.Pin;

    }
  }
  ChangeLeadCus() {
    this.ObjSupportTkt = new SupportTkt();
    this.SubledgerID = undefined;
    if(this.FootFallID) {
      this.ObjSupportTkt.Foot_Fall_ID = this.FootFallID;
      this.GetLeadAdressList(this.FootFallID);

    }
  }
  GetLeadAdressList(FootFallId) {
    this.ObjSupportTkt.Customer_Mobile = '';
    this.ObjSupportTkt.Contact_Peson_Name ='';
    this.ObjSupportTkt.PIN_Code ='';
    this.ObjSupportTkt.Customer_Email ='';
    this.ObjSupportTkt.Address = '';
    if(FootFallId) {
      const para = new HttpParams().set("FootFallID", FootFallId);
      this.$http.get("/Common/Get_CRM_Address_Details", { params: para }).subscribe((data: any) => {
        const obj = data[0];
        this.ObjSupportTkt.Customer_Mobile = obj.Mobile_No;
        this.ObjSupportTkt.Contact_Peson_Name = obj.Contact_Person_Name;
        this.ObjSupportTkt.PIN_Code = obj.PIN;
        this.ObjSupportTkt.Customer_Email = obj.Email_ID;
        this.ObjSupportTkt.Address = obj.Address;
      });
    }

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
  SaveSupportTicket(valid) {
    this.SupportTktFormSubmitted = true;
    if(valid) {
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
