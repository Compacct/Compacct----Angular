import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import {TreeNode} from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-dipl-master-salesteam',
  templateUrl: './dipl-master-salesteam.component.html',
  styleUrls: ['./dipl-master-salesteam.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DiplMasterSalesteamComponent implements OnInit {

  url = window["config"];
  TreeDataList: TreeNode[];
  loading = false;
  layoutString = 'vertical'
  PincodeList = [];
  QueryStringMemtype:any;
  CurrentNode:any;
  CreateSalesExceModal = false;
  CreateSalesExceFormSubmitted = false;
  ObjSaleExe = new SaleExe();
  UnderTeamList = [];
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService) {
      this.route.queryParams.subscribe(params => {
        console.log(params);
        this.QueryStringMemtype = params['memtype'];
          this.GetTreeData();
          this.GetPincodeList();
          this.GetSupportTypeList();
        })
     }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Channel Sales Team",
      Link: " CRM -> Master -> Channel Sales Team"

    });
  }
  expandAll(){
    this.loading = true;
    this.TreeDataList.forEach( node => {
        this.expandRecursive(node, true);
    } );
    this.loading = false;
  }
  collapseAll(){
    this.loading = true;
      this.TreeDataList.forEach( node => {
          this.expandRecursive(node, false);
      } );
      this.loading = false;
  }
  ToggleView() {
    this.layoutString = this.layoutString === 'vertical' ? 'horizontal' : 'vertical'

  }
  private expandRecursive(node:TreeNode, isExpand:boolean){
      node.expanded = isExpand;
      if (node.children){
          node.children.forEach( childNode => {
              this.expandRecursive(childNode, isExpand);
          } );
      }
  }
  GetSelectedMember(e) {
  this.CurrentNode = undefined;
    if(e.label) {
      this.CurrentNode = e;
    }
  }
  GetSupportTypeList() {
    this.$http.get('/BL_CRM_Master_SalesTeam/GetAllData?memtype='+this.QueryStringMemtype).subscribe((data: any) => {
      this.UnderTeamList = JSON.parse(data);
    });
  }
  // GET TREE

  GetTreeData(){
    this.loading = true;
    const obj = {
     "SP_String": "SP_Tree_New",
     "Report_Name_String": "Member Tree",
     "Json_Param_String": JSON.stringify([{"User_ID": this.$CompacctAPI.CompacctCookies.User_ID,"MEM_Type" : this.QueryStringMemtype}])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("tree",data);
     this.ConvertChildParent(data)

    })

  }
  ConvertChildParent(data) {
    var map = {}, node, roots = [], i;

    for (i = 0; i < data.length; i += 1) {
      map[data[i].Member_ID] = i; // initialize the map
      data[i].children = []; // initialize the children
    }

    for (i = 0; i < data.length; i += 1) {
      data[i].expandedIcon = "pi pi-user-minus",
      data[i].collapsedIcon = "pi pi-user-plus",
      data[i].label = data[i].Member_Name;
      node = data[i];
      if (node.Intro_Member_ID !== 0) {
        node.icon = "pi pi-user";
        data[map[node.Intro_Member_ID]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    console.log(roots) ;
    this.loading = false;
    this.TreeDataList = roots;
    this.expandAll();
  }
  // GET PIN
  GetPincodeList(){
    this.PincodeList = [];
    if(this.QueryStringMemtype === 'channelsales') {
      const obj = {
        "Report_Name": "get_dist_pin_code",
        "Json_Param_String":  JSON.stringify([{ 'User_ID': this.$CompacctAPI.CompacctCookies.User_ID}])
      }
      this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        console.log("tree",data);
        this.PincodeList = data.length ? data : [];

      })
    }
  }
  // CREAT SALE EXCE
  SaleExcModal() {
    this.CreateSalesExceFormSubmitted = false;
    this.ObjSaleExe = new SaleExe();
    this.ObjSaleExe.Intro_User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.CreateSalesExceModal = true;

  }
  InsertSalesExe(valid) {
    this.CreateSalesExceFormSubmitted = true;
    if(valid && this.ObjSaleExe.Intro_User_ID) {
      const obj = {
        "Report_Name": "Sales Executive Create",
        "Json_Param_String":  JSON.stringify([this.ObjSaleExe])
      }
      this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Column1) {
          this.GetTreeData();
          this.CreateSalesExceFormSubmitted = false;
          this.ObjSaleExe = new SaleExe();
          this.CreateSalesExceModal = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Sales Executive",
            detail:  "Succesfully Created"
          });

        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }

      })
    }
  }
}
class SaleExe{
  Name:string;
  User_Mobile:string;
  Password:string;
  Intro_User_ID:string;
  IS_ACTIVE =  'Y';
}
