import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tuto-asp-max-appo',
  templateUrl: './tuto-asp-max-appo.component.html',
  styleUrls: ['./tuto-asp-max-appo.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoAspMaxAppoComponent implements OnInit {
  AspMaxAppoList = [];
  BackupAspMaxAppoList = [];
  seachSpinner = false;
  addSpinner = false;
  viewData:any = [];
  viewpopUp = false;
  initDate = [];
  productList = [];
  TxnID = undefined;
  DistDistributorName = [];
  SelectedDistDistributorName = [];
  DistAspName = [];
  SelectedDistAspName = [];
  SearchFields = [];

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "ASP Max Appo",
      Link: "CRM Master -> General -> ASP Max Appo"
    });
    this.GetAspMaxAppolist();
  }
  GetAspMaxAppolist() {
    this.seachSpinner = true;
    const obj = {
        "SP_String": "SP_Asp_Max_Appo",
        "Report_Name_String": "Get_Asp_Max_Appo_List"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
          this.AspMaxAppoList = data.length ? data : [];
          this.BackupAspMaxAppoList = data;
          this.GetDistinct();
          this.seachSpinner = false;
          console.log('AspMaxAppoList ==', this.AspMaxAppoList)
    });
  }
  // DISTINCT & FILTER
  GetDistinct() {
    let DDistributorName = [];
    let DAspName = [];
    this.DistDistributorName =[];
    this.SelectedDistDistributorName =[];
    this.DistAspName =[];
    this.SelectedDistAspName =[];
    this.SearchFields =[];
    this.AspMaxAppoList.forEach((item) => {
   if (DDistributorName.indexOf(item.Distributor_Name) === -1) {
    DDistributorName.push(item.Distributor_Name);
   this.DistDistributorName.push({ label: item.Distributor_Name, value: item.Distributor_Name });
   }
  if (DAspName.indexOf(item.ASP_Name) === -1) {
    DAspName.push(item.ASP_Name);
    this.DistAspName.push({ label: item.ASP_Name, value: item.ASP_Name });
    }
  });
     this.BackupAspMaxAppoList = [...this.AspMaxAppoList];
  }
  FilterDist() {
    let DDistributorName = [];
    let DAspName = [];
    this.SearchFields =[];
  if (this.SelectedDistDistributorName.length) {
    this.SearchFields.push('Distributor_Name');
    DDistributorName = this.SelectedDistDistributorName;
  }
  if (this.SelectedDistAspName.length) {
    this.SearchFields.push('ASP_Name');
    DAspName = this.SelectedDistAspName;
  }
  this.AspMaxAppoList = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupAspMaxAppoList.filter(function (e) {
      return (DDistributorName.length ? DDistributorName.includes(e['Distributor_Name']) : true)
      && (DAspName.length ? DAspName.includes(e['ASP_Name']) : true)
    });
  this.AspMaxAppoList = LeadArr.length ? LeadArr : [];
  } else {
  this.AspMaxAppoList = [...this.BackupAspMaxAppoList] ;
  }
  }
  UpdateAspMaxAppo (objAsp){
    if(objAsp.Member_ID && objAsp.ASP_Max_Appo && objAsp.ASP_CC_List_ID) {
      const tempObj = {
        Member_ID : objAsp.Member_ID,
        ASP_Max_Appo : objAsp.ASP_Max_Appo,
        ASP_CC_List_ID : objAsp.ASP_CC_List_ID
      }
     const obj = {
      "SP_String": "SP_Asp_Max_Appo",
      "Report_Name_String": "Update_BL_CRM_Master_SalesTeam",
      "Json_Param_String": JSON.stringify([tempObj])
     }
     this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           // console.log(data);
            if(data[0].Column1 === "done") {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: 'Member ID : ' + objAsp.Member_ID,
                detail: "Succesfully Updated."
              });
              this.GetAspMaxAppolist();
              //this.dataforregeneratingbill(true);
              //this.GetViewData(true);
            }else{
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Error",
                detail: "Error Occured"
              });
            }
      });
    }
    else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Error Occured"
      });
    }
  }
  onReject(){}
  onConfirm(){}

}
