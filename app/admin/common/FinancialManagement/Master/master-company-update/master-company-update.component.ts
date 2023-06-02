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
  selector: 'app-master-company-update',
  templateUrl: './master-company-update.component.html',
  styleUrls: ['./master-company-update.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MasterCompanyUpdateComponent implements OnInit {
  urlService = window["config"];
  Spinner = false;
  buttonname = 'Update';
  objcompany :company = new company()
  MasterCompanyFormSubmit:boolean = false
  CountryList:any = [];
  StateDistrictList:any = [];
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) {
    
   }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Master Company Update",
      Link: "Financial Management --> Master -> Master Comapny Update"
    });
    this.getCountry()
    this.getCompanyDetalis()
    }
  getCompanyDetalis(){
    const obj = {
      "SP_String": "SP_MasterCompanyUpdate_V2",
      "Report_Name_String": "Get_Company_Details"
    }
    this.GlobalAPI.postData(obj).subscribe((data) => {
      this.stateDistrictChange(data[0].Pin);
      this.getCountry();
      this.objcompany = data[0]
    });
  }
  onReject(){
    this.compacctToast.clear("c");
  }
  onConfirm(){

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
   saveData(valid:any){
    console.log(valid)
    this.MasterCompanyFormSubmit = true
    if(valid){
      this.Spinner = true;
      const obj = {
        "SP_String": "SP_MasterCompanyUpdate_V2",
        "Report_Name_String": 'Update_Company_Details',
        "Json_Param_String": JSON.stringify([this.objcompany]) 
       }
       this.GlobalAPI.postData(obj)
       .subscribe((data:any)=>{
        if (data[0].Column1 == 'done'){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "User Succesfully Updated" ,
            detail: "Succesfully Updated"
          });
        }
        else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error" ,
            detail: "Something Was Wrong"
          });
        }
        this.MasterCompanyFormSubmit = false
        this.Spinner = false;
       },(error:any)=>{
        console.log(error)
        this.Spinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Something Was Wrong" ,
          detail: "Try again Later"
        });
       })
    }
   }
}


class company {
Company_Name:any
Mailing_Name:any
Mailing_Address_1:any
Mailing_Address_2:any
District:any
State:any
Country:any
Pin:any
Phone:any
Email:any
Logo_Img:any
Quot_Footer_Img:any
}