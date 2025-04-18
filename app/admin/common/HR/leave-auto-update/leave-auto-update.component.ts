import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-leave-auto-update',
  templateUrl: './leave-auto-update.component.html',
  styleUrls: ['./leave-auto-update.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class LeaveAutoUpdateComponent implements OnInit {
  Month_Name : any;
  SaveSpinner:boolean = false;

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Leave Auto Update",
      Link: "JOH HR --> Leave Auto Update"
    });
    const d = new Date();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    this.Month_Name = month < 10 ? year+'-'+0+month : year+'-'+month
  }
  AutoUpdate(){
    var firstDate = this.Month_Name+'-'+'01'
    const AtObj = {
      Transaction_Date : this.DateService.dateConvert(new Date(firstDate))
    }
    if (this.Month_Name) {
      this.SaveSpinner = true;
    const obj = {
      "SP_String": "sp_leave_auto_update",
      "Report_Name_String": "leave_auto_update",
      "Json_Param_String": JSON.stringify([AtObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.SaveSpinner = false;
        if (data[0].Column1 == 'Done') {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Success",
            detail: "Succesfully Saved"
          });
        }
        else {
          this.SaveSpinner = false;
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Went Wrong"
          });
        }
  })
    }
  }

}
