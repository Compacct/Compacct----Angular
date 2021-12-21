import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-k4c-adv-order-internal-stock-transfer',
  templateUrl: './k4c-adv-order-internal-stock-transfer.component.html',
  styleUrls: ['./k4c-adv-order-internal-stock-transfer.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cAdvOrderInternalStockTransferComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save";
  todayDate = new Date();
  myDate :any = Date;
  Datevalue : any = Date ;
  ProductionFormSubmitted = false ;

  inputBoxDisabled = false;
  Objproduction : production = new production ();
  ObjBrowse : Browse = new Browse ();
  //FPDisabled = true;
  AddProDetailsFormSubmitted = false;
  ObjproductAdd : productAdd = new productAdd ();
  //ProtypeDisabled = false;

  BrandList = [];
  ProductTypeList = [];
  Fcostcenlist = [];
  FromGodownList = [];
  Tocostcenlist = [];
  ToGodownList = [];
  Datelist = [];
  ProductNamelList = [];
  BatchNoList = [];
  AddProDetails = [];
  Searchedlist = [];
  godownid = [];
  editList = [];
  FPDisabled = false;
  editFlag = false;
  AdvIntStockFormSubmitted = false;
  ProtypeDisabled = false
  initDate = [];
  minDate: Date;
  maxDate: Date;
  displaysavepopup = false;
  filteredData = [];
  BrowseDate = [];
  BDate: Date;
  DateProlist = [];
  ProDate : any = Date;
  ProductionList = [] ;
  BackupProductionList = [];
  ProductionFilter = [];
  SelectedProduction : any;
  TProductionList = [];
  Cost_Cen_Id: any;
  BackUpProductNamelList = [];
  editProNoList = [];

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService

  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Internal Stock Transfer (Advance Order)",
      Link: " Material Management -> Internal Stock Transfer (Advance Order)"
    });
    this.GetBrand();
    this.GetFromCostCen();
    //this.GetFromGodown();
    this.GetToCostCen();
    //this.GetToGodown();
    this.GetDate();
    this.GetBrowseDate();
    this.GetProDate();
  }
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
     this.clearData();
     this.Objproduction.Product_Type_ID = undefined;
     this.SelectedProduction = [];
     this.ProductionFilter = [];
   }
 
   //CREATE START
   GetBrand(){
     const obj = {
       "SP_String": "SP_Production_Voucher",
       "Report_Name_String": "Get - Brand"
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.BrandList = data;
       //this.Objproduction.Brand_ID = this.BrandList.length === 2 ? this.BrandList[0].Brand_ID : undefined;
       //this.Objproduction.Brand_ID = this.BrandList[0].Brand_ID;
       this.Objproduction.Brand_ID = undefined;
       //this.GetProductType();
      // console.log("Brand List ===",this.BrandList);
     })
   } 
   GetProductType(){
     //console.log("brand id ==", this.Objproduction.Brand_ID)
     const tempObj = {
       brand_id : this.Objproduction.Brand_ID
     }
     const obj = {
       "SP_String": "SP_Production_Voucher",
       "Report_Name_String": "GET Product Type",
       "Json_Param_String": JSON.stringify([tempObj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ProductTypeList = data;
     //  const Product_Type_ID = this.ProcessProductList.length === 4 ? this.ProcessProductList[0].Product_Type_ID : undefined;
     //   this.GetProductionpro(Product_Type_ID);
      // console.log("Product Process List ===",this.ProductTypeList);
       //this.inputBoxDisabled = true;
       //this.ProductionFormSubmitted = false;
       //this.FPDisabled = true;
       if(this.editList.length){
         this.Objproduction.Product_Type_ID =  undefined;
       this.ProductTypeList.forEach(item => {
         const dataTemp = this.editList.filter(elem=> elem.Product_Type_ID == item.Product_Type_ID);
         if(dataTemp.length === this.editList.length){
           this.Objproduction.Product_Type_ID = this.editList[0].Product_Type_ID;
         }
 
       })
     }
     })
   }
   GetFromCostCen(){
     const obj = {
       "SP_String": "SP_Production_Voucher",
       "Report_Name_String": "Get - Non Outlet Cost Centre"
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Fcostcenlist = data;
       //this.Objproduction.From_Cost_Cen_ID = this.Fcostcenlist.length === 21 ? this.Fcostcenlist[0].From_Cost_Cen_ID : undefined;
       this.Objproduction.From_Cost_Cen_ID = data[0].Cost_Cen_ID;;
       //console.log("Cost Cen List ===",this.Fcostcenlist);
       //this.GetFromGodown();
     })
   }
   GetFromGodown(){
     const tempObj = {
       //Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
       Cost_Cen_ID : this.Objproduction.From_Cost_Cen_ID
     }
     const obj = {
       "SP_String": "SP_Production_Voucher",
       "Report_Name_String": "Get - Godown",
       "Json_Param_String": JSON.stringify([tempObj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.FromGodownList = data;
       //this.Objproduction.From_godown_id = this.FromGodownList.length === 3 ? this.FromGodownList[0].godown_id : undefined;
       this.Objproduction.From_godown_id = data[0].godown_id;
       //this.godownid = data[0].godown_id;
        //console.log("From Godown List ===",this.FromGodownList);
     })
   }
   GetToCostCen(){
     const obj = {
       "SP_String": "SP_Production_Voucher",
       "Report_Name_String": "Get - Non Outlet Cost Centre"
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Tocostcenlist = data;
      // this.Objproduction.From_Cost_Cen_ID = this.Fcostcenlist.length === 21 ? this.Fcostcenlist[0].From_Cost_Cen_ID : undefined;
       this.Objproduction.To_Cost_Cen_ID = data[0].Cost_Cen_ID;
      // console.log("To Cost Cen List ===",this.Tocostcenlist);
       //this.GetToGodown();
     })
   }
   GetToGodown(){
     const tempObj = {
       Cost_Cen_ID : this.Objproduction.To_Cost_Cen_ID
     }
     const obj = {
       "SP_String": "SP_Production_Voucher",
       "Report_Name_String": "Get - Godown",
       "Json_Param_String": JSON.stringify([tempObj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ToGodownList = data;
       // this.Objproduction.From_godown_id = this.FromGodownList.length === 3 ? this.FromGodownList[0].godown_id : undefined;
       //if(this.buttonname === "Save & Print" && this.ToGodownList.length)
       this.Objproduction.To_godown_id = data[0].godown_id;
       //this.Objproduction.To_godown_id = this.ToGodownList.length ? this.ToGodownList[0].godown_id : undefined;
        //console.log("To Godown List ===",this.ToGodownList);
     })
   }
   // PRODUCTION DATE
   GetProDate(){
     const obj = {
       "SP_String": "SP_Production_Voucher",
       "Report_Name_String": "Get - Production Date"
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.DateProlist = data;
       this.ProDate =  new Date(data[0].Column1);
       console.log("DateProList ===",this.DateProlist);
     })
   }
   // INTERNAL DATE
   GetDate(){
     const obj = {
       "SP_String": "SP_Production_Voucher",
       "Report_Name_String": "Get - Production Date"
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Datelist = data;
       this.myDate =  new Date(data[0].Column1);
       // console.log("Date List ===",this.Datelist);
       //this.initDate = [this.myDate , this.myDate];
       //console.log("this.initDate ==", this.initDate)
       this.Datevalue = new Date(data[0].Column1);
       this.minDate =  new Date(data[0].Column1);
        let tempDate:Date =  new Date(data[0].Column1)
       console.log("minDate==", this.minDate)
       const tempTimeBill =  tempDate.setDate(tempDate.getDate() + 1);
       this.maxDate = new Date(tempTimeBill);
       console.log("maxDate==", this.maxDate)
     })
   }
   // FOR PRODUCT NAME DROPDOWN
   dataforproduct(){
     if(this.SelectedProduction.length) {
       let Arr =[]
       this.SelectedProduction.forEach(el => {
         if(el){
           const Dobj = {
             Production_No : el,
             To_godown_Id : Number(this.Objproduction.From_godown_id),
             Doc_Date : this.DateService.dateConvert(new Date(this.ProDate))
             }
            Arr.push(Dobj)
         }
 
     });
       console.log("Table Data ===", Arr)
       return Arr.length ? JSON.stringify(Arr) : '';
     }
   }
   GetProductsName(){
     console.log("Objproduction.Product_Type_ID",this.Objproduction.Product_Type_ID);
    this.AdvIntStockFormSubmitted = true;
    //console.log("valid",valid);
     //if(valid){
       this.ProductNamelList = [];
       // const tempObj = {
       //   Brand_ID : this.Objproduction.Brand_ID,
       //   Product_Type_ID : this.Objproduction.Product_Type_ID ? this.Objproduction.Product_Type_ID : 0,
       //   From_Cost_Cen_ID : this.Objproduction.From_Cost_Cen_ID,
       //   From_godown_id : this.Objproduction.From_godown_id,
       //   Date : this.DateService.dateConvert(new Date(this.ProDate))
       // }
       const obj = {
         "SP_String": "SP_Adv_Order_IST",
         "Report_Name_String": "get PV Adv Order Product For IST",
         "Json_Param_String": this.dataforproduct()
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         //this.ProductionlList = data;
         this.ProductNamelList = data ;
          console.log("Product List ===",this.ProductNamelList);
          this.ProductNamelList.forEach(el=>{
            el['Transfer_Qty'] = el.batch_Qty;
          })
          this.BackUpProductNamelList = [...this.ProductNamelList];
       })
    // }
    }
    GetProductionNoList(valid){
     // this.RawMaterialIssueFormSubmitted = true;
     this.ProductNamelList = [];
      if(valid){
      const TempObj = {
       Doc_Date : this.DateService.dateConvert(new Date(this.ProDate)),
       Brand_ID : this.Objproduction.Brand_ID
       }
     const obj = {
      "SP_String": "SP_Adv_Order_IST",
      "Report_Name_String" : "get Adv Order No For IST",
     "Json_Param_String": JSON.stringify([TempObj])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // if(data.length) {
      //   data.forEach(element => {
      //     element['label'] = element.Req_No,
      //     element['value'] = element.Req_No
      //   });
        this.ProductionList = data;
        this.BackupProductionList = data;
       // this.Cost_Cen_Id = data[0].Cost_Cen_ID;
      // } else {
      //   this.IndentNoList = [];
  
      //  }
     // this.RawMaterialIssueFormSubmitted = false;
     console.log("this.ProductionList======",this.ProductionList);
     this.GetProduction();
    })
    }
    }
    GetProduction(){
      let DProduction = [];
      this.ProductionFilter = [];
      this.SelectedProduction = [];
      this.BackupProductionList.forEach((item) => {
        if (DProduction.indexOf(item.Production_No) === -1) {
         DProduction.push(item.Production_No);
          this.ProductionFilter.push({ label: item.PV_Against_Order_No , value: item.Production_No });
          console.log("this.ProductionFilter", this.ProductionFilter);
        }
      });
      this.BackupProductionList = [...this.ProductionList];
    }
    filterProductionList() {
      //console.log("SelectedTimeRange", this.SelectedTimeRange);
      let DProduction = [];
      this.TProductionList = [];
      //const temparr = this.ProductionlList.filter((item)=> item.Qty);
      //if(!this.editList.length && !this.editProNoList.length){
      this.BackUpProductNamelList =[];
      this.ProductNamelList = [];
        this.GetProductsName();
      //  }
      if (this.SelectedProduction.length) {
        this.TProductionList.push('Production_No');
        DProduction = this.SelectedProduction;
      }
      if(this.editList.length) {
        this.ProductNamelList = [];
        if (this.TProductionList.length) {
          let LeadArr = this.BackUpProductNamelList.filter(function (e) {
            return (DProduction.length ? DProduction.includes(e['Production_No']) : true)
          });
          this.ProductNamelList = LeadArr.length ? LeadArr : [];
        } else {
          this.ProductNamelList = [...this.BackUpProductNamelList];
          console.log("else Get Production list", this.ProductionList)
        }
      }
  
  
    }
 
  
   // FOR SAVE AND UPDATE
   getTotalBatchValue(){
     let Batchval = 0;
     this.filteredData.forEach((item)=>{
       Batchval += Number(item.batch_Qty)
     });
 
     return Batchval ? Batchval : '-';
   }
   getTotalInternalValue(){
     let Transval = 0;
     this.filteredData.forEach((item)=>{
       Transval += Number(item.Transfer_Qty)
     });
 
     return Transval ? Transval : '-';
   }
  //  showDialog() {
  //    this.displaysavepopup = true;
  //    this.filteredData = [];
  //    this.ProductNamelList.forEach(obj => {
  //      if(obj.Transfer_Qty && Number(obj.Transfer_Qty) !== 0 ){
  //      //  console.log(filteredData.push(obj.Product_ID));
  //      this.filteredData.push(obj);
  //       // console.log("this.filteredData===",this.filteredData);
  //    }
  //   })
  //  }
   SaveAdvIntStocktr(){
     console.log("saveqty",this.saveqty());
     this.ngxService.start();
     if(this.saveqty()){
     if(Number(this.Objproduction.From_Cost_Cen_ID) == Number(this.Objproduction.To_Cost_Cen_ID) &&
       Number(this.Objproduction.From_godown_id) !== Number(this.Objproduction.To_godown_id)){
 
     const obj = {
       "SP_String": "SP_Adv_Order_IST",
       "Report_Name_String" : "Add Adv Order Internal Stock Transfer",
      "Json_Param_String": this.dataforSaveAdvIntStocktr(),
      "Json_1_String" : this.getProductionNo()
 
     }
     this.GlobalAPI.postData(obj).subscribe((data:any)=>{
     //  console.log(data);
       var tempID = data[0].Column1;
       //this.Objproduction.Doc_No = data[0].Column1;
       if(data[0].Column1){
        this.ngxService.stop();
         this.compacctToast.clear();
         const mgs = this.buttonname === "Save" ? "Saved" : "Updated";
         this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Internal Stock Transfer  " + tempID,
          detail: "Succesfully  " + mgs
        });
        // if (this.buttonname == "Save") {
        // this.saveNprintStock();
        // }
        this.clearData();
        this.displaysavepopup = false;
        this.SelectedProduction = [];
        this.ProductionFilter = [];
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
     }
     else{
       this.displaysavepopup = false;
       this.ngxService.stop();
       this.compacctToast.clear();
       this.compacctToast.add({
         key: "compacct-toast",
         severity: "error",
         summary: "Warn Message",
         detail: "can't use same stock point with respect to same cost centre"
       });
     }
   }
   else {
     this.editFlag = true;
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
   getProductionNo(){
     if(this.SelectedProduction.length) {
       let Rarr =[]
       this.SelectedProduction.forEach(el => {
         if(el){
           const Dobj = {
             Production_No : el
             }
             Rarr.push(Dobj)
         }
 
     });
       console.log("Table Data ===", Rarr)
       return Rarr.length ? JSON.stringify(Rarr) : '';
     }
   }
   dataforSaveAdvIntStocktr(){
     // console.log(this.DateService.dateConvert(new Date(this.myDate)))
      this.Objproduction.Doc_Date = this.DateService.dateConvert(new Date(this.todayDate));
     if(this.BackUpProductNamelList.length) {
       let tempArr =[]
       this.BackUpProductNamelList.forEach(item => {
         if(item.del_Qty && Number(item.del_Qty) !== 0){
         const obj = {
             Product_Type_ID : item.Product_Type_ID,
             Product_ID : item.Product_ID,
             Product_Description : item.Product_Description,
             Batch_NO : item.Batch_NO,
             Qty : item.del_Qty,
             Doc_No : this.Objproduction.Doc_No ?  this.Objproduction.Doc_No : "A",
             Doc_Date : this.Objproduction.Doc_Date,
             Product_Type : this.Objproduction.Product_Type_ID,
             Brand_ID : this.Objproduction.Brand_ID,
             UOM : "PCS",
             Remarks : "test",
             From_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
             From_godown_id : this.Objproduction.From_godown_id ? this.Objproduction.From_godown_id : 0,
             To_Cost_Cen_ID : this.Objproduction.To_Cost_Cen_ID,
             To_godown_id : this.Objproduction.To_godown_id,
             User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
             Production_Date : this.DateService.dateConvert(new Date(this.ProDate)),
             Adv_Order_No : item.Adv_Order_No
         }
         tempArr.push(obj)
       }
       });
      // console.log("Save Data ===", tempArr)
       return JSON.stringify(tempArr);
 
     }
   }
  //  saveNprintStock(){
  //    if (this.Objproduction.Doc_No) {
  //      window.open("/Report/Crystal_Files/K4C/K4C_Internal_Stock_Transfer.aspx?DocNo=" + this.Objproduction.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
  //   );
  //    }
  //  }
   //CREATE END
 
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
   SearchAdvIntStocktr(){
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
       "SP_String": "SP_Adv_Order_IST",
       "Report_Name_String": "Browse Internal Stock transfer",
       "Json_Param_String": JSON.stringify([tempobj])
     }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.Searchedlist = data;
        //this.BackupSearchedlist = data;
        //this.GetDistinct();
       // console.log('search list=====',this.Searchedlist)
        this.seachSpinner = false;
      })
   }
 
  //  EditIntStock(DocNo){
  //   // console.log("editmaster ==",DocNo);
  //    this.clearData();
  //    if(DocNo.Doc_No){
  //    this.Objproduction.Doc_No = DocNo.Doc_No;
  //    this.tabIndexToView = 1;
  //    this.ProductNamelList = [];
  //    this.items = ["BROWSE", "UPDATE"];
  //    this.buttonname = "Update";
  //    // console.log("this.EditDoc_No ==", this.Objproduction.Doc_No);
  //    this.GetEditIntStock(this.Objproduction.Doc_No);
  //    this.getProNoForEdit(this.Objproduction.Doc_No);
  //    }
  //  }
  //  GetEditIntStock(Doc_No){
  //    this.ProductionFormSubmitted = false;
  //      const obj = {
  //        "SP_String": "SP_Production_Voucher",
  //        "Report_Name_String": "Get Internal Stock transfer Details For Edit",
  //        "Json_Param_String": JSON.stringify([{Doc_No : this.Objproduction.Doc_No}])
 
  //      }
  //      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //        console.log("Edit Data From API",data);
  //      this.editList = data;
  //         this.Objproduction.Brand_ID = data[0].Brand_ID;
  //           this.Objproduction.Product_Type_ID = data[0].Product_Type_ID;
  //           this.GetProductType();
  //           //this.GetProductsName();
  //           this.Objproduction.From_Cost_Cen_ID = data[0].From_Cost_Cen_ID;
  //           this.Objproduction.From_godown_id = data[0].From_godown_id; //? data[0].From_godown_id : undefined;
  //           this.Objproduction.To_Cost_Cen_ID = data[0].To_Cost_Cen_ID;
  //           //this.GetToGodown();
  //           this.Objproduction.To_godown_id = data[0].To_godown_id;
  //           //this.Objproduction.Doc_Date = data[0].Doc_Date;
  //           //this.Datevalue = data[0].Doc_Date;
  //           this.ProDate = this.DateService.dateConvert(new Date(data[0].Production_Date));
  //           this.Datevalue = this.DateService.dateConvert(new Date(data[0].Doc_Date));
  //          //  this.minDate =  new Date(data[0].Doc_Date);
  //          //  let tempDate:Date =  new Date(data[0].Doc_Date)
  //          // console.log("minDate==", this.minDate)
  //          // const tempTimeBill =  tempDate.setDate(tempDate.getDate() + 1);
  //          // this.maxDate = new Date(tempTimeBill);
  //           data.forEach(element => {
  //             const  productObj = {
  //              Product_ID : element.Product_ID,
  //              Product_Description : element.Product_Description,
  //              //Batch_No : (this.Objproduction.Process_ID != '1' ? element.Batch_NO : '-'),
  //              batch_Qty : element.Batch_Qty,
  //              Batch_No : element.Batch_NO,
  //              Transfer_Qty :  Number(element.Qty),
  //              Product_Type : element.Product_Type,
  //              Product_Type_ID : element.Product_Type_ID
  //            };
  //             this.ProductNamelList.push(productObj);
  //        });
  //        // console.log("this.editList  ===",data);
  //        this.BackUpProductNamelList = [...this.ProductNamelList];
  //        //this.backUpproductList = this.productList;
  //        this.BackupProductionList = this.ProductionList;
  //        this.GetProductiondist();
  //      })
  //  }
  //  getProNoForEdit(Doc_No){
  //    const obj = {
  //      "SP_String": "SP_Production_Voucher",
  //      "Report_Name_String": "Get PV NO For IST Edit",
  //      "Json_Param_String": JSON.stringify([{Doc_No : this.Objproduction.Doc_No}])
  //    }
  //    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //      this.editProNoList = data;
  //      this.GetProductiondist();
  //    })
  //  }
  //  GetProductiondist(){
  //    let DIndentBy = [];
  //    this.ProductionFilter = [];
  //    this.SelectedProduction =[];
  //    //this.SelectedDistOrderBy1 = [];
  //    this.editProNoList.forEach((item) => {
  //      if (DIndentBy.indexOf(item.Production_No) === -1) {
  //        DIndentBy.push(item.Production_No);
  //         this.ProductionFilter.push({ label: item.Production_No , value: item.Production_No });
  //         this.SelectedProduction.push(item.Production_No);
  //        console.log("this.TimerangeFilter", this.ProductionFilter);
  //      }
  //    });
  //  }
   PrintStock(obj){
     if (obj.Doc_No) {
       window.open("/Report/Crystal_Files/K4C/K4C_Internal_Stock_Transfer.aspx?DocNo=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
 
       );
     }
   }
   DeleteIntStocktr(docNo){
     this.Objproduction.Doc_No = undefined ;
     if(docNo.Doc_No){
     this.Objproduction.Doc_No = docNo.Doc_No;
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
       Doc_No : this.Objproduction.Doc_No,
       User_ID : this.$CompacctAPI.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String" : "SP_Production_Voucher",
      "Report_Name_String" : "Delete Internal Stock transfer",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //  console.log(data);
      if(data[0].Column1 === "Done") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Doc_No : " + this.Objproduction.Doc_No,
          detail:  "Succesfully Delete"
        });
        this.SearchAdvIntStocktr();
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
   clearData() {
     //this.Objproduction = new production ();
     this.ObjproductAdd = new productAdd();
     this.Objproduction.Brand_ID = undefined;
     this.Objproduction.Product_Type_ID = undefined;
     //const obj = {...this.Objproduction};
     this.Objproduction.Doc_No = undefined;
     this.editList = [];
     this.ProductTypeList = [];
     //this.Objproduction.To_godown_id = undefined;
     this.Objproduction.From_Cost_Cen_ID = this.Fcostcenlist.length ? this.Fcostcenlist[0].Cost_Cen_ID : undefined;
     this.GetFromGodown();
     this.Objproduction.From_godown_id = this.FromGodownList.length ? this.FromGodownList[0].godown_id : undefined;
     this.Objproduction.To_Cost_Cen_ID = this.Tocostcenlist.length ? this.Tocostcenlist[0].Cost_Cen_ID : undefined;
     this.GetToGodown();
     this.Objproduction.To_godown_id = this.ToGodownList.length ? this.ToGodownList[0].godown_id : undefined;
     this.GetDate();
     this.ProductNamelList = [];
     this.BatchNoList = [];
     this.AddProDetails = [];
     this.editFlag = false;
     // this.inputBoxDisabled = false;
     // this.ProductionFormSubmitted = false;
      this.AddProDetailsFormSubmitted = false;
      this.AdvIntStockFormSubmitted = false;
      this.items = ["BROWSE", "CREATE"];
      this.buttonname = "Save";
      this.todayDate = new Date();
      this.ProDate = this.DateService.dateConvert(new Date(this.ProDate));
      this.GetProDate();
      this.ngxService.stop();
     }
     qtyChqEdit(col){
       this.editFlag = false;
       console.log("col",col);
       if(col.Transfer_Qty){
         if(col.Transfer_Qty <=  col.batch_Qty){
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
      for(let i = 0; i < this.ProductNamelList.length ; i++){
       if(Number(this.ProductNamelList[i].batch_Qty) <  Number(this.ProductNamelList[i].Transfer_Qty)){
         flag = false;
         break;
       }
      }
      return flag;
     }

}

class production {
  Doc_No : string;
  Brand_ID : string;;
  Product_Type_ID : number = undefined;

  From_godown_id : string;;
  To_godown_id : string;;
  To_Cost_Cen_ID : string;;
  From_Cost_Cen_ID : string;;
  Doc_Date : string;
  User_ID : string;;
  Remarks : any;
  Production_Date : string;
 }
 class productAdd {
  //ID : string;
  Product_Name : string;
  Batch_No : string;
  Stock_Qty : string;
  Product_ID : string;
  Product_Description : string;
 }
 class Browse {
   start_date : Date ;
   end_date : Date;
   //Cost_Cen_ID : 0;
   //Product_Type_ID : 0;


 }
