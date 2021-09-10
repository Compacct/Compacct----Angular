import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Data } from '@angular/router';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-crm-payment-bank',
  templateUrl: './crm-payment-bank.component.html',
  styleUrls: ['./crm-payment-bank.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CRMPaymentBankComponent implements OnInit {
  items = [];
  tabIndexToView = 0;
  buttonname = "Create";
  menuList = [];
  Spinner = false;
  paymentFormSubmit = false;
  GetalldataList = []
  BankID = undefined;
  Objpayment: payment = new payment();
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Payment Bank Master",
      Link: "CRM -> Master -> Payment Bank Master"
    });
    this.GetallData();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){
    this.Objpayment = new payment();
    this.paymentFormSubmit = false;
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  
  SavePaymentMaster(valid){
  this.paymentFormSubmit = true;
  if(valid){
    this.Spinner = true;
    console.log("save",this.Objpayment)
   if(this.Objpayment.Bank_ID){
     console.log("Update");
    const obj = {
      "SP_String": "SP_Bank_Master_Payment_Followup",
      "Report_Name_String": "Add_Edit_Bank_Master_Payment_Followup",
      "Json_Param_String": JSON.stringify([this.Objpayment])      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if (data[0].Bank_ID){
         this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Bank Id:"  + this.Objpayment.Bank_ID.toString(),
         detail: "Succesfully Update"
       });
       this.GetallData();
       this.tabIndexToView = 0;
       this.items = ["BROWSE", "CREATE"];
       this.buttonname = "Create";
       }
       this.Spinner = false;
       this. clearData();
    })
   }
   else{
     console.log("Save");
    const obj = {
      "SP_String": "SP_Bank_Master_Payment_Followup",
      "Report_Name_String": "Add_Edit_Bank_Master_Payment_Followup",
      "Json_Param_String": JSON.stringify([this.Objpayment])      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      const TempId = data[0].Bank_ID;
      if (data[0].Bank_ID){
         this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Bank Id: " + TempId.toString(),
         detail: "Succesfully Created"
       });
       this.GetallData();
       this.tabIndexToView = 0;
       this.items = ["BROWSE", "CREATE"];
       this.buttonname = "Create";
       }
       this.Spinner = false;
       this. clearData();
    })
   }
 }
  }
 GetallData(){
  const obj = {
    "SP_String": "SP_Bank_Master_Payment_Followup",
    "Report_Name_String": "All_Data_Bank_Master_Payment_Followup",
    "Json_Param_String": JSON.stringify([]) 
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.GetalldataList = data;
     console.log("All Data",this.GetalldataList);
   })
  }
  EditPayment(col){
    if (col.Bank_ID) {
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.clearData();
      this.GetEditMaster(col.Bank_ID);
    }
  }
  GetEditMaster(Bank_ID){
   if(Bank_ID){
     const tempObj = {
      Bank_ID:Bank_ID
     }
    const obj = {
      "SP_String": "SP_Bank_Master_Payment_Followup",
      "Report_Name_String": "Retrieve_Bank_Master_Payment_Followup",
      "Json_Param_String": JSON.stringify([tempObj])      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Objpayment.Bank_ID = data[0].Bank_ID;
      this.Objpayment.Bank_Type = data[0].Bank_Type;
      this.Objpayment.Name = data[0].Name;
      this.Objpayment.Head_Office = data[0].Head_Office;
      console.log("Edit Data",this.Objpayment);
    })
   }
  }
  DeletePayment(col){
  this.BankID = undefined;
  if(col.Bank_ID){
    this.BankID = col.Bank_ID;
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
   if(this.BankID){
    const tempObj = {
      Bank_ID:this.BankID
     }
    const obj = {
      "SP_String": "SP_Bank_Master_Payment_Followup",
      "Report_Name_String": "Delete_Bank_Master_Payment_Followup",
      "Json_Param_String": JSON.stringify([tempObj])      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if (data[0].Column1 === "Done"){
        this.onReject();
        this.GetallData();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Bank Id: " + this.BankID.toString(),
          detail: "Succesfully Deleted"
        });
      }
    })
   }
  }
}

class payment {
  Bank_ID : number = 0;
  Bank_Type : any;
  Name : any;
  Head_Office : any;
}
