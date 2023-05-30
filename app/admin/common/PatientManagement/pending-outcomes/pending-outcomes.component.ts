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
  StartDate:any=undefined;
  EndDate:any=undefined;

  constructor(
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Pending Outcomes",
      Link: " Patient Management -> Pending Outcomes"
    });
  }

  getDateRange(dateRangeObj:any){
    if(dateRangeObj.length){
      this.StartDate = dateRangeObj[0];
      this.EndDate = dateRangeObj[1];
    }
  }

  getPatientDetailsList(){
    const start = this.StartDate
    ? this.DateService.dateTimeConvert(new Date(this.StartDate))
    : this.DateService.dateConvert(new Date());
    const end = this.EndDate
    ? this.DateService.dateTimeConvert(new Date(this.EndDate))
    : this.DateService.dateConvert(new Date());

    this.PatientDetailsList=[];

    if(start && end){
      this.seachSpinner=true;

      const tempobj = {
        FromDate: start,
        ToDate: end
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

  onConfirm(){

  }

  onReject() {
    this.compacctToast.clear("c");
  }

}
