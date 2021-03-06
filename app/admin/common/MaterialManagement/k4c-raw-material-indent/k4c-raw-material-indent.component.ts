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

@Component({
  selector: 'app-k4c-raw-material-indent',
  templateUrl: './k4c-raw-material-indent.component.html',
  styleUrls: ['./k4c-raw-material-indent.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cRawMaterialIndentComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save";


  showSpinner = false;
  deptList = [];
  browsedeptList = [];
  productListFilter = [];
  SelectedProductType :any = [];
  RawIndentFormSubmit = false;
  godownId = undefined;
  productList = [];
  backUpproductList = [];
  rawDate:Date;
  GetAllDataList = [];
  backUpGetAllDataList = [];
  DocNo = undefined;
  display = false;
  filteredData = [];
  editDataList = [];
  ObjBrowseData: BrowseData = new BrowseData();
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
      this.getDept();
      this.getdate();
  }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
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

  }
  getDept(){
    const obj = {
      "SP_String": "SP_Raw_Material_Indent",
      "Report_Name_String": "Get - Department",
      "Json_Param_String": JSON.stringify([{ Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.deptList = data;
      console.log("deptList",this.deptList);
    })
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
     })
  }
  GetProductType(){
    this.SelectedProductType = [];
    let TempData = [];
    const obj = {
      "SP_String": "SP_Raw_Material_Indent",
      "Report_Name_String": "Get - Product Type List Raw Material",
      "Json_Param_String":'[{}]',
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      TempData = data;
      console.log("Product Type",TempData)
      TempData.forEach(el => {
        this.SelectedProductType.push(el.Product_Type_ID);
        this.productListFilter.push(
          {
            label: el.Product_Type,
            value: el.Product_Type_ID
          }
        )
      })
    })
  }
  showProduct(valid){
    console.log(valid);
    this.RawIndentFormSubmit = true;
    if(valid){
      this.showSpinner = true;
      const TempObj = {
        Cost_Cen_ID:this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        Godown_ID:this.godownId,
        Product_Type_ID:0
      }
      const obj = {
        "SP_String": "SP_Raw_Material_Indent",
        "Report_Name_String": "Get Raw Material With Stock",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        const tempData = data;
        tempData.forEach(element => {
          element['Requisition_Qty'] = undefined;
        });
        this.productList = tempData;
        this.showSpinner = false;
        this.backUpproductList = tempData;
        this.GetProductType();
        this.RawIndentFormSubmit = false;
        console.log("productList",this.productList);
      })
    }
  }
  filterProduct(){
    if(this.SelectedProductType.length){
      let tempProduct = [];
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
    let Savedata = [];
    if(this.filteredData.length){
      this.filteredData.forEach(el=>{
        if(this.DocNo){
          const tempData = {
            Doc_No: this.DocNo,
            Doc_Date: this.DateService.dateConvert(new Date (this.rawDate)),
            Product_Type_ID: el.Product_Type_ID,
            Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
            Product_ID: el.Product_ID,
            Product_Description: el.Product_Description,
            UOM: el.UOM,
            Requisition_Qty: Number(el.Requisition_Qty),
            User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
            Godown_ID : Number(this.godownId)
          }
          Savedata.push(tempData)
        }
        else{
          const tempData = {
            Doc_No: "A",
            Doc_Date: this.DateService.dateConvert(new Date (this.rawDate)),
            Product_Type_ID: el.Product_Type_ID,
            Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
            Product_ID: el.Product_ID,
            Product_Description: el.Product_Description,
            UOM: el.UOM,
            Requisition_Qty: Number(el.Requisition_Qty),
            User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
            Godown_ID : Number(this.godownId)
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

          this.GetAllData();
          this.clearData();
          this.getdate();
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
  // Print(obj){
  //   if (obj.Doc_No) {
  //     window.open("/Report/Crystal_Files/K4C/K4C_Raw_Material_Indent.aspx?DocNo=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

  //     );
  //   }
  // }
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
  geteditmaster(Doc_No){
    const objj = {
      "SP_String": "SP_Raw_Material_Indent",
      "Report_Name_String": "Get Raw Material Indent Data Details For Edit",
      "Json_Param_String": JSON.stringify([{Doc_No : Doc_No}])
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
      console.log("data",data);
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
  Godown_ID: number;

}
