import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpParams } from "@angular/common/http";
import { DateTimeConvertService } from './../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from './../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from './../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from './../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
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
   this.items = ["BROWSE", "CREATE"];
      this.header.pushHeader({
    Header: "Raw Material Receive",
    Link: " Production Management -> Master -> Raw Material Receive"
  });
  this.getReference()
  this.GetStockPoint()
  }
TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
     this.clearData()
}
clearData(){
 this.AllMaterialName = []
 this.ObjRawMatRev = new RawMatRev()
 this.RawMatRevFormSubmitted = false
 this.DocDate = new Date()
 this.Spinner = false
 this.AddRawMatRevList = []
 this.seachSpinner = false
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
      } else {
        this.AllMaterialName = [];
      }
    })
  }
  else {
   this.AllMaterialName = []
   this.ObjRawMatRev.Product_ID = undefined
  }

}
changeMaterialName(ProductID:any){
 if(ProductID){
    const FilterAllMaterialName = this.AllMaterialName.find((el:any) => Number(el.Product_ID) == Number(ProductID) )
    console.log("FilterAllMaterialName",FilterAllMaterialName)
    this.ObjRawMatRev.UOM = FilterAllMaterialName ? FilterAllMaterialName.UOM : ""
 }
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
  this.AddRawMatRevList.push({
    Doc_No: "A",
    Doc_Date: this.DateService.dateConvert(this.DocDate),
    Production_PO_No: FilterReferenceDataList ? FilterReferenceDataList.Doc_No : " ",
    Production_Ref_NO: this.ObjRawMatRev.Production_Ref_NO,
    Product_ID: Number(this.ObjRawMatRev.Product_ID),
    Product_Name: FilterAllMaterialName ? FilterAllMaterialName.Product_Name : " ",
    UOM:  this.ObjRawMatRev.UOM,
    Receive_Qty: this.ObjRawMatRev.Receive_Qty,
    Batch_Lot_No: this.ObjRawMatRev.Batch_Lot_No,
    Vehicle_No: this.ObjRawMatRev.Vehicle_No,
    Godown_ID: this.ObjRawMatRev.Godown_ID,
    Godown_Name : FilterStockPointList ? FilterStockPointList.godown_name : " ",
    Purpose: this.ObjRawMatRev.Purpose,
    Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    Created_By: this.$CompacctAPI.CompacctCookies.User_ID
  })
  let bckupTempObj:any = {...this.ObjRawMatRev}
  this.ObjRawMatRev.Remarks = bckupTempObj.Remarks
  this.ObjRawMatRev = new RawMatRev()
  this.AllMaterialName = []
  this.DocDate = new Date()
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
    this.AddRawMatRevList.forEach(ele => {
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
}
onConfirm(){

}
ConfirmSave(){
  this.ngxService.start();
  const obj = {
    "SP_String": this.spString,
    "Report_Name_String": "Create_BL_Txn_Production_Raw_Material_Receive",
    "Json_Param_String": JSON.stringify(this.AddRawMatRevList)      
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
      this.items = ["BROWSE", "CREATE"];
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
}
class RawMatRev{
  Doc_No:any
  Doc_Date:any
  Production_PO_No:any
  Production_Ref_NO:any
  Product_ID:any
  Product_Name:any
  UOM:any
  Receive_Qty:any
  Batch_Lot_No:any
  Vehicle_No:any
  Godown_ID:any
  Purpose:any
  Remarks:any
  Created_By:any
}
class Browse {
  From_Date : Date ;
  To_Date : Date;
}