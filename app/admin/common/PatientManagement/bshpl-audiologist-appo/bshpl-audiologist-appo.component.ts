import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { FileUpload } from 'primeng/primeng';
import { CommonUserActivityService } from "../../../shared/compacct.services/common-user-activity.service";
import { log } from 'console';
@Component({
  selector: 'app-bshpl-audiologist-appo',
  templateUrl: './bshpl-audiologist-appo.component.html',
  styleUrls: ['./bshpl-audiologist-appo.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BSHPLAudiologistAppoComponent implements OnInit {
  tabIndexToView = 0;
  items: any = [];
  seachSpinner: boolean = false;
  UserID: any = undefined;
  allDetalis: any = [];
  allDetalisHeader: any = [];
  Spinner: boolean = false;
  displayPopup: boolean = false;
  AudiologistFormSubmitted: boolean = false;
  AudiologistList: any = [];

  displayPopupAppo: boolean = false;
  AppoSpinner: boolean = false;
  DegreeLossList: any = [];
  AppointmentFormSubmitted: boolean = false;
  TestDoneList: any = [];
  TypeLossList: any = [];
  YesNoList: any = [];
  HAYesNoListL: any = [];
  HAYesNoListR: any = [];
  TrialDoneOpen: boolean = false;
  TrialUpdateOpen: boolean = false;
  Trial_ForList: any = [];
  MonorualOpen: boolean = false;
  TrialRestultList: any = [];
  MISSEDOpen: boolean = false;
  MissedReasonList: any = [];
  ProductList: any = [];
  ProductTrialLeft: any = undefined;
  ProductTrialRight: any = undefined;
  ProductSelectLeft: any = undefined;
  Rate_After_Discount_Left: any = undefined;
  ProductSelectRight: any = undefined;
  Rate_After_Discount_Right: any = undefined;
  PTLFormSubmitted: boolean = false;
  PTRFormSubmitted: boolean = false;
  PSLFormSubmitted: boolean = false;
  PSRFormSubmitted: boolean = false;
  PTLList: any = [];
  PTRList: any = [];
  PSLList: any = [];
  PSRList: any = [];
  App_Date: any = undefined;
  P_Name: any = undefined;
  Phone: any = undefined;
  Age: any = undefined;
  Sex: any = undefined;
  CostCen_Name: any = undefined;
  Cons_Name: any = undefined;

  displayPopupAppoView: boolean = false;

  CompletedSeachSpinner: boolean = false;
  CompletedAllDetalis: any = [];
  CompletedAllDetalisHeader: any = [];

  displayPopupPro: boolean = false;
  ProgrammingFormSubmitted: boolean = false;
  ProSpinner: boolean = false;

  displayPopupProView: boolean = false;


  objProgramming: Programming = new Programming();
  objAppointment: Appointment = new Appointment();
  objAudiologist: Audiologist = new Audiologist();
  objSearch: Search = new Search();
  objCompletedSearch: CompletedSearch = new CompletedSearch();
  databaseName:any;


  @ViewChild("FileUploadAsset", { static: false }) FileUploadAsset!: FileUpload;
  Loader: any;

  colobj:any = {};
  displayPopupUpdateAppoNo:boolean = false;
  P_NameNo:any = undefined;
  PhoneNo:any = undefined;
  AgeNo:any = undefined;
  SexNo:any = undefined;
  App_DateNo:any = undefined;
  CostCen_NameNo:any = undefined;
  Cons_NameNo:any = undefined;
  AppoNoSpinner:boolean = false;
  objAppointmentNo:AppointmentNo = new AppointmentNo();
  AppointmentNoFormSubmitted:boolean = false;
  TestDoneListAppoNo:any;
  ObjTestDetails:TestDetails = new TestDetails();
  displayViewTestPOP:boolean = false;

  // view case History
  displayViewCaseHistory:boolean = false;
  ObjCaseHistory:any = {};
  docno:any;

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService,
    private _CommonUserActivity : CommonUserActivityService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Audiologist Appointment",
      Link: " Patient Management -> Audiologist -> Audiologist Appointment"
    });
    this.items = ["PENDING", "COMPLETED"];
    this.UserID = Number(this.$CompacctAPI.CompacctCookies.User_ID);
    this.getDatabase();
    // this.TypeLossList = ['NORMAL', 'CONDUCTIVE', 'SENSORINEURAL', 'MIXED','SLOPING SENSORINEURAL','SLOPING MIXED','REVERSE SLOPING SENSORINEURAL'];
    this.YesNoList = ['YES', 'NO'];
    this.HAYesNoListL = ['YES', 'NO'];
    this.HAYesNoListR = ['YES', 'NO'];
    this.Trial_ForList = ['Binaural', 'Monorual'];
    this.TestDoneListAppoNo = ["Ear wax","Active ear discharge","Patient not ready to do test","Enquiry only","Others"];
    
    this.getAlldata();
    this.GetDegreeLossList();
    this.GetProductList();
    this.GetMissedReasonList();
    this.GetTestDoneList();
    this.getResult();
    this.GetTypeofLost();
  }
  getDatabase(){
    this.$http
        .get("/Common/Get_Database_Name",
        {responseType: 'text'})
        .subscribe((data: any) => {
          this.databaseName = data;
          console.log(data)
          this.getResult();
          this.GetTypeofLost();
        });
  }

  viewCaseHistory(col:any){
    if(col.foot_fall_id)
      {
        console.log('row data', col);
        this.displayViewCaseHistory = true;
        this.GetPatientData(col.foot_fall_id)
      }
  }

  GetPatientData(id:any) {
    this.ProductList = [];
    const obj = {
      "SP_String": "SP_BL_CRM_Enq_Case_History",
      "Report_Name_String": "Get_ENQ_Case_History",
      "Json_Param_String": JSON.stringify([{Foot_Fall_ID:id}])
      }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log("patient",data);
      this.ObjCaseHistory = data[0];
    });
  }
  GetTypeofLost(){
    this.TypeLossList = [];
    if(this.databaseName === "GN_Anand_Chandigarh") {
      this.TypeLossList = ['NORMAL', 'CONDUCTIVE', 'SENSORINEURAL', 'MIXED','SLOPING SENSORINEURAL','SLOPING MIXED','REVERSE SLOPING SENSORINEURAL'];
    } 
    else if(this.databaseName === "GN_Crystal_Mumbai"){
      this.TypeLossList = ['NORMAL', 'CONDUCTIVE', 'SENSORINEURAL', 'MIXED','SLOPING SENSORINEURAL','SLOPING MIXED'];
    }
    else {
      this.TypeLossList = ['NORMAL', 'CONDUCTIVE', 'SENSORINEURAL', 'MIXED'];
    }
  }
  
  closeCaseHistory(){
    this.displayViewCaseHistory = false;
    this.ObjCaseHistory = {};
  }

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.items = ["PENDING", "COMPLETED"];
    this.clearData();
  }
  getResult(){
    let resultoption:any = [];
    if(this.databaseName === "GN_Crystal_Mumbai") {
      resultoption = ['ADVANCE PAID', 'FITTED', 'MISSED', 'ON TRIAL'];
    }
    else if(this.databaseName === "GN_Anand_Chandigarh") {
      resultoption = ['ADVANCE PAID', 'FITTED', 'MISSED', 'TRIAL ONGOING', 'IN PROCESS'];
    }
    else {
      resultoption = ['ADVANCE PAID', 'FITTED', 'MISSED'];
    }
    this.TrialRestultList = resultoption;
  }

  getDateRange(dateRangeObj: any) {
    if (dateRangeObj.length) {
      this.objSearch.From_Date = dateRangeObj[0];
      this.objSearch.To_Date = dateRangeObj[1];
    }
  }


  AdultSoftHear(obj:any){
    if (obj) {
      console.log('obj',obj);
      window.open('/New_Adult_Speech_Evaluation?Appo_ID=' + window.btoa(obj.Appo_ID));
    }
  }
  ChildSoftHear(obj:any){
    if (obj) {
      console.log('obj',obj);
      window.open('/New_Child_Speech_Evaluation?Appo_ID=' + window.btoa(obj.Appo_ID));
    }
  }

  getAlldata() {
    this.seachSpinner = true
    this.ngxService.start();

    const start = this.objSearch.From_Date
      ? this.DateService.dateConvert(new Date(this.objSearch.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.objSearch.To_Date
      ? this.DateService.dateConvert(new Date(this.objSearch.To_Date)) 
      : this.DateService.dateConvert(new Date());
    this.objSearch.User_Id = Number(this.UserID);

    const tempobj = {
      start_Time: start,
      to_time: end,
      User_ID: this.objSearch.User_Id ? this.objSearch.User_Id : 0,
    
    }
    // console.log("tempobj",tempobj);

    const obj = {
      "SP_String": "sp_BSHPL_Audiologist_Appo",
      "Report_Name_String": "Get_All_Pending",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log("getAlldata",data);
      this.ngxService.stop();
      this.seachSpinner = false;

      this.allDetalis = data;
      console.log('allDetalis=====',this.allDetalis);
      if (this.allDetalis.length) {
        this.allDetalisHeader = Object.keys(data[0]);
        // console.log('allDetalisHeader=====',this.allDetalisHeader);
      }
    })
  }

  clearData() {
    this.AudiologistFormSubmitted = false;
    this.AudiologistList = [];
    this.displayPopup = false;
    this.Spinner = false;
    this.seachSpinner = false;
    this.objAudiologist = new Audiologist();

    this.displayPopupAppo = false;
    this.AppoSpinner = false;
    this.AppointmentFormSubmitted = false;

    this.PTLFormSubmitted = false;
    this.PTRFormSubmitted = false;
    this.PSLFormSubmitted = false;
    this.PSRFormSubmitted = false;

    this.TrialDoneOpen = false;
    this.TrialUpdateOpen = false;
    this.MonorualOpen = false;
    this.MISSEDOpen = false;

    this.objAppointment = new Appointment();
    this.HAYesNoListL = ['YES', 'NO'];
    this.HAYesNoListR = ['YES', 'NO'];

    this.PTLList = [];
    this.PTRList = [];
    this.PSLList = [];
    this.PSRList = [];

    this.ProductTrialLeft = undefined;
    this.ProductTrialRight = undefined;
    this.ProductSelectLeft = undefined;
    this.ProductSelectRight = undefined;

    this.App_Date = undefined;
    this.P_Name = undefined;
    this.Phone = undefined;
    this.Age = undefined;
    this.Sex = undefined;
    this.CostCen_Name = undefined;
    this.Cons_Name = undefined;

    this.displayPopupAppoView = false;
    this.CompletedSeachSpinner = false;

    this.displayPopupPro = false;
    this.objProgramming = new Programming();
    this.ProSpinner = false;
    this.ProgrammingFormSubmitted = false;

    this.displayPopupProView = false;
  }

  actionClick_PatientDetails(col: any) {
    if (col) {
      window.open('/Hearing_CRM_Lead_Search?recordid=' + window.btoa(col.foot_fall_id));
    }
  }

  actionClick_UpdateAppo(col: any) {
    // console.log("actionClick_UpdateAppo");
    this.docno = undefined;
    if (col) {
      this.docno = col.Appo_ID;
      this.objAppointment.Foot_Fall_ID = Number(col.foot_fall_id);
      this.objAppointment.Trial_Date = this.DateService.dateTimeConvert(new Date(col.Appo_Start));
      this.objAppointment.Doctor_ID = Number(col.Doctor_ID);
      this.displayPopupAppo = true;
      this.FileUploadAsset.clear();
      this.P_Name = col.Patient;
      this.Phone = Number(col.Mobile);
      this.Age = Number(col.Age);
      this.Sex = col.Sex;
      this.App_Date = this.DateService.dateTimeConvert(new Date(col.Appo_Start));
      this.CostCen_Name = col.Cost_Cen_Name;
      this.Cons_Name = col.Consultancy;
      if(this.databaseName === 'GN_Crystal_Mumbai'){
        this.onReject();
      }
    }
  }
 
  closePopupAppo() {
    // console.log('close up works Appo');
    this.displayPopupAppo = false;

    this.TrialDoneOpen = false;
    this.TrialUpdateOpen = false;
    this.MonorualOpen = false;
    this.MISSEDOpen = false;

    this.objAppointment = new Appointment();
    this.HAYesNoListL = ['YES', 'NO'];
    this.HAYesNoListR = ['YES', 'NO'];

    this.PTLList = [];
    this.PTRList = [];
    this.PSLList = [];
    this.PSRList = [];

    this.ProductTrialLeft = undefined;
    this.ProductTrialRight = undefined;
    this.ProductSelectLeft = undefined;
    this.ProductSelectRight = undefined;

    this.App_Date = undefined;
    this.P_Name = undefined;
    this.Phone = undefined;
    this.Age = undefined;
    this.Sex = undefined;
    this.CostCen_Name = undefined;
    this.Cons_Name = undefined;
  }

  checkdatabase(){
    if(this.databaseName === "GN_Crystal_Mumbai"){
      if(this.objAppointment.Audiogram) {
        return true;
      }
      else {
        this.AppoSpinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message ",
          detail: "No Document Found"
        });
        return false;
      }
    }
    else {
      return true;
    }
  }
  async SaveAppointment(valid: any) {
    // console.log("this.objAppointment.Trail_Missed_Reason",this.objAppointment.Trail_Missed_Reason);
    this.AppointmentFormSubmitted = true;
    if (valid && this.checkdatabase()) {
      this.AppoSpinner = true;

      this.objAppointment.Trial_ID = 0;
      this.objAppointment.Created_On = this.DateService.dateTimeConvert(new Date());
      
      this.objAppointment.Trial_Done = this.objAppointment.Trial_Done ? this.objAppointment.Trial_Done : 'NA';
      this.objAppointment.EXPERIENCE_USER = this.objAppointment.EXPERIENCE_USER ? this.objAppointment.EXPERIENCE_USER : 'NA';
      this.objAppointment.Trial_For = this.objAppointment.Trial_For ? this.objAppointment.Trial_For : 'NA';
      this.objAppointment.Trial_For_Mono_Reason = this.objAppointment.Trial_For_Mono_Reason ? this.objAppointment.Trial_For_Mono_Reason : 'NA';
      this.objAppointment.Trial_Restult = this.objAppointment.Trial_Restult ? this.objAppointment.Trial_Restult : 'NA';
      this.objAppointment.Trail_Missed_Reason = this.objAppointment.Trail_Missed_Reason ? this.objAppointment.Trail_Missed_Reason.toString() : 'NA';
      this.objAppointment.Test_Done = this.objAppointment.Test_Done ? this.objAppointment.Test_Done.toString() : '-';

      let TrialList: any = [];
      for (let item of this.PTLList) {
        TrialList.push({
          Entry_ID: 0,
          Product_ID: item.Product_ID,
          Product_Description: item.Product_Description,
          Ear_Side: item.Ear_Side
        })
      }
      for (let item of this.PTRList) {
        TrialList.push({
          Entry_ID: 0,
          Product_ID: item.Product_ID,
          Product_Description: item.Product_Description,
          Ear_Side: item.Ear_Side
        })
      }
      // console.log('TrialList',TrialList);

      let SelectList: any = [];
      for (let item of this.PSLList) {
        SelectList.push({
          Entry_ID: 0,
          Product_ID: item.Product_ID,
          Product_Description: item.Product_Description,
          Rate_After_Discount: item.Rate_After_Discount_Left,
          Ear_Side: item.Ear_Side
        })
      }
      for (let item of this.PSRList) {
        SelectList.push({
          Entry_ID: 0,
          Product_ID: item.Product_ID,
          Product_Description: item.Product_Description,
          Rate_After_Discount: item.Rate_After_Discount_Right,
          Ear_Side: item.Ear_Side
        })
      }
      // console.log('SelectList',SelectList);

      this.objAppointment.Update_Trial_Details = TrialList;
      this.objAppointment.Update_Select_Details = SelectList;

      // console.log('this.objAppointment',this.objAppointment);
      
  
      const SaveAppObj = {
        "SP_String": "sp_BSHPL_Audiologist_Appo",
        "Report_Name_String": "Add_BSHPL_Audiologist",
        "Json_Param_String": JSON.stringify([this.objAppointment])
      }
      this.ngxService.start();
      this.GlobalAPI.postData(SaveAppObj).subscribe(async(data: any) => {
        this.ngxService.stop();
        // console.log("save data",data);

        if (data[0].Column1) {
          await this.SaveUserActivity();
          this.getAlldata();
          this.clearData();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Appointment ",
            detail: "Save "
          });
        }
        else {
          this.AppoSpinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail: "Error occured "
          });
        }
      });
      
    }
  }

  HAYesNoL() {
    this.objAppointment.HA_Req_L=undefined;
    if (this.objAppointment.Type_Of_Loss_L == 'SENSORINEURAL' || this.objAppointment.Type_Of_Loss_L == 'MIXED') {
      this.HAYesNoListL = ['YES'];
    }
    else if(this.objAppointment.Type_Of_Loss_L == 'NORMAL'){
      this.HAYesNoListL = ['NO'];
      this.objAppointment.HA_Req_L='NO';
      this.TrialDoneOnOFF();
    }
    else {
      this.HAYesNoListL = ['YES', 'NO'];
    }
  }

  HAYesNoR() {
    this.objAppointment.HA_Req_R=undefined;
    if (this.objAppointment.Type_Of_Loss_R == 'SENSORINEURAL' || this.objAppointment.Type_Of_Loss_R == 'MIXED') {
      this.HAYesNoListR = ['YES'];
    }
    else if(this.objAppointment.Type_Of_Loss_R == 'NORMAL'){
      this.HAYesNoListR = ['NO'];
      this.objAppointment.HA_Req_R='NO';
      this.TrialDoneOnOFF()
    }
    else {
      this.HAYesNoListR = ['YES', 'NO'];
    }
  }

  TrialDoneOnOFF() {
    if (this.objAppointment.HA_Req_L === 'YES' || this.objAppointment.HA_Req_R === 'YES') {
      this.TrialDoneOpen = true;
    }
    else {
      this.TrialDoneOpen = false;
      this.objAppointment.Trial_Done = undefined;

      this.TrialUpdateOpen = false;
      this.objAppointment.EXPERIENCE_USER = undefined;
      this.objAppointment.Trial_For = undefined;

      this.MonorualOpen = false;
      this.objAppointment.Trial_For_Mono_Reason = undefined;

      this.MISSEDOpen = false;
      this.objAppointment.Trail_Missed_Reason = undefined;

      this.ProductTrialLeft = undefined;
      this.ProductTrialRight = undefined;
      this.ProductSelectLeft = undefined;
      this.ProductSelectRight = undefined;

      this.PTLList = [];
      this.PTRList = [];
      this.PSLList = [];
      this.PSRList = [];

      this.objAppointment.Trial_Restult;
    }
  }

  TrialUpdateOnOFF() {
    if (this.objAppointment.Trial_Done === 'YES') {
      this.TrialUpdateOpen = true;
    }
    else {
      this.TrialUpdateOpen = false;
      this.objAppointment.EXPERIENCE_USER = undefined;
      this.objAppointment.Trial_For = undefined;

      this.MonorualOpen = false;
      this.objAppointment.Trial_For_Mono_Reason = undefined;

      this.MISSEDOpen = false;
      this.objAppointment.Trail_Missed_Reason = undefined;

      this.ProductTrialLeft = undefined;
      this.ProductTrialRight = undefined;
      this.ProductSelectLeft = undefined;
      this.ProductSelectRight = undefined;

      this.PTLList = [];
      this.PTRList = [];
      this.PSLList = [];
      this.PSRList = [];

      this.objAppointment.Trial_Restult;
    }
  }

  MonorualOnOFF() {
    if (this.objAppointment.Trial_For == 'Monorual') {
      this.MonorualOpen = true;
    }
    else {
      this.MonorualOpen = false;
      this.objAppointment.Trial_For_Mono_Reason = undefined;
    }
  }

  MISSEDOnOFF() {
    if (this.objAppointment.Trial_Restult == 'MISSED' || this.objAppointment.Trial_Restult == 'ON TRIAL') {
      this.MISSEDOpen = true;
      this.objAppointment.Trail_Missed_Reason = undefined;
    }
    else {
      this.MISSEDOpen = false;
      this.objAppointment.Trail_Missed_Reason = undefined;
    }
  }

  addProductTrialLeft(valid: any) {
    this.PTLFormSubmitted = true;
    // console.log("addProductTrialLeft",valid);
    if (valid) {
      const GetProduct_Description = this.ProductList.filter((el: any) => Number(el.Product_ID) === Number(this.ProductTrialLeft))

      this.PTLList.push({
        Entry_ID: 0,
        Product_ID: this.ProductTrialLeft,
        Product_Description: GetProduct_Description[0].Product_Description,
        Ear_Side: 'L'
      })
      this.ProductTrialLeft = undefined;
      this.PTLFormSubmitted = false;
    }
    // console.log("PTLList",this.PTLList);
  }

  addProductTrialRight(valid: any) {
    this.PTRFormSubmitted = true;
    //  console.log("addProductTrialRight",valid);
    if (valid) {
      const GetProduct_Description = this.ProductList.filter((el: any) => Number(el.Product_ID) === Number(this.ProductTrialRight))

      this.PTRList.push({
        Entry_ID: 0,
        Product_ID: this.ProductTrialRight,
        Product_Description: GetProduct_Description[0].Product_Description,
        Ear_Side: 'R'
      })
      this.ProductTrialRight = undefined;
      this.PTRFormSubmitted = false;
    }
    //  console.log("PTRList",this.PTRList);
  }

  addProductSelectLeft(valid: any) {
    this.PSLFormSubmitted = true;
    //  console.log("addProductSelectLeft",valid);
    if (valid) {
      const GetProduct_Description = this.ProductList.filter((el: any) => Number(el.Product_ID) === Number(this.ProductSelectLeft))

      this.PSLList.push({
        Entry_ID: 0,
        Product_ID: this.ProductSelectLeft,
        Product_Description: GetProduct_Description[0].Product_Description,
        Rate_After_Discount_Left: Number(this.Rate_After_Discount_Left),
        Ear_Side: 'L'
      })
      this.ProductSelectLeft = undefined;
      this.Rate_After_Discount_Left = undefined;
      this.PSLFormSubmitted = false;
    }
    //  console.log("PSLList",this.PSLList);
  }

  addProductSelectRight(valid: any) {
    this.PSRFormSubmitted = true;
    //  console.log("addProductSelectRight",valid);
    if (valid) {
      const GetProduct_Description = this.ProductList.filter((el: any) => Number(el.Product_ID) === Number(this.ProductSelectRight))

      this.PSRList.push({
        Entry_ID: 0,
        Product_ID: this.ProductSelectRight,
        Product_Description: GetProduct_Description[0].Product_Description,
        Rate_After_Discount_Right: Number(this.Rate_After_Discount_Right),
        Ear_Side: 'R'
      })
      this.ProductSelectRight = undefined;
      this.Rate_After_Discount_Right = undefined;
      this.PSRFormSubmitted = false;
    }
    //  console.log("PSRList",this.PSRList);
  }

  deleteProductTrialLeft(index: any) {
    this.PTLList.splice(index, 1);
  }

  deleteProductTrialRight(index: any) {
    this.PTRList.splice(index, 1);
  }

  deleteProductSelectLeft(index: any) {
    this.PSLList.splice(index, 1);
  }

  deleteProductSelectRight(index: any) {
    this.PSRList.splice(index, 1);
  }

  GetDegreeLossList() {
    this.DegreeLossList = [];
    const obj = {
      "SP_String": "sp_BSHPL_Audiologist_Appo",
      "Report_Name_String": "Get_Degree_of_Loss_Dropdown"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //  console.log("Get DegreeLossList",data);
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Degree_of_Loss,
            element['value'] = element.Degree_of_Loss
        });
        this.DegreeLossList = data;
      }
      else {
        this.DegreeLossList = [];
      }
    });
  }

  GetProductList() {
    this.ProductList = [];
    const obj = {
      "SP_String": "sp_BSHPL_Audiologist_Appo",
      "Report_Name_String": "Get_Product_Dropdown"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log("Get ProductList",data);
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Description,
            element['value'] = element.Product_ID
        });
        this.ProductList = data;
      }
      else {
        this.ProductList = [];
      }
    });
  }
  GetRateLeft(proid){
    this.Rate_After_Discount_Left = undefined;
    if(proid){
      var prodetails = this.ProductList.filter(el=> el.Product_ID === proid)
      this.Rate_After_Discount_Left = prodetails[0].rate;
    }
  }
  GetRateRight(proid){
    this.Rate_After_Discount_Right = undefined;
    if(proid){
      var prodetails = this.ProductList.filter(el=> el.Product_ID === proid)
      this.Rate_After_Discount_Right = prodetails[0].rate;
    }
  }

  GetTestDoneList() {
    this.TestDoneList = [];
    const obj = {
      "SP_String": "sp_BSHPL_Audiologist_Appo",
      "Report_Name_String": "Get_Consultancy_Dropdown"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //  console.log("Get TestDoneList",data);
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Consultancy_Descr,
            element['value'] = element.Consultancy_Descr
        });
        this.TestDoneList = data;
      }
      else {
        this.TestDoneList = [];
      }
    });
  }

  GetMissedReasonList() {
    this.MissedReasonList = [];
    const obj = {
      "SP_String": "sp_BSHPL_Audiologist_Appo",
      "Report_Name_String": "Get_Missed_Reason_Dropdown"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //  console.log("Get MissedReasonList",data);
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Missed_Reason,
            element['value'] = element.Missed_Reason
        });
        this.MissedReasonList = data;
      }
      else {
        this.MissedReasonList = [];
      }
    });
  }

  actionClick_Shift(col: any) {
    if (col) {
      this.AudiologistList = [];
      this.ngxService.start();
      const getTempObj = {
        Appo_Dt: this.DateService.dateTimeConvert(new Date(col.Appo_Start)),
        Cost_Cen_ID: Number(col.Cost_Cen_ID)
      }
      //  console.log("getTempObj",getTempObj);

      const getObj = {
        "SP_String": "sp_BSHPL_Audiologist_Appo",
        "Report_Name_String": "Get_Audiologist_List",
        "Json_Param_String": JSON.stringify([getTempObj])
      }
      this.GlobalAPI.getData(getObj).subscribe((data: any) => {
        this.ngxService.stop();
        //   console.log("get audiologist data",data);
        this.objAudiologist.Foot_Fall_ID = Number(col.foot_fall_id);
        this.objAudiologist.Appo_Dt = this.DateService.dateTimeConvert(new Date(col.Appo_Start));

        if (data.length) {
          data.forEach(element => {
            element['label'] = element.Name,
              element['value'] = element.Doctor_ID
          });
          this.AudiologistList = data;
        }
        else {
          this.AudiologistList = [];
        }

        this.showPopup();
      });
    }
  }

  showPopup() {
    // console.log('pop up works');
    this.displayPopup = true;
  }

  closePopup() {
    // console.log('close up works');
    this.displayPopup = false;
    this.AudiologistList = [];
    this.objAudiologist = new Audiologist();
  }

  SaveAudiologist(valid: any) {
    //  console.log("save in progress");
    this.AudiologistFormSubmitted = true;
    if (valid) {
      this.Spinner = true;
      const SaveTempObj = {
        Appo_Dt: this.DateService.dateTimeConvert(new Date(this.objAudiologist.Appo_Dt)),
        Foot_Fall_ID: Number(this.objAudiologist.Foot_Fall_ID),
        Doctor_ID: this.objAudiologist.Doctor_ID
      }
      // console.log("SaveTempObj",SaveTempObj);
  
      const SaveObj = {
        "SP_String": "sp_BSHPL_Audiologist_Appo",
        "Report_Name_String": "Update_Audiologist_Name",
        "Json_Param_String": JSON.stringify([SaveTempObj])
      }
      this.ngxService.start();
      this.GlobalAPI.postData(SaveObj).subscribe((data: any) => {
        this.ngxService.stop();
        console.log("save data", data);

        if (data[0].Column1) {
          this.getAlldata();
          this.clearData();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Audiologist ",
            detail: "Updated "
          });
        }
        else {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail: "Error occured "
          });
        }
      });
    }
  }

  actionClick_Programming(col: any) {
    this.docno = undefined;
    if (col) {
      this.docno = col.Appo_ID;
      this.displayPopupPro = true;
      this.objProgramming.Appo_Dt = this.DateService.dateTimeConvert(new Date(col.Appo_Start));
    }
  }

  closePopupPro() {
    this.displayPopupPro = false;
    this.objProgramming = new Programming();
  }

  async SaveUpdateProgramming(valid: any) {
    this.ProgrammingFormSubmitted = true;
    if (valid) {
      this.ProSpinner = true;
      const SaveTempObjPro = {
        Appo_Dt: this.DateService.dateTimeConvert(new Date(this.objProgramming.Appo_Dt)),
        Audio_Note: this.objProgramming.Audio_Note
      }
      //  console.log("SaveTempObjPro",SaveTempObjPro);
  
      const SaveObjPro = {
        "SP_String": "sp_BSHPL_Audiologist_Appo",
        "Report_Name_String": "Update_Reprogramming",
        "Json_Param_String": JSON.stringify([SaveTempObjPro])
      }
      this.ngxService.start();
      this.GlobalAPI.postData(SaveObjPro).subscribe(async(data: any) => {
        this.ngxService.stop();
        //  console.log("save data",data);

        if (data[0].Column1) {
          await this.SaveUserActivity();
          this.getAlldata();
          this.clearData();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Reprogramming ",
            detail: "Updated "
          });
        }
        else {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail: "Error occured "
          });
        }
      });
    }
  }

  getDateRangeComplete(dateRangeObj: any) {
    if (dateRangeObj.length) {
      this.objCompletedSearch.From_Date = dateRangeObj[0];
      this.objCompletedSearch.To_Date = dateRangeObj[1];
    }
  }

  getAllCompletedData() {
    this.CompletedSeachSpinner = true
    this.ngxService.start();

    const start = this.objCompletedSearch.From_Date
      ? this.DateService.dateConvert(new Date(this.objCompletedSearch.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.objCompletedSearch.To_Date
      ? this.DateService.dateConvert(new Date(this.objCompletedSearch.To_Date))
      : this.DateService.dateConvert(new Date());
    this.objCompletedSearch.User_Id = Number(this.UserID);

    const Ctempobj = {
      start_Time: start,
      to_time: end,
      User_ID: this.objCompletedSearch.User_Id ? this.objCompletedSearch.User_Id : 0,
    
    }
    //  console.log("Ctempobj",Ctempobj);

    const obj = {
      "SP_String": "sp_BSHPL_Audiologist_Appo",
      "Report_Name_String": "Get_All_Completed",
      "Json_Param_String": JSON.stringify(Ctempobj)
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //  console.log("getAllCompletedData",data);
      this.ngxService.stop();
      this.CompletedSeachSpinner = false;

      this.CompletedAllDetalis = data;
      //  console.log('CompletedAllDetalis=====',this.CompletedAllDetalis);
      if (this.CompletedAllDetalis.length) {
        this.CompletedAllDetalisHeader = Object.keys(data[0]);
        //    console.log('CompletedAllDetalisHeader=====',this.CompletedAllDetalisHeader);
      }
    })
  }

  actionClick_ViewAppo(col: any) {
    this.PTLList = [];
    this.PTRList = [];
    this.PSLList = [];
    this.PSRList = [];
    if (col.Trial_ID) {
      this.displayPopupAppoView = true;
      const getComTempObj = {
        Trial_ID: Number(col.Trial_ID)
      }
      //  console.log("getComTempObj",getComTempObj);

      const getComObj = {
        "SP_String": "sp_BSHPL_Audiologist_Appo",
        "Report_Name_String": "Retrieve_BSHPL_Audiologist",
        "Json_Param_String": JSON.stringify([getComTempObj])
      }
      this.ngxService.start();
      this.GlobalAPI.getData(getComObj).subscribe((data: any) => {
        this.ngxService.stop();
        //  console.log("get appointment data",data);
        let EditJSON = JSON.parse(data[0].update_audiologist_details);
        //  console.log("EditJSON",EditJSON);
        let EditList = EditJSON[0];
        //  console.log("EditList",EditList);

        this.P_Name = col.Patient;
        this.Phone = Number(col.Mobile);
        this.Age = Number(col.Age);
        this.Sex = col.Sex;
        this.App_Date = this.DateService.dateTimeConvert(new Date(col.Appo_Start));
        this.CostCen_Name = col.Cost_Cen_Name;
        this.Cons_Name = col.Consultancy;

        this.objAppointment = EditList;

        if (this.objAppointment.HA_Req_L || this.objAppointment.HA_Req_R) {
          if (this.objAppointment.HA_Req_L === 'YES' || this.objAppointment.HA_Req_R === 'YES') {
            this.TrialDoneOpen = true;
          }
          else {
            this.TrialDoneOpen = false;
            this.TrialUpdateOpen = false;
          }
        }
        
        if (this.objAppointment.Trial_Done) {
          if (this.objAppointment.Trial_Done === 'YES') {
            this.TrialUpdateOpen = true;
          }
          else {
            this.TrialUpdateOpen = false;
            this.MonorualOpen = false;
            this.MISSEDOpen = false;
          }
        }

        if (this.objAppointment.Trial_For) {
          if (this.objAppointment.Trial_For == 'Monorual') {
            this.MonorualOpen = true;
          }
          else {
            this.MonorualOpen = false;
          }
        }

        if (this.objAppointment.Trial_Restult) {
          if (this.objAppointment.Trial_Restult == 'MISSED' || this.objAppointment.Trial_Restult == 'ON TRIAL') {
            this.MISSEDOpen = true;
          }
          else {
            this.MISSEDOpen = false;
          }
        }

        if (EditList.Update_Trial_Details.length) {
          if (EditList.Update_Trial_Details.length > 0) {
            for (let item of EditList.Update_Trial_Details) {
              if (item.Ear_Side == "L") {
                this.PTLList.push({
                  Product_ID: item.Product_ID,
                  Product_Description: item.Product_Description,
                  Ear_Side: item.Ear_Side
                })
              }
              if (item.Ear_Side == "R") {
                this.PTRList.push({
                  Product_ID: item.Product_ID,
                  Product_Description: item.Product_Description,
                  Ear_Side: item.Ear_Side
                })
              }
            }
            //  console.log(" PTLList", this.PTLList);
            //  console.log(" PTRList", this.PTRList);
          }
          else {
            this.PTLList = [];
            this.PTRList = [];
          }
        }

        if (EditList.Update_Select_Details.length) {
          if (EditList.Update_Select_Details.length > 0) {
            for (let item of EditList.Update_Select_Details) {
              if (item.Ear_Side == "L") {
                this.PSLList.push({
                  Product_ID: item.Product_ID,
                  Product_Description: item.Product_Description,
                  Rate_After_Discount: item.Rate_After_Discount,
                  Ear_Side: item.Ear_Side
                })
              }
              if (item.Ear_Side == "R") {
                this.PSRList.push({
                  Product_ID: item.Product_ID,
                  Product_Description: item.Product_Description,
                  Rate_After_Discount: item.Rate_After_Discount,
                  Ear_Side: item.Ear_Side
                })
              }
            }
            //  console.log(" PSLList", this.PSLList);
            //  console.log(" PSRList", this.PSRList);
          }
          else {
            this.PSLList = [];
            this.PSRList = [];
          }
        }


      });
    }
  }

  closePopupAppoView() {
    // console.log('close up works');
    this.displayPopupAppoView = false;

    this.PTLList = [];
    this.PTRList = [];
    this.PSLList = [];
    this.PSRList = [];

    this.objAppointment = new Appointment();

    this.App_Date = undefined;
    this.P_Name = undefined;
    this.Phone = undefined;
    this.Age = undefined;
    this.Sex = undefined;
    this.CostCen_Name = undefined;
    this.Cons_Name = undefined;

    this.TrialDoneOpen = false;
    this.TrialUpdateOpen = false;
    this.MonorualOpen = false;
    this.MISSEDOpen = false;
  }

  actionClick_ViewProgramming(col: any) {
    if (col.foot_fall_id) {
      this.displayPopupProView = true;
      const getProTempObj = {
        Appo_Dt: this.DateService.dateTimeConvert(new Date(col.Appo_Start)),
        Foot_Fall_ID: Number(col.foot_fall_id)
      }
      //  console.log("getProTempObj",getProTempObj);

      const getComObj = {
        "SP_String": "sp_BSHPL_Audiologist_Appo",
        "Report_Name_String": "Retrieve_Reprogramming",
        "Json_Param_String": JSON.stringify([getProTempObj])
      }
      this.GlobalAPI.getData(getComObj).subscribe((data: any) => {
        // console.log("get Retrieve_Reprogramming",data);
        let EditViewList = data[0];
        // console.log("EditViewList",EditViewList);

        this.objProgramming = EditViewList;
      })
    }
  }

  closePopupProView() {
    this.displayPopupProView = false;
    this.objProgramming = new Programming();
  }

  onConfirm() {

  }

  onReject() {
    this.compacctToast.clear("c");
  }
  onClear(e: any, file: any) {
    this.FileUploadAsset.remove(e, file);
  }
  onBasicUpload(elem: any) {
    if (elem._files.length) {
      const upfile = elem._files[0];
      if (upfile['size']) {
        this.ngxService.start();
        this.GlobalAPI.CommonFileUpload(upfile).subscribe((data: any) => {
          if (data.file_url) {
            this.objAppointment.Audiogram = data.file_url;
            this.FileUploadAsset.clear();
            this.ngxService.stop();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "File",
              detail: "Upload Successfully "
            });
          }
        })
      }
    }
  } 
  getImage(Image:any) {
    window.open(Image)
  }

  // for crystall
  UpdateAppo(col){
    this.colobj = {};
    this.clearDataAppoNo();
    if(col){
      this.colobj = col;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "TEST DONE",
        detail: ""
      });
    }
  }
  actionClick_UpdateAppoNo(col: any) {
    // console.log("actionClick_UpdateAppo");
    this.docno = undefined;
    if (col) {
      this.objAppointmentNo.Foot_Fall_ID = Number(col.foot_fall_id);
      this.objAppointmentNo.Appo_Dt = this.DateService.dateTimeConvert(new Date(col.Appo_Start));
      this.displayPopupUpdateAppoNo = true;
      // this.FileUploadAsset.clear();
      this.objAppointmentNo.Appo_ID = col.Appo_ID;
      this.docno = col.Appo_ID;
      this.P_NameNo = col.Patient;
      this.PhoneNo = Number(col.Mobile);
      this.AgeNo = Number(col.Age);
      this.SexNo = col.Sex;
      this.App_DateNo = this.DateService.dateTimeConvert(new Date(col.Appo_Start));
      this.CostCen_NameNo = col.Cost_Cen_Name;
      this.Cons_NameNo = col.Consultancy;
      this.onReject();
    }
  }
  async SaveAppointmentNo(valid: any) {
    this.AppointmentNoFormSubmitted = true;
    if (valid) {
      this.AppoNoSpinner = true;
      this.objAppointmentNo.Other_Test_done = this.objAppointmentNo.Other_Test_done ? this.objAppointmentNo.Other_Test_done.toString() : '-';

      const SaveAppObj = {
        "SP_String": "sp_BSHPL_Audiologist_Appo",
        "Report_Name_String": "Update_other_test",
        "Json_Param_String": JSON.stringify([this.objAppointmentNo])
      }
      this.ngxService.start();
      this.GlobalAPI.postData(SaveAppObj).subscribe(async (data: any) => {
        this.ngxService.stop();
        // console.log("save data",data);

        if (data[0].Column1) {
          await this.SaveUserActivity();
          this.getAlldata();
          this.clearDataAppoNo();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Test Done ",
            detail: "Updated "
          });
        }
        else {
          this.AppoNoSpinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail: "Error occured "
          });
        }
      });
      
    }
  }
  clearDataAppoNo() {
    this.displayPopupUpdateAppoNo = false;
    this.AppoNoSpinner = false;
    this.AppointmentNoFormSubmitted = false;

    this.objAppointmentNo = new AppointmentNo();

    this.App_DateNo = undefined;
    this.P_NameNo = undefined;
    this.PhoneNo = undefined;
    this.AgeNo = undefined;
    this.SexNo = undefined;
    this.CostCen_NameNo = undefined;
    this.Cons_NameNo = undefined;
  }
  closePopupAppoNo() {
    // console.log('close up works Appo');
    this.displayPopupUpdateAppoNo = false;
    this.objAppointmentNo = new AppointmentNo();

    this.App_DateNo = undefined;
    this.P_NameNo = undefined;
    this.PhoneNo = undefined;
    this.AgeNo = undefined;
    this.SexNo = undefined;
    this.CostCen_NameNo = undefined;
    this.Cons_NameNo = undefined;
  }
  clearOther_Test_done(){
    this.objAppointmentNo.Other_Test_Details = undefined;
    this.AppointmentNoFormSubmitted = false;
  }
  ViewTestDetails(col: any) {
    if (col.foot_fall_id) {
      this.displayViewTestPOP = true;
      const getProTempObj = {
        Appo_Dt: this.DateService.dateTimeConvert(new Date(col.Appo_Start)),
        Foot_Fall_ID: Number(col.foot_fall_id)
      }

      const getComObj = {
        "SP_String": "sp_BSHPL_Audiologist_Appo",
        "Report_Name_String": "Retrieve_other_test",
        "Json_Param_String": JSON.stringify([getProTempObj])
      }
      this.GlobalAPI.getData(getComObj).subscribe((data: any) => {
        let ViewTestList = data[0];

        this.ObjTestDetails = ViewTestList;
      })
    }
  }
  closedisplayViewTestPOP() {
    this.displayViewTestPOP = false;
    this.ObjTestDetails = new TestDetails();
  }
  async SaveUserActivity(){
    const result = await this._CommonUserActivity.GetUserActivity('Update','Audiologist Appo',this.docno,'0')
    console.log(result)
  }
}

class Programming{
  Audio_Note: any;
  Appo_Dt: any;
}

class Audiologist{
  Doctor_ID : any;
  Foot_Fall_ID : any;
  Appo_Dt: any;
}


class Search{
  From_Date : any;
  To_Date : any;
  User_Id : any;
}

class CompletedSearch{
  From_Date : any;
  To_Date : any;
  User_Id : any;
}

class Appointment{
  Trial_ID: any;
  Foot_Fall_ID: any;
  Trial_Date: any;
  Doctor_ID: any;
  Created_On: any;

  Test_Done:any;
  Degree_Of_Loss_L: any;
  Degree_Of_Loss_R: any;
  Type_Of_Loss_L: any;
  Type_Of_Loss_R: any;
  HA_Req_L: any;
  HA_Req_R: any;
  Trial_Done: any;
  EXPERIENCE_USER: any;
  Trial_For: any;
  Trial_For_Mono_Reason: any;
  Trial_Restult: any;
  Trail_Missed_Reason:any;
  Remarks: any;

  Update_Select_Details: any;
  Update_Trial_Details: any;

  Audiogram: any;
  Audiogram_Remarks: any;
  Final_Price_After_Disc:any;
  Trial_days:any;
}
class AppointmentNo {
  Appo_ID:any;
  Appo_Dt:any;
  Foot_Fall_ID:any;
  Other_Test_done:any;
  Other_Test_Details:any;
}
class TestDetails {
  Patient:any;
  Mobile:any;
  Age:any;
  Sex:any;
  Appo_Dt:any;
  Cost_Cen_Name:any;
  Consultancy:any;
  Other_Test_done:any;
  Other_Test_Details:any;
}
