import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { data } from "jquery";
import { Console } from "console";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { CompacctCommonApi } from "../../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../../../shared/compacct.global/dateTime.service";
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-financial-reminder',
  templateUrl: './financial-reminder.component.html',
  styleUrls: ['./financial-reminder.component.css'],
  providers:[MessageService],
  encapsulation: ViewEncapsulation.None
})
export class FinancialReminderComponent implements OnInit {

  tabIndexToView : any = 0;
  items : any = [];
  buttonname  : any = 'Create';
  seachSpinner : any= false;
  Spinner : any = false;
  objPending : Pending = new Pending();
  objComplete : Complete = new Complete();
  Entry_Date = new Date();
  Entry_Date2 = new Date();
  Received_Date = new Date();
  PendingFormSubmitted : any = false;
  CompleteFormSubmitted : any = false;
  Save : boolean = false ;
  Del : boolean = false;
  ReminderList : any = [];
  Searchedlist : any = [];
  Searchedlist2 : any = [];
  ViewProTypeModal : any = false;
  Remarks : string = "";
  Remarkssubmitted : any = false;
  VoucherID : any;
  Voucher : any;
  LedgerFilter : any = [];
  SubLedgerFilter : any = [];
  SelectedLedger : any = [];
  SelectedSubLedger : any = [];
  backupsearchList : any = [];
  LedgerFilter2 : any = [];
  SubLedgerFilter2 : any = [];
  SelectedLedger2 : any = [];
  SelectedSubLedger2 : any = [];
  backupsearchList2 : any = [];

  constructor(
    private http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private route : ActivatedRoute,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header:  " Financial Reminder " ,
      Link: " " 
    });
    this.items = ["PENDING", "COMPLETED"];
    this.getReminder();
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["PENDING", "COMPLETED"];
    this.buttonname = "Save";
    this.clearData();
    //this.Editdisable = false;
  }

  onReject(){
    this.compacctToast.clear("c");
  }

  getReminder(){
    const obj = {
      "SP_String": "SP_Financial_Voucher",
      "Report_Name_String": "Get_Reminder"
      
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ReminderList = data;
       console.log('ReminderList=====',this.ReminderList)
       
     })

  }
  

  GetSearchedList(valid : any){
    this.PendingFormSubmitted = true;
    if(valid)
    {
      
 
  this.seachSpinner = true;
  this.Searchedlist = [];
  const Entry_Date =  this.DateService.dateConvert(new Date(this.Entry_Date))
  
 
 const tempobj = {
  Reminder_Date : Entry_Date,
  Reminder_Type : this.objPending.Reminder_Type 


}
const obj = {
  "SP_String": "SP_Financial_Reminder",
  "Report_Name_String": "Get_Pending_Voucher_Details",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   this.backupsearchList = data;
   if(this.Searchedlist.length)
   {
    this.GetDist1();
    this.GetDist2();
   }
   console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
   this.PendingFormSubmitted = false;
 })
}

}

GetDist1() {
  let DOrderBy = [];
  this.LedgerFilter = [];
  //this.SelectedDistOrderBy1 = [];
  this.backupsearchList.forEach((item:any) => {
    if (DOrderBy.indexOf(item.Ledger_Name) === -1) {
      DOrderBy.push(item.Ledger_Name);
      this.LedgerFilter.push({ label: item.Ledger_Name, value: item.Ledger_Name });
      console.log("this.LedgerFilter", this.LedgerFilter);
    }
  });
}

GetDist2(){
  let DOrderBy = [];
  this.SubLedgerFilter = [];
  //this.SelectedDistOrderBy1 = [];
  this.backupsearchList.forEach((item:any) => {
    if (DOrderBy.indexOf(item.Sub_Ledger_Name) === -1) {
      DOrderBy.push(item.Sub_Ledger_Name);
      this.SubLedgerFilter.push({ label: item.Sub_Ledger_Name, value: item.Sub_Ledger_Name });
      console.log("this.SubLedgerFilter", this.SubLedgerFilter);
    }
  });

}



filterLedger(){
  console.log("SelectedLedger", this.SelectedLedger);
  let DOrderBy = [];
  if (this.SelectedLedger.length) {
    DOrderBy = this.SelectedLedger;
  }
  this.Searchedlist = [];
  if (this.SelectedLedger.length) {
    let LeadArr = this.backupsearchList.filter(function (e) {
      return (DOrderBy.length ? DOrderBy.includes(e['Ledger_Name']) : true)
    });
    this.Searchedlist = LeadArr.length ? LeadArr : [];
    console.log("if GetAllDataList", this.Searchedlist)
  } else {
    this.Searchedlist = this.backupsearchList;
    console.log("else GetAllDataList", this.Searchedlist)
  }

}

filterSubLedger(){
  console.log("SelectedSubLedger", this.SelectedSubLedger);
  let DOrderBy = [];
  if (this.SelectedSubLedger.length) {
    DOrderBy = this.SelectedSubLedger;
  }
  this.Searchedlist = [];
  if (this.SelectedSubLedger.length) {
    let LeadArr = this.backupsearchList.filter(function (e) {
      return (DOrderBy.length ? DOrderBy.includes(e['Sub_Ledger_Name']) : true)
    });
    this.Searchedlist = LeadArr.length ? LeadArr : [];
    console.log("if GetAllDataList", this.Searchedlist)
  } else {
    this.Searchedlist = this.backupsearchList;
    console.log("else GetAllDataList", this.Searchedlist)
  }

}

GetSearchedList2(valid : any){
  this.CompleteFormSubmitted = true;
  if(valid)
  {
    

this.seachSpinner = true;
this.Searchedlist2 = [];
const Entry_Date =  this.DateService.dateConvert(new Date(this.Entry_Date2))


const tempobj = {
Voucher_Date : Entry_Date,
Reminder_Type : this.objComplete.Reminder_Type2 


}
const obj = {
"SP_String": "SP_Financial_Reminder",
"Report_Name_String": "Get_Completed_Voucher_Details",
"Json_Param_String": JSON.stringify([tempobj])
}
this.GlobalAPI.getData(obj).subscribe((data:any)=>{
 this.Searchedlist2 = data;
 this.backupsearchList2 = data;
   if(this.Searchedlist2.length)
   {
    this.GetDist3();
    this.GetDist4();
   }
 console.log('Search list=====',this.Searchedlist2)
 this.seachSpinner = false;
 this.CompleteFormSubmitted = false;
})
}


}

GetDist3(){
  let DOrderBy = [];
  this.LedgerFilter2 = [];
  //this.SelectedDistOrderBy1 = [];
  this.backupsearchList2.forEach((item:any) => {
    if (DOrderBy.indexOf(item.Ledger_Name) === -1) {
      DOrderBy.push(item.Ledger_Name);
      this.LedgerFilter2.push({ label: item.Ledger_Name, value: item.Ledger_Name });
      console.log("this.LedgerFilter2", this.LedgerFilter2);
    }
  });

}

GetDist4(){
  let DOrderBy = [];
  this.SubLedgerFilter2 = [];
  //this.SelectedDistOrderBy1 = [];
  this.backupsearchList2.forEach((item:any) => {
    if (DOrderBy.indexOf(item.Sub_Ledger_Name) === -1) {
      DOrderBy.push(item.Sub_Ledger_Name);
      this.SubLedgerFilter2.push({ label: item.Sub_Ledger_Name, value: item.Sub_Ledger_Name });
      console.log("this.SubLedgerFilter2", this.SubLedgerFilter2);
    }
  });

}
filterLedger2(){
  console.log("SelectedLedger2", this.SelectedLedger2);
  let DOrderBy = [];
  if (this.SelectedLedger2.length) {
    DOrderBy = this.SelectedLedger2;
  }
  this.Searchedlist2 = [];
  if (this.SelectedLedger2.length) {
    let LeadArr = this.backupsearchList2.filter(function (e) {
      return (DOrderBy.length ? DOrderBy.includes(e['Ledger_Name']) : true)
    });
    this.Searchedlist2 = LeadArr.length ? LeadArr : [];
    console.log("if GetAllDataList2", this.Searchedlist2)
  } else {
    this.Searchedlist2 = this.backupsearchList2;
    console.log("else GetAllDataList2", this.Searchedlist2)
  }


}

filterSubLedger2(){
  console.log("SelectedSubLedger2", this.SelectedSubLedger2);
  let DOrderBy = [];
  if (this.SelectedSubLedger2.length) {
    DOrderBy = this.SelectedSubLedger2;
  }
  this.Searchedlist2 = [];
  if (this.SelectedSubLedger2.length) {
    let LeadArr = this.backupsearchList2.filter(function (e) {
      return (DOrderBy.length ? DOrderBy.includes(e['Sub_Ledger_Name']) : true)
    });
    this.Searchedlist2 = LeadArr.length ? LeadArr : [];
    console.log("if GetAllDataList2", this.Searchedlist2)
  } else {
    this.Searchedlist2 = this.backupsearchList2;
    console.log("else GetAllDataList2", this.Searchedlist2)
  }

}

PrintVoucher(col){
  const tempobj = {
    Voucher_No  : col.Voucher_No
  }
  const obj = {
    "SP_String": "SP_Financial_Reminder",
    "Report_Name_String": "Get_Voucher_Print",
    "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Voucher = data[0].Voucher_No;
     console.log('Voucher=====',this.Voucher);
     //var Voucher1 = data;
     window.open(this.Voucher, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    
    })

//   if (obj.Appo_ID) {
//     window.open("Report/Crystal_Files/CRM/Clinic/Audiometry_Report_CC_Saha_P1.aspx?Appo_ID=" + obj.Appo_ID, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

//     );
// }

}

exportoexcel(fileName){
  if(this.Searchedlist.length){
    this.Searchedlist.forEach((ele:any) => {
      ele.Voucher_Date = new Date(ele.Voucher_Date),
      ele.Pending_On = new Date(ele.Pending_On)
      
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.Searchedlist);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }   

}

exportoexcel1(fileName){
  if(this.Searchedlist2.length){
    this.Searchedlist2.forEach((ele:any) => {
      ele.Voucher_Date = new Date(ele.Voucher_Date),
      ele.Pending_On = new Date(ele.Pending_On),
      ele.Reminder_Received_On = new Date(ele.Reminder_Received_On)
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.Searchedlist2);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
}

Received(col : any){
  this.Remarks = "";
  this.Remarkssubmitted = false;
  this.VoucherID = col.Voucher_ID;
  setTimeout(() => {
    this.ViewProTypeModal = true;
  }, 200);
  

}
UpdateRemarks(Remarks){
  this.Remarkssubmitted = true;
  if(Remarks){
    const Received_Date =  this.DateService.dateConvert(new Date(this.Received_Date))
    const tempobj = {
        Voucher_ID : this.VoucherID,
        Reminder_Remarks : Remarks,
        Reminder_Received_On : Received_Date 
      }
      const obj = {
        "SP_String": "SP_Financial_Reminder",
        "Report_Name_String": "Update_Received_Remarks",
        "Json_Param_String": JSON.stringify([tempobj])
      }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log('data=',data[0].Column1);
        if(data[0].Column1 == 'Successfully Done')
           {
            
             //this.SubLedgerID = data[0].Column1
            this.compacctToast.clear();
            this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Financial Reminder Update Succesfully ",
            detail: "Succesfully Updated"
          });
          this.Spinner = false;
          this.ViewProTypeModal = false;
          
          this.Remarkssubmitted = false;
          this.GetSearchedList(true);
        }
        else{
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Something Wrong"
        });
        this.Spinner = false;
        
        }
         
       })


   }
}

  onConfirm(){

  }

  onConfirm2(){

  }

  clearData(){
    this.objComplete = new Complete();
    this.objPending = new Pending();
    this.Searchedlist = [];
    this.Searchedlist2 = [];
    this.LedgerFilter = [];
    this.LedgerFilter2 = [];
    this.SubLedgerFilter = [];
    this.SubLedgerFilter2 = [];
    this.PendingFormSubmitted = false;
    this.CompleteFormSubmitted = false;
    this.SelectedLedger = [];
    this.SelectedLedger2 = [];
    this.SelectedSubLedger = [];
    this.SelectedSubLedger2= [];

  }

}

class Pending{
  Reminder_Type : any;


}

class Complete{
  Reminder_Type2 : any;
}
