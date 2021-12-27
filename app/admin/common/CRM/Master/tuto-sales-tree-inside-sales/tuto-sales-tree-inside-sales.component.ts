import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Data } from '@syncfusion/ej2-angular-grids';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
  SubDeptList = [];

  TreeDataList: TreeNode[];
  loading = false;
  layoutString = 'vertical'
  CurrentNode:any;
  selectedFile: TreeNode;
  @ViewChild("location", { static: false }) locationInput: ElementRef;
  IntroducerTitle:string;

  UserNameDisabled = false;
  SaveFlag = true;
  ShowDisabled = undefined;
  ShowForward = false;
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Sales Team Inside Sales",
      Link: " Channel Sale -> Sales Team Inside Sales"
    });
    this.GetAllWBdistrict();
    this.GetTreeData();
    this.GetSubDeptList();
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
  GetSubDeptList(){
    this.SubDeptList = [];
    const obj = {
      "SP_String": "Tutopia_Inside_sales_Team_Update_SP",
      "Report_Name_String": "Get_Tele_Sales_Group"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.SubDeptList = data;
    });
  } 
  GetIntroducerList(SupDeptName,edit?){
    this.IntroducerList = [];
    SupDeptName = SupDeptName.includes('- GROUP') ? 'TELE SALES' : SupDeptName;
    const obj = {
      "SP_String": "Tutopia_Sales_Tree_Field_And_Inside_SP",
      "Report_Name_String": "Get_Introducer_Dropdown",
      "Json_1_String": JSON.stringify([{Sub_Dept_Name : SupDeptName}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(element => {
        element['label'] = element.Member_Name;
        element['value'] = element.Member_ID;
      });
      this.IntroducerList = data;
      this.CreateFieldModal = edit && edit.Member_ID ? false : true;
      edit && edit.Member_ID ? this.GetEditData(edit) : null;
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
   console.log(event.node);
   if(event.node.Member_ID) {
    this.ngxService.start();
    const obj = {
      "SP_String": "Tutopia_Inside_sales_Team_Update_SP",
      "Report_Name_String": "Retrieve_Sales_Head_OR_Tele_Sales",
      "Json_1_String": JSON.stringify([{Member_ID : event.node.Member_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log(data);
      if(data.length) {
        const type = data[0].Sub_Dept_Name;
        const openField = type.includes('TELE SALES') ? true : type.includes('SALES HEAD') ? true : false;
        openField ? this.OpenSaleFieldModal(type,event.node) : this.ngxService.stop(); 
      } else{
        this.ngxService.stop();
      }
    });
   }
  }
  nodeUnselect(event) {
    console.log(event.node.label);
  }
   GetTreeData(){
    this.loading = true;
    this.ngxService.start();
    const obj = {
     "SP_String": "SP_Tree_New",
     "Report_Name_String": "Member Tree TS",
     "Json_Param_String": JSON.stringify([{"User_ID": this.$CompacctAPI.CompacctCookies.User_ID,"MEM_Type" : 'sales'}])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ConvertChildParent(data);
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
    this.loading = false;
    this.TreeDataList = roots;
    this.ngxService.stop();
    this.expandAll();
  }


  OpenSaleFieldModal(type,obj?) {
    this.ClearData();
    this.ObjSaleField.Member_ID = '0';
    this.ObjSaleField.Intro_Member_ID = '0';
    this.ObjSaleField.Member_ID = '0';
    this.ObjSaleField.Sales_Type = undefined;
    this.IntroducerTitle = undefined;
    this.SaveFlag = true;
    this.UserNameDisabled = false;
    this.ShowDisabled = undefined;
    if(type === 'LEAD MANAGER') {      
      this.IntroducerTitle = 'Admin';
    }
    if(type === 'RM') {      
      this.IntroducerTitle = 'LEAD MANAGER';
    }
    if(type === 'SALES HEAD') {      
      this.IntroducerTitle = 'RM';
    }
    if(type === 'TELE SALES' || type.includes('- GROUP')) {      
      this.IntroducerTitle = 'SALES HEAD';
    }
    if(obj) {
      this.ObjSaleField = obj;
      this.ObjSaleField.Sales_Type = type;
      this.SaveFlag = false;
      this.UserNameDisabled = true;
      this.CreateFieldModalTitle = type;
      this.GetIntroducerList(type,obj);
    } else {
      this.CreateFieldModalTitle = type;
      this.ObjSaleField.Sales_Type = type;
      this.SaveFlag = true;
      this.UserNameDisabled = false;
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
    
    this.SaveFlag = true;
    this.UserNameDisabled = false;
    this.ShowDisabled = undefined;

    if(this.locationInput) {
      this.locationInput.nativeElement.value = '';
    }  
  }

  // EDIT
  GetEditData(temp){
    if(temp.Member_ID){
      const obj = {
        "SP_String": "Tutopia_Inside_sales_Team_Update_SP",
        "Report_Name_String": "Retrieve_Sales_Head_OR_Tele_Sales",
        "Json_1_String": JSON.stringify([{Member_ID : temp.Member_ID}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log(data);
        this.ObjSaleField.Member_Name = data[0].Member_Name;
        this.ObjSaleField.Password =  data[0].Password;
        this.ObjSaleField.User_Name =  data[0].User_Name;
        this.ObjSaleField.Sub_Dept_ID = data[0].Sub_Dept_ID;
        this.UserNameDisabled = data[0].Sub_Dept_Name.includes('TELE SALES') ? false : true;
        this.CreateFieldModal = true;
        this.ngxService.stop();
      });
    }
  }
  ForwardDisableActive(){
    if(this.ShowDisabled ==='Forward') {
      const type = this.ObjSaleField.Sales_Type.includes('TELE SALES') ? 'SALES HEAD' : '';
      if(type === 'SALES HEAD') {      
        this.IntroducerTitle = 'RM';
        this.GetIntroducerList(type);
      }
    }
  }
  ForwardUser(MID,INMID) {
    if(MID && INMID) {
      const TEMP = {
        Member_ID : MID,
        Intro_Member_ID : INMID
      }
      const obj = {
        "SP_String": "Tutopia_Inside_sales_Team_Update_SP",
        "Report_Name_String": "Edit_Tele_Sales_To_Sales_Head",
        "Json_1_String": JSON.stringify([TEMP])
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
            detail:  "Succesfully Disabled"
          });

        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            life : 6000,
            summary: "Validation Message",
            detail: "Sorry , There is one or More TELE SALES under this SALES HEAD."
          });
        }

      })
    }
  }
  UpdateField(valid) {
    this.CreateFieldModalFormSubmitted = true;
    if(valid) {
      const tempObj = {
        Member_ID : this.ObjSaleField.Member_ID,              		    
        Intro_Member_ID : this.ObjSaleField.Intro_Member_ID,     
        Member_Name  : this.ObjSaleField.Member_Name,   
        User_Name : this.ObjSaleField.User_Name,        			
        Password : this.ObjSaleField.Password,
        Sub_Dept_ID : this.ObjSaleField.Sub_Dept_ID,
      }
      const obj = {
        "SP_String": "Tutopia_Inside_sales_Team_Update_SP",
        "Report_Name_String": "Edit_Tele_Sales_OR_Sales_Head_Introducer",
        "Json_1_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Column1 === 'Done') {
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
            detail:  data[0].Column1 ? data[0].Column1 : "Error Occured "
          });
        }

      })
  }
  }
  DisableUser(memberId) {
    if(memberId) {
      const obj = {
        "SP_String": "Tutopia_Inside_sales_Team_Update_SP",
        "Report_Name_String": "Disable_Sales_Head_Inactive",
        "Json_1_String": JSON.stringify([{Member_ID : memberId}])
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
            detail:  "Succesfully Disabled"
          });

        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            life : 6000,
            summary: "Validation Message",
            detail: "Sorry , There is one or More TELE SALES under this SALES HEAD."
          });
        }

      })
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
  Sub_Dept_ID:String;
}
