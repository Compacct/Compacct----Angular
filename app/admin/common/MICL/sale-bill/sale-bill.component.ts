import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-sale-bill',
  templateUrl: './sale-bill.component.html',
  styleUrls: ['./sale-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SaleBillComponent implements OnInit {
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
  Tax:any = undefined;
  CGST:any = undefined;
  SGST:any = undefined;
  IGST:any = undefined;
  NetAMT: any = undefined;
  initDate: any = [];
  SerarchSaleBill: any = [];
  SerarchSaleBillHeader: any = [];
  DocNo :any  = undefined;
  Spinner = false;
  constructor(
    private Header: CompacctHeader,
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ){}

  ngOnInit() {
     this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Sale Bill",
      Link: " Financial Management ->  Sale Bill"
    });
    this.GetCustmer();
    this.GetCostcenter();
    this.GetStateList();
    this.Finyear();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData() {
    this.SaleBillFormSubmitted = false;
    this.ObjTopSale.Sub_Ledger_ID = undefined;
    this.ChallanNoList = [];
    this.ObjTopSale.Bill_No = undefined;
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
    this.Tax = undefined;
    this.CGST = undefined;
    this.SGST = undefined;
    this.IGST = undefined;
    this.NetAMT = undefined;
    this.SerarchSaleBill = [];
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
        if (data.length) {
          this.SerarchSaleBill = data;
          this.SerarchSaleBillHeader = data.length ? Object.keys(data[0]): []  
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
      //console.log("CustmerList==", this.CustmerList);
    });
  }
  GetCostcenter() {
    const obj = {
      "SP_String": "SP_MICL_Sale_Bill",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.CostCenterList = data;
      //console.log("this.CostCenterList", this.CostCenterList)
      this.ObjTopSale.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.GetCosCenAddress();
    })
  }
  GetCosCenAddress() {
    if (this.ObjTopSale.Cost_Cen_ID) {
      const ctrl = this;
      const costcenObj = $.grep(ctrl.CostCenterList, function (item: any) { return item.Cost_Cen_ID == ctrl.ObjTopSale.Cost_Cen_ID })[0];
      this.ObjTopSale = {...costcenObj}
      this.ObjTopSale.Cost_Cen_Email = costcenObj.Cost_Cen_Email1;
      this.ObjTopSale.Cost_Cen_State = costcenObj.Cost_Cen_State;
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
    this.ObjTopSale.Bill_No = undefined;
    this.ObjTopSale.Sub_Ledger_Address_1 = undefined;
    this.ObjTopSale.Sub_Ledger_District = undefined;
    this.ObjTopSale.Sub_Ledger_State = undefined;
    this.ObjTopSale.Sub_Ledger_Pin = undefined;
    this.ObjTopSale.Sub_Ledger_GST_No = undefined;
    this.SaveAddress = [];
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
    })
    this.getChallanNo();  
  }
  onChangeAdd() {
    if (this.ObjTopSale.Choose_Address) {
      this.ObjTopSale.Sub_Ledger_Address_1 = this.SaveAddress[0].Address_1,
      this.ObjTopSale.Sub_Ledger_District = this.SaveAddress[0].District,
      this.ObjTopSale.Sub_Ledger_State = this.SaveAddress[0].State,
      this.GetStateList()
      this.ObjTopSale.Sub_Ledger_Pin = this.SaveAddress[0].Pin
      this.ObjTopSale.Sub_Ledger_GST_No = this.SaveAddress[0].Sub_Ledger_GST_No
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
      "SP_String": "SP_MICL_Purchase_Bill_New",
      "Report_Name_String": "Get_State_List",
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
    //console.log("ChallanNoList==",data);
     if(data.length) {
       data.forEach(element => {
         element['label'] = element.Doc_No,
         element['value'] = element.Doc_No								
       });
       this.ChallanNoList = data;   
      } 
   });
  }
  getButtomTable() {
    this.GridList = [];
    this.TempObj = [];
    this.Tax = undefined;
    this.CGST = undefined;
    this.SGST = undefined;
    this.IGST = undefined;
    this.NetAMT = undefined;
    this.ObjTopSale.Bill_No.forEach(element => {
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
         this.TotalCalculation();
      }
     
    })  
  }
  TotalCalculation() {
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
    this.GridList.forEach(item => {
      count1 = count1 + Number(item.Taxable_Amount);
      count2= count2 + Number(item.CGST_Amount);
      count3 = count3 + Number(item.SGST_Amount);
      count4= count4 + Number(item.IGST_Amount);
      count5 = count5 + Number(item.Line_Total_Amount);
    });
    this.Tax = count1.toFixed(2);
    this.CGST = count2.toFixed(2);
    this.SGST = count3.toFixed(2);
    this.IGST = count4.toFixed(2);
    this.NetAMT = count5.toFixed(2);
  }
  SaveSaleBill(valid:any) {
    this.SaleBillFormSubmitted = true;
    if (valid) {
      const FilterSubledger = this.CustmerList.filter((el: any) => Number(el.value) === Number(this.ObjTopSale.Sub_Ledger_ID))
      const TempSaveList = {
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
			Taxable_Amt	: this.Tax,				
			CGST_Amt:	this.CGST,					
			SGST_Amt: this.SGST	,					
			IGST_Amt:	this.IGST	,					
			Gross_Amt: this.NetAMT,					
			Tax_Amt	: this.Tax,								
			Net_Amt: this.NetAMT,								
			User_ID	:	this.$CompacctAPI.CompacctCookies.User_ID	,									
			Cost_Cen_ID	:this.ObjTopSale.Cost_Cen_ID,																							
      Grand_Total: this.NetAMT,
      Fin_Year_ID : this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
      }
      this.ChallanSave = [];
      this.ObjTopSale.Bill_No.forEach(element => {
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
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        var tempID = data[0].Column1;
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: tempID,
            detail: "successfully Create ",
          });
      this.ObjTopSale = new TopSale();
      this.BillDate = new Date();
      this.SaleBillFormSubmitted = false
      this.tabIndexToView = 0;
      this.items = ["BROWSE", "CREATE"];
      this.Tax = undefined;
      this.CGST = undefined;
      this.SGST = undefined;
      this.IGST = undefined;
      this.NetAMT = undefined;
      this.GridList = [];
     }
    });
    }
  }
  onConfirm() {
    if (this.DocNo) {
      const obj = {
        "SP_String": "SP_MICL_Sale_Bill",
        "Report_Name_String": "Delete_Sale_Bill",
        "Json_Param_String": JSON.stringify([{ Doc_No: this.DocNo, User_ID: this.$CompacctAPI.CompacctCookies.User_ID }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        var terd = data[0].Column1
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: terd === "Can not delete ! Bill Already generated" ? "error" :"success" ,
            summary: terd,
            detail: terd === "Can not delete ! Bill Already generated" ? "" :  "Succesfully Delete",
          });
          this.DocNo = undefined;
          this.GetSerarchBrowse(true);
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
  onReject() {
    this.compacctToast.clear("c");
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

  Bill_No: any;
}
class BrowseSaleBill {
  Sub_Ledger_ID: any;
  From_Date: any;
  To_Date: any;
}
