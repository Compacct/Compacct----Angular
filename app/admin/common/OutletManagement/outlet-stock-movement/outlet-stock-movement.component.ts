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
  selector: 'app-outlet-stock-movement',
  templateUrl: './outlet-stock-movement.component.html',
  styleUrls: ['./outlet-stock-movement.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class OutletStockMovementComponent implements OnInit {
  tabIndexToView = 0;
  public QueryStringObj : any;
  ObjBrowseStockView : BrowseStockView = new BrowseStockView ();
  BrandList = [];
  BrandDisable = false;
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

  constructor(
    private route : ActivatedRoute,
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) {
    // this.Header.pushHeader({
    //   Header: "Outlet Stock Movement",
    //   Link: " Outlet -> Pos Bill -> Stock View"
    // });
      this.route.queryParams.subscribe(params => {
      // console.log(params);
      this.Param_Flag = params['Report_Name'];
      this.Outlet_Param = params['mtype'];
      // console.log (this.Param_Flag);
      })
   }
   TabClick(e){}
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
        Header: this.Param_Flag,
        Link: " Outlet -> Pos Bill -> Outlet Report"
      });
      this.GetBrand();
      this.getOutlet();
      this.getChooseReport();
  }

  GetBrand(){
    this.BrandList = [];
    if(this.$CompacctAPI.CompacctCookies.User_Type != "A"){
      const obj = {
        "SP_String": "SP_Outlet_Closing_Stock_With_Batch",
        "Report_Name_String": "GET_Brand_For_Outlet",
        "Json_Param_String": JSON.stringify([{Cost_Cent_ID:this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.BrandList = data;
        this.ObjBrowseStockView.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
        //this.ObjBrowse.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
        //this.ObjIssueStockAd.Brand_ID = data[0].Brand_INI;
        this.BrandDisable = true;
        this.getOutlet();
         console.log("Brand List ===",this.BrandList);
      })
    } else {
    const obj = {
      "SP_String": "SP_Outlet_Closing_Stock_With_Batch",
      "Report_Name_String": "Get - Brand"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrandList = data;
      this.getOutlet();
      //this.Objproduction.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.BrandDisable = false;
       console.log("Brand List ===",this.BrandList);
    })
  }
  }
  getOutlet(){
    this.DynamicHeader = [];
    this.Searchlist = [];
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Outlet For Distribution",
      "Json_Param_String": JSON.stringify([{Brand_ID : this.ObjBrowseStockView.Brand_ID}])
      // "SP_String": "SP_Controller_Master",
      // "Report_Name_String": "Get - Cost Center Name All",
      // "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
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
      this.ObjBrowseStockView.Outlet = undefined;
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
    this.DynamicHeader = [];
    this.Searchlist = [];
    const start = this.ObjBrowseStockView.start_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseStockView.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseStockView.end_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseStockView.end_date))
      : this.DateService.dateConvert(new Date());
    //  if(this.ObjBrowseStockView.Choose_Report = "Stock Movement"){
      if(valid){
    const tempobj = {
      From_date : start,
      To_Date : end,
      Brand_ID : this.ObjBrowseStockView.Brand_ID ? this.ObjBrowseStockView.Brand_ID : 0,
      Cost_Cen_ID : this.ObjBrowseStockView.Outlet ? this.ObjBrowseStockView.Outlet : 0,
      Godown_id : this.ObjBrowseStockView.Godown_Id ? this.ObjBrowseStockView.Godown_Id : 0,
      Choose_report : this.ObjBrowseStockView.Choose_Report
    }
    const obj = {
      "SP_String": "SP_Stock_Movement",
      //"Report_Name_String": "Stock Movement",
      "Report_Name_String": "Outlet Movement",
      "Json_Param_String": JSON.stringify([tempobj]),
      "Json_1_String": "NA",
      "Json_2_String": "NA",
      "Json_3_String": "NA",
      "Json_4_String": "NA"
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.DynamicHeader = Object.keys(data[0]);
       this.Searchlist = data;
       console.log('Stock list=====',this.Searchlist)
       this.seachSpinner = false;
       this.ViewStockFormSubmitted = false;
       this.exceldisable = false;
     })
    }
    // } else if(this.ObjBrowseStockView.Choose_Report = "Fund Movement") {
    //   const tempobj = {
    //     From_date : start,
    //     To_Date : end,
    //     Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    //   }
    //   const obj = {
    //     "SP_String": "SP_Stock_Movement",
    //     "Report_Name_String": "Fund Movement",
    //     "Json_Param_String": JSON.stringify([tempobj]),
    //     "Json_1_String": "NA",
    //     "Json_2_String": "NA",
    //     "Json_3_String": "NA",
    //     "Json_4_String": "NA"
    //   }
    //    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //       this.DynamicHeader = Object.keys(data[0]);
    //      this.Searchlist = data;
    //      console.log('Fund list=====',this.Searchlist)
    //      this.seachSpinner = false;
    //    })
    //   }
    }
    exportoexcel(Arr,fileName): void {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
      const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      XLSX.writeFile(workbook, fileName+'.xlsx');
    }

  // SearchFundView(){
  //   this.DynamicHeader = [];
  //   this.Searchlist = [];
  //   const start = this.ObjBrowseStockView.start_date
  //     ? this.DateService.dateConvert(new Date(this.ObjBrowseStockView.start_date))
  //     : this.DateService.dateConvert(new Date());
  //   const end = this.ObjBrowseStockView.end_date
  //     ? this.DateService.dateConvert(new Date(this.ObjBrowseStockView.end_date))
  //     : this.DateService.dateConvert(new Date());
  //     if(this.ObjBrowseStockView.Choose_Report = "Fund Movement"){
  //   const tempobj = {
  //     From_date : start,
  //     To_Date : end,
  //     Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
  //   }
  //   const obj = {
  //     "SP_String": "SP_Stock_Movement",
  //     "Report_Name_String": "Fund Movement",
  //     "Json_Param_String": JSON.stringify([tempobj]),
  //     "Json_1_String": "NA",
  //     "Json_2_String": "NA",
  //     "Json_3_String": "NA",
  //     "Json_4_String": "NA"
  //   }
  //    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //       this.DynamicHeader = Object.keys(data[0]);
  //      this.Searchlist = data;
  //      console.log('Fund list=====',this.Searchlist)
  //      this.seachSpinner = false;
  //    })
  //   }
  // }
  getChooseReport(){
    const obj = {
      "SP_String": "SP_Stock_Movement",
      "Report_Name_String": "Choose Menu Type",
      "Json_Param_String": JSON.stringify([{mtype : this.Outlet_Param}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Reportlist = data;
    // this.ObjBrowseStockView.Outlet = this.Outletid.length === 1 ? this.Outletid[0].Cost_Cen_ID : undefined;
      console.log("this.Reportlist ======",this.Reportlist);


    });
  }
  onReportChange(){
    this.ObjBrowseStockView.Report_Description = undefined;
    if(this.ObjBrowseStockView.Choose_Report) {
      const ProductArrValid = this.Reportlist.filter( item => item.report_name === this.ObjBrowseStockView.Choose_Report);
      console.log("ProductArrValid",ProductArrValid);
      //this.rate = productObj.Sale_rate;
      this.ObjBrowseStockView.Report_Description = ProductArrValid[0].Report_Description;
      this.exceldisable = true;
    }
  }
  //this.ObjBrowseStockView.Report_Description = this.Reportlist.filter(item=>item.report_name === this.Report_Description);

}

class BrowseStockView {
  Choose_Report : string;
  start_date : Date ;
  end_date : Date;
  Brand_ID : any;
  Outlet : number;
  Godown_Id : number;
  Report_Description :string;
}

