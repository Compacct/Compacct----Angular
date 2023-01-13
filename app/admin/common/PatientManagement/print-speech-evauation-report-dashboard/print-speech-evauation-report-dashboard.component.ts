import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-print-speech-evauation-report-dashboard',
  templateUrl: './print-speech-evauation-report-dashboard.component.html',
  styleUrls: ['./print-speech-evauation-report-dashboard.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class PrintSpeechEvauationReportDashboardComponent implements OnInit {
  AppoIDvalue:number;
  tabIndexToView:number= 0;

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
      //  console.log("AppoIDvalue",this.AppoIDvalue);
     })
  }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Print Speech Evauation Report",
      Link: " Patient Management -> Print Speech Evauation Report"
    });

  }

  action_Click_Print_Fluency_Evaluation(){
    window.open("Report/Crystal_Files/CRM/joh_form/FLUENCY_EVALUATION.aspx" + "?Appo_ID=" + this.AppoIDvalue, 'Print Report', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }

  action_Click_Print_Child_Speech_Evaluation(){
    window.open("Report/Crystal_Files/CRM/joh_form/CHILD_SPEECH_eval.aspx" + "?Appo_ID=" + this.AppoIDvalue, 'Print Report', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }

  action_Click_Print_Adult_Speech_Evaluation(){
    window.open("Report/Crystal_Files/CRM/joh_form/ADULT_SPEECH_AND_LANGUAGE.aspx" + "?Appo_ID=" + this.AppoIDvalue, 'Print Report', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }

  action_Click_Print_Consent_Form_For_Speech_Parents(){
    window.open("Report\Crystal_Files\CRM\joh_form\CONSENT_FORM_FOR_SPEECH_PARENTS.aspx" + "?Appo_ID=" + this.AppoIDvalue, 'Print Report', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }

  action_Click_Print_Consent_Form_For_Speech_By_Self(){
    window.open("Report\Crystal_Files\CRM\joh_form\consent_from_for_speech_language_by_self.aspx" + "?Appo_ID=" + this.AppoIDvalue, 'Print Report', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }

}
