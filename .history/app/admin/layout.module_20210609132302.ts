import { NgModule, ErrorHandler } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppLayoutComponent } from "./layout.component";
import { LeftSidebarComponent } from "./shared/compacct.components/compacct.layout/leftsidebar.component";
import { HeaderComponent } from "./shared/compacct.components/compacct.layout/header.component";
import { FooterComponent } from "./shared/compacct.components/compacct.layout/footer.component";
import { RightsidebarComponent } from "./shared/compacct.components/compacct.layout/rightsidebar.component";
import { LayoutRouteModule } from "./layout.routing";

// DIRECTIVE
import { CompacctDigitonlyDirective } from "./shared/compacct.directives/compacct.digitonly.directive";
import { CompacctGooglePlacesDirective } from "./shared/compacct.directives/compacct.place.directive";

//  RESULE COMPONENTS
import { CompacctDaterangepickerComponent } from "./shared/compacct.components/compacct-daterangepicker/compacct-daterangepicker.component";
import { CompacctCostcenterComponent } from "./shared/compacct.components/compacct.forms/compacct.costcenter/compacct.costcenter.component";
import { CompacctVendorComponent } from "./shared/compacct.components/compacct.forms/compacct.vendor/compacct.vendor.component";
import { CompacctCustomerComponent } from "./shared/compacct.components/compacct.forms/compacct.customer/compacct.customer.component";
import { RoyaleTaskComponent } from "./shared/compacct.components/compacct-royale/royale-task/royale-task.component";
//  MODULE COMPONENTS
import { CompacctBnbLeadComponent } from "./common/CRM/Transaction/compacct.bnb.lead/compacct.bnb.lead.component";

import { StocktransferComponent } from "./common/MaterialManagement/Transaction/compacct.stocktransfer/compacct.stocktransfer.component";
// tslint:disable-next-line:max-line-length
import { CompacctPurchasebillGstComponent } from "./common/FinancialManagement/Transaction/Purchase/compacct.purchasebill-gst/compacct.purchasebill-gst.component";
// tslint:disable-next-line:max-line-length
import { CompacctDebitComponent } from "./common/FinancialManagement/Transaction/Purchase/compacct.purchasebill-gst/compacct.debit/compacct.debit.component";
// tslint:disable-next-line:max-line-length
import { CompacctBillQcComponent } from "./common/FinancialManagement/Transaction/Purchase/compacct.purchasebill-gst/compacct.bill.qc/compacct.bill.qc.component";
import { MasterCostCenterComponent } from "./common/MaterialManagement/Master/master.cost-center/master.cost-center.component";
// tslint:disable-next-line:max-line-length
import { MasterCostCenterGodownComponent } from "./common/MaterialManagement/Master/master.cost-center-godown/master.cost-center-godown.component";
import { SeedProcessComponent } from "./common/ProductionManagement/Transaction/seed-process/seed-process.component";
import { PpBagProcessComponent } from "./common/ProductionManagement/Transaction/pp-bag-process/pp-bag-process.component";
import { CommercialInvoiceComponent } from "./common/Export/Doc/commercial-invoice/commercial-invoice.component";
import { CurrencyBookingComponent } from "./common/Export/Doc/currency-booking/currency-booking.component";
import { ContainerBookingComponent } from "./common/Export/container-booking/container-booking.component";
import { MachineUsesComponent } from "./common/ProductionManagement/Transaction/machine-uses/machine-uses.component";
import { StockTransferTankComponent } from "./common/MaterialManagement/Transaction/stock-transfer-tank/stock-transfer-tank.component";
import { RenewalComponent } from "./common/Renewal/renewal/renewal.component";
import { RenewalTypeComponent } from "./common/Renewal/renewal-type/renewal-type.component";
// PRIME COMPONENTS
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { MenuModule } from "primeng/menu";
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { FileUploadModule } from "primeng/fileupload";
import { RadioButtonModule, InputMaskModule } from "primeng/primeng";
import { EditorModule } from "primeng/editor";
import { CalendarModule } from "primeng/calendar";
import { AccordionModule } from 'primeng/accordion';
import {ProgressBarModule} from 'primeng/progressbar';
import {FieldsetModule} from 'primeng/fieldset';
import {TreeModule} from 'primeng/tree';
// SPINNER
import { NgxUiLoaderModule } from "ngx-ui-loader";
// SYN
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { PivotFieldListAllModule } from '@syncfusion/ej2-angular-pivotview';
import { PivotViewAllModule } from '@syncfusion/ej2-angular-pivotview';
// DateRange
import { DateRangePickerModule } from "@syncfusion/ej2-angular-calendars";
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
// DATE TIME

import { OwlDateTimeModule, OwlNativeDateTimeModule ,OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

// SERVICE
import { CookieService } from "ngx-cookie-service";
import { CompacctCommonApi } from "./shared/compacct.services/common.api.service";
import { CompacctHeader } from "./shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "./shared/compacct.global/dateTime.service";
import { CompacctGlobalUrlService } from "./shared/compacct.global/global.service.service";
import { MasterProductComponent } from "./common/MaterialManagement/Master/master.product/master.product.component";
import { SafeHtmlPipe } from "./shared/compacct.pipes/compacct.safeHtml/safe-html.pipe";
import { CompacctAccountJournal } from "./shared/compacct.services/compacct.mainstreamApi/cmpacct.account-journal";
import { OilProductionComponent } from "./common/ProductionManagement/Transaction/oil-production/oil-production.component";
import { SharedModule } from "./shared/compacct.shared.module";
import { CompacctBnbexportsComponent } from "./common/Export/compacct.bnbexports/compacct.bnbexports.component";
import { SalesContractComponent } from "./common/Export/Doc/sales-contract/sales-contract.component";
import { TransportationComponent } from "./common/Export/transportation/transportation.component";
import { CompacctBnbLeadbydateComponent } from "./common/CRM/Transaction/compacct.bnb.leadbydate/compacct.bnb.leadbydate.component";
import { CompacctAudiogramComponent } from "./common/PatientManagement/Audiologist/compacct.Audiogram/compacct.audiogram.component";
import { CompacctHearingThresholdChartComponent } from "./shared/compacct.components/compacct.hearing.threshold-chart/compacct.hearing.threshold-chart.component";
import { CompacctGrnComponent } from "./common/FinancialManagement/Transaction/Purchase/compacct.purchasebill-gst/compacct.grn/compacct.grn.component";
import { from } from "rxjs";
import { CompacctCcshahaAdComponent } from "./common/PatientManagement/Audiologist/compacct.Audiogram/compacct.audiogramData/compacct.ccshaha.ad/compacct.ccshaha.ad.component";
import { CompacctAuraAdComponent } from "./common/PatientManagement/Audiologist/compacct.Audiogram/compacct.audiogramData/compacct.aura.ad/compacct.aura.ad.component";
import { MasterProductHearingComponent } from "./common/MaterialManagement/Master/master-product-hearing/master-product-hearing.component";
import { ConsultancyComponent } from "./common/PatientManagement/Master/consultancy/consultancy.component";
import { CompacctLedgerComponent } from './common/FinancialManagement/Master/compacct-ledger/compacct-ledger.component';
import { MasterRoyaleMaterialTypeComponent } from './common/MaterialManagement/Master/master-royale-material-type/master-royale-material-type.component';
import { CompacctRoyaleLeadComponent } from './common/CRM/Transaction/compacct-royale-lead/compacct-royale-lead.component';
import { CompacctDocumentComponent } from './shared/compacct.components/compacct-document/compacct-document.component';
import { ServiceComponent } from "./common/SalesAndDistribution/Transaction/service/service.component";
import { NewHaRicComponent } from "./common/SalesAndDistribution/Transaction/new-ha-ric/new-ha-ric.component";
import { NewHaCustomComponent } from "./common/SalesAndDistribution/Transaction/new-ha-custom/new-ha-custom.component";
import { NewHAComponent } from "./common/SalesAndDistribution/Transaction/new-ha/new-ha.component";
import { InwardOutwardRegisterComponent } from "./common/SalesAndDistribution/Transaction/inward-outward-register/inward-outward-register.component";
import { EarMouldComponent } from "./common/SalesAndDistribution/Transaction/ear-mould/ear-mould.component";
import { ConsultancyCommissionComponent} from './common/PatientManagement/Master/consultancy-commission/consultancy-commission.component';
import { DoctorCommissionCalculatorComponent} from './common/PatientManagement/Master/doctor-commission-calculator/doctor-commission-calculator.component';
import { AdjustmentVoucherComponent} from './common/PatientManagement/Transaction/adjustment-voucher/adjustment-voucher.component';
import { InwardReplacementComponent} from './common/MaterialManagement/Inward/inward-replacement/inward-replacement.component';
import { ClinicTrialComponent } from './common/PatientManagement/Transaction/clinic-trial/clinic-trial.component';
import { CustomerSalesComponent } from './common/CRM/Report/customer-sales/customer-sales.component';
import { CompacctStockReportComponent } from './common/MaterialManagement/Report/compacct-stock-report/compacct-stock-report.component';
import { TutoPendsubscriptionComponent } from './common/CRM/Transaction/tuto.pendsubscription/tuto.pendsubscription.component';
import { TutoWslkinleadComponent } from "./common/CRM/Transaction/tuto.wslkinlead/tuto.wslkinlead.component";
import { CompacctGlobalApiService } from "./shared/compacct.services/compacct.global.api.service";
import { TutoReceiveVoucherComponent } from './common/FinancialManagement/Transaction/tuto-receive-voucher/tuto-receive-voucher.component';
import { BulkSmsNepalComponent } from './common/CRM/Report/bulk-sms-nepal/bulk-sms-nepal.component';
import { TutoMasterTeacherComponent } from './common/CRM/Master/tuto-master-teacher/tuto-master-teacher.component';
import { TutoMastereQNAComponent } from "./common/CRM/Master/tuto-mastere-qna/tuto-mastere-qna.component";
import { TutoSupportQueryComponent } from './common/CRM/Master/tuto-support-query/tuto-support-query.component';
import { TutoStudentSearchComponent } from './common/CRM/Master/tuto-student-search/tuto-student-search.component';
import { TutoLeadFollowupComponent } from './common/CRM/Transaction/tuto-lead-followup/tuto-lead-followup.component';
import { TutoMasterSkuComponent } from './common/CRM/Master/tuto-master-sku/tuto-master-sku.component';
import { TutoClassManagementComponent } from './common/CRM/Master/tuto-class-management/tuto-class-management.component';
import { K4cOutletRequistionComponent } from './common/OutletManagement/k4c-outlet-requistion/k4c-outlet-requistion.component';
import { K4cMasterCostCenterComponent } from './common/MaterialManagement/Master/k4c-master-cost-center/k4c-master-cost-center.component';
import { K4cMasterProductComponent } from './common/MaterialManagement/Master/k4c-master-product/k4c-master-product.component';
import { MasterUomComponent } from "./common/MaterialManagement/Master/master-uom/master-uom.component";
import { K4CProductionVoucherComponent } from "./common/MaterialManagement/Production/k4-c-production-voucher/k4-c-production-voucher.component";
import { K4cOutletSaleBillComponent } from './common/OutletManagement/k4c-outlet-sale-bill/k4c-outlet-sale-bill.component';
import { K4CDispatchToOutletComponent } from './common/MaterialManagement/Outward/Distribution Challan/k4-c-dispatch-to-outlet/k4-c-dispatch-to-outlet.component';
import { K4cOutletAdvanceOrderComponent } from './common/OutletManagement/k4c-outlet-advance-order/k4c-outlet-advance-order.component';
import { K4cPosBillOrderComponent } from './common/OutletManagement/k4c-pos-bill-order/k4c-pos-bill-order.component';
import { TutoOrderManagementComponent } from "./common/CRM/Transaction/tuto-order-management/tuto-order-management.component";
import { TutoOrderBookingComponent } from './common/CRM/Transaction/tuto-order-booking/tuto-order-booking.component';
import { TutoOrderPaymentComponent } from './common/CRM/Transaction/tuto-order-payment/tuto-order-payment.component';
import { TutoAccCashBankConfirmComponent } from './common/FinancialManagement/Transaction/tuto-acc-cash-bank-confirm/tuto-acc-cash-bank-confirm.component';
import { TutoCashConfirmComponent } from "./common/CRM/Transaction/tuto-cash-confirm/tuto-cash-confirm.component";
import { TutoLoanConfirmationComponent } from "./common/CRM/Transaction/tuto-loan-confirmation/tuto-loan-confirmation.component";
import { TutoLoamEmiTransferComponent } from './common/FinancialManagement/Transaction/tuto-loam-emi-transfer/tuto-loam-emi-transfer.component';

@NgModule({
  declarations: [
    AppLayoutComponent,
    LeftSidebarComponent,
    HeaderComponent,
    FooterComponent,
    RightsidebarComponent,
    StocktransferComponent,
    CompacctDaterangepickerComponent,
    MasterProductComponent,
    SafeHtmlPipe,
    CompacctPurchasebillGstComponent,
    CompacctGrnComponent,
    CompacctDebitComponent,
    CompacctCostcenterComponent,
    CompacctVendorComponent,
    CompacctCustomerComponent,
    SeedProcessComponent,
    PpBagProcessComponent,
    MasterCostCenterComponent,
    MasterCostCenterGodownComponent,
    CompacctBillQcComponent,
    OilProductionComponent,
    CompacctBnbLeadComponent,
    CommercialInvoiceComponent,
    CurrencyBookingComponent,
    CompacctBnbexportsComponent,
    TransportationComponent,
    SalesContractComponent,
    CompacctBnbLeadbydateComponent,
    ContainerBookingComponent,
    CompacctAudiogramComponent,
    CompacctHearingThresholdChartComponent,
    StockTransferTankComponent,
    MachineUsesComponent,
    CompacctCcshahaAdComponent,
    CompacctAuraAdComponent,
    MasterProductHearingComponent,
    RenewalComponent,
    RenewalTypeComponent,
    ConsultancyComponent,
    CompacctLedgerComponent,
    MasterRoyaleMaterialTypeComponent,
    RoyaleTaskComponent,
    CompacctRoyaleLeadComponent,
    CompacctDocumentComponent,
    EarMouldComponent,
    InwardOutwardRegisterComponent,
    NewHAComponent,
    NewHaCustomComponent,
    NewHaRicComponent,
    ServiceComponent,
    ConsultancyCommissionComponent,
    AdjustmentVoucherComponent,
    DoctorCommissionCalculatorComponent,
    InwardReplacementComponent,
    ClinicTrialComponent,
    CustomerSalesComponent,
    CompacctStockReportComponent,
    TutoPendsubscriptionComponent,
    TutoWslkinleadComponent,
    TutoReceiveVoucherComponent,
    BulkSmsNepalComponent,
    TutoMasterTeacherComponent,
    TutoMastereQNAComponent,
    TutoSupportQueryComponent,
    TutoStudentSearchComponent,
    TutoLeadFollowupComponent,
    TutoMasterSkuComponent,
    TutoClassManagementComponent,
    K4cOutletRequistionComponent,
    K4cMasterCostCenterComponent,
    K4cMasterProductComponent,
    MasterUomComponent,
    K4CProductionVoucherComponent,
    K4cOutletSaleBillComponent,
    K4CDispatchToOutletComponent,
    K4cOutletAdvanceOrderComponent,
    K4cPosBillOrderComponent,
    TutoOrderManagementComponent,
    TutoOrderBookingComponent,
    TutoOrderPaymentComponent,
    TutoAccCashBankConfirmComponent,
    TutoCashConfirmComponent,
    TutoLoanConfirmationComponent,
    TutoLoamEmiTransferComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    LayoutRouteModule,
    DateRangePickerModule,
    DatePickerModule,
    TimePickerModule,
    TabViewModule,
    TableModule,
    MenuModule,
    HttpClientModule,
    DropdownModule,
    MultiSelectModule,
    ToastModule,
    CheckboxModule,
    AccordionModule,
    ProgressSpinnerModule,
    DialogModule,
    ButtonModule,
    EditorModule,
    RadioButtonModule,
    InputMaskModule,
    FileUploadModule,
    ReactiveFormsModule,
    CalendarModule,
    NgxUiLoaderModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    GridAllModule,
    FieldsetModule,
    PivotViewAllModule,
    PivotFieldListAllModule,
    ProgressBarModule,
    TreeModule,
  ],
  exports: [],
  providers: [
    CompacctGlobalUrlService,
    CookieService,
    CompacctGlobalApiService,
    CompacctCommonApi,
    CompacctHeader,
    CompacctAccountJournal,
    DateTimeConvertService,
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'en-IN'},
  ]
})
export class LayoutModule {}
