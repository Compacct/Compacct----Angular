import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute } from '@angular/router';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-followup-with-sales-details',
  templateUrl: './followup-with-sales-details.component.html',
  styleUrls: ['./followup-with-sales-details.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class FollowupWithSalesDetailsComponent implements OnInit {
  userid: any = undefined;
  FollowupWithSalesDetailsSubmitted:boolean = false;
  User_Id:any;
  userList: any = [];
  FollowupDate: Date = new Date();
  FollowupSalesDetailsList:any = [];
  FollowupSalesDetailsListDynmic:any = [];
  FollowupSalesDetailsListBackup:any = [];
  DistPatientID:any = [];
  SelectedDistPatientID:any = [];
  DistEnquirySource:any = [];
  SelectedDistEnquirySource:any = [];
  DistCostCenter:any = [];
  SelectedDistCostCenter:any = [];
  DistFollowupType:any = [];
  SelectedFollowupType:any = [];
  SearchFields:any = [];


  constructor(
    private $http: HttpClient,  
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.userid = this.$CompacctAPI.CompacctCookies.User_ID
    this.Header.pushHeader({
      Header: "Patient Followup",
      Link: "Patient Followup"
    });
    this.getUsertype();
  }
  getUsertype() {
    this.userList = []
    const obj = {
      "SP_String": "sp_Followup_With_Sales_Details",
      "Report_Name_String": "Get_User_for_Sales_Details",
      "Json_Param_String": JSON.stringify([{User_ID : Number(this.userid)}]) ,
     }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
      if (data.length) {
        data.forEach(el => {
          el['label'] = el.User_Name;
          el['value'] = el.User_ID;
        });
        this.userList = data;
        if (this.$CompacctAPI.CompacctCookies.User_Type === "U") {
          this.User_Id = this.userList[0].User_ID;
        }   
      }
      })
  }
  GetFollowupSalesDetails(valid:any){
    this.FollowupWithSalesDetailsSubmitted = true;
    this.FollowupSalesDetailsList = [];  
    this.FollowupSalesDetailsListDynmic = [];
    this.FollowupSalesDetailsListBackup = [];
    if (valid) {
      this.ngxService.start();
     const RegObj = {
      User_ID: this.User_Id,
      Next_Followup:this.DateService.dateConvert(this.FollowupDate),
      }
      const obj = {
      "SP_String": "sp_Followup_With_Sales_Details",
      "Report_Name_String": "Get_Followup_With_Sales_Details",
      "Json_Param_String": JSON.stringify([RegObj]) ,
     }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
      if (data.length) {
        //console.log("RegObj ==", data)
        this.FollowupSalesDetailsList = data
        this.FollowupSalesDetailsListDynmic = Object.keys(data[0]);
        this.FollowupSalesDetailsListBackup = data
        this.ngxService.stop();
        this.FollowupWithSalesDetailsSubmitted = false;
        this.GetDistinct();
      } else {
        this.ngxService.stop();
      }
      }) 
    }
  }
  exportoexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
  // DISTINCT & FILTER
  GetDistinct() {
    let DEnquirySource:any = [];
    let DCostCenter:any = [];
    let DFollowType:any = [];
    this.DistEnquirySource =[];
    this.SelectedDistEnquirySource =[];
    this.DistCostCenter =[];
    this.SelectedDistCostCenter =[];
    this.DistFollowupType = [];
    this.SelectedFollowupType = [];
    this.SearchFields =[];
    this.FollowupSalesDetailsList.forEach((item) => {
    if (DEnquirySource.indexOf(item.Enq_Source_Name) === -1) {
      DEnquirySource.push(item.Enq_Source_Name);
      this.DistEnquirySource.push({ label: item.Enq_Source_Name, value: item.Enq_Source_Name });
    }
    if (DCostCenter.indexOf(item.Cost_Cen_Name) === -1) {
      DCostCenter.push(item.Cost_Cen_Name);
      this.DistCostCenter.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
    }
    if (DFollowType.indexOf(item.Followup_Type) === -1) {
      DFollowType.push(item.Followup_Type);
      this.DistFollowupType.push({ label: item.Followup_Type, value: item.Followup_Type });
    }
  });
     this.FollowupSalesDetailsListBackup = [...this.FollowupSalesDetailsList];
  }
  FilterDist() {
    let DEnquirySource:any = [];
    let DCostCenter:any = [];
    let DFollowType:any = [];
    this.SearchFields =[];
  if (this.SelectedDistEnquirySource.length) {
    this.SearchFields.push('Enq_Source_Name');
    DEnquirySource = this.SelectedDistEnquirySource;
  }
  if (this.SelectedDistCostCenter.length) {
    this.SearchFields.push('Cost_Cen_Name');
    DCostCenter = this.SelectedDistCostCenter;
  }
  if (this.SelectedFollowupType.length) {
    this.SearchFields.push('Followup_Type');
    DFollowType = this.SelectedFollowupType;
  }
  this.FollowupSalesDetailsList = [];
  if (this.SearchFields.length) {
    let LeadArr = this.FollowupSalesDetailsListBackup.filter(function (e) {
      return (DEnquirySource.length ? DEnquirySource.includes(e['Enq_Source_Name']) : true)
      && (DCostCenter.length ? DCostCenter.includes(e['Cost_Cen_Name']) : true)
      && (DFollowType.length ? DFollowType.includes(e['Followup_Type']) : true)
    });
  this.FollowupSalesDetailsList = LeadArr.length ? LeadArr : [];
  } else {
  this.FollowupSalesDetailsList = [...this.FollowupSalesDetailsListBackup] ;
  }
  }
  redirectPatientDetails(cool:any) {
       if(cool.Patient_ID){
      window.open('/Hearing_CRM_Lead_Search?recordid=' + window.btoa(cool.Patient_ID));
    }
  }
  Appointment() {
      window.open('/Hearing_BL_CRM_Appointment');
  }
}


