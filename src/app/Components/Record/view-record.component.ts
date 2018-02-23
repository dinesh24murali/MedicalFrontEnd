import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationExtras } from '@angular/router';
import { MdSnackBar, MdDialogRef, MdDialog, MdDialogConfig, MdSidenav } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { DialogTempComponent } from '../Shared/dialog-temp.component';
import { ExceptionDialog } from '../Shared/exception-dialog.component';
import { Purchase, PurchaseData, Sales, SalesData } from '../../Models/Record/Record';
import { PurchaseService } from '../../Services/purchase.service';
import { SalesService } from '../../Services/sales.service';

@Component({
  selector: 'view-record',
  templateUrl: './../../Views/Record/view-record.component.html',
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
export class ViewRecordComponent implements OnInit, OnDestroy {

  purchaseRecords: Purchase[] = [];
  salesRecords: Sales[] = [];

  fromDate = new FormControl();
  toDate = new FormControl();
  title: string;
  private routeSubscribe: any;
  private querySubscribe: any;
  filterBillNo: string = "";
  filterSupplier: string = "";
  filterCustomer: string = "";

  view_BillNo: string;
  view_BillAmt: string;
  view_Id: string;
  view_BillDate: string;
  view_Supplier: string = '';
  view_Customer: string = '';
  view_recordItems: PurchaseData[] = [];
  peekCtrl: boolean = false;
  id: any;

  isDateFilterSet: boolean = false;
  tempPurchaseRecords: Purchase[] = [];
  tempSalesRecords: Sales[] = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('sidenav') public viewRecordNav: MdSidenav;

  constructor(private route: ActivatedRoute, private router: Router, public snackBar: MdSnackBar, public dialog: MdDialog, private purchaseService: PurchaseService, private salesService: SalesService) { }

  ngOnInit(): void {

    this.id = undefined;

    this.routeSubscribe = this.route.params.subscribe(params => {
      this.title = params['type'];
      this.purchaseRecords = [];
      this.salesRecords = [];
      this.fromDate.reset();
      this.toDate.reset();

      if (this.title == "Purchase")
        this.purchaseService.GetPurchaseRecords("", "", "date")
          .then(res => {
            this.purchaseRecords = res;
          });
      else
        this.salesService.GetSalesRecords("", "", "date")
          .then(response => {
            this.salesRecords = response;
          });
    });

    this.querySubscribe = this.route
      .queryParamMap
      .subscribe(params => {
        this.id = params.get('id');
        this.view_Id = this.id;
        if (this.id)
          if (this.title == "Purchase")
            this.purchaseService.GetPurchaseRecord(this.id, false)
              .then(response => {
                this.view_BillNo = response.BillNo;
                this.view_BillAmt = response.Purchase_amt;
                this.view_Supplier = response.Supplier;
                this.view_BillDate = response.BillDate;
                this.view_recordItems = response.Items;
                this.viewRecordNav.open();
              });
          else
            this.salesService.GetSalesRecord(this.id, false)
              .then(response => {
                this.view_BillNo = response.BillNo;
                this.view_BillAmt = response.Sales_amt;
                this.view_BillDate = response.BillDate;
                this.view_Customer = response.Customer;
                this.view_recordItems = response.Items;
                this.viewRecordNav.open();
              });
      });

  }
  ngOnDestroy() {
    this.routeSubscribe.unsubscribe();
    this.querySubscribe.unsubscribe();
  }

  viewRecord(row: any): void {
    this.view_Id = row.Id;
    this.view_BillDate = row.BillDate;
    this.view_BillNo = row.BillNo;
    if (this.title == "Purchase") {
      this.view_BillAmt = row.Purchase_amt;
      this.view_Supplier = row.Supplier;
      this.viewRecordNav.open();
    } else {
      this.view_BillAmt = row.Sales_amt;
      this.view_Customer = row.Customer;
      this.viewRecordNav.open();
    }
  }

  deleteRecord(row: any): void {
    if (this.title == "Purchase") {
      this.purchaseService.DeletePurchaseRecord(row.Id)
        .then(res => {
          if (res.Error) {
            this._openExceptionDialog(res.Message);
          } else {
            if (!row)
              row = this.purchaseRecords.find(item => item.Id === row.Id);
            this.purchaseRecords.splice(this.purchaseRecords.indexOf(row), 1);
            this.snackBar.open('Record Deleted', 'Ok', {
              duration: 3000
            });
          }
        });
    } else {
      this.salesService.DeleteSalesRecord(row.Id)
        .then(res => {
          if (res.Error) {
            this._openExceptionDialog(res.Message);
          } else {
            if (!row)
              row = this.salesRecords.find(item => item.Id === row.Id);
            this.salesRecords.splice(this.salesRecords.indexOf(row), 1);
            this.snackBar.open('Record Deleted', 'Ok', {
              duration: 3000
            });
          }
        });
    }
  }
  deleteRecordFromView(result: string) {
    if (result) {
      this._openExceptionDialog(result);
    } else {
      let record;
      if (this.title == "Purchase") {
        record = this.purchaseRecords.find(item => item.Id === this.view_Id);
        this.purchaseRecords.splice(this.purchaseRecords.indexOf(record), 1);
      } else {
        record = this.salesRecords.find(item => item.Id === this.view_Id);
        this.salesRecords.splice(this.salesRecords.indexOf(record), 1);
      }
      this.snackBar.open('Record Deleted', 'Ok', {
        duration: 3000
      });
      this.viewRecordNav.close();
    }
  }
  editRecord(row: Purchase): void {
    let Id = row ? row.Id : this.view_Id;
    if (this.title == "Purchase")
      this.router.navigate(['/record/Purchase'], { queryParams: { id: Id } });
    else
      this.router.navigate(['/record/Sales'], { queryParams: { id: Id } });
  }

  updateFilter(event: any) {
    if (!this.isDateFilterSet) {
      if (this.title == "Purchase")
        this.purchaseService.GetPurchaseRecords(this.filterBillNo ? this.filterBillNo : "", this.filterSupplier ? this.filterSupplier : "", "filter")
          .then(res => {
            this.purchaseRecords = res;
          });
      else
        this.salesService.GetSalesRecords(this.filterBillNo ? this.filterBillNo : "", this.filterCustomer ? this.filterCustomer : "", "filter")
          .then(res => {
            this.salesRecords = res;
          });
    } else {
      if (this.title == "Purchase") {
        this.purchaseRecords = this.tempPurchaseRecords.filter(item => {
          return ((item.BillNo.toLocaleLowerCase().indexOf(this.filterBillNo.toLocaleLowerCase()) == 0)
            && (item.Supplier.toLocaleLowerCase().indexOf(this.filterSupplier.toLocaleLowerCase()) == 0));
        });
      } else {
        this.salesRecords = this.tempSalesRecords.filter(item => {
          return ((item.BillNo.toLocaleLowerCase().indexOf(this.filterBillNo.toLocaleLowerCase()) == 0)
            && (item.Customer.toLocaleLowerCase().indexOf(this.filterSupplier.toLocaleLowerCase()) == 0));
        });
      }
    }
    this.table.offset = 0;
  }

  openDialog(title: string, message: string): void {
    let config = new MdDialogConfig(),
      dialogRef: MdDialogRef<DialogTempComponent> = this.dialog.open(DialogTempComponent, config);
    dialogRef.componentInstance.title = "Confirm Delete";
    dialogRef.componentInstance.message = "Are you sure?";
  }

  fetchRecords(result: any) {
    this.isDateFilterSet = true;
    if (this.title == "Purchase") {
      this.filterSupplier = '';
      this.purchaseRecords = result;
      this.tempPurchaseRecords = JSON.parse(JSON.stringify(result));
    } else {
      this.filterCustomer = '';
      this.salesRecords = result;
      this.tempSalesRecords = JSON.parse(JSON.stringify(result));
    }
  }

  clearFilter(result: any) {
    this.isDateFilterSet = false;
    this.filterBillNo = "";
    if (this.title == "Purchase") {
      this.filterSupplier = "";
      this.purchaseRecords = result;
      this.tempPurchaseRecords = [];
    } else {
      this.filterCustomer = "";
      this.salesRecords = result;
      this.tempSalesRecords = [];
    }
  }

  _openExceptionDialog(message: string): void {
    let config = new MdDialogConfig(),
      dialogRef: MdDialogRef<ExceptionDialog> = this.dialog.open(ExceptionDialog, config);
    dialogRef.componentInstance.title = "Exception";
    dialogRef.componentInstance.message = message;
  }
}