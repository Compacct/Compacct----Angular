import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ɵConsole
} from "@angular/core";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { MessageService } from "primeng/api";
declare var $: any;
import * as moment from "moment";
import { CompacctGlobalUrlService } from "../../../../shared/compacct.global/global.service.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";

@Component({
  selector: "app-compacct-stocktransfer",
  templateUrl: "./compacct.stocktransfer.component.html",
  styleUrls: ["./compacct.stocktransfer.component.css"],
  providers: [MessageService]
})
export class StocktransferComponent implements OnInit {
  items = [];
  cols = [];
  menuList = [];
  buttonname = "Create";
  url = window["config"];
  tabIndexToView = 0;
  frozenCols = [];
  stockDocNo: string;
  DocDate: any;
  CNDate: any;
  // EWAY
  displayEwayModal = false;
  EwayFormSubmitted = false;
  EwayBillNo: String;
  EwayDate: any;
  EwayDateProto: any;
  EwayDocNo: String;

  // sTOCK
  SelectedProduct: any;
  SelectedSerialNo: any;

  StockBillList = [];

  StockSearchFormSubmitted = false;
  StockFormSubmitted = false;
  ProductInfoSubmitted = false;
  ProductInfoRequired = false;

  GodownRequire = false;
  Godowndisable = false;
  SerialShow = false;
  BatchShow = true;
  Batchdisabled = false;
  Batchdropdown = false;
  Qtydisable = false;
  Discount = false;
  saveSpinner = false;
  seachSpinner = false;

  ObjSearchStock: SearchStock = new SearchStock();
  ObjCostCenterFROM: FromCostcenter = new FromCostcenter();
  ObjCostCenterTO: ToCostcenter = new ToCostcenter();
  ObjStockBill: StockBill = new StockBill();
  ObjProductInfo: ProductInfo = new ProductInfo();
  ObjVoucherCommon: VoucherCommon = new VoucherCommon();
  ObjVoucherTopper: VoucherTopper = new VoucherTopper();

  ProductInfoList = [];
  ProductInfoListProto = [];
  ProductInfoListView = [];

  CostCenterList = [];
  CustmCostCenterList = [];
  SerialList = [];
  BatchList = [];
  GodownLists = [];
  GodownToList = [];

  ProductsList = [];
  NativeProductList = [];

  cities2: any;
  multiselectitems = [];
  aspxFileName:string;
  databaseName: any;

  BackUpBatchNoList: any =[];
  BatchQtyArray: any=[];
  newQty:any = [];
  btnDisable:boolean = false
  @ViewChild('docdate',{static:false}) docdateElem:ElementRef;

  AcceptStockModalTitle = undefined;
  AcceptStockModal = false;
  AcceptStockDocNo = undefined;
  AcceptProductList = [];
  tempQty = undefined;
  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
  ) {}
  selectedCities2: any;
  ngOnInit() {
    this.cols = [
      { field: "Doc_No", header: "Doc No" },
      { field: "Doc_Date", header: "Doc Date" },
      { field: "F_Cost_Cen_Name", header: "Issuing Cost Center" },
      { field: "T_Cost_Cen_Name", header: "To Cost Center" },
      { field: "Taxable_Amount", header: "Taxable Amount" },
      { field: "IGST_Input_Amt", header: "IGST" },
      { field: "CGST_Input_Amt", header: "CGST" },
      { field: "SGST_Input_Amt", header: "SGST" },
      { field: "Amount", header: "Total Value" },
      { field: "CN_No", header: "CN No." },
      { field: "CN_Date", header: "CN Date" },
      { field: "Dispatch_Through", header: "Dispatch Through" },
      { field: "Total_Issue", header: "Total Issue" },
      { field: "Total_Accept", header: "Total Accept" }
    ];
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.frozenCols = [{ field: "Doc No", header: "Doc_No" }];
    this.Header.pushHeader({
      Header: "Stock Transfer",
      Link: " Material Management -> Stock Transfer"
    });
    this.getDatabase();
    this.GetCostCenter();
    this.ObjSearchStock.F_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.getAspxForPrint();
    this.DocDate = moment(new Date(), "YYYY-MM-DD");
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearchStock.from_date = dateRangeObj[0];
      this.ObjSearchStock.to_date = dateRangeObj[1];
    }
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.ClearData();
  }
  ClearData() {
    this.ObjSearchStock = new SearchStock();
    this.ObjCostCenterFROM = new FromCostcenter();
    this.ObjCostCenterTO = new ToCostcenter();
    this.ObjStockBill = new StockBill();
    this.ObjProductInfo = new ProductInfo();

    this.ProductInfoListProto = [];
    this.ProductInfoListView = [];
    this.stockDocNo = undefined;
    this.SelectedProduct = undefined;
    this.GodownToList = [];
    this.GodownLists = [];
    this.SelectedSerialNo = [];
    this.SerialList = [];
    this.BatchList = [];
    this.StockSearchFormSubmitted = false;
    this.StockFormSubmitted = false;
    this.ProductInfoSubmitted = false;
    this.ProductInfoRequired = false;
    this.saveSpinner = false;
    this.seachSpinner = false;
    this.displayEwayModal = false;
    this.btnDisable = false;
    this.ObjSearchStock.F_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.StockCostCenterFromChange(
      this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    );
  }

  //  INITIAL DATA
  getDatabase(){
    this.$http
        .get("/Common/Get_Database_Name",
        {responseType: 'text'})
        .subscribe((data: any) => {
          this.databaseName = data;
          console.log(data)
        });
  }
  GetCostCenter() {
    this.$CompacctAPI.getCostCenter().subscribe((res: any) => { 
      const data =  res ? JSON.parse(res) : [];
      data.forEach(e=>{
        e['label'] = e.Cost_Cen_Name;
        e['value'] = e.Cost_Cen_ID;
      });
      this.CostCenterList = data.length ? data : [];      
      const costcen =  data.length ? data : [];
      const userdata = this.$CompacctAPI.CompacctCookies;
      if (userdata.User_Type === "U" && userdata.Company_Name !== "MANDKE HEARING SERVICES") {
        this.CustmCostCenterList = $.grep(costcen, function(value) {
          return value.Cost_Cen_ID === userdata.Cost_Cen_ID;
        });
      } else {
        this.CustmCostCenterList = costcen;
      }
      this.StockCostCenterFromChange(
        this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
      );
      this.GetProduct();
    });
  }
  GetProduct() {
    this.$CompacctAPI
      .getProductPurschableGST(0, this.DateService.dateConvert(new Date()))
      .subscribe((data: any) => {
        this.NativeProductList = data ? JSON.parse(data) : [];
        this.NativeProductList.forEach(el => {
          this.ProductsList.push({
            label: el.Product_Name,
            value: el.Product_ID
          });
        });
      });
  }
  StockCostCenterFromChange(costId) {
    this.ObjCostCenterFROM = new FromCostcenter();
    const List = this.CostCenterList.map(x => Object.assign({}, x));
    if (costId) {
      const Obj = $.grep(List, function(value) {
        return value.Cost_Cen_ID === parseFloat(costId);
      })[0];
      this.ObjCostCenterFROM.F_Cost_Cen_Address1 = Obj.Cost_Cen_Address1;
      this.ObjCostCenterFROM.F_Cost_Cen_Address2 = Obj.Cost_Cen_Address2;
      this.ObjCostCenterFROM.F_Cost_Cen_CST_NO = Obj.Cost_Cen_CST_NO;
      this.ObjCostCenterFROM.F_Cost_Cen_Country = Obj.Cost_Cen_Country;
      this.ObjCostCenterFROM.F_Cost_Cen_District = Obj.Cost_Cen_District;
      this.ObjCostCenterFROM.F_Cost_Cen_Email1 = Obj.Cost_Cen_Email1;
      this.ObjCostCenterFROM.F_Cost_Cen_GST_No = Obj.Cost_Cen_GST_No;
      this.ObjCostCenterFROM.F_Cost_Cen_ID = Obj.Cost_Cen_ID;
      this.ObjCostCenterFROM.F_Cost_Cen_Location = Obj.Cost_Cen_Location;
      this.ObjCostCenterFROM.F_Cost_Cen_Mobile = Obj.Cost_Cen_Mobile;
      this.ObjCostCenterFROM.F_Cost_Cen_Name = Obj.Cost_Cen_Name;
      this.ObjCostCenterFROM.F_Cost_Cen_PIN = Obj.Cost_Cen_PIN;
      this.ObjCostCenterFROM.F_Cost_Cen_Phone = Obj.Cost_Cen_Phone;
      this.ObjCostCenterFROM.F_Cost_Cen_State = Obj.Cost_Cen_State;
      this.ObjCostCenterFROM.F_Cost_Cen_VAT_CST = Obj.Cost_Cen_VAT_CST;
    }
  }
  StockCostCenterToChange(costId) {
    this.ObjCostCenterTO = new ToCostcenter();
    const List = this.CostCenterList.map(x => Object.assign({}, x));
    if (costId) {
      const Obj = $.grep(List, function(value) {
        return value.Cost_Cen_ID === parseFloat(costId);
      })[0];
      this.ObjCostCenterTO.T_Cost_Cen_Address1 = Obj.Cost_Cen_Address1;
      this.ObjCostCenterTO.T_Cost_Cen_Address2 = Obj.Cost_Cen_Address2;
      this.ObjCostCenterTO.T_Cost_Cen_CST_NO = Obj.Cost_Cen_CST_NO;
      this.ObjCostCenterTO.T_Cost_Cen_Country = Obj.Cost_Cen_Country;
      this.ObjCostCenterTO.T_Cost_Cen_District = Obj.Cost_Cen_District;
      this.ObjCostCenterTO.T_Cost_Cen_Email1 = Obj.Cost_Cen_Email1;
      this.ObjCostCenterTO.T_Cost_Cen_GST_No = Obj.Cost_Cen_GST_No;
      this.ObjCostCenterTO.T_Cost_Cen_ID = Obj.Cost_Cen_ID;
      this.ObjCostCenterTO.T_Cost_Cen_Location = Obj.Cost_Cen_Location;
      this.ObjCostCenterTO.T_Cost_Cen_Mobile = Obj.Cost_Cen_Mobile;
      this.ObjCostCenterTO.T_Cost_Cen_Name = Obj.Cost_Cen_Name;
      this.ObjCostCenterTO.T_Cost_Cen_PIN = Obj.Cost_Cen_PIN;
      this.ObjCostCenterTO.T_Cost_Cen_Phone = Obj.Cost_Cen_Phone;
      this.ObjCostCenterTO.T_Cost_Cen_State = Obj.Cost_Cen_State;
      this.ObjCostCenterTO.T_Cost_Cen_VAT_CST = Obj.Cost_Cen_VAT_CST;
      this.GetToGodown(this.ObjCostCenterTO.T_Cost_Cen_ID);
    }
  }
  GetCNdate(cnDate) {
    if (cnDate) {
      this.ObjStockBill.CN_Date = this.DateService.dateConvert(
        moment(cnDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetDocdate2(date){

    this.GetDocdate(date);
    const ctrl = this;
    setTimeout(function(){
      ctrl.docdateElem.nativeElement.value = moment(new Date(date)).format("YYYY-MM-DD");
    },200)
    this.DocDate = new Date(date);
  }
  GetDocdate(docDate) {
    if (docDate) {
      this.ObjStockBill.Doc_Date = this.DateService.dateConvert(
        moment(docDate, "YYYY-MM-DD")["_d"]
      );
    }
  }

  //  CHANGE EVENTS
  ProductChange(productID) {
    this.ObjProductInfo = new ProductInfo();
    this.SerialList = [];
    this.BatchList = [];
    this.GodownLists = [];
    this.Godowndisable = false;
    this.GodownRequire = true;
    this.tempQty = undefined;
    const List = this.NativeProductList.map(x => Object.assign({}, x));
    if (productID) {
      if (this.ObjCostCenterFROM.F_Cost_Cen_ID) {
        const obj = $.grep(List, function(value) {
          return value.Product_ID === parseFloat(productID);
        })[0];


        this.ObjProductInfo.Product_ID = obj.Product_ID;
        this.GetGodown(obj.Product_ID);
        this.ObjProductInfo.Product_Name = obj.Product_Name;
        this.ObjProductInfo.UOM = obj.UOM;
        // this.AltUOM = obj.Alt_UOM;
        // this.UOM = obj.UOM;

        this.ObjProductInfo.HSL_No = obj.HSN_No;
        this.ObjProductInfo.Product_Specification = obj.Product_Spec;
        this.ObjProductInfo.CGST_Rate = obj.CGST_Rate;
        this.ObjProductInfo.SGST_Rate = obj.SGST_Rate;
        this.ObjProductInfo.IGST_Rate = obj.IGST_Rate;
        this.ObjProductInfo.Is_Service = obj.Is_Service;

        this.ObjProductInfo.Discount_Ledger_ID = obj.Discount_Ledger_ID;
        this.ObjProductInfo.Product_Name = obj.Product_Name;
        this.ObjProductInfo.Ledger_ID = obj.Ledger_ID;
        this.ObjProductInfo.Cat_ID = obj.Cat_ID;
        this.ObjProductInfo.Cat_Name = obj.Cat_Name;
        this.ObjProductInfo.IGST_Input_Ledger_ID = obj.IGST_Input_Ledger_ID;
        this.ObjProductInfo.IGST_Input_Rate = obj.IGST_Rate;

        this.ObjProductInfo.IGST_Output_Ledger_ID = obj.IGST_Output_Ledger_ID;
        this.ObjProductInfo.IGST_Output_Rate = obj.IGST_Rate;

        this.ObjProductInfo.CGST_Input_Ledger_ID = obj.CGST_Input_Ledger_ID;
        this.ObjProductInfo.CGST_Input_Rate = obj.CGST_Rate;

        this.ObjProductInfo.CGST_Output_Ledger_ID = obj.CGST_Output_Ledger_ID;
        this.ObjProductInfo.CGST_Output_Rate = obj.CGST_Rate;

        this.ObjProductInfo.SGST_Input_Ledger_Id = obj.SGST_Input_Ledger_Id;
        this.ObjProductInfo.SGST_Input_Rate = obj.SGST_Rate;

        this.ObjProductInfo.SGST_Output_Ledger_ID = obj.SGST_Output_Ledger_ID;
        this.ObjProductInfo.SGST_Output_Rate = obj.SGST_Rate;
        // ctrl.UOM = obj.UOM;
        if (parseFloat(obj.Discount_Ledger_ID) === 0) {
          this.Discount = true;
        } else {
          this.Discount = false;
        }
        if (obj.Product_Serial === false) {
          this.ObjProductInfo.MRP = 0;
          this.ObjProductInfo.Rate = 0;
          this.ObjProductInfo.Amount = 0;
          this.ObjProductInfo.Taxable_Amount = 0;
          this.ObjProductInfo.Serial_No = undefined;
          this.BatchShow = true;
          this.Batchdisabled = false;
          this.SerialShow = false;
          this.ObjProductInfo.Qty = undefined;
          this.Qtydisable = false;
        } else {
          this.ObjProductInfo.MRP = 0;
          this.ObjProductInfo.Rate = 0;
          this.ObjProductInfo.Amount = 0;
          this.ObjProductInfo.Taxable_Amount = 0;
          this.ObjProductInfo.Serial_No = undefined;
          this.SerialShow = true;
          this.BatchShow = false;
          this.Batchdisabled = true;
          this.ObjProductInfo.Qty = 1;
          this.Qtydisable = true;
          this.Batchdropdown = false;
          // this.ObjProductInfo.UOM = ctrl.UOM + ' ' + '(' + 0 + ' ' + 'Rolls' + ')';
        }
        if(obj.Is_Service && this.databaseName === 'GN_SHCPL_Patna'){
          console.log(obj)
          this.GodownRequire = false;
          this.Godowndisable = true;
          this.Batchdisabled = true;
        }
        
        if(this.databaseName === 'BSHPL'){
          this.ObjProductInfo.Rate = obj.MRP_ST;
          this.CalculateAmount();
        }
      } else {
        this.SelectedProduct = "";
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Please Select From Cost Center."
        });
      }
    }
  }
  GetGodown(productID) {
    this.GodownLists = [];
    if (productID && this.ObjCostCenterFROM.F_Cost_Cen_ID) {
      const presentQty = this.getSumOfQtyWithSameProduct(productID);
      const obj = new HttpParams()
        .set("ProductID", productID)
        .set("AO_No", "0")
        .set("PresentQty", presentQty.toString())
        .set("CostCenID", this.ObjCostCenterFROM.F_Cost_Cen_ID.toString())
        .set("GodownID", "0");
      this.$http
        .get("/Common/Get_StockCenter_with_Qty_Sale_Bill_for_Retail", {
          params: obj
        })
        .subscribe((data: any) => {
          this.GodownLists = data ? JSON.parse(data) : [];
          // if (this.databaseName === "GN_Global_Coimbatore" && this.ObjCostCenterFROM.F_Cost_Cen_ID == 2 && this.$CompacctAPI.CompacctCookies.Menu_Ref_ID == 2) {
          //   this.GodownLists = this.GodownLists.filter(item => item.godown_id != 13);
          // } 
        });
    }
  }
  GetSerial = function(ProductID, godwonID) {
    if (this.ObjCostCenterFROM.F_Cost_Cen_ID && this.SerialShow) {
      const obj = new HttpParams()
        .set("Report_type", "STOCK WITH SLNO")
        .set("ProductID", ProductID)
        .set("CostCenID", this.ObjCostCenterFROM.F_Cost_Cen_ID.toString())
        .set("GodownID", godwonID);
      this.$http
        .get("/Common/Get_Stock_Qty", { params: obj })
        .subscribe((data: any) => {
          // console.log('GetSerial',data);
          if (data) {
            const SerialNoList = data ? JSON.parse(data) : [];
            SerialNoList.forEach(el => {
              if(this.databaseName === 'BSHPL'){
                this.SerialList.push({
                  label: el.Serial_No ,
                  value: el.Serial_No
                });
              }else{
                this.SerialList.push({
                  label: el.Serial_No + "   "+"( Rs." + el.Rate + ")" ,
                  value: el.Serial_No
                });
              }
             
            });
          } else {
            this.SerialList = [];
          }
        });
    }
  };
  GetBatch = function(ProductID, godwonID) {
    if (this.ObjCostCenterFROM.F_Cost_Cen_ID && this.BatchShow) {
      const obj = new HttpParams()
        .set("Report_type", "STOCK WITH BATCH")
        .set("ProductID", ProductID)
        .set("CostCenID", this.ObjCostCenterFROM.F_Cost_Cen_ID.toString())
        .set("GodownID", godwonID ? godwonID.toString() : "0");
      this.$http
        .get("/Common/Get_Stock_Qty", { params: obj })
        .subscribe((data: any) => {
          //console.log('GetBatch11',data);
          if (data) {
            const BatchNoList = data ? JSON.parse(data) : [];
            this.BackUpBatchNoList= JSON.parse(data);
            this.BatchShow = true;
            // this.BatchList = JSON.parse(data);
            BatchNoList.forEach(el => {
              this.BatchList.push({
                label: el.Batch_No_Display,
                value: el.Batch_No
              });   
            });
          } else {
            this.BatchList = [];
          }
        });
    }
  };
  ChangeBatch = function(){
    this.BatchQtyArray = []; 
    this.tempQty = undefined;
    // this.tempQty = undefined;
    // if (this.ObjProductInfo.Batch_Number) {
    //   let ctrl = this;
    //   var obj = $.grep(ctrl.BatchList, function (value) { return value.Batch_No == ctrl.ObjProductInfo.Batch_Number})[0];
    //   this.tempQty = obj.QTY;
    // }

    // console.log('ChangeBatch',this.ObjProductInfo.Batch_Number);
    // console.log('BackUpBatchNoList',this.BackUpBatchNoList);
    
    if (this.ObjProductInfo.Batch_Number) {

      for(let item of this.ObjProductInfo.Batch_Number){
        for(let allitem of this.BackUpBatchNoList){
          if(item == allitem.Batch_No){
            this.BatchQtyArray.push(allitem.QTY);
          }
        }
      }
      // console.log("BatchQtyArray",this.BatchQtyArray);



      let sum = 0;
      for(let sumitem of this.BatchQtyArray){
        sum = sum + sumitem;
      }
      // console.log("sum",sum);

      
      this.tempQty = sum;

    }

    this.CalculateAmount();

  }

  getSumOfQtyWithSameProduct = function(productID) {
    if (this.ProductInfoList.length) {
      const List = this.ProductInfoList.map(x => Object.assign({}, x));
      let totalQty = 0;
      const tempProduct = $.grep(List, function(value) {
        return value.Product_ID === parseFloat(productID);
      });
      for (let init = 0; init < tempProduct.length; init++) {
        totalQty = totalQty + parseInt(tempProduct[init].Qty, 10);
      }
      return totalQty;
    } else {
      return 0;
    }
  };
  FromGodownChange(godwonID) {
    this.SerialList = [];
    this.BatchList = [];
    this.BackUpBatchNoList= [];
    if (
      godwonID &&
      this.ObjCostCenterFROM.F_Cost_Cen_ID &&
      this.ObjProductInfo.Product_ID
    ) {
      if (this.SerialShow) {        
        this.tempQty = 1;
        this.GetSerial(this.ObjProductInfo.Product_ID, godwonID);
      } else if (this.BatchShow) {
        this.GetBatch(this.ObjProductInfo.Product_ID, godwonID);
      }
    }
  }
  GetToGodown = function(costId) {
    // ctrl.ObjCostCenterTo.T_godown_id = undefined;
    if (costId) {
      const obj = new HttpParams().set("Cost_Cent_ID", costId);
      this.$http
        .get("/Common/Get_Godown_list", { params: obj })
        .subscribe((data: any) => {
          this.GodownToList = data ? JSON.parse(data) : [];
        });
    }
  };
  CalculateAmount() {
      let a = 0;
      this.newQty = []; 
      let QNTY = this.ObjProductInfo.Qty; 
      for(let newitem of this.BatchQtyArray){  
        if ( QNTY > 0){
          a = newitem; 
          if(a <= QNTY){  
            QNTY = QNTY - a; 
            this.newQty.push(Number(a)); 
          }
          else if(a > QNTY){ 
            let XYZ = QNTY  
            QNTY = QNTY - a;  
            this.newQty.push(Number(XYZ));
          }
        }  
      }
      // console.log("newQty",this.newQty);
      // console.log('ChangeBatch',this.ObjProductInfo.Batch_Number);
      


    if (this.ObjProductInfo.Rate && this.ObjProductInfo.Qty) {
      this.ObjProductInfo.Amount =
        this.ObjProductInfo.Rate * this.ObjProductInfo.Qty;
    } else {
      this.ObjProductInfo.Amount = 0;
    }
    this.DiscountTypeChange();
  }
  DiscountTypeClean = function() {
    this.ObjProductInfo.Discount = undefined;
    this.ObjProductInfo.Discount_Type_Amount = undefined;
    this.ObjProductInfo.Taxable_Amount = undefined;
    if (
      this.ObjProductInfo.Discount_Type === undefined ||
      this.ObjProductInfo.Discount_Type === ""
    ) {
      this.ObjProductInfo.Discount_Type = undefined;
      this.DiscountTypeChange();
    }
  };
  DiscountTypeChange = function() {
    if (this.ObjProductInfo.Discount_Type) {
      if (this.ObjProductInfo.Discount_Type === "%") {
        this.ObjProductInfo.Discount_Type_Amount = (
          (this.ObjProductInfo.Amount * this.ObjProductInfo.Discount) /
          100
        ).toFixed(2);
        this.ObjProductInfo.Taxable_Amount = (
          this.ObjProductInfo.Amount - this.ObjProductInfo.Discount_Type_Amount
        ).toFixed(2);
      } 
      else if (this.ObjProductInfo.Discount_Type === "AMT" && this.SerialShow) {
        this.ObjProductInfo.Discount_Type_Amount = this.ObjProductInfo.Discount;
        this.ObjProductInfo.Taxable_Amount = (
          this.ObjProductInfo.Amount - this.ObjProductInfo.Discount_Type_Amount
        ).toFixed(2);
      }
      else if (this.ObjProductInfo.Discount_Type === "AMT" && this.BatchShow) {
        this.ObjProductInfo.Discount_Type_Amount = this.ObjProductInfo.Discount;
        this.ObjProductInfo.Taxable_Amount = (
          this.ObjProductInfo.Amount - (this.ObjProductInfo.Discount_Type_Amount*this.ObjProductInfo.Batch_Number.length)
        ).toFixed(2);
      }
    } 
    else {
      this.ObjProductInfo.Discount = 0;
      this.ObjProductInfo.Discount_Type_Amount = this.ObjProductInfo.Discount;
      this.ObjProductInfo.Taxable_Amount = (
        this.ObjProductInfo.Amount - this.ObjProductInfo.Discount_Type_Amount
      ).toFixed(2);
    }
  };
  DiscountTypeChangeForEachBatch = function() {
    if (this.ObjProductInfo.Discount_Type) {
      if (this.ObjProductInfo.Discount_Type === "%") {
        this.ObjProductInfo.Discount_Type_Amount = (
          (this.ObjProductInfo.Amount * this.ObjProductInfo.Discount) /
          100
        ).toFixed(2);
        this.ObjProductInfo.Taxable_Amount = (
          this.ObjProductInfo.Amount - this.ObjProductInfo.Discount_Type_Amount
        ).toFixed(2);
      } 
      else if (this.ObjProductInfo.Discount_Type === "AMT") {
        this.ObjProductInfo.Discount_Type_Amount = this.ObjProductInfo.Discount;
        this.ObjProductInfo.Taxable_Amount = (
          this.ObjProductInfo.Amount - this.ObjProductInfo.Discount_Type_Amount
        ).toFixed(2);
      }
    } else {
      this.ObjProductInfo.Discount = 0;
      this.ObjProductInfo.Discount_Type_Amount = this.ObjProductInfo.Discount;
      this.ObjProductInfo.Taxable_Amount = (
        this.ObjProductInfo.Amount - this.ObjProductInfo.Discount_Type_Amount
      ).toFixed(2);
    }
  };
  getFinancialYear() {
    const obj = new HttpParams().set(
      "DocDate",
      this.DateService.dateConvert(new Date(this.ObjStockBill.Doc_Date))
    );
    this.$http
      .get(this.url.apiGetDocDateWiseFinancialYearId, { params: obj })
      .subscribe((data: any) => {
        this.ObjVoucherCommon.Fin_Year_ID = JSON.parse(data)[0].Fin_Year_ID;
      });
  }

  // PRODUCT
  CalculateProductWiswGrossAmount = function(obj) {
    return (
      obj.Taxable_Amount +
      obj.CGST_Amount +
      obj.SGST_Amount +
      obj.IGST_Amount
    ).toFixed(2);
  };
  CalculateTotalAmount = function() {
    this.ObjStockBill.Total_Amount = 0;
    let totalAmount = 0;
    this.ProductInfoListView.forEach(elem => {
      totalAmount = totalAmount + Number(elem.Amount);
    });
    this.ObjStockBill.Total_Amount = Number(totalAmount).toFixed(2);
    if (this.ProductInfoListView.length == null) {
      this.ObjStockBill.Total_Amount = undefined;
    }
  };
  CalculateDiscount = function() {
    this.ObjStockBill.Discount_Amount = 0;
    let discount = 0;
    this.ProductInfoListView.forEach(elem => {
      discount =
        discount +
        Number(elem.Discount_Type_Amount ? elem.Discount_Type_Amount : 0);
    });
    this.ObjStockBill.Discount_Amount = Number(discount).toFixed(2);
    if (this.ProductInfoListView.length == null) {
      this.ObjStockBill.Discount_Amount = undefined;
    }
  };
  CalculateTaxableAmount = function() {
    this.ObjStockBill.Taxable_Amt = 0;
    let taxableAmount = 0;
    this.ProductInfoListView.forEach(elem => {
      taxableAmount = taxableAmount + Number(elem.Taxable_Amount);
    });
    this.ObjStockBill.Taxable_Amt = Number(taxableAmount).toFixed(2);
    if (this.ProductInfoListView.length == null) {
      this.ObjStockBill.Taxable_Amt = undefined;
    }
  };
  CalculateCGSTAmount = function() {
    this.ObjStockBill.CGST_Amt = 0;
    let cgstAmount = 0;
    this.ProductInfoListView.forEach(elem => {
      cgstAmount = cgstAmount + Number(elem.CGST_Input_Amt);
    });
    this.ObjStockBill.CGST_Amt = Number(cgstAmount).toFixed(2);
    if (this.ProductInfoListView.length == null) {
      this.ObjStockBill.CGST_Amt = undefined;
    }
  };
  CalculateSGSTAmount = function() {
    this.ObjStockBill.SGST_Amt = 0;
    let sgstAmount = 0;
    this.ProductInfoListView.forEach(elem => {
      sgstAmount = sgstAmount + Number(elem.SGST_Input_Amt);
    });
    this.ObjStockBill.SGST_Amt = Number(sgstAmount).toFixed(2);
    if (this.ProductInfoListView.length == null) {
      this.ObjStockBill.SGST_Amt = undefined;
    }
  };
  CalculateIGST = function() {
    this.ObjStockBill.IGST_Amt = 0;
    let igstAmount = 0;
    this.ProductInfoListView.forEach(elem => {
      igstAmount = igstAmount + Number(elem.IGST_Input_Amt);
    });
    this.ObjStockBill.IGST_Amt = Number(igstAmount).toFixed(2);
    if (this.ProductInfoListView.length == null) {
      this.ObjStockBill.IGST_Amt = undefined;
    }
  };
  CalculateGrossAmount = function() {
    this.ObjStockBill.Gross_Amt = (
      parseFloat(this.ObjStockBill.Taxable_Amt) +
      parseFloat(this.ObjStockBill.CGST_Amt) +
      parseFloat(this.ObjStockBill.SGST_Amt) +
      parseFloat(this.ObjStockBill.IGST_Amt)
    ).toFixed(2);
    //   +parseFloat(ctrl.ObjSaleBill.Term_Amt || 0)
  };
  CalculateNetAmount = function() {
    this.ObjStockBill.Net_Amt = Math.round(this.ObjStockBill.Gross_Amt);
  };
  CalculateRoundedOff = function() {
    this.ObjStockBill.ROUNDED_OFF = (
      this.ObjStockBill.Net_Amt - this.ObjStockBill.Gross_Amt
    ).toFixed(2);
  };

  DeleteOtherInfo = function(productArrayIndex) {
    this.ProductInfoListView.splice(productArrayIndex, 1);
    this.CalculateTotalAmount();
    this.CalculateDiscount();
    this.CalculateTaxableAmount();
    this.CalculateIGST();
    this.CalculateSGSTAmount();
    this.CalculateCGSTAmount();
    this.CalculateGrossAmount();
    this.CalculateNetAmount();
    this.CalculateRoundedOff();
  };

    // ADD / UPDATE / SEARCH
  async AddProductInfo(valid) {
      this.ProductInfoSubmitted = true;
      this.ProductInfoRequired = true;
  if (valid && (Number(this.ObjProductInfo.Qty) <= this.tempQty)) {
    this.btnDisable = true
        if (this.ObjCostCenterTO.T_godown_id) {
          const ProdList = this.NativeProductList.map(x => Object.assign({}, x));
          const prodCodeID = this.ObjProductInfo.Product_ID;
          const TempServiceFlag = $.grep(ProdList, function(value) {
            return value.Product_ID === prodCodeID;
          })[0];
          if(TempServiceFlag.Product_Serial){
            const checkSerial = (SerialNo)=>{
              const Serialfind = this.SelectedSerialNo.find((el:any)=> el == SerialNo)
              return Serialfind ? true : false
            }
            const checkProductSerial = $.grep(this.ProductInfoListView, function(value) {
              return checkSerial(value.Serial_No) ;
            })[0];
            if(checkProductSerial){
              this.btnDisable = false
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message",
                detail: "Duplicate Serial No"
              });
              return 
            }
          }
          if(!TempServiceFlag.Product_Serial){
            const BatchNumber = Array.isArray(this.ObjProductInfo.Batch_Number) ? this.ObjProductInfo.Batch_Number : []
            const checkBatch = (batchNo)=>{
              const Serialfind = BatchNumber.find((el:any)=> el == batchNo)
              return Serialfind ? true : false
            }
            const checkProductBatch = $.grep(this.ProductInfoListView, function(value) {
              return value.Product_ID === prodCodeID && checkBatch(value.Batch_Number) ;
            })[0];
            if(checkProductBatch){
              this.btnDisable = false
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message",
                detail: "Duplicate Product and Batch No"
              });
              return 
            }
          }
          if ((this.ObjProductInfo.Batch_Number !== "" && this.ObjProductInfo.Batch_Number !== undefined) || (TempServiceFlag.Is_Service && this.databaseName === 'GN_SHCPL_Patna'))
          {
            if (
              this.ObjCostCenterFROM.F_Cost_Cen_State &&
              this.ObjCostCenterTO.T_Cost_Cen_State
            ) {
             
              //
              let Batch: any = [];
              let BatchQty: any = [];
              Batch = this.ObjProductInfo.Batch_Number;
              BatchQty = this.newQty;
              const k = this.ObjProductInfo;
                if(BatchQty.length < Batch.length){
                  let tempQty = Batch.length -   BatchQty.length; 
                  // console.log('tempQty',tempQty);
                  for(let i=0; i< tempQty; i++){
                    Batch.pop();
                  }
                }
              for (let i = 0; i < Batch.length; i++) {
                // const ser = this.ObjProductInfo.Batch_Number[i];
                // let falg = await this.CheckBatchNoValid(ser);
                // console.log('Batch no Check : ', falg ,ser );
                // if(falg === 'YES') {
                  this.ObjProductInfo.Batch_Number = Batch[i];
                  this.ObjProductInfo.Qty = BatchQty[i];
                  this.ObjProductInfo.Amount = BatchQty[i] * this.ObjProductInfo.Rate;
                  this.DiscountTypeChangeForEachBatch();
                  this.GSTCalculat()
                  this.ProductInfoListProto.push(this.ObjProductInfo);
                  // console.log(ctrl.ObjOthersInfo.Batch_No)
                  //  ctrl.ObjOthersInfo.Batch_No = undefined;
                  const d = {...this.ObjProductInfo};
                  this.ObjProductInfo = new ProductInfo();
                  console.log('ObjProductInfo2',d)
                  this.ObjProductInfo.Product_ID = d.Product_ID;
                  this.ObjProductInfo.Product_Name = d.Product_Name;
                  this.ObjProductInfo.Product_Specification =
                    d.Product_Specification;
                  this.ObjProductInfo.Qty = d.Qty;
                  this.ObjProductInfo.UOM = d.UOM;
                  this.ObjProductInfo.MRP = d.MRP;
                  this.ObjProductInfo.Rate = d.Rate;
                  this.ObjProductInfo.Amount = d.Amount;

                  this.ObjProductInfo.Cat_ID = d.Cat_ID;
                  this.ObjProductInfo.Cat_Name = d.Cat_Name;
                  this.ObjProductInfo.F_godown_id = d.F_godown_id;
                  this.ObjProductInfo.godown_name = d.godown_name;
                  this.ObjProductInfo.Ledger_ID = d.Ledger_ID;

                  this.ObjProductInfo.HSL_No = d.HSL_No;
                  this.ObjProductInfo.Discount_Type = d.Discount_Type;
                  this.ObjProductInfo.Discount = d.Discount;
                  this.ObjProductInfo.Discount_Type_Amount = d.Discount_Type_Amount;
                  this.ObjProductInfo.Taxable_Amount = d.Taxable_Amount;
                  this.ObjProductInfo.CGST_Rate = d.CGST_Rate;
                  this.ObjProductInfo.SGST_Rate = d.SGST_Rate;
                  this.ObjProductInfo.IGST_Rate = d.IGST_Rate;

                  this.ObjProductInfo.CGST_Amount = d.CGST_Amount;
                  this.ObjProductInfo.SGST_Amount = d.SGST_Amount;
                  this.ObjProductInfo.IGST_Amount = d.IGST_Amount;

                  this.ObjProductInfo.IGST_Input_Ledger_ID = d.IGST_Input_Ledger_ID;
                  this.ObjProductInfo.IGST_Input_Rate = d.IGST_Rate;
                  this.ObjProductInfo.IGST_Input_Amt = d.IGST_Input_Amt;

                  this.ObjProductInfo.IGST_Output_Ledger_ID =
                    d.IGST_Output_Ledger_ID;
                  this.ObjProductInfo.IGST_Output_Rate = d.IGST_Rate;
                  this.ObjProductInfo.IGST_Output_Amt = d.IGST_Output_Amt;

                  this.ObjProductInfo.CGST_Input_Ledger_ID = d.CGST_Input_Ledger_ID;
                  this.ObjProductInfo.CGST_Input_Rate = d.CGST_Rate;
                  this.ObjProductInfo.CGST_Input_Amt = d.CGST_Input_Amt;

                  this.ObjProductInfo.CGST_Output_Ledger_ID =
                    d.CGST_Output_Ledger_ID;
                  this.ObjProductInfo.CGST_Output_Rate = d.CGST_Rate;
                  this.ObjProductInfo.CGST_Output_Amt = d.CGST_Output_Amt;

                  this.ObjProductInfo.SGST_Input_Ledger_Id = d.SGST_Input_Ledger_Id;
                  this.ObjProductInfo.SGST_Input_Rate = d.SGST_Rate;
                  this.ObjProductInfo.SGST_Input_Amt = d.SGST_Input_Amt;

                  this.ObjProductInfo.SGST_Output_Ledger_ID =
                    d.SGST_Output_Ledger_ID;
                  this.ObjProductInfo.SGST_Output_Rate = d.SGST_Rate;
                  this.ObjProductInfo.SGST_Output_Amt = d.SGST_Output_Amt;

                  this.ObjProductInfo.Discount_Ledger_ID = d.Discount_Ledger_ID;

                  this.ObjProductInfo.Product_ID_AO = d.Product_ID_AO;
                  this.ObjProductInfo.Qty_AO = d.Qty_AO;
                  this.ObjProductInfo.Previous_Doc_No = d.Previous_Doc_No;
                  console.log("ProductInfoListView",this.ProductInfoListView)
                // }
                // else {
                //   this.compacctToast.clear();
                //   this.compacctToast.add({
                //     key: "compacct-toast",
                //     severity: "error",
                //     summary: "Batch No Check",
                //     detail: ser + " : Is not exits for this product. ",
                //     life : 5000
                //   });
                // }
              }
              this.ProductInfoListView = this.ProductInfoListProto;

              // this.ProductInfoListProto.push(this.ObjProductInfo);
              // this.ProductInfoListView = this.ProductInfoListProto;
              this.ProductInfoSubmitted = false;
              this.ProductInfoRequired = false;
              this.BatchShow = true;
              this.Batchdisabled = true;
              this.SerialShow = false;
              this.GodownRequire = false;
              this.Batchdropdown = false;
              this.GodownLists = [];
              this.BatchList = [];
              this.SelectedProduct = "";

              this.CalculateTotalAmount();
              this.CalculateDiscount();
              this.CalculateTaxableAmount();
              this.CalculateIGST();
              this.CalculateSGSTAmount();
              this.CalculateCGSTAmount();
              this.CalculateGrossAmount();
              this.CalculateNetAmount();
              this.CalculateRoundedOff();

              if (Number(this.ObjProductInfo.F_godown_id) === 0) {
                this.ObjProductInfo = new ProductInfo();
                this.ObjProductInfo.F_godown_id = 0;
              } else {
                this.ObjProductInfo = new ProductInfo();
              }
            } else {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message",
                detail: "Please choose From/To Costcenter."
              });
            }
          } else if (this.SelectedSerialNo.length !== 0) {
            if (!Number(this.ObjProductInfo.MRP)) {
              this.ObjProductInfo.MRP = 0;
            }
            if (!Number(this.ObjProductInfo.Rate)) {
              this.ObjProductInfo.Rate = 0;
            }
            if (!Number(this.ObjProductInfo.Amount)) {
              this.ObjProductInfo.Amount = 0;
            }
            if (Number(this.ObjProductInfo.F_godown_id) === 0) {
              this.ObjProductInfo.F_godown_id = 0;
              this.ObjProductInfo.godown_name = "-";
            }
            if (
              this.ObjCostCenterFROM.F_Cost_Cen_State &&
              this.ObjCostCenterTO.T_Cost_Cen_State
            ) {
              // && ctrl.compositeGST == "No"
             
              const k = this.ObjProductInfo;
              console.log("ObjProductInfo K",k)
              for (let i = 0; i < this.SelectedSerialNo.length; i++) {
                const ser = this.SelectedSerialNo[i];
                let falg = await this.CheckSerialNoValid(ser);
                console.log('Serial no Check : ', falg ,ser );
                if(falg === 'YES') {
                  this.ObjProductInfo.Serial_No = ser;
                  if (
                    this.ObjCostCenterFROM.F_Cost_Cen_GST_No.toUpperCase() ===
                    this.ObjCostCenterTO.T_Cost_Cen_GST_No.toUpperCase()
                  ) {
                    this.ObjProductInfo.IGST_Rate = 0;
                    this.ObjProductInfo.CGST_Rate = 0;
                    this.ObjProductInfo.SGST_Rate = 0;
                    this.ObjProductInfo.IGST_Input_Rate = 0;
                    this.ObjProductInfo.IGST_Input_Amt = 0;
    
                    this.ObjProductInfo.IGST_Output_Rate = 0;
                    this.ObjProductInfo.IGST_Output_Amt = 0;
    
                    this.ObjProductInfo.CGST_Input_Rate = 0;
                    this.ObjProductInfo.CGST_Input_Amt = 0;
    
                    this.ObjProductInfo.CGST_Output_Rate = 0;
                    this.ObjProductInfo.CGST_Output_Amt = 0;
    
                    this.ObjProductInfo.SGST_Input_Rate = 0;
                    this.ObjProductInfo.SGST_Input_Amt = 0;
    
                    this.ObjProductInfo.SGST_Output_Rate = 0;
                    this.ObjProductInfo.SGST_Output_Amt = 0;
                  } else if (
                    this.ObjCostCenterFROM.F_Cost_Cen_State.toUpperCase() ===
                    this.ObjCostCenterTO.T_Cost_Cen_State.toUpperCase()
                  ) {
                    this.ObjProductInfo.CGST_Input_Amt = parseFloat(
                      (
                        (this.ObjProductInfo.Taxable_Amount *
                          this.ObjProductInfo.CGST_Input_Rate) /
                        100
                      ).toFixed(2)
                    );
                    this.ObjProductInfo.CGST_Output_Amt = parseFloat(
                      (
                        (this.ObjProductInfo.Taxable_Amount *
                          this.ObjProductInfo.CGST_Output_Rate) /
                        100
                      ).toFixed(2)
                    );
                    this.ObjProductInfo.SGST_Input_Amt = parseFloat(
                      (
                        (this.ObjProductInfo.Taxable_Amount *
                          this.ObjProductInfo.SGST_Input_Rate) /
                        100
                      ).toFixed(2)
                    );
                    this.ObjProductInfo.SGST_Output_Amt = parseFloat(
                      (
                        (this.ObjProductInfo.Taxable_Amount *
                          this.ObjProductInfo.SGST_Output_Rate) /
                        100
                      ).toFixed(2)
                    );
                    this.ObjProductInfo.IGST_Input_Rate = 0;
                    this.ObjProductInfo.IGST_Input_Amt = 0;
    
                    this.ObjProductInfo.IGST_Output_Rate = 0;
                    this.ObjProductInfo.IGST_Output_Amt = 0;
                    this.ObjProductInfo.IGST_Rate = 0;
                  } else {
                    this.ObjProductInfo.IGST_Input_Amt = parseFloat(
                      (
                        (this.ObjProductInfo.Taxable_Amount *
                          this.ObjProductInfo.IGST_Input_Rate) /
                        100
                      ).toFixed(2)
                    );
                    this.ObjProductInfo.IGST_Output_Amt = parseFloat(
                      (
                        (this.ObjProductInfo.Taxable_Amount *
                          this.ObjProductInfo.IGST_Output_Rate) /
                        100
                      ).toFixed(2)
                    );
    
                    this.ObjProductInfo.CGST_Input_Rate = 0;
                    this.ObjProductInfo.CGST_Input_Amt = 0;
    
                    this.ObjProductInfo.CGST_Output_Rate = 0;
                    this.ObjProductInfo.CGST_Output_Amt = 0;
    
                    this.ObjProductInfo.SGST_Input_Rate = 0;
                    this.ObjProductInfo.SGST_Input_Amt = 0;
    
                    this.ObjProductInfo.SGST_Output_Rate = 0;
                    this.ObjProductInfo.SGST_Output_Amt = 0;
                    this.ObjProductInfo.CGST_Rate = 0;
                    this.ObjProductInfo.SGST_Rate = 0;
                  }
                  this.ProductInfoListProto.push(this.ObjProductInfo);
                  // console.log(ctrl.ObjOthersInfo.Serial_No)
                  //  ctrl.ObjOthersInfo.Serial_No = undefined;
                  const d = this.ObjProductInfo;
                  this.ObjProductInfo = new ProductInfo();

                  this.ObjProductInfo.Product_ID = d.Product_ID;
                  this.ObjProductInfo.Product_Name = d.Product_Name;
                  this.ObjProductInfo.Product_Specification =
                    d.Product_Specification;
                  this.ObjProductInfo.Qty = d.Qty;
                  this.ObjProductInfo.UOM = d.UOM;
                  this.ObjProductInfo.MRP = d.MRP;
                  this.ObjProductInfo.Rate = d.Rate;
                  this.ObjProductInfo.Amount = d.Amount;

                  this.ObjProductInfo.Cat_ID = d.Cat_ID;
                  this.ObjProductInfo.Cat_Name = d.Cat_Name;
                  this.ObjProductInfo.F_godown_id = d.F_godown_id;
                  this.ObjProductInfo.godown_name = d.godown_name;
                  this.ObjProductInfo.Ledger_ID = d.Ledger_ID;

                  this.ObjProductInfo.HSL_No = d.HSL_No;
                  this.ObjProductInfo.Discount_Type = d.Discount_Type;
                  this.ObjProductInfo.Discount = d.Discount;
                  this.ObjProductInfo.Discount_Type_Amount = d.Discount_Type_Amount;
                  this.ObjProductInfo.Taxable_Amount = d.Taxable_Amount;
                  this.ObjProductInfo.CGST_Rate = d.CGST_Rate;
                  this.ObjProductInfo.SGST_Rate = d.SGST_Rate;
                  this.ObjProductInfo.IGST_Rate = d.IGST_Rate;

                  this.ObjProductInfo.CGST_Amount = d.CGST_Amount;
                  this.ObjProductInfo.SGST_Amount = d.SGST_Amount;
                  this.ObjProductInfo.IGST_Amount = d.IGST_Amount;

                  this.ObjProductInfo.IGST_Input_Ledger_ID = d.IGST_Input_Ledger_ID;
                  this.ObjProductInfo.IGST_Input_Rate = d.IGST_Rate;
                  this.ObjProductInfo.IGST_Input_Amt = d.IGST_Input_Amt;

                  this.ObjProductInfo.IGST_Output_Ledger_ID =
                    d.IGST_Output_Ledger_ID;
                  this.ObjProductInfo.IGST_Output_Rate = d.IGST_Rate;
                  this.ObjProductInfo.IGST_Output_Amt = d.IGST_Output_Amt;

                  this.ObjProductInfo.CGST_Input_Ledger_ID = d.CGST_Input_Ledger_ID;
                  this.ObjProductInfo.CGST_Input_Rate = d.CGST_Rate;
                  this.ObjProductInfo.CGST_Input_Amt = d.CGST_Input_Amt;

                  this.ObjProductInfo.CGST_Output_Ledger_ID =
                    d.CGST_Output_Ledger_ID;
                  this.ObjProductInfo.CGST_Output_Rate = d.CGST_Rate;
                  this.ObjProductInfo.CGST_Output_Amt = d.CGST_Output_Amt;

                  this.ObjProductInfo.SGST_Input_Ledger_Id = d.SGST_Input_Ledger_Id;
                  this.ObjProductInfo.SGST_Input_Rate = d.SGST_Rate;
                  this.ObjProductInfo.SGST_Input_Amt = d.SGST_Input_Amt;

                  this.ObjProductInfo.SGST_Output_Ledger_ID =
                    d.SGST_Output_Ledger_ID;
                  this.ObjProductInfo.SGST_Output_Rate = d.SGST_Rate;
                  this.ObjProductInfo.SGST_Output_Amt = d.SGST_Output_Amt;

                  this.ObjProductInfo.Discount_Ledger_ID = d.Discount_Ledger_ID;

                  this.ObjProductInfo.Product_ID_AO = d.Product_ID_AO;
                  this.ObjProductInfo.Qty_AO = d.Qty_AO;
                  this.ObjProductInfo.Previous_Doc_No = d.Previous_Doc_No;
                } else {
                  this.compacctToast.clear();
                  this.compacctToast.add({
                    key: "compacct-toast",
                    severity: "error",
                    summary: "Serial No Check",
                    detail: ser + " : Is not exits for this product. ",
                    life : 5000
                  });
                }
              }
              this.ProductInfoListView = this.ProductInfoListProto;
              this.CalculateTotalAmount();
              this.CalculateDiscount();
              this.CalculateTaxableAmount();
              this.CalculateIGST();
              this.CalculateSGSTAmount();
              this.CalculateCGSTAmount();
              this.CalculateGrossAmount();
              this.CalculateNetAmount();
              this.CalculateRoundedOff();

              this.ProductInfoSubmitted = false;
              this.ProductInfoRequired = false;
              this.BatchShow = true;
              this.Batchdisabled = true;
              this.SerialShow = false;
              this.GodownRequire = false;
              this.Batchdropdown = false;
              this.SerialList = [];
              this.GodownLists = [];
              this.ObjProductInfo = new ProductInfo();
              this.ProductChange(k.Product_ID);
              this.ObjProductInfo.Product_ID = k.Product_ID;
              this.ObjProductInfo.Product_Name = k.Product_Name;
              this.ObjProductInfo.Product_Specification = k.Product_Specification;
              this.ObjProductInfo.Qty = k.Qty;
              this.ObjProductInfo.UOM = k.UOM;
              this.ObjProductInfo.MRP = k.MRP;
              this.ObjProductInfo.Rate = k.Rate;
              this.ObjProductInfo.Amount = k.Amount;

              this.ObjProductInfo.Cat_ID = k.Cat_ID;
              this.ObjProductInfo.Cat_Name = k.Cat_Name;
              this.ObjProductInfo.F_godown_id = k.F_godown_id;
              this.FromGodownChange(k.F_godown_id);
              this.ObjProductInfo.godown_name = k.godown_name;
              this.ObjProductInfo.Ledger_ID = k.Ledger_ID;

              this.ObjProductInfo.HSL_No = k.HSL_No;
              this.ObjProductInfo.Discount_Type = k.Discount_Type;
              this.ObjProductInfo.Discount = k.Discount;
              this.ObjProductInfo.Discount_Type_Amount = k.Discount_Type_Amount;
              this.ObjProductInfo.Taxable_Amount = k.Taxable_Amount;
              this.ObjProductInfo.Discount_Ledger_ID = k.Discount_Ledger_ID;

              this.ObjProductInfo.Product_ID_AO = k.Product_ID_AO;
              this.ObjProductInfo.Qty_AO = k.Qty_AO;
              this.ObjProductInfo.Previous_Doc_No = k.Previous_Doc_No;

              this.SelectedSerialNo = [];
            }
          }
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Please choose To Stock Point."
          });
        }
        this.btnDisable = false
      } else {
        this.btnDisable = false
        if (
          !this.ObjCostCenterTO.T_Cost_Cen_ID ||
          !this.ObjCostCenterFROM.F_Cost_Cen_ID
        ) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Please choose From/To Costcenter."
          });
        }
      }
    }
  async CheckSerialNoValid(id) {
    const url = 'Common/Check_Serial_with_cost_center?Serial_No='+ id +'&Product_ID='+this.ObjProductInfo.Product_ID+'&Cost_Cen_ID='+ this.ObjCostCenterFROM.F_Cost_Cen_ID
    const res = await fetch(url,{ 
      method: 'GET',
    });
    let responseText = await res.text();
    return responseText;
  }
  GSTCalculat(){
    if (
      this.ObjCostCenterFROM.F_Cost_Cen_GST_No.toUpperCase() ===
      this.ObjCostCenterTO.T_Cost_Cen_GST_No.toUpperCase()
    ) {
      this.ObjProductInfo.IGST_Rate = 0;
      this.ObjProductInfo.CGST_Rate = 0;
      this.ObjProductInfo.SGST_Rate = 0;

      this.ObjProductInfo.IGST_Input_Rate = 0;
      this.ObjProductInfo.IGST_Input_Amt = 0;

      this.ObjProductInfo.IGST_Output_Rate = 0;
      this.ObjProductInfo.IGST_Output_Amt = 0;

      this.ObjProductInfo.CGST_Input_Rate = 0;
      this.ObjProductInfo.CGST_Input_Amt = 0;

      this.ObjProductInfo.CGST_Output_Rate = 0;
      this.ObjProductInfo.CGST_Output_Amt = 0;

      this.ObjProductInfo.SGST_Input_Rate = 0;
      this.ObjProductInfo.SGST_Input_Amt = 0;

      this.ObjProductInfo.SGST_Output_Rate = 0;
      this.ObjProductInfo.SGST_Output_Amt = 0;
    } else if (
      this.ObjCostCenterFROM.F_Cost_Cen_State.toUpperCase() ===
      this.ObjCostCenterTO.T_Cost_Cen_State.toUpperCase()
    ) {
      this.ObjProductInfo.CGST_Input_Amt = parseFloat(
        (
          (this.ObjProductInfo.Taxable_Amount *
            this.ObjProductInfo.CGST_Input_Rate) /
          100
        ).toFixed(2)
      );
      this.ObjProductInfo.CGST_Output_Amt = parseFloat(
        (
          (this.ObjProductInfo.Taxable_Amount *
            this.ObjProductInfo.CGST_Output_Rate) /
          100
        ).toFixed(2)
      );
      this.ObjProductInfo.SGST_Input_Amt = parseFloat(
        (
          (this.ObjProductInfo.Taxable_Amount *
            this.ObjProductInfo.SGST_Input_Rate) /
          100
        ).toFixed(2)
      );
      this.ObjProductInfo.SGST_Output_Amt = parseFloat(
        (
          (this.ObjProductInfo.Taxable_Amount *
            this.ObjProductInfo.SGST_Output_Rate) /
          100
        ).toFixed(2)
      );
      this.ObjProductInfo.IGST_Input_Rate = 0;
      this.ObjProductInfo.IGST_Input_Amt = 0;

      this.ObjProductInfo.IGST_Output_Rate = 0;
      this.ObjProductInfo.IGST_Output_Amt = 0;
      this.ObjProductInfo.IGST_Rate = 0;
    } else {
      this.ObjProductInfo.IGST_Input_Amt = parseFloat(
        (
          (this.ObjProductInfo.Taxable_Amount *
            this.ObjProductInfo.IGST_Input_Rate) /
          100
        ).toFixed(2)
      );
      this.ObjProductInfo.IGST_Output_Amt = parseFloat(
        (
          (this.ObjProductInfo.Taxable_Amount *
            this.ObjProductInfo.IGST_Output_Rate) /
          100
        ).toFixed(2)
      );

      this.ObjProductInfo.CGST_Input_Rate = 0;
      this.ObjProductInfo.CGST_Input_Amt = 0;

      this.ObjProductInfo.CGST_Output_Rate = 0;
      this.ObjProductInfo.CGST_Output_Amt = 0;

      this.ObjProductInfo.SGST_Input_Rate = 0;
      this.ObjProductInfo.SGST_Input_Amt = 0;

      this.ObjProductInfo.SGST_Output_Rate = 0;
      this.ObjProductInfo.SGST_Output_Amt = 0;
      this.ObjProductInfo.CGST_Rate = 0;
      this.ObjProductInfo.SGST_Rate = 0;
    }
  }
  SaveStockBill(valid) {
    this.StockFormSubmitted = true;
    console.log(this.ObjCostCenterFROM);
    if (valid) {
      this.saveSpinner = true;
      this.ObjStockBill.Doc_Date = this.ObjStockBill.Doc_Date
        ? this.ObjStockBill.Doc_Date
        : this.DateService.dateConvert(
            moment(this.DocDate, "YYYY-MM-DD")["_d"]
          );
      this.getFinancialYear();
      const ParamString = [];
      for (let i = 0; i < this.ProductInfoListProto.length; i++) {
        let Paramobj = {};
        Paramobj = Object.assign(
          this.ProductInfoListProto[i],
          this.ObjCostCenterFROM,
          this.ObjCostCenterTO,
          this.ObjStockBill
        );
        ParamString.push(Paramobj);
      }
      const url = this.ObjStockBill.Doc_No
        ? this.urlService.updatestocktransfer
        : this.urlService.createStocktransferGst;

      this.$http.post(url, ParamString).subscribe((data: any) => {
        if (data.success === true) {
          console.group("Compacct V2");
          console.log("%c Stock Transfer Sucess:", "color:green;", data.Doc_No);
          console.log(url);
          if (
            this.ObjStockBill.IGST_Amt ||
            (this.ObjStockBill.SGST_Amt && this.ObjStockBill.CGST_Amt)
          ) {
            this.SaveAccountJopurnal(data.Doc_No);
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: data.Doc_No,
              detail: this.ObjStockBill.Doc_No
                ? "Succesfully Updated"
                : "Succesfully Created"
            });

            this.ClearData();
          }
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
        this.saveSpinner = false;
        this.StockFormSubmitted = false;
      });
    }
  }
  SaveAccountJopurnal(Doc_No) {
    const VoucherDataList = [];
    this.ObjVoucherCommon.Voucher_No = Doc_No;
    this.ObjVoucherCommon.Voucher_Date = this.DateService.dateConvert(
      new Date(this.ObjStockBill.Doc_Date)
    );

    this.ObjVoucherCommon.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjVoucherCommon.Posted_On = this.DateService.dateConvert(new Date());
    this.getFinancialYear();
    if (this.ObjStockBill.IGST_Amt !== 0) {
      for (const prop of this.ProductInfoListProto) {
        const objY = {},
          objN = {};
        Object.assign( objY,
          {
            Ledger_ID: prop.IGST_Input_Ledger_ID,
            CR_Amt: prop.IGST_Output_Amt,
            Sub_Ledger_ID: 0,
            DR_Amt: 0,
            Is_Topper: "Y",
            Cost_Cen_ID: this.ObjCostCenterTO.T_Cost_Cen_ID
          },
          this.ObjVoucherCommon
        );
        VoucherDataList.push(objY);
        Object.assign( objN,
          {
            Ledger_ID: prop.IGST_Output_Ledger_ID,
            CR_Amt: 0,
            Sub_Ledger_ID: 0,
            DR_Amt: prop.IGST_Input_Amt,
            Is_Topper: "N",
            Cost_Cen_ID: this.ObjCostCenterFROM.F_Cost_Cen_ID
          },
          this.ObjVoucherCommon
        );
        VoucherDataList.push(objN);
      }
    } else if (
      this.ObjStockBill.CGST_Amt !== 0 &&
      this.ObjStockBill.SGST_Amt !== 0
    ) {
      for (const prop of this.ProductInfoListProto) {
        const obj1Y = {},
          obj1N = {},
          obj2Y = {},
          obj2N = {};
        Object.assign(
          obj1Y,
          {
            Ledger_ID: prop.CGST_Input_Ledger_ID,
            CR_Amt: prop.CGST_Output_Amt,
            Sub_Ledger_ID: 0,
            DR_Amt: 0,
            Is_Topper: "Y",
            Cost_Cen_ID: this.ObjCostCenterTO.T_Cost_Cen_ID
          },
          this.ObjVoucherCommon
        );
        VoucherDataList.push(obj1Y);
        Object.assign(
          obj1N,
          {
            Ledger_ID: prop.CGST_Output_Ledger_ID,
            CR_Amt: 0,
            Sub_Ledger_ID: 0,
            DR_Amt: prop.CGST_Input_Amt,
            Is_Topper: "N",
            Cost_Cen_ID: this.ObjCostCenterFROM.F_Cost_Cen_ID
          },
          this.ObjVoucherCommon
        );
        VoucherDataList.push(obj1N);
        Object.assign(
          obj2Y,
          {
            Ledger_ID: prop.SGST_Input_Ledger_ID,
            CR_Amt: prop.SGST_Output_Amt,
            Sub_Ledger_ID: 0,
            DR_Amt: 0,
            Is_Topper: "Y",
            Cost_Cen_ID: this.ObjCostCenterTO.T_Cost_Cen_ID
          },
          this.ObjVoucherCommon
        );
        VoucherDataList.push(obj1Y);
        Object.assign(
          obj2N,
          {
            Ledger_ID: prop.SGST_Output_Ledger_ID,
            CR_Amt: 0,
            Sub_Ledger_ID: 0,
            DR_Amt: prop.SGST_Input_Amt,
            Is_Topper: "N",
            Cost_Cen_ID: this.ObjCostCenterFROM.F_Cost_Cen_ID
          },
          this.ObjVoucherCommon
        );
        VoucherDataList.push(obj1N);
      }
    }

    // Total Debit and credit amount
    let totaldr = 0;
    let totalcr = 0;
    for (let i = 0; i < VoucherDataList.length; i++) {
      totaldr = totaldr + parseFloat(VoucherDataList[i].DR_Amt);
      totalcr = totalcr + parseFloat(VoucherDataList[i].CR_Amt);
    }
    console.log(
      "DR =" + totaldr.toFixed(2) + " , " + "CR =" + totalcr.toFixed(2)
    );
    this.$http
      .post(this.url.apiCreateSaleBillAccountJournal, VoucherDataList)
      .subscribe((data: any) => {
        if (data.success === true) {
          console.group("Compacct V2");
          console.log(
            "%c Account Journal Sucess:",
            "color:green;",
            data.Doc_No
          );
          console.log(this.url.apiCreateSaleBillAccountJournal);
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: Doc_No,
            detail: this.ObjStockBill.Doc_No
              ? "Succesfully Updated"
              : "Succesfully Created"
          });
          this.ClearData();
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      });
  }
  SearchStockBill(valid) {
    this.StockSearchFormSubmitted = true;
    if (valid) {
      this.seachSpinner = true;
      const start = this.ObjSearchStock.from_date
        ? this.DateService.dateConvert(new Date(this.ObjSearchStock.from_date))
        : this.DateService.dateConvert(new Date());
      const end = this.ObjSearchStock.to_date
        ? this.DateService.dateConvert(new Date(this.ObjSearchStock.to_date))
        : this.DateService.dateConvert(new Date());
      const obj = new HttpParams()
        .set("from_date", start)
        .set("to_date", end)
        .set("User_ID", this.$CompacctAPI.CompacctCookies.User_ID)
        .set("F_Cost_Cen_ID", this.ObjSearchStock.F_Cost_Cen_ID.toString())
        .set(
          "T_Cost_Cen_ID",
          this.ObjSearchStock.T_Cost_Cen_ID
            ? this.ObjSearchStock.T_Cost_Cen_ID.toString()
            : "0"
        );

      this.$http
        .get(this.urlService.searchstocktransferGst, { params: obj })
        .subscribe((data: any) => {
          this.StockBillList = data.length ? data : [];
          this.seachSpinner = false;
          this.StockSearchFormSubmitted = false;
        });
    }
  }

  EditStockTransfer(obj) {
    if (obj.Doc_No) {
      this.$CompacctAPI.compacctSpinnerShow();
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.ClearData();
      this.GetEditStockData(obj.Doc_No);
    }
  }
  GetEditStockData(doc_no) {
    if (doc_no) {
      const para = new HttpParams().set("Doc_No", doc_no);
      this.$http
        .get(this.urlService.geteditdatastocktransfer, { params: para })
        .subscribe((data: any) => {
          const editObj = data[0];
          this.ObjStockBill.Doc_No = editObj.Doc_No;
          this.DocDate = moment(editObj.Doc_Date, "DD-MMM-YYYY");
          this.ObjStockBill.Doc_Date = editObj.Doc_Date;
          this.StockCostCenterFromChange(editObj.F_Cost_Cen_ID);
          this.StockCostCenterToChange(editObj.T_Cost_Cen_ID);
          this.ObjCostCenterTO.T_godown_id = editObj.T_godown_id;

          this.ProductInfoListProto = editObj.List_Product;
          this.ProductInfoListView = editObj.List_Product;

          this.ObjStockBill.Trf_Line_No = editObj.Trf_Line_No;
          this.ObjStockBill.Project_ID = editObj.Project_ID;
          this.ObjStockBill.CN_No = editObj.CN_No;
          this.CNDate = moment(editObj.CN_Date, "DD-MMM-YYYY");
          this.ObjStockBill.CN_Date = editObj.CN_Date;
          this.ObjStockBill.User_ID = editObj.User_ID;
          this.ObjStockBill.Entry_Date = editObj.Entry_Date;
          this.ObjStockBill.Remarks = editObj.Remarks;
          this.ObjStockBill.Line_No = editObj.Line_No;
          this.ObjStockBill.Type_ID = editObj.Type_ID;
          this.ObjStockBill.Previous_Doc_No = editObj.Previous_Doc_No;
          this.ObjStockBill.Courrier_Name = editObj.Courrier_Name;
          this.ObjStockBill.Courrier_ID = editObj.Courrier_ID;
          this.ObjStockBill.Currency_Symbol = editObj.Currency_Symbol;
          this.ObjStockBill.Dispatch_Through = editObj.Dispatch_Through;
          this.ObjStockBill.Other_Reference = editObj.Other_Reference;
          this.ObjStockBill.Eway_Bill_No = editObj.Eway_Bill_No;
          this.ObjStockBill.Eway_Bill_Date = editObj.Eway_Bill_Date
            ? editObj.Eway_Bill_Date
            : "1" + "/" + "Jan" + "/" + "1900";
          this.ObjStockBill.Payment_Terms = editObj.Payment_Terms;
          this.ObjStockBill.Total_Amount = editObj.Total_Amount;
          this.ObjStockBill.Discount_Amount = editObj.Discount_Amount;
          this.ObjStockBill.Taxable_Amt = editObj.Taxable_Amt;
          this.ObjStockBill.Net_Amt = editObj.Net_Amt;
          this.ObjStockBill.Tax_Amt = editObj.Tax_Amt;
          this.ObjStockBill.CGST_Amt = editObj.CGST_Amt;
          this.ObjStockBill.SGST_Amt = editObj.SGST_Amt;
          this.ObjStockBill.IGST_Amt = editObj.IGST_Amt;
          this.ObjStockBill.Gross_Amt = editObj.Gross_Amt;
          this.ObjStockBill.ROUNDED_OFF = editObj.ROUNDED_OFF;

          this.CalculateTotalAmount();
          this.CalculateDiscount();
          this.CalculateTaxableAmount();
          this.CalculateIGST();
          this.CalculateSGSTAmount();
          this.CalculateCGSTAmount();
          this.CalculateGrossAmount();
          this.CalculateNetAmount();
          this.CalculateRoundedOff();
          this.$CompacctAPI.compacctSpinnerHide();
        });
    }
  }
  // ACCEPT
  AcceptStockTransfer(obj) {
    this.AcceptStockModalTitle = undefined;
    this.AcceptProductList =[];
    this.AcceptStockDocNo = undefined;
    if(obj.Doc_No) {  
     this.AcceptStockDocNo = obj.Doc_No;
     this.AcceptStockModalTitle = obj.F_Cost_Cen_ID == this.$CompacctAPI.CompacctCookies.Cost_Cen_ID ? 'Edit Product' : obj.T_Cost_Cen_ID == this.$CompacctAPI.CompacctCookies.Cost_Cen_ID ? 'Accept Challan' : '-';
     this.GetAcceptProduct(obj.Doc_No);
     
    }
  }
  GetAcceptProduct(docId) {
    this.AcceptProductList = [];
    if(docId) {
      const obj = {
        "SP_String": "SP_GRN_Stock_Transfer",
        "Report_Name_String": "Get_Product_Stock_Popup",
        "Json_Param_String" : JSON.stringify([{'Doc_No' : docId}])
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
           console.log(data);
           data.forEach(element => {
            element.issue_flag = this.AcceptStockModalTitle === 'Edit Product' ? true : false ;
           });
           this.AcceptProductList = data.length ? data : [];
           this.AcceptStockModal = true;
      });
    }

  }
  checkIfExceed1(i) {
    if(this.AcceptProductList[i].Product_ID) {
      const flag = this.AcceptProductList[i].Serial_No ? true : false;
      if(flag) {
        const issueQty = this.AcceptProductList[i].Issue_Qty.toString();
        if((issueQty != '0' && issueQty != '1')) {
          this.AcceptProductList[i].Issue_Qty = 0;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Validation",
            detail: "Put Qty 1 for Serial No."
          });
          return false;
        }
      }
    }
  }
  checkIfExceed(i) {
    if(this.AcceptProductList[i].Product_ID) {
      const flag = this.AcceptProductList[i].Serial_No ? true : false;
      if(flag) {
        const AcceptQty = this.AcceptProductList[i].Accept_Qty.toString();
        if((AcceptQty != '0' && AcceptQty != '1')) {
          this.AcceptProductList[i].Accept_Qty = 0;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Validation",
            detail: "Accept Qty Can't be higher than Issue Qty"
          });
          return false;
        }
      } else {
        if(Number(this.AcceptProductList[i].Issue_Qty) < Number(this.AcceptProductList[i].Accept_Qty)) {
          this.AcceptProductList[i].Accept_Qty = 0;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Validation",
            detail: "Accept Qty Can't be higher than Issue Qty"
          });
          return false;
         }
      }
     
    }
  }
  SaveAcceptStockTransfer() {
    if(this.AcceptStockDocNo && this.AcceptProductList.length) {
       const TempArr = this.AcceptProductList.map(el=>({...el, Doc_No : this.AcceptStockDocNo,User_ID : this.$CompacctAPI.CompacctCookies.User_ID}));
       console.log(TempArr); 
       const obj = {
          "SP_String": "SP_GRN_Stock_Transfer",
          "Report_Name_String": "Update_Product_Stock_Popup",
          "Json_Param_String" : JSON.stringify(TempArr)
        }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
            console.log(data);
            if (data[0].message) {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: this.AcceptStockDocNo,
                detail: "Succesfully Updated"
              });
            } else {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message",
                detail: "Error Occured "
              });
            }
            this.AcceptStockModalTitle = undefined;
            this.AcceptStockDocNo = undefined;
            this.AcceptProductList = [];
            this.AcceptStockModal = false;
            this.SearchStockBill(true);
      });
    }

  }
  // DELETE
  onConfirm() {
    if (this.stockDocNo) {
      this.$http
        .post(this.urlService.deletestocktransfer, { id: this.stockDocNo })
        .subscribe((data: any) => {
          if (data.success === true) {
            this.SearchStockBill(true);
            this.onReject();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: this.stockDocNo,
              detail: "Succesfully Deleted"
            });
          }
        });
    }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  DeleteStockTransfer(obj) {
    this.stockDocNo = undefined;
    if (obj.Doc_No) {
      this.stockDocNo = obj.Doc_No;
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
  // PDF
  getAspxForPrint (){
    this.$http
    .get("/INV_Txn_St_Trf_GST/Get_Stock_Transfer_Aspx")
    .subscribe((data: any) => {
      this.aspxFileName = data;
    });
  }
  GetPDF(obj) {
    if (obj.Doc_No) {
      window.open(
        "/Report/Crystal_Files/Stock/Stock_Transfer/"+ this.aspxFileName+"?Doc_No=" +
          obj.Doc_No,
        "mywindow",
        "fullscreen=yes, scrollbars=auto,width=950,height=500"
      );
    }
  }

  //  EWAY BILL
  EwayUpdateModal(obj) {
    this.EwayFormSubmitted = false;
    this.EwayDocNo = "";
    this.EwayDate = undefined;
    this.EwayBillNo = undefined;
    this.EwayDateProto = undefined;
    if (obj.Doc_No) {
      this.displayEwayModal = true;
      this.EwayBillNo =
        obj.Eway_Bill_No === "Not Generated" ? "" : obj.Eway_Bill_No;
      this.EwayDateProto =
        obj.Eway_Bill_Date === "01-01-1900"
          ? moment(new Date(), "YYYY-MM-DD")
          : moment(obj.Eway_Bill_Date, "DD-MM-YYYY");
      this.EwayDocNo = obj.Doc_No;
    }
  }
  ewaydatechange(obj) {
    this.EwayDate = undefined;
    if (obj) {
      this.EwayDateProto = obj;
      this.EwayDate = this.DateService.dateConvert(
        moment(obj, "YYYY-MM-DD")["_d"]
      );
    }
  }
  EwayUpdate(valid) {
    this.EwayFormSubmitted = true;
    if (valid) {
      const obj = new HttpParams()
        .set("Doc_No", this.EwayDocNo.toString())
        .set("Eway_Bill_No", this.EwayBillNo.toString())
        .set(
          "Eway_Bill_Date",
          this.EwayDate
            ? this.EwayDate
            : this.DateService.dateConvert(new Date())
        );

      this.$http
        .post(this.urlService.updateEwayBillstocktransfer, obj)
        .subscribe((data: any) => {
          if (data.success) {
            this.SearchStockBill(true);
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: data.Doc_No,
              detail: "Succesfully Eway Bill No. Updated"
            });
            this.displayEwayModal = false;
          }
        });
    }
  }
}

class SearchStock {
  from_date: string;
  to_date: string;
  User_ID: number;
  F_Cost_Cen_ID: number;
  T_Cost_Cen_ID: number;
}
class FromCostcenter {
  F_Cost_Cen_ID: number;
  F_Cost_Cen_Name: string;
  F_Cost_Cen_Address1: string;
  F_Cost_Cen_Address2: string;
  F_Cost_Cen_Location: string;
  F_Cost_Cen_District: string;
  F_Cost_Cen_State: string;
  F_Cost_Cen_Country: string;
  F_Cost_Cen_PIN: number;
  F_Cost_Cen_Mobile: number;
  F_Cost_Cen_Phone: number;
  F_Cost_Cen_Email1: string;
  F_Cost_Cen_VAT_CST: number;
  F_Cost_Cen_CST_NO: number;
  F_Cost_Cen_SRV_TAX_NO: number;
  F_Cost_Cen_GST_No: string;
}
class ToCostcenter {
  T_Cost_Cen_ID: number;
  T_godown_id: number;
  T_Cost_Cen_Name: string;
  T_Cost_Cen_Address1: string;
  T_Cost_Cen_Address2: string;
  T_Cost_Cen_Location: string;
  T_Cost_Cen_District: string;
  T_Cost_Cen_State: string;
  T_Cost_Cen_Country: string;
  T_Cost_Cen_PIN: number;
  T_Cost_Cen_Mobile: number;
  T_Cost_Cen_Phone: number;
  T_Cost_Cen_Email1: string;
  T_Cost_Cen_VAT_CST: number;
  T_Cost_Cen_CST_NO: number;
  T_Cost_Cen_SRV_TAX_NO: number;
  T_Cost_Cen_GST_No: string;
}
class StockBill {
  Doc_No: string;
  Doc_Date: string;

  Trf_Line_No: string;
  Project_ID: string;
  CN_No: string;
  CN_Date: any;
  User_ID: string;
  Entry_Date: string;
  Remarks: string;
  Line_No: string;
  Type_ID = 14;
  Previous_Doc_No: string;
  Courrier_Name: string;
  Courrier_ID: string;
  Currency_Symbol: string;
  Dispatch_Through: string;
  Other_Reference: string;
  Eway_Bill_No: string;
  Eway_Bill_Date = "1" + "/" + "Jan" + "/" + "1900";
  Payment_Terms: string;

  Total_Amount: number;
  Discount_Amount: number;
  Taxable_Amt: number;
  Net_Amt: number;
  Tax_Amt = 0;
  CGST_Amt: number;
  SGST_Amt: number;
  IGST_Amt: number;
  Gross_Amt: number;
  ROUNDED_OFF: number;
  // User_ID: number;
  // Posted_ON: number;
  // Cost_Cen_ID: number;
  // Project_ID: number;

  // Bill_Type: string;
  // For_Use_Of: string;
  // Pur_From: string;
  // Tax_Applicable: string;
  // Against_C_Form: string;

  // PAN_No: string;
  // TAN_No: string;
  // C_Form_No: string;
  // Status =  'A';
  // CST_No: string;
  // Sub_Ledger_GST: string;
  // CN_Date: string;
  // CN_No: number;
  // Payment_Terms: string;
  // Dispatch_Through: string;
  // Other_Reference: string;
  // Remarks: string;
  // Supplier_Reference: string;

  // Pur_Order_No: string;
  // Order_Date: string;
  // Current_Due: number;
}
class ProductInfo {
  Product_ID: number;
  Product_Name: string;
  Batch_Number: string;
  Serial_No: string;
  Is_Service: string;
  HSL_No: string;
  Product_Specification: string;
  Qty: number;
  UOM: string;
  Rate: number;
  MRP = 0;
  Amount: number;
  Discount_Type: string;
  Discount: string;
  Discount_Type_Amount: number;
  Taxable_Amount: number;

  CGST_Rate: number;
  CGST_Amount: number;
  SGST_Rate: number;
  SGST_Amount: number;
  IGST_Rate: number;
  IGST_Amount: number;

  Cat_ID: number;
  Cat_Name: string;
  F_godown_id: number;
  godown_name: string;
  Ledger_ID: number;
  Excise_Tax: string;
  Excise_Tax_Percentage: string;

  Discount_Ledger_ID: number;

  Product_ID_AO: string;
  Qty_AO: string;
  Previous_Doc_No: string;

  IGST_Input_Ledger_ID: number;
  IGST_Input_Rate: number;
  IGST_Input_Amt: number;
  IGST_Output_Ledger_ID: number;
  IGST_Output_Rate: number;
  IGST_Output_Amt: number;

  CGST_Input_Ledger_ID: number;
  CGST_Input_Rate: number;
  CGST_Input_Amt: number;
  CGST_Output_Ledger_ID: number;
  CGST_Output_Rate: number;
  CGST_Output_Amt: number;

  SGST_Input_Ledger_Id: number;
  SGST_Input_Rate: number;
  SGST_Input_Amt: number;
  SGST_Output_Ledger_ID: number;
  SGST_Output_Rate: number;
  SGST_Output_Amt: number;
}

class VoucherCommon {
  Voucher_Type_ID = 14;
  Voucher_No: string; // return value
  Voucher_Date: string; // doc date
  Reconsil_Date = 1 + "/" + "Jan" + "/" + 1900;
  Reconsil_Tag = "N";
  Fin_Year_ID: string;
  Naration = "";
  Cost_Cen_ID_Trn = 0; // Revenue Cost Center
  Project_ID: string;
  Auto_Posted = "N";
  Posted_On: string;
  User_ID: string;
  Status = "A";
  Prev_doc_no = "";
  Foot_Fall_ID = 0;
  Cost_Head_ID = 0;
  Cheque_No = "";
  Cheque_Date = 1 + "/" + "Jan" + "/" + 1900;
  Bank_Name = "";
  Bank_Txn_Type = "";
  Bank_Branch_Name = "";
}
class VoucherTopper {
  Ledger_ID: string;
  Sub_Ledger_ID: string;
  DR_Amt: string; // net amount
  CR_Amt = 0;
  Is_Topper = "Y";
  Cost_Cen_ID: string;
}
