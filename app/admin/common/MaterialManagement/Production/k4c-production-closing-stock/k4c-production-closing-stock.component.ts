import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service"
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-k4c-production-closing-stock',
  templateUrl: './k4c-production-closing-stock.component.html',
  styleUrls: ['./k4c-production-closing-stock.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cProductionClosingStockComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  ShowSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  myDate = new Date();
  ObjProClosingStock : ProClosingStock = new ProClosingStock ();
  ProClosingStockFormSubmitted = false;
  ObjBrowse : Browse = new Browse ();
  CostCenList:any = [];
  GodownList:any = [];
  Bcostcenlist:any = [];
  BGodownList:any = [];
  Costdisableflag = false;
  Gdisableflag = false;
  IndentListFormSubmitted = false;
  IndentList:any = [];
  ProductList:any = [];
  SelectedIndent: any;
  BackupIndentList:any = [];
  IndentFilter:any = [];
  TIndentList:any = [];
  Searchedlist:any = [];
  flag = false;
  productListFilter:any = [];
  SelectedProductType :any = [];
  Param_Flag ='';
  CostCentId_Flag : any;
  MaterialType_Flag = '';
  TCdisableflag = false;
  todayDate = new Date();
  initDate:any = [];
  ProClosingStockSearchFormSubmitted = false;
  ToBcostcenlist:any = [];
  ToBGodownList:any = [];
  BCdisableflag = false;
  BGdisableflag = false;
  ViewPoppup = false;
  Viewlist:any = [];
  Doc_date: any;
  Formstockpoint: any;
  Tostockpoint: any;

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
    this.route.queryParams.subscribe(params => {
      // console.log(params);
      this.clearData();
      this.Searchedlist = [];
      this.BackupIndentList = [];
     this.TIndentList = [];
     this.SelectedIndent = [];
      this.Param_Flag = params['Name'];
      this.CostCentId_Flag = params['Cost_Cen_ID'];
      this.MaterialType_Flag = params['Material_Type']
       console.log (this.CostCentId_Flag);
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Production Closing Stock  - " + this.MaterialType_Flag, //this.MaterialType_Flag + 
      Link: " Material Management -> Production Closing Stock - " + this.MaterialType_Flag
    });
    this.GetCostCen();
    this.GetBCostCen();
    this.GetProductType();
  })
  }
  
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Save";
     this.clearData();
     this.BackupIndentList = [];
     this.TIndentList = [];
     this.SelectedIndent = [];
   }
   onReject() {
    this.compacctToast.clear("c");
  }
   GetCostCen(){
    const tempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Material_Type : this.MaterialType_Flag ? this.MaterialType_Flag : 'NA'
    }
    const obj = {
      "SP_String": "SP_Production_Closing_Stock",
      "Report_Name_String": "Get Cost Centre Non outlet",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.CostCenList = data;
     this.ObjProClosingStock.Cost_Cen_ID = 2;
    //  this.ObjBrowse.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;//String(this.CostCentId_Flag);
      this.GetGodown();
     })
  }

  GetGodown(){
    this.GodownList = [];
    if(this.ObjProClosingStock.Cost_Cen_ID){
      const tempObj = {
        Cost_Cen_ID : this.ObjProClosingStock.Cost_Cen_ID,
        Material_Type : this.MaterialType_Flag ? this.MaterialType_Flag : 'NA'
      }
      const obj = {
        "SP_String": "SP_Production_Closing_Stock",
        "Report_Name_String": "Get - Godown",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.GodownList = data;
        this.ObjProClosingStock.godown_id = 4;
      //   this.ObjProClosingStock.godown_id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
      //  if(this.GodownList.length === 1){
      //    this.Gdisableflag = true;
      //  }else{
      //    this.Gdisableflag = false;
      //  }
         //console.log("From Godown List ===",this.FromGodownList);
         
      })
    }

  }
  GetBCostCen(){
    const obj = {
      "SP_String": "SP_Raw_Material_Stock_Transfer",
      "Report_Name_String": "Get Cost Centre Non outlet",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Bcostcenlist = data;
      this.ObjBrowse.Cost_Cen_ID = 2;
      console.log("B Cost Cen List ===",this.Bcostcenlist);
      this.GetBGodown();
    })
  }
  GetBGodown(){
    this.BGodownList = [];
    //if(this.ObjBrowse.To_Cost_Cen_ID){
      const tempObj = {
        Cost_Cen_ID : this.ObjBrowse.Cost_Cen_ID,
        Material_Type : this.MaterialType_Flag
      }
      const obj = {
        "SP_String": "SP_Raw_Material_Stock_Transfer",
        "Report_Name_String": "Get - Godown",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.BGodownList = data;
      // this.ObjBrowse.godown_id = this.BGodownList.length === 1 ? this.BGodownList[0].godown_id : undefined;
      this.ObjBrowse.godown_id = 4
      // if(this.GodownList.length === 1){
      //   //this.ObjRawMateriali.To_godown_id = this.ToGodownList[0].godown_id;
      //   this.ObjBrowse.godown_id = this.GodownList[0].godown_id;
      //    this.BGdisableflag = true;
      //  }else{
      //  // this.ObjRawMateriali.To_godown_id = undefined;
      //   this.ObjBrowse.godown_id = undefined;
      //    this.BGdisableflag = false;
      //  }
       //console.log("To Godown List ===",this.ToGodownList);
      })
    //}

  }

  // FOR PRODUCT TABLE
  GetProduct(valid){
    this.ProClosingStockFormSubmitted = true;
    if(valid){
      this.ShowSpinner = true;
    const TempObj = {
      Cost_Cen_ID : this.ObjProClosingStock.Cost_Cen_ID ? this.ObjProClosingStock.Cost_Cen_ID : 0,
      Godown_ID : this.ObjProClosingStock.godown_id ? this.ObjProClosingStock.godown_id : 0,
      Material_Type : this.MaterialType_Flag ? this.MaterialType_Flag : 'NA'
     }
   const obj = {
    "SP_String": "SP_Production_Closing_Stock",
    "Report_Name_String" : "Get Product",
   "Json_Param_String": JSON.stringify([TempObj])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   const tempData = data
   tempData.forEach(element => {
    // element['Issue_Qty'] = undefined;
    element['Wastage_Qty'] = undefined;
    element['remarkdisabled'] = true;
    element['Remarks'] = undefined;
 });
   this.ProductList = tempData;
   this.ShowSpinner = false;
   this.BackupIndentList = tempData;
    this.ProClosingStockFormSubmitted = false;
    this.GetProductType();
   console.log("this.ProductList======",this.ProductList);
   })
  }
  }
  // product Filter

  filterProduct(){
    if(this.SelectedProductType.length){
      let tempProduct:any = [];
      this.SelectedProductType.forEach(item => {
        this.BackupIndentList.forEach((el,i)=>{

          const ProductObj = this.BackupIndentList.filter((elem) => elem.Product_Type == item)[i];
          //const ProductObj = el;
         // console.log("ProductObj",ProductObj);
          if(ProductObj)
          tempProduct.push(ProductObj)
        })
        })
     this.ProductList  = [...tempProduct];
   }
    else {
    this.ProductList  = [...this.BackupIndentList];

    }
  }
GetProductType(){
  let DOrderBy:any = [];
    this.productListFilter = [];
    //this.SelectedDistOrderBy1 = [];
    this.BackupIndentList.forEach((item) => {
      if (DOrderBy.indexOf(item.Product_Type) === -1) {
        DOrderBy.push(item.Product_Type);
        //this.SelectedProductType.push(item.Product_Type);
        this.productListFilter.push({ label: item.Product_Type, value: item.Product_Type });
       // console.log("this.productListFilter", this.productListFilter);
      }
    });
}
ChangeRemarks(obj){
  console.log("Change Remarks")
   this.ProductList.forEach(el=>{
     if(obj.Product_ID === el.Product_ID){
      if(obj.Wastage_Qty){
        obj.remarkdisabled = false;
       } else {
        obj.remarkdisabled = true;
       }
     }

   })
}
saveRemarks(){
  let flag = true;
  let ExitsProduct = []
 for(let i = 0; i < this.ProductList.length;i++){
      if(this.ProductList[i]['remarkdisabled'] === false){
        //flag = false;
        if(this.ProductList[i]['Remarks'] === undefined){
          // this.ngxService.stop();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Enter Reason"
          });
          flag = false;
          break ;
        }
        }
  }


  return flag;
}

  // GET PRODUCT LIST
  dataforproduct(){
    if(this.SelectedIndent.length) {
      let Arr:any =[]
      this.SelectedIndent.forEach(el => {
        if(el){
          const Dobj = {
            Doc_No : el,
            Cost_Cen_ID : this.ObjProClosingStock.Cost_Cen_ID,
            Godown_ID : this.ObjProClosingStock.godown_id,
            Material_Type : this.MaterialType_Flag
            }
      Arr.push(Dobj)
        }

    });
      console.log("Table Data ===", Arr)
      return Arr.length ? JSON.stringify(Arr) : '';
    }
  }
//   GetProduct(arr){
//     // const TempObj = {
//     //   Cost_Cen_ID : this.ObjRawMateriali.From_Cost_Cen_ID,
//     //   Godown_ID : this.ObjRawMateriali.From_godown_id,
//     //  }
//     if(this.dataforproduct()){
//    const obj = {
//     "SP_String": "SP_Raw_Material_Issue",
//     "Report_Name_String" : "Get Product",
//     "Json_Param_String": this.dataforproduct()
//    //"Json_Param_String": JSON.stringify([TempObj])

//   }
//   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
//     if(arr.length) {
//       arr.forEach(elem => {
//        data.forEach( item =>{
//           if(Number(item.Product_ID) === Number(elem.Product_ID)){
//             item.Issue_Qty = elem.Issue_Qty
//           }
//         });
//       })
//     }
//     this.ProductList = data;
//    console.log("this.ProductList======",this.ProductList);


//   });
// }
//   }
  qtyChq(col){
    this.flag = false;
    console.log("col",col);
    if(col.Issue_Qty){
      if(col.Issue_Qty <=  col.Batch_Qty){
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
   saveqty(){
    let flag = true;
   for(let i = 0; i < this.ProductList.length ; i++){
    if(Number(this.ProductList[i].Batch_Qty) <  Number(this.ProductList[i].Issue_Qty)){
      flag = false;
      break;
    }
   }
   return flag;
  }
  // SAVE AND UPDATE
  dataforSaveRawMaterialIssue(){
    // console.log(this.DateService.dateConvert(new Date(this.myDate)))
     this.ObjProClosingStock.Doc_Date = this.DateService.dateConvert(new Date(this.todayDate));
    if(this.ProductList.length) {
      // if(this.saveRemarks()){
      let tempArr:any =[]
      this.ProductList.forEach(item => {
        // if(item.Wastage_Qty && Number(item.Wastage_Qty) != 0) {
     const TempObj = {
            Doc_No:  this.ObjProClosingStock.Doc_No ?  this.ObjProClosingStock.Doc_No : "A",
            Doc_Date: this.ObjProClosingStock.Doc_Date,
            Cost_Cen_ID :this.ObjProClosingStock.Cost_Cen_ID,
            Godown_ID	: this.ObjProClosingStock.godown_id,
            Material_Type : this.MaterialType_Flag ? this.MaterialType_Flag : 'NA',
            Product_ID	: item.Product_ID,
            Product_Description	: item.Product_Description,
            Product_Type_ID	: item.Product_Type_ID,
            Closing_Qty	: item.Closing_Qty,
            Wastage_Qty : item.Wastage_Qty ? item.Wastage_Qty : 0,
            UOM	: item.UOM,
            Remarks	: item.Remarks,
            Created_By	:this.$CompacctAPI.CompacctCookies.User_ID,
            // Created_On : item.Batch_No
         }
        tempArr.push(TempObj)
      // }
      });
      console.log("Save Data ===", tempArr)
      return JSON.stringify(tempArr);

    // }
    }
  }
  SaveRawMaterialIssue(){
    // if(this.ObjProClosingStock.From_Cost_Cen_ID == this.ObjProClosingStock.To_Cost_Cen_ID &&
    //   this.ObjProClosingStock.From_godown_id == this.ObjProClosingStock.To_godown_id){
    //   this.compacctToast.clear();
    //     this.compacctToast.add({
    //       key: "compacct-toast",
    //       severity: "error",
    //       summary: "Warn Message",
    //       detail: "can't use same stock point with respect to same cost centre"
    //     });
    //     return false;
    // }
    // if(this.saveqty()){
      if(this.saveRemarks()){
      const obj = {
        "SP_String": "SP_Production_Closing_Stock",
        "Report_Name_String" : "Save_Production_Closing_Stock",
       "Json_Param_String": this.dataforSaveRawMaterialIssue()

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
         this.tabIndexToView = 0 ;
         this.items = ["BROWSE", "CREATE"];
         this.buttonname = "Save";
         this.GetSearchedList(true);
         this.clearData();
         this.ProductList =[];
         this.IndentListFormSubmitted = false;
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
    // else{
    //   this.compacctToast.clear();
    //   this.compacctToast.add({
    //       key: "compacct-toast",
    //       severity: "error",
    //       summary: "Warn Message",
    //       detail: "Quantity can't be more than in batch available quantity "
    //     });
    // }

  }


  // FOR BROWSE
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  GetSearchedList(valid){
    this.Searchedlist = [];
  const start = this.ObjBrowse.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
  : this.DateService.dateConvert(new Date());

  this.ProClosingStockSearchFormSubmitted = true;
  if (valid){
const tempobj = {
  From_date : start,
  To_Date : end,
  Cost_Cen_ID : this.ObjBrowse.Cost_Cen_ID ? this.ObjBrowse.Cost_Cen_ID : 0,
  Godown_ID : this.ObjBrowse.godown_id ? this.ObjBrowse.godown_id : 0,
  Material_Type : this.MaterialType_Flag ? this.MaterialType_Flag : 'NA'

}
const obj = {
  "SP_String": "SP_Production_Closing_Stock",
  "Report_Name_String": "Browse_Production_Closing_Stock",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
   this.ProClosingStockSearchFormSubmitted = false;
 })
}
}

  clearData(){
    this.ObjProClosingStock.Cost_Cen_ID = 2;
    this.ObjProClosingStock.godown_id = 4;
    // this.GetGodown();
    this.ObjBrowse.Cost_Cen_ID = 2;
    this.ObjBrowse.godown_id = 4;
    // this.GetBGodown();
    // this.ObjProClosingStock.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    // FOR CREATE TAB
    // if (this.CostCentId_Flag) {
      // this.ObjProClosingStock.Cost_Cen_ID = String(this.CostCentId_Flag);
      // this.Cdisableflag = true;
      // this.GetGodown();
      // this.ObjBrowse.To_Cost_Cen_ID = String(this.CostCentId_Flag);
      // this.TBCdisableflag = true;
      // this.GetBToGodown();
      // } 
      // else {
      //   this.ObjProClosingStock.Cost_Cen_ID = undefined;
      //   //this.ObjRawMateriali.To_godown_id = undefined;
      //   this.TCdisableflag = false;
      //   this.GetGodown();
      //   this.ObjBrowse.To_Cost_Cen_ID = undefined;
      //   this.TBCdisableflag = false;
      //   this.GetBToGodown();
      // }
      // FOR CREATE TAB
      
      // FOR BROWSE
      // if (this.CostCentId_Flag) {
      //   this.ObjBrowse.To_Cost_Cen_ID = String(this.CostCentId_Flag);
      //   this.TBCdisableflag = true;
      //   this.GetBToGodown();
      //   } else {
      //     this.ObjBrowse.To_Cost_Cen_ID = undefined;
      //     //this.ObjRawMateriali.To_godown_id = undefined;
      //     this.TBCdisableflag = false;
      //     this.GetBToGodown();
      //   }
        // FOR BROWSE

    // this.ObjProClosingStock.godown_id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
    //  if(this.GodownList.length === 1){
    //    this.Gdisableflag = true;
    //  }else{
    //    this.Gdisableflag = false;
    //  }
    // this.GetToGodown();
    // FOR CREATE TAB
    //  this.ObjRawMateriali.To_godown_id = this.ToGodownList.length === 1 ? this.ToGodownList[0].godown_id : undefined;
    //  if(this.ToGodownList.length === 1){
    //    this.TGdisableflag = true;
    //  }else{
    //    this.TGdisableflag = false;
    //  }
     // FOR CREATE TAB

     // FOR BROWSE TAB
    //  this.ObjBrowse.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    //  this.ObjBrowse.godown_id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
    //  if(this.GodownList.length === 1){
    //    this.BGdisableflag = true;
    //  }else{
    //    this.BGdisableflag = false;
    //  }
     // FOR BROWSE TAB

    this.ObjProClosingStock.Remarks = [];
    this.ObjProClosingStock.Indent_List = undefined;
    this.ProductList = [];
    this.IndentList = [];
    this.BackupIndentList = [];
    this.TIndentList = [];
    this.SelectedIndent = [];
    this.IndentFilter = [];
    // Product Filter
    this.SelectedProductType = [];
    this.ShowSpinner = false;
    this.ObjProClosingStock.Doc_No = undefined;
    this.todayDate = new Date();
    this.ProClosingStockSearchFormSubmitted = false;

  }
  // View
  View(DocNo){
    this.Viewlist = [];
    this.ObjProClosingStock.Doc_No = undefined;
    this.Doc_date = undefined;
    this.Formstockpoint = undefined;
    this.Tostockpoint = undefined;
    if(DocNo.Doc_No){
      this.ObjProClosingStock.Doc_No = DocNo.Doc_No;
      this.Doc_date = DocNo.Doc_Date;
      this.Formstockpoint = DocNo.From_Godown_Name;
      this.Tostockpoint = DocNo.To_Godown_Name;
    // this.AuthPoppup = true;
    this.ViewPoppup = true;
    //this.tabIndexToView = 1;
     //console.log("this.EditDoc_No ", this.Adv_Order_No );
     this.geteditmaster(DocNo.Doc_No)
    }
  }
// Edit
EditIntStock(col){
  this.ObjProClosingStock.Doc_No = undefined;
  if(col.Doc_No){
   this.ObjProClosingStock = col.Doc_No;
   this.tabIndexToView = 1;
   this.ProductList = [];
   this.BackupIndentList = [];
   this.items = ["BROWSE", "UPDATE"];
   this.buttonname = "Update";
   this.geteditmaster(col.Doc_No)
  }

}
geteditmaster(Doc_No){
  const obj = {
    "SP_String": "SP_Raw_Material_Stock_Transfer",
  "Report_Name_String": "Get Raw Material Stock Transfer For Edit",
    "Json_Param_String": JSON.stringify([{Doc_No:Doc_No}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("Edit",data);
    this.Viewlist = data;
    const TempData = data;
    this.todayDate = new Date(data[0].Doc_Date);
    this.ObjProClosingStock = data[0];
    TempData.forEach(element => {
      this.ProductList.push({
        Current_Stock_In_Dept:element.Current_Stock_In_Dept,
        Issue_Qty:element.Qty,
        Product_Description:element.Product_Description,
        Product_ID:element.Product_ID,
        Product_Type:element.Product_Type,
        Product_Type_ID:element.Product_Type_ID,
        Stock_Qty:element.Stock_Qty,
        UOM : element.UOM,
        Batch_No : element.Batch_No,
        Batch_Qty : element.Batch_Qty
      })
     });
     this.BackupIndentList = this.ProductList;
     this.GetProductType();
  })
}
// Delete
DeleteIntStocktr(col){
  this.ObjProClosingStock.Doc_No = undefined;
  if(col.Doc_No){
    this.ObjProClosingStock.Doc_No = col.Doc_No;
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
  if(this.ObjProClosingStock.Doc_No){
    const Tempdata = {
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
      Doc_No : this.ObjProClosingStock.Doc_No
    }
    const objj = {
      "SP_String": "SP_Raw_Material_Stock_Transfer",
      "Report_Name_String": "Delete Raw Material Stock Transfer",
      "Json_Param_String": JSON.stringify([Tempdata])
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
      if (data[0].Column1 === "Done"){
        this.onReject();
        this.GetSearchedList(true);
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Doc No.: " + this.ObjProClosingStock.Doc_No.toString(),
          detail: "Succesfully Deleted"
        });
        this.clearData();
      }
    })
  }
}
}
class ProClosingStock {
  Doc_No : any;
  Doc_Date : string;
  godown_id : any;
  Cost_Cen_ID : any;
  Indent_List : any;
  Remarks : any;
 }
 class Browse {
  start_date : Date ;
  end_date : Date;
  Cost_Cen_ID : any;
  godown_id : any;
}
