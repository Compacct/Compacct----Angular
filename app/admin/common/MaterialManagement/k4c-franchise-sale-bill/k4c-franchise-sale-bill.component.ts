import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service"
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-k4c-franchise-sale-bill',
  templateUrl: './k4c-franchise-sale-bill.component.html',
  styleUrls: ['./k4c-franchise-sale-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cFranchiseSaleBillComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false
  ShowSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  ObjfranchiseSalebill : franchiseSalebill = new franchiseSalebill ();
  franchiseSalebillFormSubmitted = false;
  ObjBrowse : Browse = new Browse ();
  RSNSSearchFormSubmitted = false;
  FranchiseList = [];
  GodownList = [];
  Costdisableflag = false;
  Gdisableflag = false;
  Costbrowsedisableflag = false;
  Gbrowsedisableflag = false;
  IndentListFormSubmitted = false;
  ChallanList = [];
  ProductList = [];
  SelectedChallan: any;
  BackupChallanList = [];
  ChallanFilter = [];
  TChallanList = [];
  Searchedlist = [];
  flag = false;
  productListFilter = [];
  SelectedProductType :any = [];
  Param_Flag ='';
  CostCentId_Flag : any;
  MaterialType_Flag = '';
  todayDate : any = new Date();
  currentDate : any = new Date();
  minDate = new Date();
  maxDate = new Date();
  Doc_No : any;
  Editlist = [];
  ViewList = [];
  ViewPoppup = false;
  Doc_date = undefined;
  Cost_Cent_ID = undefined;
  Godown_ID = undefined;
  MaterialType = undefined;
  remarks = undefined;
  datepickerdisable = false;
  Net_Amount: any;
  taxable: any;
  cgst: any;
  sgst: any;
  igst: any;
  grossamount: any;
  netamount: any;
  Round_Off: any;
  franshisedisable = false;

  BrowseFranchise : any;
  Cancle_Remarks : string;
  remarksFormSubmitted = false;
  //Can_Remarks = false;

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private route : ActivatedRoute,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: " Franchise Sale Bill ", 
      Link: " Franchise Sale Bill "
    });
     this.GetFranchiseList();
    // this.GetProductType();
    // this.minDate = new Date(this.todayDate.getDate());
    // this.maxDate = new Date(this.todayDate.getDate());
  //})
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Save";
     this.clearData();
    //  this.BackupIndentList = [];
    //  this.TIndentList = [];
    //  this.SelectedIndent = [];
   }
  GetFranchiseList(){
    // const tempObj = {
    //   Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    //   //Material_Type : this.MaterialType_Flag
    // }
    const obj = {
      "SP_String": "SP_Franchise_Sale_Bill",
      "Report_Name_String": "Get Franchise",
      //"Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.FranchiseList = data;
      const ctrl = this;
     const Obj = $.grep(ctrl.FranchiseList,function(item) {return item.Cost_Cen_ID == ctrl.$CompacctAPI.CompacctCookies.Cost_Cen_ID})[0];
        if(this.$CompacctAPI.CompacctCookies.User_Type != 'A' && Obj.Cost_Cen_ID == this.$CompacctAPI.CompacctCookies.Cost_Cen_ID){
          this.ObjfranchiseSalebill.Franchise = Obj.Sub_Ledger_ID;
          this.BrowseFranchise = Obj.Sub_Ledger_ID;
        this.franshisedisable = true;
        this.FranchiseChange();
        } else {
         this.ObjfranchiseSalebill.Franchise = undefined;
         this.BrowseFranchise = undefined;
         this.franshisedisable = false;
         this.FranchiseChange();
        }
      // if(this.$CompacctAPI.CompacctCookies.User_Type != 'A' && this.ObjfranchiseSalebill.Cost_Cen_ID == this.$CompacctAPI.CompacctCookies.Cost_Cen_ID){
      //   //this.ObjBrowseStockView.Outlet = this.Outletid.length === 1 ? this.Outletid[0].Cost_Cen_ID : undefined;
      //   this.ObjfranchiseSalebill.Franchise = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      //   this.franshisedisable = true;
      //   this.FranchiseChange();
      //   } else {
      //    this.ObjfranchiseSalebill.Franchise = undefined;
      //    this.franshisedisable = false;
      //    this.FranchiseChange();
      //   }
      console.log("this.FranchiseList ===", this.FranchiseList)
      // this.FranchiseList.forEach(item => {
      //   item.Cost_Cen_ID = this.ObjfranchiseSalebill.Cost_Cen_ID
      // });
     })
  }
  FranchiseChange() {
   if(this.ObjfranchiseSalebill.Franchise) {
     const ctrl = this;
     const franchisecostcentObj = $.grep(ctrl.FranchiseList,function(item) {return item.Sub_Ledger_ID == ctrl.ObjfranchiseSalebill.Franchise})[0];
     console.log(franchisecostcentObj);
     this.ObjfranchiseSalebill.Cost_Cen_ID = franchisecostcentObj.Cost_Cen_ID;
    }
    }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjfranchiseSalebill.start_date = dateRangeObj[0];
      this.ObjfranchiseSalebill.end_date = dateRangeObj[1];
    }
  }
  GetChallanList(valid){
    this.franchiseSalebillFormSubmitted = true;
    this.ProductList = [];
    const start = this.ObjfranchiseSalebill.start_date
    ? this.DateService.dateConvert(new Date(this.ObjfranchiseSalebill.start_date))
    : this.DateService.dateConvert(new Date());
    const end = this.ObjfranchiseSalebill.end_date
    ? this.DateService.dateConvert(new Date(this.ObjfranchiseSalebill.end_date))
    : this.DateService.dateConvert(new Date());
    if(valid){
    const TempObj = {
      Cost_Cen_ID : this.ObjfranchiseSalebill.Cost_Cen_ID,
      From_Date : start,
      To_Date : end,
     }
   const obj = {
    "SP_String": "SP_Franchise_Sale_Bill",
    "Report_Name_String" : "Get Challan_No",
   "Json_Param_String": JSON.stringify([TempObj])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ChallanList = data;
      this.BackupChallanList = data;
    this.franchiseSalebillFormSubmitted = false;
    this.franshisedisable = true;
   console.log("this.ChallanList======",this.ChallanList);
   this.GetChallan();
  })
  }
  }
  GetChallan(){
    let DIndent = [];
    this.ChallanFilter = [];
    this.SelectedChallan = [];
    this.BackupChallanList.forEach((item) => {
      if (DIndent.indexOf(item.Doc_No) === -1) {
        DIndent.push(item.Doc_No);
        var advno;
        if(item.Material_Type === "Advance Order") {
          advno = '('+ item.Adv_Order_No +')';
        } else {
          advno = '';
        }
        this.ChallanFilter.push({ label: [item.Doc_No +'-'+ item.Material_Type +'-'+ this.DateService.dateConvert(new Date(item.Doc_Date))]  + advno, value: item.Doc_No });
        console.log("this.IndentFilter", this.ChallanFilter);
      }
    });
    this.BackupChallanList = [...this.ChallanList];
  }
  filterChallanList() {
    //console.log("SelectedTimeRange", this.SelectedTimeRange);
    let DChallan = [];
    this.TChallanList = [];
    //const temparr = this.ProductList.filter((item)=> item.Issue_Qty);
    this.ProductList = [];
    //this.GetProduct(temparr.length ? temparr : []);
    this.GetProduct();
    if (this.SelectedChallan.length) {
      this.TChallanList.push('Doc_No');
      DChallan = this.SelectedChallan;
    }
    this.ChallanList = [];
    if (this.TChallanList.length) {
      let LeadArr = this.BackupChallanList.filter(function (e) {
        return (DChallan.length ? DChallan.includes(e['Doc_No']) : true)
      });
      this.ChallanList = LeadArr.length ? LeadArr : [];
    } else {
      this.ChallanList = [...this.BackupChallanList];
      console.log("else Get Challan list", this.ChallanList)
    }

  }
  dataforproduct(){
    const start = this.ObjfranchiseSalebill.start_date
    ? this.DateService.dateConvert(new Date(this.ObjfranchiseSalebill.start_date))
    : this.DateService.dateConvert(new Date());
    const end = this.ObjfranchiseSalebill.end_date
    ? this.DateService.dateConvert(new Date(this.ObjfranchiseSalebill.end_date))
    : this.DateService.dateConvert(new Date());
    if(this.SelectedChallan.length) {
      let Arr =[]
      this.SelectedChallan.forEach(el => {
        if(el){
          const Dobj = {
            Doc_No : el,
            Cost_Cen_ID : this.ObjfranchiseSalebill.Cost_Cen_ID,
            From_Date : start,
            To_Date : end
            }
      Arr.push(Dobj)
        }

    });
      console.log("Table Data ===", Arr)
      return Arr.length ? JSON.stringify(Arr) : '';
    }
  }
  GetProduct(){
    // const TempObj = {
    //   Cost_Cen_ID : this.ObjRawMateriali.From_Cost_Cen_ID,
    //   Godown_ID : this.ObjRawMateriali.From_godown_id,
    //  }
   // this.ProductList = [];
    if(this.dataforproduct()){
   const obj = {
    "SP_String": "SP_Franchise_Sale_Bill",
    "Report_Name_String" : "Get Franchise Bill Ageinst Challan",
    "Json_Param_String": this.dataforproduct()
   //"Json_Param_String": JSON.stringify([TempObj])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // if(arr.length) {
    //   arr.forEach(elem => {
    //    data.forEach( item =>{
    //       if(Number(item.Product_ID) === Number(elem.Product_ID)){
    //         item.Issue_Qty = elem.Issue_Qty
    //       }
    //     });
    //   })
    // }
    this.ProductList = data;
   console.log("this.ProductList======",this.ProductList);
    this.calculateTotalAmt();

  });
}
  }
  // calculatenetamount(){
  //   this.Net_Amount = undefined;
  //   let netamt = 0;
  //   this.ProductList.forEach(item => {
  //     netamt = Number(item.Taxable) + Number(item.CGST_AMT) + Number(item.SGST_AMT) + Number(item.IGST_AMT);
  //   });
  //   this.Net_Amount = (netamt).toFixed(2);
  //   console.log(this.Net_Amount);
  // }
  calculateTotalAmt(){
    this.taxable = undefined;
    this.cgst = undefined;
    this.sgst = undefined;
    this.igst = undefined;
    this.grossamount = undefined;
    let totaltax = 0; 
    let totalcgst = 0;
    let totalsgst = 0;
    let totaligst = 0;
    let grossamt = 0;
    this.ProductList.forEach(item => {
      totaltax = totaltax + Number(item.Taxable);
      totalcgst = totalcgst + Number(item.CGST_AMT);
      totalsgst = totalsgst + Number(item.SGST_AMT);
      totaligst = totaligst + Number(item.IGST_AMT);
      grossamt = grossamt + Number(item.Net_Amount);
    });
    this.taxable = (totaltax).toFixed(2);
    this.cgst = (totalcgst).toFixed(2);
    this.sgst = (totalsgst).toFixed(2);
    this.igst = (totaligst).toFixed(2);
    this.grossamount = (grossamt).toFixed(2);
    // Round Off
    this.Round_Off = (Number(this.grossamount) - Math.round(this.grossamount)).toFixed(2);
    this.netamount = Math.round(this.grossamount);
    //console.log(this.Net_Amount);
  }
  getChallanNoforSave(){
    if(this.SelectedChallan.length) {
      let Rarr =[]
      this.SelectedChallan.forEach(el => {
        if(el){
          const Dobj = {
            Order_No : el
            }
            Rarr.push(Dobj)
        }

    });
      console.log("Table Data ===", Rarr)
      return Rarr.length ? JSON.stringify(Rarr) : '';
    }
  }
  dataforSaveFran(){
    this.currentDate = this.DateService.dateConvert(new Date(this.currentDate));
    if(this.ProductList.length) {
      let tempArr =[]
      this.ProductList.forEach(item => {
       // if(item.Issue_Qty && Number(item.Issue_Qty) != 0) {
     const TempObj = {
            Doc_No:  "A",
            Doc_Date: this.currentDate,
            Sub_Ledger_ID : Number(this.ObjfranchiseSalebill.Franchise),
            Cost_Cen_ID	: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
            Product_ID	: item.Product_ID,
            Product_Name	: item.Product_Description,
            Qty	: item.Qty,
            UOM	: item.UOM,
            MRP : item.Sale_rate,
            Rate : item.Sale_rate,
            Amount : Number(item.Qty) * Number(item.Sale_rate),
            Discount : 0,
            Taxable_Amount : item.Taxable,
            CAT_ID : item.Cat_ID,
            CGST_OUTPUT_LEDGER_ID : item.CGST_Output_Ledger_ID,
            CGST_Rate : item.CGST_PER,
            CGST_Amount : item.CGST_AMT,
            SGST_OUTPUT_LEDGER_ID : item.SGST_Output_Ledger_ID,
            SGST_Rate : item.SGST_PER,
            SGST_Amount : item.SGST_AMT,
            IGST_OUTPUT_LEDGER_ID : item.IGST_Output_Ledger_ID,
            IGST_Rate : item.IGST_PER,
            IGST_Amount : item.IGST_AMT,
            Bill_Gross_Amt : Number(this.taxable),
            Rounded_Off : Number(this.Round_Off),
            Bill_Net_Amt : this.netamount,
            User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
            Remarks : this.ObjfranchiseSalebill.Remarks,
            Fin_Year_ID : Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID),
            Total_Taxable : Number(this.taxable),
            Total_CGST_Amt : Number(this.cgst),
            Total_SGST_Amt : Number(this.sgst),
            Total_IGST_Amt : Number(this.igst),
            Total_Net_Amt : this.netamount,
            HSL_No : item.HSN_NO
         }
      tempArr.push(TempObj)
      });
      console.log("Save Data ===", tempArr)
      return JSON.stringify(tempArr);

    }
  }
  SaveFranSaleBill(){
      const obj = {
        "SP_String" : "SP_Franchise_Sale_Bill",
        "Report_Name_String" : "Save_Franchise_Sale_Bill",
        "Json_Param_String" : this.dataforSaveFran(),
        "Json_1_String" : this.getChallanNoforSave()

      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        //console.log(data);
        var tempID = data[0].Column1;
        console.log("After Save",tempID);
       // this.Objproduction.Doc_No = data[0].Column1;
        if(data[0].Column1){
          this.compacctToast.clear();
          const mgs = this.buttonname === "Save" ? "Saved" : "Updated";
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Production Voucher  " + tempID,
           detail: "Succesfully  " + mgs
         });
        // this.GetSearchedList();
         this.clearData();
        //  this.ProductList =[];
        //  this.franchiseSalebillFormSubmitted = false;
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
  getBrowseDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  GetSearchedList(){
    this.Searchedlist = [];
    this.seachSpinner = true;
  const start = this.ObjBrowse.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
  : this.DateService.dateConvert(new Date());

const tempobj = {
  From_Date : start,
  To_Date : end,
  Sub_Ledger_ID : this.BrowseFranchise ? this.BrowseFranchise : 0
}
const obj = {
  "SP_String": "SP_Franchise_Sale_Bill",
  "Report_Name_String": "Browse Franchise Sale Challan",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
 })
  }
  Delete(col){
    this.Cancle_Remarks = undefined;
    this.remarksFormSubmitted = false;
    this.Doc_No = undefined;
  if(col.Doc_No){
    //this.Can_Remarks = true;
    this.Doc_No = col.Doc_No;
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
  onConfirm(valid){
    //this.Can_Remarks = true;
    this.remarksFormSubmitted = true;
   // if(this.Doc_No){
    this.ngxService.start();
      const Tempdata = {
        Doc_No : this.Doc_No,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
        Remarks : this.Cancle_Remarks
      }
      if (valid) {
      const objj = {
        "SP_String": "SP_Franchise_Sale_Bill",
        "Report_Name_String": "Delete Franchise Sale Bill",
        "Json_Param_String": JSON.stringify([Tempdata])
      }
      this.GlobalAPI.getData(objj).subscribe((data:any)=>{
        if (data[0].Column1 === "Done"){
          //this.onReject();
          this.remarksFormSubmitted = false;
          this.GetSearchedList();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Doc No.: " + this.Doc_No.toString(),
            detail: "Succesfully Deleted"
          });
          this.clearData();
          this.ngxService.stop();
    }
    else {
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
    }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  PrintBill(obj) {
    if (obj.Doc_No) {
      window.open("/Report/Crystal_Files/Finance/SaleBill/Sale_Bill_GST_K4C.aspx?Doc_No=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
  
      );
    }
  }
  DownloadEINV(obj) {
    if (obj) {
        window.open(obj, '_self');
      
    }
  }
  clearData(){
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.franchiseSalebillFormSubmitted = false;
   // this.ObjfranchiseSalebill.Franchise = undefined;
   const ctrl = this;
     const Obj = $.grep(ctrl.FranchiseList,function(item) {return item.Cost_Cen_ID == ctrl.$CompacctAPI.CompacctCookies.Cost_Cen_ID})[0];
        if(this.$CompacctAPI.CompacctCookies.User_Type != 'A' && Obj.Cost_Cen_ID == this.$CompacctAPI.CompacctCookies.Cost_Cen_ID){
          this.ObjfranchiseSalebill.Franchise = Obj.Sub_Ledger_ID;
          this.BrowseFranchise = Obj.Sub_Ledger_ID;
        this.franshisedisable = true;
        this.FranchiseChange();
        } else {
         this.ObjfranchiseSalebill.Franchise = undefined;
         this.BrowseFranchise = undefined;
         this.franshisedisable = false;
         this.FranchiseChange();
        }
    this.ObjfranchiseSalebill.Remarks = undefined;
    this.ChallanList = [];
    this.BackupChallanList = [];
    this.SelectedChallan = [];
    this.ChallanFilter = [];
    this.ProductList = [];
    this.franshisedisable = false;
    //this.DocNo = undefined;
    //this.editDataList = [];
    //this.productListFilter = [];

  }
  Refresh(){
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.franshisedisable = false;
    this.franchiseSalebillFormSubmitted = false;
    this.ObjfranchiseSalebill.Franchise = undefined;
    this.ObjfranchiseSalebill.Remarks = undefined;
    this.ChallanList = [];
    this.BackupChallanList = [];
    this.SelectedChallan = [];
    this.ChallanFilter = [];
    this.ProductList = [];
  }

}
class Browse {
  start_date : Date ;
  end_date : Date;
}
class franchiseSalebill {
  Franchise : string;
  start_date : Date ;
  end_date : Date;
  Cost_Cen_ID : number;
  Remarks : string;
}
