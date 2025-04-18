import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-non-saleable-closing-stock',
  templateUrl: './non-saleable-closing-stock.component.html',
  styleUrls: ['./non-saleable-closing-stock.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NonSaleableClosingStockComponent implements OnInit {
  Remarks:any;
  items:any = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save"
  ObjNsOTclosingStock : NsOTclosingStock = new NsOTclosingStock ();
  BrandList:any = [];
  CostCenter:any = [];
  costcentdisableflag = false;
  GodownId:any = [];
  godowndisableflag = false;
  productlist:any = [];
  flag = false;
  BillDate : Date;
  dateList: any;
  NsOTclosingstockFormSubmitted = false;
  ObjBrowse : Browse  = new Browse();
  Searchedlist:any = [];
  nsSearchFormSubmitted = false;
  checkSave = false;
  BrandDisable = false;
  Doc_No = undefined;
  ViewList:any = [];
  ViewPoppup = false;
  Doc_date = undefined;
  Cost_Cent_ID = undefined;
  Godown_ID = undefined;
  BrandId = undefined;
  remarks = undefined;
  editList:any = [];
  del_doc_no: any;
  minDate:Date;
  maxDate:Date;
  EODstatus: any;
  docdate: any;
  lockdate: any;

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    $(".content-header").removeClass("collapse-pos");
    $(".content").removeClass("collapse-pos");
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "N/Saleable Outlet Closing Stock",
      Link: "Outlet -> N/Saleable Outlet Closing Stock"
    });
    this.getbilldate();
    this.getCostCenter();
    this.getLockDate();
  }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  getLockDate(){
    const obj = {
     "SP_String": "sp_Comm_Controller",
     "Report_Name_String": "Get_LockDate",
     //"Json_Param_String": JSON.stringify([{Doc_Type : "Sale_Bill"}])
  
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // console.log('LockDate===',data);
    this.lockdate = data[0].dated;
  
  })
  }
  checkLockDate(docdate){
    if(this.lockdate && docdate){
      if(new Date(docdate) > new Date(this.lockdate)){
        return true;
      } else {
        var msg = this.tabIndexToView === 0 ? "edit or delete" : "create";
        this.Spinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "error",
         summary: "Warn Message",
         detail: "Can't "+msg+" this document. Transaction locked till "+ this.DateService.dateConvert(new Date (this.lockdate))
      });
        return false;
      }
    } else {
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "error",
       summary: "Warn Message",
       detail: "Date not found."
      });
      return false;
    }
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
   this.BillDate =  new Date(data[0].Outlet_Bill_Date);
      console.log("Datevalue",this.BillDate);
      let Datetemp:Date =  new Date(data[0].Outlet_Bill_Date)
      const Timetemp =  Datetemp.setDate(Datetemp.getDate() - 1);
      this.minDate = new Date(Timetemp);
      console.log("minDate==", this.minDate)
      let tempDate:Date =  new Date(data[0].Outlet_Bill_Date)
      const tempTimeBill =  tempDate.setDate(tempDate.getDate() + 1);
      this.maxDate = this.BillDate;
      console.log("maxDate==", this.maxDate)
   // on save use this
  // this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));

 })
}
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
     this.ObjNsOTclosingStock.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.costcentdisableflag = true;
     this.getGodown();
     } else {
      this.ObjNsOTclosingStock.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.costcentdisableflag = false;
      this.getGodown();
     }
      console.log("this.Outletid ======",this.CostCenter);

    });
  }
  getGodown(){
    const obj = {
      "SP_String": "SP_Outlet_Closing_Stock_Non_Saleable",
      "Report_Name_String": "GET_Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cent_ID :this.ObjNsOTclosingStock.Cost_Cen_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.GodownId = data;
     this.ObjNsOTclosingStock.godown_id = this.GodownId.length === 1 ? this.GodownId[0].godown_id : undefined;
     if(this.GodownId.length === 1){
       this.godowndisableflag = true;
     }else{
       this.godowndisableflag = false;
     }
      console.log("this.GodownId ======",this.GodownId);

    });
  }
  GetProduct(valid){
    this.NsOTclosingstockFormSubmitted = true;
    if(valid){
    const tempObj = {
      Cost_Cen_ID : this.ObjNsOTclosingStock.Cost_Cen_ID,
      Godown_ID : this.ObjNsOTclosingStock.godown_id
    }
    const obj = {
      "SP_String": "SP_Outlet_Closing_Stock_Non_Saleable",
      "Report_Name_String": "Get Product",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.productlist = data;
     // this.productlist[0].Issue_Qty = this.productlist[0].batch_Qty
       console.log(" product List ===",this.productlist);
       this.NsOTclosingstockFormSubmitted = false;
       for(let i = 0; i < this.productlist.length ; i++){
        this.productlist[i].Closing_Qty = this.productlist[i].Batch_Qty
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
    if(this.productlist[indx]['Batch_Qty'] && this.productlist[indx]['Closing_Qty']){
      this.productlist[indx]['Varience_Qty'] = this.productlist[indx]['Batch_Qty'] - this.productlist[indx]['Closing_Qty'];
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
      let tempArr:any =[];
      const TempObj = {
        Doc_No	 : this.Doc_No ? this.Doc_No : "A",
        Doc_Date : this.docdate ? this.DateService.dateConvert(new Date(this.docdate)) : this.DateService.dateConvert(new Date(this.BillDate)),
        Cost_Cen_ID	: this.ObjNsOTclosingStock.Cost_Cen_ID,
        Godown_ID	: this.ObjNsOTclosingStock.godown_id,
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
            Batch_Qty : item.Batch_Qty,
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
    if(this.checkLockDate(this.DateService.dateConvert(new Date(this.BillDate)))) {
    this.ngxService.start();
    //if(valid){
      const obj = {
        "SP_String": "SP_Outlet_Closing_Stock_Non_Saleable",
        "Report_Name_String" : "Save_Outlet_NonSaleable_Closing_Stock",
       "Json_Param_String": this.GetDataForSave()

      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        //console.log(data);
        var tempID = data[0].Column1;
       // this.Objproduction.Doc_No = data[0].Column1;
        if(data[0].Column1){
          this.ngxService.stop();
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
          this.ngxService.stop();
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
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  GetSearchedList(valid){
    this.nsSearchFormSubmitted = true;
    this.Searchedlist = [];
  const start = this.ObjBrowse.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
  : this.DateService.dateConvert(new Date());
  var costcentid;
  if(this.$CompacctAPI.CompacctCookies.User_Type=='A'){
    costcentid = this.ObjBrowse.Cost_Cen_ID ? this.ObjBrowse.Cost_Cen_ID : 0;
  } else {
    costcentid = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  }
  if(valid){
    this.seachSpinner = true;
const tempobj = {
  From_Date : start,
  To_Date : end,
  //Brand_ID : this.ObjBrowse.Brand_ID ? this.ObjBrowse.Brand_ID : 0,
  Cost_Cen_ID : costcentid,
}
const obj = {
  "SP_String": "SP_Outlet_Closing_Stock_Non_Saleable",
  "Report_Name_String": "Browse_Outlet_NonSaleable_Closing_Stock",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
   this.nsSearchFormSubmitted = false;
 })
 }
  }
  Edit(DocNo){
    // console.log("editmaster ==",DocNo);
     this.clearData();
    if(DocNo.Doc_No){
      if(this.checkLockDate(DocNo.Doc_Date)){
     this.Doc_No = DocNo.Doc_No;
     this.tabIndexToView = 1;
     this.productlist = [];
     this.items = ["BROWSE", "UPDATE"];
     this.buttonname = "Update";
     this.BillDate = new Date(DocNo.Doc_Date);
     this.docdate = new Date(DocNo.Doc_Date);
     // console.log("this.EditDoc_No ==", this.Objproduction.Doc_No);
     this.GetdataforEdit(this.Doc_No);
     }
    }
   }
   GetdataforEdit(Doc_No){
     this.NsOTclosingstockFormSubmitted = false;
       const obj = {
         "SP_String": "SP_Outlet_Closing_Stock_Non_Saleable",
         "Report_Name_String": "Get_Edit_Data_Outlet_NonSaleable_Closing_Stock",
         "Json_Param_String": JSON.stringify([{Doc_No  : this.Doc_No}])

       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log("Edit Data From API",data);
       this.editList = data;
          this.ObjNsOTclosingStock.Brand_ID = data[0].Brand_ID;
            this.ObjNsOTclosingStock.Cost_Cen_ID = data[0].Cost_Cen_ID;
            this.getGodown();
            this.ObjNsOTclosingStock.godown_id = data[0].godown_id;
            // this.minDate = undefined;
            // this.maxDate = undefined;
            // this.BillDate = new Date(data[0].Doc_Date);
            data.forEach(element => {
              const  productObj = {
               Product_Type_ID : element.Product_Type_ID,
               Product_Type : element.Product_Type,
               Product_ID : element.Product_ID,
               Product_Description : element.Product_Description,
               UOM : element.UOM,
               Batch_No : element.Batch_No,
               Batch_Qty : element.batch_Qty ?  element.batch_Qty : element.Batch_Qty,
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
   TotalValue(key){
    let totalAmt = 0;
    this.editList.forEach((item)=>{
      totalAmt += Number(item[key]);
    });

    return totalAmt ? totalAmt : '-';
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
      if(this.checkLockDate(row.Doc_Date)){
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
   }
  onConfirm(){
     if(this.del_doc_no){
       const TempObj = {
         Doc_No : this.del_doc_no,
         //User_ID : this.$CompacctAPI.CompacctCookies.User_ID
       }
       const obj = {
         "SP_String": "SP_Outlet_Closing_Stock_Non_Saleable",
         "Report_Name_String": "Delete_Outlet_NonSaleable_Closing_Stock",
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
   exportoexcel(Arr,fileName): void {
     let temp:any = [];
     Arr.forEach(element => {
       const obj = {
        Product_Type : element.Product_Type,
        Product_ID : element.Product_ID,
        Product_Description : element.Product_Description,
        UOM : element.UOM,
        Batch_No : element.Batch_No,
        Expiry_Date : element.Expiry_Date,
        batch_Qty : element.batch_Qty ? element.batch_Qty : element.Batch_Qty,
        Closing_Qty : element.Closing_Qty,
        Consumption_Qty : element.Consumption_Qty,
        Issue_Qty : element.Issue_Qty,
        RTF_Qty : element.RTF_Qty,
        Remarks : element.Remarks,
        Total_Amount : element.Total_Amount
       }
       temp.push(obj)
     });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(temp);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
  clearData(){
    if(this.$CompacctAPI.CompacctCookies.User_Type != "A"){
      this.ObjNsOTclosingStock.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.ObjBrowse.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
      this.BrandDisable = true;
    } else {
       //this.ObjBrowse.Brand_ID = undefined;
       this.ObjNsOTclosingStock.Brand_ID = undefined;
       this.BrandDisable = false;
    }
    //this.ObjBrowse.Brand_ID = undefined;
    //this.Searchedlist = [];
    //this.ObjIssueStockAd.Brand_ID = undefined;
    this.ObjNsOTclosingStock.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.getGodown();
    this.ObjNsOTclosingStock.godown_id = this.GodownId.length === 1 ? this.GodownId[0].godown_id : undefined;
     if(this.GodownId.length === 1){
       this.godowndisableflag = true;
     }else{
       this.godowndisableflag = false;
     }
    this.ObjNsOTclosingStock.Remarks = [];
    this.productlist = [];
    this.editList = [];
    this.docdate = undefined;
    this.getbilldate();
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
  }

}
class NsOTclosingStock {
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
