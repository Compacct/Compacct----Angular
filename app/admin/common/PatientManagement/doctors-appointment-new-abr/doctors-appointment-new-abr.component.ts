import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { UpdateConsultancyComponent } from '../../../shared/compacct.components/compacct.forms/update-consultancy/update-consultancy.component';


@Component({
  selector: 'app-doctors-appointment-new-abr',
  templateUrl: './doctors-appointment-new-abr.component.html',
  styleUrls: ['./doctors-appointment-new-abr.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class DoctorsAppointmentNewABRComponent implements OnInit {
  tabIndexToView = 0;
  Appo_Date:any;
  CentreList:any=[];
  StimulusList:any=[];
  GenderList:any=[];
  RemarksList:any=[];
  StatusList:any=[];
  Spinner:boolean=false;
  AppoIDvalue:any;
  patientSearchList:any=[];
  checkBoxArray:any=[];
  ProductPDFFile:any=[];
  buttonname = "Create";
  Level_1_Status:any=undefined;
  Level_2_Status:any=undefined;
  Level_3_Status:any=undefined;
  ABR_Submitted:boolean=false;
  EditPage:any;
  Get_TXN_ID:any;
  buttonValid:boolean = true
  ObjABR: ABR = new ABR();

  @ViewChild("consultancy", { static: false }) UpdateConsultancy: UpdateConsultancyComponent;
  constructor(
    private header:CompacctHeader,
    private $http: HttpClient,
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService,
    private route: ActivatedRoute,
    ) { 
    this.route.queryParams.subscribe(params => {
      console.log("param",params);
      this.AppoIDvalue=params.Appo_ID;
      this.EditPage=params.ed;
      console.log("value",this.EditPage);
      if(this.EditPage == 'y'){
        this.editData();
      
      } 

     })
  }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "AUDITORY EVOKED BRAINSTEM RESPONSE",
      Link: " Patient Management -> AUDITORY EVOKED BRAINSTEM RESPONSE"
    });
    this.Appo_Date = new Date();
    this.GenderList=['Male','Female','Other'];
    this.StimulusList=['Clicks','Tone Burst','Chirp'];
    this.RemarksList=['Clear and replicable peak present','No Clear and replicable peak present'];
    this.StatusList=['Test Done but H.A. not required','Test Done H.A. required but Trial Not Taken','Test Done H.A. required and Wiling to Buy'];
    this.GetCostCentre();
    this.GetAllDataAppoID();
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
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
     console.log("GetAllDataAppoID",data);
      if(data.length){
        this.patientSearchList=data;

        this.ObjABR.Name=this.patientSearchList[0].Name;
        this.ObjABR.PatientID=this.patientSearchList[0].Foot_Fall_ID;
        this.ObjABR.Sex=this.patientSearchList[0].Sex;
        this.ObjABR.RefferedBy=this.patientSearchList[0].Referredby;
        this.ObjABR.Age=this.patientSearchList[0].Age;
        this.ObjABR.Centre=this.patientSearchList[0].Cost_Cen_ID;
        this.Appo_Date=this.patientSearchList[0].Appo_Dt ? this.patientSearchList[0].Appo_Dt : "-";
      }
    });
  }

 

  updateConsultancysave(event){
    //console.log('event',event);
    //console.log('event1',event.Level_1_Status);
    this.Level_1_Status=event.Level_1_Status;
    this.Level_2_Status=event.Level_2_Status;
    this.Level_3_Status=event.Level_3_Status;
    //console.log('event1',this.Level_1_Status);
  }

  saveDocAppo(valid:any){
  console.log('checkBox1 value',this.checkBoxArray);
    let tempSaveJ1:any = []
    
    if(this.checkBoxArray.length){
      this.checkBoxArray.forEach((ele:any) => {
        tempSaveJ1.push({
          Recommend : ele
        })
      });
    }
   // console.log("tempSaveJ1",tempSaveJ1);

    const TempObj ={
      Foot_Fall_ID: this.ObjABR.PatientID,
      Appo_ID: this.AppoIDvalue,
      Txn_Date: this.Appo_Date,
      Cost_Center_ID: this.ObjABR.Centre,
      Filter: this.ObjABR.Filter,
      Stimulus: this.ObjABR.Stimulus,
      Repetition_Rate: this.ObjABR.RepetitionRate,
      Pic_Left_Ear_Graph: '',
      Pic_Right_Ear_Graph: '',
      Stimulus_Intensity_1: this.ObjABR.StiInt1,
      Stimulus_Intensity_2: this.ObjABR.StiInt2,
      Stimulus_Intensity_3: '',
      Left_EAR_Laten_1: this.ObjABR.LLaten1,
      Left_EAR_Laten_2: this.ObjABR.LLaten2,
      Left_EAR_Laten_3: '',
      Left_Ampl_1: this.ObjABR.LAmp1,
      Left_Ampl_2: this.ObjABR.LAmp2,
      Left_Ampl_3: '',
      Left_Remarks_1: this.ObjABR.LRemarks1,
      Left_Remarks_2: this.ObjABR.LRemarks2,
      Left_Remarks_3: '',
      Right_EAR_Laten_1: this.ObjABR.RLaten1,
      Right_EAR_Laten_2: this.ObjABR.RLaten2,
      Right_EAR_Laten_3: '',
      Right_Ampl_1: this.ObjABR.RAmp1,
      Right_Ampl_2: this.ObjABR.RAmp2,
      Right_Ampl_3: '',
      Right_Remarks_1: this.ObjABR.RRemarks1,
      Right_Remarks_2: this.ObjABR.RRemarks2,
      Right_Remarks_3: '',
      Right_Ear_Interpretation: this.ObjABR.REar,
      Left_Ear_Interpretation: this.ObjABR.LEar,
      Comment: this.ObjABR.Comment,
      Status: '',
      Posted_By: this.$CompacctAPI.CompacctCookies.User_ID,
      Posted_On: this.DateService.dateConvert(new Date()),
      Recommendation: ''
    }
  //  console.log("TempObj",TempObj);

 
  //    console.log("TempObj2",TempObj2);

    this.ABR_Submitted=true;

    if(valid){
    this.Spinner=true;
    const obj = {
      "SP_String": "SP_BL_Txn_Doctor_Appo_ABR",
      "Report_Name_String": "Create_BL_Txn_Doctor_Appo_ABR",
      "Json_Param_String": JSON.stringify(TempObj),
      "Json_1_String": JSON.stringify(tempSaveJ1)
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
     // console.log("save data",data);
     var msg= this.EditPage ?  "update" : "create";
      if (data[0].Column1){
       this.saveStatus()
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
  saveStatus(){
    const TempObj2={
      Appo_ID: this.AppoIDvalue,
      Level_1_Status: this.Level_1_Status,
      Level_2_Status: this.Level_2_Status,
      Level_3_Status: this.Level_3_Status
    }
    const obj2 = {
      "SP_String": "sp_DoctorsAppointmentNew",
      "Report_Name_String": "Update_Consultancy_Done",
      "Json_Param_String": JSON.stringify(TempObj2),
    }
    this.GlobalAPI.postData(obj2).subscribe((data: any) => {
     // console.log("save data2",data);
     var msg1= this.EditPage ?  "update" : "create";
      if (data[0].Column1){
        this.Spinner=false;
        this.buttonValid = false
        this.ABR_Submitted=false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Appointment " +msg1,
          detail: "Succesfully "
        });
         if(this.EditPage != 'y'){
          this.ClearData();
          this.UpdateConsultancy.clearComData();
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
  editData(){
    this.checkBoxArray = []
   const TempEditObj={
        Appo_ID: this.AppoIDvalue
      }
     // console.log("TempEditObj",TempEditObj);

      this.buttonname="Edit";
      const Editobj = {
          "SP_String": "SP_BL_Txn_Doctor_Appo_ABR",
          "Report_Name_String": "Retrieve_Data",
          "Json_Param_String": JSON.stringify(TempEditObj)
      }

      this.GlobalAPI.getData(Editobj).subscribe((data: any) => {
        console.log("Edit Data",data);
        this.ObjABR.Filter= data[0].Filter;
        this.ObjABR.RepetitionRate=data[0].Repetition_Rate;
        this.ObjABR.Stimulus=data[0].Stimulus;
        this.ObjABR.LRemarks1=data[0].Left_Remarks_1;
        this.ObjABR.LRemarks2=data[0].Left_Remarks_2;
        // this.ObjABR.LRemarks3=data[0].Left_Remarks_3;
        this.ObjABR.RRemarks1=data[0].Right_Remarks_1;
        this.ObjABR.RRemarks2=data[0].Right_Remarks_2;
        // this.ObjABR.RRemarks3=data[0].Right_Remarks_3;
        this.ObjABR.StiInt1=data[0].Stimulus_Intensity_1;
        this.ObjABR.StiInt2=data[0].Stimulus_Intensity_2;
        // this.ObjABR.StiInt3=data[0].Stimulus_Intensity_3;
        this.ObjABR.LLaten1=data[0].Left_EAR_Laten_1;
        this.ObjABR.LLaten2=data[0].Left_EAR_Laten_2;
        // this.ObjABR.LLaten3=data[0].Left_EAR_Laten_3;
        this.ObjABR.LAmp1=data[0].Left_Ampl_1;
        this.ObjABR.LAmp2=data[0].Left_Ampl_2;
        // this.ObjABR.LAmp3=data[0].Left_Ampl_3;
        this.ObjABR.RLaten1=data[0].Right_EAR_Laten_1;
        this.ObjABR.RLaten2=data[0].Right_EAR_Laten_2;
        // this.ObjABR.RLaten3=data[0].Right_EAR_Laten_3;
        this.ObjABR.RAmp1=data[0].Right_Ampl_1;
        this.ObjABR.RAmp2=data[0].Right_Ampl_2;
        // this.ObjABR.RAmp3=data[0].Right_Ampl_3;
        this.ObjABR.REar=data[0].Right_Ear_Interpretation;
        this.ObjABR.LEar=data[0].Left_Ear_Interpretation;
        this.ObjABR.Comment=data[0].Comment;

        this.Get_TXN_ID=data[0].Txn_ID;
        console.log("check Get_TXN_ID",this.Get_TXN_ID);
        this.editData1(this.Get_TXN_ID);
      });
      
    
  }

  editData1(TXN_ID){
      const TempTxnIDObj={
        Txn_ID: TXN_ID
      }
      const Recmdobj = {
        "SP_String": "SP_BL_Txn_Doctor_Appo_ABR",
        "Report_Name_String": "Retrieve_Data_Recommend",
        "Json_Param_String": JSON.stringify(TempTxnIDObj)
      }
      this.GlobalAPI.getData(Recmdobj).subscribe((data: any) => {
        console.log("Edit Data2",data);
        let BoxArray:any = []
        data.forEach((ele:any) => {
          BoxArray.push(ele.Recommend)
        });
      this.checkBoxArray= BoxArray
        console.log("this.checkBoxArray===",this.checkBoxArray)
        this.editData2();
      });
  }

  editData2(){
    const TempDropdownObj={
      Appo_ID : this.AppoIDvalue
    }

    const Dropdownobj = {
      "SP_String": "SP_BL_Txn_Doctor_Appo_ABR",
      "Report_Name_String": "Get_All_Data",
      "Json_Param_String": JSON.stringify([TempDropdownObj])
    }
    this.GlobalAPI.getData(Dropdownobj).subscribe((data:any)=>{
     console.log("GetAllDataAppoID For dropdown",data);
      if(data.length){
       const editObj = {
          Level_1_Status: data[0].Level_1_Status.toString() ? data[0].Level_1_Status.toString() : '',
          Level_2_Status: data[0].Level_2_Status.toString() ? data[0].Level_2_Status.toString() : '',
          Level_3_Status: data[0].Level_3_Status.toString() ? data[0].Level_3_Status.toString() : ''
        }
        this.UpdateConsultancy.editConsulyancy(editObj)
      }
    });
  }

  onConfirm(){
  }
  onReject(){
    this.compacctToast.clear("c");
  }

  ClearData(){
     this.ObjABR.Filter=undefined;
     this.ObjABR.RepetitionRate=undefined;
     this.ObjABR.Stimulus=undefined;
     this.ObjABR.LRemarks1=undefined;
     this.ObjABR.LRemarks2=undefined;
    //  this.ObjABR.LRemarks3=undefined;
     this.ObjABR.RRemarks1=undefined;
     this.ObjABR.RRemarks2=undefined;
    //  this.ObjABR.RRemarks3=undefined;
     this.ObjABR.Status=undefined;
     this.ObjABR.StiInt1=undefined;
     this.ObjABR.StiInt2=undefined;
    //  this.ObjABR.StiInt3=undefined;
     this.ObjABR.LLaten1=undefined;
     this.ObjABR.LLaten2=undefined;
    //  this.ObjABR.LLaten3=undefined;
     this.ObjABR.LAmp1=undefined;
     this.ObjABR.LAmp2=undefined;
    //  this.ObjABR.LAmp3=undefined;
     this.ObjABR.RLaten1=undefined;
     this.ObjABR.RLaten2=undefined;
    //  this.ObjABR.RLaten3=undefined;
     this.ObjABR.RAmp1=undefined;
     this.ObjABR.RAmp2=undefined;
    //  this.ObjABR.RAmp3=undefined;
     this.ObjABR.REar=undefined;
     this.ObjABR.LEar=undefined;
     this.ObjABR.Comment=undefined;
     this.checkBoxArray=[]
  }
}

class ABR{
  Name : any;
  PatientID: any;
  Sex: any;
  RefferedBy:any;
  Age: any;
  Filter: any;
  RepetitionRate: any;
  Centre:any;
  Stimulus:any;
  LRemarks1:any;
  LRemarks2:any;
  LRemarks3:any;
  RRemarks1:any;
  RRemarks2:any;
  RRemarks3:any;
  RECOMMENDATION:any;
  Status:any;
  StiInt1:any;
  StiInt2:any;
  StiInt3:any;
  LLaten1:any;
  LLaten2:any;
  LLaten3:any;
  LAmp1:any;
  LAmp2:any;
  LAmp3:any;
  RLaten1:any;
  RLaten2:any;
  RLaten3:any;
  RAmp1:any;
  RAmp2:any;
  RAmp3:any;
  REar:any;
  LEar:any;
  Comment:any;
}

