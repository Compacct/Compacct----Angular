import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-therapy-attendance-entry',
  templateUrl: './therapy-attendance-entry.component.html',
  styleUrls: ['./therapy-attendance-entry.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TherapyAttendanceEntryComponent implements OnInit {

  tabIndexToView:number;
  patientList:any = [];
  Patient_Fall_Id:any;
  From_Date:Date = new Date();
  To_Date:Date = new Date();
  initDate : any = [];
  SerachFormSubmitted:boolean = false;
  TableData:any = [];


  constructor( 
    private Header:CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi : CompacctCommonApi,
    private DateService : DateTimeConvertService

  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header:"Therapy Attendance Card",
      Link:"PatientManagement --> Therapy Attendance Card"
    });

    this.getPatientList();

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

  getDateRange(dateRangeObj:any){
    if(dateRangeObj.length){
      this.From_Date = dateRangeObj[0];
      this.To_Date = dateRangeObj[1];
    }
   
  }

  getAllData(valid){
    this.SerachFormSubmitted = true;
    if(valid){
      // console.log(this.Patient_Fall_Id);
      // console.log(this.DateService.dateConvert(this.From_Date), this.DateService.dateConvert(this.To_Date));

      const tempObj = {
        Foot_Fall_ID: this.Patient_Fall_Id,
         Start_Date:this.DateService.dateConvert(this.From_Date), 
         End_Date:this.DateService.dateConvert(this.To_Date)
      }
      const obj = {
        "SP_String": "SP_BL_Txn_ATTENDANCE_CARD",
        "Report_Name_String": "Get_Therapy_Grid",   
        "Json_Param_String": JSON.stringify([tempObj])
      }

      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.TableData = data;
        console.log(data);
      })
    }
  }

  GetPrint(col){
    console.log(col);
    if (col.Appo_ID) {
      window.open("/Report/Crystal_Files/CRM/joh_form/Speech_Attendance_card.aspx?Appo_ID=" +col.Appo_ID, 
      'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
      );
  } 
  }

  onConfirm(){}

  onReject(){}

  TabClick(e){}

}
