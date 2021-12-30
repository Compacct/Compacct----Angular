import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import * as XLSX from 'xlsx';
declare var $:any;

@Component({
  selector: 'app-outlet-group-report',
  templateUrl: './outlet-group-report.component.html',
  styleUrls: ['./outlet-group-report.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class OutletGroupReportComponent implements OnInit {
  tabIndexToView = 0;
  public QueryStringObj : any;
  ObjBrowseStockView : BrowseStockView = new BrowseStockView ();
  Outletid = [];
  GodownId = [];
  outletdisableflag = false;
  stockdisableflag = false;
  DynamicHeader = [];
  Searchlist = [];
  seachSpinner = false;
  ViewStockFormSubmitted = false;

  Param_Flag ='';
  Outlet_Param = '';
  Reportlist = [];
  Searchfundlist = [];
  exceldisable = true;
  totalamount: any;
  orderamount: number;

  constructor(
    private route : ActivatedRoute,
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    $(".content-header").removeClass("collapse-pos");
    $(".content").removeClass("collapse-pos");
    this.route.queryParamMap.subscribe((val:any) => {
      if(val.params) {
        this.QueryStringObj = val.params;
        // if(this.QueryStringObj.Browse_Flag) {
        // }
      }
      });

      this.Header.pushHeader({
        //Header: this.Param_Flag,
        Header: "Outlet Group Report",
        Link: " Outlet -> Outlet Group Report"
      });
      this.getChooseReport();
      this.getOutlet();
  }
  TabClick(e){}
  getChooseReport(){
      console.log("Reportlist ===", this.Reportlist)
        this.Reportlist =[
          {Name : "Swiggy"},
          {Name : "Zomato"}
          // {value : "Swiggy" , Name : "Swiggy"},
          // {value : "Zomato" , Name : "Zomato"}
        ];
  
    }
  getOutlet(){
    this.DynamicHeader = [];
    this.Searchlist = [];
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Cost Center Name All",
      "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Outletid = data;
     if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
     //this.ObjBrowseStockView.Outlet = this.Outletid.length === 1 ? this.Outletid[0].Cost_Cen_ID : undefined;
     this.ObjBrowseStockView.Outlet = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.outletdisableflag = true;
     this.getGodown();
     } else {
      this.ObjBrowseStockView.Outlet = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.outletdisableflag = false;
      this.getGodown();
     }
      console.log("this.Outletid ======",this.Outletid);

    });
  }
  getGodown(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID:this.ObjBrowseStockView.Outlet}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.GodownId = data;
     this.ObjBrowseStockView.Godown_Id = this.GodownId.length === 1 ? this.GodownId[0].godown_id : undefined;
     if(this.GodownId.length === 1){
       this.stockdisableflag = true;
     }else{
       this.stockdisableflag = false;
     }
      console.log("this.GodownId ======",this.GodownId);

    });
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseStockView.start_date = dateRangeObj[0];
      this.ObjBrowseStockView.end_date = dateRangeObj[1];
    }
  }
  SearchStockView(valid){
    this.ViewStockFormSubmitted = true;
    //this.DynamicHeader = [];
    this.Searchlist = [];
    const start = this.ObjBrowseStockView.start_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseStockView.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseStockView.end_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseStockView.end_date))
      : this.DateService.dateConvert(new Date());
     
      if(valid){
        //console.log(this.ObjBrowseStockView.Choose_Report)
        let reportname = this.ObjBrowseStockView.Choose_Report === "Swiggy" ? "Swiggy Item Wise Sale Report" : "Zomato Item Wise Sale Report";
        //console.log(reportname);
    const tempobj = {
      From_date : start,
      To_Date : end,
      Cost_Cen_ID : this.ObjBrowseStockView.Outlet ? this.ObjBrowseStockView.Outlet : 0,
      Godown_id : this.ObjBrowseStockView.Godown_Id ? this.ObjBrowseStockView.Godown_Id : 0,
     // Choose_report : this.ObjBrowseStockView.Choose_Report
    }
    const obj = {
      "SP_String": "SP_Outlet_Group_Report",
      "Report_Name_String": reportname,
      "Json_Param_String": JSON.stringify([tempobj]),
      "Json_1_String": "NA",
      "Json_2_String": "NA",
      "Json_3_String": "NA",
      "Json_4_String": "NA"
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       //this.DynamicHeader = Object.keys(data[0]);
       this.Searchlist = data;
       console.log('Searchlist=====',this.Searchlist)
       this.seachSpinner = false;
       this.ViewStockFormSubmitted = false;
       this.exceldisable = false;
       this.getTotalValue();
     })
    }
    //  else if(this.ObjBrowseStockView.Choose_Report = "Zomato"){
    //   if(valid){
    //   const tempobj = {
    //     From_date : start,
    //     To_Date : end,
    //     Cost_Cen_ID : this.ObjBrowseStockView.Outlet ? this.ObjBrowseStockView.Outlet : 0,
    //     Godown_id : this.ObjBrowseStockView.Godown_Id ? this.ObjBrowseStockView.Godown_Id : 0,
    //   }
    //   const obj = {
    //     "SP_String": "SP_Outlet_Group_Report",
    //     "Report_Name_String": "Zomato Item Wise Sale Report",
    //     "Json_Param_String": JSON.stringify([tempobj])
    //   }
    //    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //       //this.DynamicHeader = Object.keys(data[0]);
    //      this.Searchlist = data;
    //      console.log('Searchlist=====',this.Searchlist)
    //      this.seachSpinner = false;
    //      this.ViewStockFormSubmitted = false;
    //      this.exceldisable = false;
    //    })
    //   }
    // }
    }
    CheckLengthProductID(billno) {
      const tempArr = this.Searchlist.filter(item=> item.Bill_No == billno);
      return tempArr.length
    }
    CheckIndexProductID(billno) {
      let found = 0;
      for(let i = 0; i < this.Searchlist.length; i++) {
          if (this.Searchlist[i].Bill_No == billno) {
              found = i;
              break;
          }
      }
      return found;
    }
    // getTotalValue(){
    //   let Amtval = 0;
    //     this.Searchlist.forEach((item)=>{
    //       Amtval += Number(item.Order_Amount);
    //     });
    //     return Amtval ? Amtval.toFixed(2) : '-';
    // }
    getTotalValue(){
      const start = this.ObjBrowseStockView.start_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseStockView.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseStockView.end_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseStockView.end_date))
      : this.DateService.dateConvert(new Date());

      let reportname = this.ObjBrowseStockView.Choose_Report === "Swiggy" ? "Swiggy Total Amount" : "Zomato Total Amount";
      const tempobj = {
        From_date : start,
        To_Date : end,
        Cost_Cen_ID : this.ObjBrowseStockView.Outlet ? this.ObjBrowseStockView.Outlet : 0,
        Godown_id : this.ObjBrowseStockView.Godown_Id ? this.ObjBrowseStockView.Godown_Id : 0,
       // Choose_report : this.ObjBrowseStockView.Choose_Report
      }
      const obj = {
        "SP_String": "SP_Outlet_Group_Report",
        "Report_Name_String": reportname,
        "Json_Param_String": JSON.stringify([tempobj])
      }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.totalamount = data;
         this.orderamount = data[0].Order_Amount;
          console.log("this.totalamount ======",this.totalamount);
    
    
        });
      }
      
    exportoexcel(Arr,fileName): void {
      let temp = [];
     Arr.forEach(element => {
       const obj = {
        Cost_Cen_Name : element.Cost_Cen_Name,
        Bill_Date : this.DateService.dateConvert(new Date(element.Bill_Date)),
        Bill_No : element.Bill_No,
        Product_Description : element.Product_Description,
        Qty : element.Qty,
        Order_Amount : element.Order_Amount
       }
       temp.push(obj)
     });
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(temp);
      const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      XLSX.writeFile(workbook, fileName+'.xlsx');
    }

  // getChooseReport(){
  //   const obj = {
  //     "SP_String": "SP_Stock_Movement",
  //     "Report_Name_String": "Choose Menu Type",
  //     "Json_Param_String": JSON.stringify([{mtype : "OUT"}])
  //     //"Json_Param_String": JSON.stringify([{User_ID : 61}])
  //    }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //    this.Reportlist = data;
  //   // this.ObjBrowseStockView.Outlet = this.Outletid.length === 1 ? this.Outletid[0].Cost_Cen_ID : undefined;
  //     console.log("this.Reportlist ======",this.Reportlist);


  //   });
  // }
  

}
class BrowseStockView {
  Choose_Report : string;
  start_date : Date ;
  end_date : Date;
  Outlet : number;
  Godown_Id : number;
  //Report_Description :string;
}
