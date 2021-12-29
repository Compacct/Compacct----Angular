import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service"
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-k4c-rsns-closing-stock',
  templateUrl: './k4c-rsns-closing-stock.component.html',
  styleUrls: ['./k4c-rsns-closing-stock.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cRsnsClosingStockComponent implements OnInit {
  items = [];
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
  costcenlist = [];
  GodownList = [];
  Costdisableflag = false;
  Gdisableflag = false;
  Costbrowsedisableflag = false;
  Gbrowsedisableflag = false;
  IndentListFormSubmitted = false;
  ProductList = [];
  SelectedIndent: any;
  BackupIndentList = [];
  IndentFilter = [];
  TIndentList = [];
  Searchedlist = [];
  flag = false;
  productListFilter = [];
  SelectedProductType :any = [];
  Param_Flag ='';
  CostCentId_Flag : any;
  MaterialType_Flag = '';
  todayDate : any = new Date();
  minDate : any = new Date();
  maxDate :  any = new Date();
  Doc_No = undefined;
  Editlist = [];
  ViewList = [];
  ViewPoppup = false;
  Doc_date = undefined;
  Cost_Cent_ID = undefined;
  Godown_ID = undefined;
  MaterialType = undefined;
  remarks = undefined;
  datepickerdisable = false;

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private route : ActivatedRoute,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) {
    this.route.queryParams.subscribe(params => {
      // console.log(params);
      this.clearData();
      this.Searchedlist = [];
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
     this.GetCostCen();
     this.GetGodown();
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
     this.BackupIndentList = [];
     this.TIndentList = [];
     this.SelectedIndent = [];
   }
  GetCostCen(){
    const tempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      //Material_Type : this.MaterialType_Flag
    }
    const obj = {
      "SP_String": "SP_Raw_Material_Stock_Transfer",
      "Report_Name_String": "Get Cost Centre",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.costcenlist = data;
      this.ObjrsnsClosingStock.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.ObjBrowse.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID; 
      this.GetGodown();
     })
  }

  GetGodown(){
    //if(this.ObjrsnsClosingStock.Cost_Cen_ID){
      const tempObj = {
        Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
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
       this.ObjBrowse.godown_id = this.GodownList.length === 1 ? this.GodownList[0].godown_id : undefined;
       if(this.GodownList.length === 1){
         this.Gbrowsedisableflag = true;
       }else{
         this.Gbrowsedisableflag = false;
       }
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
      Material_Type : this.MaterialType_Flag
     }
   const obj = {
    "SP_String": "SP_K4C_RSNS_Closing_Stock",
    "Report_Name_String" : "Get Product",
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
    this.rsnsClosingStockFormSubmitted = false;
    this.GetProductType();
   console.log("this.ProductList======",this.ProductList);
   })
  }
  }
  // product Filter

  filterProduct(){
    if(this.SelectedProductType.length){
      let tempProduct = [];
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
  let DOrderBy = [];
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
    this.ProductList[indx]['Varience_Qty'] = this.ProductList[indx]['Batch_Qty'] - this.ProductList[indx]['Closing_Qty'];
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
    let tempArr =[];
    const TempObj = {
      //Doc_No	 : this.Doc_No ? this.Doc_No : "A",
      Doc_No : "A",
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
      //  if (this.buttonname == "Save & Print") {
      //  this.saveNprintProVoucher();
      //  }
       this.clearData();
      // this.IssueStockFormSubmitted = false;

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
}
Edit(DocNo){
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
this.Doc_No = DocNo.Doc_No;
// this.ViewPoppup = true;
 this.tabIndexToView = 1;
 this.items = ["BROWSE", "UPDATE"];
 this.buttonname = "Update";
 this.datepickerdisable = true;
 this.Gdisableflag = true;
// console.log("VIew ==", this.Objproduction.Doc_No);
this.GetdataforEdit(this.Doc_No);
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
       this.todayDate = data[0].Doc_Date;
      //  this.minDate = new Date(data[0].Doc_Date.getDate());
      //  this.maxDate = new Date(data[0].Doc_Date.getDate());
       this.ObjrsnsClosingStock.Cost_Cen_ID = data[0].Cost_Cen_ID;
       this.ObjrsnsClosingStock.godown_id = data[0].godown_id;
         data.forEach(element => {
           const  productObj = {
            Product_Type_ID : element.Product_Type_ID,
            Product_Type : element.Product_Type,
            Product_ID : element.Product_ID,
            Product_Description : element.Product_Description,
            Batch_No : element.Batch_No,
            Batch_Qty : element.Total_Qty,
            UOM : element.UOM,
            Closing_Qty : element.Closing_Qty,
            Varience_Qty : element.Varience_Qty,
            //Expiry_Date :  element.Expiry_Date,
            Remarks : element.Remarks
          };
           this.ProductList.push(productObj);
      });
      // FOR VIEW
          this.Doc_No = data[0].Doc_No;
          this.Doc_date = new Date(data[0].Doc_Date);
          this.Cost_Cent_ID = data[0].Location;
          this.Godown_ID = data[0].godown_name;
          this.MaterialType = data[0].Brand_Name;
      // console.log("this.editList  ===",data);
     // if(this.buttonname != "Update"){
        //  this.ViewPoppup = true;
      //}
    })
}
View(DocNo){
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
this.Doc_No = DocNo.Doc_No;
 this.ViewPoppup = true;
// console.log("VIew ==", this.Objproduction.Doc_No);
this.GetdataforEdit(this.Doc_No);
//this.getadvorderdetails(this.Objcustomerdetail.Bill_No);
}
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
 }

  clearData(){
    this.ObjrsnsClosingStock.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.ObjBrowse.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID; 
    //this.ObjrsnsClosingStock.Cost_Cen_ID = String(this.CostCentId_Flag);
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
    this.ObjrsnsClosingStock.Remarks = [];
    this.ObjrsnsClosingStock.Indent_List = undefined;
    this.ProductList = [];
    this.BackupIndentList = [];
    this.TIndentList = [];
    this.SelectedIndent = [];
    this.IndentFilter = [];
    // Product Filter
    this.rsnsClosingStockFormSubmitted = false;
    this.SelectedProductType = [];
    this.ShowSpinner = false;
    this.RSNSSearchFormSubmitted = false;
    this.ObjrsnsClosingStock.Doc_No = undefined;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    //this.todayDate = new Date();
    // this.minDate = new Date(this.todayDate.getDate());
    // this.maxDate = new Date(this.todayDate.getDate());
    this.datepickerdisable = false;
    this.GetDate();
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
