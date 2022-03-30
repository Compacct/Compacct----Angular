import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tuto-asp-unavaliblity',
  templateUrl: './tuto-asp-unavaliblity.component.html',
  styleUrls: ['./tuto-asp-unavaliblity.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoAspUnavaliblityComponent implements OnInit {
// Unavailability
SearchUser_ID = undefined;
from_date:any;
to_date:any;
SearchSpinner = false;
SearchFormSubmitted = true;
ASPUnavailabilityList = [];

ASPList = [];
SelectedTimeSlotList = [];
TimeSlotList = [];
StartDateModel = new Date();
EndDateModel = new Date();
DayAfterTomorrow = new Date();

ASPUnAvbFormSubmitted = false;
SaveSpinner = false;
ObjASPUnavailability = new ASPUnavailability();
AddedASPUnavailability: ASPUnavailability[] = [];
TxnID = undefined ;



  constructor(  private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private $http : HttpClient,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,) {
      const today = new Date()
      const DayAfterTommorrow = new Date(today)
      DayAfterTommorrow.setDate(DayAfterTommorrow.getDate() + 2)
      this.StartDateModel = new Date(DayAfterTommorrow);
      this.EndDateModel = new Date(DayAfterTommorrow);
      this.DayAfterTomorrow = new Date(DayAfterTommorrow);
     }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "ASP Unavailability",
      Link: "CRM -> Master -> ASP Unavailability"
    });
    this.GetASPList();
    this.GetTimeSlotList();
    this.GetAllUnavailability(true);
  }
  GetASPList() {
    const obj = {
      "SP_String": "SP_Controller",
      "Report_Name_String": "GET_ASP"
    }
    this.GlobalAPI.CommonPostData(obj,'/Tutopia_Call_Common_SP_For_All')
      .subscribe((data: any) => {
        console.log(data);
        data.forEach((obj)=>{
          obj['label'] = obj.ASP_Name;
          obj['value'] = obj.User_ID;
        })
        this.ASPList = data;
        this.ObjASPUnavailability.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
        this.SearchUser_ID =  this.$CompacctAPI.CompacctCookies.User_ID;
      });
  }
  GetTimeSlotList() {
    this.$http.get('https://tutopiacallaz.azurewebsites.net/api/Mobile_Func_Adv?code=CLSiAdJbe7iil5hQ9n8aVAOmiFt3KPjk2AnARj3vaY7mjKSsHBxSmg==&Report_Name=Get_Appointment_Slot&Sp_Name=SP_Controller').subscribe((data:any)=>{
      this.TimeSlotList = data.message ? JSON.parse(data.message) : [];
      this.TimeSlotList.forEach((obj)=>{
        obj['label'] = obj.Time_Slot_Name;
        obj['value'] = obj.Time_Slot_ID;
      })
    });
    
  }
  SaveUnavailability(valid){
    this.ASPUnAvbFormSubmitted = true;
    console.log(this.SelectedTimeSlotList);
    if(valid && this.SelectedTimeSlotList.length) {
      this.SaveSpinner = true;
     const obj = {
      "SP_String": "SP_Controller",
      "Report_Name_String": "Save_ASP_Unavailable",
      "Json_Param_String" : this.FetchData()
    }
    this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All')
      .subscribe((data: any) => {
        console.log(data)
        if(data[0].Column1){
          this.GetAllUnavailability(true)
          this.SelectedTimeSlotList = [];
          this.StartDateModel = new Date(this.DayAfterTomorrow);
          this.EndDateModel = new Date(this.DayAfterTomorrow);
          this.ASPUnAvbFormSubmitted = false;
          this.SaveSpinner = false;
          this.ObjASPUnavailability = new ASPUnavailability();
          this.ObjASPUnavailability.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'ASP Unavailability',
            detail: "Succesfully Updated."
          });
        } else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "No Name Found"
          });
        }
      });
    }
  }
  FetchData() {
    let TempData = [];
    this.ObjASPUnavailability.StartDate = this.DateService.dateConvert(new Date(this.StartDateModel));
    this.ObjASPUnavailability.EndDate = this.DateService.dateConvert(new Date(this.EndDateModel));
    this.SelectedTimeSlotList.forEach(item=>{
      this.ObjASPUnavailability.Slot_Id = item;
      TempData.push({...this.ObjASPUnavailability});
      this.ObjASPUnavailability.Slot_Id = undefined
    })
    console.log(TempData);
    return JSON.stringify(TempData);

  }

  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.from_date = dateRangeObj[0];
      this.to_date = dateRangeObj[1];
    }
  }
  GetAllUnavailability(valid) {
    this.SearchFormSubmitted = true;
    this.ASPUnavailabilityList = [];
    console.log(valid)
  if(valid) {
    this.SearchFormSubmitted = false;
    this.SearchSpinner = true;
    const tempObj = {
      'StartDate': this.from_date ? this.DateService.dateConvert(new Date(this.from_date))
      : this.DateService.dateConvert(new Date()),
      'EndDate' : this.to_date  ? this.DateService.dateConvert(new Date(this.to_date))
      : this.DateService.dateConvert(new Date()),
      'User_ID' : this.SearchUser_ID
    }
    const obj = {
      "SP_String": "SP_Controller",
      "Report_Name_String": "Browse_ASP_Unavailable",
      "Json_Param_String" : JSON.stringify([tempObj])
    }
    this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All')
      .subscribe((data: any) => {
        console.log(data)
        this.ASPUnavailabilityList = data;
        this.SearchSpinner = false;
      });
  }
    
  }

  compareTime(time1) {
    return new Date(time1) > new Date(this.DayAfterTomorrow); // true if time1 is later
}
  DeleteAspUnavailability(obj){
    this.TxnID = undefined ;
    if(obj.Txn_ID){
      this.TxnID = obj.Txn_ID ;
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
  onConfirm(){
    if(this.TxnID) {
      const obj = {
        "SP_String": "SP_Controller",
        "Report_Name_String": "Delete_ASP_Unavailable",
        "Json_Param_String": JSON.stringify([{txn_id : this.TxnID}])
      }
      this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All')
      .subscribe((data: any) => {
        console.log("data",data)
        if(data[0].Column1){
          this.GetAllUnavailability(true);
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "ASP ",
            detail: "Succesfully Delete"
          });
        }
      })
    }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
}
class ASPUnavailability {
  User_ID:String;
  StartDate:String;
  EndDate:String;
  Slot_Id:String;
}