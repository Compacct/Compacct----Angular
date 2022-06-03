import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
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
  items = [];
  menuList = [];
  purchaseFormSubmitted = false;
  SubLedgerList = [];
  SubLedgerDataList = [];
  costCenterList = [];
  DetalisView = false;
  viewHeader = "";
  DetalisObj = {};
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
  addPurchaseList = [];
  AcceptanceOrderList = [];
  rate = undefined;
  totalRate = undefined;
  totalbackUp = undefined;
  totalAmtBackUp = undefined;
  DocNo = undefined;
  getAllDataList = [];
  DynamicHeader = [];
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
  validatation = {
    required : false,
    projectMand : 'N'
  }
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
    ) {
      this.route.queryParams.subscribe(params => {
        console.log(params);
        this.openProject = params['proj'];
        this.projectMand = params['mand'];
       })
     }

  ngOnInit() {
    this.items = [ 'BROWSE', 'CREATE'];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];  
      this.Header.pushHeader({
        'Header' : 'Purchase Order',
        'Link' : 'Material Management -> Inward -> Purchase Order'
      });
      this.getsubLedger();
      this.GetCostCenter();
      this.GetCurrency();
      this.GetOrderType();
      this.GetProject();
      this.getProduct();
      this.getAllData();
      this.getcompany();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.GetCostCenter();
    this.clearData();
  }
  clearData(){
    this.viewHeader = "";
    this.DetalisObj = {};
    this.objpurchase = new purchase();
    this.objaddPurchacse = new addPurchacse();
    this.Spinner = false;
    this.purChaseAddFormSubmit = false;
    this.purchaseFormSubmitted = false;
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
   }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){
   if(this.DocNo){
    const obj = {
      "SP_String": "Sp_Purchase_Order",
      "Report_Name_String":"Purchase_Order_Delete",
      "Json_Param_String": JSON.stringify([{Doc_No : this.DocNo}]) 
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
        this.getAllData();
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
    this.SubLedgerList = [];
      const obj = {
        "SP_String": "sp_Comm_Controller",
        "Report_Name_String": "Get_Product_Dropdown",
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log(data);
        this.productDataList = data;
       
        console.log("productDataList",this.productDataList);
        this.productDataList.forEach(el => {
          this.productList.push({
              label: el.Product_Name,
              value: el.Product_ID
            });
           });
        })
    }
  GetProductSpecification(){
   if(this.objaddPurchacse.Product_ID){
    let tempVal = this.productDataList.filter(el=> Number(el.Product_ID) === Number(this.objaddPurchacse.Product_ID));
    this.objaddPurchacse.Product_Spec = tempVal[0].Product_Spec;
   }
  }
  getProductDetalis(){
    if(this.objaddPurchacse.Qty){
      if(this.objaddPurchacse.Product_ID){
        let tempVal = this.productDataList.filter(el=> Number(el.Product_ID) === Number(this.objaddPurchacse.Product_ID))
         this.objaddPurchacse.Unit = tempVal[0].UOM
         console.log("tempVal",tempVal);
         this.GetTaxDetalis(this.objaddPurchacse.Product_ID);
         if(tempVal[0].Rate_Form_Quote === 'Y'){
         this.disable = true;
           this.GetRateY()
         }
         else {
          this.disable = false
          this.getRateN(this.objaddPurchacse.Product_ID);
         }
       }
      else{
        this.objaddPurchacse.Unit = undefined;
        this.objaddPurchacse.Product_Spec = undefined;
      }
    }
    else {
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
       // this.getTotalForTax();
     })
  }
  getGrsAmt(){
    if(this.rate || this.objaddPurchacse.Rate){
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
        this.objaddPurchacse.Rate = undefined;
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
     const productFilter = this.productDataList.filter(el=> Number(el.Product_ID) === Number(this.objaddPurchacse.Product_ID))
     console.log("productFilter",productFilter[0])
     let saveData = {
        Product_ID: Number(this.objaddPurchacse.Product_ID),
        Product_Name:  productFilter[0].Product_Name,
        Product_Spec: productFilter[0].Product_Spec,
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
        GST_Amount: (this.objaddPurchacse.GST_AMT)
     }
      this.addPurchaseList.push(saveData);
      
      this.objaddPurchacse = new addPurchacse();
      this.purChaseAddFormSubmit = false;
      console.log("addPurchaseList",this.addPurchaseList);
      this.getAllTotal();
   }
 }
 savePurchase(valid){
   this.purchaseFormSubmitted = true
   this.falg = true
   if(valid){
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
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data[0].Column1 === "Done"){
        this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Journal",
        detail: "Succesfully "+msg
      });
      if(this.DocNo){
        this.tabIndexToView = 0;
        this.items = ["BROWSE", "CREATE"];
        this.buttonname = "Create";
      }
      this.clearData();
      this.getAllData();
      }
      else {
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
 }
 getAllData(){
  const obj = {
    "SP_String": "Sp_Purchase_Order",
    "Report_Name_String": "Purchase_Order_Browse",
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.getAllDataList = data;
    if(this.getAllDataList.length){
      this.DynamicHeader = Object.keys(data[0]);
    }
   
    console.log("Get All Data",this.getAllDataList);
  })
 }
 Edit(col){
  if(col.Doc_No){
    this.DocNo = undefined;
    this.DocNo = col.Doc_No;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.geteditmaster(col.Doc_No);
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
    if(this.addPurchaseList.length){
      this.getAllTotal()
    }
  })
 }
 Delete(col){
  console.log("Delete Col",col);
  if(col.Doc_No){
   this.DocNo = undefined;
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
    this.objaddPurchacse.GST_AMT = (Number(this.objaddPurchacse.taxable_AMT) * (Number(this.objaddPurchacse.Gst)/100)).toFixed(2);
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
  })
}
getProjectData(e){
 console.log("Project Data",e);
 var size = Object.keys(e).length;
 if(!size){
   this.purChaseAddFormSubmit = true
 }
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
        company:any
       
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
}