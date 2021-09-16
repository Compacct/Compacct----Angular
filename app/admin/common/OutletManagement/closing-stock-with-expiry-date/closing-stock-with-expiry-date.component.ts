import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';

@Component({
  selector: 'app-closing-stock-with-expiry-date',
  templateUrl: './closing-stock-with-expiry-date.component.html',
  styleUrls: ['./closing-stock-with-expiry-date.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ClosingStockWithExpiryDateComponent implements OnInit {
  ExDateTime:any;
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save"
  ObjClosingStockExpAd : ClosingStockExpAd = new ClosingStockExpAd ();
  closingstockExpFormSubmitted = false;
  BrandList = [];
  BrandDisable = false;
  ProductList = [];
  Batchflag = false;
  ExpdatimelistWrtBatch = [];
  Expiry_Time: any;
  productaddSubmit = [];
  ObjBrowse : Browse  = new Browse();
  SearchFormSubmitted = false;
  ClosingDate = new Date();
  AddDisable = false;
  expirydateDisable = true;
  Searchedlist = [];
  Doc_No = undefined;
  ViewList = [];
  ViewPoppup = false;
  Doc_date = undefined;
  Cost_Cent_ID = undefined;
  BrandId = undefined;
  remarks = undefined;
  CostCenter = [];
  GodownId = [];

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Closing Stock With Expiry",
      Link: "Material Management -> Closing Stock With Expiry"
    });
    this.GetBrand();
    this.getCostCenter();
  }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  GetBrand(){
    this.BrandList = [];
    const obj = {
      "SP_String": "SP_Closing_Stock_With_Expiry_Date",
      "Report_Name_String": "Get - Brand"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrandList = data;
      //this.ObjUpdateExpAd.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.BrandDisable = false;
       //console.log("Brand List ===",this.BrandList);
    })
  }
  getCostCenter(){
    const obj = {
      "SP_String": "SP_Closing_Stock_With_Expiry_Date",
      "Report_Name_String": "GET_Cost_Cent_Name"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.CostCenter = data;
    // if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
     //this.ObjBrowseStockView.Outlet = this.Outletid.length === 1 ? this.Outletid[0].Cost_Cen_ID : undefined;
     this.ObjClosingStockExpAd.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    //  this.costcentdisableflag = true;
      this.getGodown();
    //  } else {
    //   this.ObjClosingStockExpAd.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    //   this.costcentdisableflag = false;
    //   this.getGodown();
    //  }
      console.log("this.Outletid ======",this.CostCenter);

    });
  }
  getGodown(){
    const obj = {
      "SP_String": "SP_Closing_Stock_With_Expiry_Date",
      "Report_Name_String": "GET_Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cent_ID :this.ObjClosingStockExpAd.Cost_Cen_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.GodownId = data;
     this.ObjClosingStockExpAd.godown_id = this.GodownId.length === 1 ? this.GodownId[0].godown_id : undefined;
    //  if(this.GodownId.length === 1){
    //    this.godowndisableflag = true;
    //  }else{
    //    this.godowndisableflag = false;
    //  }
      console.log("this.GodownId ======",this.GodownId);

    });
  }
  GetProduct(){
    this.ProductList = [];
    const TempObj = {
      Brand_ID : this.ObjClosingStockExpAd.Brand_ID,
      Product_Type_ID : 0
     }
     const obj = {
      "SP_String": "SP_Closing_Stock_With_Expiry_Date",
      "Report_Name_String": "GET_Products",
     "Json_Param_String": JSON.stringify([TempObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Description,
          element['value'] = element.Product_ID
        });
        this.ProductList = data;
      } else {
        this.ProductList = [];

      }
      console.log("select Product======",this.ProductList);


    });
  }
  ProductChange() {
    if(this.ObjClosingStockExpAd.Product_ID) {
      const ctrl = this;
      const productObj = $.grep(ctrl.ProductList,function(item) {return item.Product_ID == ctrl.ObjClosingStockExpAd.Product_ID})[0];
      //console.log(productObj);
      this.ObjClosingStockExpAd.Product_Type_ID = productObj.Product_Type_ID,
      this.ObjClosingStockExpAd.Product_Description = productObj.Product_Description;
      this.ObjClosingStockExpAd.Exp_Date_Time =  productObj.Exp_Date_Time;
      this.ObjClosingStockExpAd.UOM = productObj.UOM;
     // //this.ObjaddbillForm.Stock_Qty = productObj.Stock_Qty;
     }
  }
  GetExpDateTimewWrtBatch(){
    this.Batchflag = false;
    this.closingstockExpFormSubmitted = false;
    const tempobj = {
      // From_Cost_Cen_ID : this.ObjUpdateExpAd.Cost_Cen_ID,
      // From_godown_id : this.ObjUpdateExpAd.godown_id,
      Product_Id : this.ObjClosingStockExpAd.Product_ID,
      Batch_No : this.ObjClosingStockExpAd.Batch_No
    }
    const obj = {
      "SP_String": "SP_Closing_Stock_With_Expiry_Date",
      "Report_Name_String": "Get_expire_Date_time_Respect_to_Batch",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ExpdatimelistWrtBatch = data;
       console.log('Exp date time list=====',this.ExpdatimelistWrtBatch)
       this.Expiry_Time = data[0].Expiry_Date;
      // this.ObjReceiveStockAd.Batch_Qty = data[0].Qty;

      //const noexpirydate = this.ExpdatimelistWrtBatch.filter(item=> item.Column1 === "Not Found" );
      //if(noexpirydate.length) {
      //if(this.ExpdatimelistWrtBatch = []){
      if(data[0].Column1 === "Not Found") {
      this.compacctToast.clear();
      this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Batch not found in Production! Want to create?",
      detail: "Confirm to proceed"
      });
      }
      })
  }
  onConfirm() {
    this.Batchflag = true;
    this.compacctToast.clear("c");
  }
  onReject() {
    this.Batchflag = false;
    this.compacctToast.clear("c");
  }
  AddProduct(valid){
    //console.log('add ===', valid)
  this.closingstockExpFormSubmitted = true;
  if(valid && this.checksameBatchno()){
    //console.log(this.ObjproductAdd.Batch_No)
    //var RR = this.ReturnReasonid.find(Return_Reason => Return_Reason.Return_Reason_ID == this.ObjProductaddForm.Return_Reason_ID);
  var productObj = {
    Product_Type_ID : this.ObjClosingStockExpAd.Product_Type_ID,
    Product_ID : this.ObjClosingStockExpAd.Product_ID,
    Product_Description : this.ObjClosingStockExpAd.Product_Description,
    Batch_No : this.ObjClosingStockExpAd.Batch_No,
    Exp_Date_Time : this.DateService.dateTimeConvert(new Date(this.Expiry_Time)),
    Rcv_Qty  :  this.ObjClosingStockExpAd.Rcv_Qty ,
    UOM : this.ObjClosingStockExpAd.UOM
  };
  this.productaddSubmit.push(productObj);
  console.log("Product Submit",this.productaddSubmit);
  this.closingstockExpFormSubmitted = false;
  this.AddDisable = true;
  this.expirydateDisable = false;
  // this.ObjClosingStockExpAd = new productAdd();
  // this.ProductList = [];
  this.ObjClosingStockExpAd.Product_ID = undefined;
   this.ObjClosingStockExpAd.Batch_No = [];
  // this.ObjClosingStockExpAd.Exp_Date_Time = [];
   this.Expiry_Time = [];
   this.ObjClosingStockExpAd.Rcv_Qty  = [];
  // this.ObjClosingStockExpAd.Batch_Qty = undefined;
  }
  }
  delete(index) {
    this.productaddSubmit.splice(index,1)
    this.clearData();
  }
  checksameBatchno () {
    const sameproductwithbatch = this.productaddSubmit.filter(item=> item.Batch_No === this.ObjClosingStockExpAd.Batch_No && item.Product_ID === this.ObjClosingStockExpAd.Product_ID );
    if(sameproductwithbatch.length) {
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Can't use product with same batch no."
          });
      return false;
    }
      const noexpirydate = this.ExpdatimelistWrtBatch.filter(item=> item.Column1 === "Not Found" );
      if(noexpirydate.length && !this.Batchflag) {
      //if(this.ExpdatimelistWrtBatch = []){
        this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Invalid Batch No."
            });
        return false;
      }
      // const baychqtyarr = this.Batch_NO.filter(item=> item.Batch_NO === this.ObjaddbillForm.Batch_No);
      // if(baychqtyarr.length) {
      // if(this.ObjaddbillForm.Stock_Qty <=  baychqtyarr[0].Qty) {
      //   return true;
      // } else {
      //   this.compacctToast.clear();
      //   this.compacctToast.add({
      //     key: "compacct-toast",
      //     severity: "error",
      //     summary: "Warn Message",
      //     detail: "Quantity can't be more than in batch available quantity "
      //   });
      //   return false;
      // }
        else {
          return true;
        }
    }
  GetDataForSave(){
      if(this.productaddSubmit.length) {
        let tempArr =[];
        const TempObj = {
          Doc_No : "A",
          Doc_Date : this.DateService.dateConvert(new Date(this.ClosingDate)),
          Cost_Cen_ID	: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
          godown_id : this.ObjClosingStockExpAd.godown_id,
          User_ID	: this.$CompacctAPI.CompacctCookies.User_ID,
          Process_ID : 100,
          Brand_ID : this.ObjClosingStockExpAd.Brand_ID,
          Narration : 'NA'
        }
        this.productaddSubmit.forEach(item => {
          //if(item.Issue_Qty) {
            const obj = {
              Product_Type_ID : item.Product_Type_ID,
              Product_ID : item.Product_ID,
              Product_Description : item.Product_Description,
              Rcv_Qty	: item.Rcv_Qty,
              Rate : 0,
              UOM	: item.UOM,
              Batch_No : item.Batch_No,
              Expiry_Date : item.Exp_Date_Time,
              Shift_ID :  item.Batch_No.split('-').pop()
           }
  
           tempArr.push({...TempObj,...obj})
          //}
  
        });
        console.log("Save Data ===", ...tempArr)
        return JSON.stringify(tempArr);
  
      }
  }
  SaveReceiveStock(){
    //if(valid){
      const obj = {
        "SP_String": "SP_Closing_Stock_With_Expiry_Date",
        "Report_Name_String" : "Save_Closing_Stock_With_Expiry_Date",
       "Json_Param_String": this.GetDataForSave()

      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        //console.log(data);
        var tempID = data[0].Column1;
       // this.Objproduction.Doc_No = data[0].Column1;
        if(data[0].Column1){
          this.compacctToast.clear();
        //  const mgs = this.buttonname === "Save & Print" ? "Saved" : "Updated";
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Doc_No  " + tempID,
           detail: "Succesfully  Saved" //+ mgs
         });
        //  if (this.buttonname == "Save & Print") {
        //  this.saveNprintProVoucher();
        //  }
         this.clearData();
        // this.IssueStockFormSubmitted = false;

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
    //}
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  GetSearchedList(valid){
    this.SearchFormSubmitted = true;
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
  Brand_ID : this.ObjBrowse.Brand_ID,
  //Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
}
const obj = {
  "SP_String": "SP_Closing_Stock_With_Expiry_Date",
  "Report_Name_String": "Browse_Closing_Stock_With_Expiry_Date",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
   this.SearchFormSubmitted = false;
  })
  }
  }
  View(DocNo){
    this.Doc_No = undefined;
    if(DocNo.Doc_No){
    this.Doc_No = DocNo.Doc_No;
    // this.AuthPoppup = true;
    //this.ViewPoppup = true;
    //this.tabIndexToView = 1;
     //console.log("this.EditDoc_No ", this.Adv_Order_No );
    this.getdataforview(this.Doc_No);;
    }
  }
  getdataforview(DocNo){
    this.ViewList = [];
    const obj = {
      "SP_String": "SP_Closing_Stock_With_Expiry_Date",
      "Report_Name_String": "Get_Data_Closing_Stock_With_Expiry_Date",
      "Json_Param_String": JSON.stringify([{Doc_No : this.Doc_No}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ViewList = data;
       this.Doc_No = data[0].Doc_No;
       this.Doc_date = new Date(data[0].Doc_Date);
       this.BrandId = data[0].Brand_Name;
       this.Cost_Cent_ID = data[0].Location;
      // this.remarks = data[0].Narration
      console.log("this.Viewlist  ===",this.ViewList);

      this.ViewPoppup = true;
    })
  }
  clearData(){
    //this.ObjBrowse.Brand_ID = undefined;
    this.ClosingDate = new Date;
    this.ObjClosingStockExpAd.Brand_ID = undefined;
    this.ObjClosingStockExpAd.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.ObjClosingStockExpAd.godown_id = undefined;
    this.ObjClosingStockExpAd.Product_ID = undefined;
    this.ObjClosingStockExpAd.Batch_No = [];
  // this.ObjClosingStockExpAd.Exp_Date_Time = [];
    this.Expiry_Time = [];
    this.ObjClosingStockExpAd.Rcv_Qty  = [];
    this.ObjClosingStockExpAd.Remarks = undefined;
      // this.BrandDisable = false;
    this.ProductList = [];
    this.productaddSubmit = [];
    this.AddDisable = false;
    this.expirydateDisable = true;
  }

}
class ClosingStockExpAd {
  Brand_ID : string;
  Product_Type_ID : number;
  Product_ID : number;
  Product_Description : string;
  Exp_Date_Time : any;
  Rcv_Qty  : any;
  Batch_No : any;
  Receive_Qty : number;
  UOM : string;
 // Batch_Qty : number;
  Cost_Cen_ID : any;
  godown_id : any;
  Remarks : string;
 }
 class Browse {
  start_date : Date ;
  end_date : Date;
  Brand_ID : string;
}
