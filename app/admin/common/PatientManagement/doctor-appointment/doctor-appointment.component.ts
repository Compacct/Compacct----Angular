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
  GetAppoID:any;
  TherapySpinner:boolean = false;
  therapyAttendance:boolean=false;
  therapyFormSubmit:boolean = false;
  objTherapAttendance = new TherapAttendance();
  ActionList:any = []
  UpdateAppointmentModel:boolean = false
  updateConsultancyInputObj:any = {}
  ObjupdateConsultancy:any = {}
  Spinner: boolean = false
  
  PTAmodal: boolean = false;
  testType: any = undefined;
  DegreeLossLeft: any = [];
  DegreeLossRight: any = [];
  ConfigLossLeft:any =[];
  ConfigLossRight: any = [];
  TypeLossLeft:any =[];
  TypeLossRight:any =[];
  ObjPta: Pta = new Pta();
  TinnitusList: any = [];
  SubTypList: any = [];
  ObjectionList: any = [];
  FinalStatusList: any = [];
  DisableTypL: boolean = false;
  DisableTypR: boolean = false;
  Disable: boolean = false;
  DisableL: boolean = false;
  SupportShow: boolean = false;
  SupportShow2nd: boolean = false;
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
        this.GetCentre();
        this.GetAllDetails();
      }
    })
  }

  GetAllDetails() {
    // console.log("this.SelectedcosCenter", this.SelectedcosCenter);
    if (this.ConsultancyName) {
      this.allDetalisHeader = []
      this.ActionList = []
      const Temp = {
        Cons_Type: this.ConsultancyName,
        User_ID: this.UserID,
        Cost_Cen_ID: this.SelectedcosCenter ? this.SelectedcosCenter : 0,
        Appo_Dt: this.DateService.dateConvert(new Date(this.appo_Date))
      }
      // console.log("TEMP",Temp);
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
        // console.log("allDetalis", this.allDetalis);
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
    case 'PTA':
       this.PTAmodal = true;
       this.testType = col.Consultancy_Descr;
       this.ObjPta.Appo_ID = col.Appo_ID;
       this.SupportShow = true;
       this.SupportShow2nd = true;
       this.getDegreeloss(this.testType);
       this.getConfiloss();
       this.getTypeloss();
    break;
    case 'CreateReport':
      window.open(col.Controller_Name + col.Appo_ID, '_blank');
    break;
    case'EditReport':
      window.open(col.Controller_Name + col.Appo_ID+'&ed=y', '_blank');
    break;
    case 'PrintReport' :
      window.open(col.Print_Aspx+ col.Appo_ID, 'Print Appointment', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      break;
      case 'DisplayModel':
        this.therapyAttendance = true;
        this.GetAppoID = col.Appo_ID;
        this.getTherpyAttendance();
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
        // console.log("Get Center",this.cosCenterList);

      }
    });
    this.GetAllDetails();
  }

  ClickCheck(){
    // console.log('check box value',this.HomeVisit);
    this.allDetalis=[];
    // }
    if(this.HomeVisit===true){
    const FilterbackupAlldetalis = this.backupAlldetalis.filter((el:any)=> el.Home_Visit ==  this.HomeVisit)
    // console.log("FilterbackupAlldetalis=>>>>",FilterbackupAlldetalis);
    this.allDetalis=FilterbackupAlldetalis;
    // console.log("backupAlldetalis=>>>>",this.backupAlldetalis);
      
    }
    else{
      this.allDetalis=this.backupAlldetalis;

    }
  }

  filterStatus() {
    // console.log("SelectedcosCenter", this.Selectedstatus);
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
      // console.log("if GetAllDataList", this.allDetalis)
    } else {
      this.allDetalis = this.backupAlldetalis;
      // console.log("else GetAllDataList", this.allDetalis)
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
          // console.log("this.ststusFilter", this.ststusFilter);
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
    // console.log("e",e)
    this.ObjupdateConsultancy = e
  
  }
  SaveTherapyAttendance(valid){
    // console.log('save works');
    this.therapyFormSubmit = true;
    if(valid){
      this.TherapySpinner = true;
      this.objTherapAttendance.Appo_ID = this.GetAppoID;
      this.objTherapAttendance.SLP = this.commonApi.CompacctCookies.User_Name;
      this.therapyFormSubmit = false;
      // console.log(this.objTherapAttendance);

      const obj = {
        "SP_String": "SP_BL_Txn_ATTENDANCE_CARD",
        "Report_Name_String": "Update_Data_for_Attendance_card",
        "Json_Param_String": JSON.stringify(this.objTherapAttendance)
       }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        // console.log(" save Data ",data)
        if(data[0].Column1 == "Done"){
          this.TherapySpinner = false;
         this.compacctToast.clear();
         this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Therapy Attendance",
           detail: "Succesfully Save"
     });
       this.objTherapAttendance = new TherapAttendance();
       this.therapyAttendance = false;
         
        }
       else{
        this.TherapySpinner = false;
        this.compacctToast.clear();
         this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message ",
          detail:"Error occured "
     });
        
       }

      });
     }

    

  }

  getTherpyAttendance(){
    // console.log('edit works', this.objTherapAttendance);
    const tempobj = {
      Appo_ID : this.GetAppoID
    }
    const obj = {
      "SP_String": "SP_BL_Txn_ATTENDANCE_CARD",
      "Report_Name_String": "Retrieve_Data_for_Attendance_card",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      // console.log('edit data',data);
      this.objTherapAttendance.Activities = data[0].Activities;
      this.objTherapAttendance.Clinical_Observation = data[0].Clinical_Observation;
      this.objTherapAttendance.Provisional_Diagnosis = data[0].Provisional_Diagnosis;
      this.objTherapAttendance.Therapy_Goal = data[0].Therapy_Goal;
      // console.log('object',this.objTherapAttendance);
    });
    
  }

  closeTherapyAttendance(){
    this.therapyAttendance = false
    this.therapyFormSubmit = false;
    this.objTherapAttendance = new TherapAttendance();
  }

  

  onConfirm() { }
  onReject() { }
  SaveUpdateConsultancy(valid:any){
    // console.log("valid",valid)
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
      //  console.log(" Update Data ",data)
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
  

  // PtA Pop  all function 
  TotalPta() {
    if (this.ObjPta.PTA_Right_500 && this.ObjPta.PTA_Right_1000 && this.ObjPta.PTA_Right_2000) {
      let totalR =0
      totalR = Number(this.ObjPta.PTA_Right_500) + Number(this.ObjPta.PTA_Right_1000) + Number(this.ObjPta.PTA_Right_2000)
      this.ObjPta.PTA_Right = (totalR / 3).toFixed(2);
    }
    else {
      this.ObjPta.PTA_Right = '';
    }
    if (this.ObjPta.PTA_Left_500 && this.ObjPta.PTA_Left_1000 && this.ObjPta.PTA_Left_2000) {
      let totalL =0
      totalL = Number(this.ObjPta.PTA_Left_500) + Number(this.ObjPta.PTA_Left_1000) + Number(this.ObjPta.PTA_Left_2000)
      this.ObjPta.PTA_Left = (totalL /3).toFixed(2)
    }
    else {
      this.ObjPta.PTA_Left = '';
    }
  }
  getDegreeloss(type:any){
  this.DegreeLossLeft = [];
  this.DegreeLossRight = [];
    const tempobj = {
     Test_Type: type
    }
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Degree_Of_Loss_Dropdown",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Degree_Of_Loss_Name,
          element['value'] = element.Degree_Of_Loss_ID
        });
       this.DegreeLossLeft = data;
       this.DegreeLossRight = data;
         //console.log("degri",data);
      }
    }); 
  }
  getConfiloss(){
  this.ConfigLossLeft = [];
  this.ConfigLossRight = [];
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Hearing_Loss_dropdown",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Hearing_Loss,
          element['value'] = element.Hearing_Loss_ID
        });
      this.ConfigLossLeft = data;
      this.ConfigLossRight = data;
         //console.log("config",data);
      }
    }); 
  }
  getTypeloss(){
  this.TypeLossLeft = [];
  this.TypeLossRight = [];
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Type_Of_Loss_dropdown",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Type_Of_Loss,
          element['value'] = element.Type_Of_Loss_ID
        });
      this.TypeLossLeft = data;
      this.TypeLossRight = data;
        //console.log("type", data);
      }
    });  
  }
  getTinnitus(Deg_los_id: any) {
  this.ObjPta.Tinnitus_Status_ID = undefined;
  this.ObjPta.Sub_Status_ID = undefined;
  this.ObjPta.Final_Status_ID = undefined;
  this.ObjPta.Objection_ID = undefined;
  this.TinnitusList = [];
    const tempobj = {
     Degree_Of_Loss_ID: Deg_los_id
    }
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Tinnitus_Status_dropdown",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Tinnitus_Status,
          element['value'] = element.Tinnitus_Status_ID
        });
       this.TinnitusList = data;
         //console.log("Tinnitus",data);
      }
    });  
    this.getChangeType();
    this.SupportCheck();
  }
  getSubType() {
    this.ObjPta.Sub_Status_ID = undefined;
    this.ObjPta.Final_Status_ID = undefined;
    this.ObjPta.Objection_ID = undefined;
  this.SubTypList = [];
    const tempobj = {
     Tinnitus_Status_ID: this.ObjPta.Tinnitus_Status_ID
    }
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Sub_Status_dropdown",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Sub_Status,
          element['value'] = element.Sub_Status_ID
        });
       this.SubTypList = data;
         //console.log("Tinnitus",data);
      }
    });    
  }
  getFinalStatus() {
  this.ObjPta.Final_Status_ID = undefined;
  this.ObjPta.Objection_ID = undefined;
  this.FinalStatusList = [];
    const tempobj = {
     Sub_Status_ID: this.ObjPta.Sub_Status_ID
    }
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Final_Status_dropdown",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Final_Status,
          element['value'] = element.Final_Status_ID
        });
       this.FinalStatusList = data;
         //console.log("FinalStatus",data);
      }
    });    
  }
  ObjectionType() {
 this.ObjPta.Objection_ID = undefined;
  this.ObjectionList = [];
    const tempobj = {
     Final_Status_ID: this.ObjPta.Final_Status_ID
    }
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Objection_dropdown",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Objection,
          element['value'] = element.Objection_ID
        });
       this.ObjectionList = data;
         //console.log("Objection",data);
      }
    });    
  }
  getChangeType() {
    this.DisableTypL = false;
    this.DisableTypR = false;
    const leftType = this.TypeLossLeft.filter((el: any) => el.Type_Of_Loss_ID === 1);
    const leftTypeTwo = this.TypeLossLeft.filter((el: any) => el.Type_Of_Loss_ID === 2);
    const leftTypeThree = this.TypeLossLeft.filter((el: any) => el.Type_Of_Loss_ID === 6);
    const RigtType = this.TypeLossRight.filter((el: any) => el.Type_Of_Loss_ID === 1);
    const RightTypeTwo = this.TypeLossRight.filter((el: any) => el.Type_Of_Loss_ID === 2);
    const RightTypeThree = this.TypeLossRight.filter((el: any) => el.Type_Of_Loss_ID === 6);
    if (this.ObjPta.Degree_Of_Loss_ID === 1) {
      this.ObjPta.Type_Of_Loss_ID = leftType[0].Type_Of_Loss_ID;
      this.DisableTypL = true;
       this.DisableL = true;
    }
    else if (this.ObjPta.Degree_Of_Loss_ID === 3) {
      this.ObjPta.Type_Of_Loss_ID = leftTypeTwo[0].Type_Of_Loss_ID;
      this.DisableTypL = true;
       this.DisableL = true;
    }
    else if (this.ObjPta.Degree_Of_Loss_ID === 10) {
      this.ObjPta.Type_Of_Loss_ID = leftTypeThree[0].Type_Of_Loss_ID;
      this.DisableTypL = true;
      this.DisableL = false;
    }
    else {
      this.ObjPta.Type_Of_Loss_ID = '';
      this.DisableTypL = false;
      this.DisableL = false;
    }
     if (this.ObjPta.Degree_Of_Loss_Right_ID === 1) {
       this.ObjPta.Type_Of_Loss_Right_ID = RigtType[0].Type_Of_Loss_ID;
       this.DisableTypR = true;
       this.Disable = true;
    }
    else if (this.ObjPta.Degree_Of_Loss_Right_ID === 3) {
       this.ObjPta.Type_Of_Loss_Right_ID = RightTypeTwo[0].Type_Of_Loss_ID;
       this.DisableTypR = true;
       this.Disable = true;
     }
    else if (this.ObjPta.Degree_Of_Loss_Right_ID === 10) {
       this.ObjPta.Type_Of_Loss_Right_ID = RightTypeThree[0].Type_Of_Loss_ID;
       this.DisableTypR = true;
       this.Disable = false;
    }
    else {
       this.ObjPta.Type_Of_Loss_Right_ID = '';
       this.DisableTypR = false;
       this.Disable = false;
    }
  }
  SupportCheck() {
    if (this.ObjPta.Degree_Of_Loss_ID === 1 || this.ObjPta.Degree_Of_Loss_ID === 3 ||this.ObjPta.Degree_Of_Loss_ID === null ) {
      this.SupportShow = true;
    }
    else {
    this.SupportShow = false;  
    }
    if (this.ObjPta.Degree_Of_Loss_Right_ID === 1 || this.ObjPta.Degree_Of_Loss_Right_ID === 3 || this.ObjPta.Degree_Of_Loss_Right_ID === null) {
      this.SupportShow2nd = true;
    }
    else {
     this.SupportShow2nd = false; 
    }
  }
  SavePtaPop() {
    if (this.ObjPta.Appo_ID) {
      const obj = {
        "SP_String": "sp_Hearing_Test",
        "Report_Name_String": 'Update_PTA_Deatils',
        "Json_Param_String": JSON.stringify([this.ObjPta]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if (data[0].Column1){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: this.ObjPta.Appo_ID,
            detail: "Succesfully Update "
          });
          this.ObjPta = new Pta();
          this.PTAmodal = false;
          }
        });
   } 
  }
}
class TherapAttendance {
  Therapy_Goal:any;
  Clinical_Observation:any;
  Activities:any;
  Provisional_Diagnosis:any;
  SLP:any;
  Appo_ID:any;
  // Foot_Fall_ID:any;
}
class Pta{
  Appo_ID : any;                   
  Degree_Of_Loss_ID : any;             
  Hearing_Loss_ID : any;                
  Type_Of_Loss_ID: any;  
  Degree_Of_Loss_Right_ID: any;   
  Hearing_Loss_Right_ID : any; 
  Type_Of_Loss_Right_ID: any;  
  Tinnitus_Status_ID : any;               
  Sub_Status_ID : any;                   
  Final_Status_ID : any;                 
  Objection_ID: any;                   
  PTA_Right_500: any;                   
  PTA_Right_250 : any;                   
  PTA_Right_1000: any;
  PTA_Right_2000: any;
  PTA_Right_4000: any;
  PTA_Right_8000 : any;                  
  PTA_Right : any;                       
  PTA_Left_250 : any;                    
  PTA_Left_500 : any;                    
  PTA_Left_1000: any; 
  PTA_Left_2000: any;
  PTA_Left_4000 : any;                   
  PTA_Left_8000 : any;                   
  PTA_Left : any;                        
  PTA_Remarks : any;                     
  PTA_Support_Convert : any;             
}
