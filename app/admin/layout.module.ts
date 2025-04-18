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
import {SelectButtonModule} from 'primeng/selectbutton';
import {TooltipModule} from 'primeng/tooltip';
import {DataViewModule} from 'primeng/dataview';
import {PanelModule} from 'primeng/panel';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {SliderModule} from 'primeng/slider';
// SPINNER
import { NgxUiLoaderModule } from "ngx-ui-loader";
// SYN
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { PivotFieldListAllModule } from '@syncfusion/ej2-angular-pivotview';
import { PivotViewAllModule } from '@syncfusion/ej2-angular-pivotview';
import { DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { GanttAllModule } from '@syncfusion/ej2-angular-gantt';
import { SelectionService } from '@syncfusion/ej2-angular-gantt';
// DateRange
import { DateRangePickerModule } from "@syncfusion/ej2-angular-calendars";
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
// DATE TIME

import { OwlDateTimeModule, OwlNativeDateTimeModule ,OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';


// Nepali Date
import { NpDatepickerModule } from 'angular-nepali-datepicker';
import { DateNepalConvertService } from "./shared/compacct.global/dateNepal.service";

// SERVICE
import { CookieService } from "ngx-cookie-service";
import { CompacctCommonApi } from "./shared/compacct.services/common.api.service";
import { CompacctHeader } from "./shared/compacct.services/common.header.service";
import { CompacctGetDistinctService } from "./shared/compacct.services/compacct-get-distinct.service";
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
import { TutoMasterSalesteamComponent } from './common/CRM/Master/tuto-master-salesteam/tuto-master-salesteam.component';
import { K4cFactoryReturnComponent } from './common/OutletManagement/k4c-factory-return/k4c-factory-return.component';
import { K4cAdvanceProductionComponent } from "./common/MaterialManagement/Production/k4c-advance-production/k4c-advance-production.component";
import { K4CDispatchOutletAdvOrderComponent } from './common/MaterialManagement/Outward/k4-c-dispatch-outlet-adv-order/k4-c-dispatch-outlet-adv-order.component';
import { TutoSupportMasterComponent } from './common/CRM/Master/tuto-support-master/tuto-support-master.component';
import { DiplSupportTicketComponent } from './common/SupportTicketManagement/Transaction/dipl-support-ticket/dipl-support-ticket.component';
import { DiplMasterSalesteamComponent } from './common/CRM/Master/dipl-master-salesteam/dipl-master-salesteam.component';
import { K4cCreateStartProductionComponent } from './common/OutletManagement/k4c-create-start-production/k4c-create-start-production.component';
import { K4cCutoffComponent } from './common/MaterialManagement/Master/k4c-cutoff/k4c-cutoff.component';
import { DIPLSupportCallSheetComponent } from './common/SupportTicketManagement/Transaction/dipl-support-call-sheet/dipl-support-call-sheet.component';
import { K4cFactoryRequisitionComponent } from './common/MaterialManagement/k4c-factory-requisition/k4c-factory-requisition.component';
import { K4cInternalStockTransferComponent } from './common/OutletManagement/k4c-internal-stock-transfer/k4c-internal-stock-transfer.component';
import { K4cDepartmentWiseRequisitionComponent } from './common/MaterialManagement/k4c-department-wise-requisition/k4c-department-wise-requisition.component';
import { ReceiveDistributionChallanComponent } from './common/OutletManagement/receive-distribution-challan/receive-distribution-challan.component';
import { TutoDirectSaleCallTrackComponent } from './common/CRM/Transaction/tuto-direct-sale-call-track/tuto-direct-sale-call-track.component';
import { K4cDistributionChallanStatusComponent } from './common/MaterialManagement/Outward/k4c-distribution-challan-status/k4c-distribution-challan-status.component';
import { TutoOrderBillBrowseComponent } from './common/CRM/Transaction/tuto-order-bill-browse/tuto-order-bill-browse.component';
import { OutletStockTransferComponent } from './common/OutletManagement/outlet-stock-transfer/outlet-stock-transfer.component';
import { CRMPaymentBankComponent } from "./common/CRM/Master/crm-payment-bank/crm-payment-bank.component";
import { TutoSupportUserManagementComponent } from './common/SupportTicketManagement/Master/tuto-support-user-management/tuto-support-user-management.component';
import { OutletStockMovementComponent } from './common/OutletManagement/outlet-stock-movement/outlet-stock-movement.component';
import { K4cProductionVoucherNewComponent } from './common/MaterialManagement/Production/k4c-production-voucher-new/k4c-production-voucher-new.component';
import { K4cInternalStockTransferNewComponent } from './common/OutletManagement/k4c-internal-stock-transfer-new/k4c-internal-stock-transfer-new.component';
import { TutoDsBillComponent } from './common/FinancialManagement/Transaction/tuto-ds-bill/tuto-ds-bill.component';
import { TutoPaymentLinkComponent } from './common/FinancialManagement/Transaction/tuto-payment-link/tuto-payment-link.component';
import { K4cMasterBOMReciepeComponent } from './common/MaterialManagement/Production/k4c-master-bom-reciepe/k4c-master-bom-reciepe.component';
import { IssueStockAdjustmentComponent } from './common/OutletManagement/issue-stock-adjustment/issue-stock-adjustment.component';
import { ReceiveStockAdjustmentComponent } from './common/OutletManagement/receive-stock-adjustment/receive-stock-adjustment.component';
import { StoreItemIndentComponent } from './common/OutletManagement/store-item-indent/store-item-indent.component';
import { HearingSpeechAppointmentComponent } from "./common/PatientManagement/hearing-speech-appointment/hearing-speech-appointment.component";
import { OutletTxnBankDepositComponent } from './common/OutletManagement/outlet-txn-bank-deposit/outlet-txn-bank-deposit.component';
import { K4cFactoryIndentAdvanceComponent } from './common/MaterialManagement/k4c-factory-indent-advance/k4c-factory-indent-advance.component';
import { MasterUOMCommonComponent } from "./common/MaterialManagement/Master/master-uom-common/master-uom-common.component";
import { K4cRawMaterialIssueComponent } from './common/MaterialManagement/Production/k4c-raw-material-issue/k4c-raw-material-issue.component';
import { K4cRawMaterialIndentComponent } from './common/MaterialManagement/k4c-raw-material-indent/k4c-raw-material-indent.component';
import { OutletPhysicalClosingStockComponent } from './common/OutletManagement/outlet-physical-closing-stock/outlet-physical-closing-stock.component';
import { K4cRawMaterialStockTransferComponent } from './common/MaterialManagement/k4c-raw-material-stock-transfer/k4c-raw-material-stock-transfer.component';
import { K4cDispatchOutletStoreComponent } from './common/MaterialManagement/Outward/k4c-dispatch-outlet-store/k4c-dispatch-outlet-store.component';
import { K4cPurchasePlaningComponent } from './common/MaterialManagement/k4c-purchase-planing/k4c-purchase-planing.component';
import { K4cOutletStockReportComponent } from './common/OutletManagement/k4c-outlet-stock-report/k4c-outlet-stock-report.component';
import { K4cDayEndProcessComponent } from './common/OutletManagement/k4c-day-end-process/k4c-day-end-process.component';
import { TutoDsDashboardComponent } from './common/CRM/Report/tuto-ds-dashboard/tuto-ds-dashboard.component';
import { UpdateExpiryComponent } from './common/OutletManagement/update-expiry/update-expiry.component';
import { ClosingStockWithExpiryDateComponent } from './common/OutletManagement/closing-stock-with-expiry-date/closing-stock-with-expiry-date.component';
import { TutoSaleTreeFieldComponent } from './common/CRM/Master/tuto-sale-tree-field/tuto-sale-tree-field.component';
import { TutoSalesTreeInsideSalesComponent } from './common/CRM/Master/tuto-sales-tree-inside-sales/tuto-sales-tree-inside-sales.component';
import { TutoCrmLeadFieldSaleComponent } from './common/CRM/Transaction/tuto-crm-lead-field-sale/tuto-crm-lead-field-sale.component';
import { TutoTempCrmLeadComponent } from './common/CRM/Master/tuto-temp-crm-lead/tuto-temp-crm-lead.component';
import { TutoWebDemLeadFollowupComponent } from './common/CRM/Transaction/tuto-web-dem-lead-followup/tuto-web-dem-lead-followup.component';
import { TutoAuditLeadFollowupComponent } from './common/CRM/Transaction/tuto-audit-lead-followup/tuto-audit-lead-followup.component';
import { OutletClosingStockWithBatchComponent } from './common/OutletManagement/outlet-closing-stock-with-batch/outlet-closing-stock-with-batch.component';
import { K4cAdvOrderInternalStockTransferComponent } from './common/MaterialManagement/k4c-adv-order-internal-stock-transfer/k4c-adv-order-internal-stock-transfer.component';
import { TutoPostSaleAuditLeadFollowupComponent } from './common/CRM/Transaction/tuto-post-sale-audit-lead-followup/tuto-post-sale-audit-lead-followup.component';
import { TutoBdaReportComponent } from './common/CRM/Transaction/tuto-bda-report/tuto-bda-report.component';
import { TutoSchoolRequestDetailsComponent } from './common/CRM/Master/tuto-school-request-details/tuto-school-request-details.component';
import { CompacctRunningBillComponent } from "./common/CivilManagement/compacct.running-bill/compacct.running-bill.component";
import { CompacctCivildailyJobComponent } from "./common/CivilManagement/compacct.civildaily-job/compacct.civildaily-job.component";
import { CompacctTenderComponent } from "./common/TenderManagement/compacct.tender/compacct.tender.component";
import { CrmLeadOpportunitiesComponent } from './common/CRM/Transaction/crm-lead-opportunities/crm-lead-opportunities.component';
import { CrmLeadTaskDetailsComponent } from './common/CRM/Transaction/crm-lead-task-details/crm-lead-task-details.component';
import { K4cStockAdjustmentStoreItemsComponent } from './common/MaterialManagement/Production/k4c-stock-adjustment-store-items/k4c-stock-adjustment-store-items.component';
import { TutoWebDemoTeamComponent } from './common/CRM/Transaction/tuto-web-demo-team/tuto-web-demo-team.component';
import { TutoPreSaleAuditTeamComponent } from './common/CRM/Transaction/tuto-pre-sale-audit-team/tuto-pre-sale-audit-team.component';
import { TutoPostSaleAuditTeamComponent } from './common/CRM/Transaction/tuto-post-sale-audit-team/tuto-post-sale-audit-team.component';
import { TutoFieldSalesSchoolComponent } from './common/CRM/Master/tuto-field-sales-school/tuto-field-sales-school.component';
import { HarbaProjectEstimateComponent } from './common/TenderManagement/harba-project-estimate/harba-project-estimate.component';
import { K4cRsnsClosingStockComponent } from './common/MaterialManagement/k4c-rsns-closing-stock/k4c-rsns-closing-stock.component';
import { DirectPaymentFollowupNepalComponent } from './common/CRM/Transaction/direct-payment-followup-nepal/direct-payment-followup-nepal.component';
import { K4cFranchiseSaleBillComponent } from './common/MaterialManagement/k4c-franchise-sale-bill/k4c-franchise-sale-bill.component';
import { TenderEstimateComponent } from './common/TenderManagement/tender-estimate/tender-estimate.component';
import { HearingPackageMasterComponent } from './common/CRM/Master/hearing-package-master/hearing-package-master.component';
import { CompacctTxnTaskComponent } from './common/TenderManagement/compacct-txn-task/compacct-txn-task.component';
import { TutoManualPaymentCollectionComponent } from './common/CRM/Transaction/tuto-manual-payment-collection/tuto-manual-payment-collection.component';
import { OutletSaleBillWithoutBatchSelectComponent } from './common/OutletManagement/outlet-sale-bill-without-batch-select/outlet-sale-bill-without-batch-select.component';
import { OutletStockTransferAutoBatchComponent } from './common/OutletManagement/outlet-stock-transfer-auto-batch/outlet-stock-transfer-auto-batch.component';
import { BillEditFromAdminComponent } from './common/MaterialManagement/bill-edit-from-admin/bill-edit-from-admin.component';
import { TxnEnqTenderHarbauerComponent } from './common/TenderManagement/txn-enq-tender-harbauer/txn-enq-tender-harbauer.component';
// Chips
import {ChipsModule} from 'primeng/chips';
import { TutoUploadDataSupportComponent } from './common/CRM/Master/tuto-upload-data-support/tuto-upload-data-support.component';
import { EnggNepalMachineMasterComponent } from './common/MaterialManagement/Master/engg-nepal-machine-master/engg-nepal-machine-master.component';
import { EnggNepalSparePartsComponent } from './common/MaterialManagement/Master/engg-nepal-spare-parts/engg-nepal-spare-parts.component';
import { TenderBudgetComponent } from './common/TenderManagement/tender-budget/tender-budget.component';
import { TenderHarbauerViewComponent } from './common/TenderManagement/tender-harbauer-view/tender-harbauer-view.component';
import { NepalMasterSubledgerComponent } from './common/FinancialManagement/Master/nepal-master-subledger/nepal-master-subledger.component';
import { HarbauerMasterProductMechanicalComponent } from './common/Harbauer/harbauer-master-product-mechanical/harbauer-master-product-mechanical.component';
import { OutletGroupReportComponent } from './common/OutletManagement/outlet-group-report/outlet-group-report.component';

import { K4cCrateInOuComponent } from './common/MaterialManagement/Outward/k4c-crate-in-ou/k4c-crate-in-ou.component';
import { BlCrmEnggMasterNepalComponent } from './common/MaterialManagement/Master/bl-crm-engg-master-nepal/bl-crm-engg-master-nepal.component';

import { TenderHarbauerActualViewComponent } from './common/TenderManagement/tender-harbauer-actual-view/tender-harbauer-actual-view.component';

import { EnggCrmInstalledMachineComponent } from './common/MaterialManagement/Master/engg-crm-installed-machine/engg-crm-installed-machine.component';
import { EnggCrmInstalledMachineServiceContractComponent } from './common/MaterialManagement/Master/engg-crm-installed-machine-service-contract/engg-crm-installed-machine-service-contract.component';

import { TenderBudgetAprovalComponent } from './common/TenderManagement/tender-budget-aproval/tender-budget-aproval.component';
import { SupportTicketNepalComponent } from './common/MaterialManagement/Master/support-ticket-nepal/support-ticket-nepal.component';
import { StockTransferToStoreComponent } from './common/MaterialManagement/Outward/stock-transfer-to-store/stock-transfer-to-store.component';
import { HarbMasterProductElectricalComponent } from './common/Harbauer/harb-master-product-electrical/harb-master-product-electrical.component';
import { TenderViewDetailsCompComponent } from './common/Harbauer/Components/tender-view-details-comp/tender-view-details-comp.component';
import { TenderSingleSchBudgetComponent } from './common/TenderManagement/tender-single-sch-budget/tender-single-sch-budget.component';
import { TenderMultipleSchBudgetComponent } from './common/TenderManagement/tender-multiple-sch-budget/tender-multiple-sch-budget.component';
import { HarbMasterProductCivilComponent } from './common/Harbauer/harb-master-product-civil/harb-master-product-civil.component';
import { SemiFinishedProductionVoucherComponent } from './common/MaterialManagement/Production/semi-finished-production-voucher/semi-finished-production-voucher.component';
import { SupportTicketPendingCallsNepalComponent } from './common/MaterialManagement/Master/support-ticket-pending-calls-nepal/support-ticket-pending-calls-nepal.component';
import { K4cCreditNoteBrowseComponent } from './common/MaterialManagement/k4c-credit-note-browse/k4c-credit-note-browse.component';
import { TutoSupportCalenderDashboardComponent } from "./common/CRM/Master/tuto-support-calender-dashboard/tuto-support-calender-dashboard.component";
import { NonSaleableClosingStockComponent } from './common/OutletManagement/non-saleable-closing-stock/non-saleable-closing-stock.component';
import { AccOpeningBalcManagementComponent } from './common/OutletManagement/acc-opening-balc-management/acc-opening-balc-management.component';
import { EngineeringQuotationNepalComponent } from './common/Engineering&CRM/Transaction/engineering-quotation-nepal/engineering-quotation-nepal.component';
import { CompacctDocumentVaultComponent } from "./shared/compacct.components/compacct.document.vault/compacct.document.vault.component";
import { GrnViewPurchaseBillComponent } from './common/MaterialManagement/Inward/grn-view-purchase-bill/grn-view-purchase-bill.component';
import {SplitButtonModule} from 'primeng/splitbutton';
import { ProductsPlaningComponent } from './common/TenderManagement/products-planing/products-planing.component';
import { CompacctTxnTaskGanttComponent } from './common/TenderManagement/compacct-txn-task-gantt/compacct-txn-task-gantt.component';
import {UserAbsentComponent} from './common/CRM/Master/user-absent/user-absent.component';
import { TutoBdaJoiningComponent } from './common/CRM/Transaction/tuto-bda-joining/tuto-bda-joining.component';
import { TutoAspUnavaliblityComponent } from './common/CRM/Master/tuto-asp-unavaliblity/tuto-asp-unavaliblity.component'

import { SortService, FilterService, ColumnMenuService  } from '@syncfusion/ej2-angular-gantt';
import { RetailBrowseComponent } from './common/FinancialManagement/Retail/retail-browse/retail-browse.component';
import { RetailBrowseReceiveComponent } from './common/FinancialManagement/Retail/retail-browse-receive/retail-browse-receive.component';
import { RetailBrowseAdvanceComponent } from './common/FinancialManagement/Retail/retail-browse-advance/retail-browse-advance.component';
import { PurchaseOrderComponent } from "./common/MaterialManagement/Inward/purchase-order/purchase-order.component";
import { JournalVoucherComponent } from "./common/FinancialManagement/Transaction/Voucher/journal-voucher/journal-voucher.component";
import { MasterCompanyComponent } from "./common/FinancialManagement/Master/master-company/master-company.component";
import { UserMasterComponent } from "./common/UserManagement/Master/user-master/user-master.component";
import { AttendanceSheetComponent } from './common/Attendance/attendance-sheet/attendance-sheet.component';
import { K4cProductCategoryUpdateComponent } from './common/MaterialManagement/k4c-product-category-update/k4c-product-category-update.component';
import { TutoAspMaxAppoComponent } from "./common/CRM/Master/tuto-asp-max-appo/tuto-asp-max-appo.component";
import { TutoBdaAttendanceComponent } from './common/CRM/Master/tuto-bda-attendance/tuto-bda-attendance.component';
import { HrLeaveOpeningComponent } from './common/MICL/hr-leave-opening/hr-leave-opening.component';
import { TutoBdaWiseTargetComponent } from './common/CRM/Master/tuto-bda-wise-target/tuto-bda-wise-target.component';
import { TutoSalesTreeComponent } from './common/CRM/Master/tuto-sales-tree/tuto-sales-tree.component';
import { GrnComponent } from './common/MICL/grn/grn.component';
import { MiclRequisitionComponent } from './common/MaterialManagement/Outward/micl-requisition/micl-requisition.component';
import { MiclDispatchChallanComponent } from './common/MICL/micl-dispatch-challan/micl-dispatch-challan.component';
import { HrLeaveApplyComponent } from "./common/MICL/hr-leave-apply/hr-leave-apply.component";
import { SubledgerForAccountsComponent } from "./common/FinancialManagement/Master/subledger-for-accounts/subledger-for-accounts.component";
import { MasterProductGeneralConsumablesComponent } from "./common/MICL/master-product-general-consumables/master-product-general-consumables.component";
import { HarbaTaskListComponent } from './common/TenderManagement/harba-task-list/harba-task-list.component';
import { RdbComponent } from "./common/MICL/rdb/rdb.component";
import { PurchaseBillFromGrnComponent } from './common/MICL/purchase-bill-from-grn/purchase-bill-from-grn.component';
import { BdaWiseTargetAchievementComponent } from './common/CRM/Master/bda-wise-target-achievement/bda-wise-target-achievement.component';
// import { TaxCategoryComponent } from './common/Master/Acc/tax-category/tax-category.component';
import { ProductMasterComponent } from "./common/MICL/product-master/product-master.component";
import { CompacctgstandcustomdutyComponent } from './shared/compacct.components/compacct.forms/compacctgstandcustomduty/compacctgstandcustomduty.component';
import { CompacctProductDetailsComponent } from './shared/compacct.components/compacct.forms/compacct-product-details/compacct-product-details.component';
import { CompacctFinancialDetailsComponent } from "./shared/compacct.components/compacct.forms/compacct.financial-details/compacct.financial-details.component";
import { BSHPLAmeyoCustomerComponent } from './common/CRM/BSHPLameyo/bshpl-ameyo-customer/bshpl-ameyo-customer.component';
import { BSHPAmeyoKBComponent } from './common/CRM/BSHPLameyo/bshp-ameyo-kb/bshp-ameyo-kb.component';
import { SubLedgerComponent } from './common/FinancialManagement/Master/sub-ledger/sub-ledger.component';
import { TaxCategoryComponent } from "./common/MICL/tax-category/tax-category.component";
import { CompacctProjectComponent } from './shared/compacct.components/compacct.forms/compacct-project/compacct-project.component';
import { K4cConversionOfProductComponent } from './common/MaterialManagement/Outward/k4c-conversion-of-product/k4c-conversion-of-product.component';
import { PurchaseBillComponent } from './common/FinancialManagement/Transaction/Purchase/purchase-bill/purchase-bill.component';
import { FinancialVoucherComponent } from './common/FinancialManagement/Transaction/Voucher/financial-voucher/financial-voucher.component';
import { WastageComponent } from "./common/MaterialManagement/Outward/wastage/wastage.component";
import { HIPLPaymentRequisitionComponent } from "./common/FinancialManagement/Transaction/Voucher/hipl-payment-requisition/hipl-payment-requisition.component";
import { CCSahaProfundComponent } from "./common/PatientManagement/Transaction/cc-saha-profund/cc-saha-profund.component";
import { REPStockReportComponent } from './common/MaterialManagement/Report/rep-stock-report/rep-stock-report.component';
import { StockReportComponent } from './shared/compacct.components/stock-report/stock-report.component'
import { ContractVoucherV2Component } from "./common/FinancialManagement/Voucher/contract-voucher-v2/contract-voucher-v2.component";
import { IssueChallanComponent } from './common/Harbauer/issue-challan/issue-challan.component';
import { HRTxnSpecialAllowanceDeductionComponent } from "./common/MICL/hr-txn-special-allowance-deduction/hr-txn-special-allowance-deduction.component";
import { ProcessSalaryComponent } from './common/Attendance/process-salary/process-salary.component';
import { LeaveApprovalComponent } from './common/MICL/leave-approval/leave-approval.component';
import { ConsumptionComponent } from "./common/MICL/consumption/consumption.component";
import { DebitNoteWoStockComponent } from './common/FinancialManagement/Transaction/Purchase/debit-note-wo-stock/debit-note-wo-stock.component';
import { FinancialReminderComponent } from "./common/FinancialManagement/Transaction/Voucher/financial-reminder/financial-reminder.component";
import { InflowPlaningComponent } from "./common/Harbauer/inflow-planing/inflow-planing.component";
import { WorkOrderComponent } from './common/MICL/RepairAndMaintenance/work-order/work-order.component';
import { ReturnableGatePassComponent } from "./common/MICL/RepairAndMaintenance/returnable-gate-pass/returnable-gate-pass.component";
import { RepairAndMaintenanceRdbComponent } from './common/MICL/RepairAndMaintenance/repair-and-maintenance-rdb/repair-and-maintenance-rdb.component';
import { K4cProductionClosingStockComponent } from './common/MaterialManagement/Production/k4c-production-closing-stock/k4c-production-closing-stock.component';
import { EmployeeSalaryMasterMiclComponent } from './common/MICL/employee-salary-master-micl/employee-salary-master-micl.component';
import { HrEmployeeSalaryMasterHarbComponent } from './common/Harbauer/hr-employee-salary-master-harb/hr-employee-salary-master-harb.component';
import { RepairAndMantainceGRNComponent } from "./common/MICL/RepairAndMaintenance/repair-and-mantaince-grn/repair-and-mantaince-grn.component";
import { HREmployeeMasterComponent } from "./common/MICL/hr-employee-master/hr-employee-master.component";
import { HarbProjectBillComponent } from './common/Harbauer/harb-project-bill/harb-project-bill.component';
import { NepalSubledgerAliasCategoryComponent } from './common/FinancialManagement/Master/nepal-subledger-alias-category/nepal-subledger-alias-category.component';
import { PatientCouponComponent } from "./common/PatientManagement/Transaction/patient-coupon/patient-coupon.component";
import { HearingCaseHistoryComponent } from "./common/PatientManagement/hearing-case-history/hearing-case-history.component";
import { GoodReceiveDetailsComponent } from './common/MICL/good-receive-details/good-receive-details.component';
import { MasterHolidayComponent } from "./common/MICL/master-holiday/master-holiday.component";
import { MICLDispatchChallanChargeableComponent } from "./common/MICL/micl-dispatch-challan-chargeable/micl-dispatch-challan-chargeable.component";
import { DailyAttendanceSheetComponent } from './common/Attendance/daily-attendance-sheet/daily-attendance-sheet.component';
import { MasterConsultancyV3Component } from "./common/PatientManagement/Master/master-consultancy-v3/master-consultancy-v3.component";
import { MICLJournalVoucherComponent } from "./common/MICL/micl-journal-voucher/micl-journal-voucher.component";
import { POAuthorizationComponent } from "./common/MICL/po-authorization/po-authorization.component";
import { BranchRequisitionComponent } from './common/Patna/branch-requisition/branch-requisition.component';
import { RequisitionAuthorizationComponent } from "./common/MICL/requisition-authorization/requisition-authorization.component";
import { BOMAuthorizationComponent } from "./common/Harbauer/bom-authorization/bom-authorization.component";
import { ProjectPlanApproveComponent } from "./common/Harbauer/project-plan-approve/project-plan-approve.component";
import { POAuthorizationHarbauerComponent } from "./common/Harbauer/po-authorization-harbauer/po-authorization-harbauer.component";
import { HarbProjectDesignApprovalComponent } from './common/Harbauer/harb-project-design-approval/harb-project-design-approval.component';
import { NepalRequisitionFromSalesmanComponent } from './common/MaterialManagement/Outward/nepal-requisition-from-salesman/nepal-requisition-from-salesman.component';
import { NepalPurchaseRequestComponent } from './common/MaterialManagement/Outward/nepal-purchase-request/nepal-purchase-request.component';
import { MeterialInspectionOfRDBComponent } from './common/MICL/meterial-inspection-of-rdb/meterial-inspection-of-rdb.component';
import { BLTxnWorkOrderSaleBillComponent } from "./common/Harbauer/bl-txn-work-order-sale-bill/bl-txn-work-order-sale-bill.component";
import { HREventUploadComponent } from './common/Attendance/hr-event-upload/hr-event-upload.component';
import { MasterSubContractorComponent } from './common/MICL/SubContractor/master-sub-contractor/master-sub-contractor.component';
import { SubContractorEmployeeMasterComponent } from './common/MICL/SubContractor/sub-contractor-employee-master/sub-contractor-employee-master.component';
import { SubContractorAttendanceComponent } from './common/MICL/SubContractor/sub-contractor-attendance/sub-contractor-attendance.component';
import { NonReturnableGatePassComponent } from "./common/MICL/non-returnable-gate-pass/non-returnable-gate-pass.component";
import { MiclRawMaterialComponent } from './common/ProductionManagement/Master/micl-raw-material/micl-raw-material.component';
import { NepalPurchaseRequestVendorSelectionComponent } from './common/Procurement/nepal-purchase-request-vendor-selection/nepal-purchase-request-vendor-selection.component';
import { NepalPurchaseRequestNegotiatePriceComponent } from './common/Procurement/nepal-purchase-request-negotiate-price/nepal-purchase-request-negotiate-price.component';
import { MICLMasterConsumbleComponent } from './common/ProductionManagement/Master/micl-master-consumble/micl-master-consumble.component';
import { MICLCostCenterMasterComponent } from './common/MICL/micl-cost-center-master/micl-cost-center-master.component';
import { JOHEarMoldComponent } from "./common/PatientManagement/joh-ear-mold/joh-ear-mold.component";
import { SubledgerReportForFranchiseComponent } from "./common/FinancialManagement/Master/subledger-report-for-franchise/subledger-report-for-franchise.component";
import { K4CStockDetailsComponent } from './common/FinancialManagement/Master/k4-c-stock-details/k4-c-stock-details.component';
import { RawMaterialReceiveComponent } from './common/ProductionManagement/Master/raw-material-receive/raw-material-receive.component';
import { PurchaseOrderRawMaterialComponent } from "./common/ProductionManagement/Master/purchase-order-raw-material/purchase-order-raw-material.component";
import { RawMaterialRequisitionComponent } from './common/MICL/RawMaterial/raw-material-requisition/raw-material-requisition.component';
import { MiclRawMaterialIssueComponent } from './common/MICL/RawMaterial/micl-raw-material-issue/micl-raw-material-issue.component';
import { NepalBLTxnPurchaseOrderComponent } from "./common/Procurement/nepal-bl-txn-purchase-order/nepal-bl-txn-purchase-order.component";
import { JOHRealisticExpectationFormComponent } from "./common/PatientManagement/joh-realistic-expectation-form/joh-realistic-expectation-form.component";
import { FurnaceMisInputComponent } from './common/MICL/RawMaterial/furnace-mis-input/furnace-mis-input.component';
import { MiclRawMaterialIssueNewComponent } from './common/MICL/RawMaterial/micl-raw-material-issue-new/micl-raw-material-issue-new.component';
import { RequisitionForIssueChargeableComponent } from './common/MICL/requisition-for-issue-chargeable/requisition-for-issue-chargeable.component';
import { JohValidationProcessComponent } from "./common/PatientManagement/joh-validation-process/joh-validation-process.component";
import { ReturnMaterialComponent } from './common/MICL/return-material/return-material.component';
import { K4cPremixInventoryComponent } from './common/MaterialManagement/Production/k4c-premix-inventory/k4c-premix-inventory.component';
import { K4cPremixStockTransferComponent } from './common/MaterialManagement/Production/k4c-premix-stock-transfer/k4c-premix-stock-transfer.component';
import { NepalBLTxnPurchaseOrderApproveComponent } from './common/Procurement/nepal-bl-txn-purchase-order-approve/nepal-bl-txn-purchase-order-approve.component';
import { DoctorAppointmentComponent } from './common/PatientManagement/doctor-appointment/doctor-appointment.component';
import { MiclPurchaseBillComponent } from './common/MICL/micl-purchase-bill/micl-purchase-bill.component';
import { DoctorsAppointmentNewABRComponent } from './common/PatientManagement/doctors-appointment-new-abr/doctors-appointment-new-abr.component';
import { K4CBillDateUpdateComponent } from "./common/OutletManagement/k4-c-bill-date-update/k4-c-bill-date-update.component";
import { UpdateConsultancyComponent } from './shared/compacct.components/compacct.forms/update-consultancy/update-consultancy.component';
import { DoctorApptNewImpedanceAudiometryComponent } from "./common/PatientManagement/doctor-appt-new-impedance-audiometry/doctor-appt-new-impedance-audiometry.component";
import { NepalPurchaseOrderStatusMasterComponent } from './common/Procurement/nepal-purchase-order-status-master/nepal-purchase-order-status-master.component';
import { DailyAttendanceForContractorComponent } from './common/Attendance/daily-attendance-for-contractor/daily-attendance-for-contractor.component';
import { NepalPurchaseOrderDocumenMasterComponent } from './common/Procurement/nepal-purchase-order-documen-master/nepal-purchase-order-documen-master.component';
import { RawMaterialStockReportComponent } from './common/MaterialManagement/Report/raw-material-stock-report/raw-material-stock-report.component';
import { BSHPLHfFollowUpComponent } from './common/CRM/BSHPL-FOLLOWUP/bshpl-hf-follow-up/bshpl-hf-follow-up.component';
import { DoctorsAppointmentNewOAEComponent } from "./common/PatientManagement/doctors-appointment-new-oae/doctors-appointment-new-oae.component";
import { DoctorsAppointmentNewSpTestComponent } from "./common/PatientManagement/doctors-appointment-new-sp-test/doctors-appointment-new-sp-test.component";
import { DoctorsAppointmentNewGlycerolTestComponent } from "./common/PatientManagement/doctors-appointment-new-glycerol-test/doctors-appointment-new-glycerol-test.component";
import { AcceptReturnMaterialComponent } from './common/MICL/accept-return-material/accept-return-material.component';
import { EInvoiceConfirmationFormComponent } from './common/OutletManagement/e-invoice-confirmation-form/e-invoice-confirmation-form.component';
import { MiclFinishMasterProductComponent } from './common/ProductionManagement/Master/micl-finish-master-product/micl-finish-master-product.component';
import { DoctorsAppointmentNewTinnitusReportComponent } from "./common/PatientManagement/doctors-appointment-new-tinnitus-report/doctors-appointment-new-tinnitus-report.component";
import { DoctorsAppointmentNewTinnitusTherapyTrackerComponent } from "./common/PatientManagement/doctors-appointment-new-tinnitus-therapy-tracker/doctors-appointment-new-tinnitus-therapy-tracker.component";
import { MiclWastageMasterProductComponent } from './common/ProductionManagement/Master/micl-wastage-master-product/micl-wastage-master-product.component';
import { DoctorsAppointmentNewTinnitusEvaluationComponent } from "./common/PatientManagement/doctors-appointment-new-tinnitus-evaluation/doctors-appointment-new-tinnitus-evaluation.component";
import { DoctorsAppointmentNewTinnitusHandicapComponent } from "./common/PatientManagement/doctors-appointment-new-tinnitus-handicap/doctors-appointment-new-tinnitus-handicap.component";
import { TinnitusTherapyTrackerDashboardComponent } from "./common/PatientManagement/tinnitus-therapy-tracker-dashboard/tinnitus-therapy-tracker-dashboard.component";
import { TinnitusEvauationReportDashboardComponent } from "./common/PatientManagement/tinnitus-evauation-report-dashboard/tinnitus-evauation-report-dashboard.component";
import { PrintTinnitusTherapyTrackerDashboardComponent } from "./common/PatientManagement/print-tinnitus-therapy-tracker-dashboard/print-tinnitus-therapy-tracker-dashboard.component";
import { PrintTinnitusEvauationReportDashboardComponent } from "./common/PatientManagement/print-tinnitus-evauation-report-dashboard/print-tinnitus-evauation-report-dashboard.component";
import { OutwardChallanComponent } from './common/MICL/outward-challan/outward-challan.component';
import { NepalVendorInteractionComponent } from "./common/Procurement/nepal-vendor-interaction/nepal-vendor-interaction.component";
import { K4cPremixItemClosingStockComponent } from './common/MaterialManagement/Production/k4c-premix-item-closing-stock/k4c-premix-item-closing-stock.component';
import { SaleBillComponent } from './common/MICL/sale-bill/sale-bill.component';
import { DoctorsAppoNewFluencyEvaluationComponent } from "./common/PatientManagement/doctors-appo-new-fluency-evaluation/doctors-appo-new-fluency-evaluation.component";
import { PrintSpeechEvauationReportDashboardComponent } from "./common/PatientManagement/print-speech-evauation-report-dashboard/print-speech-evauation-report-dashboard.component";
import { SpeechEvauationReportDashboardComponent } from "./common/PatientManagement/speech-evauation-report-dashboard/speech-evauation-report-dashboard.component";
import { DoctorsAppoNewChildSpeechEvaluationComponent } from "./common/PatientManagement/doctors-appo-new-child-speech-evaluation/doctors-appo-new-child-speech-evaluation.component";
import { DoctorsAppoNewAdultSpeechEvaluationComponent } from "./common/PatientManagement/doctors-appo-new-adult-speech-evaluation/doctors-appo-new-adult-speech-evaluation.component";
import { SaleBillNewComponent } from './common/FinancialManagement/Transaction/Sales/sale-bill-new/sale-bill-new.component';
import { DoctorsAppointmentNewFineTuningComponent } from "./common/PatientManagement/doctors-appointment-new-fine-tuning/doctors-appointment-new-fine-tuning.component";
import { DoctorsAppointmentNewFineTuningHearingComponent } from "./common/PatientManagement/doctors-appointment-new-fine-tuning-hearing/doctors-appointment-new-fine-tuning-hearing.component";
import { GoogleReviewComponent } from './common/PatientManagement/google-review/google-review.component';

import { PurchaseBillGSTOneSPComponent } from './common/FinancialManagement/Transaction/Purchase/purchase-bill-gst-one-sp/purchase-bill-gst-one-sp.component';
import { PurchaseOrderHarbauerComponent } from './common/MaterialManagement/Inward/purchase-order-harbauer/purchase-order-harbauer.component';
import { ParameterMasterComponent } from "./common/MICL/parameter-master/parameter-master.component";
import { DoctorsAppoTherapPlanComponent } from './common/PatientManagement/doctors-appo-therap-plan/doctors-appo-therap-plan.component';
import { MICLRawMaterialQAComponent } from "./common/MICL/micl-raw-material-qa/micl-raw-material-qa.component";
import { BLTxnGrnNPComponent } from './common/Procurement/bl-txn-grn-np/bl-txn-grn-np.component';
import { HrLateArrivalEarlyDepartureComponent } from './common/MICL/hr-late-arrival-early-departure/hr-late-arrival-early-departure.component';
import { K4cSwiggyZomatoFileUploadComponent } from './common/OutletManagement/k4c-swiggy-zomato-file-upload/k4c-swiggy-zomato-file-upload.component';
import { HrLoanApplicationComponent } from './common/MICL/hr-loan-application/hr-loan-application.component';
import { TherapyAttendanceEntryComponent } from './common/PatientManagement/therapy-attendance-entry/therapy-attendance-entry.component';
import { NepalSupTktCustomerAccountCreationComponent } from './common/TicketManagement/nepal-sup-tkt-customer-account-creation/nepal-sup-tkt-customer-account-creation.component';
import { FinsCreateProjectComponent } from './common/Finshore/fins-create-project/fins-create-project.component';
import { FinsBrowseProjectComponent } from './common/Finshore/fins-browse-project/fins-browse-project.component';
import { StockInterchangeComponent } from './common/MICL/RawMaterial/stock-interchange/stock-interchange.component';
import { SaleOrderComponent } from './common/MICL/sale-order/sale-order.component';
import { QcApprovalComponent } from './common/MICL/qc-approval/qc-approval.component';
import { PatientCreateBrunchComponent } from './common/PatientManagement/patient-create-brunch/patient-create-brunch.component';
import { HrLoanApprovalComponent } from './common/MICL/hr-loan-approval/hr-loan-approval.component';
import { CreateCookieComponent } from './common/UserManagement/Createt_Desktop_Cookies/create-cookie/create-cookie.component';
import { NPSupTktSalesReturnRequestComponent } from './common/TicketManagement/np-sup-tkt-sales-return-request/np-sup-tkt-sales-return-request.component';
import { MICLCouponIssueComponent } from './common/MICL/micl-coupon-issue/micl-coupon-issue.component';
import { CouponCreationComponent } from './common/MICL/coupon-creation/coupon-creation.component';
import { CouponExpensesComponent } from './common/MICL/coupon-expenses/coupon-expenses.component';
import { CouponUtilizationComponent } from './common/MICL/coupon-utilization/coupon-utilization.component';
import { NepalSupTktSalesReturnApproveComponent } from './common/TicketManagement/nepal-sup-tkt-sales-return-approve/nepal-sup-tkt-sales-return-approve.component';
import { BSHPLAudiologistAppoComponent } from "./common/PatientManagement/bshpl-audiologist-appo/bshpl-audiologist-appo.component";
import { EmployeeMasterContractorComponent } from './common/MICL/employee-master-contractor/employee-master-contractor.component';
import { LetterOfIntentComponent } from './common/MICL/letter-of-intent/letter-of-intent.component';
import { ProformaInvoiceComponent } from './common/MICL/proforma-invoice/proforma-invoice.component';
import { SalesMisComponent } from './common/MICL/sales-mis/sales-mis.component';
import { ViewOutcomesComponent } from "./common/PatientManagement/view-outcomes/view-outcomes.component";
import { TransferTransectionComponent } from './common/Patna/transfer-transection/transfer-transection.component';
import { HarbTxnRequisitionComponent } from './common/Harbauer/harb-txn-requisition/harb-txn-requisition.component';
import { PurchaseOrderHarbauerTermsComponent } from './common/Harbauer/purchase-order-harbauer-terms/purchase-order-harbauer-terms.component';
import { AudiologistTargetComponent } from './common/PatientManagement/Audiologist/audiologist-target/audiologist-target.component';
import { CommonPurchaseBillGstComponent } from './common/FinancialManagement/Transaction/Purchase/common-purchase-bill-gst/common-purchase-bill-gst.component';
import { FullAndFinalSettlementComponent } from './common/MICL/full-and-final-settlement/full-and-final-settlement.component';
import { NPSupTktSalesReturnWarehouseComponent } from './common/TicketManagement/np-sup-tkt-sales-return-warehouse/np-sup-tkt-sales-return-warehouse.component';
import { NPSupTktSalesReturnAccountsComponent } from './common/TicketManagement/np-sup-tkt-sales-return-accounts/np-sup-tkt-sales-return-accounts.component';
import { EmployeeSalaryMasterJohComponent } from './common/Attendance/employee-salary-master-joh/employee-salary-master-joh.component';
import { OldProjectMasterComponent } from './common/Harbauer/old-project-master/old-project-master.component';
import { MasterProjectTeamComponent } from './common/Harbauer/master-project-team/master-project-team.component';
import { HrCouponReportComponent } from './common/MICL/hr-coupon-report/hr-coupon-report.component';
import { JohDailyAttendanceComponent } from './common/Attendance/joh-daily-attendance/joh-daily-attendance.component';
import { CandidateInterviewProcessComponent } from './common/Attendance/candidate-interview-process/candidate-interview-process.component';
import { ConsultancyPaymentComponent } from './common/Attendance/consultancy-payment/consultancy-payment.component';
import { AppraisalFormComponent } from './common/Attendance/appraisal-form/appraisal-form.component';
import { PendingOutcomesComponent } from './common/PatientManagement/pending-outcomes/pending-outcomes.component';
import { BLTxnProductReturnFromProjectComponent } from './common/Harbauer/bl-txn-product-return-from-project/bl-txn-product-return-from-project.component';
import { MasterCompanyUpdateComponent } from './common/FinancialManagement/Master/master-company-update/master-company-update.component';
import { BlTxnProjectwiseReportComponent } from './common/FinancialManagement/Report/bl-txn-projectwise-report/bl-txn-projectwise-report.component';
import { BlCRMWPMSTTemplateComponent } from './common/PatientManagement/Transaction/bl-crm-wp-mst-template/bl-crm-wp-mst-template.component';
import { K4cAcceptRawMaterialStockTransferComponent } from './common/MaterialManagement/k4c-accept-raw-material-stock-transfer/k4c-accept-raw-material-stock-transfer.component';
import { AttendanceRegularizationComponent } from './common/Attendance/attendance-regularization/attendance-regularization.component';
import { ApproveAttendanceRegularizationComponent } from './common/Attendance/approve-attendance-regularization/approve-attendance-regularization.component';
import { EmployeeTransferComponent } from './common/Attendance/employee-transfer/employee-transfer.component';
import { HearingCRMLeadFollowupComponent } from './common/CRM/Followup/hearing-crm-lead-followup/hearing-crm-lead-followup.component';
import { HrRequisitionFormComponent } from './common/Attendance/hr-requisition-form/hr-requisition-form.component';
import { ApproveHrRequisitionFormComponent } from './common/Attendance/approve-hr-requisition-form/approve-hr-requisition-form.component';
import { RetailAdvanceOrderComponent } from './common/FinancialManagement/Retail/retail-advance-order/retail-advance-order.component';
import { SalesmanTargetComponent } from './common/PatientManagement/Audiologist/salesman-target/salesman-target.component';
import { HRAttnDetalisComponent } from './common/HR/hr-attn-detalis/hr-attn-detalis.component';
import {GMapModule} from 'primeng/gmap';
import { AgmCoreModule } from '@agm/core';
import { EmployeeBonusComponent } from './common/MICL/employee-bonus/employee-bonus.component';
import { HrRecruitmentTrackerComponent } from './common/Attendance/hr-recruitment-tracker/hr-recruitment-tracker.component';
import { EmployeeSynchroniseWithAppComponent } from './common/HR/employee-synchronise-with-app/employee-synchronise-with-app.component';
import { REPStockReportHBRComponent } from './common/Harbauer/rep-stock-report-hbr/rep-stock-report-hbr.component';
import { SlagToRmStockTransferComponent } from './common/MICL/RawMaterial/slag-to-rm-stock-transfer/slag-to-rm-stock-transfer.component';
import { CommonStockTransferComponent } from './common/MICL/RawMaterial/common-stock-transfer/common-stock-transfer.component';
import { BillNoChangeComponent } from './common/MICL/bill-no-change/bill-no-change.component';
import { CostcenterTargetJohComponent } from './common/PatientManagement/Audiologist/costcenter-target-joh/costcenter-target-joh.component';
import { LeaveRegisterComponent } from './common/MICL/leave-register/leave-register.component';
import { HrReportsComponent } from './common/Attendance/hr-reports/hr-reports.component';
import { FinsSubLedgerComponent } from './common/Finshore/fins-sub-ledger/fins-sub-ledger.component';
import { AdvanceOrderAdjustmentComponent } from './common/OutletManagement/advance-order-adjustment/advance-order-adjustment.component';
import { AssetMasterComponent } from './common/MICL/asset-master/asset-master.component';
import { HrTrainingComponent } from './common/HR/hr-training/hr-training.component';
import { EvaluateForTrainingComponent } from './common/Attendance/evaluate-for-training/evaluate-for-training.component';
import { SofthearAudiologistTargetComponent } from './common/PatientManagement/Audiologist/softhear-audiologist-target/softhear-audiologist-target.component';
import { SalarySlipComponent } from './common/HR/salary-slip/salary-slip.component';
import { ApproveEvaluateForTraningComponent } from './common/Attendance/approve-evaluate-for-traning/approve-evaluate-for-traning.component';
import { EmployeeRelatedReportComponent } from './common/HR/employee-related-report/employee-related-report.component';
import { ServiceEngineeringTeamComponent } from "./common/Harbauer/Service/service-engineering-team/service-engineering-team.component";
import { ProjectMasterComponent } from './common/Harbauer/Service/project-master/project-master.component';
import { TrainingGradeModuleComponent } from './common/HR/training-grade-module/training-grade-module.component';
import { K4cVoucherComponent } from './common/FinancialManagement/Transaction/Voucher/k4c-voucher/k4c-voucher.component';
import { SalesmanTargetForJohComponent } from './common/PatientManagement/Audiologist/salesman-target-for-joh/salesman-target-for-joh.component';
import { ServiceProblemTypeComponent } from './common/Harbauer/Service/service-problem-type/service-problem-type.component';
import { ServiceSupportTicketComponent } from './common/Harbauer/Service/service-support-ticket/service-support-ticket.component';
import { QuizModuleComponent } from './common/Attendance/quiz-module/quiz-module.component';
import { K4cAllDiagnosisComponent } from './common/OutletManagement/k4c-all-diagnosis/k4c-all-diagnosis.component';
import { PatientCreateWithInformationComponent } from './common/PatientManagement/patient-create-with-information/patient-create-with-information.component';
import { DailyAttendanceJohForEmployeeComponent } from './common/Attendance/daily-attendance-joh-for-employee/daily-attendance-joh-for-employee.component';
import { LeaveEncashmentComponent } from './common/HR/leave-encashment/leave-encashment.component';
import { DoctorSchedulComponent } from './common/PatientManagement/doctor-schedul/doctor-schedul.component';
import { PurchaseBillMrpUpdateComponent } from './common/FinancialManagement/Transaction/Purchase/purchase-bill-mrp-update/purchase-bill-mrp-update.component';
import { FullAndFinalSettlementJohHrComponent } from './common/HR/full-and-final-settlement-joh-hr/full-and-final-settlement-joh-hr.component';
import { FollowupWithSalesDetailsComponent } from './common/CRM/Followup/followup-with-sales-details/followup-with-sales-details.component';
import { BlCrmEnqCaseHistoryComponent } from './common/PatientManagement/bl-crm-enq-case-history/bl-crm-enq-case-history.component';
import { NewAdultSpeechEvaluationComponent } from './common/PatientManagement/new-adult-speech-evaluation/new-adult-speech-evaluation.component';
import { NewChildSpeechEvaluationComponent } from './common/PatientManagement/new-child-speech-evaluation/new-child-speech-evaluation.component';
import { BlCrmLsqBillManagementComponent } from './common/FinancialManagement/Retail/bl-crm-lsq-bill-management/bl-crm-lsq-bill-management.component';
import { CouponCheckingComponent } from './common/PatientManagement/coupon-checking/coupon-checking.component';
import { ExpenseTrackingComponent } from './common/HR/expense-tracking/expense-tracking.component';
import { CrateTransferDispatchToOutletComponent } from './common/MaterialManagement/Outward/crate-transfer-dispatch-to-outlet/crate-transfer-dispatch-to-outlet.component';
import { ChangeBatchNumberComponent } from './common/MaterialManagement/Outward/change-batch-number/change-batch-number.component';
import { WeeklyReportingComponent } from './common/PatientManagement/weekly-reporting/weekly-reporting.component';
import { CrmReportV2Component } from './common/PatientManagement/crm-report-v2/crm-report-v2.component';
import { LeaveAutoUpdateComponent } from './common/HR/leave-auto-update/leave-auto-update.component';
import { PackageSessionCompleteComponent } from './common/PatientManagement/package-session-complete/package-session-complete.component';
import { BlTxnRefDocEntryComponent } from './common/PatientManagement/bl-txn-ref-doc-entry/bl-txn-ref-doc-entry.component';
import { BlTxnPettyCashVoucherComponent } from './common/SalesAndDistribution/Transaction/bl-txn-petty-cash-voucher/bl-txn-petty-cash-voucher.component';
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
    TutoLoamEmiTransferComponent,
    TutoMasterSalesteamComponent,
    K4cFactoryReturnComponent,
    K4cAdvanceProductionComponent,
    K4CDispatchOutletAdvOrderComponent,
    TutoSupportMasterComponent,
    DiplSupportTicketComponent,
    DiplMasterSalesteamComponent,
    K4cCreateStartProductionComponent,
    K4cCutoffComponent,
    DIPLSupportCallSheetComponent,
    K4cFactoryRequisitionComponent,
    K4cInternalStockTransferComponent,
    K4cDepartmentWiseRequisitionComponent,
    ReceiveDistributionChallanComponent,
    TutoDirectSaleCallTrackComponent,
    K4cDistributionChallanStatusComponent,
    TutoOrderBillBrowseComponent,
    OutletStockTransferComponent,
    CRMPaymentBankComponent,
    TutoSupportUserManagementComponent,
    OutletStockMovementComponent,
    K4cProductionVoucherNewComponent,
    K4cInternalStockTransferNewComponent,
    TutoDsBillComponent,
    TutoPaymentLinkComponent,
    HearingSpeechAppointmentComponent,
    K4cMasterBOMReciepeComponent ,
    IssueStockAdjustmentComponent ,
    ReceiveStockAdjustmentComponent ,
    StoreItemIndentComponent ,
    OutletTxnBankDepositComponent,
    K4cFactoryIndentAdvanceComponent,
    MasterUOMCommonComponent,
    K4cRawMaterialIssueComponent,
    K4cRawMaterialIndentComponent,
    OutletPhysicalClosingStockComponent ,
    K4cRawMaterialStockTransferComponent,
    K4cDispatchOutletStoreComponent,
    K4cPurchasePlaningComponent,
    K4cOutletStockReportComponent,
    K4cDayEndProcessComponent,
    TutoDsDashboardComponent,
    UpdateExpiryComponent,
    ClosingStockWithExpiryDateComponent,
    TutoSaleTreeFieldComponent,
    TutoSalesTreeInsideSalesComponent,
    TutoCrmLeadFieldSaleComponent,
    TutoTempCrmLeadComponent,
    TutoWebDemLeadFollowupComponent,
    TutoAuditLeadFollowupComponent,
    OutletClosingStockWithBatchComponent,
    K4cAdvOrderInternalStockTransferComponent,
    TutoPostSaleAuditLeadFollowupComponent,
    TutoBdaReportComponent,
    TutoSchoolRequestDetailsComponent,
    CompacctTenderComponent,
    CompacctCivildailyJobComponent,
    CompacctRunningBillComponent,
    CrmLeadOpportunitiesComponent,
    CrmLeadTaskDetailsComponent,
    K4cStockAdjustmentStoreItemsComponent,
    TutoWebDemoTeamComponent,
    TutoPreSaleAuditTeamComponent,
    TutoPostSaleAuditTeamComponent,
    TutoFieldSalesSchoolComponent,
    HarbaProjectEstimateComponent,
    K4cRsnsClosingStockComponent,
    DirectPaymentFollowupNepalComponent,
    K4cFranchiseSaleBillComponent,
    TenderEstimateComponent,
    HearingPackageMasterComponent,
    CompacctTxnTaskComponent,
    TutoManualPaymentCollectionComponent,
    OutletSaleBillWithoutBatchSelectComponent,
    OutletStockTransferAutoBatchComponent,
    BillEditFromAdminComponent,
    TxnEnqTenderHarbauerComponent,
    TutoUploadDataSupportComponent,
    EnggNepalMachineMasterComponent,
    EnggNepalSparePartsComponent,
    TenderBudgetComponent,
    TenderHarbauerViewComponent,
    NepalMasterSubledgerComponent,
    HarbauerMasterProductMechanicalComponent,
    OutletGroupReportComponent,
    K4cCrateInOuComponent,
    BlCrmEnggMasterNepalComponent,
    TenderHarbauerActualViewComponent,
    EnggCrmInstalledMachineComponent,
    EnggCrmInstalledMachineServiceContractComponent,
    TenderBudgetAprovalComponent,
    SupportTicketNepalComponent,
    StockTransferToStoreComponent,
    HarbMasterProductElectricalComponent,
    TenderViewDetailsCompComponent,
    TenderSingleSchBudgetComponent,
    TenderMultipleSchBudgetComponent,
    HarbMasterProductCivilComponent,
    SemiFinishedProductionVoucherComponent,
    SupportTicketPendingCallsNepalComponent,
    K4cCreditNoteBrowseComponent,
    TutoSupportCalenderDashboardComponent,
    NonSaleableClosingStockComponent,
    AccOpeningBalcManagementComponent,
    EngineeringQuotationNepalComponent,
    CompacctDocumentVaultComponent,
    GrnViewPurchaseBillComponent,
    ProductsPlaningComponent,
    CompacctTxnTaskGanttComponent,
    UserAbsentComponent,
    TutoBdaJoiningComponent,
    TutoAspUnavaliblityComponent,
    RetailBrowseComponent,
    RetailBrowseReceiveComponent,
    RetailBrowseAdvanceComponent,
    PurchaseOrderComponent,
    JournalVoucherComponent,
    MasterCompanyComponent,
    UserMasterComponent,
    AttendanceSheetComponent,
    K4cProductCategoryUpdateComponent,
    TutoAspMaxAppoComponent,
    TutoBdaAttendanceComponent,
    HrLeaveOpeningComponent,
    TutoBdaWiseTargetComponent,
    TutoSalesTreeComponent,
    GrnComponent,
    MiclRequisitionComponent,
    MiclDispatchChallanComponent,
    HrLeaveApplyComponent,
    SubledgerForAccountsComponent,
    MasterProductGeneralConsumablesComponent,
    HarbaTaskListComponent,
    RdbComponent,
    PurchaseBillFromGrnComponent,
    BdaWiseTargetAchievementComponent,
    ProductMasterComponent,
    CompacctgstandcustomdutyComponent,
    CompacctProductDetailsComponent,
    CompacctFinancialDetailsComponent,
    BSHPLAmeyoCustomerComponent,
    BSHPAmeyoKBComponent,
    SubLedgerComponent,
    TaxCategoryComponent,
    CompacctProjectComponent,
    K4cConversionOfProductComponent,
    PurchaseBillComponent,
    FinancialVoucherComponent,
    WastageComponent,
    HIPLPaymentRequisitionComponent,
    CCSahaProfundComponent,
    REPStockReportComponent,
    StockReportComponent,
    ContractVoucherV2Component,
    IssueChallanComponent,
    HRTxnSpecialAllowanceDeductionComponent,
    ProcessSalaryComponent,
    LeaveApprovalComponent,
    ConsumptionComponent,
    DebitNoteWoStockComponent,
    FinancialReminderComponent,
    InflowPlaningComponent,
    WorkOrderComponent,
    ReturnableGatePassComponent,
    RepairAndMaintenanceRdbComponent,
    K4cProductionClosingStockComponent,
    EmployeeSalaryMasterMiclComponent,
    HrEmployeeSalaryMasterHarbComponent,
    RepairAndMantainceGRNComponent,
    HREmployeeMasterComponent,
    HarbProjectBillComponent,
    NepalSubledgerAliasCategoryComponent,
    PatientCouponComponent,
    HearingCaseHistoryComponent,
    GoodReceiveDetailsComponent,
    MasterHolidayComponent,
    MICLDispatchChallanChargeableComponent,
    DailyAttendanceSheetComponent,
    MasterConsultancyV3Component,
    MICLJournalVoucherComponent,
    POAuthorizationComponent,
    BranchRequisitionComponent,
    RequisitionAuthorizationComponent,
    BOMAuthorizationComponent,
    ProjectPlanApproveComponent,
    POAuthorizationHarbauerComponent,
    HarbProjectDesignApprovalComponent,
    NepalRequisitionFromSalesmanComponent,
    NepalPurchaseRequestComponent,
    MeterialInspectionOfRDBComponent,
    BLTxnWorkOrderSaleBillComponent,
    HREventUploadComponent,
    MasterSubContractorComponent,
    SubContractorEmployeeMasterComponent,
    SubContractorAttendanceComponent,
    NonReturnableGatePassComponent,
    MiclRawMaterialComponent,
    NepalPurchaseRequestVendorSelectionComponent,
    NepalPurchaseRequestNegotiatePriceComponent,
    MICLMasterConsumbleComponent,
    MICLCostCenterMasterComponent,
    JOHEarMoldComponent,
    SubledgerReportForFranchiseComponent,
    K4CStockDetailsComponent,
    RawMaterialReceiveComponent,
    PurchaseOrderRawMaterialComponent,
    RawMaterialRequisitionComponent,
    MiclRawMaterialIssueComponent,
    NepalBLTxnPurchaseOrderComponent,
    JOHRealisticExpectationFormComponent,
    FurnaceMisInputComponent,
    MiclRawMaterialIssueNewComponent,
    RequisitionForIssueChargeableComponent,
    JohValidationProcessComponent,
    ReturnMaterialComponent,
    K4cPremixInventoryComponent,
    K4cPremixStockTransferComponent,
    NepalBLTxnPurchaseOrderApproveComponent,
    DoctorAppointmentComponent,
    MiclPurchaseBillComponent,
    DoctorsAppointmentNewABRComponent,
    K4CBillDateUpdateComponent,
    UpdateConsultancyComponent,
    DoctorApptNewImpedanceAudiometryComponent,
    NepalPurchaseOrderStatusMasterComponent,
    DailyAttendanceForContractorComponent,
    NepalPurchaseOrderDocumenMasterComponent,
    RawMaterialStockReportComponent,
    BSHPLHfFollowUpComponent,
    DoctorsAppointmentNewOAEComponent,
    DoctorsAppointmentNewSpTestComponent,
    DoctorsAppointmentNewGlycerolTestComponent,
    AcceptReturnMaterialComponent,
    EInvoiceConfirmationFormComponent,
    MiclFinishMasterProductComponent,
    DoctorsAppointmentNewTinnitusReportComponent,
    DoctorsAppointmentNewTinnitusTherapyTrackerComponent,
    MiclWastageMasterProductComponent,
    DoctorsAppointmentNewTinnitusEvaluationComponent,
    DoctorsAppointmentNewTinnitusHandicapComponent,
    TinnitusTherapyTrackerDashboardComponent,
    TinnitusEvauationReportDashboardComponent,
    PrintTinnitusTherapyTrackerDashboardComponent,
    PrintTinnitusEvauationReportDashboardComponent,
    OutwardChallanComponent,
    NepalVendorInteractionComponent,
    K4cPremixItemClosingStockComponent,
    SaleBillComponent,
    DoctorsAppoNewFluencyEvaluationComponent,
    PrintSpeechEvauationReportDashboardComponent,
    SpeechEvauationReportDashboardComponent,
    DoctorsAppoNewChildSpeechEvaluationComponent,
    DoctorsAppoNewAdultSpeechEvaluationComponent,
    SaleBillNewComponent,
    DoctorsAppointmentNewFineTuningComponent,
    DoctorsAppointmentNewFineTuningHearingComponent,
    GoogleReviewComponent,
    PurchaseBillGSTOneSPComponent,
    PurchaseOrderHarbauerComponent,
    ParameterMasterComponent,
    DoctorsAppoTherapPlanComponent,
    MICLRawMaterialQAComponent,
    BLTxnGrnNPComponent,
    HrLateArrivalEarlyDepartureComponent,
    K4cSwiggyZomatoFileUploadComponent,
    HrLoanApplicationComponent,
    TherapyAttendanceEntryComponent,
    NepalSupTktCustomerAccountCreationComponent,
    FinsCreateProjectComponent,
    FinsBrowseProjectComponent,
    StockInterchangeComponent,
    SaleOrderComponent,
    QcApprovalComponent,
    PatientCreateBrunchComponent,
    HrLoanApprovalComponent,
    CreateCookieComponent,
    NPSupTktSalesReturnRequestComponent,
    MICLCouponIssueComponent,
    CouponCreationComponent,
    CouponExpensesComponent,
    CouponUtilizationComponent,
    NepalSupTktSalesReturnApproveComponent,
    BSHPLAudiologistAppoComponent,
    EmployeeMasterContractorComponent,
    LetterOfIntentComponent,
    ProformaInvoiceComponent,
    SalesMisComponent,
    ViewOutcomesComponent,
    TransferTransectionComponent,
    HarbTxnRequisitionComponent,
    PurchaseOrderHarbauerTermsComponent,
    AudiologistTargetComponent,
    CommonPurchaseBillGstComponent,
    FullAndFinalSettlementComponent,
    NPSupTktSalesReturnWarehouseComponent,
    NPSupTktSalesReturnAccountsComponent,
    EmployeeSalaryMasterJohComponent,
    OldProjectMasterComponent,
    MasterProjectTeamComponent,
    HrCouponReportComponent,
    JohDailyAttendanceComponent,
    CandidateInterviewProcessComponent,
    ConsultancyPaymentComponent,
    AppraisalFormComponent,
    PendingOutcomesComponent,
    BLTxnProductReturnFromProjectComponent,
    MasterCompanyUpdateComponent,
    BlTxnProjectwiseReportComponent,
    BlCRMWPMSTTemplateComponent,
    K4cAcceptRawMaterialStockTransferComponent,
    AttendanceRegularizationComponent,
    ApproveAttendanceRegularizationComponent,
    EmployeeTransferComponent,
    HearingCRMLeadFollowupComponent,
    HrRequisitionFormComponent,
    ApproveHrRequisitionFormComponent,
    RetailAdvanceOrderComponent,
    SalesmanTargetComponent,
    HRAttnDetalisComponent,
    EmployeeBonusComponent,
    HrRecruitmentTrackerComponent,
    EmployeeSynchroniseWithAppComponent,
    REPStockReportHBRComponent,
    SlagToRmStockTransferComponent,
    CommonStockTransferComponent,
    BillNoChangeComponent,
    CostcenterTargetJohComponent,
    LeaveRegisterComponent,
    HrReportsComponent,
    FinsSubLedgerComponent,
    AdvanceOrderAdjustmentComponent,
    AssetMasterComponent,
    HrTrainingComponent,
    EvaluateForTrainingComponent,
    SofthearAudiologistTargetComponent,
    SalarySlipComponent,
    ApproveEvaluateForTraningComponent,
    EmployeeRelatedReportComponent,
    ServiceEngineeringTeamComponent,
    ProjectMasterComponent,
    TrainingGradeModuleComponent,
    K4cVoucherComponent,
    SalesmanTargetForJohComponent,
    ServiceProblemTypeComponent,
    ServiceSupportTicketComponent,
    QuizModuleComponent,
    K4cAllDiagnosisComponent,
    PatientCreateWithInformationComponent,
    DailyAttendanceJohForEmployeeComponent,
    LeaveEncashmentComponent,
    DoctorSchedulComponent,
    PurchaseBillMrpUpdateComponent,
    FullAndFinalSettlementJohHrComponent,
    FollowupWithSalesDetailsComponent,
    BlCrmEnqCaseHistoryComponent,
    NewAdultSpeechEvaluationComponent,
    NewChildSpeechEvaluationComponent,
    BlCrmLsqBillManagementComponent,
    CouponCheckingComponent,
    ExpenseTrackingComponent,
    CrateTransferDispatchToOutletComponent,
    ChangeBatchNumberComponent,
    WeeklyReportingComponent,
    CrmReportV2Component,
    LeaveAutoUpdateComponent,
    PackageSessionCompleteComponent,
    BlTxnRefDocEntryComponent,
    BlTxnPettyCashVoucherComponent
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
    TooltipModule,
    DateTimePickerModule,
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
    SelectButtonModule,
    DataViewModule,
    PanelModule,
    OverlayPanelModule,
    GanttAllModule,
    ChipsModule,
    NpDatepickerModule,
    SplitButtonModule,
    SliderModule,
    GMapModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyDSloRmchjfZhHX2u-vXo1i9uGX7Qj7AV0'
    })
  
  ],
  exports: [],
  providers: [
    CompacctGlobalUrlService,
    CookieService,
    CompacctGlobalApiService,
    CompacctCommonApi,
    CompacctHeader,
    CompacctGetDistinctService,
    CompacctAccountJournal,
    DateTimeConvertService,
    DateNepalConvertService,
    SelectionService,
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'en-IN'},
    SortService,
    FilterService,
    ColumnMenuService
  ]
})
export class LayoutModule {}