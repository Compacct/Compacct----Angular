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
    headerTitle.getCell(13).alignment = { vertical: 'middle' , horizontal: 'center' };
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
  exporttoExcelCouponReport(exceldata:any,exceldata1:any,daterange:any,OtherDetailsFactory:any,OtherDetailsFactory2ndPart:any,OtherDetails:any){
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
   let CompanyNameRow = worksheet.addRow([]);
    CompanyNameRow.getCell(1).value = "MODERN INDIA CON-CAST LIMITED(HALDIA WORKS)";
    CompanyNameRow.getCell(1).font={
      size: 14,
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
      // {pos:1,dces:`${daterange.StartDate.split('/')[1]}-${daterange.StartDate.split('/')[2].substr(daterange.StartDate.split('/')[2].length - 2)}`},
      {pos:1,dces: new Date(new Date(daterange.StartDate).setHours(new Date(daterange.StartDate).getHours() + 6))},
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
      if(ele.pos == 1){
       midheaderRow.getCell(ele.pos).numFmt = 'MMM-YY'
      }
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
    const DataHeaderRowList:any = ['DATE','OP.BAL','RECEIVED','SALE','CL.BAL.','OP.BAL','RECEIVED','SALE','CL.BAL.','STAFF','CONTRACTOR','TOTAL','AMOUNT','STAFF','CONTRACTOR','TOTAL','AMOUNT','AMOUNT','VEGETABLE','GROCERY','MISC/OTHERS(NON VEG ITEMS)','FUEL','TOTAL']
    
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
        worksheet.getCell(`${e.pos}${i+7}`).alignment = {
          horizontal : "center",
          vertical:"middle"
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
 // Blank Row
   worksheet.addRow([])
  // Add Other Detalis
    const otherDetalisRow = worksheet.addRow([])

    const rowDataList = [ 
      {
        pos:"E",
        value:"MEAL COST"
     },
      {
      pos:"K",
      value:"COMPANY SUBSIDY(IN RS)"
     },
     {
    pos:"N",
    value:" AMOUNT  (in unit)"
      },
      {
      pos:"O",
      value:"(%)"
      },
      {
      pos:"P",
      value:"AMOUNT (Expenses)"
      },
     {
      pos:"Q",
      value:"(%)"
     },
      {
      pos:"AG",
      value:"CONVERSION(IN UNIT)"
     },
     {
      pos:"AI",
      value:"RATE OF RELIASATION"
     },
     {
      pos:"AJ",
      value:"UNIT"
     }
     ]

    otherDetalisRow.height = 25.50
    rowDataList.forEach(el=>{
      otherDetalisRow.getCell(this.foo(el.pos)).value = el.value
      otherDetalisRow.getCell(this.foo(el.pos)).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      otherDetalisRow.getCell(this.foo(el.pos)).alignment = {
        horizontal: "center",
        vertical : "middle",
      }

      if(el.pos == "AG"){
        otherDetalisRow.getCell(this.foo(el.pos)).alignment = {
          horizontal: "center",
          vertical : "middle",
          wrapText:true
        }
        otherDetalisRow.getCell(this.foo(el.pos)).font = {
          bold: true,
          size: 7
        }
      }
      if(el.pos == "AI" || el.pos == "AJ"){
        otherDetalisRow.getCell(this.foo(el.pos)).alignment = {
          horizontal: "center",
          vertical : "middle",
          wrapText:true
        }
        otherDetalisRow.getCell(this.foo(el.pos)).font = {
          bold: true,
          size: 6
        }
      }
    })
    otherDetalisRow.getCell(this.foo('E')).font = {
      size:11
    }
    otherDetalisRow.getCell(this.foo('K')).font = {
      size:8,
      bold:true
    }
    otherDetalisRow.getCell(this.foo('N')).font = {
      size:8,
      bold:true
    }
    otherDetalisRow.getCell(this.foo('N')).alignment = {
      horizontal:"center",
      vertical:"middle",
      wrapText:true
    }
    otherDetalisRow.getCell(this.foo('O')).font = {
      size:11,
      bold:true
    }
    otherDetalisRow.getCell(this.foo('P')).font = {
      size:8,
      bold:true
    }
    otherDetalisRow.getCell(this.foo('P')).alignment = {
      horizontal:"center",
      vertical:"middle",
      wrapText:true
    }
    otherDetalisRow.getCell(this.foo('Q')).font = {
      size:11,
      bold:true
    }
    

    const otherDetalisRow2List = [
      [
        {
          pos:"E",
          value:"TOTAL EXPENDITURE"
        },
        {
          pos:"I",
          value: OtherDetailsFactory[0].Total_Expenditure
        },
        {
          pos:"K",
          value: 'MEAL'
        },
        {
          pos:"L",
          value: ''
        },
        {
          pos:"M",
          value: OtherDetailsFactory2ndPart[0].Company_Subsidy_Meal
        },
        {
          pos:"N",
          value: OtherDetailsFactory2ndPart[0].Company_Subsidy_Meal_Amount
        },
        {
          pos:"O",
          value: OtherDetailsFactory2ndPart[0].Company_Subsidy_Meal_Percentage
        },
        {
          pos:"P",
          value: OtherDetailsFactory2ndPart[0].Company_Subsidy_Meal_Amount_Expenses
        },
        {
          pos:"Q",
          value: OtherDetailsFactory2ndPart[0].Meal_Percentage
        },
        {
          pos:"AG",
          value: "B/F"
        },
        {
          pos:"AI",
          value: OtherDetails[0].Breakfast_Rate_Of_Reliasation
        },
        {
          pos:"AJ",
          value: OtherDetails[0].Total_Breakfast
        }
      ],
      [
        {
          pos:"E",
          value:"TOTAL MEAL"
        },
        {
          pos:"I",
          value: OtherDetailsFactory[0].Total_Meal
        },
        {
          pos:"K",
          value: 'B/F'
        },
        {
          pos:"L",
          value: ''
        },
        {
          pos:"M",
          value: OtherDetailsFactory2ndPart[0].Company_Subsidy_Breakfast
        },
        {
          pos:"N",
          value: OtherDetailsFactory2ndPart[0].Company_Subsidy_Breakfast_Amount
        },
        {
          pos:"O",
          value: OtherDetailsFactory2ndPart[0].Company_Subsidy_BF_Percentage
        },
        {
          pos:"P",
          value: OtherDetailsFactory2ndPart[0].Company_Subsidy_Breakfast_Amount_Expenses
        },
        {
          pos:"Q",
          value: OtherDetailsFactory2ndPart[0].BF_Percentage
        } ,
        {
          pos:"AG",
          value: "MEAL"
        },
        {
          pos:"AI",
          value: OtherDetails[0].Meal_Rate_Of_Reliasation
        },
        {
          pos:"AJ",
          value: OtherDetails[0].Total_Meal
        }
      ],
      [
        {
          pos:"E",
          value:"COST/MEAL"
        },
        {
          pos:"I",
          value: OtherDetailsFactory[0].Cost_Meal
        },
        {
          pos:"K",
          value: ''
        },
        {
          pos:"L",
          value: ''
        },
        {
          pos:"M",
          value: ""
        },
        {
          pos:"N",
          value: OtherDetailsFactory2ndPart[0].Company_Subsidy_Total_Amount
        },
        {
          pos:"O",
          value: ""
        },
        {
          pos:"P",
          value: OtherDetailsFactory2ndPart[0].Company_Subsidy_Total_Amount_Expenses
        },
        {
          pos:"Q",
          value: ""
        },
        {
          pos:"AG",
          value: "TOTAL MEALS(IN UNIT)"
        },
        {
          pos:"AI",
          value: ""
        },
        {
          pos:"AJ",
          value: OtherDetails[0].Total_Meals_In_Unit
        }
      ],
      [
        {
          pos:"E",
          value:"COST/B.F"
        },
        {
          pos:"I",
          value: OtherDetailsFactory[0].Cost_breakfast
        },
        {
          pos:"K",
          value: ''
        },
        {
          pos:"L",
          value: ''
        },
        {
          pos:"M",
          value: ""
        },
        {
          pos:"N",
          value: ""
        },
        {
          pos:"O",
          value: ""
        },
        {
          pos:"P",
          value: ""
        },
        {
          pos:"Q",
          value: ""
        }
      ]
    ]

    otherDetalisRow2List.forEach((obj,i)=>{
      const otherDetalisRow2 = worksheet.addRow([])
      obj.forEach(el=>{
        otherDetalisRow2.getCell(this.foo(el.pos)).value = el.value
        otherDetalisRow2.getCell(this.foo(el.pos)).font = {
          size : 11,
         }
        otherDetalisRow2.getCell(this.foo(el.pos)).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        otherDetalisRow2.getCell(this.foo(el.pos)).alignment = {
          horizontal: "center",
          vertical : "middle"
        }
        if(el.pos == 'AG'){
          otherDetalisRow2.getCell(this.foo(el.pos)).alignment = {
            horizontal: "center",
            vertical : "middle",
            wrapText:true
            
          }
          otherDetalisRow2.getCell(this.foo(el.pos)).font = {
            size:7,
            bold:true
            
          }
        }
        
      })
      worksheet.mergeCells(`E${data.length + 9 + i}`,`H${data.length + 9 + i}` );
      worksheet.mergeCells(`AG${data.length + 9 + i}`,`AH${data.length + 9 + i}` );
      if( i == 2){
        otherDetalisRow2.height = 18.00
      }
      
    })
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

    worksheet.mergeCells(`E${data.length + 8}`,`I${data.length + 8}` );
    worksheet.mergeCells(`K${data.length + 8}`,`M${data.length + 8}` );
    worksheet.mergeCells(`AG${data.length + 8}`,`AH${data.length + 8}` );
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
  DownloadExcelReportHB(excelData ,FRdate ,ToDate ,purchase ,Expense ,Sale ,inflow ,outflow ,purTotal ,ExTotal ,Saletotal ,InfTotal ,outFlow) {
    const Project = excelData;
    const From = FRdate
    const To = ToDate;
   //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheetProject = workbook.addWorksheet('Project_PL');
    let worksheetInflow = workbook.addWorksheet('Inflow_outflow');

    let ProjectSTATEMENTRow = worksheetProject.addRow([]);
    ProjectSTATEMENTRow.getCell(1).value = "PROJECT WISE PROFIT AND LOSS STATEMENT";
    ProjectSTATEMENTRow.getCell(1).font={
      size: 11,
      bold: true,
      color: { argb: '4775d8' },
      name :  'Calibri' ,
    }
    ProjectSTATEMENTRow.getCell(1).alignment = {
      horizontal:'center'
    }
    worksheetProject.mergeCells('A1', 'F1');

    let ProjectPERIODRow = worksheetProject.addRow([]);
    // ProjectPERIODRow.getCell(1).value = "FOR THE PERIOD OF / AS ON DATE"+"( " + `${From} - ${To}` + " )";
     ProjectPERIODRow.getCell(1).font={
            size: 11,
            color: { argb: '4775d8' },
            name :  'Calibri' ,
    }
    ProjectPERIODRow.getCell(1).alignment = {
      horizontal:'center'
    }
    worksheetProject.mergeCells('A2', 'F2');

    let ProjectNameRow = worksheetProject.addRow([]);
     ProjectNameRow.getCell(1).value = "Project :  "+ `${Project}`;
     ProjectNameRow.getCell(1).font={
       size: 11,
       bold: true,
       color: { argb: '4775d8' },
       name :  'Calibri' ,
    }
    ProjectNameRow.getCell(1).alignment = {
      horizontal: 'left',
      vertical : "middle"
    }
    worksheetProject.getRow(3).height = 19.50;
    worksheetProject.mergeCells('A3', 'F3');

    let EXPENSESRow = worksheetProject.addRow([]);
    EXPENSESRow.getCell(1).value = "EXPENSES";
    EXPENSESRow.getCell(1).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    EXPENSESRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ed7d31' },
      bgColor: { argb: '' },
    }
    EXPENSESRow.getCell(1).border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    EXPENSESRow.getCell(1).alignment = {
      horizontal:'center'
    }
    worksheetProject.mergeCells('A4', 'C4');

    EXPENSESRow.getCell(4).value = "";
    EXPENSESRow.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2f75b5' },
      bgColor: { argb: '' }
    }
    EXPENSESRow.getCell(4).border = {
      top: { style: 'medium' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    EXPENSESRow.getCell(5).value = "INCOMES";
    EXPENSESRow.getCell(5).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    EXPENSESRow.getCell(5).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '70ad47'},
      bgColor: { argb: '' }
    }
    EXPENSESRow.getCell(5).border = {
      top: { style: 'medium' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'medium' },
    };
    EXPENSESRow.getCell(5).alignment = {
      horizontal:'center'
    }
    worksheetProject.getColumn(1).width = 31.14;
    worksheetProject.getColumn(2).width = 34.43;
    worksheetProject.getColumn(3).width = 12.14;
    worksheetProject.getColumn('D').width = 1;
    worksheetProject.getColumn(5).width = 45.29;
    worksheetProject.getColumn(6).width = 14.14;
    worksheetProject.mergeCells('E4', 'F4');

    let PurchaseBillRow = worksheetProject.addRow([]);
    PurchaseBillRow.getCell(1).value = "Purchase Bill";
    PurchaseBillRow.getCell(1).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    PurchaseBillRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f8cbad' },
      bgColor: { argb: '' }
    }
    PurchaseBillRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    PurchaseBillRow.getCell(1).alignment = {
      horizontal:'center'
    }
    worksheetProject.mergeCells('A5', 'C5');

    PurchaseBillRow.getCell(4).value = "";
    PurchaseBillRow.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2f75b5' },
      bgColor: { argb: '' }
    }
    PurchaseBillRow.getCell(4).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    PurchaseBillRow.getCell(5).value = "Sale Bill";
    PurchaseBillRow.getCell(5).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    PurchaseBillRow.getCell(5).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'c6e0b4' },
      bgColor: { argb: '' }
    }
    PurchaseBillRow.getCell(5).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'medium' },
    };
    PurchaseBillRow.getCell(5).alignment = {
      horizontal:'center'
    }
    worksheetProject.getRow(5).height = 12.50;
    worksheetProject.mergeCells('E5', 'F5');

    let SiteNameRow = worksheetProject.addRow([]);
    SiteNameRow.getCell(1).value = "Site Name";
    SiteNameRow.getCell(1).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteNameRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteNameRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    SiteNameRow.getCell(1).alignment = {
      horizontal:'center'
    }

    SiteNameRow.getCell(2).value = "Product Group";
    SiteNameRow.getCell(2).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteNameRow.getCell(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteNameRow.getCell(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    SiteNameRow.getCell(2).alignment = {
      horizontal:'center'
    }

    SiteNameRow.getCell(3).value = "Amount";
    SiteNameRow.getCell(3).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteNameRow.getCell(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteNameRow.getCell(3).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    SiteNameRow.getCell(3).alignment = {
      horizontal:'center'
    }

    SiteNameRow.getCell(4).value = "";
    SiteNameRow.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2f75b5' },
      bgColor: { argb: '' }
    }
    SiteNameRow.getCell(4).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    SiteNameRow.getCell(5).value = "Work Details";
    SiteNameRow.getCell(5).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteNameRow.getCell(5).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteNameRow.getCell(5).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    SiteNameRow.getCell(5).alignment = {
      horizontal:'center'
    }
    SiteNameRow.getCell(6).value = "Amount";
    SiteNameRow.getCell(6).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    SiteNameRow.getCell(6).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    SiteNameRow.getCell(6).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'medium' },
    };
    SiteNameRow.getCell(6).alignment = {
      horizontal:'center'
    }
    const data:any = [];
    purchase.forEach((ele:any) => {
      data.push(Object.values(ele))
    });

    const data1:any = [];
    Sale.forEach((ele:any) => {
    data1.push(Object.values(ele))
    });
    const ExpenseTb2: any = [
    {
      pos:'E'
    },
    {
      pos:'F'
    },
    ]
    data.forEach(d => {
    const row= worksheetProject.addRow(d);
    for( let i= 0; i< d.length;i++ ){
      row.getCell(i + 1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
      }
      row.getCell(i + 1).alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText:true
      } 
      row.getCell(2).alignment = {
        horizontal: 'left',
        vertical: 'middle',
        wrapText:true
      }
      row.getCell(3).alignment = {
        horizontal: 'right',
         vertical: 'middle',
      }
      row.getCell(i+1).font = {
        size:10
      }
      row.getCell(4).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '2f75b5' },
          bgColor: { argb: '' }
        }
      row.getCell(4).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      row.getCell(6).border = {
        right: { style: 'medium' },
        };
    }
    }
    );

    data1.forEach((ele,i) => {
    ExpenseTb2.forEach((e,inx) => {
      let row: any = worksheetProject.getCell(`${e.pos}${i + 7}`)
      row.value = ele[inx]
        worksheetProject.getCell(`${e.pos}${i+7}`).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
        worksheetProject.getCell(`${e.pos}${i+7}`).alignment = {
            horizontal: "left",
            wrapText:true
        }
        worksheetProject.getCell(`${e.pos}${i+7}`).font = {
          size:10
      }
      worksheetProject.getCell(`D${i+7}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '2f75b5' },
          bgColor: { argb: '' }
        }
      worksheetProject.getCell(`D${i+7}`).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
        };
      if (e.pos == 'F') {
            row.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'medium' }, 
            }
            row.alignment = {
                horizontal: "right",
                vertical : 'middle'
          }
      }
     });
    });
    // Blank Row
   let BlankRow =worksheetProject.addRow([])
    BlankRow.getCell(1).value = "";
    BlankRow.getCell(2).value = "";
    BlankRow.getCell(3).value = "";
    BlankRow.getCell(4).value = "";
    BlankRow.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2f75b5' },
      bgColor: { argb: '' }
    }
    BlankRow.getCell(4).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    BlankRow.getCell(6).border = {
         right: { style: 'medium' },
    }

    let TotalPurchaseBillRow = worksheetProject.addRow([])
    TotalPurchaseBillRow.getCell(1).value = "Total Purchase Bill";
    TotalPurchaseBillRow.getCell(1).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    TotalPurchaseBillRow.getCell(1).alignment = {
      horizontal:'right'
    }
    TotalPurchaseBillRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    TotalPurchaseBillRow.getCell(3).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };                                                      
    TotalPurchaseBillRow.getCell(3).value = Number(purTotal);
    TotalPurchaseBillRow.getCell(3).alignment = {
      horizontal:'right'
    }
    TotalPurchaseBillRow.getCell(4).value = "";
    TotalPurchaseBillRow.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2f75b5' },
      bgColor: { argb: '' }
    }
    TotalPurchaseBillRow.getCell(4).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    TotalPurchaseBillRow.getCell(6).border = {
         right: { style: 'medium' },
    }
    const dataSizeCheck = () => {
      return data.length > data1.length ? data.length : data1.length
    }
    worksheetProject.mergeCells(`A${dataSizeCheck() + 8}`, `B${dataSizeCheck() + 8}`);
    let BlankRow2 = worksheetProject.addRow([])
        BlankRow2.getCell(1).value = "";
        BlankRow2.getCell(2).value = "";
        BlankRow2.getCell(3).value = "";
        BlankRow2.getCell(4).value = "";
        BlankRow2.getCell(4).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '2f75b5' },
          bgColor: { argb: '' }
        }
        BlankRow2.getCell(4).border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
        BlankRow2.getCell(6).border = {
         right: { style: 'medium' },
        }
    
    let DirectExpensesRow = worksheetProject.addRow([])
    DirectExpensesRow.height = 12.75;
    DirectExpensesRow.getCell(1).value = "Direct Expenses";
    DirectExpensesRow.getCell(1).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    DirectExpensesRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f8cbad' },
      bgColor: { argb: '' }
    }
    DirectExpensesRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    DirectExpensesRow.getCell(1).alignment = {
      horizontal:'center'
    }
    DirectExpensesRow.getCell(4).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '2f75b5' },
          bgColor: { argb: '' }
    }
    DirectExpensesRow.getCell(4).border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
    };
    DirectExpensesRow.getCell(6).border = {
      right: { style: 'medium' },
    }
    
    worksheetProject.mergeCells(`A${dataSizeCheck() + 10}`, `C${dataSizeCheck() + 10}`);

    let DirectSiteNameRow = worksheetProject.addRow([])
    DirectSiteNameRow.height = 12.75
    DirectSiteNameRow.getCell(1).value = "Site Name";
    DirectSiteNameRow.getCell(1).alignment = {
      horizontal:'center'
    }
    DirectSiteNameRow.getCell(1).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    DirectSiteNameRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    DirectSiteNameRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    DirectSiteNameRow.getCell(2).value = "Ledger";
    DirectSiteNameRow.getCell(2).alignment = {
      horizontal:'center'
    }
    DirectSiteNameRow.getCell(2).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    DirectSiteNameRow.getCell(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    DirectSiteNameRow.getCell(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    DirectSiteNameRow.getCell(3).value = "Amount";
    DirectSiteNameRow.getCell(3).alignment = {
      horizontal:'center'
    }
    DirectSiteNameRow.getCell(3).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    DirectSiteNameRow.getCell(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'bdd7ee' },
      bgColor: { argb: '' }
    }
    DirectSiteNameRow.getCell(3).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    DirectSiteNameRow.getCell(3).alignment = {
      horizontal:'center'
    }
    DirectSiteNameRow.getCell(4).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '2f75b5' },
          bgColor: { argb: '' }
    }
    DirectSiteNameRow.getCell(4).border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
    };
    DirectSiteNameRow.getCell(6).border = {
      right: { style: 'medium' },
    }

    const data3:any = [];
    Expense.forEach((ele:any) => {
      data3.push(Object.values(ele))
    });
    data3.forEach(f => {
    const row1= worksheetProject.addRow(f);
    for( let i= 0; i< f.length;i++ ){
      row1.getCell(i + 1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
      }
      row1.getCell(i + 1).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      }
      row1.getCell(3).alignment = {
        horizontal: 'right',
        vertical: 'middle',
      }
      row1.getCell(2).alignment = {
        horizontal: 'left',
        vertical: 'middle',
      }
      row1.getCell(i+1).font = {
        size:10
      }
      row1.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2f75b5' },
      bgColor: { argb: '' }
      }
      row1.getCell(4).border = {
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      row1.getCell(6).border = {
        right: { style: 'medium' },
      };
    }
    }
    );
     // Blank Row
   let BlankRow3 =worksheetProject.addRow([])
    BlankRow3.getCell(1).value = "";
    BlankRow3.getCell(2).value = "";
    BlankRow3.getCell(3).value = "";
    BlankRow3.getCell(4).value = "";
    BlankRow3.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2f75b5' },
      bgColor: { argb: '' }
    }
    BlankRow3.getCell(4).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    BlankRow3.getCell(6).border = {
      right: { style: 'medium' },
    }

    let TotalExpensesRow = worksheetProject.addRow([])
    TotalExpensesRow.getCell(1).value = "Total Direct Expenses";
    TotalExpensesRow.getCell(1).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    TotalExpensesRow.getCell(1).alignment = {
      horizontal:'right'
    }
    TotalExpensesRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    TotalExpensesRow.getCell(3).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    TotalExpensesRow.getCell(3).value = Number(ExTotal);
    TotalExpensesRow.getCell(3).alignment = {
      horizontal:'right'
    }
    TotalExpensesRow.getCell(4).value = "";
    TotalExpensesRow.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2f75b5' },
      bgColor: { argb: '' }
    }
    TotalExpensesRow.getCell(4).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    TotalExpensesRow.getCell(6).border = {
      right: { style: 'medium' },
    }
    const mergeRowValue = (v:any) => {
      return data.length > data1.length  ? data.length  + data3.length + v : data1.length  + data3.length + v
    }
    worksheetProject.mergeCells('A'+mergeRowValue(13), 'B'+mergeRowValue(13));

     // Blank Row
   let BlankRow4 =worksheetProject.addRow([])
    BlankRow4.getCell(1).value = "";
    BlankRow4.getCell(2).value = "";
    BlankRow4.getCell(3).value = "";
    BlankRow4.getCell(4).value = "";
    BlankRow4.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2f75b5' },
      bgColor: { argb: '' }
    }
    BlankRow4.getCell(4).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    BlankRow4.getCell(6).border = {
      right: { style: 'medium' },
    };

    let TotalExpenses2Row = worksheetProject.addRow([])
    TotalExpenses2Row.height = 12.75;
    TotalExpenses2Row.getCell(1).value = "Total Expenses";
    TotalExpenses2Row.getCell(1).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    TotalExpenses2Row.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f8cbad' },
      bgColor: { argb: '' }
    }
    TotalExpenses2Row.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    TotalExpenses2Row.getCell(3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f8cbad' },
      bgColor: { argb: '' }
    }
    TotalExpenses2Row.getCell(3).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    TotalExpenses2Row.getCell(3).value = Number(purTotal) + Number(ExTotal);
    TotalExpenses2Row.getCell(3).alignment = {
      horizontal:'right'
    }

    TotalExpenses2Row.getCell(1).alignment = {
      horizontal:'right'
    }
    TotalExpenses2Row.getCell(4).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '2f75b5' },
          bgColor: { argb: '' }
    }
    TotalExpenses2Row.getCell(4).border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
    };
    TotalExpenses2Row.getCell(5).value = "Total Income";
    TotalExpenses2Row.getCell(5).font={
       size: 10,
       bold: true,
       name :  'Calibri' ,
    }
    TotalExpenses2Row.getCell(5).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'c6e0b4' },
      bgColor: { argb: '' }
    }
    TotalExpenses2Row.getCell(6).value = Number(Saletotal);
    TotalExpenses2Row.getCell(6).alignment = {
      horizontal:'right'
    }
    TotalExpenses2Row.getCell(6).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'medium' },
    };
    TotalExpenses2Row.getCell(6).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'c6e0b4' },
      bgColor: { argb: '' }
    }
    TotalExpenses2Row.getCell(5).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    TotalExpenses2Row.getCell(5).alignment = {
      horizontal:'right'
    }
    worksheetProject.mergeCells('A'+mergeRowValue(15), 'B'+mergeRowValue(15));

     // Blank Row
   let BlankRow5 =worksheetProject.addRow([])
    BlankRow5.getCell(1).value = "";
    BlankRow5.getCell(2).value = "";
    BlankRow5.getCell(3).value = "";
    BlankRow5.getCell(4).value = "";
    BlankRow5.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2f75b5' },
      bgColor: { argb: '' }
    }
    BlankRow5.getCell(4).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    BlankRow5.getCell(5).value = "";
    BlankRow5.getCell(6).value = "";
    BlankRow5.getCell(6).border = {
      right: { style: 'medium' },
    };

    let ProfitLossRow = worksheetProject.addRow([])
    ProfitLossRow.height = 12.75;
    ProfitLossRow.getCell(2).value = "Profit / (-) Loss"
    ProfitLossRow.getCell(2).font={
       size: 10,
       bold: true,
       color : { argb: 'f6f7f7' },
       name :  'Calibri' ,
    }
    ProfitLossRow.getCell(2).alignment = {
      horizontal:'right'
    }
    ProfitLossRow.getCell(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2f75b5' },
      bgColor: { argb: '' }
    }
    ProfitLossRow.getCell(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    ProfitLossRow.getCell(3).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    ProfitLossRow.getCell(3).value = Number((Number(Saletotal) -  Number(purTotal) + Number(ExTotal)).toFixed(2))
    ProfitLossRow.getCell(3).alignment = {
      horizontal:"right"
    }
    ProfitLossRow.getCell(4).value = "";
    ProfitLossRow.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2f75b5' },
      bgColor: { argb: '' }
    }
    ProfitLossRow.getCell(4).border = {
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    ProfitLossRow.getCell(6).value = "";
    ProfitLossRow.getCell(6).border = {
      right: { style: 'medium' },
    };
     // Blank Row
   let BlankRowLast =worksheetProject.addRow([])
    BlankRowLast.getCell(1).value = "";
    BlankRowLast.getCell(1).border = {
      bottom: { style: 'medium' },
    };
    BlankRowLast.getCell(2).value = "";
    BlankRowLast.getCell(2).border = {
     bottom: { style: 'medium' },
    };
    BlankRowLast.getCell(3).value = "";
    BlankRowLast.getCell(3).border = {
      bottom: { style: 'medium' },
    };
    BlankRowLast.getCell(4).value = "";
    BlankRowLast.getCell(4).border = {
      bottom: { style: 'medium' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
    BlankRowLast.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2f75b5' },
      bgColor: { argb: '' }
    }
    BlankRowLast.getCell(5).value = "";
    BlankRowLast.getCell(5).border = {
      bottom: { style: 'medium' },
    };
    BlankRowLast.getCell(6).value = "";
    BlankRowLast.getCell(6).border = {
      right: { style: 'medium' },
      bottom: { style: 'medium' },
    };

    //Inflow-OutFlow Start
   let Project1STATEMENTRow = worksheetInflow.addRow([]);
    Project1STATEMENTRow.getCell(1).value = "PROJECT WISE INFLOW - OUTFLOW STATEMENT";
    Project1STATEMENTRow.getCell(1).font={
      size: 11,
      bold: true,
      color: { argb: '4775d8' },
      name :  'Calibri' ,
    }
    Project1STATEMENTRow.getCell(1).alignment = {
      horizontal:'center'
    }
    worksheetInflow.mergeCells('A1', 'C1');

    let Project1PERIODRow = worksheetInflow.addRow([]);
     //Project1PERIODRow.getCell(1).value = "FOR THE PERIOD OF / AS ON DATE"+"( " + `${From} - ${To}` + " )";
     Project1PERIODRow.getCell(1).font={
            size: 11,
            color: { argb: '4775d8' },
            name :  'Calibri' ,
    }
    Project1PERIODRow.getCell(1).alignment = {
      horizontal:'center'
    }
    worksheetInflow.mergeCells('A2', 'C2');

    let Project1NameRow = worksheetInflow.addRow([]);
     Project1NameRow.getCell(1).value = "Project :  "+ `${Project}`;
     Project1NameRow.getCell(1).font={
       size: 11,
       bold: true,
       name :  'Calibri' ,
    }
    Project1NameRow.getCell(1).alignment = {
      horizontal: 'left',
      vertical : "middle"
    }
    worksheetInflow.getRow(3).height = 19.50;
    worksheetInflow.mergeCells('A3', 'C3'); 

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
    worksheetInflow.mergeCells('A4', 'C4');

    let SiteName1Row = worksheetInflow.addRow([]);
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

    SiteName1Row.getCell(2).value = "Ledger / Sub Ledger";
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

    SiteName1Row.getCell(3).value = "Amount";
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
    worksheetInflow.getColumn(1).width = 41.71;
    worksheetInflow.getColumn(2).width = 57.71;
    worksheetInflow.getColumn(3).width = 23.14;
    worksheetInflow.getRow(5).height = 12.75;

        const data4:any = [];
        inflow .forEach((ele:any) => {
          data4.push(Object.values(ele))
        });
    data4.forEach(d => {
      const row = worksheetInflow.addRow(d);
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
      row.getCell(3).alignment = {
        horizontal: 'right',
        vertical: 'middle',
        wrapText: true
      }
    }
        );

     let TotalInflowAmountBillRow = worksheetInflow.addRow([])
      TotalInflowAmountBillRow.getCell(2).value = "Total Inflow Amount";
      TotalInflowAmountBillRow.getCell(1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      TotalInflowAmountBillRow.getCell(2).alignment = {
        horizontal:'right'
      }
      TotalInflowAmountBillRow.getCell(2).font={
        size: 10,
        bold: true,
        name :  'Calibri' ,
      }
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
      TotalInflowAmountBillRow.getCell(3).value = Number(InfTotal);
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
    let BlankRow6 = worksheetInflow.addRow([])
        BlankRow6.getCell(3).border = {
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
          return  data4.length + v
        }
    worksheetInflow.mergeCells('A' + mergeRowValue1(8), 'C' + mergeRowValue1(8));
    
    let SiteName2Row = worksheetInflow.addRow([]);
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

    SiteName2Row.getCell(2).value = "Ledger / Sub Ledger";
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

    SiteName2Row.getCell(3).value = "Amount";
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

        const data5:any = [];
        outflow.forEach((ele:any) => {
          data5.push(Object.values(ele))
        });
    data5.forEach(l => {
      const row = worksheetInflow.addRow(l);
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
      row.getCell(3).alignment = {
        horizontal: 'right',
        vertical: 'middle',
        wrapText: true
      }
    }
    );
    
    let TotalOutflowAmountBillRow = worksheetInflow.addRow([])
      TotalOutflowAmountBillRow.getCell(2).value = "Total Outflow Amount";
      TotalOutflowAmountBillRow.getCell(1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      TotalOutflowAmountBillRow.getCell(2).alignment = {
        horizontal:'right'
      }
      TotalOutflowAmountBillRow.getCell(2).font={
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
      TotalOutflowAmountBillRow.getCell(3).value = Number(outFlow);
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
      let BlankRow7 = worksheetInflow.addRow([])
          BlankRow7.getCell(3).border = {
          right: { style: 'medium' },
      }
    
    let DifferenceRow = worksheetInflow.addRow([])
    DifferenceRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' },
    };
    DifferenceRow.getCell(2).value = "Difference (Inflow - Outflow)"
    DifferenceRow.getCell(2).font={
       size: 10,
       bold: true,
       color : { argb: 'f6f7f7' },
       name :  'Calibri' ,
    }
    DifferenceRow.getCell(2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2f75b5' },
        bgColor: { argb: '' },
    }
    DifferenceRow.getCell(2).alignment = {
      horizontal:'right'
    }
    DifferenceRow.getCell(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
    };
    DifferenceRow.getCell(3).value = Number((Number(InfTotal) - Number(outFlow)).toFixed(2))
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
        fs.saveAs(blob, 'harbauer_vi'+'.xlsx');
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
  getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', { month: 'short' });
  }


  // Cell Text
  CellText(worksheet,CellTextDetalis){
    
  // let CellTextDetalis = [
  //  {
  //    CreateRow: true, // * New Row Create
  //    Cell: "A1", // * Column Name
  //    Value: "Text", //* Cell Value String | Number 
  //   border:  {
  //      top: { style: 'thin' }, //'thin' | 'dotted' | 'hair' | 'medium' | 'double' | 'thick' | 'dashDot'| 'dashDotDot' | 'slantDashDot' | 'mediumDashed' | 'mediumDashDotDot' | 'mediumDashDot'
  //      left: { style: 'thin' }, //'thin' | 'dotted' | 'hair' | 'medium' | 'double' | 'thick' | 'dashDot'| 'dashDotDot' | 'slantDashDot' | 'mediumDashed' | 'mediumDashDotDot' | 'mediumDashDot'
  //      bottom: { style: 'thin' }, //'thin' | 'dotted' | 'hair' | 'medium' | 'double' | 'thick' | 'dashDot'| 'dashDotDot' | 'slantDashDot' | 'mediumDashed' | 'mediumDashDotDot' | 'mediumDashDot'
  //      right: { style: 'thin' }, //'thin' | 'dotted' | 'hair' | 'medium' | 'double' | 'thick' | 'dashDot'| 'dashDotDot' | 'slantDashDot' | 'mediumDashed' | 'mediumDashDotDot' | 'mediumDashDot'
  //    },
  //    Font :  {
  //      bold: true,
  //      size: 14,
  //      color:{ argb: 'EBF110' },
  //      italic: true,
  //      underline: true, // boolean | 'none' | 'single' | 'double' | 'singleAccounting' | 'doubleAccounting';
  //      vertAlign: 'superscript', // 'superscript' | 'subscript';
        
  //    },
  //    Fill: {
  //     type: 'pattern',
  //     pattern: 'solid',
  //     fgColor: { argb: '99ff99' },
  //     bgColor: { argb: '' }
  //    }
  //  }
  // ] 
 CellTextDetalis.forEach(el=>{
  if(el.CreateRow){
    worksheet.addRow([])
  }
  
  worksheet.getCell(el.Cell).value = el.Value
  if(el.hasOwnProperty('border')){
    worksheet.getCell(el.Cell).border = el.border
  }
  if(el.hasOwnProperty('Font')){
    worksheet.getCell(el.Cell).Font = el.Font
  }
  if(el.hasOwnProperty('Fill')){
    worksheet.getCell(el.Cell).Fill = el.Fill
  }
 })
  }

  // get Total Value of Row
  getTotalValueOfRow(worksheet,startRow,EndRow,positionTotalValueOfRow){
    // startRow  = "A1"
    // EndRow = "E1"
    // positionTotalValueOfRow = "F1"
  let TotalValueOfRow = 0
    let z = 0
  for( let i =  this.foo(startRow.replace(/[0-9]/g, '')) ; i <= this.foo(EndRow.replace(/[0-9]/g, '')); i++){
      TotalValueOfRow = TotalValueOfRow + worksheet.getCell(` ${this.colName((this.foo(startRow[0].replace(/[0-9]/g, '')) + z) - 1)}${EndRow.replace(/\D/g, "")}`).value
    z = z+1
} 
  worksheet.getCell(positionTotalValueOfRow).value = TotalValueOfRow
 }
  // get Total value of column
  getTotalValueOfColumn(worksheet,startColumn,endColumn,positionTotalValueOfColumn){
    // startColumn = "A1"
    // endColumn = "A20"
    // positionTotalValueOfColumn = "A21"
    let TotalValueOfColumn = 0
   let z = 0
  for(let i = Number(startColumn.replace(/\D/g, "")) ; i <= Number( endColumn.replace(/\D/g, "")); i++){
      TotalValueOfColumn = TotalValueOfColumn + worksheet.getCell(`${startColumn.replace(/[0-9]/g, '')}${Number(startColumn.replace(/\D/g, "" )) + z}`).value
      z = z+1
    }
   worksheet.getCell(positionTotalValueOfColumn).value = TotalValueOfColumn
 }
  // Merge Cell
  worksheetmergeCells(worksheet,mergeCell:any[]){
    // mergeCell = ["A1:B1","D2 : E4"]
    mergeCell.forEach(element => {
      worksheet.mergeCells(element);
    });
  }
  // Alignment  Column
  worksheetColumnAlignment(worksheet,AlignmentDetalis:any){
    // ColumnName : Name Of That 

   //  let AlignmentDetalis = [
  //   {
  //     ColumnName : "A1",
  //     AlignmentColumName: {
  //     horizontal: 'left' ,
  //     vertical: 'top' ,
  //     wrapText: true,
  //     indent: 1,
  //     readingOrder: 'rtl' ,
  //     textRotation:'vertical'
  //     }
  //   }
  // ]

  AlignmentDetalis.forEach(el=>{
    worksheet.getColumn(el.ColumnName).alignment = el.AlignmentColumName
  })

  }
  exprtToExcelHR_Reports(data: any,excelName:any) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Sheet1');

    let header = data.length ? Object.keys(data[0]) : [];
    let newHeader: any = [];
    header.forEach((ele: any) => {
      newHeader.push(ele.replaceAll("_", " "));
    })
    let body: any = [];
    data.forEach((ele: any) => {
      body.push(Object.values(ele));
    })
    let headerRow = worksheet.addRow(newHeader);
    headerRow.eachCell((cell, number) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
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
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    });
    headerRow.height = 25;
    for (let i = 1; i <= newHeader.length; i++) {
      worksheet.getColumn(i).width = 23;
    }
    body.forEach((ele: any, index: number) => {

      let newEle = ele.map((ele: any) => {
        if (ele == null) {
          return "";
        }
        else {
          return ele;
        }
      })
      let x = worksheet.addRow(newEle);
      x.height = 22;
      if (index % 2 == 0) {
        x.eachCell((cell, number) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F2F1ED' },
            bgColor: { argb: '' }
          }
        })
      }
      else {
        x.eachCell((cell, number) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'DEDDDC' },
            bgColor: { argb: '' }
          }
        })
      }
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, excelName.report_name.replaceAll(" ","_") + '.xlsx');
    })
 }

 exporttoExcelWeeklyFootfallDetails(excelData:any, daterange:any) {
  const workbook = new Workbook();
  let worksheet = workbook.addWorksheet("Weekly Footfall");

  const header =  Object.keys(excelData[0]) 
  const data:any = [];
  excelData.forEach((ele:any) => {
    data.push(Object.values(ele))
  });

  let headerRow1 = worksheet.addRow(["Weekly Footfall "+"( " + `${daterange.From_Date} - ${daterange.To_Date}` + " )"]);
  headerRow1.eachCell((cell, number) => {
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '8f5bb1' },
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
  });
  worksheet.mergeCells('A1', this.colName(excelData.length - 1)+'1')

  let headerRow2 = worksheet.addRow(["Sources"]);
  headerRow2.eachCell((cell, number) => {
    worksheet.getColumn(number).width = 30;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'e6325c' },
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
  });
  worksheet.mergeCells('A2', this.colName(excelData.length - 1)+'2')
  let headerRow3 = worksheet.addRow(header);

   // Set dynamic width for each column based on header length
   worksheet.columns.forEach((column, index) => {
    const headerLength = header[index] ? header[index].length : 10; // Default to 10 if no header
    column.width = Math.max(headerLength + 5, 10); // Set a minimum width of 10 and add padding of 5
  });
  
  headerRow3.eachCell((cell, number) => {
    // Apply different fill colors based on the column (first, last, or others)
    const totalColumns = headerRow3.cellCount; // Get the total number of columns in the header row
    if (number === 1) {
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
      // First column
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e6325c' }, // Color for first column
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }, // White text color
      };
    } else if (number === totalColumns) {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      // Last column
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '753fa6' }, // Color for last column
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }, // White text color
      };
    } else {
      // All other columns
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'd9d8db' }, // Default color for other columns
      };
      cell.font = {
        color: { argb: 'black' },
      };
    }
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });


  // Add Data and Conditional Formatting
  data.forEach((d, i) => {
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
    // Get the total number of columns in the current row
    const totalColumns = row.cellCount;
    
    // Format the first column
    row.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd9d8db' },
    };
    row.getCell(1).alignment = {
      horizontal:'left'
    };
    
    // Format the last column
    row.getCell(totalColumns).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'c7a7e4' },
    };
    row.getCell(totalColumns).font = {
      bold: true,
    };

  });
  let headerMar = [...header]
   const headerMarHeader = headerMar.slice(1)
   let totalRow = worksheet.addRow([]);
   totalRow.getCell(1).value = "Total"
   totalRow.getCell(1).alignment = {
    horizontal:'right'
   }
  
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
    // console.log(header.indexOf(el));
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
  // Access the last row after all rows have been added
  const lastRow = worksheet.lastRow;
  if (lastRow) {
    lastRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'c7a7e4' },
      };
      cell.font = {
        bold: true,
        color: { argb: '000000' }, // Black text color for the last row
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Change the color of the first cell in the last row
    lastRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '753fa6' },
    };
    lastRow.getCell(1).font = {
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
  } 
    
  // Generate & Save Excel File
  workbook.xlsx.writeBuffer().then((data: any) => {
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  fs.saveAs(blob, 'Weekly_Foootfall.xlsx');
  });
 }
 exporttoExcelAppoWithSourceDetails(objexcel) {
  const workbook = new Workbook();
  let worksheet = workbook.addWorksheet("Weekly Appointment With Sources");

  let tablehead1 = worksheet.addRow([objexcel.Cost_Cen_Name, objexcel.totalcount]);
  tablehead1.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    tablehead1.getCell(1).font={
      bold:true
    }
    tablehead1.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '53ca3f' },
      bgColor: { argb: '' }
    }
    tablehead1.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
}
    tablehead1.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
    tablehead1.getCell(2).font={
      bold:true
    }
    tablehead1.getCell(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '53ca3f' },
      bgColor: { argb: '' }
    }
    tablehead1.getCell(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
}
    const data1:any = [];
    objexcel.excelData1.forEach((ele:any) => {
      data1.push(Object.values(ele))
    });
    // Add Data and Conditional Formatting
    data1.forEach((d, i) => {
    const row = worksheet.addRow(d);
    row.getCell(1).alignment = {
      horizontal:'left'
    }
      row.getCell(1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
      }
      row.getCell(1).font = {
        bold:true
      }
    // Format the first column
    row.getCell(2).alignment = {
      horizontal:'center'
    };
    row.getCell(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
}

    });

  const header =  Object.keys(objexcel.excelData2[0]) 
  const data2:any = [];
  objexcel.excelData2.forEach((ele:any) => {
    data2.push(Object.values(ele))
  });
  worksheet.addRow([]);
  // worksheet.mergeCells('A2', this.colName(objexcel.excelData2.length - 2)+'2')
  let tablehead2 = worksheet.addRow(header);
   // Set dynamic width for each column based on header length
   worksheet.columns.forEach((column, index) => {
    const headerLength = header[index] ? header[index].length : 12; // Default to 10 if no header
    column.width = Math.max(headerLength + 6, 12); // Set a minimum width of 10 and add padding of 5
  });

  tablehead2.eachCell((cell, number) => {
    if (number === 1) {
      cell.alignment = { vertical: 'middle', horizontal: 'right' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'eab832' },
      };
      cell.font = {
          bold: true,
        };
    } else {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'f5e8d1' },
      };
      cell.font = {
        bold: true,
      };
    }
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // Add Data and Conditional Formatting
  data2.forEach((d, i) => {
    const row = worksheet.addRow(d);
    for( let i= 0; i< d.length;i++ ){
      row.getCell(i + 1).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
      }
    }
    row.eachCell((cell, number) => {
      if (number === 1) {
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.font = {
          bold: true,
        };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });
    row.getCell(2).font={
      bold:true
    }

  });
    
  // Generate & Save Excel File
  workbook.xlsx.writeBuffer().then((data: any) => {
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  fs.saveAs(blob, 'Weekly_Appointments_With_Sources.xlsx');
  });
 }
 exporttoExcelWeekSales(objexcel) {
  const workbook = new Workbook();
  let worksheet = workbook.addWorksheet("Weekly Sales");

  const header = Object.keys(objexcel.excelData[0]);
  const data: any = [];
  const slno1: any = [];
  const slno2: any = [];

  objexcel.excelData.forEach((ele) => {
    data.push(Object.values(ele));
  });

  objexcel.excelData.forEach((ele) => {
    if (ele.Sl_no == 1) {
      slno1.push(Object.values(ele));
    }
  });

  objexcel.excelData.forEach((ele) => {
    if (ele.Sl_no == 2) {
      slno2.push(Object.values(ele));
    }
  });

  let headerRow1 = worksheet.addRow(["","Weekly Sales " + `( ${objexcel.From_Date} - ${objexcel.To_Date} )`]);
  headerRow1.eachCell((cell, number) => {
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '8f5bb1' },
      bgColor: { argb: '' }
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFF' },
      size: 12
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // worksheet.mergeCells('A1', this.colName(header.length - 2) + '1');

  let headerRow2 = worksheet.addRow(["","Sources"]);
  headerRow2.eachCell((cell, number) => {
    worksheet.getColumn(number).width = 30;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'e6325c' },
      bgColor: { argb: '' }
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFF' },
      size: 12
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // worksheet.mergeCells('A2', this.colName(header.length - 2) + '2');

  let headerRow3 = worksheet.addRow(header);

  // Set dynamic width for each column based on header length
  worksheet.columns.forEach((column, index) => {
    const headerLength = header[index] ? header[index].length : 10;
    column.width = Math.max(headerLength + 5, 10);
  });

  headerRow3.eachCell((cell, number) => {
    const totalColumns = headerRow3.cellCount;
    if (number === 2) {
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e6325c' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
      };
    } else if (number === totalColumns) {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '753fa6' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
      };
    } else {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'd9d8db' },
      };
      cell.font = {
        color: { argb: 'black' },
      };
    }
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // Add Data and Conditional Formatting
  let startRow = 4; // Starting from the first data row
  let lastCostCenter = objexcel.excelData[0].Cost_Cen_Name; // Keep track of the first cost center name
  let groupStartRow = startRow; // Variable to track the start of each group

  objexcel.excelData.forEach((data, i) => {
    const row = worksheet.addRow(Object.values(data));
    const rowIndex = startRow + i; // Current row index

    // Center align font in the first column
    row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }; // Center align the first column

    // Check if the Cost_Cen_Name is the same as the previous one
    if (data.Cost_Cen_Name !== lastCostCenter) {
      // Merge cells for the previous group before moving to the next
      if (groupStartRow < rowIndex - 1) {
        worksheet.mergeCells(`A${groupStartRow}:A${rowIndex - 1}`); // Merge cells for the previous group
      }

      // Update tracking variables for the new group
      groupStartRow = rowIndex;
      lastCostCenter = data.Cost_Cen_Name;
    }

    // Get the total number of columns in the current row
    const totalColumns = row.cellCount;
    // Format the first column
    row.getCell(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd9d8db' },
    };
    row.getCell(2).alignment = {
      horizontal:'left'
    };
    
    // Format the last column
    row.getCell(totalColumns).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'c7a7e4' },
    };
    row.getCell(totalColumns).font = {
      bold: true,
    };


    for( let i= 0; i< header.length;i++ ){
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
    // Set cell borders and additional formatting
    row.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // Merge the last group if necessary (after the loop ends)
  const lastRowNum = worksheet.lastRow ? worksheet.lastRow.number : 0;
  if (groupStartRow < lastRowNum) {
    worksheet.mergeCells(`A${groupStartRow}:A${lastRowNum}`);
  }

  // Create total rows
  let totalRow = worksheet.addRow([]);
  totalRow.getCell(2).value = "Total Count";
  totalRow.getCell(2).alignment = {
    horizontal: 'right'
  };

  const calculateSum = (slnoData, rinx) => {
    let sum = 0;
    slnoData.forEach((arr) => {
      arr.forEach((arr1, inx) => {
        if (inx == rinx) {
          sum += arr1;
        }
      });
    });
    return sum;
  };

  header.slice(2).forEach((el) => {
    totalRow.getCell(header.indexOf(el) + 1).value = calculateSum(slno1, header.indexOf(el));
  });

  totalRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    cell.font = {
      bold: true,
      size: 12
    };
    cell.alignment = {
      horizontal: 'center'
    };
  });

  let totalRow2 = worksheet.addRow([]);
  totalRow2.getCell(2).value = "Total Amount";
  totalRow2.getCell(2).alignment = {
    horizontal: 'right'
  };

  header.slice(2).forEach((el) => {
    totalRow2.getCell(header.indexOf(el) + 1).value = calculateSum(slno2, header.indexOf(el));
  });

  totalRow2.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    cell.font = {
      bold: true,
      size: 12
    };
    cell.alignment = {
      horizontal: 'center'
    };
  });

  worksheet.spliceColumns(1, 1);
  worksheet.mergeCells('A1', this.colName(header.length - 2) + '1');
  worksheet.mergeCells('A2', this.colName(header.length - 2) + '2');
  
  // Access the last row
  const lastRow = worksheet.lastRow;

  if (lastRow) {
    const secondLastRow = worksheet.getRow(lastRow.number - 1);

    if (secondLastRow && secondLastRow.hasValues) {
      secondLastRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'c7a7e4' },
        };
        cell.font = {
          bold: true,
          color: { argb: '000000' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }

    totalRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'c7a7e4' },
      };
      cell.font = {
        bold: true,
        color: { argb: '000000' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  }

  // Generate & Save Excel File
  workbook.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    fs.saveAs(blob, 'Weekly_Sales.xlsx');
  });
 }
 exporttoExcelWeeklySalesDetails(excelData:any, ExcelDetails:any) {
  let workbook = new Workbook();
  let worksheet = workbook.addWorksheet(ExcelDetails.WorkSheetName);

    // Header
    let subheaderRow1 = worksheet.addRow(ExcelDetails.DateRange);
    subheaderRow1.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '809bba' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 10
      }
    })
    subheaderRow1.alignment = { horizontal:'center',vertical:'middle' }
    worksheet.mergeCells(subheaderRow1.number, 1, subheaderRow1.number, 4);

  // SubHeader
  let headerRow = worksheet.addRow(ExcelDetails.HeaderName2List);
  headerRow.eachCell((cell, number) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4a9ecf' },
      bgColor: { argb: '' }
    }
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFF' },
      size: 10
    }
  })
  headerRow.alignment = { horizontal:'center',vertical:'middle' }



  // frozen Row
  worksheet.views = [
    {state: 'frozen', ySplit: 2}
  ];

  // Body
  excelData.forEach((d:any) => {
    let arrhead1:any = []
            if(ExcelDetails.FileName === "Advance_Order_Details"){
              arrhead1 = ['','',d.Cost_Cen_Name,d.amount,'']
            } else {
              arrhead1 = ['','',d.Cost_Cen_Name,d.amount]
            }
    const row = worksheet.addRow(arrhead1)
    row.height = 22;
    row.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffA500' },
      }
      cell.font = {
        bold: true,
      }
      if(number == 3) {
        cell.alignment = { horizontal:'left',vertical:'middle' }
      }
      else{
        cell.alignment = { horizontal:'right',vertical:'middle' }
      }
    })
    
    if(d.Enq_deatils.length){
      d.Enq_deatils.forEach((ele:any) => {
        let arrhead2:any = []
            if(ExcelDetails.FileName === "Advance_Order_Details"){
              arrhead2 = [ele.Enq_Source_Name,'','',ele.amount,'']
            } else {
              arrhead2 = [ele.Enq_Source_Name,'','',ele.amount]
            }
        const prow = worksheet.addRow(arrhead2);
        prow.height = 20;
        prow.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'fbf1bc' },
          }
          cell.font = {
            bold: true,
          }
          if(number == 1) {
            cell.alignment = { horizontal:'left',vertical:'middle' }
          }
          else{
            cell.alignment = { horizontal:'right',vertical:'middle' }
          }
        })

        if(ele.Enq_details.length){
          ele.Enq_details.forEach((el:any) => {
            let arr:any = []
            if(ExcelDetails.FileName === "Advance_Order_Details"){
              arr = [el.Billing_Name,el.Binarual,el.Products,el.Amount,el.Bill_Status]
            } else {
              arr = [el.Billing_Name,el.Binarual,el.Products,el.Amount]
            }
            const grow = worksheet.addRow(arr);
            grow.height = 20;
            grow.eachCell((cell, number) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'efede0' },
              }
              cell.font = {
                bold: true,
              }
              if(number == 4) {
                cell.alignment = { horizontal:'right',vertical:'middle' }
              }
              else{
                cell.alignment = { horizontal:'left',vertical:'middle' }
              }
            })
          
          });
        }
      
      });
    }

  });

  worksheet.getColumn('A').width = 40
  worksheet.getColumn('B').width = 8
  worksheet.getColumn('C').width = 90
  worksheet.getColumn('D').width = 15


  // save as 
  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, ExcelDetails.FileName+'.xlsx');
  })

 }

 ExcelDoctorInsentiveForTest(excelData:any, daterange:any) {
  const workbook = new Workbook();
  let worksheet = workbook.addWorksheet("Doctor_Incentive_For_Testing");

  const header =  Object.keys(excelData[0]);
  const data:any = [];
  excelData.forEach((ele:any) => {
    data.push(Object.values(ele))
  });

  let headerRow1 = worksheet.addRow(["Doctor Incentive For Testing "+"( " + `${daterange.From_Date} - ${daterange.To_Date}` + " )"]);
  headerRow1.eachCell((cell, number) => {
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
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
  });
  worksheet.mergeCells('A1', 'C1')

  let headerRow2 = worksheet.addRow(header);

  headerRow2.eachCell((cell, number) => {
      // All other columns
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '3c8dbc' }, // Default color for other columns
      };
      cell.font = {
        color: { argb: 'ffffff' },
      };
    
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // Add Data and Conditional Formatting
  data.forEach(d => {
       worksheet.addRow(d);
  });

    worksheet.getColumn('A').width = 30
    worksheet.getColumn('B').width = 20
    worksheet.getColumn('C').width = 20
  // Generate & Save Excel File
  workbook.xlsx.writeBuffer().then((data: any) => {
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  fs.saveAs(blob, 'Doctor_Incentive_For_Testing.xlsx');
  });
 }
 ExcelDoctorIForTestingDetails(excelData:any, daterange:any) {
  const workbook = new Workbook();
  let worksheet = workbook.addWorksheet("Testing_Details");

  const header =  Object.keys(excelData[0]);
  const data:any = [];
  excelData.forEach((ele:any) => {
    data.push(Object.values(ele))
  });

  let headerRow1 = worksheet.addRow(["Testing Details "+"( " + `${daterange.From_Date} - ${daterange.To_Date}` + " )"]);
  headerRow1.eachCell((cell, number) => {
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
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
  });
  worksheet.mergeCells('A1', this.colName(header.length - 1) + '1')

  let headerRow2 = worksheet.addRow(header);
  
  headerRow2.eachCell((cell, number) => {
      // All other columns
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '3c8dbc' }, // Default color for other columns
      };
      cell.font = {
        color: { argb: 'ffffff' },
      };
    
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // Add Data and Conditional Formatting
  // Add Data Rows
const allRows = [header, ...data]; // Combine headers and data for width calc
allRows.forEach(row => worksheet.addRow(row));

// Dynamically set column widths
header.forEach((col, colIndex) => {
  let maxLength = col.length;

  allRows.forEach(row => {
    const cellValue = row[colIndex];
    if (cellValue) {
      const cellStr = String(cellValue);
      if (cellStr.length > maxLength) {
        maxLength = cellStr.length;
      }
    }
  });

  // Add padding to width
  worksheet.getColumn(colIndex + 1).width = maxLength + 3;
});

  // data.forEach(d => {
  //      worksheet.addRow(d);
  //      worksheet.getColumn('A').width = 30
  // });

  // Generate & Save Excel File
  workbook.xlsx.writeBuffer().then((data: any) => {
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  fs.saveAs(blob, 'Testing_Details.xlsx');
  });
 }
 ExportToExcelSaleRegister(excelData: any[]) {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Stock_Report");

  if (!excelData.length) return;

  // Step 1: Group data by Company
  const grouped = excelData.reduce((acc: { [key: string]: any[] }, item) => {
    const company = item.Company;
    if (!acc[company]) acc[company] = [];
    acc[company].push(item);
    return acc;
  }, {});

  let currentRow = 1;

  // Step 2: Write data group-wise
  for (const companyName of Object.keys(grouped)) {
    const items = grouped[companyName];
    const headers = Object.keys(items[0]);

    // Company Header Row (merged & styled)
    worksheet.mergeCells(currentRow, 1, currentRow, headers.length);
    const companyCell = worksheet.getCell(currentRow, 1);
    companyCell.value = companyName;
    companyCell.font = { bold: true, size: 14 };
    companyCell.alignment = { vertical: 'middle', horizontal: 'center' };
    companyCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD700' } // Gold color
    };
    currentRow++;

    // Column Header Row
    const headerRow = worksheet.getRow(currentRow);
    headers.forEach((header, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = header;
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '3c8dbc' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    currentRow++;

    // Data Rows
    items.forEach(item => {
      const values = Object.values(item);
      worksheet.addRow(values);
      currentRow++;
    });

    currentRow++; // Extra space between companies
  }

  // Step 3: Auto column widths
  const firstGroup = Object.values(grouped)[0];
  const sampleHeaders = Object.keys(firstGroup[0]);

  sampleHeaders.forEach((header, i) => {
    let maxLength = header.length;

    for (const rows of Object.values(grouped)) {
      rows.forEach(row => {
        const val = row[header];
        if (val && val.toString().length > maxLength) {
          maxLength = val.toString().length;
        }
      });
    }

    worksheet.getColumn(i + 1).width = maxLength + 5;
  });

  // Step 4: Save file
  workbook.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    fs.saveAs(blob, 'Stock_Report_Grouped.xlsx');
  });
}


}
