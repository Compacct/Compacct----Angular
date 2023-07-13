import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { data } from "jquery";
import { Console } from "console";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

@Component({
  selector: 'app-leave-register',
  templateUrl: './leave-register.component.html',
  styleUrls: ['./leave-register.component.css'],
  providers:[MessageService],
  encapsulation: ViewEncapsulation.None
})
export class LeaveRegisterComponent implements OnInit {
  seachSpinner : any= false;
  Spinner : any = false;
  initDate:any = [];
  From_date: any;
  To_date: any;
  currentmonth: any;

  constructor(
    private $http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private route : ActivatedRoute,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header:  "Leave Register " ,
      Link: "Leave Register " 
    });
    this.Finyear();
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.From_date = dateRangeObj[0];
      this.To_date = dateRangeObj[1];
    }
  }
  getcurrentmonth(){
    var firstDate = this.From_date;
    const currentdate = new Date(firstDate);
    const month = currentdate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];

    this.currentmonth = monthNames[month].toUpperCase();
    console.log('monthNames====',this.currentmonth);
  }
  GetLeaveRegister(){
    this.seachSpinner = true;
    if (this.From_date && this.To_date) {
      this.getcurrentmonth();
    const Data = {
      Start_Date: this.DateService.dateConvert(this.From_date) ,
      End_Date: this.DateService.dateConvert(this.To_date)
    }
    const obj = {
      "SP_String": "SP_Leave_Application",
      "Report_Name_String": "Leave_Summary_Report_For_All",
      "Json_Param_String": JSON.stringify([Data])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length){
        this.seachSpinner = false;
        this.DownloadPDF(data);
      }
    })
    }
  }
  DownloadPDF(itemNew:any) {
    //var style:any = ;
    var fromdate = this.From_date;
    var month = this.currentmonth
    var year = fromdate.getFullYear();
    var currentmonthyear = month + '-' + year;
    var doc:any = new jsPDF('l', 'mm', 'legal');
    var rows:any = [];
    var firstheader:any = [];
    var header:any = [];
    var lastrow:any = [];

/* The following array of object as response from the API req  */
    var col = Object.keys(itemNew[0]);
    var replaceunderscore = col.map((value:any) => value.replace(/_/g, ' '));
    var replace1 = replaceunderscore.map((val:any) => val.replace(/1/g, ''))
    var column = itemNew.length ? replace1 : [];
    // console.log('column----',Object.keys(itemNew[0]).slice(1))
    // var column = ['SL No', 'Emp Code', 'Emp Name', 'Meal', 'Rate', 'Amount Rs', 'Breakfast', 'Rate1', 'Amount Rs.1', 'Grand Total Amount'];
    firstheader = [{
      content: "Leave Details Report",
      colSpan: 13,
      styles: {
      halign: 'center',
      fillColor: [154,184,203] //[211, 211, 211]
      }
    }]
    header = 
      [{
        content: "Employee Details",
        colSpan: 4,
        styles: {
        halign: 'center',
        fillColor: [192,192,192] //[211, 211, 211]
        }
      },
      {
        content: "Leave Opening Balance",
        colSpan: 3,
        styles: {
        halign: 'center',
        fillColor: [106, 227, 66] //[211, 211, 211]
        }
      },
      {
        content: "Leave Availed",
        colSpan: 3,
        styles: {
        halign: 'center',
        fillColor: [192, 64, 0] //[211, 211, 211]
        }
      },
      {
        content: "Leave Balance",
        colSpan: 3,
        styles: {
        halign: 'center',
        fillColor: [28, 189, 69] //[211, 211, 211]
        }
      }];
    // var head = [{...header,...column}]
    let head = [firstheader,header,column]


    // FOR LAST ROW
    var total = itemNew.reduce((sum, el) => sum + el.Grand_Total_Amount, 0).toFixed(2);
    // var numbertoword = this.convertNumberToWords(total);
    lastrow = 
          [{
            content: "=",
            colSpan: 5,
            styles: {
            halign: 'center',
            fillColor: [255, 255, 255], //[211, 211, 211]
            textColor:[0, 0, 0],
            fontStyle: 'bold'
            }
            },
            {
            content: "Total",
            styles: {
            halign: 'center',
            fillColor: [255, 255, 255], //[211, 211, 211]
            textColor:[0, 0, 0],
            fontStyle: 'bold'
            }
            },
            {
              content: `${total}`,
              styles: {
              halign: 'center',
              fillColor: [255, 255, 255], //[211, 211, 211]
              textColor:[0, 0, 0],
              fontStyle: 'bold'
            }
          }];
    itemNew.forEach((element) => {
        // var temp = [element.SL_No,element.Emp_Code,element.Emp_Name,element.Meal,element.Rate,element.Amount_Rs,element.Breakfast,element.Rate1,element.Amount_Rs,element.Grand_Total_Amount];
        rows.push(Object.values(element));
        // rows.push(temp)

    });
    var imgData;
    imgData = "../../../../Content/dist/img/Kashvi.jpeg"
   
    // rows.push(lastrow);
    doc.autoTable({
      theme: "grid",
      head:head,
      body:rows,
      headStyles :{fillColor : [227, 187, 66],lineWidth: 0.1,lineColor:[0,0,0],textColor:[0, 0, 0],fontSize: 8,halign: 'center',},
      bodyStyles: {lineWidth: 0.1,lineColor:[0,0,0],textColor:[0, 0, 0],fontSize: 7,halign: 'center',},
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
          doc.addImage(imgData, 'JPEG', data.settings.margin.left,4,30,20);  // for add image
        }
        doc.text('MODERN INDIA CON-CAST LIMITED', width/2, 10, { align: 'center' },{fontSize: 12})
        doc.setFontSize(10);
        doc.text('(A unit of Kasvi Group)', width/2, 15, { align: 'center' },{fontSize: 3})
        doc.text('Bhuniaraichak, J.L No-122, Haldia-721635, Purba Medinipur, West Bengal', width/2, 20, { align: 'center' },{fontSize: 0.4})
        // doc.text('Salary for The Month of ' + currentmonth, width/2, 23, { align: 'center' },{styles: { fontSize: 3 }})
      
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text("Prepared By", data.settings.margin.left, pageHeight - 4);
        doc.text('Checked By', width/2, pageHeight - 4, { align: 'center' });
        doc.text("Authorised By", width - 10, pageHeight - 4, { align: 'right' });
      },
      margin: {top: 30, bottom: 30}
      });
      doc.save('Canteen-Statement-Summary.pdf');
  }
  onConfirm(){}
  onReject(){}

}
