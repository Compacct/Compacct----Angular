import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-view-outcomes',
  templateUrl: './view-outcomes.component.html',
  styleUrls: ['./view-outcomes.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ViewOutcomesComponent implements OnInit {
  tabIndexToView = 0;
  PatientList: any=[];
  PatientID: any=undefined;
  AudiologistList: any=[];
  AudiologistID:any=undefined;
  StartDate:any=undefined;
  EndDate:any=undefined;
  seachSpinner:boolean=false;
  PatientDetailsList: any=[];
  PatientDetailsListHeader: any=[];
  OpenDiagnosis: boolean =false;
  FinalDetailsList: any=[];
  FinalDetailsListHeader: any=[];
  OpenFinal: boolean = false;
  CokkUiD: any = undefined;

  objDiagonisis: Diagonisis = new Diagonisis();
  objAppointment: Appointment = new Appointment();
  constructor(
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.CokkUiD = this.$CompacctAPI.CompacctCookies.User_ID;
    this.Header.pushHeader({
      Header: "View Outcomes",
      Link: " Patient Management -> View Outcomes"
    });
    this.GetAudiologist();
    this.GetPatient();
  }

  GetPatient(){
    this.PatientList = [];
    const obj = {
      "SP_String": "Sp_View_Outcomes",
      "Report_Name_String": "Get_Patient"
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //  console.log("Get PatientList",data);
      if(data.length) {
          data.forEach(element => {
            element['label'] = element.Patient,
            element['value'] = element.Foot_Fall_ID
          });
        this.PatientList = data;
      }
      else {
          this.PatientList = [];
      }
   });
  }

  GetAudiologist(){
    this.AudiologistList = [];
    const obj = {
      "SP_String": "Sp_View_Outcomes",
      "Report_Name_String": "Get_Audiologist",
       "Json_Param_String": JSON.stringify([{User_ID :this.CokkUiD}])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //  console.log("Get AudiologistList",data);
      if(data.length) {
          data.forEach(element => {
            element['label'] = element.Name,
            element['value'] = element.Doctor_ID
          });
        this.AudiologistList = data;
          if (this.$CompacctAPI.CompacctCookies.User_Type === 'U') {
          this.AudiologistID = this.AudiologistList[0].Doctor_ID
        }   
      }
      else {
        this.AudiologistList = [];
        this.AudiologistID = undefined;
      }
   });
  }

  getDateRange(dateRangeObj:any){
    if(dateRangeObj.length){
      this.StartDate = dateRangeObj[0];
      this.EndDate = dateRangeObj[1];
    }
  }

  getPatientDetailsList(){
    // console.log('this.StartDate',this.StartDate);
    // console.log('this.EndDate',this.EndDate);
    // console.log('this.AudiologistID',this.AudiologistID);
    // console.log('this.PatientID',this.PatientID);

    const start = this.StartDate
    ? this.DateService.dateConvert(new Date(this.StartDate))
    : this.DateService.dateConvert(new Date());
    const end = this.EndDate
    ? this.DateService.dateConvert(new Date(this.EndDate))
    : this.DateService.dateConvert(new Date());

    this.PatientDetailsList=[];
    this.OpenDiagnosis=false;
    this.OpenFinal=false;

    if(start && end){

      const tempobj = {
        FromDate: start,
        ToDate: end,
        Doctor_ID: this.AudiologistID ? this.AudiologistID : 0,
        Foot_Fall_ID: this.PatientID ? this.PatientID : 0
      }
      // console.log("tempobj",tempobj);

      const obj = {
        "SP_String": "Sp_View_Outcomes",
        "Report_Name_String": "Get_Appointment_For_Outcomes",
        "Json_Param_String": JSON.stringify(tempobj)
      }
      this.ngxService.start();
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.ngxService.stop();
        // console.log("getPatientDetailsList",data);

        this.PatientDetailsList = data;
        // console.log('PatientDetailsList=====',this.PatientDetailsList);
        if (this.PatientDetailsList.length) {
          this.PatientDetailsListHeader = Object.keys(data[0]);
          // console.log('PatientDetailsListHeader=====',this.PatientDetailsListHeader);
        }
        else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "No Appointment Found",
            detail:" "
          });
        }
      })
    }
  }

  actionClick_ViewDetails(col){
    // console.log("col.Appo_Dt",col.Appo_Dt);
    this.OpenFinal=false;
    this.OpenDiagnosis=false;
    this.objDiagonisis = new Diagonisis();
    this.objAppointment= new Appointment();
    if(col.Appo_Dt){

      this.objAppointment= col;
      // console.log("this.objAppointment",this.objAppointment);
     
      const getTempObj = {
        Appo_Dt : this.DateService.dateTimeConvert(new Date(col.Appo_Dt))
      }
      // console.log("getTempObj",getTempObj);

      const getObj = {
        "SP_String": "Sp_View_Outcomes",
        "Report_Name_String": "Get_Provisional_Diagonisis",
        "Json_Param_String": JSON.stringify([getTempObj])
      }
      this.GlobalAPI.getData(getObj).subscribe((data:any)=>{
        // console.log("Get_Provisional_Diagonisis",data);
        this.OpenDiagnosis=true;
        if(data.length){
          this.objDiagonisis= data[0];
          // console.log("dataaaaaaaa",this.objDiagonisis);
        }
      });
      this. actionClick_Final(col);
    }
  }

  actionClick_Final(col){
    // console.log("col.Appo_Dt",col.Appo_Dt);
    if(col.Appo_Dt){
      const getFinalTempObj = {
        Appo_Dt : this.DateService.dateTimeConvert(new Date(col.Appo_Dt))
      }
      // console.log("getFinalTempObj",getFinalTempObj);

      const getFinalObj = {
        "SP_String": "Sp_View_Outcomes",
        "Report_Name_String": "Get_Final_Objection",
        "Json_Param_String": JSON.stringify([getFinalTempObj])
      }
      this.GlobalAPI.getData(getFinalObj).subscribe((data:any)=>{
        // console.log("Get_Final_Objection",data);
        this.OpenFinal=true;
        this.FinalDetailsList = data;
        // console.log('FinalDetailsList=====',this.FinalDetailsList);
        if (this.FinalDetailsList.length) {
          this.FinalDetailsListHeader = Object.keys(data[0]);
          // console.log('FinalDetailsListHeader=====',this.FinalDetailsListHeader);
        }
      });
    }  
  }

  onConfirm(){

  }

  onReject() {
    this.compacctToast.clear("c");
  }

}

class Diagonisis{
  PTA_Left_250: any;
  PTA_Left_500: any;
  PTA_Left_1000: any;
  PTA_Left_2000: any;
  PTA_Left_4000: any;
  PTA_Left_8000: any;
  PTA_Left: any;
  PTA_Right_250: any;
  PTA_Right_500: any;
  PTA_Right_1000: any;
  PTA_Right_2000: any;
  PTA_Right_4000: any;
  PTA_Right_8000: any;
  PTA_Right: any;
  Degree_Of_Loss_Name: any;
  Degree_Of_Loss_Name1: any;
  Hearing_Loss: any;
  Hearing_Loss1: any;
  Type_Of_Loss: any;
  Type_Of_Loss1: any;
  Tinnitus_Status: any;
  Sub_Status: any;
  Objection: any;
  Trial_Success: any;
  PTA_Remarks: any;
  PTA_Support_Convert: any;
} 

class Appointment{
  Appo_Dt: any;
  Cost_Cen_Name: any;
  Name: any;
  Consultancy_Type: any;
}
