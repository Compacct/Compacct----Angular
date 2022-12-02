import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { VirtualTimeScheduler } from 'rxjs';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { UpdateConsultancyComponent } from '../../../shared/compacct.components/compacct.forms/update-consultancy/update-consultancy.component';

@Component({
  selector: 'app-doctor-appt-new-impedance-audiometry',
  templateUrl: './doctor-appt-new-impedance-audiometry.component.html',
  styleUrls: ['./doctor-appt-new-impedance-audiometry.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class DoctorApptNewImpedanceAudiometryComponent implements OnInit {
  tabIndexToView:number = 0;
  GenderList:any=[];
  Appo_Date:any;
  CentreList:any=[];
  AppoIDvalue:any;
  patientSearchList:any=[];
  TypeList:any=[];
  TestList:any=[];
  ResultsList:any=[];
  ReflexList:any=[];
  InterpretationList:any=[];
  CheckBoxRECOMMENDATION:any=[];
  ImpedanceAudiometryFormSubmitted:boolean=false;
  Spinner:boolean=false;
  buttonname:string = "Create";
  Level_1_Status:any=undefined;
  Level_2_Status:any=undefined;
  Level_3_Status:any=undefined;
  
  ObjImp: IMPEDANCE = new IMPEDANCE();
  @ViewChild("consultancy", { static: false }) UpdateConsultancy: UpdateConsultancyComponent;
  constructor(   
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private header:CompacctHeader,
    private $http: HttpClient,
    private route: ActivatedRoute
    ) { 
      this.route.queryParams.subscribe(params => {
         //console.log("param",params);
         this.AppoIDvalue=params.Appo_ID;
         //console.log("value",this.AppoIDvalue);
        })
    }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "IMPEDANCE AUDIOMETRY",
      Link: " Patient Management -> IMPEDANCE AUDIOMETRY"
    });
    this.ObjImp.Probe_Frequency='226 Hz';
    this.GenderList=['Male','Female','Other'];
    this.Appo_Date= new Date();
    this.GetCostCentre();
    this.GetAllDataAppoID();
    this.TypeList=['“A” Type','“As” Type','“Ad” Type','“B” Type','“C” Type','“Cs” Type','“Cd” Type','“E” Type'];
    this.TestList=['Valsalva Test','Toynbee Test'];
    this.ResultsList=['ET is functioning normally','ET malfunction is present'];
    this.ReflexList=['Present','Absent'];
    this.InterpretationList=['Indication of middle ear dysfunction','Indication of (?) middle ear dysfunction','Indication of normal middle ear function','Suggestive of Eustachian Tube dysfunction','Suggestive of normal Eustachian Tube function'];
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.buttonname = "Create"
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
      "SP_String": "SP_BL_Txn_Doctor_Appo_IMPEDANCE",
      "Report_Name_String": "Get_All_Data",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log("GetAllDataAppoID",data);
      if(data.length){
        this.patientSearchList=data;

        this.ObjImp.Name=this.patientSearchList[0].Name;
        this.ObjImp.PatientID=this.patientSearchList[0].Foot_Fall_ID;
        this.ObjImp.Sex=this.patientSearchList[0].Sex;
        this.ObjImp.RefferedBy=this.patientSearchList[0].Referredby;
        this.ObjImp.Age=this.patientSearchList[0].Age;
        this.ObjImp.Centre=this.patientSearchList[0].Cost_Cen_ID;
        this.Appo_Date=this.patientSearchList[0].Appo_Dt ? this.patientSearchList[0].Appo_Dt : "-";
      }
    });
  }

  updateConsultancysave(event){
    console.log('event value',event);
    //console.log('event1',event.Level_1_Status);
    this.Level_1_Status=event.Level_1_Status;
    this.Level_2_Status=event.Level_2_Status;
    this.Level_3_Status=event.Level_3_Status;
  }

  saveDocAppo(valid:any){

    console.log('CheckBoxRECOMMENDATION value',this.CheckBoxRECOMMENDATION);
    let tempSaveJ1:any = []
    if(this.CheckBoxRECOMMENDATION.length){
      this.CheckBoxRECOMMENDATION.forEach((ele:any) => {
        tempSaveJ1.push({
          Recommend : ele
        })
      });
    }
    console.log("tempSaveJ1",tempSaveJ1);


    const TempObj ={
      Foot_Fall_ID: this.ObjImp.PatientID,
      Appo_ID: this.AppoIDvalue,
      Txn_Date: this.Appo_Date,
      Cost_Cent_ID: this.ObjImp.Centre,
      Probe_Frequency: this.ObjImp.Probe_Frequency,
      Right_Type: this.ObjImp.Right_Type,
      Left_Type: this.ObjImp.Left_Type,
      Right_Pk_Pressure: this.ObjImp.Right_Pk_Pressure,
      Left_Pk_Pressure: this.ObjImp.Left_Pk_Pressure,
      Right_Compliance: this.ObjImp.Right_Compliance,
      Left_Compliance: this.ObjImp.Left_Compliance,
      Right_ECV: this.ObjImp.Right_ECV,
      Left_ECV: this.ObjImp.Left_ECV,
      Right_Resonant_Frequency: this.ObjImp.Right_Resonant_Frequency,
      Left_Resonant_Frequency: this.ObjImp.Left_Resonant_Frequency,
      Eustachian_Test: this.ObjImp.Eustachian_Test,
      Eustachian_Result_Left: this.ObjImp.Eustachian_Result_Left,
      Eustachian_Result_Right: this.ObjImp.Eustachian_Result_Right,
      Reflax_Right_Ipsi_500: this.ObjImp.Reflax_Right_Ipsi_500,
      Reflax_Right_Ipsi_1000: this.ObjImp.Reflax_Right_Ipsi_1000,
      Reflax_Right_Ipsi_2000: this.ObjImp.Reflax_Right_Ipsi_2000,
      Reflax_Right_Ipsi_4000: this.ObjImp.Reflax_Right_Ipsi_4000,
      Reflax_Right_Contra_500: this.ObjImp.Reflax_Right_Contra_500,
      Reflax_Right_Contra_1000: this.ObjImp.Reflax_Right_Contra_1000,
      Reflax_Right_Contra_2000: this.ObjImp.Reflax_Right_Contra_2000,
      Reflax_Right_Contra_4000: this.ObjImp.Reflax_Right_Contra_4000,
      Reflax_Left_Ipsi_500: this.ObjImp.Reflax_Left_Ipsi_500,
      Reflax_Left_Ipsi_1000: this.ObjImp.Reflax_Left_Ipsi_1000,
      Reflax_Left_Ipsi_2000: this.ObjImp.Reflax_Left_Ipsi_2000,
      Reflax_Left_Ipsi_4000: this.ObjImp.Reflax_Left_Ipsi_4000,
      Reflax_Left_Contra_500: this.ObjImp.Reflax_Left_Contra_500,
      Reflax_Left_Contra_1000: this.ObjImp.Reflax_Left_Contra_1000,
      Reflax_Left_Contra_2000: this.ObjImp.Reflax_Left_Contra_2000,
      Reflax_Left_Contra_4000: this.ObjImp.Reflax_Left_Contra_4000,
      Comment: this.ObjImp.Comment,
      Posted_By: this.$CompacctAPI.CompacctCookies.User_ID,
      Posted_On: this.DateService.dateConvert(new Date()),
      Left_Ear_Interpretation: this.ObjImp.Left_Ear_Interpretation,
      Right_Ear_Interpretation: this.ObjImp.Right_Ear_Interpretation
    }
    console.log("TempObj",TempObj);

    const TempObj2={
      Appo_ID: this.AppoIDvalue,
      Level_1_Status: this.Level_1_Status,
      Level_2_Status: this.Level_2_Status,
      Level_3_Status: this.Level_3_Status
    }
    console.log("TempObj2",TempObj2);

    this.ImpedanceAudiometryFormSubmitted=true;
    if(valid){
      this.Spinner=true;
      const obj = {
        "SP_String": "SP_BL_Txn_Doctor_Appo_IMPEDANCE",
        "Report_Name_String": "Create_BL_Txn_Doctors_Appo_Impedance",
        "Json_Param_String": JSON.stringify(TempObj),
        "Json_1_String": JSON.stringify(tempSaveJ1)
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        console.log("save data",data);
        if (data[0].Column1){
          this.Spinner=false;
          this.ImpedanceAudiometryFormSubmitted=false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Appointment Create",
            detail: "Succesfully "
          });
          this.clearData();
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


      const obj2 = {
        "SP_String": "sp_DoctorsAppointmentNew",
        "Report_Name_String": "Update_Consultancy_Done",
        "Json_Param_String": JSON.stringify(TempObj2),
      }
      this.GlobalAPI.postData(obj2).subscribe((data: any) => {
        console.log("save data2",data);
        if (data[0].Column1){
          this.Spinner=false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Appointment Create",
            detail: "Succesfully "
          });
          this.UpdateConsultancy.clearComData();
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

  onConfirm(){
  }
  onReject(){   
  }
  clearData(){
    this.ObjImp.Right_Type=undefined;
    this.ObjImp.Left_Type=undefined;
    this.ObjImp.Right_Pk_Pressure=undefined;
    this.ObjImp.Left_Pk_Pressure=undefined;
    this.ObjImp.Right_Compliance=undefined;
    this.ObjImp.Left_Compliance=undefined;
    this.ObjImp.Right_ECV=undefined;
    this.ObjImp.Left_ECV=undefined;
    this.ObjImp.Right_Resonant_Frequency=undefined;
    this.ObjImp.Left_Resonant_Frequency=undefined;
    this.ObjImp.Eustachian_Test=undefined;
    this.ObjImp.Eustachian_Result_Left=undefined;
    this.ObjImp.Eustachian_Result_Right=undefined;
    this.ObjImp.Reflax_Right_Ipsi_500=undefined;
    this.ObjImp.Reflax_Right_Ipsi_1000=undefined;
    this.ObjImp.Reflax_Right_Ipsi_2000=undefined;
    this.ObjImp.Reflax_Right_Ipsi_4000=undefined;
    this.ObjImp.Reflax_Right_Contra_500=undefined;
    this.ObjImp.Reflax_Right_Contra_1000=undefined;
    this.ObjImp.Reflax_Right_Contra_2000=undefined;
    this.ObjImp.Reflax_Right_Contra_4000=undefined;
    this.ObjImp.Reflax_Left_Ipsi_500=undefined;
    this.ObjImp.Reflax_Left_Ipsi_1000=undefined;
    this.ObjImp.Reflax_Left_Ipsi_2000=undefined;
    this.ObjImp.Reflax_Left_Ipsi_4000=undefined;
    this.ObjImp.Reflax_Left_Contra_500=undefined;
    this.ObjImp.Reflax_Left_Contra_1000=undefined;
    this.ObjImp.Reflax_Left_Contra_2000=undefined;
    this.ObjImp.Reflax_Left_Contra_4000=undefined;
    this.ObjImp.Comment=undefined;
    this.ObjImp.Left_Ear_Interpretation=undefined;
    this.ObjImp.Right_Ear_Interpretation=undefined;
    this.CheckBoxRECOMMENDATION=[];
  }
  
}

class IMPEDANCE{
  Name : any;
  PatientID: any;
  Sex: any;
  RefferedBy:any;
  Age: any;
  Centre:any;
  Probe_Frequency: any;
  Right_Type: any;
  Left_Type: any;
  Right_Pk_Pressure: any;
  Left_Pk_Pressure: any;
  Right_Compliance: any;
  Left_Compliance: any;
  Right_ECV: any;
  Left_ECV: any;
  Right_Resonant_Frequency: any;
  Left_Resonant_Frequency: any;
  Eustachian_Test: any;
  Eustachian_Result_Left: any;
  Eustachian_Result_Right: any;
  Reflax_Right_Ipsi_500: any;
  Reflax_Right_Ipsi_1000: any;
  Reflax_Right_Ipsi_2000: any;
  Reflax_Right_Ipsi_4000: any;
  Reflax_Right_Contra_500: any;
  Reflax_Right_Contra_1000: any;
  Reflax_Right_Contra_2000: any;
  Reflax_Right_Contra_4000: any;
  Reflax_Left_Ipsi_500: any;
  Reflax_Left_Ipsi_1000: any;
  Reflax_Left_Ipsi_2000: any;
  Reflax_Left_Ipsi_4000: any;
  Reflax_Left_Contra_500: any;
  Reflax_Left_Contra_1000: any;
  Reflax_Left_Contra_2000: any;
  Reflax_Left_Contra_4000: any;
  Comment: any;
  Left_Ear_Interpretation: any;
  Right_Ear_Interpretation: any;
}
