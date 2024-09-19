import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import * as XLSX from 'xlsx';
import { NgxUiLoaderService } from "ngx-ui-loader";


@Component({
  selector: 'app-k4-c-dispatch-outlet-adv-order',
  templateUrl: './k4-c-dispatch-outlet-adv-order.component.html',
  styleUrls: ['./k4-c-dispatch-outlet-adv-order.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4CDispatchOutletAdvOrderComponent implements OnInit {
  items:any = [];
  menuList:any = [];
  tabIndexToView = 0;
  brandInput = false ;
  buttonname = "Create";
  myDate : Date;
  ChallanDate : any = Date ;
  brandList:any = [];
  toGodownList:any = [];
  costcenterList:any = [];
  VehicleList:any = [];
  itemList:any =[];
  NativeitemList:any = [];
  FromGodownList:any = [];
  productDetails:any = [];
  saveList:any = [];
  saveData:any = [];
  outletListBro:any = [];
  GetAllDataList:any = [];
  OutletFilter:any = [];
  BackUPGetAllDataList:any = [];
  SelectedOutLet :any;
  OutletFormSubmit = false;
  outLetDis = false;
  Spinner = false;
  seachSpinner = false;
  flag = false;
  inputBoxDisabled = false;
  indentdateDisabled = true;
  inputDate = true;
  To_Godown_ID_Dis = false;
  Stock_Point = false;
  Delivery_Date = new Date();
  ObjadvDispat : advDispat = new advDispat ()
  ObjBrowseData : BrowseData = new BrowseData ()
  doc_no: any;
  doc_date: any;
  Auto_Accepted: any;

  dispatchchallanno : any;
  FranchiseProductList:any = [];
  FranchiseList:any = [];
  taxable: any;
  cgst: any;
  sgst: any;
  igst: any;
  grossamount: any;
  netamount: any;
  Round_Off: any;
  currentDate: any = new Date();
  ToCostId = undefined;
  ToGodownId = undefined;
  subledgerid:any;
  franchisecostcenid:any;

  totalaccpqty: any;
  totaldelqty: any;
  Franchise:any = [];
  FranchiseBill:any;
  ToCostCentId = undefined;

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
  salebillno: any;

  ViewPoppup = false;
  viewList:any = [];
  view_Doc_No = undefined;
  view_Doc_date = undefined;
  view_Order_No = undefined;
  viewbuttondisabled = false;
  flagbox = false;

  Cancle_Remarks : string;
  remarksFormSubmitted = false;
  advordernumber: any;
  viewgenerateList: any=[];
  lockdate:any;
  loading:boolean = false;

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
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Custom Order Distribution",
      Link: "Material Management -> Outward -> Custom Order Distribution"
    });
    this.getLockDate();
    this.GetDate();
    this.getBrand();
    this.GetVehicle();
    this.GetFromGodown();
    this.GetFranchiseList();

  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.brandInput = false ;
    this.buttonname = "Save";
    this.clearData();
    this.ObjadvDispat= new advDispat();
    this.productDetails = [];
    this.inputBoxDisabled = false;
    this.indentdateDisabled = true;
    this.Stock_Point = false;
    this.To_Godown_ID_Dis = false;
    this.inputDate = true;
    this.Delivery_Date = new Date();
    this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
    this.viewgenerateList = [];
  }
  clearData(){
    //this.ObjadvDispat= new advDispat();
    this.OutletFormSubmit = false;
    this.flag = false;
    this.ngxService.stop();
    this.viewgenerateList = [];
    this.loading = false;
   }
  GetDate(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get Date For Dispatch to outlet",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("OutletNameList  ===",data);

      //this.ObjRequistion.Req_Date = new Date(data[0].Requisition_Date);
      this.myDate =  new Date(data[0].Bill_Date);
      this.ChallanDate = new Date(data[0].Bill_Date);
      // on save use this
      //this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));??
      console.log("dateList  ===",this.myDate);
    })
  }
  getLockDate(){
    const obj = {
     "SP_String": "sp_Comm_Controller",
     "Report_Name_String": "Get_LockDate"
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // console.log('LockDate===',data);
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
  getBrand(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Brand INI",

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("brandList  ===",data);
      this.brandList = data;
    })
  }
  Getgodown(){
     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Godown For Sale Bill",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.ObjadvDispat.Cost_Cen_ID}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.toGodownList = data;
      console.log("this.toGodownList",this.toGodownList);
      this.ObjadvDispat.To_Godown_ID = this.toGodownList.length === 1 ? this.toGodownList[0].godown_id : undefined;
      if(this.ObjadvDispat.To_Godown_ID){
        this.To_Godown_ID_Dis = true;
      }
      this.autoacceptedChange();
      this.autoaFranchiseBill();
      this.getsubledgerid();
    })
  }
  getCostcenter(){
     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Outlet For Distribution",
      "Json_Param_String": JSON.stringify([{Brand_ID : this.ObjadvDispat.Brand_ID}])
     // "Json_Param_String": JSON.stringify([{User_ID : 61}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("costcenterList  ===",data);
      this.costcenterList = data;
      if(this.costcenterList.length){
        this.Getgodown()
      }


    })
  }
  // FRANCISE BILL
  autoaFranchiseBill() {
    //this.ExpiredProductFLag = false;
   if(this.ObjadvDispat.Cost_Cen_ID) {
     const ctrl = this;
     const autofrnchiseObj = $.grep(ctrl.costcenterList,function(item: any) {return item.Cost_Cen_ID == ctrl.ObjadvDispat.Cost_Cen_ID})[0];
     console.log(autofrnchiseObj);
     this.FranchiseBill = autofrnchiseObj.Franchise;
     console.log("this.FranchiseBill ==", this.FranchiseBill)
     
    }
    }
  GetVehicle(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Vehicle Details",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.VehicleList = data;
      console.log("this.VehicleList",this.VehicleList);
    })
  }
  getAllitem(){
    this.NativeitemList = [];
    this.itemList = [];
    const TempObj ={
      Cost_Cen_ID : this.ObjadvDispat.Cost_Cen_ID,
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - All Product for Distribution",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.NativeitemList = data;
     console.log("this.NativeitemList",this.NativeitemList);
      this.NativeitemList.forEach(el => {
        this.itemList.push({
          label: el.Product_Description,
          value: el.Product_ID
        });
      });


    })
  }
  GetFromGodown(){
    console.log(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Godown For Sale Bill",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.FromGodownList = data;
      console.log("this.FromGodownList",this.FromGodownList);
      this.ObjadvDispat.From_Godown_ID = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
     if(this.ObjadvDispat.From_Godown_ID){
      this.Stock_Point = true;
    }
     })

  }
  addadvDispatch(valid){
     this.OutletFormSubmit = true;
     this.loading = true;
     if(valid){
       const tempObj = {
        Cost_Cen_ID : this.ObjadvDispat.Cost_Cen_ID,
        Delivery_Date : this.DateService.dateConvert(new Date (this.Delivery_Date))
       }
       const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "GET_Production_Pending_Orders",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.productDetails = data;
        this.inputBoxDisabled = true;
        this.indentdateDisabled = false;
        this.Stock_Point = true;
        this.To_Godown_ID_Dis = true;
        this.inputDate = false;
        console.log("this.productDetails",this.productDetails);
        this.productDetails.forEach(ele=>{
          ele['Delivery_Qty'] = ele.Qty;
          ele['Doc_No'] = "A";
          ele['Product_ID'] = ele.Product_ID;
          ele['Doc_Date'] = this.DateService.dateConvert(new Date(this.ChallanDate));
          ele['F_Cost_Cen_ID'] = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
         ele['To_Cost_Cen_ID'] = this.ObjadvDispat.Cost_Cen_ID;
         ele['Product_Description'] = ele.Product_Description;
         ele['F_Godown_ID'] = this.ObjadvDispat.From_Godown_ID;
         ele['To_Godown_ID'] = this.ObjadvDispat.To_Godown_ID;
         ele['Batch_NO'] = ele.Batch_NO;
         ele['Req_Qty'] = ele.Delivery_Qty;
         ele['Rate'] = ele.Sale_rate;
         ele['User_ID'] = this.$CompacctAPI.CompacctCookies.User_ID;
         ele['From_Godown_ID'] = this.ObjadvDispat.From_Godown_ID;
         ele['REMARKS'] = this.ObjadvDispat.REMARKS ? this.ObjadvDispat.REMARKS : "NA";
         ele['UOM'] = ele.UOM;
         ele['Fin_Year_ID'] = this.$CompacctAPI.CompacctCookies.Fin_Year_ID;
         ele['Vehicle_Details'] = this.ObjadvDispat.Vehicle_Details;
         ele['Adv_Order_No'] = ele.Adv_Order_No;
        })

        this.clearData();
        this.loading = false;
      })
     }
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseData.From_Date = dateRangeObj[0];
      this.ObjBrowseData.To_Date = dateRangeObj[1];
    }
  }
  autoacceptedChange() {
    //this.ExpiredProductFLag = false;
   if(this.ObjadvDispat.Cost_Cen_ID) {
     const ctrl = this;
     const autoacceptedObj = $.grep(ctrl.costcenterList,function(item: any) {return item.Cost_Cen_ID == ctrl.ObjadvDispat.Cost_Cen_ID})[0];
     console.log(autoacceptedObj);
     this.Auto_Accepted = autoacceptedObj.Auto_Accepted;
     
    }
    }
  // getTotalIssueValue(){
  //     let issueval = 0;
  //     let acceptedval = 0;
  //     this.productDetails.forEach((item)=>{
  //       issueval += Number(item.Delivery_Qty)
  //       acceptedval += Number(item.Delivery_Qty)
  //     });
  //     this.totaldelqty = (issueval).toFixed(2);
  //     this.totalaccpqty = (acceptedval).toFixed(2);
  //   //  return issueval ? issueval.toFixed(2) : '-';
  // }
  saveAdv(){
    console.log(this.saveqty());
    console.log(this.productDetails.length && this.saveqty());
    if(this.checkLockDate(this.DateService.dateConvert(new Date(this.ChallanDate)))) {
    if(this.productDetails.length && this.saveqty()){
      this.ngxService.start();
          this.saveData = [];
             this.productDetails.forEach(el=>{
               if(Number(el.Delivery_Qty) && Number(el.Delivery_Qty) !== 0 ){
                 if(el.Franchise === 'Y') {//(Number(el.Box_Charge) || Number(el.Box_Charge) === 0)) {
                this.flagbox = false;
                   if(el.Box_Charge) {
               const saveObj = {
                 Doc_No: "A",
                 Doc_Date: el.Doc_Date,
                 F_Cost_Cen_ID: el.F_Cost_Cen_ID,
                 F_Godown_ID: el.F_Godown_ID,
                 To_Cost_Cen_ID: el.To_Cost_Cen_ID,
                 To_Godown_ID: el.To_Godown_ID,
                 Batch_No : el.Batch_NO,
                 Product_ID: el.Product_ID,
                 Qty: el.Delivery_Qty,
                 Accepted_Qty : el.Delivery_Qty,
                 Rate: 0,
                 UOM: el.UOM,
                 User_ID: el.User_ID,
                 REMARKS: el.REMARKS,
                 Fin_Year_ID: el.Fin_Year_ID,
                 Vehicle_Details : el.Vehicle_Details,
                 Adv_Order_No : el.Adv_Order_No,
                 Status : this.Auto_Accepted == "Y" ? "Updated" : "Not Updated",
                 Box_Charge : el.Box_Charge, //? el.Box_Charge : 0,
                 Box_Charge_Remarks : el.Box_Charge_Remarks,
                 Order_Cost_Centre_ID : el.Order_Cost_Centre_ID
               }
               this.saveData.push(saveObj)
              }
              else {
                  this.flagbox = true;
                   }
                  }
                   else {
                    const saveObj = {
                      Doc_No: "A",
                      Doc_Date: el.Doc_Date,
                      F_Cost_Cen_ID: el.F_Cost_Cen_ID,
                      F_Godown_ID: el.F_Godown_ID,
                      To_Cost_Cen_ID: el.To_Cost_Cen_ID,
                      To_Godown_ID: el.To_Godown_ID,
                      Batch_No : el.Batch_NO,
                      Product_ID: el.Product_ID,
                      Qty: el.Delivery_Qty,
                      Accepted_Qty : el.Delivery_Qty,
                      Rate: 0,
                      UOM: el.UOM,
                      User_ID: el.User_ID,
                      REMARKS: el.REMARKS,
                      Fin_Year_ID: el.Fin_Year_ID,
                      Vehicle_Details : el.Vehicle_Details,
                      Adv_Order_No : el.Adv_Order_No,
                      Status : this.Auto_Accepted == "Y" ? "Updated" : "Not Updated",
                      Box_Charge : el.Box_Charge ? el.Box_Charge : 0,
                      Box_Charge_Remarks : el.Box_Charge_Remarks,
                      Order_Cost_Centre_ID : el.Order_Cost_Centre_ID
                    }
                    this.saveData.push(saveObj)
                   }
                   }
            })
             if(this.saveData.length){
              const obj = {
                "SP_String": "SP_Production_Voucher",
                 "Report_Name_String": "Add K4C Txn Distribution For Custom Order",
                 "Json_Param_String": JSON.stringify(this.saveData)
               }
               this.GlobalAPI.getData(obj).subscribe((data:any)=>{
                this.dispatchchallanno = data[0].Column1;
                 var tempID = data[0].Column1;
                 if(data[0].Column1){
                  if(this.FranchiseBill != "N") {
                    this.SaveFranchisechallan();
                  }
                  this.ngxService.stop();
                   this.compacctToast.clear();
                 this.compacctToast.add({
                 key: "compacct-toast",
                 severity: "success",
                 summary: "Distribution Challan No. " + tempID,
                 detail: "Distribution Challan Entry Succesfully"
               });
               this.productDetails = [];
               this.tabIndexToView = 0;
               this.items = ["BROWSE", "CREATE"];
               this.buttonname = "Create";
               this.clearData();
               this.searchData();
              // this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
                 } else{
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
    else {
      this.ngxService.stop();
    }
    }
// saveboxcharge(){
  // this.flagbox = false;
  // for(let i = 0; i < this.productDetails.length ; i++){
  //  if(!this.productDetails[i].Delivery_Qty && this.productDetails[i].Franchise === "N" && !this.productDetails[i].Box_Charge) {
  //   this.flagbox = false;
  //       return true;
  //     }
  //     else {
  //       this.flagbox = true;
  //       this.compacctToast.clear();
  //            this.compacctToast.add({
  //                key: "compacct-toast",
  //                severity: "error",
  //                summary: "Warn Message",
  //                detail: "Box Charge is null "
  //              });

  //            }
  // }
//    this.flagbox = true;
//  for(let i = 0; i < this.productDetails.length ; i++){
//   if(this.productDetails[i].Franchise === "N") {
//     this.flagbox = false;
//     break;
//   }
//  }
//  console.log('this.flagbox',this.flagbox)
//  return this.flagbox;

//  this.flagbox = false;
//     console.log("col",col);
//     if(col.Franchise === "N"){
//         this.flagbox = false;
//         return true;
//       }
//       else {
//         this.flagbox = true;
//         this.compacctToast.clear();
//              this.compacctToast.add({
//                  key: "compacct-toast",
//                  severity: "error",
//                  summary: "Warn Message",
//                  detail: "Box Charge is null "
//                });

//              }
//     }
// }
  qtyChq(col){
    this.flag = false;
    console.log("col",col);
    if(col.Delivery_Qty){
      if(col.Delivery_Qty <=  col.Qty){
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



  }
  saveqty(){
    let flag = true;
   for(let i = 0; i < this.productDetails.length ; i++){
    if(Number(this.productDetails[i].Qty) <  Number(this.productDetails[i].Delivery_Qty)){
      flag = false;
      break;
    }
   }
   return flag;
  }

  // SAVE FRANCHISE
 SaveFranchisechallan(){
  // if (this.dispatchchallanno){
   const Obj = {
     Doc_No : this.dispatchchallanno,
     Cost_Cen_ID : this.ObjadvDispat.Cost_Cen_ID,
     From_Date : this.DateService.dateConvert(new Date(this.ChallanDate)),
     To_Date :  this.DateService.dateConvert(new Date(this.ChallanDate))
   }
      const obj = {
        "SP_String": "SP_K4C_Accounting_Journal",
        "Report_Name_String" : "Get Franchise Bill Ageinst Custom Order Challan",
        "Json_Param_String": JSON.stringify([Obj])
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
       this.FranchiseProductList = data;
       console.log("this.FranchiseProductList======",this.FranchiseProductList);
       if (this.FranchiseProductList.length) {
          this.calculateTotalAmt();
          this.SaveFranSaleBill();
       } else {
         this.searchData();
       }
      })
    
   //  }
   }
   GetFranchiseList(){
     // const tempObj = {
     //   Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
     //   //Material_Type : this.MaterialType_Flag
     // }
     const obj = {
       "SP_String": "SP_Franchise_Sale_Bill",
       "Report_Name_String": "Get Franchise",
       //"Json_Param_String": JSON.stringify([tempObj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.FranchiseList = data;
       console.log("this.FranchiseList ===", this.FranchiseList)
       // this.FranchiseList.forEach(item => {
       //   item.Cost_Cen_ID = this.ObjfranchiseSalebill.Cost_Cen_ID
       // });
      })
   }
   getsubledgerid(){
     //this.ExpiredProductFLag = false;
    if(this.ObjadvDispat.Cost_Cen_ID) {
     const ctrl = this;
     const subledgeridObj = $.grep(ctrl.FranchiseList,function(item: any) {return item.Cost_Cen_ID == ctrl.ObjadvDispat.Cost_Cen_ID})[0];
     console.log(subledgeridObj);
     this.subledgerid = subledgeridObj.Sub_Ledger_ID;
     this.franchisecostcenid = subledgeridObj.Cost_Cen_ID;
     console.log("this.subledgerid ==", this.subledgerid)
     
    }
   }
   calculateTotalAmt(){
     this.taxable = undefined;
     this.cgst = undefined;
     this.sgst = undefined;
     this.igst = undefined;
     this.grossamount = undefined;
     let totaltax = 0; 
     let totalcgst = 0;
     let totalsgst = 0;
     let totaligst = 0;
     let grossamt = 0;
     this.FranchiseProductList.forEach(item => {
       totaltax = totaltax + Number(item.Taxable);
       totalcgst = totalcgst + Number(item.CGST_AMT);
       totalsgst = totalsgst + Number(item.SGST_AMT);
       totaligst = totaligst + Number(item.IGST_AMT);
       grossamt = grossamt + Number(item.Net_Amount);
     });
     this.taxable = (totaltax).toFixed(2);
     this.cgst = (totalcgst).toFixed(2);
     this.sgst = (totalsgst).toFixed(2);
     this.igst = (totaligst).toFixed(2);
     this.grossamount = (grossamt).toFixed(2);
     // Round Off
     this.Round_Off = (Number(this.grossamount) - Math.round(this.grossamount)).toFixed(2);
     this.netamount = Math.round(this.grossamount);
     //console.log(this.Net_Amount);
   }
  getdataforSaveFranchise(){
     this.currentDate = this.DateService.dateConvert(new Date(this.currentDate));
     if(this.FranchiseProductList.length) {
       let tempArr =[]
       this.FranchiseProductList.forEach(item => {
        if (Number(item.Taxable) && Number(item.Taxable) != 0) {
      const TempObj = {
             Doc_No:  "A",
             //Doc_Date: this.currentDate,
             Doc_Date: this.DateService.dateConvert(new Date(this.ChallanDate)),
             Sub_Ledger_ID : Number(this.subledgerid),
             Cost_Cen_ID	: 2,
             Product_ID	: item.Product_ID,
             Product_Name	: item.Product_Description,
             Qty	: item.Qty,
             UOM	: item.UOM,
             MRP : item.Sale_rate,
             Rate : item.Sale_rate,
             Amount : Number(item.Qty) * Number(item.Sale_rate),
             Discount : 0,
             Taxable_Amount : item.Taxable,
             CAT_ID : item.Cat_ID,
             CGST_OUTPUT_LEDGER_ID : item.CGST_Output_Ledger_ID,
             CGST_Rate : item.CGST_PER,
             CGST_Amount : item.CGST_AMT,
             SGST_OUTPUT_LEDGER_ID : item.SGST_Output_Ledger_ID,
             SGST_Rate : item.SGST_PER,
             SGST_Amount : item.SGST_AMT,
             IGST_OUTPUT_LEDGER_ID : item.IGST_Output_Ledger_ID,
             IGST_Rate : item.IGST_PER,
             IGST_Amount : item.IGST_AMT,
             Bill_Gross_Amt : Number(this.taxable),
             Rounded_Off : Number(this.Round_Off),
             Bill_Net_Amt : this.netamount,
             User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
             Remarks : 'NA',
             Fin_Year_ID : Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID),
             Total_Taxable : Number(this.taxable),
             Total_CGST_Amt : Number(this.cgst),
             Total_SGST_Amt : Number(this.sgst),
             Total_IGST_Amt : Number(this.igst),
             Total_Net_Amt : this.netamount,
             HSL_No : item.HSN_NO,
             Net_Amount : item.Net_Amount,
             Order_Cost_Centre_ID : item.Order_Cost_Centre_ID,
             Adv_Order_No : item.Adv_Order_No
          }
       tempArr.push(TempObj)
        } else {
          setTimeout(()=>{
          this.Spinner = false;
          this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
           key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error in Taxable amount"
        });
        },600)
      }
       });
       console.log("Save Data ===", tempArr)
       return JSON.stringify(tempArr);
 
     }
   }
   SaveFranSaleBill(){
     const obj = {
       "SP_String" : "[SP_K4C_Accounting_Journal_M_O]",
       "Report_Name_String" : "Save_Franchise_Sale_Bill_Against_Adv_Order",
       "Json_Param_String" : this.getdataforSaveFranchise(),
       "Json_1_String" : JSON.stringify([{Order_No : this.dispatchchallanno}])
 
     }
     this.GlobalAPI.postData(obj).subscribe((data:any)=>{
       //console.log(data);
       var tempID = data[0].Column1;
       console.log("After Save",tempID);
      // this.Objproduction.Doc_No = data[0].Column1;
       if(data[0].Column1){
         this.compacctToast.clear();
         const mgs = this.buttonname === "Save" ? "Saved" : "Updated";
         this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Production Voucher  " + tempID,
          detail: "Succesfully  " + mgs
        });
       // this.GetSearchedList();
        this.clearData();
        this.searchData();
       //  this.ProductList =[];
       //  this.franchiseSalebillFormSubmitted = false;
       } else{
         this.compacctToast.clear();
         this.compacctToast.add({
           key: "compacct-toast",
           severity: "error",
           summary: "Warn Message",
           detail: "Error Occured "
         });
       }
     })
 }
 SaleBillPrint(obj) {
  // console.log("billno ===", true)
   if (obj.Bill_NO) {
     window.open("/Report/Crystal_Files/Finance/SaleBill/Sale_Bill_GST_K4C.aspx?Doc_No=" + obj.Bill_NO, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
 
     );
   }
 }

  // getCostcenterBro(){
  //   this.OutletFilter = [];
  //   this.SelectedOutLet = [];
  //   const obj = {
  //     "SP_String": "SP_Controller_Master",
  //     "Report_Name_String": "Get - Outlet",
  //    }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //      this.outletListBro = data;
  //      console.log("outletListBro",this.outletListBro);
  //      this.outletListBro.forEach(el => {
  //      this.SelectedOutLet.push(el.Cost_Cen_Name);
  //       this.OutletFilter.push(
  //         {
  //           label: el.Cost_Cen_Name,
  //           value: el.Cost_Cen_Name
  //         }
  //       )
  //     })
  //     })
  // }

  searchData(){
    this.seachSpinner = true;
    this.ObjBrowseData.Cost_Cen_ID = this.ObjBrowseData.Cost_Cen_ID === undefined ? 0 : this.ObjBrowseData.Cost_Cen_ID ;
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

      }

     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Browse Custom Order Distribution",
      "Json_Param_String": JSON.stringify([tempDate])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.GetAllDataList = data;
      this.BackUPGetAllDataList = data;
      console.log("this.GetAllDataList",this.GetAllDataList);
      this.GetDist1();
      this.seachSpinner = false;
      })

  }
  View(row){
    //console.log("View ==",DocNo);
  this.clearData();
  if(row.Doc_No){
  this.view_Doc_No = row.Doc_No;
  if (row.E_Invoice_PDF_Link) {
    this.viewbuttondisabled = true;
  }
  else {
    this.viewbuttondisabled = false;
  }
  //this.ViewPoppup = true;
  this.GetViewData(this.view_Doc_No);
  }
  }
  GetViewData(Doc_No){
    this.viewList = [];
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "View Custom Order Dispatch Details",
      "Json_Param_String": JSON.stringify([{Doc_No : this.view_Doc_No}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Data From Api",data);
      this.viewList = data;
      //  this.view_Doc_No = data[0].Doc_No;
      //  this.view_Doc_date = new Date(data[0].Doc_Date);
      //  this.view_Order_No = data[0].Adv_Order_No;

    // console.log("this.viewList  ===",this.viewList);
    this.ViewPoppup = true;
  })
  }
  UpdateBox (viewobj){
    if(viewobj.Txn_ID && viewobj.Box_Charge) {
      const tempObj = {
        Txn_ID : viewobj.Txn_ID,
        Doc_No : viewobj.Doc_No,
        Adv_Order_No : viewobj.Adv_Order_No,
        Box_Charge : viewobj.Box_Charge,
        Box_Charge_Remarks : viewobj.Box_Charge_Remarks
      }
     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Update_Box_Charge_In_Custom_Order",
      "Json_Param_String": JSON.stringify([tempObj])
     }
     this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           // console.log(data);
            if(data[0].Column1 === "Done") {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                //summary: 'SKU ID : ' + obj.Product_ID,
                detail: "Succesfully Updated ! Need to Regenerate this bill once."
              });
              this.searchData();
              //this.dataforregeneratingbill(true);
              //this.GetViewData(true);
            }else{
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Error",
                detail: "Error Occured"
              });
            }
      });
    }
    if(!viewobj.Box_Charge){
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Please Enter Box Charge"
      });
    }
  }
  
  GetDist1() {
    let DOrderBy = [];
    this.OutletFilter = [];
    //this.SelectedDistOrderBy1 = [];
    this.BackUPGetAllDataList.forEach((item) => {
    if (DOrderBy.indexOf(item.Cost_Cen_Name) === -1) {
    DOrderBy.push(item.Cost_Cen_Name);
    this.OutletFilter.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
    console.log("this.OutletFilter",this.OutletFilter);
}
});
}
  filterOutlet(){
      console.log("SelectedOutLet",this.SelectedOutLet);
      let DOrderBy = [];
      if (this.SelectedOutLet.length) {
      DOrderBy = this.SelectedOutLet;
      }
      this.GetAllDataList = [];
      if (this.SelectedOutLet.length) {
      let LeadArr = this.BackUPGetAllDataList.filter(function (e) {
      return (DOrderBy.length ? DOrderBy.includes(e['Cost_Cen_Name']) : true)
      });
      this.GetAllDataList = LeadArr.length ? LeadArr : [];
      console.log("if GetAllDataList",this.GetAllDataList)
      } else {
      this.GetAllDataList = this.BackUPGetAllDataList;
      console.log("else GetAllDataList",this.GetAllDataList)
      }
  }
  Browseprint(Objp){
    console.log("Print",Objp.Adv_Order_No);
  if (Objp.Adv_Order_No) {
    window.open("/Report/Crystal_Files/K4C/Adv_Custom_Order_Dispatch.aspx?DocNo=" + Objp.Adv_Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
    );
  }
  }
  DownloadEINV(obj) {
    if (obj) {
        window.open(obj, '_self');
      
    }
  }
  exportoexcel(Arr,fileName): void {
    let temp = [];
     Arr.forEach(element => {
       const obj = {
        Doc_No   :    element.Doc_No,
        Adv_Order_No   :  element.Adv_Order_No,
        Doc_Date    :  this.DateService.dateConvert(new Date(element.Doc_Date)),
        Sale_Bill_No : element.Bill_NO,
        Customer_Name   :  element.Customer_Name,
        Costomer_Mobile   :  element.Costomer_Mobile,
        amount_payable   :  element.amount_payable,
        godown_name  :  element.godown_name,
        Cost_Cen_Name   :  element.Cost_Cen_Name,
        Total_Qty  :  element.Total_Qty,
        Franchise_Amount   :  element.Total_Amount,
        Box_Charge : element.Box_Charge,
        Vehicle_Details   :  element.Vehicle_Details,
        Transaction_Date_Time   :  element.Transaction_Date_Time
       }
       temp.push(obj)
     });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(temp);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
  //Order Print
PrintOrder(obj) {
  if (obj.Adv_Order_No) {
    window.open("/Report/Crystal_Files/K4C/K4C_Advance_Order_Print.aspx?DocNo=" + obj.Adv_Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
  }
}
  //editmaster(col){}
  deleteAdvDispatch(masterProduct){
    console.log("deleteCol",masterProduct)
    this.Cancle_Remarks = undefined;
    this.remarksFormSubmitted = false;
    this.doc_no = undefined;
    this.salebillno = undefined;
    this.advordernumber = undefined;
    if (masterProduct.Doc_No) {
    if(this.checkLockDate(masterProduct.Doc_Date)){
     this.doc_no = masterProduct.Doc_No;
     this.doc_date = masterProduct.Doc_Date;
     this.salebillno = masterProduct.Bill_NO;
     this.advordernumber = masterProduct.Adv_Order_No
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
   onConfirm(valid){
     //this.Can_Remarks = true;
    this.remarksFormSubmitted = true;
    // if(this.Doc_No){
       const Tempdata = {
        Doc_No : this.doc_no,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
        Doc_Date : this.doc_date,
        Sale_Bill_No : this.salebillno,
        Remarks : this.Cancle_Remarks,
        Adv_Order_No : this.advordernumber
       }
       if (valid) {
       const objj = {
        "SP_String": "SP_Production_Voucher",
        "Report_Name_String": "Delete Custom Distribution Challan",
        "Json_Param_String": JSON.stringify([Tempdata])
       }
       this.GlobalAPI.getData(objj).subscribe((data:any)=>{
         var msg = data[0].Column1;
         if (data[0].Column1){
           //this.onReject();
           this.remarksFormSubmitted = false;
           this.searchData();
           this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Doc No.: " + this.doc_no.toString(),
             detail: msg
           });
           this.clearData();
     }
     else {
       this.compacctToast.clear();
       this.compacctToast.add({
         key: "compacct-toast",
         severity: "error",
         summary: "Warn Message",
         detail: "Error Occured "
       });
     }
     })
     }
  }
  onReject(){
    this.compacctToast.clear("c");
  }

  // REGENERATE BILL FROM ADMIN
dataforregeneratingbill(DocNo){
  this.Regeneratelist = [];
  this.costcenforregenerate = DocNo.To_Cost_Cen_ID;
  this.RegenerateDocNo = DocNo.Doc_No;
  this.RegenerateBillNo = DocNo.Bill_NO;
  this.RegenerateDocDate = DocNo.Doc_Date;

      const tempDate = {
        Doc_No : this.RegenerateDocNo,
        Adv_Order_No : DocNo.Adv_Order_No

      }

  const obj = {
    "SP_String": "SP_K4C_Accounting_Journal_M_O",
    "Report_Name_String" : "Custom Order challan data For refresh",
    "Json_Param_String": JSON.stringify([tempDate])
  }
this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  console.log("From Api",data);
  this.Regeneratelist = data;
  // var Challan_No = data[0].Column1;
  console.log("this.Regeneratelist",this.Regeneratelist);
  if (this.Regeneratelist.length) {
    this.getsubledgeridforRegeneratebill();
    this.calculateTotalAmtforregeneratebill();
    this.RegenerateBill();
  }
  else {
  // if(data[0].Column1){
  this.compacctToast.clear();
     this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "No data found "
    });
  }
   //console.log("this.Objdispatch",this.productDetails);

 })
}
calculateTotalAmtforregeneratebill(){
  this.taxableRegenerate = undefined;
  this.cgstRegenerate = undefined;
  this.sgstRegenerate = undefined;
  this.igstRegenerate = undefined;
  this.grossamountRegenerate = undefined;
  let totaltaxRegenerate = 0; 
  let totalcgstRegenerate = 0;
  let totalsgstRegenerate = 0;
  let totaligstRegenerate = 0;
  let grossamtRegenerate = 0;
  this.Regeneratelist.forEach(item => {
    totaltaxRegenerate = totaltaxRegenerate + Number(item.Taxable);
    totalcgstRegenerate = totalcgstRegenerate + Number(item.CGST_AMT);
    totalsgstRegenerate = totalsgstRegenerate + Number(item.SGST_AMT);
    totaligstRegenerate = totaligstRegenerate + Number(item.IGST_AMT);
    grossamtRegenerate = grossamtRegenerate + Number(item.Net_Amount);
  });
  this.taxableRegenerate = (totaltaxRegenerate).toFixed(2);
  this.cgstRegenerate = (totalcgstRegenerate).toFixed(2);
  this.sgstRegenerate = (totalsgstRegenerate).toFixed(2);
  this.igstRegenerate = (totaligstRegenerate).toFixed(2);
  this.grossamountRegenerate = (grossamtRegenerate).toFixed(2);
  // Round Off
  this.Round_OffRegenerate = (Number(this.grossamountRegenerate) - Math.round(this.grossamountRegenerate)).toFixed(2);
  this.netamountRegenerate = Math.round(this.grossamountRegenerate);
  //console.log(this.Net_Amount);
}
getsubledgeridforRegeneratebill(){
  //this.ExpiredProductFLag = false;
 if(this.costcenforregenerate) {
  const ctrl = this;
  const regeneratesubledgeridObj = $.grep(ctrl.FranchiseList,function(item: any) {return item.Cost_Cen_ID == ctrl.costcenforregenerate})[0];
  console.log(regeneratesubledgeridObj);
  this.subledgeridforregenerate = regeneratesubledgeridObj.Sub_Ledger_ID;
  //this.franchisecostcenid = subledgeridObj.Cost_Cen_ID;
  console.log("this.subledgeridforregenerate ==", this.subledgeridforregenerate)
  
 }
}
RegenerateBill(){
      this.Regeneratelist.forEach(item => {
        item['Product_Name'] = item.Product_Description,
        item['Sub_Ledger_ID'] = Number(this.subledgeridforregenerate),
        item['Cost_Cen_ID'] = Number(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID),
        item['Rate'] = Number(item.Sale_rate),
        item['MRP'] = Number(item.Sale_rate),
        item['Amount'] = Number(item.Sale_rate) * Number(item.Qty),
        item['Bill_Gross_Amt'] = Number(this.taxableRegenerate),
        item['Bill_Net_Amt'] = Number(this.netamountRegenerate),
        item['User_ID'] = Number(this.$CompacctAPI.CompacctCookies.User_ID),
        item['Fin_Year_ID'] = Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID),
        item['Rounded_Off'] = Number(this.Round_OffRegenerate),
        item['Taxable_Amount'] = Number(item.Taxable),
        item['Total_Taxable'] = Number(this.taxableRegenerate),
        item['CGST_OUTPUT_LEDGER_ID'] = Number(item.CGST_Output_Ledger_ID),
        item['CGST_Rate'] = Number(item.CGST_PER),
        item['CGST_Amount'] = Number(item.CGST_AMT),
        item['SGST_OUTPUT_LEDGER_ID'] = Number(item.SGST_Output_Ledger_ID),
        item['SGST_Rate'] = Number(item.SGST_PER),
        item['SGST_Amount'] = Number(item.SGST_AMT),
        item['IGST_OUTPUT_LEDGER_ID'] = Number(item.IGST_Output_Ledger_ID),
        item['IGST_Rate'] = Number(item.IGST_PER),
        item['IGST_Amount'] = Number(item.IGST_AMT),
        item['Total_CGST_Amt'] = Number(this.cgstRegenerate),
        item['Total_SGST_Amt'] = Number(this.sgstRegenerate),
        item['Total_IGST_Amt'] = Number(this.igstRegenerate),
        item['Total_Net_Amt'] = Number(this.netamountRegenerate),
        item['Bill_No'] = this.RegenerateBillNo,
        item['Doc_Date'] = this.RegenerateDocDate,
        item['Discount'] = 0,
        item['Remarks'] = "NA",
        item['HSL_No'] = item.HSN_NO
      })
     const obj = {
      "SP_String" : "SP_K4C_Accounting_Journal_M_O",
      "Report_Name_String" : "Refresh_Franchise_Sale_Bill_Against_Adv_Order",
      "Json_Param_String": JSON.stringify(this.Regeneratelist),
      "Json_1_String" : JSON.stringify([{Order_No : this.RegenerateDocNo}])
     }
     this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      //this.FranchiseProductList = data;
     // console.log("this.FranchiseProductList======",this.FranchiseProductList);
      var bill_No = data[0].Column1;
      if(data[0].Column1){
        this.compacctToast.clear();
           this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Bill No. " + bill_No,
            detail: "Regenerate Bill Succesfully "
          });
          this.costcenforregenerate = undefined;
          this.RegenerateDocNo = undefined;
          this.RegenerateBillNo = undefined;
          this.RegenerateDocDate = undefined;
          this.taxableRegenerate = undefined;
          this.cgstRegenerate = undefined;
          this.sgstRegenerate = undefined;
          this.igstRegenerate = undefined;
          this.grossamountRegenerate = undefined;
          this.Round_OffRegenerate = undefined;
          this.netamountRegenerate = undefined;
          this.searchData();
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
     })
}

// GENERATE BILL NO
GeneratingBillNo(row){
  //console.log("View ==",DocNo);
this.clearData();
if(row.Doc_No){
this.view_Doc_No = row.Doc_No;
//this.ViewPoppup = true;
this.GetViewDataforgeneratebillno(this.view_Doc_No);
}
}
GetViewDataforgeneratebillno(Doc_No){
  this.viewgenerateList = [];
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "View Custom Order Dispatch Details",
    "Json_Param_String": JSON.stringify([{Doc_No : this.view_Doc_No}])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("Data From Api",data);
    this.viewgenerateList = data;
    //  this.view_Doc_No = data[0].Doc_No;
    //  this.view_Doc_date = new Date(data[0].Doc_Date);
    //  this.view_Order_No = data[0].Adv_Order_No;

  // console.log("this.viewList  ===",this.viewList);
  this.saveAdvGenerate();

})
}
saveAdvGenerate(){
  console.log(this.saveqty());
  console.log(this.viewgenerateList.length && this.saveqty());
  if(this.viewgenerateList.length && this.saveqty()){
    this.ngxService.start();
        this.saveData = [];
           this.viewgenerateList.forEach(el=>{
             if(Number(el.Delivery_Qty) && Number(el.Delivery_Qty) !== 0 ){
               if(el.Franchise === 'Y') {//(Number(el.Box_Charge) || Number(el.Box_Charge) === 0)) {
              this.flagbox = false;
                 if(el.Box_Charge) {
             const saveObj = {
               Doc_No: el.Doc_No,
               Doc_Date: el.Doc_Date,
               F_Cost_Cen_ID: el.F_Cost_Cen_ID,
               F_Godown_ID: el.F_Godown_ID,
               To_Cost_Cen_ID: el.To_Cost_Cen_ID,
               To_Godown_ID: el.To_Godown_ID,
               Batch_No : el.Batch_NO,
               Product_ID: el.Product_ID,
               Qty: el.Delivery_Qty,
               Accepted_Qty : el.Delivery_Qty,
               Rate: 0,
               UOM: el.UOM,
               User_ID: el.User_ID,
               REMARKS: el.REMARKS,
               Fin_Year_ID: this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
               Vehicle_Details : el.Vehicle_Details,
               Adv_Order_No : el.Adv_Order_No,
               Status : this.Auto_Accepted == "Y" ? "Updated" : "Not Updated",
               Box_Charge : el.Box_Charge, //? el.Box_Charge : 0,
               Box_Charge_Remarks : el.Box_Charge_Remarks,
               Order_Cost_Centre_ID : el.Order_Cost_Centre_ID
             }
             this.saveData.push(saveObj)
            }
            else {
                this.flagbox = true;
                 }
                }
                 else {
                  const saveObj = {
                    Doc_No: el.Doc_No,
                    Doc_Date: el.Doc_Date,
                    F_Cost_Cen_ID: el.F_Cost_Cen_ID,
                    F_Godown_ID: el.F_Godown_ID,
                    To_Cost_Cen_ID: el.To_Cost_Cen_ID,
                    To_Godown_ID: el.To_Godown_ID,
                    Batch_No : el.Batch_NO,
                    Product_ID: el.Product_ID,
                    Qty: el.Delivery_Qty,
                    Accepted_Qty : el.Delivery_Qty,
                    Rate: 0,
                    UOM: el.UOM,
                    User_ID: el.User_ID,
                    REMARKS: el.REMARKS,
                    Fin_Year_ID: this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
                    Vehicle_Details : el.Vehicle_Details,
                    Adv_Order_No : el.Adv_Order_No,
                    Status : this.Auto_Accepted == "Y" ? "Updated" : "Not Updated",
                    Box_Charge : el.Box_Charge ? el.Box_Charge : 0,
                    Box_Charge_Remarks : el.Box_Charge_Remarks,
                    Order_Cost_Centre_ID : el.Order_Cost_Centre_ID
                  }
                  this.saveData.push(saveObj)
                 }
                 }
          })
           if(this.saveData.length){
            const obj = {
              "SP_String": "SP_Production_Voucher",
               "Report_Name_String": "Add K4C Txn Distribution For Custom Order",
               "Json_Param_String": JSON.stringify(this.saveData)
             }
             this.GlobalAPI.getData(obj).subscribe((data:any)=>{
              this.dispatchchallanno = data[0].Column1;
               var tempID = data[0].Column1;
               if(data[0].Column1){
                if(this.FranchiseBill != "N") {
                  this.SaveFranchisechallan();
                }
                this.ngxService.stop();
                 this.compacctToast.clear();
               this.compacctToast.add({
               key: "compacct-toast",
               severity: "success",
               summary: "Distribution Challan No. " + tempID,
               detail: "Distribution Challan Entry Succesfully"
             });
             this.productDetails = [];
             this.tabIndexToView = 0;
             this.items = ["BROWSE", "CREATE"];
             this.buttonname = "Create";
             this.clearData();
             this.searchData();
            // this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
               } else{
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

}
class advDispat{
  Brand_ID : any;
  Cost_Cen_ID : any;
  To_Godown_ID : any;
  From_Godown_ID:any;
  Vehicle_Details:any;
  REMARKS:any;
}
class BrowseData {
  From_Date: string;
  To_Date: string;
  Cost_Cen_ID : any = 0;
  }
