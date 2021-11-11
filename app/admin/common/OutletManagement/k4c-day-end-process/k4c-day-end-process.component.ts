import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";

@Component({
  selector: 'app-k4c-day-end-process',
  templateUrl: './k4c-day-end-process.component.html',
  styleUrls: ['./k4c-day-end-process.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cDayEndProcessComponent implements OnInit {
  items = [];
  Spinner = false;
  saveSpinner = false;
  seachSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  Datevalue : any = Date ;
  myDate: Date;
  minDate:Date;
  maxDate:Date;
  Cost_Cen_ID = undefined
  costCenterList = [];
  sp_string = "SP_K4C_Day_End_Process"
  paymentList = [];
  closeingUpdate = "";
  closeingstatus = undefined;
  paymentListlength = undefined;
  allDataList = [];
  req_date_B:string;
  req_date2:string;
  Cost_Cen_ID_B = undefined;
  costCenterDis = true;
  mismatch = false;
  Total:any;
  VarianceTotal: any;
  SystemAmttotal: any;
  viewList = [];
  viewpopup = false;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    $(".content-header").removeClass("collapse-pos");
    $(".content").removeClass("collapse-pos");
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Day End Process",
      Link: " Outlet -> Day End Process"
    });
    this.GetProDate();
    this.GetCostCenter();
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
    this.clearData();
   }
  onConfirm(){}
  onReject(){}
  clearData(){
    this.Spinner = false;
    this.seachSpinner = false;
    this.saveSpinner = false;
    this.paymentList = [];
    this.closeingUpdate = "";
    this.closeingstatus = undefined;
    this.buttonname = "Save";
    this.mismatch = false;
    this.GetProDate();
  }
  getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.req_date_B = dateRangeObj[0];
      this.req_date2 = dateRangeObj[1];
    }
  }
  GetBrowse(valid){
    console.log("valid",valid);
    if(valid){
      this.Spinner = true;
      const start = this.req_date_B
      ? this.DateService.dateConvert(new Date(this.req_date_B))
      : this.DateService.dateConvert(new Date());
    const end = this.req_date2
      ? this.DateService.dateConvert(new Date(this.req_date2))
      : this.DateService.dateConvert(new Date());
    const tempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      From_Date :start,
      To_Date :end,
    }
    const obj = {
      "SP_String": this.sp_string,
      "Report_Name_String": "Browse_K4C_Outlet_Day_END",
      "Json_Param_String" :  JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.allDataList = data;
      console.log("browse",this.allDataList);
      this.Spinner = false;
    })
    }

  }
  GetProDate(){
    const obj = {
      "SP_String": this.sp_string,
      "Report_Name_String": "GET_Bill_Date"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{

      this.myDate =  new Date(data[0].Bill_Date);
      this.Datevalue = new Date(data[0].Bill_Date);
      console.log("Datevalue",this.Datevalue);
      let Datetemp:Date =  new Date(data[0].Bill_Date)
      const Timetemp =  Datetemp.setDate(Datetemp.getDate() - 1);
      this.minDate = new Date(Timetemp);
      console.log("minDate==", this.minDate)
      let tempDate:Date =  new Date(data[0].Bill_Date)
      const tempTimeBill =  tempDate.setDate(tempDate.getDate() + 1);
      this.maxDate = this.Datevalue;
      console.log("maxDate==", this.maxDate)

    })
  }
  GetCostCenter(){
    const tempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
      "SP_String": this.sp_string,
      "Report_Name_String": "GET_Cost_center",
      "Json_Param_String" :  JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.costCenterList = data;
      this.Cost_Cen_ID = this.costCenterList[0].Cost_Cen_ID;
      this.Cost_Cen_ID_B = this.costCenterList[0].Cost_Cen_ID;
      console.log("Cost Center",this.costCenterList);
    })
  }
  GetPaymentType(){
    this.Total = [];
    this.VarianceTotal = [];
    if(this.Datevalue){
      this.seachSpinner = true;
      const tempObj = {
        Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        Date : this.DateService.dateConvert(new Date(this.Datevalue))
      }
      const obj = {
        "SP_String": this.sp_string,
        "Report_Name_String": "GET_Day_End_Data",
        "Json_Param_String" :  JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("data",data);
        this.paymentList = data;
        this.paymentList.forEach(element => {
          element['Amount'] = undefined;
        });
        this.paymentListlength = this.paymentList.length;
        this.GetclosingStatus();
        this.seachSpinner = false;
      })
    }
  }
  getTotalValue(key){
    this.SystemAmttotal = undefined;
    let Amtval = 0;
    this.paymentList.forEach((item)=>{
      Amtval += Number(item[key]);
    });
    this.SystemAmttotal = Amtval.toFixed(2);
    return Amtval ? Amtval.toFixed(2) : '-';
  }
  getTotalAmt(){
    this.Total = undefined;
    let totalAmtval = 0;
    this.paymentList.forEach((item)=>{
     totalAmtval += Number(item.Amount);
    });
    //totalAmtval += this.paymentList[indx]['Amount'];
    this.Total = totalAmtval ? totalAmtval.toFixed(2) : 0;
    return totalAmtval ? totalAmtval.toFixed(2) : 0;
  }
  getTotalVar(){
    this.VarianceTotal = undefined;
    let totalVarval = 0;
    this.paymentList.forEach((item)=>{
      totalVarval += Number(item.Variance);
    });
    this.VarianceTotal = totalVarval.toFixed(2);
    return totalVarval ? totalVarval.toFixed(2) : 0;
  }
  VarianceChq(indx){
    this.paymentList[indx]['Variance'] =  0;
   // this.paymentList[indx]['Amount'] = 0;
    if(this.paymentList[indx]['Total_Amount'] && this.paymentList[indx]['Amount']){
      this.paymentList[indx]['Variance'] = (this.paymentList[indx]['Total_Amount'] - this.paymentList[indx]['Amount']).toFixed(2);
    }
  //   this.Total = undefined;
  //   let totalAmtval = 0;
  //   this.paymentList.forEach((item)=>{
  //    totalAmtval += Number(item.Amount);
  //  });
    //totalAmtval += this.paymentList[indx]['Amount'];
    // this.Total = totalAmtval ? totalAmtval : '-';
   // return totalAmtval ? totalAmtval : '-';
  //  this.VarianceTotal = undefined;
  //   let totalVarval = 0;
  //   this.paymentList.forEach((item)=>{
  //     totalVarval += Number(item.Variance);
  //   });
  //   this.VarianceTotal = totalVarval;

  }
  GetclosingStatus(){
    if(this.Datevalue){
      const tempObj = {
        Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        Date : this.DateService.dateConvert(new Date(this.Datevalue))
      }
      const obj = {
        "SP_String": "SP_K4C_Day_End_Process",
        "Report_Name_String": "GET_Closing_Stock_Status",
        "Json_Param_String" :  JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("Status",data);
        this.closeingUpdate = data[0].Closing_Stock_Status;
      })
    }
  }
  saveDayEnd(){
    let temparr = [];
    let saveValue = false;
    this.mismatch = true;
   // const sameValArr = this.paymentList.filter(item=> item.Total_Amount !== Number(item.Amount) );
    if(this.paymentList.length && this.closeingstatus){
      if( this.closeingUpdate === this.closeingstatus && this.closeingUpdate === "YES"){
        this.saveCheck();
      } else{
       // const msg = this.closeingUpdate !== this.closeingstatus ? "CLOSEING STOCK UPDATED MISMATCHED" : "AMOUNT MISMATCHED"
        this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "CLOSEING STOCK UPDATED MISMATCHED"
            });
      }

    }else{
     // const msgarr = sameValArr.length === 0 ? "ENTER AMOUNT" : "SELECT CLOSEING STOCK UPDATED"
      this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Select Closing Stock Update"
            });
    }

  }

  saveCheck(){
   const tempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Date : this.DateService.dateConvert(new Date(this.Datevalue))
    }
    const obj = {
      "SP_String": "SP_K4C_Day_End_Process",
      "Report_Name_String": "GET_Day_End_Save",
      "Json_Param_String" :  JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Save Check",data);
      if(data[0].Status === "NO"){
        this.save()
      }
      else{
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Already saved"
        });
      }
    })
  }
  save(){
    let saveData = [];
    this.saveSpinner = true;
    if (Number(this.SystemAmttotal == this.Total) && Number(this.VarianceTotal == 0)) {
    this.paymentList.forEach(ele =>{
      const TempData = {
        Date : this.DateService.dateConvert(new Date(this.Datevalue)),
        Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        Description : ele.Collection_Mode,
        Manual_Amount : Number(ele.Amount),
        System_Amount : ele.Total_Amount,
        Remarks : ele.Remarks,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID
     }
     saveData.push(TempData)
    })
    const obj = {
      "SP_String": "SP_K4C_Day_End_Process",
      "Report_Name_String": "Save_K4C_Outlet_Day_END",
      "Json_Param_String" :  JSON.stringify(saveData)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("save Data",data);
      this.saveSpinner = false;
      this.clearData();
      if(data[0].Column1 === "Save successfully"){
        this.saveSpinner = true;
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Succesfully ",
          detail: "Day End Process Succesfully Saved"
        });
      }
    })
    }
     else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "System amount is not equal to actual amount"
      });
     }
  }
  View(EOD){
    this.viewList = [];
    const tempObj = {
      Cost_Cen_ID: EOD.Cost_Cen_ID,
      Date : this.DateService.dateConvert(new Date(EOD.Date))
   }
   const obj = {
      "SP_String": "SP_K4C_Day_End_Process",
      "Report_Name_String": "View_K4C_Outlet_Day_END",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.viewList = data;
      //this.date = new Date(data[0].Req_Date)
      this.viewpopup = true;
      console.log("this.viewList",this.viewList);
    })
  }
}
