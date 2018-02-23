import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MdSnackBar, MdDialogRef, MdDialog, MdDialogConfig, MdSidenav } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

import { ExceptionDialog } from '../Shared/exception-dialog.component';
import { Supplier, Purchase } from '../../Models/Record/Record';
import { SupplierService } from '../../Services/supplier.service';

@Component({
    selector: 'supplier-payment',
    templateUrl: 'app/Views/Payment/supplier-payment.component.html',
    styles: [`
    .viewRecord{
      padding: 20px 20px 20px 20px;
    }
    .view-container{
      width:1000px;
    }
    md-sidenav-container {
      position: fixed;
      height: 100%;
      min-height: 100%;
      width: 100%;
      min-width: 80%;
   }
    `]
})
export class SupplierPaymentComponent implements OnInit, OnDestroy {

    @ViewChild('sidenav') public viewRecordNav: MdSidenav;

    suppliersList: Supplier[] = [];
    selSupplier: string = 'steak-0';
    suppSubscribe: any;

    selectAllToggle: boolean = false;

    purchaseRecords: Purchase[] = [];
    checkedRecords: Purchase[] = [];
    totalAmount: number = 0;
    view_Id: string = "";
    view_BillNo: string = "";
    view_BillAmt: number = 0;
    view_BillDate: string = "";
    view_Supplier: string = "";

    invoiceNo = new FormControl("", [Validators.required]);
    invoiceDate = new FormControl("", [Validators.required]);

    constructor(private supplierService: SupplierService, public dialog: MdDialog, public snackBar: MdSnackBar) {}

    ngOnInit() {
        this.suppSubscribe = this.supplierService.GetFilteredSuppliers(null)
            .subscribe(res => {
                if (res[0])
                    this.selSupplier = res[0].id;
                this.suppliersList = res;
            });
    }

    ngOnDestroy() {
        this.suppSubscribe.unsubscribe();
    }

    clearFilter(result: any) {
        this.purchaseRecords = result;
    }

    fetchRecords(result: any) {
        this.purchaseRecords = result;
    }

    viewRecord(row: Purchase) {
        this.view_Id = row.Id;
        this.view_BillDate = row.BillDate;
        this.view_BillNo = row.BillNo;
        this.view_BillAmt = row.Purchase_amt;
        this.view_Supplier = row.Supplier;
        this.viewRecordNav.open();
    }

    deleteRecord(result: string) {
        if (result) {
            this._openExceptionDialog(result);
        } else {
            let record = this.purchaseRecords.find(item => item.Id === this.view_Id);
            this.purchaseRecords.splice(this.purchaseRecords.indexOf(record), 1);
            this.snackBar.open('Record Deleted', 'Ok', {
                duration: 3000
            });
            this.calcTotal();
            this.viewRecordNav.close();
        }
    }

    calcTotal() {
        let scope = this;
        this.totalAmount = 0;
        this.checkedRecords.forEach(function (item) {
            scope.totalAmount += item.Purchase_amt;
        });
    }

    payment(){

    }

    _openExceptionDialog(message: string): void {
        let config = new MdDialogConfig(),
            dialogRef: MdDialogRef<ExceptionDialog> = this.dialog.open(ExceptionDialog, config);
        dialogRef.componentInstance.title = "Exception";
        dialogRef.componentInstance.message = message;
    }
}