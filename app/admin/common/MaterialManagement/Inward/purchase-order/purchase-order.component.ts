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
  objaddPurchacse : addPurchacse = new addPurchacse();
  constructor(private $http: HttpClient ,
    private commonApi: CompacctCommonApi,   
    private Header: CompacctHeader ,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private fb: FormBuilder) { }

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
  getProductDetalis(){
    if(this.objaddPurchacse.Product_ID){
      let tempVal = this.productDataList.filter(el=> Number(el.Product_ID) === Number(this.objaddPurchacse.Product_ID))
       this.objaddPurchacse.Unit = tempVal[0].UOM
       this.objaddPurchacse.Product_Spec = tempVal[0].Product_Spec
       this.getAcceptanceOrder(this.objaddPurchacse.Product_ID);
    }
    else{
      this.objaddPurchacse.Unit = undefined;
      this.objaddPurchacse.Product_Spec = undefined;
    }
  }
  getAcceptanceOrder(id){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Previous_PO_Rate",
      "Json_Param_String": JSON.stringify([{ProductID : id}])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.rate = data[0].Rt
     })
  }
  getGrsAmt(){
    if(this.objaddPurchacse.Qty){
      this.objaddPurchacse.Rate = undefined;
      this.objaddPurchacse.Gross_Amt = undefined;
      this.objaddPurchacse.Total_Amount = undefined;
      this.objaddPurchacse.Rate = this.rate;
      this.objaddPurchacse.Gross_Amt = (Number(this.objaddPurchacse.Qty) * Number(this.objaddPurchacse.Rate)).toFixed(2)
      this.objaddPurchacse.Total_Amount = (Number(this.objaddPurchacse.Qty) * Number(this.objaddPurchacse.Rate)).toFixed(2)
      this.totalRate = this.objaddPurchacse.Total_Amount;
    }
    else {
      this.objaddPurchacse.Rate = undefined;
      this.objaddPurchacse.Gross_Amt = undefined;
      this.objaddPurchacse.Total_Amount = undefined;
    }
  }
  getExciseAmt(){
    if(this.objaddPurchacse.Excise_Tax_Percentage){
      this.objaddPurchacse.Excise_Tax = undefined;
      this.objaddPurchacse.Total_Amount = undefined;
      this.objaddPurchacse.Excise_Tax = (Number(this.objaddPurchacse.Gross_Amt) * (Number(this.objaddPurchacse.Excise_Tax_Percentage) / 100)).toFixed(2)
      this.objaddPurchacse.Total_Amount = (this.totalRate + this.objaddPurchacse.Excise_Tax).toFixed(2)
      this.totalbackUp = this.objaddPurchacse.Total_Amount
    }
    else {
      this.objaddPurchacse.Excise_Tax = undefined;
      this.objaddPurchacse.Total_Amount = this.totalRate
    }
  }
  getTotalForTax(){
    if(this.objaddPurchacse.Tax_Rate){
      this.objaddPurchacse.Total_Amount = undefined;
      const totalAmt = this.totalbackUp ? this.totalbackUp : this.totalRate
      this.objaddPurchacse.Total_Amount = ((Number(totalAmt) * (Number(this.objaddPurchacse.Tax_Rate) / 100)) + totalAmt).toFixed(2)
      this.totalAmtBackUp =  this.objaddPurchacse.Total_Amount
    }
    else {
      this.objaddPurchacse.Total_Amount = this.totalbackUp ? (this.totalbackUp).toFixed(2) : (this.totalRate).toFixed(2)
    }
  }
  getDis(){
    if(this.objaddPurchacse.Discount){
      this.objaddPurchacse.Total_Amount = undefined;
      const tempTotal = this.totalAmtBackUp ? this.totalAmtBackUp : this.totalbackUp ? this.totalbackUp : this.totalRate
      this.objaddPurchacse.Total_Amount = Number(tempTotal) - Number(this.objaddPurchacse.Discount)
    }
    else {
      this.objaddPurchacse.Total_Amount = this.totalAmtBackUp ? this.totalAmtBackUp : this.totalbackUp ? this.totalbackUp : this.totalRate
    }
  }
  AddPurchase(valid){
    this.purChaseAddFormSubmit = true
    console.log("valid",valid);
   if(valid){
     const productFilter = this.productDataList.filter(el=> Number(el.Product_ID) === Number(this.objaddPurchacse.Product_ID))
     console.log("productFilter",productFilter[0])
     let saveData = {
      Product_ID : this.objaddPurchacse.Product_ID,
      Product_Name : productFilter[0].Product_Name,
      Product_Spec: productFilter[0].Product_Spec,
      Exp_Delivery : this.DateService.dateConvert(new Date(this.ExpectedDeliverydate)),
      Qty :Number(this.objaddPurchacse.Qty),
      Rate: Number(this.objaddPurchacse.Rate),
      Gross_Amt: Number(this.objaddPurchacse.Gross_Amt),
      Excise_Tax_Percentage: Number(this.objaddPurchacse.Excise_Tax_Percentage),
      Excise_Tax: Number(this.objaddPurchacse.Excise_Tax),
      Tax_Desc: this.objaddPurchacse.Tax_Desc,
      Tax_Rate:Number(this.objaddPurchacse.Tax_Rate),
      Discount: Number(this.objaddPurchacse.Discount),
      Total_Amount: Number(this.objaddPurchacse.Total_Amount),
      AO_No: "NA",
      UOM: this.objaddPurchacse.Unit
     }
      this.addPurchaseList.push(saveData)
      this.objaddPurchacse = new addPurchacse();
      this.purChaseAddFormSubmit = false;
      console.log("addPurchaseList",this.addPurchaseList);
   }
 }
 savePurchase(valid){
   this.purchaseFormSubmitted = true
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
        
}
class addPurchacse{
      Product_ID:any;
      Product_Name:any;
      Product_Spec:any;
      Exp_Delivery:any;
      Qty:any;
      Rate:any;
      Gross_Amt:any;
      Excise_Tax_Percentage:any;
      Excise_Tax:any;
      Tax_Desc:any;
      Tax_Rate:any;
      Discount:any;
      Total_Amount:any;
      Batch_Number:any;
      AO_No:any;
      Unit:any;
     
}