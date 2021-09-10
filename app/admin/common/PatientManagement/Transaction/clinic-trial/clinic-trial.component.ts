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
  selector: 'app-clinic-trial',
  templateUrl: './clinic-trial.component.html',
  styleUrls: ['./clinic-trial.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class ClinicTrialComponent implements OnInit {

  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  items = [];
  cols = [];
  menuList = [];
  DocDate = new Date();
  expDate: any;
  clinicForm: FormGroup;
  searchForm: FormGroup;
  submitted = false;
  submitted2 = false;
  patientList:any[] =[];
  costCenterList:any[] =[];
 // fromVoucherTypeList:any[] =[];
  //toVoucherTypeList:any[] =[];
  addRowObj:any[]= [];
  tmpAddRowObj:any[]= [];
  //voucherNoList:any[] =[];
  //referenceNoList:any[] =[];
  //footFallID:any;
  searchData:any[] = [];
  dataNotFound: boolean = false;
  Doc_No:any={};
  rowTotalAmount:number = 0;
  productList:any[]=[];
  currentDate:any;
  totalAmount:number = 0;
  patientLedger:any;
  docNo:string = "A";
  editData:any[]= [];
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
        'Header' : 'Clinic Trial',
        'Link' : 'Patient Management -> Transaction -> Challan -> Clinic Trial'
      });

    const date = this.DateService.dateConvert(moment(new Date, 'YYYY-MM-DD')['_d']).split('/') ;
    const add2Year = Number(date[2]) + 2;
    this.expDate = date[0] + '/' + date[1] + '/' + add2Year;

    this.currentDate = moment(new Date()).format('YYYY-MM-DD'); 
    //console.log('this.currentDate =', this.currentDate)

    this.clinicForm = this.fb.group({ 
      Doc_Date: [''], 
      FOOT_Fall_ID: ['', Validators.required],
      Cost_Cen_ID: ['', Validators.required],
      Address:[''],
      Remarks: [''],   

      Product_ID: [''], 
      Product_Name: [''], 
      Product_Specification: [''], 
      Qty: [''], 
      UOM: [''], 
      Rate: [''], 
      Discount: [null], 
      Amount: [''], 
      Expected_Delivery_Date: [''],        
    });
    this.searchForm = this.fb.group({
      From_Txn_Date: [''],
      To_Txn_Date: [''],      
      Cost_Cen_ID: ['', Validators.required],
      //Type_ID: ['', Validators.required],
     });
    this.clinicForm.get('Cost_Cen_ID').setValue(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
    this.searchForm.get('Cost_Cen_ID').setValue(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);

    this.getPatient();
    this.getCostCenter();
    this.getProduct();
    this.getPatientLedger(); 
  }

  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {   
      this.searchForm.get('From_Txn_Date').setValue(dateRangeObj[0]);
      this.searchForm.get('To_Txn_Date').setValue(dateRangeObj[1]);
    }
  }

  dateConvert(ds){
    const date = moment(new Date(ds.toString().substr(0, 16)));
    //const res = date.format("DD-MMM-YYYY");
    const res = date.format("YYYY-MM-DD");   
    return res;
  }
  dateFormat(date){
    const date1 = moment(new Date(date)).format('YYYY-MM-DD');
    return date1;
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
 
     this.$http.get('/Hearing_Quotation/Get_BROWSE?from_date=' + From_Txn_Date + '&to_date=' + To_Txn_Date + '&Cost_Cen_ID=' + this.fval2.Cost_Cen_ID.value )
     .subscribe((data: any) => {
          //console.log('data =', data);
           this.searchData = data ? JSON.parse(data) : [];
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
getPatient() {
  this.$http.get('/Hearing_CRM_Lead/Get_All_Patient_Lead')
  .subscribe((data: any) => {
      const patientList = data ? JSON.parse(data) : [];     
      if(patientList.length > 0 ){
          patientList.forEach((val, index)=>{          
              patientList[index].label = val.Lead_Details;
              patientList[index].value = val.Foot_Fall_ID;                
          });             
          this.patientList = [...patientList]; 
      }     
     // console.log('this.patientList =', this.patientList);
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
      }     
      //console.log('this.costCenterList =', this.costCenterList);
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

getPatientLedger() {
  this.$http.get('/Common/Get_Patient_Subledger_ID')
  .subscribe((data: any) => {
      this.patientLedger = data ? JSON.parse(data) : [];          
     // console.log('this.patientLedger[0].Sub_Ledger_ID=', this.patientLedger[0].Sub_Ledger_ID);
  }); 
}

getProductDetails(){
  const Product_Name = this.productList.find(val => val.Product_ID === this.fval.Product_ID.value).Product_Name;
  const UOM = this.productList.find(val => val.Product_ID === this.fval.Product_ID.value).UOM;  
  this.clinicForm.get('Product_Name').setValue(Product_Name);
  this.clinicForm.get('Product_Specification').setValue(Product_Name);
  this.clinicForm.get('UOM').setValue(UOM);    
}

get fval() {
  return this.clinicForm.controls;
}
get fval2() { return this.searchForm.controls; }

addRaw(){
  // this.clinicForm.get('Cost_Cen_ID').setValidators([Validators.required]);
  // this.clinicForm.get('Cost_Cen_ID').updateValueAndValidity();

  this.clinicForm.controls.Product_ID.setValidators([Validators.required]);
  this.clinicForm.controls.Product_ID.updateValueAndValidity();
  this.clinicForm.controls.Qty.setValidators([Validators.required]);
  this.clinicForm.controls.Qty.updateValueAndValidity(); 
  this.clinicForm.controls.Rate.setValidators([Validators.required, this.ValidateZero]); 
  this.clinicForm.controls.Rate.updateValueAndValidity();
  this.clinicForm.controls.Amount.setValidators([Validators.required]);
  this.clinicForm.controls.Amount.updateValueAndValidity();
  this.clinicForm.controls.Expected_Delivery_Date.setValidators([Validators.required]);
  this.clinicForm.controls.Expected_Delivery_Date.updateValueAndValidity();

  this.submitted = true;

        if(this.clinicForm.invalid) {
            return;
        }else{ 
       
              const obj ={                               
                "Doc_No": this.docNo,
                "Doc_Date":this.fval.Doc_Date.value,
                "Sales_Man_ID":null,
                "Sub_Ledger_ID": this.patientLedger[0].Sub_Ledger_ID,
                "Customer_Order_No":null,
			          "Customer_Order_Date":null,
                "Remarks":this.fval.Remarks.value,
                "Currency_ID":null,
                "User_ID": this.$CompacctAPI.CompacctCookies.User_ID,
                "Entry_Date": this.currentDate,
                "Fin_Year_ID": this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
                "Quote_Doc_No": null,
                "Location": null,
                "Address":this.fval.Address.value,
                "Product_ID": this.fval.Product_ID.value,
                "Product_Name":this.fval.Product_Name.value,
                "Product_Specification": this.fval.Product_Specification.value,
                "UOM": this.fval.UOM.value,
                "Qty": this.fval.Qty.value,
                "Rate": this.fval.Rate.value,
                "Amount": this.fval.Amount.value,
                "Expected_Delivery_Date":this.fval.Expected_Delivery_Date.value,
                "Tax_Rate":0,
                "Tax_Amount":0,
                "FOOT_Fall_ID": this.fval.FOOT_Fall_ID.value,
                "Discount": this.fval.Discount.value,
                "Cost_Cen_ID": this.fval.Cost_Cen_ID.value,            
              }; 
              this.tmpAddRowObj.push(obj);
              //console.log('this.tmpAddRowObj =', this.tmpAddRowObj);

              this.addRowObj = [...this.tmpAddRowObj];
              console.log('this.addRowObj =', this.addRowObj);   

              this.clinicForm.controls.Product_ID.setValidators([]);
              this.clinicForm.controls.Product_ID.updateValueAndValidity();
              this.clinicForm.controls.Qty.setValidators([]);
              this.clinicForm.controls.Qty.updateValueAndValidity(); 
              this.clinicForm.controls.Rate.setValidators([]);
              this.clinicForm.controls.Rate.updateValueAndValidity();
              this.clinicForm.controls.Amount.setValidators([]);
              this.clinicForm.controls.Amount.updateValueAndValidity();
              this.clinicForm.controls.Expected_Delivery_Date.setValidators([]);
              this.clinicForm.controls.Expected_Delivery_Date.updateValueAndValidity();

            this.clinicForm.get('Product_ID').setValue('');
            this.clinicForm.get('Product_Name').setValue('');
            this.clinicForm.get('Product_Specification').setValue('');
            this.clinicForm.get('Qty').setValue('');
            this.clinicForm.get('UOM').setValue('');
            this.clinicForm.get('Rate').setValue('');
            this.clinicForm.get('Discount').setValue(null);
            this.clinicForm.get('Expected_Delivery_Date').setValue('');
            this.clinicForm.get('Amount').setValue('');                                      
    }
}
rateChange(){
  this.totalAmount = 0;
  this.totalAmount = this.fval.Qty.value * this.fval.Rate.value;
  if(this.fval.Discount.value !=null){
     this.totalAmount = this.totalAmount - this.fval.Discount.value;
  }
  this.clinicForm.get('Amount').setValue(this.totalAmount);      
}

// Save
saveAdjustment () {
   this.submitted = true;
   if (this.clinicForm.invalid) {
       return;
   }else{
        if(this.addRowObj.length !== 0){            
              this.Spinner = true;     

              this.tmpAddRowObj.forEach((val, index)=>{                 
                this.tmpAddRowObj[index].Doc_No = this.docNo; 
                this.tmpAddRowObj[index].Doc_Date = this.fval.Doc_Date.value;           
                this.tmpAddRowObj[index].FOOT_Fall_ID = this.fval.FOOT_Fall_ID.value;
                this.tmpAddRowObj[index].Cost_Cen_ID = this.fval.Cost_Cen_ID.value;
                this.tmpAddRowObj[index].Address = this.fval.Address.value;
                this.tmpAddRowObj[index].Remarks = this.fval.Remarks.value;               
              });
              this.addRowObj = [...this.tmpAddRowObj];
              console.log('this.addRowObj Final =', this.addRowObj); 

              const UrlAddress = '/Hearing_Quotation/Insert_Edit_Hearing_Quotation';
              const obj = {
                'Hearing_Quotation_String': JSON.stringify(this.addRowObj) 
              };
              this.$http.post(UrlAddress, obj )
              .subscribe((data: any) => {
                  if (data.success) {
                      this.compacctToast.clear();
                      this.compacctToast.add({key: 'compacct-toast',
                                        severity: 'success',
                                        summary: 'Adjustment Voucher Saved',
                                        detail: 'Succesfully Saved'});                                                      
                      this.clearData();                               
                      // if(this.footFallID !== undefined){
                        this.search();
                      // }
                    }
                    this.Spinner = false;
              });        
        }      
   };
}
edit(Doc_No) {
  this.tabIndexToView = 1;
  this.items = ['BROWSE', 'UPDATE'];
  this.buttonname = 'Update';  

   this.$http.get('/Hearing_Quotation/Get_Edit_Data?Doc_No=' + Doc_No)
  .subscribe((data: any) => {
      this.editData = data ? JSON.parse(data) : [];
    console.log('Edit editData =>>', this.editData);
    if(this.editData.length > 0 ){         
        this.clinicForm.get('Doc_Date').setValue(this.dateFormat(this.editData[0].Doc_Date));
        this.clinicForm.get('FOOT_Fall_ID').setValue(this.editData[0].FOOT_Fall_ID);
        this.clinicForm.get('Cost_Cen_ID').setValue(this.editData[0].Cost_Cen_ID);
        this.clinicForm.get('Address').setValue(this.editData[0].Address);
        this.clinicForm.get('Remarks').setValue(this.editData[0].Remarks);
      
        this.tmpAddRowObj =[];
        this.addRowObj =[];
        this.docNo = this.editData[0].Doc_No;         
        this.tmpAddRowObj = [...this.editData];
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
delete (Doc_No) {  
     this.delete_doc_No = Doc_No;
     this.compacctToast.clear();
     this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});  
 }
  // Delete
  onConfirm() {
    if (this.delete_doc_No) {
      this.$http.post('/Hearing_Quotation/Delete?Doc_No='+ this.delete_doc_No, {})
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
   getPrint(Doc_No) {   
      window.open('/Report/Crystal_Files/Finance/SaleBill/Hearing_Quotation_Print.aspx?DocNo=' + Doc_No,
       'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');   
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
      if(this.items[1] === 'CREATE'){
        this.tmpAddRowObj = []; 
        this.addRowObj = [];   
        this.docNo = "A";     
        this.clinicForm.reset(); 
      }
      if(this.tabIndexToView ==1){
        //this.DocDate = new Date();  
        this.clinicForm.get('Doc_Date').setValue(this.currentDate);
      }
      this.clinicForm.get('Cost_Cen_ID').setValue(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
     // this.getCostCenter();       
  }
}
