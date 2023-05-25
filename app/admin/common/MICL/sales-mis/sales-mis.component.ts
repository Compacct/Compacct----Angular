import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ExportExcelService } from '../../../shared/compacct.services/export-excel.service';
@Component({
  selector: 'app-sales-mis',
  templateUrl: './sales-mis.component.html',
  styleUrls: ['./sales-mis.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class SalesMisComponent implements OnInit {
  tabIndexToView: number= 0;
  buttonname: any= "Create";
  Spinner: boolean = false;
  seachSpinner: boolean = false;
  items: any= [];
  ParameterMasterFormSubmitted: boolean= false;
  initDate: any = [];
  start_date: Date;
  end_date: Date;
  SalesMISList: any= [];
  SalesMISListHeader: any= [];
  
  LIviewPopup:boolean = false;
  LIviewList:any = [];
  DynamicLIviewList:any = [];
  
  LIviewData:any = {};
  AddProdList:any = [];
  Tax: any = undefined;
  CGST: any = undefined;
  SGST: any = undefined;
  IGST: any = undefined;
  NetAMT: any = undefined;

  PIviewData:any = {};
  PIList:any = [];
  PIPopup:boolean = false;
  PIviewList:any = [];
  PIListHeader:any = [];
  PIviewPopup:boolean = false;
  AddPIProdList:any = [];
  PITax:any = undefined;
  PICGST:any = undefined;
  PISGST:any = undefined;
  PIIGST:any = undefined;
  PINetAMT:any = undefined;

  SOPopup:boolean = false;
  SOList:any = [];
  SOListHeader:any = [];

  OCPopup:boolean = false;
  OCList:any = [];
  OCListHeader:any = [];

  SBillPopup:boolean = false;
  SBillList:any = [];
  SBillListHeader:any = [];

  RAPopup:boolean = false;
  RAList:any = [];
  RAListHeader:any = [];

  BackupSalesMISList:any = [];
  DistLiCustomer:any = [];
  SelectedDistLiCustomer:any = [];
  DistProductName:any = [];
  SelectedDistProductName:any = [];
  SearchFields:any = [];
  PendingLIfilterFLag:boolean = false;
  PendingSOfilterFLag:boolean = false;
  DIspatchMIS_start_date: Date;
  DIspatchMIS_end_date: Date;
  DispatchMISList:any = [];
  BackupDispatchMISList:any = [];
  DispatchMISListHeader:any = [];

  constructor(
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private $http: HttpClient,
    private excelservice: ExportExcelService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Sales MIS",
      Link: "MICL -> Sales MIS"
    });
    this.items = ["SALES MIS", "DISPATCH MIS"];
    this.Finyear();
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
        let data = JSON.parse(res)
        this.initDate = [new Date(data[0].Fin_Year_Start), new Date(data[0].Fin_Year_End)]
      });
  }
  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["SALES MIS", "DISPATCH MIS"];
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.start_date = dateRangeObj[0];
      this.end_date = dateRangeObj[1];
    }
  }
  GetSalesMIS() {
    this.SalesMISList = [];
    this.BackupSalesMISList = [];
    this.PendingLIfilterFLag = false;
    this.PendingSOfilterFLag = false;
    const start = this.start_date
      ? this.DateService.dateConvert(new Date(this.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.end_date
      ? this.DateService.dateConvert(new Date(this.end_date))
      : this.DateService.dateConvert(new Date());
      this.seachSpinner = true;
  if (start && end) {
    const tempobj = {
      From_Date: start,
      To_Date: end,
    }
    const obj = {
      "SP_String": "SP_Sales_MIS_Report",
      "Report_Name_String": "Get_Sale_MIS_Data",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if(data.length){
      let temp:any = [];
      data.forEach(element => {
        const obj = {
          LI_Doc_No : element.LI_Doc_No,
          LI_Doc_Date : element.LI_Doc_Date,
          LI_Customer : element.LI_Customer,
          Product_Name : element.Product_Name,
          LI_Qty : element.LI_Qty,
          LI_Amount : element.LI_Amount,
          Pending_LI_Qty : element.Pending_LI_Qty,
          SO_Qty : element.SO_Qty,
          SO_Total_Amount : element.SO_Total_Amount,
          Pending_SO_Qty : element.Pending_SO_Qty,
          SC_Qty : element.SC_Qty,
          SC_Total_Amount : element.SC_Total_Amount,
          SB_Qty : element.SB_Qty,
          SB_Total_Amount : element.SB_Total_Amount,
          RA_Total_Amount : element.RA_Total_Amount
         }
         temp.push(obj)
      });
      this.SalesMISList = temp;
      this.BackupSalesMISList = temp;
      this.GetDistinct();
      if (this.SalesMISList.length) {
        this.SalesMISListHeader = Object.keys(temp[0]);
      } else {
        this.SalesMISListHeader = [];
      }
      this.seachSpinner = false;
    }
    });
  }
  }
  // DISTINCT & FILTER
  GetDistinct() {
    let DLiCustomer:any = [];
    let DProductName:any = [];
    this.DistLiCustomer = [];
    this.SelectedDistLiCustomer = [];
    this.DistProductName = [];
    this.SelectedDistProductName = [];
    this.SearchFields =[];
    this.SalesMISList.forEach((item) => {
   if (DLiCustomer.indexOf(item.LI_Customer) === -1) {
    DLiCustomer.push(item.LI_Customer);
   this.DistLiCustomer.push({ label: item.LI_Customer, value: item.LI_Customer });
   }
   if (DProductName.indexOf(item.Product_Name) === -1) {
    DProductName.push(item.Product_Name);
   this.DistProductName.push({ label: item.Product_Name, value: item.Product_Name });
   }
  });
     this.BackupSalesMISList = [...this.SalesMISList];
  }
  FilterDist() {
    let DLiCustomer:any = [];
    let DProductName:any = [];
    this.SearchFields =[];
  if (this.SelectedDistLiCustomer.length) {
    this.SearchFields.push('Dept_Name');
    DLiCustomer = this.SelectedDistLiCustomer;
  }
  if (this.SelectedDistProductName.length) {
    this.SearchFields.push('Present_Status');
    DProductName = this.SelectedDistProductName;
  }
  this.SalesMISList = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupSalesMISList.filter(function (e) {
      return (DLiCustomer.length ? DLiCustomer.includes(e['LI_Customer']) : true) &&
             (DProductName.length ? DProductName.includes(e['Product_Name']) : true)
    });
  this.SalesMISList = LeadArr.length ? LeadArr : [];
  } else {
  this.SalesMISList = [...this.BackupSalesMISList] ;
  }
  }
  PendingLIFilter(){
    this.SalesMISList = []
     if(this.PendingLIfilterFLag){
      this.PendingSOfilterFLag = false;
      this.BackupSalesMISList.forEach(el=>{
        if(Number(el.Pending_LI_Qty) > 0){
          this.SalesMISList.push(el);
        }
      })
    }
    else{
      this.SalesMISList = this.BackupSalesMISList;
    }
  }
  PendingSOFilter(){
    this.SalesMISList = []
     if(this.PendingSOfilterFLag){
      this.PendingLIfilterFLag = false;
      this.BackupSalesMISList.forEach(el=>{
        if(Number(el.Pending_SO_Qty) > 0){
          this.SalesMISList.push(el);
        }
      })
    }
    else{
      this.SalesMISList = this.BackupSalesMISList;
    }
  }
onReject(){}
GetLIview(dataobj){
  this.LIviewData = {};
  this.AddProdList = [];
  this.Tax = undefined;
  this.CGST = undefined;
  this.SGST = undefined;
  this.IGST = undefined;
  this.NetAMT = undefined;
      if (dataobj.LI_Doc_No) {
      const tempobj = {
        Doc_No : dataobj.LI_Doc_No,
      }
        const obj = {
          "SP_String": "SP_Sales_MIS_Report",
          "Report_Name_String": "Get_LI_View_Details",
          "Json_Param_String": JSON.stringify([tempobj])
          }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.LIviewList = data;
          this.LIviewData = data[0];
          data.forEach(element => {
            const  productObj = {
               Product_Type : element.Product_Type,
               Product_Sub_Type : element.Product_Sub_Type,
               Product_Specification : element.Product_Name,
               Qty :  Number(element.Qty),
               UOM : element.UOM,
               Rate : element.Rate,
               Taxable_unt : element.Taxable_Amount,
               CGST_Rate : element.CGST_Rate,
               CGST_Amt : element.CGST_Amount,
               SGST_Rate : element.SGST_Rate,
               SGST_Amt :  element.SGST_Amount,
               IGST_Rate : element.IGST_Rate,
               IGST_Amt : element.IGST_Amount,
               Line_Total_Amount : element.Line_Total_Amount
             };
             this.AddProdList.push(productObj);
     
     
              //
         });
         this.TotalCalculation();
          this.LIviewPopup = true
          
        })
      }
    
}
LIpopupCancle(){
  this.LIviewData = {};
  this.AddProdList = [];
  this.Tax = undefined;
  this.CGST = undefined;
  this.SGST = undefined;
  this.IGST = undefined;
  this.NetAMT = undefined;
  this.LIviewPopup = false;
}
TotalCalculation(){
  this.Tax = undefined;
  this.CGST = undefined;
  this.SGST = undefined;
  this.IGST = undefined;
  this.NetAMT = undefined;
  let count1 = 0;
  let count2 = 0;
  let count3 = 0;
  let count4 = 0;
  let count5 = 0;
  this.AddProdList.forEach(item => {
    count1 = count1 + Number(item.Taxable_unt);
    count2= count2 + Number(item.CGST_Amt);
    count3 = count3 + Number(item.SGST_Amt);
    count4= count4 + Number(item.IGST_Amt);
    count5 = count5 + Number(item.Line_Total_Amount);
  });
  this.Tax = count1.toFixed(2);
  this.CGST = count2.toFixed(2);
  this.SGST = count3.toFixed(2);
  this.IGST = count4.toFixed(2);
  this.NetAMT = count5.toFixed(2);
}
GetPI(dataobj){
  this.PIList = [];
  if (dataobj.LI_Doc_No) {
  const obj = {
    "SP_String": "SP_Sales_MIS_Report",
    "Report_Name_String": "Get_PI_Data_Details",
    "Json_Param_String": JSON.stringify({Doc_No : dataobj.LI_Doc_No})
  }
  this.GlobalAPI.getData(obj).subscribe((data: any) => {
    this.PIList = data;
    if (this.PIList.length) {
      this.PIListHeader = Object.keys(data[0]);
    } else {
      this.PIListHeader = [];
    }
    // console.log("PIList", this.PIList);
    this.PIPopup = true;
  });
  }
}
GetPIviewDetails(dataobj){
  this.PIviewData = {};
  this.AddPIProdList = [];
  this.PITax = undefined;
  this.PICGST = undefined;
  this.PISGST = undefined;
  this.PIIGST = undefined;
  this.PINetAMT = undefined;
      if (dataobj.PI_Doc_No) {
      const tempobj = {
        Doc_No : dataobj.PI_Doc_No,
      }
        const obj = {
          "SP_String": "SP_Sales_MIS_Report",
          "Report_Name_String": "Get_PI_View_Details",
          "Json_Param_String": JSON.stringify([tempobj])
          }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.PIviewList = data;
          this.PIviewData = data[0];
          data.forEach(element => {
            const  productObj = {
               //ID : element.ID,
               LI_Doc_No : element.LI_Doc_No,
               LI_Doc_Date : element.LI_Doc_Date,
               Ref_Doc_No : element.Ref_Doc_No,
               Ref_Doc_Date : element.Ref_Doc_Date,
               Product_Specification : element.Product_Name,
               LI_Qty : Number(element.LI_Qty),
               Qty :  Number(element.Qty),
               Sale_Order_Qty : Number(element.Sale_Order_Qty),
               Sale_Bill_Qty : Number(element.Sale_Bill_Qty),
               UOM : element.UOM,
               Rate : element.Rate,
               Taxable_unt : element.Taxable_Amount,
               CGST_Rate : element.CGST_Rate,
               CGST_Amt : element.CGST_Amount,
               SGST_Rate : element.SGST_Rate,
               SGST_Amt :  element.SGST_Amount,
               IGST_Rate : element.IGST_Rate,
               IGST_Amt : element.IGST_Amount,
               Line_Total_Amount : element.Line_Total_Amount
             };
             this.AddPIProdList.push(productObj);
     
     
              //
         });
         this.TotalPICalculation();
         this.PIviewPopup = true
          
        })
      }
}
TotalPICalculation(){
  this.PITax = undefined;
  this.PICGST = undefined;
  this.PISGST = undefined;
  this.PIIGST = undefined;
  this.PINetAMT = undefined;
  let count1 = 0;
  let count2 = 0;
  let count3 = 0;
  let count4 = 0;
  let count5 = 0;
  this.AddPIProdList.forEach(item => {
    count1 = count1 + Number(item.Taxable_unt);
    count2= count2 + Number(item.CGST_Amt);
    count3 = count3 + Number(item.SGST_Amt);
    count4= count4 + Number(item.IGST_Amt);
    count5 = count5 + Number(item.Line_Total_Amount);
  });
  this.PITax = count1.toFixed(2);
  this.PICGST = count2.toFixed(2);
  this.PISGST = count3.toFixed(2);
  this.PIIGST = count4.toFixed(2);
  this.PINetAMT = count5.toFixed(2);
}
GetSO(dataobj){
  this.SOList = [];
  if (dataobj.LI_Doc_No) {
  const obj = {
    "SP_String": "SP_Sales_MIS_Report",
    "Report_Name_String": "Get_SO_Data_Details",
    "Json_Param_String": JSON.stringify({Doc_No : dataobj.LI_Doc_No})
  }
  this.GlobalAPI.getData(obj).subscribe((data: any) => {
    this.SOList = data;
    if (this.SOList.length) {
      this.SOListHeader = Object.keys(data[0]);
    } else {
      this.SOListHeader = [];
    }
    // console.log("PIList", this.PIList);
    this.SOPopup = true;
  });
  }
}
GetSOviewDetails(DocNo) {
  if (DocNo) {
    const objtemp = {
      "SP_String": "SP_BL_Txn_Sale_Order",
      "Report_Name_String": "Sale_Order_Print"
    }
    this.GlobalAPI.getData(objtemp).subscribe((data: any) => {
      var printlink = data[0].Column1;
      window.open(printlink + "?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
  }
}
GetOC(dataobj){
  this.OCList = [];
  if (dataobj.LI_Doc_No) {
  const obj = {
    "SP_String": "SP_Sales_MIS_Report",
    "Report_Name_String": "Get_SC_Data_Details",
    "Json_Param_String": JSON.stringify({Doc_No : dataobj.LI_Doc_No})
  }
  this.GlobalAPI.getData(obj).subscribe((data: any) => {
    this.OCList = data;
    if (this.OCList.length) {
      this.OCListHeader = Object.keys(data[0]);
    } else {
      this.OCListHeader = [];
    }
    // console.log("PIList", this.PIList);
    this.OCPopup = true;
  });
  }
}
GetOCviewDetails(DocNo) {
  if (DocNo) {
    const objtemp = {
      "SP_String": "SP_MICL_Sale_Bill",
      "Report_Name_String": "Sale_Challan_Print"
    }
    this.GlobalAPI.getData(objtemp).subscribe((data: any) => {
      var printlink = data[0].Column1;
      window.open(printlink + "?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
  }
}
GetSB(dataobj){
  this.SBillList = [];
  if (dataobj.LI_Doc_No) {
  const obj = {
    "SP_String": "SP_Sales_MIS_Report",
    "Report_Name_String": "Get_SB_Data_Details",
    "Json_Param_String": JSON.stringify({Doc_No : dataobj.LI_Doc_No})
  }
  this.GlobalAPI.getData(obj).subscribe((data: any) => {
    this.SBillList = data;
    if (this.SBillList.length) {
      this.SBillListHeader = Object.keys(data[0]);
    } else {
      this.SBillListHeader = [];
    }
    // console.log("PIList", this.PIList);
    this.SBillPopup = true;
  });
  }
}
GetSBviewDetails(DocNo) {
  if (DocNo) {
    const objtemp = {
      "SP_String": "SP_MICL_Sale_Bill",
      "Report_Name_String": "Sale_Bill_Print"
    }
    this.GlobalAPI.getData(objtemp).subscribe((data: any) => {
      var printlink = data[0].Column1;
      window.open(printlink + "?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
  }
}
GetRA(dataobj){
  this.RAList = [];
  if (dataobj.LI_Doc_No) {
  const obj = {
    "SP_String": "SP_Sales_MIS_Report",
    "Report_Name_String": "Get_RA_Data_Details",
    "Json_Param_String": JSON.stringify({Doc_No : dataobj.LI_Doc_No})
  }
  this.GlobalAPI.getData(obj).subscribe((data: any) => {
    this.RAList = data;
    if (this.RAList.length) {
      this.RAListHeader = Object.keys(data[0]);
    } else {
      this.RAListHeader = [];
    }
    // console.log("PIList", this.PIList);
    this.RAPopup = true;
  });
  }
}
GetRAviewDetails(DocNo) {
  // if (DocNo) {
  //   const objtemp = {
  //     "SP_String": "SP_MICL_Sale_Bill",
  //     "Report_Name_String": "Sale_Bill_Print"
  //   }
  //   this.GlobalAPI.getData(objtemp).subscribe((data: any) => {
  //     var printlink = data[0].Column1;
  //     window.open(printlink + "?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  //   })
  // }
}
ExportToExcel(){
  const start = this.start_date
  ? this.DateService.dateConvert(new Date(this.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.end_date
  ? this.DateService.dateConvert(new Date(this.end_date))
  : this.DateService.dateConvert(new Date());
   let tempobj = {}
if (start && end) {
 tempobj = {
  From_Date: start,
  To_Date: end,
}
}
  this.excelservice.exporttoExcelSalesMIS(this.SalesMISList,tempobj);
}

//DISPATCH MIS
getDispatchMISDateRange(dateRangeObj) {
  if (dateRangeObj.length) {
    this.DIspatchMIS_start_date = dateRangeObj[0];
    this.DIspatchMIS_end_date = dateRangeObj[1];
  }
}
GetDispatchMIS() {
  this.DispatchMISList = [];
  this.BackupDispatchMISList = [];
  const start = this.DIspatchMIS_start_date
    ? this.DateService.dateConvert(new Date(this.DIspatchMIS_start_date))
    : this.DateService.dateConvert(new Date());
  const end = this.DIspatchMIS_end_date
    ? this.DateService.dateConvert(new Date(this.DIspatchMIS_end_date))
    : this.DateService.dateConvert(new Date());
    this.seachSpinner = true;
if (start && end) {
  const tempobj = {
    From_Date: start,
    To_Date: end,
  }
  const obj = {
    "SP_String": "SP_Sales_MIS_Report",
    "Report_Name_String": "Get_Despatch_Report_Date",
    "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data: any) => {
    data.forEach((el:any,i:any)=>{
      let DispatchMISListHeader:any = Object.values(data[i]).slice(2)
       const sumWithInitial = DispatchMISListHeader.reduce(
         (accumulator, currentValue) => accumulator + currentValue,
       );
       el['Total'] = Number(Number(sumWithInitial).toFixed(2));
       })
    this.DispatchMISList = data;
    this.BackupDispatchMISList = data;
    this.GetDistinct();
    if (this.DispatchMISList.length) {
      this.DispatchMISListHeader = Object.keys(data[0]);
    } else {
      this.DispatchMISListHeader = [];
    }
    this.seachSpinner = false;
    console.log("SalesMISList", this.SalesMISList);
  });
}
}

CalculateColumn(field:any){
  if(field != 'SlNo' && field != 'Sub_Ledger_Billing_Name'){
    let coltotal = 0;
    this.DispatchMISList.forEach((el:any,i:any)=>{
      coltotal = Number(coltotal) + Number(el[field])
       })
    return coltotal ? Number(coltotal).toFixed(2) : '-'
  }
  
}
ExportToExcelDispatchMIS(){
  const start = this.DIspatchMIS_start_date
  ? this.DateService.dateConvert(new Date(this.DIspatchMIS_start_date))
  : this.DateService.dateConvert(new Date());
const end = this.DIspatchMIS_end_date
  ? this.DateService.dateConvert(new Date(this.DIspatchMIS_end_date))
  : this.DateService.dateConvert(new Date());
 
if (start && end) {
const tempobj = {
  From_Date: start,
  To_Date: end,
}
  this.excelservice.exporttoExcelSales(this.DispatchMISList,tempobj);
}
}
}
