import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-patient-create-brunch',
  templateUrl: './patient-create-brunch.component.html',
  styleUrls: ['./patient-create-brunch.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class PatientCreateBrunchComponent implements OnInit {

  tabIndexToView: number = 0;
  Items: any = [];
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
      Link: "PatientManagement -->Clinic --> Patient Creation"
    });
    this.Items = ["BROWSE", "CREATE"];
    this.userID = this.commonApi.CompacctCookies.User_ID;
    this.listNamePrefix = ['Mr', 'Mrs', 'Miss', 'Ms', 'Sir', 'Dr', 'Master', 'Srimati', 'Baby', 'Baby Of'];
    this.getBrowseData();
    this.getCountryList();
    this.getSateList();
    this.getEnqSource();
    this.getRefDoctor();

  }

  checkMobile(mobile: any) {
    //console.log(mobile);
    if (mobile.length == 10) {
      //console.log('10 digit Complete')
      this.$http.get(`/Hearing_BL_CRM_Appointment/Get_Name_From_Mobile_Hearing?Mobile=` + mobile).subscribe((data: any) => {
        if (data.length) {
          //console.log(data);
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Mobile Number Already Exist",
          });
          this.objPatient.Mobile = undefined;
        }
      })
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
    this.districtList = undefined;
    this.objPatient.District = undefined;
    //console.log('District works', State);
    this.$http.get(`/Common/Get_District_List?StateName=` + State).subscribe((data: any) => {
      //console.log(data);
      this.districtList = data;
    });
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
      this.objPatient.Posted_On = this.DateService.dateTimeConvert(new Date());
      this.objPatient.Date_Of_Birth = null;
      this.objPatient.Status = null;
      this.objPatient.Next_Followup = null;
      this.objPatient.Followup_Remarks = null;
      this.objPatient.Is_Visiable = "Y";
      this.objPatient.Lead_Status = "Registered";
      this.objPatient.Problem_Details = null;
      this.objPatient.Marketing_Executive = null;
      this.objPatient.Customer_Type = "First time HA user";
      this.objPatient.Previous_Company = null;
      this.objPatient.Customer_Choice = "Mid Budget";
      this.objPatient.Chance_Buy = "Within 5 days";
      this.objPatient.Prefered_Location = "Clinic";
      this.objPatient.Details_Problem_Observerd = "";
      this.objPatient.Reference_Patient_ID = null;

      //console.log(this.objPatient);
      this.Spinner = true;
      const obj = {
        "SP_String": "SP_BL_Txn_Patient_Create_Branch",
        "Report_Name_String": "insert_Patient_From_Branch",
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
    this.clearData();

  }

  clearData() {
    this.objPatient = new Patient();
    this.districtList = [];
    this.CreationFormSubmited = false;
    this.Spinner = false;
    this.objPatient.Country = "India";
  }

  onConfirm() {
  }

  onReject() {
  }

}

class Patient {
  Cost_Cen_ID: any;
  User_ID: any;
  Posted_On: any;
  Mobile: any;
  Mobile_2: any;
  Mobile_3_WP: any;
  Prefix: any;
  Contact_Name: any;
  Gender: any;
  Date_Of_Birth: any;
  Age: any;
  Address: any;
  Location: any;
  District: any;
  State: any;
  Country: any;
  Pin: any;
  Enq_Source_ID: any;
  Status: any;
  Next_Followup: any;
  Followup_Remarks: any;
  Is_Visiable: any;
  Lead_Status: any;
  Enq_Source_Sub_ID: any;
  Problem_Details: any;
  Marketing_Executive: any;
  Customer_Type: any;
  Previous_Company: any;
  Customer_Choice: any;
  Chance_Buy: any;
  Prefered_Location: any;
  Details_Problem_Observerd: any;
  Consultancy_Type: any;
  Reference_Patient_ID: any;
  Age_Unit: any;

  Occupation: any;
  accompanied: any;
  Reason_visit: any;
}
