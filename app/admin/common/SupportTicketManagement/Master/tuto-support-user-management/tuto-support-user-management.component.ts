import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Data } from '@angular/router';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-tuto-support-user-management',
  templateUrl: './tuto-support-user-management.component.html',
  styleUrls: ['./tuto-support-user-management.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoSupportUserManagementComponent implements OnInit {
  items = [];
  tabIndexToView = 0;
  buttonname = "Create";
  menuList = [];
  Spinner = false;
  manuReferenceList = [];
  SubDepartmentList = [];
  usermamagementFormSubmit = false;
  passComfirm:Boolean = false;
  GetalldataList = [];
  DynamicHeader = [];
  userID = undefined;
  UserDis = false;
  can_popup = false;
  act_popup = false;
  Confirm_Password = undefined;
  Objuser: user = new user();
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
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Support User Management",
      Link: "Support -> User Management"
    })
    this.GetmanuReference();
    this.GetallData();
    this.GetSubDepartment();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  onReject() {
    this.compacctToast.clear("c");
  }
 
  clearData(){
    this.passComfirm = true;
    this.usermamagementFormSubmit = false;
    this.Objuser = new user();
    this.Confirm_Password = undefined;
    this.Spinner = false;
    this.UserDis = false;
    this.userID = undefined;
    this.can_popup = false;
    this.act_popup = false;
  }
  SaveUserManagement(valid){
    this.usermamagementFormSubmit = true;
    if(valid){
      if(this.passwordCheck()){
        const ProductArrValid = this.SubDepartmentList.filter( item => Number(item.Sub_Dept_ID) === Number(this.Objuser.Sub_Dept_ID));
      this.Objuser.Dept_ID = ProductArrValid[0].Dept_ID;
      this.Spinner = true;
      console.log("user Id",this.Objuser.User_ID);
      if(this.Objuser.User_ID){
        console.log("Update");
        const obj = {
          "SP_String": "SP_Support_User_Management",
          "Report_Name_String": "Add_Edit_UR_Master_User",
          "Json_Param_String": JSON.stringify([this.Objuser])      
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          if (data[0].User_ID){
             this.compacctToast.clear();
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "User ID:"  + this.Objuser.User_ID.toString(),
             detail: "Succesfully Update"
           });
           this.GetallData();
           this.tabIndexToView = 0;
           this.items = ["BROWSE", "CREATE"];
           this.buttonname = "Create";
           }
           this.Spinner = false;
           this. clearData();
        })
      }
      else{
        console.log("Save",this.Objuser)
        const obj = {
          "SP_String": "SP_Support_User_Management",
          "Report_Name_String": "Add_Edit_UR_Master_User",
          "Json_Param_String": JSON.stringify([this.Objuser])      
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          const TempId = data[0].Column1;
          if (data[0].Column1){
             this.compacctToast.clear();
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "User ID: " + TempId.toString(),
             detail: "Succesfully Created"
           });
           this.GetallData();
           this.tabIndexToView = 0;
           this.items = ["BROWSE", "CREATE"];
           this.buttonname = "Create";
           }
           this.Spinner = false;
           this. clearData();
        })
      }
      }
      else{
        this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "password and confirm password does not match"
      });
      }
      
    }
    else{
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Something Wrong",
        detail: "Check Your Input Information"
      });
    }
  }
  passwordCheck(){
   // this.passComfirm = false;
   let flag = false;
    if(this.Objuser.Password !== this.Confirm_Password){
     this.passComfirm = true;
     flag = false
     console.log("Notmatch", this.passComfirm )
    
    }
    else{
      this.passComfirm = false;
      flag = true;
      console.log("match", this.passComfirm )
    }
   return flag
  }
  GetmanuReference(){
    const obj = {
      "SP_String": "SP_Support_User_Management",
      "Report_Name_String": "Get Menu Reference",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.manuReferenceList = data;
        console.log("manuReferenceList",this.manuReferenceList);
      })
  }
  GetSubDepartment(){
    const obj = {
      "SP_String": "SP_Support_User_Management",
      "Report_Name_String": "Get Sub Department",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.SubDepartmentList = data;
        console.log("SubDepartmentList",this.SubDepartmentList);
      })
  }

  //BROWSE
  GetallData(){
    const obj = {
      "SP_String": "SP_Support_User_Management",
      "Report_Name_String": "Browse_UR_Master_User",
      "Json_Param_String": JSON.stringify([]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.DynamicHeader = Object.keys(data[0]);
       this.GetalldataList = data;
       console.log("All Data",this.GetalldataList);
     })
  }
  EditUser(col){
    if (col.User_ID) {
      this.UserDis = true;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.clearData();
      this.UserDis = true;
      this.GetEditMaster(col.User_ID);
    }
  }
  GetEditMaster(user_id){
   if(user_id){
    const tempObj = {
      User_ID:user_id
     }
     const obj = {
      "SP_String": "SP_Support_User_Management",
      "Report_Name_String": "Get_Edit_Data_UR_Master_User",
      "Json_Param_String": JSON.stringify([tempObj])      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.GetmanuReference();
     this.GetSubDepartment();
     console.log("save From Api",data);
     // this.Objuser = data[0];
     
      this.Objuser.User_ID = data[0].user_id;
      this.Objuser.Name = data[0].Name;
      this.Objuser.User_Name = data[0].User_Name;
      this.Objuser.Password = data[0].Password
      this.Confirm_Password = this.Objuser.Password;
      this.Objuser.User_Mobile = data[0].User_Mobile;
      this.Objuser.User_Email = data[0].User_Email;
      this.Objuser.User_Type = data[0].User_Type;
      this.Objuser.Dept_ID = data[0].Dept_ID;
      this.Objuser.Sub_Dept_ID = data[0].Sub_Dept_ID;
      this.Objuser.Del_Right = data[0].Del_Right
      this.Objuser.Menu_Ref_ID = data[0].Menu_Ref_ID;
      
     
    })
   }
  }
  DeleteUser(col){
  this.userID = undefined;
  if(col.User_ID){
    this.can_popup = true;
    this.userID = col.User_ID;
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
    if(this.userID){
      const TempObj = {
        User_ID : this.userID
      }
      const obj = {
        "SP_String": "SP_Support_User_Management",
        "Report_Name_String": "Delete_UR_Master_User",
        "Json_Param_String": JSON.stringify([TempObj])      
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if (data[0].Column1 === "Done"){
          this.onReject();
          this.GetallData();
          this.clearData();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Bank Id: " + this.userID.toString(),
            detail: "Succesfully Deleted"
          });
        }
      })

    }
  }
  Active(col){
    if(col.User_ID){
      this.act_popup = true;
      this.userID = col.User_ID;
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
  onConfirm1(){
    if(this.userID){
      const TempObj = {
        User_ID : this.userID
      }
      const obj = {
        "SP_String": "SP_Support_User_Management",
        "Report_Name_String": "Active_UR_Master_User",
        "Json_Param_String": JSON.stringify([TempObj])      
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if (data[0].Column1 === "Done"){
          this.onReject();
          this.GetallData();
          this.clearData();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Bank Id: " + this.userID.toString(),
            detail: "Succesfully Active"
          });
        }
      })

    }
  }

}
class user {
  User_ID : number = 0;
  Name : any;
  User_Name : any;
  Password : any;
  User_Mobile : number;
  User_Email : any;
  User_Type : any;
  Dept_ID : number;
  Sub_Dept_ID : any;
  Del_Right : any = "N";
  Menu_Ref_ID : any;
}