import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SelectItem } from "primeng/api";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGetDistinctService } from '../../../../shared/compacct.services/compacct-get-distinct.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-direct-payment-followup-nepal',
  templateUrl: './direct-payment-followup-nepal.component.html',
  styleUrls: ['./direct-payment-followup-nepal.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DirectPaymentFollowupNepalComponent implements OnInit {
  snipper= false;
  user = [];
  SearchSubmited = false;
  PendingTillDate = new Date();
  Agent_User_ID = undefined;

  DirectPaymentFollowUpList = [];
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private router : Router,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    public $CompacctAPI: CompacctCommonApi,
    private distService : CompacctGetDistinctService) { 
      this.route.queryParams.subscribe((val:any) => {
        this.Agent_User_ID = undefined;
        this.PendingTillDate = undefined;
        if(val.User_ID && val.Followup) {
          this.Agent_User_ID = window.atob(val.User_ID);
          this.PendingTillDate = new Date(window.atob(val.Followup));
          this.SearchDirectPayment(true);
        }
      } );
    }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Direct Payment Followup",
      Link: " CRM -> Transaction -> Direct Payment Followup"
    });
    this.GetUser();
  }
  GetUser() {
    this.$http
       .get('/BL_CRM_Master_SalesTeam/Get_Sales_Man_for_napal')
       .subscribe((data: any) => {
           this.user = data.length ? data : [];
      
       });
  }
  SearchDirectPayment(valid) {
    this.SearchSubmited = true;
    this.DirectPaymentFollowUpList = [];
    if(valid) {
      this.snipper = true;
      const TempObj = {
        User_ID	: this.Agent_User_ID,
        Due_Date: this.DateService.dateConvert(new Date(this.PendingTillDate)),
      }
      const obj = {
        "SP_String": "SP_Payment_Followup",
        "Report_Name_String": "Get_Pending_No_Of_Bills_Details_For_Payment_Followup",
        "Json_Param_String": JSON.stringify([TempObj])
  
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.DirectPaymentFollowUpList = data;
         this.snipper = false;
       console.log("DirectPaymentFollowUpList ======",this.DirectPaymentFollowUpList);
     });
    }
  }
  RedirectCustomerInteg(id){
   window.open('/BL_CRM_Customer_Interaction_Nepal/index?Sub_ledger_Id='+id +'&FromDirect=Y')
  }
}
