import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FreezeService, ResizeService, GridComponent, SortService } from '@syncfusion/ej2-angular-grids';
import { Browser } from '@syncfusion/ej2-base';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalUrlService } from '../../../../shared/compacct.global/global.service.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from "primeng/api";
declare var $: any;
@Component({
  selector: 'app-customer-sales',
  templateUrl: './customer-sales.component.html',
  styleUrls: ['./customer-sales.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CustomerSalesComponent implements OnInit {
  url = window["config"];
  seachSpinner = false;
  SubledgerID = 0;
  SubledgerName = undefined;
  SubledgerList = [];
  FinyearID = 0;
  FinyearList = [];
  scrollableCols = [];
  frozenCols = [];
  SearchFormSubmitted = false;

  CustomerSalesList = [];
  CustomerSalesListNative = [];

  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,) { }

  ngOnInit(): void {
    // $("body").addClass("sidebar-collapse");
    this.Header.pushHeader({
      Header: "Customer Sales",
      Link: " CRM -> Report -> Customer Sales"
    });
    this.scrollableCols = [
      { field: 'Baishakh', header: 'Baishakh' },
      { field: 'Jestha', header: 'Jestha' },
      { field: 'Ashadh', header: 'Ashadh' },
      { field: 'Shrawan', header: 'Shrawan' },
      { field: 'Bhadra', header: 'Bhadra' },
      { field: 'Aashwin', header: 'Aashwin' },
      { field: 'Kartik', header: 'Kartik' },
      { field: 'Marg', header: 'Marg' },
      { field: 'Poush', header: 'Poush' },
      { field: 'Magh', header: 'Magh' },
      { field: 'Falgun', header: 'Falgun' },
      { field: 'Chaitra', header: 'Chaitra' },
      { field: 'Total', header: 'Total' }
  ];

  this.frozenCols = [
      { field: 'Product', header: 'Product' },
  ];
    this.GetSubledgerList();
    this.GetFinyearList();
}
//  INITIAL DATA
GetSubledgerList() {
  this.$http.get('/Common/Get_Subledger_DR_for_Nepal_Customer_Sales_Report').subscribe((data: any) => {
    const SubledgerListNative =  data ? JSON.parse(data) : [];
    SubledgerListNative.forEach(el => {
      this.SubledgerList.push({
        label: el.Sub_Ledger_Name,
        value: el.Sub_Ledger_ID
      });
    });
  });
}
GetFinyearList() {
  this.$http.get('/Common/Get_Fin_Year_Other').subscribe((data: any) => {
    this.FinyearList =  data ? JSON.parse(data) : [];
    this.FinyearID = this.FinyearList[0].Fin_Year_ID;
  });
}
SubledgerChange(id){

  }
// SEARCH
SearchCustomerSales(valid) {
  this.SearchFormSubmitted = true;
  this.CustomerSalesList = [];
  this.CustomerSalesListNative = [];
  if (valid) {
    this.seachSpinner = true;
    const obj = new HttpParams()
      .set("Sub_Ledger_ID", this.SubledgerID.toString())
      .set("Fin_Year_ID ", this.FinyearID.toString());
    this.$http
      .get("/CRM_Customer_Sales/Get_Product_Sales?Sub_Ledger_ID=" + this.SubledgerID + "&Fin_Year_ID=" + this.FinyearID)
      .subscribe((data: any) => {
        this.CustomerSalesList = data ? JSON.parse(data) : [];
        this.CustomerSalesListNative = data ? JSON.parse(data) : [];
      //  this.fetchData()

        this.seachSpinner = false;
        this.SearchFormSubmitted = false;
      });
  }
}
fetchData(){
  const processed = [];
  for(let i = 0; i < this.CustomerSalesList.length;i++){
    this.CustomerSalesList[i].Id = 'SALES_'+ (i+1);
    this.CustomerSalesList[i].ProductTypeRowSpanFlag = true;
    this.CustomerSalesList[i].ProductTypeRowSpanLength = 1;
    this.CustomerSalesList[i].ProductSubTypeRowSpanFlag = true;
    this.CustomerSalesList[i].ProductSubTypeRowSpanLength = 1;
    this.CustomerSalesList[i].ProductRowSpanFlag = true;
    this.CustomerSalesList[i].ProductRowSpanLength = 1;
  }
  for(let i = 0; i < this.CustomerSalesList.length; i++) {
    if (processed.indexOf(this.CustomerSalesList[i].Product_Type)<0) {
      processed.push(this.CustomerSalesList[i].Product_Type);
      const typ = this.CustomerSalesList[i].Product_Type;
      const ProductTypeDisticnt  = $.grep(this.CustomerSalesList,function(obj) { return obj.Product_Type === typ});
      const processed2 = [];
      for(let k = 0; k < ProductTypeDisticnt.length; k++){
        const index1 =  this.CustomerSalesList.findIndex(x => x.Id ===ProductTypeDisticnt[k].Id);
        this.CustomerSalesList[index1].ProductTypeRowSpanFlag = k === 0 ? true : false;
        this.CustomerSalesList[index1].ProductTypeRowSpanLength = ProductTypeDisticnt.length;
        if(processed2.indexOf(ProductTypeDisticnt[k].Product_Sub_Type)<0) {
          processed2.push(ProductTypeDisticnt[k].Product_Sub_Type);
          const type = this.CustomerSalesList[i].Product_Type;
          const subtype = this.CustomerSalesList[i].Product_Sub_Type;
          const ProductSubTypeDisticnt  = $.grep(this.CustomerSalesList,function(obj) { return (obj.Product_Type == type  && obj.Product_Sub_Type == subtype)});
          const processed3 = [];
          for(let j = 0; j < ProductSubTypeDisticnt.length; j++){
            const index2 =  this.CustomerSalesList.findIndex(x => x.Id ===ProductSubTypeDisticnt[j].Id);
            this.CustomerSalesList[index2].ProductSubTypeRowSpanFlag = j === 0 ? true : false;
            this.CustomerSalesList[index2].ProductSubTypeRowSpanLength = ProductSubTypeDisticnt.length;
            if(processed3.indexOf(ProductSubTypeDisticnt[j].Product)<0) {
              processed3.push(ProductSubTypeDisticnt[j].Product);
              const type2 = this.CustomerSalesList[i].Product_Type;
              const subtype2 = this.CustomerSalesList[i].Product_Sub_Type;
              const product = this.CustomerSalesList[i].Product;
              const ProductDisticnt  = $.grep(this.CustomerSalesList,function(obj) { return (obj.Product_Type == type  && obj.Product_Sub_Type == subtype && obj.Product == product)});
              for(let l = 0; l < ProductTypeDisticnt.length; l++){
                const index3 =  this.CustomerSalesList.findIndex(x => x.Id ===ProductTypeDisticnt[l].Id);
                this.CustomerSalesList[index3].ProductRowSpanFlag = l === 0 ? true : false;
                this.CustomerSalesList[index3].ProductRowSpanLength = ProductDisticnt.length;
              }

            }
          }

        }
      }

    }
  }

  console.log(this.CustomerSalesList);
}
// GLOBAL SERACH
 GlobalTableSearcch (args) {
  const tempData = [...this.CustomerSalesListNative]
   if(args) {
    this.CustomerSalesList = tempData.filter((val) => {
      let rVal =((val.Product.toLocaleLowerCase().includes(args)) || (val.Baishakh === Number(args)) ||
      (val.Jestha === Number(args)) || (val.Ashadh === Number(args)) ||
        (val.Shrawan === Number(args)) || (val.Bhadra === Number(args)) ||
        (val.Aashwin === Number(args)) || (val.Kartik === Number(args)) ||
          (val.Marg === Number(args)) || (val.Poush === Number(args))
      || (val.Magh === Number(args)) || (val.Falgun === Number(args))
      || (val.Chaitra === Number(args)) || (val.Total === Number(args)));
      return rVal;
    });
    this.fetchData();
  } else {
    this.CustomerSalesList = tempData;
    this.fetchData();
  }
}
}
