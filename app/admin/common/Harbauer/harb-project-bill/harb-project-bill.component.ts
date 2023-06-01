import { filter, ignoreElements, tap } from 'rxjs/operators';
import { DateTimeConvertService } from './../../../shared/compacct.global/dateTime.service';
import { CompacctHeader } from './../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from './../../../shared/compacct.services/compacct.global.api.service';
import { CompacctCommonApi } from './../../../shared/compacct.services/common.api.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { map, catchError } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { data } from 'jquery';
import { throws } from 'assert';

@Component({
  selector: 'app-harb-project-bill',
  templateUrl: './harb-project-bill.component.html',
  styleUrls: ['./harb-project-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HarbProjectBillComponent implements OnInit {
  items:any = []
  tabIndexToView:any = 0
  buttonname = "Create";
  Ref_Date:Date = new Date();
  AddSpinner:boolean = false;
  AllSubledger:any = [];
  ObjProjectBill : ProjectBill = new ProjectBill()
  projectList:any = []
  WorkDetalisList:any = []
  ProductList:any = []
  stateList:any = []
  costCenterList:any = []
  addProductList:any = []
  ProductDetailsFormSubmit:boolean = false
  projuctBillDetailsFormSubmit:boolean = false
  ObjProductDetalis:ProductDetalis  = new ProductDetalis()
  Spinner:boolean = false
  grCGST:number = 0;
  grSGST:number = 0;
  grIGST:number = 0;
  grTaxable:number = 0;
  grNetAMt:number = 0;
  grTotalAmt:number = 0
  getAllDataList:any = [];
  backUpgetAllDataList:any = []
  DynamicHeader:any = []
  fullAddress:string = ""
  ShippingStateCode:any = undefined
  CostCenCode:any = undefined
  totalAmt:any = undefined
  DiscountTypeList = [{Dtype : '%'},{Dtype : "AMT"}]
  grDiscount:any = undefined
  Doc_Date:Date = new Date()
  ObjBrowse : Browse = new Browse();
  seachSpinner:boolean = false
  initDate:any = [];
  DocNo:any = undefined
  distRefNo:any = []
  selectDistRefNo:any = []
  distCustomerName:any = []
  seleteDistCustomerName:any = []
  DistProjectDescription:any =[]
  seleteDistProjectDescription:any = []
  ObjCol = {}
  overlayPanelText= ""
  constructor(
    public $http: HttpClient,
    public commonApi: CompacctCommonApi,
    private GlobalAPI:CompacctGlobalApiService,
    public Header: CompacctHeader,
    public DateService: DateTimeConvertService,
    public compacctToast: MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Sale Bill Project",
      Link: "Project Management -> Sale Bill Project"
    })
   this.onLoadData()
  }
  onLoadData(){
    const objProject = {
      "SP_String": "SP_Task_Management_Tender",
      "Report_Name_String":"Get_Project_All",
     }
     const objState = {
      "SP_String": "SP_Sale_Bill_Harbauer",
      "Report_Name_String":"Get_State_With_Code",
     }
     const objCostCenter = {
      "SP_String": "SP_Sale_Bill_Harbauer",
      "Report_Name_String":"Get_Cost_Center_with_State",
     }
    forkJoin([
      this.$http.get('Common/Get_Subledger_DR').pipe(
        map((x:any)=> x ? JSON.parse(x) : [] ),
        tap((y:any)=> y ?  y.forEach(x => {
          x.label = x.Sub_Ledger_Name,
          x.value = x.Sub_Ledger_ID
        }) : [])
      ),
      this.GlobalAPI.getData(objProject),
      this.GlobalAPI.getData(objState),
      this.GlobalAPI.getData(objCostCenter),
    ]).subscribe(([dataSubledger,dataProject,dataState,dataCostCenter])=>{
      this.AllSubledger = dataSubledger
     // // console.log("AllSubledger",this.AllSubledger)
      this.projectList = dataProject
      //// console.log("projectList",this.projectList)
      this.stateList = dataState
      //// console.log("stateList",this.stateList)
      this.costCenterList = dataCostCenter;
     // // console.log("costCenterList",this.costCenterList)
      this.ObjProjectBill.Cost_Cen_ID = this.costCenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined
      this.ObjBrowse.Cost_Cen_ID = this.costCenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined
      this.getAllData()
      this.changeCostCenter(this.ObjProjectBill.Cost_Cen_ID)
    })
  }

  clearData(){
    this.ProductDetailsFormSubmit = false
    this.addProductList = []
    this.ObjProjectBill = new ProjectBill()
    this.ObjProductDetalis = new ProductDetalis()
    this.ObjProjectBill.Cost_Cen_ID = this.costCenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined
    this.CostCenCode = undefined
    this.changeCostCenter(this.ObjProjectBill.Cost_Cen_ID)
    this.projuctBillDetailsFormSubmit = false
    this.totalAmt = undefined
    this.Spinner = false
    this.grCGST = 0;
    this.grSGST = 0;
    this.grIGST = 0;
    this.grTaxable = 0;
    this.grNetAMt = 0;
    this.grDiscount = 0
    this.grTotalAmt = 0
    this.fullAddress = ""
    this.ShippingStateCode = undefined
    this.totalAmt = undefined
    this.grDiscount = undefined
    this.Doc_Date = new Date
    this.addProductList = []
    this.Ref_Date = new Date();
    this.AddSpinner = false;
    this.seachSpinner = false;
    this.DocNo = undefined
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("d");
  }
  SubledgerChange(){
   if(this.ObjProjectBill.Sub_Ledger_ID){
    const obj = {
      "SP_String": "SP_Sale_Bill_Harbauer",
      "Report_Name_String":"Get_Sub_Ledger_Address",
      "Json_Param_String": JSON.stringify([{Sub_Ledger_ID : Number(this.ObjProjectBill.Sub_Ledger_ID)}])
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
       // console.log(data)
       this.fullAddress = data[0].Address_1 + data[0].Address_2 + data[0].Address_3
       this.ObjProjectBill.Sub_Ledger_Address_1 = data[0].Address_1 
       this.ObjProjectBill.Sub_Ledger_Address_2 = data[0].Address_2
       this.ObjProjectBill.Sub_Ledger_Address_3 = data[0].Address_3
       this.ObjProjectBill.Sub_Ledger_Land_Mark = data[0].Land_Mark
       this.ObjProjectBill.Sub_Ledger_District = data[0].District
       this.ObjProjectBill.Sub_Ledger_State = data[0].State
       this.ObjProjectBill.Sub_Ledger_Pin = data[0].Pin
       this.ObjProjectBill.Sub_Ledger_GST_No = data[0].Sub_Ledger_GST_No
       this.ObjProjectBill.Shipping_GST_No = data[0].Sub_Ledger_GST_No
       this.ObjProjectBill.Shipping_Place_Of_Supply = data[0].State
        const AllSubledgerFilter = this.AllSubledger.find((x:any)=> Number(x.Sub_Ledger_ID) == Number(this.ObjProjectBill.Sub_Ledger_ID))
       if(AllSubledgerFilter){
        this.ObjProjectBill.Shipping_Customer_Name = AllSubledgerFilter.Sub_Ledger_Name
       }
       
       this.changeState()
    })
   }
   else {
    this.ObjProjectBill.Sub_Ledger_GST_No = undefined
    this.ObjProjectBill.Sub_Ledger_State = undefined
    this.ObjProjectBill.Sub_Ledger_Address_1 = undefined
    this.ObjProjectBill.Sub_Ledger_District = undefined
    this.ObjProjectBill.Sub_Ledger_State = undefined
    this.ObjProjectBill.Sub_Ledger_Land_Mark = undefined
    this.ObjProjectBill.Sub_Ledger_Pin = undefined
    this.ObjProjectBill.Sub_Ledger_GST_No = undefined
   }
  }
  GetWorkDetalis(){
    if(this.ObjProductDetalis.Project_ID){
      const obj = {
        "SP_String": "SP_Sale_Bill_Harbauer",
        "Report_Name_String":"Get_Work_Details",
        "Json_Param_String": JSON.stringify([{Project_ID : this.ObjProductDetalis.Project_ID}])
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      data.forEach(el => {
          el['label'] = el.Work_Details;
          el['value'] = el.Work_Details_ID;
        });
        this.WorkDetalisList = data
         // console.log("WorkDetalisList",this.WorkDetalisList)
       })
       this.getProduct()
       this.getWorkWithDetalis()
    }
    else {
      this.WorkDetalisList = []
      this.ObjProductDetalis.Work_Details_ID = undefined
      this.getProduct()
      this.getWorkWithDetalis()
    }
   
  } 
  changeState(){
    if(this.ObjProjectBill.Shipping_Place_Of_Supply){
     const stateFilter = this.stateList.find((el:any)=> el.State_Name == this.ObjProjectBill.Shipping_Place_Of_Supply)
     if(stateFilter){
      this.ShippingStateCode = stateFilter.State_Code
     }
    }
    else {
      this.ShippingStateCode = undefined
    }
  }
  changeCostCenter(CostCenID:number){
    if(CostCenID){
    const costCenterListFilter = this.costCenterList.find((x:any)=> Number(x.Cost_Cen_ID) == Number(CostCenID) )
     if(costCenterListFilter){
      // console.log("costCenterListFilter",costCenterListFilter)
       this.ObjProjectBill.Cost_Cen_State = costCenterListFilter.State;
       this.CostCenCode = costCenterListFilter.State_Code
     }
    }
    else {
      this.ObjProjectBill.Cost_Cen_State = undefined;
       this.CostCenCode = undefined;
    }
  }
  getProduct(){
    if(this.ObjProductDetalis.Project_ID && this.ObjProductDetalis.Work_Details_ID){
      this.getWorkWithDetalis()
      const tempobj = {
        Project_ID: this.ObjProductDetalis.Project_ID,
				Work_Details_ID:this.ObjProductDetalis.Work_Details_ID
      }
      const obj = {
        "SP_String": "SP_Sale_Bill_Harbauer",
        "Report_Name_String":"Get_Product",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        data.forEach((z:any) => {
          z['label'] = z.Product_Description,
          z['value'] = z.Product_ID
        });
        this.ProductList = data

        // console.log("ProductList",this.ProductList)
      })
    }
    else {
      this.ProductList = [];
      this.ObjProductDetalis.Product_ID = undefined
      this.ObjProductDetalis.UOM = undefined;
      this.ObjProductDetalis.MRP = undefined;
      this.ObjProductDetalis.Qty = undefined;
    }
  }

  getWorkWithDetalis(){
    if(this.ObjProductDetalis.Project_ID && this.ObjProductDetalis.Work_Details_ID){
      this.ObjProductDetalis.UOM = undefined;
      this.ObjProductDetalis.MRP = undefined;
      this.ObjProductDetalis.Qty = undefined;
      const tempobj = {
        Project_ID: this.ObjProductDetalis.Project_ID,
				Work_Details_ID:this.ObjProductDetalis.Work_Details_ID
      }
      const obj = {
        "SP_String": "SP_Work_Order_Sale_Bill",
        "Report_Name_String":"Get_Details_With_Work_Details_ID",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        if(data.length){
          this.ObjProductDetalis.UOM = data[0].UOM;
          this.ObjProductDetalis.MRP = data[0].Rate;
          this.ObjProductDetalis.Qty = data[0].Qty;
        }
        
      })
    }
    else {
          this.ObjProductDetalis.UOM = undefined;
          this.ObjProductDetalis.MRP = undefined;
          this.ObjProductDetalis.Qty = undefined;
    }
  }
  getTaxableValue(){
    if(this.ObjProductDetalis.MRP && this.ObjProductDetalis.Qty && this.ObjProductDetalis.Claim_in_RA){
      const netTotal = Number(this.ObjProductDetalis.MRP) * Number(this.ObjProductDetalis.Qty)
      const claimInRa = Number(netTotal) * Number(this.ObjProductDetalis.Claim_in_RA)/100
      this.totalAmt = Number(claimInRa)
      this.ObjProductDetalis.Taxable_Amount = this.totalAmt ? this.getTofix(this.totalAmt) : 0
      if(this.totalAmt){
        this.DiscountCalculator()
      }
     
    }
    else {
      this.totalAmt= undefined
      this.ObjProductDetalis.Taxable_Amount = undefined
    }
  }
  productChange(){
    if(this.ObjProductDetalis.Product_ID){
      const ProductListFilter = this.ProductList.find((x:any)=> Number(x.Product_ID) == Number(this.ObjProductDetalis.Product_ID))
      if(ProductListFilter){
        this.ObjProductDetalis.HSL_No = ProductListFilter.HSN_No;
       }
    }
  }
  DiscountCalculator(){
    if(this.ObjProductDetalis.Discount_Type == "%"){
      if(this.ObjProductDetalis.Discount){
        this.ObjProductDetalis.Discount_Type_Amount = undefined
        this.ObjProductDetalis.Discount_Type_Amount =  Number(this.totalAmt) * Number(this.ObjProductDetalis.Discount)/100
        this.ObjProductDetalis.Taxable_Amount =  this.getTofix(Number(this.totalAmt) - Number(this.ObjProductDetalis.Discount_Type_Amount))
      }
    }
    else if(this.ObjProductDetalis.Discount_Type == "AMT"){
      if(this.ObjProductDetalis.Discount){
        this.ObjProductDetalis.Discount_Type_Amount = undefined
        this.ObjProductDetalis.Discount_Type_Amount = this.ObjProductDetalis.Discount;
        this.ObjProductDetalis.Taxable_Amount = this.getTofix(Number(this.totalAmt) - Number(this.ObjProductDetalis.Discount_Type_Amount))
      }
      
    }
    else {
      this.ObjProductDetalis.Taxable_Amount = this.totalAmt? this.getTofix(this.totalAmt) : 0
      this.ObjProductDetalis.Discount = undefined
      this.ObjProductDetalis.Discount_Type_Amount = undefined
    }
    // console.log("this.ObjProductDetalis.Discount_Type_Amount",this.ObjProductDetalis.Discount_Type_Amount)
  }
  addProductDetalis(BillingAddressvalid:any,
                    ShippingAddressvalid:any,
                    RunningAccountDetailsvalid:any,
                    BillingCostCenterDetailsvalid:any,
                    ProductDetailsvalid:any){
    this.projuctBillDetailsFormSubmit = true
    if((BillingAddressvalid && ShippingAddressvalid && RunningAccountDetailsvalid && BillingCostCenterDetailsvalid) || this.addProductList.length){
      this.ProductDetailsFormSubmit = true
      if(ProductDetailsvalid){
       this.addTotable()
      }
     
    }
   
  }
  addTotable(){
    const productlistFilter = this.ProductList.find((x:any)=> Number(x.Product_ID) == Number(this.ObjProductDetalis.Product_ID))
    const projectListFilte =  this.projectList.find((x:any) => Number(x.Project_ID) == Number(this.ObjProductDetalis.Project_ID))
    const WorkDetalisListFilter = this.WorkDetalisList.find((x:any) => Number(x.Work_Details_ID) == Number(this.ObjProductDetalis.Work_Details_ID))
     this.addProductList.push({
      Line_No: this.addProductList.length + 1,
      Project_ID : this.ObjProductDetalis.Project_ID,
      Work_Details_ID	:this.ObjProductDetalis.Work_Details_ID,
      Product_ID:this.ObjProductDetalis.Product_ID,
      Product_Name : productlistFilter ? productlistFilter.Product_Description : "NA",
      Project_Description: projectListFilte ? projectListFilte.Project_Description : "NA",
      Work_Details : WorkDetalisListFilter ? WorkDetalisListFilter.Work_Details : "NA",
      HSL_No : this.ObjProductDetalis.HSL_No,
      Batch_Number : "NA",
      Serial_No : "NA",
      UOM : this.ObjProductDetalis.UOM,
      Qty : this.ObjProductDetalis.Qty,
      MRP : this.ObjProductDetalis.MRP,
      Rate : 0,
      Discount_Type: this.ObjProductDetalis.Discount_Type,
      Discount_Type_Amount: this.ObjProductDetalis.Discount_Type_Amount ? this.getTofix(Number(this.ObjProductDetalis.Discount_Type_Amount)) : 0,
      Discount: this.ObjProductDetalis.Discount? Number(this.ObjProductDetalis.Discount) : 0,
      Amount : this.getTofix(Number(this.totalAmt)),
      Taxable_Amount : this.getTofix(this.ObjProductDetalis.Taxable_Amount),
      CGST_Rate : productlistFilter && (this.ShippingStateCode  == this.CostCenCode ) ? productlistFilter.CGST_Rate : 0,
      CGST_Amount :  productlistFilter && (this.ShippingStateCode  == this.CostCenCode ) ? 
      this.getTofix(Number(Number(this.ObjProductDetalis.Taxable_Amount) * Number(productlistFilter.CGST_Rate)/100)): 0,
      SGST_Rate : productlistFilter && (this.ShippingStateCode  == this.CostCenCode ) ? productlistFilter.SGST_Rate : 0,
      SGST_Amount : productlistFilter && (this.ShippingStateCode  == this.CostCenCode ) ? 
      this.getTofix(Number(Number(this.ObjProductDetalis.Taxable_Amount) * Number(productlistFilter.SGST_Rate)/100)): 0,
      IGST_Rate :  productlistFilter && (this.ShippingStateCode  != this.CostCenCode ) ? productlistFilter.IGST_Rate : 0,
      IGST_Amount : productlistFilter && (this.ShippingStateCode  != this.CostCenCode ) ? 
      this.getTofix(Number(Number(this.ObjProductDetalis.Taxable_Amount) * Number(productlistFilter.IGST_Rate)/100)): 0,
      Line_Total : (this.ShippingStateCode  == this.CostCenCode ) ? 
                      this.getTofix(Number(Number(this.ObjProductDetalis.Taxable_Amount) * Number(productlistFilter.CGST_Rate)/100) +  
                      Number(Number(this.ObjProductDetalis.Taxable_Amount) * Number(productlistFilter.SGST_Rate)/100) + Number(this.ObjProductDetalis.Taxable_Amount) )
                      : this.getTofix( Number(Number(this.ObjProductDetalis.Taxable_Amount) * Number(productlistFilter.IGST_Rate)/100) + Number(this.ObjProductDetalis.Taxable_Amount)),
      Bill_Net_Amt : Number(this.grNetAMt.toFixed(2)),
      Bill_Gross_Amt: Number(this.grNetAMt),
      Claim_in_RA : this.ObjProductDetalis.Claim_in_RA
     })
     // console.log("addProductList",this.addProductList)
     const tempObjProductDetalis = {...this.ObjProductDetalis}
     this.ObjProductDetalis = new ProductDetalis()
     this.ObjProductDetalis.Project_ID = tempObjProductDetalis.Project_ID
     this.ProductDetailsFormSubmit = false;
     this.totalAmt = undefined
     this.ProductList = []
     this.getGrTotal();
  }
  DeleteAddPurchase(index) {
    this.addProductList.splice(index,1);
    this.getGrTotal()
   }
   getGrTotal(){
    this.grCGST = 0;
    this.grSGST = 0;
    this.grIGST = 0;
    this.grTaxable = 0;
    this.grNetAMt = 0;
    this.grDiscount = 0
    this.grTotalAmt = 0
    this.addProductList.forEach((xz:any) => {
      this.grCGST = xz.CGST_Amount? this.grCGST + Number(xz.CGST_Amount) : 0;
      this.grSGST = xz.SGST_Amount ? this.grSGST + Number(xz.SGST_Amount) : 0;
      this.grIGST = xz.IGST_Amount ?  this.grIGST + Number(xz.IGST_Amount) : 0;
      this.grTaxable = xz.Taxable_Amount ? this.grTaxable + Number(xz.Taxable_Amount) : 0;
     // this.grNetAMt = xz.Line_Total ? this.grNetAMt + Number(xz.Line_Total) : 0;
      this.grDiscount = xz.Discount_Type_Amount ? this.grDiscount + Number(xz.Discount_Type_Amount) : 0
      this.grTotalAmt = xz.Amount ? this.grTotalAmt + Number(xz.Amount) : 0
    });
    this.grNetAMt = this.grIGST ? this.getTofix(Number(this.grTaxable)) + this.getTofix(Number(this.grIGST)) : this.getTofix(Number(this.grTaxable)) + this.getTofix(Number(this.grCGST)) + this.getTofix(Number(this.grSGST))
   }
   getTofix(key){
    return Number(Number(key).toFixed(2))
   }
   saveProject(){
     if(this.addProductList){
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
  createProjectBill(){
        const AllSubledgerFilter = this.AllSubledger.find((x:any)=>Number(x.Sub_Ledger_ID) == Number(this.ObjProjectBill.Sub_Ledger_ID))
        const costCenterListFilter = this.costCenterList.find((x:any)=> Number(x.Cost_Cen_ID) == Number(this.ObjProjectBill.Cost_Cen_ID))
        this.ObjProjectBill.Doc_Date = this.DateService.dateConvert(new Date(this.Doc_Date))
        this.ObjProjectBill.Sub_Ledger_Billing_Name = AllSubledgerFilter ? AllSubledgerFilter.Sub_Ledger_Name : "NA"
        this.ObjProjectBill.Cost_Cen_Name = costCenterListFilter ? costCenterListFilter.Cost_Cen_Name : "NA"
        this.ObjProjectBill.Bill_Gross_Amt = this.getTofix(Number(this.grTotalAmt))
        this.ObjProjectBill.Bill_Net_Amt = this.RoundOff(Number(this.grNetAMt))
        this.ObjProjectBill.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
        this.ObjProjectBill.Fin_Year_ID = this.$CompacctAPI.CompacctCookies.Fin_Year_ID;
        this.ObjProjectBill.Total_Discount = Number(this.getTofix(this.grDiscount))
        this.ObjProjectBill.Taxable_Amount = Number(this.getTofix(this.grTaxable))
        this.ObjProjectBill.Total_CGST_Amount = Number(this.getTofix(this.grCGST))
        this.ObjProjectBill.Total_SGST_Amount = Number(this.getTofix(this.grSGST))
        this.ObjProjectBill.Total_IGST_Amount = Number(this.getTofix(this.grIGST))
        this.ObjProjectBill.Tax_Amt = this.getTofix(Number(this.grCGST) + Number(this.grIGST) + Number(this.grSGST))
        this.ObjProjectBill.Term_Amt = 0
        this.ObjProjectBill.Rounded_Off = this.getTofix( Math.round(Number((Number(this.grNetAMt).toFixed(2)))) - Number((Number(this.grNetAMt).toFixed(2))))
        this.ObjProjectBill.Ref_Date = this.DateService.dateConvert(this.Ref_Date)
        this.ObjProjectBill.Percentage_claimed_Previous_Bills = Number(this.ObjProjectBill.Percentage_claimed_Previous_Bills)
        this.ObjProjectBill.Percentage_claimed_This_Bill = Number(this.ObjProjectBill.Percentage_claimed_This_Bill)
        this.ObjProjectBill.Percentage_claimed_upto_date = Number(this.ObjProjectBill.Percentage_claimed_upto_date)
        this.ObjProjectBill.Total_Work_Order_Value = Number(this.ObjProjectBill.Total_Work_Order_Value)
        this.ObjProjectBill.Shipping_State_Code = this.ShippingStateCode
        this.ObjProjectBill.L_element = this.addProductList
      // console.log("ObjProjectBill",this.ObjProjectBill)
        const obj = {
          "SP_String": "SP_Sale_Bill",
          "Report_Name_String":"Sale_Bill_Create",
          "Json_Param_String": JSON.stringify([this.ObjProjectBill])
        }
        this.GlobalAPI.postData(obj).subscribe((data:any)=>{
          // console.log("After Save",data)
          if(data[0].Success == "True"){
            this.clearData();
            this.compacctToast.clear();
            this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Sale Bill Project",
            detail: "Succesfully Created " 
          });
          }
          else{
            this.onReject()
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: data[1].Error
            })
          }
        
        })
      
    }
 
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.From_Date = dateRangeObj[0];
      this.ObjBrowse.To_Date = dateRangeObj[1];
    }
    }
  getAllData(valid?:any){
    this.seachSpinner = true;
    this.ObjBrowse.From_Date = this.ObjBrowse.From_Date
                              ? this.DateService.dateConvert(new Date(this.ObjBrowse.From_Date))
                              : this.DateService.dateConvert(new Date());
    this.ObjBrowse.To_Date = this.ObjBrowse.To_Date
                            ? this.DateService.dateConvert(new Date(this.ObjBrowse.To_Date))
                            : this.DateService.dateConvert(new Date());
    this.ObjBrowse.Cost_Cen_ID = this.ObjBrowse.Cost_Cen_ID ? Number(this.ObjBrowse.Cost_Cen_ID) : 0
    const obj = {
      "SP_String": "SP_Sale_Bill",
      "Report_Name_String": "Sale_Bill_Browse",
      "Json_Param_String": JSON.stringify([this.ObjBrowse])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data)
      // console.log("data",JSON.parse(data[0].Data))
      if(data[0].Success == "True"){  
        this.getAllDataList = data[0].Data ? JSON.parse(data[0].Data) : []
        this.backUpgetAllDataList = this.getAllDataList
        this.GetDistinct()
        if(this.getAllDataList.length){
          this.DynamicHeader = Object.keys(this.getAllDataList[this.getAllDataList.length - 1]);
          // console.log("DynamicHeader",this.DynamicHeader)
        }
        
      }
      else{
        
        this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "error",
             summary: "Warn Message",
             detail: data[1].Error
           })
      }
      this.seachSpinner = false
    })
  }

  // DISTINCT & FILTER
  GetDistinct() {
    // console.log("DISTINCT")
    let RefNo:any = [];
    let CustomerName:any = [];
    let ProjectDescription:any = []
    this.distRefNo =[];
    this.selectDistRefNo =[];
    this.distCustomerName =[];
    this.seleteDistCustomerName =[];
    this.DistProjectDescription = []
    this.seleteDistProjectDescription = []
   let SearchFields:any =[];
    this.getAllDataList.forEach((item) => {
   if (RefNo.indexOf(item.Ref_No) === -1) {
    RefNo.push(item.Ref_No);
   this.distRefNo.push({ label: item.Ref_No, value: item.Ref_No });
   }
  if (CustomerName.indexOf(item.Customer_Name) === -1) {
    CustomerName.push(item.Customer_Name);
    this.distCustomerName.push({ label: item.Customer_Name, value: item.Customer_Name });
    }
    if (ProjectDescription.indexOf(item.Project_Description) === -1) {
      ProjectDescription.push(item.Project_Description);
      this.DistProjectDescription.push({ label: item.Project_Description, value: item.Project_Description });
      }
  });
     this.backUpgetAllDataList = [...this.getAllDataList];
  }
  FilterDist() {
    let RefNo:any = [];
    let CustomerName:any = [];
    let ProjectDescription:any = []
    let SearchFields:any =[];
  if (this.selectDistRefNo.length) {
    SearchFields.push('Ref_No');
    RefNo = this.selectDistRefNo;
  }
  if (this.seleteDistCustomerName.length) {
    SearchFields.push('Customer_Name');
    CustomerName = this.seleteDistCustomerName;
  }
  if (this.seleteDistProjectDescription.length) {
    SearchFields.push('Project_Description');
    ProjectDescription = this.seleteDistProjectDescription;
  }
  this.getAllDataList = [];
  if (SearchFields.length) {
    let LeadArr = this.backUpgetAllDataList.filter(function (e) {
      return (RefNo.length ? RefNo.includes(e['Ref_No']) : true)
      && (CustomerName.length ? CustomerName.includes(e['Customer_Name']) : true)
      && (ProjectDescription.length ? ProjectDescription.includes(e['Project_Description']) : true)
    });
  this.getAllDataList = LeadArr.length ? LeadArr : [];
  } else {
  this.getAllDataList = [...this.backUpgetAllDataList] ;
  }
  }
  DeleteProjectBill(col:any){
   if(col.Doc_No){
     this.DocNo = col.Doc_No
     this.compacctToast.clear();
      this.compacctToast.add({
        key: "d",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
   }
  }
  onConfirm(){
    if(this.DocNo){
      const tempObj = {
        Doc_No: this.DocNo,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID
      }
      const obj = {
        "SP_String": "SP_Sale_Bill",
        "Report_Name_String":"Sale_Bill_Delete",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        if(data[0].Success == "True"){
          this.getAllData()
          this.DocNo = undefined
          this.compacctToast.clear();
           this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Sale Bill Project",
           detail: "Succesfully Created " 
         });
        }
        else{
          this.onReject()
          this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "error",
             summary: "Warn Message",
             detail: data[1].Error
           })
        }
      })
    }
  }
  RoundOff(key:any){
    return Math.round(Number(Number(key).toFixed(2)))
  }
  roundOffValue(){
    return this.getTofix( Math.round(Number((Number(this.grNetAMt).toFixed(2)))) - Number((Number(this.grNetAMt).toFixed(2))))
  }
  CalClaimupto(){
    if(this.ObjProjectBill.Percentage_claimed_Previous_Bills && this.ObjProjectBill.Percentage_claimed_This_Bill){
      this.ObjProjectBill.Percentage_claimed_upto_date = this.getTofix(Number(this.ObjProjectBill.Percentage_claimed_Previous_Bills) + Number(this.ObjProjectBill.Percentage_claimed_This_Bill))
    }
    else{
      this.ObjProjectBill.Percentage_claimed_upto_date = undefined
    }
  }
  Print(col:any) {
    if(col.Doc_No) {
    const objtemp = {
      "SP_String": "SP_Work_Order_Sale_Bill",
      "Report_Name_String": "Print_Sale_bill"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Doc_No=" + col.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      // // console.log("doc===",DocNo.Doc_No)
    })
    }
  }
  stringShort(str,wh) {
    let retuObj:any = {}
    if(str){
      if (str.length > 30) {
        retuObj = {
          field: str.substring(0, 30) + " ...",
          cssClass : "txt"
        }
      }
      else {
         retuObj = {
          field: str,
          cssClass : ""
        }
      }
    }
   
  return wh == "css" ? retuObj.cssClass : retuObj.field
  }
  selectWork(event,text, overlaypanel) {
    //console.log("col",col)
    if (text.length > 30) {
      this.ObjCol = {}
      this.overlayPanelText= ""
     this.overlayPanelText = text
     overlaypanel.toggle(event); 
    }
   
    }
}
class ProjectBill{
      Doc_Date:any
			Sub_Ledger_ID:any
			Sub_Ledger_Name	:any	
			Sub_Ledger_Billing_Name:any
			Sub_Ledger_Address_1:any	
			Sub_Ledger_Address_2:any
			Sub_Ledger_Address_3:any
			Sub_Ledger_Land_Mark:any
			Sub_Ledger_Pin:any
			Sub_Ledger_District:any
			Sub_Ledger_State:any
			Sub_Ledger_Country:any
			Sub_Ledger_GST_No:any
			Cost_Cen_ID	:any
			Cost_Cen_Name:any
			Cost_Cen_Address1:any
			Cost_Cen_Address2:any
			Cost_Cen_Location:any
			Cost_Cen_District:any
			Cost_Cen_State:any
			Cost_Cen_Country:any
			Cost_Cen_PIN:any
			Cost_Cen_Mobile:any
			Cost_Cen_Phone:any
			Cost_Cen_Email:any
			Cost_Cen_VAT_CST:any
			Cost_Cen_CST_NO:any	
			Cost_Cen_SRV_TAX_NO:any
			Cost_Cen_GST_No:any
			Bill_Gross_Amt:any
			Bill_Net_Amt:any
			User_ID:any
			Fin_Year_ID	:any
      Shipping_Customer_Name:any
      State_Code:any
      cost_state_code:any
      Cost_State:any
      Total_Discount:any
		  Taxable_Amount:any
		  Total_CGST_Amount:any
			Total_SGST_Amount:any
			Total_IGST_Amount:any
			Tax_Amt:any
			Term_Amt:any
			Rounded_Off:any
			Ref_NO:any
			Ref_Date:any
		  Shipping_Site_Address:any
			Shipping_Place_Of_Supply:any
			Shipping_State_Code:any
			Shipping_GST_No:any
			Percentage_claimed_Previous_Bills:any
			Percentage_claimed_This_Bill:any
		  Percentage_claimed_upto_date:any
			Total_Work_Order_Value:any
			Running_Bill_Status:any
			Name_Of_the_Work:any
      L_element:any
}

class ProductDetalis{
      Project_ID:any		
      Work_Details_ID	:any		
      Product_ID:any	
      Product_Name:any
      HSL_No:any
      UOM:any	
      Qty:any
      MRP:any
      Rate:any
      Amount:any 
      Discount_Type:any
      Discount_Type_Amount:any
      Discount:any
      Claim_in_RA:any
      Taxable_Amount:any
      CGST_Rate:any
      CGST_Amount:any
      SGST_Rate:any
      SGST_Amount:any
      IGST_Rate:any 
      IGST_Amount:any 
      Line_No:any 
      Line_Total:any
}
class Browse {
  Cost_Cen_ID:any = 0;
  From_Date : any ;
  To_Date : any;
}