import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';

@Component({
  selector: 'app-update-expiry',
  templateUrl: './update-expiry.component.html',
  styleUrls: ['./update-expiry.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class UpdateExpiryComponent implements OnInit {
  ExDateTime:any;
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save"
  ObjUpdateExpAd : UpdateExpAd = new UpdateExpAd ();
  UpdateExpFormSubmitted = false;
  BrandList = [];
  BrandDisable = false;
  ProductList = [];
  Batchflag = false;
  ExpdatimelistWrtBatch = [];
  Expiry_Time: any;
  productaddSubmit = [];
  ObjBrowse : Browse  = new Browse();
  SearchFormSubmitted = false;
  CurrentDate = new Date();
  AddDisable = false;
  expirydateDisable = true;
  Searchedlist = [];
  Doc_No = undefined;
  ViewList = [];
  ViewPoppup = false;
  Doc_date = undefined;
  Cost_Cent_ID = undefined;
  BrandId = undefined;
  //remarks = undefined;

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
      Header: "Update Expiry",
      Link: "Material Management -> Update Expiry"
    });
    this.GetBrand();
  }
  TabClick(e){
    //console.log(e)
    //this.tabIndexToView = e.index;
    //this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  GetBrand(){
    this.BrandList = [];
    const obj = {
      "SP_String": "SP_Update_Expiry_Adjustment",
      "Report_Name_String": "Get - Brand"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrandList = data;
      //this.ObjUpdateExpAd.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.BrandDisable = false;
       //console.log("Brand List ===",this.BrandList);
    })
  }
  GetProduct(){
    this.ProductList = [];
    const TempObj = {
      Brand_ID : this.ObjUpdateExpAd.Brand_ID,
      Product_Type_ID : 0
     }
     const obj = {
      "SP_String": "SP_Update_Expiry_Adjustment",
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
    if(this.ObjUpdateExpAd.Product_ID) {
      const ctrl = this;
      const productObj = $.grep(ctrl.ProductList,function(item) {return item.Product_ID == ctrl.ObjUpdateExpAd.Product_ID})[0];
      //console.log(productObj);
      this.ObjUpdateExpAd.Product_Type_ID = productObj.Product_Type_ID,
      this.ObjUpdateExpAd.Product_Description = productObj.Product_Description;
      this.ObjUpdateExpAd.Exp_Date_Time =  productObj.Exp_Date_Time;
      this.ObjUpdateExpAd.UOM = productObj.UOM;
     // //this.ObjaddbillForm.Stock_Qty = productObj.Stock_Qty;
     }
  }
  GetExpDateTimewWrtBatch(){
    this.Batchflag = false;
    this.UpdateExpFormSubmitted = false;
    const tempobj = {
      // From_Cost_Cen_ID : this.ObjUpdateExpAd.Cost_Cen_ID,
      // From_godown_id : this.ObjUpdateExpAd.godown_id,
      Product_Id : this.ObjUpdateExpAd.Product_ID,
      Batch_No : this.ObjUpdateExpAd.Batch_No
    }
    const obj = {
      "SP_String": "SP_Update_Expiry_Adjustment",
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
  this.UpdateExpFormSubmitted = true;
  if(valid && this.checksameBatchno()){
    //console.log(this.ObjproductAdd.Batch_No)
    //var RR = this.ReturnReasonid.find(Return_Reason => Return_Reason.Return_Reason_ID == this.ObjProductaddForm.Return_Reason_ID);
  var productObj = {
    Product_Type_ID : this.ObjUpdateExpAd.Product_Type_ID,
    Product_ID : this.ObjUpdateExpAd.Product_ID,
    Product_Description : this.ObjUpdateExpAd.Product_Description,
    Batch_No : this.ObjUpdateExpAd.Batch_No,
    Exp_Date_Time : this.DateService.dateTimeConvert(new Date(this.Expiry_Time)),
    Rcv_Qty  :  this.ObjUpdateExpAd.Rcv_Qty ,
    UOM : this.ObjUpdateExpAd.UOM
  };
  this.productaddSubmit.push(productObj);
  console.log("Product Submit",this.productaddSubmit);
  this.UpdateExpFormSubmitted = false;
  this.AddDisable = true;
  this.expirydateDisable = false;
  // this.ObjproductAdd = new productAdd();
  // this.ProductList = [];
  this.ObjUpdateExpAd.Product_ID = undefined;
   this.ObjUpdateExpAd.Batch_No = [];
  // this.ObjReceiveStockAd.Exp_Date_Time = [];
   this.Expiry_Time = [];
   this.ObjUpdateExpAd.Rcv_Qty  = [];
  // this.ObjReceiveStockAd.Batch_Qty = undefined;
  }
  }
  delete(index) {
    this.productaddSubmit.splice(index,1)
    this.clearData();
  }
  checksameBatchno () {
    const sameproductwithbatch = this.productaddSubmit.filter(item=> item.Batch_No === this.ObjUpdateExpAd.Batch_No && item.Product_ID === this.ObjUpdateExpAd.Product_ID );
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
      //if(this.productaddSubmit.length) {
        //let tempArr =[];
        const TempObj = {
          // Doc_No : "A",
          // Doc_Date : this.DateService.dateConvert(new Date(this.CurrentDate)),
          // Cost_Cen_ID	: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
          // User_ID	: this.$CompacctAPI.CompacctCookies.User_ID,
          // Process_ID : 100,
          Brand_ID : this.ObjUpdateExpAd.Brand_ID,
         // Narration : 'NA',

         // Product_Type_ID : this.ObjUpdateExpAd.Product_Type_ID,
          Product_ID : this.ObjUpdateExpAd.Product_ID,
          Product_Description : this.ObjUpdateExpAd.Product_Description,
          //Rcv_Qty	: item.Rcv_Qty,
         // Rate : 0,
         // UOM	: this.ObjUpdateExpAd.UOM,
          Batch_No : this.ObjUpdateExpAd.Batch_No,
          Expiry_Date : this.DateService.dateTimeConvert(new Date(this.Expiry_Time)),
        //  Shift_ID :  this.ObjUpdateExpAd.Batch_No.split('-').pop()
        }
        // this.productaddSubmit.forEach(item => {
        //   //if(item.Issue_Qty) {
        //     const obj = {
        //       Product_Type_ID : item.Product_Type_ID,
        //       Product_ID : item.Product_ID,
        //       Product_Description : item.Product_Description,
        //       Rcv_Qty	: item.Rcv_Qty,
        //       Rate : 0,
        //       UOM	: item.UOM,
        //       Batch_No : item.Batch_No,
        //       Expiry_Date : item.Exp_Date_Time,
        //       Shift_ID :  item.Batch_No.split('-').pop()
        //    }
  
          // tempArr.push({...TempObj,...obj})
          // tempArr.push({TempObj})
          //}
  
       // });
        console.log("Save Data ===", TempObj)
        return JSON.stringify(TempObj);
  
     // }
  }
  SaveReceiveStock(valid){
    this.UpdateExpFormSubmitted = true;
    if(valid && this.checksameBatchno()){
      const obj = {
        "SP_String": "SP_Update_Expiry_Adjustment",
        "Report_Name_String" : "Save_Update_Expiry_Adjustment",
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
           summary:  tempID,
           detail: "Succesfully  Updated" //+ mgs
         });
        //  if (this.buttonname == "Save & Print") {
        //  this.saveNprintProVoucher();
        // }
         this.clearData();
         this.UpdateExpFormSubmitted = false;

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
  "SP_String": "SP_Update_Expiry_Adjustment",
  "Report_Name_String": "Browse_Update_Expiry_Adjustment",
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
      "SP_String": "SP_Update_Expiry_Adjustment",
      "Report_Name_String": "Get_Data_For_View_Update_Expiry_Adjustment",
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
       this.ObjUpdateExpAd.Brand_ID = undefined;
       this.ObjUpdateExpAd.Product_ID = undefined;
      // this.BrandDisable = false;
       this.ProductList = [];
       this.productaddSubmit = [];
       this.AddDisable = false;
       this.expirydateDisable = true;
       this.ObjUpdateExpAd.Batch_No = [];
       this.Expiry_Time = [];
       this.ObjUpdateExpAd.Rcv_Qty  = [];
  }

}
class UpdateExpAd {
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
 }
 class Browse {
  start_date : Date ;
  end_date : Date;
  Brand_ID : string;
}
