import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';


@Component({
  selector: 'app-sales-contract',
  templateUrl: './sales-contract.component.html',
  styleUrls: ['./sales-contract.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class SalesContractComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  items = [];
  SalesContractSearchSubmitted = false;
  cols = [];
  menuList = [];
  ObjSearchStock: any= {};
  searchSalesContractList:any[] = [];
  DocDate = new Date();
  SalesContractData:any[] = [];
  objSalesContract: SalesContract = new SalesContract();
  consigneeList:any[];
  finalList:any[];
  contractNo:any;

  constructor(
    private $http: HttpClient ,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader ,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private $CompacctAPI: CompacctCommonApi) {
    }

  ngOnInit() {
    this.items = [ 'BROWSE', 'CREATE'];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];

    this.Header.pushHeader({
      'Header' : 'Sales Contract',
      'Link' : ' Material Management -> Master -> Master Cost Center'
    });
   // this.objSalesContract.Sub_Ledger_Name_Notify = 'Same as Above';
    this.getConsignee();
    this.getProducts();
  }

  getDateRange (dateRangeObj) {
    if (dateRangeObj.length) {
    this.ObjSearchStock.from_date = dateRangeObj[0];
    this.ObjSearchStock.to_date = dateRangeObj[1];
    }
  }
searchSalesContract (valid) {
  this.SalesContractSearchSubmitted = true;
    this.Spinner = true;
    const start =  this.ObjSearchStock.from_date ?
          this.DateService.dateConvert(new Date(this.ObjSearchStock.from_date)) : this.DateService.dateConvert(new Date);
    const end =  this.ObjSearchStock.to_date ?
          this.DateService.dateConvert(new Date(this.ObjSearchStock.to_date)) : this.DateService.dateConvert(new Date);

    const obj = new HttpParams()
    .set('from_date', start)
    .set('to_date', end);

    this.$http.get('/Exp_Doc_Sale_Contract/Get_Browse', {params : obj})
    .subscribe((data: any) => {
      this.searchSalesContractList =  data.length ? JSON.parse(data) : [];
      this.Spinner = false;
      console.log('this.searchSalesContractList =', this.searchSalesContractList );
    });
}


getConsignee() {
  this.$http.get('/common/Get_Subledger_DR')
  .subscribe((data: any) => {
       this.consigneeList = data ? JSON.parse(data) : [];
       //console.log('plantArr =', plantArr);

      //For searchable dropdown
      this.consigneeList.forEach((val, index)=>{
        this.consigneeList[index].label = val.Sub_Ledger_Name,
        this.consigneeList[index].value = val.Sub_Ledger_ID
      });
        console.log('this.consigneeList =', this.consigneeList);
  });
}

getProducts() {
  this.$http.get('/Oil_Production/Get_Product')
   .subscribe((data: any) => {
        const productArr = data ? JSON.parse(data) : [];
        console.log('productArr =', productArr);

        /************* FINAL *************/
       this.finalList = productArr.filter((value:any)=>{
         return value.Material_Type === 'FINAL';
       });
       // For autocomplete
       this.finalList.forEach((val, index)=>{
         this.finalList[index].label = val.Product_Description,
         this.finalList[index].value = val.Product_ID
       });
       console.log('finalLis 88 =', this.finalList);
   });
 }

getConsigneeDetails(Sub_Ledger_ID){
 // console.log('Sub_Ledger_ID =', Sub_Ledger_ID);
    this.consigneeList.forEach((val, index)=>{
        if(val.Sub_Ledger_ID === Sub_Ledger_ID){
          this.objSalesContract.Sub_Ledger_Name = val.Sub_Ledger_Name;
          this.objSalesContract.Sub_Ledger_Address = val.Sub_Ledger_Address_1;
        }
    });
}

getCommodityDetails(Product_ID){
 // console.log('Product_ID =', Product_ID);
    this.finalList.forEach((val, index)=>{
        if(val.Product_ID === Product_ID){
          this.objSalesContract.Product_Description = val.Product_Description;
        }
    });
}
  GetDocdate (docDate) {
    if (docDate) {
        this.objSalesContract.Contract_Date = this.DateService.dateConvert(moment(docDate, 'YYYY-MM-DD')['_d']);
      }
  }
  // Save
   SaveSalesContractMaster (valid) {

    this.objSalesContract.Product_Description = this.objSalesContract.Product_Description!= undefined ? this.objSalesContract.Product_Description : '';
    this.objSalesContract.Specification = this.objSalesContract.Specification!= undefined ? this.objSalesContract.Specification : '';
    this.objSalesContract.Quantity = this.objSalesContract.Quantity!= undefined ? this.objSalesContract.Quantity :'';
    this.objSalesContract.Unit_Price = this.objSalesContract.Unit_Price!= undefined ? this.objSalesContract.Unit_Price : '';
    this.objSalesContract.Total_Value = this.objSalesContract.Total_Value!= undefined ? this.objSalesContract.Total_Value : '';
    this.objSalesContract.Packing = this.objSalesContract.Packing!= undefined ? this.objSalesContract.Packing : '';
    this.objSalesContract.Shipment = this.objSalesContract.Shipment!= undefined ? this.objSalesContract.Shipment : '';
    this.objSalesContract.Payment = this.objSalesContract.Payment!= undefined ? this.objSalesContract.Payment : '';

    console.log('this.objSalesContract =', this.objSalesContract);
      if(this.buttonname!=='Update'){
        this.objSalesContract.Contract_No = 'A';
      }

      if (valid) {
        this.Spinner = true;
        this.objSalesContract.Created_By = this.$CompacctAPI.CompacctCookies.User_ID;
        const UrlAddress = '/Exp_Doc_Sale_Contract/Insert_Edit_Exp_Doc_Sale_Contract';
        const obj = {
            'Exp_Doc_Sale_Contract': JSON.stringify([this.objSalesContract])
           };
        this.$http.post(UrlAddress, obj ).subscribe((data: any) => {

         if (data.success) {
              if (this.objSalesContract.Contract_No!=='A') {
                this.compacctToast.clear();
                this.compacctToast.add({key: 'compacct-toast',
                                  severity: 'success',
                                  summary: 'Sales Contract Updated',
                                  detail: 'Succesfully Updated'});
                                  this.searchSalesContract (valid);
              } else {
                this.compacctToast.clear();
                this.compacctToast.add({key: 'compacct-toast',
                                  severity: 'success',
                                  summary: 'Sales Contract Added'  ,
                                  detail: 'Succesfully Created'});
                                  this.searchSalesContract (valid);
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

  // Edit
  edit(Contract_No) {
      this.tabIndexToView = 1;
      this.items = [ 'BROWSE', 'UPDATE'];
      this.buttonname = 'Update';
      this.$CompacctAPI.compacctSpinnerShow();

      this.$http.get('/Exp_Doc_Sale_Contract/Get_All_Data?Contract_No=' + Contract_No)
      .subscribe((data: any) => {
          this.SalesContractData = data ? JSON.parse(data) : [];
        console.log('Edit SalesContractData =>>', this.SalesContractData);
        this.$CompacctAPI.compacctSpinnerHide();

        if(this.SalesContractData.length >0){
          this.objSalesContract = this.SalesContractData[0];
        }
       // console.log('Edit objSalesContract Final =>>', this.objSalesContract);

      });
  }

  // Delete
  onConfirm() {
    if (this.contractNo) {
      this.$http.post('/Exp_Doc_Sale_Contract/Delete_Exp_Doc_Sale_Contract', {'Contract_No' : this.contractNo})
      .subscribe((data: any) => {
          if (data.success === true) {
              this.onReject();
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                 severity: 'success',
                                 detail: 'Succesfully Deleted'});
                                 this.searchSalesContract (true);
            }
      });
    }
  }
  onReject() {
    this.compacctToast.clear('c');
  }
  deleteSalesContract (SalesContract) {
    if (SalesContract.Contract_No) {
      this.contractNo = SalesContract.Contract_No;
      this.compacctToast.clear();
      this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});
    }
  }
   // PDF
   GetPDF (obj) {
    if (obj.Contract_No) {
      window.open('/Report/Crystal_Files/PRODUCTION/Exp_Doc_Sale_Contract_Print.aspx?Contract_No=' + obj.Contract_No,
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
    this.objSalesContract = new SalesContract();
    this.objSalesContract.Sub_Ledger_Name_Notify = 'Same as Above';


  if(this.tabIndexToView ==1){
    this.DocDate = new Date();
    this.objSalesContract.Contract_Date = this.DateService.dateConvert(moment(this.DocDate, 'YYYY-MM-DD')['_d']);
   }
  }

}
class SalesContract {
  Contract_No :string;
  Contract_Date :string;
  Sub_Ledger_ID : number;
  Sub_Ledger_Name : string;
  Sub_Ledger_Address : string;
  Sub_Ledger_Name_Notify : string;
  Sub_Ledger_Address_Notify	: string;
  Product_ID :number;
  Product_Description: string;
  Specification: string;
  Quantity: string;
  Unit_Price: string;
  Total_Value: string;
  Packing: string;
  Shipment: string;
  Payment: string;
  Created_By: number;
}
