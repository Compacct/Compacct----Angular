import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-asset-master',
  templateUrl: './asset-master.component.html',
  styleUrls: ['./asset-master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None

})
export class AssetMasterComponent implements OnInit {
  tabIndexToView: number = 0;
  Items: any = ['BROWSE', 'CREATE'];
  Spinner: boolean = false;
  assetFormSubmit: boolean = false;
  tableData: any = [];
  tableFilterFields: any = [];
  purchase_Date: Date = new Date();
  subLedgerList: any = [];
  costCenList: any = [];
  GodownList: any = [];
  activeID: number = 0;
  deactiveID: number = 0;
  buttonname: string = 'Save';
  objAsset = new Asset();

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Asset Master",
      Link: "MICL --> Asset Master"
    });
    this.getBrowseData();
    this.getSubledgerList();
    this.getCostcenterList();
  }

  getBrowseData() {
    const obj = {
      "SP_String": "SP_Master_Asset_Module",
      "Report_Name_String": "Browse_Master_Asset",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      if (data.length) {
        this.tableData = data;
        this.tableFilterFields = Object.keys(data[0]);
      }
    });
  }

  getSubledgerList() {
    const obj = {
      "SP_String": "SP_Master_Asset_Module",
      "Report_Name_String": "Get_Subledger_SC",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      this.subLedgerList = data;
    });
  }

  getCostcenterList() {
    const obj = {
      "SP_String": "SP_Master_Asset_Module",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach((ele: any) => {
          this.costCenList.push({
            "label": ele.Cost_Cen_Name,
            "value": ele.Cost_Cen_ID
          })
        })
      }
    });
  }

  getGodownList(id: any) {
    this.GodownList = [];
    this.objAsset.Godown_ID = undefined;
    if (id) {
      const obj = {
        "SP_String": "SP_Master_Asset_Module",
        "Report_Name_String": "Get_Godown_list",
        "Json_Param_String": JSON.stringify([{ "Cost_Cen_ID": id }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data.length) {
          data.forEach((ele: any) => {
            this.GodownList.push({
              "label": ele.godown_name,
              "value": ele.godown_id
            })
          })
        }
      });
    }
  }

  SaveFormData(valid: any) {
    this.assetFormSubmit = true;
    if (valid) {
      this.assetFormSubmit = false;
      this.Spinner = true;
      let subName = this.subLedgerList.find((ele: any) => ele.value == this.objAsset.Sub_Ledger_ID);
      let costCenName = this.costCenList.find((ele: any) => ele.value == this.objAsset.Cost_Cen_ID);
      let godownName = this.GodownList.find((ele: any) => ele.value == this.objAsset.Godown_ID);
      this.objAsset.Sub_Ledger_Name = subName ? subName.label : undefined;
      this.objAsset.Cost_Cen_Name = costCenName ? costCenName.label : undefined;
      this.objAsset.Godown_Name = godownName ? godownName.label : undefined;
      this.objAsset.Purchase_Date = this.DateService.dateConvert(this.purchase_Date);
      if (this.buttonname === 'Update') {
        const obj = {
          "SP_String": "SP_Master_Asset_Module",
          "Report_Name_String": "Update_Master_Asset",
          "Json_Param_String": JSON.stringify([this.objAsset])
        }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          if (data[0].Column1=='Done') {
            this.Spinner = false;
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Asset Master",
              detail: "Succesfully Updated"
            });
            this.getBrowseData();
            this.tabIndexToView = 0;
            this.clearData();
          }
          else if (data[0].Column1=='Asset Code is already Available!'){
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Asset Code is already Available!"
            });
            this.Spinner = false;
          }
          else {
            this.Spinner = false;
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        });
      }
      else {
        const obj = {
          "SP_String": "SP_Master_Asset_Module",
          "Report_Name_String": "Save_Master_Asset",
          "Json_Param_String": JSON.stringify([this.objAsset])
        }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          if (data[0].Column1=='Done') {
            this.Spinner = false;
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Asset Master",
              detail: "Succesfully Save"
            });
            this.getBrowseData();
            this.tabIndexToView = 0;
            this.clearData();
          }
          else if (data[0].Column1=='Asset Code is already Available!'){
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Asset Code is already Available"
            });
            this.Spinner = false;
          }
          else {
            this.Spinner = false;
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        });
      }
    }
  }

  Edit(col: any) {
    this.tabIndexToView = 1;
    this.buttonname = "Update";
    this.Items = ["BROWSE", "UPDATE"];
    if (col.Auto_ID) {
      const obj = {
        "SP_String": "SP_Master_Asset_Module",
        "Report_Name_String": "Get_Master_Asset",
        "Json_Param_String": JSON.stringify([{ "Auto_ID": col.Auto_ID }])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data.length) {
          this.getGodownList(data[0].Cost_Cen_ID);
          setTimeout(() => {
            this.objAsset = data[0];
          }, 500);
          this.purchase_Date = new Date(data[0].Purchase_Date);
        }
      })
    }
  }

  Active(col: any) {
    if (col.Auto_ID) {
      this.activeID = col.Auto_ID;
      this.CompacctToast.clear();
      this.CompacctToast.add({
        key: "d",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
  }

  Deactive(col: any) {
    if (col.Auto_ID) {
      this.deactiveID = col.Auto_ID;
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
    const obj = {
      "SP_String": "SP_Master_Asset_Module",
      "Report_Name_String": "Deactivate_Master_Asset",
      "Json_Param_String": JSON.stringify([{ "Auto_ID": this.deactiveID }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      this.getBrowseData();
      this.CompacctToast.clear();
      this.CompacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Deactivated",
        detail: "Succesfully Deactivated"
      });
    })
  }

  onConfirmAgain() {
    const obj = {
      "SP_String": "SP_Master_Asset_Module",
      "Report_Name_String": "Activate_Master_Asset",
      "Json_Param_String": JSON.stringify([{ "Auto_ID": this.activeID }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      this.getBrowseData();
      this.CompacctToast.clear();
      this.CompacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Activated",
        detail: "Succesfully Activated"
      });
    })
  }

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  onReject() {
    this.CompacctToast.clear("c");
    this.CompacctToast.clear("d");
    this.activeID = 0;
    this.deactiveID = 0;
  }

  clearData() {
    this.objAsset = new Asset();
    this.assetFormSubmit = false;
    this.purchase_Date = new Date();
    this.buttonname = "Save";
    this.Items = ["BROWSE", "CREATE"];
    this.Spinner = false;
    this.activeID = 0;
    this.deactiveID = 0;
    this.GodownList = [];
  }

}

class Asset {
  Auto_ID: any;
  Asset_Code: any;
  Asset_Name: any;
  Purchase_Date: any;
  Sub_Ledger_ID: any;
  Sub_Ledger_Name: any;
  Cost_Cen_ID: any;
  Cost_Cen_Name: any;
  Godown_ID: any;
  Godown_Name: any;
  Remarks: any;
}

