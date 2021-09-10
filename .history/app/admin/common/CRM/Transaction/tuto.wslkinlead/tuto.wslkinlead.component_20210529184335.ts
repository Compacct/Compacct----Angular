import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';

@Component({
  selector: 'app-tuto.wslkinlead',
  templateUrl: './tuto.wslkinlead.component.html',
  styleUrls: ['./tuto.wslkinlead.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoWslkinleadComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  Classlist = [];
  StateList = [];
  DistrictList = [];
  buttonname = "Create";
  Spinner = false;
  LeadcreationFormSubmitted = false;
  LeadList = [];
  BackupLeadList = [];
  from_date:any;
  to_date:any;
  seachSpinner = false;
  ObjLeadcreation: Leadcreation = new Leadcreation();

  DistRegistered =[];
  SelectedDistRegistered =[];
  DistSubscribed =[];
  SelectedDistSubscribed =[];
  searchFields =[];
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Walk In Lead",
      Link: " Channel Sale -> Walk In Lead"
    });
    this.getClasslist();
    this.GetStateList();
    this.AllLeadList();
  }


  TabClick(e){
    console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();

  }

  AllLeadList(){

  }


 // FOR SEARCH
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.from_date = dateRangeObj[0];
      this.to_date = dateRangeObj[1];
    }
  }
  Searchlead(){
   // this.seachSpinner = true;
   this.DistRegistered =[];
  this.SelectedDistRegistered =[];
  this.DistSubscribed =[];
  this.SelectedDistSubscribed =[];
  this.searchFields =[];
    const tempObj = {
      start_date: this.from_date  ? this.DateService.dateConvert(new Date(this.from_date))
      : this.DateService.dateConvert(new Date()),
      end_date : this.to_date  ? this.DateService.dateConvert(new Date(this.to_date))
      : this.DateService.dateConvert(new Date())
    }
    const obj = {
      "SP_String": "Tutopia_walk_in_lead_SP",
      "Report_Name_String": "Walk In Lead Browse",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log(data);
      this.LeadList = data;
      this.BackupLeadList = data;
      this.seachSpinner = false;
    })

  }
  GetDistinct() {
    let DRegistered = [];
    let DSubscribed = [];
    this.DistRegistered =[];
  this.SelectedDistRegistered =[];
  this.DistSubscribed =[];
  this.SelectedDistSubscribed =[];
  this.searchFields =[];
    this.LeadList.forEach((item) => {
      if (DRegistered.indexOf(item.Registered) === -1) {
        DRegistered.push(item.Registered);
        this.DistRegistered.push({ label: item.Registered, value: item.Registered });
      }
      if (DSubscribed.indexOf(item.Subscribed) === -1) {
        DSubscribed.push(item.Subscribed);
        this.DistSubscribed.push({ label: item.Subscribed, value: item.Subscribed });
      }
    });
    this.BackupLeadList = [...this.LeadList];
  }
  FilterDist() {
    let DRegistered = [];
    let DSubscribed = [];
    this.searchFields = [];
    if (this.SelectedDistRegistered.length) {
      this.searchFields.push('Registered');
      DRegistered = this.SelectedDistRegistered;
    }
    if (this.SelectedDistSubscribed.length) {
      this.searchFields.push('Subscribed');
      DSubscribed = this.SelectedDistSubscribed;
    }
    this.LeadList = [];
    if (this.searchFields.length) {
      let LeadArr = this.BackupLeadList.filter(function (e) {
        return (DRegistered.length ? DRegistered.includes(e['Registered']) : true)
        && (DSubscribed.length ? DSubscribed.includes(e['Subscribed']) : true)
      });
      this.LeadList = LeadArr.length ? LeadArr : [];
    } else {
      this.LeadList = this.BackupLeadList;
    }
  }

  getClasslist() {
    this.$http
      .get("Tutopia_Walk_in_Lead_Creation/Get_Class_details")
      .subscribe((data: any) => {
        this.Classlist = data ? JSON.parse(data) : [];
      });
  }
  GetStateList() {
    this.$http
      .get("/Master_Cost_Center_V2/Get_State")
      .subscribe((data: any) => {
        this.StateList = data ? JSON.parse(data) : [];
      });
  }
  GetDistrictList() {
    this.$http
      .get("/Master_Cost_Center_V2/Get_District")
      .subscribe((data: any) => {
        this.DistrictList = data ? JSON.parse(data) : [];
      });
  }
  StateChange(statename) {
    console.log("statename =", statename);
    this.$http
      .get("/Master_Cost_Center_V2/Get_District?statename=" + statename)
      .subscribe((data: any) => {
        this.DistrictList = data ? JSON.parse(data) : [];
        console.log("DistrictList  =", this.DistrictList);
      });
  }
  stateDistrictChange(pin) {
    if (pin.length === 6) {
      this.$http
        .get("/Master_Cost_Center_V2/Get_State_District_Against_PIN?PIN=" + pin)
        .subscribe((data: any) => {
          const StateDisList = data ? JSON.parse(data) : [];
          this.StateChange(StateDisList[0].statename);
          this.ObjLeadcreation.State = StateDisList[0].statename;
          this.ObjLeadcreation.District = StateDisList[0].Districtname;
        });
    }
  }
  save(valid){
    this.LeadcreationFormSubmitted = true;
    if(valid) {
      this.Spinner = true;
      this.ObjLeadcreation.User_ID = this.$CompacctAPI.CompacctCookies.User_ID.toString();
      const obj = {
        "SP_String": "Tutopia_walk_in_lead_SP",
        "Report_Name_String": "Walk In Lead Create",
        "Json_1_String": JSON.stringify([this.ObjLeadcreation])
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Success === 'True') {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "LEAD ID : " + data[0].Foot_Fall_ID,
            detail:  "Succesfully Created"
          });
          this.Searchlead();
          this.Spinner = false;
        } else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
          this.Spinner = true;
        }
      })
      this.clearData();
    }

    console.log(this.ObjLeadcreation);

  }
  clearData() {

    this.LeadcreationFormSubmitted = false;
    this.seachSpinner = false;
    this.Spinner = false;

    this.ObjLeadcreation = new Leadcreation();
    this.ObjLeadcreation.Country_Code = "India";




    //this.ObjCostcenter.Cost_Cen_ID = this.tmp_Cost_Cen_ID;
  }
}



class Leadcreation {
  User_ID = 0;
  Country_Code = 'IN';
  Mobile: number;
  Mobile_Whatsup = '';
  Contact_Name: string;
  School = '';
  Class_ID: any;
  Address = '';
  City: any;
  Pin: string;
  State: string;
  District: string;


}
