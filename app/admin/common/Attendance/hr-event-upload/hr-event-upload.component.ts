import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { collectExternalReferences, THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service"
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-hr-event-upload',
  templateUrl: './hr-event-upload.component.html',
  styleUrls: ['./hr-event-upload.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HREventUploadComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  ShowSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  myDate = new Date();
  Event_Date = new Date();
  ObjHrEvent : HrEvent = new HrEvent()
  eventFormSubmitted = false;

  PDFViewFlag = false;
  PDFFlag = false;
  PDFFile:any = {};
  ProductPDFLink = undefined;

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private route : ActivatedRoute,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Event Upload",
      Link: " HR -> Transaction -> Event Upload"
    });
    // this.GetEmpData();
  }
  onReject() {
    //this.compacctToast.clear("c");
  }
  onConfirm(){}
  SaveEvent(valid){}
  FetchPDFFile(event){
    // this.PDFViewFlag = true;
    // this.PDFFile={};
    // if (event) {
    //  this.PDFViewFlag = false;
    //  this.PDFFile= event.files[0];
    // }
  }
  // FetchPDFFile(event) {
//   this.PDFViewFlag = true;
//   this.PDFFile={};
//   if (event) {
//     this.PDFViewFlag = false;
//     this.PDFFile= event.files[0];
//   }
// }
// async upload(){
 
//   console.log("file",this.PDFFile);
  
//   const formData: FormData = new FormData();
//   formData.append("pan", this.PDFFile);
//   const requestHeaders: HeadersInit = new Headers();
//   requestHeaders.set('x-functions-key', 'CdiqMVWYkfRuKLdqeVe3CSFYjHCzWM2A5/OVeIplauq5vnePb4voyA==');
//   let response = await fetch('https://urbanmoney.azurewebsites.net/api/PAN_Update?lead_id=1353&doc_type_id=1&doc_ID=BDBPA5086P',{ 
//    method: 'POST',
//    headers:  requestHeaders,
//    body: formData // This is your file object
//  });
//  let responseText = await response.text();
//  console.log("responseText",responseText);
 
//  }

}
class HrEvent {
  Description:any;
}