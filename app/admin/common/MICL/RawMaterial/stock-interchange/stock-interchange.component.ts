import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-stock-interchange',
  templateUrl: './stock-interchange.component.html',
  styleUrls: ['./stock-interchange.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class StockInterchangeComponent implements OnInit {
  tabIndexToView: number= 0;
  FurnaceNoList: any= [];
  SelectProductList: any= [];
  ProductionList: any= [];
  allDetalisHeader: any= [];
  stockinterchangeSubmitted: boolean= false;
  Spinner: boolean= false;
  items: any= [];
  buttonname: any= "Save";
  newAllDetails: any= [];
  Created_By: any;
  Cost_Cen_ID: any;
  seachSpinner: boolean= false;
  Searchedlist: any= [];
  SearchedlistHeader: any=[];

  objBrowse: Browse = new Browse()
  Objstockinterc: stockinterc = new stockinterc();
  Doc_Date = new Date();
  BackupSearchedlist:any = [];
  DistSubledgerName:any = [];
  SelectedDistSubledgerName:any = [];
  SearchFields:any = [];
  initDate:any = [];

  Qty:any = undefined;
  Changes_Qty:any = undefined;

  ObjAddProduct: Product = new Product();
  AddProductFormValid:boolean = false;
  ProGodownList:any = [];
  ProProductTypeList:any = [];
  ProproductSubTypeList:any = [];
  ProdList:any = [];
  AddProductionList:any = [];

  constructor(
    private $http: HttpClient,
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Stock Interchange",
      Link: "MICL -> Stock Interchange"
    });
    this.items = ["BROWSE", "CREATE"];
    this.Finyear();
    this.getFurnaceNo();
    this.Created_By= Number(this.$CompacctAPI.CompacctCookies.User_ID);
    this.Cost_Cen_ID= Number(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
    this.GetProductionGodown();
    this.getProProductTyp();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.Objstockinterc = new stockinterc();
    this.ProductionList=[];
    this.allDetalisHeader=[];
    this.SelectProductList=[];
    this.newAllDetails=[];
    this.Doc_Date = new Date();
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
      // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
      // this.voucherminDate = new Date(data[0].Fin_Year_Start);
      // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }

  getFurnaceNo(){
    this.FurnaceNoList=[];
    const obj = {
      "SP_String": "SP_BL_Txn_Production_MIS_Adj",
      "Report_Name_String": "Get_Furnace" 
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("Get RecvDocList",data);
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.godown_name,
          element['value'] = element.Godown_ID
        });
       this.FurnaceNoList = data;
      }
       else {
        this.FurnaceNoList = [];
      }
    });
  }

  getProductionData(valid){
    this.ProductionList = [];
    this.seachSpinner = true;
    this.stockinterchangeSubmitted = true;
    if(valid){
    const senddata ={
      Furnace_ID : this.Objstockinterc.Furnace_ID,
      Furnace_Date : this.DateService.dateConvert(new Date(this.Doc_Date))
    }
    const obj = {
      "SP_String": "SP_BL_Txn_Production_MIS_Adj",
      "Report_Name_String":"Get_Production_Data",
      "Json_Param_String": JSON.stringify(senddata) 
      }

      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log("getProductDetails",data);
         this.ProductionList = data;
         this.ProductionList.forEach(el=>{
          el.Qty = Number(el.Qty).toFixed(3);
          el['Changed_Qty'] = Number(el.Qty).toFixed(3);
         })
         this.seachSpinner = false;
         this.stockinterchangeSubmitted = false;
         if (this.ProductionList.length) {
          this.allDetalisHeader = Object.keys(data[0]);
        }
        this.getTotal();
      });  
    }
    else {
      this.seachSpinner = false;
    }
  }
  getTotal(){
    // let TotalAmt = 0;
    let qty = 0;
    let changesqty = 0;
    this.ProductionList.forEach((item)=>{
      // TotalAmt += Number(item[key]);
      qty += Number(item.Qty)
      changesqty += Number(item.Changed_Qty)
    });
    this.Qty = qty ? (qty).toFixed(2) : '-';
    this.Changes_Qty = changesqty ? (changesqty).toFixed(2) : '-';
    // return TotalAmt ? TotalAmt.toFixed(2) : '-';
  }
  validqty(dataobj){
    if(dataobj.Changed_Qty) {
      return false;
    }
    else {
      return true;
    }
  }
  SaveDoc(){
    if (Number(this.Qty) == Number(this.Changes_Qty)) {
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "s",
       sticky: true,
       closable: false,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
    }
    else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error message",
        detail:"Total quantity and total changed quantity mismatched"
      });
    }
  }
  onConfirmSave(){
    // console.log("S_AllDetails",this.allDetalis);

    this.ProductionList.forEach(element => {
    // if(Number(element.Changed_Qty) || Number(element.Changed_Qty) == 0) {
      const TempObj = {
        Doc_No: "A",
        Furnace_ID: this.Objstockinterc.Furnace_ID,
        Furnace_Date: this.DateService.dateConvert(new Date(this.Doc_Date)),
        Cost_Cent_ID: 36,
        Godown_ID: element.Godown_ID,
        Product_ID: element.Product_ID,
        Batch_No: element.Batch_No,
        Qty: Number(element.Qty).toFixed(3),
        Changed_Qty: element.Changed_Qty ? Number(element.Changed_Qty).toFixed(3) : 0,
        UOM:element.UOM,
        Created_By: this.$CompacctAPI.CompacctCookies.User_ID
      }
      this.newAllDetails.push(TempObj);
    // }
    });
    // console.log("SaveObj",SaveObj);

    // this.QualityCheckFormSubmitted = true;
    // if(valid){
      let msg = this.buttonname == "Save" ? "save" : "Update";
      this.Spinner=true;
      const obj = {
      "SP_String": "SP_BL_Txn_Production_MIS_Adj",
      "Report_Name_String": "Create_BL_Txn_Production_MIS_Adj",
      "Json_Param_String": JSON.stringify(this.newAllDetails)
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log("save data",data);
        if (data[0].Column1){
          this.Spinner=false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            // summary: "Parameter " + msg,
            detail: "Succesfully " + msg
          });
          this.Objstockinterc = new stockinterc();
          // this.tabIndexToView = 0;
          // this.items = ["BROWSE", "CREATE"];
          this.ProductionList=[];
          this.newAllDetails = [];
          this.allDetalisHeader=[];
          this.getAlldata();
        }
        else {
          this.newAllDetails = [];
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            // summary: "Parameter not " + msg,
            detail:"Error occured "
          });
        }
      });
    // }

  }

  getDateRange(dateRangeObj:any){
    if(dateRangeObj.length){
      this.objBrowse.From_Date = dateRangeObj[0];
      this.objBrowse.To_Date  = dateRangeObj[1];
    }
   
  }

  getAlldata(){
    this.Searchedlist=[];
    this.SearchedlistHeader=[];
    this.seachSpinner = true
    const start = this.objBrowse.From_Date
    ? this.DateService.dateConvert(new Date(this.objBrowse.From_Date))
    : this.DateService.dateConvert(new Date());
    const end = this.objBrowse.To_Date
    ? this.DateService.dateConvert(new Date(this.objBrowse.To_Date))
    : this.DateService.dateConvert(new Date());
    const tempobj = {
      From_Date : start,
      To_Date  : end
    }
    const obj = {
      "SP_String": "SP_BL_Txn_Production_MIS_Adj",
      "Report_Name_String": "Browse_BL_Txn_Production_MIS_Adj",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("Get data",data);
       this.Searchedlist = data;
       this.BackupSearchedlist = data;
       this.GetDistinct();
       if(data.length) {
        this.SearchedlistHeader = Object.keys(data[0]);
        // console.log("SearchedlistHeader",this.SearchedlistHeader);
       }
       this.seachSpinner = false;
      //  console.log('Searchedlist=====',this.Searchedlist); 
     })

  }
  // DISTINCT & FILTER
GetDistinct() {
  let DSubledgerName:any = [];
  this.DistSubledgerName =[];
  this.SelectedDistSubledgerName =[];
  this.SearchFields =[];
  this.Searchedlist.forEach((item) => {
 if (DSubledgerName.indexOf(item.Sub_Ledger_Name) === -1) {
  DSubledgerName.push(item.Sub_Ledger_Name);
 this.DistSubledgerName.push({ label: item.Sub_Ledger_Name, value: item.Sub_Ledger_Name });
 }
});
   this.BackupSearchedlist = [...this.Searchedlist];
}
  FilterDist() {
    let DSubledgerName:any  = [];
    let DCostCentreName:any = [];
    this.SearchFields =[];
  if (this.SelectedDistSubledgerName.length) {
    this.SearchFields.push('Sub_Ledger_Name');
    DSubledgerName = this.SelectedDistSubledgerName;
  }
  this.Searchedlist = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupSearchedlist.filter(function (e) {
      return (DSubledgerName.length ? DSubledgerName.includes(e['Sub_Ledger_Name']) : true)
      && (DCostCentreName.length ? DCostCentreName.includes(e['Cost_Cen_Name']) : true)
    });
  this.Searchedlist = LeadArr.length ? LeadArr : [];
  } else {
  this.Searchedlist = [...this.BackupSearchedlist] ;
  }
  }

  onConfirm(){

  }

  onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("s");
  }

  // PRODUCTION
  GetProductionGodown() {
    const obj = {
     "SP_String": "SP_Furnace_MIS_Input",
     "Report_Name_String": "Get_Production_Cost_Center_Godown"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ProGodownList = data;
      //console.log("this.ProGodownList",this.ProGodownList);
      })
  }
  getProProductTyp(){
    this.ProProductTypeList = [];
       const obj = {
        "SP_String": "SP_BL_Txn_Production_MIS_Adj",
        "Report_Name_String":"Get_Master_Product_Type",
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
           data.forEach(element => {
             element['label'] = element.Product_Type,
             element['value'] = element.Product_Type_ID
           });
           this.ProProductTypeList = data;
         }
         else {
           this.ProProductTypeList = [];
         }
      })
 }
 getProProductSubTyp(ProductTypeID){
  this.ProproductSubTypeList = [];
  if(ProductTypeID){
    const obj = {
      "SP_String": "SP_BL_Txn_Production_MIS_Adj",
      "Report_Name_String":"Get_Master_Product_Sub_Type",
      "Json_Param_String": JSON.stringify([{Product_Type_ID:ProductTypeID}]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     if(data.length) {
      data.forEach(element => {
        element['label'] = element.Product_Sub_Type,
        element['value'] = element.Product_Sub_Type_ID
      });
      this.ProproductSubTypeList = data;
    }
    else {
      this.ProproductSubTypeList = [];
    }
    })
    
   }
 }
 GetProProduction() {
  this.ProdList = [];
  if (this.ObjAddProduct.Product_Type_ID && this.ObjAddProduct.Product_Sub_Type_ID) {
   const proobj = {
     Product_Type_ID : this.ObjAddProduct.Product_Type_ID,
     Product_Sub_Type_ID : this.ObjAddProduct.Product_Sub_Type_ID
   }
   const obj = {
     "SP_String": "SP_BL_Txn_Production_MIS_Adj",
     "Report_Name_String": "Get_Master_Product",
     "Json_Param_String": JSON.stringify([proobj])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     //this.ProductionlList = data;
     if(data.length) {
       data.forEach(element => {
         element['label'] = element.Product_Description,
         element['value'] = element.Product_ID
       });
       this.ProdList = data;
     } else {
      this.ProdList = [];
     }
     console.log("Production List ===",this.ProdList);
    })
  }
 }
  getProData(proid) {
    this.ObjAddProduct.Product_Description = undefined;
    this.ObjAddProduct.UOM = undefined;
    if (proid) {
      console.log("proid ====",proid)
      var prodata = this.ProdList.filter(item=> Number(item.Product_ID) === Number(proid))
      this.ObjAddProduct.UOM = prodata[0].UOM;
      this.ObjAddProduct.Product_Description = prodata[0].Product_Description;
    }
  }
  addProduction(valid) {
  this.AddProductFormValid = true;
  var stockpoint = this.ProGodownList.filter(el=> Number(el.Godown_ID) === Number(this.ObjAddProduct.Godown_ID));
  var protype = this.ProProductTypeList.filter(el=> Number(el.Product_Type_ID) === Number(this.ObjAddProduct.Product_Type_ID));
  var prosubtype = this.ProproductSubTypeList.filter(el=> Number(el.Product_Sub_Type_ID) === Number(this.ObjAddProduct.Product_Sub_Type_ID));
  if(valid){
      this.AddProductionList.push({
        Cost_Cent_ID : this.ObjAddProduct.Cost_Cent_ID,
        Godown_ID : Number(this.ObjAddProduct.Godown_ID),
        Godown_Name : stockpoint[0].godown_name,
        Product_Type_ID : Number(this.ObjAddProduct.Product_Type_ID),
        Product_Type : protype[0].Product_Type,
        Product_Sub_Type_ID : Number(this.ObjAddProduct.Product_Sub_Type_ID),
        Product_Sub_Type : prosubtype[0].Product_Sub_Type,
        Product_ID : this.ObjAddProduct.Product_ID,
        Product_Description: this.ObjAddProduct.Product_Description,
        Batch_No: this.ObjAddProduct.Batch_No,
        Qty: Number(this.ObjAddProduct.Qty).toFixed(3),
        UOM : this.ObjAddProduct.UOM
      })
      this.AddProductFormValid = false;
      this.ObjAddProduct = new Product();
      this.ProproductSubTypeList = [];
      this.ProdList = [];
      this.ObjAddProduct.Cost_Cent_ID = 36;
    }
  }
  Productiondelete(i) {
    this.AddProductionList.splice(i,1);
  }

}

class Browse{
  From_Date: any;
  To_Date: any;
}
class stockinterc{
  Furnace_ID: any;
  Furnace_Date: any;
  RecievedOn: any;
  PO_Doc_Date:any;
  Ref_No: any;
  VendorInvNo: any;
  VendorInvDate: any;
  Inv_No_Date: any;
  SelectProduct: any;
  Sub_Ledger_ID: number;
  UOM: any;
}
class Product{
  Cost_Cent_ID : any;
  Godown_ID : any;
  Product_Type_ID : any;
  Product_Sub_Type_ID : any;
  Product_ID : any;
  Product_Description : any;
  Batch_No : any;
  Qty : any;
  UOM : any;
}

