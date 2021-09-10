import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Data } from '@angular/router';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-tuto-support-master',
  templateUrl: './tuto-support-master.component.html',
  styleUrls: ['./tuto-support-master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoSupportMasterComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  SupportCategory = undefined;
  SupportAndroid = undefined;
  SupportFMC = undefined;
  Spinner = false;
  buttonname = "Save";
  SupportCategoryList = [];
  SupportAndroidList = [];
  SupportFMCList = [];
  Anndroid_Id = undefined;
  FMCID = undefined;
  Category_ID = undefined;
  SupportAnndroidFormSubmitted = false;
  SupportFMCFormSubmitted = false;
  SupportCategoryFormSubmitted = false;
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.items = ["Support Category", "Support FMC", "Support Android Version"];
    this.Header.pushHeader({
      Header: "Support Ticket Master",
      Link: "Support -> Support Ticket Master"

    });
    this.GetDataCategory();
    this.GetDataAndroid();
    this.GetDataFMC();
  }
  onConfirmAnndroid(){
    console.log("Anndroid")
    if(this.Anndroid_Id){
      const TempObj = {
        Anndroid_Ver_ID : this.Anndroid_Id
      }
      const obj = {
        "SP_String": "Tutopia_Support_Master",
        "Report_Name_String": "Delete_Tutopia_Master_Support_Android_Ver",
        "Json_1_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Column1 === null){
          console.log("done")
          this.onReject();
          this.GetDataAndroid();
          this.clearData();
        }
       })
      }
  }
  onConfirmFMC(){
    console.log("FMC");
    if(this.FMCID){
      const TempObj = {
        FMC_ID : this.FMCID
      }
      const obj = {
        "SP_String": "Tutopia_Support_Master",
        "Report_Name_String": "Delete_Tutopia_Master_Support_FMC",
        "Json_1_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Column1 === null){
          console.log("done")
          this.onReject();
          this.GetDataFMC();
          this.clearData();
        }
       })
    }
  }
  onConfirmCategory(){
    console.log("Category")
    if(this.Category_ID){
      const TempObj = {
        Support_Category_ID : this.Category_ID
      }
      const obj = {
        "SP_String": "Tutopia_Support_Master",
        "Report_Name_String": "Delete_Tutopia_Master_Support_Category",
        "Json_1_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Column1 === null){
          console.log("done")
          this.onReject();
          this.GetDataCategory();
          this.clearData();
        }
       })
  }
}
  onReject() {
    this.compacctToast.clear("c");
  }
  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["Support Category", "Support FMC", "Support Android Version"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData(){
    this.SupportAnndroidFormSubmitted = false;
    this.SupportFMCFormSubmitted = false;
    this.SupportCategoryFormSubmitted = false;
    this.SupportAndroid = undefined;
    this.SupportFMC = undefined;
    this.SupportCategory = undefined;
    this.Anndroid_Id = undefined;
    this.FMCID = undefined;
    this.Category_ID = undefined;
  }
  saveSupportCategory(valid){
    this.SupportCategoryFormSubmitted = true;
    if(valid){
      if(this.Category_ID){
        console.log("update")
        const tempObj = {
          Support_Category_ID : this.Category_ID,
          Support_Category_Name : this.SupportCategory
        }
        const obj = {
          "SP_String": "Tutopia_Support_Master",
          "Report_Name_String": "Update_Tutopia_Master_Support_Category",
          "Json_1_String": JSON.stringify([tempObj])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          if(data[0].Column1 === null){
            this.buttonname = "Save";
          this.compacctToast.clear();
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Succesfully Updated ",
           detail: "Category Name Succesfully Updated"
         });
         this.clearData();
         this.GetDataCategory();
        }
        })
        
      }
      else{
        console.log("save");
        const tempObj = {
          Support_Category_Name : this.SupportCategory
        }
        const obj = {
          "SP_String": "Tutopia_Support_Master",
          "Report_Name_String": "Create_Tutopia_Master_Support_Category",
          "Json_1_String": JSON.stringify([tempObj])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          var tempID = data[0].Column1;
          if(data[0].Column1){
           this.compacctToast.clear();
           this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Category Entry No. " + tempID,
            detail: "Category Name Entry Succesfully"
          });
          this.clearData();
          this.GetDataCategory();
         }
        })


      }
    }

  }
  saveSUpportFMC(valid){
    console.log("this.SupportFMC",this.SupportFMC);
    console.log(valid);
    this.SupportFMCFormSubmitted = true;
    if(valid){
      if(this.FMCID){
        console.log("update")
        const tempObj = {
          FMC_ID : this.FMCID,
          FMC_Desc : this.SupportFMC
        }
        const obj = {
          "SP_String": "Tutopia_Support_Master",
          "Report_Name_String": "Update_Tutopia_Master_Support_FMC",
          "Json_1_String": JSON.stringify([tempObj])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          if(data[0].Column1 === null){
            this.buttonname = "Save";
          this.compacctToast.clear();
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Succesfully Updated ",
           detail: "FMC Succesfully Updated"
         });
         this.clearData();
         this.GetDataFMC();
        }
        })
      }
      else{
        console.log("save");
        const tempObj = {
          FMC_Desc : this.SupportFMC
        }
        const obj = {
          "SP_String": "Tutopia_Support_Master",
          "Report_Name_String": "Create_Tutopia_Master_Support_FMC",
          "Json_1_String": JSON.stringify([tempObj])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          var tempID = data[0].Column1;
          if(data[0].Column1){
           this.compacctToast.clear();
           this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "FMC Entry No. " + tempID,
            detail: "FMC Entry Succesfully"
          });
          this.clearData();
          this.GetDataFMC();
         }
        })
      }
    }
  }
  saveSupportAndroid(valid){
    console.log(valid);
    this.SupportAnndroidFormSubmitted = true;
    if(valid){
    if(this.Anndroid_Id){
      console.log("update")
      const tempObj = {
        Anndroid_Ver_ID : this.Anndroid_Id,
        Anndroid_Ver_Name : this.SupportAndroid
      }
      const obj = {
        "SP_String": "Tutopia_Support_Master",
        "Report_Name_String": "Update_Tutopia_Master_Support_Android_Ver",
        "Json_1_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        let updateData = data.Column1;
        console.log("updateSupportAndroid",data[0].Column1);
      if(data[0].Column1 === null){
        this.buttonname = "Save";
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Succesfully Updated ",
       detail: "Anndroid Version Name Succesfully Updated"
     });
     this.clearData();
     this.GetDataAndroid();
    }
     })
    }
    else{
      console.log("save")
      const tempObj = {
        Anndroid_Ver_Name : this.SupportAndroid
      }
      const obj = {
        "SP_String": "Tutopia_Support_Master",
        "Report_Name_String": "Create_Tutopia_Master_Support_Android_Ver",
        "Json_1_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("saveSupportAndroid",data);
      var tempID = data[0].Column1;
     if(data[0].Column1){
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Anndroid Version Entry No. " + tempID,
       detail: "Anndroid Version Name Entry Succesfully"
     });
     this.clearData();
     this.GetDataAndroid();
    }
      })
    }
  }
  }
 GetDataCategory(){
  const obj = {
    "SP_String": "Tutopia_Support_Master",
    "Report_Name_String": "Get_Tutopia_Master_Support_Category",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.SupportCategoryList = data;
     console.log("this.SupportCategoryList",this.SupportCategoryList);
   })
 }
 GetDataFMC(){
  const obj = {
    "SP_String": "Tutopia_Support_Master",
    "Report_Name_String": "Get_Tutopia_Master_Support_FMC",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.SupportFMCList = data;
     console.log("this.SupportFMCList",this.SupportFMCList);
   })
 }
 GetDataAndroid(){
  const obj = {
    "SP_String": "Tutopia_Support_Master",
    "Report_Name_String": "Get_All_Tutopia_Master_Support_Android_Ver",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.SupportAndroidList = data;
   })
}
GetEditCategory(col){
  this.clearData();
  if(col.Support_Category_ID){
    this.tabIndexToView = 0;
    this.buttonname = "Update";
    this.Category_ID = col.Support_Category_ID;
    this.SupportCategory = col.Support_Category_Name;

  }
}
GetEditFMC(col){
  this.clearData();
  if(col.FMC_ID){
    this.tabIndexToView = 1;
    this.buttonname = "Update";
    this.FMCID = col.FMC_ID;
    this.SupportFMC = col.FMC_Desc;

  }
}
GetEditAndroid(col){
  this.clearData();
  if(col.Anndroid_Ver_ID){
    this.tabIndexToView = 2;
    this.buttonname = "Update";
    this.Anndroid_Id = col.Anndroid_Ver_ID;
    this.SupportAndroid = col.Anndroid_Ver_Name;

  }
}
deleteCategory(col){
this.Category_ID = undefined;
if(col.Support_Category_ID){
  this.Category_ID = col.Support_Category_ID
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
delectFMC(col){
  this.FMCID = undefined;
  if(col.FMC_ID){
    this.FMCID = col.FMC_ID
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
deleteAndroid(col){
  this.Anndroid_Id = undefined;
  if(col.Anndroid_Ver_ID){
  this.Anndroid_Id = col.Anndroid_Ver_ID;
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

}
