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
  purchase_Date: Date = new Date();
  tableData: any = [];
  tableFilterFields: any = [];
  subLedgerList: any = [];
  costCenList: any = [];
  GodownList: any = [];
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
      console.log("Browse Data", data);
      this.tableData = data;
      if (data.length) {
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
      console.log("subledger Data", data);
      this.subLedgerList = data;
    });
  }

  getCostcenterList() {
    const obj = {
      "SP_String": "SP_Master_Asset_Module",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log("cost center Data", data);
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
    const obj = {
      "SP_String": "SP_Master_Asset_Module",
      "Report_Name_String": "Get_Godown_list",
      "Json_Param_String": JSON.stringify([{ "Cost_Cen_ID": id }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      console.log("godown Data", data);
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

  getSubledgerName(id: any) {
    this.objAsset.Sub_Ledger_Name = undefined;
    if (id) {
      let name = this.subLedgerList.find((ele: any) => ele.value == id);
      if (name) {
        console.log(name);
        this.objAsset.Sub_Ledger_Name = name.label;
      }
    }
  }

  getcosCenName(id: any) {
    this.objAsset.Cost_Cen_Name = undefined;
    this.objAsset.Godown_ID = undefined;
    this.objAsset.Godown_Name = undefined;
    if (id) {
      let name = this.costCenList.find((ele: any) => ele.value == id);
      if (name) {
        console.log(name);
        this.objAsset.Cost_Cen_Name = name.label;
      }
      this.getGodownList(id);
    }
  }

  getGodownName(id: any) {
    if (id) {
      this.objAsset.Godown_Name = undefined;
      let name = this.GodownList.find((ele: any) => ele.value == id);
      if (name) {
        console.log(name);
        this.objAsset.Godown_Name = name.label;
      }
    }
  }


  SaveFormData(valid: any) {
    this.assetFormSubmit = true;
    if (valid) {
      this.assetFormSubmit = false;
      this.Spinner = true;
      this.objAsset.Purchase_Date = this.DateService.dateConvert(this.purchase_Date);
      if (this.buttonname === 'Update') {
        console.log("update works", this.objAsset);
        const obj = {
          "SP_String": "SP_Master_Asset_Module",
          "Report_Name_String": "Save_Master_Asset",
          "Json_Param_String": JSON.stringify([this.objAsset])
        }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          console.log(data);
          if (data[0].Column1) {
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
        console.log("create works", this.objAsset);
        const obj = {
          "SP_String": "SP_Master_Asset_Module",
          "Report_Name_String": "Save_Master_Asset",
          "Json_Param_String": JSON.stringify([this.objAsset])
        }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          console.log("save response", data);
          if (data[0].Column1) {
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

  }

  Active(col: any) {

  }

  Deactive(col: any) {

  }

  TabClick(e: any) {
    this.tabIndexToView = e.index;
    this.clearData();
  }

  onConfirm() {
  }

  onReject() {
    this.CompacctToast.clear("c");
  }

  clearData() {
    this.objAsset = new Asset();
    this.assetFormSubmit = false;
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

