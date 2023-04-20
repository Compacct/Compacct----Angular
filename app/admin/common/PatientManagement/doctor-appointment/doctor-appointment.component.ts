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
  @ViewChild("consultancy", { static: false })
  UpdateConsultancy: UpdateConsultancyComponent;
   //PTA Pop
  PTAmodal: boolean = false;
  testType: any = undefined;
  RetvAppoid: any = undefined;
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
  TrailSuccessList: any = [];
  FinalStatusList: any = [];
  DisableTypL: boolean = false;
  DisableTypR: boolean = false;
  Disable: boolean = false;
  DisableL: boolean = false;
  SupportShow: boolean = false;
  SupportShow2nd: boolean = false;
  RetriveDisable1St: boolean = false;
  RetriveDisable2nd: boolean = false;
  counte: number = 0;
  PTAFinalSaveSummited: boolean = false;
  TagFillterList: any = undefined;
  FillterSubL: any = undefined;
  FillterSubR: any = undefined;
  TitleHeder: any = "";
  TitleMiddle: any = "";

   //ASSR /BERA Pop
  AssrModal: boolean = false;
  ObjAssr: Assr = new Assr();
  AssrFinalSaveSummited: boolean = false;
  AssrDegreeLossLeft:any =[];
  AssrDegreeLossRight: any = [];
  AssrTinnitusList: any = [];
  AssrSubTypList: any = [];
  AssrFinalStatusList: any = [];
  AssrObjectionList: any = [];
  AssrTrailSuccessList: any = [];
  TopTableAddRemove: boolean = false;

  //Speech Evaluation Outcome Pop
  EvaluationModal: boolean = false;
  EvaluationSummited: boolean = false;
  Language_dropdownList: any = [];
  ObjEvaluation: Evaluation = new Evaluation();
  FinalList: any = [];
  AssesmentList: any = [];
  PackegList: any = [];
  ObjectList: any = [];
  RetriveEvlotion1st:boolean =false;
  RetriveEvlotion2nd: boolean = false;
  GropAssementId: any = {};
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
    // case 'UpdateAppointment':
    //     this.UpdateAppointmentModel = true
    //     this.updateConsultancyInputObj = {
    //       Appo_ID : col.Appo_ID,
    //       required : true
    //     }
    //    break;
     case 'PTA':
       this.ObjPta = new Pta()
       setTimeout(() => {
         this.PTAmodal = true;
         this.TitleHeder = "PTA";
         this.TitleMiddle = "PTA RECOMMENDATION";
         this.TypeLossLeft = [];
         this.TypeLossRight = [];
       },300);
       this.testType = col.Consultancy_Descr;
       this.PTAFinalSaveSummited = false;
       this.RetvAppoid = col.Appo_ID;
       this.counte = 0;
       
       this.RetriveDisable1St = false;
       this.RetriveDisable2nd = false;
       this.getDegreeloss(this.testType);
       this.getConfiloss();
       this.PtaRetrive(this.RetvAppoid);      
       break;
     
     case 'Hearing Aid Trial':
       this.ObjPta = new Pta()
       setTimeout(() => {
         this.PTAmodal = true;
         this.TitleHeder = "HEARING AID TRIAL";
         this.TitleMiddle = "HEARING AID TRIAL RECOMMENDATION";
         this.TypeLossLeft = [];
         this.TypeLossRight = [];
       },300);
       this.testType = col.Consultancy_Descr;
       this.PTAFinalSaveSummited = false;
       this.RetvAppoid = col.Appo_ID;
       this.counte = 0;
       
       this.RetriveDisable1St = false;
       this.RetriveDisable2nd = false;
       this.getDegreeloss(this.testType);
       this.getConfiloss();
       this.PtaRetrive(this.RetvAppoid);      
       break;
     
     case 'Tinnitus':
       this.ObjPta = new Pta()
       setTimeout(() => {
         this.PTAmodal = true;
         this.TitleHeder = "TINNITUS ASSESSMENT AND COUNSELLING ";
         this.TitleMiddle = "TINNITUS ASSESSMENT AND COUNSELLING RECOMMENDATION";
         this.TypeLossLeft = [];
       this.TypeLossRight = [];
       },300);
       this.testType = col.Consultancy_Descr;
       this.PTAFinalSaveSummited = false;
       this.RetvAppoid = col.Appo_ID;
       this.counte = 0;
       
       this.RetriveDisable1St = false;
       this.RetriveDisable2nd = false;
       this.getDegreeloss(this.testType);
       this.getConfiloss();
       this.PtaRetrive(this.RetvAppoid); 
       break;
     
     case 'ASSR':
       this.ObjAssr = new Assr()
       setTimeout(() => {
         this.AssrModal = true;
         this.TitleHeder = "ASSR ";
         this.TitleMiddle = "ASSR RECOMMENDATION";
         this.TopTableAddRemove = false;
       },300);
       this.testType = col.Consultancy_Descr;
       this.AssrFinalSaveSummited = false;
       this.RetvAppoid = col.Appo_ID;
       this.counte = 0;
      
       this.RetriveDisable1St = false;
       this.RetriveDisable2nd = false;
       this.DegreelossAssr(this.testType);
       this.RetriveAssr(this.RetvAppoid); 
       break;
     
     case 'BERA':
       this.ObjAssr = new Assr()
       setTimeout(() => {
         this.AssrModal = true;
         this.TitleHeder = "BERA ";
         this.TitleMiddle = "BERA RECOMMENDATION";
         this.TopTableAddRemove = true;
       },300);
       this.testType = col.Consultancy_Descr;
       this.AssrFinalSaveSummited = false;
       this.RetvAppoid = col.Appo_ID;
       this.counte = 0;
      
       this.RetriveDisable1St = false;
       this.RetriveDisable2nd = false;
       this.DegreelossBera(this.testType);
       this.RetriveAssr(this.RetvAppoid); 
       break;
     
     case 'Speech Evaluation':
       this.ObjEvaluation = new Evaluation();
        setTimeout(() => {
          this.EvaluationModal = true;
          this.TitleHeder = "SPEECH EVALUATION OUTCOME";
          this.TitleMiddle = "SPEECH & LANGUAGE ASSESSMENT RECOMMENDATION";
        }, 300);
       this.EvaluationSummited = false;
       this.RetvAppoid = col.Appo_ID;
       this.counte = 0;
       this.RetriveEvlotion1st =false;
       this.RetriveEvlotion2nd = false;
       this.GropAssementId = {};
       this.getPDiganosis();
       this.RetriveEvlation(this.RetvAppoid)
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
  // PtA Pop  all function // Tinnitus Pop  all function
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
  PtaRetrive(RtvAppoId:any) {
    this.RetriveDisable1St = false;
    this.RetriveDisable2nd = false;
    const FinalCount = this.counte;
    if(RtvAppoId && FinalCount<=2) {
     const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Retrieve_PTA_Deatils",
      "Json_Param_String": JSON.stringify([{Appo_ID: RtvAppoId}])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log("EDitdata", data);
      if (data.length) {
        this.ObjPta = data[0];
        this.RetriveDisable1St = true;
        this.RetriveDisable2nd = true;
        if (FinalCount === 1) {
        this.ObjPta = data[0];
        this.RetriveDisable1St = true;
        this.RetriveDisable2nd = false;
        this.getFinalStatus(this.ObjPta.Sub_Status_ID);
          setTimeout(() => {
         this.ObjectionType(); 
        }, 1000);
        }
       }
      else {
        this.Pta2nd(RtvAppoId)
       }
        })
      } 
  }
  Pta2nd(RtvAppoId2nd:any) {
   if(RtvAppoId2nd) {
     const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Assessment_Type",
      "Json_Param_String": JSON.stringify([{Appo_ID: RtvAppoId2nd}])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
       //console.log("EDitdata22nd", data);
      if (data.length) {
        this.ObjPta = data[0]
        if (data[0].Assessment === "SUBSEQUENT") {
          this.counte++;
          this.PtaRetrive(data[0].Group_Appo_ID);        
        }
         }
        })
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
    if (this.ObjPta.Degree_Of_Loss_ID) {
     const fliterTag = this.DegreeLossLeft.filter((ele: any) => ele.Degree_Of_Loss_ID === this.ObjPta.Degree_Of_Loss_ID);
    this.TagFillterList = fliterTag[0].Tag; 
    }
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Type_Of_Loss_dropdown",
      "Json_Param_String": JSON.stringify([{Tag :this.TagFillterList}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Type_Of_Loss,
            element['value'] = element.Type_Of_Loss_ID
        });
        if (this.ObjPta.Degree_Of_Loss_ID) {
          this.TypeLossLeft = data;
          if (this.ObjPta.Degree_Of_Loss_ID === 1) {
            this.ObjPta.Type_Of_Loss_ID = this.TypeLossLeft[0].Type_Of_Loss_ID;
            this.ObjPta.Hearing_Loss_ID = '';
            this.DisableTypL = true;
            this.DisableL = true;
          }
          else if (this.ObjPta.Degree_Of_Loss_ID === 3) {
            this.ObjPta.Type_Of_Loss_ID = this.TypeLossLeft[1].Type_Of_Loss_ID;
            this.ObjPta.Hearing_Loss_ID = '';
            this.DisableTypL = true;
            this.DisableL = true;
          }
          else if (this.ObjPta.Degree_Of_Loss_ID === 10) {
            this.ObjPta.Type_Of_Loss_ID = this.TypeLossLeft[2].Type_Of_Loss_ID;
            this.ObjPta.Hearing_Loss_ID = '';
            this.DisableTypL = true;
            this.DisableL = false;
          }
          else {
            this.ObjPta.Type_Of_Loss_ID = '';
            this.ObjPta.Hearing_Loss_ID = '';
            this.DisableTypL = false;
            this.DisableL = false;
          }
        }
        else {
          this.ObjPta.Type_Of_Loss_ID = '';
          this.ObjPta.Hearing_Loss_ID = '';
          this.DisableTypL = false;
          this.DisableL = false;
        }
         // console.log("type1", data);
        }
    });  
  }
  getTypeloss2(){
  this.TypeLossRight = [];
   if (this.ObjPta.Degree_Of_Loss_Right_ID) {
    const fliterTag = this.DegreeLossRight.filter((ele: any) => ele.Degree_Of_Loss_ID === this.ObjPta.Degree_Of_Loss_Right_ID);
    this.TagFillterList = fliterTag[0].Tag;   
    }
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Type_Of_Loss_dropdown",
      "Json_Param_String": JSON.stringify([{Tag :this.TagFillterList}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Type_Of_Loss,
            element['value'] = element.Type_Of_Loss_ID
        });
          if (this.ObjPta.Degree_Of_Loss_Right_ID) {
            this.TypeLossRight = data;
                if (this.ObjPta.Degree_Of_Loss_Right_ID === 1) {
                this.ObjPta.Type_Of_Loss_Right_ID = this.TypeLossRight[0].Type_Of_Loss_ID;
                this.ObjPta.Hearing_Loss_Right_ID = '';
                this.DisableTypR = true;
                this.Disable = true;
              }
              else if (this.ObjPta.Degree_Of_Loss_Right_ID === 3) {
                this.ObjPta.Type_Of_Loss_Right_ID = this.TypeLossRight[1].Type_Of_Loss_ID;
                this.ObjPta.Hearing_Loss_Right_ID = '';
                this.DisableTypR = true;
                this.Disable = true;
              }
              else if (this.ObjPta.Degree_Of_Loss_Right_ID === 10) {
                this.ObjPta.Type_Of_Loss_Right_ID = this.TypeLossRight[2].Type_Of_Loss_ID;
                this.ObjPta.Hearing_Loss_Right_ID = '';
                this.DisableTypR = true;
                this.Disable = false;
              }
              else { 
                this.ObjPta.Type_Of_Loss_Right_ID = '';
                this.ObjPta.Hearing_Loss_Right_ID = '';
                this.DisableTypR = false;
                this.Disable = false;
              }
        }
         else { 
            this.ObjPta.Type_Of_Loss_Right_ID = '';
            this.ObjPta.Hearing_Loss_Right_ID = '';
                this.DisableTypR = false;
                this.Disable = false;
              }
          //console.log("type2", data);
        }
    });  
  }
  getTinnitus(Deg_los_id: any) {
  this.ObjPta.Tinnitus_Status_ID = undefined;
  this.ObjPta.Sub_Status_ID = undefined;
  this.ObjPta.Final_Status_ID = undefined;
  this.ObjPta.Final_Status = '';
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
    this.getTypeloss();
    this.getTypeloss2();
  }
  getSubType() {
    this.ObjPta.Sub_Status_ID = undefined;
    this.ObjPta.Final_Status_ID = undefined;
    this.ObjPta.Objection_ID = undefined;
    this.ObjPta.Final_Status = '';
    this.SubTypList = [];
    if (this.ObjPta.Tinnitus_Status_ID !== 1) {
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
         //.log("Tinnitus",data);
      }
    });  
    }
    else {
      this.getSubType2() 
    }
  }
  getSubType2() {
    const degirFillterForSubTypeL = this.DegreeLossLeft.filter((el: any) => el.Degree_Of_Loss_ID === this.ObjPta.Degree_Of_Loss_ID);
     const degirFillterForSubTypeR = this.DegreeLossRight.filter((el: any) => el.Degree_Of_Loss_ID === this.ObjPta.Degree_Of_Loss_Right_ID);
    if (this.ObjPta.Degree_Of_Loss_ID) {  
    this.FillterSubL = degirFillterForSubTypeL[0].Tag_2; 
    }
    if (this.ObjPta.Degree_Of_Loss_Right_ID) {
     this.FillterSubR = degirFillterForSubTypeR[0].Tag_2; 
    }
    if (this.ObjPta.Tinnitus_Status_ID && this.FillterSubL && this.FillterSubR) {
     const tempobj = {
     Left_Tag_2: this.FillterSubL,
     Right_Tag_2: this.FillterSubR
    }
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Sub_Status_For_No_Tinnitus",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Sub_Status,
          element['value'] = element.Sub_Status_ID
        });
        this.SubTypList = data;
        //console.log("Sub2222",data);
      }
    }); 
    } 
  }
  getFinalStatus(Sub_status: any) {
    if (this.counte !== 1) {
       this.ObjPta.Final_Status_ID = undefined;
      this.ObjPta.Objection_ID = undefined;
      this.ObjPta.Final_Status = '';
    }
  this.FinalStatusList = [];
    const tempobj = {
      Sub_Status_ID: Sub_status,
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
    if (this.ObjPta.Final_Status_ID) {
      this.ObjPta.Final_Status = '';
     const filterFinalStatus = this.FinalStatusList.filter((el: any) => Number(el.Final_Status_ID) === Number(this.ObjPta.Final_Status_ID));
    this.ObjPta.Final_Status = filterFinalStatus[0].Final_Status; 
    }
    if (this.ObjPta.Final_Status !== 'Prescribed HA - Binaural' && this.ObjPta.Final_Status !== 'Prescribed HA - Binaural Tinnitus therapy program scheduled') {
      if (this.counte !== 1) {
        this.ObjPta.Objection_ID = undefined;
      }
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
    if (this.ObjPta.Final_Status === 'Prescribed HA - Binaural' || this.ObjPta.Final_Status === 'Prescribed HA - Binaural Tinnitus therapy program scheduled'
      || this.ObjPta.Final_Status === 'Prescribed HA - Monaural Tinnitus therapy program scheduled'|| this.ObjPta.Final_Status === 'Prescribed HA - Monaural ') {
         this.TrailType(); 
    } 
  }
  TrailType() {
    if (this.counte !== 1) {
          this.ObjPta.Trial_Success_ID = undefined;
      }
  this.TrailSuccessList = [];
    const tempobj = {
     Final_Status_ID: this.ObjPta.Final_Status_ID
    }
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Trial_Success_dropdown",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Trial_Success,
          element['value'] = element.Trial_Success_ID
        });
       this.TrailSuccessList = data;
         //console.log("trail",data);
      }
    });    
  }
  SavePtaPop(valid: any) {
    this.PTAFinalSaveSummited = true;
    if (valid && this.RetvAppoid) {
      this.ObjPta.Appo_ID = this.RetvAppoid;
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
            summary: this.TitleHeder,
            detail: "Succesfully Update "
          });
          this.PTAFinalSaveSummited = false;
          this.ObjPta = new Pta();
          this.PTAmodal = false;
          }
        });
   } 
  }

  //Assr/Bera all function
  TotalAssr() {
    if (this.ObjAssr.PTA_Right_500 && this.ObjAssr.PTA_Right_1000 && this.ObjAssr.PTA_Right_2000) {
      let totalR =0
      totalR = Number(this.ObjAssr.PTA_Right_500) + Number(this.ObjAssr.PTA_Right_1000) + Number(this.ObjAssr.PTA_Right_2000)
      this.ObjAssr.PTA_Right = (totalR / 3).toFixed(2);
    }
    else {
      this.ObjAssr.PTA_Right = '';
    }
    if (this.ObjAssr.PTA_Left_500 && this.ObjAssr.PTA_Left_1000 && this.ObjAssr.PTA_Left_2000) {
      let totalL =0
      totalL = Number(this.ObjAssr.PTA_Left_500) + Number(this.ObjAssr.PTA_Left_1000) + Number(this.ObjAssr.PTA_Left_2000)
      this.ObjAssr.PTA_Left = (totalL /3).toFixed(2)
    }
    else {
      this.ObjAssr.PTA_Left = '';
    } 
  }
  DegreelossAssr(typeAssr:any){
  this.AssrDegreeLossLeft = [];
  this.AssrDegreeLossRight = [];
    const tempobj = {
     Test_Type: typeAssr
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
       this.AssrDegreeLossLeft = data;
       this.AssrDegreeLossRight = data;
        //console.table(data)
      }
    }); 
  }
   //Bera Degree loss
  DegreelossBera(typeBera:any){
  this.AssrDegreeLossLeft = [];
  this.AssrDegreeLossRight = [];
    const tempobj = {
     Test_Type: typeBera
    }
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Degree_Of_Loss_Bera_Dropdown",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Degree_Of_Loss_Name,
          element['value'] = element.Degree_Of_Loss_ID
        });
       this.AssrDegreeLossLeft = data;
       this.AssrDegreeLossRight = data;
        //console.table(data)
      }
    }); 
  }
  AssrTinnitus(Deg_los: any) {
  this.ObjAssr.Tinnitus_Status_ID = undefined;
  this.ObjAssr.Sub_Status_ID = undefined;
  this.ObjAssr.Final_Status_ID = undefined;
  this.ObjAssr.Final_Status = '';
  this.ObjAssr.Objection_ID = undefined;
  this.AssrTinnitusList = [];
    const tempobj = {
     Degree_Of_Loss_ID: Deg_los
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
       this.AssrTinnitusList = data;
         //console.log("Tinnitus",data);
      }
    }); 
  }
  AssrSubType() {
  this.ObjAssr.Sub_Status_ID = undefined;
    this.ObjAssr.Final_Status_ID = undefined;
    this.ObjAssr.Objection_ID = undefined;
    this.ObjAssr.Final_Status = '';
    this.AssrSubTypList = [];
    if (this.TitleHeder === "BERA ") {
      this.BeraSubType();
    }
    else {
     if (this.ObjAssr.Tinnitus_Status_ID !== 1) {
    const tempobj = {
     Tinnitus_Status_ID: this.ObjAssr.Tinnitus_Status_ID
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
       this.AssrSubTypList = data;
         //.log("Tinnitus",data);
      }
    });  
    }
    else {
      this.AssrSubType2() 
    }   
    }
    
  }
  //Bera Sub Status 1
  BeraSubType() {
  this.ObjAssr.Sub_Status_ID = undefined;
    this.ObjAssr.Final_Status_ID = undefined;
    this.ObjAssr.Objection_ID = undefined;
    this.ObjAssr.Final_Status = '';
    this.AssrSubTypList = [];
    if (this.ObjAssr.Tinnitus_Status_ID !== 1) {
    const tempobj = {
     Tinnitus_Status_ID: this.ObjAssr.Tinnitus_Status_ID
    }
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Sub_Status_Bera_dropdown",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Sub_Status,
          element['value'] = element.Sub_Status_ID
        });
       this.AssrSubTypList = data;
         //.log("Tinnitus",data);
      }
    });  
    }
    else {
      this.BeraSubType2() 
    }  
  }
  AssrSubType2() {
    const degirFillterForSubTypeL = this.AssrDegreeLossLeft.filter((el: any) => el.Degree_Of_Loss_ID === this.ObjAssr.Degree_Of_Loss_ID);
     const degirFillterForSubTypeR = this.AssrDegreeLossRight.filter((el: any) => el.Degree_Of_Loss_ID === this.ObjAssr.Degree_Of_Loss_Right_ID);
    if (this.ObjAssr.Degree_Of_Loss_ID) {  
    this.FillterSubL = degirFillterForSubTypeL[0].Tag_2; 
    }
    if (this.ObjAssr.Degree_Of_Loss_Right_ID) {
     this.FillterSubR = degirFillterForSubTypeR[0].Tag_2; 
    }
    if (this.ObjAssr.Tinnitus_Status_ID && this.FillterSubL && this.FillterSubR) {
     const tempobj = {
     Left_Tag_2: this.FillterSubL,
     Right_Tag_2: this.FillterSubR
    }
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Sub_Status_For_No_Tinnitus",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Sub_Status,
          element['value'] = element.Sub_Status_ID
        });
        this.AssrSubTypList = data;
        //console.log("Sub2222",data);
      }
    }); 
    }  
  }
  //Bera Sub Status 2
  BeraSubType2() {
    const degirFillterForSubTypeL = this.AssrDegreeLossLeft.filter((el: any) => el.Degree_Of_Loss_ID === this.ObjAssr.Degree_Of_Loss_ID);
     const degirFillterForSubTypeR = this.AssrDegreeLossRight.filter((el: any) => el.Degree_Of_Loss_ID === this.ObjAssr.Degree_Of_Loss_Right_ID);
    if (this.ObjAssr.Degree_Of_Loss_ID) {  
    this.FillterSubL = degirFillterForSubTypeL[0].Tag_2; 
    }
    if (this.ObjAssr.Degree_Of_Loss_Right_ID) {
     this.FillterSubR = degirFillterForSubTypeR[0].Tag_2; 
    }
    if (this.ObjAssr.Tinnitus_Status_ID && this.FillterSubL && this.FillterSubR) {
     const tempobj = {
     Left_Tag_2: this.FillterSubL,
     Right_Tag_2: this.FillterSubR
    }
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Sub_Status_For_No_Tinnitus_Bera",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Sub_Status,
          element['value'] = element.Sub_Status_ID
        });
        this.AssrSubTypList = data;
        //console.log("AssrSubTypList", this.AssrSubTypList);     
      }
    }); 
    }  
  }
  AssrFinalStatus(SubStatusss:any) {
     if (this.counte !== 1) {
       this.ObjAssr.Final_Status_ID = undefined;
      this.ObjAssr.Objection_ID = undefined;
      this.ObjAssr.Final_Status = '';
    }
  this.AssrFinalStatusList = [];
    const tempobj = {
      Sub_Status_ID: SubStatusss,
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
        if (SubStatusss === 3 && this.ObjAssr.Tinnitus_Status_ID === 1) {
          let temp: [] = data.slice(6); 
          this.AssrFinalStatusList = temp; 
        }
        else {
         this.AssrFinalStatusList = data; 
        }     
        // console.log("FinalStatus",this.AssrFinalStatusList);
      }
    });   
  }
  ObjectionTypeAssr() {
    if (this.ObjAssr.Final_Status_ID) {
      this.ObjAssr.Final_Status = '';
     const filterFinalStatus = this.AssrFinalStatusList.filter((el: any) => el.Final_Status_ID === this.ObjAssr.Final_Status_ID);
    this.ObjAssr.Final_Status = filterFinalStatus[0].Final_Status; 
    }
    if (this.ObjAssr.Final_Status !== 'Prescribed HA - Binaural' && this.ObjAssr.Final_Status !== 'Prescribed HA - Binaural Tinnitus therapy program scheduled') {
      if (this.counte !== 1) {
        this.ObjAssr.Objection_ID = undefined;
      }
     this.AssrObjectionList = [];
     const tempobj = {
     Final_Status_ID: this.ObjAssr.Final_Status_ID
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
       this.AssrObjectionList = data;
         //console.log("Objection",data);
      }
    }); 
    }
    if (this.ObjAssr.Final_Status === 'Prescribed HA - Binaural' || this.ObjAssr.Final_Status === 'Prescribed HA - Binaural Tinnitus therapy program scheduled'
      || this.ObjAssr.Final_Status === 'Prescribed HA - Monaural Tinnitus therapy program scheduled'|| this.ObjAssr.Final_Status === 'Prescribed HA - Monaural ') {
         this.TrailTypeAssr();
    }  
  }
  TrailTypeAssr() {
    if (this.counte !== 1) {
          this.ObjAssr.Trial_Success_ID = undefined;
      }
  this.AssrTrailSuccessList = [];
    const tempobj = {
     Final_Status_ID: this.ObjAssr.Final_Status_ID
    }
    const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Trial_Success_dropdown",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Trial_Success,
          element['value'] = element.Trial_Success_ID
        });
       this.AssrTrailSuccessList = data;
         //console.log("trail",data);
      }
    });    
  }
  RetriveAssr(RtvAppoId:any) {
    this.RetriveDisable1St = false;
    this.RetriveDisable2nd = false;
    const FinalCount = this.counte;
    if(RtvAppoId && FinalCount<=2) {
     const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Retrieve_PTA_Deatils",
      "Json_Param_String": JSON.stringify([{Appo_ID: RtvAppoId}])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log("EDitdata", data);
      if (data.length) {
        this.ObjAssr = data[0];
        this.RetriveDisable1St = true;
        this.RetriveDisable2nd = true;
        if (FinalCount === 1) {
        this.ObjAssr = data[0];
        this.RetriveDisable1St = true;
        this.RetriveDisable2nd = false;
        this.AssrFinalStatus(this.ObjAssr.Sub_Status_ID);
        setTimeout(() => {
         this.ObjectionTypeAssr();
        }, 1000);
        }
       }
      else {
        this.Assr2nd(RtvAppoId)
       }
        })
      } 
  }
  Assr2nd(RtvAppoId2nd:any) {
   if(RtvAppoId2nd) {
     const obj = {
      "SP_String": "sp_Hearing_Test",
      "Report_Name_String": "Get_Assessment_Type",
      "Json_Param_String": JSON.stringify([{Appo_ID: RtvAppoId2nd}])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
       //console.log("EDitdata22nd", data);
      if (data.length) {
        this.ObjAssr = data[0]
        if (data[0].Assessment === "SUBSEQUENT") {
          this.counte++;
          this.RetriveAssr(data[0].Group_Appo_ID);        
        }
         }
        })
      } 
  }
  SaveAssrPop(valid:any) {
    this.AssrFinalSaveSummited = true;
    if (valid && this.RetvAppoid) {
      this.ObjAssr.Appo_ID = this.RetvAppoid;
      const obj = {
        "SP_String": "sp_Hearing_Test",
        "Report_Name_String": 'Update_PTA_Deatils',
        "Json_Param_String": JSON.stringify([this.ObjAssr]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if (data[0].Column1){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: this.TitleHeder,
            detail: "Succesfully Update "
          });
          this.AssrFinalSaveSummited = false;
          this.ObjAssr = new Assr();
          this.AssrModal = false;
          }
        });
   } 
  }
  //Speech Evaluation Outcome all function
  getPDiganosis(){
    this.Language_dropdownList = [];
     const obj = {
      "SP_String": "sp_Speech_Test",
      "Report_Name_String": "Get_Speech_and_Language_dropdown",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Speech_And_Language,
          element['value'] = element.Speech_And_Language_Id
        });
       this.Language_dropdownList = data;
         //console.log("degri",data);
      }
    });     
  }
  FinalStatus() {
    this.FinalList = [];
    this.AssesmentList = [];
    this.PackegList = [];
    this.ObjectList = [];
    this.ObjEvaluation.Speech_Final_Status_Id = undefined;
    this.ObjEvaluation.Speech_Assessment_Success_ID = undefined;
    this.ObjEvaluation.Speech_Package_ID = undefined;
    this.ObjEvaluation.Speech_Objection_ID = undefined;
    if (this.ObjEvaluation.Speech_And_Language_Id) {
     const obj = {
      "SP_String": "sp_Speech_Test",
      "Report_Name_String": "Get_Speech_Final_Status_dropdown",
      "Json_Param_String": JSON.stringify([{Speech_And_Language_Id : this.ObjEvaluation.Speech_And_Language_Id}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Final_Status,
          element['value'] = element.Speech_Final_Status_Id

        });
       this.FinalList = data;
        //console.table(data)
      }
    });  
  }
  }
  getAssessment() {
    this.AssesmentList = [];
    this.PackegList = [];
    this.ObjectList = [];
    this.ObjEvaluation.Speech_Assessment_Success_ID = undefined;
    this.ObjEvaluation.Speech_Package_ID = undefined;
    this.ObjEvaluation.Speech_Objection_ID = undefined;
    if (this.ObjEvaluation.Speech_Final_Status_Id ) {
     const obj = {
      "SP_String": "sp_Speech_Test",
      "Report_Name_String": "Get_Assessment_Success_dropdown",
      "Json_Param_String": JSON.stringify([{Speech_Final_Status_Id  : this.ObjEvaluation.Speech_Final_Status_Id }])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Assessment_Success,
          element['value'] = element.Speech_Assessment_Success_ID

        });
       this.AssesmentList = data;
        //console.table(data)
      }
    });  
  }
  }
  getpackeg() {
    this.PackegList = [];
    this.ObjectList = [];
    this.ObjEvaluation.Speech_Package_ID = undefined;
    this.ObjEvaluation.Speech_Objection_ID = undefined;
    if (this.ObjEvaluation.Speech_Assessment_Success_ID) {
     const obj = {
      "SP_String": "sp_Speech_Test",
      "Report_Name_String": "Get_Package_Or_Session_dropdown",
      "Json_Param_String": JSON.stringify([{Speech_Assessment_Success_ID : this.ObjEvaluation.Speech_Assessment_Success_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Package_Or_Per_Session,
          element['value'] = element.Speech_Package_ID
        });
       this.PackegList = data;
        //console.table(data)
      }
    });  
  }
  }
  getObjection(SpeechPackageID:any) {
    this.ObjectList = [];
    if (this.counte !== 1) {
       this.ObjEvaluation.Speech_Objection_ID = undefined;
      }
    if (SpeechPackageID) {
     const obj = {
      "SP_String": "sp_Speech_Test",
      "Report_Name_String": "Get_Objection_dropdown",
      "Json_Param_String": JSON.stringify([{Speech_Package_ID : SpeechPackageID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Objection,
          element['value'] = element.Speech_Objection_ID
        });
       this.ObjectList = data;
        //console.table(data)
      }
    });  
  }
  }
  RetriveEvlation(RtvAppoId: any) {
    this.RetriveEvlotion1st =false;
    this.RetriveEvlotion2nd =false;
    const FinalCount = this.counte;
    if(RtvAppoId && FinalCount<=2) {
     const obj = {
      "SP_String": "sp_Speech_Test",
      "Report_Name_String": "Retrieve_Speech_Deatils",
      "Json_Param_String": JSON.stringify([{Appo_ID: RtvAppoId}])
    }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        // console.log("EDitdata", data);
        if (data.length) {
          this.ObjEvaluation = data[0];
          this.RetriveEvlotion1st = true;
          this.RetriveEvlotion2nd = true;
          if (FinalCount === 1) {
            this.RetriveEvlotion1st = true;
            this.RetriveEvlotion2nd = false;
            this.ObjEvaluation = data[0];
            this.getObjection(this.ObjEvaluation.Speech_Package_ID)
          }
        }
          else {
            this.Evolation2nd(RtvAppoId)
          }
      })
      } 
  }
  Evolation2nd(RtvAppoId2nd:any) {
   if(RtvAppoId2nd) {
     const obj = {
      "SP_String": "sp_Speech_Test",
      "Report_Name_String": "Get_Sppech_Assessment_Type",
      "Json_Param_String": JSON.stringify([{Appo_ID: RtvAppoId2nd}])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
       //console.log("EDitdata22nd", data);
      if (data.length) {
        this.GropAssementId = data[0]
        if (data[0].Assessment === "SUBSEQUENT") {
          this.counte++;
          this.RetriveEvlation(data[0].Group_Appo_ID);        
        }
         }
        })
      } 
  }
  UpdateEvaluation(valid:any) {
    this.EvaluationSummited = true
    if (!valid) {
     return
    }
    else {
      this.ObjEvaluation.Appo_ID = this.RetvAppoid;
      this.ObjEvaluation.Assessment = this.GropAssementId.Assessment;
      this.ObjEvaluation.Group_Appo_ID = this.GropAssementId.Group_Appo_ID;
      const obj = {
        "SP_String": "sp_Speech_Test",
        "Report_Name_String": 'Update_Speech_And_Language_Deatils',
        "Json_Param_String": JSON.stringify([this.ObjEvaluation]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if (data[0].Column1){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'Speech Evaluation Outcome',
            detail: "Succesfully Update "
          });
          this.EvaluationSummited = false;
          this.ObjEvaluation = new Evaluation();
          this.EvaluationModal = false;
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
  Appo_ID: any;
  Group_Appo_ID: any;
  Assessment: any;
  Degree_Of_Loss_ID: any; 
  Degree_Of_Loss_Name: any;
  Hearing_Loss_ID: any; 
  Hearing_Loss: any;
  Type_Of_Loss_ID: any; 
  Type_Of_Loss: any;
  Degree_Of_Loss_Right_ID: any;  
  Degree_Of_Loss_Name1: any;
  Hearing_Loss_Right_ID: any; 
  Hearing_Loss1: any;
  Type_Of_Loss_Right_ID: any;
  Type_Of_Loss1: any;
  Tinnitus_Status_ID: any; 
  Tinnitus_Status: any;
  Sub_Status_ID: any; 
  Sub_Status: any;
  Final_Status_ID: any;
  Final_Status: any;
  Trial_Success_ID: any;
  Trial_Success: any;
  Objection_ID: any;
  Objection: any;
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
class Assr{
  Appo_ID: any;
  Group_Appo_ID: any;
  Assessment: any;
  Degree_Of_Loss_ID: any; 
  Degree_Of_Loss_Name: any;
  Hearing_Loss_ID: any; 
  Hearing_Loss: any;
  Type_Of_Loss_ID: any; 
  Type_Of_Loss: any;
  Degree_Of_Loss_Right_ID: any;  
  Degree_Of_Loss_Name1: any;
  Hearing_Loss_Right_ID: any; 
  Hearing_Loss1: any;
  Type_Of_Loss_Right_ID: any;
  Type_Of_Loss1: any;
  Tinnitus_Status_ID: any; 
  Tinnitus_Status: any;
  Sub_Status_ID: any; 
  Sub_Status: any;
  Final_Status_ID: any;
  Final_Status: any;
  Trial_Success_ID: any;
  Trial_Success: any;
  Objection_ID: any;
  Objection: any;
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
class Evaluation{
  Appo_ID: any;
  Speech_And_Language_Id: any;
  Speech_Objection_ID: any;
  Speech_Final_Status_Id :any;           
  Speech_Assessment_Success_ID :any;    
  Speech_Package_ID :any;                         
  Speech_Remarks :any;                  
  Assessment :any;         
  Group_Appo_ID  :any;                
}

