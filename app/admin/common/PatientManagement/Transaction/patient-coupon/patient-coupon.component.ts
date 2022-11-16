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
  seachSpinner : boolean = false;
  Del : boolean = false;
  Save : boolean = false;
  tabIndexToView : any = 0;
  Spinner : any = false;
  displaytext : any = false;
  objPatient : Patient = new Patient();
  AllNameList : any = [];
  AllPatientList : any = [];
  PatientList : any = [];
  initDate : any = [];
  Footfallid : any ;
  costCenterList : any = [];
  costCenterdataList : any = [];
  costCenterdataList2 : any = [];
  costCenterList2 : any = [];
  items : any= [];
  PatientCouponFormSubmit : any = false;
  searchFormSubmit : any = false;
  buttonname : any= "Create";
  Coupon_Issue_Date:Date
  Coupon_Issue_Datemin:Date 
  Coupon_Issue_Datemax:Date
  userType :any;
  costCenId : any;
  objSearch : Search = new Search();
  Searchedlist : any = [];
  AllowedDay : any;


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
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header:  " Patient Coupon " ,
      Link: "PatientManagement -->Transation --> Patient Coupon " 
    });
    this.userType = this.commonApi.CompacctCookies.User_Type;
    this.costCenId = this.commonApi.CompacctCookies.Cost_Cen_ID;
    
    this.getCostCenter();
    this.getPatient();
    this.getCostCenterBrowse();
    this.getAllowDate()

  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    
    this.clearData();
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
        "SP_String": "sp_BL_CRM_Txn_Enq_Coupon",
         "Report_Name_String":"Get_Patient_Name_Against_Mobile",
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

  getCostCenter(){
    this.costCenterList = [];
    const tempobj = {
      User_Type : this.userType,
      Cost_Cen_ID : this.costCenId
    }
    const obj = {
      "SP_String": "sp_BL_CRM_Txn_Enq_Coupon",
      "Report_Name_String": "Get_Cost_Center_User_Type",   
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.costCenterdataList = data ;
      console.log("costCenterdataList=",this.costCenterdataList);
        this.costCenterdataList.forEach(el => {
          this.costCenterList.push({
            label: el.Cost_Cen_Name,
            value: el.Cost_Cen_ID
          });
        
        });
        this.objPatient.Issue_Coupon_Cost_Center_ID = this.commonApi.CompacctCookies.Cost_Cen_ID;
       
    })
    
    //this.objSearch.Cost_Center_ID = this.commonApi.CompacctCookies.Cost_Cen_ID

  }

  getPatient(){
    this.PatientList = [];
    const obj = {
      "SP_String": "sp_BL_CRM_Txn_Enq_Coupon",
      "Report_Name_String": "Get_Patient_Name",   
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.AllPatientList = data ;
      console.log("AllPatientList=",this.AllPatientList);
        this.AllPatientList.forEach(el => {
          this.PatientList.push({
            label: el.Patient,
            value: el.Mobile
          });
        
         
        });
       
        
    })

  }

  getCostCenterBrowse(){
    this.costCenterList2 = [];
    const obj = {
      "SP_String": "sp_BL_CRM_Txn_Enq_Coupon",
      "Report_Name_String": "Get_Cost_Center",   
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.costCenterdataList2 = data ;
      console.log("costCenterdataList2=",this.costCenterdataList2);
        this.costCenterdataList2.forEach(el => {
          this.costCenterList2.push({
            label: el.Cost_Cen_Name,
            value: el.Cost_Cen_ID
          });
        
        });
        this.objSearch.Cost_Center_ID = this.commonApi.CompacctCookies.Cost_Cen_ID
       
    })

  }

  getAllowDate(){
    const obj = {
      "SP_String": "sp_BL_CRM_Txn_Enq_Coupon",
      "Report_Name_String": "Allowed_Entry_Day",   
      "Json_Param_String": JSON.stringify([{User_ID: this.commonApi.CompacctCookies.User_ID}]) 
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.AllowedDay = data[0].Allowed_Entry_Day;
    let d = new Date()
     this.Coupon_Issue_Datemin=new Date(d.getFullYear(),d.getMonth(),d.getDate()-data[0].Allowed_Entry_Day)
    
    })

  }

  getDateRange(dateRangeObj:any){
    if(dateRangeObj.length){
      this.objSearch.From_Date = dateRangeObj[0];
      this.objSearch.To_Date = dateRangeObj[1];
    }
   
  }

  getAlldata(valid){
    this.searchFormSubmit = true;
    if(valid){
      const start = this.objSearch.From_Date
      ? this.DateService.dateConvert(new Date(this.objSearch.From_Date))
      : this.DateService.dateConvert(new Date());
      const end = this.objSearch.To_Date
      ? this.DateService.dateConvert(new Date(this.objSearch.To_Date))
      : this.DateService.dateConvert(new Date());
     
    
    const tempobj = {
      FromDate : start,
      ToDate : end,
      Issue_Coupon_Cost_Center_ID : this.objSearch.Cost_Center_ID ? this.objSearch.Cost_Center_ID : 0,
      Mobile : this.objSearch.Patient_Name ? this.objSearch.Patient_Name : 0,
      Issue_Coupon_Use_ID : this.commonApi.CompacctCookies.User_ID
    
    }
    const obj = {
      "SP_String": "sp_BL_CRM_Txn_Enq_Coupon",
      "Report_Name_String": "Browse_BL_CRM_Txn_Enq_Coupon",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Searchedlist = data;
      
       
       console.log('Searchedlist=====',this.Searchedlist);
       this.searchFormSubmit = false;
       
       
     })
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

  SavePatientCoupon(valid){
    this.PatientCouponFormSubmit = true;;
      if(valid){
      this.Del =false;
      this.Save = true;
     //this.DelVoucherNo = col.Voucher_No ;
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
    this.objPatient.Issue_Coupon_Date = this.DateService.dateConvert(this.Coupon_Issue_Date);
        this.objPatient.Issue_Coupon_Use_ID = this.commonApi.CompacctCookies.User_ID;
        const obj = {
          "SP_String": "sp_BL_CRM_Txn_Enq_Coupon",
          "Report_Name_String":"update_BL_CRM_Txn_Enq_Coupon",
          "Json_Param_String": JSON.stringify([this.objPatient]) 
         }
         this.GlobalAPI.getData(obj).subscribe((data : any)=>
         {
           console.log('data=',data);
           
           if(data[0].Column1)
           {
             
            this.compacctToast.clear();
            this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Patient Coupon Update Succesfully ",
            detail: "Succesfully Updated"
          });
          if (this.objPatient.Foot_Fall_ID) {
            window.open("/Report/Crystal_Files/CRM/joh_Form/Ear_Mold_coupon_Print.aspx?Foot_Fall_ID=" +this.objPatient.Foot_Fall_ID, 
            'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
            );
          }
          
          this.getAlldata(true);
          this.getPatient();
         // this.PaymentRequisitionActionPOPUP = false;
          this.clearData();
          
          //this.HolidayListAdd = [];
          this.Spinner = false;
          this.tabIndexToView = 0;
           this.items = ["BROWSE", "CREATE"];
          }
          else{
            this.compacctToast.clear();
            this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Wrong"
          });
          // this.clearData();
          this.Spinner = false;
          }
         });
    
  }

  onConfirm2(){

  }
  
  clearData(){
    this.objPatient = new Patient();
    this.PatientCouponFormSubmit = false;
    this.searchFormSubmit = false;
    this.objPatient.Issue_Coupon_Cost_Center_ID = this.commonApi.CompacctCookies.Cost_Cen_ID;
    this.objSearch.Cost_Center_ID = this.commonApi.CompacctCookies.Cost_Cen_ID
   // this.getAllowDate()
   this.Coupon_Issue_Date = new Date()
   this.Coupon_Issue_Datemax = this.Coupon_Issue_Date
  }

  GetPrint(col){ 
      if (col.Coupon_No) {
        window.open("/Report/Crystal_Files/CRM/joh_Form/Ear_Mold_coupon_Print.aspx?Foot_Fall_ID=" +col.Coupon_No, 
        'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
        );
    } 
  }

}
class Patient{
  Mobile : any;
  Contact_Name : any;
  Foot_Fall_ID : any;
  Cost_Center_ID : any;
  Issue_Coupon_Date : any;
  Issue_Coupon_Use_ID : any;
  Issue_Coupon_Cost_Center_ID : any;
}
class Search{
  Cost_Center_ID : any;
  Patient_Name : any;
  From_Date : any;
  To_Date : any;

}
