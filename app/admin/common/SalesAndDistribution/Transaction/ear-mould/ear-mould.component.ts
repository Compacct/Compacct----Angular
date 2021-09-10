import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 

@Component({
  selector: 'app-ear-mould',
  templateUrl: './ear-mould.component.html',
  styleUrls: ['./ear-mould.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None  
})

export class EarMouldComponent implements OnInit {
  //items = [];
  cols = [];
  menuList = [];
  Spinner = false;
  displayMaximizable: boolean;
  serviceForm: FormGroup;
  searchForm: FormGroup;
  loading = false;
  submitted = false;
  submitted2 = false;
  modelList:any[] = [];
  branchList:any[] = [];
  supplierList:any[] = [];
  patientList:any[] = [];
  inwardOutwardID:number = 0;
  searchData :any[] = [];
  serviceData :any[] = [];
  deleteRowId:any ={};
  deleteRowIndex:any ={};
  dataNotFound: boolean = false;
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
    }

  ngOnInit() { 
      //this.items = [ 'BROWSE', 'CREATE'];
      this.menuList = [
        {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
        {label: 'Delete', icon: 'fa fa-fw fa-trash'}
      ];
      this.Header.pushHeader({
        'Header' : 'Inward & Outward Register',
        'Link' : ' Sales & Distribution -> Inward & Outward Register'
      });     

    this.serviceForm = this.fb.group({
      MOLD_JOB_NO: ['', Validators.required],
      Txn_Date: ['', Validators.required],
      Patient_Name: ['', Validators.required],
      MOLD_TYPE: ['', Validators.required],
      Brach_Name: ['', Validators.required],
      Supplier_Name: ['', Validators.required],
      Courier_Name: ['', Validators.required],
      POD_No: ['', Validators.required],
      Remarks: ['', Validators.required],
      MOLD_For_Ear: ['LEFT'],
      Input_Type: ['Inward']        
    });

    this.searchForm = this.fb.group({
      From_Txn_Date: [''],
      To_Txn_Date: [''],      
      Search_Input_Type: ['Inward']
     });   
    this.getModels(this.dateConvert(new Date()));
    this.getBranch();
    this.getSupplier();    
    this.getPatient();
  }

  get fval() { return this.serviceForm.controls; }
  get fval2() { return this.searchForm.controls; }

  dateConvert(ds){
    const date = moment(new Date(ds.toString().substr(0, 16)));
    //const res = date.format("DD-MMM-YYYY");
    const res = date.format("YYYY-MM-DD");   
    return res;
  }
  dateSelected(){
    const Txn_Date = this.fval.Txn_Date.value == undefined ? this.fval.Txn_Date.value : this.dateConvert(this.fval.Txn_Date.value);
    this.getModels(Txn_Date);
  }  

 /* filter(){  
   this.searchData = [];
   this.dataNotFound = false;
    this.submitted2 = true;
    if (this.searchForm.invalid) {
        return;
    }else{
      const From_Txn_Date = this.fval2.From_Txn_Date.value == undefined ? this.fval2.From_Txn_Date.value : this.dateConvert(this.fval2.From_Txn_Date.value);

      const To_Txn_Date = this.fval2.To_Txn_Date.value == undefined ? this.fval2.To_Txn_Date.value : this.dateConvert(this.fval2.To_Txn_Date.value);

        this.$http.get('/GHC_Inward_Outward_Register/EAR_MOULD_Browse?from_date=' + From_Txn_Date + '&to_date=' + To_Txn_Date + '&Txn_Type=EAR_MOULD&Input_Type=' + this.fval2.Search_Input_Type.value)
      .subscribe((data: any) => {
          
            this.searchData = data ? JSON.parse(data) : [];
            console.log('Filter res =', this.searchData);
            if(this.searchData.length > 0){
              this.submitted2 = false;
              this.searchForm.reset(); 
            }else{
              this.dataNotFound = true;
              this.submitted2 = false;
              this.searchForm.reset(); 
            }
           
      });
    }
} */
getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {   
    this.searchForm.get('From_Txn_Date').setValue(dateRangeObj[0]);
    this.searchForm.get('To_Txn_Date').setValue(dateRangeObj[1]);     
  }
}
filter(){  
  this.searchData = [];
  this.dataNotFound = false;
   this.submitted2 = true;
   if (this.searchForm.invalid) {
       return;
   }else{
     const From_Txn_Date = this.fval2.From_Txn_Date.value  ? this.dateConvert(this.fval2.From_Txn_Date.value) : this.dateConvert(new Date());     
     const To_Txn_Date = this.fval2.To_Txn_Date.value ? this.dateConvert(this.fval2.To_Txn_Date.value) : this.dateConvert(new Date());    

     this.$http.get('/GHC_Inward_Outward_Register/EAR_MOULD_Browse?from_date=' + From_Txn_Date + '&to_date=' + To_Txn_Date + '&Txn_Type=EAR_MOULD&Input_Type=' + this.fval2.Search_Input_Type.value)
     .subscribe((data: any) => {
          //console.log('data =', data);
           this.searchData = data ? JSON.parse(data) : [];
           console.log('Filter res =', this.searchData);
           if(this.searchData.length > 0){
             this.submitted2 = false;
             // this.searchForm.reset();             
           }else{
             this.dataNotFound = true;
             this.submitted2 = false;
             // this.searchForm.reset();              
           }                    
     });
   }
}

  getModels(Txn_Date) {
    this.$http.get('/GHC_Inward_Outward_Register/Get_Model?Pur_Doc_No=0&Doc_Date=' + Txn_Date)
    .subscribe((data: any) => {
        this.modelList = data ? JSON.parse(data) : [];  
        this.modelList.forEach((val, index)=>{
            this.modelList[index].label = val.Product_Name;
            this.modelList[index].value = val.Product_Name;
        });
       // console.log('this.modelList =', this.modelList);
    });
  }

  getBranch() {
    this.$http.get('/GHC_Inward_Outward_Register/Get_Branch')
    .subscribe((data: any) => {
        this.branchList = data ? JSON.parse(data) : [];  
        this.branchList.forEach((val, index)=>{
            this.branchList[index].label = val.Cost_Cen_Name;
            this.branchList[index].value = val.Cost_Cen_Name;
        });
        //console.log('this.branchList =', this.branchList);
    });
  }
  
  getSupplier() {
    this.$http.get('/GHC_Inward_Outward_Register/Get_Supplier')
    .subscribe((data: any) => {
        this.supplierList = data ? JSON.parse(data) : [];  
        this.supplierList.forEach((val, index)=>{
            this.supplierList[index].label = val.Sub_Ledger_Name;
            this.supplierList[index].value = val.Sub_Ledger_Name;
        });
        //console.log('this.supplierList =', this.supplierList);
    });
  }
  getPatient() {
    this.$http.get('/GHC_Inward_Outward_Register/Get_Patient')
    .subscribe((data: any) => {
        this.patientList = data ? JSON.parse(data) : [];  
        this.patientList.forEach((val, index)=>{
            this.patientList[index].label = val.Lead_Details;
            this.patientList[index].value = val.Lead_Details;
        });
        //console.log('this.patientList =', this.patientList);
    });
  }

  onFormSubmit(){
    this.submitted = true;

    if (this.serviceForm.invalid) {
      return;
    }else{
      //console.log('this.serviceForm 22 =', this.serviceForm);
      //this.loading = true;
      const Txn_Date = this.fval.Txn_Date.value == undefined ? this.fval.Txn_Date.value : this.dateConvert(this.fval.Txn_Date.value);
      const apiInput = {       
        "Inward_Outward_ID": this.inwardOutwardID,
        "Txn_Type": "EAR_MOULD",
        "Txn_Date": Txn_Date,
        "Input_Type":  this.fval.Input_Type.value,
        "MOLD_JOB_NO": this.fval.MOLD_JOB_NO.value,
        "Patient_Name": this.fval.Patient_Name.value,
        "MOLD_TYPE": this.fval.MOLD_TYPE.value,
        "Brach_Name": this.fval.Brach_Name.value,
        "Supplier_Name": this.fval.Supplier_Name.value,
        "Courier_Name": this.fval.Courier_Name.value,
        "POD_No": this.fval.POD_No.value,
        "Remarks": this.fval.Remarks.value,
        "MOLD_For_Ear": this.fval.MOLD_For_Ear.value,
      };

      console.log('apiInput =', apiInput);
      const UrlAddress = '/GHC_Inward_Outward_Register/EAR_MOULD_CREATE_EDIT';
      const obj = { 
        'GHC_Inward_Outward_EAR_MOULD_String': JSON.stringify([apiInput])
      };    
       
        this.$http.post(UrlAddress, obj)
        .subscribe((res: any) => {
            console.log('res =', res);
            if (res.success) {       
                    if(this.inwardOutwardID !==0){
                      this.filter();  
                    }                              
                    this.compacctToast.clear();
                    this.compacctToast.add({key: 'compacct-toast',
                                      severity: 'success',
                                      summary: 'Ear Mould Saved'  ,
                                      detail: 'Succesfully Saved'});
                    this.Spinner = false;
                    if( this.inwardOutwardID !==0){
                      this.closeMaximizableDialog();
                    }  
                    this.clearData();                            
            } else {
                  this.compacctToast.clear();
                  this.compacctToast.add({key: 'compacct-toast',
                                        severity: 'error',
                                        summary: 'Warn Message',
                                        detail: 'Error Occured '});
                                        this.Spinner = false;
          }
        });  
    }
}
// Edit
edit(Inward_Outward_ID) {  
    this.displayMaximizable = true;

    this.$http.get('/GHC_Inward_Outward_Register/EAR_MOULD_Get_Data_For_Edit?Inward_Outward_ID=' + Inward_Outward_ID)
    .subscribe((data: any) => {
        this.serviceData = data ? JSON.parse(data) : [];
      console.log('Edit serviceData =>>', this.serviceData);  
      this.inwardOutwardID = this.serviceData[0].Inward_Outward_ID;   
      const Txn_Date = this.serviceData[0].Txn_Date == null ? this.serviceData[0].Txn_Date : new Date(this.serviceData[0].Txn_Date);
      this.serviceForm.get('Txn_Date').setValue(Txn_Date);
      this.serviceForm.get('Input_Type').setValue(this.serviceData[0].Input_Type);
      this.serviceForm.get('MOLD_JOB_NO').setValue(this.serviceData[0].MOLD_JOB_NO);
      this.serviceForm.get('Patient_Name').setValue(this.serviceData[0].Patient_Name);
      this.serviceForm.get('MOLD_TYPE').setValue(this.serviceData[0].MOLD_TYPE);
      this.serviceForm.get('Brach_Name').setValue(this.serviceData[0].Brach_Name);
      this.serviceForm.get('Supplier_Name').setValue(this.serviceData[0].Supplier_Name);
      this.serviceForm.get('Courier_Name').setValue(this.serviceData[0].Courier_Name);
      this.serviceForm.get('POD_No').setValue(this.serviceData[0].POD_No);
      this.serviceForm.get('Remarks').setValue(this.serviceData[0].Remarks);
      this.serviceForm.get('MOLD_For_Ear').setValue(this.serviceData[0].MOLD_For_Ear);
      this.dateSelected();
    });
}

  closeMaximizableDialog() { 
    this.displayMaximizable = false;
    this.clearData();
  }
  showMaximizableDialog() {
    this.displayMaximizable = true;
    this.clearData();
  }
  clearData() {
    this.searchData = [];
    this.inwardOutwardID =0;
    this.submitted = false;
    this.serviceForm.reset(); 
    this.serviceForm.get('MOLD_For_Ear').setValue('LEFT');
    this.serviceForm.get('Input_Type').setValue('Inward');
  }  

  // Delete
  delete (index, Inward_Outward_ID) {    
      this.deleteRowIndex = index; 
      this.deleteRowId = Inward_Outward_ID;
      this.compacctToast.clear();
      this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});    
  }
  onConfirm() {  
      this.$http.post('/GHC_Inward_Outward_Register/SERVICE_Delete?Inward_Outward_ID=' + this.deleteRowId, {})
      .subscribe((res: any) => {
        //console.log('dele res =', res);
          if (res.success === true) {
                if(this.searchData.length >0){
                  this.searchData.splice(this.deleteRowIndex, 1);
                }
                this.onReject();
                this.compacctToast.clear();
                this.compacctToast.add({key: 'compacct-toast',
                                  severity: 'success',
                                  detail: 'Succesfully Deleted'});    
                                  this.deleteRowIndex = {};                                  
                this.deleteRowId = {};
            }
      });    
  }
  onReject() {
    this.compacctToast.clear('c');
  }
  ExamEndTimeGreaterThanStartTimeVal(From_Txn_Date: any, To_Txn_Date: any) {
    return (formGroup: FormGroup) => {     
       const FromTxnDate = formGroup.controls[From_Txn_Date];
       const ToTxnDate = formGroup.controls[To_Txn_Date];
  
       const FromTxnTime  = new Date(FromTxnDate.value).getTime();
       const ToTxnTime  = new Date(ToTxnDate.value).getTime();   
       
        if (ToTxnDate.errors && !ToTxnDate.errors.notStartTimeBigger) {
            // return if another validator has already found an error on the matchingControl
            return;
        }
  
       if(FromTxnTime > ToTxnTime){                
          ToTxnDate.setErrors({ notStartTimeBigger: true });
       }else {
          ToTxnDate.setErrors(null);
       }
    }
  }

}
