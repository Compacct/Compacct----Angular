import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-tuto-manual-payment-collection',
  templateUrl: './tuto-manual-payment-collection.component.html',
  styleUrls: ['./tuto-manual-payment-collection.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoManualPaymentCollectionComponent implements OnInit {
  seachSpinner = false;
  start_date :any;
  end_date : any;
  ManualPaymentList = [];
  SearchColList = [];
  
  PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink = undefined;
  ProductPDFFile:any = {};
  ManualPaymentConfirmModal = false;
  ManualPaymentConfirmFormSubmit = false;
  ManualPaymentTrnsDate = new Date();
  ObjManualPaymentCnfm = new ManualPaymentCnfm();

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    public $CompacctAPI: CompacctCommonApi,) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Manual Payment Collection",
      Link: " CRM -> Manual Payment Collection"
    });
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.start_date = dateRangeObj[0];
      this.end_date = dateRangeObj[1];
    }
  }
  GetManualPaymentList() {
    this.seachSpinner = true;
    this.ManualPaymentList = [];
    const start = this.start_date
          ? this.DateService.dateConvert(new Date(this.start_date))
          : this.DateService.dateConvert(new Date());
        const end = this.end_date
          ? this.DateService.dateConvert(new Date(this.end_date))
          : this.DateService.dateConvert(new Date());
    const tempObj ={
      Start_Date : start,
      End_Date : end
     }
     console.log("formData",tempObj);
     const obj = {
      "SP_String": "Tutopia_Subscription_Accounts_Manual_Payment",
      "Report_Name_String": "GET_Pending_Manual_Txn",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("SearchForm",data);
      this.ManualPaymentList = data.length ? data : [];
      this.SearchColList = data.length ? Object.keys(data[0]) : []
      this.seachSpinner = false;
     })
  }

  // MANUAL PAYMENT CONFIRM
  showManualPaymentModal(obj) {
    this.ObjManualPaymentCnfm = new ManualPaymentCnfm();
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    this. ManualPaymentTrnsDate = new Date();
    this.ManualPaymentConfirmFormSubmit = false;
    if(obj.Txn_ID) {
      this.ObjManualPaymentCnfm.Txn_ID = obj.Txn_ID;
      this.ObjManualPaymentCnfm.Contact_Name = obj.Contact_Name;
      this.ObjManualPaymentCnfm.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ManualPaymentConfirmModal = true;
    }
  }
  FetchPDFFile(event) {
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    if (event) {
      this.ProductPDFFile = event.files[0];
      this.PDFFlag = true;
    }
  }
  SaveManualPaymentConfirm(valid) {
    this.ManualPaymentConfirmFormSubmit = true;
    if (valid && this.ProductPDFFile['size']) {
      this.ObjManualPaymentCnfm.Transaction_Date = this.DateService.dateConvert(new Date(this.ManualPaymentTrnsDate));
      const obj = {
        "SP_String":"Tutopia_Subscription_Accounts_Manual_Payment",
        "Report_Name_String":"UPDATE_Manual_EMI_Payment",
        "Json_Param_String":JSON.stringify([this.ObjManualPaymentCnfm]),
        "Json_1_String": "NA",
        "Json_2_String":"NA",
        "Json_3_String":"NA",
        "Json_4_String":"NA"
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
        console.log(data[0])
          if (data[0].message) {
            this.upload(this.ObjManualPaymentCnfm.Txn_ID);
        }
        else {
            this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "error",
            detail: "Error Occured"
          });
        }
        });
    }
    if(!this.ProductPDFFile['size']) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Validation",
        detail: "No Docs Selected"
      });
    }
  }
  async upload(id){
    const formData: FormData = new FormData();
        formData.append("file", this.ProductPDFFile);
    let response = await fetch('https://tutopiafilestorage.azurewebsites.net/api/Manual_EMI_Upload?code=JNaHkOxlfbekK4abze7AphqQ03SKbtYaJAD3Gy/HGTbjoiATO3jClg==&ConTyp='+this.ProductPDFFile['type']+'&ext='+this.ProductPDFFile['name'].split('.').pop()+'&txnid='+id,{ 
                  method: 'POST',
                  body: formData // This is your file object
                });
    let responseText = await response.text();
    console.log(responseText)
    if(responseText === 'Success') {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: 'Txn ID : ' + this.ObjManualPaymentCnfm.Txn_ID,
        detail: "Payment Confirm Succesfully Saved."
      });
      this.ObjManualPaymentCnfm = new ManualPaymentCnfm();
      this.ManualPaymentConfirmFormSubmit = false;
      this.ManualPaymentConfirmModal = false;
      this.GetManualPaymentList();

    }
  };

  // EXPORT TO EXCEL
  exportexcel(Arr,fileName): void {
    const start = this.start_date ? this.DateService.dateConvert(new Date(this.start_date)) : this.DateService.dateConvert(new Date());
    const end = this.end_date ? this.DateService.dateConvert(new Date(this.end_date)) : this.DateService.dateConvert(new Date());
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+start+end+'.xlsx');
  }
  // pdf
  GetPDF(obj) {
    if (obj.Order_No) {
      if(obj.Order_No.startsWith("O")) {
        window.open("/Report/Crystal_Files/Tutopia/Receipt_Cum_Invoice.aspx?Order_No=" + obj.Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      }else {
        window.open("/Report/Crystal_Files/Finance/SaleBill/tutopia_final.aspx?Doc_No=" + obj.Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      }

    }
  }
}
class ManualPaymentCnfm {
  Txn_ID:String; 
  Contact_Name:String;
  Transaction_ID:String;
  Transaction_Date:String;
  Bank_Name:String;
  Bank_Branch_Name:String;
  User_ID:String;
}