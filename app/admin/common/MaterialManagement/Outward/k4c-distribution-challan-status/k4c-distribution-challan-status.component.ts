import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';

@Component({
  selector: 'app-k4c-distribution-challan-status',
  templateUrl: './k4c-distribution-challan-status.component.html',
  styleUrls: ['./k4c-distribution-challan-status.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cDistributionChallanStatusComponent implements OnInit {
  ObjBrowse : Browse = new Browse ();
  seachSpinner = false;
  tabIndexToView =0;
  DynamicHeader =[];
  DistChallanList = [];
  BackupDistChallanList = [];
  DistOutlet = [];
  SelectedDistOutlet = [];
  DistStatus = [];
  SelectedDistStatus = [];
  SearchFields = [];
  ChallanDetailsPoppup = false;
  CDetails = [];
  Challan_No = undefined;
  Challan_date = undefined;
  shop = undefined;

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Distribution Challan Status",
      Link: " Material Management -> Outward -> Distribution Challan Status"
    });
   // this.GetDistChallanDetails();
  }
  TabClick(e){}
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }

  GetDistChallanDetails(){
    const start = this.ObjBrowse.start_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowse.end_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
      : this.DateService.dateConvert(new Date());
    const tempobj = {
      From_date : start,
      To_Date : end
}
    const tempObj = {
      From_Date :start,
      To_Date :end,
      //Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
      //Cost_Cen_ID :42
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get Dispatch Details Status",
      "Json_Param_String": JSON.stringify([tempObj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.DistChallanList = data;
      this.BackupDistChallanList = data;
      this.GetDistinct();
      console.log('search list=====',this.DistChallanList)
      this.seachSpinner = false;
    })
  }
  // DISTINCT & FILTER
  GetDistinct() {
    let DOutlet = [];
    let DStatus = [];
    this.DistOutlet =[];
    this.SelectedDistOutlet =[];
    this.DistStatus =[];
    this.SelectedDistStatus =[];
    this.SearchFields =[];
    this.DistChallanList.forEach((item) => {
   if (DOutlet.indexOf(item.Cost_Cen_Name) === -1) {
    DOutlet.push(item.Cost_Cen_Name);
   this.DistOutlet.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
   }
  if (DStatus.indexOf(item.Status) === -1) {
    DStatus.push(item.Status);
    this.DistStatus.push({ label: item.Status, value: item.Status });
    }
  });
     this.BackupDistChallanList = [...this.DistChallanList];
  }
  FilterDist() {
    let DOutlet = [];
    let DStatus = [];
    this.SearchFields =[];
  if (this.SelectedDistOutlet.length) {
    this.SearchFields.push('Cost_Cen_Name');
    DOutlet = this.SelectedDistOutlet;
  }
  if (this.SelectedDistStatus.length) {
    this.SearchFields.push('Status');
    DStatus = this.SelectedDistStatus;
  }
  this.DistChallanList = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupDistChallanList.filter(function (e) {
      return (DOutlet.length ? DOutlet.includes(e['Cost_Cen_Name']) : true)
      && (DStatus.length ? DStatus.includes(e['Status']) : true)
    });
  this.DistChallanList = LeadArr.length ? LeadArr : [];
  } else {
  this.DistChallanList = [...this.BackupDistChallanList] ;
  }
  }
  PopUp(masterProduct){
    this.shop = undefined;
       this.Challan_No = undefined;
       this.Challan_date = undefined;
    //this.clearData();
    if(masterProduct.Doc_No){
     this.ChallanDetailsPoppup = true;
     this.getPopUp(masterProduct);
     }
   }
   getPopUp(masterProduct){

     const obj = {
       "SP_String": "SP_Production_Voucher",
       "Report_Name_String": "Get Data For Accepted Distribution Challan Status Popup",
       "Json_Param_String": JSON.stringify([{Doc_No : masterProduct.Doc_No}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.CDetails = data;
       this.shop = data[0].Cost_Cen_Name;
       this.Challan_No = data[0].Doc_No;
       this.Challan_date = new Date(data[0].Doc_Date);
        console.log("this.EditList",this.CDetails);
     })
   }

}

class Browse {
  start_date : Date ;
  end_date : Date;
  Cost_Cen_ID : 0;
  Product_Type_ID : 0;
}
