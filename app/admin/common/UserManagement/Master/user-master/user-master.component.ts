import { data } from 'jquery';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service"; 
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class UserMasterComponent implements OnInit {
  items = [];
  menuList=[];
  AllData = [];
  costData=[];
  deptData=[];
  subData=[];
  menuData=[];
  tabIndexToView= 0;
  buttonname = "Create";
  userFormSubmitted = false;
  pass = undefined;
  ObjUser: user = new user ();
  userId : number ;
  Spinner = false;
  can_popup = false;
  act_popup = false;
  masterUserId : number;
  passwordCheck = false;
  Underuser :any =[];
  
  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header: CompacctHeader ,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.GetAllData();
    this.getCostCenter();
    this.getDeptData();
    this.getMenuData();
    this.getUnderUser();
    
  
    this.header.pushHeader({
      Header: "User Master",
      Link: " User Management -> User Master"
    })
   
    
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  GetAllData(){
    const obj = {
      "SP_String":"sp_UR_Master_User",
      "Report_Name_String":"Browse_User_Master"
    }

     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.AllData = data;
      //console.log("all data==",data);
      });
     
   }
   getCostCenter(){
    const obj = {
      "SP_String":"sp_Comm_Controller",
      "Report_Name_String":"Get_Master_Cost_Center_Dropdown"
    }

     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      if(data.length){
        data.forEach(element => {
          element['label'] = element.Cost_Cen_Name,
          element['value'] = element.Cost_Cen_ID								
        });
      //console.log("ProductList  ===",data);
      this.costData = data;  
    }
    else{
      this.costData =[];
    }
      });
   }
   getDeptData(){
    const obj = {
      "SP_String":"sp_Comm_Controller ",
      "Report_Name_String":"Get_Master_Dept_Dropdown"
      
    }

     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.deptData = data;
      //console.log("Dept data==",data);
      });
    }
    getSubDeptData(){
      console.log("this.ObjUser.Dept_ID",this.ObjUser.Dept_ID);
      const obj = {
        "SP_String":"sp_Comm_Controller ",
        "Report_Name_String":"Get_Master_Sub_Dept_Dropdown",
        "Json_Param_String": JSON.stringify([{Dept_ID : this.ObjUser.Dept_ID}])
      }
      this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        this.subData = data;
        //console.log("Sub Dept data==",data);
        });
    }
    getMenuData(){
      const obj = {
        "SP_String":"sp_Comm_Controller ",
        "Report_Name_String":"Get_UR_Txn_Menu_User_Group_Drodown",
      }
      this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        if(data.length){
          data.forEach(element => {
            element['label'] = element.Menu_Ref_Name,
            element['value'] = element.Menu_Ref_ID								
          });
        //console.log("ProductList  ===",data);
        this.menuData = data;  
      }
      else{
        this.menuData =[];
      }
        });
    }
    getUnderUser(){
      const obj = {
        "SP_String":"sp_UR_Master_User",
        "Report_Name_String":"Dropdown_For_Under_User"
      }
  
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        //console.log("data",data)
        if(data.length){
          data.forEach(element => {
            element['label'] = element.Under_User,
            element['value'] = element.Intro_ID								
          });
        //console.log("ProductList  ===",data);
        this.Underuser = data;  
      }
      else{
        this.Underuser =[];
      }
        });
     }
   clearData(){
   this.userFormSubmitted = false;
   this.ObjUser = new user();
   this.userId = undefined;
  }
  EditUser(user:any){
    if (user.User_ID) {
      this.userId = undefined;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.clearData();
      this.userId = user.User_ID
      this.GetEditMasterUser(user.User_ID)
     }  
  }
  GetEditMasterUser(Uid){
    const obj = {
      "SP_String": "sp_UR_Master_User",
      "Report_Name_String":"Get_User_Master",
      "Json_Param_String": JSON.stringify([{User_ID : Uid}]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("data",data);
      this.ObjUser = data[0];
      this.ObjUser.User_Type = data[0].User_Type;
      this.ObjUser.User_Time = data [0].User_Time;
      this.ObjUser.Expiry_Date = data[0].Expiry_Date
      this.pass = data[0].Password;
      this.getSubDeptData();
     })
  }
  DeleteUser(masterUser){
    this.act_popup = false;
    this.masterUserId = undefined ;
    if(masterUser.User_ID){
      this.can_popup = true;
      this.masterUserId = masterUser.User_ID ;
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
  console.log("onconform==",this.ObjUser)
    if(this.masterUserId){
      const obj = {
        "SP_String": "sp_UR_Master_User",
        "Report_Name_String": "Deactive_User_Master",
        "Json_Param_String": JSON.stringify([{User_ID : this.masterUserId}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log("del Data===", data[0].Column1)
        if (data[0].Column1 === "Done"){

          this.onReject();
          this.GetAllData();
         this.can_popup = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "User Id: " + this.masterUserId.toString(),
            detail: "Succesfully Deleted"
          });
         }
      })
    }
   // this.ParamFlaghtml = undefined;
}
onConfirm2(){
  console.log(this.ObjUser.User_ID)
    if(this.masterUserId){
      const obj = {
        "SP_String": "sp_UR_Master_User",
        "Report_Name_String": "Active_User_Master",
        "Json_Param_String": JSON.stringify([{User_ID : this.masterUserId}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log("del Data===", data[0].Column1)
        if (data[0].Column1 === "Done"){
          this.onReject();
          this.GetAllData();
          this.act_popup = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Product Id: " + this.masterUserId.toString(),
            detail: "Succesfully Activated"
          });
        }
      })
    }
    //this.ParamFlaghtml = undefined;
}
Active(masterUser){
  this.can_popup = false;
  this.masterUserId = undefined ;
   if(masterUser.User_ID){
    this.act_popup = true;
     this.masterUserId = masterUser.User_ID ;
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
  saveData(valid:any){
    console.log("savedata==",this.ObjUser);
    this.userFormSubmitted = true;
    if(valid){
      console.log("user Id",this.userId);
      let msg = this.userId ? "Update" : "Create"
      if(this.pass === this.ObjUser.Password){
        this.ObjUser.User_ID = this.userId ? Number(this.userId) : 0;
        this.ObjUser.Cost_Cen_ID = Number(this.ObjUser.Cost_Cen_ID);
        this.ObjUser.Dept_ID = Number(this.ObjUser.Dept_ID);
        this.ObjUser.Sub_Dept_ID = Number(this.ObjUser.Sub_Dept_ID);
        //this.ObjUser.Menu_Ref_ID = Number(this.ObjUser.Menu_Ref_ID);
       // this.ObjUser.User_Time = this.ObjUser.User_Time ?  this.DateService.dateConvert(this.ObjUser.User_Time) : "01/Jan/1990"
       this.ObjUser.Menu_Ref_ID = this.ObjUser.Menu_Ref_ID ? this.ObjUser.Menu_Ref_ID : 0
        const obj = {
          "SP_String": "sp_UR_Master_User",
          "Report_Name_String": this.userId ? 'Update_User_Master' : 'Create_User_Master',
          "Json_Param_String": JSON.stringify([this.ObjUser]) 
         }
         this.GlobalAPI.getData(obj)
         .subscribe((data:any)=>{
          console.log("data ==",data);
          if (data[0].User_ID || data[0].Column1){
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "User Succesfully " +msg,
              detail: "Succesfully " +msg
            });
            }
            this.Spinner = false;
            this.GetAllData();
            this.userId = undefined;
            this.tabIndexToView = 0;
            this.userFormSubmitted = false;
            this.ObjUser = new user();
          });
      }
      else{
        console.error("error password")
      }
        
    }

  }
  
  onReject(){
    this.compacctToast.clear("c");
  }
  passCheck(){
  return this.ObjUser.Password === this.pass ? false : true;
  
  }

} 
class user {
    User_ID:any;
    User_Name:any	;
		Password:any;
		User_Type:any	;
		User_Mobile:any	;
		User_Email:any;
		Cost_Cen_ID: number;
		Dept_ID: number;
		Sub_Dept_ID	:number;
		Del_Right	:any ="N";
		Menu_Ref_ID	: number;
		Name:any;
		Is_Active	:any = "Y";
		API_User_Name	:any;
		User_Pic:any;
		Expiry_Date	:any;
		User_Time:any = "N";
		User_Start_Time:any;
		User_End_Time:any;
		Authorized_Computer:any ="N";
    Intro_ID :any ;
    Apprv_Auth :any = "N";
}