import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../shared/compacct.services/common.api.service";
import { DateTimeConvertService } from '../compacct.global/dateTime.service';

@Injectable({
  providedIn: 'root'
})
export class CommonUserActivityService {
  url = window["config"];

  objUserActivityLog: UserActivityLog = new UserActivityLog();
  userActivity = {};

  constructor(
    private http: HttpClient,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { 
    this.GetIpInfo();
  }

  GetIpInfo() {
    this.http.get("http://ip-api.com/json").subscribe((data: any) => {
   
      if(data){
        this.objUserActivityLog.Activity_Date = this.DateService.dateTimeConvert(new Date());
        this.objUserActivityLog.USER_ID = this.$CompacctAPI.CompacctCookies.User_ID;
        this.objUserActivityLog.USER_IP = data.query;
        this.objUserActivityLog.City = data.city;
        this.objUserActivityLog.Country = data.country;
        this.objUserActivityLog.ISP = data.isp;
        this.objUserActivityLog.Lat = data.lat;
        this.objUserActivityLog.Lon = data.lon;
        this.objUserActivityLog.Region_Name = data.regionName;
      }
    });
  }
  GetUserActivity(ActivityType, ActivityDetails, DOCNO, TxnID) {
    this.objUserActivityLog.Activity_Type = ActivityType;
    this.objUserActivityLog.Activity_Details = ActivityDetails;
    this.objUserActivityLog.DOC_NO = DOCNO;
    this.objUserActivityLog.Txn_ID = TxnID;
    this.http.post("/Common/Create_User_Activity_Log_Ajax", this.objUserActivityLog).subscribe((data: any) => {
      this.userActivity = data;
      return this.userActivity;
    });
  }
}

class UserActivityLog {
  Activity_ID: any;
  Activity_Date: any;
  USER_ID: any;
  USER_IP: any;
  Activity_Type: any;
  Activity_Details: any;
  DOC_NO: any;
  City: any;
  Country: any;
  ISP: any;
  Lat: any;
  Lon: any;
  Region_Name: any;
  Txn_ID: any;
}
