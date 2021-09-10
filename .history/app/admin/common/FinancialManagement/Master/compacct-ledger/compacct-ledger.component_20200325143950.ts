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
  LedgerID:any;
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
