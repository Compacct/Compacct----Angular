import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-bl-crm-wp-mst-template',
  templateUrl: './bl-crm-wp-mst-template.component.html',
  styleUrls: ['./bl-crm-wp-mst-template.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BlCRMWPMSTTemplateComponent implements OnInit {
  buttonname: string = "Create";
  tabIndexToView: number = 0;
  items: any = [];
  WhatsAppFormSubmit: boolean = false;
  ObjWhatsap: Whatsap = new Whatsap();
  variable_Name: any = undefined;
  VariableList: any = [];
  AllDataDyn: any = [];
  AllData: any = [];
  T_idCode:any =  undefined;

  constructor(
    private $http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
     this.Header.pushHeader({
      Header:  "Whatsapp Integration Hearing " ,
      Link: "..." 
     });
    this.GetVariable();
    this.getbrowse();
  }  
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.ObjWhatsap = new Whatsap();
    this.variable_Name = undefined;
    this.WhatsAppFormSubmit = false;
  }
  GetVariable() {
    this.VariableList= [];
    const obj = {
      "SP_String": "SP_Bl_CRM_WP_MST_Template",
      "Report_Name_String": "Get_Valiable_dropdown"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{ 
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Valiable_Name,
          element['value'] = element.Valiable_Name
        });
        this.VariableList= data;
         ////console.log("Get Center",data);
      }
    });
  }
  getValue() {
    if (this.variable_Name) {
      this.ObjWhatsap.Template_Text += ` <${(this.variable_Name as HTMLInputElement)}> `
      this.variable_Name = undefined;
    }
  }
  SaveWhatsapp(valid:any) {
    this.WhatsAppFormSubmit = true;
    if (valid) {
      if (this.buttonname === 'Create') {
      const obj = {
    "SP_String": "SP_Bl_CRM_WP_MST_Template",
    "Report_Name_String" : "Insert_WP_MST_Template",
   "Json_Param_String": JSON.stringify([this.ObjWhatsap])
  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    if(data[0].Column1){ 
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Whatsapp Details",
       detail: "Succesfully Save"
      });
      this.getbrowse();
      this.ObjWhatsap = new Whatsap();
      this.WhatsAppFormSubmit = false;
      this.variable_Name = undefined;
      this.tabIndexToView = 0;
      this.items = ["BROWSE", "CREATE"];
         }
       }) 
      }
      
      if (this.buttonname === 'Update') {
        this.ObjWhatsap.Template_ID = this.T_idCode; 
      const obj = {
    "SP_String": "SP_Bl_CRM_WP_MST_Template",
    "Report_Name_String" : "Update_WP_MST_Template",
   "Json_Param_String": JSON.stringify([this.ObjWhatsap])
  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    if(data[0].Column1){ 
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Whatsapp Details",
       detail: "Succesfully Update"
      });
      this.getbrowse();
      this.ObjWhatsap = new Whatsap();
      this.WhatsAppFormSubmit = false;
      this.variable_Name = undefined;
      this.T_idCode = undefined;
      this.tabIndexToView = 0;
      this.items = ["BROWSE", "CREATE"];
         }
       }) 
     }
   }
  }
  getbrowse() {
    this.AllData = [];
    this.AllDataDyn = [];
      const obj = {
      "SP_String":"SP_Bl_CRM_WP_MST_Template",
      "Report_Name_String":"Browse_WP_MST_Template"
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.AllData = data;
       this.AllDataDyn = Object.keys(data[0]);
      //console.log("Browse data==",this.AllData);
      });
  }
  onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("d");
  }
  Edit(T_id:any){
  if (T_id.Template_ID) {
    this.T_idCode = undefined;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.T_idCode = T_id.Template_ID
    this.GetEditMaster(this.T_idCode)
   }  
  }
  GetEditMaster(Uid){
    const obj = {
      "SP_String": "SP_Bl_CRM_WP_MST_Template",
      "Report_Name_String":"Retrieve_WP_MST_Template",
      "Json_Param_String": JSON.stringify([{Template_ID : Uid}]) 
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log("data", data);
      this.ObjWhatsap = data[0];
    })
  }
  Dactive(master) {
    this.T_idCode = undefined;
    if(master.Template_ID){
      this.T_idCode = master.Template_ID ;
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
  onConfirm(){ 
    if(this.T_idCode){
      const obj = {
        "SP_String": "SP_Bl_CRM_WP_MST_Template",
        "Report_Name_String": "Deactive_WP_MST_Template",
        "Json_Param_String": JSON.stringify([{Template_ID : this.T_idCode}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if (data[0].Column1){
          this.getbrowse();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Template_ID: " + this.T_idCode,
            detail: "Succesfully Dactive"
          });
         this.T_idCode = undefined;
        }
      })
    }
  }
  Active(master) {
    this.T_idCode = undefined;
  if(master.Template_ID){
    this.T_idCode = master.Template_ID ;
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "d",
      sticky: true,
      severity: "warn",
      summary: "Are you sure?",
      detail: "Confirm to proceed"
    });
  }

  }
  onConfirm1(){
    if(this.T_idCode){
      const obj = {
        "SP_String": "SP_Bl_CRM_WP_MST_Template",
        "Report_Name_String": "Active_WP_MST_Template",
        "Json_Param_String": JSON.stringify([{Template_ID : this.T_idCode}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if (data[0].Column1){
          this.getbrowse();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Template_ID: " + this.T_idCode,
            detail: "Succesfully Activated"
          });
          this.T_idCode = undefined;
        }
      })
    }
  }
  ChangeDef() {
    if (this.ObjWhatsap.Attachment === 'N'|| this.ObjWhatsap.Attachment === undefined ) {
      this.ObjWhatsap.Attachment_Field = undefined;
    }
     if (this.ObjWhatsap.Button_One_Enabled === 'N'|| this.ObjWhatsap.Button_One_Enabled === undefined ) {
      this.ObjWhatsap.Button_One_Text = undefined;
      this.ObjWhatsap.Button_One_Link = undefined;
    }
     if (this.ObjWhatsap.Button_Two_Enabled === 'N'|| this.ObjWhatsap.Button_Two_Enabled === undefined ) {
      this.ObjWhatsap.Button_Two_Text = undefined;
      this.ObjWhatsap.Button_Two_Link = undefined;
    }
  }
  
}
class Whatsap{
  Event_Description:any;             
  Template_Text:any = '';                
  Attachment: any;  
  Template_ID: any;
  Attachment_Field:any;                
  Button_One_Enabled:any;               
  Button_One_Text:any;                    
  Button_One_Link:any;                    
  Button_Two_Enabled:any;                
  Button_Two_Text:any;                    
  Button_Two_Link:any;                   
  Trigger_Table:any;  
}
