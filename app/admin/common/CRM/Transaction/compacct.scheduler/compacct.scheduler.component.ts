import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ɵConsole,
  ElementRef
} from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import {
  extend,
  closest,
  isNullOrUndefined,
  remove,
  removeClass,
  Internationalization
} from "@syncfusion/ej2-base";
import { DataManager, Query } from "@syncfusion/ej2-data";
import {
  EventSettingsModel,
  DayService,
  WeekService,
  TimelineViewsService,
  TimelineMonthService,
  View,
  ResizeService,
  ScheduleComponent,
  CellClickEventArgs,
  EventRenderedArgs,
  WorkWeekService,
  MonthService,
  AgendaService,
  TimeScaleModel
} from "@syncfusion/ej2-angular-schedule";
import {
  ContextMenuComponent,
  MenuItemModel,
  BeforeOpenCloseMenuEventArgs,
  MenuEventArgs
} from "@syncfusion/ej2-angular-navigations";

import * as moment from "moment";

import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { forkJoin } from "rxjs";
import { IfStmt } from "@angular/compiler";
import { ValueConverter } from "@angular/compiler/src/render3/view/template";
import { MessageService } from "primeng/api";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { AnyARecord } from "dns";
declare var $: any;
@Component({
  selector: "app-compacct.scheduler",
  templateUrl: "./compacct.scheduler.component.html",
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    TimelineViewsService,
    TimelineMonthService,
    MessageService,
    ResizeService
  ],
  styleUrls: ["./compacct.scheduler.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class CompacctSchedulerComponent implements OnInit {
  display = false;
  url = window["config"];
  dateMomentApi = moment("en-US");
  tabIndexToView = 0;
  CompacctClientData: any;
  buttonname = "UPDATE";
  costCenterName: string;
  displayCreateAppoModal = false;
  displayAppoDetailsModal = false;
  displayResceduleModal = false;
  displayDoctorUpdateModal = false;
  displayPatientDetailsModal = false;
  displayCancelAppoModal = false;
  displayUpdateConsultModal = false;
  displayFeedbackModal = false;
  displayAddPatientModal = false;

  TotalAppointment = 0;
  TotalConsultancy = 0;
  TotalRescedule = 0;

  UserRegistrationSubmitted: boolean;
  appointmentFormSubmitted = false;
  updateDoctorSubmitted = false;
  rescheduleAppointmentSubmitted = false;
  leadSubmitted: boolean;
  userList = [];

  appointmentDate: any = moment(new Date(), "YYYY-MM-DD");
  appointmentTime: any = moment(new Date(), "HH:MM");

  tempConsultancyPackageSubtypeDuration = 0;
  checkAppointmentStatus: string;

  items = [];
  menu = [];
  selectedMenu = 0;

  CostCenterList = [];
  consultancyTypeList: [];
  allConsultancyList: any = [];
  allConsultancySubList: [];
  patientNameList: [];

  doctorList: [];
  doctorFromTime;
  doctorToTime;
  doctorNumberOfPatient;

  packageList: [];
  consultancyList: {}[];
  consultancySubList: [];
  AppointmentList = [];
  TodayWaitingEvents = [];

  AppoEvents = [];
  EventDetailsObj = {};
  ShiftMenuDetailsObj = {};
  PatientInfo = {};
  AppoListOfPatient = [];
  BillingList = [];
  PaymentList = [];
  PaymentVoucherList = [];
  ChallanList = [];
  AdvanceOrderList = [];
  SaleReturnList = [];
  ProductSaleList = [];
  SelectConsultancy = [];
  options = {};
  // WAITING PATIENT
  displayWaitingPatient = false;
  showWaitingMenu = false;
  // APPO
  consultancyPackage: any;
  MobileNumber: any;
  nameTextFieldVisible = false;
  AppoList = [];
  ExistAppoList = [];
  SalesteamList = [];
  ReferenceDoctorList = [];
  optionsYesNo = [
    { name: "Yes", value: true },
    { name: "No", value: false }
  ];
  StatusList = [
    { Name: "H.A Accessories Sale", Consultancy_Type: "Hearing" },
    { Name: "For Information Only", Consultancy_Type: "Hearing" },
    {
      Name: "Appointment for purchase of Hearing Aid",
      Consultancy_Type: "Hearing"
    },
    {
      Name: "Appointment for purchase of Testings",
      Consultancy_Type: "Hearing"
    },
    { Name: "Patient Entry", Consultancy_Type: "Speech" },
    { Name: "Keep it in my followup", Consultancy_Type: "Speech" }
  ];
  PreviousCompanyList = [
    { Name: "ReSound" },
    { Name: "Interton" },
    { Name: "Siemens" },
    { Name: "Signia" },
    { Name: "Starkey" },
    { Name: "Phonak" },
    { Name: "Unitron" },
    { Name: "Widex" },
    { Name: "Oticon" },
    { Name: "Beltone" },
    { Name: "Bernafon" },
    { Name: "Hansaton" },
    { Name: "Other" }
  ];
  CustomerChoiceList = [
    { Name: "Low Budget" },
    { Name: "Mid Budget" },
    { Name: "High Budget" }
  ];
  ChanceToBuyList = [
    { Name: "Within 5 days" },
    { Name: "Within 15 Days" },
    { Name: "Within 30 days" }
  ];
  PreferedLocationList = [{ Name: "Clinic" }, { Name: "Home" }];
  // Patient Create
  selectedReferenceDoctor: any;
  referenceSourceList: [];
  referenceDoctorList: any = [];
  Districts: [];
  states: [];
  CountryList: [];
  patientModalTitle = " Create Patient";
  // Doctor Update
  doctorListForUpdate: [];
  objUpdateDoctorTime: any;
  tempDuration: any;
  // Reschedule Appointment
  ConsultancyTypeForReschedule: any;
  rescheduleAppointmentDate: any;
  doctorListForReschedule = [];
  rescheduleAppointmentTime: any;
  rescheduleAppointmentScheduleID: any;
  rescheduleDoctorFromTime: any;
  rescheduleDoctorToTime: any;

  PatientEditForm = false;
  PreviousCompanyField = false;
  displayViewPreferenceModal = false;

  AspxFileName: any;
  aspxFileNameAO: any;

  FeedbackMsg: string;
  questionList = [];
  val2: any;
  ObjFeedback = new Feedback();

  @ViewChild("scheduleObj", { static: false })
  public scheduleObj: ScheduleComponent;
  @ViewChild("menuObj", { static: false }) menuObj: ContextMenuComponent;

  @ViewChild("interval", { static: false }) intervalInput: ElementRef;
  @ViewChild("slot", { static: false }) slotInput: ElementRef;
  @ViewChild("grid", { static: false }) gridInput: ElementRef;
  // public menuObj: ContextMenuComponent;
  public allowResizing: Boolean = false;
  public currentView: View = "Day";
  public timeScale: TimeScaleModel = {
    enable: true,
    interval: 60,
    slotCount: 3,
    majorSlotTemplate: "#majorSlotTemplate",
    minorSlotTemplate: "#minorSlotTemplate"
  };
  public instance: Internationalization = new Internationalization();

  public selectedDate: Date = new Date();
  public selectedTarget: Element;
  public menuItems: MenuItemModel[] = [
    {
      text: "New Appointment",
      iconCss: "fa fa-fw  fa-plus-square",
      id: "AddAppo"
    },
    {
      text: "Reschedule Appointment",
      iconCss: "fa fa-fw  fa-repeat",
      id: "RescheduleAppo"
    },
    {
      text: "Update Audiologist",
      iconCss: "fa fa-fw fa-user-md",
      id: "UpdateDoctor"
    },
    {
      text: "Patient Details",
      iconCss: "fa fa-fw  fa-book",
      id: "PatientDetails"
    },
    {
      text: "Edit Patient ",
      iconCss: "fa fa-fw  fa-edit",
      id: "PatientEdit"
    },
    {
      text: "Billing",
      iconCss: "fa fa-fw fa-building-o",
      id: "ConsultDone",
      items: [
        {
          text: "Hearing Aid Bill",
          iconCss: "fa fa-fw  fa-medkit",
          id: "HearingAidBill"
        },
        {
          text: "Accessories Bill",
          iconCss: "fa fa-fw fa-ambulance",
          id: "AccessoriesBill"
        },
        {
          text: "Service / Testing Bill",
          iconCss: "fa fa-fw fa-cogs",
          id: "ServiceTestingBill"
        }
      ]
    },
    {
      text: "Appointment Feedback",
      iconCss: "fa fa-fw fa-feed",
      id: "FeedbackAppo"
    },
    {
      text: "Consultancy Done",
      iconCss: "fa fa-fw  fa-stethoscope",
      id: "UpdateAppo"
    },
    {
      text: "Cancel Appointment",
      iconCss: "fa fa-fw fa-remove",
      id: "CanelAppo"
    }
  ];

  objAppointment = new Appointment();
  objTempAppointment = new Appointment();
  objFollowupDetails = new Followup();
  objSearchAppointment = new SearchAppointment();
  objPatientEdit = new PatientEdit();
  objPatient = new Patient();
  objUpdateDoctor = new UpdateDoctor();
  objRescheduleAppointment = new RescheduleAppointment();
  objCheckAppointmentTime = new CheckAppointmentTime();
  now: number;
  public eventSettings: EventSettingsModel;
  constructor(
    private commonApi: CompacctCommonApi,
    private $http: HttpClient,
    private dateApi: DateTimeConvertService,
    private Header: CompacctHeader,
    private compacctToast: MessageService
  ) {
    setInterval(() => {
      this.now = Date.now();
    }, 1000);
  }

  ngOnInit() {
    console.log(
      "%c Compacct V2 - Scheduler ",
      "background: #222; color: #bada55"
    );
    this.items = [
      "PATIENT DETAILS",
      "APPOINTMENT DETAILS",
      "BILLING & PAYMENT & CHALLAN"
    ];
    this.Header.pushHeader({
      Header: "Appointment Scheduler",
      Link: "   CRM -> Clinic -> Appointment Scheduler"
    });
    this.eventSettings = {
      dataSource: <Object[]>extend([], this.AppoEvents, null, true),
      enableTooltip: true
    };
    this.CompacctClientData = this.commonApi.CompacctClientData;
    this.GetCostCenter();
    this.getconsultancyType();
    this.getAllConsultancy();
    this.GetAppointmentList();
    this.getReferenceSource();
    this.getSubEnquerySource();
    this.getSalesTeamList();
    this.GetState();
    this.GetCountry();
    this.GetProductBillASPXFile();
    this.GetAdvanceOrderASPXFile();
    this.GetFeedBackQuestion();
    $("body").addClass("sidebar-collapse");
  }

  getMajorTime(date: Date): string {
    return this.instance.formatDate(date, { skeleton: "hm" });
  }
  getMinorTime(date: Date): string {
    return this.instance
      .formatDate(date, { skeleton: "ms" })
      .replace(":00", "");
  }
  getCellContent(e, e1) {
    // console.log(e)
    //  console.log(e1)
  }

  // INIT DATA
  GetProductBillASPXFile() {
    this.$http
      .get(this.url.apiGetProductBillASPXFileRetail)
      .subscribe((data: any) => {
        this.AspxFileName = data;
      });
  }
  GetAdvanceOrderASPXFile = function() {
    this.$http.get(this.url.apiGetAdvanceOrderaspx).subscribe((data: any) => {
      this.aspxFileNameAO = data;
    });
  };
  GetCostCenter() {
    const cookiesCostCenter = this.commonApi.CompacctCookies.Cost_Cen_ID;
    this.commonApi.getCostCenter().subscribe((data: any) => {
      this.CostCenterList = JSON.parse(data);
      const defaultObj = $.grep(this.CostCenterList, function(value) {
        return value.Cost_Cen_ID === cookiesCostCenter;
      })[0];
      this.costCenterName = defaultObj.Cost_Cen_Name;
      this.objSearchAppointment.Cost_Cen_ID = defaultObj.Cost_Cen_ID;
    });
  }
  getconsultancyType() {
    this.$http.get(this.url.apiGetConsultancyType).subscribe((data: any) => {
      this.consultancyTypeList = JSON.parse(data);
    });
  }
  getAllConsultancy() {
    this.$http
      .get(this.url.apiGetAllDataMasterConsultancy)
      .subscribe((data: any) => {
        const List = data ? JSON.parse(data) : [];
        List.forEach(el => {
          this.allConsultancyList.push({
            label: el.Consultancy_Descr,
            value: el.Cons_ID,
            Cons_ID: el.Cons_ID,
            Consultancy_Type: el.Consultancy_Type,
            Chargeable: el.Chargeable,
            Duration: el.Duration
          });
        });
        this.getAllConsultancySub();
      });
  }
  getAllConsultancySub() {
    this.$http
      .get(this.url.apiGetAllDataConsultancySubTypeAppointment)
      .subscribe((data: any) => {
        this.allConsultancySubList = data ? JSON.parse(data) : [];
      });
  }
  getPackageList(footFallID) {
    if (footFallID) {
      const obj = new HttpParams().set("Foot_Fall_Id", footFallID);
      this.$http
        .get(this.url.apiGetPackageListAppointment, { params: obj })
        .subscribe((data: any) => {
          this.packageList = data ? JSON.parse(data) : [];
        });
    }
  }
  getPackageSubType(footFallID, packageID) {
    if (footFallID && packageID) {
      const obj = new HttpParams()
        .set("Foot_Fall_Id", footFallID)
        .set("Package_ID", packageID);
      this.$http
        .get(this.url.apiGetPackageSubTypeForAppointment, { params: obj })
        .subscribe((data: any) => {
          this.consultancySubList = JSON.parse(data);
        });
    }
  }
  getDoctorList() {
    this.doctorList = [];
    if (this.objAppointment.Consultancy_Type && this.appointmentDate) {
      const obj = new HttpParams()
        .set("Doctor_Type", this.objAppointment.Consultancy_Type)
        .set(
          "Cost_Cen_ID",
          this.objAppointment.Cost_Cen_ID
            ? this.objAppointment.Cost_Cen_ID.toString()
            : "0"
        )
        .set(
          "Appo_Dt",
          this.dateApi.dateConvert(
            moment(this.appointmentDate, "YYYY-MM-DD")["_d"]
          )
        );
      this.$http
        .get(this.url.apiGetDoctorsAppointmentHearing, { params: obj })
        .subscribe((data: any) => {
          this.doctorList = data ? JSON.parse(data) : [];
        });
    }
  }
  getReferenceSource() {
    this.$http.get(this.url.apiGetEnquerySource).subscribe((data: any) => {
      this.referenceSourceList = data ? data : [];
    });
  }
  getSubEnquerySource() {
    this.$http.get(this.url.apiGetAllEnqSubSource).subscribe((data: any) => {
      const refDoc = data ? JSON.parse(data) : [];
      this.fetchRefDoctor(refDoc);
    });
  }
  GetState() {
    this.$http.get(this.url.apiGetState).subscribe((data: any) => {
      this.states = data ? data : [];
    });
  }
  getSalesTeamList() {
    this.$http.get(this.url.apiGetSalesManList).subscribe((data: any) => {
      this.SalesteamList = data ? data : [];
    });
  }
  GetFeedBackQuestion() {
    this.$http
      .get(this.url.apiGetAppoinmentFeedbackQuestion)
      .subscribe((data: any) => {
        this.questionList = JSON.parse(data);
      });
  }

  // CHANGE EVENT
  ChangeSearchCostCenter(CostCenID) {
    if (CostCenID) {
      this.costCenterName = $.grep(this.CostCenterList, function(value) {
        return value.Cost_Cen_ID === Number(CostCenID);
      })[0].Cost_Cen_Name;
    } else {
      this.costCenterName = "";
    }
    this.GetAppointmentList();
  }
  changeAppointmentDate(appoDate) {
    if (appoDate) {
      this.objAppointment.Appo_Dt = this.dateApi.dateConvert(
        moment(appoDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  changeAppointmentTime(appoDate) {
    if (appoDate) {
      this.objAppointment.Appo_Dt = this.dateApi.dateConvert(
        moment(appoDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  changeCostCenter(CostCenID) {
    this.costCenterName = $.grep(this.CostCenterList, function(value) {
      return value.Cost_Cen_ID === Number(CostCenID);
    })[0].Cost_Cen_Name;
    this.getDoctorList();
    this.GetAppointmentList();
  }
  changeDoctor(Schedule_ID) {
    if (Schedule_ID) {
      const obj = $.grep(this.doctorList, function(value) {
        return value.Schedule_ID === Number(Schedule_ID);
      })[0];
      this.objAppointment.Cost_Cen_ID = obj.Cost_Cen_ID;
      this.objAppointment.Doctor_ID = obj.Doctor_ID;
      this.doctorFromTime = obj.From_Time;
      this.doctorToTime = obj.To_Time;
      this.doctorNumberOfPatient = obj.No_Of_Patient;
    }
    this.GetAppointmentList();
  }
  changeName(footFallID) {
    if (footFallID) {
      footFallID
        ? this.getLastFollowupSetTo(footFallID)
        : (this.objFollowupDetails.Sent_To = undefined);
      this.getPackageList(footFallID);
    }
  }
  changeConsultancyPackage() {
    this.objAppointment.Cons_ID = undefined;
    this.SelectConsultancy = [];
    this.objAppointment.Package_Selection_ID = undefined;
    this.objAppointment.Chargeable = undefined;
    this.objAppointment.Cons_Sub_ID = undefined;
    this.consultancySubList = [];
    this.tempConsultancyPackageSubtypeDuration = 0;
  }
  changePackage(packageID) {
    this.consultancySubList = [];
    if (packageID) {
      this.objAppointment.Chargeable = false;
      this.getPackageSubType(this.objAppointment.Foot_Fall_ID, packageID);
    }
  }
  changePackageSubType(ConsSubID) {
    this.tempConsultancyPackageSubtypeDuration = 0;
    if (ConsSubID) {
      const obj = $.grep(this.consultancySubList, function(value) {
        return value.Cons_Sub_ID === ConsSubID;
      })[0];
      this.tempConsultancyPackageSubtypeDuration = obj.Duration;
    }
  }
  changeConsultancyType(consultancyType) {
    this.doctorList = [];
    // this.allConsultancyList = [];
    this.consultancySubList = [];
    this.objAppointment.Chargeable = undefined;
    this.SelectConsultancy = [];
    if (consultancyType) {
      this.allConsultancyList = this.getConsultancyTypeWiseConsultancy(
        consultancyType
      );
    }
    this.getDoctorList();
    this.GetAppointmentList();
  }
  changeMobile(param) {
    param && param.length === 10
      ? this.getLeadOrRegistrationPatientInfo(param)
      : (this.patientNameList = []);
  }
  changeDoctorForUpdate(ScheduleID) {
    this.objUpdateDoctor.Doctor_ID = undefined;
    this.objUpdateDoctor.Schedule_ID = undefined;
    if (ScheduleID) {
      const obj = $.grep(this.doctorListForUpdate, function(value) {
        return value.Schedule_ID === Number(ScheduleID);
      })[0];
      this.objUpdateDoctor.Doctor_ID = obj.Doctor_ID;
      this.objUpdateDoctor.Schedule_ID = ScheduleID;
      this.objCheckAppointmentTime.Doctor_ID = obj.Doctor_ID;
    }
  }
  changeRescheduleAppointmentDoctor(ScheduleID) {
    this.objRescheduleAppointment.Doctor_ID = undefined;
    if (ScheduleID) {
      const obj = $.grep(this.doctorListForReschedule, function(value) {
        return value.Schedule_ID === Number(ScheduleID);
      })[0];
      this.objRescheduleAppointment.Doctor_ID = obj.Doctor_ID;
      this.objRescheduleAppointment.Cost_Cen_ID = obj.Cost_Cen_ID;
      this.objRescheduleAppointment.Schedule_ID = obj.Schedule_ID;
      this.rescheduleDoctorFromTime = obj.From_Time;
      this.rescheduleDoctorToTime = obj.To_Time;
      this.objCheckAppointmentTime.Doctor_ID = obj.Doctor_ID;
    }
  }

  // FUNCTION
  fetchRefDoctor(refDoc) {
    refDoc.forEach(el => {
      this.referenceDoctorList.push({
        label: el.Enq_Source_Sub_Name,
        value: el.Enq_Source_Sub_ID
      });
    });
  }
  GetDistrict(stateparm) {
    this.Districts = [];
    if (stateparm) {
      const obj = new HttpParams().set("StateName", stateparm);
      this.$http
        .get(this.url.apiGetDistrict, { params: obj })
        .subscribe((data: any) => {
          this.Districts = data ? data : [];
        });
    }
  }
  GetStateDistrict(PinParam) {
    this.Districts = [];
    this.objPatient.State = undefined;
    this.objPatient.District = undefined;
    if (PinParam && Number(PinParam.length) === 6) {
      const obj = new HttpParams().set("PINCODE", PinParam);
      this.$http
        .get(this.url.apiGetStateDistrict, { params: obj })
        .subscribe((data: any) => {
          if (data.PIN) {
            this.Districts = data ? data : [];
            // this.Districts.push({})
            this.objPatient.State = data.State;
            this.GetDistrict(data.State);
            this.objPatient.District = data.District;
          }
        });
    }
  }
  GetCountry() {
    this.CountryList = [];
    this.$http.get("/Common/Get_Country_List").subscribe((data: any) => {
      this.CountryList = data ? JSON.parse(data) : [];
    });
  }
  getDoctorListForUpdate(ConsultancyType, CostCenID, appointmentDate) {
    const obj = new HttpParams()
      .set("Doctor_Type", ConsultancyType)
      .set("Cost_Cen_ID", CostCenID)
      .set("Appo_Dt", this.dateApi.dateConvert(appointmentDate));
    this.$http
      .get(this.url.apiGetDoctorsAppointment, { params: obj })
      .subscribe((data: any) => {
        this.doctorListForUpdate = data ? JSON.parse(data) : [];
      });
  }
  getDoctorListForRescheduleAppointment() {
    if (this.ConsultancyTypeForReschedule && this.rescheduleAppointmentDate) {
      const obj = new HttpParams()
        .set("Doctor_Type", this.ConsultancyTypeForReschedule)
        .set(
          "Cost_Cen_ID",
          this.objRescheduleAppointment.Cost_Cen_ID
            ? this.objRescheduleAppointment.Cost_Cen_ID.toString()
            : "0"
        )
        .set(
          "Appo_Dt",
          this.dateApi.dateConvert(this.rescheduleAppointmentDate)
        );
      this.$http
        .get(this.url.apiGetDoctorsAppointment, { params: obj })
        .subscribe((data: any) => {
          this.doctorListForReschedule = data ? JSON.parse(data) : [];
        });
    }
  }
  getLastFollowupSetTo(footFallID) {
    const obj = new HttpParams().set("Foot_Fall_Id", footFallID);
    this.$http
      .get(this.url.apiGetLastFollowup, { params: obj })
      .subscribe((data: any) => {
        this.objFollowupDetails.Sent_To = data
          ? JSON.parse(data)[0].Sent_To
          : undefined;
      });
  }
  getLeadOrRegistrationPatientInfo(param) {
    const obj = new HttpParams().set("Mobile", param);
    this.$http
      .get(this.url.apiGetRegistrationPatientInfoFromMobileNoHearing, {
        params: obj
      })
      .subscribe((data: any) => {
        this.patientNameList = data ? JSON.parse(data) : [];
      });
  }
  getRefDoctorList() {
    if (this.PatientInfo["Enq_Source_ID"]) {
      const obj = new HttpParams().set(
        "Enq_Source_ID",
        this.PatientInfo["Enq_Source_ID"]
      );
      this.$http
        .get(this.url.apiGetEnquerySourceSubMaster, { params: obj })
        .subscribe((data: any) => {
          this.ReferenceDoctorList = data ? JSON.parse(data) : [];
        });
    }
  }
  convertAppoinmentEndTime(appoDate, minutes) {
    const now = new Date(appoDate);
    now.setMinutes(now.getMinutes() + minutes);
    return this.dateApi.dateConvert(now) + " " + moment(now).format("hh:mm A");
  }
  checkAppointmentTime() {
    const doctorFromTime = Date.parse(
      "01/01/2011" + " " + moment(this.doctorFromTime).format("HH:mm") + ":00"
    );
    const doctorToTime = Date.parse(
      "01/01/2011" + " " + moment(this.doctorToTime).format("HH:mm") + ":00"
    );
    const appointmentTime = Date.parse(
      "01/01/2011" +
        " " +
        moment(this.appointmentTime, "HH:mm").format("HH:mm") +
        ":00"
    );
    if (appointmentTime >= doctorFromTime && appointmentTime <= doctorToTime) {
      return true;
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Appointment Time should be between Doctor start & end Time."
      });
      return false;
    }
  }
  checkDoctorWiseNumberOfPatient() {
    let tempDoctorLength = 0;
    if (this.objAppointment.Doctor_ID) {
      const id = this.objAppointment.Doctor_ID;
      tempDoctorLength = $.grep(this.AppointmentList, function(value) {
        return value.Doctor_ID === id;
      }).length;
    }
    if (this.doctorNumberOfPatient === 0) {
      return true;
    } else if (tempDoctorLength < this.doctorNumberOfPatient) {
      return true;
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Total number of Appointment of this schedule is full."
      });
      return false;
    }
  }
  convertJsonString(obj) {
    for (const key in obj) {
      if (obj[key] === 0) {
      } else if (obj[key]) {
      } else if (obj[key] === false) {
      } else {
        obj[key] = null;
      }
    }
    return JSON.stringify([obj]);
  }
  getConsultancyTypeWiseConsultancy(consultancyType) {
    if (consultancyType) {
      return $.grep(this.allConsultancyList, function(value) {
        return (
          value.Consultancy_Type === consultancyType &&
          value.Chargeable === true
        );
      });
    }
  }
  checkAppointmentTimeForReschedule() {
    const doctorFromTime = Date.parse(
      "01/01/2011" +
        " " +
        moment(this.rescheduleDoctorFromTime).format("HH:mm") +
        ":00"
    );
    const doctorToTime = Date.parse(
      "01/01/2011" +
        " " +
        moment(this.rescheduleDoctorToTime).format("HH:mm") +
        ":00"
    );
    const appointmentTime = Date.parse(
      "01/01/2011" +
        " " +
        moment(this.rescheduleAppointmentTime, "HH:mm").format("HH:mm") +
        ":00"
    );
    if (appointmentTime >= doctorFromTime && appointmentTime <= doctorToTime) {
      return true;
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Appointment Time should be between Doctor start & end Time "
      });
      return false;
    }
  }
  // BILL PRINT
  PdfViewBilling = function(docNo) {
    window.open(
      "/Report/Crystal_Files/Finance/SaleBill/" +
        this.aspxFileName +
        "?Doc_No=" +
        docNo,
      "Bill PDF",
      "fullscreen=yes, scrollbars=auto,width=950,height=500"
    );
  };
  AdvanceOrderPDF = function(docNo) {
    window.open(
      "Report/Crystal_Files/Finance/SaleBill/" +
        this.aspxFileNameAO +
        "?Doc_No=" +
        docNo,
      "mywindow",
      "fullscreen=yes, scrollbars=auto,width=950,height=500"
    );
  };
  PaymentVoucherPDF(voucherNo) {
    window.open(
      "/Report/Crystal_Files/Finance/Voucher/report_voucher_print.aspx?Doc_No=" +
        voucherNo,
      "mywindow",
      "fullscreen=yes, scrollbars=auto,width=950,height=500"
    );
  }

  //  SETTINGS
  public onICSExportClick(): void {
    this.scheduleObj.exportToICalendar();
  }
  public onExelExportClick(): void {
    this.scheduleObj.exportToExcel();
  }
  intervalChange(val) {
    if (val) {
      this.scheduleObj.timeScale.interval = Number(val);
      this.scheduleObj.dataBind();
      this.scheduleObj.refresh();
    }
  }
  slotChange(val) {
    if (val) {
      this.scheduleObj.timeScale.slotCount = Number(val);
      this.scheduleObj.dataBind();
      this.scheduleObj.refresh();
    }
  }
  gridChange(val) {
    if (val) {
      this.scheduleObj.timeScale.enable = val === "show" ? true : false;
      this.scheduleObj.dataBind();
      this.scheduleObj.refresh();
    }
  }

  // GET APPOINTMENT LIST
  GetAppointmentList() {
    this.AppointmentList = [];
    this.AppoEvents = [];
    this.TodayWaitingEvents = [];
    const params = new HttpParams()
      .set(
        "Schedule_ID",
        this.objSearchAppointment.Schedule_ID
          ? this.objSearchAppointment.Schedule_ID
          : "0"
      )
      .set(
        "Cost_Cen_ID",
        this.objSearchAppointment.Cost_Cen_ID
          ? this.objSearchAppointment.Cost_Cen_ID
          : "0"
      )
      .set(
        "Appo_Dt",
        this.dateApi.dateConvert(
          moment(this.appointmentDate, "YYYY-MM-DD")["_d"]
        )
      )
      .set(
        "Consultancy_Type",
        this.objSearchAppointment.Consultancy_Type
          ? this.objSearchAppointment.Consultancy_Type
          : "0"
      );
    // this.scheduleObj.showSpinner();

    this.$http
      .get(this.url["apiGetDoctorScheduleAppointmentHearing"], { params })
      .subscribe((data: any) => {
        this.intializeAppoEvents(data ? JSON.parse(data) : "");
      });
  }
  intializeAppoEvents(data: []) {
    this.AppoEvents = [];
    this.TodayWaitingEvents = [];
    this.AppointmentList = [];
    this.scheduleObj.eventSettings.dataSource = <Object[]>(
      extend([], this.AppoEvents, null, true)
    );
    this.TotalAppointment = 0;
    this.TotalConsultancy = 0;
    this.TotalRescedule = 0;
    const now = moment(new Date(), "YYYY-MM-DD")["_d"];
    if (data.length) {
      for (let i = 0; i < data.length; i++) {
        const ProtoObj = {
          id: data[i]["Appo_ID"],
          allDay: false,
          Subject: data[i]["Patient"] + " " + "(" + data[i]["Status"] + ")",
          StartTime: new Date(data[i]["Appo_Dt"]),
          EndTime: new Date(data[i]["Appo_End_Dt"]),
          CategoryColor: this.fecthColorStatus(data[i]),
          Name: data[i]["Patient"],
          status: data[i]["Status"],
          Doctor_ID: data[i]["Doctor_ID"],
          Doctor: data[i]["Doctor"],
          Foot_Fall_ID: data[i]["Foot_Fall_ID"],
          Consultancy_Type: data[i]["Consultancy_Type"],
          Chargeable: data[i]["Chargeable"],
          Mobile: data[i]["Mobile"],
          Feedback_Status: data[i]["Feedback_Status"],
          Cost_Cen_ID: data[i]["Cost_Cen_ID"],
          Con_Sub_Duration: data[i]["Con_Sub_Duration"],
          Cons_Duration: data[i]["Cons_Duration"],
          Appo_Dt: data[i]["Appo_Dt"],
          className: this.fetchIcons(data[i]["Status"])
        };
        this.AppoEvents.push(ProtoObj);
        if (now.getTime() < new Date(data[i]["Appo_Dt"]).getTime()) {
          this.TodayWaitingEvents.push(ProtoObj);
        }
      }
      this.AppointmentList = data;
      // this.scheduleObj.hideSpinner();
      this.TotalAppointment = this.AppoEvents.length;
      this.TotalConsultancy = $.grep(this.AppoEvents, function(value) {
        return value.status === "Consultancy Done";
      }).length;
      this.TotalRescedule = $.grep(this.AppoEvents, function(value) {
        return value.status === "Reschedule";
      }).length;
      this.scheduleObj.eventSettings.dataSource = <Object[]>(
        extend([], this.AppoEvents, null, true)
      );
    }
  }
  changeSchedule(e) {
    // console.log(e);
  }
  fecthColorStatus(AppoObj) {
    if (AppoObj.Status) {
      if (
        AppoObj.Status === "Appointment" &&
        moment().isAfter(AppoObj.Appo_Dt)
      ) {
        return "#c1c1c1";
      } else {
        switch (AppoObj.Status) {
          case "Appointment":
            return "#95b9c7";
            break;
          case "Cancel":
            return "#ff00005e";
            break;
          case "Reschedule":
            return "#9955bb99";
            break;
          case "Consultancy Done":
            return "#99c68e";
            break;
          case "Consultancy Bill Done":
            return "#ffa500ba";
            break;
          case "Package Booked":
            return "#134c04c4";
            break;
          case "Payment Done":
            return "#27ff07ba";
            break;
          case "Therapy Done":
            return "#27ff07ba";
            break;
          default:
        }
      }
    }
  }
  fetchIcons(Status) {
    let className: string;
    if (Status === "Appointment") {
      className = "fa-user-md";
    }
    if (Status === "Cancel") {
      className = "fa-remove";
    }
    if (Status === "Reschedule") {
      className = "fa-repeat";
    }
    if (Status === "Consultancy Done") {
      className = "fa-stethoscope";
    }
    if (Status === "Consultancy Bill Done") {
      className = "fa-money";
    }
    if (Status === "Package Booked") {
      className = "fa-medkit";
    }
    if (Status === "Payment Done") {
      className = "fa-money";
    }
    if (Status === "Therapy Booked") {
      className = "fa-heartbeat";
    }
    return className;
  }
  intializeEventsData(appoid: string) {
    this.EventDetailsObj = {};
    if (appoid) {
      // this.$CompacctAPI.compacctSpinnerShow();
      const id = parseInt(appoid, 0);
      this.EventDetailsObj = $.grep(this.AppointmentList, function(value) {
        return value.Appo_ID === id;
      })[0];
      this.GetDynamicallyAllData(this.EventDetailsObj["Foot_Fall_ID"]);
    }
  }
  GetDynamicallyAllData(footfallId) {
    this.PatientInfo = [];
    this.AppoListOfPatient = [];
    this.BillingList = [];
    this.PaymentList = [];
    this.PaymentVoucherList = [];
    this.ChallanList = [];
    this.AdvanceOrderList = [];
    this.SaleReturnList = [];
    this.ProductSaleList = [];
    this.ReferenceDoctorList = [];
    if (footfallId) {
      let params = new HttpParams().set("FootFallID", footfallId);
      const RegistrationDetails = this.$http.get(
        this.url["apiGetOneLeadHearing"],
        { params }
      );
      params = new HttpParams().set("Foot_Fall_ID", footfallId);
      const AppointmentOfPatient = this.$http.get(
        this.url["apiGetAppointmentHearingFootFallIDWise"],
        { params }
      );
      const billingListOfPatient = this.$http.get(
        this.url["apiGetBillingDetailsFootFallIDWise"],
        { params }
      );
      const paymentListOfPatient = this.$http.get(
        this.url["apiGetPaymentDetailsFootFallIDWise"],
        { params }
      );
      const paymentVoucherListOfPatient = this.$http.get(
        this.url["apiGetPaymentVoucherDetailsFootFallIDWise"],
        { params }
      );
      const challanListOfPatient = this.$http.get(
        this.url["apiGetChallanDetailsFootFallIDWise"],
        { params }
      );
      const AdvanceOrderPatient = this.$http.get(
        this.url["apiGetAdvanceOrderDetailsFootFallIDWise"],
        { params }
      );
      const saleReturnListOfPatient = this.$http.get(
        this.url["apiGetSaleReturnDetailsFootFallIDWise"],
        { params }
      );
      const productSaleListOfPatient = this.$http.get(
        this.url["apiGetProductSaleDetailsFootFallIDWise"],
        { params }
      );

      forkJoin([
        RegistrationDetails,
        AppointmentOfPatient,
        billingListOfPatient,
        paymentListOfPatient,
        paymentVoucherListOfPatient,
        challanListOfPatient,
        AdvanceOrderPatient,
        saleReturnListOfPatient,
        productSaleListOfPatient
      ]).subscribe((result: any) => {
        this.PatientInfo = JSON.parse(result[0])[0];
        this.objPatientEdit = JSON.parse(result[0])[0];
        this.AppoListOfPatient = result[1] ? JSON.parse(result[1]) : [];
        this.BillingList = result[2] ? JSON.parse(result[2]) : [];
        this.PaymentList = result[3] ? JSON.parse(result[3]) : [];
        this.PaymentVoucherList = result[4] ? JSON.parse(result[4]) : [];
        this.ChallanList = result[5] ? JSON.parse(result[5]) : [];
        this.AdvanceOrderList = result[6] ? JSON.parse(result[6]) : [];
        this.SaleReturnList = result[7] ? JSON.parse(result[7]) : [];
        this.ProductSaleList = result[8] ? JSON.parse(result[8]) : [];
        this.getRefDoctorList();
        // this.$CompacctAPI.compacctSpinnerHide();
      });
    }
  }

  // MODAL
  showPatientCreateModal() {
    this.cleanPatientAdd();
    this.objPatient.Country = this.commonApi.CompacctCookies.Country;
    this.patientModalTitle = " Create Patient";
    this.displayAddPatientModal = true;
  }
  showAddAppoModal(data) {
    this.cleanAddAppointment();
    this.appointmentFormSubmitted = false;
    this.objAppointment.Cost_Cen_ID = Number(
      this.objSearchAppointment.Cost_Cen_ID
    );
    // this.appointmentDate =  moment(data.startTime , 'YYYY-MM-DD').toDate();
    this.appointmentDate = moment(new Date(data.startTime)).format(
      "YYYY-MM-DD"
    );
    this.appointmentTime = moment(new Date(data.startTime)).format("HH:mm");
    this.displayCreateAppoModal = !this.displayCreateAppoModal;
  }
  showAppoModal() {
    this.displayAppoDetailsModal = !this.displayAppoDetailsModal;
  }
  async showRescheduleModal(obj) {
    this.cleanRescheduleAppointment();
    this.checkAppointmentStatus = "";
    if (obj) {
      const objParam = new HttpParams().set("Appo_ID", obj.id);
      const t: any = await this.$http
        .get(this.url.apiCheckAppointmentStatus, {
          params: objParam,
          responseType: "text"
        })
        .toPromise();
      this.checkAppointmentStatus = t;

      if (
        (obj.status === "Consultancy Done" || obj.Status === "Billed") &&
        this.commonApi.CompacctClientData["CompanyShortName"] === "MSHCPL"
      ) {
        this.checkAppointmentStatus = "True";
      }

      if (this.checkAppointmentStatus === "True") {
        this.objRescheduleAppointment.Appo_ID = obj.id;
        this.rescheduleAppointmentDate = moment(new Date(obj.Appo_Dt)).format(
          "YYYY-MM-DD"
        );
        this.rescheduleAppointmentTime = moment(new Date(obj.Appo_Dt)).format(
          "HH:mm"
        );
        // this.rescheduleAppointmentDate = new Date(obj.Appo_Dt);
        // this.rescheduleAppointmentTime = new Date(obj.Appo_Dt);
        this.ConsultancyTypeForReschedule = obj.Consultancy_Type;
        this.objRescheduleAppointment.Cost_Cen_ID = this.objSearchAppointment.Cost_Cen_ID;
        this.getDoctorListForRescheduleAppointment();
        this.tempDuration = obj.Cons_Duration
          ? obj.Cons_Duration
          : obj.Con_Sub_Duration;
        this.objCheckAppointmentTime.Duration = this.tempDuration;
        this.displayResceduleModal = !this.displayResceduleModal;
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "This Appoinment no longer Exists"
        });
        this.GetAppointmentList();
      }
    }
  }
  async showDoctorUpdateModal(data) {
    this.cleanUpdateDoctor();
    this.checkAppointmentStatus = "";
    if (data) {
      const objParam = new HttpParams().set("Appo_ID", data.id);
      const t: any = await this.$http
        .get(this.url.apiCheckAppointmentStatus, {
          params: objParam,
          responseType: "text"
        })
        .toPromise();
      this.checkAppointmentStatus = t;
      if (
        this.checkAppointmentStatus === "True" ||
        data.status === "Consultancy Done"
      ) {
        this.getDoctorListForUpdate(
          data.Consultancy_Type,
          data.Cost_Cen_ID,
          data.Appo_Dt
        );
        this.objUpdateDoctor.Appo_ID = data.id;
        // this.objUpdateDoctorTime = new Date(data.Appo_Dt);
        this.objUpdateDoctorTime = moment(
          new Date(data.Appo_Dt),
          "HH:mm"
        ).format("HH:mm");
        this.tempDuration = data.Cons_Duration
          ? data.Cons_Duration
          : data.Con_Sub_Duration;
        this.objCheckAppointmentTime.Duration = this.tempDuration;
        this.objCheckAppointmentTime.Cost_Cen_ID = data.Cost_Cen_ID;
        this.displayDoctorUpdateModal = !this.displayDoctorUpdateModal;
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "This Appoinment no longer Exists"
        });
        this.GetAppointmentList();
      }
    }
  }
  showPatientDetailsModal() {
    this.displayPatientDetailsModal = !this.displayPatientDetailsModal;
  }
  showFeedbackModal(obj) {
    this.FeedbackMsg = undefined;
    this.ObjFeedback = new Feedback();
    this.ObjFeedback.Appo_ID = obj.id;
    if (obj.Feedback_Status === "N") {
      this.displayFeedbackModal = !this.displayFeedbackModal;
    } else {
      this.GetFeedbackAnswer(this.ObjFeedback.Appo_ID);
    }
  }
  showCancelAppoModal(obj) {
    this.displayCancelAppoModal = !this.displayCancelAppoModal;
    this.ShiftMenuDetailsObj = obj;
  }
  showUpdateAppoModal(obj) {
    this.displayUpdateConsultModal = !this.displayUpdateConsultModal;
    this.ShiftMenuDetailsObj = obj;
  }
  showPatientWaitingDetails(eventObj) {
    const appoId = <string>eventObj.id;
    this.ShiftMenuDetailsObj = {};
    this.intializeEventsData(appoId);
    this.showAppoModal();
  }
  showPatientEditModal(obj) {
    if (obj.id) {
      this.cleanPatientAdd();
      this.patientModalTitle = " Edit Patient";
      this.GetPatientEditData(obj.Foot_Fall_ID);
    }
  }
  showViewPreferenceModal() {
    this.intervalInput.nativeElement.value = this.timeScale.interval;
    this.slotInput.nativeElement.value = this.timeScale.slotCount;
    this.gridInput.nativeElement.value = this.timeScale.enable
      ? "show"
      : "hide";
    this.displayViewPreferenceModal = true;
  }
  // CONTEXTMENU
  onEventRendered(args: EventRenderedArgs): void {
    const categoryColor: string = args.data.CategoryColor as string;
    if (!args.element || !categoryColor) {
      return;
    }
    if (this.scheduleObj.currentView) {
      args.element.style.backgroundColor = categoryColor;
    }
  }
  onContextMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
    const newEventElement: HTMLElement = document.querySelector(
      ".e-new-event"
    ) as HTMLElement;
    if (newEventElement) {
      remove(newEventElement);
      removeClass(
        [document.querySelector(".e-selected-cell")],
        "e-selected-cell"
      );
    }
    const targetElement: HTMLElement = <HTMLElement>args.event.target;
    if (closest(targetElement, ".e-contextmenu")) {
      return;
    }
    this.selectedTarget = closest(
      targetElement,
      ".e-appointment,.e-work-cells," +
        ".e-vertical-view .e-date-header-wrap .e-all-day-cells,.e-vertical-view .e-date-header-wrap .e-header-cells"
    );
    if (isNullOrUndefined(this.selectedTarget)) {
      args.cancel = true;
      return;
    }
    if (this.selectedTarget.classList.contains("e-appointment")) {
      const eventObj = <{ [key: string]: Object }>(
        this.scheduleObj.getEventDetails(this.selectedTarget)
      );
      console.log(this.commonApi.CompacctClientData["CompanyShortName"]);
      if (eventObj.status === "Consultancy Done") {
        this.menuObj.hideItems(
          ["AddAppo", "UpdateAppo", "UpdateDoctor", "RescheduleAppo"],
          true
        );
        this.menuObj.showItems(
          [
            "CanelAppo",
            "PatientDetails",
            "FeedbackAppo",
            "PatientEdit",
            "ConsultDone"
          ],
          true
        );
        // if (this.commonApi.CompacctClientData['CompanyShortName'] !== 'AHSCC') {
        //       this.menuObj.hideItems(['AddAppo' , 'UpdateAppo', 'ConsultDone'], true);
        //       this.menuObj.showItems(['RescheduleAppo', 'UpdateDoctor', 'CanelAppo',
        //         'PatientDetails', 'FeedbackAppo', 'PatientEdit'], true);
        //   } else {
        //     this.menuObj.hideItems(['AddAppo' , 'UpdateAppo'], true);
        //     this.menuObj.showItems(['RescheduleAppo', 'UpdateDoctor', 'CanelAppo',
        //       'PatientDetails', 'FeedbackAppo', 'PatientEdit'], true);
        //   }
      } else if (eventObj.status === "Appointment") {
        this.menuObj.hideItems(
          ["AddAppo", "ConsultDone", "FeedbackAppo"],
          true
        );
        this.menuObj.showItems(
          [
            "RescheduleAppo",
            "UpdateDoctor",
            "PatientDetails",
            "PatientEdit",
            "UpdateAppo",
            "CanelAppo"
          ],
          true
        );

        // if (eventObj.Doctor_ID && this.commonApi.CompacctClientData['CompanyShortName'] === 'MSHCPL') {
        //     this.menuObj.hideItems(['AddAppo' , 'ConsultDone'], true);
        //     this.menuObj.showItems(['RescheduleAppo', 'UpdateDoctor',  'UpdateAppo' , 'CanelAppo',
        //       'PatientDetails', 'FeedbackAppo', 'PatientEdit' ], true);
        //   } else {
        //     this.menuObj.hideItems(['AddAppo' , 'UpdateAppo' , 'ConsultDone' , 'CanelAppo'], true);
        //     this.menuObj.showItems(['RescheduleAppo', 'UpdateDoctor',
        //       'PatientDetails', 'FeedbackAppo', 'PatientEdit'], true);
        //   }
      } else {
        this.menuObj.hideItems(
          ["AddAppo", "FeedbackAppo", "ConsultDone"],
          true
        );
        this.menuObj.showItems(
          [
            "RescheduleAppo",
            "UpdateDoctor",
            "CanelAppo",
            "UpdateAppo",
            "PatientDetails",
            "PatientEdit"
          ],
          true
        );
      }
      return;
    }
    this.menuObj.hideItems(
      [
        "RescheduleAppo",
        "UpdateDoctor",
        "CanelAppo",
        "ConsultDone",
        "UpdateAppo",
        "PatientDetails",
        "FeedbackAppo",
        "PatientEdit"
      ],
      true
    );
    this.menuObj.showItems(["AddAppo"], true);
  }
  onMenuItemSelect(args: MenuEventArgs): void {
    const selectedMenuItem: string = args.item.id;
    let eventObj: { [key: string]: Object };
    let cellEevnts;
    if (
      this.selectedTarget &&
      this.selectedTarget.classList.contains("e-appointment")
    ) {
      eventObj = <{ [key: string]: Object }>(
        this.scheduleObj.getEventDetails(this.selectedTarget)
      );
    } else {
      cellEevnts = this.scheduleObj.getCellDetails(this.selectedTarget);
    }
    switch (selectedMenuItem) {
      case "AddAppo":
        console.log("AddAppo");
        this.showAddAppoModal(cellEevnts);
        break;
      case "RescheduleAppo":
        console.log("RescheduleAppo");
        this.showRescheduleModal(eventObj);
        break;
      case "UpdateDoctor":
        console.log("UpdateDoctor");
        this.showDoctorUpdateModal(eventObj);
        break;
      case "CanelAppo":
        console.log("CanelAppo");
        this.ShiftMenuDetailsObj = {};
        this.showCancelAppoModal(eventObj);
        break;
      case "UpdateAppo":
        console.log("UpdateAppo");
        this.ShiftMenuDetailsObj = {};
        this.showUpdateAppoModal(eventObj);
        break;
      case "PatientEdit":
        console.log("UpdateAppo");
        this.showPatientEditModal(eventObj);
        break;
      case "PatientDetails":
        console.log("PatientDetails");
        const appoId = <string>eventObj.id;
        this.ShiftMenuDetailsObj = {};
        this.intializeEventsData(appoId);
        this.showAppoModal();
        break;
      case "HearingAidBill":
        console.log("HearingAidBill");
        this.redirectHearingAidBill(eventObj);
        break;
      case "AccessoriesBill":
        console.log("AccessoriesBill");
        this.redirectAccessoriesBill(eventObj);
        break;
      case "ServiceTestingBill":
        console.log("ServiceTestingBill");
        this.redirectServiceOrTestingBill(eventObj);
        break;
      case "FeedbackAppo":
        console.log("FeedbackAppo");
        this.showFeedbackModal(eventObj);
        break;
    }
  }
  // CHANGE MENU
  onNavigating(e): void {
    console.log(e);
    if (e.action === "date") {
      this.appointmentDate = e.currentDate;
      this.GetAppointmentList();
    }
  }

  // CLICK MENU
  OnDateClick(info: any) {
    // console.log(info);

    this.showAddAppoModal(info);
  }
  OnAppoClick(info: any) {
    this.ShiftMenuDetailsObj = {};
    // if (info.jsEvent.ctrlKey === true) {
    //   this.ShiftMenuDetailsObj = $.grep(this.AppointmentList, function(value)
    // { return value.Appo_ID === parseFloat(info.event.id); })[0];
    //   } else {
    this.intializeEventsData(info.event.id);
    this.showAppoModal();
  }
  onPopupOpen(args) {
    // console.log(args);
    args.cancel = true;
  }

  //  CREATE APPOINTMENT
  CreateAppointment(valid) {
    this.appointmentFormSubmitted = true;
    this.ExistAppoList = [];
    if (valid) {
      this.objAppointment.User_ID = this.commonApi.CompacctCookies.User_ID;
      this.objAppointment.Posted_On = moment().format("YYYY-MM-DD h:mm a");
      if (this.objAppointment.Doctor_ID) {
        const timeValidate = this.checkAppointmentTime(); // check appointment time between Doctor [in and out] time
        const numberOfPatient = this.checkDoctorWiseNumberOfPatient(); // check doctor wise[number of patient] number of Appointment
        if (timeValidate && numberOfPatient) {
          const ParamString = {
            Doctor_ID: this.objAppointment.Doctor_ID,
            Appo_Dt:
              this.dateApi.dateConvert(
                moment(this.appointmentDate, "YYYY-MM-DD")["_d"]
              ) +
              " " +
              moment(this.appointmentTime, "h:mm:ss").format("h:mm a"),
            Duration: this.tempConsultancyPackageSubtypeDuration,
            Cost_Cen_ID: this.objAppointment.Cost_Cen_ID
          };
          this.$http
            .post(this.url.apiCheckAppointmentTime, ParamString)
            .subscribe((data: any) => {
              console.log("%c CheckAppointment Time Success ", " color: green");
              const tempList = JSON.parse(data)[0];
              if (tempList.Remarks === "DONE") {
                this.createFollowUp();
              } else if (tempList.Patient_Name) {
                this.ExistAppoList = JSON.parse(data);
              } else {
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "error",
                  summary: "Warn Message",
                  detail: tempList.Remarks
                });
              }
            });
        }
      } else {
        this.createFollowUp();
      }
    }
  }
  createFollowUp() {
    let dataFollowupID: number;
    this.objFollowupDetails.Foot_Fall_ID = this.objAppointment.Foot_Fall_ID;
    this.objFollowupDetails.User_ID = this.commonApi.CompacctCookies.User_ID;
    this.objFollowupDetails.CurrentAction = "Appointment";
    this.objFollowupDetails.Followup_Details = this.objAppointment.CRM_Note;
    this.objFollowupDetails.Followup_Action = "Tele Call";
    this.objFollowupDetails.Status = "Keep it in My Own Followup";
    this.objFollowupDetails.Next_Followup = this.objAppointment.Appo_Dt;
    this.$http
      .post(this.url.apiCreateCRMFollowUp, this.objFollowupDetails)
      .subscribe((data: any) => {
        dataFollowupID = undefined;
        if (data.success === true) {
          console.log("%c Follow Up Create Success ", " color: green");
          dataFollowupID = data.Followup_ID;
          this.saveAppointment(dataFollowupID);
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Erorr"
          });
        }
      });
  }
  saveAppointment(followupID) {
    const parent = this;
    this.AppoList = [];
    let appointmentCount = 0;
    this.objAppointment.Appo_Dt =
      this.dateApi.dateConvert(
        moment(this.appointmentDate, "YYYY-MM-DD")["_d"]
      ) +
      " " +
      moment(this.appointmentTime, "HH:mm").format("hh:mm A");
    this.objAppointment.Follow_Up_ID = followupID;
    this.objTempAppointment = new Appointment(); // create appointment temporary object for "multiple appointment creation"
    if (this.SelectConsultancy.length) {
      // adding consultancy wise multiple appointment
      this.FetchAppoArrayList();
    } else {
      this.objAppointment.Appo_End_Dt = this.convertAppoinmentEndTime(
        this.objAppointment.Appo_Dt,
        this.tempConsultancyPackageSubtypeDuration
      );
    }
    const AppoLength = this.AppoList.length;
    for (let j = 0; j < AppoLength; j++) {
      // post appointment list synchronously
      appointmentCount = appointmentCount + 1;
      // var jsonString = { "Appointment_String": ctrl.convertJsonString(ctrl.AppoList[j]) };
      $.ajax({
        async: false,
        type: "POST",
        dataType: "text",
        url: this.url.apiCreateAppointmentHearing,
        data: JSON.stringify({
          Appointment_String: this.convertJsonString(this.AppoList[j])
        }),
        contentType: "application/json; charset=utf-8",
        success: function(response) {
          console.log("%c AppointmentCreate Success ", " color: green");
          parent.compacctToast.clear();
          if (appointmentCount === AppoLength) {
            parent.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "success",
              detail: "Appointment Create Succesfully Created"
            });

            parent.GetAppointmentList();
            parent.cleanAddAppointment();
            parent.displayCreateAppoModal = false;
          }
        },
        error: function(error) {
          parent.compacctToast.clear();
          parent.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      });
    }
  }
  FetchAppoArrayList() {
    for (let i = 0; i < this.SelectConsultancy.length; i++) {
      const id = this.SelectConsultancy[i];
      const obj = $.grep(this.allConsultancyList, function(value) {
        return value.Cons_ID === id;
      })[0];

      this.objAppointment.Appo_End_Dt = this.convertAppoinmentEndTime(
        this.objAppointment.Appo_Dt,
        obj.Duration
      );
      this.objAppointment.Cons_ID = obj.value;
      this.objAppointment.Chargeable = obj.Chargeable;

      this.objTempAppointment.Appo_ID = this.objAppointment.Appo_ID;
      this.objTempAppointment.Foot_Fall_ID = this.objAppointment.Foot_Fall_ID;
      this.objTempAppointment.Follow_Up_ID = this.objAppointment.Follow_Up_ID;
      this.objTempAppointment.Cost_Cen_ID = this.objAppointment.Cost_Cen_ID;
      this.objTempAppointment.Consultancy_Type = this.objAppointment.Consultancy_Type;
      this.objTempAppointment.Status = this.objAppointment.Status;
      this.objTempAppointment.Chargeable = this.objAppointment.Chargeable;
      this.objTempAppointment.Appo_Dt = this.objAppointment.Appo_Dt;
      this.objTempAppointment.Cons_ID = this.objAppointment.Cons_ID;
      this.objTempAppointment.Cons_Sub_ID = this.objAppointment.Cons_Sub_ID;
      this.objTempAppointment.Doctor_ID = this.objAppointment.Doctor_ID;
      this.objTempAppointment.User_ID = this.objAppointment.User_ID;
      this.objTempAppointment.Posted_On = this.objAppointment.Posted_On;
      this.objTempAppointment.Followup_Visit = this.objAppointment.Followup_Visit;
      this.objTempAppointment.CRM_Note = this.objAppointment.CRM_Note;
      this.objTempAppointment.Package_Selection_ID = this.objAppointment.Package_Selection_ID;
      this.objTempAppointment.Schedule_ID = this.objAppointment.Schedule_ID;
      this.objTempAppointment.Appo_End_Dt = this.objAppointment.Appo_End_Dt;

      this.AppoList.push(this.objTempAppointment);
      this.objTempAppointment = new Appointment();
      this.objAppointment.Appo_Dt = this.objAppointment.Appo_End_Dt;
    }
  }
  createApooLoop() {}

  // CREATE PATIENT
  getAddressOnChange(even) {
    this.objPatient.Location = undefined;
    if (even) {
      this.objPatient.Location = even;
    }
  }
  CreatePatient(valid) {
    this.leadSubmitted = true;
    if (valid) {
      this.objPatient.Cost_Cen_ID = this.commonApi.CompacctCookies.Cost_Cen_ID;
      this.objPatient.User_ID = this.commonApi.CompacctCookies.User_ID;
      this.objPatient.Posted_On = moment(new Date()).format(
        "DD/MMM/YYYY HH:MM"
      );
      const obj = {
        Enq_Clinic_String: this.convertJsonString(this.objPatient),
        ActionName: this.objPatient.Foot_Fall_ID ? "edit" : "insert"
      };
      this.$http
        .post(this.url.apiCreateLeadHearing, obj)
        .subscribe((data: any) => {
          if (data.success === true) {
            this.displayAddPatientModal = false;
            this.cleanPatientAdd();
            this.GetAppointmentList();
            this.compacctToast.clear();
            if (obj.ActionName === "insert") {
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Patient ID :" + data.Foot_Fall_ID,
                detail: "Succesfully Added"
              });
            } else {
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Patient ID :" + data.Foot_Fall_ID,
                detail: "Succesfully Updated"
              });
            }
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        });
    }
  }
  // EDIT PATIENT
  GetPatientEditData(footFallID) {
    if (footFallID) {
      const obj = new HttpParams().set("FootFallID", footFallID);
      this.$http
        .get(this.url.apiGetOneLeadHearing, { params: obj })
        .subscribe((data: any) => {
          this.objPatient = data ? JSON.parse(data)[0] : [];
          this.GetStateDistrict(this.objPatient.Pin);
          this.selectedReferenceDoctor = this.objPatient.Enq_Source_Sub_ID;
          this.displayAddPatientModal = true;
        });
    }
  }

  // DOCTOR UPDATE
  UpdateDoctor(valid) {
    this.updateDoctorSubmitted = true;
    this.ExistAppoList = [];
    if (valid) {
      this.objUpdateDoctor.Appo_Dt =
        this.dateApi.dateConvert(
          moment(this.appointmentDate, "YYYY-MM-DD")["_d"]
        ) +
        " " +
        moment(this.objUpdateDoctorTime, "HH:mm").format("hh:mm A");
      this.objCheckAppointmentTime.Appo_Dt = this.objUpdateDoctor.Appo_Dt;
      this.objUpdateDoctor.Appo_End_Dt = this.convertAppoinmentEndTime(
        this.objUpdateDoctor.Appo_Dt,
        this.tempDuration
      );

      // this.existsPatientList = [];
      this.$http
        .post(this.url.apiCheckAppointmentTime, this.objCheckAppointmentTime)
        .subscribe((data: any) => {
          const tempList = JSON.parse(data)[0];
          if (tempList.Remarks === "DONE") {
            this.updateNewDoctor();
          } else if (tempList.Patient_Name) {
            this.ExistAppoList = JSON.parse(data);
          } else {
            this.compacctToast.clear("compacct-toast");
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: tempList.Remarks
            });
          }
        });
    }
  }
  updateNewDoctor() {
    const obj = {
      Update_Appointment_String: this.convertJsonString(this.objUpdateDoctor)
    };
    this.$http
      .post(this.url.apiUpdateDoctorForAppointment, obj)
      .subscribe((data: any) => {
        if (data.success === true) {
          this.GetAppointmentList();
          this.cleanUpdateDoctor();
          this.displayDoctorUpdateModal = false;
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "success",
            detail: "Doctor Updated Succesfully"
          });
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured"
          });
          $("#load").button("reset");
        }
      });
  }

  // RESCHEDULE DOCTOR
  checkRescheduleAppointment(valid) {
    this.rescheduleAppointmentSubmitted = true;
    this.ExistAppoList = [];
    if (valid) {
      this.objRescheduleAppointment.Appo_Dt =
        this.dateApi.dateConvert(this.rescheduleAppointmentDate) +
        " " +
        moment(this.rescheduleAppointmentTime, "HH:mm").format("hh:mm A");
      this.objRescheduleAppointment.Appo_End_Dt = this.convertAppoinmentEndTime(
        this.objRescheduleAppointment.Appo_Dt,
        this.tempDuration
      );
      if (this.objRescheduleAppointment.Schedule_ID) {
        const timeValidate = this.checkAppointmentTimeForReschedule();
        if (timeValidate) {
          this.objCheckAppointmentTime.Appo_Dt = this.objRescheduleAppointment.Appo_Dt;
          this.objCheckAppointmentTime.Cost_Cen_ID = this.objRescheduleAppointment.Cost_Cen_ID;
          this.$http
            .post(
              this.url.apiCheckAppointmentTime,
              this.objCheckAppointmentTime
            )
            .subscribe((data: any) => {
              const tempList = JSON.parse(data)[0];
              if (tempList.Remarks === "DONE") {
                this.createRescheduleAppointment();
              } else if (tempList.Patient_Name) {
                this.ExistAppoList = JSON.parse(data);
              } else {
                this.compacctToast.clear("compacct-toast");
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "error",
                  summary: "Warn Message",
                  detail: tempList.Remarks
                });
              }
            });
        }
      } else {
        this.objRescheduleAppointment.Doctor_ID = 0;
        this.objRescheduleAppointment.Schedule_ID = 0;
        this.createRescheduleAppointment();
      }
    }
  }
  createRescheduleAppointment() {
    const obj = {
      Update_Appointment_String: this.convertJsonString(
        this.objRescheduleAppointment
      )
    };
    this.$http
      .post(
        this.url.apiRescheduleAppointmentHearing,
        this.objRescheduleAppointment
      )
      .subscribe((data: any) => {
        if (data.success === true) {
          this.GetAppointmentList();
          this.cleanRescheduleAppointment();
          this.displayResceduleModal = false;
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "success",
            detail: "Reschedule Updated Succesfully"
          });
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured"
          });
          $("#load").button("reset");
        }
      });
  }

  //  BILLING REDIRECT
  redirectHearingAidBill(obj) {
    if (obj) {
      window.open(
        this.CompacctClientData.Details[15].BillingType[0].HearingAidBill +
          "&recordid=" +
          window.btoa(obj.Foot_Fall_ID) +
          "&appoId=" +
          window.btoa(obj.id) +
          "&doctorID=" +
          window.btoa(obj.Doctor_ID)
      );
    }
  }
  redirectAccessoriesBill(obj) {
    if (obj) {
      window.open(
        this.CompacctClientData.Details[15].BillingType[0].AccessoriesBill +
          "&recordid=" +
          window.btoa(obj.Foot_Fall_ID) +
          "&appoId=" +
          window.btoa(obj.id) +
          "&doctorID=" +
          window.btoa(obj.Doctor_ID)
      );
    }
  }
  redirectServiceOrTestingBill(obj) {
    if (obj) {
      window.open(
        this.CompacctClientData.Details[15].BillingType[0].ServiceBill +
          "&recordid=" +
          window.btoa(obj.Foot_Fall_ID) +
          "&appoId=" +
          window.btoa(obj.id) +
          "&doctorID=" +
          window.btoa(obj.Doctor_ID)
      );
    }
  }
  redirectBillCreation(obj) {
    if (obj) {
      window.open(
        this.CompacctClientData.Details[15].BillingType[0].BillCreation +
          "&recordid=" +
          window.btoa(obj.Foot_Fall_ID) +
          "&appoId=" +
          window.btoa(obj.id) +
          "&doctorID=" +
          window.btoa(obj.Doctor_ID)
      );
    }
  }

  // UPDATE CONSULTANCY STATUS
  onUpdateConfirm(obj) {
    this.consultancyConfirmation(obj.id);
  }
  consultancyConfirmation(AppoID) {
    if (AppoID) {
      this.$http
        .post(this.url.apiUpdateAppointmentStatus, { Appo_ID: AppoID })
        .subscribe((data: any) => {
          if (data.success === true) {
            this.GetAppointmentList();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Appointment ID :" + AppoID,
              detail: "Consultancy Status Changed Succesfully"
            });
            this.displayUpdateConsultModal = false;
            this.ShiftMenuDetailsObj = {};
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured"
            });
            $("#load").button("reset");
          }
        });
    }
  }

  //  CANCEL APPOINTMENT
  onCancelConfirm(obj) {
    this.cancelAppointment(obj.id);
  }
  cancelAppointment(AppoID) {
    if (AppoID) {
      this.$http
        .post(this.url.apiCancelAppointmentHearing, { Appo_ID: AppoID })
        .subscribe((data: any) => {
          if (data.success === true) {
            this.GetAppointmentList();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "success",
              detail: "Appointment Cancelled Succesfully"
            });
            this.displayCancelAppoModal = false;
            this.ShiftMenuDetailsObj = {};
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured"
            });
            $("#load").button("reset");
          }
        });
    }
  }

  // FEEDBACK
  handleRate(event, field) {
    this.FeedbackMsg = "You have rated " + event.value;
    if (event.value) {
      this.ObjFeedback[field] = event.value;
    } else {
      this.ObjFeedback[field] = 0;
    }
  }
  handleCancel(event, field) {
    this.FeedbackMsg = "Rating Cancelled";
    this.ObjFeedback[field] = 0;
  }
  GetFeedbackAnswer(appoId) {
    if (appoId) {
      const obj = new HttpParams().set("Appo_ID", appoId);
      this.$http
        .get(this.url.apiGetAppointmentFeedbackAnswer, { params: obj })
        .subscribe((data: any) => {
          this.ObjFeedback = data ? JSON.parse(data)[0] : {};
          this.ObjFeedback.Appo_ID = appoId;
          console.log(this.ObjFeedback);
          this.displayFeedbackModal = !this.displayFeedbackModal;
        });
    }
  }
  SaveFeedback() {
    const obj = {
      Appointment_Feddback_String: this.convertJsonString(this.ObjFeedback)
    };
    console.log(this.ObjFeedback);
    this.$http
      .post(this.url.apiCreateAppointmentFeedbackAnswer, obj)
      .subscribe((data: any) => {
        if (data.success === true) {
          this.GetAppointmentList();
          this.FeedbackMsg = undefined;
          this.ObjFeedback = new Feedback();
          this.displayFeedbackModal = !this.displayFeedbackModal;
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "success",
            detail: "Feedback Updated Succesfully"
          });
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured"
          });
        }
      });
  }

  // CLEAN
  cleanAppointment() {
    this.ExistAppoList = [];
  }
  cleanPatientAdd() {
    this.patientModalTitle = " Create Patient";
    this.leadSubmitted = false;
    this.displayAddPatientModal = false;
    this.objPatient = new Patient();
    this.selectedReferenceDoctor = undefined;
    this.ExistAppoList = [];
  }
  cleanAddAppointment() {
    this.MobileNumber = undefined;
    this.consultancyPackage = undefined;
    this.SelectConsultancy = [];
    this.objAppointment = new Appointment();
    this.appointmentFormSubmitted = false;
  }
  cleanUpdateDoctor() {
    this.objUpdateDoctor = new UpdateDoctor();
    // this.ScheduleIDForUpdate = undefined;
    this.objUpdateDoctorTime = undefined;
    this.updateDoctorSubmitted = false;
    this.tempDuration = undefined;
    this.objCheckAppointmentTime = new CheckAppointmentTime();
    this.ExistAppoList = [];
  }
  cleanRescheduleAppointment() {
    this.objRescheduleAppointment = new RescheduleAppointment();
    this.rescheduleAppointmentSubmitted = false;
    this.rescheduleAppointmentDate = undefined;
    this.rescheduleAppointmentTime = undefined;
    this.rescheduleAppointmentScheduleID = undefined;
    this.ConsultancyTypeForReschedule = undefined;
    this.tempDuration = undefined;
    this.objCheckAppointmentTime = new CheckAppointmentTime();
    this.ExistAppoList = [];
  }
}

class Patient {
  Foot_Fall_ID = 0;
  Cost_Cen_ID: number;
  User_ID: number;
  Posted_On: string;
  Mobile: number;
  Mobile_2: number;
  Mobile_3_WP: number;
  Prefix: string;
  Contact_Name: string;
  Gender: string;
  Date_Of_Birth: string;
  Age: number;
  Address: string;
  Location: string;
  District: string;
  State: string;
  Country: string;
  Pin: number;
  Enq_Source_ID: string;
  Status: string;
  Next_Followup: string;
  Followup_Remarks: string;
  Is_Visiable = "Y";
  Lead_Status = "Registered";
  Enq_Source_Sub_ID: string;

  Problem_Details: string;
  Marketing_Executive: string;
  Customer_Type = "First time HA user";
  Previous_Company: string;
  Customer_Choice = "Mid Budget";
  Chance_Buy = "Within 5 days";
  Prefered_Location = "Clinic";
  Details_Problem_Observerd = "";
  Consultancy_Type: string;
}
class UpdateDoctor {
  Doctor_ID: number;
  Appo_Dt: string;
  Appo_ID: number;
  Appo_End_Dt: string;
  Schedule_ID: number;
}
class RescheduleAppointment {
  Appo_ID: number;
  Cost_Cen_ID: string;
  Appo_Dt: string;
  Doctor_ID: number;
  Schedule_ID: number;
  Appo_End_Dt: string;
}
class CheckAppointmentTime {
  Doctor_ID: number;
  Appo_Dt: string;
  Duration: string;
  Cost_Cen_ID: string;
}
// function createUpdateLead(Enq_Clinic_String, ActionName) {
//   this.Enq_Clinic_String = Enq_Clinic_String;
//   this.ActionName = ActionName;
// }

class Appointment {
  Appo_ID = 0;
  Foot_Fall_ID: number;
  Follow_Up_ID: number;
  Cost_Cen_ID: number;
  Consultancy_Type: string;
  Status = "Appointment";
  Chargeable: boolean;
  Appo_Dt: string;
  Cons_ID: number;
  Cons_Sub_ID = 0;
  Doctor_ID: number;
  User_ID: number;
  Posted_On: string;
  Followup_Visit = false;
  CRM_Note: string;
  Package_Selection_ID: number;
  Schedule_ID: number;
  Appo_End_Dt: string;
  AO_Doc_No: string;
}
class Followup {
  Foot_Fall_ID: number;
  User_ID: number;
  CurrentAction: string;
  Followup_Details: string;
  Followup_Action: string;
  Status: string;
  Sent_To: string;
  Next_Followup: string;
}
class SearchAppointment {
  Schedule_ID: string;
  Cost_Cen_ID: string;
  Consultancy_Type: string;
}
class PatientEdit {
  Mobile: number;
  Mobile_2: number;
  Mobile_3_WP: number;
  Consultancy_Type: string;
  Prefix: string;
  Contact_Name: string;
  Gender: string;
  Age: number;
  Pin: number;
  Location: string;
  Address: string;
  Country: string;
  State: string;
  District: string;
  Enq_Source_ID: number;
  Enq_Source_Sub_ID: number;
  Marketing_Executive: string;
  Customer_Type: string;
  Problem_Details: string;
  Previous_Company: string;
  Customer_Choice: string;
  Chance_Buy: string;
  Prefered_Location: string;
  Status: string;
  Next_Followup: string;
}
class Feedback {
  Appo_ID: number;
  QF1 = 0;
  QF2 = 0;
  QF3 = 0;
  QF4 = 0;
  QF5 = 0;
}
// 6202430851
