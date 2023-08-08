import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from "@angular/core";
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
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Chart } from 'chart.js';
import html2canvas from 'html2canvas';

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
  jasonlist:any = [];
  rowGroupMetadata: any;
  idlist1:any = [];
  idlist2:any = [];

  @ViewChild('barChart',{static:false}) barChartRef: ElementRef;
  ChartList:any = [];

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
    this.createjson();
    this.createBarChart();
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
createjson(){
  this.idlist1 = [];
  this.idlist2 = [];
  this.jasonlist = [{'id':1,'Name':'abcd','address':'kolkata','gender':'female','location':'aabb'},
                   {'id':1,'Name':'abcd','address':'kolkata','gender':'female','location':'aabbcc'},
                   {'id':2,'Name':'xyz','address':'kolkata','gender':'female','location':'aabb'},
                   {'id':2,'Name':'xyz','address':'kolkata','gender':'female','location':'aabbcc'}]
  console.log('jasonlist====',this.jasonlist)
  this.jasonlist.forEach((ele,i) => {
    const id1 = this.jasonlist.filter((elem) => elem.id === 1)[i];
    const id2 = this.jasonlist.filter((elem) => elem.id === 2)[i];
    if(id1){
      this.idlist1.push(id1);
     }
    if(id2){
      this.idlist2.push(id2);
     }
 });
//  this.ChartList = [{'Label':'Label 1','val':10,'color':'red'},{'Label':'Label 2','val':20,'color':'blue'},{'Label':'Label 3','val':15,'color':'green'},{'Label':'Label 4','val':30,'color':'yellow'}]
}

jsontopdf() {
  //var style:any ='landscape'; //'l', 'mm', [297, 297]
  // var currentmonth = this.currentmonth;
  var itemNew = this.idlist1;
  var doc:any = new jsPDF();
  var rows:any = [];
  var header:any = [];
  var empname = this.idlist1[0].Name;
  header = 
  [{
  content: empname,
  colSpan: 5,
  styles: {
  halign: 'left',
  fillColor: [255, 255, 255] //[211, 211, 211]
  }
  }];
/* The following array of object as response from the API req  */
  var column = itemNew.length ? Object.keys(itemNew[0]): []
  let head1 = [header,column]
itemNew.forEach(element => {
  // var temp = [element.id,element.name,element.id1,element.name1,element.id2,element.name2,element.id3,element.name3,element.id4,element.name4];
  rows.push(Object.values(element))

});

  var imgData;
  imgData = "../../../../Content/dist/img/Kashvi.jpeg"

  doc.autoTable({
    //startY:50,
    theme: "grid",
    head:head1,
    body:rows,
    headStyles :{fillColor : [255, 255, 255],lineWidth: 0.1,lineColor:[0,0,0],textColor:[0, 0, 0],fontSize: 6},
    bodyStyles: {lineWidth: 0.1,lineColor:[0,0,0],textColor:[0, 0, 0],fontSize: 6,fontStyle: 'bold'},
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
      doc.addImage(imgData, 'JPEG', 0, 0, 180, 160);
    //   // Header
    //   // doc.setFontSize(20);
    //   // doc.setTextColor(40);
    //   // doc.setFontStyle('normal');
    //   var width = doc.internal.pageSize.getWidth();
    //   // console.log('width---',width)
    //   // var height = doc.internal.pageSize.getHeight();
    //   // console.log('height---',height)
    //   if (imgData) {   
    //       doc.addImage(imgData, 'JPEG', data.settings.margin.left,4,30,20);  // for add image
    //   }
    //   doc.text('MODERN INDIA CON-CAST LIMITED', width/2, 8, { align: 'center' },{fontSize: 12})
    //   doc.setFontSize(10);
    //   doc.text('(A unit of Kasvi Group)', width/2, 13, { align: 'center' },{fontSize: 3})
    //   doc.text('Bhuniaraichak, J.L No-122, Haldia-721635, Purba Medinipur, West Bengal', width/2, 18, { align: 'center' },{fontSize: 0.4})
    //   doc.text('Salary for The Month of ', width/2, 23, { align: 'center' },{styles: { fontSize: 3 }})
      
    //   var pageSize = doc.internal.pageSize;
    //   var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    //   doc.text("Prepared By", data.settings.margin.left, pageHeight - 4);
    //   doc.text('Checked By', width/2, pageHeight - 4, { align: 'center' })
    //   doc.text("Authorised By", width - 10, pageHeight - 4, { align: 'right' });
    },
    // margin: {top: 30, right: 6, bottom: 20, left: 6}
  });
  var itemNew2 = this.idlist2;
  var rows2:any = [];
  var header2:any = [];
  empname = this.idlist2[0].Name;
  header2 = 
  [{
  content: empname,
  colSpan: 5,
  styles: {
  halign: 'left',
  fillColor: [255, 255, 255] //[211, 211, 211]
  }
  }];

/* The following array of object as response from the API req  */
  var column2 = itemNew2.length ? Object.keys(itemNew2[0]): []
  let head2 = [header2,column2]

itemNew2.forEach(element => {
  // var temp = [element.id,element.name,element.id1,element.name1,element.id2,element.name2,element.id3,element.name3,element.id4,element.name4];
  rows2.push(Object.values(element))

});
  doc.autoTable({
    //startY:50,
    theme: "grid",
    head:head2,
    body:rows2,
    headStyles :{fillColor : [255, 255, 255],lineWidth: 0.1,lineColor:[0,0,0],textColor:[0, 0, 0],fontSize: 6},
    bodyStyles: {lineWidth: 0.1,lineColor:[0,0,0],textColor:[0, 0, 0],fontSize: 6,fontStyle: 'bold'},

    // didDrawPage: function (data) {
    //   // Header
    //   // doc.setFontSize(20);
    //   // doc.setTextColor(40);
    //   // doc.setFontStyle('normal');
    //   var width = doc.internal.pageSize.getWidth();
    //   // console.log('width---',width)
    //   // var height = doc.internal.pageSize.getHeight();
    //   // console.log('height---',height)
    //   if (imgData) {   
    //       doc.addImage(imgData, 'JPEG', data.settings.margin.left,4,30,20);  // for add image
    //   }
    //   doc.text('MODERN INDIA CON-CAST LIMITED', width/2, 8, { align: 'center' },{fontSize: 12})
    //   doc.setFontSize(10);
    //   doc.text('(A unit of Kasvi Group)', width/2, 13, { align: 'center' },{fontSize: 3})
    //   doc.text('Bhuniaraichak, J.L No-122, Haldia-721635, Purba Medinipur, West Bengal', width/2, 18, { align: 'center' },{fontSize: 0.4})
    //   doc.text('Salary for The Month of ', width/2, 23, { align: 'center' },{styles: { fontSize: 3 }})
      
    //   var pageSize = doc.internal.pageSize;
    //   var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    //   doc.text("Prepared By", data.settings.margin.left, pageHeight - 4);
    //   doc.text('Checked By', width/2, pageHeight - 4, { align: 'center' })
    //   doc.text("Authorised By", width - 10, pageHeight - 4, { align: 'right' });
    // },
    // margin: {top: 30, right: 6, bottom: 20, left: 6}
  });
  doc.save('Salary-Statement.pdf');
}
jsontopdfbackgroundimg() {
  //var style:any ='landscape'; //'l', 'mm', [297, 297]
  // var currentmonth = this.currentmonth;
  var itemNew = this.idlist1;
  var doc:any = new jsPDF('landscape');
  var rows:any = [];
  var header:any = [];
  var empname = this.idlist1[0].Name;
  var imgData;
  imgData = "../../../../Content/dist/img/certificate.png"

  // doc.autoTable({
    
    // didDrawPage: function (data) {
      doc.addImage(imgData, 'JPEG', 0, 0, 180, 160);
      // Header
      // doc.setFontSize(20);
      // doc.setTextColor(40);
      // doc.setFontStyle('normal');
      var width = doc.internal.pageSize.getWidth();
      // console.log('width---',width)
      // var height = doc.internal.pageSize.getHeight();
      // console.log('height---',height)
      // doc.text('MODERN INDIA CON-CAST LIMITED', width/2, 8, { align: 'center' },{fontSize: 12})
      // doc.setFontSize(10);
      doc.text('CERTIFICATE', width/2, 13, { align: 'center' },{fontSize: 12})
      // doc.text('Bhuniaraichak, J.L No-122, Haldia-721635, Purba Medinipur, West Bengal', width/2, 18, { align: 'center' },{fontSize: 0.4})
      // doc.text('Salary for The Month of ', width/2, 23, { align: 'center' },{styles: { fontSize: 3 }})
      
      // var pageSize = doc.internal.pageSize;
      // var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      // doc.text("Prepared By", data.settings.margin.left, pageHeight - 4);
      // doc.text('Checked By', width/2, pageHeight - 4, { align: 'center' })
      // doc.text("Authorised By", width - 10, pageHeight - 4, { align: 'right' });
    // },
    // margin: {top: 30, right: 6, bottom: 20, left: 6}
  // });
  doc.save('bg.pdf');
}
createBarChart() {
  // var itemNew = this.ChartList;
  // var column:any = [];
  // var rows:any = [];
  // var col:any = [];
  // var color:any = [];
  // column = itemNew.length ? Object.keys(itemNew[0]): []
  // // itemNew.forEach(element => {
  // //   // rows.push(Object.values(element))
  // //   var temp = [element.Label]
  // //   col.push(Object.values(element.Label));
  // //   console.log('col',col)
  // //   var temp2 = [element.val]
  // //   rows.push(Object.values(element.val));
  // //   console.log('rows',rows)
  // //   var temp3 = [element.color]
  // //   color.push(Object.values(element.color));
  // //   console.log('color',color)
  
  // // });
  // const data = {
  //   labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4'],
  //     datasets: [{
  //       label: 'Sample Data',
  //       data: [10, 20, 15, 30],
  //       backgroundColor: ['red', 'blue', 'green', 'yellow'],
  //   }]
  // };

  // const options:any = {
  //   scales: {
  //     y: {
  //       beginAtZero: true
  //     }
  //   }
  // };

  // const ctx = this.barChartRef.nativeElement.getContext('2d');
  // const barChart = new Chart(ctx, {
  //   type: 'bar',
  //   data: data,
  //   options: options
  // });
}
jsontopdfchart(){
  const pdf = new jsPDF();

    // Get the chart canvas element
    const chartCanvas:any = this.barChartRef.nativeElement;

    // Convert the chart canvas to an image using html2canvas
    html2canvas(chartCanvas).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100); // Adjust the position and size as needed

      // Save or open the PDF
      pdf.save('chart.pdf');
    });
}

}
class HrEvent {
  Description:any;
}
