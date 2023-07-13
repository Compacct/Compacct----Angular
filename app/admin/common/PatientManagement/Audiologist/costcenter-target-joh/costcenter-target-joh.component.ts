import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-costcenter-target-joh',
  templateUrl: './costcenter-target-joh.component.html',
  styleUrls: ['./costcenter-target-joh.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CostcenterTargetJohComponent implements OnInit {
  tabIndexToView: number = 0;
  Items: any = ['BROWSE', 'CREATE'];
  Spinner: boolean = false;
  buttonname: string = 'Create';
  costCenterDate: Date = new Date();
  searchSpinner: boolean = false;
  costCenterFormSubmit: boolean = false;
  costCeterList: any = [];
  TableData: any = [];
  TableSearchData: any = [];
  deleteTargetId: number = 0;
  ObjcostCenter = new costCenter();
  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Costcenter Target",
      Link: "JOH --> Costcenter Target"
    });
    this.getCostCenter();
    this.getRetriveData();
  }

  getCostCenter() {
    const obj = {
      "SP_String": "Sp_BL_CRM_Txn_Cost_Center_Target",
      "Report_Name_String": "Get_Cost_Center_For_Dropdown",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log('costCenter List', data);
      if (data.length) {
        data.forEach((ele: any) => {
          this.costCeterList.push({
            "label": ele.Cost_Cen_Name,
            "value": ele.Cost_Cen_ID
          })
        })
      }
    })
  }

  saveFormData(valid) {
    this.costCenterFormSubmit = true;
    if (valid) {
      this.costCenterFormSubmit = false;
      this.Spinner = true;
      let initDate = this.costCenterDate ? new Date(this.costCenterDate.getFullYear(), this.costCenterDate.getMonth(), 1) : new Date();
      this.ObjcostCenter.Target_ID = 0;
      this.ObjcostCenter.Target_Date = this.DateService.dateConvert(initDate);
      console.log('save obj', this.ObjcostCenter);
      const obj = {
        "SP_String": "Sp_BL_CRM_Txn_Cost_Center_Target",
        "Report_Name_String": "Create_Cost_Center_Target",
        "Json_Param_String": JSON.stringify([this.ObjcostCenter])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        console.log('data', data);
        this.Spinner = false;
        if (data[0].Column1 == 'done') {
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Data Added Succesfully",
            detail: "Succesfully Added"
          });
          this.getRetriveData();
          this.clearData();
        }
      });
    }
  }

  getRetriveData() {
    console.log('retrive function works');
    let searchDate = this.costCenterDate ? new Date(this.costCenterDate.getFullYear(), this.costCenterDate.getMonth(), 1) : new Date();
    const obj = {
      "SP_String": "Sp_BL_CRM_Txn_Cost_Center_Target",
      "Report_Name_String": "Retrieve_Cost_Center_Target",
      "Json_Param_String": JSON.stringify([{ "Target_Date": this.DateService.dateConvert(searchDate) }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log('table data', data);
      this.TableData = data;
      if (data.length) {
        this.TableSearchData = Object.keys(data[0])
      }
    })
  }

  updateCostCenter(col) {
    if (col) {
      let updateObj = {
        "Target_ID": col.Target_ID,
        "Target_Date": this.DateService.dateConvert(col.Target_Date),
        "Cost_Cen_ID": col.Cost_Cen_ID,
        "Br_Target": col.Br_Target,
        "Br_Achivement": col.Br_Achivement,
        "Revenue_Target": col.Revenue_Target,
        'Revenue_Achivement': col.Revenue_Achivement,
        "Asp_Target": col.Asp_Target,
        "Asp_Achivement": col.Asp_Achivement,
        "Pr_Target": col.Pr_Target,
        "Pr_Achivement": col.Pr_Achivement,
        "FU_Assessment": col.FU_Assessment,
        "FU_Achivement": col.FU_Achivement,
        "FU_Revenue": col.FU_Revenue,
        "FU_Revenue_Achievement": col.FU_Revenue_Achievement,
        "RAF_Issue": col.RAF_Issue,
        "RAF_Achievement": col.RAF_Achievement,
        "RAF_Revenue": col.RAF_Revenue,
        "RAF_Revenue_Achievement": col.RAF_Revenue_Achievement,
        "Speech_Revenue": col.Speech_Revenue,
        "Speech_Revenue_Achievement": col.Speech_Revenue_Achievement,
      };
      console.log('update obj', updateObj);

      const obj = {
        "SP_String": "Sp_BL_CRM_Txn_Cost_Center_Target",
        "Report_Name_String": "Update_Cost_Center_Target",
        "Json_Param_String": JSON.stringify([updateObj])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        console.log('update response', data);
        if (data[0].Column1 = "Done") {
          // this.CompacctToast.clear('c');
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

  deleteCostCenter(col) {
    // this.deleteTargetId = 0;
    if (col.Target_ID) {
      this.deleteTargetId = col.Target_ID;
      console.log('deleteTargetId', this.deleteTargetId);
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

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  onConfirm() {
    const obj = {
      "SP_String": "Sp_BL_CRM_Txn_Cost_Center_Target",
      "Report_Name_String": "Delete_Cost_Center_Target",
      "Json_Param_String": JSON.stringify([{ "Target_ID": this.deleteTargetId }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log('del res', data);
      this.deleteTargetId = 0;
      if (data[0].Column1.trim() == 'Done') {
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
    })
  }

  onReject() {
    this.CompacctToast.clear("c");
    this.deleteTargetId = 0;
  }

  clearData() {
    this.Spinner = false;
    this.searchSpinner = false;
    this.costCenterFormSubmit = false;
    this.deleteTargetId = 0;
    this.ObjcostCenter = new costCenter();
  }
  calBr_Target() {
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.Br_Target);
      })
    }
    return total;
  }

  calBr_Achivement(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.Br_Achivement);
      })
    }
    return total;
  }

  calRevenue_Target(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.Revenue_Target);
      })
    }
    return total;
  }

  calRevenue_Achivement(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.Revenue_Achivement);
      })
    }
    return total;
  }

  calAsp_Target(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.Asp_Target);
      })
    }
    return total;
  }

  calAsp_Achivement(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.Asp_Achivement);
      })
    }
    return total;
  }

  calPr_Target(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.Pr_Target);
      })
    }
    return total;
  }

  calPr_Achivement(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.Pr_Achivement);
      })
    }
    return total;
  }

  calFU_Assessment(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.FU_Assessment);
      })
    }
    return total;
  }

  calFU_Achivement(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.FU_Achivement);
      })
    }
    return total;
  }

  calFU_Revenue(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.FU_Revenue);
      })
    }
    return total;
  }

  calFU_Revenue_Achievement(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.FU_Revenue_Achievement);
      })
    }
    return total;
  }

  calRAF_Issue(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.RAF_Issue);
      })
    }
    return total;
  }

  calRAF_Achievement(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.RAF_Achievement);
      })
    }
    return total;
  }

  calRAF_Revenue(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.RAF_Revenue);
      })
    }
    return total;
  }

  calRAF_Revenue_Achievement(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.RAF_Revenue_Achievement);
      })
    }
    return total;
  }

  calSpeech_Revenue(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.Speech_Revenue);
      })
    }
    return total;
  }

  calSpeech_Revenue_Achievement(){
    let total = 0;
    if (this.TableData.length) {
      this.TableData.forEach((ele: any) => {
        total += Number(ele.Speech_Revenue_Achievement);
      })
    }
    return total;
  }

}

class costCenter {
  Target_ID: number;
  Target_Date: any;
  Cost_Cen_ID: any;
  Br_Target: any;
  Br_Achivement: any;
  Revenue_Target: any;
  Revenue_Achivement: any;
  Asp_Target: any;
  Asp_Achivement: any;
  Pr_Target: any;
  Pr_Achivement: any;
  FU_Assessment: any;
  FU_Achivement: any;
  FU_Revenue: any;
  FU_Revenue_Achievement: any;
  RAF_Issue: any;
  RAF_Achievement: any;
  RAF_Revenue: any;
  RAF_Revenue_Achievement: any;
  Speech_Revenue: any;
  Speech_Revenue_Achievement: any;
}
