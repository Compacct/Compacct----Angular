import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-seed-process',
  templateUrl: './seed-process.component.html',
  styleUrls: ['./seed-process.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class SeedProcessComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  items = [];
  SeedProcessSearchSubmitted = false;
  SeedProcessFormSubmitted = false;
  createQCFormSubmitted = false;
  AllSeedProcessList = [];
  MaterialSubTypeList = [];
  SeedProcessID: number;
  cols = [];
  menuList = [];
  ExistNameFlag = false;
  componentDisplay = false;
  costCenterTypeList = [];
  costCenterNameList = [];
  costCenterGodownList = [];
  batchNoList = [];
  seedDetails = [];
  productDetails:any;
  tmp_Seed_Process_Qty:number;
  tmp_Seed_Process_Bag:number;
  toCostCenterNameList = [];
  toCostCenterGodownList = [];
  checkBagExist = false;
  checkSeedQtyExist = false;
  ObjSearchStock: any= {};
  searchSeedProcessList = [];
  Cost_Cen_Type: string;
  To_Cost_Cen_Type: string;
  Cost_Cen_Name: string;
  Godown_Name: string;
  Product_Name:string;
  product_id: number;
  DocDate = new Date();
  To_Cost_Center_Name:string;
  TO_GoDown_Name: string;

  productList:any[];
  godownList:any[];
  consumableList:any[];
  productBatchno:any[];
  godownBagList:any[];
  godownToCostCenterList: any[];
  Use_Cost_Centre_Name: string;
  Use_GoDown_Name: string;
  Bag_Cost_Centre_Name: string;
  Bag_GoDown_Name: string;
  Rcv_Cost_Centre_Name:string;
  Rcv_GoDown_Name: string;

  ObjSeedProcess: SeedProcess = new SeedProcess();

  constructor(
    private $http: HttpClient ,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader ,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private $CompacctAPI: CompacctCommonApi) { }

  ngOnInit() {
    this.items = [ 'BROWSE', 'CREATE', 'QC CREATE'];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];
    this.Header.pushHeader({'Header' : 'Clealing for PP Bag and Crashing',
                            'Link' : ' Material Management -> Master -> Master Cost Center'});
    this.getCostCenterName();
    this.getProduct();
  }
  getDateRange (dateRangeObj) {
    if (dateRangeObj.length) {
        this.ObjSearchStock.from_date = dateRangeObj[0];
        this.ObjSearchStock.to_date = dateRangeObj[1];
    }
  }
searchSeedProcess (valid) {
  this.SeedProcessSearchSubmitted = true;
    this.Spinner = true;
    const start =  this.ObjSearchStock.from_date ?
          this.DateService.dateConvert(new Date(this.ObjSearchStock.from_date)) : this.DateService.dateConvert(new Date);
    const end =  this.ObjSearchStock.to_date ?
          this.DateService.dateConvert(new Date(this.ObjSearchStock.to_date)) : this.DateService.dateConvert(new Date);
    const obj = new HttpParams()
    .set('from_date', start)
    .set('to_date', end);

    this.$http.get('/Seed_Process/DateWise_Browse', {params : obj})
    .subscribe((data: any) => {
      this.searchSeedProcessList =  data.length ? JSON.parse(data) : [];
      this.Spinner = false;
    });
}

getCostCenterName() {
  this.$http.get('/Seed_Process/Get_Cost_Centre_Name')
  .subscribe((data: any) => {
        this.costCenterNameList = data ? JSON.parse(data) : [];
        // For Raw Material autocomplete
        this.costCenterNameList.forEach((val, index)=>{
        this.costCenterNameList[index].label = val.Cost_Cen_Name,
        this.costCenterNameList[index].value = val.Cost_Cen_ID
      });
      //console.log('costCenterNameList =', this.costCenterNameList);
  });
}

getGodown(Cost_Cen_Id) {
  this.$http.get('/Seed_Process/Get_GoDown?Cost_Cen_Id=' + Cost_Cen_Id)
  .subscribe((data: any) => {
       this.godownList = data ? JSON.parse(data) : [];
       //console.log('this.godownList =', this.godownList)
  });
}
getGodownToCostCenter(Cost_Cen_Id) {
  this.$http.get('/Seed_Process/Get_GoDown?Cost_Cen_Id=' + Cost_Cen_Id)
  .subscribe((data: any) => {
       this.godownToCostCenterList = data ? JSON.parse(data) : [];
      // console.log('this.godownToCostCenterList =', this.godownToCostCenterList)
  });
}

getGodownForBag(Cost_Cen_Id) {
  this.$http.get('/Seed_Process/Get_GoDown?Cost_Cen_Id=' + Cost_Cen_Id)
  .subscribe((data: any) => {
       this.godownBagList = data ? JSON.parse(data) : [];
       //console.log('this.godownBagList =', this.godownBagList)
  });
}

getProduct() {
  this.$http.get('/PP_Bag_Process/Get_Product')
  .subscribe((data: any) => {
        const productArr = data ? JSON.parse(data) : [];
        console.log('productArr =', productArr);

        this.productList = productArr.filter((value:any)=>{
          return value.Material_Type === 'RAW MATERIAL';
        });

        this.productList.forEach((val, index)=>{
        this.productList[index].label = val.Product_Description;
        this.productList[index].value = val.Product_ID
      });
      console.log('productList =', this.productList);

       /************* CONSUMABLE *************/
       this.consumableList = productArr.filter((value:any)=>{
        return value.Material_Type === 'CONSUMABLE';
      });

      // For autocomplete
      this.consumableList.forEach((val, index)=>{
        this.consumableList[index].label = val.Product_Description;
        this.consumableList[index].value = val.Product_ID
      });
      //console.log('consumableList =', this.consumableList);

  });
}

getBatchNo(Product_ID) {
  this.productList.forEach((value, index)=>{
    if(value.Product_ID === Product_ID){
        this.ObjSeedProcess.Product_Name = value.Product_Description;
        this.ObjSeedProcess.UOM = value.UOM;
        return;
    }
  });

    this.$http.get('/common/Get_Stock_Qty?CostCenID=' + this.ObjSeedProcess.Use_Cost_Cen_ID + '&ProductID=' + Product_ID + '&GodownID=' + this.ObjSeedProcess.Use_Godown_ID + '&Report_type='+ "STOCK WITH BATCH AND BAG")
   .subscribe((data: any) => {
      this.productBatchno = data ? JSON.parse(data) : [];
      console.log('this.productBatchno =', this.productBatchno);
   });
}

getSeedBagQty(batch_no) {
  if(this.productBatchno.length > 0){
    this.ObjSeedProcess.Seed_Process_Qty = this.productBatchno[0].QTY;
    this.ObjSeedProcess.Seed_Process_Bag = this.productBatchno[0].Bag_Qty;
    this.tmp_Seed_Process_Qty =  this.productBatchno[0].QTY;
    this.tmp_Seed_Process_Bag =  this.productBatchno[0].Bag_Qty;
  }
}

getBagProductName(Seed_Process_Bag_Product_ID){
  this.consumableList.forEach((value, index)=>{
    if(value.Product_ID === Seed_Process_Bag_Product_ID){
      this.ObjSeedProcess.Seed_Process_Bag_Product_Description = value.Product_Description;
      this.ObjSeedProcess.Seed_Process_Bag_UOM = value.UOM;
        return;
    }
  });
}

costCenterNameChange(Use_Cost_Cen_ID) {
  this.$http.get('/Seed_Process/Get_GoDown?Cost_Cen_Id=' + Use_Cost_Cen_ID)
  .subscribe((data: any) => {
       this.costCenterGodownList = data ? JSON.parse(data) : [];
  });
}
checkQty(Seed_Process_Qty) {
  if(Seed_Process_Qty > this.tmp_Seed_Process_Qty ){
    this.ObjSeedProcess.Seed_Process_Net_Wt = 0;
    this.checkSeedQtyExist = true;
  }else{
    this.checkSeedQtyExist = false;
    if(this.ObjSeedProcess.Seed_Process_Dry_Persentage!=0){
      this.calDryDamage();
    }
    this.totalDamage();
  }
}

checkBag(Seed_Process_Bag) {
  if(Seed_Process_Bag > this.tmp_Seed_Process_Bag ){
    this.checkBagExist = true;
  }else{
    this.checkBagExist = false;
  }
}
  GetDocdate (docDate) {
    if (docDate) {
        this.ObjSeedProcess.Seed_Process_Doc_Date = this.DateService.dateConvert(moment(docDate, 'YYYY-MM-DD')['_d']);
      }
  }

  totalDamage(){
      this.ObjSeedProcess.Seed_Process_Net_Wt = 0;

      if(this.ObjSeedProcess.Seed_Process_Qty > 0){
        let totDamage = this.ObjSeedProcess.Seed_Process_Bag_Damage + this.ObjSeedProcess.Seed_Process_Dust_Damage + this.ObjSeedProcess.Seed_Process_Husk_Damage + this.ObjSeedProcess.Seed_Process_Dry_Damage;

        if(totDamage > this.ObjSeedProcess.Seed_Process_Qty){
          console.log('over');
        }else{
          this.ObjSeedProcess.Seed_Process_Net_Wt = this.ObjSeedProcess.Seed_Process_Qty - totDamage;
        }
    }
  }
  calDryDamage(){
    this.ObjSeedProcess.Seed_Process_Dry_Damage = (this.ObjSeedProcess.Seed_Process_Qty * this.ObjSeedProcess.Seed_Process_Dry_Persentage) / 100;
    this.totalDamage();
  }

  // Save
  SaveSeedProcessMaster (valid) {
    this.SeedProcessFormSubmitted = true;
    console.log('ObjSeedProcess =>> ', this.ObjSeedProcess);
    this.totalDamage();

    if(this.buttonname!=='Update'){
      this.ObjSeedProcess.Seed_Process_Doc_No = 'A';
    }

    if (valid) {
      this.Spinner = true;
      this.ObjSeedProcess.Challan_Doc_No = 'NA';
      this.ObjSeedProcess.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ObjSeedProcess.Rate = 0;
      const UrlAddress = '/Seed_Process/Create_Edit_Seed_Process';
      const obj = { 'Seed_Process_String': JSON.stringify([this.ObjSeedProcess]) };
      this.$http.post(UrlAddress, obj ).subscribe((data: any) => {

          if (data.success) {

            if (this.ObjSeedProcess.Seed_Process_Doc_No!=='A') {

              this.componentDisplay = true;
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                severity: 'success',
                                summary: 'Clealing for PP Bag Updated',
                                detail: 'Succesfully Updated'});
                                this.searchSeedProcess (valid);
            } else {
              this.componentDisplay = true;
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                severity: 'success',
                                summary: 'Clealing for PP Bag Added'  ,
                                detail: 'Succesfully Created'});
                                this.searchSeedProcess (valid);
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

  EditSeedProcess (Seed_Process_Doc_No) {
      this.tabIndexToView = 1;
      this.items = [ 'BROWSE', 'UPDATE', 'QC CREATE'];
      this.buttonname = 'Update';

       this.$http.get('/Seed_Process/Get_Edit_Data?Seed_Process_Doc_No=' + Seed_Process_Doc_No)
        .subscribe((data: any) => {
            this.AllSeedProcessList = data ? JSON.parse(data) : [];
            this.ObjSeedProcess = this.AllSeedProcessList[0];
            console.log('Edit ObjSeedProcess =>>', this.ObjSeedProcess);
            this.componentDisplay = true;
          this.DocDate = moment(this.AllSeedProcessList[0].Seed_Process_Doc_Date, 'YYYY-MM-DD')['_d'];
          this.ObjSeedProcess.Seed_Process_Doc_Date = this.AllSeedProcessList[0].Seed_Process_Doc_Date;
          this.getGodown(this.ObjSeedProcess.Use_Cost_Cen_ID);
          this.getBatchNo(this.ObjSeedProcess.Product_ID);
          this.getGodownForBag(this.ObjSeedProcess.Seed_Process_Bag_To_Cost_Cen_ID);
          this.getGodownToCostCenter(this.ObjSeedProcess.Rcv_Cost_Cen_ID);
        });
  }

  createQC(Seed_Process_Doc_No) {
    this.tabIndexToView = 2;
    this.buttonname = 'Create QC';

     this.$http.get('/Seed_Process/Get_Edit_Data?Seed_Process_Doc_No=' + Seed_Process_Doc_No)
      .subscribe((data: any) => {
          this.AllSeedProcessList = data ? JSON.parse(data) : [];
          this.ObjSeedProcess = this.AllSeedProcessList[0];
          console.log('Create QC ObjSeedProcess =', this.ObjSeedProcess);

          if(this.AllSeedProcessList[0].QC_FFA!==''){
            this.items = [ 'BROWSE', 'CREATE', 'UPDATE QC'];
            this.buttonname = 'Update QC';
          }
          this.Use_Cost_Centre_Name = this.AllSeedProcessList[0].Use_Cost_Centre_Name;
          this.Use_GoDown_Name = this.AllSeedProcessList[0].Use_GoDown_Name;
          this.Bag_Cost_Centre_Name = this.AllSeedProcessList[0].Bag_Cost_Centre_Name;
          this.Bag_GoDown_Name = this.AllSeedProcessList[0].Bag_GoDown_Name;
          this.Rcv_Cost_Centre_Name = this.AllSeedProcessList[0].Rcv_Cost_Centre_Name;
          this.Rcv_GoDown_Name = this.AllSeedProcessList[0].Rcv_GoDown_Name;
          this.Product_Name = this.AllSeedProcessList[0].Product_Name;
      });
}

saveCreateQC (valid) {
  this.createQCFormSubmitted = true;
  console.log('saveCreateQC data =>> ', this.ObjSeedProcess);
  this.totalDamage();
  this.ObjSeedProcess.Status = 'QC DONE';
  this.ObjSeedProcess.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;

  if (valid) {
    this.Spinner = true;
    const UrlAddress = '/Seed_Process/Create_Edit_QC';
    const obj = { 'Seed_Process_QC_String': JSON.stringify([this.ObjSeedProcess]) };
    this.$http.post(UrlAddress, obj ).subscribe((data: any) => {

        if (data.success) {
            this.componentDisplay = true;
            this.compacctToast.clear();
            this.compacctToast.add({key: 'compacct-toast',
                              severity: 'success',
                             // summary: 'Cost Center ID :' + this.ObjSeedProcess.Seed_Process_Doc_No ,
                              detail: 'Succesfully Updated'});

            this.items = [ 'BROWSE', 'CREATE', 'UPDATE QC'];
            this.buttonname = 'Update QC';
            this.searchSeedProcess (valid = true);
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
  // Delete
  onConfirm() {
    if (this.SeedProcessID) {

      this.$http.post('/Seed_Process/Delete_Seed_Process', {'Seed_Process_Doc_No' : this.SeedProcessID})
      .subscribe((data: any) => {
          if (data.success === true) {
              this.onReject();
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                 severity: 'success',
                                 summary: 'Seed Process ID: ' + this.SeedProcessID.toString(),
                                 detail: 'Succesfully Deleted'});
                                 this.searchSeedProcess (true);
            }
      });
    }
  }
  onReject() {
    this.compacctToast.clear('c');
  }
  DeleteSeedProcess (SeedProcess) {
    this.SeedProcessID = undefined;
    if (SeedProcess.Seed_Process_Doc_No) {
      this.SeedProcessID = SeedProcess.Seed_Process_Doc_No;
      this.compacctToast.clear();
      this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});
    }

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
    this.items = [ 'BROWSE', 'CREATE', 'QC CREATE'];
    this.buttonname = 'Create';
   this.clearData();
  }
  clearData() {
    this.SeedProcessSearchSubmitted = false;
    this.SeedProcessFormSubmitted = false;
    this.Spinner = false;
    this.ObjSeedProcess = new SeedProcess();
    this.checkBagExist = false;
    this.checkSeedQtyExist = false;
    this.Cost_Cen_Type ='';
    this.To_Cost_Cen_Type = '';
    this.Cost_Cen_Name ='';
    this.Godown_Name = '';
    this.Product_Name ='';
   if(this.tabIndexToView ==1){
    this.DocDate = new Date();
    this.ObjSeedProcess.Seed_Process_Doc_Date = this.DateService.dateConvert(moment(this.DocDate, 'YYYY-MM-DD')['_d']);
   }
  }
}

class SeedProcess {
    Seed_Process_Doc_No: string ;
    Seed_Process_Doc_Date: string;
    Challan_Doc_No: string;
    Product_ID: number;
    Product_Name: string;
    Batch_Number: string;
    Seed_Process_Bag = 0;
    Seed_Process_Qty = 0;
    Rate: number;
    UOM: string;
    Remarks: string;
    Seed_Process_Dry_Damage = 0;
    Seed_Process_Bag_Damage = 0;
    Seed_Process_Husk_Damage = 0;
    Seed_Process_Dust_Damage = 0;
    Seed_Process_Net_Wt = 0;
    Rcv_Cost_Cen_ID: number;
    Rcv_Godown_ID: number;
    Use_Cost_Cen_ID: number;
    Use_Godown_ID: number;
    User_ID: number;
    Seed_Process_Dry_Persentage = 0;
    Status: string = 'PROCESS DONE';
    Seed_Process_Line_No: number;
    QC_User_ID : string;
    QC_FFA : string;
    QC_Moisture : string;
    QC_Oil_Content : string;
    QC_Impurity : string;
    QC_Remarks : string;
    Cost_Cen_ID: number;
    Seed_Process_Bag_Product_ID: number;
    Seed_Process_Bag_Product_Description: string;
    Seed_Process_Bag_To_Cost_Cen_ID: number;
    Seed_Process_Bag_To_Godown_ID: number;
    Seed_Process_Bag_Batch_No: string;
    Seed_Process_Bag_Qty: number;
    Seed_Process_Bag_UOM: string;
}

