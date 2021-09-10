import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-oil-production',
  templateUrl: './oil-production.component.html',
  styleUrls: ['./oil-production.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class OilProductionComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  items = [];
  BagProcessSearchSubmitted = false;
  createQCFormSubmitted = false;
  BagProcessID: number;
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
  //expDate = new Date();
  expDate: any;

// Bagprocess
  objBagProcess: BagProcess = new BagProcess();
  objRawMaterial: BagProcessRawMaterial = new BagProcessRawMaterial();
  objConsumable: BagProcessConsumable = new BagProcessConsumable();
  objWastage: BagProcessWastage = new BagProcessWastage();
  objFinal: BagProcessFinal = new BagProcessFinal();
  plantList:any[];
  storeList:any[];
  tankList:any[];
  godownList:any[];
  shiftList:any[];
  productList:any[];
  productDetails:any;
  productBatchno:any[];
  rawMaterialObj:any[]= [];

  tmp_Product_Description: string;
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
  Consumable_Cost_Cen_Main_Type:string ='STORE';
  Wastage_Cost_Cen_Main_Type:string ='STORE';
  Final_Cost_Cen_Main_Type:string ='STORE';
  rawMaterialGodownList:any[];
  editRawMaterialIndex:number =0;

  //Consum
  productDetailsConsum:any;
  productBatchnoConsum:any[];
  consumableObj:any[]= [];
  consumableList :any[];
  editConsumableIndex:number =0;
  consumableGodownList:any[];

// wastage
  wastageObj:any[]= [];
  wastageList:any[] = [];
  productBatchnoWastage:any[];
  productDetailsWastage:any;
  wastageFormSubmitted = false;
  wastageBatchNo:string;
  wastageGodownList:any[];
  editWastageIndex:number =0;

  //Final
  finalObj:any[]= [];
  finalList:any[] = [];
  productBatchnoFinal:any[];
  productDetailsFinal:any;
  finalFormSubmitted = false;
  net_final_qty:number;
  finalBatchNo:string;
  finalGodownList:any[];
  editFinalIndex:number =0;

  bagProcessData = [];
  rawMaterialData = [];
  consumableData = [];
  wastageData = [];
  finalData = [];
  mfgProcessNo:string;

  displayEwayModal:boolean = false;
  displayConsumableModal:boolean = false;
  displayWastageModal:boolean = false;
  displayFinalModal:boolean = false;
  rawMaterialMsg: string ='';
  consumablelMsg: string ='';
  wastageMsg: string ='';
  finalMsg: string ='';
  tank_cal:number = 0;
  product_expiry:boolean = false;

  constructor(
    private $http: HttpClient ,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader ,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private $CompacctAPI: CompacctCommonApi) {
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
    this.route.queryParams.subscribe(params => {
     // console.log('params =', params.Process);
      this.objBagProcess.Mfg_Process_Name = params.Process;
      this.Header.pushHeader({
        //'Header' : 'Oil Production',
        'Header' : this.objBagProcess.Mfg_Process_Name,
        'Link' : ' Material Management -> Master -> Master Cost Center'
      });
      this.searchBagProcessList = [];
    });
    //console.log('this.objBagProcess.Mfg_Process_Name =', this.objBagProcess.Mfg_Process_Name);

    const date = this.DateService.dateConvert(moment(new Date, 'YYYY-MM-DD')['_d']).split('/') ;
    const add2Year = Number(date[2]) + 2;
    this.expDate = date[0] + '/' + date[1] + '/' + add2Year;

    this.getPlants();
    this.getShifts();
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
    .set('to_date', end)
    .set('Mfg_Process_Name', this.objBagProcess.Mfg_Process_Name);

    this.$http.get('/Oil_Production/Get_Browse', {params : obj})
    .subscribe((data: any) => {
      this.searchBagProcessList =  data.length ? JSON.parse(data) : [];
      this.Spinner = false;
      //console.log('this.searchBagProcessList =', this.searchBagProcessList );
    });
}

getPlants() {
  this.$http.get('/Oil_Production/Get_Cost_Centre')
  .subscribe((data: any) => {
       const plantArr = data ? JSON.parse(data) : [];
       console.log('plantArr =', plantArr);

      //For searchable dropdown
       plantArr.forEach((val, index)=>{
            plantArr[index].label = val.Cost_Cen_Name,
            plantArr[index].value = val.Cost_Cen_ID
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
       // console.log('this.storeTankPlantList =', this.storeTankPlantList);

  });
}

getGodownForBagProcess(Cost_Cen_ID) {
   this.plantList.forEach((value, index)=>{
     if(value.Cost_Cen_ID === Cost_Cen_ID){
         this.objBagProcess.Cost_Cen_Name  = value.Cost_Cen_Name;
     }
   });

   this.objBagProcess.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.$http.get('/Oil_Production/Get_GoDown?Cost_Cen_ID=' + Cost_Cen_ID)
      .subscribe((data: any) => {
          this.godownList = data ? JSON.parse(data) : [];
          this.getData();
      });
}

getGodown(Cost_Cen_ID) {
 this.$http.get('/Oil_Production/Get_GoDown?Cost_Cen_ID=' + Cost_Cen_ID)
  .subscribe((data: any) => {
       this.godownList = data ? JSON.parse(data) : [];
      // console.log('godown list =', this.godownList);
  });
}

getShifts() {
  this.$http.get('/Oil_Production/Get_Shift')
  .subscribe((data: any) => {
       this.shiftList = data ? JSON.parse(data) : [];
       //console.log('shiftList =', this.shiftList)
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

     //console.log('productList 22 =', this.productList);

       /************* CONSUMABLE *************/
       this.consumableList = productArr.filter((value:any)=>{
        //return value.Material_Type === 'CONSUMABLE';
        return (value.Material_Type === 'CONSUMABLE' || value.Material_Type === 'FINAL');
      });

      // For autocomplete
      this.consumableList.forEach((val, index)=>{
        this.consumableList[index].label = val.Product_Description;
        this.consumableList[index].value = val.Product_ID;
      });
       /************* FINAL *************/

      this.finalList = productArr.filter((value:any)=>{
        return value.Material_Type === 'FINAL';
      });

      // For autocomplete
      this.finalList.forEach((val, index)=>{
        this.finalList[index].label = val.Product_Description;
        this.finalList[index].value = val.Product_ID;
      });

     // console.log('finalLis 88 =', this.finalList);
       /************* WASTAGE *************/

      this.wastageList = [...this.consumableList, ...this.finalList];

         // For autocomplete
         this.wastageList.forEach((val, index)=>{
          this.wastageList[index].label = val.Product_Description;
          this.wastageList[index].value = val.Product_ID;
        });

  });
}

getData(){
  this.rawMaterialObj = [];
  this.consumableObj = [];
  this.wastageObj = [];
  this.finalObj = [];

  if(this.objBagProcess.Cost_Cen_ID != undefined  && this.objBagProcess.Godown_ID != undefined  && this.objBagProcess.Shift_ID != undefined ){
    this.editProcess(this.objBagProcess.Process_Date, this.mfgProcessNo , this.objBagProcess.Cost_Cen_ID, this.objBagProcess.Godown_ID, this.objBagProcess.Shift_ID);
  }
}

/* ######################################  Raw material  ###################################### */

getGodownForRawMaterial(Cost_Cen_ID) {
  this.rawMaterialMsg = '';
    this.objRawMaterial.Product_ID = undefined;
    this.objRawMaterial.Batch_No = undefined;
    this.objRawMaterial.Qty = 0;
    this.objRawMaterial.UOM = undefined;
    this.objRawMaterial.Tank_Open_Hight  = 0;
    this.objRawMaterial.Tank_Close_Hight  = 0;
    this.objRawMaterial.Tank_Open_Qty  = 0;
    this.objRawMaterial.Tank_Close_Qty  = 0;

  this.storeTankPlantList.forEach((value, index)=>{
     if(value.Cost_Cen_ID === Cost_Cen_ID){
        this.Raw_Material_Cost_Cen_Main_Type =  value.Cost_Cen_Main_Type;
        this.objRawMaterial.Tank_Radus =  value.Tank_Radus;
        this.objRawMaterial.Tank_Width =  value.Tank_Width;
        this.objRawMaterial.Tank_Length = value.Tank_Length;
        this.objRawMaterial.Cost_Cen_Main_Type = value.Cost_Cen_Main_Type;
        this.objRawMaterial.Tank_Calc = value.Tank_Calc;
     }
   })

   this.objBagProcess.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.$http.get('/Oil_Production/Get_GoDown?Cost_Cen_ID=' + Cost_Cen_ID)
      .subscribe((data: any) => {
         this.rawMaterialGodownList = data ? JSON.parse(data) : [];

      });
}

getBatchNoForRawMaterial(Product_ID) {
  this.productList.forEach((value, index)=>{
    if(value.Product_ID === Product_ID){
        this.tmp_Product_Description  = value.Product_Description;
        return;
    }
  })

  this.$http.get('/common/Get_Stock_Qty?CostCenID=' + this.objRawMaterial.Cost_Cen_ID + '&ProductID=' + Product_ID + '&GodownID=' + this.objRawMaterial.Godown_ID + '&Report_type='+ "STOCK WITH BATCH")
   .subscribe((data: any) => {
      this.productBatchno = data ? JSON.parse(data) : [];
      console.log('this.productBatchno =', this.productBatchno);
   });

   this.$http.get('/Master_Product_V2/Get_Product?_Product_ID=' + Product_ID)
   .subscribe((data: any) => {
      const rawMaterialUOM = data ? JSON.parse(data) : [];
        if(rawMaterialUOM.length > 0){
          this.objRawMaterial.UOM =  rawMaterialUOM[0].UOM;
        }
   });
 }

getProductDetails(Batch_No) {
     this.objRawMaterial.Qty = 0;
      if(this.tabIndexToView == 0){
        this.tmp_rawmaterial_qty =  0;
      }
      this.productDetails = this.productBatchno.filter((value:any, index)=>{
        return value.Batch_No == Batch_No;
      });
      console.log('productDetails =', this.productDetails);

      if(this.Raw_Material_Cost_Cen_Main_Type ==='STORE-TANK'){
        this.objRawMaterial.Tank_Open_Qty  =  this.productDetails[0].QTY;
        this.objRawMaterial.Tank_Open_Hight = this.objRawMaterial.Tank_Open_Qty / this.objRawMaterial.Tank_Calc;
        // console.log('this.objRawMaterial.Tank_Open_Qty =', this.objRawMaterial.Tank_Open_Qty);
        // console.log('this.objRawMaterial.Tank_Calc =', this.objRawMaterial.Tank_Calc);
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

 addRawMaterial(valid){
  this.bagProcessFormSubmitted = true;
  this.rawMaterialFormSubmitted = true;

  this.rawMaterialMsg = '';
  let valueExist = false;
  this.rawMaterialObj.forEach((val, index)=>{
      if((val.Product_ID === this.objRawMaterial.Product_ID) && (val.Batch_No === this.objRawMaterial.Batch_No)){
        valueExist = true;
      }
   })

   //setTimeout(() => {
    if(!valueExist){
      const obj ={
        Product_Description: this.tmp_Product_Description,
        Product_ID: this.objRawMaterial.Product_ID,
        Batch_No: this.objRawMaterial.Batch_No,
        Qty: this.objRawMaterial.Qty,
        UOM: this.objRawMaterial.UOM,
        Mfg_Process_No: 'A',
        Cost_Cen_ID: this.objRawMaterial.Cost_Cen_ID,
        Godown_ID: this.objRawMaterial.Godown_ID,
        Tank_Open_Hight: this.objRawMaterial.Tank_Open_Hight,
        Tank_Close_Hight: this.objRawMaterial.Tank_Close_Hight,
        Tank_Open_Qty: this.objRawMaterial.Tank_Open_Qty,
        Tank_Close_Qty: this.objRawMaterial.Tank_Close_Qty,
        Tank_Radus: this.objRawMaterial.Tank_Radus,
        Tank_Width: this.objRawMaterial.Tank_Width,
        Tank_Length: this.objRawMaterial.Tank_Length,
        Cost_Cen_Main_Type: this.objRawMaterial.Cost_Cen_Main_Type,
        Tank_Calc: this.objRawMaterial.Tank_Calc
       };
      this.rawMaterialObj.push(obj);
       console.log('this.rawMaterialObj =', this.rawMaterialObj);
       this.objRawMaterial.Product_ID = undefined;
       this.objRawMaterial.Batch_No = undefined;
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
  //}, 500);
 }

 rawMaterialCancel(){
   this.displayEwayModal=false;
   this.rawMaterialMsg = '';
 }

 deleteRawMaterial(index){
  this.rawMaterialObj.splice(index, 1);
}

/* ######################################  Consumable  ###################################### */

getGodownForConsumable(Cost_Cen_ID) {
  this.consumablelMsg = '';
 this.objConsumable.Tank_Open_Hight  = 0;
 this.objConsumable.Tank_Close_Hight  = 0;
 this.objConsumable.Tank_Open_Qty  = 0;
 this.objConsumable.Tank_Close_Qty  = 0;

  this.storeTankPlantList.forEach((value, index)=>{
     if(value.Cost_Cen_ID === Cost_Cen_ID){
        this.Consumable_Cost_Cen_Main_Type =  value.Cost_Cen_Main_Type;
        this.objConsumable.Cost_Cen_Main_Type = value.Cost_Cen_Main_Type;
        this.objConsumable.Tank_Calc = value.Tank_Calc;
     }
   });

   this.objBagProcess.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.$http.get('/Oil_Production/Get_GoDown?Cost_Cen_ID=' + Cost_Cen_ID)
      .subscribe((data: any) => {
         this.consumableGodownList = data ? JSON.parse(data) : [];
      });
}

getBatchNoForConsumable(Product_ID) {
  this.consumableList.forEach((value, index)=>{
    if(value.Product_ID === Product_ID){
        this.tmp_Product_Desc_Consum  = value.Product_Description;
        return;
    }
  });

  this.$http.get('/common/Get_Stock_Qty?CostCenID=' + this.objConsumable.Cost_Cen_ID + '&ProductID=' + Product_ID + '&GodownID=' + this.objConsumable.Godown_ID + '&Report_type='+ "STOCK WITH BATCH AND BAG")
  .subscribe((data: any) => {
     this.productBatchnoConsum = data ? JSON.parse(data) : [];
     console.log('this.productBatchnoConsum =', this.productBatchnoConsum);
  });

   this.$http.get('/Master_Product_V2/Get_Product?_Product_ID=' + Product_ID)
   .subscribe((data: any) => {
      const consumableUOM = data ? JSON.parse(data) : [];
        if(consumableUOM.length > 0){
          this.objConsumable.UOM =  consumableUOM[0].UOM;
        }
   });
 }

getProductDetailsForConsumanble(Batch_No) {
      if(this.tabIndexToView == 0){
        this.tmp_consumable_qty =  0;
      }
      this.productDetailsConsum = this.productBatchnoConsum.filter((value:any, index)=>{
        return value.Batch_No == Batch_No;
      });
      console.log('productDetailsConsum =', this.productDetailsConsum);

      if(this.Consumable_Cost_Cen_Main_Type !=='STORE-TANK'){
        this.tmp_consumable_qty =  this.productDetailsConsum[0].QTY;
        this.objConsumable.Qty =  this.productDetailsConsum[0].QTY;
      }
 }

 checkQtyForConsumanble(Consumable_Qty) {
  if(Consumable_Qty > this.tmp_consumable_qty ){
    this.checkConsumableQtyExist = true;
  }else{
    this.checkConsumableQtyExist = false;
  }
}

tankOpenQtyForConsumable(){
  this.objConsumable.Tank_Open_Qty = this.objConsumable.Tank_Open_Hight * this.objConsumable.Tank_Calc;
  if(this.objConsumable.Tank_Close_Hight != undefined && this.objConsumable.Tank_Close_Hight > 0){
    this.tankCloseQtyForConsumable();
  }
}

tankCloseQtyForConsumable(){
  if(this.objConsumable.Tank_Close_Hight == undefined){
    this.objConsumable.Qty = 0;
    this.objConsumable.Tank_Close_Qty = 0;
    this.consumablelMsg = 'Tank close height should be smaller than open height';
  } else{
      this.objConsumable.Qty = 0;
      this.objConsumable.Tank_Close_Qty = 0;
      this.consumablelMsg  = '';
      if(this.objConsumable.Tank_Close_Hight > this.objConsumable.Tank_Open_Hight){
          this.consumablelMsg = 'Tank close height should be smaller than open height';
      }else{
          this.objConsumable.Tank_Close_Qty = this.objConsumable.Tank_Close_Hight * this.objConsumable.Tank_Calc;
          this.objConsumable.Qty =  this.objConsumable.Tank_Open_Qty -  this.objConsumable.Tank_Close_Qty;
      }
  }
}

editConsumanble(index){
  this.displayConsumableModal = true;
  this.editConsumableIndex = index;
  //console.log('this.consumableObj Final =', this.consumableObj);
   this.objConsumable.Tank_Open_Hight = this.consumableObj[this.editConsumableIndex].Tank_Open_Hight;
   this.objConsumable.Tank_Close_Hight = this.consumableObj[this.editConsumableIndex].Tank_Close_Hight;
   this.objConsumable.Tank_Close_Qty =  this.consumableObj[this.editConsumableIndex].Tank_Close_Qty;
   this.objConsumable.Tank_Open_Qty =  this.consumableObj[this.editConsumableIndex].Tank_Open_Qty;
   this.objConsumable.Tank_Calc =  this.consumableObj[this.editConsumableIndex].Tank_Calc;
}
consumableUpdate(){
 if(this.consumablelMsg ==''){
    this.tankCloseQtyForConsumable();
    this.consumableObj[this.editConsumableIndex].Tank_Open_Hight = this.objConsumable.Tank_Open_Hight;
    this.consumableObj[this.editConsumableIndex].Tank_Close_Hight = this.objConsumable.Tank_Close_Hight;
    this.consumableObj[this.editConsumableIndex].Tank_Close_Qty = this.objConsumable.Tank_Close_Qty;
    this.consumableObj[this.editConsumableIndex].Tank_Open_Qty = this.objConsumable.Tank_Open_Qty;
    this.consumableObj[this.editConsumableIndex].Qty = this.objConsumable.Qty;

    this.consumablelMsg = '';
    this.displayConsumableModal = false;
    this.editConsumableIndex = 0;
    this.objConsumable.Tank_Open_Hight = 0;
    this.objConsumable.Tank_Close_Hight = 0;
    this.objConsumable.Tank_Open_Qty =  0;
    this.objConsumable.Tank_Close_Qty =  0;
    this.objConsumable.Qty =  0;
 }
}

addConsumable(){
  this.consumablelMsg = '';
  let valueExist = false;
  this.consumableObj.forEach((val, index)=>{
      if((val.Product_ID === this.objConsumable.Product_ID) && (val.Batch_No === this.objConsumable.Batch_No)){
        valueExist = true;
      }
   })

  // setTimeout(() => {
    if(!valueExist){
      const obj ={
        Product_Description: this.tmp_Product_Desc_Consum,
        Product_ID: this.objConsumable.Product_ID,
        Batch_No: this.objConsumable.Batch_No,
        Qty: this.objConsumable.Qty,
        UOM: this.objConsumable.UOM,
        Mfg_Process_No: 'A',
        Cost_Cen_ID: this.objConsumable.Cost_Cen_ID,
        Godown_ID: this.objConsumable.Godown_ID,
        Tank_Open_Hight: this.objConsumable.Tank_Open_Hight,
        Tank_Close_Hight: this.objConsumable.Tank_Close_Hight,
        Tank_Open_Qty: this.objConsumable.Tank_Open_Qty,
        Tank_Close_Qty: this.objConsumable.Tank_Close_Qty,
        Cost_Cen_Main_Type: this.objConsumable.Cost_Cen_Main_Type,
        Tank_Calc: this.objConsumable.Tank_Calc
       };
      this.consumableObj.push(obj);
       console.log('this.consumableObj =', this.consumableObj);
       this.objConsumable.Product_ID = undefined;
       this.objConsumable.Batch_No = undefined;
       this.objConsumable.Qty = undefined;
       this.objConsumable.UOM = undefined;
      this.objConsumable.Tank_Open_Hight  = undefined;
      this.objConsumable.Tank_Close_Hight  = undefined;
      this.objConsumable.Tank_Open_Qty  = undefined;
      this.objConsumable.Tank_Close_Qty  = undefined;
      this.objConsumable.Cost_Cen_ID = undefined;
      this.objConsumable.Tank_Close_Qty  = undefined;
      this.objConsumable.Godown_ID  = undefined;
       valueExist = false;
    }else {
      this.consumablelMsg = 'This product already exist please remove and add again.';
    }
  //}, 500);
 }

 consumableCancel(){
   this.displayConsumableModal=false;
   this.consumablelMsg = '';
 }

 deleteConsumable(index){
  this.consumableObj.splice(index, 1);
}

/* ######################################  Wastage  ###################################### */

getGodownForWastage(Cost_Cen_ID) {
this.wastageMsg = '';
this.objWastage.Qty = 0;
this.objWastage.Tank_Open_Hight  = 0;
this.objWastage.Tank_Close_Hight  = 0;
this.objWastage.Tank_Open_Qty  = 0;
this.objWastage.Tank_Close_Qty  = 0;

  this.storeTankList.forEach((value, index)=>{
     if(value.Cost_Cen_ID === Cost_Cen_ID){
        this.Wastage_Cost_Cen_Main_Type =  value.Cost_Cen_Main_Type;
        this.objWastage.Tank_Radus =  value.Tank_Radus;
        this.objWastage.Tank_Width =  value.Tank_Width;
        this.objWastage.Tank_Length = value.Tank_Length;
        this.objWastage.Cost_Cen_Main_Type = value.Cost_Cen_Main_Type;
        this.wastageBatchNo = value.Cost_Cen_Ini;
        this.objWastage.Tank_Calc = value.Tank_Calc;
     }
   })
   //console.log('this.objWastage.Tank_Calc =', this.objWastage.Tank_Calc)

    this.$http.get('/Oil_Production/Get_GoDown?Cost_Cen_ID=' + Cost_Cen_ID)
      .subscribe((data: any) => {
          this.wastageGodownList = data ? JSON.parse(data) : [];
      });
}

getBatchNoForWastage(Product_ID) {
  this.objWastage.Batch_No = '';

  this.wastageList.forEach((value, index)=>{
    if(value.Product_ID === Product_ID){
        this.tmp_Product_Desc_Wastage  = value.Product_Description;
        return;
    }
  });

  //wastage bach no
  const processData = moment(this.objBagProcess.Process_Date).format('YYYY-MM-DD').replace(/-|\s/g,"");
  this.objWastage.Batch_No = this.wastageBatchNo + processData + Product_ID;

  this.$http.get('/Master_Product_V2/Get_Product?_Product_ID=' + Product_ID)
  .subscribe((data: any) => {
     const wastageUOM = data ? JSON.parse(data) : [];
       if(wastageUOM.length > 0){
         this.objWastage.UOM =  wastageUOM[0].UOM;
       }
  });

 }

tankOpenQtyForWastage(){
  this.objWastage.Tank_Open_Qty = this.objWastage.Tank_Open_Hight * this.objWastage.Tank_Calc;
  if(this.objWastage.Tank_Close_Hight != undefined && this.objWastage.Tank_Close_Hight > 0){
    this.tankCloseQtyForWastage();
  }
}

tankCloseQtyForWastage(){
  if(this.objWastage.Tank_Close_Hight == undefined){
    this.objWastage.Qty = 0;
    this.objWastage.Tank_Close_Qty = 0;
    this.wastageMsg = 'Tank close height should be grater than open height';
  } else{
      this.objWastage.Qty = 0;
      this.objWastage.Tank_Close_Qty = 0;
      this.wastageMsg  = '';
      if(this.objWastage.Tank_Close_Hight < this.objWastage.Tank_Open_Hight){
        this.wastageMsg = 'Tank close height should be grater than open height';
      }else{
          this.objWastage.Tank_Close_Qty = this.objWastage.Tank_Close_Hight * this.objWastage.Tank_Calc;
          this.objWastage.Qty =  this.objWastage.Tank_Close_Qty  - this.objWastage.Tank_Open_Qty;
      }
  }
}

editWastage(index){
  this.displayWastageModal = true;
  this.editWastageIndex = index;
  //console.log('this.wastageObj Final =', this.wastageObj);
   this.objWastage.Tank_Open_Hight = this.wastageObj[this.editWastageIndex].Tank_Open_Hight;
   this.objWastage.Tank_Close_Hight = this.wastageObj[this.editWastageIndex].Tank_Close_Hight;
   this.objWastage.Tank_Close_Qty =  this.wastageObj[this.editWastageIndex].Tank_Close_Qty;
   this.objWastage.Tank_Open_Qty =  this.wastageObj[this.editWastageIndex].Tank_Open_Qty;
   this.objWastage.Tank_Calc =  this.wastageObj[this.editWastageIndex].Tank_Calc;
}
wastageUpdate(){
 if(this.wastageMsg ==''){
    this.tankCloseQtyForWastage();
    this.wastageObj[this.editWastageIndex].Tank_Open_Hight = this.objWastage.Tank_Open_Hight;
    this.wastageObj[this.editWastageIndex].Tank_Close_Hight = this.objWastage.Tank_Close_Hight;
    this.wastageObj[this.editWastageIndex].Tank_Close_Qty = this.objWastage.Tank_Close_Qty;
    this.wastageObj[this.editWastageIndex].Tank_Open_Qty = this.objWastage.Tank_Open_Qty;
    this.wastageObj[this.editWastageIndex].Qty = this.objWastage.Qty;

    this.wastageMsg = '';
    this.displayWastageModal = false;
    this.editWastageIndex = 0;
    this.objWastage.Tank_Open_Hight = 0;
   this.objWastage.Tank_Close_Hight = 0;
   this.objWastage.Tank_Open_Qty =  0;
   this.objWastage.Tank_Close_Qty =  0;
   this.objWastage.Qty =  0;
 }
}

addWastage(valid){
  this.bagProcessFormSubmitted = true;
  this.rawMaterialFormSubmitted = true;
  this.consumableFormSubmitted = true;
  this.wastageFormSubmitted = true;
  this.wastageMsg = '';
  let valueExist = false;

    this.wastageObj.forEach((val, index)=>{
        if(val.Batch_No === this.objWastage.Batch_No){
          valueExist = true;
        }
    });

   //setTimeout(() => {
    if(!valueExist){
      const obj3 ={
        Product_Description: this.tmp_Product_Desc_Wastage,
        Product_ID: this.objWastage.Product_ID,
        Batch_No: this.objWastage.Batch_No,
        Qty: this.objWastage.Qty,
        UOM: this.objWastage.UOM,
        Mfg_Process_No: 'A',
        Cost_Cen_ID: this.objBagProcess.Cost_Cen_ID,
        Godown_ID: this.objBagProcess.Godown_ID,
        Cost_Cen_ID_To: this.objWastage.Cost_Cen_ID_To,
        Godown_ID_To: this.objWastage.Godown_ID_To,
        Tank_Open_Hight: this.objWastage.Tank_Open_Hight,
        Tank_Close_Hight: this.objWastage.Tank_Close_Hight,
        Tank_Open_Qty: this.objWastage.Tank_Open_Qty,
        Tank_Close_Qty: this.objWastage.Tank_Close_Qty,
        Tank_Radus: this.objWastage.Tank_Radus,
        Tank_Width: this.objWastage.Tank_Width,
        Tank_Length: this.objWastage.Tank_Length,
        Cost_Cen_Main_Type: this.objWastage.Cost_Cen_Main_Type,
        Tank_Calc: this.objWastage.Tank_Calc
       };
      this.wastageObj.push(obj3);
       console.log('this.wastageObj =', this.wastageObj);

       this.objWastage.Product_ID = undefined;
       this.objWastage.Batch_No = undefined;
       this.objWastage.Qty = 0;
       this.objWastage.Tank_Open_Hight  = 0;
       this.objWastage.Tank_Close_Hight  = 0;
       this.objWastage.Tank_Open_Qty  = 0;
       this.objWastage.Tank_Close_Qty  = 0;
       this.objWastage.Cost_Cen_ID_To  = undefined;
       this.objWastage.Godown_ID_To  = undefined;
       valueExist = false;
    }else{
      this.wastageMsg = 'This product already exist please remove and add again.';
    }
 // }, 500);
 }

wastageCancel(){
  this.displayWastageModal=false;
  this.wastageMsg = '';
}
deleteWastage(index){
  this.wastageObj.splice(index, 1);
 }

/* ######################################  Final  ###################################### */

getGodownForFianl(Cost_Cen_ID) {
  this.finalMsg = '';
  this.objFinal.Product_ID = undefined;
  this.objFinal.Batch_No = undefined;
  this.objFinal.Qty = 0;
  this.objFinal.Qty_Bag = 0;
  this.objFinal.Per_Bag = 0;
  this.objFinal.Tank_Open_Hight  = 0;
  this.objFinal.Tank_Close_Hight  = 0;
  this.objFinal.Tank_Open_Qty  = 0;
  this.objFinal.Tank_Close_Qty  = 0;

  // Date
  this.objFinal.Mfg_Date = this.DateService.dateConvert(moment(new Date, 'YYYY-MM-DD')['_d']);
  const date = this.DateService.dateConvert(moment(new Date, 'YYYY-MM-DD')['_d']).split('/') ;
  //console.log('expData2 =', date[2]);
  const add2Year = Number(date[2]) + 2;
  this.objFinal.Exp_Date = date[0] + '/' + date[1] + '/' + add2Year;

 // console.log('this.objFinal.Mfg_Date 22 =', this.objFinal.Mfg_Date)
 // console.log('this.objFinal.Exp_Date  22 =', this.objFinal.Exp_Date)

  this.storeTankList.forEach((value, index)=>{
     if(value.Cost_Cen_ID === Cost_Cen_ID){
        this.Final_Cost_Cen_Main_Type =  value.Cost_Cen_Main_Type;
        this.objFinal.Tank_Radus =  value.Tank_Radus;
        this.objFinal.Tank_Width =  value.Tank_Width;
        this.objFinal.Tank_Length = value.Tank_Length;
        this.objFinal.Cost_Cen_Main_Type = value.Cost_Cen_Main_Type;
        this.finalBatchNo = value.Cost_Cen_Ini;
        this.objFinal.Tank_Calc = value.Tank_Calc;
     }
   });
   //console.log('this.objFinal.Tank_Calc =', this.objFinal.Tank_Calc);

    this.$http.get('/Oil_Production/Get_GoDown?Cost_Cen_ID=' + Cost_Cen_ID)
      .subscribe((data: any) => {
          this.finalGodownList = data ? JSON.parse(data) : [];
     });
}

getBatchNoForFinal(Product_ID) {
  this.objFinal.Batch_No = '';
  this.finalList.forEach((value, index)=>{
    if(value.Product_ID === Product_ID){
        this.tmp_Product_Desc_Final  = value.Product_Description;
        this.product_expiry = value.Product_Expiry;
        return;
    }
  });

  const processData = moment(this.objBagProcess.Process_Date).format('YYYY-MM-DD').replace(/-|\s/g,"");;
  this.objFinal.Batch_No = this.finalBatchNo + processData + Product_ID;

  this.$http.get('/Master_Product_V2/Get_Product?_Product_ID=' + Product_ID)
  .subscribe((data: any) => {
     const finalUOM = data ? JSON.parse(data) : [];
       if(finalUOM.length > 0){
         this.objFinal.UOM =  finalUOM[0].UOM;
       }
  });
 }

tankOpenQtyForFinal(){
  this.objFinal.Tank_Open_Qty = this.objFinal.Tank_Open_Hight * this.objFinal.Tank_Calc;
  if(this.objFinal.Tank_Close_Hight != undefined && this.objFinal.Tank_Close_Hight > 0){
    this.tankCloseQtyForFinal();
  }
}
tankCloseQtyForFinal(){
    if(this.objFinal.Tank_Close_Hight == undefined){
      this.objFinal.Qty = 0;
      this.objFinal.Tank_Close_Qty = 0;
      this.finalMsg = 'Tank close height should be grater than open height';
    } else{
        this.objFinal.Qty = 0;
        this.objFinal.Tank_Close_Qty = 0;
        this.finalMsg  = '';
         if(this.objFinal.Tank_Close_Hight < this.objFinal.Tank_Open_Hight){
            this.finalMsg = 'Tank close height should be grater than open height';
        }else{
            this.objFinal.Tank_Close_Qty = this.objFinal.Tank_Close_Hight * this.objFinal.Tank_Calc;
            this.objFinal.Qty =  this.objFinal.Tank_Close_Qty  - this.objFinal.Tank_Open_Qty;
        }
    }
}
editFinal(index){
  this.displayFinalModal = true;
  this.editFinalIndex = index;
  //console.log('this.finalObj Final =', this.finalObj);
   this.objFinal.Tank_Open_Hight = this.finalObj[this.editFinalIndex].Tank_Open_Hight;
   this.objFinal.Tank_Close_Hight = this.finalObj[this.editFinalIndex].Tank_Close_Hight;
   this.objFinal.Tank_Close_Qty =  this.finalObj[this.editFinalIndex].Tank_Close_Qty;
   this.objFinal.Tank_Open_Qty =  this.finalObj[this.editFinalIndex].Tank_Open_Qty;
   this.objFinal.Tank_Calc =  this.finalObj[this.editFinalIndex].Tank_Calc;
}
finalUpdate(){
 if(this.consumablelMsg ==''){
    this.tankCloseQtyForFinal();
    this.finalObj[this.editFinalIndex].Tank_Open_Hight = this.objFinal.Tank_Open_Hight;
    this.finalObj[this.editFinalIndex].Tank_Close_Hight = this.objFinal.Tank_Close_Hight;
    this.finalObj[this.editFinalIndex].Tank_Close_Qty = this.objFinal.Tank_Close_Qty;
    this.finalObj[this.editFinalIndex].Tank_Open_Qty = this.objFinal.Tank_Open_Qty;
    this.finalObj[this.editFinalIndex].Qty = this.objFinal.Qty;

    this.finalMsg = '';
    this.displayFinalModal = false;
    this.editFinalIndex = 0;
    this.objFinal.Tank_Open_Hight = 0;
    this.objFinal.Tank_Close_Hight = 0;
    this.objFinal.Tank_Open_Qty =  0;
    this.objFinal.Tank_Close_Qty =  0;
    this.objFinal.Qty =  0;
 }
}

addFinal(){
  this.bagProcessFormSubmitted = true;
  this.rawMaterialFormSubmitted = true;
  this.consumableFormSubmitted = true;
  this.wastageFormSubmitted = true;
  this.finalFormSubmitted = true;

  this.finalMsg = '';
  let valueExist = false;

  this.finalObj.forEach((val, index)=>{
    if(val.Batch_No === this.objFinal.Batch_No){
      valueExist = true;
    }
 })

 if(!this.product_expiry){
   this.objFinal.Mfg_Date = '';
   this.objFinal.Exp_Date = '';
 }

    if(!valueExist){
      const obj4 ={
        Product_Description: this.tmp_Product_Desc_Final,
        Product_ID: this.objFinal.Product_ID,
        Batch_No: this.objFinal.Batch_No,
        Qty: this.objFinal.Qty,
        UOM: this.objFinal.UOM,
        Mfg_Process_No: 'A',
        Cost_Cen_ID: this.objBagProcess.Cost_Cen_ID,
        Godown_ID: this.objBagProcess.Godown_ID,
        Cost_Cen_ID_To: this.objFinal.Cost_Cen_ID_To,
        Godown_ID_To: this.objFinal.Godown_ID_To,
        Qty_Bag: this.objFinal.Qty_Bag,
        Per_Bag: this.objFinal.Per_Bag,
        Tank_Open_Hight: this.objFinal.Tank_Open_Hight,
        Tank_Close_Hight: this.objFinal.Tank_Close_Hight,
        Tank_Open_Qty: this.objFinal.Tank_Open_Qty,
        Tank_Close_Qty: this.objFinal.Tank_Close_Qty,
        Tank_Radus: this.objFinal.Tank_Radus,
        Tank_Width: this.objFinal.Tank_Width,
        Tank_Length: this.objFinal.Tank_Length,
        Cost_Cen_Main_Type: this.objFinal.Cost_Cen_Main_Type,
        Tank_Calc: this.objFinal.Tank_Calc,
        Mfg_Date: this.objFinal.Mfg_Date ,
        Exp_Date: this.objFinal.Exp_Date
       };
      this.finalObj.push(obj4);
       console.log('this.finalObj =', this.finalObj);
      this.objFinal.Product_ID = undefined;
      this.objFinal.Batch_No = undefined;
      this.objFinal.Qty = 0;
      this.objFinal.Qty_Bag = 0;
      this.objFinal.Per_Bag = 0;
      this.objFinal.Tank_Open_Hight  = 0;
      this.objFinal.Tank_Close_Hight  = 0;
      this.objFinal.Tank_Open_Qty  = 0;
      this.objFinal.Tank_Close_Qty  = 0;
      this.objFinal.Cost_Cen_ID_To = undefined;
      this.objFinal.Godown_ID_To = undefined;
       valueExist = false;
       this.product_expiry = false;
    }else{
      this.finalMsg = 'This product already exist please remove and add again.';
    }
 }

finalCancel(){
  this.displayFinalModal=false;
  this.finalMsg = '';
}
deleteFinal(index){
  this.finalObj.splice(index, 1);
}

 netQtyCal(){
  this.objFinal.Qty = this.objFinal.Qty_Bag * this.objFinal.Per_Bag;
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
        this.objBagProcess.Process_Date = this.DateService.dateConvert(moment(docDate, 'YYYY-MM-DD')['_d']);
        this.getData();
      }
  }

  getMfDate (mfDate) {
    if (mfDate) {
        this.objFinal.Mfg_Date = this.DateService.dateConvert(moment(mfDate, 'YYYY-MM-DD')['_d']);
        //this.getData();
      }
  }
  getExpDate (expDate) {
    if (expDate) {
        this.objFinal.Exp_Date = this.DateService.dateConvert(moment(expDate, 'YYYY-MM-DD')['_d']);
        //this.getData();
      }
  }

  // Save
  SaveBagProcessMaster (valid) {
    this.bagProcessFormSubmitted = true;
    this.rawMaterialFormSubmitted = true;
    this.objBagProcess.Mfg_Process_No = 'A';
    console.log('this.objBagProcess =', this.objBagProcess);
    console.log('this.rawMaterialObj =', this.rawMaterialObj);
    console.log('this.consumableObj =', this.consumableObj);
    console.log('this.wastageObj =', this.wastageObj);
    console.log('this.finalObj =', this.finalObj);

   // if (valid) {
      this.Spinner = true;
      const UrlAddress = '/Oil_Production/Insert_Oil_Production';
      const obj = {
        'json_Txn_Bag_Process': JSON.stringify([this.objBagProcess]),
        'json_Txn_Bag_Process_Raw_Material': JSON.stringify(this.rawMaterialObj) ,
        'json_Txn_Bag_Process_Consu': JSON.stringify(this.consumableObj),
        'json_Txn_Bag_Process_Wastage': JSON.stringify(this.wastageObj),
        'json_Txn_Bag_Process_Final': JSON.stringify(this.finalObj)
       };
      this.$http.post(UrlAddress, obj )
      .subscribe((data: any) => {
          if (data.success) {
              this.componentDisplay = true;
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                severity: 'success',
                                // summary: 'Oil Production Saved',
                                summary: this.objBagProcess.Mfg_Process_Name  + ' Saved',
                                detail: 'Succesfully Saved'});
                               this.searchBagProcess (valid);
                              this.clearData();
            }
            this.Spinner = false;
      });
  }

  // Edit
  editProcess(Process_Date, Mfg_Process_No, Cost_Cen_ID, Godown_ID, Shift_ID) {
      this.tabIndexToView = 1;

      this.$http.get('/Oil_Production/Get_Bag_Process?Process_Date=' + Process_Date + '&Cost_Cen_ID=' + Cost_Cen_ID + '&Godown_ID=' + Godown_ID + '&Shift_ID=' + Shift_ID + '&Mfg_Process_Name=' + this.objBagProcess.Mfg_Process_Name)
      .subscribe((data: any) => {
          this.bagProcessData = data ? JSON.parse(data) : [];
        console.log('Edit bagProcessData =>>', this.bagProcessData);
        if(this.bagProcessData.length > 0 ){
          this.objBagProcess.Cost_Cen_ID = this.bagProcessData[0].Cost_Cen_ID;
          this.objBagProcess.Godown_ID = this.bagProcessData[0].Godown_ID;
          this.objBagProcess.Shift_ID = this.bagProcessData[0].Shift_ID;
          this.DocDate = moment(this.bagProcessData[0].Process_Date, 'YYYY-MM-DD')['_d'];
          this.objBagProcess.Process_Date = this.bagProcessData[0].Process_Date;
          this.mfgProcessNo = this.bagProcessData[0].Mfg_Process_No;
          this.objBagProcess.User_ID = this.bagProcessData[0].User_ID;
          this.objBagProcess.Cost_Cen_Name = this.bagProcessData[0].Cost_Cen_Name;
          this.wastageBatchNo = this.bagProcessData[0].Cost_Cen_Ini;
          this.finalBatchNo = this.bagProcessData[0].Cost_Cen_Ini;

          this.getGodown(this.objBagProcess.Cost_Cen_ID);
          this.getProcessData(this.mfgProcessNo);
        }
      });
  }

  getProcessData(Mfg_Process_No){
     this.$http.get('/Oil_Production/Get_Bag_Process_Raw_Material?Mfg_Process_No=' + Mfg_Process_No )
    .subscribe((data: any) => {
        this.rawMaterialData = data ? JSON.parse(data) : [];
         console.log('Edit rawMaterialData =>>', this.rawMaterialData);

        this.rawMaterialData.forEach((value, index)=>{
          let obj1 ={
            Product_Description: value.Product_Description,
            Product_ID: value.Product_ID,
            Batch_No: value.Batch_No,
            Qty: value.Qty,
            UOM: value.UOM,
            Mfg_Process_No: 'A',
            Cost_Cen_ID: value.Cost_Cen_ID,
            Godown_ID: value.Godown_ID,
            Tank_Open_Hight: value.Tank_Open_Hight,
            Tank_Close_Hight: value.Tank_Close_Hight,
            Tank_Open_Qty: value.Tank_Open_Qty,
            Tank_Close_Qty: value.Tank_Close_Qty,
            Tank_Radus: value.Tank_Radus,
            Tank_Width: value.Tank_Width,
            Tank_Length: value.Tank_Length,
            Cost_Cen_Main_Type: value.Cost_Cen_Main_Type,
            Tank_Calc: value.Tank_Calc
           };
          this.rawMaterialObj.push(obj1);
        })

         console.log('this.rawMaterialObj 22 =', this.rawMaterialObj);

         if(this.rawMaterialObj.length >0){
          this.items = ['BROWSE', 'UPDATE'];
          this.buttonname = 'Update';
        }else{
          this.items = [ 'BROWSE', 'CREATE'];
          this.buttonname = 'Create';
        }
    });

    this.$http.get('/Oil_Production/Get_Bag_Process_Consu?Mfg_Process_No=' + Mfg_Process_No )
    .subscribe((data: any) => {
        this.consumableData = data ? JSON.parse(data) : [];
         console.log('Edit consumableData =>>', this.consumableData);
         this.consumableData.forEach((value, index)=>{
          let obj1 ={
            Product_Description: value.Product_Description,
            Product_ID: value.Product_ID,
            Batch_No: value.Batch_No,
            Qty: value.Qty,
            UOM: value.UOM,
            Mfg_Process_No: 'A',
            Cost_Cen_ID: value.Cost_Cen_ID,
            Godown_ID: value.Godown_ID,
            Tank_Open_Hight: value.Tank_Open_Hight,
            Tank_Close_Hight: value.Tank_Close_Hight,
            Tank_Open_Qty: value.Tank_Open_Qty,
            Tank_Close_Qty: value.Tank_Close_Qty,
            Tank_Radus: value.Tank_Radus,
            Tank_Width: value.Tank_Width,
            Tank_Length: value.Tank_Length,
            Cost_Cen_Main_Type: value.Cost_Cen_Main_Type,
            Tank_Calc: value.Tank_Calc
           };
          this.consumableObj.push(obj1);
        })
        console.log('this.consumableObj 22 =', this.consumableObj);

    });

    this.$http.get('/Oil_Production/Get_Bag_Process_Wastage?Mfg_Process_No=' + Mfg_Process_No )
    .subscribe((data: any) => {
        this.wastageData = data ? JSON.parse(data) : [];
         console.log('Edit wastageData =>>', this.wastageData);
         this.wastageData.forEach((value, index)=>{
          let obj1 ={
            Product_Description: value.Product_Description,
            Product_ID: value.Product_ID,
            Batch_No: value.Batch_No,
            Qty: value.Qty,
            UOM: value.UOM,
            Mfg_Process_No: 'A',
            Cost_Cen_ID: value.Cost_Cen_ID,
            Godown_ID: value.Godown_ID,
            Cost_Cen_ID_To: value.Cost_Cen_ID_To,
            Godown_ID_To: value.Godown_ID_To,
            Tank_Open_Hight: value.Tank_Open_Hight,
            Tank_Close_Hight: value.Tank_Close_Hight,
            Tank_Open_Qty: value.Tank_Open_Qty,
            Tank_Close_Qty: value.Tank_Close_Qty,
            Tank_Radus: value.Tank_Radus,
            Tank_Width: value.Tank_Width,
            Tank_Length: value.Tank_Length,
            Cost_Cen_Main_Type: value.Cost_Cen_Main_Type,
            Tank_Calc: value.Tank_Calc
           };
          this.wastageObj.push(obj1);
        })
        console.log('this.wastageObj 22 =', this.wastageObj);
    });

   this.$http.get('/Oil_Production/Get_Bag_Process_Final?Mfg_Process_No=' + Mfg_Process_No )
    .subscribe((data: any) => {
        this.finalData = data ? JSON.parse(data) : [];
         console.log('Edit finalData =>>', this.finalData);

         this.finalData.forEach((value, index)=>{
          let obj1 ={
            Product_Description: value.Product_Description,
            Product_ID: value.Product_ID,
            Batch_No: value.Batch_No,
            Qty: value.Qty,
            UOM: value.UOM,
            Mfg_Process_No: 'A',
            Cost_Cen_ID: value.Cost_Cen_ID,
            Godown_ID: value.Godown_ID,
            Cost_Cen_ID_To: value.Cost_Cen_ID_To,
            Godown_ID_To: value.Godown_ID_To,
            Qty_Bag: value.Qty_Bag,
            Per_Bag: value.Per_Bag,
            Tank_Open_Hight: value.Tank_Open_Hight,
            Tank_Close_Hight: value.Tank_Close_Hight,
            Tank_Open_Qty: value.Tank_Open_Qty,
            Tank_Close_Qty: value.Tank_Close_Qty,
            Tank_Radus: value.Tank_Radus,
            Tank_Width: value.Tank_Width,
            Tank_Length: value.Tank_Length,
            Cost_Cen_Main_Type: value.Cost_Cen_Main_Type,
            Tank_Calc: value.Tank_Calc,
            Mfg_Date: value.Mfg_Date,
            Exp_Date: value.Exp_Date
           };
          this.finalObj.push(obj1);
        })
        console.log('this.finalObj 22 =', this.finalObj);

    });
  }

  // Delete
  onConfirm() {
    if (this.mfgProcessNo) {
      this.$http.post('/Oil_Production/Delete_Oil_Production', {'Mfg_Process_No' : this.mfgProcessNo})
      .subscribe((data: any) => {
          if (data.success === true) {
              this.onReject();
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                 severity: 'success',
                                 //summary: 'Seed Process ID: ' + this.BagProcessID.toString(),
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
    this.BagProcessID = undefined;
    if (BagProcess.Mfg_Process_No) {
      this.mfgProcessNo = BagProcess.Mfg_Process_No;
      this.compacctToast.clear();
      this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});
    }
  }

   // PDF
   GetPDF (obj) {
    if (obj.Mfg_Process_No) {
      window.open('/Report/Crystal_Files/PRODUCTION/Oil_Production_Print.aspx?Mfg_Process_No=' + obj.Mfg_Process_No,
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
    this.BagProcessSearchSubmitted = false;
    this.bagProcessFormSubmitted = false;
    this.Spinner = false;
    this.objBagProcess = new BagProcess();
    this.objRawMaterial = new BagProcessRawMaterial();
    this.objConsumable = new BagProcessConsumable();
    this.objWastage = new BagProcessWastage();
    this.objFinal = new BagProcessFinal();
    this.rawMaterialObj = [];
    this.consumableObj = [];
    this.wastageObj = [];
    this.finalObj = [];
    this.rawMaterialMsg = '';
    this.consumablelMsg = '';
    this.wastageMsg = '';
    this.finalMsg = '';
    this.Raw_Material_Cost_Cen_Main_Type ='STORE';
    this.Wastage_Cost_Cen_Main_Type ='STORE';
    this.Final_Cost_Cen_Main_Type ='STORE';
    this.objFinal.Qty = 0;
    this.objBagProcess.Cost_Cen_ID = undefined;
    this.objBagProcess.Shift_ID = undefined;
    this.checkRawMaterialQtyExist = false;

  this.route.queryParams.subscribe(params => {
    //console.log('params =', params.Process);
    this.objBagProcess.Mfg_Process_Name = params.Process;
  });

  if(this.tabIndexToView ==1){
    this.DocDate = new Date();
    this.objBagProcess.Process_Date = this.DateService.dateConvert(moment(this.DocDate, 'YYYY-MM-DD')['_d']);
   }
  }
}

class BagProcess {
    Mfg_Process_ID: number;
    Mfg_Process_No: string;
    Process_Date:string;
    Cost_Cen_ID: number;
    Cost_Cen_Name: string;
    Shift_ID: number;
    Godown_ID: number;
    User_ID	: number;
    Creation_Dt:string;
    Mfg_Process_Name: string;
}

class BagProcessRawMaterial {
  Raw_Material_Entry_ID: number;
  Mfg_Process_No: string;
  Cost_Cen_ID: number;
  Product_ID: number;
  Product_Description	: number;
  Batch_No: string;
  Qty	= 0;
  UOM	: string;
  Godown_ID: number;
  Tank_Radus: number;
  Tank_Width: number;
  Tank_Length: number;
  Tank_Open_Hight = 0;
  Tank_Close_Hight = 0;
  Tank_Open_Qty = 0;
  Tank_Close_Qty = 0;
  Tank_Calc = 0;
  Cost_Cen_Main_Type: string;
}

class BagProcessConsumable {
  Consu_Material_Entry_ID	: number;
  Mfg_Process_No: string;
  Cost_Cen_ID: number;
  Product_ID: number;
  Product_Description	: number;
  Batch_No: string;
  Qty	= 0;
  UOM	: string;
  Godown_ID: number;
  //Tank_Radus: number;
  //Tank_Width: number;
 // Tank_Length: number;
  Tank_Open_Hight = 0;
  Tank_Close_Hight = 0;
  Tank_Open_Qty = 0;
  Tank_Close_Qty = 0;
  Tank_Calc = 0;
  Cost_Cen_Main_Type: string;
}

class BagProcessWastage {
  Mfg_Process_No: string;
  Cost_Cen_ID: number;
  Product_ID: number;
  Product_Description	: number;
  Batch_No: string;
  Qty	= 0;
  UOM	: string;
  Godown_ID: number;
  Cost_Cen_ID_To:string;
  Godown_ID_To: string;
  Tank_Radus: number;
  Tank_Width: number;
  Tank_Length: number;
  Tank_Open_Hight = 0;
  Tank_Close_Hight = 0;
  Tank_Open_Qty = 0;
  Tank_Close_Qty = 0;
  Tank_Calc = 0;
  Cost_Cen_Main_Type: string;
}

class BagProcessFinal {
  Mfg_Process_No: string;
  Cost_Cen_ID: number;
  Product_ID: number;
  Product_Description	: number;
  Batch_No: string;
  Qty	= 0;
  UOM	: string;
  Godown_ID: number;
  Cost_Cen_ID_To:string;
  Godown_ID_To: string;
  Qty_Bag = 0;
  Per_Bag = 0;
  Tank_Radus: number;
  Tank_Width: number;
  Tank_Length: number;
  Tank_Open_Hight = 0;
  Tank_Close_Hight = 0;
  Tank_Open_Qty = 0;
  Tank_Close_Qty = 0;
  Tank_Calc = 0;
  Cost_Cen_Main_Type: string;
  Mfg_Date: string;
  Exp_Date: string;
}


