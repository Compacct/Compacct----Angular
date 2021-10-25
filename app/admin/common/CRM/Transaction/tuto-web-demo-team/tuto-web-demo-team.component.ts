import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-tuto-web-demo-team',
  templateUrl: './tuto-web-demo-team.component.html',
  styleUrls: ['./tuto-web-demo-team.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoWebDemoTeamComponent implements OnInit {
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
      Header: "Web Demo Team ",
      Link: " CRM -> Web Demo Team "
    });
    this.GetTeamHead();
    // this.getdataforexcel();
    // this.GetBrand();
    // this.GetIndentDate();
  }
  TabClick(){}

  GetTeamHead(){
    const obj = {
      "SP_String": "Tutopia_Web_Demo_Team",
      "Report_Name_String": "Get_Web_Demo_Team_Head",
     // "Json_Param_String": JSON.stringify([TempObj])

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.TeamHeadlist = data;
     console.log("TeamHead list======",this.TeamHeadlist);
   });
  }
  GetWebDemoTeam(valid){
    this.TeamHeadSearchFormSubmitted = true;
    const tempobj = {
      Member_ID : this.ObjTeamHead.Member_ID
    }
    if (valid){
    const obj = {
      "SP_String": "Tutopia_Web_Demo_Team",
      "Report_Name_String": "GET_Web-Demo_Team",
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
      "SP_String": "Tutopia_Web_Demo_Team",
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
      "SP_String": "Tutopia_Web_Demo_Team",
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
