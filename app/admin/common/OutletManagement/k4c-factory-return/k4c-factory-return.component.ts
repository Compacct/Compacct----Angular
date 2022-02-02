import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Console } from 'console';
import { NgxUiLoaderService } from "ngx-ui-loader";
declare var $:any;

@Component({
  selector: 'app-k4c-factory-return',
  templateUrl: './k4c-factory-return.component.html',
  styleUrls: ['./k4c-factory-return.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cFactoryReturnComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save";

  myDate: Date;
  selectProduct = [];
  ObjProductaddForm : ProductaddForm  = new ProductaddForm();
  ObjSaveForm : SaveForm  = new SaveForm();

  public QueryStringObj : any;
  Cost_Center = [];
  Godown = [];
  BatchNo = [];
  //Expire_BatchNo: any;
  ExProductFlag = false;
  ReturnReasonid = [];
  GoDown_Id: void;
  RFactoryaddFormSubmitted = false;
  productaddSubmit = [];
  toGodownList = [];
  dateList = [];
  Searchedlist =[];
  Browser = false;

  ObjBrowse : Browse = new Browse ();
  editList = [];
  Doc_no = undefined;
  Doc_date = undefined;
  To_Cost_Cent_ID = undefined;
  To_Godown_ID = undefined;
  To_outlet = undefined;
  From_outlet = undefined;
  Return_reason = undefined;
  Batchno = undefined;
  EditPoppup = false;
  updateData = [];
  editpopupformSubmitted = false;
  rowIndex = [];
  ViewPoppup = false;
  Qtyflag = false;
  AQtyflag = false;
  AcceptChallanPoppup = false;
  flag = false;
  del_doc_no = undefined;
  initDate = [];
  checkSave = true;
  Fromgodownid: any;
  exProdFlag = false;
  ExpiredProductFLag = false;
  mattypelist = [];
  DisabledBatch = false;
  //sameProdTypeFlag = false;
  SearchFactoryFormSubmit = false;
  From_Godown_ID = undefined;
  T_Godown_ID = undefined;
  From_cost_cen_ID = undefined;
  To_cost_cen_ID = undefined;
  Remarksdisabled = false;
  MTdisabled = false;

  RTFchallanno : any;
  FranchiseProductList = [];
  FranchiseList = [];
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

  Franchise = [];
  FranchiseBill:any;
  FranchiseCostCentId = undefined;

  checkboxdisable = false;
  TimeStatus : any;

  constructor(
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) {
    // this.Header.pushHeader({
    //   Header: "Return To Factory",
    //   Link: " Outlet -> Return to Factory "
    // });
  }

  ngOnInit() {
    $(".content-header").removeClass("collapse-pos");
    $(".content").removeClass("collapse-pos");
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Return To Factory",
      Link: " Outlet -> Return to Factory "
    });
    this.getMaterialType();
    this.getDate();
    this.getToCostCenter();
    //this.getToGodown();
    this.getGodown();
    //this.getselectproduct();
    this.getReturnReason("M");
    // this.route.queryParamMap.subscribe((val:any) => {
    //   if(val.params) {
    //     this.QueryStringObj = val.params;
    //     if(this.QueryStringObj.Browse_Flag) {
    //       this.Browser = true;
    //       this.tabIndexToView = 0;
    //     }
    //     if(this.QueryStringObj.Create_Flag) {
    //       this.tabIndexToView = 1;
    //     }
    //   }
    // } );
    //this.DateService.dateConvert(new Date(this.myDate));
    this.GetFranchiseBill();
    this.GetFranchiseList();
  }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.productaddSubmit =[];
    this.clearData();
    this.ExpiredProductFLag = false;
    this.getReturnReason("N");
    this.checkboxdisable = false;
  }
  // CREATE TAB
  getDate(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Outlet Bill Date",
    //"Json_Param_String": JSON.stringify([{Doc_Type : "Sale_Bill"}])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.dateList = data;
 //console.log("this.dateList  ===",this.dateList);
 this.myDate =  new Date(data[0].Outlet_Bill_Date);
 this.initDate = [this.myDate , this.myDate];
  // on save use this
 // this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));

})
  }

  getToCostCenter(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Factory Outlet",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Cost_Center = data;
       this.ObjSaveForm.Cost_Cent_ID = data[0].Cost_Cen_ID;
       this.getToGodown();
       //console.log('Cost Center =',this.Cost_Center)

     })
  }
  getToGodown(){
   // console.log('to cost cent id ==', this.ObjSaveForm.Cost_Cent_ID)
    const TempObj = {
      Cost_Cen_ID : this.ObjSaveForm.Cost_Cent_ID
     }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Godown Factory Outlet",
      "Json_Param_String": JSON.stringify([TempObj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.toGodownList = data;
       this.ObjSaveForm.Godown_ID = this.toGodownList.length ? this.toGodownList[0].godown_id : undefined;
       //console.log('To Godown =',this.toGodownList)
     })
  }
  getGodown(){
    const TempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
     }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Godown For Sale Bill",
      "Json_Param_String": JSON.stringify([TempObj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Godown = data;
       this.GoDown_Id = data[0].godown_id ;
       this.Fromgodownid = data[0].godown_id ? data[0].godown_id : 0;
      // console.log('Godown =',this.Godown)
     })
  }
  getMaterialType() {
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get material Type",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.mattypelist = data;
      //console.log("Material Type List ===",this.mattypelist);
    })
  }
  getselectproduct(){
    this.ObjProductaddForm = new ProductaddForm();
    this.selectProduct = [];
    this.MTdisabled = true;
    //if(this.ObjaddbillForm.Cost_Cen_ID){
     //this.ObjProductaddForm.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    // console.log("Doc_Date =",this.DateService.dateConvert(new Date(this.myDate)))
    //if(this.ObjSaveForm.Material_Type === "Finished"){
      this.selectProduct = [];
      this.BatchNo = [];
      this.DisabledBatch = false;
     const TempObj = {
       User_ID:this.$CompacctAPI.CompacctCookies.User_ID,
       Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
       Doc_Type : "Sale_Bill",
      // Doc_Date : this.DateService.dateConvert(new Date(this.myDate)),
       Product_Type_ID : 0,
       bill_type : 'RTF',
       Material_Type : this.ObjSaveForm.Material_Type
      }
      const obj = {
       "SP_String": "SP_Controller_Master",
       "Report_Name_String" : "Get Sale Requisition Product",
      "Json_Param_String": JSON.stringify([TempObj])

     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
         data.forEach(element => {
           element['label'] = element.Product_Description,
           element['value'] = element.Product_ID
         });
         this.selectProduct = data;
       } else {
         this.selectProduct = [];

       }
       console.log("Finished Product======",this.selectProduct);


     });
    //}
    this.selectProduct = [];
    //  if(this.ObjSaveForm.Material_Type === "Store Item"){
    //   this.selectProduct = [];
    //   this.BatchNo = [];
    //  // this.DisabledBatch = true;
    //   const Objtemp = {
    //    Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    //    Product_Type_ID : 0,
    //    Material_Type : this.ObjSaveForm.Material_Type
    //   }
    //   const obj = {
    //     "SP_String": "SP_Outlet_Stock_Transfer",
    //     "Report_Name_String": "Get outlet Stock Transfer Store Item Product",
    //     "Json_Param_String": JSON.stringify([Objtemp])
    //  }
    //  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //   if(data.length) {
    //     data.forEach(element => {
    //       element['label'] = element.Product_Description,
    //       element['value'] = element.Product_ID
    //     });
    //     this.selectProduct = data;
    //   } else {
    //     this.selectProduct = [];

    //   }
    //    console.log("Store Product======",this.selectProduct);
    //  })
    // }
  }
  ProductChange() {
  this.BatchNo =[];
  // this.ExpiredProductFLag = false;
  // this.ExpiredProducts();
 //if(this.ObjSaveForm.Material_Type === "Finished"){
 if(this.ObjProductaddForm.Product_ID) {
   const ctrl = this;
   if(this.ExpiredProductFLag){
    this.getExpireBathNo();
  } else {
  this.getBatchNo();
  }
   const productObj = $.grep(ctrl.selectProduct,function(item) {return item.Product_ID == ctrl.ObjProductaddForm.Product_ID})[0];
   //console.log(productObj);
   this.ObjProductaddForm.Product_Description = productObj.Product_Description;
   this.ObjProductaddForm.Net_Price =  productObj.Sale_rate;
  // //this.ObjaddbillForm.Stock_Qty = productObj.Stock_Qty;
  }
  //} else {
  //if(this.ObjProductaddForm.Material_Type === "Store Item"){
    // if(this.ObjProductaddForm.Product_ID) {
    //   const ctrl = this;
    // const productObj = $.grep(ctrl.selectProduct,function(item) {return item.Product_ID == ctrl.ObjProductaddForm.Product_ID})[0];
    //  //console.log(productObj);
    //  this.ObjProductaddForm.Product_Description = productObj.Product_Description;
    //  this.ObjProductaddForm.Net_Price =  productObj.Sale_rate;
    //  this.ObjProductaddForm.Avl_Qty = productObj.Avl_Qty;
    // }
    // }
  }
  getexpiredproduct(){
    this.ObjProductaddForm = new ProductaddForm();
    this.selectProduct = [];
    //if(this.ObjaddbillForm.Cost_Cen_ID){
     //this.ObjProductaddForm.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    // console.log("Doc_Date =",this.DateService.dateConvert(new Date(this.myDate)))
    // if(this.ObjSaveForm.Material_Type === "Finished"  && this.ExpiredProductFLag || 
    //    this.ObjSaveForm.Material_Type === "Store Item"  && this.ExpiredProductFLag){
      this.selectProduct = [];
      this.BatchNo = [];
      this.DisabledBatch = false;
     const TempObj = {
       User_ID:this.$CompacctAPI.CompacctCookies.User_ID,
       Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
       Doc_Type : "RTF Expire",
       Doc_Date : this.DateService.dateConvert(new Date(this.myDate)),
       Product_Type_ID : 0,
       Material_Type : this.ObjSaveForm.Material_Type
      }
      const obj = {
       "SP_String": "SP_Controller_Master",
       "Report_Name_String" : "Get Sale Requisition Product",
      "Json_Param_String": JSON.stringify([TempObj])

     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
         data.forEach(element => {
           element['label'] = element.Product_Description,
           element['value'] = element.Product_ID
         });
         this.selectProduct = data;
       } else {
         this.selectProduct = [];

       }
       console.log("Finished Product======",this.selectProduct);


     });
   // }
  }
  getBatchNo(){
  //console.log('Product Id ==',this.ObjProductaddForm.Product_ID)
  const TempObj = {
     Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
     Godown_Id : this.GoDown_Id,
    Product_ID : this.ObjProductaddForm.Product_ID,
    //Cost_Cen_ID : 2,
    //Godown_Id : 4,
    //Product_ID : 3388
   }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get_Product_Wise_Batch",
    "Json_Param_String": JSON.stringify([TempObj])
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.BatchNo = data;
  //  this.ObjProductaddForm.Batch_No = this.BatchNo.length ? this.BatchNo[0].Batch_NO : undefined;
  //  this.getProductTimeChecking();
   if (this.BatchNo.length) {
    this.ObjProductaddForm.Batch_No = this.BatchNo[0].Batch_NO;
    this.getProductTimeChecking();
   } 
   else {
    this.ObjProductaddForm.Batch_No = undefined;
    this.getProductTimeChecking();
   }
  // console.log('Batch No ==', data)

  });
  }
  ExpiredProducts(){
    //console.log("ExProductFlag",event);

    // var ReturnReasonid1 = [];
    if(this.ExpiredProductFLag){
      this.getReturnReason("Y");
      //console.log(event);
      //console.log(this.ReturnReasonid);
      // ReturnReasonid1.push(this.ReturnReasonid[0]);
      // console.log(ReturnReasonid1);
      // this.ReturnReasonid = ReturnReasonid1;
      var ReturnReasonid1 = this.ReturnReasonid.filter(function(value, index, arr){
        return value.Return_Reason_ID == 1;
      });
      this.ReturnReasonid = ReturnReasonid1;
      this.ObjSaveForm.Return_Reason_ID = this.ReturnReasonid;
      //console.log(this.ReturnReasonid);

      this.BatchNo = [];
      this.getExpireBathNo();
      this.getexpiredproduct();
    }
    else{
      this.getReturnReason("N");
      var ReturnReasonid1 = this.ReturnReasonid.filter(function(value, index, arr){
        return value.Return_Reason_ID != 1;
      });
      this.ReturnReasonid = ReturnReasonid1;
      //console.log(this.ReturnReasonid);
      this.ObjSaveForm.Return_Reason_ID = this.ReturnReasonid;

      this.BatchNo = [];
      this.getBatchNo();
      this.getselectproduct();
    }
  }
  getExpireBathNo(){
  const TempObj = {
    //Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
     Godown_Id : this.GoDown_Id,
    Product_ID : this.ObjProductaddForm.Product_ID,
   }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get_Expire_Product_Wise_Batch",
    "Json_Param_String": JSON.stringify([TempObj])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.BatchNo = data;
     this.ObjProductaddForm.Batch_No = this.BatchNo.length ? this.BatchNo[0].Batch_NO : undefined;
     //console.log('Expire Batch No =',this.BatchNo)
   })
  }
  getProductTimeChecking(){
    const TempObj = {
      Product_ID : this.ObjProductaddForm.Product_ID,
      Batch_NO : this.ObjProductaddForm.Batch_No
     }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "RTF Product Time Checking",
      "Json_Param_String": JSON.stringify([TempObj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.TimeStatus = data[0].Column1;
      // this.ObjProductaddForm.Batch_No = this.BatchNo.length ? this.BatchNo[0].Batch_NO : undefined;
       console.log('Expire TimeStatus =',this.TimeStatus)
       if (this.TimeStatus === "false") {
        //this.getReturnReason("N");
        var ReturnReasonid2 = this.ReturnReasonid.filter(function(value, index, arr){
        return value.Return_Reason_ID != 5;
      });
        this.ReturnReasonid = ReturnReasonid2;
        console.log("this.ReturnReasonid2", this.ReturnReasonid);
        this.ObjSaveForm.Return_Reason_ID = ReturnReasonid2.length ? ReturnReasonid2[0].Return_Reason_ID : undefined;
       } else 
       {
        this.getReturnReason("N");
       }
     })
    }

  getReturnReason(expireflag){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Return Reason Dropdown",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.ReturnReasonid = data;
     this.ObjSaveForm.Return_Reason_ID = data[0].Return_Reason_ID;
     var returnReasonIdLocal =  this.ReturnReasonid.filter(function(value, index, arr){
       if(expireflag == 'Y') {
          return value.Return_Reason_ID == 1;
       } else {
          return value.Return_Reason_ID != 1;
        }
     })
     this.ReturnReasonid = returnReasonIdLocal;
     this.ObjSaveForm.Return_Reason_ID = this.ReturnReasonid.length ? this.ReturnReasonid[0].Return_Reason_ID : undefined;
     //this.ObjProductaddForm.Return_Reason = data.Return_Reason;
    // console.log('Rerurn Reason =',this.ReturnReasonid)

   })
  }

  addProduct(valid){
  this.RFactoryaddFormSubmitted = true;
 // if(this.ObjSaveForm.Material_Type === "Finished"){     // FINISHED PRODUCT ADD
  if(valid && this.GetSelectedBatchqty()){
    var RR = this.ReturnReasonid.find(Return_Reason => Return_Reason.Return_Reason_ID == this.ObjSaveForm.Return_Reason_ID);
     //var ExitsProduct = this.ReturnReasonid.filter( item => Number(item.Return_Reason_ID) === Number(this.ObjProductaddForm.Return_Reason_ID));
    //console.log("ExitsProduct",ExitsProduct);
    var productObj = {
    Product_ID : this.ObjProductaddForm.Product_ID,
    Product_Description : this.ObjProductaddForm.Product_Description,
    Net_Price : this.ObjProductaddForm.Net_Price,
    Stock_Qty :  this.ObjProductaddForm.Stock_Qty,
    Batch_No : this.ObjProductaddForm.Batch_No,
    Return_Reason : RR.Return_Reason,
    //Return_Reason : ExitsProduct.item,
    Return_Reason_ID : this.ObjSaveForm.Return_Reason_ID,
    Material_Type : this.ObjSaveForm.Material_Type,
    Remarks : this.ObjProductaddForm.Remarks
  };
  this.productaddSubmit.push(productObj);
  if(this.ExpiredProductFLag) {
  this.getReturnReason("Y");
  } else {
    this.getReturnReason("N");
  }
  //console.log("Product Submit",this.productaddSubmit);
  this.RFactoryaddFormSubmitted = false;
  this.ObjProductaddForm = new ProductaddForm();
  this.BatchNo = [];
  this.checkboxdisable = true;
  //this.getProductTimeChecking();
  //this.MTdisabled = true;
  // this.exProdFlag = false;
  // this.ExpiredProductFLag = false;
  // var ReturnReasonid1 = this.ReturnReasonid.filter(function(value, index, arr){
  //   return value.Return_Reason_ID != 1;
  // });
  // this.ReturnReasonid = ReturnReasonid1;
  // }
  }
  // if(this.ObjSaveForm.Material_Type === "Store Item"){   // STORE ITEM PRODUCT ADD
  //   if(valid){
  //     var RR = this.ReturnReasonid.find(Return_Reason => Return_Reason.Return_Reason_ID == this.ObjSaveForm.Return_Reason_ID);
  //      //var ExitsProduct = this.ReturnReasonid.filter( item => Number(item.Return_Reason_ID) === Number(this.ObjProductaddForm.Return_Reason_ID));
  //     //console.log("ExitsProduct",ExitsProduct);
  //     var Objproduct = {
  //     Product_ID : this.ObjProductaddForm.Product_ID,
  //     Product_Description : this.ObjProductaddForm.Product_Description,
  //     Net_Price : this.ObjProductaddForm.Net_Price,
  //     Stock_Qty :  this.ObjProductaddForm.Stock_Qty,
  //     Batch_No : "NA",
  //     Return_Reason : RR.Return_Reason,
  //     //Return_Reason : ExitsProduct.item,
  //     Return_Reason_ID : this.ObjSaveForm.Return_Reason_ID,
  //     Material_Type : this.ObjSaveForm.Material_Type
  //   };
  //  // this.productaddSubmit.push(Objproduct);
  //   var sameProdTypeFlag = false;
  // this.productaddSubmit.forEach(item => {
  //   //console.log('enter select');
  //   //console.log(item.Product_ID);
  //   //console.log(this.ObjaddbillForm.Product_ID);
  //   //console.log(item.Product_ID == this.ObjaddbillForm.Product_ID);
  //   if(item.Product_ID == this.ObjProductaddForm.Product_ID && item.Return_Reason_ID == this.ObjSaveForm.Return_Reason_ID) {
  //     //console.log('select item true');
  //     item.Stock_Qty = Number(item.Stock_Qty) + Number( Objproduct.Stock_Qty);

  //     sameProdTypeFlag = true;
  //   }
  //   // count = count + Number(item.Net_Amount);
  // });

 // if(sameProdTypeFlag == false) {
 //  this.productaddSubmit.push(Objproduct);
 // }

 //console.log("this.productSubmit",this.productaddSubmit);
   // this.getReturnReason("N");
    //console.log("Product Submit",this.productaddSubmit);
    // this.RFactoryaddFormSubmitted = false;
    // this.ObjProductaddForm = new ProductaddForm();
    // this.BatchNo = [];
    // this.exProdFlag = false;
    // this.ExpiredProductFLag = false;
    // var ReturnReasonid1 = this.ReturnReasonid.filter(function(value, index, arr){
    //   return value.Return_Reason_ID != 1;
    // });
    // this.ReturnReasonid = ReturnReasonid1;
  //    }
  // }
 }
 GetSelectedBatchqty () {
  const sameproductwithbatch = this.productaddSubmit.filter(item=> item.Batch_No === this.ObjProductaddForm.Batch_No && item.Product_ID === this.ObjProductaddForm.Product_ID );
  if(sameproductwithbatch.length) {
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Product with same batch no. detected."
        });
    return false;
  }
  const baychqtyarr = this.BatchNo.filter(item=> item.Batch_NO === this.ObjProductaddForm.Batch_No);
    if(baychqtyarr.length) {
      if(this.ObjProductaddForm.Stock_Qty <=  baychqtyarr[0].Qty) {
        return true;
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Quantity can't be more than in batch available quantity "
        });
        return false;
      }
    } else {
      return true;
    }
  }
  delete(index) {
    this.productaddSubmit.splice(index,1)

  }
  // GetAvlQty () {
  //   const avlqtyarr = this.selectProduct.filter(item=> item.Avl_Qty === this.ObjProductaddForm.Avl_Qty);
  //     if(avlqtyarr.length) {
  //       if(this.ObjProductaddForm.Stock_Qty <=  avlqtyarr[0].Avl_Qty) {
  //         return true;
  //       } else {
  //         this.compacctToast.clear();
  //         this.compacctToast.add({
  //           key: "compacct-toast",
  //           severity: "error",
  //           summary: "Warn Message",
  //           detail: "Quantity can't be more than available quantity "
  //         });
  //         return false;
  //       }
  //     } else {
  //       return true;
  //     }
  // }

  // DAY END CHECK
 saveCheck(){
  if(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID && this.Fromgodownid){
    this.ngxService.start();
    const TempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Godown_Id : this.Fromgodownid
   }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Check_Day_End",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data[0].Status === "Allow"){
        this.ValidateEntryCheck();
      }
      else if(data[0].Status === "Disallow"){    // Disallow
       this.checkSave = false;
       this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "c",
          sticky: true,
          severity: "error",
          summary: data[0].Message,
          detail: "Confirm to proceed"
        });
        this.productaddSubmit = [];
        this.clearData();
      } else{
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
    })
  } else{
    this.ngxService.stop();
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "Error Occured "
    });
  }

 }
 ValidateEntryCheck(){
  const obj = {
    "SP_String": "SP_Validate_Entry",
    "Report_Name_String": "Validate Issue",
    "Json_Param_String": this.dataforSaveProduct()
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("Validate Entry ===" , data);
    if(data[0].status === "True") {
      this.SaveProduct();
    }
    else if(data[0].status === "false"){   
      var productDes = data[0].Product_Description; 
      var batchn = data[0].Batch_No;
     this.Spinner = false;
     this.ngxService.stop();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Insufficient Stock In",
        detail: productDes  +  ' , '  +  batchn
      })
    } else {
      this.ngxService.stop();
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
 SaveProduct(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String" : "Add Outlet Factory Return",
   "Json_Param_String": this.dataforSaveProduct()

  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    console.log(data);
    var tempID = data[0].Column1;
    if(data[0].Column1){
      this.ngxService.stop();
      this.compacctToast.clear();
      //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Return_ID  " + tempID,
       detail: "Succesfully Created" //+ mgs
     });
     //this.clearData();
     this.productaddSubmit =[];
     this.RFactoryaddFormSubmitted = false;
     this.MTdisabled = false;
     this.checkboxdisable = false;
    // this.ExpiredProductFLag = true;
     if(this.ExpiredProductFLag){
       this.getReturnReason("Y");
     } else {
       this.getReturnReason("N");
     }
     //this.ObjSaveForm = new SaveForm();

    } else{
      this.ngxService.stop();
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
 dataforSaveProduct(){
  // console.log(this.DateService.dateConvert(new Date(this.myDate)))
   this.ObjSaveForm.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
  if(this.productaddSubmit.length) {
    let tempArr =[]
    this.productaddSubmit.forEach(item => {
      const obj = {
          Product_ID : item.Product_ID,
          Product_Description : item.Product_Description,
          Batch_No : item.Batch_No,
          Rate : item.Net_Price ? item.Net_Price : 0,
          Qty : Number(item.Stock_Qty),
          Return_Reason : item.Return_Reason,
          Return_Reason_ID : item.Return_Reason_ID,
          Material_Type : item.Material_Type,
          Outlet_Remarks : item.Remarks
      }

      const TempObj = {
        UOM : "PCS",
        Doc_No : "A",
        Doc_Date : this.ObjSaveForm.Doc_Date,
        F_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        F_Godown_ID : this.GoDown_Id,
        To_Cost_Cen_ID : this.ObjSaveForm.Cost_Cent_ID,
        To_Godown_ID : this.ObjSaveForm.Godown_ID,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
        Fin_Year_ID : this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
        REMARKS : "NA",
        Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
        //Return_Reason_ID : this.ObjProductaddForm.Return_Reason_ID

      }
      tempArr.push({...obj,...TempObj})
    });
   // console.log(tempArr)
    return JSON.stringify(tempArr);

  }
 }

 // BROWSE TAB
 getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjBrowse.start_date = dateRangeObj[0];
    this.ObjBrowse.end_date = dateRangeObj[1];
  }
 }
 GetSearchedlist(valid){
  this.SearchFactoryFormSubmit = true;
  this.Searchedlist = [];
  const start = this.ObjBrowse.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
  : this.DateService.dateConvert(new Date());
  if(valid){
const tempobj = {
  From_Date : start,
  To_Date : end,
  Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
  Material_Type : this.ObjBrowse.Material_Type
}
const obj = {
  "SP_String": "SP_Controller_Master",
  "Report_Name_String": "Browse Outlet Factory Return",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   //console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
   this.SearchFactoryFormSubmit = false;
 })
 }
 }
 PrintRTF(obj) {
  if (obj.Doc_No) {
    window.open("/Report/Crystal_Files/K4C/Return_To_Factory_Print.aspx?DocNo=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
  }
}
 view(DocNo){
  this.Doc_no = undefined;
  this.Doc_date = undefined;
  this.To_Cost_Cent_ID = undefined;
  this.To_Godown_ID = undefined;
  this.From_outlet = undefined;
  this.To_outlet = undefined;
  this.Return_reason = undefined;
  if(DocNo.Doc_No){
  this.ObjBrowse.Doc_No = DocNo.Doc_No;
  this.ViewPoppup = true;
   //console.log("this.EditDoc_No ", this.Adv_Order_No );
  this.geteditdetails(this.ObjBrowse.Doc_No);;
  }
 }
 AcceptChallan(DocNo){
  //this.clearData();
  this.Doc_no = undefined;
  this.Doc_date = undefined;
  this.To_Cost_Cent_ID = undefined;
  this.To_Godown_ID = undefined;
  this.From_outlet = undefined;
  this.To_outlet = undefined;
  this.Return_reason = undefined;
  this.FranchiseCostCentId = undefined;
  if(DocNo.Doc_No){
  this.ObjBrowse.Doc_No = DocNo.Doc_No;
  this.FranchiseCostCentId = DocNo.F_Cost_Cen_ID;
  this.AcceptChallanPoppup = true;
  //this.ViewPoppup = true;
   //console.log("this.EditDoc_No ", this.Adv_Order_No );
  this.geteditdetails(this.ObjBrowse.Doc_No);
  this.GetFranchiseBill();
  this.GetFranchiseList();
  this.getsubledgerid();
  }
 }
 changeRemarks(col){
   console.log("Change Remarks")
   this.editList.forEach(el=>{
     if(col.Product_ID === el.Product_ID){
      if(Number(col.Accepted_Qty) === Number(col.Qty)){
        // this.Remarksdisabled = true;
        col.Remarks = "NA";
       } else {
      //   this.Remarksdisabled = false;
        col.Remarks = el.Remarks;
       }
     }

   })
console.log(this.editList)
 }
 edit(DocNo){
  //this.clearData();
  this.Doc_no = undefined;
  this.Doc_date = undefined;
  this.To_Cost_Cent_ID = undefined;
  this.To_Godown_ID = undefined;
  this.From_outlet = undefined;
  this.To_outlet = undefined;
  this.Return_reason = undefined;
  this.FranchiseCostCentId = undefined;
  if(DocNo.Doc_No){
  this.ObjBrowse.Doc_No = DocNo.Doc_No;
  this.FranchiseCostCentId = DocNo.F_Cost_Cen_ID;
  // if(this.router.navigate(['./K4C_Factory_Return'], { queryParams: { Redirect_To : './K4C_Factory_Return' , Create_Flag : true} })){
  // this.tabIndexToView = 1;
  // }
  this.EditPoppup = true;
  //this.ViewPoppup = true;
  //this.tabIndexToView = 1;
   //console.log("this.EditDoc_No ", this.Adv_Order_No );
  this.geteditdetails(this.ObjBrowse.Doc_No);
  this.GetFranchiseBill();
  this.GetFranchiseList();
  this.getsubledgerid();
  }
 }
 geteditdetails(Doc_No){
  //console.log(this.ObjBrowse.Doc_No);
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get Data For Edit Outlet Factory Return",
    "Json_Param_String": JSON.stringify([{Doc_No : this.ObjBrowse.Doc_No}])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.editList = data;
    this.Doc_no = data[0].Doc_No;
    this.Doc_date = new Date(data[0].Doc_Date);
    //  this.To_Cost_Cent_ID = data[0].To_Cost_Cen_Name;
    this.To_Godown_ID = data[0].To_godown_name;
    this.From_outlet = data[0].From_Location;
    this.To_outlet = data[0].From_Location1;
    this.Batchno = data[0].Batch_No;
    this.Return_reason = data[0].Return_Reason;
    this.From_Godown_ID = data[0].F_godown_id;
    this.T_Godown_ID = data[0].To_Godown_ID;
    this.From_cost_cen_ID = data[0].F_Cost_Cen_ID;
    this.To_cost_cen_ID = data[0].To_Cost_Cen_ID;
  //  this.UOM = data[0].UOM,
    //console.log("this.editList  ===",data);     
    if (this.AcceptChallanPoppup) {
    for(let i = 0; i < this.editList.length ; i++){
    if(this.editList[i].Accepted_Qty === 0){
        this.editList[i].Accepted_Qty = this.editList[i].Qty;
        } else {
          this.editList[i].Accepted_Qty = this.editList[i].Accepted_Qty
        }
      }
    }
  })
 }
 getTotal(key){
  let TotalAmt = 0;
  this.editList.forEach((item)=>{
    TotalAmt += Number(item[key]);
  });

  return  TotalAmt.toFixed(2);
}

   // DAY END CHECK
saveCheckUpdate(){
  if(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID && this.Fromgodownid){
    this.ngxService.start();
    this.EditPoppup = false;
    this.AcceptChallanPoppup = false;
    const TempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Godown_Id : this.Fromgodownid
   }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Check_Day_End",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data[0].Status === "Allow"){
        this.update();
      }
      else if(data[0].Status === "Disallow"){    // Disallow
       this.checkSave = false;
       this.EditPoppup = false;
       this.AcceptChallanPoppup = false;
       this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "c",
          sticky: true,
          severity: "error",
          summary: data[0].Message,
          detail: "Confirm to proceed"
        });
        this.productaddSubmit = [];
        this.clearData();
      } else {
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

 }
 update(){
  console.log("save qty",this.saveqty())
  if(this.editList.length){
    this.updateData = [];
    //if(this.AcceptChallanPoppup){
    // this.editList.forEach(el=>{

    //     const updateObj = {
    //       Doc_No : el.Doc_No,
    //       User_ID : el.USER_ID,
    //       Product_ID: el.Product_ID,
    //       Batch_No: el.Batch_No,
    //       Qty: Number(el.Qty),
    //       Accepted_Qty: Number(el.Accepted_Qty2),
    //       Product_Description : el.Product_Description,
    //       Rate : el.Net_Price ? el.Net_Price : 0,
    //       Return_Reason : el.Return_Reason,
    //       Return_Reason_ID : el.Return_Reason_ID,
    //       Material_Type : el.Material_Type,
    //       UOM : el.UOM,
    //       Doc_Date : this.Doc_date,
    //       F_Cost_Cen_ID : this.From_cost_cen_ID,
    //       F_Godown_ID : this.From_Godown_ID,
    //       To_Cost_Cen_ID : this.To_cost_cen_ID,
    //       To_Godown_ID : this.T_Godown_ID,
    //       Fin_Year_ID : this.$CompacctAPI.CompacctCookies.Fin_Year_ID
    //     }
    //     this.updateData.push(updateObj)

    // })
  //}
  //  else {
    this.editList.forEach(el=>{

        const updateObj = {
          Doc_No : el.Doc_No,
          User_ID : el.USER_ID,
          Product_ID: el.Product_ID,
          Batch_No: el.Batch_No,
          Qty: Number(el.Qty),
          Accepted_Qty: Number(el.Accepted_Qty),
          Product_Description : el.Product_Description,
          Rate : el.Net_Price ? el.Net_Price : 0,
          Return_Reason : el.Return_Reason,
          Return_Reason_ID : el.Return_Reason_ID,
          Material_Type : el.Material_Type,
          UOM : el.UOM,
          Doc_Date : el.Doc_Date,
          F_Cost_Cen_ID : this.From_cost_cen_ID,
          F_Godown_ID : this.From_Godown_ID,
          To_Cost_Cen_ID : this.To_cost_cen_ID,
          To_Godown_ID : this.T_Godown_ID,
          Fin_Year_ID : this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
          Remarks : Number(el.Qty) === Number(el.Accepted_Qty) ? 'NA' : el.Remarks ,
          Outlet_Remarks : el.Outlet_Remarks,
          Total_Qty : Number(this.getTotal('Qty')),
          Total_Accepted_Qty : Number(this.getTotal('Accepted_Qty')),

        }
        this.updateData.push(updateObj)

    })
  //}
    if(this.updateData.length){
     // console.log("this.updateData",this.updateData);
      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "Add Outlet Factory Return",
        "Json_Param_String": JSON.stringify(this.updateData)
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.RTFchallanno = data[0].Column1;
        if(data[0].Column1){
          if(this.FranchiseBill != "N" && Number(this.getTotal('Qty')) == Number(this.getTotal('Accepted_Qty'))) {
            this.SaveFranchisechallan();
          }
        this.GetSearchedlist(true);
      this.EditPoppup = false;
      this.AcceptChallanPoppup = false;
      this.ngxService.stop();
     this.compacctToast.clear();
     this.compacctToast.add({
      key: "compacct-toast",
      severity: "success",
      summary: "Doc No. " + data[0].Column1,
      detail: "Updated Succesfully"
    });
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
 getbatchQty(col){
  this.flag = false;
 // console.log("col",col);
  if(col.Qty){
    if(col.Qty <=  col.bln_Qty){
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
  // if(col.Accepted_Qty == col.Qty){
  //    col.Remarks = 'NA';
  // } else {
  //   col.Remarks = col.Remarks;
  // }
 }
 saveqty(){
  let flag = true;
 for(let i = 0; i < this.editList.length ; i++){
  if(Number(this.editList[i].bln_Qty) <  Number(this.editList[i].Qty)){
    flag = false;
    break;
  }
 }
 return flag;
 this.ngxService.stop();
}

 Delete(row){
 // console.log("delete",row)
  this.del_doc_no = undefined;
  if (row.Doc_No) {
   this.del_doc_no = row.Doc_No;
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
  if(this.del_doc_no){
    const TempObj = {
      Doc_No : this.del_doc_no,
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Delete Outlet Factory Return",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log("del Data===", data[0].Column1)
       if (data[0].Column1 === "Done"){
         this.onReject();
         this.GetSearchedlist(true);
         this.compacctToast.clear();
         this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Doc No.: " + this.del_doc_no.toString(),
           detail: "Succesfully Deleted"
         });
         this.clearData();
       }
     })
  }
}

onReject(){
  this.compacctToast.clear("c");
}

 clearData(){
   this.ObjSaveForm.Material_Type = undefined;
  this.ObjProductaddForm = new ProductaddForm();
  //this.ObjSaveForm = new SaveForm();
  this.BatchNo = [];
  this.RFactoryaddFormSubmitted = false;
  this.MTdisabled = false;
  //this.ObjSaveForm.Cost_Cent_ID = this.Cost_Center.length === 1 ? this.Cost_Center[0].Cost_Cent_ID : undefined;
  //this.ObjSaveForm.Godown_ID = this.toGodownList.length ? this.toGodownList[0].godown_id : undefined;
  this.ObjSaveForm.Return_Reason_ID = this.ReturnReasonid.length ? this.ReturnReasonid[0].Return_Reason_ID : undefined;
  //this.ExpiredProductFLag = false;
  //this.getReturnReason("N");
  if(this.ObjSaveForm.Material_Type) {
    this.getselectproduct();
  } else {
    this.ObjSaveForm.Material_Type = undefined;
    this.selectProduct = [];
  }
  this.ngxService.stop();
 }
 clearbutton(){
  this.checkboxdisable = false;
  this.ObjSaveForm.Material_Type = undefined;
  this.ObjProductaddForm = new ProductaddForm();
  //this.ObjSaveForm = new SaveForm();
  this.BatchNo = [];
  this.RFactoryaddFormSubmitted = false;
  this.MTdisabled = false;
  this.productaddSubmit = [];
  //this.ObjSaveForm.Cost_Cent_ID = this.Cost_Center.length === 1 ? this.Cost_Center[0].Cost_Cent_ID : undefined;
  //this.ObjSaveForm.Godown_ID = this.toGodownList.length ? this.toGodownList[0].godown_id : undefined;
  this.ObjSaveForm.Return_Reason_ID = this.ReturnReasonid.length ? this.ReturnReasonid[0].Return_Reason_ID : undefined;
  this.ExpiredProductFLag = false;
  this.getReturnReason("N");
  if(this.ObjSaveForm.Material_Type) {
    this.getselectproduct();
  } else {
    this.ObjSaveForm.Material_Type = undefined;
    this.selectProduct = [];
  }
  this.ngxService.stop();
 }

 // SAVE FRANCHISE
 SaveFranchisechallan(){
 // if (this.dispatchchallanno){
  const Obj = {
    Doc_No : this.Doc_no,
    Cost_Cen_ID : this.From_cost_cen_ID ? this.From_cost_cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    From_Date : this.DateService.dateConvert(new Date(this.myDate)),
    To_Date :  this.DateService.dateConvert(new Date(this.myDate))
  }
     const obj = {
       "SP_String": "SP_K4C_Accounting_Journal",
       "Report_Name_String" : "Product Rate Update In RTF Table",
       "Json_Param_String": JSON.stringify([Obj])
     }
     this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      this.FranchiseProductList = data;
      console.log("this.FranchiseProductList======",this.FranchiseProductList);
      if (this.FranchiseProductList.length) {
        this.calculateTotalAmt();
        this.SaveFranSaleBill();
      }
     })
   
  //  }
  }
  GetFranchiseBill(){
    const tempObj = {
      Cost_Cen_ID : this.FranchiseCostCentId
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Franchise Or not",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Franchise = data;
      this.FranchiseBill = data[0].Franchise;
      console.log("this.FranchiseList ===", this.FranchiseList)
      // this.FranchiseList.forEach(item => {
      //   item.Cost_Cen_ID = this.ObjfranchiseSalebill.Cost_Cen_ID
      // });
     })
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
   if(this.FranchiseCostCentId) {
    const ctrl = this;
    const subledgeridObj = $.grep(ctrl.FranchiseList,function(item: any) {return item.Cost_Cen_ID == ctrl.FranchiseCostCentId})[0];
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
       // if(item.Issue_Qty && Number(item.Issue_Qty) != 0) {
     const TempObj = {
            Doc_No:  "A",
            Doc_Date: this.currentDate,
            Sub_Ledger_ID : Number(this.subledgerid),
            Cost_Cen_ID	: 2, //this.franchisecostcenid,
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
            HSL_No : item.HSN_NO
         }
      tempArr.push(TempObj)
      });
      console.log("Save Data ===", tempArr)
      return JSON.stringify(tempArr);

    }
  }
  SaveFranSaleBill(){
    const obj = {
      "SP_String" : "SP_K4C_Accounting_Journal",
      "Report_Name_String" : "Credit_Note_RTF",
      "Json_Param_String" : this.getdataforSaveFranchise(),
      "Json_1_String" : JSON.stringify([{Order_No : this.RTFchallanno}])

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
       this.clearData();
       this.GetSearchedlist(true);
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
 // console.log("CR_No ===", true)
  if (obj.CR_No) {
    window.open("/Report/Crystal_Files/Finance/SaleBill/Sale_Bill_GST_K4C.aspx?Doc_No=" + obj.CR_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
  }
}


}
class SaveForm{
  Cost_Cent_ID : string;
  Godown_ID : string;
  Doc_Date : string;
  Return_Reason_ID : any;
  Return_Reason : string;
  Material_Type : string;
}

class ProductaddForm{
  selectProduct : string;
  Product_ID : string;
  Batch_No : any;
  Modifier : string;
  Product_Description : string;
  //Sale_rate : number;
  Net_Price : number;
  Stock_Qty : number;
  Avl_Qty : number;
  Remarks : string;
}

class Browse {
  start_date : Date ;
  end_date : Date;
  Doc_No : string;
  Material_Type : string;
}
