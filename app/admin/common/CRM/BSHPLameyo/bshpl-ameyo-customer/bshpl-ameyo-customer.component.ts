import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Data } from '@angular/router';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { flatMap } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-bshpl-ameyo-customer',
  templateUrl: './bshpl-ameyo-customer.component.html',
  styleUrls: ['./bshpl-ameyo-customer.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BSHPLAmeyoCustomerComponent implements OnInit {
  items = [];
  tabIndexToView = 0;
  PatientName = undefined;
  PatientList = [];
  bckPatientList = [];
  ameyoCustomarFormSubmit = false
  Parammobile = undefined;
  followUpLists = [];
  distinctDateArray = [];
  objFollowUpCreation = new Followup();
  folloupFormSubmit = false;
  ActionList = [];
  bckActionList = [];
  NxtFollowupDate = new Date();
  TodayDate = new Date();
  followupSpinner = false
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
  ) { 
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.Parammobile = params['phone'];
 
     })
  }

  ngOnInit() {
    this.items = ["FOLLOWUP DETALIS","CREATE LEAD"];
    this.Header.pushHeader({
      Header: "FOLLOW UP",
      Link: "CRM -> FOLLOW UP"
    });
    this.getPatientList();
    $('header.main-header').css({
      'display' :'none'
    })
    $('div.content-wrapper').css({
      'margin' :'0px'
    })
    $('aside.main-sidebar').css({
      'display' :'none'
    })
    $('footer.main-footer').css({
      'display' :'none'
    })
    this.GetAction();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["FOLLOWUP DETALIS","CREATE LEAD"];
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){

  }
  getPatientList(){
    this.PatientList=[]; 
    this.bckPatientList = [];
       const obj = {
        "SP_String": "BSHPL_Call_Centre",
        "Report_Name_String":"Get_CRM_All_Lead",
        "Json_Param_String": JSON.stringify([{Mobile : this.Parammobile}]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.bckPatientList = data;
       console.log("PatientList==",this.bckPatientList);
       this.bckPatientList.forEach((el : any) => {
           this.PatientList.push({
            label: el.Lead_Details,
            value: el.Foot_Fall_ID,
          });
       });
      })
  }
  PatientChange(footFallID){
    const ctrl = this;
    const distinctDateArrayTemp = [];
    const obj = {
      "SP_String": "BSHPL_Call_Centre",
      "Report_Name_String":"CRM_Get_Followup",
      "Json_Param_String": JSON.stringify([{Foot_Fall_ID : footFallID}]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      ctrl.followUpLists = data.length ? data:[];
      for (let i = 0; i < ctrl.followUpLists.length; i++) {
          distinctDateArrayTemp.push(ctrl.followUpLists[i].Posted_On_C);
      }
      const unique = distinctDateArrayTemp.filter(function(value, index, self){
                      return self.indexOf(value) === index;
                      })
        ctrl.distinctDateArray = unique;
   })
  } 
  EditCustomer(valid){

  }
  Appointment(valid){

  }
  getFollowupByDate(dateStr) {
    return this.followUpLists.filter((item) => item.Posted_On_C === dateStr);
  }
  FollowupActionChanged(){

  }
  GetCallDetails(){

  }
  changeStatusForFollowupCreation(e){

  }
  GetAction(){
    this.ActionList = [];
    const obj = {
        "SP_String": "BSHPL_Call_Centre",
        "Report_Name_String":"CRM_Get_Request_Type",
        "Json_Param_String": JSON.stringify([{Mobile : this.Parammobile}]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.ActionList = data;
       console.log("ActionList==",this.ActionList);
     
      })
  }
  SaveFollowUp(valid){
   this.folloupFormSubmit = false
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
          this.objFollowUpCreation = new Followup();
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
  ngOnDestroy() {
    $('header.main-header').css({
      'display' :'block'
    })
    $('div.content-wrapper').css({
      'margin' :'230px'
    })
    $('aside.main-sidebar').css({
      'display' :'block'
    })
    $('footer.main-footer').css({
      'display' :'block'
    })
  }
}
class Followup{
  Foot_Fall_ID:any
  Followup_Details:any
  Followup_Action:any
  User_ID:any
  Next_Followup2:any
  CallID :any
}