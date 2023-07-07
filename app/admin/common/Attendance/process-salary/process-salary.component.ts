import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';
import { format } from 'url';
declare var $: any;
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

@Component({
  selector: 'app-process-salary',
  templateUrl: './process-salary.component.html',
  styleUrls: ['./process-salary.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ProcessSalaryComponent implements OnInit {
  currentdate = new Date();
  Doc_date : any;
  display = false;
  Spinner = false;
  Month_Name : any;
  startdate = undefined;
  AllAttendanceData = [];

  DynamicHeader:any = [];
  cols:any =[]
  BrowseList = [];

  Final = false;
  NotFinal = false;
  CheckFinalizedOrNot: any;
  empid: any;

  processSalarydisabled = false;
  bankregdisabled = false;
  currentmonth: any;

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
      Header: "Process Salary",
      Link: " HR -> Transaction -> Process Salary"
    });
    // this.getAttendanceType();
    const d = new Date();
    let month = d.getMonth() + 1;
    console.log('month',month)
    let year = d.getFullYear();
    this.Month_Name = month < 10 ? year+'-'+0+month : year+'-'+month
    //this.startdate = this.Month_Name+'-'+'01'
    console.log('Month_Name',this.Month_Name)
   // this.Month_Name = new Date();
    this.GetEmpId();
    this.GetBrowseData();
  }
  GetBrowseData(){
    this.BrowseList = [];
    var firstDate = this.Month_Name+'-'+'01'
    console.log('firstDate',firstDate)
    const AtObj = {
      StartDate : this.DateService.dateConvert(new Date(firstDate)),
    }
    if (this.Month_Name) {
    const obj = {
      "SP_String": "SP_Process_Monthly_Attendance_Sheet",
      "Report_Name_String": "Browse Salary Process",
      "Json_Param_String": JSON.stringify([AtObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Data From Api",data);
      if (this.$CompacctAPI.CompacctCookies.User_Type === 'U') {
        this.BrowseList = [];
      } 
      else {
      this.BrowseList = data;
      }
      if(this.BrowseList.length){
        this.DynamicHeader = Object.keys(data[0]);
         this.DynamicHeader.forEach((el:any)=>{
          this.cols.push({
           header: el 
          })
        })
      }
      else {
        this.DynamicHeader = [];
      }
      console.log('this.BrowseList',this.BrowseList)
      this.CheckBackRegister();
  })
  this.getcurrentmonth();
  }
  }
  getcurrentmonth(){
    var firstDate = this.Month_Name+'-'+'01'
    const currentdate = new Date(firstDate);
    const month = currentdate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];

    this.currentmonth = monthNames[month];
    console.log('monthNames====',this.currentmonth);
  }
  Print(DocNo) {
    if(DocNo) {
      var empidd = DocNo.EMP_ID;
      var sldate = this.DateService.dateConvert(new Date(DocNo.Salary_Month));
    const objtemp = {
      "SP_String": "SP_Leave_Application",
      "Report_Name_String": "Print_Salary_Slip"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Emp_ID=" + empidd + "&SLDate=" + sldate, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
  }
  GetEmpId(){
    this.empid = undefined;
    const useridobj = {
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
    }
    const objtemp = {
      "SP_String": "SP_Process_Monthly_Attendance_Sheet",
      "Report_Name_String": "Get_Employee_ID",
      "Json_Param_String": JSON.stringify([useridobj])
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      this.empid = data ? data[0].Emp_ID : undefined;
    })
  }
  SalarySlip(){
    if(this.empid) {
      if (this.CheckFinalizedOrNot === "Finalized") {
      var empidd = this.empid;
      var firstDate = this.Month_Name+'-'+'01';
      var sldate = this.DateService.dateConvert(new Date(firstDate));
    const objtemp = {
      "SP_String": "SP_Leave_Application",
      "Report_Name_String": "Print_Salary_Slip"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Emp_ID=" + empidd + "&SLDate=" + sldate, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
    else {
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: this.CheckFinalizedOrNot
        });
    }
    }
  }
  UpdateSPBrowseData(){
    this.BrowseList = [];
    var firstDate = this.Month_Name+'-'+'01'
    console.log('firstDate',firstDate)
    const AtObj = {
      StartDate : this.DateService.dateConvert(new Date(firstDate)),
    }
    if (this.Month_Name) {
    const obj = {
      "SP_String": "SP_Process_Monthly_Attendance_Sheet",
      "Report_Name_String": "Update Salary Process",
      "Json_Param_String": JSON.stringify([AtObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Data From Api",data);
      this.BrowseList = data;
      if (data[0].Column1 != "Already Finalized, Can not Process again") {
      if(this.BrowseList.length){
        this.DynamicHeader = Object.keys(data[0]);
         this.DynamicHeader.forEach((el:any)=>{
          this.cols.push({
           header: el 
          })
        })
        this.GetBrowseData();
        this.UpdateProcessSalaryforLoan();
      }
      else {
        this.DynamicHeader = [];
        this.GetBrowseData();
      }
      console.log('this.BrowseList',this.BrowseList)
      }
      else {
        var msg = data[0].Column1;
        this.Final = false;
        this.NotFinal = true;
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "c",
         sticky: true,
         closable:false,
         severity: "warn",
         summary: msg,
        //  detail: "Confirm to proceed"
       });
        this.GetBrowseData();
      }
  })
  }
  }
  UpdateProcessSalaryforLoan(){
    var firstDate = this.Month_Name+'-'+'01'
    const obj = {
      "SP_String": "SP_Process_Monthly_Attendance_Sheet",
      "Report_Name_String": "Update Salary Process For Loan",
      "Json_Param_String": JSON.stringify([{StartDate : this.DateService.dateConvert(new Date(firstDate))}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data[0].Column1 === "Done"){
        return true;
      } else{
        return false;
      }
    })
  }

  // exportoexcel(Arr,fileName): void {
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
  //   const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  //   XLSX.writeFile(workbook, fileName+'.xlsx');
  // }
  exportoexcel(fileName){
    var firstDate = this.Month_Name+'-'+'01'
    const obj = {
      "SP_String": "SP_Process_Monthly_Attendance_Sheet",
      "Report_Name_String": "Browse Salary Register",
      "Json_Param_String": JSON.stringify([{StartDate : this.DateService.dateConvert(new Date(firstDate))}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      // const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      // XLSX.writeFile(workbook, fileName+'.xlsx');
      this.converttoPDFsalaryregister(data);
      
    })
  }
  converttoPDFsalaryregister(itemNew) {
    //var style:any ='landscape'; //'l', 'mm', [297, 297]
    var currentmonth = this.currentmonth;
    var doc:any = new jsPDF('l', 'mm', 'legal');
    var rows:any = [];

/* The following array of object as response from the API req  */
    var column = itemNew.length ? Object.keys(itemNew[0]): []

itemNew.forEach(element => {
    // var temp = [element.id,element.name,element.id1,element.name1,element.id2,element.name2,element.id3,element.name3,element.id4,element.name4];
    rows.push(Object.values(element))

});

    var imgData;
    imgData = "../../../../Content/dist/img/Kashvi.jpeg"
  
    doc.autoTable({
      //startY:50,
      theme: "grid",
      head:[column],
      body:rows,
      headStyles :{fillColor : [255, 255, 255],lineWidth: 0.1,lineColor:[0,0,0],textColor:[0, 0, 0],fontSize: 6},
      bodyStyles: {lineWidth: 0.1,lineColor:[0,0,0],textColor:[0, 0, 0],fontSize: 6,fontStyle: 'bold'},
      //columnStyles: {2: {halign: 'right'}, 3: {halign: 'right'}},
      // styles: { cellWidth: "wrap" },
      // columnStyles: {
      //   0: {cellWidth: 5},
      //   1: {cellWidth: 8},
      //   2: {cellWidth: 15},
      //   3: {cellWidth: 15},
      //   4: {cellWidth: 5},
      //   5: {cellWidth: 5},
      //   6: {cellWidth: 5},
      //   7: {cellWidth: 7},
      //   8: {cellWidth: 7},
      //   9: {cellWidth: 7},
      //   10: {cellWidth: 5},
      //   11: {cellWidth: 5},
      //   12: {cellWidth: 7},
      //   13: {cellWidth: 7},
      //   14: {cellWidth: 7},
      //   15: {cellWidth: 7},
      //   16: {cellWidth: 5},
      //   17: {cellWidth: 5},
      //   18: {cellWidth: 5},
      //   19: {cellWidth: 7},
      //   20: {cellWidth: 5},
      //   21: {cellWidth: 7},
      //   22: {cellWidth: 5},
      //   23: {cellWidth: 7},
      //   24: {cellWidth: 8},
      //   // etc
      // },
      
      didDrawPage: function (data) {
        // Header
        // doc.setFontSize(20);
        // doc.setTextColor(40);
        // doc.setFontStyle('normal');
        var width = doc.internal.pageSize.getWidth();
        // console.log('width---',width)
        // var height = doc.internal.pageSize.getHeight();
        // console.log('height---',height)
        if (imgData) {   
            doc.addImage(imgData, 'JPEG', data.settings.margin.left,10,35,20);  // for add image
        }
        doc.text('MODERN INDIA CON-CAST LIMITED', width/2, 17, { align: 'center' },{fontSize: 12})
        doc.setFontSize(10);
        doc.text('(A unit of Kasvi Group)', width/2, 22, { align: 'center' },{fontSize: 3})
        doc.text('Bhuniaraichak, J.L No-122, Haldia-721635, Purba Medinipur, West Bengal', width/2, 27, { align: 'center' },{fontSize: 0.4})
        doc.text('Salary for The Month of ' + currentmonth, width/2, 32, { align: 'center' },{styles: { fontSize: 3 }})
        
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text("Prepared By", data.settings.margin.left, pageHeight - 10);
        doc.text('Checked By', width/2, pageHeight - 10, { align: 'center' })
        doc.text("Authorised By", width - 10, pageHeight - 10, { align: 'right' });
      },
      margin: {top: 40, right: 6, bottom: 30, left: 6}
    });
    doc.save('Salary-Statement.pdf');
  }
  Finalized(){
    var firstDate = this.Month_Name+'-'+'01'
    var StartDate:any = new Date(firstDate)
    var Year = new Date(StartDate).getFullYear();
    let longMonth = StartDate.toLocaleString('en-us', { month: 'long' }); /* June */
    if (this.Month_Name) {
      this.Final = true;
      this.NotFinal = false;
       this.compacctToast.clear();
       this.compacctToast.add({
         key: "c",
         sticky: true,
         severity: "warn",
         summary: "Finalised Salary will restrict further modification for the Month of "+longMonth+" "+Year,
         detail: "Confirm to proceed"
       });
    }
  }
  onConfirm(){
    var firstDate = this.Month_Name+'-'+'01'
    console.log('firstDate',firstDate)
    const obj = {
      "SP_String" : "SP_Process_Monthly_Attendance_Sheet",
      "Report_Name_String" : "Finalized Process Salary",
      "Json_Param_String": JSON.stringify([{StartDate : this.DateService.dateConvert(new Date(firstDate))}])

    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      //console.log(data);
      var tempID = data[0].Column1;
      console.log("After Save",tempID);
     // this.Objproduction.Doc_No = data[0].Column1;
      if(data[0].Column1){
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         detail: "Succesfully Finalized."
       });
       this.GetBrowseData();
      } else{
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
    })
  }
  onReject(){
    this.compacctToast.clear("c");
  }
  CheckBackRegister(){
    var firstDate = this.Month_Name+'-'+'01'
    const obj = {
      "SP_String": "SP_Process_Monthly_Attendance_Sheet",
      "Report_Name_String": "Check Finalized Or Not",
      "Json_Param_String": JSON.stringify([{StartDate : this.DateService.dateConvert(new Date(firstDate))}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.CheckFinalizedOrNot = data ? data[0].Column1 : undefined;
      this.processSalarydisabled = this.CheckFinalizedOrNot === "Finalized" ? true : false;
      this.bankregdisabled = this.CheckFinalizedOrNot === "Finalized" ? false : true;
    })
  }
  exportoexcel2(fileName){
    var firstDate = this.Month_Name+'-'+'01'
    if (this.CheckFinalizedOrNot === "Finalized") {
    const obj = {
      "SP_String": "SP_Process_Monthly_Attendance_Sheet",
      "Report_Name_String": "Download_Bank_Transfer_Register",
      "Json_Param_String": JSON.stringify([{StartDate : this.DateService.dateConvert(new Date(firstDate))}])

    }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      // const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      // XLSX.writeFile(workbook, fileName+'.xlsx');
        this.converttoPDFbankstatement(data);
      
    })
    }
    else {
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: this.CheckFinalizedOrNot
        });
    }
  }
  
  converttoPDFbankstatement(itemNew) {
    //var style:any = ;
    var currentmonth = this.currentmonth;
    var doc:any = new jsPDF();
    var rows:any = [];

/* The following array of object as response from the API req  */
    var column = itemNew.length ? Object.keys(itemNew[0]): []

itemNew.forEach(element => {
    // var temp = [element.id,element.name,element.id1,element.name1,element.id2,element.name2,element.id3,element.name3,element.id4,element.name4];
    rows.push(Object.values(element))

});

    //  var base64Img;

  // Convert the image to base64
  // this.imgToBase64("https://Compacct/src/assets/adminSB/dist/img/Kashvi.jpeg", function(base64) {
  //   base64Img = base64;
  //   console.log('img----',base64Img)
  // });
    // Static base64 for example purposes
    // base64Img = 
    var imgData;
    imgData = "../../../../Content/dist/img/Kashvi.jpeg"
  
    doc.autoTable({
      theme: "grid",
      head:[column],
      body:rows,
      headStyles :{fillColor : [255, 255, 255],lineWidth: 0.1,lineColor:[0,0,0],textColor:[0, 0, 0],fontSize: 7},
      bodyStyles: {lineWidth: 0.1,lineColor:[0,0,0],fontSize: 7},
      // alternateRowStyles: {lineColor:[255,0,0],},
      //tableLineColor: [0, 0, 0],
      // tableLineWidth: 0.1,
      
      didDrawPage: function (data) {
        // Header
        // doc.setFontSize(20);
        // doc.setTextColor(40);
        // doc.setFontStyle('normal');
        var width = doc.internal.pageSize.getWidth()
        // var height = doc.internal.pageSize.getHeight();
        if (imgData) {   
            doc.addImage(imgData, 'JPEG', data.settings.margin.left,10,30,25);  // for add image
        }
        doc.text('MODERN INDIA CON-CAST LIMITED', width/2, 17, { align: 'center' },{fontSize: 12})
        doc.setFontSize(10);
        doc.text('(A unit of Kasvi Group)', width/2, 22, { align: 'center' },{fontSize: 3})
        doc.text('Bhuniaraichak, J.L No-122, Haldia-721635, Purba Medinipur, West Bengal', width/2, 27, { align: 'center' },{fontSize: 0.4})
        doc.text('Salary for The Month of ' + currentmonth, width/2, 32, { align: 'center' },{styles: { fontSize: 3 }})
        // // Footer
        // var str = "Page " + doc.internal.getNumberOfPages()
        // // Total page number plugin only available in jspdf v1.0+
        // if (typeof doc.putTotalPages === 'function') {
        //     str = str + " of " + totalPagesExp;
        // }
        doc.setFontSize(10);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        // doc.setLineDash([10, 10], 0);
        // doc.line(20, 25, 60, 25);
        doc.text("Prepared By", data.settings.margin.left, pageHeight - 10);
        doc.text('Checked By', width/2, pageHeight - 10, { align: 'center' })
        doc.text("Authorised By", 196, pageHeight - 10, { align: 'right' });
      },
      margin: {top: 40, bottom : 40}
    });
    doc.save('Bank-Statement.pdf');
  }
  salaryregforAdmin(fileName){
    var firstDate = this.Month_Name+'-'+'01'
    const obj = {
      "SP_String": "SP_Process_Monthly_Attendance_Sheet",
      "Report_Name_String": "Browse Salary Register For Admin",
      "Json_Param_String": JSON.stringify([{StartDate : this.DateService.dateConvert(new Date(firstDate))}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      XLSX.writeFile(workbook, fileName+'.xlsx');
      
    })
  }

}
