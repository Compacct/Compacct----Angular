import { CompacctCommonApi } from './../../../shared/compacct.services/common.api.service';
import { DateTimeConvertService } from './../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from './../../../shared/compacct.services/compacct.global.api.service';
import { HttpClient } from '@angular/common/http';
import { CompacctHeader } from './../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-bl-crm-enq-case-history',
  templateUrl: './bl-crm-enq-case-history.component.html',
  styleUrls: ['./bl-crm-enq-case-history.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class BlCrmEnqCaseHistoryComponent implements OnInit {
  Spinner = false;
  buttonname = "Save";
  tabIndexToView= 0;
  AllData =[];
  ObjMiddle:any = {};
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
  // Case_Date =new Date();
  MedicalProblemObj:any = {};
  Active = true;
  SaveAfter = true;
  SelectedMedicalProblems = [];
  MedicalProblemsList:any =[];
  TotalValue:Number = 0

  Date =  new Date();
  ContactNameList:any = [];
  databaseName; any = undefined;
  footFallId:any = undefined;
  Date_Of_Birth:any;
  countryList: any = [];
  stateList: any = [];
  districtList: any = [];
  enqSourceList: any = [];
  refDoctorList: any = [];
  occptionList: any = [];
  userID: string = '';
  listNamePrefix: any = [];
  Items: any = [];
  editDocNo: any;
  allDataList: any = [];
  constructor(
    private header:CompacctHeader,
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private $http: HttpClient,
  ) { }

  ngOnInit() {
    this.header.pushHeader({
      Header: "Patient Creation ",
      Link: "Patient Management --> Clinic --> Patient Creation ",   
  })
  this.Items = ["BROWSE", "CREATE"];
  this.userID = this.$CompacctAPI.CompacctCookies.User_ID;
  this.listNamePrefix = ['Mr', 'Mrs', 'Miss', 'Ms', 'Sir', 'Dr', 'Master', 'Srimati', 'Baby', 'Baby Of'];
  this.getBrowseData();
  this.getCountryList();
  this.getSateList();
  this.getEnqSource();
  this.getRefDoctor();
  this.getOcption();
  this.DataBaseCheck();
  this.GetReasonVist();
  this.GetPresentComplain();
  this.GetAudilogist();
  }
  onReject(){}
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
CheckSameMobileNo() {
  if(this.buttonname === 'Save'){
  const samepono = this.allDataList.filter(item=> (item.Mobile === this.ObjCaseHistory.Mobile));
  if(samepono.length) {
    this.compacctToast.clear();
    this.compacctToast.add({
       key: "compacct-toast",
       severity: "error",
       summary: "Warn message  ",
       detail: "Mobile Number Already Exist."
     });
    return false;
  } 
    else {
      return true;
    }
  }
  else {
    return true;
  }
  
  
}
saveCaseHistoryData(valid:any){
this.EngCaseHistoryFormSubmitted = true;
if (valid && this.CheckSameMobileNo()) {
this.SaveAfter = true;
this.ObjCaseHistory.Case_Date = this.DateService.dateConvert(new Date(this.Case_Date));

this.ObjCaseHistory.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
this.ObjCaseHistory.User_ID = this.userID;
this.ObjCaseHistory.Registration_Date = this.DateService.dateConvert(new Date(this.Date));
this.ObjCaseHistory.Date_Of_Birth = this.Date_Of_Birth ? this.DateService.dateConvert(new Date(this.Date_Of_Birth)) : "";
this.Spinner = true;
// console.log('this.ObjCaseHistory',this.ObjCaseHistory);
if(this.editDocNo){
  const obj = {
    "SP_String": "SP_BL_CRM_Enq_Case_History",
    "Report_Name_String": "Update_ENQ_Case_History",
    "Json_Param_String": JSON.stringify(this.ObjCaseHistory),
  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    // console.log('saveCaseHistoryData updated',data);
    var tempID = data[0].Column1;
    if(data[0].Column1){
      
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Patient Details",
       detail: "Succesfully Updated" //+ mgs
     });
     this.EngCaseHistoryFormSubmitted = false;
     this.ObjCaseHistory = new CaseHistory();
     this.Case_Date = new Date();
     this.ObjMiddle = {};
     this.Active = true;
     this.SaveAfter = false;
     this.Foot_Fall_ID = undefined;
     this.tabIndexToView = 0;
     this.Items = ["BROWSE", "CREATE"];
     this.clearData();
     this.Spinner = false;
     this.getBrowseData();
    }
    else {
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "error",
       summary: "Warn message  ",
       detail: "Something wrong."
     });
    }
  })
}else {
  const obj = {
    "SP_String": "SP_BL_CRM_Enq_Case_History",
    "Report_Name_String" : "Create_ENQ_Case_History",
   "Json_Param_String": JSON.stringify([this.ObjCaseHistory])
  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    // console.log('saveCaseHistoryData saved',data);
    var tempID = data[0].Column1;
    if(data[0].Column1){
      
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Patient Details",
       detail: "Succesfully Saved" //+ mgs
     });
     this.EngCaseHistoryFormSubmitted = false;
     this.ObjCaseHistory = new CaseHistory();
     this.Case_Date = new Date();
     this.ObjMiddle = {};
     this.Active = true;
     this.SaveAfter = false;
     this.Foot_Fall_ID = undefined;
     this.tabIndexToView = 0;
     this.Items = ["BROWSE", "CREATE"];
     this.clearData();
     this.Spinner = false;
     this.getBrowseData();
    }
    else {
      this.Spinner = false;
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
}
} 
checkMobile(mobile: any,field:any) {
  this.ContactNameList = []
  //console.log(mobile);
  if (mobile.length == 10) {
    //console.log('10 digit Complete')
    this.$http.get(`/Hearing_BL_CRM_Appointment/Get_Name_From_Mobile_Hearing?Mobile=` + mobile).subscribe((data: any) => {
      // console.log('checkMobile',JSON.parse(data));
      if (data.length) {
        this.ContactNameList = JSON.parse(data)
      }
    })
  }
}
DataBaseCheck() {
  this.$http.get("/Common/Get_Database_Name",
      {responseType: 'text'})
      .subscribe((data: any) => {
        this.databaseName = data;
        // console.log('DataBaseCheck',data) 
      });
      //this.databaseName = 'BSHPL'
}
NameChange(){
  this.ObjCaseHistory.Prefix = undefined
  this.ObjCaseHistory.Contact_Name = undefined
  if(this.footFallId && this.databaseName != 'BSHPL'){
    const ContactNameListFilter = this.ContactNameList.Filter((el:any)=> el.Foot_Fall_ID == this.footFallId )
    if(ContactNameListFilter.length){
      this.ObjCaseHistory.Prefix = ContactNameListFilter[0].Prefix
      this.ObjCaseHistory.Contact_Name = ContactNameListFilter[0].Contact_Name
    }
  }
 
}
getAddressOnChange(e) {
  this.ObjCaseHistory.Location = undefined;
  //console.log(e);
  if (e) {
    this.ObjCaseHistory.Location = e;
  }
}
getCountryList() {
  this.$http.get(`/Common/Get_Country_List`).subscribe((data: any) => {
    let CountryList = JSON.parse(data);
    //console.log('Country List ==>', CountryList);
    this.countryList = CountryList
  });
}

getSateList() {
  this.$http.get(`/Common/Get_State_List`).subscribe((data: any) => {
    //console.log(data);
    //console.log('State List==>', data);
    this.stateList = data
  });
}
getDistrictList(State: any) {
  this.districtList = [];
  this.ObjCaseHistory.District = undefined;
  //console.log('District works', State);
  if(State){
  this.$http.get(`/Common/Get_District_List?StateName=` + State).subscribe((data: any) => {
    //console.log(data);
    this.districtList = data;
  });
  }
}
getEnqSource() {
  this.$http.get(`/DIPL_CRM_Lead/Get_Enq_Source`).subscribe((data: any) => {
    //console.log('Enq src List==>', data);
    this.enqSourceList = data
  });
}

getRefDoctor() {
  this.$http.get(`/BL_Enq_Source_Sub_Master/Get_All_Data_for_Ref_Doctor`).subscribe((data: any) => {
    let RefList = JSON.parse(data);
    RefList.forEach((ele: any) => {
      this.refDoctorList.push({
        "label": ele.Enq_Source_Sub_Name,
        "value": ele.Enq_Source_Sub_ID
      })
    })
    //console.log('ref Doctor List List==>', this.refDoctorList);
  });
}
getOcption() {
  this.occptionList = [];
   const obj = {
    "SP_String": "SP_BL_Txn_Patient_Create_Branch",
    "Report_Name_String": "Get_Patient_Occupation",
    "Json_Param_String": JSON.stringify({ User_ID: this.userID }),
  }
  this.GlobalAPI.getData(obj).subscribe((data: any) => {
    //console.log('Browsesfs Data==>', data);
    this.occptionList = data;
  })
}
TabClick(e) {
  this.tabIndexToView = e.index;
  this.Items = ["BROWSE", "CREATE"];
  this.buttonname = 'Save';
  this.clearData();

}
clearData() {
  this.ObjCaseHistory = new CaseHistory();
  this.districtList = [];
  this.EngCaseHistoryFormSubmitted = false;
  this.Spinner = false;
  this.ObjCaseHistory.Country = "India";
  this.ContactNameList = [];
  this.Date = new Date();
  this.Date_Of_Birth = undefined;
  this.editDocNo = undefined
}
getBrowseData() {
  const obj = {
    "SP_String": "SP_BL_CRM_Enq_Case_History",
    "Report_Name_String": "Get_ENQ_Case_History_for_browse",
  }
  this.GlobalAPI.getData(obj).subscribe((data: any) => {
    // console.log('Browse Data==>', data);
    this.allDataList = data;
  })
}
Edit(col){
  this.clearData();
  this.editDocNo = undefined;
  if(col.Foot_Fall_ID){
    this.editDocNo = col.Foot_Fall_ID;
    this.tabIndexToView = 1;
    this.Items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.getedit(col.Foot_Fall_ID);
   }
}
getedit(Dno){
  // console.log('Dno',Dno);
  const FilterAlldataList = this.allDataList.length ? this.allDataList.filter(ele=> ele.Foot_Fall_ID === Dno) : [];
  // console.log('FilterAlldataList',FilterAlldataList);
  if(FilterAlldataList.length){
    this.ObjCaseHistory = FilterAlldataList[0];
    var district = FilterAlldataList[0].District;
    this.Date_Of_Birth = new Date(FilterAlldataList[0].Date_Of_Birth);
    this.getDistrictList(FilterAlldataList[0].State);
    this.ObjCaseHistory.District = district;
  }
}
}
class CaseHistory{
  Cost_Cen_ID:any;						
  User_ID:any;							
  Reference_No:any;					
  Registration_Date:any;				
  Mobile:any;							
  Mobile_2:any;						
  Mobile_3_WP:any;						
  Prefix:any;							
  Contact_Name:any;					
  Age:any;								
  Date_Of_Birth:any;				
  Age_Unit:any;						
  Gender:any;							
  Email:any;							
  Address:any;  						
  Location:any;						
  Landmark:any;						
  State:any;							
  District:any;						
  Country:any;							
  Pin:any;								
  Occupation:any;						
  Enq_Source_ID:any;					
  Enq_Source_Sub_ID:any;				
  Consultancy_Type:any;				
  Who_has_accompanied_you:any;			
  Reason_for_visiting_Today:any;		
  Present_Complaints:any;	
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
        			
		

