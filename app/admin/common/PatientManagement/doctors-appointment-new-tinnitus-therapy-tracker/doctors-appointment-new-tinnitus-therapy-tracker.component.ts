import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { UpdateConsultancyComponent } from '../../../shared/compacct.components/compacct.forms/update-consultancy/update-consultancy.component';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-doctors-appointment-new-tinnitus-therapy-tracker',
  templateUrl: './doctors-appointment-new-tinnitus-therapy-tracker.component.html',
  styleUrls: ['./doctors-appointment-new-tinnitus-therapy-tracker.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DoctorsAppointmentNewTinnitusTherapyTrackerComponent implements OnInit {
  tabIndexToView:number= 0;
  GenderList:any=[];
  AppoIDvalue:number;
  EditPage:any;
  TinnitusTherapyFormSubmitted:boolean= false;
  Spinner:boolean=false;
  buttonname:any='Create';
  Level_1_Status:any=undefined;
  Level_2_Status:any=undefined;
  Level_3_Status:any=undefined;
  patientSearchList:any= [];
  CheckBoxRECOMMENDATION:any=[];
  CentreList:any=[];
  Appo_Date:any;
  TestName:any='Tinnitus_Therapy_Tracker';
  buttonValid:boolean= true;
  Get_TXN_ID:any;
  EditDataList:any=[];
  DegreeList: any= [];
  TypeList: any = [];
  SeverityList: any = [];
  HearingAIdList:any = [];
  Tinnitus_Therapy_Date_Assessment: any;
  Tinnitus_Therapy_Date_Session_1: any;
  Tinnitus_Therapy_Date_Session_2: any;  
  Tinnitus_Therapy_Date_Session_3: any; 
  Tinnitus_Therapy_Date_Session_4: any;
  Tinnitus_Therapy_Date_Session_5: any;  
  Tinnitus_Therapy_Date_Session_6: any;
  HearingAidDataList: any = [];

  ObjTinnitusTherapy: TinnitusTherapy = new TinnitusTherapy();
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
      Header: "Tinnitus Therapy Tracker",
      Link: " Patient Management -> Tinnitus Therapy Tracker"
    });
    this.GenderList=['Male','Female','Other'];
    this.Appo_Date= new Date();
    this.GetCostCentre();
    this.GetAllDataAppoID();
    this.DegreeList=['Normal Hearing','Minimal','Mild','Moderate','Moderately Severe','Severe','More than 105dBHL','Profound','High Frequency Hearing Loss'];
    this.TypeList=['Normal Hearing','Minimal Hearing Loss','Conductive Hearing Loss','Mixed Hearing Loss','Sensorineural Hearing Loss','High Frequency Hearing Loss'];
    this.SeverityList=['Minimal Reaction to Tinnitus','Mild Reaction to Tinnitus','Moderate Reaction to Tinnitus','Severe Reaction to Tinnitus','Catastrophic Reaction to Tinnitus'];
    this.GetHearingAId();
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

        this.ObjTinnitusTherapy.Name=this.patientSearchList[0].Name;
        this.ObjTinnitusTherapy.PatientID=this.patientSearchList[0].Foot_Fall_ID;
        this.ObjTinnitusTherapy.Sex=this.patientSearchList[0].Sex;
        this.ObjTinnitusTherapy.RefferedBy=this.patientSearchList[0].Referredby;
        this.ObjTinnitusTherapy.Age=this.patientSearchList[0].Age;
        this.ObjTinnitusTherapy.Centre=this.patientSearchList[0].Cost_Cen_ID;
        this.Appo_Date=this.patientSearchList[0].Appo_Dt ? this.patientSearchList[0].Appo_Dt : "-";
      }
    });
  }

  GetHearingAId(){
    this.HearingAIdList= [];
    const obj = {
      "SP_String": "sp_Joh_Realistic_Expectation",
      "Report_Name_String": "Get_Product_Hearing",   
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);

      data.forEach(el => {
        this.HearingAIdList.push({
          label: el.Product_Description,
          value: el.Product_Description
        });
      });
      
    });
  }

  updateConsultancysave(event){
    //console.log('event value',event);
    //console.log('event1',event.Level_1_Status);
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

  const TempObj ={
    Foot_Fall_ID: this.ObjTinnitusTherapy.PatientID,
    Appo_ID: this.AppoIDvalue,
    Txn_Date: this.Appo_Date,
    Cost_Cent_ID: this.ObjTinnitusTherapy.Centre,
    Posted_By: this.$CompacctAPI.CompacctCookies.User_ID,
    Posted_On: this.DateService.dateConvert(new Date()),
    Tinnitus_Therapy_Date_Assessment: this.Tinnitus_Therapy_Date_Assessment? this.DateService.dateConvert(this.Tinnitus_Therapy_Date_Assessment) : "",
    Tinnitus_Therapy_Date_Session_1: this.Tinnitus_Therapy_Date_Session_1 ? this.DateService.dateConvert(this.Tinnitus_Therapy_Date_Session_1) : "",
    Tinnitus_Therapy_Date_Session_2: this.Tinnitus_Therapy_Date_Session_2 ? this.DateService.dateConvert(this.Tinnitus_Therapy_Date_Session_2) : "",
    Tinnitus_Therapy_Date_Session_3: this.Tinnitus_Therapy_Date_Session_3 ? this.DateService.dateConvert(this.Tinnitus_Therapy_Date_Session_3) : "",
    Tinnitus_Therapy_Date_Session_4: this.Tinnitus_Therapy_Date_Session_4 ? this.DateService.dateConvert(this.Tinnitus_Therapy_Date_Session_4) : "",
    Tinnitus_Therapy_Date_Session_5: this.Tinnitus_Therapy_Date_Session_5 ?  this.DateService.dateConvert(this.Tinnitus_Therapy_Date_Session_5) : "",
    Tinnitus_Therapy_Date_Session_6: this.Tinnitus_Therapy_Date_Session_6 ? this.DateService.dateConvert(this.Tinnitus_Therapy_Date_Session_6) : "",
    Tinnitus_Therapy_Degree_Loss_Left_Assessment: this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Left_Assessment,   
    Tinnitus_Therapy_Degree_Loss_Left_Session_1: this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Left_Session_1,
    Tinnitus_Therapy_Degree_Loss_Left_Session_2: this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Left_Session_2, 
    Tinnitus_Therapy_Degree_Loss_Left_Session_3: this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Left_Session_3, 
    Tinnitus_Therapy_Degree_Loss_Left_Session_4: this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Left_Session_4, 
    Tinnitus_Therapy_Degree_Loss_Left_Session_5: this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Left_Session_5, 
    Tinnitus_Therapy_Degree_Loss_Left_Session_6: this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Left_Session_6, 
    Tinnitus_Therapy_Degree_Loss_Right_Assessment: this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Right_Assessment,   
    Tinnitus_Therapy_Degree_Loss_Right_Session_1: this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Right_Session_1,
    Tinnitus_Therapy_Degree_Loss_Right_Session_2: this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Right_Session_2, 
    Tinnitus_Therapy_Degree_Loss_Right_Session_3: this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Right_Session_3,
    Tinnitus_Therapy_Degree_Loss_Right_Session_4: this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Right_Session_4, 
    Tinnitus_Therapy_Degree_Loss_Right_Session_5: this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Right_Session_5, 
    Tinnitus_Therapy_Degree_Loss_Right_Session_6: this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Right_Session_6, 
    Tinnitus_Therapy_Type_Loss_Left_Assessment: this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Left_Assessment,  
    Tinnitus_Therapy_Type_Loss_Left_Session_1: this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Left_Session_1, 
    Tinnitus_Therapy_Type_Loss_Left_Session_2: this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Left_Session_2,
    Tinnitus_Therapy_Type_Loss_Left_Session_3: this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Left_Session_3,
    Tinnitus_Therapy_Type_Loss_Left_Session_4: this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Left_Session_4,
    Tinnitus_Therapy_Type_Loss_Left_Session_5: this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Left_Session_5,
    Tinnitus_Therapy_Type_Loss_Left_Session_6: this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Left_Session_6,
    Tinnitus_Therapy_Type_Loss_Right_Assessment: this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Right_Assessment,  
    Tinnitus_Therapy_Type_Loss_Right_Session_1: this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Right_Session_1, 
    Tinnitus_Therapy_Type_Loss_Right_Session_2: this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Right_Session_2,
    Tinnitus_Therapy_Type_Loss_Right_Session_3: this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Right_Session_3,
    Tinnitus_Therapy_Type_Loss_Right_Session_4: this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Right_Session_4,
    Tinnitus_Therapy_Type_Loss_Right_Session_5: this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Right_Session_5,
    Tinnitus_Therapy_Type_Loss_Right_Session_6: this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Right_Session_6,
    Tinnitus_Therapy_THI_Score_Assessment: this.ObjTinnitusTherapy.Tinnitus_Therapy_THI_Score_Assessment, 
    Tinnitus_Therapy_THI_Score_Session_1: this.ObjTinnitusTherapy.Tinnitus_Therapy_THI_Score_Session_1, 
    Tinnitus_Therapy_THI_Score_Session_2: this.ObjTinnitusTherapy.Tinnitus_Therapy_THI_Score_Session_2, 
    Tinnitus_Therapy_THI_Score_Session_3: this.ObjTinnitusTherapy.Tinnitus_Therapy_THI_Score_Session_3, 
    Tinnitus_Therapy_THI_Score_Session_4: this.ObjTinnitusTherapy.Tinnitus_Therapy_THI_Score_Session_4, 
    Tinnitus_Therapy_THI_Score_Session_5: this.ObjTinnitusTherapy.Tinnitus_Therapy_THI_Score_Session_5, 
    Tinnitus_Therapy_THI_Score_Session_6: this.ObjTinnitusTherapy.Tinnitus_Therapy_THI_Score_Session_6,
    Tinnitus_Therapy_Severity_Assessment: this.ObjTinnitusTherapy.Tinnitus_Therapy_Severity_Assessment,  
    Tinnitus_Therapy_Severity_Session_1: this.ObjTinnitusTherapy.Tinnitus_Therapy_Severity_Session_1, 
    Tinnitus_Therapy_Severity_Session_2: this.ObjTinnitusTherapy.Tinnitus_Therapy_Severity_Session_2,
    Tinnitus_Therapy_Severity_Session_3: this.ObjTinnitusTherapy.Tinnitus_Therapy_Severity_Session_3,
    Tinnitus_Therapy_Severity_Session_4: this.ObjTinnitusTherapy.Tinnitus_Therapy_Severity_Session_4,
    Tinnitus_Therapy_Severity_Session_5: this.ObjTinnitusTherapy.Tinnitus_Therapy_Severity_Session_5,
    Tinnitus_Therapy_Severity_Session_6: this.ObjTinnitusTherapy.Tinnitus_Therapy_Severity_Session_6,
    Tinnitus_Therapy_Device_Name_Left_Assessment: this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Left_Assessment,
    Tinnitus_Therapy_Device_Name_Left_Session_1: this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Left_Session_1,
    Tinnitus_Therapy_Device_Name_Left_Session_2: this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Left_Session_2,
    Tinnitus_Therapy_Device_Name_Left_Session_3: this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Left_Session_3,
    Tinnitus_Therapy_Device_Name_Left_Session_4: this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Left_Session_4,
    Tinnitus_Therapy_Device_Name_Left_ession_5: this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Left_ession_5,
    Tinnitus_Therapy_Device_Name_Left_Session_6: this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Left_Session_6,
    Tinnitus_Therapy_Device_Name_Right_Assessment: this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Right_Assessment,
    Tinnitus_Therapy_Device_Name_Right_Session_1: this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Right_Session_1,
    Tinnitus_Therapy_Device_Name_Right_Session_2: this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Right_Session_2,
    Tinnitus_Therapy_Device_Name_Right_Session_3: this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Right_Session_3,
    Tinnitus_Therapy_Device_Name_Right_Session_4: this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Right_Session_4,
    Tinnitus_Therapy_Device_Name_Right_Session_5: this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Right_Session_5,
    Tinnitus_Therapy_Device_Name_Right_Session_6: this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Right_Session_6,
    Tinnitus_Therapy_Counselling_Time_Assessment: this.ObjTinnitusTherapy.Tinnitus_Therapy_Counselling_Time_Assessment,
    Tinnitus_Therapy_Counselling_Time_Session_1: this.ObjTinnitusTherapy.Tinnitus_Therapy_Counselling_Time_Session_1,
    Tinnitus_Therapy_Counselling_Time_Session_2: this.ObjTinnitusTherapy.Tinnitus_Therapy_Counselling_Time_Session_2,
    Tinnitus_Therapy_Counselling_Time_Session_3: this.ObjTinnitusTherapy.Tinnitus_Therapy_Counselling_Time_Session_3,
    Tinnitus_Therapy_Counselling_Time_Session_4: this.ObjTinnitusTherapy.Tinnitus_Therapy_Counselling_Time_Session_4,
    Tinnitus_Therapy_Counselling_Time_Session_5: this.ObjTinnitusTherapy.Tinnitus_Therapy_Counselling_Time_Session_5,
    Tinnitus_Therapy_Counselling_Time_Session_6: this.ObjTinnitusTherapy.Tinnitus_Therapy_Counselling_Time_Session_6,
    Tinnitus_Therapy_Therapy_Duration_Assessment: this.ObjTinnitusTherapy.Tinnitus_Therapy_Therapy_Duration_Assessment,
    Tinnitus_Therapy_Therapy_Duration_Session_1: this.ObjTinnitusTherapy.Tinnitus_Therapy_Therapy_Duration_Session_1,
    Tinnitus_Therapy_Therapy_Duration_Session_2: this.ObjTinnitusTherapy.Tinnitus_Therapy_Therapy_Duration_Session_2,
    Tinnitus_Therapy_Therapy_Duration_Session_3: this.ObjTinnitusTherapy.Tinnitus_Therapy_Therapy_Duration_Session_3,
    Tinnitus_Therapy_Therapy_Duration_Session_4: this.ObjTinnitusTherapy.Tinnitus_Therapy_Therapy_Duration_Session_4,
    Tinnitus_Therapy_Therapy_Duration_Session_5: this.ObjTinnitusTherapy.Tinnitus_Therapy_Therapy_Duration_Session_5,
    Tinnitus_Therapy_Therapy_Duration_Session_6: this.ObjTinnitusTherapy.Tinnitus_Therapy_Therapy_Duration_Session_6,
    Tinnitus_Therapy_Comment_Assessment: this.ObjTinnitusTherapy.Tinnitus_Therapy_Comment_Assessment,
    Tinnitus_Therapy_Comment_Session_1: this.ObjTinnitusTherapy.Tinnitus_Therapy_Comment_Session_1,
    Tinnitus_Therapy_Comment_Session_2: this.ObjTinnitusTherapy.Tinnitus_Therapy_Comment_Session_2,
    Tinnitus_Therapy_Comment_Session_3: this.ObjTinnitusTherapy.Tinnitus_Therapy_Comment_Session_3,
    Tinnitus_Therapy_Comment_Session_4: this.ObjTinnitusTherapy.Tinnitus_Therapy_Comment_Session_4,
    Tinnitus_Therapy_Comment_Session_5: this.ObjTinnitusTherapy.Tinnitus_Therapy_Comment_Session_5,
    Tinnitus_Therapy_Comment_Session_6: this.ObjTinnitusTherapy.Tinnitus_Therapy_Comment_Session_6
  }
  //  console.log("TempObj",TempObj);

  const tempSaveJ2 = {
    Appo_ID : this.AppoIDvalue
  }
//  console.log("tempSaveJ2",tempSaveJ2);

   const tempSaveJ3 = {
    Test_Name : this.TestName
  }
  // console.log("tempSaveJ3",tempSaveJ3);

  this.TinnitusTherapyFormSubmitted=true;
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
      var msg= this.EditPage ?  "update" : "create";
      if (data[0].Column1){
        this.Spinner=false;
        this.buttonValid = false;
        this.TinnitusTherapyFormSubmitted=false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Appointment " +msg,
          detail: "Succesfully "
        });
          if(this.EditPage != 'y'){
          this.ClearData();
          this.UpdateConsultancy.clearComData();
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
    this.Tinnitus_Therapy_Date_Assessment= undefined;
    this.Tinnitus_Therapy_Date_Session_1= undefined;
    this.Tinnitus_Therapy_Date_Session_2= undefined;
    this.Tinnitus_Therapy_Date_Session_3= undefined;
    this.Tinnitus_Therapy_Date_Session_4= undefined;
    this.Tinnitus_Therapy_Date_Session_5= undefined;
    this.Tinnitus_Therapy_Date_Session_6= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Left_Assessment= undefined;   
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Left_Session_1= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Left_Session_2= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Left_Session_3= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Left_Session_4= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Left_Session_5= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Left_Session_6= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Right_Assessment= undefined;   
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Right_Session_1= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Right_Session_2= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Right_Session_3= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Right_Session_4= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Right_Session_5= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Degree_Loss_Right_Session_6= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Left_Assessment= undefined;  
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Left_Session_1= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Left_Session_2= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Left_Session_3= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Left_Session_4= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Left_Session_5= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Left_Session_6= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Right_Assessment= undefined;  
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Right_Session_1= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Right_Session_2= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Right_Session_3= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Right_Session_4= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Right_Session_5= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Type_Loss_Right_Session_6= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_THI_Score_Assessment= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_THI_Score_Session_1= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_THI_Score_Session_2= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_THI_Score_Session_3= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_THI_Score_Session_4= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_THI_Score_Session_5= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_THI_Score_Session_6= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Severity_Assessment= undefined;  
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Severity_Session_1= undefined; 
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Severity_Session_2= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Severity_Session_3= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Severity_Session_4= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Severity_Session_5= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Severity_Session_6= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Left_Assessment= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Left_Session_1= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Left_Session_2= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Left_Session_3= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Left_Session_4= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Left_ession_5= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Left_Session_6= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Right_Assessment= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Right_Session_1= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Right_Session_2= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Right_Session_3= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Right_Session_4= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Right_Session_5= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Device_Name_Right_Session_6= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Counselling_Time_Assessment= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Counselling_Time_Session_1= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Counselling_Time_Session_2= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Counselling_Time_Session_3= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Counselling_Time_Session_4= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Counselling_Time_Session_5= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Counselling_Time_Session_6= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Therapy_Duration_Assessment= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Therapy_Duration_Session_1= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Therapy_Duration_Session_2= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Therapy_Duration_Session_3= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Therapy_Duration_Session_4= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Therapy_Duration_Session_5= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Therapy_Duration_Session_6= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Comment_Assessment= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Comment_Session_1= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Comment_Session_2= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Comment_Session_3= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Comment_Session_4= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Comment_Session_5= undefined;
    this.ObjTinnitusTherapy.Tinnitus_Therapy_Comment_Session_6= undefined;
  
  }

  editData(){
    this.GetHearingAId();
    const TempEditObj={
      Appo_ID: this.AppoIDvalue
    }
  // console.log("TempEditObj",TempEditObj);
    this.buttonname='Edit';
    const Editobj = {
      "SP_String": "SP_BL_Txn_Doctor_Appo_ALL",
      "Report_Name_String": "Retrieve_BL_Txn_Doctor_Appo_ALL_Data",
      "Json_Param_String": JSON.stringify(TempEditObj)
    }
    this.GlobalAPI.getData(Editobj).subscribe((data: any) => {
      // console.log("Edit Data",data);

      this.EditDataList= JSON.parse(data[0].Test_Details);  
      // console.log("EditDataList",this.EditDataList);

      this.ObjTinnitusTherapy= JSON.parse(data[0].Test_Details);

      this.Tinnitus_Therapy_Date_Assessment= this.EditDataList.Tinnitus_Therapy_Date_Assessment;
      this.Tinnitus_Therapy_Date_Session_1= this.EditDataList.Tinnitus_Therapy_Date_Session_1;
      this.Tinnitus_Therapy_Date_Session_2= this.EditDataList.Tinnitus_Therapy_Date_Session_2;
      this.Tinnitus_Therapy_Date_Session_3= this.EditDataList.Tinnitus_Therapy_Date_Session_3;
      this.Tinnitus_Therapy_Date_Session_4= this.EditDataList.Tinnitus_Therapy_Date_Session_4;
      this.Tinnitus_Therapy_Date_Session_5= this.EditDataList.Tinnitus_Therapy_Date_Session_5;
      this.Tinnitus_Therapy_Date_Session_6= this.EditDataList.Tinnitus_Therapy_Date_Session_6;

    this.editData2();
    });
  }

  editData2(){
    const TempDropdownObj={
      Appo_ID : this.AppoIDvalue
    }

    const Dropdownobj = {
      "SP_String": "SP_BL_Txn_Doctor_Appo_ABR",
      "Report_Name_String": "Get_All_Data",
      "Json_Param_String": JSON.stringify([TempDropdownObj])
    }
    this.GlobalAPI.getData(Dropdownobj).subscribe((data:any)=>{
    //  console.log("GetAllDataAppoID For dropdown",data);
      if(data.length){
       const editObj = {
          Level_1_Status: data[0].Level_1_Status.toString() ? data[0].Level_1_Status.toString() : '',
          Level_2_Status: data[0].Level_2_Status.toString() ? data[0].Level_2_Status.toString() : '',
          Level_3_Status: data[0].Level_3_Status.toString() ? data[0].Level_3_Status.toString() : ''
        }
        this.UpdateConsultancy.editConsulyancy(editObj)
      }
    });
  }

  onConfirm(){
  }

  onReject(){   
  }

}

class TinnitusTherapy{
  Name: any;
  PatientID: any;
  Sex: any;
  RefferedBy:any;
  Age: any;
  Centre:any;
  Tinnitus_Therapy_Date_Assessment: any;
  Tinnitus_Therapy_Date_Session_1: any;
  Tinnitus_Therapy_Date_Session_2: any;  
  Tinnitus_Therapy_Date_Session_3: any;  
  Tinnitus_Therapy_Date_Session_4: any;  
  Tinnitus_Therapy_Date_Session_5: any;  
  Tinnitus_Therapy_Date_Session_6: any; 
  Tinnitus_Therapy_Degree_Loss_Left_Assessment: any;   
  Tinnitus_Therapy_Degree_Loss_Left_Session_1: any;
  Tinnitus_Therapy_Degree_Loss_Left_Session_2: any; 
  Tinnitus_Therapy_Degree_Loss_Left_Session_3: any; 
  Tinnitus_Therapy_Degree_Loss_Left_Session_4: any; 
  Tinnitus_Therapy_Degree_Loss_Left_Session_5: any; 
  Tinnitus_Therapy_Degree_Loss_Left_Session_6: any; 
  Tinnitus_Therapy_Degree_Loss_Right_Assessment: any;   
  Tinnitus_Therapy_Degree_Loss_Right_Session_1: any;
  Tinnitus_Therapy_Degree_Loss_Right_Session_2: any; 
  Tinnitus_Therapy_Degree_Loss_Right_Session_3: any; 
  Tinnitus_Therapy_Degree_Loss_Right_Session_4: any; 
  Tinnitus_Therapy_Degree_Loss_Right_Session_5: any; 
  Tinnitus_Therapy_Degree_Loss_Right_Session_6: any; 
  Tinnitus_Therapy_Type_Loss_Left_Assessment: any;  
  Tinnitus_Therapy_Type_Loss_Left_Session_1: any; 
  Tinnitus_Therapy_Type_Loss_Left_Session_2: any;
  Tinnitus_Therapy_Type_Loss_Left_Session_3: any;
  Tinnitus_Therapy_Type_Loss_Left_Session_4: any;
  Tinnitus_Therapy_Type_Loss_Left_Session_5: any;
  Tinnitus_Therapy_Type_Loss_Left_Session_6: any;
  Tinnitus_Therapy_Type_Loss_Right_Assessment: any;  
  Tinnitus_Therapy_Type_Loss_Right_Session_1: any; 
  Tinnitus_Therapy_Type_Loss_Right_Session_2: any;
  Tinnitus_Therapy_Type_Loss_Right_Session_3: any;
  Tinnitus_Therapy_Type_Loss_Right_Session_4: any;
  Tinnitus_Therapy_Type_Loss_Right_Session_5: any;
  Tinnitus_Therapy_Type_Loss_Right_Session_6: any;
  Tinnitus_Therapy_THI_Score_Assessment: any; 
  Tinnitus_Therapy_THI_Score_Session_1: any; 
  Tinnitus_Therapy_THI_Score_Session_2: any; 
  Tinnitus_Therapy_THI_Score_Session_3: any; 
  Tinnitus_Therapy_THI_Score_Session_4: any; 
  Tinnitus_Therapy_THI_Score_Session_5: any; 
  Tinnitus_Therapy_THI_Score_Session_6: any;
  Tinnitus_Therapy_Severity_Assessment: any;  
  Tinnitus_Therapy_Severity_Session_1: any; 
  Tinnitus_Therapy_Severity_Session_2: any;
  Tinnitus_Therapy_Severity_Session_3: any;
  Tinnitus_Therapy_Severity_Session_4: any;
  Tinnitus_Therapy_Severity_Session_5: any;
  Tinnitus_Therapy_Severity_Session_6: any;
  Tinnitus_Therapy_Device_Name_Left_Assessment: any;
  Tinnitus_Therapy_Device_Name_Left_Session_1: any;
  Tinnitus_Therapy_Device_Name_Left_Session_2: any;
  Tinnitus_Therapy_Device_Name_Left_Session_3: any;
  Tinnitus_Therapy_Device_Name_Left_Session_4: any;
  Tinnitus_Therapy_Device_Name_Left_ession_5: any;
  Tinnitus_Therapy_Device_Name_Left_Session_6: any;
  Tinnitus_Therapy_Device_Name_Right_Assessment: any;
  Tinnitus_Therapy_Device_Name_Right_Session_1: any;
  Tinnitus_Therapy_Device_Name_Right_Session_2: any;
  Tinnitus_Therapy_Device_Name_Right_Session_3: any;
  Tinnitus_Therapy_Device_Name_Right_Session_4: any;
  Tinnitus_Therapy_Device_Name_Right_Session_5: any;
  Tinnitus_Therapy_Device_Name_Right_Session_6: any;
  Tinnitus_Therapy_Counselling_Time_Assessment: any;
  Tinnitus_Therapy_Counselling_Time_Session_1: any;
  Tinnitus_Therapy_Counselling_Time_Session_2: any;
  Tinnitus_Therapy_Counselling_Time_Session_3: any;
  Tinnitus_Therapy_Counselling_Time_Session_4: any;
  Tinnitus_Therapy_Counselling_Time_Session_5: any;
  Tinnitus_Therapy_Counselling_Time_Session_6: any;
  Tinnitus_Therapy_Therapy_Duration_Assessment: any;
  Tinnitus_Therapy_Therapy_Duration_Session_1: any;
  Tinnitus_Therapy_Therapy_Duration_Session_2: any;
  Tinnitus_Therapy_Therapy_Duration_Session_3: any;
  Tinnitus_Therapy_Therapy_Duration_Session_4: any;
  Tinnitus_Therapy_Therapy_Duration_Session_5: any;
  Tinnitus_Therapy_Therapy_Duration_Session_6: any;
  Tinnitus_Therapy_Comment_Assessment: any;
  Tinnitus_Therapy_Comment_Session_1: any;
  Tinnitus_Therapy_Comment_Session_2: any;
  Tinnitus_Therapy_Comment_Session_3: any;
  Tinnitus_Therapy_Comment_Session_4: any;
  Tinnitus_Therapy_Comment_Session_5: any;
  Tinnitus_Therapy_Comment_Session_6: any;
}
