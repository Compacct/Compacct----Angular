import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import * as XLSX from 'xlsx';
import { FileUpload } from 'primeng/fileupload';
@Component({
  selector: 'app-k4c-swiggy-zomato-file-upload',
  templateUrl: './k4c-swiggy-zomato-file-upload.component.html',
  styleUrls: ['./k4c-swiggy-zomato-file-upload.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cSwiggyZomatoFileUploadComponent implements OnInit {
  ChooseList:any = []
  seleteChoose:any = undefined
  tableDataList:any = []
  tableDataListHeader:any = []
  LeadListFromFile:any = [];
  tabIndexToView:any = 0
  loading:boolean = false
  Spinner:boolean = false
  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;
  constructor(
    private route : ActivatedRoute,
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "CSV UPLOAD",
      Link: "Outlet Management -> CSV UPLOAD"
    });
    this.ChooseList = [{value:'Swiggy',color:'#FC8019'},{value:'Zomato',color:'#cb202d'}]
  }
  
  changeChoode(){
    console.log(this.fileInput)
   
    this.fileInput? this.fileInput.clear():''
    this.tableDataList = [];
    this.tableDataListHeader = []
  }
  handleFileSelect(e:any){
    this.loading = true
  var reader : any = new FileReader();
       const ctrl = this;
      reader.onload = function(e:any){
       var fileData = reader.result;
          var wb = XLSX.read(fileData, {type : 'binary',raw: false,
          cellDates: true,});
           wb.SheetNames.forEach(function(sheetName){
            ctrl.LeadListFromFile =XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
           
            ctrl.getTableData(ctrl.LeadListFromFile)
          })
      };
      reader.readAsBinaryString(e.files[0]);
      
  }
 getTableData(allData:any){
  this.tableDataList = []
  this.tableDataListHeader = []
  if(this.seleteChoose === 'Swiggy'){
     if(allData[0].hasOwnProperty('Order ID') && allData[0].hasOwnProperty('Order-delivery-time') && allData[0].hasOwnProperty('Total-bill-amount <bill>')){
        this.tableDataList = [...allData]
        this.tableDataListHeader = Object.keys(this.tableDataList[0])
        this.tableDataList.forEach((ele:any) => {
          ele['Order-delivery-time'] = this.DateService.dateTimeConvert(new Date(ele['Order-delivery-time']))
        });
        console.log('tableDataList',this.tableDataList)
        this.loading = false
     }
     else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "error",
        summary: "failed to load CSV file ",
        detail: "The CSV File Was Not Properly Formatted"
        });
        this.loading = false
        this.fileInput.clear()
    }
  }
  if(this.seleteChoose === 'Zomato'){
    if(allData[0].hasOwnProperty('Order ID') && allData[0].hasOwnProperty('Order Placed At') && allData[0].hasOwnProperty('Bill Amount')){
       this.tableDataList = [...allData]
       this.tableDataListHeader = Object.keys(this.tableDataList[0])
       this.tableDataList.forEach((ele:any) => {
         ele['Order Placed At'] = this.DateService.dateTimeConvert(new Date(ele['Order Placed At']))
       });
       console.log('tableDataList',this.tableDataList)
       this.loading = false
    }
    else {
      this.fileInput.clear()
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "error",
        summary: "failed to load CSV file ",
        detail: "The CSV File Was Not Properly Formatted"
        });
        this.loading = false
    }
 }
 }
 onReject() {
  this.compacctToast.clear("c");
}
fileRemove(e:any){
console.log(e)
this.tableDataList = []
}
SaveFileData(){
  console.log("tableDataList",this.tableDataList)
}
}
