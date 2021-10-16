import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
declare var $:any;

@Component({
  selector: 'app-tuto-school-request-details',
  templateUrl: './tuto-school-request-details.component.html',
  styleUrls: ['./tuto-school-request-details.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoSchoolRequestDetailsComponent implements OnInit {
  addSchool = [];
  RequestID = undefined;
  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "School Add Request",
      Link: "CRM -> Master ->  School Add Request"
    });
    this.getdataAll();
  }
  getdataAll(){
    const obj = {
      "SP_String": "SP_Tutopia_School_Add",
      "Report_Name_String": "GET_School_Request"
    }
    this.GlobalAPI.CommonPostData(obj,'/Tutopia_Call_Common_SP_For_All')
      .subscribe((data: any) => {
       console.log(data);
       this.addSchool = data;
      });
  }
  onReject(){    
    this.compacctToast.clear("c");
  }

// update(col){
//   const tempobj = {
//     Request_ID : col.Request_ID,
//     User_ID  : this.$CompacctAPI.CompacctCookies.User_ID
//   }
//   const obj = {
//     "SP_String": "SP_Tutopia_School_Add",
//     "Report_Name_String": "GET_School_Request",
//     "Json_Param_String" : JSON.stringify([tempobj])
//   }
//   this.GlobalAPI.CommonPostData(obj,'/Tutopia_Call_Common_SP_For_All')
//     .subscribe((data: any) => {
//      console.log(data);
//      this.addSchool = data;
//     });
//   }

update(col){
this.RequestID = undefined;
if(col.Request_ID){
  this.RequestID = col.Request_ID;
  this.compacctToast.clear();
  this.compacctToast.add({
    key: "c",
    sticky: true,
    severity: "warn",
    summary: "School Information Update",
    detail: "Confirm to proceed"
    });
}
}
onConfirm(){
    const tempobj = {
        Request_ID : this.RequestID,
        User_ID  : this.$CompacctAPI.CompacctCookies.User_ID
      }
      const obj = {
        "SP_String": "SP_Tutopia_School_Add",
        "Report_Name_String": "Update_School_Request",
        "Json_Param_String" : JSON.stringify([tempobj])
      }
      this.GlobalAPI.CommonPostData(obj,'/Tutopia_Call_Common_SP_For_All')
        .subscribe((data: any) => {
          if(data[0].message) {
            this.getdataAll();
            this.onReject();
          }
        });
}
}
