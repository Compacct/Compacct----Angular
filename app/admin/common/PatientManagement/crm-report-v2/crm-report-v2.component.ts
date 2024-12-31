import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ExportExcelService } from '../../../shared/compacct.services/export-excel.service';

@Component({
  selector: 'app-crm-report-v2',
  templateUrl: './crm-report-v2.component.html',
  styleUrls: ['./crm-report-v2.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class CrmReportV2Component implements OnInit {
  tabIndexToView: number= 0;
  items: any= [];

  ObjAudiologistTrial : AudiologistTrial = new AudiologistTrial();
  seachSpinner: boolean = false;
  CostCenterList:any = [];
  EnqSourceList:any = [];
  AudiologistTrialList: any= [];
  BackupAudiologistTrialList:any = [];
  AudiologistTrialListHeader: any= [];
  PatDetailsPopup:boolean = false;
  PatientDetailsList:any = [];
  PatientDetailsListHeader:any = [];
  TrialCount : any;
  FittingCount : any;
  AudiologistRow : any;

  ObjPatientRegistration : PatientRegistration = new PatientRegistration();
  tab2seachSpinner:boolean = false;
  PatientRegistrationList: any= [];
  BackupPatientRegistrationList:any = [];
  PatientRegistrationListHeader: any= [];

  ObjAudiologistIncentive : AudiologistIncentive = new AudiologistIncentive();
  tab3seachSpinner:boolean = false;
  AudiologistIncentiveList:any=[];
  BackupAudiologistIncentiveList:any=[];
  AudiologistIncentiveListHeader:any=[];

  ObjDoctorsIncentive : DoctorsIncentive = new DoctorsIncentive();
  tab4seachSpinner:boolean = false;
  DoctorsIncentiveList: any= [];
  BackupDoctorsIncentiveList:any = [];
  DoctorsIncentiveListHeader: any= [];

  constructor(
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private $http: HttpClient,
    private excelservice: ExportExcelService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Report",
      Link: "Report"
    });
    this.items = ["AUDIOLOGIST TRIAL", "PATIENT REGISTRATION", "AUDIOLOGIST INCENTIVE", "DOCTORS INCENTIVE"];
  }
  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["AUDIOLOGIST TRIAL", "PATIENT REGISTRATION", "AUDIOLOGIST INCENTIVE", "DOCTORS INCENTIVE"];
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjAudiologistTrial.From_Date = dateRangeObj[0];
      this.ObjAudiologistTrial.To_Date = dateRangeObj[1];
    }
  }
  GetAudiologistTrial() {
    this.AudiologistTrialList = [];
    this.BackupAudiologistTrialList = [];
    this.AudiologistTrialListHeader = [];
    const start = this.ObjAudiologistTrial.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjAudiologistTrial.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjAudiologistTrial.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjAudiologistTrial.To_Date))
      : this.DateService.dateConvert(new Date());
      this.seachSpinner = true;
  if (start && end) {
    const tempobj = {
      Start_Date : start,
      End_Date : end
    }
    const obj = {
      "SP_String": "SP_CRM_Report",
      "Report_Name_String": "Audiologist_Trial_count ",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('data daata',data);
      if(data.length){
      this.AudiologistTrialList = data;
      this.BackupAudiologistTrialList = data;
      this.AudiologistTrialListHeader = Object.keys(data[0]);
      this.seachSpinner = false;
    }
    else {
      this.seachSpinner = false;
    }
    });
  }
  }
  onclick(col,row){
    this.TrialCount = undefined
    this.FittingCount = undefined;
    this.AudiologistRow = undefined
    // console.log("col",col)
    // console.log("Row",row.Doctor_Name)
    console.log("Row",row.Fitting_Count)
    if(col === "Trial_Count"){
      this.TrialCount = row.Trial_Count
      this.FittingCount = ''
    }
    else if(col === "Fitting_Count"){
      this.TrialCount = ''
      this.FittingCount = row.Fitting_Count
    }
    this.AudiologistRow = row.Doctor_Name
    this.GetPatientDetails();
  }
  GetPatientDetails(){
    this.PatientDetailsList = [];
    this.PatientDetailsListHeader = [];
      const start = this.ObjAudiologistTrial.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjAudiologistTrial.From_Date))
      : this.DateService.dateConvert(new Date());
      const end = this.ObjAudiologistTrial.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjAudiologistTrial.To_Date))
      : this.DateService.dateConvert(new Date());
      const sendobj = {
        Start_Date : start,             
			  End_Date : end,        
			  Doctor_Name : this.AudiologistRow,          
			  Trial_Count : this.TrialCount,
        Fitting_Count : this.FittingCount
      }
    const obj = {
      "SP_String": "SP_CRM_Report",
      "Report_Name_String": "Audiologist_Trial_count_details",
      "Json_Param_String": JSON.stringify(sendobj)
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        this.PatientDetailsList = data;
        this.PatientDetailsListHeader = Object.keys(data[0]);
        // console.log("PatientDetailsList", this.PatientDetailsList);
        this.PatDetailsPopup = true;
      } else {
        this.PatientDetailsList = [];
        this.PatientDetailsListHeader = [];
      }
    });
    
  }
  ExportToExcelWeekFootFall(){
    const start = this.ObjAudiologistTrial.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjAudiologistTrial.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjAudiologistTrial.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjAudiologistTrial.To_Date))
      : this.DateService.dateConvert(new Date());
     let tempobj = {}
  if (start && end) {
   tempobj = {
    From_Date: start,
    To_Date: end,
  }
  }
    this.excelservice.exporttoExcelWeeklyFootfallDetails(this.BackupAudiologistTrialList,tempobj);
  }

  getDateRangePatReg(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjPatientRegistration.From_Date = dateRangeObj[0];
      this.ObjPatientRegistration.To_Date = dateRangeObj[1];
    }
  }
  GetPatientRegistration() {
    this.PatientRegistrationList = [];
    this.BackupPatientRegistrationList = [];
    this.PatientRegistrationListHeader = [];
    const start = this.ObjPatientRegistration.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjPatientRegistration.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjPatientRegistration.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjPatientRegistration.To_Date))
      : this.DateService.dateConvert(new Date());
      this.tab2seachSpinner = true;
  if (start && end) {
    const tempobj = {
      Start_Date : start,
      End_Date : end
    }
    const obj = {
      "SP_String": "SP_CRM_Report",
      "Report_Name_String": "Patient_Registration",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('data daata',data);
      if(data.length){
      this.PatientRegistrationList = data;
      this.BackupPatientRegistrationList = data;
      this.PatientRegistrationListHeader = Object.keys(data[0]);
      this.tab2seachSpinner = false;
    }
    else {
      this.tab2seachSpinner = false;
    }
    });
  }
  }
  GetPatientDetailstab2(col,row){
    // console.log("col",col)
    // console.log("Row",row.Doctor_Name)
    if(col === "Bill_no"){
    this.PrintBill(row.Bill_no);
    }
  }
  PrintBill(billno){
    if (billno) {
      const objtemp = {
        "SP_String": "SP_CRM_Report",
        "Report_Name_String": "sale_bill_print"
      }
      this.GlobalAPI.getData(objtemp).subscribe((data: any) => {
        var printlink = data[0].Column1;
        window.open(printlink + billno, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      })
    }
  }

  getDateRangeAudioIncen(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjAudiologistIncentive.From_Date = dateRangeObj[0];
      this.ObjAudiologistIncentive.To_Date = dateRangeObj[1];
    }
  }
  GetAudiologistIncentive() {
    this.AudiologistIncentiveList = [];
    this.BackupAudiologistIncentiveList = [];
    this.AudiologistIncentiveListHeader = [];
    const start = this.ObjAudiologistIncentive.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjAudiologistIncentive.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjAudiologistIncentive.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjAudiologistIncentive.To_Date))
      : this.DateService.dateConvert(new Date());
      this.tab3seachSpinner = true;
  if (start && end) {
    const tempobj = {
      Start_Date : start,
      End_Date : end
    }
    const obj = {
      "SP_String": "SP_CRM_Report",
      "Report_Name_String": "Audiologist_Incentive ",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('data daata',data);
      if(data.length){
        this.CalculateTotal(data);
        // this.AudiologistIncentiveList = data;
        this.BackupAudiologistIncentiveList = data;
        this.AudiologistIncentiveListHeader = Object.keys(data[0]);
        this.tab3seachSpinner = false;
    }
    else {
      this.tab3seachSpinner = false;
    }
    });
  }
  }
  shouldDisplay(rowIndex: number, field: string): boolean {
    if (rowIndex === 0) {
        return true;
    }
    return this.AudiologistIncentiveList[rowIndex][field] !== this.AudiologistIncentiveList[rowIndex - 1][field];
  }
  calculateRowSpan(rowIndex: number, field: string): number {
    let currentValue = this.AudiologistIncentiveList[rowIndex][field];
    let rowSpan = 1;

    for (let i = rowIndex + 1; i < this.AudiologistIncentiveList.length; i++) {
        if (this.AudiologistIncentiveList[i][field] === currentValue) {
            rowSpan++;
        } else {
            break;
        }
    }
    return rowSpan;
  }
  CalculateTotal(data: { Doctor_ID: number; Doctor_Name: string; Calc_Amount_L_40_value: number; Calc_Amount_G_40_value: number }[]) {
    // Step 1: Group data by Doctor_ID
    const groupedData = data.reduce((acc, item) => {
      const { Doctor_ID, Doctor_Name, Calc_Amount_L_40_value, Calc_Amount_G_40_value } = item;
  
      // Check if the Doctor_ID already exists in the accumulator
      if (!acc[Doctor_ID]) {
        acc[Doctor_ID] = { totalCalc_Amount_L_40_value: 0, totalCalc_Amount_G_40_value: 0, entries: [] };
      }
  
      // Sum the Calc_Amount_L_40 for each doctor and store the entry
      acc[Doctor_ID].totalCalc_Amount_L_40_value += Calc_Amount_L_40_value;
      acc[Doctor_ID].totalCalc_Amount_G_40_value = Calc_Amount_G_40_value;
      acc[Doctor_ID].entries.push(item);
  
      return acc;
    }, {} as Record<string, any>);
  
    // Step 2: Flatten the grouped data and insert totals
    const result: { Doctor_ID: number; Doctor_Name: string; Calc_Amount_L_40_value: number; Calc_Amount_G_40_value: number }[] = [];
  
    // Iterate through the grouped data and format the result
    for (const [doctorID, { totalCalc_Amount_L_40_value, totalCalc_Amount_G_40_value, entries }] of Object.entries(groupedData)) {
      const doctorData = entries[0]; // Get the first entry to extract the Doctor_Name
      result.push(...entries);  // Add all entries for the doctor
      result.push({
        Doctor_ID: parseInt(doctorID),  // Ensure the Doctor_ID is an integer
        Doctor_Name: doctorData.Doctor_Name, // Use the Doctor_Name from the first entry
        Calc_Amount_L_40_value: totalCalc_Amount_L_40_value, // Add the total amount for the doctor
        Calc_Amount_G_40_value: totalCalc_Amount_L_40_value + totalCalc_Amount_G_40_value  // Add the total amount for the doctor
      });
    }
  
    console.log(result);  // Log the result
    this.AudiologistIncentiveList = result;
  }
  getTotalValue(key){
    let Amtval = 0;
    this.AudiologistIncentiveList.forEach((item)=>{
      Amtval += Number(item[key]);
    });

    return Amtval ? Amtval.toFixed(2) : '-';
  }
  getToFixed(value){
    return value ? Number(Number(value).toFixed(2)) : '';
  }

  getDateRangeDoctor(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjDoctorsIncentive.From_Date = dateRangeObj[0];
      this.ObjDoctorsIncentive.To_Date = dateRangeObj[1];
    }
  }
  GetDoctorsIncentive() {
    this.DoctorsIncentiveList = [];
    this.BackupDoctorsIncentiveList = [];
    this.DoctorsIncentiveListHeader = [];
    const start = this.ObjDoctorsIncentive.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjDoctorsIncentive.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjDoctorsIncentive.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjDoctorsIncentive.To_Date))
      : this.DateService.dateConvert(new Date());
      this.tab4seachSpinner = true;
  if (start && end) {
    const tempobj = {
      Start_Date : start,
      End_Date : end
    }
    const obj = {
      "SP_String": "SP_CRM_Report",
      "Report_Name_String": "Doctor_Incentive",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('data daata',data);
      if(data.length){
      this.DoctorsIncentiveList = data;
      this.BackupDoctorsIncentiveList = data;
      this.DoctorsIncentiveListHeader = Object.keys(data[0]);
      this.tab4seachSpinner = false;
    }
    else {
      this.tab4seachSpinner = false;
    }
    });
  }
  }


  onReject(){}
  onConfirm(){}

}

class AudiologistTrial {
  From_Date: any;
  To_Date: any;
}
class PatientRegistration {
  From_Date: any;
  To_Date: any;
}
class DoctorsIncentive {
  From_Date: any;
  To_Date: any;
}
class AudiologistIncentive {
  From_Date: any;
  To_Date: any;
}