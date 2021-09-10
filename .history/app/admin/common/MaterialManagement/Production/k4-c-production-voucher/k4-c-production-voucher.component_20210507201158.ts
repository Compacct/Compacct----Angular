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

@Component({
  selector: 'app-k4-c-production-voucher',
  templateUrl: './k4-c-production-voucher.component.html',
  styleUrls: ['./k4-c-production-voucher.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4CProductionVoucherComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  Req_Qty = 0;
  buttonname = "Create";
  myDate : Date;
  ProductionFormSubmitted = false ;

  Spinner = false;
  GetAllDataList = [];
  menuList = [];
  saveData = [];
  brandList = [];
  seachSpinner = false;
  inputBoxDisabled = false;
  deparmentList = [];
  FromGodownList = [];
  ProductDetailsList = [];
  ToCostCenterList = [];
  ToGoDownList = [];
  MaterialList = [];
  Objproduction : production = new production ();
  ObjBrowse : Browse = new Browse ();
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Production Voucher",
      Link: " Material Management -> Production -> Production Voucher"
    });
    console.log("this.inputBoxDisabled",this.inputBoxDisabled);
    this.myDate = new Date();
    console.log("this.myDate==",this.myDate)
    this.GetFromGodown();
    this.getCostCenter();
    this.getBrand();

  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  onConfirm(){}
  onConfirm_save(){
    console.log("save")

  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Add Production Voucher",
    "Json_Param_String": JSON.stringify(this.saveData)
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("Column1 ===",data[0].Column1);
    var tempID = data[0].Column1;
    if(data[0].Column1){
     this.compacctToast.clear();
     this.compacctToast.add({
      key: "compacct-toast",
      severity: "success",
      summary: "Requistion Entry No. " + tempID,
      detail: "Requistion Entry Succesfully"
    });

   }
   var valid = true;
   this.SearchProduction(valid);
   this.tabIndexToView = 0;
   this.items = ["BROWSE", "CREATE"];
   this.buttonname = "Create";
   //this.ObjRequistion.Cost_Cen_ID = "undefined";
   this.clearData()
  })
  }
  onReject() {}
  clearData() {
    this.Objproduction = new production ();
    this.Objproduction.Product_Type_ID = this.deparmentList.length === 1 ? this.deparmentList[0].Product_Type_ID : undefined;
    this.Objproduction.To_Cost_Cen_ID = this.ToCostCenterList.length === 1 ? this.ToCostCenterList[0].Cost_Cen_ID : undefined;
    this.getToGodown();
    this.Objproduction.Brand_ID = this.brandList.length === 1 ? this.brandList[0].Brand_ID : undefined;
    this.Objproduction.Material_Type = this.MaterialList.length === 1 ? this.MaterialList[0].Material_Type : undefined;
    this.Objproduction.To_godown_id = this.ToGoDownList.length === 1 ? this.ToGoDownList[0].To_godown_id : undefined;
    this.Objproduction.From_godown_id = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
    this.inputBoxDisabled = false;
    this.ProductDetailsList = [];
    this.ProductionFormSubmitted = false;
  }
  dropfirstData(){

  }
  GetDept(){
    const demtObj = {
      Brand_ID : this.Objproduction.Brand_ID,
      Material_Type : this.Objproduction.Material_Type
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Department",
      "Json_Param_String": JSON.stringify([demtObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.deparmentList = data;
      this.Objproduction.Product_Type_ID = this.deparmentList.length === 1 ? this.deparmentList[0].Product_Type_ID : undefined;
       console.log("this.deparmentList",this.deparmentList);
    })
  }
GetFromGodown(){
  console.log(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Production Godown",
    "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
    //console.log(this.$CompacctAPI.CompacctCookies.User_ID )
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.FromGodownList = data;
    console.log("this.FromGodownList",this.FromGodownList);
  })
}
GetproductDetails(){
  this.inputBoxDisabled = true;
  console.log("this.Objproduction.Product_Type_ID",this.Objproduction.Product_Type_ID);
  console.log("this.Objproduction.Product_Type_ID",this.Objproduction.Material_Type);
  if(this.Objproduction.Product_Type_ID){
    const tempObj = {
      Brand_ID : this.Objproduction.Brand_ID,
      Product_Type_ID : this.Objproduction.Product_Type_ID,
      Material_Type : this.Objproduction.Material_Type
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get Product Details",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ProductDetailsList = data;
      this.ProductDetailsList.forEach((item)=>{
        if(!item.Production_Qty){
          item.Production_Qty = undefined;
        }
      })
      console.log("this.ProductDetailsList",this.ProductDetailsList);
    })
  }
}
getCostCenter(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Parent Cost Center",
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.ToCostCenterList = data;
    this.Objproduction.To_Cost_Cen_ID = this.ToCostCenterList.length === 1 ? this.ToCostCenterList[0].Cost_Cen_ID : undefined;
    this.getToGodown();
   console.log("this.ToCostCenterList",this.ToCostCenterList);
  })
}
getToGodown(){

  if(this.Objproduction.To_Cost_Cen_ID){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Production Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.Objproduction.To_Cost_Cen_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ToGoDownList = data;
      console.log("this.ToGoDownList",this.ToGoDownList);
    })
  }
}
saveProduction(valid){
  console.log("valid",valid);
  this.ProductionFormSubmitted = true;
  if (valid) {
    this.inputBoxDisabled = false;
    this.Objproduction.Doc_Date = this.DateService.dateConvert(new Date());
    this.Objproduction.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.Objproduction.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID

    this.ProductDetailsList.forEach(el =>{
      if(el.Production_Qty && el.Production_Qty !== 0 ){
        const saveObj = {
        Doc_No:"A",
        Product_ID:el.Product_ID,
        Product_Description:el.Product_Description,
        UOM:el.UOM,
        Qty:el.Production_Qty,
        Cost_Cen_ID:this.Objproduction.From_Cost_Cen_ID,
        Rcv_Qty:el.Production_Qty,
        godown_id:this.Objproduction.From_godown_id

      }
      this.saveData.push({...this.Objproduction,...saveObj})
          }
  })
  if(this.saveData.length) {
    this.compacctToast.clear();
    this.compacctToast.add({
    key: "c",
    sticky: true,
    severity: "warn",
    summary: "Are you sure?",
    detail: "Save Production Voucher"
  });
  } else {
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "No Product Found "
    });
  }

  }


}
getBrand(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Brand",

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // console.log("brandList  ===",data);
    this.brandList = data;
  })
}
getMaterial(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Material Type",
    "Json_Param_String": JSON.stringify([{Brand_ID : this.Objproduction.Brand_ID}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.MaterialList = data;
    console.log("this.MaterialList",this.MaterialList);
  })
}
showProduct(){

}
getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjBrowse.req_date_B = dateRangeObj[0];
    this.ObjBrowse.req_date2 = dateRangeObj[1];
  }
}
SearchProduction(valid){
  this.seachSpinner = true;
  const start = this.ObjBrowse.req_date_B
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.req_date_B))
    : this.DateService.dateConvert(new Date());
  const end = this.ObjBrowse.req_date2
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.req_date2))
    : this.DateService.dateConvert(new Date());
  // const start = this.ObjBrowse.req_date_B  ? moment(new Date(this.ObjBrowse.req_date_B)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD') ;
  // const end = this.ObjBrowse.req_date2  ? moment(new Date(this.ObjBrowse.req_date2)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD') ;
  const tempDate = {
    From_date :start,
    To_Date :end,
  }
  //console.log("tempDate",tempDate);

    const objj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Browse Production Voucher",
      "Json_Param_String": JSON.stringify([tempDate])
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
      this.GetAllDataList = data;
     console.log("GetAllDataList",this.GetAllDataList)
     this.seachSpinner = false;
    })
}
}


class production {
 Brand_ID = 0;
 Product_Type_ID = 0;
 From_godown_id = 0;
 To_godown_id = 0;
 To_Cost_Cen_ID = 0;
 From_Cost_Cen_ID = 0;
 Doc_Date : string;
 Material_Type : string;
 User_ID = 0;
 Remarks : any ;
}
class Browse {
  req_date_B : Date ;
  req_date2 : Date;
  Cost_Cen_ID : 0;
  Product_Type_ID : 0;

}
