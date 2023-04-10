import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service"
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-k4c-rsns-closing-stock',
  templateUrl: './k4c-rsns-closing-stock.component.html',
  styleUrls: ['./k4c-rsns-closing-stock.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cRsnsClosingStockComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  ShowSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  myDate : Date;
  ObjrsnsClosingStock : rsnsClosingStock = new rsnsClosingStock ();
  rsnsClosingStockFormSubmitted = false;
  ObjBrowse : Browse = new Browse ();
  RSNSSearchFormSubmitted = false;
  costcenlist:any = [];
  GodownList:any = [];
  Costdisableflag = false;
  Gdisableflag = false;
  Costbrowsedisableflag = false;
  Gbrowsedisableflag = false;
  IndentListFormSubmitted = false;
  ProductList:any = [];
  BackupProList:any = [];
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
  todayDate : any = new Date();
  minDate : any = new Date();
  maxDate :  any = new Date();
  Doc_No = undefined;
  Editlist:any = [];
  ViewList:any = [];
  ViewPoppup = false;
  Doc_date = undefined;
  Cost_Cent_ID = undefined;
  Godown_ID = undefined;
  MaterialType = undefined;
  remarks = undefined;
  datepickerdisable = true;
  Browsecostcenlist:any = [];
  BrowseGodownList:any = [];
  Date: Date;
  ViewDoc_No: any;
  Viewlist:any = [];

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private route : ActivatedRoute,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) {
    this.route.queryParams.subscribe(params => {
      // console.log(params);
      this.clearData();
      this.Gdisableflag = false;
      this.Searchedlist = [];
      this.ProductList = [];
      this.productListFilter = [];
      this.ObjBrowse.godown_id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
     if(this.GodownList.length === 1){
       this.Gbrowsedisableflag = true;
     }else{
       this.Gbrowsedisableflag = false;
     }
      //this.Param_Flag = params['Name'];
      //this.CostCentId_Flag = params['Cost_Cen_ID'];
      this.MaterialType_Flag = params['Material_Type']
       console.log (this.CostCentId_Flag);
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: this.MaterialType_Flag + " Closing Stock ",// + this.Param_Flag, this.MaterialType_Flag + 
      Link: this.MaterialType_Flag + " Closing Stock "
    });
    this.GetBrowseCostCen();
     this.GetCostCen();
    //  this.GetGodown();
     this.GetDate();
    // this.GetProductType();
    // this.todayDate = new Date(this.myDate);
    // let Datetemp:Date =  new Date(this.todayDate)
    // const Timetemp =  Datetemp.setDate(Datetemp.getDate() - 3);
    // this.minDate = new Date(Timetemp);
    // console.log("this.minDate===", this.minDate)
    // this.maxDate = this.todayDate;
    // console.log("this.maxDate===", this.maxDate)
  })
   }

  ngOnInit() {
  
  }
  GetDate(){
    const obj = {
      "SP_String":"SP_Raw_Material_Stock_Transfer",
      "Report_Name_String": "Get Date"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.todayDate = new Date(data[0].Column1);
      console.log("todayDate",this.todayDate);
     // let Datetemp:Date =  new Date(data[0].Column1)
      //const Timetemp =  Datetemp.setDate(Datetemp.getDate() - 3);
      //this.minDate = new Date(Timetemp);
     // console.log("minDate==", this.minDate)
      // let tempDate:Date =  new Date(data[0].Column1)
      // const tempTimeBill =  tempDate.setDate(tempDate.getDate() + 1);
      //this.maxDate = this.todayDate;
     // console.log("maxDate==", this.maxDate)

    })
  }

  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Save";
     this.clearData();
     this.GetDate();
     this.BackupIndentList = [];
     this.TIndentList = [];
     this.SelectedIndent = [];
     this.ProductList = [];
     this.productListFilter = [];
     this.Gdisableflag = false;
     this.ViewDoc_No = undefined;
     this.seachSpinner = false;
     this.ngxService.stop();
     if (this.buttonname === "Save") {
      this.Doc_No = undefined;
      this.Doc_date = undefined;
     }
   }
   GetBrowseCostCen(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Cost Center Name All",
      "Json_Param_String": JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}])
     // "Json_Param_String": JSON.stringify([{User_ID : 61}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Browsecostcenlist = data;
      this.ObjBrowse.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID; 
      this.GetBrowseGodown();
     })
  }

  GetBrowseGodown(){
    this.BrowseGodownList = [];
    //if(this.ObjrsnsClosingStock.Cost_Cen_ID){
      const tempObj = {
        Cost_Cen_ID : this.ObjBrowse.Cost_Cen_ID
        //Material_Type : this.MaterialType_Flag
      }
      const obj = {
        "SP_String": "SP_Raw_Material_Stock_Transfer",
        "Report_Name_String": "Get - Godown",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.BrowseGodownList = data;
        //this.ObjRawMateriali.From_godown_id = data[0].godown_id;
       this.ObjBrowse.godown_id = this.BrowseGodownList.length === 1 ? this.BrowseGodownList[0].godown_id : undefined;
       if(this.BrowseGodownList.length === 1){
         this.Gbrowsedisableflag = true;
       }else{
         this.Gbrowsedisableflag = false;
       }
         //console.log("From Godown List ===",this.FromGodownList);
      })
    //}

  }
  GetCostCen(){
    // const tempObj = {
    //   Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    //   //Material_Type : this.MaterialType_Flag
    // }
    // const obj = {
    //   "SP_String": "SP_Raw_Material_Stock_Transfer",
    //   "Report_Name_String": "Get Cost Centre",
    //   "Json_Param_String": JSON.stringify([tempObj])
    // }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Cost Center Name All",
      "Json_Param_String": JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}])
     // "Json_Param_String": JSON.stringify([{User_ID : 61}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.costcenlist = data;
      this.ObjrsnsClosingStock.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      // this.ObjBrowse.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID; 
      this.GetGodown();
     })
  }

  GetGodown(){
    this.GodownList = [];
    //if(this.ObjrsnsClosingStock.Cost_Cen_ID){
      const tempObj = {
        Cost_Cen_ID : this.ObjrsnsClosingStock.Cost_Cen_ID
        //Material_Type : this.MaterialType_Flag
      }
      const obj = {
        "SP_String": "SP_Raw_Material_Stock_Transfer",
        "Report_Name_String": "Get - Godown",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.GodownList = data;
        //this.ObjRawMateriali.From_godown_id = data[0].godown_id;
        this.ObjrsnsClosingStock.godown_id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
       if(this.GodownList.length === 1){
         this.Gdisableflag = true;
       }else{
         this.Gdisableflag = false;
       }
      //  this.ObjBrowse.godown_id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
      //  if(this.GodownList.length === 1){
      //    this.Gbrowsedisableflag = true;
      //  }else{
      //    this.Gbrowsedisableflag = false;
      //  }
         //console.log("From Godown List ===",this.FromGodownList);
      })
    //}

  }
  GetProductList(valid){
    this.rsnsClosingStockFormSubmitted = true;
    if(valid){
      this.ShowSpinner = true;
    const TempObj = {
      Cost_Cen_ID : this.ObjrsnsClosingStock.Cost_Cen_ID,
      Godown_ID : this.ObjrsnsClosingStock.godown_id,
      Product_Type_ID : 0,
      Material_Type : this.MaterialType_Flag,
      Doc_Type : this.buttonname === "Save" ? "Create" : "Edit",
      Doc_No : this.buttonname === "Save" ? "" : this.Doc_No,
      Doc_Date : this.buttonname === "Save" ? "" : this.DateService.dateConvert(new Date(this.Date))
     }
   const obj = {
    "SP_String": "SP_K4C_RSNS_Closing_Stock",
    "Report_Name_String" : "Get Product",
   "Json_Param_String": JSON.stringify([TempObj])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.ProductList = data
    this.BackupProList = data;
    this.ProductList.forEach(element => {
    element['Issue_Qty'] = undefined;
 });
   //this.ProductList = data;
   this.ShowSpinner = false;
   this.BackupIndentList = data;
    this.rsnsClosingStockFormSubmitted = false;
    this.GetProductType();
    this.Gdisableflag = true;
   console.log("this.ProductList======",this.ProductList);
   if (this.ProductList.length && this.buttonname == "Update"){
    const ctrl = this;
   setTimeout(function () {
     ctrl.GetdataforEdit(this.Doc_No);
   }, 600)
   }
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
VarianceqtyChq(indx){
  this.ProductList[indx]['Varience_Qty'] =  0;
  if(this.ProductList[indx]['Batch_Qty'] && this.ProductList[indx]['Closing_Qty']){
    this.ProductList[indx]['Varience_Qty'] = (this.ProductList[indx]['Batch_Qty'] - this.ProductList[indx]['Closing_Qty']).toFixed(2);
  }
  //this.changeRemarks(indx);
  this.ProductList.forEach(el=>{
    if(this.ProductList[indx]['Product_ID'] === el.Product_ID){
     if(Number(this.ProductList[indx]['Batch_Qty']) === Number(this.ProductList[indx]['Closing_Qty'])){
       // this.Remarksdisabled = true;
       this.ProductList[indx]['Remarks'] = "NA";
      } else {
     //   this.Remarksdisabled = false;
     this.ProductList[indx]['Remarks'] = el.Remarks;
      }
    }

  })
}
changeRemarks(col){
  console.log("Change Remarks")
  this.ProductList.forEach(el=>{
    if(col.Product_ID === el.Product_ID){
     if(Number(col.Batch_Qty) === Number(col.Closing_Qty)){
       // this.Remarksdisabled = true;
       col.Remarks = "NA";
      } else {
     //   this.Remarksdisabled = false;
       col.Remarks = el.Remarks;
      }
    }

  })
console.log(this.Editlist)
}
GetDataForSave(){
  if(this.ProductList.length) {
    let tempArr:any =[];
    const TempObj = {
      Doc_No	 : this.Doc_No ? this.Doc_No : "A",
      // Doc_No : "A",
      Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
      Cost_Cen_ID	: this.ObjrsnsClosingStock.Cost_Cen_ID,
      Godown_ID	: this.ObjrsnsClosingStock.godown_id,
      //Narration	: this.ObjOTclosingwithbatch.Remarks,
      User_ID	: this.$CompacctAPI.CompacctCookies.User_ID,
     // Process_ID : 100,
      Material_Type : this.MaterialType_Flag
    }
    this.ProductList.forEach(item => {
      if(item.Closing_Qty) {
        const obj = {
          Product_Type_ID : item.Product_Type_ID,
          Product_ID : item.Product_ID,
          UOM : item.UOM,
          Last_Pur_Rate : item.Last_Pur_Rate,
          Batch_No : item.Batch_No,
          Total_Qty : item.Batch_Qty,
          Closing_Qty	: item.Closing_Qty,
          Varience_Qty : item.Varience_Qty,
          Remarks : item.Batch_Qty != item.Closing_Qty ? item.Remarks : 'NA'
       }

       tempArr.push({...TempObj,...obj})
      }

    });
    console.log("Save Data ===", ...tempArr)
    return JSON.stringify(tempArr);

  }
}
SaveBeforeCheck(){
    this.Spinner = true;
  if (this.ProductList.length) {
const tempo = {
  Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
  Cost_Cen_ID : this.ObjBrowse.Cost_Cen_ID,
  Godown_ID : this.ObjBrowse.godown_id,
  Material_Type : this.MaterialType_Flag
}
const obj = {
  "SP_String": "SP_K4C_RSNS_Closing_Stock",
  "Report_Name_String": "Check_K4C_RSNS_Closing_Stock_Exit_Or_Not",
  "Json_Param_String": JSON.stringify([tempo])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  if (this.buttonname === "Save") {
   if (data[0].Column1 === "OK"){
    // this.SaveBeforeCheck();
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "s",
      sticky: true,
      severity: "warn",
      summary: "Are you sure?",
      detail: "Confirm to proceed"
    });
   }
   else {
    this.Spinner = false;
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Already Saved ! ",
      detail: "Please go to browse and update  "
    });
   }
  }
   else {
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "s",
      sticky: true,
      severity: "warn",
      summary: "Are you sure?",
      detail: "Confirm to proceed"
    });
   }
 })
}
}
// SaveBeforeCheck(){
//    this.Spinner = true;
//    if (this.ProductList.length) {
//     this.compacctToast.clear();
//     this.compacctToast.add({
//       key: "s",
//       sticky: true,
//       severity: "warn",
//       summary: "Are you sure?",
//       detail: "Confirm to proceed"
//     });
//   }
// }
Save(){
  //if(valid){
    const obj = {
      "SP_String": "SP_K4C_RSNS_Closing_Stock",
      "Report_Name_String" : "Save_K4C_RSNS_Closing_Stock",
     "Json_Param_String": this.GetDataForSave()

    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      //console.log(data);
      var tempID = data[0].Column1;
     // this.Objproduction.Doc_No = data[0].Column1;
      if(data[0].Column1){
        this.compacctToast.clear();
        const mgs = this.buttonname === "Save" ? "Saved" : "Updated";
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Doc_No  " + tempID,
         detail: "Succesfully  "  + mgs
       });
       this.Spinner = false;
       if (this.buttonname != "Save") {
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          this.buttonname = "Create";
          this.clearData();
          this.GetDate();
          this.GetSearchedList(true);
          this.Doc_No = undefined;
          this.Doc_date = undefined;
       }
       //this.clearData();
      // this.IssueStockFormSubmitted = false;

      } else{
        this.Spinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
    })
  //}
}
getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
}
GetSearchedList(valid){
  this.RSNSSearchFormSubmitted = true;
    this.Searchedlist = [];
    this.seachSpinner = true;
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
  Cost_Cen_ID : this.ObjBrowse.Cost_Cen_ID,
  Godown_ID : this.ObjBrowse.godown_id,
  Material_Type : this.MaterialType_Flag
}
const obj = {
  "SP_String": "SP_K4C_RSNS_Closing_Stock",
  "Report_Name_String": "Browse_K4C_RSNS_Closing_Stock",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
   this.RSNSSearchFormSubmitted = false; 
 })
}
else {
  this.seachSpinner = false;
}
}
Edit(DocNo){  // async
  //console.log("View ==",DocNo);
this.clearData();
//this.editList = [];
this.Doc_No = undefined;
this.Doc_date = undefined;
this.MaterialType = undefined;
this.Cost_Cent_ID = undefined;
this.Godown_ID = undefined;
this.remarks = undefined;
if(DocNo.Doc_No){
  this.ngxService.start();
  this.ProductList = [];
  this.BackupProList = [];
this.Doc_No = DocNo.Doc_No;
this.Date = new Date(DocNo.Doc_Date);
// this.ViewPoppup = true;
 this.tabIndexToView = 1;
 this.items = ["BROWSE", "UPDATE"];
 this.buttonname = "Update";
 this.datepickerdisable = false;
 this.Gdisableflag = true;
 this.todayDate = this.Date;
// console.log("VIew ==", this.Objproduction.Doc_No);
 this.GetProductList(true); // await
// if (await this.ProductList.length){
//  const ctrl = this;
// setTimeout(function () {
//   ctrl.GetdataforEdit(this.Doc_No);
// }, 600)
// }
//this.getadvorderdetails(this.Objcustomerdetail.Bill_No);
}
}
GetdataforEdit(Doc_No){
  //this.OTclosingstockwithbatchFormSubmitted = false;
    const obj = {
      "SP_String": "SP_K4C_RSNS_Closing_Stock",
      "Report_Name_String": "Get_Edit_Data",
      "Json_Param_String": JSON.stringify([{Doc_No  : this.Doc_No}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Edit Data From API",data);
    this.Editlist = data;
      //  this.todayDate = new Date(data[0].Doc_Date);
      //  this.minDate = new Date(data[0].Doc_Date.getDate());
      //  this.maxDate = new Date(data[0].Doc_Date.getDate());
       this.ObjrsnsClosingStock.Cost_Cen_ID = data[0].Cost_Cen_ID;
       this.GetGodown();
       this.ObjrsnsClosingStock.godown_id = data[0].godown_id;
      //    data.forEach(element => {
      //      const  productObj = {
      //       Product_Type_ID : element.Product_Type_ID,
      //       Product_Type : element.Product_Type,
      //       Product_ID : element.Product_ID,
      //       Product_Description : element.Product_Description,
      //       Batch_No : element.Batch_No,
      //       Batch_Qty : element.Total_Qty,
      //       UOM : element.UOM,
      //       Closing_Qty : element.Closing_Qty,
      //       Varience_Qty : element.Varience_Qty,
      //       //Expiry_Date :  element.Expiry_Date,
      //       Remarks : element.Remarks
      //     };
      //      this.ProductList.push(productObj);
      // });
      console.log("edit ProductList===", this.BackupProList);
      const ctrl = this;
      setTimeout(function () {
        ctrl.BackupProList.forEach(ele => {
        const ARR = ctrl.Editlist.filter(item => (Number(item.Product_ID) == Number(ele.Product_ID) && (item.Batch_No == ele.Batch_No)))
        // console.log("ARR",ARR)
        if (ARR.length) {
          ele['Closing_Qty']= ARR[0].Closing_Qty,
          // el.Product_Type_ID = aRR[0].Product_Type_ID,
          // el.Product_Type = aRR[0].Product_Type,
          // el.Product_ID = aRR[0].Product_ID,
          // el.Product_Description = aRR[0].Product_Description,
          ele['Last_Pur_Rate'] = ARR[0].Last_Pur_Rate,
          ele['Batch_No'] = ARR[0].Batch_No,
          ele['Batch_Qty'] = ARR[0].Total_Qty,
          // el.UOM = aRR[0].UOM,
          // el.Closing_Qty = aRR[0].Closing_Qty,
          ele['Varience_Qty'] = ARR[0].Varience_Qty,
          ele['Remarks'] = ARR[0].Remarks
        }
        ctrl.ProductList = ctrl.BackupProList;
       // console.log("edit ProductList===", ARR);
      });
    }, 600)
    //   this.ProductList = [...this.ProductList];
     
    this.ngxService.stop();
      // FOR VIEW
      // this.Doc_No = data[0].Doc_No;
      // this.Doc_date = new Date(data[0].Doc_Date);
      // this.Cost_Cent_ID = data[0].Location;
      // this.Godown_ID = data[0].godown_name;
      // this.MaterialType = data[0].Brand_Name;
    })
}
View(DocNo){
  //console.log("View ==",DocNo);
this.clearData();
//this.editList = [];
this.ViewDoc_No = undefined;
this.Doc_date = undefined;
this.MaterialType = undefined;
this.Cost_Cent_ID = undefined;
this.Godown_ID = undefined;
this.remarks = undefined;
if(DocNo.Doc_No){
this.ViewDoc_No = DocNo.Doc_No;
console.log("VIew ==", this.ViewDoc_No);
this.GetdataforView();
//this.getadvorderdetails(this.Objcustomerdetail.Bill_No);
}
}
GetdataforView(){
  this.Viewlist = [];
  //this.OTclosingstockwithbatchFormSubmitted = false;
    const obj = {
      "SP_String": "SP_K4C_RSNS_Closing_Stock",
      "Report_Name_String": "Get_Edit_Data",
      "Json_Param_String": JSON.stringify([{Doc_No  : this.ViewDoc_No}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("View Data From API",data);
    this.Viewlist = data;
    this.ViewPoppup = true;
      console.log("view Viewlist===", this.BackupProList);
      // FOR VIEW
      this.ViewDoc_No = data[0].Doc_No;
      this.Doc_date = new Date(data[0].Doc_Date);
      this.Cost_Cent_ID = data[0].Location;
      this.Godown_ID = data[0].godown_name;
      this.MaterialType = data[0].Brand_Name;
    })
}
Delete(row){
  // console.log("delete",row)
   this.Doc_No = undefined;
   if (row.Doc_No) {
    this.Doc_No = row.Doc_No;
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
   if(this.Doc_No){
     const TempObj = {
       Doc_No : this.Doc_No,
       //User_ID : this.$CompacctAPI.CompacctCookies.User_ID
     }
     const obj = {
       "SP_String": "SP_K4C_RSNS_Closing_Stock",
       "Report_Name_String": "Delete_K4C_RSNS_Closing_Stock",
       "Json_Param_String": JSON.stringify([TempObj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("del Data===", data[0].Column1)
        if (data[0].Column1 === "Done"){
          this.onReject();
          this.GetSearchedList(true);
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Doc No.: " + this.Doc_No.toString(),
            detail: "Succesfully Deleted"
          });
          this.clearData();
        }
      })
   }
 }
 onReject(){
   this.compacctToast.clear("c");
   this.compacctToast.clear("s");
   this.Spinner = false;
 }

  clearData(){
    this.GetBrowseCostCen();
    this.GetCostCen();
    // this.ObjrsnsClosingStock.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    // this.ObjBrowse.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID; 
    //this.ObjrsnsClosingStock.Cost_Cen_ID = String(this.CostCentId_Flag);
    // this.ObjrsnsClosingStock.godown_id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
    //  if(this.GodownList.length === 1){
    //    this.Gdisableflag = true;
    //  }else{
    //    this.Gdisableflag = false;
    //  }
    //  this.ObjBrowse.godown_id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
    //  if(this.GodownList.length === 1){
    //    this.Gbrowsedisableflag = true;
    //  }else{
    //    this.Gbrowsedisableflag = false;
    //  }
    this.ObjrsnsClosingStock.Remarks = [];
    this.ObjrsnsClosingStock.Indent_List = undefined;
    //this.ProductList = [];
    this.BackupIndentList = [];
    this.TIndentList = [];
    this.SelectedIndent = [];
    this.IndentFilter = [];
    // Product Filter
    this.rsnsClosingStockFormSubmitted = false;
    this.SelectedProductType = [];
    this.ShowSpinner = false;
    this.Spinner = false;
    this.RSNSSearchFormSubmitted = false;
    this.ObjrsnsClosingStock.Doc_No = undefined;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    //this.todayDate = new Date();
    // this.minDate = new Date(this.todayDate.getDate());
    // this.maxDate = new Date(this.todayDate.getDate());
    this.datepickerdisable = true;
    // this.GetDate();
    this.Editlist = [];
    this.ViewDoc_No = undefined;
    this.ViewList = [];
  }

}
class rsnsClosingStock {
  Doc_No : string = undefined;
  Doc_Date : string;
  Cost_Cen_ID : any;
  godown_id : any;
  Indent_List : any;
  Remarks : any;
 }
 class Browse {
  start_date : Date ;
  end_date : Date;
  Cost_Cen_ID : string;
  godown_id : string;
}
