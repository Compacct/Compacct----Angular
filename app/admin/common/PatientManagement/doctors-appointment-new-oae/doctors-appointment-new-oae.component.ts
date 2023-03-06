import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { UpdateConsultancyComponent } from '../../../shared/compacct.components/compacct.forms/update-consultancy/update-consultancy.component';

@Component({
  selector: 'app-doctors-appointment-new-oae',
  templateUrl: './doctors-appointment-new-oae.component.html',
  styleUrls: ['./doctors-appointment-new-oae.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class DoctorsAppointmentNewOAEComponent implements OnInit {
  tabIndexToView:number= 0;
  GenderList:any=[];
  Appo_Date:any;
  CentreList:any=[];
  OAEList:any=[];
  OAEFormSubmitted:boolean= false;
  InterpretationList:any=[];
  ResultsList:any=[];
  CheckBoxRECOMMENDATION:any=[];
  Spinner:boolean=false;
  buttonname:any='Create';
  Level_1_Status:any=undefined;
  Level_2_Status:any=undefined;
  Level_3_Status:any=undefined;
  patientSearchList:any= [];
  AppoIDvalue:number;
  TestName:any='OAE';
  buttonValid:boolean= true;
  EditPage:any;
  Get_TXN_ID:any;
  EditDataList:any=[];

  ObjOAE: OAE = new OAE();
  @ViewChild("consultancy", { static: false }) UpdateConsultancy: UpdateConsultancyComponent;
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
      Header: "OTOACOUSTIC EMISSIONS (OAE)",
      Link: " Patient Management -> OTOACOUSTIC EMISSIONS"
    });
    this.GenderList=['Male','Female','Other'];
    this.Appo_Date= new Date();
    this.OAEList= ['TEOAE','DPOAE'];
    this.InterpretationList= ['No Indication of Outer Hair Cells Dysfunction','Outer Hair Cells Dysfunction','Indication of (?) Middle Ear Dysfunction'];
    this.ResultsList= ['Pass','Refer'];
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
     // console.log("GetAllDataAppoID",data);
      if(data.length){
        this.patientSearchList=data;

        this.ObjOAE.Name=this.patientSearchList[0].Name;
        this.ObjOAE.PatientID=this.patientSearchList[0].Foot_Fall_ID;
        this.ObjOAE.Sex=this.patientSearchList[0].Sex;
        this.ObjOAE.RefferedBy=this.patientSearchList[0].Referredby;
        this.ObjOAE.Age=this.patientSearchList[0].Age;
        this.ObjOAE.Centre=this.patientSearchList[0].Cost_Cen_ID;
        this.Appo_Date=this.patientSearchList[0].Appo_Dt ? this.patientSearchList[0].Appo_Dt : "-";
      }
    });
  }

  updateConsultancysave(event){
    //console.log('event value',event);
    //console.log('event1',event.Level_1_Status);
    this.Level_1_Status=event.Level_1_Status;
    this.Level_2_Status=event.Level_2_Status;
    this.Level_3_Status=event.Level_3_Status;
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
      Foot_Fall_ID: this.ObjOAE.PatientID,
      Appo_ID: this.AppoIDvalue,
      Txn_Date: this.Appo_Date,
      Cost_Cent_ID: this.ObjOAE.Centre,
      Posted_By: this.$CompacctAPI.CompacctCookies.User_ID,
      Posted_On: this.DateService.dateConvert(new Date()),
      OAE: this.ObjOAE.OAE,
      Right_Results: this.ObjOAE.Right_Results,
      Left_Results: this.ObjOAE.Left_Results,
      Right_Ear_Interpretation: this.ObjOAE.Right_Ear_Interpretation,
      Left_Ear_Interpretation: this.ObjOAE.Left_Ear_Interpretation
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

     this.OAEFormSubmitted=true;
     if(valid){
      this.Spinner=true;
      const obj = {
        "SP_String": "SP_BL_Txn_Doctor_Appo_OAE",
        "Report_Name_String": "Create_BL_Txn_Doctors_Appo_OAE",
        "Json_Param_String": JSON.stringify(TempObj),
        "Json_1_String": JSON.stringify(tempSaveJ1),
        "Json_2_String": JSON.stringify(tempSaveJ2),
        "Json_3_String": JSON.stringify(tempSaveJ3)
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log("save data",data);
         if (data[0].Column1){
          this.saveStatus();
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
      // console.log("TempObj2",TempObj2);

      const obj2 = {
        "SP_String": "sp_DoctorsAppointmentNew",
        "Report_Name_String": "Update_Consultancy_Done",
        "Json_Param_String": JSON.stringify(TempObj2),
      }    

      this.GlobalAPI.postData(obj2).subscribe((data: any) => {
        // console.log("save data2",data);
         var msg= this.EditPage ?  "update" : "create";
         if (data[0].Column1){
           this.Spinner=false;
           this.buttonValid = false;
           this.OAEFormSubmitted=false;
           this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Appointment " +msg,
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

  ClearData(){
    this.ObjOAE.OAE= undefined;
    this.ObjOAE.Right_Results= undefined;
    this.ObjOAE.Left_Results= undefined;
    this.ObjOAE.Right_Ear_Interpretation= undefined;
    this.ObjOAE.Left_Ear_Interpretation= undefined;
    this.CheckBoxRECOMMENDATION=[];
  }

  editData(){
    this.CheckBoxRECOMMENDATION=[];
    const TempEditObj={
      Appo_ID: this.AppoIDvalue
    }
  // console.log("TempEditObj",TempEditObj);
  this.buttonname='Edit';
    const Editobj = {
      "SP_String": "SP_BL_Txn_Doctor_Appo_OAE",
      "Report_Name_String": "Retrieve_BL_Txn_Doctor_Appo_ALL_Data",
      "Json_Param_String": JSON.stringify(TempEditObj)
    }
    this.GlobalAPI.getData(Editobj).subscribe((data: any) => {
      console.log("Edit Data",data);
      this.EditDataList= JSON.parse(data[0].Test_Details);
      console.log("EditDataList",this.EditDataList);

      this.ObjOAE.OAE= this.EditDataList.OAE ? this.EditDataList.OAE : undefined;
      this.ObjOAE.Right_Results= this.EditDataList.Right_Results ? this.EditDataList.Right_Results : undefined;
      this.ObjOAE.Left_Results= this.EditDataList.Left_Results ? this.EditDataList.Left_Results : undefined;
      this.ObjOAE.Right_Ear_Interpretation= this.EditDataList.Right_Ear_Interpretation ? this.EditDataList.Right_Ear_Interpretation : undefined;
      this.ObjOAE.Left_Ear_Interpretation= this.EditDataList.Left_Ear_Interpretation ? this.EditDataList.Left_Ear_Interpretation : undefined;
     
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
      "SP_String": "SP_BL_Txn_Doctor_Appo_OAE",
      "Report_Name_String": "Retrieve_BL_Txn_Doctor_Appo_ABR_Recommend_Data",
      "Json_Param_String": JSON.stringify(TempTxnIDObj)
    }
    this.GlobalAPI.getData(Recmdobj).subscribe((data: any) => {
      console.log("Edit Data2",data);
      let BoxArray:any = [];
      data.forEach((ele:any) => {
        BoxArray.push(ele.Recommend)
      });
    this.CheckBoxRECOMMENDATION= BoxArray;
      console.log("this.CheckBoxRECOMMENDATION===",this.CheckBoxRECOMMENDATION);
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
  }

}

class OAE{
  Name : any;
  PatientID: any;
  Sex: any;
  RefferedBy:any;
  Age: any;
  Centre:any;
  OAE:any;
  Right_Results:any;
  Left_Results:any;
  Right_Ear_Interpretation:any;
  Left_Ear_Interpretation:any;
}