import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute } from '@angular/router';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-followup-with-sales-details',
  templateUrl: './followup-with-sales-details.component.html',
  styleUrls: ['./followup-with-sales-details.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class FollowupWithSalesDetailsComponent implements OnInit {
  userid: any = undefined;
  FollowupWithSalesDetailsSubmitted:boolean = false;
  User_Id:any;
  userList: any = [];
  FollowupDate: Date = new Date();
  FollowupSalesDetailsList:any = [];
  FollowupSalesDetailsListDynmic:any = [];
  FollowupSalesDetailsListBackup:any = [];
  DistPatientID:any = [];
  SelectedDistPatientID:any = [];
  DistEnquirySource:any = [];
  SelectedDistEnquirySource:any = [];
  DistCostCenter:any = [];
  SelectedDistCostCenter:any = [];
  DistFollowupType:any = [];
  SelectedFollowupType:any = [];
  SearchFields:any = [];
  FootFallId: any;
  FlowDate: any;
  RemarksDis:boolean = false;
  Followup_Type: any;
  Disposal2nd: any = [];
  FollowupDateReg2: Date = new Date();
  Fname: any = undefined;
  FollowupModal: boolean = false;
  ObjFlow: Flow = new Flow();
  folloupFormSubmit: boolean = false;
  FollowUpList: any = [];
  ISused: any;
  disposalList:any = [];
  minumeDate: Date = new Date();


  constructor(
    private $http: HttpClient,  
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.userid = this.$CompacctAPI.CompacctCookies.User_ID
    this.Header.pushHeader({
      Header: "Sales Details Followup",
      Link: "Sales Details Followup"
    });
    this.getUsertype();
    this.getDisposial();
  }
  getUsertype() {
    this.userList = []
    const obj = {
      "SP_String": "sp_Followup_With_Sales_Details",
      "Report_Name_String": "Get_User_for_Sales_Details",
      "Json_Param_String": JSON.stringify([{User_ID : Number(this.userid)}]) ,
     }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
      if (data.length) {
        data.forEach(el => {
          el['label'] = el.User_Name;
          el['value'] = el.User_ID;
        });
        this.userList = data;
        if (this.$CompacctAPI.CompacctCookies.User_Type === "U") {
          this.User_Id = this.userList[0].User_ID;
        }   
      }
      })
  }
  GetFollowupSalesDetails(valid:any){
    this.FollowupWithSalesDetailsSubmitted = true;
    this.FollowupSalesDetailsList = [];  
    this.FollowupSalesDetailsListDynmic = [];
    this.FollowupSalesDetailsListBackup = [];
    if (valid) {
      this.ngxService.start();
     const RegObj = {
      User_ID: this.User_Id,
      Next_Followup:this.DateService.dateConvert(this.FollowupDate),
      }
      const obj = {
      "SP_String": "sp_Followup_With_Sales_Details",
      "Report_Name_String": "Get_Followup_With_Sales_Details",
      "Json_Param_String": JSON.stringify([RegObj]) ,
     }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
      if (data.length) {
        //console.log("RegObj ==", data)
        this.FollowupSalesDetailsList = data
        this.FollowupSalesDetailsListDynmic = Object.keys(data[0]);
        this.FollowupSalesDetailsListBackup = data
        this.ngxService.stop();
        this.FollowupWithSalesDetailsSubmitted = false;
        this.GetDistinct();
      } else {
        this.ngxService.stop();
      }
      }) 
    }
  }
  exportoexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
  // DISTINCT & FILTER
  GetDistinct() {
    let DEnquirySource:any = [];
    let DCostCenter:any = [];
    let DFollowType:any = [];
    this.DistEnquirySource =[];
    this.SelectedDistEnquirySource =[];
    this.DistCostCenter =[];
    this.SelectedDistCostCenter =[];
    this.DistFollowupType = [];
    this.SelectedFollowupType = [];
    this.SearchFields =[];
    this.FollowupSalesDetailsList.forEach((item) => {
    if (DEnquirySource.indexOf(item.Enq_Source_Name) === -1) {
      DEnquirySource.push(item.Enq_Source_Name);
      this.DistEnquirySource.push({ label: item.Enq_Source_Name, value: item.Enq_Source_Name });
    }
    if (DCostCenter.indexOf(item.Cost_Cen_Name) === -1) {
      DCostCenter.push(item.Cost_Cen_Name);
      this.DistCostCenter.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
    }
    if (DFollowType.indexOf(item.Followup_Type) === -1) {
      DFollowType.push(item.Followup_Type);
      this.DistFollowupType.push({ label: item.Followup_Type, value: item.Followup_Type });
    }
  });
     this.FollowupSalesDetailsListBackup = [...this.FollowupSalesDetailsList];
  }
  FilterDist() {
    let DEnquirySource:any = [];
    let DCostCenter:any = [];
    let DFollowType:any = [];
    this.SearchFields =[];
  if (this.SelectedDistEnquirySource.length) {
    this.SearchFields.push('Enq_Source_Name');
    DEnquirySource = this.SelectedDistEnquirySource;
  }
  if (this.SelectedDistCostCenter.length) {
    this.SearchFields.push('Cost_Cen_Name');
    DCostCenter = this.SelectedDistCostCenter;
  }
  if (this.SelectedFollowupType.length) {
    this.SearchFields.push('Followup_Type');
    DFollowType = this.SelectedFollowupType;
  }
  this.FollowupSalesDetailsList = [];
  if (this.SearchFields.length) {
    let LeadArr = this.FollowupSalesDetailsListBackup.filter(function (e) {
      return (DEnquirySource.length ? DEnquirySource.includes(e['Enq_Source_Name']) : true)
      && (DCostCenter.length ? DCostCenter.includes(e['Cost_Cen_Name']) : true)
      && (DFollowType.length ? DFollowType.includes(e['Followup_Type']) : true)
    });
  this.FollowupSalesDetailsList = LeadArr.length ? LeadArr : [];
  } else {
  this.FollowupSalesDetailsList = [...this.FollowupSalesDetailsListBackup] ;
  }
  }
  followup(col:any) {
    this.FootFallId = undefined;
    this.FlowDate = undefined;
    this.RemarksDis = false;
    this.Followup_Type = undefined;
    this.Disposal2nd = [];
    this.FollowupDateReg2 = new Date();
    if (col.Patient_ID) {
      this.Fname = col.Contact_Name+' / ('+col.Mobile+')';
       this.FootFallId = col.Patient_ID;
      this.FollowupModal = true;
      this.Followup_Type = col.Followup_Type;
      this.ObjFlow = new Flow();
      this.folloupFormSubmit = false;
    this.getPatatentFlow(col.Patient_ID) 
    } 
  }
  getPatatentFlow(FootId: any) {
    const obj = {
        "SP_String": "sp_Followup_Details",
        "Report_Name_String":"Get_followup_details_Into_Tree",
        "Json_Param_String": JSON.stringify([{Foot_Fall_ID : FootId}]) 
       }
    this.GlobalAPI.getData(obj).subscribe((data: any) => { 
       this.FollowUpList = data
    })
  }
  saveFollowUp(valid: any) {
    this.folloupFormSubmit = true;
    if (valid) {
      this.ObjFlow.Foot_Fall_ID = this.FootFallId,
      this.ObjFlow.Current_Action = 'Tele Call'
      this.ObjFlow.User_ID = this.userid,
      this.ObjFlow.Next_Followup = this.DateService.dateConvert(this.FollowupDateReg2),
      this.ObjFlow.Sent_To = this.userid ,
      this.ObjFlow.Used =  this.ISused,
      this.ObjFlow.Followup_Type = this.Followup_Type,
      this.ObjFlow.Is_Lost = 'Y'
      //console.log(this.ObjFlow)
       const obj = {
        "SP_String": "sp_Followup_Details",
        "Report_Name_String":"Insert_followup_details",
        "Json_Param_String": JSON.stringify([this.ObjFlow]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        //console.log("data",data)
        if(data[0].Column1){
          this.ObjFlow = new Flow();
          this.FollowupDateReg2 = new Date();
          this.folloupFormSubmit = false;
          this.FollowupModal = false;
          this.FootFallId = undefined;
          this.Followup_Type = undefined;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "FOLLOW UP",
            detail: "SAVE Succesfully "
          });
        }
       })
 
    }
    
  }
  redirectPatientDetails(cool:any) {
       if(cool.Patient_ID){
      window.open('/Hearing_CRM_Lead_Search?recordid=' + window.btoa(cool.Patient_ID));
    }
  }
  Appointment() {
      window.open('/Hearing_BL_CRM_Appointment');
  }
  getDisposial() {
    this.disposalList =[]
    const obj = {
      "SP_String": "sp_Followup_Details",
      "Report_Name_String": "Get_Disposition_dropdown",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        this.disposalList = JSON.parse(data[0].AA);
       // console.log('this.disposalList',this.disposalList)
      }
     })
  
  }
  GetSEndDispo(DispoId: any) {
    this.Disposal2nd = []
    this.RemarksDis = false;
    this.ObjFlow.Followup_Details = undefined;
    this.ObjFlow.Secondary_Desposition_ID = undefined;
    if (DispoId == 1) {
      this.disposalList[0].SEC_DETAIL.forEach((ele:any) => {
          ele['label'] = ele.Secondary_Desposition_Name;
          ele['value'] = ele.Secondary_Desposition_ID;
        });
        this.Disposal2nd = this.disposalList[0].SEC_DETAIL; 
    }
    if (DispoId == 2) {
       this.disposalList[1].SEC_DETAIL.forEach((el:any) => {
          el['label'] = el.Secondary_Desposition_Name;
          el['value'] = el.Secondary_Desposition_ID;
        });
        this.Disposal2nd = this.disposalList[1].SEC_DETAIL;
    }
    if (DispoId == 3) {
      this.disposalList[2].SEC_DETAIL.forEach((el:any) => {
         el['label'] = el.Secondary_Desposition_Name;
         el['value'] = el.Secondary_Desposition_ID;
       });
       this.Disposal2nd = this.disposalList[2].SEC_DETAIL;
   }
  }
  getDisable() {
    this.RemarksDis = false;
    this.ISused = undefined;
    if (this.ObjFlow.Secondary_Desposition_ID) {
      let arrayfilt = this.Disposal2nd.filter((Ele: any) => { return Ele.Secondary_Desposition_ID === this.ObjFlow.Secondary_Desposition_ID });
      this.ObjFlow.Followup_Details = arrayfilt[0].Secondary_Desposition_Name
      // this.RemarksDis = arrayfilt[0].Show_Remarks === 'Y' ? false : true;
      this.ISused = arrayfilt[0].Is_Used;
    }
  }   
}
class Flow{
  Foot_Fall_ID: any;
  Followup_Details:any;                                  
  Followup_Action:any;                                   
  Current_Action:any;                                   
  User_ID:any;                                        
  Sent_To:any;                                          
  Used:any;                                            
  Followup_Type :any;                                    
  Next_Followup:any;                                     
  Is_Lost: any; 
  Disposition_ID: any;
  Secondary_Desposition_ID:any
}


