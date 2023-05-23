import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {
  constructor() { }
  exportExcel(excelData:any) {
    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Sales Data');

    //Add Row and formatting
    worksheet.mergeCells('C1', 'F4');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }


    // Date
    worksheet.mergeCells('G1:H4');
    let d = new Date();
    let date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('G1');
    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true
    }
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    //Blank Row 
    worksheet.addRow([]);

      //Adding Header Row
      let headerRow = worksheet.addRow(header);
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4167B8' },
          bgColor: { argb: '' }
        }
        cell.font = {
          bold: true,
          color: { argb: 'FFFFFF' },
          size: 12
        }
      })

      // Adding Data with Conditional Formatting
    data.forEach(d => {
       worksheet.addRow(d);

      }
    );

    worksheet.getColumn(3).width = 20;
    worksheet.addRow([]);

     //Generate & Save Excel File
     workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })
  }
  exporttoExcelSalesMIS(excelData:any, daterange:any) {
    //Title, Header & Data
     const header =  Object.keys(excelData[0]) 
    const data:any = [];
    excelData.forEach((ele:any) => {
      data.push(Object.values(ele))
    });
    

    const workbook = new Workbook();
    // workbook.calcProperties.fullCalcOnLoad = true;
    const worksheet = workbook.addWorksheet('Sales MIS');
     let CompanyNameRow = worksheet.addRow([]);
     CompanyNameRow.getCell(1).value = "MODERN CONCAST INDIA LIMITED";
     CompanyNameRow.getCell(1).font={
      size: 15,
      bold:true
     }
     let ReportNameRow = worksheet.addRow([]);
     ReportNameRow.getCell(1).value = "SALES MIS REPORT";
     ReportNameRow.getCell(1).font={
      bold:true
     }
     let DateRangeRow = worksheet.addRow([]);
     DateRangeRow.getCell(1).value = "For the Period "+"( " + `${daterange.From_Date} - ${daterange.To_Date}` + " )";
     DateRangeRow.getCell(1).font={
      bold:true
     }
      worksheet.addRow([]);
    // Blank Row
    const headerTitle = worksheet.addRow([]);

    // Add MERGE Header Row
    // AS PER LETTER OF INTENT
    const headerTitleCell1 = headerTitle.getCell(1);
    headerTitle.getCell(1).alignment = { vertical: 'middle' , horizontal: 'center' };
    headerTitleCell1.value = 'AS PER LETTER OF INTENT';
    headerTitleCell1.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '9ab8cb' },
      bgColor: { argb: 'FF0000FF' },
    };
    headerTitleCell1.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    // // AS PER PROFORMA INVOICE
    // const headerTitleCell2 = headerTitle.getCell(8);
    // headerTitle.getCell(8).alignment = { vertical: 'middle' , horizontal: 'center' , wrapText: true};
    // headerTitleCell2.value = 'AS PER PROFORMA INVOICE';
    // headerTitleCell2.fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'e5b694' },
    //   bgColor: { argb: 'FF99FF99' },
    // };
    // headerTitleCell2.border = {
    //   top: { style: 'thin' },
    //   left: { style: 'thin' },
    //   bottom: { style: 'thin' },
    //   right: { style: 'thin' },
    // };
    // AS PER SALES ORDER
    const headerTitleCell3 = headerTitle.getCell(8);
    headerTitle.getCell(8).alignment = { vertical: 'middle' , horizontal: 'center'};
    headerTitleCell3.value = 'AS PER SALES ORDER';
    headerTitleCell3.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f6d889' },
      bgColor: { argb: 'FF99FF99' },
    };
    headerTitleCell3.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    // AS PER DELIVERY CHALLAN
    const headerTitleCell4 = headerTitle.getCell(11);
    headerTitle.getCell(11).alignment = { vertical: 'middle' , horizontal: 'center', wrapText: true };
    headerTitleCell4.value = 'AS PER DELIVERY CHALLAN';
    headerTitleCell4.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '9ec990' },
      bgColor: { argb: 'FF99FF99' },
    };
    headerTitleCell4.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    // AS PER INVOICE
    const headerTitleCell5 = headerTitle.getCell(13);
    headerTitle.getCell(13).alignment = { vertical: 'middle' , horizontal: 'center' , wrapText: true};
    headerTitleCell5.value = 'AS PER INVOICE';
    headerTitleCell5.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd9d8db' },
      bgColor: { argb: 'FF99FF99' },
    };
    headerTitleCell5.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    // RECEIPT / ADJUSTMENT
    const headerTitleCell6 = headerTitle.getCell(15);
    headerTitle.getCell(15).alignment = { vertical: 'middle' , horizontal: 'center',wrapText: true };
    headerTitleCell6.value = 'RECEIPT / ADJUSTMENT';
    headerTitleCell6.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '8691ce' },
      bgColor: { argb: 'FF99FF99' },
    };
    headerTitleCell6.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    
    
    worksheet.addRow([]);
    // Add Header Row
    let gg= ["Doc No","Date","Customer","Product Name","Qty","Amount","Pending Qty",
             "Qty","Amount","Pending Qty",
             "Qty","Amount","Pending Qty",
             "Qty","Amount",
             "Qty","Amount",
             "Amount"]
    const headerRow = worksheet.addRow([]);
    for (let i = 0; i < header.length; i++) {
      const headerCell = headerRow.getCell(i + 1);
      headerRow.getCell(i + 1).alignment = { horizontal: 'center' };
      if (header[i] == 'LI_Doc_No' || header[i] == 'LI_Doc_Date' || header[i] == 'LI_Customer' || header[i] == 'Product_Name' ||
          header[i] == 'LI_Qty' || header[i] == 'LI_Amount' || header[i] == 'Pending_LI_Qty') {
            if(header[i] == 'LI_Doc_No'){
              headerCell.value = "Doc No";
            }
            if(header[i] == 'LI_Doc_Date'){
              headerCell.value = "Doc Date";
            }
            if(header[i] == 'LI_Customer'){
              headerCell.value = "Customer";
            }
            if(header[i] == 'Product_Name'){
              headerCell.value = "Product Name";
            }
            if(header[i] == 'LI_Qty'){
              headerCell.value = "Qty";
            }
            if(header[i] == 'LI_Amount'){
              headerCell.value = "Amount";
            }
            if(header[i] == 'Pending_LI_Qty'){
              headerCell.value = "Pending Qty";
            }
        headerCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '9ab8cb' },
          bgColor: { argb: 'FF0000FF' },
        };
        headerCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
      //  else if (header[i] == 'PI_Qty' || header[i] == 'PI_Total_Amount' || header[i] == 'Pending_PI_Qty') {
      //   if(header[i] == 'PI_Qty'){
      //     headerCell.value = "Qty";
      //   }
      //   if(header[i] == 'PI_Total_Amount'){
      //     headerCell.value = "Amount";
      //   }
      //   if(header[i] == 'Pending_PI_Qty'){
      //     headerCell.value = "Pending Qty";
      //   }
      //   headerCell.fill = {
      //     type: 'pattern',
      //     pattern: 'solid',
      //     fgColor: { argb: 'e5b694' },
      //     bgColor: { argb: 'E1E2EE' },
      //   };
      //   headerCell.border = {
      //     top: { style: 'thin' },
      //     left: { style: 'thin' },
      //     bottom: { style: 'thin' },
      //     right: { style: 'thin' },
      //   };
      // } 
      else if (header[i] == 'SO_Qty' || header[i] == 'SO_Total_Amount' || header[i] == 'Pending_SO_Qty') {
        if(header[i] == 'SO_Qty'){
          headerCell.value = "Qty";
        }
        if(header[i] == 'SO_Total_Amount'){
          headerCell.value = "Amount";
        }
        if(header[i] == 'Pending_SO_Qty'){
          headerCell.value = "Pending Qty";
        }
        headerCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'f6d889' },
          bgColor: { argb: 'E1E2EE' },
        };
        headerCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      } else if (header[i] == 'SC_Qty' || header[i] == 'SC_Total_Amount') {
        if(header[i] == 'SC_Qty'){
          headerCell.value = "Qty";
        }
        if(header[i] == 'SC_Total_Amount'){
          headerCell.value = "Amount";
        }
        headerCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '9ec990' },
          bgColor: { argb: 'E1E2EE' },
        };
        headerCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
      else if (header[i] == 'SB_Qty' || header[i] == 'SB_Total_Amount') {
        if(header[i] == 'SB_Qty'){
          headerCell.value = "Qty";
        }
        if(header[i] == 'SB_Total_Amount'){
          headerCell.value = "Amount";
        }
        headerCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'd9d8db' },
          bgColor: { argb: 'E1E2EE' },
        };
        headerCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      } else if (header[i] == 'RA_Total_Amount') {
        if(header[i] == 'RA_Total_Amount'){
          headerCell.value = "Amount";
        }
        headerCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '8691ce' },
          bgColor: { argb: 'E1E2EE' },
        };
        headerCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }

    worksheet.mergeCells('A1:D1');
    worksheet.mergeCells('A2:D2');
    worksheet.mergeCells('A3:D3');

    worksheet.mergeCells('A5:G6');
    worksheet.mergeCells('H5:J6');
    worksheet.mergeCells('K5:L6');
    worksheet.mergeCells('M5:N6');
    worksheet.mergeCells('O5:O6');

    // Add Data and Conditional Formatting
    data.forEach((d,i) => {
      const row = worksheet.addRow(d);
    for( let i= 0; i< d.length;i++ ){
      row.getCell(i + 1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
      }
      row.getCell(i + 1).alignment = {
        horizontal:'center'
      }
    }
    });
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(10).width = 15;
    worksheet.getColumn(13).width = 15;
    worksheet.getColumn(11).width = 15;
    worksheet.getColumn(12).width = 15;

    worksheet.getColumn(15).width = 30;
    // worksheet.getColumn(18).width = 30;
    // worksheet.getColumn(14).width = 15;
    // worksheet.getColumn(15).width = 15;
    // worksheet.getColumn(8).width = 30;
    let sumCol = worksheet.addRow([]);
    sumCol.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    const result = (rinx) => {
      let sum: any = 0;
      data.forEach((arr: any) => {
        arr.forEach((arr1: any, inx: any) => {
          if (inx == rinx) {
            sum += arr1;
          }
        });
      });
      return sum;
    };

    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'Sales_MIS.xlsx');
    });
  }
  exporttoExcelSales(excelData:any, daterange:any){
    const header = Object.keys(excelData[0])
    const data:any = [];
    excelData.forEach((ele:any) => {
      data.push(Object.values(ele))
    });
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('DISPATCH_MIS');
    let CompanyNameRow = worksheet.addRow([]);
    CompanyNameRow.getCell(1).value = "MODERN CONCAST INDIA LIMITED";
    CompanyNameRow.getCell(1).font={
     size: 15,
     bold:true
    }
    let ReportNameRow = worksheet.addRow([]);
    ReportNameRow.getCell(1).value = "SALES DISPATCH MIS";
    ReportNameRow.getCell(1).font={
     bold:true
    }
    let DateRangeRow = worksheet.addRow([]);
    DateRangeRow.getCell(1).value = "For the Period "+"( " + `${daterange.From_Date} - ${daterange.To_Date}` + " )";
    DateRangeRow.getCell(1).font={
     bold:true
    }
     worksheet.addRow([]);
   let topHeader= worksheet.addRow([]);
   topHeader.getCell(1).value = "SL NO"
 
  
   topHeader.getCell(2).value = "NAME OF THE CUSTOMER"
   topHeader.getCell(3).value = "Grade"
   topHeader.getCell(header.length).value = "Total"
    topHeader.eachCell((cell, number) => {
  
    cell.alignment = { vertical: 'middle' , horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '3c8dbc' },
      bgColor: { argb: '' }
    }
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFF' },
      size: 12
    }
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  })
     let headerRow = worksheet.addRow(header);
     headerRow.eachCell((cell, number) => {
      worksheet.getColumn(number).width = 20;
      cell.alignment = { vertical: 'middle' , horizontal: 'center' };
       cell.fill = {
         type: 'pattern',
         pattern: 'solid',
         fgColor: { argb: '3c8dbc' },
         bgColor: { argb: '' }
       }
       cell.font = {
         bold: true,
         color: { argb: 'FFFFFF' },
         size: 12
       }
       cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
     })
         // Adding Data with Conditional Formatting
    data.forEach(d => {
    const row= worksheet.addRow(d);
    for( let i= 0; i< d.length;i++ ){
      row.getCell(i + 1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
      }
      row.getCell(i + 1).alignment = {
        horizontal:'center'
      }
    }
     }
   );
   let headerMar = [...header]
   const headerMarHeader = headerMar.slice(2)
   let totalRow = worksheet.addRow([]);
   totalRow.getCell(1).value = "Total"
   totalRow.getCell(1).alignment = {
    horizontal:'right'
   }
   console.log(header)
   const result = (rinx) => {
    let sum: any = 0;
    data.forEach((arr: any) => {
      arr.forEach((arr1: any, inx: any) => {
        if (inx == rinx) {
          sum += arr1;
        }
      });
    });
    return sum;
  };
   headerMarHeader.forEach((el) => {
    console.log(header.indexOf(el));
    totalRow.getCell(header.indexOf(el) + 1).value = result(
      header.indexOf(el)
    );

  });
  totalRow.eachCell((cell, number) => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    cell.font = {
      bold: true,
      size: 12
    }
    cell.alignment = {
      horizontal:'center'
    }
  })
  worksheet.getColumn(2).width = 40;
  worksheet.mergeCells('A1:D1');
  worksheet.mergeCells('A2:D2');
  worksheet.mergeCells('A3:D3');
  worksheet.mergeCells('A5', 'A6');
   worksheet.mergeCells('B5', 'B6');
   worksheet.mergeCells('C5', this.colName(headerMarHeader.length )+'5');
   worksheet.mergeCells(this.colName(header.length - 1)+'5' , this.colName(header.length-1)+'6')
   worksheet.mergeCells(`A${totalRow.number}:B${totalRow.number}`);
     //Generate & Save Excel File
     workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'DISPATCH_MIS.xlsx');
    })
  }
  exporttoExcelCouponReport(exceldata:any,exceldata1:any,daterange:any){
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    let CompanyNameRow = worksheet.addRow([]);
    CompanyNameRow.getCell(1).value = "MODERN INDIA CON-CAST LIMITED(HALDIA WORKS)";
    CompanyNameRow.getCell(1).font={
      size: 15,
      bold:true
     }
     CompanyNameRow.getCell(1).alignment = {
      horizontal:'center'
     }
    let ReportNameRow = worksheet.addRow([]);
     ReportNameRow.getCell(1).value = "FACTORY CANTEEN DETAILS";
     ReportNameRow.getCell(1).font={
      bold:true,
      size:11
     }
     ReportNameRow.getCell(1).alignment = {
      horizontal:'center'
     }
     ReportNameRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
     ReportNameRow.getCell(this.foo('Y')).value = "STATEMENT OF DAILY MEALS";
     ReportNameRow.getCell(this.foo('Y')).font={
       size: 15,
       bold:true
      }
      ReportNameRow.getCell(this.foo('Y')).alignment = {
       horizontal:'center'
      }
      ReportNameRow.getCell(this.foo('Y')).border = {
       top: { style: 'thin' },
       left: { style: 'thin' },
       bottom: { style: 'thin' },
       right: { style: 'thin' },
     };


     let TopHeaderRow = worksheet.addRow([]);
     TopHeaderRow.getCell(1).value = ""
     TopHeaderRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
     TopHeaderRow.getCell(2).value = "COUPON SUMMARY"
     TopHeaderRow.getCell(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EBF110' },
      bgColor: { argb: '' }
    }
    TopHeaderRow.getCell(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    TopHeaderRow.getCell(2).alignment = {
      horizontal:'center'
     }
     TopHeaderRow.getCell(2).font={
      bold:true,
      size:11
     }
     TopHeaderRow.getCell(10).value = "COUPON SALE"
     TopHeaderRow.getCell(10).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EBF110' },
      bgColor: { argb: '' }
    }
    TopHeaderRow.getCell(10).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    TopHeaderRow.getCell(10).alignment = {
      horizontal:'center'
     }
     TopHeaderRow.getCell(10).font={
      bold:true,
      size:11
     }
     TopHeaderRow.getCell(19).value = "EXPENSES"
     TopHeaderRow.getCell(19).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'EBF110' },
      bgColor: { argb: '' }
    }
    TopHeaderRow.getCell(19).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    TopHeaderRow.getCell(19).alignment = {
      horizontal:'center'
    }
    TopHeaderRow.getCell(19).font={
      bold:true,
      size:11
    }

    TopHeaderRow.getCell(this.foo('Y')).value = "PARTIALLY SUBSIDISED AGAINST COUPON"
    TopHeaderRow.getCell(this.foo('Y')).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    TopHeaderRow.getCell(this.foo('Y')).alignment = {
      horizontal:'center'
    }
    TopHeaderRow.getCell(this.foo('Y')).font={
      bold:true,
      size:10
    }



    TopHeaderRow.getCell(this.foo('AD')).value = "100% SUBSIDISED"
    TopHeaderRow.getCell(this.foo('AD')).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    TopHeaderRow.getCell(this.foo('AD')).alignment = {
      horizontal:'center'
    }
    TopHeaderRow.getCell(this.foo('AD')).font={
      bold:true,
      size:10
    }


    TopHeaderRow.getCell(this.foo('AI')).value = ""
    TopHeaderRow.getCell(this.foo('AI')).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    TopHeaderRow.getCell(this.foo('AJ')).value = ""
    TopHeaderRow.getCell(this.foo('AJ')).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    TopHeaderRow.getCell(this.foo('AK')).value = ""
    TopHeaderRow.getCell(this.foo('AK')).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    TopHeaderRow.getCell(this.foo('AL')).value = ""
    TopHeaderRow.getCell(this.foo('AL')).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
   const midheaderRow = worksheet.addRow([])
    const midheaderRowdata:any = [ 
      {pos:1,dces:'01-04-2023'},
      {pos:2,dces:'BREAKFAST'},
      {pos:6,dces:'MEAL'},
      {pos:10,dces:'BREAKFAST'},
      {pos:14,dces:'MEAL'},
      {pos:18,dces:'GRAND TOTAL'},
      {pos:19,dces:'PAYMENT'}]
      const midheaderRowdataTb2:any = [
        {
          pos:'Y',value:'Date'
        },
        {
          pos:'Z',value:'STAFF'
        },
        {
          pos:'AD',value:'GUEST'
        },
        {
          pos:'AE',value:'MEAL(COOK &HELPER)'
        },
        {
          pos:'AF',value:'B/F(COOK &HELPER)'
        },
        {
          pos:'AG',value:'WASTAGE'
        },
        {
          pos:'AH',value:'TOTAL'
        },
        {
          pos:'AI',value:'TOTAL (B/F)'
         
        },
        {
          pos:'AJ',value:'TOTAL (MEAL)'
        },
        {
          pos:'AK',value:'GRAND TOTAL'
        },
        {
          pos:'AL',value:'REMARKS'
        }
      ]
      midheaderRowdata.forEach((ele:any) => {
      midheaderRow.getCell(ele.pos).value = ele.dces
      midheaderRow.getCell(ele.pos).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      if( ele.pos == 18){
       midheaderRow.getCell(ele.pos).alignment = {
          horizontal:'center',
          wrapText: true
         }
         midheaderRow.getCell(ele.pos).font={
          bold:true,
          size:8
         }
      }
      else{
        midheaderRow.getCell(ele.pos).alignment = {
          horizontal:'center'
         }
         midheaderRow.getCell(ele.pos).font={
          bold:true,
          size:11
         }
      }
     
       
    });
    midheaderRowdataTb2.forEach((ele:any) => {
      midheaderRow.getCell(this.foo(ele.pos)).value = ele.value
      midheaderRow.getCell(this.foo(ele.pos)).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      midheaderRow.getCell(this.foo(ele.pos)).alignment = {
        horizontal:'center',
        vertical:"middle",
        wrapText:true
       }
       if( ele.pos == 'Z'){
        midheaderRow.getCell(this.foo(ele.pos)).font={
          bold:true,
          size:12
         }
       }
       else if(ele.pos == 'AG'){
        midheaderRow.getCell(this.foo(ele.pos)).font={
          bold:true,
          size:6
         }
       }
       else if(ele.pos == 'Y' || ele.pos == 'AK' || ele.pos == 'AL'){
        midheaderRow.getCell(this.foo(ele.pos)).font={
          bold:true,
          size:11
         }
       }
       else {
        midheaderRow.getCell(this.foo(ele.pos)).font={
          bold:true,
          size:9
         }
       }
      
     
       
    });
    const DataHeaderRowList:any = ['DATE','OP.BAL','RECEIVED','SALE','CL.BAL.','OP.BAL','RECEIVED','SALE','CL.BAL.','STAFF','WORKERS','TOTAL','AMOUNT','STAFF','WORKERS','TOTAL','AMOUNT','AMOUNT','VEGETABLE','GROCERY','MISC/OTHERS(NON VEG ITEMS)','FUEL','TOTAL']
    
    const DataHeaderRow = worksheet.addRow(DataHeaderRowList)
    DataHeaderRow.eachCell((cell,Number)=>{
        cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = {
        bold: true,
        size: 8
      }
      cell.alignment = {
        horizontal:'center',
        vertical:'middle',
       }
    })
    DataHeaderRow.getCell(1).font = {
      bold: true,
      size: 11
    }
   
    DataHeaderRow.getCell(11).font = {
      bold: true,
      size: 6
    }
    DataHeaderRow.getCell(11).alignment = {
      horizontal:'right',
      wrapText:true
     }
     DataHeaderRow.getCell(15).font = {
      bold: true,
      size: 6
    }
    DataHeaderRow.getCell(15).alignment = {
      horizontal:'right',
      wrapText:true
     }
     DataHeaderRow.getCell(21).font = {
      bold: true,
      size: 6
    }
    DataHeaderRow.getCell(21).alignment = {
      horizontal:'right',
      wrapText:true
     }
    DataHeaderRow.getCell(5).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    DataHeaderRow.getCell(9).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd6dce4' },
      bgColor: { argb: '' }
    }
    DataHeaderRow.getCell(13).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '99ff99' },
      bgColor: { argb: '' }
    }
    DataHeaderRow.getCell(17).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '9ef4f8' },
      bgColor: { argb: '' }
    }
    DataHeaderRow.getCell(18).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '99ff99' },
      bgColor: { argb: '' }
    }
    DataHeaderRow.getCell(23).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffff00' },
      bgColor: { argb: '' }
    }
    const DataHeaderRow2:any = [
      {
        pos:'Z',value:'BREAKFAST'
      },
      {
        pos:'AA',value:'LUNCH'
      },
      {
        pos:'AB',value:'DINNER'
      },
      {
        pos:'AC',value:'TOTAL'
      },
    ]

    DataHeaderRow2.forEach(ele => {
      DataHeaderRow.getCell(this.foo(ele.pos)).value = ele.value
      DataHeaderRow.getCell(this.foo(ele.pos)).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      DataHeaderRow.getCell(this.foo(ele.pos)).alignment = {
        horizontal:'center',
        vertical:"middle",
        wrapText:true
       }
       DataHeaderRow.getCell(this.foo(ele.pos)).font={
        bold:true,
        size:10
       }
    });
    const lastHeaderRowList = ['','PCS','PCS','PCS','PCS','PCS','PCS','PCS','PCS','PCS','PCS','PCS','RS','PCS','PCS','PCS','RS','RS','RS','RS','RS','RS','RS']

    const lastHeaderRow = worksheet.addRow(lastHeaderRowList)

   const lastHeaderRowListTb2 = [
    {
      pos:'Y',value:''
    },
    {
      pos:'Z',value:'PCS'
    },
    {
      pos:'AA',value:'PCS'
    },
    {
      pos:'AB',value:'PCS'
    },
    {
      pos:'AC',value:'PCS'
    },
    {
      pos:'AD',value:'PCS'
    },
    {
      pos:'AE',value:'PCS'
    },
    {
      pos:'AF',value:'PCS'
     
    },
    {
      pos:'AG',value:'PCS'
    },
    {
      pos:'AH',value:'PCS'
    },
    {
      pos:'AI',value:'PCS'
    },
    {
      pos:'AJ',value:'PCS'
    },
    {
      pos:'AK',value:'PCS'
    },
    {
      pos:'AL',value:''
    }
   ]

   lastHeaderRowListTb2.forEach(el=>{
    lastHeaderRow.getCell(this.foo(el.pos)).value = el.value
    lastHeaderRow.getCell(this.foo(el.pos)).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    lastHeaderRow.getCell(this.foo(el.pos)).alignment = {
      horizontal:'center',
      vertical:"middle",
      wrapText:true
     }
     lastHeaderRow.getCell(this.foo(el.pos)).font={
      bold:true,
      size:8
     }
   })
    lastHeaderRow.eachCell((cell,Number)=>{
      cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    cell.font = {
      bold: true,
      size: 8
    }
    cell.alignment = {
      horizontal:'center',
      vertical:'middle',
     }
  })
  lastHeaderRow.getCell(5).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'bdd7ee' },
    bgColor: { argb: '' }
  }
  lastHeaderRow.getCell(9).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'd6dce4' },
    bgColor: { argb: '' }
  }
  lastHeaderRow.getCell(13).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '99ff99' },
    bgColor: { argb: '' }
  }
  lastHeaderRow.getCell(17).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '9ef4f8' },
    bgColor: { argb: '' }
  }
  lastHeaderRow.getCell(18).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '99ff99' },
    bgColor: { argb: '' }
  }
  lastHeaderRow.getCell(23).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'ffff00' },
    bgColor: { argb: '' }
  }

  const data:any = [];
  exceldata.forEach((ele:any) => {
    data.push(Object.values(ele))
  });
  const data1:any = [];
  exceldata1.forEach((ele:any) => {
    data1.push(Object.values(ele))
  });
  console.log("data1",data1)
  // Adding Data with Conditional Formatting
  const dataposTb2:any = [
    {
      pos:'Y'
    },
    {
      pos:'Z'
    },
    {
      pos:'AA'
    },
    {
      pos:'AB'
    },
    {
      pos:'AC'
    },
    {
      pos:'AD'
    },
    {
      pos:'AE'
    },
    {
      pos:'AF'
     
    },
    {
      pos:'AG'
    },
    {
      pos:'AH'
    },
    {
      pos:'AI'
    },
    {
      pos:'AJ'
    },
    {
      pos:'AK'
    },
    {
      pos:'AL'
    }
   ]
  data.forEach(d => {
  const row= worksheet.addRow(d);
  for( let i= 0; i< d.length;i++ ){
    row.getCell(i + 1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
    }
    row.getCell(i + 1).alignment = {
      horizontal:'center'
    }
    row.getCell(i+1).font = {
      size:11
    }
    row.getCell(5).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    row.getCell(9).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd6dce4' },
      bgColor: { argb: '' }
    }
    row.getCell(13).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '99ff99' },
      bgColor: { argb: '' }
    }
    row.getCell(17).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '9ef4f8' },
      bgColor: { argb: '' }
    }
    row.getCell(18).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '99ff99' },
      bgColor: { argb: '' }
    }
    row.getCell(23).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffff00' },
      bgColor: { argb: '' }
    }
  }
    }
  );
  data1.forEach((ele,i) => {
   dataposTb2.forEach((e,inx) => {

      let row:any =  worksheet.getCell(`${e.pos}${i+7}`) 
      row.value = ele[inx]
        worksheet.getCell(`${e.pos}${i+7}`).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
    }

    if(e.pos == 'AC'){
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'b4c6e7' },
        bgColor: { argb: '' }
      }
    }
    if(e.pos == 'AG'){
      row.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffff00' },
      bgColor: { argb: '' }
      }
    }
    if(e.pos == 'AH'){
      row.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'b4c6e7' },
      bgColor: { argb: '' }
      }
    }
    if(e.pos == 'AI'){
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'b4c6e7' },
        bgColor: { argb: '' }
      }
    }
    if(e.pos == 'AJ'){
      row.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '99ff99' },
      bgColor: { argb: '' }
      }
    }
    if(e.pos == 'AK'){
      row.fill = {
       type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'c6e0b4' },
      bgColor: { argb: '' }
      }
    }
    if(e.pos == 'AE'){
    row.font = {color: {argb: "F11310"}};
    }
    if(e.pos == 'AF'){
      row.font = {color: {argb: "F11310"}};
    }
     });
     
  
  });
    // Merge Cell 
    worksheet.mergeCells('A1', 'W1');

    worksheet.mergeCells('A2', 'W2');

    worksheet.mergeCells('B3', 'I3');
    worksheet.mergeCells('J3', 'R3');
    worksheet.mergeCells('S3', 'W3');

    worksheet.mergeCells('B4', 'E4');
    worksheet.mergeCells('F4', 'I4');
    worksheet.mergeCells('J4', 'M4');
    worksheet.mergeCells('N4', 'Q4');
    worksheet.mergeCells('S4', 'W4');

    worksheet.mergeCells('A5', 'A6');



    worksheet.mergeCells('Y2', 'AL2');

    worksheet.mergeCells('Y3', 'AC3');
    worksheet.mergeCells('AD3', 'AH3');


    worksheet.mergeCells('Z4', 'AC4');
    worksheet.mergeCells('Y4', 'Y5');

    worksheet.mergeCells('AD4', 'AD5');
    worksheet.mergeCells('AE4', 'AE5');
    worksheet.mergeCells('AF4', 'AF5');
    worksheet.mergeCells('AG4', 'AG5');
    worksheet.mergeCells('AH4', 'AH5');
    worksheet.mergeCells('AI4', 'AI5');
    worksheet.mergeCells('AJ4', 'AJ5');
    worksheet.mergeCells('AK4', 'AK5');
    worksheet.mergeCells('AL4', 'AL5');

    // cell width
    worksheet.getColumn(1).width = 11;
    worksheet.getColumn(11).width = 6;
    worksheet.getColumn(15).width = 6;
    worksheet.getColumn(21).width = 9;
    worksheet.getColumn(this.foo('AE')).width = 12;
    worksheet.getColumn(this.foo('AL')).width = 20;
    worksheet.getColumn(this.foo('Z')).width = 11;
    worksheet.getColumn(this.foo('Y')).width = 11;
      //Generate & Save Excel File
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, daterange.StartDate+'_To_'+daterange.EndDate+'_Coupon_Report'+'.xlsx');
      })
  } 
  colName(n:any) {
    var ordA = 'A'.charCodeAt(0);
    var ordZ = 'Z'.charCodeAt(0);
    var len = ordZ - ordA + 1;
  
    var s = "";
    while(n >= 0) {
        s = String.fromCharCode(n % len + ordA) + s;
        n = Math.floor(n / len) - 1;
    }
    return s;
}
foo (val) {
  var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', i, j, result = 0;

  for (i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
    result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
  }

  return result;
}
}
