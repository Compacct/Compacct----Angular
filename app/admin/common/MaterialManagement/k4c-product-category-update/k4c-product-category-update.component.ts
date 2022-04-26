import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service"
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-k4c-product-category-update',
  templateUrl: './k4c-product-category-update.component.html',
  styleUrls: ['./k4c-product-category-update.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cProductCategoryUpdateComponent implements OnInit {
  FranchiseList = [];
  ObjBrowse : Browse = new Browse ();
  Searchedlist = [];
  BrowseFranchise : any;
  seachSpinner = false;
  Doc_No = undefined;
  franshisedisable = false;
  Cancle_Remarks : string;
  remarksFormSubmitted = false;
  ProductList = [];
  ProductTypeList = [];
  ProCatSearchFormSubmitted = false;
  todayDate = new Date();
  BrandList = [];

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
    this.Header.pushHeader({
      Header: " Product Category Update ", 
      Link: " Product Category Update "
    });
     this.GetBrand();
    //  this.GetProductType();
    //  this.GetProduct();
  }
  GetBrand(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Brand"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrandList = data;
      //this.Objproduction.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
       //console.log("Brand List ===",this.BrandList);
    })
  }
  GetProductType(){
    const tempObj = {
      brand_id : this.ObjBrowse.Brand_ID,
      Process_ID : 100,
      //Date : this.tadayDate
    }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "GET_Product_Type_Process_Wise",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ProductTypeList = data;
    })
  }
  GetProduct(){
     const TempObj = {
      Brand_ID : this.ObjBrowse.Brand_ID,
      Product_Type_ID : this.ObjBrowse.Product_Type_ID ? this.ObjBrowse.Product_Type_ID : 0,
      From_Cost_Cen_ID : 0,
      From_godown_id : 0,
      Doc_Type : "All",
      Date : this.DateService.dateConvert(new Date(this.todayDate)),
      //Req_No : this.SelectedIndent.toString()
        }
      const obj = {
        "SP_String": "SP_Production_Voucher_New",
        "Report_Name_String": "GET_Production_Products",
      "Json_Param_String": JSON.stringify([TempObj])
 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Description,
          element['value'] = element.Product_ID
        });
        this.ProductList = data;

      } else {
        this.ProductList = [];

      }
     console.log("this.ProductList======",this.ProductList);
 
 
     });
 
 
 
 }
 ProductChange(){}
  getBrowseDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  GetProCatSearchedList(valid){
    this.Searchedlist = [];
  const start = this.ObjBrowse.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
  : this.DateService.dateConvert(new Date());
if (valid) {
const tempobj = {
  From_Date : start,
  To_Date : end,
  Sub_Ledger_ID : this.BrowseFranchise ? this.BrowseFranchise : 0
}
const obj = {
  "SP_String": "SP_Franchise_Sale_Bill",
  "Report_Name_String": "Browse Credit Note",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
 })
}
  }
  onConfirm(valid){
  //   //this.Can_Remarks = true;
  //   this.remarksFormSubmitted = true;
  //  // if(this.Doc_No){
  //     const Tempdata = {
  //       Doc_No : this.Doc_No,
  //       User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
  //       Remarks : this.Cancle_Remarks
  //     }
  //     if (valid) {
  //     const objj = {
  //       "SP_String": "SP_Franchise_Sale_Bill",
  //       "Report_Name_String": "Delete Credit Note",
  //       "Json_Param_String": JSON.stringify([Tempdata])
  //     }
  //     this.GlobalAPI.getData(objj).subscribe((data:any)=>{
  //       if (data[0].Column1 === "Done"){
  //         //this.onReject();
  //         this.remarksFormSubmitted = false;
  //         this.GetSearchedList();
  //         this.compacctToast.clear();
  //         this.compacctToast.add({
  //           key: "compacct-toast",
  //           severity: "success",
  //           summary: "Doc No.: " + this.Doc_No.toString(),
  //           detail: "Succesfully Deleted"
  //         });
  //         // this.clearData();
  //   }
  //   else {
  //     this.compacctToast.clear();
  //     this.compacctToast.add({
  //       key: "compacct-toast",
  //       severity: "error",
  //       summary: "Warn Message",
  //       detail: "Error Occured "
  //     });
  //   }
  //   })
  //   }
  }
  onReject() {
    // this.compacctToast.clear("c");
  }
  // clearData(){
  //   this.items = ["BROWSE", "CREATE"];
  //   this.buttonname = "Save";
  //   this.franchiseSalebillFormSubmitted = false;
  //   this.ObjfranchiseSalebill.Franchise = undefined;
  //   this.ObjfranchiseSalebill.Remarks = undefined;
  //   this.ChallanList = [];
  //   this.BackupChallanList = [];
  //   this.SelectedChallan = [];
  //   this.ChallanFilter = [];
  //   this.ProductList = [];
  //   this.franshisedisable = false;
  //   //this.DocNo = undefined;
  //   //this.editDataList = [];
  //   //this.productListFilter = [];

  // }
  // Refresh(){
  //   this.items = ["BROWSE", "CREATE"];
  //   this.buttonname = "Save";
  //   this.franshisedisable = false;
  //   this.franchiseSalebillFormSubmitted = false;
  //   this.ObjfranchiseSalebill.Franchise = undefined;
  //   this.ObjfranchiseSalebill.Remarks = undefined;
  //   this.ChallanList = [];
  //   this.BackupChallanList = [];
  //   this.SelectedChallan = [];
  //   this.ChallanFilter = [];
  //   this.ProductList = [];
  // }

}
class Browse {
  start_date : Date ;
  end_date : Date;
  Brand_ID : string;
  Product_Type_ID : string;
  Product_ID : string;
}
