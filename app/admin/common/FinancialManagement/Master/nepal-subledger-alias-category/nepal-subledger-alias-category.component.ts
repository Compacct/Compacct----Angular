import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Observable } from 'rxjs';
import { FileUpload } from "primeng/primeng";
import * as XLSX from 'xlsx'
@Component({
  selector: 'app-nepal-subledger-alias-category',
  templateUrl: './nepal-subledger-alias-category.component.html',
  styleUrls: ['./nepal-subledger-alias-category.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalSubledgerAliasCategoryComponent implements OnInit {
  items:any = [];
  buttonname:any = 'Create'
  tabIndexToView:any = 0
  DownloadList:any = []
  catDownloadList:any = []
  excelFile:any = []
  excelFileFalg = false
  LeadListFromFile:any =[ ]
  Spinner:boolean = false
  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = 'Create';
    this.Header.pushHeader({
      Header: "Subledger Alias Category",
      Link: "Financial Management --> Master -> Subledger Alias Category"
    });
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){

  }
  getDownload(){
    this.Spinner = true
    const obj = {
      "SP_String": "SP_Sub_Ledger_Alias_Cat_IDS",
      "Report_Name_String": "Get_Sub_Ledger_Alias_Cat_IDS"
    }
    this.GlobalAPI.postData(obj).subscribe((data) => {
       this.DownloadList = data
       this.GetCategoryMaster()
     })
  }
  GetCategoryMaster(){
    const obj = {
      "SP_String": "SP_Sub_Ledger_Alias_Cat_IDS",
      "Report_Name_String": "Get_Sub_Ledger_Cat_ID"
    }
    this.GlobalAPI.postData(obj).subscribe((data) => {
       this.catDownloadList = data
        this.exportoexcel("Alias Category")
       
     })
  }

  exportoexcel(fileName){
    if(this.DownloadList.length && this.catDownloadList.length){
      let exportList =this.DownloadList
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportList);
      const worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.catDownloadList);
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Subledger Alias & Category');
          XLSX.utils.book_append_sheet(workbook, worksheet1, 'Subledger Category Master');
     // const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      XLSX.writeFile(workbook, fileName+'.xlsx');
      this.Spinner = false
      this.catDownloadList = []
      this.DownloadList = []
      exportList = []
    }
      
      
  
  }
  handleFileSelect(event){
    if (event) {
      console.log(event)
      this.excelFileFalg = true
      this.excelFile = event.files[0];
      var reader : any = new FileReader();
      console.log("reader",reader)
      const ctrl = this;
      reader.onload = function(e:any){
        //console.log(e)
          var fileData = reader.result;
          var wb = XLSX.read(fileData, {type : 'binary',raw: false,
          cellDates: true,});
          ctrl.LeadListFromFile =XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
         console.log(ctrl.LeadListFromFile);
      };
      reader.readAsBinaryString(event.files[0]);
    }
  }
  cleanPreView(){
   this.fileInput.clear()
   this.excelFileFalg = false
  }
  Uploadexcel(){
    console.log("Upload")
   if(this.LeadListFromFile.length){
    console.log(this.LeadListFromFile)
   this.ngxService.start();
    const obj = {
      "SP_String": "SP_Sub_Ledger_Alias_Cat_IDS",
      "Report_Name_String": "Update_Sub_Ledger_Alias_Cat_IDS",
      "Json_Param_String": JSON.stringify(this.LeadListFromFile)
    }
    this.GlobalAPI.postData(obj).subscribe((data) => {
       console.log("data",data)
       if(data[0].message == "Update done"){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          //summary: 'Subledger ID : ' + data[0].Column1,
          detail: "Update Done"
        });
        this.cleanPreView()
        this.ngxService.stop();
       }
       else {
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "error",
          detail: "Error Occured"
        });
       }
    })
   }
  }
}
