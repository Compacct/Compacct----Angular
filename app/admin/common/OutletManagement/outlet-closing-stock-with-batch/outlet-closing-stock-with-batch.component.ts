import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';


@Component({
  selector: 'app-outlet-closing-stock-with-batch',
  templateUrl: './outlet-closing-stock-with-batch.component.html',
  styleUrls: ['./outlet-closing-stock-with-batch.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class OutletClosingStockWithBatchComponent implements OnInit {
  Remarks:any;
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save"
  ObjOTclosingwithbatch : OTclosingwithbatch = new OTclosingwithbatch ();
  BrandList = [];
  CostCenter = [];
  costcentdisableflag = false;
  GodownId = [];
  godowndisableflag = false;
  productlist = [];
  flag = false;
  myDate = new Date;
  OTclosingstockwithbatchFormSubmitted = false;
  ObjBrowse : Browse  = new Browse();
  Searchedlist = [];
  SearchFormSubmitted = false;
  checkSave = false;
  BrandDisable = false;
  Doc_No = undefined;
  ViewList = [];
  ViewPoppup = false;
  Doc_date = undefined;
  Cost_Cent_ID = undefined;
  Godown_ID = undefined;
  BrandId = undefined;
  remarks = undefined;
  editList = [];
  del_doc_no: any;

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
      Header: "Outlet Closing Stock With Batch",
      Link: "Outlet -> Outlet Closing Stock With Batch"
    });
    this.GetBrand();
    this.getCostCenter();
  }
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
        "SP_String": "SP_Outlet_Closing_Stock_With_Batch",
        "Report_Name_String": "GET_Brand_For_Outlet",
        "Json_Param_String": JSON.stringify([{Cost_Cent_ID:this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.BrandList = data;
        this.ObjOTclosingwithbatch.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
        this.ObjBrowse.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
        //this.ObjIssueStockAd.Brand_ID = data[0].Brand_INI;
        this.BrandDisable = true;
         console.log("Brand List ===",this.BrandList);
      })
    } else {
    const obj = {
      "SP_String": "SP_Outlet_Closing_Stock_With_Batch",
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
     this.ObjOTclosingwithbatch.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.costcentdisableflag = true;
     this.getGodown();
     } else {
      this.ObjOTclosingwithbatch.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.costcentdisableflag = false;
      this.getGodown();
     }
      console.log("this.Outletid ======",this.CostCenter);

    });
  }
  getGodown(){
    const obj = {
      "SP_String": "SP_Outlet_Closing_Stock_With_Batch",
      "Report_Name_String": "GET_Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cent_ID :this.ObjOTclosingwithbatch.Cost_Cen_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.GodownId = data;
     this.ObjOTclosingwithbatch.godown_id = this.GodownId.length === 1 ? this.GodownId[0].godown_id : undefined;
     if(this.GodownId.length === 1){
       this.godowndisableflag = true;
     }else{
       this.godowndisableflag = false;
     }
      console.log("this.GodownId ======",this.GodownId);

    });
  }
  GetProduct(valid){
    this.OTclosingstockwithbatchFormSubmitted = true;
    if(valid){
    const tempObj = {
      Brand_ID : this.ObjOTclosingwithbatch.Brand_ID,
      Cost_Cen_ID : this.ObjOTclosingwithbatch.Cost_Cen_ID,
      From_godown_id : this.ObjOTclosingwithbatch.godown_id,
      Product_Type_ID : 0
    }
    const obj = {
      "SP_String": "SP_Outlet_Closing_Stock_With_Batch",
      "Report_Name_String": "GET_Products",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.productlist = data;
     // this.productlist[0].Issue_Qty = this.productlist[0].batch_Qty
       console.log(" product List ===",this.productlist);
       this.OTclosingstockwithbatchFormSubmitted = false;
       for(let i = 0; i < this.productlist.length ; i++){
        this.productlist[i].Closing_Qty = this.productlist[i].batch_Qty
       }
    })
  }
  }
  getTotalValue(key){
    let Amtval = 0;
    this.productlist.forEach((item)=>{
      Amtval += Number(item[key]);
    });

    return Amtval ? Amtval : '-';
  }
  VarianceqtyChq(indx){
    this.productlist[indx]['Varience_Qty'] =  0;
    if(this.productlist[indx]['batch_Qty'] && this.productlist[indx]['Closing_Qty']){
      this.productlist[indx]['Varience_Qty'] = this.productlist[indx]['batch_Qty'] - this.productlist[indx]['Closing_Qty'];
    }
    // this.flag = false;
    // console.log("col",col);
    // if(col.Issue_Qty){
    //   if(col.Issue_Qty <=  col.batch_Qty){
    //     this.flag = false;
    //     return true;
    //   }
    //   else {
    //     this.flag = true;
    //     this.compacctToast.clear();
    //          this.compacctToast.add({
    //              key: "compacct-toast",
    //              severity: "error",
    //              summary: "Warn Message",
    //              detail: "Quantity can't be more than in batch available quantity "
    //            });

    //          }
    // }
  }
  GetDataForSave(){
    if(this.productlist.length) {
      let tempArr =[];
      const TempObj = {
        Doc_No	 : this.Doc_No ? this.Doc_No : "A",
        Doc_Date : this.DateService.dateConvert(new Date(this.myDate)),
        Cost_Cen_ID	: this.ObjOTclosingwithbatch.Cost_Cen_ID,
        Godown_ID	: this.ObjOTclosingwithbatch.godown_id,
        //Narration	: this.ObjOTclosingwithbatch.Remarks,
        User_ID	: this.$CompacctAPI.CompacctCookies.User_ID,
       // Process_ID : 100,
      }
      this.productlist.forEach(item => {
        if(item.Closing_Qty) {
          const obj = {
            Product_Type_ID : item.Product_Type_ID,
            Product_ID : item.Product_ID,
            UOM : item.UOM,
            Batch_No : item.Batch_No,
           // System_Qty : item.batch_Qty,
            Closing_Qty	: item.Closing_Qty,
          //  Varience_Qty : item.varience_Qty,
            Remarks : item.Remarks ? item.Remarks : 'NA'
         }

         tempArr.push({...TempObj,...obj})
        }

      });
      console.log("Save Data ===", ...tempArr)
      return JSON.stringify(tempArr);

    }
  }
  SaveOTcloingWithBatch(){
    //if(valid){
      const obj = {
        "SP_String": "SP_Outlet_Closing_Stock_With_Batch",
        "Report_Name_String" : "Save_Outlet_Closing_Stock_With_Batch",
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
           detail: "Succesfully  "  + mgs
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
  Cost_Cen_ID : this.ObjBrowse.Cost_Cen_ID ? this.ObjBrowse.Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
}
const obj = {
  "SP_String": "SP_Outlet_Closing_Stock_With_Batch",
  "Report_Name_String": "Browse_Outlet_Closing_Stock_With_Batch",
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
     this.clearData();
     if(DocNo.Doc_No){
     this.Doc_No = DocNo.Doc_No;
     this.tabIndexToView = 1;
     this.productlist = [];
     this.items = ["BROWSE", "UPDATE"];
     this.buttonname = "Update";
     // console.log("this.EditDoc_No ==", this.Objproduction.Doc_No);
     this.GetdataforEdit(this.Doc_No);
     }
   }
   GetdataforEdit(Doc_No){
     this.OTclosingstockwithbatchFormSubmitted = false;
       const obj = {
         "SP_String": "SP_Outlet_Closing_Stock_With_Batch",
         "Report_Name_String": "Get_Edit_Data_Outlet_Closing_Stock_With_Batch",
         "Json_Param_String": JSON.stringify([{Doc_No  : this.Doc_No}])

       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log("Edit Data From API",data);
       this.editList = data;
          this.ObjOTclosingwithbatch.Brand_ID = data[0].Brand_ID;
            this.ObjOTclosingwithbatch.Cost_Cen_ID = data[0].Cost_Cen_ID;
            this.ObjOTclosingwithbatch.godown_id = data[0].godown_id;
            this.myDate = data[0].Doc_Date;
            data.forEach(element => {
              const  productObj = {
               Product_Type_ID : element.Product_Type_ID,
               Product_Type : element.Product_Type,
               Product_ID : element.Product_ID,
               Product_Description : element.Product_Description,
               UOM : element.UOM,
               Batch_No : element.Batch_No,
               Expiry_Date :  element.Expiry_Date,
               batch_Qty : element.batch_Qty,
               Closing_Qty : element.Closing_Qty,
               Varience_Qty : element.Varience_Qty,
               Remarks : element.Remarks
             };
              this.productlist.push(productObj);
         });
         // FOR VIEW
             this.Doc_No = data[0].Doc_No;
             this.Doc_date = new Date(data[0].Doc_Date);
             this.BrandId = data[0].Brand_Name;
             this.Cost_Cent_ID = data[0].Location;
             this.Godown_ID = data[0].godown_name;
         // console.log("this.editList  ===",data);
         if(this.buttonname != "Update"){
             this.ViewPoppup = true;
         }
       })
   }
   View(DocNo){
    //console.log("View ==",DocNo);
  this.clearData();
  //this.editList = [];
  this.Doc_No = undefined;
  this.Doc_date = undefined;
  this.BrandId = undefined;
  this.Cost_Cent_ID = undefined;
  this.Godown_ID = undefined;
  this.remarks = undefined;
  if(DocNo.Doc_No){
  this.Doc_No = DocNo.Doc_No;
 // this.ViewPoppup = true;
  // console.log("VIew ==", this.Objproduction.Doc_No);
  this.GetdataforEdit(this.Doc_No);
  //this.getadvorderdetails(this.Objcustomerdetail.Bill_No);
  }
  }
  Delete(row){
    // console.log("delete",row)
     this.del_doc_no = undefined;
     if (row.Doc_No) {
      this.del_doc_no = row.Doc_No;
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
     if(this.del_doc_no){
       const TempObj = {
         Doc_No : this.del_doc_no,
         //User_ID : this.$CompacctAPI.CompacctCookies.User_ID
       }
       const obj = {
         "SP_String": "SP_Outlet_Closing_Stock_With_Batch",
         "Report_Name_String": "Delete_Outlet_Closing_Stock_With_Batch",
         "Json_Param_String": JSON.stringify([TempObj])
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log("del Data===", data[0].Column1)
          if (data[0].Column1 === "Done"){
            this.onReject();
            this.GetSearchedList(true);
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Doc No.: " + this.del_doc_no.toString(),
              detail: "Succesfully Deleted"
            });
            this.clearData();
          }
        })
     }
   }
   
   onReject(){
     this.compacctToast.clear("c");
   }
  clearData(){
    if(this.$CompacctAPI.CompacctCookies.User_Type != "A"){
      this.ObjOTclosingwithbatch.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.ObjBrowse.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.BrandDisable = true;
    } else {
       //this.ObjBrowse.Brand_ID = undefined;
       this.ObjOTclosingwithbatch.Brand_ID = undefined;
       this.BrandDisable = false;
    }
    //this.ObjBrowse.Brand_ID = undefined;
    //this.Searchedlist = [];
    //this.ObjIssueStockAd.Brand_ID = undefined;
    this.ObjOTclosingwithbatch.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.getGodown();
    this.ObjOTclosingwithbatch.godown_id = this.GodownId.length === 1 ? this.GodownId[0].godown_id : undefined;
     if(this.GodownId.length === 1){
       this.godowndisableflag = true;
     }else{
       this.godowndisableflag = false;
     }
    this.ObjOTclosingwithbatch.Remarks = [];
    this.productlist = [];
    this.editList = [];
  }

}
class OTclosingwithbatch {
  Brand_ID : string;
  Cost_Cen_ID : string;
  godown_id : string;
  Remarks : any;
 }
 class Browse {
  start_date : Date ;
  end_date : Date;
  Brand_ID : string;
  Cost_Cen_ID : string;
}
