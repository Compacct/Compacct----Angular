import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
import { NumberValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-micl-dispatch-challan',
  templateUrl: './micl-dispatch-challan.component.html',
  styleUrls: ['./micl-dispatch-challan.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MiclDispatchChallanComponent implements OnInit {
  Objdispatch: dispatch = new dispatch()
  // Objadditem: additem = new additem ()
  ObjBrowseData : BrowseData = new BrowseData ()
  DispatchFormSubmit = false;
  FromCostCenterList:any = [];
  FromGodownList:any = [];
  ToCostCenterList = [];
  ToGodownList:any = [];
  ReqDate : any = new Date();

  DispatchSearchFormSubmit = false;
  BrowseCostCenterList:any = [];
  BrowseGodownList:any = [];

  doc_no : any;
  createdby : any;

  costcenterList:any = [];
  myDate : Date;
  ChallanDate : any = new Date() ;
  productDetails:any = [];
  buttonname = "Create";
  Spinner = false;
  SpinnerShow = false;
  itemList:any =[];
  items:any = [];
  tabIndexToView = 0;
  menuList:any = [];
  brandInput = false ;
  NativeitemList:any = [];
  adlist: any = {};
  EditList:any = [];
  inList = false;
  saveData:any = [];
  outLetDis = false;
  GetAllDataList:any = [];
  VehicleList:any = [];
  AddtionalFormSubmit = false;
  matchflag = true;
  AdditioanFormSubmit = false;
  OutletFormSubmit = false;
  disabled: boolean = true;
  seachSpinner = false;
  outletList:any = [];
  brandList:any = [];
  brandListBro:any = [];
  toGodownList:any = [];
  BatchList:any = [];
  reqNumber:any;
  outletListBro:any = [];
  data = "(Show All Products)";
  inputBoxDisabled = false;
  docdateDisabled = true;
  indentdateDisabled = true;
  //adDisabled = true;
  RequistionSearchFormSubmit = false;
  flag = false;
  toutLetDis = false;
  To_Godown_ID_Dis = false;
  From_Godown_ID_Dis = false;
  editPopUp = false;
  editdataList:any = [];
  brand = undefined;
  toOutlet = undefined;
  OutletStokePoint = undefined;
  challanDate : any;
  fromStokePoint = undefined;
  VehicleDetails = undefined;
  Remarks = undefined;
  editFlag = false;
  editDis = false;
  reqQTYdis = true;
  AccQtydis = false;
  initDate:any = [];
  doc_date: any;
  filteredData:any = [];
  displaysavepopup = false;
  IndentNoList:any = [];
  BackupIndentList:any = [];
  IndentFilter:any = [];
  SelectedIndent: any;
  TIndentList:any = [];
  BackUpproductDetails:any = [];
  Refreshlist:any = [];
  RefreshData:any = [];
  editIndentList:any = [];
  Auto_Accepted: any;
  totalqty: any;
  totalaccpqty: any;
  batchqty: any;
  totaldelqty: any;

  FranchiseBill:any;
  dispatchchallanno: any;
  FranchiseProductList:any = [];
  currentDate : any = new Date();
  FranchiseList:any = [];
  subledgerid:any;
  franchisecostcenid:any;

  taxable: any;
  cgst: any;
  sgst: any;
  igst: any;
  grossamount: any;
  netamount: any;
  Round_Off: any;
  editdocno: any;

  viewproductDetails:any = [];
  viewDocNO = undefined;
  viewFromStokePoint = undefined;
  viewdate = undefined;
  tabView = false;

  Regeneratelist:any = [];
  contactname = undefined;
  taxableRegenerate: any;
  cgstRegenerate: any;
  sgstRegenerate: any;
  igstRegenerate: any;
  grossamountRegenerate: any;
  Round_OffRegenerate: any;
  netamountRegenerate: any;
  costcenforregenerate = undefined;
  subledgeridforregenerate: any;
  RegenerateDocNo = undefined;
  RegenerateDocDate = undefined;
  RegenerateBillNo = undefined;
  franchisechallandate: any = Date;

  ObjPendingIndent = new PendingIndent();
  PendingIndentFormSubmitted = false;
  PendingIndentList:any = [];
  DynamicHeaderforPIndent:any = [];
  costcenterListPeding:any = [];

  createchallandisabled = false;
  createChallanflag = true;
  indentlistdisabled = false;
  creteChallanList: any = [];
  DOrderBy:any = []
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE", "PENDING ISSUE REQ", "STOCK"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Issue Material",
      Link: "Material Management -> Outward -> Issue Material"
    });
    this.Finyear();
    this.GetFromCostcenter();
    // this.GetFromGodown();
    this.GetToCostCenter();
    // this.Objdispatch.To_Godown_ID= this.ToGodownList.length ? this.ToGodownList[0].Godown_ID : undefined;
    // this.GetToGodown();
    this.GetBrowseCostcenter();
    // this.ObjBrowseData.Cost_Cen_ID = undefined;
    this.getCostcenter();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE", "PENDING ISSUE REQ", "STOCK"];
    this.brandInput = false ;
    this.buttonname = "Save";
    //this.ObjBrowseData = new BrowseData ()
    this.Objdispatch= new dispatch();
    // this.FromGodownList = [];
    // this.ToGodownList = [];
    this.productDetails = [];
    this.BackUpproductDetails = [];
    this.inputBoxDisabled = false;
    this.createchallandisabled = false;
    this.indentlistdisabled = false;
    this.indentdateDisabled = true;
    this.docdateDisabled = true;
    // this.From_Godown_ID_Dis = false;
    // this.To_Godown_ID_Dis = false;
   // this.adDisabled = true;
    // this.ObjBrowseData.Godown_ID = undefined;
    // this.ObjBrowseData.Cost_Cen_ID = undefined;
    this.clearData();
    this.ReqDate = new Date();
    this.ChallanDate = new Date();
    //this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
    this.SelectedIndent = undefined;
    this.IndentFilter = [];
  }
  clearData(){
  // this.ObjBrowseData.Cost_Cen_ID = this.BrowseCostCenterList.length === 1 ? this.BrowseCostCenterList[0].Cost_Cen_ID : undefined;
  // this.Objdispatch.F_Cost_Cen_ID = this.FromCostCenterList.length === 1 ? this.FromCostCenterList[0].Cost_Cen_ID : undefined;
  // this.Objdispatch.To_Cost_Cen_ID = this.ToCostCenterList.length === 1 ? this.ToCostCenterList[0].Cost_Cen_ID : undefined;
  // this.ObjBrowseData.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  // this.GetBrowseGodown();
  // this.ObjBrowseData.Godown_ID = this.BrowseGodownList[0].Godown_ID;
  this.Objdispatch.F_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  this.GetFromGodown();
  // this.Objdispatch.F_Godown_ID = this.FromGodownList[0].Godown_ID;
  this.Objdispatch.To_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  this.GetToGodown();
  this.creteChallanList = [];
  // this.Objdispatch.To_Godown_ID= this.ToGodownList.length ? this.ToGodownList[0].Godown_ID : undefined;
  // this.Objdispatch.To_Godown_ID = this.ToGodownList[0].Godown_ID;
  console.log("this.ObjBrowseData.Cost_Cen_ID",this.ObjBrowseData.Cost_Cen_ID);
  this.doc_no = undefined;
  this.DispatchFormSubmit = false;
  this.reqNumber = undefined;
  this.editDis = false;
  this.reqQTYdis = true;
  this.AccQtydis = false;
  this.EditList = [];
  // this.editIndentList = [];
  // this.todayDate = new Date();
  // this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
  //this.SelectedIndent = [];
  // this.IndentNoList = [];
  // this.BackupIndentList = [];
  //this.IndentFilter = []
  this.IndentNoList = [];
  this.SelectedIndent = undefined;
  this.ngxService.stop();
  this.createchallandisabled = false;
  this.indentlistdisabled = false;
  this.createChallanflag = true;
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
      // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
      // this.voucherminDate = new Date(data[0].Fin_Year_Start);
      // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }
  GetFromCostcenter(){
    const obj = {
      "SP_String": "SP_MICL_Dispatch_Challan",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("costcenterList  ===",data);
      this.FromCostCenterList = data;
      this.Objdispatch.F_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      // if(this.Objdispatch.F_Cost_Cen_ID){
      //   this.toutLetDis = true;
      // }
        this.GetFromGodown();
      })
  }
  GetFromGodown(){
    this.FromGodownList = []
    // this.toutLetDis = true;
    // console.log(this.Objdispatch.Cost_Cen_ID)
    const obj = {
      "SP_String": "SP_MICL_Dispatch_Challan",
      "Report_Name_String": "Get_Cost_Center_Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.Objdispatch.F_Cost_Cen_ID}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.FromGodownList = data;
      console.log("this.FromGodownList",this.FromGodownList);
      this.Objdispatch.F_Godown_ID= this.FromGodownList.length ? this.FromGodownList[0].Godown_ID : undefined;
      // if(this.Objdispatch.F_Godown_ID){
      //   this.To_Godown_ID_Dis = true;
      // }
    })
  }
  GetToCostCenter(){
    const obj = {
      "SP_String": "SP_MICL_Dispatch_Challan",
      "Report_Name_String": "Get_Cost_Center",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ToCostCenterList = data;
      console.log("ToCostCenterList  ===",this.ToCostCenterList);
      this.Objdispatch.To_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      // if(this.Objdispatch.To_Cost_Cen_ID){
      //   this.toutLetDis = true;
      // }
      this.GetToGodown();
    })
  }
  GetToGodown(){
    this.ToGodownList = [];
    // this.toutLetDis = true;
    // console.log(this.Objdispatch.Cost_Cen_ID)
    const obj = {
      "SP_String": "SP_MICL_Dispatch_Challan",
      "Report_Name_String": "Get_Cost_Center_Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.Objdispatch.To_Cost_Cen_ID}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ToGodownList = data;
      console.log("this.toGodownList",this.ToGodownList);
      if (!this.creteChallanList.length){
      this.Objdispatch.To_Godown_ID= this.ToGodownList.length ? this.ToGodownList[0].Godown_ID : undefined;
      }
      // if(this.Objdispatch.To_Godown_ID){
      //   this.To_Godown_ID_Dis = true;
      // }
    })
  }
  // FOR INDENT NUMBER
  GetIndentList(valid){
    // this.RawMaterialIssueFormSubmitted = true;
    this.IndentNoList = [];
    this.DispatchFormSubmit = true;
     if(valid){
      this.SpinnerShow = true;
     const TempObj = {
       Req_Date : this.DateService.dateConvert(new Date(this.ReqDate)),
       Cost_Cen_ID : this.Objdispatch.To_Cost_Cen_ID,
      }
    const obj = {
     "SP_String": "SP_MICL_Dispatch_Challan",
     "Report_Name_String" : "Get_Requisition_List",
    "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // if(data.length) {
     //   data.forEach(element => {
     //     element['label'] = element.Req_No,
     //     element['value'] = element.Req_No
     //   });
       this.IndentNoList = data;
       this.BackupIndentList = data;
      // this.adDisabled = false;
      if (!this.createchallandisabled) {
      this.inputBoxDisabled = true;
      this.docdateDisabled = false;
      this.indentlistdisabled = false;
      }
      this.createchallandisabled = true;
      this.indentdateDisabled = false;
      this.From_Godown_ID_Dis = true;
      this.To_Godown_ID_Dis = true;
      this.SpinnerShow = false;
      this.DispatchFormSubmit = false;
     // } else {
     //   this.IndentNoList = [];

     //  }
    // this.RawMaterialIssueFormSubmitted = false;
    console.log("this.Indentlist======",this.IndentNoList);
    this.GetIndent();
   })
  }
   }
   GetIndent(){
     let DIndent = [];
     this.IndentFilter = [];
    //  this.SelectedIndent = [];
     this.BackupIndentList.forEach((item) => {
       if (DIndent.indexOf(item.Req_No) === -1) {
         DIndent.push(item.Req_No);
         this.IndentFilter.push({ label: item.Req_No , value: item.Req_No });
         console.log("this.IndentFilter", this.IndentFilter);
       }
     });
     this.BackupIndentList = [...this.IndentNoList];
   }
   filterIndentList() {
     //console.log("SelectedTimeRange", this.SelectedTimeRange);
     let DIndent = [];
     this.TIndentList = [];
     //const temparr = this.ProductionlList.filter((item)=> item.Qty);
     if (!this.EditList.length){
      this.BackUpproductDetails =[];
      this.productDetails = [];
      this.GetshowProduct();
      }
      // if(this.editIndentList.length){
      //   this.BackUpproductDetails =[];
      // this.productDetails = [];
      //   this.GetProductionproforEdit();
      //   }
    //  this.productDetails = [];
    //  this.GetshowProduct(true,true);
     if (this.SelectedIndent.length) {
       this.TIndentList.push('Req_No');
       DIndent = this.SelectedIndent;
     }
     if(this.EditList.length) {
      this.productDetails = [];
      if (this.TIndentList.length) {
        let LeadArr = this.BackUpproductDetails.filter(function (e) {
          return (DIndent.length ? DIndent.includes(e['Req_No']) : true)
        });
        this.productDetails = LeadArr.length ? LeadArr : [];
      } else {
        this.productDetails = [...this.BackUpproductDetails];
        console.log("else Get indent list", this.IndentNoList)
      }
    }

   }
   clearbutton(){
     this.Objdispatch= new dispatch();
    //  this.FromGodownList = [];
    //  this.FromGodownList = [];
     this.productDetails = [];
     this.BackUpproductDetails = [];
     this.inputBoxDisabled = false;
     this.createchallandisabled = false;
     this.indentlistdisabled = false;
     this.indentdateDisabled = true;
     this.docdateDisabled = true;
   //  this.adDisabled = true;
     this.clearData();
     this.ReqDate = new Date();
     this.ChallanDate = new Date();
     // this.todayDate = new Date();
     // this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
     this.SelectedIndent = undefined;
     this.IndentFilter = [];
   }// TABLE DATA
  dataforShowproduct(){
    if(this.SelectedIndent) {
      let Arr =[]
      // this.SelectedIndent.forEach(el => {
        // if(el){
          const Dobj = {
            // Req_No : el,
            Req_No : this.SelectedIndent,
            F_Cost_Cen_ID: Number(this.Objdispatch.F_Cost_Cen_ID),
            F_Godown_ID : Number(this.Objdispatch.F_Godown_ID),
            To_Cost_Cen_ID: Number(this.Objdispatch.To_Cost_Cen_ID),
            To_Godown_ID : Number(this.Objdispatch.To_Godown_ID),
            Doc_Date : this.DateService.dateConvert(new Date(this.ChallanDate)),
            Req_Date : this.DateService.dateConvert(new Date(this.ReqDate))
            }
           Arr.push(Dobj)
        // }

    // });
      console.log("Table Data ===", Arr)
      return Arr.length ? JSON.stringify(Arr) : '';
    }
  }
GetshowProduct(){
  // this.DispatchFormSubmit = true;
  if(this.dataforShowproduct()){
  // if(valid){
    //this.SpinnerShow = true;
    // const tempObj = {
    //   Outlet_ID: Number(this.Objdispatch.Cost_Cen_ID),
    //   Dispatch_Outlet_ID: Number(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID),
    //   Dispatch_Godown_ID: Number(this.Objdispatch.From_Godown_ID),
    //   Challan_Date : this.DateService.dateConvert(new Date(this.ChallanDate)),
    //   Indent_Date : this.DateService.dateConvert(new Date(this.todayDate)),
    // }
    const obj = {
      "SP_String": "REP_Stock_Report",
      "Report_Name_String": "Get_Product_Details",
      "Json_Param_String": this.dataforShowproduct()
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.productDetails = data;
      //this.SpinnerShow = false;
      this.BackUpproductDetails = [...this.productDetails];
      console.log("this.productDetails",this.productDetails);
      this.productDetails.forEach(element => {
        element.Delivery_Qty = 0;
      });
      this.backupTotalReq()
      // this.inputBoxDisabled = true;
      // this.indentdateDisabled = false;
      // this.From_Godown_ID_Dis = true;
      // this.To_Godown_ID_Dis = true;

      //this.clearData();
    })
  // }
 }

}
CheckLengthProductID(ID) {
  const tempArr = this.productDetails.filter(item=> item.product_id == ID);
  return tempArr.length
}
CheckIndexProductID(ID) {
  let found = 0;
  for(let i = 0; i < this.productDetails.length; i++) {
      if (this.productDetails[i].product_id == ID) {
          found = i;
          break;
      }
  }
  return found;
}

backupTotalReq(){
  this.DOrderBy = []
  let checkarr:any = []
  this.productDetails.forEach((item) => {
      if (checkarr.indexOf(item.product_id) === -1) {
        checkarr.push(item.product_id);
        this.DOrderBy.push({product_id:item.product_id, Req_Qty:item.Req_Qty})
      }
    });
    console.log("DOrderBy",this.DOrderBy)
}


TotalReq(){
  let TotalAmt = 0;
 if(this.DOrderBy.length){
    this.DOrderBy.forEach((x:any) => {
      TotalAmt += Number(x.Req_Qty);
    });
  
    return TotalAmt ? TotalAmt.toFixed(2) : '-';
  }

}

getTotal(key){
  
  let TotalAmt = 0;
  this.productDetails.forEach((item)=>{
    TotalAmt += Number(item[key]);
  });

  return TotalAmt ? TotalAmt.toFixed(2) : '-';
}
qtyChq(col){
  this.flag = false;
  console.log("col",col);
  if(col.Delivery_Qty){
    if(col.Delivery_Qty > col.Batch_Qty){
    if(col.Delivery_Qty <=  col.Batch_Qty){
      this.flag = false;
      return true;
    }
    else {
      this.flag = true;
      this.compacctToast.clear();
           this.compacctToast.add({
               key: "compacct-toast",
               severity: "error",
               summary: "Warn Message",
               detail: "Quantity can't be more than in batch available quantity "
             });

           }
          }
           else if(col.Delivery_Qty > col.Req_Qty){
           if(col.Delivery_Qty <=  col.Req_Qty){
              this.flag = false;
              return true;
            }
            else {
              this.flag = true;
              this.compacctToast.clear();
                   this.compacctToast.add({
                       key: "compacct-toast",
                       severity: "error",
                       summary: "Warn Message",
                       detail: "Quantity can't be more than Requisition quantity "
                     });
        
                   }
            }
  }
 }
//  qtyChqEdit(col){
//   this.editFlag = false;
//   console.log("col",col);
//   if(col.Qty){
//     if(col.Qty <=  col.Batch_Qty){
//       this.editFlag = false;
//       return true;
//     }
//     else {
//       this.editFlag = true;
//       this.compacctToast.clear();
//            this.compacctToast.add({
//                key: "compacct-toast",
//                severity: "error",
//                summary: "Warn Message",
//                detail: "Quantity can't be more than in batch available quantity "
//              });

//            }
//   }
//  }
  // SAVE DISPATCH
saveqty(){
  let flag = true;
 for(let i = 0; i < this.productDetails.length ; i++){
  if(Number(this.productDetails[i].Batch_Qty) <  Number(this.productDetails[i].Delivery_Qty)){
    flag = false;
    break;
  }
 }
 return flag;
}
// saveqtyEdit(){
//   let flag = true;
//  for(let i = 0; i < this.editdataList.length ; i++){
//   if(Number(this.editdataList[i].Batch_Qty) <  Number(this.editdataList[i].Qty)){
//     flag = false;
//     break;
//   }
//  }
//  return flag;
// }
  showDialog(valid) {
    this.DispatchFormSubmit = true;
    if (valid) {
      this.DispatchFormSubmit = false;
    this.displaysavepopup = true;
    this.filteredData = [];
  //   this.BackUpproductDetails.forEach(obj => {
  //     if(obj.Delivery_Qty && Number(obj.Delivery_Qty) !== 0 ){
  //     //  console.log(filteredData.push(obj.Product_ID));
  //     this.filteredData.push(obj);
  //      // console.log("this.filteredData===",this.filteredData);
  //   }
  //  })
   this.productDetails.forEach(obj => {
    if(obj.Delivery_Qty){  //   && Number(obj.Delivery_Qty) !== 0
    //  console.log(filteredData.push(obj.Product_ID));
    this.filteredData.push(obj);
     // console.log("this.filteredData===",this.filteredData);
  }
 })
 }
  }
  getTotalIndValue(){
    let Indval = 0;
    this.filteredData.forEach((item)=>{
      Indval += Number(item.Req_Qty)
    });
    this.totalqty = (Indval).toFixed(2);
    return Indval ? Indval.toFixed(2) : '-';
  }
  getTotalBatchValue(){
    let batchval = 0;
    this.filteredData.forEach((item)=>{
      batchval += Number(item.Batch_Qty)
    });
    this.batchqty = (batchval).toFixed(2);
    return batchval ? batchval.toFixed(2) : '-';
  }
  getTotalIssueValue(){
    let issueval = 0;
    let acceptedval = 0;
    this.filteredData.forEach((item)=>{
      issueval += Number(item.Delivery_Qty)
      if (this.AccQtydis) {
      acceptedval += Number(item.Accepted_Qty)
      }
    });
    this.totaldelqty = (issueval).toFixed(2);
    this.totalaccpqty = (acceptedval).toFixed(2);
    return issueval ? issueval.toFixed(2) : '-';
  }
  // FOR SAVE DISPATCH
  getReqNo(){
    let Rarr =[]
    if(this.SelectedIndent.length) {
      this.SelectedIndent.forEach(el => {
        if(el){
          const Dobj = {
            Req_No : el
            }
            Rarr.push(Dobj)
        }

    });
      // console.log("Table Data ===", Rarr)
      // return Rarr.length ? JSON.stringify(Rarr) : '';
    }
    else {
      const Dobj = {
        Req_No : 'NA'
        }
        Rarr.push(Dobj)
    }
    console.log("Table Data ===", Rarr)
    return Rarr.length ? JSON.stringify(Rarr) : '';
  }
  saveDispatch(){
   console.log("saveqty",this.saveqty());
   console.log("this.BackUpproductDetails",this.BackUpproductDetails);
  if(this.BackUpproductDetails.length && this.saveqty()){
    // this.ngxService.start();
    // this.displaysavepopup = false;
    // if(this.doc_no){
    //   this.saveData = [];
    //   console.log ("Update");
    //   this.BackUpproductDetails.forEach(el=>{
    //     if(el.Delivery_Qty){
    //       const saveObj = {
    //         Doc_No: this.doc_no,
    //         Accepted_Qty : el.Accepted_Qty,
    //         Doc_Date: this.DateService.dateTimeConvert(new Date(this.ChallanDate)),
    //         F_Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    //         F_Godown_ID: this.Objdispatch.From_Godown_ID,
    //         To_Cost_Cen_ID: this.Objdispatch.Cost_Cen_ID,
    //         To_Godown_ID: this.Objdispatch.To_Godown_ID,
    //         Product_ID: el.product_id,
    //         Batch_No: el.Batch_No,
    //         Qty: el.Delivery_Qty,
    //         Rate: 0,
    //         UOM: el.UOM,
    //         User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
    //         REMARKS: this.Objdispatch.REMARKS ? this.Objdispatch.REMARKS : "NA",
    //         Fin_Year_ID: this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
    //         Vehicle_Details : this.Objdispatch.Vehicle_Details,
    //         Adv_Order_No : "NA",
    //         Indent_Date : this.DateService.dateConvert(new Date(this.todayDate)),
    //         Accept_Reason_ID : el.Accepted_Qty === el.Delivery_Qty ? 0 : el.Accept_Reason_ID,
    //         Accept_Reason : el.Accepted_Qty === el.Delivery_Qty ? 'NA' : el.Accept_Reason,
    //         Status : "Updated",
    //         Material_Type : "Finished",
    //         Total_Qty : Number(this.totaldelqty),
    //         Total_Accepted_Qty : Number(this.totalaccpqty)
    //       }
    //       this.saveData.push(saveObj)
    //     }
    //   })
    //   console.log("this.saveData",this.saveData);
    //   this.ngxService.start();
    //   this.displaysavepopup = false;
    //  const obj = {
    //   "SP_String": "SP_Production_Voucher",
    //   "Report_Name_String": "Add K4C Txn Distribution",
    //   "Json_Param_String": JSON.stringify(this.saveData),
    //   "Json_1_String" : this.getReqNo()
    // }
    // this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //   var tempID = data[0].Column1;
    //   this.editdocno = data[0].Column1;
    //   if(data[0].Column1){
    //     if(this.FranchiseBill != "N" && Number(this.totaldelqty) == Number(this.totalaccpqty)) {
    //      // console.log("franchise ==", true)
    //       this.SaveFranchisechallan();
    //     }
    //     this.clearData();
    //     this.inputBoxDisabled = false;
    //     this.indentdateDisabled = true;
    //     this.From_Godown_ID_Dis = false;
    //     this.To_Godown_ID_Dis = false;
    //     this.ngxService.stop();
    //    this.compacctToast.clear();
    //    this.compacctToast.add({
    //     key: "compacct-toast",
    //     severity: "success",
    //     summary: "Distribution Challan No. " + tempID,
    //     detail: "Distribution Challan Update Succesfully"
    //   });

    //   this.tabIndexToView = 0;
    //   this.items = ["BROWSE", "CREATE"];
    //   this.buttonname = "Create";
    //  // this.clearData()
    //   this.todayDate = new Date();
    //   //this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
    //   this.ObjBrowseData.Cost_Cen_ID = this.Objdispatch.Cost_Cen_ID;
    //   this.ObjBrowseData.Brand_ID = this.Objdispatch.Brand_ID;
    //   this.searchData(true);
    //   this.displaysavepopup = false;
    //   this.SelectedIndent = [];
    //   this.IndentFilter = [];

    //   //
    //   this.Objdispatch = new dispatch();
    //   this.productDetails = [];
    //   this.BackUpproductDetails = [];
    //   this.clearData();
    //   this.todayDate = new Date();
    //  // this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
    //  }else{
    //   this.ngxService.stop();
    //   this.compacctToast.clear();
    //       this.compacctToast.add({
    //         key: "compacct-toast",
    //         severity: "error",
    //         summary: "Warn Message",
    //         detail: "Something Wrong"
    //       });
    // }
    //  })
    // }

    // else{
       console.log("create");
      this.saveData = [];
      this.Objdispatch.Doc_Date = this.DateService.dateConvert(new Date(this.ChallanDate));
      this.Objdispatch.Req_Date = this.DateService.dateConvert(new Date(this.ReqDate));
      this.Objdispatch.Created_By = this.$CompacctAPI.CompacctCookies.User_ID;
      this.BackUpproductDetails.forEach(el=>{
        if(el.Delivery_Qty){      //&& Number(el.Delivery_Qty) !== 0
          const saveObj = {
            Doc_No: "A",
            // Accepted_Qty : this.Auto_Accepted == "N" ? 0 : el.Delivery_Qty,
            // Doc_Date: this.DateService.dateTimeConvert(new Date(this.ChallanDate)),
            // F_Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
            // F_Godown_ID: this.Objdispatch.From_Godown_ID,
            // To_Cost_Cen_ID: this.Objdispatch.Cost_Cen_ID,
            // To_Godown_ID: this.Objdispatch.To_Godown_ID,
            Product_ID: el.product_id,
            Batch_No: el.Batch_No,
            Req_Qty: el.Req_Qty,
            Qty: el.Delivery_Qty,
            Accepted_Qty: el.Delivery_Qty,
            // Rate: 0,
            UOM: el.UOM,
            // User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
            // REMARKS: this.Objdispatch.REMARKS ? this.Objdispatch.REMARKS : "NA",
            // Fin_Year_ID: this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
            // Vehicle_Details : this.Objdispatch.Vehicle_Details,
            // Adv_Order_No : "NA",
            // Indent_Date : this.DateService.dateConvert(new Date(this.todayDate)),
            // Accept_Reason_ID : null,
            // Accept_Reason : null,
            // Status : this.Auto_Accepted == "Y" ? "Updated" : "Not Updated",
            // Material_Type : "Finished",
            // Total_Qty : Number(this.totaldelqty),
            // Total_Accepted_Qty  : this.Auto_Accepted == "N" ? 0 : Number(this.totaldelqty)
          }
          this.saveData.push({...saveObj,...this.Objdispatch})
        }
      })
      console.log("this.saveData",this.saveData);
      this.ngxService.start();
      this.displaysavepopup = false;
     const obj = {
      "SP_String": "SP_MICL_Dispatch_Challan",
      "Report_Name_String": "Create_MICL_Dispatch_Challan",
      "Json_Param_String": JSON.stringify(this.saveData),
      "Json_1_String" : JSON.stringify([{Req_No : this.SelectedIndent}]) //this.getReqNo()
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      var tempID = data[0].Column1;
      this.dispatchchallanno = data[0].Column1;
      if(data[0].Column1){
        this.ngxService.stop();
       this.compacctToast.clear();
       this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Distribution Challan No. " + tempID,
        detail: "Distribution Challan Entry Succesfully"
      });

      // this.tabIndexToView = 0;
      // this.items = ["BROWSE", "CREATE"];
      // this.buttonname = "Create";
      this.clearData();
      this.tabIndexToView = 0;
      this.PrintDispatch(data[0].Column1);
      this.inputBoxDisabled = false;
      this.createchallandisabled = false;
      this.indentlistdisabled = false;
      this.indentdateDisabled = true;
      this.docdateDisabled = true;
      this.From_Godown_ID_Dis = false;
      this.To_Godown_ID_Dis = false;
      this.ReqDate = new Date();
      this.ChallanDate = new Date();
      // this.ObjBrowseData.Cost_Cen_ID = this.Objdispatch.Cost_Cen_ID;
      // this.ObjBrowseData.Brand_ID = this.Objdispatch.Brand_ID;
      this.searchData(true);
      this.displaysavepopup = false;
      this.SelectedIndent = undefined;
      this.IndentFilter = [];
      this.GetPendingIndent(true);

      //
      
     this.Objdispatch = new dispatch();
     this.productDetails = [];
     this.BackUpproductDetails = [];
    //  this.clearData();
    //  this.ReqDate = new Date();
    //  this.ChallanDate = this.DateService.dateConvert(new Date(this.challanDate));
     }else{
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

    // }
  }
  else{
    this.ngxService.stop();
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Something Wrong"
        });
  }

 }
  
 getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseData.From_Date = dateRangeObj[0];
      this.ObjBrowseData.To_Date = dateRangeObj[1];
    }
  }
  GetBrowseCostcenter(){
    const obj = {
      "SP_String": "SP_MICL_Dispatch_Challan",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("costcenterList  ===",data);
      this.BrowseCostCenterList = data;
      // this.ObjBrowseData.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      // if(this.Objdispatch.F_Cost_Cen_ID){
      //   this.toutLetDis = true;
      // }
       this.GetBrowseGodown();
      })
  }
  GetBrowseGodown(){
    this.BrowseGodownList = [];
    // this.toutLetDis = true;
    // console.log(this.Objdispatch.Cost_Cen_ID)
    const obj = {
      "SP_String": "SP_MICL_Dispatch_Challan",
      "Report_Name_String": "Get_Cost_Center_Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.ObjBrowseData.Cost_Cen_ID}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrowseGodownList = data;
      console.log("this.BrowseGodownList",this.BrowseGodownList);
      this.ObjBrowseData.Godown_ID= this.BrowseGodownList.length ? this.BrowseGodownList[0].Godown_ID : undefined;
      // if(this.Objdispatch.F_Godown_ID){
      //   this.To_Godown_ID_Dis = true;
      // }
    })
  }
 searchData(valid){
    this.DispatchSearchFormSubmit = true;
    if(valid){
      console.log("this.ObjBrowseData.Cost_Cen_ID",this.ObjBrowseData.Cost_Cen_ID);
      const start = this.ObjBrowseData.From_Date
          ? this.DateService.dateConvert(new Date(this.ObjBrowseData.From_Date))
          : this.DateService.dateConvert(new Date());
        const end = this.ObjBrowseData.To_Date
          ? this.DateService.dateConvert(new Date(this.ObjBrowseData.To_Date))
          : this.DateService.dateConvert(new Date());
        const tempDate = {
          From_Date :start,
          To_Date :end,
          Cost_Cen_ID :this.ObjBrowseData.Cost_Cen_ID ? this.ObjBrowseData.Cost_Cen_ID : 0,
          //Cost_Cen_ID :30
          Godown_ID : this.ObjBrowseData.Godown_ID ? this.ObjBrowseData.Godown_ID : 0
        }
  
       const obj = {
        "SP_String": "SP_MICL_Dispatch_Challan",
        "Report_Name_String": "Browse_MICL_Dispatch_Challan",
        "Json_Param_String": JSON.stringify([tempDate])
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.GetAllDataList = data;
        console.log("this.GetAllDataList",this.GetAllDataList);
        // this.clearData();
        // this.todayDate = new Date();
        // this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
       // this.Objdispatch.From_Godown_ID = this.FromGodownList.length === 1 ? this.FromGodownList[0].From_Godown_ID : undefined;
      })
    }
  
  }
  getTotalValue(key){
    let Amtval = 0;
    this.GetAllDataList.forEach((item)=>{
      Amtval += Number(item[key]);
    });
  
    return Amtval ? Amtval.toFixed(2) : '-';
  }
  PrintDispatch(DocNo) {
    if(DocNo) {
    const objtemp = {
      "SP_String": "SP_MICL_Dispatch_Challan",
      "Report_Name_String": "Dispatch_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var GRNprintlink = data[0].Column1;
      window.open(GRNprintlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
  }
deleteDispatch(data){
 console.log("deleteCol",data)
 this.doc_no = undefined;
 if (data.Doc_No) {
  this.doc_no = data.Doc_No;
  this.createdby = data.Created_By;
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
onConfirm(){
  if(this.doc_no){
    const TempObj = {
      Doc_No : this.doc_no,
      Created_By : this.createdby
      // User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
      // Doc_Date : this.doc_date
    }
    const obj = {
      "SP_String": "SP_MICL_Dispatch_Challan",
      "Report_Name_String": "Delete_Dispatch_Challan",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("del Data===", data[0].Column1)
       if (data[0].Column1 === "Done"){
         this.onReject();
         this.searchData(true);
         this.compacctToast.clear();
         this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Doc No.: " + this.doc_no.toString(),
           detail: "Succesfully Deleted"
         });
         this.clearData();
         this.ReqDate = new Date();
         this.ChallanDate = new Date();;
       }
     })
  }
}
onReject(){
  this.compacctToast.clear("c");
}

// PENDING INDENT
getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjPendingIndent.start_date = dateRangeObj[0];
    this.ObjPendingIndent.end_date = dateRangeObj[1];
  }
}
getCostcenter(){
  const obj = {
     "SP_String": "SP_Txn_Requisition",
     "Report_Name_String": "Get_Cost_Center",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("costcenterList  ===",data);
    this.costcenterListPeding = data;
    this.ObjPendingIndent.Cost_Cen_ID = this.costcenterListPeding.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
  })
 }
GetPendingIndent(valid){
    this.PendingIndentFormSubmitted = true;
    const start = this.ObjPendingIndent.start_date
    ? this.DateService.dateConvert(new Date(this.ObjPendingIndent.start_date))
    : this.DateService.dateConvert(new Date());
    const end = this.ObjPendingIndent.end_date
    ? this.DateService.dateConvert(new Date(this.ObjPendingIndent.end_date))
    : this.DateService.dateConvert(new Date());
    const tempobj = {
     From_Date : start,
     To_Date : end,
     To_Cost_Cen_ID : this.ObjPendingIndent.Cost_Cen_ID,
     proj : "N"
    }
    if (valid) {
    const obj = {
      "SP_String": "SP_MICL_Dispatch_Challan",
      "Report_Name_String": "Browse_Pending_Requisition",
      "Json_Param_String": JSON.stringify([tempobj])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.PendingIndentList = data;
      // this.BackupSearchedlist = data;
      // this.GetDistinct();
      if(this.PendingIndentList.length){
        this.DynamicHeaderforPIndent = Object.keys(data[0]);
      }
      else {
        this.DynamicHeaderforPIndent = [];
      }
      this.seachSpinner = false;
      this.PendingIndentFormSubmitted = false;
      console.log("DynamicHeaderforPIndent",this.DynamicHeaderforPIndent);
    })
    }
}
PrintIndent(DocNo) {
  if(DocNo) {
  const objtemp = {
    "SP_String": "SP_Txn_Requisition",
    "Report_Name_String": "Requisition_Print"
    }
  this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
    var printlink = data[0].Column1;
    window.open(printlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  })
  }
}
// CreateChallan(obj){
//   this.clearData();
//   this.IndentNoList = [];
//   this.SelectedIndent = undefined;
//   this.inputBoxDisabled = false;
//   this.ReqDate = new Date();
//   if(obj.Req_No) {
//     // this.IndentFilter.push({ label: obj.Req_No , value: obj.Req_No });
//     // this.SelectedIndent.push(obj.Req_No);
//     this.tabIndexToView = 1;
//     this.inputBoxDisabled = false;
//     this.createchallandisabled = true;
//     this.indentlistdisabled = true;
//     this.indentdateDisabled = false;
//     this.createChallanflag = false;
//     this.Objdispatch.F_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
//     this.GetFromGodown();
//     var tocostcent = this.ToCostCenterList.filter(el=> el.Cost_Cen_Name === obj.Cost_Cen_Name)
//     this.Objdispatch.To_Cost_Cen_ID = tocostcent[0].Cost_Cen_ID;
//     this.GetToGodown();
//     var togodown = this.ToGodownList.filter(el=> el.godown_name === obj.Stock_Point)
//     this.Objdispatch.To_Godown_ID = togodown[0].Godown_ID;
//     // console.log("togodown==",this.Objdispatch.To_Godown_ID)
//     this.ReqDate = new Date(obj.Req_Date);
//     // console.log("ReqDate==",this.ReqDate)
//     this.GetIndentList(true);
//     this.SelectedIndent = obj.Req_No;
//     // console.log("obj.Req_No==",this.SelectedIndent)
//     this.GetshowProduct();
//     // this.SelectedIndent = obj.Req_No;
//           // obj.Req_No.forEach(ele => {
//             // this.IndentFilter.push({ label: obj.Req_No , value: obj.Req_No });
//             // this.BackupIndentList = [...this.IndentNoList];
//             // });
//           // this.SelectedIndent = obj.Req_No;
//   }
// }
CreateChallan(row){
  this.clearData();
  // this.IndentNoList = [];
  // this.SelectedIndent = undefined;
  this.inputBoxDisabled = false;
  this.ReqDate = new Date();
  if(row.Req_No) {
    this.tabIndexToView = 1;
    this.inputBoxDisabled = false;
    this.createchallandisabled = true;
    this.indentlistdisabled = true;
    this.indentdateDisabled = false;
    this.createChallanflag = false;
    this.dataforcreateChallan(row.Req_No);
  }
      
}
dataforcreateChallan(Doc_No){
  const obj = {
    "SP_String": "SP_MICL_Dispatch_Challan",
    "Report_Name_String": "Get_Issue_Requisition_Details",
    "Json_Param_String": JSON.stringify([{Doc_No:Doc_No}])
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.creteChallanList = data;
    this.Objdispatch.F_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.GetFromGodown();
    this.Objdispatch.To_Cost_Cen_ID = data[0].Cost_Cen_ID;
    this.GetToGodown();
    this.Objdispatch.To_Godown_ID = data[0].Godown_ID;
    // console.log("togodown==",this.Objdispatch.To_Godown_ID)
    this.ReqDate = new Date(data[0].Req_Date);
    // console.log("ReqDate==",this.ReqDate)
    this.GetIndentList(true);
    this.SelectedIndent = data[0].Req_No;
    // console.log("obj.Req_No==",this.SelectedIndent)
    this.GetshowProduct();
  })
}
}

class dispatch{
  Doc_Date : any;
  Req_Date : any;
  Req_No : any;
  F_Cost_Cen_ID : any;
  F_Godown_ID : any;
  To_Cost_Cen_ID : any;
  To_Godown_ID : any;
  Status : any;
  // Created_On : any;
  Created_By : any;
  Vehicle_Details : any;
  Remarks : any ;
  // Fin_Year_ID : number;
  // USER_ID : any;
}
class BrowseData {
  From_Date: string;
  To_Date: string;
  Cost_Cen_ID : any;
  Godown_ID : any;
  }
  class PendingIndent{
    Company_ID : any;
    start_date : Date;
    end_date : Date;
    Cost_Cen_ID : any;
  }
