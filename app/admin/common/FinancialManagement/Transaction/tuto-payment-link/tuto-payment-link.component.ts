import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctGlobalUrlService } from "../../../../shared/compacct.global/global.service.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";

@Component({
  selector: 'app-tuto-payment-link',
  templateUrl: './tuto-payment-link.component.html',
  styleUrls: ['./tuto-payment-link.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoPaymentLinkComponent implements OnInit {
  tabIndexToView = 0;
  mobile_number = undefined;
  seachSpinner = false;
  seachSpinner2 = false;
  numberSearchFormSubmitted = false;
  numberSearch2FormSubmitted = false;
  formvlid = false;
  CopiedFlag = false;
  short_url = undefined;
  contactList:any = {};
  Amount = undefined;
  uomFormSubmitted = false;
  Remarks = "";
  Foot_Fall_ID = undefined;
  paymentList = [];
  TotalAmount = 0;
  PGInvDetailsList = [];
  PGInvDetailsModalFlag = false;


  PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink = undefined;
  ProductPDFFile:any = {};
  ManualPaymentConfirmModal = false;
  ManualPaymentConfirmFormSubmit = false;
  ObjManualPaymentCnfm = new ManualPaymentCnfm();

  ObjEMIUpdate = new ManualPaymentCnfm();
  EMIUpdateFormSubmit = false;
  ManualEMIUpdateModal = false;
  ManualEMIUpdateTrnsDate:any = new Date();
  ManualPaymentTrnsDate:any = new Date();
  MinTansactionDate:any = new Date();
  MaxTansactionDate:any =  new Date();
  DisabledIfFromQuery = false;
  saveSpinner = false;
  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private router : Router,
    private compacctToast: MessageService,) { 
      this.route.queryParams.subscribe(params => {
        this.mobile_number = undefined;
        if(params['Mobile']) {
          this.mobile_number = window.atob(params['Mobile']);
          this.DisabledIfFromQuery = true;
          this.searchData(true);
          
        }
      })
    }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Generate Payment Link",
      Link: " Financial Management -> Transaction -> Generate Payment Link"
    });
  }
  onReject() { }
  onConfirm() { }
  searchData(valid) {
    this.contactList = {};
    this.TotalAmount = 0;
    console.log(valid)
    // console.log("mobile_number",this.mobile_number.toString().length)
    this.numberSearchFormSubmitted = true;
    console.log("red", this.formvlid)
    if (this.mobile_number.toString().length !== 10) {
      this.clear();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Invalid",
        detail: "Invalid Mobile Number"
      });
    }
    if (valid) {
      this.seachSpinner = true;
      this.Foot_Fall_ID = undefined;

      if (this.mobile_number.toString().length === 10) {
        const obj = {
          "SP_String": "Tutopia_Subscription_Accounts_PG_Request",
          "Report_Name_String": "Get_Student_Details_For_Payment",
          "Json_Param_String": JSON.stringify([{ Mobile: this.mobile_number }])
        }
        this.GlobalAPI.getData(obj).subscribe((data: any) => {
       data.forEach(el => {
            this.contactList = {
              Contact_Name : el.Contact_Name,
              City : el.City,
              Pin : el.Pin,
              Class_Name : el.Class_Name,
              Address : el.Address
            }
          });
          if(!data.length){
           this.clear();
          }
          else{
            this.Foot_Fall_ID = data[0].Foot_Fall_ID
            if(this.Foot_Fall_ID){
              this.GetTransactions(this.Foot_Fall_ID);
            }
          }
          this.seachSpinner = false;
           this.numberSearchFormSubmitted = false;
          console.log("this.contactList", this.contactList);
        })
      }

    }


  }
  GenerateLink(valid) {
    console.log(valid);
    this.short_url = undefined;
    this.numberSearch2FormSubmitted = true;
    if (valid) {
      if (this.Amount) {
        this.seachSpinner2 = true;
        const temp = {
          User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
          Amount: Number(this.Amount),
          Foot_Fall_ID: this.Foot_Fall_ID,
          Remarks: this.Remarks ? this.Remarks : "NA"
        }

        const obj = new HttpParams()
          .set("Foot_Fall_ID", this.Foot_Fall_ID)
          .set("Amount", this.Amount)
          .set("PG_Remarks", this.Remarks ? this.Remarks : "NA" )
          .set("User_ID", this.$CompacctAPI.CompacctCookies.User_ID );
        this.$http
          .get("/Create_Payment_Link/Tutopia_PG_DS_Get_Link_Tutopia", { params: obj })
          .subscribe((data: any) => {
            console.log("data", data);
            if(this.Foot_Fall_ID){
              this.GetTransactions(this.Foot_Fall_ID);
            }
            // var url = JSON.parse(data);
            this.short_url = data.short_url;
            this.numberSearch2FormSubmitted = false;
            this.seachSpinner2 = false;
            console.log("this.short_url", this.short_url);
          });
      }
    }


  }
  GetTransactions(Foot_Fall_ID){
    this.TotalAmount = 0;
     if(Foot_Fall_ID){
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts_PG_Request",
        "Report_Name_String": "Get_Student_Transactions",
        "Json_Param_String": JSON.stringify([{ Foot_Fall_ID: Foot_Fall_ID }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("Data From ApI",data);
        this.paymentList = data;
        this.paymentList.forEach(item =>{
          if(item.Current_Status === 'PAID') {
           this.TotalAmount = this.TotalAmount + item.Amount;
          }
        })
      })
     }
  }
  copyToClipboard(item) {
    this.CopiedFlag = false;
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.CopiedFlag = true;
  }
  clearData() {
    this.mobile_number = undefined;
    this.seachSpinner = false;
    this.seachSpinner2 = false;
    this.numberSearchFormSubmitted = false;
    this.numberSearch2FormSubmitted = false;
    this.CopiedFlag = false;
    this.short_url = undefined;
    this.contactList = {};
    this.paymentList = [];
    this.Amount = undefined;
    this.Remarks = "";
    this.Foot_Fall_ID = undefined;
    this.TotalAmount = 0;
  }
  clearData2() {
    this.CopiedFlag = false;
    this.short_url = undefined;
    this.Amount = undefined;
    this.Remarks = "";
  }
  clear(){
     this.numberSearchFormSubmitted = true;
     this.paymentList = [];
      this.seachSpinner = false;
      this.seachSpinner2 = false;
      this.numberSearch2FormSubmitted = false;
      this.CopiedFlag = false;
      this.short_url = undefined;
      this.Amount = undefined;
      this.Remarks = "";
      this.Foot_Fall_ID = undefined;
  }
  GetPGInvDetails(PG_Inv_ID){
    this.PGInvDetailsList = [];
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts_PG_Request",
      "Report_Name_String": "PG_Get_Link_Details",
      "Json_Param_String" : JSON.stringify([{'PG_Inv_ID' : PG_Inv_ID}])
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
         console.log(data);
         this.PGInvDetailsList = data;
         this.PGInvDetailsModalFlag = true;
    });
  }
  Billcreation() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        Mobile : window.btoa(this.mobile_number),
        From : 'Y',
      },
    };
    this.router.navigate(['./Tutopia_DS_Billing'], navigationExtras);
  }

  // MANUAL PAYMENT CONFIRM
  showManualPaymentModal() {
    this.ObjManualPaymentCnfm = new ManualPaymentCnfm();
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    this.ManualPaymentConfirmFormSubmit = false;
    this.ManualPaymentTrnsDate = new Date();
    this.MaxTansactionDate =  new Date();
    this.saveSpinner = false;
    if(this.Foot_Fall_ID) {
      this.ObjManualPaymentCnfm.Foot_Fall_ID = this.Foot_Fall_ID;
      this.ObjManualPaymentCnfm.Contact_Name = this.contactList.Contact_Name;
      this.ObjManualPaymentCnfm.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ObjManualPaymentCnfm.Amount = this.Amount ? this.Amount : undefined;
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
      this.saveSpinner = true;
      this.ObjManualPaymentCnfm.Txn_Date = this.DateService.dateConvert(new Date(this.ManualPaymentTrnsDate));
      const obj = {
        "SP_String":"Tutopia_Manual_Payment_SP",
        "Report_Name_String":"Manual_Payment_Update",
        "Json_Param_String":JSON.stringify([this.ObjManualPaymentCnfm]),
        "Json_1_String": "NA",
        "Json_2_String":"NA",
        "Json_3_String":"NA",
        "Json_4_String":"NA"
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
        console.log(data[0])
          if (data[0].Column1) {
            this.upload(data[0].Column1);
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
    let response = await fetch('https://tutopiafilestorage.azurewebsites.net/api/Manual_Payment_Update?code=NNuTlQBwbP5UMBVVX8eD6x8do/WNOEIbHdwZVwu/bSulcefirS3Siw==&ConTyp='+this.ProductPDFFile['type']+'&ext='+this.ProductPDFFile['name'].split('.').pop()+'&pgid='+id,{ 
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
        summary: 'Student ID : ' + this.ObjManualPaymentCnfm.Foot_Fall_ID,
        detail: "Payment Confirm Succesfully Saved."
      });
      this.ObjManualPaymentCnfm = new ManualPaymentCnfm();
      this.ManualPaymentConfirmFormSubmit = false;
      this.ManualPaymentConfirmModal = false;
      this.GetTransactions(this.Foot_Fall_ID);
      this.saveSpinner = false;

    }
  };
  OpenInNewTab(File_URL){
    window.open(File_URL,'_blank');
  }
   // MANUAL EMI UPDATE
   showEMIUpdateModal() {
    this.ObjEMIUpdate = new ManualPaymentCnfm();
    this.EMIUpdateFormSubmit = false;
    this.ManualEMIUpdateTrnsDate = new Date();
    this.saveSpinner = false;
    const todday = new Date();
    this.ManualEMIUpdateTrnsDate = todday.setMonth(todday.getMonth() + 1);
    if(this.Foot_Fall_ID) {
      this.ObjEMIUpdate.Foot_Fall_ID = this.Foot_Fall_ID;
      this.ObjEMIUpdate.Contact_Name = this.contactList.Contact_Name;
      this.ObjEMIUpdate.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ObjEMIUpdate.Amount = this.Amount ? this.Amount : undefined;
      this.ManualEMIUpdateModal = true;
    }
  }
  SaveManualEMIUpdate(valid) {
    this.EMIUpdateFormSubmit = true;
    if (valid) {          
      this.saveSpinner = true;
      this.ObjEMIUpdate.Txn_Date = this.DateService.dateConvert(new Date(this.ManualEMIUpdateTrnsDate));
      const obj = {
        "SP_String":"Tutopia_Manual_Payment_SP",
        "Report_Name_String":"Manual_Payment_Update_Manual_EMI",
        "Json_Param_String":JSON.stringify([this.ObjEMIUpdate]),
        "Json_1_String": "NA",
        "Json_2_String":"NA",
        "Json_3_String":"NA",
        "Json_4_String":"NA"
      }
      console.log(this.ObjEMIUpdate)
      this.GlobalAPI.postData(obj).subscribe((data) => {
        console.log(data[0])
          if (data[0].Column1) {  
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'Student ID : ' + this.ObjEMIUpdate.Foot_Fall_ID,
              detail: "EMI Update Succesfully Saved."
            });
            this.ObjEMIUpdate = new ManualPaymentCnfm();
            this.EMIUpdateFormSubmit = false;
            this.ManualEMIUpdateModal = false;
            this.GetTransactions(this.Foot_Fall_ID);          
            this.saveSpinner = false;
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
  }
}
class ManualPaymentCnfm {
  Foot_Fall_ID:string;	
  Contact_Name : string; 
  Amount:string;
  Bank_Txn_ID:string;
  Bank_Name:string; 
  Remarks :string;  
  User_ID:any;
  Txn_Date:string;
}