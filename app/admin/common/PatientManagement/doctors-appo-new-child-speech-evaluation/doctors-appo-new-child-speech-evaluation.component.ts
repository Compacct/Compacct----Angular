import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { UpdateConsultancyComponent } from '../../../shared/compacct.components/compacct.forms/update-consultancy/update-consultancy.component';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-doctors-appo-new-child-speech-evaluation',
  templateUrl: './doctors-appo-new-child-speech-evaluation.component.html',
  styleUrls: ['./doctors-appo-new-child-speech-evaluation.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DoctorsAppoNewChildSpeechEvaluationComponent implements OnInit {
  tabIndexToView:number= 0;
  AppoIDvalue:number;
  EditPage:any;
  ChildSpeechEvaluationFormSubmitted:boolean= false;
  Spinner:boolean=false;
  // buttonname:any='Create';
  buttonname:any='Save';
  Level_1_Status:any=undefined;
  Level_2_Status:any=undefined;
  Level_3_Status:any=undefined;
  patientSearchList:any= [];
  CheckBoxRECOMMENDATION:any=[];
  Appo_Date:any;
  TestName:any='Child_Speech_Evaluation';
  buttonValid:boolean= true;
  Get_TXN_ID:any;
  EditDataList:any=[];
  CentreList: any= [];

  OralList:any= [];
  PrognosisList:any= [];
  LoudnessList:any= [];
  PitchList: any= [];
  QualityList: any= [];
  DurationList: any= [];
  ComprehensionList: any= [];
  ExpressionList: any= [];
  BehaviorList: any= [];
  YesNoList:any= [];
  CommunicationList:any= [];

  IfYes1: boolean= false;
  IfYes2: boolean= false;
  IfYes3: boolean= false;
  IfYes4: boolean= false;
  IfYes5: boolean= false;
  IfYes6: boolean= false;
  IfYes7: boolean= false;
  IfYes8: boolean= false;

  display:boolean = false;
  G_Name:string;



  ObjChildSpeech: ChildSpeech = new ChildSpeech();
  @ViewChild("consultancy", { static: false }) UpdateConsultancy: UpdateConsultancyComponent;
  constructor(
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute
  ) { 
    this.route.queryParams.subscribe(params => {
      // console.log("param",params);
      this.AppoIDvalue= params.Appo_ID;
      // console.log("AppoIDvalue",this.AppoIDvalue);
      this.EditPage=params.ed;
       // console.log("EditPage",this.EditPage);
      if(this.EditPage == 'y'){
          this.editData();
       } 
     })
  }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Child Speech Evaluation",
      Link: " Patient Management -> Child Speech Evaluation"
    });
    this.Appo_Date= new Date();
    this.GetAllDataAppoID();
    this.GetCostCentre();
    this.OralList=['Adequate','Inadequate'];
    this.PrognosisList=['Good','Fair','Poor'];
    this.LoudnessList=['Too Soft','Soft','Loud','Too Loud'];
    this.PitchList=['Low','High','Monopitch','Diplophonia'];
    this.QualityList=['Hoarse Voice','Harsh Voice','Breathy Voice'];
    this.DurationList=['Within Normal Limit','Mildly Impaired','Moderately Impaired','Severely Impaired'];
    this.ComprehensionList=['Words','Phrases','Simple Sentence','Complex Sentence'];
    this.ExpressionList=['Vocalizations','Words','Phrases','Simple Sentence','Complex Sentence'];
    this.BehaviorList= ['Often','Sometimes','Never'];
    this.YesNoList= ['Yes','No'];
    this.CommunicationList= ['Verbal','Non-Verbal','Both'];
  }

  GetCostCentre(){
    this.CentreList=[];
    const obj = {
      "SP_String": "sp_JOH_Validation_Processt",
      "Report_Name_String": "Get Cost Center" 
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log("Get Cost Center",data);
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Cost_Cen_Name,
          element['value'] = element.Cost_Cen_ID
        });
       this.CentreList = data;
      }
       else {
        this.CentreList = [];
      }
    });
  }

  GetAllDataAppoID(){
    //console.log("value of",this.AppoIDvalue);
    this.patientSearchList = [];
    const tempobj = {
      Appo_ID : this.AppoIDvalue,
    }
    const obj = {
      "SP_String": "SP_BL_Txn_Doctor_Appo_ABR",
      "Report_Name_String": "Get_All_Data",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //  console.log("GetAllDataAppoID",data);
      if(data.length){
        this.patientSearchList=data[0];

        this.ObjChildSpeech.Name=this.patientSearchList.Name;
        this.ObjChildSpeech.Sex=this.patientSearchList.Sex;
        this.ObjChildSpeech.Referredby=this.patientSearchList.Referredby;
        this.ObjChildSpeech.Age=this.patientSearchList.Age;

        this.ObjChildSpeech.Foot_Fall_ID=this.patientSearchList.Foot_Fall_ID;
        this.ObjChildSpeech.Cost_Cen_ID=this.patientSearchList.Cost_Cen_ID;
        this.ObjChildSpeech.Guardian_Name=this.patientSearchList.Guardian_Name;
        this.G_Name=this.patientSearchList.Guardian_Name;

        this.Appo_Date=this.patientSearchList.Appo_Dt ? this.patientSearchList.Appo_Dt : "-";
      }
    });
  }

  showModel(){
    this.display = true;
    this.G_Name = this.ObjChildSpeech.Guardian_Name;
  }

  Update_Guardian_Name(){
    // console.log("G_Name",this.G_Name);
    // console.log("Guardian_Name",this.ObjChildSpeech.Guardian_Name);
    // console.log("Foot_Fall_ID",this.ObjChildSpeech.Foot_Fall_ID);

    this.ObjChildSpeech.Guardian_Name= this.G_Name;

    const UpdateObj = {
      Foot_Fall_ID : this.ObjChildSpeech.Foot_Fall_ID,
      Guardian_Name : this.ObjChildSpeech.Guardian_Name           
    }
    const Uobj = {
      "SP_String": "SP_BL_Txn_Doctor_Appo_ABR",
      "Report_Name_String": "update_Guardian_Name",
      "Json_Param_String": JSON.stringify(UpdateObj)
    }

    this.GlobalAPI.postData(Uobj).subscribe((data: any) => {
      // console.log("Update Guardian Name",data);
      if (data[0].Column1){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Guardian Name Updated",
          detail: "Succesfully "
        });
      }
      else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message ",
          detail:"Error occured "
        });
      }
    });
    this.GetAllDataAppoID();
    this.display=false;

  }

  updateConsultancysave(event){
    // console.log('event value',event);
    // console.log('event1',event.Level_1_Status);
    this.Level_1_Status=event.Level_1_Status;
    this.Level_2_Status=event.Level_2_Status;
    this.Level_3_Status=event.Level_3_Status;
  }

  saveDocAppo(valid:any){
    //console.log('CheckBoxRECOMMENDATION value',this.CheckBoxRECOMMENDATION);
    let tempSaveJ1:any= [];
    if(this.CheckBoxRECOMMENDATION.length){
      this.CheckBoxRECOMMENDATION.forEach((ele:any) => {
        tempSaveJ1.push({
          Recommend : ele
      })
      });
    }
    //  console.log("tempSaveJ1",tempSaveJ1);

    const tempSaveJ2 = {
      Appo_ID : this.AppoIDvalue
    }
  //  console.log("tempSaveJ2",tempSaveJ2);

     const tempSaveJ3 = {
      Test_Name : this.TestName
    }
  //  console.log("tempSaveJ3",tempSaveJ3);

    this.ObjChildSpeech.Appo_ID= this.AppoIDvalue;
    this.ObjChildSpeech.Posted_By= this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjChildSpeech.Posted_On= this.DateService.dateConvert(new Date());

    this.ObjChildSpeech.Txn_Date= this.Appo_Date;

    // console.log("ObjFLUENCY",this.ObjChildSpeech);

    this.ChildSpeechEvaluationFormSubmitted=true;
    if(valid){
      this.Spinner=true;
      const obj = {
        "SP_String": "SP_BL_Txn_Doctor_Appo_ALL",
        "Report_Name_String": "Create_BL_Txn_Doctors_Appo_Test",
        "Json_Param_String": JSON.stringify(this.ObjChildSpeech),
        "Json_1_String": JSON.stringify(tempSaveJ1),
        "Json_2_String": JSON.stringify(tempSaveJ2),
        "Json_3_String": JSON.stringify(tempSaveJ3)
       }
 
       this.GlobalAPI.postData(obj).subscribe((data: any) => {
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
      Appo_ID: this.AppoIDvalue,
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

    this.GlobalAPI.postData(obj2).subscribe((data: any) => {
      // console.log("save data2",data);
      //  var msg= this.EditPage ?  "update" : "create";
      var msg= "Save";
       if (data[0].Column1){
         this.Spinner=false;
         this.buttonValid = false;
         this.ChildSpeechEvaluationFormSubmitted=false;
         this.compacctToast.clear();
         this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Appointment " +msg,
           detail: "Succesfully "
         });
          if(this.EditPage != 'y'){
           this.ClearData();
          //  this.UpdateConsultancy.clearComData();
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

  ClearData(){
    this.CheckBoxRECOMMENDATION= [];
    this.ObjChildSpeech = new ChildSpeech();
    this.ShowYes();
    this.GetAllDataAppoID();
  }

  editData(){
    this.CheckBoxRECOMMENDATION=[];
    const TempEditObj={
      Appo_ID: this.AppoIDvalue,
      Test_Name: this.TestName
    }
  // console.log("TempEditObj",TempEditObj);
    // this.buttonname='Edit';
    this.buttonname='Save';
    const Editobj = {
      "SP_String": "SP_BL_Txn_Doctor_Appo_ALL",
      "Report_Name_String": "Retrieve_BL_Txn_Doctor_Appo_ALL_Data_Multiple_Test",
      "Json_Param_String": JSON.stringify(TempEditObj)
    }
    this.GlobalAPI.getData(Editobj).subscribe((data: any) => {
      // console.log("Edit Data",data);

      this.EditDataList= JSON.parse(data[0].Test_Details);  
      // console.log("EditDataList",this.EditDataList);

      this.ObjChildSpeech=  this.EditDataList;
      this.ShowYes();

      this.Get_TXN_ID=data[0].Txn_ID;
      // console.log("check Get_TXN_ID",this.Get_TXN_ID);
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
    this.GlobalAPI.getData(Recmdobj).subscribe((data: any) => {
      // console.log("Edit Data2",data);
      let BoxArray:any = [];
      data.forEach((ele:any) => {
        BoxArray.push(ele.Recommend)
      });
    this.CheckBoxRECOMMENDATION= BoxArray;
      // console.log("this.CheckBoxRECOMMENDATION===",this.CheckBoxRECOMMENDATION);
    });
  }

  ShowYes(){
    if(this.ObjChildSpeech.pregnancy == 'Poor'){
      this.IfYes1=true;
    }
    else{
      this.IfYes1=false;
      this.ObjChildSpeech.pregnancy_Yes=undefined;
    }
    if(this.ObjChildSpeech.pregnancy_full == 'No'){
      this.IfYes2=true;
    }
    else{
      this.IfYes2=false;
      this.ObjChildSpeech.pregnancy_full_Yes=undefined;
    }
    if(this.ObjChildSpeech.delivery == 'No'){
      this.IfYes3=true;
    }
    else{
      this.IfYes3=false;
      this.ObjChildSpeech.delivery_Yes=undefined;
    }
    if(this.ObjChildSpeech.children == 'No'){
      this.IfYes4=true;
    }
    else{
      this.IfYes4=false;
      this.ObjChildSpeech.children_Yes=undefined;
    }
    if(this.ObjChildSpeech.smile == 'No'){
      this.IfYes5=true;
    }
    else{
      this.IfYes5=false;
      this.ObjChildSpeech.smile_Yes=undefined;
    }
    if(this.ObjChildSpeech.friends == 'No'){
      this.IfYes6=true;
    }
    else{
      this.IfYes6=false;
      this.ObjChildSpeech.friends_Yes=undefined;
    }
    if(this.ObjChildSpeech.during == 'No'){
      this.IfYes7=true;
    }
    else{
      this.IfYes7=false;
      this.ObjChildSpeech.during_Yes=undefined;
    }
    if(this.ObjChildSpeech.environments == 'No'){
      this.IfYes8=true;
    }
    else{
      this.IfYes8=false;
      this.ObjChildSpeech.environments_Yes=undefined;
    }
  }

  onConfirm(){
  }

  onReject(){ 
    this.compacctToast.clear("c");  
  }



}


class ChildSpeech{
  Name: any;
  Sex: any;
  Referredby:any;
  Age: any;

  Foot_Fall_ID: any;
  Txn_Date: any; 
  Cost_Cen_ID: any;
  Guardian_Name: any;

  Appo_ID: any; 
  Posted_By: any;
  Posted_On: any;

  Language1: any;

  Statement1: any;

  pregnancy: any;
  pregnancy_Yes: any;
  pregnancy_full: any;
  pregnancy_full_Yes: any;
  delivery: any;
  delivery_Yes: any;
  incubator: any;
  jaundice: any;
  Seizures: any;
  birth: any;
  Infections: any;
  Feeding: any;
  fever: any;
  Seizures1: any;
  Trauma: any;
  cough: any;
  Hearing1: any;
  hospital: any;

  Control1: any;
  Crawling: any;
  RollOver: any;
  Sitting: any;
  Standing: any;
  Walking: any;
  Bladder: any;

  children: any;
  children_Yes: any;
  smile: any;
  smile_Yes: any;
  friends: any;
  friends_Yes: any;
  during: any;
  during_Yes: any;
  environments: any;
  environments_Yes: any;
  child_check: any =[];

  quiet: any;
  fidgety: any;
  upset: any;
  rock: any;
  messy: any;
  bump: any;
  oneself: any;
  difficult: any;
  distracted: any;
  safety1: any;
  enjoy: any;
  books: any;
  describe: any;

  Babbling: any;
  first1: any;
  together: any;
  sentences: any;
  Engage: any;
  directions: any;

  Communication: any;

  Comprehension: any;
  Expression: any;

  Comprehension1: any =[];
  Expression1: any =[];

  Structurally_Lips: any;
  Functionally_Lips: any;
  Structurally_Tongue: any;
  Functionally_Tongue: any;
  Structurally_Teeth: any;
  Functionally_Teeth: any;
  Structurally_Hard_Palate: any;
  Functionally_Hard_Palate: any;
  Structurally_Soft_Palate: any;
  Functionally_Soft_Palate: any;
  Structurally_Mandible: any;
  Functionally_Mandible: any;
  Comment: any;

  Loudness: any;
  Pitch: any;
  Quality: any;
  Duration: any;

  Behaviour: any;
  Social: any;
  Hearing: any;
  Articulation: any;
  Receptive: any;
  Expressive: any;
  Cognition: any;
  Fluency: any;
  Breathing: any;
  Resonance: any;
  Prosody: any;
  Phonological: any;

  Assessment: any;

  Final_Comment: any;

  Diagnosis: any;

  Prognosis: any;

}
