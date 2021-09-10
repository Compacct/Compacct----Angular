import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import {CommonModule} from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AzureStorageModule } from '../app/admin/shared/azure-storage/azure-storage.module';
import { FullCalendarModule } from '@fullcalendar/angular';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonModule} from 'primeng/button';

// import {DashboardRouteModule} from './admin/dashboard-routing.module';
import { AppComponent } from './app.component';


 import { CookieService } from 'ngx-cookie-service';
 import { HttpClientModule } from '@angular/common/http';
import { GlobalErrorHandler } from './admin/shared/compacct.global/errorHandler.service';
import { LayoutModule } from './admin/layout.module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';


@NgModule({
    declarations: [
        AppComponent
  ],
  imports: [
      CommonModule,
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      AzureStorageModule,
      FullCalendarModule,
      ButtonModule,
      HttpClientModule
  ],
    providers: [CookieService,
       { provide: ErrorHandler,
         useClass: GlobalErrorHandler }],
  bootstrap: [AppComponent]
})
export class AppModule { }
