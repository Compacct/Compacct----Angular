import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-micl-cost-center-master',
  templateUrl: './micl-cost-center-master.component.html',
  styleUrls: ['./micl-cost-center-master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MICLCostCenterMasterComponent implements OnInit {
items:any = [];
Spinner = false;
seachSpinner = false;
tabIndexToView = 0;
buttonname = "Save";
BrowseData: any = [];
ObjCostUpper: CostUpper = new CostUpper();
ObjGodown: Godown = new Godown();
CostCenterFormSubmitted: boolean = false;
StockPointFormSubmitted: boolean = false;
StockAdd: any = [];
  SaveDataUpdate: any = [];
  SaveData: any = [];
EditId = undefined; 
  editList: any = [];
  IsDisabled: boolean = false;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ){}
ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
    Header: "Cost Center",
    Link: "MICl -> MICL Cost Center Master"
    });
  this.GetBrowseData();
}
TabClick(e) {
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Save";
     this.Spinner = false;
     this.clearData();
}
clearData() {
this.StockAdd = [];
  this.ObjCostUpper = new CostUpper();
  this.ObjGodown = new Godown();
this.editList = [];
this.IsDisabled = false;
this.CostCenterFormSubmitted = false;
this.StockPointFormSubmitted = false;
  this.EditId = undefined;
  this.SaveData = [];
  this.SaveDataUpdate = [];
}
GetBrowseData() {
 const obj = {
      "SP_String":"SP_Master_Cost_Center",
      "Report_Name_String":"Browse_Cost_Center"
    }
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.BrowseData = data;
     // console.log("Browse data==",this.BrowseData);
      });  
  } 
Add(valid){
  this.StockPointFormSubmitted = true;
    if(valid) {
    const StockObj = {
      godown_name: this.ObjGodown.godown_name,
      godown_id :this.ObjGodown.godown_id,
      Cost_Cen_Name:this.ObjCostUpper.Cost_Cen_Name,
      Cost_Cen_Code: this.ObjCostUpper.Cost_Cen_Code,     
    };
  this.StockAdd.push(StockObj);
      console.log("Product Submit", this.StockAdd);
      this.StockPointFormSubmitted = false;
      this.ObjGodown= new Godown();    
    }
    
}
delete(index) {
this.StockAdd.splice(index,1)
}
SaveMasterCost(valid) {
    this.CostCenterFormSubmitted = true;
  if (valid && this.StockAdd.length) {
    if (this.ObjCostUpper.Cost_Cen_Code.length >= 2 ) {
       this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });  
    }
    else {
       this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Code(Unique) Minimum length 2 "
      });    
    }
    }
}
onConfirm() {
  //update Api
  if (this.EditId) {
      this.StockAdd.forEach(el=>{
      this.SaveDataUpdate.push({
        Cost_Cen_Name:el.Cost_Cen_Name,              
        Cost_Cen_ID: this.EditId,
        godown_name: el.godown_name,
        godown_id :el.godown_id   
      })
    });
      console.log(this.SaveDataUpdate);
      const obj = {
        "SP_String": "SP_Master_Cost_Center",
        "Report_Name_String":"Update_Cost_Center",
        "Json_Param_String": JSON.stringify(this.SaveDataUpdate) 
       }
       this.GlobalAPI.getData(obj).subscribe((data : any)=>{
         console.log('Updatedata=',data);
         if(data[0].Column1){ 
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Cost Center Updated Succesfully ",
          detail: "Succesfully Updated"
        });       
        this.clearData();
         this.StockAdd = [];
         this.SaveDataUpdate = [];
        this.IsDisabled = false;
          this.Spinner = false;
          this.CostCenterFormSubmitted = true;
        this.tabIndexToView = 0;
         this.items = ["BROWSE", "CREATE"];
         this.GetBrowseData();
        }
        else{
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Something Wrong"
        });       
        this.Spinner = false;
           this.SaveDataUpdate = [];
        }
       });
    }
  //Save Api 
    else{
      this.StockAdd.forEach(el=>{
      this.SaveData.push({
        Cost_Cen_Name:el.Cost_Cen_Name,
        DOC_ID: el.Cost_Cen_Code,
        godown_name: el.godown_name,       
      })
    });
    const obj = {
      "SP_String": "SP_Master_Cost_Center",
      "Report_Name_String":"Create_Cost_Center",
      "Json_Param_String": JSON.stringify(this.SaveData) 
     }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      var tempID = data[0].Column1;
       console.log('data=',data); 
       if(data[0].Column1){ 
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: tempID == "DOC ID ALREADY EXISTS" ? tempID :"Cost Center",
        detail: tempID =="DOC ID ALREADY EXISTS" ? tempID  : "Succesfully Created" ,
      });
      this.clearData();
       this.StockAdd = [];
        this.Spinner = false;
         this.IsDisabled = false;
          this.CostCenterFormSubmitted = true;
      this.tabIndexToView = 0;
       this.items = ["BROWSE", "CREATE"];
       this.GetBrowseData();
      }
      else{
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something Wrong"
      });    
         this.Spinner = false;
         this.SaveData =[]
      }
     });
  } 
}
onReject(){
  this.compacctToast.clear("c");
}
Edit(masterCost){
  this.EditId = undefined;
  if (masterCost.Cost_Cen_ID) {
    this.EditId = masterCost.Cost_Cen_ID;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.tabIndexToView = 1;
    this.IsDisabled = true;
    this.GetEdit();
  }
}
GetEdit(){
  this.editList = [];
  const temobj = {
    Cost_Cen_ID : this.EditId,   
  }
  const obj = {
    "SP_String": "SP_Master_Cost_Center",
    "Report_Name_String": "Retrieve_Cost_Center",
    "Json_Param_String": JSON.stringify(temobj)
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.editList = data;
      this.ObjCostUpper.Cost_Cen_Name = data[0].Cost_Cen_Name;
      this.ObjCostUpper.Cost_Cen_Code = data[0].Cost_Cen_Code;
      this.StockAdd = data;
    console.log("this.editList  ===",this.editList);
    })
}
}
class CostUpper{
  Cost_Cen_Name: any;
  Cost_Cen_Code: any;
}
class Godown{
  godown_name: any;
  godown_id: any;
}
