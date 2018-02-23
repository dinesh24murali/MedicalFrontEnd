import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {DashBoardComponent }  from '../Components/dashboard.component';
import {RecordComponent }  from '../Components/Record/record.component';
import {ViewRecordComponent }  from '../Components/Record/view-record.component';
import {SupplierPaymentComponent }  from '../Components/Payment/supplier-payment.component';
import {SampleComponent }  from '../Components/Record/sample.component';

const routes: Routes = [
  { path: '', redirectTo: '/viewRecord/Purchase', pathMatch: 'full' },
  { path: 'dashboard',  component: DashBoardComponent },
  { path: 'record/:type',  component: RecordComponent },
  { path: 'viewRecord/:type',  component: ViewRecordComponent },
  { path: 'supplier',  component: SupplierPaymentComponent },
  { path: 'sample',  component: SampleComponent }
 ];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}