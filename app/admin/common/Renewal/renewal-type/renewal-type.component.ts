import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-renewal-type',
  templateUrl: './renewal-type.component.html',
  styleUrls: ['./renewal-type.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})

export class RenewalTypeComponent implements OnInit {

  tabIndexToView = 1;
  buttonname = 'Add';
  Spinner = false;
  items = [];
  cols = [];
  menuList = [];
  componentDisplay = false;
  ObjSearchStock: any= {};
  searchBagProcessList = [];
  objRenewalType: RenewalType = new RenewalType();
  contractForm: FormGroup;
  submitted = false;
  getAllData:any[]=[];
  plantList:any[];
  renewalList:any[] =[];
  displayRenewalModal:boolean = false;
  contractForm2: FormGroup;
  submitted2 = false;
  updateData:any[];

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
        this.items = ['CREATE'];
        this.menuList = [
          {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
          {label: 'Delete', icon: 'fa fa-fw fa-trash'}
        ];

        this.Header.pushHeader({
          'Header' : 'Renewal Type',
          'Link' : 'Renewal-> Renewal Type'
        });
        this.contractForm = this.fb.group({
          Cost_Cent_ID: ['', Validators.required],
          Renewal_Type: ['', Validators.required],
        });

        this.contractForm2 = this.fb.group({
          Cost_Cent_ID: ['', Validators.required],
          Renewal_Type: ['', Validators.required],
        });

    this.getPlants();
    this.getRenewal();
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

getPlants() {
  this.$http.get('/Oil_Production/Get_Cost_Centre')
  .subscribe((data: any) => {
       this.plantList = data ? JSON.parse(data) : [];

      this.plantList.forEach((val, index)=>{
          this.plantList[index].label = val.Cost_Cen_Name;
          this.plantList[index].value = val.Cost_Cen_ID;
      });
      console.log('this.plantList =', this.plantList);
  });
}

getRenewal() {
  this.$http.get('/Renewal_Type/Retrieve_Data')
  .subscribe((data: any) => {
       this.renewalList = data ? JSON.parse(data) : [];
      console.log('this.renewalList =', this.renewalList);
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
     console.log('this.objRenewalType =', this.objRenewalType);
     this.Spinner = true;
     const UrlAddress = '/Renewal_Type/Create_Edit_Renewal_Type';
     const obj = { 'Renewal_Type_String': JSON.stringify([this.objRenewalType]) };
     this.$http.post(UrlAddress, obj )
     .subscribe((data: any) => {
        if (data.success) {
           if (this.objRenewalType.Renewal_ID !== 0) {
             this.componentDisplay = true;
             this.compacctToast.clear();
             this.compacctToast.add({key: 'compacct-toast',
                               severity: 'success',
                               summary: 'Renewal Type Updated',
                               detail: 'Succesfully Updated'});
                               //this.searchBagProcess(true);
                               this.getRenewal();

           } else {
             this.componentDisplay = true;
             this.compacctToast.clear();
             this.compacctToast.add({key: 'compacct-toast',
                               severity: 'success',
                               summary: 'Renewal Type Added'  ,
                               detail: 'Succesfully Created'});
                               this.getRenewal();
                               //this.searchBagProcess(true);
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

get j() {
  return this.contractForm2.controls;
}

editRenewalType(Renewal_ID){
  console.log('Renewal_ID =', Renewal_ID);
  this.displayRenewalModal = true;
  this.$http.post('/Renewal_Type/Retrieve_Data_With_Id', {'Renewal_ID' : Renewal_ID})
  .subscribe((data: any) => {
        this.updateData = data ? JSON.parse(data) : [];
        console.log('this.updateData =', this.updateData);
        if(this.updateData.length > 0){
          this.objRenewalType = this.updateData[0];
        }
  });
}

updateMaster() {
  this.submitted2 = true;
  if (this.contractForm2.invalid) {
    console.log('this.contractForm2.invalid =', this.contractForm2.invalid);
      return;
  }else{
    console.log('this.objRenewalType update =', this.objRenewalType);

    this.Spinner = true;
    const UrlAddress = '/Renewal_Type/Create_Edit_Renewal_Type';
    const obj = { 'Renewal_Type_String': JSON.stringify([this.objRenewalType]) };
    this.$http.post(UrlAddress, obj )
    .subscribe((data: any) => {
       if (data.success) {
            this.componentDisplay = true;
            this.compacctToast.clear();
            this.compacctToast.add({key: 'compacct-toast',
                              severity: 'success',
                              summary: 'Renewal Type Updated',
                              detail: 'Succesfully Updated'});
                              //this.searchBagProcess(true);
                              this.displayRenewalModal = false;
                              this.getRenewal();

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

deleteMachine(index, Renewal_ID){
  this.$http.post('/Renewal_Type/Delete', {'Renewal_ID' : Renewal_ID})
    .subscribe((data: any) => {
        if (data.success === true) {
          this.renewalList.splice(index, 1);
        }
    });
}

  // Delete
  deleteBagProcess (BagProcess) {
    /* if (BagProcess.Currency_Booking_ID) {
      this.RenewalTypeID = BagProcess.Currency_Booking_ID;
      this.compacctToast.clear();
      this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});
    } */
  }
  onConfirm() {
   /*  if (this.RenewalTypeID) {
      this.$http.post('/Currency_Booking/Delete_Currency_Booking', {'Currency_Booking_ID' : this.RenewalTypeID})
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
    } */
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
    //this.items = [ 'BROWSE', 'CREATE'];
    this.items = ['CREATE'];
    this.buttonname = 'Add';
   this.clearData();
  }
  clearData() {
      this.Spinner = false;
      this.objRenewalType = new RenewalType();
      this.submitted = false;
      this.submitted2 = false;
      this.getAllData = [];
    }
}

class RenewalType {
  Renewal_ID	= 0;
  Renewal_Type: string;
  Cost_Cent_ID:number;
}





