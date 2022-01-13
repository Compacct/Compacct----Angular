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
    NpDatepickerModule


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
    SelectionService,
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'en-IN'},
  ]
})
export class LayoutModule {}
