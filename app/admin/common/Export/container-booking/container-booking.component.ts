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
  selector: 'app-container-booking',
  templateUrl: './container-booking.component.html',
  styleUrls: ['./container-booking.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class ContainerBookingComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  items = [];
  //createQCFormSubmitted = false;
  AllContainerBookingList = [];
  MaterialSubTypeList = [];
  ContainerBookingID: number;
  ContainerPickupID: number;
  cols = [];
  menuList = [];
  componentDisplay = false;
  ObjSearchStock: any= {};
  searchContainerBookingList = [];

    // Booking
  objContainerBooking: ContainerBooking = new ContainerBooking();
  bookingForm: FormGroup;
  bookingFormSubmitted = false;
  BookingDate = new Date();
  ExpectedDate = new Date();
  InvoiceList:any[] =[];
  tranpoterList:any[] =[];
  containerPickupList:any[] = [];
  pickupObj:any[] =[];
  loadingDate ={};
  unloadingDate ={};
  customDate ={};

  // pickup
  objContainerPickup: ContainerPickup = new ContainerPickup();
  pickupForm: FormGroup;
  pickupFormSubmitted = false;
  PickupDate = new Date();
  loading_timestamp:any;
  pickup_timestamp:any;
  unloading_timestamp:any;
  custom_timestamp:any;
  dateMsg:string = '';

  constructor(
    private $http: HttpClient ,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader ,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private $CompacctAPI: CompacctCommonApi,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.items = [ 'BROWSE', 'CREATE', 'PICKUP DETAILS'];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];
    this.Header.pushHeader({'Header' : 'Container Booking & Pickup',
                            'Link' : ' Material Management -> Master -> Master Cost Center'});

    this.bookingForm = this.fb.group({
      Com_Inv_No: ['', Validators.required],
      Booking_Date: [''],
      Sub_Ledger_ID: ['', Validators.required],
      Destination: ['', Validators.required],
      Expected_Date: [''],
      Rate: ['', Validators.required],
      Qty: ['', Validators.required],
      Amount: ['', Validators.required],
    });

    this.pickupForm = this.fb.group({
      Sub_Ledger_ID: ['', Validators.required],
      Container_No: ['', Validators.required],
      Pickup_Date: [''],
    });

    this.getInvoice();
  }
  getDateRange (dateRangeObj) {
    if (dateRangeObj.length) {
        this.ObjSearchStock.from_date = dateRangeObj[0];
        this.ObjSearchStock.to_date = dateRangeObj[1];
    }
  }
searchContainerBooking (valid) {
    this.Spinner = true;
    const start =  this.ObjSearchStock.from_date ?
          this.DateService.dateConvert(new Date(this.ObjSearchStock.from_date)) : this.DateService.dateConvert(new Date);
    const end =  this.ObjSearchStock.to_date ?
          this.DateService.dateConvert(new Date(this.ObjSearchStock.to_date)) : this.DateService.dateConvert(new Date);
    const obj = new HttpParams()
    .set('from_date', start)
    .set('to_date', end);

    this.$http.get('/Container_Booking/Get_Browse', {params : obj})
    .subscribe((data: any) => {
      this.searchContainerBookingList =  data.length ? JSON.parse(data) : [];
      this.Spinner = false;
      console.log('this.searchContainerBookingList =', this.searchContainerBookingList);
    });
}

getInvoice() {
  this.$http.get('/Export_Transportation/Get_Comm_Invoice_No')
  .subscribe((data: any) => {
      this.InvoiceList = data ? JSON.parse(data) : [];
      //console.log('this.InvoiceList =', this.InvoiceList);
      this.InvoiceList.forEach((val, index)=>{
        this.InvoiceList[index].label = val.Com_Inv_No;
        this.InvoiceList[index].value = val.Com_Inv_No;
     });
  });

  this.$http.get('/Common/Get_Subledger_SC')
  .subscribe((data: any) => {
      this.tranpoterList = data ? JSON.parse(data) : [];
      //console.log('this.tranpoterList =', this.tranpoterList);
      if(this.tranpoterList.length > 0){
           this.tranpoterList.forEach((val, index)=>{
              this.tranpoterList[index].label = val.Sub_Ledger_Name;
              this.tranpoterList[index].value = val.Sub_Ledger_ID;
          });
      }
  });
}
getBookingDate (BookingDate) {
  if (BookingDate) {
      this.objContainerBooking.Booking_Date = this.DateService.dateConvert(moment(BookingDate, 'YYYY-MM-DD')['_d']);
    }
}
getExpectedDate (ExpectedDate) {
  if (ExpectedDate) {
      this.objContainerBooking.Expected_Date = this.DateService.dateConvert(moment(ExpectedDate, 'YYYY-MM-DD')['_d']);
    }
}

amountCal(){
  if(this.objContainerBooking.Rate !== 0 || this.objContainerBooking.Rate !== undefined){
    this.objContainerBooking.Amount = this.objContainerBooking.Rate * this.objContainerBooking.Qty;
  }
}
getSubLedgerName(Sub_Ledger_ID){
  this.tranpoterList.forEach((value, index)=>{
    if(value.Sub_Ledger_ID === Sub_Ledger_ID){
        this.objContainerBooking.Sub_Ledger_Name  = value.Sub_Ledger_Name;
        return;
    }
  });
}
  get f() {
    return this.bookingForm.controls;
}

  // Save
  SaveContainerBookingMaster () {
    this.bookingFormSubmitted = true;

    if (this.bookingForm.invalid) {
      return;
    }else{

        this.Spinner = true;
        const UrlAddress = '/Container_Booking/Insert_Edit_Container_Booking';
        const obj = { 'Exp_Container_Booking': JSON.stringify([this.objContainerBooking]) };
        this.$http.post(UrlAddress, obj ).subscribe((data: any) => {

            if (data.success) {
              if (this.objContainerBooking.Exp_Container_Book_ID !== 0) {
                this.componentDisplay = true;
                this.compacctToast.clear();
                this.compacctToast.add({key: 'compacct-toast',
                                  severity: 'success',
                                  summary: 'Container Booking Updated',
                                  detail: 'Succesfully Updated'});
                                  this.searchContainerBooking (true);
              } else {
                this.componentDisplay = true;
                this.compacctToast.clear();
                this.compacctToast.add({key: 'compacct-toast',
                                  severity: 'success',
                                  summary: 'Container Booking Added'  ,
                                  detail: 'Succesfully Created'});
                                  this.searchContainerBooking (true);
                                 this.clearData();
              }
              this.Spinner = false;
            } else {
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                    severity: 'error',
                                    summary: 'Warn Message',
                                    detail: 'Error Occured '});
          }
        });
    }
  }
  // Edit
  EditContainerBooking (Exp_Container_Book_ID) {
      this.tabIndexToView = 1;
      this.items = [ 'BROWSE', 'CREATE', 'PICKUP DETAILS'];
      this.buttonname = 'Update';

       this.$http.get('/Container_Booking/Get_All_Data?Exp_Container_Book_ID=' + Exp_Container_Book_ID)
        .subscribe((data: any) => {
            this.AllContainerBookingList = data ? JSON.parse(data) : [];
            if(this.AllContainerBookingList.length > 0){
                this.objContainerBooking = this.AllContainerBookingList[0];
                console.log('Edit objContainerBooking =>>', this.objContainerBooking);
                this.componentDisplay = true;
                this.BookingDate = moment(this.AllContainerBookingList[0].Booking_Date, 'YYYY-MM-DD')['_d'];
                this.objContainerBooking.Booking_Date = this.AllContainerBookingList[0].Booking_Date;
            }
        });
  }
/* ######################  Pickup  #################### */

createPickup(Exp_Container_Book_ID) {
  this.tabIndexToView = 2;
  this.buttonname = 'Create Pickup';
  this.objContainerPickup.Exp_Container_Book_ID = Exp_Container_Book_ID;

  this.PickupDate = new Date();
  this.objContainerPickup.Pickup_Date = this.DateService.dateConvert(moment(this.PickupDate, 'YYYY-MM-DD')['_d']);

  this.$http.get('/Container_Booking/Get_All_Data?Exp_Container_Book_ID=' + Exp_Container_Book_ID)
  .subscribe((data: any) => {
      this.AllContainerBookingList = data ? JSON.parse(data) : [];
      if(this.AllContainerBookingList.length > 0){
          this.objContainerBooking = this.AllContainerBookingList[0];
          //console.log('objContainerBooking 77 =>>', this.objContainerBooking);
      }
  });
  this.getContainerPickupData();
}
getPickupDate(PickupDate) {
  if (PickupDate) {
      this.objContainerPickup.Pickup_Date = this.DateService.dateConvert(moment(PickupDate, 'YYYY-MM-DD')['_d']);
  }
}
getPickupSubLedgerName(Sub_Ledger_ID){
  this.tranpoterList.forEach((value, index)=>{
    if(value.Sub_Ledger_ID === Sub_Ledger_ID){
        this.objContainerPickup.Sub_Ledger_Name  = value.Sub_Ledger_Name;
        return;
    }
  });
}

getContainerPickupData() {
  this.Spinner = true;
  this.$http.get('/Container_Booking/Get_All_Data_Container_PickUp?Exp_Container_Book_ID=' + this.objContainerPickup.Exp_Container_Book_ID )
  .subscribe((data: any) => {
    this.containerPickupList =  data.length ? JSON.parse(data) : [];
    this.Spinner = false;
    //console.log('this.containerPickupList =', this.containerPickupList);
    this.containerPickupList.forEach((val, index) =>{
        this.loadingDate[index] =  moment(val.Loading_Date).format('YYYY-MM-DD');
        this.unloadingDate[index] =  moment(val.Unloading_Date).format('YYYY-MM-DD');
        this.customDate[index] =  moment(val.Custom_Date).format('YYYY-MM-DD');
    })
  });
}

get f2() {
    return this.pickupForm.controls;
}

  // Save
 saveContainerPickupMaster () {
    this.pickupFormSubmitted = true;
    if (this.pickupForm.invalid) {
      return;
    }else{
      // console.log('this.objContainerPickup =', this.objContainerPickup);

        this.Spinner = true;
        const UrlAddress = '/Container_Booking/Insert_Edit_Container_PickUp';
        const obj = { 'Exp_Container_PickUp': JSON.stringify([this.objContainerPickup]) };
        this.$http.post(UrlAddress, obj ).subscribe((data: any) => {

            if (data.success) {
              if (this.objContainerPickup.Exp_Pick_Up_Container_ID !== 0) {
                this.componentDisplay = true;
                this.compacctToast.clear();
                this.compacctToast.add({key: 'compacct-toast',
                                  severity: 'success',
                                  summary: 'Pickup Details Updated',
                                  detail: 'Succesfully Updated'});
                                  this.getContainerPickupData();
                                  this.pickupFormSubmitted = false;
                                  this.objContainerPickup.Sub_Ledger_ID = undefined;
                                  this.objContainerPickup.Container_No = undefined;
              } else {
                this.componentDisplay = true;
                this.compacctToast.clear();
                this.compacctToast.add({key: 'compacct-toast',
                                  severity: 'success',
                                  summary: 'Pickup Details Added'  ,
                                  detail: 'Succesfully Created'});
                                  this.getContainerPickupData();
                                  this.pickupFormSubmitted = false;
                                  this.objContainerPickup.Sub_Ledger_ID = undefined;
                                  this.objContainerPickup.Container_No = undefined;
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

  updatePickupForLoadingDate(item, index){
    this.dateMsg = '';
    this.pickup_timestamp = new Date(moment(item.Pickup_Date).format('YYYY-MM-DD')).getTime();
    this.loading_timestamp = new Date(moment(this.loadingDate[index]).format('YYYY-MM-DD')).getTime();

    if(this.loading_timestamp >= this.pickup_timestamp){
         this.dateMsg = '';
        const obj ={
          Exp_Pick_Up_Container_ID: item.Exp_Pick_Up_Container_ID,
          Exp_Container_Book_ID: item.Exp_Container_Book_ID,
          Sub_Ledger_ID: item.Sub_Ledger_ID,
          Sub_Ledger_Name: item.Sub_Ledger_Name,
          Container_No: item.Container_No,
          Pickup_Date: item.Pickup_Date,
          Loading_Date: this.loadingDate[index],
          Unloading_Date: item.Unloading_Date,
          Custom_Date: item.Custom_Date,
        };
        //console.log('obj Final =', obj );
        this.updatePickup(obj);
    }else{
        this.dateMsg = 'Loading date must be greater than or equal to Pickup date.';
    }
  }

  updatePickupForUnloadingDate(item, index){
    this.dateMsg = '';
    this.loading_timestamp = new Date(moment(item.Loading_Date).format('YYYY-MM-DD')).getTime();
    this.unloading_timestamp = new Date(moment(this.unloadingDate[index]).format('YYYY-MM-DD')).getTime();

    if(this.unloading_timestamp >= this.loading_timestamp){
         this.dateMsg = '';
         const obj ={
          Exp_Pick_Up_Container_ID: item.Exp_Pick_Up_Container_ID,
          Exp_Container_Book_ID: item.Exp_Container_Book_ID,
          Sub_Ledger_ID: item.Sub_Ledger_ID,
          Sub_Ledger_Name: item.Sub_Ledger_Name,
          Container_No: item.Container_No,
          Pickup_Date: item.Pickup_Date,
          Loading_Date: item.Loading_Date,
          Unloading_Date: this.unloadingDate[index],
          Custom_Date: item.Custom_Date,
        };
        //console.log('obj Final =', obj );
        this.updatePickup(obj);
    }else{
        this.dateMsg = 'Unloading date must be greater than or equal to Loading date.';
    }
  }

  updatePickupForCustomDate(item, index){
    this.dateMsg = '';
    this.custom_timestamp = new Date(moment(this.customDate[index]).format('YYYY-MM-DD')).getTime();
    this.unloading_timestamp = new Date(moment(item.Unloading_Date).format('YYYY-MM-DD')).getTime();

    if(this.custom_timestamp >= this.unloading_timestamp){
         this.dateMsg = '';
         const obj ={
          Exp_Pick_Up_Container_ID: item.Exp_Pick_Up_Container_ID,
          Exp_Container_Book_ID: item.Exp_Container_Book_ID,
          Sub_Ledger_ID: item.Sub_Ledger_ID,
          Sub_Ledger_Name: item.Sub_Ledger_Name,
          Container_No: item.Container_No,
          Pickup_Date: item.Pickup_Date,
          Loading_Date: item.Loading_Date,
          Unloading_Date: item.Unloading_Date,
          Custom_Date: this.customDate[index]
        };
        //console.log('obj Final =', obj );
        this.updatePickup(obj);
    }else{
        this.dateMsg = 'Custom date must be greater than or equal to Unloading date.';
    }
  }

  updatePickup(obj){
    this.Spinner = true;
    const UrlAddress = '/Container_Booking/Insert_Edit_Container_PickUp';
    const obj2 = { 'Exp_Container_PickUp': JSON.stringify([obj]) };
    this.$http.post(UrlAddress, obj2 ).subscribe((data: any) => {

        if (data.success) {
            this.componentDisplay = true;
            this.compacctToast.clear();
            this.compacctToast.add({key: 'compacct-toast',
                              severity: 'success',
                              summary: 'Pickup Details Updated',
                              detail: 'Succesfully Updated'});
                              this.getContainerPickupData();

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

  // Delete booking
  DeleteContainerBooking (obj) {
    this.ContainerBookingID = undefined;
    if (obj.Exp_Container_Book_ID) {
      this.ContainerBookingID = obj.Exp_Container_Book_ID;
      this.compacctToast.clear();
      this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});
    }
  }
  onConfirm() {
     if (this.ContainerBookingID) {
       this.$http.post('/Container_Booking/Delete_Container_Booking', {'Exp_Container_Book_ID' : this.ContainerBookingID})
       .subscribe((data: any) => {
           if (data.success === true) {
               this.onReject();
               this.compacctToast.clear();
               this.compacctToast.add({key: 'compacct-toast',
                                  severity: 'success',
                                  //summary: 'Seed Process ID: ' + this.ContainerBookingID.toString(),
                                  detail: 'Succesfully Deleted'});
                                  this.searchContainerBooking (true);
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
                                   //summary: 'Seed Process ID: ' + this.ContainerBookingID.toString(),
                                   detail: 'Succesfully Deleted'});
                                   this.getContainerPickupData();
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
    this.items = [ 'BROWSE', 'CREATE', 'PICKUP DETAILS'];
    this.buttonname = 'Create';
   this.clearData();
  }
  clearData() {
      this.Spinner = false;
      this.bookingFormSubmitted = false;
      this.objContainerBooking = new ContainerBooking();
      this.pickupFormSubmitted = false;
      this.objContainerPickup = new ContainerPickup();

      if(this.tabIndexToView ==1){
          this.BookingDate = new Date();
          this.objContainerBooking.Booking_Date = this.DateService.dateConvert(moment(this.BookingDate, 'YYYY-MM-DD')['_d']);
          this.ExpectedDate = new Date();
          this.objContainerBooking.Expected_Date = this.DateService.dateConvert(moment(this.ExpectedDate, 'YYYY-MM-DD')['_d']);
      }
      if(this.tabIndexToView ==2){
        this.PickupDate = new Date();
        this.objContainerPickup.Pickup_Date = this.DateService.dateConvert(moment(this.PickupDate, 'YYYY-MM-DD')['_d']);
        console.log('this.objContainerPickup.Pickup_Date 11 =',  this.objContainerPickup.Pickup_Date);
      }
  }
}

class ContainerBooking {
    Exp_Container_Book_ID = 0;
    Com_Inv_No: string;
    Booking_Date: string;
    Sub_Ledger_ID: number;
    Sub_Ledger_Name	: string;
    Destination	: string;
    Expected_Date: string;
    Rate= 0;
    Qty	=0;
    Amount= 0;
}

class ContainerPickup {
  Exp_Pick_Up_Container_ID = 0;
  Exp_Container_Book_ID = 0;
  Sub_Ledger_ID: number;
  Sub_Ledger_Name	: string;
  Container_No: string;
  Pickup_Date: string;
}
