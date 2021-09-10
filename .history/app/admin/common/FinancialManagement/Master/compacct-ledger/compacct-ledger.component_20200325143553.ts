import { Component, OnInit } from '@angular/core';
import { stringify } from 'querystring';

@Component({
  selector: 'app-compacct-ledger',
  templateUrl: './compacct-ledger.component.html',
  styleUrls: ['./compacct-ledger.component.css']
})
export class CompacctLedgerComponent implements OnInit {
  saveSpinner = false;
  LedgerFormSubmitted = false;
  ValidGroupFlag = false;

  LedgerLists : [];
  AccountingGroupsLists: [];
  BankTynLists: [];

  SelectedBankTrn =  [];
  subledgerVal = false;
  ObjLedger = new Ledger();
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
//  SAVE & UPDATE & CLEAR
SaveStockBill(valid) {
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
            detail: this.ObjStockBill.Doc_No
              ? "Succesfully Updated"
              : "Succesfully Created"
          });

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

}
class Ledger  {
  Ledger_ID: string;
  Accounting_Group_ID: string;
  Ledger_Name: string;
  Sub_Ledger: string;
}
