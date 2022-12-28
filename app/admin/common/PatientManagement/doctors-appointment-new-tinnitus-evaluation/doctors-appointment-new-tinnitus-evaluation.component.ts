import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-doctors-appointment-new-tinnitus-evaluation',
  templateUrl: './doctors-appointment-new-tinnitus-evaluation.component.html',
  styleUrls: ['./doctors-appointment-new-tinnitus-evaluation.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DoctorsAppointmentNewTinnitusEvaluationComponent implements OnInit {
  tabIndexToView:number= 0;
  GenderList:any=[];
  AppoIDvalue:number;
  EditPage:any;
  TinnitusEvaluationFormSubmitted:boolean= false;
  Spinner:boolean=false;
  // buttonname:any='Create';
  buttonname:any='Save';
  Level_1_Status:any=undefined;
  Level_2_Status:any=undefined;
  Level_3_Status:any=undefined;
  patientSearchList:any= [];
  CheckBoxRECOMMENDATION:any=[];
  CentreList:any=[];
  Appo_Date:any;
  TestName:any='Tinnitus_Evaluation';
  buttonValid:boolean= true;
  Get_TXN_ID:any;
  EditDataList:any=[];
  NatureSoundList: any= [];
  FindTinnitusList: any =[];
  LoudNoisesList: any =[];
  SuddenLoudNoisesList: any =[];
  YesNoList: any= [];
  // DisOrderList: any= [];
  ProblemList: any=[];
  IfYes1: boolean =false;
  IfYes2: boolean =false;
  IfYes3: boolean =false;
  IfYes4: boolean =false;
  IfYes5: boolean =false;
  IfYes6: boolean =false;
  IfYes7: boolean =false;
  CheckBoxSelect:any =[];

  ObjAppoID: AppoID = new AppoID();
  ObjTinnitusEvaluation: TinnitusEvaluation = new TinnitusEvaluation();
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
      Header: "Tinnitus Evaluation",
      Link: " Patient Management -> Tinnitus Evaluation"
    });
    this.GenderList=['Male','Female','Other'];
    this.Appo_Date= new Date();
    this.GetCostCentre();
    this.GetAllDataAppoID();
    this.NatureSoundList=['Ringing','Buzzing','Roaring','Humming','Intermittent','Consistent'];
    this.FindTinnitusList=['Right','Center','Left'];
    this.LoudNoisesList= ['Work places noise','industrial noise'];
    this.SuddenLoudNoisesList= ['Gunshot','explosion','concert','function'];
    this.YesNoList= ['Yes', 'No'];
    // this.DisOrderList=['Cancer','Infectious diseases','Renal disorders',' Excessive stress','cardiovascular disorders'];
    this.ProblemList=['Hearing difficulties','Tinnitus','Increased sensitivity to sounds'];
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
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
    // console.log("GetAllDataAppoID",data);
      if(data.length){
        this.patientSearchList=data;

        this.ObjAppoID.Name=this.patientSearchList[0].Name;
        this.ObjAppoID.PatientID=this.patientSearchList[0].Foot_Fall_ID;
        this.ObjAppoID.Sex=this.patientSearchList[0].Sex;
        this.ObjAppoID.RefferedBy=this.patientSearchList[0].Referredby;
        this.ObjAppoID.Age=this.patientSearchList[0].Age;
        this.ObjAppoID.Centre=this.patientSearchList[0].Cost_Cen_ID;
        this.Appo_Date=this.patientSearchList[0].Appo_Dt ? this.patientSearchList[0].Appo_Dt : "-";
      }
    });
  }

  saveDocAppo(valid:any){
    // console.log("CheckBoxSelect",this.CheckBoxSelect);
    //console.log('CheckBoxRECOMMENDATION value',this.CheckBoxRECOMMENDATION);
    let tempSaveJ1:any= [];
    if(this.CheckBoxRECOMMENDATION.length){
      this.CheckBoxRECOMMENDATION.forEach((ele:any) => {
        tempSaveJ1.push({
          Recommend : ele
      })
      });
    }
    // console.log("tempSaveJ1",tempSaveJ1);

    const TempObj ={
      Foot_Fall_ID: this.ObjAppoID.PatientID,
      Appo_ID: this.AppoIDvalue,
      Txn_Date: this.Appo_Date,
      Cost_Cent_ID: this.ObjAppoID.Centre,
      Posted_By: this.$CompacctAPI.CompacctCookies.User_ID,
      Posted_On: this.DateService.dateConvert(new Date()),
      Nature_Sound: this.ObjTinnitusEvaluation.Nature_Sound,
      Find_Tinnitus: this.ObjTinnitusEvaluation.Find_Tinnitus,
      Sound_Sensation: this.ObjTinnitusEvaluation.Sound_Sensation,
      Tinnitus_Disturbing: this.ObjTinnitusEvaluation.Tinnitus_Disturbing,
      Tinnitus_Treatment: this.ObjTinnitusEvaluation.Tinnitus_Treatment,
      Loud_Noises: this.ObjTinnitusEvaluation.Loud_Noises,
      Sudden_Loud_Noises: this.ObjTinnitusEvaluation.Sudden_Loud_Noises,
      Alcohol_Cleaner: this.ObjTinnitusEvaluation.Alcohol_Cleaner,
      Alcohol_Cleaner_Yes: this.ObjTinnitusEvaluation.Alcohol_Cleaner_Yes,
      Hypotension: this.ObjTinnitusEvaluation.Hypotension,
      Trauma: this.ObjTinnitusEvaluation.Trauma,
      Trauma_Yes: this.ObjTinnitusEvaluation.Trauma_Yes,
      Undergone_Surgery: this.ObjTinnitusEvaluation.Undergone_Surgery,
      Undergone_Surgery_Yes: this.ObjTinnitusEvaluation.Undergone_Surgery_Yes,
      DisOrder: this.CheckBoxSelect,
      Migraine: this.ObjTinnitusEvaluation.Migraine,
      Sleep: this.ObjTinnitusEvaluation.Sleep,
      Stress_Level: this.ObjTinnitusEvaluation.Stress_Level,
      Smoke: this.ObjTinnitusEvaluation.Smoke,
      Smoke_Yes: this.ObjTinnitusEvaluation.Smoke_Yes,
      Health_Issues: this.ObjTinnitusEvaluation.Health_Issues,
      Health_Issues_Yes: this.ObjTinnitusEvaluation.Health_Issues_Yes,
      Background_Noise: this.ObjTinnitusEvaluation.Background_Noise,
      Infections: this.ObjTinnitusEvaluation.Infections,
      Group_Conversations: this.ObjTinnitusEvaluation.Group_Conversations,
      Particular_Sound: this.ObjTinnitusEvaluation.Particular_Sound,
      Particular_Sound_Yes: this.ObjTinnitusEvaluation.Particular_Sound_Yes,
      Louder: this.ObjTinnitusEvaluation.Louder,
      Louder_Yes: this.ObjTinnitusEvaluation.Louder_Yes,
      Arrange_1: this.ObjTinnitusEvaluation.Arrange_1,
      Arrange_2: this.ObjTinnitusEvaluation.Arrange_2,
      Arrange_3: this.ObjTinnitusEvaluation.Arrange_3
    }
     // console.log("TempObj",TempObj);

    const tempSaveJ2 = {
      Appo_ID : this.AppoIDvalue
    }
  //  console.log("tempSaveJ2",tempSaveJ2);

     const tempSaveJ3 = {
      Test_Name : this.TestName
    }
  //  console.log("tempSaveJ3",tempSaveJ3);

  this.TinnitusEvaluationFormSubmitted=true;
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
   this.GlobalAPI.postData(obj).subscribe((data: any) => {
    // console.log("save data",data);
    // var msg= this.EditPage ?  "update" : "create";
    var msg= "Save";
     if (data[0].Column1){
      this.Spinner=false;
      this.buttonValid = false;
      this.TinnitusEvaluationFormSubmitted=false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Appointment " +msg,
        detail: "Succesfully "
      });
        if(this.EditPage != 'y'){
        this.ClearData();
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
  }

  ClearData(){
    this.ObjTinnitusEvaluation.Nature_Sound= undefined;
    this.ObjTinnitusEvaluation.Find_Tinnitus= undefined;
    this.ObjTinnitusEvaluation.Sound_Sensation= undefined;
    this.ObjTinnitusEvaluation.Tinnitus_Disturbing= undefined;
    this.ObjTinnitusEvaluation.Tinnitus_Treatment= undefined;
    this.ObjTinnitusEvaluation.Loud_Noises= undefined;
    this.ObjTinnitusEvaluation.Sudden_Loud_Noises= undefined;
    this.ObjTinnitusEvaluation.Alcohol_Cleaner= undefined;
    this.ObjTinnitusEvaluation.Alcohol_Cleaner_Yes= undefined;
    this.ObjTinnitusEvaluation.Hypotension= undefined;
    this.ObjTinnitusEvaluation.Trauma= undefined;
    this.ObjTinnitusEvaluation.Trauma_Yes= undefined;
    this.ObjTinnitusEvaluation.Undergone_Surgery= undefined;
    this.ObjTinnitusEvaluation.Undergone_Surgery_Yes= undefined;
    this.CheckBoxSelect= [];
    this.ObjTinnitusEvaluation.Migraine= undefined;
    this.ObjTinnitusEvaluation.Sleep= undefined;
    this.ObjTinnitusEvaluation.Stress_Level= undefined;
    this.ObjTinnitusEvaluation.Smoke= undefined;
    this.ObjTinnitusEvaluation.Smoke_Yes= undefined;
    this.ObjTinnitusEvaluation.Health_Issues= undefined;
    this.ObjTinnitusEvaluation.Health_Issues_Yes= undefined;
    this.ObjTinnitusEvaluation.Background_Noise= undefined;
    this.ObjTinnitusEvaluation.Infections= undefined;
    this.ObjTinnitusEvaluation.Group_Conversations= undefined;
    this.ObjTinnitusEvaluation.Particular_Sound= undefined;
    this.ObjTinnitusEvaluation.Particular_Sound_Yes= undefined;
    this.ObjTinnitusEvaluation.Louder= undefined;
    this.ObjTinnitusEvaluation.Louder_Yes= undefined;
    this.ObjTinnitusEvaluation.Arrange_1= undefined;
    this.ObjTinnitusEvaluation.Arrange_2= undefined;
    this.ObjTinnitusEvaluation.Arrange_3= undefined;
  }
  
  editData(){
    this.CheckBoxSelect=[];
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

      this.ObjTinnitusEvaluation= JSON.parse(data[0].Test_Details);
      this.CheckBoxSelect= this.EditDataList.DisOrder;
      this.ShowYes();

    });
  }

  ShowYes(){
    if(this.ObjTinnitusEvaluation.Alcohol_Cleaner == 'Yes'){
      this.IfYes1=true;
    }
    else{
      this.IfYes1=false;
      this.ObjTinnitusEvaluation.Alcohol_Cleaner_Yes=undefined;
    }
    if(this.ObjTinnitusEvaluation.Trauma == 'Yes'){
      this.IfYes2=true;
    }
    else{
      this.IfYes2=false;
      this.ObjTinnitusEvaluation.Trauma_Yes=undefined;
    }
    if(this.ObjTinnitusEvaluation.Undergone_Surgery == 'Yes'){
      this.IfYes3=true;
    }
    else{
      this.IfYes3=false;
      this.ObjTinnitusEvaluation.Undergone_Surgery_Yes=undefined;
    }
    if(this.ObjTinnitusEvaluation.Smoke == 'Yes'){
      this.IfYes4=true;
    }
    else{
      this.IfYes4=false;
      this.ObjTinnitusEvaluation.Smoke_Yes=undefined;
    }
    if(this.ObjTinnitusEvaluation.Health_Issues == 'Yes'){
      this.IfYes5=true;
    }
    else{
      this.IfYes5=false;
      this.ObjTinnitusEvaluation.Health_Issues_Yes=undefined;
    }
    if(this.ObjTinnitusEvaluation.Particular_Sound == 'Yes'){
      this.IfYes6=true;
    }
    else{
      this.IfYes6=false;
      this.ObjTinnitusEvaluation.Particular_Sound_Yes=undefined;
    }
    if(this.ObjTinnitusEvaluation.Louder == 'Yes'){
      this.IfYes7=true;
    }
    else{
      this.IfYes7=false;
      this.ObjTinnitusEvaluation.Louder_Yes=undefined;
    }
  }
  
  onConfirm(){
  }

  onReject(){   
  }

}

class AppoID{
  Name: any;
  PatientID: any;
  Sex: any;
  RefferedBy:any;
  Age: any;
  Centre:any;
}
class TinnitusEvaluation{
  Nature_Sound: any;
  Find_Tinnitus: any;
  Sound_Sensation: any;
  Tinnitus_Disturbing: any;
  Tinnitus_Treatment: any;
  Loud_Noises: any;
  Sudden_Loud_Noises: any;
  Alcohol_Cleaner: any;
  Alcohol_Cleaner_Yes: any;
  Hypotension: any;
  Trauma: any;
  Trauma_Yes: any;
  Undergone_Surgery: any;
  Undergone_Surgery_Yes: any;
  // DisOrder: any;
  Migraine: any;
  Sleep: any;
  Stress_Level: any;
  Smoke: any;
  Smoke_Yes: any;
  Health_Issues: any;
  Health_Issues_Yes: any;
  Background_Noise: any;
  Infections: any;
  Group_Conversations: any;
  Particular_Sound: any;
  Particular_Sound_Yes: any;
  Louder: any;
  Louder_Yes: any;
  Arrange_1: any;
  Arrange_2: any;
  Arrange_3: any;
}
