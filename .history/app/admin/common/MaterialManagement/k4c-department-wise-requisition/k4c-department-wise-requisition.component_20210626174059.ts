import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-k4c-department-wise-requisition',
  templateUrl: './k4c-department-wise-requisition.component.html',
  styleUrls: ['./k4c-department-wise-requisition.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cDepartmentWiseRequisitionComponent implements OnInit {
  ProductTypeList = [];
  seachSpinner = false;
  ObjBrowseRequi : BrowseRequi = new BrowseRequi ();
  DynamicHeader = [];
  Showlist = [];
  BrandList = [];

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
      Header: "Department Wise Requisition",
      Link: " Material Management -> Department Wise Requisition"
    });
    //this.getProductType();
    this.GetBrand();
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
      console.log("Brand List ===",this.BrandList);
    })
  }
  getProductType(){
    const tempObj = {
      brand_id : this.ObjBrowseRequi.Brand_ID
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "GET Product Type",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ProductTypeList = data;
      //this.ObjBrowseRequi.Location = data[0].Cost_Cen_ID;
      console.log("Product Type List ===" , this.ProductTypeList);
    })
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseRequi.start_date = dateRangeObj[0];
      this.ObjBrowseRequi.end_date = dateRangeObj[1];
    }
  }
  ShowPRequiConsolidated(){
    this.DynamicHeader = [];
    this.Showlist = [];
    const start = this.ObjBrowseRequi.start_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseRequi.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseRequi.end_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseRequi.end_date))
      : this.DateService.dateConvert(new Date());
    const tempobj = {
      From_Date : start,
      To_Date : end,
      Product_Type_ID : this.ObjBrowseRequi.Product_Type,
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Pending Requisition Consolidated",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.DynamicHeader = Object.keys(data[0]);
       this.Showlist = data;
       //this.BackupSearchedlist = data;
       //this.GetDistinct();
       console.log('Show list=====',this.Showlist)
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
  Product_Type : number;
  Brand_ID : string;
}
