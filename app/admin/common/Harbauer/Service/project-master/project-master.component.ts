import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-project-master',
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ProjectMasterComponent implements OnInit {
  items:any = []
  tabIndexToView = 0;
  buttonname = "Create";
  Spinner = false;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "PROJECT MASTER"];
 
    this.Header.pushHeader({
      Header: "Master Product",
      Link: "Master Product"
    });
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "PROJECT MASTER"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){}
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm() {}
}
