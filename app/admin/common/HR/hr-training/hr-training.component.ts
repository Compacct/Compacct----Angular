import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { ActivatedRoute } from '@angular/router';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-hr-training',
  templateUrl: './hr-training.component.html',
  styleUrls: ['./hr-training.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HrTrainingComponent implements OnInit {
  items:any = [];
  menuList:any =[];
  AllData:any = [];
  empDataList:any = [];
  hrYeatList:any = [];
  leaveList:any = [];
  menuData:any = [];
  tabIndexToView= 0;
  buttonname = "Create";
  Spinner:Boolean = false;
  ObjTraining:Training = new Training()
  TrainingFormSubmitted:boolean = false;
  DepartmentList:any = [];
  TrainerNamelist:any = [];
  AttendiesNameList:any = [];
  SelectedAttendiesName:any = [];
  StartDate: any;
  EndDate: any;
  TrainingList:any = [];
  TrainingDefardList:any = [];

  constructor(
    private $CompacctAPI: CompacctCommonApi,
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
   
    this.Header.pushHeader({
      Header: "Training",
      Link: "Training"
    })
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.TrainingFormSubmitted = false;
    // this.hrYearList();
  }
  onConfirm(){}
  onReject(){}
  GetDepartment(){
    const obj = {
      "SP_String":"SP_Leave_Application",
      "Report_Name_String":"Get_HR_Year_List"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.DepartmentList = data;
      });
  }
  GetTrainingName(){
     const obj = {
       "SP_String":"SP_Leave_Application",
       "Report_Name_String": "Get_Employee_List",
       "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
     }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data.length){
          data.forEach((ele:any) => {
            ele['label'] = ele.Emp_Name,
            ele['value'] = ele.Emp_ID
          });
        this.TrainerNamelist = data;
      //  var empname = this.empDataList.filter(el=> Number(el.User_ID) === Number(this.$CompacctAPI.CompacctCookies.User_ID))
      //  console.log(empname)
      //  this.ObjHrleave.Emp_ID = empname.length ? empname[0].Emp_ID : undefined;
       console.log("TrainerNamelist==",this.TrainerNamelist);
        } else {
            this.TrainerNamelist = [];
        }
       
       });
  }
  GetAttendiesName(){
    const obj = {
      "SP_String":"SP_Leave_Application",
      "Report_Name_String": "Get_Employee_List",
      "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length){
         data.forEach((ele:any) => {
           ele['label'] = ele.Emp_Name,
           ele['value'] = ele.Emp_ID
         });
       this.AttendiesNameList = data;
     //  var empname = this.empDataList.filter(el=> Number(el.User_ID) === Number(this.$CompacctAPI.CompacctCookies.User_ID))
     //  console.log(empname)
     //  this.ObjHrleave.Emp_ID = empname.length ? empname[0].Emp_ID : undefined;
      // console.log("AttendiesNameList==",this.AttendiesNameList);
       } else {
           this.AttendiesNameList = [];
       }
      
      });
 }
  getDateRangeoftrainingschedule(dateRangeObj) {
    if (dateRangeObj.length) {
      this.StartDate = dateRangeObj[0];
      this.EndDate  = dateRangeObj[1];
    }
    // const tempData = {
    //   StartDate :  this.ObjBrowse.StartDate
    //   ? this.DateService.dateConvert(new Date(this.ObjBrowse.StartDate))
    //   : this.DateService.dateConvert(new Date()),
    //   EndDate : this.ObjBrowse.EndDate
    //   ? this.DateService.dateConvert(new Date(this.ObjBrowse.EndDate))
    //   : this.DateService.dateConvert(new Date())
    // }
  }
  GetTraining(){
    const obj = {
      "SP_String":"SP_Leave_Application",
      "Report_Name_String":"Get_HR_Year_List"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.TrainingList = data;
      });
  }
  saveData(valid){}

}
class Training{
  Department_ID: any;
  Emp_ID: any;
  Training_Mode: any;
  Training: any;
  Learning_Object : any;
  Training_Defard: any;
}
