import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-parameter-master',
  templateUrl: './parameter-master.component.html',
  styleUrls: ['./parameter-master.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class ParameterMasterComponent implements OnInit {
  tabIndexToView: number= 0;
  buttonname: any= "Create";
  Spinner: any= false;
  items: any= [];
  DRList: any= [];
  EffectList: any= [];
  ParameterMasterFormSubmitted: boolean= false;
  allDetalis: any= [];
  allDetalisHeader: any= [];
  Active_ID: number;
  Inactive_ID: number;
  
  ObjMaster: ParameterMaster = new ParameterMaster();
  constructor(
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Parameter Master",
      Link: "MICL -> Parameter Master"
    });
    this.items = ["BROWSE", "CREATE"];
    this.DRList = ["+","-"];
    this.EffectList = ["Rate","QTY"];
    this.BrowseParameter();
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.ObjMaster = new ParameterMaster();
  }

  SaveParameter(valid:any){
    const TempObj ={
      Parameter_ID:  this.ObjMaster.Parameter_ID ? this.ObjMaster.Parameter_ID : "",
      Parameter_Name: this.ObjMaster.Parameter_Name,
      UOM: this.ObjMaster.UOM,
      DR_Note_Criteria: this.ObjMaster.DR_Note_Criteria,
      Effect_In: this.ObjMaster.Effect_In,
      Tolerance_Level: Number(this.ObjMaster.Tolerance_Level)
    }  
    // console.log("TempObj",TempObj);

    this.ParameterMasterFormSubmitted=true;
    if(valid){
          let msg = this.buttonname == "Create" ? "Create" : "Update";
          this.Spinner=true;
          const obj = {
          "SP_String": "SP_Master_Product_Parameter",
          "Report_Name_String": this.buttonname == "Create" ? "Create_Master_Product_Parameter" : "Update_Master_Product_Parameter",
          "Json_Param_String": JSON.stringify(TempObj)
          }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          // console.log("save data",data);
          if (data[0].Column1){
            this.Spinner=false;
            this.ParameterMasterFormSubmitted=false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              // summary: "Parameter " + msg,
              // detail: "Succesfully " + msg
              summary: data[0].Column1 == 'Parameter Name Already Available' ? data[0].Column1 : "Parameter " + msg,
              detail: data[0].Column1 == 'Parameter Name Already Available' ? "" : "Succesfully " + msg
            });
            this.ObjMaster = new ParameterMaster();
            this.BrowseParameter();
            this.tabIndexToView = 0;
            this.items = ["BROWSE", "CREATE"];
          }
          else {
            this.Spinner = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Parameter not " + msg,
              detail:"Error occured "
            });
          }
        });
    }
    
  }

  EditParameter(col){
      this.ParameterMasterFormSubmitted = false;
      this.ObjMaster = new ParameterMaster();
      if(col.Parameter_ID){
        this.tabIndexToView = 1;
        this.items = ["BROWSE", "UPDATE"];
        this.buttonname = "Update";
        this.getParameter(col.Parameter_ID);
      }
  }

  getParameter(Parameter_ID){
    const obj = {
      "SP_String": "SP_Master_Product_Parameter",
      "Report_Name_String":"Get_Master_Product_Parameter",
      "Json_Param_String": JSON.stringify([{ Parameter_ID: Parameter_ID}]) 
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log("Edit data",data);
        this.ObjMaster.Parameter_ID = data[0].Parameter_ID;
        this.ObjMaster.Parameter_Name = data[0].Parameter_Name;
        this.ObjMaster.UOM = data[0].UOM;
        this.ObjMaster.DR_Note_Criteria = data[0].DR_Note_Criteria;
        this.ObjMaster.Effect_In = data[0].Effect_In;
        this.ObjMaster.Tolerance_Level = data[0].Tolerance_Level;
      });
  }

  InactiveParameter(col){
    // console.log("col.Parameter_ID==InActive", col.Parameter_ID);
    if(col.Parameter_ID){
        this.Inactive_ID = col.Parameter_ID;
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

  ActiveParameter(col){
    // console.log("col.Parameter_ID==Active", col.Parameter_ID);
    if(col.Parameter_ID){
       this.Active_ID = col.Parameter_ID;
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

  BrowseParameter() {
      const obj = {
        "SP_String": "SP_Master_Product_Parameter",
        "Report_Name_String": "Browse_Master_Product_Parameter"
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.allDetalis = data;
        if (this.allDetalis.length) {
          this.allDetalisHeader = Object.keys(data[0]);
        }
        // console.log("allDetalis", this.allDetalis);
      });
  }

  onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("d");
  }

  onConfirm(){
    // console.log("Parameter_ID==InActive", this.Inactive_ID);
      if(this.Inactive_ID){
        const obj = {
          "SP_String": "SP_Master_Product_Parameter",
          "Report_Name_String": "Deactive_Master_Product_Parameter",
          "Json_Param_String": JSON.stringify([{Parameter_ID : this.Inactive_ID}])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          // console.log("del Data InActive ===", data)
          if (data[0].Column1 === "Done"){
            this.onReject();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Parameter ID " + this.Inactive_ID,
              detail: "Succesfully Deleted "
            });
            this.BrowseParameter();
            this.Inactive_ID = 0;
          }
        })
      }
  }

  onConfirm1(){
    // console.log("Parameter_ID==Active", this.Active_ID);
  if(this.Active_ID){
    const obj = {
      "SP_String": "SP_Master_Product_Parameter",
      "Report_Name_String": "Active_Master_Product_Parameter",
      "Json_Param_String": JSON.stringify([{Parameter_ID : this.Active_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("del Active Data===", data)
      if (data[0].Column1 === "Done"){
        this.onReject();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Parameter ID " + this.Active_ID,
          detail: "Succesfully Activated "
        });
        this.BrowseParameter();
        this.Active_ID = 0;
      }
    })
  }
  }

}

class ParameterMaster{
  Parameter_ID: any;
  Parameter_Name: any;
  UOM: any;
  DR_Note_Criteria: any;
  Effect_In: any;
  Tolerance_Level: number;
}
