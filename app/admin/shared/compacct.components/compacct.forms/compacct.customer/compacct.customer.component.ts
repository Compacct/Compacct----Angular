import { Component, OnInit, Output , EventEmitter, Input } from '@angular/core';
import { CompacctCommonApi } from '../../../compacct.services/common.api.service';
import { HttpParams, HttpClient } from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-compacct-customer',
  templateUrl: './compacct.customer.component.html',
  styleUrls: ['./compacct.customer.component.css']
})
export class CompacctCustomerComponent implements OnInit {
  url = window['config'];
  ObjSubLedger = new Customer ();
  NativeCustomerList = [];
  CustomerList = [];
  CustomerAddressLists = [];
  CustomerFormSubmitted = false;
  private _required: boolean;

  StateLists = [];
  NativeBrokerList = [];
  BrokerList = [];

  @Output() CustomerObj = new EventEmitter <Customer>();
  @Input()  set required(value: boolean) {
    this._required = value;
    if (this._required) {
      this.CustomerFormSubmitted = this.ObjSubLedger.Sub_Ledger_ID ? true : false;
    } else {
      this.CustomerFormSubmitted = this.ObjSubLedger.Sub_Ledger_ID ? true : false;
    }
 }
  constructor(private $http: HttpClient ,
    private $CompacctAPI: CompacctCommonApi) { }

  ngOnInit() {
    this.GetSubLedger();
    this.GetState();
  }

  GetSubLedger () {
    this.$http.get(this.url.apiGetSubledgerDr).subscribe((data: any) => {
      this.NativeCustomerList  = data ?  JSON.parse(data) : [];
      this.NativeCustomerList.forEach(el => {
      this.CustomerList.push({
       'label': el.Sub_Ledger_Name ,
        'value': el.Sub_Ledger_ID
      });
    });
  });
  }
  GetState() {
    this.$http.get(this.url.apiGetState).subscribe((data: any) => {
        this.StateLists = data;
    });
  }
  GetCustomerAddressDetails (SubLedgerID) {
    if (SubLedgerID) {
      const obj = new HttpParams()
        .set('Sub_Ledger_ID', SubLedgerID);
      this.$http.get(this.url.apiGetSubledgerAddressDetails_ ,  {params : obj}).subscribe((data: any) => {
            this.CustomerAddressLists = data ? JSON.parse(data) : [];
        });
    }
  }

  SubledgerChange (subLedID) {
    this.CustomerFormSubmitted = this.ObjSubLedger.address_caption ? false : true;
    this.CustomerAddressLists = [];
    this.ObjSubLedger.address_caption = undefined;
    const List = this.NativeCustomerList.map(x => Object.assign({}, x));
    if (subLedID) {
      this.ObjSubLedger.Sub_Ledger_ID = subLedID;
      const Obj = $.grep(List, function(value) { return value.Sub_Ledger_ID === Number(subLedID); })[0];
       // ctrl.address_caption = undefined;
        this.ObjSubLedger = Obj;
        this.GetCustomerAddressDetails( this.ObjSubLedger.Sub_Ledger_ID);
        this.ObjSubLedger.address_caption = undefined;
        this.ObjSubLedger.Sub_Ledger_Address_1 = '';
        this.ObjSubLedger.Sub_Ledger_Land_Mark = '';
        this.ObjSubLedger.Sub_Ledger_Pin = undefined;
        this.ObjSubLedger.Sub_Ledger_District = '';
        this.ObjSubLedger.Sub_Ledger_State = '';
        this.ObjSubLedger.Sub_Ledger_Country = '';
        this.ObjSubLedger.Sub_Ledger_GST_No = '';
    }
  }
  ChangeSubLedgerAddress (captionName) {
    // ctrl.statedisable = false;
    this.ObjSubLedger.Sub_Ledger_Address_1 = '';
    this.ObjSubLedger.Sub_Ledger_Land_Mark = '';
    this.ObjSubLedger.Sub_Ledger_Pin = undefined;
    this.ObjSubLedger.Sub_Ledger_District = '';
    this.ObjSubLedger.Sub_Ledger_State = '';
    this.ObjSubLedger.Sub_Ledger_Country = '';
    this.ObjSubLedger.Sub_Ledger_GST_No = '';
    this.CustomerFormSubmitted = this.ObjSubLedger.address_caption ? false : true;
    const List = this.CustomerAddressLists.map(x => Object.assign({}, x));
    if (captionName) {
        const obj = $.grep(List, function (value) { return value.Address_Caption === captionName; })[0]
        this.ObjSubLedger.Sub_Ledger_Address_1 = obj.Address_1;
        this.ObjSubLedger.Sub_Ledger_Land_Mark = obj.Land_Mark;
        this.ObjSubLedger.Sub_Ledger_Pin = obj.Pin;
        this.ObjSubLedger.Sub_Ledger_District = obj.District;
        this.ObjSubLedger.Sub_Ledger_State = obj.State;
        this.ObjSubLedger.Sub_Ledger_Country = obj.Country;
        this.ObjSubLedger.Sub_Ledger_GST_No = obj.Sub_Ledger_GST_No;
        this.ObjSubLedger.Billing_State = obj.Sub_Ledger_State;
        this.ObjSubLedger.IS_SEZ = obj.IS_SEZ;
        this.EmitOnDataInit();
    }
  }

  EmitOnDataInit () {
    this.CustomerObj.emit(this.ObjSubLedger);
  }
}
class Customer {
  Sub_Ledger_ID: number;
  Sub_Ledger_Name: string;
  Sub_Ledger_Billing_Name: string;
  Sub_Ledger_Mailing_Name: string; //
  Sub_Ledger_Address_1: string; //
  Sub_Ledger_Mailing_Address_1: string; //
  Sub_Ledger_Address_2: string;
  Sub_Ledger_Mailing_Address_2: string;
  Sub_Ledger_Address_3: string;
  Sub_Ledger_Land_Mark: string;
  Sub_Ledger_Pin: number;
  Sub_Ledger_District: string;
  Sub_Ledger_State: string;
  Sub_Ledger_Country: string;
  Sub_Ledger_Email: string;
  Sub_Ledger_Mobile_No: number;
  Sub_Ledger_PAN_No: string;
  Sub_Ledger_TIN_No: string;
  Sub_Ledger_CST_No: string;
  Sub_Ledger_SERV_REG_NO: string;
  Sub_Ledger_UID_NO: string;
  Sub_Ledger_EXID_NO: string;
  Sub_Ledger_GST_No: string;
  address_caption: string;
  IS_SEZ: string;
  Billing_State: string;
}


