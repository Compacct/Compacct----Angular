import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-new-child-speech-evaluation',
  templateUrl: './new-child-speech-evaluation.component.html',
  styleUrls: ['./new-child-speech-evaluation.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NewChildSpeechEvaluationComponent implements OnInit {
  Spinner:boolean = false;
  items:any = [];
  tabIndexToView :number= 1;
  buttonname:string = "Create";
  ChildCaseHistoryFormSubmitted:boolean = false;
  Appo_ID:any;
  fot_id:any;
  ObjPateintDetails:any = {};
  ObjChildCaseHistory: ChildCaseHistory = new ChildCaseHistory();
  MedicalProblemsList:any = [];
  Selectedmedicalproblems:any = [];
  MyChildList:any = [];
  SelectedMychild:any = [];
  EatingMyChildList:any = [];
  SelectedWhileeatingmychild:any = [];
  DrinkingMyChildList:any = [];
  SelectedWhiledrinkingmychild:any = [];
  MapplytoyourChildList:any = [];
  SelectedBehaviourofchild:any = [];
  TypeofCommunicationList:any = [];
  SelectedTypeofcommunication:any = [];
  browseList:any =[];
  browseListFliter:any =[];

  constructor(
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    private route : ActivatedRoute,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private $CompacctAPI: CompacctCommonApi,
    private router : Router,
  ) {
    this.route.queryParams.subscribe(params => {
      console.log(params);
     this.Appo_ID = window.atob(params.Appo_ID);
      console.log ("Material_Type",this.Appo_ID);
     })
     this.Header.pushHeader({
      Header: "Pediatric Case History",
      Link: ""
    });
   }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Pediatric Case History",
      Link: ""
    })
    this.GetPatientDetails();
    this.GetMedicalProblems();
    this.GetMyChildList();
    this.GetEatingMyChildList();
    this.GetDrinkingMyChildList();
    this.GetBehaviourofChildList();
    this.GetTypeofCommunication();
    this.getBrowse();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
    
  }
  GetPatientDetails(){
    this.ObjPateintDetails = {};
    const obj = {
      "SP_String": "Sp_Adult_case_history",
      "Report_Name_String": "Get_Patient",
      "Json_Param_String": JSON.stringify([{Appo_ID:this.Appo_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ObjPateintDetails = data[0];
    console.log("Patient Details======",this.ObjPateintDetails);
  
    });
  }
  GetspeechlangheardiffDescribe(){
    if(!this.ObjChildCaseHistory.Is_any_history_of_speech_or_hearing_difficulties){
    this.ObjChildCaseHistory.Describe_history_of_speech_or_hearing_difficulties = undefined;
    }
  }
  GetdiffinschoolDescribe(){
    if(!this.ObjChildCaseHistory.Is_Difficulties_in_school){
    this.ObjChildCaseHistory.Describe_Difficulties_in_school = undefined;
    }
  }
  GetMedicalProblems(){
    this.MedicalProblemsList = [
      {'label':'frequent ear infections','value':'frequent_ear_infections'},
      {'label':'sleeping difficulty','value':'sleeping_difficulty'},
      {'label':'head injury','value':'head_injury'},
      {'label':'middle ear tubes','value':'middle_ear_tubes'},
      {'label':'thumb/finger sucking habits','value':'thumb_finger_sucking_habits'},
      {'label':'vision problem','value':'vision_problem'},
      {'label':'hearing problem','value':'hearing_problem'},
      {'label':'snoring','value':'snoring'},
      {'label':'serious illness','value':'serious_illness'},
      {'label':'frequent colds','value':'frequent_colds'},
      {'label':'mouth breathing','value':'mouth_breathing'},
      {'label':'serious accident','value':'serious_accident'},
      {'label':'high fevers','value':'high_fevers'},
      {'label':'tonsils removed','value':'tonsils_removed'},
      {'label':'allergies/anaphylaxis','value':'allergies_anaphylaxis'},
      {'label':'asthama','value':'asthama'},
      {'label':'adenoids removed','value':'adenoids_removed'},
      {'label':'surgery','value':'surgery'},
      {'label':'other','value':'other'}
    ]
  }
  GetMyChildList(){
    this.MyChildList = [
      {'label':'is breast-fed','value':'is_breast_fed'},
      {'label':'is bottle-fed','value':'is_bottle_fed'},
      {'label':'eats purees','value':'eats_purees'},
      {'label':'eats solids','value':'eats_solids'}
    ]
  }
  GetEatingMyChildList(){
    this.EatingMyChildList = [
      {'label':'needs help to feed','value':'needs_help_to_feed'},
      {'label':'self-feeds','value':'self_feeds'},
      {'label':'uses fingers','value':'uses_fingers'},
      {'label':'uses utensils','value':'uses_utensils'}
    ]
  }
  GetDrinkingMyChildList(){
    this.DrinkingMyChildList = [
      {'label':'takes a bottle','value':'takes_a_bottle'},
      {'label':'uses sippy cup','value':'uses_sippy_cup'},
      {'label':'uses regular cup','value':'uses_regular_cup'}
    ]
  }
  GetBehaviourofChildList(){
    this.MapplytoyourChildList = [
      {'label':'co-operative','value':'co_operative'},
      {'label':'attentive','value':'attentive'},
      {'label':'freindly/outgoing','value':'freindly_outgoing'},
      {'label':'shy/quite','value':'shy_quite'},
      {'label':'prefers to play alone','value':'prefers_to_play_alone'},
      {'label':'poor eye contact','value':'poor_eye_contact'},
      {'label':'easily frustrated','value':'easily_frustrated'},
      {'label':'impulsive','value':'impulsive'},
      {'label':'temper tantrums','value':'temper_tantrums'},
      {'label':'aggressive at times','value':'aggressive_at_times'},
      {'label':'behaviour difficult to manage','value':'behaviour_difficult_to_manage'},
      {'label':'unusual interest','value':'unusual_interest'}
    ]
  }
  GetTypeofCommunication(){
    this.TypeofCommunicationList = [
      {'label':'crying','value':'crying'},
      {'label':'guestures (e.g., pointing, pulling parents)','value':'guestures'},
      {'label':'sounds (e.g., babbling, grunting)','value':'sounds'},
      {'label':'single words (e.g., "mine", "shoe")','value':'single_words'},
      {'label':'2-3 words combinations (e.g., "want cookie", "mommy car")','value':'two_three_words_combinations'},
      {'label':'sentences (e.g., "I want my kitty", Where is my ball")','value':'sentences'}
    ]
  }
  saveData(valid:any){
    this.ChildCaseHistoryFormSubmitted = true;
    if(valid){
      this.ObjPateintDetails.Appo_date = this.DateService.dateConvert(new Date(this.ObjChildCaseHistory.Appo_date));
      this.ObjChildCaseHistory.Any_medical_problems = this.Selectedmedicalproblems.toString();
      this.ObjChildCaseHistory.Behaviour_of_child = this.SelectedBehaviourofchild.toString();
      this.ObjChildCaseHistory.My_child = this.SelectedMychild.toString();
      this.ObjChildCaseHistory.While_eating_my_child = this.SelectedWhileeatingmychild.toString();
      this.ObjChildCaseHistory.While_drinking_my_child = this.SelectedWhiledrinkingmychild.toString();
      this.ObjChildCaseHistory.Type_of_communication = this.SelectedTypeofcommunication.toString();
      this.ObjChildCaseHistory.Appo_ID = this.Appo_ID ? this.Appo_ID : 0;
      this.ObjChildCaseHistory.Foot_Fall_ID = this.ObjPateintDetails.Foot_Fall_ID ? this.ObjPateintDetails.Foot_Fall_ID : 0;
      this.ObjChildCaseHistory.Date = this.DateService.dateConvert(new Date(this.ObjChildCaseHistory.Date));
      const obj = {
        "SP_String": "sp_Child_case_history",
        "Report_Name_String": "Create_Child_Case_History",
        "Json_Param_String": JSON.stringify([this.ObjChildCaseHistory])
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {      
          if (data[0].Column1) {         
           this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'Success',
              detail: "Succesfully"+ this.buttonname
            });
            this.clearData();
            this.getBrowse();
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
  getBrowse(){
    this.browseList =[]
    this.browseListFliter = []
    if (this.Appo_ID) {
      const obj = {
        "SP_String": "sp_Child_case_history",
        "Report_Name_String": "Get_Child_Case_History",
        "Json_Param_String": JSON.stringify([{Appo_ID :this.Appo_ID}])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.browseList = data ? data :[];
        this.browseListFliter = Object.keys(data[0])
        console.log("browseList", data);
      })
    }
  }
  onReject(){
    this.compacctToast.clear();
  }
  EditSpeech(obj:any){
    this.ObjPateintDetails = {}
    this.Appo_ID = undefined;
    this.ObjChildCaseHistory = new ChildCaseHistory()
    this.SelectedBehaviourofchild =[]
    this.SelectedMychild =[]
    this.SelectedTypeofcommunication =[]
    this.SelectedWhiledrinkingmychild =[]
    this.SelectedWhileeatingmychild =[]
    this.Selectedmedicalproblems =[]
    if(obj.Appo_ID){
    this.Appo_ID = obj.Appo_ID
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.tabIndexToView = 1;
    this.ObjChildCaseHistory = obj;
    this.ObjChildCaseHistory.Appo_date = new Date(obj.Appo_date);
    this.SelectedBehaviourofchild = obj.Behaviour_of_child.includes(',') ? obj.Behaviour_of_child.split(',').map(el=> el) : [obj.Behaviour_of_child];
    this.Selectedmedicalproblems = obj.Any_medical_problems.includes(',') ? obj.Any_medical_problems.split(',').map(el=> el)  : [obj.Any_medical_problems];
    this.SelectedTypeofcommunication = obj.Type_of_communication.includes(',') ? obj.Type_of_communication.split(',').map(el=> el) : [obj.Type_of_communication];
    this.SelectedMychild = obj.My_child.includes(',') ? obj.My_child.split(',').map(el=> el)  : [obj.My_child];
    this.SelectedWhileeatingmychild = obj.While_eating_my_child.includes(',') ? obj.While_eating_my_child.split(',').map(el=> el) : [obj.While_eating_my_child];
    this.SelectedWhiledrinkingmychild = obj.While_drinking_my_child !== "" ? obj.While_drinking_my_child.includes(',') ? obj.While_drinking_my_child.split(',').map(el=> el)  : [obj.While_drinking_my_child] : [];
    this.ObjChildCaseHistory.Date = new Date(obj.Date)
    this.GetPatientDetails();
    }
  }
  DeleteSpeech(Obj:any){
    this.Appo_ID = undefined
    this.fot_id = undefined;
    if(Obj.Appo_ID){
       this.Appo_ID = Obj.Appo_ID ;
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
    if(this.Appo_ID){
      const obj = {
        "SP_String": "sp_Child_case_history",
        "Report_Name_String": "Delete_Child_Case_History",
        "Json_Param_String": JSON.stringify([{Appo_ID : this.Appo_ID,Foot_Fall_ID :this.fot_id}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if (data[0].Column1 === "Done"){
          this.onReject();
          this.getBrowse();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "ID: " + this.Appo_ID,
            detail: "Succesfully Deleted"
          });
         }
      })
    } 
  }
  clearData(){
    this.ChildCaseHistoryFormSubmitted = false;
    // this.ObjPateintDetails = {};
    this.GetPatientDetails();
    this.ObjPateintDetails.Appo_date = new Date();
    this.ObjChildCaseHistory = new ChildCaseHistory();
    this.ObjChildCaseHistory.Date = new Date();
    this.tabIndexToView = 0;
    this.buttonname = "Create";
    this.Selectedmedicalproblems = [];
    this.SelectedMychild = [];
    this.SelectedWhileeatingmychild = [];
    this.SelectedWhiledrinkingmychild = [];
    this.SelectedTypeofcommunication = [];
    // this.getBrowse();
    // this.router.navigate(['./New_Child_Speech_Evaluation']);
  }

}
class ChildCaseHistory{
  Appo_ID: any;
  Foot_Fall_ID: any;
  Appo_date:any = new Date();
  Referred_by: any;
  Family_member_names: any;
  Relationship_with_child: any;
  Child_age: any;
  Is_any_history_of_speech_or_hearing_difficulties: any;
  Describe_history_of_speech_or_hearing_difficulties: any;
  Is_Difficulties_in_school: any;
  Describe_Difficulties_in_school: any;
  Length_of_pregnancy: any;
  Birthweight_of_a_child: any;
  Any_complications_during_birthtime: any;
  Describe_complications: any;
  First_babble_of_child: any;
  Babble_not_yet: any;
  First_sit_alone: any;
  First_sit_alone_not_yet: any;
  First_words_of_child:any;
  First_words_not_yet: any;
  First_walk_alone: any;
  First_walk_alone_not_yet: any;
  First_combining_two_or_more_words: any;
  First_combining_more_words_not_yet: any;
  Become_first_toilet_trained: any;
  First_toilet_trained_not_yet: any;
  Any_medical_problems: any;
  Serious_illness: any;
  Serious_accident: any;
  Allergies_or_anaphylaxis: any;
  Surgery: any;
  Other_medical_history: any;
  Does_child_take_medications: any;
  List_of_medications: any;
  Is_Family_Doctor: any;
  Family_Doctor: any;
  Is_Psychologist: any;
  Psychologist: any;
  Is_Speech_language_pathologist: any;
  Speech_language_pathologist: any;
  Is_Occupational_Therapist: any;
  Occupational_Therapist: any;
  Is_Audiologist: any;
  Audiologist: any;
  Is_Physiotherapist: any;
  Physiotherapist: any;
  Is_ENT_Doctor: any;
  ENT_Doctor: any;
  Is_Best_Start: any;
  Best_Start: any;
  Is_Pediatrician: any;
  Pediatrician: any;
  Is_Triple_P: any;
  Triple_P: any;
  Is_Other_Specialist: any;
  Other_Specialist: any;
  Is_Other_Services: any;
  Other_Services: any;
  My_child: any;
  While_eating_my_child: any;
  While_drinking_my_child: any;
  Is_nursing_or_feeding_difficulties: any;
  Nursing_or_feeding_difficulties: any;
  Is_picky_or_unusual_eating_habits: any;
  Picky_or_unusual_eating_habits: any;
  Playing_with_other_children: any;
  Describe_playing: any;
  Enjoy_playing_with_others: any;
  Fav_activities_or_toys: any;
  Behaviour_of_child: any;
  Type_of_communication: any;
  Without_words_child_stopped_using_sounds: any;
  Without_words_child_is_trying_tell_you: any;
  Without_words_child_is_trying_tell_them: any;
  Without_words_child_understands_words_people_say: any;
  Without_words_child_answers_basic_questions: any;
  Without_words_child_follows_simple_directions: any;
  Child_stopped_using_sounds: any;
  Child_is_saying_you: any;
  Child_is_saying_others: any;
  Child_understands_you: any;
  Child_answers_basic_questions: any;
  Child_follows_simple_directions: any;
  Gestures_sounds_or_words_child_uses: any;
  Other_information: any;
  Goals_for_your_child: any;
  Form_completed_by: any;
  Date:any = new Date();
}


