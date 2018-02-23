import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Item } from '../Models/Record/Record';

@Injectable()
export class ComponentsService {

    private portNo = "7070";

    constructor(private http: Http) { }

    GetFilteredProducts(searchText: string, recordType: string): Observable<Item[]> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Components/GetFilteredProducts", 'data={"queryString":"' + searchText + '","recordType":"' + recordType + '"}', options)
            .map(response => response.json());
    }

    GetFilteredBatches(searchText: string,Pid: string): Observable<Item[]> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://localhost:" + this.portNo + "/medical/main.php/Components/GetFilteredBatches", 'data={"queryString":"' + searchText + '","Pid":"'+Pid+'"}', options)
            .map(response => response.json());
    }

    private handleError(error: any): Promise<any> {
        console.error('error occured', error);
        return Promise.reject(error.message || error);
    }
}