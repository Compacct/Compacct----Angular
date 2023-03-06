import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { UpdateConsultancyComponent } from '../../../shared/compacct.components/compacct.forms/update-consultancy/update-consultancy.component';

@Component({
  selector: 'app-doctors-appointment-new-sp-test',
  templateUrl: './doctors-appointment-new-sp-test.component.html',
  styleUrls: ['./doctors-appointment-new-sp-test.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class DoctorsAppointmentNewSpTestComponent implements OnInit {
  tabIndexToView:number= 0;
  GenderList:any=[];
  AppoIDvalue:number;
  EditPage:any;
  SisiList:any=[];
  TdtList:any=[];
  SpinList:any=[];
  VeList:any=[];
  SpecialTestFormSubmitted:boolean= false;
  Spinner:boolean=false;
  buttonname:any='Create';
  Level_1_Status:any=undefined;
  Level_2_Status:any=undefined;
  Level_3_Status:any=undefined;
  patientSearchList:any= [];
  CheckBoxRECOMMENDATION:any=[];
  CentreList:any=[];
  Appo_Date:any;
  TestName:any='SPECIAL_TESTS_(SISI & TDT & SPIN)';
  buttonValid:boolean= true;
  Get_TXN_ID:any;
  EditDataList:any=[];

  ObjSpecialTest: SpecialTest = new SpecialTest();
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
      Header: "SPECIAL TESTS (SISI, TDT & SPIN)",
      Link: " Patient Management -> SPECIAL TESTS"
    });
    this.SisiList=['Indication of Cochlear Pathology','(?) Indication of Cochlear Pathology','No Indication of Cochlear Pathology'];
    this.TdtList=['Indication of Retrocochlear Pathology','(?) Indication of Retrocochlear Pathology','No Indication of Retrocochlear Pathology'];
    this.SpinList=['Indication of Retrocochlear Pathology','(?) Indication of Retrocochlear Pathology','No Indication of Retrocochlear Pathology'];
    this.VeList=['Positive','Negative'];
    this.GenderList=['Male','Female','Other'];
    this.Appo_Date= new Date();
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

        this.ObjSpecialTest.Name=this.patientSearchList[0].Name;
        this.ObjSpecialTest.PatientID=this.patientSearchList[0].Foot_Fall_ID;
        this.ObjSpecialTest.Sex=this.patientSearchList[0].Sex;
        this.ObjSpecialTest.RefferedBy=this.patientSearchList[0].Referredby;
        this.ObjSpecialTest.Age=this.patientSearchList[0].Age;
        this.ObjSpecialTest.Centre=this.patientSearchList[0].Cost_Cen_ID;
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
          Foot_Fall_ID: this.ObjSpecialTest.PatientID,
          Appo_ID: this.AppoIDvalue,
          Txn_Date: this.Appo_Date,
          Cost_Cent_ID: this.ObjSpecialTest.Centre,
          Posted_By: this.$CompacctAPI.CompacctCookies.User_ID,
          Posted_On: this.DateService.dateConvert(new Date()),
          Sisi_Right_Ear_500Hz: this.ObjSpecialTest.Sisi_Right_Ear_500Hz,
          Sisi_Right_Ear_1000Hz: this.ObjSpecialTest.Sisi_Right_Ear_500Hz,
          Sisi_Right_Ear_2000Hz: this.ObjSpecialTest.Sisi_Right_Ear_2000Hz, 
          Sisi_Right_Ear_4000Hz: this.ObjSpecialTest.Sisi_Right_Ear_4000Hz, 
          Sisi_Left_Ear_500Hz: this.ObjSpecialTest.Sisi_Left_Ear_500Hz, 
          Sisi_Left_Ear_1000Hz: this.ObjSpecialTest.Sisi_Left_Ear_1000Hz,
          Sisi_Left_Ear_2000Hz: this.ObjSpecialTest.Sisi_Left_Ear_2000Hz, 
          Sisi_Left_Ear_4000Hz: this.ObjSpecialTest.Sisi_Left_Ear_4000Hz, 
          Sisi_Right_Ear_INTERPRETATION: this.ObjSpecialTest.Sisi_Right_Ear_INTERPRETATION, 
          Sisi_Left_Ear_INTERPRETATION: this.ObjSpecialTest.Sisi_Left_Ear_INTERPRETATION,
          TDT_Right_Ear_500Hz: this.ObjSpecialTest.TDT_Right_Ear_500Hz, 
          TDT_Right_Ear_1000Hz: this.ObjSpecialTest.TDT_Right_Ear_1000Hz,
          TDT_Right_Ear_2000Hz: this.ObjSpecialTest.TDT_Right_Ear_2000Hz, 
          TDT_Right_Ear_4000Hz: this.ObjSpecialTest.TDT_Right_Ear_4000Hz,  
          TDT_Left_Ear_500Hz: this.ObjSpecialTest.TDT_Left_Ear_500Hz, 
          TDT_Left_Ear_1000Hz: this.ObjSpecialTest.TDT_Left_Ear_1000Hz,
          TDT_Left_Ear_2000Hz: this.ObjSpecialTest.TDT_Left_Ear_2000Hz, 
          TDT_Left_Ear_4000Hz: this.ObjSpecialTest.TDT_Left_Ear_4000Hz, 
          TDT_Right_Ear_INTERPRETATION: this.ObjSpecialTest.TDT_Right_Ear_INTERPRETATION, 
          TDT_Left_Ear_INTERPRETATION: this.ObjSpecialTest.TDT_Right_Ear_INTERPRETATION,
          Spin_Right_Ear_SRT_SDT: this.ObjSpecialTest.Spin_Right_Ear_SRT_SDT, 
          Spin_Right_Ear_SIS_SDS: this.ObjSpecialTest.Spin_Right_Ear_SIS_SDS,
          Spin_Right_Ear_SPIN: this.ObjSpecialTest.Spin_Right_Ear_SPIN,  
          Spin_Left_Ear_SRT_SDT: this.ObjSpecialTest.Spin_Left_Ear_SRT_SDT, 
          Spin_Left_Ear_SIS_SDS: this.ObjSpecialTest.Spin_Left_Ear_SIS_SDS,
          Spin_Left_Ear_SPIN: this.ObjSpecialTest.Spin_Left_Ear_SPIN,
          Spin_Right_Ear_INTERPRETATION: this.ObjSpecialTest.Spin_Right_Ear_INTERPRETATION, 
          Spin_Left_Ear_INTERPRETATION: this.ObjSpecialTest.Spin_Left_Ear_INTERPRETATION
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

      this.SpecialTestFormSubmitted=true;
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
         this.SpecialTestFormSubmitted=false;
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
    this.ObjSpecialTest.Sisi_Right_Ear_500Hz= undefined; 
    this.ObjSpecialTest.Sisi_Right_Ear_1000Hz= undefined;
    this.ObjSpecialTest.Sisi_Right_Ear_2000Hz= undefined; 
    this.ObjSpecialTest.Sisi_Right_Ear_4000Hz= undefined;  
    this.ObjSpecialTest.Sisi_Left_Ear_500Hz= undefined; 
    this.ObjSpecialTest.Sisi_Left_Ear_1000Hz= undefined;
    this.ObjSpecialTest.Sisi_Left_Ear_2000Hz= undefined; 
    this.ObjSpecialTest.Sisi_Left_Ear_4000Hz= undefined; 
    this.ObjSpecialTest.Sisi_Right_Ear_INTERPRETATION= undefined; 
    this.ObjSpecialTest.Sisi_Left_Ear_INTERPRETATION= undefined;
    this.ObjSpecialTest.TDT_Right_Ear_500Hz= undefined; 
    this.ObjSpecialTest.TDT_Right_Ear_1000Hz= undefined;
    this.ObjSpecialTest.TDT_Right_Ear_2000Hz= undefined; 
    this.ObjSpecialTest.TDT_Right_Ear_4000Hz= undefined;  
    this.ObjSpecialTest.TDT_Left_Ear_500Hz= undefined; 
    this.ObjSpecialTest.TDT_Left_Ear_1000Hz= undefined;
    this.ObjSpecialTest.TDT_Left_Ear_2000Hz= undefined; 
    this.ObjSpecialTest.TDT_Left_Ear_4000Hz= undefined; 
    this.ObjSpecialTest.TDT_Right_Ear_INTERPRETATION= undefined; 
    this.ObjSpecialTest.TDT_Left_Ear_INTERPRETATION= undefined;
    this.ObjSpecialTest.Spin_Right_Ear_SRT_SDT= undefined; 
    this.ObjSpecialTest.Spin_Right_Ear_SIS_SDS= undefined;
    this.ObjSpecialTest.Spin_Right_Ear_SPIN= undefined;  
    this.ObjSpecialTest.Spin_Left_Ear_SRT_SDT= undefined; 
    this.ObjSpecialTest.Spin_Left_Ear_SIS_SDS= undefined;
    this.ObjSpecialTest.Spin_Left_Ear_SPIN= undefined;
    this.ObjSpecialTest.Spin_Right_Ear_INTERPRETATION= undefined; 
    this.ObjSpecialTest.Spin_Left_Ear_INTERPRETATION= undefined;
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
      "SP_String": "SP_BL_Txn_Doctor_Appo_ALL",
      "Report_Name_String": "Retrieve_BL_Txn_Doctor_Appo_ALL_Data",
      "Json_Param_String": JSON.stringify(TempEditObj)
    }
    this.GlobalAPI.getData(Editobj).subscribe((data: any) => {
      console.log("Edit Data",data);
      this.EditDataList= JSON.parse(data[0].Test_Details);
      console.log("EditDataList",this.EditDataList);

      this.ObjSpecialTest.Sisi_Right_Ear_500Hz= this.EditDataList.Sisi_Right_Ear_500Hz ?  this.EditDataList.Sisi_Right_Ear_500Hz : undefined;
      this.ObjSpecialTest.Sisi_Right_Ear_1000Hz= this.EditDataList.Sisi_Right_Ear_1000Hz ? this.EditDataList.Sisi_Right_Ear_1000Hz : undefined;
      this.ObjSpecialTest.Sisi_Right_Ear_2000Hz= this.EditDataList.Sisi_Right_Ear_2000Hz ?  this.EditDataList.Sisi_Right_Ear_2000Hz : undefined;
      this.ObjSpecialTest.Sisi_Right_Ear_4000Hz= this.EditDataList.Sisi_Right_Ear_4000Hz ?   this.EditDataList.Sisi_Right_Ear_4000Hz : undefined;
      this.ObjSpecialTest.Sisi_Left_Ear_500Hz= this.EditDataList.Sisi_Left_Ear_500Hz ? this.EditDataList.Sisi_Left_Ear_500Hz : undefined;
      this.ObjSpecialTest.Sisi_Left_Ear_1000Hz=  this.EditDataList.Sisi_Left_Ear_1000Hz ?  this.EditDataList.Sisi_Left_Ear_1000Hz : undefined;
      this.ObjSpecialTest.Sisi_Left_Ear_2000Hz=  this.EditDataList.Sisi_Left_Ear_2000Hz ?  this.EditDataList.Sisi_Left_Ear_2000Hz : undefined;
      this.ObjSpecialTest.Sisi_Left_Ear_4000Hz=  this.EditDataList.Sisi_Left_Ear_4000Hz ?  this.EditDataList.Sisi_Left_Ear_4000Hz : undefined;
      this.ObjSpecialTest.Sisi_Right_Ear_INTERPRETATION=  this.EditDataList.Sisi_Right_Ear_INTERPRETATION ?  this.EditDataList.Sisi_Right_Ear_INTERPRETATION : undefined;
      this.ObjSpecialTest.Sisi_Left_Ear_INTERPRETATION= this.EditDataList.Sisi_Left_Ear_INTERPRETATION  ? this.EditDataList.Sisi_Left_Ear_INTERPRETATION : undefined;
      this.ObjSpecialTest.TDT_Right_Ear_500Hz=  this.EditDataList.TDT_Right_Ear_500Hz ?  this.EditDataList.TDT_Right_Ear_500Hz : undefined;
      this.ObjSpecialTest.TDT_Right_Ear_1000Hz=  this.EditDataList.TDT_Right_Ear_1000Hz ?  this.EditDataList.TDT_Right_Ear_1000Hz : undefined;
      this.ObjSpecialTest.TDT_Right_Ear_2000Hz=  this.EditDataList.TDT_Right_Ear_2000Hz ?  this.EditDataList.TDT_Right_Ear_2000Hz : undefined;
      this.ObjSpecialTest.TDT_Right_Ear_4000Hz=  this.EditDataList.TDT_Right_Ear_4000Hz ?  this.EditDataList.TDT_Right_Ear_4000Hz : undefined;
      this.ObjSpecialTest.TDT_Left_Ear_500Hz=  this.EditDataList.TDT_Left_Ear_500Hz ?  this.EditDataList.TDT_Left_Ear_500Hz : undefined;
      this.ObjSpecialTest.TDT_Left_Ear_1000Hz=   this.EditDataList.TDT_Left_Ear_1000Hz ?   this.EditDataList.TDT_Left_Ear_1000Hz : undefined;
      this.ObjSpecialTest.TDT_Left_Ear_2000Hz=   this.EditDataList.TDT_Left_Ear_2000Hz ?   this.EditDataList.TDT_Left_Ear_2000Hz : undefined;
      this.ObjSpecialTest.TDT_Left_Ear_4000Hz=  this.EditDataList.TDT_Left_Ear_4000Hz ?  this.EditDataList.TDT_Left_Ear_4000Hz : undefined;
      this.ObjSpecialTest.TDT_Right_Ear_INTERPRETATION=  this.EditDataList.TDT_Right_Ear_INTERPRETATION ?  this.EditDataList.TDT_Right_Ear_INTERPRETATION : undefined;
      this.ObjSpecialTest.TDT_Left_Ear_INTERPRETATION= this.EditDataList.TDT_Left_Ear_INTERPRETATION ?  this.EditDataList.TDT_Left_Ear_INTERPRETATION : undefined;
      this.ObjSpecialTest.Spin_Right_Ear_SRT_SDT= this.EditDataList.Spin_Right_Ear_SRT_SDT ?  this.EditDataList.Spin_Right_Ear_SRT_SDT : undefined; 
      this.ObjSpecialTest.Spin_Right_Ear_SIS_SDS=  this.EditDataList.Spin_Right_Ear_SIS_SDS ?   this.EditDataList.Spin_Right_Ear_SIS_SDS : undefined;
      this.ObjSpecialTest.Spin_Right_Ear_SPIN= this.EditDataList.Spin_Right_Ear_SPIN ? this.EditDataList.Spin_Right_Ear_SPIN : undefined; 
      this.ObjSpecialTest.Spin_Left_Ear_SRT_SDT=   this.EditDataList.Spin_Left_Ear_SRT_SDT ?   this.EditDataList.Spin_Left_Ear_SRT_SDT : undefined;
      this.ObjSpecialTest.Spin_Left_Ear_SIS_SDS= this.EditDataList.Spin_Left_Ear_SIS_SDS ?  this.EditDataList.Spin_Left_Ear_SIS_SDS : undefined;
      this.ObjSpecialTest.Spin_Left_Ear_SPIN= this.EditDataList.Spin_Left_Ear_SPIN ?  this.EditDataList.Spin_Left_Ear_SPIN : undefined;
      this.ObjSpecialTest.Spin_Right_Ear_INTERPRETATION= this.EditDataList.Spin_Right_Ear_INTERPRETATION ?  this.EditDataList.Spin_Right_Ear_INTERPRETATION : undefined; 
      this.ObjSpecialTest.Spin_Left_Ear_INTERPRETATION= this.EditDataList.Spin_Left_Ear_INTERPRETATION ?  this.EditDataList.Spin_Left_Ear_INTERPRETATION : undefined;
   
     
      this.Get_TXN_ID=data[0].Txn_ID;
      console.log("check Get_TXN_ID",this.Get_TXN_ID);
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


class SpecialTest{
  Name: any;
  PatientID: any;
  Sex: any;
  RefferedBy:any;
  Age: any;
  Centre:any;
  Foot_Fall_ID: any; 
  Appo_ID: any; 
  Txn_Date: any;
  Cost_Cent_ID: any; 
  Posted_By: any; 
  Posted_On: any; 
  Sisi_Right_Ear_500Hz: any; 
  Sisi_Right_Ear_1000Hz: any;
  Sisi_Right_Ear_2000Hz: any; 
  Sisi_Right_Ear_4000Hz: any;  
  Sisi_Left_Ear_500Hz: any; 
  Sisi_Left_Ear_1000Hz: any;
  Sisi_Left_Ear_2000Hz: any; 
  Sisi_Left_Ear_4000Hz: any; 
  Sisi_Right_Ear_INTERPRETATION: any; 
  Sisi_Left_Ear_INTERPRETATION: any;
  TDT_Right_Ear_500Hz: any; 
  TDT_Right_Ear_1000Hz: any;
  TDT_Right_Ear_2000Hz: any; 
  TDT_Right_Ear_4000Hz: any;  
  TDT_Left_Ear_500Hz: any; 
  TDT_Left_Ear_1000Hz: any;
  TDT_Left_Ear_2000Hz: any; 
  TDT_Left_Ear_4000Hz: any; 
  TDT_Right_Ear_INTERPRETATION: any; 
  TDT_Left_Ear_INTERPRETATION: any;
  Spin_Right_Ear_SRT_SDT: any; 
  Spin_Right_Ear_SIS_SDS: any;
  Spin_Right_Ear_SPIN: any;  
  Spin_Left_Ear_SRT_SDT: any; 
  Spin_Left_Ear_SIS_SDS: any;
  Spin_Left_Ear_SPIN: any;
  Spin_Right_Ear_INTERPRETATION: any; 
  Spin_Left_Ear_INTERPRETATION: any;
}
