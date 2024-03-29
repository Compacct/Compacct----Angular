import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-new-adult-speech-evaluation',
  templateUrl: './new-adult-speech-evaluation.component.html',
  styleUrls: ['./new-adult-speech-evaluation.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NewAdultSpeechEvaluationComponent implements OnInit {
  items:any = [];
  tabIndexToView :number= 1;
  buttonname:string = "Create";
  Date_Top: Date = new Date();
  Objevaluation :evaluation = new evaluation();
  Spinner:boolean = false;
  BrieflyDescribeList :any = [
    {'label':'Stuttering/Stammering','value':'Stuttering/Stammering'},
    {'label':'Dialect/pronunciation problems','value':'Dialect/pronunciation problems'},
    {'label':'Hoarse or weak voice','value':'Hoarse or weak voice'},
    {'label':'Swallowing problems','value':'Swallowing problems'},
    {'label':'Other voice problem','value':'Other voice problem'},
    {'label':'Mental retardation','value':'Mental retardation'},
    {'label':'Laryngectomy','value':'Laryngectomy'},
    {'label':'Dementia/Cognitive problems','value':'Dementia/Cognitive problems'},
    {'label':'Communication problems from stroke','value':'Communication problems from stroke'},
    {'label':'Hearing loss','value':'Hearing loss'},
    {'label':'Communication problem from head injury','value':'Communication problem from head injury'},
    {'label':'Cochlear implant','value':'Cochlear implant'}
  ];
  SelectedBrieflyDescribe :any = [];
  constructor(
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    private ActivatedRoute: ActivatedRoute,
    private Header: CompacctHeader,
    private GlobalApi: CompacctGlobalApiService,
    private $CompacctAPI: CompacctCommonApi
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "New Adult Speech Evaluation",
      Link: ""
    })
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
    
  }
  clearData(){}
  saveData(va){}
  onConfirm(){}
  onReject(){
    this.compacctToast.clear();
  }

}
class evaluation{
  First_Name:any;
  Sur_Name:any;
  gender:any;
  age:any;
  mobile_no:any;
  Email:any;
  home_address:any;
  profession:any;
 //Send on create time
  Referred_By:any;
  Briefly_description:any;
  Referred_condition:any;
  Referred_condition_other:any;
}
