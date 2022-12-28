import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tinnitus-therapy-tracker-dashboard',
  templateUrl: './tinnitus-therapy-tracker-dashboard.component.html',
  styleUrls: ['./tinnitus-therapy-tracker-dashboard.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TinnitusTherapyTrackerDashboardComponent implements OnInit {
  AppoIDvalue:number;

  tabIndexToView : any = 0;

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
      Header: "Tinnitus Therapy (Per Session)",
      Link: " Patient Management -> Tinnitus Therapy (Per Session)"
    });

  }

  action_Click_Tinnitus_Therapy(){
    window.open("Doctors_Appointment_New_Tinnitus_Therapy_Tracker" + "?Appo_ID=" + this.AppoIDvalue + "&ed=y", '_blank');
  }

  action_Click_Tinnitus_Handicap(){
    window.open("Doctors_Appointment_New_Tinnitus_Handicap" + "?Appo_ID=" + this.AppoIDvalue + "&ed=y", '_blank');
  }

}
