import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tinnitus-evauation-report-dashboard',
  templateUrl: './tinnitus-evauation-report-dashboard.component.html',
  styleUrls: ['./tinnitus-evauation-report-dashboard.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TinnitusEvauationReportDashboardComponent implements OnInit {
  AppoIDvalue:number;

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
       console.log("AppoIDvalue",this.AppoIDvalue);
     })
   }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Tinnitus Assessment & Counselling",
      Link: " Patient Management -> Tinnitus Assessment & Counselling"
    });

  }

  action_Click_Tinnitus_Assesment(){
    window.open("Doctors_Appointment_New_Tinnitus_Report" + "?Appo_ID=" + this.AppoIDvalue + "&ed=y", '_blank');
  }

  action_Click_Tinnitus_Evaluation(){
    window.open("Doctors_Appointment_New_Tinnitus_Evaluation" + "?Appo_ID=" + this.AppoIDvalue + "&ed=y", '_blank');
  }

  
}
