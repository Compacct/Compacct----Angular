import { Injectable } from "@angular/core";

declare var NepaliFunctions:any;
@Injectable()
export class DateNepalConvertService {
  GetNepaliDateStr(NepaliDateObj) {

  }
ValidatedNepaliDate(dateObj) {
    const year = dateObj.year.toString().length == 1 ? "0" + dateObj.year : dateObj.year;
    const month = dateObj.month.toString().length == 1 ? "0" + dateObj.month : dateObj.month;
    const day = dateObj.day.toString().length == 1 ? "0" + dateObj.day : dateObj.day;
    return day + '/' + month + '/' + year
  }
  convertEngDateToNepaliDate = function (_Date) {
    const EnglishDate = new Date(_Date);
    var month = EnglishDate.getUTCMonth() + 1;
    var day = EnglishDate.getDate();
    var year = EnglishDate.getUTCFullYear();
    const NepalDateObj = NepaliFunctions.AD2BS({ year: year, month: month, day: day });
    const NepalDate = NepalDateObj.day + '/' + NepalDateObj.month + '/' + NepalDateObj.year;
    return NepalDate;
  }
}
