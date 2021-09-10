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
  selector: 'app-machine-uses',
  templateUrl: './machine-uses.component.html',
  styleUrls: ['./machine-uses.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class MachineUsesComponent implements OnInit {

  tabIndexToView = 0;
  buttonname = 'Add';
  Spinner = false;
  items = [];
  cols = [];
  menuList = [];
  componentDisplay = false;
  ObjSearchStock: any= {};
  searchBagProcessList = [];
  ProcessDate = new Date();

  objMachineUses: MachineUses = new MachineUses();
  plantList:any[];
  tankList:any[];
  shiftList:any[];
  productList:any[];
  productDetails:any;
  MachineUsesObj:any[]= [];
  MachineUsesData = [];
  mfgProcessNo:string;
  // new
  contractForm: FormGroup;
  submitted = false;
  Start_Date:string;
  End_Date:string;
  machineList:any[] = [];

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
    // this.items = [ 'BROWSE', 'CREATE'];
    this.items = ['CREATE'];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];

      this.Header.pushHeader({
        'Header' : 'Machine Uses',
        'Link' : 'Product Management -> Machine Uses'
      });

    this.contractForm = this.fb.group({
      Cost_Cen_ID: ['', Validators.required],
      Shift_ID: ['', Validators.required],
      Process_Date: [''],
      Product_ID: ['', Validators.required],
      Start_Date: ['', Validators.required],
      End_Date: ['', Validators.required],
    });

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
  //this.BagProcessSearchSubmitted = true;
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
  });
}
getShifts() {
  this.$http.get('/PP_Bag_Process/Get_Shift')
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

       this.productList = productArr.filter((value:any)=>{
        return value.Material_Type === 'MACHINE';
      });
      // For Raw Material autocomplete
      this.productList.forEach((val, index)=>{
            this.productList[index].label = val.Product_Description;
            this.productList[index].value = val.Product_ID;
      });
     console.log('productList 22 =', this.productList);
  });
}
getPlantDetails(Cost_Cen_ID){
    this.plantList.forEach((value, index)=>{
      if(value.Cost_Cen_ID === Cost_Cen_ID){
        this.objMachineUses.Cost_Cen_Name = value.Cost_Cen_Name;
      }
    });
    this.getMachineData();
}

getProductDetails(Product_ID) {
  this.productList.forEach((value, index)=>{
     if(value.Product_ID === Product_ID){
        this.objMachineUses.Product_Description = value.Product_Description;
     }
   })
}
get f() {
  return this.contractForm.controls;
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
//  deleteMachineUses(index){
//   this.MachineUsesObj.splice(index, 1);
// }
GetProcessDate (ProcessDate) {
    if (ProcessDate) {
        this.objMachineUses.Process_Date = this.DateService.dateConvert(moment(ProcessDate, 'YYYY-MM-DD')['_d']);
        this.getMachineData();
    }
}

getMachineData(){
  this.machineList = [];
  console.log('this.objMachineUses 11 =', this.objMachineUses);
if(this.objMachineUses.Cost_Cen_Name != undefined && this.objMachineUses.Shift_ID != undefined && this.objMachineUses.Process_Date != undefined){
  this.$http.get('/Machine_Uses/Retrieve_Data?Cost_Cen_Name='+ this.objMachineUses.Cost_Cen_Name + '&Shift=' + this.objMachineUses.Shift_ID + '&Process_Date=' + this.objMachineUses.Process_Date)
  .subscribe((data: any) => {
       this.machineList = data ? JSON.parse(data) : [];
       console.log('machineList 22 =', this.machineList)
  });
}
}

//  http://localhost:50063/Machine_Uses/Delete?id=2

deleteMachine(index, Efficiency_ID){   //
  //  this.$http.post('/Machine_Uses/Delete?id=' + Efficiency_ID)
  this.$http.post('/Machine_Uses/Delete', {'id' : Efficiency_ID})
    .subscribe((data: any) => {
        if (data.success === true) {
          this.machineList.splice(index, 1);
        }
    });
}
// get f() {
//     return this.contractForm.controls;
// }
  // Save
SaveBagProcessMaster () {
  console.log('this.objMachineUses =', this.objMachineUses);
   this.submitted = true;

   if(this.contractForm.invalid) {
       return;
   }else{

    this.objMachineUses.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;

    this.objMachineUses.Start_Date = moment(this.Start_Date).format('YYYY-MM-DD HH:mm:ss');
    console.log('this.objMachineUses.Start_Date =', this.objMachineUses.Start_Date);

    this.objMachineUses.End_Date = moment(this.End_Date).format('YYYY-MM-DD HH:mm:ss');
    console.log('this.objMachineUses.End_Date =', this.objMachineUses.End_Date);

    const start_date_timestamp = new Date(this.objMachineUses.Start_Date).getTime();
    const end_date_timestamp = new Date(this.objMachineUses.End_Date).getTime();

    console.log('start_date_timestamp =', start_date_timestamp);
    console.log('end_date_timestamp =', end_date_timestamp);

    this.objMachineUses.Time_Used  = Number(((end_date_timestamp - start_date_timestamp) / (1000 * 60)).toFixed(2));
    console.log('this.objMachineUses.Time_Used =', this.objMachineUses.Time_Used);

      this.objMachineUses.Efficiency_ID = '';

      this.Spinner = true;
      const UrlAddress = '/Machine_Uses/Create_Edit_Machine_Uses';
      const obj = {
        'Machine_Uses_String': JSON.stringify([this.objMachineUses]),
       };
      this.$http.post(UrlAddress, obj )
      .subscribe((data: any) => {
          if (data.success) {
              this.componentDisplay = true;
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                severity: 'success',
                                summary: 'Machine Saved',
                                detail: 'Succesfully Saved'});
                               this.getMachineData();
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
      // this.items = ['BROWSE', 'UPDATE'];
      this.items = ['UPDATE'];
      this.buttonname = 'Update';

      /* this.$http.get('/Export_Transportation/Get_All_Data?Doc_No=' + Doc_No)
      .subscribe((data: any) => {
          this.transportationData = data ? JSON.parse(data) : [];
        console.log('Edit transportationData =>>', this.transportationData);
        if(this.transportationData.length > 0 ){

            this.objMachineUses.Com_Inv_No = this.transportationData[0].Com_Inv_No;
            this.objMachineUses.Process_Date = this.transportationData[0].Process_Date;
            this.objMachineUses.Sub_Ledger_ID = this.transportationData[0].Sub_Ledger_ID;
            this.objMachineUses.Truck_No = this.transportationData[0].Truck_No;
            this.objMachineUses.Container_No = this.transportationData[0].Container_No;
            this.objMachineUses.Seal_No = this.transportationData[0].Seal_No;
            this.objMachineUses.Flexi_Tank_No = this.transportationData[0].Flexi_Tank_No;
          this.Doc_No = this.transportationData[0].Doc_No;
          this.MachineUsesObj = [...this.transportationData];
          console.log('this.MachineUsesObj Edit 88 =', this.MachineUsesObj);

        }
      }); */
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
    //this.items = [ 'BROWSE', 'CREATE'];
    this.items = ['CREATE'];
    this.buttonname = 'Add';
   this.clearData();
  }
  clearData() {
    this.Spinner = false;
    this.objMachineUses = new MachineUses();
    this.submitted = false;
    this.MachineUsesObj = [];
   // this.MachineUsesMsg = '';
  if(this.tabIndexToView ==1){
    this.ProcessDate = new Date();
    this.objMachineUses.Process_Date = this.DateService.dateConvert(moment(this.ProcessDate, 'YYYY-MM-DD')['_d']);
   }
  }
}

class MachineUses {
   Process_Date: string;
   Cost_Cen_ID: number;
   Cost_Cen_Name: string;
   Product_ID: number;
   Product_Description: number;
   Shift_ID: number;
   User_ID: number;
   Start_Date: string;
   End_Date: string;
   Time_Used: number;;
   Efficiency_ID:string;
}






