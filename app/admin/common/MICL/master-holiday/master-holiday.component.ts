import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { ActivatedRoute } from "@angular/router";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-master-holiday',
  templateUrl: './master-holiday.component.html',
  styleUrls: ['./master-holiday.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MasterHolidayComponent implements OnInit {
  tabIndexToView : any = 0;
  buttonname : any= "Create";
  Spinner : any = false;
  can_popup : any = false;
  items : any= [];
  Browselist :any = [];
  act_popup : any= false;
  HolidayFormSubmitted : any= false;
  objHoliday : Holiday = new Holiday();
  objBrowse : Browse = new Browse();
  Holiday_Date = new Date();
  HolidayListAdd : any = [];
  Tabbuttonname : any = "Save";
  HrYearList : any = [];
  LocationList : any = [];
  TabSpinner : any = false;
  seachSpinner : any = false;
  LeaveUrl : any;
  frequency : any = 0;
  BrowseFormSubmitted:boolean = false;
  SelectedLocation:any = [];
  

  constructor(
    private $http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService,
    private route : ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.LeaveUrl = params['Atten_Type_ID'];
      console.log("params",this.LeaveUrl)
    })
   }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Master Holiday",
      Link: " "
    });
    this.getHRYear();
    this.getLocation();
  }

  onReject(){
    this.compacctToast.clear("c");
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
    this.BrowseFormSubmitted = false;
  }

  getHRYear(){
    const obj = {
      "SP_String": "SP_Master_Holiday",
      "Report_Name_String": "Get_HR_Year_List"
      
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.HrYearList = data;
       console.log("HrYearList=", this.HrYearList);
       
     })
  
  }

  getLocation(){
    const obj = {
      "SP_String": "SP_Master_Holiday",
      "Report_Name_String": "Get_Location"
      
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //  this.LocationList = data;
      //  console.log("LocationList=", this.LocationList);
       if(data.length){
        data.forEach(element => {
          element['label'] = element.Location
          element['value'] = element.Location_ID
        });
        this.LocationList = data;
       }
       else {
        this.LocationList = [];
       }
       
     })
  
  }

  GetBrowseList(valid){
    this.seachSpinner = true;
    this.BrowseFormSubmitted = true;
    if(valid) {
    const tempobj = {
      HR_Year_ID : this.objBrowse.HR_Year_ID
    }
    const obj = {
      "SP_String": "SP_Master_Holiday",
      "Report_Name_String": "Browse_Master_Holiday",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Browselist = data;
       this.seachSpinner = false;
       this.BrowseFormSubmitted = false;
       
       console.log('Browselist=====',this.Browselist)
       this.seachSpinner = false;
       
     })
    } else {
      this.seachSpinner = false;
    }

  }
  exportoexcel(fileName){
    const tempobj = {
      HR_Year_ID : this.objBrowse.HR_Year_ID
    }
      const obj = {
        "SP_String": "SP_Master_Holiday",
        "Report_Name_String": "Browse_Master_Holiday_For_Export",
        "Json_Param_String": JSON.stringify([tempobj])
  
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data.length){
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
        XLSX.writeFile(workbook, fileName+'.xlsx');
        }
      })
    }

  AddMasterHoliday(valid:any){
    this.HolidayFormSubmitted = true;
    if(valid){
      this.objHoliday.Holiday_Date = this.DateService.dateConvert(this.Holiday_Date);
      this.objHoliday.Atten_Type_ID = this.LeaveUrl;
      // const LocationFilter = this.LocationList.filter((el:any)=>Number(el.Location_ID) === Number(this.objHoliday.Location_ID));
      const HrYearFilter = this.HrYearList.filter((el:any)=>Number(el.HR_Year_ID) === Number(this.objHoliday.HR_Year_ID));
      
      console.log("objHoliday",this.objHoliday);
      if(this.SelectedLocation.length) {
        this.SelectedLocation.forEach(el => {
      for(let i = 0; i < this.HolidayListAdd.length; i++) {
        if((this.DateService.dateConvert(new Date(this.HolidayListAdd[i].Holiday_Date)) === this.objHoliday.Holiday_Date ) && (Number(this.HolidayListAdd[i].HR_Year_ID) === Number(this.objHoliday.HR_Year_ID)) && (Number(this.HolidayListAdd[i].Location_ID) === Number(el)))
        {
          this.frequency++;
          console.log('HolidayListAdd',this.HolidayListAdd[i].Holiday_Date);
        }
      }
      })
      }
      console.log('objHoliday',this.objHoliday.Holiday_Date);
      console.log(this.frequency);
      if(this.frequency == 0){
        if(this.SelectedLocation.length) {
        this.SelectedLocation.forEach(el => {
          const LocationFilter = this.LocationList.filter((ele:any)=>Number(ele.Location_ID) === Number(el));
      this.HolidayListAdd.push({
        HR_Year_ID : this.objHoliday.HR_Year_ID,
        Leave_Type : this.objHoliday.Leave_Type,
        Location : LocationFilter.length? LocationFilter[0].Location : "-",
        HR_Year_Name : HrYearFilter.length? HrYearFilter[0].HR_Year_Name : "-",
        Purpose : this.objHoliday.Purpose,
        Location_ID : el,
        Holiday_Date : this.objHoliday.Holiday_Date,
        Atten_Type_ID : this.objHoliday.Atten_Type_ID
      });
      
    });
    }
      this.objHoliday = new Holiday();
      this.Holiday_Date = new Date();
      this.SelectedLocation = [];
    }
    else{
      this.compacctToast.clear();
      this.compacctToast.add({
      key: "compacct-toast",
      severity: "error",
      summary: "Error",
      detail: "Same Combination not allow"
    });
    this.frequency = 0;
    
    }
    console.log("HolidayListAdd",this.HolidayListAdd);
    this.HolidayFormSubmitted = false;
  }
}

 
  MasterHolidaySave(){
    const obj = {
      "SP_String": "SP_Master_Holiday",
      "Report_Name_String":"Save_Master_Holiday",
      "Json_Param_String": JSON.stringify(this.HolidayListAdd) 
     }
     this.GlobalAPI.getData(obj).subscribe((data : any)=>
     {
       console.log('data=',data[0].Column1);
       //if (data[0].Sub_Ledger_ID)
       if(data[0].Column1)
       {
         //this.SubLedgerID = data[0].Column1
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Holiday Create Succesfully ",
        detail: "Succesfully Created"
      });
      //this.getList();
     // this.PaymentRequisitionActionPOPUP = false;
      this.clearData();
      //this.HolidayListAdd = [];
      this.Spinner = false;
      this.tabIndexToView = 0;
       this.items = ["BROWSE", "CREATE"];
      }
      else{
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something Wrong"
      });
      this.clearData();
      this.Spinner = false;
      }
     });
  }

  

  EditHoliday(HR_Year_ID){
    const obj = {
      "SP_String": "SP_Master_Holiday",
      "Report_Name_String":"Get_Master_Holiday",
      "Json_Param_String": JSON.stringify([{ HR_Year_ID: HR_Year_ID}]) 
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log('Data=',data);
        this.HolidayListAdd = data;
        console.log('Edit holiday', this.HolidayListAdd);
        this.tabIndexToView = 1;
        this.items = ["BROWSE", "UPDATE"];
        console.log(this.HolidayListAdd);

  });
  
}

  DeleteSubLedger(col){

  }

  Active(col){

  }

  onConfirm(){

  }

  onConfirm2(){

  }

  Holidaydelete(i){
    this.HolidayListAdd.splice(i,1)
    
  }

  clearData(){
    this.HolidayListAdd = [];
    this.Browselist = [];
    this.Holiday_Date = new Date();
    this.objHoliday = new Holiday();
    this.objBrowse = new Browse();
    this.HolidayFormSubmitted  = false;

  }

}

class Holiday{
  HR_Year_ID : any;
  Leave_Type : any;
  Location : any;
  Purpose : any;
  Location_ID : any;
  Holiday_Date : any;
  Atten_Type_ID : any;
}

class Browse{
  HR_Year : any;
  HR_Year_ID : any;
  
}
