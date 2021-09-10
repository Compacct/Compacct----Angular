import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

declare var $: any;
import * as moment from "moment";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from "../../../../../../shared/compacct.services/common.api.service";
import { DateTimeConvertService } from "../../../../../../shared/compacct.global/dateTime.service";
import { CompacctHeader } from "../../../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalUrlService } from "../../../../../../shared/compacct.global/global.service.service";
import { HttpClient, HttpParams } from "@angular/common/http";

@Component({
  selector: "app-compacct-ccshaha-ad",
  templateUrl: "./compacct.ccshaha.ad.component.html",
  styleUrls: ["./compacct.ccshaha.ad.component.css"],
  providers: [MessageService]
})
export class CompacctCcshahaAdComponent implements OnInit {
  buttonname = "Create";
  url = window["config"];
  saveSpinner = false;
  check: boolean;
  disableBoth: boolean;
  CCSahaAudiometryTabDisabled = false;
  enablePrint = false;
  registrationSubmitted5 = false;
  //  DATA
  CC_PT_LEFT_1: string;
  CC_PT_LEFT_2: string;
  CC_PT_RIGHT_1: string;
  CC_PT_RIGHT_2: string;

  CC_DISC_LEFT_1: string;
  CC_DISC_LEFT_2: string;
  CC_DISC_LEFT_3: string;
  CC_DISC_RIGHT_1: string;
  CC_DISC_RIGHT_2: string;
  CC_DISC_RIGHT_3: string;

  CC_IMP_LEFT_1: string;
  CC_IMP_LEFT_2: string;
  CC_IMP_LEFT_3: string;
  CC_IMP_RIGHT_1: string;
  CC_IMP_RIGHT_2: string;
  CC_IMP_RIGHT_3: string;

  CC_TYMP_Text_1: string;
  CC_TYMP_Text_2: string;
  CC_TYMP_Text_3: string;
  CC_TYMP_Text_4: string;
  CC_TYMP_Text_5: string;

  objCCaudiometry = new Audiometry();
  AudioNameList: [];
  text6Parameter: string;
  @Input() Footfall: number;
  @Input() AppoID: number;
  @Output() _saveCCsahaAudiometry = new EventEmitter();
  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService
  ) {}

  ngOnInit() {
    this.getAllAudioName();
    this.getText6Parameter();
    this.getEditData(this.AppoID);
  }

  getAllAudioName = function() {
    this.$http.get(this.url.apiGetAudioNameCCsaha).subscribe((data: any) => {
      this.AudioNameList = data ? JSON.parse(data) : [];
    });
  };
  public getTympParameter = function() {
    this.$http
      .get(this.url.apiGetTympParameterCCSahaAudiometry)
      .subscribe((data: any) => {
        const tempObj = data ? JSON.parse(data) : [];
        this.CC_TYMP_Text_1 = tempObj[0].Text_1;
        this.CC_TYMP_Text_2 = tempObj[0].Text_2;
        this.CC_TYMP_Text_3 = tempObj[0].Text_3;
        this.CC_TYMP_Text_4 = tempObj[0].Text_4;
        this.CC_TYMP_Text_5 = tempObj[0].Text_5;
        console.log(
          this.CC_TYMP_Text_1,
          this.CC_TYMP_Text_2,
          this.CC_TYMP_Text_3,
          this.CC_TYMP_Text_4
        );
      });
  };
  getText6Parameter = function() {
    this.$http
      .get(this.url.apiGetText6CCSahaAudiometry)
      .subscribe((data: any) => {
        this.text6Parameter = data ? JSON.parse(data) : [];
      });
  };
  changeAudioName = function(value, property) {
    this.objCCaudiometry[property] = undefined;
    if (value) {
      const tempObj = $.grep(this.AudioNameList, function(obj) {
        return obj.TextName === value;
      })[0];
      this.objCCaudiometry[property] = tempObj
        ? tempObj.DNAME
        : value.replace(/^[-\d\s]*/, "");
    }
  };
  changeText6 = function(text) {
    this.objCCaudiometry.CC_TYMP_RIGHT_6 = undefined;
    this.objCCaudiometry.CC_TYMP_LEFT_6 = undefined;

    if (text) {
      this.disableBoth = text === "NA" ? true : false;
      this.objCCaudiometry.CC_TYMP_RIGHT_6 =
        text === "NA" ? undefined : this.objCCaudiometry.CC_TYMP_RIGHT_6;
      this.objCCaudiometry.CC_TYMP_LEFT_6 =
        text === "NA" ? undefined : this.objCCaudiometry.CC_TYMP_LEFT_6;
    }
  };
  toggleTympanometryReport = function() {
    if (
      $(".Tympanometry").filter(function() {
        return $(this).val();
      }).length > 0
    ) {
      this.check = true;
    } else {
      this.check = false;
    }
  };

  enableEdit = function(obj) {
    return this.DateService.dateConvert(obj.Appo_Dt) ===
      this.DateService.dateConvert(new Date())
      ? true
      : false;
  };
  EditCCSahaAudiometry = function(obj) {
    this.buttonname = "Update";
    this.getEditData(obj.Appo_ID);
  };
  getEditData = function(appoID) {
    const para = new HttpParams().set("Appo_ID", appoID);
    this.$http
      .get(this.url.apiUpdateCCSahaAudiometry, { params: para })
      .subscribe((data: any) => {
        const obj = data ? JSON.parse(data) : [];
        this.objCCaudiometry.CC_Main_Remarks = obj[0].CC_Main_Remarks;
        this.objCCaudiometry.CC_C_O = obj[0].CC_C_O;
        this.objCCaudiometry.CC_H_O = obj[0].CC_H_O;
        this.objCCaudiometry.CC_PT_LEFT_1 = obj[0].CC_PT_LEFT_1;
        this.objCCaudiometry.CC_PT_LEFT_2 = obj[0].CC_PT_LEFT_2;
        this.objCCaudiometry.CC_PT_RIGHT_1 = obj[0].CC_PT_RIGHT_1;
        this.objCCaudiometry.CC_PT_RIGHT_2 = obj[0].CC_PT_RIGHT_2;

        this.objCCaudiometry.CC_TYMP_RIGHT_1 = obj[0].CC_TYMP_RIGHT_1;
        this.objCCaudiometry.CC_TYMP_RIGHT_2 = obj[0].CC_TYMP_RIGHT_2;
        this.objCCaudiometry.CC_TYMP_RIGHT_3 = obj[0].CC_TYMP_RIGHT_3;
        this.objCCaudiometry.CC_TYMP_RIGHT_4 = obj[0].CC_TYMP_RIGHT_4;
        this.objCCaudiometry.CC_TYMP_RIGHT_5 = obj[0].CC_TYMP_RIGHT_5;
        this.objCCaudiometry.CC_TYMP_LEFT_6 =
          obj[0].CC_TYMP_RIGHT_6 === "NA" ? undefined : obj[0].CC_TYMP_RIGHT_6;

        this.objCCaudiometry.CC_TYMP_LEFT_1 = obj[0].CC_TYMP_LEFT_1;
        this.objCCaudiometry.CC_TYMP_LEFT_2 = obj[0].CC_TYMP_LEFT_2;
        this.objCCaudiometry.CC_TYMP_LEFT_3 = obj[0].CC_TYMP_LEFT_3;
        this.objCCaudiometry.CC_TYMP_LEFT_4 = obj[0].CC_TYMP_LEFT_4;
        this.objCCaudiometry.CC_TYMP_LEFT_5 = obj[0].CC_TYMP_LEFT_5;
        this.objCCaudiometry.CC_TYMP_RIGHT_6 =
          obj[0].CC_TYMP_LEFT_6 === "NA" ? undefined : obj[0].CC_TYMP_LEFT_6;

        this.objCCaudiometry.CC_DISC_LEFT_1 = obj[0].CC_DISC_LEFT_1;
        this.objCCaudiometry.CC_DISC_LEFT_2 = obj[0].CC_DISC_LEFT_2;
        this.objCCaudiometry.CC_DISC_LEFT_3 = obj[0].CC_DISC_LEFT_3;
        this.objCCaudiometry.CC_DISC_RIGHT_1 = obj[0].CC_DISC_RIGHT_1;
        this.objCCaudiometry.CC_DISC_RIGHT_2 = obj[0].CC_DISC_RIGHT_2;
        this.objCCaudiometry.CC_DISC_RIGHT_3 = obj[0].CC_DISC_RIGHT_3;

        this.objCCaudiometry.CC_IMP_LEFT_1 = obj[0].CC_IMP_LEFT_1;
        this.objCCaudiometry.CC_IMP_LEFT_2 = obj[0].CC_IMP_LEFT_2;
        this.objCCaudiometry.CC_IMP_LEFT_3 = obj[0].CC_IMP_LEFT_3;
        this.objCCaudiometry.CC_IMP_RIGHT_1 = obj[0].CC_IMP_RIGHT_1;
        this.objCCaudiometry.CC_IMP_RIGHT_2 = obj[0].CC_IMP_RIGHT_2;
        this.objCCaudiometry.CC_IMP_RIGHT_3 = obj[0].CC_IMP_RIGHT_3;

        this.CC_TYMP_Text_1 = obj[0].CC_TYMP_Text_1;
        this.CC_TYMP_Text_2 = obj[0].CC_TYMP_Text_2;
        this.CC_TYMP_Text_3 = obj[0].CC_TYMP_Text_3;
        this.CC_TYMP_Text_4 = obj[0].CC_TYMP_Text_4;
        this.CC_TYMP_Text_5 = obj[0].CC_TYMP_Text_5;

        this.objCCaudiometry.CC_TYMP_Text_6 = obj[0].CC_TYMP_Text_6;
        this.disableBoth = obj[0].CC_TYMP_Text_6 === "NA" ? true : false;

        this.objCCaudiometry.CC_ART = obj[0].CC_ART;
        this.objCCaudiometry.REMARKS = obj[0].REMARKS;

        this.objCCaudiometry.Saving_DateTime = obj[0].Saving_DateTime;
        this.objCCaudiometry.Status = obj[0].Status;
        this.objCCaudiometry.Status_Test_Done = obj[0].Status_Test_Done;

        this.check = obj[0].TYMP_REP === "Y" ? true : false;

        this.CC_PT_LEFT_1 = obj[0].CC_PT_LEFT_1;
        this.CC_PT_LEFT_2 = obj[0].CC_PT_LEFT_2;
        this.CC_PT_RIGHT_1 = obj[0].CC_PT_RIGHT_1;
        this.CC_PT_RIGHT_2 = obj[0].CC_PT_RIGHT_2;

        this.CC_DISC_LEFT_1 = obj[0].CC_DISC_LEFT_1;
        this.CC_DISC_LEFT_2 = obj[0].CC_DISC_LEFT_2;
        this.CC_DISC_LEFT_3 = obj[0].CC_DISC_LEFT_3;
        this.CC_DISC_RIGHT_1 = obj[0].CC_DISC_RIGHT_1;
        this.CC_DISC_RIGHT_2 = obj[0].CC_DISC_RIGHT_2;
        this.CC_DISC_RIGHT_3 = obj[0].CC_DISC_RIGHT_3;

        this.CC_IMP_LEFT_1 = obj[0].CC_IMP_LEFT_1;
        this.CC_IMP_LEFT_2 = obj[0].CC_IMP_LEFT_2;
        this.CC_IMP_LEFT_3 = obj[0].CC_IMP_LEFT_3;
        this.CC_IMP_RIGHT_1 = obj[0].CC_IMP_RIGHT_1;
        this.CC_IMP_RIGHT_2 = obj[0].CC_IMP_RIGHT_2;
        this.CC_IMP_RIGHT_3 = obj[0].CC_IMP_RIGHT_3;
      });
  };
  CCSahaAudiometryTab = function(obj) {
    this.enablePrint = false;
    this.clearCCSahaAudiometry();
    this.CCSahaAudiometryTabDisabled = false;
    this.getEditAllDetails(obj.Foot_Fall_ID);
    this.createButton = true;
    this.objCCaudiometry.Appo_ID = obj.Appo_ID;
    this.objCCaudiometry.CC_TYMP_Text_6 = "Tympanogram Width (daPa)";
  };
  convertJsonString = function(obj) {
    for (const key in obj) {
      if (obj[key] === 0) {
      } else if (obj[key]) {
      }
      //   else if (ctrl.objSupportContract[key] == false) { }
      else {
        obj[key] = null;
      }
    }
    return JSON.stringify([obj]);
  };
  CCSahaAudiometrySave = function(valid) {
    this.registrationSubmitted5 = true;
    if (valid) {
      $("#load").button("loading");
      this.objCCaudiometry.TYMP_REP = this.check ? "Y" : "N";
      this.objCCaudiometry.CC_TYMP_Text_1 = this.CC_TYMP_Text_1;
      this.objCCaudiometry.CC_TYMP_Text_2 = this.CC_TYMP_Text_2;
      this.objCCaudiometry.CC_TYMP_Text_3 = this.CC_TYMP_Text_3;
      this.objCCaudiometry.CC_TYMP_Text_4 = this.CC_TYMP_Text_4;
      this.objCCaudiometry.CC_TYMP_Text_5 = this.CC_TYMP_Text_5;

      this.objCCaudiometry.Saving_DateTime = this.DateService.dateTimeConvert(
        new Date()
      );
      this.objCCaudiometry.Appo_ID = this.AppoID;
      const tempObj = this.convertJsonString(this.objCCaudiometry);
      this.$http
        .post(this.url.apiCreateCCSahaAudiometry, {
          Txn_Audiometry_CCsaha_String: tempObj
        })
        .subscribe((data: any) => {
          if (data.success === true) {
            console.group("Compacct V2");
            console.log("%c CC SAHA Audiometry:", "color:green;");
            console.log(this.url.apiCreateCCSahaAudiometry);
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Success Message",
              detail: "Succesfully Updated"
            });
            this.setPrintEnable(this.objCCaudiometry.Appo_ID);
            this.clearCCSahaAudiometry();
            this.saveSpinner = false;
            $("#load").button("reset");
            this._saveCCsahaAudiometry.emit({ save: "done" });
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
  };

  clearCCSahaAudiometry = function() {
    this.objCCaudiometry = new Audiometry();
    this.check = false;
    this.CC_PT_LEFT_1 = undefined;
    this.CC_PT_LEFT_2 = undefined;
    this.CC_PT_RIGHT_1 = undefined;
    this.CC_PT_RIGHT_2 = undefined;
    this.CC_TYMP_LEFT_1 = undefined;
    this.CC_TYMP_LEFT_2 = undefined;
    this.CC_TYMP_LEFT_3 = undefined;
    this.CC_TYMP_RIGHT_1 = undefined;
    this.CC_TYMP_RIGHT_2 = undefined;
    this.CC_TYMP_RIGHT_3 = undefined;
    this.CC_TYMP_RIGHT_4 = undefined;
    this.CC_TYMP_RIGHT_5 = undefined;

    this.CC_DISC_LEFT_1 = undefined;
    this.CC_DISC_LEFT_2 = undefined;
    this.CC_DISC_LEFT_3 = undefined;
    this.CC_DISC_RIGHT_1 = undefined;
    this.CC_DISC_RIGHT_2 = undefined;
    this.CC_DISC_RIGHT_3 = undefined;

    this.CC_IMP_LEFT_1 = undefined;
    this.CC_IMP_LEFT_2 = undefined;
    this.CC_IMP_LEFT_3 = undefined;
    this.CC_IMP_RIGHT_1 = undefined;
    this.CC_IMP_RIGHT_2 = undefined;
    this.CC_IMP_RIGHT_3 = undefined;

    this.registrationSubmitted5 = false;
  };
  setPrintEnable = function(AppoID) {
    if (AppoID) {
      this.enablePrint = true;
      this.print1CCsaha = function() {
        window.open(
          "Report/Crystal_Files/CRM/Clinic/Audiometry_Report_CC_Saha_P1.aspx?Appo_ID=" +
            AppoID
        );
      };
      this.print2CCsaha = function() {
        window.open(
          "Report/Crystal_Files/CRM/Clinic/Audiometry_Report_CC_Saha_P2.aspx?Appo_ID=" +
            AppoID
        );
      };
    }
  };
  print1Audiometry = function(appoid) {
    if (appoid) {
      window.open(
        "Report/Crystal_Files/CRM/Clinic/Audiometry_Report_CC_Saha_P1.aspx?Appo_ID=" +
          appoid
      );
    }
  };
  print2Audiometry = function(appoid) {
    if (appoid) {
      window.open(
        "Report/Crystal_Files/CRM/Clinic/Audiometry_Report_CC_Saha_P2.aspx?Appo_ID=" +
          appoid
      );
    }
  };
}
class Audiometry {
  Appo_ID: string;
  CC_C_O: string;
  CC_H_O: string;
  CC_PT_LEFT_1: string;
  CC_PT_LEFT_2: string;
  CC_PT_RIGHT_1: string;
  CC_PT_RIGHT_2: string;
  CC_TYMP_Text_1: string;
  CC_TYMP_Text_2: string;
  CC_TYMP_Text_3: string;
  CC_TYMP_Text_4: string;
  CC_TYMP_Text_5: string;
  CC_TYMP_Text_6: string;
  CC_TYMP_LEFT_1: string;
  CC_TYMP_LEFT_2: string;
  CC_TYMP_LEFT_3: string;
  CC_TYMP_LEFT_4: string;
  CC_TYMP_LEFT_5: string;
  CC_TYMP_LEFT_6: string;
  CC_TYMP_RIGHT_1: string;
  CC_TYMP_RIGHT_2: string;
  CC_TYMP_RIGHT_3: string;
  CC_TYMP_RIGHT_4: string;
  CC_TYMP_RIGHT_5: string;
  CC_TYMP_RIGHT_6: string;
  CC_ART: string;
  CC_DISC_LEFT_1: string;
  CC_DISC_LEFT_2: string;
  CC_DISC_LEFT_3: string;
  CC_DISC_RIGHT_1: string;
  CC_DISC_RIGHT_2: string;
  CC_DISC_RIGHT_3: string;
  CC_IMP_LEFT_1: string;
  CC_IMP_LEFT_2: string;
  CC_IMP_LEFT_3: string;
  CC_IMP_RIGHT_1: string;
  CC_IMP_RIGHT_2: string;
  CC_IMP_RIGHT_3: string;
  REMARKS: string;
  TYMP_REP = "N";
  Status_Test_Done = "Test Done";
  Status = "Consultancy Done";
  Saving_DateTime: string;
  CC_Main_Remarks: string;
}
