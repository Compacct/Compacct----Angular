import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-master-company',
  templateUrl: './master-company.component.html',
  styleUrls: ['./master-company.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MasterCompanyComponent implements OnInit {
  urlService = window["config"];
  tabIndexToView = 0;
  items = [];
  seachSpinner = false;
  saveSpinner = false;
  Spinner = false;
  buttonname = 'Create';
  pass = undefined;
  MasterCompanyFormSubmit = false;
  CountryList = [];
  objcompany:company = new company();
  StateDistrictList:any = [];
  AllData =[];
  can_popup = false;
  act_popup = false;
  masterCompanyId: number;
  companyId : number ;
  menuList=[];
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = 'Create';
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Deactive", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Master Company",
      Link: "Financial Management --> Master -> Master Comapny"
    });
    this.GetBrowse();
    this.getCountry();
    
      
    
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.ClearData();
  }
  ClearData(): void{
  this.objcompany = new company()
  this.MasterCompanyFormSubmit = false;
  this.companyId = undefined;
  }
  GetBrowse(){
    const obj = {
      "SP_String": "sp_UR_Master_Company",
      "Report_Name_String": "Browse_Company_Master"
    }
    this.GlobalAPI.postData(obj).subscribe((data) => {
      this.AllData = data;
      console.log("GetBrowseList===",data); 
    });
  }
  saveData(valid:any){
    console.log("savedata==",this.objcompany);
    this.MasterCompanyFormSubmit = true;
    if(valid){
      console.log("company Id==",this.companyId);
      let msg = this.companyId ? "Update" : "Create"
      if(this.companyId === this.objcompany.Company_ID){
        this.objcompany.Company_ID = this.companyId ? Number(this.companyId) : 0;
        this.objcompany.From_Email_ID = this.objcompany.From_Email_ID;
        
        const obj = {
          "SP_String": "sp_UR_Master_Company",
          "Report_Name_String": this.companyId ? 'Update_Company_Master' : 'Create_Company_Master',
          "Json_Param_String": JSON.stringify([this.objcompany]) 
         }
         this.GlobalAPI.postData(obj)
         .subscribe((data:any)=>{
          console.log("data ==",data);
          if (data[0].Company_ID || data[0].Done){
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "User Succesfully " +msg,
              detail: "Succesfully " +msg
            });
            }
            this.Spinner = false;
            this.GetBrowse();
            this.companyId = undefined;
            this.tabIndexToView = 0;
            this.MasterCompanyFormSubmit = false;
            this.objcompany = new company();
          });
      }
      else{
        console.error("error Data")
      }
        
    }

  }
  stateDistrictChange(pin){
   if(pin.length === 6){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_State_District_Dropdown",
      'Json_Param_String':JSON.stringify([{Pincode : pin}])   
    }
    this.GlobalAPI.postData(obj).subscribe((data) => {
      this.StateDistrictList = data;
      console.log("StateName",data[0].StateName);
      this.objcompany.State = data[0].StateName;
      this.objcompany.District = data[0].DistrictName;
   
    });
   } 
   else{
    this.objcompany.State = undefined;
    this.objcompany.District = undefined;
   }
  }
  getCountry(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Country_Dropdown"
    }
    this.GlobalAPI.postData(obj).subscribe((data) => {
      this.CountryList = data;
      console.log("CountryList",this.CountryList); 
    });
  }
  EditCompany(company:any){
    if (company.Company_ID) {
      this.companyId = undefined;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.ClearData();
      this.companyId = company.Company_ID;
      this.GetEditMasterCompany(company.Company_ID);
     }  
  }
  GetEditMasterCompany(Uid){
    const obj = {
      "SP_String": "sp_UR_Master_Company",
      "Report_Name_String":"Get_Company_Master",
      "Json_Param_String": JSON.stringify([{Company_ID : Uid}]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("data",data);
      this.objcompany = data[0];
      this.pass = data[0].Password;
      this.stateDistrictChange(Uid.pin);
      this.getCountry();
     })
  }
 Active(masterCompany:any){
  this.masterCompanyId = undefined ;
   if(masterCompany.Company_ID){
    this.can_popup = false;
    this.act_popup = true;
     this.masterCompanyId = masterCompany.Company_ID ;
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "c",
       sticky: true,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
   }
  }
  onConfirm(){ 
    console.log("onconform==",this.objcompany)
      if(this.masterCompanyId){
        const obj = {
          "SP_String": "sp_UR_Master_Company",
          "Report_Name_String": "Active_Company_Master",
          "Json_Param_String": JSON.stringify([{Company_ID : this.masterCompanyId}])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          // console.log("del Data===", data[0].Column1)
          if (data[0].Column1 === "Done"){
  
            this.onReject();
            this.GetBrowse();
           //this.can_popup = false;
           this.act_popup = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "User Id: " + this.masterCompanyId.toString(),
              detail: "Succesfully Activated"
            });
           }
        })
      }
     // this.ParamFlaghtml = undefined;
  }
  Deactive(masterCompany:any){
    this.masterCompanyId = undefined ;
    if(masterCompany.Company_ID){
      this.can_popup = true;
      this.act_popup = false;
      this.masterCompanyId = masterCompany.Company_ID;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
 }
  onConfirm2(){
    console.log(this.objcompany.Company_ID)
      if(this.masterCompanyId){
        const obj = {
          "SP_String": "sp_UR_Master_Company",
          "Report_Name_String": "Deactive_Company_Master",
          "Json_Param_String": JSON.stringify([{Company_ID : this.masterCompanyId}])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          // console.log("del Data===", data[0].Column1)
          if (data[0].Column1 === "Done"){
            this.onReject();
            this.GetBrowse();
            this.can_popup = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Product Id: " + this.masterCompanyId.toString(),
              detail: "Succesfully Deactivated"
            });
          }
        })
      }
      //this.ParamFlaghtml = undefined;
  }
  
  onReject(){
    this.compacctToast.clear("c");
  }
}

class company{
  Company_ID:any;
  Company_Name:any;
   Mailing_Name:any; 
   Mailing_Address_1 :any;
   Mailing_Address_2  :any;
   District :any;
   State :any;
   Country :any;
   Pin :any;
   Phone :any;
   Email :any; 
   Currency_Symbol :any;
   Currency_Formal_Name :any; 
   Decimal_Position :any;
   Company_Prefix :any;
   VAT_CST_GST:any;
   From_Email_ID :any;
   From_Email_Name :any;
   From_Email_Pass :any;
   From_SMTP  :any;
   From_SMTP_Port :any;
   From_SSL :any;
   CIN :any;
   SMS_Gateway :any;
   Logo_Img :any
   Is_Active	:any = "Y"
}
 