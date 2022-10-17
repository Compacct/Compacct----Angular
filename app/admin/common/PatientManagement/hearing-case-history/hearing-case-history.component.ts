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
  selector: 'app-hearing-case-history',
  templateUrl: './hearing-case-history.component.html',
  styleUrls: ['./hearing-case-history.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class HearingCaseHistoryComponent implements OnInit {
  Spinner = false;
  buttonname = "Update";
  tabIndexToView= 0;
  AllData =[];
  ObjFirst : First = new First();
  ObjMiddle : Middle = new Middle();
  ObjLast : Last = new Last();
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
  Case_Date =new Date();
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
  ) {}

ngOnInit(){
    this.header.pushHeader({
      Header: "Hearing Case History",
      Link: "Patient Management -> Hearing Case History",   
  })
  this.MedicalProblemsList = [
    {label: 'History of Infection', value: 'History of Infection'},
    {label: 'Heart problems', value: 'Heart problems'},
    {label: 'High blood pressure', value: 'High blood pressure'},
    {label: 'Cancer', value: 'Cancer'},
    {label: 'Stroke', value: 'Stroke'},
    {label: 'Kidney issues', value: 'Kidney issues'},
    {label: 'Diabetes', value: 'Diabetes'},
    {label: 'Head injury', value: 'Head injury'},
    {label: 'Headache', value: 'Headache'},
];
  this.GetPatient();
  this.GetCenter();
  this.getState();
}
CustomerRadioChange(){
if(this.ObjLast.Is_Hearing_Check === "Y"){
  this.IfYes = true;
  this.PatientlastFormSubmitted = false;
}
else{
  this.IfYes = false;
  this.ObjLast.Hearing_Check_Details = undefined
}
if(this.ObjLast.Is_Ear_Infections === "Y"){
  this.ifinfections = true;
}
else{
  this.ifinfections = false;
  this.ObjLast.Ear_Infection_Side = undefined
} 
if(this.ObjLast.Is_Lost_Hearing_Suddenly === "Y"){
  this.Ifrapidly = true;
}
else{
  this.Ifrapidly = false;
  this.ObjLast.Lost_Hearing_Suddenly_Side = undefined
} 
if(this.ObjLast.Is_Pain === "Y"){
  this.Iffullness = true;
}
else{
  this.Iffullness = false;
  this.ObjLast.Pain_Side = undefined
} 
if(this.ObjLast.Is_Exp_Ringing === "Y"){
  this.Ifringing = true;
}
else{
  this.Ifringing = false;
  this.ObjLast.Exp_Ringing_Side = undefined
} 
if(this.ObjLast.Is_Treatment === "Y"){
  this.Ifsurgical = true;
}
else{
  this.Ifsurgical = false;
  this.ObjLast.Treatment_Side = undefined
} 
if(this.ObjLast.Is_Hearing_Loss_Family === "Y"){
  this.Iffamily = true;
}
else{
  this.Iffamily = false;
  this.ObjLast.Loss_Family_Who = undefined
} 
if(this.ObjLast.Is_Using_HA === "Y"){
  this.Ifaids = true;
}
else{
  this.Ifaids = false;
  this.ObjLast.HA_Name = undefined
} 
}
GetPatient(){
  this.Patientlist = [];
  const obj = {
    "SP_String": "SP_ENQ_Case_History",
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
GetPatientLIST(){
  this.patientSearchList = [];
  this.Active = false;
  this.SaveAfter = true;
 // this.PatientFormSubmitted = true
  const tempobj = {
    Foot_Fall_ID : this.ObjFirst.Foot_Fall_ID,
  }
const obj = {
  "SP_String": "SP_ENQ_Case_History",
  "Report_Name_String": "Get_ENQ_Case_History",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  if(data.length){
   this.patientSearchList = data;
  //this.DynamicHeader2 = Object.keys(data[0]);
   //console.log('patientSearchList=====',this.patientSearchList)
   this.ObjMiddle.Contact_Name = this.patientSearchList[0].Contact_Name;
   this.ObjMiddle.Foot_Fall_ID = this.patientSearchList[0].Foot_Fall_ID;
   this.ObjMiddle.Gender = this.patientSearchList[0].Gender;
   this.Date_Of_Birth = new Date(this.patientSearchList[0].Date_Of_Birth);
   this.ObjMiddle.Address = this.patientSearchList[0].Address;
   this.ObjMiddle.Pin = this.patientSearchList[0].Pin;
   this.StateDistrictChange(this.ObjMiddle.Pin);
   this.ObjMiddle.DISTRICT = this.patientSearchList[0].DISTRICT;
   this.ObjMiddle.Mobile = this.patientSearchList[0].Mobile;
   this.ObjMiddle.Mobile_2 = this.patientSearchList[0].Mobile_2;
   this.ObjMiddle.Email = this.patientSearchList[0].Email;
   this.ObjMiddle.Cost_Cen_ID = this.patientSearchList[0].Cost_Cen_ID;
   this.GetAudilogist();
   this.ObjMiddle.STATE = this.patientSearchList[0].STATE;
   this.ObjLast.Is_Hearing_Check = this.patientSearchList[0].Is_Hearing_Check;
   this.ObjLast.Hearing_Check_Details = this.patientSearchList[0].Hearing_Check_Details;
   this.ObjLast.Hearing_Loss_Details = this.patientSearchList[0].Hearing_Loss_Details;
   this.ObjLast.Is_Ear_Infections = this.patientSearchList[0].Is_Ear_Infections;
   this.ObjLast.Ear_Infection_Side = this.patientSearchList[0].Ear_Infection_Side;
   this.ObjLast.Is_Suspect_Difficulty = this.patientSearchList[0].Is_Suspect_Difficulty;
   this.ObjLast.Is_Lost_Hearing_Suddenly = this.patientSearchList[0].Is_Lost_Hearing_Suddenly;
   this.ObjLast.Lost_Hearing_Suddenly_Side = this.patientSearchList[0].Lost_Hearing_Suddenly_Side;
   this.ObjLast.Is_Exp_Dizziness = this.patientSearchList[0].Is_Exp_Dizziness;
   this.ObjLast.Better_Ear = this.patientSearchList[0].Better_Ear;
   this.ObjLast.Is_Pain = this.patientSearchList[0].Is_Pain;
   this.ObjLast.Pain_Side = this.patientSearchList[0].Pain_Side;
   this.ObjLast.Is_Exp_Ringing = this.patientSearchList[0].Is_Exp_Ringing;
   this.ObjLast.Exp_Ringing_Side = this.patientSearchList[0].Exp_Ringing_Side;
   this.ObjLast.Is_Loud_Noise = this.patientSearchList[0].Is_Loud_Noise;
   this.SelectedMedicalProblems = this.patientSearchList[0].Medical_Problems.split(',');
   this.ObjLast.Medical_Problems_Other = this.patientSearchList[0].Medical_Problems_Other;
   this.ObjLast.Is_Treatment = this.patientSearchList[0].Is_Treatment;
   this.ObjLast.Treatment_Side = this.patientSearchList[0].Treatment_Side;
   this.TotalValue = this.patientSearchList[0].Communication_Total_Score;
   this.ObjLast.Comm_1 = this.patientSearchList[0].Comm_1;
   this.ObjLast.Comm_2 = this.patientSearchList[0].Comm_2;
   this.ObjLast.Comm_3 = this.patientSearchList[0].Comm_3;
   this.ObjLast.Comm_4 = this.patientSearchList[0].Comm_4;
   this.ObjLast.Comm_5 = this.patientSearchList[0].Comm_5;
   this.ObjLast.Comm_6 = this.patientSearchList[0].Comm_6;
   this.ObjLast.Comm_7 = this.patientSearchList[0].Comm_7;
   this.ObjLast.Comm_8 = this.patientSearchList[0].Comm_8;
   this.ObjLast.Comm_9 = this.patientSearchList[0].Comm_9;
   this.ObjLast.Comm_10 = this.patientSearchList[0].Comm_10;
   this.ObjLast.Is_Hearing_Loss_Family = this.patientSearchList[0].Is_Hearing_Loss_Family;
   this.ObjLast.Loss_Family_Who = this.patientSearchList[0].Loss_Family_Who;
   this.ObjLast.Is_Other_Notice = this.patientSearchList[0].Is_Other_Notice;
   this.ObjLast.Important_To_Improve = this.patientSearchList[0].Important_To_Improve;
   this.ObjLast.Is_Using_HA = this.patientSearchList[0].Is_Using_HA;
   this.ObjLast.HA_Name = this.patientSearchList[0].HA_Name;
   this.ObjLast.Confident_To_Ability = this.patientSearchList[0].Confident_To_Ability;
   this.ObjLast.Is_Satisfy_Hearing_Status = this.patientSearchList[0].Is_Satisfy_Hearing_Status;
   this.Case_Date = new Date(this.patientSearchList[0].Case_Date);
   this.ObjLast.Audiologist_ID = this.patientSearchList[0].Audiologist_ID;
  // if(this.patientSearchList[0].Medical_Problems){
  //   let tempArr = this.patientSearchList[0].Medical_Problems.split(',')
  //   this.MedicalProblemObj = {}
  //   this.MedicalProblemObj= {
  //     Infection : tempArr.indexOf("History of Infection") != -1 ? "History of Infection" : undefined ,
  //     Heart : tempArr.indexOf("Heart problems") != -1 ? "Heart problems" : undefined ,
  //     bloodPressure : tempArr.indexOf("High blood pressure") != -1 ? "High blood pressure" : undefined ,
  //     Cancer: tempArr.indexOf("Cancer") != -1 ? "Cancer" : undefined ,
  //     Stroke : tempArr.indexOf("Stroke") != -1 ? "Stroke" : undefined ,
  //     Kidney : tempArr.indexOf("Kidney issues") != -1 ? "Kidney issues" : undefined ,
  //     Diabetes: tempArr.indexOf("Diabetes") != -1 ? "Diabetes" : undefined ,
  //     HeadInjury: tempArr.indexOf("Head injury") != -1 ? "Head injury" : undefined , 
  //     Headache: tempArr.indexOf("Headache") != -1 ? "Headache" : undefined ,
  //   }
    //console.log("MedicalProblemObj",this.MedicalProblemObj)
  //}
    this.CustomerRadioChange();
  
  
  }
 })
 //this.PatientFormSubmitted = false
}
GetCenter(){
  this.centerlist = [];
  const obj = {
    "SP_String": "SP_ENQ_Case_History",
    "Report_Name_String": "Get_Cost_Center"

 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //console.log("centerlist==",data)
  if(data.length) {
      data.forEach(element => {
        element['label'] = element.Cost_Cen_Name,
        element['value'] = element.Cost_Cen_ID
      });
     this.centerlist = data;
   //console.log("Patientlist======",this.Patientlist);
    }
     else {
      this.centerlist = [];
    }
 });
}
GetAudilogist(){
  this.Audilogistlist = [];
  const obj = {
    "SP_String": "SP_ENQ_Case_History",
    "Report_Name_String": "Get_Audiologist",
    "Json_Param_String": JSON.stringify([{Cost_Cen_ID: this.ObjMiddle.Cost_Cen_ID}]) 
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
   if(this.ObjMiddle.Audiologist_ID){
    //this.getAudi()
   }
   
    }
     else {
      this.Audilogistlist = [];
    }
 });
}
StateDistrictChange(pin:any){
this.AllStateDistrictList =[]
//console.log("pin==",pin);
  if(pin.length === 6){
  const obj = {
      "SP_String": "SP_ENQ_Case_History",
       "Report_Name_String":"Get_PIN_Details",
       "Json_Param_String": JSON.stringify([{pincode: pin}]) 
        }
         this.GlobalAPI.getData(obj).subscribe((data)=>{
            this.AllStateDistrictList = data;
            //this.objSubLedger.State=this.AllStateList.StateName;
            //console.log('AllStateDistrictList = ', this.AllStateDistrictList);
            this.ObjMiddle.STATE = this.AllStateDistrictList.length ? this.AllStateDistrictList[0].STATE : undefined
            this.GetDistrict(this.AllStateDistrictList[0].DISTRICT);
            this.ObjMiddle.DISTRICT = this.AllStateDistrictList.length ? this.AllStateDistrictList[0].DISTRICT : undefined
           
           });
         }
}
getState(){
this.StateList = [];
const obj = {
  "SP_String": "SP_ENQ_Case_History",
  "Report_Name_String": "Get_State",
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  if(data.length){
   this.StateList = data;
   //console.log('StateList=====',this.StateList)
   this.ObjMiddle.STATE = this.StateList[27].STATE
  // console.log("this.ObjMiddle.STATE ",this.ObjMiddle.STATE )
   this.GetDistrict()
  }
 })
}
GetDistrict(change?){
this.DistrictList = [];
const tempobj = {
  statename : this.ObjMiddle.STATE,
}
const obj = {
  "SP_String": "SP_ENQ_Case_History",
  "Report_Name_String": "Get_District_List",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  if(data.length){
   this.DistrictList = data;
   //console.log('DistrictList=====',this.DistrictList)
   this.ObjMiddle.DISTRICT = change ? change : this.DistrictList[0].DISTRICT
  }
 })
}  
UpdateMiddleForm(valid:any){
this.PatientMiddleFormSubmitted = true;
const TempObj ={
  Foot_Fall_ID : this.ObjMiddle.Foot_Fall_ID,          
	Cost_Cen_ID : this.ObjMiddle.Cost_Cen_ID ,        		 		 
	Mobile: this.ObjMiddle.Mobile,            
	Mobile_2 : this.ObjMiddle.Mobile_2,            		
	Contact_Name :this.ObjMiddle.Contact_Name,             		 
	Gender:  this.ObjMiddle.Gender,                  
	Date_Of_Birth: this.DateService.dateConvert(new Date(this.Date_Of_Birth)),                    		
	Address: this.ObjMiddle.Address,                  				  
	District : this.ObjMiddle.DISTRICT,                 
	State : this.ObjMiddle.STATE,                                      
	Pin:  this.ObjMiddle.Pin,                  
	Email : this.ObjMiddle.Email,                 
}
if(valid){
  const obj = {
    "SP_String": "SP_ENQ_Case_History",
    "Report_Name_String" : "Edit_Patient",
   "Json_Param_String": JSON.stringify([TempObj])
  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    console.log(data);
    var tempID = data[0].Column1;
    if(data[0].Column1){
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Patient Details  ",
       detail: "Succesfully Update" //+ mgs
     });
     this.PatientMiddleFormSubmitted = false;
     this.ObjMiddle = new Middle();
     this.Date_Of_Birth = new Date();
      }
    }
  )}
} 
saveDataLast(valid:any){
  //console.log("saveDataLast==",valid)
this.PatientlastFormSubmitted = true;
// this.Active = false;
this.SaveAfter = true;
//console.log("MedicalProblemObj",this.MedicalProblemObj)
//this.ObjLast.Medical_Problems = Object.values(this.MedicalProblemObj).toString()
//console.log("this.ObjLast.Medical_Problems",this.ObjLast.Medical_Problems)
const TempObj ={
Is_Hearing_Check: this.ObjLast.Is_Hearing_Check,
Hearing_Check_Details: this.ObjLast.Hearing_Check_Details,
Hearing_Loss_Details :this.ObjLast.Hearing_Loss_Details,
Is_Ear_Infections :this.ObjLast.Is_Ear_Infections,
Ear_Infection_Side:this.ObjLast.Ear_Infection_Side,
Is_Suspect_Difficulty: this.ObjLast.Is_Suspect_Difficulty,
Is_Lost_Hearing_Suddenly:this.ObjLast.Is_Lost_Hearing_Suddenly,
Lost_Hearing_Suddenly_Side :this.ObjLast.Lost_Hearing_Suddenly_Side,
Is_Exp_Dizziness: this.ObjLast.Is_Exp_Dizziness,
Better_Ear:this.ObjLast.Better_Ear,
Is_Pain:this.ObjLast.Is_Pain,
Pain_Side:this.ObjLast.Pain_Side,
Is_Exp_Ringing: this.ObjLast.Is_Exp_Ringing,
Exp_Ringing_Side: this.ObjLast.Exp_Ringing_Side,
Is_Loud_Noise:this.ObjLast.Is_Loud_Noise,
Medical_Problems: this.SelectedMedicalProblems.toString(),
Medical_Problems_Other: this.ObjLast.Medical_Problems_Other,
Is_Treatment: this.ObjLast.Is_Treatment,
Treatment_Side: this.ObjLast.Treatment_Side,
Communication_Total_Score:this.TotalValue, 
Comm_1:this.ObjLast.Comm_1,
Comm_2:this.ObjLast.Comm_2,
Comm_3:this.ObjLast.Comm_3, 
Comm_4:this.ObjLast.Comm_4,
Comm_5:this.ObjLast.Comm_5,
Comm_6:this.ObjLast.Comm_6, 
Comm_7:this.ObjLast.Comm_7,
Comm_8:this.ObjLast.Comm_8,
Comm_9:this.ObjLast.Comm_9,
Comm_10: this.ObjLast.Comm_10,
Is_Hearing_Loss_Family:this.ObjLast.Is_Hearing_Loss_Family, 
Loss_Family_Who:this.ObjLast.Loss_Family_Who, 
Is_Other_Notice :this.ObjLast.Is_Other_Notice,
Important_To_Improve:this.ObjLast.Important_To_Improve, 
Is_Using_HA:this.ObjLast.Is_Using_HA,
HA_Name:this.ObjLast.HA_Name,
Confident_To_Ability:this.ObjLast.Confident_To_Ability, 
Is_Satisfy_Hearing_Status:this.ObjLast.Is_Satisfy_Hearing_Status, 
Case_Date : this.DateService.dateConvert(new Date(this.Case_Date)),
Audiologist_ID : this.ObjLast.Audiologist_ID,  
Foot_Fall_ID :this.ObjFirst.Foot_Fall_ID,        
}
if(valid){
  const obj = {
    "SP_String": "SP_ENQ_Case_History",
    "Report_Name_String" : "Create_ENQ_Case_History",
   "Json_Param_String": JSON.stringify([TempObj])
  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    //console.log(data);
    var tempID = data[0].Column1;
    if(data[0].Column1){
      
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Patient Details  ",
       detail: "Succesfully Save" //+ mgs
     });
     this.PatientlastFormSubmitted = false;
     this.ObjLast = new Last();
     this.Case_Date = new Date();
     this.MedicalProblemObj= {};
     this.ObjFirst.Foot_Fall_ID = undefined;
     this.Active =true;
     this.SaveAfter = false;
     this.TotalValue = 0
     this.SelectedMedicalProblems =undefined;
     this.CustomerRadioChange()
      }
    }
  )}
} 
GetPrint(){
  if (this.patientSearchList[0].Foot_Fall_ID) {
    window.open("/Report/Crystal_Files/CRM/joh_Form/Case_History.aspx?Foot_Fall_ID=" + this.patientSearchList[0].Foot_Fall_ID, 
    'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
    );
  }
}
Calculation(){
    this.TotalValue = 0
    let arrYes:any = [];
    let arrSometimes:any = [];
     this.ObjLast.Comm_1 == "Yes" ? arrYes.push("Yes") : this.ObjLast.Comm_1 == "Sometimes" ? arrSometimes.push("Sometimes") : ""
     this.ObjLast.Comm_2 == "Yes" ? arrYes.push("Yes") : this.ObjLast.Comm_2 == "Sometimes" ? arrSometimes.push("Sometimes") : "" 
     this.ObjLast.Comm_3 == "Yes" ? arrYes.push("Yes") : this.ObjLast.Comm_3 == "Sometimes" ? arrSometimes.push("Sometimes") : ""
     this.ObjLast.Comm_4 == "Yes" ? arrYes.push("Yes") : this.ObjLast.Comm_4 == "Sometimes" ? arrSometimes.push("Sometimes") : ""
     this.ObjLast.Comm_5 == "Yes" ? arrYes.push("Yes") : this.ObjLast.Comm_5 == "Sometimes" ? arrSometimes.push("Sometimes") : ""
     this.ObjLast.Comm_6 == "Yes" ? arrYes.push("Yes") : this.ObjLast.Comm_6 == "Sometimes" ? arrSometimes.push("Sometimes") : ""
     this.ObjLast.Comm_7 == "Yes" ? arrYes.push("Yes") : this.ObjLast.Comm_7 == "Sometimes" ? arrSometimes.push("Sometimes") : ""
     this.ObjLast.Comm_8 == "Yes" ? arrYes.push("Yes") : this.ObjLast.Comm_8 == "Sometimes" ? arrSometimes.push("Sometimes") : ""
     this.ObjLast.Comm_9 == "Yes" ? arrYes.push("Yes") : this.ObjLast.Comm_9 == "Sometimes" ? arrSometimes.push("Sometimes") : ""
     this.ObjLast.Comm_10 == "Yes" ? arrYes.push("Yes") : this.ObjLast.Comm_10 == "Sometimes" ? arrSometimes.push("Sometimes") : ""
    //console.log("arrYes",arrYes)  
    //console.log("arrSometimes",arrSometimes)
    this.TotalValue = Number(arrYes.length * 4) + Number(arrSometimes.length * 2)  
}
}
class First{
Lead_Details:any;
Foot_Fall_ID:any;
}
class Middle{
Contact_Name:any;
Foot_Fall_ID: any;
Gender :any;
Date_Of_Birth : any;
Address :any;
Pin :any;
STATE :any;
DISTRICT :any;
Mobile :any;
Mobile_2 :any;
Email :any;
Cost_Cen_ID:any;
Audiologist_ID :any;
}
class Last{
Case_ID: any;           	
Is_Hearing_Check: any;	 
Hearing_Check_Details: any;	
Hearing_Loss_Details: any;	
Is_Ear_Infections: any;	     
Ear_Infection_Side: any;	       
Is_Suspect_Difficulty: any;	     
Is_Lost_Hearing_Suddenly: any;	
Lost_Hearing_Suddenly_Side: any;	    
Is_Exp_Dizziness: any;	
Better_Ear: any;	
Is_Pain: any;	 
Pain_Side: any;   	
Is_Exp_Ringing: any;	  
Exp_Ringing_Side: any;	 
Is_Loud_Noise: any;	
Medical_Problems: any;	   
Medical_Problems_Other: any;	
Is_Treatment: any;	
Treatment_Side: any;	
Communication_Total_Score: any;	   
Comm_1: any;	    
Comm_2: any;	   
Comm_3: any;	  
Comm_4: any;	    
Comm_5: any;	   
Comm_6: any;	    
Comm_7: any;	    
Comm_8: any;	   
Comm_9: any;	   
Comm_10: any;	
Is_Hearing_Loss_Family: any;	 
Loss_Family_Who: any;	        
Is_Other_Notice: any;	  
Important_To_Improve: any;	
Is_Using_HA: any;	   
HA_Name: any;	            
Confident_To_Ability: any;	
Is_Satisfy_Hearing_Status: any;	
Case_Date: any;	  
Audiologist_ID: any;   
Foot_Fall_ID: any;
Audiologist_Name :any;	    
}
