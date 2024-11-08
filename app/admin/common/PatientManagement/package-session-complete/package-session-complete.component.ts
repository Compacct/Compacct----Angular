import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { CompacctCommonApi } from './../../../shared/compacct.services/common.api.service';
import { DateTimeConvertService } from './../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from './../../../shared/compacct.services/compacct.global.api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctHeader } from './../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { last } from 'rxjs/operators';
@Component({
  selector: 'app-package-session-complete',
  templateUrl: './package-session-complete.component.html',
  styleUrls: ['./package-session-complete.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class PackageSessionCompleteComponent implements OnInit {

  objpackageSessionComplete:packageSessionComplete = new packageSessionComplete()
  packageSessionCompleteFormSumit = false
  nameList = []
  packageList = []
  sessionDataList:any = []
  Spinner = false
  checkAll = false
  constructor(  
    private header:CompacctHeader,
    private $http: HttpClient,
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,) { }

  ngOnInit() {
    this.header.pushHeader({
      Header: "Package Session Complete",
      Link: "Patient Management -> Package Session Complete",   
  })
  }
  changeNumber(){
    this.nameList = []
    this.packageList = []
    this.sessionDataList = []
    if( this.objpackageSessionComplete.Mobile.toString().length == 10 ){
      this.getNames()
    }
  }

  getNames(){
    const para = new HttpParams().set("Mobile", this.objpackageSessionComplete.Mobile);
    this.$http.get('/BL_CRM_Registration/Get_Name_From_Mobile',{params: para}).subscribe((data:any)=>{
     this.nameList = data ? JSON.parse(data) : []
    })
  }
  changeName(){
    this.packageList = []
    this.sessionDataList = []
    if(this.objpackageSessionComplete.FootFallID){
      this.getPackages()
    }
  }

  getPackages(){
    const para = new HttpParams().set("Foot_Fall_Id", this.objpackageSessionComplete.FootFallID);
    this.$http.get('/BL_CRM_Appointment/Get_Package_for_Appointment',{params: para}).subscribe((data:any)=>{
     this.packageList = data ? JSON.parse(data) : []
     this.packageList = this.packageList.filter((el:any)=> el.Is_Active == 'Y')
    })
  }

  getSessionDataList(){
    this.sessionDataList = []
    if(Object.values(this.objpackageSessionComplete).length == 3){
      const filterPackageList:any = this.packageList.filter((el:any)=> el.Package_ID == this.objpackageSessionComplete.Package_ID )
      const para = new HttpParams().set("AO_Doc_No", filterPackageList[0].Order_No)
                                   .set('Foot_Fall_Id',this.objpackageSessionComplete.FootFallID)
                                    .set('Package_ID',this.objpackageSessionComplete.Package_ID)   ;
      this.$http.get('/BL_CRM_Appointment/Get_Package_Sub_Type_for_Appointment',{params: para}).subscribe((data:any)=>{
       this.sessionDataList = data ? JSON.parse(data) : []
       this.sessionDataList = this.sessionDataList.map( (el:any)=> {
        return {...el,...{check:false}}
       }  )
      })
    }
   
  } 
  checkAllBox(){
    this.sessionDataList.forEach((ele:any) => {
      ele.check = this.checkAll
    });
  }
  updatePackage(){
    const filterTrueObject = this.sessionDataList.filter((el:any) => el.check == true )

    if(filterTrueObject.length <= 0){
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "error",
       summary: "Warn Message",
       detail: "No Session Select"
      });
    }
    this.Spinner = true
   const filterPackageList:any = this.packageList.filter((el:any)=> el.Package_ID == this.objpackageSessionComplete.Package_ID )
   const tempObj =   {
      "Appo_ID": 0,
      "Follow_Up_ID": 0,
      "Cost_Cen_ID": this.$CompacctAPI.CompacctCookies.Cost_Cen_ID, 
      "Consultancy_Type": "Hair",
      "Status": "Therapy Done",
      "Chargeable": false,
      "Appo_Dt": this.DateService.dateTimeConvert(new Date()),
      "Cons_ID": 0,
      "Doctor_ID": 0,
      "User_ID": this.$CompacctAPI.CompacctCookies.User_ID,
      "Posted_On": "8-Nov-2024  1:12 pm",
      "Followup_Visit": false,
      "CRM_Note": "Manually Completed without Bill",
      "Schedule_ID": 0,
      "Appo_End_Dt": this.DateService.dateTimeConvert(new Date()),
      "AO_Doc_No": filterPackageList[0].Order_No,
      "Foot_Fall_ID": this.objpackageSessionComplete.FootFallID, 
      "Package_Selection_ID": this.objpackageSessionComplete.Package_ID,
    }
    const seveData = filterTrueObject.map((el:any)=> {
       return {...tempObj,...{ "Cons_Sub_ID": el.Cons_Sub_ID}}
    } )
    if(seveData.length){
      this.$http.post('/BL_CRM_Appointment/Insert_Appointment',{Appointment_String :JSON.stringify(seveData)}).subscribe((data:any)=>{
        console.log(data)
        if (data.success) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Completed"
            });
            this.nameList = []
            this.packageList = []
            this.sessionDataList = []
            this.Spinner = false;
            this.objpackageSessionComplete = new packageSessionComplete()
        } else {
          this.Spinner = false
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
        
      })
      
    }
  }

}


class packageSessionComplete {
  Mobile:any
  Package_ID:any
  FootFallID:any
}