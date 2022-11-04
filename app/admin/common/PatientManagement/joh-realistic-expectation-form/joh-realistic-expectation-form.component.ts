import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-joh-realistic-expectation-form',
  templateUrl: './joh-realistic-expectation-form.component.html',
  styleUrls: ['./joh-realistic-expectation-form.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class JOHRealisticExpectationFormComponent implements OnInit {

  tabIndexToView : any = 0;
  buttonname : any= "Create";
  Spinner : any = false;
  seachSpinner : any = false;
  TabSpinner : any = false;
  can_popup : any = false;
  Del =false;
  Save = false;
  items : any= [];
  objRealistic : Realistic = new Realistic();
  objRequirements : Requirements = new Requirements();
  RealisticFormSubmit : any = false;
  costCenterList : any = [];
  costCenterdataList : any = [];
  DOPAA_Date = new Date();
  DOFAA_Date = new Date();
  DOB_Date = new Date();
  doctorDataList : any = [];
  Gender : any;
  DOBEnable :any = false;
  isDisabled : any = true;
  RequirementsListAdd : any = [];
  ListingNeedList : any = [];
  RequirementsFormSubmit : any = false;
  customList : any = [];
  Requirementadd : any = [];
  HearingReList : any = [];
  HearingReDataList : any = [];
  HearingAiList : any = [];
  HearingAiDataList : any = [];
  objSearch : Search = new Search();
  initDate : any = [];
  Searchedlist : any = [];
  JREId : any
  

  constructor(
    private $http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "REALISTIC EXPECTATION FORM",
      Link: " PatientManagement --> JOH Realistic Expectation Form"
    });
    this.ListingNeedList = ["Conversation with 1 or 2 in quiet", "Conversation with 1 or 2 in noise", "Conversation with small group in quiet", "Conversation with small group in noise", 
                            "Conversation with large group in quiet", "Conversation with large group in noise", "Television / Radio at normal volume", "Hearing in mobile phone", "Hearing in landline phone", 
                            "Hearing phone ring from another room", "Hear front door bell or knock", "Meeting", "Classroom", "Listening to music", "Sound Quality/Naturalness"];
      
    this.getCostCenter();
    this.getReProduct();
    this.getAiProduct();
    this.getCustomId();
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    
    this.clearData();
  }

  onReject(){
    this.compacctToast.clear("c");
  }

  getCostCenter(){
    this.costCenterList = [];
    const obj = {
      "SP_String": "sp_Joh_Realistic_Expectation",
      "Report_Name_String": "Get_Cost_Center",   
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.costCenterdataList = data ;
      console.log("costCenterdataList=",this.costCenterdataList);
        this.costCenterdataList.forEach(el => {
          this.costCenterList.push({
            label: el.Cost_Cen_Name,
            value: el.Cost_Cen_ID
          });
        
         
        });
        this.objRealistic.Cost_Cen_ID = this.commonApi.CompacctCookies.Cost_Cen_ID;
        this.objSearch.Cost_Cen_ID = this.commonApi.CompacctCookies.Cost_Cen_ID;
       
        
    })

  }

  getCustomId(){
    console.log("Hello");
    let TempData = {
      Appo_Dt : this.DateService.dateConvert(new Date(this.DOPAA_Date)),
      Cost_Cen_ID : this.objRealistic.Cost_Cen_ID
      
    }

      const obj = {
        "SP_String": "sp_Joh_Realistic_Expectation",
        "Report_Name_String":"Get_Data_Cost_Cen_ID",
        "Json_Param_String": JSON.stringify([TempData])
       }
       this.GlobalAPI.getData(obj)
        .subscribe((data: any) => {
          this.customList = data;
          console.log(data);
          if(data.length){
          this.objRealistic.Foot_Fall_ID = data[0].Foot_Fall_ID ? data[0].Foot_Fall_ID : undefined;
          this.objRealistic.Name = data[0].Contact_Name ? data[0].Contact_Name : undefined;
          this.DOB_Date = data[0].Date_Of_Birth;
          this.objRealistic.Audiologist_User_ID = data[0].Audiologist? data[0].Audiologist : undefined;
          this.Gender = data[0].Gender? data[0].Gender : undefined;
          this.objRealistic.Appo_ID = data[0].Appo_ID ? data[0].Appo_ID : undefined;

          
          //this.getPuschaseOrder();
          console.log("customList=",this.customList);
          }
        });
  }

  getReProduct(){
    this.HearingReList = [];
    const obj = {
      "SP_String": "sp_Joh_Realistic_Expectation",
      "Report_Name_String": "Get_Product_Hearing",   
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.HearingReDataList = data ;
      console.log('HearingReDataList=', this.HearingReDataList);
      this.HearingReDataList.forEach(el => {
        this.HearingReList.push({
          label: el.Product_Description,
          value: el.Product_ID
        });
      
       
      });
           
    })

  }

  getAiProduct(){
    this.HearingAiList = [];
    const obj = {
      "SP_String": "sp_Joh_Realistic_Expectation",
      "Report_Name_String": "Get_Product_Acc",   
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.HearingAiDataList = data ;
      console.log('HearingAiDataList=', this.HearingAiDataList);
      this.HearingAiDataList.forEach(el => {
        this.HearingAiList.push({
          label: el.Product_Description,
          value: el.Product_ID
        });
      
       
      });
           
    })

  }

  getDateRange(dateRangeObj:any){
    if(dateRangeObj.length){
      this.objSearch.From_Date = dateRangeObj[0];
      this.objSearch.To_Date = dateRangeObj[1];
    }
   
  }

  getAlldata(){
    const start = this.objSearch.From_Date
    ? this.DateService.dateConvert(new Date(this.objSearch.From_Date))
    : this.DateService.dateConvert(new Date());
    const end = this.objSearch.To_Date
    ? this.DateService.dateConvert(new Date(this.objSearch.To_Date))
    : this.DateService.dateConvert(new Date());
    const tempobj = {
      FromDate : start,
      ToDate : end,
      Cost_Cen_ID : this.objSearch.Cost_Cen_ID ? this.objSearch.Cost_Cen_ID : 0,
    
    }
    const obj = {
      "SP_String": "sp_Joh_Realistic_Expectation",
      "Report_Name_String": "Browse_Joh_Realistic_Expectation",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Searchedlist = data;
      
       
       console.log('Searchedlist=====',this.Searchedlist);
       
       
       
     })

  }

  GetPrint(col){
    if (col.JRE_Id) {
      window.open("/Report/Crystal_Files/CRM/joh_Form/Joh_Realistic_Expectation_Print.aspx?JRE_Id=" + col.JRE_Id, 
      'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
      );

    }

  }

 

  AddRequirements(valid){
    this.RequirementsFormSubmit = true;
    if(valid){
      this.RequirementsListAdd.push({
        Listening_Needs : this.objRequirements.Listening_Needs,
        Present_Ability : this.objRequirements.Present_Ability,
        Expected_Ability : this.objRequirements.Expected_Ability,
        Agreed_Ability : this.objRequirements.Agreed_Ability,
        Final_Ability : this.objRequirements.Final_Ability

      });
      this.RequirementsFormSubmit = false;
      this.objRequirements = new Requirements();
    }

  }

  DeleteRequirements(index){
    this.RequirementsListAdd.splice(index,1);

  }

  EditRealistic(Col){
    if(Col.JRE_Id){
      this.JREId = Col.JRE_Id;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.getRealistic(Col.JRE_Id);
      }
  }

  getRealistic(JRE_Id){
    const obj = {
      "SP_String": "sp_Joh_Realistic_Expectation",
      "Report_Name_String":"Get_Joh_Realistic_Expectation",
      "Json_Param_String": JSON.stringify([{ JRE_Id: JRE_Id}]) 
      }
      this.GlobalAPI.getData(obj).subscribe((res:any)=>{
        let data = JSON.parse(res[0].Column1);
        console.log('Data=',data);
        this.objRealistic = data[0];
        this.RequirementsListAdd = data[0].L_element;
        this.objRealistic.Good_Hearing_Aids_L = Number(data[0].Good_Hearing_Aids_L);
        this.objRealistic.Good_Hearing_Aids_R = Number(data[0].Good_Hearing_Aids_R);
        this.objRealistic.Better_Hearing_Aids_L = Number(data[0].Better_Hearing_Aids_L);
        this.objRealistic.Better_Hearing_Aids_R = Number(data[0].Better_Hearing_Aids_R);
        this.objRealistic.Best_Hearing_Aids_L = Number(data[0].Best_Hearing_Aids_L);
        this.objRealistic.Best_Hearing_Aids_R = Number(data[0].Best_Hearing_Aids_R);
        this.objRealistic.Earing_Aids_A = Number(data[0].Earing_Aids_A);
        this.objRealistic.Earing_Aids_L = Number(data[0].Earing_Aids_L);
        this.objRealistic.Earing_Aids_R = Number(data[0].Earing_Aids_R);
        this.DOPAA_Date = new Date(data[0].Date_PAA);
        this.DOFAA_Date = new Date(data[0].Date_FAA);
      });
  }

  RealisticSave(valid){
    if(valid){
      this.Del =false;
      this.Save = true;
     //this.DelVoucherNo = col.Voucher_No ;
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
    this.RequirementsListAdd.forEach((ele) =>{
      this.Requirementadd.push({
        Listening_Needs : ele.Listening_Needs,
        Present_Ability : Number(ele.Present_Ability),
        Expected_Ability : Number(ele.Expected_Ability),
        Agreed_Ability : Number(ele.Agreed_Ability),
        Final_Ability :Number(ele.Final_Ability)
      })

    });
    this.objRealistic.Serial_Number_A = 'NA';
    this.objRealistic.Serial_Number_L = 'NA';
    this.objRealistic.Serial_Number_R = 'NA';
    this.objRealistic.Speech_Iden_Score_20_R = Number(this.objRealistic.Speech_Iden_Score_20_R);
    this.objRealistic.Speech_Iden_Score_20_L = Number(this.objRealistic.Speech_Iden_Score_20_L);
    this.objRealistic.Speech_Iden_Score_40_L = Number(this.objRealistic.Speech_Iden_Score_40_L);
    this.objRealistic.Speech_Iden_Score_40_R = Number(this.objRealistic.Speech_Iden_Score_40_R);
    this.objRealistic.L_element = this.Requirementadd;
    this.objRealistic.Date_PAA = this.DateService.dateConvert(this.DOPAA_Date);
    this.objRealistic.Date_FAA = this.DateService.dateConvert(this.DOFAA_Date);
    const obj = {
      "SP_String": "sp_Joh_Realistic_Expectation",
      "Report_Name_String":"Create_Joh_Realistic_Expectation",
      "Json_Param_String": JSON.stringify([this.objRealistic]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data : any)=>
     {
       console.log('data=',data);
       
       if(data[0].Column1)
       {
         
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Journal Voucher Create Succesfully ",
        detail: "Succesfully Created"
      });
      //this.getList();
     // this.PaymentRequisitionActionPOPUP = false;
     if (data[0].Column1) {
      window.open("/Report/Crystal_Files/CRM/joh_Form/Joh_Realistic_Expectation_Print.aspx?JRE_Id=" + data[0].Column1, 
      'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
      );
     }

     this.getAlldata();
      this.clearData();
      
      
      //this.HolidayListAdd = [];
      this.Spinner = false;
      this.tabIndexToView = 0;
       this.items = ["BROWSE", "CREATE"];
      }
      else{
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something Wrong"
      });
      this.clearData();
      this.Spinner = false;
      }
     });


  }

  onConfirm2(){

  }
  clearData(){
    this.objRealistic = new Realistic();
    this.objRequirements = new Requirements();
    this.RequirementsListAdd = [];
    this.DOB_Date = new Date();
    this.DOFAA_Date = new Date();
    this.DOPAA_Date = new Date();
    this.objRealistic.Cost_Cen_ID = this.commonApi.CompacctCookies.Cost_Cen_ID;
    this.Gender = undefined;
    this.getCustomId();
    this.JREId = undefined;

  }

}

class Realistic{
  Cost_Cen_ID : any;
  Foot_Fall_ID : any;
  Custom_ID:any;
  Audiologist_User_ID : any;
  Right_20 : any;
  Right_40 : any;
  Left_40 : any;
  Name : any;

  Speech_Iden_Score_20_R : any;
  Speech_Iden_Score_20_L : any;
  Speech_Iden_Score_40_R : any;
  Speech_Iden_Score_40_L : any;
  Good_Hearing_Aids_R  : any;
  Better_Hearing_Aids_R : any;
  Best_Hearing_Aids_R : any;
  Good_Hearing_Aids_L : any;
  Better_Hearing_Aids_L : any;
  Best_Hearing_Aids_L : any;
  Serial_Number_L : any;
  Serial_Number_R : any;
  Serial_Number_A : any;
  Customer_Remarks : any;
  Audiologist_Remarks : any;
  L_element : any;
  Date_PAA : any;
  Date_FAA : any;
  Earing_Aids_R : any;
  Earing_Aids_L : any;
  Earing_Aids_A : any;
  Appo_ID : any
 
  Remarks : any;
}
class Requirements{
  Listening_Needs: any;
  Present_Ability : any;
  Expected_Ability : any;
  Agreed_Ability : any;
  Final_Ability : any  

}
class Search{
  From_Date : any;
  To_Date : any;
  Cost_Cen_ID : any;

}
