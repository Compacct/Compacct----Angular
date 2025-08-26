import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportExcelService } from '../../../shared/compacct.services/export-excel.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-doctors-patients-report',
  templateUrl: './doctors-patients-report.component.html',
  styleUrls: ['./doctors-patients-report.component.css'],
    providers: [MessageService],
    encapsulation: ViewEncapsulation.None
})
export class DoctorsPatientsReportComponent implements OnInit {
  start_date:any;
  end_date:any;
  DoctorsPatientsReportFormSubmited:boolean = false;
  CostCenterList:any = [];
  selectedCostCenter:any = [];
  Cost_Cen_ID:any;
  DoctorList:any = [];
  Enq_Source_Sub_ID:any;
  DrRefDetailsList:any = [];
  Spinner1:boolean = false;
  DrRefCalList:any = [];
  Spinner2:boolean = false;
  DrRefMonthlyList:any = [];
  Spinner3:boolean = false;
  DrRefTimeBasedList:any = [];
  Spinner4:boolean = false;

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private route : ActivatedRoute,
    private router : Router,
    private excelservice: ExportExcelService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Doctors Report",
      Link: " Patient Management -> Doctors Report"
    });
    this.GetCostCentre();
    this.GetDoctor();
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.start_date = dateRangeObj[0];
      this.end_date = dateRangeObj[1];
    }
  }
  GetCostCentre(){
    this.CostCenterList = [];
    const obj = {
      "SP_String": "sp_weekly_report",
      "Report_Name_String": "Get_cost_center"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(e=>{
        e['label'] = e.Cost_Cen_Name;
        e['value'] = e.Cost_Cen_ID;
      });
      this.CostCenterList = data.length ? data : [];
    })
  }
  // SelectCostCenter(){
  //   let compnyDetails: any = [];
  //     this.selectedCostCenter.forEach((ele: any) => {
  //       compnyDetails.push({
  //         "Cost_Cen_ID": ele
  //       });
  //     });
  // }
  GetDoctor(){
    this.DoctorList = [];
    const obj = {
      "SP_String": "sp_Doctor_Ref_report",
      "Report_Name_String": "Get_Ent_Doctor"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(e=>{
        e['label'] = e.Enq_Source_Sub_Name;
        e['value'] = e.Enq_Source_Sub_ID;
      });
      this.DoctorList = data.length ? data : [];
    })
  }
  DrRefDetails(){
    this.DrRefDetailsList = [];
    this.DoctorsPatientsReportFormSubmited = true;
    this.Spinner1 = true;
    const start = this.start_date
      ? this.DateService.dateConvert(new Date(this.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.end_date
      ? this.DateService.dateConvert(new Date(this.end_date))
      : this.DateService.dateConvert(new Date());
      let compnyDetails: any = [];
      this.selectedCostCenter.forEach((ele: any) => {
        compnyDetails.push({
          "Cost_Cen_ID": ele
        });
      });
    const tempobj = {
      Start_Date : start,
      End_Date : end,
      Cost_Cen_ID : this.Cost_Cen_ID ? this.Cost_Cen_ID : 0,
      Enq_Source_Sub_ID : this.Enq_Source_Sub_ID ? this.Enq_Source_Sub_ID : 0
    }
    
    const obj = {
      "SP_String": "sp_Doctor_Ref_report",
      "Report_Name_String": "Doctor_Ref_Details",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
       this.DrRefDetailsList = data;
       this.ExportToExcel1();
       this.Spinner1 = false;
       }
       this.DoctorsPatientsReportFormSubmited = false;
       this.Spinner1 = false;
     })
  }
  ExportToExcel1() {
    const excelData =
    {
      TopHeader: "Doctor Summary - Detailed",
      Header1: "Hearing Aids Dispensed",
      frozenHeaderRow: 2,
      frozenHeader: true,
      sheetName: "Detailed Doctor Reffered Cases",
      saveAsFile: `REPORT AS ON ${this.DateService.dateConvert(this.start_date)} To ${this.DateService.dateConvert(this.end_date)}`,
      data: this.DrRefDetailsList

    }
    this.excelservice.ExportExcelDrRefDetails(excelData);
  }
  DrRefCalculation(){
    this.DrRefCalList = [];
    this.DoctorsPatientsReportFormSubmited = true;
    this.Spinner2 = true;
    const start = this.start_date
      ? this.DateService.dateConvert(new Date(this.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.end_date
      ? this.DateService.dateConvert(new Date(this.end_date))
      : this.DateService.dateConvert(new Date());
      let compnyDetails: any = [];
      this.selectedCostCenter.forEach((ele: any) => {
        compnyDetails.push({
          "Cost_Cen_ID": ele
        });
      });
    const tempobj = {
      Start_Date : start,
      End_Date : end,
      Cost_Cen_ID : this.Cost_Cen_ID ? this.Cost_Cen_ID : 0,
      Enq_Source_Sub_ID : this.Enq_Source_Sub_ID ? this.Enq_Source_Sub_ID : 0
    }
    
    const obj = {
      "SP_String": "sp_Doctor_Ref_report",
      "Report_Name_String": "Doctor_Ref_Incentive",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
       this.DrRefCalList = data;
       this.ExportToExcel2();
       this.Spinner2 = false;
       }
       this.DoctorsPatientsReportFormSubmited = false;
       this.Spinner2 = false;
     })
  }
  ExportToExcel2() {
    const excelData =
    {
      TopHeader: "Doctor Referral Calcuation",
      Header1: "Hearing Aids Dispensed",
      frozenHeaderRow: 2,
      frozenHeader: true,
      sheetName: "Doctor Refferal Calculation",
      saveAsFile: `REPORT AS ON ${this.DateService.dateConvert(this.start_date)} To ${this.DateService.dateConvert(this.end_date)}`,
      data: this.DrRefCalList

    }
    this.excelservice.ExportExcelDrRefCalculation(excelData);
  }
  DrRefMonthlySummary(){
    this.DrRefMonthlyList = [];
    this.DoctorsPatientsReportFormSubmited = true;
    this.Spinner3 = true;
    const start = this.start_date
      ? this.DateService.dateConvert(new Date(this.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.end_date
      ? this.DateService.dateConvert(new Date(this.end_date))
      : this.DateService.dateConvert(new Date());
      let compnyDetails: any = [];
      this.selectedCostCenter.forEach((ele: any) => {
        compnyDetails.push({
          "Cost_Cen_ID": ele
        });
      });
    const tempobj = {
      Start_Date : start,
      End_Date : end,
      Cost_Cen_ID : this.Cost_Cen_ID ? this.Cost_Cen_ID : 0,
      Enq_Source_Sub_ID : this.Enq_Source_Sub_ID ? this.Enq_Source_Sub_ID : 0
    }
    
    const obj = {
      "SP_String": "sp_Doctor_Ref_report",
      "Report_Name_String": "Doctor_Ref_Monthly_Summary",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
       this.DrRefMonthlyList = data;
       this.ExportToExcel3();
       this.Spinner3 = false;
       }
       this.DoctorsPatientsReportFormSubmited = false;
       this.Spinner3 = false;
     })
  }
  ExportToExcel3() {
    const excelData =
    {
      TopHeader: "Doctore Reff Monthly Summary",
      frozenHeaderRow: 2,
      frozenHeader: true,
      sheetName: "Doctor Reff Monthly Summary",
      saveAsFile: `REPORT AS ON ${this.DateService.dateConvert(this.start_date)} To ${this.DateService.dateConvert(this.end_date)}`,
      data: this.DrRefMonthlyList

    }
    this.excelservice.ExportExcelDrRefMonthlySummary(excelData);
  }
  DrRefTimeBasedSummary(){
    this.DrRefTimeBasedList = [];
    this.DoctorsPatientsReportFormSubmited = true;
    this.Spinner4 = true;
    const start = this.start_date
      ? this.DateService.dateConvert(new Date(this.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.end_date
      ? this.DateService.dateConvert(new Date(this.end_date))
      : this.DateService.dateConvert(new Date());
      let compnyDetails: any = [];
      this.selectedCostCenter.forEach((ele: any) => {
        compnyDetails.push({
          "Cost_Cen_ID": ele
        });
      });
    const tempobj = {
      Start_Date : start,
      End_Date : end,
      Cost_Cen_ID : this.Cost_Cen_ID ? this.Cost_Cen_ID : 0,
      Enq_Source_Sub_ID : this.Enq_Source_Sub_ID ? this.Enq_Source_Sub_ID : 0
    }
    
    const obj = {
      "SP_String": "sp_Doctor_Ref_report",
      "Report_Name_String": "Doctor_Ref_TimeBased_Summary",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
       this.DrRefTimeBasedList = data;
       this.ExportToExcel4();
       this.Spinner4 = false;
       }
       this.DoctorsPatientsReportFormSubmited = false;
       this.Spinner4 = false;
     })
  }
  ExportToExcel4() {
    const excelData =
    {
      TopHeader: "Doctor Reff Time Based Summary",
      Header: ['Doctor', 'Cost Center Name', `${this.DateService.dateConvert(this.start_date)} Till ${this.DateService.dateConvert(this.end_date)}`],
      frozenHeaderRow: 2,
      frozenHeader: true,
      sheetName: "Doctor Reff Time Based Summary",
      data: this.DrRefTimeBasedList

    }
    this.excelservice.ExportExcelDrRefTimeBasedSummary(excelData);
  }

}
