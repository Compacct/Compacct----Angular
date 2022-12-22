import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-doctors-appointment-new-tinnitus-handicap',
  templateUrl: './doctors-appointment-new-tinnitus-handicap.component.html',
  styleUrls: ['./doctors-appointment-new-tinnitus-handicap.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DoctorsAppointmentNewTinnitusHandicapComponent implements OnInit {
  tabIndexToView:number= 0;
  GenderList:any=[];
  AppoIDvalue:number;
  EditPage:any;
  TinnitusHandicapFormSubmitted:boolean= false;
  Spinner:boolean=false;
  buttonname:any='Create';
  patientSearchList:any= [];
  CheckBoxRECOMMENDATION:any=[];
  TestName:any='Tinnitus_Handicap';
  buttonValid:boolean= true;
  EditDataList:any=[];
  DropdownList: any= [];

  ObjAppoID: AppoID = new AppoID();
  ObjTinnitusHandicap: TinnitusHandicap = new TinnitusHandicap();

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
          // this.editData();
       } 
     })
  }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "TINNITUS HANDICAP INVENTORY (THI)",
      Link: " Patient Management -> TINNITUS HANDICAP INVENTORY (THI)"
    });
    this.GenderList=['Male','Female','Other'];
    this.GetAllDataAppoID();
    this.DropdownList= ['Yes','No','Sometimes'];
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
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
      }
    });
  }

  saveDocAppo(valid:any){
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
}
class TinnitusHandicap{
  concentrate: any;
  loudness: any;
  angry: any;
  confused: any;
  desperate: any;
  complain: any;
  asleep: any;
  escape1: any;
  social_activities: any;
  frustrated: any;
  disease: any;
  life: any;
  household: any;
  irritable: any;
  read1: any;
  upset: any;
  relationship: any;
  focus: any;
  control1: any;
  tired: any;
  depressed: any;
  anxious: any;
  cope: any;
  stress: any;
  insecure: any;
  total_score: any;
}
