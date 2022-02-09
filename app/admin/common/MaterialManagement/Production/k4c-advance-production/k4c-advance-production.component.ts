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
import { NgxUiLoaderService } from "ngx-ui-loader";

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
  savenprintData = [];
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
  Adv_Order_No: any;
  docno: any;
  docdate: any;
  save_popup = false;
  del_popup = false;

  viewbrowsepopUp = false;
  viewbrowseList = [];
  advno = undefined;
  ordate = undefined;
  orcostcen = undefined;
  ordeldate = undefined;
  ordelTime = undefined;
  orcustname = undefined;
  orcustmob = undefined;
  orprodes = undefined;
  orpromod = undefined;
  orpromd1 = undefined;
  oqpromode2 = undefined;
  orprom3 = undefined;
  prom4 = undefined;
  orflavour = undefined;
  orfinish = undefined;
  orshape = undefined;
  ortier = undefined;
  orbox = undefined;
  orbase = undefined;
  orchangoncake = undefined;
  ortakenby = undefined;
  orrate = undefined;
  orqty = undefined;
  orwtinpound = undefined;
  oraccomp = undefined;
  oramt = undefined;
  ordisamt = undefined;
  orgrossamt = undefined;
  ornetamt = undefined;
  orroundoff = undefined;
  oramtpay = undefined;
  ornetpay = undefined;
  orttlpaid = undefined;
  ornetdue = undefined;
  ordelcostname = undefined;
  ordeltype = undefined;
  ordelmob = undefined;
  ordelaltmob = undefined;
  ordelname = undefined;
  ordeladd = undefined;
  ordelpin = undefined;
  ordelnearby = undefined;

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
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
    this.ngxService.stop();
    this.viewbrowseList = [];
  }
  onConfirm(){
    this.ngxService.start();
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Add Production Voucher",
      "Json_Param_String": JSON.stringify(this.saveData)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Column1 ===",data[0].Column1);
      var tempID = data[0].Column1;
      //this.Adv_Order_No = data[0].Column1;
      if(data[0].Column1){
        this.SearchProduction();
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Advance Production Entry No. " + tempID,
         detail: "Advance Production Entry Succesfully"
        });
       this.clearData();
       //this.SaveNPrint();
       this.onReject()
      }
      else {
        this.ngxService.stop();
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
  // savenprintOrderNo(){
  //   this.ProductDetailsList.forEach(el =>{
  //       const savenprintObj = {
  //         Adv_Order_No : el.Adv_Order_No
  //       }
  //       this.savenprintData.push({savenprintObj})
  //       console.log("savenprintData",savenprintObj);
  //   })
  // }
  // SaveNPrint() {
  //   if (this.Adv_Order_No) {
  //     window.open("/Report/Crystal_Files/K4C/Adv_Production_Voucher_Print_New.aspx?DocNo=" + this.Adv_Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
  //  );
  //   }
  //   //console.log('Doc_No ==', this.Objcustomerdetail.Adv_Order_No)
  // }
   onReject() {
    this.compacctToast.clear("c");
    this.saveData = []
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
      Brand_ID : this.Objproduction.Brand_ID,
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
    this.del_popup = false;
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
        this.save_popup = true;
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
  Browseprint(Objp){
    console.log("Print",Objp.Adv_Order_No);
  if (Objp.Adv_Order_No) {
    window.open("/Report/Crystal_Files/K4C/Adv_Production_Voucher_Print_New.aspx?DocNo=" + Objp.Adv_Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
    );
  }
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
Delete(col){
  this.save_popup = false;
  if(col.Doc_No){
    this.del_popup = true;
    this.docno = col.Doc_No;
    //this.docdate = col.Doc_Date;
    console.log("docno",this.docno);
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
onConfirm2() {
  const Tempobj = {
    Doc_No : this.docno,
    User_ID : this.$CompacctAPI.CompacctCookies.User_ID
  }
  const obj = {
    "SP_String" : "SP_Production_Voucher_New",
    "Report_Name_String" : "Delete Adv Order Production Voucher",
    "Json_Param_String" : JSON.stringify([Tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   // console.log(data);
    if(data[0].Column1 === "Done") {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Doc_No : " + this.docno,
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
onReject2() {
  this.compacctToast.clear("c");
}
viewbrowsedetails(docno){
 if(docno.Doc_No){
  this.viewbrowsepopUp = true;

  this.viewbrowseList = [];
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "View Order Details",
      "Json_Param_String": JSON.stringify([{Doc_No : docno.Adv_Order_No}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Data From Api",data);
      this.viewbrowseList = data;

      this.advno = data[0].Adv_Order_No ? data[0].Adv_Order_No : '-';
      this.ordate = data[0].Order_Date ? data[0]. Order_Date : '-';
      this.orcostcen = data[0].Cost_Cent_Name ? data[0].Cost_Cent_Name : '-';
      this.ordeldate = data[0].Del_Date ? data[0].Del_Date : '-';
      this.ordelTime = data[0].Del_Date_Time ? data[0].Del_Date_Time : '-';
      this.orcustname = data[0].Customer_Name ? data[0].Customer_Name : '-';
      this.orcustmob = data[0].Customer_Mobile ? data[0].Customer_Mobile : '-';
      this.orprodes = data[0].Product_Description ? data[0].Product_Description : '-';
      this.orpromod = data[0].Product_Modifier ? data[0].Product_Modifier : '-';
      this.orpromd1 = data[0].Product_Modifier_1 ? data[0].Product_Modifier_1 : '-';
      this.oqpromode2 = data[0].Product_Modifier_2 ? data[0].Product_Modifier_2 : '-';
      this.orprom3 = data[0].Product_Modifier_3 ? data[0].Product_Modifier_3 : '-';
      this.prom4 = data[0].Product_Modifier_4 ? data[0].Product_Modifier_4 : '-';
      this.orflavour = data[0].Flavour ? data[0].Flavour : '-';
      this.orfinish = data[0].Finishing ? data[0].Finishing : '-';
      this.orshape = data[0].Shape ? data[0].Shape : '-';
      this.ortier = data[0].Tier ? data[0].Tier : '-';
      this.orbox = data[0].Boxes ? data[0].Boxes : '-';
      this.orbase = data[0].Base ? data[0].Base : '-';
      this.orchangoncake = data[0].Changes_on_Cake ? data[0].Changes_on_Cake : '-';
      this.ortakenby = data[0].Order_Taken_By ? data[0].Order_Taken_By : '-';
      this.orrate = data[0].Rate ? data[0].Rate : '-';
      this.orqty = data[0].Qty ? data[0].Qty : '-';
      this.orwtinpound = data[0].Weight_in_Pound ? data[0].Weight_in_Pound : '-';
      this.oraccomp = data[0].Acompanish ? data[0].Acompanish : '-';
      this.oramt = data[0].Amount ? data[0].Amount : '-';
      this.ordisamt = data[0].Discount_Amt ? data[0].Discount_Amt : '-';
      this.orgrossamt = data[0].Gross_Amt ? data[0].Gross_Amt : '-';
      this.ornetamt = data[0].Net_Amount ? data[0].Net_Amount : '-';
      this.orroundoff = data[0].Rounded_Off ? data[0].Rounded_Off : '-';
      this.oramtpay = data[0].Amount_Payable ? data[0].Amount_Payable : '-';
      this.ornetpay = data[0].Amount_Payable ? data[0].Amount_Payable : '-';
      this.orttlpaid = data[0].Total_Paid ? data[0].Total_Paid : '-';
      this.ornetdue = data[0].Net_Due ? data[0].Net_Due : '-';
      this.ordelcostname = data[0].Cost_Center_Name ? data[0].Cost_Center_Name : '-';
      this.ordeltype = data[0].Delivery_Type ? data[0].Delivery_Type : '-';
      this.ordelmob = data[0].Delivery_Mobile_No ? data[0].Delivery_Mobile_No : '-';
      this.ordelaltmob = data[0].Delivery_Alt_Mobile_No ? data[0].Delivery_Alt_Mobile_No : '-';
      this.ordelname = data[0].Delivery_Name ? data[0].Delivery_Name : '-';
      this.ordeladd = data[0].Delivery_Address ? data[0].Delivery_Address : '-';
      this.ordelpin = data[0].Delivery_Pin_Code ? data[0].Delivery_Pin_Code : '-';
      this.ordelnearby = data[0].Delivery_Near_By ? data[0].Delivery_Near_By : '-';

    // console.log("this.editList  ===",data);
    // console.log("edit From_Process_IDe ===" , this.Objproduction.From_Process_ID)

  })
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


