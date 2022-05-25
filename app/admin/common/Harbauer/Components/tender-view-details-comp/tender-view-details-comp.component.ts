import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  Input
} from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from "@angular/common/http";
import {
  MessageService
} from "primeng/api";
import {
  CompacctCommonApi
} from '../../../../shared/compacct.services/common.api.service';
import {
  CompacctHeader
} from '../../../../shared/compacct.services/common.header.service';
import {
  DateTimeConvertService
} from "../../../../shared/compacct.global/dateTime.service";
import {
  CompacctGetDistinctService
} from "../../../../shared/compacct.services/compacct-get-distinct.service"
import * as moment from "moment";
declare var $: any;
import * as XLSX from 'xlsx';
import {
  CompacctGlobalApiService
} from '../../../../shared/compacct.services/compacct.global.api.service';
import {
  ActivatedRoute
} from '@angular/router';
import {
  Observable
} from 'rxjs';
import {
  NgxUiLoaderService
} from 'ngx-ui-loader';
@Component({
  selector: 'app-tender-view-details-comp',
  templateUrl: './tender-view-details-comp.component.html',
  styleUrls: ['./tender-view-details-comp.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TenderViewDetailsCompComponent implements OnInit {
  tenderOrg = [];
  TenderCallingDivList = [];
  TenderExecutionDivList = [];
  TypeData = [];
  tenderCategoryList = [];
  StateList = [];
  UserList = [];
  TenderInfoEnqList = [];
  private _TenderId: any;


  ObjTender: Tender = new Tender();
  testchips = [];
  viewModel = false;
  InformedDate = new Date();
  BudgetRequidBy = new Date();
  TenderOpenDate = new Date();
  TenderEndDate = new Date();
  TenderPublishDate = new Date()


  TabItems = ['Tender Details', 'Pre Bid Budget', 'Finance Details', 'Tender Log', 'Bidder List', 'Bid Opening & AOC Details']
  BudgetDetails$: Observable < [any] > ;
  FinanceDetails$: Observable < [any] > ;
  TenderLogDetails$: Observable < [any] > ;
  BidderDetails$: Observable < [any] > ;
  BidOpeningAOCDetails$: Observable < [any] > ;
  TenderDetails$: Observable < [any] > ;

  ShowAddedEstimateProductList = [];
  rowGroupMetadata: any;
  cols = [{
      field: 'SL_No',
      header: 'SL No.'
    },
    {
      field: 'Budget_Group_Name',
      header: 'Group Name'
    },
    {
      field: 'Budget_Sub_Group_Name',
      header: 'Sub Group Name'
    },
    {
      field: 'Work_Details',
      header: 'Work Details'
    },
    {
      field: 'Site_Description',
      header: 'Site'
    },
    {
      field: 'Product_Description',
      header: 'Product'
    },
    {
      field: 'unit',
      header: 'Unit'
    },
    {
      field: 'Qty',
      header: 'Qty'
    },
    {
      field: 'Nos',
      header: 'Nos'
    },
    {
      field: 'TQty',
      header: 'Total Qty'
    },
    {
      field: 'UOM',
      header: 'UOM'
    },
    {
      field: 'saleRate',
      header: 'Sale Rate'
    },
    {
      field: 'Sale_Amount',
      header: 'Sale Amount'
    },
    {
      field: 'Rate',
      header: 'Purchase Rate'
    },
    {
      field: 'Amount',
      header: 'Purchase Amount'
    },
    {
      field: 'Changed_Sale_Rate',
      header: 'Changed Sale Rate'
    },
    {
      field: 'Changed_Sale_Amount',
      header: 'Changed Sale Amount'
    },
    {
      field: 'Changed_Rate',
      header: 'Changed Purchase Rate'
    },
    {
      field: 'Changed_Amount',
      header: 'Changed Purchase Amount'
    }
  ];

  PaymentList = [];
  AllPSdata = [];
  ObjTenderFees: any = {};
  ObjEMD: any = {};
  TenderFeesIssueDate = undefined;
  TenderFeesIssueExpiry = undefined;
  EMDIssueDate = undefined;
  EMDIssueExpiry = undefined;

  BidderList = [];


  BidOpenListViewByRateFlag = false;
  BidOpenListViewByLotteryFlag = false;
  BidTenderId = undefined;
  ObjAgreement = new Agreement();
  BidOpeningListFormSubmitted = false;
  ObjBidOpeningList = new BidOpeningList();
  BidOpenListView = [];
  BidOpenListViewByRate = [];
  BidOpenListViewByLottery = [];
  AgreementList = [];
  TenderWorkName = undefined;
  ObjBidOpening = new BidOpening();
  ReasonSelect = undefined;

  CompletionDate = new Date();
  CommencementDate = new Date();

  TenderLogList = [];
  distinctDateArray =[];
  @Input() set TenderId(val: any) {
    this._TenderId = val;
    this.FetchValues();
  }
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private route: ActivatedRoute,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems: CompacctGetDistinctService,
    private ngxService: NgxUiLoaderService
  ) {
    this.GetTenderOrg();
    this.GetTenderCallingDiv();
    this.GetTenderExecutionDiv();
    this.GetType();
    this.GetTenderCategoryList();
    this.GetStateList();
    this.getAssignforbudget();
    this.GetTenderInfoEnqSRC();
  }

  ngOnInit() {
    this.GetPaymentList();
  }
  GetTenderOrg() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_Tender_Organization",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.tenderOrg = data;
      console.log("tenderOrg", this.tenderOrg);
    });
  }
  GetTenderCallingDiv() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_BL_CRM_Mst_Enq_Tender_Calling_Div",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.TenderCallingDivList = data;
    });
  }
  GetTenderExecutionDiv() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_BL_CRM_Mst_Enq_Tender_Execution_Div",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.TenderExecutionDivList = data;
    });
  }
  GetType() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_BL_CRM_Mst_Enq_Tender_Type",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.TypeData = data;
    });
  }
  GetTenderCategoryList() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_BL_CRM_Mst_Enq_Tender_Category",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.tenderCategoryList = data;
    });
  }
  GetStateList() {
    this.$http
      .get("/Common/Get_State_List")
      .subscribe((data: any) => {
        this.StateList = data.length ? data : [];
      });
  }
  getAssignforbudget() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_User"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.UserList = data;
      console.log('UserList =', this.UserList)
    })
  }
  GetTenderInfoEnqSRC() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_BL_Enq_Source_Master",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.TenderInfoEnqList = data;
      console.log("TenderInfoEnqList", this.TenderInfoEnqList);
    });
  }

  checkChip(e) {
    const val = this.testchips.indexOf(e.value);
    this.testchips.splice(val, 1);
    this.testchips.push({
      "Tender_Doc_ID": this._TenderId,
      "Work_Location": e.value
    });
  }

  // Tender Details 
  GetAllEditData() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_BL_CRM_Txn_Enq_Tender_Harbauer_Data",
      "Json_Param_String": JSON.stringify([{
        Tender_Doc_ID: this._TenderId
      }])
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
        if (data[0]) {
          this.ObjTender = data[0];
          this.InformedDate = new Date(data[0].Tender_Informed_Date);
          this.BudgetRequidBy = new Date(data[0].Budget_Required_By);
          this.TenderOpenDate = new Date(data[0].Tender_Bid_Opening_Date);
          this.TenderEndDate = new Date(data[0].Tender_Last_Sub_Date);
          this.TenderPublishDate = new Date(data[0].Tender_Publish_Date);
          const tender = this.tenderOrg.filter(el => Number(el.Tender_Org_ID) === Number(data[0].Tender_Org_ID));
          this.ObjTender.Tender_Org_ID = tender.length ? tender[0].Tender_Organization : '';
          const tendercall = this.TenderCallingDivList.filter(el => Number(el.Tender_Calling_Div_ID) === Number(data[0].Tender_Calling_Div_ID));
          this.ObjTender.Tender_Calling_Div_ID = tendercall.length ? tendercall[0].Tender_Calling_Div_Name : '';
          const tenderDiv = this.TenderExecutionDivList.filter(el => Number(el.Tender_Execution_Div_ID) === Number(data[0].Tender_Execution_Div_ID));
          this.ObjTender.Tender_Execution_Div_ID = tenderDiv.length ? tenderDiv[0].Tender_Execution_Div_Name : '';
          const tenderType = this.TypeData.filter(el => Number(el.Tender_Type_ID) === Number(data[0].Tender_Type_ID));
          this.ObjTender.Tender_Type_ID = tenderType.length ? tenderType[0].Tender_Type_Name : '';
          const tenderCategory = this.tenderCategoryList.filter(el => Number(el.Tender_Category_ID) === Number(data[0].Tender_Category_ID));
          this.ObjTender.Tender_Category_ID = tenderCategory.length ? tenderCategory[0].Tender_Category_Name : '';
          const tendrInformation = this.TenderInfoEnqList.filter(el => Number(el.Enq_Source_ID) === Number(data[0].Enq_Source_ID));
          this.ObjTender.Enq_Source_Name = tendrInformation.length ? tendrInformation[0].Enq_Source_Name : '';
          const tendrAssign = this.UserList.filter(el => Number(el.User_ID) === Number(data[0].User_ID));
          this.ObjTender.User_ID = tendrAssign.length ? tendrAssign[0].User_Name : '';
        }
        console.log("ObjTender", this.ObjTender);

      })
  }
  getThenderWorkLocation() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
      "Report_Name_String": "Get_BL_CRM_Txn_Enq_Tender_Work_Location_Data",
      "Json_Param_String": JSON.stringify([{
        Tender_Doc_ID: this._TenderId
      }])
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
        if (data) {
          this.testchips = data;
          // data.forEach(ele => {
          //   this.testchips.push(ele.Work_Location)
          // });
        }
        console.log("testchips", this.testchips);

      })
  }
  //Budget Details
  onSort() {
    this.updateRowGroupMetaData();
  }
  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.ShowAddedEstimateProductList) {
      for (let i = 0; i < this.ShowAddedEstimateProductList.length; i++) {
        let rowData = this.ShowAddedEstimateProductList[i];
        let brand = rowData.Budget_Group_Name;
        if (i == 0) {
          this.rowGroupMetadata[brand] = {
            index: 0,
            size: 1
          };
        } else {
          let previousRowData = this.ShowAddedEstimateProductList[i - 1];
          let previousRowGroup = previousRowData.Budget_Group_Name;
          if (brand === previousRowGroup)
            this.rowGroupMetadata[brand].size++;
          else
            this.rowGroupMetadata[brand] = {
              index: i,
              size: 1
            };
        }
      }
    }
  }
  GetEditSingleScheme() {
    this.ShowAddedEstimateProductList = [];
    if (this._TenderId) {
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get Data Tender Estimate_With_Changed_Amount",
        "Json_Param_String": JSON.stringify([{
          'Tender_Doc_ID': this._TenderId
        }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          if (data.length) {
            this.ShowAddedEstimateProductList = data;
            console.log(data)
          }
        });
    }
  }
  getPurchaseAmt() {
    return this.ShowAddedEstimateProductList.reduce((n, {
      Amount
    }) => n + Number(Amount), 0)
  }
  getSaleAmt() {
    return this.ShowAddedEstimateProductList.reduce((n, {
      Sale_Amount
    }) => n + Number(Sale_Amount), 0)
  }
  getTotalPurchaseAmt() {
    return this.ShowAddedEstimateProductList.length ? Number(this.ShowAddedEstimateProductList[0].No_of_Site) * this.getPurchaseAmt() : '-';
  }
  // Finance Details 
  GetPaymentList() {
    this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_Payment_Type_Json")
      .subscribe((data: any) => {
        this.PaymentList = data ? JSON.parse(data) : [];
        console.log("PaymentList", this.PaymentList);
      });
  }
  GetEMDDetails() {
    if (this._TenderId) {
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String": "Get_EMD_Details",
        "Json_Param_String": JSON.stringify([{
          Tender_Doc_ID: this._TenderId
        }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          if (data[0]) {
            this.ObjEMD = data[0]
            this.EMDIssueDate = new Date(data[0].Date_Of_Issue);
            this.EMDIssueExpiry = new Date(data[0].Date_Of_Exp);
            console.log("EMD", this.ObjEMD);
          }

        })
    }
  }
  GetTenderFeesDetails() {
    if (this._TenderId) {
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String": "Get_Tender_Fees",
        "Json_Param_String": JSON.stringify([{
          Tender_Doc_ID: this._TenderId
        }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          if (data[0]) {
            this.ObjTenderFees = data[0]
            this.TenderFeesIssueDate = new Date(data[0].Date_Of_Issue);
            this.TenderFeesIssueExpiry = new Date(data[0].Date_Of_Exp);
            console.log("Tender", this.ObjTenderFees);
          }

        })
    }
  }
  GetTenderPSdetails() {
    if (this._TenderId) {
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer",
        "Report_Name_String": "Get_Performance_Security",
        "Json_Param_String": JSON.stringify([{
          Tender_Doc_ID: this._TenderId
        }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          if (data[0]) {
            console.log("PS Data", data[0]);
            this.AllPSdata = data;
          }

        })
    }
  }

  // Tender Logs
  GetTenderLogList() {
    const ctrl = this;
    const distinctDateArrayTemp = [];
    const obj = {
      "SP_String": "BL_CRM_Txn_Enq_Bidding_Add_harbour",
      "Report_Name_String": "Get_Tender_Followup_Details",
      "Json_Param_String": JSON.stringify([{
        Tender_Doc_ID: this._TenderId
      }])
    }
    this.GlobalAPI
      .getData(obj).subscribe(function (data) {
          ctrl.TenderLogList = data.length ? data:[];
          console.log(ctrl.TenderLogList)
          for (let i = 0; i < ctrl.TenderLogList.length; i++) {
              distinctDateArrayTemp.push(ctrl.DateService.dateConvert(new Date(ctrl.TenderLogList[i].Posted_On)));
          }
          const unique = distinctDateArrayTemp.filter(function(value, index, self){
                          return self.indexOf(value) === index;
                          })
      ctrl.distinctDateArray = unique;
      });
  }
  getFollowupByDate(dateStr) {
    return this.TenderLogList.filter((item) => this.DateService.dateConvert(new Date(item.Posted_On)) === dateStr);
  }

  // Bidder List   
  GetBidderList() {
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_step2",
      "Report_Name_String": "Get_BL_CRM_Txn_Enq_Tender_Bidder",
      "Json_Param_String": JSON.stringify([{
        Tender_Doc_ID: this._TenderId
      }])
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
        this.BidderList = data;
      })
  }

  // Bid Opening

  GetAgreementList() {
    if (this._TenderId) {
      const obj = {
        "SP_String": "BL_CRM_Txn_Enq_Bidding_Add_harbour",
        "Report_Name_String": "Get_Tender_Agreement_And_Final_Value_Harbour",
        "Json_Param_String": JSON.stringify({
          Tender_Doc_ID: this._TenderId
        }),
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data.length && data[0].Status) {
          if (data[0].Status === 'AWARDING THE TENDER' && data[0].Agreement_Number) {
            this.ObjBidOpening.Financial_Bid_Status = data[0].Status;
            this.AgreementList = data;
            this.ObjAgreement = data[0];
            this.CompletionDate = new Date(data[0].Date_of_Completion);
            this.CommencementDate = new Date(data[0].Date_of_Commencement);
            this.ObjAgreement.Tender_Negotiated_Value = data[0].Agreement_Number;
            this.ObjAgreement.Tender_Doc_ID = this._TenderId;
          }
          if (data[0].Status === 'NOT- AWARDING THE TENDER' && data[0].Not_Awarding_Reason) {
            this.ObjBidOpening.Financial_Bid_Status = data[0].Status;
            this.ReasonSelect = data[0].Not_Awarding_Reason.split(',');
          }
        }

      });
    }
  }
  GetBidOpenList() {
    if (this._TenderId) {
      const obj = {
        "SP_String": "BL_CRM_Txn_Enq_Bidding_Add_harbour",
        "Report_Name_String": "Get_Tender_Govt_Bidding_First_Table_harbour",
        "Json_Param_String": JSON.stringify({
          Tender_Doc_ID: this._TenderId
        }),
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        this.BidOpenListView = data;
        // this.BidOpenListView.forEach(el=>{
        //   this.BidOpenListView['Quoted_Rate'] = el.Rate
        // })
        for (let i = 0; i < this.BidOpenListView.length; i++) {
          if (!this.BidOpenListView[i]['Quoted_Percentage']) {
            this.BidOpenListView[i]['Quoted_Rate'] = this.BidOpenListView[i]['Rate']
          }

        }
        this.GetRankBidOpenList();
        console.log("Get BidOpenListView", this.BidOpenListView);
      });
    }
  }
  GetRankBidOpenList() {
    this.BidOpenListViewByRate = [];
    this.BidOpenListViewByLottery = [];
    this.BidOpenListViewByRateFlag = false;
    this.BidOpenListViewByLotteryFlag = false;
    if (this._TenderId) {
      const obj = {
        "SP_String": "BL_CRM_Txn_Enq_Bidding_Add_harbour",
        "Report_Name_String": "Get_Tender_Govt_Bidding_Rank_harbour",
        "Json_Param_String": JSON.stringify({
          Tender_Doc_ID: this._TenderId
        }),
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        const Arr = data;
        for (let i = 0; i < Arr.length; i++) {
          if (!Arr[i]['Quoted_Percentage']) {
            Arr[i]['Quoted_Rate'] = Arr[i]['Rate']
          }

        }

        this.BidOpenListViewByLotteryFlag = true;
        this.RetriveRankBidding(Arr);
        this.ngxService.stop();

      });
    }
  }
  RetriveRankBidding(RankArr) {
    const valueArr = RankArr.map(function (item) {
      return item.Rate
    });
    const arr = [...RankArr];
    for (let i = 0; i < arr.length; i++) {
      let k = 0;
      for (let r = 0; r < valueArr.length; r++) {
        if (arr[i].Rate === valueArr[r]) {
          k++;
        }
      }
      if (k === 1) {
        arr[i].Lottery_Flag = 'FIXED';
      }
      if (k > 1) {
        arr[i].Lottery_Flag = 'DUPLICATE';
        arr[i].Temp_Bidder_Array = [];
        const arrTemp = $.grep(arr, function (val) {
          return val.Rate === arr[i].Rate
        });
        arr[i].Temp_Bidder_Array = [...arrTemp];
      }
      this.BidOpenListViewByLottery.push(arr[i]);
    }
    console.log("BidOpenListViewByLottery", this.BidOpenListViewByLottery)
  }
  getHarbaurValRankTop() {
    let Val = 0;
    if (this.BidOpenListViewByRate.length) {
      if (this.BidOpenListViewByRate[0].Bidder_Name === 'HARBAUER India [P] Ltd') {
        if (this.BidOpenListViewByRate[0].Bidder_Name === 'HARBAUER India [P] Ltd') {
          Val = this.BidOpenListViewByRate[0].Rate;
        }
      }
    }
    if (this.BidOpenListViewByLottery.length) {
      if (this.BidOpenListViewByLottery[0].Bidder_Name === 'HARBAUER India [P] Ltd') {
        if (this.BidOpenListViewByLottery[0].Bidder_Name === 'HARBAUER India [P] Ltd') {
          Val = this.BidOpenListViewByLottery[0].Rate;

        }
      }

    }
    return Val;
  }

  BidAmountView(e) {
    if (e) {
      const x = e.toString();
      const number = Number(e);
      const k = number.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
      });
      return k;
    }
  }

  checkBidderSelectLottery(bidderName) {
    const arr = [...this.BidOpenListViewByLottery]
    const exitsFlag = bidderName ? $.grep(arr, function (val) {
      return val.Bidder_Name === bidderName
    }) : [];
    return exitsFlag.length > 1 ? true : false;
  }


  // Init on tender id recieve
  FetchValues() {
    this.clearData();
    if (this._TenderId) {
      this.GetAllEditData();
      this.getThenderWorkLocation();
      this.GetEditSingleScheme();
      this.GetEMDDetails();
      this.GetTenderFeesDetails();
      this.GetTenderPSdetails();
      this.GetBidderList();

      this.GetBidOpenList();
      this.GetAgreementList();
      this.GetTenderLogList();
    }
  }
  clearData() {
    this.AllPSdata = [];
    this.ObjEMD = {};
    this.ObjTenderFees = {};
    this.TenderFeesIssueDate = undefined;
    this.TenderFeesIssueExpiry = undefined;
    this.EMDIssueDate = undefined;
    this.EMDIssueExpiry = undefined;

    this.BidderList = [];


    this.BidOpenListViewByRateFlag = false;
    this.BidOpenListViewByLotteryFlag = false;
    this.BidTenderId = undefined;
    this.ObjAgreement = new Agreement();
    this.BidOpeningListFormSubmitted = false;
    this.ObjBidOpeningList = new BidOpeningList();
    this.BidOpenListView = [];
    this.BidOpenListViewByRate = [];
    this.BidOpenListViewByLottery = [];
    this.AgreementList = [];
    this.TenderWorkName = undefined;
    this.ObjBidOpening = new BidOpening();
    this.ReasonSelect = undefined;
    this.CompletionDate = new Date();
    this.CommencementDate = new Date();

    this.TenderLogList = [];
    this.distinctDateArray =[];
  }

}

class Tender {
  Tender_Doc_ID: number;
  Cost_Cen_ID: number;
  User_ID: number;
  Work_Name: string;
  Work_Details: string;
  Tender_Name: string;
  Tender_Org_ID: number;
  Tender_Calling_Div_ID: number;
  Tender_Execution_Div_ID: number;
  Tender_Ref_No: string;
  Tender_ID: number;
  Tender_Type_ID: number;
  Tender_Category_ID: number;
  Tender_Amount: number;
  State: string;
  Tender_Value: any;
  Tender_Publish_Date: string;
  Tender_Last_Sub_Date: string;
  Tender_Bid_Opening_Date: string;
  EMD_Amount: string;
  T_Fee_Amount: string;
  Enq_Source_ID: number;
  Enq_Source_Name: string;
  Tender_Informed_Date: string;
  Period_Of_Working: string;
  Budget_Required_By: string;
  Govt_Proposal: string;
  Tender_Publishing_Info_From: any
}
class BidOpeningList {
  Schedule_ID: string;
  Sl_No: number;
  Bidder_Name: string;
  Tender_Value: number;
  Quoted_Percentage: any = 0;
  Quoted_Rate: number = 0;
  Less_Excess: string;
  Rate: number;
  Rate_In_Words: string;
  Tender_Doc_ID: string;

}
class RankBidOpeningList {
  Rank_ID: string;
  Rank: string;
  Sl_No: number;
  Bidder_Name: string;
  Tender_Value: number;
  Quoted_Percentage: string;
  Less_Excess: string;
  Rate: number;
  Rate_In_Words: string;
  Tender_Doc_ID: string;
  Lottery_Flag: string;
  Quoted_Rate: string;
  Temp_Bidder_Array: any = [];

}
class BidOpening {
  Tender_Doc_ID: string;
  Tender_Inviting_Authority: string;
  Financial_Bid_Status: string;
  Fin_Year_Name: string;
  ISD_Amount: number;
  ISD_Maturity_Amount: number;
  ISD_Bank: string;
  ISD_Deposit_date: string;
  ISD_Release_Date: string;
  ISD_Deposit_Type: string;
  ISD_Deposit_Number: string;
  ISD_Through_BG_FD: string;
  ISD_BG_Creation_Date: string;
  ISD_BG_Exp_Date: string;
  ISD_FD_Amount: number;
  ISD_FD_Mature_Amount: number;
  ISD_FD_Mature_Date: string;
  ISD_NEFT_Txn_Date: string;
  ISD_NEFT_TXN_No: string;
  APSD_Amount: number;
  APSD_Maturity_Amount: number;
  APSD_Bank: string;
  APSD_Deposit_date: string;
  APSD_Release_Date: string;
  APSD_Deposit_Type: string;
  APSD_Deposit_Number: string;
  APSD_Through_BG_FD: string;
  APSD_BG_Creation_Date: string;
  APSD_BG_Exp_Date: string;
  APSD_FD_Amount: number;
  APSD_FD_Mature_Amount: number;
  APSD_FD_Mature_Date: string;
  APSD_NEFT_Txn_Date: string;
  APSD_NEFT_TXN_No: string;
  Agreement_Number: string;
  Agreement_Value: any;
  Date_of_Commencement: string;
  Date_of_Completion: string;
  Periods_of_Completion: string;
  Circle: string;
  Division: string;
  Not_Awarding_Reason: string;
  Disqualify: string;
  EOT_Applied: string;
  Rank_Type: string;
  BOQ_File_Name: string;
  Project_Short_Name: string;
  Agreement_value: string;

}
class Agreement {
  Tender_Doc_ID: number;
  Agreement_Number: any;
  Agreement_Value: any;
  Date_of_Commencement: any;
  Date_of_Completion: any;
  Tender_Final_Value: any;
  Tender_Negotiated_Value: any;
}
