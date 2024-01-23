import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-audiologist-target',
  templateUrl: './audiologist-target.component.html',
  styleUrls: ['./audiologist-target.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class AudiologistTargetComponent implements OnInit {

  tabIndexToView: number = 0;
  searchSpinner: boolean = false;
  Spinner: boolean = false;
  audioLogistDate: Date = new Date();
  addedAudioLogist: any = [];
  audioLogistList: any = [];
  audioLogistDropList: any = [];
  deleteTargetID = undefined;
  audioLogistFormSubmit: boolean = false;
  objAudioLogist = new Audiologist();

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Audiologist Target",
      Link: "PatintManagement --> Audiologist Target"
    });
    this.getRetriveData();
    this.getAudiologists();
  }

  getAudiologists() {
    const obj1 = {
      "SP_String": "Sp_BL_Txn_Audiologist_Target",
      "Report_Name_String": "Get_Doctor_For_Dropdown"
    }

    this.GlobalAPI.getData(obj1).subscribe((data: any) => {
      // console.log('doctors list', data);
      this.audioLogistList = data;
      data.forEach((ele: any) => {
        this.audioLogistDropList.push({
          "label": ele.Name,
          "value": ele.Doctor_ID
        });
      });
      // console.log('doctors drop list', this.audioLogistDropList);
    });
  }

  getRetriveData() {
    this.addedAudioLogist = [];
    this.objAudioLogist = new Audiologist();
    let retrive_date = this.DateService.dateConvert(new Date(this.audioLogistDate.getFullYear(), this.audioLogistDate.getMonth(), 1));
    const obj = {
      "SP_String": "Sp_BL_Txn_Audiologist_Target",
      "Report_Name_String": "Retrieve_Audiologist_Target",
      "Json_Param_String": JSON.stringify([{ Target_Date: retrive_date }])
    }

    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('retrive data', data);
      data.forEach((ele: any) => {
        this.addedAudioLogist.push({
          "Target_ID": ele.Target_ID,
          "Doctor_ID": ele.Doctor_ID,
          "Target_Amount_1": ele.Target_Amount_1,
          "Target_Amount_2": ele.Target_Amount_2,
          "Name": ele.Name
        })
      })
    })
  }


  AddToList(valid: any) {
    this.audioLogistFormSubmit = true;
    if (valid) {
      const checkdata = this.addedAudioLogist.filter((ele: any) => ele.Doctor_ID === this.objAudioLogist.Doctor_ID);
      // console.log('check data', checkdata);
      if (!checkdata.length) {
        let formatdate = new Date(this.audioLogistDate.getFullYear(), this.audioLogistDate.getMonth(), 1);
        this.objAudioLogist.Target_ID = 0;
        this.objAudioLogist.Target_Date = this.DateService.dateConvert(formatdate);
        // console.log('save data', this.objAudioLogist);
        this.Spinner = true;

        const obj = {
          "SP_String": "Sp_BL_Txn_Audiologist_Target",
          "Report_Name_String": "Create_Audiologist_Target",
          "Json_Param_String": JSON.stringify([this.objAudioLogist])
        }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          // console.log('Create Response', data);
          if (data[0].Column1 == "done") {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Data Save Succesfully ",
              detail: "Succesfully Save"
            });
            this.Spinner = false;
            this.getRetriveData();
            this.objAudioLogist = new Audiologist();
            this.audioLogistFormSubmit = false;
          }

          else {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Error",
              detail: "Something Wrong"
            });
            this.Spinner = false;
          }
        })
      }
      else {
        this.CompacctToast.clear();
        this.CompacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "This Doctor Already Exist in List"
        });
      }
    }
  }

  updateAmount(col) {
    if (col.Target_ID && col.Target_Amount_1 && col.Target_Amount_2) {
      // console.log('col.Target_ID && col.Target_Amount_1 && col.Target_Amount_2', col.Target_ID, col.Target_Amount, col.Target_Amount_2);
      const obj = {
        "SP_String": "Sp_BL_Txn_Audiologist_Target",
        "Report_Name_String": "Update_Audiologist_Target",
        "Json_Param_String": JSON.stringify([{ Target_ID: col.Target_ID, Target_Amount_1: col.Target_Amount_1, Target_Amount_2: col.Target_Amount_2}])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('update response', data);
        if (data[0].Column1 = "Done") {
          this.CompacctToast.clear('c');
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: " Update Succesfully ",
            detail: "Succesfully"
          });
          this.getRetriveData();
        }

        else {
          this.CompacctToast.clear('c')
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

  deleteAudiologist(col) {
    this.deleteTargetID = col.Target_ID;
    this.CompacctToast.clear();
    this.CompacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Are you sure?",
      detail: "Confirm to proceed"
    });
  }

  onConfirm() {
    // console.log('delete target id', this.deleteTargetID);
    const obj = {
      "SP_String": "Sp_BL_Txn_Audiologist_Target",
      "Report_Name_String": "Delete_Audiologist_Target",
      "Json_Param_String": JSON.stringify([{ Target_ID: this.deleteTargetID }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('delete response', data);
      if (data[0].Column1 = "Done") {
        this.CompacctToast.clear('c');
        this.CompacctToast.clear();
        this.CompacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: " Deleted Succesfully ",
          detail: "Succesfully"
        });
        this.getRetriveData();
      }

      else {
        this.CompacctToast.clear('c')
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

  calTotal1() {
    let totalAmount1  = 0;
    this.addedAudioLogist.forEach((ele:any) =>{
      totalAmount1 += Number(ele.Target_Amount_1);
    })

    return totalAmount1;
  }

  calTotal2() {
    let totalAmount2  = 0;
    this.addedAudioLogist.forEach((ele:any) =>{
      totalAmount2 += Number(ele.Target_Amount_2);
    })

    return totalAmount2;
  }


  onReject() {
    this.CompacctToast.clear('c');
  }

  TabClick(e: any) {

  }

}

class Audiologist {
  Target_ID: any;
  Target_Date: any;
  Doctor_ID: any;
  Target_Amount_1: any;
  Target_Amount_2: any;
}
