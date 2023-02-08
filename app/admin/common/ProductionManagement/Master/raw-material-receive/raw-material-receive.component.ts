import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpParams } from "@angular/common/http";
import { DateTimeConvertService } from './../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from './../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from './../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from './../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-raw-material-receive',
  templateUrl: './raw-material-receive.component.html',
  styleUrls: ['./raw-material-receive.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class RawMaterialReceiveComponent implements OnInit {
  tabIndexToView = 0
  items: any = [];
  buttonname = "Create"
  spString:string = "SP_BL_Txn_Production_Raw_Material_Receive"
  ReferenceDataList:any = []
  AllMaterialName:any = []
  ObjRawMatRev:RawMatRev = new RawMatRev()
  ObjBrowse : Browse = new Browse()
  DocDate:Date = new Date()
  minFromDate:Date = new Date('01/01/1990')
  RawMatRevFormSubmitted : boolean = false
  StockPointList:any = []
  Spinner:boolean = false
  AddRawMatRevList:any = []
  initDate:any = [];
  seachSpinner:boolean = false
  BrowseList:any = []
  BrowseListHeader:any = []
  recdatedisabled:boolean = true;
  maxDate:Date;

  ObjMIS : MIS = new MIS()
  MISreportFormSubmit = false;
  ReportNameList:any = [];
  MISSpinner = false;
  misReportList:any = [];
  DynamicHeaderMISreport:any = [];
  BackupMisReport:any = [];
  DistVendorName:any = [];
  SelectedDistVendorName:any = [];
  DistMaterialType:any = [];
  SelectedDistMaterialType:any = [];
  DistProductType:any = [];
  SelectedDistProductType:any = [];
  SearchFieldsMis:any = [];
  ParameterList:any = [];
  ParamDetalisPopup = false;
  paramlist:any = [];
  paramarr:any = [];
  topperlist:any = [];
  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header:CompacctHeader, 
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService,
  ) { }
  ngOnInit() {
   this.items = ["BROWSE", "CREATE", "MIS"];
      this.header.pushHeader({
    Header: "Raw Material Receive",
    Link: " Production Management -> Master -> Raw Material Receive"
  });
  this.maxDate = new Date();
  this.Finyear();
  this.getReference();
  this.GetStockPoint();
  }
TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE", "MIS"];
    this.buttonname = "Create";
     this.clearData()
     this.recdatedisabled = true;
}
clearData(){
 this.AllMaterialName = [];
 this.ObjRawMatRev = new RawMatRev();
 this.RawMatRevFormSubmitted = false;
 this.DocDate = new Date();
 this.maxDate = new Date();
 this.Spinner = false;
 this.AddRawMatRevList = [];
 this.seachSpinner = false;
}
Finyear() {
  this.http
    .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
    .subscribe((res: any) => {
    let data = JSON.parse(res)
    // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
    // this.voucherminDate = new Date(data[0].Fin_Year_Start);
    // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
   this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
    });
}

getReference(){
  const obj = {
    "SP_String": this.spString,
    "Report_Name_String":"Get_Reference_Nos",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("ReferenceDataList",data)
    if(data.length) {
      data.forEach(element => {
        element['label'] = element.Doc_No +' '+ '('+element.Production_Ref_NO+')',
        element['value'] = element.Production_Ref_NO
      });
      this.ReferenceDataList = data;
    } else {
      this.ReferenceDataList = [];
    }
   })
} 
GetMaterialName(RefNO:any){
  if(RefNO){
     const FilterReferenceDataList = this.ReferenceDataList.find((el:any)=> el.Production_Ref_NO == RefNO)
     this.minFromDate = FilterReferenceDataList ?  new Date(FilterReferenceDataList.Doc_Date) : new Date('01/01/1990')
    const obj = {
      "SP_String": this.spString,
      "Report_Name_String": "Get_Product_Details",
      "Json_Param_String": JSON.stringify({Doc_No : FilterReferenceDataList ? FilterReferenceDataList.Doc_No : ""})
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log("AllMaterialName",data)
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Name,
          element['value'] = element.Product_ID
        });
        this.AllMaterialName = data;
        this.changeMaterialName(this.ObjRawMatRev.Product_ID);
        this.ObjRawMatRev.Receive_Qty = undefined;
        this.ObjRawMatRev.Vehicle_No = undefined;
        this.ObjRawMatRev.Godown_ID = undefined;
        this.ObjRawMatRev.Purpose = undefined;
      } else {
        this.AllMaterialName = [];
      }
    })
  }
  else {
   this.AllMaterialName = []
   this.ObjRawMatRev.Product_ID = undefined;
  }

}
changeMaterialName(ProductID:any){
 if(ProductID){
    const FilterAllMaterialName = this.AllMaterialName.find((el:any) => Number(el.Product_ID) == Number(ProductID))
    console.log("FilterAllMaterialName",FilterAllMaterialName)
    this.ObjRawMatRev.UOM = FilterAllMaterialName ? FilterAllMaterialName.UOM : ""
    this.GetParamDetailsforProduct();
 }
 this.ObjRawMatRev.Batch_Lot_No = undefined;
}
// PARAMETER DETAILS
GetParamDetailsforProduct(){
  this.ParameterList = [];
  if (this.ObjRawMatRev.Product_ID) {
  const obj = {
    "SP_String": this.spString,
    "Report_Name_String": "Get_Parameters",
    "Json_Param_String": JSON.stringify([{Product_ID : this.ObjRawMatRev.Product_ID}])
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.ParameterList = data;
   console.log("ParameterList",this.ParameterList);
   this.ParamDetalisPopup = this.ParameterList.length ? true : false;
    })
  }

}
SaveParamDetalis(){
  if(this.ParameterList.length){
    this.paramlist = []
    this.paramlist = this.ParameterList;
    
  }
  this.ParamDetalisPopup = false;
}
GetStockPoint(){
  const obj = {
    "SP_String": this.spString,
    "Report_Name_String": "Get_Stock_Points",
    "Json_Param_String": JSON.stringify({Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID })
  }
  this.GlobalAPI.postData(obj).subscribe((data: any) => {
    console.log("StockPointList",data)
    if(data.length) {
      data.forEach(element => {
        element['label'] = element.godown_name,
        element['value'] = element.godown_id
      });
      this.StockPointList = data;
    } else {
      this.StockPointList = [];
    }
  })
}
AddRawMatRev(valid:any){
  console.log("valid",valid)
  this.RawMatRevFormSubmitted = true 
 if(valid){
  const FilterReferenceDataList = this.ReferenceDataList.find((el:any)=> el.Production_Ref_NO == this.ObjRawMatRev.Production_Ref_NO)
  const FilterAllMaterialName = this.AllMaterialName.find((el:any) => Number(el.Product_ID) == Number(this.ObjRawMatRev.Product_ID) )
  const FilterStockPointList= this.StockPointList.find((el:any) => Number(el.godown_id) == Number(this.ObjRawMatRev.Godown_ID) )
  this.paramarr = [];
     this.paramlist.forEach(element => {
      if((element.Exact_Value || element.Exact_Value > 0)) {
      const obj = {
        Line_No : this.AddRawMatRevList.length + 1,
        Product_ID : Number(this.ObjRawMatRev.Product_ID),
        Parameter_ID : element.Parameter_ID,
        Parameter_Name : element.Parameter_Name,
        UOM : element.UOM,
        Max_Value : element.Max_Value,
        Min_Value : element.Min_Value,
        Exact_Value : element.Exact_Value,
        Tolerance_Level : element.Tolerance_Level
      }
      this.paramarr.push(obj)
      }
     });
    const recobj = {
      Product_ID: Number(this.ObjRawMatRev.Product_ID),
      Product_Name: FilterAllMaterialName ? FilterAllMaterialName.Product_Name : " ",
      UOM:  this.ObjRawMatRev.UOM,
      Receive_Qty: this.ObjRawMatRev.Receive_Qty,
      Batch_Lot_No: this.ObjRawMatRev.Batch_Lot_No,
      // Vehicle_No: this.ObjRawMatRev.Vehicle_No,
      Note_Description: this.ObjRawMatRev.Note_Description,
      Godown_ID: this.ObjRawMatRev.Godown_ID,
      Godown_Name : FilterStockPointList ? FilterStockPointList.godown_name : " ",
      Purpose: this.ObjRawMatRev.Purpose,
      Parameter_Details: this.buttonname === "Create" ? this.ParameterList.length ? this.paramarr : null : this.paramarr

    }
    const recotherobj = {
      Doc_No: "A",
      Doc_Date: this.DateService.dateConvert(this.DocDate),
      Production_PO_No: FilterReferenceDataList ? FilterReferenceDataList.Doc_No : " ",
      Production_Ref_NO: this.ObjRawMatRev.Production_Ref_NO,
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Created_By: this.$CompacctAPI.CompacctCookies.User_ID,

    }
  this.AddRawMatRevList.push(recobj);
  console.log('table data ===',this.AddRawMatRevList)
  this.topperlist.push(recotherobj);
  console.log('topper data ===',this.topperlist)
  let bckupTempObj:any = {...this.ObjRawMatRev}
  this.ObjRawMatRev.Remarks = bckupTempObj.Remarks
  // this.ObjRawMatRev = new RawMatRev()
  this.ObjRawMatRev.Product_ID = undefined;
  this.ObjRawMatRev.Receive_Qty = undefined;
  this.ObjRawMatRev.UOM = undefined;
  this.ObjRawMatRev.Batch_Lot_No = undefined;
  // this.ObjRawMatRev.Vehicle_No = undefined;
  this.ObjRawMatRev.Note_Description = undefined;
  // this.AllMaterialName = []
  // this.DocDate = new Date()
  this.recdatedisabled = false;
  this.minFromDate = new Date('01/01/1990')
  this.RawMatRevFormSubmitted =false
 }
}
DeleteRawMatRevListROW(index:any){
  this.AddRawMatRevList.splice(index,1);
 }
SaveRawMatRev(){
  if(this.AddRawMatRevList.length){
    this.Spinner = true
    this.topperlist.forEach(ele => {
      ele['Remarks'] = this.ObjRawMatRev.Remarks
    });
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "s",
      sticky: true,
      closable: false,
      severity: "warn",
      summary: "Are you sure?",
      detail: "Confirm to proceed"
    });
  }
}
onReject() {
  this.compacctToast.clear("c");
  this.compacctToast.clear("s");
  this.Spinner = false;
}
onConfirm(){

}
ConfirmSave(){
  this.ngxService.start();
  const FilterReferenceDataList = this.ReferenceDataList.find((el:any)=> el.Production_Ref_NO == this.ObjRawMatRev.Production_Ref_NO)
    this.ObjRawMatRev.Doc_No = "A";
    this.ObjRawMatRev.Doc_Date = this.DateService.dateConvert(this.DocDate);
    this.ObjRawMatRev.Production_PO_No = FilterReferenceDataList ? FilterReferenceDataList.Doc_No : " ";
    this.ObjRawMatRev.Production_Ref_NO = this.ObjRawMatRev.Production_Ref_NO;
    this.ObjRawMatRev.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.ObjRawMatRev.Created_By = this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjRawMatRev.L_element = this.AddRawMatRevList;
  const obj = {
    "SP_String": this.spString,
    "Report_Name_String": "Create_BL_Txn_Production_Raw_Material_Receive",
    "Json_Param_String": JSON.stringify([this.ObjRawMatRev])      
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if (data[0].Column1) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Doc No.  " + data[0].Column1,
        detail: "Succesfully Create"
      });
      this.Spinner = false;
      this.items = ["BROWSE", "CREATE", "MIS"];
      this.clearData();
      this.onReject()
      this.getAllData(true)
      this.ngxService.stop();
    }
    else {
      this.ngxService.stop();
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Something Wrong "
      });
    }
  })
}
getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjBrowse.From_Date = dateRangeObj[0];
    this.ObjBrowse.To_Date = dateRangeObj[1];
  }
}
getAllData(valid:any){
  console.log("Valid",valid)
  if(valid){
    this.seachSpinner = true
    this.BrowseList = []
    this.BrowseListHeader = []
    const From_Date = this.ObjBrowse.From_Date
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.From_Date))
    : this.DateService.dateConvert(new Date());
  const To_Date = this.ObjBrowse.To_Date
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.To_Date))
    : this.DateService.dateConvert(new Date());
    const tempobj = {
      From_Date : From_Date,
      To_Date : To_Date,
    }
    const obj = {
      "SP_String": this.spString,
      "Report_Name_String": "BL_Txn_Production_Raw_Material_Receive_Browse",
      "Json_Param_String": JSON.stringify([tempobj])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrowseList = data
      this.BrowseListHeader = this.BrowseList.length ? Object.keys(this.BrowseList[0]) : []
      this.seachSpinner = false
    })
  }
}

//MIS
getDateRangeMIS(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjMIS.From_Date = dateRangeObj[0];
    this.ObjMIS.To_Date = dateRangeObj[1];
  }
  }
  GetMISreport(valid){
    this.misReportList = [];
    this.BackupMisReport = [];
    this.DynamicHeaderMISreport = [];
    this.MISreportFormSubmit = true;
    this.MISSpinner = true;
  const start = this.ObjMIS.From_Date
  ? this.DateService.dateConvert(new Date(this.ObjMIS.From_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.ObjMIS.To_Date
  ? this.DateService.dateConvert(new Date(this.ObjMIS.To_Date))
  : this.DateService.dateConvert(new Date());
  const tempobj = {
    From_Date : start,
    To_Date : end,
    // Company_ID : this.ObjMIS.Company_ID,
  }
  // console.log("valid",valid)
  if (valid) {
    const obj = {
      "SP_String": "SP_BL_Txn_Production_Raw_Material_Receive",
      "Report_Name_String": "BL_Txn_Production_Raw_Material_Receive_MIS",
      "Json_Param_String": JSON.stringify([tempobj])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.misReportList = data;
      this.BackupMisReport = data;
      this.GetDistinctReport();
      if(this.misReportList.length){
        this.DynamicHeaderMISreport = Object.keys(data[0]);
      }
      this.MISSpinner = false
      this.MISreportFormSubmit = false;
    })
    }
    else {
      this.MISSpinner = false;
    }
  }
  exportoexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
    // DISTINCT & FILTER
  GetDistinctReport() {
    let DVendorName:any = [];
    let DMaterialType:any = [];
    let DProductType:any = [];
    this.DistVendorName =[];
    this.SelectedDistVendorName =[];
    this.DistMaterialType =[];
    this.SelectedDistMaterialType =[];
    this.DistProductType =[];
    this.SelectedDistProductType =[];
    this.SearchFieldsMis =[];
    this.misReportList.forEach((item) => {
    if (DVendorName.indexOf(item.Vendor_Name) === -1) {
       DVendorName.push(item.Vendor_Name);
       this.DistVendorName.push({ label: item.Vendor_Name, value: item.Vendor_Name });
    }
    if (DMaterialType.indexOf(item.Material_Type) === -1) {
       DMaterialType.push(item.Material_Type);
       this.DistMaterialType.push({ label: item.Material_Type, value: item.Material_Type });
    }
    if (DProductType.indexOf(item.Product_Type) === -1) {
       DProductType.push(item.Product_Type);
       this.DistProductType.push({ label: item.Product_Type, value: item.Product_Type });
    }
  });
     this.BackupMisReport = [...this.misReportList];
  }
    
  FilterDistReport() {
    let DVendorName:any = [];
    let DMaterialType:any = [];
    let DProductType:any = [];
    this.SearchFieldsMis =[];
  if (this.SelectedDistVendorName.length) {
    this.SearchFieldsMis.push('Vendor_Name');
    DVendorName = this.SelectedDistVendorName;
  }
  if (this.SelectedDistMaterialType.length) {
    this.SearchFieldsMis.push('Material_Type');
    DMaterialType = this.SelectedDistMaterialType;
  }
  if (this.SelectedDistProductType.length) {
    this.SearchFieldsMis.push('Product_Type');
    DProductType = this.SelectedDistProductType;
  }
  this.misReportList = [];
  if (this.SearchFieldsMis.length) {
    let LeadArr = this.BackupMisReport.filter(function (e) {
      return (DVendorName.length ? DVendorName.includes(e['Vendor_Name']) : true)
      && (DMaterialType.length ? DMaterialType.includes(e['Material_Type']) : true)
      && (DProductType.length ? DProductType.includes(e['Product_Type']) : true)
    });
  this.misReportList = LeadArr.length ? LeadArr : [];
  } else {
  this.misReportList = [...this.BackupMisReport] ;
  }
  }
}
class RawMatRev{
  Doc_No:any;
  Doc_Date:any;
  Cost_Cen_ID:any;
  Production_PO_No:any;
  Production_Ref_NO:any;
  Product_ID:any;
  Product_Name:any;
  UOM:any;
  Receive_Qty:any;
  Batch_Lot_No:any;
  Note_Description:any;
  Godown_ID:any;
  Purpose:any;
  Remarks:any;
  Created_By:any;
  SE_No_Date:any;
  Inv_No_Date:any;
  Mode_Of_transport:any;
  LR_No_Date:any;
  Vehicle_No:any;
  L_element:any;
}
class Browse {
  From_Date : Date ;
  To_Date : Date;
}
class MIS {
  // Company_ID : any;
  // Report_Name : any;
  From_Date : Date;
  To_Date : Date;
}