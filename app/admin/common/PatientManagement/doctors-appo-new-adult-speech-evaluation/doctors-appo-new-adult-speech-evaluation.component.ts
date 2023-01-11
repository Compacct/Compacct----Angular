import { Component, OnInit,ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { UpdateConsultancyComponent } from "../../../shared/compacct.components/compacct.forms/update-consultancy/update-consultancy.component";


@Component({
  selector: 'app-doctors-appo-new-adult-speech-evaluation',
  templateUrl: './doctors-appo-new-adult-speech-evaluation.component.html',
  styleUrls: ['./doctors-appo-new-adult-speech-evaluation.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class DoctorsAppoNewAdultSpeechEvaluationComponent implements OnInit {

  tabIndexToView:number=0;
  AppoID:any;
  TestName:any = 'Adult_Speech_Evaluation';
  Editable:any;
  CentreList:any = [];
  SymptomDropdown:any = [];
  PreMorbidStatus:any = [];
  OralMotorAssessment:any = [];
  PrognosisList:any = [];
  Duration:any = [];
  Pitch:any = [];
  Loudness:any = [];
  Quality:any = [];
  CheckBoxRecommendation:any = [];
  EditDataList:any = [];
  Get_TXN_ID:any;
  buttonValid:boolean = true;
  Spinner:boolean = false;

  Level_1_Status:any;
  Level_2_Status:any;
  Level_3_Status:any;

ObjAdultSpeech:any = new AdultSpeech();
@ViewChild("consultancy", { static: false }) UpdateConsultancy: UpdateConsultancyComponent;
  constructor(
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    private ActivatedRoute: ActivatedRoute,
    private Header: CompacctHeader,
    private GlobalApi: CompacctGlobalApiService,
    private $CompacctAPI: CompacctCommonApi
  ) {
    this.ActivatedRoute.queryParams.subscribe((params: any) => {
      this.AppoID = params.Appo_ID;
      // console.log('Appo_ID', this.AppoID);
      this.Editable = params.ed;
      // console.log('Editable',this.Editable);

      // console.log('params',params);
      if (this.Editable == "y") {
        this.editData();
      }
    });

   }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "ADULT SPEECH AND LANGUAGE EVALUATION REPORT",
      Link: "Patient Management -> ADULT SPEECH AND LANGUAGE EVALUATION REPORT",
    });
    this.SymptomDropdown = ['Often', 'Sometimes', 'Never'];
    this.PreMorbidStatus = ['Verbal','Non-Verbal','Both'];
    this.OralMotorAssessment = ['Adequate','Inadequate'];
    this.PrognosisList = ['Good','Fair','Poor'];
    this.Duration = ['Within Normal Limit','Mildly Impaired', 'Moderately Impaired', 'Severely Impaired'];
    this.Pitch = ['Low','High','Monopitch','Diplophonia'];
    this.Loudness = ['Too Soft','Soft','Loud','Too Loud'];
    this.Quality = ['Hoarse Voice','Harsh Voice','Breathy Voice'];

    this.getDataAgainstAppoId();
    this.getCenterList();

  }

  updateConsultancysave(event){
    // console.log('event value',event);
    // console.log('event1',event.Level_1_Status);
    this.Level_1_Status=event.Level_1_Status;
    this.Level_2_Status=event.Level_2_Status;
    this.Level_3_Status=event.Level_3_Status;
  }

  getDataAgainstAppoId() {
    const tempobj = {
      Appo_ID: this.AppoID,
    };
    const obj = {
      SP_String: "SP_BL_Txn_Doctor_Appo_ABR",
      Report_Name_String: "Get_All_Data",
      Json_Param_String: JSON.stringify([tempobj]),
    };
    this.GlobalApi.getData(obj).subscribe((data: any) => {
      // console.log('data against appoid', data);
      if (data.length) {
        // this.AppoIDdata=data;
        this.ObjAdultSpeech.Name = data[0].Name;
        this.ObjAdultSpeech.Foot_Fall_ID = data[0].Foot_Fall_ID;
        this.ObjAdultSpeech.Age = data[0].Age;
        this.ObjAdultSpeech.Sex = data[0].Sex;
        this.ObjAdultSpeech.ReferredBy = data[0].Referredby;
        this.ObjAdultSpeech.Txn_Date = data[0].Appo_Dt;
        this.ObjAdultSpeech.Cost_Cent_ID = data[0].Cost_Cen_ID;
      }
    });
  }

  getCenterList() {
    this.CentreList = [];
    const obj = {
      SP_String: "sp_JOH_Validation_Processt",
      Report_Name_String: "Get Cost Center",
    };
    this.GlobalApi.getData(obj).subscribe((data: any) => {
      // console.log(data);
      // console.log('center list',data);
      if (data.length) {
        data.forEach((element) => {
          (element["label"] = element.Cost_Cen_Name),
            (element["value"] = element.Cost_Cen_ID);
        });
        this.CentreList = data;
      }
    });
  }

  saveDocAppo(valid){
    // console.log(this.ObjAdultSpeech,this.CheckBoxRecommendation);
    this.ObjAdultSpeech.Appo_ID = this.AppoID;
    this.ObjAdultSpeech.Posted_By = this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjAdultSpeech.Posted_On = this.DateService.dateConvert(new Date());

    
    let tempSaveJ1:any= [];
    if(this.CheckBoxRecommendation.length){
      this.CheckBoxRecommendation.forEach((ele:any) => {
        tempSaveJ1.push({
          Recommend : ele
      })
      });
    }
    const TempObj = this.ObjAdultSpeech
    const tempSaveJ2 = {
      Appo_ID : this.AppoID
    }
    const tempSaveJ3 = {
      Test_Name : this.TestName
    }

    if(valid){
      this.Spinner=true;
      const obj = {
        "SP_String": "SP_BL_Txn_Doctor_Appo_ALL",
        "Report_Name_String": "Create_BL_Txn_Doctors_Appo_Test",
        "Json_Param_String": JSON.stringify(TempObj),
        "Json_1_String": JSON.stringify(tempSaveJ1),
        "Json_2_String": JSON.stringify(tempSaveJ2),
        "Json_3_String": JSON.stringify(tempSaveJ3)
      }
      this.GlobalApi.postData(obj).subscribe((data: any) => {
       // console.log("save data",data);
        if (data[0].Column1){
          
          this.saveStatus();
        }
        else {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail:"Error occured "
          });
        }
      });
 
     }

  }
  saveStatus(){
    const TempObj2={
      Appo_ID: this.AppoID,
      Level_1_Status: this.Level_1_Status,
      Level_2_Status: this.Level_2_Status,
      Level_3_Status: this.Level_3_Status
    }
    // console.log("TempObj2",TempObj2);

    const obj2 = {
      "SP_String": "sp_DoctorsAppointmentNew",
      "Report_Name_String": "Update_Consultancy_Done",
      "Json_Param_String": JSON.stringify(TempObj2),
    }  

    this.GlobalApi.postData(obj2).subscribe((data: any) => {
      // console.log("save data2",data);
       if (data[0].Column1){
         this.Spinner=false;
         this.buttonValid = false;
        
         this.compacctToast.clear();
         this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Appointment Save",
           detail: "Succesfully "
         });
          if(this.Editable != 'y'){
           this.clear();
         }
       }
       else {
         this.Spinner = false;
         this.compacctToast.clear();
         this.compacctToast.add({
           key: "compacct-toast",
           severity: "error",
           summary: "Warn Message ",
           detail:"Error occured "
         });
       }
     });
  }

  editData(){
// console.log('edit works');
this.CheckBoxRecommendation=[];
const TempEditObj={
  Appo_ID: this.AppoID,
  Test_Name: this.TestName
}
    const Editobj = {
      "SP_String": "SP_BL_Txn_Doctor_Appo_ALL",
      "Report_Name_String": "Retrieve_BL_Txn_Doctor_Appo_ALL_Data_Multiple_Test",
      "Json_Param_String": JSON.stringify(TempEditObj)
    }
    this.GlobalApi.getData(Editobj).subscribe((data: any) => {
      // console.log("Edit Data",data);
      this.EditDataList= JSON.parse(data[0].Test_Details);
      // console.log("EditDataList",this.EditDataList);
      this.ObjAdultSpeech = this.EditDataList;
      this.Get_TXN_ID=data[0].Txn_ID;
      // console.log("Get_TXN_ID",this.Get_TXN_ID);
      this.editData1(this.Get_TXN_ID);
    });

  }

  editData1(TXN_ID){
    const TempTxnIDObj={
      Txn_ID: TXN_ID,
      Test_Name : this.TestName
    }
    const Recmdobj = {
      "SP_String": "SP_BL_Txn_Doctor_Appo_ALL",
      "Report_Name_String": "Retrieve_BL_Txn_Doctor_Appo_ABR_Recommend_Data",
      "Json_Param_String": JSON.stringify(TempTxnIDObj)
    }
    this.GlobalApi.getData(Recmdobj).subscribe((data: any) => {
      // console.log("Edit Data2",data);
      let BoxArray:any = [];
      data.forEach((ele:any) => {
        BoxArray.push(ele.Recommend)
      });
    this.CheckBoxRecommendation= BoxArray;
      // console.log("recomendation checkbox",this.CheckBoxRecommendation);
      
    });
  }
  clear(){
    this.ObjAdultSpeech= new AdultSpeech();
    this.getDataAgainstAppoId();
    this.CheckBoxRecommendation = [];
  }

  onConfirm(){

  }
  onReject(){
this.compacctToast.clear();
  }

}
class AdultSpeech{
  Name:any;
  Foot_Fall_ID:any;
  Age:any;
  Sex:any;
  ReferredBy:any;
  Txn_Date:any;
  Appo_ID:any;
  Cost_Cent_ID:any;
  Posted_By:any;
  Posted_On:any;
  Language1:any;
// Symptom
  General_Complaint:any;

  Hearing_difficulty:any;
  Difficulty_inspeaking_fluently:any;
  Difficulty_in_speaking_in_3:any;
  Difficulty_in_expressing:any;
  Difficulty_in_understanding:any;
  Difficulty_in_pronouncing:any;
  Other_people_find_difficult:any;
  Difficulty_in_solving:any;
  Difficulty_in_focusing:any;
  Difficulty_in_reading:any;
  Difficulty_in_finding:any;
  Maintaining_topic:any;
  Following_directions:any;
  Oral_motor_weakness:any;
  Oro_Facial_Anomalies:any;
  Voice_quality:any;
  Any_other:any;

  Medical_History:any;

  Pre_Morbid_Status:any;

  OralMotorAssessment_lips_Structurally:any;
  OralMotorAssessment_lips_Functionally:any;
  OralMotorAssessment_Tongue_Structurally:any;
  OralMotorAssessment_Tongue_Functionally:any;
  OralMotorAssessment_Teeth_Structurally:any;
  OralMotorAssessment_Teeth_Functionally:any;
  OralMotorAssessment_HardPalate_Structurally:any;
  OralMotorAssessment_HardPalate_Functionally:any;
  OralMotorAssessment_SoftPalate_Structurally:any;
  OralMotorAssessment_SoftPalate_Functionally:any;
  OralMotorAssessment_Mandible_Structurally:any;
  OralMotorAssessment_Mandible_Functionally:any;
  OralMotorAssessment_Comment:any;

  Swallowing_Examination_Liquid_Response:any;
  Swallowing_Examination_Liquid_Duration:any;
  Swallowing_Examination_Semisolid_Response:any;
  Swallowing_Examination_Semisolid_Duration:any;
  Swallowing_Examination_Solid_Response:any;
  Swallowing_Examination_Solid_Duration:any;
  Swallowing_Examinationt_Comment:any;

  Phonation_Duration:any;
  Phonation_Pitch:any;
  Phonation_Loudness:any;
  Phonation_Quality:any;
  Speech_Pitch:any;
  Speech_Loudness:any;
  Speech_Quality
  AMRs_p:any;
  AMRs_t:any;
  AMRs_k:any;
  SMRs_p_t_k:any;
  Voice_MPT:any;
  Voice_S_Z_Ratio:any;
  voice_comment:any;

  Informal_Observation_Hearing:any;
  Informal_Observation_Oral_Facial:any;
  Informal_Observation_Articulation:any;
  Informal_Observation_Spontaneous_Speech:any;
  Informal_Observation_Cognition:any;
  Informal_Observation_Naming:any;
  Informal_Observation_Repetition:any;
  Informal_Observation_Fluency:any;
  Informal_Observation_Auditory_Comprehension:any;
  Informal_Observation_Voice:any;
  Informal_Observation_Resonance:any;
  Informal_Observation_Prosody:any;
  Informal_Observation_Comment:any;

  Formal_Assessment_Finding:any;

  Comment:any;

  Provisional_diagnosis:any;

  Prognosis:any;
}
