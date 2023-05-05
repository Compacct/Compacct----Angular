import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/primeng';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"

@Component({
  selector: 'app-np-sup-tkt-sales-return-accounts',
  templateUrl: './np-sup-tkt-sales-return-accounts.component.html',
  styleUrls: ['./np-sup-tkt-sales-return-accounts.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NPSupTktSalesReturnAccountsComponent implements OnInit {
  items:any = []
  tabIndexToView: number = 1;
  pendinglist:any = [];
  pendinglistlistHeader: any = [];
  ShowModal: boolean = false; 
  UpdateList: any = [];
  Ticket: any = undefined;
  DocDate: any = [];
  DocDateShow: any = [];
  ChotoShowModal: boolean = false;
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService: DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService,
  ) { }

  ngOnInit(){
    this.items = ["APPROVED","PENDING"];
    this.Header.pushHeader({
      Header: "Accounts",
      Link: "Ticket Management -> Sales Return Accounts"
    });
    this.getSearchedPendinglist();
  }
  TabClick(e:any){
    this.tabIndexToView = e.index;
    this.items =["APPROVED","PENDING"];
    this.clearData()
  }
  onReject(){}
  clearData(){
  }
  AddRow(){}
  getSearchedPendinglist(){
    this.pendinglist = []
    this.pendinglistlistHeader = []
    const obj = {
      'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
      'Report_Name_String':  "Get_Accounts_Entry_Browse",
      'Json_Param_String': JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}]),
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      if(data.length){
        if(data[0].hasOwnProperty('Return_Date')){
          data.forEach((ele:any) => {
            ele.Return_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(ele.Return_Date);
          });
        }
      this.pendinglist = data
      this.pendinglistlistHeader = Object.keys(data[0])
      }
    })
  }
  getStatusWiseColor(Status:any) {
  switch (Status) {
           case 'CREATED':
               return 'red';
               break;
           case 'APPROVED':
               return 'blue';
               break;
           case 'MATERIAL PICKED':
               return 'orange';
               break;
           case 'ACCOUNTS ENTRY DONE':
             return 'green';
             break;
          default:
       }  
   return
  }
  FinalUpdatePending() {
    
  }
  TicketPOP(Cool:any) {
    this.Ticket = undefined;
    this.UpdateList = [];
     if (Cool.Ticket_No) {
      this.Ticket = Cool.Ticket_No;
      const obj = {
      'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
      'Report_Name_String':  "Get_Accounts_Pending_Data",
      'Json_Param_String': JSON.stringify([{Ticket_No : this.Ticket}]),
    }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data.length) {
          this.UpdateList = JSON.parse(data[0].Output)
          this.DocDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(this.UpdateList[0].Request_Date);
          //  this.UpdateList.forEach((ele:any) => {
          //     ele.Received_Amount = ele.Approved_Amount
          //     ele.Received_Qty = ele.Approved_Qty
          //     ele.Received_Tax_Amount = ele.Approved_Tax_Amount
          //     ele.Received_User_ID = this.$CompacctAPI.CompacctCookies.User_ID
          //   });
          console.log(this.UpdateList)
          this.ShowModal = true;
        }
      });
    }
  }
  SmallPopOpen() {
    this.ChotoShowModal = true;
  }
}
