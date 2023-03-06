import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-google-review',
  templateUrl: './google-review.component.html',
  styleUrls: ['./google-review.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class GoogleReviewComponent implements OnInit {
  tabIndexToView:number = 0;
  Items:any;

  costcenterListBrowse:any = [];
  costcenterListBrowsedata:any = [];
  // patient list
  SearchPatientList:any;
  SearchPatientData:any;

  // date range picker
  initDate : any = [];
// table data
   TableData:any = [];

  // dropdown against mobile number
  NameOnMobile:any = [];
  // Review issu dafault date
  Review_Issue_Date:Date =  new Date();
  Review_Issue_Datemin:Date;
  Review_Issue_Datemax:Date = new Date();
  AllowedDay:any;
  // Accessing user type and cost cen id from cookie
  userType :any;
  costCenId : any;
  // dropdown cost center list;
  costCenterList:any = [];
  costCenterdataList : any = [];
  // For spinnar and button name
  Spinner:boolean = false;
  buttonname:string;


  googleReviewFormSubmitted:boolean = false;
  ObjgoogleReview = new googleReview();
  ObjSearchForm = new searchForm();

  constructor(
    private Header:CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi : CompacctCommonApi,
    private DateService : DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header:"Google Review",
      Link:"PatientManagement -->Transation --> Google Review"
    });
    this.Items  = ['Browse','Create'];
    this.buttonname = 'Create';
    this.userType = this.commonApi.CompacctCookies.User_Type;
    this.costCenId = this.commonApi.CompacctCookies.Cost_Cen_ID;
    this.getAllowDate();
    this.getCostCenter();
    this.getCostCenterBrowse();
    this.getPatient();
    this.getAllReview(true);

  }

  getCostCenterBrowse(){
    this.costcenterListBrowse = [];
    const tempobj = {
      User_Type : this.userType,
      Cost_Cen_ID : this.costCenId
    }
    const obj = {
      "SP_String": "sp_BL_CRM_Txn_Enq_Google_Review",
      "Report_Name_String": "Get_Cost_Center_User_Type",   
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data)=>{
      // console.log(data);
      this.costcenterListBrowsedata = data ;
      this.costcenterListBrowsedata.forEach(el => {
          this.costcenterListBrowse.push({
            label: el.Cost_Cen_Name,
            value: el.Cost_Cen_ID
          });
        
        });

        if(this.userType == "U"){
          this.ObjSearchForm.Cost_Center_ID = data[0].Cost_Cen_ID;
          
        }
      
    });
  }

  getDateRange(dateRangeObj:any){
    if(dateRangeObj.length){
      this.ObjSearchForm.From_Date = dateRangeObj[0];
      this.ObjSearchForm.To_Date = dateRangeObj[1];
    }
   
  }

  getPatient(){
    this.SearchPatientList = [];
    const obj = {
      "SP_String": "sp_BL_CRM_Txn_Enq_Google_Review",
      "Report_Name_String": "Get_Patient_Name",   
    }

    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.SearchPatientData = data ;
        this.SearchPatientData.forEach(el => {
          this.SearchPatientList.push({
            label: el.Patient,
            value: el.Mobile
          });
        });
    })
  }

  getAllReview(valid){
    this.TableData = [];
    
    if(valid){
     // console.log("get review works");
     const start = this.ObjSearchForm.From_Date ? this.DateService.dateConvert(new Date(this.ObjSearchForm.From_Date)) : this.DateService.dateConvert(new Date());
     const end = this.ObjSearchForm.To_Date ? this.DateService.dateConvert(new Date(this.ObjSearchForm.To_Date)) : this.DateService.dateConvert(new Date());
     const Cost_CenterID = this.ObjSearchForm.Cost_Center_ID ? this.ObjSearchForm.Cost_Center_ID :0;
     const mobile = this.ObjSearchForm.Patient_Name ? this.ObjSearchForm.Patient_Name : 0;

     const tempObj = {
        FromDate : start,                                            
			  ToDate : end ,                                              
			  Google_Review_Cost_Center_ID :  Cost_CenterID,                                      
			  Mobile : mobile
     }

     const obj = {
      "SP_String": "sp_BL_CRM_Txn_Enq_Google_Review",
      "Report_Name_String": "Browse_BL_CRM_Txn_Enq_Google_Review",
      "Json_Param_String": JSON.stringify([tempObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //  console.log(data);
    this.TableData = data;
    });

    }

  }

  GetPrint(col){
    if (col.Foot_Fall_ID) {
      window.open("/Report/Crystal_Files/CRM/joh_form/Google_Review.aspx?Foot_Fall_ID=" +col.Foot_Fall_ID, 
      'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
      );
  } 

  }

  getNameOnMobile(mobile){
   if(mobile.length===10){
    const obj = {
         "SP_String":"sp_BL_CRM_Txn_Enq_Google_Review",
         "Report_Name_String":"Get_Patient_Name_Against_Mobile",
         "Json_Param_String": JSON.stringify([{Mobile: mobile}])
  };

  this.GlobalAPI.getData(obj).subscribe((data)=>{
  this.NameOnMobile = data;
  });
}

else{
  this.NameOnMobile = [];
  this.ObjgoogleReview.Foot_Fall_ID = undefined;
}
  }

  getCostCenter(){
    this.costCenterList = [];
    const tempobj = {
      User_Type : this.userType,
      Cost_Cen_ID : this.costCenId
    }
    const obj = {
      "SP_String": "sp_BL_CRM_Txn_Enq_Google_Review",
      "Report_Name_String": "Get_Cost_Center_User_Type",   
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data)=>{
      this.costCenterdataList = data ;
      this.costCenterdataList.forEach(el => {
          this.costCenterList.push({
            label: el.Cost_Cen_Name,
            value: el.Cost_Cen_ID
          });
        
        });

        if(this.userType == "U"){
          this.ObjgoogleReview.Issue_Review_Cost_Center_ID = data[0].Cost_Cen_ID;
        }
      
    });
  }

  getAllowDate(){
    const obj = {
      "SP_String": "sp_BL_CRM_Txn_Enq_Google_Review",
      "Report_Name_String": "Allowed_Entry_Day",   
      "Json_Param_String": JSON.stringify([{User_ID: this.commonApi.CompacctCookies.User_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data)=>{
    // console.log('allow date',data);
    this.AllowedDay = data[0].Allowed_Entry_Day;
    let d = new Date()
    this.Review_Issue_Datemin=new Date(d.getFullYear(),d.getMonth(),d.getDate()-data[0].Allowed_Entry_Day);
});
  }

  SaveGoogleReview(valid){
    let today = new Date();
    this.googleReviewFormSubmitted = true;
    if(!this.Review_Issue_Date){
      this.CompacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Date Can't Be Empty"
      });
    }
    if(valid && this.Review_Issue_Date && this.Review_Issue_Date <= today){
     this.CompacctToast.clear();
     this.CompacctToast.add({
       key: "c",
       sticky: true,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
    }
    
  }

  clearData(){
    this.ObjgoogleReview.Mobile = undefined;
   this.NameOnMobile = [];
   this.ObjgoogleReview.Foot_Fall_ID = undefined;
   this.googleReviewFormSubmitted = false;
   if(this.userType == 'A'){
    this.ObjgoogleReview.Issue_Review_Cost_Center_ID = undefined;
   }
  }

  TabClick(e){
    this.tabIndexToView = e.index;
    this.clearData();
  }
  // sending data against create 
  onConfirm(){
    this.Spinner = true;
    this.ObjgoogleReview.Issue_Review_Date = this.DateService.dateConvert(this.Review_Issue_Date);
    this.ObjgoogleReview.Issue_Review_User_ID = this.commonApi.CompacctCookies.User_ID;
    const obj = {
      "SP_String": "sp_BL_CRM_Txn_Enq_Google_Review",
      "Report_Name_String":"update_BL_CRM_Txn_Enq_Google_Review",
      "Json_Param_String": JSON.stringify([this.ObjgoogleReview]) 
     }
     this.GlobalAPI.postData(obj).subscribe((data)=>{
     if(data[0].Column1){
      this.CompacctToast.clear();
      this.CompacctToast.add({
      key: "compacct-toast",
      severity: "success",
      summary: "Review Created Succesfully ",
      detail: "Succesfully Created"
    });
    this.Spinner = false;
    this.clearData();
    this.getAllReview(true);
    this.tabIndexToView = 0;
     }
     else{
            this.CompacctToast.clear();
            this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Wrong"
          });
          this.Spinner = false;
     }
     
     });

  }

  onReject(){
    this.CompacctToast.clear("c");
  }

}

class googleReview{
  Mobile:any;
  Foot_Fall_ID:any;
  Issue_Review_Date:any;
  Issue_Review_User_ID:any;
  Issue_Review_Cost_Center_ID:any;
}
class searchForm{
  Cost_Center_ID : any;
  Patient_Name : any;
  From_Date : any;
  To_Date : any;
}