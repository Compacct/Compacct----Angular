import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute } from '@angular/router';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { data } from 'jquery';

@Component({
  selector: 'app-hearing-crm-lead-followup',
  templateUrl: './hearing-crm-lead-followup.component.html',
  styleUrls: ['./hearing-crm-lead-followup.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HearingCRMLeadFollowupComponent implements OnInit {
  tabIndexToView: Number = 0;
  FollowupDateReg: Date = new Date();
  FollowupDateReg2: Date = new Date();
  minumeDate: Date = new Date();
  UsertypeREGULAR: any = undefined;
  userList: any = [];
  FormSubmittedBRwFl: boolean = false;
  userListTable: any = [];
  userListTableDynmic: any = [];
  userid: any = undefined;
  DistFollowup1: any = [];
  DistFollowupSelect1: any = undefined;
  userListTableBackup: any = [];
  FollowupModal: boolean = false;
  ActionList: any = [];
  folloupFormSubmit: boolean = false;
  distinctDateArray: any = [];
  FootFallId: any = undefined;
  FollowUpList: any = [];
  Fname: any = undefined;
  ActionList2: any = [];
  ForwardList: any = [];
  ObjFlow: Flow = new Flow();
  FlowDate: any = undefined;
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
    this.ActionList = [{ 'Action': 'Tele Call' }, { 'Action': 'Branch Visit' }]
    this.ActionList2 = [{'Action':'Tele Call'} ,{'Action':'Branch Visit'}]
    this.userid = this.$CompacctAPI.CompacctCookies.User_ID
    this.Header.pushHeader({
      Header: "Patient Followup",
      Link: "Patient Followup"
    });
    this.getUsertype();
  }
  onReject(){}
  getUsertype() {
    this.userList = []
    const obj = {
      "SP_String": "sp_Followup_Details",
      "Report_Name_String": "Get_User",
      "Json_Param_String": JSON.stringify([{User_ID: Number(this.userid)}]) ,
     }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
      if (data.length) {
        data.forEach(el => {
          el['label'] = el.User_Name;
          el['value'] = el.User_ID;
        });
        this.userList = data;
        if (this.$CompacctAPI.CompacctCookies.User_Type === "U") {
          this.UsertypeREGULAR = this.userList[0].User_ID;
        }   
      }
      })
  }
  GetSearchedReg(valid:any){
    this.FormSubmittedBRwFl = true;
    this.userListTable = [];  
    this.userListTableBackup = [];
    if (valid) {
      this.ngxService.start();
     const RegObj ={
      Next_Followup:this.DateService.dateConvert(this.FollowupDateReg),
      User_ID: this.UsertypeREGULAR,
      }
      const obj = {
      "SP_String": "sp_Followup_Details",
      "Report_Name_String": "Get_followup_details",
      "Json_Param_String": JSON.stringify([RegObj]) ,
     }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
      if (data.length) {
        //console.log("RegObj ==", data)
        this.userListTable = data
        this.userListTableBackup = data
        this.ngxService.stop();
        this.FormSubmittedBRwFl = false;
        this.GetDistinct1();
      } else {
        this.ngxService.stop();
      }
      }) 
    }
  }
  GetDistinct1() {
    let Status: any = [];
    this.DistFollowup1 = [];
    this.userListTable.forEach((item) => {
      if (Status.indexOf(item.User_Name) === -1) {
        Status.push(item.User_Name);
        this.DistFollowup1.push({ label: item.User_Name, value: item.User_Name });
      }    
    });
      this.userListTableBackup = [...this.userListTable];
  }
  FilterDist1() {
    let First: any = [];
    let SearchFields: any = [];
     if (this.DistFollowupSelect1.length) {
      SearchFields.push('User_Name');
      First = this.DistFollowupSelect1;
    }
    this.userListTable = [];
    if (SearchFields.length) {
      let LeadArr = this.userListTableBackup.filter(function (e) {
        return (First.length ? First.includes(e['User_Name']) : true)
      });
      this.userListTable = LeadArr.length ? LeadArr : [];
    } else {
      this.userListTable = [...this.userListTableBackup];
    }
  }
  followup(col:any) {
    this.FootFallId = undefined;
    this.FlowDate = undefined;
    this.FollowupDateReg2 = new Date();
    if (col.Foot_Fall_ID) {
      this.Fname = col.Contact_Name+' / ('+col.Mobile+')';
       this.FootFallId = col.Foot_Fall_ID;
      this.FollowupModal = true;
      this.ObjFlow = new Flow();
    this.getPatatentFlow(col.Foot_Fall_ID) 
    } 
  }
  getPatatentFlow(FootId: any) {
    const obj = {
        "SP_String": "sp_Followup_Details",
        "Report_Name_String":"Get_followup_details_Into_Tree",
        "Json_Param_String": JSON.stringify([{Foot_Fall_ID : FootId}]) 
       }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
       this.FollowUpList = data
    })
  }
  saveFollowUp(valid: any) {
    this.folloupFormSubmit = true;
    if (valid) {
      this.ObjFlow.Foot_Fall_ID = this.FootFallId,
      this.ObjFlow.User_ID = this.userid,
      this.ObjFlow.Next_Followup = this.DateService.dateConvert(this.FollowupDateReg2),
      this.ObjFlow.Sent_To = this.userid ,
      this.ObjFlow.Used = 'NA',
      this.ObjFlow.Followup_Type = null,
      this.ObjFlow.Is_Lost = 'Y'
      //console.log(this.ObjFlow)
       const obj = {
        "SP_String": "sp_Followup_Details",
        "Report_Name_String":"Insert_followup_details",
        "Json_Param_String": JSON.stringify([this.ObjFlow]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        //console.log("data",data)
        if(data[0].Column1){
          this.ObjFlow = new Flow();
          this.FollowupDateReg2 = new Date();
          this.folloupFormSubmit = false;
          this.FollowupModal = false;
          this.FootFallId = undefined;
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
  redirectPatientDetails(cool:any) {
       if(cool.Foot_Fall_ID){
      window.open('/Hearing_CRM_Lead_Search?recordid=' + window.btoa(cool.Foot_Fall_ID));
    }
  }
  Appointment() {
      window.open('/Hearing_BL_CRM_Appointment');
  }
    
}
class Flow{
    Foot_Fall_ID: any;
    Followup_Details:any;                                  
    Followup_Action:any;                                   
    Current_Action:any;                                   
    User_ID:any;                                        
    Sent_To:any;                                          
    Used:any;                                            
    Followup_Type :any;                                    
    Next_Followup:any;                                     
    Is_Lost:any;               
}
