import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { CompacctCommonApi } from "../../../compacct.services/common.api.service";
import { HttpParams, HttpClient } from "@angular/common/http";
declare var $: any;
@Component({
  selector: "app-compacct-vendor",
  templateUrl: "./compacct.vendor.component.html",
  styleUrls: ["./compacct.vendor.component.css"]
})
export class CompacctVendorComponent implements OnInit {
  url = window["config"];
  ObjSubLedger = new Vendor();
  NativeVendorList = [];
  VendorList = [];
  VendorAddressLists = [];
  VendorFormSubmitted = false;
  private _required: boolean;

  StateLists = [];
  NativeBrokerList = [];
  BrokerList = [];

  @Output() VendorObj = new EventEmitter<Vendor>();
  @Input() set required(value: boolean) {
    this._required = value;
    if (this._required) {
      this.VendorFormSubmitted = this.ObjSubLedger.Sub_Ledger_ID ? true : false;
    } else {
      this.VendorFormSubmitted = this.ObjSubLedger.Sub_Ledger_ID ? true : false;
    }
  }
  @Input() Hide: {};

  constructor(
    private $http: HttpClient,
    private $CompacctAPI: CompacctCommonApi
  ) {}

  ngOnInit() {
    this.GetSubLedger();
    this.GetState();
    this.GetBroker();
  }

  GetSubLedger() {
    const para = new HttpParams().set("Subledger_Type", "Vendor");
    this.$http
      .get("/Common/Get_SubLedger_SC_with_Type", { params: para })
      .subscribe((data: any) => {
        this.NativeVendorList = data ? JSON.parse(data) : [];
        this.NativeVendorList.forEach(el => {
          this.VendorList.push({
            label: el.Sub_Ledger_Name,
            value: el.Sub_Ledger_ID
          });
        });
      });
  }
  GetState() {
    this.$http.get(this.url.apiGetState).subscribe((data: any) => {
      this.StateLists = data;
    });
  }
  GetBroker() {
    const para = new HttpParams().set("Subledger_Type", "Broker");
    this.$http
      .get("/Common/Get_SubLedger_SC_with_Type", { params: para })
      .subscribe((data: any) => {
        this.NativeBrokerList = data ? JSON.parse(data) : [];
        this.NativeBrokerList.forEach(el => {
          this.BrokerList.push({
            label: el.Sub_Ledger_Name,
            value: el.Sub_Ledger_ID
          });
        });
      });
  }
  GetVendorAddressDetails(SubLedgerID) {
    if (SubLedgerID) {
      const obj = new HttpParams().set("Sub_Ledger_ID", SubLedgerID);
      this.$http
        .get(this.url.apiGetSubledgerAddressDetails_, { params: obj })
        .subscribe((data: any) => {
          this.VendorAddressLists = data ? JSON.parse(data) : [];
        });
    }
  }

  SubledgerChange(subLedID) {
    this.ObjSubLedger = new Vendor();
    this.VendorFormSubmitted = this.ObjSubLedger.Address_Caption ? false : true;
    this.VendorAddressLists = [];
    this.ObjSubLedger.Address_Caption = undefined;
    const List = this.NativeVendorList.map(x => Object.assign({}, x));
    if (subLedID) {
      this.ObjSubLedger.Sub_Ledger_ID = subLedID;
      const Obj = $.grep(List, function(value) {
        return value.Sub_Ledger_ID === Number(subLedID);
      })[0];
      // ctrl.Address_Caption = undefined;
      this.ObjSubLedger = Obj;
      this.GetVendorAddressDetails(this.ObjSubLedger.Sub_Ledger_ID);
      this.ObjSubLedger.Address_Caption = undefined;
      this.ObjSubLedger.Sub_Ledger_Address_1 = "";
      this.ObjSubLedger.Sub_Ledger_Land_Mark = "";
      this.ObjSubLedger.Sub_Ledger_Pin = undefined;
      this.ObjSubLedger.Sub_Ledger_District = "";
      this.ObjSubLedger.Sub_Ledger_State = "";
      this.ObjSubLedger.Sub_Ledger_Country = "";
      this.ObjSubLedger.Sub_Ledger_GST_No = "";
    } else {
      this.VendorObj.emit(this.ObjSubLedger);
    }
  }
  ChangeSubLedgerAddress(captionName) {
    // ctrl.statedisable = false;
    this.ObjSubLedger.Sub_Ledger_Address_1 = "";
    this.ObjSubLedger.Sub_Ledger_Land_Mark = "";
    this.ObjSubLedger.Sub_Ledger_Pin = undefined;
    this.ObjSubLedger.Sub_Ledger_District = "";
    this.ObjSubLedger.Sub_Ledger_State = "";
    this.ObjSubLedger.Sub_Ledger_Country = "";
    this.ObjSubLedger.Sub_Ledger_GST_No = "";
    this.VendorFormSubmitted = this.ObjSubLedger.Address_Caption ? false : true;
    const List = this.VendorAddressLists.map(x => Object.assign({}, x));
    if (captionName) {
      const obj = $.grep(List, function(value) {
        return value.Address_Caption === captionName;
      })[0];
      this.ObjSubLedger.Sub_Ledger_Address_1 = obj.Address_1;
      this.ObjSubLedger.Sub_Ledger_Land_Mark = obj.Land_Mark;
      this.ObjSubLedger.Sub_Ledger_Pin = obj.Pin;
      this.ObjSubLedger.Sub_Ledger_District = obj.District;
      this.ObjSubLedger.Sub_Ledger_State = obj.State;
      this.ObjSubLedger.Sub_Ledger_Country = obj.Country;
      this.ObjSubLedger.Sub_Ledger_GST_No = obj.Sub_Ledger_GST_No;
      // this.ObjSubLedger = obj;
      this.EmitOnDataInit();
    }
  }

  EmitOnDataInit() {
    this.VendorObj.emit(this.ObjSubLedger);
  }

  clear() {
    this.VendorAddressLists = [];
    this.ObjSubLedger = new Vendor();
  }
  setAddress(add_Caption) {
    this.ObjSubLedger.Address_Caption = add_Caption;
  }
}
class Vendor {
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
  Address_Caption: string;

  Broker_ID: any;
}
