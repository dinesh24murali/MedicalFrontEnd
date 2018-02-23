import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import { PurchaseData, SalesData, Item } from '../../Models/Record/Record';
import { PurchaseService } from '../../Services/purchase.service';
import { SalesService } from '../../Services/sales.service';
import { SupplierService } from '../../Services/supplier.service';

@Component({
    selector: 'date-filter',
    template: `<md-grid-list [cols]="cols" [rowHeight]="rowHeight">
    <md-grid-tile [colspan]="colspan">
        <md-input-container class="full-width">
            <input mdInput [mdDatepicker]="FromDate" placeholder="From Date" [formControl]="fromDate">
            <button mdSuffix [mdDatepickerToggle]="FromDate"></button>
        </md-input-container>
        <md-datepicker #FromDate></md-datepicker>
    </md-grid-tile>

    <md-grid-tile [colspan]="colspan">
        <md-input-container class="full-width">
            <input mdInput [mdDatepicker]="ToDate" placeholder="To Date" [formControl]="toDate">
            <button mdSuffix [mdDatepickerToggle]="ToDate"></button>
        </md-input-container>
        <md-datepicker #ToDate></md-datepicker>
    </md-grid-tile>
    <md-grid-tile [colspan]="colspan">
        <button (click)="search()" md-raised-button color="primary">
            <i class="material-icons">search</i> Search</button>
    </md-grid-tile>
    <md-grid-tile [colspan]="colspan">
        <button (click)="clearFilter(false)" md-raised-button>
            Clear</button>
    </md-grid-tile>
</md-grid-list> `
})
export class DateFilter {

    @Input() public cols: string = '';
    @Input() public rowHeight: string = '';
    @Input() public colspan: string = '';
    @Input('page') public page: any;

    // for Supplier Payment Page
    _supplierId: string = '';
    @Input()
    set supplierId(supplierId: string) {
        this._supplierId = supplierId;
        this.clearFilter(true);
    }
    get supplierId() {
        return this._supplierId;
    }

    @Output('fetchRecordEvent') public filterOutput = new EventEmitter<any[]>();
    @Output('clearDateFilterEvent') public clearFilterOutput = new EventEmitter<any[]>();

    fromDate = new FormControl();
    toDate = new FormControl();

    private records: any[];

    ngOnInit(): void {
    }

    constructor(private purchaseService: PurchaseService, private salesService: SalesService, private snackBar: MdSnackBar,
        private supplierService: SupplierService) {

    }

    search() {

        if (this.fromDate.value == null && this.toDate.value == null)
            return;
        let fDate = new Date(this.fromDate.value),
            tDate = new Date(this.toDate.value),
            fromDate = this.fromDate.value != null ? fDate.getFullYear() + "-" + (fDate.getMonth() + 1) + "-" + fDate.getDate() : "",
            toDate = this.toDate.value != null ? tDate.getFullYear() + "-" + (tDate.getMonth() + 1) + "-" + tDate.getDate() : "";

        switch (this.page.page) {
            case "viewRecord":
                if (this.page.type == "Purchase")
                    this.purchaseService.GetPurchaseRecords(fromDate, toDate, "date")
                        .then(res => {
                            this.filterOutput.emit(res);
                            this.snackBar.open('Purchase Fetch Successful', 'Ok', {
                                duration: 2000
                            });
                        });
                else
                    this.salesService.GetSalesRecords(fromDate, toDate, "date")
                        .then(res => {
                            this.filterOutput.emit(res);
                            this.snackBar.open('Sales Fetch Successful', 'Ok', {
                                duration: 2000
                            });
                        });
                break;
            case "supplierPayment":
                this.supplierService.GetPurchaseForPayment(this._supplierId, fromDate, toDate)
                    .then(res => {
                        this.filterOutput.emit(res);
                        this.snackBar.open('Purchase Fetch Successful', 'Ok', {
                            duration: 2000
                        });
                    });
                break;
        }
    }

    clearFilter(supplierChangeFlag: boolean) {

        if (this.fromDate.value == null && this.toDate.value == null && !supplierChangeFlag)
            return;
        this.fromDate.reset();
        this.toDate.reset();

        switch (this.page.page) {
            case "viewRecord":
                if (this.page.type == "Purchase")
                    this.purchaseService.GetPurchaseRecords("", "", "date")
                        .then(res => {
                            this.clearFilterOutput.emit(res);
                        });
                else
                    this.salesService.GetSalesRecords("", "", "date")
                        .then(res => {
                            this.clearFilterOutput.emit(res);
                        });
                break;
            case "supplierPayment":
                if (this._supplierId) {
                    this.supplierService.GetPurchaseForPayment(this._supplierId, '', '')
                        .then(res => {
                            let copyData = JSON.parse(JSON.stringify(res));
                            res = res.concat(copyData);
                            this.filterOutput.emit(res);
                        });
                }
                break;
        }
    }
}