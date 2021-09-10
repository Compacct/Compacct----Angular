import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalUrlService } from '../../../../shared/compacct.global/global.service.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from "primeng/api";
import * as moment from "moment";
import { FileUpload } from 'primeng/primeng';
import * as XLSX from 'xlsx';
declare var $:any;
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
  CustomerselectedValue = 'Existing';
  ObjSupportTkt = new SupportTkt();
  ObjSearch = new Search();
  SupportTicketList = [];
  BackUpSupportTicketList = [];
  AssignedToList = [];
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

  TicketWithContactID = false;
  followUpLists = [];
  distinctDateArray =[];
  UpdateStatusModalFlag = false;
  UpdateStatusFormSubmit = false;
  ObjUpdateStatus:any = {};
  MultipleFile:any[] = [];
  TicketDetailsModalFlag = false;
  ObjFolowup = new Followup();
  NextFollowupDate = new Date();
  NextFollowupDateData: any;
  SelectedDistCust = [];
  SelectedDistTat = [];
  SelectedDistAssignTo = [];
  SelectedDistProdName = [];
  DistCust = [];
  DistTat = [];
  DistAssignTo = [];
  DistProdName = [];
  searchFields2 = [];
  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
     this.Header.pushHeader({
      Header: "Support Ticket",
      Link: " Support Ticket Management -> Transaction -> Support Ticket"
     });
     this.GetExistingList();
     this.GetLeadList();
     this.GetSupportLocationList();
     this.GetSupportChargeTypeList();
     this.GetStatusList();
     this.GetSupportTypeList();
     this.GetSupportSymptomTypeList();
     this.GetAssignedToList();
  }
  TabClick(e){
    console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.clearData();

  }
  clearData() {
    this.ObjSupportTkt = new SupportTkt();
    this.SubledgerAdressCap = undefined;
    this.FootFallID = undefined;
    this.ExistingAdressCaptionList = [];
    this.ObjSupportTkt = new SupportTkt();
    this.SubledgerID = undefined;
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  // GET DATA
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearch.st_dt_time = dateRangeObj[0];
      this.ObjSearch.end_dt_time = dateRangeObj[1];
    }
  }
  GetAssignedToList(){
    const obj = {
      "Report_Name": "Get_Assign_To",
      "Json_Param_String": JSON.stringify([{"User_ID": this.$CompacctAPI.CompacctCookies.User_ID}])

    }
    this.GlobalAPI
        .CommonTaskData2(obj)
        .subscribe((data: any) => {
           const AssignedToListNative = data.length ? data : [];
          if(this.$CompacctAPI.CompacctCookies.User_Type === 'A') {
            this.AssignedToList = AssignedToListNative;
          } else {
            this.AssignedToList = AssignedToListNative.filter((item) => item.User_ID == this.$CompacctAPI.CompacctCookies.User_ID);
          }
          this.ObjSearch.Asigned_To = this.$CompacctAPI.CompacctCookies.User_ID;
    });
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
  getTatClass(val) {
    let className = '';
    if (val >= 6) {
      className = 'six-or-above';
      return className;
    }else if (val < 6 && val > 4) {
      className = 'four-to-six';
      return className;
    } else if  (val <= 4) {
      className = 'zero-to-four';
      return className;
    }
    return className;
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
      "Report_Name": "Get_Support_Charge_Type"
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
    this.$http.get(this.url.apiGetAllDataMasterSymptom).subscribe((data: any) => {
      this.SupportSymptomTypeList = JSON.parse(data);
    });
  }

  // CHANGE
  CustomerRadioChanged(e) {
    this.ObjSupportTkt = new SupportTkt();
    this.SubledgerAdressCap = undefined;
    this.FootFallID = undefined;
    this.ExistingAdressCaptionList = [];
    this.ObjSupportTkt = new SupportTkt();
    this.SubledgerID = undefined;
  }
  ChangeExitingCus() {
    this.ObjSupportTkt = new SupportTkt();
    this.SubledgerAdressCap = undefined;
    this.FootFallID = undefined;
    this.ExistingAdressCaptionList = [];
    if(this.SubledgerID) {
      this.ObjSupportTkt.Sub_Ledger_ID = this.SubledgerID;
      const obj = this.ExistingList.filter((value) =>  Number(value.Sub_Ledger_ID) === Number(this.SubledgerID))[0];
      this.ObjSupportTkt.Customer_Name = obj.Sub_Ledger_Name;
      this.ObjSupportTkt.Customer_Email = obj.Sub_Ledger_Email;
        this.ObjSupportTkt.Customer_Mobile = obj.Sub_Ledger_Mobile_No;
        this.ObjSupportTkt.PIN_Code = obj.PIN;
        this.GetExistingAdressCaptionList(this.SubledgerID);
        this.GetExistingSubContctName(this.SubledgerID);
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
  GetExistingSubContctName(Sub_Ledger_ID) {
    this.ObjSupportTkt.Contact_Peson_Name = '';
    this.ObjSupportTkt.Customer_Mobile = '';
    if(Sub_Ledger_ID) {
      const obj = {
        "Report_Name": "Get_Contact_Subledger",
        "Json_Param_String" : JSON.stringify([{'Sub_Ledger_ID' : Sub_Ledger_ID}])
      }
      this.GlobalAPI
          .CommonTaskData2(obj)
          .subscribe((data: any) => {
            const obj1 = data.length ? data[0] : {};
           this.ObjSupportTkt.Contact_Peson_Name = obj1.Contact_Person_Name;
           this.ObjSupportTkt.Customer_Mobile = obj1.Mobile_No;
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
      const obj = this.LeadList.filter((value) =>  Number(value.Foot_Fall_ID) === Number(this.FootFallID))[0];
      this.ObjSupportTkt.Customer_Name = obj.Lead_Details;
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
  SearchSupportTicketList(valid) {
    this.SupportTicketList = [];
    if (valid) {
     // this.seachSpinner = true;
      const start = this.ObjSearch.st_dt_time
        ? this.DateService.dateConvert(new Date(this.ObjSearch.st_dt_time))
        : this.DateService.dateConvert(new Date());
      const end = this.ObjSearch.end_dt_time
        ? this.DateService.dateConvert(new Date(this.ObjSearch.end_dt_time))
        : this.DateService.dateConvert(new Date());
        const obj = {
          "Report_Name": "Get_Browse_Support_Ticket",
          "Json_Param_String": JSON.stringify([{'Start_Date': start,'End_Date':end , 'Status_ID' : this.ObjSearch.Status_ID,'Created_By': this.ObjSearch.Asigned_To}])
        }
        this.GlobalAPI
            .CommonTaskData2(obj)
            .subscribe((data: any) => {
              this.SupportTicketList = data.length ? data : [];
              this.BackUpSupportTicketList = data.length ? data : [];
              this.GetDist();
              this.FilterDist();
              this.seachSpinner = false;
        });
    }
  }
  GetDist() {

    let DDistCust= [];
    let DDistTat= [];
    let DDistAssignTo= [];
    let DDistProdName= [];

    this.DistCust = [];
    this.DistTat = [];
    this.DistAssignTo = [];
    this.DistProdName = [];
    this.BackUpSupportTicketList.forEach((item) => {
      if (DDistCust.indexOf(item.Customer_Name) === -1) {
        DDistCust.push(item.Customer_Name);
          this.DistCust.push({label: item.Customer_Name,value: item.Customer_Name});
      }
      if (DDistTat.indexOf(item.TAT) === -1) {
        DDistTat.push(item.TAT);
        this.DistTat.push({label: item.TAT,value: item.TAT});
    }
    if (DDistAssignTo.indexOf(item.Asigned_To) === -1) {
      DDistAssignTo.push(item.Asigned_To);
      this.DistAssignTo.push({label: item.Asigned_To_Name,value: item.Asigned_To});
  }
  if (DDistProdName.indexOf(item.Product_Name) === -1) {
    DDistProdName.push(item.Product_Name);
    this.DistProdName.push({label: item.Product_Name,value: item.Product_Name});
}
    });
    this.SupportTicketList = [...this.BackUpSupportTicketList];
  }
  FilterDist() {

    let DDistCust= [];
    let DDistTat= [];
    let DDistAssignTo= [];
    let DDistProdName= [];
    this.searchFields2 = [];
    if (this.SelectedDistCust.length) {
      this.searchFields2.push('Customer_Name');
      DDistCust = this.SelectedDistCust;
    }
    if (this.SelectedDistTat.length) {
      this.searchFields2.push('TAT');
      DDistTat = this.SelectedDistTat;
    }
    if (this.SelectedDistAssignTo.length) {
      this.searchFields2.push('Asigned_To');
      DDistAssignTo = this.SelectedDistAssignTo;
    }
    if (this.SelectedDistProdName.length) {
      this.searchFields2.push('Product_Name');
      DDistProdName = this.SelectedDistProdName;
    }
    this.SupportTicketList = [];
    if (this.searchFields2.length) {
      let LeadArr = this.BackUpSupportTicketList.filter(function (e) {
        return (DDistCust.length ? DDistCust.includes(e['Customer_Name']) : true) &&
        (DDistTat.length ? DDistTat.includes(e['TAT']) : true)&&
        (DDistAssignTo.length ? DDistAssignTo.includes(e['Asigned_To']) : true)&&
        (DDistProdName.length ? DDistProdName.includes(e['Product_Name']) : true)
      });
      this.SupportTicketList = LeadArr.length ? LeadArr : [];
    } else {
      this.SupportTicketList = this.BackUpSupportTicketList;
    }
  }
  //  UPDATE TICKET STATUS
  UpdateTicketStatusModal (obj) {
    this.UpdateStatusFormSubmit = false;
    this.ObjUpdateStatus = {};
    this.followUpLists = [];
    this.distinctDateArray =[];
    if(obj.Sup_Ticket_ID) {
      this.ObjUpdateStatus = obj;
      console.log(this.ObjUpdateStatus);
      this.ObjUpdateStatus.Support_Status_ID = undefined;
      this.GetTicketFollowupDetails(this.ObjUpdateStatus.Sup_Ticket_ID,'UpdateStatusModalFlag');

    }
  }
  getFollowupByDate(dateStr) {
    return this.followUpLists.filter((item) => item.Follouwp_Date === dateStr);
  }
  async UpdateTicketStatus(valid) {
    this.UpdateStatusFormSubmit = true;
    if(valid) {
        const TempObj = {
          Sup_Ticket_ID : this.ObjUpdateStatus.Sup_Ticket_ID,
          Status_ID : this.ObjUpdateStatus.Status_ID,
          Assigned_To : this.ObjUpdateStatus.Assigned_To,
          Created_By :this.$CompacctAPI.CompacctCookies.User_ID,
          Note : this.ObjUpdateStatus.Note,
          Created_On : this.DateService.dateTimeConvert(new Date())
        }
        console.log(TempObj)
        const obj = {
          "Report_Name" : "Update_Support_Ticket",
          "Json_Param_String" : JSON.stringify([TempObj])
        }
        this.GlobalAPI.CommonTaskData2(obj).subscribe((data:any)=>{
          console.log(data);
          if(data[0].Remarks) {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Ticket ID : " + this.ObjUpdateStatus.Sup_Ticket_ID,
                detail:  "Succesfully Status Updated"
              });
              this.UpdateStatusFormSubmit = false;
              this.ObjUpdateStatus = {};
              this.UpdateStatusModalFlag = false;
              this.SearchSupportTicketList(true);
          } else{
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        })
      } else {
        this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error From TUTOPIA App API. "
          });
      }
  }
  ShowTicketDetails(obj) {
    this.ObjUpdateStatus = {};
    this.followUpLists = [];
    this.distinctDateArray =[];
    if(obj.Sup_Ticket_ID) {
      this.ObjUpdateStatus = obj;
      this.ObjUpdateStatus.Paid = obj.Paid === 'Y' ? 'YES' : 'NO';
      this.GetTicketFollowupDetails(this.ObjUpdateStatus.Sup_Ticket_ID,'TicketDetailsModalFlag');
    }
  }
  GetTicketFollowupDetails(SupportID,modal) {
    const distinctDateArrayTemp = [];
    const obj = {
      "Report_Name": "GET_Support_Details",
      "Json_Param_String" : JSON.stringify([{"Sup_Ticket_ID": + SupportID}])
    }
    this.GlobalAPI.CommonTaskData2(obj).subscribe((data:any)=> {
      this.followUpLists = data.length ? data:[];
      for (let i = 0; i < this.followUpLists.length; i++) {
          distinctDateArrayTemp.push(this.followUpLists[i].Follouwp_Date);
      }
      const unique = distinctDateArrayTemp.filter(function(value, index, self){
                      return self.indexOf(value) === index;
                    });
      this.distinctDateArray = unique;
      this[modal] = true;
      });
  }

  // SAVE
  SaveSupportTicket(valid) {
    this.SupportTktFormSubmitted = true;
    if(valid) {
      this.ObjSupportTkt.Created_By = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ObjSupportTkt.Assigned_To = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ObjSupportTkt.Created_On = this.DateService.dateTimeConvert(new Date());
      this.ObjSupportTkt.Last_Updated_On = this.DateService.dateTimeConvert(new Date());
      this.ObjSupportTkt.Foot_Fall_ID = this.FootFallID ? this.FootFallID : '0';
      this.ObjSupportTkt.Sub_Ledger_ID = this.SubledgerID ? this.SubledgerID : '0';
      const obj = {
        "Report_Name": "Create_Support_Ticket",
        "Json_Param_String" : JSON.stringify([this.ObjSupportTkt])
      }
      this.GlobalAPI
          .CommonTaskData2(obj)
          .subscribe((data: any) => {
            console.log(data)
            if(data[0].Column1) {
              this.clearData();
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: 'Ticket ID : '+data[0].Column1,
                detail: "Succesfully Created."
              });
            } else {
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
  FetchJSONdataForSave() {
    let TempArr = [];

    return TempArr;
  }

  PrintOrderAspx(obj){
    if(obj.Order_No) {
      window.open("/Report/Crystal_Files/Tutopia/Receipt_Cum_Invoice.aspx?Order_No=" + obj.Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }
  // EXPORT TO EXCEL
  exportexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
}
class Search {
  st_dt_time: string;
  end_dt_time: string;
  Cost_Cen_ID: string;
  Status_ID :string;
  Asigned_To: string;
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
class Followup {
  Query_Question_ID:string;
  Status_ID:string;
	Followup_Remarks:string;
	From_User:string;
	To_User:string;
}
