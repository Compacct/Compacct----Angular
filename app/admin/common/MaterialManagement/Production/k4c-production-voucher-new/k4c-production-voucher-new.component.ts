import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
declare var $: any;
import * as moment from "moment";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-k4c-production-voucher-new',
  templateUrl: './k4c-production-voucher-new.component.html',
  styleUrls: ['./k4c-production-voucher-new.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cProductionVoucherNewComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save & Print";
  todayDate : any = new Date();
  Datevalue : any = Date ;
  myDate: Date;
  ProductionFormSubmitted = false ;
  ProductionFormSubmitted2 = false;

  inputBoxDisabled = false;
  Objproduction : production = new production ();
  ObjBrowse : Browse = new Browse ();
  BrandList:any = [];
  SelProcessList:any = [];
  ProcessProductList:any = [];
  SiftList:any = [];
  ToGodownList:any = [];
  ProDatelist:any = [];
  ProductionlList:any = [];
  BackUpProductionlList:any = [];
  FromProcessList:any = [];
  FromGodownList:any = [];
  FPDisabled = true;
  BatchDisabled = true;
  AddProDetailsFormSubmitted = false;
  ObjproductAdd : productAdd = new productAdd ();
  AddProDetails:any = [];
  Batch_No: any;
  Searchedlist:any = [];
  editList:any = [];
  DeleteList:any = [];
  BatchNoList:any = [];
  ProtypeDisabled = false;
  allProductsCheck = false;
  checkBoxText = "Show All Products"
  checkBoxdis = true;
  editDis = false;
  Param_Flag ='';

  BackupSearchedlist:any = [];
  DistProcessName:any = [];
  SelectedDistProcessName:any = [];
  DistProductType:any = [];
  SelectedDistProductType:any = [];
  DistShift:any = [];
  SelectedDistShift:any = [];
  SearchFields:any = [];
  Process_ID: any;
  ViewPoppup = false;
  Doc_no = undefined;
  Doc_date : any;
  BrandName = undefined;
  ProcessName = undefined;
  Producttype = undefined;
  FstockPoint = undefined;
  TostockPoint = undefined;
  FprocessName = undefined;
  Vshift = undefined;
  TotalQty = undefined;
  initDate:any = [];
  doc_date: any;
  minDate: Date;
  maxDate: Date;
  filteredData:any = [];
  displaysavepopup = false;
  BrowseDate:any = [];
  BDate: Date;
  IndentNoList:any = [] ;
  BackupIndentList:any = [];
  IndentFilter:any = [];
  SelectedIndent : any;
  TIndentList:any = [];
  Cost_Cen_Id: any;
  editIndentList:any = [];
  lockdate:any;
  loading:boolean = false;

  constructor(
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private route : ActivatedRoute,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService) {
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
        Link: " Material Management -> Production -> " + this.Param_Flag
      });
      this.getLockDate();
      this.GetBrand();
      this.GetSelectProcess();
      this.GetSift();
      this.GetToGodown();
      this.GetProDate();
      this.GetFromGodown();
      this.GetBrowseDate();
    }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save & Print";
    this.clearData();
    this.AddProDetails =[];
    this.BatchNoList = [];
    // this.Searchedlist = [];
    // this.BackupSearchedlist = [];
    //this.FPDisabled = true;
    this.SelectedIndent = [];
    this.IndentFilter = [];
    this.seachSpinner = false;
  }
  getLockDate(){
    const obj = {
     "SP_String": "sp_Comm_Controller",
     "Report_Name_String": "Get_LockDate",
     //"Json_Param_String": JSON.stringify([{Doc_Type : "Sale_Bill"}])
  
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
  // CREATE START
  GetBrand(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Brand"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrandList = data;
      //this.Objproduction.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
       //console.log("Brand List ===",this.BrandList);
    })
  }
  GetSelectProcess(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "GET_Start_Process"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.SelProcessList = data;
      //this.Objproduction.Process_ID = data[100].Process_ID;
      //this.Objproduction.Process_ID = this.SelProcessList.length === 1 ? this.SelProcessList[0].Process_ID : undefined;
       //console.log("Select Process List ===",this.SelProcessList);
    })
  }
  GetFromProcess(){
    //console.log('Process ID ==', this.Objproduction.Process_ID)
    this.FPDisabled = true;
    this.BatchDisabled = true;
    this.BatchNoList =[];
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
      //this.BatchNoList =[];
      //this.Objproduction.From_Process_ID = this.FromProcessList.length ? this.FromProcessList[0].From_Process_ID : undefined;
      if(this.FromProcessList.length && this.buttonname === "Save & Print"){
      this.Objproduction.From_Process_ID = this.FromProcessList.length ? this.FromProcessList[0].From_Process_ID : undefined;
      this.Objproduction.Previous_Process_ID = data[0].Previous_Process_ID;
      //this.Objproduction.Previous_Process_ID = this.FromProcessList.length ? this.FromProcessList[0].Previous_Process_ID : undefined;
      this.FPDisabled = false;
      this.BatchDisabled = false;
      }
      else if(this.FromProcessList.length && this.buttonname === "Update"){
       // this.Objproduction.From_Process_ID = this.FromProcessList.length ? this.FromProcessList[0].From_Process_ID : undefined;
        this.Objproduction.Previous_Process_ID = data[0].Previous_Process_ID;
        //this.Objproduction.Previous_Process_ID = this.FromProcessList.length ? this.FromProcessList[0].Previous_Process_ID : undefined;
        this.FPDisabled = false;
        this.BatchDisabled = false;
      }
      else{
        this.Objproduction.From_Process_ID = undefined;
      }
      //console.log("From Process List ===",this.FromProcessList);
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
       //console.log("From Godown List ===",this.FromGodownList);
    })
  }
  GetProductType(valid){
    this.ProductionFormSubmitted = true;
    if(valid){
    const tempObj = {
      brand_id : this.Objproduction.Brand_ID,
      Process_ID : this.Objproduction.Process_ID,
      //Date : this.tadayDate
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
      //console.log("Product Process List ===",this.ProcessProductList);
      this.inputBoxDisabled = true;
      this.ProductionFormSubmitted = false;
      this.FPDisabled = true;
      this.checkBoxdis = false;
      //this.onFilterChange(true);

      if(this.editList.length){
        this.Objproduction.Product_Type_ID =  undefined;
      this.ProcessProductList.forEach(item => {
        const dataTemp = this.editList.filter(elem=> elem.Product_Type_ID == item.Product_Type_ID);
        if(dataTemp.length === this.editList.length){
          this.Objproduction.Product_Type_ID = this.editList[0].Product_Type_ID;
        }

      })
    }
      if(!this.editList.length){
      this.GetProductionpro();
      }
    })
    }
    if(!this.editList.length){
      this.GetIndentList();
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
      // console.log("Sift List ===",this.SiftList);
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
     // this.initDate = [this.myDate , this.myDate];
      this.Datevalue = new Date(data[0].Column1);
      let Datetemp:Date =  new Date(data[0].Column1)
      const Timetemp =  Datetemp.setDate(Datetemp.getDate() - 1);
      this.minDate = new Date(Timetemp);
      console.log("minDate==", this.minDate)
      // this.minDate =  new Date(data[0].Column1);
       let tempDate:Date =  new Date(data[0].Column1)
      const tempTimeBill =  tempDate.setDate(tempDate.getDate() + 1);
      this.maxDate = new Date(tempTimeBill);
      console.log("maxDate==", this.maxDate)
      //console.log("ProDate List ===",this.ProDatelist);

      //console.log("this.initDate ==", this.initDate)
    })
  }
  GetIndentList(){
   // this.RawMaterialIssueFormSubmitted = true;
    //if(valid){
    const TempObj = {
      Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
      Brand_ID : this.Objproduction.Brand_ID,
      Material_Type : 'Finished'
     }
   const obj = {
    "SP_String": "SP_Production_Voucher_New",
    "Report_Name_String" : "Get Requisition Nos",
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
     // this.Cost_Cen_Id = data[0].Cost_Cen_ID;
    // } else {
    //   this.IndentNoList = [];

    //  }
   // this.RawMaterialIssueFormSubmitted = false;
   console.log("this.Indentlist======",this.IndentNoList);
   this.GetIndent();
  })
 // }
  }
  GetIndent(){
    let DIndent:any = [];
    this.IndentFilter = [];
    this.SelectedIndent = [];
    this.BackupIndentList.forEach((item) => {
      if (DIndent.indexOf(item.Req_No) === -1) {
        DIndent.push(item.Req_No);
        this.IndentFilter.push({ label: item.Req_No + '(' + item.cost_cen_name + ')' , value: item.Req_No });
        console.log("this.IndentFilter", this.IndentFilter);
      }
    });
    this.BackupIndentList = [...this.IndentNoList];
  }
  filterIndentList() {
    //console.log("SelectedTimeRange", this.SelectedTimeRange);
    let DIndent:any = [];
    this.TIndentList = [];
    //const temparr = this.ProductionlList.filter((item)=> item.Qty);
    if(!this.editList.length){
      this.BackUpProductionlList =[];
    this.ProductionlList = [];
      this.GetProductionpro();
      }
      if(this.editList.length){
        this.BackUpProductionlList =[];
      this.ProductionlList = [];
        this.GetProductionproforEdit();
        }
    if (this.SelectedIndent.length) {
      this.TIndentList.push('Req_No');
      DIndent = this.SelectedIndent;
    }
    if(this.editList.length) {
      this.ProductionlList = [];
      this.loading = true;
      if (this.TIndentList.length) {
        let LeadArr = this.BackUpProductionlList.filter(function (e) {
          return (DIndent.length ? DIndent.includes(e['Req_No']) : true)
        });
        this.ProductionlList = LeadArr.length ? LeadArr : [];
        this.loading = false;
      } else {
        this.ProductionlList = [...this.BackUpProductionlList];
        this.loading = false;
      }
    }


  }
  // FOR PRODUCT NAME DROPDOWN
  dataforproduct(){
    if(this.SelectedIndent.length) {
      let Arr:any =[]
      this.SelectedIndent.forEach(el => {
        if(el){
          const Dobj = {
            Req_No : el,
            Brand_ID : this.Objproduction.Brand_ID,
            Product_Type_ID : this.Objproduction.Product_Type_ID ? this.Objproduction.Product_Type_ID : 0,
            From_Cost_Cen_ID : 0,
            From_godown_id : 0,
            Doc_Type : "Requi",
            Date : this.DateService.dateConvert(new Date(this.todayDate)),
            }
           Arr.push(Dobj)
        }

    });
      console.log("Table Data ===", Arr)
      return Arr.length ? JSON.stringify(Arr) : '';
    }
  }
  GetProductionpro(){
      if(this.SelectedIndent.length) {
        this.allProductsCheck = false;
      this.loading = true;
      const obj = {
        "SP_String": "SP_Production_Voucher_New",
        "Report_Name_String": "GET_Production_Products",
        "Json_Param_String": this.dataforproduct()
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.ProductionlList = data;
        this.ProductionlList.forEach(el=>{
          el['stock_qty'] = el.stock_qty > 0 ? el.stock_qty : 0;
          el['Qty'] = el.req_qty ? Number(Number(el.req_qty) - Number(el.stock_qty)) : undefined;
        })
        this.BackUpProductionlList = [...this.ProductionlList];
        this.loading = false;
      })
   }

  }
  onFilterChange(eve: any) {
   if(eve){
     this.checkBoxText = "show only indent product"
     this.ProductionlList = [];
     this.BackUpProductionlList = [];
     this.loading = true;
    const tempObj = {
      Brand_ID : this.Objproduction.Brand_ID,
      Product_Type_ID : this.Objproduction.Product_Type_ID ? this.Objproduction.Product_Type_ID : 0,
      From_Cost_Cen_ID : 0,
      From_godown_id : 0,
      Doc_Type : "All",
      Date : this.DateService.dateConvert(new Date(this.todayDate)),
      Req_No : this.SelectedIndent.toString()
    }
    const obj = {
      "SP_String": "SP_Production_Voucher_New",
      "Report_Name_String": "GET_Production_Products",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ProductionlList = data;
      this.ProductionlList.forEach(el=>{
        el['stock_qty'] = el.stock_qty > 0 ? el.stock_qty : 0;
        el['Qty'] = el.req_qty ? Number(Number(el.req_qty) - Number(el.stock_qty)) : undefined;
      });
      this.BackUpProductionlList = [...this.ProductionlList];
      this.loading = false;
    })
   }
   else{
    this.ProductionlList = [];
    this.loading = false;
    this.checkBoxText = "Show All Products";
    this.GetProductionpro();
   }
  }
  ProductChange() {
    this.BatchNoList =[];
  if(this.ObjproductAdd.Product_ID) {
    const ctrl = this;
    this.GetBatchNo();
    const productObj = $.grep(ctrl.ProductionlList,function(item) {return item.Product_ID == ctrl.ObjproductAdd.Product_ID})[0];
    //console.log(productObj);
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
     this.ObjproductAdd.Batch_No = this.BatchNoList.length ? this.BatchNoList[0].Batch_No : undefined;
     //console.log('Batch No ==', data)

    });
  }
  Getprocessname() {
    if(this.FromProcessList.length) {
      const tempArry = this.FromProcessList.filter(item => Number(item.From_Process_ID) === Number(this.Objproduction.From_Process_ID));
      return  tempArry.length ? '( '+ tempArry[0].From_Process_Name + ' )' : '-';
    }
    return '-'
  }
  AddProductDetails(valid){
  //console.log('add ===', valid)
  this.AddProDetailsFormSubmitted = true;
  if(valid && this.GetSelectedBatchqty()){
    //console.log(this.ObjproductAdd.Batch_No)
    //var RR = this.ReturnReasonid.find(Return_Reason => Return_Reason.Return_Reason_ID == this.ObjProductaddForm.Return_Reason_ID);
  var productObj = {
    //ID : this.ObjproductAdd.ID,
    Product_ID : this.ObjproductAdd.Product_ID,
    Product_Description : this.ObjproductAdd.Product_Description,
    Batch_No : this.ObjproductAdd.Batch_No,
    Stock_Qty :  this.ObjproductAdd.Stock_Qty,
    //Req_No : this.SelectedIndent
    //Return_Reason : RR.Return_Reason
  };
  this.AddProDetails.push(productObj);
 // console.log("Product Submit",this.AddProDetails);
  this.AddProDetailsFormSubmitted = false;
  this.ObjproductAdd = new productAdd();
  this.BatchNoList = [];
  this.ProtypeDisabled = true;
 // this.ExProductFlag = false;
  }
  }
  GetSelectedBatchqty () {
   // if (this.Objproduction.Process_ID.toString() !== '1' && !this.ObjproductAdd.Batch_No ) {
    if (this.Objproduction.From_Process_ID !== undefined && !this.ObjproductAdd.Batch_No) {
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Can't add product without batch No."
        });
    return false;
    }
    const sameproduct = this.AddProDetails.filter(item=> item.Product_ID === this.ObjproductAdd.Product_ID && !this.ObjproductAdd.Batch_No);
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
  getTotalIndValue(){
    let Indval = 0;
    this.filteredData.forEach((item)=>{
      Indval += Number(item.req_qty)
    });

    return Indval ? Indval : '-';
  }
  getTotalProValue(){
    let proval = 0;
    this.filteredData.forEach((item)=>{
      proval += Number(item.Qty)
    });

    return proval ? proval : '-';
  }
  showDialog(valid) {
    this.ProductionFormSubmitted2 = true;
    if(valid){
    if(this.checkLockDate(this.DateService.dateConvert(new Date(this.Datevalue)))) {
      this.ProductionFormSubmitted2 = false;
    this.displaysavepopup = true;
    this.filteredData = [];
    this.BackUpProductionlList.forEach(obj => {
      if(obj.Qty && Number(obj.Qty) !== 0 ){
      //  console.log(filteredData.push(obj.Product_ID));
      this.filteredData.push(obj);
       // console.log("this.filteredData===",this.filteredData);
    }
   })
    } else {
      this.Spinner = false;
    }
    } else {
      this.Spinner = false;
    }
  }
  getReqNo(){
    let Rarr:any =[]
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
  SaveProduction(){
    //this.ProductionFormSubmitted2 = true;
    //if(valid){
      this.ngxService.start();
      this.displaysavepopup = false;
      const obj = {
        "SP_String": "SP_Production_Voucher_New",
        "Report_Name_String" : "Add Production Voucher",
       "Json_Param_String": this.dataforSaveProduction(),
       "Json_1_String" : this.getReqNo()

      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        //console.log(data);
        var tempID = data[0].Column1;
        this.Objproduction.Doc_No = data[0].Column1;
        if(data[0].Column1){
          this.ngxService.stop();
          this.compacctToast.clear();
          const mgs = this.buttonname === "Save & Print" ? "Saved" : "Updated";
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Production Voucher  " + tempID,
           detail: "Succesfully  " + mgs
         });
         if (this.buttonname == "Save & Print") {
         this.saveNprintProVoucher();
         }
         this.clearData();
         this.AddProDetails =[];
         this.FromProcessList =[];
         this.displaysavepopup = false;
         this.SelectedIndent = [];
         this.IndentFilter = [];
         //this.BatchNoList = [];
         //this.ProcessProductList =[];
        //  this.ProductionlList = [];
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
   // }
   }
  dataforSaveProduction(){
    let obj = {};
  // console.log(this.DateService.dateConvert(new Date(this.myDate)))
   this.Objproduction.Doc_Date = this.DateService.dateConvert(new Date(this.Datevalue));
  if(this.BackUpProductionlList.length ) {
    let tempArr:any = [];
    this.BackUpProductionlList.forEach(item => {
      if(item.Qty && Number(item.Qty) !== 0){
        obj = {
          // ID : item.ID,
         Product_Type_ID : item.Product_Type_ID,
         Product_ID : item.Product_ID,
         Product_Description : item.Product_Description,
         Batch_No : " ",
         Qty : Number(item.Qty),
         Doc_No : this.Objproduction.Doc_No ?  this.Objproduction.Doc_No : "A",
         Doc_Date : this.Objproduction.Doc_Date,
         Shift_ID : this.Objproduction.Shift,
         Process_ID : this.Objproduction.Process_ID,
        // Product_Type : this.Objproduction.Product_Type_ID,
         From_Process_ID : this.Objproduction.From_Process_ID ? this.Objproduction.From_Process_ID : 0,
         Brand_ID : this.Objproduction.Brand_ID,
         UOM : "PCS",
         Remarks : " ",
         From_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
         From_godown_id : this.Objproduction.From_godown_id ? this.Objproduction.From_godown_id : 0,
         To_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
         To_godown_id : this.Objproduction.To_godown_id,
         User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
         Req_Qty : item.req_qty,
         Adv_Order_No : "NA",
         Order_Txn_ID : 0,
         Req_Date : this.DateService.dateConvert(new Date(this.todayDate)),
         Shop_Cost_Center : item.Cost_Cen_ID,
        // Req_No : item.Req_No
       }
       tempArr.push(obj);
      }

     });
    //  let Rarr =[]
    //   this.SelectedIndent.forEach(el => {
    //     if(el){
    //       const Robj = {
    //         Req_No : el,
    //         }
    //         Rarr.push(Robj)
    //     }

    // });
    console.log("Save Data ===", tempArr)
    //return JSON.stringify([...tempArr,...Rarr]);
    return JSON.stringify(tempArr);
  }
  }
  saveNprintProVoucher(){
    if (this.Objproduction.Doc_No) {
      window.open("/Report/Crystal_Files/K4C/K4C_Production_Voucher.aspx?DocNo=" + this.Objproduction.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
   );
    }
  }
  // CREATE END

  // BROWSE START
  GetBrowseDate(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Production Date"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrowseDate = data;
      this.BDate =  new Date(data[0].Column1);
      this.initDate = [this.BDate , this.BDate];
      //console.log("ProDate List ===",this.ProDatelist);

      console.log("this.initDate ==", this.initDate)
    })
  }
  getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjBrowse.start_date = dateRangeObj[0];
    this.ObjBrowse.end_date = dateRangeObj[1];
  }
  }
  SearchProduction(){
    this.seachSpinner = true;
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
  "SP_String": "SP_Production_Voucher_New",
  "Report_Name_String": "Browse Production Voucher",
  "Json_Param_String": JSON.stringify([tempobj])
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   this.BackupSearchedlist = data;
   this.GetDistinct();
   //console.log('search list=====',this.Searchedlist)
   this.seachSpinner = false;
 })
  }
  // DISTINCT & FILTER
  GetDistinct() {
    let DProcessName:any = [];
    let DProductType:any = [];
    let DShift:any = [];
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
    let DProcessName:any = [];
    let DProductType:any = [];
    let DShift:any = [];
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

  ViewProduction(DocNo){
    //console.log("View ==",DocNo);
  this.clearData();
  //this.editList = [];
  this.Doc_no = undefined;
  this.Doc_date = undefined;
  this.BrandName = undefined;
  this.ProcessName = undefined;
  this.FprocessName = undefined;
  this.Producttype = undefined;
  this.TotalQty = undefined;
  this.Vshift = undefined;
  this.FstockPoint = undefined;
  this.TostockPoint = undefined;
  if(DocNo.Doc_No){
  this.Objproduction.Doc_No = DocNo.Doc_No;
  this.GetEditProduction(this.Objproduction.Doc_No);
  setTimeout(() => {
    this.ViewPoppup = true;
  }, 500);
  
  }
  }
  // EDIT
  EditProduction(DocNo){
   // console.log("editmaster ==",DocNo);
  this.AddProDetails = [];
  this.clearData();
  if(DocNo.Doc_No){
  if(this.checkLockDate(DocNo.Doc_Date)){
  this.checkBoxdis = false;
  this.editDis = true;
  this.Objproduction.Doc_No = DocNo.Doc_No;
  this.tabIndexToView = 1;
  this.items = ["BROWSE", "UPDATE"];
  this.buttonname = "Update";
  // console.log("this.EditDoc_No ==", this.Objproduction.Doc_No);
  this.GetEditProduction(this.Objproduction.Doc_No);
  this.getIndentForEdit(this.Objproduction.Doc_No);
  //this.getadvorderdetails(this.Objcustomerdetail.Bill_No);
  }
  }
  }
  GetEditProduction(Doc_No){
    this.editList = [];
    this.ProductionFormSubmitted = false;
    this.ngxService.start();
    const obj = {
      "SP_String": "SP_Production_Voucher_New",
      "Report_Name_String": "Get Production Voucher Details For Edit",
      "Json_Param_String": JSON.stringify([{Doc_No : this.Objproduction.Doc_No}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Data From Api",data);
      this.editList = data;
      this.Objproduction.Brand_ID = data[0].Brand_ID;
      this.Objproduction.Process_ID = data[0].Process_ID;
      //this.GetFromProcess();
      //this.Objproduction.From_Process_ID = data[0].From_Process_ID ? data[0].From_Process_ID : undefined;
      this.GetFromProcess();
      this.Objproduction.From_Process_ID = data[0].From_Process_ID ? data[0].From_Process_ID : undefined;
      //this.Objproduction.From_Process_ID = data[0].From_Process_ID;
      this.Objproduction.From_Cost_Cen_ID = data[0].From_Cost_Cen_ID;
      this.Objproduction.From_godown_id = data[0].From_godown_id ? data[0].From_godown_id : undefined;
      this.Objproduction.Product_Type_ID = data[0].Product_Type_ID ? data[0].Product_Type_ID : undefined;
      this.GetProductType(true);
     // this.GetProductionpro();
      this.Objproduction.Shift = data[0].Shift_ID;
      this.Objproduction.To_Cost_Cen_ID = data[0].To_Cost_Cen_ID;
      this.Objproduction.To_godown_id = data[0].To_godown_id;

      //this.Datevalue = data[0].Doc_Date;
      this.Datevalue = new Date(data[0].Doc_Date);
      let Datetemp:Date =  new Date(data[0].Doc_Date)
      const Timetemp =  Datetemp.setDate(Datetemp.getDate() - 1);
      this.minDate = new Date(Timetemp);
      console.log("minDate==", this.minDate)
      // this.minDate =  new Date(data[0].Column1);
       let tempDate:Date =  new Date(data[0].Doc_Date)
      const tempTimeBill =  tempDate.setDate(tempDate.getDate() + 1);
      this.maxDate = new Date(tempTimeBill);

      this.todayDate = data[0].Req_Date;
       data.forEach(element => {
       const  productObj = {
          //ID : element.ID,
          Product_ID : element.Product_ID,
          Product_Description : element.Product_Description,
          Qty :  Number(element.Qty),
          req_qty : element.Req_Qty,
          Product_Type : element.Product_Type,
          Product_Type_ID : element.Product_Type_ID,
          Req_No : element.Req_No
          // deleteflag : true
        };
         this.ProductionlList.push(productObj);


         //
    });
    this.BackUpProductionlList = [...this.ProductionlList];
    //this.backUpproductList = this.productList;
    this.BackupIndentList = this.IndentNoList;
    this.GetIndentdist();

    // FOR VIEW
    this.Doc_no = data[0].Doc_No;
    this.Doc_date = new Date(data[0].Doc_Date);
    this.BrandName = data[0].Brand_Name ? data[0].Brand_Name : '-';
    this.ProcessName = data[0].Process_Name ? data[0].Process_Name : '-';
    this.FprocessName = data[0].From_Process_Name ? data[0].From_Process_Name : '-';
    this.Producttype = data[0].Product_Type ? data[0].Product_Type : '-';
    this.TotalQty = data[0].Qty ? data[0].Qty : '-';
    this.Vshift = data[0].Shift_Name ? data[0].Shift_Name : '-';
    this.FstockPoint = data[0].From_godown_name ? data[0].From_godown_name : '-';
    this.TostockPoint = data[0].To_godown_name ? data[0].To_godown_name : '-';

    this.ngxService.stop();

  })
  }
  getIndentForEdit(Doc_No){
    this.editIndentList = [];
    const obj = {
      "SP_String": "SP_Production_Voucher_New",
      "Report_Name_String": "Get REQ NO For PV Edit",
      "Json_Param_String": JSON.stringify([{Doc_No : this.Objproduction.Doc_No}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editIndentList = data;
      this.GetIndentdist();
    })
  }
  GetIndentdist(){
    let DIndentBy:any = [];
    this.IndentFilter = [];
    this.SelectedIndent =[];
    //this.SelectedDistOrderBy1 = [];
    this.editIndentList.forEach((item) => {
      if (DIndentBy.indexOf(item.Req_No) === -1) {
        DIndentBy.push(item.Req_No);
         this.IndentFilter.push({ label: item.Req_No + '(' + item.Location + ')' , value: item.Req_No });
         this.SelectedIndent.push(item.Req_No);
        console.log("this.TimerangeFilter", this.IndentFilter);
      }
    });
  }
  geteditReqNo(){
    if(this.SelectedIndent.length) {
      let Rarr:any =[]
      this.SelectedIndent.forEach(el => {
        if(el){
          const Dobj = {
            Req_No : el,
            Product_Type_ID : 0,
            Date : this.DateService.dateConvert(new Date(this.todayDate)),
            Brand_ID : this.Objproduction.Brand_ID
            }
            Rarr.push(Dobj)
        }

    });
      console.log("Table Data ===", Rarr)
      return Rarr.length ? JSON.stringify(Rarr) : '';
    }
  }
  GetProductionproforEdit(){
      //this.checkBoxdis = false;
      this.allProductsCheck = false;
      this.loading = true;
      const obj = {
        "SP_String": "SP_Production_Voucher_New",
        "Report_Name_String": "GET_Production_Products_For_PV_Edit",
        "Json_Param_String": this.geteditReqNo()
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.ProductionlList = data;
        this.ProductionlList.forEach(el=>{
          el['stock_qty'] = el.stock_qty > 0 ? el.stock_qty : 0;
          el['Qty'] = el.req_qty ? Number(Number(el.req_qty) - Number(el.stock_qty)) : undefined;
        })
        this.BackUpProductionlList = [...this.ProductionlList];
        this.loading = false;
      })
   // }

  }
  PrintProVoucher(obj){
    if (obj.Doc_No) {
      window.open("/Report/Crystal_Files/K4C/K4C_Production_Voucher.aspx?DocNo=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

      );
    }
  }
  DeleteProduction(docNo){
    this.Objproduction.Doc_No = undefined ;
    if(docNo.Doc_No){
    if(this.checkLockDate(docNo.Doc_Date)){
    this.Objproduction.Doc_No = docNo.Doc_No;
    this.doc_date = docNo.Doc_Date;
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
  onConfirm() {
    const Tempobj = {
      Doc_No : this.Objproduction.Doc_No,
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
      Doc_Date : this.doc_date
    }
    const obj = {
      "SP_String" : "SP_Production_Voucher_New",
      "Report_Name_String" : "Delete Production Voucher Details",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log(data);
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
  this.editList = [];
  this.editIndentList = [];
  //const obj = {...this.Objproduction}
  this.Objproduction.Doc_No = undefined;
  this.Objproduction.From_Process_ID = undefined;
  this.ProductionFormSubmitted2 = false;
  //if(this.FromProcessList = []){
    //if(this.Objproduction.From_Process_ID = undefined){
      this.FPDisabled = true;
      this.BatchDisabled = true;
      this.allProductsCheck = false;
      this.checkBoxText = "Show All Products";
      this.checkBoxdis = true;
      this.editDis = false;
 // }
  // else{
  //      this.FPDisabled = false;
  // }
  this.Objproduction.From_godown_id = undefined;
  this.Objproduction.Product_Type_ID = undefined;
  this.Objproduction.Shift = this.SiftList.length ? this.SiftList[0].Shift_ID : undefined;
  this.Objproduction.To_godown_id = this.ToGodownList.length ? this.ToGodownList[0].godown_id : undefined;
  this.GetProDate();
  this.ProductionlList = [];
  this.BackUpProductionlList = [];
  this.inputBoxDisabled = false;
  //this.ProductDetailsList = [];
  this.ProductionFormSubmitted = false;
  this.AddProDetailsFormSubmitted = false;
  this.ProtypeDisabled = false;
  this.ProcessProductList =[];
  this.items = ["BROWSE", "CREATE"];
  this.buttonname = "Save & Print"
  //this.SearchProduction();
  //this.ProductionlList = [];
  this.Datevalue = this.DateService.dateConvert(new Date(this.Datevalue));
  this.todayDate = new Date();
  this.ngxService.stop();
  this.loading = false;
  }
  Refresh(){
    //this.clearData();
    this.ObjproductAdd = new productAdd();
    this.Objproduction.Brand_ID = undefined;
    this.Objproduction.Process_ID = undefined;
    //const obj = {...this.Objproduction}
   // this.Objproduction.Doc_No = undefined;
    this.Objproduction.From_Process_ID = undefined;
    //if(this.FromProcessList = []){
      //if(this.Objproduction.From_Process_ID = undefined){
        this.FPDisabled = true;
        this.BatchDisabled = true;
        this.allProductsCheck = false;
        this.checkBoxText = "Show All Products"
        this.checkBoxdis = true;
        this.editDis = false;
   // }
    // else{
    //      this.FPDisabled = false;
    // }
    this.Objproduction.From_godown_id = undefined;
    this.Objproduction.Product_Type_ID = undefined;
    this.Objproduction.Shift = this.SiftList.length === 2 ? this.SiftList[0].Shift_ID : undefined;
   // this.Objproduction.To_godown_id = this.ToGodownList.length === 3 ? this.ToGodownList[0].godown_id : undefined;
    this.Objproduction.To_godown_id = this.ToGodownList.length  ? this.ToGodownList[0].godown_id : undefined;
    this.GetProDate();
    this.ProductionlList = [];
    this.BackUpProductionlList = [];
    this.inputBoxDisabled = false;
    //this.ProductDetailsList = [];
    this.ProductionFormSubmitted = false;
    this.AddProDetailsFormSubmitted = false;
    this.ProtypeDisabled = false;
    this.ProcessProductList =[];
    this.AddProDetails = [];
    //this.Datevalue = this.DateService.dateConvert(new Date(this.Datevalue));
    this.todayDate = new Date();
    this.SelectedIndent = [];
    this.IndentFilter = []
    this.ngxService.stop();
    this.loading = false;
  }
}
class production {
  Doc_No : any;
  Brand_ID : any;
  Product_Type_ID : any;
  Process_ID : any;
  From_Process_ID : any;
  From_Process_Name : string;
  Previous_Process_ID : string;
  Previous_Process_Name : string;
  Shift : string;
  From_godown_id : any;
  To_godown_id : string;
  To_Cost_Cen_ID : string;
  From_Cost_Cen_ID : string;
  Doc_Date : any;
  User_ID : string;;
  Remarks : any;
  indent_Date : any;
  indentNo : any;
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
