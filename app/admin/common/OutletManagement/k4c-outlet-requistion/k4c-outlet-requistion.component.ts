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
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-k4c-outlet-requistion',
  templateUrl: './k4c-outlet-requistion.component.html',
  styleUrls: ['./k4c-outlet-requistion.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cOutletRequistionComponent implements OnInit {

  requistion_no_gen : number;
  Spinner = false;
  display: boolean = false;
  popUP_Display:boolean = false;
  filteredData = [];
  tabIndexToView = 0;
  buttonname = "Save";
  items = [];
  requistionId : number;
  edit = false;
  valid = false;
  expanded = false;
  GetAllDataList = [];
  Qty = '';
  seachSpinner = false;
  StockSearchFormSubmitted = false;
  menuList = [];
  dateList = [];
  Product_ID = [];
  rowGroupMetadata: any;
  cars = [];
  brandInput = false ;
  myDate : Date;
  cutOffDate : Date;
  today = new Date();
  BirthDate:Date;
  OutletNameList = [];
  RequisitionList = [];
  disinput = false;
  Bdate = Date;
  disabled: boolean = true;
  viewList = [];
  viewpop = false;
  timeOut = false;
  Requition_No :number
  date:any;
  status = "";
  buttonDis = false;
  can_popup = false;
  act_popup = false;
  initDate = [];
  ObjRequistion: Requistion = new Requistion();
  ObjRequistionSave: RequistionSave = new RequistionSave();
  ObjBrowseData: BrowseData = new BrowseData();
  Boutletdisableflag = false;
  outletdisableflag = false;
  excelList = [];
  ShowRemarks: any;
  CheckCreate: any;
  indentsaveSpinner = false;
  lockdate:any;

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService) {

    }

  ngOnInit() {
    $(".content-header").removeClass("collapse-pos");
    $(".content").removeClass("collapse-pos");
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Indent",
      Link: " Outlet -> Indent"
    });
 this.onload();
 this.GetOutletName();
 this.getLockDate();
 this.CheckRequisitionForCreate();
  }

  async onload() {
   await this.getProductSubTypeList().then(response => {
     console.log("pageLoad ====",response);
    var TimeOut = response[0].Allow;
   ///var TimeOut = "h";
   // console.log("TimeOut",TimeOut);
     if(TimeOut == "YES"){
       this.disabled = false;
       this.popUP_Display = false;
       this.buttonDis = false;
      this.GetDate();


      }
      else {
        this.popUP_Display = true;
        this.disabled = true;
        this.buttonDis = true;
      }
    });
  }
  async getProductSubTypeList(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get Sale Requisition Time Out",
      "Json_Param_String": JSON.stringify([{Doc_Type : "Requi"}])
    }
     const response = await this.GlobalAPI.getData(obj).toPromise();
    return response;

  }

GetOutletName(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Cost Center Name All",
    "Json_Param_String": JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}])
   // "Json_Param_String": JSON.stringify([{User_ID : 61}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   // console.log("OutletNameList  ===",data);
     this.OutletNameList = data;
     //this.ObjBrowseData.Cost_Cen_ID_B = this.OutletNameList.length === 1 ? this.OutletNameList[0].Cost_Cen_ID : undefined;
    // this.ObjRequistion.Cost_Cen_ID = this.OutletNameList.length === 1 ? this.OutletNameList[0].Cost_Cen_ID : undefined;
     //this.ObjRequistion.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     if(this.OutletNameList.length){

      this.disinput = true;
      this.getRequisition();

  }
  if(this.$CompacctAPI.CompacctCookies.User_Type === 'A'){
    this.ObjBrowseData.Cost_Cen_ID_B = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.Boutletdisableflag = false;
    this.ObjRequistion.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.outletdisableflag = false;
    } else {
      this.ObjBrowseData.Cost_Cen_ID_B = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.Boutletdisableflag = true;
      this.ObjRequistion.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.outletdisableflag = true;
    }

  })
}
GetDate(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get Sale Requisition Date",
    "Json_Param_String": JSON.stringify([{Doc_Type : "Requi"}])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("OutletNameList  ===",data);
    this.dateList = data;
    //console.log("this.dateList  ===",this.dateList);
    //this.ObjRequistion.Req_Date = new Date(data[0].Requisition_Date);
    this.myDate =  new Date(data[0].Requisition_Date);
    this.cutOffDate = new Date(data[0].Requision_Time);
    this.initDate = [this.myDate , this.myDate];
    // on save use this
    //this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));??
   // console.log("dateList  ===",this.myDate);
  })
}
TabClick(e) {
  this.tabIndexToView = e.index;
  this.items = ["BROWSE", "CREATE"];
  this.brandInput = false ;
  this.buttonname = "Create";
  //this.onload();
  this.RequisitionList =[];
  this.clearData();
  this.indentsaveSpinner = false;
}
clearData(){
  //this.ObjRequistion= new Requistion();
  if(this.$CompacctAPI.CompacctCookies.User_Type === 'A'){
    this.ObjBrowseData.Cost_Cen_ID_B = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.Boutletdisableflag = false;
    this.ObjRequistion.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.outletdisableflag = false;
    } else {
      this.ObjBrowseData.Cost_Cen_ID_B = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.Boutletdisableflag = true;
      this.ObjRequistion.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.outletdisableflag = true;
    }
  if(this.OutletNameList.length && this.buttonname === "Create"){

    this.disinput = true;
    this.getRequisition();

}
  this.buttonDis = false;
  this.requistionId = undefined;
  this.StockSearchFormSubmitted = false;
  this.expanded = false;
  this.Product_ID = [];
  this.GetDate();
  this.ngxService.stop();
}
getConfirmDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjBrowseData.req_date_B = dateRangeObj[0];
    this.ObjBrowseData.req_date2 = dateRangeObj[1];
  }
}
getRequisition(){
  var ProductType=[];
  this.rowGroupMetadata = {};
  this.cars = [];
  this.RequisitionList = [];
  this.updateRowGroupMetaData();
if(this.ObjRequistion.Cost_Cen_ID){
 //console.log(this.ObjRequistion.Cost_Cen_ID);
  const TempObj ={
    Cost_Cen_ID : this.ObjRequistion.Cost_Cen_ID,
    Doc_Type : "Requi",
    User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
    Doc_Date : this.DateService.dateTimeConvert(new Date(this.myDate))
  }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get Sale Requisition Product",
    "Json_Param_String": JSON.stringify([TempObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   console.log("data",data);
    this.RequisitionList = data;
    this.RequisitionList.forEach((item)=>{
      if(!item.Req_Qty){
        item.Req_Qty = undefined;
      }
    })
    this.cars = this.RequisitionList;
    this.updateRowGroupMetaData();


  // console.log("RequisitionList",this.RequisitionList)
  })
}
}
SearchStockBill(valid) {
  this.StockSearchFormSubmitted = true;
  if (valid) {
    this.seachSpinner = true;
    const start = this.ObjBrowseData.req_date_B
      ? this.DateService.dateConvert(new Date(this.ObjBrowseData.req_date_B))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseData.req_date2
      ? this.DateService.dateConvert(new Date(this.ObjBrowseData.req_date2))
      : this.DateService.dateConvert(new Date());
    const tempDate = {
      From_Date :start,
      To_Date :end,
      Cost_Cen_ID :this.ObjBrowseData.Cost_Cen_ID_B ? this.ObjBrowseData.Cost_Cen_ID_B : 0,
      Material_Type : 'Finished'
      //Cost_Cen_ID :30
    }
    //console.log("tempDate",tempDate);

      const objj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "Browse - Requisition",
        "Json_Param_String": JSON.stringify([tempDate])
      }
      this.GlobalAPI.getData(objj).subscribe((data:any)=>{
        this.GetAllDataList = data;

       console.log("GetAllDataList",this.GetAllDataList)
       this.seachSpinner = false;


      })
  }
}

trackByFunction = (index, item) => {
  //return item.Product_ID // O index
}
// Edit New

editmaster(masterProduct){
  this.edit = true;
  if(masterProduct.Req_No){
    if(this.checkLockDate(masterProduct.Req_Date)){
  this.tabIndexToView = 1;
  this.items = ["BROWSE", "UPDATE"];
  this.buttonname = "Update";
  this.brandInput = true;
  this.buttonDis = false;
  //this.RequisitionList = [];
  this.clearData();
  this.geteditmaster(masterProduct);
    }
  }
}
geteditmaster(masterProduct){
  // console.log(product_id)
  this.requistionId =  masterProduct.Req_No ;
  //console.log("this.requistionId",this.requistionId);
  const tempObj = {
     Req_No_Gen: masterProduct.Req_No
  }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get Requisition Data",
    "Json_Param_String": JSON.stringify([tempObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{

    const editDataList = data;
    console.log("Edit data Form Api",data);
    this.ObjRequistion.Cost_Cen_ID = data[0].Cost_Cen_ID;
    this.ObjRequistion.Cost_Cen_Name = data[0].Cost_Cen_Name;
    this.myDate =  new Date(data[0].Req_Date);
    this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(data[0].Req_Date));;
    //console.log(" this.ObjRequistion ===", this.ObjRequistion)
    // editDataList.forEach(el => {
    //   const tempProduct = {
    //     'Amount': el.Amount,
    //     'Product_Description': el.Product_Description,
    //     'Product_ID': el.Product_ID,
    //     'Sale_rate': el.Rate,
    //     'Req_Date': el.Req_Date,
    //     'Req_ID': el.Req_ID,
    //     'Req_No': el.Req_No,
    //     'Req_Qty': el.Req_Qty,
    //     'Req_Type': el.Req_Type,
    //     'Product_Type' : el.Product_Type,
    //     'UOM' : el.UOM
    //   }
    //   this.RequisitionList.push(editDataList)

    // });
    // for(let i = 0; i < this.RequisitionList.length ; i++){
    // const aRR =  editDataList.filter(obj=> this.RequisitionList[i].Product_ID === obj.Product_ID);

    // if(aRR.length) {
    //   console.log("aRR[0].Req_Qty",aRR[0].Req_Qty);
    //   this.RequisitionList[i]['Amount'] += aRR[0].Amount;
    //   this.RequisitionList[i]['Req_Qty'] += aRR[0].Req_Qty;
    // }
    // }
    this.RequisitionList.forEach(el =>{
      const aRR =  editDataList.filter(obj=> el.Product_ID === obj.Product_ID);
      if(aRR.length){
        el.Amount = aRR[0].Amount;
        el.Req_Qty = aRR[0].Req_Qty;
      }
    })
    console.log("RequisitionList===",this.RequisitionList);


  this.updateRowGroupMetaData();
   })

}
view(masterProduct){
  this.Requition_No = undefined;
  this.date = undefined;
  const tempObj = {
    Req_No_Gen: masterProduct.Req_No
 }
 const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get Requisition Data",
    "Json_Param_String": JSON.stringify([tempObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.viewList = data;
    this.Requition_No = data[0].Req_No;
    this.date = new Date(data[0].Req_Date)
    this.viewpop = true;
    //console.log("this.viewList",this.viewList);
  })
}
TotalValue(key){
  let totalval = 0;
  this.viewList.forEach((item)=>{
    totalval += Number(item[key]);
  });

  return totalval ? totalval.toFixed(2) : '-';
}
updateRowGroupMetaData() {
  this.rowGroupMetadata = {};
  let previousRowGroup = [];

        if (this.RequisitionList) {
            for (let i = 0; i < this.RequisitionList.length; i++) {
                let rowData = this.RequisitionList[i];
                //console.log("rowData ===",rowData);
                let Product_Type = rowData.Product_Type;
                if (i == 0) {
                    this.rowGroupMetadata[Product_Type] = { index: 0, size: 1 };
                }
                else {
                    let previousRowData = this.RequisitionList[i - 1];
                    let previousRowGroup = previousRowData.Product_Type;

                    if (Product_Type === previousRowGroup){
                      this.rowGroupMetadata[Product_Type].size++;
                    }else {
                      this.rowGroupMetadata[Product_Type] = { index: i, size: 1 };
                    }
                }
            }
        }
    }
QtyChanged(indx) {
     // console.log("indx===",indx);
      this.RequisitionList[indx]['Amount'] =  undefined;
      if(this.RequisitionList[indx]['Req_Qty'] && this.RequisitionList[indx]['Sale_rate']){
        this.RequisitionList[indx]['Amount'] = this.RequisitionList[indx]['Req_Qty'] * this.RequisitionList[indx]['Sale_rate'];
      }
    }
getTotalValue(){
  let val = 0;
  this.filteredData.forEach((item)=>{
    val += item.Amount
  });

  return val ? val : '-';
}
showDialog() {
  if(this.checkLockDate(this.DateService.dateConvert(new Date(this.myDate)))) {
  this.display = true;
  this.filteredData = [];
  this.indentsaveSpinner = false;
  this.RequisitionList.forEach(obj => {
    if(obj.Req_Qty && Number(obj.Req_Qty) !== 0 ){
    //  console.log(filteredData.push(obj.Product_ID));
    this.filteredData.push(obj);
     // console.log("this.filteredData===",this.filteredData);
    }

 })
 }
}
saveREquistion(){
  this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));
  this.OutletNameList.forEach(el =>{
    if(this.ObjRequistion.Cost_Cen_ID == el.Cost_Cen_ID){
      this.ObjRequistion.Cost_Cen_Name = el.Cost_Cen_Name;
    }
  })
  // console.log("this.filteredData",this.filteredData);
   if(this.requistionId){
    this.ngxService.start();
    this.indentsaveSpinner = true;
    this.Product_ID = [];
    // console.log("Update");

    this.filteredData.forEach(el =>{
     const obj = {
        Material_Type : "Finished",
        Product_ID : el.Product_ID,
        Req_Type : "WEB",
        Req_No_Gen : this.requistionId,
        Req_Qty :el.Req_Qty,
        Product_Description : el.Product_Description,
        Rate : el.Sale_rate,
        Amount : el.Amount,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID
  }
  this.Product_ID.push({...this.ObjRequistion,...obj})
    })
  // console.log("this.Product_ID",this.Product_ID)
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Add Requisition",
      "Json_Param_String": JSON.stringify(this.Product_ID)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log("Column1 ===",data[0].Column1);
     //var tempID = data[0].Column1;
     // console.log("update data",data);
     if(data[0].Column1 === this.requistionId && data[0].Status === "Success"){
      this.valid = true;
      this.SearchStockBill(this.valid);
      this.ngxService.stop();
      this.indentsaveSpinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Indent Entry No. " + this.requistionId,
       detail: "Succesfully Updated"
     });
     this.buttonDis = false;
     this.filteredData = [];
     this.RequisitionList =[]
     this.display = false;
     this.tabIndexToView = 0;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Create";
     this.clearData()
    }
    else if(data[0].Column1 === this.requistionId && data[0].Status === "Indent cutoff time over, can not edit") {
      this.timeOut = true;
      this.display = false;
      this.status = "Indent Time is crossed, You Can not edit this Indent" ; ;
   }
   else{
    this.indentsaveSpinner = false;
    this.ngxService.stop();
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Something Wrong"
        });
  }

    })

   }
   else{
    this.ngxService.start();
    this.Product_ID = [];
    this.indentsaveSpinner = true;
    // console.log("Save");
    this.filteredData.forEach(el =>{
      const obj = {
        Material_Type : "Finished",
        Product_ID : el.Product_ID,
        Req_Type : "WEB",
        Req_No_Gen :"A",
        Req_Qty :Number(el.Req_Qty),
        Product_Description : el.Product_Description,
        Rate : el.Sale_rate,
        Amount : el.Amount,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID

      }
      this.Product_ID.push({...this.ObjRequistion,...obj})
     })
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Add Requisition",
      "Json_Param_String": JSON.stringify(this.Product_ID)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log("Column1 ===",data[0].Column1);
     var tempID = data[0].Column1;
     if(data[0].Column1 && data[0].Status === "Success"){
      this.valid = true;
      this.ObjBrowseData. Cost_Cen_ID_B = this.ObjRequistion.Cost_Cen_ID;
      this.SearchStockBill(this.valid);
      this.ngxService.stop();
      this.indentsaveSpinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Indent Entry No. " + tempID,
       detail: "Indent Entry Succesfully"
     });
     this.buttonDis = false;
     this.RequisitionList =[]
     this.filteredData = [];
     this.display = false;
     this.tabIndexToView = 0;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Create";
    }
    else if(data[0].Column1 && data[0].Status === "Indent cutoff time over, can not edit") {
       this.timeOut = true;
       this.display = false;
       this.status = "Indent Time is crossed, You Can not Save this Indent" ;
    }
    else{
      this.indentsaveSpinner = false;
      this.ngxService.stop();
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Something Wrong"
          });
    }

    //this.ObjRequistion.Cost_Cen_ID = "undefined";
    this.clearData();
    })
   }
  
}
getLockDate(){
  const obj = {
   "SP_String": "sp_Comm_Controller",
   "Report_Name_String": "Get_LockDate",
   //"Json_Param_String": JSON.stringify([{Doc_Type : "Sale_Bill"}])

 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
//   console.log('LockDate===',data);
  this.lockdate = data[0].dated;

})
}
checkLockDate(docdate){
  if(this.lockdate && docdate){
    if(new Date(docdate) > new Date(this.lockdate)){
      return true;
    } else {
      var msg = this.tabIndexToView === 0 ? "edit or delete" : "create";
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "error",
       summary: "Warn Message",
       detail: "Can't "+msg+" this document. Transaction locked till "+ this.DateService.dateConvert(new Date (this.lockdate))
    });
      return false;
    }
  } else {
    this.Spinner = false;
    this.compacctToast.clear();
    this.compacctToast.add({
     key: "compacct-toast",
     severity: "error",
     summary: "Warn Message",
     detail: "Date not found."
    });
    return false;
  }
}
Cancle(row){
  // console.log("requistion_no_gen ===", this.requistion_no_gen)
  this.requistionId = undefined ;
  this.requistion_no_gen = undefined ;
  this.act_popup = false;
  if(row.Req_No){
    if(this.checkLockDate(row.Req_Date)){
    this.can_popup = true;
  this.requistionId = row.Req_No ;
  // console.log("delete Rowr ===", this.requistionId);
  this.requistion_no_gen = row.Req_No;
  this.compacctToast.clear();
  this.compacctToast.add({
    key: "c",
    sticky: true,
    severity: "warn",
    summary: "Are you sure?",
    detail: "Confirm to proceed"
    });
    }
  }
 }
 onReject(){
  this.compacctToast.clear("c");
}
 onConfirm(){
  console.log("cen_popup");
  if(this.$CompacctAPI.CompacctCookies.User_Type === 'A'){
    if(this.requistionId){
      const TempObj ={
        Req_No_Gen : this.requistion_no_gen
      }
      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "Cancle Requisition From Admin Side",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log("del Data===", data[0].Column1);
         var msg = data[0].Column1
        if (data[0].Column1){
          this.onReject();
         // this.getRowData();
         this.can_popup = false;
         this.valid = true;
         this.SearchStockBill(this.valid);
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Indent No: " + this.requistionId.toString(),
            detail: msg
          });
         }
      })
    }
  } else {
  if(this.requistionId){
      const TempObj ={
        Req_No_Gen : this.requistion_no_gen
      }
      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "Cancle Requisition",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log("del Data===", data[0].Column1);
        if (data[0].Column1 === "Done"){
          this.onReject();
         // this.getRowData();
         this.can_popup = false;
         this.valid = true;
         this.SearchStockBill(this.valid);
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Indent No: " + this.requistionId.toString(),
            detail: "Succesfully Cancel"
          });
         }
         else if(data[0].Column1 === "Requisition cut off time is over"){
          this.valid = true;
          this.timeOut = true;
          this.can_popup = false;
          this.onReject();
          this.SearchStockBill(this.valid);
          this.status = "Indent cutoff time over, can not Cancel"
        }
      })
    }
  }
}

Active(row){
  var tempId = row.Req_No;
  this.can_popup = false;
  this.requistionId = undefined ;
  this.requistion_no_gen = undefined ;
  if(row.Req_No){
    if(this.checkLockDate(row.Req_Date)){
    this.act_popup = true;
  this.requistionId = row.Req_No ;
  console.log("delete Rowr ===", this.requistionId);
  this.requistion_no_gen = row.Req_No;
  this.compacctToast.clear();
  this.compacctToast.add({
    key: "c",
    sticky: true,
    severity: "warn",
    summary: "Are you sure?",
    detail: "Confirm to proceed"
    });
  }
   }

}
onConfirm2(){

  if(this.requistionId){
    const TempObj ={
      Req_No_Gen : this.requistionId
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Active  Requisition",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if (data[0].Column1 === "Done"){
        this.act_popup = false;
        this.valid = true;
        this.onReject();
         this.SearchStockBill(this.valid);
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Indent No: " + this.requistionId.toString(),
            detail: "Succesfully Active"
          });
      }

    })
  }
}

exportoexcel(tempobj,fileName){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Indent Data Excel",
    "Json_Param_String": JSON.stringify([{Req_No_Gen : tempobj.Req_No}])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.excelList = data;
    let temp = [];
    this.excelList.forEach(element => {
       const obj = {
        Req_No : element.Req_No,
        Req_Date : this.DateService.dateConvert(new Date(element.Req_Date)),
        Cost_Cen_Name : element.Cost_Cen_Name,
        Product_ID : element.Product_ID,
        Product_Type : element.Product_Type,
        Product_Description : element.Product_Description,
        Req_Qty : element.Req_Qty,
        UOM : element.UOM
       }
       temp.push(obj)
     });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(temp);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
    
  })
}
CheckRequisitionForCreate() {
  this.ShowRemarks = undefined;
  this.CheckCreate = undefined;
    const object = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
      const objj = {
        "SP_String": "SP_Add_ON",
        "Report_Name_String": "Credit_Limit_Check",
        "Json_Param_String": JSON.stringify([object])
      }
      this.GlobalAPI.getData(objj).subscribe((data:any)=>{
        this.ShowRemarks = data[0].Remarks;
        this.CheckCreate = data[0].Allow_Requisition;

       console.log("ShowRemarks",this.ShowRemarks)
      })
}
exportoexcelbrowse(Arr,fileName): void {
  let temp:any = [];
     Arr.forEach(element => {
       const obj = {
        Req_No : element.Req_No,
        Req_Date : this.DateService.dateConvert(new Date(element.Req_Date)),
        Cost_Cen_Name : element.Cost_Cen_Name,
        Transaction_Date_Time : element.Transaction_Date_Time,
        amount : element.amount,
        Challan_No : element.Challan_No,
        Franchise_Sale_Bill_No : element.Franchise_Sale_Bill_No
       }
       temp.push(obj)
     });
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(temp);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, fileName+'.xlsx');
}
exportoexcelProductWise(Arr,fileName): void {
  let temp:any = [];
     Arr.forEach(element => {
       const obj = {
        Product_Description : element.Product_Description,
        Rate : element.Rate,
        Req_Qty : element.Req_Qty,
        UOM : element.UOM,
        Amount : element.Amount
       }
       temp.push(obj)
     });
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(temp);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, fileName+'.xlsx');
}
}
class Requistion {
  Cost_Cen_ID : any;
  Req_Date : string;
  Cost_Cen_Name:string ;

}
class RequistionSave {
  Req_No="A";
  Product_ID = 0;
  Product_Description:string;
  Req_Qty = 0 ;
  Rate = 0;
  Amount = 0;
  Req_Type = "WEB";
  Req_ID = 0;
  Req_No_Gen : any;
}
class BrowseData {
  req_date_B: string;
  req_date2: string;
  Cost_Cen_ID_B: number;

}
