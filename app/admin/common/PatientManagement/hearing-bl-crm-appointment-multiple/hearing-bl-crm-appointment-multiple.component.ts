import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-hearing-bl-crm-appointment-multiple',
  templateUrl: './hearing-bl-crm-appointment-multiple.component.html',
  styleUrls: ['./hearing-bl-crm-appointment-multiple.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class HearingBlCrmAppointmentMultipleComponent implements OnInit {

  txnId: any = undefined;
  consultancyType: any = undefined;
  costCenId: any = undefined;
  doctorId: any = undefined;

  patientInfo: any = {
    Contact_Name: undefined,
    Booking_Date: undefined,
    Package_Name: undefined,
    Sale_Bill_No: undefined,
    Foot_Fall_ID: undefined,
    Package_ID: undefined
  };

  sessionDetails: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.txnId = params['txn'];
      this.consultancyType = params['Consultancy_Type'];
      this.costCenId = params['Cost_Cen_ID'];
      this.doctorId = params['Doctor_ID'];
      if (this.txnId) {
        this.getPatientAndSessionDetails();
      }
    });
  }

  getPatientAndSessionDetails() {
    const obj = {
      "SP_String": "SP_BL_CRM_Package_Appointment",
      "Report_Name_String": "Get_patient_and_session_details",
      "Json_Param_String": JSON.stringify([{ txn_id: this.txnId }])
    };

    this.GlobalAPI.getData(obj).subscribe((data: any[]) => {
      if (data && data.length) {
        const row = data[0];
        this.patientInfo.Contact_Name = row.Contact_Name;
        this.patientInfo.Booking_Date = row.Booking_Date
          ? new Date(row.Booking_Date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : undefined;
        this.patientInfo.Package_Name = row.Package_Name;
        this.patientInfo.Sale_Bill_No = row.Sale_Bill_No;
        this.patientInfo.Foot_Fall_ID = row.Foot_Fall_ID;
        this.patientInfo.Package_ID = row.Package_ID;

        if (row.Session_Details) {
          const sessions = JSON.parse(row.Session_Details);
          this.sessionDetails = sessions.map((s: any) => ({
            ...s,
            Appointment_Date: new Date()
          }));
        }
      }
    });
  }

  saveAppointments() {
    const sessions = this.sessionDetails.map((s: any) => {
      const appo = new Date(s.Appointment_Date);
      const appoEnd = new Date(appo.getTime() + s.Session_Duration_Mins * 60000);
      return {
        Cons_Sub_ID: s.Session_ID,
        Appo_Dt: this.DateService.dateConvert(appo) + ' ' + this.DateService.getTime24Hours(appo) + ':00',
        Appo_End_Dt: this.DateService.dateConvert(appoEnd) + ' ' + this.DateService.getTime24Hours(appoEnd) + ':00'
      };
    });

    const jsonParam = {
      Foot_Fall_ID: this.patientInfo.Foot_Fall_ID,
      Cost_Cen_ID: this.costCenId,
      Consultancy_Type: this.consultancyType,
      User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
      Package_Selection_ID: this.patientInfo.Package_ID,
      Sessions: sessions
    };

    const obj = {
      "SP_String": "SP_BL_CRM_Appointment_Multiple",
      "Report_Name_String": "Create_CRM_Appointment_Multi_Session",
      "Json_Param_String": JSON.stringify(jsonParam)
    };

    this.ngxService.start();
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.ngxService.stop();
      if (data[0].Column1 === 'Saved Successfully') {
        this.compacctToast.add({
          key: 'compacct-toast',
          severity: 'success',
          summary: 'Success',
          detail: 'Appointments saved successfully'
        });
      } else {
        this.compacctToast.add({
          key: 'compacct-toast',
          severity: 'error',
          summary: 'Error',
          detail: data[0].Column1
        });
      }
    }, () => {
      this.ngxService.stop();
      this.compacctToast.add({
        key: 'compacct-toast',
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong'
      });
    });
  }

}
