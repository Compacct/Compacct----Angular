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
  buttonName = 'Create';
  GetAllDataList = [];
  MasterCompanyFormSubmit = false;
  CountryList = [];
  objcompany:company = new company();
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
    this.buttonName = 'Create';
    this.Header.pushHeader({
      Header: "Master Company",
      Link: "Financial Management --> Master -> Master Comapny"
    });
    this.GetBrowse();
  }
  TabClick(e){
    console.log(e)
    this.ClearData();
    this.tabIndexToView = e.index;
    this.buttonName = 'Create';
    this.items = ["BROWSE", "CREATE"];
  }
  ClearData(){

  }
  GetBrowse(){
    const obj = {
      "SP_String": "sp_UR_Master_Company",
      "Report_Name_String": "Browse_Company_Master"
    }
    this.GlobalAPI.postData(obj).subscribe((data) => {
      this.GetAllDataList = data;
      console.log("GetAllDataList",this.GetAllDataList); 
    });
  }
  stateDistrictChange(pin){
   if(pin.length === 6){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_State_District_Dropdown",
      'Json_Param_String':JSON.stringify([{Pincode : pin}])   
    }
    this.GlobalAPI.postData(obj).subscribe((data) => {
     console.log("pin Data",data);
    });
   } 
  }
}
class company{
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
}