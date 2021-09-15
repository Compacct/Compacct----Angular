import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { NULL_EXPR, THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";


@Component({
  selector: 'app-outlet-stock-transfer',
  templateUrl: './outlet-stock-transfer.component.html',
  styleUrls: ['./outlet-stock-transfer.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class OutletStockTransferComponent implements OnInit {
  items = [];
  tabIndexToView = 0;
  menuList = [];
  buttonname = "Create";
  stockTransferFormSubmit = false;
  Spinner = false;
  NativeitemList = [];
  itemList = [];
  toOutletList = [];
  ToStokePointList = [];
  FromOutletList = [];
  FromStokePointList = [];
  productDetails = [];
  AccetProductDetails = []
  BatchList = [];
  GetAllDataList = [];
  BackUPGetAllDataList = [];
  OutletFilter = [];
  SelectedOutLet :any;
  seachSpinner = false;
  AdditioanFormSubmit = false;
  BrandId = undefined;
  UserLoinId = undefined;
  ReasonId = undefined;
  ReasonList = [];
  accept_challan = false;
  DocNO = undefined;
  FromStokePoint = undefined;
  toStokePoint = undefined;
  date = undefined;
  editDate :any;
  editDocNO = undefined;
  editFromStokePoint = undefined;
  editTOStokePoint = undefined;
  editdataList = [];
  viewpop = false;
  viewList = [];
  viewDoc = undefined;
  viewTooutlet = undefined;
  viewFromOutlet = undefined;
  flag = false;
  viewDate :any;
  editPopUp = false;
  DeleteDocId = undefined;
  myDate : Date ;
  initDate = [];
  checkSave = true;
  ObjstockTransfer: stockTransfer = new stockTransfer();
  ObjBrowseData : BrowseData = new BrowseData ();
  Objadditem: additem = new additem ()
  mattypelist = [];
  RequistionSearchFormSubmit = false;
  DisabledBatch = false;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService
  ) {
    // this.Header.pushHeader({
    //   Header: "Outlet Stock Transfer",
    //   Link: "Material Management -> Outlet Stock Transfer"
    // });
  }

  ngOnInit() {
    $(".content-header").removeClass("collapse-pos");
    $(".content").removeClass("collapse-pos");
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Outlet Stock Transfer",
      Link: "Outlet -> Outlet Stock Transfer"
    });
    this.GettoOutlet();
    this.GetfromOutlet();
    this.GetfromStokePoint();
    this.getbilldate();
    this.getMaterialType();
   this.UserLoinId = this.$CompacctAPI.CompacctCookies.User_ID ;
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.Objadditem= new additem();
    this.clearData();
  }
  clearData(){
    this.ObjstockTransfer= new stockTransfer();
    this.ObjstockTransfer.From_Outlet= this.FromOutletList.length === 1 ? this.FromOutletList[0].Cost_Cen_ID : undefined;
    this.ObjstockTransfer.From_Stock_Point= this.FromStokePointList.length === 1 ? this.FromStokePointList[0].godown_id : undefined;
    this.productDetails = [];
    this.stockTransferFormSubmit = false;
    this.AdditioanFormSubmit = false;
    this.flag = false;
    this.itemList = [];

  }
  // Refresh(){
  //   this.ObjstockTransfer= new stockTransfer();
  //   this.productDetails = [];
  // }
  onReject(){
    this.compacctToast.clear("c");
  }

GettoOutlet(){
  console.log(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
  const obj = {
    "SP_String": "SP_Outlet_Stock_Transfer",
    "Report_Name_String": "Get - Outlet",
    "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.toOutletList = data;
    //this.BrandId = data[0].Brand_ID;
    console.log("this.toOutletList==",this.toOutletList);

  })
}
GetToStokePoint(){
  const obj = {
    "SP_String": "SP_Outlet_Stock_Transfer",
    "Report_Name_String": "Get - Godown",
    "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.ObjstockTransfer.To_Outlet}])
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  this.ToStokePointList = data;
  this.ObjstockTransfer.To_Stock_Point= this.ToStokePointList.length === 1 ? this.ToStokePointList[0].godown_id : undefined;
  console.log("this.ToStokePointList==",this.ToStokePointList);

 })
}
GetfromOutlet(){
  console.log(this.$CompacctAPI.CompacctCookies);
  const obj = {
    "SP_String": "SP_Outlet_Stock_Transfer",
    "Report_Name_String": "Get - From Outlet",
    "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.FromOutletList = data;

    console.log("this.FromOutletList==",this.FromOutletList);
    this.ObjstockTransfer.From_Outlet= this.FromOutletList.length === 1 ? this.FromOutletList[0].Cost_Cen_ID : undefined;
    // this.GetProduct();
  })
}
GetfromStokePoint(){
  const obj = {
    "SP_String": "SP_Outlet_Stock_Transfer",
    "Report_Name_String": "Get - Godown",
    "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  this.FromStokePointList = data;
  this.ObjstockTransfer.From_Stock_Point= this.FromStokePointList.length === 1 ? this.FromStokePointList[0].godown_id : undefined;
  console.log("this.FromStokePointList==",this.FromStokePointList);

 })
}
getMaterialType() {
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get material Type",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.mattypelist = data;
      console.log("Material Type List ===",this.mattypelist);
    })
  }
// GetProduct(){
//   const tempObj = {
//     Cost_Cen_ID: this.ObjstockTransfer.From_Outlet,
//      Doc_Type:"Sale_Bill",
//      Product_Type_ID:0,
//      bill_type : ""
//   }
//   const obj = {
//     "SP_String": "SP_Controller_Master",
//     "Report_Name_String": "Get Sale Requisition Product",
//     "Json_Param_String": JSON.stringify([tempObj])
//  }
//  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
//    this.NativeitemList = data;
//    console.log("this.NativeitemList ",this.NativeitemList )
//    this.NativeitemList.forEach(el => {
//     this.itemList.push({
//       label: el.Product_Description,
//       value: el.Product_ID
//     });
//   });
//   console.log("this.itemList",this.itemList);
//  })
// }

GetProduct(){       // PRODUCT DROPDOWN

  if(this.Objadditem.Material_Type === "Finished"){
    this.itemList = [];
    this.DisabledBatch = false;
    const tempObj = {
      Cost_Cen_ID: this.ObjstockTransfer.From_Outlet,
      Product_Type_ID:0,
      Material_Type : this.Objadditem.Material_Type
    }
  const obj = {
    "SP_String": "SP_Outlet_Stock_Transfer",
    "Report_Name_String": "Get outlet Stock Transfer Finished Product",
    "Json_Param_String": JSON.stringify([tempObj])
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.NativeitemList = data;
   console.log("finished product ",this.NativeitemList )
   this.NativeitemList.forEach(el => {
    this.itemList.push({
      label: el.Product_Description,
      value: el.Product_ID
    });
  });
  console.log("this.itemList",this.itemList);
 })
}
if(this.Objadditem.Material_Type === "Store Item"){
  this.itemList = [];
  this.DisabledBatch = true;
  const Objtemp = {
    Cost_Cen_ID: this.ObjstockTransfer.From_Outlet,
    Product_Type_ID:0,
    Material_Type : this.Objadditem.Material_Type
  }
  const obj = {
    "SP_String": "SP_Outlet_Stock_Transfer",
    "Report_Name_String": "Get outlet Stock Transfer Store Item Product",
    "Json_Param_String": JSON.stringify([Objtemp])
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.NativeitemList = data;
   console.log("store product ",this.NativeitemList )
   this.NativeitemList.forEach(el => {
    this.itemList.push({
      label: el.Product_Description,
      value: el.Product_ID
    });
    //this.Objadditem.Avl_Qty = data[0].Avl_Qty;
  });
  console.log("this.itemList",this.itemList);
  //this.ProductChange();
 })
}
}
ProductChange() {
  //if(this.ObjProductaddForm.Material_Type === "Store Item"){
    if(this.Objadditem.Product_ID) {
      const ctrl = this;
    const productObj = $.grep(ctrl.NativeitemList,function(item) {return item.Product_ID == ctrl.Objadditem.Product_ID})[0];
     console.log(productObj);
     //this.Objadditem.Product_Description = productObj.Product_Description;
    // this.ObjProductaddForm.Net_Price =  productObj.Sale_rate;
     this.Objadditem.Avl_Qty = productObj.Avl_Qty;
    }
    }
async GetBatchCommon(obj) {
  const response = await this.$http.post('/Common/Common_SP_For_All',obj).toPromise();
return response;
}
async GetBatch(){
const tempObj = {
     Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,  //2
     Product_ID  : this.Objadditem.Product_ID,  //3388
     Godown_Id : this.ObjstockTransfer.From_Stock_Point  //4
    // Cost_Cen_ID : 2,
    // Product_ID  : 3388,
    // Godown_Id : 4
  }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get_Product_Wise_Batch",
    "Json_Param_String": JSON.stringify([tempObj]),
    'Json_1_String': 'NA',
    'Json_2_String': 'NA' ,
     'Json_3_String':  'NA',
     'Json_4_String': 'NA'
  }
  this.GetBatchCommon(obj).then((data :any)=>{
    console.log(data)
    this.BatchList = JSON.parse(data);
    console.log("BatchList",this.BatchList);
    this.Objadditem.Batch_No= this.BatchList[0].Batch_NO ;
    console.log("this.Objadditem.Batch_No",this.Objadditem.Batch_No);
  })


  this.GlobalAPI.getData(obj).subscribe((data:any)=>{

  })

}
addDispatch(valid){
console.log(this.BrandId);
let batch_id:any;
let batch_show:any;
let batch_qty :any;
this.AdditioanFormSubmit = true;
if(this.Objadditem.Material_Type === "Finished"){       // Finished Product Add
if(valid && this.GetSelectedBatchqty()){
this.BatchList.forEach(el=>{
  if(el.Batch_NO === this.Objadditem.Batch_No){
    batch_show = el.Batch_No_Show;
    batch_id = el.Batch_NO;
    batch_qty = el.Qty
   }

})
const ProductArrValid = this.NativeitemList.filter( item => Number(item.Product_ID) === Number(this.Objadditem.Product_ID));

const ExitsProduct = this.productDetails.filter( item => Number(item.product_id) === Number(this.Objadditem.Product_ID));
if(ProductArrValid.length){
  ProductArrValid.forEach(item=>{
    this.productDetails.push({
    // 'Doc_No': "A",
    // 'Doc_Date' : this.DateService.dateConvert(new Date()),
    // 'F_Cost_Cen_ID' : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    // 'F_Godown_ID' : this.Objdispatch.From_Godown_ID,
    // 'To_Cost_Cen_ID' : this.Objdispatch.Cost_Cen_ID,
    // 'To_Godown_ID' : this.Objdispatch.To_Godown_ID,
   // 'Product_Description' : item.Product_Description,

   Brand_ID: this.BrandId,
   Product_ID: item.Product_ID,
   Product_Description : item.Product_Description,
   Product_Type_ID: item.Product_Type_ID,
   Batch_NO: batch_id,
   Qty: Number(this.Objadditem.Issue_Qty),
   UOM: item.UOM,
   Material_Type : item.Material_Type
   })
  })
  this.Objadditem= new additem();
  this.AdditioanFormSubmit = false;
  this.itemList = [];
}
}
}
if(this.Objadditem.Material_Type === "Store Item"){      // Store Product Add
  if(valid && this.GetAvlQty()){
    const ProductArrValid = this.NativeitemList.filter( item => Number(item.Product_ID) === Number(this.Objadditem.Product_ID));

    // const ExitsProduct = this.productDetails.filter( item => Number(item.product_id) === Number(this.Objadditem.Product_ID));
    if(ProductArrValid.length){
      ProductArrValid.forEach(item=>{
        var prdIndex = this.productDetails.findIndex( ({Product_ID}) => Product_ID === item.Product_ID)
        if(prdIndex != -1) {
          this.productDetails[prdIndex].Qty = this.productDetails[prdIndex].Qty +  Number(this.Objadditem.Issue_Qty);
        } else {
          this.productDetails.push({
            // Brand_ID: this.BrandId,
            Product_ID: item.Product_ID,
            Product_Description : item.Product_Description,
            Product_Type_ID: item.Product_Type_ID,
            Batch_NO: "NA",
            Qty: Number(this.Objadditem.Issue_Qty),
            UOM: item.UOM,
            Material_Type : item.Material_Type
            })
        }
      })
      this.Objadditem= new additem();
      this.AdditioanFormSubmit = false;
      this.itemList = [];
    }
    //this.productDetails.forEach(item => {
      // if(item.Product_ID == this.Objadditem.Product_ID && item.Modifier == this.Objadditem.Modifier) {
      //   item.Product_ID = Number(item.Product_ID) + Number( ProductArrValid.Product_ID);
      // item.Max_Discount = Number(item.Max_Discount) + Number(productObj.Max_Discount);
      // item.Amount = Number(item.Amount) + Number(productObj.Amount);
      // item.Gross_Amount = Number(item.Gross_Amount) + Number(productObj.Gross_Amount);
      // item.Dis_Amount = Number(item.Dis_Amount) + Number(productObj.Dis_Amount);
      // item.SGST_Amount = (Number(item.SGST_Amount) + Number(productObj.SGST_Amount)).toFixed(2);
      // item.CGST_Amount = (Number(item.CGST_Amount) + Number(productObj.CGST_Amount)).toFixed(2);
      // item.Net_Amount = (Number(item.Net_Amount) + Number(productObj.Net_Amount)).toFixed(2);
      // }
    //})
    }
}
}
searchArray(arr,key) {
  return arr

}
GetSelectedBatchqty() {
  console.log("this.productDetails",this.productDetails);
  const sameproductwithbatch = this.productDetails.filter(item=> item.Batch_NO === this.Objadditem.Batch_No && Number(item.Product_ID) === Number(this.Objadditem.Product_ID) );

  if(sameproductwithbatch.length) {
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Product with same batch no. Already Exist."
        });
    return false;
  }

  const baychqtyarr = this.BatchList.filter(item=> item.Batch_NO === this.Objadditem.Batch_No);
    if(baychqtyarr.length) {
      if(this.Objadditem.Issue_Qty <=  baychqtyarr[0].Qty) {
        return true;
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Quantity can't be more than in batch available quantity "
        });
        return false;
      }
    } else {
      return true;
    }
  }
  GetAvlQty () {
    const avlqtyarr = this.NativeitemList.filter(item=> item.Avl_Qty === this.Objadditem.Avl_Qty);
      if(avlqtyarr.length) {
        if(this.Objadditem.Issue_Qty <=  avlqtyarr[0].Avl_Qty) {
          return true;
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Quantity can't be more than available quantity "
          });
          return false;
        }
      } else {
        return true;
      }
  }
saveDispatch(){
  let saveData = [];
  const ExitsProduct = this.toOutletList.filter( item => Number(item.Cost_Cen_ID) === Number(this.ObjstockTransfer.To_Outlet));
  if(ExitsProduct.length){
    this.BrandId = ExitsProduct[0].Brand_ID;
  }

  if(this.productDetails.length){
    this.productDetails.forEach(el=>{
      const saveObj ={
            Doc_No: "A",
            Doc_Date: this.DateService.dateConvert(new Date(this.myDate)),
            Brand_ID: this.BrandId,
            From_Cost_Cen_ID: Number(this.ObjstockTransfer.From_Outlet),
            From_godown_id: Number(this.ObjstockTransfer.From_Stock_Point),
            To_Cost_Cen_ID: Number(this.ObjstockTransfer.To_Outlet),
            To_godown_id: Number(this.ObjstockTransfer.To_Stock_Point),
            Product_ID: el.Product_ID,
            Product_Description: el.Product_Description,
            Product_Type_ID: el.Product_Type_ID,
            Batch_NO: el.Batch_NO,
            Qty: el.Qty,
            UOM: el.UOM,
            Remarks: this.ObjstockTransfer.REMARKS ? this.ObjstockTransfer.REMARKS : "NA",
            User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
            Material_Type : el.Material_Type
      }
      saveData.push(saveObj)
    })
    console.log("saveData",saveData);
    const obj = {
      "SP_String": "SP_Outlet_Stock_Transfer",
       "Report_Name_String": "Add Outlet Stock Transfer",
       "Json_Param_String": JSON.stringify(saveData)
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      var tempID = data[0].Column1;
      if(data[0].Column1){
        this.compacctToast.clear();
      this.compacctToast.add({
      key: "compacct-toast",
      severity: "success",
      summary: "Doc No. " + tempID,
      detail: "Entry Succesfully"
    });
   // this.searchData(true);
    this.productDetails = [];
    this.tabIndexToView = 0;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
      }
     })
  }
}
delete(index){
  this.productDetails.splice(index,1)
}
//Browse
getConfirmDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjBrowseData.From_Date = dateRangeObj[0];
    this.ObjBrowseData.To_Date = dateRangeObj[1];
  }
}
searchData(valid){
  this.RequistionSearchFormSubmit = true;
  const start = this.ObjBrowseData.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseData.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseData.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseData.To_Date))
      : this.DateService.dateConvert(new Date());
      if(valid){
    const tempDate = {
      From_date :start,
      To_Date :end,
      From_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      Material_Type : this.ObjBrowseData.Material_Type
    }
  const obj = {
    "SP_String": "SP_Outlet_Stock_Transfer",
    "Report_Name_String": "Browse Outlet Stock transfer",
    "Json_Param_String": JSON.stringify([tempDate])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.GetAllDataList = data;
    this.BackUPGetAllDataList = data;
    console.log("this.GetAllDataList",this.GetAllDataList);

    this.GetDist1();
    this.RequistionSearchFormSubmit = false;
    })
  }
}
GetDist1() {
  let DOrderBy = [];
  this.OutletFilter = [];
  //this.SelectedDistOrderBy1 = [];
  this.BackUPGetAllDataList.forEach((item) => {
  if (DOrderBy.indexOf(item.To_Location) === -1) {
  DOrderBy.push(item.To_Location);
  this.OutletFilter.push({ label: item.To_Location, value: item.To_Location });
  console.log("this.OutletFilter",this.OutletFilter);
}
});
}
filterOutlet(){
  console.log("SelectedOutLet",this.SelectedOutLet);
  let DOrderBy = [];
  if (this.SelectedOutLet.length) {
  DOrderBy = this.SelectedOutLet;
  }
  this.GetAllDataList = [];
  if (this.SelectedOutLet.length) {
  let LeadArr = this.BackUPGetAllDataList.filter(function (e) {
  return (DOrderBy.length ? DOrderBy.includes(e['To_Location']) : true)
  });
  this.GetAllDataList = LeadArr.length ? LeadArr : [];
  console.log("if GetAllDataList",this.GetAllDataList)
  } else {
  this.GetAllDataList = this.BackUPGetAllDataList;
  console.log("else GetAllDataList",this.GetAllDataList)
  }
}
//Accepted challan
acceptChallan(col){
  if(col.Doc_No){
    const TempID = {
      Doc_No : col.Doc_No
    }
    const obj = {
      "SP_String": "SP_Outlet_Stock_Transfer",
      "Report_Name_String": "Get Data For Edit Outlet Stock Transfer",
      "Json_Param_String": JSON.stringify([{Doc_No : col.Doc_No}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.DocNO = data[0].Doc_No,
      this.FromStokePoint = data[0].From_Location,
      this.toStokePoint = data[0].To_Location
      this.date = new Date(data[0].Doc_Date)
      this.AccetProductDetails = data;
      this.AccetProductDetails.forEach(el =>{
        if(!el.Accepted_Qty){
          el.Accepted_Qty = el.Qty;
        }
      })
      console.log("AccetProductDetails",this.AccetProductDetails)
    })
  }

  this.accept_challan = true;
}
getTotalVal(key){
  let TotalAmtVal = 0;
  this.AccetProductDetails.forEach((item)=>{
    TotalAmtVal += Number(item[key]);
  });

  return  TotalAmtVal.toFixed(2);
}
CheckLengthProductID(ID) {
  const tempArr = this.AccetProductDetails.filter(item=> item.Product_ID == ID);
  return tempArr.length
}
CheckIndexProductID(ID) {
  let found = 0;
  for(let i = 0; i < this.AccetProductDetails.length; i++) {
      if (this.AccetProductDetails[i].Product_ID == ID) {
          found = i;
          break;
      }
  }
  return found;
}
CheckLengthProductIDedit(ID) {
  const tempArr = this.editdataList.filter(item=> item.Product_ID == ID);
  return tempArr.length
}
CheckIndexProductIDedit(ID) {
  let found = 0;
  for(let i = 0; i < this.editdataList.length; i++) {
      if (this.editdataList[i].Product_ID == ID) {
          found = i;
          break;
      }
  }
  return found;
}


saveAccet(){
  let saveData = [];
  if(this.AccetProductDetails.length){
    this.AccetProductDetails.forEach(el=>{
      const saveObj ={
        Product_ID : el.Product_ID,
        Batch_No : el.Batch_No,
        Qty : el.Qty,
        Accepted_Qty : Number(el.Accepted_Qty),
        Doc_No : el.Doc_No,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,

        Doc_Date: el.Doc_Date,
        Brand_ID: el.Brand_ID,
        From_Cost_Cen_ID: Number(el.From_Cost_Cen_ID),
        From_godown_id: Number(el.From_godown_id),
        To_Cost_Cen_ID: Number(el.To_Cost_Cen_ID),
        To_godown_id: Number(el.To_Godown_ID),
        Product_Description: el.Product_Description,
        Product_Type_ID: el.Product_Type_ID,
        Batch_NO: el.Batch_No,
        UOM: el.UOM,
        Remarks: el.Qty === Number(el.Accepted_Qty) ? 'NA' : el.Remarks,
        Material_Type : el.Material_Type,
        Total_Qty : Number(this.getTotalVal('Qty')),
        Total_Accepted_Qty : Number(this.getTotalVal('Accepted_Qty'))
      }
      saveData.push(saveObj)
    })
    const obj = {
      "SP_String": "SP_Outlet_Stock_Transfer",
      "Report_Name_String": "Add Outlet Stock Transfer",
      "Json_Param_String": JSON.stringify(saveData)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data[0].Column1){
      this.searchData(true);
      this.accept_challan = false;
     this.compacctToast.clear();
     this.compacctToast.add({
      key: "compacct-toast",
      severity: "success",
      summary: "Succesful ",
      detail: "Accepted Quantity Succesfully updated"
    });
        }
    })
  }
}

// view
 view(col){
  if(col.Doc_No){
    const obj = {
      "SP_String": "SP_Outlet_Stock_Transfer",
      "Report_Name_String": "Get Data For Edit Outlet Stock Transfer",
      "Json_Param_String": JSON.stringify([{Doc_No : col.Doc_No}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.viewList = data;
      console.log("viewList",this.viewList);
      this.viewpop = true;
      this.viewDoc = data[0].Doc_No;
      this.viewDate = new Date(data[0].Doc_Date);
      this.viewTooutlet = data[0].To_Location;
      this.viewFromOutlet = data[0].From_Location;
   })
 }

}

//edit
edit(col){
 if(col.Doc_No){
  const obj = {
    "SP_String": "SP_Outlet_Stock_Transfer",
    "Report_Name_String": "Get Data For Edit Outlet Stock Transfer",
    "Json_Param_String": JSON.stringify([{Doc_No : col.Doc_No}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.editPopUp = true;
    this.editDocNO = data[0].Doc_No,
      this.editFromStokePoint = data[0].From_Location,
      this.editTOStokePoint = data[0].To_Location,
      this.editDate = new Date(data[0].Doc_Date)
      this.editdataList = data;
      this.GetProductBatch();
      console.log("editdataList",this.editdataList);
  })

 }
}
getTotal(key){
  let TotalAmt = 0;
  this.editdataList.forEach((item)=>{
    TotalAmt += Number(item[key]);
  });

  return  TotalAmt.toFixed(2);
}
async ProductWIzeQty(){

  this.editdataList.forEach(async function(item){
    const tempObj = {
      Cost_Cen_ID : item.From_Cost_Cen_ID,  //2
      Product_ID  : item.Product_ID,  //3388
      Godown_Id : item.From_godown_id  //4
     // Cost_Cen_ID : 2,
     // Product_ID  : 3388,
     // Godown_Id : 4
   }
   const obj = {
     "SP_String": "SP_Controller_Master",
     "Report_Name_String": "Get_Product_Wise_Batch",
     "Json_Param_String": JSON.stringify([tempObj]),
     'Json_1_String': 'NA',
      'Json_2_String': 'NA' ,
      'Json_3_String':  'NA',
      'Json_4_String': 'NA'
   }
   const bactqtyres = await this.GetBatchCommon(obj)
   //item['item'] = bactqtyres
   console.log("Batch======>",JSON.parse(bactqtyres));
  })
 }

GetProductBatch(){
  this.editdataList.forEach(item=>{
    const tempObj = {
      Cost_Cen_ID : item.From_Cost_Cen_ID,  //2
      Product_ID  : item.Product_ID,  //3388
      Godown_Id : item.From_godown_id  //4

   }
   const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get_Product_Wise_Batch",
    "Json_Param_String": JSON.stringify([tempObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    let BatchList = data;
    const baychqtyarr = BatchList.filter(Obj=> Obj.Batch_NO === item.Batch_No);
    console.log("Product_Description",item.Product_Description);
    console.log("baychqtyarr",baychqtyarr);
    if(baychqtyarr.length){
     item['Batch_Qty'] = baychqtyarr[0].Qty;
     item['Batch_No_Show'] = baychqtyarr[0].Batch_No_Show
    }
  })

  })
}
qtyChq(col){
  this.flag = false;
  console.log("col",col);
  if(col.Qty){
    if( Number(col.Qty) <= col.Batch_Qty ){
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
 for(let i = 0; i < this.editdataList.length ; i++){
  if(Number(this.editdataList[i].Batch_Qty) <  Number(this.editdataList[i].Qty)){
    flag = false;
    break;
  }
 }
 return flag;
}

saveEdit(){
  let saveData : any = [];
  if(this.editdataList.length){
    console.log(this.saveqty());
    if(this.saveqty()){
      this.editdataList.forEach(el=>{
        const saveObj ={
            Doc_No: el.Doc_No,
            Doc_Date: el.Doc_Date,
            Brand_ID: el.Brand_ID,
            From_Cost_Cen_ID: el.From_Cost_Cen_ID,
            From_godown_id: el.From_godown_id,
            To_Cost_Cen_ID: el.To_Cost_Cen_ID,
            To_godown_id: el.To_Godown_ID,
            Product_ID: el.Product_ID,
            Product_Description: el.Product_Description,
            Product_Type_ID: el.Product_Type_ID,
            Batch_NO: el.Batch_No,
            Qty: el.Qty,
            UOM: el.UOM,
            Remarks: Number(el.Accepted_Qty) === Number(el.Qty) ? 'NA' : el.REMARKS ,
            User_ID: el.USER_ID,
            Accepted_Qty : el.Accepted_Qty,
            Total_Qty : Number(this.getTotal('Qty')),
            Total_Accepted_Qty : Number(this.getTotal('Accepted_Qty'))
      }
      saveData.push(saveObj)
     })
      console.log("saveData",saveData);
    const obj = {
      "SP_String": "SP_Outlet_Stock_Transfer",
       "Report_Name_String": "Add Outlet Stock Transfer",
       "Json_Param_String": JSON.stringify(saveData)
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data[0].Column1){
        this.searchData(true);
        this.editPopUp = false;
        this.compacctToast.clear();
      this.compacctToast.add({
      key: "compacct-toast",
      severity: "success",
      summary: "Doc No. " ,
      detail: "Update Succesfully"
    });
     }
     })
    }
  }

}
 ///Delete
 deleteStock(col){
  this.DeleteDocId = undefined;
 if(col.Doc_No){
  this.checkSave = true;
   this.DeleteDocId = col.Doc_No ;
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
 if(this.DeleteDocId){
   const TempObj = {
    Doc_No : this.DeleteDocId,
    User_ID : this.$CompacctAPI.CompacctCookies.User_ID
   }
  const obj = {
    "SP_String": "SP_Outlet_Stock_Transfer",
    "Report_Name_String": "Delete K4C Outlet Stock Transfer",
    "Json_Param_String": JSON.stringify([TempObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if (data[0].Column1 === "Done"){
      this.onReject();
      this.searchData(true);
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Doc_No: " + this.DeleteDocId.toString(),
        detail: "Succesfully Deleted"
      });
    }
  })
 }
}
getbilldate(){
  const obj = {
   "SP_String": "SP_Controller_Master",
   "Report_Name_String": "Get - Outlet Bill Date",

}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{

 console.log("this.dateList  ===",data);
this.myDate =  new Date(data[0].Outlet_Bill_Date);
this.initDate = [this.myDate , this.myDate];
 // on save use this
// this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));

})
}
saveCheck(valid){
  this.stockTransferFormSubmit = true;
  if(valid){
    if(this.ObjstockTransfer.From_Outlet && this.ObjstockTransfer.From_Stock_Point){
    const TempObj = {
      Cost_Cen_ID : this.ObjstockTransfer.From_Outlet,
      Godown_Id : this.ObjstockTransfer.From_Stock_Point
   }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Check_Day_End",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data[0].Status === "Allow"){
        this.ValidateEntryCheck();
      }
      else if(data[0].Status === "Disallow"){    // Disallow
        this.checkSave = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "c",
          sticky: true,
          severity: "error",
          summary: data[0].Message,
          detail: "Confirm to proceed"
        });
        this.productDetails = [];
        this.clearData();
      }
    })
  }
  }

}
ValidateEntryCheck(){
  let saveData = [];
  const ExitsProduct = this.toOutletList.filter( item => Number(item.Cost_Cen_ID) === Number(this.ObjstockTransfer.To_Outlet));
  if(ExitsProduct.length){
    this.BrandId = ExitsProduct[0].Brand_ID;
  }

  if(this.productDetails.length){
    this.productDetails.forEach(el=>{
      const saveObj ={
            Doc_No: "A",
            Doc_Date: this.DateService.dateConvert(new Date(this.myDate)),
            Brand_ID: this.BrandId,
            From_Cost_Cen_ID: Number(this.ObjstockTransfer.From_Outlet),
            From_godown_id: Number(this.ObjstockTransfer.From_Stock_Point),
            To_Cost_Cen_ID: Number(this.ObjstockTransfer.To_Outlet),
            To_godown_id: Number(this.ObjstockTransfer.To_Stock_Point),
            Product_ID: el.Product_ID,
            Product_Description: el.Product_Description,
            Product_Type_ID: el.Product_Type_ID,
            Batch_NO: el.Batch_NO,
            Qty: el.Qty,
            UOM: el.UOM,
            Remarks: this.ObjstockTransfer.REMARKS ? this.ObjstockTransfer.REMARKS : "NA",
            User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
            Material_Type : el.Material_Type,
            Cost_Cent_ID : Number(this.ObjstockTransfer.From_Outlet),
            Batch_No: el.Batch_NO,
      }
      saveData.push(saveObj)
    })
    console.log("saveData",saveData);
  const obj = {
    "SP_String": "SP_Validate_Entry",
    "Report_Name_String": "Validate Issue",
    "Json_Param_String": JSON.stringify(saveData)
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("Validate Entry ===" , data);
    if(data[0].status === "True") {
      this.saveDispatch();
    }
    else if(data[0].status === "false"){   
      var productDes = data[0].Product_Description; 
      var batchn = data[0].Batch_No;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Insufficient Stock In",
        detail: productDes   +  ' , ' +   batchn
      })
    }
  })
}
}
}

class stockTransfer{
  From_Outlet : any;
  From_Stock_Point :any;
  To_Outlet : any;
  To_Stock_Point : any = undefined;
  REMARKS : any;
}
class additem {
  Product_ID = 0;
  Issue_Qty: number;
  Batch_No:any;
  Material_Type : string;
  Avl_Qty : number;
  }
  class BrowseData {
    From_Date: string;
    To_Date: string;
    Cost_Cen_ID : any = undefined;
    Material_Type : string;
    }
