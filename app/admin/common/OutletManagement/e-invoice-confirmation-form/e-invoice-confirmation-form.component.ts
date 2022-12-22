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
  invoiceSpinner = false;
  ObjInvoice : Invoice = new Invoice ();
  Invoicelist:any = [];

  crnoteSpinner = false;
  ObjCrNote : CrNote = new CrNote ();
  CrNotelist:any = [];

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
    this.items = ["INVOICE", "CREDIT NOTES"];
    this.Header.pushHeader({
      Header: "E-Invoice Confirmation",
      Link: " E-Invoice Confirmation "
    });
    // this.getMaterialType();
  }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["INVOICE", "CREDIT NOTES"];
    this.buttonname = "Save";
    // this.productaddSubmit =[];
    // this.clearData();
  }
  onReject(){}
  onConfirm(){}
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjInvoice.start_date = dateRangeObj[0];
      this.ObjInvoice.end_date = dateRangeObj[1];
    }
  }
  GetInvoicelist() {
    this.Invoicelist = [];
    this.invoiceSpinner = true;
    this.seachSpinner = true;
    const start = this.ObjInvoice.start_date
    ? this.DateService.dateConvert(new Date(this.ObjInvoice.start_date))
    : this.DateService.dateConvert(new Date());
  const end = this.ObjInvoice.end_date
    ? this.DateService.dateConvert(new Date(this.ObjInvoice.end_date))
    : this.DateService.dateConvert(new Date());
    if(start && end){
  const tempobj = {
    From_Date : start,
    To_Date : end,
  }
  const obj = {
    "SP_String": "SP_E_Invoice_For_Confirmation_Form",
    "Report_Name_String": "Browse Franchise Sale Challan And B2B Bill",
    "Json_Param_String": JSON.stringify([tempobj])
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Invoicelist = data;
     //console.log('Invoice list=====',this.Invoicelist)
     this.invoiceSpinner = false;
     this.seachSpinner = false;
   })
   }
  }
  ViewInvoice(obj) {
    if (obj.Doc_No) {
      window.open("/Report/Crystal_Files/Finance/SaleBill/Sale_Bill_GST_K4C.aspx?DocNo=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
  
      );
    }
  }
  SaveInvoice() {
    this.Spinner = false;
    this.ngxService.start();
  if(this.Invoicelist.length){
    let updateData:any = [];
    this.Invoicelist.forEach(el=>{
      console.log("confirmation_Inv ====",el.confirmation_Inv)
      if (el.confirmation_Inv === true) {
        const updateObj = {
          Doc_No : el.Doc_No
        }
        updateData.push(updateObj)
        console.log("updateData",updateData);
      }

    })
  //}
    if(updateData.length){
     console.log("updateData",updateData);
      const obj = {
        "SP_String": "SP_E_Invoice_For_Confirmation_Form",
        "Report_Name_String": "Update Franchise Bill And B2B Bill For E-Invoice",
        "Json_Param_String": JSON.stringify(updateData)
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Column1){
        this.GetInvoicelist();
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Invoice ",
          detail: "Update Succesfully"
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
  getDateRangeCrNote(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjCrNote.start_date = dateRangeObj[0];
      this.ObjCrNote.end_date = dateRangeObj[1];
    }
  }
  GetCrNotelist() {
    this.CrNotelist = [];
    this.crnoteSpinner = true;
    this.seachSpinner = true;
    const start = this.ObjCrNote.start_date
    ? this.DateService.dateConvert(new Date(this.ObjCrNote.start_date))
    : this.DateService.dateConvert(new Date());
  const end = this.ObjCrNote.end_date
    ? this.DateService.dateConvert(new Date(this.ObjCrNote.end_date))
    : this.DateService.dateConvert(new Date());
    if(start && end){
  const tempobj = {
    From_Date : start,
    To_Date : end,
  }
  const obj = {
    "SP_String": "SP_E_Invoice_For_Confirmation_Form",
    "Report_Name_String": "Browse Credit Note",
    "Json_Param_String": JSON.stringify([tempobj])
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.CrNotelist = data;
     //console.log('Invoice list=====',this.Invoicelist)
     this.crnoteSpinner = false;
     this.seachSpinner = false;
   })
   }
  }
  ViewCrNote(col) {
    if (col.Doc_No) {
      window.open("/Report/Crystal_Files/Finance/SaleBill/Credit_Note_K4C.aspx?DocNo=" + col.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
  
      );
    }
  }
  SaveCrNote() {
    this.Spinner = false;
    this.ngxService.start();
  if(this.CrNotelist.length){
    let updateData:any = [];
    this.CrNotelist.forEach(el=>{
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
    if(updateData.length){
     console.log("updateData",updateData);
      const obj = {
        "SP_String": "SP_E_Invoice_For_Confirmation_Form",
        "Report_Name_String": "Update Credit Note For E-Invoice",
        "Json_Param_String": JSON.stringify(updateData)
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Column1){
        this.GetCrNotelist();
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Credit Note ",
          detail: "Update Succesfully"
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
class Invoice {
  start_date : Date;
  end_date : Date;
}
class CrNote {
  start_date : Date;
  end_date : Date;
}