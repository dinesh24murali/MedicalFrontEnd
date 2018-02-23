import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Sales, Item, SalesData, PurchaseData } from '../Models/Record/Record';

@Injectable()
export class SalesService {

    private portNo = "7070";

    constructor(private http: Http) { }

    AddSalesRecord(sales: Sales, items: SalesData[]): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Sales/AddSalesRecord", 'data={"RecordDetail":' + JSON.stringify(sales) + ',"Items":' + JSON.stringify(items) + '}', options).toPromise()
            .then((response: any) => {
                return response._body ? JSON.parse(response._body) : {};
            }).catch(function (response) {
                return { Error: true, type: 'Network Error' };
            });
    }

    GetSalesRecords(value1: string, value2: string, type: string): Promise<Sales[]> {
        let postRequestData: string;
        if (type == "date")
            postRequestData = 'data={"FromDate":"' + value1 + '","ToDate":"' + value2 + '","Type":"' + type + '"}';
        else
            postRequestData = 'data={"BillNo":"' + value1 + '","Customer":"' + value2 + '","Type":"' + type + '"}';

        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Sales/GetSalesRecords", postRequestData, options).toPromise()
            .then(response => response.json() as Sales[])
            .catch(this.handleError);
    }

    // In the view the sales records are viewed as same as the purchase records so we use the same model
    GetSalesRecordData(RecordId: string): Promise<PurchaseData[]> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Sales/GetSalesRecordData", 'data={"RecordId":"' + RecordId + '"}', options).toPromise()
            .then(response => response.json() as PurchaseData[])
            .catch(this.handleError);
    }

    GetSalesRecord(RecordId: string, forEdit: boolean): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Sales/GetSalesRecord", 'data={"RecordId":"' + RecordId + '","forEdit":' + forEdit + '}', options).toPromise()
            .then(response => response.json() as any)
            .catch(this.handleError);
    }

    UpdateSalesRecord(sales: Sales, AddItems: Item[], UpdateItems: any[], RemoveItems: Item[]): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Sales/UpdateSalesRecord", 'data={"RecordDetail":' + JSON.stringify(sales) + ',"AddItems":' + JSON.stringify(AddItems) + ',"UpdateItems":' + JSON.stringify(UpdateItems) + ',"RemoveItems":' + JSON.stringify(RemoveItems) + '}', options).toPromise()
            .then(response => {
                return response;
            }).catch(function (response) {
                return { error: true, type: 'Network Error' };
            });
    }

    DeleteSalesRecord(RecordId: string): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Sales/DeleteSalesRecord", 'data={"RecordId":"' + RecordId + '"}', options).toPromise()
            .then((response: any) => JSON.parse(response._body))
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('error occured', error);
        return Promise.reject(error.message || error);
    }
}