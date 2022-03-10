import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Data } from '@angular/router';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import {TreeNode} from 'primeng/api';

@Component({
  selector: 'app-user-absent',
  templateUrl: './user-absent.component.html',
  styleUrls: ['./user-absent.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class UserAbsentComponent implements OnInit {
  tabIndexToView =0;
  cu_Date: Date = new Date();
  AbsentFormSubmitted = false;
  userId = undefined;
  userName = "";
  Spinner = false;
  gelAllData:any = [];
  UserIdCol = undefined;
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Absent",
      Link: " CRM -> Absent"
    });
    this.GetBrowse();
  }
  onReject(){    
    this.compacctToast.clear("c");
  }
  onConfirm(){
   if(this.UserIdCol){
        const tempobj = {
          User_ID : this.UserIdCol,
          Dated  : this.DateService.dateConvert(new Date (this.cu_Date)) ? this.DateService.dateConvert(new Date (this.cu_Date)) : this.DateService.dateConvert(new Date ())
        }
        const obj = {
          "SP_String": "SP_Controller",
          "Report_Name_String": "Delete_User_Absent",
          "Json_Param_String" : JSON.stringify([tempobj])
        }
        this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All')
          .subscribe((data: any) => {
           console.log("data",data);
            if(data[0].Column1 === 'done') {
           
            this.compacctToast.clear();
            this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "User Id "+ this.UserIdCol ,
           detail:  "Succesfully Delete"
         });
            this.GetBrowse();
            this.onReject();
            this.UserIdCol = undefined;
           }
        })
      }
  }
  TabClick(e){}
  addAbsent(valid){
    this.AbsentFormSubmitted = true;
    if(valid){
      const tempobj = {
        User_ID : this.userId,
        Dated  : this.DateService.dateConvert(new Date (this.cu_Date)) ? this.DateService.dateConvert(new Date (this.cu_Date)) : this.DateService.dateConvert(new Date ())
      }
      const obj = {
        "SP_String": "SP_Controller",
        "Report_Name_String": "Add_User_Absent",
        "Json_Param_String" : JSON.stringify([tempobj])
      }
      this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All')
        .subscribe((data: any) => {
          console.log("data",data);
          if(data[0].Column1 === 'done') {
            this.GetBrowse();
            this.userId = undefined;
            this.userName = "";
             this.cu_Date= new Date();
            this.compacctToast.clear();
             this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail:  "Succesfully Save"
          });
          this.AbsentFormSubmitted = false;
          }
          else{
            this.AbsentFormSubmitted = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
          
        })
    }
  }
  GetBrowse(){
    if(this.cu_Date){
      this.gelAllData = [];
      const tempobj = {
        Dated : this.DateService.dateConvert(new Date (this.cu_Date)) ? this.DateService.dateConvert(new Date (this.cu_Date)) : this.DateService.dateConvert(new Date ())
      }
      const obj = {
        "SP_String": "SP_Controller",
        "Report_Name_String": "Browse_User_Absent",
        "Json_Param_String" : JSON.stringify([tempobj])
      }
      this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All')
        .subscribe((data: any) => {
          this.gelAllData = data ? data : [];
          console.log("data",data);
        })
    }
  }
  delete(index){
   if(index.User_ID){
     this.UserIdCol = undefined;
     this.UserIdCol = index.User_ID
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Are you sure?",
      detail: "Confirm to proceed"
    });
   }
  }
  GetName(){
    if(this.userId){
      this.userName = "";
      const tempobj = {
        User_ID : this.userId
      }
      const obj = {
        "SP_String": "SP_Controller",
        "Report_Name_String": "Get_User_details",
        "Json_Param_String" : JSON.stringify([tempobj])
      }
      this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All')
        .subscribe((data: any) => {
          console.log("name data",data);
          if(data.length){
            this.userName = data[0].Name ? data[0].Name : "";
          }
          else{
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "No Name Found"
            });
          }
        })
    }
    }
   
}
