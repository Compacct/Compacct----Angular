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
  from_date:any;
  to_date:any;
  seachSpinner = false;
  ObjLeadcreation: Leadcreation = new Leadcreation();

  StatusList = [];
  LeadFilterList =[];
  SelectedLeadFilterList = [];

  cars: [];
  selectedCar: [];
  displayDialog: boolean;
  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string;
  sortOrder: number;
  QueryStringUserID = undefined;
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
        this.StatusList = data;
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
    const obj = {
      "SP_String": "SP_New_Lead_Registration",
      "Report_Name_String": "Get_Leads_with_Assign_To",
      "Json_Param_String": '[{"Assign_To":'+this.QueryStringUserID+'}]'
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log(data);
      this.LeadList = data;
      this.BackupLeadList = data;
      this.LeadFilterList = this.distService.GetMultipleDistinct(this.BackupLeadList,['Org_Name'])[0];
      console.log(this.LeadList)
    })

  } 
  GlobalFilterChange () {
    let searchFields = [];
    let LeadFilter = [];
    if (this.SelectedLeadFilterList.length) {
      searchFields.push('Org_Name');
      LeadFilter = this.SelectedLeadFilterList;
    }    
    const ctrl = this;
    this.LeadList = [];
    if (searchFields.length) {
      const ctrl = this;
      const LeadArr = this.BackupLeadList.filter(function (e) {
        return ((LeadFilter.length ? LeadFilter.includes(e['Org_Name']) : true)
          );
      });
      this.LeadList = LeadArr.length ? LeadArr : [];
    } else {
      this.LeadList = this.BackupLeadList;
    }
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
      UserID :  data.User_ID,
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