import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { CompacctCommonApi } from './../../../shared/compacct.services/common.api.service';
import { DateTimeConvertService } from './../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from './../../../shared/compacct.services/compacct.global.api.service';
import { HttpClient } from '@angular/common/http';
import { CompacctHeader } from './../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { last } from 'rxjs/operators';

@Component({
  selector: 'app-bl-crm-enq-case-history',
  templateUrl: './bl-crm-enq-case-history.component.html',
  styleUrls: ['./bl-crm-enq-case-history.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class BlCrmEnqCaseHistoryComponent implements OnInit {
  Spinner = false;
  buttonname = "Update";
  tabIndexToView= 0;
  AllData =[];
  ObjMiddle = {};
  ObjCaseHistory : CaseHistory = new CaseHistory();
  EngCaseHistoryFormSubmitted:boolean = false;
  ReasonforVisitList:any = [];
  PresentComplainList:any = [];
  Case_Date = new Date();
  EnqCaseHistoryList:any = [];
  Foot_Fall_ID:any;

  IfYes = false;
  ifinfections =false;
  Ifrapidly =false;
  Iffullness =false;
  Ifringing =false;
  Ifsurgical = false;
  Iffamily = false;
  Ifaids = false;
  Patientlist :any=[];
  patientSearchList :any=[];
  centerlist :any = [];
  Audilogistlist :any =[];
  AllStateDistrictList :any =[];
  StateList:any =[];
  DistrictList :any =[];
  PatientFormSubmitted =false;
  PatientMiddleFormSubmitted = false;
  PatientlastFormSubmitted =false;
  Date_Of_Birth = new Date();
  // Case_Date =new Date();
  MedicalProblemObj:any = {};
  Active = true;
  SaveAfter = true;
  SelectedMedicalProblems = [];
  MedicalProblemsList:any =[];
  footFallId:any = undefined
  TotalValue:Number = 0

  constructor(
    private header:CompacctHeader,
    private $http: HttpClient,
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.header.pushHeader({
      Header: "Hearing Case History",
      Link: "Patient Management -> Hearing Case History",   
  })
  this.GetPatient();
  this.GetReasonVist();
  this.GetPresentComplain();
  this.GetAudilogist();
  }
  onReject(){}
GetPatient(){
  this.Patientlist = [];
  const obj = {
    "SP_String": "SP_BL_CRM_Enq_Case_History",
    "Report_Name_String": "Get_Patient"

 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  if(data.length) {
      data.forEach(element => {
        element['label'] = element.Lead_Details,
        element['value'] = element.Foot_Fall_ID
      });
     this.Patientlist = data;
   //console.log("Patientlist======",this.Patientlist);
    }
     else {
      this.Patientlist = [];
    }
 });
}
GetPatientDetails(){
  this.ObjMiddle = {};
  this.EnqCaseHistoryList = [];
  this.EngCaseHistoryFormSubmitted = false;
  this.ObjCaseHistory = new CaseHistory();
  this.Case_Date = new Date();
  this.Active = false;
  this.SaveAfter = false;
  if(this.Foot_Fall_ID){
    const objpatientdetails = this.Patientlist.filter(ele=> ele.Foot_Fall_ID === this.Foot_Fall_ID)
    this.ObjMiddle = objpatientdetails[0];
    this.GetEnqCaseHistory();
  }
}
GetReasonVist(){
  this.ReasonforVisitList = [
    'Test',
    'Hearing aids ',
    'Hearing aid Enquiry ',
    'Hearing aid repair',
    'Hearing aid programming',
    'Vertigo/dizziness test'
  ];
}
GetPresentComplain(){
  this.PresentComplainList = [
    'Reduced hearing',
    'Ear pain',
    'Ear discharge' ,
    'Ear heaviness' ,
    'Ringing sensation' ,
    'Vertigo',
    'Hearing health check-up'
  ];
}
GetAudilogist(){
  this.Audilogistlist = [];
  const obj = {
    "SP_String": "SP_BL_CRM_Enq_Case_History",
    "Report_Name_String": "Get_Audiologist",
    "Json_Param_String": JSON.stringify([{Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}]) 
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //console.log("Audilogistlist==",data)
  if(data.length) {
      data.forEach(element => {
        element['label'] = element.Audiologist_Name,
        element['value'] = element.Audiologist_ID
      });
     this.Audilogistlist = data;
   //console.log("Audilogistlist======",this.Audilogistlist);
    }
     else {
      this.Audilogistlist = [];
    }
 });
}
saveCaseHistoryData(){
  //console.log("saveDataLast==",valid)
this.EngCaseHistoryFormSubmitted = true;
// this.Active = false;
this.SaveAfter = true;
//console.log("MedicalProblemObj",this.MedicalProblemObj)
//this.ObjLast.Medical_Problems = Object.values(this.MedicalProblemObj).toString()
//console.log("this.ObjLast.Medical_Problems",this.ObjLast.Medical_Problems)
this.ObjCaseHistory.Foot_Fall_ID = this.Foot_Fall_ID;
this.ObjCaseHistory.Case_Date = this.DateService.dateConvert(new Date(this.Case_Date));
  const obj = {
    "SP_String": "SP_BL_CRM_Enq_Case_History",
    "Report_Name_String" : "Create_ENQ_Case_History",
   "Json_Param_String": JSON.stringify([this.ObjCaseHistory])
  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    //console.log(data);
    var tempID = data[0].Column1;
    if(data[0].Column1){
      
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Enquiry Case History  ",
       detail: "Succesfully Save" //+ mgs
     });
     this.EngCaseHistoryFormSubmitted = false;
     this.ObjCaseHistory = new CaseHistory();
     this.Case_Date = new Date();
     this.ObjMiddle = {};
     this.Active = true;
     this.SaveAfter = false;
     this.Foot_Fall_ID = undefined;
    }
    else {
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "error",
       summary: "Warn message  ",
       detail: "Something wrong."
     });
    }
  })
} 
GetPrint(){
  if (this.patientSearchList[0].Foot_Fall_ID) {
    window.open("/Report/Crystal_Files/CRM/joh_Form/Case_History.aspx?Foot_Fall_ID=" + this.patientSearchList[0].Foot_Fall_ID, 
    'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
    );
  }
}
GetEnqCaseHistory(){
  this.EnqCaseHistoryList = [];
  this.EngCaseHistoryFormSubmitted = false;
  this.ObjCaseHistory = new CaseHistory();
  this.Case_Date = new Date();
  this.Active = false;
  this.SaveAfter = false;
 // this.PatientFormSubmitted = true
  const tempobj = {
    Foot_Fall_ID : this.Foot_Fall_ID,
  }
const obj = {
  "SP_String": "SP_BL_CRM_Enq_Case_History",
  "Report_Name_String": "Get_ENQ_Case_History",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  if(data.length){
   this.EnqCaseHistoryList = data;
  //this.DynamicHeader2 = Object.keys(data[0]);
   //console.log('patientSearchList=====',this.patientSearchList)
  //  this.ObjCaseHistory = data[0];
   this.ObjCaseHistory.Reason_for_Visit = data[0].Reason_for_Visit ? data[0].Reason_for_Visit : undefined;
   this.ObjCaseHistory.Present_complain = data[0].Present_complain ? data[0].Present_complain : undefined;
   this.ObjCaseHistory.Right_ear_tinnitus = data[0].Right_ear_tinnitus ? data[0].Right_ear_tinnitus : undefined;
   this.ObjCaseHistory.Left_ear_tinnitus = data[0].Left_ear_tinnitus ? data[0].Left_ear_tinnitus : undefined;
   this.ObjCaseHistory.Right_ear_pain = data[0].Right_ear_pain ? data[0].Right_ear_pain : undefined;
   this.ObjCaseHistory.Left_ear_pain = data[0].Left_ear_pain ? data[0].Left_ear_pain : undefined;
   this.ObjCaseHistory.Right_ear_discharge = data[0].Right_ear_discharge ? data[0].Right_ear_discharge : undefined;
   this.ObjCaseHistory.Left_ear_discharge = data[0].Left_ear_discharge ? data[0].Left_ear_discharge : undefined;
   this.ObjCaseHistory.Right_ear_Vertigo = data[0].Right_ear_Vertigo ? data[0].Right_ear_Vertigo : undefined;
   this.ObjCaseHistory.Left_ear_Vertigo = data[0].Left_ear_Vertigo ? data[0].Left_ear_Vertigo : undefined;
   this.ObjCaseHistory.Right_ear_blocking_sensation = data[0].Right_ear_blocking_sensation ? data[0].Right_ear_blocking_sensation : undefined;
   this.ObjCaseHistory.Left_ear_blocking_sensation = data[0].Left_ear_blocking_sensation ? data[0].Left_ear_blocking_sensation : undefined;
   this.ObjCaseHistory.Exposure_to_noise = data[0].Exposure_to_noise ? data[0].Exposure_to_noise : undefined;
   this.ObjCaseHistory.Duration_of_noise_exposure = data[0].Duration_of_noise_exposure ? data[0].Duration_of_noise_exposure : undefined;
   this.ObjCaseHistory.Ref_doctor = data[0].Ref_doctor ? data[0].Ref_doctor : undefined;
   this.ObjCaseHistory.Surgical_history = data[0].Surgical_history ? data[0].Surgical_history : undefined;
   this.ObjCaseHistory.Better_ear = data[0].Better_ear ? data[0].Better_ear : undefined;
   this.ObjCaseHistory.Family_history_of_hearing_loss = data[0].Family_history_of_hearing_loss ? data[0].Family_history_of_hearing_loss : undefined;
   this.ObjCaseHistory.Pre_hearing_aid_technology = data[0].Pre_hearing_aid_technology ? data[0].Pre_hearing_aid_technology : undefined;
   this.ObjCaseHistory.Pre_hearing_aid_type = data[0].Pre_hearing_aid_type ? data[0].Pre_hearing_aid_type : undefined;
   this.ObjCaseHistory.Hearing_aid_difficulties = data[0].Hearing_aid_difficulties ? data[0].Hearing_aid_difficulties : undefined;
   this.Case_Date = data[0].Case_Date ? new Date(data[0].Case_Date) : new Date();
   this.ObjCaseHistory.Audiologist_ID = data[0].Audiologist_ID ? data[0].Audiologist_ID : undefined;
  
  }
 })
 //this.PatientFormSubmitted = false
}
}
class CaseHistory{
Foot_Fall_ID:any;
Case_Date:any;
Audiologist_ID:any;
Reason_for_Visit:any;
Present_complain:any;
Right_ear_tinnitus:any;
Left_ear_tinnitus:any;
Right_ear_pain:any;                   
Left_ear_pain:any; 
Right_ear_discharge:any;  
Left_ear_discharge:any;   
Right_ear_Vertigo:any;
Left_ear_Vertigo:any;    
Right_ear_blocking_sensation:any;
Left_ear_blocking_sensation:any;
Exposure_to_noise :any;
Duration_of_noise_exposure:any;  
Ref_doctor:any;
Surgical_history:any;
Better_ear:any;
Family_history_of_hearing_loss:any;
Pre_hearing_aid_technology:any;  
Pre_hearing_aid_type:any;
Hearing_aid_difficulties:any;	    
}


