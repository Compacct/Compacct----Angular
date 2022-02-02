import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { AnyTxtRecord } from 'dns';
import { DateNepalConvertService } from '../../../../shared/compacct.global/dateNepal.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var NepaliFunctions: any;
const NepaliDate = require('nepali-date');

@Component({
  selector: 'app-support-ticket-pending-calls-nepal',
  templateUrl: './support-ticket-pending-calls-nepal.component.html',
  styleUrls: ['./support-ticket-pending-calls-nepal.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SupportTicketPendingCallsNepalComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = "Save";
  Spinner = false;
  seachSpinner = false;
  items = [];
  mainItems = [];
  callsheettab = false;
  searchFormSubmit = false;
  EngineerName = undefined;
  EngineerNameList = [];
  GetallData = [];
  showTicket = false;
  ticketValue:any = {};
  tabIndexToViewticket = 0;
  StartDate : any = {};
  EndDate : any = {};
  StartDatecall : any = {};
  EndDatecall : any = {};
  ObjEngineerCall : EngineerCall = new EngineerCall();
  ObjSpareDetails : SpareDetails = new SpareDetails(); 
  ObjRequiredSpareDetails : RequiredSpareDetails = new RequiredSpareDetails();
  EngineerList = [];
  mainStatusData = [];
  callStutasData = [];
  SpareDetailsList = [];
  Symptomvalue = undefined; 
  SparePartsList = [];
  RequiredSpareDetailsList = [];
  RequiredSpareDetailsSubmit = false;
  SpareDetailsSubmit = false;
  pendingCallFormSubmit = false;
  CallSheetGridDataList = [];
  constructor(private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService,
    private _router: Router,
    private route: ActivatedRoute,) { 
      this.route.queryParams.subscribe(params => {
        console.log(params);
       if(params['SUP'] != "NA") {
         this.GetCallSheetGridData(params['SUP']);
         this.callsheettab = true;
          const ctrl = this;
          setTimeout(() => {
            ctrl.tabIndexToView = 1;
          }, 200);
       }
        
       })
    }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Pending Call",
      Link: " Engineering CRM -> Master -> Pending Call"
    });
    this.mainItems = ["BROWSE", "CALL SHEET"];
    this.GetEngineerName();
  }
  onConfirm(){}
  onReject(){}
  GetEngineerName(){
    const obj = {
      "SP_String": "SP_Support_Ticket_Nepal",
      "Report_Name_String": "Get_Engineer_Dropdown",
      "Json_Param_String": JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("EngineerName");
     this.EngineerNameList = data;
    })
  }
  GetSearchedList(valid){
   this.searchFormSubmit = true;
   if(valid){
    const obj = {
      "SP_String": "SP_Support_Ticket_Nepal",
      "Report_Name_String": "Get_Pending_Support_Ticket",
      "Json_Param_String": JSON.stringify([{User_ID : this.EngineerName}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("GetallData",data);
        this.GetallData = data;
        for(let i = 0; i < this.GetallData.length ; i++){
          this.GetallData[i]['last_updated_on_Nepali'] = this.convertToNepaliDateObj(this.GetallData[i]['last_updated_on']);
          this.GetallData[i]['Support_Ticket_Date_Nepali'] = this.convertToNepaliDateObj(this.GetallData[i]['Support_Ticket_Date_Nepali']);
         // console.log('Service_Start_Date==', this.BrowseList[i]['Service_Start_Date'])
       }
       console.log("GetallData",data);
     })
   }
  }
  TicketDetails(col){
   if(col.Support_Ticket_No){
    const ctrl = this;
    setTimeout(() => {
      ctrl.showTicket = true;
    }, 1000);
     this.Symptomvalue = undefined;
      this.GetTicketDetails(col.Support_Ticket_No);
     this.tabIndexToViewticket = 0;
     this.items = ["Ticket Details", "Engineer call Sheet","Used Spare","Required Spare","Followups"];
     this.StartDate = {...this.DateNepalConvertService.GetCurrentNepaliDate()};
    this.EndDate = {...this.DateNepalConvertService.GetCurrentNepaliDate()};
    this.StartDatecall = {...this.DateNepalConvertService.GetCurrentNepaliDate()};
    this.EndDatecall = {...this.DateNepalConvertService.GetCurrentNepaliDate()};
    this.callStutasData = [];
    this.mainStatusData = [];
    this.GetMainStatus();
    
    this.getSymptom(col.Support_Ticket_No);
    this.getSpareParts(col.Support_Ticket_No);
    this.SpareDetailsSubmit = false;
    
   }
  }
  TabClick(e) {
    this.tabIndexToViewticket = e.index;
    this.items = ["Ticket Details", "Engineer call Sheet","Used Spare","Required Spare","Followups"];
  }
   MainTabClick(e) {
    this.tabIndexToView = e.index;
    this.mainItems = ["BROWSE", "CALL SHEET"];
    if(this.tabIndexToView === 0){
      this.callsheettab=false;
    }
  }
  GetTicketDetails(SupportTicketNo){
    const obj = {
      "SP_String": "SP_Support_Ticket_Nepal",
      "Report_Name_String": "Get_Ticket_Details",
      "Json_Param_String": JSON.stringify([{Support_Ticket_No : SupportTicketNo}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("data",data);
       this.ticketValue = data[0];
       console.log("ticketValue",this.ticketValue)
     })
  }
  GetMainStatus(){
    const obj = {
      "SP_String": "SP_Support_Ticket_Nepal",
      "Report_Name_String": "Get_Ticket_Status_Main",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       
       this.mainStatusData = data;
       console.log("mainStatusData",this.mainStatusData)
     })
  }
  GetCallStatus(){
    const obj = {
      "SP_String": "SP_Support_Ticket_Nepal",
      "Report_Name_String": "Get_Ticket_Status_Sub",
      "Json_Param_String": JSON.stringify([{Main_Status : this.ObjEngineerCall.Main_Status}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       
       this.callStutasData = data;
       console.log("callStutasData",this.callStutasData)
     })
  }
  addSpareDetails(valid){
    this.SpareDetailsSubmit = true;
   if(valid){
    const tempFilterData = this.SparePartsList.filter(el=>el.Spare_Parts_Product_ID === Number(this.ObjSpareDetails.Spare_Parts_Product_ID))
    this.ObjSpareDetails.spare = tempFilterData[0].Spare_Part_Description
     this.SpareDetailsList.push(this.ObjSpareDetails);
     this.SpareDetailsSubmit = false;
     console.log("SpareDetailsList",this.SpareDetailsList);
     
   }
  }
  checkDelete(index){
    this.SpareDetailsList.splice(index,1);
  }
  getSymptom(TicketNo){
    let Symptomarr = [];
      const obj = {
      "SP_String": "SP_Support_Ticket_Nepal",
      "Report_Name_String": "Get_Ticket_Details_Symptom",
      "Json_Param_String": JSON.stringify([{Support_Ticket_No : TicketNo}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       const tempdata = data;
       tempdata.forEach(ele => {
        Symptomarr.push(ele.Symptom)
       });
       console.log("Symptomarr",Symptomarr);
       this.Symptomvalue = Symptomarr.toString()
     })
  }
  getSpareParts(TicketNo){
    const obj = {
      "SP_String": "SP_Support_Ticket_Nepal",
      "Report_Name_String": "Get_Spare_Parts_with_Support_Ticket",
      "Json_Param_String": JSON.stringify([{Support_Ticket_No : TicketNo}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.SparePartsList = data
     })
  }
  addRequiredSpareDetails(valid){
    this.RequiredSpareDetailsSubmit = true;
    if(valid){
      const tempFilterData = this.SparePartsList.filter(el=>el.Spare_Parts_Product_ID === Number(this.ObjRequiredSpareDetails.Spare_Parts_Product_ID))
      this.ObjRequiredSpareDetails.spare = tempFilterData[0].Spare_Part_Description
      this.RequiredSpareDetailsList.push(this.ObjRequiredSpareDetails);
      this.RequiredSpareDetailsSubmit = false;
    }
  }
  checkDeleteRequired(index){
    this.RequiredSpareDetailsList.splice(index,1);
  }
  convertToNepaliDateObj = function (_Date) {
    const EnglishDate = new Date(_Date);
    var month = EnglishDate.getUTCMonth() + 1;
    var day = EnglishDate.getDate();
    var year = EnglishDate.getUTCFullYear();
    const NepalDateObj = NepaliFunctions.AD2BS({
      year: year,
      month: month,
      day: day
    });
    //const NepalDate = {nyear: NepalDateObj.year, nmonth: Number(NepalDateObj.month) - 1, nday: NepalDateObj.day};
    const d1 = new NepaliDate(NepalDateObj.year, Number(NepalDateObj.month) - 1, NepalDateObj.day)
    // const nyear = NepalDateObj.year.toString().length == 1 ? "0" + NepalDateObj.year : NepalDateObj.year;
    // const nmonth = NepalDateObj.month.toString().length == 1 ? "0" + NepalDateObj.month : NepalDateObj.month;
    // const nday = NepalDateObj.day.toString().length == 1 ? "0" + NepalDateObj.day : NepalDateObj.day;
    //const NepalDate = NepalDateObj.day + '/' + NepalDateObj.month + '/' + NepalDateObj.year;
    //const NepalDate = nday + '/' + nmonth + '/' + nyear;
    return d1.format('dd mmmm, yyyy');
    // return {
    //   day: Number(nday),
    //   month: Number(nmonth),
    //   year: nyear
    // };
    
  }
  CallSheet(col){
   if(col.Support_Ticket_No){
     this.callsheettab = true;
    const ctrl = this;
    setTimeout(() => {
      ctrl.tabIndexToView = 1;
    }, 200);
    this.GetCallSheetGridData(col.Support_Ticket_No);
    this.GetTicketDetails(col.Support_Ticket_No);
   }
  }
  GetCallSheetGridData(SupportTicketNo){
    const obj = {
      "SP_String": "SP_Support_Ticket_Call_Sheet_Nepal",
      "Report_Name_String": "Get_Support_ticket_Call_Sheet_Grid",
      "Json_Param_String": JSON.stringify([{Support_Ticket_No : SupportTicketNo}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.CallSheetGridDataList = data;
       console.log("CallSheetGridDataList",this.CallSheetGridDataList);
     })
  }
  GetEdit(col){
  console.log("Edit Data",col);
  }
}
class EngineerCall {
Call_Sheet_ID :any;
Followup_ID	:any;
Call_Start_Time	:any;	
Call_End_Time	:any	
Associate_Engineer_ID	:any;	
Details_Of_Support:any;	
Main_Status	:any;
Call_Status	:any;
Actual_Issue_Observed	:any;	
Work_Done	:any;
}
class SpareDetails{
  spare :any;
  Spare_Parts_Product_ID:any
  serialNo : any;
  Qty:any 
}
class RequiredSpareDetails{
  spare :any;
  Spare_Parts_Product_ID : any
  serialNo : any;
 }