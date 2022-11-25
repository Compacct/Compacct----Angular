import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-doctors-appointment-new-abr',
  templateUrl: './doctors-appointment-new-abr.component.html',
  styleUrls: ['./doctors-appointment-new-abr.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class DoctorsAppointmentNewABRComponent implements OnInit {
  tabIndexToView = 0;
  Appo_Date:any;
  CentreList:any=[];
  StimulusList:any=[];
  GenderList:any=[];
  RemarksList:any=[];
  StatusList:any=[];
  Spinner:boolean=false;
  AppoIDvalue:any;
  patientSearchList:any=[];

  ObjABR: ABR = new ABR();
  constructor(
    private header:CompacctHeader,
    private $http: HttpClient,
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService,
    private route: ActivatedRoute,
    ) { 
    this.route.queryParams.subscribe(params => {
     // console.log("param",params);
      this.AppoIDvalue=params.Appo_ID;
      console.log("value",this.AppoIDvalue);
     })
  }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "AUDITORY EVOKED BRAINSTEM RESPONSE",
      Link: " Patient Management -> AUDITORY EVOKED BRAINSTEM RESPONSE"
    });
    this.Appo_Date = new Date();
    this.GenderList=['Male','Female','Other'];
    this.StimulusList=['Clicks','Tone Burst','Chirp'];
    this.RemarksList=['Clear and replicable peak present','No Clear and replicable peak present'];
    this.StatusList=['Test Done but H.A. not required','Test Done H.A. required but Trial Not Taken','Test Done H.A. required and Wiling to Buy'];
    this.GetCostCentre();
    this.GetAllDataAppoID();
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
      console.log("GetAllDataAppoID",data);
      if(data.length){
        this.patientSearchList=data;

        this.ObjABR.Name=this.patientSearchList[0].Name;
        this.ObjABR.PatientID=this.patientSearchList[0].Foot_Fall_ID;
        this.ObjABR.Sex=this.patientSearchList[0].Sex;
        this.ObjABR.RefferedBy=this.patientSearchList[0].Referredby;
        this.ObjABR.Age=this.patientSearchList[0].Age;
        this.ObjABR.Centre=this.patientSearchList[0].Cost_Cen_ID;
        this.Appo_Date=this.patientSearchList[0].Appo_Dt ? this.patientSearchList[0].Appo_Dt : "-";
      }
    });
  }
}

class ABR{
  Name : any;
  PatientID: any;
  Sex: any;
  RefferedBy:any;
  Age: any;
  Filter: any;
  RepetitionRate: any;
  Centre:any;
  Stimulus:any;
  LRemarks1:any;
  LRemarks2:any;
  LRemarks3:any;
  RRemarks1:any;
  RRemarks2:any;
  RRemarks13:any;
  RECOMMENDATION:any;
  Status:any;
  StiInt1:any;
  StiInt2:any;
  StiInt3:any;
  LLaten1:any;
  LLaten2:any;
  LLaten3:any;
  LAmp1:any;
  LAmp2:any;
  LAmp3:any;
  RLaten1:any;
  RLaten2:any;
  RLaten3:any;
  RAmp1:any;
  RAmp2:any;
  RAmp3:any;
  REar:any;
  LEar:any;
  Comment:any;
}
