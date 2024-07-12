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
  Disposal2nd: any = [];
  disposalList: any = [];
  RemarksDis:boolean = false;
  ISused:any = undefined;
  Followup_Type:any = undefined;
  DistFollowupForBranch:any = [];
  SelectedDistFollowupForBranch:any = [];
  DistEnquirySource:any = [];
  SelectedDistEnquirySource:any = [];
  DistFollowupType:any = [];
  SelectedFollowupType:any = [];
  SearchFields:any = [];

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
    this.userid = this.$CompacctAPI.CompacctCookies.User_ID
    this.Header.pushHeader({
      Header: "Patient Followup",
      Link: "Patient Followup"
    });
    this.getUsertype();
    this.getDisposial();
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
    this.userListTableDynmic = [];
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
        this.userListTableDynmic = Object.keys(data[0]);
        this.userListTableBackup = data
        this.ngxService.stop();
        this.FormSubmittedBRwFl = false;
        this.GetDistinct();
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
      if (Status.indexOf(item.Followup_Type) === -1) {
        Status.push(item.Followup_Type);
        this.DistFollowup1.push({ label: item.Followup_Type, value: item.Followup_Type });
      }    
    });
      this.userListTableBackup = [...this.userListTable];
  }
  FilterDist1() {
    let First: any = [];
    let SearchFields: any = [];
     if (this.DistFollowupSelect1.length) {
      SearchFields.push('Followup_Type');
      First = this.DistFollowupSelect1;
    }
    this.userListTable = [];
    if (SearchFields.length) {
      let LeadArr = this.userListTableBackup.filter(function (e) {
        return (First.length ? First.includes(e['Followup_Type']) : true)
      });
      this.userListTable = LeadArr.length ? LeadArr : [];
    } else {
      this.userListTable = [...this.userListTableBackup];
    }
  }
  // DISTINCT & FILTER
  GetDistinct() {
    let DFollowupForBranch:any = [];
    let DEnquirySource:any = [];
    let DFollowupType:any = [];
    this.DistFollowupForBranch =[];
    this.SelectedDistFollowupForBranch =[];
    this.DistEnquirySource =[];
    this.SelectedDistEnquirySource =[];
    this.DistFollowupType =[];
    this.SelectedFollowupType =[];
    this.SearchFields =[];
    this.userListTable.forEach((item) => {
   if (DFollowupForBranch.indexOf(item.Cost_Cen_Name) === -1) {
    DFollowupForBranch.push(item.Cost_Cen_Name);
   this.DistFollowupForBranch.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
   }
  if (DEnquirySource.indexOf(item.Enq_Source_Name) === -1) {
    DEnquirySource.push(item.Enq_Source_Name);
    this.DistEnquirySource.push({ label: item.Enq_Source_Name, value: item.Enq_Source_Name });
    }
    if (DFollowupType.indexOf(item.Followup_Type) === -1) {
      DFollowupType.push(item.Followup_Type);
      this.DistFollowupType.push({ label: item.Followup_Type, value: item.Followup_Type });
      }
  });
     this.userListTableBackup = [...this.userListTable];
  }
  FilterDist() {
    let DFollowupForBranch:any = [];
    let DEnquirySource:any = [];
    let DFollowupType:any = [];
    this.SearchFields =[];
  if (this.SelectedDistFollowupForBranch.length) {
    this.SearchFields.push('Cost_Cen_Name');
    DFollowupForBranch = this.SelectedDistFollowupForBranch;
  }
  if (this.SelectedDistEnquirySource.length) {
    this.SearchFields.push('Enq_Source_Name');
    DEnquirySource = this.SelectedDistEnquirySource;
  }
  if (this.SelectedFollowupType.length) {
    this.SearchFields.push('Followup_Type');
    DFollowupType = this.SelectedFollowupType;
  }
  this.userListTable = [];
  if (this.SearchFields.length) {
    let LeadArr = this.userListTableBackup.filter(function (e) {
      return (DFollowupForBranch.length ? DFollowupForBranch.includes(e['Cost_Cen_Name']) : true)
      && (DEnquirySource.length ? DEnquirySource.includes(e['Enq_Source_Name']) : true)
      && (DFollowupType.length ? DFollowupType.includes(e['Followup_Type']) : true)
    });
  this.userListTable = LeadArr.length ? LeadArr : [];
  } else {
  this.userListTable = [...this.userListTableBackup] ;
  }
  }
  followup(col:any) {
    this.FootFallId = undefined;
    this.FlowDate = undefined;
    this.RemarksDis = false;
    this.Followup_Type = undefined;
    this.Disposal2nd = [];
    this.FollowupDateReg2 = new Date();
    if (col.Foot_Fall_ID) {
      this.Fname = col.Contact_Name+' / ('+col.Mobile+')';
       this.FootFallId = col.Foot_Fall_ID;
      this.FollowupModal = true;
      this.Followup_Type = col.Followup_Type;
      this.ObjFlow = new Flow();
      this.folloupFormSubmit = false;
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
      this.ObjFlow.Current_Action = 'Tele Call'
      this.ObjFlow.User_ID = this.userid,
      this.ObjFlow.Next_Followup = this.DateService.dateConvert(this.FollowupDateReg2),
      this.ObjFlow.Sent_To = this.userid ,
      this.ObjFlow.Used =  this.ISused,
      this.ObjFlow.Followup_Type = this.Followup_Type,
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
          this.Followup_Type = undefined;
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
  getDisposial() {
    this.disposalList =[]
    const obj = {
      "SP_String": "sp_Followup_Details",
      "Report_Name_String": "Get_Disposition_dropdown",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        this.disposalList = JSON.parse(data[0].AA);
       // console.log('this.disposalList',this.disposalList)
      }
     })
  
  }
  GetSEndDispo(DispoId: any) {
    this.Disposal2nd = []
    this.RemarksDis = false;
    this.ObjFlow.Followup_Details = undefined;
    this.ObjFlow.Secondary_Desposition_ID = undefined;
    if (DispoId == 1) {
      this.disposalList[0].SEC_DETAIL.forEach((ele:any) => {
          ele['label'] = ele.Secondary_Desposition_Name;
          ele['value'] = ele.Secondary_Desposition_ID;
        });
        this.Disposal2nd = this.disposalList[0].SEC_DETAIL; 
    }
    if (DispoId == 2) {
       this.disposalList[1].SEC_DETAIL.forEach((el:any) => {
          el['label'] = el.Secondary_Desposition_Name;
          el['value'] = el.Secondary_Desposition_ID;
        });
        this.Disposal2nd = this.disposalList[1].SEC_DETAIL;
    }
    if (DispoId == 3) {
      this.disposalList[2].SEC_DETAIL.forEach((el:any) => {
         el['label'] = el.Secondary_Desposition_Name;
         el['value'] = el.Secondary_Desposition_ID;
       });
       this.Disposal2nd = this.disposalList[2].SEC_DETAIL;
   }
  }
  getDisable() {
    this.RemarksDis = false;
    this.ISused = undefined;
    if (this.ObjFlow.Secondary_Desposition_ID) {
      let arrayfilt = this.Disposal2nd.filter((Ele: any) => { return Ele.Secondary_Desposition_ID === this.ObjFlow.Secondary_Desposition_ID });
      this.ObjFlow.Followup_Details = arrayfilt[0].Secondary_Desposition_Name
      this.RemarksDis = arrayfilt[0].Show_Remarks === 'Y' ? false : true;
      this.ISused = arrayfilt[0].Is_Used;
    }
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
    Is_Lost: any; 
    Disposition_ID: any;
    Secondary_Desposition_ID:any
}
