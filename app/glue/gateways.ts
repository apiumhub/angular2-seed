/**
 * Created by christian on 8/09/16.
 */
import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs/Rx";
import "rxjs/add/observable/dom/ajax";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/defer";
import "rxjs/add/operator/retry";
import {Observer} from "rxjs/Observer";
import axios from "axios";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

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


    private request<T>(resource: string, method: string, data: T|null = null, headers: any = {'X-Custom-Header': 'foobar'}): Observable<T> {
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
            .flatMap(() => {
                return Observable.fromPromise(axios.request(config))
            })
            .retry(3)
            .do((resp:any) => {
                console.log("returned from call for resource: ", resource, JSON.stringify(resp.data));
            })
            .map((resp:any) => resp.data);
    }

    private manageResponse<T>(observable: Observable<T>, resource: string, observer: Observer<T>|null): Observable<T> {
        if (observer) {
            const subscrition = observable.subscribe(
                (value: T)=>{
                    observer.next(value);
                    subscrition.unsubscribe();
                },
                (error: any) => {
                    console.error("call to: ", resource, "failed:", error);
                    observer.error(error);
                    subscrition.unsubscribe();
                },
                () => {
                    console.log("call to: ", resource, 'Completed')
                    observer.complete();
                    subscrition.unsubscribe();
                }
            );
        }
        return observable;
    }

    get<T>(resource: string, observer: Observer<T>|null=null): Observable<T> {
        return this.manageResponse(this.request<T>(resource, 'get'), resource, observer);
    }


    post<T>(resource: string, payload: T, observer: Observer<T>|null=null): Observable<T> {
        return this.manageResponse(this.request<T>(resource, 'post', payload), resource, observer);
    }
}
