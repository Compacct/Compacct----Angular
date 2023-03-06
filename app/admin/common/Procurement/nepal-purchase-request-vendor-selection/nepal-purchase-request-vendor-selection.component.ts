import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"
import { map } from 'rxjs/operators';
import { THIS_EXPR, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { data } from 'jquery';
@Component({
  selector: 'app-nepal-purchase-request-vendor-selection',
  templateUrl: './nepal-purchase-request-vendor-selection.component.html',
  styleUrls: ['./nepal-purchase-request-vendor-selection.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalPurchaseRequestVendorSelectionComponent implements OnInit {
  items: any = [];
  tabIndexToView: number = 0;
  buttonname = "Save";
  objvendorSelection: vendorSelection = new vendorSelection();
  poRequestList: any = [];
  vendorSelectionFormSubmit: boolean = false;
  PoDate: any;
  Searchedlist: any = [];
  prList: any = [];
  Venderlist: any = [];
  VenderSelect: any = undefined;
  ToEmailSelect: any = undefined;
  SMSSelect: any = undefined;
  CCEmailSelect: any = undefined;
  SaveSpinner: boolean = false;
  seachSpinner: boolean = false;
  BrowseStartDate: any = {};
  BrowseEndDate: any = {};
  SearchFormSubmit: boolean = false;
  toEmailList: any = [];
  CCEmailList: any = [];
  SMSList: any = [];
  EmailCheck: boolean = false;
  SMSCheck: boolean = false;
  NewEmailFormSubmitted: boolean = false;
  CreateEmailModal: boolean = false;
  ViewCompanyModal: boolean = false;
  CompantEmailName: any = undefined;
  CompanyEmailList: any = [];
  EmailId: any = undefined;
  EditPoDate: any = undefined;
  DisableBUT: boolean = false;
  MobileForm: boolean = false;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items =  ["BROWSE", "CREATE"];
    this.Header.pushHeader({
     Header: "Purchase Request Vendor Selection",
     Link: "Procurement -> Transaction -> Purchase Request Vendor Selection"
   });
   this.BrowseStartDate =this.DateNepalConvertService.GetNepaliCurrentDateNew();
   this.BrowseEndDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
   this.tabIndexToView = 0
   this.getPRno()
   this.GetVender()
   this.getCompanyMail()
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
    console.log(e)
    this.EmailCheck = true
  }
  clearData(){
  this.objvendorSelection = new vendorSelection()
  this.vendorSelectionFormSubmit = false
  this.PoDate = undefined
  this.prList = []
    this.SaveSpinner = false
    this.ToEmailSelect = undefined;
    this.SMSSelect = undefined;
    this.CCEmailSelect = undefined;
    this.EmailCheck = true;
    this.VenderSelect = undefined;
    this.DisableBUT = false;
  }
  onReject(){
    this.compacctToast.clear("c");
  }
  getPRno(){
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Get_Purchase_Request_Doc_No_Vendor_Selection"
    }
    this.GlobalAPI.getData(obj)
    .subscribe((data: any) => {
      //console.log("Purchase_Request_No",data)
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Purchase_Request_No,
          element['value'] = element.Purchase_Request_No_Actual
        });
       this.poRequestList = data;
      }
       else {
        this.poRequestList = [];
  
      }
     // console.log("poRequestList",this.poRequestList)
    })
  }
  purchaseRequestChange(){
    if(this.objvendorSelection.Purchase_Request_No){
      this.getPr()
      const poRequestListFilter = this.poRequestList.filter((y:any)=> y.Purchase_Request_No_Actual == this.objvendorSelection.Purchase_Request_No)[0]
      if(poRequestListFilter){
        this.PoDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(poRequestListFilter.Purchase_Request_Date)
      }
    }
    else{
      this.prList = []
      this.VenderSelect = undefined
    }
  
  }
  getPr(){
   const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Get_Data_From_Purchase_Request",
        "Json_Param_String": JSON.stringify([{ Purchase_Request_No :this.objvendorSelection.Purchase_Request_No}])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log("prList",data)
      this.prList = data
      })
  }
  GetVender(){
  this.$http
  const obj = {
    "SP_String": "sp_Bl_Txn_Requisition_From_Salesman",
    "Report_Name_String": "Get_Sub_Ledger_For_Purchase"
  }
  this.GlobalAPI.getData(obj)
  .subscribe((data: any) => {
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Sub_Ledger_Name,
          element['value'] = element.Sub_Ledger_ID
        });
       this.Venderlist = data;
      }
       else {
        this.Venderlist = [];
  
      }
    });
  }
  SavevendorSeletction(valid:any) {
    this.MobileForm = true
    if (valid) {
      if(this.VenderSelect && this.objvendorSelection.Purchase_Request_No){
      this.ngxService.start();
      this.SaveSpinner = true
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Update_Purchase_Request_Sub_Ledger_ID",
        "Json_Param_String": JSON.stringify([
          { 
            Purchase_Request_No :this.objvendorSelection.Purchase_Request_No,
            Sub_Ledger_ID: this.VenderSelect
          }
          ])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        //console.log("data Save",data)
        if(data[0].Column1 == "Done"){
          this.compacctToast.clear();
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           detail: "Vendor Succesfully Save"
         });
         this.prList = []
        this.VenderSelect = undefined
        this.objvendorSelection = new vendorSelection()
        this.ngxService.stop();
        this.SaveSpinner = false
        this.MobileForm = false
        this.PoDate = undefined
        this.items = ["BROWSE", "CREATE"];
        this.buttonname = "Save";
        this.GetSearchedList(true)
        }
        else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Something Wrong"
          });
          this.ngxService.stop();
          this.SaveSpinner = false
        }
      })
    } 
    }
   
  }
  GetSearchedList(valid:any){
    this.SearchFormSubmit = true
    if(valid){
      this.seachSpinner = true
      this.Searchedlist = []
      const tempobj = {
        From_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseStartDate)),
        To_Date  : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseEndDate)),
      }
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Browse_Purchase_Request_For_Vendor",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        //console.log("search Data",data)
        if (data.length) {
           data.forEach((ele:any) => {
                ele['Edit_V_Date'] = ele.Date
            });
         data.forEach((y:any) => {
          y.Date = this.DateNepalConvertService.convertEngToNepaliFormatDateObj(y.Date);
          });
         this.Searchedlist = data
        // console.log("Searchedlist",this.Searchedlist)
        }
        this.seachSpinner = false
      })
    }
  }
  EditVender(col: any) {
    this.EditPoDate = undefined;
    this.DisableBUT = false;
    if (col.Purchase_Request_No) {
      if (col.PO_Order_No.length !== 0) {
        this.DisableBUT = true;
      }
    this.items = ["BROWSE", "UPDATE"];
    this.tabIndexToView = 1
    this.buttonname = "Update"
    this.objvendorSelection.Purchase_Request_No = col.Purchase_Request_No
    this.purchaseRequestChange()
    this.VenderSelect = col.Sub_Ledger_ID
    this.EditPoDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(col.Edit_V_Date);
  }
  }
  getEmailId(col) {
    this.toEmailList = [];
    this.CCEmailList = [];
    this.EmailCheck = false;
    this.SMSCheck = false;
    this.ToEmailSelect = undefined;
    this.CCEmailSelect = undefined;
    this.CompantEmailName = undefined;
    this.SMSSelect = undefined;
    if (col) {
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Get_Subledger_Email_ID",
       "Json_Param_String": JSON.stringify([{Sub_Ledger_ID: col }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
     // console.log("data",data)
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.email,
          element['value'] = element.email
        });
        this.toEmailList = data;
        this.CCEmailList = data
        this.ToEmailSelect = '801kumarakshay@gmail.com'
      }
       else {
        this.toEmailList = [];
         this.CCEmailList = []
      }
     // console.log("toEmailList",this.toEmailList)
    })    
    }
    this.getSMS(col)  
  }
  ClickCheck() {
    if (this.EmailCheck === false) {
      this.ToEmailSelect  = undefined;
      this.CCEmailSelect = undefined;
      this.CompantEmailName = undefined;
    }
    if (this.SMSCheck === false) {
      this.SMSSelect = undefined;
    }
  }
  getCompanyMail() {
  this.CompanyEmailList =[]
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Get_Company_Email",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //console.log("dataEmail",data)
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Email_ID,
          element['value'] = element.Email_ID
        });
        this.CompanyEmailList = data;
      }
       else {
        this.CompanyEmailList = []; 
      }
    })    

        
  }
  deleteEmailId(valid: any) {
     this.EmailId = undefined
    if (valid.Email_ID) {
    this.EmailId = valid.Email_ID
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
  if(this.EmailId){
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request  ",
      "Report_Name_String": "Delete_Company_Email",
      "Json_Param_String": JSON.stringify([{Email_ID : this.EmailId}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if (data[0].Column1){
        this.onReject();
        this.getCompanyMail();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity:'success',
          summary: "Email ID:- " + this.EmailId,
          detail: "Succesfully Delete"
        });
      }
    })
  }
  }
  ViewCompEmail() {
      setTimeout(() => {
        this.ViewCompanyModal = true;
        }, 200);
  }
  CompCreatPopup() {
  this.NewEmailFormSubmitted = false;
  this.CompantEmailName = undefined;
   this.CreateEmailModal =true 
  }
  CreateEmailType(valid){
  this.NewEmailFormSubmitted = true;
  if(valid){
           const tempSave = {
            Email_ID : this.CompantEmailName,
          }
           const obj = {
             "SP_String": "sp_Bl_Txn_Purchase_Request",
             "Report_Name_String" : "Create_Company_Email",
             "Json_Param_String": JSON.stringify([tempSave])
           }
           this.GlobalAPI.postData(obj).subscribe((data:any)=>{
             if(data[0].Column1){
              this.compacctToast.clear();
              this.compacctToast.add({
               key: "compacct-toast",
               severity: "success",
               summary: "Email ID:- "+ this.CompantEmailName,
               detail: "Succesfully Created" 
              });
             this.getCompanyMail();
             this.NewEmailFormSubmitted = false;
             this.CompantEmailName = undefined;
             this.CreateEmailModal = false;        
             }       
           })        
        }

  }
  getSMS(SMS) {
    this.SMSList = []
    if (SMS) {
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Get_Subledger_Contact_No",
       "Json_Param_String": JSON.stringify([{Sub_Ledger_ID: SMS }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log("getSMS",data)
      if(data[0].Contact_Number !== '') {
        data.forEach(element => {
          element['label'] = element.Contact_Number,
          element['value'] = element.Contact_Number
        });
        this.SMSList = data;
      }
       else {
        this.SMSList = [];
      }
    })    
    }
      
  }
}
class vendorSelection{
  Purchase_Request_No:any
  Purchase_Request_Date:any
}