import { Component, OnInit, ViewChild, ViewEncapsulation , Input, Output , EventEmitter  } from '@angular/core';
import { CompacctCommonApi } from '../../compacct.services/common.api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/primeng';
import { DateTimeConvertService } from '../../compacct.global/dateTime.service';

import { environment } from './../../../../../environments/environment';


@Component({
  selector: 'app-compacct-document-vault',
  templateUrl: './compacct.document.vault.component.html',
  styleUrls: ['./compacct.document.vault.component.css']
})
export class CompacctDocumentVaultComponent implements OnInit {
 
  Spinner = false;

  DocumentFormSubmitted = false;
  DocumentList =[];
  tempDocumentArr = [];
  tempDocumentObj ={
    'file': {},
    'Remarks' :'',
    'Doc_Name' : ''
  }
  EditModeFlag:number;
  ObjDocument = new Document();
  title = 'web1';
  currentFile : File =null;
  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;
  FootFall = undefined;
  DocumentType = {};

  SubLedgerID = undefined;
  
  PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink = undefined;
  ProductPDFFile:any = {};
  @Input() set documentType(value:any) {
    console.log(value);
    this.DocumentType = undefined
    this.SubLedgerID = undefined
    this.objDocumentVault = {};
    if(value) {      
    this.DocumentType = 'SUB_LEDGER';
    this.SubLedgerID = value;
    this.objDocumentVault.Indv_Type = this.DocumentType;
    this.objDocumentVault.Indv_ID = this.SubLedgerID;
    this.GetDocumentTypeList(this.DocumentType);
    this.GetAllDocumentList();
    }

 }
 documentTypeVault = [];
 AllDocumentList =[];
 objDocumentVault:any = {};

 @Output() clear:EventEmitter<any> = new EventEmitter();
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {

  }

  GetDocumentTypeList(field) {
    this.documentTypeVault = [];
    if(field) {
      const type = {'Document_Type': field};
      this.$http
        .get("/Document_Vault/Get_Document_Type?Document_Type="+field)
        .subscribe((data: any) => {
          this.documentTypeVault = data ? JSON.parse(data) : [];
        });

    }
  }
  GetAllDocumentList() {
    this.AllDocumentList = [];
    if(this.DocumentType && this.SubLedgerID) {
      this.$http
        .get("/Document_Vault/Get_Document_All?Indv_Type="+this.DocumentType+'&Indv_ID='+this.SubLedgerID)
        .subscribe((data: any) => {
          this.AllDocumentList = data ? JSON.parse(data) : [];
        });

    }
  }
  getDocumentName(id) {
    const tempArr = this.documentTypeVault.filter(obj=> Number(obj.Document_Type_ID) === Number(id));
    return id && tempArr.length ? tempArr[0].Document_Type_Name : '-';
  }
// 

FetchPDFFile(event) {
  this.PDFFlag = false;
  this.ProductPDFFile = {};
  if (event) {
    this.ProductPDFFile = event.files[0];
    this.PDFFlag = true;
  }
}

SaveDocDetails(valid) {
  this.DocumentFormSubmitted = false;
  if (valid && this.ProductPDFFile['size']) {
    this.DocumentFormSubmitted = true;
    this.Spinner = true;
    const SendObj = {
      Document_Type_ID : this.objDocumentVault.Document_Type_ID,
      Indv_Type :  this.objDocumentVault.Indv_Type,
      Indv_ID : this.objDocumentVault.Indv_ID
    }
    this.$http
  .post("/Document_Vault/Insert_Document",SendObj)
  .subscribe((data: any) => {
    console.log(data)
    if (data.Document_Type_Txn_ID) {
      this.upload(data.Document_Type_Txn_ID);
      // this.compacctToast.clear();
      // this.compacctToast.add({
      //   key: "compacct-toast",
      //   severity: "success",
      //   summary: "Document ID : " +obj.Doc_ID ,
      //   detail: "Updated Successfully"
      // });
      // this.clearData();
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
    }
  });
  } else {
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "Document Name Required ! "
    });
  }
}
async upload(id){
  const formData: FormData = new FormData();
  formData.append("anint", id);
  formData.append("aFile", this.ProductPDFFile);
  let response = await fetch('/Document_Vault/Upload_PDF',{ 
                method: 'POST',
                body: formData // This is your file object
              });
  let responseoBJ = await response.json();
  console.log(responseoBJ)
  if(responseoBJ && responseoBJ.success) {
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "success",
      summary: 'Document ID : ' + id,
      detail: "Document Succesfully Saved."
    });
    this.Spinner = false;
    this.GetAllDocumentList();
    this.objDocumentVault.Indv_Type = this.DocumentType;
    this.objDocumentVault.Indv_ID = this.SubLedgerID;

  }
};
OpenInNewTab(File_URL){
  window.open(File_URL,'_blank');
}


  ClearOutput (){
    this.tempDocumentArr = [];
    this.tempDocumentObj ={
    'file': {},
    'Remarks' :'',
    'Doc_Name' : ''
  }
    this.clear.emit('clear');
  }
  // DELETE
  deleteDocumentVault(DocumentTypeTxnID) {
    if (DocumentTypeTxnID) {
      if (confirm("Are you sure to Delete?") == true) {
      this.$http
        .post("/Document_Vault/Delete", { Document_Type_Txn_ID: DocumentTypeTxnID })
        .subscribe((data: any) => {
          if (data.success === true) {
            this.GetAllDocumentList();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Document ID: " + DocumentTypeTxnID,
              detail: "Succesfully Deleted"
            });
          }
        });
      }
    }
  }

}
class Document {
  Doc_ID = 0;
  Foot_Fall_ID = 0;
  User_ID:string;
  Posted_On:string;
  Doc_Name:string;
  URL_Name ='';
  Remarks:string;
  DType:string;
}

