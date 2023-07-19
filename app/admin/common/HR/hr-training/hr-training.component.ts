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
    private commonApi: CompacctCommonApi,
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
  saveData(){}

}
class Training{
  Department_ID: any;
  Emp_ID: any;
  Training_Mode: any;
  Training: any;
  Training_Defard: any;
}
