import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { data, escapeSelector } from "jquery";
import { Console } from "console";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-patient-coupon',
  templateUrl: './patient-coupon.component.html',
  styleUrls: ['./patient-coupon.component.css'],
  providers:[MessageService],
  encapsulation: ViewEncapsulation.None
})
export class PatientCouponComponent implements OnInit {

  Del : boolean = false;
  Save : boolean = false;
  tabIndexToView : any = 0;
  Spinner : any = false;
  displaytext : any = false;
  objPatient : Patient = new Patient();
  AllNameList : any = [];
  Footfallid : any 

  constructor(
    private http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private route : ActivatedRoute,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header:  " Patient Coupon " ,
      Link: " " 
    });
  }

  onReject(){
    this.compacctToast.clear("c");
  }

  showtext(){
    this.displaytext = true;
  }

  getName(Mobile){
    console.log(Mobile);
    if(Mobile.length === 10)
    {
    const obj = {
        "SP_String": "SP_Patient_Coupon",
         "Report_Name_String":"Get_Patient",
         "Json_Param_String": JSON.stringify([{Mobile: Mobile}]) 
          }
          
            this.GlobalAPI.getData(obj)
            .subscribe((data)=>
            {
              this.AllNameList = data;
              //this.objSubLedger.State=this.AllStateList.StateName;
              console.log('AllNameList = ', this.AllNameList);
            
            });
          }
          else{
            this.objPatient.Foot_Fall_ID = undefined;
            this.Footfallid = undefined;
            this.AllNameList = [];
      
          }
  

  }

  getPatientId(Foot_Fall_ID){
    if(Foot_Fall_ID){
    this.Footfallid = Foot_Fall_ID;
    }
    else{
      this.Footfallid = undefined;
     
    }
    

  }
  GetPrint(){ 
      if (this.Footfallid) {
        window.open("/Report/Crystal_Files/CRM/joh_Form/Ear_Mold_coupon_Print.aspx?Foot_Fall_ID=" + this.Footfallid, 
        'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
        );
    } 
  }

}
class Patient{
  Mobile : any;
  Contact_Name : any;
  Foot_Fall_ID : any
}
