import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tuto-sale-tree-field',
  templateUrl: './tuto-sale-tree-field.component.html',
  styleUrls: ['./tuto-sale-tree-field.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoSaleTreeFieldComponent implements OnInit {
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
  EditFlag = false;
  EditDistributorObj:any = {};
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Sales Tree Field Sales",
      Link: " Channel Sale -> Sales Tree Field Sales"
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
      if(this.EditDistributorObj && this.EditDistributorObj.Intro_Member_ID) {
        this.ObjSaleField.Intro_Member_ID = this.EditDistributorObj.Intro_Member_ID;
      }
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
    this.EditFlag = false;
    this.EditDistributorObj = {};
    if(event.node.Sub_Dept === "DISTRIBUTOR"){
      this.EditFlag = true;
      this.EditDistributorObj ={...event.node};
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c4",
        sticky: true,
        severity: "warn",
        summary: "",
        closable : true,
        detail: ""
      });
     // this.OpenSaleFieldModal(event.node.Sub_Dept, event.node)
    }
    if(event.node.Sub_Dept === "ZONAL HEAD"){
      this.EditDistributorObj ={...event.node};
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c4",
        sticky: true,
        severity: "warn",
        summary: "",
        closable : true,
        detail: ""
      });
    }
   }
   nodeUnselect(event) {
     console.log(event.node.label);
   }
   GetTreeData(){
    this.loading = true;
    const obj = {
     "SP_String": "SP_Tree_New",
     "Report_Name_String": "Member Tree ASP",
     "Json_Param_String": JSON.stringify([{"User_ID": this.$CompacctAPI.CompacctCookies.User_ID,"MEM_Type" : 'channelsales'}])
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

  onReject() {
    this.compacctToast.clear("c4");
  }

  InactiveZonalHead(obj) {
    if(obj.Member_ID) {
      const obj1 = {
        "SP_String": "Tutopia_Sales_Tree_Field_And_Inside_SP",
        "Report_Name_String": "Edit_Zonal_Head_Inactive",
        "Json_1_String": JSON.stringify([{'Member_ID' : obj.Member_ID}])
      }
      this.GlobalAPI.getData(obj1).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Column1) {
          let Type:String = this.ObjSaleField.Sales_Type;
          this.EditDistributorObj = {};
          this.ClearData();
          this.GetTreeData();
          this.compacctToast.clear('c4');
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: '' + Type,
            detail:  "Inactived Succesfully "
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
  OpenSaleFieldModal(type,obj?) {
    this.ClearData();
    this.ObjSaleField.Member_ID = '0';
    this.ObjSaleField.Intro_Member_ID = '0';
    this.ObjSaleField.Member_ID = '0';
    this.ObjSaleField.Sales_Type = undefined;
    this.IntroducerTitle = undefined;
    this.EditDistributorObj = obj ? obj : {};
    if(type === 'Zonal Head') {      
      this.IntroducerTitle = 'Channel Head';
    }
    if(type === 'ASP') {      
      this.IntroducerTitle = 'Distributor';
    }
    if(type === 'School') {      
      this.IntroducerTitle = 'ASP';
    }
    if(type === 'DISTRIBUTOR') {      
      this.IntroducerTitle = 'Zonal Head';
    }
    if(this.EditDistributorObj && this.EditDistributorObj.Intro_Member_ID) {
      this.ObjSaleField.Member_ID = this.EditDistributorObj.Intro_Member_ID;
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
      const reportName = this.EditFlag ? 'Edit_Distributor_Introducer' : 'Create_Sales_Tree'
      const obj = {
        "SP_String": "Tutopia_Sales_Tree_Field_And_Inside_SP",
        "Report_Name_String": reportName,
        "Json_1_String": JSON.stringify([this.ObjSaleField])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Column1) {
          let Type:String = this.ObjSaleField.Sales_Type;
          this.EditFlag = false;
          this.EditDistributorObj = {};
          this.ClearData();
          this.GetTreeData();
          this.CreateFieldModal = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: '' + Type,
            detail:  "Succesfully Created"
          });
          this.onReject();

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
  Contact_Name:String;
  School_Location:String;
  School_Address:String;
  District :String;
  PIN_Code:String;
  User_Name:String;
  Password :String;
  Sales_Type :String;
  Intro_Member_ID:String;
}