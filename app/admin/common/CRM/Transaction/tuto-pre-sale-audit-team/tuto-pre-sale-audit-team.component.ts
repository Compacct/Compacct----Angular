import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-tuto-pre-sale-audit-team',
  templateUrl: './tuto-pre-sale-audit-team.component.html',
  styleUrls: ['./tuto-pre-sale-audit-team.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoPreSaleAuditTeamComponent implements OnInit {
  tabIndexToView =0;
  seachSpinner = false;
  ObjTeamHead : TeamHead = new TeamHead ();
  TeamHeadSearchFormSubmitted = false;
  TeamHeadlist = [];
  Showlist = [];
  CreateUserPopup = false;
  ObjCreateUser : CreateUser = new CreateUser ();
  CreateUserFormSubmitted = false;
  ObjConvertUserToDemo : ConvertUserToDemo = new ConvertUserToDemo ();
  ConvertUserToDemoFormSubmitted = false;
  ConvertUserToDemoPopup = false;
  userid : number;
  Deactive_popup = false;
  Active_popup = false;

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private router : Router,
    private route: ActivatedRoute,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Pre Sale Audit ",
      Link: " CRM -> Pre Sale Audit "
    });
    this.GetTeamHead();
    // this.getdataforexcel();
    // this.GetBrand();
    // this.GetIndentDate();
  }
  TabClick(e){}

  GetTeamHead(){
    const obj = {
      "SP_String": "Tutopia_Pre_Sale_Audit_Team",
      "Report_Name_String": "Get_Pre_Sale_Audit",
     // "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.TeamHeadlist = data;
     console.log("TeamHead list======",this.TeamHeadlist);
   });
  }
  GetWebDemoTeam(valid){
    this.Showlist = [];
    this.TeamHeadSearchFormSubmitted = true;
    const tempobj = {
      Member_ID : this.ObjTeamHead.Member_ID
    }
    if (valid){
    const obj = {
      "SP_String": "Tutopia_Pre_Sale_Audit_Team",
      "Report_Name_String": "Get_Pre_Sale_Audit_Team",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Showlist = data;
       console.log('Search list=====',this.Showlist)
       this.seachSpinner = false;
       this.TeamHeadSearchFormSubmitted = false;
     })
  }
  }
  CreateUser(valid){
    this.TeamHeadSearchFormSubmitted = true;
    console.log(this.TeamHeadSearchFormSubmitted)
    if(valid){
    this.clearData();
    this.CreateUserPopup = true;
    this.TeamHeadSearchFormSubmitted = false;
    }
    
  }
  SaveCreateUser(valid){
    this.CreateUserFormSubmitted = true;
    let tempArr =[];
    const TempObj = {
      Intro_Member_ID : this.ObjTeamHead.Member_ID
    }
    tempArr.push({...TempObj,...this.ObjCreateUser})
  console.log(tempArr)
    if (valid){
    const obj = {
      "SP_String": "Tutopia_Pre_Sale_Audit_Team",
      "Report_Name_String": "Create_User",
      "Json_Param_String": JSON.stringify(tempArr)
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log(data);
      var tempID = data[0].Column1;
      if(data[0].Column1 === "Saved Successfully") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          //summary: "Return_ID  " + tempID,
          detail:  "Succesfully Created"
        });
        //this.Searchlead();
        this.seachSpinner = false;
       //this.TeamHeadSearchFormSubmitted = false;
       this.clearData();
       this.GetWebDemoTeam(true);
      } else{
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
       // this.Spinner = true;
      }
      if (data[0].Column1 === "Already Exists") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "User " + tempID
        });
      }
    })
  }

  console.log(this.ObjCreateUser);
  }

  ConverttoWebDemo(valid){
    this.TeamHeadSearchFormSubmitted = true;
    if(valid){
    this.ConvertUserToDemoFormSubmitted = false;
    this.ObjConvertUserToDemo = new ConvertUserToDemo();
    this.ConvertUserToDemoPopup = true;
    this.TeamHeadSearchFormSubmitted = false;
    }
  }
  SaveConvertUser(valid){
    this.ConvertUserToDemoFormSubmitted = true;
    let tempArr =[];
    const TempObj = {
      Intro_Member_ID : this.ObjTeamHead.Member_ID
    }
    tempArr.push({...TempObj,...this.ObjConvertUserToDemo})
  console.log(tempArr)
    if (valid){
    const obj = {
      "SP_String": "Tutopia_Pre_Sale_Audit_Team",
      "Report_Name_String": "Convert_User",
      "Json_Param_String": JSON.stringify(tempArr)
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log(data);
      var tempID = data[0].Column1;
      if(data[0].Column1 === "Done") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          //summary: "Return_ID  " + tempID,
          detail:  "Succesfully Converted"
        });
        //this.Searchlead();
        this.seachSpinner = false;
        this.ConvertUserToDemoFormSubmitted = false;
        this.ObjConvertUserToDemo = new ConvertUserToDemo();
        this.GetWebDemoTeam(true);
       //this.clearData();
      } else{
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
       // this.Spinner = true;
      }
      if (data[0].Column1 === "Not Exists") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "User " + tempID
        });
      }
    })
  }

  console.log(this.ObjCreateUser);
  }
  Active(row){
     // console.log("requistion_no_gen ===", this.requistion_no_gen)
     this.userid = undefined ;
     this.Deactive_popup = false;
     if(row.User_ID){
     this.Active_popup = true;
     this.userid = row.User_ID ;
     //console.log("User Id ===", this.userid);
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
    //if(this.userid){
      const TempObj ={
        User_ID : this.userid
      }
      const obj = {
        "SP_String": "Tutopia_Web_Demo_Team",
        "Report_Name_String": "Active_Web-Demo_Team",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log("del Data===", data[0].Column1);
        if (data[0].Column1 === "Done"){
          this.onReject();
         // this.getRowData();
         this.Active_popup = false;
        // this.valid = true;
         this.GetWebDemoTeam(true);
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Message",
            detail: "Succesfully Activated"
          });
         }
      })
    //}
}

  Deactive(row){
    // console.log("requistion_no_gen ===", this.requistion_no_gen)
    this.Active_popup = false;
    this.userid = undefined ;
    if(row.User_ID){
    this.Deactive_popup = true;
    this.userid = row.User_ID ;
    //console.log("User Id ===", this.userid);
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
   onReject(){
    this.compacctToast.clear("c");
  }
   onConfirm2(){
      //if(this.userid){
        const TempObj ={
          User_ID : this.userid
        }
        const obj = {
          "SP_String": "Tutopia_Web_Demo_Team",
          "Report_Name_String": "Deactive_Web-Demo_Team",
          "Json_Param_String": JSON.stringify([TempObj])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
           console.log("del Data===", data[0].Column1);
          if (data[0].Column1 === "Done"){
            this.onReject();
           // this.getRowData();
           this.Deactive_popup = false;
          // this.valid = true;
           this.GetWebDemoTeam(true);
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Message",
              detail: "Succesfully Deactivated"
            });
           }
        })
      //}
  }

  clearData(){
    this.ObjCreateUser = new CreateUser();
    this.CreateUserFormSubmitted = false;
  }

}
class TeamHead {
  Member_ID : any;
}
class CreateUser {
  User_Name : string;
  Name : string;
  User_Mobile : number;
  Password : any;
}
class ConvertUserToDemo {
  User_Name : string;
}


