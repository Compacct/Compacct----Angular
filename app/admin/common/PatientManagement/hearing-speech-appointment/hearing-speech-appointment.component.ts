import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { ReturnStatement, THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { data } from "jquery";
import { NgxUiLoaderService } from "ngx-ui-loader";


@Component({
  selector: 'app-hearing-speech-appointment',
  templateUrl: './hearing-speech-appointment.component.html',
  styleUrls: ['./hearing-speech-appointment.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HearingSpeechAppointmentComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = "Create";
  Tabitems = {};
  TabView = "";
  appo_Date: Date = new Date();
  End_Date: Date = new Date();
  End_Dateview: Date = new Date();
  allDetalis = [];
  backupAlldetalis = [];
  showTabs = false;
  ConsultancyName = undefined;
  ConsultancyList = []
  url = window["config"];
  cosCenterFilter = [];
  SelectedcosCenter: any;
  ConsultancyFilter = [];
  SelectedConsultancy: any;
  ststusFilter = [];
  Selectedstatus: any;
  Spinner = false;
  MaterialDataList = [];
  MaterialDataListview = [];
  nameDetailsList: any = [];
  footFall_ID = undefined;
  name = "";
  age = undefined;
  sex = ""
  AppoID = undefined;
  browseAssesmentList = [];
  browseFluencyList = [];
  browseAdultList = [];
  browseTherapyList = [];
  viewpopUp = false;
  viewFluencypopUp = false;
  TherapyViewpopUp = false;
  viewAdultpopUp = false;
  disabled = true;
  ObjMaterialData: MaterialData = new MaterialData();
  ObjAssessment: Assessment = new Assessment();
  ObjAssessmentView: AssessmentView = new AssessmentView();
  ObjTherapy: Therapyy = new Therapyy();
  ObjTherapyview: Therapyy = new Therapyy(); 
  ObjFluencyview:any = {};
  objAdultview:any = {};
  ObjFluency: Fluency = new Fluency();
  ObjAdult: Adult = new Adult();
  TodayDATE:any = '';
  ShowOtherTestPrintOpt = false;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) {
    this.TodayDATE = this.DateService.dateConvert(new Date());
    this.ShowOtherTestPrintOpt = this.commonApi.CompacctCookies["Company_Name"] == 'C.C.SAHA LTD' ? true : false;
    }

  ngOnInit() {

    this.Header.pushHeader({
      Header: "Speech Appointment",
      Link: " Patient Management -> Transaction -> Speech -> Speech Appointment"
    });
    this.GetConsultancy();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.buttonname = "Create";
    this.showTabs = false;
    this.tabIndexToView = 0;
    this.TabView = "";
    this.Tabitems = {}
    this.clearData();
  }
  clearData() { 
     this.End_Date = new Date();
     this.MaterialDataList =  [];
   }

   checkDate  (appodate) {
    return this.TodayDATE == this.DateService.dateConvert(new Date(appodate)) ? true : false;
}
OtherTestEntry (obj) {
    this.ngxService.start();
    if (obj.Appo_ID) {
      const para = new HttpParams().set("Appo_ID",obj.Appo_ID);
      this.$http.get('/Hearing_DoctorsAppointment/Get_Other_Entry_Aspx_Link',{ params: para }).subscribe( (response:any) => {
          const data = JSON.parse(response);
            if (data[0].Other_Entry_Aspx_Link) {
                window.open(data[0].Other_Entry_Aspx_Link + "?apid=" + obj.Appo_ID, 'mywindow', ' scrollbars=auto, width=950,height=500');
            }
            this.ngxService.stop();
        });
    }
}
OtherTestEntryPrint (obj) {
    this.ngxService.start();
    if (obj.Appo_ID) {
      const para = new HttpParams().set("Appo_ID",obj.Appo_ID);
      this.$http.get('/Hearing_DoctorsAppointment/Get_Other_Print_Aspx_Link', { params: para }).subscribe((response:any) => {
            console.log(response)
            const data = JSON.parse(response.data)[0];
            if (data.Other_Print_Aspx_Link) {
                window.open(data.Other_Print_Aspx_Link + "?apid=" + obj.Appo_ID, 'mywindow', ' scrollbars=auto, width=950,height=500');
            }
            this.ngxService.stop();
        });
    }
}

  onConfirm() { }
  onReject() { }
  GetConsultancy() {
    this.$http.get(this.url.apiGetConsultancyType).subscribe((data: any) => {
      this.ConsultancyList = data ? JSON.parse(data) : [];
      this.ConsultancyName = this.ConsultancyList[1].Consultancy_Type;
      if (this.ConsultancyName) {
        this.GetAllDetails();
      }
      console.log("ConsultancyList", this.ConsultancyList);
    })
  }
  GetAllDetails() {
    if (this.ConsultancyName) {
      const Temp = {
        User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
        Appo_Dt: this.DateService.dateConvert(new Date(this.appo_Date)),
        Consultancy_Type: this.ConsultancyName
      }
      const obj = {
        "SP_String": "SP_Speech_Appointment",
        "Report_Name_String": "Get_Appointment_Speech",
        "Json_Param_String": JSON.stringify([Temp])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.allDetalis = data;
        this.backupAlldetalis = data;
        if (this.allDetalis.length) {
          this.GetDist1();
          this.GetDist2();
          this.GetDist3();

        }
        console.log("allDetalis", this.allDetalis);
      })
    }
  }
  GetChargeable() {
    this.allDetalis.forEach(el => {
      return el.Chargeable ? "Yes" : "No"
    })
  }
  getStatusWiseColor(obj) {

    var currentDate = Date.parse(this.DateService.dateConvert(new Date()) + ' ' + this.DateService.getTime24Hours(new Date()) + ':00');
    var appoDate = Date.parse(this.DateService.dateConvert(new Date(obj.Appo_Dt)) + ' ' + this.DateService.getTime24Hours(new Date(obj.Appo_Dt)) + ':00');

    if (obj.Status === "Appointment" && currentDate > appoDate) {
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
        default:
      }
    }
  }
  GetDist1() {
    let DOrderBy = [];
    this.cosCenterFilter = [];
    //this.SelectedDistOrderBy1 = [];
    this.backupAlldetalis.forEach((item) => {
      if (DOrderBy.indexOf(item.Cost_Cen_Name) === -1) {
        DOrderBy.push(item.Cost_Cen_Name);
        this.cosCenterFilter.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
        console.log("this.cosCenterFilter", this.cosCenterFilter);
      }
    });
  }
  GetDist2() {
    let DOrderBy = [];
    this.ConsultancyFilter = [];
    //this.SelectedDistOrderBy1 = [];
    this.backupAlldetalis.forEach((item) => {
      if (DOrderBy.indexOf(item.Consultancy_Descr) === -1) {
        DOrderBy.push(item.Consultancy_Descr);
        this.ConsultancyFilter.push({ label: item.Consultancy_Descr, value: item.Consultancy_Descr });
        console.log("this.cosCenterFilter", this.ConsultancyFilter);
      }
    });
  }
  GetDist3() {
    let DOrderBy = [];
    this.ststusFilter = [];
    //this.SelectedDistOrderBy1 = [];
    this.backupAlldetalis.forEach((item) => {
      if (DOrderBy.indexOf(item.Status) === -1) {
        DOrderBy.push(item.Status);
        this.ststusFilter.push({ label: item.Status, value: item.Status });
        console.log("this.cosCenterFilter", this.ststusFilter);
      }
    });
  }
  filterCoscenter() {
    console.log("SelectedcosCenter", this.SelectedcosCenter);
    let DOrderBy = [];
    if (this.SelectedcosCenter.length) {
      DOrderBy = this.SelectedcosCenter;
    }
    this.allDetalis = [];
    if (this.SelectedcosCenter.length) {
      let LeadArr = this.backupAlldetalis.filter(function (e) {
        return (DOrderBy.length ? DOrderBy.includes(e['Cost_Cen_Name']) : true)
      });
      this.allDetalis = LeadArr.length ? LeadArr : [];
      console.log("if GetAllDataList", this.allDetalis)
    } else {
      this.allDetalis = this.backupAlldetalis;
      console.log("else GetAllDataList", this.allDetalis)
    }
  }
  filterConsultancy() {
    console.log("SelectedcosCenter", this.SelectedConsultancy);
    let DOrderBy = [];
    if (this.SelectedConsultancy.length) {
      DOrderBy = this.SelectedConsultancy;
    }
    this.allDetalis = [];
    if (this.SelectedConsultancy.length) {
      let LeadArr = this.backupAlldetalis.filter(function (e) {
        return (DOrderBy.length ? DOrderBy.includes(e['Consultancy_Descr']) : true)
      });
      this.allDetalis = LeadArr.length ? LeadArr : [];
      console.log("if GetAllDataList", this.allDetalis)
    } else {
      this.allDetalis = this.backupAlldetalis;
      console.log("else GetAllDataList", this.allDetalis)
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

  redirectPatientDetails(obj) {
    if (obj) {
      window.open('/Hearing_CRM_Lead_Search?recordid=' + window.btoa(obj.Foot_Fall_ID));
    }
  }
  Assessment(obj) {
    if (obj) {
      this.TabView = "";
      this.Tabitems = {};
      this.showTabs = true;
      this.TabView = "Assessment";
      this.footFall_ID = obj.Foot_Fall_ID;
      this.AppoID = obj.Appo_ID;
      this.GetbrowseAssesment(this.footFall_ID);
      this.Tabitems = {
        headerStyleClass: "compacct-tabs",
        header: "Pedeatric Assessment",
        leftIcon: "fa fa-stethoscope",
        TabView: "Assessment"
      }
      const ctrl = this;
      setTimeout(function () {
        ctrl.tabIndexToView = 1;
        ctrl.GetnameDetails();
      }, 100);
      console.log(this.tabIndexToView);
    }
  }
  FluencyModal(obj) {
    if (obj) {
      this.TabView = "";
      this.Tabitems = {};
      this.showTabs = true;
      this.TabView = "Fluency";
      this.footFall_ID = obj.Foot_Fall_ID;
      this.AppoID = obj.Appo_ID;
      this.GetbrowseFluency(this.footFall_ID);
      this.Tabitems = {
        headerStyleClass: "compacct-tabs",
        header: "Fluency Assessment",
        leftIcon: "fa fa-stethoscope",
        TabView: "Fluency"
      }
      const ctrl = this;
      setTimeout(function () {
        ctrl.tabIndexToView = 1;
        ctrl.GetnameDetails();
      }, 100);
      console.log(this.tabIndexToView);
    }
  }
  Adult(obj) {
    if (obj) {
      this.TabView = "";
      this.Tabitems = {};
      this.showTabs = true;
      this.TabView = "Adult";
      this.footFall_ID = obj.Foot_Fall_ID;
      this.AppoID = obj.Appo_ID;
      this.GetbrowseAdult(this.footFall_ID);
      this.Tabitems = {
        headerStyleClass: "compacct-tabs",
        header: "Adult Assessment",
        leftIcon: "fa fa-stethoscope",
        TabView: "Adult"
      }
      const ctrl = this;
      setTimeout(function () {
        ctrl.tabIndexToView = 1;
        ctrl.GetnameDetails();
      }, 100);
      console.log(this.tabIndexToView);
    }
  }
  Therapy(obj) {
    if (obj) {
      this.TabView = "";
      this.MaterialDataList = [];
      this.Tabitems = {};
      this.showTabs = true;
      this.footFall_ID = obj.Foot_Fall_ID;
      this.AppoID = obj.Appo_ID;
      this.GetbrowseTherapy(this.footFall_ID);
      this.TabView = "Therapy";
      this.Tabitems = {
        headerStyleClass: "compacct-tabs",
        header: "Therapy Plan",
        leftIcon: "fa fa-wheelchair",
        TabView: "Therapy"
      }
      const ctrl = this;
      setTimeout(function () {
        ctrl.tabIndexToView = 1;
        ctrl.GetnameDetails();
      }, 100);
      console.log(this.tabIndexToView);
    }

  }

  AddMaterialData() {
    console.log(this.ObjMaterialData);
    this.MaterialDataList.push(this.ObjMaterialData);
    this.ObjMaterialData = new MaterialData();
    console.log(this.MaterialDataList);
  }
  delete(index){
    this.MaterialDataList.splice(index,1)
  }
  GetnameDetails() {
    this.name = "";
    this.age = undefined;
    this.sex = ""
    const para = new HttpParams().set("FootFallID", this.footFall_ID);
    this.$http.get(this.url.apiGetOneLeadHearing, { params: para }).subscribe((data: any) => {
      let temp = data ? JSON.parse(data) : [];
      this.nameDetailsList = temp
      this.name = temp[0].Contact_Name ? temp[0].Contact_Name : "-";
      this.age = temp[0].Age ? temp[0].Age : "-";
      this.sex = temp[0].Gender ? temp[0].Gender : "-"
      console.log("this.nameDetailsList", this.nameDetailsList);
    })
  }
  saveAssessment() {
    if (this.AppoID && this.footFall_ID) {
      this.ObjAssessment.Appo_ID = this.AppoID;
      this.ObjAssessment.Foot_Fall_ID = this.footFall_ID;
      this.ObjAssessment.Exp_Gestures = this.ObjAssessment.Exp_Gestures ? "YES" : "NO";
      this.ObjAssessment.Exp_Signs = this.ObjAssessment.Exp_Signs ? "YES" : "NO";
      this.ObjAssessment.Comp_Facial_expression = this.ObjAssessment.Comp_Facial_expression ? "YES" : "NO";
      this.ObjAssessment.Comp_Gestures = this.ObjAssessment.Comp_Gestures ? "YES" : "NO";
      this.ObjAssessment.Comp_Signs = this.ObjAssessment.Comp_Signs ? "YES" : "NO";
      this.ObjAssessment.Exp_Complex_Sentence = this.ObjAssessment.Exp_Complex_Sentence ? "YES" : "NO";
      this.ObjAssessment.Exp_Simple_Sentence = this.ObjAssessment.Exp_Simple_Sentence ? "YES" : "NO";
      this.ObjAssessment.Exp_Phrases = this.ObjAssessment.Exp_Phrases ? "YES" : "NO";
      this.ObjAssessment.Exp_Words = this.ObjAssessment.Exp_Words ? "YES" : "NO";
      this.ObjAssessment.Exp_Vocalizations = this.ObjAssessment.Exp_Vocalizations ? "YES" : "NO";
      this.ObjAssessment.Comp_Complex_Sentence = this.ObjAssessment.Comp_Complex_Sentence ? "YES" : "NO";
      this.ObjAssessment.Comp_Simple_Sentence = this.ObjAssessment.Comp_Simple_Sentence ? "YES" : "NO";
      this.ObjAssessment.Comp_Phrases = this.ObjAssessment.Comp_Phrases ? "YES" : "NO";
      this.ObjAssessment.Comp_Words = this.ObjAssessment.Comp_Words ? "YES" : "NO";

      this.ObjAssessment.Spontaneous_writing = this.ObjAssessment.Spontaneous_writing ? "YES" : "NO";
      this.ObjAssessment.Reading_comprehension = this.ObjAssessment.Reading_comprehension ? "YES" : "NO";
      this.ObjAssessment.Writing_dictation = this.ObjAssessment.Writing_dictation ? "YES" : "NO";
      this.ObjAssessment.Word_recognition = this.ObjAssessment.Word_recognition ? "YES" : "NO";
      this.ObjAssessment.Copying = this.ObjAssessment.Copying ? "YES" : "NO";
      this.ObjAssessment.Letter_recognition = this.ObjAssessment.Letter_recognition ? "YES" : "NO";
      const obj = {
        "SP_String": "SP_Speech_Appointment",
        "Report_Name_String": "Insert_Appointment_Assesment",
        "Json_Param_String": JSON.stringify([this.ObjAssessment])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("Save Data", data);
        if (data[0].Column1 === "Save Successfully") {
          this.ObjAssessment = new Assessment();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: data[0].Column1,
            detail: "Pedeatric Assessment Succesfully Save"
          });
          this.showTabs = false;
          this.tabIndexToView = 0;
          this.TabView = "";
          this.Tabitems = {}
        }
      })
    }

  }
  saveFluency(){
    this.ObjFluency.Appo_ID = this.AppoID;
    this.ObjFluency.Foot_Fall_ID = this.footFall_ID;

    const obj = {
      "SP_String": "SP_Speech_Appointment_Adult",
      "Report_Name_String": "Insert_Fluency_Assesment",
      "Json_Param_String": JSON.stringify([this.ObjFluency])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log("Save Data", data);
      if (data[0].Column1 === "Save Successfully") {
        this.ObjFluency = new Fluency();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: data[0].Column1,
          detail: "Fluency Assessment Succesfully Save"
        });
        this.showTabs = false;
        this.tabIndexToView = 0;
        this.TabView = "";
        this.Tabitems = {}
      }
    })
  }
 GetbrowseAssesment(Foot_Fall_ID){
   if(Foot_Fall_ID){
     this.browseAssesmentList = [];
    const obj = {
      "SP_String": "SP_Speech_Appointment",
      "Report_Name_String": "Get_Assesment_Browse",
      "Json_Param_String": JSON.stringify([{Foot_Fall_ID:Foot_Fall_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
       this.browseAssesmentList = data;
       console.log("browseAssesmentList",this.browseAssesmentList);
    })
   }
  
 }
 GetbrowseFluency(Foot_Fall_ID){
  if(Foot_Fall_ID){
    this.browseFluencyList = [];
   const obj = {
     "SP_String": "SP_Speech_Appointment_Adult",
     "Report_Name_String": "Get_Fluency_Assesment",
     "Json_Param_String": JSON.stringify([{Foot_Fall_ID:Foot_Fall_ID}])
   }
   this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.browseFluencyList = data;
      console.log("browseFluencyList",this.browseFluencyList);
   })
  }
 
}
GetbrowseAdult(Foot_Fall_ID){
  if(Foot_Fall_ID){
    this.browseAdultList = [];
   const obj = {
     "SP_String": "SP_Speech_Appointment_Adult",
     "Report_Name_String": "Get_Adult_Assessment",
     "Json_Param_String": JSON.stringify([{Foot_Fall_ID:Foot_Fall_ID}])
   }
   this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.browseAdultList = data;
      console.log("browseAdultList",this.browseAdultList);
   })
  }
 
}
 GetView(col){
   if(col.Assesment_ID){
    const obj = {
      "SP_String": "SP_Speech_Appointment",
      "Report_Name_String": "Get_Assesment_Details",
      "Json_Param_String": JSON.stringify([{Assesment_ID: col.Assesment_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log("View", data);
      this.ObjAssessmentView = data[0];
       if(this.ObjAssessmentView){
        this.viewpopUp = true;
        this.ObjAssessmentView.Exp_Gestures = this.ObjAssessmentView.Exp_Gestures === "YES" ? true : false;
        this.ObjAssessmentView.Exp_Signs = this.ObjAssessmentView.Exp_Signs  === "YES" ? true : false;
        this.ObjAssessmentView.Comp_Facial_expression = this.ObjAssessmentView.Comp_Facial_expression  === "YES" ? true : false;
        this.ObjAssessmentView.Comp_Gestures = this.ObjAssessmentView.Comp_Gestures  === "YES" ? true : false;
        this.ObjAssessmentView.Comp_Signs = this.ObjAssessmentView.Comp_Signs  === "YES" ? true : false;
        this.ObjAssessmentView.Exp_Complex_Sentence = this.ObjAssessmentView.Exp_Complex_Sentence  === "YES" ? true : false;
        this.ObjAssessmentView.Exp_Simple_Sentence = this.ObjAssessmentView.Exp_Simple_Sentence  === "YES" ? true : false;
        this.ObjAssessmentView.Exp_Phrases = this.ObjAssessmentView.Exp_Phrases  === "YES" ? true : false;
        this.ObjAssessmentView.Exp_Words = this.ObjAssessmentView.Exp_Words  === "YES" ? true : false;
        this.ObjAssessmentView.Exp_Vocalizations = this.ObjAssessmentView.Exp_Vocalizations  === "YES" ? true : false;
        this.ObjAssessmentView.Comp_Complex_Sentence = this.ObjAssessmentView.Comp_Complex_Sentence  === "YES" ? true : false;
        this.ObjAssessmentView.Comp_Simple_Sentence = this.ObjAssessmentView.Comp_Simple_Sentence  === "YES" ? true : false;
        this.ObjAssessmentView.Comp_Phrases = this.ObjAssessmentView.Comp_Phrases  === "YES" ? true : false;
        this.ObjAssessmentView.Comp_Words = this.ObjAssessmentView.Comp_Words  === "YES" ? true : false;
  
        this.ObjAssessmentView.Spontaneous_writing = this.ObjAssessmentView.Spontaneous_writing  === "YES" ? true : false;
        this.ObjAssessmentView.Reading_comprehension = this.ObjAssessmentView.Reading_comprehension  === "YES" ? true : false;
        this.ObjAssessmentView.Writing_dictation = this.ObjAssessmentView.Writing_dictation  === "YES" ? true : false;
        this.ObjAssessmentView.Word_recognition = this.ObjAssessmentView.Word_recognition  === "YES" ? true : false;
        this.ObjAssessmentView.Copying = this.ObjAssessmentView.Copying  === "YES" ? true : false;
        this.ObjAssessmentView.Letter_recognition = this.ObjAssessmentView.Letter_recognition  === "YES" ? true : false;
       }
       console.log("ObjAssessmentView",this.ObjAssessmentView);
    })
   }
 }
 GetFluencyview(col){
    if(col.Txn_ID){
      const obj = {
        "SP_String": "SP_Speech_Appointment_Adult",
        "Report_Name_String": "Get_Fluency_Assesment_Details",
        "Json_Param_String": JSON.stringify([{Txn_ID : col.Txn_ID}])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("Fluencyview",data);
        this.ObjFluencyview = data[0];
        console.log("ObjFluencyview",this.ObjFluencyview);
       if(this.ObjFluencyview){
          this.viewFluencypopUp = true;
       }
      });
    }
 }
 GetAdultview(col){
  if(col.Txn_ID){
    const obj = {
      "SP_String": "SP_Speech_Appointment_Adult",
      "Report_Name_String": "Get_Adult_Assessment_Details",
      "Json_Param_String": JSON.stringify([{Txn_ID : col.Txn_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log("Fluencyview",data);
      this.objAdultview = data[0];
      console.log("objAdultview",this.objAdultview);
     if(this.objAdultview){
        this.viewAdultpopUp = true;
     }
    });
  }
}
 GetPrint(col){
  console.log("print",col);
  if (col.Assesment_ID) {
    window.open("/Report/Crystal_Files/CRM/Clinic/Assessment.html?Assesment_ID=" + col.Assesment_ID, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500',

    );
  }
 }

 saveTherapy(){
  if (this.AppoID && this.footFall_ID){
    this.ObjTherapy.Appo_ID = this.AppoID;
    this.ObjTherapy.Foot_Fall_ID = this.footFall_ID; 
    this.ObjTherapy.Plan_End_Date = this.DateService.dateConvert(new Date(this.End_Date))
    const obj = {
      "SP_String": "SP_Speech_Appointment",
      "Report_Name_String": "Insert_Appointment_Therapy",
      "Json_Param_String": JSON.stringify([this.ObjTherapy]),
      "Json_1_String" : JSON.stringify(this.MaterialDataList)
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
       console.log("Save Therapy",data);
       if(data[0].Column1 === "Save Successfully"){
        this.ObjTherapy = new Therapyy();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: data[0].Column1,
          detail: "Therapy Plan Succesfully Save"
        });
        this.clearData();
        this.showTabs = false;
        this.tabIndexToView = 0;
        this.TabView = "";
        this.Tabitems = {}
       }
    })
  }
 }
 saveAdult(){
  this.ObjAdult.Appo_ID = this.AppoID;
  this.ObjAdult.Foot_Fall_ID = this.footFall_ID;

  const obj = {
    "SP_String": "SP_Speech_Appointment_Adult",
    "Report_Name_String": "Insert_Adult_Assessment",
    "Json_Param_String": JSON.stringify([this.ObjAdult])
  }
  this.GlobalAPI.getData(obj).subscribe((data: any) => {
    console.log("Save Data", data);
    if (data[0].Column1 === "Save Successfully") {
      this.ObjAdult = new Adult();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: data[0].Column1,
        detail: "Adult Assessment Succesfully Save"
      });
      this.showTabs = false;
      this.tabIndexToView = 0;
      this.TabView = "";
      this.Tabitems = {}
    }
  })
 }
 GetbrowseTherapy(Foot_Fall_ID){
  if(Foot_Fall_ID){
    this.browseTherapyList = [];
   const obj = {
     "SP_String": "SP_Speech_Appointment",
     "Report_Name_String": "Get_Therapy_Browse_Details",
     "Json_Param_String": JSON.stringify([{Foot_Fall_ID:Foot_Fall_ID}])
   }
   this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.browseTherapyList = data;
      console.log("browseTherapyList",this.browseTherapyList);
   })
  }
 }
 GetTherapyView(col){
   if(col){
     this.TherapyViewpopUp = true;
    this.ObjTherapyview = col;
    this.End_Dateview = new Date(col.Plan_End_Date);
    this.GetMaterialView(col.Therapy_Prog_ID);
   }
  }
GetMaterialView(Therapy_Prog_ID){
  if(Therapy_Prog_ID){
    this.MaterialDataListview = [];
    const obj = {
      "SP_String": "SP_Speech_Appointment",
      "Report_Name_String": "Get_Therapy_Material_Details",
      "Json_Param_String": JSON.stringify([{Therapy_Prog_ID:Therapy_Prog_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.MaterialDataListview = data;
    })
  }
  
}
GetTherapyprint(col){
  console.log("print",col);
  if (col.Therapy_Prog_ID) {
    window.open("/Report/Crystal_Files/CRM/Clinic/Therapy.html?Therapy_Prog_ID=" + col.Therapy_Prog_ID, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500',

    );
  }
}
GetFluencyprint(col){
  console.log("print",col);
  if (col.Txn_ID) {
    window.open("/Report/Crystal_Files/CRM/Clinic/Fluency.html?txn_ID=" + col.Txn_ID, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500',

    );
  }
}
GetAdultprint(col){
  console.log("print",col);
  if (col.Txn_ID) {
    window.open("/Report/Crystal_Files/CRM/Clinic/Adult.html?txn_ID=" + col.Txn_ID, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500',

    );
  }
}
}
class MaterialData {
  Base_line: any;
  Target: any;
  Activities: any;
  Clinical_Observation: any;
}
class Assessment {
  Appo_ID: any = 0;
  Foot_Fall_ID: any = 0;
  Vocalization: any;
  First_word: any;
  First_sentence: any;
  MODE_COMMUNICATION: any;
  Comp_Words: any = false;;
  Comp_Phrases: any = false;
  Comp_Simple_Sentence: any = false;
  Comp_Complex_Sentence: any = false;
  Exp_Vocalizations: any = false;
  Exp_Words: any = false;
  Exp_Phrases: any = false;
  Exp_Simple_Sentence: any = false;
  Exp_Complex_Sentence: any = false;
  Comp_Signs: any = false;
  Comp_Gestures: any = false;
  Comp_Facial_expression: any = false;
  Exp_Signs: any = false;
  Exp_Gestures: any = false;
  App_Lips: any;
  App_Tongue: any;
  App_Teeth: any;
  App_Hard_Palate: any;
  App_Soft_Palate: any;
  App_Mandible: any;
  Fun_Lips: any;
  Fun_Tongue: any;
  Fun_Teeth: any;
  Fun_Hard_Palate: any;
  Fun_Soft_Palate: any;
  Fun_Mandible: any;
  Voice_Loudness: any;
  Voice_Pitch: any;
  Voice_Quality: any;
  Seg_Vowels: any;
  Seg_Consonants: any;
  Seg_Blends: any;
  Phonation_duration: any;
  Supr_Accent: any;
  Supr_Stress: any;
  Supr_Intonation: any;
  Supr_Rate_speech: any;
  Test_Phonology: any;
  Test_Syntax: any;
  Test_Semantics: any;
  Test_Pragmatics: any;
  Int_Name_calling: any;
  Int_Hand_clapping: any;
  Beh_Name_calling: any;
  Beh_Hand_clapping: any;
  Letter_recognition: any = false;
  Copying: any = false;
  Word_recognition: any = false;
  Writing_dictation: any = false;
  Reading_comprehension: any = false;
  Spontaneous_writing: any = false;
  OTHER_TESTS: any;
  PROVISIONAL_DIAGNOSIS: any;
  RECOMMENDATIONS: any;
}
// view
class AssessmentView{
  Appo_ID: any = 0;
  Foot_Fall_ID: any = 0;
  Vocalization: any;
  First_word: any;
  First_sentence: any;
  MODE_COMMUNICATION: any;
  Comp_Words: any = false;;
  Comp_Phrases: any = false;
  Comp_Simple_Sentence: any = false;
  Comp_Complex_Sentence: any = false;
  Exp_Vocalizations: any = false;
  Exp_Words: any = false;
  Exp_Phrases: any = false;
  Exp_Simple_Sentence: any = false;
  Exp_Complex_Sentence: any = false;
  Comp_Signs: any = false;
  Comp_Gestures: any = false;
  Comp_Facial_expression: any = false;
  Exp_Signs: any = false;
  Exp_Gestures: any = false;
  App_Lips: any;
  App_Tongue: any;
  App_Teeth: any;
  App_Hard_Palate: any;
  App_Soft_Palate: any;
  App_Mandible: any;
  Fun_Lips: any;
  Fun_Tongue: any;
  Fun_Teeth: any;
  Fun_Hard_Palate: any;
  Fun_Soft_Palate: any;
  Fun_Mandible: any;
  Voice_Loudness: any;
  Voice_Pitch: any;
  Voice_Quality: any;
  Seg_Vowels: any;
  Seg_Consonants: any;
  Seg_Blends: any;
  Phonation_duration: any;
  Supr_Accent: any;
  Supr_Stress: any;
  Supr_Intonation: any;
  Supr_Rate_speech: any;
  Test_Phonology: any;
  Test_Syntax: any;
  Test_Semantics: any;
  Test_Pragmatics: any;
  Int_Name_calling: any;
  Int_Hand_clapping: any;
  Beh_Name_calling: any;
  Beh_Hand_clapping: any;
  Letter_recognition: any = false;
  Copying: any = false;
  Word_recognition: any = false;
  Writing_dictation: any = false;
  Reading_comprehension: any = false;
  Spontaneous_writing: any = false;
  OTHER_TESTS: any;
  PROVISIONAL_DIAGNOSIS: any;
  RECOMMENDATIONS: any;
}

class Therapyy{
  Appo_ID:any       
  Foot_Fall_ID :any;      
  PROVISIONAL_DIAGNOSIS :any;
  Long_term_goal :any;
  Short_term_goal:any;
  Approach :any;
  Duration :any; 
  Frequency :any; 
  Commencement_Therapy :any;
  Plan_End_Date :any;        
  Parental_Counseling :any;
  Recommendations :any;
}

class Fluency {
    Appo_ID:number;
    Foot_Fall_ID:number;
    Sec_I_First_Exhibition:any;
    Sec_I_Gradual_Sudden:any;
    Sec_I_First_Notice:any;
    Sec_I_Related_Circumstances:any;
    Sec_I_Severity_Inc_Dec:any;
    Sec_I_Stuttered_Or_Not:any;
    Sec_I_Stutterer_Contact:any;

    Sec_II_Reaction_Problem:any;
    Sec_II_By_Parents:any;
    Sec_II_By_Self:any;
    Sec_II_By_Others:any;

    Sec_III_Variety_Stuttering:any;
    Sec_III_Res_Spec_Situation:any;
    Sec_III_Res_Spec_Individuals:any;
    Sec_III_Res_Spec_Sounds:any;
    Sec_III_Res_Sentance_Struc:any;
    Sec_III_Avoid_Behave_Mechanisn:any;
    Sec_III_Avoid_Behave_Reported:any;
    Sec_III_Avoid_Behave_Observed:any;
    Sec_III_Avoid_Behave_Self_Cencern:any;
    Sec_III_Situation_Mechanism:any;
    Sec_III_Situation_Reported:any;
    Sec_III_Situation_Observed:any;
    Sec_III_Situation_Self_Cencern:any;
    Sec_III_Sounds_Mechanism:any;
    Sec_III_Sounds_Reported:any;
    Sec_III_Sounds_Observed:any;
    Sec_III_Sounds_Self_Cencern:any;
    Sec_III_Self_Cencern:any;

    Sec_IV_No_Of_Prolongation:any;
    Sec_IV_No_Of_Repitions:any;
    Sec_IV_No_Of_Hesitations:any;
    Sec_IV_No_Of_Blocks:any;
    Sec_IV_Secondary_Behave:any;
    Sec_IV_Other_Test:any;
    Sec_IV_Provisional_Diagnosis:any;
    Sec_IV_Recommendation:any;
}
class Adult{
  Appo_ID:any;
  Foot_Fall_ID:any;
  General_Complaint:any;
  Medical_History:any;
  Pre_Morbid_Status:any;
  Assessment_Dysphagia:any;
  Score:any;
  Impression:any;
  Assessment_Dysarthria:any;
  Fren_Dysarthria_Assessment:any;
  Reflexes:any;
  Respiration:any;
  Lips:any;
  Palate:any;
  Laryngeal:any;
  Tongue:any;
  Intelligibility:any;
  Dysarthria_Impression:any;
  Cranial_Nerve_Assesment:any;
  Voice_Evaluation_Pitch:any;
  Voice_Evaluation_Loudness:any;
  Voice_Evaluation_Quality:any;
  Phonation_Duration:any;
  S_Z_Ratio:any;
  Instrumental_Assessment:any;
  Grbas_Scale:any;
  Apraxia_Assessment:any;
  Assessment_Aphasia:any;
  Fluency:any;
  Comprehension:any;
  Naming:any;
  Repetition:any;
  Aphasia_Impression:any;
  Other_Test:any;
  Provisional_Diagnosis:any;
  Recommendation:any;
}