import { NgModule, Component } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

import { AppLayoutComponent } from "./layout.component";
import { StocktransferComponent } from "./common/MaterialManagement/Transaction/compacct.stocktransfer/compacct.stocktransfer.component";
// import { CompacctSynComponent } from './common/CRM/Transaction/compacct.syn/compacct.syn.module';
import { MasterProductComponent } from "./common/MaterialManagement/Master/master.product/master.product.component";
import { MasterProductHearingComponent } from "./common/MaterialManagement/Master/master-product-hearing/master-product-hearing.component";
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

const layoutRoutes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    data: { title: "Dashboard" },
    children: [
      {
        path: "Business_Dashboard",
        loadChildren: () =>
          import("./dashBoard/compacct.dashboard.module").then(
            m => m.CompacctDashboardModule
          ),
        data: { title: "Business Dashboard" }
      },
      {
        path: "INV_Txn_St_Trf_GST",
        component: StocktransferComponent,
        data: { title: "Stock Transfer" }
      },
      {
        path: "scheduler_operation",
        loadChildren: () =>
          import(
            "./common/CRM/Transaction/compacct.scheduler/compacct.scheduler.module"
          ).then(m => m.CompacctSchedulerModule),
        data: { title: "Appointment Scheduler" }
      },
      {
        path: "Master_Product_V2",
        component: MasterProductComponent,
        data: { title: "Master Product" }
      },
      {
        path: "Master_Cost_Center_V2",
        component: MasterCostCenterComponent,
        data: { title: "Master Cost Center" }
      },
      {
        path: "Seed_Process",
        component: SeedProcessComponent,
        data: { title: "Seed Process" }
      },
      {
        path: "PP_Bag_Process",
        component: PpBagProcessComponent,
        data: { title: "Seed Process" }
      },
      {
        path: "BL_Txn_Purchase_Bill_Complete",
        component: CompacctPurchasebillGstComponent,
        data: { title: "Purchase Bill" }
      },
      {
        path: "Oil_Production",
        component: OilProductionComponent,
        data: { title: "Oil Production" }
      },
      {
        path: "BNB_New_Lead",
        component: CompacctBnbLeadComponent,
        data: { title: "Lead" }
      },
      {
        path: "EXP_Doc_Comm_Inv",
        component: CommercialInvoiceComponent,
        data: { title: "EXP_Doc_Comm_Inv" }
      },
      {
        path: "Export_Charges",
        component: CompacctBnbexportsComponent,
        data: { title: "Export Charge" }
      },
      {
        path: "Export_Transportation",
        component: TransportationComponent,
        data: { title: "Export_Transportation" }
      },
      {
        path: "Exp_Doc_Sale_Contract",
        component: SalesContractComponent,
        data: { title: "Exp Doc Sale Contract" }
      },
      {
        path: "BNB_BL_CRM_Lead_Browse",
        component: CompacctBnbLeadbydateComponent,
        data: { title: "Lead Search By Date" }
      },
      {
        path: "Container_Booking",
        component: ContainerBookingComponent,
        data: { title: "Container Booking" }
      },
      {
        path: "Hearing_Audiogram_Graph",
        component: CompacctAudiogramComponent,
        data: { title: "Audiogram" }
      },
      {
        path: "Currency_Booking",
        component: CurrencyBookingComponent,
        data: { title: "Currency Booking" }
      },
      {
        path: "BL_Txn_ST_Trf_Tank",
        component: StockTransferTankComponent,
        data: { title: "Stock Trans For Tank" }
      },
      {
        path: "Machine_Uses",
        component: MachineUsesComponent,
        data: { title: "Machine Uses" }
      },
      {
        path: "Master_Product_HA",
        component: MasterProductHearingComponent,
        data: { title: "Master Product HA" }
      },
      {
        path: "Renewal",
        component: RenewalComponent,
        data: { title: "Renewal" }
      },
      {
        path: "Renewal_Type",
        component: RenewalTypeComponent,
        data: { title: "Renewal Type" }
      },
      {
        path: "BL_CRM_Master_Consultancy_V2",
        component: ConsultancyComponent,
        data: { title: "BL_CRM_Master_Consultancy_V2" }
      },
      {
        path: "Master_Accounting_Ledger_V2",
        component: CompacctLedgerComponent,
        data: { title: "Accounting Ledger" }
      },
      {
        path: "Master_Product_Material_Type",
        component: MasterRoyaleMaterialTypeComponent,
        data: { title: "Material Type" }
      },
      {
        path: 'GHC_Inward_Outward_Register',
        component: InwardOutwardRegisterComponent,
        data: {title: 'GHC_Inward_Outward_Register'}
      },
      {
        path: "BL_CRM_Lead_Management_V2",
        component: CompacctRoyaleLeadComponent,
        data: { title: "Lead" }
      },
      {
        path: 'GHC_Consultancy_Commision',
        component: ConsultancyCommissionComponent,
        data: {title: 'Consultancy Commission'}
      },
      {
        path: 'GHC_Doctor_Commission_Calculator',
        component: DoctorCommissionCalculatorComponent,
        data: {title: 'Doctor Commission Calculator'}
      },
      {
        path: 'Hearing_Adjustment_Voucher',
        component: AdjustmentVoucherComponent,
        data: {title: 'Hearing Adjustment Voucher'}
      },
      {
        path: 'INV_Txn_Inward_Replacement',
        component: InwardReplacementComponent,
        data: {title: 'Inward Replacement'}
      },
      {
        path: 'Hearing_Quotation',
        component: ClinicTrialComponent,
        data: {title: 'Hearing Quotation'}
      },
      {
        path: 'CRM_Customer_Sales',
        component: CustomerSalesComponent,
        data: {title: 'Customer Sales'}
      },
      {
        path: 'CRM_Stock_Report',
        component: CompacctStockReportComponent,
        data: {title: 'Stock Report'}
      },
{
path: 'Tutopia_Walk_in_Lead_Creation',
component: TutoWslkinleadComponent,
data: {title: 'Walk in Lead'}
},
{
path: 'Tutopia_Pending_Subscription',
component: TutoPendsubscriptionComponent,
data: {title: 'Subscription'}
},
{
path: 'Tutopia_Receive_Voucher',
component: TutoReceiveVoucherComponent,
data: {title: 'Confirm Voucher'}
},
{
path: 'Send_Bulk_Email_Nepal',
component: BulkSmsNepalComponent,
data: {title: 'Bulk Email'}
},
{
  path: 'Tutopia_Master_Teacher',
  component: TutoMasterTeacherComponent,
  data: {title: 'Master Teacher'}
} ,
{
  path: 'Tutopia_Support_Question_Answer',
  component: TutoMastereQNAComponent,
  data: {title: 'Support Question & Answer'}
},
{
path: 'Tutopia_Support_Query',
component: TutoSupportQueryComponent,
data: {title: 'Support Query & Reply'}
} ,
{
  path: 'Tutopia_Student_Search',
  component: TutoStudentSearchComponent,
  data: {title: 'Student Search'}
} ,
{
  path: 'Tutopia_CRM_Lead',
  component: TutoLeadFollowupComponent,
  data: {title: 'Followup Management'}
},
{
  path: 'Tutopia_Master_SKU',
  component: TutoMasterSkuComponent,
  data: {title: 'Master SKU'}
} ,
{
  path: 'Tutopia_Mater_Class_Management',
  component: TutoClassManagementComponent,
  data: {title: 'Class Management'}
},
{
  path: 'K4C_Outlet_Requisition',
component: K4cOutletRequistionComponent,
data: {title: 'K4C_Outlet_Requisition'}
},
{
  path: 'K4C_Master_Cost_Center',
  component: K4cMasterCostCenterComponent,
  data: {title: 'Master Cost Center'}
  },
  {
    path: 'K4C_Master_Product',
    component: K4cMasterProductComponent,
    data: {title: 'Master Product'}
    },{
      path: 'Master_UOM',
      component: MasterUomComponent,
      data: {title: 'Master UOM'}
      },
      {
        path: 'K4C_Production_Voucher',
        component: K4CProductionVoucherComponent,
        data: {title: 'K4C Production Voucher'}
    },
    {
      path: 'K4C_Dispatch_to_Outlet',
      component: K4CDispatchToOutletComponent,
      data: {title: 'Distribution Challan'}
      },
       {
        path: 'K4C_Outlet_Sale_Bill',
        component: K4cOutletSaleBillComponent,
        data: {title: 'POS Bill'}
      },
       {
        path: 'K4C_Outlet_Advance_Order',
        component: K4cOutletAdvanceOrderComponent,
        data: {title: 'Advance Order'}
      },
      {
       path: 'POS_BIll_Order',
       component: K4cPosBillOrderComponent,
       data: {title: 'POS Bill Order'}
     },{
      path: 'Tutopia_Student_Order',
      component: TutoOrderManagementComponent,
      data: {title: 'Subscription Order Management'}
      },
      {
        path: 'Tutopia_Direct_Order_Booking',
        component: TutoOrderBookingComponent,
        data: {title: 'Direct Order Booking'}
        },
        {
          path: 'Tutopia_Order_Payment',
          component: TutoOrderPaymentComponent,
          data: {title: 'Order Payment'}
          },
          {
            path: 'Tutopia_Acc_Cash_Bank_Confirm',
            component: TutoAccCashBankConfirmComponent,
            data: {title: 'Cash Bank Confirm'}
            },{
              path: 'Tutopia_Dist_Cash_Confirm',
              component: TutoCashConfirmComponent,
              data: {title: ' Cash Deposit Confirmation'}
              },
              {
                path: 'Tutopia_Finance_Peer_Loan_Confirmation',
                component: TutoLoanConfirmationComponent,
                data: {title: ' Finance Peer Loan Confirmation'}
                },{
                  path: 'Loan_EMI_Trf',
                  component: TutoLoamEmiTransferComponent,
                  data: {title: 'Loan EMI Transfer'}
                  },
                  {
                    path: 'Tutopia_CRM_Master_SalesTeam',
                    component: TutoMasterSalesteamComponent,
                    data: {title: 'Channel Sales Team'}
                    },
         {
          path: 'K4C_Factory_Return',
          component: K4cFactoryReturnComponent,
          data: {title: 'k4C FACTORY RETURN'}
        },
        {
          path: 'K4C_Advance_Order_Production',
          component: K4cAdvanceProductionComponent,
          data: {title: 'Advance Order Production'}
          },


        {
          path: 'K4C_Dispatch_Outlet_Adv_Order',
          component: K4CDispatchOutletAdvOrderComponent,
          data: {title: 'Custom Order Distribution'}
          },{
            path: 'Tutopia_Support_Master',
            component: TutoSupportMasterComponent,
            data: {title: 'Support Ticket Master'}
          },{
            path: 'DIPL_Support_Ticket',
            component: DiplSupportTicketComponent,
            data: {title: 'Support Ticket'}
          },{
            path: 'DIPL_Service_Team',
            component: DiplMasterSalesteamComponent,
            data: {title: 'Sales Team'}
          },{
            path: 'Create_Start_Production',
            component: K4cCreateStartProductionComponent,
            data: {title: 'Create Start Production'}
          },{
            path: 'K4C_Cutoff',
            component: K4cCutoffComponent,
            data: {title: 'Cutoff Time'}
            },
      /*{
           path: '404',
           loadChildren: () => import('src/app/admin/pageNotFound/pageNotFound.route.module').then(m => m.PageNotFoundModule)
          },
         {path: '**', redirectTo: '/404'}*/
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(layoutRoutes)],
  exports: [RouterModule]
})
export class LayoutRouteModule {}
