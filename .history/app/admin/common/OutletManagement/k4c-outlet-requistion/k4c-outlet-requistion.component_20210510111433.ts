import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";

@Component({
  selector: 'app-k4c-outlet-requistion',
  templateUrl: './k4c-outlet-requistion.component.html',
  styleUrls: ['./k4c-outlet-requistion.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cOutletRequistionComponent implements OnInit {

  requistion_no_gen : number;
  Spinner = false;
  display: boolean = false;
  popUP_Display:boolean = false;
  filteredData = [];
  tabIndexToView = 0;
  buttonname = "Save";
  items = [];
  requistionId : number;
  edit = false;
  valid = false;
  expanded = false;
  GetAllDataList = [];
  Qty = '';
  seachSpinner = false;
  StockSearchFormSubmitted = false;
  menuList = [];
  dateList = [];
  Product_ID = [];
  rowGroupMetadata: any;
  cars = [];
  brandInput = false ;
  myDate : Date;
  today = new Date();
  BirthDate:Date;
  OutletNameList = [];
  RequisitionList = [];
  Bdate = Date;
  disabled: boolean = true;
  ObjRequistion: Requistion = new Requistion();
  ObjRequistionSave: RequistionSave = new RequistionSave();
  ObjBrowseData: BrowseData = new BrowseData();
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService) {

    }

  ngOnInit() {

    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Requisition",
      Link: " Outlet -> Requisition"
    });
 this.onload();
  }

  async onload() {
    // console.log(product_id);
    // console.log('fired');
    await this.getProductSubTypeList().then(response => {
     console.log("pageLoad ====",response);
    var TimeOut = response[0].Allow;
     //var TimeOut = "YES";
     console.log("TimeOut",TimeOut);
     if(TimeOut == "YES"){
       this.disabled = false;
       this.popUP_Display = false;
      this.GetDate();
      this.GetOutletName();
      }
      else {
        this.popUP_Display = true;
        this.disabled = true;
      }
    });
  }
  async getProductSubTypeList(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get Sale Requisition Time Out",
      "Json_Param_String": JSON.stringify([{Doc_Type : "Requi"}])
    }
     const response = await this.GlobalAPI.getData(obj).toPromise();
    return response;

  }
 onReject(){}
 onConfirm(){
  if(this.requistionId){
      const TempObj ={
        Req_ID : this.requistionId,
        Req_No_Gen: this.requistion_no_gen
      }
      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "Delete Requisition",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log("del Data===", data[0].Column1);
        if (data[0].Column1 === "Done"){
          this.onReject();
         // this.getRowData();
         this.valid = true;
         this.SearchStockBill(this.valid);
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Product Id: " + this.requistionId.toString(),
            detail: "Succesfully Deleted"
          });


        }
      })
    }

}
GetOutletName(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get Sale Requisition Outlet",
    "Json_Param_String": JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}])
   // "Json_Param_String": JSON.stringify([{User_ID : 61}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("OutletNameList  ===",data);
    this.OutletNameList = data;

  })
}
GetDate(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get Sale Requisition Date",
    "Json_Param_String": JSON.stringify([{Doc_Type : "Requi"}])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //console.log("OutletNameList  ===",data);
    this.dateList = data;
    console.log("this.dateList  ===",this.dateList);
    //this.ObjRequistion.Req_Date = new Date(data[0].Requisition_Date);
    this.myDate =  new Date(data[0].Requisition_Date);
    // on save use this
    //this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));??
    console.log("dateList  ===",this.myDate);
  })
}
TabClick(e) {
  this.tabIndexToView = e.index;
  this.items = ["BROWSE", "CREATE"];
  this.brandInput = false ;
  this.buttonname = "Save";
  this.clearData();
}
clearData(){
  this.ObjRequistion= new Requistion();
  this.RequisitionList =[];
  this.requistionId = undefined;
  this.expanded = false
}
getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjBrowseData.req_date_B = dateRangeObj[0];
    this.ObjBrowseData.req_date2 = dateRangeObj[1];
  }
}
getRequisition(){
  var ProductType=[];
  this.rowGroupMetadata = {};
  this.cars = [];
  this.RequisitionList = [];
  this.updateRowGroupMetaData();
if(this.ObjRequistion.Cost_Cen_ID){
 console.log(this.ObjRequistion.Cost_Cen_ID);
  const TempObj ={
    Cost_Cen_ID : this.ObjRequistion.Cost_Cen_ID,
    Doc_Type : "Requi",
    User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
    Doc_Date : this.DateService.dateTimeConvert(new Date(this.myDate))
  }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get Sale Requisition Product",
    "Json_Param_String": JSON.stringify([TempObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.RequisitionList = data;
    this.RequisitionList.forEach((item)=>{
      if(!item.Req_Qty){
        item.Req_Qty = undefined;
      }
    })
    this.cars = this.RequisitionList;
    this.updateRowGroupMetaData();


   console.log("RequisitionList",this.RequisitionList)
  })
}
}
SearchStockBill(valid) {
  this.StockSearchFormSubmitted = true;
  if (valid) {
    this.seachSpinner = true;
    const start = this.ObjBrowseData.req_date_B
      ? this.DateService.dateConvert(new Date(this.ObjBrowseData.req_date_B))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseData.req_date2
      ? this.DateService.dateConvert(new Date(this.ObjBrowseData.req_date2))
      : this.DateService.dateConvert(new Date());
    const tempDate = {
      From_Date :start,
      To_Date :end,
      Cost_Cen_ID :this.ObjBrowseData.Cost_Cen_ID_B
      //Cost_Cen_ID :30
    }
    //console.log("tempDate",tempDate);

      const objj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "Browse - Requisition",
        "Json_Param_String": JSON.stringify([tempDate])
      }
      this.GlobalAPI.getData(objj).subscribe((data:any)=>{
        this.GetAllDataList = data;
       console.log("GetAllDataList",this.GetAllDataList)
       this.seachSpinner = false;
      })
  }
}

trackByFunction = (index, item) => {
  return item.Product_ID // O index
}
// Edit New

editmaster(masterProduct){
  this.edit = true;
  this.clearData();
  if(masterProduct.Req_ID){
  this.tabIndexToView = 1;
  this.items = ["BROWSE", "UPDATE"];
  this.buttonname = "Update";
  this.brandInput = true;
  this.geteditmaster(masterProduct);
  }
}
geteditmaster(masterProduct){
  // console.log(product_id)
  this.requistionId =  masterProduct.Req_ID ;
  console.log("this.requistionId",this.requistionId);
  const tempObj = {
    Req_ID:masterProduct.Req_ID,
    Req_No_Gen: masterProduct.Req_No
  }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get Requisition Data",
    "Json_Param_String": JSON.stringify([tempObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    const editDataList = data[0];
    console.log("editDataList===",editDataList);
    this.ObjRequistion = editDataList;
    console.log(" this.ObjRequistion ===", this.ObjRequistion)
    const tempProduct = {
    'Amount': masterProduct.Amount,
    'Product_Description': masterProduct.Product_Description,
    'Product_ID': masterProduct.Product_ID,
    'Sale_rate': masterProduct.Rate,
    'Req_Date': masterProduct.Req_Date,
    'Req_ID': masterProduct.Req_ID,
    'Req_No': masterProduct.Req_No,
    'Req_Qty': masterProduct.Req_Qty,
    'Req_Type': masterProduct.Req_Type,
    'Product_Type' : masterProduct.Product_Type,
    'UOM' : masterProduct.UOM
  }
  this.RequisitionList.push(tempProduct)

  this.updateRowGroupMetaData();
   })

}
updateRowGroupMetaData() {
  this.rowGroupMetadata = {};
  let previousRowGroup = [];

        if (this.RequisitionList) {
            for (let i = 0; i < this.RequisitionList.length; i++) {
                let rowData = this.RequisitionList[i];
                //console.log("rowData ===",rowData);
                let Product_Type = rowData.Product_Type;
                if (i == 0) {
                    this.rowGroupMetadata[Product_Type] = { index: 0, size: 1 };
                }
                else {
                    let previousRowData = this.RequisitionList[i - 1];
                    let previousRowGroup = previousRowData.Product_Type;

                    if (Product_Type === previousRowGroup){
                      this.rowGroupMetadata[Product_Type].size++;
                    }else {
                      this.rowGroupMetadata[Product_Type] = { index: i, size: 1 };
                    }
                }
            }
        }
    }
QtyChanged(indx) {
      console.log("indx===",indx);
      this.RequisitionList[indx]['Amount'] =  undefined;
      if(this.RequisitionList[indx]['Req_Qty'] && this.RequisitionList[indx]['Sale_rate']){
        this.RequisitionList[indx]['Amount'] = this.RequisitionList[indx]['Req_Qty'] * this.RequisitionList[indx]['Sale_rate'];
      }
    }
getTotalValue(){
  let val = 0;
  this.filteredData.forEach((item)=>{
    val += item.Amount
  });
  return val ? val : '-';
}
showDialog() {
  this.display = true;
  this.filteredData = [];
  this.RequisitionList.forEach(obj => {
    if(obj.Req_Qty && obj.Req_Qty !== 0 ){
    //  console.log(filteredData.push(obj.Product_ID));
    this.filteredData.push(obj);
      console.log("this.filteredData===",this.filteredData);
    }

 })
}
saveREquistion(){
  this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));
  this.OutletNameList.forEach(el =>{
    if(this.ObjRequistion.Cost_Cen_ID == el.Cost_Cen_ID){
      this.ObjRequistion.Cost_Cen_Name = el.Cost_Cen_Name;
    }
  })

   if(this.requistionId){
    console.log("Update");
    this.filteredData.forEach(el =>{
     const obj = {
    Req_ID : el.Req_ID,
    Req_No_Gen : el.Req_No,
    Product_ID: el.Product_ID,
    Product_Description:el. Product_Description,
    Req_Qty: el.Req_Qty,
    Rate: el.Sale_rate,
    Amount: el.Amount,
    Accepted: "y",
    Challan_No: "A",
    Req_Type: "web"
  }
  this.Product_ID.push({...this.ObjRequistion,...obj})
    })

    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Update Requisition",
      "Json_Param_String": JSON.stringify(this.Product_ID)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("Column1 ===",data[0].Column1);
     var tempID = data[0].Column1;
     console.log("update data",data);
     if(data[0].Column1){
      this.valid = true;
      this.SearchStockBill(this.valid);
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Requistion Entry No. " + tempID,
       detail: "Succesfully Updated"
     });
     this.filteredData = [];
     this.display = false;
     this.tabIndexToView = 0;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Create";
     this.clearData()
    }

    })

   }
   else{
    console.log("Save");
    this.filteredData.forEach(el =>{
      const obj = {
        Product_ID : el.Product_ID,
        Req_Type : "WEB",
        Req_No_Gen :"A",
        Req_Qty :el.Req_Qty,
        Product_Description : el.Product_Description,
        Rate : el.Sale_rate,
        Amount : el.Amount,

      }
      this.Product_ID.push({...this.ObjRequistion,...obj})
     })
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Add Requisition",
      "Json_Param_String": JSON.stringify(this.Product_ID)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("Column1 ===",data[0].Column1);
     var tempID = data[0].Column1;
     if(data[0].Column1){
      this.valid = true;
      this.SearchStockBill(this.valid);
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Requistion Entry No. " + tempID,
       detail: "Requistion Entry Succesfully"
     });

    }
    this.filteredData = [];
    this.display = false;
    this.tabIndexToView = 0;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    //this.ObjRequistion.Cost_Cen_ID = "undefined";
    this.clearData();
    })
   }
}
DeleteCostcenter(masterProduct){
  console.log("delect masterProduct ===",masterProduct);

   this.requistionId = undefined ;
   this.requistion_no_gen = undefined ;
   if(masterProduct.Req_ID){
     this.requistionId = masterProduct.Req_ID ;
     console.log("delect masterProduct ===",this.requistionId);
     this.requistion_no_gen = masterProduct.Req_No ;
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
class Requistion {
  Cost_Cen_ID : any;
  Req_Date : string;
  Cost_Cen_Name:string ;

}
class RequistionSave {
  Req_No="A";
  Product_ID = 0;
  Product_Description:string;
  Req_Qty = 0 ;
  Rate = 0;
  Amount = 0;
  Req_Type = "WEB";
  Req_ID = 0;
  Req_No_Gen : any;
}
class BrowseData {
  req_date_B: string;
  req_date2: string;
  Cost_Cen_ID_B: number;

}
