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
  selector: 'app-consultancy-commission',
  templateUrl: './consultancy-commission.component.html',
  styleUrls: ['./consultancy-commission.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None  
})

export class ConsultancyCommissionComponent implements OnInit {
  //items = [];
  cols = [];
  menuList = [];
  Spinner = false;
  displayMaximizable: boolean; 
  consultancyForm: FormGroup;
  searchForm: FormGroup;
  loading = false;
  submitted = false;
  submitted2 = false;
  modelList:any[] = [];
  branchList:any[] = [];
  supplierList:any[] = [];
  txnID:number = 0;
  searchData :any[] = [];
  serviceData :any[] = [];
  deleteRowId:any ={};
  deleteRowIndex:any ={};
  dataNotFound: boolean = false;

  testList:any[] = [];
  costCenterList:any[] = [];
  ownProductID:number = 0;
  testNameFound:any;
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
        'Header' : 'Consultancy Commission',
        'Link' : ' Clinic Master -> Clinic -> Consultancy Commission '
      });

    this.consultancyForm = this.fb.group({     
      Cons_ID: ['', Validators.required],
      Cost_Cen_ID: ['', Validators.required],
      Comm_Type: ['AMT'], 
      Comm_Amount: ['', Validators.required] 
    });   

    this.searchForm = this.fb.group({
      Search_Cost_Cen_ID: ['', Validators.required]  
     });   
    this.getTest();
    this.constCenter();    
  }

  get fval() { return this.consultancyForm.controls; }
  get fval2() { return this.searchForm.controls; }

 filter(){  
   this.searchData = [];
   this.dataNotFound = false;
    this.submitted2 = true;   
    if (this.searchForm.invalid) {
        return;
    }else{    
        this.$http.get('/GHC_Consultancy_Commision/Get_Browse?Cost_Cen_ID=' + this.fval2.Search_Cost_Cen_ID.value)
      .subscribe((data: any) => {
           //console.log('data =', data);
            this.searchData = data ? JSON.parse(data) : [];
            console.log('Filter res =', this.searchData);
            if(this.searchData.length > 0){
              this.dataNotFound = false;                          
            }else{
              this.dataNotFound = true;
              this.submitted2 = false;                      
            }                    
      });
    }
}

  getTest() {
    this.$http.get('/GHC_Consultancy_Commision/Get_Data_For_Test_DrpDwn')
    .subscribe((data: any) => {
        this.testList = data ? JSON.parse(data) : [];  
        this.testList.forEach((val, index)=>{
            this.testList[index].label = val.Consultancy_Descr;
            this.testList[index].value = val.Cons_ID;
        });
       // console.log('this.testList =', this.testList);
    });
  }

  constCenter() {
    this.$http.get('/GHC_Consultancy_Commision/Get_Cost_Centre')
    .subscribe((data: any) => {
        this.costCenterList = data ? JSON.parse(data) : [];  
        this.costCenterList.forEach((val, index)=>{
            this.costCenterList[index].label = val.Cost_Cen_Name;
            this.costCenterList[index].value = val.Cost_Cen_ID;
        });
        //console.log('this.costCenterList =', this.costCenterList);
    });
  } 
  getProductId(){      
    const arr = this.testList.filter((val, index)=>{
        return val.Cons_ID === this.fval.Cons_ID.value;
    })
    this.ownProductID = arr[0].Own_Product_ID;
  }

  find(){
    this.testNameFound = {};
    return new Promise((resolve, reject)=>{        
      this.$http.get('/GHC_Consultancy_Commision/Get_Browse?Cost_Cen_ID=' + this.fval.Cost_Cen_ID.value)
      .subscribe((data: any) => {          
            const findData = data ? JSON.parse(data) : [];
            //console.log('findData =', findData);
            if(findData.length > 0){
                this.testNameFound = findData.findIndex(x => {
                  if(x.Txn_ID !== this.txnID){
                     return (x.Cons_ID === this.fval.Cons_ID.value) && (x.Cost_Cen_ID === this.fval.Cost_Cen_ID.value);
                  }                  
              })  
              resolve();                       
            }else{          
             this.testNameFound = -1;      
             resolve();                            
            }                     
      });
    })  
  }
  async onFormSubmit(){
    this.submitted = true;
    if (this.consultancyForm.invalid) {
      return;
    }else{
      await this.find();
    
      if(this.testNameFound !== -1){
          this.compacctToast.add({key: 'compacct-toast',
          severity: 'error',
          summary: 'Testing Name already exist in this Cost Center',
          detail: 'Error Occured '});
      }else{
        const apiInput = {       
          "Txn_ID": this.txnID,
          "Cost_Cen_ID": this.fval.Cost_Cen_ID.value,
          "Cons_ID": this.fval.Cons_ID.value,
          "Own_Product_ID": this.ownProductID,
          "Comm_Type": this.fval.Comm_Type.value,
          "Comm_Amount": this.fval.Comm_Amount.value,      
        };
  
        console.log('apiInput =', apiInput);
        const UrlAddress = '/GHC_Consultancy_Commision/CREATE_EDIT';
        const obj = { 
          'GHC_Consultancy_Commision_String': JSON.stringify([apiInput])
        };    
         
          this.$http.post(UrlAddress, obj)
          .subscribe((res: any) => {
              console.log('res =', res);
              if (res.success) {  
                      //if(this.txnID !==0){
                        this.filter();  
                     // }                          
                      this.compacctToast.clear();
                      this.compacctToast.add({key: 'compacct-toast',
                                        severity: 'success',
                                        summary: 'Consultancy Commission Saved'  ,
                                        detail: 'Succesfully Saved'});
                      this.Spinner = false;
                      if( this.txnID !==0){
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
}
// Edit
edit(Txn_ID) {  
    this.displayMaximizable = true;
    this.$http.get('/GHC_Consultancy_Commision/Get_Data_For_Edit?Txn_ID=' + Txn_ID)
    .subscribe((data: any) => {
        this.serviceData = data ? JSON.parse(data) : [];
      console.log('Edit serviceData =>>', this.serviceData);  
      this.txnID = this.serviceData[0].Txn_ID;        
      this.consultancyForm.get('Cost_Cen_ID').setValue(this.serviceData[0].Cost_Cen_ID);
      this.consultancyForm.get('Cons_ID').setValue(this.serviceData[0].Cons_ID);
      this.consultancyForm.get('Comm_Type').setValue(this.serviceData[0].Comm_Type);
      this.consultancyForm.get('Comm_Amount').setValue(this.serviceData[0].Comm_Amount);
      this.ownProductID = this.serviceData[0].Own_Product_ID;      
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
    //this.searchData = [];
    this.txnID =0;
    this.ownProductID = 0;
    this.submitted = false;
    this.submitted2 = false;
    this.dataNotFound = false;
    this.consultancyForm.reset(); 
    this.consultancyForm.get('Comm_Type').setValue('AMT'); 
    this.consultancyForm.get('Cost_Cen_ID').setValue(this.fval2.Search_Cost_Cen_ID.value);
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


}
