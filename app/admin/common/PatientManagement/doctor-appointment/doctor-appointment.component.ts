import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-doctor-appointment',
  templateUrl: './doctor-appointment.component.html',
  styleUrls: ['./doctor-appointment.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DoctorAppointmentComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = "Create";
  Tabitems = {};
  TabView = "";
  showTabs = false;
  allDetalis = [];
  appo_Date: Date = new Date();
  ConsultancyName = undefined;
  ConsultancyList = [];
  backupAlldetalis = [];
  url = window["config"];
  SelectedcosCenter: any = undefined;
  cosCenterList = [];
  SelectedDistOrderBy1=[];
  ConsultancyFilter=[];
  ststusFilter=[];
  SelectedConsultancy=[];
  Selectedstatus=[];
  UserID:any='';
  CosCenID='';
  row:any=0;
  HomeVisit:boolean=false;

  constructor(    
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Audiologist Appointment",
      Link: " Patient Management -> Audiologist Appointment"
    });
    this.UserID= Number(this.$CompacctAPI.CompacctCookies.User_ID);
    this.GetConsultancy();
  }

  TabClick(e) {
  }

  GetConsultancy() {
    this.$http.get(this.url.apiGetConsultancyType).subscribe((data: any) => {
      this.ConsultancyList = data ? JSON.parse(data) : [];
      this.ConsultancyName = this.ConsultancyList[0].Consultancy_Type;
      if (this.ConsultancyName) {
        this.GetAllDetails();
      }
    })
  }

  GetAllDetails() {
    console.log("this.SelectedcosCenter", this.SelectedcosCenter);
    if (this.ConsultancyName) {
      const Temp = {
        Cons_Type: this.ConsultancyName,
        User_ID: this.UserID,
        Cost_Cen_ID: this.SelectedcosCenter ? this.SelectedcosCenter : 0,
        Appo_Dt: this.DateService.dateConvert(new Date(this.appo_Date))
      }
      console.log("TEMP",Temp);
      const obj = {
        "SP_String": "sp_DoctorsAppointmentNew",
        "Report_Name_String": "Get_Appointment_All",
        "Json_Param_String": JSON.stringify([Temp])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.allDetalis = data;
        this.backupAlldetalis = data;
        if (this.allDetalis.length) {
          this.GetDist3();
          this.ClickCheck();
        }
        console.log("allDetalis", this.allDetalis);
      })
    }
  }
 
  GetCentre() {
    this.cosCenterList= [];
    const tempobj = {
      Cons_Type: this.ConsultancyName,
      User_ID: this.UserID
    }
    const obj = {
      "SP_String": "sp_DoctorsAppointmentNew",
      "Report_Name_String": "Get_Cost_Center",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Cost_Cen_Name,
          element['value'] = element.Cost_Cen_ID
        });
        this.cosCenterList= data;
        console.log("Get Center",this.cosCenterList);

      }
    });
    this.GetAllDetails();
  }



  ClickCheck(){
    console.log('check box value',this.HomeVisit);
    this.allDetalis=[];
    // }
    if(this.HomeVisit===true){
    const FilterbackupAlldetalis = this.backupAlldetalis.filter((el:any)=> el.Home_Visit ==  this.HomeVisit)
    console.log("FilterbackupAlldetalis=>>>>",FilterbackupAlldetalis);
    this.allDetalis=FilterbackupAlldetalis;
    console.log("backupAlldetalis=>>>>",this.backupAlldetalis);
      
    }
    else{
      this.allDetalis=this.backupAlldetalis;

    }
  }


  filterStatus() {
    console.log("SelectedcosCenter", this.Selectedstatus);
    let DOrderBy = [];
    if (this.Selectedstatus.length) {
      DOrderBy = this.Selectedstatus;
    }
    this.allDetalis = [];
    if (this.Selectedstatus.length) {
      let LeadArr = this.backupAlldetalis.filter(function (e) {
        return (DOrderBy.length ? DOrderBy.includes(e['Status']) : true)
      });
      this.allDetalis = LeadArr.length ? LeadArr : [];
      console.log("if GetAllDataList", this.allDetalis)
    } else {
      this.allDetalis = this.backupAlldetalis;
      console.log("else GetAllDataList", this.allDetalis)
    }
  }

    
  
    GetDist3() {
      let DOrderBy = [];
      this.ststusFilter = [];
      this.SelectedDistOrderBy1 = [];
      this.backupAlldetalis.forEach((item) => {
        if (DOrderBy.indexOf(item.Status) === -1) {
          DOrderBy.push(item.Status);
          this.ststusFilter.push({ label: item.Status, value: item.Status });
          console.log("this.ststusFilter", this.ststusFilter);
        }
      });
    }
    GetChargeable() {
      this.allDetalis.forEach(el => {
        return el.Chargeable ? "Yes" : "No"
      })
    }      
    GetHomeVisit() {
      this.allDetalis.forEach(el => {
        return el.Home_Visit ? "Yes" : "No"
      })
    } 
  onConfirm() { }
  onReject() { }
  

}
