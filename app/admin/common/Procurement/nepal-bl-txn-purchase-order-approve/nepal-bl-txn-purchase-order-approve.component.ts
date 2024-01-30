import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import {DateNepalConvertService} from '../../../shared/compacct.global/dateNepal.service'
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: 'app-nepal-bl-txn-purchase-order-approve',
  templateUrl: './nepal-bl-txn-purchase-order-approve.component.html',
  styleUrls: ['./nepal-bl-txn-purchase-order-approve.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalBLTxnPurchaseOrderApproveComponent implements OnInit {
  items: any = [];
  tabIndexToView: number = 0;
  buttonname: string = "";
  PendingStartDate: any = {};
  PendingEndDate: any = {};
  PendingSearchlist: any[];
  ApproveStartDate: any = {};
  ApproveEndDate: any = {};
  ApproveSearchlist: any = [];
  DisapproveStartDate: any = {};
  DisapproveEndDate: any = {};
  DisapproveSearchlist: any = [];
  PendingSearchFormSubmit: boolean = false;
  ApproveSearchFormSubmit: boolean = false;
  DisapproveSearchFormSubmit: boolean = false;
  Spinner:boolean = false;
  userTypeID: any = undefined;
  DocNo: any = undefined;
  ApproverType: any = undefined;
  ApproverTypeTwo :any =undefined
  rowData:any = {}
  tableLoader:boolean = false
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["PENDING APPROVAL", "APPROVED", "DISAPPROVED"];
    this.Header.pushHeader({
      Header: "Purchase Order Approve",
      Link: " Procurement ->  Nepal BL Txn Purchase Order Approve"
    });
    this.PendingStartDate =this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.PendingEndDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.ApproveStartDate =this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.ApproveEndDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.DisapproveStartDate =this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.DisapproveEndDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.userTypeID = this.$CompacctAPI.CompacctCookies.User_ID
  }
 TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["PENDING APPROVAL", "APPROVED", "DISAPPROVED"];
    this.buttonname = "Save";
    this.clearData();
 }
 clearData() {
   this.ApproveSearchFormSubmit = false;
   this.PendingSearchFormSubmit = false;
   this.DisapproveSearchFormSubmit = false;
   this.PendingSearchlist = [];
   this.ApproveSearchlist = [];
   this.DisapproveSearchlist = [];
 }
onReject() {
  this.compacctToast.clear("c");  
 }
PendingSearch(valid) {
   this.PendingSearchFormSubmit = true
    if(valid){
      this.PendingSearchlist = []
      const tempobj = {
        Start_date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.PendingStartDate)),
         End_date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.PendingEndDate)),
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
      }
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
        "Report_Name_String": "Browse_Purchase_Order_for_Pending",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if(data.length){
          this.PendingSearchlist = data
           data.forEach((y:any) => {
          y.Doc_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(y.Doc_Date);
          });
       // console.log("PendingSearchlist",this.PendingSearchlist)
        }
      })
    }  
 }
ApproveSearch(valid) {
   this.ApproveSearchFormSubmit = true
    if(valid){
      this.ApproveSearchlist = []
      const tempobj = {
        Start_date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.ApproveStartDate)),
         End_date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.ApproveEndDate)),
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
      }
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
        "Report_Name_String": "Browse_Purchase_Order_for_Approve",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if(data.length){
          this.ApproveSearchlist = data
           data.forEach((y:any) => {
          y.Doc_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(y.Doc_Date);
          });
        //console.log("ApproveSearchlist",this.ApproveSearchlist)
        }
      })
    }  
 }
DisapproveSearch(valid) {
   this.DisapproveSearchFormSubmit = true
    if(valid){
      this.DisapproveSearchlist = []
      const tempobj = {
        Start_date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.DisapproveStartDate)),
         End_date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.DisapproveEndDate)),
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
      }
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
        "Report_Name_String": "Browse_Purchase_Order_for_Disapprove",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if(data.length){
          this.DisapproveSearchlist = data
           data.forEach((y:any) => {
          y.Doc_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(y.Doc_Date);
          });
       console.log("DisapproveSearchlist",this.DisapproveSearchlist)
        }
      })
    }  
 }
ApprovedOne(obj,typ) {
    if (obj.Doc_No) {
  this.DocNo = obj.Doc_No;
  this.ApproverType = typ
  this.rowData = typ == 'Two' ?  obj : {}
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
ApprovedPo(data:any) {
  this.ngxService.start();
    const tempobj = {
     Doc_No : this.DocNo,
     Approver  :this.ApproverType,
     Status : data
    }
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
      "Report_Name_String": "Update_Approve_Disapprove",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if (data[0].Column1){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: " PO No " + this.DocNo ,
          detail: "Succesfully Approved "
         });
         console.log("rowData",this.rowData)
         if(Object.keys(this.rowData).length){
          
          this.sendSms({...this.rowData})
          this.sendEmail({...this.rowData})
         }
         else {
           this.onReject();
          this.ngxService.stop();
          this.PendingSearch(true);
          this.DocNo = undefined ;
          this.rowData = {}
         }
       
       }
    })
 }
DisapprovedPo(data: any) {
    const tempobj = {
     Doc_No : this.DocNo,
     Approver  :this.ApproverType,
     Status : data
    }
  const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
      "Report_Name_String": "Update_Approve_Disapprove",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if (data[0].Column1){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: " PO No " + this.DocNo ,
          detail: "Succesfully Disapprove "
        });
        this.onReject();
        this.PendingSearch(true);
        this.DocNo = undefined ;
       }
    })
 }
PrintPending(Obj: any) {
    if (Obj.Doc_No) {
          window.open("/Report/Crystal_Files/Nepal/Purchase_Order_Nepal.aspx?Doc_No=" + Obj.Doc_No, 
          'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
          );
 } 
}
PrintAuthorized(obj:any) {
  if (obj.Doc_No) {
          window.open("/Report/Crystal_Files/Nepal/Purchase_Order_Nepal.aspx?Doc_No=" + obj.Doc_No, 
          'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
          );
 }    
}
PrintNotAuthorized(typ :any) {
 if (typ.Doc_No) {
          window.open("/Report/Crystal_Files/Nepal/Purchase_Order_Nepal.aspx?Doc_No=" + typ.Doc_No, 
          'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
          );
 }     
}
sendSms(col) {
  if (col.Doc_No) {
    this.ngxService.start();
    if (!col.Mobile_No) {
      this.ngxService.stop();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Failed to Send SMS",
        detail: "there are no phone number"
          });
      return
    }
      this.$http.get('Nepal_BL_Txn_Purchase_Order/Send_PO_Message?Mobile_No='+col.Mobile_No+'&Doc_No='+col.Doc_No)
        .subscribe(((data: any) => {
          this.ngxService.stop();
          console.log("sms data", data)
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "SMS SEND" ,
            detail: "SMS send Succesfully "
          });
          this.onReject();
          this.PendingSearch(true)
        }),(error:any)=>{
          this.ngxService.stop();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Something Wrong",
            detail: error,
          });
        } )
     
  
  }
  
}
  async sendEmail(col:any){
  if(col.Doc_No){
    this.ngxService.start();
    this.tableLoader = true
    if (!col.vendor_email) {
      this.ngxService.stop();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Failed to Send Email",
        detail: "there are no Email ID"
          });
      return
    }
     const fileData = await this.getFileDetalis(col.Doc_No).then(res=>{
      return res
     })
     console.log(fileData)
  
 const sendObj = {
    Vendor_Name: col.Sub_Ledger_Name,
    Doc_No: col.Doc_No,
    Doc_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(col.Doc_Date)),
    file_name: fileData.file_name,
    blob_name: fileData.containername,
    po_pdf_url: fileData.file_url,
    to_email: col.vendor_email,
    cc_details: [{cc_email:'sarvagya@abc.com'}],
    from_email:col.User_Email == '' ? 'procurement@sarawagigroup.com.np' : col.User_Email
}
  this.$http.post(`https://sgnepalemailaz.azurewebsites.net/api/Send_PO_Email?code=7XLxczCq_9fq2mFIrCC0-Dp3hsK0SB1_tGcerYvvfbrzAzFui0Jccw==`,JSON.stringify(sendObj) )
  .subscribe(((data:any)=>{
    if(data.status){
      this.tableLoader = false
      this.ngxService.stop();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Email",
        detail: data.message,
      });
     this.PendingSearch(true)
    }
 
  }),
  (error:any)=>{
    this.tableLoader = false
    this.ngxService.stop();
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Something Wrong",
      detail: error,
    });
  }
  );
  }
}
// getFileDetalis(doc:any){
//  return this.$http.get('http://iwpl.southeastasia.cloudapp.azure.com:1100/SG_Nepal_PO_PDF?DOC_No='+doc).toPromise()

// }
  async getFileDetalis(doc:any) {
  const response = await fetch('http://iwpl.southeastasia.cloudapp.azure.com:1100/SG_Nepal_PO_PDF?DOC_No='+doc, {
    method: "GET",
   });
  return response.json();
}
}
