import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Data } from '@angular/router';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-acc-opening-balc-management',
  templateUrl: './acc-opening-balc-management.component.html',
  styleUrls: ['./acc-opening-balc-management.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class AccOpeningBalcManagementComponent implements OnInit {
  tabIndexToView = 0;
  items = []; 
  Spinner = false;
  seachSpinner = false;
  buttonname = "Save";

  ACOpeningBalcSearhFormSubmitted = false;
  SearchCost_Cen_ID = undefined;
  ACOpeningBalcFormSubmitted = false;
  ObjACbalc = new ACbalc();
  CostCenterList = [];
  LedgerList = [];
  SubLedgerList = [];
  CostHeadList = [];

  ACOpeningBalcList = [];
  DRAmt_Total = 0;
  CRAmt_Total = 0;
  AllAcOpeningBalc = [];
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.items = ["Browse", "Create"];
    this.Header.pushHeader({
      Header: "Account Opening Balance Mangement",
      Link: "Mangement -> Account Opening Balance Mangement"

    });
    this.GetCostCenter();
    this.GetLedgerList();
    this.GetCostHeadList();
  }
 
  GetAllAcOpeningBalc(valid){
    this.ACOpeningBalcSearhFormSubmitted = true;
    if(valid) {
      this.seachSpinner = true;
      const tempObj = {
        Cost_Cen_ID : this.SearchCost_Cen_ID,
        Fin_Year_ID : this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
      }
      const obj = {
        "SP_String": "SP_Opening_Journal",
        "Report_Name_String": "Get_Opening_Journal_Data",
        "Json_Param_String": JSON.stringify([tempObj])
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.AllAcOpeningBalc = data;
         this.seachSpinner = false;
       })
    }
    
  }
  GetCostCenter(){
    const obj = {
      "SP_String": "SP_Opening_Journal",
      "Report_Name_String": "GET_Cost_Cent_Name",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach((val, index)=>{
        data[index].label = val.Location;
        data[index].value = val.Cost_Cen_ID;
      });
       this.CostCenterList = data;
       this.SearchCost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
       this.GetAllAcOpeningBalc(true);
     })
  }
  GetLedgerList(){
    const obj = {
      "SP_String": "SP_Opening_Journal",
      "Report_Name_String": "GET_Ledger",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach((val, index)=>{
        data[index].label = val.Ledger_Name;
        data[index].value = val.Ledger_ID;
      });
       this.LedgerList = data;
     })
  }
  GetSubLedgerList(){
    this.SubLedgerList = [];
    this.ObjACbalc.Sub_Ledger_ID = undefined;
    this.ObjACbalc.Ledger_Name = undefined;
     if(this.ObjACbalc.Ledger_ID) {
      const arr = $.grep(this.LedgerList,(ob:any) => Number(ob.Ledger_ID) === Number(this.ObjACbalc.Ledger_ID));
      this.ObjACbalc.Ledger_Name = arr.length ? arr[0].Ledger_Name : undefined;
        const obj = {
          "SP_String": "SP_Opening_Journal",
          "Report_Name_String": "GET_Sub_Ledger",
          "Json_Param_String": JSON.stringify([{'Ledger_ID' : this.ObjACbalc.Ledger_ID}])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          data.forEach((val, index)=>{
            data[index].label = val.Sub_Ledger_Name;
            data[index].value = val.Sub_Ledger_ID;
          });
          this.SubLedgerList = data;
        })
     }
  }
  GetSubLedgerName() {
    this.ObjACbalc.Sub_Ledger_Name = undefined;
    if(this.ObjACbalc.Sub_Ledger_ID) {
      const arr = $.grep(this.SubLedgerList,(ob:any) =>  Number(ob.Sub_Ledger_ID) === Number(this.ObjACbalc.Sub_Ledger_ID));
      this.ObjACbalc.Sub_Ledger_Name = arr.length ? arr[0].Sub_Ledger_Name : undefined;
    }
  }
  GetCostHeadList(){
    const obj = {
      "SP_String": "SP_Opening_Journal",
      "Report_Name_String": "GET_Cost_Head",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach((val, index)=>{
        data[index].label = val.Cost_Head_Name;
        data[index].value = val.Cost_Head_ID;
      });
       this.CostHeadList = data;
     })
  }
  GetCostHeadName() {
    this.ObjACbalc.Cost_Head_Name = undefined;
    if(this.ObjACbalc.Cost_Head_ID) {
      const arr = $.grep(this.CostHeadList,(ob:any) =>  Number(ob.Cost_Head_ID) === Number(this.ObjACbalc.Cost_Head_ID));
      this.ObjACbalc.Cost_Head_Name = arr.length ? arr[0].Sub_Ledger_Name : undefined;
    }
  }

  onReject() {
    this.compacctToast.clear("c");
  }
  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["Browse", "Create"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData(){
    this.ACOpeningBalcFormSubmitted = false;
    this.ObjACbalc = new ACbalc();
    this.ACOpeningBalcList = []; 
    this.getCRDR();
  }
  AddACBal(valid) {
    this.ACOpeningBalcFormSubmitted = true;
    if(valid){
        this.ACOpeningBalcFormSubmitted = false;
        this.ObjACbalc.Fin_Year_ID = this.$CompacctAPI.CompacctCookies.Fin_Year_ID;
        this.ObjACbalc.DR_Amt = Number(this.ObjACbalc.DR_Amt ? this.ObjACbalc.DR_Amt : '0');
        this.ObjACbalc.CR_Amt = Number(this.ObjACbalc.CR_Amt ? this.ObjACbalc.CR_Amt : '0');
        this.ACOpeningBalcList.push(this.ObjACbalc);
        this.getCRDR();
        const obj = {...this.ObjACbalc};
        this.ObjACbalc = new ACbalc();
        this.ObjACbalc.Cost_Cen_ID = obj.Cost_Cen_ID;
        this.ObjACbalc.Ledger_ID = obj.Ledger_ID;      
        const arr = $.grep(this.LedgerList,(ob:any) => Number(ob.Ledger_ID) === Number(this.ObjACbalc.Ledger_ID));
        this.ObjACbalc.Ledger_Name = arr.length ? arr[0].Ledger_Name : undefined;
      }
      
  }

  ChangeDr() {
    this.ObjACbalc.CR_Amt = 0;
  }
  ChangeCr() {
    this.ObjACbalc.DR_Amt = 0;
  }
  Delete(index) {
    this.ACOpeningBalcList.splice(index,1);
    this.getCRDR();
  
  }
  getCRDR(){
    this.DRAmt_Total = 0;
    this.CRAmt_Total = 0;
    let DR_Amt_Total =0,CR_Amt_Total = 0;
    for (let i  = 0; i < this.ACOpeningBalcList.length; i++){
      DR_Amt_Total  += Number(this.ACOpeningBalcList[i].DR_Amt);
      CR_Amt_Total  += Number(this.ACOpeningBalcList[i].CR_Amt);
   }
   this.DRAmt_Total = DR_Amt_Total;
   this.CRAmt_Total = CR_Amt_Total;
  }

  SaveACOpeningBalc(){
    this.ACOpeningBalcFormSubmitted = true;
    if(this.ACOpeningBalcList.length && this.DRAmt_Total === this.CRAmt_Total){
        const obj = {
          "SP_String": "SP_Opening_Journal",
          "Report_Name_String": "Save_Opening_Journal",
          "Json_Param_String": JSON.stringify(this.ACOpeningBalcList)
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          if(data[0].Column1){
            this.buttonname = "Save";
          this.compacctToast.clear();
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "A/c Opening Balance",
           detail: "Succesfully Created"
         });
         this.clearData();
         this.GetAllAcOpeningBalc(true);
        }
        })
        
      }else{
       if(this.DRAmt_Total !== this.CRAmt_Total) {
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "warn",
         summary: "Validation",
         detail: "DR is not Equal to CR Amount."
       });
       }
      }
  }


}
class ACbalc {
  Fin_Year_ID:string;	 
Cost_Cen_ID:string;		 
Project_ID:string;						
Ledger_ID:string;						
Sub_Ledger_ID:string;					 
Cost_Head_ID:string;	
DR_Amt:Number;				
CR_Amt:Number;
Sub_Ledger_Name:String;
Ledger_Name:String;
Cost_Head_Name:String;
}
