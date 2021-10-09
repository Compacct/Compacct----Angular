import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  //seachSpinner = false;
  statusvalue : any;
  ObjBrowseRequi : BrowseRequi = new BrowseRequi ();
  LocationList = [];
  Showlist = [];
  DynamicHeader = [];
  DistReqNo = [];
  SelectedDistReqNo = [];
  DistLocation = [];
  SelectedDistLocation = [];
  SearchFields = [];
  BackupSearchedlist = [];
  dataforexcellist = [];
  RequisitionSearchFormSubmitted = false;
  shopwiselist = [];
  DynamicHeader1 = [];
  BrandList = [];
  Indentdate = [];
  myDate: Date;
  initDate = [];
  DistStatus = [];
  SelectedDistStatus = [];
  Param_Flag ='';

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private route : ActivatedRoute,
    private router : Router,
  ) {

   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log("url",params);
     this.Param_Flag = params['type'];
      console.log ("heading",this.Param_Flag);
      this.Header.pushHeader({
        Header: "Browse Indent in Factory " + '(' + this.Param_Flag +')',
        Link: " Material Management -> Factory Indent " + '(' + this.Param_Flag +')'
      });
      //this.getlocation();
      this.getdataforexcel();
      this.GetBrand();
      this.GetIndentDate();
      this.DynamicHeader1 = [];
      this.shopwiselist = [];
      this.DynamicHeader = [];
      this.Showlist = [];
      this.LocationList = [];
     })

  }
  // getStatusData(){
  //   console.log("status value ===", this.statusvalue)
  //     this.statusvalue =[
  //       {value : "" , Name : "All"},
  //       {value : "Y" , Name : "Updated"},
  //       {value : "N" , Name : "Not Updated"}
  //     ];

  // }
  GetIndentDate(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Indent Date"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Indentdate = data;
      this.myDate =  new Date(data[0].Requisition_Date);
       console.log("IndentDate List ===",this.Indentdate);
       this.initDate = [this.myDate , this.myDate];
    })

  }
  GetBrand(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Brand"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrandList = data;
      //this.Objproduction.Brand_ID = this.BrandList.length === 2 ? this.BrandList[0].Brand_ID : undefined;
      //this.Objproduction.Brand_ID = this.BrandList[0].Brand_ID;
      this.ObjBrowseRequi.Brand_ID = undefined;
      //this.GetProductType();
     // console.log("Brand List ===",this.BrandList);
    })
  }
  getlocation() {
    this.ObjBrowseRequi.Location = undefined;
    const tempobj = {
      Brand_ID : this.ObjBrowseRequi.Brand_ID
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Outlet for Browse Requisition Factory",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.LocationList = data;
      //this.ObjBrowseRequi.Location = data[0].Cost_Cen_ID;
      //console.log("Location List ===",this.LocationList);
    })
  }
  TabClick(e){}
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseRequi.start_date = dateRangeObj[0];
      this.ObjBrowseRequi.end_date = dateRangeObj[1];
    }
  }
  ShowRequisition(){
   this.RequisitionSearchFormSubmitted = true;
   this.DynamicHeader1 = [];
   this.shopwiselist = [];
    this.DynamicHeader = [];
    this.Showlist = [];
    this.dataforexcellist = [];
    const start = this.ObjBrowseRequi.start_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseRequi.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseRequi.end_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseRequi.end_date))
      : this.DateService.dateConvert(new Date());
     //if(this.ObjBrowseRequi.Status != undefined){
      let bandid = 0;
       if(this.Param_Flag ==='Finished') {
        bandid = this.ObjBrowseRequi.Brand_ID ? this.ObjBrowseRequi.Brand_ID : 0;
       } 
       if (this.Param_Flag === 'Store Item') {
        bandid = this.ObjBrowseRequi.Location ? 0 : this.ObjBrowseRequi.Brand_ID;
       }
    const tempobj = {
      Material_Type : this.Param_Flag,
      From_Date : start,
      To_Date : end,
      Cost_Cen_ID : this.ObjBrowseRequi.Location ? this.ObjBrowseRequi.Location : 0,
      Is_Active : this.ObjBrowseRequi.Status,
      Brand_ID :bandid
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
       this.BackupSearchedlist = data;
       this.GetDistinct();
       console.log('Show list=====',this.Showlist)
       this.getdataforexcel();
       }
       this.RequisitionSearchFormSubmitted = false;
       //this.seachSpinner = false;
     })
    //}
  }

  GetDistinct() {
    let DStatus = [];
    this.DistStatus =[];
    this.SelectedDistStatus =[];
    this.SearchFields =[];
    this.Showlist.forEach((item) => {
   if (DStatus.indexOf(item.Status) === -1) {
    DStatus.push(item.Status);
   this.DistStatus.push({ label: item.Status, value: item.Status });
   }
  });
     this.BackupSearchedlist = [...this.Showlist];
  }
  FilterDist() {
    let DStatus = [];
    this.SearchFields =[];
  if (this.SelectedDistStatus.length) {
    this.SearchFields.push('Status');
    DStatus = this.SelectedDistStatus;
  }
  this.Showlist = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupSearchedlist.filter(function (e) {
      return (DStatus.length ? DStatus.includes(e['Status']) : true)
    });
  this.Showlist = LeadArr.length ? LeadArr : [];
  } else {
  this.Showlist = [...this.BackupSearchedlist] ;
  }
  }
  getdataforexcel(){
    this.dataforexcellist = [];
    const start = this.ObjBrowseRequi.start_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseRequi.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseRequi.end_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseRequi.end_date))
      : this.DateService.dateConvert(new Date());
    const tempobj = {
      Material_Type : this.Param_Flag,
      From_Date : start,
      To_Date : end,
      Cost_Cen_ID : this.ObjBrowseRequi.Location ? this.ObjBrowseRequi.Location : 0,
      Brand_ID : 0 //this.ObjBrowseRequi.Brand_ID ? this.ObjBrowseRequi.Brand_ID : 0
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Download Pending Requisition",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.dataforexcellist = data;
       //this.BackupSearchedlist = data;
       //this.GetDistinct();
      // console.log('excel list=====',this.dataforexcellist)
       //this.seachSpinner = false;
     })
  }
  exportexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
  getShopWiseReq(){
    this.RequisitionSearchFormSubmitted = true;
    this.DynamicHeader = [];
    this.Showlist = [];
    this.DynamicHeader1 = [];
    this.shopwiselist = [];
    const start = this.ObjBrowseRequi.start_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseRequi.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseRequi.end_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseRequi.end_date))
      : this.DateService.dateConvert(new Date());
      //if(this.ObjBrowseRequi.Status != undefined){
        //if(valid){
    const tempobj = {
      Material_Type : this.Param_Flag,
      From_Date : start,
      To_Date : end,
      Cost_Cen_ID : this.ObjBrowseRequi.Location ? this.ObjBrowseRequi.Location : 0,
      Brand_ID : 0 //this.ObjBrowseRequi.Brand_ID ? this.ObjBrowseRequi.Brand_ID : 0
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "OutletWise Requisition",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length) {
        this.DynamicHeader1 = Object.keys(data[0]);
       this.shopwiselist = data;
       //this.BackupSearchedlist = data;
       //this.GetDistinct();
       this.getdataforexcel();
      }
      // console.log('ShopWise list=====',this.shopwiselist)
      // this.seachSpinner = false;
       this.RequisitionSearchFormSubmitted = false;
     })
    //}
    //}
  }

}
class BrowseRequi {
  start_date : Date ;
  end_date : Date;
  Location : number = undefined;
  Status : string = undefined;
  Brand_ID : number = undefined;

}
