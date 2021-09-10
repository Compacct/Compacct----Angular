import { Component, OnInit, ViewChild, ViewEncapsulation  } from '@angular/core';
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
import { ShareReplayConfig } from 'rxjs/internal/operators/shareReplay';
declare var $:any;

@Component({
  selector: 'app-k4c-create-start-production',
  templateUrl: './k4c-create-start-production.component.html',
  styleUrls: ['./k4c-create-start-production.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cCreateStartProductionComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save";

  myDate: Date;
  ProductionFormSubmitted = false ;

  inputBoxDisabled = false;
  Objproduction : production = new production ();
  ObjBrowse : Browse = new Browse ();
  BrandList = [];
  SelProcessList = [];
  ProcessProductList = [];
  SiftList = [];
  ToGodownList = [];
  ProDatelist = [];
  ProductionlList = [];
  FromProcessList = [];
  FromGodownList = [];
  FPDisabled = true;
  BatchDisabled = true;
  AddProDetailsFormSubmitted = false;
  ObjproductAdd : productAdd = new productAdd ();
  AddProDetails = [];
  Batch_No: any;
  Searchedlist = [];
  editList = [];
  DeleteList = [];
  BatchNoList = [];
  ProtypeDisabled = false;

  Param_Flag ='';

  BackupSearchedlist = [];
  DistProcessName = [];
  SelectedDistProcessName = [];
  DistProductType = [];
  SelectedDistProductType = [];
  DistShift = [];
  SelectedDistShift = [];
  SearchFields = [];

  constructor(
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private route : ActivatedRoute,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
  ) {
    this.route.queryParams.subscribe(params => {
      // console.log(params);
      this.Param_Flag = params['Name'];
      // console.log (this.Param_Flag);
      })
  }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: this.Param_Flag,
      Link: " Outlet -> " + this.Param_Flag
    });
    this.GetBrand();
    this.GetSelectProcess();
    this.GetSift();
    this.GetToGodown();
    this.GetProDate();
    this.GetFromGodown();
  }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
    this.AddProDetails =[];
    this.BatchNoList = [];
    //this.FPDisabled = true;
  }

  // CREATE START
  GetBrand(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Brand"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrandList = data;
      //this.Objproduction.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
       console.log("Brand List ===",this.BrandList);
    })
  }
  GetSelectProcess(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "GET_Start_Process"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.SelProcessList = data;
      //this.Objproduction.Process_ID = this.SelProcessList.length === 1 ? this.SelProcessList[0].Process_ID : undefined;
       console.log("Select Process List ===",this.SelProcessList);
    })
  }
  GetFromProcess(){
    //console.log('Process ID ==', this.Objproduction.Process_ID)
    this.FPDisabled = true;
    this.BatchDisabled = true;
    const tempObj = {
      process_id : this.Objproduction.Process_ID
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "GET_Previous_Process",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.FromProcessList = data;
      if(this.FromProcessList.length){
      this.Objproduction.From_Process_ID = this.FromProcessList.length ? this.FromProcessList[0].From_Process_ID : undefined;
      this.Objproduction.Previous_Process_ID = data[0].Previous_Process_ID;
      //this.Objproduction.From_godown_id = this.FromGodownList.length === 3 ? this.FromGodownList[0].godown_id : undefined;
      this.FPDisabled = false;
      this.BatchDisabled = false;
      }
      console.log("From Process List ===",this.FromProcessList);
    })
  }
  GetFromGodown(){
    const tempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.FromGodownList = data;
      // this.Objproduction.From_godown_id = this.FromGodownList.length === 3 ? this.FromGodownList[0].godown_id : undefined;
      //this.Objproduction.From_godown_id = data[0].godown_id;
       console.log("From Godown List ===",this.FromGodownList);
    })
  }
  GetProductType(valid){
    this.ProductionFormSubmitted = true;
    if(valid){
    const tempObj = {
      brand_id : this.Objproduction.Brand_ID,
      Process_ID : this.Objproduction.Process_ID,
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "GET_Product_Type_Process_Wise",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ProcessProductList = data;
    //  const Product_Type_ID = this.ProcessProductList.length === 4 ? this.ProcessProductList[0].Product_Type_ID : undefined;
    //   this.GetProductionpro(Product_Type_ID);
      console.log("Product Process List ===",this.ProcessProductList);
      this.inputBoxDisabled = true;
      this.ProductionFormSubmitted = false;
      this.FPDisabled = true;
    })
    }
  }
  GetSift(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Shift"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.SiftList = data;
      this.Objproduction.Shift = this.SiftList.length === 2 ? this.SiftList[0].Shift_ID : undefined;
      //this.Objproduction.Sift = data[0].Shift_ID;
       console.log("Sift List ===",this.SiftList);
    })
  }
  GetToGodown(){
    const tempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ToGodownList = data;
      this.Objproduction.To_godown_id = this.ToGodownList.length === 3 ? this.ToGodownList[0].godown_id : undefined;
      //this.Objproduction.To_godown_id = data[0].godown_id;
       console.log("To Godown List ===",this.ToGodownList);
    })
  }
  GetProDate(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Production Date"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ProDatelist = data;
      this.myDate =  new Date(data[0].Column1);
      // console.log("ProDate List ===",this.ProDatelist);
    })
  }
  // FOR PRODUCT NAME DROPDOWN
  GetProductionpro(){
    const tempObj = {
      Product_Type_ID : this.Objproduction.Product_Type_ID
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
        this.ProductionlList = data;
      } else {
        this.ProductionlList = [];

      }
       console.log("Production List ===",this.ProductionlList);
    })
  }
  ProductChange() {
    this.BatchNoList =[];
  if(this.ObjproductAdd.Product_ID) {
    const ctrl = this;
    this.GetBatchNo();
    const productObj = $.grep(ctrl.ProductionlList,function(item) {return item.Product_ID == ctrl.ObjproductAdd.Product_ID})[0];
    console.log(productObj);
    //this.ObjproductAdd.ID = productObj.ID;
    this.ObjproductAdd.Product_Description = productObj.Product_Description;
  }
  }
  GetBatchNo(){
    //console.log('Previous process id ==' , this.Objproduction.Previous_Process_ID)
    const TempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Product_ID : this.ObjproductAdd.Product_ID,
      Godown_Id : this.Objproduction.From_godown_id,
      Process_ID : this.Objproduction.Process_ID,
      From_Process_ID : this.Objproduction.From_Process_ID,
      Previous_Process_ID : this.Objproduction.Previous_Process_ID
      //Cost_Cen_ID : 2,
      //Godown_Id : 4,
      //Product_ID : 3383
     }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get_Product_Wise_Batch",
      "Json_Param_String": JSON.stringify([TempObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.BatchNoList = data;
     this.ObjproductAdd.Batch_No = this.BatchNoList.length === 1 ? this.BatchNoList[0].Batch_No : undefined;
     console.log('Batch No ==', data)

    });
  }
  AddProductDetails(valid){
  //console.log('add ===', valid)
  this.AddProDetailsFormSubmitted = true;
  if(valid && this.GetSelectedBatchqty()){
    console.log(this.ObjproductAdd.Batch_No)
    //var RR = this.ReturnReasonid.find(Return_Reason => Return_Reason.Return_Reason_ID == this.ObjProductaddForm.Return_Reason_ID);
  var productObj = {
    //ID : this.ObjproductAdd.ID,
    Product_ID : this.ObjproductAdd.Product_ID,
    Product_Description : this.ObjproductAdd.Product_Description,
    Batch_No : this.ObjproductAdd.Batch_No,
    Stock_Qty :  this.ObjproductAdd.Stock_Qty,
    //Return_Reason : RR.Return_Reason
  };
  this.AddProDetails.push(productObj);
  console.log("Product Submit",this.AddProDetails);
  this.AddProDetailsFormSubmitted = false;
  this.ObjproductAdd = new productAdd();
  this.BatchNoList = [];
  this.ProtypeDisabled = true;
 // this.ExProductFlag = false;
  }
  }
  GetSelectedBatchqty () {
    if (this.Objproduction.Process_ID.toString() !== '1' && !this.ObjproductAdd.Batch_No ) {
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Can't add product without batch No."
        });
    return false;
    }
    const sameproduct = this.AddProDetails.filter(item=> item.Product_ID === this.ObjproductAdd.Product_ID );
  if(sameproduct.length) {
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Can't add same product."
        });
    return false;
  }
  const sameproductwithbatch = this.AddProDetails.filter(item=> item.Batch_No === this.ObjproductAdd.Batch_No && item.Product_ID === this.ObjproductAdd.Product_ID );
  if(sameproductwithbatch.length) {
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Can't use same batch no.."
        });
    return false;
  }
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
  // SAVE AND UPDATE
  SaveProduction(){
  const obj = {
    "SP_String": "SP_Production_Voucher",
    "Report_Name_String" : "Add Production Voucher",
   "Json_Param_String": this.dataforSaveProduction()

  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
  //  console.log(data);
    var tempID = data[0].Column1;
    if(data[0].Column1){
      this.compacctToast.clear();
      //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Production Voucher  " + tempID,
       detail: "Succesfully Saved" //+ mgs
     });
     this.clearData();
     this.AddProDetails =[];
    //  this.ProcessProductList =[];
    //  this.ProductionlList = [];
     //this.ObjSaveForm = new SaveForm();

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
  dataforSaveProduction(){
  // console.log(this.DateService.dateConvert(new Date(this.myDate)))
   this.Objproduction.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
  if(this.AddProDetails.length) {
    let tempArr =[]
    this.AddProDetails.forEach(item => {
      const obj = {
         // ID : item.ID,
          Product_ID : item.Product_ID,
          Product_Description : item.Product_Description,
          Batch_No : item.Batch_No,
          Qty : item.Stock_Qty,
      }

      const TempObj = {
        Doc_No : this.Objproduction.Doc_No ?  this.Objproduction.Doc_No : "A",
        Doc_Date : this.Objproduction.Doc_Date,
        Shift_ID : this.Objproduction.Shift,
        Process_ID : this.Objproduction.Process_ID,
        Product_Type_ID : this.Objproduction.Product_Type_ID,
        From_Process_ID : this.Objproduction.From_Process_ID ? this.Objproduction.From_Process_ID : 0,
        Brand_ID : this.Objproduction.Brand_ID,
        UOM : "PCS",
        Remarks : " ",
        From_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        From_godown_id : this.Objproduction.From_godown_id ? this.Objproduction.From_godown_id : 0,
        To_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        To_godown_id : this.Objproduction.To_godown_id,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
        Req_Qty : 0,
        Adv_Order_No : "NA",
        Order_Txn_ID : 0,
      }
      tempArr.push({...obj,...TempObj})
    });
    console.log("Save Data ===", tempArr)
    return JSON.stringify(tempArr);

  }
  }
  // CREATE END

  // BROWSE START
  getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjBrowse.start_date = dateRangeObj[0];
    this.ObjBrowse.end_date = dateRangeObj[1];
  }
  }
  SearchProduction(){
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
  "Report_Name_String": "Browse Production Voucher",
  "Json_Param_String": JSON.stringify([tempobj])
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   this.BackupSearchedlist = data;
   this.GetDistinct();
   console.log('search list=====',this.Searchedlist)
   this.seachSpinner = false;
 })
  }
  // DISTINCT & FILTER
  GetDistinct() {
    let DProcessName = [];
    let DProductType = [];
    let DShift = [];
    this.DistProcessName =[];
    this.SelectedDistProcessName =[];
    this.DistProductType =[];
    this.SelectedDistProductType =[];
    this.DistShift =[];
    this.SelectedDistShift =[];
    this.SearchFields =[];
    this.Searchedlist.forEach((item) => {
   if (DProcessName.indexOf(item.Process_ID) === -1) {
    DProcessName.push(item.Process_ID);
   this.DistProcessName.push({ label: item.Process_Name, value: item.Process_ID });
   }
  if (DProductType.indexOf(item.Product_Type_ID) === -1) {
    DProductType.push(item.Product_Type_ID);
    this.DistProductType.push({ label: item.Product_Type, value: item.Product_Type_ID });
    }
    if (DShift.indexOf(item.Shift_ID) === -1) {
      DShift.push(item.Shift_ID);
      this.DistShift.push({ label: item.Shift_Name, value: item.Shift_ID });
      }
  });
     this.BackupSearchedlist = [...this.Searchedlist];
  }
  FilterDist() {
    let DProcessName = [];
    let DProductType = [];
    let DShift = [];
    this.SearchFields =[];
  if (this.SelectedDistProcessName.length) {
    this.SearchFields.push('Process_ID');
    DProcessName = this.SelectedDistProcessName;
  }
  if (this.SelectedDistProductType.length) {
    this.SearchFields.push('Product_Type_ID');
    DProductType = this.SelectedDistProductType;
  }
  if (this.SelectedDistShift.length) {
    this.SearchFields.push('Shift_ID');
    DShift = this.SelectedDistShift;
  }
  this.Searchedlist = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupSearchedlist.filter(function (e) {
      return (DProcessName.length ? DProcessName.includes(e['Process_ID']) : true)
      && (DProductType.length ? DProductType.includes(e['Product_Type_ID']) : true)
      && (DShift.length ? DShift.includes(e['Shift_ID']) : true)
    });
  this.Searchedlist = LeadArr.length ? LeadArr : [];
  } else {
  this.Searchedlist = [...this.BackupSearchedlist] ;
  }
  }

  Getprocessname() {
    if(this.FromProcessList.length) {
      const tempArry = this.FromProcessList.filter(item => Number(item.From_Process_ID) === Number(this.Objproduction.From_Process_ID));
      return  tempArry.length ? '( '+ tempArry[0].From_Process_Name + ' )' : '-';
    }
    return '-'
  }
  EditProduction(DocNo){
    console.log("editmaster ==",DocNo);
  this.clearData();
  if(DocNo.Doc_No){
  this.Objproduction.Doc_No = DocNo.Doc_No;
  this.tabIndexToView = 1;
  this.items = ["BROWSE", "UPDATE"];
  // this.buttonname = "Update";
   console.log("this.EditDoc_No ==", this.Objproduction.Doc_No);
  this.GetEditProduction(this.Objproduction.Doc_No);
  //this.getadvorderdetails(this.Objcustomerdetail.Bill_No);
  }
  }
  GetEditProduction(Doc_No){
    this.ProductionFormSubmitted = false;
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get Production Voucher Details For Edit",
      "Json_Param_String": JSON.stringify([{Doc_No : this.Objproduction.Doc_No}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editList = data;
      this.Objproduction.Brand_ID = data[0].Brand_ID;
      this.Objproduction.Process_ID = data[0].Process_ID;
      this.Objproduction.From_Process_ID = data[0].From_Process_ID ? data[0].From_Process_ID : undefined;
      this.GetFromProcess();
      this.Objproduction.From_Process_ID = data[0].From_Process_ID ? data[0].From_Process_ID : undefined;
      this.Objproduction.From_Cost_Cen_ID = data[0].From_Cost_Cen_ID;
      this.Objproduction.From_godown_id = data[0].From_godown_id ? data[0].From_godown_id : undefined;
      this.Objproduction.Product_Type_ID = data[0].Product_Type_ID;
      this.GetProductType(true);
      this.GetProductionpro();
      this.Objproduction.Shift = data[0].Shift_ID;
      this.Objproduction.To_Cost_Cen_ID = data[0].To_Cost_Cen_ID;
      this.Objproduction.To_godown_id = data[0].To_godown_id;
      this.Objproduction.Doc_Date = data[0].Doc_Date;

       data.forEach(element => {
       const  productObj = {
          //ID : element.ID,
          Product_ID : element.Product_ID,
          Product_Description : element.Product_Description,
          Batch_No : (this.Objproduction.Process_ID != '1' ? element.Batch_NO : '-'),
          Stock_Qty :  Number(element.Qty),
        };
         this.AddProDetails.push(productObj);
    });
     console.log("this.editList  ===",data);
     console.log("edit product type ===" , this.Objproduction.Product_Type_ID)

  })
  }
  DeleteProduction(docNo){
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
      Doc_No : this.Objproduction.Doc_No
    }
    const obj = {
      "SP_String" : "SP_Production_Voucher",
      "Report_Name_String" : "Delete Production Voucher Details",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log(data);
      if(data[0].Column1 === "Done") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Doc_No : " + this.Objproduction.Doc_No,
          detail:  "Succesfully Delete"
        });
        this.SearchProduction();
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
// BROWSE END
  clearData() {
  //this.Objproduction = new production ();
  this.ObjproductAdd = new productAdd();
  this.Objproduction.Brand_ID = undefined;
  this.Objproduction.Process_ID = undefined;
  const obj = {...this.Objproduction}
  this.Objproduction.Doc_No = undefined;
  //this.Objproduction.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
  //this.Objproduction.Process_ID = this.SelProcessList.length === 1 ? this.SelProcessList[0].Process_ID : undefined;
  if(this.FromProcessList = []){
      this.FPDisabled = true;
      this.BatchDisabled = true;
  }else{
       this.FPDisabled = false;
  }
  this.Objproduction.From_godown_id = undefined;
  //this.Objproduction.From_godown_id = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
  //this.Objproduction.Product_Type_ID = this.ProcessProductList.length === 1 ? this.ProcessProductList[0].Product_Type_ID : undefined;
  //this.ProcessProductList = [];
  this.Objproduction.Product_Type_ID = undefined;
  this.Objproduction.Shift = this.SiftList.length === 2 ? this.SiftList[0].Shift_ID : undefined;
  this.Objproduction.To_godown_id = this.ToGodownList.length === 3 ? this.ToGodownList[0].godown_id : undefined;
  this.GetProDate();
  this.ProductionlList = [];
  this.inputBoxDisabled = false;
  //this.ProductDetailsList = [];
  this.ProductionFormSubmitted = false;
  this.AddProDetailsFormSubmitted = false;
  this.ProtypeDisabled = false;
  this.ProcessProductList =[];
  //this.ProductionlList = [];
  }
}


class production {
 Doc_No : string;
 Brand_ID : string;
 Product_Type_ID : string;
 Process_ID : string;
 From_Process_ID : string;
 Previous_Process_ID : string;
 Shift : string;
 From_godown_id : string;
 To_godown_id : string;
 To_Cost_Cen_ID : string;
 From_Cost_Cen_ID : string;
 Doc_Date : string;
 User_ID : string;;
 Remarks : any;
}
class productAdd {
 Product_Name : string;
 Batch_No : string;
 Stock_Qty : string;
 Product_ID : string;
 Product_Description : string;
}
class Browse {
  start_date : Date ;
  end_date : Date;
  Cost_Cen_ID : 0;
  Product_Type_ID : 0;


}
