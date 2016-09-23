/**
 * Created by christian on 8/09/16.
 */
import {Injectable} from '@angular/core';
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
import {error} from "util";

//region: using type merging:
export interface Server {
    get<T>(resource: string, observer?: Observer<T>): Observable<T>;
    post<T>(resource: string, payload: T, observer?: Observer<T>): Observable<T>;
}
;
export abstract class Server {
    static local(): Server {
        return new AxiosGateway('http://localhost:3004/');
    }
}
;
//endregion
@Injectable()
export class AxiosGateway implements Server {
    private api: Subject<string>

    constructor(private serverHost = 'http://localhost:3004/') {
        this.api = new BehaviorSubject<string>('/');
    }


    private request<T>(resource: string, method: string, data: T = null, headers: any = {'X-Custom-Header': 'foobar'}): Observable<T> {
        this.api.next(resource);
        var config: any = {
            baseURL: this.serverHost,
            timeout: 1000,
            method: method,
            headers: headers,
            url: resource,
            data: data
        };
        return this.api
            .do((resource) => console.log("calling resource [", resource, "] of server: [", this.serverHost, "]"))
            .flatMap(resource => Observable.fromPromise(axios.request(config))).retry(3)
            .do((resp) => {
                console.log("returned from call for resource: ", resource, JSON.stringify(resp.data));
            })
            .map((resp) => resp.data);
    }

    private manageResponse<T>(observer: Observer<T>, observable: Observable<T>, resource: string): Observable<T> {
        if (observer) {
            const subscrition = observable.subscribe(
                (value: T)=>observer.next(value),
                (error: any) => {
                    console.error("call to: ", resource, "failed:", error);
                    observer.error(error);
                    subscrition.unsubscribe();
                },
                () => {
                    observer.complete();
                    subscrition.unsubscribe();
                    console.log("call to: ", resource, 'Completed')
                }
            );
        }
        return observable;
    }

    get<T>(resource: string, observer?: Observer<T>): Observable<T> {
        return this.manageResponse(observer, this.request<T>(resource, 'get'), resource);
    }


    post<T>(resource: string, payload: T, observer?: Observer<T>): Observable<T> {
        return this.manageResponse(observer,
            this.request<T>(resource, 'post', payload), resource);
    }
}
