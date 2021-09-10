import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../../../../shared/compacct.services/common.api.service";
import { MessageService } from "primeng/api";
declare var $: any;
import * as moment from "moment";

@Component({
  selector: "app-compacct-aura-ad",
  templateUrl: "./compacct.aura.ad.component.html",
  styleUrls: ["./compacct.aura.ad.component.css"],
  providers: [MessageService]
})
export class CompacctAuraAdComponent implements OnInit {
  buttonname = "Create";
  url = window["config"];
  saveSpinner = false;
  check: boolean;

  objAuraAudiometry = new Audiometry();
  registrationSubmitted6 = false;
  @Input() Footfall: number;
  @Input() AppoID: number;
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService
  ) {}

  ngOnInit() {}
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
  AuraAudiometryPrint = function(appID) {
    if (appID) {
      window.open(
        "/Hearing_Audiometry_Print_Aura?Appo_ID=" + appID + "&print=" + true,
        "mywindow",
        "fullscreen=yes, scrollbars=auto,width=450,height=500"
      );
    }
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
  AuraAudiometrySave = function(valid) {
    this.registrationSubmitted6 = true;
    if (valid) {
      $("#load").button("loading");
      this.objAuraAudiometry.Saving_DateTime = this.DateService.dateConvert(
        new Date()
      );
      this.objAuraAudiometry.Appo_ID = this.AppoID;
      const tempObj = this.convertJsonString(this.objAuraAudiometry);
      this.$http
        .post(this.url.apiCreateCCSahaAudiometry, {
          Txn_Audiometry_Aura_String: tempObj
        })
        .subscribe((data: any) => {
          if (data.success === true) {
            console.group("Compacct V2");
            console.log("%c CC SAHA Audiometry:", "color:green;");
            console.log(this.url.apiCreateAuraAudiometry);
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Success Message",
              detail: "Succesfully Updated"
            });
            window.open(
              "/Hearing_Audiometry_Print_Aura?Appo_ID=" +
                this.objAuraAudiometry.Appo_ID,
              "mywindow",
              "fullscreen=yes, scrollbars=auto,width=450,height=500"
            );
            this.clearAuraAudiometry();
            this.saveSpinner = false;
            $("#load").button("reset");
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

  clearAuraAudiometry = function() {
    this.objAuraAudiometry = new Audiometry();
    this.registrationSubmitted6 = false;
  };
}
class Audiometry {
  Appo_ID: number;
  Aura_PTA_Right: string;
  Aura_PTA_Left: string;
  Aura_APTA_Right: string;
  Aura_APTA_Left: string;
  Aura_WEBER_Right: string;
  Aura_WEBER_Left: string;
  Aura_RINNE_Right: string;
  Aura_RINNE_Left: string;
  Aura_SDS_Right: string;
  Aura_SDS_Left: string;
  Aura_SRT_Right: string;
  Aura_SRT_Left: string;
  Aura_Provisional_Diagnosis_Right: string;
  Aura_Provisional_Diagnosis_Left: string;
  Aura_Recommendations: string;
  Saving_DateTime: string;
  Status_Test_Done: string;
  Status = "Consultancy Done";
}
