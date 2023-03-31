import { data } from 'jquery';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service"; 
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-create-cookie',
  templateUrl: './create-cookie.component.html',
  styleUrls: ['./create-cookie.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CreateCookieComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header: CompacctHeader ,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
  ) { }

  ngOnInit() {
    this.header.pushHeader({
      Header: "Create Desktop Cookies",
      Link: " User Management -> Create Desktop Cookies"
    })
  }
  async createCookie(){
    console.log("Click")
    const fetchPromise = fetch("Createt_Desktop_Cookies/Create_Cookie");
    fetchPromise.then(response => {
      return response.text();
    }).then(data => {
      if(data == 'Done'){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          sticky:true,
          severity: "success",
          detail: "Cookie has been Created"
        });
      }
    });
  }
}
