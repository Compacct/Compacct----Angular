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
    selector: 'app-transportation',
    templateUrl: './transportation.component.html',
    styleUrls: ['./transportation.component.css'],
    providers: [MessageService] ,
    encapsulation: ViewEncapsulation.None
  })
  export class TransportationComponent implements OnInit {

    tabIndexToView = 0;
    buttonname = 'Create';
    Spinner = false;
    items = [];
    BagProcessSearchSubmitted = false;
    createQCFormSubmitted = false;
    //BagProcessID: number;
    cols = [];
    menuList = [];
    ExistNameFlag = false;
    componentDisplay = false;
    checkBagExist = false;
    ObjSearchStock: any= {};
    searchBagProcessList = [];
    DocDate = new Date();
    To_Cost_Center_Name:string;
    TO_GoDown_Name: string;
    mfDate = new Date();
    expDate: any;

  // Bagprocess
    objRawMaterial: RawMaterial = new RawMaterial();
    plantList:any[];
    storeList:any[];
    tankList:any[];
    godownList:any[];
    shiftList:any[];
    productList:any[];
    productDetails:any;
    productBatchno:any[];
    rawMaterialObj:any[]= [];

    tmp_Product_Name: string;
    tmp_Product_Desc_Consum: string;
    tmp_Product_Desc_Wastage: string;
    tmp_Product_Desc_Final: string;
    tmp_rawmaterial_qty:number;
    tmp_consumable_qty:number;
    checkRawMaterialQtyExist = false;
    checkConsumableQtyExist = false;

    bagProcessFormSubmitted = false;
    rawMaterialFormSubmitted = false;
    consumableFormSubmitted = false;
    rowMaterialErr = false;
    consumableErr = false;
    storeTankList:any[] = [];
    storeTankPlantList:any[] =[];

    //raw
    Raw_Material_Cost_Cen_Main_Type:string ='STORE';
    rawMaterialGodownList:any[];
    editRawMaterialIndex:number =0;
    rawMaterialData = [];
    mfgProcessNo:string;

    displayEwayModal:boolean = false;
    rawMaterialMsg: string ='';
    tank_cal:number = 0;
    product_expiry:boolean = false;
    InvoiceList:any[] =[];
    tranpoterList:any[] =[];
    transportationData : any[] =[];
    Doc_No: string;

    // new
    contractForm: FormGroup;
    submitted = false;

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
          'Header' : 'Transportation',
          'Link' : ' Material Management -> Master -> Master Cost Center'
        });

      const date = this.DateService.dateConvert(moment(new Date, 'YYYY-MM-DD')['_d']).split('/') ;
      const add2Year = Number(date[2]) + 2;
      this.expDate = date[0] + '/' + date[1] + '/' + add2Year;

      this.contractForm = this.fb.group({
        Com_Inv_No: ['', Validators.required],
        Doc_Date: [''],
        Sub_Ledger_ID: ['', Validators.required],
        Truck_No: ['', Validators.required],
        Container_No: ['', Validators.required],
        Seal_No: ['', Validators.required],
        Flexi_Tank_No: [''],
        Cost_Cen_ID: [''],
        Godown_ID: [''],
        Product_ID: [''],
        Batch_Number: [''],
        Qty: [''],
        Tank_Open_Hight: [''],
        Tank_Open_Qty: [''],
        Tank_Close_Hight: [''],
        Tank_Close_Qty: ['']
      });

      this.getPlants();
      this.getInvoice();
      this.getProducts();
    }

    getDateRange (dateRangeObj) {
      if (dateRangeObj.length) {
      this.ObjSearchStock.from_date = dateRangeObj[0];
      this.ObjSearchStock.to_date = dateRangeObj[1];
      }
    }
  searchBagProcess (valid) {
    this.BagProcessSearchSubmitted = true;
      this.Spinner = true;
      const start =  this.ObjSearchStock.from_date ?
            this.DateService.dateConvert(new Date(this.ObjSearchStock.from_date)) : this.DateService.dateConvert(new Date);
      const end =  this.ObjSearchStock.to_date ?
            this.DateService.dateConvert(new Date(this.ObjSearchStock.to_date)) : this.DateService.dateConvert(new Date);

      const obj = new HttpParams()
      .set('from_date', start)
      .set('to_date', end);

      this.$http.get('/Export_Transportation/DateWise_Browse', {params : obj})
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

          this.plantList = plantArr.filter((value:any)=>{
            return value.Cost_Cen_Main_Type === 'PLANT';
          });
          console.log('this.plantList =', this.plantList);

          // get store
          this.storeList = plantArr.filter((value:any)=>{
            return value.Cost_Cen_Main_Type === 'STORE';
          });
         // console.log('this.storeList =', this.storeList);
          // get stroe tank
          this.tankList = plantArr.filter((value:any)=>{
            return value.Cost_Cen_Main_Type === 'STORE-TANK';
          });
          //console.log('this.tankList =', this.tankList);

          this.storeTankList = [... this.storeList, ... this.tankList];
         // console.log('this.storeTankList =', this.storeTankList);

          this.storeTankPlantList = [... this.storeList, ... this.tankList, ... this.plantList];
          console.log('this.storeTankPlantList =', this.storeTankPlantList);
    });
  }

  getGodown(Cost_Cen_ID) {
   this.$http.get('/Oil_Production/Get_GoDown?Cost_Cen_ID=' + Cost_Cen_ID)
    .subscribe((data: any) => {
         this.godownList = data ? JSON.parse(data) : [];
        // console.log('godown list =', this.godownList);
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

  getProducts() {
   this.$http.get('/Oil_Production/Get_Product')
    .subscribe((data: any) => {
         const productArr = data ? JSON.parse(data) : [];
         console.log('productArr =', productArr);

         /************* RAW MATERIAL *************/
         this.productList = productArr.filter((value:any)=>{
          // return value.Material_Type === 'RAW MATERIAL';
          return (value.Material_Type === 'RAW MATERIAL' || value.Material_Type === 'FINAL') ;
        });
        // For Raw Material autocomplete
        this.productList.forEach((val, index)=>{
              this.productList[index].label = val.Product_Description;
              this.productList[index].value = val.Product_ID;
        });
       console.log('productList 22 =', this.productList);
    });
  }


  /* ######################################  Raw material  ###################################### */

  getGodownForRawMaterial(Cost_Cen_ID) {

      this.rawMaterialMsg = '';
      this.objRawMaterial.Product_ID = undefined;
      this.objRawMaterial.Qty = 0;
      this.objRawMaterial.UOM = undefined;
      this.objRawMaterial.Tank_Open_Hight  = 0;
      this.objRawMaterial.Tank_Close_Hight  = 0;
      this.objRawMaterial.Tank_Open_Qty  = 0;
      this.objRawMaterial.Tank_Close_Qty  = 0;

    this.storeTankPlantList.forEach((value, index)=>{
       if(value.Cost_Cen_ID === Cost_Cen_ID){
          this.Raw_Material_Cost_Cen_Main_Type =  value.Cost_Cen_Main_Type;
          this.objRawMaterial.Cost_Cen_Main_Type = value.Cost_Cen_Main_Type;
          this.objRawMaterial.Tank_Calc = value.Tank_Calc;
       }
     })
    // console.log('this.objRawMaterial.Tank_Calc =', this.objRawMaterial.Tank_Calc);

      this.$http.get('/Oil_Production/Get_GoDown?Cost_Cen_ID=' + Cost_Cen_ID)
        .subscribe((data: any) => {
           this.rawMaterialGodownList = data ? JSON.parse(data) : [];

        });
  }

  getBatchNoForRawMaterial(Product_ID) {
    this.productList.forEach((value, index)=>{
      if(value.Product_ID === Product_ID){
          this.tmp_Product_Name  = value.Product_Description;
          return;
      }
    })

    this.$http.get('/common/Get_Stock_Qty?CostCenID=' + this.objRawMaterial.Cost_Cen_ID + '&ProductID=' + Product_ID + '&GodownID=' + this.objRawMaterial.Godown_ID + '&Report_type='+ "STOCK WITH BATCH")
     .subscribe((data: any) => {
        this.productBatchno = data ? JSON.parse(data) : [];
        //console.log('this.productBatchno =', this.productBatchno);
     });

     this.$http.get('/Master_Product_V2/Get_Product?_Product_ID=' + Product_ID)
     .subscribe((data: any) => {
        const rawMaterialUOM = data ? JSON.parse(data) : [];
          if(rawMaterialUOM.length > 0){
            this.objRawMaterial.UOM =  rawMaterialUOM[0].UOM;
          }
     });
   }

  getProductDetails(Batch_Number) {
       this.objRawMaterial.Qty = 0;
        if(this.tabIndexToView == 0){
          this.tmp_rawmaterial_qty =  0;
        }
        this.productDetails = this.productBatchno.filter((value:any, index)=>{
          return value.Batch_No == Batch_Number;
        });
        //console.log('productDetails =', this.productDetails);

        if(this.Raw_Material_Cost_Cen_Main_Type ==='STORE-TANK'){
          this.objRawMaterial.Tank_Open_Qty  =  this.productDetails[0].QTY;
          this.objRawMaterial.Tank_Open_Hight = this.objRawMaterial.Tank_Open_Qty / this.objRawMaterial.Tank_Calc;
        }
   }

  tankOpenQtyForRaw(){
    this.objRawMaterial.Tank_Open_Qty = this.objRawMaterial.Tank_Open_Hight * this.objRawMaterial.Tank_Calc;
    if(this.objRawMaterial.Tank_Close_Hight != undefined && this.objRawMaterial.Tank_Close_Hight > 0){
      this.tankCloseQtyForRaw();
    }
  }
  tankCloseQtyForRaw(){
    if(this.objRawMaterial.Tank_Close_Hight == undefined){
      this.objRawMaterial.Qty = 0;
      this.objRawMaterial.Tank_Close_Qty = 0;
      this.rawMaterialMsg = 'Tank close height should be smaller than open height';
    } else{
        this.objRawMaterial.Qty = 0;
        this.objRawMaterial.Tank_Close_Qty = 0;
        this.rawMaterialMsg  = '';
        if(this.objRawMaterial.Tank_Close_Hight > this.objRawMaterial.Tank_Open_Hight){
          this.rawMaterialMsg = 'Tank close height should be smaller than open height';
        }else{
            this.objRawMaterial.Tank_Close_Qty = this.objRawMaterial.Tank_Close_Hight * this.objRawMaterial.Tank_Calc;
            this.objRawMaterial.Qty =  this.objRawMaterial.Tank_Open_Qty -  this.objRawMaterial.Tank_Close_Qty;
        }
    }
  }

  editRawMaterial(index){
    this.displayEwayModal = true;
    this.editRawMaterialIndex = index;
     this.objRawMaterial.Tank_Open_Hight = this.rawMaterialObj[this.editRawMaterialIndex].Tank_Open_Hight;
     this.objRawMaterial.Tank_Close_Hight = this.rawMaterialObj[this.editRawMaterialIndex].Tank_Close_Hight;
     this.objRawMaterial.Tank_Close_Qty =  this.rawMaterialObj[this.editRawMaterialIndex].Tank_Close_Qty;
     this.objRawMaterial.Tank_Open_Qty =  this.rawMaterialObj[this.editRawMaterialIndex].Tank_Open_Qty;
     this.objRawMaterial.Tank_Calc =  this.rawMaterialObj[this.editRawMaterialIndex].Tank_Calc;
  }
  rawMaterialUpdate(valid){
      if(this.rawMaterialMsg ==''){
          this.tankCloseQtyForRaw();
          this.rawMaterialObj[this.editRawMaterialIndex].Tank_Open_Hight = this.objRawMaterial.Tank_Open_Hight;
          this.rawMaterialObj[this.editRawMaterialIndex].Tank_Close_Hight = this.objRawMaterial.Tank_Close_Hight;
          this.rawMaterialObj[this.editRawMaterialIndex].Tank_Close_Qty = this.objRawMaterial.Tank_Close_Qty;
          this.rawMaterialObj[this.editRawMaterialIndex].Tank_Open_Qty = this.objRawMaterial.Tank_Open_Qty;
          this.rawMaterialObj[this.editRawMaterialIndex].Qty = this.objRawMaterial.Qty;
          this.rawMaterialMsg = '';
          this.displayEwayModal = false;
          this.editRawMaterialIndex = 0;
          this.objRawMaterial.Tank_Open_Hight = 0;
          this.objRawMaterial.Tank_Close_Hight = 0;
          this.objRawMaterial.Tank_Open_Qty =  0;
          this.objRawMaterial.Tank_Close_Qty =  0;
          this.objRawMaterial.Qty =  0;
      }
  }

get f() {
    return this.contractForm.controls;
}

addRawMaterial(){

  // this.contractForm.get('Cost_Cen_ID').setValidators([Validators.required]);
  // this.contractForm.get('Cost_Cen_ID').updateValueAndValidity();

  this.contractForm.controls.Cost_Cen_ID.setValidators([Validators.required]);
  this.contractForm.controls.Cost_Cen_ID.updateValueAndValidity();
  this.contractForm.controls.Godown_ID.setValidators([Validators.required]);
  this.contractForm.controls.Godown_ID.updateValueAndValidity();
  this.contractForm.controls.Product_ID.setValidators([Validators.required]);
  this.contractForm.controls.Product_ID.updateValueAndValidity();
  this.contractForm.controls.Batch_Number.setValidators([Validators.required]);
  this.contractForm.controls.Batch_Number.updateValueAndValidity();

  if(this.Raw_Material_Cost_Cen_Main_Type !=='STORE-TANK'){
    //this.contractForm.controls.Qty.setValidators([Validators.required]);
    this.contractForm.controls.Qty.setValidators([this.ValidateZero]);
    this.contractForm.controls.Qty.updateValueAndValidity();
  }

   this.submitted = true;
  //  console.log('value11 =', this.contractForm);
  //  console.log('value1 22 =', this.contractForm.value);

   if (this.contractForm.invalid) {
       return;
   }else{

        this.rawMaterialMsg = '';
        let valueExist = false;
        this.rawMaterialObj.forEach((val, index)=>{
            if((val.Product_ID === this.objRawMaterial.Product_ID) && (val.Batch_Number === this.objRawMaterial.Batch_Number)){
              valueExist = true;
            }
        });

        if(!valueExist){
          const obj ={
            Product_Name: this.tmp_Product_Name,
            Product_ID: this.objRawMaterial.Product_ID,
            Batch_Number: this.objRawMaterial.Batch_Number,
            Qty: this.objRawMaterial.Qty,
            UOM: this.objRawMaterial.UOM,
            Cost_Cen_ID: this.objRawMaterial.Cost_Cen_ID,
            Godown_ID: this.objRawMaterial.Godown_ID,
            Tank_Open_Hight: this.objRawMaterial.Tank_Open_Hight,
            Tank_Close_Hight: this.objRawMaterial.Tank_Close_Hight,
            Tank_Open_Qty: this.objRawMaterial.Tank_Open_Qty,
            Tank_Close_Qty: this.objRawMaterial.Tank_Close_Qty,
            Cost_Cen_Main_Type: this.objRawMaterial.Cost_Cen_Main_Type,
            Tank_Calc: this.objRawMaterial.Tank_Calc
           };
          this.rawMaterialObj.push(obj);
           console.log('this.rawMaterialObj =', this.rawMaterialObj);


          this.contractForm.controls.Cost_Cen_ID.setValidators([]);
          this.contractForm.controls.Cost_Cen_ID.updateValueAndValidity();
          this.contractForm.controls.Godown_ID.setValidators([]);
          this.contractForm.controls.Godown_ID.updateValueAndValidity();
          this.contractForm.controls.Product_ID.setValidators([]);
          this.contractForm.controls.Product_ID.updateValueAndValidity();
          this.contractForm.controls.Batch_Number.setValidators([]);
          this.contractForm.controls.Batch_Number.updateValueAndValidity();

          if(this.Raw_Material_Cost_Cen_Main_Type !=='STORE-TANK'){
            //this.contractForm.controls.Qty.setValidators([Validators.required]);
            this.contractForm.controls.Qty.setValidators([]);
            this.contractForm.controls.Qty.updateValueAndValidity();
          }

           this.objRawMaterial.Product_ID = undefined;
           this.objRawMaterial.Batch_Number = undefined;
           this.objRawMaterial.Qty = 0;
          this.objRawMaterial.Tank_Open_Hight  = 0;
          this.objRawMaterial.Tank_Close_Hight  = 0;
          this.objRawMaterial.Tank_Open_Qty  = 0;
          this.objRawMaterial.Tank_Close_Qty  = 0;
          this.objRawMaterial.Cost_Cen_ID = undefined;
          this.objRawMaterial.Godown_ID  = undefined;
           valueExist = false;
        }else{
          this.rawMaterialMsg = 'This product already exist please remove and add again.';
        }
      }
  }

 // https://alligator.io/angular/reactive-forms-custom-validator/

// export function ValidateZero(control: AbstractControl) {
  ValidateZero(control: AbstractControl) {
    // alert('value =' + control.value);
    if (control.value === 0) {
     return { validZero: true };
    }
    return null;
  }

   rawMaterialCancel(){
     this.displayEwayModal=false;
     this.rawMaterialMsg = '';
   }

   deleteRawMaterial(index){
    this.rawMaterialObj.splice(index, 1);
  }

  checkQty(Raw_material_Qty) {
    if(Raw_material_Qty > this.tmp_rawmaterial_qty ){
      this.checkRawMaterialQtyExist = true;
    }else{
      this.checkRawMaterialQtyExist = false;
    }
  }

  checkConsumableQty(Consumable_Qty) {
    if(Consumable_Qty > this.tmp_consumable_qty ){
      this.checkConsumableQtyExist = true;
    }else{
      this.checkConsumableQtyExist = false;
    }
  }

  GetDocdate (docDate) {
      if (docDate) {
          this.objRawMaterial.Doc_Date = this.DateService.dateConvert(moment(docDate, 'YYYY-MM-DD')['_d']);
        }
    }

  // get f() {
  //     return this.contractForm.controls;
  // }
    // Save
  SaveBagProcessMaster () {

     this.submitted = true;

      if( this.tabIndexToView!==1){
        this.Doc_No = 'A';
      }


     if (this.contractForm.invalid) {
         return;
     }else{

          this.rawMaterialObj.forEach((val, i)=>{
            this.rawMaterialObj[i].Com_Inv_No =  this.objRawMaterial.Com_Inv_No;
            this.rawMaterialObj[i].Doc_Date =  this.objRawMaterial.Doc_Date;
            this.rawMaterialObj[i].Sub_Ledger_ID =  this.objRawMaterial.Sub_Ledger_ID;
            this.rawMaterialObj[i].Truck_No =  this.objRawMaterial.Truck_No;
            this.rawMaterialObj[i].Container_No =  this.objRawMaterial.Container_No;
            this.rawMaterialObj[i].Seal_No =  this.objRawMaterial.Seal_No;
            this.rawMaterialObj[i].Flexi_Tank_No =  this.objRawMaterial.Flexi_Tank_No;
           // this.rawMaterialObj[i].Doc_No =  'A';
           this.rawMaterialObj[i].Doc_No =  this.Doc_No;
        });

        console.log('this.rawMaterialObj Final=', this.rawMaterialObj);

        this.Spinner = true;
        const UrlAddress = '/Export_Transportation/Create_Export_Transportation';
        const obj = {
          '_Export_Transportation': this.rawMaterialObj ,
         };
        this.$http.post(UrlAddress, obj )
        .subscribe((data: any) => {
            if (data.success) {
                this.componentDisplay = true;
                this.compacctToast.clear();
                this.compacctToast.add({key: 'compacct-toast',
                                  severity: 'success',
                                  summary: 'Transportation Saved',
                                  detail: 'Succesfully Saved'});
                                 this.searchBagProcess (true);
                                 this.clearData();
              }
              this.Spinner = false;
        });
     };
  }

    // Edit
    editProcess(Doc_No) {
        this.tabIndexToView = 1;
        this.items = ['BROWSE', 'UPDATE'];
        this.buttonname = 'Update';

        this.$http.get('/Export_Transportation/Get_All_Data?Doc_No=' + Doc_No)
        .subscribe((data: any) => {
            this.transportationData = data ? JSON.parse(data) : [];
          console.log('Edit transportationData =>>', this.transportationData);
          if(this.transportationData.length > 0 ){

              this.objRawMaterial.Com_Inv_No = this.transportationData[0].Com_Inv_No;
              this.objRawMaterial.Doc_Date = this.transportationData[0].Doc_Date;
              this.objRawMaterial.Sub_Ledger_ID = this.transportationData[0].Sub_Ledger_ID;
              this.objRawMaterial.Truck_No = this.transportationData[0].Truck_No;
              this.objRawMaterial.Container_No = this.transportationData[0].Container_No;
              this.objRawMaterial.Seal_No = this.transportationData[0].Seal_No;
              this.objRawMaterial.Flexi_Tank_No = this.transportationData[0].Flexi_Tank_No;
            this.Doc_No = this.transportationData[0].Doc_No;
            this.rawMaterialObj = [...this.transportationData];
            console.log('this.rawMaterialObj Edit 88 =', this.rawMaterialObj);

          }
        });
    }

    // Delete
    onConfirm() {
      if (this.mfgProcessNo) {
        this.$http.post('/Export_Transportation/Delete_Export_Transportation', {'Doc_No' : this.mfgProcessNo})
        .subscribe((data: any) => {
            if (data.success === true) {
                this.onReject();
                this.compacctToast.clear();
                this.compacctToast.add({key: 'compacct-toast',
                                   severity: 'success',
                                   detail: 'Succesfully Deleted'});
                                   this.searchBagProcess (true);
              }
        });
      }
    }
    onReject() {
      this.compacctToast.clear('c');
    }
    deleteBagProcess (BagProcess) {
      if (BagProcess.Doc_No) {
        this.mfgProcessNo = BagProcess.Doc_No;
        this.compacctToast.clear();
        this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});
      }
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
      this.objRawMaterial = new RawMaterial();
      this.submitted = false;
      this.rawMaterialObj = [];
      this.rawMaterialMsg = '';
      this.Raw_Material_Cost_Cen_Main_Type ='STORE';
      this.checkRawMaterialQtyExist = false;
    if(this.tabIndexToView ==1){
      this.DocDate = new Date();
      this.objRawMaterial.Doc_Date = this.DateService.dateConvert(moment(this.DocDate, 'YYYY-MM-DD')['_d']);
     }
    }
  }

  class RawMaterial {
    Doc_No: string;
    Doc_Date: string;
    Cost_Cen_ID: number;
    Product_ID: number;
    Product_Name: number;
    Batch_Number: string;
    Qty	= 0;
    UOM	: string;
    Godown_ID: number;
    Tank_Open_Hight = 0;
    Tank_Close_Hight = 0;
    Tank_Open_Qty = 0;
    Tank_Close_Qty = 0;
    Tank_Calc = 0;
    Cost_Cen_Main_Type: string;
    Com_Inv_No:string;
    Sub_Ledger_ID: string;
    Truck_No: string;
    Container_No: string;
    Seal_No: string;
    Flexi_Tank_No:string;
  }





