import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGetDistinctService } from '../../../shared/compacct.services/compacct-get-distinct.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tender-budget-aproval',
  templateUrl: './tender-budget-aproval.component.html',
  styleUrls: ['./tender-budget-aproval.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TenderBudgetAprovalComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  menuList = [];
  Spinner = false;
  buttonname = "Create";

  PendinApvList = [];
  AprvBudgetList = [];
  NotAprvBudgetList = [];

  TenderDocID = undefined;
  Aspinner = false;
  Dspinner = false;

  ShowAddedEstimateProductList = [];
  ApproveDisApproveModalFlag = false;
  rowGroupMetadata: any;
  cols = [
    { field: 'SL_No', header: 'SL No.' },
    { field: 'Budget_Group_Name', header: 'Group Name' },
    { field: 'Budget_Sub_Group_Name', header: 'Sub Group Name' },
    { field: 'Work_Details', header: 'Work Details' },
    { field: 'Site_Description', header: 'Site' },
    { field: 'Product_Description', header: 'Product' },
    { field: 'unit', header: 'Unit' },
    { field: 'Qty', header: 'Qty' },
    { field: 'Nos', header: 'Nos' },
    { field: 'TQty', header: 'Total Qty' },
    { field: 'UOM', header: 'UOM' },
    { field: 'saleRate', header: 'Sale Rate' },
    { field: 'Sale_Amount', header: 'Sale Amount' },
    { field: 'Rate', header: 'Purchase Rate' },
    { field: 'Amount', header: 'Purchase Amount' }
];
ViewTenderID = undefined;
viewModel = false;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems :CompacctGetDistinctService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Pre Bid Budget Approval",
      Link: "Project Management -> Pre Bid Budget Approval"
    });
    this.items = ['Pending Approval','Approved Pre Bid Budget','Not Approved Pre Bid Budget'];
    this.GetPendinApvList();
    this.GetAprvBudgetList();
    this.GetNotAprvBudgetList();
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items =  ['Pending Approval','Approved Pre Bid Budget','Not Approved Pre Bid Budget']
    this.clearData();
  }
  clearData(){

  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onReject1() {
    this.compacctToast.clear("c1");
  }


  GetPendinApvList(){
    const tempObj = {
      Send_To : this.commonApi.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Budget_Pending_Approval_Tab",
      "Json_Param_String": JSON.stringify(tempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.PendinApvList = data;
    })
  }
  GetAprvBudgetList(){
    const tempObj = {
      Send_To : this.commonApi.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Approved_Budget_Tab",
      "Json_Param_String": JSON.stringify(tempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.AprvBudgetList = data;
     console.log("SUB",data);
    })
  }
  GetNotAprvBudgetList(){
    const tempObj = {
      Send_To : this.commonApi.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Not_Approved_Budget_Tab",
      "Json_Param_String": JSON.stringify(tempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.NotAprvBudgetList = data;
     console.log("SUB",data);
    })
  }
  // 
  onSort() {
    this.updateRowGroupMetaData();
  }
  updateRowGroupMetaData() {
      this.rowGroupMetadata = {};
      if (this.ShowAddedEstimateProductList) {
          for (let i = 0; i < this.ShowAddedEstimateProductList.length; i++) {
              let rowData = this.ShowAddedEstimateProductList[i];
              let brand = rowData.Budget_Group_Name;
              if (i == 0) {
                  this.rowGroupMetadata[brand] = { index: 0, size: 1 };
              }
              else {
                  let previousRowData = this.ShowAddedEstimateProductList[i - 1];
                  let previousRowGroup = previousRowData.Budget_Group_Name;
                  if (brand === previousRowGroup)
                      this.rowGroupMetadata[brand].size++;
                  else
                      this.rowGroupMetadata[brand] = { index: i, size: 1 };
              }
          }
      }
  }
  getPurchaseAmt(){
    return this.ShowAddedEstimateProductList.reduce((n, {Amount}) => n + Number(Amount), 0).toFixed(2)
  }
  getTotalPurchaseAmt(){
    return this.ShowAddedEstimateProductList.length ? Number(this.ShowAddedEstimateProductList[0].No_of_Site) * this.getPurchaseAmt() : '-';
  }
  getTotalSaleAmt(){
    return this.ShowAddedEstimateProductList.reduce((n, {Sale_Amount}) => n + Number(Sale_Amount), 0).toFixed(2)
  }
  GetEditSingleScheme(){
    this.ShowAddedEstimateProductList = [];
    if(this.TenderDocID) {
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get Data Tender Estimate",
        "Json_Param_String": JSON.stringify([{ 'Tender_Doc_ID': this.TenderDocID }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          if(data.length) {
            this.ShowAddedEstimateProductList = data;
            this.ApproveDisApproveModalFlag = true;
            console.log(data)
          }
        });
    }
  }

  
  viewTender(col:any){
    this.ViewTenderID = undefined;
    if(col.Tender_Doc_ID){
      this.ngxService.start();
     this.ViewTenderID = col.Tender_Doc_ID; 
     setTimeout(()=>{
      this.viewModel = true;
      this.ngxService.stop();
    },1200)
    }
  }
//
  ApproveDisApproveModal(obj) {
    this.TenderDocID = undefined;
    if(obj.Tender_Doc_ID) {
      this.TenderDocID = obj.Tender_Doc_ID;
      this.GetEditSingleScheme();
    }
  }


  
  Approve() {
    if(this.TenderDocID) {
      this.Aspinner = true;
      const saveObj = { Tender_Doc_ID: this.TenderDocID}
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String": "Update_Approve_Budget",
        "Json_Param_String": JSON.stringify(saveObj)
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Column1 === "Update successfully"){  
          this.SavefollowUp('BUDGET APPROVED - TENDER NOT SUBMITTED');  
          
        }
      
      })
    }
  }
  Disapprove(){
    if(this.TenderDocID) {
      this.Dspinner = true;
      const saveObj = { Tender_Doc_ID: this.TenderDocID}
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String": "Update_Disapprove_Budget",
        "Json_Param_String": JSON.stringify(saveObj)
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Column1 === "Update successfully"){   
          this.SavefollowUp('BUDGET NOT APPROVED');
        }
      
      })
    }
  }

  
  SavefollowUp(falg){
    if(this.TenderDocID && falg){
      const saveObj = {
        Tender_Doc_ID: this.TenderDocID,									
				Posted_By: this.commonApi.CompacctCookies.User_ID,							 
				Send_To:	this.commonApi.CompacctCookies.User_ID,						       			
				Status:	falg,
				Remarks: falg
      }
      console.log("follow save",saveObj);
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String": "BL_CRM_Txn_Enq_Tender_Harbauer_Followup_Save",
        "Json_Param_String": JSON.stringify(saveObj)
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("follow up save",data);
        if(data[0].Column1 === "SAVED SUCCESSFULLY"){         
          this.TenderDocID = undefined;
          if(falg ==='BUDGET NOT APPROVED'){
            this.Dspinner = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'Estimate Management ',
              detail: "Succesfully Disapproved."
            });
          }
          if(falg ==='BUDGET APPROVED - TENDER NOT SUBMITTED'){
          this.Aspinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'Estimate Management ',
            detail: "Succesfully Approved."
          });
        }
          this.GetPendinApvList();
          this.GetAprvBudgetList();
          this.GetNotAprvBudgetList();
          this.ApproveDisApproveModalFlag = false;
        }
      
      })
    }
    else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error Occured ",
        detail: "Select Assing "
      });
    }
  }
}
