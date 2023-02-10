import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-doctors-appo-therap-plan',
  templateUrl: './doctors-appo-therap-plan.component.html',
  styleUrls: ['./doctors-appo-therap-plan.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DoctorsAppoTherapPlanComponent implements OnInit {

  CentreList:any = [];
  TestName:string = 'Therapy_Plan';
  currentDate:any;
  userID:any;
  patientList:any = [];
  GetFoot_Fall_Id:string;
  buttonDisabled:boolean = true;

  // Date Variables
  LtgStartDate = new Date();
  LtgAchivedDate = new Date();
  StgStartDate = new Date();
  StgAchivedDate = new Date();

  // Arrays
  pDiagnosisArray:any = [];
  LongTermGoalArray:any = [];
  ShortTermGoalArray:any = [];
  MaterialUsedArray:any = [];
  pCounselingArray:any = [];
  // From submit Properties
  PDiagnosisFormSubmitted:boolean = false;
  LTGFormSubmitted:boolean = false;
  STGFormSubmitted:boolean = false;
  MaterialUsedFormSubmitted:boolean = false;
  ParentalCounselingFormSubmitted:boolean = false;
  
  Spinner:boolean = false;
  // Recomendation Checkbox
  CheckBoxRecommendation:any = [];

  // class Objects
  ObjProvisionalDiagnosis = new provisionalDiagnosis();
  ObjLongTermGoal = new LongTermGoal();
  ObjShortTermGoal = new ShortTermGoal();
  ObjMeterialUsed = new MeterialUsed();
  ObjParentalCounseling = new ParentalCounseling(); 
  ObjTherapyPlan = new TherapyPlan();
  
  constructor(
    private Header:CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi : CompacctCommonApi,
    private DateService : DateTimeConvertService,

  ) {

   }

  ngOnInit() {
    this.Header.pushHeader({
      Header:"Therapy Plan",
      Link:"PatientManagement --> Therapy Plan"
    });
    this.currentDate = this.DateService.dateConvert(new Date()) ;
    this.userID = this.commonApi.CompacctCookies.User_ID;
    this.getPatientList();
    this.getCenterList();
  
  }

  Print(){
    console.log('print works');
    if (this.GetFoot_Fall_Id) {
      window.open("Report/Crystal_Files/CRM/joh_form/THERAPY_PLAN.aspx?Foot_Fall_ID=" +this.GetFoot_Fall_Id, 
      'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
      );
  } 
  }

  getPatientList(){

    const obj = {
      SP_String: "SP_BL_Txn_Doctor_Appo_ALL",
      Report_Name_String: "Get_Contact_Name_Mobile"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log(data);
      if (data.length) {
        data.forEach((element) => {
          (element["label"] = element.Column1),
          (element["value"] = element.Foot_Fall_ID);
        });
        this.patientList = data;
      }
        
    });

  }
  getDataOnFootFall(){
    console.log(this.GetFoot_Fall_Id);
    if(this.GetFoot_Fall_Id){
    this.getPatientAgainstFootFall();
    this.editData();
    }
    else{
      this.clear();
      this.buttonDisabled = true;
    }
  }

  getPatientAgainstFootFall() {
    const tempobj = {
      Foot_Fall_ID: this.GetFoot_Fall_Id,
    };
    const obj = {
      SP_String: "SP_BL_Txn_Doctor_Appo_ABR",
      Report_Name_String: "Get_All_Data_with_Foot_Fall_ID",
      Json_Param_String: JSON.stringify([tempobj]),
    };
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log('data against footfall', data);
      if (data.length) {
        this.ObjTherapyPlan.Name = data[0].Name;
        this.ObjTherapyPlan.Age = data[0].Age;
        this.ObjTherapyPlan.Sex = data[0].Sex
        this.ObjTherapyPlan.ReferredBy = data[0].Referredby;
        this.ObjTherapyPlan.Foot_Fall_ID = data[0].Foot_Fall_ID;
        this.ObjTherapyPlan.Cost_Cent_ID = data[0].Cost_Cen_ID;
        this.ObjTherapyPlan.Txn_Date = data[0].Appo_Dt;
        this.buttonDisabled = false;
      }
    });
  }

  getCenterList() {
    this.CentreList = [];
    const obj = {
      SP_String: "sp_JOH_Validation_Processt",
      Report_Name_String: "Get Cost Center",
    };
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
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
  AddPD(valid){
    this.PDiagnosisFormSubmitted = true;
    if(valid){
      this.PDiagnosisFormSubmitted = false;
      this.ObjProvisionalDiagnosis.slp = this.commonApi.CompacctCookies.User_Name;
      this.ObjProvisionalDiagnosis.userID = this.commonApi.CompacctCookies.User_ID;
      this.ObjProvisionalDiagnosis.createDate = this.DateService.dateConvert(new Date());
      this.pDiagnosisArray.push(this.ObjProvisionalDiagnosis);
      this.ObjProvisionalDiagnosis = new provisionalDiagnosis();
      console.log(this.pDiagnosisArray);
    }

  }

  AddLTG(valid){
    this.LTGFormSubmitted = true;
    if(valid){
      this.LTGFormSubmitted = false;
      this.ObjLongTermGoal.Start_Date = this.DateService.dateConvert(this.LtgStartDate);
      this.ObjLongTermGoal.Achieved_Date = this.DateService.dateConvert(this.LtgAchivedDate);
      this.ObjLongTermGoal.slp = this.commonApi.CompacctCookies.User_Name;
      this.ObjLongTermGoal.userID = this.commonApi.CompacctCookies.User_ID;
      this.ObjLongTermGoal.createDate = this.DateService.dateConvert(new Date());
      this.LongTermGoalArray.push(this.ObjLongTermGoal);
      this.ObjLongTermGoal = new LongTermGoal();
      this.LtgStartDate = new Date();
      this.LtgAchivedDate = new Date();
    }

  }
  AddSTG(valid){
    this.STGFormSubmitted = true;
    if(valid){
      this.STGFormSubmitted = false;
      this.ObjShortTermGoal.Start_Date = this.DateService.dateConvert(this.StgStartDate);
      this.ObjShortTermGoal.Achieved_Date = this.DateService.dateConvert(this.StgAchivedDate);
      this.ObjShortTermGoal.slp = this.commonApi.CompacctCookies.User_Name;
      this.ObjShortTermGoal.userID = this.commonApi.CompacctCookies.User_ID;
      this.ObjShortTermGoal.createDate = this.DateService.dateConvert(new Date());
      this.ShortTermGoalArray.push(this.ObjShortTermGoal);
      this.ObjShortTermGoal = new ShortTermGoal();
      this.StgStartDate = new Date();
      this.StgAchivedDate = new Date();
    }
  }
  AddMaterial(valid){
    this.MaterialUsedFormSubmitted = true;
    if(valid){
      this.MaterialUsedFormSubmitted = false;
      this.ObjMeterialUsed.slp = this.commonApi.CompacctCookies.User_Name;
      this.ObjMeterialUsed.userID = this.commonApi.CompacctCookies.User_ID;
      this.ObjMeterialUsed.createDate = this.DateService.dateConvert(new Date());
      this.MaterialUsedArray.push(this.ObjMeterialUsed);
      this.ObjMeterialUsed = new MeterialUsed();
    }
    // console.log(this.MaterialUsedArray);
  }
  AddCounseling(valid){
      this.ParentalCounselingFormSubmitted = true;
    if(valid){
      this.ParentalCounselingFormSubmitted = false;
      this.ObjParentalCounseling.slp = this.commonApi.CompacctCookies.User_Name;
      this.ObjParentalCounseling.userID = this.commonApi.CompacctCookies.User_ID;
      this.ObjParentalCounseling.createDate = this.DateService.dateConvert(new Date());
      this.pCounselingArray.push(this.ObjParentalCounseling);
      // console.log(this.pCounselingArray);
      this.ObjParentalCounseling = new ParentalCounseling();
    }

  }
  deletePDRow(i){
    this.pDiagnosisArray.splice(i,1);
  }
  deleteLTGRow(i){
    this.LongTermGoalArray.splice(i,1);
  }
  deleteSTGRow(i){
    this.ShortTermGoalArray.splice(i,1)
  }
  deleteMaterialRow(i){
    this.MaterialUsedArray.splice(i,1);
  }
  deleteCounseling(i){
    this.pCounselingArray.splice(i,1)
  }

  saveDocAppo(valid){
    this.ObjTherapyPlan.Posted_By = this.commonApi.CompacctCookies.User_ID;
    this.ObjTherapyPlan.Posted_On = this.DateService.dateConvert(new Date());
    // arrays
    this.ObjTherapyPlan.ProvisionalDiagnosis = this.pDiagnosisArray;
    this.ObjTherapyPlan.LongTermGoal = this.LongTermGoalArray;
    this.ObjTherapyPlan.ShortTermGoal = this.ShortTermGoalArray;
    this.ObjTherapyPlan.Meterial = this.MaterialUsedArray;
    this.ObjTherapyPlan.ParentalCounseling = this.pCounselingArray;

    let tempSaveJ1:any= [];
    if(this.CheckBoxRecommendation.length){
      this.CheckBoxRecommendation.forEach((ele:any) => {
        tempSaveJ1.push({
          Recommend : ele
      })
      });
    }

    const TempObj = this.ObjTherapyPlan
    const tempSaveJ2 = {foot_fall_id : this.GetFoot_Fall_Id}
    const tempSaveJ3 = {Test_Name : this.TestName}

    if(valid){
      console.log(this.ObjTherapyPlan);

      this.Spinner=true;
      const obj = {
        "SP_String": "SP_BL_Txn_Doctor_Appo_ALL",
        "Report_Name_String": "Create_BL_Txn_Doctors_Appo_Test_with_Foot_Fall_ID",
        "Json_Param_String": JSON.stringify(TempObj),
        "Json_1_String": JSON.stringify(tempSaveJ1),
        "Json_2_String": JSON.stringify(tempSaveJ2),
        "Json_3_String": JSON.stringify(tempSaveJ3)
      }

      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        if (data[0].Column1){
        this.Spinner=false;
        this.CompacctToast.clear();
        this.CompacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Appointment Save",
           detail: "Succesfully "
         });
          
        }
        else {
          this.Spinner = false;
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail:"Error occured "
          });
        }

      });

    }
   
  }

  editData(){
  // console.log('edit works');
  this.CheckBoxRecommendation=[];
  const TempEditObj={
    foot_fall_id: this.GetFoot_Fall_Id,
    
  }
  const Editobj = {
    SP_String: "SP_BL_Txn_Doctor_Appo_ALL",
    Report_Name_String: "Retrieve_BL_Txn_Doctor_Appo_ALL_Data_with_Foot_Fall_ID",
    Json_Param_String: JSON.stringify(TempEditObj),
  }

  this.GlobalAPI.getData(Editobj).subscribe((data:any)=>{
    console.log(data);
    let EditDetails = JSON.parse(data[0].Test_Details);
    console.log(EditDetails);
    this.ObjTherapyPlan.Language = EditDetails.Language;
    this.pDiagnosisArray = EditDetails.ProvisionalDiagnosis;
    this.LongTermGoalArray = EditDetails.LongTermGoal;
    this.ShortTermGoalArray = EditDetails.ShortTermGoal;
    this.MaterialUsedArray = EditDetails.Meterial;
    this.pCounselingArray = EditDetails.ParentalCounseling;

    this.editData1(data[0].Txn_ID);
  });

  }

  editData1(Txn_Id){

    const TempTxnIDObj={
      Txn_ID: Txn_Id,
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
    this.CheckBoxRecommendation= BoxArray;
      
    });

  }

  clear(){
    // console.log('clear works');
    this.ObjTherapyPlan = new TherapyPlan();
    this.pDiagnosisArray = [];
    this.LongTermGoalArray = [];
    this.ShortTermGoalArray = [];
    this.MaterialUsedArray = [];
    this.pCounselingArray = [];
    this.CheckBoxRecommendation = [];

  }

  onConfirm(){

  }

  onReject(){

  }

  TabClick(){
    
  }

}

class TherapyPlan {
  Name:any;
  Age:any;
  Sex:any;
  ReferredBy:any;
  
  // 6 Required Field
  Foot_Fall_ID:any;
  Txn_Date:any;
  Cost_Cent_ID:any;
  Posted_By:any;
  Posted_On:any;
  // user inputs
  Therapy_Plan_Date:any;
  Language:any;

// Arrays
  ProvisionalDiagnosis:any;
  LongTermGoal:any;
  ShortTermGoal:any;
  Meterial:any;
  ParentalCounseling:any;
  
}

class  provisionalDiagnosis {
  link:any;
  slp:any;
  userID:any;
  createDate:any;
}

class LongTermGoal {
  Therapy_Goal:any;
  Duration:any;
  Start_Date:any;
  Achieved_Date :any;
  slp:any;
  userID:any;
  createDate:any;
}
class ShortTermGoal {
  Therapy_Goal:any;
  Duration:any;
  Start_Date:any;
  Achieved_Date :any;
  slp:any;
  userID:any;
  createDate:any;
}
class MeterialUsed{
  BaseLine:any;
  Target:any;
  Activities:any;
  slp:any;
  userID:any;
  createDate:any;
  ClinicalObservation:any;
}
class ParentalCounseling {
  Counseling:any;
  slp:any;
  userID:any;
  createDate:any;
}
