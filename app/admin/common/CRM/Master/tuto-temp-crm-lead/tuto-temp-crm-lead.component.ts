import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Data } from '@angular/router';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import {TreeNode} from 'primeng/api';
@Component({
  selector: 'app-tuto-temp-crm-lead',
  templateUrl: './tuto-temp-crm-lead.component.html',
  styleUrls: ['./tuto-temp-crm-lead.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoTempCrmLeadComponent implements OnInit {
  tabIndexToView = 0;
  items = [];

  PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink = undefined;
  ProductPDFFile:any = {};
  LeadListRerturned = [];
  LeadListFromFile = [];
  Campaign_ID = undefined;
  CampaignList = [];
  List_ID = undefined;
  ListsList = [];
  ListsListBackup = [];

  FormSubmitFlag = false;
  seachSpinnersave = false;
  LeadUpdated = 0;
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
      Header: "New Leads Upload",
      Link: " CRM -> New Leads Upload"
    });
    this.GetCampaignList();
    this.GetListsList();
  }
  GetCampaignList() {
    this.CampaignList = [];
    const headers = new HttpHeaders().set('Content-Type', 'text/html; charset=utf-8')
    this.$http.get("/Tutoipa_BL_CRM_Temp_To_New_Lead/Get_Campaign", {headers: headers}).subscribe((res: any) => {
      console.log(res)
      this.CampaignList = res.length ? res : [];
    });
  }
  GetListsList() {
    this.ListsListBackup = [];
    this.$http.get("/Tutoipa_BL_CRM_Temp_To_New_Lead/Get_List").subscribe((res: any) => {
      this.ListsListBackup = res.length  ? res : [];
    });
  }
  CampaignChange() {
    this.List_ID = undefined;
    this.ListsList = [];
    if(this.Campaign_ID) {
      this.ListsList = this.ListsListBackup.filter(el=> el.campaign_id.toString() === this.Campaign_ID.toString());
    }
  }
   // CSV
   handleFileSelect(event) {
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    this.LeadListRerturned = [];
    this.LeadListFromFile = [];
    if (event) {
      console.log(event)
      this.ProductPDFFile = event.files[0];
      this.PDFFlag = true;
      var reader : any = new FileReader();
      console.log(reader)
      const ctrl = this;
      reader.onload = function(e){
        console.log(e)
          var fileData = reader.result;
          var wb = XLSX.read(fileData, {type : 'binary'});

          wb.SheetNames.forEach(function(sheetName){
            ctrl.LeadListFromFile =XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
            console.log(ctrl.LeadListFromFile);
          })
      };
      reader.readAsBinaryString(event.files[0]);
  }
}
  SaveLeadJSON(valid) {
    this.LeadListRerturned = [];
    this.LeadUpdated = 0;
    this.FormSubmitFlag = true;
    if(valid && this.ProductPDFFile['size']) {
      // this.seachSpinnersave = true;
      this.LeadListFromFile.forEach(el=>{
        el['campaign_id'] = this.Campaign_ID,
        el['list_id'] = this.List_ID,
        el.Mobile = String(el.Mobile) === "undefined" ? null : String(el.Mobile);
        el.Mobile_Whatsup = String(el.Mobile_Whatsup) === "undefined" ? null : String(el.Mobile_Whatsup);
        el.ALT_Mobile = String(el.ALT_Mobile) === "undefined" ? null :  String(el.ALT_Mobile);
        el.Contact_Name = String(el.Contact_Name) === "undefined" ? null :  String(el.Contact_Name);
        el.Address = String(el.Address) === "undefined" ? null :  String(el.Address);
        el.Landmark = String(el.Landmark) === "undefined" ? null :  String(el.Landmark);
        el.City = String(el.City) === "undefined" ? null :  String(el.City);
        el.Pin = String(el.Pin) === "undefined" ? null :  String(el.Pin);
        el.State = String(el.State) === "undefined" ? null :  String(el.State);
        el.Country = String(el.Country) === "undefined" ? null :  String(el.Country);
        el.Class_Name_Dump = String(el.Class_Name_Dump) === "undefined" ? null :  String(el.Class_Name_Dump);
        el.School_Dump = String(el.School_Dump) === "undefined" ? null :  String(el.School_Dump);
      });
      console.log(this.LeadListFromFile);
      const obj = {
        "SP_String": "SP_BL_CRM_Temp_To_New_Lead",
        "Report_Name_String": "Save_Temp_To_New_Lead",
        "Json_Param_String":JSON.stringify(this.LeadListFromFile),
        "Json_1_String": "NA",
        "Json_2_String":"NA",
        "Json_3_String":"NA",
        "Json_4_String":"NA"
      }
      this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All').subscribe((data) => {
        this.LeadListRerturned = data;
        this.saveToTutopiaApp();
        console.log(this.LeadListRerturned)
        
        });
    }
    if(!this.ProductPDFFile['size']) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Validation",
        detail: "No Docs Selected"
      });
    }
  }
  saveToTutopiaApp () {
    if(this.LeadListRerturned.length) {
      this.$http.post("/Tutoipa_BL_CRM_Temp_To_New_Lead/Insert_Result",{getjson : JSON.stringify(this.LeadListRerturned)}).subscribe((res: any) => {
        console.log(res)
        this.LeadUpdated = res;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: 'Upload',
          detail: "Succesfully Uploaded."
        });
      });
    }
  }
  // EXPORT TO EXCEL
  exportexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }

}
