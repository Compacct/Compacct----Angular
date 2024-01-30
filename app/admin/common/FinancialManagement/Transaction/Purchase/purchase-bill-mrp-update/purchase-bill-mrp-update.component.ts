import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctHeader } from '../../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../../shared/compacct.global/dateTime.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-purchase-bill-mrp-update',
  templateUrl: './purchase-bill-mrp-update.component.html',
  styleUrls: ['./purchase-bill-mrp-update.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class PurchaseBillMrpUpdateComponent implements OnInit {
  tabIndexToView: number = 0;
  seachSpinner:boolean=false;
  CostCenterList:any=[];
  Tablelist:any=[];
  TablelistHeader:any=[];
  Spinner:boolean=false;
  objMrpUpdateSearch: MrpUpdateSearch = new MrpUpdateSearch();
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Purchase Bill MRP Update",
      Link: "Financial Management --> Transaction --> Purchase --> Purchase Bill MRP Update"
    });
    this.GetCostcenter();
  }

  GetCostcenter(){
    this.CostCenterList=[];
    this.$http.get("/Common/Get_Cost_Center").subscribe((data: any) => {
      // console.log("data  ===",data);
      const CostCenterData = data ? JSON.parse(data) : [];
      if(CostCenterData.length){
        CostCenterData.forEach(element => {
          element['label'] = element.Cost_Cen_Name,
          element['value'] = element.Cost_Cen_ID
        });
        this.CostCenterList = CostCenterData;
        // console.log("CostCenterList  ===",this.CostCenterList);
      }
    });
  }

  getDateRange(dateRangeObj: any) {
    if (dateRangeObj.length) {
      this.objMrpUpdateSearch.From_Date = dateRangeObj[0];
      this.objMrpUpdateSearch.End_Date = dateRangeObj[1];
    }
  }

  GetAllBrowseData(){
    this.Tablelist = [];
    this.TablelistHeader = [];
    this.seachSpinner = true;

    const tempobj = {
      From_Date : this.objMrpUpdateSearch.From_Date ? this.DateService.dateConvert(new Date(this.objMrpUpdateSearch.From_Date)) : this.DateService.dateConvert(new Date()),
      End_Date : this.objMrpUpdateSearch.End_Date ? this.DateService.dateConvert(new Date(this.objMrpUpdateSearch.End_Date)) : this.DateService.dateConvert(new Date()),
      Cost_Cen_ID: this.objMrpUpdateSearch.Cost_Cen_ID ? this.objMrpUpdateSearch.Cost_Cen_ID : 0
    } 

    // console.log('tempobj',tempobj);
    const obj = {
      "SP_String": "SP_BL_Txn_PBill_Product_MRP",
      "Report_Name_String": "Get_Product_For_MRP",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.seachSpinner = false;
      // console.log("GetAllBrowseData",data);
       this.Tablelist = data ? data : [];
       if (this.Tablelist.length) {
         this.TablelistHeader = Object.keys(data[0]);
       }
    });
  }

  UpdateMRP(){
    this.Spinner=true;
    const updateTablelist:any=[];
    this.Tablelist.forEach((ele:any) => {
      updateTablelist.push({
        'Bill_No': ele.Bill_No,
        'product_id': ele.product_id,
        'MRP' : Number(ele.MRP) 
      })
    });
    // console.log('updateTablelist',updateTablelist);
    const updateObj = {
      "SP_String": "SP_BL_Txn_PBill_Product_MRP",
      "Report_Name_String": "Update_MRP",
      "Json_Param_String": JSON.stringify(updateTablelist)
    }
    this.GlobalAPI.postData(updateObj).subscribe((data: any) => {
      // console.log("UpdateMRP res",data);
      if (data[0].Message == "Done") {
        this.CompacctToast.clear();
        this.CompacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "MRP Update",
          detail: "Succesfully Saved"
        });
        this.Spinner = false;
        this.GetAllBrowseData()
      }
    });
  }

}

class MrpUpdateSearch{
  From_Date : any;
  End_Date : any;
  Cost_Cen_ID:any;
}
