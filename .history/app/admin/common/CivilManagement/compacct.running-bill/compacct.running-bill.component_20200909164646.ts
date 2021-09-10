import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { MessageService } from "primeng/api";
import * as moment from "moment";
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
declare var $:any;

@Component({
  selector: 'app-compacct-running-bill',
  templateUrl: './compacct.running-bill.component.html',
  styleUrls: ['./compacct.running-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CompacctRunningBillComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Create";
  Spinner = false;
  items = [];

  RoadList = [];
  ProjectList = [];
  ObjSearch = new Search();
  SerachFormSubmitted = false;
  constructor(private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
     this.Header.pushHeader({
      Header: "Daily Progress Report (Civil)",
      Link: " Civil -> Daily Progress Report (Civil)"
    });
  }
  GetRoad() {
    this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Project_Short_Name_Json")
      .subscribe((data: any) => {
        const roadData = data ? JSON.parse(data) : [];
        roadData.forEach(el => {
          this.RoadList.push({
            label: el.Project_Short_Name,
            value: el.Project_Short_Name
          });
        });
      });
  }
  Search(valid){
    this.SerachFormSubmitted = true;
    if (valid) {
      this.Spinner = true;
      const obj = new HttpParams()
      .set("Project_Short_Name", this.ObjSearch.Project_Short_Name)
      .set("Agreement_Number", this.ObjSearch.Agreement_Number ?  this.ObjSearch.Agreement_Number : '')
      this.$http
        .get("/BL_Txn_Civil_Daily_Job/Get_Entry_Daily_Job_Browse_Json", { params: obj })
        .subscribe((data: any) => {
          this.ProjectList = data.length ? JSON.parse(data) : [];
          this.Spinner = false;
          this.SerachFormSubmitted = false;
        });
    }
  }


   // Clear & Tab
   TabClick(e) {
    this.tabIndexToView = e.index;
    this.buttonname = "Create";
   // this.clearData();
  }
  clearData() {
  }
}
class Search{
  Project_Short_Name:string;
  Agreement_Number:string;
}
