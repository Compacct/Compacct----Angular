import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { stringify } from 'querystring';
import { HttpClient } from '@angular/common/http';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-compacct-ledger',
  templateUrl: './compacct-ledger.component.html',
  styleUrls: ['./compacct-ledger.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CompacctLedgerComponent implements OnInit {
  saveSpinner = false;
  items = [];
  cols = [];
  menuList = [];
  buttonname = "Create";
  urlService = window["config"];
  tabIndexToView = 0;
  LedgerFormSubmitted = false;
  ValidGroupFlag = false;

  LedgerLists = [];
  AccountingGroupsLists = [];
  BankTynLists = [];

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
      { field: "Accounting_Group_Name", header: "Accounting Group Name" },
    ];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.items = ["BROWSE", "CREATE"];

    this.Header.pushHeader({
      Header: "Accounting Ledger",
      Link: " Financial Management -> Master -> Accounting Ledger"
    });
    this.GetAllLedgerLists();
    this.GetAccountingGroups();
    this.GetBankTyn();
  }


  GetAllLedgerLists() {
    this.$http.get('/Master_Accounting_Ledger_V2/GetAllData').subscribe((data: any) => {
      this.LedgerLists = data ? JSON.parse(data) : [];
    });
 }
  GetAccountingGroups() {
    this.$http.get('/Master_Accounting_Ledger_V2/Get_Accounting_Group').subscribe((data: any) => {
      const NativeAccountingGroupList = data ? JSON.parse(data) : [];
      console.log(NativeAccountingGroupList);
      NativeAccountingGroupList.forEach(el => {
          this.AccountingGroupsLists.push({
            label: el.Accounting_Group_Name ,
            value: el.Accounting_Group_ID
          });
        });
    });
 }
  GetBankTyn () {
  this.$http.get('/Master_Accounting_Ledger_V2/Get_Transaction_Type').subscribe((data: any) => {
    if (data) {
      const bankList = data ? JSON.parse(data) : [];
      console.log(bankList);
      bankList.forEach(el => {
        this.BankTynLists.push({
          label: el.Txn_Type_Name,
          value: el.Bank_Txn_Type_ID
        });
      });
    } else {
      this.BankTynLists = [];
    }
  });
 }


// CHANGE
TabClick(e) {
  this.tabIndexToView = e.index;
  this.items = ["BROWSE", "CREATE"];
  this.buttonname = "Create";
  this.ClearData();
}
AccountingGrpChange(groupID){
  this.ValidGroupFlag = false;
  if(groupID) {
    console.log(groupID)
   // const tempObj = $.g
   this.ValidGroupFlag = groupID === 14 || groupID === 3 || groupID === 2 ? true : false;
  }
}
EditLeger(obj){
  if(obj.Ledger_ID){
    this.ClearData();
    this.ObjLedger = obj;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.tabIndexToView = 1;

  }
}
//  SAVE & UPDATE & CLEAR
SaveLedger(valid) {
  this.LedgerFormSubmitted = true;
  console.log(this.ObjLedger);
  if (valid) {
    const bnktrnflag = this.ValidGroupFlag && this.SelectedBankTrn.length ? false : true;
    if(bnktrnflag){
      this.saveSpinner = true;

      const url = this.ObjLedger.Ledger_ID
        ? this.urlService.updatestocktransfer
        : this.urlService.createStocktransferGst;

      this.$http.post(url, this.ObjLedger).subscribe((data: any) => {
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
      });

    }else{
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Please Choose Bank Trn Type "
      });
    }

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
  Ledger_Short_Name: string;
  Bank_Txn_Type_ID:string;
  Sub_Ledger: string;
}
