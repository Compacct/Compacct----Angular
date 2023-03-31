import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-micl-coupon-issue',
  templateUrl: './micl-coupon-issue.component.html',
  styleUrls: ['./micl-coupon-issue.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MICLCouponIssueComponent implements OnInit {
  items: any = [];
  tabIndexToView= 0;
  buttonname = "Save";
  CouponFormsSubmitted: boolean = false;
  ObjCouponIssue: CouponIssue = new CouponIssue();
  EmployeeList: any = [];
  CouponList: any = [];
  ChangeFieldName: boolean = false;
  if_Visitor: boolean = false;
  CouponDate: Date = new Date();
  TotalCoupon: number = 0;
  TotalAmount: any = undefined;
  reqCheck: boolean = false;
  AddList: any = [];
  SaveFinal: any = [];
  QtyTotal: number = 0;
  CouponDateBrowseFirst: Date = new Date();
  CouponDateBrowseEnd: Date = new Date();
  BrowseData: any = [];
  NoDataFound: boolean = false;
  EmpId: any = undefined;
  EmpNmae: any = undefined;
  visitorName: any = undefined;
  Date_Delete: any = undefined;
  
  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header: CompacctHeader ,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
  ) {}

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.header.pushHeader({
      Header: "Coupon Issue",
      Link: " HR -> Coupon Issue"
    })
    this.getEmpList();
    this.getCoupontype();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData() {
    this.CouponFormsSubmitted = false;
    this.TotalCoupon = 0;
    this.TotalAmount = undefined;
    this.if_Visitor = false;
    this.CouponDate = new Date();
    this.ObjCouponIssue = new CouponIssue();
  }
  changeField() {
    this.ObjCouponIssue.Visitor_Name = '';
    this.ObjCouponIssue.Emp_ID = undefined;
  }
  getEmpList() {
    this.EmployeeList = []
    const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Get_Employee_List",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach((xy: any) => {
          xy['label'] = xy.Emp_Name
          xy['value'] = xy.Emp_ID
        });
        this.EmployeeList = data
         //console.log("EmployeeList==",this.EmployeeList)
      }
    });
  }
  getCoupontype() {
    this.CouponList = []
    const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Get_Coupon_Type",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        this.CouponList = data
        // console.log("CouponList==",this.CouponList)
      }
    });
  }
  calucation() {
    if ((Number(this.ObjCouponIssue.End_No) && Number(this.ObjCouponIssue.Start_No)) && Number(this.ObjCouponIssue.End_No) > Number(this.ObjCouponIssue.Start_No)) {
      this.TotalCoupon = Number(this.ObjCouponIssue.End_No - this.ObjCouponIssue.Start_No) + 1
      this.reqCheck = false;
      this.AmountCalcutaion(); 
    }
    else {
      if (this.ObjCouponIssue.End_No) {
       this.reqCheck = true; 
      }
        this.TotalCoupon = 0 
    }
    
  }
  AmountCalcutaion() {
    let filterAmt:any =[]
    if (this.ObjCouponIssue.Coupon_Type !== undefined) {
        filterAmt = this.CouponList.filter((Elee: any) => Elee.Coupon_Type === this.ObjCouponIssue.Coupon_Type); 
    }
    if (filterAmt.length === 1&& this.TotalCoupon) {
      this.TotalAmount = Number(filterAmt[0].Amount) * Number(this.TotalCoupon)
    }
    else {
      this.TotalAmount = undefined; 
    }
  }
  AddData(valid:any) {
    this.CouponFormsSubmitted = true;
    this.Validation_Of_Coupon();
    if (valid && Number(this.ObjCouponIssue.End_No) > Number(this.ObjCouponIssue.Start_No)) {
     this.ObjCouponIssue.Created_By = this.compact.CompacctCookies.User_ID; 
      this.ObjCouponIssue.Date = this.DateService.dateConvert(this.CouponDate);
      this.AddList.push({
          Date :	this.ObjCouponIssue.Date,	
          Coupon_Type	: this.ObjCouponIssue.Coupon_Type,	
          Start_No: this.ObjCouponIssue.Start_No,	
          End_No: this.ObjCouponIssue.End_No,	
          No_Of_Coupon: this.TotalCoupon,	
          Total_Amount: this.TotalAmount,
          Created_By: this.ObjCouponIssue.Created_By, 
      })
      if (this.AddList.length) {
       this.GetTotalAmount(); 
      }
      this.CouponFormsSubmitted = false;
      this.TotalCoupon = 0;
      this.TotalAmount = undefined;
      this.CouponDate = new Date();
      this.ObjCouponIssue.Coupon_Type = undefined;
      this.ObjCouponIssue.Start_No = undefined;
      this.ObjCouponIssue.End_No = undefined;
    }
  }
  Validation_Of_Coupon() {
    if (this.ObjCouponIssue.Start_No && this.ObjCouponIssue.Start_No) {
      const Value = {
        Start_No: this.ObjCouponIssue.Start_No,
        End_No: this.ObjCouponIssue.End_No 
      }
      const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Get_Coupon_Receive",
      "Json_Param_String": JSON.stringify([Value])
    }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
       console.log("Get_Coupon_Receive==",data)
        if (!data.length) {
         this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary:"This coupon has already been used",
          detail: "Not Ablavlable"
        });
      }
    }); 
    }
   
  }
  deleteRaw(ind:any) {
    this.AddList.splice(ind,1)
  }
  GetTotalAmount(){
  let flg:Number = 0
  this.AddList.forEach((ele:any) => {
    flg = Number(ele.Total_Amount) + Number(flg)
  });
  this.QtyTotal = Number(Number(flg).toFixed())
  return this.QtyTotal
}
  FinalSave() {
    if (this.AddList.length) {
      let FilterEmp: any = [];
      let EmpName: any = '';
      if (this.ObjCouponIssue.Emp_ID) {
        FilterEmp = this.EmployeeList.filter((Ele: any) => Ele.Emp_ID === this.ObjCouponIssue.Emp_ID)
        EmpName = FilterEmp[0].Emp_Name; 
      }
      this.AddList.forEach(el => {
        this.SaveFinal.push({
          Emp_ID: this.ObjCouponIssue.Emp_ID ? this.ObjCouponIssue.Emp_ID : 0,
          Emp_Name: EmpName ? EmpName : "",
          Visitor_Name: this.ObjCouponIssue.Visitor_Name ? this.ObjCouponIssue.Visitor_Name : "",
          Date: el.Date ? this.DateService.dateConvert(el.Date) : null,
          Coupon_Type: el.Coupon_Type,
          Start_No: el.Start_No,
          End_No: el.End_No,
          No_Of_Coupon: el.No_Of_Coupon,
          Total_Amount: el.Total_Amount,
          Created_By: el.Created_By
        })
      });
      const obj = {
        "SP_String": "SP_Master_Coupon_Receive",
        "Report_Name_String": "Save_Master_Coupon_Issue",
        "Json_Param_String": JSON.stringify(this.SaveFinal)
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {        
        if (data[0].Column1) { 
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Coupon Details ",
            detail: "Succesfully Save"
          });
          this.AddList = [];
          this.SaveFinal = [];
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          this.SearchData();
        }
      })
    }
  }
  SearchData() {
    this.BrowseData = [];
    if (this.CouponDateBrowseFirst && this.CouponDateBrowseEnd) {
      const Date = {
        From_Date: this.DateService.dateConvert(this.CouponDateBrowseFirst) ,
        To_Date: this.DateService.dateConvert(this.CouponDateBrowseEnd) 
      }
      const obj = {
        "SP_String": "SP_Master_Coupon_Receive",
        "Report_Name_String": "Browse_Master_Coupon_Issue",
        "Json_Param_String": JSON.stringify([Date])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => { 
        //console.log("Browse",data)
        if (data.length) {
          this.BrowseData = data
          this.NoDataFound = false;  
        }
        else {
         this.NoDataFound = true; 
        }
      })       
   } 
  }
  exportExcelbrowse(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {[fileName]: worksheet}, SheetNames: [fileName]};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
  EditCoupon() { }
  onReject(){
  this.compacctToast.clear("c");
  }
  DeleteCoupon(DeleteID: any) {
    this.EmpId = undefined;
    this.EmpNmae = undefined;
    this.visitorName = undefined;
    this.Date_Delete = undefined;
    if ((DeleteID.Emp_ID || DeleteID.Emp_Name || DeleteID.Visitor_Namee) && DeleteID.Date) {
      this.EmpId = DeleteID.Emp_ID;
      this.EmpNmae = DeleteID.Emp_Name;
      this.visitorName = DeleteID.Visitor_Name;
      this.Date_Delete = DeleteID.Date;
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
  onConfirm() {
    const Temp = {
      Emp_ID: this.EmpId,
      Emp_Name: this.EmpNmae,
      Visitor_Name: this.visitorName,
      Date: this.Date_Delete,
    }
    const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Delete_Coupon_Receive",
      "Json_Param_String": JSON.stringify([Temp])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if (data[0].Column1){
        this.onReject();
        this.SearchData();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary:"Employee Name:-" + this.EmpNmae ? this.EmpNmae : this.visitorName ,
          detail: "Succesfully Deleted"
        });
      }
    })
  }
}
class CouponIssue{
  Visitor_Name: any;
  Coupon_Type: any;
  Emp_ID:any;
	Emp_Name:any;
	Date:any;	
	Start_No:any;
	End_No:any;
	No_Of_Coupon:any;
	Total_Amount:any;
	Created_By:any;
}
