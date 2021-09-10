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

@Component({
  selector: 'app-inward-replacement',
  templateUrl: './inward-replacement.component.html',
  styleUrls: ['./inward-replacement.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class InwardReplacementComponent implements OnInit {

  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  items = [];
  cols = [];
  menuList = [];
  DocDate = new Date();
  expDate: any;
  replacementForm: FormGroup;
  searchForm: FormGroup;
  submitted = false;
  submitted2 = false;
  vendorList:any[] =[];
  costCenterList:any[] =[];
  inwardTypeList:any[] =[];
  productList:any[]=[];
  stockPointList:any[]=[];
  Product_Serial:boolean = false;
  replacementAgainstList:any[]=[];
  totalAmount:number = 0;
  Product_Name: string;
  godown_name: string;
  currentDate:any;
  docNo:number = 0;
  currencyList:any[] = [];
  addRowObj:any[]= [];
  tmpAddRowObj:any[]= [];
  editData:any[]= [];
  searchData:any[] = [];
  dataNotFound: boolean = false;
  delete_doc_No:any={};

  constructor(
    private $http: HttpClient ,
    private commonApi: CompacctCommonApi,   
    private Header: CompacctHeader ,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private $CompacctAPI: CompacctCommonApi,
    private fb: FormBuilder) {
      // Reload current page
      this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
      };
    }

  ngOnInit() {
    this.items = [ 'BROWSE', 'CREATE'];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];  
      this.Header.pushHeader({
        'Header' : 'Inward Replacement',
        'Link' : 'Material Management -> Inward -> Inward Replacement'
      });

    const date = this.DateService.dateConvert(moment(new Date, 'YYYY-MM-DD')['_d']).split('/') ;
    const add2Year = Number(date[2]) + 2;
    this.expDate = date[0] + '/' + date[1] + '/' + add2Year;
    //this.currentDate = date[0] + '/' + date[1] + '/' + date[2];
    this.currentDate = moment(new Date()).format('YYYY-MM-DD'); 
    //console.log('this.currentDate =', this.currentDate)
 
     const date1 = moment(new Date('30/Jun/2020')).format('YYYY-MM-DD') ;
     //console.log('date1 =', date1) // output 2020-06-30  

    this.replacementForm = this.fb.group({  
      Sub_Ledger_ID: ['', Validators.required],
      Sub_Ledger_Billing_Name:[''],
      Sub_Ledger_Name:[''],
      Sub_Ledger_Email:[''],
      Sub_Ledger_Mobile_No:[''],
      Sub_Ledger_Address_1:[''],
      Sub_Ledger_Land_Mark:[''],
      Sub_Ledger_Pin:[''],
      Sub_Ledger_District:[''],
      Sub_Ledger_State:[''],
      Sub_Ledger_Country:[''],
      Sub_Ledger_PAN_No:[''],
      Sub_Ledger_TIN_No:[''],
      Sub_Ledger_CST_No:[''],
      Sub_Ledger_SERV_REG_NO:[''],
      Sub_Ledger_UID_NO:[''],
      Sub_Ledger_EXID_NO:[''],

      Cost_Cen_ID: ['', Validators.required],
      Cost_Cen_Name:[''],
      Cost_Cen_Address1:[''],
      Cost_Cen_Address2:[''],
      Cost_Cen_Location:[''],
      Cost_Cen_PIN:[''],
      Cost_Cen_District:[''],
      Cost_Cen_State:[''],
      Cost_Cen_Country:[''],
      Cost_Cen_Mobile:[''],
      Cost_Cen_Phone:[''],
      Cost_Cen_Email:[''],
      Cost_Cen_VAT_CST:[''],
      Cost_Cen_CST_NO:[''],
      Cost_Cen_SRV_TAX_NO:[''],
      Doc_Date: [''], 
      Currency_ID: [1],     
      Currency_Symbol:[''],    
      Pur_Order_Date: [''],  
      CN_No: [''],
      Supp_Ref_No: [''],
      Supp_Ref_Date: [''],

      Type_ID: [97],
      CN_Date: [''],
      Product_ID:[''],
      Replacement_Against:[''],
      Batch_Number:[''],
      Serial_No:[''],      
      Qty:[''],
      UOM:['PCS'],
      MRP:[''],
      Rate:[''],
      Amount:[''],
      godown_id:[''],           
    });
    this.searchForm = this.fb.group({
      From_Txn_Date: [''],
      To_Txn_Date: [''],      
      Cost_Cen_ID: ['', Validators.required],
      Type_ID: ['', Validators.required],
     });

    this.replacementForm.get('Cost_Cen_ID').setValue(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
    this.searchForm.get('Cost_Cen_ID').setValue(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
  
    this.getVendor();
    this.getCostCenter();
    this.getInwardType(); 
    this.getProduct();
    this.getStockPoint();
    this.getCurrency();
  }

  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {   
      this.searchForm.get('From_Txn_Date').setValue(dateRangeObj[0]);
      this.searchForm.get('To_Txn_Date').setValue(dateRangeObj[1]);
    }
  }

  search(){  
    this.searchData = [];
    this.dataNotFound = false;
     this.submitted2 = true;
     if (this.searchForm.invalid) {
         return;
     }else{
       const From_Txn_Date = this.fval2.From_Txn_Date.value  ? this.dateConvert(this.fval2.From_Txn_Date.value) : this.dateConvert(new Date());     
       const To_Txn_Date = this.fval2.To_Txn_Date.value ? this.dateConvert(this.fval2.To_Txn_Date.value) : this.dateConvert(new Date());        
   
       this.$http.get('/INV_Txn_Inward_Replacement/GetAllData?from_date=' + From_Txn_Date + '&to_date=' + To_Txn_Date + '&Cost_Cen_ID=' + this.fval2.Cost_Cen_ID.value + '&Type_ID=' + this.fval2.Type_ID.value)
       .subscribe((data: any) => {
            //console.log('data =', data);
             this.searchData = data ? data : [];
             console.log('searchData res =', this.searchData);
             if(this.searchData.length > 0){
               this.submitted2 = false;                    
             }else{
               this.dataNotFound = true;
               this.submitted2 = false;                
             }                    
       });
     }
   }
   dateFormat(date){
    const date1 = moment(new Date(date)).format('YYYY-MM-DD');
    return date1;
   }

   dateConvert(ds){
    const date = moment(new Date(ds.toString().substr(0, 16)));
    //const res = date.format("DD-MMM-YYYY");
    const res = date.format("YYYY-MM-DD");   
    return res;
  }

getVendor() {
  this.$http.get('/Common/Get_SubLedger_All')
  .subscribe((data: any) => {
    this.vendorList = data ? JSON.parse(data) : [];     
      if(this.vendorList.length > 0 ){
        this.vendorList.forEach((val, index)=>{          
          this.vendorList[index].label = val.Sub_Ledger_Name;
          this.vendorList[index].value = val.Sub_Ledger_ID;                
          });                    
      }     
      //console.log('this.vendorList =', this.vendorList);
  }); 
}   

getCostCenter() {
  this.$http.get('/Common/Get_Cost_Center')
  .subscribe((data: any) => {
      this.costCenterList = data ? JSON.parse(data) : [];     
      if(this.costCenterList.length > 0 ){
          this.costCenterList.forEach((val, index)=>{
              this.costCenterList[index].label = val.Cost_Cen_Name;
              this.costCenterList[index].value = val.Cost_Cen_ID;
          });
          this.getCostCenterDetails();
      }     
     // console.log('this.costCenterList =', this.costCenterList);
  }); 
}
getVendorDetails(){ 
      const vendorIndex = this.vendorList.findIndex(val=>{
        return val.Sub_Ledger_ID === this.fval.Sub_Ledger_ID.value;
      })    

      if(vendorIndex!== -1){
         this.replacementForm.get('Sub_Ledger_Billing_Name').setValue(this.vendorList[vendorIndex].Sub_Ledger_Billing_Name);
         this.replacementForm.get('Sub_Ledger_Name').setValue(this.vendorList[vendorIndex].Sub_Ledger_Name);
         this.replacementForm.get('Sub_Ledger_Email').setValue(this.vendorList[vendorIndex].Sub_Ledger_Email); 
         
         this.replacementForm.get('Sub_Ledger_Mobile_No').setValue(this.vendorList[vendorIndex].Sub_Ledger_Mobile_No);
         this.replacementForm.get('Sub_Ledger_Address_1').setValue(this.vendorList[vendorIndex].Sub_Ledger_Address_1);
         this.replacementForm.get('Sub_Ledger_Land_Mark').setValue(this.vendorList[vendorIndex].Sub_Ledger_Land_Mark);
         this.replacementForm.get('Sub_Ledger_Pin').setValue(this.vendorList[vendorIndex].Sub_Ledger_Pin);
         this.replacementForm.get('Sub_Ledger_District').setValue(this.vendorList[vendorIndex].Sub_Ledger_District);
         this.replacementForm.get('Sub_Ledger_State').setValue(this.vendorList[vendorIndex].Sub_Ledger_State);
         this.replacementForm.get('Sub_Ledger_Country').setValue(this.vendorList[vendorIndex].Sub_Ledger_Country);
         this.replacementForm.get('Sub_Ledger_PAN_No').setValue(this.vendorList[vendorIndex].Sub_Ledger_PAN_No);
         this.replacementForm.get('Sub_Ledger_TIN_No').setValue(this.vendorList[vendorIndex].Sub_Ledger_TIN_No);
         this.replacementForm.get('Sub_Ledger_CST_No').setValue(this.vendorList[vendorIndex].Sub_Ledger_CST_No);
         this.replacementForm.get('Sub_Ledger_SERV_REG_NO').setValue(this.vendorList[vendorIndex].Sub_Ledger_SERV_REG_NO);
         this.replacementForm.get('Sub_Ledger_UID_NO').setValue(this.vendorList[vendorIndex].Sub_Ledger_UID_NO);
    }
}

getCostCenterDetails(){
  const costCenterIndex = this.costCenterList.findIndex(val=>{
    return val.Cost_Cen_ID === this.fval.Cost_Cen_ID.value;
  }) 
    
  if(costCenterIndex!== -1){      
     this.replacementForm.get('Cost_Cen_Name').setValue(this.costCenterList[costCenterIndex].Cost_Cen_Name);
     this.replacementForm.get('Cost_Cen_Address1').setValue(this.costCenterList[costCenterIndex].Cost_Cen_Address1);
     this.replacementForm.get('Cost_Cen_Address2').setValue(this.costCenterList[costCenterIndex].Cost_Cen_Address2);
     this.replacementForm.get('Cost_Cen_Location').setValue(this.costCenterList[costCenterIndex].Cost_Cen_Location);
     this.replacementForm.get('Cost_Cen_PIN').setValue(this.costCenterList[costCenterIndex].Cost_Cen_PIN);
     this.replacementForm.get('Cost_Cen_District').setValue(this.costCenterList[costCenterIndex].Cost_Cen_District);
     this.replacementForm.get('Cost_Cen_State').setValue(this.costCenterList[costCenterIndex].Cost_Cen_State);
     this.replacementForm.get('Cost_Cen_Country').setValue(this.costCenterList[costCenterIndex].Cost_Cen_Country);

     this.replacementForm.get('Cost_Cen_Mobile').setValue(this.costCenterList[costCenterIndex].Cost_Cen_Mobile);
     this.replacementForm.get('Cost_Cen_Phone').setValue(this.costCenterList[costCenterIndex].Cost_Cen_Phone);
     this.replacementForm.get('Cost_Cen_Email').setValue(this.costCenterList[costCenterIndex].Cost_Cen_Email);
      this.replacementForm.get('Cost_Cen_VAT_CST').setValue(this.costCenterList[costCenterIndex].Cost_Cen_VAT_CST);
      this.replacementForm.get('Cost_Cen_CST_NO').setValue(this.costCenterList[costCenterIndex].Cost_Cen_CST_NO);
      this.replacementForm.get('Cost_Cen_SRV_TAX_NO').setValue(this.costCenterList[costCenterIndex].Cost_Cen_SRV_TAX_NO);
}

}

getInwardType() {
  this.$http.get('/Common/Get_INV_Txn_Type?Txn_Type=PURCHASE')
  .subscribe((data: any) => {
    this.inwardTypeList = data ? JSON.parse(data) : [];     
      if(this.inwardTypeList.length > 0 ){
        this.inwardTypeList.forEach((val, index)=>{          
          this.inwardTypeList[index].label = val.Txn_Type;
          this.inwardTypeList[index].value = val.Type_ID;                
          });                    
      }     
      //console.log('this.inwardTypeList =', this.inwardTypeList);
  }); 
}   
getProduct() {
  this.$http.get('/Common/Get_Product_Purchasable')
  .subscribe((data: any) => {
    this.productList = data ? JSON.parse(data) : [];     
      if(this.productList.length > 0 ){
        this.productList.forEach((val, index)=>{          
          this.productList[index].label = val.Product_Name;
          this.productList[index].value = val.Product_ID;                
          });                    
      }     
      //console.log('this.productList =', this.productList);
  }); 
} 

getStockPoint() {
  this.$http.get('/Common/Get_Godown_list?Cost_Cent_ID=' + this.fval.Cost_Cen_ID.value )
  .subscribe((data: any) => {
    this.stockPointList = data ? JSON.parse(data) : [];     
      if(this.stockPointList.length > 0 ){
        this.stockPointList.forEach((val, index)=>{          
          this.stockPointList[index].label = val.godown_name;
          this.stockPointList[index].value = val.godown_id;                
          });                    
      }     
      //console.log('this.stockPointList =', this.stockPointList);
  }); 
}

getCurrency() {
  this.$http.get('/Common/Get_Currency_Details')
  .subscribe((data: any) => {
    this.currencyList = data ? data : [];     
      if(this.currencyList.length > 0 ){
        this.currencyList.forEach((val, index)=>{          
          this.currencyList[index].label = val.Currency_Symbol;
          this.currencyList[index].value = val.Currency_ID;                
          });                    
      }     
      //console.log('this.currencyList =', this.currencyList);
  }); 
} 
changeProduct(){
  this.Product_Serial = false;
  this.Product_Serial = this.productList.find(val => val.Product_ID === this.fval.Product_ID.value).Product_Serial;
  console.log('this.Product_Serial =', this.Product_Serial);

  this.Product_Name = undefined;
  this.Product_Name = this.productList.find(val => val.Product_ID === this.fval.Product_ID.value).Product_Name;
  console.log('this.Product_Name =', this.Product_Name);  

  if(this.Product_Serial){
    this.replacementForm.get('Qty').setValue(1); 
  }else{
    this.replacementForm.get('Qty').setValue('');     
  }
  
  this.getReplacementAgainst();
}
changeStockPoint(){
  this.godown_name = undefined;
  this.godown_name = this.stockPointList.find(val => val.godown_id === this.fval.godown_id.value).godown_name;
  console.log('this.godown_name =', this.godown_name);  
}

getReplacementAgainst() {
  this.$http.get('/INV_Txn_Inward_Replacement/Replacement_Against_DrpDwnlist?Sub_Ledger_ID=' + this.fval.Sub_Ledger_ID.value + '&Product_ID=' + this.fval.Product_ID.value )
// this.$http.get('/INV_Txn_Inward_Replacement/Replacement_Against_DrpDwnlist?Sub_Ledger_ID=14904&Product_ID=2192' )
  .subscribe((data: any) => {
    this.replacementAgainstList = data ? JSON.parse(data) : [];     
      if(this.replacementAgainstList.length > 0 ){
        this.replacementAgainstList.forEach((val, index)=>{          
          this.replacementAgainstList[index].label = val.Replacement_Against;
          this.replacementAgainstList[index].value = val.Replacement_Against;                
          });                    
      }     
      console.log('this.replacementAgainstList =', this.replacementAgainstList);
  }); 
}
rateChange(){
    this.totalAmount = 0;
    this.totalAmount = this.fval.Qty.value * this.fval.Rate.value;
    this.replacementForm.get('Amount').setValue(this.totalAmount);     
}
getCurrencyDetails(){  
  const curIndex = this.currencyList.findIndex(val=>{
    return val.Currency_ID === this.fval.Currency_ID.value;
  })
  console.log('curIndex =', curIndex);
  if(curIndex!== -1){
     this.replacementForm.get('Currency_Symbol').setValue(this.currencyList[curIndex].Currency_Symbol);
  }
}

get fval() {
  return this.replacementForm.controls;
}
get fval2() { return this.searchForm.controls; }

addRaw(){
    // this.getToCostCentName();
      // this.replacementForm.get('Cost_Cen_ID').setValidators([Validators.required]);
      // this.replacementForm.get('Cost_Cen_ID').updateValueAndValidity();

      this.replacementForm.controls.Product_ID.setValidators([Validators.required]);
      this.replacementForm.controls.Product_ID.updateValueAndValidity();
      this.replacementForm.controls.Replacement_Against.setValidators([Validators.required]);
      this.replacementForm.controls.Replacement_Against.updateValueAndValidity();
      this.replacementForm.controls.Batch_Number.setValidators([Validators.required]);
      this.replacementForm.controls.Batch_Number.updateValueAndValidity();
      this.replacementForm.controls.Qty.setValidators([Validators.required, this.ValidateZero]);
      this.replacementForm.controls.Qty.updateValueAndValidity();
      this.replacementForm.controls.Rate.setValidators([Validators.required, this.ValidateZero]); 
      this.replacementForm.controls.Rate.updateValueAndValidity();
      this.replacementForm.controls.Amount.setValidators([Validators.required]);  
      this.replacementForm.controls.Amount.updateValueAndValidity();
      this.replacementForm.controls.godown_id.setValidators([Validators.required]);
      this.replacementForm.controls.godown_id.updateValueAndValidity();   

      if(!this.Product_Serial){
        this.replacementForm.controls.Serial_No.setValidators([]);
        this.replacementForm.controls.Serial_No.updateValueAndValidity();
        this.replacementForm.get('Serial_No').setValue('');
        this.replacementForm.controls.Batch_Number.setValidators([Validators.required]);
        this.replacementForm.controls.Batch_Number.updateValueAndValidity();    
      }else{
        this.replacementForm.controls.Batch_Number.setValidators([]);
        this.replacementForm.controls.Batch_Number.updateValueAndValidity();
        this.replacementForm.get('Batch_Number').setValue('');
        this.replacementForm.controls.Serial_No.setValidators([Validators.required]);
        this.replacementForm.controls.Serial_No.updateValueAndValidity();
      }

      this.submitted = true;

    if(this.replacementForm.invalid) {
        return;
    }else{     

              const obj ={
                Doc_No: this.docNo,
                Doc_Date :this.fval.Doc_Date.value,
                
                Sub_Ledger_ID :this.fval.Sub_Ledger_ID.value,
                Sub_Ledger_Name :this.fval.Sub_Ledger_Name.value,
                Sub_Ledger_Billing_Name :this.fval.Sub_Ledger_Billing_Name.value, 
                Sub_Ledger_Address_1 :this.fval.Sub_Ledger_Address_1.value, 
                Sub_Ledger_Address_2:'',
                Sub_Ledger_Address_3:'',
                Sub_Ledger_Land_Mark :this.fval.Sub_Ledger_Land_Mark.value, 
                Sub_Ledger_Pin :this.fval.Sub_Ledger_Pin.value, 
                Sub_Ledger_District :this.fval.Sub_Ledger_District.value, 
                Sub_Ledger_State :this.fval.Sub_Ledger_State.value, 
                Sub_Ledger_Country :this.fval.Sub_Ledger_Country.value, 
                Sub_Ledger_Email :this.fval.Sub_Ledger_Email.value, 
                Sub_Ledger_Mobile_No :this.fval.Sub_Ledger_Mobile_No.value, 
                Sub_Ledger_PAN_No :this.fval.Sub_Ledger_PAN_No.value, 
                Sub_Ledger_TIN_No :this.fval.Sub_Ledger_TIN_No.value, 
                Sub_Ledger_CST_No :this.fval.Sub_Ledger_CST_No.value, 
                Sub_Ledger_SERV_REG_NO :this.fval.Sub_Ledger_SERV_REG_NO.value, 
                Sub_Ledger_UID_NO :this.fval.Sub_Ledger_UID_NO.value, 
                Sub_Ledger_EXID_NO  :this.fval.Sub_Ledger_EXID_NO.value, 
         
                Cost_Cen_ID :this.fval.Cost_Cen_ID.value, 
                Cost_Cen_Name :this.fval.Cost_Cen_Name.value, 
                Cost_Cen_Address1 :this.fval.Cost_Cen_Address1.value, 
                Cost_Cen_Address2 :this.fval.Cost_Cen_Address2.value, 
                Cost_Cen_Location :this.fval.Cost_Cen_Location.value, 
                Cost_Cen_District :this.fval.Cost_Cen_District.value, 
                Cost_Cen_State :this.fval.Cost_Cen_State.value, 
                Cost_Cen_Country :this.fval.Cost_Cen_Country.value, 
                Cost_Cen_PIN :this.fval.Cost_Cen_PIN.value, 
                Cost_Cen_Mobile :this.fval.Cost_Cen_Mobile.value, 
                Cost_Cen_Phone :this.fval.Cost_Cen_Phone.value, 
                Cost_Cen_Email1 :this.fval.Cost_Cen_Email.value, 
                Cost_Cen_VAT_CST :this.fval.Cost_Cen_VAT_CST.value, 
                Cost_Cen_CST_NO :this.fval.Cost_Cen_CST_NO.value, 
                Cost_Cen_SRV_TAX_NO :this.fval.Cost_Cen_SRV_TAX_NO.value, 

                Project_ID: 0,
                Supp_Ref_No :this.fval.Supp_Ref_No.value, 
                Supp_Ref_Date  :this.fval.Supp_Ref_Date.value, 
                Pur_Order_No: '',
                Pur_Order_Date  :this.fval.Pur_Order_Date.value,  
                CN_No :this.fval.CN_No.value, 
                CN_Date :this.fval.CN_Date.value,                 
                   
                Product_ID: this.fval.Product_ID.value,
                Product_Name: this.Product_Name,                
                Replacement_Against: this.fval.Replacement_Against.value,
                Batch_Number: this.fval.Batch_Number.value,
                Serial_No: this.fval.Serial_No.value,
                Qty: this.fval.Qty.value,
                UOM:this.fval.UOM.value,
                MRP:this.fval.MRP.value,
                Rate:this.fval.Rate.value,
                Amount:this.fval.Amount.value,
                godown_id: this.fval.godown_id.value,
                godown_name: this.godown_name,             
                
                Bill_Gross_Amt:0,
                Bill_Net_Amt: 0,
                Billed: "N",
                User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
                Entry_Date : this.currentDate,
                Remarks: '',
                Fin_Year_ID: this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
                Type_ID : this.fval.Type_ID.value, 
                Previous_Doc_No: '',
                Currency_ID : this.fval.Currency_ID.value, 
                Currency_Symbol : this.fval.Currency_Symbol.value,                
                PO_Currency_ID: 0,
                Purchase_Rate: 0,
                Conversion_Rate: 0,
                Freight_Amount: 0,
                Custom_Duty: 0,
                Product_Expiry: false,
                Expiry_Date: null                           
              }; 
              this.tmpAddRowObj.push(obj);
              //console.log('this.tmpAddRowObj =', this.tmpAddRowObj);

              this.addRowObj = [...this.tmpAddRowObj];
              console.log('this.addRowObj =', this.addRowObj);       
              
                this.submitted = false;            
                
                this.replacementForm.controls.Product_ID.setValidators([]);
                this.replacementForm.controls.Product_ID.updateValueAndValidity();
                this.replacementForm.controls.Replacement_Against.setValidators([]);
                this.replacementForm.controls.Replacement_Against.updateValueAndValidity();
                this.replacementForm.controls.Batch_Number.setValidators([]);
                this.replacementForm.controls.Batch_Number.updateValueAndValidity();
                this.replacementForm.controls.Qty.setValidators([]);
                this.replacementForm.controls.Qty.updateValueAndValidity();
                this.replacementForm.controls.Rate.setValidators([]); 
                this.replacementForm.controls.Rate.updateValueAndValidity();
                this.replacementForm.controls.Amount.setValidators([]);  
                this.replacementForm.controls.Amount.updateValueAndValidity();
                this.replacementForm.controls.godown_id.setValidators([]);
                this.replacementForm.controls.godown_id.updateValueAndValidity();   
                this.replacementForm.controls.Serial_No.setValidators([]);
                this.replacementForm.controls.Serial_No.updateValueAndValidity();             
            
                this.replacementForm.get('Product_ID').setValue('');           
                this.replacementForm.get('Replacement_Against').setValue('');
                this.replacementForm.get('Qty').setValue('');     
                this.replacementForm.get('MRP').setValue('');
                this.replacementForm.get('Rate').setValue('');
                this.replacementForm.get('Amount').setValue('');
                this.replacementForm.get('godown_id').setValue('');     
                this.replacementForm.get('Serial_No').setValue('');
                this.replacementForm.get('Batch_Number').setValue('');
                                  
    }
}

// Save
saveAdjustment () {
   this.submitted = true;
   if (this.replacementForm.invalid) {
       return;
   }else{
        if(this.addRowObj.length != 0){                      
              this.Spinner = true;
              if(this.docNo === 0){
                var UrlAddress = '/INV_Txn_Inward_Replacement/Create_INV_Txn_Inward_Ajax';               
              }else{        
                
                this.tmpAddRowObj.forEach((val, index)=>{                 
                  this.tmpAddRowObj[index].Doc_No = this.editData[0].Doc_No; 
                  this.tmpAddRowObj[index].Doc_Date = this.fval.Doc_Date.value;           
                  this.tmpAddRowObj[index].Sub_Ledger_ID = this.fval.Sub_Ledger_ID.value;
                  this.tmpAddRowObj[index].Sub_Ledger_Name = this.fval.Sub_Ledger_Name.value;
                  this.tmpAddRowObj[index].Sub_Ledger_Billing_Name = this.fval.Sub_Ledger_Billing_Name.value;
                  this.tmpAddRowObj[index].Sub_Ledger_Address_1 = this.fval.Sub_Ledger_Address_1.value;
                  this.tmpAddRowObj[index].Sub_Ledger_Address_2 = this.editData[0].Sub_Ledger_Address_2;
                  this.tmpAddRowObj[index].Sub_Ledger_Address_3 = this.editData[0].Sub_Ledger_Address_3;
                  this.tmpAddRowObj[index].Sub_Ledger_Land_Mark = this.fval.Sub_Ledger_Land_Mark.value;
                  this.tmpAddRowObj[index].Sub_Ledger_Pin = this.fval.Sub_Ledger_Pin.value;
                  this.tmpAddRowObj[index].Sub_Ledger_District = this.fval.Sub_Ledger_District.value;
       
                  this.tmpAddRowObj[index].Sub_Ledger_State = this.fval.Sub_Ledger_State.value;
                  this.tmpAddRowObj[index].Sub_Ledger_Country = this.fval.Sub_Ledger_Country.value;
                  this.tmpAddRowObj[index].Sub_Ledger_Email = this.fval.Sub_Ledger_Email.value;
                  this.tmpAddRowObj[index].Sub_Ledger_Mobile_No = this.fval.Sub_Ledger_Mobile_No.value;
       
                  this.tmpAddRowObj[index].Sub_Ledger_PAN_No = this.fval.Sub_Ledger_PAN_No.value;
                  this.tmpAddRowObj[index].Sub_Ledger_TIN_No = this.fval.Sub_Ledger_TIN_No.value;
                  this.tmpAddRowObj[index].Sub_Ledger_CST_No = this.fval.Sub_Ledger_CST_No.value;
                  this.tmpAddRowObj[index].Sub_Ledger_SERV_REG_NO = this.fval.Sub_Ledger_SERV_REG_NO.value;       
                  this.tmpAddRowObj[index].Sub_Ledger_UID_NO = this.fval.Sub_Ledger_UID_NO.value;
                  this.tmpAddRowObj[index].Sub_Ledger_EXID_NO = this.fval.Sub_Ledger_EXID_NO.value;
                  this.tmpAddRowObj[index].Cost_Cen_ID = this.fval.Cost_Cen_ID.value;
                  this.tmpAddRowObj[index].Cost_Cen_Name = this.fval.Cost_Cen_Name.value;       
                  this.tmpAddRowObj[index].Cost_Cen_Address1 = this.fval.Cost_Cen_Address1.value;
                  this.tmpAddRowObj[index].Cost_Cen_Address2 = this.editData[0].Cost_Cen_Address2;
                  this.tmpAddRowObj[index].Cost_Cen_Location = this.fval.Cost_Cen_Location.value;
                  this.tmpAddRowObj[index].Cost_Cen_District = this.fval.Cost_Cen_District.value;
       
                  this.tmpAddRowObj[index].Cost_Cen_State = this.fval.Cost_Cen_State.value;
                  this.tmpAddRowObj[index].Cost_Cen_Country = this.fval.Cost_Cen_Country.value;
                  this.tmpAddRowObj[index].Cost_Cen_PIN = this.fval.Cost_Cen_PIN.value;
                  this.tmpAddRowObj[index].Cost_Cen_Mobile = this.fval.Cost_Cen_Mobile.value;
                  this.tmpAddRowObj[index].Cost_Cen_Phone = this.fval.Cost_Cen_Phone.value;
                  this.tmpAddRowObj[index].Cost_Cen_Email1 = this.editData[0].Cost_Cen_Email1;
                  this.tmpAddRowObj[index].Cost_Cen_VAT_CST = this.fval.Cost_Cen_VAT_CST.value;
                  this.tmpAddRowObj[index].Cost_Cen_CST_NO = this.fval.Cost_Cen_CST_NO.value;
                  this.tmpAddRowObj[index].Cost_Cen_SRV_TAX_NO = this.fval.Cost_Cen_SRV_TAX_NO.value;
                  this.tmpAddRowObj[index].Project_ID = 0;
                  this.tmpAddRowObj[index].Supp_Ref_No = this.fval.Supp_Ref_No.value;
                  this.tmpAddRowObj[index].Supp_Ref_Date = this.fval.Supp_Ref_Date.value;
       
                  this.tmpAddRowObj[index].Pur_Order_No = '';
                  this.tmpAddRowObj[index].Pur_Order_Date = this.fval.Pur_Order_Date.value;
                  this.tmpAddRowObj[index].CN_No = this.fval.CN_No.value;
                  this.tmpAddRowObj[index].CN_Date = this.fval.CN_Date.value;
                  this.tmpAddRowObj[index].Bill_Gross_Amt = 0;
                  this.tmpAddRowObj[index].Bill_Net_Amt = 0;
                  this.tmpAddRowObj[index].Billed = "N";
                  this.tmpAddRowObj[index].User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
                  this.tmpAddRowObj[index].Entry_Date = this.currentDate;
                  this.tmpAddRowObj[index].Remarks ='';
                  this.tmpAddRowObj[index].Fin_Year_ID = this.$CompacctAPI.CompacctCookies.Fin_Year_ID;
                  this.tmpAddRowObj[index].Type_ID = this.fval.Type_ID.value;
                  this.tmpAddRowObj[index].Previous_Doc_No = '';
                  this.tmpAddRowObj[index].Currency_ID = this.fval.Currency_ID.value;
                  this.tmpAddRowObj[index].Currency_Symbol = this.fval.Currency_Symbol.value;
                  this.tmpAddRowObj[index].PO_Currency_ID = 0;
                  this.tmpAddRowObj[index].Purchase_Rate = 0;
                  this.tmpAddRowObj[index].Conversion_Rate = 0;
                  this.tmpAddRowObj[index].Freight_Amount = 0;
                  this.tmpAddRowObj[index].Custom_Duty = 0;   
               })
       
                this.addRowObj = [...this.tmpAddRowObj];
                console.log('this.addRowObj Final =', this.addRowObj); 

                var UrlAddress = '/INV_Txn_Inward_Replacement/Update_INV_Txn_Inward_Ajax';     
              }             
              const obj = {
                '_INV_Txn_Inward_Replacement': this.addRowObj
              }; 

              this.$http.post(UrlAddress, obj )
              .subscribe((data: any) => {
                  if (data.success) {
                      this.compacctToast.clear();
                      this.compacctToast.add({key: 'compacct-toast',
                                        severity: 'success',
                                        summary: 'Inward Replacement Saved',
                                        detail: 'Succesfully Saved'});                                                      
                      this.clearData();                              
                      this.search();                      
                    }
                    this.Spinner = false;
              });                  
        }      
   };
}
// Edit
edit(Doc_No) {
  this.tabIndexToView = 1;
  this.items = ['BROWSE', 'UPDATE'];
  this.buttonname = 'Update';

  this.$http.get('/INV_Txn_Inward_Replacement/GetEditData?Doc_No=' + Doc_No)
  .subscribe((data: any) => {
      this.editData = data ? data : [];
    console.log('Edit editData =>>', this.editData);
    if(this.editData.length > 0 ){

      this.replacementForm.get('Sub_Ledger_ID').setValue(this.editData[0].Sub_Ledger_ID);
      this.getVendorDetails();

      //this.replacementForm.get('Doc_Date').setValue('2020-06-30');
      this.replacementForm.get('Doc_Date').setValue(this.dateFormat(this.editData[0].Doc_Date));
      this.replacementForm.get('Currency_ID').setValue(this.editData[0].Currency_ID);
      this.replacementForm.get('Currency_Symbol').setValue(this.editData[0].Currency_Symbol);
      this.replacementForm.get('Pur_Order_Date').setValue(this.dateFormat(this.editData[0].Pur_Order_Date));
      this.replacementForm.get('CN_No').setValue(this.editData[0].CN_No);
      this.replacementForm.get('Supp_Ref_No').setValue(this.editData[0].Supp_Ref_No);
      this.replacementForm.get('Supp_Ref_Date').setValue(this.dateFormat(this.editData[0].Supp_Ref_Date));
      this.replacementForm.get('CN_Date').setValue(this.dateFormat(this.editData[0].CN_Date));
      this.replacementForm.get('godown_id').setValue(this.dateFormat(this.editData[0].godown_id));
      this.godown_name = this.editData[0].godown_name;
      
        this.tmpAddRowObj =[];
        this.addRowObj =[];
        this.docNo = this.editData[0].Doc_No;         
        this.tmpAddRowObj = [...this.editData[0].List_Product];
        //console.log('this.tmpAddRowObj Edit =', this.tmpAddRowObj);               
         this.addRowObj = [...this.tmpAddRowObj];
         console.log('this.addRowObj Edit =', this.addRowObj); 
    }
  });
}
ValidateZero(control: AbstractControl) {
  // alert('value =' + control.value);
  if (control.value <= 0) {
   return { validZero: true };
  }
  return null;
}

 deleteRawMaterial(index){
    this.addRowObj.splice(index, 1);
    this.tmpAddRowObj.splice(index, 1);  
}
delete (delete_doc_No) {  
     this.delete_doc_No = delete_doc_No;
     this.compacctToast.clear();
     this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});  
 }
  // Delete
  onConfirm() {
    if (this.delete_doc_No) {
      this.$http.post('/INV_Txn_Inward_Replacement/Delete?Doc_No='+ this.delete_doc_No, {})
      .subscribe((data: any) => {
          if (data.success === true) {
              this.onReject();
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                 severity: 'success',
                                 detail: 'Succesfully Deleted'});                              
                                 this.delete_doc_No = {};
                                 this.search();
            }
      });
    }
  }
  onReject() {
    this.compacctToast.clear('c');
  }
   // PDF
   getPrint(obj) {
    if (obj.Com_Inv_No) {
      window.open('/Report/Crystal_Files/PRODUCTION/EXP_Doc_Custom_Inv_Print.aspx?Com_Inv_No=' + obj.Com_Inv_No,
       'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }

  // Clear & Tab
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = [ 'BROWSE', 'CREATE'];
    this.buttonname = 'Create';
   this.clearData();
  }
  clearData() {
      this.Spinner = false;
      this.submitted = false;       
      this.Product_Serial = false;            
        
      if(this.items[1] === 'CREATE'){
        this.tmpAddRowObj = []; 
        this.addRowObj = [];   
        this.docNo = 0;     
        this.replacementForm.reset(); 
      }
      if(this.tabIndexToView ==1){
        //this.DocDate = new Date();   
        this.replacementForm.get('Doc_Date').setValue(this.currentDate);
      }      
      // this.dataNotFound = false;   
      this.replacementForm.get('Cost_Cen_ID').setValue(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
      this.getCostCenterDetails();
      this.replacementForm.get('Currency_ID').setValue(1);       
      this.replacementForm.get('Type_ID').setValue(97);
      this.replacementForm.get('UOM').setValue('PCS');
  }
}
