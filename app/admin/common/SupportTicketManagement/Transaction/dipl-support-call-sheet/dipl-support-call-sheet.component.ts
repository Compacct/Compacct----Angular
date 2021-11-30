import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
declare var $: any;
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-dipl-support-call-sheet',
  templateUrl: './dipl-support-call-sheet.component.html',
  styleUrls: ['./dipl-support-call-sheet.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DIPLSupportCallSheetComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  menuList = [];
  buttonname = "Create";
  text2 :any;
  frnVal = false;
  frnVal2 = false;
  serviceCharge : number = 0;
  otherCharge : number = 0;
  totalCharge : number;
  Replacedlist = [];
  AssignedList = [];
  Spinner = false;
  seachSpinner = false;
  allData = [];
  StatusList = [];
  SupporttktFormSubmitted = false;
  SparesFormSubmitted = false;
  ObjsupportTkt= new supportTkt();
  Objsearch = new searchObj();
  ObjviewcallSheet = new viewcallSheet();
  searchList = [];
  display = false;
  viewList = [];
  PartsList = [];
  Param_Flag ='';
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    private route: ActivatedRoute,
    private _router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      if(params['Followup_ID']) {
        this.Param_Flag = window.atob(params['Followup_ID']);
        this.GetAllData();
      } else {
        this.Param_Flag = '';
      }
      })
  }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
     Header: "Support Call Sheet",
      Link: "Support Ticket -> Support Call Sheet"
    });
    this.GetAssigned();
    this.GetStatus();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
  }
  clearData(){
    this.ObjsupportTkt = new supportTkt();
    this.Replacedlist = [];
    this.frnVal = false;
    this.frnVal2 = false;
    this.SupporttktFormSubmitted = false;
   }

  // GET
  GetAssigned(){
  const TempObj = {
    User_ID : this.$CompacctAPI.CompacctCookies.User_ID
  }
  const obj = {
    "SP_String": "SUP_Call_Sheet",
    "Report_Name_String": "Get_Send_To_Drop_Down",
    "Json_Param_String": JSON.stringify([TempObj])
  }
  const ctrl = this;
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.AssignedList = data;
     console.log(this.AssignedList);
     for(let i = 0; i < ctrl.AssignedList.length ; i++){
       if(this.AssignedList[i].User_ID && this.AssignedList[i].User_ID != this.$CompacctAPI.CompacctCookies.User_ID){
         this.ObjsupportTkt.Sent_To = this.AssignedList[i].User_ID;
         break;
       }
      }

  })
  }
  GetStatus(){
  const obj = {
  "Report_Name": "Get_SUP_Master_Status"
}
this.GlobalAPI
    .CommonTaskData2(obj)
    .subscribe((data: any) => {
      this.StatusList = data.length ? data : [];
});
  }
  GetAllData(){
  const TempObj = {
    Followup_ID : this.Param_Flag
  }
  const obj = {
    "SP_String": "SUP_Call_Sheet",
    "Report_Name_String": "Get_Support_Tkt_Details",
    "Json_Param_String": JSON.stringify([TempObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.allData = data;
    this.ObjsupportTkt.Customer_Name = data[0].Customer_Name;
    this.ObjsupportTkt.Customer_Email = data[0].Customer_Email;
    this.ObjsupportTkt.Address = data[0].Address;
    this.ObjsupportTkt.Customer_Contact_No = data[0].Customer_Mobile;
    this.ObjsupportTkt.Problem_Brief_Description = data[0].Problem_Brief_Description;
    this.ObjsupportTkt.Product_Serial_No_Original = data[0].Product_Serial_No;
    this.ObjsupportTkt.Support_Type = data[0].Support_Type;
    this.ObjsupportTkt.Call_Recieved_By = data[0].Call_Recieved_By;
    this.ObjsupportTkt.Call_Sheet_Date = new Date(data[0].Request_Date);
    this.ObjsupportTkt.Support_Loation = data[0].Support_Loation;
    this.ObjsupportTkt.Product_Name = data[0].Product_Name;
    this.ObjsupportTkt.Sup_Ticket_ID = data[0].Sup_Ticket_ID;
    this.ObjsupportTkt.Posted_By_Name = this.$CompacctAPI.CompacctCookies.Name;
    this.ObjsupportTkt.Support_Charge_Type = data[0].Support_Charge_Type;
    this.ObjsupportTkt.Symptom = data[0].Symptom;
    this.ObjsupportTkt.Customar_Representative_Name = data[0].Contact_Peson_Name;
    this.ObjsupportTkt.Product_Serial_No_Found = data[0].Product_Serial_No;
    this.tabIndexToView = 1;
    })
  }
  GetAllDataView(id){
    const TempObj = {
      Followup_ID : id
    }
    const obj = {
      "SP_String": "SUP_Call_Sheet",
      "Report_Name_String": "Get_Support_Tkt_Details",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.allData = data;
      this.ObjsupportTkt.Customer_Name = data[0].Customer_Name;
      this.ObjsupportTkt.Customer_Email = data[0].Customer_Email;
      this.ObjsupportTkt.Address = data[0].Address;
      this.ObjsupportTkt.Customer_Contact_No = data[0].Customer_Mobile;
      this.ObjsupportTkt.Problem_Brief_Description = data[0].Problem_Brief_Description;
      this.ObjsupportTkt.Product_Serial_No_Original = data[0].Product_Serial_No;
      this.ObjsupportTkt.Support_Type = data[0].Support_Type;
      this.ObjsupportTkt.Call_Recieved_By = data[0].Call_Recieved_By;
      this.ObjsupportTkt.Call_Sheet_Date = new Date(data[0].Request_Date);
      this.ObjsupportTkt.Support_Loation = data[0].Support_Loation;
      this.ObjsupportTkt.Product_Name = data[0].Product_Name;
      this.ObjsupportTkt.Sup_Ticket_ID = data[0].Sup_Ticket_ID;
      this.ObjsupportTkt.Posted_By_Name = this.$CompacctAPI.CompacctCookies.Name;
      this.ObjsupportTkt.Support_Charge_Type = data[0].Support_Charge_Type;
      this.ObjsupportTkt.Symptom = data[0].Symptom;
      this.ObjsupportTkt.Customar_Representative_Name = data[0].Contact_Peson_Name;
      this.ObjsupportTkt.Product_Serial_No_Found = data[0].Product_Serial_No;
      })
  }

  // FUNC
  totalAmt(){
    if(this.serviceCharge && this.otherCharge){
      this.totalCharge = Number(this.serviceCharge) + Number(this.otherCharge);
    }
   }
  addReplaced(valid){
    this.SparesFormSubmitted = true;
    if(valid){
      this.Replacedlist.push({
        'Replaced_Spare' : this.ObjsupportTkt.Replaced_Spare,
        'Spare_Slno' : this.ObjsupportTkt.Spare_Slno,
        'Old_Spare' : this.ObjsupportTkt.Old_Spare

      })
      this.ObjsupportTkt.Replaced_Spare = undefined,
      this.ObjsupportTkt.Spare_Slno = undefined,
      this.ObjsupportTkt.Old_Spare = undefined
      this.SparesFormSubmitted = false;
    }

  }
  delectReplaced(index){
  this.Replacedlist.splice(index,1)
  }
  OurCompany(event){
    if(event){
      this.frnVal2 = false;
    }

  }
  OtherCompany(event){
    if(event){
      this.frnVal = false;
    }
  }

  // SAVE
  saveCallSheet(valid,Valid2){
    this.SupporttktFormSubmitted = true;
    if(valid && Valid2){
      let saveObj = {}
      this.ObjsupportTkt.Consuable_User_By = this.ObjsupportTkt.Consuable_User_By === "Our Company" ? "Our Company" : this.ObjsupportTkt.Company_Name;
      if(this.Replacedlist.length) {
        this.Replacedlist.forEach(ele => {
          saveObj = {
            Sup_Ticket_ID : this.ObjsupportTkt.Sup_Ticket_ID,
            Product_Serial_No_Original : this.ObjsupportTkt.Product_Serial_No_Original,
            Product_Serial_No_Found	: this.ObjsupportTkt.Product_Serial_No_Found,
            Problem_Found	: this.ObjsupportTkt.Problem_Found,
            Resolution : this.ObjsupportTkt.Resolution,
            Consuable_User_By :this.ObjsupportTkt.Consuable_User_By,
            Time_Spend : this.ObjsupportTkt.Time_Spend,
            Customer_Name : this.ObjsupportTkt.Customer_Name,
            Customer_Contact_No	 : this.ObjsupportTkt.Customer_Contact_No,
            Customer_Email : this.ObjsupportTkt.Customer_Email,
            Customer_Remarks : this.ObjsupportTkt.Customer_Remarks,
            Customer_Signature_Image :	"NA",
            Status_ID	 :  this.ObjsupportTkt.Status_ID,
            Created_By:  this.$CompacctAPI.CompacctCookies.User_ID ,
            Followup_ID	:  this.Param_Flag,
            Sent_To	 :  this.ObjsupportTkt.Sent_To,
            Service_Charge	: this.serviceCharge,
            Additional_Charge	: this.otherCharge,
            Total_Charge : this.totalCharge,
            Spare_Parts_Name :ele.Replaced_Spare,
            Spare_Parts_Sl_No : ele.Spare_Slno,
            Spare_Parks_Replace_Sl_No : ele.Old_Spare,
            Test_Print_Out : this.ObjsupportTkt.Test_Print_Out,
            Printing_Counter : this.ObjsupportTkt.Printing_Counter
          };
        });
      } else {
        saveObj = {
          Sup_Ticket_ID : this.ObjsupportTkt.Sup_Ticket_ID,
          Product_Serial_No_Original : this.ObjsupportTkt.Product_Serial_No_Original,
          Product_Serial_No_Found	: this.ObjsupportTkt.Product_Serial_No_Found,
          Problem_Found	: this.ObjsupportTkt.Problem_Found,
          Resolution : this.ObjsupportTkt.Resolution,
          Consuable_User_By :this.ObjsupportTkt.Consuable_User_By,
          Time_Spend : this.ObjsupportTkt.Time_Spend,
          Customer_Name : this.ObjsupportTkt.Customer_Name,
          Customer_Contact_No	 : this.ObjsupportTkt.Customer_Contact_No,
          Customer_Email : this.ObjsupportTkt.Customer_Email,
          Customer_Remarks : this.ObjsupportTkt.Customer_Remarks,
          Customer_Signature_Image :	"NA",
          Status_ID	 :  this.ObjsupportTkt.Status_ID,
          Created_By:  this.$CompacctAPI.CompacctCookies.User_ID ,
          Followup_ID	:  this.Param_Flag,
          Sent_To	 :  this.ObjsupportTkt.Sent_To,
          Service_Charge	: this.serviceCharge,
          Additional_Charge	: this.otherCharge,
          Total_Charge : this.totalCharge,
          Spare_Parts_Name :'',
          Spare_Parts_Sl_No : '',
          Spare_Parks_Replace_Sl_No :'',
          Test_Print_Out : this.ObjsupportTkt.Test_Print_Out,
          Printing_Counter : this.ObjsupportTkt.Printing_Counter
        };
      }

      console.log("SaveData",saveObj)
      const obj = {
        "SP_String": "SUP_Call_Sheet",
        "Report_Name_String": "Create_Support_Call_Sheet",
        "Json_1_String": JSON.stringify([saveObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("data",data);
        if (data[0].Column1){
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Call Sheet Added",
          detail: "Succesfully Created"
        });
        this.clearData();
        this.GetAllData();
        }
        else{
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


  }

  // SEARCH
  getPendingDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.Objsearch.start_date = dateRangeObj[0];
      this.Objsearch.end_date = dateRangeObj[1];
    }
  }
  Getsearchdata(){
    this.seachSpinner = true;
    const start = this.Objsearch.start_date
          ? this.DateService.dateConvert(new Date(this.Objsearch.start_date))
          : this.DateService.dateConvert(new Date());
        const end = this.Objsearch.end_date
          ? this.DateService.dateConvert(new Date(this.Objsearch.end_date ))
          : this.DateService.dateConvert(new Date());
    const tempObj ={
      Start_Date : start,
      End_Date : end
    }
    const obj = {
      "SP_String": "SUP_Call_Sheet",
      "Report_Name_String": "Browse_Support_Call_Sheet",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.searchList = data;
        this.seachSpinner = false;
    })
  }

  // VIEW
  viewcallSheet(col){
    console.log("viewData",col);
    const tempObj ={
      Sup_Call_Sheet_ID : col.Sup_Call_Sheet_ID,
    }
    const obj = {
      "SP_String": "SUP_Call_Sheet",
      "Report_Name_String": "Get_Support_Call_Sheet_Main",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.viewList= data;
      this.ObjviewcallSheet = data[0];
      console.log(this.ObjviewcallSheet)
      this.ObjsupportTkt.Call_Sheet_Date = new Date(data[0].Call_Sheet_Date);
      if(this.viewList.length){
        this.display = true;
      }
      this.GetAllDataView(this.ObjviewcallSheet.Followup_ID)
      console.log("Objview Data",this.ObjviewcallSheet);
    })
    this.viewReplaced(col.Sup_Call_Sheet_ID);
  }
  viewReplaced(Sup_Call_Sheet_ID){
    const tempObj ={
      Sup_Call_Sheet_ID : Sup_Call_Sheet_ID,
    }
    const obj = {
      "SP_String": "SUP_Call_Sheet",
      "Report_Name_String": "Get_Support_Call_Sheet_Parts",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.PartsList = data;
      console.log("this.PartsList",this.PartsList);
    })

  }
}

class supportTkt {
Sup_Ticket_ID	:any;
Call_Sheet_Date	:any;
Product_Serial_No_Original :any;
Product_Serial_No_Found : any;
Problem_Found	:any;
Resolution:any;
Consuable_User_By	:any;
Time_Spend:any;
Customer_Name	 :any;
Customer_Contact_No	 :any;
Customer_Email	:any;
Customer_Remarks	:any;
Customer_Signature_Image:any;
Status_ID	 :any;
Created_By:any;
Created_On:any;
Followup_ID	  :any;
Sent_To	 :any;
Service_Charge	:any;
Additional_Charge	: any;
Total_Charge:any;
Address : any;
Product_Name : any;
Support_Type : any;
Call_Recieved_By : any;
Support_Loation : any;
Replaced_Spare : any;
Spare_Slno : any;
Old_Spare : any;
Support_Type_ID : any;
Problem_Brief_Description : any;
Posted_By_Name : any;
Support_Charge_Type : any;
Symptom : any;
Printing_Counter : any;
Customar_Representative_Name : any;
Company_Name : any;
Test_Print_Out : any;
}
class searchObj {
  start_date : string;
  end_date : string;
}
class viewcallSheet {
Additional_Charge:any;
Call_Sheet_Date: any;
Consuable_User_By: any;
Created_By: any;
Created_On: any;
Customer_Contact_No: any;
Customer_Email: any;
Customer_Name: any;
Customer_Remarks: any;
Customer_Signature_Image: any;
Followup_ID: any;
Printing_Counter: any;
Problem_Found: any;
Product_Serial_No_Found: any;
Product_Serial_No_Original: any;
Resolution: any;
Sent_To: any;
Service_Charge: any;
Status_ID: any;
Sup_Ticket_ID: any;
Test_Print_Out: any;
Time_Spend: any;
Total_Charge: any;
Status:any;
Sent_To_Name:any;

}
