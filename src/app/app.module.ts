import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CdkTableModule } from '@angular/cdk';

import { MaterialModule, MdNativeDateModule, MdInputModule, MdSelectModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppRoutingModule } from './Modules/app-routing.module';
import { DashBoardComponent } from './Components/dashboard.component';
import { RecordComponent } from './Components/Record/record.component';
import { SupplierPaymentComponent } from './Components/Payment/supplier-payment.component';
import { ViewRecordComponent } from './Components/Record/view-record.component';
import { SampleComponent } from './Components/Record/sample.component';
import { AppComponent } from './Components/app.component';

import { DialogTempComponent } from './Components/Shared/dialog-temp.component';
import { AddNewProductDialog } from './Components/Shared/addNewProduct-temp.component';
import { ExceptionDialog } from './Components/Shared/exception-dialog.component';
import { DateFilter } from './Components/Shared/dateFilter.component';
import { PeekRecord } from './Components/Shared/peek-record.component';

import { ComponentsService } from './Services/components.service';
import { PurchaseService } from './Services/purchase.service';
import { SalesService } from './Services/sales.service';
import { SupplierService } from './Services/supplier.service';
import { UtilsService } from './Services/utils.service';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        MdNativeDateModule,
        AppRoutingModule,
        MdInputModule,
        CdkTableModule,
        NgxDatatableModule,
        MdSelectModule
    ],
    declarations: [
        DashBoardComponent,
        AppComponent,
        RecordComponent,
        AddNewProductDialog,
        DialogTempComponent,
        SampleComponent,
        ViewRecordComponent,
        SupplierPaymentComponent,
        ExceptionDialog,
        DateFilter,
        PeekRecord
    ],
    bootstrap: [AppComponent],
    entryComponents: [AddNewProductDialog, DialogTempComponent, ExceptionDialog],
    providers: [ComponentsService, PurchaseService, SalesService, UtilsService, SupplierService]
})
export class AppModule { }
