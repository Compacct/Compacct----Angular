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
import {cloneDeep} from 'lodash';
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
  console.log("allData",allData)
  if(this.seleteChoose === 'Swiggy'){
    
        this.tableDataList =cloneDeep(allData);
        this.tableDataListHeader = Object.keys(this.tableDataList[0])
        if(this.tableDataList[0][this.tableDataListHeader[1]] instanceof Date 
          && !isNaN(this.tableDataList[0][this.tableDataListHeader[1]])
          && this.tableDataListHeader.length === 3
          && typeof this.tableDataList[0][this.tableDataListHeader[2]] == 'number' ){

            this.tableDataList.forEach((ele:any) => {
              const date = new Date(new Date(ele[this.tableDataListHeader[1]]).getTime() + 10 * 60000);
              ele[this.tableDataListHeader[1]] = this.DateService.dateConvert(new Date(date))
            });
            console.log('tableDataList',this.tableDataList)
            this.loading = false
          }
     
     
     else {
      this.tableDataList = []
      this.tableDataListHeader = []
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
     this.tableDataList = cloneDeep(allData);
       this.tableDataListHeader = Object.keys(this.tableDataList[0])
       if(this.tableDataList[0][this.tableDataListHeader[1]] instanceof Date 
        && !isNaN(this.tableDataList[0][this.tableDataListHeader[1]])
        && this.tableDataListHeader.length === 3
        && typeof this.tableDataList[0][this.tableDataListHeader[2]] == 'number' ){
        this.tableDataList.forEach((ele:any) => {
       
             ele[this.tableDataListHeader[1]] = this.DateService.dateConvert(new Date(ele[this.tableDataListHeader[1]]))
         
         });
         console.log('tableDataList',this.tableDataList)
         this.loading = false
       }
      else {
      this.tableDataList = []
      this.tableDataListHeader = []
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
  if(this.tableDataList.length){
    this.Spinner = true
    let saveData:any = []
    this.tableDataList.forEach(ele => {
      saveData.push(
        {
          Customer : this.seleteChoose === 'Zomato' ? 'ZOMATO' : this.seleteChoose === 'Swiggy' ? 'SWIGGY' : "" ,
          col1 :ele[this.tableDataListHeader[0]],
          col2 : ele[this.tableDataListHeader[1]],
          col3 : ele[this.tableDataListHeader[2]]
        }
        )
    });
    const obj = {
      "SP_String": "SP_Add_ON",
      "Report_Name_String": "Swiggy_Zomato_Upload",
      "Json_Param_String" :  JSON.stringify(saveData)
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Spinner = false
      if (data[0].Column1 === "done") {
      this.tableDataList = []
      this.tableDataListHeader = []
      this.fileInput.clear()
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          detail: "Succesfully Uploaded" ,
        });
      }
      else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Somthing Wrong....",
          detail: "Try again later"
        });
      }
     })
  }
  else {
    this.Spinner = false
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "error",
      summary: "Error",
      detail: "No Data Found"
      });
  }
}
}
