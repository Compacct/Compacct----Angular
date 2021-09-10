import { Component, OnInit, ViewChild, AfterViewChecked } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { AnyARecord } from "dns";
import { ActivatedRoute } from "@angular/router";
import { CompacctHearingThresholdChartComponent } from "../../../../shared/compacct.components/compacct.hearing.threshold-chart/compacct.hearing.threshold-chart.component";
import { CompacctCcshahaAdComponent } from "./compacct.audiogramData/compacct.ccshaha.ad/compacct.ccshaha.ad.component";
declare var $: any;
@Component({
  selector: "app-compacct-audiogram",
  templateUrl: "./compacct.audiogram.component.html",
  styleUrls: ["./compacct.audiogram.component.css"]
})
export class CompacctAudiogramComponent implements OnInit, AfterViewChecked {
  registrationSubmitted5 = false;
  url = window["config"];
  DOBDate: Date;
  objCommonAll = new Commonobj();
  company: string;
  appoID: any;
  appoDate: any;
  FootFallID: any;
  PrintData: any;
  PrintBtnFlag = false;
  @ViewChild("Audograph", { static: false })
  AudographComp: CompacctHearingThresholdChartComponent;
  @ViewChild("ccsahaAudiometry", { static: false })
  _ccsahaAudiometry: CompacctCcshahaAdComponent;
  NativePatientList: any;
  PatientList = [];
  PatientSearch: string;
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Audiogram",
      Link: "Patient Management -> Transaction -> Audiologist -> Audiogram "
    });

    $("body").addClass("sidebar-collapse");
    this.company = this.$CompacctAPI.CompacctCookies.Company_Name;
    this.appoID = window.atob(this.route.snapshot.queryParams["AppoID"]);
    this.appoDate = window.atob(this.route.snapshot.queryParams["AppoDt"]);
    this.FootFallID = window.atob(
      this.route.snapshot.queryParams["FootFallID"]
    );
    console.log(this.company);
    this.PatientChange(this.FootFallID);
  }
  ngAfterViewChecked(): void {
    this._ccsahaAudiometry.getTympParameter();
  }
  getDateObj(DateObj) {
    return DateObj === "1900-01-01T00:00:00"
      ? "-"
      : this.DateService.dateConvert(new Date(DateObj));
  }
  fetchDetails() {
    const para = new HttpParams().set("Appo_ID", this.appoID);
    this.$http
      .get(this.url.apiUpdateCCSahaAudiometry, { params: para })
      .subscribe((data: any) => {
        this.PrintData = data ? JSON.parse(data)[0] : {};
        this.graphFetch();
      });
  }

  childSaveCall(obj) {
    if (obj.save === "done") {
      this.PrintBtnFlag = true;
    } else {
      this.PrintBtnFlag = false;
    }
  }

  GetPatient() {
    this.$http.get(this.url.apiGetAllPatientList).subscribe((data: any) => {
      this.NativePatientList = data ? JSON.parse(data) : [];
      this.NativePatientList.forEach(el => {
        this.PatientList.push({
          label: el.Lead_Details,
          value: el.Foot_Fall_ID
        });
      });
    });
  }
  graphFetch() {
    if (this.company === "C.C.SAHA LTD") {
      const printObj = this.AudographComp.PrintFetch();
      const patientDetails = $("#invoice").html();
      console.log(patientDetails);
      const cssStyle = `
    .table{
          width: 100%;
    max-width: 100%;
    table-layout: fixed;
    }
    td{
      text-align:center;
      font-size:62.5%;
          font-family: sans-serif;
    }
    p {
    color: grey;
    margin-bottom: 2px;
    margin-top:5px;
        font-family: sans-serif;
}
.invoice {
  position: relative;
    background-color: #fff;
    padding: 1em;
    width: 95%;
    display: inline-block;
}
.invoice header {
  padding: 10px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #3989c6;
}
.invoice .company-details {
  text-align: right;
}
.invoice .company-details .name {
  margin-top: 0;
  margin-bottom: 0;
}
.invoice .contacts {
  margin-bottom: 20px;
}
.invoice .invoice-to {
  text-align: left;
  display: inline-block;
  width: 50%;
}
.invoice .invoice-to .to {
  margin-top: 0;
  margin-bottom: 0;
}
.invoice .invoice-details {
  text-align: right;
  display: inline-block;
  width: 50%;
}
.invoice .invoice-details .invoice-id {
  margin-top: 0;
  color: #3989c6;
}

.invoice main .thanks {
  margin-top: -100px;
  font-size: 2em;
  margin-bottom: 50px;
}
.invoice main .notices {
  padding-left: 6px;
  border-left: 6px solid #3989c6;
}
.invoice main .notices .notice {
  font-size: 1.2em;
}
.invoice table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 20px;
}
.invoice table td,
.invoice table th {
  padding: 5px;
  background: #eee;
  border-bottom: 1px solid #fff;
}
.invoice table th {
  white-space: nowrap;
  font-weight: 400;
  font-size: 14px;
  background: #3c8dbc;
  border: 1px solid #62a5ccde;
  color: white;
}
.invoice table td h3 {
  margin: 0;
  font-weight: 400;
  color: #3989c6;
  font-size: 1.2em;
}
.invoice table .no {
  font-size: 1em;
  background: #ddd;
}
.invoice table tbody tr:last-child td {
  border: none;
}
.invoice table tfoot td {
  background: 0 0;
  border-bottom: none;
  white-space: nowrap;
  text-align: right;
  padding: 10px 20px;
  font-size: 1.2em;
  border-top: 1px solid #aaa;
}
.invoice table tfoot tr:first-child td {
  border-top: none;
}
.invoice table tfoot tr:last-child td {
  color: #3989c6;
  font-size: 1.4em;
  border-top: 1px solid #3989c6;
}
.invoice table tfoot tr td:first-child {
  border: none;
}
.invoice footer {
  width: 100%;
  text-align: center;
  color: #777;
  border-top: 1px solid #aaa;
  padding: 8px 0;
}
.print:last-child {
     page-break-after: auto;
}
@media print {
  body img {
       width: 90%; max-width: 1048px; 
    } 
  .invoice {
    font-size: 11px !important;
    overflow: hidden !important;
  }

  .invoice footer {
    position: absolute;
    bottom: 10px;
    page-break-after: always;
  }

  .invoice > div:last-child {
    page-break-before: always;
  }
}`;
      const discusson = `<table class='table'><thead>
      <tr style = 'background-color:#3c8dbc;color:white;'>
        <th style = 'background-color:#a94442;color:white;width:100%;'> RIGHT </th>
        <th style = 'background-color:#337ab7;color:white;width:100%;'> LEFT </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${this.PrintData.CC_DISC_RIGHT_1}</td>
        <td>${this.PrintData.CC_DISC_LEFT_1}</td>
      </tr>
        <tr>
        <td>${this.PrintData.CC_DISC_RIGHT_2}</td>
        <td>${this.PrintData.CC_DISC_LEFT_2}</td>
      </tr>
        <tr>
        <td>${this.PrintData.CC_DISC_RIGHT_3}</td>
        <td>${this.PrintData.CC_DISC_LEFT_3}</td>
      </tr>
    </tbody>
  </table>`;
      const impression = `<table  class='table'><thead>
      <tr style = 'background-color:#3c8dbc;color:white'>
        <th style = 'background-color:#a94442;color:white;width:100%;'> RIGHT </th>
        <th style = 'background-color:#337ab7;color:white;;width:100%;'> LEFT </th>
      </tr>
    </thead>
      <tbody>
       <tr>
        <td>${this.PrintData.CC_IMP_RIGHT_1}</td>
        <td>${this.PrintData.CC_IMP_LEFT_1}</td>
      </tr>
        <tr>
        <td>${this.PrintData.CC_IMP_RIGHT_2}</td>
        <td>${this.PrintData.CC_IMP_LEFT_2}</td>
      </tr>
        <tr>
        <td>${this.PrintData.CC_IMP_RIGHT_3}</td>
        <td>${this.PrintData.CC_IMP_LEFT_3}</td>
      </tr>
    </tbody>
    </table>`;
      const audiodata = "thishsg";
      const co = "thes";
      const ho = "thised";
      const puretone = `<table  class='table'><thead>
      <tr style = 'background-color:#3c8dbc;color:white'>
        <th style = 'background-color:#a94442;color:white;width:100%;'> RIGHT </th>
        <th style = 'background-color:#337ab7;color:white;;width:100%;'> LEFT </th>
      </tr>
    </thead>
      <tbody>
       <tr>
        <td>${this.PrintData.CC_PT_RIGHT_1}</td>
        <td>${this.PrintData.CC_PT_LEFT_1}</td>
      </tr>
        <tr>
        <td>${this.PrintData.CC_PT_RIGHT_2}</td>
        <td>${this.PrintData.CC_PT_LEFT_2}</td>
      </tr>
    </tbody>
    </table>`;
      const art = "test art";
      const remark = "test remarks";
      const tympanometry = `<table  class='table'><thead>
      <tr>
        <th style="background-color:transparent;color: grey;width: 100%;">Tympanometry Parameters </th>
        <th style = 'background-color:#a94442;color:white;width:100%;'> RIGHT </th>
        <th style = 'background-color:#337ab7;color:white;;width:100%;'> LEFT </th>
      </tr>
    </thead>
      <tbody>
      <tr>
         <td style='text-align:left !important;'> Type</td>
        <td>${this.PrintData.CC_TYMP_RIGHT_1}</td>
        <td>${this.PrintData.CC_TYMP_LEFT_1}</td>
      </tr>
      <tr>
         <td style='text-align:left !important;'> Ear Canal Volume (ml)</td>
        <td>${this.PrintData.CC_TYMP_RIGHT_2}</td>
        <td>${this.PrintData.CC_TYMP_LEFT_2}</td>
      </tr>
      <tr>
         <td style='text-align:left !important;'> Compliance (ml)</td>
        <td>${this.PrintData.CC_TYMP_RIGHT_3}</td>
        <td>${this.PrintData.CC_TYMP_LEFT_3}</td>
      </tr>
      <tr>
         <td style='text-align:left !important;'> Middle Ear Pressure (daPa)</td>
        <td>${this.PrintData.CC_TYMP_RIGHT_4}</td>
        <td>${this.PrintData.CC_TYMP_LEFT_4}</td>
      </tr>
      <tr>
         <td style='text-align:left !important;'> Gradient (daPa)</td>
        <td>${this.PrintData.CC_TYMP_RIGHT_5}</td>
        <td>${this.PrintData.CC_TYMP_LEFT_5}</td>
      </tr>
      <tr>
         <td style='text-align:left !important;'> ${this.PrintData.CC_TYMP_Text_6}</td>
        <td>${this.PrintData.CC_TYMP_RIGHT_6}</td>
        <td>${this.PrintData.CC_TYMP_LEFT_6}</td>
      </tr>
    </tbody>
    </table>`;

      const mywindow = window.open("", "PRINT");

      mywindow.document.write(
        "<html><head><title>" + document.title + "</title>"
      );

      mywindow.document.write("</head><body class='print'>");
      mywindow.document.write(patientDetails);
      mywindow.document.write(printObj["right"]);
      mywindow.document.getElementById("img1").appendChild(printObj.img1);
      mywindow.document.write(printObj["left"]);
      mywindow.document.getElementById("img2").appendChild(printObj.img2);
      mywindow.document.write("</div> </div>");
      mywindow.document.write(
        "<div style='display:inline-block;width:100%'> <p> Audiogram Data</p><div style='padding: 5px 20px;border: 1px solid #e6e6e6;'>" +
          this.PrintData.CC_Main_Remarks +
          "</div></div>"
      );
      mywindow.document.write(
        "<div style='display:inline-block;width:100%'><div style='display:inline-block;width:50%'> <p>C/O</p><div style='padding: 5px 20px;border: 1px solid #e6e6e6;'>" +
          this.PrintData.CC_C_O +
          "</div></div><div style='display:inline-block;width:50%'><p>H/O</p><div style='padding: 5px 20px;border: 1px solid #e6e6e6;'>" +
          this.PrintData.CC_H_O +
          "</div></div></div>"
      );
      mywindow.document.write(
        "<div><div style='display:inline-block;width:50%'> <p>Discussion</p>" +
          discusson +
          "</div><div style='display:inline-block;width:50%'><p>Impression</p>"
      );
      mywindow.document.write(impression + "</div> </div>");
      mywindow.document.write(
        "<div style='display:inline-block;width:100%'>" +
          tympanometry +
          "</div>"
      );
      mywindow.document.write(
        "<div style='display: inline - block; width: 50 %'><div style='display:inline-block;width:50%'> <p>Pure Tone</p>" +
          puretone +
          "</div><div style='display:inline-block;width:50%;float:right;'><p>Art</p><div style='padding: 5px 20px;border: 1px solid #e6e6e6;'>" +
          this.PrintData.CC_ART +
          "</div><p>Remarks</p><div style='padding: 5px 20px;border: 1px solid #e6e6e6;'>" +
          this.PrintData.REMARKS +
          "</div></div>"
      );
      mywindow.document.write("</body><style>" + cssStyle + "</style ></html>");

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      // mywindow.print();
    } else {
    }
  }
  // CHANGE
  PatientChange(footFall) {
    if (footFall) {
      const obj = new HttpParams().set("FootFallID", footFall);
      this.$http
        .get(this.url.apiGetOneLeadHearing, { params: obj })
        .subscribe((data: any) => {
          const patientDetails = data ? JSON.parse(data) : [];
          const validDOB = this.DateService.dateConvert(
            new Date(patientDetails[0].Date_Of_Birth)
          );
          this.objCommonAll = patientDetails[0];
          this.objCommonAll.Mobile = patientDetails[0].Mobile;
          this.objCommonAll.Contact_Name = patientDetails[0].Contact_Name;
          this.objCommonAll.Gender = patientDetails[0].Gender;

          this.DOBDate =
            validDOB === "1/Jan/1900"
              ? undefined
              : new Date(patientDetails[0].Date_Of_Birth);
          this.objCommonAll.Age = patientDetails[0].Age;
          this.objCommonAll.Enq_Source_Sub_Name =
            patientDetails[0].Enq_Source_Name;
          this.objCommonAll.Enq_Source_Sub_Name1 =
            patientDetails[0].Enq_Source_Sub_Name;
        });
    }
  }
}
class Commonobj {
  Mobile: number;
  Prefix: string;
  Contact_Name: string;
  Gender: string;
  Date_Of_Birth: string;
  Age: number;
  Enq_Source_Sub_Name: string;
  Enq_Source_Sub_Name1: string;
  Address: string;
  District: string;
  State: string;
  Pin: string;
  Foot_Fall_ID: string;
  Appo_Dt: string;
}
