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

@Component({
  selector: 'app-micl-raw-material-issue',
  templateUrl: './micl-raw-material-issue.component.html',
  styleUrls: ['./micl-raw-material-issue.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MiclRawMaterialIssueComponent implements OnInit {
  buttonname = "Create";
  Spinner = false;
  SpinnerShow = false;
  itemList:any =[];
  items:any = [];
  tabIndexToView = 0;
  menuList:any = [];
  objRMissue:RMissue = new RMissue();
  objRMissueadd:RMissueadd = new RMissueadd();
  RM_requi_Date = new Date();
  RMissueFormSubmit = false;
  ReqNoList:any = [];
  costcenterList:any = [];
  GodownList:any = [];
  productList:any = [];
  RMissueaddFormSubmit = false;
  AddRMissueList:any = [];

  ObjBrowseData : BrowseData = new BrowseData ();
  reqDocNo:any;

  initDate:any = [];
  RequistionSearchFormSubmit = false;
  seachSpinner = false;
  userType = "";
  docno : any;
  minFromDate = new Date();
  hrYeatList:any = [];
  HR_Year_ID: any;
  RMrewBrowseList:any = [];
  RMrewBrowseListDynamicHeader:any = [];

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    //console.log('Del_Right ==',this.$CompacctAPI.CompacctCookies.Del_Right)
    // $(document).prop('title', this.headerText ? this.headerText : $('title').text());
    this.items =  ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Raw Material Issue",
      Link: "Raw Material Issue"
    });
    this.Finyear();
    this.GetRequisitionNo();
    this.getCostcenter();
    this.Getgodown();
    this.GetProductsDetalis();
    this.userType = this.$CompacctAPI.CompacctCookies.User_Type
    // this.companyname = this.$CompacctAPI.CompacctCookies.Company_Name
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
    // this.Current_Stock = undefined;
  }
  clearData(){
    this.objRMissue = new RMissue();
    this.objRMissueadd = new RMissueadd();
    this.RM_requi_Date = new Date();
    this.objRMissue.Cost_Cen_ID = 4;
    this.ObjBrowseData.Cost_Cen_ID = 4;
    this.RMissueFormSubmit = false;
    this.RMissueaddFormSubmit = false;
    this.AddRMissueList = [];
    this.reqDocNo = undefined;
   }
   Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
      // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
      // this.voucherminDate = new Date(data[0].Fin_Year_Start);
      // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }
  GetRequisitionNo(){
    this.ReqNoList = [];
    const obj = {
      "SP_String": "SP_Txn_Raw_Material_Requisition",
      "Report_Name_String": "Get_product_Details"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     if(data.length) {
        data.forEach(element => {
          // element['label'] = element.Req_No,
          // element['value'] = element.Req_No
          element['label'] = element.Product_Description,
          element['value'] = element.Product_ID
        });
        this.ReqNoList = data;
     //console.log("productList",this.productList);
        }
      else {
        this.ReqNoList = [];
  }
  })
}
  getCostcenter(){
    const obj = {
       "SP_String": "SP_Txn_Raw_Material_Requisition",
       "Report_Name_String": "Get_Cost_Center",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       //console.log("costcenterList  ===",data);
      this.costcenterList = data;
      this.objRMissue.Cost_Cen_ID = 4;
      this.ObjBrowseData.Cost_Cen_ID = 4;
      // this.ObjReqStatusData.Cost_Cen_ID = this.costcenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
      //  this.Getgodown(this.objRMreqi.Cost_Cen_ID);
      // this.GetgodownBrowse(this.ObjBrowseData.Cost_Cen_ID);
      // this.GetgodownReqStatus(this.ObjReqStatusData.Cost_Cen_ID);
      // this.searchData()
   })
   }
   Getgodown(){
       const obj = {
         "SP_String": "SP_Txn_Raw_Material_Requisition",
         "Report_Name_String": "Get_Cost_Center_Godown"
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.GodownList = data;
          //  this.objRMreqi.Godown_ID = this.GodownList.length === 1 ? this.GodownList[0].Godown_ID : undefined;
         
         //console.log("this.toGodownList",this.GodownList);
         })
   }
  GetProductsDetalis(){
      this.productList = [];
      const obj = {
        "SP_String": "SP_Txn_Raw_Material_Requisition",
        "Report_Name_String": "Get_product_Details"
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
          data.forEach(element => {
            element['label'] = element.Product_Description,
            element['value'] = element.Product_ID
          });
          this.productList = data;
       //console.log("productList",this.productList);
          }
        else {
          this.productList = [];
    }
    })
  }
  getUOM(){
    this.objRMissueadd.UOM = undefined;
    if(this.objRMissueadd.Product_ID){
      const ProductFilter = this.productList.filter((el:any)=> Number(el.Product_ID) === Number(this.objRMissueadd.Product_ID))
      //console.log("ProductFilter",ProductFilter);
      // this.productFilterObj = ProductFilter[0];
       this.objRMissueadd.UOM = ProductFilter[0].UOM;
    }
  }
  addRMissue(valid){
    //console.log("valid",valid);
    this.RMissueaddFormSubmit = true;
    if(valid){
      const productFilter:any = this.productList.filter((el:any)=>Number(el.Product_ID) === Number(this.objRMissueadd.Product_ID));
       //console.log("productFilter",productFilter);
      if(productFilter.length){
        this.AddRMissueList.push({
          Product_ID: this.objRMissueadd.Product_ID,
          Product_Description: productFilter[0].Product_Description,
          Yard: this.objRMissueadd.Yard,
          Lot_No : this.objRMissueadd.Lot_No,
          Qty: this.objRMissueadd.Qty,
          
          // Created_By: this.$CompacctAPI.CompacctCookies.User_ID
          // Challan_No : null
        })
        this.RMissueaddFormSubmit = false;
        this.objRMissueadd = new RMissueadd();
      }
    }
    }
  delete(i){
    this.AddRMissueList.splice(i,1);
  }
  SaveIssue(valid){ 
    //console.log("valid",valid);
    this.RMissueFormSubmit = true;
    this.ngxService.start();
    if(valid){
      if(this.AddRMissueList.length){
       this.Spinner = true;
       this.ngxService.start();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "s",
        sticky: true,
        closable: false,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
      }
      else{
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "error",
         summary: "Warn Message",
         detail: "Error Occured "
       });
      }
    }
    else {
      this.Spinner = false;
      this.ngxService.stop();
    }
   }
   onConfirmSave(){
       let saveData:any = [];
         const consCenterFilter:any = this.costcenterList.filter((el:any)=> Number(el.Cost_Cen_ID) === Number(this.objRMissue.Cost_Cen_ID))
         this.AddRMissueList.forEach((el:any)=>{
         let save = {
          Req_No: this.reqDocNo ? this.reqDocNo : "A",
          Req_Date: this.RM_requi_Date ? this.DateService.dateConvert(new Date(this.RM_requi_Date)) : new Date(),
          Cost_Cen_ID: Number(this.objRMissue.Cost_Cen_ID),
          Cost_Cen_Name: consCenterFilter[0].Cost_Cen_Name,
          Godown_ID: this.objRMissue.Godown_ID,
          Product_ID: Number(el.Product_ID),
          Product_Description: el.Product_Description,
          Req_Qty: Number(el.Req_Qty),
          UOM: el.UOM,
          Remarks : this.objRMissue.Remarks,
          Created_On : this.DateService.dateConvert(new Date()),
          Created_By: el.Created_By ? el.Created_By : this.$CompacctAPI.CompacctCookies.User_ID
         }
         saveData.push(save)
         })
         //console.log("Save Data",saveData);
         const obj = {
          "SP_String": "SP_Txn_Raw_Material_Requisition",
          "Report_Name_String": "Create_Requisition",
          "Json_Param_String": JSON.stringify(saveData)
    
        }
        this.GlobalAPI.getData(obj).subscribe(async (data:any)=>{
          //console.log("After Data",data)
          this.docno = data[0].Column1;
          if(data[0].Column1){
           var mgs = this.buttonname === "Save" ? "Save" : "Update"
             this.ngxService.stop();
             this.compacctToast.clear();
              this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Requisition No: " +data[0].Column1,
              detail: "Succesfully " + mgs
            });
           
            // this.SaveNPrintBill();
            // this.Print(data[0].Column1)
             this.clearData();
             this.Spinner = false;
             this.searchData(true);
            if (this.buttonname === "Update") {
             this.tabIndexToView = 0;
             this.items = ["BROWSE", "CREATE"];
             this.buttonname = "Save";
             this.reqDocNo = undefined;
            }
             } else{
               this.Spinner = false;
               this.ngxService.stop();
               this.compacctToast.add({
               key: "compacct-toast",
               severity: "error",
               summary: "Warn Message",
               detail: "Something Wrong"
             });
          }
        })
       // }
      
   }
   getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseData.From_Date = dateRangeObj[0];
      this.ObjBrowseData.To_Date = dateRangeObj[1];
    }
  }
   searchData(valid?){
    // this.RequistionSearchFormSubmit = true;
    this.seachSpinner = true
      const tempDate = {
        From_Date :this.ObjBrowseData.From_Date
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.From_Date))
        : this.DateService.dateConvert(new Date()),
        To_Date :this.ObjBrowseData.To_Date
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.To_Date))
        : this.DateService.dateConvert(new Date()),
        Cost_Cen_ID :this.ObjBrowseData.Cost_Cen_ID ? this.ObjBrowseData.Cost_Cen_ID : 0,
        Godown_ID : this.ObjBrowseData.Godown_ID ? this.ObjBrowseData.Godown_ID : 0
      }
      const obj = {
        "SP_String": "SP_Txn_Raw_Material_Requisition",
        "Report_Name_String": "Browse_Requisition",
        "Json_Param_String": JSON.stringify([tempDate])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.RMrewBrowseList = data;
        if(this.RMrewBrowseList.length){
          this.RMrewBrowseListDynamicHeader= Object.keys(data[0])
        }
        this.RequistionSearchFormSubmit = false;
        this.seachSpinner = false
        //console.log("this.allRequDataList",this.allRequDataList);
      })
  }
  onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("s");
    this.Spinner = false;
    this.ngxService.stop();
  }
  

}
class RMissue{
  Req_No:any;
  Req_Date:any;
  To_Furnace:any;
  Cost_Cen_ID:any;
  Cost_Cen_Name:any;
  Godown_ID:any;
  Remarks:any;
 }
 class RMissueadd{
  Product_ID:any;
  Product_Description:any;
  Yard:any;
  Lot_No:any;
  Qty:any;
  UOM:any;
  Remarks:any;
}
class BrowseData {
  From_Date: string;
  To_Date: string;
  Cost_Cen_ID : any;
  Godown_ID : any;
  To_Cost_Cen_ID :any
  }
