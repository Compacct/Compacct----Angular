import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import {CompacctGetDistinctService } from "../../../shared/compacct.services/compacct-get-distinct.service"
import * as moment from "moment";
declare var $:any;
import * as XLSX from 'xlsx';
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-harba-project-estimate',
  templateUrl: './harba-project-estimate.component.html',
  styleUrls: ['./harba-project-estimate.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HarbaProjectEstimateComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  menuList = [];
  Spinner = false;
  buttonname = "Create";
  projectEstimateFormFormSubmitted = false
  SiteDescription = "";
  siteTableData:any = []
  siteSubmitted = false;
  GetAllDataList = []
  Objestimate : estimate = new estimate ();
  constructor(private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems :CompacctGetDistinctService) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Project Estimate",
      Link: "Tender Management -> Project_Estimate"
    });
    this.browsedata();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  clearData(){
    this.siteTableData = [];
    this.SiteDescription = undefined;
    this.Objestimate = new estimate();
    this.siteSubmitted = false;
    this.projectEstimateFormFormSubmitted = false;
  }
  
  delete(index) {
    this.siteTableData.splice(index,1)
  }
  addSite(valid){
   this.siteSubmitted = true;
   if(valid){
       const siteCheckData = this.siteTableData.filter(item=> item.Site_Description === this.SiteDescription);
       console.log("siteCheckData",siteCheckData);
       if(!siteCheckData.length){
        this.siteTableData.push({Site_Description : this.SiteDescription});
       this.siteSubmitted = false;
       this.SiteDescription = undefined
       }
       else{
        this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Already Added"
          });
       }
       
   }
 console.log("site data",this.siteTableData);
  }
  SaveProjectEstimate(valid){
    let saveData:any = [];
     this.projectEstimateFormFormSubmitted = true;
     if(valid){
        if(this.siteTableData.length){
            this.siteTableData.forEach(ele => {
               const tempdata = { 
                Project_Description:this.Objestimate.Project_Description,
                Project_Remarks: this.Objestimate.Project_Remarks,
                Order_Received_YN: this.Objestimate.Order_Received_YN,
                Tender_Doc_ID: Number(this.Objestimate.Tender_Doc_ID),
                Order_No: this.Objestimate.Order_No,
                Site_Description: ele.Site_Description
               }
               saveData.push(tempdata);
            });
            console.log("saveData",saveData);
            const obj = {
              "SP_String": "SP_Project_Estimate",
              "Report_Name_String": "Add Project Estimate",
              "Json_Param_String": JSON.stringify(saveData)
            }
            this.GlobalAPI.postData(obj).subscribe((data:any)=>{
              if(data[0].Column1){
                this.compacctToast.clear();
                this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Product Added",
                detail: "Succesfully Created"
              });
                 this.clearData();
                 this.browsedata();
              }
              
            })
             
        }
        else{
          this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Site Description Not be empty"
            });
         }
        this.projectEstimateFormFormSubmitted = false;
     }
  }
  browsedata(){
    const obj = {
      "SP_String": "SP_Project_Estimate",
      "Report_Name_String": "Browse Project Estimate"
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
     console.log("all data",data);
     this.GetAllDataList  = data;
    })
  }

}
class estimate {
    Project_Description:string;
    Project_Remarks:string;
    Order_Received_YN:string;
    Tender_Doc_ID:number;
    Order_No:string;
  }