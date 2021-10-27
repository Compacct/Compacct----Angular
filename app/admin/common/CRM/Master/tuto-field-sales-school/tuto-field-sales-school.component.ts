import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-tuto-field-sales-school',
  templateUrl: './tuto-field-sales-school.component.html',
  styleUrls: ['./tuto-field-sales-school.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoFieldSalesSchoolComponent implements OnInit {
  tabIndexToView =0;
  seachSpinner = false;
  ObjSchoolFiels : SchoolFiels = new SchoolFiels ();
  CreateFormSubmitted = false;
  Schoolbrowselist = [];
  BackupSchoolbrowselist = [];
  Showlist = [];
  CreateAndEditPopup = false;
  Districtlist = [];
  Distributorlist = [];
  ASPNamelist = [];
  DistPinCode = [];
  SelectedDistPinCode = [];
  DistDistributorName = [];
  SelectedDistDistributorName = [];
  DistASPName = [];
  SelectedDistASPName = [];
  SearchFields = [];
  memberid : number;
  buttonname = "Save";

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private router : Router,
    private route: ActivatedRoute,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Field Sales School ",
      Link: " CRM -> Field Sales School "
    });
    this.GetSchoolDetails();
    this.GetDistrict();
    this.GetDistributor();
    // this.getdataforexcel();
    // this.GetBrand();
    // this.GetIndentDate();
  }
  TabClick(e){}

  GetSchoolDetails(){
    const obj = {
      "SP_String": "Tutopia_Field_Sales_School",
      "Report_Name_String": "GET_School_List",
     // "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Schoolbrowselist = data;
       this.BackupSchoolbrowselist = data;
       this.GetDistinct();
     console.log("Schoolbrowse list======",this.Schoolbrowselist);
   });
  }
  // DISTINCT & FILTER
  GetDistinct() {
    let DPinCode = [];
    let DDistributorName = [];
    let DASPName = [];
    this.DistPinCode =[];
    this.SelectedDistPinCode =[];
    this.DistDistributorName =[];
    this.SelectedDistDistributorName =[];
    this.DistASPName =[];
    this.SelectedDistASPName =[];
    this.SearchFields =[];
    this.Schoolbrowselist.forEach((item) => {
   if (DPinCode.indexOf(item.School_PIN) === -1) {
    DPinCode.push(item.School_PIN);
   this.DistPinCode.push({ label: item.School_PIN, value: item.School_PIN });
   }
  if (DDistributorName.indexOf(item.Distributor_ID) === -1) {
    DDistributorName.push(item.Distributor_ID);
    this.DistDistributorName.push({ label: item.Distributor_Name, value: item.Distributor_ID });
    }
    if (DASPName.indexOf(item.Shift_ID) === -1) {
      DASPName.push(item.ASP_ID);
      this.DistASPName.push({ label: item.ASP_Name, value: item.ASP_ID });
      }
  });
     this.BackupSchoolbrowselist = [...this.Schoolbrowselist];
  }
  FilterDist() {
    let DPinCode = [];
    let DDistributorName = [];
    let DASPName = [];
    this.SearchFields =[];
  if (this.SelectedDistPinCode.length) {
    this.SearchFields.push('School_PIN');
    DPinCode = this.SelectedDistPinCode;
  }
  if (this.SelectedDistDistributorName.length) {
    this.SearchFields.push('Distributor_ID');
    DDistributorName = this.SelectedDistDistributorName;
  }
  if (this.SelectedDistASPName.length) {
    this.SearchFields.push('ASP_ID');
    DASPName = this.SelectedDistASPName;
  }
  this.Schoolbrowselist = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupSchoolbrowselist.filter(function (e) {
      return (DPinCode.length ? DPinCode.includes(e['School_PIN']) : true)
      && (DDistributorName.length ? DDistributorName.includes(e['Distributor_ID']) : true)
      && (DASPName.length ? DASPName.includes(e['ASP_ID']) : true)
    });
  this.Schoolbrowselist = LeadArr.length ? LeadArr : [];
  } else {
  this.Schoolbrowselist = [...this.BackupSchoolbrowselist] ;
  }
  }
  CreatePopup(){
    this.ObjSchoolFiels = new SchoolFiels();
    this.ASPNamelist = [];
    this.CreateAndEditPopup = true;
    this.buttonname = "Save";
  }
  GetDistrict(){
    const obj = {
      "SP_String": "Tutopia_Field_Sales_School",
      "Report_Name_String": "GET_DISTRICT_LIST",
     // "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Districtlist = data;
    // console.log("District list======",this.Districtlist);
   });
  }
  GetDistributor(){
    const obj = {
      "SP_String": "Tutopia_Field_Sales_School",
      "Report_Name_String": "GET_Distributor_List",
     // "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Distributorlist = data;
    // console.log("Distributor list======",this.Distributorlist);
   });
  }
  GetASPName(){
    //this.ObjSchoolFiels.Distributor = undefined;
    const TempObj = {
      Intro_Member_ID : this.ObjSchoolFiels.Distributor
    }
    const obj = {
      "SP_String": "Tutopia_Field_Sales_School",
      "Report_Name_String": "GET_ASP_List",
      "Json_1_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ASPNamelist = data;
    // console.log("ASPName list======",this.ASPNamelist);
   });
  }
  // SAVE & EDIT
  SaveCreateAndEdit(valid){
    if (this.buttonname === "Save") {
    this.CreateFormSubmitted = true;
    let tempArr =[];
    const TempObj = {
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID
    }
    tempArr.push({...this.ObjSchoolFiels,...TempObj})
  console.log(tempArr)
    if (valid){
    const obj = {
      "SP_String": "Tutopia_Field_Sales_School",
      "Report_Name_String": "CREATE_SCHOOL",
      "Json_1_String": JSON.stringify(tempArr)
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log(data);
      //var tempID = data[0].Column1;
      if(data[0].Column1) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          //summary: "Return_ID  " + tempID,
          detail:  "Succesfully Created"
        });
        //this.Searchlead();
        this.seachSpinner = false;
        this.CreateFormSubmitted = false;
        this.ObjSchoolFiels = new SchoolFiels();
       //this.clearData();
       this.GetSchoolDetails();
      } else{
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
       // this.Spinner = true;
      }
    })
  }
  // console.log(this.ObjCreateUser);
  } else {
    this.CreateFormSubmitted = true;
    let tempArr =[];
    const TempObj = {
      Member_ID : this.memberid,
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID
    }
    tempArr.push({...this.ObjSchoolFiels,...TempObj})
  console.log(tempArr)
    if (valid){
    const obj = {
      "SP_String": "Tutopia_Field_Sales_School",
      "Report_Name_String": "Edit_SCHOOL",
      "Json_1_String": JSON.stringify(tempArr)
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log(data);
      //var tempID = data[0].Column1;
      if(data[0].Column1) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          //summary: "Return_ID  " + tempID,
          detail:  "Succesfully Updated"
        });
        //this.Searchlead();
        this.seachSpinner = false;
        this.CreateFormSubmitted = false;
        this.ObjSchoolFiels = new SchoolFiels();
        this.CreateAndEditPopup = false;
       //this.clearData();
       this.GetSchoolDetails();
      } else{
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
       // this.Spinner = true;
      }
    })
  }
  // console.log(this.ObjCreateUser);
  }
  }
  Edit(memberid){
    this.ObjSchoolFiels = new SchoolFiels();
    this.ASPNamelist = [];
    //this.clearData();
    if(memberid.Member_ID){
    this.memberid = memberid.Member_ID;
    this.CreateAndEditPopup = true;
    this.buttonname = "Update";
    this.ObjSchoolFiels.Member_Name = memberid.School_Name;
    this.ObjSchoolFiels.PIN_Code = memberid.School_PIN;
    this.ObjSchoolFiels.District = memberid.District;
    this.ObjSchoolFiels.School_Location = memberid.School_Location;
    this.ObjSchoolFiels.School_Address = memberid.School_Address;
    this.GetDistributor();
    this.ObjSchoolFiels.Distributor = memberid.Distributor_ID;
    this.GetASPName();
    this.ObjSchoolFiels.Intro_Member_ID = memberid.ASP_ID;
    // console.log("Edit Distributor ==", this.ObjSchoolFiels.Distributor);
    // console.log("Edit Asp ==", this.ObjSchoolFiels.Intro_Member_ID);
    //this.getadvorderdetails(this.Objcustomerdetail.Bill_No);
  }
  }

}
class SchoolFiels {
  Member_Name : string;
  PIN_Code : number;
  District : string;
  School_Location : string;
  School_Address : string;
  Distributor : string;
  Intro_Member_ID : number;
}
