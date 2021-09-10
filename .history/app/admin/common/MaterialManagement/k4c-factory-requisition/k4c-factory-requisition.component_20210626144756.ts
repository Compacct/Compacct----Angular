import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-k4c-factory-requisition',
  templateUrl: './k4c-factory-requisition.component.html',
  styleUrls: ['./k4c-factory-requisition.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cFactoryRequisitionComponent implements OnInit {
  tabIndexToView =0;
  seachSpinner = false;
  statusvalue : any;
  ObjBrowseRequi : BrowseRequi = new BrowseRequi ();
  LocationList = [];
  Showlist = [];
  DynamicHeader = [];
  DistReqNo: any[];
  SelectedDistReqNo: any[];
  DistLocation: any[];
  SelectedDistLocation: any[];
  SearchFields: any[];
  BackupSearchedlist: any;
  dataforexcellist = [];
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
      Header: "Browse Requisition in Factory",
      Link: " Material Management -> Factory Requisition"
    });
    this.getlocation();

  }
  // getStatusData(){
  //   console.log("status value ===", this.statusvalue)
  //     this.statusvalue =[
  //       {value : "" , Name : "All"},
  //       {value : "Y" , Name : "Updated"},
  //       {value : "N" , Name : "Not Updated"}
  //     ];
  // }
  getlocation() {
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Outlet for Browse Requisition Factory"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.LocationList = data;
      //this.ObjBrowseRequi.Location = data[0].Cost_Cen_ID;
      console.log("Location List ===",this.LocationList);
    })
  }
  TabClick(){}
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseRequi.start_date = dateRangeObj[0];
      this.ObjBrowseRequi.end_date = dateRangeObj[1];
    }
  }
  ShowRequisition(){
    this.DynamicHeader = [];
    this.Showlist = [];
    this.dataforexcellist = [];
    const start = this.ObjBrowseRequi.start_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseRequi.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseRequi.end_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseRequi.end_date))
      : this.DateService.dateConvert(new Date());
    const tempobj = {
      From_Date : start,
      To_Date : end,
      Cost_Cen_ID : this.ObjBrowseRequi.Location ? this.ObjBrowseRequi.Location : 0,
      Is_Active : this.ObjBrowseRequi.Status,
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Browse Requisition For Factory",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
        this.DynamicHeader = Object.keys(data[0]);
       this.Showlist = data;
       //this.BackupSearchedlist = data;
       //this.GetDistinct();
       console.log('Show list=====',this.Showlist)
       this.getdataforexcel();
       }
       this.seachSpinner = false;

     })
  }

  // GetDistinct() {
  //   let DReqNo = [];
  //   let DLocation = [];
  //   this.DistReqNo =[];
  //   this.SelectedDistReqNo =[];
  //   this.DistLocation =[];
  //   this.SelectedDistLocation =[];
  //   this.SearchFields =[];
  //   this.Showlist.forEach((item) => {
  //  if (DReqNo.indexOf(item.Req_No) === -1) {
  //   DReqNo.push(item.Req_No);
  //  this.DistReqNo.push({ label: item.Req_No, value: item.Req_No });
  //  }
  // if (DLocation.indexOf(item.Cost_Cen_ID) === -1) {
  //   DLocation.push(item.Cost_Cen_ID);
  //   this.DistLocation.push({ label: item.Location, value: item.Cost_Cen_ID });
  //   }
  // });
  //    this.BackupSearchedlist = [...this.Showlist];
  // }
  // FilterDist() {
  //   let DReqNo = [];
  //   let DLocation = [];
  //   this.SearchFields =[];
  // if (this.SelectedDistReqNo.length) {
  //   this.SearchFields.push('Req_No');
  //   DReqNo = this.SelectedDistReqNo;
  // }
  // if (this.SelectedDistLocation.length) {
  //   this.SearchFields.push('Cost_Cen_ID');
  //   DLocation = this.SelectedDistLocation;
  // }
  // this.Showlist = [];
  // if (this.SearchFields.length) {
  //   let LeadArr = this.BackupSearchedlist.filter(function (e) {
  //     return (DReqNo.length ? DReqNo.includes(e['Req_No']) : true)
  //     && (DLocation.length ? DLocation.includes(e['Cost_Cen_ID']) : true)
  //   });
  // this.Showlist = LeadArr.length ? LeadArr : [];
  // } else {
  // this.Showlist = [...this.BackupSearchedlist] ;
  // }
  // }
  getdataforexcel(){
    this.dataforexcellist = [];
    const start = this.ObjBrowseRequi.start_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseRequi.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseRequi.end_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseRequi.end_date))
      : this.DateService.dateConvert(new Date());
    const tempobj = {
      From_Date : start,
      To_Date : end,
      Cost_Cen_ID : this.ObjBrowseRequi.Location ? this.ObjBrowseRequi.Location : 0,
      Is_Active : this.ObjBrowseRequi.Status,
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Download Pending Requisition For Factory",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.dataforexcellist = data;
       //this.BackupSearchedlist = data;
       //this.GetDistinct();
       console.log('excel list=====',this.dataforexcellist)
       this.seachSpinner = false;
     })
  }
  exportexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }

}
class BrowseRequi {
  start_date : Date ;
  end_date : Date;
  Location : number;
  Status : string;


}
