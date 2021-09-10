import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-issue-stock-adjustment',
  templateUrl: './issue-stock-adjustment.component.html',
  styleUrls: ['./issue-stock-adjustment.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class IssueStockAdjustmentComponent implements OnInit {
  Remarks:any;
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save"
  ObjIssueStockAd : IssueStockAd = new IssueStockAd ();
  BrandList = [];
  CostCenter = [];
  costcentdisableflag = false;
  GodownId = [];
  godowndisableflag = false;
  productlist = [];
  flag = false;
  myDate = new Date;
  IssueStockFormSubmitted = false;
  ObjBrowse : Browse  = new Browse();
  Searchedlist = [];
  SearchFormSubmitted = false;
  checkSave = false;
  BrandDisable = false;

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Issue Stock Adjustment",
      Link: "Material Management -> Issue Stock Adjustment"
    });
    this.GetBrand();
    this.getCostCenter();
  }
  onReject(){}
  onConfirm(){}
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  GetBrand(){
    this.BrandList = [];
    if(this.$CompacctAPI.CompacctCookies.User_Type != "A"){
      const obj = {
        "SP_String": "SP_Issue_Stock_Adjustment",
        "Report_Name_String": "GET_Brand_For_Outlet",
        "Json_Param_String": JSON.stringify([{Cost_Cent_ID:this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.BrandList = data;
        this.ObjIssueStockAd.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
        this.ObjBrowse.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
        //this.ObjIssueStockAd.Brand_ID = data[0].Brand_INI;
        this.BrandDisable = true;
         console.log("Brand List ===",this.BrandList);
      })
    } else {
    const obj = {
      "SP_String": "SP_Issue_Stock_Adjustment",
      "Report_Name_String": "Get - Brand"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrandList = data;
      //this.Objproduction.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.BrandDisable = false;
       console.log("Brand List ===",this.BrandList);
    })
  }
  }
  // getCostCenter(){
  //   const obj = {
  //     "SP_String": "SP_Issue_Stock_Adjustment",
  //     "Report_Name_String": "GET_Cost_Cent_Name",
  //     "Json_Param_String": JSON.stringify([{Cost_Cent_ID:this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
  //     //"Json_Param_String": JSON.stringify([{User_ID : 61}])
  //    }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //    this.CostCenter = data;
  //    //if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
  //    //this.ObjBrowseStockView.Outlet = this.Outletid.length === 1 ? this.Outletid[0].Cost_Cen_ID : undefined;
  //    this.ObjIssueStockAd.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  //    this.costcentdisableflag = true;
  //    this.getGodown();
  //   // }
  //     console.log("cost center ======",this.CostCenter);

  //   });
  // }
  getCostCenter(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Cost Center Name All",
      "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.CostCenter = data;
     if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
     //this.ObjBrowseStockView.Outlet = this.Outletid.length === 1 ? this.Outletid[0].Cost_Cen_ID : undefined;
     this.ObjIssueStockAd.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.costcentdisableflag = true;
     this.getGodown();
     } else {
      this.ObjIssueStockAd.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.costcentdisableflag = false;
      this.getGodown();
     }
      console.log("this.Outletid ======",this.CostCenter);

    });
  }
  getGodown(){
    const obj = {
      "SP_String": "SP_Issue_Stock_Adjustment",
      "Report_Name_String": "GET_Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cent_ID :this.ObjIssueStockAd.Cost_Cen_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.GodownId = data;
     this.ObjIssueStockAd.godown_id = this.GodownId.length === 1 ? this.GodownId[0].godown_id : undefined;
     if(this.GodownId.length === 1){
       this.godowndisableflag = true;
     }else{
       this.godowndisableflag = false;
     }
      console.log("this.GodownId ======",this.GodownId);

    });
  }
  GetProduct(valid){
    this.IssueStockFormSubmitted = true;
    if(valid){
    const tempObj = {
      Brand_ID : this.ObjIssueStockAd.Brand_ID,
      From_Cost_Cen_ID : this.ObjIssueStockAd.Cost_Cen_ID,
      From_godown_id : this.ObjIssueStockAd.godown_id,
      Product_Type_ID : 0
    }
    const obj = {
      "SP_String": "SP_Issue_Stock_Adjustment",
      "Report_Name_String": "GET_Products",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.productlist = data;
     // this.productlist[0].Issue_Qty = this.productlist[0].batch_Qty
       console.log(" product List ===",this.productlist);
       this.IssueStockFormSubmitted = false;
       for(let i = 0; i < this.productlist.length ; i++){
        this.productlist[i].Issue_Qty = this.productlist[i].batch_Qty
       }
    })
  }
  }
  qtyChq(col){
    this.flag = false;
    console.log("col",col);
    if(col.Issue_Qty){
      if(col.Issue_Qty <=  col.batch_Qty){
        this.flag = false;
        return true;
      }
      else {
        this.flag = true;
        this.compacctToast.clear();
             this.compacctToast.add({
                 key: "compacct-toast",
                 severity: "error",
                 summary: "Warn Message",
                 detail: "Quantity can't be more than in batch available quantity "
               });

             }
    }
  }
  GetDataForSave(){
    if(this.productlist.length) {
      let tempArr =[];
      const TempObj = {
        Doc_No : "A",
        Doc_Date : this.DateService.dateConvert(new Date(this.myDate)),
        Cost_Cen_ID	: this.ObjIssueStockAd.Cost_Cen_ID,
        godown_id	: this.ObjIssueStockAd.godown_id,
        Narration	: this.ObjIssueStockAd.Remarks,
        User_ID	: this.$CompacctAPI.CompacctCookies.User_ID,
        Process_ID : 100,
      }
      this.productlist.forEach(item => {
        if(item.Issue_Qty) {
          const obj = {
            Product_ID : item.Product_ID,
            Issue_Qty	: item.Issue_Qty,
            Rate : 0,
            UOM	: item.UOM,
            Batch_No : item.Batch_No
         }

         tempArr.push({...TempObj,...obj})
        }

      });
      console.log("Save Data ===", ...tempArr)
      return JSON.stringify(tempArr);

    }
  }
  SaveIssueStock(){
    //if(valid){
      const obj = {
        "SP_String": "SP_Issue_Stock_Adjustment",
        "Report_Name_String" : "Save_Issue_Stock_Movement",
       "Json_Param_String": this.GetDataForSave()

      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        //console.log(data);
        var tempID = data[0].Column1;
       // this.Objproduction.Doc_No = data[0].Column1;
        if(data[0].Column1){
          this.compacctToast.clear();
        //  const mgs = this.buttonname === "Save & Print" ? "Saved" : "Updated";
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Doc_No  " + tempID,
           detail: "Succesfully  Saved" //+ mgs
         });
        //  if (this.buttonname == "Save & Print") {
        //  this.saveNprintProVoucher();
        //  }
         this.clearData();
        // this.IssueStockFormSubmitted = false;

        } else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      })
    //}
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  GetSearchedList(valid){
    this.SearchFormSubmitted = true;
    this.Searchedlist = [];
  const start = this.ObjBrowse.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
  : this.DateService.dateConvert(new Date());
  if(valid){
const tempobj = {
  From_Date : start,
  To_Date : end,
  Brand_ID : this.ObjBrowse.Brand_ID,
  //Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
}
const obj = {
  "SP_String": "SP_Issue_Stock_Adjustment",
  "Report_Name_String": "Browse_Issue_Stock_Adjustment",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
   this.SearchFormSubmitted = false;
 })
 }
  }
  clearData(){
    if(this.$CompacctAPI.CompacctCookies.User_Type != "A"){
      this.ObjIssueStockAd.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.ObjBrowse.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.BrandDisable = true;
    } else {
       this.ObjBrowse.Brand_ID = undefined;
       this.ObjIssueStockAd.Brand_ID = undefined;
       this.BrandDisable = false;
    }
    //this.ObjBrowse.Brand_ID = undefined;
    this.Searchedlist = [];
    //this.ObjIssueStockAd.Brand_ID = undefined;
    this.ObjIssueStockAd.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.getGodown();
    this.ObjIssueStockAd.godown_id = this.GodownId.length === 1 ? this.GodownId[0].godown_id : undefined;
     if(this.GodownId.length === 1){
       this.godowndisableflag = true;
     }else{
       this.godowndisableflag = false;
     }
    this.ObjIssueStockAd.Remarks = [];
    this.productlist = [];
  }

}
class IssueStockAd {
  Brand_ID : string;
  Cost_Cen_ID : string;
  godown_id : string;
  Remarks : any;
 }
 class Browse {
  start_date : Date ;
  end_date : Date;
  Brand_ID : string;
}
