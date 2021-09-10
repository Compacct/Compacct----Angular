import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: 'app-master-uom',
  templateUrl: './master-uom.component.html',
  styleUrls: ['./master-uom.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MasterUomComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  menuList = [];
  AllCostcenterList = [];
  uomFormSubmitted = false;
  Spinner = false;
  uomId : number ;
  matchDisplay = false;
  buttonname = "Create";
  ObjUom : uom = new uom ();
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Master UOM",
      Link: " Material Management -> Master -> Master UOM"
    });

    this.GetAlldata();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  onConfirm(){
     console.log("this.uomId ",this.uomId);
     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String":"Delete - UOM",
      "Json_Param_String": JSON.stringify([{UOM_Id : this.uomId}]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("data ==",data[0].Column1);
      if (data[0].Column1 === "Done"){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "UOM Delete Succesfully",
          detail: "Succesfully Delete"
        });
        }
        this.GetAlldata();
       });

  }
  onReject() {
    this.compacctToast.clear("c");
  }
  clearData(){
    this.uomFormSubmitted = false;
   this.ObjUom = new uom();
  }
 GetAlldata(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String":"Browse - UOM",
    
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  this.AllCostcenterList = data;
   console.log("this.AllCostcenterList",this.AllCostcenterList);
  });
 }
 uomMaster(valid){
  this.uomFormSubmitted = true;
  
  if (valid) {
    const ctrl = this;
    console.log(ctrl.ObjUom)
    const DuplicateFlag = $.grep(ctrl.AllCostcenterList,function(item){return (item.UOM.toUpperCase() === ctrl.ObjUom.UOM.toUpperCase()) && (item.PRI_ALT.toUpperCase() === ctrl.ObjUom.PRI_ALT.toUpperCase())});
    if(!DuplicateFlag.length) {
      if(this.ObjUom.UOM_Id){
        console.log("Update");
        const obj = {
          "SP_String": "SP_Controller_Master",
          "Report_Name_String":"Update UOM",
          "Json_Param_String": JSON.stringify([this.ObjUom]) 
         }
         this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          console.log("data ==",data[0].Column1);
          if (data[0].Column1 === "done"){
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "UOM Update Succesfully",
              detail: "Succesfully Updated"
            });
            }
            this.Spinner = false;
            this.GetAlldata();
            this.tabIndexToView = 0;
            this.items = ["BROWSE", "CREATE"];
            this.buttonname = "Create";
         
          });
      }
      else {
        console.log("Save");
        const obj = {
          "SP_String": "SP_Controller_Master",
          "Report_Name_String":"Add UOM",
          "Json_Param_String": JSON.stringify([this.ObjUom]) 
         }
         this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          console.log("data ==",data[0].Column1);
          
          if (data[0].Column1){
            this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "UOM Added",
             detail: "Succesfully Created"
           });
           }
           this.clearData();
           this.GetAlldata();
          });
      }
    } else {
         this.compacctToast.clear();
         this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Pr Validation ",
          detail: "Product Already Exits."
        });
      this.clearData();
    }
  
  
  }

 }
 EditUom(uom){
  if (uom.UOM_Id) {
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.clearData();
    this.GetEditMasterUom(uom.UOM_Id);
  }
 }
 GetEditMasterUom(UOM_Id){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String":"Get - UOM Data for Edit",
    "Json_Param_String": JSON.stringify([{UOM_Id : UOM_Id}]) 
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    const editList = data[0] ;
    console.log("editList===",editList);
    this.ObjUom = editList ;
     console.log("this.ObjUom===",this.ObjUom);
     console.log("this.ObjUom.UOM_Id===",this.ObjUom.UOM_Id);
     

    });

 }
 DeleteUom(masterUom){
   this.uomId = undefined ;
   if(masterUom.UOM_Id){
       this.uomId = masterUom.UOM_Id ;
       this.compacctToast.clear();
       this.compacctToast.add({
         key: "c",
         sticky: true,
         severity: "warn",
         summary: "Are you sure?",
         detail: "Confirm to proceed"
       });
     }

 }
Gobrowse(){
            this.Spinner = false;
            this.matchDisplay = false
            this.GetAlldata();
            this.tabIndexToView = 0;
            this.items = ["BROWSE", "CREATE"];
            this.buttonname = "Create";
}
}

class uom {
  UOM_Id = 0;
  UOM : any ;
  PRI_ALT : string ;
}
