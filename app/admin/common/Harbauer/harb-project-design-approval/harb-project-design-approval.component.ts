import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service"
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-harb-project-design-approval',
  templateUrl: './harb-project-design-approval.component.html',
  styleUrls: ['./harb-project-design-approval.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HarbProjectDesignApprovalComponent implements OnInit {
  tabIndexToView:number = 0;
  items:any = []
  buttonname:string = "Create"
  objdesignApproval:designApproval = new designApproval()
  ObjdesignDisApproval:designDisApproval = new designDisApproval()
  pendingFormSubmit:boolean = false
  projectList:any = []
  SiteList:any = []
  uploadDialog:boolean = false
  docName:string = "";
  ProductPDFFile:any = {}
  uploadFormSubmit:boolean = false
  pendingList:any = []
  DynamicHeaderpendingList:any = []
  SpinnerUpload:boolean = false
  projectID:any = undefined
  SiteID:any = undefined
  approvalList:any = []
  DynamicHeader:any = []
  ProjectDesignID:any = undefined
  SiteListApproval:any = []
  SiteListDisApproval:any = []
  DynamicHeaderDisapprova:any = []
  DisapprovalList:any = []
  @ViewChild("fileInput", { static: false }) fileInput!: FileUpload;
  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private route : ActivatedRoute,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Project Design Approval", 
      Link: "Project Management -> Project Design Approval"
    });
    this.items = ["PENDING","APPROVE","DISAPPROVE"];
    this.getProject()
    this.getPendingValue()
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["PENDING","APPROVE","DISAPPROVE"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){
    this.items = ["PENDING","APPROVE","DISAPPROVE"];
    this.buttonname = "Create";
    this.pendingFormSubmit = false
    this.uploadDialog = false
    this.ProductPDFFile = {}
    this.uploadFormSubmit = false
    this.SpinnerUpload = false
    this.fileInput.clear();
    this.ProjectDesignID = undefined
    this.getApproval()
    this.getPendingValue()
    this.getDisApproval()
  }
 
  onReject() {
    this.compacctToast.clear("a");
    this.compacctToast.clear("d");
  }
  getProject(){
    const obj = {
      "SP_String": "SP_Task_Management_Tender",
      "Report_Name_String": "Get_Project_All"
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          
           if(data.length){
            data.forEach(x => {
             x['label'] = x.Project_Description
             x['value'] = x.Project_ID
            });
            this.projectList = data
            console.log("project",this.projectList)
           }
          
        })
  }
  getSite(){
    if(this.objdesignApproval.Project_ID ){
      this.objdesignApproval.Site_ID = undefined;
      this.SiteList = []
      const projectFilter = this.projectList.find((xz:any)=> Number(xz.Project_ID) == Number(this.objdesignApproval.Project_ID))
      if(projectFilter){
        const tempObj = {
          Project_ID: Number(this.objdesignApproval.Project_ID),
          Tender_Doc_ID:projectFilter.Tender_Doc_ID
        }
        
        const obj = {
          "SP_String": "SP_Tender_Management_All",
          "Report_Name_String": "Get_Site_For_Project_Planning",
          "Json_Param_String": JSON.stringify([tempObj])
          }
        this.GlobalAPI
        .getData(obj)
        .subscribe((data:any)=>{
          console.log("site",data)
         if(data.length){
            data.forEach((x:any) => {
              x['label'] = x.Site_Description
             x['value'] = x.Site_ID
            });
            this.SiteList = data
         }
        })
      }
     
    }
    else {
      this.objdesignApproval.Site_ID = undefined;
      this.SiteList = []

    }
    this.getPendingValue()
  }
  getSiteApproval(){
    if(this.projectID){
      this.SiteID = undefined
      this.SiteListApproval = []
      const projectFilter = this.projectList.find((xz:any)=> Number(xz.Project_ID) == Number(this.projectID))
      if(projectFilter){
        const tempObj = {
          Project_ID: Number(this.projectID),
          Tender_Doc_ID:projectFilter.Tender_Doc_ID
        }
        
        const obj = {
          "SP_String": "SP_Tender_Management_All",
          "Report_Name_String": "Get_Site_For_Project_Planning",
          "Json_Param_String": JSON.stringify([tempObj])
          }
        this.GlobalAPI
        .getData(obj)
        .subscribe((data:any)=>{
          console.log("site",data)
         if(data.length){
            data.forEach((x:any) => {
              x['label'] = x.Site_Description
             x['value'] = x.Site_ID
            });
            this.SiteListApproval = data
         }
        })
      }
     
    }
    else {
      this.SiteID = undefined;
      this.SiteListApproval = []

    }
    this.getApproval()
  }
  getSiteDisApproval(){
    if(this.ObjdesignDisApproval.Project_ID){
      this.SiteID = undefined
      this.SiteListApproval = []
      const projectFilter = this.projectList.find((xz:any)=> Number(xz.Project_ID) == Number(this.ObjdesignDisApproval.Project_ID))
      if(projectFilter){
        const tempObj = {
          Project_ID: Number(this.ObjdesignDisApproval.Project_ID),
          Tender_Doc_ID:projectFilter.Tender_Doc_ID
        }
        
        const obj = {
          "SP_String": "SP_Tender_Management_All",
          "Report_Name_String": "Get_Site_For_Project_Planning",
          "Json_Param_String": JSON.stringify([tempObj])
          }
        this.GlobalAPI
        .getData(obj)
        .subscribe((data:any)=>{
          console.log("site",data)
         if(data.length){
            data.forEach((x:any) => {
              x['label'] = x.Site_Description
             x['value'] = x.Site_ID
            });
            this.SiteListDisApproval = data
         }
        })
      }
     
    }
    else {
      this.ObjdesignDisApproval.Site_ID = undefined;
      this.SiteListDisApproval = []
     }
    this.getDisApproval()
  }
  getPendingValue(){
    if(this.objdesignApproval.Project_ID && this.objdesignApproval.Site_ID){
      const tempObj = {
            User_ID	: this.$CompacctAPI.CompacctCookies.User_ID,
				  	Project_ID:	this.objdesignApproval.Project_ID,
				  	Site_ID	: this.objdesignApproval.Site_ID
      }
      const obj = {
        "SP_String": "SP_Project_Design_Approval",
        "Report_Name_String": "Get_Pending_Design",
        "Json_Param_String": JSON.stringify([tempObj])
        }
      this.GlobalAPI
      .getData(obj)
      .subscribe((data:any)=>{
        this.DynamicHeaderpendingList = data.length ? Object.keys(data[0]) : []
         this.pendingList = data
         console.log("pendingList",this.pendingList)
      })
    }
  }
  getApproval(){
    if(this.projectID && this.SiteID){
      const tempObj = {
        Project_ID:	Number(this.projectID),
        Site_ID	: Number(this.SiteID)
  }
  const obj = {
    "SP_String": "SP_Project_Design_Approval",
    "Report_Name_String": "Get_Approved_Design",
    "Json_Param_String": JSON.stringify([tempObj])
    }
  this.GlobalAPI
  .getData(obj)
  .subscribe((data:any)=>{
    if(data.length){
      this.DynamicHeader = Object.keys(data[0])
      this.approvalList = data
    }
  })
    }
    else{
      this.DynamicHeader = [];
      this.approvalList = []

    }
  }
  UploadPopUp(valid:any){
    console.log("valid",valid)
   this.pendingFormSubmit = true 
   if(valid){
    this.uploadFormSubmit = false
    this.docName = ""
    this.ProductPDFFile = {}
    this.fileInput.clear();
    this.SpinnerUpload = false
     setTimeout(() => {
      this.uploadDialog = true
     }, 400);
   }
  }
  handleFileSelect(event:any) {
    this.ProductPDFFile = {};
    if (event) {
      console.log(event)
      this.ProductPDFFile = event.files[0];
   }
  }
  UploadDoc(valid:any){
    this.uploadFormSubmit = true
   if(this.docName && this.ProductPDFFile['size']){
    this.SpinnerUpload =true
    this.GlobalAPI.CommonFileUpload(this.ProductPDFFile)
    .subscribe((data : any)=>
    {
      if(data.file_url){
        this.saveDoc(data.file_url)
      }
      else {
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Fail to upload"
      });
      }
    }) 
   }
  }
  saveDoc(fileUrl:any){
    const tempSaveDataObj = {
      Project_ID:this.objdesignApproval.Project_ID,
      Site_ID:this.objdesignApproval.Site_ID,
      Document_Name:this.docName,
      Document_Link:fileUrl,
      Approver_One:this.$CompacctAPI.CompacctCookies.User_ID,
      Approver_One_Status:"Pending",
      Approver_Final_Status:"Pending",
      Approve_Date:this.DateService.dateConvert(new Date())
    }
    const obj = {
      "SP_String": "SP_Project_Design_Approval",
     "Report_Name_String": "Project_Design_Approval_Doc_Upload",
      "Json_Param_String": JSON.stringify(tempSaveDataObj)
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
     if(data[0].Response == "Done"){
      this.SpinnerUpload = false
      this.uploadDialog = false
      this.uploadFormSubmit = false
      this.docName = ""
      this.ProductPDFFile = {}
      this.getPendingValue()
      this.fileInput.clear();
      this.compacctToast.clear();
      this.compacctToast.add({
      key: "compacct-toast",
      severity: "success",
      detail: "Document Succesfully Uploaded" 
    });
     }
     else if(data[0].Success == "False"){
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: data[1].Error
      })
      this.SpinnerUpload = false
     }
    })
  }

  ApproveProject(col:any){
   if(col.Project_Design_ID){
    this.ProjectDesignID = undefined;
    this.ProjectDesignID = col.Project_Design_ID
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "a",
      sticky: true,
      severity: "warn",
      summary: "Are you sure?",
      detail: "Confirm to proceed"
    });
   }
  }
  ApprovalonConfirm(){
   if(this.ProjectDesignID){
    const tempObj={
      Project_Design_ID	: Number(this.ProjectDesignID),
      User_ID	:this.$CompacctAPI.CompacctCookies.User_ID,
      Status :"Approved"
    }
    const obj = {
      "SP_String": "SP_Project_Design_Approval",
      "Report_Name_String": "Update_Pending_Design",
      "Json_Param_String": JSON.stringify([tempObj])
      }
    this.GlobalAPI
    .getData(obj)
    .subscribe((data:any)=>{
      if(data[0].Response == "Done"){
        this.getPendingValue()
        this.onReject()
        this.ProjectDesignID  = undefined
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        detail: "Status Succesfully Uploaded" 
      });
       }
       else if(data[0].Success == "False"){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: data[1].Error
        })
        this.SpinnerUpload = false
       }
    })
   }
  }
  DisApproveProject(col:any){
    if(col.Project_Design_ID){
      this.ProjectDesignID = undefined;
      this.ProjectDesignID = col.Project_Design_ID
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "d",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
     }
  }
  DisApprovalonConfirm(){
    if(this.ProjectDesignID){
      const tempObj={
        Project_Design_ID	: Number(this.ProjectDesignID),
        User_ID	:this.$CompacctAPI.CompacctCookies.User_ID,
        Status :"Disapproved"
      }
      const obj = {
        "SP_String": "SP_Project_Design_Approval",
        "Report_Name_String": "Update_Pending_Design",
        "Json_Param_String": JSON.stringify([tempObj])
        }
      this.GlobalAPI
      .getData(obj)
      .subscribe((data:any)=>{
        if(data[0].Response == "Done"){
          this.getPendingValue()
          this.onReject()
          this.ProjectDesignID  = undefined
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          detail: "Status Succesfully Uploaded" 
        });
         }
         else if(data[0].Success == "False"){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: data[1].Error
          })
          this.SpinnerUpload = false
         }
      })
     }
  }
  showImg(img:any){
    window.open(img)
  }
  getDisApproval(){
    if(this.ObjdesignDisApproval.Project_ID && this.ObjdesignDisApproval.Site_ID){
      const tempObj = {
        Project_ID:	Number(this.ObjdesignDisApproval.Project_ID),
        Site_ID	: Number(this.ObjdesignDisApproval.Site_ID)
  }
  const obj = {
    "SP_String": "SP_Project_Design_Approval",
    "Report_Name_String": "Get_Disaproved_Design",
    "Json_Param_String": JSON.stringify([tempObj])
    }
  this.GlobalAPI
  .getData(obj)
  .subscribe((data:any)=>{
    if(data.length){
      this.DynamicHeader = Object.keys(data[0])
      this.DisapprovalList = data
    }
  })
    }
    else{
      this.DynamicHeaderDisapprova = [];
      this.DisapprovalList = []

    }
  }
}
class designApproval{
  Project_ID:any;
  Site_ID:any
}
class designDisApproval{
  Project_ID:any
  Site_ID:any	
}