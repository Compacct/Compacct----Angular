import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import * as moment from "moment";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

import { ActivatedRoute, Router } from "@angular/router";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-k4c-raw-material-indent',
  templateUrl: './k4c-raw-material-indent.component.html',
  styleUrls: ['./k4c-raw-material-indent.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cRawMaterialIndentComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save";


  showSpinner = false;
  deptList:any = [];
  browsecostcenlist: any = [];
  browsedeptList:any = [];
  productListFilter:any = [];
  SelectedProductType :any = [];
  RawIndentFormSubmit = false;
  godownId = undefined;
  productList:any = [];
  backUpproductList:any = [];
  rawDate:Date;
  GetAllDataList:any = [];
  backUpGetAllDataList:any = [];
  DocNo = undefined;
  display = false;
  filteredData:any = [];
  editDataList:any = [];
  ObjBrowseData: BrowseData = new BrowseData();
  Cost_Cen_ID = undefined;
  costcenlist:any = [];
  RawMateIndent_Date: Date;
  mattypelist:any = [];
  Material_Type = undefined;
  mindate: Date;
  maxdate: Date;
  SearchFields:any = [];
  DistProductType:any = [];
  ViewPoppup:boolean = false;
  viewlist:any = [];
  Doc_date: any;
  To_Godown_ID: any;
  Doc_no: any;
  Product_ID: any;
  DropdownproductList:any = [];
  Requisition_Qty: any;
  uom:any;
  StockQty: any;
  constructor(
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private route : ActivatedRoute,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
      this.Header.pushHeader({
        Header: "Raw Material Indent",
        Link: " Material Management -> Raw Material Indent"
      });
      this.GetToCostCen();
      this.GetBrowseToCostCen();
      // this.getDept();
      this.getdate();
      this.getMaterialType();
      this.maxdate = new Date();
  }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
    this.DistProductType = [];
    this.SelectedProductType = [];
    this.DropdownproductList = [];
   }
  onReject() {
    this.compacctToast.clear("c");
  }
  clearData(){
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.productList = [];
    this.godownId = undefined;
    this.SelectedProductType = [];
    this.DocNo = undefined;
    this.getdate();
    this.editDataList = [];
    this.productListFilter = [];
    this.Cost_Cen_ID = undefined;
    this.Material_Type = undefined;
    this.browsedeptList = [];
    this.deptList = [];

  }
  GetToCostCen(){
    const obj = {
      "SP_String": "SP_Raw_Material_Indent",
      "Report_Name_String": "Get Cost Centre Non outlet",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.costcenlist = data;
    })
  }
  getDept(costcenterid){
    // this.deptList = [];
    if(costcenterid) {
    const obj = {
      "SP_String": "SP_Raw_Material_Indent",
      "Report_Name_String": "Get - Department",
      "Json_Param_String": JSON.stringify([{ Cost_Cen_ID: costcenterid }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.deptList = data;
      // console.log("deptList",this.deptList);
    })
    }
  }
  GetBrowseToCostCen(){
    const obj = {
      "SP_String": "SP_Raw_Material_Indent",
      "Report_Name_String": "Get Cost Centre Non outlet",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.browsecostcenlist = data;
    })
  }
  getBrowseDept(browsecostcenterid){
    // this.browsedeptList = [];
    if(browsecostcenterid) {
    const obj = {
      "SP_String": "SP_Raw_Material_Indent",
      "Report_Name_String": "Get - Department",
      "Json_Param_String": JSON.stringify([{ Cost_Cen_ID: browsecostcenterid }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.browsedeptList = data;
      // console.log("deptList",this.deptList);
    })
    }
  }
  getdate(){
    const obj = {
      "SP_String": "SP_Raw_Material_Indent",
      "Report_Name_String": "Get - Date",
      "Json_Param_String":'[{}]'
     }
     this.GlobalAPI.getData(obj).subscribe((data: any) => {
       console.log("date",data);
       this.rawDate = new Date(data[0].Column1);
       var currentdate:any = new Date(data[0].Column1);
       var mindate = currentdate.setDate(currentdate.getDate() - 5);
       this.mindate = new Date(mindate);
      //  var maxdate = new Date();
       this.maxdate = new Date();
     })
  }
  getMaterialType() {
    const obj = {
      "SP_String": "SP_Raw_Material_Indent",
      "Report_Name_String": "Get Material Type",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.mattypelist = data;
    })
  }
  // GetProductType(){
  //   this.SelectedProductType = [];
  //   let TempData:any = [];
  //   const obj = {
  //     "SP_String": "SP_Raw_Material_Indent",
  //     "Report_Name_String": "Get - Product Type List Raw Material",
  //     // "Json_Param_String": JSON.stringify([{Material_Type : this.Material_Type}]),
  //   }
  //   this.GlobalAPI.getData(obj).subscribe((data: any) => {
  //     TempData = data;
  //     console.log("Product Type",TempData)
  //     TempData.forEach(el => {
  //       this.SelectedProductType.push(el.Product_Type_ID);
  //       this.productListFilter.push(
  //         {
  //           label: el.Product_Type,
  //           value: el.Product_Type_ID
  //         }
  //       )
  //     })
  //   })
  // }
  showProduct(){
    // console.log(valid);
    // this.RawIndentFormSubmit = true;
    // if(valid){
    //   this.showSpinner = true;
      const TempObj = {
        Cost_Cen_ID:this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        Godown_ID:this.godownId,
        Product_Type_ID:0,
      }
      const obj = {
        "SP_String": "SP_Raw_Material_Indent",
        "Report_Name_String": "Get Raw Material With Stock",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        // const tempData = data;
        // tempData.forEach(element => {
        //   element['Requisition_Qty'] = undefined;
        // });
        if(data.length){
          data.forEach(element => {
            element['value'] = element.Product_ID
            element['label'] = element.Product_Description
        });
        this.DropdownproductList = data;
        }
        else {
         this.DropdownproductList = [];
        }
        // this.productList = tempData;
        // this.showSpinner = false;
        // this.backUpproductList = tempData;
        // // this.GetProductType();
        // this.GetDistinct()
        // this.RawIndentFormSubmit = false;
        // console.log("productList",this.productList);
      })
    // }
  }
  Getdatafromproduct(){
    this.uom = undefined;
    this.StockQty = undefined;
    if(this.Product_ID){
    const productdata = this.DropdownproductList.filter(el=> Number(el.Product_ID) === Number(this.Product_ID))
    this.uom = productdata.length ? productdata[0].UOM : undefined;
    this.StockQty = productdata.length ? productdata[0].Stock_Qty : undefined;
    }
  }
  AddProduct(valid){
    this.RawIndentFormSubmit = true;
    this.showSpinner = true;
  if(valid){
     const productFilter:any = this.DropdownproductList.filter((el:any)=> Number(el.Product_ID) === Number(this.Product_ID))
     const godownname:any = this.deptList.filter((ele:any)=> Number(ele.godown_id) === Number(this.godownId))
     let addData = {
        Product_ID: Number(this.Product_ID),
        Product_Description: productFilter.length ? productFilter[0].Product_Description : undefined,
        Product_Type_ID: productFilter.length ? productFilter[0].Product_Type_ID : undefined,
        Product_Type: productFilter.length ? productFilter[0].Product_Type : undefined,
        UOM: productFilter.length ? productFilter[0].UOM : undefined,
        Present_Stock: productFilter.length ? productFilter[0].Present_Stock : undefined,
        Requisition_Qty: this.Requisition_Qty,
        Cost_Cen_ID: this.Cost_Cen_ID,
        Godown_ID : Number(this.godownId),
        godown_name : godownname[0].godown_name,
        User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
        // Material_Type : this.Material_Type
     }
      this.productList.push(addData);
      this.godownId = undefined;
      this.Product_ID = undefined;
      this.uom = undefined;
      this.StockQty = undefined;
      this.Requisition_Qty = undefined;
      this.showSpinner = false;
      this.backUpproductList = this.productList;
      // this.GetProductType();
      this.GetDistinct()
      this.RawIndentFormSubmit = false;
      console.log("productList",this.productList);
     
   }
   else{
    this.showSpinner = false;
   }
  }
  DeteteAdd(index) {
    this.productList.splice(index,1);
  }
  GetDistinct() {
    let DProductType:any = [];
    this.DistProductType =[];
    this.SelectedProductType =[];
    this.SearchFields =[];
    this.productList.forEach((item) => {
  if (DProductType.indexOf(item.Product_Type_ID) === -1) {
    DProductType.push(item.Product_Type_ID);
    this.DistProductType.push({ label: item.Product_Type, value: item.Product_Type_ID });
    }
  });
     this.backUpproductList = [...this.productList];
  }
  // filterProduct() {
  //   console.log(true)
  //   let DProductType:any = [];
  //   this.SearchFields =[];
  // if (this.SelectedProductType.length) {
  //   this.SearchFields.push('Product_Type_ID');
  //   DProductType = this.SelectedProductType;
  // }
  // this.productList = [];
  // if (this.SearchFields.length) {
  //   let LeadArr = this.backUpproductList.filter(function (e) {
  //     (DProductType.length ? DProductType.includes(e['Product_Type_ID']) : true)
  //   });
  // this.productList = LeadArr.length ? LeadArr : [];
  // } else {
  // this.productList = [...this.backUpproductList] ;
  // }
  // }
  filterProduct(){
    if(this.SelectedProductType.length){
      let tempProduct:any = [];
      this.SelectedProductType.forEach(item => {
        this.backUpproductList.forEach((el,i)=>{

          const ProductObj = this.backUpproductList.filter((elem) => elem.Product_Type_ID == item)[i];
          //const ProductObj = el;
         // console.log("ProductObj",ProductObj);
          if(ProductObj)
          tempProduct.push(ProductObj)
        })
        })
     this.productList  = [...tempProduct];
   }
    else {
    this.productList  = [...this.backUpproductList];

    }
  }
  getTotalReqValue(){
    let Reqval = 0;
    this.filteredData.forEach((item)=>{
      Reqval += Number(item.Requisition_Qty)
    });

    return Reqval ? Reqval : '-';
  }
  showDialog() {
    this.display = true;
    this.filteredData = [];
    let Savedata = [];
    if(this.backUpproductList.length){
      this.backUpproductList.forEach(el => {
        if(el.Requisition_Qty && Number(el.Requisition_Qty) != 0){

            this.filteredData.push(el);
        }
      });
    }
  }
  SaveRawindent(){
    let Savedata:any = [];
    if(this.filteredData.length){
      this.filteredData.forEach(el=>{
        if(this.DocNo){
          const tempData = {
            Doc_No: this.DocNo,
            Doc_Date: this.DateService.dateConvert(new Date (this.rawDate)),
            Product_Type_ID: el.Product_Type_ID,
            Cost_Cen_ID: this.Cost_Cen_ID,
            Product_ID: el.Product_ID,
            Product_Description: el.Product_Description,
            UOM: el.UOM,
            Requisition_Qty: Number(el.Requisition_Qty),
            User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
            Godown_ID : Number(el.Godown_ID)
          }
          Savedata.push(tempData)
        }
        else{
          const tempData = {
            Doc_No: "A",
            Doc_Date: this.DateService.dateConvert(new Date (this.rawDate)),
            Product_Type_ID: el.Product_Type_ID,
            Cost_Cen_ID: this.Cost_Cen_ID,
            Product_ID: el.Product_ID,
            Product_Description: el.Product_Description,
            UOM: el.UOM,
            Requisition_Qty: Number(el.Requisition_Qty),
            User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
            Godown_ID : Number(el.Godown_ID)
          }
          Savedata.push(tempData)
        }


      })
     console.log("Save Data",Savedata);
      const obj = {
        "SP_String": "SP_Raw_Material_Indent",
        "Report_Name_String": "Save Raw Material Indent",
        "Json_Param_String": JSON.stringify(Savedata),
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
         console.log("After Save",data);
         if(data[0].Column1){
          this.display = false;
          this.tabIndexToView = 0 ;
          if(this.DocNo){
            this.compacctToast.clear();
            this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Doc No." + data[0].Column1.toString(),
            detail: "Raw Material Indent Succesfully Update"
          });
          }
          else {
            this.compacctToast.clear();
            this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Doc No." + data[0].Column1.toString(),
            detail: "Raw Material Indent Succesfully Save"
          });
          }
          this.DistProductType = [];
          this.SelectedProductType = [];
          this.GetAllData();
          this.clearData();
          this.getdate();
          this.DropdownproductList = [];
         }
      })
    }

  }
  getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseData.req_date_B = dateRangeObj[0];
      this.ObjBrowseData.req_date2 = dateRangeObj[1];
    }
  }
  GetAllData(){
    this.seachSpinner = true;
    const start = this.ObjBrowseData.req_date_B
      ? this.DateService.dateConvert(new Date(this.ObjBrowseData.req_date_B))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseData.req_date2
      ? this.DateService.dateConvert(new Date(this.ObjBrowseData.req_date2))
      : this.DateService.dateConvert(new Date());
      const tempDate = {
        From_Date :start,
        To_Date :end,
        Cost_Cen_ID : this.ObjBrowseData.Cost_Cen_ID ? Number(this.ObjBrowseData.Cost_Cen_ID) : 0,
        Godown_ID : Number(this.ObjBrowseData.Godown_ID) ? Number(this.ObjBrowseData.Godown_ID) : 0
      }
      const objj = {
        "SP_String": "SP_Raw_Material_Indent",
        "Report_Name_String": "Browse Raw Material Indent",
        "Json_Param_String": JSON.stringify([tempDate])
      }
      this.GlobalAPI.getData(objj).subscribe((data:any)=>{
        this.GetAllDataList = data
        this.backUpGetAllDataList = data;
        console.log("GetAllDataList",this.GetAllDataList);
        this.seachSpinner = false;
      })
  }
  exportoexcel(){
    const start = this.ObjBrowseData.req_date_B
      ? this.DateService.dateConvert(new Date(this.ObjBrowseData.req_date_B))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseData.req_date2
      ? this.DateService.dateConvert(new Date(this.ObjBrowseData.req_date2))
      : this.DateService.dateConvert(new Date());
      const tempDate = {
        From_Date :start,
        To_Date :end,
        Cost_Cen_ID : this.ObjBrowseData.Cost_Cen_ID ? Number(this.ObjBrowseData.Cost_Cen_ID) : 0,
        Godown_ID : Number(this.ObjBrowseData.Godown_ID) ? Number(this.ObjBrowseData.Godown_ID) : 0
      }
    const obj = {
      "SP_String": "SP_Raw_Material_Indent",
      "Report_Name_String": "Export Raw Material Indent",
      "Json_Param_String": JSON.stringify([tempDate])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      XLSX.writeFile(workbook, "Indent_List"+'.xlsx');
      
    })
  }
  onFilterChange(eve: any){
    this.GetAllDataList = []
     if(eve){
      this.backUpGetAllDataList.forEach(el=>{
        if(el.Ref_ST_No === "PENDING"){
          this.GetAllDataList.push(el);
        }
      })
    }
    else{
      this.GetAllDataList = this.backUpGetAllDataList;
    }
  }
  Print(obj){
    if (obj.Doc_No) {
      window.open("/Report/Crystal_Files/K4C/Raw_Material_Indent_Print.aspx?Doc_No=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

      );
    }
  }
  editraw(col){
   this.DocNo = undefined;
   if(col.Doc_No){
    this.DocNo = col.Doc_No;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.geteditmaster(col.Doc_No)
   }
  }
  View(col){
    this.Doc_no = undefined;
    this.Doc_date = undefined;
    this.To_Godown_ID = undefined;
    if(col.Doc_No){
     this.Doc_no = col.Doc_No;
     this.Doc_date = col.Doc_Date;
     this.To_Godown_ID = col.Department;
     this.geteditmaster(col.Doc_No)
    }
   }
  geteditmaster(Doc_No){
    const objj = {
      "SP_String": "SP_Raw_Material_Indent",
      "Report_Name_String": "Get Raw Material Indent Data Details For Edit",
      "Json_Param_String": JSON.stringify([{Doc_No : Doc_No}])
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
      console.log("data",data);
      this.viewlist = data;
      this.editDataList = data;
      this.rawDate = new Date(data[0].Doc_Date);
      this.godownId = data[0].Godown_ID;
      this.editDataList.forEach(el=>{
        this.productList.push({
          Present_Stock : el.Present_Stock,
          Product_Description : el.Product_Description,
          Product_ID : el.Product_ID,
          Product_Type : el.Product_Type,
          Product_Type_ID : el.Product_Type_ID,
          Requisition_Qty : el.Requisition_Qty,
          UOM : el.UOM
        })
        this.backUpproductList = this.productList;
        this.Gettypedist();
        this.ViewPoppup = true;
      })

    })
  }
  Gettypedist(){
    let DOrderBy = [];
    this.productListFilter = [];
    //this.SelectedDistOrderBy1 = [];
    this.editDataList.forEach((item) => {
      if (DOrderBy.indexOf(item.Product_Type_ID) === -1) {
        DOrderBy.push(item.Product_Type_ID);
         this.productListFilter.push({ label: item.Product_Type, value: item.Product_Type_ID });
        console.log("this.TimerangeFilter", this.productListFilter);
      }
    });
  }
  deleteraw(col){
    this.DocNo = undefined;
    if(col.Doc_No){
      this.DocNo = col.Doc_No;
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
      const objj = {
        "SP_String": "SP_Raw_Material_Indent",
        "Report_Name_String": "Delete Raw Material Indent",
        "Json_Param_String": JSON.stringify([{Doc_No : this.DocNo}])
      }
      this.GlobalAPI.getData(objj).subscribe((data:any)=>{
        if (data[0].Column1 === "Done"){
          this.onReject();
          this.GetAllData();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Doc No.: " + this.DocNo.toString(),
            detail: "Succesfully Deleted"
          });
          this.clearData();
        }
      })
    }
  }
}
class BrowseData {
  req_date_B: string;
  req_date2: string;
  Cost_Cen_ID: any;
  Godown_ID: number;

}
