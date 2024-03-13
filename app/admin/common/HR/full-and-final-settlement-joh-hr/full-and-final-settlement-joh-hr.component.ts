import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { data, escapeSelector } from "jquery";
import { Console, timeStamp } from "console";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-full-and-final-settlement-joh-hr',
  templateUrl: './full-and-final-settlement-joh-hr.component.html',
  styleUrls: ['./full-and-final-settlement-joh-hr.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class FullAndFinalSettlementJohHrComponent implements OnInit {
  items: any = [];
  Spinner = false;
  saveSpinner = false;
  seachSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  Emp_ID: any;
  ObjFullAndFinalSettlement: FullAndFinalSettlement = new FullAndFinalSettlement();
  FullAndFinalSettlementFormSubmitted: boolean = false;
  Joining_Dt: any = Date;
  Resign_On: any = Date;
  Leave_Dt: any = Date;
  EmployeeList: any = [];
  TotalEarningList: any = [];
  LastMonthEarningList: any = [];
  BonusList: any = [];
  EncashmentList: any = [];
  GratuityList: any = [];
  FullFinalSettlementBrowseList: any = [];
  DynamicHeaderforFullFinalBrowseList: any = [];
  Editlist: any = [];
  currentmonth: any;

  constructor(
    private http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: " Full And Final Settlement ",
      Link: "HR-> Full And Final Settlement "
    });
    // this.getEmployee();
    // this.GetFullFinalSettlementBrowse();
    this.ObjFullAndFinalSettlement.Total_Gross_Amount = 0;
    this.ObjFullAndFinalSettlement.Last_Gross_Amount = 0;
    this.ObjFullAndFinalSettlement.Total_Deduction = 0;
    this.ObjFullAndFinalSettlement.Total_Statutory_Earnings = 0;
    this.ObjFullAndFinalSettlement.Net_Payable = 0;

    const currentdate = new Date();
    const month = currentdate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    this.currentmonth = monthNames[month].toUpperCase();
    console.log('monthNames====', monthNames[month]);
  }
  TabClick(e) {
    // console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.Spinner = false;
    this.Emp_ID = undefined;
    this.ObjFullAndFinalSettlement = new FullAndFinalSettlement();
    this.Joining_Dt = undefined;
    this.Resign_On = undefined;
    this.Leave_Dt = undefined;
    this.ObjFullAndFinalSettlement.Total_Gross_Amount = 0;
    this.ObjFullAndFinalSettlement.Last_Gross_Amount = 0;
    this.ObjFullAndFinalSettlement.Total_Deduction = 0;
    this.ObjFullAndFinalSettlement.Total_Statutory_Earnings = 0;
    this.ObjFullAndFinalSettlement.Net_Payable = 0;
  }
  getEmployee() {
    this.EmployeeList = [];
    const obj = {
      "SP_String": "SP_HR_Full_And_Final_Settlement",
      "Report_Name_String": "Get_Employee_List",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //  console.log("this.AllEmployeeList",this.AllEmployeeList);
      if (data.length) {
        data.forEach((el: any) => {
          el['label'] = el.Emp_Name,
            el['value'] = el.Emp_ID
        });
        this.EmployeeList = data;
      }
      else {
        this.EmployeeList = [];
      }
    })
  }
  getEmployeeDetails() {
    // this.ObjFullAndFinalSettlement.Emp_Name = undefined;
    // this.ObjFullAndFinalSettlement.Emp_ID = undefined;
    // this.ObjFullAndFinalSettlement.Emp_Code = undefined;
    // this.ObjFullAndFinalSettlement.Designation = undefined;
    // this.ObjFullAndFinalSettlement.Emp_Joining_Dt = undefined;
    this.Joining_Dt = undefined;
    // this.ObjFullAndFinalSettlement.Resign_On = undefined;
    this.Resign_On = undefined;
    // this.ObjFullAndFinalSettlement.Emp_Leave_Dt = undefined;
    this.Leave_Dt = undefined;
    // this.ObjFullAndFinalSettlement.No_of_Days_Worked = undefined;

    // this.ObjFullAndFinalSettlement.Total_Days = undefined;
    // this.ObjFullAndFinalSettlement.Total_Basic_Amount = 0;
    // this.ObjFullAndFinalSettlement.Total_HRA_Amount = 0;
    // this.ObjFullAndFinalSettlement.Total_Conv_Allowance = 0;
    // this.ObjFullAndFinalSettlement.Total_Children_Allowance = 0;
    // this.ObjFullAndFinalSettlement.Total_Medical_Allowance = 0;
    // this.ObjFullAndFinalSettlement.Total_Washing_Allowance = 0;
    // this.ObjFullAndFinalSettlement.Total_Gross_Amount = 0;

    this.ObjFullAndFinalSettlement = new FullAndFinalSettlement();
    this.ObjFullAndFinalSettlement.Total_Gross_Amount = 0;
    this.ObjFullAndFinalSettlement.Last_Gross_Amount = 0;
    this.ObjFullAndFinalSettlement.Total_Deduction = 0;
    this.ObjFullAndFinalSettlement.Total_Statutory_Earnings = 0;
    this.ObjFullAndFinalSettlement.Net_Payable = 0;

    if (this.Emp_ID) {
      const empdetails = this.EmployeeList.filter(item => Number(item.Emp_ID) == Number(this.Emp_ID))
      this.ObjFullAndFinalSettlement.Emp_Name = empdetails.length ? empdetails[0].Emp_Name : undefined;
      this.ObjFullAndFinalSettlement.Emp_ID = empdetails.length ? empdetails[0].Emp_ID : undefined;
      this.ObjFullAndFinalSettlement.Emp_Code = empdetails.length ? empdetails[0].Emp_Code : undefined;
      this.ObjFullAndFinalSettlement.Design_ID = empdetails.length ? empdetails[0].Desig_ID : undefined;
      this.ObjFullAndFinalSettlement.Designation = empdetails.length ? empdetails[0].Designation : undefined;
      this.Joining_Dt = empdetails.length ? new Date(empdetails[0].Emp_Joining_Dt) : undefined;
      this.Resign_On = empdetails.length ? new Date(empdetails[0].Resign_On) : undefined;
      this.Leave_Dt = empdetails.length ? new Date(empdetails[0].Emp_Leave_Dt) : undefined;
      this.ObjFullAndFinalSettlement.No_Of_Days_Worked = empdetails.length ? empdetails[0].No_Of_Days_Worked : undefined;
      this.getEmployeeTotalEarningDetails();
    }
  }
  getEmployeeTotalEarningDetails() {
    this.TotalEarningList = [];
    const obj = {
      "SP_String": "SP_HR_Full_And_Final_Settlement",
      "Report_Name_String": "Get_Total_Earning_Details",
      "Json_Param_String": JSON.stringify([{ Emp_ID: this.Emp_ID }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.TotalEarningList = data;
      //  console.log("this.AllEmployeeList",this.AllEmployeeList)
      this.ObjFullAndFinalSettlement.Total_Basic_Amount = data[0].Earnings_Basic_Salary ? data[0].Earnings_Basic_Salary : 0;
      this.ObjFullAndFinalSettlement.Total_HRA_Amount = data[0].Earnings_HRA ? data[0].Earnings_HRA : 0;
      this.ObjFullAndFinalSettlement.Total_Conv_Allowance = data[0].Earnings_Conveyance_Allowance ? data[0].Earnings_Conveyance_Allowance : 0;
      this.ObjFullAndFinalSettlement.Total_Children_Allowance = data[0].Earnings_Children_Education_Allowance ? data[0].Earnings_Children_Education_Allowance : 0;
      this.ObjFullAndFinalSettlement.Total_Medical_Allowance = data[0].Earnings_Medical_Allownce ? data[0].Earnings_Medical_Allownce : 0;
      this.ObjFullAndFinalSettlement.Total_Washing_Allowance = data[0].Earnings_Washing_Allowance ? data[0].Earnings_Washing_Allowance : 0;
      // this.ObjFullAndFinalSettlement.Total_Days = data[0].Total_Payable_Days ? data[0].Total_Payable_Days : 0;
      var Total_Gross_Amount = Number(this.ObjFullAndFinalSettlement.Total_Basic_Amount) + Number(this.ObjFullAndFinalSettlement.Total_HRA_Amount) +
        Number(this.ObjFullAndFinalSettlement.Total_Conv_Allowance) + Number(this.ObjFullAndFinalSettlement.Total_Children_Allowance) +
        Number(this.ObjFullAndFinalSettlement.Total_Medical_Allowance) + Number(this.ObjFullAndFinalSettlement.Total_Washing_Allowance)
      this.ObjFullAndFinalSettlement.Total_Gross_Amount = Number(Total_Gross_Amount).toFixed(2);
      // this.getEmployeeLastMonthEarningDetails();
      this.GetBonusDetails();
      this.CalculateNoticePeriod();

      this.ObjFullAndFinalSettlement.EPF_Deduction = data[0].EPF ? data[0].EPF : 0;
      this.ObjFullAndFinalSettlement.ESI_Deduction = data[0].ESIC ? data[0].ESIC : 0;
      this.ObjFullAndFinalSettlement.P_Tax_Deduction = data[0].P_TAX ? data[0].P_TAX : 0;
      this.ObjFullAndFinalSettlement.TDS_Deduction = data[0].TDS ? data[0].TDS : 0;
      this.GetTotalDeduction();
    })
  }
  getEmployeeLastMonthEarningDetails() {
    this.LastMonthEarningList = [];
    if (this.ObjFullAndFinalSettlement.Last_Month_Payable_Days) {
      const senddata = {
        Emp_ID: this.Emp_ID,
        Days: this.ObjFullAndFinalSettlement.Last_Month_Payable_Days
      }
      const obj = {
        "SP_String": "SP_HR_Full_And_Final_Settlement",
        "Report_Name_String": "Get_Last_Month_Earning_Details",
        "Json_Param_String": JSON.stringify([senddata])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.LastMonthEarningList = data;
        //  console.log("this.AllEmployeeList",this.AllEmployeeList)
        this.ObjFullAndFinalSettlement.Last_Basic_Amount = data[0].Earnings_Basic_Salary ? data[0].Earnings_Basic_Salary : 0;
        this.ObjFullAndFinalSettlement.Last_HRA_Amount = data[0].Earnings_HRA ? data[0].Earnings_HRA : 0;
        this.ObjFullAndFinalSettlement.Last_Conv_Allowance = data[0].Earnings_Conveyance_Allowance ? data[0].Earnings_Conveyance_Allowance : 0;
        this.ObjFullAndFinalSettlement.Last_Children_Allowance = data[0].Earnings_Children_Education_Allowance ? data[0].Earnings_Children_Education_Allowance : 0;
        this.ObjFullAndFinalSettlement.Last_Medical_Allowance = data[0].Earnings_Medical_Allownce ? data[0].Earnings_Medical_Allownce : 0;
        this.ObjFullAndFinalSettlement.Last_Washing_Allowance = data[0].Earnings_Washing_Allowance ? data[0].Earnings_Washing_Allowance : 0;
        // this.ObjFullAndFinalSettlement.Last_Month_Payable_Days = data[0].Total_Payable_Days ? data[0].Total_Payable_Days : 0;
        var Last_Gross_Amount = Number(this.ObjFullAndFinalSettlement.Last_Basic_Amount) + Number(this.ObjFullAndFinalSettlement.Last_HRA_Amount) +
          Number(this.ObjFullAndFinalSettlement.Last_Conv_Allowance) + Number(this.ObjFullAndFinalSettlement.Last_Children_Allowance) +
          Number(this.ObjFullAndFinalSettlement.Last_Medical_Allowance) + Number(this.ObjFullAndFinalSettlement.Last_Washing_Allowance)
        this.ObjFullAndFinalSettlement.Last_Gross_Amount = Number(Last_Gross_Amount).toFixed(2);

        this.GetBonusDetails();
        this.CalculateNoticePeriod();

        this.ObjFullAndFinalSettlement.EPF_Deduction = data[0].EPF ? data[0].EPF : 0;
        this.ObjFullAndFinalSettlement.ESI_Deduction = data[0].ESIC ? data[0].ESIC : 0;
        this.ObjFullAndFinalSettlement.P_Tax_Deduction = data[0].P_TAX ? data[0].P_TAX : 0;
        this.ObjFullAndFinalSettlement.TDS_Deduction = data[0].TDS ? data[0].TDS : 0;
        this.GetTotalDeduction();
      })
    }
  }
  GetBonusDetails() {
    this.BonusList = [];
    this.EncashmentList = [];
    this.GratuityList = [];
    const objbonus = {
      "SP_String": "SP_HR_Full_And_Final_Settlement",
      "Report_Name_String": "Get_Bonus",
      "Json_Param_String": JSON.stringify([{ Emp_ID: this.Emp_ID }])
    }
    const objencashment = {
      "SP_String": "SP_HR_Full_And_Final_Settlement",
      "Report_Name_String": "Get_Leave_Encashment",
      "Json_Param_String": JSON.stringify([{ Emp_ID: this.Emp_ID }])
    }
    const objgratuity = {
      "SP_String": "SP_HR_Full_And_Final_Settlement",
      "Report_Name_String": "Get_Gratuity",
      "Json_Param_String": JSON.stringify([{ Emp_ID: this.Emp_ID }])
    }
    forkJoin([
      this.GlobalAPI.getData(objbonus),
      this.GlobalAPI.getData(objencashment),
      this.GlobalAPI.getData(objgratuity),
    ]).subscribe(([Bonus, Encashment, ggratuity]) => {
      console.log("Bonus", Bonus)
      console.log("Encashment", Encashment)
      console.log("Gratuity", ggratuity)
      this.BonusList = Bonus;
      this.EncashmentList = Encashment;
      this.GratuityList = ggratuity;
      this.ObjFullAndFinalSettlement.Bonus = Bonus.length ? Bonus[0].Bonus ? Bonus[0].Bonus : 0 : 0;
      this.ObjFullAndFinalSettlement.Leave_Balance = Encashment.length ? Encashment[0].Leave_Days ? Encashment[0].Leave_Days : 0 : 0;
      this.ObjFullAndFinalSettlement.Leave_Encashment = Encashment.length ? Encashment[0].Leave_Amount ? Encashment[0].Leave_Amount : 0 : 0;
      this.ObjFullAndFinalSettlement.Gratuity = ggratuity.length ? ggratuity[0].Gratuity ? ggratuity[0].Gratuity : 0 : 0;
      this.GetNoticePeriodEarningAmount();
      this.CalculateTotalStatutoryEarnings();
    })

  }
  // STATUTORY EARNING
  GetNoticePeriodEarningAmount() {
    this.ObjFullAndFinalSettlement.Notice_Period_Earning_Amount = 0;
    if (this.ObjFullAndFinalSettlement.Notice_Period_Earning_Day) {
      const obj = {
        "SP_String": "SP_HR_Full_And_Final_Settlement",
        "Report_Name_String": "Get_Notice_Periods_Earning_Amount",
        "Json_Param_String": JSON.stringify([{ Emp_ID: this.Emp_ID, Days: Number(this.ObjFullAndFinalSettlement.Notice_Period_Earning_Day) }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        //  console.log("this.AllEmployeeList",this.AllEmployeeList)
        this.ObjFullAndFinalSettlement.Notice_Period_Earning_Amount = data[0].Notice_Period_Earning_Amount ? Number(data[0].Notice_Period_Earning_Amount).toFixed(2) : 0;
        this.CalculateTotalStatutoryEarnings();
      })
    }
  }
  CalculateTotalStatutoryEarnings() {
    var Total_Statutory_Earnings = Number(this.ObjFullAndFinalSettlement.Bonus) + Number(this.ObjFullAndFinalSettlement.Leave_Encashment) +
      Number(this.ObjFullAndFinalSettlement.Gratuity) + Number(this.ObjFullAndFinalSettlement.Notice_Period_Earning_Amount)
    this.ObjFullAndFinalSettlement.Total_Statutory_Earnings = Number(Total_Statutory_Earnings).toFixed(2);
    this.GetNetPayble();
  }
  CalculateNoticePeriod() {
    if (this.ObjFullAndFinalSettlement.Notice_Period_Day) {
      const date = new Date(this.Leave_Dt);
      const totaldays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      console.log("totaldays====", totaldays);
      // var result = Number(this.ObjFullAndFinalSettlement.Last_Gross_Amount / totaldays).toFixed(2);
      var result = Number(this.ObjFullAndFinalSettlement.Total_Basic_Amount / totaldays).toFixed(2);
      var noticeperioddeduction = Number(this.ObjFullAndFinalSettlement.Notice_Period_Day * Number(result)).toFixed(2);
      this.ObjFullAndFinalSettlement.Notice_Period_Amount = Number(noticeperioddeduction);
      // Notice Period Deduction--->
      // Notice Period Deduction=Gross Salary/Last Month Total Days=Result1
      //                   =Input Deduction Days * Result1
      //                   = Value
      this.GetTotalDeduction();
      this.GetNetPayble();
    }
    else {
      this.ObjFullAndFinalSettlement.Notice_Period_Amount = 0;
      this.GetTotalDeduction();
      this.GetNetPayble();
    }
  }
  GetTotalDeduction() {
    var Total_Deduction = Number(this.ObjFullAndFinalSettlement.EPF_Deduction) + Number(this.ObjFullAndFinalSettlement.ESI_Deduction) +
      Number(this.ObjFullAndFinalSettlement.P_Tax_Deduction) + Number(this.ObjFullAndFinalSettlement.TDS_Deduction) +
      Number(this.ObjFullAndFinalSettlement.Notice_Period_Amount);
    this.ObjFullAndFinalSettlement.Total_Deduction = Number(Total_Deduction).toFixed(2);
  }
  GetNetPayble() {
    var TotalAB = (Number(this.ObjFullAndFinalSettlement.Last_Gross_Amount) + Number(this.ObjFullAndFinalSettlement.Total_Statutory_Earnings)).toFixed(2);
    var Net_Payable = Number(TotalAB) - Number(this.ObjFullAndFinalSettlement.Total_Deduction)
    this.ObjFullAndFinalSettlement.Net_Payable = Number(this.RoundOff(Net_Payable)).toFixed(2);
  }
  getTofix(key) {
    return Number(Number(key).toFixed(2))
  }
  RoundOff(key: any) {
    return Math.round(Number(Number(key).toFixed(2)))
  }
  SaveFullAndFinalSettlement(valid) {
    this.FullAndFinalSettlementFormSubmitted = true;
    this.Spinner = true;
    if (valid) {
      // let msg = this.buttonname == "Create" ? "Create" : "Update";
      this.ObjFullAndFinalSettlement.DOJ = this.DateService.dateConvert(new Date(this.Joining_Dt));
      this.ObjFullAndFinalSettlement.DOR = this.DateService.dateConvert(new Date(this.Resign_On));
      this.ObjFullAndFinalSettlement.DOL = this.DateService.dateConvert(new Date(this.Leave_Dt));
      const obj = {
        "SP_String": "SP_HR_Full_And_Final_Settlement",
        "Report_Name_String": "Save_Data",
        "Json_Param_String": JSON.stringify(this.ObjFullAndFinalSettlement)
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log("save data",data);
        if (data[0].Column1) {
          this.Spinner = false;
          this.FullAndFinalSettlementFormSubmitted = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            // summary: "Message",
            detail: "Succesfully Saved"
          });
          this.Emp_ID = undefined;
          this.ObjFullAndFinalSettlement = new FullAndFinalSettlement();
          this.Joining_Dt = undefined;
          this.Resign_On = undefined;
          this.Leave_Dt = undefined;
          this.ObjFullAndFinalSettlement.Total_Gross_Amount = 0;
          this.ObjFullAndFinalSettlement.Last_Gross_Amount = 0;
          this.ObjFullAndFinalSettlement.Total_Deduction = 0;
          this.ObjFullAndFinalSettlement.Total_Statutory_Earnings = 0;
          this.ObjFullAndFinalSettlement.Net_Payable = 0;
          if (this.buttonname === "Update") {
            this.tabIndexToView = 0;
            this.items = ["BROWSE", "Create"];
            this.buttonname = "Save";
          }
          this.GetFullFinalSettlementBrowse();
        }
        else {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error message ",
            detail: "Error occured "
          });
        }
      });
    }
  }

  // BROWSE
  GetFullFinalSettlementBrowse() {
    const obj = {
      "SP_String": "SP_HR_Full_And_Final_Settlement",
      "Report_Name_String": "Browse_Data"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.FullFinalSettlementBrowseList = data;
      // this.BackupSearchedlist = data;
      // this.GetDistinct();
      if (this.FullFinalSettlementBrowseList.length) {
        this.DynamicHeaderforFullFinalBrowseList = Object.keys(data[0]);
      }
      else {
        this.DynamicHeaderforFullFinalBrowseList = [];
      }
      console.log("FullFinalSettlementBrowseList", this.FullFinalSettlementBrowseList);
    })

  }
  Printfullandfinal(empid: any) {
    //console.log("DocNo",DocNo)
    if (empid) {
      const objtemp = {
        "SP_String": "SP_HR_Full_And_Final_Settlement",
        "Report_Name_String": "Full_and_Final_Settlement_Print"
      }
      this.GlobalAPI.getData(objtemp).subscribe((data: any) => {
        var printlink = data[0].Column1;
        window.open(printlink + "?Emp_ID=" + empid, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
        // console.log("doc===",DocNo.Doc_No)
      })
    }
  }
  Edit(col) {
    this.Emp_ID = undefined;
    this.ObjFullAndFinalSettlement = new FullAndFinalSettlement();
    this.Joining_Dt = undefined;
    this.Resign_On = undefined;
    this.Leave_Dt = undefined;
    this.ObjFullAndFinalSettlement.Total_Gross_Amount = 0;
    this.ObjFullAndFinalSettlement.Last_Gross_Amount = 0;
    this.ObjFullAndFinalSettlement.Total_Deduction = 0;
    this.ObjFullAndFinalSettlement.Total_Statutory_Earnings = 0;
    this.ObjFullAndFinalSettlement.Net_Payable = 0;
    if (col) {
      this.Emp_ID = col;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.getedit(col);
    }
  }
  getedit(Dno) {
    this.Editlist = [];
    const obj = {
      "SP_String": "SP_HR_Full_And_Final_Settlement",
      "Report_Name_String": "Get_Data_For_Update",
      "Json_Param_String": JSON.stringify([{ Emp_ID: Dno }])

    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.Editlist = data;
      console.log("Edit data", data);
      this.ObjFullAndFinalSettlement = data[0];
      this.Joining_Dt = new Date(data[0].DOJ);
      this.Resign_On = new Date(data[0].DOR);
      this.Leave_Dt = new Date(data[0].DOL);
    })
  }
  onReject() { }
  onConfirm() { }

}
class FullAndFinalSettlement {
  Emp_Name: any;
  Emp_ID: any;
  Emp_Code: any;
  Design_ID: any;
  Designation: any;
  DOJ: any;
  DOR: any;
  DOL: any;
  No_Of_Days_Worked: any;

  Total_Basic_Amount: any;
  Total_HRA_Amount: any;
  Total_Conv_Allowance: any;
  Total_Children_Allowance: any;
  Total_Medical_Allowance: any;
  Total_Washing_Allowance: any;
  Total_Days: any;
  Total_Gross_Amount: any;

  Last_Basic_Amount: any;
  Last_HRA_Amount: any;
  Last_Conv_Allowance: any;
  Last_Children_Allowance: any;
  Last_Medical_Allowance: any;
  Last_Washing_Allowance: any;
  Last_Month_Payable_Days: any;
  Last_Gross_Amount: any;

  Bonus_Day: any;
  Bonus: any;
  Leave_Balance: any;
  Leave_Encashment: any;
  Gratuity: any;
  Notice_Period_Earning_Day: any;
  Notice_Period_Earning_Amount: any;
  Total_Statutory_Earnings: any;

  EPF_Deduction: any;
  ESI_Deduction: any;
  P_Tax_Deduction: any;
  TDS_Deduction: any;
  Total_Deduction: any;
  Net_Payable: any;
  Notice_Period_Day: any;
  Notice_Period_Amount: any;

}
