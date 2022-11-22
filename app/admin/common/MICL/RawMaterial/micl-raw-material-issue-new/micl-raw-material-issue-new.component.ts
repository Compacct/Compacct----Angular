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
  selector: 'app-micl-raw-material-issue-new',
  templateUrl: './micl-raw-material-issue-new.component.html',
  styleUrls: ['./micl-raw-material-issue-new.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MiclRawMaterialIssueNewComponent implements OnInit {
  issueType:any;
  buttonname = "Save";
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

  ObjproductAdd:productAdd = new productAdd();
  AddProDetailsFormSubmitted:boolean = false;
  ProductionlList:any = [];
  BatchNoList:any = [];
  AddProDetails:any = [];

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
  DocNo = undefined;
  prodisabledflag:boolean = true;
  YardName:any;

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
  ) { 
    this.route.queryParams.subscribe(params => {
      //console.log(params);
      this.issueType = params['Type'];
      
     })
  }

  ngOnInit() {
    //console.log('Del_Right ==',this.$CompacctAPI.CompacctCookies.Del_Right)
    // $(document).prop('title', this.headerText ? this.headerText : $('title').text());
    this.items =  ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: this.issueType + " Issue",
      Link: "Production Management -> Transaction ->" + this.issueType +  "Issue"
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
    this.GetProductionpro();
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
    this.RM_Issue_Date = new Date();
    this.objRMissue.F_Cost_Cen_ID = 36;
    this.ObjBrowseData.Cost_Cen_ID = 4;
    this.objRMissue.To_Cost_Cen_ID = 4;
    this.RMissueFormSubmit = false;
    this.RMissueaddFormSubmit = false;
    this.AddRMissueList = [];
    this.AddProDetails = [];
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
       "SP_String": "SP_MICL_Raw_Material_Issue_New",
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
        "SP_String": "SP_MICL_Raw_Material_Issue_New",
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
       "SP_String": "SP_MICL_Raw_Material_Issue_New",
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
        "SP_String": "SP_MICL_Raw_Material_Issue_New",
        "Report_Name_String": "Get_Cost_Center_Godown"
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.ToGodownList = data;
          //  this.objRMreqi.Godown_ID = this.GodownList.length === 1 ? this.GodownList[0].Godown_ID : undefined;
         
         //console.log("this.toGodownList",this.GodownList);
         })
   }
//    GetRequisitionNo(){
//      this.ReqNoList = [];
//      if (this.objRMissue.To_Godown_ID) {
//      const tempobj = {
//        Cost_Cen_ID : this.objRMissue.To_Cost_Cen_ID,
//        Godown_ID : this.objRMissue.To_Godown_ID
//       }
//      const obj = {
//        "SP_String": "SP_MICL_Raw_Material_Issue",
//        "Report_Name_String": "Get_Requisition_List",
//        "Json_Param_String": JSON.stringify([tempobj])
//      }
//      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
//       if(data.length) {
//          data.forEach(element => {
//            element['label'] = element.Req_No,
//            element['value'] = element.Req_No
//          });
//          this.ReqNoList = data;
//       //console.log("productList",this.productList);
//          }
//        else {
//          this.ReqNoList = [];
//    }
//    })
//    }
//  }
  GetProductsDetalis(valid){
      this.AddProDetails = [];
      this.RMissueFormSubmit = true;
      this.SpinnerShow = true;
      this.docdateDisabled = true;
      this.Topfielddisabled = false;
      this.prodisabledflag = false;
      if (valid) {
        if(Number(this.objRMissue.F_Godown_ID) !== Number(this.objRMissue.To_Godown_ID)){
        const Dobj = {
          Doc_Date : this.DateService.dateConvert(new Date(this.RM_Issue_Date)),
          F_Cost_Cen_ID: Number(this.objRMissue.F_Cost_Cen_ID),
          F_Godown_ID : Number(this.objRMissue.F_Godown_ID),
          To_Cost_Cen_ID: Number(this.objRMissue.To_Cost_Cen_ID),
          To_Godown_ID : Number(this.objRMissue.To_Godown_ID),
          Type_Of_Product : this.issueType
          // Req_No : this.objRMissue.Req_No,
          // Req_Date : this.DateService.dateConvert(new Date(this.ReqDate))
          }
      const obj = {
        "SP_String": "SP_MICL_Raw_Material_Issue_New",
        "Report_Name_String": "Get_Product_List_For_Table",
       "Json_Param_String": JSON.stringify([Dobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //  if(data.length) {
          // data.forEach(element => {
          //   var yard = this.FGodownList.filter(el => Number(el.Godown_ID) === Number(this.objRMissue.F_Godown_ID))
          //   element['Yard'] = yard[0].godown_name
          // });
          this.AddProDetails = data;
          this.objRMissue.Remarks = data.length ? data[0].Remarks : undefined;
          this.DocNo = this.AddProDetails.length ? data[0].Doc_No : undefined;
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
    this.ObjproductAdd = new productAdd();
    this.prodisabledflag = true;
    this.RM_Issue_Date = new Date();
    this.objRMissue.F_Cost_Cen_ID = 36;
    this.ObjBrowseData.Cost_Cen_ID = 4;
    this.objRMissue.To_Cost_Cen_ID = 4;
    this.RMissueFormSubmit = false;
    this.RMissueaddFormSubmit = false;
    this.ReqNoList = [];
    this.AddProDetails = [];
    this.reqDocNo = undefined;
    this.docdateDisabled = true;
    this.Topfielddisabled = false;
    this.YardName = undefined;
  }
  getyardName(){
    var yardn = this.FGodownList.filter(el => Number(el.Godown_ID) === Number(this.objRMissue.F_Godown_ID));
      var yardname = yardn ? yardn[0].godown_name : undefined;
      this.YardName = this.objRMissue.F_Godown_ID ? "at " + yardname : undefined;
  }
  changedisabled(){
    this.prodisabledflag = false;
    if (this.objRMissue.F_Godown_ID){
      this.ObjproductAdd = new productAdd();
      this.prodisabledflag = true;
    }
    if (this.objRMissue.To_Godown_ID){
      this.ObjproductAdd = new productAdd();
      this.prodisabledflag = true;
    }
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
  // FOR PRODUCT NAME DROPDOWN
  GetProductionpro(){
    const tempObj = {
      Type_Of_Product : this.issueType
    }
    const obj = {
      "SP_String": "SP_MICL_Raw_Material_Issue_New",
      "Report_Name_String": "Get_Product_For_Dropdown",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //this.ProductionlList = data;
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Description,
          element['value'] = element.Product_ID
        });
        this.ProductionlList = data;
      } else {
        this.ProductionlList = [];

      }
       console.log("Production List ===",this.ProductionlList);
    })
  }
  ProductChange() {
    this.BatchNoList =[];
    this.ObjproductAdd.UOM = undefined;
  if(this.ObjproductAdd.Product_ID) {
    const ctrl = this;
    this.GetBatchNo();
    const productObj = $.grep(ctrl.ProductionlList,function(item) {return item.Product_ID == ctrl.ObjproductAdd.Product_ID})[0];
    //console.log(productObj);
    //this.ObjproductAdd.ID = productObj.ID;
    this.ObjproductAdd.Product_Description = productObj.Product_Description;
    this.ObjproductAdd.UOM = productObj.UOM;
  }
  }
  GetBatchNo(){
    // this.RMissueFormSubmit = true;
    // if(this.objRMissue.F_Godown_ID && this.objRMissue.To_Godown_ID) {
    const TempObj = {
      Product_ID : this.ObjproductAdd.Product_ID,
      Cost_Cen_ID : this.objRMissue.F_Cost_Cen_ID,
      Godown_ID : this.objRMissue.F_Godown_ID
     }
    const obj = {
      "SP_String": "SP_MICL_Raw_Material_Issue_New",
      "Report_Name_String": "Get_Batch_NO",
      "Json_Param_String": JSON.stringify([TempObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.BatchNoList = data;
     this.ObjproductAdd.Batch_No = this.BatchNoList.length ? this.BatchNoList[0].Batch_No : undefined;
     //console.log('Batch No ==', data)
    //  this.RMissueFormSubmit = false;
    });
  // }
  }
  AddProductDetails(valid){
  //console.log('add ===', valid)
  this.AddProDetailsFormSubmitted = true;
  if(valid && this.GetSelectedBatchqty()){
    // console.log(this.ObjproductAdd.Batch_No)
    // var ProDes = this.ProductionlList.filter(item => item.Product_ID == this.ObjproductAdd.Product_ID);
    var yard = this.FGodownList.filter(el => Number(el.Godown_ID) === Number(this.objRMissue.F_Godown_ID));
    var batch = this.BatchNoList.filter(el => el.Batch_No == this.ObjproductAdd.Batch_No);
  var productObj = {
    //ID : this.ObjproductAdd.ID,
    Doc_No : this.AddProDetails.length ? this.AddProDetails[0].Doc_No : "A",
    Product_ID : this.ObjproductAdd.Product_ID,
    Product_Description : this.ObjproductAdd.Product_Description,
    F_Godown_ID : this.objRMissue.F_Godown_ID,
    F_Godown_Name : yard[0].godown_name,
    Batch_No : this.ObjproductAdd.Batch_No,
    Batch_Qty : batch[0].Batch_Qty,
    Qty :  this.ObjproductAdd.Qty,
    UOM : this.ObjproductAdd.UOM
    //Return_Reason : RR.Return_Reason
  };
  // this.AddProDetails.push(productObj);
 // console.log("Product Submit",this.AddProDetails);
 var sameProdTypeFlag = false;
 this.AddProDetails.forEach(item => {
   //console.log('enter select');
   //console.log(item.Product_ID);
   //console.log(this.ObjaddbillForm.Product_ID);
   //console.log(item.Product_ID == this.ObjaddbillForm.Product_ID);
   if(item.Product_ID == this.ObjproductAdd.Product_ID && item.Batch_No == this.ObjproductAdd.Batch_No) {
     //console.log('select item true');
     item.Qty = Number(item.Qty) + Number( productObj.Qty);

     sameProdTypeFlag = true;
   }
   // count = count + Number(item.Net_Amount);
 });

 if(sameProdTypeFlag == false) {
  this.AddProDetails.push(productObj);
 }

 //console.log("this.productSubmit",this.productSubmit);
  this.AddProDetailsFormSubmitted = false;
  this.ObjproductAdd = new productAdd();
  this.BatchNoList = [];
 // this.ExProductFlag = false;
  }
  }
  GetSelectedBatchqty () {
   // if (this.Objproduction.Process_ID.toString() !== '1' && !this.ObjproductAdd.Batch_No ) {
  //   if (this.Objproduction.From_Process_ID !== undefined && !this.ObjproductAdd.Batch_No) {
  //     this.compacctToast.clear();
  //       this.compacctToast.add({
  //         key: "compacct-toast",
  //         severity: "error",
  //         summary: "Warn Message",
  //         detail: "Can't add product without batch No."
  //       });
  //   return false;
  //   }
  //   const sameproduct = this.AddProDetails.filter(item=> item.Product_ID === this.ObjproductAdd.Product_ID && !this.ObjproductAdd.Batch_No);
  // if(sameproduct.length) {
  //   this.compacctToast.clear();
  //       this.compacctToast.add({
  //         key: "compacct-toast",
  //         severity: "error",
  //         summary: "Warn Message",
  //         detail: "Can't add same product."
  //       });
  //   return false;
  // }
  // const sameproductwithbatch = this.AddProDetails.filter(item=> item.Batch_No === this.ObjproductAdd.Batch_No && item.Product_ID === this.ObjproductAdd.Product_ID );
  // if(sameproductwithbatch.length) {
  //   this.compacctToast.clear();
  //       this.compacctToast.add({
  //         key: "compacct-toast",
  //         severity: "error",
  //         summary: "Warn Message",
  //         detail: "Can't use same batch no.."
  //       });
  //   return false;
  // }
  const baychqtyarr = this.BatchNoList.filter(item=> item.Batch_No === this.ObjproductAdd.Batch_No);
    if(baychqtyarr.length) {
      if(this.ObjproductAdd.Qty <=  baychqtyarr[0].Batch_Qty) {
        return true;
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Quantity can't be more than in batch available quantity "
        });
        return false;
      }
   }
    else {
      return true;
    }
  }
  delete(index) {
  this.AddProDetails.splice(index,1)

  }
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
    if(this.AddProDetails.length){
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
   for(let i = 0; i < this.AddProDetails.length ; i++){
    if(Number(this.AddProDetails[i].Batch_Qty) <  Number(this.AddProDetails[i].Delivery_Qty)){
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
    else if(Number(this.AddProDetails[i].Req_Qty) <  Number(this.AddProDetails[i].Delivery_Qty)){
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
         this.AddProDetails.forEach(el=>{
          // if(el.Delivery_Qty){      //&& Number(el.Delivery_Qty) !== 0
            const saveObj = {
              Doc_No: el.Doc_No,
              Product_ID: el.Product_ID,
              Batch_No: el.Batch_No,
              Qty: el.Qty,
              Accepted_Qty: el.Delivery_Qty,
              UOM: el.UOM,
              // Req_No: this.SelectedIndent,
              Created_By: this.$CompacctAPI.CompacctCookies.User_ID
            }
            this.saveData.push({...saveObj,...this.objRMissue})
          // }
        })
         //console.log("Save Data",saveData);
         const obj = {
          "SP_String": "SP_MICL_Raw_Material_Issue_New",
          "Report_Name_String": "Create_MICL_Raw_Material_Consumables_Issue",
          "Json_Param_String": JSON.stringify(this.saveData)
    
        }
        this.GlobalAPI.getData(obj).subscribe(async (data:any)=>{
          //console.log("After Data",data)
          this.docno = data[0].Column1;
          if(data[0].Column1){
          //  var mgs = this.buttonname === "Save" ? "Save" : "Update"
             this.ngxService.stop();
             this.compacctToast.clear();
              this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",//"Requisition No: " +data[0].Column1,
              detail: "Succesfully Save" 
            });
           
            // this.SaveNPrintBill();
            // this.Print(data[0].Column1)
             this.clearData();
             this.ReqNoList = [];
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
class productAdd {
  Product_Name : string;
  Batch_No : string;
  Batch_Qty : any;
  Qty : any;
  UOM :  any;
  Product_ID : any;
  Product_Description : string;
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
