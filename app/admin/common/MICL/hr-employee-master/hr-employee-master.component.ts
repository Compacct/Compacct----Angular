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

@Component({
  selector: 'app-hr-employee-master',
  templateUrl: './hr-employee-master.component.html',
  styleUrls: ['./hr-employee-master.component.css'],
  providers:[MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HREmployeeMasterComponent implements OnInit {

 
  Del2 : boolean = false;
  Del : boolean = false;
  tabIndexToView : any = 0;
  items : any = [];
  buttonname  : any = 'Create';
  EmployeeFormSubmitted : any = false;
  objemployee : Employee = new Employee();
  objselect : Select = new Select();
  Entry_Date : any;
  seachSpinner :any = false;
  Spinner : any = false;
  Desigid : any;
  Deptid : any;
  

  NationalityList : any = [];
  GenderList : any = [];
  BankAcList : any = [];
  MaritalList : any = [];
  BloodGroupList : any = [];
  SalaryPaidList : any = []; 
  DeptList : any = [];
  WorkingCompanyList : any = [];
  DesignationList : any = [];
  LocationList : any = [];
  AllStateDistrictList : any = [];
  weakofflist : any = [];
  weakofflist2 : any = [];
  EmployeeList : any = [];
  EmployeeDetailsList : any = [];
  Statuslist : any = [];
  ReportingList : any = [];
  physicallyChallanged : any = [];
  BankNameDetails : any = [];
  Hold_Bill_Flag : any ;
  isdiabled : boolean = true;
  PfUnadisabled : boolean = true;
  isPFcheck : boolean = false;
  ischeckesi : boolean = false;
  ischeckaddress : boolean = false;
  Employeeid: any;
  Joining_Dt = new Date();
  Resign_On = new Date();
  Leave_Dt:any = new Date();
  DOB = new Date();
  Spouse_DOB: any;
  Date_Of_Anniversary : any;
  Child_D_O_B = new Date();
  checkcode : any;
  flag : boolean = false;
  Pan_No :any;
  PANvalidFlag = false;
  PDFFlag = false;
  ProductPDFFile:any = {};
  DocumentList : any = [];
  UserList : any = [];
  AllEmployeeList : any = [];
  AllStateDistrictList2 : any =[];
  ViewDesignationList : any = [];
  ViewDepartmentList : any = [];
  ViewDesignationListObj : any = {};
  ViewDepartmentListObj : any = {};
  ViewProTypeModal : any = false;
  ViewProTypeModal2 : any = false;
  ViewProTypeModal3 : any = false;
  ViewProTypeModal4 : any = false;
  Desigsubmitted :any = false;
  Deptsubmitted : any = false;
  Desig : string = "";
  Dept : string = "";
  ProductView:any = {}
  ProductViewFalg:boolean = false
  SpinnerDoc:boolean = false
  DocvalidSubmit:boolean = false
  imagePath:any = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu3_qIHtXBZ7vZeMQhyD8qLC1VRB9ImHadL09KET_iSQEX6ags4ICknfmqEKz8Nf6IOsA&usqp=CAU "
  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;
  @ViewChild ("preview", { static : false}) preview : FileUpload;
  userdisabled = false;
  userdatedisabled = true;
  leftdisabled = true;
  GradeList:any = [];
  databaseName:any;
  ChildFormSubmitted:boolean = false;
  AddChildList:any = [];
  Referencelist:any = [];
  Consultancylist:any = [];
  emplist:any = [];
  consultancyid : any;
  ViewConsultancyList:any = [];
  ViewConsultancyListObj:any = {};
  ViewconsultancyModal:boolean = false;
  CreateConsulModal:boolean = false;
  objconsultancy : Consultancy = new Consultancy();
  consultancyFormSubmitted:Boolean = false;
  GSTvalidFlag:boolean=false;
  LocationModal:boolean = false;
  locationsubmitted:boolean = false;
  Location:any;
  bankacnoflag:boolean = false;
  resetdisabled:boolean = false;
  constructor(
    private http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private route : ActivatedRoute,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header:  " Employee Master " ,
      Link: "HR-> Master-> Employee " 
    });
    this.objemployee.Present_Country = "India";
    this.objemployee.Perm_Country = "India";
    this.NationalityList = ["INDIAN", "OTHERS"];
    this.GenderList = ["MALE", "FEMALE", "OTHERS"];
    this.BankAcList = ["SAVINGS", "CURRENT", "OTHER"];
    this.MaritalList = ["UNMARRIED", "MARRIED", "WIDOWED", "SEPERATED", "DIVORCED"];
    this.BloodGroupList = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
    this.SalaryPaidList = ["Bank", "Cheque", "Cash"];
    this.physicallyChallanged = ["YES", "NO"];
    this.weakofflist = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    this.weakofflist2 = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    // this.Statuslist = ["WORKING-REJOIN", "WORKING-PROVISION", "WORKING-CASUAL", "WORKING-CONFIRMED", "WORKING-PARTTIME", "RETIRED", "LEFT", "SUSPENDED", "ABSCONDED", "PROBATION"];
    this.Statuslist = ["TRAINEE", "PROBATION", "PERMANENT", "RESIGNED", "SUSPENDED", "ABSCONDED"];
    this.getDatabase();
    this.getDepartment();
    this.getWorkingCompany();
    this.getDesignation();
    this.GetGrade();
    this.getLocation();
    this.getEmployee();
    this.getBankName();
    this.getStatus();
    this.getReportingList();
    this.getUser();
    this.leftdatechange();
    this.objemployee.Bank_ID = 1;
    this.getReferenceBy();
    this.getConsultancy();
    this.getConsultancyEmp();
    
  }
  getDatabase(){
    this.http
        .get("/Common/Get_Database_Name",
        {responseType: 'text'})
        .subscribe((data: any) => {
          this.databaseName = data;
          console.log(data)
        });
  }

leftdatechange(){
  if(this.objemployee.Present_Status === "RESIGNED" || this.objemployee.Present_Status === "SUSPENDED" || this.objemployee.Present_Status === "ABSCONDED" || this.objemployee.Present_Status === "TERMINATED") {
    this.Leave_Dt = new Date();
    this.leftdisabled = true;
  }
  else {
    // var currentdate = new Date();
    // var date = currentdate.getDate();
    // var month = currentdate.getMonth();
    // var month = currentdate.toLocaleString('en-us', { month: 'short' })
    // var finaldate = date+"/"+month+"/"+"2099";//this.DateService.dateConvert(new Date(date+"/"+month+"/"+"2099"));
    this.Leave_Dt = "01/Jan/2099";
    // console.log("this.Leave_Dt ===",this.Leave_Dt)
    this.leftdisabled = false;
  }
}
onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("consul");
    this.compacctToast.clear("resetphone");
}
Bankinfo(){
  if(this.objemployee.Salary_Paid_By === 'Bank')
  {
    this.isdiabled = false;
    this.objemployee.Bank_ID = 1;
   }
  else
  {
    this.isdiabled = true;
    this.objemployee.Bank_Ac_No = undefined;
    this.objemployee.Re_Enter_Bank_Ac_No = undefined;
    this.objemployee.Bank_ID = undefined;
    this.objemployee.Bank_Ac_Type = undefined;
    this.objemployee.Bank_IFSC_Code = undefined;
    this.objemployee.bank_branch_name = undefined;
    this.objemployee.Bank_ID = 1;
  }
}

StateDistrictChange(pin){
  console.log(pin);
  if(pin.length === 6)
  {
  const obj = {
      "SP_String": "Sp_HR_Employee_Master",
       "Report_Name_String":"Get_State_District_Name",
       "Json_Param_String": JSON.stringify([{Pincode: pin}]) 
        }
        
          this.GlobalAPI.getData(obj)
          .subscribe((data)=>
          {
            this.AllStateDistrictList = data;
            //this.objSubLedger.State=this.AllStateList.StateName;
            console.log('State = ', this.AllStateDistrictList);
            this.objemployee.Present_State = this.AllStateDistrictList.length ? this.AllStateDistrictList[0].StateName : undefined
            this.objemployee.Present_Dist = this.AllStateDistrictList.length ? this.AllStateDistrictList[0].DistrictName : undefined
           
          });
        }

}

StateDistrictChange2(pin){
  console.log(pin);
  if(pin.length === 6)
  {
  const obj = {
      "SP_String": "Sp_HR_Employee_Master",
       "Report_Name_String":"Get_State_District_Name",
       "Json_Param_String": JSON.stringify([{Pincode: pin}]) 
        }
        
          this.GlobalAPI.getData(obj)
          .subscribe((data)=>
          {
            this.AllStateDistrictList2 = data;
            //this.objSubLedger.State=this.AllStateList.StateName;
            console.log('State = ', this.AllStateDistrictList);
            
            this.objemployee.Perm_State = this.AllStateDistrictList2.length ? this.AllStateDistrictList2[0].StateName : undefined
            this.objemployee.Perm_Dist = this.AllStateDistrictList2.length ? this.AllStateDistrictList2[0].DistrictName : undefined
            
          });
        }

}

Esicheck(ESI_Avail){
  console.log(ESI_Avail);
  if(ESI_Avail == false)
  {
    this.objemployee.ESI_No = undefined;
  }
}

pfcheck(PF_Avail){
  if(PF_Avail==false){
    this.objemployee.PF_Ac_No = undefined;
    this.objemployee.UAN_NO = undefined;
  }

}
onCheckCode(Emp_Code){
  const tempobj ={
    Emp_Code : Emp_Code,
    Emp_ID : this.objemployee.Emp_ID ? this.objemployee.Emp_ID : 0
  }
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
     "Report_Name_String":"Cheaked_Emp_Code",
     "Json_Param_String": JSON.stringify([tempobj]) 
      }
      
        this.GlobalAPI.getData(obj)
        .subscribe((data)=>
        {
         console.log("data=",data[0].Column1);
         this.checkcode = data[0].Column1;
         
          //this.objSubLedger.State=this.AllStateList.StateName;
          if(data[0].Column1 === 1)
          {
            this.flag = true;
            
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Employee Code Already Exits"
          });
          }
          else{
            this.flag = false;
          }
          
          
        });

}

getDepartment(){
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
    "Report_Name_String": "Get_Dept"
    
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.DeptList = data;
     console.log("DeptList=", this.DeptList);
     
   })

}

getWorkingCompany(){
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
    "Report_Name_String": "Get_Working_Company"
    
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.WorkingCompanyList = data;
     console.log("WorkingCompanyList=", this.WorkingCompanyList);
     
   })

}

getDesignation(){
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
    "Report_Name_String": "Get_Designation"
    
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.DesignationList = data;
     console.log("DesignationList=", this.DesignationList);
     
   })

}
GetGrade(){
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
     "Report_Name_String":"Get_Grade"
      }
        this.GlobalAPI.getData(obj).subscribe((data)=>{
          this.GradeList = data;
          this.objemployee.Personal_Area = (this.databaseName === 'MICL_Demo' || this.databaseName === 'MICL') ? "HALDIA" : undefined;
          console.log("GradeList=",this.GradeList);
        });


}

getLocation(){
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
    "Report_Name_String": "Get_Location"
    
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.LocationList = data;
     console.log("LocationList=", this.LocationList);
     
   })

}
CreateLocation(){
  this.Location = "";
  this.locationsubmitted = false;
  setTimeout(() => {
    this.LocationModal = true;
  }, 200);
  }

  SaveLocation(loc){
  this.locationsubmitted = true;
  if(loc){
  this.Spinner = true;
  
  console.log(loc);
  const tempObj = {
    
    Location : loc
  }
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
    "Report_Name_String": "Create_Location",
    "Json_Param_String": JSON.stringify([tempObj])
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log('data=',data);
    if(data[0].Column1)
       {
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Location",
        detail: "Succesfully Created"
      });
      this.ngxService.stop();
      this.Spinner = false;
      this.Location = undefined;
      this.LocationModal = false;
      this.getLocation();
      this.locationsubmitted = false;
      
    }
    else{
      this.compacctToast.clear();
      this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Error",
      detail: "Something Wrong"
    });
    this.ngxService.stop();
    this.Spinner = false;
    this.ViewProTypeModal4 = false
    }
     
   });
   
  }

  }

// getEmployee(){
//   const obj = {
//     "SP_String": "Sp_HR_Employee_Master",
//     "Report_Name_String": "Get_Employee"
    
//   }
//    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
//      this.EmployeeList = data;
//      console.log("EmployeeList=", this.EmployeeList);
     
//    })

// }

getEmployee(){
  this.AllEmployeeList=[]; 
  this.EmployeeList = [];
 
    const obj = {
      "SP_String": "Sp_HR_Employee_Master",
      "Report_Name_String":"Get_Employee",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.AllEmployeeList = data;
     console.log("this.AllEmployeeList",this.AllEmployeeList);
      this.AllEmployeeList.forEach((el:any) => {
        this.EmployeeList.push({
          label: el.NAME,
          value: el.Emp_ID
        });
      });
      this.getempdetailsforU();
  
    })
}
getempdetailsforU(){
  this.objselect.Emp_ID = undefined;
  if(this.$CompacctAPI.CompacctCookies.User_Type === "A" && this.$CompacctAPI.CompacctCookies.Del_Right === "Y") {
    this.objselect.Emp_ID = undefined;
    this.userdisabled = false;
    this.userdatedisabled = true;
  }
  else{
    const userid = this.AllEmployeeList.filter(ele=> Number(ele.User_ID)===Number(this.$CompacctAPI.CompacctCookies.User_ID));
    this.objselect.Emp_ID = userid ? userid[0].Emp_ID : undefined;
    this.getEmployeeDetails(this.objselect.Emp_ID);
    this.userdisabled = true;
    this.userdatedisabled = false;
  }
}

getEmployeeDetails(Emp_ID){
  if (this.objselect.Emp_ID) {
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
     "Report_Name_String":"Get_HR_Employee_Details",
     "Json_Param_String": JSON.stringify([{Emp_ID : Emp_ID}]) 
      }
      
        this.GlobalAPI.getData(obj)
        .subscribe((res)=>
        {
          console.log("Get Data",res)
          console.log("Get Data Main",JSON.parse(res[0].main))
          // JSON.parse(res[0].main)
          let data = JSON.parse(res[0].main)
          this.EmployeeDetailsList = data;
         console.log("EmployeeDetailsList=",this.EmployeeDetailsList);
         if(this.databaseName === 'GN_JOH_HR') {
         this.getChildDetails(Emp_ID);
         }
         const editlist = data ? data[0] : undefined;
         this.DocumentList = data[0].doc ? data[0].doc : []
          console.log("editlist=",editlist);
         if (this.objselect.Emp_ID) {
         this.objemployee = editlist;
         this.CalculateTime();
         this.objemployee.Dept_ID = data[0].Dept_ID ? data[0].Dept_ID : undefined;
         this.objemployee.Personal_Area = (this.databaseName === 'MICL_Demo' || this.databaseName === 'MICL') ? data[0].Personal_Area ? data[0].Personal_Area : "HALDIA" : data[0].Personal_Area ? data[0].Personal_Area : undefined;
        //  this.objemployee.Personal_Area = data[0].Personal_Area ? data[0].Personal_Area : "HALDIA";
         this.objemployee.Bank_Ac_Type = data[0].Bank_Ac_Type ? data[0].Bank_Ac_Type : undefined;
         this.objemployee.Re_Enter_Bank_Ac_No = data[0].Bank_Ac_No;
         this.objemployee.Physically_Chalanged = data[0].Physically_Chalanged === 1 ? 'YES' : 'NO';
         this.objemployee.Is_Biometric = data[0].Is_Biometric == "Y"? true : false;
         this.objemployee.Late_Ded_Tag = data[0].Late_Ded_Tag == "Y"? true : false; 
         this.objemployee.Is_HOD = data[0].Is_HOD == "Y"? true : false;
         this.objemployee.Is_Trainer = data[0].Is_Trainer == "Y"? true : false;
         this.Joining_Dt = new Date(data[0].Emp_Joining_Dt);
         this.Resign_On = new Date(data[0].Resign_On);
         this.Leave_Dt = new Date(data[0].Emp_Leave_Dt) ;
         this.objemployee.Present_Status = data[0].Present_Status;
         this.leftdisabled = this.objemployee.Present_Status === "RESIGNED" || 
                             this.objemployee.Present_Status === "SUSPENDED" || 
                             this.objemployee.Present_Status === "ABSCONDED" ||
                             this.objemployee.Present_Status === "TERMINATED" ? true : false;
         this.DOB = new Date(data[0].D_O_B);
         this.Spouse_DOB = new Date(data[0].Spouse_DOB);
         this.Date_Of_Anniversary = new Date(data[0].Date_Of_Anniversary);
         this.imagePath = data[0].Person_Photo ? data[0].Person_Photo : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu3_qIHtXBZ7vZeMQhyD8qLC1VRB9ImHadL09KET_iSQEX6ags4ICknfmqEKz8Nf6IOsA&usqp=CAU "
         this.ProductViewFalg = data[0].Person_Photo ? true : false
         this.objemployee.Person_Photo = data[0].Person_Photo 
         //this.objSubLedger.State=this.AllStateList.StateName;
          this.Employeeid = this.objemployee.Emp_ID;
          this.buttonname = "Update"
          this.flag = false;
          this.checkcode = undefined;
        }
        else {
          this.objemployee = new Employee();
          this.Date_Of_Anniversary = undefined;
          this.Spouse_DOB = undefined;
          this.clearchilddetails();
          this.cleanPreView();
        }
          
        });
      }
      else {
        this.objemployee = new Employee();
        this.Date_Of_Anniversary = undefined;
        this.Spouse_DOB = undefined;
        this.clearchilddetails();
        this.cleanPreView();
      }
}
getChildDetails(Emp_ID){
  this.AddChildList = [];
  if (this.objselect.Emp_ID) {
    const obj = {
      "SP_String": "Sp_HR_Employee_Master",
       "Report_Name_String":"Get_HR_Employee_Child_Details",
       "Json_Param_String": JSON.stringify([{Emp_ID : Emp_ID}]) 
        }
        
          this.GlobalAPI.getData(obj).subscribe((data)=>
          {
            console.log("Get Data",data)
            // JSON.parse(res[0].main)
          if(data.length){
            this.objemployee.Child_Details = true;
            data.forEach(element => {
              const  childObj = {
                Child_Name : element.Child_Name,
                Child_Gender : element.Child_Gender,
                Child_D_O_B : this.DateService.dateConvert(new Date(element.Child_D_O_B)),
              };
        
              this.AddChildList.push(childObj);
            });
          }
          });
  }
}

getBankName(){
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
     "Report_Name_String":"Get_Bank_Name"
     
      }
      
        this.GlobalAPI.getData(obj)
        .subscribe((data)=>
        {
          this.BankNameDetails = data;
         console.log("BankNameDetails=",this.BankNameDetails);
          
       
        });

}

getStatus(){
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
    "Report_Name_String": "Get_Emp_Status"
    
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Statuslist = data;
    //  console.log("Statuslist=", this.Statuslist);
     
   })

}

getReportingList(){
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
     "Report_Name_String":"Get_Reporting_Business_Manager"
     
      }
      
        this.GlobalAPI.getData(obj)
        .subscribe((data)=>
        {
          this.ReportingList = data;
         console.log("ReportingList=",this.ReportingList);
          
       
        });


}
CalculateTime(){
  this.objemployee.Working_Hours_Mins = undefined;
  if (this.objemployee.Off_In_Time && this.objemployee.Off_Out_Time) {
    var outtime:any = new Date(this.objemployee.Off_Out_Time);
    var intime:any = new Date(this.objemployee.Off_In_Time);
    console.log("outtime ====",new Date(outtime));
    console.log("intime =====",new Date(intime));
    // var diff = outtime - intime;
    // return this.objemployee.Working_Hours_Mins = Math.floor(diff/(1000*60*60)).toLocaleString(undefined, {minimumIntegerDigits: 2}) + ":" + (Math.floor(diff/(1000*60))%60).toLocaleString(undefined, {minimumIntegerDigits: 2})  + ":" + (Math.floor(diff/1000)%60).toLocaleString(undefined, {minimumIntegerDigits: 2}) ;
    var minutes = Math.abs(outtime.getTime() - intime.getTime()) / 36e5 * 60;
    // var minutes = Math.abs(outtime.getTime() - intime.getTime()) / (1000 * 60) % 60;
    // console.log("out time ====",outtime.getTime());
    // console.log("in time =====",intime.getTime());
    // console.log("subtime =====",Math.abs(outtime.getTime() - intime.getTime()));
    // console.log("minutes =====",minutes);
    this.objemployee.Working_Hours_Mins = minutes;
    // console.log(this.DateService.dateTimeConvert(new Date(this.objemployee.Off_In_Time)));
    // console.log(this.DateService.dateTimeConvert(new Date(this.objemployee.Off_Out_Time)));
  }
}
clearchilddetails(){
  // if(!this.objemployee.Child_Details){
    this.objemployee.Child_Name = undefined;
    this.objemployee.Child_Gender = undefined;
    this.Child_D_O_B = new Date();
    this.AddChildList = [];
  // }
}
AddChildDetails(valid){
  this.ChildFormSubmitted = true;
    if(valid) {
      var childobj = {
        Child_Name : this.objemployee.Child_Name,
        Child_Gender : this.objemployee.Child_Gender,
        Child_D_O_B : this.DateService.dateConvert(new Date(this.Child_D_O_B)),
    };
    this.AddChildList.push(childobj);
    this.objemployee.Child_Name = undefined;
    this.objemployee.Child_Gender = undefined;
    this.Child_D_O_B = new Date();
    this.ChildFormSubmitted = false;
  }
}
DetetechildDetails(index) {
  this.AddChildList.splice(index,1)
}
checkbankacno(){
  if (this.databaseName === 'GN_JOH_HR'){
  if (this.objemployee.Re_Enter_Bank_Ac_No) {
  if (this.objemployee.Bank_Ac_No == this.objemployee.Re_Enter_Bank_Ac_No){
    this.bankacnoflag = false;
    return true;
  } else {
      this.ngxService.stop();
      this.Spinner = false;
      this.bankacnoflag = true;
      return false;
  }
  } else {
    return true;
  }
  } else {
    return true;
  }
}

async saveemployeemaster(valid){
  this.EmployeeFormSubmitted = true;
  console.log(valid);
  if(valid && this.checkbankacno()){
    this.EmployeeFormSubmitted = false;
    this.Spinner = true;
    this.ngxService.start();
    if(this.ProductView['size'] ){
      this.GlobalAPI.CommonFileUpload(this.ProductView).subscribe((data:any)=>{
        this.objemployee.Person_Photo = data.file_url
       this.saveEmp()
      })
    }
    else if(this.objemployee.Person_Photo) {
      this.saveEmp()
    } 
     else {
      this.objemployee.Person_Photo = ""
      this.saveEmp()
     }
    }
 }
saveEmp(){

  if(!this.DocumentList){
    return
  }
  this.objemployee.doc = this.DocumentList.length ?  this.DocumentList : [{}]
  if(this.checkcode != 1){
    if(this.objemployee.Off_Day != this.objemployee.Second_Off_Day ){
    this.objemployee.Emp_Joining_Dt = this.DateService.dateConvert(new Date(this.Joining_Dt));
    this.objemployee.Resign_On = this.DateService.dateConvert(new Date(this.Resign_On));
    this.objemployee.Emp_Leave_Dt = this.DateService.dateConvert(new Date(this.Leave_Dt));
    this.objemployee.D_O_B = this.DateService.dateConvert(new Date(this.DOB));
    this.objemployee.User_ID = this.commonApi.CompacctCookies.User_ID;
    this.objemployee.Physically_Chalanged = this.objemployee.Physically_Chalanged === 'YES'? 1 : 0;
    this.objemployee.PF_Avail = this.objemployee.PF_Avail ? 1 : 0;
    this.objemployee.ESI_Avail = this.objemployee.ESI_Avail? 1 : 0;
    this.objemployee.PTax_Avail = this.objemployee.PTax_Avail? 1 : 0;
    this.objemployee.Late_Ded_Tag = this.objemployee.Late_Ded_Tag? 'Y' : 'N';
    this.objemployee.Is_Biometric = this.objemployee.Is_Biometric? 'Y' : 'N';
    this.objemployee.Is_HOD = this.objemployee.Is_HOD? 'Y' : 'N';
    this.objemployee.Is_Trainer = this.objemployee.Is_Trainer ? 'Y' : 'N';
    this.objemployee.Login_User_ID = this.objemployee.Login_User_ID ? this.objemployee.Login_User_ID : 0;
    this.objemployee.Off_In_Time = this.objemployee.Off_In_Time ? this.DateService.dateTimeConvert(new Date(this.objemployee.Off_In_Time)) : undefined;
    this.objemployee.Off_Out_Time = this.objemployee.Off_Out_Time ? this.DateService.dateTimeConvert(new Date(this.objemployee.Off_Out_Time)) : undefined;
    this.objemployee.OT_Avail = this.objemployee.OT_Avail === true ? 1 : 0;
    this.objemployee.Spouse_DOB = this.Spouse_DOB ? this.DateService.dateConvert(new Date(this.Spouse_DOB)) : undefined;
    this.objemployee.Date_Of_Anniversary = this.Date_Of_Anniversary ? this.DateService.dateConvert(new Date(this.Date_Of_Anniversary)) : undefined;
     if(this.Employeeid){
     console.log("Update");
      const obj = {
        "SP_String": "Sp_HR_Employee_Master",
        "Report_Name_String":"Update_HR_Employee",
        "Json_Param_String": JSON.stringify([this.objemployee]),
        "Json_1_String": JSON.stringify(this.AddChildList)
      }
      this.GlobalAPI.getData(obj)
      .subscribe((data : any)=>
      {
        console.log("edit",data[0].Column1);
        if(data[0].Column1 == 'Done')
        {
          this.cleanPreView()
          this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Employee Master Update Succesfully",
              detail: "Succesfully Updated"
            });
            this.ngxService.stop();
            this.Spinner = false;
            this.clearData();
            this.getEmployee();
            this.getReportingList();
         
        }
        else{
          this.ngxService.stop();
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Something Wrong"
        });
        }
      });
     }
    
    else{
    
      console.log("Create");

      const obj = {
        "SP_String": "Sp_HR_Employee_Master",
        "Report_Name_String":"HR_Employee_Create",
        "Json_Param_String": JSON.stringify([this.objemployee]) ,
        "Json_1_String": JSON.stringify(this.AddChildList)
      }
      this.GlobalAPI.getData(obj)
      .subscribe((data : any)=>
      {
        console.log("Create",data[0].Column1);
        var msg = data[0].Column1;
        if(data[0].Column1)
        {
          this.cleanPreView()
          this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "EMP_ID" + msg,
              detail: "Succesfully Created"
            });
            this.ngxService.stop();
            this.Spinner = false;
            this.clearData();
            this.getEmployee();
            this.getReportingList();
           
            
        }
        else{
          this.ngxService.stop();
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Something Wrong"
        });
        }
      });
    }
  }
  
   
     else{
      this.ngxService.stop();
      this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "1st weekly off and second weekly off are must be different"
          });
        }
      
    }
    else{
      this.ngxService.stop();
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Error",
      detail: "Employee Code Already Exits"
    });
    }
}


AddressCopy(){
  if(this.ischeckaddress == true)
  {
    this.objemployee.Perm_Add_1 = this.objemployee.Present_Add_1;
    this.objemployee.Perm_Add_2 = this.objemployee.Present_Add_2;
    this.objemployee.Perm_Pin = this.objemployee.Present_Pin;
    this.objemployee.Perm_State = this.objemployee.Present_State;
    this.objemployee.Perm_Dist = this.objemployee.Present_Dist;
    this.objemployee.Perm_Country = this.objemployee.Present_Country;

  }
  else{
    this.objemployee.Perm_Add_1 = undefined;
    this.objemployee.Perm_Add_2 = undefined;
    this.objemployee.Perm_Pin = undefined;
    this.objemployee.Perm_State = undefined;
    this.objemployee.Perm_Dist = undefined;
    this.objemployee.Perm_Country = undefined


  }
}

GetNewEmployee(){
  this.objemployee = new Employee();
  this.Date_Of_Anniversary = undefined;
  this.Spouse_DOB = undefined;
  this.objselect = new Select();
  this.Employeeid = undefined;
  this.objemployee.Bank_ID = 1;
  this.objemployee.Present_Country = "India";
  this.objemployee.Perm_Country = "India";
  this.Joining_Dt = new Date();
  this.Resign_On = new Date();
  // this.Leave_Dt = new Date();
  this.objemployee.Present_Status = undefined;
  this.objemployee.Personal_Area = (this.databaseName === 'MICL_Demo' || this.databaseName === 'MICL') ? "HALDIA" : undefined;
  this.leftdatechange();
  this.DOB = new Date();
  this.EmployeeFormSubmitted = false;
  this.buttonname   = 'Create';
  this.flag=false;
  this.checkcode = undefined;
  this.DocumentList = [];
  this.ischeckaddress = false;
  this.imagePath= "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu3_qIHtXBZ7vZeMQhyD8qLC1VRB9ImHadL09KET_iSQEX6ags4ICknfmqEKz8Nf6IOsA&usqp=CAU "


}



ValidatePAN() {
  var txtPANCard:any = document.getElementById("txtPANCard");
  // var lblPANCard:any = document.getElementById("lblPANCard")
  var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
  if (regex.test(txtPANCard.value.toUpperCase())) {
      // lblPANCard.style.visibility = "hidden";
      return this.PANvalidFlag = false;
  } else {
      // lblPANCard.style.visibility = "visible";
      return this.PANvalidFlag = true;
  }
}

FetchPDFFile(event : any){
  this.PDFFlag = false;
  this.ProductPDFFile = {};
  if (event) {
    this.ProductPDFFile = event.files[0];
    this.PDFFlag = true;
  }
}

  addDocuments(){
    this.DocvalidSubmit = true
    if( this.ProductPDFFile['size'] && this.objemployee.Document_Name){
      this.SpinnerDoc = true
      this.GlobalAPI.CommonFileUpload(this.ProductPDFFile).subscribe((data:any)=>{
        console.log("Upload File",data)
        this.DocumentList.push({
          Document_Name : this.objemployee.Document_Name,
          Doc_URL : data.file_url
        })
        this.fileInput.clear()
        this.objemployee.Document = undefined
        this.ProductPDFFile = {}
        this.SpinnerDoc = false
        this.DocvalidSubmit = false
        this.objemployee.Document_Name = undefined
        console.log("DocumentList",this.DocumentList)
      })
 }
}

 showImg(Document:any){
  console.log(Document)
  if(Document){
    window.open(Document);
  }
}

DeleteDoc(row){
  this.DocumentList.splice(row,1);
}
handleFileSelect(event:any) {
 this.ProductView= {};
  if (event) {
    this.ProductViewFalg = true
    console.log(event)
    this.ProductView = event.files[0];
    const files = event.files;
    if (files.length === 0)
        return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
       // this.message = "Only images are supported.";
        return;
    }

    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
        this.imagePath = reader.result; 
    }
    this.preview.clear()
    console.log("imagePath",this.imagePath)
}
}
cleanPreView(){
  this.preview.clear()
  this.ProductView = {}
  this.ProductViewFalg = false
  this.objemployee.Person_Photo = undefined
  this.imagePath = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu3_qIHtXBZ7vZeMQhyD8qLC1VRB9ImHadL09KET_iSQEX6ags4ICknfmqEKz8Nf6IOsA&usqp=CAU "
}

RefreshReporting(){
  this.getReportingList();

}

ViewDesignationType(){
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
     "Report_Name_String":"Get_Designation" 
      }
      
        this.GlobalAPI.getData(obj)
        .subscribe((data)=>
        {
          this.ViewDesignationList = data;
          this.ViewDesignationListObj = data;
          //this.objSubLedger.State=this.AllStateList.StateName;
          console.log('ViewDesignationListObj = ', this.ViewDesignationListObj);
        
        });
        setTimeout(()=>{
          this.ViewProTypeModal = true;
         },300);
      }

      DeleteDesignation(col){
        this.Del = true;
        this.Del2 = false;
        this.Desigid = col.Desig_ID;
        
        console.log(this.Desigid);
           
            this.Spinner = true;
            
           this.compacctToast.clear();
           this.compacctToast.add({
             key: "c",
             sticky: true,
             closable: false,
             severity: "warn",
             summary: "Are you sure?",
             detail: "Confirm to proceed"
           })
           this.ngxService.stop();
           this.Spinner = false;

      }

      onConfirm2(){
        const tempobj={
          Desig_ID : this.Desigid,
          
        }
        const obj = {
          "SP_String": "Sp_HR_Employee_Master",
          "Report_Name_String": "Delete_Designation",
          "Json_Param_String": JSON.stringify([tempobj])
          
        }
         this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          console.log('data=',data);
          //if (data[0].Sub_Ledger_ID)
          if(data[0].Response=='Done')
          {
            //this.SubLedgerID = data[0].Column1
           this.compacctToast.clear();
           this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Designation Delete Succesfully ",
           detail: "Succesfully Deleted"
         });
         //this.Delete(this.DocNo);
         this.ViewDesignationType();
         this.getDesignation();
        }
        else if(data[0].Response=='Already Exists'){
          this.compacctToast.clear();
           this.compacctToast.add({
           key: "compacct-toast",
           severity: "error",
           summary: "Error",
           detail: "Already Exists"
           })

        }
        else{
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Something Wrong"
        });
      }
           
         })
      

      }

    CreateDesignation(){
    this.Desig = "";
    this.Desigsubmitted = false;
    setTimeout(() => {
      this.ViewProTypeModal2 = true;
    }, 200);
    }

  SaveDesignation(Desig){
    this.Desigsubmitted = true;
    if(Desig){
    this.Spinner = true;
    
    console.log(Desig);
    const tempObj = {
      
      Designation : Desig
    }
    const obj = {
      "SP_String": "Sp_HR_Employee_Master",
      "Report_Name_String": "Create_Designation",
      "Json_Param_String": JSON.stringify([tempObj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log('data=',data);
      if(data[0].Response)
         {
          
           //this.SubLedgerID = data[0].Column1
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Designation Create Succesfully ",
          detail: "Succesfully Created"
        });
        this.ngxService.stop();
        this.Spinner = false;
        
        this.ViewProTypeModal2 = false;
        this.getDesignation();
        this.Desigsubmitted = false;
        
      }
      else{
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something Wrong"
      });
      this.ngxService.stop();
      this.Spinner = false;
      this.ViewProTypeModal2 = false
      }
       
     });
     
    }
  }

  
  ViewDepartmentType(){
    const obj = {
      "SP_String": "Sp_HR_Employee_Master",
       "Report_Name_String":"Get_Dept" 
        }
        
          this.GlobalAPI.getData(obj)
          .subscribe((data)=>
          {
            this.ViewDepartmentList = data;
            this.ViewDepartmentListObj = data;
            //this.objSubLedger.State=this.AllStateList.StateName;
            console.log('ViewDepartmentListObj = ', this.ViewDepartmentListObj);
          
          });
          setTimeout(()=>{
            this.ViewProTypeModal3 = true;
           },300);

  }

  DeleteDepartment(col){
       this.Del = false;
        this.Del2 = true;
        
        this.Deptid = col.Dept_ID;
        
        console.log(this.Deptid);
           
            this.Spinner = true;
            
           this.compacctToast.clear();
           this.compacctToast.add({
             key: "c",
             sticky: true,
             closable: false,
             severity: "warn",
             summary: "Are you sure?",
             detail: "Confirm to proceed"
           })
           this.ngxService.stop();
           this.Spinner = false;

  }

  onConfirm(){
    const tempobj={
      Dept_ID : this.Deptid,
      
    }
    const obj = {
      "SP_String": "Sp_HR_Employee_Master",
      "Report_Name_String": "Delete_Hr_Dept",
      "Json_Param_String": JSON.stringify([tempobj])
      
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log('data=',data);
      //if (data[0].Sub_Ledger_ID)
      if(data[0].Response=='Done')
      {
        //this.SubLedgerID = data[0].Column1
       this.compacctToast.clear();
       this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Department Delete Succesfully ",
       detail: "Succesfully Deleted"
     });
     //this.Delete(this.DocNo);
     this.ViewDepartmentType();
     this.getDepartment();
    }
    else if(data[0].Response=='Already Exists'){
      this.compacctToast.clear();
       this.compacctToast.add({
       key: "compacct-toast",
       severity: "error",
       summary: "Error",
       detail: "Already Exists"
       })

    }
    else{
      this.compacctToast.clear();
      this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Error",
      detail: "Something Wrong"
    });
  }
       
     })
  
     
  }

  CreateDepartment(){
    this.Dept = "";
    this.Deptsubmitted = false;
    setTimeout(() => {
      this.ViewProTypeModal4 = true;
    }, 200);
    }

    SaveDepartment(Dept){
    this.Deptsubmitted = true;
    if(Dept){
    this.Spinner = true;
    
    console.log(Dept);
    const tempObj = {
      
      Dept_Name : Dept
    }
    const obj = {
      "SP_String": "Sp_HR_Employee_Master",
      "Report_Name_String": "Create_Hr_Dept",
      "Json_Param_String": JSON.stringify([tempObj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log('data=',data);
      if(data[0].Response)
         {
          
           //this.SubLedgerID = data[0].Column1
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Department Create Succesfully ",
          detail: "Succesfully Created"
        });
        this.ngxService.stop();
        this.Spinner = false;
        
        this.ViewProTypeModal4 = false;
        this.getDepartment();
        this.Deptsubmitted = false;
        
      }
      else{
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something Wrong"
      });
      this.ngxService.stop();
      this.Spinner = false;
      this.ViewProTypeModal4 = false
      }
       
     });
     
    }

    }

  getUser(){
    const obj = {
      "SP_String": "Sp_HR_Employee_Master",
      "Report_Name_String":"Get_User"
       
        }
        
          this.GlobalAPI.getData(obj)
          .subscribe((data)=>
          {
            this.UserList = data;
           console.log("UserList=",this.UserList);
            
         
          });

  }


clearData(){
  this.EmployeeFormSubmitted = false;
  this.objemployee = new Employee();
  this.objselect = new Select();
  this.Joining_Dt = new Date();
  this.Resign_On = new Date();
  // this.Leave_Dt = new Date();
  this.leftdatechange();
  this.DOB = new Date();
  this.Date_Of_Anniversary = undefined;
  this.Spouse_DOB = undefined;
  this.objemployee.Present_Country = "India";
  this.objemployee.Perm_Country = "India";
  this.objemployee.Personal_Area = (this.databaseName === 'MICL_Demo' || this.databaseName === 'MICL') ? "HALDIA" : undefined;
  this.ischeckaddress = false;
  this.Employeeid = undefined;
  this.objemployee.Bank_ID = 1;
  this.buttonname = "Create";
  this.flag = false;
  this.DocumentList = [];
  this.imagePath= "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu3_qIHtXBZ7vZeMQhyD8qLC1VRB9ImHadL09KET_iSQEX6ags4ICknfmqEKz8Nf6IOsA&usqp=CAU "
}

// JOH HR
getReferenceBy(){
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
    "Report_Name_String": "Get_Master_HR_Employee_Reference"
    
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Referencelist = data;
     console.log("Referencelist=", this.Referencelist);
     
   })

}
changeclearobj(){
  this.objemployee.Reference_Details_ID = undefined;
  this.objemployee.Reference_Details = undefined;
  console.log('Reference_Details_ID===',this.objemployee.Reference_Details_ID)
  console.log('Reference_Details===',this.objemployee.Reference_Details)
}
getConsultancy(){
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
    "Report_Name_String": "View_Master_HR_Consultancy_Details"
    
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Consultancylist = data;
     console.log("Consultancylist=", this.Consultancylist);
     
   })

}
ViewConsultancy(){
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
     "Report_Name_String":"View_Master_HR_Consultancy_Details" 
      }
      
        this.GlobalAPI.getData(obj)
        .subscribe((data)=>
        {
          this.ViewConsultancyList = data;
          this.ViewConsultancyListObj = data;
          //this.objSubLedger.State=this.AllStateList.StateName;
          console.log('ViewDesignationListObj = ', this.ViewDesignationListObj);
        
        });
        setTimeout(()=>{
          this.ViewconsultancyModal = true;
         },300);
}

DeleteConsultancy(col){
  this.consultancyid = col.Desig_ID;
        
  console.log(this.consultancyid);
           
      this.Spinner = true;
            
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "consul",
       sticky: true,
       closable: false,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      })
      this.ngxService.stop();
      this.Spinner = false;

}

onConfirmconsuldel(){
  const tempobj={
    Consultancy_ID : this.consultancyid,
          
  }
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
    "Report_Name_String": "Delete_Designation",
    "Json_Param_String": JSON.stringify([tempobj])
          
  }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log('data=',data);
    //if (data[0].Sub_Ledger_ID)
    if(data[0].Response=='Done')
    {
      //this.SubLedgerID = data[0].Column1
     this.compacctToast.clear();
     this.compacctToast.add({
     key: "compacct-toast",
     severity: "success",
     summary: "Consultancy Delete Succesfully ",
     detail: "Succesfully Deleted"
    });
    //this.Delete(this.DocNo);
    this.ViewConsultancy();
    this.getConsultancy();
  }
  else if(data[0].Response=='Already Exists'){
    this.compacctToast.clear();
     this.compacctToast.add({
     key: "compacct-toast",
     severity: "error",
      summary: "Error",
      detail: "Already Exists"
      })

  }
  else{
     this.compacctToast.clear();
     this.compacctToast.add({
    key: "compacct-toast",
     severity: "error",
     summary: "Error",
    detail: "Something Wrong"
  });
}
           
   })
      

}
checkGSTvalid(g){
  // if (this.objSubLedger.Composite_GST === "No") {
  this.GSTvalidFlag = false;
  if(g) {
    let regTest = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(g)
    if(regTest){
      let a = 65,b = 55, c =36;
      let p;
      return Array['from'](g).reduce((i:any,j:any,k:any,g:any)=>{
        p =(p=(j.charCodeAt(0)<a?parseInt(j):j.charCodeAt(0)-b)*(k%2+1))>c?1+(p-c):p;
        return k<14?i+p:j==((c=(c-(i%c)))<10?c:String.fromCharCode(c+b));
      },0);
    }
    this.GSTvalidFlag = !regTest;
  }
  // }

}

CreateCunsultancy(){
  this.objconsultancy = new Consultancy();
    this.consultancyFormSubmitted = false;
    setTimeout(() => {
      this.CreateConsulModal = true;
    }, 200);
}

SaveConsultancy(valid){
    this.consultancyFormSubmitted = true;
    this.Spinner = true;
    if(valid){
    const tempObj = {
      Consultancy_ID : this.objemployee.Reference_Details_ID,
      Reference_ID : this.objemployee.Reference_ID
    }
    this.objconsultancy.GST_NO = this.objconsultancy.GST_NO ? this.objconsultancy.GST_NO : "NA"
    this.objconsultancy.PAN = this.objconsultancy.PAN ? this.objconsultancy.PAN : "NA"
    const obj = {
      "SP_String": "Sp_HR_Employee_Master",
      "Report_Name_String": "Save_Master_HR_Consultancy_Details",
      "Json_Param_String": JSON.stringify([{...tempObj,...this.objconsultancy}])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log('data=',data);
      if(data[0].Column1){
           //this.SubLedgerID = data[0].Column1
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Consultancy Create Succesfully ",
          detail: "Succesfully Created"
        });
        this.ngxService.stop();
        this.Spinner = false;
        
        this.CreateConsulModal = false;
        this.getConsultancy();
        this.consultancyFormSubmitted = false;
        
      }
      else{
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something Wrong"
      });
      this.ngxService.stop();
      this.Spinner = false;
      this.consultancyFormSubmitted = false
      }
       
     });
     
    }
}
getConsultancyEmp(){
  const obj = {
    "SP_String": "Sp_HR_Employee_Master",
    "Report_Name_String": "Get_Employee"
    
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if (data.length){
      data.forEach(element => {
        element['label'] = element.NAME,
        element['value'] = element.Emp_ID
      });
      this.emplist = data;
    }
    else {
      this.emplist = [];
    }
   })

}

ResetPhone(){
  if (this.objselect.Emp_ID) {
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "resetphone",
      sticky: true,
      closable: false,
      severity: "warn",
      summary: "Are you sure?",
      detail: "Confirm to proceed"
      })
  }
}
onConfirmReset(){
  this.resetdisabled = true;
  if(this.objemployee.Emp_Code){
    const obj = {
      "SP_String": "SP_HR_ATTN_DETAILS",
      "Report_Name_String": "Reset_Device_ID",
      "Json_Param_String": JSON.stringify([{Emp_Code : this.objemployee.Emp_Code}])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log('data=',data);
      if(data[0].Column1 === "Done"){
           //this.SubLedgerID = data[0].Column1
          this.resetdisabled = false;
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: " ",
          detail: "Reset Succesfully"
        });
      }
      else{
        this.resetdisabled = false;
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something Wrong"
      });
      }
     });
     
  } else {
        this.resetdisabled = false;
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something Wrong"
      });
  }
}

// onFileChanged(event) {
//   const files = event.target.files;
//   if (files.length === 0)
//       return;

//   const mimeType = files[0].type;
//   if (mimeType.match(/image\/*/) == null) {
//       this.message = "Only images are supported.";
//       return;
//   }

//   const reader = new FileReader();
//   this.imagePath = files;
//   reader.readAsDataURL(files[0]); 
//   reader.onload = (_event) => { 
//       this.url = reader.result; 
//   }
// }

}
class Employee{
 
  Salary_Paid : any;
  Emp_Code : any;
  Emp_Id : any;
  Pincode : any;
  First_Name : any;
  Middle_Name : any;
  Last_Name : any;
  Present_Add_1 : any;
  Present_Add_2 : any;
  Present_Country : any;
  Present_Dist : any;
  Present_Pin : any;
  Present_State : any;
  Perm_Add_1 : any;
  Perm_Add_2 : any;
  Perm_Country : any;
  Perm_Pin : any;
  Perm_Dist : any;
  Perm_State : any;
  Sex : any;
  Nationality : any;
  Material_Status : any;
  Blood_Group : any;
  Gurdian_Name : any;
  Father_Name : any;
  Mother_Name : any;
  Spouse_Wife_Name : any;
  Child_Details : any;
  Child_Name : any;
  Child_Gender : any;
  Contact_Phone : any;
  Contact_Mobile : any;
  Emergency_Contact : any;
  Contact_Email : any;
  Physically_Chalanged : any;
  EPIC_No : any;
  Adhar_No : any;
  PAN_No : any;
  Highest_Qualification : any;
  Company_Name : any;
  Comp_ID	: any;
  Location_ID : any;
  Desig_ID : any;
  Dept_ID : any;
  Bank_Ac_No : any;
  Re_Enter_Bank_Ac_No : any;
  Bank_Ac_Type : any;
  Bank_IFSC_Code : any;
  bank_branch_name : any;
  Second_Off_Day : any;
  Off_Day : any;
  Present_Status : any;
  Bank_ID : any;
  Is_Biometric : any;
  OT_Avail : any;
  ESI_No : any;
  PF_Ac_No : any;
  UAN_NO : any;
  Report_Manager : any;
  Business_Manager : any;
  Off_In_Time : any;
  Off_Out_Time : any;
  Working_Hours_Mins : any;
  PTax_Avail : any;
  Is_HOD : any;
  Is_Trainer : any;
  Emp_Leave_Dt : any;
  Resign_On : any;
  Emp_Joining_Dt : any;
  D_O_B : any;
  Spouse_DOB : any;
  Date_Of_Anniversary : any;
  PF_Avail : any= false;
  ESI_Avail : any = false;
  Late_Ded_Tag : any;
  Remarks : any;
  Emp_ID : any;
  User_ID : any;
  Document : any;
  photo_file:any;
  Document_Name : any;
  Doc_URL : any;
  doc:any;
  Person_Photo:any;
  Login_User_ID : any;
  Salary_Paid_By : any;
  Posting_State : any;
  Grade : any;
  Personal_Area : any;
  Grade_ID : any;
  Reference_ID : any;
  Reference_Name :  any;
  Reference_Details_ID : any;
  Reference_Details : any;
}
class Select{
  name : any;
  Emp_ID : any;

}

class Consultancy{
  Consultancy_ID : any;
  Reference_ID : any;
  Name	: any;
  Address	: any;
  Phone_No	: any;
  Contact_Person	: any;
  Contact_Person_Phone	: any;
  GST_NO	: any;
  PAN :  any;
  Email : any;
  Bank_Name	: any;
  Bank_AC_No	: any;
  Bank_IFSC_Code	: any;
  Bank_Branch	: any;
  Holder_Name : any;
  General_Recruitment_Terms	: any;
  Remarks	: any;
}
