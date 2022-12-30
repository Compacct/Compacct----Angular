import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Console } from 'console';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { collectExternalReferences } from '@angular/compiler/src/output/output_ast';
import { map, catchError } from 'rxjs/operators';
declare var $:any;

@Component({
  selector: 'app-e-invoice-confirmation-form',
  templateUrl: './e-invoice-confirmation-form.component.html',
  styleUrls: ['./e-invoice-confirmation-form.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EInvoiceConfirmationFormComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save";

  initDate:any = [];
  peninvoiceSpinner = false;
  ObjPenInvoice : PenInvoice = new PenInvoice ();
  PenInvoicelist:any = [];
  FailedinvoiceSpinner = false;
  ObjFailedInvoice : FailednInvoice = new FailednInvoice ();
  FailedInvoicelist:any = [];
  ShowJSON:any;
  FailedInvDetailsModal = false;
  PenINVconfirmcheckbox = false;
  failedINVconfirmcheckbox = false;
  PenInvflag = true;
  FailedInvflag = true;

  pencrnoteSpinner = false;
  ObjPenCrNote : PenCrNote = new PenCrNote ();
  PenCrNotelist:any = [];
  failedcrnoteSpinner = false;
  ObjfailedCrNote : FailedCrNote = new FailedCrNote ();
  FailedCrNotelist:any = [];
  FailedCrDetailsModal = false;
  PenCRNoteconfirmcheckbox = false;
  FailedCRNoteconfirmcheckbox = false;
  PenCrflag = true;
  failedcrflag = true;

  constructor(
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    $(".content-header").removeClass("collapse-pos");
    $(".content").removeClass("collapse-pos");
    this.items = ["PENDING INVOICE", "FAILED INVOICE", "PENDING CREDIT NOTES", "FAILED CREDIT NOTES"];
    this.Header.pushHeader({
      Header: "E-Invoice Confirmation",
      Link: " E-Invoice Confirmation "
    });
    // this.getMaterialType();
  }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["PENDING INVOICE", "FAILED INVOICE", "PENDING CREDIT NOTES", "FAILED CREDIT NOTES"];
    this.buttonname = "Save";
    // this.productaddSubmit =[];
    // this.clearData();
  }
  onReject(){}
  onConfirm(){}
  PengetDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjPenInvoice.start_date = dateRangeObj[0];
      this.ObjPenInvoice.end_date = dateRangeObj[1];
    }
  }
  GetPenInvoicelist() {
    this.PenInvoicelist = [];
    this.peninvoiceSpinner = true;
    this.seachSpinner = true;
    this.PenInvflag = true;
    this.PenINVconfirmcheckbox = false;
    const start = this.ObjPenInvoice.start_date
    ? this.DateService.dateConvert(new Date(this.ObjPenInvoice.start_date))
    : this.DateService.dateConvert(new Date());
  const end = this.ObjPenInvoice.end_date
    ? this.DateService.dateConvert(new Date(this.ObjPenInvoice.end_date))
    : this.DateService.dateConvert(new Date());
    if(start && end){
  const tempobj = {
    From_Date : start,
    To_Date : end,
  }
  const obj = {
    "SP_String": "SP_E_Invoice_For_Confirmation_Form",
    "Report_Name_String": "Browse Pending Franchise Sale Challan And B2B Bill",
    "Json_Param_String": JSON.stringify([tempobj])
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.PenInvoicelist = data;
     //console.log('Invoice list=====',this.PenInvoicelist)
     this.peninvoiceSpinner = false;
     this.seachSpinner = false;
   })
   }
  }
  FailedgetDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjFailedInvoice.start_date = dateRangeObj[0];
      this.ObjFailedInvoice.end_date = dateRangeObj[1];
    }
  }
  GetFailedInvoicelist() {
    this.FailedInvoicelist = [];
    this.peninvoiceSpinner = true;
    this.seachSpinner = true;
    this.FailedInvflag = true;
    this.failedINVconfirmcheckbox = false;
    const start = this.ObjFailedInvoice.start_date
    ? this.DateService.dateConvert(new Date(this.ObjFailedInvoice.start_date))
    : this.DateService.dateConvert(new Date());
  const end = this.ObjFailedInvoice.end_date
    ? this.DateService.dateConvert(new Date(this.ObjFailedInvoice.end_date))
    : this.DateService.dateConvert(new Date());
    if(start && end){
  const tempobj = {
    From_Date : start,
    To_Date : end,
  }
  const obj = {
    "SP_String": "SP_E_Invoice_For_Confirmation_Form",
    "Report_Name_String": "Browse Failed Franchise Sale Challan And B2B Bill",
    "Json_Param_String": JSON.stringify([tempobj])
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.FailedInvoicelist = data;
     console.log('Failed Invoice list=====',this.FailedInvoicelist)
     this.peninvoiceSpinner = false;
     this.seachSpinner = false;
   })
   }
  }
  ViewInvPopup(col) {
    //console.log("col",col)
    this.ShowJSON = undefined;
    if(col.E_Invoice_Responce_JSON) {
    var data = JSON.parse(col.E_Invoice_Responce_JSON);
    console.log("msg===",data)
    this.ShowJSON = data.results.errorMessage;
    this.FailedInvDetailsModal = true;
    }
  }
  ViewInvoice(obj) {
    if (obj) {
      window.open("/Report/Crystal_Files/Finance/SaleBill/Sale_Bill_GST_K4C.aspx?DocNo=" + obj, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
  
      );
    }
  }
  CheckPenInvQueuelength() {
    var invquelength = this.PenInvoicelist.filter(el=> el.confirmation_Inv === true);
    if (invquelength.length <= 50) {
      this.CheckPenInvcheckbox();
      return false;
      }
      else {
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Can't Create More Than Fifty Queue."
            });
      }
  }
  CheckPenInvcheckbox() {
    var invquelength = this.PenInvoicelist.filter(el=> el.confirmation_Inv === true);
    if (invquelength.length) {
      this.PenInvflag = false;
      }
      else {
        this.PenInvflag = true;
        this.PenINVconfirmcheckbox = false;
      }
  }
  SavePenInvoice() {
    this.Spinner = false;
    this.ngxService.start();
  if(this.PenInvoicelist.length){
    let updateData:any = [];
    this.PenInvoicelist.forEach(el=>{
      console.log("confirmation_Inv ====",el.confirmation_Inv)
      if (el.confirmation_Inv === true) {
        const updateObj = {
          Doc_No : el.Doc_No
        }
        updateData.push(updateObj)
        console.log("updateData",updateData);
      }

    })
    if(updateData.length){
     if(updateData.length <= 50) {
     console.log("updateData",updateData);
     this.$http.post(`https://einvoicek4c.azurewebsites.net/api/Create_E_Invoice_Queue?code=vVB-eE8wZmI8idKsxBOPzJbZw3Lbp6h83qdMjyY7bVJfAzFusGDSRg==`,updateData)
     .subscribe((data:any)=>{
      console.log("data",data)

      if(data[0].status === "success"){
        this.GetPenInvoicelist();
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Invoice ",
          detail: data[0].msg
        });
        }
        else{
          this.Spinner = false;
          this.ngxService.stop();
          this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message",
                detail: "Something Wrong"
              });
        }
     })
     }
     else{
       this.Spinner = false;
       this.ngxService.stop();
       this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "error",
             summary: "Warn Message",
             detail: "Can't Create More Than Fifty Queue."
           });
      }
    }
    else{
      this.Spinner = false;
      this.ngxService.stop();
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Something Wrong"
          });
    }

  }
  else{
    this.Spinner = false;
    this.ngxService.stop();
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Something Wrong"
        });
  }
  }
  CheckFailedInvQueuelength() {
    var invquelength = this.FailedInvoicelist.filter(el=> el.confirmation_Inv === true);
    if (invquelength.length <= 50) {
      this.CheckFailedInvcheckbox();
      return false;
      }
      else {
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Can't Create More Than Fifty Queue."
            });
      }
  }
  CheckFailedInvcheckbox() {
    var invquelength = this.FailedInvoicelist.filter(el=> el.confirmation_Inv === true);
    if (invquelength.length) {
      this.FailedInvflag = false;
      }
      else {
        this.FailedInvflag = true;
        this.failedINVconfirmcheckbox = false;
      }
  }
  SaveFailedInvoice() {
    this.Spinner = false;
    this.ngxService.start();
  if(this.FailedInvoicelist.length){
    let updateData:any = [];
    this.FailedInvoicelist.forEach(el=>{
      console.log("confirmation_Inv ====",el.confirmation_Inv)
      if (el.confirmation_Inv === true) {
        const updateObj = {
          Doc_No : el.Doc_No
        }
        updateData.push(updateObj)
        console.log("updateData",updateData);
      }

    })
    if(updateData.length){
     if(updateData.length <= 50) {
     console.log("updateData",updateData);
     this.$http.post(`https://einvoicek4c.azurewebsites.net/api/Create_E_Invoice_Queue?code=vVB-eE8wZmI8idKsxBOPzJbZw3Lbp6h83qdMjyY7bVJfAzFusGDSRg==`,updateData)
     .subscribe((data:any)=>{
      console.log("data",data)

      if(data[0].status === "success"){
        this.GetFailedInvoicelist();
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Invoice ",
          detail: data[0].msg
        });
        }
        else{
          this.Spinner = false;
          this.ngxService.stop();
          this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message",
                detail: "Something Wrong"
              });
        }
     })
     }
     else{
       this.Spinner = false;
       this.ngxService.stop();
       this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "error",
             summary: "Warn Message",
             detail: "Can't Create More Than Fifty Queue."
           });
      }
    }
    else{
      this.Spinner = false;
      this.ngxService.stop();
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Something Wrong"
          });
    }

  }
  else{
    this.Spinner = false;
    this.ngxService.stop();
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Something Wrong"
        });
  }
  }

  // CREDIT NOTE
  getPenDateRangeCrNote(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjPenCrNote.start_date = dateRangeObj[0];
      this.ObjPenCrNote.end_date = dateRangeObj[1];
    }
  }
  GetPenCrNotelist() {
    this.PenCrNotelist = [];
    this.pencrnoteSpinner = true;
    this.seachSpinner = true;
    this.PenCrflag = true;
    this.PenCRNoteconfirmcheckbox = false;
    const start = this.ObjPenCrNote.start_date
    ? this.DateService.dateConvert(new Date(this.ObjPenCrNote.start_date))
    : this.DateService.dateConvert(new Date());
  const end = this.ObjPenCrNote.end_date
    ? this.DateService.dateConvert(new Date(this.ObjPenCrNote.end_date))
    : this.DateService.dateConvert(new Date());
    if(start && end){
  const tempobj = {
    From_Date : start,
    To_Date : end,
  }
  const obj = {
    "SP_String": "SP_E_Invoice_For_Confirmation_Form",
    "Report_Name_String": "Browse Pending Credit Note",
    "Json_Param_String": JSON.stringify([tempobj])
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.PenCrNotelist = data;
     //console.log('CrNote list=====',this.PenCrNotelist)
     this.pencrnoteSpinner = false;
     this.seachSpinner = false;
   })
   }
  }
  getFailedDateRangeCrNote(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjfailedCrNote.start_date = dateRangeObj[0];
      this.ObjfailedCrNote.end_date = dateRangeObj[1];
    }
  }
  GetFailedCrNotelist() {
    this.FailedCrNotelist = [];
    this.failedcrnoteSpinner = true;
    this.seachSpinner = true;
    this.failedcrflag = true;
    this.FailedCRNoteconfirmcheckbox = false;
    const start = this.ObjfailedCrNote.start_date
    ? this.DateService.dateConvert(new Date(this.ObjfailedCrNote.start_date))
    : this.DateService.dateConvert(new Date());
  const end = this.ObjfailedCrNote.end_date
    ? this.DateService.dateConvert(new Date(this.ObjfailedCrNote.end_date))
    : this.DateService.dateConvert(new Date());
    if(start && end){
  const tempobj = {
    From_Date : start,
    To_Date : end,
  }
  const obj = {
    "SP_String": "SP_E_Invoice_For_Confirmation_Form",
    "Report_Name_String": "Browse Failed Credit Note",
    "Json_Param_String": JSON.stringify([tempobj])
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.FailedCrNotelist = data;
     //console.log('FailedCrNote list=====',this.FailedCrNotelist)
     this.failedcrnoteSpinner = false;
     this.seachSpinner = false;
   })
   }
  }
  ViewCrPopup(col) {
    //console.log("col",col)
    this.ShowJSON = undefined;
    if(col.E_Invoice_Responce_JSON) {
    var data = JSON.parse(col.E_Invoice_Responce_JSON);
    console.log("msg===",data)
    this.ShowJSON = data.results.errorMessage;
    this.FailedCrDetailsModal = true;
    }
  }
  ViewCrNote(col) {
    if (col) {
      window.open("/Report/Crystal_Files/Finance/SaleBill/Credit_Note_K4C.aspx?DocNo=" + col, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
  
      );
    }
  }
  CheckPenNoteQueuelength() {
    var quelength = this.PenCrNotelist.filter(el=> el.confirmation_Credit_Note === true);
    if (quelength.length <= 50) {
      this.CheckPenNotecheckbox();
      return false;
      }
      else {
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Can't Create More Than Fifty Queue."
            });
      }
  }
  CheckPenNotecheckbox() {
    var invquelength = this.PenCrNotelist.filter(el=> el.confirmation_Credit_Note === true);
    if (invquelength.length) {
      this.PenCrflag = false;
      }
      else {
        this.PenCrflag = true;
        this.PenCRNoteconfirmcheckbox = false;
      }
  }
  SavePenCrNote() {
    this.Spinner = false;
    this.ngxService.start();
  if(this.PenCrNotelist.length) {
    let updateData:any = [];
    this.PenCrNotelist.forEach(el=>{
      console.log("confirmation_Credit_Note ====",el.confirmation_Credit_Note)
      if (el.confirmation_Credit_Note === true) {
        const updateObj = {
          Doc_No : el.Doc_No
        }
        updateData.push(updateObj)
        console.log("updateData",updateData);
      }

    })
  //}
    if(updateData.length) {
     if(updateData.length <= 50) {
     console.log("updateData",updateData);
      this.$http.post(`https://einvoicek4c.azurewebsites.net/api/Create_E_Credit_Note_Queue?code=jPsyuiZml49N-cUZvVdGXgDmdA53NDYae0VpVCEGm8yjAzFugsuusQ==`,updateData)
     .subscribe((data:any)=>{
      console.log("data",data)
        if(data[0].status === "success"){
        this.GetPenCrNotelist();
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Credit Note ",
          detail: data[0].msg
        });
        }
        else{
          this.Spinner = false;
          this.ngxService.stop();
          this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message",
                detail: "Something Wrong"
              });
        }
    })
    }
    else{
      this.Spinner = false;
      this.ngxService.stop();
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Can't Create More Than Fifty Queue."
          });
    }
  }
    else {
      this.Spinner = false;
      this.ngxService.stop();
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Something Wrong"
          });
    }
  }
  else{
    this.Spinner = false;
    this.ngxService.stop();
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Something Wrong"
        });
  }
  }
  CheckFailedNoteQueuelength() {
    var quelength = this.FailedCrNotelist.filter(el=> el.confirmation_Credit_Note === true);
    if (quelength.length <= 50) {
      this.CheckFailedNotecheckbox();
      return false;
      }
      else {
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Can't Create More Than Fifty Queue."
            });
      }
  }
  CheckFailedNotecheckbox() {
    var invquelength = this.FailedCrNotelist.filter(el=> el.confirmation_Credit_Note === true);
    if (invquelength.length) {
      this.failedcrflag = false;
      }
      else {
        this.failedcrflag = true;
        this.FailedCRNoteconfirmcheckbox = false;
      }
  }
  SaveFailedCrNote() {
    this.Spinner = false;
    this.ngxService.start();
  if(this.FailedCrNotelist.length) {
    let updateData:any = [];
    this.FailedCrNotelist.forEach(el=>{
      console.log("confirmation_Credit_Note ====",el.confirmation_Credit_Note)
      if (el.confirmation_Credit_Note === true) {
        const updateObj = {
          Doc_No : el.Doc_No
        }
        updateData.push(updateObj)
        console.log("updateData",updateData);
      }

    })
  //}
    if(updateData.length) {
     if(updateData.length <= 50) {
     console.log("updateData",updateData);
      this.$http.post(`https://einvoicek4c.azurewebsites.net/api/Create_E_Credit_Note_Queue?code=jPsyuiZml49N-cUZvVdGXgDmdA53NDYae0VpVCEGm8yjAzFugsuusQ==`,updateData)
     .subscribe((data:any)=>{
      console.log("data",data)
        if(data[0].status === "success"){
        this.GetFailedCrNotelist();
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Credit Note ",
          detail: data[0].msg
        });
        }
        else{
          this.Spinner = false;
          this.ngxService.stop();
          this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message",
                detail: "Something Wrong"
              });
        }
    })
    }
    else{
      this.Spinner = false;
      this.ngxService.stop();
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Can't Create More Than Fifty Queue."
          });
    }
  }
    else {
      this.Spinner = false;
      this.ngxService.stop();
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Something Wrong"
          });
    }
  }
  else{
    this.Spinner = false;
    this.ngxService.stop();
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Something Wrong"
        });
  }
  }

}
class PenInvoice {
  start_date : Date;
  end_date : Date;
}
class FailednInvoice {
  start_date : Date;
  end_date : Date;
}
class PenCrNote {
  start_date : Date;
  end_date : Date;
}
class FailedCrNote {
  start_date : Date;
  end_date : Date;
}
