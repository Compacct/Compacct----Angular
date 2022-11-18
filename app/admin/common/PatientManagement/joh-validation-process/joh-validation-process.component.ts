import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import { data } from 'jquery';
import { updateLocale } from 'moment';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-joh-validation-process',
  templateUrl: './joh-validation-process.component.html',
  styleUrls: ['./joh-validation-process.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class JohValidationProcessComponent implements OnInit {
  tabIndexToView = 0;
  items:any = [];
  Patientlist:any=[];
  patientSearchList:any=[];
  Active: any = true;
  SaveAfter:any = true;
  Date_Of_Birth:any;
  Date_Of_Validation = new Date();
  Audiologistlist:any=[];
  CostCentreList:any=[];
  UserType = "";
  IndexArray:any=[1,2,3,4,5,6,7,8,9];
  PatientFormSubmitted:boolean=false;
  Spinner:boolean=false;
  Doctor_ID:any = 0;
  initDate : any = [];
  Searchedlist : any = [];
  ValidationNo:any = undefined
  buttonname:string = "Create"
  ObjPatient: PatientValidation = new PatientValidation();
  objSearch: Search =new Search();
  seachSpinner:boolean = false
  constructor(
    private header:CompacctHeader,
    private $http: HttpClient,
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    ) { }

  ngOnInit() {
    this.header.pushHeader({
      Header: "Validation Process",
      Link: "Patient Management -> Patient Validation Process"
    });
    this.items = ["BROWSE", "CREATE"];
    this.GetPatient();
    this.GetAudiologist();
    this.GetCostCentre();
    this.UserType = this.$CompacctAPI.CompacctCookies.User_Type;
    this.Select();
    this.Date_Of_Birth = new Date()
    
  }

  getDateRange(dateRangeObj:any){
    if(dateRangeObj.length){
      this.objSearch.From_Date = dateRangeObj[0];
      this.objSearch.To_Date = dateRangeObj[1];
    }
   
  }


  getAlldata(){
    this.seachSpinner = true
    const start = this.objSearch.From_Date
    ? this.DateService.dateConvert(new Date(this.objSearch.From_Date))
    : this.DateService.dateConvert(new Date());
    const end = this.objSearch.To_Date
    ? this.DateService.dateConvert(new Date(this.objSearch.To_Date))
    : this.DateService.dateConvert(new Date());
    const tempobj = {
      Start_Date : start,
      End_Date : end,
      Cost_Cen_ID : this.objSearch.Cost_Cen_ID ? this.objSearch.Cost_Cen_ID : 0,
    
    }
    const obj = {
      "SP_String": "sp_JOH_Validation_Processt",
      "Report_Name_String": "Get_All_Data_Validation",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      
       this.Searchedlist = data;
       this.seachSpinner = false
       console.log('Searchedlist=====',this.Searchedlist); 
     })

  }

  EditValidation(Col:any){
    //console.log("col data",col);
    this.PatientFormSubmitted = false;
    this.ObjPatient = new PatientValidation();
    this. GetCostCentre();
    if(Col.Validation_No){
      this.ValidationNo = Col.Validation_No;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.GetAudiologist();
      this.getValidation(Col.Validation_No);
      }
  }
  getValidation(ValidationNo:any){
    const obj = {
      "SP_String": "sp_JOH_Validation_Processt",
      "Report_Name_String":"Retrieve_Data",
      "Json_Param_String": JSON.stringify([{ Validation_No: ValidationNo}]) 
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("Edit data",data)
        this.ObjPatient.Patient = data[0].Foot_Fall_ID;
        this.ObjPatient.Foot_Fall_ID = data[0].Foot_Fall_ID;
        this.Date_Of_Birth = new Date(data[0].Date_Of_Birth);
        this.ObjPatient.Gender = data[0].Gender;
        this.ObjPatient.Type_of_visit = data[0].Type_of_visit;
        this.ObjPatient.Doctor_ID = data[0].User_ID;
        this.GetDoctorId();
        this.ObjPatient.Cost_Cen_ID = data[0].Cost_Cen_Id;
        this.Date_Of_Validation = new Date(data[0].Validation_Date);
        this.ObjPatient.Type_of_visit = data[0].Type_of_visit;
        this.ObjPatient.Status1 = data[0].Validation_Status;
        this.ObjPatient.Status2 = data[1].Validation_Status;
        this.ObjPatient.Status3 = data[2].Validation_Status;
        this.ObjPatient.Status4 = data[3].Validation_Status;
        this.ObjPatient.Status5 = data[4].Validation_Status;
        this.ObjPatient.Status6 = data[5].Validation_Status;
        this.ObjPatient.Status7 = data[6].Validation_Status;
        this.ObjPatient.Status8 = data[7].Validation_Status;
        this.ObjPatient.Status9 = data[8].Validation_Status;
        this.ObjPatient.Remarks1 = data[0].Validation_Remarks;
        this.ObjPatient.Remarks2 = data[1].Validation_Remarks;
        this.ObjPatient.Remarks3 = data[2].Validation_Remarks;
        this.ObjPatient.Remarks4 = data[3].Validation_Remarks;
        this.ObjPatient.Remarks5 = data[4].Validation_Remarks;
        this.ObjPatient.Remarks6 = data[5].Validation_Remarks;
        this.ObjPatient.Remarks7 = data[6].Validation_Remarks;
        this.ObjPatient.Remarks8 = data[7].Validation_Remarks;
        this.ObjPatient.Remarks9 = data[8].Validation_Remarks;
        this.GetPatientLIST()
      })
  }   
  
  Select(){
    this.ObjPatient.Status1 = "Achieved";
    this.ObjPatient.Status2 = "Achieved";
    this.ObjPatient.Status3 = "Achieved";
    this.ObjPatient.Status4 = "Achieved";
    this.ObjPatient.Status5 = "Achieved";
    this.ObjPatient.Status6 = "Achieved";
    this.ObjPatient.Status7 = "Achieved";
    this.ObjPatient.Status8 = "Achieved";
    this.ObjPatient.Status9 = "Achieved";
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
     this.ValidationNo = undefined
     this.buttonname = "Create"
     this.PatientFormSubmitted = false;
     this.ObjPatient = new PatientValidation();
     this.GetAudiologist();
     this.Select();
     this. GetCostCentre();
  }

  GetPatient(){
    this.Patientlist = [];
    const obj = {
      "SP_String": "sp_JOH_Validation_Processt",
      "Report_Name_String": "Get Patient"
  
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("Get Patient",data);
    if(data.length) {
        data.forEach(element => {
          element['label'] = element.Patient,
          element['value'] = element.Foot_Fall_ID
        });
       this.Patientlist = data;
      }
       else {
        this.Patientlist = [];
      }
   });
  }

  GetPatientLIST(){
    this.patientSearchList = [];
    this.Active = false;
    this.SaveAfter = true;

    const tempobj = {
      Foot_Fall_ID : this.ObjPatient.Patient,
    }
      const obj = {
        "SP_String": "sp_JOH_Validation_Processt",
        "Report_Name_String": "Get Patient Details with Footfall",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("Get Patient Details with Footfall",data);
        if(data.length){
        this.patientSearchList = data;

        this.ObjPatient.Foot_Fall_ID = this.patientSearchList[0].Foot_Fall_ID;
        this.ObjPatient.Gender = this.patientSearchList[0].Gender;
        console.log("Date_of_Birth",this.patientSearchList[0].Date_Of_Birth);
        this.Date_Of_Birth = this.patientSearchList[0].Date_Of_Birth ? new Date(this.patientSearchList[0].Date_Of_Birth) : "";
       
        
        }
      })
   }

   GetAudiologist(){
    this.Audiologistlist = [];
    const obj = {
      "SP_String": "sp_JOH_Validation_Processt",
      "Report_Name_String": "Get Audiologist"
  
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("Get Audiologist",data);
    if(data.length) {
        data.forEach(element => {
          element['label'] = element.Name,
          element['value'] = element.User_ID
        });
       this.Audiologistlist = data;
       this.ObjPatient.Doctor_ID = Number(this.$CompacctAPI.CompacctCookies.User_ID);
       console.log("Doctor ID",this.ObjPatient.Doctor_ID);
       this.GetDoctorId();
      }
       else {
        this.Audiologistlist = [];
      }
   });
  }
  GetDoctorId(){
    this.Doctor_ID=undefined;
    if(this.ObjPatient.Doctor_ID){
      var Doc_ID=this.Audiologistlist.filter(el=>Number(el.User_ID)===Number(this.ObjPatient.Doctor_ID))
      this.Doctor_ID=Doc_ID[0].Doctor_ID;
      console.log("Doctor-Id",this.Doctor_ID);
    }
    else{
      this.Doctor_ID=undefined;
    }
  }


  GetCostCentre(){
    this.CostCentreList = [];
    const obj = {
      "SP_String": "sp_JOH_Validation_Processt",
      "Report_Name_String": "Get Cost Center"
  
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("Get Cost Center",data);
    if(data.length) {
        data.forEach(element => {
          element['label'] = element.Cost_Cen_Name,
          element['value'] = element.Cost_Cen_ID
        });
       this.CostCentreList = data;
       this.ObjPatient.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
       if(this.UserType=='U'){
       this.objSearch.Cost_Cen_ID= this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      }
      }
       else {
        this.CostCentreList = [];
      }
   });
  }

  savePatientValidation(valid:any){
    // let tabedata:any=[];
  const TempObj ={
    Validation_No: this.buttonname === "Create" ?  0 : this.ValidationNo,
    Validation_Date: this.DateService.dateConvert(new Date(this.Date_Of_Validation)),
    Foot_Fall_ID: this.ObjPatient.Foot_Fall_ID,
    Type_of_visit: this.ObjPatient.Type_of_visit,
    Doctor_ID: this.Doctor_ID,
    User_ID: this.ObjPatient.Doctor_ID,
    Cost_Cen_Id: this.ObjPatient.Cost_Cen_ID
    // Validation_Sl_No: this.IndexArray,
    // Validation_Status: this.ObjPatient.Status1,
    // Validation_Remarks: this.RemarksOBj
    }
    // tabedata.push(TempObj);
  
  console.log("TempObj",TempObj);
  let validationList:any =[];
  if (this.IndexArray[0] === 1) {
    const valid1 = {
    Validation_Sl_No: this.IndexArray[0],
    Validation_Status: this.ObjPatient.Status1,
    Validation_Remarks: this.ObjPatient.Remarks1
    }
    validationList.push({...TempObj,...valid1})
  }
    if (this.IndexArray[1] === 2) {
      const valid2 = {
      Validation_Sl_No: this.IndexArray[1],
      Validation_Status: this.ObjPatient.Status2,
      Validation_Remarks: this.ObjPatient.Remarks2
      }
      validationList.push({...TempObj,...valid2})
  }
  if (this.IndexArray[2] === 3) {
    const valid3 = {
    Validation_Sl_No: this.IndexArray[2],
    Validation_Status: this.ObjPatient.Status3,
    Validation_Remarks: this.ObjPatient.Remarks3
    }
    validationList.push({...TempObj,...valid3})
  }
  if (this.IndexArray[3] === 4) {
    const valid4 = {
    Validation_Sl_No: this.IndexArray[3],
    Validation_Status: this.ObjPatient.Status4,
    Validation_Remarks: this.ObjPatient.Remarks4
    }
    validationList.push({...TempObj,...valid4})
  }
  if (this.IndexArray[4] === 5) {
    const valid5 = {
    Validation_Sl_No: this.IndexArray[4],
    Validation_Status: this.ObjPatient.Status5,
    Validation_Remarks: this.ObjPatient.Remarks5
    }
    validationList.push({...TempObj,...valid5})
  }
  if (this.IndexArray[5] === 6) {
    const valid6 = {
    Validation_Sl_No: this.IndexArray[5],
    Validation_Status: this.ObjPatient.Status6,
    Validation_Remarks: this.ObjPatient.Remarks6
    }
    validationList.push({...TempObj,...valid6})
  }
  if (this.IndexArray[6] === 7) {
    const valid7 = {
    Validation_Sl_No: this.IndexArray[6],
    Validation_Status: this.ObjPatient.Status7,
    Validation_Remarks: this.ObjPatient.Remarks7
    }
    validationList.push({...TempObj,...valid7})
  }
  if (this.IndexArray[7] === 8) {
    const valid8 = {
    Validation_Sl_No: this.IndexArray[7],
    Validation_Status: this.ObjPatient.Status8,
    Validation_Remarks: this.ObjPatient.Remarks8
    }
    validationList.push({...TempObj,...valid8})
  }
  if (this.IndexArray[8] === 9) {
    const valid9 = {
    Validation_Sl_No: this.IndexArray[8],
    Validation_Status: this.ObjPatient.Status9,
    Validation_Remarks: this.ObjPatient.Remarks9
    }
    validationList.push({...TempObj,...valid9})
  }
  console.log("validationList",validationList);
  this.PatientFormSubmitted = true;
  this.Spinner=true;
  if(valid){
    const obj = {
      "SP_String": "sp_JOH_Validation_Processt",
      "Report_Name_String" :  "Create_Validation",
     "Json_Param_String": JSON.stringify(validationList)
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log("Check Create Data",data);
      var msg= this.buttonname === "Create" ?  "create" : "update";
      if (data[0].Column1){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Validation " + msg ,
          detail: "Succesfully "
        });
        this.Spinner = false;
        this.PatientFormSubmitted = false;
        this.ObjPatient = new PatientValidation();
        this.GetAudiologist();
        this.Select();
        this. GetCostCentre();
        if (this.buttonname != "Create") {
          this.buttonname = "Create";
          this.tabIndexToView = 0;
          this.ValidationNo = undefined;
        }
        this.getAlldata();
         //this.GetBrowseData();
        //this.tabIndexToView = 0;
       // this.projectFromSubmit = false;
       // this.objproject = new project();
        //this.FromDatevalue = new Date()
        //this.ToDatevalue = new Date()
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
      
      }
    )}
  } 

  delectMaster(col:any){
    this.ValidationNo = undefined;
     if(col.Validation_No){
     this.ValidationNo = col.Validation_No ;
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
  GetPrint(col){
    if (col.Validation_No) {
      window.open("/Report/Crystal_Files/CRM/joh_Form/Validation.aspx?Validation_No=" + col.Validation_No, 
      'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
      );

    }

  }

  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){
   if(this.ValidationNo){
        const obj = {
          "SP_String": "sp_JOH_Validation_Processt",
          "Report_Name_String": "Delete_data",
          "Json_Param_String": JSON.stringify([{Validation_No : this.ValidationNo}])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          // console.log("del Data===", data[0].Column1)
          if (data[0].Column1 === "Done "){
           this.onReject();
           this.getAlldata();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Validation No: " + this.ValidationNo.toString(),
              detail: "Succesfully Deleted"
            });

          this.ValidationNo = undefined
          }
        })
      }
     // this.ParamFlaghtml = undefined;
  }
}
class PatientValidation{
    Txn_ID: any;	
    Validation_No: any;	
    Validation_Date: any;
    Foot_Fall_ID: any;
    Type_of_visit: any = "Fitting";	
    Doctor_ID: any;				
    User_ID: any;			
    Cost_Cen_ID: any;			
    Validation_Sl_No: any;		
    Validation_Status: any;	
    Validation_Remarks: any;	
    Gender: any;
    Patient: string;
    Status1: string;
    Status2: string;
    Status3: string;
    Status4: string;
    Status5: string;
    Status6: string;
    Status7: string;
    Status8: string;
    Status9: string;
    Remarks1: any;
    Remarks2: any;
    Remarks3: any;
    Remarks4: any;
    Remarks5: any;
    Remarks6: any;
    Remarks7: any;
    Remarks8: any;
    Remarks9: any;
}

class Search{
  From_Date : any;
  To_Date : any;
  Cost_Cen_ID : any;

}
