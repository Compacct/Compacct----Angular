import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { map, catchError } from 'rxjs/operators';
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
@Component({
  selector: 'app-fins-browse-project',
  templateUrl: './fins-browse-project.component.html',
  styleUrls: ['./fins-browse-project.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class FinsBrowseProjectComponent implements OnInit {
  alldataList:any = []
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
  DistEmployeeSelect: any = []
  
  cokiseId: any = undefined;
  backUPdataList; any = [];
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Create Browse",
      Link: "Create Browse"
    });
    this.cokiseId = this.$CompacctAPI.CompacctCookies.User_ID;
    this.getAllBrowse();
    this.getSubledger()
    this.getuse()
  }
  getAllBrowse() {
    this.alldataList = [];
    this.backUPdataList = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Finshore_Project",
      "Report_Name_String": "Browse_Project",
       "Json_Param_String": JSON.stringify([{ Assigned_To: this.cokiseId }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length > 0) {
        this.alldataList = data;
        this.backUPdataList = data;
        this.DynamicHeader = Object.keys(data[0]);
        this.GetDistinct();
      }
    });
  }
  GetDistinct() {
    let Status: any = [];
    this.DistCustomer = [];
    this.DistConsultant = [];
    this.DistStatus = [];
    this.DistEmployee = [];
    this.alldataList.forEach((item) => {
      if (Status.indexOf(item.Sub_Ledger_Client) === -1) {
        Status.push(item.Sub_Ledger_Client);
        this.DistCustomer.push({ label: item.Sub_Ledger_Client, value: item.Sub_Ledger_Client });
      }
      if (Status.indexOf(item.Sub_Ledger_Consultant) === -1) {
        Status.push(item.Sub_Ledger_Consultant);
        this.DistConsultant.push({ label: item.Sub_Ledger_Consultant, value: item.Sub_Ledger_Consultant });
      }
      if (Status.indexOf(item.Status_Name) === -1) {
        Status.push(item.Status_Name);
        this.DistStatus.push({ label: item.Status_Name, value: item.Status_Name });
      }
      if (Status.indexOf(item.Assign_To_Name) === -1) {
        Status.push(item.Assign_To_Name);
        this.DistEmployee.push({ label: item.Assign_To_Name, value: item.Assign_To_Name });
      }
    });
    this.backUPdataList = [...this.alldataList];
  }
  FilterDist() {
    let First: any = [];
    let Second: any = [];
    let three: any = [];
    let fore: any = [];
    let SearchFields: any = [];
    if (this.DistEmployeeSelect.length) {
      SearchFields.push('Sub_Ledger_Client');
      First = this.DistEmployeeSelect;
    }
    if (this.DistConsultantSelect.length) {
      SearchFields.push('Sub_Ledger_Consultant');
      Second = this.DistConsultantSelect;
    }
    if (this.DistStatusSelect.length) {
      SearchFields.push('Status_Name');
      three = this.DistStatusSelect;
    }
    if (this.DistCustomerSelect.length) {
      SearchFields.push('Assign_To_Name');
      fore = this.DistCustomerSelect;
    }
    this.alldataList = [];
    if (SearchFields.length) {
      let LeadArr = this.backUPdataList.filter(function (e) {
        return (First.length ? First.includes(e['Sub_Ledger_Client']) : true)
          && (Second.length ? Second.includes(e['Sub_Ledger_Consultant']) : true)
          && (three.length ? three.includes(e['Status_Name']) : true)
          &&(fore.length ? fore.includes(e['Assign_To_Name']) : true)
      });
      this.alldataList = LeadArr.length ? LeadArr : [];
    } else {
      this.alldataList = [...this.backUPdataList];
    }

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
