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
  allDetalis:any = [];
  allDetalisHeader:any = []
  appo_Date: Date = new Date();
  ConsultancyName = undefined;
  ConsultancyList:any = [];
  backupAlldetalis = [];
  url = window["config"];
  SelectedcosCenter: any = undefined;
  cosCenterList:any = [];
  SelectedDistOrderBy1:any=[];
  ConsultancyFilter:any=[];
  ststusFilter:any=[];
  SelectedConsultancy:any=[];
  Selectedstatus:any=[];
  UserID:any='';
  CosCenID='';
  row:any=0;
  HomeVisit:boolean=false;
  ActionList:any = []
  UpdateAppointmentModel:boolean = false
  updateConsultancyInputObj:any = {}
  ObjupdateConsultancy:any = {}
  Spinner:boolean = false
  @ViewChild("consultancy", { static: false })
  UpdateConsultancy: UpdateConsultancyComponent;
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
      this.allDetalisHeader = []
      this.ActionList = []
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
          this.allDetalisHeader = Object.keys(data[0])
          this.GetDist3();
          this.ClickCheck();
        }
        console.log("allDetalis", this.allDetalis);
      })
    }
  }
  getAction(col:any){
    let returnArr:any = []
   if(col.Consultancy_Done == 'N' && col.Controller_Name == 'NA'){
    returnArr.push({
      Name: 'Update Appointment',
      Icon: 'fa fa-repeat',
      FuctionName: 'UpdateAppo'
    })
   }
   return returnArr
  }
  dateCheck(col:any){
  return this.DateService.dateConvert(col.Appo_Dt) == this.DateService.dateConvert(new Date()) ? true : false
  }
  actionClick(col:any,actype){
    this.updateConsultancyInputObj = {
      Appo_ID : 0,
      required : true
    }
   switch (actype) {
    case 'UpdateAppointment':
        this.UpdateAppointmentModel = true
        this.updateConsultancyInputObj = {
          Appo_ID : col.Appo_ID,
          required : true
        }

      break;
    case 'CreateReport':
      window.open(col.Controller_Name + col.Appo_ID, '_blank');
    break;
    case'EditReport':
      window.open(col.Controller_Name + col.Appo_ID, '_blank');
    break;
    case 'PrintReport' :
      window.open(col.Print_Aspx+ col.Appo_ID, 'Print Appointment', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    default:
      break;
   }
  }
  getStatusWiseColor(obj:any) {
    var currentDate = Date.parse(this.DateService.dateConvert(new Date()) + ' ' + this.DateService.getTime24Hours(new Date()) + ':00');
    var appoDate = Date.parse(this.DateService.dateConvert(new Date(obj.Appo_Dt)) + ' ' + this.DateService.getTime24Hours(new Date(obj.Appo_Dt)) + ':00');
    if (obj.Status == "Appointment" && currentDate > appoDate) {
        return 'red'
    }
    else {
        switch (obj.Status) {
            case 'Cancel':
                return 'red';
                break;
            case 'Reschedule':
                return 'purple';
                break;
            case 'Consultancy Done':
                return 'blue';
                break;
            case 'Consultancy Bill Done':
                return 'orange';
                break;
            case 'Package Booked':
                return 'orange';
                break;
            case 'Payment Done':
                return 'green';
                break;
            case 'Therapy Done':
                return 'green';
                break;
            case 'Billed':
                return 'orange';
                break;
            default:
        }
    }
    return
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
      let DOrderBy:any = [];
      this.ststusFilter = [];
      this.SelectedDistOrderBy1 = [];
      this.backupAlldetalis.forEach((item:any) => {
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
  updateConsultancysave(e:any){
    console.log("e",e)
    this.ObjupdateConsultancy = e
  
  }
  onConfirm() { }
  onReject() { }
  SaveUpdateConsultancy(valid:any){
    console.log("valid",valid)
    this.Spinner = true
    const tempObj = {
      Appo_ID  : this.updateConsultancyInputObj.Appo_ID , 
			Level_1_Status : this.ObjupdateConsultancy.Level_1_Status,
			Level_2_Status :this.ObjupdateConsultancy.Level_2_Status,
			Level_3_Status :this.ObjupdateConsultancy.Level_3_Status
    }
     const obj = {
       "SP_String": "sp_DoctorsAppointmentNew",
       "Report_Name_String": "Update_Consultancy_Done",
       "Json_Param_String": JSON.stringify(tempObj)
      }
     this.GlobalAPI.postData(obj).subscribe((data:any)=>{
       console.log(" Update Data ",data)
       if(data[0].Column1 == "Done"){
        this.UpdateAppointmentModel = false
        this.GetAllDetails()
        this.Spinner = false
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Consultancy",
          detail: "Succesfully Update"
    });
      
        
       }
     })
    }
   }


