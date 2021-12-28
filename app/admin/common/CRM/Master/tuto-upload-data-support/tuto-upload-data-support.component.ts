import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tuto-upload-data-support',
  templateUrl: './tuto-upload-data-support.component.html',
  styleUrls: ['./tuto-upload-data-support.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoUploadDataSupportComponent implements OnInit {

  PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink = undefined;
  ProductPDFFile:any = {};
  seachSpinnersave = false;

  LeadListRerturned = [];
  LeadListFromFile = [];
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Upload Data Support",
      Link: " CRM -> Upload Data Support"
    });
  }
  // CSV
  handleFileSelect(event) {
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    this.LeadListRerturned = [];
    this.LeadListFromFile = [];
    if (event) {
      console.log(event)
      this.ProductPDFFile = event.files[0];
      this.PDFFlag = true;
      var reader : any = new FileReader();
      console.log(reader)
      const ctrl = this;
      reader.onload = function(e){
        console.log(e)
          var fileData = reader.result;
          var wb = XLSX.read(fileData, {type : 'binary' , cellDates: true, dateNF: 'mm/dd/yyyy;@'});

          wb.SheetNames.forEach(function(sheetName){
            ctrl.LeadListFromFile =XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
            console.log(ctrl.LeadListFromFile);
          })
      };
      reader.readAsBinaryString(event.files[0]);
  }
}
  SaveLeadJSON() {
    this.LeadListRerturned = [];
    if(this.ProductPDFFile['size']) {
       this.seachSpinnersave = true;
       this.LeadListFromFile.forEach(el=>{
         el.Call_Date_Time = this.DateService.dateConvert(new Date(el.Call_Date_Time));
       })
      const obj = {
        "SP_String": "Tutopia_Support_Follouwp_SP",
        "Report_Name_String": "Insert_Support_Followup_CSV",
        "Json_Param_String":JSON.stringify(this.LeadListFromFile),
        "Json_1_String": "NA",
        "Json_2_String":"NA",
        "Json_3_String":"NA",
        "Json_4_String":"NA"
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
        console.log(data);
        this.seachSpinnersave = false;
        if(data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'Upload',
            detail: "Succesfully Uploaded."
          });
          this.LeadListRerturned = [...this.LeadListFromFile];
        }else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Validation",
            detail: "Check Column Name and Date Formats."
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
}
