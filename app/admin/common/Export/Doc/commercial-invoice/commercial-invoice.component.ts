import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-commercial-invoice',
  templateUrl: './commercial-invoice.component.html',
  styleUrls: ['./commercial-invoice.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class CommercialInvoiceComponent implements OnInit {

  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  items = [];
  CommercialInvoiceSearchSubmitted = false;
  cols = [];
  menuList = [];
  ObjSearchStock: any= {};
  searchCommercialInvoiceList:any[] = [];
  DocDate = new Date();
  CommercialInvoiceData:any[] = [];
  objCommercialInvoice: CommercialInvoice = new CommercialInvoice();
  consigneeList:any[];
  finalList:any[];
  ComInvNo:any;
  commercialInvoiceObj:any[] = [];
  commonObj:any[] =[];
  invoiceObj:any[] =[];

  // new
  buyerOrderDt = new Date();
  salesContractList:any[];
  mfDate = new Date();
  expDate: any;
  ARNDate = new Date();
  Com_Inv_No:string;

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
      'Header' : 'Commercial Invoice',
      'Link' : ' Export -> Doc -> Commercial Invoice'
    });

    this.getConsignee();
    this.getProducts();
    this.getSalesContractData();
  }

  getDateRange (dateRangeObj) {
    if (dateRangeObj.length) {
    this.ObjSearchStock.from_date = dateRangeObj[0];
    this.ObjSearchStock.to_date = dateRangeObj[1];
    }
  }
searchCommercialInvoice (valid) {
  this.CommercialInvoiceSearchSubmitted = true;
    this.Spinner = true;
    const start =  this.ObjSearchStock.from_date ?
          this.DateService.dateConvert(new Date(this.ObjSearchStock.from_date)) : this.DateService.dateConvert(new Date);
    const end =  this.ObjSearchStock.to_date ?
          this.DateService.dateConvert(new Date(this.ObjSearchStock.to_date)) : this.DateService.dateConvert(new Date);

    const obj = new HttpParams()
    .set('from_date', start)
    .set('to_date', end);

    this.$http.get('/EXP_Doc_Comm_Inv/Get_Browse', {params : obj})
    .subscribe((data: any) => {
    //  this.searchCommercialInvoiceList =  data.Com_Inv_No ? JSON.parse(data) : [];
    this.searchCommercialInvoiceList =  data.length ? JSON.parse(data) : [];
      this.Spinner = false;
      console.log('this.searchCommercialInvoiceList =', this.searchCommercialInvoiceList );
    });
}


getConsignee() {
  this.$http.get('/common/Get_Subledger_DR')
  .subscribe((data: any) => {
       this.consigneeList = data ? JSON.parse(data) : [];
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
          this.objCommercialInvoice.Sub_Ledger_Name = val.Sub_Ledger_Name;
          this.objCommercialInvoice.Sub_Ledger_Address = val.Sub_Ledger_Address_1;
        }
    });
}

getCommodityDetails(Product_ID){
 // console.log('Product_ID =', Product_ID);
    this.finalList.forEach((val, index)=>{
        if(val.Product_ID === Product_ID){
          this.objCommercialInvoice.Product_Description = val.Product_Description;
        }
    });
}
  GetDocdate (docDate) {
    if (docDate) {
        this.objCommercialInvoice.Com_Inv_Dt = this.DateService.dateConvert(moment(docDate, 'YYYY-MM-DD')['_d']);
      }
  }

  getMfDate (mfDate) {
    if (mfDate) {
        this.objCommercialInvoice.Mfg_Dt = this.DateService.dateConvert(moment(mfDate, 'YYYY-MM-DD')['_d']);
      }
  }
  getExpDate (expDate) {
    if (expDate) {
        this.objCommercialInvoice.Exp_Dt = this.DateService.dateConvert(moment(expDate, 'YYYY-MM-DD')['_d']);
      }
  }

  getARNDate (ARNDate) {
    if (ARNDate) {
        this.objCommercialInvoice.ARN_Dt = this.DateService.dateConvert(moment(ARNDate, 'YYYY-MM-DD')['_d']);
      }
  }

  getBuyerOrderDt (buyer_date) {
    if (buyer_date) {
        this.objCommercialInvoice.Buyer_Order_Dt = this.DateService.dateConvert(moment(buyer_date, 'YYYY-MM-DD')['_d']);
      }
  }

  getSalesContractData() {
  this.$http.get('/EXP_Doc_Comm_Inv/Get_Sale_Contract_No_Dt')
  .subscribe((data: any) => {
       this.salesContractList = data ? JSON.parse(data) : [];
       console.log('salesContractList =', this.salesContractList);
  });
}

getContractDate(Sale_Contract_No){
  this.salesContractList.forEach((value, index)=>{
    if(value.Contract_No === Sale_Contract_No){
       this.objCommercialInvoice.Sale_Contract_Date = this.DateService.dateConvert(moment(value.Contract_Date, 'YYYY-MM-DD')['_d']);
    }
  })
}

getQty(){
  if(this.objCommercialInvoice.Gross_Wt!= undefined){
    this.objCommercialInvoice.Qty  = this.objCommercialInvoice.Gross_Wt - this.objCommercialInvoice.Pkg_Wt;
  }
}
getAmount(){
  if(this.objCommercialInvoice.Qty!= undefined){
    this.objCommercialInvoice.Amount  = this.objCommercialInvoice.Qty * this.objCommercialInvoice.Rate;
    this.objCommercialInvoice.INR_Amt  = this.objCommercialInvoice.INR_Conv_Rate * this.objCommercialInvoice.Amount;
  }
}

addMoreInvoice(){
       const obj2 ={
          Container_No: this.objCommercialInvoice.Container_No,
          Product_ID: this.objCommercialInvoice.Product_ID,
          Product_Description: this.objCommercialInvoice.Product_Description,
          Specification: this.objCommercialInvoice.Specification,
          HS_Code: this.objCommercialInvoice.HS_Code,
          Gross_Wt: this.objCommercialInvoice.Gross_Wt,
          Pkg_Wt: this.objCommercialInvoice.Pkg_Wt,
          Qty: this.objCommercialInvoice.Qty,
          Rate: this.objCommercialInvoice.Rate,
          Amount: this.objCommercialInvoice.Amount,
          INR_Amt: this.objCommercialInvoice.INR_Amt,
          Batch_No: this.objCommercialInvoice.Batch_No,
          Mfg_Dt: this.objCommercialInvoice.Mfg_Dt,
          Exp_Dt: this.objCommercialInvoice.Exp_Dt,
       }
      this.commercialInvoiceObj.push(obj2);
      console.log(' this.commercialInvoiceObj 11 =',  this.commercialInvoiceObj);

       this.objCommercialInvoice.Container_No = undefined;
       this.objCommercialInvoice.Product_ID = undefined;
       this.objCommercialInvoice.Product_Description = undefined;
       this.objCommercialInvoice.Specification = undefined;
       this.objCommercialInvoice.HS_Code = undefined;
       this.objCommercialInvoice.Gross_Wt = 0;
       this.objCommercialInvoice.Pkg_Wt = 0;
       this.objCommercialInvoice.Qty = 0;
       this.objCommercialInvoice.Rate = 0;
       this.objCommercialInvoice.Amount = 0;
       this.objCommercialInvoice.INR_Amt =0;
       this.objCommercialInvoice.Batch_No = undefined;
 }

  // Save
   SaveCommercialInvoiceMaster () {

    if(this.buttonname!='Update'){
      this.Com_Inv_No = 'A';
    }else{
      this.Com_Inv_No = this.objCommercialInvoice.Com_Inv_No;
    }

    this.commercialInvoiceObj.forEach((val, i)=>{

        this.commercialInvoiceObj[i].Com_Inv_Dt = this.objCommercialInvoice.Com_Inv_Dt;
        this.commercialInvoiceObj[i].Com_Inv_No = this.Com_Inv_No;
        this.commercialInvoiceObj[i].Exp_Ref = this.objCommercialInvoice.Exp_Ref;
        this.commercialInvoiceObj[i].Sale_Contract_No = this.objCommercialInvoice.Sale_Contract_No;
        this.commercialInvoiceObj[i].Sale_Contract_Date = this.objCommercialInvoice.Sale_Contract_Date;
        this.commercialInvoiceObj[i].Buyer_Order_No = this.objCommercialInvoice.Buyer_Order_No;
        this.commercialInvoiceObj[i].Buyer_Order_Dt = this.objCommercialInvoice.Buyer_Order_Dt;
        this.commercialInvoiceObj[i].Sub_Ledger_ID = this.objCommercialInvoice.Sub_Ledger_ID;
        this.commercialInvoiceObj[i].Sub_Ledger_Name = this.objCommercialInvoice.Sub_Ledger_Name;
        this.commercialInvoiceObj[i].Sub_Ledger_Address = this.objCommercialInvoice.Sub_Ledger_Address;
        this.commercialInvoiceObj[i].Sub_Ledger_Name_Buyer = this.objCommercialInvoice.Sub_Ledger_Name_Buyer;
        this.commercialInvoiceObj[i].Sub_Ledger_Address_Buyer = this.objCommercialInvoice.Sub_Ledger_Address_Buyer;
        this.commercialInvoiceObj[i].Country_Of_Origin = this.objCommercialInvoice.Country_Of_Origin;
        this.commercialInvoiceObj[i].Country_Of_Final_Destination = this.objCommercialInvoice.Country_Of_Final_Destination;
        this.commercialInvoiceObj[i].Pre_Carrige = this.objCommercialInvoice.Pre_Carrige;
        this.commercialInvoiceObj[i].Pre_Carrige_Reciept = this.objCommercialInvoice.Pre_Carrige_Reciept;
        this.commercialInvoiceObj[i].Vessel_Filight_No = this.objCommercialInvoice.Vessel_Filight_No;
        this.commercialInvoiceObj[i].Port_Of_Loading = this.objCommercialInvoice.Port_Of_Loading;
        this.commercialInvoiceObj[i].Port_Of_Discharge = this.objCommercialInvoice.Port_Of_Discharge;
        this.commercialInvoiceObj[i].Final_Destination = this.objCommercialInvoice.Final_Destination;
        this.commercialInvoiceObj[i].Term_Delivery_Payment = this.objCommercialInvoice.Term_Delivery_Payment;
        this.commercialInvoiceObj[i].Currency = this.objCommercialInvoice.Currency;
        this.commercialInvoiceObj[i].INR_Conv_Rate = this.objCommercialInvoice.INR_Conv_Rate;
        this.commercialInvoiceObj[i].ARN_No = this.objCommercialInvoice.ARN_No;
        this.commercialInvoiceObj[i].ARN_Dt = this.objCommercialInvoice.ARN_Dt;
    });

    console.log(' this.commercialInvoiceObjFinal =', this.commercialInvoiceObj);

        this.Spinner = true;

        const UrlAddress = '/EXP_Doc_Comm_Inv/Insert_Edit_EXP_Doc_Comm_Inv';
        const obj = {
          'EXP_Doc_Comm_Inv': JSON.stringify(this.commercialInvoiceObj)
         };
        this.$http.post(UrlAddress, obj ).subscribe((data: any) => {

         if (data.success) {
                this.compacctToast.clear();
                this.compacctToast.add({key: 'compacct-toast',
                                  severity: 'success',
                                  summary: 'Commercial Invoice Saved'  ,
                                  detail: 'Succesfully Saved'});
                                  this.searchCommercialInvoice(true);
                                  this.clearData();

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

  // Edit
  edit(Com_Inv_No) {
      this.tabIndexToView = 1;
      this.items = [ 'BROWSE', 'UPDATE'];
      this.buttonname = 'Update';
      this.$CompacctAPI.compacctSpinnerShow();

      this.$http.get('/EXP_Doc_Comm_Inv/Get_All_Data?Com_Inv_No=' + Com_Inv_No)
      .subscribe((data: any) => {
          this.CommercialInvoiceData = data ? JSON.parse(data) : [];
          console.log('Edit CommercialInvoiceData =>>', this.CommercialInvoiceData);
          this.$CompacctAPI.compacctSpinnerHide();

          if(this.CommercialInvoiceData.length >0){
           this.commercialInvoiceObj = this.CommercialInvoiceData;
           console.log('Edit commercialInvoiceObj Final =>>', this.commercialInvoiceObj);

           this.objCommercialInvoice.Com_Inv_Dt = this.CommercialInvoiceData[0].Com_Inv_Dt;
           this.objCommercialInvoice.Exp_Ref = this.CommercialInvoiceData[0].Exp_Ref;
           this.objCommercialInvoice.Sale_Contract_No = this.CommercialInvoiceData[0].Sale_Contract_No;
           this.objCommercialInvoice.Sale_Contract_Date = this.DateService.dateConvert(moment(this.CommercialInvoiceData[0].Sale_Contract_Date, 'YYYY-MM-DD')['_d']);

           this.objCommercialInvoice.Buyer_Order_No = this.CommercialInvoiceData[0].Buyer_Order_No;
           this.objCommercialInvoice.Buyer_Order_Dt = this.CommercialInvoiceData[0].Buyer_Order_Dt;
           this.objCommercialInvoice.Currency = this.CommercialInvoiceData[0].Currency;
           this.objCommercialInvoice.INR_Conv_Rate = this.CommercialInvoiceData[0].INR_Conv_Rate;
          //  this.objCommercialInvoice.Product_ID = this.CommercialInvoiceData[0].Product_ID;
          //  this.objCommercialInvoice.Product_Description = this.CommercialInvoiceData[0].Product_Description;

           this.objCommercialInvoice.Sub_Ledger_ID = this.CommercialInvoiceData[0].Sub_Ledger_ID;
           this.objCommercialInvoice.Sub_Ledger_Name = this.CommercialInvoiceData[0].Sub_Ledger_Name;
           this.objCommercialInvoice.Sub_Ledger_Address = this.CommercialInvoiceData[0].Sub_Ledger_Address;
           this.objCommercialInvoice.Sub_Ledger_Name_Buyer = this.CommercialInvoiceData[0].Sub_Ledger_Name_Buyer;
           this.objCommercialInvoice.Sub_Ledger_Address_Buyer = this.CommercialInvoiceData[0].Sub_Ledger_Address_Buyer;

           this.objCommercialInvoice.Country_Of_Origin = this.CommercialInvoiceData[0].Country_Of_Origin;
           this.objCommercialInvoice.Country_Of_Final_Destination = this.CommercialInvoiceData[0].Country_Of_Final_Destination;
           this.objCommercialInvoice.Pre_Carrige = this.CommercialInvoiceData[0].Pre_Carrige;
           this.objCommercialInvoice.Pre_Carrige_Reciept = this.CommercialInvoiceData[0].Pre_Carrige_Reciept;
           this.objCommercialInvoice.Vessel_Filight_No = this.CommercialInvoiceData[0].Vessel_Filight_No;
           this.objCommercialInvoice.Port_Of_Loading = this.CommercialInvoiceData[0].Port_Of_Loading;
           this.objCommercialInvoice.Port_Of_Discharge = this.CommercialInvoiceData[0].Port_Of_Discharge;
           this.objCommercialInvoice.Final_Destination = this.CommercialInvoiceData[0].Final_Destination;
           this.objCommercialInvoice.Term_Delivery_Payment = this.CommercialInvoiceData[0].Term_Delivery_Payment;
           this.objCommercialInvoice.Mfg_Dt = this.CommercialInvoiceData[0].Mfg_Dt;
           this.objCommercialInvoice.Exp_Dt = this.CommercialInvoiceData[0].Exp_Dt;
           this.objCommercialInvoice.ARN_No = this.CommercialInvoiceData[0].ARN_No;
           this.objCommercialInvoice.ARN_Dt = this.CommercialInvoiceData[0].ARN_Dt;
           this.objCommercialInvoice.Com_Inv_No = this.CommercialInvoiceData[0].Com_Inv_No;

          }
      });
  }

  // Delete
  deleteCommercialInvoice (CommercialInvoice) {
    if (CommercialInvoice.Com_Inv_No) {
      this.ComInvNo = CommercialInvoice.Com_Inv_No;
      this.compacctToast.clear();
      this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});
    }
  }
  onConfirm() {
    if (this.ComInvNo) {
      this.$http.post('/EXP_Doc_Comm_Inv/Delete_EXP_Doc_Comm_Inv', {'Com_Inv_No' : this.ComInvNo})
      .subscribe((data: any) => {
          if (data.success === true) {
              this.onReject();
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                 severity: 'success',
                                 detail: 'Succesfully Deleted'});
                                 this.searchCommercialInvoice (true);
            }
      });
    }
  }
  onReject() {
    this.compacctToast.clear('c');
  }

   // PDF
   getPrint1 (obj) {
    if (obj.Com_Inv_No) {
      window.open('/Report/Crystal_Files/PRODUCTION/EXP_Doc_Custom_Inv_Print.aspx?Com_Inv_No=' + obj.Com_Inv_No,
       'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }
  getPrint2 (obj) {
    if (obj.Com_Inv_No) {
      window.open('/Report/Crystal_Files/PRODUCTION/Exp_Doc_Commercial_Invoice.aspx?Com_Inv_No=' + obj.Com_Inv_No,
       'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }
  getPrint3 (obj) {
    if (obj.Com_Inv_No) {
      window.open('/Report/Crystal_Files/PRODUCTION/Phyto_Invoice_For_Health_Checking.aspx?Com_Inv_No=' + obj.Com_Inv_No,
       'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }

  deleteInvoice(index){
    this.commercialInvoiceObj.splice(index, 1);
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
    this.objCommercialInvoice = new CommercialInvoice();
    this.commercialInvoiceObj = [];    ;
    this.objCommercialInvoice.Country_Of_Origin = 'INDIA';
    this.Com_Inv_No ='';

    const date = this.DateService.dateConvert(moment(new Date, 'YYYY-MM-DD')['_d']).split('/') ;
    const add2Year = Number(date[2]) + 2;
    this.expDate = date[0] + '/' + date[1] + '/' + add2Year;

  if(this.tabIndexToView ==1){
    this.DocDate = new Date();
    this.buyerOrderDt = new Date();
    this.mfDate = new Date();
    this.ARNDate = new Date();
     this.objCommercialInvoice.Com_Inv_Dt = this.DateService.dateConvert(moment(this.DocDate, 'YYYY-MM-DD')['_d']);
     this.objCommercialInvoice.Buyer_Order_Dt = this.DateService.dateConvert(moment(this.buyerOrderDt, 'YYYY-MM-DD')['_d']);
     this.objCommercialInvoice.Mfg_Dt = this.DateService.dateConvert(moment(this.mfDate, 'YYYY-MM-DD')['_d']);
     this.objCommercialInvoice.ARN_Dt = this.DateService.dateConvert(moment(this.ARNDate, 'YYYY-MM-DD')['_d']);
     this.objCommercialInvoice.Exp_Dt = this.expDate;
   }
  }

}
class CommercialInvoice {
   // Contract_No :string;
    //Exp_Com_Inv_ID
    Com_Inv_No: string;
    Com_Inv_Dt: string;
    Exp_Ref: string;
    Sale_Contract_No: string;
    Sale_Contract_Date: string;
    Buyer_Order_No: string;
    Buyer_Order_Dt: string;
    Sub_Ledger_ID: string;
    Sub_Ledger_Name: string;
    Sub_Ledger_Address: string;
    Sub_Ledger_Name_Buyer: string;
    Sub_Ledger_Address_Buyer: string;
    Country_Of_Origin: string;
    Country_Of_Final_Destination: string;
    Pre_Carrige: string;
    Pre_Carrige_Reciept: string;
    Vessel_Filight_No: string;
    Port_Of_Loading: string;
    Port_Of_Discharge: string;
    Final_Destination: string;
    Term_Delivery_Payment: string;
    Currency: string;
    INR_Conv_Rate = 0;
    Container_No: string;
    Product_ID: number;
    Product_Description: string;
    Specification: string;
    HS_Code: string;
    Gross_Wt = 0;
    Pkg_Wt = 0;
    Qty = 0;
    Rate = 0;
    Amount = 0;
    INR_Amt = 0;
    Batch_No: string;
    Mfg_Dt: string;
    Exp_Dt: string;
    ARN_No: string;
    ARN_Dt: string;
}

