import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-bshpl-hf-follow-up',
  templateUrl: './bshpl-hf-follow-up.component.html',
  styleUrls: ['./bshpl-hf-follow-up.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BSHPLHfFollowUpComponent implements OnInit {
  seachSpinner = false;
  getAllFollowUpdata:any = [];
  items: any = [];
  tabIndexToView: number = 0;
  FollowupDateReg = new Date();
  FollowupDateWeb = new Date();
  FollowupDateDoc = new Date();
  FollowupDateSale = new Date();
  userList: any = [];
  userid:any = undefined;
  UsertypeREGULAR: any = undefined;
  UsertypeWEBSITE: any = undefined;
  UsertypeDOCTOR :any = undefined;
  UsertypeSALE :any = undefined;
  FormSubmittedREG: boolean = false; 
  FormSubmittedWEB: boolean = false; 
  FormSubmittedDOC: boolean = false; 
  FormSubmittedSALE: boolean = false; 
  userListReg: any = [];
  userListWeb: any = [];
  userListDoc: any = [];
  userListSale: any = [];
  FollowupModal: boolean = false;
  followUpLists: any = [];
  distinctDateArray: any = [];
  Fname: string = '';
  folloupFormSubmit: boolean = false;
  objFollowUpCreation: FollowUpCreation = new FollowUpCreation();
  NxtFollowupDate = new Date();
  PatientName: any = undefined;
  ActionList: any = [];
  mobileData: any = undefined;
  ForwardList: any = [];
  constructor(
    private $http: HttpClient,  
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit() {
     this.items = ["REGULAR","WEBSITE","DOCTOR MKT","AFTER SALE"];
    this.Header.pushHeader({
      Header: "FOLLOW UP",
      Link: "CRM -> BSHPL-follow Up -> BSHPL HA Follow Up"
    })
    this.userid = this.$CompacctAPI.CompacctCookies.User_ID
    this.getUsertype();
  }
  onReject() { }
  clearData() {
  this.FormSubmittedREG = false; 
  this.FormSubmittedWEB = false; 
  this.FormSubmittedDOC = false; 
  this.FormSubmittedSALE = false;  
  }
  GetSearchedReg(valid){
    this.FormSubmittedREG = true;
    this.userListReg = [];
    this.ngxService.start();
    if(valid){
     const RegObj ={
      Next_Followup:this.DateService.dateConvert(new Date(this.FollowupDateReg)),
      User_ID: this.UsertypeREGULAR,
       type: "REGULAR"
      }
      const obj = {
      "SP_String": "BSHPL_Call_Centre",
      "Report_Name_String": "GetLeadList_New",
      "Json_Param_String": JSON.stringify([RegObj]) ,
     }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
      if (data.length) {
        console.log("RegObj ==", data)
        this.userListReg = data
        this.ngxService.stop();
        this.FormSubmittedREG = false;
      }
      }) 
    }
  }
  GetSearchedWeb(valid){
    this.FormSubmittedWEB = true
    this.userListWeb = [];
    this.ngxService.start();
    if(valid){
        const WebObj ={
          Next_Followup:this.DateService.dateConvert(new Date(this.FollowupDateWeb)),
          User_ID: this.UsertypeWEBSITE,
          type: "WEBSITE"
      }
      const obj = {
      "SP_String": "BSHPL_Call_Centre",
      "Report_Name_String": "GetLeadList_New",
      "Json_Param_String": JSON.stringify([WebObj]) ,
     }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
      if (data.length) {
        console.log("WebObj ==", data)
        this.userListWeb = data
        this.ngxService.stop();
        this.FormSubmittedWEB = false
      }
      }) 
    }
  }
  GetSearchedDoc(valid){
    this.FormSubmittedDOC = true
    this.userListDoc = []; 
    this.ngxService.start();
     if(valid ){
    const DocObj ={
        Next_Followup:this.DateService.dateConvert(new Date(this.FollowupDateDoc)),
        User_ID: this.UsertypeDOCTOR,
        type: "DOCTOR_MKT"
       }
       const obj = {
      "SP_String": "BSHPL_Call_Centre",
      "Report_Name_String": "GetLeadList_New",
      "Json_Param_String": JSON.stringify([DocObj]) ,
     }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
      if (data.length) {
        console.log("DocObj ==", data)
        this.userListDoc = data
        this.ngxService.stop();
        this.FormSubmittedDOC = false
      }
      }) 
     } 
  }
  GetSearchedSale(valid){
    this.FormSubmittedSALE = true  
    this.userListSale = [];
    this.ngxService.start();
    if(valid){
        const SaleObj ={
          Next_Followup:this.DateService.dateConvert(new Date(this.FollowupDateSale)),
          User_ID: this.UsertypeSALE,
          type: "AFTER_SALE"
      }
     const obj = {
      "SP_String": "BSHPL_Call_Centre",
      "Report_Name_String": "GetLeadList_New",
      "Json_Param_String": JSON.stringify([SaleObj]) ,
     }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
      if (data.length) {
        console.log("SaleObj ==", data)
        this.userListSale = data
        this.ngxService.stop();
        this.FormSubmittedSALE = false 
      }
      }) 
    }
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
     this.items = ["REGULAR", "WEBSITE", "DOCTOR MKT", "AFTER SALE"];
     this.clearData();
  }
  getUsertype() {
    this.userList = []
    this.ngxService.start()
    const obj = {
      "SP_String": "BSHPL_Call_Centre",
      "Report_Name_String": "Get_Sales_Man_with_below_members",
      "Json_Param_String": JSON.stringify([{User_ID: Number(this.userid)}]) ,
     }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
      if (data.length) {
        data.forEach(el => {
          el['label'] = el.Member_Name;
          el['value'] = el.User_ID;
        });
        //console.log("usertype ==", data)
        this.userList = data;
        this.UsertypeREGULAR = this.userList[0].User_ID;
        this.UsertypeWEBSITE = this.userList[0].User_ID; 
        this.UsertypeDOCTOR = this.userList[0].User_ID;
        this.UsertypeSALE = this.userList[0].User_ID
        this.ngxService.stop()
      }
      })
  }
  followup(valid) {
    this.PatientName = undefined;
    this.Fname = "";
    this.mobileData = undefined;
    this.objFollowUpCreation.Followup_Action = undefined;
    this.objFollowUpCreation.Followup_Details = undefined;
    this.NxtFollowupDate = new Date()
    if (valid) {
      this.PatientName = valid.Foot_Fall_ID;
      this.Fname = valid.Contact_Name;
       this.mobileData =valid.Mobile
      this.FollowupModal = true   
       setTimeout(() => {
         this.PatientChange(this.PatientName);
         this.GetAction(this.mobileData);
         this.getForwardtype();
       }, 200);
    }
    
  }
  PatientChange(footFallID){
    const distinctDateArrayTemp = [];
    const obj = {
      "SP_String": "BSHPL_Call_Centre",
      "Report_Name_String":"CRM_Get_Followup",
      "Json_Param_String": JSON.stringify([{Foot_Fall_ID : footFallID}]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.followUpLists = data.length ? data:[];
      for (let i = 0; i < this.followUpLists.length; i++) {
          distinctDateArrayTemp.push(this.followUpLists[i].Posted_On_C);
      }
      const unique = distinctDateArrayTemp.filter(function(value, index, self){
                      return self.indexOf(value) === index;
                      })
        this.distinctDateArray = unique;
   })
  }
  getFollowupByDate(dateStr) {
    return this.followUpLists.filter((item) => item.Posted_On_C === dateStr);
  }
  saveFollowUp(valid) {
   this.folloupFormSubmit = true
   if(valid){
     if(this.PatientName){
       this.objFollowUpCreation.Foot_Fall_ID = Number(this.PatientName),
       this.objFollowUpCreation.User_ID = this.$CompacctAPI.CompacctCookies.User_ID,
       this.objFollowUpCreation.Next_Followup2 = this.DateService.dateConvert(this.NxtFollowupDate)
       this.objFollowUpCreation.CallID = 0
       const obj = {
        "SP_String": "BSHPL_Call_Centre",
        "Report_Name_String":"SaveFollowup",
        "Json_Param_String": JSON.stringify([this.objFollowUpCreation]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("data",data)
        if(data[0].Column1){
          this.PatientChange(this.PatientName);
          this.PatientName = undefined;
          this.objFollowUpCreation = new FollowUpCreation();
          this.NxtFollowupDate = new Date;
          this.folloupFormSubmit = false
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "FOLLOW UP",
            detail: "SAVE Succesfully "
          });
        }
       })
     }
   }  
  }
  GetAction(Phone){
    this.ActionList = [];
    const obj = {
        "SP_String": "BSHPL_Call_Centre",
        "Report_Name_String":"CRM_Get_Request_Type",
        "Json_Param_String": JSON.stringify([{Mobile : Phone}]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.ActionList = data;
       console.log("ActionList==",this.ActionList);
     
      })
  }
  getForwardtype() {
    this.ForwardList = []
    const obj = {
      "SP_String": "BSHPL_Call_Centre",
      "Report_Name_String": "Get_Sales_Man_with_below_members_with_Parent",
      "Json_Param_String": JSON.stringify([{User_ID: Number(this.userid)}]) ,
     }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
      if (data.length) {
        data.forEach(el => {
          el['label'] = el.Member_Name;
          el['value'] = el.User_ID;
        });
        console.log("ForwardList ==", data)
        this.ForwardList = data;
        this.objFollowUpCreation.Forward_to = data[0].User_ID

      }
      })
  }
}
class FollowUpCreation{
  Followup_Action: any;
  Followup_Details: any;
  Foot_Fall_ID: any;
  User_ID: any;
  Next_Followup2: any;
  CallID: any;
  Forward_to: any;
}
