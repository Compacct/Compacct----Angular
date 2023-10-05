import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-salesman-target-for-joh',
  templateUrl: './salesman-target-for-joh.component.html',
  styleUrls: ['./salesman-target-for-joh.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SalesmanTargetForJohComponent implements OnInit {
  tabIndexToView: number = 0;
  searchSpinner: boolean = false;
  Spinner: boolean = false;
  salesmanDate: Date = new Date();
  addedSalesman: any = [];
  SalesmanList: any = [];
  SalesmanDropList: any = [];
  deleteTargetID = undefined;
  salesmanFormSubmit: boolean = false;
  objSalesman = new Salesman();

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Salesman Target",
      Link: "Patient Management --> Salesman Target"
    });
    this.getRetriveData();
    this.getSalesman();
  }

  getSalesman() {
    const obj1 = {
      "SP_String": "Sp_BL_Txn_Salesman_Target_for_joh",
      "Report_Name_String": "Get_Salesman_For_Dropdown"
    }

    this.GlobalAPI.getData(obj1).subscribe((data: any) => {
      // console.log('Salesman list', data);
      this.SalesmanList = data;
      data.forEach((ele: any) => {
        this.SalesmanDropList.push({
          "label": ele.Member_Name,
          "value": ele.Member_ID
        });
      });
      // console.log('Salesman drop list', this.SalesmanDropList);
    });
  }

  getRetriveData() {
    this.salesmanFormSubmit = false;
    this.addedSalesman = [];
    this.objSalesman = new Salesman();
    let retrive_date = this.DateService.dateConvert(new Date(this.salesmanDate.getFullYear(), this.salesmanDate.getMonth(), 1));
    const obj = {
      "SP_String": "Sp_BL_Txn_Salesman_Target_for_joh",
      "Report_Name_String": "Retrieve_Salesman_Target",
      "Json_Param_String": JSON.stringify([{ Sales_Target_Date: retrive_date }])
    }

    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log('retrive data', data);
      data.forEach((ele: any) => {
        this.addedSalesman.push({
          "Sales_Target_ID": ele.Sales_Target_ID,
          "Member_ID": ele.Member_ID,
          "Sales_Target_1": ele.Sales_Target_1,
          "Sales_Target_2": ele.Sales_Target_2,
          "Member_Name": ele.Member_Name
        })
      })
    })
  }

  AddToList(valid: any) {
    this.salesmanFormSubmit = true;
    if (valid) {
      const checkdata = this.addedSalesman.filter((ele: any) => ele.Member_ID === this.objSalesman.Member_ID);
      // console.log('check data', checkdata);
      if (!checkdata.length) {
        let formatdate = new Date(this.salesmanDate.getFullYear(), this.salesmanDate.getMonth(), 1);
        this.objSalesman.Sales_Target_ID = 0;
        this.objSalesman.Sales_Target_Date = this.DateService.dateConvert(formatdate);
        // console.log('save data', this.objSalesman);
        this.Spinner = true;

        const obj = {
          "SP_String": "Sp_BL_Txn_Salesman_Target_for_joh",
          "Report_Name_String": "Create_Salesman_Target",
          "Json_Param_String": JSON.stringify([this.objSalesman])
        }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          // console.log('Create Response', data);
          if (data[0].Column1 == "done") {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Salesman with targets ",
              detail: "Succesfully Save"
            });
            this.Spinner = false;
            this.getRetriveData();
            this.objSalesman = new Salesman();
            this.salesmanFormSubmit = false;
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
          summary: "Duplicate Salesman",
          detail: "This Salesman Already Exist in List"
        });
      }
    }
  }

  updateAmount(col) {
    if (col.Sales_Target_ID && col.Sales_Target_1 && col.Sales_Target_2) {
      // console.log('col.Sales_Target_ID && col.Sales_Target_1 && col.Sales_Target_2', col.Sales_Target_ID, col.Sales_Target_1, col.Sales_Target_2);
      const obj = {
        "SP_String": "Sp_BL_Txn_Salesman_Target_for_joh",
        "Report_Name_String": "Update_Salesman_Target",
        "Json_Param_String": JSON.stringify([{ Sales_Target_ID: col.Sales_Target_ID, Sales_Target_1: col.Sales_Target_1, Sales_Target_2: col.Sales_Target_2}])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log('update response', data);
        if (data[0].Column1 = "Done") {
          this.CompacctToast.clear('c');
          this.CompacctToast.clear();
          this.CompacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Salesman Target",
            detail: "Succesfully update"
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

  deleteSalesman(col) {
    this.deleteTargetID = col.Sales_Target_ID;
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
      "SP_String": "Sp_BL_Txn_Salesman_Target_for_joh",
      "Report_Name_String": "Delete_Salesman_Target",
      "Json_Param_String": JSON.stringify([{ Sales_Target_ID: this.deleteTargetID }])
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
      // console.log('delete response', data);
      if (data[0].Column1 = "Done") {
        this.CompacctToast.clear('c');
        this.CompacctToast.clear();
        this.CompacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Salesman with targets",
          detail: "Succesfully Deleted"
        });
        this.getRetriveData();
        this.deleteTargetID=undefined;
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
    this.addedSalesman.forEach((ele:any) =>{
      totalAmount1 += Number(ele.Sales_Target_1);
    })

    return totalAmount1;
  }

  calTotal2() {
    let totalAmount2  = 0;
    this.addedSalesman.forEach((ele:any) =>{
      totalAmount2 += Number(ele.Sales_Target_2);
    })

    return totalAmount2;
  }

  onReject() {
    this.CompacctToast.clear('c');
  }

}

class Salesman {
  Sales_Target_ID: any;
  Sales_Target_Date: any;
  Member_ID: any; 
  Sales_Target_1: any;
  Sales_Target_2: any;
}
