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
import { FileUpload } from 'primeng/primeng';

@Component({
  selector: 'app-currency-booking',
  templateUrl: './currency-booking.component.html',
  styleUrls: ['./currency-booking.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})


export class CurrencyBookingComponent implements OnInit {

  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  items = [];
  cols = [];
  menuList = [];
  componentDisplay = false;
  ObjSearchStock: any= {};
  searchBagProcessList = [];

  objCurrencyBooking: CurrencyBooking = new CurrencyBooking();
  contractForm: FormGroup;
  submitted = false;
  BookingDate = new Date();
  // PeriodFromDate = new Date();
  // PeriodToDate = new Date();
  PeriodFromDate : string ='';
  PeriodToDate : string= '';
  contractList: any[]= [];
  currencyBookingID:string;
  currencyList:any[] =[];
  Contract_No	:string;
  Contract_Date	: string;
  Sub_Ledger_Name	: string;
  getAllData:any[]=[];

  //image upload
  @ViewChild('fileInput' , { static: false}) fileInput: FileUpload;
  PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink = undefined;
  ProductPDFFile = {};

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
        'Header' : 'Currency Booking',
        'Link' : ' Export Management -> Doc -> Currency Booking'
      });
    this.contractForm = this.fb.group({
      Sub_Ledger_ID: ['', Validators.required],
      Booking_Date: [''],
      Booking_Amount: ['', [Validators.required, this.ValidateZero]],
      Currency: ['', Validators.required],
      Rate: ['', [Validators.required, this.ValidateZero]],
      Amount: ['', [Validators.required, this.ValidateZero]],
      Period_From: ['', Validators.required],
      Period_To: ['', Validators.required],
      Bank_Ref_No: ['', Validators.required],
  }, {
    validator: this.periodValidation('Period_From', 'Period_To')
});

    this.getContracts();
    this.getCurrency();
  }

  getDateRange (dateRangeObj) {
    if (dateRangeObj.length) {
    this.ObjSearchStock.from_date = dateRangeObj[0];
    this.ObjSearchStock.to_date = dateRangeObj[1];
    }
  }
searchBagProcess (valid) {
    this.Spinner = true;
    const start =  this.ObjSearchStock.from_date ?
          this.DateService.dateConvert(new Date(this.ObjSearchStock.from_date)) : this.DateService.dateConvert(new Date);
    const end =  this.ObjSearchStock.to_date ?
          this.DateService.dateConvert(new Date(this.ObjSearchStock.to_date)) : this.DateService.dateConvert(new Date);

    const obj = new HttpParams()
    .set('from_date', start)
    .set('to_date', end);

    this.$http.get('/Currency_Booking/Get_Browse', {params : obj})
    .subscribe((data: any) => {
      this.searchBagProcessList =  data.length ? JSON.parse(data) : [];
      this.Spinner = false;
      console.log('this.searchBagProcessList =', this.searchBagProcessList );
    });
}

getContracts() {
  this.$http.get('/Currency_Booking/Get_Sales_Contract_Details')
  .subscribe((data: any) => {
       this.contractList = data ? JSON.parse(data) : [];

       this.contractList.forEach((val, index)=>{
        this.contractList[index].label = val.Contract_No;
        this.contractList[index].value = val.Sub_Ledger_ID;
      });
      console.log('this.contractList =', this.contractList);
  });
}
getCurrency() {
 this.$http.get('/Currency_Booking/Get_Currency_Details')
  .subscribe((data: any) => {
       this.currencyList = data ? JSON.parse(data) : [];
       //console.log('currencyList =', this.currencyList);
  });
}

getContractDetails(Sub_Ledger_ID){
  this.contractList.forEach((value, index)=>{
      if(value.Sub_Ledger_ID === Sub_Ledger_ID){
          this.objCurrencyBooking.Contract_No  = value.Contract_No;
          this.objCurrencyBooking.Contract_Date  = value.Contract_Date;
          this.objCurrencyBooking.Sub_Ledger_Name  = value.Sub_Ledger_Name;
          return;
      }
  });
  console.log('this.contractList 22 =', this.contractList);
}

/* ###############  VCalidation ############### */
// https://alligator.io/angular/reactive-forms-custom-validator/

ValidateZero(control: AbstractControl) {
  // alert('value =' + control.value);
  if (control.value === 0) {
   return { validZero: true };
  }
  return null;
}
//https://jasonwatmore.com/post/2019/06/14/angular-8-reactive-forms-validation-example

periodValidation(period_from: string, period_to: string) {
  return (formGroup: FormGroup) => {
      //console.log('formGroup =', formGroup);
        const periodFrom = formGroup.controls[period_from];
        const periodTo = formGroup.controls[period_to];

        if (periodTo.errors && !periodTo.errors.validPeriod) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

      // set error on matchingControl if validation fails
      // if (periodFrom.value !== periodTo.value) {
      //   periodTo.setErrors({ validPeriod: true });
      // } else {
      //   periodTo.setErrors(null);
      // }

        const period_from_timestamp = new Date(moment(periodFrom.value).format('YYYY-MM-DD')).getTime();
        const period_to_timestamp = new Date(moment(periodTo.value).format('YYYY-MM-DD')).getTime();

        // console.log('period_from_timestamp =', period_from_timestamp);
        // console.log('period_to_timestamp =', period_to_timestamp);

        if(period_from_timestamp > period_to_timestamp){
          periodTo.setErrors({ validPeriod: true });
        } else {
          periodTo.setErrors(null);
        }
  };
}

getBookingDate(date) {
    if (date) {
        this.objCurrencyBooking.Booking_Date = this.DateService.dateConvert(moment(date, 'YYYY-MM-DD')['_d']);
      }
}
getPeriodFromDate(date) {
  if (date) {
      this.objCurrencyBooking.Period_From = this.DateService.dateConvert(moment(date, 'YYYY-MM-DD')['_d']);
    }
}
getPeriodToDate(date) {
  if (date) {
      this.objCurrencyBooking.Period_To = this.DateService.dateConvert(moment(date, 'YYYY-MM-DD')['_d']);
    }
}
// File Upload
FetchPDFFile (event) {
  this.PDFFlag = false;
  this.ProductPDFFile = {};
  if (event) {
    this.ProductPDFFile = event.files[0];
    this.PDFFlag = true;
  }
}

imageUploader (fileData, Currency_Booking_ID) {
  const endpoint = '/Currency_Booking/Upload_Pic?Currency_Booking_ID=' + Currency_Booking_ID;
  const formData: FormData = new FormData();
  formData.append('aFile', fileData);
  this.$http
    .post(endpoint, formData)
    .subscribe((data) => {
     // console.log('Upload Image =',data);
    });
}

get f() {
    return this.contractForm.controls;
}
  // Save
saveMaster() {
   this.submitted = true;
   if (this.contractForm.invalid) {
       return;
   }else{
     console.log('this.objCurrencyBooking =', this.objCurrencyBooking);

     this.Spinner = true;
     const UrlAddress = '/Currency_Booking/Insert_Edit_Currency_Booking';
     const obj = { 'Currency_Booking': JSON.stringify([this.objCurrencyBooking]) };
     this.$http.post(UrlAddress, obj )
     .subscribe((data: any) => {
        const Currency_Booking_ID = data.Doc_No;

        if (data.success) {
            if (this.PDFFlag) {
              this.imageUploader(this.ProductPDFFile, Currency_Booking_ID);
            }
           if (this.objCurrencyBooking.Currency_Booking_ID !== 0) {
             this.componentDisplay = true;
             this.compacctToast.clear();
             this.compacctToast.add({key: 'compacct-toast',
                               severity: 'success',
                               summary: 'Currency Booking Updated',
                               detail: 'Succesfully Updated'});
                               this.searchBagProcess(true);

           } else {
             this.componentDisplay = true;
             this.compacctToast.clear();
             this.compacctToast.add({key: 'compacct-toast',
                               severity: 'success',
                               summary: 'Currency Booking Added'  ,
                               detail: 'Succesfully Created'});
                               this.searchBagProcess(true);
           }
           this.Spinner = false;
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
  editProcess(Currency_Booking_ID) {
      this.ProductPDFLink = undefined;
      this.objCurrencyBooking.Bank_Doc_File = undefined;
      this.tabIndexToView = 1;
      this.items = ['BROWSE', 'UPDATE'];
      this.buttonname = 'Update';

      this.$http.get('/Currency_Booking/Get_All_Data?Currency_Booking_ID=' + Currency_Booking_ID)
      .subscribe((data: any) => {
          this.getAllData = data ? JSON.parse(data) : [];
        console.log('Edit getAllData =>>', this.getAllData);

        if(this.getAllData.length > 0 ){
          this.objCurrencyBooking = this.getAllData[0];
          this.BookingDate = moment(this.objCurrencyBooking.Booking_Date, 'YYYY-MM-DD')['_d'];
          this.PeriodFromDate = moment(this.objCurrencyBooking.Period_From, 'YYYY-MM-DD')['_d'];
          this.PeriodToDate = moment(this.objCurrencyBooking.Period_To, 'YYYY-MM-DD')['_d'];
          this.PDFViewFlag = this.objCurrencyBooking.Bank_Doc_File ? true : false;
          //this.ProductPDFLink =  this.objCurrencyBooking.Bank_Doc_File ? this.objCurrencyBooking.Bank_Doc_File : undefined;
          this.ProductPDFLink =  this.objCurrencyBooking.Bank_Doc_File;
          //console.log('this.ProductPDFLink =', this.ProductPDFLink);
          console.log(' this.objCurrencyBooking Edit 88 =', this.objCurrencyBooking);
        }
      });
  }

  // Delete
  deleteBagProcess (BagProcess) {
    if (BagProcess.Currency_Booking_ID) {
      this.currencyBookingID = BagProcess.Currency_Booking_ID;
      this.compacctToast.clear();
      this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});
    }
  }
  onConfirm() {
    if (this.currencyBookingID) {
      this.$http.post('/Currency_Booking/Delete_Currency_Booking', {'Currency_Booking_ID' : this.currencyBookingID})
      .subscribe((data: any) => {
          if (data.success === true) {
              this.onReject();
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                 severity: 'success',
                                 detail: 'Succesfully Deleted'});
                                 this.searchBagProcess(true);
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
      this.objCurrencyBooking = new CurrencyBooking();
      this.submitted = false;
      this.PeriodFromDate = '';
      this.PeriodToDate = '';
      this.objCurrencyBooking.Period_From = undefined;
      this.objCurrencyBooking.Period_To = undefined;
      this.getAllData = [];
      this.PDFViewFlag = false;
      this.ProductPDFLink = undefined;
      if ( this.PDFViewFlag === false) {
        this.fileInput.clear();
      }
     // this.PDFViewFlag = false;
      if(this.tabIndexToView ==1){
        this.BookingDate = new Date();
        this.objCurrencyBooking.Booking_Date = this.DateService.dateConvert(moment(this.BookingDate, 'YYYY-MM-DD')['_d']);
      }
    }
}

class CurrencyBooking {
  Currency_Booking_ID	= 0;
  Contract_No: string;
  Contract_Date	: string;
  Sub_Ledger_ID	:string;
  Sub_Ledger_Name	: string;
  Booking_Date: string;
  Booking_Amount = 0;
  Currency: string;
  Rate =0;
  Amount = 0;
  Period_From	: string;
  Period_To	: string;
  Bank_Ref_No	:string;
  Bank_Doc_File	: string;
}





