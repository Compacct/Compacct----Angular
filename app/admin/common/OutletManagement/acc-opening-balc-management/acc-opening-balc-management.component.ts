import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Data } from '@angular/router';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { flatMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-acc-opening-balc-management',
  templateUrl: './acc-opening-balc-management.component.html',
  styleUrls: ['./acc-opening-balc-management.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class AccOpeningBalcManagementComponent implements OnInit, OnDestroy {
  
  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndexToView = 0;
  items = []; 
  Spinner = false;
  seachSpinner = false;
  buttonname = "Save";

  ACOpeningBalcSearhFormSubmitted = false;
  SearchCost_Cen_ID = undefined;
  SearchFinyearID = undefined;
  ACOpeningBalcFormSubmitted = false;
  ObjACbalc = new ACbalc();
  FinyearList =[];
  CostCenterList = [];
  LedgerList = [];
  SubLedgerList = [];
  CostHeadList = [];

  ACOpeningBalcList = [];
  DRAmt_Total:any = 0;
  CRAmt_Total:any = 0;
  AllAcOpeningBalc = [];
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService
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
    this.GetFinyearList();
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  GetAllAcOpeningBalc(valid){
    this.ACOpeningBalcSearhFormSubmitted = true;
    if(valid) {
      this.seachSpinner = true;
      const tempObj = {
        // Cost_Cen_ID : this.SearchCost_Cen_ID,
        Fin_Year_ID : this.SearchFinyearID,
      }
      const obj = {
        "SP_String": "SP_Opening_Journal",
        "Report_Name_String": "Get_Opening_Journal_Data",
        "Json_Param_String": JSON.stringify([tempObj])
       }
       this.GlobalAPI.getData(obj)
       .pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
         this.AllAcOpeningBalc = data;
         this.seachSpinner = false;
       })
    }
    
  }

  GetFinyearList() {
    this.$http.get('/Common/Get_Fin_Year').pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.FinyearList =  data ? JSON.parse(data) : [];
      this.FinyearList.forEach(v => v.Fin_Year_ID += '');
      this.SearchFinyearID = this.$CompacctAPI.CompacctCookies.Fin_Year_ID.toString();
      console.log(this.SearchFinyearID)
    });
  }
  GetCostCenter(){
    const obj = {
      "SP_String": "SP_Opening_Journal",
      "Report_Name_String": "GET_Cost_Cent_Name",
     }
     this.GlobalAPI.getData(obj).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
      data.forEach((val, index)=>{
        data[index].label = val.Location;
        data[index].value = val.Cost_Cen_ID;
      });
       this.CostCenterList = data;
      //  this.SearchCost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      //  this.GetAllAcOpeningBalc(true);
     })
  }
  GetLedgerList(){
    const obj = {
      "SP_String": "SP_Opening_Journal",
      "Report_Name_String": "GET_Ledger",
     }
     this.GlobalAPI.getData(obj).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
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
        this.GlobalAPI.getData(obj).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
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
     this.GlobalAPI.getData(obj).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
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
    this.ObjACbalc.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.ObjACbalc.Fin_Year_ID = this.$CompacctAPI.CompacctCookies.Fin_Year_ID.toString();
    this.ACOpeningBalcList = []; 
    this.getCRDR();
    this.buttonname = 'Create';
  }
  AddACBal(valid) {
    this.ACOpeningBalcFormSubmitted = true;
    if(valid){
      if(this.ACOpeningBalcList.length === 0) {
        this.ACOpeningBalcFormSubmitted = false;
        this.ObjACbalc.DR_Amt = Number(this.ObjACbalc.DR_Amt ? this.ObjACbalc.DR_Amt : '0');
        this.ObjACbalc.CR_Amt = Number(this.ObjACbalc.CR_Amt ? this.ObjACbalc.CR_Amt : '0');
        this.ACOpeningBalcList.push(this.ObjACbalc);
        this.getCRDR();
        const obj = {...this.ObjACbalc};
        this.ObjACbalc = new ACbalc();
        this.ObjACbalc.Cost_Cen_ID = obj.Cost_Cen_ID;
        this.ObjACbalc.Ledger_ID = obj.Ledger_ID;
        this.ObjACbalc.Fin_Year_ID = obj.Fin_Year_ID;      
        const arr = $.grep(this.LedgerList,(ob:any) => Number(ob.Ledger_ID) === Number(this.ObjACbalc.Ledger_ID));
        this.ObjACbalc.Ledger_Name = arr.length ? arr[0].Ledger_Name : undefined;
      }else {
        const arr = $.grep(this.ACOpeningBalcList,(ob:any) =>{
          return (Number(ob.Cost_Cen_ID) === Number(this.ObjACbalc.Cost_Cen_ID) 
                && Number(ob.Ledger_ID) === Number(this.ObjACbalc.Ledger_ID)  
                && Number(ob.Fin_Year_ID) === Number(this.ObjACbalc.Fin_Year_ID) 
                && Number(ob.Sub_Ledger_ID) === Number(this.ObjACbalc.Sub_Ledger_ID))
          });
          if(arr.length) {
            this.compacctToast.clear();
            this.compacctToast.add({
            key: "compacct-toast",
            severity: "warn",
            summary: "Validation",
            detail: "Openig Balc Already Exits."
          });
          } else {
            this.ACOpeningBalcFormSubmitted = false;
            this.ObjACbalc.DR_Amt = Number(this.ObjACbalc.DR_Amt ? this.ObjACbalc.DR_Amt : '0');
            this.ObjACbalc.CR_Amt = Number(this.ObjACbalc.CR_Amt ? this.ObjACbalc.CR_Amt : '0');
            this.ACOpeningBalcList.push(this.ObjACbalc);
            this.getCRDR();
            const obj = {...this.ObjACbalc};
            this.ObjACbalc = new ACbalc();
            this.ObjACbalc.Cost_Cen_ID = obj.Cost_Cen_ID;
            this.ObjACbalc.Ledger_ID = obj.Ledger_ID;
            this.ObjACbalc.Fin_Year_ID = obj.Fin_Year_ID;      
            const arr = $.grep(this.LedgerList,(ob:any) => Number(ob.Ledger_ID) === Number(this.ObjACbalc.Ledger_ID));
            this.ObjACbalc.Ledger_Name = arr.length ? arr[0].Ledger_Name : undefined;
          }

      }
        
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
   this.DRAmt_Total = (DR_Amt_Total).toFixed(2);
   this.CRAmt_Total = (CR_Amt_Total).toFixed(2);
  }

  SaveACOpeningBalc(){
    if(this.ACOpeningBalcList.length && this.DRAmt_Total === this.CRAmt_Total){
        const obj = {
          "SP_String": "SP_Opening_Journal",
          "Report_Name_String": "Save_Opening_Journal",
          "Json_Param_String": JSON.stringify(this.ACOpeningBalcList)
        }
        this.GlobalAPI.getData(obj).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
          if(data[0].Column1){
            this.buttonname = "Save";
          this.compacctToast.clear();
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "A/c Opening Balance",
           detail: this.buttonname = 'Create' ? "Succesfully Created" : "Succesfully Updated"
         });
         this.clearData();
         this.SearchCost_Cen_ID = this.SearchCost_Cen_ID ? this.SearchCost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
         this.SearchFinyearID = this.SearchFinyearID ? this.SearchFinyearID : this.$CompacctAPI.CompacctCookies.Fin_Year_ID.toString();
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
  EditACOpeningBal(obj) {
    console.log(obj)
    this.buttonname = 'Create';
    if(obj){
      
      this.ngxService.start();
      const obj1 = {
        "SP_String": "SP_Opening_Journal",
        "Report_Name_String": "Get_Opening_Journal_Data_For_Edit",
        "Json_Param_String": JSON.stringify([{'Fin_Year_ID': obj.Fin_Year_ID}]) //'Cost_Cen_ID' : obj.Cost_Cen_ID, 
      }
      this.GlobalAPI.getData(obj1).pipe(takeUntil(this.destroy$)).subscribe((data:any)=>{
        console.log(data)
        const temp = data ? data : [];
        this.ACOpeningBalcList = [...temp];
        this.getCRDR();
        const obj = {...this.ACOpeningBalcList[0]};
        this.ObjACbalc = new ACbalc();
        this.ObjACbalc.Cost_Cen_ID = obj.Cost_Cen_ID;
        this.ObjACbalc.Ledger_ID = obj.Ledger_ID;
        this.ObjACbalc.Fin_Year_ID = obj.Fin_Year_ID.toString();      
        const arr = $.grep(this.LedgerList,(ob:any) => Number(ob.Ledger_ID) === Number(this.ObjACbalc.Ledger_ID));
        this.ObjACbalc.Ledger_Name = arr.length ? arr[0].Ledger_Name : undefined;
        this.buttonname = 'Update';
        setTimeout(() => {        
          this.items = ["Browse", "Update"];  
          this.tabIndexToView = 1;
          this.ngxService.stop();
        }, 800);

      })
    }
  }
  exportoexcel(tempobj,fileName){
    const obj = {
      "SP_String": "SP_Opening_Journal",
      "Report_Name_String": "Download_Journal",
      "Json_Param_String": JSON.stringify([{Fin_Year_ID : tempobj.Fin_Year_ID}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      XLSX.writeFile(workbook, fileName+'.xlsx');
      
    })
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
