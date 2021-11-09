import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service"
import { ActivatedRoute, Router } from "@angular/router";

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
  myDate = new Date();
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
  minDate = new Date();
  maxDate = new Date();
  Doc_No = undefined;
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
  netamount: any;

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private route : ActivatedRoute,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    // this.route.queryParams.subscribe(params => {
    //   // console.log(params);
    //   this.clearData();
    //   this.Searchedlist = [];
    //   this.ObjBrowse.godown_id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
    //  if(this.GodownList.length === 1){
    //    this.Gbrowsedisableflag = true;
    //  }else{
    //    this.Gbrowsedisableflag = false;
    //  }
      //this.Param_Flag = params['Name'];
      //this.CostCentId_Flag = params['Cost_Cen_ID'];
      //this.MaterialType_Flag = params['Material_Type']
      // console.log (this.CostCentId_Flag);
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
        this.ChallanFilter.push({ label: [item.Doc_No +'-'+ item.Material_Type +'-'+ this.DateService.dateConvert(new Date(item.Doc_Date))], value: item.Doc_No });
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
    this.netamount = undefined;
    let totaltax = 0; 
    let totalcgst = 0;
    let totalsgst = 0;
    let totaligst = 0;
    let netamt = 0;
    this.ProductList.forEach(item => {
      totaltax = totaltax + Number(item.Taxable);
      totalcgst = totalcgst + Number(item.CGST_AMT);
      totalsgst = totalsgst + Number(item.SGST_AMT);
      totaligst = totaligst + Number(item.IGST_AMT);
      netamt = netamt + Number(item.Net_Amount);
    });
    this.taxable = (totaltax).toFixed(2);
    this.cgst = (totalcgst).toFixed(2);
    this.sgst = (totalsgst).toFixed(2);
    this.igst = (totaligst).toFixed(2);
    this.netamount = (netamt).toFixed(2);
    //console.log(this.Net_Amount);
  }
  
  Save(){}
  GetSearchedList(){}
  clearData(){
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.franchiseSalebillFormSubmitted = false;
    this.ObjfranchiseSalebill.Franchise = undefined;
    this.ChallanList = [];
    this.BackupChallanList = [];
    this.SelectedChallan = [];
    this.ChallanFilter = [];
    this.ProductList = [];
    //this.DocNo = undefined;
    //this.editDataList = [];
    //this.productListFilter = [];

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
