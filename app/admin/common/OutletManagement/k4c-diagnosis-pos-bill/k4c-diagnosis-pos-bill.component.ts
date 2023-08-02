import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, wtfEndTimeRange } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-k4c-diagnosis-pos-bill',
  templateUrl: './k4c-diagnosis-pos-bill.component.html',
  styleUrls: ['./k4c-diagnosis-pos-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cDiagnosisPosBillComponent implements OnInit {
  tabIndexToView: number = 0;
  ReportName: any;
  replist: any = [];
  visibleDate: string = "";
  currentMonth: Date = new Date();
  From_Date: Date = new Date();
  To_Date: Date = new Date();
  findObj: any;
  initDate: any = [];
  reportFormSubmit: boolean = false;
  Spinner: boolean = false;
  seachSpinner:boolean = false;
  buttonname: string = 'Create';
  CostCenterList:any = [];
  Cost_Cen_ID: any;
  GridList:any = [];
  GridListHeader:any = [];
  GetDataList: any = [];

  constructor(
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "K4C Diagnosis POS Bill",
      Link: " Outlet -> K4C Diagnosis POS Bill"
    });
    this.GetCostCenter();
  }
  getDateRangediagnosis(dateRangeObj: any) {
    if (dateRangeObj.length) {
      this.From_Date = dateRangeObj[0];
      this.To_Date = dateRangeObj[1];
    }
  }
  GetCostCenter() {
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Cost Center Name All",
      "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('report Names', data);
      this.CostCenterList = data;
    });
  }

  GetGridData(){
    this.GridList = [];
    this.GridListHeader = [];
    this.seachSpinner = true;
    const start = this.From_Date
    ? this.DateService.dateConvert(new Date(this.From_Date))
    : this.DateService.dateConvert(new Date());
    const end = this.To_Date
    ? this.DateService.dateConvert(new Date(this.To_Date))
    : this.DateService.dateConvert(new Date());
    const senddata = {
      From_Date : start,
      To_Date : end,
      Cost_Cen_ID : this.Cost_Cen_ID ? this.Cost_Cen_ID : 0
    }
    const obj = {
      "SP_String": "SP_Add_ON",
      "Report_Name_String": "Get_K4C_Diagnosis_POS_Bill",
      "Json_Param_String": JSON.stringify([senddata])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.GridList = data;
      this.GridListHeader = data.length ? Object.keys(data[0]): []
      this.seachSpinner = false;
      //  console.log("GridList ===",this.GridList);
    })
  } 
  GetData(docno){
    this.ngxService.start();
    this.GetDataList = [];
    if(docno) {
     const obj = {
      "SP_String": "SP_Controller_Master",
        "Report_Name_String": "Get Outlet Bill Details For Edit",
        "Json_Param_String": JSON.stringify([{Doc_No : docno}])
     }
     this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           // console.log(data);
           this.GetDataList = data;
      });
    }
  }
  ReGenerate (viewobj){
    
  }

  TabClick(e: any) {
  }

}
