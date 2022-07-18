import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-purchase-bill-from-grn',
  templateUrl: './purchase-bill-from-grn.component.html',
  styleUrls: ['./purchase-bill-from-grn.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class PurchaseBillFromGrnComponent implements OnInit {
  items = [];
  // Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  // buttonname = "Save";
  // currentdate = new Date();
  DocDate = new Date();
  CNDate : Date;
  SupplierBillDate : Date;

  VendorList = [];
  maindisabled = false;
  StateList = [];
  CostCenterList = [];
  GRNnoList = [];
  BackupGRNnoList = [];
  GRNFilter = [];
  SelectedGRNno = [];
  
  TGRNnoList = [];
  ProductDetails = [];
  BackUpProductDetails = [];

  PurChallanGRNFormSubmitted = false;
  ObjPurBillChallan = new PurBillChallan();
  // ObjGRN : GRN = new GRN ();
  GRNDate = new Date();
  Supplierlist = [];
  CostCenterlist = [];
  Godownlist = [];
  POorderlist = [];
  PODate : any = new Date();
  podatedisabled = true;
  ProductDetailslist = [];

  GRN2FormSubmitted = false;
  ObjGRN2 : GRN2 = new GRN2();
  Productlist = [];
  productaddSubmit = [];

  Searchedlist = [];
  EditList = [];
  doc_no: any;
  SpinnerShow = false;
  inputBoxDisabled = false;


  // ATTENDANCE
  employeelist:any = [];
  MonthdayDatelist = [];
  AttenTypelist = [];
  currentdate = new Date();
  Attendance_Status = undefined;
  attendancestatusFormSubmitted = false;
  employeename = undefined;
  Doc_date : any;
  panelvisible = false;
  gtdate : any;
  dateNumber:any = [];
  display = false;
  Spinner = false;
  AttendancSheetList = [];
  Atten_Type : any;
  index = undefined;
  index2 = undefined;
  Month_Name = undefined;
  startdate = undefined;
  color = undefined;
  buttonname = "Save"
  AllAttendanceData = [];
  attendanceIdMap = new Map();

  displayALLEmployee = false;
  Attendance_Status_ALlEmployee = undefined;
  Atten_Type_AllEmployee : any;
  colorAllEmp = undefined;
  inddate = undefined;
  Doc_date_AllEmp : any;
  DayName = undefined;
  DynamicHeader = [];
  cols:any =[]
  attendance_value : any;
  col: any;
  empid: any;
  regeneratebutton = "Regenerate"

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  // ngOnInit() {
  //   this.items = ["BROWSE", "CREATE"];
  //   this.Header.pushHeader({
  //     Header: "Purchase Bill From Challan",
  //     Link: " Material Management -> Inward -> Purchase Bill From Challan"
  //   });
  //   this.GetVendor();
  //   this.GetStateList();
  //   this.GetCostcenter();
  //   // this.GetCostCenter();
  //   // this.GetSearchedlist();
  //   this.ObjPurBillChallan.Currency_ID = 1;
  // }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Attendance Sheet",
      Link: " HR -> Transaction -> Attendance Sheet"
    });
    this.getAttendanceType();
    const d = new Date();
    let month = d.getMonth() + 1;
    console.log('month',month)
    let year = d.getFullYear();
    this.Month_Name = month < 10 ? year+'-'+0+month : year+'-'+month
    //this.startdate = this.Month_Name+'-'+'01'
    console.log('Month_Name',this.Month_Name)
   // this.Month_Name = new Date();
    // this.getmonthdaydate();
    this.getAttendanceData();
  }
  getemployeename(){
    const obj = {
      "SP_String": "HR_Txn_Attn_Sheet",
      "Report_Name_String": "Get_EMP_Data"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(obj=> {
        obj.monthData = [...new Array(this.MonthdayDatelist.length)];
      })
      this.employeelist = data;
       console.log("employeelist ===", this.employeelist);
    })
  }
  getmonthdaydate(){
    this.dateNumber = [];
    // var firstDay = new Date(this.currentdate.getFullYear(), this.currentdate.getMonth(), 1);
    //var lastDay = new Date(this.currentdate.getFullYear(), this.currentdate.getMonth() + 1, 0);
    var firstDay = this.Month_Name+'-'+'01'
    console.log('firstDay',firstDay)
    const TObj = {
      Start_Date : this.DateService.dateConvert(new Date(firstDay)),
      //End_Date : this.DateService.dateConvert(new Date(lastDay))
    }
    const obj = {
      "SP_String": "HR_Txn_Attn_Sheet",
      "Report_Name_String": "Month_Data",
      "Json_Param_String": JSON.stringify([TObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.MonthdayDatelist = data;
     
    ///let myArray = text.split(" ");
    data.forEach(ele => {
      let spdata =  ele.Date.split(" ")
      this.dateNumber.push({
        date :spdata[0]
      })
    });
    this.getemployeename();
    this.getAttendanceData();
      console.log("tempArr",this.dateNumber)
  
       console.log("MonthdayDatelist ===",this.MonthdayDatelist);
    })
  }
  getAttendanceType(){
    const obj = {
      "SP_String": "HR_Txn_Attn_Sheet",
      "Report_Name_String": "Get_Attn_Data_Type"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.AttenTypelist = data;
       console.log("AttenTypelist ===",this.AttenTypelist);
       this.AttenTypelist.forEach((val) => {
         if(val.Sht_Desc) {
          this.attendanceIdMap.set(val.Sht_Desc.trim(),val);
         }
       })
    })
  }
  // onrightclick(i,row,i2){
  //   event.preventDefault();
  //   console.log("sgclicki",i)
  //   console.log("sgclicki2",i2)
  //   if(!this.employeelist[i].monthData[i2]) {
  //   this.employeelist[i].monthData[i2] = 'P';
  //   }
  //   // event.preventDefault();
  //   // return false;
  //   // const noContext = document.getElementById('noContextMenu');

  //   // noContext.addEventListener('contextmenu', e => {
  //   //   e.preventDefault();
  //   // });
  // }
  onrightclick(col,row){
    if(col && row.Emp_ID) {
      this.col = col;
      this.empid = row.Emp_ID;
      console.log("Row",row[this.col])
      // this.Attendance_Status = row[this.col] ? row[this.col] : undefined;
      // // this.index = i;
      // this.employeename = row.Emp_Name;
      // let date = col.split("(")[0];
      // let Doc_date = this.Month_Name+"-"+date;
      // this.Doc_date = this.DateService.dateConvert(new Date(Doc_date))

      event.preventDefault();
      if (this.col != "Emp_Name") {
        this.AllAttendanceData.forEach((el:any)=>{
          if(Number(el.Emp_ID )== Number(this.empid)){
           el[this.col] = 1;
          }
        })
      }
    }
  }
  getdialog(i,row,i2){
    this.attendancestatusFormSubmitted = false;
    this.Attendance_Status = undefined;
    console.log("i",i)
    console.log("i2",i2)
    console.log("row",row)
   //this.employeelist[i].monthData[i2] = 'deba'
   this.employeename = row.Emp_Name;
   this.index = i;
   this.index2 = i2;
   this.MonthdayDatelist.forEach((ele,inx) => {
    if(inx === i2){
      //console.log("ele",ele);
      this.Doc_date = ele.Date;
    }
    });
    this.display = true;
    var Attent = this.AttenTypelist.filter( items => items.Sht_Desc === this.employeelist[this.index].monthData[this.index2]);
    this.Attendance_Status = Attent ? Attent[0].Atten_Type_ID : undefined;
     // this.Doc_date = col.Date;
    console.log("this.employeename",this.employeename)
    console.log("this.Doc_date",this.Doc_date)
    
  }
  SaveAttendanceType(){
   // this.attendancestatusFormSubmitted = true;
    //if(valid){
      // this.attendance_value = undefined;
      // var AttenType = this.AttenTypelist.filter( items => Number(items.Atten_Type_ID) === Number(this.Attendance_Status));
      // this.Atten_Type = AttenType != null && AttenType.length > 0 ? AttenType[0].Sht_Desc : undefined;
      // this.color = AttenType != null && AttenType.length > 0 ? AttenType[0].Colour_Code : undefined;
      // this.employeelist[this.index].monthData[this.index2] = this.Atten_Type;
      // this.getcellText(this.empid,this.col);
      // this.attendance_value = this.Atten_Type;
      // this.getcellText([this.Atten_Type],true);
      this.AllAttendanceData.forEach((el:any)=>{
        if(Number(el.Emp_ID )== Number(this.empid)){
         el[this.col] = Number(this.Attendance_Status)
        }
      })
      this.display = false;
    //}
  }
  getAttendanceDatafornewmonth(){
    if (this.Month_Name) {
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "c",
       sticky: true,
       severity: "warn",
       summary: "All Attendance data will remove for this Month. Want to Procced?",
      //  detail: "Want to Procced?"
     });
   }
  }
  onConfirm(){
    this.AllAttendanceData = [];
    var firstDate = this.Month_Name+'-'+'01'
    console.log('firstDate',firstDate)
    const AtObj = {
      Date : this.DateService.dateConvert(new Date(firstDate)),
    }
    const obj = {
      "SP_String": "HR_Txn_Attn_Sheet",
      // "Report_Name_String": "Get_Attn_Data",
      "Report_Name_String": "Set_Attn_Data_for_new_month",
      "Json_Param_String": JSON.stringify([AtObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Data From Api",data);
      this.AllAttendanceData = data;
      if(this.AllAttendanceData.length){
        this.DynamicHeader = Object.keys(data[0]);
         this.DynamicHeader.forEach((el:any)=>{
          this.cols.push({
           header: el 
          })
        })
        this.onRejects();
        this.getAttendanceData();
      }
      else {
        this.DynamicHeader = [];
        this.onRejects();
        this.getAttendanceData();
      }
      console.log('this.AllAttendanceData',this.AllAttendanceData)
    //    data.forEach(element => {
    //      var empid = this.employeelist.findIndex(el=> el.Emp_ID === element.Emp_ID);
    //      var date = new Date(element.Date);
    //      const ctrl = this;
    //      setTimeout(function () {
    //      if(empid != null && date != null) {
    //       ctrl.employeelist[empid].monthData[date.getDate() - 1] = element.Sht_Desc;
    //      }
    //     }, 200)
    //       console.log('this.AllAttendanceData',this.AllAttendanceData)
    //  });

  })
  }
  onRejects(){
    this.compacctToast.clear("c");
   }
  getAttendanceData(){
    this.AllAttendanceData = [];
    var firstDate = this.Month_Name+'-'+'01'
    console.log('firstDate',firstDate)
    const AtObj = {
      Date : this.DateService.dateConvert(new Date(firstDate)),
    }
    const obj = {
      "SP_String": "HR_Txn_Attn_Sheet",
      // "Report_Name_String": "Get_Attn_Data",
      "Report_Name_String": "Get_Attn_Data_NEW",
      "Json_Param_String": JSON.stringify([AtObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Data From Api",data);
      this.AllAttendanceData = data;
      if(this.AllAttendanceData.length){
        this.DynamicHeader = Object.keys(data[0]);
         this.DynamicHeader.forEach((el:any)=>{
          this.cols.push({
           header: el
          })
        })

      }
      else {
        this.DynamicHeader = [];
      }
      console.log('this.AllAttendanceData',this.AllAttendanceData)
    //    data.forEach(element => {
    //      var empid = this.employeelist.findIndex(el=> el.Emp_ID === element.Emp_ID);
    //      var date = new Date(element.Date);
    //      const ctrl = this;
    //      setTimeout(function () {
    //      if(empid != null && date != null) {
    //       ctrl.employeelist[empid].monthData[date.getDate() - 1] = element.Sht_Desc;
    //      }
    //     }, 200)
    //       console.log('this.AllAttendanceData',this.AllAttendanceData)
    //  });

  })
  }
  tableCellData(col,row){
    console.log("col",col);
    
      if(col && row.Emp_ID) {
        this.col = col;
        this.empid = row.Emp_ID;
        console.log("Row",row[this.col])
        this.Attendance_Status = row[this.col] ? row[this.col] : undefined;
        // this.index = i;
        this.employeename = row.Emp_Name;
        let date = col.split("(")[0];
        let Doc_date = this.Month_Name+"-"+date;
        this.Doc_date = this.DateService.dateConvert(new Date(Doc_date))

        if (col === 'Emp_ID' || col === "Emp_Name") {
          this.display = false;
        } else {
          this.display = true;
          // var Attent = this.AttenTypelist.filter( items => items.Sht_Desc === this.attendance_value);
          // this.Attendance_Status = Attent ? Attent[0].Atten_Type_ID : undefined;
        }
      }
      
   }
   getcellText(value,col){
     let flag = "";
    if(col != 'Emp_ID' || col != "Emp_Name"){
      let attArrFilter:any = this.AttenTypelist.filter((el:any)=> Number(el.Atten_Type_ID) == Number(value))
       if(attArrFilter.length){
      flag = attArrFilter[0].Sht_Desc
      }   
     
    }
    if(col === 'Emp_ID' || col === "Emp_Name"){
     flag = value
    }
    this.attendance_value = flag;
    
    return flag
   }
  getdataforattendance(){
    // if(this.employeelist.length) {
    //   let tempArr =[]
    //   var firstDateofmonth = this.Month_Name+'-'+'01'

    //   this.employeelist.forEach((item,index) => {
    //  const TempObj = {
    //         Start_Date : this.DateService.dateConvert(new Date(firstDateofmonth)),
    //         Emp_ID:  item.Emp_ID,
    //         // Date: this.DateService.dateConvert(new Date(empdate[0].Date)),//empdate,//item.monthData[length],
    //         // Atten_Type_ID : attendanceid[0].Atten_Type_ID
    //      }
    //   //tempArr.push(TempObj)
    //   item.monthData.forEach((el,x) => {
    //     var empdate = this.MonthdayDatelist[x];//filter((dateitem,ind) => ind === el.indexOf(el[x]));
    //     console.log('empdate',empdate != null ? empdate.Date : null);
    //     var attendanceid = this.attendanceIdMap.get(el);//this.AttenTypelist.filter( ele => ele.Sht_Desc === el);
    //     console.log('attendanceid',attendanceid ? attendanceid.Atten_Type_ID : null);
    //     const dateattenidobj = {
    //       Date: empdate.Date ? this.DateService.dateConvert(new Date(empdate.Date)) : null,//empdate,//item.monthData[length],
    //       Atten_Type_ID : attendanceid ?  attendanceid.Atten_Type_ID : null
    //     }
        
    //   tempArr.push({...TempObj,...dateattenidobj})
    //   })
    //   });
    //   console.log("Save Data ===", tempArr)
    //   return JSON.stringify(tempArr);

    if(this.AllAttendanceData.length) {
        let tempArr:any =[]
        var firstDateofmonth = this.Month_Name+'-'+'01'
        this.AllAttendanceData.forEach((item:any,index) => {
          let editcols:any=[];
          editcols.push({
            editcol : item.split("(")[0]
          })
           const TempObj = {
                  Start_Date : this.DateService.dateConvert(new Date(firstDateofmonth)),
                  // Date: this.DateService.dateConvert(new Date(empdate[0].Date)),//empdate,//item.monthData[length],
                  // Atten_Type_ID : attendanceid[0].Atten_Type_ID
               }
            tempArr.push({...TempObj,...this.AllAttendanceData})
            })
            return JSON.stringify(tempArr);

    }
  }
  saveAttendance(){
    
    let tempArr:any = [];
   console.log(this.AllAttendanceData)
     this.AllAttendanceData.forEach((el:any)=>{
      // let altObj:any= {}
      var firstDateofmonth = this.Month_Name+'-'+'01'
      let emp:any = {}
      for (const key in el) {
        const keyName = `_${key.substring(0,2)}`;
        if(!key.includes('Emp')) {
          emp[keyName] = el[key];
        } else {
          emp['Emp_ID']= el.Emp_ID;
           emp['Emp_Name']= el.Emp_Name;
           emp['Start_Date'] = this.DateService.dateConvert(new Date(firstDateofmonth));
        }
    }
      //  altObj = Object.fromEntries(
      //     Object.entries(el).map(([key, value]) => 
      //       // Modify key here
      //       [`_${key.substring(0,2)}`, value]
      //     )
      //   ) 
      //  var firstDateofmonth = this.Month_Name+'-'+'01'
      //   emp = {
      //     Emp_ID : el.Emp_ID,
      //     Emp_Name: el.Emp_Name,
      //     Start_Date : this.DateService.dateConvert(new Date(firstDateofmonth)),
      //   }
     
      tempArr.push(emp)
     })
     console.log("tempArr",tempArr)
    const obj = {
      "SP_String" : "HR_Txn_Attn_Sheet",
      // "Report_Name_String" : "Insert_Attn_Data",
      "Report_Name_String" : "Insert_Attn_Data_NEW",
      "Json_Param_String" : JSON.stringify(tempArr)

    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      //console.log(data);
      var tempID = data[0].Column1;
      console.log("After Save",tempID);
     // this.Objproduction.Doc_No = data[0].Column1;
      if(data[0].Column1){
        this.compacctToast.clear();
        const mgs = this.buttonname === "Save" ? "Saved" : "Updated";
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         detail: "Succesfully  " + mgs
       });
       this.getmonthdaydate();
      //  const ctrl = this;
      //  setTimeout(function () {
      //   ctrl.getAttendanceData();
      //  }, 200)
      //  this.clearData();
      //  this.franchisechallandate = undefined;
      //  this.searchData(true);
      //  this.ProductList =[];
      //  this.franchiseSalebillFormSubmitted = false;
      } else{
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
    })
  }
  // ChangeAllRow(ind){
  //   this.Doc_date_AllEmp = undefined;
  //   console.log("col" ,ind)
  //   this.inddate = ind;
  //   this.MonthdayDatelist.forEach((ele,inx) => {
  //     if(inx === ind){
  //       //console.log("ele",ele);
  //       this.Doc_date_AllEmp = ele.Date;
  //       this.DayName = ele.WeekDay;
  //     }
  //     });
  //   this.displayALLEmployee = true;
  //   this.Attendance_Status_ALlEmployee = undefined;
    
  // }
  
  ChangeAllRow(col){
    console.log("col",col);
    
      if(col) {
        this.col = col;
        // this.empid = row.Emp_ID;
        // console.log("Row",row[this.col])
        // this.Attendance_Status_ALlEmployee = undefined;
        // this.index = i;
        // this.employeename = row.Emp_Name;
        let date = col.split("(")[0];
        let Doc_date = this.Month_Name+"-"+date;
        this.Doc_date_AllEmp = this.DateService.dateConvert(new Date(Doc_date))

        if (col === "Emp_Name") {
          this.displayALLEmployee = false;
        } else {
          this.displayALLEmployee = true;
          // var Attent = this.AttenTypelist.filter( items => items.Sht_Desc === this.attendance_value);
          // this.Attendance_Status = Attent ? Attent[0].Atten_Type_ID : undefined;
        }
      }
      
   }
  SaveForALLEmployee(){
    // var AttenTypeAllEmp = this.AttenTypelist.filter( items => Number(items.Atten_Type_ID) === Number(this.Attendance_Status_ALlEmployee));
    //   this.Atten_Type_AllEmployee = AttenTypeAllEmp != null && AttenTypeAllEmp.length > 0 ? AttenTypeAllEmp[0].Sht_Desc : undefined;
    //   this.colorAllEmp = AttenTypeAllEmp != null && AttenTypeAllEmp.length > 0 ? AttenTypeAllEmp[0].Colour_Code : undefined;
    //  // this.employeelist[this.index].monthData[this.index2] = this.Atten_Type_AllEmployee;
    //   this.employeelist.forEach((el)=>{
    //     el.monthData[this.inddate] = this.Atten_Type_AllEmployee;

    //   })
    //   this.displayALLEmployee = false;
      this.AllAttendanceData.forEach((el:any)=>{
        // if(Number(el.Emp_ID )== Number(this.empid)){
         el[this.col] = Number(this.Attendance_Status_ALlEmployee)
        // }
      })
      this.displayALLEmployee = false;
  }






  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Save";
     this.Spinner = false;
     this.clearData();
    //  this.ObjGRN1 = new GRN1();
    //  this.GRNFormSubmitted = false;
     this.productaddSubmit = [];
     this.ObjGRN2 = new GRN2;
     this.GRN2FormSubmitted = false;
     this.PODate = new Date();
    //  this.podatedisabled = true;
     this.Spinner = false;
     this.Godownlist = [];
     this.POorderlist = [];
     this.ProductDetailslist = [];
   }
   onReject(){}
   clearData(){
     this.ObjPurBillChallan = new PurBillChallan();
     this.ObjPurBillChallan.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.GetCosCenAddress();
     this.DocDate = new Date();
     this.ObjPurBillChallan.Currency_ID = 1;
     this.GRNnoList = [];
   }
   GetVendor(){
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Bill_From_GRN",
      "Report_Name_String": "Get_Sub_Ledger",
     // "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.VendorList = data;
       if(data.length) {
         data.forEach(element => {
           element['label'] = element.Sub_Ledger_Name,
           element['value'] = element.Sub_Ledger_ID
         });
         this.VendorList = data;
        //  this.backUpproductList = this.Productlist;
        //  this.getproducttype();
       } else {
         this.VendorList = [];

       }
     console.log("vendor list======",this.VendorList);
   });
}
   VenderNameChange(){
     //this.ExpiredProductFLag = false;
   if(this.ObjPurBillChallan.Sub_Ledger_ID) {
    const ctrl = this;
    const vendorObj = $.grep(ctrl.VendorList,function(item: any) {return item.Sub_Ledger_ID == ctrl.ObjPurBillChallan.Sub_Ledger_ID})[0];
    console.log(vendorObj);
    this.ObjPurBillChallan.Sub_Ledger_Billing_Name = vendorObj.Billing_Name;
    this.GetGRNnoList();
   }
   }
   GetChooseAddress(){
    //this.ExpiredProductFLag = false;
  if(this.ObjPurBillChallan.Sub_Ledger_ID) {
    if(this.ObjPurBillChallan.Sub_Ledger_Address_1) {
   const ctrl = this;
   const MainObj = $.grep(ctrl.VendorList,function(item: any) {return item.Sub_Ledger_ID == ctrl.ObjPurBillChallan.Sub_Ledger_ID})[0];
   console.log(MainObj);
   this.maindisabled = true;
   this.ObjPurBillChallan.Sub_Ledger_State = MainObj.State;
   this.ObjPurBillChallan.Sub_Ledger_GST_No = MainObj.GST;
   this.ObjPurBillChallan.Sub_Ledger_Address_2 = MainObj.Address_1 +','+ MainObj.Address_2 +','+ MainObj.Address_3;
   this.ObjPurBillChallan.Sub_Ledger_Land_Mark = MainObj.Land_Mark;
   this.ObjPurBillChallan.Sub_Ledger_Pin = MainObj.Pin;
   this.ObjPurBillChallan.Sub_Ledger_District = MainObj.District;
   this.ObjPurBillChallan.Sub_Ledger_Country = MainObj.Country;
   this.ObjPurBillChallan.Sub_Ledger_Email = MainObj.Email;
   this.ObjPurBillChallan.Sub_Ledger_Mobile_No = MainObj.Mobile_No;
   this.ObjPurBillChallan.Sub_Ledger_PAN_No = MainObj.PAN_No;
   this.ObjPurBillChallan.Sub_Ledger_CIN_No = MainObj.CIN;
  }
  else {
    this.maindisabled = false;
  }
  }
  }
   GetStateList() {
    this.$http
      .get("/Common/Get_State_List")
      .subscribe((data: any) => {
        // this.StateList = data ? JSON.parse(data) : [];
        this.StateList = data;
        console.log('StateList',this.StateList)
      });
  }
  GetCostcenter(){
    const obj = {
      "SP_String": "SP_BL_Txn_Purchase_Bill_From_GRN",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("costcenterList  ===",data);
      this.CostCenterList = data;
      // this.ObjPurBillChallan.Cost_Cen_ID = this.CostCenterList.length === 1 ? this.CostCenterList[0].Cost_Cen_ID : undefined;
      this.ObjPurBillChallan.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.GetCosCenAddress();
      })
  }
  GetCosCenAddress(){
    //this.ExpiredProductFLag = false;
    if(this.ObjPurBillChallan.Cost_Cen_ID) {
   const ctrl = this;
   const costcenObj = $.grep(ctrl.CostCenterList,function(item: any) {return item.Cost_Cen_ID == ctrl.ObjPurBillChallan.Cost_Cen_ID})[0];
   console.log(costcenObj);
   this.ObjPurBillChallan.Cost_Cen_Address1 = costcenObj.Address1;
   this.ObjPurBillChallan.Cost_Cen_Address2 = costcenObj.Address2;
   this.ObjPurBillChallan.Cost_Cen_State = costcenObj.State;
   this.ObjPurBillChallan.Cost_Cen_GST_No = costcenObj.GST_No;
   this.ObjPurBillChallan.Cost_Cen_Location = costcenObj.Location;
   this.ObjPurBillChallan.Cost_Cen_PIN = costcenObj.PIN;
   this.ObjPurBillChallan.Cost_Cen_District = costcenObj.District;
   this.ObjPurBillChallan.Cost_Cen_Country = costcenObj.Country;
   this.ObjPurBillChallan.Cost_Cen_Mobile = costcenObj.Mobile;
   this.ObjPurBillChallan.Cost_Cen_Phone = costcenObj.Phone;
   this.ObjPurBillChallan.Cost_Cen_Email = costcenObj.Email1;
  }
  }
  GetGRNnoList(){
     const TempObj = {
      //  Req_Date : this.DateService.dateConvert(new Date(this.ReqDate)),
       Sub_Ledger_ID : this.ObjPurBillChallan.Sub_Ledger_ID,
      }
    const obj = {
     "SP_String": "SP_BL_Txn_Purchase_Bill_From_GRN",
     "Report_Name_String" : "Get_Purchase_Challan_GRN_Nos",
    "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.GRNnoList = data;
       this.BackupGRNnoList = data;
    console.log("this.GRNnoList======",this.GRNnoList);
    this.GetGRNno();
   })
   }
   GetGRNno(){
     let DGRN = [];
     this.GRNFilter = [];
     this.SelectedGRNno = [];
     this.BackupGRNnoList.forEach((item) => {
       if (DGRN.indexOf(item.GRN_No) === -1) {
        DGRN.push(item.GRN_No);
         this.GRNFilter.push({ label: item.GRN_No + '(' + this.DateService.dateConvert(new Date(item.GRN_Date)) + ')' , value: item.GRN_No });
         console.log("this.GRNFilter", this.GRNFilter);
       }
     });
     this.BackupGRNnoList = [...this.GRNnoList];
   }
   filterGRNnoList() {
     //console.log("SelectedTimeRange", this.SelectedTimeRange);
     let DGRN = [];
     this.TGRNnoList = [];
     //const temparr = this.ProductionlList.filter((item)=> item.Qty);
     if (!this.EditList.length){
      this.BackUpProductDetails =[];
      this.ProductDetails = [];
      this.GetProductdetails();
      }
      // if(this.editIndentList.length){
      //   this.BackUpproductDetails =[];
      // this.productDetails = [];
      //   this.GetProductionproforEdit();
      //   }
    //  this.productDetails = [];
    //  this.GetshowProduct(true,true);
     if (this.SelectedGRNno.length) {
       this.TGRNnoList.push('Req_No');
       DGRN = this.SelectedGRNno;
     }
     if(this.EditList.length) {
      this.ProductDetails = [];
      if (this.TGRNnoList.length) {
        let LeadArr = this.BackUpProductDetails.filter(function (e) {
          return (DGRN.length ? DGRN.includes(e['GRN_No']) : true)
        });
        this.ProductDetails = LeadArr.length ? LeadArr : [];
      } else {
        this.ProductDetails = [...this.BackUpProductDetails];
        console.log("else Get GRN list", this.TGRNnoList)
      }
    }

   }
   dataforProductDetails(){
    if(this.SelectedGRNno.length) {
      let Arr =[]
      this.SelectedGRNno.forEach(el => {
        if(el){
          const Dobj = {
            Doc_No : el,
            // Doc_Date : this.DateService.dateConvert(new Date(this.ChallanDate))
            }
           Arr.push(Dobj)
        }

    });
      console.log("Table Data ===", Arr)
      return Arr.length ? JSON.stringify(Arr) : [];
    }
  }
   GetProductdetails(){
    // if(this.dataforShowproduct()){
      //this.SpinnerShow = true;
      // const tempObj = {
      //   Outlet_ID: Number(this.Objdispatch.Cost_Cen_ID),
      //   Dispatch_Outlet_ID: Number(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID),
      //   Dispatch_Godown_ID: Number(this.Objdispatch.From_Godown_ID),
      //   Challan_Date : this.DateService.dateConvert(new Date(this.ChallanDate)),
      //   Indent_Date : this.DateService.dateConvert(new Date(this.todayDate)),
      // }
      const obj = {
        "SP_String": "SP_BL_Txn_Purchase_Bill_From_GRN",
        "Report_Name_String": "Get_product_Details",
        "Json_Param_String": this.dataforProductDetails()
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.ProductDetails = data;
        //this.SpinnerShow = false;
        this.BackUpProductDetails = [...this.ProductDetails];
        console.log("this.ProductDetails",this.ProductDetails);
        // this.inputBoxDisabled = true;
        // this.indentdateDisabled = false;
        // this.From_Godown_ID_Dis = true;
        // this.To_Godown_ID_Dis = true;
  
        //this.clearData();
      })
    // }
  
  }
  DiscChange(obj){
    if(!obj.Discount_Type){
      obj.Discount = 0
    } 
    else {
      obj.Discount = undefined;
    }
  }
  AfterDiscCalChange(colobj){
    if (colobj.Discount) {
    if(colobj.Discount_Type == "%") {
      colobj.Discount_Type_Amount = Number((Number(colobj.Total_Amount) * Number(colobj.Discount)) / 100).toFixed(2);
    }
    if(colobj.Discount_Type == "AMT") {
      colobj.Discount_Type_Amount = Number(colobj.Discount);
    }
    colobj.Taxable_Amount = Number(Number(colobj.Total_Amount) - Number(colobj.Discount_Type_Amount)).toFixed(2);
    }
  }
  // listofamount(){
  //   this.Amount = undefined;
  //   let count = 0;
  //   this.Dis_Amount = undefined;
  //   let count1 = 0;
  //   this.Gross_Amount = undefined;
  //   let count2 = 0;
  //   this.SGST_Amount = undefined;
  //   let count3 = 0;
  //   this.CGST_Amount = undefined;
  //   let count4 = 0;
  //   this.GST_Tax_Per_Amt = undefined;
  //   let count5 = 0;
  //   this.TotalTaxable = undefined;
  //   let count6 = 0;
  //   this.withoutdisamt = undefined;
  //   let count7 = 0;
  //   this.taxb4disamt = undefined;
  //   let count8 = 0;
  
  
  //   this.productSubmit.forEach(item => {
  //     count = count + Number(item.Amount);
  //     if (item.product_type != "PACKAGING") {
  //       if (item.is_service != true) {
  //          count7 = count7 + Number(item.Amount);
  //          count8 = count8 + Number(item.Amount_berore_Tax);
  //       }
  //     }
  //     count1 = count1 + Number(item.Dis_Amount);
  //     //count2 = count2 + Number(item.Gross_Amount);
  //     // count2 = count2 + Number(item.Taxable - item.Dis_Amount);
  //     count3 = count3 + Number(item.SGST_Amount);
  //     count4 = count4 + Number(item.CGST_Amount);
  //     count5 = count5 + Number(item.GST_Tax_Per_Amt);
  //     count6 = count6 + Number(item.Taxable);
  //   });
  //   this.Amount = (count).toFixed(2);
  //   this.withoutdisamt = (count7).toFixed(2);
  //   this.taxb4disamt = (count8).toFixed(2);
  //   this.Dis_Amount = (count1).toFixed(2);
  //   this.TotalTaxable = (count6).toFixed(3);
  //   this.Gross_Amount = (count8).toFixed(2);
  //   //this.Gross_Amount = (count2).toFixed(2);
  //   //this.Gross_Amount = (Number(this.TotalTaxable) - Number(this.Dis_Amount)).toFixed(2);
  //   this.SGST_Amount = (count3).toFixed(2);
  //   this.CGST_Amount = (count4).toFixed(2);
  //   this.GST_Tax_Per_Amt = (count5).toFixed(2);
  //   //console.log(this.Gross_Amount);
  // }
  // clearlistamount(){
  //   this.Amount = [];
  //   this.withoutdisamt = [];
  //   this.taxb4disamt = [];
  //   this.Dis_Amount = [];
  //   this.Gross_Amount = [];
  //   this.SGST_Amount = [];
  //   this.CGST_Amount = [];
  //   this.GST_Tax_Per_Amt = [];
  //   this.TotalTaxable = [];
  // }
   GetGodown(){}
   SaveGRN(){}
   
   GetIndentList(){}

}
class PurBillChallan {
  Sub_Ledger_ID : any;
  Sub_Ledger_Billing_Name : string;
  Sub_Ledger_Address_1 : string;
  Sub_Ledger_State : any;
  Sub_Ledger_GST_No : any;
  Sub_Ledger_Address_2 : string;
  Sub_Ledger_Land_Mark : string;
  Sub_Ledger_Pin : any;
  Sub_Ledger_District : string;
  Sub_Ledger_Country : string;
  Sub_Ledger_Email : any;
  Sub_Ledger_Mobile_No : number;
  Sub_Ledger_PAN_No : any;
  Sub_Ledger_CIN_No : any;

  Cost_Cen_ID : any;
  Cost_Cen_Address1 : string;
  Cost_Cen_Address2 : string;
  Cost_Cen_State : string;
  Cost_Cen_GST_No : any;
  Cost_Cen_Location : string;
  Cost_Cen_PIN : any;
  Cost_Cen_District : string;
  Cost_Cen_Country : string;
  Cost_Cen_Mobile : number;
  Cost_Cen_Phone : number;
  Cost_Cen_Email : any;

  Doc_Date : any;
  Project_ID : number;
  CN_No : any;
  CN_Date : any;
  Currency_ID : number;
  Currency_Symbol : any;
  Revenue_Cost_Cent_ID : number;
  Supplier_Bill_No : any;
  Supplier_Bill_Date : any;

  Term_Name : any;
  HSN_No : any;
  Term_Amount : number;

  Product_ID : any;
  Product_Details : string;
  Rate : any;
  GST_Tax_Per : any;
  HSN_Code : any;
  Unit : string;
  Challan_Qty : any;
  Received_Qty : any;
  Rejected_Qty : any;
  Accepted_Qty : any;
 }
 class GRN2 {
  Quantity_Remarks : string;
  Quality_Rejection_Remarks : string;
  Deduction_For_Rejection : string;
  Created_By : string;
 }
 class Browse {
  Doc_No : any;
  start_date : Date ;
  end_date : Date;
}
