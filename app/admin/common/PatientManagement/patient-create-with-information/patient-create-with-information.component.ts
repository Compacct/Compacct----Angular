import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-patient-create-with-information',
  templateUrl: './patient-create-with-information.component.html',
  styleUrls: ['./patient-create-with-information.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class PatientCreateWithInformationComponent implements OnInit {
  tabIndexToView: number = 0;
  Items: any = [];
  buttonname = 'Create';
  userID: string = '';
  allDataList: any = [];
  CreationFormSubmited: boolean = false;
  Spinner: boolean = false;
  listNamePrefix: any = [];
  countryList: any = [];
  stateList: any = [];
  districtList: any = [];
  enqSourceList: any = [];
  refDoctorList: any = [];
  objPatient = new Patient();
  occptionList: any = [];
  databaseName; any = undefined;
  ContactNameList:any = [];
  footFallId:any = undefined;
  Date_Of_Birth:any;
  Date =  new Date();
  editDocNo: any;
  editlist:any = [];
  ExposureNoisedisabled: boolean = false;

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private $http: HttpClient
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Patient Creation",
      Link: "PatientManagement --> Clinic --> Create Patient Form Branch"
    });
    this.Items = ["BROWSE", "CREATE"];
    this.userID = this.commonApi.CompacctCookies.User_ID;
    this.listNamePrefix = ['Mr', 'Mrs', 'Miss', 'Ms', 'Sir', 'Dr', 'Master', 'Srimati', 'Baby', 'Baby Of'];
    this.getBrowseData();
    this.getCountryList();
    this.getSateList();
    this.getEnqSource();
    this.getRefDoctor();
    this.getOcption();
    this.DataBaseCheck();

  }

  checkMobile(mobile: any,field:any) {
    this.ContactNameList = []
    //console.log(mobile);
    if (mobile.length == 10) {
      
      //console.log('10 digit Complete')
      this.$http.get(`/Hearing_BL_CRM_Appointment/Get_Name_From_Mobile_Hearing?Mobile=` + mobile).subscribe((data: any) => {
        if (data.length) {
         
          if(this.databaseName == 'BSHPL'){
              console.log(data);
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Mobile Number Already Exist",
          });
          this.objPatient[field] = undefined
          }
          else {
            this.ContactNameList = JSON.parse(data)
          }
         
        }
      })
    }
  }
  NameChange(){
    this.objPatient.Prefix = undefined
    this.objPatient.Contact_Name = undefined
    if(this.footFallId && this.databaseName != 'BSHPL'){
      const ContactNameListFilter = this.ContactNameList.Filter((el:any)=> el.Foot_Fall_ID == this.footFallId )
      if(ContactNameListFilter.length){
        this.objPatient.Prefix = ContactNameListFilter[0].Prefix
        this.objPatient.Contact_Name = ContactNameListFilter[0].Contact_Name
      }
    }
   
  }
  getCountryList() {
    this.$http.get(`/Common/Get_Country_List`).subscribe((data: any) => {
      let CountryList = JSON.parse(data);
      //console.log('Country List ==>', CountryList);
      this.countryList = CountryList
    });
  }

  getSateList() {
    this.$http.get(`/Common/Get_State_List`).subscribe((data: any) => {
      //console.log(data);
      //console.log('State List==>', data);
      this.stateList = data
    });
  }

  getDistrictList(State: any) {
    this.districtList = [];
    this.objPatient.District = undefined;
    //console.log('District works', State);
    if(State){
    this.$http.get(`/Common/Get_District_List?StateName=` + State).subscribe((data: any) => {
      //console.log(data);
      this.districtList = data;
    });
    }
  }
  ExposureNoisechange(data){
    if(data === "No") {
      this.ExposureNoisedisabled = true;
      this.objPatient.Duration_Of_Exposure = undefined;
    }
    else {
      this.ExposureNoisedisabled = false;
      this.objPatient.Duration_Of_Exposure = undefined;
    }
  }

  getEnqSource() {
    this.$http.get(`/DIPL_CRM_Lead/Get_Enq_Source`).subscribe((data: any) => {
      //console.log('Enq src List==>', data);
      this.enqSourceList = data
    });
  }

  getRefDoctor() {
    this.$http.get(`/BL_Enq_Source_Sub_Master/Get_All_Data_for_Ref_Doctor`).subscribe((data: any) => {
      let RefList = JSON.parse(data);
      RefList.forEach((ele: any) => {
        this.refDoctorList.push({
          "label": ele.Enq_Source_Sub_Name,
          "value": ele.Enq_Source_Sub_ID
        })
      })
      //console.log('ref Doctor List List==>', this.refDoctorList);
    });
  }

  saveDocAppo(valid: any) {
    this.CreationFormSubmited = true;
    if (valid) {
      this.CreationFormSubmited = false;
      this.objPatient.Cost_Cen_ID = this.commonApi.CompacctCookies.Cost_Cen_ID;
      this.objPatient.User_ID = this.userID;
      this.objPatient.Registration_Date = this.DateService.dateConvert(new Date(this.Date));
      this.objPatient.Date_Of_Birth = this.Date_Of_Birth ? this.DateService.dateConvert(new Date(this.Date_Of_Birth)) : "";
      
      //console.log(this.objPatient);
      this.Spinner = true;
      if(this.editDocNo){
        const obj = {
          "SP_String": "SP_BL_Txn_Patient_Create_With_Information",
          "Report_Name_String": "Update_Patient_Information",
          "Json_Param_String": JSON.stringify(this.objPatient),
        }
  
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          if (data[0].Column1) {
            this.Spinner = false;
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Patient Create",
              detail: "Succesfully "
            });
            this.tabIndexToView = 0;
            this.clearData();
            this.getBrowseData();
          }
          else {
            this.Spinner = false;
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message ",
              detail: "Error occured "
            });
          }
        });
      } else {
      const obj = {
        "SP_String": "SP_BL_Txn_Patient_Create_With_Information",
        "Report_Name_String": "Create_Patient_Information",
        "Json_Param_String": JSON.stringify(this.objPatient),
      }

      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.Spinner = false;
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Patient Create",
            detail: "Succesfully "
          });
          this.tabIndexToView = 0;
          this.clearData();
          this.getBrowseData();
        }
        else {
          this.Spinner = false;
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail: "Error occured "
          });
        }
      });
    }
    }
  }

  getBrowseData() {
    const obj = {
      "SP_String": "SP_BL_Txn_Patient_Create_Branch",
      "Report_Name_String": "Get_Patient_Branch",
      "Json_Param_String": JSON.stringify({ User_ID: this.userID }),
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //console.log('Browse Data==>', data);
      this.allDataList = data;
    })
  }

  getAddressOnChange(e) {
    this.objPatient.Location = undefined;
    //console.log(e);
    if (e) {
      this.objPatient.Location = e;
    }
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.Items = ["BROWSE", "CREATE"];
    this.buttonname = 'Create';
    this.clearData();

  }
  getOcption() {
    this.occptionList = [];
     const obj = {
      "SP_String": "SP_BL_Txn_Patient_Create_Branch",
      "Report_Name_String": "Get_Patient_Occupation",
      "Json_Param_String": JSON.stringify({ User_ID: this.userID }),
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //console.log('Browsesfs Data==>', data);
      this.occptionList = data;
    })
  }
  DataBaseCheck() {
    this.$http.get("/Common/Get_Database_Name",
        {responseType: 'text'})
        .subscribe((data: any) => {
          this.databaseName = data;
          //console.log(data) BSHPL
        });
        //this.databaseName = 'BSHPL'
  }
  PrintClick(print:any) {
    if (print.Foot_Fall_ID) {
    const obj = {
        "SP_String": "SP_BL_Txn_Patient_Create_Branch",
        "Report_Name_String": "Get_Patient_Print",
        "Json_Param_String": JSON.stringify([{Foot_Fall_ID :print.Foot_Fall_ID}]),
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => { 
        //console.log('printdat ', data)
        window.open(data[0].Column1 +print.Foot_Fall_ID, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500')
      })
  } 
  }

  clearData() {
    this.objPatient = new Patient();
    this.districtList = [];
    this.CreationFormSubmited = false;
    this.Spinner = false;
    this.objPatient.Country = "India";
    this.ContactNameList = [];
    this.Date = new Date();
    this.Date_Of_Birth = undefined;
    this.editDocNo = undefined;
  }

  onConfirm() {
  }

  onReject() {
    this.CompacctToast.clear("c");
  }
  Edit(col){
    this.clearData();
    this.editDocNo = undefined;
    if(col.Foot_Fall_ID){
      this.editDocNo = col.Foot_Fall_ID;
      this.tabIndexToView = 1;
      this.Items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.getedit(col.Foot_Fall_ID);
     }
  }
  getedit(Dno){
    this.editlist = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Patient_Create_With_Information",
      "Report_Name_String": "Get_Patient_Information",
      "Json_Param_String": JSON.stringify([{Foot_Fall_ID : Dno}])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editlist = data;
      console.log("Edit data",data);
      this.objPatient = data[0];
      var district = data[0].District;
      this.Date_Of_Birth = new Date(data[0].Date_Of_Birth);
      this.getDistrictList(data[0].State);
      this.objPatient.District = district;
    })
  }

}

class Patient {
  Cost_Cen_ID: any;
  User_ID: any;
  Reference_No: any;	
  Registration_Date: any;	
  Mobile: any;
  Mobile_2: any;
  Mobile_3_WP: any;
  Prefix: any;
  Contact_Name: any;
  Age: any;
  Date_Of_Birth: any;
  Age_Unit: any;
  Gender: any;
  Email: any;
  Address: any;
  Location: any;
  Landmark: any;
  State: any;
  District: any;
  Country: any;
  Pin: any;
  Occupation: any;
  Enq_Source_ID: any;
  Enq_Source_Sub_ID: any;
  Consultancy_Type: any;
  Who_has_accompanied_you: any;
  Reason_for_visiting_Today: any;
  Present_Complaints:any;
  Duration_Years: any;
  Duration_Months: any;
  Nature_Of_Hearing_Problem: any;
  Tinnitus_Right: any;
  Tinnitus_Left: any;
  Ear_Discharge_Right: any;
  Ear_Discharge_Left: any;
  Ear_Pain_Right: any;
  Ear_Pain_Left: any;
  Giddiness_Vertigo: any;
  Blocking_Sensation: any;
  Exposure_To_Noise: any;
  Duration_Of_Exposure: any;
  Previous_ENT_Report: any;
  Surgical_History: any;
  Medications: any;
  Better_Ear: any;
  Family_History: any;
  Current_Present_HA: any;
  Hearing_Aid_Difficulties: any;
  Listening_Activities: any;	
  Impact_Of_Hearing_Difficulty: any;
  Type_Of_Work: any;
  Meeting_Group_Activities: any;
  Impact_Difficulty_Patient: any;	
  Persons_Influenced: any;	
  Patient_Signature: any;
}
