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

@Component({
  selector: 'app-k4c-internal-stock-transfer',
  templateUrl: './k4c-internal-stock-transfer.component.html',
  styleUrls: ['./k4c-internal-stock-transfer.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cInternalStockTransferComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save & Print";
  myDate: Date;
  ProductionFormSubmitted = false ;

  inputBoxDisabled = false;
  Objproduction : production = new production ();
  ObjBrowse : Browse = new Browse ();
  //FPDisabled = true;
  AddProDetailsFormSubmitted = false;
  ObjproductAdd : productAdd = new productAdd ();
  //ProtypeDisabled = false;

  BrandList = [];
  ProductTypeList = [];
  Fcostcenlist = [];
  FromGodownList = [];
  Tocostcenlist = [];
  ToGodownList = [];
  Datelist = [];
  ProductNamelList = [];
  BatchNoList = [];
  AddProDetails = [];
  Searchedlist = [];
  godownid = [];
  editList = [];
  FPDisabled = false;

  IntStockFormFormSubmitted = false;
  ProtypeDisabled = false
  initDate = [];
  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Internal Stock Transfer",
      Link: " Material Management -> Internal Stock Transfer"
    });
    this.GetBrand();
    this.GetFromCostCen();
    //this.GetFromGodown();
    this.GetToCostCen();
    //this.GetToGodown();
    this.GetDate();
  }
  TabClick(e){
   // console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.clearData();
  }

  //CREATE START
  GetBrand(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Brand"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrandList = data;
      //this.Objproduction.Brand_ID = this.BrandList.length === 2 ? this.BrandList[0].Brand_ID : undefined;
      //this.Objproduction.Brand_ID = this.BrandList[0].Brand_ID;
      this.Objproduction.Brand_ID = undefined;
      //this.GetProductType();
     // console.log("Brand List ===",this.BrandList);
    })
  }
  GetProductType(){
    //console.log("brand id ==", this.Objproduction.Brand_ID)
    const tempObj = {
      brand_id : this.Objproduction.Brand_ID
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "GET Product Type",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ProductTypeList = data;
    //  const Product_Type_ID = this.ProcessProductList.length === 4 ? this.ProcessProductList[0].Product_Type_ID : undefined;
    //   this.GetProductionpro(Product_Type_ID);
     // console.log("Product Process List ===",this.ProductTypeList);
      //this.inputBoxDisabled = true;
      //this.ProductionFormSubmitted = false;
      //this.FPDisabled = true;
    })
  }
  GetFromCostCen(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Non Outlet Cost Centre"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Fcostcenlist = data;
      //this.Objproduction.From_Cost_Cen_ID = this.Fcostcenlist.length === 21 ? this.Fcostcenlist[0].From_Cost_Cen_ID : undefined;
      this.Objproduction.From_Cost_Cen_ID = data[0].Cost_Cen_ID;;
      //console.log("Cost Cen List ===",this.Fcostcenlist);
      this.GetFromGodown();
    })
  }
  GetFromGodown(){
    const tempObj = {
      //Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
      Cost_Cen_ID : this.Objproduction.From_Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.FromGodownList = data;
      //this.Objproduction.From_godown_id = this.FromGodownList.length === 3 ? this.FromGodownList[0].godown_id : undefined;
      this.Objproduction.From_godown_id = data[0].godown_id;
      //this.godownid = data[0].godown_id;
       //console.log("From Godown List ===",this.FromGodownList);
    })
  }
  GetToCostCen(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Non Outlet Cost Centre"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Tocostcenlist = data;
     // this.Objproduction.From_Cost_Cen_ID = this.Fcostcenlist.length === 21 ? this.Fcostcenlist[0].From_Cost_Cen_ID : undefined;
      this.Objproduction.To_Cost_Cen_ID = data[0].Cost_Cen_ID;
     // console.log("To Cost Cen List ===",this.Tocostcenlist);
      this.GetToGodown();
    })
  }
  GetToGodown(){
    const tempObj = {
      Cost_Cen_ID : this.Objproduction.To_Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ToGodownList = data;
      // this.Objproduction.From_godown_id = this.FromGodownList.length === 3 ? this.FromGodownList[0].godown_id : undefined;
      this.Objproduction.To_godown_id = data[0].godown_id;
       //console.log("To Godown List ===",this.ToGodownList);
    })
  }
  GetDate(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Production Date"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Datelist = data;
      this.myDate =  new Date(data[0].Column1);
      // console.log("Date List ===",this.Datelist);
      this.initDate = [this.myDate , this.myDate];
      //console.log("this.initDate ==", this.initDate)
    })
  }
  GetProductsName(){
   //console.log('product type id ==', this.Objproduction.Product_Type_ID)
    const tempObj = {
      Product_Type_ID : this.Objproduction.Product_Type_ID,
      From_Cost_Cen_ID : this.Objproduction.From_Cost_Cen_ID,
      From_godown_id : this.Objproduction.From_godown_id
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "GET_Production_Products",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //this.ProductionlList = data;
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Description,
          element['value'] = element.Product_ID
        });
        this.ProductNamelList = data;
      } else {
        this.ProductNamelList = [];

      }
      // console.log("Product List ===",this.ProductNamelList);
    })
  }
  ProductChange() {
    this.BatchNoList =[];
  if(this.ObjproductAdd.Product_ID) {
    const ctrl = this;
   this.GetBatchNo();
    const productObj = $.grep(ctrl.ProductNamelList,function(item) {return item.Product_ID == ctrl.ObjproductAdd.Product_ID})[0];
    //console.log(productObj);
    //this.ObjproductAdd.ID = productObj.ID;
    this.ObjproductAdd.Product_Description = productObj.Product_Description;
  }
  }
  GetBatchNo(){
    //console.log('Previous process id ==' , this.Objproduction.Previous_Process_ID)
    const TempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
     // Godown_Id : this.godownid,
      Godown_Id : this.Objproduction.From_godown_id,
      Product_ID : this.ObjproductAdd.Product_ID,
      //Cost_Cen_ID : 2,
      //Godown_Id : 4,
      //Product_ID : 3383
     }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get_Finish_Product_Wise_Batch",
      "Json_Param_String": JSON.stringify([TempObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.BatchNoList = data;
     this.ObjproductAdd.Batch_No = this.BatchNoList.length ? this.BatchNoList[0].Batch_No : undefined;
     //console.log('Batch No ==', data)

    });
  }
  AddProductDetails(valid){
    //console.log('add ===', valid)
    this.AddProDetailsFormSubmitted = true;
    if(valid && this.GetSelectedBatchqty()){
     // console.log(this.ObjproductAdd.Batch_No)
    var productObj = {
      Product_ID : this.ObjproductAdd.Product_ID,
      Product_Description : this.ObjproductAdd.Product_Description,
      Batch_No : this.ObjproductAdd.Batch_No,
      Stock_Qty :  this.ObjproductAdd.Stock_Qty
    };
    this.AddProDetails.push(productObj);
   // console.log("Product Submit",this.AddProDetails);
    this.AddProDetailsFormSubmitted = false;
    this.ObjproductAdd = new productAdd();
    this.BatchNoList = [];
    //this.ProtypeDisabled = true;
   // this.ExProductFlag = false;
    }
  }
  GetSelectedBatchqty () {
      if (!this.ObjproductAdd.Batch_No ) {
        this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Can't add product without batch No."
          });
      return false;
      }
      const sameproduct = this.AddProDetails.filter(item=> item.Product_ID === this.ObjproductAdd.Product_ID &&
         item.Batch_No === this.ObjproductAdd.Batch_No);
      if(sameproduct.length) {
       this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Can't add same product with same batch no."
          });
      return false;
    }
    // const sameproductwithbatch = this.AddProDetails.filter(item=> item.Batch_No === this.ObjproductAdd.Batch_No);
    // if(sameproductwithbatch.length) {
    //   this.compacctToast.clear();
    //       this.compacctToast.add({
    //         key: "compacct-toast",
    //         severity: "error",
    //         summary: "Warn Message",
    //         detail: "Can't use same batch no.."
    //       });
    //   return false;
    // }
    const baychqtyarr = this.BatchNoList.filter(item=> item.Batch_No === this.ObjproductAdd.Batch_No);
      if(baychqtyarr.length) {
        if(this.ObjproductAdd.Stock_Qty <=  baychqtyarr[0].Qty) {
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
     }
      else {
        return true;
      }
  }
  delete(index) {
    this.AddProDetails.splice(index,1)
  }
  // FOR SAVE AND UPDATE
  SaveIntStocktr(){
    if(this.Objproduction.From_Cost_Cen_ID == this.Objproduction.To_Cost_Cen_ID &&
      this.Objproduction.From_godown_id == this.Objproduction.To_godown_id){
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "can't use same stock point with respect to same cost centre"
        });
        return false;
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String" : "Add Internal Stock Transfer",
     "Json_Param_String": this.dataforSaveIntStocktr()

    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    //  console.log(data);
      var tempID = data[0].Column1;
      this.Objproduction.Doc_No = data[0].Column1;
      if(data[0].Column1){
        this.compacctToast.clear();
        const mgs = this.buttonname === "Save & Print" ? "Saved" : "Updated";
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Internal Stock Transfer  " + tempID,
         detail: "Succesfully  " + mgs
       });
       if (this.buttonname == "Save & Print") {
       this.saveNprintStock();
       }
       this.clearData();

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
  dataforSaveIntStocktr(){
    // console.log(this.DateService.dateConvert(new Date(this.myDate)))
     this.Objproduction.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    if(this.AddProDetails.length) {
      let tempArr =[]
      this.AddProDetails.forEach(item => {
        const obj = {
            Product_ID : item.Product_ID,
            Product_Description : item.Product_Description,
            Batch_NO : item.Batch_No,
            Qty : item.Stock_Qty,
        }

        const TempObj = {
          Doc_No : this.Objproduction.Doc_No ?  this.Objproduction.Doc_No : "A",
          Doc_Date : this.Objproduction.Doc_Date,
          Product_Type_ID : this.Objproduction.Product_Type_ID,
          Brand_ID : this.Objproduction.Brand_ID,
          UOM : "PCS",
          Remarks : "test",
          From_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
          From_godown_id : this.Objproduction.From_godown_id ? this.Objproduction.From_godown_id : 0,
          To_Cost_Cen_ID : this.Objproduction.To_Cost_Cen_ID,
          To_godown_id : this.Objproduction.To_godown_id,
          User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
        }
        tempArr.push({...obj,...TempObj})
      });
     // console.log("Save Data ===", tempArr)
      return JSON.stringify(tempArr);

    }
  }
  saveNprintStock(){
    if (this.Objproduction.Doc_No) {
      window.open("/Report/Crystal_Files/K4C/K4C_Internal_Stock_Transfer.aspx?DocNo=" + this.Objproduction.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
   );
    }
  }
  //CREATE END

  // BROWSE START
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  SearchIntStocktr(){
    const start = this.ObjBrowse.start_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowse.end_date
      ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
      : this.DateService.dateConvert(new Date());
    const tempobj = {
      From_date : start,
      To_Date : end
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Browse Internal Stock transfer",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Searchedlist = data;
       //this.BackupSearchedlist = data;
       //this.GetDistinct();
      // console.log('search list=====',this.Searchedlist)
       this.seachSpinner = false;
     })
  }

  EditIntStock(DocNo){
   // console.log("editmaster ==",DocNo);
    this.clearData();
    if(DocNo.Doc_No){
    this.Objproduction.Doc_No = DocNo.Doc_No;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    // console.log("this.EditDoc_No ==", this.Objproduction.Doc_No);
    this.GetEditIntStock(this.Objproduction.Doc_No);
    }
  }
  GetEditIntStock(Doc_No){
    this.ProductionFormSubmitted = false;
      const obj = {
        "SP_String": "SP_Production_Voucher",
        "Report_Name_String": "Get Internal Stock transfer Details For Edit",
        "Json_Param_String": JSON.stringify([{Doc_No : this.Objproduction.Doc_No}])

      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editList = data;
         this.Objproduction.Brand_ID = data[0].Brand_ID;
           this.Objproduction.Product_Type_ID = data[0].Product_Type_ID;
           this.GetProductType();
           this.GetProductsName();
           this.Objproduction.From_Cost_Cen_ID = data[0].From_Cost_Cen_ID;
           this.Objproduction.From_godown_id = data[0].From_godown_id; //? data[0].From_godown_id : undefined;
           this.Objproduction.To_Cost_Cen_ID = data[0].To_Cost_Cen_ID;
           this.Objproduction.To_godown_id = data[0].To_godown_id;
           //this.GetToGodown();
           this.Objproduction.Doc_Date = data[0].Doc_Date;

           data.forEach(element => {
             const  productObj = {
              Product_ID : element.Product_ID,
              Product_Description : element.Product_Description,
              //Batch_No : (this.Objproduction.Process_ID != '1' ? element.Batch_NO : '-'),
              Batch_No : element.Batch_NO,
              Stock_Qty :  Number(element.Qty),
            };
             this.AddProDetails.push(productObj);
        });
        // console.log("this.editList  ===",data);
      })
  }
  PrintStock(obj){
    if (obj.Doc_No) {
      window.open("/Report/Crystal_Files/K4C/K4C_Internal_Stock_Transfer.aspx?DocNo=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

      );
    }
  }
  DeleteIntStocktr(docNo){
     this.Objproduction.Doc_No = undefined ;
     if(docNo.Doc_No){
     this.Objproduction.Doc_No = docNo.Doc_No;
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
  onConfirm() {
    const Tempobj = {
       Doc_No : this.Objproduction.Doc_No,
       User_ID : this.$CompacctAPI.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String" : "SP_Production_Voucher",
      "Report_Name_String" : "Delete Internal Stock transfer",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //  console.log(data);
      if(data[0].Column1 === "Done") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Doc_No : " + this.Objproduction.Doc_No,
          detail:  "Succesfully Delete"
        });
        this.SearchIntStocktr();
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
  onReject() {
    this.compacctToast.clear("c");
  }
  clearData() {
    //this.Objproduction = new production ();
    this.ObjproductAdd = new productAdd();
    this.Objproduction.Brand_ID = undefined;
    const obj = {...this.Objproduction}
    this.Objproduction.Doc_No = undefined;
    this.Objproduction.Product_Type_ID = undefined;
    this.ProductTypeList = [];
    this.Objproduction.From_Cost_Cen_ID = this.Fcostcenlist.length === 21 ? this.Fcostcenlist[0].Cost_Cen_ID : undefined;
    //this.GetFromGodown();
    this.Objproduction.From_godown_id = this.FromGodownList.length === 3 ? this.FromGodownList[0].godown_id : undefined;
    this.Objproduction.To_Cost_Cen_ID = this.Tocostcenlist.length === 21 ? this.Tocostcenlist[0].Cost_Cen_ID : undefined;
    //this.GetToGodown();
    this.Objproduction.To_godown_id = this.ToGodownList.length === 3 ? this.ToGodownList[0].godown_id : undefined;
    this.GetDate();
    this.ProductNamelList = [];
    this.BatchNoList = [];
    this.AddProDetails = [];
    // this.inputBoxDisabled = false;
    // this.ProductionFormSubmitted = false;
     this.AddProDetailsFormSubmitted = false;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Save & Print";
    }

}

class production {
  Doc_No : string;
  Brand_ID : string;;
  Product_Type_ID : string;

  From_godown_id : string;;
  To_godown_id : string;;
  To_Cost_Cen_ID : string;;
  From_Cost_Cen_ID : string;;
  Doc_Date : string;
  User_ID : string;;
  Remarks : any;
 }
 class productAdd {
  //ID : string;
  Product_Name : string;
  Batch_No : string;
  Stock_Qty : string;
  Product_ID : string;
  Product_Description : string;
 }
 class Browse {
   start_date : Date ;
   end_date : Date;
   //Cost_Cen_ID : 0;
   //Product_Type_ID : 0;


 }
