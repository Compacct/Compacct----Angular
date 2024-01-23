import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pending-outcomes',
  templateUrl: './pending-outcomes.component.html',
  styleUrls: ['./pending-outcomes.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class PendingOutcomesComponent implements OnInit {
  tabIndexToView = 0;
  PatientDetailsList: any=[];
  PatientDetailsListHeader: any=[];

  seachSpinner: boolean=false;
  AudiologistList: any = [];
  CokkUiD: any = undefined;
  DoctorID: any = undefined;

  constructor(
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.CokkUiD = this.$CompacctAPI.CompacctCookies.User_ID;
    // console.log('this.CokkUiD',this.CokkUiD)
    this.Header.pushHeader({
      Header: "Pending Outcomes",
      Link: " Patient Management -> Pending Outcomes"
    });
    this.GetAudiologist();
  }
   GetAudiologist(){
    this.AudiologistList = [];
      const obj = {
        "SP_String": "Sp_Pending_Outcome",
        "Report_Name_String": "Get_User_id",
        "Json_Param_String": JSON.stringify([{User_ID :this.CokkUiD}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //  console.log("Get AudiologistList",data);
          if(data.length) {
              data.forEach(element => {
                element['label'] = element.Name,
                element['value'] = element.User_ID
              });
            this.AudiologistList = data;
            if (this.$CompacctAPI.CompacctCookies.User_Type === 'U') {
              this.DoctorID = this.AudiologistList[0].User_ID
            }        
          }
          else {
            this.AudiologistList = [];
            this.DoctorID = undefined;
          }
      });
  }

  getPatientDetailsList(){
    this.PatientDetailsList=[];
    this.seachSpinner=true;

    const tempobj = {
      User_ID : this.DoctorID ? this.DoctorID : 0
    }  
    // console.log("tempobj",tempobj);

    const obj = {
      "SP_String": "Sp_Pending_Outcome",
      "Report_Name_String": "Get_Pending_Outcome",
      "Json_Param_String": JSON.stringify(tempobj)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("getPatientDetailsList",data);
      this.seachSpinner= false;

      if (this.$CompacctAPI.CompacctCookies.User_Type === 'U' && !this.DoctorID) {
        this.PatientDetailsList=[];
      }else{
        this.PatientDetailsList = data;
      }
      
      // console.log('PatientDetailsList=====',this.PatientDetailsList);
      if (this.PatientDetailsList.length) {
        this.PatientDetailsListHeader = Object.keys(data[0]);
        // console.log('PatientDetailsListHeader=====',this.PatientDetailsListHeader);
      }

    })  
    
  }

  onConfirm(){

  }

  onReject() {
    this.compacctToast.clear("c");
  }

}
