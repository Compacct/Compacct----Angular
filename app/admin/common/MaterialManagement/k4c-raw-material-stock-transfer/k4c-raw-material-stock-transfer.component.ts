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

@Component({
  selector: 'app-k4c-raw-material-stock-transfer',
  templateUrl: './k4c-raw-material-stock-transfer.component.html',
  styleUrls: ['./k4c-raw-material-stock-transfer.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cRawMaterialStockTransferComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false
  ShowSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  myDate = new Date();
  ObjRawMateriali : RawMateriali = new RawMateriali ();
  RawMaterialIssueFormSubmitted = false;
  ObjBrowse : Browse = new Browse ();
  Fcostcenlist = [];
  FromGodownList = [];
  Tocostcenlist = [];
  ToGodownList = [];
  FCostdisableflag = false;
  FGdisableflag = false;
  TGdisableflag = false;
  IndentListFormSubmitted = false;
  IndentList = [];
  ProductList = [];
  SelectedIndent: any;
  BackupIndentList = [];
  IndentFilter = [];
  TIndentList = [];
  Searchedlist = [];
  flag = false;
  productListFilter = [];
  SelectedProductType :any = [];
  Param_Flag ='';
  CostCentId_Flag : any;
  MaterialType_Flag = '';

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private route : ActivatedRoute,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // console.log(params);
      this.clearData();
      this.Searchedlist = [];
      this.Param_Flag = params['Name'];
      this.CostCentId_Flag = params['Cost_Cen_ID'];
      this.MaterialType_Flag = params['Material_Type']
       console.log (this.CostCentId_Flag);
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: this.MaterialType_Flag + " Stock Transfer - " + this.Param_Flag,
      Link: " Material Management -> " + this.MaterialType_Flag + " Stock Transfer - " + this.Param_Flag
    });
    this.GetFromCostCen();
    this.GetToCostCen();
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
    const tempObj = {
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
      Material_Type : this.MaterialType_Flag
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Cost Center Name All",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Tocostcenlist = data;
     // if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
      this.ObjRawMateriali.To_Cost_Cen_ID = String(this.CostCentId_Flag);
       this.GetToGodown();
     // console.log("To Cost Cen List ===",this.Tocostcenlist);
    })
  }
  GetToGodown(){
    if(this.ObjRawMateriali.To_Cost_Cen_ID){
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
         this.ObjRawMateriali.To_godown_id = this.ToGodownList.length === 1 ? this.ToGodownList[0].godown_id : undefined;
       if(this.ToGodownList.length === 1){
         this.TGdisableflag = true;
       }else{
         this.TGdisableflag = false;
       }
       //console.log("To Godown List ===",this.ToGodownList);
      })
    }

  }

  // FOR PRODUCT TABLE
  GetIndentList(valid){
    this.RawMaterialIssueFormSubmitted = true;
    if(valid){
      this.ShowSpinner = true;
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
  }
  }
  // product Filter

  filterProduct(){
    if(this.SelectedProductType.length){
      let tempProduct = [];
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
  let DOrderBy = [];
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
      let Arr =[]
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
  dataforSaveRawMaterialIssue(){
    // console.log(this.DateService.dateConvert(new Date(this.myDate)))
     this.ObjRawMateriali.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    if(this.ProductList.length) {
      let tempArr =[]
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
            UOM	: item.UOM,
            Remarks	: " ",
            User_ID	:this.$CompacctAPI.CompacctCookies.User_ID,
            Batch_No : item.Batch_No
         }
        tempArr.push(TempObj)
      }
      });
      console.log("Save Data ===", tempArr)
      return JSON.stringify(tempArr);

    }
  }
  SaveRawMaterialIssue(){
    if(this.ObjRawMateriali.From_Cost_Cen_ID == this.ObjRawMateriali.To_Cost_Cen_ID &&
      this.ObjRawMateriali.From_godown_id == this.ObjRawMateriali.To_godown_id){
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
       "Json_Param_String": this.dataforSaveRawMaterialIssue()

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
         this.GetSearchedList();
         this.clearData();
         this.ProductList =[];
         this.IndentListFormSubmitted = false;
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
    else{
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
  GetSearchedList(){
    this.Searchedlist = [];
  const start = this.ObjBrowse.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
  : this.DateService.dateConvert(new Date());

const tempobj = {
  From_date : start,
  To_Date : end,

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
 })
}
  clearData(){
    this.ObjRawMateriali.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.ObjRawMateriali.To_Cost_Cen_ID = String(this.CostCentId_Flag);
    this.ObjRawMateriali.From_godown_id = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
     if(this.FromGodownList.length === 1){
       this.FGdisableflag = true;
     }else{
       this.FGdisableflag = false;
     }
     this.ObjRawMateriali.To_godown_id = this.ToGodownList.length === 1 ? this.ToGodownList[0].godown_id : undefined;
     if(this.ToGodownList.length === 1){
       this.TGdisableflag = true;
     }else{
       this.TGdisableflag = false;
     }
    this.ObjRawMateriali.Remarks = [];
    this.ObjRawMateriali.Indent_List = undefined;
    this.ProductList = [];
    this.IndentList = [];
    this.BackupIndentList = [];
    this.TIndentList = [];
    this.SelectedIndent = [];
    this.IndentFilter = [];
    // Product Filter
    this.SelectedProductType = [];
    this.ShowSpinner = false;
    this.ObjRawMateriali.Doc_No = undefined;
  }
// Edit
EditIntStock(col){
  this.ObjRawMateriali.Doc_No = undefined;
  if(col.Doc_No){
   this.ObjRawMateriali = col.Doc_No;
   this.tabIndexToView = 1;
   this.ProductList = [];
   this.BackupIndentList = [];
   this.items = ["BROWSE", "UPDATE"];
   this.buttonname = "Update";
   this.geteditmaster(col.Doc_No)
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
    const TempData = data;
    this.myDate = new Date(data[0].Doc_Date);
    this.ObjRawMateriali = data[0];
    TempData.forEach(element => {
      this.ProductList.push({
        Current_Stock_In_Dept:element.Current_Stock_In_Dept,
        Issue_Qty:element.Qty,
        Product_Description:element.Product_Description,
        Product_ID:element.Product_ID,
        Product_Type:element.Product_Type,
        Product_Type_ID:element.Product_Type_ID,
        Stock_Qty:element.Stock_Qty,
        UOM : element.UOM,
        Batch_No : element.Batch_No,
        Batch_Qty : element.Batch_Qty
      })
     });
     this.BackupIndentList = this.ProductList;
     this.GetProductType();
  })
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
        this.GetSearchedList();
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
}
