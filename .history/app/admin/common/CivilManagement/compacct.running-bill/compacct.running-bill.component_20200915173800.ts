import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { MessageService } from "primeng/api";
import * as moment from "moment";

import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
declare var $:any;

@Component({
  selector: 'app-compacct-running-bill',
  templateUrl: './compacct.running-bill.component.html',
  styleUrls: ['./compacct.running-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CompacctRunningBillComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Create";
  Spinner = false;
  items = [];

  RoadList = [];
  ProjectList = [];
  ObjSearch = new Search();
  SerachFormSubmitted = false;


  SelectedItemCode:any;
  SelectedSubItemCode:any;
  BOQData = [];
  ItemList = [];
  BridgeItemData =[];
  SubItemList = [];

  RunningFormSubmitted = false;
  RunningDetailList = [];
  ObjRunningBill = new RunningBill();
  RunningDate = new Date();
  CurrencyUptoDateAmount = undefined;
  CurrencyThisBillAmount = undefined;
  DetailsOfRoadModal = false;
  DetailsOfRoadViewLabel = {};
  public data: Object[] = [];

  constructor(private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
     this.Header.pushHeader({
      Header: "Civil Running Bill Details",
      Link: " Civil -> Civil Running Bill Details"
    });
    this.GetRoad();
    console.log('g')
  }
  GetRoad() {
    this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Project_Short_Name_Json")
      .subscribe((data: any) => {
        const roadData = data ? JSON.parse(data) : [];
        roadData.forEach(el => {
          this.RoadList.push({
            label: el.Project_Short_Name,
            value: el.Project_Short_Name
          });
        });
      });
  }
  getQuote(Foot_Fall_ID) {
    this.ObjRunningBill.Quoted_Percentage =  undefined;
    if(Foot_Fall_ID) {
      this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_BOQ_Quoted_Percentage_Excel?Foot_Fall_ID="+Foot_Fall_ID)
        .subscribe((data: any) => {
         console.log(data)
         const per = data ? JSON.parse(data)[0].Quoted_Percentage_Excel: 0;
         this.ObjRunningBill.Quoted_Percentage = per.toString();
         this.ObjRunningBill.Quoted_Type = (this.ObjRunningBill.Quoted_Percentage.includes("-") && !(Number(this.ObjRunningBill.Quoted_Percentage) === 0)) ? 'Less' : Number(this.ObjRunningBill.Quoted_Percentage) ? 'Excess' : 'Scheduled Rate'

        });
    }
  }
  Search(valid){
    this.SerachFormSubmitted = true;
    if (valid) {
      this.Spinner = true;
      const obj = new HttpParams()
      .set("Project_Short_Name", this.ObjSearch.Project_Short_Name)
      .set("Agreement_Number", this.ObjSearch.Agreement_Number ?  this.ObjSearch.Agreement_Number : '')
      this.$http
        .get("/BL_Txn_Civil_Daily_Job/Get_Entry_Daily_Job_Browse_Json", { params: obj })
        .subscribe((data: any) => {
          this.ProjectList = data.length ? JSON.parse(data) : [];
          this.Spinner = false;
          this.SerachFormSubmitted = false;
        });
    }
  }

  GetBOQData(id) {
    this.ItemList = [];
    if(id) {
    this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Item_Code_Json?Project_ID="+ id)
      .subscribe((data: any) => {
        this.BOQData = data ? JSON.parse(data) : [];
        this.BOQData.forEach(el => {
          this.ItemList.push({
            label:  el.Sl_No +' ' +el.Item_Code,
            value: el.Item_Code
          });
        });
      });
    }
  }
  ItemCodeChange(obj) {
    this.ObjRunningBill.Item_Code = undefined;
    this.ObjRunningBill.Unit = undefined;
    this.ObjRunningBill.Sub_Item_Code = undefined;
    this.ObjRunningBill.Qnty_Executed_Upto_Date = undefined;
    this.ObjRunningBill.Estimated_Rate = undefined;
    this.ObjRunningBill.Item_Sl_No = undefined;
    this.ObjRunningBill.Qnty_Executed_Of_This_Bill = undefined;
    this.ObjRunningBill.Estimated_Rate = undefined;
    this.SubItemList = [];
    this.BridgeItemData = [];
    if(obj) {
      const temObj = $.grep(this.BOQData,function(arr){ return arr.Item_Code === obj})[0];
      this.ObjRunningBill.Item_Code = obj;
      this.ObjRunningBill.Unit = temObj.Unit;
      this.ObjRunningBill.Item_Sl_No = temObj.Sl_No;
      this.ObjRunningBill.Estimated_Rate = temObj.Estimated_Rate;
      this.GetSubItems(temObj.BOQ_Txn_ID);
    }
  }
  GetSubItems(boqID){
    if(boqID) {
      this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Bridge_Culvart_Sub_Code_Json?BOQ_Txn_ID="+boqID)
      .subscribe((data: any) => {
        this.BridgeItemData = JSON.parse(data);
        if(this.BridgeItemData.length) {
          this.BridgeItemData.forEach(el => {
            this.SubItemList.push({
              label: el.Sl_No +' ' +el.Item_Code,
              value: el.Item_Code
            });
          });
        }
      });
    }
  }
  SubItemCodeChange(obj) {
    this.ObjRunningBill.Sub_Item_Code = undefined;
    if(obj) {
      this.ObjRunningBill.Sub_Item_Code = obj;
      const temObj = $.grep(this.BridgeItemData,function(arr){ return arr.Item_Code === obj})[0];
      this.ObjRunningBill.Item_Sl_No = temObj.Sl_No;
      if(!this.ObjRunningBill.Unit) {
        this.ObjRunningBill.Unit = temObj.Unit;
      }
      if(!this.ObjRunningBill.Estimated_Rate) {
        this.ObjRunningBill.Estimated_Rate = temObj.Estimated_Rate;
      }
      if(this.ObjRunningBill.Qnty_Executed_Upto_Date || this.ObjRunningBill.Qnty_Executed_Of_This_Bill) {
        this.calculateAmount();
      }
    }
  }

  // GET PREVIOUS RA BILL IF EXIST
  GetPreviousRunningBill() {
    if(this.ObjRunningBill.Running_Bill_Sl_No) {
    this.$http
    .get("/BL_Txn_Civil_Running_Bill_Details/Get_Running_Bill_Details?Running_Bill_Sl_No="+ this.ObjRunningBill.Running_Bill_Sl_No)
      .subscribe((data: any) => {
        console.log(data);
      });
    }
  }


  EntryRunningBillDetails(obj) {
    const crl = this;
    this.ObjRunningBill.Tender_Name = undefined;
    this.ObjRunningBill.Agreement_Number = undefined;
    this.ObjRunningBill.Agreement_Amount = undefined;
    this.ObjRunningBill.Date_of_Commencement = undefined;
    this.ObjRunningBill.Date_of_Completion = undefined;
    this.ObjRunningBill.Bidder_Name = undefined;
    if(obj.Project_ID) {
      this.ObjRunningBill.Tender_Name = obj.Tender_Name;
      this.ObjRunningBill.Agreement_Number = obj.Agreement_Number;
      this.ObjRunningBill.Agreement_Amount = obj.Agreement_Value;
      this.ObjRunningBill.Date_of_Commencement = obj.Date_of_Commencement;
      this.ObjRunningBill.Date_of_Completion = obj.Date_of_Completion;
      this.ObjRunningBill.Bidder_Name = obj.Bidder_Name;
      this.GetBOQData(obj.Project_ID);
      this.getQuote(obj.Foot_Fall_ID);
      const name  = this.ObjSearch.Project_Short_Name;
      this.items[1] = "CREATE RUNNING BILL DETAILS FOR "+name.toUpperCase();
      setTimeout(function(){
        crl.tabIndexToView = 1;
      })
    }
  }
  GetRunningDate (date) {
    if (date) {
      this.ObjRunningBill.RB_Date = this.DateService.dateConvert(
        moment(date, "YYYY-MM-DD")["_d"]
      );
    }
  }
  AmountChange(e,amount){
    if(e) {
      const x= e.toString();
      const number = Number(e);
      const k =  number.toLocaleString('en-IN', {
          maximumFractionDigits: 2,
          style: 'currency',
          currency: 'INR'
      });
      if (amount === 'this') {
        this.CurrencyThisBillAmount = k;
      }
      if (amount === 'upto') {
        this.CurrencyUptoDateAmount = k;
      }
      if(amount === 'return') {
        return k;
      }
    }
  }
  CurrencyView(e){
    if(e) {
      const x= e.toString();
      const number = Number(e);
      const k =  number.toLocaleString('en-IN', {
          maximumFractionDigits: 2,
          style: 'currency',
          currency: 'INR'
      });
      return k;
    }
  }
  check3Digit(val:any,field) {
    this.ObjRunningBill[field] = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
    this.calculateAmount();
  }
  calculateAmount() {
    this.ObjRunningBill.Upto_Date_Amount = undefined;
    this.ObjRunningBill.This_Bill_Amount =  undefined;
    this.CurrencyUptoDateAmount = undefined;
    this.CurrencyThisBillAmount = undefined;
    if(this.ObjRunningBill.Qnty_Executed_Upto_Date && this.ObjRunningBill.Estimated_Rate) {
      const amt = Number(this.ObjRunningBill.Qnty_Executed_Upto_Date) * Number(this.ObjRunningBill.Estimated_Rate);
      this.ObjRunningBill.Upto_Date_Amount = amt.toFixed(2);
      this.AmountChange(this.ObjRunningBill.Upto_Date_Amount,'upto');
      if(this.ObjRunningBill.Qnty_Executed_Of_This_Bill) {
        const amt = Number(this.ObjRunningBill.Qnty_Executed_Of_This_Bill) * Number(this.ObjRunningBill.Estimated_Rate);
        this.ObjRunningBill.This_Bill_Amount = amt.toFixed(2);
        this.AmountChange(this.ObjRunningBill.This_Bill_Amount,'this');
      }
    }
  }

  AddRunDetailList(valid) {
    if(valid) {
      this.ObjRunningBill.RB_Date = this.ObjRunningBill.RB_Date ? this.ObjRunningBill.RB_Date :  this.DateService.dateConvert(new Date());
      this.RunningDetailList.push(this.ObjRunningBill);
      this.data = this.RunningDetailList;
      this.clearAddData();
      this.GetAllCalculation();
    }
  }
  DeleteRunDetails(index) {
    this.RunningDetailList.splice(index, 1);
    this.GetAllCalculation();
  }
  viewDetailOfRoad(obj){
    this.DetailsOfRoadViewLabel = {};
    if(obj.Running_Bill_Sl_No) {
      this.DetailsOfRoadViewLabel['Tender_Name'] = obj.Tender_Name;
      this.DetailsOfRoadViewLabel['Agreement_Number'] = obj.Agreement_Number;
      this.DetailsOfRoadViewLabel['Agreement_Amount'] = obj.Agreement_Amount;
      this.DetailsOfRoadViewLabel['Bidder_Name'] = obj.Bidder_Name;
      this.DetailsOfRoadViewLabel['Date_of_Commencement'] = obj.Date_of_Commencement;
      this.DetailsOfRoadViewLabel['Date_of_Completion'] = obj.Date_of_Completion;
      this.DetailsOfRoadModal = true;
    }
  }
  clearAddData() {
    const obj = this.ObjRunningBill;
    this.SelectedItemCode = undefined;
    this.SelectedSubItemCode = undefined;
    this.SubItemList = [];
    this.CurrencyUptoDateAmount = undefined;
    this.CurrencyThisBillAmount = undefined;
    this.ObjRunningBill = new RunningBill();
    this.ObjRunningBill.RB_Date = this.DateService.dateConvert(new Date(obj.RB_Date));
    this.ObjRunningBill.Running_Bill_Sl_No = obj.Running_Bill_Sl_No;
    this.ObjRunningBill.Tender_Name = obj.Tender_Name;
    this.ObjRunningBill.Agreement_Number = obj.Agreement_Number;
    this.ObjRunningBill.Quoted_Percentage = obj.Quoted_Percentage;
    this.ObjRunningBill.Quoted_Type = obj.Quoted_Type;
    // this.ObjRunningBill.Agreement_Amount = obj.Agreement_Amount;
    this.ObjRunningBill.Date_of_Commencement = obj.Date_of_Commencement;
    this.ObjRunningBill.Date_of_Completion = obj.Date_of_Completion;

  }

  GetAllCalculation() {
    let Upto_Date_Amount = 0;
    for(let i = 0; i < this.RunningDetailList.length;i++) {
      Upto_Date_Amount += Number(this.RunningDetailList[i].Upto_Date_Amount);

    }

    const n = this.ObjRunningBill.Quoted_Percentage.includes("-");
    const percentage = n ? this.ObjRunningBill.Quoted_Percentage.replace("-", "") : this.ObjRunningBill.Quoted_Percentage;
    const PercentageVal = (( Number(percentage) / 100) * Number(Upto_Date_Amount));
    const Rate = n ?  Number(Upto_Date_Amount) - PercentageVal :  Number(Upto_Date_Amount) + PercentageVal;

    this.ObjRunningBill.Total_This_Bill_Amount = Upto_Date_Amount.toFixed(2);
    this.ObjRunningBill.Total_Gross_Amount_This_Bill = Rate.toFixed(2);
    this.ObjRunningBill.Quoted_Percentage_Amount_This_Bill = PercentageVal.toFixed(2);
    this.ObjRunningBill.GST_Amount_This_Bill = ( Number(this.ObjRunningBill.Total_Gross_Amount_This_Bill) * this.ObjRunningBill.GST_Percentage / 100).toFixed(2);
    this.ObjRunningBill.Grand_Total_Amount_This_Bill = (Number(this.ObjRunningBill.Total_Gross_Amount_This_Bill) + Number(this.ObjRunningBill.GST_Amount_This_Bill)).toFixed(2);
    const Net_Value = (Number(this.ObjRunningBill.Deduct_Work_Value) + Number(this.ObjRunningBill.Grand_Total_Amount_This_Bill)).toFixed();
    this.ObjRunningBill.Net_Value = Number(Net_Value).toFixed(2);
  }

  // SAVE
  SaveRABill(valid) {
      this.RunningFormSubmitted = true;
      if (valid && this.RunningDetailList.length) {
        this.Spinner = true;
        const UrlAddress = "/BL_Txn_Civil_Running_Bill_Details/Create_Edit_Civil_Running_Bill_Details";
        const obj = { Civil_Running_Bill_String: JSON.stringify(this.RunningDetailList) };
        this.$http.post(UrlAddress, obj).subscribe((data: any) => {
          console.log(data)
          if (data.success) {
            console.group("Compacct V2");
            console.log("%c  RA Sucess:", "color:green;");
            console.log("/BL_Txn_Civil_Running_Bill_Details/Create_Edit_Civil_Running_Bill_Details");
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "" ,
              detail: this.ObjRunningBill.RB_ID ? "Succesfully RA Bill Updated" : "Succesfully RA Bill Created"
            });
            this.Spinner = false;
            this.tabIndexToView = 0;
            this.clearData()
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        });
      }
  }



   // Clear & Tab
   TabClick(e) {
    this.tabIndexToView = e.index;
    this.buttonname = "Create";
   // this.clearData();
  }
  clearData() {
    this.SelectedItemCode = undefined;
    this.SelectedSubItemCode = undefined;
    this.SubItemList = [];
    this.CurrencyUptoDateAmount = undefined;
    this.CurrencyThisBillAmount = undefined;
    this.ObjRunningBill = new RunningBill();
    this.RunningFormSubmitted = false;
  }
}
class Search{
  Project_Short_Name:string;
  Agreement_Number:string;
}
class RunningBill{

  Tender_Name:string;
  Agreement_Number:string;
  Agreement_Amount:string;
  Date_of_Commencement:string;
  Date_of_Completion:string;
  Bidder_Name:string;

RB_ID = 0;
Running_Bill_Sl_No :string;
RB_Date :string;
Item_Sl_No :string;
Item_Code :string;
Sub_Item_Code :string;
Qnty_Executed_Upto_Date :string;
Qnty_Executed_Of_This_Bill :string;
Unit :string;
Estimated_Rate :string;
Upto_Date_Amount :string;
This_Bill_Amount :string;
Remarks :string;
Total_This_Bill_Amount :string;
Quoted_Type :string;
Quoted_Percentage :string;
Quoted_Percentage_Amount_This_Bill :string;
Total_Gross_Amount_This_Bill :string;
GST_Percentage = 12;
GST_Amount_This_Bill :string;
Grand_Total_Amount_This_Bill :string;
Deduct_Work_Value = 0 ;
Net_Value :string;
Is_Visible :string;
}
