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
  selector: 'app-tuto-master-salesteam',
  templateUrl: './tuto-master-salesteam.component.html',
  styleUrls: ['./tuto-master-salesteam.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoMasterSalesteamComponent implements OnInit {

  TreeDataList: TreeNode[];
  loading = false;
  layoutString = 'vertical'
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Loan Confirmation",
      Link: " Channel Sale -> Loan Confirmation"

    });
    this.GetTreeData();
  }
  expandAll(){
    this.TreeDataList.forEach( node => {
        this.expandRecursive(node, true);
    } );
  }
  collapseAll(){
      this.TreeDataList.forEach( node => {
          this.expandRecursive(node, false);
      } );
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

  // GET TREE

  GetTreeData(){
    this.loading = true;
    const obj = {
     "SP_String": "SP_Tree_New",
     "Report_Name_String": "Member Tree",
     "Json_Param_String": JSON.stringify([{"MEM_ID": "18","MEM_Type" : "channelsales"}])
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
  }


}
