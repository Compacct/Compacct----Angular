import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
@Component({
  selector: 'app-micl-coupon-issue',
  templateUrl: './micl-coupon-issue.component.html',
  styleUrls: ['./micl-coupon-issue.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MICLCouponIssueComponent implements OnInit {
  items: any = [];
  tabIndexToView= 0;
  buttonname = "Save";
  CouponFormsSubmitted: boolean = false;
  ObjCouponIssue: CouponIssue = new CouponIssue();
  EmployeeList: any = [];
  CouponList: any = [];
  ChangeFieldName: boolean = false;
  if_Visitor: boolean = false;
  CouponDate: Date = new Date();
  TotalCoupon: number = 0;
  TotalAmount: any = undefined;
  reqCheck: boolean = false;
  AddList: any = [];
  SaveFinal: any = [];
  QtyTotal: number = 0;
  CouponDateBrowseFirst: Date = new Date();
  CouponDateBrowseEnd: Date = new Date();
  BrowseData: any = [];
  NoDataFound: boolean = false;
  EmpId: any = undefined;
  EmpNmae: any = undefined;
  visitorName: any = undefined;
  Date_Delete: any = undefined;
  initDate:any = [];
  From_date : Date;
  To_date : Date;
  EditList:any = [];
  Issue_To: any;
  contractorList:any = [];
  contractorEmpList:any = [];
  IssuetoList:any = [] ;
  DynamicHeaderforBrowseData:any = [];
  Issue_To_Browse:any;
  pdfFormSubmitted:boolean = false;
  currentmonth: any;
  UndercontractorList:any = [];
  Sub_Ledger_ID:any;
  Sub_Ledger_Name = undefined;
  
  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header: CompacctHeader ,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
  ) {}

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.header.pushHeader({
      Header: "Coupon Issue",
      Link: " HR -> Coupon Issue"
    })
    this.Finyear();
    this.getEmpList();
    this.getContractor();
    this.getContractorEmp();
    this.getCoupontype();
    this.IssuetoData();
    this.getUnderContractorList();
    this.Issue_To = "Employee";
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
    this.AddList = [];
  }
  IssuetoData(){
    this.IssuetoList = ['Employee', 'Contractor', 'Visitor', 'H.O Staff', 'Voucher Staff'];
  }
  Finyear() {
    this.http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
      // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
      // this.voucherminDate = new Date(data[0].Fin_Year_Start);
      // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }
  clearData() {
    this.CouponFormsSubmitted = false;
    this.TotalCoupon = 0;
    this.TotalAmount = undefined;
    this.if_Visitor = false;
    this.CouponDate = new Date();
    this.ObjCouponIssue = new CouponIssue();
  }
  changeField() {
      this.ObjCouponIssue.Emp_ID = undefined;
      this.ObjCouponIssue.Sub_Ledger_ID = undefined;
      this.ObjCouponIssue.Contractor_Emp_ID = undefined;
      this.contractorEmpList = [];
      this.ObjCouponIssue.Visitor_Name = '';
      this.ObjCouponIssue.Coupon_Type = undefined;
      this.ObjCouponIssue.Start_No = undefined;
      this.ObjCouponIssue.End_No = undefined;
      this.TotalCoupon = 0;
      this.TotalAmount = 0;
      this.AddList = [];
  }
  getEmpList() {
    this.EmployeeList = []
    const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Get_Employee_List",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach((xy: any) => {
          xy['label'] = xy.Emp_Name
          xy['value'] = xy.Emp_ID
        });
        this.EmployeeList = data
         //console.log("EmployeeList==",this.EmployeeList)
      }
    });
  }
  getContractor() {
    this.contractorList = []
    const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Get_Contractor_List",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach((xy: any) => {
          xy['label'] = xy.Sub_Ledger_Name
          xy['value'] = xy.Sub_Ledger_ID
        });
        this.contractorList = data
        //  console.log("contractorList==",this.contractorList)
      }
    });
  }
  getContractorEmp() {
    this.contractorEmpList = []
    this.ObjCouponIssue.Contractor_Emp_ID = undefined;
    if (this.ObjCouponIssue.Sub_Ledger_ID) {
    const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Get_Contractor_Employee",
      "Json_Param_String": JSON.stringify({Sub_Ledger_ID:this.ObjCouponIssue.Sub_Ledger_ID})
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach((xy: any) => {
          xy['label'] = xy.Emp_Name
          xy['value'] = xy.Emp_ID
        });
        this.contractorEmpList = data
        //  console.log("contractorEmpList==",this.contractorEmpList)
      }
    });
    }
  }
  getCoupontype() {
    this.CouponList = []
    const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Get_Coupon_Type",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        this.CouponList = data
        // console.log("CouponList==",this.CouponList)
      }
    });
  }
  calucation() {
    if ((Number(this.ObjCouponIssue.End_No) && Number(this.ObjCouponIssue.Start_No)) && Number(this.ObjCouponIssue.End_No) >= Number(this.ObjCouponIssue.Start_No)) {
      this.TotalCoupon = Number(this.ObjCouponIssue.End_No - this.ObjCouponIssue.Start_No) + 1
      this.reqCheck = false;
      this.AmountCalcutaion(); 
    }
    else {
      if (this.ObjCouponIssue.End_No) {
       this.reqCheck = true; 
      }
        this.TotalCoupon = 0 
    }
    
  }
  AmountCalcutaion() {
    let filterAmt:any =[]
    if (this.ObjCouponIssue.Coupon_Type !== undefined) {
        filterAmt = this.CouponList.filter((Elee: any) => Elee.Coupon_Type === this.ObjCouponIssue.Coupon_Type); 
    }
    if (filterAmt.length === 1&& this.TotalCoupon) {
      if(this.Issue_To === "Employee" || this.Issue_To === "H.O Staff" || this.Issue_To === "Voucher Staff") {
      this.TotalAmount = Number(filterAmt[0].Amount) * Number(this.TotalCoupon)
      }
      if(this.Issue_To === "Contractor") {
        this.TotalAmount = Number(filterAmt[0].Contractor_Amount) * Number(this.TotalCoupon)
      }
      if(this.Issue_To === "Visitor") {
        this.TotalAmount = Number(filterAmt[0].Visitor_Amount) * Number(this.TotalCoupon)
      }
    }
    else {
      this.TotalAmount = 0; 
    }
  }
  AddData() {
    // this.CouponFormsSubmitted = true;
    // if (this.ValidationOfCoupon() !== null) {}
    // if (valid && Number(this.ObjCouponIssue.End_No) >= Number(this.ObjCouponIssue.Start_No)) {
     this.ObjCouponIssue.Created_By = this.compact.CompacctCookies.User_ID; 
      this.ObjCouponIssue.Date = this.DateService.dateConvert(this.CouponDate);
      this.AddList.push({
          Date :	this.ObjCouponIssue.Date,	
          Coupon_Type	: this.ObjCouponIssue.Coupon_Type,	
          Start_No: this.ObjCouponIssue.Start_No,	
          End_No: this.ObjCouponIssue.End_No,	
          No_Of_Coupon: this.TotalCoupon,	
          Total_Amount: this.TotalAmount,
          Created_By: this.ObjCouponIssue.Created_By, 
      })
      if (this.AddList.length) {
       this.GetTotalAmount(); 
      }
      this.CouponFormsSubmitted = false;
      this.TotalCoupon = 0;
      this.TotalAmount = undefined;
      // this.CouponDate = new Date();
      this.ObjCouponIssue.Coupon_Type = undefined;
      this.ObjCouponIssue.Start_No = undefined;
      this.ObjCouponIssue.End_No = undefined;
    // }
  }
  ValidationOfCoupon(valid:any) {
    this.CouponFormsSubmitted = true;
    if (this.ObjCouponIssue.Start_No && this.ObjCouponIssue.End_No) {
      if (valid && Number(this.ObjCouponIssue.End_No) >= Number(this.ObjCouponIssue.Start_No)) {
      const Value = {
        Start_No: this.ObjCouponIssue.Start_No,
        End_No: this.ObjCouponIssue.End_No 
      }
      const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Get_Coupon_Receive",
      "Json_Param_String": JSON.stringify([Value])
    }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1 === "Invalid Coupon") {
         this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary:"This coupon has already been used",
          detail: "Not Ablavlable"
        });
       }
       else {
        this.SaveJournal();
       }
    }); 
    }
    }
  }
  SaveJournal(){
    if (this.ObjCouponIssue.Start_No && this.ObjCouponIssue.End_No) {
      const Value = {
        Start_No: this.ObjCouponIssue.Start_No,
        End_No: this.ObjCouponIssue.End_No 
      }
      const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Save_Issue_Coupon_journal",
      "Json_Param_String": JSON.stringify([Value])
    }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
       console.log("Get_Coupon_Receive==",data)
        if (data[0].Column1) {
        this.AddData();
       }
    }); 
    }
  }

  deleteRaw(ind:any) {
    this.AddList.splice(ind,1)
  }
  DeleteFromJournal(dataobj,ind:any){
    if (dataobj.Start_No && dataobj.End_No) {
      const Value = {
        Start_No: dataobj.Start_No,
        End_No: dataobj.End_No 
      }
      const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Delete_Issue_Coupon_journal",
      "Json_Param_String": JSON.stringify([Value])
    }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.AddList.splice(ind,1)
          this.GetTotalAmount();
       }
    }); 
    }
  }
  GetTotalAmount(){
  let flg:Number = 0
  this.AddList.forEach((ele:any) => {
    flg = Number(ele.Total_Amount) + Number(flg)
  });
  this.QtyTotal = Number(Number(flg).toFixed())
  return this.QtyTotal
}
  FinalSave() {
    if (this.AddList.length) {
      let FilterEmp: any = [];
      let EmpName: any = '';
      if (this.ObjCouponIssue.Emp_ID) {
        FilterEmp = this.EmployeeList.filter((Ele: any) => Ele.Emp_ID === this.ObjCouponIssue.Emp_ID)
        EmpName = FilterEmp[0].Emp_Name; 
      }
      this.AddList.forEach(el => {
        this.SaveFinal.push({
          Issue_Type: this.Issue_To,
          Emp_ID: this.ObjCouponIssue.Emp_ID ? this.ObjCouponIssue.Emp_ID : 0,
          Emp_Name: EmpName ? EmpName : "",
          Sub_Ledger_ID: this.ObjCouponIssue.Sub_Ledger_ID ? this.ObjCouponIssue.Sub_Ledger_ID : 0,
          Contractor_Emp_ID:this.ObjCouponIssue.Contractor_Emp_ID ? this.ObjCouponIssue.Contractor_Emp_ID : 0,
          Visitor_Name: this.ObjCouponIssue.Visitor_Name ? this.ObjCouponIssue.Visitor_Name : "",
          Date: el.Date ? this.DateService.dateConvert(el.Date) : null,
          Coupon_Type: el.Coupon_Type,
          Start_No: el.Start_No,
          End_No: el.End_No,
          No_Of_Coupon: el.No_Of_Coupon,
          Total_Amount: el.Total_Amount,
          Created_By: el.Created_By
        })
      });
      const obj = {
        "SP_String": "SP_Master_Coupon_Receive",
        "Report_Name_String": "Save_Master_Coupon_Issue",
        "Json_Param_String": JSON.stringify(this.SaveFinal)
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {        
        if (data[0].Column1) { 
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Coupon Details ",
            detail: "Succesfully Save"
          });
          this.AddList = [];
          this.SaveFinal = [];
          this.clearData();
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          this.SearchData();
        }
      })
    }
  }
  getUnderContractorList() {
    const obj = {
      "SP_String": "Sp_HR_Employee_Master_Contractor",
      "Report_Name_String": "Get_Contractor_List"

    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log('Contractor List>>', data);
      if (data.length) {
        data.forEach((ele) => {
          this.UndercontractorList.push({
            'label': ele.Sub_Ledger_Name,
            'value': ele.Sub_Ledger_ID
          })
        });
      }
    });
  }
  clearsubledger(){
    this.Sub_Ledger_ID = undefined;
  }
  getsubledgername(){
    this.Sub_Ledger_Name = undefined;
    if(this.Sub_Ledger_ID){
      const subledgername = this.UndercontractorList.filter(item=>Number(item.value) === Number(this.Sub_Ledger_ID))
      this.Sub_Ledger_Name = (subledgername[0].label).toUpperCase();
      console.log("this.Sub_Ledger_Name===",this.Sub_Ledger_Name)
    }
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.From_date = dateRangeObj[0];
      this.To_date = dateRangeObj[1];
    }
  }
  SearchData() {
    this.BrowseData = [];
    this.DynamicHeaderforBrowseData = [];
  if (this.From_date && this.To_date) {
      const Data = {
        From_Date: this.DateService.dateConvert(this.From_date) ,
        To_Date: this.DateService.dateConvert(this.To_date) ,
        Issue_Type: this.Issue_To_Browse ? this.Issue_To_Browse : ''
      }
      const obj = {
        "SP_String": "SP_Master_Coupon_Receive",
        "Report_Name_String": "Browse_Master_Coupon_Issue",
        "Json_Param_String": JSON.stringify([Data])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => { 
        //console.log("Browse",data)
        if (data.length) {
          data.forEach(element => {
            element['Date'] = this.DateService.dateConvert(new Date(element.Date))
          });
          this.BrowseData = data
          this.NoDataFound = false;  
          this.DynamicHeaderforBrowseData = Object.keys(data[0]);
        }
        else {
         this.NoDataFound = true; 
         this.DynamicHeaderforBrowseData = [];
        }
      })      
   } 
  }
  exportExcelbrowse(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {[fileName]: worksheet}, SheetNames: [fileName]};
    XLSX.writeFile(workbook, fileName+'.xlsx');
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
  downloadpdf(valid){
    this.pdfFormSubmitted = true;
    if (valid && this.From_date && this.To_date) {
      this.getcurrentmonth();
    const Data = {
      From_Date: this.DateService.dateConvert(this.From_date) ,
      To_Date: this.DateService.dateConvert(this.To_date) ,
      Issue_Type: this.Issue_To_Browse,
      Sub_Ledger_ID: this.Sub_Ledger_ID
    }
    const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Coupon_Statement_For_PDF",
      "Json_Param_String": JSON.stringify([Data])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.converttoPDFcoupon(data);
      this.pdfFormSubmitted = false;
    })
    }
  }
  converttoPDFcoupon(itemNew:any) {
    //var style:any = ;
    var fromdate = this.From_date;
    var month = this.currentmonth
    var year = fromdate.getFullYear();
    var currentmonthyear = month + '-' + year;
    var doc:any = new jsPDF();
    var rows:any = [];
    var header:any = [];

/* The following array of object as response from the API req  */
    var column = itemNew.length ? Object.keys(itemNew[0]).slice(1) : [];
    // console.log('column----',Object.keys(itemNew[0]).slice(1))
    // var column = ['SL No', 'Emp Code', 'Emp Name', 'Meal', 'Rate', 'Amount Rs', 'Breakfast', 'Rate1', 'Amount Rs.1', 'Grand Total Amount'];
    header = 
      [{
      content: "MEAL & BREAKFAST COUPON STATEMENT OF " + this.Sub_Ledger_Name + " FOR THE MONTH OF " + currentmonthyear,
      colSpan: 10,
      styles: {
      halign: 'center',
      fillColor: [255, 255, 255] //[211, 211, 211]
      }
      }];
    // var head = [{...header,...column}]
    let head = [header,column]

itemNew.forEach((element) => {
    // var temp = [element.SL_No,element.Emp_Code,element.Emp_Name,element.Meal,element.Rate,element.Amount_Rs,element.Breakfast,element.Rate1,element.Amount_Rs,element.Grand_Total_Amount];
    rows.push(Object.values(element).slice(1))
    // rows.push(temp)

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
      head:head,
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
        // doc.text('Salary for The Month of ' + currentmonth, width/2, 32, { align: 'center' },{styles: { fontSize: 3 }})
        // // Footer
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text("Prepared By", data.settings.margin.left, pageHeight - 10);
        doc.text('Checked By', width/2, pageHeight - 10, { align: 'center' })
        doc.text("Authorised By", 196, pageHeight - 10, { align: 'right' });
      },
      margin: {top: 40, bottom: 30}
    });
    doc.save('Coupon-Statement.pdf');
  }
  EditCoupon(col) {
    this.clearData();
    this.AddList = [];
    this.EditList = [];
    if (col) {
      const Tempobj = {
        Emp_ID: col.Emp_ID,
        Emp_Name: col.Emp_Name,
        Visitor_Name: col.Visitor_Name,
        Contractor_Emp_ID: col.Contractor_Emp_ID,
        Date: this.DateService.dateConvert(new Date(col.Date))
      }
      const obj = {
        "SP_String": "SP_Master_Coupon_Receive",
        "Report_Name_String": "Get_Coupon_Issue_Data_For_Edit",
        "Json_Param_String": JSON.stringify([Tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.EditList = data;
        if(this.EditList.length){
          this.tabIndexToView = 1;
          this.items = ["BROWSE", "UPDATE"];
          this.buttonname = "Update";
          this.if_Visitor = this.ObjCouponIssue.Visitor_Name ? true : false;
          this.Issue_To = data[0].Issue_Type ? data[0].Issue_Type : col.Issue_Type;
          this.changeField();
          this.ObjCouponIssue.Emp_ID = data[0].Emp_ID;
          this.ObjCouponIssue.Sub_Ledger_ID = data[0].Sub_Ledger_ID ? data[0].Sub_Ledger_ID : col.Sub_Ledger_ID;
          this.getContractorEmp();
          this.ObjCouponIssue.Contractor_Emp_ID = data[0].Contractor_Emp_ID ? data[0].Contractor_Emp_ID : col.Contractor_Emp_ID;
          // console.log("this.ObjCouponIssue.Contractor_Emp_ID===",this.ObjCouponIssue.Contractor_Emp_ID)
          this.CouponDate = new Date(data[0].Date);
          this.ObjCouponIssue.Visitor_Name = data[0].Visitor_Name ? data[0].Visitor_Name : undefined;
          this.EditList.forEach(element => {
            const editobj = {
              // Emp_ID: element.Emp_ID,
              // Emp_Name: element.Emp_Name ? element.Emp_Name : "",
              // Visitor_Name: element.Visitor_Name ? element.Visitor_Name : "",
              Date: element.Date ? this.DateService.dateConvert(element.Date) : null,
              Coupon_Type: element.Coupon_Type,
              Start_No: element.Start_No,
              End_No: element.End_No,
              No_Of_Coupon: element.No_Of_Coupon,
              Total_Amount: element.Total_Amount,
              Created_By: element.Created_By
            }
            this.AddList.push(editobj);
          });
          this.GetTotalAmount();

        }
      })
    }
   }
  onReject(){
  this.compacctToast.clear("c");
  }
  DeleteCoupon(DeleteID: any) {
    this.EmpId = undefined;
    this.EmpNmae = undefined;
    this.visitorName = undefined;
    this.Date_Delete = undefined;
    if ((DeleteID.Emp_ID || DeleteID.Emp_Name || DeleteID.Visitor_Namee) && DeleteID.Date) {
      this.EmpId = DeleteID.Emp_ID;
      this.EmpNmae = DeleteID.Emp_Name;
      this.visitorName = DeleteID.Visitor_Name;
      this.Date_Delete = DeleteID.Date;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
  }
  onConfirm() {
    const Temp = {
      Emp_ID: this.EmpId,
      Emp_Name: this.EmpNmae,
      Visitor_Name: this.visitorName,
      Date: this.Date_Delete,
    }
    const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Delete_Coupon_Receive",
      "Json_Param_String": JSON.stringify([Temp])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if (data[0].Column1){
        this.onReject();
        this.SearchData();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary:"Employee Name:-" + this.EmpNmae ? this.EmpNmae : this.visitorName ,
          detail: "Succesfully Deleted"
        });
      }
    })
  }
}
class CouponIssue{
  Visitor_Name: any;
  Coupon_Type: any;
  Emp_ID:any;
	Emp_Name:any;
	Date:any;	
	Start_No:any;
	End_No:any;
	No_Of_Coupon:any;
	Total_Amount:any;
	Created_By:any;
  Sub_Ledger_ID:any;
  Contractor_Emp_ID:any;
}
