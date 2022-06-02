import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { CompacctCommonApi } from "../../../compacct.services/common.api.service";
import { HttpParams, HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-compacct-financial-details',
  templateUrl: './compacct.financial-details.component.html',
  styleUrls: ['./compacct.financial-details.component.css']
})
export class CompacctFinancialDetailsComponent implements OnInit {
  AllPurchaseData = [];
  ObjFinancial = new product();
  FinancialFormSubmit = false;
  AllSalesData = [];
  PurchaseReturnList = [];
  SalesReturnList = [];
  DiscountReceiveList = [];
  DiscountGivenList = [];
  @Output() productObj = new EventEmitter<product>();
  constructor(
    private $http: HttpClient,
    private $CompacctAPI: CompacctCommonApi
  ) { }

  ngOnInit() {
  }

}
class product{
  Purchase_Ac_Ledger:any;
  Sales_Ac_Ledger:any;
  Purchase_Return_Ledger_ID:any;
  Sales_Return_Ledger_ID:any;
  Discount_Receive_Ledger_ID:any;
  Discount_Given_Ledger_ID:any;
}