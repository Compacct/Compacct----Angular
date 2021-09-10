import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-renewal',
  templateUrl: './renewal.component.html',
  styleUrls: ['./renewal.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class RenewalComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  items = [];

  RenewalID: number;
  ContainerPickupID: number;
  cols = [];
  menuList = [];
  componentDisplay = false;
  ObjSearchStock: any= {};
  searchRenewalList = [];

  objRenewal: Renewal = new Renewal();
  contractFormSubmitted = false;
  IssueDate = new Date();
  ExpectedDate:any = new Date();
  //new
  displayRenewalModal:boolean = false;
  contractForm: FormGroup;
  submitted = false;
  updateData:any[];
  renewalList:any[];
  costCenterList:any[];
  allRenewals:any[];
  pendingRenewals:any[];
  expiredRenewals:any[];
  RenewalData = [];

  constructor(
    private $http: HttpClient ,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader ,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private $CompacctAPI: CompacctCommonApi,
    private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.items = [ 'ALL RENEWAL', 'PENDING RENEWAL', 'EXPIRED RENEWAL'];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];
    this.Header.pushHeader({'Header' : 'Renewal',
                            'Link' : 'Renewal -> Renewal'});

    this.contractForm = this.fb.group({
      Renewal_ID: ['', Validators.required],
      Cost_Cent_ID: ['', Validators.required],
      Issue_Date: [''],
      Period_Months: ['', [Validators.required, this.ValidateZero]],
      Exp_Date: [''],
      Old_Amount: ['', Validators.required],
      New_Amount: ['', [Validators.required, this.ValidateZero]],
      Remarks: [''],
    });

    this.getRenewal();
    this.getAllRenewal();
  }
  getDateRange (dateRangeObj) {
    if (dateRangeObj.length) {
        this.ObjSearchStock.from_date = dateRangeObj[0];
        this.ObjSearchStock.to_date = dateRangeObj[1];
    }
  }

  ValidateZero(control: AbstractControl) {
    if (control.value === 0) {
     return { validZero: true };
    }
    return null;
  }
searchRenewal (valid) {
   /*  this.Spinner = true;
    const start =  this.ObjSearchStock.from_date ?
          this.DateService.dateConvert(new Date(this.ObjSearchStock.from_date)) : this.DateService.dateConvert(new Date);
    const end =  this.ObjSearchStock.to_date ?
          this.DateService.dateConvert(new Date(this.ObjSearchStock.to_date)) : this.DateService.dateConvert(new Date);
    const obj = new HttpParams()
    .set('from_date', start)
    .set('to_date', end);

    this.$http.get('/Container_Booking/Get_ALL RENEWAL', {params : obj})
    .subscribe((data: any) => {
      this.searchRenewalList =  data.length ? JSON.parse(data) : [];
      this.Spinner = false;
      console.log('this.searchRenewalList =', this.searchRenewalList);
    });  */
}

getAllRenewal(){
  this.$http.get('/Renewal/Get_All_Renewals')
    .subscribe((data: any) => {
        this.allRenewals = data ? JSON.parse(data) : [];
       console.log('this.allRenewals =', this.allRenewals);
    });

    this.$http.get('/Renewal/Get_Pending_Renewals')
    .subscribe((data: any) => {
        this.pendingRenewals = data ? JSON.parse(data) : [];
       console.log('this.pendingRenewals =', this.pendingRenewals);
    });

    this.$http.get('/Renewal/Get_Expired_Renewals')
    .subscribe((data: any) => {
        this.expiredRenewals = data ? JSON.parse(data) : [];
       console.log('this.expiredRenewals =', this.expiredRenewals);
    });
}

getRenewal() {
   this.$http.get('/Renewal/Get_Renewals_Details')
  .subscribe((data: any) => {
      this.renewalList = data ? JSON.parse(data) : [];
      //console.log('this.InvoiceList =', this.InvoiceList);
      this.renewalList.forEach((val, index)=>{
        this.renewalList[index].label = val.Renewal_Type;
        this.renewalList[index].value = val.Renewal_ID;
     });
     console.log('this.renewalList =', this.renewalList);
  });
}

getCostCenter(Renewal_ID){
  this.renewalList.forEach((value, index)=>{
    if(value.Renewal_ID === Renewal_ID){
        this.objRenewal.Renewal_Type  = value.Renewal_Type;
        return;
    }
  });

  this.$http.get('/Renewal/Get_Cost_Cen_Details_And_Amount?Renewal_ID=' + Renewal_ID)
  .subscribe((data: any) => {
      this.costCenterList = data ? JSON.parse(data) : [];
      //console.log('this.InvoiceList =', this.InvoiceList);
      this.costCenterList.forEach((val, index)=>{
        this.costCenterList[index].label = val.Cost_Cen_Name;
        this.costCenterList[index].value = val.Cost_Cent_ID;
     });
     console.log('this.costCenterList =', this.costCenterList);
  });
}
getAmount(Cost_Cent_ID){
  this.costCenterList.forEach((value, index)=>{
    if(value.Cost_Cent_ID === Cost_Cent_ID){
        this.objRenewal.Old_Amount  = value.Old_Amount;
        this.objRenewal.New_Amount  = value.Old_Amount;
        return;
    }
  });
}
getExpDate(){
    if(this.objRenewal.Period_Months !== undefined ){
        const issue_timee = new Date(moment(this.objRenewal.Issue_Date).format('YYYY-MM-DD')).getTime();
        //console.log('issue_timee =', issue_timee);
        // 1 month = 2628000000 milisec
        const month_miliSec =  this.objRenewal.Period_Months * 2628000000;
        const total_miliSec = issue_timee + month_miliSec;
        this.ExpectedDate = moment(total_miliSec).format('YYYY-MM-DD');
        this.objRenewal.Exp_Date = moment(total_miliSec).format('YYYY-MM-DD');
       // console.log('this.ExpectedDate =', this.ExpectedDate);
    }
}

getIssueDate (IssueDate) {
  if (IssueDate) {
      this.objRenewal.Issue_Date = this.DateService.dateConvert(moment(IssueDate, 'YYYY-MM-DD')['_d']);
    }
}
getExpectedDate (ExpectedDate) {
  if (ExpectedDate) {
      this.objRenewal.Exp_Date = this.DateService.dateConvert(moment(ExpectedDate, 'YYYY-MM-DD')['_d']);
    }
}
newRenewal(){
 // this.buttonname = 'Create';
  this.displayRenewalModal = true;
}
cancelRenewal(){
    this.displayRenewalModal = false;
    this.clearData();
}
get f() {
    return this.contractForm.controls;
}

  // Save
 addRenewal() {
    this.submitted = true;

    if (this.contractForm.invalid) {
        return;
    }else{
      console.log('this.objRenewal  =', this.objRenewal);

      this.Spinner = true;
      const UrlAddress = '/Renewal/Create_Edit_Renewal';
      const obj = { 'Renewal_String': JSON.stringify([this.objRenewal]) };
      this.$http.post(UrlAddress, obj )
      .subscribe((data: any) => {

        if (data.success) {
          if (this.objRenewal.Renewal_Txn_ID !== 0) {
            this.componentDisplay = true;
            this.compacctToast.clear();
            this.compacctToast.add({key: 'compacct-toast',
                              severity: 'success',
                              summary: 'Renewal Updated',
                              detail: 'Succesfully Updated'});
                              this.displayRenewalModal = false;
                              this.getAllRenewal();

          } else {
            this.componentDisplay = true;
            this.compacctToast.clear();
            this.compacctToast.add({key: 'compacct-toast',
                              severity: 'success',
                              summary: 'Renewal Added'  ,
                              detail: 'Succesfully Created'});
                              this.displayRenewalModal = false;
                              this.getAllRenewal();
          }
          this.Spinner = false;
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
  Renewal(Renewal_ID) {
      this.tabIndexToView = 0;
      // this.items = [ 'ALL RENEWAL', 'UPDATE', 'EXPIRED RENEWAL'];
      // this.buttonname = 'Update';

        this.$http.get('/Renewal/Get_Cost_Cen_Details_And_Amount?Renewal_ID=' + Renewal_ID)
        .subscribe((data: any) => {
            this.RenewalData = data ? JSON.parse(data) : [];
            console.log('Renewal RenewalData 88 =>>', this.RenewalData);
            if(this.RenewalData.length > 0){
              //  this.objRenewal = this.RenewalData[0];
              this.objRenewal.Renewal_ID = Renewal_ID;
              this.objRenewal.Cost_Cent_ID = this.RenewalData[0].Cost_Cent_ID;
              this.objRenewal.Old_Amount = this.RenewalData[0].Old_Amount;

              this.getCostCenter(this.objRenewal.Renewal_ID);
              this.newRenewal();
              //   console.log('Edit objRenewal =>>', this.objRenewal);
              //   this.IssueDate = moment(this.RenewalData[0].Issue_Date, 'YYYY-MM-DD')['_d'];
              //   this.objRenewal.Issue_Date = this.RenewalData[0].Issue_Date;
              //   this.getExpDate();
            }
        });
  }

  // Delete booking
  DeleteRenewal (obj) {
    this.RenewalID = undefined;
    if (obj.Exp_Container_Book_ID) {
      this.RenewalID = obj.Exp_Container_Book_ID;
      this.compacctToast.clear();
      this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});
    }
  }
  onConfirm() {
     if (this.RenewalID) {
       this.$http.post('/Container_Booking/Delete_Container_Booking', {'Exp_Container_Book_ID' : this.RenewalID})
       .subscribe((data: any) => {
           if (data.success === true) {
               this.onReject();
               this.compacctToast.clear();
               this.compacctToast.add({key: 'compacct-toast',
                                  severity: 'success',
                                  //summary: 'Seed Process ID: ' + this.RenewalID.toString(),
                                  detail: 'Succesfully Deleted'});
                                  this.searchRenewal (true);
             }
       });
     }
   }
   onReject() {
     this.compacctToast.clear('c');
   }

   // Delete Pickup
   DeleteContainerPickup(obj) {
     this.ContainerPickupID = undefined;
     if (obj.Exp_Pick_Up_Container_ID) {
       this.ContainerPickupID = obj.Exp_Pick_Up_Container_ID;
       this.compacctToast.clear();
       this.compacctToast.add({key: 'c2', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});
     }
   }
   onConfirm2() {
      if (this.ContainerPickupID) {
        this.$http.post('/Container_Booking/Delete_Container_Pickup', {'Exp_Pick_Up_Container_ID' : this.ContainerPickupID})
        .subscribe((data: any) => {
            if (data.success === true) {
                this.onReject();
                this.compacctToast.clear();
                this.compacctToast.add({key: 'compacct-toast',
                                   severity: 'success',
                                   //summary: 'Seed Process ID: ' + this.RenewalID.toString(),
                                   detail: 'Succesfully Deleted'});
              }
        });
      }
    }
    onReject2() {
      this.compacctToast.clear('c2');
    }

  // PDF
  GetPDF (obj) {
    if (obj.Seed_Process_Doc_No) {
      window.open('/Report/Crystal_Files/PRODUCTION/Purchase/Seed_Process_PrintOut.aspx?Seed_Process_Doc_No=' + obj.Seed_Process_Doc_No,
       'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }

  // Clear & Tab
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = [ 'ALL RENEWAL', 'PENDING RENEWAL', 'EXPIRED RENEWAL'];
    this.buttonname = 'Create';
   this.clearData();
  }
  clearData() {
      this.Spinner = false;
      this.objRenewal = new Renewal();
      this.submitted = false;
      this.IssueDate = new Date();
      this.objRenewal.Issue_Date = this.DateService.dateConvert(moment(this.IssueDate, 'YYYY-MM-DD')['_d']);
      this.ExpectedDate = new Date();
      this.objRenewal.Exp_Date = this.DateService.dateConvert(moment(this.ExpectedDate, 'YYYY-MM-DD')['_d']);
  }
}

class Renewal {
    Renewal_Txn_ID = 0;
    Renewal_ID:number;
    Renewal_Type: string;
    Cost_Cent_ID:number;
    Issue_Date: string;
    Period_Months: number;
    Exp_Date: string;
    Old_Amount = 0;
    New_Amount =0;
    Used = 'N';
    Remarks:string;
}

