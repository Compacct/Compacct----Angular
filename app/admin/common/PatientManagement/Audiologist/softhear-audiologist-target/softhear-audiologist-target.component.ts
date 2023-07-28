import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-softhear-audiologist-target',
  templateUrl: './softhear-audiologist-target.component.html',
  styleUrls: ['./softhear-audiologist-target.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SofthearAudiologistTargetComponent implements OnInit {
  tabIndexToView: number = 0;
  Spinner: boolean = false;
  AudiologistList: any = [];
  AudiologistID: any = undefined;
  AudiologistFormSubmit: boolean= false;
  addAudiologistTargetList: any=[];
  DeleteTargetID: any=undefined;

  objAudiologist = new Audiologist();
  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Audiologist Target",
      Link: "Patient Management --> Audiologist Target"
    });
    this.getAudiologistList();
  }

  getAudiologistList() {
    this.AudiologistList = [];
    const obj = {
      "SP_String": "Sp_BL_Txn_Audiologist_Target_For_Softhear",
      "Report_Name_String": "Get_Doctor_For_Dropdown"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //  console.log("getAudiologistList",data);
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Name,
          element['value'] = element.Doctor_ID
        });
        this.AudiologistList = data;
      }
      else {
        this.AudiologistList = [];
      }
    });
  }

  getAudiologistTargetList(){
    this.addAudiologistTargetList=[];
    this.objAudiologist=new Audiologist();
    this.AudiologistFormSubmit=false;
    const obj = {
      "SP_String": "Sp_BL_Txn_Audiologist_Target_For_Softhear",
      "Report_Name_String": "Retrieve_Audiologist_Target",
      "Json_Param_String": JSON.stringify([{ Doctor_ID: this.AudiologistID }])
    }

    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('retrive data', data);

      data.forEach((ele: any) => {
        this.addAudiologistTargetList.push({
          "Target_ID": ele.Target_ID,
          "Doctor_ID": ele.Doctor_ID,
          "Start_range": ele.Start_range,
          "End_range": ele.End_range,
          "Percentage_below_40": ele.Percentage_below_40,
          "Percentage_above_40": ele.Percentage_above_40
        })
      })
      // console.log('getAudiologistTargetList',this.addAudiologistTargetList);
    })

  }

  AddAudiologistTarget(valid: any){
    this.AudiologistFormSubmit = true;
    if (valid) {

      if(!this.AudiologistID){
        this.AudiologistFormSubmit=false;
        this.CompacctToast.clear();
        this.CompacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Required",
          detail: "Select Audiologist"
        });
        return ;
      }

      this.Spinner = true;
      this.objAudiologist.Target_ID=Number(0);
      this.objAudiologist.Doctor_ID=Number(this.AudiologistID);
      this.addAudiologistTargetList.push(this.objAudiologist);
      // console.log('addAudiologistTargetList',this.addAudiologistTargetList);

      const SaveObj = {
        "SP_String": "Sp_BL_Txn_Audiologist_Target_For_Softhear",
        "Report_Name_String": "Create_Audiologist_Target",
        "Json_Param_String": JSON.stringify(this.addAudiologistTargetList)
      }
      this.GlobalAPI.postData(SaveObj).subscribe((data: any) => {
        // console.log("save data", data);
  
        if (data[0].Column1) {
          this.Spinner = false;
          this.objAudiologist = new Audiologist();
          this.AudiologistFormSubmit = false;
          this.getAudiologistTargetList();
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "AudiologistTargetList ",
            detail: "Succesfully Added "
          });
        }
        else {
          this.Spinner = false;
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail: "Error occured "
          });
        }
      });

    }
  }

  updateAudiologistTargetList(col:any){
    // console.log('updateAudiologistTargetList',col);
    if (col.Start_range && col.End_range) {
      const obj = {
        "SP_String": "Sp_BL_Txn_Audiologist_Target_For_Softhear",
        "Report_Name_String": "Update_Audiologist_Target",
        "Json_Param_String": JSON.stringify([{ Target_ID: col.Target_ID, Doctor_ID: col.Doctor_ID, Start_range: col.Start_range, End_range: col.End_range, Percentage_below_40: col.Percentage_below_40, Percentage_above_40: col.Percentage_above_40}])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('update response', data);
        if (data[0].Column1 = "Done") {
          this.getAudiologistTargetList();
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "AudiologistTargetList ",
            detail: "Succesfully Updated "
          });
        }

        else {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Wrong"
          });
        }
      });
    }
  }

  deleteAudiologistTargetList(col:any){
    this.DeleteTargetID=undefined;
    if(col.Target_ID){
      this.DeleteTargetID = col.Target_ID;
      this.CompacctToast.clear();
      this.CompacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
  }

  onConfirm() {
  //  console.log ('DeleteTargetID', this.DeleteTargetID);
    const obj = {
      "SP_String": "Sp_BL_Txn_Audiologist_Target_For_Softhear",
      "Report_Name_String": "Delete_Audiologist_Target",
      "Json_Param_String": JSON.stringify([{ Target_ID: this.DeleteTargetID }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('delete response', data);
      if (data[0].Column1 = "Done") {
        this.CompacctToast.clear();
        this.CompacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "AudiologistTargetList ",
          detail: "Succesfully Deleted "
        });
        this.DeleteTargetID=undefined;
        this.getAudiologistTargetList();
      }
      else {
        this.CompacctToast.clear();
        this.CompacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Something Wrong"
        });
      }
    });
  }

  onReject() {
    this.CompacctToast.clear('c');
  }

}

class Audiologist {
  Target_ID: any;
  Doctor_ID: any;
  Start_range: any; 
  End_range: any; 
  Percentage_below_40: any;  
  Percentage_above_40: any;  
}
