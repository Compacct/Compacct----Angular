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
import { getLocaleTimeFormat } from '@angular/common';
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
  supportTicketNo = undefined;
  getViewData:any = {};
  ViewSpareData = [];
  ViewSpareRequired = [];
  ViewModel = false;
  callEndTime = new Date();
  callStartTime = new Date();
  BScallEndTime = new Date();
  BScallStartTime = new Date();
  requiredSpare = false;
  CurrentDateNepal:any;
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
      this.CurrentDateNepal = this.DateNepalConvertService.GetNepaliCurrentDateNew();
      this.route.queryParams.subscribe(params => {
        console.log(params);
       if(params['SUP'] != "NA") {
         this.GetCallSheetGridData(params['SUP']);
         this.callsheettab = true;
          const ctrl = this;
          setTimeout(() => {
            ctrl.tabIndexToView = 1;
          }, 200);
          this.ObjEngineerCall = new EngineerCall();
          this.ObjSpareDetails = new SpareDetails();
          this.ObjRequiredSpareDetails = new RequiredSpareDetails();
          this.RequiredSpareDetailsList = [];
          this.SpareDetailsList = [];
          this.callStutasData = [];
          this.mainStatusData = [];
          this.GetTicketDetails(params['SUP']);
          this.GetMainStatus();
          this.getSymptom(params['SUP']);
          this.getSpareParts(params['SUP']);
          this.BScallEndTime = new Date();
          this.BScallStartTime = new Date();
         
          this.SpareDetailsSubmit = false;
          this.RequiredSpareDetailsSubmit = false;
          this.pendingCallFormSubmit = false;
       }
        
       })
    }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Pending Call",
      Link: " Engineering CRM -> Master -> Pending Call"
    });
    this.mainItems = ["BROWSE", "CALL SHEET"];
    this.StartDatecall = this.CurrentDateNepal;
    this.EndDatecall = this.CurrentDateNepal;
    this.GetEngineerName();
  }
  onConfirm(){}
  onReject() {
    this.compacctToast.clear("c");
  }
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
     })
   }
  }
  TicketDetails(col){
   if(col.Support_Ticket_No){
     this.supportTicketNo = undefined;
     this.supportTicketNo = col.Support_Ticket_No;
     this.requiredSpare = false;
    const ctrl = this;
    setTimeout(() => {
      ctrl.showTicket = true;
    }, 1000);
      this.Symptomvalue = undefined;
      this.GetTicketDetails(col.Support_Ticket_No);
      this.tabIndexToViewticket = 0;
      this.items = ["Ticket Details", "Engineer call Sheet","Used Spare","Required Spare","Followups"];
      this.callEndTime = new Date();
      this.callStartTime = new Date();
      this.StartDate = this.CurrentDateNepal;
      this.EndDate = this.CurrentDateNepal;
      this.ObjEngineerCall = new EngineerCall();
      this.ObjSpareDetails = new SpareDetails();
      this.ObjRequiredSpareDetails = new RequiredSpareDetails();
      this.callStutasData = [];
      this.mainStatusData = [];
      this.GetMainStatus();
      this.GetCallSheetGridData(col.Support_Ticket_No);
      this.getSymptom(col.Support_Ticket_No);
      this.getSpareParts(col.Support_Ticket_No);
      this.SpareDetailsSubmit = false;
      this.RequiredSpareDetailsSubmit = false;
      this.pendingCallFormSubmit = false;
      this.RequiredSpareDetailsList = [];
      this.SpareDetailsList = [];
   }
  }
  TabClick(e) {
    this.tabIndexToViewticket = e.index;
    this.items = ["Ticket Details", "Engineer call Sheet","Used Spare","Required Spare","Followups"];
    this.requiredSpare = false;
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
     this.ObjSpareDetails = new SpareDetails();
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
       console.log("SparePartsList",this.SparePartsList)
     })
  }
  addRequiredSpareDetails(valid){
    this.RequiredSpareDetailsSubmit = true;
    if(valid){
     
      const tempFilterData = this.SparePartsList.filter(el=>el.Spare_Parts_Product_ID === Number(this.ObjRequiredSpareDetails.Spare_Parts_Product_ID))
      this.ObjRequiredSpareDetails.spare = tempFilterData[0].Spare_Part_Description
      this.RequiredSpareDetailsList.push(this.ObjRequiredSpareDetails);
      this.RequiredSpareDetailsSubmit = false;
      this.ObjRequiredSpareDetails = new RequiredSpareDetails();
      
    }
  }
  checkDeleteRequired(index){
    this.RequiredSpareDetailsList.splice(index,1);
  }
  ReturnNepaliDate (engDate) {
    if (engDate) {
        const EngDateObj = {
            'year': new Date(engDate).getFullYear(),
            'month': new Date(engDate).getMonth() + 1,
            'day': new Date(engDate).getDate()
        }
        const NepaliDateObj = NepaliFunctions.AD2BS(EngDateObj);
        const FormattedNepaliDate = NepaliFunctions.ConvertDateFormat(NepaliDateObj, "DD/MM/YYYY");
        return FormattedNepaliDate;
    } else {
        return '-';
    }
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
  convertNepaliDateToEngDate = function (obj) {
    const dateObj = {...obj};
    const EngDateObj = NepaliFunctions.BS2AD({year: dateObj.year, month: Number(dateObj.month) + 1, day: dateObj.day});
    console.log('convertNepaliDateToEngDate',EngDateObj)
    return new Date(EngDateObj.year,(EngDateObj.month -1),EngDateObj.day);
  }
  CallSheet(col){
   if(col.Support_Ticket_No){
     this.supportTicketNo = undefined;
     this.supportTicketNo = col.Support_Ticket_No;
     this.callsheettab = true;
     this.requiredSpare = false;
    const ctrl = this;
    setTimeout(() => {
      ctrl.tabIndexToView = 1;
    }, 200);
    this.ObjEngineerCall = new EngineerCall();
    this.callStutasData = [];
    this.mainStatusData = [];
    this.GetCallSheetGridData(col.Support_Ticket_No);
    this.GetTicketDetails(col.Support_Ticket_No);
    this.GetMainStatus();
    this.getSymptom(col.Support_Ticket_No);
    this.getSpareParts(col.Support_Ticket_No);
    this.BScallEndTime = new Date();
    this.BScallStartTime = new Date();
    this.ObjSpareDetails = new SpareDetails();
    this.SpareDetailsList = [];
    this.RequiredSpareDetailsList = [];
    this.ObjRequiredSpareDetails = new RequiredSpareDetails();
    this.StartDatecall = this.CurrentDateNepal;
    this.EndDatecall = this.CurrentDateNepal;
    this.SpareDetailsSubmit = false;
    this.RequiredSpareDetailsSubmit = false;
    this.pendingCallFormSubmit = false;
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
  GetView(col){
  if(col.Call_Sheet_ID){
    this.getViewDetalis(col.Call_Sheet_ID);
    this.getViewSpareDetalis(col.Call_Sheet_ID);
    this.GetViewSpareRequired(col.Call_Sheet_ID);
    const ctrl = this;
    setTimeout(() => {
      this.ViewModel = true;
    }, 1000);
    
  }
  }
  getViewDetalis(CallSheetID){
    const obj = {
      "SP_String": "SP_Support_Ticket_Call_Sheet_Nepal",
      "Report_Name_String": "Get_Support_ticket_Call_Sheet_Details",
      "Json_Param_String": JSON.stringify([{Call_Sheet_ID : CallSheetID}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.getViewData = data[0];
      console.log("getViewData",this.getViewData);
     })
  }
  getViewSpareDetalis(CallSheetID){
    const obj = {
      "SP_String": "SP_Support_Ticket_Call_Sheet_Nepal",
      "Report_Name_String": "Get_Support_ticket_Call_Sheet_Spare",
      "Json_Param_String": JSON.stringify([{Call_Sheet_ID : CallSheetID}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ViewSpareData = data;
      console.log("ViewSpareData",this.ViewSpareData);
     })
  }
  GetViewSpareRequired(CallSheetID){
    const obj = {
      "SP_String": "SP_Support_Ticket_Call_Sheet_Nepal",
      "Report_Name_String": "Get_Support_ticket_Call_Sheet_Spare_Required",
      "Json_Param_String": JSON.stringify([{Call_Sheet_ID : CallSheetID}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ViewSpareRequired = data;
      console.log("ViewSpareRequired",this.ViewSpareRequired);
     })
  }
  SaveCallSheet(valid,value){
   this.pendingCallFormSubmit = true;
   let tempObj= [];
   let tempObj1= [];
   if(valid){
      if(this.SaveCheck()){
        let getStartDate = value ==="tab"? this.StartDatecall : this.StartDate;
        let geEndDate = value ==="tab"? this.EndDatecall : this.EndDatecall;
        let getStartTimeDate = value ==="tab"? this.BScallStartTime : this.callStartTime;
        let getEndTimeDate = value ==="tab"? this.BScallEndTime : this.callStartTime;
       this.ObjEngineerCall.Call_Start_Time = this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(getStartDate))+' ' +' '+new Date(getStartTimeDate).toLocaleTimeString();
       this.ObjEngineerCall.Call_End_Time = this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(geEndDate))+' ' +' '+new Date(getEndTimeDate).toLocaleTimeString();
       this.ObjEngineerCall.Support_Ticket_No = this.supportTicketNo;
       this.ObjEngineerCall.Login_User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
       this.SpareDetailsList.forEach(el=>{
         tempObj.push({
           Product_ID : el.Spare_Parts_Product_ID,			  			
           Serial_No	: el.serialNo,				
           Qty	:el.Qty
         })
       })
       this.RequiredSpareDetailsList.forEach(el=>{
         tempObj1.push({
         Product_ID : el.Spare_Parts_Product_ID,			  			
         Serial_No	: "",				
         Qty	:el.Qty
         })
       })
       console.log("ObjEngineerCall",this.ObjEngineerCall);
       console.log("tempObj1",tempObj1);
       console.log("tempObj",tempObj);
       const obj = {
         "SP_String": "SP_Support_Ticket_Call_Sheet_Nepal",
         "Report_Name_String": "Create_Support_ticket_Call_Sheet_Grid",
         "Json_Param_String": JSON.stringify(this.ObjEngineerCall),
         "Json_1_String" : JSON.stringify(tempObj),
         "Json_2_String" : JSON.stringify(tempObj1)
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         if (data[0].Column1) {
           this.GetCallSheetGridData(this.supportTicketNo);
           this.ObjEngineerCall = new EngineerCall();
           this.SpareDetailsList = [];
           this.RequiredSpareDetailsList = [];
           this.StartDate = this.CurrentDateNepal;
           this.EndDate = this.CurrentDateNepal;
           this.StartDatecall = this.CurrentDateNepal;
           this.EndDatecall = this.CurrentDateNepal;
           this.callEndTime = new Date();
           this.callStartTime = new Date();
           this.BScallEndTime = new Date();
           this.BScallStartTime = new Date();
           this.pendingCallFormSubmit = false;
           this.requiredSpare = false; 
           this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Succesfully Saved",
             detail: "Engineer call Sheet Succesfully Saved "
           });
         }
         else {
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
        let msg = this.SpareDetailsList.length ? "Enter Required Spare Details" : "Enter Spare Details"
       this.Spinner = false;
       this.compacctToast.clear();
       this.compacctToast.add({
         key: "compacct-toast",
         severity: "error",
         summary: "Warn Message",
         detail: msg
       });
     }
    }
}

SaveCheck(){
  let flag = false;
   if(this.ObjEngineerCall.Main_Status === "OPEN" && this.ObjEngineerCall.Call_Status === "Need Spare"){
     if(this.requiredSpare){
       if(this.RequiredSpareDetailsList.length){
        flag = true
       }
       else { 
        flag = false
       }
     }
     else{
       if(this.SpareDetailsList.length){
        flag = true
       }
       else{
        flag = false
       }
     }
   }
   else {
     flag = true
   }
 
  return flag
}
 tConvert(date) {
  const DateArr = date.split('T');
  const time =  DateArr[1]
  const myArr = time.split(':');
  var hours = myArr[0];
  var minutes = myArr[1];
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime; // return adjusted time or original string
}
AssociateEngineerName(AssociateEngineerID){
  const tempnameObj =  this.EngineerNameList.filter(el=>el.User_ID == AssociateEngineerID);
  return tempnameObj[0].Member_Name
}
SpareName(ProductID){
  const tempnameObj =  this.SparePartsList.filter(el=>el.Spare_Parts_Product_ID == ProductID);
  return tempnameObj[0].Spare_Part_Description
}
Edit(col){

}
}
class EngineerCall {
  Call_Start_Time:any;				
  Call_End_Time:any;				
  Associate_Engineer_ID:any;					
  Details_Of_Support:any;				
  Main_Status:any;					
  Call_Status:any;					
  Actual_Issue_Observed:any;				
  Work_Done:any = "";		   
 Login_User_ID:any;
 Support_Ticket_No:any;
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
  Qty : any;
 }