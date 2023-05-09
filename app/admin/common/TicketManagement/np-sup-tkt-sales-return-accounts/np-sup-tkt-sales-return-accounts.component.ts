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
  bckUpdateList:any = []
  Ticket: any = undefined;
  DocDate: any = [];
  DocDateShow: any = [];
  ChotoShowModal: boolean = false;
  AddList: any = [];
  ObjSmallPop: SmallPop = new SmallPop();
  AClist: any = [];
  AddButtonEnb: boolean = false;
  objsale: any = {};
  UpdateListIndex: any = undefined;
  Approvelist:any =[];
  ApprovelistHeader: any = [];
  ViewModal: boolean = false;
  ViewList: any = [];
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
    this.ApproveSerch()
  }
  TabClick(e:any){
    this.tabIndexToView = e.index;
    this.items =["APPROVED","PENDING"];
    this.clearData()
  }
  onReject(){}
  clearData(){
  }
  AddPop() {
    if (this.ObjSmallPop.Accounts_Qty && this.ObjSmallPop.Accounts_Rate) {
      this.AddList.push({
        Accounts_Qty : this.ObjSmallPop.Accounts_Qty,
        Accounts_Rate: this.ObjSmallPop.Accounts_Rate,
        Accounts_Rate_Total: Number(this.ObjSmallPop.Accounts_Qty) * Number(this.ObjSmallPop.Accounts_Rate)
      })
        let GetTotalPro = this.GetTotalPro()
      if ((Number(GetTotalPro)) >= this.objsale.Received_Qty ) {
         this.AddButtonEnb = true
      } else {
        this.AddButtonEnb = false
      }
      this.GetPrice()
      this.ObjSmallPop = new SmallPop();
    }
  }
  delete(i:any) {
    this.AddList.splice(i, 1);
    this.AddButtonEnb = false;
  }
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
  ApproveSerch() {
    this.Approvelist = []
    this.ApprovelistHeader = [];
    const obj = {
      'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
      'Report_Name_String':  "Get_Accounts_Approved_Browse",
      'Json_Param_String': JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}]),
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      if(data.length){
        if(data[0].hasOwnProperty('Return_Date')){
          data.forEach((ele:any) => {
            ele.Return_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(ele.Return_Date);
          });
        }
      this.Approvelist = data
      this.ApprovelistHeader = Object.keys(data[0])
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
  FinalUpdateSmall() {
    if (this.AddList.length) {
      if (Number(this.GetTotalPro()) !== Number(this.objsale.Received_Qty)) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Total Qty Not Match Received Qty",
        });
        return
      } else { 
        this.UpdateList[this.UpdateListIndex].Ac =  this.AddList
        //console.log("FinalUpdateSmall",this.UpdateList)
        this.UpdateListIndex = undefined
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Adjust Rate",
            detail: "Succesfully Save",
          });
          this.ChotoShowModal = false;
        this.objsale.Received_Amount = Number(this.GetPrice())
       }  
    }  
  }
  ChotoShowModalClose() {
    this.ChotoShowModal = false
    //this.UpdateList[this.UpdateListIndex].Ac = [...this.bckUpdateList[this.UpdateListIndex].Ac]
  }
  TicketPOP(Cool:any) {
    this.Ticket = undefined;
    this.UpdateList = [];
    this.bckUpdateList = []
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
          this.bckUpdateList = JSON.parse(data[0].Output)
          this.DocDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(this.UpdateList[0].Request_Date); 
          //console.log(this.UpdateList)
          this.ShowModal = true;
        }
      });
    }
  }
  SmallPopOpen(i: any, objsale: any) {
    //console.log("index", i)
    this.UpdateListIndex = i
    this.ChotoShowModal = true;
    this.objsale = {}
    this.objsale = objsale
    this.ObjSmallPop = new SmallPop();
    this.AClist = [];
    this.AddList = [...objsale.Ac]
    this.AddButtonEnb = true
  }
  CheckQty() {
    if (this.ObjSmallPop.Accounts_Qty) {
      let GetTotalPro = this.GetTotalPro()
      if ((Number(GetTotalPro) + Number(this.ObjSmallPop.Accounts_Qty)) > this.objsale.Received_Qty ) {
         this.AddButtonEnb = true
      } else {
        this.AddButtonEnb = false
      }
  }  
  }
  GetTotalPro() {
    let flg: Number = 0
    this.AddList.forEach((ele: any) => {
      flg = Number(ele.Accounts_Qty) + Number(flg)
    });
    return flg
    
  }
  GetPrice() {
    let flg: Number = 0
    this.AddList.forEach((ele: any) => {
      flg = Number(ele.Accounts_Rate_Total) + Number(flg)
    });
    return flg  
  }
  FinalUpdatePending() {
    let saveDataList: any = []
    if (this.UpdateList.length) {
      this.UpdateList.forEach((ele: any) => {
        saveDataList.push({
          Ticket_No: ele.Ticket_No,
          Product_ID: ele.Product_ID,
          Rate: ele.Rate,
          Accounts_Amount: ele.Received_Amount ? ele.Received_Amount : 0,
          Accounts_User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
          Ac: ele.Ac
        })
        //console.log("saveDataList",saveDataList)
      })
    }
    if (saveDataList.length) {
        const obj = {
        'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
        'Report_Name_String': "Update_For_Accounts",
        'Json_Param_String': JSON.stringify(saveDataList),
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data[0].Column1 == "Done") {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Sales Return Account",
            detail: "Succesfully Update",
          });
          this.ShowModal = false;
          this.getSearchedPendinglist();
          this.tabIndexToView = 0
          this.ApproveSerch();
          }
        }) 
      }    
  }
  ViewTicket(col:any){
    this.Ticket = undefined;
    this.ViewList = [];
    if (col.Ticket_No) {
      this.Ticket = col.Ticket_No;
    const obj = {
      'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
      'Report_Name_String':  "Get_Accounts_Approved_Data",
      'Json_Param_String': JSON.stringify([{Ticket_No : this.Ticket}]),
    }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data.length) {
          this.ViewList = JSON.parse(data[0].Output)
          this.DocDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(this.ViewList[0].Request_Date); 
          //console.log(this.ViewList)
          this.ViewModal = true;
        }
      });
    }
  }
  onConfirm(){}
}
class SmallPop{
  Accounts_Qty:number ;
  Accounts_Rate:number;
}
