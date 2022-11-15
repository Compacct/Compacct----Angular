import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { IfStmt, THIS_EXPR, ThrowStmt } from "@angular/compiler/src/output/output_ast";

import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctProjectComponent } from "../../../../shared/compacct.components/compacct.forms/compacct-project/compacct-project.component";
import { ActivatedRoute } from "@angular/router";
import { DateNepalConvertService } from "../../../../shared/compacct.global/dateNepal.service"
declare var NepaliFunctions: any;
const NepaliDate = require('nepali-date');
@Component({
  selector: 'app-nepal-requisition-from-salesman',
  templateUrl: './nepal-requisition-from-salesman.component.html',
  styleUrls: ['./nepal-requisition-from-salesman.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalRequisitionFromSalesmanComponent implements OnInit {
  items:any = []
  tabIndexToView:number = 0
  buttonname = "Save"
  objreq:req = new req()
  DocDate:any=  {}
  SalesmanList:any = []
  productList:any = []
  requisitionFormSubmit:boolean = false
  reqAddList:any = []
  DocNo : any = undefined;
  TotalProductQty:any = undefined
  Spinner:boolean = false
  objbrowse:browse = new browse()
  BrowseStartDate:any = {}
  BrowseEndDate:any = {}
  SearchFormSubmit:boolean = false
  seachSpinner:boolean = false
  Searchedlist: any = [];
  BrandList: any = [];
  UomList: any = [];
  ProductCategoryList:any = []
  constructor(private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.items =  ["BROWSE", "CREATE"];
     this.Header.pushHeader({
      Header: "Requisition From Salesman",
      Link: "Material Management -> Outward -> Requisition From Salesman"
    });
    this.DocDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.BrowseStartDate =this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.BrowseEndDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.getSalesMan();
   // this.GetBrandList();
    this.getProductCategory()
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData(){
   this.objreq = new req ()
   this.reqAddList = []
   this.requisitionFormSubmit = false
   this.DocDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
   this.Spinner = false
   this.items = ["BROWSE", "CREATE"];
   this.buttonname = "Save";
   this.TotalProductQty = undefined
   this.GetSearchedList(true)
   this.DocNo = undefined
   //console.log("DocDate",this.DocDate)
  this.productList = [];
  this.seachSpinner = false
  this.SearchFormSubmit = false
  }
  onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("s");
  }
  getSalesMan(){
    this.$http
    .get("/BL_CRM_Master_SalesTeam/Get_Sales_Man_for_napal")
    .subscribe((data: any) => {
     this.SalesmanList = data ? data : [];
     });
  }
  GetBrandList() {
    this.BrandList =[]
   const obj = {
        "SP_String": "sp_Bl_Txn_Requisition_From_Salesman",
        "Report_Name_String": "Get_Brand_Product",
   }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // this.BrandList = data;
      if(data.length){
        data.forEach((xy:any) => {
         xy['label'] = xy.Brand_Name
         xy['value'] = xy.Product_Mfg_Comp_ID
        });
        this.BrandList = data
        // console.log("BrandList==",this.BrandList)
      }
   
     });
  }
  GetproductList(){
    this.productList = []
    if(this.objreq.Cat_ID){
      const obj = {
        "SP_String": "sp_Bl_Txn_Requisition_From_Salesman",
        "Report_Name_String": "Get_Product_Purchase_Request_With_Product_category",
        "Json_Param_String": JSON.stringify([{Cat_ID : this.objreq.Cat_ID}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data.length){
          data.forEach((xy:any) => {
           xy['label'] = xy.Product_Name
           xy['value'] = xy.Product_ID
          });
          this.productList = data
          console.log("productList==",this.productList)
        }
     
       });
    }
   
  }
  getUOM(){
    const obj = {
      "SP_String": "sp_Bl_Txn_Requisition_From_Salesman",
      "Report_Name_String": "Get_Data_From_Requisition_Salesman",
      "Json_Param_String": JSON.stringify([{ Product_ID: this.objreq.Product_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
     // console.log("UomList==", data)
      if (data.length) {
        this.objreq.UOM = data[0].UOM
      }
    });
  }
  addreq(valid:any){
   this.requisitionFormSubmit = true
  if(valid){
    const FilterproductList = this.productList.find((xz:any)=> Number(xz.Product_ID) == Number(this.objreq.Product_ID))
    const FilterSalesmanList = this.SalesmanList.find((xz:any)=> Number(xz.Member_ID) == Number(this.objreq.Sales_Man_ID))
    const FilterProductCategoryList = this.ProductCategoryList.find((xz:any)=> Number(xz.Cat_ID) == Number(this.objreq.Cat_ID))
     this.reqAddList.push({
      Doc_No: this.DocNo ? this.DocNo : "A",
      Doc_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.DocDate)),
      Product_ID : Number(this.objreq.Product_ID),
      Product_Description: FilterproductList ? FilterproductList.Product_Name : "",
      Qty: Number(this.objreq.Qty),
      UOM : this.objreq.UOM,
      Total_Product_Qty: this.TotalProductQty,
      Sales_Man_ID: this.objreq.Sales_Man_ID,
      Cat_ID: Number(this.objreq.Cat_ID),
      Cat_Name: FilterProductCategoryList ? FilterProductCategoryList.Cat_Name : undefined
     })
     console.log("reqAddList",this.reqAddList)
     const bckup = {...this.objreq}
     this.objreq = new req()
     this.objreq.Sales_Man_ID = bckup.Sales_Man_ID
     this.requisitionFormSubmit = false
     this.getTotalQty()
    }
  }
  delete(i){
    this.reqAddList.splice(i,1);
    this.getTotalQty()
  }
  getTotalQty(){
    this.TotalProductQty  = 0
    this.reqAddList.forEach((ele:any) => {
      this.TotalProductQty += Number(ele.Qty)
    });
  }
  ConfirmSave(){
    this.compacctToast.clear();
    this.compacctToast.add({
    key: "s",
    sticky: true,
    severity: "warn",
    summary: "Are you sure?",
    detail: "Confirm to proceed"
    });
  }
  Savereq(){
    if(this.reqAddList.length){
      this.reqAddList.forEach((x:any) => {
        x['Total_Product_Qty'] = Number(this.TotalProductQty)
        x.Doc_No = this.DocNo ? this.DocNo : "A"
      });
      const obj = {
        "SP_String": "sp_Bl_Txn_Requisition_From_Salesman",
        "Report_Name_String": "create_Requisition_From_Salesman",
        "Json_Param_String": JSON.stringify(this.reqAddList)
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("data",data)
        if(data[0].Column1){
          this.GetSearchedList(true)
          this.onReject()
          if(this.DocNo){
           this.tabIndexToView = 0
          }
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          detail:  "Succesfully "+ this.buttonname
        });
        this.clearData()
        }
        else if(data[0].Success == "False"){
          this.onReject()
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: data[1].Error
          });
        }
        
      })
    }
  }
  GetSearchedList(valid:any){
    this.SearchFormSubmit = true
    if(valid){
      if(this.objbrowse.Status){
        this.seachSpinner = true
        this.Searchedlist = []
        const tempobj = {
          Sales_Man_ID: this.objbrowse.Sales_Man_ID ? this.objbrowse.Sales_Man_ID : 0 ,
          From_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseStartDate)),
          To_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseEndDate)),
          Status: this.objbrowse.Status
        }
        const obj = {
          "SP_String": "sp_Bl_Txn_Requisition_From_Salesman",
          "Report_Name_String": "Browse_Requisition_From_Salesman",
          "Json_Param_String": JSON.stringify([tempobj])
        }
        this.GlobalAPI.getData(obj).subscribe((data: any) => {
            console.log("search Data",data)
            if(data.length){
             data.forEach((y:any) => {
              y.Doc_Date = this.DateNepalConvertService.convertEngToNepaliFormatDateObj(y.Doc_Date);
             });
             this.Searchedlist = data
             console.log("Searchedlist",this.Searchedlist)
            }
            this.seachSpinner = false
        })
      }
      }

  }
  convertToNepaliDateObj = function (_Date) {
    const EnglishDate = new Date(_Date);
    var month = EnglishDate.getUTCMonth() + 1;
    var day = EnglishDate.getDate();
    var year = EnglishDate.getUTCFullYear();
    const NepalDateObj = NepaliFunctions.AD2BS({
      year: year,
      month: month,
      day: day
    });
    //const NepalDate = {nyear: NepalDateObj.year, nmonth: Number(NepalDateObj.month) - 1, nday: NepalDateObj.day};
    const d1 = new NepaliDate(NepalDateObj.year, Number(NepalDateObj.month) - 1, NepalDateObj.day)
    // const nyear = NepalDateObj.year.toString().length == 1 ? "0" + NepalDateObj.year : NepalDateObj.year;
    // const nmonth = NepalDateObj.month.toString().length == 1 ? "0" + NepalDateObj.month : NepalDateObj.month;
    // const nday = NepalDateObj.day.toString().length == 1 ? "0" + NepalDateObj.day : NepalDateObj.day;
    //const NepalDate = NepalDateObj.day + '/' + NepalDateObj.month + '/' + NepalDateObj.year;
    //const NepalDate = nday + '/' + nmonth + '/' + nyear;
    return d1.format('dd mmmm, yyyy');
    // return {
    //   day: Number(nday),
    //   month: Number(nmonth),
    //   year: nyear
    // };
  }
  convertEngToNepaliDateObj = function (_Date) {
    const EnglishDate = new Date(_Date);
    var month = EnglishDate.getUTCMonth() + 1;
    var day = EnglishDate.getDate();
    var year = EnglishDate.getUTCFullYear();
    const NepalDateObj = NepaliFunctions.AD2BS({ year: year, month: month, day: day });
    return NepalDateObj.day+'/'+NepalDateObj.month+'/'+NepalDateObj.year;
 
  }
  EditReq(col:any){
   if(col.Doc_No){
    this.ngxService.start();
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.tabIndexToView = 1
    this.DocNo = undefined
    this.DocNo = col.Doc_No
    this.getEditData(col.Doc_No)
   }
  }
  getEditData(Doc:any){
    const obj = {
      "SP_String": "sp_Bl_Txn_Requisition_From_Salesman",
      "Report_Name_String": "Retrieve_Requisition_From_Salesman",
      "Json_Param_String": JSON.stringify([{Doc_No : Doc}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("Edit",data)
     if(data.length){
      this.objreq.Sales_Man_ID = data[0].Sales_Man_ID
      //this.TotalProductQty = data[0].Total_Product_Qty
      this.DocDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].Doc_Date)
      this.reqAddList = data
      this.getTotalQty()
      }
     this.ngxService.stop();
    })
  }
  DeleteReq(col:any){
   if(col.Doc_No){
     this.DocNo = undefined
     this.DocNo = col.Doc_No
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
    if(this.DocNo){
      const obj = {
        "SP_String": "sp_Bl_Txn_Requisition_From_Salesman",
        "Report_Name_String": "Delete_Requisition_From_Salesman",
        "Json_Param_String": JSON.stringify([{Doc_No : this.DocNo}])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Column1 =="Done"){
          this.onReject()
          this.GetSearchedList(true)
          this.DocNo = undefined
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          detail:  "Succesfully Delete"
        })
        }
      })
    }
  }
  getProductCategory(){
    this.ProductCategoryList =[]
    const obj = {
         "SP_String": "sp_Bl_Txn_Requisition_From_Salesman",
         "Report_Name_String": "Get_Product_Category",
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       // this.BrandList = data;
       console.log("ProductCategoryList==",data)
       if(data.length){
         data.forEach((xy:any) => {
          xy['label'] = xy.Cat_Name
          xy['value'] = xy.Cat_ID
         });
         this.ProductCategoryList = data
         // console.log("BrandList==",this.BrandList)
       }
       else{
        this.ProductCategoryList = []
       }
    
      });
  }
}
class req{
  Doc_No:any
	Doc_Date:any 
	Product_ID :any
	Qty:any
	UOM :any
	Total_Product_Qty:any 
	Sales_Man_ID:any
  Used: any
  Product_Mfg_Comp_ID :any
  Cat_ID:any
}
class browse{
  Sales_Man_ID:any
  Status:string
  From_Date:any
  To_Date:any
}