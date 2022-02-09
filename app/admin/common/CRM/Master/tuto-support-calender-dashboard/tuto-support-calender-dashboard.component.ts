import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { map } from 'rxjs/operators';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-tuto-support-calender-dashboard',
  templateUrl: './tuto-support-calender-dashboard.component.html',
  styleUrls: ['./tuto-support-calender-dashboard.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoSupportCalenderDashboardComponent implements OnInit {
  tabIndexToView = 0;
  Statrt_Date:any;
  End_Date:any;
  getAllData = [];
  popupData = [];
  popupModel = false;
  popupName = undefined;
  popupAssign = undefined;
  seachSpinner = false;
  constructor(private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Student Calender Dashborard",
      Link: " CRM -> Calender Dashboard"
    });
  }
  onReject(){    
    this.compacctToast.clear("c");
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.Statrt_Date = dateRangeObj[0];
      this.End_Date = dateRangeObj[1];
    }
  }
  searchCalenderdashboard(valid){
   if(valid){
     this.seachSpinner = true;
   const Objtemp = {
    start_date : this.Statrt_Date ? this.DateService.dateConvert(new Date(this.Statrt_Date)) : this.DateService.dateConvert(new Date()),
    end_date: this.End_Date ? this.DateService.dateConvert(new Date(this.End_Date)) : this.DateService.dateConvert(new Date())
     }
     const objj = {
      "SP_String": "Tutopia_Support_Calender_Dashboard",
      "Report_Name_String" : "Get_Calender_Dash_Board",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
       this.getAllData = data;
       console.log("getAllData",this.getAllData);
       this.seachSpinner = false;
    })
   }
  }
   rowClick(col,value){
    if(col.Follouwp_User_ID){
      this.popupData = [];
      this.popupAssign = col.Assign_To;
      this.popupName = value;
      let reportName = undefined;
       const ObjTemp = {
        start_date :this.Statrt_Date ? this.DateService.dateConvert(new Date(this.Statrt_Date)) : this.DateService.dateConvert(new Date()),   
        end_date :this.End_Date ? this.DateService.dateConvert(new Date(this.End_Date)) : this.DateService.dateConvert(new Date()),
        Follouwp_User_ID : col.Follouwp_User_ID  
       }
       console.log("value",value)
       reportName = value =="Total" ? 'Get_Calender_Dash_Board_Details' : value ==='Done'? 'Get_Calender_Dash_Board_Details_Done' : 'Get_Calender_Dash_Board_Details_Pending';
       console.log("reportName",reportName) 
       const objj = {
        "SP_String": "Tutopia_Support_Calender_Dashboard",
        "Report_Name_String" : reportName,
        "Json_Param_String" : JSON.stringify([ObjTemp])
      }
      this.GlobalAPI.getData(objj).subscribe((data:any)=>{
       this.popupData = data;
       setTimeout(() => {
         this.popupModel = true;
       }, 200);
       console.log("popupData",this.popupData);
      })  
      }
  }
}
