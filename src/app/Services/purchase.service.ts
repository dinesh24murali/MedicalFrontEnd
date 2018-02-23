import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Purchase, Item, PurchaseData } from '../Models/Record/Record';

@Injectable()
export class PurchaseService {

    private portNo = "7070";

    constructor(private http: Http) { }

    AddPurchaseRecord(purchase: Purchase, items: Item[]): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Purchase/AddPurchaseRecord", 'data={"RecordDetail":' + JSON.stringify(purchase) + ',"Items":' + JSON.stringify(items) + '}', options).toPromise()
            .then(response => {
                return response;
            }).catch(function (response) {
                return { Error: true, type: 'Network Error' };
            });
    }

    UpdatePurchaseRecord(purchase: Purchase, AddItems: Item[], UpdateItems: any[], RemoveItems: Item[]): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Purchase/UpdatePurchaseRecord", 'data={"RecordDetail":' + JSON.stringify(purchase) + ',"AddItems":' + JSON.stringify(AddItems) + ',"UpdateItems":' + JSON.stringify(UpdateItems) + ',"RemoveItems":' + JSON.stringify(RemoveItems) + '}', options).toPromise()
            .then(response => {
                return response;
            }).catch(function (response) {
                return { error: true, type: 'Network Error' };
            });
    }

    GetPurchaseRecord(RecordId: string, forEdit: boolean): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Purchase/GetPurchaseRecord", 'data={"RecordId":"' + RecordId + '","forEdit":' + forEdit + '}', options).toPromise()
            .then(response => response.json() as any)
            .catch(this.handleError);
    }

    GetPurchaseRecords(value1: string, value2: string, type: string): Promise<Purchase[]> {
        let postRequestData: string;
        if (type == "date")
            postRequestData = 'data={"FromDate":"' + value1 + '","ToDate":"' + value2 + '","Type":"' + type + '"}';
        else
            postRequestData = 'data={"BillNo":"' + value1 + '","Supplier":"' + value2 + '","Type":"' + type + '"}';

        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Purchase/GetPurchaseRecords", postRequestData, options).toPromise()
            .then(response => response.json() as Purchase[])
            .catch(this.handleError);
    }

    GetPurchaseRecordData(RecordId: string): Promise<PurchaseData[]> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Purchase/GetPurchaseRecordData", 'data={"RecordId":"' + RecordId + '"}', options).toPromise()
            .then(response => response.json() as PurchaseData[])
            .catch(this.handleError);
    }

    DeletePurchaseRecord(RecordId: string): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Purchase/DeletePurchaseRecord", 'data={"RecordId":"' + RecordId + '"}', options).toPromise()
            .then((response: any) => JSON.parse(response._body))
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('error occured', error);
        return Promise.reject(error.message || error);
    }
}