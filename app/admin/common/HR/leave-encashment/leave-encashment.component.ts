import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-leave-encashment',
  templateUrl: './leave-encashment.component.html',
  styleUrls: ['./leave-encashment.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None

})
export class LeaveEncashmentComponent implements OnInit {
  hr_Year_List: any = [];
  selected_Year: any = undefined;
  searchSpinner: boolean = false;
  Spinner: boolean = false;
  SerachFormSubmitted: boolean = false;
  tableData: any = [];
  tableDataHeader: any = [];
  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Leave Encashment",
      Link: "JOH HR --> Leave Encashmentr"
    });
    this.getLeavePeriod();
  }

  getLeavePeriod() {
    const obj = {
      "SP_String": "SP_Leave_Encashment",
      "Report_Name_String": "Get_HR_Year_List",
    }
    this.GlobalAPI.postData(obj).subscribe((data) => {
      // console.log('year list', data);
      if (data.length) {
        data.forEach((ele: any) => {
          this.hr_Year_List.push({
            "label": ele.HR_Year_Name,
            "value": ele.HR_Year_ID
          })
        })
      }
    });
  }

  changeYear() {
    this.tableData = [];
  }

  SearchData() {
    this.SerachFormSubmitted = true;
    if (this.selected_Year) {
      this.SerachFormSubmitted = false;
      this.searchSpinner = true;
      const obj = {
        "SP_String": "SP_Leave_Encashment",
        "Report_Name_String": "Show_Encashment_Balance",
        "Json_Param_String": JSON.stringify([{ "HR_Year_ID": this.selected_Year }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        this.searchSpinner = false;
        // console.log('search data', data);
        this.tableData = data;
        if (data.length) {
          this.tableDataHeader = Object.keys(data[0]);
        }
      });
    }
  }

  SaveData() {
    if (this.tableData.length) {
      this.Spinner = true;
      this.tableData.forEach((ele: any) => {
        ele.Encashment = Number(ele.Encashment);
        ele.next_year_opening = Number(ele.next_year_opening);
        ele['HR_Year_ID'] = Number(this.selected_Year);
      })
      // console.log('save data', this.tableData);
      const obj = {
        "SP_String": "SP_Leave_Encashment",
        "Report_Name_String": "Save_Encashment_Balance",
        "Json_Param_String": JSON.stringify(this.tableData)
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('save response', data);
        this.Spinner = false;
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
