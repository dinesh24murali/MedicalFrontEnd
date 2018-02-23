import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationExtras } from '@angular/router';
import { MdSidenav } from '@angular/material';

import { PurchaseData } from '../../Models/Record/Record';
import { PurchaseService } from '../../Services/purchase.service';
import { SalesService } from '../../Services/sales.service';

@Component({
    selector: 'peek-record',
    templateUrl: './../../Views/Record/peek-record.component.html',
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
export class PeekRecord {

    _billId: string = '';
    @Input() public billNo: string = '';
    @Input() public billDate: string = '';
    @Input() public supplier: string = '';
    @Input() public customer: string = '';
    @Input() public type: string = '';
    @Input() public billAmt: string = '';
    @Input('billId')
    set billId(billId: string) {
        this._billId = billId;
        this.fetchRecordData();
    }
    get billId() {
        return this._billId;
    }

    @Output() public deleteRecordEvent = new EventEmitter<string>();

    private peek_recordItems: PurchaseData[] = [];

    constructor(private purchaseService: PurchaseService, private salesService: SalesService, private router: Router, ) { }

    fetchRecordData() {
        if (this._billId)
            if (this.type == "Purchase")
                this.purchaseService.GetPurchaseRecordData(this._billId)
                    .then(res => {
                        this.peek_recordItems = res;
                    });
            else
                this.salesService.GetSalesRecordData(this._billId)
                    .then(res => {
                        this.peek_recordItems = res;
                    });
    }

    editRecord() {
        if (this.type == "Purchase")
            this.router.navigate(['/record/Purchase'], { queryParams: { id: this._billId } });
        else
            this.router.navigate(['/record/Sales'], { queryParams: { id: this._billId } });
    }

    deleteRecord() {
        if (this.type == "Purchase")
            this.purchaseService.DeletePurchaseRecord(this._billId)
                .then(res => {
                    if (res.Error)
                        this.deleteRecordEvent.emit(res.Message);
                    else
                        this.deleteRecordEvent.emit('');
                });
        else
            this.salesService.DeleteSalesRecord(this._billId)
    }
}    