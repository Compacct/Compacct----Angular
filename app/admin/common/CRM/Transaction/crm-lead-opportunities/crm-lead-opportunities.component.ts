import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService, SelectItem } from "primeng/api";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctGetDistinctService } from '../../../../shared/compacct.services/compacct-get-distinct.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DateNepalConvertService } from '../../../../shared/compacct.global/dateNepal.service';
declare var NepaliFunctions: any;
@Component({
  selector: 'app-crm-lead-opportunities',
  templateUrl: './crm-lead-opportunities.component.html',
  styleUrls: ['./crm-lead-opportunities.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CrmLeadOpportunitiesComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  buttonname = "Create";
  Spinner = false;
  LeadcreationFormSubmitted = false;
  LeadList = [];
  BackupLeadList = [];
  TableLeadList = [];
  from_date:any;
  to_date:any;
  seachSpinner = false;
  ObjLeadcreation: Leadcreation = new Leadcreation();

  StatusList = [];
  DisplayGridStatusList = [];
  LeadFilterList =[];
  StatusFilterList = [];
  AssignToFilterList = [];

  SelectedLeadFilterList1 = [];
  SelectedLeadDateFilterList1 = [];
  SelectedStatusFilterList1 = [];
  SelectedAssignToFilterList1 = [];

  SelectedLeadFilterList2 = [];
  SelectedStatusFilterList2 = [];
  SelectedGridStatusFilterList2 = [];
  SelectedAssignToFilterList2 = [];
  cars: [];
  selectedCar: [];
  displayDialog: boolean;
  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string;
  sortOrder: number;
  QueryStringUserID = undefined;
  FilterColLeadList = [];
  GridLoader = false;

  url = window["config"];
  leadtransation = new Lead();
  snipper = false;
  leadtransactionSubmit = false;
  ExistingLead = undefined;

  LeadStatusList = [];
  LeadDateFilterList = [];
  EnqSourceModel = [];
  customertype = [];
  ReferencebyCustomer = [];
  user=[];
  LeadDateNepal = new Date();
  autocomplete:any;
  ProductTypeLists = [];
  SelectedProductTypeList = [];
  
  TaskToDate = new Date();  
  TaskFromDate = new Date();
  SubjectList = [];
  LeadCreateModal = false;

  FromQueryString = false;
  clms = [];
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private router : Router,
    public $CompacctAPI: CompacctCommonApi,
    private distService : CompacctGetDistinctService,
    private DateNepalConvertService : DateNepalConvertService,
  ) { 
    this.route.queryParams.subscribe((val:any) => {
      this.QueryStringUserID = undefined;
      this.FromQueryString = false;
      if(val.UserID) {
        this.QueryStringUserID = val.UserID;
        this.FromQueryString = true;
        this.GetAllLead();
      } else {
        this.QueryStringUserID = this.$CompacctAPI.CompacctCookies.User_ID;
        this.FromQueryString = false;
        this.GetAllLead();
      }
    } );

  }

  ngOnInit() {
    this.items =  ["LIST", "STATUS"];
    this.Header.pushHeader({
      Header: "All Opportunities",
      Link: " CRM -> Transaction -> All Opportunities"
    });
    this.GetStatuslist();
   // this.GetAllLead();
    this.sortOptions = [
      {label: 'Newest First', value: '!year'},
      {label: 'Oldest First', value: 'year'},
      {label: 'Brand', value: 'brand'}
  ];
  this.GetSubject();
  this.GetProductTypeLists();
  this.GetUser();
  this.GetStatuslist();
  this.GetEnqSrc();
  this.Getcustomertype();
  this.GetReferencebyCustomer();

  this.clms = [
    { field: 'Org_Name', header: 'Company Name' },
    { field: 'Lead_Date', header: 'Lead Date' },
    { field: 'Contact_Name', header: 'Contact Person' },
    { field: 'Mobile', header: 'Phone' },
    { field: 'Email', header: 'Email' },
    { field: 'Phone', header: 'Mobile' },
    { field: 'Address', header: 'Address' },
    { field: 'Status', header: 'Sales Stage' },
    { field: 'Enq_Source_Name', header: 'Source' },
    { field: 'StatAssign_To_Nameus', header: 'Assigned To' }
  ];
  }


  TabClick(e){
    console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["LIST", "STATUS"];
    this.buttonname = "Create";
    this.clearData();

  }
  ReturnNepaliDate (engDate) {
    if (engDate) {
        const EngDateObj = {
            'year': new Date(engDate).getFullYear(),
            'month': new Date(engDate).getMonth() + 1,
            'day': new Date(engDate).getDate()
        }
        const NepaliDateObj = NepaliFunctions.AD2BS(EngDateObj);
        const FormattedNepaliDate = NepaliFunctions.ConvertDateFormat(NepaliDateObj, "DD/MM/YYYY");
        return FormattedNepaliDate;
    } else {
        return '-';
    }
}
  // GET
  GetSubject() {
    const objj = {
      "SP_String": "SP_New_Lead_Registration",
      "Report_Name_String" : "Get_Lead_Task_Subjects"
    }
    this.GlobalAPI.postData(objj)
        .subscribe((data: any) => {
          this.SubjectList = data;
        });
  }
  GetUser() {
    this.$http
       .get('/BL_CRM_Master_SalesTeam/Get_Sales_Man_for_napal')
       .subscribe((data: any) => {
           this.user = data.length ? data : [];
      
       });
  }
  GetEnqSrc() {
    this.$http
       .get(this.url.apiGetEnquerySource)
       .subscribe((data: any) => {
           this.EnqSourceModel = data.length ? data : [];
      
       });
  }
  Getcustomertype() {
    this.$http
        .get(this.url.apiGetCustomerType)
        .subscribe((data: any) => {
            this.customertype = data.length ? data : [];
        
        });
  }
  GetReferencebyCustomer() {
    this.$http
        .get("/Common/Get_Master_Accounting_Sub_Ledger_Report?User_ID=" + this.$CompacctAPI.CompacctCookies.User_ID)
        .subscribe((res: any) => {
          const data = res ? JSON.parse(res) : [];
          data.forEach(it=> {
            it['value'] = it.Sub_Ledger_ID;
            it['label'] = it.Sub_Ledger_Name;
          })
            this.ReferencebyCustomer = data.length ? data : [];
        
        });
  }
  GetProductTypeLists() {
    this.$http.get('/Master_Product_Type/Master_Product_Type_Browse')
        .subscribe((res: any) => {
          const data =  res ? JSON.parse(res) : [];
          data.forEach(it=> {
            it['value'] = it.Product_Type_ID;
            it['label'] = it.Product_Type;
          })
          this.ProductTypeLists = data;
        });
  }
  GetStatuslist() {
    const objj = {
    "SP_String": "SP_New_Lead_Registration",
    "Report_Name_String" : "Get_Lead_Status"
  }
  this.GlobalAPI.postData(objj)
      .subscribe((data: any) => {
        data.sort(function(a, b) { 
          return a.Status_ID - b.Status_ID  ||  a.Status.localeCompare(b.Status);
        });
        data.map(i=> {
          i['value'] = i.Status;
          i['label'] = i.Status;
        })
        this.StatusList = data;
        this.LeadStatusList = data;
        this.DisplayGridStatusList = data;

      });
  }
  GetStatusWiseColor(status) {
    if(status === 'Prospecting'){
      return 'bg-red-gradient';
    }
    if(status === 'First Meeting'){
      return 'bg-aqua-active';
    }
    if(status === 'Nurturing'){
      return 'bg-green-gradient';
    }
    if(status === 'Proposal'){
      return 'bg-yellow-active';
    }
    if(status === 'Won'){
      return 'bg-primary';
    }
    if(status === 'Closed Lost'){
      return 'bg-red';
    }
    if(status === 'Negotiation'){
      return 'bg-fuchsia-active';
    }
  }
 // FOR SEARCH
  GetAllLead(){    
    this.LeadList = [];
    this.BackupLeadList = [];
    this.TableLeadList = [];
    const obj = {
      "SP_String": "SP_New_Lead_Registration",
      "Report_Name_String": "Get_Leads_with_Assign_To",
      "Json_Param_String": '[{"Assign_To":'+this.QueryStringUserID+'}]'
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log(data);
      this.LeadList = data;
      this.BackupLeadList = data;
      this.TableLeadList = data;
      for(let i = 0; i < this.TableLeadList.length ; i++){
        this.TableLeadList[i]['Lead_Date'] = this.ReturnNepaliDate(this.TableLeadList[i]['Lead_Date']);
     }  
      this.FilterColLeadList = this.TableLeadList.length ? Object.keys(this.TableLeadList[0]) : [];
      const FilterArr = this.distService.GetMultipleDistinct(this.BackupLeadList,['Org_Name','Lead_Date','Status','Assign_To_Name']);
      this.LeadFilterList = FilterArr[0];
      this.LeadDateFilterList = FilterArr[1];
      this.StatusFilterList = FilterArr[2];
      this.AssignToFilterList = FilterArr[3];
      console.log(this.LeadList)
    })

  } 
  GlobalFilterChange1 () {
    let searchFields = [];
    let LeadFilter = [];
    let LeadDateFilter = [];
    let StatusFilterList = [];
    let AssignToFilterList = [];
    if (this.SelectedLeadFilterList1.length) {
      searchFields.push('Org_Name');
      LeadFilter = this.SelectedLeadFilterList1;
    }    
    if (this.SelectedLeadDateFilterList1.length) {
      searchFields.push('Lead_Date');
      LeadDateFilter = this.SelectedLeadDateFilterList1;
    } 
    if (this.SelectedStatusFilterList1.length) {
      searchFields.push('Status');
      StatusFilterList = this.SelectedStatusFilterList1;
    } 
    if (this.SelectedAssignToFilterList1.length) {
      searchFields.push('Assign_To_Name');
      AssignToFilterList = this.SelectedAssignToFilterList1;
    } 
    const ctrl = this;
    this.TableLeadList = [];
    if (searchFields.length) {
      const ctrl = this;
      const LeadArr = this.BackupLeadList.filter(function (e) {
        return ((LeadFilter.length ? LeadFilter.includes(e['Org_Name']) : true) 
        && (LeadDateFilter.length ?  LeadDateFilter.includes(e['Lead_Date']) : true)
        && (StatusFilterList.length ?  StatusFilterList.includes(e['Status']) : true)
        && (AssignToFilterList.length ?  AssignToFilterList.includes(e['Assign_To_Name']) : true)
        );
      });
      this.TableLeadList = LeadArr.length ? LeadArr : [];
    } else {
      this.TableLeadList = this.BackupLeadList;
    }
  }
  GlobalFilterChange2 () {
    let searchFields = [];
    let LeadFilter = [];
    let StatusFilterList = [];
    let AssignToFilterList = [];
    let GridStatusFilterList = [];
    this.DisplayGridStatusList = [];
    this.GridLoader = true;
    if (this.SelectedLeadFilterList2.length) {
      searchFields.push('Org_Name');
      LeadFilter = this.SelectedLeadFilterList2;
    }    
    if (this.SelectedStatusFilterList2.length) {
      searchFields.push('Status');
      StatusFilterList = this.SelectedStatusFilterList2;
    } 
    if (this.SelectedAssignToFilterList2.length) {
      searchFields.push('Assign_To_Name');
      AssignToFilterList = this.SelectedAssignToFilterList2;
    } 
    if(this.SelectedGridStatusFilterList2.length) {
      GridStatusFilterList = this.SelectedGridStatusFilterList2;
      const LeadArr = this.StatusList.filter(function (e) {
        return ((GridStatusFilterList.length ? GridStatusFilterList.includes(e['Status']) : true));
      });
      this.DisplayGridStatusList = LeadArr.length ? LeadArr : [];
      this.DisplayGridStatusList.sort(function(a, b) { 
        return a.Status_ID - b.Status_ID  ||  a.Status.localeCompare(b.Status);
      });
    } else {
      this.StatusList.sort(function(a, b) { 
        return a.Status_ID - b.Status_ID  ||  a.Status.localeCompare(b.Status);
      });
      this.DisplayGridStatusList = this.StatusList;
    }
    const ctrl = this;
    this.LeadList = [];
    if (searchFields.length) {
      const ctrl = this;
      const LeadArr = this.BackupLeadList.filter(function (e) {
        return ((LeadFilter.length ? LeadFilter.includes(e['Org_Name']) : true) 
        && (StatusFilterList.length ?  StatusFilterList.includes(e['Status']) : true)
        && (AssignToFilterList.length ?  AssignToFilterList.includes(e['Assign_To_Name']) : true)
        );
      });
      this.LeadList = LeadArr.length ? LeadArr : [];
    } else {
      this.LeadList = this.BackupLeadList;
    }
    this.GridLoader = false;
  }
  getStatusWIseList(obj){
    if(obj.Status) {
      return this.LeadList.filter(itm => itm.Status === obj.Status);
    }
  }
  clearData() {

    this.LeadcreationFormSubmitted = false;
    this.seachSpinner = false;
    this.Spinner = false;

    this.ObjLeadcreation = new Leadcreation();
    this.ObjLeadcreation.Country_Code = "India";




    //this.ObjCostcenter.Cost_Cen_ID = this.tmp_Cost_Cen_ID;
  }

  // Lead CREATE
  
  ChnageReferencebyCustomer = function (subledgerID) {
    this.leadtransation.Sub_Ledger_ID_Ref = undefined;
    if (subledgerID) {
      this.leadtransation.Sub_Ledger_ID_Ref = subledgerID;
    }
    else {
      this.leadtransation.Sub_Ledger_ID_Ref = 0;
    }
  }
  getAddressOnChange(e) {
    this.leadtransation.Address = undefined;
  if (e) {
      this.leadtransation.Address = e;
  }
  }
  Cleardata3 () {
    this.leadtransation.Existing_Name = undefined;
  }

  openLeadModal() { 
  this.leadtransation = new Lead();
  this.snipper = false;
  this.leadtransactionSubmit = false;
  this.ExistingLead = undefined;
  this.LeadDateNepal = new Date();
  this.autocomplete = '';
  this.SelectedProductTypeList = [];
  this.LeadCreateModal = true;
  }
  saveLead(valid) {
    this.leadtransactionSubmit = true;
    if(valid) {
     // this.snipper = true;
      let custTypeList = this.SelectedProductTypeList;
      this.leadtransation.Existing = this.ExistingLead;
      this.leadtransation.Next_Followup = this.DateService.dateTimeConvert(new Date());
      this.leadtransation.Lead_Date = this.DateService.dateTimeConvert(new Date(this.LeadDateNepal));
      this.leadtransation.Product_Type_IDs = custTypeList.length ? "," + custTypeList.toString() + "," : '';
      this.leadtransation.Followup_Remarks = 'NA';
      this.leadtransation.Followup_Remarks = 'NA';
      this.leadtransation.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      this.leadtransation.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.leadtransation.Status = 'Prospecting';
      const obj = {
        "SP_String": "SP_New_Lead_Registration",
        "Report_Name_String": "New Lead Create",
        "Json_Param_String": JSON.stringify([this.leadtransation])
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Column1) {
          this.saveTask(data[0].Column1);
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "error",
            detail: "Error Occured"
          });
          this.snipper = false;
          
        }
    }); 
  }
  }
  saveTask(id) {
    if (id) {
      const tempObj = {
        User_ID: this.leadtransation.User_ID,
        Remarks: "Lead Task",
        Start_Date: this.DateService.dateConvert(new Date(this.TaskFromDate)),
        End_Date: this.DateService.dateConvert(new Date(this.TaskToDate)),
        Foot_Fall_ID: id,
        Sub_Ledger_ID :0,
        Status: 'Lead_Pending',
        Type: 'CRM',
        Lead_Status:'Lead_Pending',
        Visit_Type:'Pending',
        Contact_Txn_ID: 0,
        Contact_Name:'',
        Contact_No: '',
        Contact_Email:'',
        Subject_ID: this.leadtransation.Subject_ID,
        Priority: this.leadtransation.Task_Priority,
        Agent_Name: this.user.filter(e => e.User_ID ==this.leadtransation.Assign_To)[0].Member_Name,
        Agent_User_ID: this.leadtransation.Assign_To
      }
      const obj = {
        "SP_String": "SP_New_Lead_Registration",
        "Report_Name_String": "New Task Create",
        "Json_Param_String": JSON.stringify([tempObj]),
        "Json_1_String": "NA",
        "Json_2_String": "NA",
        "Json_3_String": "NA",
        "Json_4_String": "NA"
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Column1) {
          this.GetAllLead();
          this.leadtransactionSubmit = false;
          this.leadtransation = new Lead();
          this.snipper = false;
          this.ExistingLead = undefined;
          this.LeadDateNepal = new Date();
          this.autocomplete = '';
          this.SelectedProductTypeList = [];
          this.LeadCreateModal = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'success',
            detail: "Succesfully Updated."
          });
          this.snipper = false;
        }
       
      })
      // this.objFollowUpCreation.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      // this.objFollowUpCreation.Next_Followup = this.DateService.dateTimeConvert(new Date(this.NxtFollowupDate));
    }
  }
  // SORT   
  onSortChange(event) {
    let value = event.value;
        this.sortOrder = 1;
        this.sortField = value;
  }
  RedirectLeadDetails (data){
    const obj = {
      FootFallID :  data.Foot_Fall_ID,
      UserID :  data.Assign_To,
    }
    const navigationExtras: NavigationExtras = {
      queryParams: obj,
    };
    this.router.navigate(['./BL_CRM_Lead_Details_Nepal'], navigationExtras);
  }
}


class Lead{
  Foot_Fall_ID: 0;
  Cost_Cen_ID: 0;
  Sub_Ledger_ID: 0;
  Mobile:String;
  Phone:String;
  Email:String;
  Contact_Name:String;
  Org_Name:String;
  Dept:String;
  Desig:String;
  Address:String;
  Landmark:String;
  District:String;
  State:String;
  PIN:String;
  Country:String;
  Enq_Source_ID :String;
  User_ID =  0;
  Sub_Ledger_ID_Ref = 0;
  Enq_Chance:String;
  Next_Followup:String;
  Sub_Ledger_Cat_ID:String;
  Recd_Media:String;
  Followup_Remarks:String;
  Status:String;
  Sub_Dept_ID:String;
  Sent_To:String;
  Location:String;
  Landline_Extension:String;
  Chef_Name:String;
  Competitor_Activity:String;
  Customer_Remarks:String;
  Social_Media_Details:String;
Product_Type_IDs:String;
Lead_Date:String;
Lead_Priority :String;
Website:String;
Social_FaceBook_Link:String;
Social_Instagram_Link:String;
Social_Linkedin_Link:String;
Existing :String;
Existing_Name:String;
Existing_ID:String;
Competition_Activity:String;
Assign_To:String;
Is_Visiable =  'Y';
Subject_ID:String;
Task_Priority:String
}
class Leadcreation {
  User_ID = 0;
  Country_Code = 'IN';
  Mobile: number;
  Mobile_Whatsup = '';
  Contact_Name: string;
  School = '';
  Class_ID: any;
  Address = '';
  City: any;
  Pin: string;
  State: string;
  District: string;


}