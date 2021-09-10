import { Injectable } from "@angular/core";

@Injectable()
export class DateTimeConvertService {
  monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  currentDate: Date;
  dateConvert(dateParam: Date) {
    this.currentDate = new Date(dateParam);
    return `${this.currentDate.getDate().toString().length === 1 ? '0'+this.currentDate.getDate() : this.currentDate.getDate()}/${
      this.monthNames[this.currentDate.getMonth()]
    }/${this.currentDate.getFullYear()}`;
  }
  dateTimeConvert = function(dateTimeParam) {
    let hours = dateTimeParam.getHours();
    let minutes = dateTimeParam.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return (
      dateTimeParam.getDate() +
      "-" +
      this.monthNames[dateTimeParam.getMonth()] +
      "-" +
      dateTimeParam.getFullYear() +
      "  " +
      strTime
    );
  };
  getTime24Hours = function (param) {
    if (param) {
        let date = new Date(param);
        let hours = date.getHours();
        let minutes:any = date.getMinutes();          
       hours = hours % 24;
       hours = hours ? hours : 24; // the hour '0' should be '12'
       minutes = minutes < 10 ? '0' + minutes : minutes;
       var strTime = hours + ':' + minutes;
       return strTime;
    }
  }

  getTime (dateParam) {
    let date = new Date(dateParam);
    let hours = date.getHours();
    let minutes:any = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  getNumberOfDays(startDate, endDate) {
      let oneDay = 24 * 60 * 60 * 1000;
      let firstDate = new Date(startDate);
      let secondDate = new Date(endDate);
      let diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
      diffDays = diffDays + 1;
      return diffDays;
  }

  timeStampConvertStart(dateTime) {
      //convert only 10 digit time stamp without time value default time 12am
      let tempDate = new Date(dateTime);
      let utcDate = new Date(Date.UTC(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 0, 0, 0));
      let timeStamp = Math.floor((new Date(utcDate)).getTime() / 1000);
      return timeStamp;
  }
  timeStampConvertEnd(dateTime) {
      //convert only 10 digit time stamp with 11:59pm
      let tempDate = new Date(dateTime);
      let utcDate = new Date(Date.UTC(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 23, 59, 59));
      let timeStamp = Math.floor((new Date(utcDate)).getTime() / 1000);
      return timeStamp;
  }

}
