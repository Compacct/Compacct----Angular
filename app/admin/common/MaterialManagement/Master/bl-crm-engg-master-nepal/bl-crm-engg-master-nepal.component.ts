import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";

@Component({
  selector: 'app-bl-crm-engg-master-nepal',
  templateUrl: './bl-crm-engg-master-nepal.component.html',
  styleUrls: ['./bl-crm-engg-master-nepal.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BlCrmEnggMasterNepalComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Save";
  Spinner = false;
  items = [];

  ObjEnggMaster = new EnggMaster();
  EnggMasterFormSubmitted = false;
  CoordinatorList = [];
  BrowseList = [];
  EditList = [];
  userid = undefined;
  memberid = undefined;
  deluserid = undefined;
  delmemberid = undefined;
  colms = [];

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "CRM Engineering Master",
      Link: " Engineering CRM -> Master -> CRM Engineering Master"
    });
      this.GetCoordinator();
      this.GetBrowseList();
    // this.GetMaterialType();

    this.colms = [
      { field: 'User_Name', header: 'User Name' },
      { field: 'Name', header: 'Engineer Name' },
      { field: 'User_Email', header: 'Email' },
      { field: 'User_Mobile', header: 'Mobile No' }
    ];
  }
  // Clear & Tab
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData() {
    this.EnggMasterFormSubmitted = false;
    this.Spinner = false;
    this.ObjEnggMaster = new EnggMaster();
    this.GetBrowseList();
    this.EditList = [];
    this.userid = undefined;
    this.memberid = undefined;
    this.deluserid = undefined;
    this.delmemberid = undefined;
  }
  GetCoordinator(){
    const obj = {
      "SP_String": "SP_BL_CRM_Engg_Master_Nepal",
      "Report_Name_String": "Get_Under_Co_Ordinator"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.CoordinatorList = data;
     console.log('CoordinatorList ==', this.CoordinatorList)
  
    });
  }
  SaveEnggMaster(valid){
    this.EnggMasterFormSubmitted = true;
    if(valid && this.userid){
      const Obj = {
        User_ID  : this.userid,
        Member_ID : this.memberid
      }
         const obj = {
           "SP_String": "SP_BL_CRM_Engg_Master_Nepal",
           "Report_Name_String" : "Update_Engg_Master",
           "Json_Param_String": JSON.stringify([{...Obj,...this.ObjEnggMaster}])
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           //var tempID = data[0].Column1;
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Engineer Master",
             detail: "Succesfully Updated" //+ mgs
           });
           this.clearData();
           this.userid = undefined;
           this.memberid = undefined;
           this.tabIndexToView = 0;
           this.items = ["BROWSE", "CREATE"];
          //  this.buttonname = "Save";
            // this.testchips =[];
       
           } else{
            // this.ngxService.stop();
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
        else {
    this.EnggMasterFormSubmitted = true;
    if(valid) {
      const obj = {
        "SP_String": "SP_BL_CRM_Engg_Master_Nepal",
        "Report_Name_String": "Create_Engg_Master",
        "Json_Param_String":  JSON.stringify([this.ObjEnggMaster])
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Engineer Master",
            detail:  "Succesfully Saved"
          });
          this.EnggMasterFormSubmitted = false;
          this.ObjEnggMaster = new EnggMaster();

        } else {
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
  }
  GetBrowseList(){
    const obj = {
      "SP_String": "SP_BL_CRM_Engg_Master_Nepal",
      "Report_Name_String": "Browse_Engg_Master"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.BrowseList = data;
     console.log('BrowseList ==', this.BrowseList)
  
    });
  }
  Edit(edit){
    this.clearData();
    if(edit.User_ID) {
      this.userid = edit.User_ID;
      this.memberid = edit.Member_ID;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      const ObjT = {
        User_ID : edit.User_ID
      }
     const obj = {
       "SP_String": "SP_BL_CRM_Engg_Master_Nepal",
       "Report_Name_String": "Get_Engg_Master_Data",
       "Json_Param_String": JSON.stringify([ObjT])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.EditList = data;
       this.ObjEnggMaster.User_Name = data[0].User_Name;
       this.ObjEnggMaster.Password = data[0].Password;
       //this.ObjEnggMaster.Confirm_Password = data[0].Password;
       this.ObjEnggMaster.Name = data[0].Name;
       this.ObjEnggMaster.Intro_Member_ID = data[0].Intro_Member_ID;
       this.ObjEnggMaster.User_Email = data[0].User_Email;
       this.ObjEnggMaster.User_Mobile = data[0].User_Mobile;
    })
    }
  }
  Delete(del){
    this.deluserid = undefined ;
    this.delmemberid = undefined;
    if(del.User_ID){
    this.deluserid = del.User_ID;
    this.delmemberid = del.Member_ID;
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
  onConfirm(){
    const Tempobj = {
      User_ID : this.deluserid,
      Member_ID : this.delmemberid
    }
    const obj = {
      "SP_String" : "SP_BL_CRM_Engg_Master_Nepal",
      "Report_Name_String" : "Delete_Engg_Master",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log(data);
      if(data[0].Column1 === "Done") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Engineer Master",
          detail:  "Succesfully Delete"
        });
        this.GetBrowseList();
      } else{
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
  onReject(){
    this.compacctToast.clear("c");
  }

}
class EnggMaster{
  User_Name:string;
  Password:string;
  //Confirm_Password:string;
  Name:string;
  Intro_Member_ID:any;
  User_Email:any;
  User_Mobile:any;
}
