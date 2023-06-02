import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-consultancy-payment',
  templateUrl: './consultancy-payment.component.html',
  styleUrls: ['./consultancy-payment.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ConsultancyPaymentComponent implements OnInit {
  tabIndexToView = 0;
  items:any = [];
  buttonname : any= "Create";

  allDetalis: any=[];
  allDetalisHeader: any=[];

  Spinner: boolean=false;
  PaymentFormSubmitted: boolean=false;
  CandidateId: any=undefined;

  CandidateList: any=[];
  positionList: any=[];
  PaymentStatusList: any=[];

  Invoice_Date: Date = new Date();
  Joining_Date: Date = new Date();
  Payment_Date: Date = new Date();

  objPayment = new Payment();
  Referencelist:any = [];
  Consultancylist:any = [];
  emplist:any = [];
  editlist:any = [];
  SL_No: any;
  constructor(
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Consultancy Payment",
      Link: "HR -> Consultancy Payment"
    });
    this.items = ["BROWSE", "CREATE"];
    this.PaymentStatusList=['Paid','Pending'];
    this.GetCandidate();
    this.GetDesignation();
    this.getReferenceBy();
    this.getConsultancy();
    this.getConsultancyEmp();
    this.GetBrowse();
  }

  TabClick(e:any) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }

  clearData(){
    this.Spinner=false;
    this.PaymentFormSubmitted=false;
    this.CandidateId=undefined;
    this.SL_No = undefined;

    this.Invoice_Date = new Date();
    this.Joining_Date = new Date();
    this.Payment_Date = new Date();

    this.objPayment=new Payment();
  }

  GetCandidate(){
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
        this.CandidateList = data;
      }
      else {
        this.CandidateList = [];
      }
     })
    // const obj = {
    //   "SP_String": "SP_HR_Txn_Consultancy_Payment",
    //   "Report_Name_String": "Get_Candidate_List"
    // }
    // this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //   // console.log("Get_Candidate_List",data);
    //   if(data.length) {
    //       data.forEach(element => {
    //         element['label'] = element.Name,
    //         element['value'] = element.Candidate_ID
    //       });
    //     this.CandidateList = data;
    //   }
    // });
  } 

  GetDesignation(){
    const obj = {
      "SP_String": "SP_HR_Txn_Consultancy_Payment",
      "Report_Name_String": "Get_Designation_List"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("Get_Designation_List",data);
      if(data.length) {
          data.forEach(element => {
            element['label'] = element.Designation,
            element['value'] = element.Desig_ID
          });
        this.positionList = data;
      }
    });
  }
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
  changeclearobj(){
    this.objPayment.Reference_Details_ID = undefined;
    this.objPayment.Reference_Details = undefined;
  }

  GetBrowse(){
    const obj = {
      "SP_String": "SP_HR_Txn_Consultancy_Payment",
      "Report_Name_String": "Browse_HR_Txn_Consultancy_Payment"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log("Browse Data",data);
      this.allDetalis = data;
      if (this.allDetalis.length) {
        this.allDetalisHeader = Object.keys(data[0]);
      }
    });
  }

  SaveData(valid:any){
    this.PaymentFormSubmitted=true;
    // console.log('PaymentFormSubmitted',valid);
    if(valid){
      this.Spinner = true;
      let meg  = "";
      let reportName = "";

      const tempFilterUser = this.CandidateList.filter((el:any)=>Number(el.Emp_ID) === Number(this.objPayment.Candidate_ID));
      const referenceName = this.Referencelist.filter((ele:any)=>Number(ele.Reference_ID) === Number(this.objPayment.Reference_ID));

      this.objPayment.Candidate_Name= tempFilterUser.length ? tempFilterUser[0].NAME : undefined;
      this.objPayment.Created_By=Number(this.$CompacctAPI.CompacctCookies.User_ID);
      this.objPayment.Joining_Date=this.DateService.dateConvert(this.Joining_Date);
      this.objPayment.Invoice_Date=this.DateService.dateConvert(this.Invoice_Date);
      this.objPayment.Payment_Date=this.DateService.dateConvert(this.Payment_Date);
      this.objPayment.Reference_Name=referenceName.length ? referenceName[0].Reference_Name : undefined;

      if(this.SL_No){
        meg = "Update"
        reportName = "Update_HR_Txn_Consultancy_Payment"
      }
      else{
        meg = "Save"
        reportName = "Save_HR_Txn_Consultancy_Payment"
      }

      // console.log("JSON Data",this.objPayment);

      const Obj = {
        "SP_String":"SP_HR_Txn_Consultancy_Payment",
        "Report_Name_String": reportName,
        "Json_Param_String": JSON.stringify([this.objPayment])
      }

      this.GlobalAPI.postData(Obj).subscribe((data: any) => {
        // console.log("save data",data);
        if (data[0].Column1 == 'Done') {
          this.clearData();
          this.GetBrowse();
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          this.buttonname = "Create";
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Consultancy Payment ",
            detail: "Succesfully "+meg
            });
        }
        else{
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      });

    }
  }

  EditData(col:any){
    this.clearData();
    if(col.Candidate_ID && col.SL_No){
      this.SL_No = col.SL_No;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.getedit(col.Candidate_ID , col.SL_No);
     }
  }
  getedit(canid,slno){
    this.editlist = [];
    const obj = {
      "SP_String": "SP_HR_Txn_Consultancy_Payment",
      "Report_Name_String": "Get_HR_Txn_Consultancy_Payment",
      "Json_Param_String": JSON.stringify([{SL_No : slno , Candidate_ID : canid }])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editlist = data;
      this.objPayment= data[0];
      this.Joining_Date=new Date(data[0].Joining_Date);
      this.Invoice_Date=new Date(data[0].Invoice_Date);
      this.Payment_Date=new Date(data[0].Payment_Date);
    })
   }

  onConfirm(){

  }

  onReject(){
    this.compacctToast.clear("c");
  }

}

class Payment{
  Candidate_ID: any;
  Candidate_Name: any;
  Design_ID: any;
  Joining_Date: any;

  Number_Of_Days: any;
  Salary_Offered: any;
  Bill_Amount: any;

  Invoice_No: any;
  Invoice_Date: any;
  Payment_Status: any;
  Payment_Date: any;

  NEFT_Number: any;

  Created_By: any;
  Remarks:any;
  Reference_ID:any;
  Reference_Name:any;
  Reference_Details_ID:any;
  Reference_Details:any;
}


