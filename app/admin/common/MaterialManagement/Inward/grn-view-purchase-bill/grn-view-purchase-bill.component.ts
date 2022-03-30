import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-grn-view-purchase-bill',
  templateUrl: './grn-view-purchase-bill.component.html',
  styleUrls: ['./grn-view-purchase-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class GrnViewPurchaseBillComponent implements OnInit {
  searchForm:any = {};
  searchData = [];
  seachSpinner = false;  

  ViewPoppup = false;
  PurcaseBillNo = undefined
  GRNList = [];
  constructor(
    private $http: HttpClient ,
    private commonApi: CompacctCommonApi,   
    private Header: CompacctHeader ,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private $CompacctAPI: CompacctCommonApi,) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "GRN View with Purchase Bill",
      Link: "Material Management -> Transaction -> GRN View with Purchase Bill "
    });
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {   
      this.searchForm.From_Txn_Date = dateRangeObj[0];
      this.searchForm.To_Txn_Date = dateRangeObj[1];
    }
  }
  Search(){  
    this.searchData = [];
    this.seachSpinner = true;
    const From = this.searchForm.From_Txn_Date  ? this.DateService.dateConvert(new Date(this.searchForm.From_Txn_Date)) : this.DateService.dateConvert(new Date());     
    const To = this.searchForm.To_Txn_Date ? this.DateService.dateConvert(new Date(this.searchForm.To_Txn_Date)) : this.DateService.dateConvert(new Date());        
    const temp = {
      Start_Date : From,
      End_Date : To,
    }
    const obj = {
      "SP_String":"SP_GRN_Details",
      "Report_Name_String": "Get_Purchase_Bill_Details",
      "Json_Param_String": JSON.stringify([temp])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.searchData = data ? data : [];
        console.log('searchData res =', this.searchData);
        this.seachSpinner = false;                
    });
  }
  GetGRNList(id){
      this.PurcaseBillNo = undefined;
      if(id) {
      this.PurcaseBillNo = id;
      const tempObj = {
        Purchase_Bill_Doc_No : id,
      }
      const obj = {
        "SP_String": "SP_GRN_Details",
        "Report_Name_String": "Get_GRN_Details_With_Purchase_Bill",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.GRNList = data;
        this.ViewPoppup = true;
        })
      }
    
  }

 // Complete
  CompleteGRN(id) {  
    this.PurcaseBillNo = undefined;
    if(id) {
      this.PurcaseBillNo = id;
      this.compacctToast.clear();
      this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});  
     }
    
  }
  onConfirm() {
    if (this.PurcaseBillNo) {
      const obj = {
        "SP_String":"SP_GRN_Details",
        "Report_Name_String": "Update_GRN_Status_By_Force",
        "Json_Param_String": JSON.stringify([{Purchase_Bill_Doc_No : this.PurcaseBillNo}])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log(data)
          if (data[0].Column1) {
              this.onReject();
              this.compacctToast.clear();
              this.compacctToast.add({
                key: 'compacct-toast',
                severity: 'success',
                detail: 'Succesfully Completed'
              });                              
              this.PurcaseBillNo = {};
              this.Search();
            }
      });
    }
  }
  onReject() {
    this.compacctToast.clear('c');
  }
   
}
