import { Injectable } from "@angular/core";

declare var NepaliFunctions:any;
const NepaliDate = require('nepali-date');
@Injectable()
export class DateNepalConvertService {
  GetCurrentNepaliDate() {
    return new NepaliDate();
  }
  GetNepaliDateStr(dateObj) {
    const obj = {...dateObj}
    obj.month = Number(obj.month) + 1;
   const d1 = NepaliFunctions.GetBsFullDate(obj, true);
   return d1
  }
  ValidatedNepaliDate(obj) {
    const dateObj = {...obj};
  console.log('ValidatedNepaliDate',dateObj)
    const year = dateObj.year.toString().length == 1 ? "0" + dateObj.year : dateObj.year;
    const month = dateObj.month.toString().length == 1 ? "0" + dateObj.month : dateObj.month;
    const day = dateObj.day.toString().length == 1 ? "0" + dateObj.day : dateObj.day;
    return day + '/' + month + '/' + year
  }
  convertEngDateToNepaliDateObj = function (_Date:any) {
    const EnglishDate = new Date(_Date);
    var month = EnglishDate.getMonth() + 1;
    var day = EnglishDate.getDate();
    var year = EnglishDate.getFullYear();
    const NepalDateObj = NepaliFunctions.AD2BS({ year: year, month: month, day: day });
    return { year: NepalDateObj.year, month: Number(NepalDateObj.month) - 1, day: NepalDateObj.day };
  }
  convertNepaliDateToEngDate = function (obj) {
    const dateObj = {...obj};
    const EngDateObj = NepaliFunctions.BS2AD({year: dateObj.year, month: Number(dateObj.month) + 1, day: dateObj.day});
    console.log('convertNepaliDateToEngDate',EngDateObj)
    return new Date(EngDateObj.year,(EngDateObj.month -1),EngDateObj.day);
  }
}
