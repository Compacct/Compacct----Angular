import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctGetDistinctService } from "../../../shared/compacct.services/compacct-get-distinct.service"
import * as moment from "moment";
declare var $: any;
import * as XLSX from 'xlsx';
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { clear } from 'console';

@Component({
  selector: 'app-tender-estimate',
  templateUrl: './tender-estimate.component.html',
  styleUrls: ['./tender-estimate.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TenderEstimateComponent implements OnInit {
  tabIndexToView = 0;
  items = ["BROWSE", "CREATE", "BID OPENING"];
  url = window["config"];
  persons: [];
  buttonname = "Create";
  Spinner = false;
  ViewFlag = false;
  ObjEstimate: any = {};
  EstimateInfoSubmitted = false;
  EstimateGrpSubmitted = false;
  EstimateGrpName = undefined;
  EstimateGrpModal = false;
  EstimateGroupList = [];
  EstimateSubGroupList = [];
  EstimateSubGrpSubmitted = false;
  EstimateSubGrpName = undefined;
  EstimateSubGrpModal = false;

  workdetalisSubmitted = false;
  workdetalisName = undefined;
  workdetalisModal = false;

  rowGroupMetadata: any;
  rowGroupMetadata2: any;
  EstimateGroupProductList = [];
  AddedEstimateProductList = [];
  ShowAddedEstimateProductList = [];
  projectList = [];
  siteList = [];
  TenderDocID = undefined;
  EstimateModalFlag = false;
  workdetalisList = [];
  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;
  cols = [
    { field: 'Parent_Serial_No', header: 'SL No.' },
    { field: 'Budget_Group_Name', header: 'Group Name' },
    { field: 'Child_Serial_No', header: 'SL No.' },
    { field: 'Budget_Sub_Group_Name', header: 'Sub Group Name' },
    { field: 'Work_Details', header: 'Work Details' },
    { field: 'Product_Description', header: 'Product' },
    { field: 'unit', header: 'Unit Description' },
    { field: 'Qty', header: 'Qty' },
    { field: 'Nos', header: 'Nos' },
    { field: 'TQty', header: 'Total Qty' },
    { field: 'UOM', header: 'UOM' },
    { field: 'saleRate', header: 'Sale Rate' },
    { field: 'Sale_Amount', header: 'Sale Amount' },
    { field: 'Rate', header: 'Purchase Rate' },
    { field: 'Amount', header: 'Purchase Amount' }
];
  constructor(private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems: CompacctGetDistinctService,
    private route: ActivatedRoute,) {
    this.route.queryParams.subscribe(params => {
      console.log("params", params);
      this.TenderDocID = params.Tender_Doc_ID
    })
  }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Tender Estimate",
      Link: " Tender Management -> Master -> Tender Estimate"
    });
    this.GetEstimateGroup();
    this.GetProject();
    this.getworkDetails();
    this.GetProduct();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE", "BID OPENING"];
    this.buttonname = "Create";
    this.clearData();


  }
  clearData() {

  }
  // ESTIMATE
  ToggleEstimateGrp() {
    this.EstimateGrpSubmitted = false;
    this.EstimateGrpName = undefined;
    this.EstimateGrpModal = true;
    this.Spinner = false;
  }
  GetEstimateGroup() {
    const obj = {
      "SP_String": "SP_Tender_Management_All",
      "Report_Name_String": "Get_Budget_Group_Name",
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
        console.log(data)
        data.forEach(el => {
          el['label'] = el.Budget_Group_Name;
          el['value'] = el.Budget_Group_ID;
        });
        this.EstimateGroupList = data;
      });
  }

  GetProject() {
    const obj = {
      "SP_String": "SP_Tender_Management_All",
      "Report_Name_String": "Get Project",
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
        console.log("project", data)
        data.forEach(el => {
          el['label'] = el.Project_Description;
          el['value'] = el.Project_ID;
        });

        this.projectList = data;
      });
  }
  getSiteList(id) {
    this.siteList = [];
    if (id) {
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get Site",
        "Json_Param_String": JSON.stringify([{ 'Project_ID': id }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log("site", data)
          data.forEach(el => {
            el['label'] = el.Site_Description;
            el['value'] = el.Site_ID;
          });
          this.siteList = data;
        });
    }
  }
  EstimateGroupChange(id) {
    this.EstimateSubGroupList = [];
    this.ObjEstimate.Budget_Group_Name = undefined;
    this.ObjEstimate.Budget_Sub_Group_ID = undefined;
    this.ObjEstimate.Budget_Sub_Group_Name = undefined;
    if (id) {
      this.ObjEstimate.Budget_Group_Name = this.EstimateGroupList.filter(ob => ob.Budget_Group_ID.toString() === id.toString())[0].Budget_Group_Name;
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get_Budget_Sub_Group_Name",
        "Json_Param_String": JSON.stringify([{ 'Budget_Group_ID': id }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log(data)
          data.forEach(el => {
            el['label'] = el.Budget_Sub_Group_Name;
            el['value'] = el.Budget_Sub_Group_ID;
          });
          this.EstimateSubGroupList = data;
        });
    }

  }
  CreateEstimateGrp(valid) {
    this.EstimateGrpSubmitted = true;
    if (valid) {
      this.Spinner = true;
      const temp = {
        Budget_Group_Name: this.EstimateGrpName
      }
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Budget_Group_Create",
        "Json_Param_String": JSON.stringify([temp])
      }
      this.GlobalAPI
        .postData(obj)
        .subscribe((data: any) => {
          console.log(data)
          if (data[0].Column1) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Budget Group Created"
            });
            this.GetEstimateGroup();
            this.EstimateGrpSubmitted = false;
            this.EstimateGrpName = undefined;
            this.EstimateGrpModal = false;
            this.EstimateSubGroupList = [];
            this.Spinner = false;
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        });
    }
  }
  getworkDetails() {
    const obj = {
      "SP_String": "SP_Tender_Management_All",
      "Report_Name_String": "Get Work Details",
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
        console.log("work Details", data)
        data.forEach(el => {
          el['label'] = el.Work_Details;
          el['value'] = el.Work_Details_ID;
        });

        this.workdetalisList = data;
      });
  }
  ToggleEstimateSubGrp() {
    this.EstimateSubGrpSubmitted = false;
    this.EstimateSubGrpName = undefined;
    this.EstimateSubGrpModal = true;
    this.Spinner = false;
    if (this.ObjEstimate.Budget_Group_ID) {
      this.EstimateSubGrpModal = true;
    }
  }
  Toggleworkdetalis() {
    this.workdetalisSubmitted = false;
    this.workdetalisName = undefined;
    this.workdetalisModal = true;
    this.Spinner = false;
    if (this.ObjEstimate.Budget_Group_ID) {
      this.workdetalisModal = true;
    }
  }
  EstimateSubGroupChange(id) {
    this.ObjEstimate.Budget_Sub_Group_Name = undefined;
    if (id) {
      this.ObjEstimate.Budget_Sub_Group_Name = this.EstimateSubGroupList.filter(ob => ob.Budget_Sub_Group_ID.toString() === id.toString())[0].Budget_Sub_Group_Name;

    }
  }
  EstimateworkDetailsChange(id) {
    this.ObjEstimate.Work_Details = undefined;
    if (id) {
      this.ObjEstimate.Work_Details = this.workdetalisList.filter(ob => ob.Work_Details_ID.toString() === id.toString())[0].Work_Details;

    }
  }
  CreateEstimateSubGrp(valid) {
    this.EstimateSubGrpSubmitted = true;
    if (valid) {
      this.Spinner = true;
      const temp = {
        Budget_Group_ID: this.ObjEstimate.Budget_Group_ID,
        Budget_Sub_Group_Name: this.EstimateSubGrpName
      }
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Budget_Sub_Group_Create",
        "Json_Param_String": JSON.stringify([temp])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log(data)
          if (data[0].Column1) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Budget Group Created"
            });
            this.EstimateGroupChange(this.ObjEstimate.Budget_Group_ID);
            this.EstimateSubGrpSubmitted = false;
            this.EstimateSubGrpName = undefined;
            this.EstimateSubGrpModal = false;
            this.Spinner = false;
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        });
    }
  }
  CreateEstimateworkdetails(valid) {
    this.workdetalisSubmitted = true;
    if (valid) {
      this.Spinner = true;
      const temp = {
        Work_Details: this.workdetalisName
      }
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Save_BL_CRM_Txn_Enq_Work_Detail",
        "Json_Param_String": JSON.stringify([temp])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log(data)
          if (data[0].Column1) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully work Details Created"
            });
            //this.EstimateGroupChange(this.ObjEstimate.Budget_Group_ID);
            this.getworkDetails();
            this.workdetalisSubmitted = false;
            this.workdetalisName = undefined;
            this.workdetalisModal = false;
            this.Spinner = false;
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        });
    }
  }
  Cleardata3() {
    this.ObjEstimate.Product_ID = undefined;
    this.ObjEstimate.Product_Description = undefined;
    this.ObjEstimate.UOM = undefined;
  }
  GetProduct() {
    const obj = {
      "SP_String": "SP_Tender_Management_All",
      "Report_Name_String": "Get_Product_Name",
    }
    this.GlobalAPI
      .getData(obj)
      .subscribe((data: any) => {
        console.log(data)
        data.forEach(el => {
          el['label'] = el.Product_Description;
          el['value'] = el.Product_ID;
        });
        this.EstimateGroupProductList = data;
      });
  }
  EstimateGroupProductChange(id) {
    this.ObjEstimate.Product_Description = undefined;
    this.ObjEstimate.UOM = undefined;
    if (id) {
      const arr = this.EstimateGroupProductList.filter(ob => ob.Product_ID.toString() === id.toString());
      this.ObjEstimate.Product_Description = arr[0].Product_Description;
      this.ObjEstimate.UOM = arr[0].UOM;
    }
  }
  CalculateEstimateAmount() {
    this.ObjEstimate.Amount = undefined;
    if (this.ObjEstimate.TQty && this.ObjEstimate.Rate) {
      this.ObjEstimate.Amount = (Number(this.ObjEstimate.Rate) * Number(this.ObjEstimate.TQty)).toFixed(2);

    }
  }
  CalculateEstimatesaleAmount() {
    this.ObjEstimate.Sale_Amount = undefined;
    if (this.ObjEstimate.TQty && this.ObjEstimate.saleRate) {
      this.ObjEstimate.Sale_Amount = (Number(this.ObjEstimate.saleRate) * Number(this.ObjEstimate.TQty)).toFixed(2);

    }
  }
  CalculateEstimateQty() {
    this.ObjEstimate.TQty = undefined;
    if (this.ObjEstimate.Qty && this.ObjEstimate.Nos) {
      this.ObjEstimate.TQty = (Number(this.ObjEstimate.Nos) * Number(this.ObjEstimate.Qty));
      this.CalculateEstimateAmount();
      this.CalculateEstimatesaleAmount();
    }
  }
  AddEstimate(valid) {
    this.EstimateInfoSubmitted = true;
    if (valid) {
      this.ShowAddedEstimateProductList = [];
      const extimateObj = { ...this.ObjEstimate , ...{ uid : '_' + Math.random().toString(36).substr(2, 9)}};
      extimateObj.items = [];
      //this.ObjEstimate = {};
      this.ObjEstimate.Product_ID = undefined;
      this.ObjEstimate.Qty = undefined;
      this.ObjEstimate.UOM = undefined;
      this.ObjEstimate.Rate = undefined;
      this.ObjEstimate.Amount = undefined;
      this.ObjEstimate.Product_Req = undefined;
      this.ObjEstimate.Product_Req = undefined;
      this.ObjEstimate.Sale_Amount = undefined;
      this.ObjEstimate.saleRate = undefined;
      this.ObjEstimate.TQty = undefined;
      this.ObjEstimate.Nos = undefined;
      this.ObjEstimate.unit = undefined;
      this.AddedEstimateProductList.push(extimateObj);
      // this.AddedEstimateProductList.sort(function (a, b) {
      //   return parseFloat(a.Budget_Group_ID) - parseFloat(b.Budget_Group_ID);
      // });
      this.EstimateInfoSubmitted = false;
      this.ShowAddedEstimateProductList = this.AddedEstimateProductList;
      let dupSub = [];
      let parentCount = 0;
      for(var i = 0; i < this.ShowAddedEstimateProductList.length; i++) {
        if (dupSub.indexOf(this.ShowAddedEstimateProductList[i]['Budget_Group_ID']) === -1) {
          parentCount = parentCount + 1;
          this.ShowAddedEstimateProductList[i]['Parent_Serial_No'] = parentCount;
          dupSub.push(this.ShowAddedEstimateProductList[i]['Budget_Group_ID']);
          const ParentDub = this.ShowAddedEstimateProductList.filter(obj => obj.Budget_Group_ID == this.ShowAddedEstimateProductList[i].Budget_Group_ID);        
          var out2 = [];          
          var count = 0;
          if (ParentDub.length) {
            for (var k = 0; k < ParentDub.length; k++) {
              if (out2.indexOf(ParentDub[k]['Budget_Sub_Group_ID']) === -1) {
                count = count + 1;
                this.ShowAddedEstimateProductList.forEach((e,o) => {
                  if(e.uid ===  ParentDub[k].uid) 
                  this.ShowAddedEstimateProductList[o]['Child_Serial_No'] = parentCount + '.' + count;
                });
                out2.push(ParentDub[k]['Budget_Sub_Group_ID']);              
              } else{
                const childFilt = ParentDub.filter(e=> {
                  return e.Budget_Group_ID == ParentDub[k]['Budget_Group_ID'] &&  e.Budget_Sub_Group_ID == ParentDub[k]['Budget_Sub_Group_ID']
                });
                console.log(childFilt)
                childFilt.forEach(it => {
                  this.ShowAddedEstimateProductList.forEach((e,o) => {
                    if(e.uid ===  it.uid) 
                    this.ShowAddedEstimateProductList[o]['Child_Serial_No'] = parentCount + '.' + count;
                  });
                })
                
              }
            }

          }

        } else {
          this.ShowAddedEstimateProductList[i]['Parent_Serial_No'] = this.ShowAddedEstimateProductList.find(e=> e.Budget_Group_ID == this.ShowAddedEstimateProductList[i]['Budget_Group_ID']).Parent_Serial_No;
        }
      }
      console.log(this.ShowAddedEstimateProductList);

    }

  }
  getNestedChildren(arr) {
    var out = []
    var WholeArr = [];
    for (var i = 0; i < arr.length; i++) {
      var count = 0;
      var out2 = []
      if (out.indexOf(arr[i]['Budget_Group_ID']) === -1) {
        out.push(arr[i]['Budget_Group_ID']);
        const ParentDub = arr.filter(obj => obj.Budget_Group_ID == arr[i].Budget_Group_ID);
        let childParent = [];
        if (ParentDub.length) {
          for (var k = 0; k < ParentDub.length; k++) {
            var count = 0;
            if (out2.indexOf(ParentDub[k]['Budget_Sub_Group_ID']) === -1) {
              out2.push(ParentDub[k]['Budget_Sub_Group_ID']);
              const childDub = ParentDub.filter(obj => obj.Budget_Group_ID == arr[i].Budget_Group_ID && obj.Budget_Sub_Group_ID == ParentDub[k].Budget_Sub_Group_ID);
              childParent.push({
                'Sl_No': (out.length).toString() + '.' + (out2.length).toString(),
                'Child_Parent_ID': ParentDub[k]['Budget_Sub_Group_ID'],
                'Child_Parent_Name': ParentDub[k]['Budget_Sub_Group_Name'],
                'Total_Sub_Group_Amt': this.TotalByProperty(childDub, 'Amount'),
                'items': childDub
              })
            }
          }
        } else {
          const childDub = ParentDub.filter(obj => obj.Budget_Group_ID == arr[i].Budget_Group_ID && obj.Budget_Sub_Group_ID == arr[i].Budget_Sub_Group_ID);
          childParent.push({
            'Sl_No': (out.length).toString() + '.1',
            'Child_Parent_ID': arr[i]['Budget_Sub_Group_ID'],
            'Child_Parent_Name': arr[i]['Budget_Sub_Group_Name'],
            'Total_Sub_Group_Amt': this.TotalByProperty(childDub, 'Amount'),
            'items': childDub
          })
        }

        const RootObj = {
          'Sl_No': (out.length).toString(),
          'Root_Parent_ID': arr[i]['Budget_Group_ID'],
          'Root_Parent_Name': arr[i]['Budget_Group_Name'],
          'No_of_Child': ParentDub.length,
          'Total_Group_Amt': this.TotalByProperty(ParentDub, 'Amount'),
          'Total_Amt': this.TotalByProperty(arr, 'Amount'),
          'items': childParent
        }
        WholeArr.push(RootObj);
      } else {

      }
    }
    return WholeArr
  }
  TotalByProperty(items, prop) {
    return items.reduce(function (a, b) {
      return Number(a) + Number(b[prop]);
    }, 0);
  };
  SaveEsitimate() {
    if (this.ShowAddedEstimateProductList.length) {
      // this.ObjEstimate.Appo_Date = this.DateService.dateConvert(new Date(this.ResceduleAppoDate));
      const tempArr = this.FetchEstimateObj();
      console.log("saveData", tempArr);

      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Tender_Estimation_Create",
        "Json_Param_String": JSON.stringify(tempArr)
      }
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      this.GlobalAPI
        .postData(obj)
        .subscribe((data: any) => {
          console.log(data);
          if (data[0].Column1) {
            //this.SearchTender(true);
            this.EstimateInfoSubmitted = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'Estimate Management ',
              detail: "Succesfully Save."
            });
            this.ObjEstimate = {};
            this.TenderDocID = undefined;
            this.EstimateModalFlag = false;

          } else {

            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "error",
              detail: data[0].Remarks
            });
          }
        })
    }
    if (!this.ShowAddedEstimateProductList.length) {
      this.EstimateInfoSubmitted = true;
    }
  }
  FetchEstimateObj() {
    console.log("ObjEstimate.site_ID", this.ObjEstimate.site_ID);
    let tempArr = [];
    for (var i = 0; i < this.ShowAddedEstimateProductList.length; i++) {
      const temp = this.ShowAddedEstimateProductList[i];
      if (temp.items.length) {
        for (var k = 0; k < temp.items.length; k++) {
          const temp2 = temp.items[k];
          let slno = temp2.Sl_No;
          if (temp2.items.length) {
            for (var h = 0; h < temp2.items.length; h++) {
              const e = temp2.items[h];
              if (e && e.Budget_Group_ID) {
                const tempObj = {
                  Sl_No: slno,
                  Budget_Group_ID: e.Budget_Group_ID,
                  Budget_Sub_Group_ID: e.Budget_Sub_Group_ID,
                  Product_ID: e.Product_ID,
                  Product_Description: e.Product_Description,
                  Total_Qty: e.Qty,
                  UOM: e.UOM,
                  Rate: e.Rate,
                  Amount: e.Amount,
                  Tender_Doc_ID: this.TenderDocID,
                  Project_ID: e.project_ID,
                  Site_ID: e.site_ID,
                  Work_Details_ID: e.Work_Details_ID,
                  Unit_Description: e.unit,
                  Qty: e.Qty,
                  NOs: e.Nos,
                  Sale_Rate: e.saleRate,
                  Sale_Amount: e.Sale_Amount
                }
                tempArr.push(tempObj);
              }

            }
          }
        }

      }
    }
    return tempArr;
  }
  testchange(id) {
    console.log(id);
  }
}