import { Component, OnInit } from '@angular/core';

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
