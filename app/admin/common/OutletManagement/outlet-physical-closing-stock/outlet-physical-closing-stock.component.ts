import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-outlet-physical-closing-stock',
  templateUrl: './outlet-physical-closing-stock.component.html',
  styleUrls: ['./outlet-physical-closing-stock.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class OutletPhysicalClosingStockComponent implements OnInit {
  Remarks:any;
  items = [];
  Spinner = false;
  seachSpinner = false
  ClosingStockFormSubmitted = false;
  tabIndexToView = 0;
  buttonname = "Save"
  ObjClosingStock : ClosingStock = new ClosingStock ();
  BrandList = [];
  CostCenter = [];
  costcentdisableflag = false;
  GodownId = [];
  godowndisableflag = false;
  productlist = [];
  flag = false;
  myDate : Date;
  IssueStockFormSubmitted = false;
  ObjBrowse : Browse  = new Browse();
  Searchedlist = [];
  SearchFormSubmitted = false;
  checkSave = false;
  BrandDisable = false;
  editList = [];
  dateList: any;
  BackupProductlist = [];
  SelectedDistProductType = [];
  DistProductType = [];
  ProductFields = [];
  todayDate : any = new Date();

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
      Header: "Outlet Closing Stock",
      Link: "Outlet Management -> Outlet Closing Stock"
    });
    this.getbilldate();
    this.GetBrand();
    this.getCostCenter();
    this.getGodown();
  }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  getbilldate(){
    const obj = {
     "SP_String": "SP_Controller_Master",
     "Report_Name_String": "Get - Outlet Bill Date",
     //"Json_Param_String": JSON.stringify([{Doc_Type : "Sale_Bill"}])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.dateList = data;
   //console.log("this.dateList  ===",this.dateList);
  this.myDate =  new Date(data[0].Outlet_Bill_Date);
   // on save use this
  // this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));

 })
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
        this.ObjClosingStock.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
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
  //     "SP_String": "SP_Controller_Master",
  //     "Report_Name_String": "Get Sale Requisition Outlet",
  //     "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
  //     //"Json_Param_String": JSON.stringify([{User_ID : 61}])
  //    }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //    this.CostCenter = data;
  //   // this.FromCostCentId = data[0].Cost_Cen_ID ? data[0].Cost_Cen_ID : 0;
  //   console.log("this.CostCenter======",this.CostCenter);
  //   if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
  //        //this.ObjBrowseStockView.Outlet = this.Outletid.length === 1 ? this.Outletid[0].Cost_Cen_ID : undefined;
  //        this.ObjClosingStock.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  //        this.costcentdisableflag = true;
  //        } else {
  //         this.ObjClosingStock.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  //        this.costcentdisableflag = false;
  //        }


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
     this.ObjClosingStock.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.costcentdisableflag = true;
     this.getGodown();
     } else {
      this.ObjClosingStock.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
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
      "Json_Param_String": JSON.stringify([{Cost_Cent_ID :this.ObjClosingStock.Cost_Cen_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.GodownId = data;
     this.ObjClosingStock.godown_id = this.GodownId.length === 1 ? this.GodownId[0].godown_id : undefined;
     if(this.GodownId.length === 1){
       this.godowndisableflag = true;
     }else{
       this.godowndisableflag = false;
     }
      console.log("this.GodownId ======",this.GodownId);

    });
  }
  GetProduct(valid){
    this.ClosingStockFormSubmitted = true;
    if(valid){
    const tempObj = {
      Brand_ID : this.ObjClosingStock.Brand_ID,
      From_Cost_Cen_ID : this.ObjClosingStock.Cost_Cen_ID,
      From_godown_id : this.ObjClosingStock.godown_id,
    }
    const obj = {
      "SP_String": "SP_Outlet_Physical_Closing_Stock",
      "Report_Name_String": "GET_Closing_Stock_Products",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.productlist = data;
      this.BackupProductlist = data;
      this.GetDistinct();
     // this.productlist[0].Issue_Qty = this.productlist[0].batch_Qty
       console.log(" product List ===",this.productlist);
       this.ClosingStockFormSubmitted = false;
      //  for(let i = 0; i < this.productlist.length ; i++){
      //   this.productlist[i].Issue_Qty = this.productlist[i].batch_Qty
      //  }
    })
  }
  }
  GetDistinct() {
    let DProductType = [];
    this.DistProductType =[];
    this.SelectedDistProductType =[];
    this.ProductFields =[];
    this.productlist.forEach((item) => {
    if (DProductType.indexOf(item.Product_Type_ID) === -1) {
    DProductType.push(item.Product_Type_ID);
    this.DistProductType.push({ label: item.Product_Type, value: item.Product_Type_ID });
    }
  });
     this.BackupProductlist = [...this.productlist];
  }
  FilterDist() {
    let DProductType = [];
    this.ProductFields =[];
  if (this.SelectedDistProductType.length) {
    this.ProductFields.push('Product_Type_ID');
    DProductType = this.SelectedDistProductType;
  }
  this.productlist = [];
  if (this.ProductFields.length) {
    let LeadArr = this.BackupProductlist.filter(function (e) {
      return  (DProductType.length ? DProductType.includes(e['Product_Type_ID']) : true)
    });
  this.productlist = LeadArr.length ? LeadArr : [];
  } else {
  this.productlist = [...this.BackupProductlist] ;
  }
  }
  // qtyChq(col){
  //   this.flag = false;
  //   console.log("col",col);
  //   if(col.Issue_Qty){
  //     if(col.Issue_Qty <=  col.batch_Qty){
  //       this.flag = false;
  //       return true;
  //     }
  //     else {
  //       this.flag = true;
  //       this.compacctToast.clear();
  //            this.compacctToast.add({
  //                key: "compacct-toast",
  //                severity: "error",
  //                summary: "Warn Message",
  //                detail: "Quantity can't be more than in batch available quantity "
  //              });

  //            }
  //   }
  // }
  GetDataForSave(){
    if(this.BackupProductlist.length) {
      let tempArr =[];
      const TempObj = {
        Doc_No :  this.ObjClosingStock.Doc_No ?  this.ObjClosingStock.Doc_No : "A",
        Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
        Cost_Cen_ID	: this.ObjClosingStock.Cost_Cen_ID,
        Godown_ID	: this.ObjClosingStock.godown_id,
        Remarks : this.ObjClosingStock.Remarks,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID
      }
      this.BackupProductlist.forEach(item => {
        if(item.Closing_Qty && Number(item.Closing_Qty) !== 0) {
          const obj = {
            Product_Type_ID : item.Product_Type_ID,
            Product_ID : item.Product_ID,
            Closing_Qty	: item.Closing_Qty
         }

         tempArr.push({...TempObj,...obj})
        }

      });
      console.log("Save Data ===", ...tempArr)
      return JSON.stringify(tempArr);

    }
  }
  SaveClosingStock(){
    //if(valid){
      const obj = {
        "SP_String": "SP_Outlet_Physical_Closing_Stock",
        "Report_Name_String" : "Save_Outlet_Physical_Closing_Stock",
       "Json_Param_String": this.GetDataForSave()

      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        //console.log(data);
        var tempID = data[0].Column1;
       // this.Objproduction.Doc_No = data[0].Column1;
        if(data[0].Column1){
          this.compacctToast.clear();
          const mgs = this.buttonname === "Save" ? "Saved" : "Updated";
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Doc_No  " + tempID,
           detail: "Succesfully  " + mgs
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

  // FOR BROWSE
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
  Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
}
const obj = {
  "SP_String": "SP_Outlet_Physical_Closing_Stock",
  "Report_Name_String": "Browse_Outlet_Closing_Stock",
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
  Edit(DocNo){
    // console.log("editmaster ==",DocNo);
   this.productlist = [];
   this.clearData();
   if(DocNo.Doc_No){
   this.ObjClosingStock.Doc_No = DocNo.Doc_No;
   this.tabIndexToView = 1;
   this.items = ["BROWSE", "UPDATE"];
   this.buttonname = "Update";
    console.log("this.EditDoc_No ==", this.ObjClosingStock.Doc_No);
   this.GetEdit(this.ObjClosingStock.Doc_No);
   }
   }
   GetEdit(Doc_No){
     this.editList = [];
     this.ClosingStockFormSubmitted = false;
     const obj = {
       "SP_String": "SP_Outlet_Physical_Closing_Stock",
       "Report_Name_String": "Get_Edit_Data_Outlet_Closing_Stock",
       "Json_Param_String": JSON.stringify([{Doc_No : this.ObjClosingStock.Doc_No}])

     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.editList = data;
       this.todayDate = data[0].Doc_Date;
       //this.GetBrand();
       this.ObjClosingStock.Brand_ID = data[0].Brand_ID ? data[0].Brand_ID : undefined;
       this.ObjClosingStock.Cost_Cen_ID = data[0].Cost_Cen_ID;
       this.ObjClosingStock.godown_id = data[0].Godown_ID ? data[0].Godown_ID : undefined;
       this.ObjClosingStock.Remarks = data[0].Remarks;

        data.forEach(element => {
        const  productObj = {
           //ID : element.ID,
           Product_Type_ID : element.Product_Type_ID,
           Product_Type : element.Product_Type,
           Product_ID : element.Product_ID,
           Product_Description : element.Product_Description,
           Closing_Qty :  Number(element.Closing_Qty),
           // deleteflag : true
         };
          this.productlist.push(productObj);
          this.BackupProductlist = this.productlist;
          this.GetIndentdist();
     });
      console.log("this.editList  ===",data);
     // console.log("edit From_Process_IDe ===" , this.Objproduction.From_Process_ID)

   })
   }
   GetIndentdist(){
    let DIndentBy = [];
    this.DistProductType = [];
    //this.SelectedDistOrderBy1 = [];
    this.editList.forEach((item) => {
      if (DIndentBy.indexOf(item.Product_Type_ID) === -1) {
        DIndentBy.push(item.Product_Type_ID);
         this.DistProductType.push({ label: item.Product_Type, value: item.Product_Type_ID });
        console.log("this.TimerangeFilter", this.DistProductType);
      }
    });
  }
   Delete(docNo){
    this.ObjClosingStock.Doc_No = undefined ;
    if(docNo.Doc_No){
    this.ObjClosingStock.Doc_No = docNo.Doc_No;
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
  onConfirm() {
    const Tempobj = {
      Doc_No : this.ObjClosingStock.Doc_No
    }
    const obj = {
      "SP_String" : "SP_Outlet_Physical_Closing_Stock",
      "Report_Name_String" : "Delete_Outlet_Closing_Stock",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log(data);
      if(data[0].Column1 === "Done") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Doc_No : " + this.ObjClosingStock.Doc_No,
          detail:  "Succesfully Delete"
        });
        this.GetSearchedList(true);
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
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  clearData(){
    if(this.$CompacctAPI.CompacctCookies.User_Type != "A"){
      this.ObjClosingStock.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.ObjBrowse.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.BrandDisable = true;
    } else {
       this.ObjBrowse.Brand_ID = undefined;
       this.ObjClosingStock.Brand_ID = undefined;
       this.BrandDisable = false;
    }
    //this.ObjBrowse.Brand_ID = undefined;
    //this.Searchedlist = [];
    //this.ObjIssueStockAd.Brand_ID = undefined;
    this.ObjClosingStock.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    // this.getGodown();
    // this.ObjClosingStock.godown_id = this.GodownId.length === 1 ? this.GodownId[0].godown_id : undefined;
    //  if(this.GodownId.length === 1){
    //    this.godowndisableflag = true;
    //  }else{
    //    this.godowndisableflag = false;
    //  }
    this.ObjClosingStock.Remarks = [];
    this.productlist = [];
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.DistProductType =[];
    this.SelectedDistProductType =[];
    this.todayDate = new Date();
  }

}
class ClosingStock {
  Brand_ID : string;
  Cost_Cen_ID : string;
  godown_id : string;
  Remarks : any;
  Doc_No : String;
 }
 class Browse {
  start_date : Date ;
  end_date : Date;
  Brand_ID : string;
}
