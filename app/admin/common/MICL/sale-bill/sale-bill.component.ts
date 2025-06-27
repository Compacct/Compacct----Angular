import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonUserActivityService } from '../../../shared/compacct.services/common-user-activity.service';

@Component({
  selector: 'app-sale-bill',
  templateUrl: './sale-bill.component.html',
  styleUrls: ['./sale-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SaleBillComponent implements OnInit {
  browseSpinner:boolean = false;
  tabIndexToView = 0;
  buttonname = "Create";
  items: any = [];
  ObjTopSale: TopSale = new TopSale();
  ObjBrowseSaleBill: BrowseSaleBill = new BrowseSaleBill();
  BillDate = new Date();
  CustmerList: any = [];
  CustmerListbrowse: any = [];
  SaleBillFormSubmitted: boolean = false;
  CostCenterList: any = [];
  ChallanNoList: any = [];
  SaveAddress: any = [];
  StateList: any = [];
  AllPinList: any = [];
  GridList: any = [];
  TempObj: any = {};
  ChallanSave: any = {};
  Amount:any = undefined;
  Discount_Amount:any = undefined;
  Tax:any = undefined;
  CGST:any = undefined;
  SGST:any = undefined;
  IGST:any = undefined;
  NetAMT:any = undefined;
  Total_Amount:any = undefined;
  Rounded_Off:any = undefined;
  initDate: any = [];
  SerarchSaleBill: any = [];
  SerarchSaleBillHeader: any = [];
  DocNo :any  = undefined;
  Spinner = false;
  public QueryStringObj : any;
  SubLedgerID:any = undefined
  Challan_No:any;
  Tax_Category:any;
  TaxCategoryList:any = [];
  editlist:any = [];
  SelectedChallanNo:any = [];
  editChallanList:any = [];
  TCSTaxRequiredValidation = false;
  TCSdataList:any = [];
  databaseName: any;
  constructor(
    private Header: CompacctHeader,
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private route : ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private _CommonUserActivity : CommonUserActivityService
  ){
     this.route.queryParamMap.subscribe((val:any) => {
      this.GetCustmer();
      if(val.params) {
        // this.ngxService.start();
        this.QueryStringObj = val.params;
        if(this.QueryStringObj.Challan_No) {
          this.tabIndexToView = 1;
          // this.SubLedgerID = Number(this.QueryStringObj.Sub_Ledger_ID)
          // this.Tax_Category = this.QueryStringObj.Cat_ID
          this.ObjTopSale.Sub_Ledger_ID = Number(this.QueryStringObj.Sub_Ledger_ID);
          this.CustmerNameChange();
         }
      }
    } );
   }

  ngOnInit() {
     this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Sale Bill",
      Link: " Financial Management ->  Sale Bill"
    });
    this.getDatabase();
    this.GetCustmer();
    this.GetCostcenter();
    this.GetStateList();
    this.Finyear();
    this.GetTaxCategory();
  }
  getDatabase(){
    this.$http
        .get("/Common/Get_Database_Name")
        .subscribe((data: any) => {
          this.databaseName = data;
          console.log(data)
        });
  }
  TabClick(e:any) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
    this.ObjTopSale.TCS_Y_N = undefined;
    this.ObjTopSale.TCS_Persentage = 0;
    this.ObjTopSale.TCS_Amount = 0;
    this.ObjTopSale.TCS_Per = undefined;
    // this.router.navigate(['./MICL_Sale_Bill']);
    this.router.navigate(['./BL_Txn_Sale_Bill_From_Challan']);
  }
  clearData() {
    this.browseSpinner = false;
    this.SaleBillFormSubmitted = false;
    this.TCSTaxRequiredValidation = false;
    this.ObjTopSale.Sub_Ledger_ID = undefined;
    this.ChallanNoList = [];
    // this.ObjTopSale.Bill_No = undefined;
    this.SelectedChallanNo = [];
    this.BillDate = new Date();
    this.SaveAddress = [];
    this.GridList = [];
    this.ObjTopSale.Choose_Address = undefined;
    this.ObjTopSale.Sub_Ledger_Address_1 =undefined;  
    this.ObjTopSale.Sub_Ledger_District = undefined;
    this.ObjTopSale.Sub_Ledger_State = undefined;
    this.ObjTopSale.Sub_Ledger_Pin = undefined;
    this.ObjTopSale.Sub_Ledger_GST_No = undefined;
    this.ObjTopSale.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.GetCosCenAddress();
    this.Amount = undefined;
    this.Discount_Amount = undefined;
    this.Tax = undefined;
    this.CGST = undefined;
    this.SGST = undefined;
    this.IGST = undefined;
    this.NetAMT = undefined;
    this.Rounded_Off = undefined;
    this.Total_Amount = undefined;
    // this.SerarchSaleBill = [];
    this.DocNo = undefined;
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
        let data = JSON.parse(res)
        this.initDate = [new Date(data[0].Fin_Year_Start), new Date(data[0].Fin_Year_End)]
      });
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseSaleBill.From_Date = dateRangeObj[0];
      this.ObjBrowseSaleBill.To_Date = dateRangeObj[1];
    }
  }
  GetSerarchBrowse(Valid: any) {
    this.SerarchSaleBill = [];
    this.browseSpinner = true;
    const start = this.ObjBrowseSaleBill.From_Date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseSaleBill.From_Date))
      : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowseSaleBill.To_Date
      ? this.DateService.dateConvert(new Date(this.ObjBrowseSaleBill.To_Date))
      : this.DateService.dateConvert(new Date());
    const tempobj = {
      From_Date: start,
      To_Date: end,
      Sub_Ledger_ID: this.ObjBrowseSaleBill.Sub_Ledger_ID ? this.ObjBrowseSaleBill.Sub_Ledger_ID : 0,
    }
    if (Valid) {
      const obj = {
        "SP_String": "SP_MICL_Sale_Bill",
        "Report_Name_String": "browse_Sale_Bill",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.browseSpinner = false;
        if (data.length) {
          this.SerarchSaleBill = data;
          this.SerarchSaleBillHeader = data.length ? Object.keys(data[0]): []  
          this.browseSpinner = false;
          }       
      });
    }
  }
  GetCustmer() {
    const obj = {
      "SP_String": "SP_MICL_Sale_Bill",
      "Report_Name_String": "Get_Subledger",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.CustmerList = data;
      this.CustmerListbrowse = data;
      
    });
  }
  GetCostcenter() {
    const obj = {
      "SP_String": "SP_MICL_Sale_Bill",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.CostCenterList = data;
      this.ObjTopSale.Cost_Cen_ID = this.QueryStringObj.Cost_Cen_ID ? Number(this.QueryStringObj.Cost_Cen_ID) : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.GetCosCenAddress();
    })
  }
  GetCosCenAddress() {
    if (this.ObjTopSale.Cost_Cen_ID) {
      // this.ObjTopSale.Bill_No = []
      // this.SelectedChallanNo = [];
      const ctrl = this;
      const costcenObj = $.grep(ctrl.CostCenterList, function (item: any) { return item.Cost_Cen_ID == ctrl.ObjTopSale.Cost_Cen_ID })[0];
      // this.ObjTopSale = {...costcenObj}
      // if(this.buttonname != "Update") {
      // this.ObjTopSale.Sub_Ledger_ID = this.QueryStringObj.Sub_Ledger_ID ? Number(this.QueryStringObj.Sub_Ledger_ID) : this.ObjTopSale.Sub_Ledger_ID;
      // if(this.ObjTopSale.Sub_Ledger_ID){
      //   this.CustmerNameChange();
      // }
      // }
      // this.ObjTopSale.Bill_No.push(this.QueryStringObj.Challan_No)
      // this.SelectedChallanNo.push(this.QueryStringObj.Challan_No);

      this.ObjTopSale.Cost_Cen_Address1 = costcenObj.Cost_Cen_Address1;
      this.ObjTopSale.Cost_Cen_Address2 = costcenObj.Cost_Cen_Address2;
      this.ObjTopSale.Cost_Cen_State = costcenObj.Cost_Cen_State;
      this.ObjTopSale.Cost_Cen_GST_No = costcenObj.Cost_Cen_GST_No
      this.ObjTopSale.Cost_Cen_Location = costcenObj.Cost_Cen_Location;
      this.ObjTopSale.Cost_Cen_PIN = costcenObj.Cost_Cen_PIN;
      this.ObjTopSale.Cost_Cen_Phone = costcenObj.Cost_Cen_Phone;
      this.ObjTopSale.Cost_Cen_District = costcenObj.Cost_Cen_District;
      this.ObjTopSale.Cost_Cen_Country = costcenObj.Cost_Cen_Country;
      this.ObjTopSale.Cost_Cen_Mobile = costcenObj.Cost_Cen_Mobile;
      this.ObjTopSale.Cost_Cen_Email = costcenObj.Cost_Cen_Email1;
      this.ObjTopSale.Cost_Cen_Name = costcenObj.Cost_Cen_Name; 
    }
     else {
      this.ObjTopSale.Cost_Cen_Address1 = undefined;
      this.ObjTopSale.Cost_Cen_Address2 = undefined;
      this.ObjTopSale.Cost_Cen_State = undefined;
      this.ObjTopSale.Cost_Cen_GST_No = undefined
      this.ObjTopSale.Cost_Cen_Location = undefined;
      this.ObjTopSale.Cost_Cen_PIN = undefined;
      this.ObjTopSale.Cost_Cen_Phone = undefined;
      this.ObjTopSale.Cost_Cen_District = undefined;
      this.ObjTopSale.Cost_Cen_Country = undefined;
      this.ObjTopSale.Cost_Cen_Mobile = undefined;
      this.ObjTopSale.Cost_Cen_Email = undefined;
      }
  }
  CustmerNameChange() {
    this.ObjTopSale.Choose_Address = undefined;
    // this.ObjTopSale.Bill_No = [];
    this.SelectedChallanNo = [];
    this.ObjTopSale.Sub_Ledger_Address_1 = undefined;
    this.ObjTopSale.Sub_Ledger_District = undefined;
    this.ObjTopSale.Sub_Ledger_State = undefined;
    this.ObjTopSale.Sub_Ledger_Pin = undefined;
    this.ObjTopSale.Sub_Ledger_GST_No = undefined;
    this.SaveAddress = [];
    if(this.ObjTopSale.Sub_Ledger_ID){
      const TempObj = {
        Sub_Ledger_ID: this.ObjTopSale.Sub_Ledger_ID,
      }
      const obj = {
        "SP_String": "SP_MICL_Sale_Bill",
        "Report_Name_String": "Get_Subledger_Address",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.SaveAddress = data;
        if (this.QueryStringObj.Sub_Ledger_ID) {
          this.ObjTopSale.Choose_Address = this.QueryStringObj.Choose_Address;
        this.onChangeAdd();
        }
      })
      if(this.buttonname != "Update"){
        this.getChallanNo();  
      }
    }
    
  }
  onChangeAdd() {
    if (this.ObjTopSale.Choose_Address) {
      const address1 = this.SaveAddress.filter(item=> item.Address_Caption == this.ObjTopSale.Choose_Address)
      this.ObjTopSale.Sub_Ledger_Address_1 = address1.length ? address1[0].Address_1 : undefined;
      this.ObjTopSale.Sub_Ledger_District = address1.length ? address1[0].District : undefined;
      this.ObjTopSale.Sub_Ledger_State = address1.length ? address1[0].State : undefined;
      this.GetStateList()
      this.ObjTopSale.Sub_Ledger_Pin = address1.length ? address1[0].Pin : undefined;
      this.ObjTopSale.Sub_Ledger_GST_No = address1.length ? address1[0].Sub_Ledger_GST_No : undefined;
    } 
    else {
      this.ObjTopSale.Sub_Ledger_Address_1 =undefined ,
      this.ObjTopSale.Sub_Ledger_District =undefined ,
      this.ObjTopSale.Sub_Ledger_State = undefined,
      this.ObjTopSale.Sub_Ledger_Pin = undefined,
      this.ObjTopSale.Sub_Ledger_GST_No = undefined
   }
  }
  GetStateList() {
    const obj = {
      "SP_String": "SP_MICL_Sale_Bill",
      "Report_Name_String": "Get_State_List"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.StateList = data;
    })
  }
  StateDistrictChange(pin: any) {
    this.AllPinList = [];
    if (pin.length === 6) {
      const obj = {
        "SP_String": "SP_MICL_Sale_Bill",
        "Report_Name_String": "Get_District_State",
        "Json_Param_String": JSON.stringify([{ PIN: pin }])
      }
      this.GlobalAPI.getData(obj).subscribe((data) => {
        this.AllPinList = data;
        this.ObjTopSale.Sub_Ledger_State = this.AllPinList.length ? this.AllPinList[0].StateName : undefined
        this.GetStateList();
        this.ObjTopSale.Sub_Ledger_District = this.AllPinList.length ? this.AllPinList[0].DistrictName : undefined
           
      });
    }
  }
  getChallanNo(){
  this.ChallanNoList =[];
  const obj = {
    "SP_String": "SP_MICL_Sale_Bill",
    "Report_Name_String": "Get_Sale_Challan_Nos",
    "Json_Param_String": JSON.stringify([{Sub_Ledger_ID : this.ObjTopSale.Sub_Ledger_ID}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     if(data.length) {
       data.forEach(element => {
         element['label'] = element.Doc_No,
         element['value'] = element.Doc_No								
       });
       this.ChallanNoList = data;
       if (this.QueryStringObj.Challan_No) {
        var challanarr:any = [];
        challanarr.push(this.QueryStringObj.Challan_No);
        console.log("challanarr", challanarr);
        // this.ObjTopSale.Bill_No = challanarr;
        //   console.log("this.ObjTopSale.Bill_No", this.ObjTopSale.Bill_No);
        challanarr.forEach(element => {
          this.SelectedChallanNo.push(element);
        });
       this.getButtomTable();
       }
      } 
   });
  }
  getButtomTable() {
    this.GridList = [];
    this.TempObj = [];
    this.Amount = undefined;
    this.Discount_Amount = undefined;
    this.Tax = undefined;
    this.CGST = undefined;
    this.SGST = undefined;
    this.IGST = undefined;
    this.NetAMT = undefined;
    this.Rounded_Off = undefined;
    this.Total_Amount = undefined;
    this.ngxService.start();
    // this.ObjTopSale.Bill_No.forEach(element => {
    this.SelectedChallanNo.forEach(element => {
      this.TempObj.push({
        Doc_No:element 
      })
    });
    const obj = {
      "SP_String": "SP_MICL_Sale_Bill",
      "Report_Name_String": "Get_Product_Details_For_Bill",
      "Json_Param_String": JSON.stringify(this.TempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        this.GridList = data; 
        // this.GridList.forEach(element => {
        //   element.Cost_Cen_Name = "Finish Product"
        // });
          for(let i = 0; i < data.length; i++){
            data[i].Amount = Number(Number(Number(data[i].Qty) * Number(data[i].Rate)).toFixed(2))
            data[i].Discount_Type = data[i].Discount_Type ? data[i].Discount_Type : undefined;
            data[i].Discount_Type_Amount = data[i].Discount_Type_Amount ? Number(data[i].Discount_Type_Amount) : 0;
            data[i].Discount = data[i].Discount ? Number(data[i].Discount) : 0;
            data[i].Taxable_Amount = Number(Number(Number(data[i].Amount) - Number(data[i].Discount)).toFixed(2))
            if(data[i].igst_tag === 'Y'){
              data[i].IGST_Rate = Number(data[i].IGST_Rate)
              data[i].IGST_Amount = Number(data[i].IGST_Amount)
              data[i].CGST_Rate = 0
              data[i].CGST_Amount = 0
              data[i].SGST_Rate = 0
              data[i].SGST_Amount = 0
            } else {
              data[i].IGST_Rate = 0
              data[i].IGST_Amount = 0
              data[i].CGST_Rate = Number(data[i].CGST_Rate)
              data[i].CGST_Amount = Number(data[i].CGST_Amount)
              data[i].SGST_Rate = Number(data[i].SGST_Rate)
              data[i].SGST_Amount = Number(data[i].SGST_Amount)
            }
            data[i].Line_Total_Amount = Number(Number(data[i].Taxable_Amount + data[i].CGST_Amount + data[i].SGST_Amount + data[i].IGST_Amount).toFixed(2))
          }
        //  if(this.QueryStringObj.Challan_No){
         this.ObjTopSale.TCS_Y_N = data[0].TCS_Y_N;
         this.GetTCSdat();
          this.ObjTopSale.TCS_Per = data[0].TCS_Per;
          this.ObjTopSale.TCS_Ledger_ID = data[0].TCS_Ledger_ID;
          this.ObjTopSale.TCS_Amount = data[0].TCS_Amount ? Number(data[0].TCS_Amount) : 0;
          this.TotalCalculation();
          this.NetAMT = this.RoundOff(Number(this.Total_Amount) + Number(this.ObjTopSale.TCS_Amount));
          this.ngxService.stop();
        //  }
        //  this.TcsAmtCalculation();
         this.ngxService.stop();
      } else {
        this.ngxService.stop();
      }
     
    })  
  }
  ClearDiscount(rowdata){
    rowdata.Discount = 0;
    rowdata.Discount_Type_Amount = 0;
    this.DiscountCalculation(rowdata);
  }
  DiscountCalculation(rowdata){
    console.log(rowdata)
    if(rowdata.Discount_Type === "%"){
      rowdata.Discount = rowdata.Discount_Type_Amount ? Number(Number(Number(Number(rowdata.Amount) * Number(rowdata.Discount_Type_Amount)) / 100).toFixed(2)) : 0;
      rowdata.Taxable_Amount = Number(Number(Number(rowdata.Amount) - rowdata.Discount).toFixed(2))
      if(rowdata.igst_tag === 'Y'){
        rowdata.IGST_Amount = Number(Number(Number(Number(rowdata.Amount) * Number(rowdata.IGST_Rate)) / 100).toFixed(2))
        rowdata.CGST_Amount = 0
        rowdata.SGST_Amount = 0
        rowdata.Line_Total_Amount = Number(Number(rowdata.Taxable_Amount + rowdata.SGST_Amount + rowdata.CGST_Amount + rowdata.IGST_Amount).toFixed(2))
      } else {
        rowdata.IGST_Amount = 0
        rowdata.CGST_Amount = Number(Number(Number(Number(rowdata.Amount) * Number(rowdata.CGST_Rate)) / 100).toFixed(2))
        rowdata.SGST_Amount = Number(Number(Number(Number(rowdata.Amount) * Number(rowdata.SGST_Rate)) / 100).toFixed(2))
        rowdata.Line_Total_Amount = Number(Number(rowdata.Taxable_Amount + rowdata.SGST_Amount + rowdata.CGST_Amount + rowdata.IGST_Amount).toFixed(2))
      }
    } else {
        rowdata.Discount = rowdata.Discount_Type_Amount ? Number(rowdata.Discount_Type_Amount) : 0;
        rowdata.Taxable_Amount = Number(Number(Number(rowdata.Amount) - rowdata.Discount).toFixed(2))
        if(rowdata.igst_tag === 'Y'){
          rowdata.IGST_Amount = Number(Number(Number(Number(rowdata.Amount) * Number(rowdata.IGST_Rate)) / 100).toFixed(2))
          rowdata.CGST_Amount = 0
          rowdata.SGST_Amount = 0
          rowdata.Line_Total_Amount = Number(Number(rowdata.Taxable_Amount + rowdata.SGST_Amount + rowdata.CGST_Amount + rowdata.IGST_Amount).toFixed(2))
        } else {
          rowdata.IGST_Amount = 0
          rowdata.CGST_Amount = Number(Number(Number(Number(rowdata.Amount) * Number(rowdata.CGST_Rate)) / 100).toFixed(2))
          rowdata.SGST_Amount = Number(Number(Number(Number(rowdata.Amount) * Number(rowdata.SGST_Rate)) / 100).toFixed(2))
          rowdata.Line_Total_Amount = Number(Number(rowdata.Taxable_Amount + rowdata.SGST_Amount + rowdata.CGST_Amount + rowdata.IGST_Amount).toFixed(2))
        }
    }
    this.TotalCalculation();
  }
  GetTaxCategory() {
    this.TaxCategoryList = [];
      const obj = {
        "SP_String": "SP_MICL_Sale_Bill",
        "Report_Name_String": "Get_TAX_Catagory",
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.TaxCategoryList = data;
      })
  
  }
  TotalCalculation() {
    this.Amount = undefined;
    this.Discount_Amount = undefined;
    this.Tax = undefined;
    this.CGST = undefined;
    this.SGST = undefined;
    this.IGST = undefined;
    this.Total_Amount = undefined;
    this.Rounded_Off = undefined;
    this.NetAMT = undefined;
    let count001 = 0;
    let count01 = 0;
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;
    let count5 = 0;
    this.GridList.forEach(item => {
      count001 = count001 + Number(item.Amount);
      count01 = count01 + Number(item.Discount);
      count1 = count1 + Number(item.Taxable_Amount);
      count2= count2 + Number(item.CGST_Amount);
      count3 = count3 + Number(item.SGST_Amount);
      count4= count4 + Number(item.IGST_Amount);
      count5 = count5 + Number(item.Line_Total_Amount);
    });
    this.Amount = count001.toFixed(2);
    this.Discount_Amount = count01.toFixed(2);
    this.Tax = count1.toFixed(2);
    this.CGST = count2.toFixed(2);
    this.SGST = count3.toFixed(2);
    this.IGST = count4.toFixed(2);
    this.Total_Amount = count5.toFixed(2);
    // this.Rounded_Off = Number(Math.round(Number(this.Total_Amount)) - Number(this.Total_Amount)).toFixed(2); 
    this.getRoundedOff();
    this.NetAMT = this.RoundOff(this.Total_Amount);
  }
  getRoundedOff(){
    this.Rounded_Off = Number(Math.round(Number(this.Total_Amount) + Number(this.ObjTopSale.TCS_Amount)) - (Number(this.Total_Amount) + Number(this.ObjTopSale.TCS_Amount))).toFixed(2);
  }
  GetTCSdat(){
    if (this.ObjTopSale.TCS_Y_N === 'YES') {
    this.ngxService.start();
    const obj = {
      "SP_String": "SP_MICL_Sale_Bill",
      "Report_Name_String": "Get_Tcs_Percentage_And_Ledger",
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log(data)
    this.TCSdataList = data;
    this.ngxService.stop();
  }); 
    }  
    else {
      this.ObjTopSale.TCS_Ledger_ID = 0;
      this.ObjTopSale.TCS_Persentage = 0;
      this.ObjTopSale.TCS_Amount = 0;
      this.ObjTopSale.TCS_Per = undefined;
      // this.objaddPurchacse.Grand_Total = this.objaddPurchacse.Net_Amt;
      this.getRoundedOff();
      // this.ObjVoucherTopper.DR_Amt = this.ObjSaleBillNew.Grand_Total;
  }
  }
  TcsAmtCalculation(){
    if (this.ObjTopSale.TCS_Per) {
        // this.ngxService.start();
        var tcspercentage = this.TCSdataList.filter(el=> Number(el.TCS_Persentage) === Number(this.ObjTopSale.TCS_Per))
          this.ObjTopSale.TCS_Ledger_ID = tcspercentage[0].TCS_Ledger_ID;
          this.ObjTopSale.TCS_Persentage = tcspercentage[0].TCS_Persentage;
          var netamount = (Number(this.Total_Amount)).toFixed(2);
          var TCS_Amount = (Number(Number(netamount) * this.ObjTopSale.TCS_Persentage) / 100).toFixed(2);
          this.ObjTopSale.TCS_Amount = Number(TCS_Amount);
          this.getRoundedOff();
          this.NetAMT = this.RoundOff(Number(this.Total_Amount) + Number(this.ObjTopSale.TCS_Amount));
          this.ngxService.stop();  
    }
      else {
        this.ObjTopSale.TCS_Ledger_ID = 0;
        this.ObjTopSale.TCS_Persentage = 0;
        this.ObjTopSale.TCS_Amount = 0;
        this.getRoundedOff();
        this.NetAMT = this.RoundOff(Number(this.Total_Amount) + Number(this.ObjTopSale.TCS_Amount));
    }
  }
  RoundOff(key:any){
    return Math.round(Number(Number(key).toFixed(2)))
  }
  SaveSaleBill(valid:any) {
    this.SaleBillFormSubmitted = true;
    this.TCSTaxRequiredValidation = true;
    if(this.SelectedChallanNo.length){
    if (valid) {
      this.compacctToast.clear();
     this.compacctToast.add({
       key: "s",
       sticky: true,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
    }
  }
  }
  onConfirmSave(){
    const FilterSubledger = this.CustmerList.filter((el: any) => Number(el.value) === Number(this.ObjTopSale.Sub_Ledger_ID))
      const TempSaveList = {
        Doc_No : this.DocNo ? this.DocNo : "A",
        Doc_Date: this.DateService.dateConvert(this.BillDate),	
        Sub_Ledger_ID	 : this.ObjTopSale.Sub_Ledger_ID,
			  Sub_Ledger_Name	: FilterSubledger[0].label,	
			  Sub_Ledger_GST	:	this.ObjTopSale.Sub_Ledger_GST_No,			
			  Billing_Name:	FilterSubledger[0].label,				
			  Address_1	:	this.ObjTopSale.Sub_Ledger_Address_1,			
			  Address_2	:	FilterSubledger[0].Sub_Ledger_Address_2,			
			  Address_3	:	FilterSubledger[0].Sub_Ledger_Address_3,	
			  Land_Mark	:	FilterSubledger[0].Sub_Ledger_Land_Mark,			
			  Pin	:		this.ObjTopSale.Sub_Ledger_Pin,					
			  District	:	this.ObjTopSale.Sub_Ledger_District	,						
			  State	:	this.ObjTopSale.Sub_Ledger_State,					
			  Country		:	FilterSubledger[0].Sub_Ledger_Country,				
			  Email:	FilterSubledger[0].Sub_Ledger_Email,					
			  Mobile_No	:FilterSubledger[0].Sub_Ledger_Mobile_No,					
			  Phone	:	FilterSubledger[0].Sub_Ledger_Mobile_No,		
        Discount_Amount : Number(this.Discount_Amount),					
			  Taxable_Amt	: Number(this.Tax),				
			  CGST_Amt:	Number(this.CGST),					
			  SGST_Amt: Number(this.SGST)	,					
			  IGST_Amt:	Number(this.IGST)	,					
			  Gross_Amt: Number(this.Total_Amount),					
			  Tax_Amt	: Number(this.Tax),								
			  Net_Amt: Number(this.NetAMT),								
			  User_ID	:	Number(this.$CompacctAPI.CompacctCookies.User_ID)	,									
			  Cost_Cen_ID	: Number(this.ObjTopSale.Cost_Cen_ID),	
        Rounded_Off : Number(this.Rounded_Off),																						
        Grand_Total: Number(this.NetAMT),
        Fin_Year_ID : Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID),
        Address_Type : this.ObjTopSale.Choose_Address,
        TCS_Y_N : this.ObjTopSale.TCS_Y_N,
        TCS_Per : this.ObjTopSale.TCS_Per,
        TCS_Amount : this.ObjTopSale.TCS_Amount,
        TCS_Ledger_ID : this.ObjTopSale.TCS_Ledger_ID,
        Product_Details : this.GridList
      }
      this.ChallanSave = [];
      // this.ObjTopSale.Bill_No.forEach(element => {
      this.SelectedChallanNo.forEach(element => {
      this.ChallanSave.push({
        Challan_No:element
      })
    });
           const obj = {
        "SP_String": "SP_MICL_Sale_Bill",
        "Report_Name_String": "Sale_Bill_Create",
        "Json_Param_String": JSON.stringify([TempSaveList]),
        "Json_1_String" : JSON.stringify(this.ChallanSave)
      }
      this.GlobalAPI.getData(obj).subscribe(async(data: any) => {
        var tempID = data[0].Column1;
        let msg = this.DocNo ? 'Update' : 'Create'
        let docno = this.DocNo ? this.DocNo : data[0].Column1
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: tempID,
            detail: "successfully " + msg,
          });
      await this.SaveUserActivity(msg,docno);
      this.ObjTopSale = new TopSale();
      this.BillDate = new Date();
      this.SaleBillFormSubmitted = false;
      this.TCSTaxRequiredValidation = false;
      this.ObjTopSale.TCS_Y_N = undefined;
      this.ObjTopSale.TCS_Persentage = 0;
      this.ObjTopSale.TCS_Amount = 0;
      this.ObjTopSale.TCS_Per = undefined;
      this.tabIndexToView = 0;
      this.items = ["BROWSE", "CREATE"];
      this.Amount = undefined;
      this.Discount_Amount = undefined;
      this.Tax = undefined;
      this.CGST = undefined;
      this.SGST = undefined;
      this.IGST = undefined;
      this.NetAMT = undefined;
      this.Rounded_Off = undefined;
      this.Total_Amount = undefined;
      this.GridList = [];
      this.SelectedChallanNo = [];
      this.DocNo = undefined;
      // this.router.navigate(['./MICL_Sale_Bill']);
      this.router.navigate(['./BL_Txn_Sale_Bill_From_Challan']);
      this.GetSerarchBrowse(true);
      // this.Tax_Category = undefined;
     }
     else {
         this.compacctToast.clear();
         this.compacctToast.add({
           key: "compacct-toast",
           severity: "error",
           summary: "Warn Message"  ,
           detail: "Error occured",                 
          });
     }
    });
  }
  onConfirm() {
    if (this.DocNo) {
      const obj = {
        "SP_String": "SP_MICL_Sale_Bill",
        "Report_Name_String": "Delete_Sale_Bill",
        "Json_Param_String": JSON.stringify([{ Doc_No: this.DocNo, User_ID: this.$CompacctAPI.CompacctCookies.User_ID }])
      }
      this.GlobalAPI.getData(obj).subscribe(async(data: any) => {
        var terd = data[0].Column1
        if (data[0].Column1 === this.DocNo) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success" ,
            summary: terd,
            detail: "Succesfully Delete",
          });
          await this.SaveUserActivity('Delete',this.DocNo);
          this.DocNo = undefined;
          this.GetSerarchBrowse(true);
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "delmsg",
            sticky: true,
            severity: "warn",
            summary: terd,
            // detail: "Confirm to proceed"
          });
        }
      });
    }
  }
  Delete(col){
    this.DocNo = undefined;
    if(col.Doc_No){
     this.DocNo = col.Doc_No
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
  Print(DocNo) {
    if (DocNo) {
      // if(DocNo){
      //  const url = `/Report/Print/MICL/sale_bill_print.html?Doc_No=${DocNo}`;
      //   window.open(url,"Print",  'fullscreen=yes, scrollbars=auto,width=950,height=500');
      
      // }
      const objtemp = {
        "SP_String": "SP_MICL_Sale_Bill",
        "Report_Name_String": "Sale_Bill_Print"
      }
      this.GlobalAPI.getData(objtemp).subscribe((data: any) => {
        if(data[0].Column1){
          var printlink = data[0].Column1;
          window.open(printlink + `?Doc_No=${DocNo}`, "Print", 'fullscreen=yes, scrollbars=auto,width=950,height=500');
        }
        
      })
    }
  }
  PrintChallan(DocNo){
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
  DownloadEINV(obj) {
    if (obj) {
        window.open(obj, '_self');
      
    }
  }
  onReject() {
    this.compacctToast.clear("c");
    this.compacctToast.clear("s");
    this.compacctToast.clear("delmsg");
  }

  Edit(col){
    this.clearData();
    this.DocNo = undefined;
    if(col.Doc_No){
      this.DocNo = col.Doc_No;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.getedit(col.Doc_No);
      this.geteditChallanNo(col.Doc_No);
      setTimeout(() => {
        this.getChallanNoEdit(col.Doc_No);
      }, 300);
     }
   }
   getedit(Dno){
    this.editlist = [];
    const obj = {
      "SP_String": "SP_MICL_Sale_Bill",
      "Report_Name_String": "Get_Data_For_Sale_Bill_Edit",
      "Json_Param_String": JSON.stringify([{Doc_No : Dno}])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editlist = data;
      this.ObjTopSale.Sub_Ledger_ID = data[0].Sub_Ledger_ID;
      this.CustmerNameChange();
      this.ObjTopSale.Choose_Address = data[0].Address_Type;
      this.ObjTopSale.Sub_Ledger_Address_1 = data[0].Address_1;
      this.ObjTopSale.Sub_Ledger_District = data[0].District;
      this.ObjTopSale.Sub_Ledger_State = data[0].State;
      this.ObjTopSale.Sub_Ledger_Pin = data[0].Pin;
      this.ObjTopSale.Sub_Ledger_GST_No = data[0].Sub_Ledger_GST;
      this.ObjTopSale.Cost_Cen_ID = data[0].Cost_Cen_ID;
      this.GetCosCenAddress();
      this.BillDate = new Date(data[0].Doc_Date);
      // this.RDBListAdd = data[0].L_element;
    })
   }
   geteditChallanNo(Dno){
    this.editChallanList = [];
    const obj = {
      "SP_String": "SP_MICL_Sale_Bill",
      "Report_Name_String": "Get_Sale_Challan_Nos_For_Edit",
      "Json_Param_String": JSON.stringify([{Doc_No : Dno}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         if(data.length) {
          data.forEach(element => {
            element['label'] = element.Doc_No,
            element['value'] = element.Doc_No								
          });
          this.ChallanNoList = data;
         } 
    })
  }
   getChallanNoEdit(Dno){
    this.editChallanList = [];
    const obj = {
      "SP_String": "SP_MICL_Sale_Bill",
      "Report_Name_String": "Get_Product_Details_For_Sale_Bill_Edit",
      "Json_Param_String": JSON.stringify([{Doc_No : Dno}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editChallanList = data;
      // if(this.editChallanList.length){
      //   for(let i of this.editChallanList){
      //     this.ChallanNoList.push({ Doc_No: i.Doc_No , label: i.Doc_No , value: i.Doc_No });
      //     console.log("ChallanNoList===",this.ChallanNoList);
      //  }
      // }
      this.Getchallandist();
      this.ObjTopSale.TCS_Y_N = data[0].TCS_Y_N;
      this.GetTCSdat();
      this.ObjTopSale.TCS_Per = data[0].TCS_Per;
      this.ObjTopSale.TCS_Ledger_ID = data[0].TCS_Ledger_ID;
      this.ObjTopSale.TCS_Amount = data[0].TCS_Amount ? Number(data[0].TCS_Amount) : 0;
      this.editChallanList.forEach(el=>{
        this.GridList.push({
          Cost_Cen_ID : el.Cost_Cen_ID,
          Cost_Cen_Name: el.Cost_Cen_Name,
          godown_id : el.godown_id,
          godown_name : el.godown_name,
          Product_Type_ID : el.Product_Type_ID,
          Product_Type : el.Product_Type,
          Product_Sub_Type_ID : el.Product_Sub_Type_ID,
          Product_Sub_Type : el.Product_Sub_Type,
          Product_ID : el.Product_ID,
          Product_Description : el.Product_Description,
          Product_Specification : el.Product_Specification,
          Batch_Number : el.Batch_Number,
          igst_tag : el.igst_tag,
          Qty : Number(el.Qty),
          UOM : el.UOM,
          Rate : Number(el.Rate),
          Amount : Number(Number(el.Qty * el.Rate).toFixed(2)),
          Discount_Type : el.Discount_Type,
          Discount_Type_Amount : el.Discount_Type_Amount,
          Discount : el.Discount,
          Taxable_Amount : el.Taxable_Amount,
          CGST_Rate : el.CGST_Rate,
          CGST_Amount : el.CGST_Amount,
          SGST_Rate : el.SGST_Rate,
          SGST_Amount : el.SGST_Amount,
          IGST_Rate : el.IGST_Rate,
          IGST_Amount : el.IGST_Amount,
          Line_Total_Amount : el.Line_Total_Amount
        });
      })
      this.TotalCalculation();
      this.NetAMT = this.RoundOff(Number(this.Total_Amount) + Number(this.ObjTopSale.TCS_Amount));
    })
   }
   Getchallandist(){
    this.SelectedChallanNo =[];
    this.ChallanNoList.forEach((item) => {
         this.SelectedChallanNo.push(item.Doc_No);
    });
  }
  async SaveUserActivity(activity,docno){
    const result = await this._CommonUserActivity.GetUserActivity(activity,'Sale Bill From Challan',docno,'0')
    console.log(result)
  }
}
class TopSale{
  Sub_Ledger_ID: any;
  Choose_Address: any;
  Sub_Ledger_Address_1: any;
  Sub_Ledger_District: any;
  Sub_Ledger_State: any;
  Sub_Ledger_Pin: any;
  Sub_Ledger_GST_No: any;
    Same_as_Bill: any;
    Cost_Cen_ID: any;
  Cost_Cen_Name: any;
  Cost_Cen_Address1: any;
  Cost_Cen_Address2: any;
  Cost_Cen_State: any;
  Cost_Cen_GST_No: any;
  Cost_Cen_Location: any;
  Cost_Cen_PIN: any;
  Cost_Cen_District: any;
  Cost_Cen_Country: any;
  Cost_Cen_Mobile: any;
  Cost_Cen_Phone: any;
  Cost_Cen_Email: any;

  Bill_No:any;

  TCS_Ledger_ID:any;
  TCS_Y_N : any;
  TCS_Persentage : any;
  TCS_Amount : number = 0;
  TCS_Per : any;
}
class BrowseSaleBill {
  Sub_Ledger_ID: any;
  From_Date: any;
  To_Date: any;
}
