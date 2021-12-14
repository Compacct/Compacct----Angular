import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import {CompacctGetDistinctService } from "../../../shared/compacct.services/compacct-get-distinct.service"
import * as moment from "moment";
declare var $:any;
import * as XLSX from 'xlsx';
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { ActivatedRoute } from '@angular/router';
import { Console } from 'console';

@Component({
  selector: 'app-tender-harbauer-view',
  templateUrl: './tender-harbauer-view.component.html',
  styleUrls: ['./tender-harbauer-view.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TenderHarbauerViewComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = "Create";
  filterByList = []
  Objsearch = new search();
  TenderSerachFormSubmit = false;
  financalList = [];
  tenderOrgList = [];
  TypeList = [];
  privGovt = [];
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems :CompacctGetDistinctService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Tender View (GOVT.)",
      Link: "Project Management -> Tender View (GOVT.)"
    });
    this.filterByList = ['FINANCIAL YEAR','DEPARTMENT',"PRIVATE OR GOVT","TENDER TYPE"];
    this.getFinancial();
    this.GetTenderOrgList();
    this.GetTypeList();
    this.privGovt = ["Private","GOVT"]
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){

  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){

  }
  changeFilterBy(){
    console.log("this.Objsearch.Filter1_Text",this.Objsearch.Filter1_Text);
    if(this.Objsearch.Filter1_Text === "FINANCIAL YEAR"){
      
    }
    else if(this.Objsearch.Filter1_Text === "DEPARTMENT"){
          
    }
    else if(this.Objsearch.Filter1_Text === "TENDER TYPE"){
          
    }
    else {
      
    }
  }
  getFinancial(){
    this.$http
    .get("Common/Get_Fin_Year")
    .subscribe((data: any) => {
      this.financalList = data ? JSON.parse(data) : [];
    });
  }
  GetTenderOrgList() {
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Organization_Json")
      .subscribe((data: any) => {
        this.tenderOrgList = data ? JSON.parse(data) : [];
      });
  }
  GetTypeList() {
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Type_Json")
      .subscribe((data: any) => {
        this.TypeList = data ? JSON.parse(data) : [];
      });
  }
}
class search{
  Filter1_Text:string;
  Filter1_Data_Value:string;
}