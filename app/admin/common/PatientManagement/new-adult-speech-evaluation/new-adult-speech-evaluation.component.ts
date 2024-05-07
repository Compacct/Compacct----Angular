import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-adult-speech-evaluation',
  templateUrl: './new-adult-speech-evaluation.component.html',
  styleUrls: ['./new-adult-speech-evaluation.component.css'],
  providers: [MessageService,DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class NewAdultSpeechEvaluationComponent implements OnInit {
  items:any = [];
  tabIndexToView :number= 1;
  buttonname:string = "Create";
  Date_Top: Date = new Date();
  Date_Lower: Date = new Date(); 
  Date_of_surgeries_or_Accidents:Date = new Date();
  Objevaluation :evaluation = new evaluation();
  Spinner:boolean = false;
  aDULTCASEHISTORY :boolean = false;
  BrieflyDescribeList :any = [
    {'label':'Stuttering/Stammering','value':'Stuttering/Stammering'},
    {'label':'Dialect/pronunciation problems','value':'Dialect/pronunciation problems'},
    {'label':'Hoarse or weak voice','value':'Hoarse or weak voice'},
    {'label':'Swallowing problems','value':'Swallowing problems'},
    {'label':'Other voice problem','value':'Other voice problem'},
    {'label':'Mental retardation','value':'Mental retardation'},
    {'label':'Laryngectomy','value':'Laryngectomy'},
    {'label':'Dementia/Cognitive problems','value':'Dementia/Cognitive problems'},
    {'label':'Communication problems from stroke','value':'Communication problems from stroke'},
    {'label':'Hearing loss','value':'Hearing loss'},
    {'label':'Communication problem from head injury','value':'Communication problem from head injury'},
    {'label':'Cochlear implant','value':'Cochlear implant'}
  ];
  SelectedBrieflyDescribe :any = [];
  illnessList :any = [
    {'label':'High blood pressure','value':'High blood pressure'},
    {'label':'Drug abuse','value':'Drug abuse'},
    {'label':'Asthma','value':'Asthma'},
    {'label':'High cholesterol','value':'High cholesterol'},
    {'label':'Ear infections','value':'Ear infections'},
    {'label':'Vision problems','value':'Vision problems'},
    {'label':'Diabetes','value':'Diabetes'},
    {'label':'Heart problems','value':'Heart problems'},
    {'label':'Hearing problems','value':'Hearing problems'},
    {'label':'Smoking','value':'Smoking'},
    {'label':'Stroke','value':'Stroke'},
    {'label':'Learning problems','value':'Learning problems'},
    {'label':'Alcohol use','value':'Alcohol use'},
    {'label':'Head injury','value':'Head injury'},
    {'label':'Mental health problems','value':'Mental health problems'}
  ];
  SelectedBrillness:any =[];
  Param_Flag:any = undefined;
  patentdetails:any ={};
  AdressDetailsPent:any = undefined;
  browseList:any =[];
  browseListFliter:any =[];
  fot_id:any = undefined;
  constructor(
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    private ActivatedRoute: ActivatedRoute,
    private Header: CompacctHeader,
    private GlobalApi: CompacctGlobalApiService,
    private datePipe: DatePipe,
  ) { 
    this.ActivatedRoute.queryParams.subscribe((params:any)=>{
     this.Param_Flag = window.atob(params['Appo_ID']);
    })
  }
  ngOnInit() {
    this.Getpatient()
    this.getBrowse()
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "New Adult Speech Evaluation",
      Link: ""
    })
  }
  TabClick(e:any) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
    
  }
  clearData(){
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.aDULTCASEHISTORY = false;
    this.Objevaluation = new evaluation();
    this.SelectedBrieflyDescribe =[];
    this.SelectedBrillness = [];
  }
  getBrowse(){
    this.browseList =[]
    this.browseListFliter = []
    if (this.Param_Flag) {
      const obj = {
        "SP_String": "Sp_Adult_case_history",
        "Report_Name_String": "Get_adult_case_history",
        "Json_Param_String": JSON.stringify([{Appo_ID :this.Param_Flag}])
      }
      this.GlobalApi.getData(obj).subscribe((data: any) => {
        this.browseList = data ? data :[];
        this.browseListFliter = Object.keys(data[0])
        console.log("browseList", data);
      })
    }
  }
  Getpatient() {
    this.patentdetails ={}
    if (this.Param_Flag) {
      const obj = {
        "SP_String": "Sp_Adult_case_history",
        "Report_Name_String": "Get_Patient",
        "Json_Param_String": JSON.stringify([{Appo_ID :this.Param_Flag}])
      }
      this.GlobalApi.getData(obj).subscribe((data: any) => {
        this.patentdetails = data ? data[0] :{} ;
        this.AdressDetailsPent = Object.keys(this.patentdetails).length ? this.patentdetails.Address+' ,'+this.patentdetails.District+' ,'+this.patentdetails.State+' ,'+this.patentdetails.Country+' ,'+this.patentdetails.Pin : undefined;
      })
    }
  }
  saveData(valid:any){
    this.aDULTCASEHISTORY = true;
    if(valid){
      this.Objevaluation.Referred_condition = this.SelectedBrieflyDescribe.toString();
      this.Objevaluation.Cause_of_illness = this.SelectedBrillness.toString();
      this.Objevaluation.Appo_ID = this.Param_Flag ? this.Param_Flag : 0;
      this.Objevaluation.Foot_Fall_ID = this.patentdetails.Foot_Fall_ID ? this.patentdetails.Foot_Fall_ID : 0;
      this.Objevaluation.Date_of_surgeries_or_Accidents = this.DateService.dateConvert(this.Objevaluation.Date_of_surgeries_or_Accidents);
      this.Objevaluation.sign_date = this.DateService.dateConvert(this.Date_Lower);
      this.Objevaluation.Date = this.DateService.dateConvert(this.Date_Top);
      const obj = {
        "SP_String": "Sp_Adult_case_history",
        "Report_Name_String": "Create_adult_case_history",
        "Json_Param_String": JSON.stringify([this.Objevaluation])
      }
      this.GlobalApi.postData(obj).subscribe((data) => {      
          if (data[0].Column1) {         
           this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'Success',
              detail: "Succesfully"+ this.buttonname
            });
            this.clearData();
            this.tabIndexToView = 0
            this.patentdetails ={}
            this.AdressDetailsPent = undefined;
            this.getBrowse()
        } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "error",
              detail: "Error Occured"
            });
        }
        });
    }    
  }
  onReject(){
    this.compacctToast.clear();
  }
  EditSpeech(obj:any){
    this.patentdetails = {}
    this.Param_Flag = undefined;
    this.Objevaluation = new evaluation()
    this.SelectedBrieflyDescribe =[]
    this.SelectedBrillness =[]
    if(obj.Appo_ID){
    this.Param_Flag = obj.Appo_ID
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.tabIndexToView = 1
    this.Objevaluation = obj
    this.Objevaluation.Date_of_surgeries_or_Accidents = this.datePipe.transform(new Date(obj.Date_of_surgeries_or_Accidents),'yyyy-MM-dd')
    this.SelectedBrieflyDescribe = obj.Referred_condition.includes(',') ? obj.Referred_condition.split(',').map(el=> el) : [];
    this.SelectedBrillness = obj.Cause_of_illness.includes(',') ? obj.Cause_of_illness.split(',').map(elm=> elm)  : [];
    this.Getpatient()
    }
  }
  DeleteSpeech(Obj:any){
    this.Param_Flag = undefined
    this.fot_id = undefined;
    if(Obj.Appo_ID){
       this.Param_Flag = Obj.Appo_ID ;
       this.fot_id = Obj.Foot_Fall_ID;
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
    if(this.Param_Flag){
      const obj = {
        "SP_String": "Sp_Adult_case_history",
        "Report_Name_String": "Delete_adult_case_history",
        "Json_Param_String": JSON.stringify([{Appo_ID : this.Param_Flag,Foot_Fall_ID :this.fot_id}])
      }
      this.GlobalApi.getData(obj).subscribe((data:any)=>{
        if (data[0].Column1 === "Done"){
          this.onReject();
          this.getBrowse();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "ID: " + this.Param_Flag,
            detail: "Succesfully Deleted"
          });
         }
      })
    } 
  }
  PrintSpeech(objj:any){}

}
class evaluation{
  First_Name:any;
  Sur_Name:any;
  gender:any;
  age:any;
  mobile_no:any;
  Email:any;
  home_address:any;
  profession:any;
 //Send on create time
  Appo_ID:any;
  Foot_Fall_ID:any;
  Date:any;
  Ref_name:any;
  Briefly_description:any;
  Referred_condition:any;
  Referred_condition_other:any;
  Feeling_for_speech_hearing_problem:any;
  Childhood_speech_hearing_problem:string ='No';
  Describe_childhood_speech_hearing:any;
  Family_member_problem:string ='No';
  Describe_family_member_problem:any;
  Previous_testing_for_the_problem:any;
  What_circumstances_require_to_talk:any;
  Do_you_wearing_hearing_aids:string ='No';
  Do_you_wearing_dentures:string ='No';
  Do_you_wearing_eyeglasses:string ='No';
  Employer:any;
  Employer_job_description:any;
  Cause_of_illness:any;
  Any_surgeries_or_Accidents:any;
  List_of_all_medication_taken_regular:any;
  Do_you_have_paralysis:any;
  Additional_comments:any;
  Date_of_surgeries_or_Accidents:any;
  complete_form_person:any;
  sign_date:any;
  patient_sign:any;
}
