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
  selector: 'app-np-sup-tkt-sales-return-warehouse',
  templateUrl: './np-sup-tkt-sales-return-warehouse.component.html',
  styleUrls: ['./np-sup-tkt-sales-return-warehouse.component.css'],
   providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NPSupTktSalesReturnWarehouseComponent implements OnInit {
  items:any = []
  tabIndexToView: number = 1;
  SearchedBrowselist: any = [];
  SearchedBrowselistHeader: any = [];
  ShowModal: boolean = false;
  UpdateList: any = [];
  Ticket: any = undefined;
  DocDate: any = [];
  DocDateShow: any = [];
  pickuplist:any =[];
  pickuplistlistHeader: any = [];
  ViewModal: boolean = false;
  showdataList: any = [];
  backUPdataListPickup: any = [];
  DistCustomer1:any = [];
  DistUser1:any = [];
  DistStatus1:any = [];
  DistEmployee1: any = [];
  DistEmployeeSelect1:any = [];
  DistStatusSelect1:any = [];
  DistCustomerSelect1:any = [];
  DistUserSelect1: any = [];
  ApproveKye: any = [];
  ApproveKye1: any = [];
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService: DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService,
  ) {}

  ngOnInit() {
     this.items = ["PICK UP DONE","PENDING"];
    this.Header.pushHeader({
      Header: "Sales Return Warehouse",
      Link: "Ticket Management -> Sales Return Warehouse"
    });
    this.getSearchedBrowselist();
    this.getPickupBrowselist();
  }
  TabClick(e:any){
    this.tabIndexToView = e.index;
    this.items =["PICK UP DONE","PENDING"];
    this.clearData()
  }
  onReject(){}
  clearData(){
  }
  getSearchedBrowselist(){
    this.SearchedBrowselist = []
    this.SearchedBrowselistHeader = []
    const obj = {
      'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
      'Report_Name_String':  "Pending_Browse_For_Warehouse",
      'Json_Param_String': JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}]),
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      if(data.length){
        if(data[0].hasOwnProperty('Return_Date')){
          data.forEach((ele:any) => {
            ele.Return_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(ele.Return_Date);
          });
        }
      this.SearchedBrowselist = data
        this.SearchedBrowselistHeader = Object.keys(data[0])
        this.SearchedBrowselistHeader.forEach(element => {
          this.ApproveKye1.push({
            header : element
          })
        });
      }
    })
  }
  getPickupBrowselist(){
    this.pickuplist = []
    this.pickuplistlistHeader = [];
    this.backUPdataListPickup = [];
    const obj = {
      'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
      'Report_Name_String':  "Pickup_Done_For_Warehouse",
      'Json_Param_String': JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}]),
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      if(data.length){
        if(data[0].hasOwnProperty('Return_Date')){
          data.forEach((ele:any) => {
            ele.Return_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(ele.Return_Date);
          });
        }
        this.pickuplist = data;
        this.backUPdataListPickup = data;
        this.pickuplistlistHeader = Object.keys(data[0]);
         this.pickuplistlistHeader.forEach(element => {
          this.ApproveKye.push({
            header : element
          })
        });
        this.GetDistinct1();
      }
    })
  }
  GetDistinct1() {
    let Status: any = [];
    this.DistCustomer1 = [];
    this.DistUser1 = [];
    this.DistStatus1 = [];
    this.DistEmployee1 = [];
    this.pickuplist.forEach((item) => {
      if (Status.indexOf(item.Customer) === -1) {
        Status.push(item.Customer);
        this.DistCustomer1.push({ label: item.Customer, value: item.Customer });
      }
      if (Status.indexOf(item.Status) === -1) {
        Status.push(item.Status);
        this.DistStatus1.push({ label: item.Status, value: item.Status });
      }
       if (Status.indexOf(item.Sales_Executive) === -1) {
        Status.push(item.Sales_Executive);
        this.DistEmployee1.push({ label: item.Sales_Executive, value: item.Sales_Executive });
      }
      if (Status.indexOf(item.User_name) === -1) {
        Status.push(item.User_name);
        this.DistUser1.push({ label: item.User_name, value: item.User_name });
      }    
    });
      this.backUPdataListPickup = [...this.pickuplist];
  }
  FilterDist1() {
    let First: any = [];
    let Second: any = [];
    let three: any = [];
    let fore: any = [];
    let SearchFields: any = [];
    if (this.DistEmployeeSelect1.length) {
      SearchFields.push('Sales_Executive');
      First = this.DistEmployeeSelect1;
    }
    if (this.DistStatusSelect1.length) {
      SearchFields.push('Status');
      Second = this.DistStatusSelect1;
    }
    if (this.DistCustomerSelect1.length) {
      SearchFields.push('Customer');
      three = this.DistCustomerSelect1;
    }
     if (this.DistUserSelect1.length) {
      SearchFields.push('User_name');
      fore = this.DistUserSelect1;
    }
    this.pickuplist = [];
    if (SearchFields.length) {
      let LeadArr = this.backUPdataListPickup.filter(function (e) {
        return (First.length ? First.includes(e['Sales_Executive']) : true)
          && (Second.length ? Second.includes(e['Status']) : true)
          && (three.length ? three.includes(e['Customer']) : true)
          &&(fore.length ? fore.includes(e['User_name']) : true)
      });
      this.pickuplist = LeadArr.length ? LeadArr : [];
    } else {
      this.pickuplist = [...this.backUPdataListPickup];
    }

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
  UpdateTicket(all: any) {
    this.UpdateList = [];
    if (all.Ticket_No) {
      this.Ticket = all.Ticket_No;
      const obj = {
      'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
      'Report_Name_String':  "Get_Pending_Data_For_Warehouse",
      'Json_Param_String': JSON.stringify([{Ticket_No : this.Ticket}]),
    }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data.length) {
          this.DocDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].Request_Date);
          this.UpdateList = data
           this.UpdateList.forEach((ele:any) => {
              ele.Received_Amount = ele.Approved_Amount
              ele.Received_Qty = ele.Approved_Qty
              ele.Received_Tax_Amount = ele.Approved_Tax_Amount
              ele.Received_User_ID = this.$CompacctAPI.CompacctCookies.User_ID
            });
          //console.log(this.UpdateList)
          this.ShowModal = true;
        }
      });
    }
  }
  calculatAmount(ind:any){
    let convert = (v) => {
      return v? v : 0
    }
    this.UpdateList.forEach((ele:any) => {
      if(ele.Received_Qty <= ele.Approved_Qty){
        ele.Received_Amount = ((Number(convert(ele.Received_Qty)) * Number(convert(ele.Approved_Rate))) + Number(convert(ele.Received_Tax_Amount))).toFixed(2) 
      }
      else {
        ele.Received_Amount = 0.00
         this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Received Qty Not More than Qty Approved ",
          });
      }    
    });
  }
  FinalUpdatePending() {
    this.ngxService.start();
    if(this.UpdateList.length){
      let saveDataList:any = []
      this.UpdateList.forEach((ele:any) => {
        if(ele.Received_Qty <= ele.Approved_Qty){
          saveDataList.push({
            Ticket_No: ele.Ticket_No,
            Product_ID: ele.Product_ID,
            Rate: ele.Rate,
            Received_Qty: ele.Received_Qty? ele.Received_Qty : 0,
            Received_Tax_Amount: ele.Received_Tax_Amount ? ele.Received_Tax_Amount : 0,
            Received_Amount: ele.Received_Amount ? ele.Received_Amount:0,
            Received_User_ID: ele.Received_User_ID? ele.Received_User_ID : 0
          })
        } 
      })
      if (saveDataList.length) {
        const obj = {
        'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
        'Report_Name_String':  "Update_For_Warehouse",
        'Json_Param_String': JSON.stringify(saveDataList),
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        if(data[0].Column1 == "Done"){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Sales Return Warehouse",
            detail: "Succesfully Update",
          });
          this.ShowModal = false;
          this.tabIndexToView = 0;
          this.clearData();
          this.getSearchedBrowselist();
          this.getPickupBrowselist();
          this.ngxService.stop()
        }
      })
      }
    }
  }
  ViewTicket(cool:any) {
    this.Ticket = undefined;
    if (cool.Ticket_No) {
      this.Ticket = cool.Ticket_No;
      const obj = {
      'SP_String': "SP_Np_Sup_Tkt_Sales_Return_Request",
      'Report_Name_String':  "Get_Pickup_Done_All_Data",
      'Json_Param_String': JSON.stringify([{Ticket_No : this.Ticket}]),
    }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data.length) {
          this.DocDateShow = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].Request_Date);
          this.showdataList = data
          this.ViewModal = true;         
        }
      });
    } 
  }
}
