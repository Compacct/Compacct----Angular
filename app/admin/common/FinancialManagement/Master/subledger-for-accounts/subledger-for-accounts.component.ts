import { DateTimeConvertService } from './../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from './../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from './../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from './../../../../shared/compacct.services/compacct.global.api.service';
import { data } from 'jquery';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { HttpClient, HttpParams } from "@angular/common/http";

@Component({
  selector: 'app-subledger-for-accounts',
  templateUrl: './subledger-for-accounts.component.html',
  styleUrls: ['./subledger-for-accounts.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SubledgerForAccountsComponent implements OnInit {
  items = [];
  menuList=[];
  tabIndexToView= 0;
  buttonname = "Create";
  Spinner = false;
  AllData=[];
  Objsubledger: subledger= new subledger()
  constructor(  
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header:CompacctHeader, 
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    ) {}
    

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
  this.menuList = [
    { label: "Edit", icon: "pi pi-fw pi-user-edit" },
    { label: "Delete", icon: "fa fa-fw fa-trash" }
  ];
  this.GetBrowseData();
  this.header.pushHeader({
    Header: "Subledger For Accounts",
    Link: "Financial Management-> Master-> Subledger For Accounts "
  })
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
    
  }
  onReject(){}
  clearData(){
    // this.leaveFormSubmitted = false;
     this.Objsubledger = new subledger();
    // this.leaveId = undefined;
   }
   GetBrowseData(){
    const obj = {
      "SP_String":"Sp_Accounting_Sub_Ledger",
      "Report_Name_String":"Browse_Master_Accounting_Sub_Ledger"
    }
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.AllData = data;
      console.log("Browse data==",data);
      });   
   }
   saveData(valid){}
}
class subledger{

}
