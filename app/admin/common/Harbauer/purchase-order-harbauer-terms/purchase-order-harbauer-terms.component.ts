import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-purchase-order-harbauer-terms',
  templateUrl: './purchase-order-harbauer-terms.component.html',
  styleUrls: ['./purchase-order-harbauer-terms.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None

})
export class PurchaseOrderHarbauerTermsComponent implements OnInit {

  tabIndexToView: number = 0;
  Spinner: boolean = false;
  purchseOrederFormSubmit: boolean = false;
  buttonName: string = "Save";
  TableData: any = [];
  deleteTermsId: number = 0;
  editTermsId: number = 0;
  objPurchaseOreder = new puchaseOreder();

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService

  ) { }

  ngOnInit() {

    this.Header.pushHeader({
      Header: "Purchase Order Terms",
      Link: "Harbaur --> Purchase Order Terms"
    });
    this.getBrowseData();
  }

  getBrowseData() {
    const obj = {
      "SP_String": "sp_Purchase_Order_Terms",
      "Report_Name_String": "Get_Purchase_Order_Terms",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any) => {
      // console.log('get browse data', data);
        this.TableData = data;
    });
  }

  // printHtml(data,i){
  //   var x:any = document.getElementById("print"+i);
  //   x.innerHTML = data;
  // }

  saveDoc(valid: any) {
    this.purchseOrederFormSubmit = true;
    if (valid) {
      if (this.editTermsId != 0) {
        this.purchseOrederFormSubmit = false;
        this.Spinner = true;
        const obj = {
          "SP_String": "sp_Purchase_Order_Terms",
          "Report_Name_String": "Update_Purchase_Order_Terms",
          "Json_Param_String": JSON.stringify(this.objPurchaseOreder),
        }
        // console.log('Update Object', this.objPurchaseOreder);

        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          // console.log('update response', data);
          if (data[0].Column1) {
            this.Spinner = false;
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Purchase Oreder Update",
              detail: "Succesfully "
            });
            this.tabIndexToView = 0;
            this.clearData();
            this.getBrowseData();
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
      else {
        this.purchseOrederFormSubmit = false;
        this.Spinner = true;
        this.objPurchaseOreder.Terms_ID = 0;
        this.objPurchaseOreder.User_ID = this.commonApi.CompacctCookies.User_ID;
        const obj = {
          "SP_String": "sp_Purchase_Order_Terms",
          "Report_Name_String": "Create_Purchase_Order_Terms",
          "Json_Param_String": JSON.stringify(this.objPurchaseOreder),
        }
        // console.log('Creteing Object', this.objPurchaseOreder);

        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          // console.log('save response', data);
          if (data[0].Column1) {
            this.Spinner = false;
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Purchase Oreder Save",
              detail: "Succesfully "
            });
            this.tabIndexToView = 0;
            this.clearData();
            this.getBrowseData();
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
  }

  editDoc(col:any) {
    if (col.Terms_ID) {
      // console.log('edit Works');
      const obj = {
        "SP_String": "sp_Purchase_Order_Terms",
        "Report_Name_String": "Retrieve_Purchase_Order_Terms",
        "Json_Param_String": JSON.stringify({ Terms_ID: col.Terms_ID }),
      }

      this.GlobalAPI.getData(obj).subscribe((data:any) => {
        // console.log('get edit data', data);
        if (data[0].Terms_ID) {
          this.editTermsId = data[0].Terms_ID;
          this.objPurchaseOreder = data[0];
          this.buttonName = "Update";
          window.scrollTo(0, 0);
          // console.log('edit terms id', this.editTermsId);
        }
      });
    }
  }

  deleteDoc(col: any) {
    if (col.Terms_ID) {
      this.deleteTermsId = col.Terms_ID;
      // console.log('delete Works');
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
  }

  onConfirm() {
    if(this.deleteTermsId){
    const obj = {
      "SP_String": "sp_Purchase_Order_Terms",
      "Report_Name_String": "Delete_Purchase_Order_Terms",
      "Json_Param_String": JSON.stringify({ Terms_ID: this.deleteTermsId }),
    }

    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('get delete res', data);
      if (data[0].Column1 = 'Done') {
        this.CompacctToast.clear("c");
        this.CompacctToast.clear();
        this.CompacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Purchase Oreder Delete",
          detail: "Succesfully "
        });
        this.getBrowseData();
        this.clearData();
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

  backToCreate() {
    this.clearData();
  }

  onReject() {
    this.CompacctToast.clear("c");
  }

  clearData() {
    this.objPurchaseOreder = new puchaseOreder();
    this.buttonName = "Save";
    this.editTermsId = 0;
    this.deleteTermsId = 0;
    this.Spinner = false;
    this.purchseOrederFormSubmit = false;
  }
}

class puchaseOreder {
  Terms_ID: any;
  User_ID: any
  Terms_Name: any;
  Terms_Details: any;
}
