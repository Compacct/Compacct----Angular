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
  selector: 'app-k4c-advance-production',
  templateUrl: './k4c-advance-production.component.html',
  styleUrls: ['./k4c-advance-production.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cAdvanceProductionComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = "Create";
  menuList = [];
  items = [];
  brandList = [];
  shiftList = [];
  ProductDetailsList = [];
  ToCostCenterList=[];
  ToGoDownList=[];
  saveData = [];
  FromGodownList = [];
  GetAllDataList = [];
  inputBoxDisabled = false;
  AdvProductionFormSubmitted = false;
  AdvProductionFormSubmitted2 = false;
  datepic = true;
  Spinner = false;
  myDate = new Date();
  seachSpinner = false;
  Reject_Date = new Date();
  Objproduction : production = new production ();
  ObjBrowse : Browse = new Browse ();
  Stock_Point = false;
  Cost_Center = false;
  to_Stock_Point = false;
  viewpopUp = false;
  viewData:any = {};
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Advance Production Voucher",
      Link: " Material Management -> Production -> Advance Production Voucher"
    });
    this.getCostCenter();
    this.getBrand();
    this.Getshift();
    this.GetFromGodown();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
   }
  clearData(){
    this.Objproduction = new production ();
    this.Objproduction.Shift_ID = this.shiftList[0].Shift_ID;
    this.Objproduction.To_Cost_Cen_ID = this.ToCostCenterList.length === 1 ? this.ToCostCenterList[0].Cost_Cen_ID : undefined;
    if(this.Objproduction.To_Cost_Cen_ID){
      this.Cost_Center = true;
    }
    this.getToGodown();
    this.Objproduction.Brand_ID = this.brandList.length === 1 ? this.brandList[0].Brand_ID : undefined;
    this.Objproduction.To_godown_id = this.ToGoDownList.length === 1 ? this.ToGoDownList[0].To_godown_id : undefined;
    if(this.Objproduction.To_godown_id){
       this.to_Stock_Point = true;
    }
    this.Objproduction.From_godown_id = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
    if(this.Objproduction.From_godown_id) {
      this.Stock_Point = true;
    }
    this.saveData = [];
    this.AdvProductionFormSubmitted = false;
    this.AdvProductionFormSubmitted2 = false;
    this.inputBoxDisabled = false;
    this.datepic = true;
    this.ProductDetailsList = [];
    this.Reject_Date = new Date();
  }
  onConfirm(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Add Production Voucher",
      "Json_Param_String": JSON.stringify(this.saveData)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Column1 ===",data[0].Column1);
      var tempID = data[0].Column1;
      if(data[0].Column1){
        this.SearchProduction();
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Advance Production Entry No. " + tempID,
         detail: "Advance Production Entry Succesfully"
        });
       this.clearData();
       this.onReject()
      }
      else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Something Wrong"
        });
      }
    this.onReject()
   var valid = true;
   this.tabIndexToView = 0;
   this.items = ["BROWSE", "CREATE"];
   this.buttonname = "Create";
   //this.ObjRequistion.Cost_Cen_ID = "undefined";
   this.clearData();
    })
  }
   onReject() {
    this.compacctToast.clear("c");
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
  Getshift(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Shift",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.shiftList = data;
      console.log("this.shiftList",this.shiftList);
     })
  }
  getCostCenter(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get Sale Requisition Outlet",
      "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ToCostCenterList = data;
      // this.Objproduction.To_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
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
  GetproductDetails(valid){
    this.AdvProductionFormSubmitted = true;
    if(valid){
      this.inputBoxDisabled = true;
    this.datepic = false;
    const tempObj = {
      Delivery_Date : this.DateService.dateConvert(new Date (this.Reject_Date)),
      Process_ID : 100
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Custom Order Production",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ProductDetailsList = data;
      console.log("ProductDetailsList",this.ProductDetailsList);
      this.ProductDetailsList.forEach(ele=>{
        ele['Avd_qty'] = ele.Qty
      })
      console.log("this.ProductDetailsList",this.ProductDetailsList);
    })
    }

  }
  saveProduction(valid){
    this.Objproduction.Remarks = this.Objproduction.Remarks ? this.Objproduction.Remarks : " ";
    this.Objproduction.Doc_Date = this.DateService.dateConvert(new Date());
    this.Objproduction.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.Objproduction.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.AdvProductionFormSubmitted2 = true;
    if(valid){
      console.log("valid",valid);
      this.ProductDetailsList.forEach(el =>{
        if(el.Avd_qty && el.Avd_qty !== 0 ){
          const saveObj = {
            Doc_No:"A",
            Product_ID:el.Product_ID,
            Product_Description:el.Product_Description,
            UOM:el.UOM,
            Qty:el.Avd_qty,
            Cost_Cen_ID:this.Objproduction.From_Cost_Cen_ID,
            Req_Qty:el.Qty,
            godown_id:this.Objproduction.From_godown_id,
            Adv_Order_No : el.Adv_Order_No,
            Order_Txn_ID : el.Txn_ID,
            Product_Type_ID : el.Product_Type_ID,
            Material_Type : el.Material_Type
          }
          this.saveData.push({...this.Objproduction,...saveObj})
          console.log("saveData",saveObj);
        }
      })
      if(this.saveData.length) {
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Save Advance Production Voucher"
      });
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Someting Wrong "
        });
      }
    }

  }
  SearchProduction(){
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
        "Report_Name_String": "Browse Production Voucher with order",
        "Json_Param_String": JSON.stringify([tempDate])
      }
      this.GlobalAPI.getData(objj).subscribe((data:any)=>{
        this.GetAllDataList = data;
       console.log("GetAllDataList",this.GetAllDataList)
       this.seachSpinner = false;
      })
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.req_date_B = dateRangeObj[0];
      this.ObjBrowse.req_date2 = dateRangeObj[1];
    }

}
print(obj){
  console.log("Print",obj.Adv_Order_No);
  if (obj.Adv_Order_No) {
    window.open("/Report/Crystal_Files/K4C/Adv_Production_Voucher_Print.aspx?DocNo=" + obj.Adv_Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
  }
}
view(col){
  this.viewData = {};
 if(col.Adv_Order_No){
  this.viewpopUp = true;
  this.viewData = col;
  console.log("col",col);
 }
}
}
class production {
  Brand_ID = 0;
  From_godown_id = 0;
  To_godown_id = 0;
  To_Cost_Cen_ID = 0;
  From_Cost_Cen_ID = 0;
  Doc_Date : string;
  User_ID = 0;
  Remarks : any = "";
  Shift_ID : any;
}
class Browse {
  req_date_B : Date ;
  req_date2 : Date;
  Cost_Cen_ID : 0;
  Product_Type_ID : 0;

}


