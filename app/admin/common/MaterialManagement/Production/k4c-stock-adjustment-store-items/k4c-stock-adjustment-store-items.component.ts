import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';

@Component({
  selector: 'app-k4c-stock-adjustment-store-items',
  templateUrl: './k4c-stock-adjustment-store-items.component.html',
  styleUrls: ['./k4c-stock-adjustment-store-items.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cStockAdjustmentStoreItemsComponent implements OnInit {
  Remark :any;
  ExDateTime:any;
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save"
  ObjStockAdStoreItems : StockAdStoreItems = new StockAdStoreItems ();
  BrandList = [];
  CostCenter = [];
  costcentdisableflag = false;
  GodownId = [];
  godowndisableflag = false;
  ProductList = [];
  StockAdjStoreItemsFormSubmitted = false;
  productaddSubmit = [];
  myDate : Date;
  Expiry_Time : any;
  ObjBrowse : Browse  = new Browse();
  SearchFormSubmitted = false;
  Searchedlist = [];
  ExpdatimelistWrtBatch: any;
  BrandDisable = false;
  Batchflag = false;
  Doc_No = undefined;
  ViewList = [];
  ViewPoppup = false;
  Doc_date = undefined;
  Cost_Cent_ID = undefined;
  Godown_ID = undefined;
  BrandId = undefined;
  remarks = undefined;
  dateList: any;

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
      Header: "Receive Stock Adjustment (Store Items)",
      Link: "Material Management -> Stock Adjustment (Store Items)"
    });
    this.getbilldate();
    this.GetBrand();
    this.getCostCenter();
    //this.GetProduct();
  }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
//   GetBrand(){
//     console.log("Brand ===", this.BrandList)
//       this.BrandList =[
//         {value : "1" , Name : "C4C"},
//         {value : "2" , Name : "K4C"},
//         {value : "Without Brand" , Name : "Without Brand"}
//       ];
// }
getbilldate(){
  const obj = {
   "SP_String": "SP_Controller_Master",
   "Report_Name_String": "Get - Outlet Bill Date",
   //"Json_Param_String": JSON.stringify([{Doc_Type : "Sale_Bill"}])

 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.dateList = data;
 //console.log("this.dateList  ===",this.dateList);
  this.myDate =  new Date(data[0].Outlet_Bill_Date);
 // on save use this
// this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));

})
}
  GetBrand(){
    this.BrandList = [];
    if(this.$CompacctAPI.CompacctCookies.User_Type != "A"){
      const obj = {
        "SP_String": "SP_Issue_Stock_Adjustment",
        "Report_Name_String": "GET_Brand_For_Outlet",
        "Json_Param_String": JSON.stringify([{Cost_Cent_ID:this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.BrandList = data;
        this.ObjStockAdStoreItems.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
        this.ObjBrowse.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
        //this.ObjIssueStockAd.Brand_ID = data[0].Brand_INI;
        this.BrandDisable = true;
        this.GetProduct();
         console.log("Brand List ===",this.BrandList);
      })
    } else {
    const obj = {
      "SP_String": "SP_Issue_Stock_Adjustment",
      "Report_Name_String": "Get - Brand"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrandList = data;
      //this.Objproduction.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.BrandDisable = false;
       //console.log("Brand List ===",this.BrandList);
    })
  }
  }
  
  getCostCenter(){
    this.ObjStockAdStoreItems.Cost_Cen_ID = undefined;
  //   if (this.ObjStockAdStoreItems.Brand_ID ==='Without Brand') {
  //   const obj = {
  //     "SP_String": "SP_Controller_Master",
  //     "Report_Name_String": "Get - Cost Center Name All",
  //     "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
  //     //"Json_Param_String": JSON.stringify([{User_ID : 61}])
  //    }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //    this.CostCenter = data;
  //   // if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
  //    //this.ObjBrowseStockView.Outlet = this.Outletid.length === 1 ? this.Outletid[0].Cost_Cen_ID : undefined;
  //   // this.ObjStockAdStoreItems.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  //   // this.costcentdisableflag = true;
  //    this.getGodown();
  //    this.GetProduct();
  //   //  } else {
  //   //   this.ObjStockAdStoreItems.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  //   //   this.costcentdisableflag = false;
  //   //   this.getGodown();
  //   //   this.GetProduct();
  //   //  }
  //     console.log("this.Outletid ======",this.CostCenter);

  //   });
  // } else {
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Outlet For Distribution",
      "Json_Param_String": JSON.stringify([{Brand_ID : this.ObjStockAdStoreItems.Brand_ID}])
     // "Json_Param_String": JSON.stringify([{User_ID : 61}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("costcenterList  ===",data);
      this.CostCenter = data;
     if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
      //  this.ObjBrowseStockView.Outlet = this.Outletid.length === 1 ? this.Outletid[0].Cost_Cen_ID : undefined;
      // this.ObjStockAdStoreItems.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
       this.costcentdisableflag = true;
        this.getGodown();
        this.GetProduct();
         } else {
        // this.ObjStockAdStoreItems.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
         this.costcentdisableflag = false;
         this.getGodown();
         this.GetProduct();
        }
         console.log("this.Outletid ======",this.CostCenter);
         });
 // }
  }
  getGodown(){
    const obj = {
      "SP_String": "SP_Issue_Stock_Adjustment",
      "Report_Name_String": "GET_Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cent_ID :this.ObjStockAdStoreItems.Cost_Cen_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.GodownId = data;
     this.ObjStockAdStoreItems.godown_id = this.GodownId.length === 1 ? this.GodownId[0].godown_id : undefined;
     if(this.GodownId.length === 1){
       this.godowndisableflag = true;
     }else{
       this.godowndisableflag = false;
     }
      console.log("this.GodownId ======",this.GodownId);

    });
  }
  GetProduct(){
    this.ProductList = [];
    let Brand;
       if(this.ObjStockAdStoreItems.Brand_ID ==='Without Brand') {
        Brand = 0;
       } else {
        Brand = this.ObjStockAdStoreItems.Brand_ID;
       }
    const TempObj = {
      Brand_ID : Brand,
      // From_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      // From_godown_id : this.ObjStockAdStoreItems.godown_id,
      // Product_Type_ID : 0
     }
     const obj = {
      "SP_String": "SP_Issue_Stock_Adjustment",
      "Report_Name_String": "GET_Products_For_Rcv_Store_Items",
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
   if(this.ObjStockAdStoreItems.Product_ID) {
     const ctrl = this;
     const productObj = $.grep(ctrl.ProductList,function(item) {return item.Product_ID == ctrl.ObjStockAdStoreItems.Product_ID})[0];
     //console.log(productObj);
     this.ObjStockAdStoreItems.Product_Type_ID = productObj.Product_Type_ID,
     this.ObjStockAdStoreItems.Product_Description = productObj.Product_Description;
     this.ObjStockAdStoreItems.Exp_Date_Time =  productObj.Exp_Date_Time;
     this.ObjStockAdStoreItems.UOM = productObj.UOM;
    // //this.ObjaddbillForm.Stock_Qty = productObj.Stock_Qty;
    }
  }
  GetExpDateTimewWrtBatch(){
    this.Batchflag = false;
    this.StockAdjStoreItemsFormSubmitted = false;
    const tempobj = {
      From_Cost_Cen_ID : this.ObjStockAdStoreItems.Cost_Cen_ID,
      From_godown_id : this.ObjStockAdStoreItems.godown_id,
      Product_Id : this.ObjStockAdStoreItems.Product_ID,
      Batch_No : this.ObjStockAdStoreItems.Batch_No
    }
    const obj = {
      "SP_String": "SP_Issue_Stock_Adjustment",
      "Report_Name_String": "Get_expire_Date_time_Respect_to_Batch_store_item",
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
      summary: "Batch not found in Purchase challan! Want to create?",
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
  this.StockAdjStoreItemsFormSubmitted = true;
  if(valid && this.checksameBatchno()){
    //console.log(this.ObjproductAdd.Batch_No)
    //var RR = this.ReturnReasonid.find(Return_Reason => Return_Reason.Return_Reason_ID == this.ObjProductaddForm.Return_Reason_ID);
  var productObj = {
    Product_Type_ID : this.ObjStockAdStoreItems.Product_Type_ID,
    Product_ID : this.ObjStockAdStoreItems.Product_ID,
    Product_Description : this.ObjStockAdStoreItems.Product_Description,
    Batch_No : this.ObjStockAdStoreItems.Batch_No,
    Exp_Date_Time : this.DateService.dateTimeConvert(new Date(this.Expiry_Time)),
    Rcv_Qty  :  this.ObjStockAdStoreItems.Rcv_Qty ,
   // UOM : this.ObjReceiveStockAd.UOM
  };
  this.productaddSubmit.push(productObj);
  console.log("Product Submit",this.productaddSubmit);
  this.StockAdjStoreItemsFormSubmitted = false;
  // this.ObjproductAdd = new productAdd();
  // this.ProductList = [];
  this.ObjStockAdStoreItems.Product_ID = undefined;
   this.ObjStockAdStoreItems.Batch_No = [];
  // this.ObjReceiveStockAd.Exp_Date_Time = [];
   this.Expiry_Time = [];
   this.ObjStockAdStoreItems.Rcv_Qty  = [];
  // this.ObjReceiveStockAd.Batch_Qty = undefined;
  }
  }
  delete(index) {
    this.productaddSubmit.splice(index,1)

  }
  checksameBatchno () {
    const sameproductwithbatch = this.productaddSubmit.filter(item=> item.Batch_No === this.ObjStockAdStoreItems.Batch_No && item.Product_ID === this.ObjStockAdStoreItems.Product_ID );
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
        Doc_Date : this.DateService.dateConvert(new Date(this.myDate)),
        Cost_Cen_ID	: this.ObjStockAdStoreItems.Cost_Cen_ID,
        godown_id	: this.ObjStockAdStoreItems.godown_id,
        Narration	: this.ObjStockAdStoreItems.Remarks ? this.ObjStockAdStoreItems.Remarks : null,
        User_ID	: this.$CompacctAPI.CompacctCookies.User_ID,
        Process_ID : 100,
        Brand_ID : this.ObjStockAdStoreItems.Brand_ID,
        UOM : this.ObjStockAdStoreItems.UOM,
      }
      this.productaddSubmit.forEach(item => {
        //if(item.Issue_Qty) {
          const obj = {
            Product_Type_ID : item.Product_Type_ID,
            Product_ID : item.Product_ID,
            Product_Description : item.Product_Description,
            Rcv_Qty	: item.Rcv_Qty,
            Rate : 0,
           // UOM	: item.UOM,
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
        "SP_String": "SP_Issue_Stock_Adjustment",
        "Report_Name_String" : "Save_Receive_Stock_Movement_Store_Items",
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
  "SP_String": "SP_Issue_Stock_Adjustment",
  "Report_Name_String": "Browse_Receive_Stock_Adjustment_Store_Item",
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
      "SP_String": "SP_Issue_Stock_Adjustment",
      "Report_Name_String": "Get_Data_Rcv_Stock_Adjustment_Store_Item",
      "Json_Param_String": JSON.stringify([{Doc_No : this.Doc_No}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ViewList = data;
       this.Doc_No = data[0].Doc_No;
       this.Doc_date = new Date(data[0].Doc_Date);
       this.BrandId = data[0].Brand_Name;
       this.Cost_Cent_ID = data[0].Location;
       this.Godown_ID = data[0].godown_name;
       this.remarks = data[0].Narration;
      // this.To_outlet = data[0].From_Location1;
      // this.Batchno = data[0].Batch_No;
      // this.Return_reason = data[0].Return_Reason;
      console.log("this.Viewlist  ===",this.ViewList);

      this.ViewPoppup = true;
    })
  }
  clearData(){
    if(this.$CompacctAPI.CompacctCookies.User_Type != "A"){
      this.ObjStockAdStoreItems.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.ObjBrowse.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.BrandDisable = true;
    } else {
       this.ObjBrowse.Brand_ID = undefined;
       this.ObjStockAdStoreItems.Brand_ID = undefined;
       this.BrandDisable = false;
       this.ProductList = [];
     }
    this.Searchedlist = [];
    this.ObjStockAdStoreItems.Cost_Cen_ID = undefined;
    this.getGodown();
    this.ObjStockAdStoreItems.Remarks = [];
    //this.ProductList = [];
    this.productaddSubmit = [];
    this.ObjStockAdStoreItems.Batch_No = undefined;
    this.Expiry_Time = undefined;
    this.ObjStockAdStoreItems.Rcv_Qty = undefined;
    this.ObjStockAdStoreItems.Product_ID = undefined;
    this.StockAdjStoreItemsFormSubmitted = false;
  //  this.ObjReceiveStockAd.Batch_Qty = undefined;
    this.getbilldate();
  }

}
class StockAdStoreItems {
  Brand_ID : string;
  Cost_Cen_ID : string;
  godown_id : string;
  Remarks : any;
  Product_Type_ID : number;
  Product_ID : number;
  Product_Description : string;
  Exp_Date_Time : any;
  Rcv_Qty  : any;
  Batch_No : any;
  Receive_Qty : number;
  UOM : string;
 // Batch_Qty : number;
 }
 class Browse {
  start_date : Date ;
  end_date : Date;
  Brand_ID : string;
}
