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
  Spinner = false;
  items = [];
  menuList=[];
  tabIndexToView= 0;
  buttonname = "Create";
  AllData=[];
  AllLedgerList =[];
  AllTagLedger =[];
  TagledgerList =[];
  ledgerList =[];
  Objsubledger: subledger= new subledger();
  ledgerId = undefined;
  LedgerFormSubmit =false;
  masterLedgerId : number;
  mastertagLedgerId =undefined;
  SelectedTagLedger = [];
  editlist = [];
  
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
  this.getLedger();
  this.getTagLedger();
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
  clearData(){
    this.LedgerFormSubmit = false;
     this.Objsubledger = new subledger();
     this.ledgerId = undefined;
     this.SelectedTagLedger = [];

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
   getLedger(){
    this.AllLedgerList=[]; 
   this.ledgerList = [];
  
     const obj = {
       "SP_String": "sp_Comm_Controller",
       "Report_Name_String":"Dropdown_Ledger",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.AllLedgerList = data;
      console.log("AllLedgerList",this.AllLedgerList);
       this.AllLedgerList.forEach(el => {
         this.ledgerList.push({
           label: el.Ledger_Name,
           value: el.Ledger_ID
         });
       });
     })
   }
   getTagLedger(){
    this.AllTagLedger=[]; 
    this.TagledgerList = [];
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String":"Dropdown_Tag_Ledger",
     }
     this.GlobalAPI.getData(obj)
     .subscribe((data : any)=>
     {
       this.AllTagLedger = data;
       console.log('AllTagLedger=',this.AllTagLedger);
       this.AllTagLedger.forEach(el => {
        this.TagledgerList.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        });
      });
      
     });
  }
 EditLedger(subledger:any){
      this.ledgerId = undefined;
     // this.Editdisable = false;
      if (subledger.Sub_Ledger_ID) {
        //this.Editdisable = true;
        this.ledgerId = undefined;
        this.tabIndexToView = 1;
        this.items = ["BROWSE", "UPDATE"];
        this.buttonname = "Update";
        this.clearData();
        this.ledgerId = subledger.Ledger_ID;
        this.SelectedTagLedger = [];
        
        this.GetEditMasterledger(subledger.Sub_Ledger_ID)
       }    
  }
  GetEditMasterledger(Lid){
    const tempobj = {
      Sub_Ledger_ID : this.ledgerId,
    }
    const obj = {
      "SP_String": "Sp_Accounting_Sub_Ledger",
      "Report_Name_String":"Get_Master_Accounting_Sub_Ledger",
      "Json_Param_String": JSON.stringify([tempobj]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{  
       console.log("EditMasterdata===",data);
       this.editlist = data;
      this.Objsubledger = data[0];
      let tagArr = [];
      this.editlist.forEach(el=>{
        tagArr.push(el.Tag_Ledger_ID)
      })
      if(tagArr.length){
        this.getTagLedger();
        setTimeout(() => {
          this.SelectedTagLedger = [...tagArr]
        }, 2000);
        console.log("SelectedTagLedger",this.SelectedTagLedger);
      }
     
      
     })
  }
  DeleteLedger(masterLedger): void{
    this.masterLedgerId = undefined ;
    this.mastertagLedgerId =undefined;
    if(masterLedger.Ledger_ID){
      this.masterLedgerId = masterLedger.Sub_Ledger_ID ;
      this.mastertagLedgerId = masterLedger.Tag_Ledger_ID;
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
  onConfirm(){ 
  console.log("onconform==",this.Objsubledger)
    if(this.masterLedgerId){
      const tempobj = {
        Sub_Ledger_ID : this.masterLedgerId,
        Tag_Ledger_ID : this.mastertagLedgerId,
  
      }
      const obj = {
        "SP_String": "Sp_Accounting_Sub_Ledger",
        "Report_Name_String": "Deactive_Master_Accounting_Sub_Ledger",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log("del Data===", data[0].Column1)
        if (data[0].Column1 === "done"){
          this.onReject();
          this.GetBrowseData();
          // this.masterLedgerId = undefined ;
          // this.mastertagLedgerId =undefined;
        //  this.can_popup = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Ledger Id: " + this.masterLedgerId,
            detail: "Succesfully Deleted"
          });
         }
      })
    }
  }
  onReject(){
    this.compacctToast.clear("c");
  }
  saveData(valid:any){
    console.log("savedata==",this.Objsubledger);
    this.LedgerFormSubmit = true;
    console.log("SelectedTagLedger >>",this.SelectedTagLedger)
    if(valid){
      let saveData = [];
      this.SelectedTagLedger.forEach(el=>{
        const obj = {
          Tag_Ledger_ID	:el
        }
        saveData.push({...obj,...this.Objsubledger})
      });
      console.log("saveData",saveData);
      let msg = this.ledgerId ? "Update" : "Create"
        const obj = {
          "SP_String": "Sp_Accounting_Sub_Ledger",
          "Report_Name_String": this.ledgerId ? 'Edit_Master_Accounting_Sub_Ledger' : 'Add_Master_Accounting_Sub_Ledger',
          "Json_Param_String": JSON.stringify(saveData) 
         }
         this.GlobalAPI.getData(obj)
         .subscribe((data:any)=>{
          console.log("data ==",data);
          if (data[0].Ledger_ID || data[0].Column1){
            this.SelectedTagLedger = [];
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Subledger Succesfully " +msg,
              detail: "Succesfully " +msg
            });
            }
            this.Spinner = false;
            this.GetBrowseData();
            this.ledgerId = undefined;
            this.tabIndexToView = 0;
            this.LedgerFormSubmit = false;
            this.Objsubledger = new subledger();
          });
      }
      else{
        console.error("Somthing Wrong")
      }  
     }
}
class subledger{
  Ledger_ID:number;
  Ledger_Name:any;
  Sub_Ledger_Name:any;
  Sub_Ledger_ID:number;
  Is_Visiable:any = "N";

  Tag_Ledger_ID	:number
}
