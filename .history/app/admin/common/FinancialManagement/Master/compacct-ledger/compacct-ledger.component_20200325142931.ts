import { Component, OnInit } from '@angular/core';
import { stringify } from 'querystring';

@Component({
  selector: 'app-compacct-ledger',
  templateUrl: './compacct-ledger.component.html',
  styleUrls: ['./compacct-ledger.component.css']
})
export class CompacctLedgerComponent implements OnInit {
  LedgerFormSubmitted = false;
  ValidGroupFlag = false;

  LedgerLists : [];
  AccountingGroupsLists: [];
  BankTynLists: [];

  SelectedBankTrn =  [];
  subledgerVal = 0;
  constructor() { }

  ngOnInit() {
  }
  GetAllLedgerLists() {
    this.$http.get('/Master_Product_Category/GetAllData').subscribe((data: any) => {
      this.LedgerLists = data ? data : [];
    });
 }
  GetAccountingGroups() {
    this.$http.get('/Master_Product_Category/GetAllData').subscribe((data: any) => {
      this.AccountingGroupsLists = data ? data : [];
    });
 }
 GetBankTyn () {
  this.$http.get('/Master_Product_Mfg/GetAllData').subscribe((data: any) => {
    this.BankTynLists = data ? data : [];
  });
}


// CHANGE
AccountingGrpChange(groupID){
  if(groupID) {
   // const tempObj = $.g
  }
}

}
class Ledger () {
  Ledger_ID: string;
  Accounting_Group_ID: string;
  Ledger_Name: string;
  Sub_Ledger: stringify;
}
