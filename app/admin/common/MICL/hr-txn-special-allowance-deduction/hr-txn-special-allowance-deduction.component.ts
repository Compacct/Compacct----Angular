import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { data } from "jquery";
import { Console } from "console";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-hr-txn-special-allowance-deduction',
  templateUrl: './hr-txn-special-allowance-deduction.component.html',
  styleUrls: ['./hr-txn-special-allowance-deduction.component.css'],
  providers:[MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HRTxnSpecialAllowanceDeductionComponent implements OnInit {
  can_popup : any = false;
  act_popup : any = false;
  Save : boolean = false;
  tabIndexToView : any = 0;
  Month_Name : any;
  seachSpinner : any = false;
  AllowanceFormSubmit : any = false;
  objAllowance : Allowance = new Allowance();
  Searchedlist : any = [];
  buttonname : string = 'Save';
  Spinner : any = false;
  AllowanceList : any = [];
  AllAttendanceData : any = [];
  Allowancehead : string = "";
  AllowanceList2 : any = [];
  URLid : any;
  Allowancefilter : any = [];
  AllName : any = [];

  constructor(
    private $http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private route : ActivatedRoute,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService


  ) {
    this.route.queryParams.subscribe(params => {
      this.URLid = params['Allowance_Deduction_ID'];
      console.log("params",this.URLid)
    })
   }

  ngOnInit() {
    this.Header.pushHeader({
      Header:  " Special Allowance/Deduction " ,
      Link: " " 
    });
    this.AllowanceList = ["Canteen", "TDS"];
    const d = new Date();
    let month = d.getMonth() + 1;
    console.log('month',month)
    let year = d.getFullYear();
    this.Month_Name = month < 10 ? year+'-'+0+month : year+'-'+month
    this.getAllowance();
    this.getName();
  }

  onReject(){
    this.compacctToast.clear("c");
  }

  SaveAllowance(){
    
    
      this.Spinner = true;

      this.Save = true;
      //this.Del = false;
     // this.Spinner = true;
      //this.ngxService.start();
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "c",
       sticky: true,
       closable: false,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
     this.Spinner = false;
    

  }

  // getAttendanceData(){
  //   this.AllAttendanceData = [];
  //    var firstDate = this.Month_Name+'-'+'01'
  //   console.log('firstDate', firstDate);
    
  // }

  getAllowance(){
    const obj = {
      "SP_String": "SP_Hr_Txn_Special_Allowance_Deduction ",
      "Report_Name_String": "Get_allow_Deduc_Dropdown",
       
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.AllowanceList2 = data;
      
       
       console.log('AllowanceList2=====',this.AllowanceList2)
      //  let clone = Object.assign({},this.Searchedlist);
      //  console.log('clone',clone);
       //this.seachSpinner = false;
       this.Allowancefilter = this.AllowanceList2.filter((el:any)=> Number(el.Allowance_Deduction_ID) === Number(this.URLid));
       console.log('Allowancefilter', this.Allowancefilter);
       
       this.objAllowance.Allowance_Deduction_ID = this.Allowancefilter.length ? this.Allowancefilter[0].Allowance_Deduction_ID : undefined;
       
     })

  }

  getName(){
    const obj = {
      "SP_String": "SP_Hr_Txn_Special_Allowance_Deduction ",
      "Report_Name_String": "Get_EMP_Data",
       
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.AllName = data;
      
       
       console.log('AllName=====',this.AllName)
      })

  }

  GetSearchedList(valid, type){
    this.AllowanceFormSubmit = true;
    console.log('type',type);
    if(valid){
      const headerfilter = this.AllowanceList2.filter((el:any)=> Number(el.Allowance_Deduction_ID) === Number(type))[0];
      console.log('headerfilter',headerfilter );
      this.Allowancehead = headerfilter.Allowance_Deduction;
      
      var firstDate = this.Month_Name+'-'+'01'
    console.log('firstDate', firstDate);
     
    
    const AtObj = {
      Date : this.DateService.dateConvert(new Date(firstDate)),
      Allowance_Deduction_ID  : this.objAllowance.Allowance_Deduction_ID
    }

    const obj = {
      "SP_String": "SP_Hr_Txn_Special_Allowance_Deduction",
      "Report_Name_String": "Get_allow_Deduc_Data",
       "Json_Param_String": JSON.stringify([AtObj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Searchedlist = data;
      
       
       console.log('Searchedlist=====',this.Searchedlist)
      //  let clone = Object.assign({},this.Searchedlist);
      //  console.log('clone',clone);
       this.seachSpinner = false;
       
     })

    }

  }
  exportoexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }

  onConfirm(){
    let temarr:any = [];
    this.Searchedlist.forEach((item : any)=>
    {
      const tempobj = {
        Emp_ID : item.Emp_ID,
        Emp_Name : item.Emp_Name,
        Remarks : item.Remarks,
        Allowance_Deduction_Value : item.Allowance_Deduction_Value ? item.Allowance_Deduction_Value : 0,
        Allowance_Deduction_ID : this.objAllowance.Allowance_Deduction_ID,
        Created_By : this.commonApi.CompacctCookies.User_ID,
        Date : this.DateService.dateConvert(new Date(item.Date))
      }
      temarr.push(tempobj);

    })
    const obj = {
      "SP_String": "SP_Hr_Txn_Special_Allowance_Deduction",
      "Report_Name_String":"Insert_Data",
      "Json_Param_String": JSON.stringify(temarr) 
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
        summary: "allowance deduction Create Succesfully ",
        detail: "Succesfully Created"
      });
      
      this.clearData();
      
      this.Spinner = false;
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

  onConfirm2(){

  }
  clearData(){
    this.Searchedlist = [];
    this.AllowanceFormSubmit = false;
    //this.objAllowance = new Allowance();
   

  }

}
class Allowance{
  Allowance_Deduction_ID : any;
  Allowance_Deduction : any;
  Allowance_Deduction_Value : any;
  Remarks : any;
}
