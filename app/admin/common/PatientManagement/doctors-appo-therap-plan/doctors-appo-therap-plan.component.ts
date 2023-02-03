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

  tabIndexToView = 0;
  AppoID:number;
  Editable:string;
  CentreList:any = [];
  TestName:string = 'Therapy_Plan';

  // Date Variables
  LtgStartDate = new Date();
  LtgAchivedDate = new Date();
  StgStartDate = new Date();
  StgAchivedDate = new Date();

  // Arrays
  LongTermGoalArray:any = [];
  ShortTermGoalArray:any = [];
  MaterialUsedArray:any = [];
  pCounselingArray:any = [];
  // From submit Properties
  LTGFormSubmitted:boolean = false;
  STGFormSubmitted:boolean = false;
  MaterialUsedFormSubmitted:boolean = false;
  ParentalCounselingFormSubmitted:boolean = false;
  
  // Therapy Plan form variables
  TherapyPlanDate = new Date();
  buttonValid:boolean = true;
  Spinner:boolean = false;
  // Recomendation Checkbox
  CheckBoxRecommendation:any = [];

  // class Objects
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
    private ActivatedRoute: ActivatedRoute,

  ) {
    this.ActivatedRoute.queryParams.subscribe((params: any) => {
      this.AppoID = params.Appo_ID;
      // console.log('Appo_ID', this.AppoID);
      this.Editable = params.ed;
      // console.log('Editable',this.Editable);

      // console.log('params',params);
      
    });

   }

  ngOnInit() {
    this.Header.pushHeader({
      Header:"Therapy Plan",
      Link:"PatientManagement --> Therapy Plan"
    });

    this.getDataAgainstAppoId();
    this.getCenterList();
    if (this.Editable == "y") {
      this.editData();
    }
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
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('data against appoid', data);
      if (data.length) {
        this.ObjTherapyPlan.Name = data[0].Name;
        this.ObjTherapyPlan.Age = data[0].Age;
        this.ObjTherapyPlan.Sex = data[0].Sex
        this.ObjTherapyPlan.ReferredBy = data[0].Referredby;
        this.ObjTherapyPlan.Foot_Fall_ID = data[0].Foot_Fall_ID;
        this.ObjTherapyPlan.Cost_Cent_ID = data[0].Cost_Cen_ID;
        this.ObjTherapyPlan.Txn_Date = data[0].Appo_Dt;
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

  AddLTG(valid){
    this.LTGFormSubmitted = true;
    if(valid){
      this.LTGFormSubmitted = false;
      this.ObjLongTermGoal.Start_Date = this.DateService.dateConvert(this.LtgStartDate);
      this.ObjLongTermGoal.Achieved_Date = this.DateService.dateConvert(this.LtgAchivedDate);
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
      this.MaterialUsedArray.push(this.ObjMeterialUsed);
      this.ObjMeterialUsed = new MeterialUsed();
    }
    // console.log(this.MaterialUsedArray);
  }
  AddCounseling(valid){
      this.ParentalCounselingFormSubmitted = true;
    if(valid){
      this.ParentalCounselingFormSubmitted = false;
      this.pCounselingArray.push(this.ObjParentalCounseling);
      // console.log(this.pCounselingArray);
      this.ObjParentalCounseling = new ParentalCounseling();
    }

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
    this.ObjTherapyPlan.Appo_ID = this.AppoID;
    this.ObjTherapyPlan.Posted_By = this.commonApi.CompacctCookies.User_ID;
    this.ObjTherapyPlan.Posted_On = this.DateService.dateConvert(new Date());
    this.ObjTherapyPlan.Therapy_Plan_Date = this.DateService.dateConvert(this.TherapyPlanDate);
    // arrays
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
    const tempSaveJ2 = {Appo_ID : this.AppoID}
    const tempSaveJ3 = {Test_Name : this.TestName}

    if(valid){
      // console.log(this.ObjTherapyPlan);

      this.Spinner=true;
      const obj = {
        "SP_String": "SP_BL_Txn_Doctor_Appo_ALL",
        "Report_Name_String": "Create_BL_Txn_Doctors_Appo_Test",
        "Json_Param_String": JSON.stringify(TempObj),
        "Json_1_String": JSON.stringify(tempSaveJ1),
        "Json_2_String": JSON.stringify(tempSaveJ2),
        "Json_3_String": JSON.stringify(tempSaveJ3)
      }

      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        if (data[0].Column1){
        this.Spinner=false;
        this.buttonValid = false;
        this.CompacctToast.clear();
        this.CompacctToast.add({
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
    Appo_ID: this.AppoID,
    
  }
  const Editobj = {
    SP_String: "SP_BL_Txn_Doctor_Appo_ALL",
    Report_Name_String: "Retrieve_BL_Txn_Doctor_Appo_ALL_Data",
    Json_Param_String: JSON.stringify(TempEditObj),
  }

  this.GlobalAPI.getData(Editobj).subscribe((data:any)=>{
    // console.log(JSON.parse(data[1].Test_Details));
    let EditDetails = JSON.parse(data[0].Test_Details);
    // console.log(EditDetails);
    this.TherapyPlanDate = EditDetails.Therapy_Plan_Date;
    this.ObjTherapyPlan.Language = EditDetails.Language;
    this.ObjTherapyPlan.FormEvaluationReportLink = EditDetails.FormEvaluationReportLink;
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
    this.getDataAgainstAppoId();
    this.LongTermGoalArray = [];
    this.ShortTermGoalArray = [];
    this.MaterialUsedArray = [];
    this.pCounselingArray = [];
    this.CheckBoxRecommendation = [];
    this.TherapyPlanDate = new Date();

  }

  onConfirm(){

  }

  onReject(){

  }

  TabClick(e){
    
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
  Appo_ID:any;
  Cost_Cent_ID:any;
  Posted_By:any;
  Posted_On:any;
  // user inputs
  Therapy_Plan_Date:any;
  Language:any;
  FormEvaluationReportLink:any;
// Arrays
  LongTermGoal:any;
  ShortTermGoal:any;
  Meterial:any;
  ParentalCounseling:any;
  
}

class LongTermGoal {
  Therapy_Goal:any;
  Duration:any;
  Start_Date:any;
  Achieved_Date :any;
}
class ShortTermGoal {
  Therapy_Goal:any;
  Duration:any;
  Start_Date:any;
  Achieved_Date :any;
}
class MeterialUsed{
  BaseLine:any;
  Target:any;
  Activities:any;
  ClinicalObservation:any;
}
class ParentalCounseling {
  Counseling:any;
}
