import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tuto-ds-dashboard',
  templateUrl: './tuto-ds-dashboard.component.html',
  styleUrls: ['./tuto-ds-dashboard.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoDsDashboardComponent implements OnInit {

  constructor( private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "DS Dashboard",
      Link: "CRM -> DS Dashboard"
    });
  }

}
