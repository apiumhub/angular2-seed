/**
 * Created by christian on 8/09/16.
 */
import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/observable/dom/ajax';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/retry';
import {Observer} from "rxjs/Observer";
import {AjaxObservable} from "rxjs/observable/dom/AjaxObservable";
import axios from 'axios';
import {Subscription} from "rxjs/Subscription";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

//region: using type merging:
export interface Server {
    get<T>(resource:string):Observable<T>;
}
;
export abstract class Server {
    static local():Server {
        return new AxiosGateway('http://localhost:3004/');
    }
}
;
//endregion
@Injectable()
export class AxiosGateway implements Server {
    private api:Subject<string>

    constructor(private serverHost = 'http://localhost:3004/') {
        this.api=new BehaviorSubject<string>('/');
    }

    private request<T>(resource:string, method:string, headers:any = {'X-Custom-Header': 'foobar'}) {
        this.api.next(resource);
        return this.api
            .do((resource) => console.log("calling resource [", resource, "] of server: [", this.serverHost, "]"))
            .flatMap(resource => Observable.fromPromise(axios.request({
                baseURL: this.serverHost,
                timeout: 1000,
                method: method,
                headers: headers,
                url: resource
            }))).retry(3)
            .do((resp) => {
                console.log("returned from call for resource: ", resource, JSON.stringify(resp.data));
            })
            .map((resp) => resp.data);
    }

    get<T>(resource:string):Observable<T> {
        return this.request<T>(resource, 'get');
    }
}
