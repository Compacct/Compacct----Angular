import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-pp-bag-process',
  templateUrl: './pp-bag-process.component.html',
  styleUrls: ['./pp-bag-process.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class PpBagProcessComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  items = [];
  BagProcessSearchSubmitted = false;

  createQCFormSubmitted = false;
  AllBagProcessList = [];
  MaterialSubTypeList = [];
  BagProcessID: number;
  cols = [];
  menuList = [];
  ExistNameFlag = false;
  componentDisplay = false;
  costCenterTypeList = [];
  costCenterNameList = [];
  costCenterGodownList = [];
  batchNoList = [];
  seedDetails = [];
  tmp_Seed_Process_Bag:number;
  toCostCenterNameList = [];
  toCostCenterGodownList = [];
  checkBagExist = false;
  ObjSearchStock: any= {};
  searchBagProcessList = [];
  Cost_Cen_Type: string;
  To_Cost_Cen_Type: string;
  Cost_Cen_Name: string;
  Godown_Name: string;
  Product_Name:string;
  product_id: number;
  DocDate = new Date();
  qcDate = new Date();
  To_Cost_Center_Name:string;
  TO_GoDown_Name: string;

// Bagprocess
  objBagProcess: BagProcess = new BagProcess();
  objRawMaterial: BagProcessRawMaterial = new BagProcessRawMaterial();
  objConsumable: BagProcessConsumable = new BagProcessConsumable();
  objWastage: BagProcessWastage = new BagProcessWastage();
  objFinal: BagProcessFinal = new BagProcessFinal();
  plantList:any[];
  storeList:any[];
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

  //Consum
  productDetailsConsum:any;
  productBatchnoConsum:any[];
  consumableObj:any[]= [];
  consumableList :any[];
  //finalList:any[];

// wastage
  wastageObj:any[]= [];
  wastageList:any[] = [];
  productBatchnoWastage:any[];
  productDetailsWastage:any;
  wastageFormSubmitted = false;
  wastageBatchNo:string;


  //Final
  finalObj:any[]= [];
  finalList:any[] = [];
  productBatchnoFinal:any[];
  productDetailsFinal:any;
  finalFormSubmitted = false;
  net_final_qty:number;
  finalBatchNo:string;


  bagProcessData = [];
  rawMaterialData = [];
  consumableData = [];
  wastageData = [];
  finalData = [];
  mfgProcessNo:string;

  rawMaterialMsg: string ='';
  consumablelMsg: string ='';
  wastageMsg: string ='';
  finalMsg: string ='';
  displayEwayModal:boolean = false;

  constructor(
    private $http: HttpClient ,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader ,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private $CompacctAPI: CompacctCommonApi) { }

  ngOnInit() {
    this.items = [ 'BROWSE', 'CREATE'];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];

    this.route.queryParams.subscribe(params => {
      this.objBagProcess.Mfg_Process_Name = params.Process;
      this.Header.pushHeader({
        //'Header' : 'Oil Production',
        'Header' : this.objBagProcess.Mfg_Process_Name,
        'Link' : ' Material Management -> Master -> Master Cost Center'
      });
      this.searchBagProcessList = [];
    });

    this.getPlants();
    this.getShifts();
    this.getRawMaterials();
    this.getPurchaseBill();
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

    this.$http.get('/PP_Bag_Process/Get_Browse', {params : obj})
    .subscribe((data: any) => {
      this.searchBagProcessList =  data.length ? JSON.parse(data) : [];
      this.Spinner = false;
      console.log('this.searchBagProcessList =', this.searchBagProcessList );
    });
}

getPlants() {
  this.$http.get('/PP_Bag_Process/Get_Cost_Centre')
  .subscribe((data: any) => {
       const plantArr = data ? JSON.parse(data) : [];
        this.plantList = plantArr.filter((value:any)=>{
          return value.Cost_Cen_Main_Type === 'PLANT';
        });
        console.log('this.plantList =', this.plantList);

        // get store
        this.storeList = plantArr.filter((value:any)=>{
          return value.Cost_Cen_Main_Type === 'STORE';
        });

  });
}

getGodownForBagProcess(Cost_Cen_ID) {

  this.plantList.forEach((value, index)=>{
     if(value.Cost_Cen_ID === Cost_Cen_ID){
         this.objBagProcess.Cost_Cen_Name  = value.Cost_Cen_Name;
        this.wastageBatchNo = value.Cost_Cen_Ini;
        this.finalBatchNo = value.Cost_Cen_Ini;
     }
   })

   this.objBagProcess.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
 this.$http.get('/PP_Bag_Process/Get_GoDown?Cost_Cen_ID=' + Cost_Cen_ID)
  .subscribe((data: any) => {
       this.godownList = data ? JSON.parse(data) : [];
       this.getData();
  });
}

getGodown(Cost_Cen_ID) {
 this.$http.get('/PP_Bag_Process/Get_GoDown?Cost_Cen_ID=' + Cost_Cen_ID)
  .subscribe((data: any) => {
       this.godownList = data ? JSON.parse(data) : [];
  });
}

getShifts() {
  this.$http.get('/PP_Bag_Process/Get_Shift')
  .subscribe((data: any) => {
       this.shiftList = data ? JSON.parse(data) : [];
       //console.log('shiftList =', this.shiftList)
  });
}

getRawMaterials() {
 this.$http.get('/PP_Bag_Process/Get_Product')
  .subscribe((data: any) => {
       const productArr = data ? JSON.parse(data) : [];

       /************* RAW MATERIAL *************/
       this.productList = productArr.filter((value:any)=>{
        return value.Material_Type === 'RAW MATERIAL';
      });
      // For Raw Material autocomplete
      this.productList.forEach((val, index)=>{
            this.productList[index].label = val.Product_Description;
            this.productList[index].value = val.Product_ID;
      });
      console.log('productList 22 =', this.productList);

      /************* CONSUMABLE *************/
      this.consumableList = productArr.filter((value:any)=>{
       // return value.Material_Type === 'CONSUMABLE';
       return (value.Material_Type === 'CONSUMABLE' || value.Material_Type === 'FINAL');
      });

      // For autocomplete
      this.consumableList.forEach((val, index)=>{
        this.consumableList[index].label = val.Product_Description;
        this.consumableList[index].value = val.Product_ID;
      });
      console.log('consumableList 22 =', this.consumableList);
       /************* FINAL *************/

      this.finalList = productArr.filter((value:any)=>{
        return value.Material_Type === 'FINAL';
      });

      // For autocomplete
      this.finalList.forEach((val, index)=>{
        this.finalList[index].label = val.Product_Description;
        this.finalList[index].value = val.Product_ID;
      });
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

getBatchNoForRawMaterial(Product_ID) {
  this.rawMaterialMsg = '';
  this.objRawMaterial.Qty = undefined;
  this.productList.forEach((value, index)=>{
    if(value.Product_ID === Product_ID){
        this.tmp_Product_Description  = value.Product_Description;
        return;
    }
  });

  this.$http.get('/common/Get_Stock_Qty?CostCenID=' + this.objBagProcess.Cost_Cen_ID + '&ProductID=' + Product_ID + '&GodownID=' + this.objBagProcess.Godown_ID + '&Report_type='+ "STOCK WITH BATCH")
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
      if(this.tabIndexToView == 0){
        this.tmp_rawmaterial_qty =  0;
      }
      this.productDetails = this.productBatchno.filter((value:any, index)=>{
        return value.Batch_No == Batch_No;
      });
      this.tmp_rawmaterial_qty =  this.productDetails[0].QTY;
      this.objRawMaterial.Qty =  this.productDetails[0].QTY;
 }

 addRawMaterial(valid){
  this.bagProcessFormSubmitted = true;
  this.rawMaterialFormSubmitted = true;

  this.rawMaterialMsg = '';
  let valueExist = false;
  this.rawMaterialObj.forEach((val, index)=>{
      if((val.Product_ID === this.objRawMaterial.Product_ID) && (val.Batch_No === this.objRawMaterial.Batch_No)){
        valueExist = true;
        console.log('valueExist 11=', valueExist);
      }
   })

   setTimeout(() => {
    if(!valueExist){
      const obj ={
        Product_Description: this.tmp_Product_Description,
        Product_ID: this.objRawMaterial.Product_ID,
        Batch_No: this.objRawMaterial.Batch_No,
        Qty: this.objRawMaterial.Qty,
        UOM: this.objRawMaterial.UOM,
        Mfg_Process_No: 'A',
        Cost_Cen_ID: this.objBagProcess.Cost_Cen_ID,
        Godown_ID: this.objBagProcess.Godown_ID
       };
      this.rawMaterialObj.push(obj);
       console.log('this.rawMaterialObj =', this.rawMaterialObj);
       this.objRawMaterial.Product_ID = undefined;
       this.objRawMaterial.Batch_No = undefined;
       this.objRawMaterial.Qty = undefined;
       this.objRawMaterial.UOM = undefined;
       valueExist = false;
    }else{
      this.rawMaterialMsg = 'This product already exist please remove and add again.';
    }
  }, 500);

 }
 deleteRawMaterial(index){
  this.rawMaterialObj.splice(index, 1);
 }

/* ######################################  Consumable  ###################################### */

 getBatchNoForCusumable(Product_ID) {
   this.consumablelMsg ='';
   this.objConsumable.Qty = undefined;
  this.consumableList.forEach((value, index)=>{
    if(value.Product_ID === Product_ID){
        this.tmp_Product_Desc_Consum  = value.Product_Description;
        return;
    }
  });

  this.$http.get('/common/Get_Stock_Qty?CostCenID=' + this.objBagProcess.Cost_Cen_ID + '&ProductID=' + Product_ID + '&GodownID=' + this.objBagProcess.Godown_ID + '&Report_type='+ "STOCK WITH BATCH")
  .subscribe((data: any) => {
     this.productBatchnoConsum = data ? JSON.parse(data) : [];
     console.log('productBatchnoConsum 11 =', this.productBatchnoConsum);
  });

  this.$http.get('/Master_Product_V2/Get_Product?_Product_ID=' + Product_ID)
  .subscribe((data: any) => {
     const consumableUOM = data ? JSON.parse(data) : [];
       if(consumableUOM.length > 0){
         this.objConsumable.UOM =  consumableUOM[0].UOM;
       }
  });
 }

 getProductDetailsForConsumable(Batch_No) {
  if(this.tabIndexToView == 0){
    this.tmp_consumable_qty = 0;
  }
  this.productDetailsConsum = this.productBatchnoConsum.filter((value:any, index)=>{
    return value.Batch_No == Batch_No;
  });
  this.tmp_consumable_qty =  this.productDetailsConsum[0].QTY;
  this.objConsumable.Qty =  this.productDetailsConsum[0].QTY;
}

addConsumable(valid){
  this.bagProcessFormSubmitted = true;
  this.rawMaterialFormSubmitted = true;
  this.consumableFormSubmitted = true;

  this.consumablelMsg = '';
  let valueExist = false;
  this.consumableObj.forEach((val, index)=>{
      if((val.Product_ID === this.objConsumable.Product_ID) && (val.Batch_No === this.objConsumable.Batch_No)){
        valueExist = true;
        console.log('valueExist 11=', valueExist);
      }
   })

   setTimeout(() => {
    if(!valueExist){

      const obj2 ={
        Product_Description: this.tmp_Product_Desc_Consum,
        Product_ID: this.objConsumable.Product_ID,
        Batch_No: this.objConsumable.Batch_No,
        Qty: this.objConsumable.Qty,
        UOM: this.objConsumable.UOM,
        Mfg_Process_No: 'A',
        Cost_Cen_ID: this.objBagProcess.Cost_Cen_ID,
        Godown_ID: this.objBagProcess.Godown_ID
       };
      this.consumableObj.push(obj2);
      console.log('this.consumableObj =', this.consumableObj);

       this.objConsumable.Product_ID = undefined;
       this.objConsumable.Batch_No = undefined;
       this.objConsumable.Qty = undefined;
       this.objConsumable.UOM = undefined;
       valueExist = false;
    }else{
      this.consumablelMsg = 'This product already exist please remove and add again.';
    }
  }, 500);
 }
 deleteConsumable(index){
  this.consumableObj.splice(index, 1);
}

/* ######################################  Wastage  ###################################### */

getBatchNoForWastage(Product_ID) {
  this.objWastage.Batch_No = '';
  this.wastageMsg = '';
 // this.objWastage.Qty = undefined;

  this.wastageList.forEach((value, index)=>{
    if(value.Product_ID === Product_ID){
        this.tmp_Product_Desc_Wastage  = value.Product_Description;
        return;
    }
  });

  //wastage bach no
  const processData = moment(this.objBagProcess.Process_Date).format('YYYY-MM-DD');
  this.objWastage.Batch_No = this.wastageBatchNo + processData + this.objBagProcess.Shift_ID + Product_ID;

  this.$http.get('/Master_Product_V2/Get_Product?_Product_ID=' + Product_ID)
  .subscribe((data: any) => {
     const wastageUOM = data ? JSON.parse(data) : [];
       if(wastageUOM.length > 0){
         this.objWastage.UOM =  wastageUOM[0].UOM;
       }
  });


 }

addWastage(valid){
  this.bagProcessFormSubmitted = true;
  this.rawMaterialFormSubmitted = true;
  this.consumableFormSubmitted = true;
  this.wastageFormSubmitted = true;

  this.wastageMsg = '';
  let valueExist = false;
  this.wastageObj.forEach((val, index)=>{
      if((val.Product_ID === this.objWastage.Product_ID) && (val.Batch_No === this.objWastage.Batch_No)){
        valueExist = true;
      }
   })

   setTimeout(() => {
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
       };
      this.wastageObj.push(obj3);
       console.log('this.wastageObj =', this.wastageObj);

       this.objWastage.Product_ID = undefined;
       this.objWastage.Batch_No = undefined;
       this.objWastage.Qty = undefined;
       this.objWastage.UOM = undefined;
       this.objWastage.Cost_Cen_ID_To = undefined;
       this.objWastage.Godown_ID_To = undefined;
       valueExist = false;
    }else{
      this.wastageMsg = 'This product already exist please remove and add again.';
    }
  }, 500);

 }
 deleteWastage(index){
  this.wastageObj.splice(index, 1);
}

/* ######################################  Final  ###################################### */

getBatchNoForFinal(Product_ID) {
  this.objFinal.Batch_No = '';

  this.finalList.forEach((value, index)=>{
    if(value.Product_ID === Product_ID){
        this.tmp_Product_Desc_Final  = value.Product_Description;
        return;
    }
  });
   //final bach no
   const processData = moment(this.objBagProcess.Process_Date).format('YYYY-MM-DD');
   this.objFinal.Batch_No = this.finalBatchNo + processData + this.objBagProcess.Shift_ID + Product_ID;

  this.$http.get('/Master_Product_V2/Get_Product?_Product_ID=' + Product_ID)
  .subscribe((data: any) => {
     const finalUOM = data ? JSON.parse(data) : [];
       if(finalUOM.length > 0){
         this.objFinal.UOM =  finalUOM[0].UOM;
       }
  });

 }

addFinal(valid){
  this.bagProcessFormSubmitted = true;
  this.rawMaterialFormSubmitted = true;
  this.consumableFormSubmitted = true;
  this.wastageFormSubmitted = true;
  this.finalFormSubmitted = true;

  this.finalMsg = '';
  let valueExist = false;
  this.finalObj.forEach((val, index)=>{
      if((val.Product_ID === this.objFinal.Product_ID) && (val.Batch_No === this.objFinal.Batch_No)){
        valueExist = true;
        console.log('valueExist 44=', valueExist);
      }
   })

   setTimeout(() => {
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
       };
      this.finalObj.push(obj4);
      console.log('this.finalObj =', this.finalObj);

       this.objFinal.Product_ID = undefined;
       this.objFinal.Batch_No = undefined;
       this.objFinal.Qty = undefined;
       this.objFinal.UOM = undefined;
       this.objFinal.Cost_Cen_ID_To = undefined;
       this.objFinal.Godown_ID_To = undefined;
       this.objFinal.Qty_Bag = undefined;
       this.objFinal.Per_Bag = undefined;
       valueExist = false;
    }else{
      this.finalMsg = 'This product already exist please remove and add again.';
    }
  }, 500);

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

getPurchaseBill() {
  this.$http.get('/Seed_Process/Get_Batch_Number')
  .subscribe((data: any) => {
       this.batchNoList = data ? JSON.parse(data) : [];
  });
}
  GetDocdate (docDate) {
    if (docDate) {
        this.objBagProcess.Process_Date = this.DateService.dateConvert(moment(docDate, 'YYYY-MM-DD')['_d']);
        this.getData();
      }
  }

  getQCdate (qcDate) {
    if (qcDate) {
        this.objBagProcess.QC_Date = this.DateService.dateConvert(moment(qcDate, 'YYYY-MM-DD')['_d']);
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

      this.Spinner = true;
      const UrlAddress = '/PP_Bag_Process/Insert_PP_Bag_Process';
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
                                summary: 'PP Bag Process Added'  ,
                                detail: 'Succesfully Created'});
                               this.searchBagProcess (valid);
                              this.clearData();
            }
            this.Spinner = false;
      });
  }

  // Edit
  editProcess(Process_Date, Mfg_Process_No, Cost_Cen_ID, Godown_ID, Shift_ID) {
      this.tabIndexToView = 1;
      // this.items = ['BROWSE', 'UPDATE'];
      // this.buttonname = 'Update';

      this.$http.get('/PP_Bag_Process/Get_Bag_Process?Process_Date=' + Process_Date + '&Cost_Cen_ID=' + Cost_Cen_ID + '&Godown_ID=' + Godown_ID + '&Shift_ID=' + Shift_ID + '&Mfg_Process_Name=' + this.objBagProcess.Mfg_Process_Name)
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
     this.$http.get('/PP_Bag_Process/Get_Bag_Process_Raw_Material?Mfg_Process_No=' + Mfg_Process_No )
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
            Godown_ID: value.Godown_ID
           };
          this.rawMaterialObj.push(obj1);
        });

         console.log('this.rawMaterialObj 22 =', this.rawMaterialObj);
         if(this.rawMaterialObj.length >0){
          this.items = ['BROWSE', 'UPDATE'];
          this.buttonname = 'Update';
        }else{
          this.items = [ 'BROWSE', 'CREATE'];
          this.buttonname = 'Create';
        }
    });

    this.$http.get('/PP_Bag_Process/Get_Bag_Process_Consu?Mfg_Process_No=' + Mfg_Process_No )
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
            Godown_ID: value.Godown_ID
           };
          this.consumableObj.push(obj1);
        })
        console.log('this.consumableObj 22 =', this.consumableObj);

    });

    this.$http.get('/PP_Bag_Process/Get_Bag_Process_Wastage?Mfg_Process_No=' + Mfg_Process_No )
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
           };
          this.wastageObj.push(obj1);
        })
        console.log('this.wastageObj 22 =', this.wastageObj);
    });

   this.$http.get('/PP_Bag_Process/Get_Bag_Process_Final?Mfg_Process_No=' + Mfg_Process_No )
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
           };
          this.finalObj.push(obj1);
        })
        console.log('this.finalObj 22 =', this.finalObj);

    });
  }

  // Delete
  onConfirm() {
    if (this.mfgProcessNo) {
      this.$http.post('/PP_Bag_Process/Delete_PP_Bag_Process', {'Mfg_Process_No' : this.mfgProcessNo})
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
        window.open('/Report/Crystal_Files/PRODUCTION/PP_bag_Process.aspx?Mfg_Process_No=' + obj.Mfg_Process_No,
         'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      }
    }

  editQCBagProcess(BagProcess){
    this.displayEwayModal = true;
    this.objBagProcess.Mfg_Process_ID = BagProcess.Mfg_Process_ID;
    this.objBagProcess.QC_By = this.$CompacctAPI.CompacctCookies.User_ID;
    if(BagProcess.QC_Date === '1900-01-01T00:00:00'){
         this.qcDate = new Date();
         this.objBagProcess.QC_Date = this.DateService.dateConvert(moment(this.qcDate, 'YYYY-MM-DD')['_d']);
    }else{
      this.objBagProcess.QC_Date = BagProcess.QC_Date;
      console.log('this.objBagProcess.QC_Date =', this.objBagProcess.QC_Date);
      this.qcDate = moment(BagProcess.QC_Date, 'YYYY-MM-DD')['_d'];
    }

    this.objBagProcess.QC_FFA = BagProcess.QC_FFA;
    this.objBagProcess.QC_Oil_Contain = BagProcess.QC_Oil_Contain;
    this.objBagProcess.QC_Moisture = BagProcess.QC_Moisture;
    this.objBagProcess.QC_Impurity = BagProcess.QC_Impurity;
  }
  updateQC(){
      console.log('objBagProcess 22 =', this.objBagProcess);

      this.Spinner = true;
      const UrlAddress = '/PP_Bag_Process/Create_Edit_QC';
      const obj = {
        'PP_Bag_QC_String': JSON.stringify([this.objBagProcess])
      };
      this.$http.post(UrlAddress, obj )
      .subscribe((data: any) => {
          if (data.success) {
              this.componentDisplay = true;
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                severity: 'success',
                                summary: 'Update QC Process'  ,
                                detail: 'Succesfully Updated'});
                                this.displayEwayModal = false;
                                this.searchBagProcess (true);
                                this.clearData();

            }
            this.Spinner = false;
      });
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
    this.consumablelMsg ='';
    this.wastageMsg ='';
    this.finalMsg ='';
    this.objFinal.Qty = 0;
    this.objBagProcess.Cost_Cen_ID = undefined;
    this.objBagProcess.Shift_ID = undefined;
    this.checkRawMaterialQtyExist = false;

    this.route.queryParams.subscribe(params => {
      this.objBagProcess.Mfg_Process_Name = params.Process;
    });
    // this.qcDate = new Date();
    // this.objBagProcess.QC_Date = this.DateService.dateConvert(moment(this.qcDate, 'YYYY-MM-DD')['_d']);

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
  QC_Date:string;
  QC_FFA: string;
  QC_Oil_Contain: string;
  QC_Impurity: string;
  QC_Moisture: string;
  QC_By: string;
}

class BagProcessRawMaterial {
  Raw_Material_Entry_ID: number;
  Mfg_Process_No: string;
  Cost_Cen_ID: number;
  Product_ID: number;
  Product_Description	: number;
  Batch_No: string;
  Qty	: number;
  UOM	: string;
  Godown_ID: number;
}

class BagProcessConsumable {
  Consu_Material_Entry_ID	: number;
  Mfg_Process_No: string;
  Cost_Cen_ID: number;
  Product_ID: number;
  Product_Description	: number;
  Batch_No: string;
  Qty	: number;
  UOM	: string;
  Godown_ID: number;
}

class BagProcessWastage {
  Mfg_Process_No: string;
  Cost_Cen_ID: number;
  Product_ID: number;
  Product_Description	: number;
  Batch_No: string;
  Qty	: number;
  UOM	: string;
  Godown_ID: number;
  Cost_Cen_ID_To:string;
  Godown_ID_To: string;
}

class BagProcessFinal {
  Mfg_Process_No: string;
  Cost_Cen_ID: number;
  Product_ID: number;
  Product_Description	: number;
  Batch_No: string;
  Qty	: number;
  UOM	: string;
  Godown_ID: number;
  Cost_Cen_ID_To:string;
  Godown_ID_To: string;
  Qty_Bag: number;
  Per_Bag: number;
}


