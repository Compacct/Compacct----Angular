import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from "../../../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../../../shared/compacct.global/dateTime.service";
import { CompacctHeader } from "../../../../../shared/compacct.services/common.header.service";


@Component({
  selector: 'app-k4-c-dispatch-to-outlet',
  templateUrl: './k4-c-dispatch-to-outlet.component.html',
  styleUrls: ['./k4-c-dispatch-to-outlet.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4CDispatchToOutletComponent implements OnInit {

  Objdispatch: dispatch = new dispatch()
  Objadditem: additem = new additem ()
  ObjBrowseData : BrowseData = new BrowseData ()
  costcenterList = [];
  myDate : Date;
  productDetails = [];
  buttonname = "Create";
  Spinner = false;
  itemList =[];
  items = [];
  tabIndexToView = 0;
  menuList = [];
  brandInput = false ;
  NativeitemList = [];
  FromGodownList = [];
  adlist: any = {};
  EditList = [];
  inList = false;
  saveData = [];
  outLetDis = false;
  GetAllDataList = [];
  VehicleList = [];
  AddtionalFormSubmit = false;
  matchflag = true;
  AdditioanFormSubmit = false;
  OutletFormSubmit = false;
  DispatchFormSubmit = false;
  disabled: boolean = true;
  seachSpinner = false;
  doc_no : any;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService
    ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Distribution Challan",
      Link: "Material Management -> Outward -> Distribution Challan"
    });

    this.GetDate();
    this.getCostcenter();
    this.GetFromGodown();
    this.GetVehicle();

  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.brandInput = false ;
    this.buttonname = "Save";
    this.clearData();
  }
  onConfirm(){ }
  onReject(){}
  clearData(){
  this.Objdispatch = new dispatch();
  this.Objdispatch.From_Godown_ID = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
  this.ObjBrowseData.Cost_Cen_ID = this.costcenterList.length === 1 ? this.costcenterList[0].Cost_Cen_ID : undefined;
  console.log("this.ObjBrowseData.Cost_Cen_ID",this.ObjBrowseData.Cost_Cen_ID);
  this.productDetails =[];
  this.doc_no = undefined;
  this.outLetDis = false;
  this.AdditioanFormSubmit = false;
  this.OutletFormSubmit = false;
  this.DispatchFormSubmit = false;
  }
  getCostcenter(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get Sale Requisition Outlet",
      "Json_Param_String": JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}])
     // "Json_Param_String": JSON.stringify([{User_ID : 61}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log("costcenterList  ===",data);
      this.costcenterList = data;
      this.ObjBrowseData.Cost_Cen_ID = this.costcenterList.length === 1 ? this.costcenterList[0].Cost_Cen_ID : undefined;

    })
  }
  GetDate(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get Challan Date For Dispatch to outlet",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("OutletNameList  ===",data);

      //this.ObjRequistion.Req_Date = new Date(data[0].Requisition_Date);
      this.myDate =  new Date(data[0].Bill_Date);
      // on save use this
      //this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));??
      console.log("dateList  ===",this.myDate);
    })
  }
  GetProductDetails(){
    console.log(this.Objdispatch.Cost_Cen_ID)
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Product list For Dispatch to outlet",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.Objdispatch.Cost_Cen_ID}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.productDetails = data;
      console.log("this.productDetails",this.productDetails);
      this.productDetails.forEach((item)=>{
        if(!item.Issue_Qty){
          item.Issue_Qty = undefined;
        }
      })
    })
    this.getItem()
  }
  saveDispatch(OutletValid,DispatchValid){
    console.log("OutletValid",OutletValid);
    console.log("DispatchValid",DispatchValid);
  this.AdditioanFormSubmit = true;
  this.OutletFormSubmit = true;
  this.DispatchFormSubmit = true;
  if(OutletValid && DispatchValid){
    if(this.doc_no){
      this.saveData = [];
      console.log ("Update");
      this.productDetails.forEach(el=>{
        if(el.Issue_Qty && el.Issue_Qty !== 0 ){
          const saveObj = {
            Doc_No : this.doc_no,
            Doc_Date : this.DateService.dateConvert(new Date()),
            F_Cost_Cen_ID : this.Objdispatch.F_Cost_Cen_ID,
            To_Cost_Cen_ID : this.Objdispatch.Cost_Cen_ID,
            Product_ID :el.Product_ID,
            Qty : el.Issue_Qty,
            Rate : el.Rate,
            Req_Qty : el.Req_Qty,
            Vehicle_Details : this.Objdispatch.Vehicle_Details,
            UOM : el.UOM,
            USER_ID : this.Objdispatch.USER_ID,
            From_Godown_ID : this.Objdispatch.From_Godown_ID,
            REMARKS : this.Objdispatch.REMARKS,
            Fin_Year_ID : this.Objdispatch.Fin_Year_ID
          }
          this.saveData.push(saveObj)
        }
      })
      console.log("this.saveData",this.saveData);
     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Add K4C Txn Distribution",
      "Json_Param_String": JSON.stringify(this.saveData)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      var tempID = data[0].Column1;
      if(data[0].Column1){
       this.compacctToast.clear();
       this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Distribution Challan No. " + tempID,
        detail: "Distribution Challan Update Succesfully"
      });
      this.tabIndexToView = 0;
      this.items = ["BROWSE", "CREATE"];
      this.buttonname = "Create";
      this.clearData()
     }
     })
     this.clearData();
    }
    else{
      console.log("create");
      this.saveData = [];
      this.productDetails.forEach(el=>{
        if(el.Issue_Qty && el.Issue_Qty !== 0 ){
          const saveObj = {
            Doc_No : "A",
            Doc_Date : this.DateService.dateConvert(new Date()),
            F_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
            To_Cost_Cen_ID : this.Objdispatch.Cost_Cen_ID,
            Product_ID :el.Product_ID,
            Qty : el.Issue_Qty,
            Rate : el.Rate,
            Req_Qty : el.Req_Qty,
            Vehicle_Details : this.Objdispatch.Vehicle_Details,
            UOM : el.UOM,
            USER_ID : this.$CompacctAPI.CompacctCookies.User_ID,
            From_Godown_ID : this.Objdispatch.From_Godown_ID,
            REMARKS : this.Objdispatch.REMARKS,
            Fin_Year_ID : this.$CompacctAPI.CompacctCookies.Fin_Year_ID
          }
          this.saveData.push(saveObj)
        }
      })
      console.log("this.saveData",this.saveData);
     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Add K4C Txn Distribution",
      "Json_Param_String": JSON.stringify(this.saveData)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      var tempID = data[0].Column1;
      if(data[0].Column1){
       this.compacctToast.clear();
       this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Distribution Challan No. " + tempID,
        detail: "Distribution Challan Entry Succesfully"
      });
      this.tabIndexToView = 0;
      this.items = ["BROWSE", "CREATE"];
      this.buttonname = "Create";
      this.clearData()
     }
     })
     this.clearData();
    }
  }

 }

addItem(valid){
  this.matchflag = true;
  console.log("this.Objadditem.Product_ID",this.Objadditem.Product_ID);
  this.AddtionalFormSubmit = true;
  if(valid) {
    const ProductArrValid = this.productDetails.filter( item => Number(item.Product_ID) === Number(this.Objadditem.Product_ID));
    if(!ProductArrValid.length) {
      const item = this.NativeitemList.filter( obj => Number(obj.Product_ID) === Number(this.Objadditem.Product_ID))[0];
      this.adlist = {
        'Product_ID' : item.Product_ID,
        'Product_Description' : item.Product_Description,
        'Req_Qty' : 0,
        'Rate' : item.Sale_rate,
        'Issue_Qty' : this.Objadditem.Issue_Qty,
        'UOM': item.UOM

       }
      console.log("this.adlist",this.adlist);
      this.productDetails.push(this.adlist);
      this.Objadditem = new additem ();
      this.AddtionalFormSubmit = false;
    } else {
      this.Objadditem = new additem ();
      this.compacctToast.clear();
         this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Already in list ",
          detail: "This Unit of Measure already in List"
        });
    }
  }

}
getItem(){
  const TempObj ={
    Cost_Cen_ID : this.Objdispatch.Cost_Cen_ID,
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
    this.NativeitemList = data;
   console.log("this.NativeitemList",this.NativeitemList);
    this.NativeitemList.forEach(el => {
      this.itemList.push({
        label: el.Product_Description,
        value: el.Product_ID
      });
    });

  })
}
GetFromGodown(){
  console.log(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Production Godown",
    "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
    //console.log(this.$CompacctAPI.CompacctCookies.User_ID )
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.FromGodownList = data;
    console.log("this.FromGodownList",this.FromGodownList);
   // this.Objdispatch.From_Godown_ID = this.FromGodownList.length === 1 ? this.FromGodownList[0].From_Godown_ID : undefined;
  })

}
GetVehicle(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Vehicle Details",
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.VehicleList = data;
    console.log("this.VehicleList",this.VehicleList);
  })
}
getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjBrowseData.From_Date = dateRangeObj[0];
    this.ObjBrowseData.To_Date = dateRangeObj[1];
  }
}
searchData(){
  this.ObjBrowseData.Cost_Cen_ID = this.ObjBrowseData.Cost_Cen_ID === undefined ? 0 : this.ObjBrowseData.Cost_Cen_ID ;
  console.log("this.ObjBrowseData.Cost_Cen_ID",this.ObjBrowseData.Cost_Cen_ID);
  const start = this.ObjBrowseData.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseData.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseData.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseData.To_Date))
      : this.DateService.dateConvert(new Date());
    const tempDate = {
      From_Date :start,
      To_Date :end,
      Cost_Cen_ID :this.ObjBrowseData.Cost_Cen_ID
      //Cost_Cen_ID :30
    }

   const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get Dispatch Details",
    "Json_Param_String": JSON.stringify([tempDate])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.GetAllDataList = data;
    console.log("this.GetAllDataList",this.GetAllDataList);
    this.ObjBrowseData.Cost_Cen_ID = this.costcenterList.length === 1 ? this.costcenterList[0].Cost_Cen_ID : undefined;
   // this.Objdispatch.From_Godown_ID = this.FromGodownList.length === 1 ? this.FromGodownList[0].From_Godown_ID : undefined;
  })

}
editmaster(masterProduct){
  this.productDetails = [];
  this.clearData();
  this.outLetDis = true;
  if(masterProduct.Doc_No){
  this.tabIndexToView = 1;
  this.items = ["BROWSE", "UPDATE"];
  this.buttonname = "Update";
  this.brandInput = true;
  this.geteditmaster(masterProduct);
  }
}
geteditmaster(masterProduct){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get Dispatch Details For Edit",
    "Json_Param_String": JSON.stringify([{Doc_No : masterProduct.Doc_No}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.EditList = data;
    console.log("this.EditList",this.EditList);

    this.doc_no = data[0].Doc_No;
   this.Objdispatch.Cost_Cen_ID = data[0].To_Cost_Cen_ID.toString();
   this.myDate =  new Date(data[0].Doc_Date);
   this.Objdispatch.From_Godown_ID = data[0].From_Godown_ID;
   this.Objdispatch.Vehicle_Details = data[0].Vehicle_Details;
   this.Objdispatch.REMARKS = data[0].REMARKS;
   this.Objdispatch.USER_ID = data[0].USER_ID;
   this.Objdispatch.Fin_Year_ID = data[0].Fin_Year_ID;
   this.Objdispatch.F_Cost_Cen_ID = data[0].F_Cost_Cen_ID;
    this.EditList.forEach(el=>{
      this.productDetails.push({
        Issue_Qty : el.Qty,
        Product_Description : el.Product_Description,
        Product_ID : el.Product_ID,
        Rate : el.Rate,
        Req_Qty : el.Req_Qty,
        UOM : el.UOM
      });
    })

  })
}
}

class additem {
Product_ID = 0;
Issue_Qty: number;
}
class dispatch{
  Cost_Cen_ID : any;
  From_Godown_ID : number;
  REMARKS :any ;
  Vehicle_Details:any;
  F_Cost_Cen_ID : number;
  Fin_Year_ID : number;
  USER_ID : any;
}
class BrowseData {
  From_Date: string;
  To_Date: string;
  Cost_Cen_ID : any = 0;
  }
