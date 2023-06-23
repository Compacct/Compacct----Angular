import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-approve-hr-requisition-form',
  templateUrl: './approve-hr-requisition-form.component.html',
  styleUrls: ['./approve-hr-requisition-form.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ApproveHrRequisitionFormComponent implements OnInit {
  tabIndexToView: number = 0;
  Items: any = ['PENDING APPROVAL', 'APPROVED APPROVAL', 'DISAPPROVE APPROVAL'];
  Spinner: boolean = false;
  buttonname: string = 'Create';
  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Approve Hr Requisition Form",
      Link: "JOH --> Approve Hr Requisition Form"
    });
    this.getPendingList();
  }

  getPendingList() {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Requisition_Form",
      "Report_Name_String": "Get_Pending"
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log('pending List', data);

    })
  }

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  onConfirm() {
  }

  onReject() {
    this.CompacctToast.clear("c");
  }

  clearData() {

  }

}
