import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload, Terminal } from "primeng/primeng";
import { data } from "jquery";
import { Console } from "console";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: 'app-rdb',
  templateUrl: './rdb.component.html',
  styleUrls: ['./rdb.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class RdbComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = "Create";
  Spinner = false;
  can_popup = false;
  items = [];
  RDBFormSubmit = false;
  RDBFormSubmit2 = false
  AllProductList = [];
  act_popup = false;
  menuList = [];
  userList = [];
  PoOrderList = [];
  ObjRdb:RDB = new RDB();
  ObjRdb1:RDB1 = new RDB1();
  objRdb2:RDB2 = new RDB2();
  ObjBrowse : Browse = new Browse ();
  CostHeadID = undefined;
  
  RDB_Date = new Date();
  SE_Date = new Date();
  PO_Doc_Date = new Date();
 
  Allproduct = [];
  CostCenterList = [];
  AllSupplierList = [];
  SupplierList = [];
  AllPoOrderList = [];
  CostList = [];
  AllStockList = [];
  StockList = [];
  rdbListAdd = [];
  AllProductDetails = [];
  ProductList = [];
  RDBListAdd = [];
  podatedisabled = false;
  RDBNo = undefined;
  seachSpinner = false;
  dateDis = true;
  initDate = [];
  companyList = [];
  RDBSearchFormSubmitted = false;
   constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService,
    private $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "RDB",
      Link: " Material Management -> Inward -> RDB"
    });
    this.getCostCenter();
    this.getSupplier();
    this.getcompany();
    this.initDate = [new Date(),new Date()]
   }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){
    this.dateDis = true;
    this.RDBFormSubmit = false;
    this.ObjRdb = new RDB();
    this.PO_Doc_Date = new Date();
    this.RDB_Date = new Date();
    this.SE_Date = new Date();
    this.ObjRdb = new RDB();
    this.RDBListAdd = [];
    this.Spinner = false;
    this.objRdb2 = new RDB2()
    this.RDBFormSubmit2 = false;
    this.RDB_Date = new Date();
    this.SE_Date = new Date();
    this.PO_Doc_Date = new Date();
    this.ObjRdb1 = new RDB1()
    this.seachSpinner = false;
    this.ObjRdb.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    this.ObjBrowse.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    this.ObjRdb.Cost_Cen_ID  = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  }
  GetAllData(valid){
    this.ngxService.start();
    this.RDBSearchFormSubmitted = true;
    const From_date = this.ObjBrowse.From_date
       ? this.DateService.dateConvert(new Date(this.ObjBrowse.From_date))
       : this.DateService.dateConvert(new Date());
     const To_date = this.ObjBrowse.To_date
       ? this.DateService.dateConvert(new Date(this.ObjBrowse.To_date))
       : this.DateService.dateConvert(new Date());
       const tempobj = {
        From_date : From_date,
        To_date : To_date,
        Company_ID : this.ObjBrowse.Company_ID
      }
      if (valid) {
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
      "Report_Name_String":"Browse_BL_Txn_Purchase_Challan_RDB",
      "Json_Param_String": JSON.stringify([tempobj])
     }
     this.GlobalAPI.getData(obj)
      .subscribe((data: any) => {
        this.AllProductList = data;
        this.ngxService.stop();
        console.log("AllProductList=",this.AllProductList);
        this.RDBSearchFormSubmitted = false;
      });
    }
    else {
      this.ngxService.stop();
    }
  }
  getcompany(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Dropdown_Company",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.companyList = data
     console.log("companyList",this.companyList)
     this.ObjRdb.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
     this.ObjBrowse.Company_ID = this.companyList.length === 1 ? this.companyList[0].Company_ID : undefined;
    })
  }
  getSupplier(){
    this.AllSupplierList = [];
    this.SupplierList = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
      "Report_Name_String":"Get_Sub_Ledger",
     }
     this.GlobalAPI.getData(obj)
      .subscribe((data: any) => {
        this.AllSupplierList = data;
        console.log("AllSupplierList=",this.AllSupplierList);
        this.AllSupplierList.forEach((el : any)=>{
          this.SupplierList.push({
            label : el.Sub_Ledger_Name,
            value : el.Sub_Ledger_ID
          });
        });
      });
  }
  getPoOrder(Sub_Ledger_ID){
    this.PoOrderList=[];
    console.log("ObjRdb.Sub_Ledger_ID",this.ObjRdb.Sub_Ledger_ID);
    if(Sub_Ledger_ID){
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
      "Report_Name_String":"Get_Pending_PO_Order_Nos",
      "Json_Param_String": JSON.stringify([{Sub_Ledger_ID: Sub_Ledger_ID}]) 
     }
     this.GlobalAPI.getData(obj)
     .subscribe((data : any)=>
     {
       this.AllPoOrderList = data;
       console.log('AllPoOrderList=',this.AllPoOrderList);
       this.AllPoOrderList.forEach((el : any)=>
       {
         this.PoOrderList.push({
           label: el.Doc_No,
           value: el.Doc_No
         })
       });
       
     });
    }
    else {
      this.ObjRdb.PO_Doc_No = undefined;
    }
   
  }
  getProductDetails(PO_Doc_No){
    if(PO_Doc_No){
      this.ProductList = [];
    const PoFilter = this.AllPoOrderList.filter(el=> el.Doc_No.toString() === this.ObjRdb.PO_Doc_No.toString())
     this.dateDis = false;
    this.PO_Doc_Date = PoFilter.length ? new Date(PoFilter[0].Doc_Date) : new Date();
      const obj = {
        "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
        "Report_Name_String":"Get_product_Details",
        "Json_Param_String": JSON.stringify([{Doc_No: PO_Doc_No}]) 
       }
       this.GlobalAPI.getData(obj)
       .subscribe((data : any)=>
       {
         
         this.Allproduct = data;
         console.log('Productdetails=',this.Allproduct);
         this.Allproduct.forEach((el : any)=>
         {
           this.ProductList.push({
             label : el.Product_Name,
             value : el.Product_ID
           });
         });
       });
    }
    else {
      this.dateDis = true;
    }
   
  }
  getCostCenter(){
    this.CostCenterList=[];
    this.CostList=[];
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
      "Report_Name_String":"Get_Cost_Center",
     }
     this.GlobalAPI.getData(obj)
     .subscribe((data : any)=>
     {
       this.CostCenterList = data;
       console.log('CostCenterList=',this.CostCenterList);
       this.CostCenterList.forEach((el : any)=>
       {
         this.CostList.push({
           label : el.Cost_Cen_Name,
           value : el.Cost_Cen_ID
         });
         this.ObjRdb.Cost_Cen_ID  = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
       });
       this.getStockPoint(this.ObjRdb.Cost_Cen_ID);
     });
  }
  getStockPoint(Cost_Cen_ID){
    this.AllStockList=[];
    this.StockList = [];
    if(Cost_Cen_ID){
      const obj = {
        "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
        "Report_Name_String":"Get_Cost_Center_Godown",
        "Json_Param_String": JSON.stringify([{Cost_Cen_ID: Cost_Cen_ID}]) 
       }
       this.GlobalAPI.getData(obj)
       .subscribe((data : any)=>
       {
         this.AllStockList = data;
         console.log('AllStockList=',this.AllStockList);
         this.AllStockList.forEach((el : any)=>
         {
            this.StockList.push({
              label : el.godown_name,
              value : el.godown_id
            });
         });
         this.ObjRdb.godown_id = this.AllStockList.length === 1 ? this.AllStockList[0].godown_id : undefined;
       });
    }
    else{
      this.ObjRdb.godown_id = undefined;
    }
  
  }
//  SaveTabCommon(valid, value){
//      if(value === 'add')
//     {
//       this.RDBFormSubmit = true;
//       if(valid)
//       {
//         if (Number(this.ObjRdb.Received_Qty) && Number(this.ObjRdb.Received_Qty) <= Number(this.ObjRdb.Challan_Qty)){
//          const productFilter = this.Allproduct.filter(el=> Number(el.Product_ID) === Number(this.ObjRdb.Product_ID))[0];
//          const subLedgerFilter = this.AllSupplierList.filter(el=> Number(el.Sub_Ledger_ID) === Number(this.ObjRdb.Sub_Ledger_ID))[0]
//          console.log("productFilter",productFilter);
//          if(Object.keys(productFilter).length){
//           var amount = Number(Number(this.ObjRdb.Received_Qty) * Number(productFilter.Rate)).toFixed(2);
//           var taxsgstcgst =  (Number(Number(amount) * Number(productFilter.GST_Percentage)) / 100).toFixed(2);
//           var totalamount = (Number(amount) + Number(taxsgstcgst)).toFixed(2);
//           var productObj = {
//             RDB_Date : this.RDB_Date ? this.DateService.dateConvert(this.RDB_Date) : new Date(),
//             Sub_Ledger_ID	: Number(this.ObjRdb.Sub_Ledger_ID),
//             Cost_Cen_ID	: Number(this.ObjRdb.Cost_Cen_ID),
//             godown_id : Number(this.ObjRdb.godown_id),
//             SE_No : this.ObjRdb.SE_No,
//             SE_Date : this.SE_Date ? this.DateService.dateConvert(this.SE_Date) : new Date(),
//             PO_Doc_No : this.ObjRdb.PO_Doc_No,
//             PO_Doc_Date : this.PO_Doc_Date ? this.DateService.dateConvert(this.PO_Doc_Date) : new Date(),
//             Mode_Of_transport : this.ObjRdb.Mode_Of_transport,
//             LR_No_Date : this.ObjRdb.LR_No_Date,
//             Vehicle_No : this.ObjRdb.Vehicle_No,
//             Product_ID : Number(this.ObjRdb.Product_ID),
//             Product_Name : productFilter.Product_Name,
//             HSN_Code : productFilter.HSN_Code,
//             UOM : productFilter.UOM,
//             Challan_Qty : Number(this.ObjRdb.Challan_Qty),
//             Received_Qty : Number(this.ObjRdb.Received_Qty),
//             Rate : productFilter.Rate,
//             Taxable_Value :  Number(amount).toFixed(2),
//             Tax_Percentage : productFilter.GST_Percentage,
//             Total_Tax_Amount : Number(taxsgstcgst).toFixed(2),
//             Total_Amount : Number(totalamount).toFixed(2),
//             Created_By : this.commonApi.CompacctCookies.User_ID,
//             Status : "PENDING"
//           };
//           this.RDBListAdd.push(productObj);
//           console.log("Product Submit",this.RDBListAdd);
//           this.RDBFormSubmit = false;
//           this.ObjRdb1 = new RDB1();
//           this.PO_Doc_Date = new Date();
//           this.RDB_Date = new Date();
//           this.SE_Date = new Date();
//           this.dateDis = true;
//          }
//        }
//         else {
//           this.compacctToast.clear();
//           this.compacctToast.add({
//             key: "compacct-toast",
//             severity: "error",
//             summary: "Warn Message",
//             detail: "Received Qty is more than Challan Qty "
//           });
//         }
//       }
//     }
//     else if(value === 'save'){
//       this.RDBFormSubmit2 = true;
//       if(valid){
//         this.Spinner = true;
//         this.ngxService.start();
//         let saveTempData = [];
//         this.RDBFormSubmit2 = true;
//         if(this.RDBListAdd.length){
//           console.log("this.ObjRdb.Sub_Ledger_ID",this.ObjRdb.Sub_Ledger_ID)
//            const CostCenterFilter = this.CostCenterList.filter(el=> Number(el.Cost_Cen_ID) === Number(this.ObjRdb.Cost_Cen_ID))
//           this.RDBListAdd.forEach(el=>{
//             saveTempData.push({
//               RDB_Date : el.RDB_Date,
//               Sub_Ledger_ID	:el.Sub_Ledger_ID,
//               Cost_Cen_ID	:el.Cost_Cen_ID,
//               godown_id : el.godown_id,
//               SE_No :el.SE_No,
//               SE_Date :el.SE_Date,
//               PO_Doc_No :el.PO_Doc_No,
//               PO_Doc_Date : el.PO_Doc_Date,
//               Mode_Of_transport : el.Mode_Of_transport,
//               LR_No_Date :el.LR_No_Date,
//               Vehicle_No : el.Vehicle_No,
//               Product_ID :el.Product_ID,
//               HSN_Code : el.HSN_Code,
//               UOM :el.UOM,
//               Challan_Qty :el.Challan_Qty,
//               Received_Qty :el.Received_Qty,
//               Rate :el.Rate,
//               Taxable_Value :el.Taxable_Value,
//               Tax_Percentage :el.Tax_Percentage,
//               Total_Tax_Amount :el.Total_Tax_Amount,
//               Total_Amount :el.Total_Amount,
//               Created_By :el.Created_By,
//               Status :el.Status,  
//               Remarks: this.objRdb2.Remarks
//               })
//           })
//           console.log("Save Data",saveTempData);
//           const obj = {
//             "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
//             "Report_Name_String":"Create_BL_Txn_Purchase_Challan_RDB",
//             "Json_Param_String": JSON.stringify(saveTempData) 
//            }
//            this.GlobalAPI.getData(obj)
//            .subscribe((data : any)=>
//            {
//             console.log(data);
//             if(data[0].Column1.toString()){
//               this.ObjRdb = new RDB();
//               this.RDBListAdd = [];
//               this.Spinner = false;
//               this.objRdb2 = new RDB2()
//               this.RDBFormSubmit2 = false;
//               this.RDB_Date = new Date();
//               this.SE_Date = new Date();
//               this.PO_Doc_Date = new Date();
//               this.GetAllData();
//               this.ngxService.stop();
//               this.compacctToast.clear();
//                this.compacctToast.add({
//                key: "compacct-toast",
//                severity: "success",
//                summary: "RDB NO  " + data[0].Column1,
//                detail: "Succesfully Saved" //+ mgs
//              });
//             }
//             else {
//               this.compacctToast.clear();
//               this.compacctToast.add({
//                 key: "compacct-toast",
//                 severity: "error",
//                 summary: "Warn Message",
//                 detail: "Error Occured "
//               })
//             }
//            })
         
//         }
//       }
//     }

//   }
  Add(valid){
    this.RDBFormSubmit = true;
    if(valid){
      if (Number(this.ObjRdb1.Received_Qty) && Number(this.ObjRdb1.Received_Qty) <= Number(this.ObjRdb1.Challan_Qty)){
        const productFilter = this.Allproduct.filter(el=> Number(el.Product_ID) === Number(this.ObjRdb1.Product_ID))[0];
        const subLedgerFilter = this.AllSupplierList.filter(el=> Number(el.Sub_Ledger_ID) === Number(this.ObjRdb.Sub_Ledger_ID))[0]
        console.log("productFilter",productFilter);
        if(Object.keys(productFilter).length){
        var amount = Number(Number(this.ObjRdb1.Received_Qty) * Number(productFilter.Rate)).toFixed(2);
        var taxsgstcgst =  (Number(Number(amount) * Number(productFilter.GST_Percentage)) / 100).toFixed(2);
        var totalamount = (Number(amount) + Number(taxsgstcgst)).toFixed(2);
        var productObj = {
                    // RDB_Date : this.RDB_Date ? this.DateService.dateConvert(this.RDB_Date) : new Date(),
                    // Sub_Ledger_ID	: Number(this.ObjRdb.Sub_Ledger_ID),
                    // Cost_Cen_ID	: Number(this.ObjRdb.Cost_Cen_ID),
                    // godown_id : Number(this.ObjRdb.godown_id),
                    // SE_No : this.ObjRdb.SE_No,
                    // SE_Date : this.SE_Date ? this.DateService.dateConvert(this.SE_Date) : new Date(),
                    // PO_Doc_No : this.ObjRdb.PO_Doc_No,
                    // PO_Doc_Date : this.PO_Doc_Date ? this.DateService.dateConvert(this.PO_Doc_Date) : new Date(),
                    // Mode_Of_transport : this.ObjRdb.Mode_Of_transport,
                    // LR_No_Date : this.ObjRdb.LR_No_Date,
                    // Vehicle_No : this.ObjRdb.Vehicle_No,
                    Product_ID : Number(this.ObjRdb1.Product_ID),
                    Product_Name : productFilter.Product_Name,
                    HSN_Code : productFilter.HSN_Code,
                    UOM : productFilter.UOM,
                    Challan_Qty : Number(this.ObjRdb1.Challan_Qty),
                    Received_Qty : Number(this.ObjRdb1.Received_Qty),
                    Rate : productFilter.Rate,
                    Taxable_Value :  Number(amount).toFixed(2),
                    Tax_Percentage : productFilter.GST_Percentage,
                    Total_Tax_Amount : Number(taxsgstcgst).toFixed(2),
                    Total_Amount : Number(totalamount).toFixed(2)
        };
            this.RDBListAdd.push(productObj);
            console.log("Product Submit",this.RDBListAdd);
            this.RDBFormSubmit = false;
            this.ObjRdb1 = new RDB1();
            // this.PO_Doc_Date = new Date();
            // this.RDB_Date = new Date();
            // this.SE_Date = new Date();
            this.dateDis = true;
        }
        }
        else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Received Qty is more than Challan Qty "
          });
        }
  }
  }
  delete(index) {
    this.RDBListAdd.splice(index,1)

  }
  DataForSaveProduct(){
    // console.log(this.DateService.dateConvert(new Date(this.myDate)))
    if(this.RDBListAdd.length) {
      let tempArr =[]
      this.RDBListAdd.forEach(item => {
        const obj = {
            Product_ID : item.Product_ID,
            //Product_Description : item.Product_Description,
            HSN_Code : item.HSN_Code,
            UOM : item.UOM,
            Challan_Qty : Number(item.Challan_Qty),
            Received_Qty : Number(item.Received_Qty),
            Rate : Number(item.Rate),
            Taxable_Value : Number(item.Taxable_Value).toFixed(2),
            Tax_Percentage : item.Tax_Percentage,
            Total_Tax_Amount : Number(item.Total_Tax_Amount).toFixed(2),
            Total_Amount : Number(item.Total_Amount).toFixed(2),
            Remarks : item.Remarks,

            RDB_Date : this.RDB_Date ? this.DateService.dateConvert(this.RDB_Date) : new Date(),
            Company_ID : this.ObjRdb.Company_ID,
            Sub_Ledger_ID	: Number(this.ObjRdb.Sub_Ledger_ID),
            Cost_Cen_ID	: Number(this.ObjRdb.Cost_Cen_ID),
            godown_id : Number(this.ObjRdb.godown_id),
            SE_No : this.ObjRdb.SE_No,
            SE_Date : this.SE_Date ? this.DateService.dateConvert(this.SE_Date) : new Date(),
            PO_Doc_No : this.ObjRdb.PO_Doc_No,
            PO_Doc_Date : this.PO_Doc_Date ? this.DateService.dateConvert(this.PO_Doc_Date) : new Date(),
            Mode_Of_transport : this.ObjRdb.Mode_Of_transport,
            LR_No_Date : this.ObjRdb.LR_No_Date,
            Vehicle_No : this.ObjRdb.Vehicle_No,
            Created_By : this.commonApi.CompacctCookies.User_ID,
            Status : "PENDING"
        }

        // const TempObj = {
        // UOM : "PCS",
        //   Doc_No : this.PPdoc_no ? this.PPdoc_no : "A",
        //   Doc_Date : this.DateService.dateConvert(new Date(this.todayDate)),
        //   User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
        //   Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        //   //Return_Reason_ID : this.ObjProductaddForm.Return_Reason_ID
        //   Autho_One_Staus : "NO"

        // }
        tempArr.push(obj);
      });
      console.log(tempArr)
      return JSON.stringify(tempArr);

    }
   }
   SaveRDB(valid){
    this.Spinner = true;
    this.RDBFormSubmit2 = true;
    this.ngxService.start();
    if (valid && this.RDBListAdd.length) {
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
      "Report_Name_String":"Create_BL_Txn_Purchase_Challan_RDB",
     "Json_Param_String": this.DataForSaveProduct()

    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log(data);
      var tempID = data[0].Column1;
      if(data[0].Column1){
        this.compacctToast.clear();
        //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Return_ID  " + tempID,
         detail: "Succesfully Saved" //+ mgs
       });
              this.ObjRdb = new RDB();
              this.ObjRdb1 = new RDB1();
              this.RDBListAdd = [];
              this.Spinner = false;
              this.objRdb2 = new RDB2()
              this.RDBFormSubmit2 = false;
              this.RDB_Date = new Date();
              this.SE_Date = new Date();
              this.PO_Doc_Date = new Date();
              this.GetAllData(true);
              this.ngxService.stop();
      } 
      else{
        this.Spinner = false;
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
      this.Spinner = false;
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
  Deleterdb(obj){
  if(obj.RDB_No){
    this.RDBNo = undefined;
    this.RDBNo = obj.RDB_No;
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
    if(this.RDBNo){
      const obj = {
        "SP_String": "SP_BL_Txn_Purchase_Challan_RDB_Entry",
        "Report_Name_String":"Delete_BL_Txn_Purchase_Challan_RDB",
        "Json_Param_String": JSON.stringify([{RDB_No: this.RDBNo,  Created_By : this.commonApi.CompacctCookies.User_ID}]) 
      }
      this.GlobalAPI.getData(obj)
      .subscribe((data : any)=>{
        console.log(data)
        if(data[0].Column1 === 'Done'){
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "RDB NO  " + this.RDBNo,
          detail: "Succesfully Delete" //+ mgs
        });
        this.RDBNo = undefined;
        this.GetAllData(true);
        }
      })
    
    }
  }
  commondelete(i,value){
    console.log("deleted");
    if(value === "data"){
    this.RDBListAdd.splice(i,1)
  }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  Printrdb(col){
   if(col.RDB_No){
    window.open("/Report/Crystal_Files/MICL/RDB_Challan.aspx?DocNo=" + col.RDB_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
   }
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.From_date = dateRangeObj[0];
      this.ObjBrowse.To_date = dateRangeObj[1];
    }
  }
  ProductDetailsChange(productID){
   if(productID){
    this.ObjRdb1.UOM = undefined;
    this.ObjRdb1.HSN_Code = undefined;
    this.ObjRdb1.PO_QTY = undefined;
    const productFilter = this.Allproduct.filter(el=> Number(el.Product_ID) === Number(productID))[0];
    console.log(productFilter);
    this.ObjRdb1.UOM = productFilter.UOM ? productFilter.UOM : " ";
    this.ObjRdb1.HSN_Code = productFilter.HSN_NO ? productFilter.HSN_NO : " ";
    this.ObjRdb1.PO_QTY = productFilter.Qty ? productFilter.Qty : " ";
    this.ObjRdb1.Challan_Qty = productFilter.Qty;
    this.ObjRdb1.Received_Qty = productFilter.Qty;
   }
   else {
     this.ObjRdb1.UOM = undefined;
     this.ObjRdb1.HSN_Code = undefined;
     this.ObjRdb1.PO_QTY = undefined;
   }
  }
  getTofix(number){
   return Number(Number(number).toFixed(2)).toFixed(2)
  }
}
  class RDB{
    Company_ID:any;
    Sub_Ledger_ID : any;
    Sub_Ledger_Name : any;
    Cost_Cen_ID : any;
    godown_id : any;
    RDB_Date : any;
    SE_No : any;
    Mode_Of_transport : any;
    LR_No_Date : any;
    Vehicle_No : any;
    PO_Doc_No : any;
    PO_Doc_Date : any;
    

  }
  class RDB1{
    Product_ID : any;
    UOM : any;
    HSN_Code : any;
    PO_QTY:any;
    Challan_Qty : any;
    Received_Qty : any;
  }

  class RDB2{
    Remarks:any;
  }
  class Browse {
    Company_ID : any;
    From_date : Date;
    To_date : Date;
   }

