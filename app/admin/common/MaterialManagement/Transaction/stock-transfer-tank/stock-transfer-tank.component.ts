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
  selector: 'app-stock-transfer-tank',
  templateUrl: './stock-transfer-tank.component.html',
  styleUrls: ['./stock-transfer-tank.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class StockTransferTankComponent implements OnInit {

  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  items = [];
  cols = [];
  menuList = [];
  componentDisplay = false;
  ObjSearchStock: any= {};
  searchBagProcessList = [];
  STDate = new Date();

// Bagprocess
  objStockTransfer: StockTransfer = new StockTransfer();
  plantList:any[];
  tankList:any[];
  godownList:any[];
  productList:any[];
  productDetails:any;
  productBatchno:any[];
  StockTransferObj:any[]= [];
   tmp_Product_Name: string;
  editStockTransferIndex:number =0;
  StockTransferData = [];
  mfgProcessNo:string;
  fromTankMsg: string ='';
  toTankMsg: string ='';
  tank_cal:number = 0;
   StockTransferGodownList:any[];
   toTankGodownList:any[];

  // new
  contractForm: FormGroup;
  submitted = false;
  User_ID:any;

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
      // this.router.routeReuseStrategy.shouldReuseRoute = function() {
      //   return false;
      //};
    }

  ngOnInit() {
    this.items = [ 'BROWSE', 'CREATE'];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];

      this.Header.pushHeader({
        'Header' : 'Stock Tranfer For Tank',
        'Link' : ' Material Management -> Stock Tranfer For Tank'
      });

    this.contractForm = this.fb.group({
      ST_Date: [''],
      From_Cost_Cen_ID: ['', Validators.required],
      From_godown_id: ['', Validators.required],
      Product_ID: ['', Validators.required],
      Batch_No: ['', Validators.required],
      From_Open_Hight:  ['', [Validators.required, this.ValidateZero]],
      From_Open_Qty:  [''],
      From_Close_Hight:  ['', [Validators.required, this.ValidateZero]],
      From_Close_Qty:  [''],
      From_Qty: [''],
      To_Cost_Cen_ID: ['', Validators.required],
      To_godown_id: ['', Validators.required],
      To_Open_Hight:  ['', [Validators.required, this.ValidateZero]],
      To_Open_Qty:  [''],
      To_Close_Hight:  ['', [Validators.required, this.ValidateZero]],
      To_Close_Qty:  [''],
      To_Qty: [''],
      Diff_Qty: [''],
    }, {
      validator: this.matchValidation('From_Cost_Cen_ID', 'To_Cost_Cen_ID')
  });
    this.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;

    this.getPlants();
    this.getProducts();
  }

// https://alligator.io/angular/reactive-forms-custom-validator/

ValidateZero(control: AbstractControl) {
  // alert('value =' + control.value);
  if (control.value === 0) {
   return { validZero: true };
  }
  return null;
}
matchValidation(From_Cost_Cen_ID: string, To_Cost_Cen_ID: string) {
    return (formGroup: FormGroup) => {
        //console.log('formGroup =', formGroup);
          const fromCostCen_ID = formGroup.controls[From_Cost_Cen_ID];
          const toCostCen_ID = formGroup.controls[To_Cost_Cen_ID];

          if (toCostCen_ID.errors && !toCostCen_ID.errors.validPeriod) {
              // return if another validator has already found an error on the matchingControl
              return;
          }
          // set error on matchingControl if validation fails
          if (fromCostCen_ID.value === toCostCen_ID.value) {
            toCostCen_ID.setErrors({ matchCostCenter: true });
          } else {
            toCostCen_ID.setErrors(null);
          }
    };
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

    this.$http.get('/BL_Txn_ST_Trf_Tank/GetAllData', {params : obj})
    .subscribe((data: any) => {
      this.searchBagProcessList =  data.length ? JSON.parse(data) : [];
      this.Spinner = false;
      console.log('this.searchBagProcessList =', this.searchBagProcessList );
    });
}
getPlants() {
  this.$http.get('/Oil_Production/Get_Cost_Centre')
  .subscribe((data: any) => {
       const plantArr = data ? JSON.parse(data) : [];
       console.log('plantArr =', plantArr);
      //For searchable dropdown
       plantArr.forEach((val, index)=>{
            plantArr[index].label = val.Cost_Cen_Name;
            plantArr[index].value = val.Cost_Cen_ID;
      });

        this.tankList = plantArr.filter((value:any)=>{
          return value.Cost_Cen_Main_Type === 'STORE-TANK';
        });
        console.log('this.tankList =', this.tankList);
  });
}

getGodown(Cost_Cen_ID) {
 this.$http.get('/Oil_Production/Get_GoDown?Cost_Cen_ID=' + Cost_Cen_ID)
  .subscribe((data: any) => {
       this.godownList = data ? JSON.parse(data) : [];
      // console.log('godown list =', this.godownList);
  });
}
getProducts() {
 this.$http.get('/Oil_Production/Get_Product')
  .subscribe((data: any) => {
       const productArr = data ? JSON.parse(data) : [];
       console.log('productArr =', productArr);

       this.productList = productArr.filter((value:any)=>{
        return (value.Material_Type === 'RAW MATERIAL' || value.Material_Type === 'FINAL') ;
      });
      this.productList.forEach((val, index)=>{
            this.productList[index].label = val.Product_Description;
            this.productList[index].value = val.Product_ID;
      });
     console.log('productList 22 =', this.productList);
  });
}

getGodownForFromTank(Cost_Cen_ID) {
    this.fromTankMsg = '';
   // this.objStockTransfer.Product_ID = undefined;
    this.objStockTransfer.From_Qty = 0;
   // this.objStockTransfer.UOM = undefined;
    this.objStockTransfer.From_Open_Hight  = 0;
    this.objStockTransfer.From_Close_Hight  = 0;
    this.objStockTransfer.From_Open_Qty  = 0;
    this.objStockTransfer.From_Close_Qty  = 0;

    this.tankList.forEach((value, index)=>{
      if(value.Cost_Cen_ID === Cost_Cen_ID){
          //this.Raw_Material_Cost_Cen_Main_Type =  value.Cost_Cen_Main_Type;
          //this.objStockTransfer.Cost_Cen_Main_Type = value.Cost_Cen_Main_Type;
          this.objStockTransfer.From_Tank_Calc = value.Tank_Calc;
      }
    })
  // console.log('this.objStockTransfer.Tank_Calc =', this.objStockTransfer.Tank_Calc);

      this.$http.get('/Oil_Production/Get_GoDown?Cost_Cen_ID=' + Cost_Cen_ID)
      .subscribe((data: any) => {
         this.StockTransferGodownList = data ? JSON.parse(data) : [];
      });
}

getGodownForToTank(Cost_Cen_ID) {
  this.fromTankMsg = '';
 // this.objStockTransfer.Product_ID = undefined;
  this.objStockTransfer.To_Qty = 0;
  //this.objStockTransfer.UOM = undefined;
  this.objStockTransfer.To_Open_Hight  = 0;
  this.objStockTransfer.To_Close_Hight  = 0;
  this.objStockTransfer.To_Open_Qty  = 0;
  this.objStockTransfer.To_Close_Qty  = 0;

  this.tankList.forEach((value, index)=>{
    if(value.Cost_Cen_ID === Cost_Cen_ID){
        //this.Raw_Material_Cost_Cen_Main_Type =  value.Cost_Cen_Main_Type;
        //this.objStockTransfer.Cost_Cen_Main_Type = value.Cost_Cen_Main_Type;
        this.objStockTransfer.To_Tank_Calc = value.Tank_Calc;
    }
  })
// console.log('this.objStockTransfer.Tank_Calc =', this.objStockTransfer.Tank_Calc);

    this.$http.get('/Oil_Production/Get_GoDown?Cost_Cen_ID=' + Cost_Cen_ID)
    .subscribe((data: any) => {
       this.toTankGodownList = data ? JSON.parse(data) : [];
    });
}

getBatchNoForStockTransfer(Product_ID) {
  this.productList.forEach((value, index)=>{
    if(value.Product_ID === Product_ID){
        this.tmp_Product_Name  = value.Product_Description;
        return;
    }
  });

  this.$http.get('/common/Get_Stock_Qty?CostCenID=' + this.objStockTransfer.From_Cost_Cen_ID + '&ProductID=' + Product_ID + '&GodownID=' + this.objStockTransfer.From_godown_id + '&Report_type='+ "STOCK WITH BATCH")
   .subscribe((data: any) => {
      this.productBatchno = data ? JSON.parse(data) : [];
      console.log('this.productBatchno =', this.productBatchno);
   });

   this.$http.get('/Master_Product_V2/Get_Product?_Product_ID=' + Product_ID)
   .subscribe((data: any) => {
      const StockTransferUOM = data ? JSON.parse(data) : [];
        if(StockTransferUOM.length > 0){
          this.objStockTransfer.UOM =  StockTransferUOM[0].UOM;
        }
   });
 }

getProductDetails(Batch_Number) {
     this.objStockTransfer.From_Qty = 0;
      // if(this.tabIndexToView == 0){
      //   this.tmp_StockTransfer_qty =  0;
      // }
      this.productDetails = this.productBatchno.filter((value:any, index)=>{
        return value.Batch_No == Batch_Number;
      });
      //console.log('productDetails =', this.productDetails);

      // if(this.Raw_Material_Cost_Cen_Main_Type ==='STORE-TANK'){
      //   this.objStockTransfer.From_Open_Qty  =  this.productDetails[0].QTY;
      //   this.objStockTransfer.From_Open_Hight = this.objStockTransfer.From_Open_Qty / this.objStockTransfer.Tank_Calc;
      // }
 }

tankOpenQtyForRaw(){

  console.log('this.objStockTransfer.From_Open_Hight =', this.objStockTransfer.From_Open_Hight);
  console.log('this.objStockTransfer.From_Tank_Calc =', this.objStockTransfer.From_Tank_Calc);

  this.objStockTransfer.From_Open_Qty = Number((this.objStockTransfer.From_Open_Hight * this.objStockTransfer.From_Tank_Calc).toFixed(2));
  console.log('this.objStockTransfer.From_Open_Qty =', this.objStockTransfer.From_Open_Qty);

  if(this.objStockTransfer.From_Close_Hight != undefined && this.objStockTransfer.From_Close_Hight > 0){
    this.tankCloseQtyForRaw();
  }
}
tankCloseQtyForRaw(){
      this.fromTankMsg  = '';
      if(this.objStockTransfer.From_Close_Hight >= this.objStockTransfer.From_Open_Hight){
        this.fromTankMsg = 'Tank close height should be smaller than open height';
      }else{
          this.fromTankMsg ='';
          this.objStockTransfer.From_Close_Qty = Number(( this.objStockTransfer.From_Close_Hight * this.objStockTransfer.From_Tank_Calc).toFixed(2));
          this.objStockTransfer.From_Qty = Number((this.objStockTransfer.From_Open_Qty - this.objStockTransfer.From_Close_Qty).toFixed(2));
      }
}
openQtyForToTank(){
  this.objStockTransfer.To_Open_Qty =  Number((this.objStockTransfer.To_Open_Hight * this.objStockTransfer.To_Tank_Calc).toFixed(2));
  // console.log('this.objStockTransfer.To_Open_Hight =', this.objStockTransfer.To_Open_Hight);
  // console.log('this.objStockTransfer.To_Tank_Calc =', this.objStockTransfer.To_Tank_Calc);
  // console.log('this.objStockTransfer.To_Open_Qty =', this.objStockTransfer.To_Open_Qty);

  if(this.objStockTransfer.To_Close_Hight != undefined && this.objStockTransfer.To_Close_Hight > 0){
    this.closeQtyForToTank();
  }
}
closeQtyForToTank(){
      this.fromTankMsg  = '';
      // console.log('this.objStockTransfer.To_Open_Hight =', this.objStockTransfer.To_Open_Hight);
      // console.log('this.objStockTransfer.To_Close_Hight =', this.objStockTransfer.To_Close_Hight);

      this.toTankMsg = '';
      if(this.objStockTransfer.To_Close_Hight != undefined && this.objStockTransfer.To_Close_Hight > 0){
          this.objStockTransfer.To_Close_Qty = Number((this.objStockTransfer.To_Close_Hight * this.objStockTransfer.To_Tank_Calc).toFixed(2));
          this.objStockTransfer.To_Qty = Number(( this.objStockTransfer.To_Close_Qty - this.objStockTransfer.To_Open_Qty).toFixed(2));

          if((this.objStockTransfer.To_Qty > this.objStockTransfer.From_Qty) || this.objStockTransfer.To_Qty < 0){
            this.objStockTransfer.Diff_Qty = 0;
             this.toTankMsg = 'From Qty should be greater than To Qty. Please check To Tank Open / Close Hight.';
          }else{
            this.objStockTransfer.Diff_Qty = Number((this.objStockTransfer.From_Qty - this.objStockTransfer.To_Qty).toFixed(2));
            console.log('this.objStockTransfer.Diff_Qty =', this.objStockTransfer.Diff_Qty);
          }
      }
}

GetSTDate (STDate) {
    if (STDate) {
        this.objStockTransfer.ST_Date = this.DateService.dateConvert(moment(STDate, 'YYYY-MM-DD')['_d']);
    }
}
get f() {
    return this.contractForm.controls;
}
// Save
SaveBagProcessMaster () {
   this.submitted = true;

    //if( this.tabIndexToView!==1){
      this.objStockTransfer.ST_Doc_No ='';
   // }

   if (this.contractForm.invalid) {
     //console.log('this.contractForm.controls =', this.contractForm.controls);
       return;
   }
  else{
    console.log('this.toTankMsg =', this.toTankMsg)
    console.log('this.fromTankMsg =', this.fromTankMsg)

    if(this.toTankMsg === '' &&  this.fromTankMsg === ''){

     const arr = [];
     arr.push(this.objStockTransfer);
      console.log('this.objStockTransfer Final=', this.objStockTransfer);

      this.Spinner = true;
      const UrlAddress = '/BL_Txn_ST_Trf_Tank/Create_INV_Txn_St_Trf_Ajax_v2';
      // const obj = {
      //     //'_INV_Txn_St_Trf': JSON.stringify([this.objStockTransfer])
      //     '_INV_Txn_St_Trf': this.objStockTransfer
      //   };
      //this.$http.post(UrlAddress, obj ).subscribe((data: any) => {

      this.$http.post(UrlAddress, arr ).subscribe((data: any) => {
        if (data.success) {
            if (this.objStockTransfer.ST_Doc_No!=='') {
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                severity: 'success',
                                summary: 'Stock Transfer Updated',
                                detail: 'Succesfully Updated'});
                                this.searchBagProcess(true);
            } else {
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                severity: 'success',
                                summary: 'Stock Transfer Added'  ,
                                detail: 'Succesfully Created'});
                                this.searchBagProcess(true);
                                this.clearData();
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
}

  // Edit
  editProcess(Doc_No) {
      this.tabIndexToView = 1;
      this.items = ['BROWSE', 'UPDATE'];
      this.buttonname = 'Update';

      /* this.$http.get('/Export_Transportation/Get_All_Data?Doc_No=' + Doc_No)
      .subscribe((data: any) => {
          this.transportationData = data ? JSON.parse(data) : [];
        console.log('Edit transportationData =>>', this.transportationData);
        if(this.transportationData.length > 0 ){

            this.objStockTransfer.Com_Inv_No = this.transportationData[0].Com_Inv_No;
            this.objStockTransfer.ST_Date = this.transportationData[0].ST_Date;
            this.objStockTransfer.Sub_Ledger_ID = this.transportationData[0].Sub_Ledger_ID;
            this.objStockTransfer.Truck_No = this.transportationData[0].Truck_No;
            this.objStockTransfer.Container_No = this.transportationData[0].Container_No;
            this.objStockTransfer.Seal_No = this.transportationData[0].Seal_No;
            this.objStockTransfer.Flexi_Tank_No = this.transportationData[0].Flexi_Tank_No;
          this.Doc_No = this.transportationData[0].Doc_No;
          this.StockTransferObj = [...this.transportationData];
          console.log('this.StockTransferObj Edit 88 =', this.StockTransferObj);

        }
      }); */
  }

  //  http://localhost:50063/BL_Txn_ST_Trf_Tank/Delete?Doc_No=BNBES/1920/00001

  // Delete
  deleteBagProcess (BagProcess) {
    if (BagProcess.ST_Doc_No) {
      this.mfgProcessNo = BagProcess.ST_Doc_No;
      this.compacctToast.clear();
      this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});
    }
  }
  onConfirm() {
    if (this.mfgProcessNo) {
      this.$http.post('/BL_Txn_ST_Trf_Tank/Delete', {'Doc_No' : this.mfgProcessNo})
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
    this.objStockTransfer = new StockTransfer();
    this.submitted = false;
    //this.StockTransferObj = [];
    this.fromTankMsg = '';
    this.toTankMsg = '';
    //this.Raw_Material_Cost_Cen_Main_Type ='STORE';
   // this.checkStockTransferQtyExist = false;
  if(this.tabIndexToView ==1){
    this.STDate = new Date();
    this.objStockTransfer.ST_Date = this.DateService.dateConvert(moment(this.STDate, 'YYYY-MM-DD')['_d']);
   }
  }
}

class StockTransfer {
  ST_Doc_No	:string;
  ST_Date	: string;
  Product_ID: number;
  UOM	:string;
  From_Cost_Cen_ID : number;
  To_Cost_Cen_ID:number;
  From_godown_id: number;
  Batch_No: string;
  To_godown_id: number;
  From_Open_Hight = 0;
  From_Open_Qty	= 0;
  From_Close_Hight = 0;
  From_Close_Qty = 0;
  From_Qty = 0;
  To_Open_Hight	= 0;
  To_Open_Qty	= 0;
  To_Close_Hight = 0;
  To_Close_Qty = 0;
  To_Qty = 0;
  Diff_Qty = 0;
  From_Tank_Calc = 0;
  To_Tank_Calc = 0;
}





