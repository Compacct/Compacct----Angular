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
  selector: 'app-bshp-ameyo-kb',
  templateUrl: './bshp-ameyo-kb.component.html',
  styleUrls: ['./bshp-ameyo-kb.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BSHPAmeyoKBComponent implements OnInit {
  items=[];
  tabIndexToView = 0;
  objameyoKb = new ameyoKb();
  url = window["config"];
  userDataList = [];
  FollowupDate = new Date();
  seachSpinner = false;
  ameyoKBFormSubmit = false;
  getAllFollowUpdata = [];
  Param_Flag = "";
  displayDial = false;
  DialFormSubmit = false;
  PhoneNo = "";
  campaignId = undefined;
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
      this.Param_Flag = params['call'];
      this.campaignId = params['campaignId']
      console.log ("call",this.Param_Flag);
     })
   }

  ngOnInit() {
    this.items = ["FOLLOW UP"];
    this.Header.pushHeader({
      Header: "FOLLOW UP",
      Link: "CRM -> FOLLOW UP"
    });
    this.getuserList();
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
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["FOLLOW UP"];
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){

  }
  getuserList(){
    const obj = {
      "SP_String": "BSHPL_Call_Centre",
      "Report_Name_String":"Get_Sales_Man_with_below_members",
      "Json_Param_String": JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.userDataList = data
     })
  }
  GetSearchedList(valid){
    this.ameyoKBFormSubmit = true
     if(valid){
      const obj = {
        "SP_String": "BSHPL_Call_Centre",
        "Report_Name_String":"GetLeadList",
        "Json_Param_String": JSON.stringify([{User_ID : this.objameyoKb.User_ID, Next_Followup : this.DateService.dateConvert(this.FollowupDate)}]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log("data",data);
         this.getAllFollowUpdata = data
       })
     }
  }
  openDial(){
    this.PhoneNo = "";
    this.DialFormSubmit = false;
    this.displayDial = true;
  }
  SaveDial(valid){
    this.DialFormSubmit = false
   if(valid){
    var obj = { 
      campaignId: this.campaignId, 
      sessionId: this.$CompacctAPI.CompacctCookies.Amyo_sessionId, 
      phone: this.PhoneNo }
      this.$http
      .post(this.url.apiAmeyoDialAPI,{LinkString: JSON.stringify(obj) })
      .subscribe((data: any) => {
        if (data.data.result == "success") {
          this.displayDial = false
          this.PhoneNo = undefined;
          this.DialFormSubmit = false
      }
      })
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
class ameyoKb{
  Next_Followup:any;
  User_ID:any;

}