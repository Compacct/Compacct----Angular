import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";

@Component({
  selector: 'app-joh-ear-mold',
  templateUrl: './joh-ear-mold.component.html',
  styleUrls: ['./joh-ear-mold.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class JOHEarMoldComponent implements OnInit {
  tabIndexToView : any = 0;
  buttonname : any= "Create";
  Spinner : any = false;
  seachSpinner : any = false;
  TabSpinner : any = false;
  can_popup : any = false;
  Del =false;
  Save = false;
  items : any= [];
  Mould_Request_Date : any = new Date();
  POD_Request_Date : any = new Date();
  Received_On_Date : any = new Date();
  objEarMold : EarMold = new EarMold();
  objSearch : Search = new Search();
  objPod : Pod = new Pod();
  earMoldFormSubmit : any = false;
  searchFormsubmit : any = false;
  subledgerList : any = [];
  SubLedgerdataList : any = [];
  costCenterList : any = [];
  costCenterdataList : any = [];
  patientList : any = [];
  patientdataList : any = [];
  doctorList : any = [];
  doctorDataList : any = [];
  initDate : any = [];
  Searchedlist : any = [];
  getEarMoldData : any = [];

  Preference : any;
  User_type : any;
  Priority : any;
  Type : any
  Type_R : any;
  Type_L : any;
  User_Preferences_R : any;
  User_Preferences_L : any;
  Receiver_Preference_R_Details : any;
  Receiver_Preference_R : any;
  Receiver_Preference_L_Details : any;
  Receiver_Preference_L : any;
  Venting_R : any;
  Venting_L : any;
  Mold_Material_L : any;
  Mold_Material_R : any;
  Audiologist_User_ID : any;
  user_preference : any;
  receiver_right : any;
  receiver_left : any;
  venting : any;
  Mold_Material : any;
  Style_Left : any;
  Style_Right : any;
  modifiction : any;
  ViewProTypeModal : boolean = false;
  PODformsubmit : any = false;

  MouldNo : any;
  DelMouldNo : any;
  DelRight : any;
  deviceList : any = [];
  deviceDataList : any = [];
  ReceiverLengthList : any = [];
  getPODData : any = [];
  userType : any;
  checked : boolean = false;

  // RightRl :any = undefined;
  // LeftRl :any = undefined;
  // RightRt :any = undefined;
  // LeftRt : any = undefined;

  // ReceiverPreferenceR : boolean = true;
  // ReceiverTypeR : boolean = true;
  // ReceiverPreferenceL : boolean = true;
  // ReceiverTypeL : boolean= true;


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
    this.ReceiverLengthList = ["0", "1", "2", "3", "4", "5"]
    this.Header.pushHeader({
      Header: "CUSTOM PRODUCT/EAR MOLD ORDER FORM",
      Link: " PatientManagement --> JOH Ear Mold"
    });
    
    this.DelRight = this.commonApi.CompacctCookies.Del_Right;
    this.userType = this.commonApi.CompacctCookies.User_Type;
    console.log('userType=', this.userType);
    console.log("this.DelRight=",this.DelRight);
    this.GetSubledger();
    this.getCostCenter();
    this.getPatient();
    this.getDoctor();
    this.getDevice();
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
  
  GetSubledger(){
    this.subledgerList = [];
    const obj = {
      "SP_String": "sp_JOH_Ear_Mold",
      "Report_Name_String": "Get_Sub_Ledger",   
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.SubLedgerdataList = data ;
      console.log("subLedgerList",this.SubLedgerdataList);
        this.SubLedgerdataList.forEach(el => {
          this.subledgerList.push({
            label: el.Sub_Ledger_Name,
            value: el.Sub_Ledger_ID
          });
         
        });
        
    })
  }

  getCostCenter(){
    this.costCenterList = [];
    const obj = {
      "SP_String": "sp_JOH_Ear_Mold",
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
        if(this.userType == "U"){
        this.objSearch.Cost_Center_ID = this.commonApi.CompacctCookies.Cost_Cen_ID;
      }
      else{
        this.objSearch.Cost_Center_ID = undefined;
      }
        
    })

  }

  getPatient(){
      this.patientList = [];
      const obj = {
        "SP_String": "sp_JOH_Ear_Mold",
        "Report_Name_String": "Get_Contact_Name_Mobile",   
        
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log(data);
        this.patientdataList = data ;
        console.log("patientdataList=",this.patientdataList);
          this.patientdataList.forEach(el => {
            this.patientList.push({
              label: el.Patient,
              value: el.Foot_Fall_ID
            });
           
          });
          
      })
  
    }

    getDoctor(){
      this.doctorDataList = [];
      const obj = {
        "SP_String": "sp_JOH_Ear_Mold",
        "Report_Name_String": "Get_Doctor_Name",   
        
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log(data);
        this.doctorList = data ;
        console.log("doctorList=",this.doctorList);
        this.doctorList.forEach(el => {
          this.doctorDataList.push({
            label: el.Audologist_Name,
            value: el.Doctor_ID
          });
         
        });

          
      })
  
    }

    getDevice(){
      this.deviceDataList = [];
      const obj = {
        "SP_String": "sp_JOH_Ear_Mold",
        "Report_Name_String": "Get_Product_Name",   
        
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log(data);
        this.deviceList = data ;
        console.log("deviceList=",this.deviceList);
        this.deviceList.forEach(el => {
          this.deviceDataList.push({
            label: el.Product_Name,
            value: el.Product_ID
          });
         
        });
          
      })
 
    }

    GetPodUpdate(){

    }

    

    // getEnable(value : any){
    //   //console.log("Enabled");
    //   if(value == "Receiver Length")
    //   {
    //     this.ReceiverPreferenceR = false;
    //     this.ReceiverTypeR = true;
    //     this.RightRt = undefined;
    //   }
    //   else{
    //     this.ReceiverTypeR = false;
    //     this.ReceiverPreferenceR = true;
    //     this.RightRl = undefined;
    //   }
    // }

    // getEnable2(value : any){
    //   if(value == "Receiver Length")
    //   {
    //     this.ReceiverPreferenceL = false;
    //     this.ReceiverTypeL = true;
    //     this.LeftRt = undefined
    //   }
    //   else{
    //     this.ReceiverTypeL = false;
    //     this.ReceiverPreferenceL = true;
    //     this.LeftRl = undefined;
    //   }

    // }

    SaveEarMold(valid){
      this.earMoldFormSubmit = true;;
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

    EditEarMold(Col){
      if(Col.Mould_Request_ID){
        this.MouldNo = Col.Mould_Request_ID;
        this.tabIndexToView = 1;
        this.items = ["BROWSE", "UPDATE"];
        this.buttonname = "Update";
        this.getEarMold(Col.Mould_Request_ID);
        }

    }

    DeleteEarMold(col){
      this.DelMouldNo =undefined;
      
      if(col.Mould_Request_ID){
         this.Del =true;
         this.Save = false;
        this.DelMouldNo = col.Mould_Request_ID ;
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

    PODUpdate(col){
      this.PODformsubmit = false;
      let MoldId = col.Mould_Request_ID;
      const obj = {
        "SP_String": "sp_JOH_Ear_Mold",
        "Report_Name_String":"Retrieve_POD_From_JOH_Ear_Mold",
        "Json_Param_String": JSON.stringify([{ Mould_Request_ID: MoldId}]) 
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          console.log('Data=',data);
          this.objPod = data[0];
          this.getPODData = data;
          this.checked = data[0].Received == 'Y'? true : false;
          this.POD_Request_Date =data[0].POD_Date== null?new Date(): new Date(data[0].POD_Date);
          this.Received_On_Date = data[0].POD_Date== null? new Date():new Date(data[0].Received_Date);
          this.MouldNo = data[0].Mould_Request_ID;
        
    });
      setTimeout(() => {
        this.ViewProTypeModal = true;
      }, 300);

    }

  

    GetPodSave(valid){
      this.PODformsubmit = true;
      if(valid){
        this.objPod.POD_Date = this.DateService.dateConvert(this.POD_Request_Date);
        this.objPod.Received_Date = this.DateService.dateConvert(this.Received_On_Date);
        this.objPod.Received = this.checked == true? 'Y' : 'N';
        this.objPod.Mould_Request_ID = this.MouldNo;
        const obj = {
          "SP_String": "sp_JOH_Ear_Mold",
          "Report_Name_String":"update_POD_JOH_Ear_Mold",
          "Json_Param_String": JSON.stringify([this.objPod]) 
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
            summary: "POD Update Succesfully ",
            detail: "Succesfully Updated"
          });
          this.ViewProTypeModal = false
          
          this.getAlldata(true);
         // this.PaymentRequisitionActionPOPUP = false;
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
          // this.clearData();
          this.Spinner = false;
          }
         });
         
  

      }

    }

    GetPrint(col){
      if (col.Mould_Request_ID) {
        window.open("/Report/Crystal_Files/CRM/joh_Form/Ear_Mold_Print.aspx?Mould_Request_ID=" + col.Mould_Request_ID, 
        'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
        );

      }

    }

    getEarMold(Mould_Request_ID){
      const obj = {
        "SP_String": "sp_JOH_Ear_Mold",
        "Report_Name_String":"Retrieve_Data_From_JOH_Ear_Mold",
        "Json_Param_String": JSON.stringify([{ Mould_Request_ID: Mould_Request_ID}]) 
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          console.log('Data=',data);
          this.objEarMold = data[0];
          this.getEarMoldData = data;
          this.Mould_Request_Date = new Date(data[0].Mould_Request_Date);
          this.Preference = data[0].Preference;
          this.User_type = data[0].User_type;
          this.Priority = data[0].Priority;
          // this.objEarMold.Right_Product_ID = data[0].Right_Product_ID == 1 ? 'YES' : undefined;
          // this.objEarMold.Left_Product_ID = data[0].Left_Product_ID == 1 ? 'YES' : undefined;
          this.Type_R = data[0].Type_R;
          this.Type_L = data[0].Type_L;
          this.User_Preferences_R = data[0].User_Preferences_R;
          this.User_Preferences_L = data[0].User_Preferences_L;
          
          // this.Receiver_Preference_R = data[0].Receiver_Preference_R;
          // this.Receiver_Preference_L = data[0].Receiver_Preference_L;
          this.objEarMold.Receiver_Length_R = data[0].Receiver_Length_R ? data[0].Receiver_Length_R : undefined;
          this.objEarMold.Receiver_Length_L = data[0].Receiver_Length_L ? data[0].Receiver_Length_L : undefined;
          this.Venting_R = data[0].Venting_R;
          this.Venting_L = data[0].Venting_L;
          this.Mold_Material_R = data[0].Mold_Material_R;
          this.Mold_Material_L = data[0].Mold_Material_L;
          this.Style_Left = data[0].Style_Left;
          this.Style_Right = data[0].Style_Right;
          this.modifiction = data[0].Remake;
          this.objEarMold.Right_Product_ID = data[0].Right_Product_ID;
          this.objEarMold.Left_Product_ID = data[0].Left_Product_ID;
          // if(data[0].Receiver_Preference_R == "Receiver Length")
          // {
          //   this.RightRl = data[0].Receiver_Preference_R_Details? data[0].Receiver_Preference_R_Details : undefined;
          //   this.ReceiverPreferenceR = false;
          // }
          // else{
          //   this.RightRt = data[0].Receiver_Preference_R_Details? data[0].Receiver_Preference_R_Details : undefined;
          //   this.ReceiverTypeR = false;
          // }

          // if(data[0].Receiver_Preference_L == "Receiver Length")
          // {
          //   this.LeftRl = data[0].Receiver_Preference_L_Details? data[0].Receiver_Preference_L_Details : undefined;
          //   this.ReceiverPreferenceL = false;
          // }
          // else
          // {
          //   this.LeftRt = data[0].Receiver_Preference_L_Details? data[0].Receiver_Preference_L_Details : undefined;
          //   this.ReceiverTypeL = false;
          // }
       
    });
    }
  

  onConfirm(){
    this.objEarMold.Mould_Request_Date = this.DateService.dateConvert(this.Mould_Request_Date);
    this.objEarMold.Preference = this.Preference;
    this.objEarMold.User_type = this.User_type;
    this.objEarMold.Priority = this.Priority;
    // this.objEarMold.Right_Product_ID = this.objEarMold.Right_Product_ID == "YES"? 1 : 0;
    // this.objEarMold.Left_Product_ID = this.objEarMold.Left_Product_ID == "YES"? 1 : 0;
    this.objEarMold.Type_R = this.Type_R;
    this.objEarMold.Type_L = this.Type_L;
    this.objEarMold.User_Preferences_R = this.User_Preferences_R;
    this.objEarMold.User_Preferences_L = this.User_Preferences_L;
    // this.objEarMold.Receiver_Preference_R = this.Receiver_Preference_R;
    // this.objEarMold. Receiver_Preference_L = this.Receiver_Preference_L;
    //this.objEarMold.Receiver_Type_R = this.receiver_left;
    // this.objEarMold.Receiver_Preference_R_Details = this.RightRl? this.RightRl : this.RightRt;
    // this.objEarMold.Receiver_Preference_L_Details = this.LeftRl ? this.LeftRl : this.LeftRt;
    this.objEarMold.Venting_R = this.Venting_R;
    this.objEarMold.Venting_L = this.Venting_L;
    this.objEarMold.Mold_Material_R = this.Mold_Material_R;
    this.objEarMold.Mold_Material_L = this.Mold_Material_L;
    this.objEarMold.Style_Left = this.Style_Left;
    this.objEarMold.Style_Right = this.Style_Right;
    this.objEarMold.Remake = this.modifiction;
    // this.objEarMold.Receiver_Length_L = "NA";
    // this.objEarMold.Receiver_Type_L = "NA";

    if(this.MouldNo){
      this.objEarMold.Mould_Request_ID = this.MouldNo;

      const obj = {
        "SP_String": "sp_JOH_Ear_Mold",
        "Report_Name_String":"update_JOH_Ear_Mold",
        "Json_Param_String": JSON.stringify([this.objEarMold]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data : any)=>
       {
         console.log('data=',data);
         console.log(data[0].Column1)
         
         if(data[0].Column1)
         {
           
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Ear Mold Update Succesfully ",
          detail: "Succesfully Updated"
        });
        if (data[0].Column1) {
          window.open("/Report/Crystal_Files/CRM/joh_Form/Ear_Mold_Print.aspx?Mould_Request_ID=" + data[0].Column1, 
          'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
          );
        }
        this.getAlldata(true);
       // this.PaymentRequisitionActionPOPUP = false;
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
        // this.clearData();
        this.Spinner = false;
        }
       });
       

    }
    else{

    const obj = {
      "SP_String": "sp_JOH_Ear_Mold",
      "Report_Name_String":"insert_JOH_Ear_Mold",
      "Json_Param_String": JSON.stringify([this.objEarMold]) 
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
        summary: "Ear Mold Create Succesfully ",
        detail: "Succesfully Created"
      });
      if (this.objEarMold.Foot_Fall_ID) {
        window.open("/Report/Crystal_Files/CRM/joh_Form/Ear_Mold_Print.aspx?Mould_Request_ID=" + data[0].Column1, 
        'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
        );
      }
      this.getAlldata(true);
     // this.PaymentRequisitionActionPOPUP = false;
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

  }

  onConfirm2(){
    if(this.DelMouldNo){
      const tempobj = {
        Mould_Request_ID : this.DelMouldNo,
        
      }
      const obj = {
        "SP_String": "sp_JOH_Ear_Mold",
        "Report_Name_String": "Delete_JOH_Ear_Mold",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log("del Data===", data[0].Column1)
        if (data[0].Column1){
          this.onReject();
          
          this.DelMouldNo = undefined ;
        //  this.can_popup = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "User ",
            detail: "Succesfully Deleted"
          });
         }
      });
      this.clearData();
      this.getAlldata(true);
    }
  }

  getDateRange(dateRangeObj:any){
    if(dateRangeObj.length){
      this.objSearch.From_Date = dateRangeObj[0];
      this.objSearch.To_Date = dateRangeObj[1];
    }
   
  }

  getAlldata(valid){
    this.searchFormsubmit = true;
    // if(valid){
    const start = this.objSearch.From_Date
    ? this.DateService.dateConvert(new Date(this.objSearch.From_Date))
    : this.DateService.dateConvert(new Date());
    const end = this.objSearch.To_Date
    ? this.DateService.dateConvert(new Date(this.objSearch.To_Date))
    : this.DateService.dateConvert(new Date());
   
  
  const tempobj = {
    FromDate : start,
    ToDate : end,
    Cost_Center_ID : this.objSearch.Cost_Center_ID ? this.objSearch.Cost_Center_ID : 0,
  
  }
  const obj = {
    "SP_String": "sp_JOH_Ear_Mold",
    "Report_Name_String": "Browse_JOH_Ear_Mold",
    "Json_Param_String": JSON.stringify([tempobj])
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Searchedlist = data;
    
     
     console.log('Searchedlist=====',this.Searchedlist);
     this.searchFormsubmit = false;
     
     
   })
  // }
  
  }
 clearData(){
  this.objEarMold = new EarMold();
  this.objPod = new Pod();
  this.Preference = undefined;
  this.User_type = undefined;
  this.Priority = undefined;
  this.Type = undefined;
  this.user_preference = undefined;
  this.receiver_right = undefined;;
  this.receiver_left = undefined;
  this.venting = undefined;
  this.Mold_Material = undefined;
  this.Style_Left = undefined;
  this.Style_Right = undefined;
  this.modifiction = undefined;
  this.Mould_Request_Date  = new Date();
  this.POD_Request_Date  = new Date();
  this.Received_On_Date = new Date();
  this.earMoldFormSubmit = false;
  this.searchFormsubmit = false;
  this.PODformsubmit = false;
  this.MouldNo = undefined;
  this.DelMouldNo = undefined;

  this.Type_R = undefined;
  this.Type_L = undefined;
  this.User_Preferences_R = undefined;
  this.User_Preferences_L = undefined;
  this.Receiver_Preference_R = undefined;
  this.Receiver_Preference_L = undefined;
  // this.RightRl = undefined;
  // this.RightRt = undefined;
  // this.LeftRl = undefined;
  // this.LeftRt = undefined;
  this.Venting_R = undefined;
  this.Venting_L = undefined;
  this.Mold_Material_R = undefined;
  this.Mold_Material_L = undefined;
  // this.ReceiverPreferenceR  = true;
  // this.ReceiverTypeR  = true;
  // this.ReceiverPreferenceL  = true;
  // this.ReceiverTypeL = true;

}

}
class EarMold{
  Mould_Request_ID : any;
  Mould_Request_Date : any;
  User_type : any;
  Priority : any;
  Right_Product_ID : any;
  Left_Product_ID : any;
  Type : any;
  User_Preferences : any;
  Receiver_Length_R : any;
  Receiver_Type_R : any;
  Venting : any;
  Mold_Material : any;
  Style_Left : any;
  Style_Right : any;
  Sub_Ledger_ID : any;
  Cost_Center_ID : any;
  Foot_Fall_ID : any;
  Right_250 : any;
  Right_500 : any;
  Right_1000 : any;
  Right_2000 : any; 
  Right_4000 : any;
  Right_8000 : any;
  Left_250 : any;
  Left_500 : any;
  Left_1000 : any;
  Left_2000 : any;
  Left_4000 : any;
  Left_8000 : any;
  Remake : any;
  Remarks : any;
  Add_Vent : any;
  Reduce_Vent : any;
  Preference : any;
  
  Receiver_Length_L : any;
  Receiver_Type_L : any;
  Receiver_Preference_R_Details : any;
  Receiver_Preference_L_Details : any;
  Audiologist_User_ID : any;

  Type_R : any;
  Type_L : any;
  User_Preferences_R : any;
  User_Preferences_L : any;
  Receiver_Preference_R : any;
  Receiver_Preference_L : any;
  Venting_R : any;
  Venting_L : any;
  Mold_Material_R : any;
  Mold_Material_L : any;

}

class Search{
  From_Date : any;
  To_Date : any;
  Cost_Center_ID : any;

}
class Pod{
  POD_No : any;
  POD_No_HO : any;
  POD_Date : any;
  Courrier_No : any;
  Received : any;
  Received_Date : any;
  Mould_Request_ID : any;
}