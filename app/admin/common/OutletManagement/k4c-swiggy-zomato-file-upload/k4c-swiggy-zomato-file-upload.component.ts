import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import * as XLSX from 'xlsx';

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
  LeadListFromFile:any = [];
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
    this.ChooseList = [{value:'Swiggy'},{value:'Zomato'}]
  }
  
  changeChoode(){

  }
  handleFileSelect(e:any){
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
  if(this.seleteChoose === 'Swiggy'){
     if(allData[0].hasOwnProperty('Order ID') && allData[0].hasOwnProperty('Order-delivery-time') && allData[0].hasOwnProperty('Total-bill-amount <bill>')){

     }
  }
 }
}
