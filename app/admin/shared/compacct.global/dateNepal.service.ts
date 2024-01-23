import { Injectable } from "@angular/core";

declare var NepaliFunctions:any;
const NepaliDate = require('nepali-date');
@Injectable()
export class DateNepalConvertService {

 
  convertEngDateToNepaliDateObj = function (_Date:any) {
    const EnglishDate = new Date(_Date);
    var month = EnglishDate.getMonth() ;
    var day = EnglishDate.getDate();
    var year = EnglishDate.getFullYear();
    const NepalDateObj = NepaliFunctions.AD2BS({ year: year, month: month, day: day });
    return NepalDateObj.day+'/'+NepalDateObj.month+'/'+NepalDateObj.year;
  }
  convertNepaliDateToEngDate = function (dateStr) {
    const dateObj = this.getDateObj(dateStr);
    const EngDateObj = NepaliFunctions.BS2AD({year: dateObj.year, month: Number(dateObj.month) , day: dateObj.day});
    return new Date(EngDateObj.year,(EngDateObj.month -1),EngDateObj.day);
  }
  convertNewEngToNepaliDateObj = function (_Date) {
    const EnglishDate = new Date(_Date);
    var month = EnglishDate.getUTCMonth() + 1;
    var day = EnglishDate.getDate();
    var year = EnglishDate.getUTCFullYear();
    const NepalDateObj = NepaliFunctions.AD2BS({ year: year, month: month, day: day });
    return NepalDateObj.day+'/'+NepalDateObj.month+'/'+NepalDateObj.year;
 
  }
  convertEngToNepaliFormatDateObj = function (_Date) {
    const EnglishDate = new Date(_Date);
    var month = EnglishDate.getUTCMonth() + 1;
    var day = EnglishDate.getDate();
    var year = EnglishDate.getUTCFullYear();
    const NepalDateObj = NepaliFunctions.AD2BS({
      year: year,
      month: month,
      day: day
    });
    const d1 = new NepaliDate(NepalDateObj.year, Number(NepalDateObj.month) - 1, NepalDateObj.day)
    return d1.format('DD/MMMM/YYYY');
   
  }
  convertEngToNepaliFormatmonthObj = function (_Date) {
    const EnglishDate = new Date(_Date);
    var month = EnglishDate.getUTCMonth() + 1;
    var day = EnglishDate.getDate();
    var year = EnglishDate.getUTCFullYear();
    const NepalDateObj = NepaliFunctions.AD2BS({
      year: year,
      month: month,
      day: day
    });
    const d1 = new NepaliDate(NepalDateObj.year, Number(NepalDateObj.month) - 1, NepalDateObj.day)
    return d1.format('MMMM YYYY');
   
  }
  GetNepaliCurrentDateNew(){
    return NepaliFunctions.GetCurrentBsDate().day+'/'+NepaliFunctions.GetCurrentBsDate().month+'/'+NepaliFunctions.GetCurrentBsDate().year;
  }
  getDateObj = string => (([day, month, year]) => ({ day, month, year }))(string.split('/'));
}
