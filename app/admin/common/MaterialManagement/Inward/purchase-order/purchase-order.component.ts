import { Component, OnInit, ViewEncapsulation, ViewChild, SimpleChanges } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms'; 
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { identity } from 'rxjs';
import { CompacctProjectComponent } from '../../../../shared/compacct.components/compacct.forms/compacct-project/compacct-project.component';
import { timeStamp } from 'console';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class PurchaseOrderComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  seachSpinner = false;
  items:any = [];
  menuList = [];
  purchaseFormSubmitted = false;
  SubLedgerList = [];
  SubLedgerDataList = [];
  costCenterList = [];
  DetalisView = false;
  viewHeader = "";
  DetalisObj:any = {};
  DocDate = new Date();
  RefDate = new Date();
  currencyList = [];
  projectList = [];
  OrderTypeList = [];
  productList = [];
  productDataList = [];
  purChaseAddFormSubmit = false;
  ExpectedDeliverydate = new Date;
  objpurchase : purchase = new purchase();
  objproject : project = new project();
  ObjBrowse : Browse = new Browse();
  objpendingreq :pendingreq = new pendingreq()
  addPurchaseList = [];
  AcceptanceOrderList = [];
  rate = undefined;
  totalRate = undefined;
  totalbackUp = undefined;
  totalAmtBackUp = undefined;
  DocNo = undefined;
  getAllDataList = [];
  DynamicHeader:any = [];
  pendingREQDataDynamicHeader:any = [];
  companyList = [];
  disable = true;
  DiscountTypeList = [{Dtype : '%'},{Dtype : "AMT"}]
  grTotal:any = 0
  disTotal:any = 0
  ExciTotal:any = 0
  taxAblTotal:any = 0
  GSTTotal:any = 0
  NetTotal:any = 0;
  disAmtBackUpAMT:number = 0
  disAmtBackUpPer:number = 0
  objaddPurchacse : addPurchacse = new addPurchacse();
  openProject = "N"
  projectMand = "N";
  objSize = undefined;
  falg = false;
  Aolist= [];
  userType = "";
  Requlist:any = [];
  objProjectRequi:any = {};
  productTypeList = [];
  projectDisable = false
  headerText:string
  initDate:any = [];
  validatation = {
    required : false,
    projectMand : 'N'
  }
  projectEditData =[]
  seachPendingReqSpinner = false;
  @ViewChild("project", { static: false })
  ProjectInput: CompacctProjectComponent;
  BackupSearchedlist = [];
  DistSubledgerName = [];
  SelectedDistSubledgerName = [];
  DistCostCentreName = [];
  SelectedDistCentreName = [];
  SearchFields = [];
  RequistionPendingFormSubmit = false
  SearchFormSubmitted = false;
  costcenterListPeding = [];
  pendingREQData:any = [];
  productDetalisView:boolean = false;
  productDetalisViewList:any = false;
  productDetalisViewListHeader:any = false;
  deleteError:boolean = false;
  Save = false;
  Del = false;

  objpendingPurIndPro :pendingpurindpro = new pendingpurindpro()
  pendingPurIndProFormSubmit = false;
  seachPendingPurIndProSpinner = false;
  pendingPurIndProData:any = [];
  pendingPurIndProDataDynamicHeader:any = [];
  col: any;
  pendingPurIndProViewList:any = [];
  ViewListForPendIndQty = false;
  cols:any =[]
  pendPurInProViewListDynamic:any = [];
  termsdetails:any = [];

  objupdateterm :updateterm = new updateterm();
  TermSpinner = false;

  constructor(private $http: HttpClient ,
    private commonApi: CompacctCommonApi,   
    private Header: CompacctHeader ,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private fb: FormBuilder,
    private ngxService: NgxUiLoaderService,
    ) {
      this.route.queryParams.subscribe(params => {
        console.log(params);
        this.openProject = params['proj'];
        this.projectMand = params['mand'];
        this.validatation.projectMand = params['mand']
        this.headerText = params['Caption']
       })
     }

  ngOnInit() {
    $(document).prop('title', this.headerText ? this.headerText : $('title').text());
    this.items = [ 'BROWSE', 'CREATE','PENDING PURCHASE INDENT','PENDING PURCHASE INDENT PRODUCT','UPDATE TERMS'];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];  
      this.Header.pushHeader({
        'Header' : this.headerText,
        'Link' : this.headerText
      });
      this.objpurchase.Credit_Days = 0;
      this.getsubLedger();
      this.GetCostCenter();
      this.GetCurrency();
      this.GetOrderType();
      this.GetProject();
     // this.getProduct();
      this.getAllData(true);
      this.getcompany();
      this.GetRequlist();
      this.getCostcenter();
     this.userType = this.$CompacctAPI.CompacctCookies.User_Type
     console.log("proj",this.openProject);
     if(this.openProject !== "Y"){
       this.getProductType()
       this.GetRequlist()
     }
  } 
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = [ 'BROWSE', 'CREATE','PENDING PURCHASE INDENT','PENDING PURCHASE INDENT PRODUCT','UPDATE TERMS'];
    this.buttonname = "Create";
    this.clearData();
    this.clearProject()
    this.GetCostCenter();
    // this.gettermsdetails();
  }
  clearData(){
    this.gettermsdetails();
    this.viewHeader = "";
    this.DetalisObj = {};
    this.objpurchase = new purchase();
    this.objaddPurchacse = new addPurchacse();
    this.objproject = new project()
    this.Spinner = false;
    this.purChaseAddFormSubmit = false;
    this.purchaseFormSubmitted = false;
    this.validatation.required = false;
    this.addPurchaseList = []; 
    this.rate = undefined;
    this.totalRate = undefined;
    this.totalbackUp = undefined;
    this.totalAmtBackUp = undefined;
    this.DocNo = undefined;
    this.ExpectedDeliverydate = new Date;
    this.DocDate = new Date();
    this.RefDate = new Date();
    this.disable = false
    this.grTotal = 0;
    this.taxAblTotal = 0;
    this.disTotal = 0;
    this.ExciTotal = 0;
    this.GSTTotal  = 0;
    this.NetTotal  = 0;
    this.disAmtBackUpAMT = 0
    this.objpurchase.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    this.ObjBrowse.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    this.objpendingreq.Cost_Cen_ID = this.costcenterListPeding.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
    this.objpendingPurIndPro.Cost_Cen_ID = this.costcenterListPeding.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
    this.objpurchase.Billing_To  = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.objpurchase.Cost_Cen_ID  = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.getreq();
    this.objpurchase.Credit_Days = 0;
    this.objpurchase.Currency_ID = 1;
    this.objpurchase.Type_ID = 1;
    this.seachPendingReqSpinner = false;
    this.initDate = [new Date(),new Date()];
    
    if(this.openProject === "Y"){
      this.Requlist = [];
      this.productTypeList = []; 
    }
    this.productList = [];
    this.RequistionPendingFormSubmit =false;
    this.productDetalisView = false;
    this.productDetalisViewList = [];
   }
  onReject() {
    this.compacctToast.clear("c");
    this.Spinner = false;
    this.ngxService.stop();
    this.deleteError = false;
  }
  onConfirmDel(){
   if(this.DocNo){
    const obj = {
      "SP_String": "Sp_Purchase_Order",
      "Report_Name_String":"Purchase_Order_Delete",
      "Json_Param_String": JSON.stringify([{Doc_No : this.DocNo,User_ID : this.$CompacctAPI.CompacctCookies.User_ID}]) 
      }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("data ==",data[0].Column1);
      if (data[0].Column1 === "Done"){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Purchase Order Delete Succesfully",
          detail: "Succesfully Delete"
        });
        }
        else {
          this.onReject();
          this.deleteError = true;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "c",
            sticky: true,
            closable: false,
            severity: "warn", // "info",
            summary: data[0].Column1
            // detail: data[0].Column1
          });
         this.DocNo = undefined;
         
        }
        this.getAllData(true);
       });
   }
  }
  getsubLedger(){
    this.SubLedgerList = [];
      const obj = {
        "SP_String": "sp_Comm_Controller",
        "Report_Name_String": "Get_Sub_Ledger_Dropdown",
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log(data);
        this.SubLedgerDataList = data;
       
        console.log("SubLedgerDataList",this.SubLedgerDataList);
        this.SubLedgerDataList.forEach(el => {
          this.SubLedgerList.push({
              label: el.Sub_Ledger_Name,
              value: el.Sub_Ledger_ID
            });
           });
        })
    }
  GetCostCenter(){
  const obj = {
    "SP_String": "sp_Comm_Controller",
    "Report_Name_String": "Get_Cost_Center_Details_Dropdown",
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.costCenterList = data;
      this.objpurchase.Cost_Cen_ID  = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      if(this.objpurchase.Cost_Cen_ID){
        this.getCostCenterDetalis();
      }

      console.log("Cost Center",this.costCenterList);
      console.log("compacct Cookies",this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
  })
  }
  getCostCenterDetalis(){
    if(this.objpurchase.Cost_Cen_ID){
      this.DetalisObj = {};
      this.getreq();
       const tempVal = this.costCenterList.filter(el=> Number(el.Cost_Cen_ID) === Number(this.objpurchase.Cost_Cen_ID))
       this.DetalisObj = tempVal[0]
      console.log("DetalisObj",this.DetalisObj);
    }
  }
  getSubLedgerDetalis(){
    if(this.objpurchase.Sub_Ledger_ID){
      this.DetalisObj = {};
      const tempVal = this.SubLedgerDataList.filter(el=> Number(el.Sub_Ledger_ID) === Number(this.objpurchase.Sub_Ledger_ID))
       this.DetalisObj = tempVal[0]
      console.log("DetalisObj",this.DetalisObj);
    }
  }
  getDetalis(header){
     if(this.DetalisObj && (this.objpurchase.Sub_Ledger_ID || this.objpurchase.Cost_Cen_ID)){
       this.DetalisView = true
       this.viewHeader = header === "Vendor" ? "Vendor Detalis" : "Deliver Detalis";
       if(header === "Vendor"){
         this.getSubLedgerDetalis();
       }
       else {
         this.getCostCenterDetalis();
       }
     }
  }
  GetCurrency(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Currency_Dropdown",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.currencyList = data;
        this.objpurchase.Currency_ID = 1;
      console.log("currencyList",this.currencyList);
    })
  }
  GetOrderType(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Order_Type_Dropdown",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.OrderTypeList = data;
        this.objpurchase.Type_ID = 1;
      console.log("OrderTypeList",this.OrderTypeList);
    })
  }
  GetProject(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Master_Project_Detail_Dropdown",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.projectList = data;
      console.log("projectList",this.projectList);
    })
  }
  getProduct(){
  
    if(this.objaddPurchacse.Req_No){
      this.objaddPurchacse.Product_Type_ID = undefined;
      this.productDataList = [];
      this.productList = [];
      this.objaddPurchacse.Product_ID = undefined;
      this.objaddPurchacse.Product_Spec = undefined;
      this.objaddPurchacse.Unit = undefined
      let tempData:any = {}
      tempData = this.objaddPurchacse.Req_No ? {Req_No : this.objaddPurchacse.Req_No} : {Product_Type_ID : this.objaddPurchacse.Product_Type_ID}
      const obj = {
        "SP_String": "Sp_Purchase_Order",
        "Report_Name_String": "Get_Product_Against_Requisition_No",
        "Json_Param_String": Object.keys(this.objProjectRequi).length ? JSON.stringify([{...this.objProjectRequi,...{Req_No : this.objaddPurchacse.Req_No}}]) : JSON.stringify([{Req_No : this.objaddPurchacse.Req_No}])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log(data);
        this.productDataList = data;
       
        console.log("productDataList",this.productDataList);
        this.productDataList.forEach((el:any) => {
          this.productList.push({
              label: el.Product_Description,
              value: el.Product_ID
            });
           });
        })
    }
    else {
      this.productDataList = [];
      this.productList = [];
      let tempObj = {...this.objaddPurchacse}
      this.objaddPurchacse = new addPurchacse()
      this.objaddPurchacse.Req_No = tempObj.Req_No
    }
 
    }
  GetProductSpecification(){
   if(this.objaddPurchacse.Product_ID){
    let tempVal:any = this.productDataList.filter((el:any)=> Number(el.Product_ID) === Number(this.objaddPurchacse.Product_ID));
    this.objaddPurchacse.Product_Spec = tempVal[0].Product_Description;
    this.objaddPurchacse.Qty = tempVal[0].Qty
    if(this.openProject === 'Y'){
      this.objaddPurchacse.Rate = tempVal[0].Rate;
    }
    this.getProductDetalis()
   }
   else {
    this.objaddPurchacse.Unit = undefined;
    this.objaddPurchacse.Product_Spec = undefined;
    
   } 
  }
  
  getAo(ProductID){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Product_Wise_Ao",
      "Json_Param_String": JSON.stringify([{ProductID : Number(ProductID)}])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Aolist",this.Aolist);
       this.Aolist = data
    })
  }
  getProductDetalis(){
     if(this.objaddPurchacse.Product_ID){
        let tempVal = this.productDataList.filter(el=> Number(el.Product_ID) === Number(this.objaddPurchacse.Product_ID))
         this.objaddPurchacse.Unit = tempVal[0].UOM
         console.log("tempVal",tempVal);
         this.GetTaxDetalis(this.objaddPurchacse.Product_ID);
         if(this.objaddPurchacse.Rate){
          this.getGrsAmt();
         }
         else{
          if(tempVal[0].Rate_Form_Quote === 'Y'){
            this.disable = true;
              this.GetRateY()
            }
            else {
             this.disable = false
             this.getRateN(this.objaddPurchacse.Product_ID);
            }
         }
       
        
       }
      else{
        this.objaddPurchacse.Unit = undefined;
        this.objaddPurchacse.Product_Spec = undefined;
      }
    
   
  }
  changeQTY(){
      this.objaddPurchacse.Rate = undefined;
      this.objaddPurchacse.Gross_Amt = undefined;
      this.objaddPurchacse.Excise_Tax_Percentage = undefined;
      this.objaddPurchacse.Excise_Tax = undefined;
      this.objaddPurchacse.Discount_Type = undefined;
      this.objaddPurchacse.Discount = undefined;
      this.objaddPurchacse.Discount_AMT = undefined;
      this.objaddPurchacse.taxable_AMT = undefined;
      this.objaddPurchacse.Gst = undefined;
      this.objaddPurchacse.GST_AMT = undefined;
      this.objaddPurchacse.Total_Amount = undefined;
      this.objaddPurchacse.Unit = undefined;
  }
  GetRateY(){
    if(this.objpurchase.Sub_Ledger_ID && this.objaddPurchacse.Product_ID){
      let sendData = {
            Sub_Ledger_ID: Number(this.objpurchase.Sub_Ledger_ID),
						ProductID:Number(this.objaddPurchacse.Product_ID),
						Qty:Number(this.objaddPurchacse.Qty),
						Dated: this.DateService.dateConvert(new Date(this.DocDate))
      }
      const obj = {
        "SP_String": "sp_Comm_Controller",
        "Report_Name_String": "Dropdown_Rate_Form_Quote",
        "Json_Param_String": JSON.stringify(sendData)
        }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Rate){
          this.rate = data[0].Rate;
          this.objaddPurchacse.Rate = this.rate ? this.rate : 0
          this.getGrsAmt();
        }
         
       })
    }
  }

  getRateN(id){
    this.rate = undefined
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Previous_PO_Rate",
      "Json_Param_String": JSON.stringify([{ProductID : Number(id)}])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if( data[0].Rate){
        this.rate = data[0].Rate
        this.objaddPurchacse.Rate = this.rate ? this.rate : 0
        this.getGrsAmt();
      }
        
     })
  }
  GetTaxDetalis(ProductID){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Dropdown_Tax",
      "Json_Param_String": JSON.stringify([{ProductID : Number(ProductID)}])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.objaddPurchacse.Tax_Desc = data[0].Cat_Name;
        this.objaddPurchacse.Gst =  data[0].GST_Tax_Per;
        this.getGrsAmt();
       // this.getTotalForTax();
     })
  }
  getGrsAmt(){
    if(this.rate || this.objaddPurchacse.Rate){
      this.objaddPurchacse.Qty = this.objaddPurchacse.Qty ? this.objaddPurchacse.Qty : 0
      if(this.objaddPurchacse.Qty){
        this.rate = this.objaddPurchacse.Rate
        this.objaddPurchacse.Rate = undefined;
        this.objaddPurchacse.Gross_Amt = undefined;
        this.objaddPurchacse.taxable_AMT = undefined;
        this.objaddPurchacse.Rate = this.rate;
        this.objaddPurchacse.Gross_Amt = (Number(this.objaddPurchacse.Qty) * Number(this.objaddPurchacse.Rate)).toFixed(2)
        this.objaddPurchacse.taxable_AMT = (Number(this.objaddPurchacse.Qty) * Number(this.objaddPurchacse.Rate)).toFixed(2)
        this.totalRate = this.objaddPurchacse.taxable_AMT;
        if(this.objaddPurchacse.taxable_AMT){
          this.GetGSTAmt();
        }
       
      }
      else {
        this.objaddPurchacse.Rate = this.objaddPurchacse.Rate ? this.objaddPurchacse.Rate : undefined;
        this.objaddPurchacse.Gross_Amt = undefined;
        this.objaddPurchacse.taxable_AMT = undefined;
        this.GetGSTAmt();
      }
    }
   
  }
  getExciseAmt(){
    if(this.objaddPurchacse.Excise_Tax_Percentage){
      this.objaddPurchacse.Excise_Tax = undefined;
      this.objaddPurchacse.taxable_AMT = undefined;
      this.objaddPurchacse.Excise_Tax = (Number(this.objaddPurchacse.Gross_Amt) * (Number(this.objaddPurchacse.Excise_Tax_Percentage) / 100)).toFixed(2)
      this.objaddPurchacse.taxable_AMT = Number(this.totalRate) + Number(this.objaddPurchacse.Excise_Tax)
      this.totalbackUp = this.objaddPurchacse.taxable_AMT;
      this.getDis();
      this.GetGSTAmt();
    }
    else {
      this.objaddPurchacse.Excise_Tax = undefined;
      this.objaddPurchacse.taxable_AMT = this.totalRate;
      this.GetGSTAmt();
    }
  }
  getTotalForTax(){
    if(this.objaddPurchacse.Tax_Rate){
      this.objaddPurchacse.taxable_AMT = undefined;
      const totalAmt = this.totalbackUp ? this.totalbackUp : this.totalRate
      this.objaddPurchacse.taxable_AMT = ((Number(totalAmt) * (Number(this.objaddPurchacse.Tax_Rate) / 100)) + totalAmt).toFixed(2)
      this.totalAmtBackUp =  this.objaddPurchacse.taxable_AMT
    }
    else {
      this.objaddPurchacse.taxable_AMT = this.totalbackUp ? Number((this.totalbackUp).toFixed(2)) : Number((this.totalRate).toFixed(2))
    }
  }
  DisClear(){
    if(!this.objaddPurchacse.Discount_Type){
      this.objaddPurchacse.taxable_AMT = (Number(this.objaddPurchacse.taxable_AMT) + (Number(this.objaddPurchacse.Discount_AMT) ? Number(this.objaddPurchacse.Discount_AMT) : 0)).toFixed(2)
      this.objaddPurchacse.Discount_AMT = undefined;
      this.objaddPurchacse.Discount = undefined;
      this.GetGSTAmt();
     }
    else {
      this.objaddPurchacse.Discount_AMT = undefined;
      this.objaddPurchacse.Discount = undefined;
      this.objaddPurchacse.taxable_AMT = this.totalbackUp ? this.totalbackUp : this.totalRate;
      this.GetGSTAmt();
     
    }
  }
  getDis(){
    if(this.objaddPurchacse.Discount_Type === 'AMT'){
        this.objaddPurchacse.Discount_AMT = undefined;
        //const tempTotal = this.totalAmtBackUp ? this.totalAmtBackUp : this.totalbackUp ? this.totalbackUp : this.totalRate
        let taxacl:number =  this.objaddPurchacse.taxable_AMT
        this.objaddPurchacse.taxable_AMT = undefined
        this.objaddPurchacse.Discount_AMT = this.objaddPurchacse.Discount;
        //  if(this.disAmtBackUpAMT > this.objaddPurchacse.Discount_AMT){
        //   taxacl = Number(this.disAmtBackUpAMT) + Number(taxacl)
        //  }
        //  this.disAmtBackUpAMT = 0
        //  this.disAmtBackUpAMT = this.objaddPurchacse.Discount_AMT ? Number(this.objaddPurchacse.Discount_AMT) : 0;
        if(this.objaddPurchacse.Discount_AMT){
          this.objaddPurchacse.taxable_AMT  = (Number(taxacl) - Number(this.objaddPurchacse.Discount_AMT)).toFixed(2);
          this.GetGSTAmt();
        }
        else {
          this.objaddPurchacse.taxable_AMT = this.totalbackUp ? this.totalbackUp : this.totalRate;
          this.GetGSTAmt();
        }
         
        }
      else if(this.objaddPurchacse.Discount_Type === '%'){
        this.objaddPurchacse.Discount_AMT = undefined;
        let taxacl:number =  this.objaddPurchacse.taxable_AMT
        this.objaddPurchacse.taxable_AMT = undefined
        let tempExiAmt = this.objaddPurchacse.Excise_Tax ? Number(this.objaddPurchacse.Excise_Tax) : 0 
        let tempGrsAmt = this.objaddPurchacse.Gross_Amt ? Number(this.objaddPurchacse.Gross_Amt) : 0 
        let totalAmt = (Number(tempExiAmt) + Number(tempGrsAmt))
        
       this.objaddPurchacse.Discount_AMT = (Number(totalAmt) * Number(this.objaddPurchacse.Discount)/100).toFixed(2);
       
       if(this.objaddPurchacse.Discount_AMT){
        this.objaddPurchacse.taxable_AMT  = (Number(totalAmt) - Number(this.objaddPurchacse.Discount_AMT)).toFixed(2);
        this.GetGSTAmt();
      }
      else {
        this.objaddPurchacse.taxable_AMT = this.totalbackUp ? this.totalbackUp : this.totalRate;
        this.GetGSTAmt();
      }
        // this.objaddPurchacse.taxable_AMT = (Number(this.objaddPurchacse.taxable_AMT) - Number(this.objaddPurchacse.Discount_AMT)).toFixed(2);
        // this.getTaxAble()
      }
     else {
      this.objaddPurchacse.Discount_AMT = undefined;
      this.objaddPurchacse.Total_Amount = undefined;
      this.objaddPurchacse.GST_AMT = undefined
      this.objaddPurchacse.taxable_AMT = this.totalbackUp ? this.totalbackUp : this.totalRate;
      this.GetGSTAmt();
    }
  }
  getTaxAble(){
 
  }
  AddPurchase(valid){
    this.purChaseAddFormSubmit = true
    console.log("valid",valid);
   if(valid){
     const productFilter:any = this.productDataList.filter((el:any)=> Number(el.Product_ID) === Number(this.objaddPurchacse.Product_ID))
     console.log("productFilter",productFilter[0])
     let saveData = {
        Product_ID: Number(this.objaddPurchacse.Product_ID),
        Req_No: this.objaddPurchacse.Req_No ? this.objaddPurchacse.Req_No : "NA",
        Product_Name:  productFilter[0].Product_Description,
        Product_Spec: this.objaddPurchacse.Product_Spec,
        Exp_Delivery: this.DateService.dateConvert(new Date(this.ExpectedDeliverydate)),
        Qty: Number(this.objaddPurchacse.Qty),
        Rate: Number(this.objaddPurchacse.Rate),
        Gross_Amt	: Number(this.objaddPurchacse.Gross_Amt),
        Excise_Tax_Percentage: Number(this.objaddPurchacse.Excise_Tax_Percentage),
        Excise_Amount: Number(this.objaddPurchacse.Excise_Tax),
        Taxable_Amount:  Number(this.objaddPurchacse.taxable_AMT),
        Discount_Type:  this.objaddPurchacse.Discount_Type,
        Discount:  this.objaddPurchacse.Discount,
        Discount_Amount: Number(this.objaddPurchacse.Discount_AMT),
        UOM: this.objaddPurchacse.Unit,
        Net_Amount:  Number(this.objaddPurchacse.Total_Amount),
        GST_Percentage: Number( this.objaddPurchacse.Gst),
        GST_Amount: Number(this.objaddPurchacse.GST_AMT),
     }
      this.addPurchaseList.push(saveData);
      this.projectDisable = true
      this.objaddPurchacse = new addPurchacse();
      this.purChaseAddFormSubmit = false;
      this.productList = [];
      console.log("addPurchaseList",this.addPurchaseList);
      this.getAllTotal();
   }
 }
 async savePurchase(valid){
   this.purchaseFormSubmitted = true
   this.validatation.required = true
    this.falg = true
    // this.ngxService.start();
    this.Save = false;
    this.Del = false;
   if(valid && this.checkreq()){
    this.Save = true;
    this.Del = false;
    this.Spinner = true;
    this.ngxService.start();
   this.compacctToast.clear();
   this.compacctToast.add({
     key: "c",
     sticky: true,
     closable: false,
     severity: "warn",
     summary: "Are you sure?",
     detail: "Confirm to proceed"
   });
  //    this.Spinner = true
  //    let msg = "";
  //     let rept = ""
  //   const tempCost = this.costCenterList.filter(el=> Number(el.Cost_Cen_ID) === Number(this.objpurchase.Cost_Cen_ID))[0]
  //   const tempsub = this.SubLedgerDataList.filter(el=> Number(el.Sub_Ledger_ID) === Number(this.objpurchase.Sub_Ledger_ID))[0]
  //   const tempCurr = this.currencyList.filter(el=> Number(el.Currency_ID) === Number(this.objpurchase.Currency_ID))
  //   this.objpurchase.Doc_Date = this.DateService.dateConvert(new Date(this.DocDate));
  //   this.objpurchase.Supp_Ref_Date = this.DateService.dateConvert(new Date(this.RefDate));
  //   this.objpurchase.Currency_Symbol = tempCurr[0].Currency_Symbol;
  //   this.objpurchase.Project_ID = Number(this.objpurchase.Project_ID) ? Number(this.objpurchase.Project_ID) : null
  //   this.objpurchase.Currency_ID = this.objpurchase.Currency_ID ? Number(this.objpurchase.Currency_ID) : null
  //   this.objpurchase.Company_ID = this.objpurchase.Company_ID ? Number(this.objpurchase.Company_ID) : undefined
  //   this.objpurchase.User_ID  = this.$CompacctAPI.CompacctCookies.User_ID
  //    let save = []
  //    if(this.addPurchaseList.length){
  //    if(this.DocNo){
  //     msg = "Update"
  //     rept = "Purchase_Order_Edit"
  //      this.objpurchase.Doc_No = this.DocNo;
  //     this.objpurchase.L_element = this.addPurchaseList
  //     save = {...tempCost,...tempsub,...this.objpurchase}
  //    }
  //    else {
  //     msg = "Create"
  //     rept = "Purchase_Order_Create"
  //     this.objpurchase.L_element = this.addPurchaseList
  //     save = {...tempCost,...tempsub,...this.objpurchase}
  //    }
  //    const obj = {
  //     "SP_String": "Sp_Purchase_Order",
  //     "Report_Name_String": rept,
  //     "Json_Param_String": JSON.stringify(save)
  
  //   }
  //   this.GlobalAPI.getData(obj).subscribe(async (data:any)=>{
  //     this.validatation.required = false;
  //     if(data[0].Column1){
  //       if(this.objproject.PROJECT_ID && !this.DocNo){ 
  //         const projectSaveData = await this.SaveProject(data[0].Column1);
  //         if(projectSaveData){
  //           this.showTost(msg,"Purchase order")
  //           this.Spinner = false;
  //           this.getAllData(true);
  //           this.getPendingReq(true);
  //         }
  //         else {
  //           this.Spinner = false;
  //           this.compacctToast.clear();
  //           this.compacctToast.add({
  //             key: "compacct-toast",
  //             severity: "error",
  //             summary: "Warn Message",
  //             detail: "Error Occured "
  //           });
  //         }
  //        }
  //       else{
  //         this.Spinner = false;
  //         this.showTost(msg,"Purchase order")
  //         this.getAllData(true);
  //         this.getPendingReq(true);
  //       }
      
  //     if(this.DocNo){
  //       this.tabIndexToView = 0;
  //       this.items = [ 'BROWSE', 'CREATE','PENDING PURCHASE INDENT'];
  //       this.buttonname = "Create";
  //     }
  //     this.clearData();
  //     this.getAllData(true);
  //     this.getPendingReq(true);
  //     this.Print(data[0].Column1)
  //     this.clearProject()
  //     }
  //     else {
  //       this.Spinner = false;
  //       this.compacctToast.clear();
  //       this.compacctToast.add({
  //         key: "compacct-toast",
  //         severity: "error",
  //         summary: "Warn Message",
  //         detail: "Error Occured "
  //       });
  //     }
  //   })
  // }
  // else {
  //   this.Spinner = false;
  //   this.compacctToast.clear();
  //   this.compacctToast.add({
  //     key: "compacct-toast",
  //     severity: "error",
  //     summary: "Warn Message",
  //     detail: "Error Occured "
  //   });
  // }
   }
   else {

   }
 }
 onConfirmSave(){
 this.Spinner = true
 let msg = "";
  let rept = ""
const tempCost = this.costCenterList.filter(el=> Number(el.Cost_Cen_ID) === Number(this.objpurchase.Cost_Cen_ID))[0]
const tempsub = this.SubLedgerDataList.filter(el=> Number(el.Sub_Ledger_ID) === Number(this.objpurchase.Sub_Ledger_ID))[0]
const tempCurr = this.currencyList.filter(el=> Number(el.Currency_ID) === Number(this.objpurchase.Currency_ID))
this.objpurchase.Doc_Date = this.DateService.dateConvert(new Date(this.DocDate));
this.objpurchase.Supp_Ref_Date = this.DateService.dateConvert(new Date(this.RefDate));
this.objpurchase.Currency_Symbol = tempCurr[0].Currency_Symbol;
this.objpurchase.Project_ID = Number(this.objpurchase.Project_ID) ? Number(this.objpurchase.Project_ID) : null
this.objpurchase.Currency_ID = this.objpurchase.Currency_ID ? Number(this.objpurchase.Currency_ID) : null
this.objpurchase.Company_ID = this.objpurchase.Company_ID ? Number(this.objpurchase.Company_ID) : undefined
this.objpurchase.User_ID  = this.$CompacctAPI.CompacctCookies.User_ID
 let save = []
 if(this.addPurchaseList.length){
 if(this.DocNo){
  msg = "Update"
  rept = "Purchase_Order_Edit"
   this.objpurchase.Doc_No = this.DocNo;
  this.objpurchase.L_element = this.addPurchaseList
  save = {...tempCost,...tempsub,...this.objpurchase}
 }
 else {
  msg = "Create"
  rept = "Purchase_Order_Create"
  this.objpurchase.L_element = this.addPurchaseList
  save = {...tempCost,...tempsub,...this.objpurchase}
 }
 const obj = {
  "SP_String": "Sp_Purchase_Order",
  "Report_Name_String": rept,
  "Json_Param_String": JSON.stringify(save)

}
this.GlobalAPI.getData(obj).subscribe(async (data:any)=>{
  this.validatation.required = false;
  if(data[0].Column1){
    if(this.objproject.PROJECT_ID && !this.DocNo){ 
      const projectSaveData = await this.SaveProject(data[0].Column1);
      if(projectSaveData){
        this.showTost(msg,"Purchase order")
        this.Spinner = false;
        this.getAllData(true);
        this.getPendingReq(true);
        this.ngxService.stop();
      }
      else {
        this.ngxService.stop();
        this.Spinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
     }
    else{
      this.ngxService.stop();
      this.Spinner = false;
      this.showTost(msg,"Purchase order")
      this.getAllData(true);
      this.getPendingReq(true);
    }
  
  if(this.DocNo){
    this.ngxService.stop();
    this.tabIndexToView = 0;
    this.items = [ 'BROWSE', 'CREATE','PENDING PURCHASE INDENT'];
    this.buttonname = "Create";
  }
  this.ngxService.stop();
  this.clearData();
  this.getAllData(true);
  this.getPendingReq(true);
  this.Print(data[0].Column1)
  this.clearProject()
  }
  else {
    this.ngxService.stop();
    this.Spinner = false;
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
else {
this.ngxService.stop();
this.Spinner = false;
this.compacctToast.clear();
this.compacctToast.add({
  key: "compacct-toast",
  severity: "error",
  summary: "Warn Message",
  detail: "Error Occured "
});
}
}

//  checkreq(){
//   let flg = false
//   if(this.openProject === "Y" && this.projectMand === "Y"){
//     let getArrValue = Object.values(this.objProjectRequi);
//     console.log("getArrValue",getArrValue.length);
//     if(getArrValue.length === 5 || getArrValue.length > 5){
//       flg = true
//     }
//     else {
//       flg = false
//     }
//   }
//   else {
//     flg = true
//   }
//   return flg
//  }
 checkreq(){
  let flg = false
  if(this.openProject === "Y" && this.projectMand === "Y"){
    let getArrValue = Object.values(this.objProjectRequi);
    console.log("getArrValue",getArrValue.length);
    if(getArrValue.indexOf(undefined) == -1){
      if(getArrValue.length === 5 || getArrValue.length > 5){
        flg = true
      }
      else {
        flg = false
      }
    }
    else {
      flg = false
    }
  }
  else {
    flg = true
  }
  return flg
 }
 getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjBrowse.start_date = dateRangeObj[0];
    this.ObjBrowse.end_date = dateRangeObj[1];
  }
  }
 getAllData(valid){
  this.SearchFormSubmitted = true;
  const start = this.ObjBrowse.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
  : this.DateService.dateConvert(new Date());
const tempobj = {
  From_Date : start,
  To_Date : end,
  Company_ID : this.ObjBrowse.Company_ID,
  proj : this.openProject ? this.openProject : "N",
  // User_ID: this.$CompacctAPI.CompacctCookies.User_ID
}
if (valid) {
  const obj = {
    "SP_String": "Sp_Purchase_Order",
    "Report_Name_String": "Purchase_Order_Browse",
    "Json_Param_String": JSON.stringify([tempobj])
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.getAllDataList = data;
    this.BackupSearchedlist = data;
    this.GetDistinct();
    if(this.getAllDataList.length){
      this.DynamicHeader = Object.keys(data[0]);
    }
    this.seachSpinner = false;
    this.SearchFormSubmitted = false;
    console.log("Get All Data",this.getAllDataList);
  })
}
 }
 // DISTINCT & FILTER
 GetDistinct() {
  let DSubledgerName = [];
  let DCostCentreName = [];
  this.DistSubledgerName =[];
  this.SelectedDistSubledgerName =[];
  this.DistCostCentreName =[];
  this.SelectedDistCentreName =[];
  this.SearchFields =[];
  this.getAllDataList.forEach((item) => {
 if (DSubledgerName.indexOf(item.Sub_Ledger_Name) === -1) {
  DSubledgerName.push(item.Sub_Ledger_Name);
 this.DistSubledgerName.push({ label: item.Sub_Ledger_Name, value: item.Sub_Ledger_Name });
 }
if (DCostCentreName.indexOf(item.Cost_Cen_Name) === -1) {
  DCostCentreName.push(item.Cost_Cen_Name);
  this.DistCostCentreName.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
  }
});
   this.BackupSearchedlist = [...this.getAllDataList];
}
FilterDist() {
  let DSubledgerName = [];
  let DCostCentreName = [];
  this.SearchFields =[];
if (this.SelectedDistSubledgerName.length) {
  this.SearchFields.push('Sub_Ledger_Name');
  DSubledgerName = this.SelectedDistSubledgerName;
}
if (this.SelectedDistCentreName.length) {
  this.SearchFields.push('Cost_Cen_Name');
  DCostCentreName = this.SelectedDistCentreName;
}
this.getAllDataList = [];
if (this.SearchFields.length) {
  let LeadArr = this.BackupSearchedlist.filter(function (e) {
    return (DSubledgerName.length ? DSubledgerName.includes(e['Sub_Ledger_Name']) : true)
    && (DCostCentreName.length ? DCostCentreName.includes(e['Cost_Cen_Name']) : true)
  });
this.getAllDataList = LeadArr.length ? LeadArr : [];
} else {
this.getAllDataList = [...this.BackupSearchedlist] ;
}
}
 Edit(col){
  if(col.Doc_No){
    this.DocNo = undefined;
    this.DocNo = col.Doc_No;
    this.tabIndexToView = 1;
    this.items = [ 'BROWSE', 'CREATE','PENDING PURCHASE INDENT'];
    this.buttonname = "Update";
    this.clearProject()
    this.geteditmaster(col.Doc_No);
    if(this.openProject === "Y"){
      this.getEditProject(col.Doc_No);
    }
   
   }
 }
 geteditmaster(Dno){
  const obj = {
    "SP_String": "Sp_Purchase_Order",
    "Report_Name_String": "Purchase_Order_Get",
    "Json_Param_String": JSON.stringify([{Doc_No : Dno}])

  }
  this.GlobalAPI.getData(obj).subscribe((res:any)=>{
   
    let data = JSON.parse(res[0].Column1)
    console.log("Edit data",data);
    this.objpurchase = data[0],
    this.DocDate = new Date(data[0].Doc_Date);
    this.RefDate = new Date(data[0].Supp_Ref_Date)
    this.addPurchaseList = data[0].L_element;
    console.log("addPurchaseList",this.addPurchaseList)
    if(this.addPurchaseList.length){
      this.getAllTotal()
    }
  })
 }
 getEditProject(DocNo){
  if(DocNo){
    const obj = {
      "SP_String": "SP_BL_CRM_TXN_Project_Doc",
      "Report_Name_String": "Get_BL_CRM_TXN_Project_Doc",
      "Json_Param_String": JSON.stringify([{DOC_NO : DocNo}]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.projectEditData = data
       console.log("this.projectEditData",this.projectEditData);
       
        this.ProjectInput.ProjectEdit(this.projectEditData)
       
        })
  }
 }
 Print(DocNo) {
  if(DocNo) {
  const objtemp = {
    "SP_String": "Sp_Purchase_Order",
    "Report_Name_String": "Purchase_Order_Print"
    }
  this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
    var printlink = data[0].Column1;
    window.open(printlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  })
  }
}
PrintREQ(DocNo) {
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
 Delete(col){
  console.log("Delete Col",col);
  this.DocNo = undefined;
  this.Del = false;
  this.Save = false;
  if(col.Doc_No){
   this.Del = true;
   this.Save = false;
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
 DeleteAddPurchase(index) {
  this.addPurchaseList.splice(index,1);
  this.projectDisable = this.addPurchaseList.length ? true :false
  this.getAllTotal();
}
GetGSTAmt(){
  if(this.objaddPurchacse.taxable_AMT){
    this.objaddPurchacse.GST_AMT = (Number(this.objaddPurchacse.taxable_AMT) * (Number(this.objaddPurchacse.Gst)/100)).toFixed(2);
    this.objaddPurchacse.Total_Amount = Number(this.objaddPurchacse.GST_AMT) + Number(this.objaddPurchacse.taxable_AMT)
  }
  else {
    this.objaddPurchacse.Total_Amount = undefined;
    this.objaddPurchacse.taxable_AMT = this.totalAmtBackUp;
    this.objaddPurchacse.GST_AMT = this.objaddPurchacse.taxable_AMT && this.objaddPurchacse.Gst ?(Number(this.objaddPurchacse.taxable_AMT) * (Number(this.objaddPurchacse.Gst)/100)).toFixed(2) : undefined;
  }
}
getAllTotal(){
  this.grTotal = 0;
  this.taxAblTotal = 0;
  this.disTotal = 0;
  this.ExciTotal = 0;
  this.ExciTotal = 0;
  this.GSTTotal = 0;
  this.NetTotal = 0;
  if(this.addPurchaseList.length){
    this.addPurchaseList.forEach(ele => {
      this.grTotal += Number(ele.Gross_Amt) ? Number(ele.Gross_Amt) : 0
      this.taxAblTotal += Number(ele.Taxable_Amount) ? Number(ele.Taxable_Amount) : 0
      this.disTotal += Number(ele.Discount_Amount) ?  Number(ele.Discount_Amount) : 0
      this.ExciTotal += Number(ele.Excise_Amount) ? Number(ele.Excise_Amount) : 0
      this.GSTTotal += Number(ele.GST_Amount) ? Number(ele.GST_Amount) : 0
      this.NetTotal += Number(ele.Net_Amount) ? Number(ele.Net_Amount)  :0
    });
  }


}
getTofix(key){
 return key.toFixed(2)
}
getcompany(){
  const obj = {
    "SP_String": "sp_Comm_Controller",
    "Report_Name_String": "Dropdown_Company",
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.companyList = data
   console.log("companyList",this.companyList)
   this.objpurchase.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
   this.ObjBrowse.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
  })
}
getProjectData(e){
 console.log("Project Data",e);
 this.objproject = e
 this.objproject.Budget_Group_ID = Number(e.Budget_Group_ID)
 this.objproject.Budget_Sub_Group_ID = Number(e.Budget_Sub_Group_ID)
 this.objProjectRequi = e
 console.log("objProjectRequi",this.objProjectRequi)
 let temparr = Object.keys(this.objProjectRequi)
 console.log(temparr)
 if(temparr.indexOf("PROJECT_ID") != -1 && temparr.indexOf("Budget_Group_ID") != -1 && temparr.indexOf("Budget_Sub_Group_ID") != -1 && temparr.indexOf("SITE_ID") != -1 && temparr.indexOf("Work_Details_ID") != -1){
  this.getProductType();
  this.GetRequlist();
 }
 else{
  this.objaddPurchacse.Product_Type_ID = undefined;
  this.objaddPurchacse.Product_ID = undefined;
  this.objaddPurchacse.Product_Spec = undefined;
 }

}
clearProject(){
  if(this.openProject === "Y"){
    this.ProjectInput.clearData()
  }
 
}
async SaveProject(docNo){
 if(docNo){
  this.objproject.DOC_NO = docNo,
  this.objproject.DOC_TYPE = "PURCHASE ORDER",
  this.objproject.DOC_DATE = this.DateService.dateConvert(this.DocDate)
 }
 const obj = {
  "SP_String": "SP_BL_CRM_TXN_Project_Doc",
  "Report_Name_String": "Create_BL_CRM_TXN_Project_Doc",
  "Json_Param_String": JSON.stringify([this.objproject]) 
 }
 const projectData = await  this.GlobalAPI.getData(obj).toPromise();
 console.log("projectData",projectData);
 return projectData
}
showTost(msg,summary){
  this.compacctToast.clear();
  this.compacctToast.add({
    key: "compacct-toast",
    severity: "success",
    summary: summary,
    detail: "Succesfully "+msg
  });
}
whateverCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}
taxlabelChange(){
 let country = this.$CompacctAPI.CompacctCookies.Country;
 let labelFlg = "Tax"
 if(country === "India"){
  labelFlg = "GST"
 }
 else if(country === "Nepal"){
  labelFlg = "VAT"
 }
 else {
   console.error("country Not Found")
 }
 return labelFlg
}
getreq(){
  if(this.openProject == 'N'){
    if(this.objpurchase.Billing_To && this.objpurchase.Cost_Cen_ID){
      this.GetRequlist();
    }
    else {
      this.Requlist = []
      this.objaddPurchacse.Req_No = undefined
    }
  }
 
}
GetRequlist(){
  const obj = {
    "SP_String": "Sp_Purchase_Order",
    "Report_Name_String": "Get_Requisition_No",
    "Json_Param_String": Object.keys(this.objProjectRequi).length ? JSON.stringify([this.objProjectRequi]) : JSON.stringify([{PROJECT_ID : 0,To_Cost_Cen_ID : this.objpurchase.Billing_To,F_Cost_Cen_ID:this.objpurchase.Cost_Cen_ID}])
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("data",data)
    this.Requlist = data
  })
}

getProductType(){
  let temparr = Object.keys(this.objProjectRequi)
  const obj = {
    "SP_String": "SP_Txn_Requisition",
    "Report_Name_String": "Get_product_Type_Details",
    "Json_Param_String": Object.keys(this.objProjectRequi).length ? JSON.stringify([this.objProjectRequi]) : JSON.stringify([{PROJECT_ID : 0}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    data.forEach(el => {
      el['label'] = el.Product_Type
      el['value'] = el.Product_Type_ID
    });
     
    this.productTypeList = data;
   console.log("productTypeList",this.productTypeList);
   })
}
GetProductsDetalis(){
  if(this.objaddPurchacse.Product_Type_ID){
    this.objaddPurchacse.Req_No = undefined;
    this.productDataList = [];
    this.productList = [];
    this.objaddPurchacse.Product_ID = undefined;
    this.objaddPurchacse.Product_Spec = undefined;
    this.objaddPurchacse.Unit = undefined
    const obj = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Get_product_Details",
      "Json_Param_String": Object.keys(this.objProjectRequi).length ? JSON.stringify([{...this.objProjectRequi,...{Product_Type_ID : Number(this.objaddPurchacse.Product_Type_ID)}}]) : JSON.stringify([{Product_Type_ID : Number(this.objaddPurchacse.Product_Type_ID)}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.productDataList = data;
     console.log("productDataList",this.productDataList);
     this.productDataList.forEach((el:any) => {
      this.productList.push({
          label: el.Product_Description,
          value: el.Product_ID
        });
       });
    })
  }
  else {
    this.productDataList = [];
    this.productList = [];
    let tempObj = {...this.objaddPurchacse}
    this.objaddPurchacse = new addPurchacse()
    this.objaddPurchacse.Product_Type_ID = tempObj.Product_Type_ID
  }

}
getConfirmDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.objpendingreq.From_Date = dateRangeObj[0];
    this.objpendingreq.To_Date = dateRangeObj[1];
  }
}
getCostcenter(){
  const obj = {
     "SP_String": "SP_Txn_Requisition",
     "Report_Name_String": "Get_Cost_Center",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("costcenterList  ===",data);
    this.costcenterListPeding = data;
    this.objpendingreq.Cost_Cen_ID = this.costcenterListPeding.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
    this.objpendingPurIndPro.Cost_Cen_ID = this.costcenterListPeding.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
  })
 }
getPendingReq(valid){
  this.RequistionPendingFormSubmit = true;
  const start = this.objpendingreq.From_Date
  ? this.DateService.dateConvert(new Date(this.objpendingreq.From_Date))
  : this.DateService.dateConvert(new Date());
const end = this.objpendingreq.To_Date
  ? this.DateService.dateConvert(new Date(this.objpendingreq.To_Date))
  : this.DateService.dateConvert(new Date());
const tempobj = {
  From_Date : start,
  To_Date : end,
  To_Cost_Cen_ID : this.objpendingreq.Cost_Cen_ID,
  proj : this.openProject
}
console.log(this.objpendingreq.Cost_Cen_ID)
console.log("valid",valid)
if (valid || this.userType != 'A') {
  const obj = {
    "SP_String": "Sp_Purchase_Order",
    "Report_Name_String": "Browse_Pending_Requisition",
    "Json_Param_String": JSON.stringify([tempobj])
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.pendingREQData = data;
  if(this.pendingREQData.length){
      this.pendingREQDataDynamicHeader = Object.keys(data[0]);
    }
    this.seachPendingReqSpinner = false
    this.RequistionPendingFormSubmit = false;
    
  })
}
}
getProductPOPUPDetalis(){
 if(this.objaddPurchacse.Product_ID){
  this.productDetalisViewList = [];
  const obj = {
    "SP_String": "Sp_Purchase_Order",
    "Report_Name_String": "Last_Purchase_Details",
    "Json_Param_String": JSON.stringify([{Product_ID : Number(this.objaddPurchacse.Product_ID)}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length){
      this.productDetalisViewList = data
      this.productDetalisViewListHeader = Object.keys(data[0]);
    }
    setTimeout(() => {
      this.productDetalisView = true
    }, 300);
  })
  }
}
getDateRangePenpurIndPro(dateRangeObj) {
  if (dateRangeObj.length) {
    this.objpendingPurIndPro.From_Date = dateRangeObj[0];
    this.objpendingPurIndPro.To_Date = dateRangeObj[1];
  }
}
getPendingPurIndPro(valid){
  this.pendingPurIndProFormSubmit = true;
  const start = this.objpendingPurIndPro.From_Date
  ? this.DateService.dateConvert(new Date(this.objpendingPurIndPro.From_Date))
  : this.DateService.dateConvert(new Date());
const end = this.objpendingPurIndPro.To_Date
  ? this.DateService.dateConvert(new Date(this.objpendingPurIndPro.To_Date))
  : this.DateService.dateConvert(new Date());
const tempobj = {
  From_Date : start,
  To_Date : end,
  To_Cost_Cen_ID : this.objpendingPurIndPro.Cost_Cen_ID,
  proj : this.openProject
}
console.log(this.objpendingPurIndPro.Cost_Cen_ID)
console.log("valid",valid)
if (valid || this.userType != 'A') {
  const obj = {
    "SP_String": "Sp_Purchase_Order",
    "Report_Name_String": "Browse_Pending_Requisition_Product_wise",
    "Json_Param_String": JSON.stringify([tempobj])
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.pendingPurIndProData = data;
  if(this.pendingPurIndProData.length){
      this.pendingPurIndProDataDynamicHeader = Object.keys(data[0]);
    }
    this.seachPendingPurIndProSpinner = false
    this.pendingPurIndProFormSubmit = false;
    
  })
}
}
getdataforview(col,row){
  console.log("col",col);
    if(col === "PO_Qty") {
      this.col = col;
      // this.empid = row.Emp_ID;
      // console.log("Row",row[this.col])
      console.log("Row",row.PO_Qty)
      if (row.PO_Qty>0) {
      const tempobj = {
        Req_No : row.Req_No,
        proj : this.openProject,
        Product_ID : row.Product_ID
      }
        const obj = {
          "SP_String": "Sp_Purchase_Order",
          "Report_Name_String": "Get_Details_Of_Product",
          "Json_Param_String": JSON.stringify([tempobj])
          }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.pendingPurIndProViewList = data;
          if(this.pendingPurIndProViewList.length){
            this.pendPurInProViewListDynamic = Object.keys(data[0]);
          }
          this.ViewListForPendIndQty = true
          
        })
      }
      }
    }
gettermsdetails(){
      const obj = {
        "SP_String": "Sp_Purchase_Order",
        "Report_Name_String": "Get_Terms_Details",
        "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
        }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.termsdetails = data;
        this.objpurchase.Payment_Terms = data[0].Payment_Terms;
        this.objpurchase.Delivery_Terms = data[0].Delivery_Terms;
        this.objpurchase.Warranty_Guarantee_Term = data[0].Warranty_Guarantee_Term;
        this.objpurchase.Certificates_Terms = data[0].Certificates_Terms;
        this.objpurchase.Installation_Commissioning = data[0].Installation_Commissioning;
        this.objpurchase.Delivery_Location = data[0].Delivery_Location;
        this.objpurchase.Remarks = data[0].Remarks;
        this.objpurchase.PO_Header = data[0].PO_Header;
        this.objupdateterm = data[0];
      })
}
  gettermDateRange(dateRangeObj){
    if (dateRangeObj.length) {
      this.objupdateterm.From_Date = dateRangeObj[0];
      this.objupdateterm.To_Date = dateRangeObj[1];
    }
  }
  UpdateTerms(){
    this.TermSpinner = true
    this.ngxService.start();
    const costcent = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
     "SP_String": "Sp_Purchase_Order",
     "Report_Name_String": "Update_Terms_Details",
     "Json_Param_String": JSON.stringify([{...costcent,...this.objupdateterm}])
   
   }
   this.GlobalAPI.getData(obj).subscribe(async (data:any)=>{
     if(data[0].Column1){
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        // summary: summary,
        detail: "Succesfully Update"
      });
           this.TermSpinner = false;
          //  this.getAllData(true);
          //  this.getPendingReq(true);
           this.ngxService.stop();
          //  this.clearData();
          this.gettermsdetails();
     }
     else {
       this.ngxService.stop();
       this.TermSpinner = false;
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

}
class purchase {
        Doc_No:any;
        Doc_Date:any;						
        Sub_Ledger_ID:any;	
        Sub_Ledger_Name:any;
        Sub_Ledger_Billing_Name:any;	
        Sub_Ledger_Address_1:any;
        Sub_Ledger_Address_2:any;
        Sub_Ledger_Address_3:any;
        Sub_Ledger_Land_Mark:any;
        Sub_Ledger_Pin:any;
        Sub_Ledger_District:any;	
        Sub_Ledger_State:any;
        Sub_Ledger_Country:any;
        Sub_Ledger_Email:any;
        Sub_Ledger_Mobile_No:any;
        Sub_Ledger_PAN_No:any;	
        Sub_Ledger_TIN_No:any;
        Sub_Ledger_CST_No:any;
        Sub_Ledger_SERV_REG_NO:any;		
        Sub_Ledger_UID_NO:any;	
        Sub_Ledger_EXID_NO:any;
        Billing_To:any;
        Cost_Cen_ID:any;	
        Cost_Cen_Name:any;	
        Cost_Cen_Address1:any;	
        Cost_Cen_Address2:any;
        Cost_Cen_Location:any;
        Cost_Cen_District:any;
        Cost_Cen_State:any;
        Cost_Cen_Country:any;
        Cost_Cen_PIN:any;
        Cost_Cen_Mobile:any;
        Cost_Cen_Phone:any;
        Cost_Cen_Email1:any;
        Cost_Cen_VAT_CST:any;
        Cost_Cen_CST_NO:any;	
        Cost_Cen_SRV_TAX_NO:any;	
        Supp_Ref_No:any;	
        Supp_Ref_Date:any;
        Project_ID:any;
        Type_ID:any;	
        Credit_Days:any;	
        Remarks:any;				
        Terms_Condition:any;	
        Currency_ID:any;
        Currency_Symbol:any;
        L_element:any;
        Company_ID:any;
        PO_Header:any;
        Payment_Terms:any
        Delivery_Terms:any
        Warranty_Guarantee_Term:any
        Certificates_Terms:any
        Installation_Commissioning:any
        Delivery_Location:any
        User_ID:any
}
class addPurchacse{
      Product_ID:any;
      Product_Name:any;
      Product_Spec:any;
      Exp_Delivery:any;
      Qty:any;
      Rate:number;
      Gross_Amt:any;
      Excise_Tax_Percentage:Number = 0;
      Excise_Tax:any;
      Tax_Desc:any;
      Tax_Rate:any;
      Discount:any;
      Total_Amount:any;
      Batch_Number:any;
      AO_No:any;
      Unit:any;
      Discount_Type:any;
      Discount_AMT:any;
      taxable_AMT :any;
      GST_AMT:any;
      Gst:any;
      Taxable_Amount:any;
      Req_No:any;
      Product_Type_ID:any
}
class project{
    DOC_NO:any
    DOC_DATE:any
    DOC_TYPE:any
    PROJECT_ID:any
    SITE_ID:any
    Budget_Group_ID:any
    Budget_Sub_Group_ID:any
    Work_Details_ID:any
}
class Browse {
  Company_ID:any;
  start_date : Date ;
  end_date : Date;
  Cost_Cen_ID : 0;
  Product_Type_ID : 0;
}
class pendingreq {
  From_Date: string;
  To_Date: string;
  Cost_Cen_ID: number;
  proj:string
}
class pendingpurindpro {
  From_Date: string;
  To_Date: string;
  Cost_Cen_ID: number;
  proj:string
}
class updateterm {
  From_Date: string;
  To_Date: string;
  Cost_Cen_ID: number;
  proj:string;
  PO_Header:any;
  Payment_Terms:any
  Delivery_Terms:any
  Warranty_Guarantee_Term:any
  Certificates_Terms:any
  Installation_Commissioning:any
  Delivery_Location:any
}