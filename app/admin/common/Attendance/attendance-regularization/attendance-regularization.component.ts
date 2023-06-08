import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-attendance-regularization',
  templateUrl: './attendance-regularization.component.html',
  styleUrls: ['./attendance-regularization.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class AttendanceRegularizationComponent implements OnInit {

  tabIndexToView: number = 0;
  Items: any = ['BROWSE', 'CREATE'];
  Spinner: boolean = false;
  buttonname: string = 'Create';
  AttendenceFormSubmitted:boolean = false;
  apply_Date:Date = new Date();
  employeeList:any = [];
  In_Time:any;

  objAttendence = new Attendence();

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Attendance Regularization",
      Link: "JOH --> Attendance_Regularization"
    });
  }

  TabClick(e: any) {
    this.tabIndexToView = e.index;
  }

  onConfirm() {
  }

  onReject() {
    this.CompacctToast.clear("c");
  }

}

class Attendence {
  Employee_ID:any;
}
