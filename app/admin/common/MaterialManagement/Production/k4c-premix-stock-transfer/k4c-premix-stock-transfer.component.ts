import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-k4c-premix-stock-transfer',
  templateUrl: './k4c-premix-stock-transfer.component.html',
  styleUrls: ['./k4c-premix-stock-transfer.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cPremixStockTransferComponent implements OnInit {
  items:any = [];
  Spinner :boolean = false;
  seachSpinner :boolean = false
  ShowSpinner :boolean = false;
  tabIndexToView : number = 0;
  buttonname : string = "Save";
  todayDate: any = new Date();
  ObjBrowse: Browse = new Browse();
  ObjpremixST: PremixST = new PremixST();
  Searchedlist: any = [];
  initDate: any = [];
  ToBGodownList: any = [];
  Param_Flag :string='';
  CostCentId_Flag : any;
  MaterialType_Flag :string = '';
  ToBcostcenlist: any = [];
  TBCdisableflag:boolean = false;
  TBGdisableflag: boolean = false;
  PremixIssueFormSubmitted: boolean = false;
  Fcostcenlist: any = [];
  FromGodownList: any = [];
  FGdisableflag: boolean = false;
  Tocostcenlist: any = [];
  TCdisableflag: boolean = false;
  ToGodownList: any = [];
  TGdisableflag: boolean = false;
  ProductList: any = [];
  BackupIndentList: any = [];
  productListFilter: any = [];
  SelectedProductType: any = [];
  flag: boolean = false;
  filteredData: any = [];
  displaysavepopup: boolean = false;
  ViewPoppup: boolean = false;
  ShowPopupSpinner: boolean = false;
  Viewlist: any = [];
  Doc_date:any = undefined;
  Formstockpoint:any = undefined;
  Tostockpoint:any = undefined;
  FCostdisableflag = false;
  lockdate:any;
  constructor(
    private Header: CompacctHeader,
    private router: Router,
    private route: ActivatedRoute,
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) {
    this.route.queryParams.subscribe(params => {
      this.Param_Flag = params['Name'];
      this.CostCentId_Flag = params['Cost_Cen_ID'];
      this.MaterialType_Flag = params['Material_Type']
    })
    }
ngOnInit() {
  this.clearData()
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
       Header:  "Premix Stock Transfer - " + this.MaterialType_Flag,
      Link: " Material Management -> Production -> " + "Premix Stock Transfer - " + this.MaterialType_Flag
    });
    this.getLockDate();
  this.GetBToCostCen();
  this.GetFromCostCen();
  this.GetToCostCen();
  this.GetProductType();
}
TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
  this.buttonname = "Save";
  this.clearData();
}
onReject(){
    this.compacctToast.clear("c");
}
getLockDate(){
  const obj = {
   "SP_String": "sp_Comm_Controller",
   "Report_Name_String": "Get_LockDate"

 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
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
getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
}
PremixSearch(valid?){
  this.Searchedlist = [];
  this.ngxService.start();
   this.seachSpinner = true;
  const start = this.ObjBrowse.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
  : this.DateService.dateConvert(new Date());
const tempobj = {
  From_date : start,
  To_Date : end,
  Cost_Cen_ID : this.ObjBrowse.To_Cost_Cen_ID ? this.ObjBrowse.To_Cost_Cen_ID : 0,
  Godown_ID : this.ObjBrowse.To_godown_id ? this.ObjBrowse.To_godown_id : 0

}
const obj = {
  "SP_String": "SP_K4C_Premix_Stock_Transfer",
  "Report_Name_String": "Browse Premix Stock Transfer",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   this.seachSpinner = false;
   this.ngxService.stop();
 })
}
GetBToCostCen(){
    const obj = {
      "SP_String": "SP_Raw_Material_Stock_Transfer",
      "Report_Name_String": "Get Cost Centre Non outlet",
    }
  this.GlobalAPI.getData(obj).subscribe((data: any) => {
    if (data.length) {
      data.forEach(el => {
        el['label'] = el.Cost_Cen_Name;
        el['value'] = el.Cost_Cen_ID;
      });
      this.ToBcostcenlist = data;
      // if (this.CostCentId_Flag) {
        this.ObjBrowse.To_Cost_Cen_ID = 49;//Number(this.CostCentId_Flag);
        this.TBCdisableflag = true;
        this.GetBToGodown();
      // } else {
      //   this.ObjBrowse.To_Cost_Cen_ID = undefined;
      //   this.TBCdisableflag = false;
      //   this.GetBToGodown();
      // }
      //console.log("To B Cost Cen List ===", this.ToBcostcenlist);
    }
    })
}
GetBToGodown(){
    this.ToBGodownList = [];
      const tempObj = {
        Cost_Cen_ID : this.ObjBrowse.To_Cost_Cen_ID,
        Material_Type : this.MaterialType_Flag
      }
      const obj = {
        "SP_String": "SP_Raw_Material_Stock_Transfer",
        "Report_Name_String": "Get - Godown",
        "Json_Param_String": JSON.stringify([tempObj])
      }
  this.GlobalAPI.getData(obj).subscribe((data: any) => {
    if (data.length) {
      data.forEach(el => {
        el['label'] = el.godown_name;
        el['value'] = el.godown_id;
      });
      this.ToBGodownList = data;
      if (this.ToBGodownList.length === 1) {
        this.ObjBrowse.To_godown_id = this.ToBGodownList[0].godown_id;
        this.TBGdisableflag = true;
      } else {
        this.ObjBrowse.To_godown_id = undefined;
        this.TBGdisableflag = false;
      }
      // console.log("To Godown List ===",this.ToBGodownList);
    }
      })
}
GetFromCostCen(){
    const tempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Material_Type : this.MaterialType_Flag ? this.MaterialType_Flag : 'NA'
    }
    const obj = {
      "SP_String": "SP_K4C_Premix_Inventory",
      "Report_Name_String": "Get Cost Centre Non outlet",
      "Json_Param_String": JSON.stringify([tempObj])
    }
  this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // if (data.length) {
      //    data.forEach((el:any) => {
      //   el['label'] = el.Cost_Cen_Name;
      //   el['value'] = el.Cost_Cen_ID;
      //    });
        this.Fcostcenlist = data;
        // this.ObjpremixST.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
        this.ObjpremixST.From_Cost_Cen_ID = 114;
      this.GetFromGodown();
      // }
     })
}
GetFromGodown(){
    if(this.ObjpremixST.From_Cost_Cen_ID){
      const tempObj = {
        Cost_Cen_ID : this.ObjpremixST.From_Cost_Cen_ID
      }
      const obj = {
        "SP_String": "SP_K4C_Premix_Stock_Transfer",
        "Report_Name_String": "Get - Godown",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        // if (data.length) {
        //    data.forEach(el => {
        //     el['label'] = el.godown_name;
        //     el['value'] = el.godown_id;
        //    });
          this.FromGodownList = data;
          this.ObjpremixST.From_godown_id = 112;
          //console.log("From Godown List ===", this.FromGodownList);
        // }
      })
    }

}
GetToCostCen(){
    const obj = {
      "SP_String": "SP_Raw_Material_Stock_Transfer",
      "Report_Name_String": "Get Cost Centre Non outlet",
    }
  this.GlobalAPI.getData(obj).subscribe((data: any) => {
    // if (data.length) {
    //   data.forEach((el: any) => {
    //     el['label'] = el.Cost_Cen_Name;
    //     el['value'] = el.Cost_Cen_ID;
    //   });
      this.Tocostcenlist = data;
      // if (this.CostCentId_Flag) {  
        this.ObjpremixST.To_Cost_Cen_ID = 49;//Number(this.CostCentId_Flag);
        this.TCdisableflag = true;
        this.GetToGodown();
     // console.log("To Cost Cen List ===", this.Tocostcenlist);
    // }
    })
}
GetToGodown(){
    this.ToGodownList = [];
      const tempObj = {
        Cost_Cen_ID : this.ObjpremixST.To_Cost_Cen_ID,
        Material_Type : this.MaterialType_Flag
      }
      const obj = {
        "SP_String": "SP_Raw_Material_Stock_Transfer",
        "Report_Name_String": "Get - Godown",
        "Json_Param_String": JSON.stringify([tempObj])
      }
  this.GlobalAPI.getData(obj).subscribe((data: any) => {
    // if (data.length) {
    //   data.forEach((el: any) => {
    //     el['label'] = el.godown_name;
    //     el['value'] = el.godown_id;
    //   });
      this.ToGodownList = data;
      if (this.ToGodownList.length === 1) {
        this.ObjpremixST.To_godown_id = this.ToGodownList[0].godown_id;
        this.TGdisableflag = true;
      } else {
        this.ObjpremixST.To_godown_id = undefined;
        this.TGdisableflag = false;
      }
     // console.log("To Godown List ===", this.ToGodownList);
    // }
      })
}
GetIndentList(valid){
    this.PremixIssueFormSubmitted = true;
    if(valid){
      this.ShowSpinner = true;
      this.ngxService.start()
    const TempObj = {
      Cost_Cen_ID : this.ObjpremixST.From_Cost_Cen_ID,
      Godown_ID : this.ObjpremixST.From_godown_id,
      Material_Type : this.MaterialType_Flag
     }
   const obj = {
    "SP_String": "SP_K4C_Premix_Stock_Transfer",
    "Report_Name_String" : "Product For Premix Stock Transfer",
   "Json_Param_String": JSON.stringify([TempObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   const tempData = data
   tempData.forEach(element => {
    element['Issue_Qty'] = undefined;
 });
   this.ProductList = tempData;
   this.ShowSpinner = false;
   this.BackupIndentList = tempData;
    this.PremixIssueFormSubmitted = false;
    this.GetProductType();
    this.ngxService.stop();
   //console.log("this.ProductList======",this.ProductList);
   })
  }
}
filterProduct(){
    if(this.SelectedProductType.length){
      const tempProduct:any = [];
      this.SelectedProductType.forEach(item => {
        this.BackupIndentList.forEach((el,i)=>{
          const ProductObj = this.BackupIndentList.filter((elem) => elem.Product_Type === item)[i];
          if (ProductObj) {
         tempProduct.push(ProductObj)
          }
        })
        })
     this.ProductList  = [...tempProduct];
   }
    else {
    this.ProductList  = [...this.BackupIndentList];
    }
}
GetProductType(){
  const DOrderBy:any = [];
    this.productListFilter = [];
    this.BackupIndentList.forEach((item) => {
      if (DOrderBy.indexOf(item.Product_Type) === -1) {
        DOrderBy.push(item.Product_Type);
        this.productListFilter.push({ label: item.Product_Type, value: item.Product_Type });
      }
    });
}
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
    this.checkdecimal(col);
}
checkdecimal(obj){
  if (obj.Issue_Qty) {
    var val = obj.Issue_Qty;
    if(val[0] === '.'){
      obj.Issue_Qty = 0+val; 
    }
  }
}
saveqty() {
    let flag = true;
   for(let i = 0; i < this.ProductList.length ; i++){
    if(Number(this.ProductList[i].Batch_Qty) <  Number(this.ProductList[i].Issue_Qty)){
      flag = false;
      break;
    }
   }
   return flag;
}
showDialog() {
  if(this.checkLockDate(this.DateService.dateConvert(new Date(this.todayDate)))) {
    if(this.saveqty()){
    this.filteredData = [];
   this.ProductList.forEach(obj => {
    if(obj.Issue_Qty && Number(obj.Issue_Qty) !== 0){  
    this.filteredData.push(obj);
    this.displaysavepopup = true;
      console.log("this.filteredData===",this.filteredData);
  }
   })
  }
    else {
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
dataforSaveRawMaterialIssue(){
     this.ObjpremixST.Doc_Date = this.DateService.dateConvert(new Date(this.todayDate));
    if(this.ProductList.length) {
      const tempArr:any =[]
      this.ProductList.forEach(item => {
        if(item.Issue_Qty && Number(item.Issue_Qty) !== 0) {
     const TempObj = {
            Doc_No:  this.ObjpremixST.Doc_No ?  this.ObjpremixST.Doc_No : "A",
            Doc_Date: this.ObjpremixST.Doc_Date,
            From_Cost_Cen_ID :this.ObjpremixST.From_Cost_Cen_ID,
            From_godown_id	: this.ObjpremixST.From_godown_id,
            To_Cost_Cen_ID	: this.ObjpremixST.To_Cost_Cen_ID,
            To_godown_id	: this.ObjpremixST.To_godown_id,
            Product_ID	: item.Product_ID,
            Product_Description	: item.Product_Description,
            Product_Type_ID	: item.Product_Type_ID,
            Qty	: Number(item.Issue_Qty),
            UOM	: item.UOM,
            Remarks	: " ",
            User_ID	:this.$CompacctAPI.CompacctCookies.User_ID,
            Batch_No : item.Batch_No
         }
        tempArr.push(TempObj)
      }
      });
      console.log("Save Data ===", tempArr)
      return JSON.stringify(tempArr);
    }
}
SaveRawMaterialIssue(){
    this.ShowPopupSpinner = true;
    this.ngxService.start();
    if(this.ObjpremixST.From_Cost_Cen_ID === this.ObjpremixST.To_Cost_Cen_ID &&
      this.ObjpremixST.From_godown_id === this.ObjpremixST.To_godown_id){
        this.ShowPopupSpinner = false;
        this.ngxService.stop();
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "can't use same stock point with respect to same cost centre"
        });
        return false;
    }
    if(this.saveqty()){
      const obj = {
        "SP_String": "SP_K4C_Premix_Stock_Transfer",
        "Report_Name_String" : "Save Premix Stock Transfer",
       "Json_Param_String": this.dataforSaveRawMaterialIssue()
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        const tempID = data[0].Column1;
        if(data[0].Column1){
          this.compacctToast.clear();
          const mgs = this.buttonname === "Save" ? "Created" : "Updated";
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Production Voucher  " + tempID,
           detail: "Succesfully  " + mgs
         });
         this.tabIndexToView = 0 ;
         this.items = ["BROWSE", "CREATE"];
         this.buttonname = "Save";       
         this.PremixSearch();
         this.clearData();
         this.displaysavepopup = false;
         this.ngxService.stop();
         this.ShowPopupSpinner = false;
         this.ProductList =[];
         this.PremixIssueFormSubmitted = false;
        }
      })
    }
    else{
      this.ShowPopupSpinner = false;
      this.ngxService.stop();
      this.compacctToast.clear();
      this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Quantity can't be more than in batch available quantity "
        });
    }
}
getTotalValue(key){
    let Total = 0;
    this.filteredData.forEach((item)=>{
      Total += Number(item[key]);
    }); 
    return Total ? Total.toFixed(2) : '-';
}
View(DocNo:any) {
  console.log("DocNo",DocNo)
    this.Viewlist = [];
    this.ObjpremixST.Doc_No = '';
    this.Doc_date = undefined;
    this.Formstockpoint = undefined;
    this.Tostockpoint = undefined;
    if(DocNo.Doc_No){
      this.ObjpremixST.Doc_No = DocNo.Doc_No;
      this.Doc_date = DocNo.Doc_Date;
      this.Formstockpoint = DocNo.From_Godown_Name;
      this.Tostockpoint = DocNo.To_Godown_Name;
      this.ViewPoppup = true;
     this.geteditmaster(DocNo.Doc_No)
    }
}
EditIntStock(col){
  this.ObjpremixST.Doc_No = '';
  if(col.Doc_No){
  if(this.checkLockDate(col.Doc_Date)){
   this.ObjpremixST = col.Doc_No;
   this.tabIndexToView = 1;
   this.ProductList = [];
   this.BackupIndentList = [];
   this.items = ["BROWSE", "UPDATE"];
   this.buttonname = "Update";
   this.geteditmaster(col.Doc_No)
  }
  }
}
geteditmaster(Doc_No){
  const obj = {
    "SP_String": "SP_K4C_Premix_Stock_Transfer",
  "Report_Name_String": "Get Premix Stock Transfer For Edit",
    "Json_Param_String": JSON.stringify([{Doc_No:Doc_No}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("Edit",data);
    this.Viewlist = data;
    const TempData = data;
    this.todayDate = new Date(data[0].Doc_Date);
    this.ObjpremixST = data[0];
    this.GetToGodown();
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
DeleteIntStocktr(col){
  this.ObjpremixST.Doc_No = "";
  if(col.Doc_No){
    if(this.checkLockDate(col.Doc_Date)){
    this.ObjpremixST.Doc_No = col.Doc_No;
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
  if(this.ObjpremixST.Doc_No){
    const Tempdata = {
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
      Doc_No : this.ObjpremixST.Doc_No
    }
    const objj = {
      "SP_String": "SP_K4C_Premix_Stock_Transfer",
      "Report_Name_String": "Delete Premix Stock Transfer",
      "Json_Param_String": JSON.stringify([Tempdata])
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
      if (data[0].Column1){
        this.onReject();
        this.PremixSearch();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Doc No.: " + this.ObjpremixST.Doc_No.toString(),
          detail: "Succesfully Deleted"
        });
        this.clearData();
      }
      else {
        this.compacctToast.clear();
        this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error occured"
          });
      }
    })
  }
}
clearData(){
    this.ObjpremixST.From_Cost_Cen_ID = 114;

    // if (this.CostCentId_Flag) {
      this.ObjpremixST.To_Cost_Cen_ID = 49;//String(this.CostCentId_Flag);
      this.TCdisableflag = true;
      this.GetToGodown();
      this.ObjBrowse.To_Cost_Cen_ID = 49;//String(this.CostCentId_Flag);
      this.TBCdisableflag = true;
      this.GetBToGodown();
      // } else {
      //   this.ObjpremixST.To_Cost_Cen_ID = undefined;
      //   this.TCdisableflag = false;
      //   this.GetToGodown();
      //   this.ObjBrowse.To_Cost_Cen_ID = undefined;
      //   this.TBCdisableflag = false;
      //   this.GetBToGodown();
      // }
     
      this.ObjpremixST.From_godown_id = 112;
    // this.ObjpremixST.From_godown_id = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
    //  if(this.FromGodownList.length === 1){
    //    this.FGdisableflag = true;
    //  }else{
    //    this.FGdisableflag = false;
    //  }
     this.ObjpremixST.To_godown_id = this.ToGodownList.length === 1 ? this.ToGodownList[0].godown_id : undefined;
     if(this.ToGodownList.length === 1){
       this.TGdisableflag = true;
     }else{
       this.TGdisableflag = false;
     }

     this.ObjBrowse.To_godown_id = this.ToBGodownList.length === 1 ? this.ToBGodownList[0].godown_id : undefined;
     if(this.ToBGodownList.length === 1){
       this.TBGdisableflag = true;
     }else{
       this.TBGdisableflag = false;
     }

    this.ObjpremixST.Remarks = [];
    this.ObjpremixST.Indent_List = undefined;
    this.ProductList = [];
    this.Searchedlist = [];
    this.BackupIndentList = [];

    this.SelectedProductType = [];
    this.ShowSpinner = false;
    this.ObjpremixST.Doc_No = '';
    this.todayDate = new Date();
    this.PremixIssueFormSubmitted = false;

}
}
class Browse{
  start_date : Date ;
  end_date : Date;
  To_Cost_Cen_ID : any;
  To_godown_id : any;
}
class PremixST{
  Doc_No : string = '' ;
  Doc_Date : string;
  From_godown_id : any;
  To_godown_id : any;
  To_Cost_Cen_ID : any;
  From_Cost_Cen_ID : any;
  Indent_List : any;
  Remarks : any; 
}