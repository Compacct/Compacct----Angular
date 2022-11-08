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
  RM_Issue_Date = new Date();
  RMissueFormSubmit = false;
  ReqNoList:any = [];
  FcostcenterList:any = [];
  FGodownList:any = [];
  TocostcenterList:any = [];
  ToGodownList:any = [];
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

  ObjPendingIndent = new PendingIndent();
  PendingIndentFormSubmitted = false;
  PendingIndentList:any = [];
  DynamicHeaderforPIndent:any = [];
  costcenterListPeding:any = [];
  godownListPeding:any = [];
  GodownList:any = [];
  flag = false;
  docdateDisabled = true;
  Topfielddisabled = false;
  editDis = false;
  saveData:any = [];
  ToFurnacebrowseList:any = [];

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
    this.items =  ["BROWSE", "CREATE", "PENDING REQUISITION"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Raw Material Issue",
      Link: "Raw Material Issue"
    });
    this.Finyear();
    // this.GetRequisitionNo();
    this.getFCostcenter();
    this.GetFgodown();
    this.getToCostcenter();
    this.GetTogodown();
    // this.GetProductsDetalis();
    this.GetTofurnacebrowse();
    this.getCostcenterPenReq();
    this.getgodownPenReq();
    this.userType = this.$CompacctAPI.CompacctCookies.User_Type
    // this.companyname = this.$CompacctAPI.CompacctCookies.Company_Name
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE", "PENDING REQUISITION"];
    this.buttonname = "Save";
    this.clearData();
    // this.Current_Stock = undefined;
  }
  clearData(){
    this.objRMissue = new RMissue();
    this.objRMissueadd = new RMissueadd();
    this.RM_Issue_Date = new Date();
    this.objRMissue.F_Cost_Cen_ID = 36;
    this.ObjBrowseData.Cost_Cen_ID = 4;
    this.objRMissue.To_Cost_Cen_ID = 4;
    this.RMissueFormSubmit = false;
    this.RMissueaddFormSubmit = false;
    this.AddRMissueList = [];
    this.productList = [];
    this.reqDocNo = undefined;
    this.docdateDisabled = true;
    this.Topfielddisabled = false;
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
  getFCostcenter(){
    const obj = {
       "SP_String": "SP_MICL_Raw_Material_Issue",
       "Report_Name_String": "Get_F_Cost_Center",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       //console.log("costcenterList  ===",data);
      this.FcostcenterList = data;
      this.objRMissue.F_Cost_Cen_ID = 36;
      // this.ObjBrowseData.Cost_Cen_ID = 4;
   })
   }
   GetFgodown(){
       const obj = {
        "SP_String": "SP_MICL_Raw_Material_Issue",
        "Report_Name_String": "Get_F_Cost_Center_Godown"
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.FGodownList = data;
          //  this.objRMreqi.Godown_ID = this.GodownList.length === 1 ? this.GodownList[0].Godown_ID : undefined;
         
         //console.log("this.toGodownList",this.GodownList);
         })
   }
  getToCostcenter(){
    const obj = {
       "SP_String": "SP_MICL_Raw_Material_Issue",
       "Report_Name_String": "Get_Cost_Center",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       //console.log("costcenterList  ===",data);
      this.TocostcenterList = data;
      this.objRMissue.To_Cost_Cen_ID = 4;
   })
   }
   GetTogodown(){
       const obj = {
        "SP_String": "SP_MICL_Raw_Material_Issue",
        "Report_Name_String": "Get_Cost_Center_Godown"
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.ToGodownList = data;
          //  this.objRMreqi.Godown_ID = this.GodownList.length === 1 ? this.GodownList[0].Godown_ID : undefined;
         
         //console.log("this.toGodownList",this.GodownList);
         })
   }
   GetRequisitionNo(){
     this.ReqNoList = [];
     if (this.objRMissue.To_Godown_ID) {
     const tempobj = {
       Cost_Cen_ID : this.objRMissue.To_Cost_Cen_ID,
       Godown_ID : this.objRMissue.To_Godown_ID
      }
     const obj = {
       "SP_String": "SP_MICL_Raw_Material_Issue",
       "Report_Name_String": "Get_Requisition_List",
       "Json_Param_String": JSON.stringify([tempobj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length) {
         data.forEach(element => {
           element['label'] = element.Req_No,
           element['value'] = element.Req_No
         });
         this.ReqNoList = data;
      //console.log("productList",this.productList);
         }
       else {
         this.ReqNoList = [];
   }
   })
   }
 }
  GetProductsDetalis(valid){
      this.productList = [];
      this.RMissueFormSubmit = true;
      this.SpinnerShow = true;
      this.docdateDisabled = true;
      this.Topfielddisabled = false;
      if (valid) {
        if(Number(this.objRMissue.F_Godown_ID) !== Number(this.objRMissue.To_Godown_ID)){
        const Dobj = {
          F_Cost_Cen_ID: Number(this.objRMissue.F_Cost_Cen_ID),
          F_Godown_ID : Number(this.objRMissue.F_Godown_ID),
          To_Cost_Cen_ID: Number(this.objRMissue.To_Cost_Cen_ID),
          To_Godown_ID : Number(this.objRMissue.To_Godown_ID),
          Doc_Date : this.DateService.dateConvert(new Date(this.RM_Issue_Date)),
          Req_No : this.objRMissue.Req_No,
          // Req_Date : this.DateService.dateConvert(new Date(this.ReqDate))
          }
      const obj = {
        "SP_String": "SP_MICL_Raw_Material_Issue",
        "Report_Name_String": "Get_product_Details",
       "Json_Param_String": JSON.stringify([Dobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //  if(data.length) {
          data.forEach(element => {
            var yard = this.FGodownList.filter(el => Number(el.Godown_ID) === Number(this.objRMissue.F_Godown_ID))
            element['Yard'] = yard[0].godown_name
          });
          this.productList = data;
          this.RMissueFormSubmit = false;
          this.SpinnerShow = false;
       //console.log("productList",this.productList);
        //   }
        // else {
        //   this.productList = [];
          this.RMissueFormSubmit = false;
          this.SpinnerShow = false;
          this.docdateDisabled = false;
          this.Topfielddisabled = true;
    // }
    })
    }
    else{
      this.SpinnerShow = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "can't use same stock point"
      });
    }
  }
    else {
      this.SpinnerShow = false;
    }
  }
  clearbutton(){
    this.objRMissue = new RMissue();
    this.objRMissueadd = new RMissueadd();
    this.RM_Issue_Date = new Date();
    this.objRMissue.F_Cost_Cen_ID = 36;
    this.ObjBrowseData.Cost_Cen_ID = 4;
    this.objRMissue.To_Cost_Cen_ID = 4;
    this.RMissueFormSubmit = false;
    this.RMissueaddFormSubmit = false;
    this.ReqNoList = [];
    this.productList = [];
    this.reqDocNo = undefined;
    this.docdateDisabled = true;
    this.Topfielddisabled = false;
  }
  // getUOM(){
  //   this.objRMissueadd.UOM = undefined;
  //   if(this.objRMissueadd.Product_ID){
  //     const ProductFilter = this.productList.filter((el:any)=> Number(el.Product_ID) === Number(this.objRMissueadd.Product_ID))
  //     //console.log("ProductFilter",ProductFilter);
  //     // this.productFilterObj = ProductFilter[0];
  //      this.objRMissueadd.UOM = ProductFilter[0].UOM;
  //   }
  // }
  // addRMissue(valid){
  //   //console.log("valid",valid);
  //   this.RMissueaddFormSubmit = true;
  //   if(valid){
  //     const productFilter:any = this.productList.filter((el:any)=>Number(el.Product_ID) === Number(this.objRMissueadd.Product_ID));
  //      //console.log("productFilter",productFilter);
  //     if(productFilter.length){
  //       this.AddRMissueList.push({
  //         Product_ID: this.objRMissueadd.Product_ID,
  //         Product_Description: productFilter[0].Product_Description,
  //         Yard: this.objRMissueadd.Yard,
  //         Lot_No : this.objRMissueadd.Lot_No,
  //         Qty: this.objRMissueadd.Qty,
          
  //         // Created_By: this.$CompacctAPI.CompacctCookies.User_ID
  //         // Challan_No : null
  //       })
  //       this.RMissueaddFormSubmit = false;
  //       this.objRMissueadd = new RMissueadd();
  //     }
  //   }
  //   }
  // delete(i){
  //   this.AddRMissueList.splice(i,1);
  // }
  qtyChq(col){
    this.flag = false;
    console.log("col",col);
    if(col.Delivery_Qty){
      if(col.Delivery_Qty > col.Batch_Qty){
      if(col.Delivery_Qty <=  col.Batch_Qty){
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
             else if(col.Delivery_Qty > col.Req_Qty){
             if(col.Delivery_Qty <=  col.Req_Qty){
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
                         detail: "Quantity can't be more than Requisition quantity "
                       });
          
                     }
              }
    }
   }
  SaveIssue(){ 
    //console.log("valid",valid);
    // this.RMissueFormSubmit = true;
    this.ngxService.start();
    if(this.productList.length){
      // if(this.AddRMissueList.length){
      if(this.saveqty()) {
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
    // }
    // else {
    //   this.Spinner = false;
    //   this.ngxService.stop();
    // }
   }
   saveqty(){
    let flag = true;
   for(let i = 0; i < this.productList.length ; i++){
    if(Number(this.productList[i].Batch_Qty) <  Number(this.productList[i].Delivery_Qty)){
      flag = false;
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Quantity can't be more than in batch available quantity "
        });
      break;
    }
    else if(Number(this.productList[i].Req_Qty) <  Number(this.productList[i].Delivery_Qty)){
      flag = false;
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Quantity can't be more than Requisition quantity "
        });
      break;
    }
   }
   return flag;
  }
   onConfirmSave(){
        //  const consCenterFilter:any = this.FcostcenterList.filter((el:any)=> Number(el.Cost_Cen_ID) === Number(this.objRMissue.F_Cost_Cen_ID))
        //  this.AddRMissueList.forEach((el:any)=>{
        //  let save = {
        //   Req_No: this.reqDocNo ? this.reqDocNo : "A",
        //   Doc_Date: this.DateService.dateConvert(new Date()),
        //   Req_Date: this.RM_Issue_Date ? this.DateService.dateConvert(new Date(this.RM_Issue_Date)) : new Date(),
        //   F_Cost_Cen_ID: Number(this.objRMissue.F_Cost_Cen_ID),
        //   F_Godown_ID: this.objRMissue.F_Godown_ID,
        //   To_Cost_Cen_ID: this.objRMissue.To_Cost_Cen_ID,
        //   To_Godown_ID: this.objRMissue.To_Godown_ID,
        //   Product_ID: Number(el.Product_ID),
        //   Product_Description: el.Product_Description,
        //   Req_Qty: Number(el.Req_Qty),
        //   UOM: el.UOM,
        //   Remarks : this.objRMissue.Remarks,
        //   Created_On : this.DateService.dateConvert(new Date()),
        //   Created_By: el.Created_By ? el.Created_By : this.$CompacctAPI.CompacctCookies.User_ID
        //  }
        //  saveData.push(save)
        //  })
         this.saveData = [];
         this.objRMissue.Doc_Date = this.DateService.dateConvert(new Date(this.RM_Issue_Date));
        //  this.objRMissue.Req_Date = this.DateService.dateConvert(new Date(this.RM_Issue_Date));
         this.productList.forEach(el=>{
          if(el.Delivery_Qty){      //&& Number(el.Delivery_Qty) !== 0
            const saveObj = {
              // Doc_No: "A",
              // Accepted_Qty : this.Auto_Accepted == "N" ? 0 : el.Delivery_Qty,
              // Doc_Date: this.DateService.dateTimeConvert(new Date(this.ChallanDate)),
              // F_Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
              // F_Godown_ID: this.Objdispatch.From_Godown_ID,
              // To_Cost_Cen_ID: this.Objdispatch.Cost_Cen_ID,
              // To_Godown_ID: this.Objdispatch.To_Godown_ID,
              Product_ID: el.product_id,
              Batch_No: el.Batch_No,
              Req_Qty: el.Req_Qty,
              // Purpose: el.Purpose,
              Qty: el.Delivery_Qty,
              Accepted_Qty: el.Delivery_Qty,
              // Rate: 0,
              UOM: el.UOM,
              // Req_No: this.SelectedIndent,
              Created_By: this.$CompacctAPI.CompacctCookies.User_ID,
              // User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
              // REMARKS: this.Objdispatch.REMARKS ? this.Objdispatch.REMARKS : "NA",
              // Fin_Year_ID: this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
              // Vehicle_Details : this.Objdispatch.Vehicle_Details,
              // Adv_Order_No : "NA",
              // Indent_Date : this.DateService.dateConvert(new Date(this.todayDate)),
              // Accept_Reason_ID : null,
              // Accept_Reason : null,
              // Status : this.Auto_Accepted == "Y" ? "Updated" : "Not Updated",
              // Material_Type : "Finished",
              // Total_Qty : Number(this.totaldelqty),
              // Total_Accepted_Qty  : this.Auto_Accepted == "N" ? 0 : Number(this.totaldelqty)
            }
            this.saveData.push({...saveObj,...this.objRMissue})
          }
        })
         //console.log("Save Data",saveData);
         const obj = {
          "SP_String": "SP_MICL_Raw_Material_Issue",
          "Report_Name_String": "Create_MICL_Raw_Material_Issue",
          "Json_Param_String": JSON.stringify(this.saveData)
    
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
             this.ReqNoList = [];
             this.Spinner = false;
             this.searchData(true);
            if (this.buttonname === "Update") {
             this.tabIndexToView = 0;
             this.items = ["BROWSE", "CREATE", "PENDING REQUISITION"];
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
  GetTofurnacebrowse(){
    const obj = {
     "SP_String": "SP_MICL_Raw_Material_Issue",
     "Report_Name_String": "Get_Cost_Center_Godown"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ToFurnacebrowseList = data;
       //  this.objRMreqi.Godown_ID = this.GodownList.length === 1 ? this.GodownList[0].Godown_ID : undefined;
      
      //console.log("this.toGodownList",this.GodownList);
      })
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
        "SP_String": "SP_MICL_Raw_Material_Issue",
        "Report_Name_String": "Browse_MICL_Dispatch_Challan",
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
  // PENDING INDENT
getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjPendingIndent.start_date = dateRangeObj[0];
    this.ObjPendingIndent.end_date = dateRangeObj[1];
  }
}
getCostcenterPenReq(){
  const obj = {
     "SP_String": "SP_MICL_Raw_Material_Issue",
     "Report_Name_String": "Get_Cost_Center",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //  console.log("costcenterListPeding  ===",data);
    this.costcenterListPeding = data;
    this.ObjPendingIndent.Cost_Cen_ID = 4;
  })
 }
 getgodownPenReq(){
  const obj = {
     "SP_String": "SP_MICL_Raw_Material_Issue",
     "Report_Name_String": "Get_Cost_Center_Godown",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //  console.log("godownListPeding  ===",data);
    this.godownListPeding = data;
  })
 }
GetPendingIndent(valid){
    this.PendingIndentFormSubmitted = true;
    const start = this.ObjPendingIndent.start_date
    ? this.DateService.dateConvert(new Date(this.ObjPendingIndent.start_date))
    : this.DateService.dateConvert(new Date());
    const end = this.ObjPendingIndent.end_date
    ? this.DateService.dateConvert(new Date(this.ObjPendingIndent.end_date))
    : this.DateService.dateConvert(new Date());
    const tempobj = {
     Cost_Cen_ID : this.ObjPendingIndent.Cost_Cen_ID,
     Godown_ID : this.ObjPendingIndent.Godown_ID ? this.ObjPendingIndent.Godown_ID : 0,
     From_Date : start,
     To_Date : end,
    }
    if (valid) {
    const obj = {
      "SP_String": "SP_MICL_Raw_Material_Issue",
      "Report_Name_String": "Browse_Raw_Material_Pending_Requisition",
      "Json_Param_String": JSON.stringify([tempobj])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.PendingIndentList = data;
      // this.BackupSearchedlist = data;
      // this.GetDistinct();
      if(this.PendingIndentList.length){
        this.DynamicHeaderforPIndent = Object.keys(data[0]);
      }
      else {
        this.DynamicHeaderforPIndent = [];
      }
      this.seachSpinner = false;
      this.PendingIndentFormSubmitted = false;
      console.log("DynamicHeaderforPIndent",this.DynamicHeaderforPIndent);
    })
    }
}
PrintIndent(DocNo) {
  if(DocNo) {
  const objtemp = {
    "SP_String": "SP_Txn_Requisition",
    "Report_Name_String": "Requisition_Print"
    }
  this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
    var printlink = data[0].Column1;
    window.open(printlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  })
  }
}
  

}
class RMissue{
  Req_No:any;
  Doc_Date : any;
  Req_Date:any;
  F_Cost_Cen_ID:any;
  F_Godown_ID:any;
  To_Cost_Cen_ID:any;
  To_Godown_ID:any;
  // Cost_Cen_Name:any;
  // Godown_ID:any;
  Vehicle_Details = "NA"
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
  }
  class PendingIndent{
    Company_ID : any;
    start_date : Date;
    end_date : Date;
    Cost_Cen_ID : any;
    Godown_ID : any;
  }
