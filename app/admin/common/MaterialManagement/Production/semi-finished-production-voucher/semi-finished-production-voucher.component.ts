import { Component, OnInit, ViewEncapsulation, ViewChild  } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
declare var $: any;
import * as moment from "moment";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-semi-finished-production-voucher',
  templateUrl: './semi-finished-production-voucher.component.html',
  styleUrls: ['./semi-finished-production-voucher.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SemiFinishedProductionVoucherComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save";
  todayDate : any = new Date();
  Datevalue : any = Date ;
  myDate: Date;
  SFproductionFormSubmitted = false ;
  ProductionFormSubmitted2 = false;

  inputBoxDisabled = false;
  ObjSFproduction : SFproduction = new SFproduction ();
  ObjBrowse : Browse = new Browse ();
  BrandList = [];
  typeofmateriallist = [];
  selectfinalmateriallist = [];
  SelProcessList = [];
  ProcessProductList = [];
  SiftList = [];
  ToGodownList = [];
  ProDatelist = [];
  ProductionlList = [];
  BackUpProductionlList = [];
  FromProcessList = [];
  FromGodownList = [];
  FPDisabled = true;
  BatchDisabled = true;
  AddProDetailsFormSubmitted = false;
  // ObjproductAdd : productAdd = new productAdd ();
  // AddProDetails = [];
  // Batch_No: any;
  Searchedlist = [];
  editList = [];
  DeleteList = [];
  //BatchNoList = [];
  ProtypeDisabled = false;
  allProductsCheck = false;
  // checkBoxText = "Show All Products"
  // checkBoxdis = true;
  editDis = false;
  Param_Flag ='';

  BackupSearchedlist = [];
  DistProcessName = [];
  SelectedDistProcessName = [];
  DistProductType = [];
  SelectedDistProductType = [];
  DistShift = [];
  SelectedDistShift = [];
  SearchFields = [];
  Process_ID: any;
  ViewPoppup = false;
  Doc_no = undefined;
  Doc_date = undefined;
  BrandName = undefined;
  ProcessName = undefined;
  MaterialType = undefined;
  FinalMatQty = undefined;
  Producttype = undefined;
  FstockPoint = undefined;
  TostockPoint = undefined;
  Vshift = undefined;
  TotalQty = undefined;
  initDate = [];
  doc_date: any;
  minDate: Date;
  maxDate: Date;
  filteredData = [];
  displaysavepopup = false;
  BrowseDate = [];
  BDate: Date;
  IndentNoList = [] ;
  BackupIndentList = [];
  IndentFilter = [];
  SelectedIndent : any;
  TIndentList = [];
  Cost_Cen_Id: any;
  editIndentList = [];

  finalproducttypeid : any;
  finalproducttypename : any;
  finalprodescription : any;
  finalprouom : any;
  totalQty: any;

  constructor(
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private route : ActivatedRoute,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
      this.Header.pushHeader({
        Header: "Production Voucher (Semi-Finished)",
        Link: " Material Management -> Production -> Production Voucher (Semi-Finished)"
      });
      this.GetBrand();
      this.GetTypeofMaterial();
      this.GetSelectProcess();
      this.GetSift();
      this.GetToGodown();
      this.GetProDate();
      this.GetFromGodown();
      this.GetBrowseDate();
  }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
    // this.Searchedlist = [];
    // this.BackupSearchedlist = [];
    //this.FPDisabled = true;
    this.SelectedIndent = [];
    this.IndentFilter = [];
  }

  // CREATE START
  GetBrand(){
    const obj = {
      "SP_String": "SP_Semi_Finished_Production_Voucher",
      "Report_Name_String": "Get - Brand"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrandList = data;
      //this.Objproduction.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
       //console.log("Brand List ===",this.BrandList);
    })
  }
  GetTypeofMaterial() {
    const obj = {
      "SP_String": "SP_Semi_Finished_Production_Voucher",
      "Report_Name_String": "GET_Type_Of_material"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.typeofmateriallist = data;
      //this.Objproduction.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
    //  console.log("type of material List ===", this.typeofmateriallist);
    })
  }
  GetSelectFinalMaterial() {
    const tempObj = {
      Brand_ID: this.ObjSFproduction.Brand_ID,
      Material_Type: this.ObjSFproduction.Type_of_Material,
      //Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Semi_Finished_Production_Voucher",
      "Report_Name_String": "GET_Final_material",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //  this.selectfinalmateriallist = data;
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Description,
            element['value'] = element.Product_ID
        });
        this.selectfinalmateriallist = data;
      } else {
        this.selectfinalmateriallist = [];

      }
      //console.log("select final material List ===", this.selectfinalmateriallist);
    })
  }
  getproducttypeid(){
    //this.ExpiredProductFLag = false;
   if(this.ObjSFproduction.Product_ID) {
    const ctrl = this;
    const finalprotypeidObj = $.grep(ctrl.selectfinalmateriallist,function(item: any) {return item.Product_ID == ctrl.ObjSFproduction.Product_ID})[0];
    console.log(finalprotypeidObj);
    this.finalproducttypeid = finalprotypeidObj.Product_Type_ID;
    this.finalproducttypename = finalprotypeidObj.Product_Type;
    this.finalprodescription = finalprotypeidObj.Product_Description;
    this.finalprouom = finalprotypeidObj.UOM;
    console.log("this.finalprotypeidObj ==", this.finalproducttypeid)
    
   }
  }
  GetSelectProcess(){
    const obj = {
      "SP_String": "SP_Semi_Finished_Production_Voucher",
      "Report_Name_String": "GET_Start_Process"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.SelProcessList = data;
      this.ObjSFproduction.Process_ID = 3;
      //this.Objproduction.Process_ID = this.SelProcessList.length === 1 ? this.SelProcessList[0].Process_ID : undefined;
       //console.log("Select Process List ===",this.SelProcessList);
    })
  }
  // GetFromProcess(){
  //   //console.log('Process ID ==', this.Objproduction.Process_ID)
  //   this.FPDisabled = true;
  //   this.BatchDisabled = true;
  //  // this.BatchNoList =[];
  //   const tempObj = {
  //     process_id : this.ObjSFproduction.Process_ID
  //   }
  //   const obj = {
  //     "SP_String": "SP_Semi_Finished_Production_Voucher",
  //     "Report_Name_String": "GET_Previous_Process",
  //     "Json_Param_String": JSON.stringify([tempObj])
  //   }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //     this.FromProcessList = data;
  //     //this.BatchNoList =[];
  //     //this.Objproduction.From_Process_ID = this.FromProcessList.length ? this.FromProcessList[0].From_Process_ID : undefined;
  //     if(this.FromProcessList.length && this.buttonname === "Save & Print"){
  //     this.ObjSFproduction.From_Process_ID = this.FromProcessList.length ? this.FromProcessList[0].From_Process_ID : undefined;
  //     this.ObjSFproduction.Previous_Process_ID = data[0].Previous_Process_ID;
  //     //this.Objproduction.Previous_Process_ID = this.FromProcessList.length ? this.FromProcessList[0].Previous_Process_ID : undefined;
  //     this.FPDisabled = false;
  //     this.BatchDisabled = false;
  //     }
  //     else if(this.FromProcessList.length && this.buttonname === "Update"){
  //      // this.Objproduction.From_Process_ID = this.FromProcessList.length ? this.FromProcessList[0].From_Process_ID : undefined;
  //       this.ObjSFproduction.Previous_Process_ID = data[0].Previous_Process_ID;
  //       //this.Objproduction.Previous_Process_ID = this.FromProcessList.length ? this.FromProcessList[0].Previous_Process_ID : undefined;
  //       this.FPDisabled = false;
  //       this.BatchDisabled = false;
  //     }
  //     else{
  //       this.ObjSFproduction.From_Process_ID = undefined;
  //     }
  //     //console.log("From Process List ===",this.FromProcessList);
  //   })
  // }
  GetFromGodown(){
    const tempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Semi_Finished_Production_Voucher",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.FromGodownList = data;
      // this.Objproduction.From_godown_id = this.FromGodownList.length === 3 ? this.FromGodownList[0].godown_id : undefined;
      //this.Objproduction.From_godown_id = data[0].godown_id;
       //console.log("From Godown List ===",this.FromGodownList);
    })
  }
  GetSift(){
    const obj = {
      "SP_String": "SP_Semi_Finished_Production_Voucher",
      "Report_Name_String": "Get - Shift"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.SiftList = data;
      this.ObjSFproduction.Shift = this.SiftList.length === 2 ? this.SiftList[0].Shift_ID : undefined;
      //this.Objproduction.Sift = data[0].Shift_ID;
      // console.log("Sift List ===",this.SiftList);
    })
  }
  GetToGodown(){
    const tempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Semi_Finished_Production_Voucher",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ToGodownList = data;
      //this.ObjSFproduction.To_godown_id = this.ToGodownList.length === 3 ? this.ToGodownList[0].godown_id : undefined;
      //this.Objproduction.To_godown_id = data[0].godown_id;
       console.log("To Godown List ===",this.ToGodownList);
    })
  }
  GetProDate(){
    const obj = {
      "SP_String": "SP_Semi_Finished_Production_Voucher",
      "Report_Name_String": "Get - Production Date"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ProDatelist = data;
      this.myDate =  new Date(data[0].Column1);
     // this.initDate = [this.myDate , this.myDate];
      this.Datevalue = new Date(data[0].Column1);
      let Datetemp:Date =  new Date(data[0].Column1)
      const Timetemp =  Datetemp.setDate(Datetemp.getDate() - 1);
      this.minDate = new Date(Timetemp);
      console.log("minDate==", this.minDate)
      // this.minDate =  new Date(data[0].Column1);
       let tempDate:Date =  new Date(data[0].Column1)
      const tempTimeBill =  tempDate.setDate(tempDate.getDate() + 1);
      this.maxDate = new Date(tempTimeBill);
      console.log("maxDate==", this.maxDate)
      //console.log("ProDate List ===",this.ProDatelist);

      //console.log("this.initDate ==", this.initDate)
    })
  }
  // GetProductList(valid){
  //   this.SFproductionFormSubmitted = true;
  //   if(valid){
  //   const tempObj = {
  //     brand_id : this.ObjSFproduction.Brand_ID,
  //     Process_ID : this.ObjSFproduction.Process_ID,
  //     //Date : this.tadayDate
  //   }
  //   const obj = {
  //     "SP_String": "SP_Semi_Finished_Production_Voucher",
  //     "Report_Name_String": "GET_Product_Type_Process_Wise",
  //     "Json_Param_String": JSON.stringify([tempObj])
  //   }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //     this.ProcessProductList = data;
  //   //  const Product_Type_ID = this.ProcessProductList.length === 4 ? this.ProcessProductList[0].Product_Type_ID : undefined;
  //   //   this.GetProductionpro(Product_Type_ID);
  //     //console.log("Product Process List ===",this.ProcessProductList);
  //     this.inputBoxDisabled = true;
  //     this.SFproductionFormSubmitted = false;
  //     this.FPDisabled = true;
  //     this.checkBoxdis = false;
  //     //this.onFilterChange(true);

  //     if(this.editList.length){
  //       this.ObjSFproduction.Product_Type_ID =  undefined;
  //     this.ProcessProductList.forEach(item => {
  //       const dataTemp = this.editList.filter(elem=> elem.Product_Type_ID == item.Product_Type_ID);
  //       if(dataTemp.length === this.editList.length){
  //         this.ObjSFproduction.Product_Type_ID = this.editList[0].Product_Type_ID;
  //       }

  //     })
  //   }
  //     if(!this.editList.length){
  //     this.GetProductionpro();
  //     }
  //   })
  //   }
  // }
  // FOR PRODUCT NAME DROPDOWN
  // dataforproduct(){
  //   if(this.SelectedIndent.length) {
  //     let Arr =[]
  //     this.SelectedIndent.forEach(el => {
  //       if(el){
  //         const Dobj = {
  //           Req_No : el,
  //           Brand_ID : this.Objproduction.Brand_ID,
  //           Product_Type_ID : this.Objproduction.Product_Type_ID ? this.Objproduction.Product_Type_ID : 0,
  //           From_Cost_Cen_ID : 0,
  //           From_godown_id : 0,
  //           Doc_Type : "Requi",
  //           Date : this.DateService.dateConvert(new Date(this.todayDate)),
  //           }
  //          Arr.push(Dobj)
  //       }

  //   });
  //     console.log("Table Data ===", Arr)
  //     return Arr.length ? JSON.stringify(Arr) : '';
  //   }
  // }
  GetProductList(valid){
    //if(this.Objproduction.Product_Type_ID){
      //this.checkBoxdis = false;
      this.SFproductionFormSubmitted = true;
      if(valid){
      const tempObj = {
        Material_Type : this.ObjSFproduction.Type_of_Material,
        Brand_ID : this.ObjSFproduction.Brand_ID,
        Product_ID : this.ObjSFproduction.Product_ID
      }
      //if(this.dataforproduct()){
      const obj = {
        "SP_String": "SP_Semi_Finished_Production_Voucher",
        "Report_Name_String": "GET_Products_For_Production",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.ProductionlList = data;
        this.SFproductionFormSubmitted = false;
        this.ProductionlList.forEach(el=>{
          el['Qty'] = Number((el.BOM_Product_Qty / el.Final_Product_Qty) * this.ObjSFproduction.Final_Material_Qty).toFixed(3);
        })
         console.log("Production List ===",this.ProductionlList);
      })
   }

  }

  // SAVE AND UPDATE
  getTotalIssueValue(){
    let QtyVal = 0;
    this.ProductionlList.forEach((item)=>{
      QtyVal += Number(item.Qty)
    });
    this.totalQty = (QtyVal).toFixed(2);
    return QtyVal ? QtyVal.toFixed(2) : '-';
  }
  showDialog(valid) {
    this.ProductionFormSubmitted2 = true;
    if(valid){
      this.ProductionFormSubmitted2 = false;
    this.displaysavepopup = true;
    this.filteredData = [];
    this.BackUpProductionlList.forEach(obj => {
      if(obj.Qty && Number(obj.Qty) !== 0 ){
      //  console.log(filteredData.push(obj.Product_ID));
      this.filteredData.push(obj);
       // console.log("this.filteredData===",this.filteredData);
    }
   })
  }
  }
  dataforSaveProduction(){
    let obj = {};
  // console.log(this.DateService.dateConvert(new Date(this.myDate)))
   this.ObjSFproduction.Doc_Date = this.DateService.dateConvert(new Date(this.Datevalue));
  if(this.ProductionlList.length ) {
    let tempArr = [];
    this.ProductionlList.forEach(item => {
      if(item.Qty && Number(item.Qty) !== 0){
        obj = {
         Final_Brand_ID : this.ObjSFproduction.Brand_ID,
         Final_Product_Type_ID : this.finalproducttypeid,
         Final_Product_Type_Name : this.finalproducttypename,
         Final_Product_ID :  this.ObjSFproduction.Product_ID,
         Final_Product_Description : this.finalprodescription,
         Final_Product_UOM : this.finalprouom,
         Final_Product_Qty : Number(this.ObjSFproduction.Final_Material_Qty),
         Production_Product_Type_ID : item.BOM_Product_Type_ID,
         Production_Product_Type_Name : item.BOM_Product_Type_Name,
         Production_Product_ID : item.BOM_Product_ID,
         Production_Product_Description : item.BOM_Product_Description,
         Production_Product_UOM : item.BOM_Product_UOM,
         Production_Product_Qty : Number(item.Qty),
         Production_Product_Batch : 'NA',
         Remarks : 'NA',
         Created_By : this.$CompacctAPI.CompacctCookies.User_ID,
         Created_On : this.ObjSFproduction.Doc_Date,
         Doc_No : this.ObjSFproduction.Doc_No ?  this.ObjSFproduction.Doc_No : "A",
         Doc_Date : this.ObjSFproduction.Doc_Date,
         Shift_ID : this.ObjSFproduction.Shift,
         Process_ID : this.ObjSFproduction.Process_ID,
        //  Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        //  Godown_ID : this.ObjSFproduction.To_godown_id,
         User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
         //From_Process_ID : this.ObjSFproduction.From_Process_ID ? this.ObjSFproduction.From_Process_ID : 0,
         From_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
         From_Godown_ID : this.ObjSFproduction.From_godown_id ? this.ObjSFproduction.From_godown_id : 0,
         To_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
         To_Godown_ID : this.ObjSFproduction.To_godown_id,
      //    Adv_Order_No : "NA",
      //    Order_Txn_ID : 0,
        }
       tempArr.push(obj);
      }

     });
    console.log("Save Data ===", tempArr)
    //return JSON.stringify([...tempArr,...Rarr]);
    return JSON.stringify(tempArr);
  }
  }
  SaveProduction(){
    //this.ProductionFormSubmitted2 = true;
    //if(valid){
      this.ngxService.start();
      //this.displaysavepopup = false;
      const obj = {
        "SP_String": "SP_Semi_Finished_Production_Voucher",
        "Report_Name_String" : "Add Semi Finished Production Voucher",
       "Json_Param_String": this.dataforSaveProduction()

      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        //console.log(data);
        var tempID = data[0].Column1;
        this.ObjSFproduction.Doc_No = data[0].Column1;
        if(data[0].Column1){
          this.ngxService.stop();
          this.compacctToast.clear();
          const mgs = this.buttonname === "Save" ? "Saved" : "Updated";
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Production Voucher  " + tempID,
           detail: "Succesfully  " + mgs
         });
        //  if (this.buttonname == "Save & Print") {
        //  this.saveNprintProVoucher();
        //  }
         this.clearData();
        //  this.FromProcessList =[];
        //  this.displaysavepopup = false;
        //  this.SelectedIndent = [];
        //  this.IndentFilter = [];
         //this.BatchNoList = [];
         //this.ProcessProductList =[];
        //  this.ProductionlList = [];
         //this.ObjSaveForm = new SaveForm();

        } else{
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
   // }
   }
  saveNprintProVoucher(){
    if (this.ObjSFproduction.Doc_No) {
      window.open("/Report/Crystal_Files/K4C/K4C_Production_Voucher.aspx?DocNo=" + this.ObjSFproduction.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
   );
    }
  }
  // CREATE END

  // BROWSE START
  GetBrowseDate(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Production Date"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrowseDate = data;
      this.BDate =  new Date(data[0].Column1);
      this.initDate = [this.BDate , this.BDate];
      //console.log("ProDate List ===",this.ProDatelist);

      console.log("this.initDate ==", this.initDate)
    })
  }
  getDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjBrowse.start_date = dateRangeObj[0];
    this.ObjBrowse.end_date = dateRangeObj[1];
  }
  }
  SearchProduction(){
  const start = this.ObjBrowse.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
  : this.DateService.dateConvert(new Date());
const tempobj = {
  From_date : start,
  To_Date : end
}
const obj = {
  "SP_String": "SP_Semi_Finished_Production_Voucher",
  "Report_Name_String": "Browse Production Voucher",
  "Json_Param_String": JSON.stringify([tempobj])
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   this.BackupSearchedlist = data;
   this.GetDistinct();
   //console.log('search list=====',this.Searchedlist)
   this.seachSpinner = false;
 })
  }
  // DISTINCT & FILTER
  GetDistinct() {
    let DProcessName = [];
    let DProductType = [];
    let DShift = [];
    this.DistProcessName =[];
    this.SelectedDistProcessName =[];
    this.DistProductType =[];
    this.SelectedDistProductType =[];
    this.DistShift =[];
    this.SelectedDistShift =[];
    this.SearchFields =[];
    this.Searchedlist.forEach((item) => {
   if (DProcessName.indexOf(item.Process_ID) === -1) {
    DProcessName.push(item.Process_ID);
   this.DistProcessName.push({ label: item.Process_Name, value: item.Process_ID });
   }
  if (DProductType.indexOf(item.Product_Type_ID) === -1) {
    DProductType.push(item.Product_Type_ID);
    this.DistProductType.push({ label: item.Product_Type, value: item.Product_Type_ID });
    }
    if (DShift.indexOf(item.Shift_ID) === -1) {
      DShift.push(item.Shift_ID);
      this.DistShift.push({ label: item.Shift_Name, value: item.Shift_ID });
      }
  });
     this.BackupSearchedlist = [...this.Searchedlist];
  }
  FilterDist() {
    let DProcessName = [];
    let DProductType = [];
    let DShift = [];
    this.SearchFields =[];
  if (this.SelectedDistProcessName.length) {
    this.SearchFields.push('Process_ID');
    DProcessName = this.SelectedDistProcessName;
  }
  if (this.SelectedDistProductType.length) {
    this.SearchFields.push('Product_Type_ID');
    DProductType = this.SelectedDistProductType;
  }
  if (this.SelectedDistShift.length) {
    this.SearchFields.push('Shift_ID');
    DShift = this.SelectedDistShift;
  }
  this.Searchedlist = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupSearchedlist.filter(function (e) {
      return (DProcessName.length ? DProcessName.includes(e['Process_ID']) : true)
      && (DProductType.length ? DProductType.includes(e['Product_Type_ID']) : true)
      && (DShift.length ? DShift.includes(e['Shift_ID']) : true)
    });
  this.Searchedlist = LeadArr.length ? LeadArr : [];
  } else {
  this.Searchedlist = [...this.BackupSearchedlist] ;
  }
  }

  ViewProduction(DocNo){
    //console.log("View ==",DocNo);
  this.clearData();
  //this.editList = [];
  this.Doc_no = undefined;
  this.Doc_date = undefined;
  this.BrandName = undefined;
  this.ProcessName = undefined;
  this.MaterialType = undefined;
  this.FinalMatQty = undefined;
  this.Producttype = undefined;
  this.TotalQty = undefined;
  this.Vshift = undefined;
  this.FstockPoint = undefined;
  this.TostockPoint = undefined;
  if(DocNo.Doc_No){
  this.ObjSFproduction.Doc_No = DocNo.Doc_No;
  this.ViewPoppup = true;
  // console.log("VIew ==", this.Objproduction.Doc_No);
  this.GetEditProduction(this.ObjSFproduction.Doc_No);
  //this.getadvorderdetails(this.Objcustomerdetail.Bill_No);
  }
  }
  // EDIT
  EditProduction(DocNo){
   // console.log("editmaster ==",DocNo);
  this.clearData();
  if(DocNo.Doc_No){
  //this.checkBoxdis = false;
  this.editDis = true;
  this.ObjSFproduction.Doc_No = DocNo.Doc_No;
  this.tabIndexToView = 1;
  this.items = ["BROWSE", "UPDATE"];
  this.buttonname = "Update";
  // console.log("this.EditDoc_No ==", this.Objproduction.Doc_No);
  this.GetEditProduction(this.ObjSFproduction.Doc_No);
  //this.getadvorderdetails(this.Objcustomerdetail.Bill_No);
  }
  }
  GetEditProduction(Doc_No){
    this.editList = [];
    this.SFproductionFormSubmitted = false;
    const obj = {
      "SP_String": "SP_Semi_Finished_Production_Voucher",
      "Report_Name_String": "Get Semi Finished Production Voucher Data",
      "Json_Param_String": JSON.stringify([{Doc_No : this.ObjSFproduction.Doc_No}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Data From Api",data);
      this.editList = data;
      this.ObjSFproduction.Brand_ID = data[0].Brand_ID;
      this.ObjSFproduction.Process_ID = data[0].Process_ID;
      //this.GetFromProcess();
      //this.Objproduction.From_Process_ID = data[0].From_Process_ID ? data[0].From_Process_ID : undefined;
      //this.GetFromProcess();
      this.ObjSFproduction.From_Process_ID = data[0].From_Process_ID ? data[0].From_Process_ID : undefined;
      //this.Objproduction.From_Process_ID = data[0].From_Process_ID;
      this.ObjSFproduction.From_Cost_Cen_ID = data[0].From_Cost_Cen_ID;
      this.ObjSFproduction.From_godown_id = data[0].From_godown_id ? data[0].From_godown_id : undefined;
      this.ObjSFproduction.Product_Type_ID = data[0].Product_Type_ID ? data[0].Product_Type_ID : undefined;
      // this.GetProductType(true);
     // this.GetProductionpro();
      this.ObjSFproduction.Shift = data[0].Shift_ID;
      this.ObjSFproduction.To_Cost_Cen_ID = data[0].To_Cost_Cen_ID;
      this.ObjSFproduction.To_godown_id = data[0].To_godown_id;
      this.Datevalue = data[0].Doc_Date;
      this.todayDate = data[0].Req_Date;
       data.forEach(element => {
       const  productObj = {
          //ID : element.ID,
          Product_ID : element.Product_ID,
          Product_Description : element.Product_Description,
          Qty :  Number(element.Qty),
          req_qty : element.Req_Qty,
          Product_Type : element.Product_Type,
          Product_Type_ID : element.Product_Type_ID,
          Req_No : element.Req_No
          // deleteflag : true
        };
         this.ProductionlList.push(productObj);


         //
    });
    // this.BackUpProductionlList = [...this.ProductionlList];
    // //this.backUpproductList = this.productList;
    // this.BackupIndentList = this.IndentNoList;

    // FOR VIEW
    this.Doc_no = data[0].Doc_No;
    this.Doc_date = new Date(data[0].Doc_Date);
    this.BrandName = data[0].Final_Brand ? data[0].Final_Brand : '-';
    //this.ProcessName = data[0].Process_Name ? data[0].Process_Name : '-';
    this.MaterialType = data[0].Final_Material_Type ? data[0].Final_Material_Type : '-';
    this.FinalMatQty = data[0].Final_Product_Qty ? data[0].Final_Product_Qty : '-';
   // this.Producttype = data[0].Product_Type ? data[0].Product_Type : '-';
    //this.TotalQty = data[0].Qty ? data[0].Qty : '-';
    this.Vshift = data[0].Shift_Name ? data[0].Shift_Name : '-';
    //this.FstockPoint = data[0].From_godown_name ? data[0].From_godown_name : '-';
    this.TostockPoint = data[0].To_Godown_Name ? data[0].To_Godown_Name : '-';

    // console.log("this.editList  ===",data);
    // console.log("edit From_Process_IDe ===" , this.Objproduction.From_Process_ID)

  })
  }
  PrintProVoucher(obj){
    if (obj.Doc_No) {
      window.open("/Report/Crystal_Files/K4C/K4C_Production_Voucher.aspx?DocNo=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

      );
    }
  }
  DeleteProduction(docNo){
    this.ObjSFproduction.Doc_No = undefined ;
    if(docNo.Doc_No){
    this.ObjSFproduction.Doc_No = docNo.Doc_No;
    this.doc_date = docNo.Doc_Date;
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
  onConfirm() {
    const Tempobj = {
      Doc_No : this.ObjSFproduction.Doc_No
    }
    const obj = {
      "SP_String" : "SP_Semi_Finished_Production_Voucher",
      "Report_Name_String" : "Delete Semi Finished Production Voucher",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log(data);
      if(data[0].Column1 === "Done") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Doc_No : " + this.ObjSFproduction.Doc_No,
          detail:  "Succesfully Delete"
        });
        this.SearchProduction();
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
  onReject() {
    this.compacctToast.clear("c");
  }
// BROWSE END
  clearData() {
  //this.Objproduction = new production ();
  this.ObjSFproduction.Brand_ID = undefined;
  this.ObjSFproduction.Type_of_Material = undefined;
  this.ObjSFproduction.Product_ID = undefined;
  this.ObjSFproduction.Final_Material_Qty = undefined;
  this.selectfinalmateriallist = [];
  this.ObjSFproduction.Process_ID = 3;
  this.ObjSFproduction.From_godown_id = undefined;
  this.ObjSFproduction.To_godown_id = undefined;
  this.editList = [];
  //this.editIndentList = [];
  //const obj = {...this.Objproduction}
  this.ObjSFproduction.Doc_No = undefined;
  this.ObjSFproduction.From_Process_ID = undefined;
      this.FPDisabled = true;
      this.editDis = false;
  //this.ObjSFproduction.From_godown_id = undefined;
  this.ObjSFproduction.Product_Type_ID = undefined;
  this.ObjSFproduction.Shift = this.SiftList.length ? this.SiftList[0].Shift_ID : undefined;
  //this.ObjSFproduction.To_godown_id = this.ToGodownList.length ? this.ToGodownList[0].godown_id : undefined;
  this.GetProDate();
  this.ProductionlList = [];
  this.inputBoxDisabled = false;
  //this.ProductDetailsList = [];
  this.SFproductionFormSubmitted = false;
  this.ProtypeDisabled = false;
  this.ProcessProductList =[];
  this.items = ["BROWSE", "CREATE"];
  this.buttonname = "Save"
  //this.SearchProduction();
  //this.ProductionlList = [];
  this.Datevalue = this.DateService.dateConvert(new Date(this.Datevalue));
  this.todayDate = new Date();
  this.ngxService.stop();
  }
  Refresh(){
    //this.clearData();
    this.ObjSFproduction.Brand_ID = undefined;
    this.ObjSFproduction.Type_of_Material = undefined;
    this.ObjSFproduction.Product_ID = undefined;
    this.ObjSFproduction.Final_Material_Qty = undefined;
    this.selectfinalmateriallist = [];
    this.ObjSFproduction.Process_ID = 3;
    this.ObjSFproduction.From_godown_id = undefined;
    this.ObjSFproduction.To_godown_id = undefined;
    //const obj = {...this.Objproduction}
   // this.Objproduction.Doc_No = undefined;
    this.ObjSFproduction.From_Process_ID = undefined;
    //if(this.FromProcessList = []){
      //if(this.Objproduction.From_Process_ID = undefined){
        this.FPDisabled = true;
        this.BatchDisabled = true;
        this.allProductsCheck = false;
        this.editDis = false;
   // }
    // else{
    //      this.FPDisabled = false;
    // }
    this.ObjSFproduction.From_godown_id = undefined;
    this.ObjSFproduction.Product_Type_ID = undefined;
    this.ObjSFproduction.Shift = this.SiftList.length === 2 ? this.SiftList[0].Shift_ID : undefined;
   // this.Objproduction.To_godown_id = this.ToGodownList.length === 3 ? this.ToGodownList[0].godown_id : undefined;
    //this.ObjSFproduction.To_godown_id = this.ToGodownList.length  ? this.ToGodownList[0].godown_id : undefined;
    this.GetProDate();
    this.ProductionlList = [];
    this.BackUpProductionlList = [];
    this.inputBoxDisabled = false;
    //this.ProductDetailsList = [];
    this.SFproductionFormSubmitted = false;
    this.AddProDetailsFormSubmitted = false;
    this.ProtypeDisabled = false;
    this.ProcessProductList =[];
    this.Datevalue = this.DateService.dateConvert(new Date(this.Datevalue));
    this.todayDate = new Date();
    this.SelectedIndent = [];
    this.IndentFilter = []
    this.ngxService.stop();
  }
}
class SFproduction {
  Doc_No : string;
  Brand_ID : any;
  Type_of_Material : any;
  Final_Material_Qty : any;
  Product_ID : any;
  Product_Type_ID : any;
  Process_ID : any;
  From_Process_ID : string;
  From_Process_Name : string;
  Previous_Process_ID : any;
  Previous_Process_Name : string;
  Shift : any;
  From_godown_id : any;
  To_godown_id : any;
  To_Cost_Cen_ID : any;
  From_Cost_Cen_ID : any;
  Doc_Date : any;
  User_ID : any;;
  Remarks : any;
  indent_Date : any;
  indentNo : any;
 }
//  class productAdd {
//   Product_Name : string;
//   Batch_No : string;
//   Stock_Qty : string;
//   Product_ID : string;
//   Product_Description : string;
//  }
 class Browse {
   start_date : Date ;
   end_date : Date;
   Cost_Cen_ID : 0;
   Product_Type_ID : 0;


 }
