import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-doctors-appointment-new-tinnitus-handicap',
  templateUrl: './doctors-appointment-new-tinnitus-handicap.component.html',
  styleUrls: ['./doctors-appointment-new-tinnitus-handicap.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DoctorsAppointmentNewTinnitusHandicapComponent implements OnInit {
  tabIndexToView:number= 0;
  GenderList:any=[];
  AppoIDvalue:number;
  EditPage:any;
  TinnitusHandicapFormSubmitted:boolean= false;
  Spinner:boolean=false;
  buttonname:any='Create';
  patientSearchList:any= [];
  CheckBoxRECOMMENDATION:any=[];
  TestName:any='Tinnitus_Handicap';
  buttonValid:boolean= true;
  EditDataList:any=[];
  DropdownList: any= [];
  Appo_Date:any;
  Cost_Center:any;

  ObjAppoID: AppoID = new AppoID();
  ObjTinnitusHandicap: TinnitusHandicap = new TinnitusHandicap();

  constructor(
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute
  ) { 
    this.route.queryParams.subscribe(params => {
      // console.log("param",params);
      this.AppoIDvalue= params.Appo_ID;
      // console.log("AppoIDvalue",this.AppoIDvalue);
      this.EditPage=params.ed;
       // console.log("EditPage",this.EditPage);
      if(this.EditPage == 'y'){
          this.editData();
       } 
     })
  }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "TINNITUS HANDICAP INVENTORY (THI)",
      Link: " Patient Management -> TINNITUS HANDICAP INVENTORY (THI)"
    });
    this.GenderList=['Male','Female','Other'];
    this.GetAllDataAppoID();
    this.DropdownList= ['Yes','No','Sometimes'];
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
  }

  GetAllDataAppoID(){
    //console.log("value of",this.AppoIDvalue);
    this.patientSearchList = [];
    const tempobj = {
      Appo_ID : this.AppoIDvalue,
    }
    const obj = {
      "SP_String": "SP_BL_Txn_Doctor_Appo_ABR",
      "Report_Name_String": "Get_All_Data",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // console.log("GetAllDataAppoID",data);
      if(data.length){
        this.patientSearchList=data;

        this.ObjAppoID.Name=this.patientSearchList[0].Name;
        this.ObjAppoID.PatientID=this.patientSearchList[0].Foot_Fall_ID;
        this.ObjAppoID.Sex=this.patientSearchList[0].Sex;
        this.Appo_Date=this.patientSearchList[0].Appo_Dt ? this.patientSearchList[0].Appo_Dt : "-";
        this.Cost_Center=this.patientSearchList[0].Cost_Cen_ID;
      }
    });
  }

  saveDocAppo(valid:any){
      //console.log('CheckBoxRECOMMENDATION value',this.CheckBoxRECOMMENDATION);
      let tempSaveJ1:any= [];
      if(this.CheckBoxRECOMMENDATION.length){
        this.CheckBoxRECOMMENDATION.forEach((ele:any) => {
          tempSaveJ1.push({
            Recommend : ele
        })
        });
      }
      // console.log("tempSaveJ1",tempSaveJ1);

      const TempObj ={
        Foot_Fall_ID: this.ObjAppoID.PatientID,
        Appo_ID: this.AppoIDvalue,
        Txn_Date: this.Appo_Date,
        Cost_Cent_ID: this.Cost_Center,
        Posted_By: this.$CompacctAPI.CompacctCookies.User_ID,
        Posted_On: this.DateService.dateConvert(new Date()),
        concentrate: this.ObjTinnitusHandicap.concentrate,
        loudness: this.ObjTinnitusHandicap.loudness,
        angry: this.ObjTinnitusHandicap.angry,
        confused: this.ObjTinnitusHandicap.confused,
        desperate: this.ObjTinnitusHandicap.desperate,
        complain: this.ObjTinnitusHandicap.complain,
        asleep: this.ObjTinnitusHandicap.asleep,
        escape1: this.ObjTinnitusHandicap.escape1,
        social_activities: this.ObjTinnitusHandicap.social_activities,
        frustrated: this.ObjTinnitusHandicap.frustrated,
        disease: this.ObjTinnitusHandicap.disease,
        life: this.ObjTinnitusHandicap.life,
        household: this.ObjTinnitusHandicap.household,
        irritable: this.ObjTinnitusHandicap.irritable,
        read1: this.ObjTinnitusHandicap.read1,
        upset: this.ObjTinnitusHandicap.upset,
        relationship: this.ObjTinnitusHandicap.relationship,
        focus: this.ObjTinnitusHandicap.focus,
        control1: this.ObjTinnitusHandicap.control1,
        tired: this.ObjTinnitusHandicap.tired,
        depressed: this.ObjTinnitusHandicap.depressed,
        anxious: this.ObjTinnitusHandicap.anxious,
        cope: this.ObjTinnitusHandicap.cope,
        stress: this.ObjTinnitusHandicap.stress,
        insecure: this.ObjTinnitusHandicap.insecure,
        total_score: this.ObjTinnitusHandicap.total_score
      }
        // console.log("TempObj",TempObj);
  
      const tempSaveJ2 = {
        Appo_ID : this.AppoIDvalue
      }
    //  console.log("tempSaveJ2",tempSaveJ2);
  
       const tempSaveJ3 = {
        Test_Name : this.TestName
      }
    //  console.log("tempSaveJ3",tempSaveJ3);

    this.TinnitusHandicapFormSubmitted=true;
    if(valid){
     this.Spinner=true;
     const obj = {
       "SP_String": "SP_BL_Txn_Doctor_Appo_ALL",
       "Report_Name_String": "Create_BL_Txn_Doctors_Appo_Test",
       "Json_Param_String": JSON.stringify(TempObj),
       "Json_1_String": JSON.stringify(tempSaveJ1),
       "Json_2_String": JSON.stringify(tempSaveJ2),
       "Json_3_String": JSON.stringify(tempSaveJ3)
      }

      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log("save data",data);
        var msg= this.EditPage ?  "update" : "create";
         if (data[0].Column1){
          this.Spinner=false;
          this.buttonValid = false;
          this.TinnitusHandicapFormSubmitted=false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Appointment " +msg,
            detail: "Succesfully "
          });
            if(this.EditPage != 'y'){
            this.ClearData();
          }
         }
         else {
           this.Spinner = false;
           this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "error",
             summary: "Warn Message ",
             detail:"Error occured "
           });
         }
       });
    }

  }

  ClearData(){
    this.ObjTinnitusHandicap.concentrate= undefined;
    this.ObjTinnitusHandicap.loudness= undefined;
    this.ObjTinnitusHandicap.angry= undefined;
    this.ObjTinnitusHandicap.confused= undefined;
    this.ObjTinnitusHandicap.desperate= undefined;
    this.ObjTinnitusHandicap.complain= undefined;
    this.ObjTinnitusHandicap.asleep= undefined;
    this.ObjTinnitusHandicap.escape1= undefined;
    this.ObjTinnitusHandicap.social_activities= undefined;
    this.ObjTinnitusHandicap.frustrated= undefined;
    this.ObjTinnitusHandicap.disease= undefined;
    this.ObjTinnitusHandicap.life= undefined;
    this.ObjTinnitusHandicap.household= undefined;
    this.ObjTinnitusHandicap.irritable= undefined;
    this.ObjTinnitusHandicap.read1= undefined;
    this.ObjTinnitusHandicap.upset= undefined;
    this.ObjTinnitusHandicap.relationship= undefined;
    this.ObjTinnitusHandicap.focus= undefined;
    this.ObjTinnitusHandicap.control1= undefined;
    this.ObjTinnitusHandicap.tired= undefined;
    this.ObjTinnitusHandicap.depressed= undefined;
    this.ObjTinnitusHandicap.anxious= undefined;
    this.ObjTinnitusHandicap.cope= undefined;
    this.ObjTinnitusHandicap.stress= undefined;
    this.ObjTinnitusHandicap.insecure= undefined;
    this.ObjTinnitusHandicap.total_score= undefined;
  }

  Calculation(){
      this.ObjTinnitusHandicap.total_score= 0;
      let arrYes:any = [];
      let arrSometimes:any = [];

      this.ObjTinnitusHandicap.concentrate == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.concentrate == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.loudness == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.loudness == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.angry == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.angry == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.confused == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.confused == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.desperate == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.desperate == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.complain == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.complain == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.asleep == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.asleep == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.escape1 == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.escape1 == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.social_activities == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.social_activities == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.frustrated == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.frustrated == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.disease == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.disease == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.life == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.life == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.household == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.household == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.irritable == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.irritable == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.read1 == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.read1 == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.upset == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.upset == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.relationship == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.relationship == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.focus == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.focus == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.control1 == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.control1 == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.tired == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.tired == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.depressed == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.depressed == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.anxious == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.anxious == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.cope == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.cope == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.stress == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.stress == "Sometimes" ? arrSometimes.push("Sometimes") : ""
      this.ObjTinnitusHandicap.insecure == "Yes" ? arrYes.push("Yes") : this.ObjTinnitusHandicap.insecure == "Sometimes" ? arrSometimes.push("Sometimes") : ""

    
      // console.log("arrYes",arrYes); 
      // console.log("arrSometimes",arrSometimes);
      this.ObjTinnitusHandicap.total_score = Number(arrYes.length * 4) + Number(arrSometimes.length * 2); 
  }

  editData(){
    const TempEditObj={
      Appo_ID: this.AppoIDvalue
    }
  // console.log("TempEditObj",TempEditObj);
    this.buttonname='Edit';
    const Editobj = {
      "SP_String": "SP_BL_Txn_Doctor_Appo_ALL",
      "Report_Name_String": "Retrieve_BL_Txn_Doctor_Appo_ALL_Data",
      "Json_Param_String": JSON.stringify(TempEditObj)
    }
    this.GlobalAPI.getData(Editobj).subscribe((data: any) => {
      console.log("Edit Data",data);

      this.EditDataList= JSON.parse(data[0].Test_Details);  
      console.log("EditDataList",this.EditDataList);

      this.ObjTinnitusHandicap= JSON.parse(data[0].Test_Details);

    });
  }

  onConfirm(){
  }

  onReject(){   
  }

}

class AppoID{
  Name: any;
  PatientID: any;
  Sex: any;
}
class TinnitusHandicap{
  concentrate: any;
  loudness: any;
  angry: any;
  confused: any;
  desperate: any;
  complain: any;
  asleep: any;
  escape1: any;
  social_activities: any;
  frustrated: any;
  disease: any;
  life: any;
  household: any;
  irritable: any;
  read1: any;
  upset: any;
  relationship: any;
  focus: any;
  control1: any;
  tired: any;
  depressed: any;
  anxious: any;
  cope: any;
  stress: any;
  insecure: any;
  total_score: any;
}
