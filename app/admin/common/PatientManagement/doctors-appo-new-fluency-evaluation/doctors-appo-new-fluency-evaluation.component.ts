import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-doctors-appo-new-fluency-evaluation',
  templateUrl: './doctors-appo-new-fluency-evaluation.component.html',
  styleUrls: ['./doctors-appo-new-fluency-evaluation.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DoctorsAppoNewFluencyEvaluationComponent implements OnInit {
  tabIndexToView:number= 0;
  GenderList:any=[];
  AppoIDvalue:number;
  EditPage:any;
  FLUENCYEVALUATIONFormSubmitted:boolean= false;
  Spinner:boolean=false;
  // buttonname:any='Create';
  buttonname:any='Save';
  Level_1_Status:any=undefined;
  Level_2_Status:any=undefined;
  Level_3_Status:any=undefined;
  patientSearchList:any= [];
  CheckBoxRECOMMENDATION:any=[];
  Appo_Date:any;
  TestName:any='FLUENCY_EVALUATION';
  buttonValid:boolean= true;
  Get_TXN_ID:any;
  EditDataList:any=[];
  CentreList: any= [];

  OralList:any= [];
  PrognosisList:any= [];
  HistoryList:any= [];
  SeverityList:any= [];
  YesNoList:any= [];
  IfYes: boolean= false;

  ObjFLUENCY: FLUENCY = new FLUENCY();
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
      Header: "FLUENCY EVALUATION REPORT",
      Link: " Patient Management -> FLUENCY EVALUATION REPORT"
    });
    this.GenderList=['Male','Female','Other'];
    this.Appo_Date= new Date();
    this.GetAllDataAppoID();
    this.GetCostCentre();
    this.OralList=['Adequate','Inadequate'];
    this.PrognosisList=['Good','Fair','Poor'];
    this.HistoryList=['Gradual','Sudden Onset'];
    this.SeverityList=['Increasing','Decreasing'];
    this.YesNoList= ['Yes','No'];
  }

  GetCostCentre(){
    this.CentreList=[];
    const obj = {
      "SP_String": "sp_JOH_Validation_Processt",
      "Report_Name_String": "Get Cost Center" 
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log("Get Cost Center",data);
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Cost_Cen_Name,
          element['value'] = element.Cost_Cen_ID
        });
       this.CentreList = data;
      }
       else {
        this.CentreList = [];
      }
    });
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
    //  console.log("GetAllDataAppoID",data);
      if(data.length){
        this.patientSearchList=data[0];

        this.ObjFLUENCY.Name=this.patientSearchList.Name;
        this.ObjFLUENCY.Sex=this.patientSearchList.Sex;
        this.ObjFLUENCY.Referredby=this.patientSearchList.Referredby;
        this.ObjFLUENCY.Age=this.patientSearchList.Age;

        this.ObjFLUENCY.Foot_Fall_ID=this.patientSearchList.Foot_Fall_ID;
        this.ObjFLUENCY.Cost_Cen_ID=this.patientSearchList.Cost_Cen_ID;

        this.Appo_Date=this.patientSearchList.Appo_Dt ? this.patientSearchList.Appo_Dt : "-";
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

    const tempSaveJ2 = {
      Appo_ID : this.AppoIDvalue
    }
  //  console.log("tempSaveJ2",tempSaveJ2);

     const tempSaveJ3 = {
      Test_Name : this.TestName
    }
  //  console.log("tempSaveJ3",tempSaveJ3);

    this.ObjFLUENCY.Appo_ID= this.AppoIDvalue;
    this.ObjFLUENCY.Posted_By= this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjFLUENCY.Posted_On= this.DateService.dateConvert(new Date());

    this.ObjFLUENCY.Txn_Date= this.Appo_Date;

    // console.log("ObjFLUENCY",this.ObjFLUENCY);

    this.FLUENCYEVALUATIONFormSubmitted=true;
    if(valid){
      this.Spinner=true;
      const obj = {
        "SP_String": "SP_BL_Txn_Doctor_Appo_ALL",
        "Report_Name_String": "Create_BL_Txn_Doctors_Appo_Test",
        "Json_Param_String": JSON.stringify(this.ObjFLUENCY),
        "Json_1_String": JSON.stringify(tempSaveJ1),
        "Json_2_String": JSON.stringify(tempSaveJ2),
        "Json_3_String": JSON.stringify(tempSaveJ3)
       }
 
       this.GlobalAPI.postData(obj).subscribe((data: any) => {
         // console.log("save data",data);
         // var msg= this.EditPage ?  "update" : "create";
           var msg= "Save";
          if (data[0].Column1){
           this.Spinner=false;
           this.buttonValid = false;
           this.FLUENCYEVALUATIONFormSubmitted=false;
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
    this.CheckBoxRECOMMENDATION= [];
    this.ObjFLUENCY = new FLUENCY();
    this.ShowYes();
    this.GetAllDataAppoID();
  }

  editData(){
    this.CheckBoxRECOMMENDATION=[];
    const TempEditObj={
      Appo_ID: this.AppoIDvalue,
      Test_Name: this.TestName
    }
  // console.log("TempEditObj",TempEditObj);
    // this.buttonname='Edit';
    this.buttonname='Save';
    const Editobj = {
      "SP_String": "SP_BL_Txn_Doctor_Appo_ALL",
      "Report_Name_String": "Retrieve_BL_Txn_Doctor_Appo_ALL_Data_Multiple_Test",
      "Json_Param_String": JSON.stringify(TempEditObj)
    }
    this.GlobalAPI.getData(Editobj).subscribe((data: any) => {
      // console.log("Edit Data",data);

      this.EditDataList= JSON.parse(data[0].Test_Details);  
      // console.log("EditDataList",this.EditDataList);

      this.ObjFLUENCY=  this.EditDataList;
      this.ShowYes();

      this.Get_TXN_ID=data[0].Txn_ID;
      // console.log("check Get_TXN_ID",this.Get_TXN_ID);
      this.editData1(this.Get_TXN_ID);

    });
  }

  editData1(TXN_ID){
    const TempTxnIDObj={
      Txn_ID: TXN_ID,
      Test_Name : this.TestName
    }
    const Recmdobj = {
      "SP_String": "SP_BL_Txn_Doctor_Appo_ALL",
      "Report_Name_String": "Retrieve_BL_Txn_Doctor_Appo_ABR_Recommend_Data",
      "Json_Param_String": JSON.stringify(TempTxnIDObj)
    }
    this.GlobalAPI.getData(Recmdobj).subscribe((data: any) => {
      // console.log("Edit Data2",data);
      let BoxArray:any = [];
      data.forEach((ele:any) => {
        BoxArray.push(ele.Recommend)
      });
    this.CheckBoxRECOMMENDATION= BoxArray;
      // console.log("this.CheckBoxRECOMMENDATION===",this.CheckBoxRECOMMENDATION);
    });
  }

  ShowYes(){
    if(this.ObjFLUENCY.stuttered == 'Yes'){
      this.IfYes=true;
    }
    else{
      this.IfYes=false;
      this.ObjFLUENCY.stuttered_Yes=undefined;
    }
  }

  onConfirm(){
  }

  onReject(){ 
    this.compacctToast.clear("c");  
  }

}


class FLUENCY{
  Name: any;
  Sex: any;
  Referredby:any;
  Age: any;

  Foot_Fall_ID: any;
  Txn_Date: any; 
  Cost_Cen_ID: any;

  Appo_ID: any; 
  Posted_By: any;
  Posted_On: any;

  Language1: any;
  Complaint: any;
  dysfluencies: any;
  onset: any;
  noticed: any;
  circumstances: any;
  severity: any;
  stuttered: any;
  stuttered_Yes: any;
  contact: any;
  By_parents: any;
  By_self: any;
  By_others: any;
  situation: any;
  individuals: any;
  sounds: any;
  structure: any;
  coping_situation: any;
  coping_sounds: any;
  reported_situation: any;
  reported_sounds: any;
  observed_situation: any;
  observed_sounds: any;
  prolongations: any;
  reptations: any;
  hesitations: any;
  blocks: any;
  behaviours: any;
  Structurally_Lips: any;
  Functionally_Lips: any;
  Structurally_Tongue: any;
  Functionally_Tongue: any;
  Structurally_Teeth: any;
  Functionally_Teeth: any;
  Structurally_Hard_Palate: any;
  Functionally_Hard_Palate: any;
  Structurally_Soft_Palate: any;
  Functionally_Soft_Palate: any;
  Structurally_Mandible: any;
  Functionally_Mandible: any;
  Comment: any;
  Findings: any;
  Diagnosis: any;
  Final_Comment: any;
  Prognosis: any;
}
