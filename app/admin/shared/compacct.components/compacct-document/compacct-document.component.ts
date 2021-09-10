import { Component, OnInit, ViewChild, ViewEncapsulation , Input, Output , EventEmitter  } from '@angular/core';
import { CompacctCommonApi } from '../../compacct.services/common.api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/primeng';
import { DateTimeConvertService } from '../../compacct.global/dateTime.service';

import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'app-compacct-document',
  templateUrl: './compacct-document.component.html',
  styleUrls: ['./compacct-document.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CompacctDocumentComponent implements OnInit {
  ProductPDFFile: any[] =[];
  PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink = undefined;
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
  @Input() set documentType(value:any) {
    console.log(value);
    this.DocumentType = value;
    this.FootFall = value.FootfalID;
    this.GetDocument(this.FootFall);

 }

 @Output() clear:EventEmitter<any> = new EventEmitter();
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {
  }








// File Upload
  FetchPDFFile(event) {
    this.PDFFlag = false;
    this.tempDocumentObj ={
      'file': {},
      'Remarks' :'',
      'Doc_Name' : ''
    }
    if (event.files.length) {
      for(let k=0;k < event.files.length;k++){
        this.tempDocumentObj ={
          'file': {},
          'Remarks' :'',
          'Doc_Name' : ''
          }
        this.ProductPDFFile.push(event.files[k]);
        this.tempDocumentObj.file = event.files[k];
        this.tempDocumentArr.push(this.tempDocumentObj);
        this.PDFFlag = true;
      }
    }
  }
  onClear(e,file){
    for(let k=0;k < this.ProductPDFFile.length;k++){
      if(this.ProductPDFFile[k].name === file.name){
        this.ProductPDFFile.splice(k,1);
        this.tempDocumentArr.splice(k,1);
        this.fileInput.remove(e,k);
      }
    }
  }
  DocumentUploader(fileData) {
  const endpoint = "/Master_Product_V2/Upload_Doc";
  const formData: FormData = new FormData();
  formData.append("aFile", fileData);
  this.$http.post(endpoint, formData).subscribe(data => {
    console.log(data);
  });
  }
  // GET DOCUMENT
  GetDocument(foofFall) {
    this.DocumentList = [];
    if(foofFall) {
      const type = this.DocumentType["name"] === "Document" ? 'Normal':'Awarding';
      const params = new HttpParams().set("Foot_Fall_ID", foofFall)
      .set("DType", type);
      this.$http
        .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Document_Json", { params })
        .subscribe((data: any) => {
          this.DocumentList = data ? JSON.parse(data) : [];
        });

    }
  }
  mergeData(k){
    this.ObjDocument.Doc_Name = undefined;
    this.ObjDocument.Remarks = undefined;
    this.ObjDocument.Foot_Fall_ID = this.FootFall;
    this.ObjDocument.DType= this.DocumentType["name"] === "Document" ? 'Normal':'Awarding';
    this.ObjDocument.User_ID = this.commonApi.CompacctCookies.User_ID;
    this.ObjDocument.Posted_On= this.DateService.dateConvert(new Date());
    this.ObjDocument.Doc_Name = this.tempDocumentArr[k].Doc_Name;
    this.ObjDocument.Remarks = this.tempDocumentArr[k].Remarks;
    return JSON.stringify([this.ObjDocument])
  }
  // SAVE
  async  SaveDocument(valid){
    this.DocumentFormSubmitted = true;
    if(valid && this.PDFFlag ) {
      this.Spinner = true;
      const endpoint = "/BL_CRM_Txn_Enq_Tender/Upload_Tender_Document";
      for(let k=0;k < this.ProductPDFFile.length;k++){
        const formData: FormData = new FormData();
      formData.append("anint",   this.FootFall );
      formData.append("aFile",   this.ProductPDFFile[k] );
      formData.append("Enq_Tender_String", this.mergeData(k));
      console.log(this.ProductPDFFile[k]);
        const mgs = await this.SaveDoc(k);
        console.log('Done' + k);
        const totalLength = this.ProductPDFFile.length -1;
        if(k ===totalLength) {
            this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Lead ID  :" + this.FootFall,
                detail: "Document uploaded successfully"
              });
              this.GetDocument(this.FootFall);
              this.Spinner = false;
              this.PDFFlag = false;
              this.ProductPDFFile = [];
              this.fileInput.clear();
              this.tempDocumentArr = [];
              this.tempDocumentObj ={
                'file': {},
                'Remarks' :'',
                'Doc_Name' : ''
              }
              this.DocumentFormSubmitted = false;
              this.ObjDocument = new Document();
            console.group("Compacct V2");
            console.log("%c  Document Sucess:", "color:green;");
            console.log(endpoint);
        }
      // this.$http.post(endpoint, formData).subscribe((data: any) => {
      //   if (data.success === true) {
      //     const totalLength = this.ProductPDFFile.length -1;
      //     if(k ===totalLength) {
      //         this.compacctToast.clear();
      //          this.compacctToast.add({
      //             key: "compacct-toast",
      //             severity: "success",
      //             summary: "Lead ID  :" + this.FootFall,
      //             detail: "Document uploaded successfully"
      //           });
      //           this.GetDocument(this.FootFall);
      //           this.Spinner = false;
      //           this.PDFFlag = false;
      //           this.ProductPDFFile = [];
      //           this.fileInput.clear();
      //           this.tempDocumentArr = [];
      //           this.tempDocumentObj ={
      //             'file': {},
      //             'Remarks' :'',
      //             'Doc_Name' : ''
      //           }
      //           this.DocumentFormSubmitted = false;
      //           this.ObjDocument = new Document();
      //         console.group("Compacct V2");
      //         console.log("%c  Document Sucess:", "color:green;");
      //         console.log(endpoint);
      //     }

      //   } else {
      //     this.compacctToast.clear();
      //     this.compacctToast.add({
      //       key: "compacct-toast",
      //       severity: "error",
      //       summary: "Warn Message",
      //       detail: "Error Occured "
      //     });
      //   }
      // });
      }

    } else {
      if(!this.PDFFlag ){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "No File Found, Please Choose a File "
        });
      }
    }
  }
  Update(obj,i) {
    if (obj.Doc_Name) {
      const SendObj = {
        'Doc_ID': obj.Doc_ID ,
        'Doc_Name': obj.Doc_Name,
        'Remarks' : obj.Remarks
      }
      this.$http
    .post("/BL_CRM_Txn_Enq_Tender/Update_Document_Name_Remarks",SendObj)
    .subscribe((data: any) => {
      if (data.success === true) {
        this.EditModeFlag=  undefined;
        this.GetDocument(this.FootFall);
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Document ID : " +obj.Doc_ID ,
          detail: "Updated Successfully"
        });
         // this.clearData();
        console.group("Compacct V2");
        console.log("%c  Document Edit Sucess:", "color:green;");
        console.log("/BL_CRM_Txn_Enq_Task/Update_Document_Name_Remarks");
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
  SendEmail(){
    if (this.FootFall ) {
      const obj = {
        'Foot_Fall_ID' : this.FootFall
      }
      this.$http
    .post("/BL_CRM_Txn_Enq_Tender/Email_Tender", obj)
    .subscribe((data: any) => {
      if (data.success === true) {
        console.log('Email Send');
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Succesfully Email Sent"
        });
        this.ClearOutput();
      }
    });
    }

  }

  async SaveDoc (ind) {
    const obj ={"Enq_Tender_String": this.mergeData(ind) }
    const data = await this.$http.post('/BL_CRM_Txn_Enq_Tender/Insert_BL_CRM_Txn_Enq_Tender_Document',obj).toPromise();
    console.log(data['Doc_Id']);
     const UploadDoc = await this.UploadDoc(ind , data['Doc_Id']);
     console.log(UploadDoc[0].ImageURL);
     const UpdateDocObj = {
      'Doc_Id' :  data['Doc_Id'],
      'File_URL' : UploadDoc[0].ImageURL
    }
    const UpdatedDOC = await this.$http.post('/BL_CRM_Txn_Enq_Tender/Update_Document_URL',UpdateDocObj).toPromise();
    console.log(UpdatedDOC['success'])
  }
  UploadDoc(ind,docId) {
    const formData: FormData = new FormData();
    formData.append("file",this.ProductPDFFile[ind]);
    const ConTyp = this.ProductPDFFile[ind].type;
    const ext =  this.ProductPDFFile[ind].name.slice((this.ProductPDFFile[ind].name.lastIndexOf(".") - 1 >>> 0) + 2);
    const endpoint = "https://onlineexamstudent.azurewebsites.net/api/Upload_Tender_Document?code=26GEc0CZNCQAr5vipV99JYVq61m76KzvL2uepn22liB4k9Ys5re9jg==&BlCont=ocpl&ConTyp="+ConTyp+"&FootFall="+this.FootFall+"&DId="+docId+"&ext="+ext;
    return  this.$http.post(endpoint, formData).toPromise()
  }

  Edit (obj , index) {
    this.EditModeFlag = index;
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
  Detete(obj) {
    if (obj.Doc_ID) {
      this.$http
        .post("/BL_CRM_Txn_Enq_Tender/Delete_Document", { Doc_ID: obj.Doc_ID })
        .subscribe((data: any) => {
          if (data.success === true) {
            this.GetDocument(this.FootFall);
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Document ID: " + obj.Doc_ID,
              detail: "Succesfully Deleted"
            });
          }
        });
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
