import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service"; 
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
@Component({
  selector: 'app-appraisal-form',
  templateUrl: './appraisal-form.component.html',
  styleUrls: ['./appraisal-form.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class AppraisalFormComponent implements OnInit {
  tabIndexToView: number = 0;
  buttonname: string = "Save";
  items: any = [];
  ObjAppraisal: Appraisal = new Appraisal();
  userFormSubmitted: boolean = false;
  EmplyList: any = [];
  AllData: any = [];
  FilterArey: any = [];
  BrowseSerchDym: any = [];
  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.header.pushHeader({
      Header: "Appraisal Form",
      Link: "HR-> Appraisal Form"
    })
    this.getEMP();
    this.GetAllDataBrowswe();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.userFormSubmitted = false;
  }
  GetAllDataBrowswe() {
    this.AllData = [];
    this.BrowseSerchDym = [];
    const obj = {
      "SP_String":"SP_HR_Txn_Appraisal",
      "Report_Name_String":"Browse_HR_Txn_Appraisal"
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.AllData = data;
       this.BrowseSerchDym = Object.keys(data[0]);
      //console.log("all data==",data);
      }); 
  } 
  getEMP() {
    this.EmplyList = []
    const obj = {
      "SP_String": "SP_HR_Txn_Appraisal",
      "Report_Name_String": "Get_Employee_List"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //console.log("ProductList  ===",data);
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Emp_Name,
          element['value'] = element.Emp_ID
        });
        this.EmplyList = data;
      }
    })
  }
  getCodeAll() {
    this.ObjAppraisal.Emp_Code = "";
    this.ObjAppraisal.DOJ = "";
    this.ObjAppraisal.Designation = "";
    if (this.ObjAppraisal.Emp_ID) {
      this.FilterArey = this.EmplyList.filter((elem: any) => elem.Emp_ID === this.ObjAppraisal.Emp_ID);
        this.ObjAppraisal.Emp_Code = this.FilterArey[0].Emp_Code;
        this.ObjAppraisal.DOJ = this.FilterArey[0].Emp_Joining_Dt; 
        this.ObjAppraisal.Designation = this.FilterArey[0].Designation;
   } 
  }
  saveData(valid: any) {
    this.userFormSubmitted = true;
    if (valid) {
       this.ObjAppraisal.Emp_Name = this.FilterArey[0].Emp_Name
        this.ObjAppraisal.Design_ID = this.FilterArey[0].Desig_ID;
      const obj = {
        "SP_String": "SP_HR_Txn_Appraisal",
        "Report_Name_String": 'Save_HR_Txn_Appraisal',
        "Json_Param_String": JSON.stringify([this.ObjAppraisal])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Appraisal Form ",
            detail: "Succesfully Save"
          });
        }
        this.GetAllDataBrowswe();
        this.tabIndexToView = 0;
        this.FilterArey = [];
        this.userFormSubmitted = false;
        this.ObjAppraisal = new Appraisal();
      });
    }
  }
  onReject() { }
  onConfirm(){}
}
class Appraisal{ 
Emp_ID :any; 	
Emp_Code :any;	
Emp_Name :any;	
Design_ID: any;
Designation: any;	
DOJ :any;	
Review_Period :any;	
Reviewer :any;	
Reporting_Manager :any;
Rating :any;	
Appraisee_Comments :any;	
Appraiser_Remarks :any;	
Reviewer_Remarks :any;	
Last_Annual_CTC :any;	
Revised_Annual_CTC :any;	
Last_In_hand_salary_Mothly :any;	
In_hand_salary_after_increment_Monthly :any;	
		
}
