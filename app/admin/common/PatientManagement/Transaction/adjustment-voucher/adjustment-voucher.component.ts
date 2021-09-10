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
  selector: 'app-adjustment-voucher',
  templateUrl: './adjustment-voucher.component.html',
  styleUrls: ['./adjustment-voucher.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class AdjustmentVoucherComponent implements OnInit {

  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  items = [];
  cols = [];
  menuList = [];
  DocDate = new Date();
  expDate: any;
  adjustmentForm: FormGroup;
  submitted = false;
  patientList:any[] =[];
  costCenterList:any[] =[];
  fromVoucherTypeList:any[] =[];
  toVoucherTypeList:any[] =[];
  addRowObj:any[]= [];
  tmpAddRowObj:any[]= [];
  voucherNoList:any[] =[];
  referenceNoList:any[] =[];
  footFallID:any;
  searchData:any[] = [];
  dataNotFound: boolean = false;
  Adj_No:any={};
  rowTotalAmount:number = 0;

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
        'Header' : 'Adjustment Voucher',
        'Link' : 'Patient Management -> Transaction -> Vouchers -> Adjustment Voucher'
      });

    const date = this.DateService.dateConvert(moment(new Date, 'YYYY-MM-DD')['_d']).split('/') ;
    const add2Year = Number(date[2]) + 2;
    this.expDate = date[0] + '/' + date[1] + '/' + add2Year;

    this.adjustmentForm = this.fb.group({
      Adj_Date: [''], 
      Foot_Fall_ID: ['', Validators.required],
      Cost_Cen_ID: ['', Validators.required],
      From_Voucher_Type: ['', Validators.required],   
      From_Voucher_No: ['', Validators.required],       
      From_Voucher_Date:[''],
      Total_Adj_Amount:['', [Validators.required, this.ValidateZero]],
      To_Cost_Cen_ID: [''],
      To_Voucher_Type: [''],
      To_Voucher_No:[''],
      To_Voucher_Date:[''],  
      Adj_Amount: [''],
      To_Cost_Cen_Name: [''],
      To_Voucher_Type_Name: [''],
      From_Voucher_Type_Name: ['']            
    });
    this.adjustmentForm.get('Cost_Cen_ID').setValue(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
    this.adjustmentForm.get('To_Cost_Cen_ID').setValue(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
    this.getPatient();
    this.getCostCenter();
    this.getFromVoucherType(); 
  }

  search() {
    this.searchData = [];
    this.dataNotFound = false;
    console.log('footFallID =', this.footFallID);
    if(this.footFallID === undefined || this.footFallID == null || this.footFallID ===''){
        this.compacctToast.add({key: 'compacct-toast',
        severity: 'error',
        summary: 'Please select Patient',
        detail: 'Error Occured '});
    }else{
      this.$http.get('/Hearing_Adjustment_Voucher/Get_Adjustment_Voucher_Hearing?Foot_Fall_ID=' + this.footFallID)
      .subscribe((data: any) => {
          this.searchData = data ? JSON.parse(data) : [];              
          if(this.searchData.length > 0){
            console.log('this.searchData =', this.searchData);             
          }else{
            this.dataNotFound = true;        
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
      console.log('this.patientList =', this.patientList);
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
getFromVoucherType() {  
  this.$http.get('/Common/Get_Master_Accounting_Journal_Type')
  .subscribe((data: any) => {
      const fromVoucherTypeList = data ? JSON.parse(data) : [];     
     // console.log('this.fromVoucherTypeList 11 =', fromVoucherTypeList);
      if(fromVoucherTypeList.length > 0 ){
        this.fromVoucherTypeList = fromVoucherTypeList.filter((val , index)=>{
            return val.Voucher_Type === 'CR Note' || val.Voucher_Type === 'Journal' || val.Voucher_Type === 'Payment' || val.Voucher_Type === 'Receive' || val.Voucher_Type === 'Sale Return'; 
          })       
          this.fromVoucherTypeList.forEach((val, index)=>{
              this.fromVoucherTypeList[index].label = val.Voucher_Type;
              this.fromVoucherTypeList[index].value = val.Voucher_Type_ID;
          });          
      }     
     // console.log('this.fromVoucherTypeList 22=', this.fromVoucherTypeList);
  }); 
}

changeFromVoucherType(){
  this.getToVoucherType();

  this.$http.get('/Hearing_Adjustment_Voucher/Get_Search_Document_No_Hearing?Foot_Fall_ID=' + this.fval.Foot_Fall_ID.value + '&Type_ID=' + this.fval.From_Voucher_Type.value + '&Cost_Cen_ID=' + this.fval.Cost_Cen_ID.value)
  .subscribe((data: any) => {
      this.voucherNoList = data ? JSON.parse(data) : [];     
      if(this.voucherNoList.length > 0 ){
          this.voucherNoList.forEach((val, index)=>{
              this.voucherNoList[index].label = val.Doc_No;
              this.voucherNoList[index].value = val.Doc_No;
          });          
      }        
     
  }); 
}

getToVoucherType() {

const From_Voucher_Type_Name = this.fromVoucherTypeList.find(val => val.Voucher_Type_ID === this.fval.From_Voucher_Type.value).Voucher_Type;
this.adjustmentForm.get('From_Voucher_Type_Name').setValue(From_Voucher_Type_Name);

  this.$http.get('/Common/Get_Master_Accounting_Journal_Type')
  .subscribe((data: any) => {
      const toVoucherTypeList = data ? JSON.parse(data) : [];     
      if(toVoucherTypeList.length > 0 ){
               this.toVoucherTypeList = [];     
                    
                if(this.fval.From_Voucher_Type_Name.value === 'Receive'){                       
                    toVoucherTypeList.forEach((val2 , index2)=>{                             
                        if(val2.Voucher_Type === 'Sales' || val2.Voucher_Type === 'CR Note' || val2.Voucher_Type === 'Journal' ){                              
                              this.toVoucherTypeList.push(val2);
                        }                            
                    });
                }
                else if(this.fval.From_Voucher_Type_Name.value === 'CR Note'){                      
                    toVoucherTypeList.forEach((val2 , index2)=>{    
                          if(val2.Voucher_Type === 'Sales' ){                           
                            this.toVoucherTypeList.push(val2);
                          }                          
                    });
                }
                else if(this.fval.From_Voucher_Type_Name.value === 'Journal'){                            
                    toVoucherTypeList.forEach((val2 , index2)=>{                              
                         if(val2.Voucher_Type === 'Sales' || val2.Voucher_Type === 'CR Note' || val2.Voucher_Type === 'Payment' || val2.Voucher_Type === 'Receive'){                          
                              this.toVoucherTypeList.push(val2);
                         }
                    });
                }
                else if(this.fval.From_Voucher_Type_Name.value === 'Payment'){                            
                  toVoucherTypeList.forEach((val2 , index2)=>{                              
                       if( val2.Voucher_Type === 'CR Note'){                          
                            this.toVoucherTypeList.push(val2);
                       }
                  });
              }
              else if(this.fval.From_Voucher_Type_Name.value === 'Sale Return'){                            
                toVoucherTypeList.forEach((val2 , index2)=>{                              
                     if( val2.Voucher_Type === 'Sales' || val2.Voucher_Type === 'Payment'){                          
                          this.toVoucherTypeList.push(val2);
                     }
                });
            }
       
            this.toVoucherTypeList.forEach((val, index)=>{
                this.toVoucherTypeList[index].label = val.Voucher_Type;
                this.toVoucherTypeList[index].value = val.Voucher_Type_ID;
            });         
            console.log('this.toVoucherTypeList 11 =', this.toVoucherTypeList); 
      }         
  }); 
}

getFromVoucherDate(){
  const Voucher_Date = this.voucherNoList.find(val => val.Doc_No === this.fval.From_Voucher_No.value).Voucher_Date;
  this.adjustmentForm.get('From_Voucher_Date').setValue(Voucher_Date);
  //console.log('this.fval.From_Voucher_Date.value =', this.fval.From_Voucher_Date.value);  

  const Total_Adj_Amount = this.voucherNoList.find(val => val.Doc_No === this.fval.From_Voucher_No.value).Net_Amt;
  this.adjustmentForm.get('Total_Adj_Amount').setValue(Total_Adj_Amount);
 // console.log('this.fval.Total_Adj_Amount.value =', this.fval.Total_Adj_Amount.value);  
}

changeToVoucherType(){
  const To_Voucher_Type_Name = this.toVoucherTypeList.find(val => val.Voucher_Type_ID === this.fval.To_Voucher_Type.value).Voucher_Type;
  this.adjustmentForm.get('To_Voucher_Type_Name').setValue(To_Voucher_Type_Name);
  //console.log('this.fval.To_Voucher_Type_Name.value =', this.fval.To_Voucher_Type_Name.value); 

  this.referenceNoList = [];
  this.adjustmentForm.get('Adj_Amount').setValue('');

  this.$http.get('/Hearing_Adjustment_Voucher/Get_Search_Document_No_Hearing?Foot_Fall_ID=' + this.fval.Foot_Fall_ID.value + '&Type_ID=' + this.fval.To_Voucher_Type.value + '&Cost_Cen_ID=' + this.fval.To_Cost_Cen_ID.value)
  .subscribe((data: any) => {
      this.referenceNoList = data ? JSON.parse(data) : [];     
      if(this.referenceNoList.length > 0 ){
          this.referenceNoList.forEach((val, index)=>{
              this.referenceNoList[index].label = val.Doc_No;
              this.referenceNoList[index].value = val.Doc_No;
          });
      }     
      console.log('this.referenceNoList =', this.referenceNoList);  
  });   
}
getToVoucherDate(){  
  const To_Voucher_Date = this.referenceNoList.find(val => val.Doc_No === this.fval.To_Voucher_No.value).Voucher_Date;
  this.adjustmentForm.get('To_Voucher_Date').setValue(To_Voucher_Date); 
  
  const Adj_Amount = this.referenceNoList.find(val => val.Doc_No === this.fval.To_Voucher_No.value).Net_Amt;
  this.adjustmentForm.get('Adj_Amount').setValue(Adj_Amount); 
}  

getToCostCentName(){
  const To_Cost_Cen_Name = this.costCenterList.find(val => val.Cost_Cen_ID === this.fval.To_Cost_Cen_ID.value).Cost_Cen_Name;
  this.adjustmentForm.get('To_Cost_Cen_Name').setValue(To_Cost_Cen_Name);
  //console.log('this.fval.To_Cost_Cen_Name.value =', this.fval.To_Cost_Cen_Name.value);   
}

get fval() {
  return this.adjustmentForm.controls;
}

addRaw(){
  this.getToCostCentName();
  // this.adjustmentForm.get('Cost_Cen_ID').setValidators([Validators.required]);
  // this.adjustmentForm.get('Cost_Cen_ID').updateValueAndValidity();

  this.adjustmentForm.controls.To_Cost_Cen_ID.setValidators([Validators.required]);
  this.adjustmentForm.controls.To_Cost_Cen_ID.updateValueAndValidity();
  this.adjustmentForm.controls.To_Voucher_Type.setValidators([Validators.required]);
  this.adjustmentForm.controls.To_Voucher_Type.updateValueAndValidity();
  this.adjustmentForm.controls.To_Voucher_No.setValidators([Validators.required]);
  this.adjustmentForm.controls.To_Voucher_No.updateValueAndValidity();
  this.adjustmentForm.controls.Adj_Amount.setValidators([Validators.required]);
  this.adjustmentForm.controls.Adj_Amount.updateValueAndValidity();
  this.submitted = true;
  //this.rowTotalAmount = 0;

 if(this.adjustmentForm.invalid) {
     return;
 }else{ 

        this.tmpAddRowObj.forEach((val, index)=>{
            this.rowTotalAmount = this.rowTotalAmount + val.Adj_Amount;
        })
        const index = this.tmpAddRowObj.findIndex((val)=>{
            return val.To_Voucher_No === this.fval.To_Voucher_No.value;
        });
        if(index !==-1){
              this.compacctToast.add({key: 'compacct-toast',
              severity: 'error',
              summary: 'This voucher no already exist',
              detail: 'Error Occured '});
        }else{
              const obj ={
                "Adj_Date": this.fval.Adj_Date.value,
                "From_Voucher_Type": this.fval.From_Voucher_Type.value,
                "From_Voucher_No": this.fval.From_Voucher_No.value,
                "From_Voucher_Date": this.fval.From_Voucher_Date.value,
                "To_Voucher_Type": this.fval.To_Voucher_Type.value,
                "To_Voucher_No": this.fval.To_Voucher_No.value,
                "To_Voucher_Date": this.fval.To_Voucher_Date.value,
                "Adj_Amount": this.fval.Adj_Amount.value,
                "User_ID": this.$CompacctAPI.CompacctCookies.User_ID,
                "From_Cost_Cen_ID": this.fval.Cost_Cen_ID.value,
                "To_Cost_Cen_ID": this.fval.To_Cost_Cen_ID.value,
                "To_Cost_Cen_Name": this.fval.To_Cost_Cen_Name.value,
                "To_Voucher_Type_Name": this.fval.To_Voucher_Type_Name.value,
              }; 
              this.tmpAddRowObj.push(obj);
              //console.log('this.tmpAddRowObj =', this.tmpAddRowObj);

              this.addRowObj = [...this.tmpAddRowObj];
              console.log('this.addRowObj =', this.addRowObj);   

              this.referenceNoList = [];
            this.adjustmentForm.controls.To_Cost_Cen_ID.setValidators([]);
            this.adjustmentForm.controls.To_Cost_Cen_ID.updateValueAndValidity();
            this.adjustmentForm.controls.To_Voucher_Type.setValidators([]);
            this.adjustmentForm.controls.To_Voucher_Type.updateValueAndValidity();
            this.adjustmentForm.controls.To_Voucher_No.setValidators([]);
            this.adjustmentForm.controls.To_Voucher_No.updateValueAndValidity();    
            this.adjustmentForm.controls.Adj_Amount.setValidators([]);
            this.adjustmentForm.controls.Adj_Amount.updateValueAndValidity();           
            
           // this.adjustmentForm.get('To_Cost_Cen_ID').setValue('');
            this.adjustmentForm.get('To_Voucher_Type').setValue('');
            this.adjustmentForm.get('To_Voucher_No').setValue('');
            this.adjustmentForm.get('To_Voucher_Date').setValue('');
            this.adjustmentForm.get('Adj_Amount').setValue('');    
        }                              
    }
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
// Save
saveAdjustment () {
   this.submitted = true;
   if (this.adjustmentForm.invalid) {
       return;
   }else{
        if(this.addRowObj.length == 0){
            // this.compacctToast.add({key: 'compacct-toast',
            // severity: 'error',
            // summary: 'One grid must be add',
            // detail: 'Error Occured'});
        }else{
          this.rowTotalAmount = 0;

          this.addRowObj.forEach((val, index)=>{
            this.rowTotalAmount = this.rowTotalAmount + val.Adj_Amount;
          })
          console.log('this.rowTotalAmount =', this.rowTotalAmount);

          if(this.rowTotalAmount !== this.fval.Total_Adj_Amount.value){
              this.compacctToast.add({key: 'compacct-toast',
              severity: 'error',
              summary: 'Total Amount must be equeal to Total Adjustment Amount',
              detail: 'Error Occured '});
           // return;
         }else{
              this.Spinner = true;
              const UrlAddress = '/Hearing_Adjustment_Voucher/Insert_Adjustment_Voucher';
              const obj = {
                'Adj_Voucher_String': JSON.stringify(this.addRowObj) 
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
                      if(this.footFallID !== undefined){
                        this.search();
                      }
                    }
                    this.Spinner = false;
              });
           }
          
        }      
   };
}
delete (Adj_No) {  
     this.Adj_No = Adj_No;
     this.compacctToast.clear();
     this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});  
 }
  // Delete
  onConfirm() {
    if (this.Adj_No) {
      this.$http.post('/Hearing_Adjustment_Voucher/Delete?Adj_No='+ this.Adj_No, {})
      .subscribe((data: any) => {
          if (data.success === true) {
              this.onReject();
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                 severity: 'success',
                                 detail: 'Succesfully Deleted'});                              
                                 this.Adj_No = {};
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
      this.addRowObj = [];   
      this.voucherNoList = [];
      this.toVoucherTypeList = [];  
      //this.adjustmentForm.reset(); 
      if(this.tabIndexToView ==1){
        this.DocDate = new Date();  
      }
      // this.dataNotFound = false;
      this.adjustmentForm.get('Cost_Cen_ID').setValue(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
      this.adjustmentForm.get('To_Cost_Cen_ID').setValue(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);     
     this.adjustmentForm.get('Foot_Fall_ID').setValue('');
     this.adjustmentForm.get('From_Voucher_Type').setValue('');
     this.adjustmentForm.get('From_Voucher_No').setValue('');
     this.adjustmentForm.get('Total_Adj_Amount').setValue('');       
  }
}
