import { Component, OnInit } from '@angular/core';
import { stringify } from 'querystring';
import { HttpClient } from '@angular/common/http';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-compacct-ledger',
  templateUrl: './compacct-ledger.component.html',
  styleUrls: ['./compacct-ledger.component.css'],
  providers: [MessageService]
})
export class CompacctLedgerComponent implements OnInit {
  saveSpinner = false;
  items = [];
  buttonname = "Create";
  url = window["config"];
  tabIndexToView = 0;
  LedgerFormSubmitted = false;
  ValidGroupFlag = false;

  LedgerLists : [];
  AccountingGroupsLists: [];
  BankTynLists: [];

  SelectedBankTrn =  [];
  subledgerVal = false;
  ObjLedger = new Ledger();
  LedgerID:any;
  constructor(  private $http: HttpClient,
    private Header: CompacctHeader,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.cols = [
      { field: "Ledger_Name", header: "Ledger Name" },
      { field: "Accounting_Group", header: "Accounting Group Name" },
    ];
    this.items = ["BROWSE", "CREATE"];

    this.Header.pushHeader({
      Header: "Accounting Ledger",
      Link: " Financial Management -> Master -> Accounting Ledger"
    });
  }


  GetAllLedgerLists() {
    this.$http.get('/Master_Product_Category/GetAllData').subscribe((data: any) => {
      this.LedgerLists = data ? data : [];
    });
 }
  GetAccountingGroups() {
    this.$http.get('').subscribe((data: any) => {
      const NativeProductList = data ? JSON.parse(data) : [];
      NativeProductList.forEach(el => {
          this.AccountingGroupsLists.push({
            label: el.Product_Name,
            value: el.Product_ID
          });
        });
    });
 }
  GetBankTyn () {
  this.$http.get('/Master_Product_Mfg/GetAllData').subscribe((data: any) => {
    if (data) {
      const bankList = data ? JSON.parse(data) : [];
      bankList.forEach(el => {
        this.BankTynLists.push({
          label: el.Serial_No,
          value: el.Serial_No
        });
      });
    } else {
      this.BankTynLists = [];
    }
  });
 }


// CHANGE
AccountingGrpChange(groupID){
  if(groupID) {
   // const tempObj = $.g
  }
}
EditLeger(obj){
  if(obj.Ledger_ID){
    this.ClearData();
    this.ObjLedger = obj;
    this.buttonname = "Update";
    this.tabIndexToView = 1;

  }
}
//  SAVE & UPDATE & CLEAR
SaveLedger(valid) {
  this.LedgerFormSubmitted = true;
  console.log(this.ObjLedger);
  if (valid) {
    this.saveSpinner = true;

    const url = this.ObjLedger.Ledger_ID
      ? this.urlService.updatestocktransfer
      : this.urlService.createStocktransferGst;

    this.$http.post(url, ParamString).subscribe((data: any) => {
      if (data.success === true) {
        console.group("Compacct V2");
        console.log("%c Ledger Sucess:", "color:green;", data.Doc_No);
        console.log(url);
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: data.Doc_No,
            detail: this.ObjLedger.Ledger_ID
              ? "Succesfully Updated"
              : "Succesfully Created"
          });
          this.GetAllLedgerLists();
          this.ClearData();
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
      this.saveSpinner = false;
      this.StockFormSubmitted = false;
    });
  }
}
ClearData() {
  this.SelectedBankTrn =  [];
  this.subledgerVal = false;
  this.ObjLedger = new Ledger();

  this.saveSpinner = false;
  this.LedgerFormSubmitted = false;
  this.ValidGroupFlag = false;
}

// DELETE
onConfirm() {
  if (this.LedgerID) {
    this.$http
      .post('this.urlService.deletestocktransfer', { id: this.LedgerID })
      .subscribe((data: any) => {
        if (data.success === true) {
          this.GetAllLedgerLists();
          this.onReject();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: this.LedgerID,
            detail: "Succesfully Deleted"
          });
        }
      });
  }
}
onReject() {
  this.compacctToast.clear("c");
}
DeleteLedger(obj) {
  this.LedgerID = undefined;
  if (obj.Ledger_ID) {
    this.LedgerID = obj.Ledger_ID;
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Are you sure?",
      detail: "Confirm to proceed"
    });
  }
}
}
class Ledger  {
  Ledger_ID: string;
  Accounting_Group_ID: string;
  Ledger_Name: string;
  Sub_Ledger: string;
}
