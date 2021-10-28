import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService, SelectItem } from "primeng/api";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctGetDistinctService } from '../../../../shared/compacct.services/compacct-get-distinct.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private router : Router,
    private $CompacctAPI: CompacctCommonApi,
    private distService : CompacctGetDistinctService
  ) { 
    this.route.queryParams.subscribe((val:any) => {
      this.QueryStringUserID = undefined;
      if(val.UserID) {
        this.QueryStringUserID = val.UserID;
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
  }


  TabClick(e){
    console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["LIST", "STATUS"];
    this.buttonname = "Create";
    this.clearData();

  }
  // GET
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
      this.FilterColLeadList = this.TableLeadList.length ? Object.keys(this.TableLeadList[0]) : [];
      const FilterArr = this.distService.GetMultipleDistinct(this.BackupLeadList,['Org_Name','Status','Assign_To_Name']);
      this.LeadFilterList = FilterArr[0];
      this.StatusFilterList = FilterArr[1];
      this.AssignToFilterList = FilterArr[2];
      console.log(this.LeadList)
    })

  } 
  GlobalFilterChange1 () {
    let searchFields = [];
    let LeadFilter = [];
    let StatusFilterList = [];
    let AssignToFilterList = [];
    if (this.SelectedLeadFilterList1.length) {
      searchFields.push('Org_Name');
      LeadFilter = this.SelectedLeadFilterList1;
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