import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';


@Component({
  selector: 'app-tuto-sales-tree-inside-sales',
  templateUrl: './tuto-sales-tree-inside-sales.component.html',
  styleUrls: ['./tuto-sales-tree-inside-sales.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoSalesTreeInsideSalesComponent implements OnInit {

  CreateFieldModal = false;
  CreateFieldModalFormSubmitted = false;
  CreateFieldModalTitle = '';

  ObjSaleField = new SalesTreeField();
  DistrictList = [];
  IntroducerList = [];

  TreeDataList: TreeNode[];
  loading = false;
  layoutString = 'vertical'
  CurrentNode:any;
  selectedFile: TreeNode;
  @ViewChild("location", { static: false }) locationInput: ElementRef;
  IntroducerTitle:string;
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Sales Team Inside Sales",
      Link: " Channel Sale -> Sales Team Inside Sales"
    });
    console.log('gg');
    this.GetAllWBdistrict();
    this.GetTreeData();
  }
  getAddressOnChange(e) {
    this.ObjSaleField.School_Location = undefined;
   if (e) {
      this.ObjSaleField.School_Location = e;
   }
  }
  GetAllWBdistrict() {
    this.$http
      .get("/Master_Cost_Center_V2/Get_District?statename=WEST BENGAL")
      .subscribe((data: any) => {
        this.DistrictList = data ? JSON.parse(data) : [];
      });
  }
  stateDistrictChange(pin) {
    this.ObjSaleField.District = undefined;
    if (pin.length === 6) {
      this.$http
        .get("/Master_Cost_Center_V2/Get_State_District_Against_PIN?PIN=" + pin)
        .subscribe((data: any) => {
          if(data) {
            this.ObjSaleField.District = JSON.parse(data)[0].Districtname;
          }
        });
    }
  }
  GetIntroducerList(SupDeptName){
    this.IntroducerList = [];
    const obj = {
      "SP_String": "Tutopia_Sales_Tree_Field_And_Inside_SP",
      "Report_Name_String": "Get_Introducer_Dropdown",
      "Json_1_String": JSON.stringify([{Sub_Dept_Name : SupDeptName}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log(data);
      data.forEach(element => {
        element['label'] = element.Member_Name;
        element['value'] = element.Member_ID;
      });
      this.IntroducerList = data;
      this.CreateFieldModal = true;
    });
  } 

   // GET TREE
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
  nodeSelect(event) {
   console.log(event.node.label);
  }
  nodeUnselect(event) {
    console.log(event.node.label);
  }
   GetTreeData(){
    this.loading = true;
    const obj = {
     "SP_String": "SP_Tree_New",
     "Report_Name_String": "Member Tree TS",
     "Json_Param_String": JSON.stringify([{"User_ID": this.$CompacctAPI.CompacctCookies.User_ID,"MEM_Type" : 'sales'}])
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


  OpenSaleFieldModal(type,obj?) {
    this.ClearData();
    this.ObjSaleField.Member_ID = '0';
    this.ObjSaleField.Intro_Member_ID = '0';
    this.ObjSaleField.Member_ID = '0';
    this.ObjSaleField.Sales_Type = undefined;
    this.IntroducerTitle = undefined;
    if(type === 'LEAD MANAGER') {      
      this.IntroducerTitle = 'Admin';
    }
    if(type === 'RM') {      
      this.IntroducerTitle = 'LEAD MANAGER';
    }
    if(type === 'SALES HEAD') {      
      this.IntroducerTitle = 'RM';
    }
    if(type === 'TELE SALES') {      
      this.IntroducerTitle = 'SALES HEAD';
    }
    if(obj) {
      this.ObjSaleField = obj;
      this.ObjSaleField.Sales_Type = type;
      this.GetIntroducerList(type);
    } else {
      this.CreateFieldModalTitle = type;
      this.ObjSaleField.Sales_Type = type;
      this.GetIntroducerList(type);
    }
  }
  SaveUpdateField (valid) {
    this.CreateFieldModalFormSubmitted = true;
    if(valid) {
      const obj = {
        "SP_String": "Tutopia_Sales_Tree_Field_And_Inside_SP",
        "Report_Name_String": "Create_Sales_Tree",
        "Json_1_String": JSON.stringify([this.ObjSaleField])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Column1) {
          let Type:String = this.ObjSaleField.Sales_Type;
          this.ClearData();
          this.GetTreeData();
          this.CreateFieldModal = false;         
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: ''+ Type,
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
  ClearData() {  
    this.ObjSaleField = new SalesTreeField();
    this.CreateFieldModalFormSubmitted = false;
    this.IntroducerList = [];

    if(this.locationInput) {
      this.locationInput.nativeElement.value = '';
    }  
  }

}

class SalesTreeField {
  Member_ID:String;   
  Member_Name:String;
  School_Location:String;
  School_Address:String;
  District :String;
  PIN_Code:String;
  User_Name:String;
  Password :String;
  Sales_Type :String;
  Intro_Member_ID:String;
}
