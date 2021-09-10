import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tuto-student-search',
  templateUrl: './tuto-student-search.component.html',
  styleUrls: ['./tuto-student-search.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoStudentSearchComponent implements OnInit {
  ConfirmSearchFormSubmitted = false;
  seachSpinner = false;
  Searchlist = [];

  Studentdetails:any;

  ShowDetailsModal = false;
  tabIndexToView = 0;
  items = [];
  Billingdetaillist = [];
  Orderdetaillist = [];

  ObjStusearchForm = new StusearchForm();
  ObjStudetail = new Studetail();
  objLedgerDetails = new LedgerDetails();
  LedgerModal = false;
  LedgerSubmitted = false;
  ClassList = [];
  StudentEditFormSubmitted = false;
  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.items = ["Student Detail", "Billing Detail","Order Details "];
    this.Header.pushHeader({
      Header: "Student Search",
      Link: " CRM -> Student Search"
    });
  }
  TabClick(e){
    console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["Student Detail", "Billing Detail","Order Details "];

  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.objLedgerDetails.StDate = dateRangeObj[0];
      this.objLedgerDetails.EndDate = dateRangeObj[1];
    }
  }
  GetClassList(){
    this.seachSpinner = true;
    const obj = {
      "Report_Name": "List_Class "
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
          this.ClassList = data.length ? data : [];
          this.seachSpinner = false;
    });
  }

  GetSearchList(valid){
    this.ConfirmSearchFormSubmitted = true;
    if(valid) {
      this.seachSpinner = true;
        const para = new HttpParams().set("Search_BY", this.ObjStusearchForm.Search_BY)
    .set("Search_Type", this.ObjStusearchForm.Search_Type)
    .set("Search_Value", this.ObjStusearchForm.Search_Value);
    this.$http
    .get('Tutopia_Student_Search/Get_Student_Search', { params: para })
    .subscribe((data: any) => {
      this.Searchlist = data ? JSON.parse(data) : [];
      this.seachSpinner = false;
    });
  }

  }
  GetStudentdetails(){
    this.Studentdetails = undefined;
    const tempObj = {
      Foot_Fall_ID: this.ObjStusearchForm.Foot_Fall_ID
    };

    const obj = {
      "Report_Name" : "Get_Student_Details",
      "Json_Param_String" : JSON.stringify([tempObj])
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      this.Studentdetails = data ? data[0] : [];

     })
  }
  GetBillingdetaillist(){
    this.Billingdetaillist = [];
    const Objtemp = {
      Foot_Fall_ID : this.ObjStusearchForm.Foot_Fall_ID
    };
    const objj = {
      "Report_Name" : "Get_Student_Bill_Details",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.CommonTaskData(objj).subscribe((data:any)=>{
      this.Billingdetaillist = data.length ? data : [];
      console.log(this.Billingdetaillist)

     })

  }
  GetOrderdetaillist(){
    this.Orderdetaillist = [];
    const Objtemp = {
      Foor_Fall_ID : this.ObjStusearchForm.Foot_Fall_ID
    };
    const objj = {
      "Report_Name" : "Get_Order_Details_Foot_Fall_ID_Wise",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.CommonTaskData(objj).subscribe((data:any)=>{
      this.Orderdetaillist = data.length ? data : [];
      console.log(this.Orderdetaillist)

     })

  }
  //  DETAILS
  Showdetails(obj){
    this.ObjStudetail = new Studetail();
    this.ShowDetailsModal = false;
    if(obj.Foot_Fall_ID){
      this.ObjStusearchForm.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.GetStudentdetails();
      this.GetBillingdetaillist();
      this.GetOrderdetaillist()
      setTimeout(()=>{
        this.ShowDetailsModal = true;
      },900);
    }
  }
  PrintBill(obj) {
    if (obj.Doc_No) {
      window.open("/Report/Crystal_Files/Finance/SaleBill/tutopia_final.aspx?Doc_No=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

      );
    }
  }
  //  LEDGER
  showLedger(obj) {
    this.objLedgerDetails = new LedgerDetails();
    this.LedgerSubmitted = false;
    if(obj.Foot_Fall_ID) {
      this.objLedgerDetails.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.objLedgerDetails.Patient_Name = obj.Contact_Name;
      this.LedgerModal = true;
    }
  }
  PrintLedger(valid) {
    this.LedgerSubmitted = true;
    if(valid){
      const start = this.objLedgerDetails.StDate
        ? this.DateService.dateConvert(new Date(this.objLedgerDetails.StDate))
        : this.DateService.dateConvert(new Date());
      const end = this.objLedgerDetails.EndDate
        ? this.DateService.dateConvert(new Date(this.objLedgerDetails.EndDate))
        : this.DateService.dateConvert(new Date());
      window.open("/Report/Crystal_Files/CRM/Clinic/Patient_Ledger.aspx?Report_type=" + this.objLedgerDetails.Report_type + "&StDate=" + start + "&EndDate=" + end + "&Foot_Fall_ID=" + this.objLedgerDetails.Foot_Fall_ID + "&Patient_Name=" + this.objLedgerDetails.Patient_Name, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }

}
class StusearchForm{
  Search_BY = "Mobile";
  Search_Type = "Similar To";
  Search_Value : string;
  Foot_Fall_ID : number;
}

 class Studetail{
  Foot_Fall_ID : number;
  Contact_Name : string;
  Class_Name : string;
  Mobile : string;
  Pin : string;
  City : string;

}
class LedgerDetails {
  Report_type = 'Detail Print';
  StDate:string;
  EndDate:string;
  Foot_Fall_ID:string;
  Patient_Name:string;
}
