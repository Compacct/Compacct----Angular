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
import { NgxUiLoaderService } from "ngx-ui-loader";


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
  todayDate : any = new Date();
  myDate : Date;
  ChallanDate : any = Date ;
  productDetails = [];
  buttonname = "Create";
  Spinner = false;
  SpinnerShow = false;
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
  outletList = [];
  brandList = [];
  brandListBro = [];
  doc_no : any;
  toGodownList = [];
  BatchList = [];
  reqNumber:any;
  outletListBro = [];
  data = "(Show All Products)";
  inputBoxDisabled = false;
  indentdateDisabled = true;
  //adDisabled = true;
  RequistionSearchFormSubmit = false;
  flag = false;
  toutLetDis = false;
  To_Godown_ID_Dis = false;
  From_Godown_ID_Dis = false;
  editPopUp = false;
  editdataList = [];
  brand = undefined;
  toOutlet = undefined;
  OutletStokePoint = undefined;
  challanDate : any;
  fromStokePoint = undefined;
  VehicleDetails = undefined;
  Remarks = undefined;
  editFlag = false;
  editDis = false;
  reqQTYdis = true;
  AccQtydis = false;
  initDate = [];
  doc_date: any;
  filteredData = [];
  displaysavepopup = false;
  IndentNoList = [];
  BackupIndentList = [];
  IndentFilter = [];
  SelectedIndent: any;
  TIndentList = [];
  BackUpproductDetails = [];
  Refreshlist = [];
  RefreshData = [];
  editIndentList = [];
  Auto_Accepted: any;
  totalqty: any;
  totalaccpqty: any;
  batchqty: any;
  totaldelqty: any;

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
    ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Dispatch Challan",
      Link: "Material Management -> Outward -> Dispatch Challan"
    });

    this.GetDate();
    this.GetFromGodown();
    this.GetVehicle();
    this.GetoutletList();
    this.getBrand();
    this.GetBrandBro();
    this.ObjBrowseData.Cost_Cen_ID = undefined;
   }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.brandInput = false ;
    this.buttonname = "Save";
    //this.ObjBrowseData = new BrowseData ()
    this.Objdispatch= new dispatch();
    this.productDetails = [];
    this.BackUpproductDetails = [];
    this.inputBoxDisabled = false;
    this.indentdateDisabled = true;
    this.From_Godown_ID_Dis = false;
    this.To_Godown_ID_Dis = false;
   // this.adDisabled = true;
    this.ObjBrowseData.Brand_ID = undefined;
    this.ObjBrowseData.Cost_Cen_ID = undefined;
    this.clearData();
    this.todayDate = new Date();
    this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
    this.SelectedIndent = [];
    this.IndentFilter = [];
  }
  onConfirm(){
    if(this.doc_no){
      const TempObj = {
        Doc_No : this.doc_no,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
        Doc_Date : this.doc_date
      }
      const obj = {
        "SP_String": "SP_Production_Voucher",
        "Report_Name_String": "Delete Distribution Challan",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("del Data===", data[0].Column1)
         if (data[0].Column1 === "Done"){
           this.onReject();
           this.searchData(true);
           this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Doc No.: " + this.doc_no.toString(),
             detail: "Succesfully Deleted"
           });
           this.clearData();
           this.todayDate = new Date();
           this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
         }
       })
    }
  }
  onReject(){
    this.compacctToast.clear("c");
  }
  clearData(){
  // this.ObjBrowseData.Brand_ID = this.brandListBro.length === 1 ? this.brandListBro[0].Brand_ID : undefined;
  // this.ObjBrowseData.Cost_Cen_ID = this.costcenterList.length === 1 ? this.costcenterList[0].Cost_Cen_ID : undefined;
  console.log("this.ObjBrowseData.Cost_Cen_ID",this.ObjBrowseData.Cost_Cen_ID);
  this.doc_no = undefined;
  this.outLetDis = false;
  this.AdditioanFormSubmit = false;
  this.OutletFormSubmit = false;
  this.DispatchFormSubmit = false;
  this.reqNumber = undefined;
  this.Objadditem.Issue_Qty = undefined;
  //this.Objadditem.Product_ID = undefined;
  //this.Objadditem.Batch_No = undefined;
  this.RequistionSearchFormSubmit = false;
  this.BatchList = [];
  this.itemList = [];
  this.editDis = false;
  this.reqQTYdis = true;
  this.AccQtydis = false;
  this.EditList = [];
  this.editIndentList = [];
  // this.todayDate = new Date();
  // this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
  //this.SelectedIndent = [];
  // this.IndentNoList = [];
  // this.BackupIndentList = [];
  //this.IndentFilter = []
  this.ngxService.stop();
  }
  getCostcenter(){
    console.log(this.Objdispatch.Brand_ID)
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Outlet For Distribution",
      "Json_Param_String": JSON.stringify([{Brand_ID : this.Objdispatch.Brand_ID}])
     // "Json_Param_String": JSON.stringify([{User_ID : 61}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("costcenterList  ===",data);
      this.costcenterList = data;
     // this.Objdispatch.Cost_Cen_ID = this.costcenterList.length === 1 ? this.costcenterList[0].Cost_Cen_ID : undefined;
       this.Getgodown();
        })
  }
  getCostcenterBro(){
    console.log(this.ObjBrowseData.Brand_ID)
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Outlet",
      "Json_Param_String": JSON.stringify([{brand_id : this.ObjBrowseData.Brand_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log("costcenterList  ===",data);
      this.outletListBro = data;
      console.log("outletListBro",this.outletListBro);
      this.ObjBrowseData.Cost_Cen_ID = this.outletListBro.length === 1 ? this.outletListBro[0].Cost_Cen_ID : undefined;
      })
  }
  GetBrandBro(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Brand",

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("brandListBro  ===",data);
      this.brandListBro = data;
      this.ObjBrowseData.Brand_ID = this.brandListBro.length === 1 ? this.brandListBro[0].Brand_ID : undefined;
    })
  }
  GetDate(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get Date For Dispatch to outlet",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("OutletNameList  ===",data);

      //this.ObjRequistion.Req_Date = new Date(data[0].Requisition_Date);
      this.myDate =  new Date(data[0].Bill_Date);
      this.ChallanDate = new Date(data[0].Bill_Date);
      this.initDate = [this.myDate , this.myDate];
      // on save use this
      //this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));??
      console.log("dateList  ===",this.myDate);
    })
  }
  GetoutletList(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Outlet Name",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("outletList  ===",data);
      this.outletList = data;
      this.Objdispatch.Cost_Cen_ID = this.outletList.length === 1 ? this.outletList[0].Cost_Cen_ID : undefined;
      if(this.Objdispatch.Cost_Cen_ID){
        this.toutLetDis = true;
      }
    })
  }
  autoacceptedChange() {
    //this.ExpiredProductFLag = false;
   if(this.Objdispatch.Cost_Cen_ID) {
     const ctrl = this;
     const autoacceptedObj = $.grep(ctrl.outletList,function(item: any) {return item.Cost_Cen_ID == ctrl.Objdispatch.Cost_Cen_ID})[0];
     console.log(autoacceptedObj);
     this.Auto_Accepted = autoacceptedObj.Auto_Accepted;
     
    }
    }
  Getgodown(){
    this.toutLetDis = true;
    console.log(this.Objdispatch.Cost_Cen_ID)
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Godown For Sale Bill",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.Objdispatch.Cost_Cen_ID}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.toGodownList = data;
      console.log("this.toGodownList",this.toGodownList);
      this.Objdispatch.To_Godown_ID= this.toGodownList[0].godown_id ;
      if(this.Objdispatch.To_Godown_ID){
        this.To_Godown_ID_Dis = true;
      }
      this.GetreqItem();
      this.autoacceptedChange();
    })
  }
    CheckLengthProductID(ID) {
      const tempArr = this.productDetails.filter(item=> item.product_id == ID);
      return tempArr.length
    }
    CheckIndexProductID(ID) {
      let found = 0;
      for(let i = 0; i < this.productDetails.length; i++) {
          if (this.productDetails[i].product_id == ID) {
              found = i;
              break;
          }
      }
      return found;
    }
  GetProductDetails(){
    console.log(this.Objdispatch.Cost_Cen_ID)
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Godown For Sale Bill",
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
      //this.GetreqItem();
    })

  }
  // SAVE DISPATCH
  getTotalIndValue(){
    let Indval = 0;
    this.filteredData.forEach((item)=>{
      Indval += Number(item.Req_Qty)
    });
    this.totalqty = (Indval).toFixed(2);
    return Indval ? Indval.toFixed(2) : '-';
  }
  getTotalBatchValue(){
    let batchval = 0;
    this.filteredData.forEach((item)=>{
      batchval += Number(item.Batch_Qty)
    });
    this.batchqty = (batchval).toFixed(2);
    return batchval ? batchval.toFixed(2) : '-';
  }
  getTotalIssueValue(){
    let issueval = 0;
    let acceptedval = 0;
    this.filteredData.forEach((item)=>{
      issueval += Number(item.Delivery_Qty)
      if (this.AccQtydis) {
      acceptedval += Number(item.Accepted_Qty)
      }
    });
    this.totaldelqty = (issueval).toFixed(2);
    this.totalaccpqty = (acceptedval).toFixed(2);
    return issueval ? issueval.toFixed(2) : '-';
  }
  showDialog() {
    this.displaysavepopup = true;
    this.filteredData = [];
  //   this.BackUpproductDetails.forEach(obj => {
  //     if(obj.Delivery_Qty && Number(obj.Delivery_Qty) !== 0 ){
  //     //  console.log(filteredData.push(obj.Product_ID));
  //     this.filteredData.push(obj);
  //      // console.log("this.filteredData===",this.filteredData);
  //   }
  //  })
   this.productDetails.forEach(obj => {
    if(obj.Delivery_Qty){  //   && Number(obj.Delivery_Qty) !== 0
    //  console.log(filteredData.push(obj.Product_ID));
    this.filteredData.push(obj);
     // console.log("this.filteredData===",this.filteredData);
  }
 })
  }
  // FOR SAVE DISPATCH
  getReqNo(){
    let Rarr =[]
    if(this.SelectedIndent.length) {
      this.SelectedIndent.forEach(el => {
        if(el){
          const Dobj = {
            Req_No : el
            }
            Rarr.push(Dobj)
        }

    });
      // console.log("Table Data ===", Rarr)
      // return Rarr.length ? JSON.stringify(Rarr) : '';
    }
    else {
      const Dobj = {
        Req_No : 'NA'
        }
        Rarr.push(Dobj)
    }
    console.log("Table Data ===", Rarr)
    return Rarr.length ? JSON.stringify(Rarr) : '';
  }
  saveDispatch(){
   console.log("saveqty",this.saveqty());
   console.log("this.BackUpproductDetails",this.BackUpproductDetails);
  if(this.BackUpproductDetails.length && this.saveqty()){
    // this.ngxService.start();
    // this.displaysavepopup = false;
    if(this.doc_no){
      this.saveData = [];
      console.log ("Update");
      this.BackUpproductDetails.forEach(el=>{
        if(el.Delivery_Qty){
          const saveObj = {
            Doc_No: this.doc_no,
            Accepted_Qty : el.Accepted_Qty,
            Doc_Date: this.DateService.dateTimeConvert(new Date(this.ChallanDate)),
            F_Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
            F_Godown_ID: this.Objdispatch.From_Godown_ID,
            To_Cost_Cen_ID: this.Objdispatch.Cost_Cen_ID,
            To_Godown_ID: this.Objdispatch.To_Godown_ID,
            Product_ID: el.product_id,
            Batch_No: el.Batch_No,
            Qty: el.Delivery_Qty,
            Rate: 0,
            UOM: el.UOM,
            User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
            REMARKS: this.Objdispatch.REMARKS ? this.Objdispatch.REMARKS : "NA",
            Fin_Year_ID: this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
            Vehicle_Details : this.Objdispatch.Vehicle_Details,
            Adv_Order_No : "NA",
            Indent_Date : this.DateService.dateConvert(new Date(this.todayDate)),
            Accept_Reason_ID : el.Accepted_Qty === el.Delivery_Qty ? 0 : el.Accept_Reason_ID,
            Accept_Reason : el.Accepted_Qty === el.Delivery_Qty ? 'NA' : el.Accept_Reason,
            Status : "Updated",
            Material_Type : "Finished",
            Total_Qty : Number(this.totaldelqty),
            Total_Accepted_Qty : Number(this.totalaccpqty)
          }
          this.saveData.push(saveObj)
        }
      })
      console.log("this.saveData",this.saveData);
      this.ngxService.start();
      this.displaysavepopup = false;
     const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Add K4C Txn Distribution",
      "Json_Param_String": JSON.stringify(this.saveData),
      "Json_1_String" : this.getReqNo()
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      var tempID = data[0].Column1;
      if(data[0].Column1){
        this.inputBoxDisabled = false;
        this.indentdateDisabled = true;
        this.From_Godown_ID_Dis = false;
        this.To_Godown_ID_Dis = false;
        this.ngxService.stop();
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
      this.todayDate = new Date();
      this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
      this.ObjBrowseData.Cost_Cen_ID = this.Objdispatch.Cost_Cen_ID;
      this.ObjBrowseData.Brand_ID = this.Objdispatch.Brand_ID;
      this.searchData(true);
      this.displaysavepopup = false;
      this.SelectedIndent = [];
      this.IndentFilter = [];

      //
      this.Objdispatch = new dispatch();
      this.productDetails = [];
      this.BackUpproductDetails = [];
      this.clearData();
      this.todayDate = new Date();
      this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
     }else{
      this.ngxService.stop();
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Something Wrong"
          });
    }
     })
    }

    else{
       console.log("create");
      this.saveData = [];
      this.BackUpproductDetails.forEach(el=>{
        if(el.Delivery_Qty){      //&& Number(el.Delivery_Qty) !== 0
          const saveObj = {
            Doc_No: "A",
            Accepted_Qty : this.Auto_Accepted == "N" ? 0 : el.Delivery_Qty,
            Doc_Date: this.DateService.dateTimeConvert(new Date(this.ChallanDate)),
            F_Cost_Cen_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
            F_Godown_ID: this.Objdispatch.From_Godown_ID,
            To_Cost_Cen_ID: this.Objdispatch.Cost_Cen_ID,
            To_Godown_ID: this.Objdispatch.To_Godown_ID,
            Product_ID: el.product_id,
            Batch_No: el.Batch_No,
            Qty: el.Delivery_Qty,
            Rate: 0,
            UOM: el.UOM,
            User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
            REMARKS: this.Objdispatch.REMARKS ? this.Objdispatch.REMARKS : "NA",
            Fin_Year_ID: this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
            Vehicle_Details : this.Objdispatch.Vehicle_Details,
            Adv_Order_No : "NA",
            Indent_Date : this.DateService.dateConvert(new Date(this.todayDate)),
            Accept_Reason_ID : null,
            Accept_Reason : null,
            Status : this.Auto_Accepted == "Y" ? "Updated" : "Not Updated",
            Material_Type : "Finished",
            Total_Qty : Number(this.totaldelqty),
            Total_Accepted_Qty  : this.Auto_Accepted == "N" ? 0 : Number(this.totaldelqty)
          }
          this.saveData.push(saveObj)
        }
      })
      console.log("this.saveData",this.saveData);
      this.ngxService.start();
      this.displaysavepopup = false;
     const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Add K4C Txn Distribution",
      "Json_Param_String": JSON.stringify(this.saveData),
      "Json_1_String" : this.getReqNo()
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      var tempID = data[0].Column1;
      if(data[0].Column1){
        this.Print(tempID);
        this.inputBoxDisabled = false;
        this.indentdateDisabled = true;
        this.From_Godown_ID_Dis = false;
        this.To_Godown_ID_Dis = false;
        this.ngxService.stop();
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
      this.todayDate = new Date();
      this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
      this.ObjBrowseData.Cost_Cen_ID = this.Objdispatch.Cost_Cen_ID;
      this.ObjBrowseData.Brand_ID = this.Objdispatch.Brand_ID;
      this.searchData(true);
      this.displaysavepopup = false;
      this.SelectedIndent = [];
      this.IndentFilter = [];

      //
      
     this.Objdispatch = new dispatch();
     this.productDetails = [];
     this.BackUpproductDetails = [];
     this.clearData();
     this.todayDate = new Date();
     this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
     }else{
      this.ngxService.stop();
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Something Wrong"
          });
    }
     })

    }
  }
  else{
    this.ngxService.stop();
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Something Wrong"
        });
  }

 }
 findWithAttr(array, attr, value) {
  for(var i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
          return i;
      }
  }
  return -1;
}

addDispatch(valid){
 let batch_id:any;
let batch_show:any;
let batch_qty :any;

console.log("valid",valid);
console.log("this.GetSelectedBatchqty()",this.GetSelectedBatchqty());
console.log("Objdispatch",this.Objdispatch);

 this.AdditioanFormSubmit = true;

  if(valid && this.GetSelectedBatchqty()){
   console.log("this.Objdispatch.Batch_No",this.Objadditem.Batch_No);
  this.BatchList.forEach(el=>{
    if(el.Batch_NO === this.Objadditem.Batch_No){
      batch_show = el.Batch_No_Show;
      batch_id = el.Batch_NO;
      batch_qty = el.Qty
     }
  })
  console.log("NativeitemList",this.NativeitemList);
  console.log("Objadditem",this.Objadditem);
  
  // const ProductArrValid = this.NativeitemList.filter(item => item.Product_ID === Number(this.Objadditem.Product_ID));
  // const ExitsProduct = this.productDetails.filter(item => Number(item.product_id) === Number(this.Objadditem.Product_ID));
  const ProductArrValid = this.NativeitemList.filter( item => Number(item.Product_ID) === Number(this.Objadditem.Product_ID));
 const ExitsProduct = this.productDetails.filter( item => Number(item.product_id) === Number(this.Objadditem.Product_ID));
 console.log("ProductArrValid.length",ProductArrValid.length); 
 console.log("ExitsProduct.length",ExitsProduct.length);

  if(ProductArrValid.length){
    if(ExitsProduct.length) {
      const index = this.findWithAttr(this.productDetails,'product_id',ExitsProduct[0].product_id);
      ProductArrValid.forEach(item=>{
        const obj = {
        // 'Doc_No': "A",
        // 'Doc_Date' : this.DateService.dateConvert(new Date()),
        // 'F_Cost_Cen_ID' : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        // 'F_Godown_ID' : this.Objdispatch.From_Godown_ID,
        // 'To_Cost_Cen_ID' : this.Objdispatch.Cost_Cen_ID,
        // 'To_Godown_ID' : this.Objdispatch.To_Godown_ID,
       // 'Product_Description' : item.Product_Description,
        Product_Type_ID : item.Product_Type_ID,
        product_type : item.Product_Type,
        product_id : item.Product_ID,
        Product_Description : item.Product_Description,
        Batch_No : batch_id,
        Batch_Qty : batch_qty,
        //Req_Qty :item.Req_Qty,
        Rate: item.Sale_rate,
        Delivery_Qty : Number(this.Objadditem.Issue_Qty),
        UOM: item.UOM,
         };

      this.productDetails.splice(index, 0, obj);
      this.BackUpproductDetails.splice(index,0,obj);
      })
    } else {
      ProductArrValid.forEach(item=>{
        this.productDetails.push({
        // 'Doc_No': "A",
        // 'Doc_Date' : this.DateService.dateConvert(new Date()),
        // 'F_Cost_Cen_ID' : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        // 'F_Godown_ID' : this.Objdispatch.From_Godown_ID,
        // 'To_Cost_Cen_ID' : this.Objdispatch.Cost_Cen_ID,
        // 'To_Godown_ID' : this.Objdispatch.To_Godown_ID,
       // 'Product_Description' : item.Product_Description,
        Product_Type_ID : item.Product_Type_ID,
        product_type : item.Product_Type,
        product_id : item.Product_ID,
        Product_Description : item.Product_Description,
        Batch_No : batch_id,
        Batch_Qty : batch_qty,
        Req_Qty :  0,
        Rate: item.Sale_rate,
        Delivery_Qty : Number(this.Objadditem.Issue_Qty),
        UOM: item.UOM,
         })
         this.BackUpproductDetails.push({
          Product_Type_ID : item.Product_Type_ID,
          product_type : item.Product_Type,
          product_id : item.Product_ID,
          Product_Description : item.Product_Description,
          Batch_No : batch_id,
          Batch_Qty : batch_qty,
          Req_Qty :item.Req_Qty,
          Rate: item.Sale_rate,
          Delivery_Qty : Number(this.Objadditem.Issue_Qty),
          UOM: item.UOM,
         })
      })
    }

    this.clearData();
    //this.Getitem2();

  }
   console.log("ADDED",this.productDetails);

 }
}
getAllitem(){
  this.NativeitemList = [];
  this.itemList = [];
  const TempObj ={
    Cost_Cen_ID : this.Objdispatch.Cost_Cen_ID,
  }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - All Product for Distribution",
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
    this.data = "(Show Requisition Products)";

  })
}

GetreqItem(){
  this.NativeitemList = [];
  this.itemList = [];
  const TempObj ={
    Cost_Cen_ID : this.Objdispatch.Cost_Cen_ID,
  }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Requisition Pending Product for Distribution",
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
    this.data = "(Show All Products)";

  })

}
Getitem2(){
  if(this.data == "(Show All Products)"){
     this.getAllitem();

  }
  if(this.data == "(Show Requisition Products)"){
   this.GetreqItem()

 }

}
GetFromGodown(){
  console.log(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Godown For Sale Bill",
    "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
    //console.log(this.$CompacctAPI.CompacctCookies.User_ID )
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.FromGodownList = data;
    console.log("this.FromGodownList",this.FromGodownList);
   // this.Objdispatch.From_Godown_ID = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
    if(this.Objdispatch.From_Godown_ID){
      this.From_Godown_ID_Dis = true;
    }
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
getConfirmDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjBrowseData.From_Date = dateRangeObj[0];
    this.ObjBrowseData.To_Date = dateRangeObj[1];
  }
}
searchData(valid){
  this.RequistionSearchFormSubmit = true;
  if(valid){
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
        Cost_Cen_ID :this.ObjBrowseData.Cost_Cen_ID ? this.ObjBrowseData.Cost_Cen_ID : 0,
        //Cost_Cen_ID :30
        Brand_ID : this.ObjBrowseData.Brand_ID ? this.ObjBrowseData.Brand_ID : 0
      }

     const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get Dispatch Details For browse",
      "Json_Param_String": JSON.stringify([tempDate])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.GetAllDataList = data;
      console.log("this.GetAllDataList",this.GetAllDataList);
      this.clearData();
      this.todayDate = new Date();
      this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
     // this.Objdispatch.From_Godown_ID = this.FromGodownList.length === 1 ? this.FromGodownList[0].From_Godown_ID : undefined;
    })
  }

}
getTotalValue(key){
  let Amtval = 0;
  this.GetAllDataList.forEach((item)=>{
    Amtval += Number(item[key]);
  });

  return Amtval ? Amtval.toFixed(2) : '-';
}
// EDIT
editmaster(masterProduct){
  this.productDetails = [];
  //this.BackUpproductDetails = [];
  this.clearData();
  this.todayDate = new Date();
  this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
  this.outLetDis = true;
  if(masterProduct.Doc_No){
  this.tabIndexToView = 1;
  this.items = ["BROWSE", "UPDATE"];
  this.buttonname = "Update";
  this.brandInput = true;
  this.editDis = true;
  //this.adDisabled = false;
  this.inputBoxDisabled = true;
  this.indentdateDisabled = false;
  this.reqQTYdis = false;
  this.AccQtydis = true;
  this.geteditmaster(masterProduct);
  this.getIndentForEdit(masterProduct);
  }
}
geteditmaster(masterProduct){
  this.EditList = [];
  const obj = {
    "SP_String": "SP_Production_Voucher",
    "Report_Name_String": "Get Dispatch Details For Edit",
    "Json_Param_String": JSON.stringify([{Doc_No : masterProduct.Doc_No}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("From Api",data);
    this.EditList = data;
    console.log("this.EditList",this.EditList);
   this.doc_no = data[0].Doc_No;
   this.ChallanDate =  new Date(data[0].Doc_Date);
   this.Objdispatch.Brand_ID = data[0].Brand_ID;
   this.getCostcenter();
   this.Objdispatch.Cost_Cen_ID = data[0].To_Cost_Cen_ID;
   this.GetFromGodown();
   this.Objdispatch.From_Godown_ID = data[0].F_Godown_ID;
   this.Objdispatch.Vehicle_Details = data[0].Vehicle_Details;
   this.Objdispatch.REMARKS = data[0].REMARKS;
   this.Objdispatch.USER_ID = data[0].USER_ID;
   this.Objdispatch.Fin_Year_ID = data[0].Fin_Year_ID;
   this.Objdispatch.F_Cost_Cen_ID = data[0].F_Cost_Cen_ID;
   this.todayDate = data[0].Indent_Date;
    this.EditList.forEach(el=>{
      this.productDetails.push({
        Delivery_Qty : el.Qty,
        Product_Description : el.Product_Description,
        product_id : el.Product_ID,
        Rate : el.Rate,
        Req_Qty : el.Req_Qty,
        UOM : el.UOM,
        Batch_No : el.Batch_No,
        Batch_Qty : el.bln_Qty,
        Batch_No_Show : el.Batch_No_Show,
        Accepted_Qty : el.Accepted_Qty ? el.Accepted_Qty : 0,
        Accept_Reason_ID : el.Accept_Reason_ID,
        Accept_Reason : el.Accept_Reason ? el.Accept_Reason : '-',
        product_type : el.Product_Type,
        Req_No : el.Req_No
      });
    })
    this.BackUpproductDetails = [...this.productDetails];
    this.BackupIndentList = this.IndentNoList;
    this.GetIndentdist();
    console.log("this.Objdispatch",this.productDetails);

  })
}
getIndentForEdit(masterProduct){
  this.editIndentList = [];
  const obj = {
    "SP_String": "SP_Production_Voucher",
    "Report_Name_String": "Get Req No Dispatch Details For Edit",
    "Json_Param_String": JSON.stringify([{Doc_No : masterProduct.Doc_No}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.editIndentList = data;
    this.GetIndentdist();
  })
}
GetIndentdist(){
  let DIndentBy = [];
  this.IndentFilter = [];
  this.SelectedIndent =[];
  //this.SelectedDistOrderBy1 = [];
  this.editIndentList.forEach((item) => {
    if (DIndentBy.indexOf(item.Req_No) === -1) {
      DIndentBy.push(item.Req_No);
       this.IndentFilter.push({ label: item.Req_No + '(' + item.Location + ')', value: item.Req_No });
       this.SelectedIndent.push(item.Req_No);
      console.log("this.TimerangeFilter", this.IndentFilter);
    }
  });
}
// geteditReqNo(){
//   if(this.SelectedIndent.length) {
//     let Rarr =[]
//     this.SelectedIndent.forEach(el => {
//       if(el){
//         const Dobj = {
//           Req_No : el,
//           Outlet_ID: Number(this.Objdispatch.Cost_Cen_ID),
//           Dispatch_Outlet_ID: Number(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID),
//           Dispatch_Godown_ID: Number(this.Objdispatch.From_Godown_ID),
//           Challan_Date : this.DateService.dateConvert(new Date(this.ChallanDate)),
//           Indent_Date : this.DateService.dateConvert(new Date(this.todayDate))
//           }
//           Rarr.push(Dobj)
//       }

//   });
//     console.log("Table Data ===", Rarr)
//     return Rarr.length ? JSON.stringify(Rarr) : '';
//   }
// }
// GetProductionproforEdit(){
//   this.OutletFormSubmit = true;
//   this.DispatchFormSubmit = true;
//     const obj = {
//       "SP_String": "SP_Production_Voucher",
//       "Report_Name_String": "Get Requisition Data for dispatch challan",
//       "Json_Param_String": this.geteditReqNo()
//     }
//     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
//       this.productDetails = data;
//       //this.SpinnerShow = false;
//       this.BackUpproductDetails = [...this.productDetails];
//       console.log("this.productDetails",this.productDetails);
//     })

// }
// Refresh(DocNo){
//  // this.clearData();
//   if(DocNo.Doc_No){
//    // this.indentno = DocNo.Indent_No;
//   this.geteditmaster(DocNo);
//   this.Refreshdata(DocNo);
//   }
// }
Refresh(obj){
  this.refreshEditmaster(obj.Doc_No);

}
refreshEditmaster(DocNo){
  const obj = {
         "SP_String": "SP_Production_Voucher",
         "Report_Name_String": "Refresh Distribution Challan",
         "Json_Param_String": JSON.stringify([{Doc_No : DocNo}])
       }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("From Api",data);
       this.Refreshlist = data;
       var Challan_No = data[0].Column1;
       console.log("this.Refreshlist",this.Refreshlist);
       if(data[0].Column1){
       this.compacctToast.clear();
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Distribution Challan No. " + Challan_No,
           detail: "Succesfully Updated"
         });
       }
        console.log("this.Objdispatch",this.productDetails);

      })
}

// refreshEditmaster(DocNo){
//   this.EditList = [];
//   const obj = {
//     "SP_String": "SP_Production_Voucher",
//     "Report_Name_String": "Get Dispatch Details For Edit",
//     "Json_Param_String": JSON.stringify([{Doc_No : DocNo}])
//   }
//   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
//     console.log("From Api",data);
//     this.EditList = data;
//     console.log("this.EditList",this.EditList);
//    this.doc_no = data[0].Doc_No;
//    this.ChallanDate =  new Date(data[0].Doc_Date);
//    this.Objdispatch.Brand_ID = data[0].Brand_ID;
//    this.getCostcenter();
//    this.Objdispatch.Cost_Cen_ID = data[0].To_Cost_Cen_ID;
//    this.GetFromGodown();
//    this.Objdispatch.From_Godown_ID = data[0].F_Godown_ID;
//    this.Objdispatch.Vehicle_Details = data[0].Vehicle_Details;
//    this.Objdispatch.REMARKS = data[0].REMARKS;
//    this.Objdispatch.USER_ID = data[0].USER_ID;
//    this.Objdispatch.Fin_Year_ID = data[0].Fin_Year_ID;
//    this.Objdispatch.F_Cost_Cen_ID = data[0].F_Cost_Cen_ID;
//    this.todayDate = data[0].Indent_Date;
//    this.indentno = data[0].Indent_No;
//     this.EditList.forEach(el=>{
//       this.productDetails.push({
//         Delivery_Qty : el.Qty,
//         Product_Description : el.Product_Description,
//         product_id : el.Product_ID,
//         Rate : el.Rate,
//         Req_Qty : el.Req_Qty,
//         UOM : el.UOM,
//         Batch_No : el.Batch_No,
//         Batch_Qty : el.bln_Qty,
//         Batch_No_Show : el.Batch_No_Show,
//         Accepted_Qty : el.Accepted_Qty ? el.Accepted_Qty : 0,
//         Accept_Reason_ID : el.Accept_Reason_ID,
//         Accept_Reason : el.Accept_Reason ? el.Accept_Reason : '-',
//         product_type : el.Product_Type,
//         Req_No : el.Req_No,
//         Total_Qty : this.totalqty,
//         Total_Accepted_Qty : this.acctotalqty
//       });
//     })
//     this.BackUpproductDetails = [...this.productDetails];
//     this.BackupIndentList = this.IndentNoList;
//     this.GetIndentdist();
//     const DReqBy = [];
//     const DReqObj = [];
//     this.EditList.forEach((item) => {
//       if (DReqBy.indexOf(item.Req_No) === -1) {
//         DReqBy.push(item.Req_No);
//         DReqObj.push({Req_No : item.Req_No})
//       }
//     });
//     console.log("this.RefreshData",this.EditList);
//     const obj = {
//      "SP_String": "SP_Production_Voucher",
//      "Report_Name_String": "Add K4C Txn Distribution",
//      "Json_Param_String": JSON.stringify(this.EditList),
//      "Json_1_String" : JSON.stringify(DReqObj)
//    }
//  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
//    console.log("From Api",data);
//    this.Refreshlist = data;
//    var Challan_No = data[0].Doc_No;
//    console.log("this.Refreshlist",this.Refreshlist);
//    if(data[0].Doc_No){
//    this.compacctToast.clear();
//       this.compacctToast.add({
//        key: "compacct-toast",
//        severity: "success",
//        summary: "Distribution Challan No. " + Challan_No,
//        detail: "Succesfully Update"
//      });
//    }
//  })
//     console.log("this.Objdispatch",this.productDetails);

//   })
// }

getBrand(){
  console.log("CompacctCookies",this.$CompacctAPI.CompacctCookies);
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Brand INI",

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("brandList  ===",data);
    this.brandList = data;
  })
}
GetBatch(){

  this.NativeitemList.forEach(ele=>{
    if(this.Objadditem.Product_ID === ele.Product_ID)

      this.reqNumber = ele.Req_Qty;
  })
  console.log("this.reqNumber",this.reqNumber);
  const tempObj = {
     Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,  //2
     Product_ID  : this.Objadditem.Product_ID,  //3388
     Godown_Id : this.Objdispatch.From_Godown_ID  //4
    // Cost_Cen_ID : 2,
    // Product_ID  : 3388,
    // Godown_Id : 4
  }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get_Product_Wise_Batch_For_Dispatch",
    "Json_Param_String": JSON.stringify([tempObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BatchList = data;
      console.log("BatchList",this.BatchList);
      this.Objadditem.Batch_No= this.BatchList.length ? this.BatchList[0].Batch_NO : undefined;
      console.log("this.Objadditem.Batch_No",this.Objadditem.Batch_No);
  })

}
GetSelectedBatchqty() {
  console.log("this.productDetails",this.productDetails);
  const sameproductwithbatch = this.productDetails.filter(item=> item.Batch_No === this.Objadditem.Batch_No && Number(item.product_id) === Number(this.Objadditem.Product_ID) );

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
  // FOR INDENT NUMBER
  GetIndentList(){
    // this.RawMaterialIssueFormSubmitted = true;
     //if(valid){
      this.SpinnerShow = true;
     const TempObj = {
       Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
       Brand_ID : this.Objdispatch.Brand_ID,
       To_Cost_Cen_ID : this.Objdispatch.Cost_Cen_ID,
       Material_Type : 'Finished'
      }
    const obj = {
     "SP_String": "SP_Production_Voucher_New",
     "Report_Name_String" : "Get Requisition Nos For Dispatch",
    "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // if(data.length) {
     //   data.forEach(element => {
     //     element['label'] = element.Req_No,
     //     element['value'] = element.Req_No
     //   });
       this.IndentNoList = data;
       this.BackupIndentList = data;
      // this.adDisabled = false;
      this.inputBoxDisabled = true;
      this.indentdateDisabled = false;
      this.From_Godown_ID_Dis = true;
      this.To_Godown_ID_Dis = true;
      this.SpinnerShow = false;
     // } else {
     //   this.IndentNoList = [];

     //  }
    // this.RawMaterialIssueFormSubmitted = false;
    console.log("this.Indentlist======",this.IndentNoList);
    this.GetIndent();
   })
  // }
   }
   GetIndent(){
     let DIndent = [];
     this.IndentFilter = [];
     this.SelectedIndent = [];
     this.BackupIndentList.forEach((item) => {
       if (DIndent.indexOf(item.Req_No) === -1) {
         DIndent.push(item.Req_No);
         this.IndentFilter.push({ label: item.Req_No + '(' + item.cost_cen_name + ')' , value: item.Req_No });
         console.log("this.IndentFilter", this.IndentFilter);
       }
     });
     this.BackupIndentList = [...this.IndentNoList];
   }
   filterIndentList() {
     //console.log("SelectedTimeRange", this.SelectedTimeRange);
     let DIndent = [];
     this.TIndentList = [];
     //const temparr = this.ProductionlList.filter((item)=> item.Qty);
     if (!this.EditList.length){
      this.BackUpproductDetails =[];
      this.productDetails = [];
      this.GetshowProduct(true,true);
      }
      // if(this.editIndentList.length){
      //   this.BackUpproductDetails =[];
      // this.productDetails = [];
      //   this.GetProductionproforEdit();
      //   }
    //  this.productDetails = [];
    //  this.GetshowProduct(true,true);
     if (this.SelectedIndent.length) {
       this.TIndentList.push('Req_No');
       DIndent = this.SelectedIndent;
     }
     if(this.EditList.length) {
      this.productDetails = [];
      if (this.TIndentList.length) {
        let LeadArr = this.BackUpproductDetails.filter(function (e) {
          return (DIndent.length ? DIndent.includes(e['Req_No']) : true)
        });
        this.productDetails = LeadArr.length ? LeadArr : [];
      } else {
        this.productDetails = [...this.BackUpproductDetails];
        console.log("else Get indent list", this.IndentNoList)
      }
    }

   }
  // TABLE DATA
  dataforShowproduct(){
    if(this.SelectedIndent.length) {
      let Arr =[]
      this.SelectedIndent.forEach(el => {
        if(el){
          const Dobj = {
            Req_No : el,
            Outlet_ID: Number(this.Objdispatch.Cost_Cen_ID),
            Dispatch_Outlet_ID: Number(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID),
            Dispatch_Godown_ID: Number(this.Objdispatch.From_Godown_ID),
            Challan_Date : this.DateService.dateConvert(new Date(this.ChallanDate)),
            Indent_Date : this.DateService.dateConvert(new Date(this.todayDate))
            }
           Arr.push(Dobj)
        }

    });
      console.log("Table Data ===", Arr)
      return Arr.length ? JSON.stringify(Arr) : '';
    }
  }
GetshowProduct(outletValid,DispatchValid){
  this.OutletFormSubmit = true;
  this.DispatchFormSubmit = true;
  if(this.dataforShowproduct()){
  if(outletValid && DispatchValid){
    //this.SpinnerShow = true;
    // const tempObj = {
    //   Outlet_ID: Number(this.Objdispatch.Cost_Cen_ID),
    //   Dispatch_Outlet_ID: Number(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID),
    //   Dispatch_Godown_ID: Number(this.Objdispatch.From_Godown_ID),
    //   Challan_Date : this.DateService.dateConvert(new Date(this.ChallanDate)),
    //   Indent_Date : this.DateService.dateConvert(new Date(this.todayDate)),
    // }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get Input data for dispatch challan",
      "Json_Param_String": this.dataforShowproduct()
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.productDetails = data;
      //this.SpinnerShow = false;
      this.BackUpproductDetails = [...this.productDetails];
      console.log("this.productDetails",this.productDetails);
      // this.inputBoxDisabled = true;
      // this.indentdateDisabled = false;
      // this.From_Godown_ID_Dis = true;
      // this.To_Godown_ID_Dis = true;

      //this.clearData();
    })
  }
 }

}
getTotal(key){
  let TotalAmt = 0;
  this.productDetails.forEach((item)=>{
    TotalAmt += Number(item[key]);
  });

  return TotalAmt ? TotalAmt.toFixed(2) : '-';
}
qtyChq(col){
  this.flag = false;
  console.log("col",col);
  if(col.Delivery_Qty){
    if(col.Delivery_Qty <=  col.Batch_Qty){
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
 qtyChqEdit(col){
  this.editFlag = false;
  console.log("col",col);
  if(col.Qty){
    if(col.Qty <=  col.Batch_Qty){
      this.editFlag = false;
      return true;
    }
    else {
      this.editFlag = true;
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
 for(let i = 0; i < this.productDetails.length ; i++){
  if(Number(this.productDetails[i].Batch_Qty) <  Number(this.productDetails[i].Delivery_Qty)){
    flag = false;
    break;
  }
 }
 return flag;
}
saveqtyEdit(){
  let flag = true;
 for(let i = 0; i < this.editdataList.length ; i++){
  if(Number(this.editdataList[i].Batch_Qty) <  Number(this.editdataList[i].Qty)){
    flag = false;
    break;
  }
 }
 return flag;
}
clearbutton(){
  this.Objdispatch= new dispatch();
  this.productDetails = [];
  this.BackUpproductDetails = [];
  this.inputBoxDisabled = false;
  this.indentdateDisabled = true;
  this.From_Godown_ID_Dis = false;
  this.To_Godown_ID_Dis = false;
//  this.adDisabled = true;
  this.itemList = [];
  this.clearData();
  this.todayDate = new Date();
  this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
  this.todayDate = new Date();
  this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
  this.SelectedIndent = [];
  this.IndentFilter = [];
}
deleteDispatch(masterProduct){
 console.log("deleteCol",masterProduct)
 this.doc_no = undefined;
 if (masterProduct.Doc_No) {
  this.doc_no = masterProduct.Doc_No;
  this.doc_date = masterProduct.Doc_Date;
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
Print(Doc_No){
  console.log("print",Doc_No);
  if (Doc_No) {
    window.open("/Report/Crystal_Files/K4C/K4C_Dispatch_Challan_print.aspx?DocNo=" + Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
  }
}
// editmaster(masterProduct){
//   if(masterProduct.Doc_No){
//     this.doc_no = masterProduct.Doc_No ;
//     const obj = {
//           "SP_String": "SP_Production_Voucher",
//           "Report_Name_String": "Get Dispatch Details For Edit",
//           "Json_Param_String": JSON.stringify([{Doc_No : masterProduct.Doc_No}])
//         }
//         this.GlobalAPI.getData(obj).subscribe((data:any)=>{
//           let editdata = data;
//           this.editdataList = data;
//           console.log("editdataList",this.editdataList);
//           if(editdata.length){
//             this.editPopUp = true;
//           }
//           this.brand = data[0].Brand_Name;
//           this.toOutlet = data[0].To_Location;
//           this.OutletStokePoint = data[0].To_godown_name;
//           this.challanDate = new Date(data[0].Doc_Date);
//           this.fromStokePoint =  data[0].F_godown_name;
//           this.VehicleDetails = data[0].Vehicle_Details;
//           this.Remarks = data[0].REMARKS === "NA" ? "  " : data[0].REMARKS ;
//           this.GetProductBatch();

//         })
//   }
// }
GetProductBatch(){
  this.EditList.forEach(item=>{
    const tempObj = {
      Cost_Cen_ID : item.F_Cost_Cen_ID,  //2
      Product_ID  : item.Product_ID,  //3388
      Godown_Id : item.F_Godown_ID  //4

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
CheckLengthProductIDedit(ID) {
  const tempArr = this.editdataList.filter(item=> item.product_id == ID);
  return tempArr.length
}
CheckIndexProductIDedit(ID) {
  let found = 0;
  for(let i = 0; i < this.editdataList.length; i++) {
      if (this.editdataList[i].product_id == ID) {
          found = i;
          break;
      }
  }
  return found;
}

}

class additem {
Product_ID = 0;
Issue_Qty: number;
Batch_No:any
}
class dispatch{
  Cost_Cen_ID : any;
  From_Godown_ID : number;
  REMARKS :any ;
  Vehicle_Details:any;
  F_Cost_Cen_ID : number;
  Fin_Year_ID : number;
  USER_ID : any;
  Brand_ID :any;
  To_Godown_ID : any;
  Batch_No : any;
}
class BrowseData {
  From_Date: string;
  To_Date: string;
  Cost_Cen_ID : any = undefined;
  Brand_ID : any;
  }
