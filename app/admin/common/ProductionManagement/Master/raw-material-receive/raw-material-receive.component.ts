import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpParams } from "@angular/common/http";
import { DateTimeConvertService } from './../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from './../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from './../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from './../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-raw-material-receive',
  templateUrl: './raw-material-receive.component.html',
  styleUrls: ['./raw-material-receive.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class RawMaterialReceiveComponent implements OnInit {
tabIndexToView = 0
  items: any = [];
  buttonname = "Create"
  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header:CompacctHeader, 
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
  ) { }
  ngOnInit() {
   this.items = ["BROWSE", "CREATE"];
      this.header.pushHeader({
    Header: "Raw Material Receive",
    Link: " Production Management -> Master -> Raw Material Receive"
  });
  }
TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";   
}

}
