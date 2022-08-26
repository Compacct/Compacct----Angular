import { filter, tap } from 'rxjs/operators';
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
  getAllDataList:any = [];
  DynamicHeader:any = []
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
      Header: "Project Bill",
      Link: "Project Management -> Project Bill"
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
      console.log("AllSubledger",this.AllSubledger)
      this.projectList = dataProject
      console.log("projectList",this.projectList)
      this.stateList = dataState
      console.log("stateList",this.stateList)
      this.costCenterList = dataCostCenter;
      console.log("costCenterList",this.costCenterList)
      this.ObjProjectBill.Cost_Cen_ID = this.costCenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined
      this.changeCostCenter(this.ObjProjectBill.Cost_Cen_ID)
    })
  }

  clearData(){
    this.ProductDetailsFormSubmit = false
    this.addProductList = []
    this.ObjProjectBill = new ProjectBill()
    this.ObjProductDetalis = new ProductDetalis()
    this.ObjProjectBill.Cost_Cen_ID = this.costCenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined
    this.changeCostCenter(this.ObjProjectBill.Cost_Cen_ID)
    this.projuctBillDetailsFormSubmit = false
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  onReject(){
    this.compacctToast.clear("c");
  }
  SubledgerChange(){
   if(this.ObjProjectBill.Sub_Ledger_ID){
    this.$http.get('Common/Get_Sub_Ledger_Address_Details?Sub_Ledger_ID='+(this.ObjProjectBill.Sub_Ledger_ID))
    .pipe(map((res:any)=> res ? JSON.parse(res) : [])).subscribe((data:any)=>{
       console.log(data)
       this.ObjProjectBill.Sub_Ledger_GST_No = data[0].Sub_Ledger_GST_No
       this.ObjProjectBill.State_Name = data[0].State
       this.ObjProjectBill.Address_1 = data[0].Address_1
       this.ObjProjectBill.District = data[0].District
       this.ObjProjectBill.State = data[0].State
       this.ObjProjectBill.Land_Mark = data[0].Land_Mark
       this.ObjProjectBill.Pin = data[0].Pin
       this.ObjProjectBill.Bill_GST = data[0].Sub_Ledger_GST_No
       const AllSubledgerFilter = this.AllSubledger.find((x:any)=> Number(x.Sub_Ledger_ID) == Number(this.ObjProjectBill.Sub_Ledger_ID))
       if(AllSubledgerFilter){
        this.ObjProjectBill.Customer_Name = AllSubledgerFilter.Sub_Ledger_Name
       }
       
       this.changeState()
    })
   }
   else {
       this.ObjProjectBill.Sub_Ledger_GST_No = undefined;
       this.ObjProjectBill.State_Name = undefined;
       this.ObjProjectBill.Address_1 =undefined;
       this.ObjProjectBill.District = undefined;
       this.ObjProjectBill.State = undefined;
       this.ObjProjectBill.Land_Mark =undefined;
       this.ObjProjectBill.Pin = undefined;
       this.ObjProjectBill.Customer_Name  = undefined;
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
         this.WorkDetalisList = data
         console.log("WorkDetalisList",this.WorkDetalisList)
       })
       this.getProduct()
    }
    else {
      this.WorkDetalisList = []
      this.ObjProductDetalis.Work_Details_ID = undefined
      this.getProduct()
    }
   
  } 
  changeState(){
    if(this.ObjProjectBill.State_Name){
     const stateFilter = this.stateList.find((el:any)=> el.State_Name == this.ObjProjectBill.State_Name)
     if(stateFilter){
      this.ObjProjectBill.State_Code = stateFilter.State_Code
     }
    }
    else {
      this.ObjProjectBill.State_Code = undefined
    }
  }
  changeCostCenter(CostCenID:number){
    if(CostCenID){
    const costCenterListFilter = this.costCenterList.find((x:any)=> Number(x.Cost_Cen_ID) == Number(CostCenID) )
     if(costCenterListFilter){
       this.ObjProjectBill.Cost_State = costCenterListFilter.State;
       this.ObjProjectBill.cost_state_code = costCenterListFilter.State_Code
     }
    }
    else {
      this.ObjProjectBill.Cost_State = undefined;
       this.ObjProjectBill.cost_state_code = undefined;
    }
  }
  getProduct(){
    if(this.ObjProductDetalis.Project_ID && this.ObjProductDetalis.Work_Details_ID){
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
        this.ProductList = data
        console.log("ProductList",this.ProductList)
      })
    }
    else {
      this.ProductList = [];
      this.ObjProductDetalis.Product_ID = undefined
    }
  }
  getTaxableValue(){
    if(this.ObjProductDetalis.MRP && this.ObjProductDetalis.Qty && this.ObjProductDetalis.Claim_in_RA){
      const netTotal = Number(this.ObjProductDetalis.MRP) * Number(this.ObjProductDetalis.Qty)
      const claimInRa = Number(Number(netTotal) * Number(this.ObjProductDetalis.Claim_in_RA)/100).toFixed(2)
      this.ObjProductDetalis.Taxable_Amount = Number(claimInRa)
    }
    else {
      this.ObjProductDetalis.Taxable_Amount = undefined
    }
  }
  productChange(){
    if(this.ObjProductDetalis.Product_ID){
      const ProductListFilter = this.ProductList.find((x:any)=> Number(x.Product_ID) == Number(this.ObjProductDetalis.Product_ID))
      if(ProductListFilter){
        this.ObjProductDetalis.HSL_No = ProductListFilter.HSN_No;
        this.ObjProductDetalis.UOM = ProductListFilter.UOM;
        this.ObjProductDetalis.MRP = ProductListFilter.Sale_Rate;
      }
    }
  }
  addProductDetalis(valid:any){
    this.ProductDetailsFormSubmit = true
   if(valid){
    const productlistFilter = this.ProductList.find((x:any)=> Number(x.Product_ID) == Number(this.ObjProductDetalis.Product_ID))
    const projectListFilte =  this.projectList.find((x:any) => Number(x.Project_ID) == Number(this.ObjProductDetalis.Project_ID))
    const WorkDetalisListFilter = this.WorkDetalisList.find((x:any) => Number(x.Work_Details_ID) == Number(this.ObjProductDetalis.Work_Details_ID))
     this.addProductList.push({
      Project_ID : this.ObjProductDetalis.Product_ID,
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
      Amount : this.ObjProductDetalis.Taxable_Amount,
      Taxable_Amount : this.ObjProductDetalis.Taxable_Amount,
      CGST_Rate : productlistFilter && (this.ObjProjectBill.State_Code  == this.ObjProjectBill.cost_state_code ) ? productlistFilter.CGST_Rate : 0,
      CGST_Amount :  productlistFilter && (this.ObjProjectBill.State_Code  == this.ObjProjectBill.cost_state_code ) ? 
      Number(Number(this.ObjProductDetalis.Taxable_Amount) * Number(productlistFilter.CGST_Rate)/100): 0,
      SGST_Rate : productlistFilter && (this.ObjProjectBill.State_Code  == this.ObjProjectBill.cost_state_code ) ? productlistFilter.SGST_Rate : 0,
      SGST_Amount : productlistFilter && (this.ObjProjectBill.State_Code  == this.ObjProjectBill.cost_state_code ) ? 
      Number(Number(this.ObjProductDetalis.Taxable_Amount) * Number(productlistFilter.SGST_Rate)/100): 0,
      IGST_Rate :  productlistFilter && (this.ObjProjectBill.State_Code  != this.ObjProjectBill.cost_state_code ) ? productlistFilter.IGST_Rate : 0,
      IGST_Amount : productlistFilter && (this.ObjProjectBill.State_Code  != this.ObjProjectBill.cost_state_code ) ? 
      Number(Number(this.ObjProductDetalis.Taxable_Amount) * Number(productlistFilter.IGST_Rate)/100): 0,
      Line_Total : (this.ObjProjectBill.State_Code  == this.ObjProjectBill.cost_state_code ) ? 
                      Number(Number(this.ObjProductDetalis.Taxable_Amount) * Number(productlistFilter.CGST_Rate)/100) +  
                      Number(Number(this.ObjProductDetalis.Taxable_Amount) * Number(productlistFilter.SGST_Rate)/100) + Number(this.ObjProductDetalis.Taxable_Amount) 
                      : Number(Number(this.ObjProductDetalis.Taxable_Amount) * Number(productlistFilter.IGST_Rate)/100) + Number(this.ObjProductDetalis.Taxable_Amount),
      Bill_Net_Amt : Number(this.grNetAMt.toFixed(2)),
      Bill_Gross_Amt: Number(this.grNetAMt),
      Claim_in_RA : this.ObjProductDetalis.Claim_in_RA
     })
     const tempObjProductDetalis = {...this.ObjProductDetalis}
     this.ObjProductDetalis = new ProductDetalis()
     this.ObjProductDetalis.Project_ID = tempObjProductDetalis.Project_ID
     this.ProductDetailsFormSubmit = false;
     this.ProductList = []
     this.getGrTotal();
   }
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
    this.addProductList.forEach((xz:any) => {
      this.grCGST = this.grCGST + Number(xz.CGST_Amount);
      this.grSGST = this.grSGST + Number(xz.SGST_Amount);
      this.grIGST = this.grIGST + Number(xz.IGST_Amount);
      this.grTaxable = this.grTaxable + Number(xz.Taxable_Amount);
      this.grNetAMt = this.grNetAMt + Number(xz.Line_Total);
    });
   }
   getTofix(key){
    return key.toFixed(2)
   }
  createProjectBill(){
  }
  onConfirm(){}
 
}
class ProjectBill{
  Sub_Ledger_ID:any;
  State_Name:any;
  State_Code:any;
  Sub_Ledger_GST_No:any;
  Name_of_the_Work:any;
  Cost_Cen_ID:any;
  Cost_State:any;
  cost_state_code:any;
  Address_1:any;
  Land_Mark:any;
  District:any;
  State:any;
  Pin:any;
  Customer_Name:any;
  Bill_GST:any;
}

class ProductDetalis{
  Project_ID:any;
  Work_Details_ID:any;	
  Product_ID:any;
	Product_Name:any;
	HSL_No:any;
	Batch_Number:any;
	Serial_No:any;
	UOM:any;
	Qty:any;
	MRP:any;
	Rate:any;
	Amount:any;
	Taxable_Amount:any;
	CGST_Rate:any;
	CGST_Amount:any;
	SGST_Rate:any;
	SGST_Amount:any;
	IGST_Rate:any;
	IGST_Amount:any;
	Bill_Gross_Amt:any;
	Bill_Net_Amt:any;
  Claim_in_RA:any;
  Line_Total:any
}