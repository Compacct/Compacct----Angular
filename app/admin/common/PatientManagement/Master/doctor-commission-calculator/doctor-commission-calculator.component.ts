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
  selector: 'app-doctor-commission-calculator',
  templateUrl: './doctor-commission-calculator.component.html',
  styleUrls: ['./doctor-commission-calculator.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
}) 

export class DoctorCommissionCalculatorComponent implements OnInit {

  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  items = [];
  cols = [];
  menuList = [];
  searchData = [];
  submitted = false;
  years:any[];
  months:any[];
  currentYear:any;
  prevYear:any;
  nextYear:any; 
  selectedYear:any;
  selectedMonth:any;
  costCenterList:any[] = [];
  eligibleDoctors:any[];
  transactions:any[];
  formData:any={};
  totalAmount:number =0;
  searchFormData:any={};
  getAllData:any[];
  dataNotFound: boolean = false;
  transationsNotFound: boolean = false;
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
      this.items = [ 'BROWSE', 'CREATE'];
      this.menuList = [
        {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
        {label: 'Delete', icon: 'fa fa-fw fa-trash'}
      ];

      this.Header.pushHeader({
        'Header' : ' Doctor Commission Calcutator',
        'Link' : ' Patient Management -> Master -> Clinic -> Doctor Commission Calcutator'
      });

      this.currentYear = new Date().getFullYear();
      this.selectedYear = new Date().getFullYear();
      this.selectedMonth = new Date().getMonth() + 1;
      this.prevYear = this.currentYear - 1;
      this.nextYear = this.currentYear + 1;           

      this.months = [
        {
          "abbreviation": "Jan",
          "code": 1,
          "name": "January"
        },
        {
          "abbreviation": "Feb",
          "code": 2,
          "name": "February"
        },
        {
          "abbreviation": "Mar",
          "code": 3,
          "name": "March"
        },
        {
          "abbreviation": "Apr",
          "code": 4,
          "name": "April"
        },
        {
          "abbreviation": "May",
          "code": 5,
          "name": "May"
        },
        {
          "abbreviation": "Jun",
          "code": 6,
          "name": "June"
        },
        {
          "abbreviation": "Jul",
          "code": 7,
          "name": "July"
        },
        {
          "abbreviation": "Aug",
          "code": 8,
          "name": "August"
        },
        {
          "abbreviation": "Sep",
          "code": 9,
          "name": "September"
        },
        {
          "abbreviation": "Oct",
          "code": 10,
          "name": "October"
        },
        {
          "abbreviation": "Nov",
          "code": 11,
          "name": "November"
        },
        {
          "abbreviation": "Dec",
          "code": 12,
          "name": "December"
        }
      ];

    this.years = [
      {name: this.prevYear, value: this.prevYear},
      {name: this.currentYear, value: this.currentYear},
      {name: this.nextYear, value: this.nextYear}   
    ];
    this.searchFormData.month = this.selectedMonth;
    this.searchFormData.year = this.currentYear;
    this.formData.month = this.selectedMonth;
    this.formData.year = this.currentYear;
    this.searchFormData.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.formData.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;

    this.constCenter();
    this.showEligibleDoctor();
  }
  monthChanged(){
    console.log('1111111')   
  }

  constCenter() {
    this.$http.get('/GHC_Inward_Outward_Register/Get_Branch')
    .subscribe((data: any) => {
        this.costCenterList = data ? JSON.parse(data) : [];  
        this.costCenterList.forEach((val, index)=>{
            this.costCenterList[index].label = val.Cost_Cen_Name;
            this.costCenterList[index].value = val.Cost_Cen_ID;
        });
       // console.log('this.costCenterList =', this.costCenterList);
    });
  } 

filter(){
  this.dataNotFound = false;
  //console.log('this.searchFormData =', this.searchFormData);
  this.searchData = [];
  if(this.searchFormData.Cost_Cen_ID == null || this.searchFormData.Cost_Cen_ID == undefined){
      this.compacctToast.add({key: 'compacct-toast',
      severity: 'error',
      summary: 'Please select Cost Center',
      detail: 'Error Occured '});
  }else{
    this.$http.get('/GHC_Doctor_Commission_Calculator/Get_Browse?Month=' + this.searchFormData.month + '&Year=' + this.searchFormData.year + '&Cost_Cen_ID=' + this.searchFormData.Cost_Cen_ID)
    .subscribe((data: any) => {
         this.searchData = data ? JSON.parse(data) : [];
        console.log('this.searchData =', this.searchData);
        if(this.searchData.length > 0){
          this.dataNotFound = false;                          
        }else{
          this.dataNotFound = true;                  
        }    
    });
  } 
}

showEligibleDoctor() {
  this.eligibleDoctors = [];
  //console.log('this.formData =', this.formData);
  if(this.formData.Cost_Cen_ID == null || this.formData.Cost_Cen_ID == undefined){
      this.compacctToast.add({key: 'compacct-toast',
      severity: 'error',
      summary: 'Please select Cost Center',
      detail: 'Error Occured '});
  }else{
    this.$http.get('/GHC_Doctor_Commission_Calculator/Get_Eligible_Doctor_List?Report_Name=Doctor List&Month=' + this.formData.month + '&Year=' + this.formData.year + '&Cost_Cen_ID='+ this.formData.Cost_Cen_ID +'&Doc_ID=0')
    .subscribe((data: any) => {
        this.eligibleDoctors = data ? JSON.parse(data) : [];           
        this.eligibleDoctors.forEach((val, index)=>{
            this.eligibleDoctors[index].label = val.Name;
            this.eligibleDoctors[index].value = val.Doctor_ID;
        }); 
        //console.log('this.eligibleDoctors =', this.eligibleDoctors);
    });  
  } 
}

showTransactions(){
  this.transactions = [];
  this.transationsNotFound = false; 

  if(this.formData.Doctor_ID == null || this.formData.Doctor_ID == undefined){
    this.compacctToast.add({key: 'compacct-toast',
    severity: 'error',
    summary: 'Please select Doctor',
    detail: 'Error Occured '});
}else{
   this.$http.get('/GHC_Doctor_Commission_Calculator/Get_Doctor_Commission?Report_Name=Doctor Commission&Month=' + this.formData.month + '&Year=' + this.formData.year + '&Cost_Cen_ID='+ this.formData.Cost_Cen_ID +'&Doc_ID=' + this.formData.Doctor_ID )
    .subscribe((data: any) => {
        this.transactions = data ? JSON.parse(data) : [];           
        console.log('this.transactions =', this.transactions);
        if(this.transactions.length > 0){
          this.totalAmount = 0;
          this.transationsNotFound = false;
          this.transactions.forEach((val, index)=>{
              this.totalAmount = this.totalAmount + val.Commission_Amount;
          })
          //console.log('this.total_amount =', this.totalAmount);
        }else{
          this.transationsNotFound = true;                  
        }    
    }); 
  }
}
modelChanged(newObj) {  
  this.totalAmount = 0;
  this.transactions.forEach((val, index)=>{
    this.totalAmount = this.totalAmount + val.Commission_Amount;
  })
}
onFormSubmit(){  
  if(this.transactions !=null && this.transactions.length > 0){
    console.log('Add this.transactions =', this.transactions);

    const UrlAddress = '/GHC_Doctor_Commission_Calculator/CREATE_EDIT_GHC_Doctor_Commission';
    const obj = { 
      'GHC_Doctor_Commission_String': JSON.stringify(this.transactions)
    };    
   
    this.$http.post(UrlAddress, obj)
    .subscribe((res: any) => {
        console.log('Add res =', res);
        if (res.success) {                                         
                this.compacctToast.clear();
                this.compacctToast.add({key: 'compacct-toast',
                                  severity: 'success',
                                  summary: 'Doctor Commission Calcutator Saved'  ,
                                  detail: 'Succesfully Saved'});
                this.Spinner = false;   
                this.filter();             
               // this.clearData();                            
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
 edit(Doctor_ID) {
  this.tabIndexToView = 1;
  this.items = ['BROWSE', 'UPDATE'];
  this.buttonname = 'Update';    
      this.$http.get('/GHC_Doctor_Commission_Calculator/Get_Edit_Data?Month=' + this.searchFormData.month + '&Year=' + this.searchFormData.year + '&Cost_Cen_ID=' + this.searchFormData.Cost_Cen_ID + '&Doctor_ID=' + Doctor_ID)
      .subscribe((data: any) => {
          this.getAllData = data ? JSON.parse(data) : [];
          console.log('Edit getAllData =>>', this.getAllData);
          if(this.getAllData.length > 0 ){            
            this.formData.month = this.getAllData[0].Month_Name;
            this.formData.year = this.getAllData[0].Year_Name;
            this.formData.Cost_Cen_ID = this.getAllData[0].Cost_Cen_ID;
            this.formData.Doctor_ID = this.getAllData[0].Doctor_ID;
            // this.showTransactions();
            this.transactions = this.getAllData;
            if(this.transactions.length > 0){
              this.totalAmount = 0;
             // this.transationsNotFound = false;
              this.transactions.forEach((val, index)=>{
                  this.totalAmount = this.totalAmount + val.Commission_Amount;
              })
              //console.log('this.total_amount =', this.totalAmount);
            }  
          }
      });  
  }

  // Delete
  /* deleteBagProcess (data) {
    if (data.Cons_ID) {
      this.Cons_ID = data.Cons_ID;
      this.Entry_ID = data.Entry_ID;
      this.compacctToast.clear();
      this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});
    }
  }
  onConfirm() {
    if (this.ConsultancyID) {
      const obj ={
        'Cons_ID' : this.Cons_ID,
        'Entry_ID' : this.Entry_ID
      };

      this.$http.post('/BL_CRM_Master_Consultancy_V2/Delete', obj)
      .subscribe((data: any) => {
          if (data.success === true) {
              this.onReject();
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                 severity: 'success',
                                 detail: 'Succesfully Deleted'});                               
            }
      });
    }
  }
  onReject() {
    this.compacctToast.clear('c');
  } */

   // PDF
  getPrint(Doctor_ID) {
     console.log(this.searchFormData.Cost_Cen_ID)
     console.log(this.searchFormData.year)
     console.log(this.searchFormData.month)
     console.log(this.searchFormData.Cost_Cen_ID)
      window.open('/Report/Crystal_Files/Doctor_Commission/Doctor_Commission_Print.aspx?Month_Name='+this.searchFormData.month+'&Year_Name='+this.searchFormData.year+'&Cost_Cen_ID='+this.searchFormData.Cost_Cen_ID+'&Doctor_ID=' + Doctor_ID,
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
      this.dataNotFound = false;
      this.transactions = [];
      this.transationsNotFound = false;
      this.formData.Doctor_ID = null;
      this.getAllData = [];      
      this.totalAmount = 0;
    }
}

