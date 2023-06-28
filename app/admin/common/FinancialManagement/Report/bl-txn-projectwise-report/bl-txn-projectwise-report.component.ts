import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ExportExcelService } from '../../../../shared/compacct.services/export-excel.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
@Component({
  selector: 'app-bl-txn-projectwise-report',
  templateUrl: './bl-txn-projectwise-report.component.html',
  styleUrls: ['./bl-txn-projectwise-report.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BlTxnProjectwiseReportComponent implements OnInit {
  BrowseFromSubmit: boolean = false;
  Project_Id: any = undefined;
  From_Date: any = undefined;
  To_Date: any = undefined;
  Start_Date: any = undefined;
  End_Date: any = undefined;
  initDate2: any = [];
  ProjectList: any = [];
  tabIndexToView: number = 0;
  purchaseBill: any = [];
  purchesTotal: any = undefined;
  ExpenseList: any = [];
  expenseTotal: any = undefined;
  Salelist: any = [];
  SaleTotal: any = undefined;
  Filterproject: any = undefined;
  outFolwlist: any =[];
  outFolwlistTotal:any = undefined;
  Inflowlist: any =[];
  InflowTotal:any = undefined;
  Inflowlist2: any =[];
  outFolwlist2: any = [];
  ProjectList2: any = [];
  Project_Id2: any = undefined;
  Fin_Year_ID: any = undefined;
  FinyearList: any = [];
  projectFromSubmit: boolean = false;
  FINyear: any = undefined;
  INFoFinanc: any =[];
  TotalPRji: any = undefined;
  TotalActi: any = undefined;
  OutFinanc: any = [];
  TotalOut: any = undefined;
  TotalActiOut: any = undefined;
  constructor(
    public Header: CompacctHeader,
    public DateService: DateTimeConvertService,
    public $http: HttpClient,
    public compacctToast: MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private _exportExcel: ExportExcelService,
    private GlobalAPI:CompacctGlobalApiService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Project Wise Report",
      Link: " Financial Management -> Report-> Project Wise Report"
    });
    this.getProject();
    this.getFin()
  }
  // getDateRange(dateRangeObj:any ,) {
  //   if (dateRangeObj.length) {
  //     this.From_Date = dateRangeObj[0];
  //     this.To_Date = dateRangeObj[1];
  //   }
  // }
  getFin() {
    this.$http.get('/Common/Get_Fin_Year').subscribe((Res:any) => {
     // console.log(Res)
      this.FinyearList = JSON.parse(Res);
    })
  }
  getDateRange1(dateRangeObj1:any) {
    if (dateRangeObj1.length) {
      this.Start_Date = dateRangeObj1[0];
      this.End_Date = dateRangeObj1[1]; 
      }
  }
  getProject(){
    this.ProjectList = [];
    this.ProjectList2 = [];
    const obj = {
      "SP_String": "SP_BL_CRM_TXN_Project_Doc",
      "Report_Name_String": "Get_Project",
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Project_Description;
        el['value'] = el.Project_ID;
      });
      this.ProjectList = data;
      this.ProjectList2 = data;
      //console.log("ProjectList",this.ProjectList);
    })
  }
  BrowseExcel(valid:any) {
    this.BrowseFromSubmit = true;
    this.Filterproject = undefined;
    this.purchesTotal = undefined;
    if (valid) {
      let Filterr = this.ProjectList.filter((el: any) => Number(el.Project_ID) === Number(this.Project_Id));
      this.Filterproject = Filterr[0].Project_Description;
      this.From_Date = this.From_Date ? this.DateService.dateConvert(this.From_Date) : this.DateService.dateConvert(new Date());
      this.To_Date = this.To_Date ? this.DateService.dateConvert(this.To_Date) : this.DateService.dateConvert(new Date());
      } 
      const File = {
        Project_ID: this.Project_Id,
        From_Date:  this.From_Date,
        To_Date: this.To_Date
      } 
     const obj = {
      "SP_String": "SP_Project_PL",
       "Report_Name_String": "Get_Purchase",
      "Json_Param_String": JSON.stringify([File]),
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.purchaseBill = data;
      this.purchesTotal =  this.purchaseBill.reduce((total, obj) => obj.Amount + total,0)
      //console.log("purchaseBill", data);
      //console.log("jkhdf", this.purchesTotal)
      this.getDirectExpense(this.Project_Id,this.From_Date,this.To_Date,)
    })
  }
  getDirectExpense(pro_id: any, Fr_DAte: any, To_Date: any) {
    this.ExpenseList = []
    this.expenseTotal = undefined;
    if (pro_id) {
      const File1 = {
        Project_ID: pro_id,
        From_Date:  Fr_DAte,
        To_Date: To_Date
      }
      const obj = {
      "SP_String": "SP_Project_PL",
       "Report_Name_String": "Get_Expenses",
      "Json_Param_String": JSON.stringify([File1]),
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ExpenseList = data;
      this.expenseTotal =  this.ExpenseList.reduce((total, obj) => obj.Amount + total,0)
      //console.log("ExpenseList", this.ExpenseList);
      //console.log("this.expenseTotal", this.expenseTotal);
      this.getSaleBill(this.Project_Id,this.From_Date,this.To_Date)
        })
      }
  }
  getSaleBill(Proj_id, From_Date,To_Datee) {
    this.Salelist = [];
    this.SaleTotal = undefined;
    if (Proj_id) {
      const File2 = {
        Project_ID: Proj_id,
        From_Date:  From_Date,
        To_Date: To_Datee
      }
      const obj = {
      "SP_String": "SP_Project_PL",
       "Report_Name_String": "Get_Sales",
      "Json_Param_String": JSON.stringify([File2]),
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Salelist = data;
      this.SaleTotal =  this.Salelist.reduce((total, obj) => obj.Amount + total,0)
      //console.log("Salelist", this.Salelist);
      //console.log("this.SaleTotal", this.SaleTotal);
      this.getInflow(this.Project_Id,this.From_Date,this.To_Date)
        })
      } 
  }
  getInflow(Proj_idd, From_Datee,To_Dateee) {
    this.Inflowlist = [];
    this.InflowTotal = undefined;
    if (Proj_idd) {
      const File2 = {
        Project_ID: Proj_idd,
        From_Date:  From_Datee,
        To_Date: To_Dateee
      }
      const obj = {
      "SP_String": "SP_Project_PL",
       "Report_Name_String": "Get_Inflow",
      "Json_Param_String": JSON.stringify([File2]),
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Inflowlist = data;
      this.InflowTotal =  this.Inflowlist.reduce((total, obj) => obj.Amount + total,0)
      //console.log("Inflowlist", this.Inflowlist);
      //console.log("this.InflowTotal", this.InflowTotal);
      this.getOutflow(Proj_idd, From_Datee,To_Dateee)
        })
      } 
  }
  getOutflow(Proj, From_D,To_D) {
    this.outFolwlist = [];
    this.outFolwlistTotal = undefined;
    if (Proj) {
      const File2 = {
        Project_ID: Proj,
        From_Date:  From_D,
        To_Date: To_D
      }
      const obj = {
      "SP_String": "SP_Project_PL",
       "Report_Name_String": "Get_Outflow",
      "Json_Param_String": JSON.stringify([File2]),
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.outFolwlist = data;
      this.outFolwlistTotal =  this.outFolwlist.reduce((total, obj) => obj.Amount + total,0)
      //console.log("outFolwlist", this.outFolwlist);
      //console.log("this.outFolwlistTotal", this.outFolwlistTotal);
      this._exportExcel.DownloadExcelReportHB(this.Filterproject ,this.From_Date,this.To_Date,this.purchaseBill,this.ExpenseList,this.Salelist,this.Inflowlist,this.outFolwlist,this.purchesTotal,this.expenseTotal,this.SaleTotal,this.InflowTotal,this.outFolwlistTotal) 
        })
      } 
  }
  // Second Excel Download 
  BrowseExcelDateInfol() {
    this.Inflowlist2 = [];
   this.InflowTotal = undefined;
      this.Start_Date = this.Start_Date ? this.DateService.dateConvert(this.Start_Date) : this.DateService.dateConvert(new Date());
      this.End_Date = this.End_Date ? this.DateService.dateConvert(this.End_Date) : this.DateService.dateConvert(new Date());
      const File = {
        StartDate:  this.Start_Date,
        EndDate: this.End_Date
      } 
     const obj = {
      "SP_String": "SP_Project_PL",
       "Report_Name_String": "Get_Inflow_Date",
      "Json_Param_String": JSON.stringify([File]),
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Inflowlist2 = data;
      this.InflowTotal =  this.Inflowlist2.reduce((total, obj) => obj.Amount + total,0)
      //console.log("Inflowlist2", this.Inflowlist2);
      this.BrowseExcelDateOutFlw(this.Start_Date,this.End_Date,)
    })  
  }
  BrowseExcelDateOutFlw(Start :any , End:any) {
     this.outFolwlist2 = [];
    this.outFolwlistTotal = undefined;
      const File2 = {
        StartDate:  Start,
        EndDate: End
      }
      const obj = {
      "SP_String": "SP_Project_PL",
       "Report_Name_String": "Get_Outflow_Date",
      "Json_Param_String": JSON.stringify([File2]),
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.outFolwlist2 = data;
      this.outFolwlistTotal =  this.outFolwlist2.reduce((total, obj) => obj.Amount + total,0)
      //console.log("outFolwlist", this.outFolwlist2);
      this.GetExcelSecond(this.Inflowlist2,this.outFolwlist2 ,Start, End,this.InflowTotal,this.outFolwlistTotal) 
        })
  }
  GetExcelSecond(InfFlow2:any,outFlow2:any, From:any, To:any, totalINf:any, TotaloutFl:any) {
   //Inflow-OutFlow Start
    let workbook = new Workbook();
    let worksheetInflow = workbook.addWorksheet('Date Wise Inflow_outflow');
   let Project1STATEMENTRow = worksheetInflow.addRow([]);
    Project1STATEMENTRow.getCell(1).value = "DATE WISE INFLOW - OUTFLOW STATEMENT";
    Project1STATEMENTRow.getCell(1).font={
      size: 11,
      bold: true,
      color: { argb: '4775d8' },
      name :  'Calibri' ,
    }
    Project1STATEMENTRow.getCell(1).alignment = {
      horizontal:'center'
    }
    worksheetInflow.mergeCells('A1', 'D1');

    let Project1PERIODRow = worksheetInflow.addRow([]);
     Project1PERIODRow.getCell(1).value = "AS ON DATE"+" ( " + `${From} - ${To}` + " )";
     Project1PERIODRow.getCell(1).font={
          size: 11,
            bold: true, 
                name :  'Calibri' ,
    }
    Project1PERIODRow.getCell(1).alignment = {
      horizontal:'left'
    }
    worksheetInflow.mergeCells('A2', 'D2');

    let InflowRow = worksheetInflow.addRow([]);
    InflowRow.getCell(1).value = "Inflow";
    InflowRow.getCell(1).font={
       size: 11,
       bold: true,
       name :  'Calibri' ,
    }
    InflowRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'c6e0b4' },
      bgColor: { argb: '' },
    }
    InflowRow.getCell(1).border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'thin' },
      right: { style: 'medium' },
    };
    InflowRow.getCell(1).alignment = {
      horizontal:'center'
    }
    worksheetInflow.mergeCells('A3', 'D3');

    let SiteName1Row = worksheetInflow.addRow([]);
    SiteName1Row.getCell(1).value = "Project Description";
    SiteName1Row.getCell(1).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteName1Row.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteName1Row.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    SiteName1Row.getCell(1).alignment = {
      horizontal:'center'
    }

    SiteName1Row.getCell(2).value = "Site Name";
    SiteName1Row.getCell(2).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteName1Row.getCell(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteName1Row.getCell(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    SiteName1Row.getCell(2).alignment = {
      horizontal:'center'
    }

    SiteName1Row.getCell(3).value = "Ledger / Sub Ledger";
    SiteName1Row.getCell(3).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteName1Row.getCell(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteName1Row.getCell(3).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    SiteName1Row.getCell(3).alignment = {
      horizontal:'center'
    }

    SiteName1Row.getCell(4).value = "Amount";
    SiteName1Row.getCell(4).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteName1Row.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteName1Row.getCell(4).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'medium' },
    };
    SiteName1Row.getCell(4).alignment = {
      horizontal:'center'
    }
    worksheetInflow.getColumn(1).width = 50.71;
    worksheetInflow.getColumn(2).width = 41.71;
    worksheetInflow.getColumn(3).width = 55.71;
    worksheetInflow.getColumn(4).width = 23.14;
    worksheetInflow.getRow(4).height = 12.75;

        const data6:any = [];
        InfFlow2 .forEach((ele:any) => {
          data6.push(Object.values(ele))
        });
        data6.forEach(d => {
        const row= worksheetInflow.addRow(d);
        for( let i= 0; i< d.length;i++ ){
          row.getCell(i + 1).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
          }
          row.getCell(4).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'medium' },
          }
          row.getCell(i + 1).alignment = {
            horizontal: 'left',
            vertical: 'middle',
            wrapText:true
          } 
          row.getCell(i+1).font = {
            size:10
          }
        }
        row.getCell(4).alignment = {
        horizontal: 'right',
        vertical: 'middle',
          wrapText: true
        }
        }
        );

     let TotalInflowAmountBillRow = worksheetInflow.addRow([])
      TotalInflowAmountBillRow.getCell(3).value = "Total Inflow Amount";
      TotalInflowAmountBillRow.getCell(1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
      };
    TotalInflowAmountBillRow.getCell(2).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      TotalInflowAmountBillRow.getCell(3).alignment = {
        horizontal:'right'
      }
      TotalInflowAmountBillRow.getCell(3).font={
        size: 10,
        bold: true,
        name :  'Calibri' ,
      }
      TotalInflowAmountBillRow.getCell(3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'c6e0b4' },
        bgColor: { argb: '' },
      }
      TotalInflowAmountBillRow.getCell(3).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      TotalInflowAmountBillRow.getCell(4).value = Number(totalINf);
      TotalInflowAmountBillRow.getCell(4).alignment = {
          horizontal:'right'
        }
      TotalInflowAmountBillRow.getCell(4).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'medium' },
      };
      TotalInflowAmountBillRow.getCell(4).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'c6e0b4' },
        bgColor: { argb: '' },
    }
    let BlankRow6 = worksheetInflow.addRow([])
        BlankRow6.getCell(4).border = {
         right: { style: 'medium' },
      }
    let OutflowRow = worksheetInflow.addRow([])
        OutflowRow.getCell(1).value = "Outflow";
        OutflowRow.getCell(1).font={
          size: 11,
          bold: true,
          name :  'Calibri' ,
        }
        OutflowRow.getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'f8cbad' },
          bgColor: { argb: '' },
        }
        OutflowRow.getCell(1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'medium' },
        };
        OutflowRow.getCell(1).alignment = {
          horizontal:'center'
        }
        const mergeRowValue1 = (v:any) => {
          return  data6.length + v
        }
    worksheetInflow.mergeCells('A' + mergeRowValue1(7), 'D' + mergeRowValue1(7));
    
    let SiteName2Row = worksheetInflow.addRow([]);
    SiteName2Row.getCell(1).value = "Project Description";
    SiteName2Row.getCell(1).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteName2Row.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteName2Row.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    SiteName2Row.getCell(1).alignment = {
      horizontal:'center'
    }

    SiteName2Row.getCell(2).value = "Site Name";
    SiteName2Row.getCell(2).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteName2Row.getCell(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteName2Row.getCell(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    SiteName2Row.getCell(2).alignment = {
      horizontal:'center'
    }

    SiteName2Row.getCell(3).value = "Ledger / Sub Ledger";
    SiteName2Row.getCell(3).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteName2Row.getCell(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteName2Row.getCell(3).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    SiteName2Row.getCell(3).alignment = {
      horizontal:'center'
    }
    SiteName2Row.getCell(4).value = "Amount";
    SiteName2Row.getCell(4).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteName2Row.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteName2Row.getCell(4).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'medium' },
    };
    SiteName2Row.getCell(4).alignment = {
      horizontal:'center'
    }
    SiteName2Row.height = 12.75

        const data7:any = [];
        outFlow2.forEach((ele:any) => {
          data7.push(Object.values(ele))
        });
    data7.forEach(l => {
      const row = worksheetInflow.addRow(l);
      for (let i = 0; i < l.length; i++) {
        row.getCell(i + 1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
        row.getCell(4).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'medium' },
        }
        row.getCell(i + 1).alignment = {
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true
        }
        row.getCell(i + 1).font = {
          size: 10
        }
      }
      row.getCell(4).alignment = {
          horizontal: 'right',
          vertical: 'middle',
            wrapText: true
        }
    }
    );
    
    let TotalOutflowAmountBillRow = worksheetInflow.addRow([])
      TotalOutflowAmountBillRow.getCell(3).value = "Total Outflow Amount";
      TotalOutflowAmountBillRow.getCell(1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
      };
    TotalOutflowAmountBillRow.getCell(2).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      TotalOutflowAmountBillRow.getCell(3).alignment = {
        horizontal:'right'
      }
      TotalOutflowAmountBillRow.getCell(3).font={
        size: 10,
        bold: true,
        name :  'Calibri' ,
      }
      TotalOutflowAmountBillRow.getCell(3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'f8cbad' },
        bgColor: { argb: '' },
      }
      TotalOutflowAmountBillRow.getCell(3).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      TotalOutflowAmountBillRow.getCell(4).value = Number(TotaloutFl);
      TotalOutflowAmountBillRow.getCell(4).alignment = {
          horizontal:'right'
        }
      TotalOutflowAmountBillRow.getCell(4).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'medium' },
      };
      TotalOutflowAmountBillRow.getCell(4).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'f8cbad' },
        bgColor: { argb: '' },
      }
      let BlankRow7 = worksheetInflow.addRow([])
          BlankRow7.getCell(4).border = {
          right: { style: 'medium' },
      }
    
    let DifferenceRow = worksheetInflow.addRow([])
    DifferenceRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' },
    };
    DifferenceRow.getCell(3).value = "Difference (Inflow - Outflow)"
    DifferenceRow.getCell(3).font={
       size: 10,
       bold: true,
       color : { argb: 'f6f7f7' },
       name :  'Calibri' ,
    }
    DifferenceRow.getCell(3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2f75b5' },
        bgColor: { argb: '' },
    }
    DifferenceRow.getCell(3).alignment = {
      horizontal:'right'
    }
    DifferenceRow.getCell(3).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
    };
     DifferenceRow.getCell(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
    };
    DifferenceRow.getCell(4).value = Number((Number(totalINf) - Number(TotaloutFl)).toFixed(2))
    DifferenceRow.getCell(4).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };
    DifferenceRow.getCell(4).alignment = {
      horizontal:'right'
    }
    DifferenceRow.height = 13.57


    //Generate & Save Excel File
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'harbauer_Date_Wise_Inflow_outflow'+'.xlsx');
      }) 
  }
  // Third Excel Download
  BrowseExcelFin(valid: any) {
    this.Filterproject = undefined;
    this.FINyear = undefined;
    this.projectFromSubmit = true;
    this.INFoFinanc = [];
    if (valid) {
       let Filterr = this.ProjectList2.filter((el: any) => Number(el.Project_ID) === Number(this.Project_Id2));
      this.Filterproject = Filterr[0].Project_Description;
       let Filterr2 = this.FinyearList.filter((ele: any) => Number(ele.Fin_Year_ID) === Number(this.Fin_Year_ID));
      this.FINyear = Filterr2[0].Fin_Year_Name;
      const File ={
        Fin_Year_ID: this.Fin_Year_ID,
        Project_ID:  this.Project_Id2,
      } 
     const obj = {
      "SP_String": "SP_Project_PL",
       "Report_Name_String": "Get_Inflow_Fin_Year",
      "Json_Param_String": JSON.stringify([File]),
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.INFoFinanc = data;
      this.TotalPRji = this.INFoFinanc.reduce((total, obj) => obj.Projected_Inflow + total, 0)
      this.TotalActi =  this.INFoFinanc.reduce((total, obj) => obj.Act_Inflow + total,0)
      this.GetOutFin(this.Fin_Year_ID ,this.Project_Id2);
    }) 
    }
  }
  GetOutFin(Fin_Year_ID:any ,Project_Id2:any) {
     const File ={
        Fin_Year_ID: Fin_Year_ID,
        Project_ID:  Project_Id2,
      } 
     const obj = {
      "SP_String": "SP_Project_PL",
       "Report_Name_String": "Get_Outflow_Fin_Year",
      "Json_Param_String": JSON.stringify([File]),
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.OutFinanc = data;
      this.TotalOut = this.OutFinanc.reduce((total, obj) => obj.Projected_Outflow + total, 0)
      this.TotalActiOut =  this.OutFinanc.reduce((total, obj) => obj.Act_Outflow + total,0)
      this.getExcelthird(this.INFoFinanc ,this.TotalPRji ,this.TotalActi, this.OutFinanc, this.TotalOut, this.TotalActiOut, this.Filterproject,this.FINyear);
    }) 
  }
  getExcelthird(inflow:any, TotalINPRJ:any ,TotalPRji:any ,outflow:any , Totalout:any , TotalActout:any ,Project:any,Fin:any) {
    let workbook = new Workbook();
    let worksheetInflowThree = workbook.addWorksheet('Projected Vs Actual');
    let Project1STATEMENTRow = worksheetInflowThree.addRow([]);
    Project1STATEMENTRow.getCell(1).value = "Projected Vs Actual";
    Project1STATEMENTRow.getCell(1).font={
      size: 11,
      bold: true,
      color: { argb: '4775d8' },
      name :  'Calibri' ,
    }
    Project1STATEMENTRow.getCell(1).alignment = {
      horizontal:'center'
    }
    worksheetInflowThree.mergeCells('A1', 'C1');

    let Project1PERIODRow = worksheetInflowThree.addRow([]);
     Project1PERIODRow.getCell(1).value = "Project: " + `${Project}`;
     Project1PERIODRow.getCell(1).font={
       size: 11,
        bold: true,
            color: { argb: '4775d8' },
            name :  'Calibri' ,
    }
    Project1PERIODRow.getCell(1).alignment = {
      horizontal:'left'
    }
    worksheetInflowThree.mergeCells('A2', 'C2');

    let Project1NameRow = worksheetInflowThree.addRow([]);
     Project1NameRow.getCell(1).value = "Financial Year :  "+ `${Fin}`;
     Project1NameRow.getCell(1).font={
       size: 11,
       bold: true,
       name :  'Calibri' ,
    }
    Project1NameRow.getCell(1).alignment = {
      horizontal: 'left',
      vertical : "middle"
    }
    worksheetInflowThree.getRow(3).height = 19.50;
    worksheetInflowThree.mergeCells('A3', 'C3'); 

    let InflowRow = worksheetInflowThree.addRow([]);
    InflowRow.getCell(1).value = "Inflow";
    InflowRow.getCell(1).font={
       size: 11,
       bold: true,
       name :  'Calibri' ,
    }
    InflowRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'c6e0b4' },
      bgColor: { argb: '' },
    }
    InflowRow.getCell(1).border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'thin' },
      right: { style: 'medium' },
    };
    InflowRow.getCell(1).alignment = {
      horizontal:'center'
    }
    worksheetInflowThree.mergeCells('A4', 'C4');

    let SiteName1Row = worksheetInflowThree.addRow([]);
    SiteName1Row.getCell(1).value = "Site Name";
    SiteName1Row.getCell(1).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteName1Row.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteName1Row.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    SiteName1Row.getCell(1).alignment = {
      horizontal:'center'
    }

    SiteName1Row.getCell(2).value = "Projected Inflow";
    SiteName1Row.getCell(2).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteName1Row.getCell(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteName1Row.getCell(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    SiteName1Row.getCell(2).alignment = {
      horizontal:'center'
    }

    SiteName1Row.getCell(3).value = "Actual Inflow";
    SiteName1Row.getCell(3).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteName1Row.getCell(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteName1Row.getCell(3).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'medium' },
    };
    SiteName1Row.getCell(3).alignment = {
      horizontal:'center'
    }
    worksheetInflowThree.getColumn(1).width = 45.71;
    worksheetInflowThree.getColumn(2).width = 23.14;
    worksheetInflowThree.getColumn(3).width = 23.14;
    worksheetInflowThree.getRow(5).height = 12.75;

        const data8:any = [];
        inflow.forEach((ele:any) => {
          data8.push(Object.values(ele))
        });
    data8.forEach(d => {
      const row = worksheetInflowThree.addRow(d);
      for (let i = 0; i < d.length; i++) {
        row.getCell(i + 1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
        row.getCell(3).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'medium' },
        }
        row.getCell(i + 1).alignment = {
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true
        }
        row.getCell(i + 1).font = {
          size: 10
        }
      }
      row.getCell(2).alignment = {
        horizontal: 'right',
        vertical: 'middle',
        wrapText: true
      }
      row.getCell(3).alignment = {
        horizontal: 'right',
        vertical: 'middle',
        wrapText: true
      }
    }
        );

     let TotalInflowAmountBillRow = worksheetInflowThree.addRow([])
      TotalInflowAmountBillRow.getCell(1).value = "Total Inflow";
      TotalInflowAmountBillRow.getCell(1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
      };
    TotalInflowAmountBillRow.getCell(1).alignment = {
        horizontal:'right'
    }
    TotalInflowAmountBillRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'c6e0b4' },
        bgColor: { argb: '' },
      }
      TotalInflowAmountBillRow.getCell(2).alignment = {
        horizontal:'right'
      }
      TotalInflowAmountBillRow.getCell(1).font={
        size: 10,
        bold: true,
        name :  'Calibri' ,
      }
     TotalInflowAmountBillRow.getCell(2).value = Number(TotalINPRJ);
      TotalInflowAmountBillRow.getCell(2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'c6e0b4' },
        bgColor: { argb: '' },
      }
      TotalInflowAmountBillRow.getCell(2).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      TotalInflowAmountBillRow.getCell(3).value = Number(TotalPRji);
      TotalInflowAmountBillRow.getCell(3).alignment = {
          horizontal:'right'
        }
      TotalInflowAmountBillRow.getCell(3).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'medium' },
      };
      TotalInflowAmountBillRow.getCell(3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'c6e0b4' },
        bgColor: { argb: '' },
    }
    let BlankRow6 = worksheetInflowThree.addRow([])
        BlankRow6.getCell(3).border = {
         right: { style: 'medium' },
      }
    let OutflowRow = worksheetInflowThree.addRow([])
        OutflowRow.getCell(1).value = "Outflow";
        OutflowRow.getCell(1).font={
          size: 11,
          bold: true,
          name :  'Calibri' ,
        }
        OutflowRow.getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'f8cbad' },
          bgColor: { argb: '' },
        }
        OutflowRow.getCell(1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'medium' },
        };
        OutflowRow.getCell(1).alignment = {
          horizontal:'center'
        }
        const mergeRowValue1 = (v:any) => {
          return  data8.length + v
        }
    worksheetInflowThree.mergeCells('A' + mergeRowValue1(8), 'C' + mergeRowValue1(8));
    
    let SiteName2Row = worksheetInflowThree.addRow([]);
    SiteName2Row.getCell(1).value = "Site Name";
    SiteName2Row.getCell(1).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteName2Row.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteName2Row.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    SiteName2Row.getCell(1).alignment = {
      horizontal:'center'
    }

    SiteName2Row.getCell(2).value = "Projected Outflow";
    SiteName2Row.getCell(2).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteName2Row.getCell(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteName2Row.getCell(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    SiteName2Row.getCell(2).alignment = {
      horizontal:'center'
    }

    SiteName2Row.getCell(3).value = "Actual Outflow";
    SiteName2Row.getCell(3).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteName2Row.getCell(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteName2Row.getCell(3).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'medium' },
    };
    SiteName2Row.getCell(3).alignment = {
      horizontal:'center'
    }
    SiteName2Row.height = 12.75

        const data9:any = [];
        outflow.forEach((ele:any) => {
          data9.push(Object.values(ele))
        });
    data9.forEach(l => {
      const row = worksheetInflowThree.addRow(l);
      for (let i = 0; i < l.length; i++) {
        row.getCell(i + 1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
        row.getCell(3).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'medium' },
        }
        row.getCell(i + 1).alignment = {
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true
        }
        row.getCell(i + 1).font = {
          size: 10
        }       
      }
      row.getCell(2).alignment = {
        horizontal: 'right',
        vertical: 'middle',
        wrapText: true
      }
      row.getCell(3).alignment = {
        horizontal: 'right',
        vertical: 'middle',
        wrapText: true
      }
    }
    );
    
    let TotalOutflowAmountBillRow = worksheetInflowThree.addRow([])
      TotalOutflowAmountBillRow.getCell(1).value = "Total Outflow ";
      TotalOutflowAmountBillRow.getCell(1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
      };
     TotalOutflowAmountBillRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'f8cbad' },
        bgColor: { argb: '' },
      }
    TotalOutflowAmountBillRow.getCell(1).alignment = {
        horizontal:'right'
      }
      TotalOutflowAmountBillRow.getCell(2).alignment = {
        horizontal:'right'
      }
      TotalOutflowAmountBillRow.getCell(2).value = Number(Totalout);
      TotalOutflowAmountBillRow.getCell(1).font={
        size: 10,
        bold: true,
        name :  'Calibri' ,
      }
      TotalOutflowAmountBillRow.getCell(2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'f8cbad' },
        bgColor: { argb: '' },
      }
      TotalOutflowAmountBillRow.getCell(2).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      TotalOutflowAmountBillRow.getCell(3).value = Number(TotalActout);
      TotalOutflowAmountBillRow.getCell(3).alignment = {
          horizontal:'right'
        }
      TotalOutflowAmountBillRow.getCell(3).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'medium' },
      };
      TotalOutflowAmountBillRow.getCell(3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'f8cbad' },
        bgColor: { argb: '' },
      }
      let BlankRow7 = worksheetInflowThree.addRow([])
          BlankRow7.getCell(3).border = {
          right: { style: 'medium' },
      }
    
    let DifferenceRow = worksheetInflowThree.addRow([])
    DifferenceRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' },
    };
    DifferenceRow.getCell(1).value = "Difference (Inflow - Outflow)"
    DifferenceRow.getCell(1).font={
       size: 10,
       bold: true,
       color : { argb: 'f6f7f7' },
       name :  'Calibri' ,
    }
    DifferenceRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2f75b5' },
        bgColor: { argb: '' },
    }
    DifferenceRow.getCell(1).alignment = {
      horizontal:'right'
    }
    DifferenceRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
    };
    DifferenceRow.getCell(2).value = Number(TotalINPRJ) - Number(Totalout);
    DifferenceRow.getCell(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
    };
    DifferenceRow.getCell(2).alignment = {
      horizontal:'right'
    }
    DifferenceRow.getCell(3).value =  Number(Totalout) - Number(TotalActout)
    DifferenceRow.getCell(3).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'medium' },
    };
    DifferenceRow.getCell(3).alignment = {
      horizontal:'right'
    }
    DifferenceRow.height = 13.57


    //Generate & Save Excel File
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'Projected_V_Actual'+'.xlsx');
      })
  }
  }
