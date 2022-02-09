import {
  NgModule,
  Component
} from "@angular/core";
import {
  Routes,
  RouterModule
} from "@angular/router";
import {
  CommonModule
} from "@angular/common";

import {
  AppLayoutComponent
} from "./layout.component";
import {
  StocktransferComponent
} from "./common/MaterialManagement/Transaction/compacct.stocktransfer/compacct.stocktransfer.component";
// import { CompacctSynComponent } from './common/CRM/Transaction/compacct.syn/compacct.syn.module';
import {
  MasterProductComponent
} from "./common/MaterialManagement/Master/master.product/master.product.component";
import {
  MasterProductHearingComponent
} from "./common/MaterialManagement/Master/master-product-hearing/master-product-hearing.component";
// tslint:disable-next-line:max-line-length
import { MachineUsesComponent } from "./common/ProductionManagement/Transaction/machine-uses/machine-uses.component";
import { StockTransferTankComponent } from "./common/MaterialManagement/Transaction/stock-transfer-tank/stock-transfer-tank.component";
import { RenewalComponent } from "./common/Renewal/renewal/renewal.component";
import { RenewalTypeComponent } from "./common/Renewal/renewal-type/renewal-type.component";
import { CompacctPurchasebillGstComponent } from "./common/FinancialManagement/Transaction/Purchase/compacct.purchasebill-gst/compacct.purchasebill-gst.component";
import { SeedProcessComponent } from "./common/ProductionManagement/Transaction/seed-process/seed-process.component";
import { MasterCostCenterComponent } from "./common/MaterialManagement/Master/master.cost-center/master.cost-center.component";
import { PpBagProcessComponent } from "./common/ProductionManagement/Transaction/pp-bag-process/pp-bag-process.component";
import { OilProductionComponent } from "./common/ProductionManagement/Transaction/oil-production/oil-production.component";
import { CompacctBnbLeadComponent } from "./common/CRM/Transaction/compacct.bnb.lead/compacct.bnb.lead.component";
import { CommercialInvoiceComponent } from "./common/Export/Doc/commercial-invoice/commercial-invoice.component";
import { CurrencyBookingComponent } from "./common/Export/Doc/currency-booking/currency-booking.component";
import { CompacctBnbexportsComponent } from "./common/Export/compacct.bnbexports/compacct.bnbexports.component";
import { TransportationComponent } from "./common/Export/transportation/transportation.component";
import { SalesContractComponent } from "./common/Export/Doc/sales-contract/sales-contract.component";
import { CompacctBnbLeadbydateComponent } from "./common/CRM/Transaction/compacct.bnb.leadbydate/compacct.bnb.leadbydate.component";
import { ContainerBookingComponent } from "./common/Export/container-booking/container-booking.component";
import { CompacctAudiogramComponent } from "./common/PatientManagement/Audiologist/compacct.Audiogram/compacct.audiogram.component";
import { ConsultancyComponent } from "./common/PatientManagement/Master/consultancy/consultancy.component";
import { CompacctLedgerComponent } from './common/FinancialManagement/Master/compacct-ledger/compacct-ledger.component';
import { MasterRoyaleMaterialTypeComponent } from './common/MaterialManagement/Master/master-royale-material-type/master-royale-material-type.component';
import { CompacctRoyaleLeadComponent } from './common/CRM/Transaction/compacct-royale-lead/compacct-royale-lead.component';
import { InwardOutwardRegisterComponent } from "./common/SalesAndDistribution/Transaction/inward-outward-register/inward-outward-register.component";
import { ConsultancyCommissionComponent} from './common/PatientManagement/Master/consultancy-commission/consultancy-commission.component';
import { DoctorCommissionCalculatorComponent} from './common/PatientManagement/Master/doctor-commission-calculator/doctor-commission-calculator.component';
import { AdjustmentVoucherComponent} from './common/PatientManagement/Transaction/adjustment-voucher/adjustment-voucher.component';
import { InwardReplacementComponent} from './common/MaterialManagement/Inward/inward-replacement/inward-replacement.component';
import { ClinicTrialComponent } from './common/PatientManagement/Transaction/clinic-trial/clinic-trial.component';
import { CustomerSalesComponent } from './common/CRM/Report/customer-sales/customer-sales.component';
import { CompacctStockReportComponent } from './common/MaterialManagement/Report/compacct-stock-report/compacct-stock-report.component';
import { TutoPendsubscriptionComponent } from './common/CRM/Transaction/tuto.pendsubscription/tuto.pendsubscription.component';
import { TutoWslkinleadComponent } from "./common/CRM/Transaction/tuto.wslkinlead/tuto.wslkinlead.component";
import { TutoReceiveVoucherComponent } from "./common/FinancialManagement/Transaction/tuto-receive-voucher/tuto-receive-voucher.component";
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
import { HearingSpeechAppointmentComponent } from "./common/PatientManagement/hearing-speech-appointment/hearing-speech-appointment.component";
import { K4cMasterBOMReciepeComponent } from './common/MaterialManagement/Production/k4c-master-bom-reciepe/k4c-master-bom-reciepe.component';
import { IssueStockAdjustmentComponent } from './common/OutletManagement/issue-stock-adjustment/issue-stock-adjustment.component';
import { ReceiveStockAdjustmentComponent } from './common/OutletManagement/receive-stock-adjustment/receive-stock-adjustment.component';
import { StoreItemIndentComponent } from './common/OutletManagement/store-item-indent/store-item-indent.component';
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
import { TutoSalesTreeInsideSalesComponent } from "./common/CRM/Master/tuto-sales-tree-inside-sales/tuto-sales-tree-inside-sales.component";
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
import { HarbaProjectEstimateComponent } from "./common/TenderManagement/harba-project-estimate/harba-project-estimate.component";
import { K4cRsnsClosingStockComponent } from './common/MaterialManagement/k4c-rsns-closing-stock/k4c-rsns-closing-stock.component';
import { DirectPaymentFollowupNepalComponent } from "./common/CRM/Transaction/direct-payment-followup-nepal/direct-payment-followup-nepal.component";
import { K4cFranchiseSaleBillComponent } from './common/MaterialManagement/k4c-franchise-sale-bill/k4c-franchise-sale-bill.component';
import { TenderEstimateComponent } from './common/TenderManagement/tender-estimate/tender-estimate.component';
import { HearingPackageMasterComponent } from "./common/CRM/Master/hearing-package-master/hearing-package-master.component";
import { CompacctTxnTaskComponent } from "./common/TenderManagement/compacct-txn-task/compacct-txn-task.component";
import { TutoManualPaymentCollectionComponent } from './common/CRM/Transaction/tuto-manual-payment-collection/tuto-manual-payment-collection.component';
import { OutletSaleBillWithoutBatchSelectComponent } from './common/OutletManagement/outlet-sale-bill-without-batch-select/outlet-sale-bill-without-batch-select.component';
import { OutletStockTransferAutoBatchComponent } from './common/OutletManagement/outlet-stock-transfer-auto-batch/outlet-stock-transfer-auto-batch.component';
import { BillEditFromAdminComponent } from './common/MaterialManagement/bill-edit-from-admin/bill-edit-from-admin.component';
import { TxnEnqTenderHarbauerComponent } from './common/TenderManagement/txn-enq-tender-harbauer/txn-enq-tender-harbauer.component';
import { TutoUploadDataSupportComponent } from "./common/CRM/Master/tuto-upload-data-support/tuto-upload-data-support.component";
import { EnggNepalMachineMasterComponent } from './common/MaterialManagement/Master/engg-nepal-machine-master/engg-nepal-machine-master.component';
import { EnggNepalSparePartsComponent } from './common/MaterialManagement/Master/engg-nepal-spare-parts/engg-nepal-spare-parts.component';
import { TenderBudgetComponent } from "./common/TenderManagement/tender-budget/tender-budget.component";
import { TenderHarbauerViewComponent } from "./common/TenderManagement/tender-harbauer-view/tender-harbauer-view.component";
import { NepalMasterSubledgerComponent } from "./common/FinancialManagement/Master/nepal-master-subledger/nepal-master-subledger.component";
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
import { TenderSingleSchBudgetComponent } from './common/TenderManagement/tender-single-sch-budget/tender-single-sch-budget.component';
import { TenderMultipleSchBudgetComponent } from './common/TenderManagement/tender-multiple-sch-budget/tender-multiple-sch-budget.component';
import { HarbMasterProductCivilComponent } from './common/Harbauer/harb-master-product-civil/harb-master-product-civil.component';
import { SemiFinishedProductionVoucherComponent } from './common/MaterialManagement/Production/semi-finished-production-voucher/semi-finished-production-voucher.component';
import { SupportTicketPendingCallsNepalComponent } from './common/MaterialManagement/Master/support-ticket-pending-calls-nepal/support-ticket-pending-calls-nepal.component';
import { K4cCreditNoteBrowseComponent } from './common/MaterialManagement/k4c-credit-note-browse/k4c-credit-note-browse.component';
import { TutoSupportCalenderDashboardComponent } from "./common/CRM/Master/tuto-support-calender-dashboard/tuto-support-calender-dashboard.component";







const layoutRoutes: Routes = [{
  path: "",
  component: AppLayoutComponent,
  data: {
    title: "Dashboard"
  },
  children: [{
      path: "Business_Dashboard",
      loadChildren: () =>
        import("./dashBoard/compacct.dashboard.module").then(
          m => m.CompacctDashboardModule
        ),
      data: {
        title: "Business Dashboard"
      }
    },
    {
      path: "INV_Txn_St_Trf_GST",
      component: StocktransferComponent,
      data: {
        title: "Stock Transfer"
      }
    },
    {
      path: "scheduler_operation",
      loadChildren: () =>
        import(
          "./common/CRM/Transaction/compacct.scheduler/compacct.scheduler.module"
        ).then(m => m.CompacctSchedulerModule),
      data: {
        title: "Appointment Scheduler"
      }
    },
    {
      path: "Master_Product_V2",
      component: MasterProductComponent,
      data: {
        title: "Master Product"
      }
    },
    {
      path: "Master_Cost_Center_V2",
      component: MasterCostCenterComponent,
      data: {
        title: "Master Cost Center"
      }
    },
    {
      path: "Seed_Process",
      component: SeedProcessComponent,
      data: {
        title: "Seed Process"
      }
    },
    {
      path: "PP_Bag_Process",
      component: PpBagProcessComponent,
      data: {
        title: "Seed Process"
      }
    },
    {
      path: "BL_Txn_Purchase_Bill_Complete",
      component: CompacctPurchasebillGstComponent,
      data: {
        title: "Purchase Bill"
      }
    },
    {
      path: "Oil_Production",
      component: OilProductionComponent,
      data: {
        title: "Oil Production"
      }
    },
    {
      path: "BNB_New_Lead",
      component: CompacctBnbLeadComponent,
      data: {
        title: "Lead"
      }
    },
    {
      path: "EXP_Doc_Comm_Inv",
      component: CommercialInvoiceComponent,
      data: {
        title: "EXP_Doc_Comm_Inv"
      }
    },
    {
      path: "Export_Charges",
      component: CompacctBnbexportsComponent,
      data: {
        title: "Export Charge"
      }
    },
    {
      path: "Export_Transportation",
      component: TransportationComponent,
      data: {
        title: "Export_Transportation"
      }
    },
    {
      path: "Exp_Doc_Sale_Contract",
      component: SalesContractComponent,
      data: {
        title: "Exp Doc Sale Contract"
      }
    },
    {
      path: "BNB_BL_CRM_Lead_Browse",
      component: CompacctBnbLeadbydateComponent,
      data: {
        title: "Lead Search By Date"
      }
    },
    {
      path: "Container_Booking",
      component: ContainerBookingComponent,
      data: {
        title: "Container Booking"
      }
    },
    {
      path: "Hearing_Audiogram_Graph",
      component: CompacctAudiogramComponent,
      data: {
        title: "Audiogram"
      }
    },
    {
      path: "Currency_Booking",
      component: CurrencyBookingComponent,
      data: {
        title: "Currency Booking"
      }
    },
    {
      path: "BL_Txn_ST_Trf_Tank",
      component: StockTransferTankComponent,
      data: {
        title: "Stock Trans For Tank"
      }
    },
    {
      path: "Machine_Uses",
      component: MachineUsesComponent,
      data: {
        title: "Machine Uses"
      }
    },
    {
      path: "Master_Product_HA",
      component: MasterProductHearingComponent,
      data: {
        title: "Master Product Hearing Aid"
      }
    },
    {
      path: "Renewal",
      component: RenewalComponent,
      data: {
        title: "Renewal"
      }
    },
    {
      path: "Renewal_Type",
      component: RenewalTypeComponent,
      data: {
        title: "Renewal Type"
      }
    },
    {
      path: "BL_CRM_Master_Consultancy_V2",
      component: ConsultancyComponent,
      data: {
        title: "BL_CRM_Master_Consultancy_V2"
      }
    },
    {
      path: "Master_Accounting_Ledger_V2",
      component: CompacctLedgerComponent,
      data: {
        title: "Accounting Ledger"
      }
    },
    {
      path: "Master_Product_Material_Type",
      component: MasterRoyaleMaterialTypeComponent,
      data: {
        title: "Material Type"
      }
    },
    {
      path: 'GHC_Inward_Outward_Register',
      component: InwardOutwardRegisterComponent,
      data: {
        title: 'GHC_Inward_Outward_Register'
      }
    },
    {
      path: "BL_CRM_Lead_Management_V2",
      component: CompacctRoyaleLeadComponent,
      data: {
        title: "Lead"
      }
    },
    {
      path: 'GHC_Consultancy_Commision',
      component: ConsultancyCommissionComponent,
      data: {
        title: 'Consultancy Commission'
      }
    },
    {
      path: 'GHC_Doctor_Commission_Calculator',
      component: DoctorCommissionCalculatorComponent,
      data: {
        title: 'Doctor Commission Calculator'
      }
    },
    {
      path: 'Hearing_Adjustment_Voucher',
      component: AdjustmentVoucherComponent,
      data: {
        title: 'Hearing Adjustment Voucher'
      }
    },
    {
      path: 'INV_Txn_Inward_Replacement',
      component: InwardReplacementComponent,
      data: {
        title: 'Inward Replacement'
      }
    },
    {
      path: 'Hearing_Quotation',
      component: ClinicTrialComponent,
      data: {
        title: 'Hearing Quotation'
      }
    },
    {
      path: 'CRM_Customer_Sales',
      component: CustomerSalesComponent,
      data: {
        title: 'Customer Sales'
      }
    },
    {
      path: 'CRM_Stock_Report',
      component: CompacctStockReportComponent,
      data: {
        title: 'Stock Report'
      }
    },
    {
      path: 'Tutopia_Walk_in_Lead_Creation',
      component: TutoWslkinleadComponent,
      data: {
        title: 'Walk in Lead'
      }
    },
    {
      path: 'Tutopia_Pending_Subscription',
      component: TutoPendsubscriptionComponent,
      data: {
        title: 'Subscription'
      }
    },
    {
      path: 'Tutopia_Receive_Voucher',
      component: TutoReceiveVoucherComponent,
      data: {
        title: 'Confirm Voucher'
      }
    },
    {
      path: 'Send_Bulk_Email_Nepal',
      component: BulkSmsNepalComponent,
      data: {
        title: 'Bulk Email'
      }
    },
    {
      path: 'Tutopia_Master_Teacher',
      component: TutoMasterTeacherComponent,
      data: {
        title: 'Master Teacher'
      }
    },
    {
      path: 'Tutopia_Support_Question_Answer',
      component: TutoMastereQNAComponent,
      data: {
        title: 'Support Question & Answer'
      }
    },
    {
      path: 'Tutopia_Support_Query',
      component: TutoSupportQueryComponent,
      data: {
        title: 'Support Query & Reply'
      }
    },
    {
      path: 'Tutopia_Student_Search',
      component: TutoStudentSearchComponent,
      data: {
        title: 'Student Search'
      }
    },
    {
      path: 'Tutopia_CRM_Lead',
      component: TutoLeadFollowupComponent,
      data: {
        title: 'Followup Management'
      }
    },
    {
      path: 'Tutopia_Master_SKU',
      component: TutoMasterSkuComponent,
      data: {
        title: 'Master SKU'
      }
    },
    {
      path: 'Tutopia_Mater_Class_Management',
      component: TutoClassManagementComponent,
      data: {
        title: 'Class Management'
      }
    },
    {
      path: 'K4C_Outlet_Requisition',
      component: K4cOutletRequistionComponent,
      data: {
        title: 'K4C_Outlet_Requisition'
      }
    },
    {
      path: 'K4C_Master_Cost_Center',
      component: K4cMasterCostCenterComponent,
      data: {
        title: 'Master Cost Center'
      }
    },
    {
      path: 'K4C_Master_Product',
      component: K4cMasterProductComponent,
      data: {
        title: 'Master Product'
      }
    }, {
      path: 'Master_UOM',
      component: MasterUomComponent,
      data: {
        title: 'Master UOM'
      }
    },
    {
      path: 'K4C_Production_Voucher',
      component: K4CProductionVoucherComponent,
      data: {
        title: 'K4C Production Voucher'
      }
    },
    {
      path: 'K4C_Dispatch_to_Outlet',
      component: K4CDispatchToOutletComponent,
      data: {
        title: 'Distribution Challan'
      }
    },
    {
      path: 'K4C_Outlet_Sale_Bill',
      component: K4cOutletSaleBillComponent,
      data: {
        title: 'POS Bill'
      }
    },
    {
      path: 'K4C_Outlet_Advance_Order',
      component: K4cOutletAdvanceOrderComponent,
      data: {
        title: 'Advance Order'
      }
    },
    {
      path: 'POS_BIll_Order',
      component: K4cPosBillOrderComponent,
      data: {
        title: 'POS Bill Order'
      }
    }, {
      path: 'Tutopia_Student_Order',
      component: TutoOrderManagementComponent,
      data: {
        title: 'Subscription Order Management'
      }
    },
    {
      path: 'Tutopia_Direct_Order_Booking',
      component: TutoOrderBookingComponent,
      data: {
        title: 'Direct Order Booking'
      }
    },
    {
      path: 'Tutopia_Order_Payment',
      component: TutoOrderPaymentComponent,
      data: {
        title: 'Order Payment'
      }
    },
    {
      path: 'Tutopia_Acc_Cash_Bank_Confirm',
      component: TutoAccCashBankConfirmComponent,
      data: {
        title: 'Cash Bank Confirm'
      }
    }, {
      path: 'Tutopia_Dist_Cash_Confirm',
      component: TutoCashConfirmComponent,
      data: {
        title: ' Cash Deposit Confirmation'
      }
    },
    {
      path: 'Tutopia_Finance_Peer_Loan_Confirmation',
      component: TutoLoanConfirmationComponent,
      data: {
        title: ' Finance Peer Loan Confirmation'
      }
    }, {
      path: 'Loan_EMI_Trf',
      component: TutoLoamEmiTransferComponent,
      data: {
        title: 'Loan EMI Transfer'
      }
    },
    {
      path: 'Tutopia_CRM_Master_SalesTeam',
      component: TutoMasterSalesteamComponent,
      data: {
        title: 'Channel Sales Team'
      }
    },
    {
      path: 'K4C_Factory_Return',
      component: K4cFactoryReturnComponent,
      data: {
        title: 'k4C FACTORY RETURN'
      }
    },
    {
      path: 'K4C_Advance_Order_Production',
      component: K4cAdvanceProductionComponent,
      data: {
        title: 'Advance Order Production'
      }
    },


    {
      path: 'K4C_Dispatch_Outlet_Adv_Order',
      component: K4CDispatchOutletAdvOrderComponent,
      data: {
        title: 'Custom Order Distribution'
      }
    }, {
      path: 'Tutopia_Support_Master',
      component: TutoSupportMasterComponent,
      data: {
        title: 'Support Ticket Master'
      }
    }, {
      path: 'DIPL_Support_Ticket',
      component: DiplSupportTicketComponent,
      data: {
        title: 'Support Ticket'
      }
    }, {
      path: 'DIPL_Service_Team',
      component: DiplMasterSalesteamComponent,
      data: {
        title: 'Sales Team'
      }
    }, {
      path: 'Create_Start_Production',
      component: K4cCreateStartProductionComponent,
      data: {
        title: 'Create Start Production'
      }
    }, {
      path: 'K4C_Cutoff',
      component: K4cCutoffComponent,
      data: {
        title: 'Cutoff Time'
      }
    }, {
      path: 'DIPL_Support_Call_Sheet',
      component: DIPLSupportCallSheetComponent,
      data: {
        title: 'Support Call Sheet'
      }
    }, {
      path: 'Factory_Requisition',
      component: K4cFactoryRequisitionComponent,
      data: {
        title: 'Factory Requisition'
      }
    },
    {
      path: 'Internal_Stock_Transfer',
      component: K4cInternalStockTransferComponent,
      data: {
        title: 'Internal Stock Transfer'
      }
    },
    {
      path: 'Department_Wise_Requisition',
      component: K4cDepartmentWiseRequisitionComponent,
      data: {
        title: 'Department Wise Requisition'
      }
    }, {
      path: 'Accept_Receive_Distribution_Challan',
      component: ReceiveDistributionChallanComponent,
      data: {
        title: 'Browse Accept Challan'
      }
    },
    {
      path: 'Direct_Sale_Call_Track',
      component: TutoDirectSaleCallTrackComponent,
      data: {
        title: 'Call Status'
      }
    },
    {
      path: 'Distribution_Challan_Status',
      component: K4cDistributionChallanStatusComponent,
      data: {
        title: 'Distribution Challan Status'
      }
    },
    {
      path: 'Tutopia_Order_Bill_Browse',
      component: TutoOrderBillBrowseComponent,
      data: {
        title: 'Order Bill Browse'
      }
    }, {
      path: 'K4C_Outlet_Stock_Transfer',
      component: OutletStockTransferComponent,
      data: {
        title: 'Outlet Stock Transfer'
      }
    }, {
      path: 'CRM_Payment_Bank_Master',
      component: CRMPaymentBankComponent,
      data: {
        title: 'Payment Bank Master'
      }
    }, {
      path: 'Support_User_Management',
      component: TutoSupportUserManagementComponent,
      data: {
        title: 'Support User Management'
      }
    },
    {
      path: 'Outlet_Stock_Movement',
      component: OutletStockMovementComponent,
      data: {
        title: 'Outlet Stock Movement'
      }
    }, {
      path: 'Production_Voucher_New',
      component: K4cProductionVoucherNewComponent,
      data: {
        title: 'Production Voucher New'
      }
    }, {
      path: 'Internal_Stock_Transfer_New',
      component: K4cInternalStockTransferNewComponent,
      data: {
        title: 'Internal Stock Transfer New'
      }
    }, {
      path: 'Tutopia_DS_Billing',
      component: TutoDsBillComponent,
      data: {
        title: 'Direct Sale Billing'
      }
    }, {
      path: 'Tutopia_DS_Payment_Link',
      component: TutoPaymentLinkComponent,
      data: {
        title: 'Generate Payment Link'
      }
    },
    {
      path: 'Master_BOM_Reciepe',
      component: K4cMasterBOMReciepeComponent,
      data: {
        title: 'Master BOM Reciepe'
      }
    },
    {
      path: 'Issue_Stock_Adjustment',
      component: IssueStockAdjustmentComponent,
      data: {
        title: 'Issue Stock Adjustment'
      }
    },
    {
      path: 'Receive_Stock_Adjustment',
      component: ReceiveStockAdjustmentComponent,
      data: {
        title: 'Receive Stock Adjustment'
      }
    },
    {
      path: 'Store_Item_Indent',
      component: StoreItemIndentComponent,
      data: {
        title: 'Store Item Indent'
      }
    }, {
      path: 'Speech_DoctorsAppointment',
      component: HearingSpeechAppointmentComponent,
      data: {
        title: 'Speech Appointment'
      }
    },
    {
      path: 'Outlet_Txn_Bank_Deposit',
      component: OutletTxnBankDepositComponent,
      data: {
        title: 'Outlet Txn Bank Deposit'
      }
    },
    {
      path: 'Factory_Indent_Advance_Order',
      component: K4cFactoryIndentAdvanceComponent,
      data: {
        title: 'Indent Adv Order'
      }
    }, {
      path: 'Master_UOM_Common',
      component: MasterUOMCommonComponent,
      data: {
        title: 'Master UOM'
      }
    },
    {
      path: 'Raw_Material_Issue',
      component: K4cRawMaterialIssueComponent,
      data: {
        title: 'Raw Material Issue'
      }
    },
    {
      path: 'Raw_Material_Indent',
      component: K4cRawMaterialIndentComponent,
      data: {
        title: 'Raw Material Indent'
      }
    },
    {
      path: 'Outlet_Physical_Closing_Stock',
      component: OutletPhysicalClosingStockComponent,
      data: {
        title: 'Outlet Physical Closing Stock'
      }
    }, {
      path: 'Raw_Material_Stock_Transfer',
      component: K4cRawMaterialStockTransferComponent,
      data: {
        title: 'Raw Material Stock Transfer'
      }
    },
    {
      path: 'K4C_Dispatch_to_Outlet_Store',
      component: K4cDispatchOutletStoreComponent,
      data: {
        title: 'Dispatch to Outlet Store'
      }
    },
    {
      path: 'Purchase_Planing',
      component: K4cPurchasePlaningComponent,
      data: {
        title: 'Purchase Planing'
      }
    },
    {
      path: 'K4C_Outlet_Stock_Report',
      component: K4cOutletStockReportComponent,
      data: {
        title: 'Stock Report'
      }
    },
    {
      path: 'K4C_Day_End_Process',
      component: K4cDayEndProcessComponent,
      data: {
        title: 'Day End Process'
      }
    }, {
      path: 'Update_Expiry',
      component: UpdateExpiryComponent,
      data: {
        title: 'Updated Expiry'
      }
    },
    {
      path: 'Closing_Stock_With_Expiry_Date',
      component: ClosingStockWithExpiryDateComponent,
      data: {
        title: 'Closing Stock With Expiry'
      }
    },
    {
      path: 'BL_CRM_Master_SalesTeam_Field_Sales',
      component: TutoSaleTreeFieldComponent,
      data: {
        title: 'Sales Tree Field Sales'
      }
    },
    {
      path: 'BL_CRM_Master_SalesTeam_Inside_Sales',
      component: TutoSalesTreeInsideSalesComponent,
      data: {
        title: 'Sales Team Inside Sales'
      }
    }, {
      path: 'Tutopia_CRM_Lead_Field_Sales',
      component: TutoCrmLeadFieldSaleComponent,
      data: {
        title: 'Followup Management (Channel Sale)'
      }
    }, {
      path: 'Tutoipa_BL_CRM_Temp_To_New_Lead',
      component: TutoTempCrmLeadComponent,
      data: {
        title: 'Followup Management (Channel Sale)'
      }
    },
    {
      path: 'Tutopia_DS_Dashboard',
      component: TutoDsDashboardComponent,
      data: {
        title: 'DS Dashboard'
      }
    },
    {
      path: 'Tutopia_Web_Demo_Followup',
      component: TutoWebDemLeadFollowupComponent,
      data: {
        title: 'Web Demo Followup'
      }
    },
    {
      path: 'Tutopia_Audit_Appointment',
      component: TutoAuditLeadFollowupComponent,
      data: {
        title: 'Audit Appointment'
      }
    }, {
      path: 'Outlet_Closing_Stock_With_Batch',
      component: OutletClosingStockWithBatchComponent,
      data: {
        title: 'Outlet Closing Stock With Batch'
      }
    },
    {
      path: 'Adv_Order_Internal_Stock_Transfer',
      component: K4cAdvOrderInternalStockTransferComponent,
      data: {
        title: 'Advance Order Internal Stock Transfer'
      }
    }, {
      path: 'Tutopia_Post_Sales_Audit',
      component: TutoPostSaleAuditLeadFollowupComponent,
      data: {
        title: 'POST SALE AUDIT'
      }
    },
    {
      path: 'Tutopia_BDA_Report',
      component: TutoBdaReportComponent,
      data: {
        title: 'BDA Report'
      }
    }, {
      path: 'Tutopia_School_Request_Details',
      component: TutoSchoolRequestDetailsComponent,
      data: {
        title: 'School Request'
      }
    }, {
      path: 'BL_Txn_Civil_Running_Bill_Details',
      component: CompacctRunningBillComponent,
      data: {
        title: 'Running Bill Details'
      }
    }, {
      path: 'BL_Txn_Civil_Daily_Job',
      component: CompacctCivildailyJobComponent,
      data: {
        title: 'Daily Progress Report (Civil) '
      }
    }, {
      path: 'BL_CRM_Txn_Enq_Tender',
      component: CompacctTenderComponent,
      data: {
        title: 'Tender '
      }
    }, {
      path: 'BL_CRM_Lead_Interaction_Nepal',
      component: CrmLeadOpportunitiesComponent,
      data: {
        title: 'All Opportunities '
      }
    }, {
      path: 'BL_CRM_Lead_Details_Nepal',
      component: CrmLeadTaskDetailsComponent,
      data: {
        title: 'Lead Details '
      }
    }, {
      path: 'Stock_Adjustment_for_Store_Items',
      component: K4cStockAdjustmentStoreItemsComponent,
      data: {
        title: 'Stock Adjustment For Store Items '
      }
    }, {
      path: 'Tutopia_Web_Demo_Team',
      component: TutoWebDemoTeamComponent,
      data: {
        title: 'Tutopia Web Demo Team '
      }
    }, {
      path: 'Tutopia_Pre_Sale_Audit_Team',
      component: TutoPreSaleAuditTeamComponent,
      data: {
        title: 'Tutopia Pre Sale Audit Team '
      }
    }, {
      path: 'Tutopia_Post_Sale_Audit_Team',
      component: TutoPostSaleAuditTeamComponent,
      data: {
        title: 'Tutopia Post Sale Audit Team '
      }
    },
    {
      path: 'Tutopia_Field_Sales_School',
      component: TutoFieldSalesSchoolComponent,
      data: {
        title: 'Tutopia Field Sales School '
      }
    }, {
      path: 'Raw_SemiFinished_Nonsaleable_Closing_Stock',
      component: K4cRsnsClosingStockComponent,
      data: {
        title: 'Raw SemiFinished Nonsaleable Closing Stock '
      }
    },
    {
      path: 'Project_Estimate',
      component: HarbaProjectEstimateComponent,
      data: {
        title: 'Project Estimate'
      }
    },
    {
      path: 'Direct_Payment_Followup_Nepal',
      component: DirectPaymentFollowupNepalComponent,
      data: {
        title: 'Direct Payment Followup'
      }
    },
    {
      path: 'Franchise_Sale_Bill',
      component: K4cFranchiseSaleBillComponent,
      data: {
        title: 'Franchise Sale Bill'
      }
    },
    {
      path: 'Tender_Estimate',
      component: TenderEstimateComponent,
      data: {
        title: 'Tender Estimate'
      }
    },
    {
      path: 'BL_CRM_Master_Package_New',
      component: HearingPackageMasterComponent,
      data: {
        title: 'Package Master'
      }
    },
    {
      path: 'BL_CRM_TXN_TASK',
      component: CompacctTxnTaskComponent,
      data: {
        title: 'Txn Task'
      }
    },
    {
      path: 'Tutopia_Manual_Payment_Collection',
      component: TutoManualPaymentCollectionComponent,
      data: {
        title: 'Manual Payment Collection'
      }
    },
    {
      path: 'Outlet_Sale_Bill_WithOut_batch_Select',
      component: OutletSaleBillWithoutBatchSelectComponent,
      data: {
        title: 'Take Away (Auto Batch)'
      }
    },
    {
      path: 'Outlet_Stock_Transfer_Atuto_Batch',
      component: OutletStockTransferAutoBatchComponent,
      data: {
        title: 'Outlet Stock Transfer(Auto Batch)'
      }
    },
    {

      path: 'Bill_Edit_From_Admin',
      component: BillEditFromAdminComponent,
      data: {
        title: 'Sale Bill'
      }
    },
    {
      path: 'BL_CRM_Txn_Enq_Tender_Harbauer',
      component: TxnEnqTenderHarbauerComponent,
      data: {
        title: 'Txn Enq Tender'
      }
    },
    {
      path: 'Tutopia_Upload_Data_Support',
      component: TutoUploadDataSupportComponent,
      data: {
        title: 'Upload Data Support'
      }
    },
    {
      path: 'Engg_Nepal_Machine_Master',
      component: EnggNepalMachineMasterComponent,
      data: {
        title: 'Machine Master'
      }
    },
    {
      path: 'Engg_Nepal_Spare_Parts',
      component: EnggNepalSparePartsComponent,
      data: {
        title: 'Spare Parts And Ink Master'
      }
    },
    {
      path: 'BL_CRM_Txn_Enq_Tender_Budget',
      component: TenderBudgetComponent,
      data: {
        title: 'Tender Budget'
      }
    },
    {
      path: 'BL_CRM_Txn_Enq_Tender_Harbauer_View',
      component: TenderHarbauerViewComponent,
      data: {
        title: 'Tender Edit (GOVT.)'
      }
    },
    {
      path: 'Master_Accounting_Subledger_Nepal',
      component: NepalMasterSubledgerComponent,
      data: {
        title: 'Master Subledger'
      }
    },
    {
      path: 'Harbauer_Master_Product_mechanical',
      component: HarbauerMasterProductMechanicalComponent,
      data: {
        title: 'Master Product mechanical'
      }
    },
    {
      path: 'Outlet_Group_Report',
      component: OutletGroupReportComponent,
      data: {
        title: 'Group Report'
      }
    },
    {
      path: 'BL_Txn_K4C_Crate_IN_OUT',
      component: K4cCrateInOuComponent,
      data: {
        title: 'BL Txn K4C Crate IN OUT'
      }
    },
    {
      path: 'BL_CRM_ENGG_Master_Nepal',
      component: BlCrmEnggMasterNepalComponent,
      data: {
        title: 'BL CRM ENGG Master Nepal'
      }
    },
    {
      path: 'Outlet_Group_Report',
      component: OutletGroupReportComponent,
      data: {
        title: 'Group Report'
      }
    },
    {
      path: 'BL_CRM_Txn_Enq_Tender_Harbauer_View_Actual',
      component: TenderHarbauerActualViewComponent,
      data: {
        title: 'Tender View (GOVT.)'
      }
    },
    {
      path: 'Engg_CRM_Installed_Machine',
      component: EnggCrmInstalledMachineComponent,
      data: {
        title: 'Installed Machine'
      }
    },
    {
      path: 'Engg_CRM_Installed_Machine_Service_Contract',
      component: EnggCrmInstalledMachineServiceContractComponent,
      data: {
        title: 'Service Contract'
      }
    },
    {
      path: 'BL_CRM_Txn_Enq_Budget_Aproval',
      component: TenderBudgetAprovalComponent,
      data: {
        title: 'Budget Approval'
      }
    },
    {
      path: 'Support_Ticket_Nepal',
      component: SupportTicketNepalComponent,
      data: {
        title: 'Support Ticket'
      }
    },
    {
      path: 'Stock_Transfer_To_Store',
      component: StockTransferToStoreComponent,
      data: {
        title: 'Stock Transfer To Store'
      }
    },
    {
      path: 'Harbauer_Master_Product_Electrical',
      component: HarbMasterProductElectricalComponent,
      data: {
        title: 'Master Product Electrical'
      }
    },
    {
      path: 'BL_CRM_Txn_Enq_Tender_Budget_Single',
      component: TenderSingleSchBudgetComponent,
      data: {
        title: 'Single Scheme Budget'
      }
    },
    {
      path: 'BL_CRM_Txn_Enq_Tender_Budget_Multiple',
      component: TenderMultipleSchBudgetComponent,
      data: {
        title: 'Multiple Scheme Budget'
      }
    },
    {
      path: 'Harbauer_Master_Product_Civil',
      component: HarbMasterProductCivilComponent,
      data: {
        title: 'Master Product Civil'
      }
    },
    {
      path: 'Support_Ticket_Pending_Calls_Nepal',
      component: SupportTicketPendingCallsNepalComponent,
      data: {
        title: 'Pending Calls'
      }
    },
    {
      path : 'Semi_Finished_Production_Voucher',
      component:SemiFinishedProductionVoucherComponent,
      data: {title: 'Production_Voucher (Semi Finished)'}
  },
  {
    path : 'Credit_Note',
    component:K4cCreditNoteBrowseComponent,
    data: {title: 'Credit Note'}
},
{
  path: 'Tutopia_Support_Calender_Dashboard',
  component: TutoSupportCalenderDashboardComponent,
  data: {
    title: 'Calender Dashboard'
  }
}


    /*{


      /*{
           path: '404',
           loadChildren: () => import('src/app/admin/pageNotFound/pageNotFound.route.module').then(m => m.PageNotFoundModule)
          },
         {path: '**', redirectTo: '/404'}*/
  ]
}];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(layoutRoutes)],
  exports: [RouterModule]
})
export class LayoutRouteModule {}
