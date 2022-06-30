import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { FileUpload, MessageService } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { AnyARecord } from "dns";
import * as XLSX from 'xlsx'
@Component({
  selector: 'app-cc-saha-profund',
  templateUrl: './cc-saha-profund.component.html',
  styleUrls: ['./cc-saha-profund.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CCSahaProfundComponent implements OnInit {
 
  tabIndexToView : any = 0
  ObjBrowse : Browse = new Browse();
  seachSpinner: any= false
  initDate : any = [];
  Searchedlist : any = [];
  constructor(
    private Header : CompacctHeader,
    private router : Router,
    private route : ActivatedRoute,
    private $http : HttpClient,
    private GlobalAPI : CompacctGlobalApiService,
    private DateService : DateTimeConvertService,
    public $CompacctAPI : CompacctCommonApi,
    private compacctToast : MessageService
   
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header:  " Patent with Profound & sensorineural or perceptive " ,
      Link: " " 
    });
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    this.ObjBrowse.Start_Date = firstDay
    this.ObjBrowse.End_Date = lastDay
    this.initDate = [firstDay,lastDay]
    this.GetSearchedList()
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.Start_Date = dateRangeObj[0];
      this.ObjBrowse.End_Date = dateRangeObj[1];
    }
  }
  GetSearchedList(){
    this.Searchedlist = [];
    this.seachSpinner = true;
  const start = this.ObjBrowse.Start_Date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.Start_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.ObjBrowse.End_Date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.End_Date))
  : this.DateService.dateConvert(new Date());

  
  
const tempobj = {
  Start_Date : start,
  End_Date : end,
  

}
const obj = {
  "SP_String": "SP_Profound_For_Audiologist",
  "Report_Name_String": "Get_Profound_Date_Range",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
   
 })

}
redirectPatientDetails(obj) {
  if (obj) {
    window.open('/Hearing_CRM_Lead_Search?recordid=' + window.btoa(obj.Foot_Fall_ID));
  }
}

  PrintBill(obj){
    if (obj.Appo_ID) {
      window.open("Report/Crystal_Files/CRM/Clinic/Audiometry_Report_CC_Saha_P1.aspx?Appo_ID=" + obj.Appo_ID, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
  
      );
  }

}

PrintBill2(obj){
  if (obj.Appo_ID) {
    window.open("Report/Crystal_Files/CRM/Clinic/Audiometry_Report_CC_Saha_P2.aspx?Appo_ID=" + obj.Appo_ID, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
}

}
exportoexcel(fileName){
  if(this.Searchedlist.length){
    this.Searchedlist.forEach((ele:any) => {
      ele.Appo_Dt = new Date(ele.Appo_Dt)
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.Searchedlist);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
    
    

}
}

class Browse{
  Start_Date : any;
  End_Date  : any
}
