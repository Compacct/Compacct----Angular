import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { iif } from 'rxjs';
import { UpdateConsultancyComponent } from '../../../shared/compacct.components/compacct.forms/update-consultancy/update-consultancy.component';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
@Component({
  selector: 'app-doctor-schedul',
  templateUrl: './doctor-schedul.component.html',
  styleUrls: ['./doctor-schedul.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DoctorSchedulComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Create";
  Spinner = false;
  items:any = [];
  objDoctorSchedul:doctorSchedul = new doctorSchedul()
  ObjBrowse : Browse = new Browse();
  SearchFormSubmit:boolean = false
  doctorSchedulFormSubmit:any = false
  CentreList:any[] = []
  doctorList:any[] = []
  SelectedAvailableDays:any = []
  AvailableDaysList:any[] = []
  yearList:any = []
  FromTime:Date = new Date()
  ToTime = new Date()
  seachSpinner:boolean = false
  searchDataList:any = []
  constructor( private http: HttpClient,
               private commonApi: CompacctCommonApi,
               private Header: CompacctHeader,
               private DateTimeConvert : DateTimeConvertService,
               private compacctToast: MessageService,
               private GlobalAPI:CompacctGlobalApiService,) { }

  ngOnInit() {
    const daysList = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    daysList.forEach((data:any)=>{
      this.AvailableDaysList.push({
       'label' : data,
       'value' : data
      })
      
    })
    this.items = ["BROWSE", "CREATE"];
  
    this.Header.pushHeader({
      Header: "Doctor Schedule Entry",
      Link: " CRM -> Clinic -> Doctor Schedule Entry"
    });
    this.getCenterList()
    this.getDoctorList()
    this.getYear()
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){
    this.objDoctorSchedul = new doctorSchedul()
    this.doctorSchedulFormSubmit = false
    this.FromTime = new Date()
    this.ToTime = new Date()
    this.SelectedAvailableDays = []
    this.Spinner = false
    this.getYear()
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){}
  getCenterList(){
    this.CentreList = []
    this.http.get('/Common/Get_Cost_Center').subscribe((data:any)=>{
      this.CentreList = data ? JSON.parse(data) : [];
    })
  }
  getDoctorList(){
    this.doctorList = []
    this.http.get(`BL_CRM_Master_Doctor/Get_All_Data`).subscribe((data:any)=>{
      this.doctorList = data ? JSON.parse(data) : [];
        this.doctorList.forEach(el => {
          el.label= el.Name,
          el.value= el.Doctor_ID
        });
     })
  }
  getYear(){
    const obj = {
      "SP_String": "SP_Doctor_Schedule_V2",
      "Report_Name_String": "get_year" 
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("yearList",data);
    this.yearList = data
     this.objDoctorSchedul.year = this.yearList.find((el:any)=> el.selected == 1 ).year
    });
  }
  saveDoctorSchedule(valid:any){
    this.doctorSchedulFormSubmit = true
    console.log("objDoctorSchedul",this.objDoctorSchedul)
    console.log("valid",valid)
    if(valid){
      this.Spinner = true;
      this.objDoctorSchedul.AvlDay = this.SelectedAvailableDays.toString()
      this.objDoctorSchedul.From_Time = this.DateTimeConvert.getTime(this.FromTime) 
      this.objDoctorSchedul.To_Time = this.DateTimeConvert.getTime(this.ToTime)
      const obj = {
        "SP_String": "SP_Doctor_Schedule_V2",
        "Report_Name_String": "create_schedule",
        "Json_Param_String": JSON.stringify([this.objDoctorSchedul])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log(data)
        if(data[0].Message == 'Success'){
          this.clearData()
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Doctor Schedule",
            detail: data[0].Text
          });
        }
        else {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail:data[0].Text
          });
        }
      })
    }
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.From_Date = dateRangeObj[0];
      this.ObjBrowse.To_Date = dateRangeObj[1];
    }
    }
  getSearchDataList(valid){
    this.SearchFormSubmit = true
    this.searchDataList = []
    if(valid){

    }
  }
}

class doctorSchedul{
    year:any              				   
    month :any  = 0            
    AvlDay :any     
    Cost_Cen_ID	:any
    Doctor_ID:any
    From_Time	:any 
    To_Time:any 
    No_Of_Patient:any
}
class Browse {
  Cost_Cen_ID:any = 0;
  From_Date : any ;
  To_Date : any;
  Doctor_ID:any
}