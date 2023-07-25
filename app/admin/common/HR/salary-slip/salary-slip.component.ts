import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';

@Component({
  selector: 'app-salary-slip',
  templateUrl: './salary-slip.component.html',
  styleUrls: ['./salary-slip.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SalarySlipComponent implements OnInit {
  currentdate = new Date();
  Doc_date : any;
  display = false;
  Spinner = false;
  Month_Name : any;
  startdate = undefined;
  AllAttendanceData = [];

  DynamicHeader:any = [];
  cols:any =[]
  BrowseList = [];

  constructor(
    private route : ActivatedRoute,
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Salary Slip",
      Link: " HR -> Salary Slip"
    });
    // this.getAttendanceType();
    const d = new Date();
    let month = d.getMonth() + 1;
    console.log('month',month)
    let year = d.getFullYear();
    this.Month_Name = month < 10 ? year+'-'+0+month : year+'-'+month
    //this.startdate = this.Month_Name+'-'+'01'
    console.log('Month_Name',this.Month_Name)
   // this.Month_Name = new Date();
    this.GetBrowseData();
  }
  GetBrowseData(){
    this.BrowseList = [];
    var firstDate = this.Month_Name+'-'+'01'
    console.log('firstDate',firstDate)
    const AtObj = {
      StartDate : this.DateService.dateConvert(new Date(firstDate)),
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID
    }
    if (this.Month_Name) {
    const obj = {
      "SP_String": "SP_Process_Monthly_Attendance_Sheet",
      "Report_Name_String": "Individual Salary Slips",
      "Json_Param_String": JSON.stringify([AtObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Data From Api",data);
      this.BrowseList = data;
      if(this.BrowseList.length){
        this.DynamicHeader = Object.keys(data[0]);
        console.log('this.DynamicHeader===',this.DynamicHeader)
      }
      else {
        this.DynamicHeader = [];
      }
      console.log('this.BrowseList',this.BrowseList)
  })
  }
  }
  Print(DocNo) {
    if(DocNo) {
      var empidd = DocNo.EMP_ID;
      var sldate = this.DateService.dateConvert(new Date(DocNo.Salary_Month));
    const objtemp = {
      "SP_String": "SP_Leave_Application",
      "Report_Name_String": "Print_Salary_Slip"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Emp_ID=" + empidd + "&SLDate=" + sldate, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
  }

}
