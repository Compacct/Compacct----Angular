import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service"
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-k4c-raw-material-stock-transfer',
  templateUrl: './k4c-raw-material-stock-transfer.component.html',
  styleUrls: ['./k4c-raw-material-stock-transfer.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cRawMaterialStockTransferComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  ShowSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  myDate = new Date();
  ObjRawMateriali : RawMateriali = new RawMateriali ();
  RawMaterialIssueFormSubmitted = false;
  ObjBrowse : Browse = new Browse ();
  Fcostcenlist:any = [];
  FromGodownList:any = [];
  Tocostcenlist:any = [];
  ToGodownList:any = [];
  FCostdisableflag = false;
  FGdisableflag = false;
  TGdisableflag = false;
  IndentListFormSubmitted = false;
  IndentList:any = [];
  ProductList:any = [];
  SelectedIndent: any;
  BackupIndentList:any = [];
  IndentFilter:any = [];
  TIndentList:any = [];
  Searchedlist:any = [];
  flag = false;
  productListFilter:any = [];
  SelectedProductType:any = [];
  Param_Flag ='';
  CostCentId_Flag : any;
  MaterialType_Flag = '';
  TCdisableflag = false;
  todayDate = new Date();
  initDate:any = [];
  RawMaterialIssueSearchFormSubmitted = false;
  ToBcostcenlist:any = [];
  ToBGodownList:any = [];
  TBCdisableflag = false;
  TBGdisableflag = false;
  ViewPoppup = false;
  Viewlist:any = [];
  Doc_date: any;
  Formstockpoint: any;
  Tostockpoint: any;
  displaysavepopup = false;
  filteredData:any = [];
  ShowPopupSpinner = false;
  editList:any = [];
  editIndentList:any = [];

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private route : ActivatedRoute,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) {
  //     this.route.queryParams.subscribe(params => {
  //      //console.log("params",params);
  //     this.Param_Flag = params['Name'];
  //     this.CostCentId_Flag = params['Cost_Cen_ID'];
  //     this.MaterialType_Flag = params['Material_Type']
  //      console.log (this.CostCentId_Flag);
  // })
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
    this.items = ["BROWSE", "CREATE"];
    this.clearData();
    this.Searchedlist = [];
    this.BackupIndentList = [];
    this.TIndentList = [];
    this.SelectedIndent = [];
    this.editList = [];
      //console.log("params",params);
     this.Param_Flag = params['Name'];
     this.CostCentId_Flag = params['Cost_Cen_ID'];
     this.MaterialType_Flag = params['Material_Type']
      console.log (this.CostCentId_Flag);
    this.Header.pushHeader({
      Header: this.MaterialType_Flag + " Stock Transfer - " + this.Param_Flag,
      Link: " Material Management -> " + this.MaterialType_Flag + " Stock Transfer - " + this.Param_Flag
    });
    this.GetFromCostCen();
    this.GetToCostCen();
    this.GetBToCostCen();
    this.GetProductType();
  })
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Save";
     this.clearData();
     this.BackupIndentList = [];
     this.TIndentList = [];
     this.SelectedIndent = [];
     this.editList = [];
   }
   onReject() {
    this.compacctToast.clear("c");
  }
   GetFromCostCen(){
    const tempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Material_Type : this.MaterialType_Flag
    }
    const obj = {
      "SP_String": "SP_Raw_Material_Stock_Transfer",
      "Report_Name_String": "Get Cost Centre",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Fcostcenlist = data;
     this.ObjRawMateriali.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.GetFromGodown();
     })
  }

  GetFromGodown(){
    if(this.ObjRawMateriali.From_Cost_Cen_ID){
      const tempObj = {
        Cost_Cen_ID : this.ObjRawMateriali.From_Cost_Cen_ID,
        Material_Type : this.MaterialType_Flag
      }
      const obj = {
        "SP_String": "SP_Raw_Material_Stock_Transfer",
        "Report_Name_String": "Get - Godown",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.FromGodownList = data;
        //this.ObjRawMateriali.From_godown_id = data[0].godown_id;
        this.ObjRawMateriali.From_godown_id = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
       if(this.FromGodownList.length === 1){
         this.FGdisableflag = true;
       }else{
         this.FGdisableflag = false;
       }
         //console.log("From Godown List ===",this.FromGodownList);
      })
    }

  }
  GetToCostCen(){
    // const tempObj = {
    //   User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
    //   Material_Type : this.MaterialType_Flag
    // }
    let spname = ''
    let reportname = ''
    if(this.MaterialType_Flag === "Maintenance"){
      spname = "SP_Controller_Master"
      reportname = "Get - Outlet Name"
    } else {
      spname = "SP_Raw_Material_Stock_Transfer"
      reportname = "Get Cost Centre Non outlet"
    }
    const obj = {
      "SP_String": spname,
      "Report_Name_String": reportname,
      //"Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Tocostcenlist = data;
     // if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
      if (this.CostCentId_Flag && this.MaterialType_Flag != "Maintenance") {
      this.ObjRawMateriali.To_Cost_Cen_ID = String(this.CostCentId_Flag);
      this.TCdisableflag = true;
      this.GetToGodown();
      } else {
        this.ObjRawMateriali.To_Cost_Cen_ID = undefined;
        this.TCdisableflag = false;
        this.GetToGodown();
      }
     // console.log("To Cost Cen List ===",this.Tocostcenlist);
    })
  }
  GetToGodown(){
    this.ToGodownList = [];
    //if(this.ObjRawMateriali.To_Cost_Cen_ID){
      const tempObj = {
        Cost_Cen_ID : this.ObjRawMateriali.To_Cost_Cen_ID,
        Material_Type : this.MaterialType_Flag
      }
      const obj = {
        "SP_String": "SP_Raw_Material_Stock_Transfer",
        "Report_Name_String": "Get - Godown",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.ToGodownList = data;
  // this.ObjRawMateriali.To_godown_id = this.ToGodownList.length === 1 ? this.ToGodownList[0].godown_id : undefined;
      if(this.buttonname === "Save"){
       if(this.ToGodownList.length === 1){
        this.ObjRawMateriali.To_godown_id = this.ToGodownList[0].godown_id;
         this.TGdisableflag = true;
       }else{
        this.ObjRawMateriali.To_godown_id = undefined;
         this.TGdisableflag = false;
       }
       this.getIndent();
      }
       //console.log("To Godown List ===",this.ToGodownList);
      })
    //}

  }
  GetBToCostCen(){
    let spname = ''
    let reportname = ''
    if(this.MaterialType_Flag === "Maintenance"){
      spname = "SP_Controller_Master"
      reportname = "Get - Outlet Name"
    } else {
      spname = "SP_Raw_Material_Stock_Transfer"
      reportname = "Get Cost Centre Non outlet"
    }
    const obj = {
      "SP_String": spname,
      "Report_Name_String": reportname,
     // "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ToBcostcenlist = data;
     // if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
      if (this.CostCentId_Flag && this.MaterialType_Flag != "Maintenance") {
      this.ObjBrowse.To_Cost_Cen_ID = String(this.CostCentId_Flag);
      this.TBCdisableflag = true;
      this.GetBToGodown();
      } else {
        this.ObjBrowse.To_Cost_Cen_ID = undefined;
        this.TBCdisableflag = false;
        this.GetBToGodown();
       // this.ToBGodownList = [];
      }
      console.log("To B Cost Cen List ===",this.ToBcostcenlist);
    })
  }
  GetBToGodown(){
    this.ToBGodownList = [];
    //if(this.ObjBrowse.To_Cost_Cen_ID){
      const tempObj = {
        Cost_Cen_ID : this.ObjBrowse.To_Cost_Cen_ID,
        Material_Type : this.MaterialType_Flag
      }
      const obj = {
        "SP_String": "SP_Raw_Material_Stock_Transfer",
        "Report_Name_String": "Get - Godown",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.ToBGodownList = data;
  // this.ObjRawMateriali.To_godown_id = this.ToGodownList.length === 1 ? this.ToGodownList[0].godown_id : undefined;
       if(this.ToBGodownList.length === 1){
        //this.ObjRawMateriali.To_godown_id = this.ToGodownList[0].godown_id;
        this.ObjBrowse.To_godown_id = this.ToBGodownList[0].godown_id;
         this.TBGdisableflag = true;
       }else{
       // this.ObjRawMateriali.To_godown_id = undefined;
        this.ObjBrowse.To_godown_id = undefined;
         this.TBGdisableflag = false;
       }
       //console.log("To Godown List ===",this.ToGodownList);
      })
    //}

  }

  getIndent(){
    this.IndentList = [];
    const obj = {
      "SP_String": "SP_Raw_Material_Stock_Transfer",
      "Report_Name_String": "Get Indent Nos",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID:this.ObjRawMateriali.To_Cost_Cen_ID, Godown_ID : this.ObjRawMateriali.To_godown_id}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length){
        data.forEach(element => {
          element['value'] = element.Doc_No;
          element['label'] = element.Doc_No + '(' + this.DateService.dateConvert(new Date(element.Doc_Date)) + ')';
        });
        this.IndentList = data;
      } else {
        this.IndentList = [];
      }
    })
  }
  GetIndentProductList(){
    this.ProductList = [];
    this.productListFilter = [];
    this.SelectedProductType = [];
    if(this.SelectedIndent.length) {
      let Arr:any =[]
      this.SelectedIndent.forEach(el => {
        if(el){
          const Dobj = {
            Indent_No : el,
            Cost_Cen_ID : this.ObjRawMateriali.To_Cost_Cen_ID,
            Godown_ID : this.ObjRawMateriali.To_godown_id
            }
      Arr.push(Dobj)
        }

    });
   const obj = {
    "SP_String": "SP_Raw_Material_Stock_Transfer",
    "Report_Name_String" : "Stock of Product list in Indent",
   "Json_Param_String": JSON.stringify(Arr)

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   const tempData = data
   tempData.forEach(element => {
    element['Issue_Qty'] = undefined;
 });
   this.ProductList = tempData;
   this.ShowSpinner = false;
   this.BackupIndentList = tempData;
    this.RawMaterialIssueFormSubmitted = false;
    this.GetProductType();
   console.log("this.ProductList======",this.ProductList);
   })
  }
  }
  getspecificgodownproduct(valid){
    this.RawMaterialIssueFormSubmitted = true;
    this.ShowSpinner = true;
    if(valid){
    if((Number(this.ObjRawMateriali.To_godown_id) === 42) || (Number(this.ObjRawMateriali.To_godown_id) === 43) ||
      (Number(this.ObjRawMateriali.To_godown_id) === 46) || (Number(this.ObjRawMateriali.To_godown_id) === 72) ||
      (Number(this.ObjRawMateriali.To_godown_id) === 73) || (Number(this.ObjRawMateriali.To_godown_id) === 89) || 
      (Number(this.ObjRawMateriali.From_godown_id) === 128)) {
    this.GetProductList();
    }
  else {
    this.RawMaterialIssueFormSubmitted = false;
    this.ShowSpinner = false;
    this.compacctToast.clear();
    this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "There is No Indent. "
      });
  }
  }
  }

  // FOR PRODUCT TABLE
  GetProductList(){
    // if (this.IndentList.length) {
    // this.RawMaterialIssueFormSubmitted = true;
    // if(valid){
      // this.ShowSpinner = true;
    const TempObj = {
      Cost_Cen_ID : this.ObjRawMateriali.From_Cost_Cen_ID,
      Godown_ID : this.ObjRawMateriali.From_godown_id,
      Material_Type : this.MaterialType_Flag
     }
   const obj = {
    "SP_String": "SP_Raw_Material_Stock_Transfer",
    "Report_Name_String" : "Product For Raw Material Stock Transfer",
   "Json_Param_String": JSON.stringify([TempObj])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   const tempData = data
   tempData.forEach(element => {
    element['Issue_Qty'] = undefined;
 });
   this.ProductList = tempData;
   this.ShowSpinner = false;
   this.BackupIndentList = tempData;
    this.RawMaterialIssueFormSubmitted = false;
    this.GetProductType();
   console.log("this.ProductList======",this.ProductList);
   })
  // }
  // }
  // else {
  //   this.compacctToast.clear();
  //   this.compacctToast.add({
  //       key: "compacct-toast",
  //       severity: "error",
  //       summary: "Warn Message",
  //       detail: "There is No Indent. "
  //     });
  // }
  }
  // product Filter

  filterProduct(){
    if(this.SelectedProductType.length){
      let tempProduct:any = [];
      this.SelectedProductType.forEach(item => {
        this.BackupIndentList.forEach((el,i)=>{

          const ProductObj = this.BackupIndentList.filter((elem) => elem.Product_Type == item)[i];
          //const ProductObj = el;
         // console.log("ProductObj",ProductObj);
          if(ProductObj)
          tempProduct.push(ProductObj)
        })
        })
     this.ProductList  = [...tempProduct];
   }
    else {
    this.ProductList  = [...this.BackupIndentList];

    }
  }
GetProductType(){
  let DOrderBy:any = [];
    this.productListFilter = [];
    //this.SelectedDistOrderBy1 = [];
    this.BackupIndentList.forEach((item) => {
      if (DOrderBy.indexOf(item.Product_Type) === -1) {
        DOrderBy.push(item.Product_Type);
        //this.SelectedProductType.push(item.Product_Type);
        this.productListFilter.push({ label: item.Product_Type, value: item.Product_Type });
       // console.log("this.productListFilter", this.productListFilter);
      }
    });
}

  // GET PRODUCT LIST
  dataforproduct(){
    if(this.SelectedIndent.length) {
      let Arr:any =[]
      this.SelectedIndent.forEach(el => {
        if(el){
          const Dobj = {
            Doc_No : el,
            Cost_Cen_ID : this.ObjRawMateriali.From_Cost_Cen_ID,
            Godown_ID : this.ObjRawMateriali.From_godown_id,
            To_Cost_Cen_ID : this.ObjRawMateriali.To_Cost_Cen_ID,
            To_Godown_ID : this.ObjRawMateriali.To_godown_id,
            Material_Type : this.MaterialType_Flag
            }
      Arr.push(Dobj)
        }

    });
      console.log("Table Data ===", Arr)
      return Arr.length ? JSON.stringify(Arr) : '';
    }
  }
  GetProduct(arr){
    // const TempObj = {
    //   Cost_Cen_ID : this.ObjRawMateriali.From_Cost_Cen_ID,
    //   Godown_ID : this.ObjRawMateriali.From_godown_id,
    //  }
    if(this.dataforproduct()){
   const obj = {
    "SP_String": "SP_Raw_Material_Issue",
    "Report_Name_String" : "Get Product",
    "Json_Param_String": this.dataforproduct()
   //"Json_Param_String": JSON.stringify([TempObj])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(arr.length) {
      arr.forEach(elem => {
       data.forEach( item =>{
          if(Number(item.Product_ID) === Number(elem.Product_ID)){
            item.Issue_Qty = elem.Issue_Qty
          }
        });
      })
    }
    this.ProductList = data;
   console.log("this.ProductList======",this.ProductList);


  });
}
  }
  qtyChq(col){
    this.flag = false;
    console.log("col",col);
    if(col.Issue_Qty){
      if(col.Issue_Qty <=  col.Batch_Qty){
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
   for(let i = 0; i < this.ProductList.length ; i++){
    if(Number(this.ProductList[i].Batch_Qty) <  Number(this.ProductList[i].Issue_Qty)){
      flag = false;
      break;
    }
   }
   return flag;
  }
  // SAVE AND UPDATE
  CheckRemarks(col) {
      if (Number(col.Issue_Qty) === 0 && !col.Store_Remarks) {
        return true;
      } else {
        return false;
      }
    
  }
  ValidRemarksCheck() {
  let ValidFlag = false;
  for (let index = 0; index < this.ProductList.length; index++) {
    const element = this.ProductList[index];
    if (this.CheckRemarks(element)) {
      ValidFlag = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "warn",
        summary: "Validation",
        detail: "Enter Remarks."
      });
      return ValidFlag;
    } else {
      ValidFlag = true;
    }

  }
  return ValidFlag;
}
  showDialog() {
    if(this.saveqty()){
    this.filteredData = [];
  //   this.BackUpproductDetails.forEach(obj => {
  //     if(obj.Delivery_Qty && Number(obj.Delivery_Qty) !== 0 ){
  //     //  console.log(filteredData.push(obj.Product_ID));
  //     this.filteredData.push(obj);
  //      // console.log("this.filteredData===",this.filteredData);
  //   }
  //  })
   this.ProductList.forEach(obj => {
    if (this.buttonname === "Update"){
      if(this.ValidRemarksCheck()) {
      this.filteredData.push(obj);
      this.displaysavepopup = true;
    } 
    // else {
    //   this.compacctToast.clear();
    //     this.compacctToast.add({
    //       key: "compacct-toast",
    //       severity: "error",
    //       summary: "Warn Message",
    //       detail: "Something Wrong."
    //     });
    // }
    }
    else {
    if(obj.Issue_Qty && Number(obj.Issue_Qty) !== 0){  //   && Number(obj.Delivery_Qty) !== 0
    //  console.log(filteredData.push(obj.Product_ID));
    this.filteredData.push(obj);
    this.displaysavepopup = true;
     // console.log("this.filteredData===",this.filteredData);
  }
  }
 })
  }
    else {
      this.compacctToast.clear();
      this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Quantity can't be more than in batch available quantity "
        });
  }
  }
  getTotalValue(key){
    let Total = 0;
    this.filteredData.forEach((item)=>{
      Total += Number(item[key]);
    });
  
    return Total ? Total.toFixed(2) : '-';
  }
  dataforSaveRawMaterialIssueforEdit(){
    // console.log(this.DateService.dateConvert(new Date(this.myDate)))
     this.ObjRawMateriali.Doc_Date = this.DateService.dateConvert(new Date(this.todayDate));
    if(this.ProductList.length) {
      let tempArr:any =[]
      this.ProductList.forEach(item => {
     const TempObj = {
            Doc_No:  this.ObjRawMateriali.Doc_No ?  this.ObjRawMateriali.Doc_No : "A",
            Doc_Date: this.ObjRawMateriali.Doc_Date,
            From_Cost_Cen_ID :this.ObjRawMateriali.From_Cost_Cen_ID,
            From_godown_id	: this.ObjRawMateriali.From_godown_id,
            To_Cost_Cen_ID	: this.ObjRawMateriali.To_Cost_Cen_ID,
            To_godown_id	: this.ObjRawMateriali.To_godown_id,
            Product_ID	: item.Product_ID,
            Product_Description	: item.Product_Description,
            Product_Type_ID	: item.Product_Type_ID,
            Qty	: item.Issue_Qty,
            Accepted_Qty: Number(item.Accepted_Qty),
            UOM	: item.UOM,
            User_ID	: this.$CompacctAPI.CompacctCookies.User_ID,
            Accepted_By : item.Accepted_By,
            Batch_No : item.Batch_No,
            Remarks : Number(item.Qty) === Number(item.Accepted_Qty) ? 'NA' : item.Remarks ,
            Store_Remarks : item.Store_Remarks,
            Total_Qty : Number(this.getTotalValue('Qty')),
            Total_Accepted_Qty : Number(this.getTotalValue('Accepted_Qty'))
         }
        tempArr.push(TempObj)
      });
      console.log("Save Data ===", tempArr)
      return JSON.stringify(tempArr);

    }
  }
  dataforSaveRawMaterialIssue(){
    // console.log(this.DateService.dateConvert(new Date(this.myDate)))
     this.ObjRawMateriali.Doc_Date = this.DateService.dateConvert(new Date(this.todayDate));
    if(this.ProductList.length) {
      let tempArr:any =[]
      this.ProductList.forEach(item => {
        if(item.Issue_Qty && Number(item.Issue_Qty) != 0) {
     const TempObj = {
            Doc_No:  this.ObjRawMateriali.Doc_No ?  this.ObjRawMateriali.Doc_No : "A",
            Doc_Date: this.ObjRawMateriali.Doc_Date,
            From_Cost_Cen_ID :this.ObjRawMateriali.From_Cost_Cen_ID,
            From_godown_id	: this.ObjRawMateriali.From_godown_id,
            To_Cost_Cen_ID	: this.ObjRawMateriali.To_Cost_Cen_ID,
            To_godown_id	: this.ObjRawMateriali.To_godown_id,
            Product_ID	: item.Product_ID,
            Product_Description	: item.Product_Description,
            Product_Type_ID	: item.Product_Type_ID,
            Qty	: item.Issue_Qty,
            Accepted_Qty: Number(item.Accepted_Qty),
            UOM	: item.UOM,
            User_ID	: this.$CompacctAPI.CompacctCookies.User_ID,
            Accepted_By : item.Accepted_By,
            Batch_No : item.Batch_No,
            Remarks : Number(item.Qty) === Number(item.Accepted_Qty) ? 'NA' : item.Remarks ,
            Store_Remarks : item.Store_Remarks,
            Total_Qty : Number(this.getTotalValue('Qty')),
            Total_Accepted_Qty : Number(this.getTotalValue('Accepted_Qty'))
         }
        tempArr.push(TempObj)
      }
      });
      console.log("Save Data ===", tempArr)
      return JSON.stringify(tempArr);

    }
  }
  getReqNo(){
    let Rarr:any =[]
    if(this.SelectedIndent.length) {
      this.SelectedIndent.forEach(el => {
        if(el){
          const Dobj = {
            Indent_No : el
            }
            Rarr.push(Dobj)
        }

    });
      // console.log("Table Data ===", Rarr)
      // return Rarr.length ? JSON.stringify(Rarr) : '';
    }
    else {
      const Dobj = {
        Indent_No : 'NA'
        }
        Rarr.push(Dobj)
    }
    console.log("Table Data ===", Rarr)
    return Rarr.length ? JSON.stringify(Rarr) : '';
  }
  SaveRawMaterialIssue(){
    this.ShowPopupSpinner = true;
    this.ngxService.start();
    if(this.ObjRawMateriali.From_Cost_Cen_ID == this.ObjRawMateriali.To_Cost_Cen_ID &&
      this.ObjRawMateriali.From_godown_id == this.ObjRawMateriali.To_godown_id){
        this.ShowPopupSpinner = false;
        this.ngxService.stop();
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "can't use same stock point with respect to same cost centre"
        });
        return false;
    }
    if(this.saveqty()){
      const obj = {
        "SP_String": "SP_Raw_Material_Stock_Transfer",
        "Report_Name_String" : "Save Raw Material Stock Transfer",
       "Json_Param_String": this.buttonname === "Update" ? this.dataforSaveRawMaterialIssueforEdit() : this.dataforSaveRawMaterialIssue(),
       "Json_1_String" : this.getReqNo()

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
         this.tabIndexToView = 0 ;
         this.items = ["BROWSE", "CREATE"];
         this.buttonname = "Save";
         this.GetSearchedList(true);
         this.clearData();
         this.displaysavepopup = false;
         this.ngxService.stop();
         this.ShowPopupSpinner = false;
         this.ProductList =[];
         this.IndentListFormSubmitted = false;
         this.editList = [];
        } else{
          this.ShowPopupSpinner = false;
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
    else{
      this.ShowPopupSpinner = false;
      this.ngxService.stop();
      this.compacctToast.clear();
      this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Quantity can't be more than in batch available quantity "
        });
    }

  }


  // FOR BROWSE
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  GetSearchedList(valid){
    this.Searchedlist = [];
  const start = this.ObjBrowse.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
  : this.DateService.dateConvert(new Date());

  this.seachSpinner = true;
  this.RawMaterialIssueSearchFormSubmitted = true;
  if (valid){
const tempobj = {
  From_date : start,
  To_Date : end,
  Cost_Cen_ID : this.ObjBrowse.To_Cost_Cen_ID ? this.ObjBrowse.To_Cost_Cen_ID : 0,
  Godown_ID : this.ObjBrowse.To_godown_id ? this.ObjBrowse.To_godown_id : 0

}
const obj = {
  "SP_String": "SP_Raw_Material_Stock_Transfer",
  "Report_Name_String": "Browse Raw Material Stock Transfer",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
   this.RawMaterialIssueSearchFormSubmitted = false;
 })
}
}
exportoexcel(Arr,fileName): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, fileName+'.xlsx');
}
  clearData(){
    this.ObjRawMateriali.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    // FOR CREATE TAB
    if (this.CostCentId_Flag && this.MaterialType_Flag != "Maintenance") {
      this.ObjRawMateriali.To_Cost_Cen_ID = String(this.CostCentId_Flag);
      this.TCdisableflag = true;
      this.GetToGodown();
      this.ObjBrowse.To_Cost_Cen_ID = String(this.CostCentId_Flag);
      this.TBCdisableflag = true;
      this.GetBToGodown();
      } else {
        this.ObjRawMateriali.To_Cost_Cen_ID = undefined;
        //this.ObjRawMateriali.To_godown_id = undefined;
        this.TCdisableflag = false;
        this.GetToGodown();
        this.ObjBrowse.To_Cost_Cen_ID = undefined;
        this.TBCdisableflag = false;
        this.GetBToGodown();
      }
      // FOR CREATE TAB
      
      // FOR BROWSE
      // if (this.CostCentId_Flag) {
      //   this.ObjBrowse.To_Cost_Cen_ID = String(this.CostCentId_Flag);
      //   this.TBCdisableflag = true;
      //   this.GetBToGodown();
      //   } else {
      //     this.ObjBrowse.To_Cost_Cen_ID = undefined;
      //     //this.ObjRawMateriali.To_godown_id = undefined;
      //     this.TBCdisableflag = false;
      //     this.GetBToGodown();
      //   }
        // FOR BROWSE

    this.ObjRawMateriali.From_godown_id = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
     if(this.FromGodownList.length === 1){
       this.FGdisableflag = true;
     }else{
       this.FGdisableflag = false;
     }
    // this.GetToGodown();
    // FOR CREATE TAB
     this.ObjRawMateriali.To_godown_id = this.ToGodownList.length === 1 ? this.ToGodownList[0].godown_id : undefined;
     if(this.ToGodownList.length === 1){
       this.TGdisableflag = true;
     }else{
       this.TGdisableflag = false;
     }
     // FOR CREATE TAB

     // FOR BROWSE TAB
     this.ObjBrowse.To_godown_id = this.ToBGodownList.length === 1 ? this.ToBGodownList[0].godown_id : undefined;
     if(this.ToBGodownList.length === 1){
       this.TBGdisableflag = true;
     }else{
       this.TBGdisableflag = false;
     }
     // FOR BROWSE TAB

    this.ObjRawMateriali.Remarks = [];
    this.ObjRawMateriali.Indent_List = undefined;
    this.ProductList = [];
    this.IndentList = [];
    this.BackupIndentList = [];
    this.TIndentList = [];
    this.SelectedIndent = [];
    this.IndentFilter = [];
    // Product Filter
    this.productListFilter = [];
    this.SelectedProductType = [];
    this.ShowSpinner = false;
    this.ObjRawMateriali.Doc_No = undefined;
    this.todayDate = new Date();
    this.RawMaterialIssueSearchFormSubmitted = false;

  }
  // View
  View(DocNo){
    this.Viewlist = [];
    this.ObjRawMateriali.Doc_No = undefined;
    this.Doc_date = undefined;
    this.Formstockpoint = undefined;
    this.Tostockpoint = undefined;
    if(DocNo.Doc_No){
      this.ObjRawMateriali.Doc_No = DocNo.Doc_No;
      this.Doc_date = DocNo.Doc_Date;
      this.Formstockpoint = DocNo.From_Godown_Name;
      this.Tostockpoint = DocNo.To_Godown_Name;
    // this.AuthPoppup = true;
    this.ViewPoppup = true;
    //this.tabIndexToView = 1;
     //console.log("this.EditDoc_No ", this.Adv_Order_No );
     this.geteditmaster(DocNo.Doc_No)
    }
  }
// Edit
EditIntStock(col){
  this.editList = [];
  this.ObjRawMateriali.Doc_No = undefined;
  if(col.Doc_No){
   this.ObjRawMateriali = col.Doc_No;
   this.tabIndexToView = 1;
   this.ProductList = [];
   this.BackupIndentList = [];
   this.items = ["BROWSE", "UPDATE"];
   this.buttonname = "Update";
   this.geteditmaster(col.Doc_No)
   this.getIndentForEdit(col.Doc_No);
  }

}
geteditmaster(Doc_No){
  const obj = {
    "SP_String": "SP_Raw_Material_Stock_Transfer",
  "Report_Name_String": "Get Raw Material Stock Transfer For Edit",
    "Json_Param_String": JSON.stringify([{Doc_No:Doc_No}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("Edit",data);
    this.editList = data;
    this.Viewlist = data;
    const TempData = data;
    this.todayDate = new Date(data[0].Doc_Date);
    this.ObjRawMateriali = data[0];
    this.GetToGodown();
    TempData.forEach(element => {
      this.ProductList.push({
        Current_Stock_In_Dept:element.Current_Stock_In_Dept,
        Issue_Qty:element.Qty,
        Accepted_Qty:element.Accepted_Qty,
        Product_Description:element.Product_Description,
        Product_ID:element.Product_ID,
        Product_Type:element.Product_Type,
        Product_Type_ID:element.Product_Type_ID,
        Stock_Qty:element.Stock_Qty,
        Requisition_Qty:element.Requisition_Qty,
        UOM : element.UOM,
        Batch_No : element.Batch_No,
        Batch_Qty : element.Batch_Qty,
        Remarks: element.Remarks,
        Store_Remarks: element.Store_Remarks
      })
     });
     this.BackupIndentList = this.ProductList;
     this.GetProductType();
  })
}
getIndentForEdit(masterProduct){
  this.editIndentList = [];
  const obj = {
    "SP_String": "SP_Raw_Material_Stock_Transfer",
    "Report_Name_String": "Get Indent No For Edit",
    "Json_Param_String": JSON.stringify([{Doc_No : masterProduct}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.editIndentList = data;
    this.GeteditIndentdist();
  })
}
GeteditIndentdist(){
  let DIndentBy:any = [];
  this.IndentList = [];
  this.SelectedIndent =[];
  //this.SelectedDistOrderBy1 = [];
  this.editIndentList.forEach((item) => {
    if (DIndentBy.indexOf(item.Indent_No) === -1) {
      DIndentBy.push(item.Indent_No);
       this.IndentList.push({ label: item.Indent_No, value: item.Indent_No });
       this.SelectedIndent.push(item.Indent_No);
      console.log("this.TimerangeFilter", this.IndentList);
    }
  });
}
// Delete
DeleteIntStocktr(col){
  this.ObjRawMateriali.Doc_No = undefined;
  if(col.Doc_No){
    this.ObjRawMateriali.Doc_No = col.Doc_No;
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
  if(this.ObjRawMateriali.Doc_No){
    const Tempdata = {
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
      Doc_No : this.ObjRawMateriali.Doc_No
    }
    const objj = {
      "SP_String": "SP_Raw_Material_Stock_Transfer",
      "Report_Name_String": "Delete Raw Material Stock Transfer",
      "Json_Param_String": JSON.stringify([Tempdata])
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
      if (data[0].Column1 === "Done"){
        this.onReject();
        this.GetSearchedList(true);
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Doc No.: " + this.ObjRawMateriali.Doc_No.toString(),
          detail: "Succesfully Deleted"
        });
        this.clearData();
      }
    })
  }
}
}
class RawMateriali {
  Doc_No : string = undefined;
  Doc_Date : string;
  From_godown_id : any;
  To_godown_id : any;
  To_Cost_Cen_ID : any;
  From_Cost_Cen_ID : any;
  Indent_List : any;
  Remarks : any;
 }
 class Browse {
  start_date : Date ;
  end_date : Date;
  To_Cost_Cen_ID : any;
  To_godown_id : any;
}
