import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { map, catchError } from 'rxjs/operators';
@Component({
  selector: 'app-fins-browse-project',
  templateUrl: './fins-browse-project.component.html',
  styleUrls: ['./fins-browse-project.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class FinsBrowseProjectComponent implements OnInit {
  alldataList:any = [{
    'EMP_Assigent_To':"Santanu",
    "Status": "Working Approved Internal",
    "Customer" : "ARHAM HANZALA",
    "Consultant" : "BHARAT SEWING THREAD CO",
    "Engagment_Letter": "YES",
    "Valuation_Date": new Date(),
    "Type_of_Valuation" : "test",
    "Purpose":"test",
    "Act":"test",
    "Final_Doc":"Yes",
    "Signing_Date":new Date(),
    "Report_Shared": "Yes",
    "Courier_Detalis_To": "Courier Detalis",
    "Courier_Detalis_Date" : new Date(),
    "Comment" : "Test",
    "PI_No" : "455454",
    "PI_Date" : new Date(),
    "PI_Amt" : "2000.00"
  }]
  dialogModel:boolean = false
  dialogheader:string =""
  EngagmentLetter:any = undefined
  SigningDate:Date = new Date()
  DynamicHeader:any =[]
  SubledgerList:any = []
  CourierDate:Date = new Date()
  userlist:any = []
  DistCustomer:any = []
  DistCustomerSelect:any = []

  DistConsultant:any = []
  DistConsultantSelect:any = []

  DistStatus:any = []
  DistStatusSelect:any = []

  DistEmployee:any = []
  DistEmployeeSelect:any = []
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Create Browse",
      Link: "Create Browse"
    });
    this.getSubledger()
    this.getuse()
    this.DistCustomer=[
      { label: 'ARHAM HANZALA', 
       value: 'ARHAM HANZALA' }
    ]
    this.DistConsultant=[
      { label: 'BHARAT SEWING THREAD CO', 
       value: 'BHARAT SEWING THREAD CO' }
    ]
    this.DistStatus=[
      { label: 'Working Approved Internal', 
       value: 'Working Approved Internal' }
    ]
    this.DistEmployee = [
      { label: 'Santanu', 
       value: 'Santanu' }
    ]
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){}
  openDialog(col:any,field:any){
    this.dialogheader = field
    this.dialogModel = true
  }
  getSubledger(){
    this.$http.get("/Common/Get_Subledger_DR")
    .pipe(map((data:any) => data ? JSON.parse(data) : []))
    .subscribe((data:any)=>{
      this.SubledgerList = [...data]
    })
  }
  getuse(){
    this.$http.get("/Master_User/Get_All_Data")
    .pipe(map((data:any) => data ? JSON.parse(data) : []))
    .subscribe((data:any)=>{
      this.userlist = [...data]
    })
  }

  
}
