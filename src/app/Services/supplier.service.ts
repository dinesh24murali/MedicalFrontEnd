import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Purchase, Item, PurchaseData } from '../Models/Record/Record';

@Injectable()
export class SupplierService {

    private portNo = "7070";

    constructor(private http: Http) { }

    GetFilteredSuppliers(searchText: string) {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Supplier/GetFilteredSuppliers", 'data={"queryString":"' + searchText + '"}', options)
            .map(response => response.json());
    }

    GetPurchaseForPayment(supplierId: string, fromDate: string, toDate: string): Promise<Purchase[]> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Supplier/GetPurchaseForPayment", 'data={"SupplierId":"' + supplierId + '","FromDate":"' + fromDate + '","ToDate":"' + toDate + '"}', options).toPromise()
            .then(response => response.json() as Purchase[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('error occured', error);
        return Promise.reject(error.message || error);
    }
}