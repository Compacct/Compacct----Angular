import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-print-tinnitus-therapy-tracker-dashboard',
  templateUrl: './print-tinnitus-therapy-tracker-dashboard.component.html',
  styleUrls: ['./print-tinnitus-therapy-tracker-dashboard.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class PrintTinnitusTherapyTrackerDashboardComponent implements OnInit {
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
      Header: "Print Tinnitus Therapy (Per Session)",
      Link: " Patient Management -> Print Tinnitus Therapy (Per Session)"
    });

  }

  action_Click_Print_Tinnitus_Therapy(){
    window.open("Report/Crystal_Files/CRM/joh_Form/TINNITUS THERAPY TRACKER.aspx" + "?Appo_ID=" + this.AppoIDvalue, 'Print Report', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }

  action_Click_Print_Tinnitus_Handicap(){
    window.open("Report/Crystal_Files/CRM/joh_Form/HANDICAP_INVENTORY.aspx" + "?Appo_ID=" + this.AppoIDvalue, 'Print Report', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }

  action_Click_Print_Consent_Form(){
    window.open("Report/Crystal_Files/CRM/joh_Form/CONSENT_Form.aspx" + "?Appo_ID=" + this.AppoIDvalue, 'Print Report', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }

}
