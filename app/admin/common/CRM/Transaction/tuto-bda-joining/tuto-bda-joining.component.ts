import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BADFAMILY } from 'dns';
import { MessageService } from 'primeng/components/common/messageservice';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tuto-bda-joining',
  templateUrl: './tuto-bda-joining.component.html',
  styleUrls: ['./tuto-bda-joining.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoBdaJoiningComponent implements OnInit {
  ObjBDA = new BDA();
  JoiningDateModel = new Date();
  seachSpinner = false;
  BDAAddFormSubmit = false;

  BDAList= [];

  constructor( private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "BDA Joining",
      Link: "CRM -> BDA Joining"
    });
    this.GetBDAList();
  }
  GetUserName() {
    this.ObjBDA.Name = undefined;
    if(this.ObjBDA.User_ID) {
      const existArr = this.BDAList.filter(obj=> Number(obj.User_ID) == Number(this.ObjBDA.User_ID));
      if(existArr.length) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "User Job Start Date Already Exits."
        });
        this.ObjBDA = new BDA();
        this.JoiningDateModel = new Date();
      } else {
        const obj = {
          "SP_String": "SP_Controller",
          "Report_Name_String": "Get_User_details",
          "Json_Param_String" : JSON.stringify([this.ObjBDA])
        }
        this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All')
          .subscribe((data: any) => {
            console.log(data)
            if(data.length){
              this.ObjBDA.Name = data[0].Name ? data[0].Name : "";
            } else{
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message",
                detail: "No Name Found"
              });
            }
          });
      }
      
    }
  }
  AddBDA(valid) {
    this.BDAAddFormSubmit = true;
    if(valid) {
      this.seachSpinner = true;
      this.ObjBDA.Job_Start_Date = this.DateService.dateConvert(new Date(this.JoiningDateModel));
      const obj = {
        "SP_String": "SP_Controller",
        "Report_Name_String": "Add_User_join",
        "Json_Param_String" : JSON.stringify([this.ObjBDA])
      }
      this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All')
          .subscribe((data: any) => {
              if(data[0].Column1) {
                this.GetBDAList();
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "success",
                  summary: "BDA Creation",
                  detail:  "Succesfully Created."
                });
                this.ObjBDA = new BDA();
                this.JoiningDateModel = new Date();
                this.BDAAddFormSubmit = false;
                this.seachSpinner = false;
              } else{
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "error",
                  summary: "Warn Message",
                  detail: "Error Occured "
                });
                this.seachSpinner = false;
              }
          });

    }
  }
  UpdateJobEnd(obj) {
    if(obj.User_ID && obj.Job_End_Date) {
      obj.Job_End_Date = this.DateService.dateConvert(new Date(obj.Job_End_Date));
      const SP_Obj = {
        "SP_String": "SP_Controller",
        "Report_Name_String": "Update_User_Join_Data",
        "Json_Param_String" : JSON.stringify([obj])
      }
      this.GlobalAPI.CommonPostData(SP_Obj,'Tutopia_Call_Common_SP_For_All')
          .subscribe((data: any) => {
              if(data[0].Column1) {
                this.GetBDAList();
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "success",
                  summary: "BDA Update",
                  detail:  "Succesfully Updated."
                });
                this.seachSpinner = false;
              } else{
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "error",
                  summary: "Warn Message",
                  detail: "Error Occured "
                });
                this.seachSpinner = false;
              }
      });
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "warn",
        summary: "Validation",
        detail: "Enter Job End Date."
      });
    }
  }


  GetBDAList() {
    this.BDAList= [];
    const obj = {
      "SP_String": "SP_Controller",
      "Report_Name_String": "GET_User_Join_Data",
    }
    this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All')
        .subscribe((data: any) => {
          this.BDAList= data;
          console.log(this.BDAList)
        });
  }
}
class BDA {
  User_ID:String;
  Name:string;
  Job_Start_Date:string;
}