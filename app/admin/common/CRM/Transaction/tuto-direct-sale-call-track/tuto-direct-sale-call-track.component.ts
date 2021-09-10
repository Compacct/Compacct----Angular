import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-tuto-direct-sale-call-track',
  templateUrl: './tuto-direct-sale-call-track.component.html',
  styleUrls: ['./tuto-direct-sale-call-track.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoDirectSaleCallTrackComponent implements OnInit {
  DashboardList = [];
  DynamicHeader = [];
  seachSpinner = false;
  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private router : Router,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Call Status",
      Link: "CRM -> Call Status"
    });
    this.getdashboarddetails();
  }
  getdashboarddetails(){
      const obj = {
        'SP_String': 'Tutopia_Direct_Sale_Dashboard',
        'Report_Name_String' : 'Get_Agent_Dashboard',
        'Json_Param_String' : JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}]),
        'Json_1_String' : 'NA',
        'Json_2_String' : 'NA',
        'Json_3_String' : 'NA',
        'Json_4_String' : 'NA'
      }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
         console.log(data);
         if(data.length) {
          this.DynamicHeader = Object.keys(data[0]);
         this.DashboardList = data;
         }
        });
  }
  DynamicRedirectTo (obj,clickedOn){
    const QueryObj = {
      User :  window.btoa(obj.User_ID),
      Action : window.btoa(clickedOn)
    }
    const navigationExtras: NavigationExtras = {
      queryParams: QueryObj,
    };
    this.router.navigate(['./Tutopia_CRM_Lead'], navigationExtras);
  }
}
