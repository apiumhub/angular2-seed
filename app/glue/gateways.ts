/**
 * Created by christian on 8/09/16.
 */
import {Injectable} from "@angular/core";
import {Observable, Subject, Subscription} from "rxjs/Rx";
import {ObservableInput} from "rxjs/Observable";
import "rxjs/add/observable/dom/ajax";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/defer";
import "rxjs/add/operator/retry";
import {Observer} from "rxjs/Observer";
import axios from "axios";

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
export interface IPipeline<T>
{
    run(resource:string):void;
    subscribe(cb: ((value: T) => void)):Subscription;
    asObservable():Observable<T>;
}
export class OnlyLatestFilteredCall<T> implements IPipeline<T>
{
    private continuousLoadPipeline:Subject<string>=new Subject<string>();
    private observable: ObservableInput<T>;

    constructor(call: (value: string, index: number) => ObservableInput<T>, observer?:Observer<T>){
        this.observable=this.continuousLoadPipeline
            .switchMap(call);
        if (observer) this.observable.subscribe(observer); //TODO: leaking subscription
    }

    run(resource:string) {
        this.continuousLoadPipeline.next(resource);
    }

    subscribe(cb: ((value: T) => void)) {
        const obs=<Observable<T>> this.observable;
        return obs.subscribe(cb);
    }

    asObservable():Observable<T>
    {
        return <Observable<T>> <any> this;
    }
}
@Injectable()
export class AxiosGateway implements Server {

    constructor(private serverHost = 'http://localhost:3004/') {
    }


    private request<T>(resource: string, method: string, data: T|null = null, headers: any = {'X-Custom-Header': 'foobar'}): Observable<T> {
        var config: any = {
            baseURL: this.serverHost,
            timeout: 1000,
            method: method,
            headers: headers,
            url: resource,
            data: data
        };
        console.log("calling resource [", resource, "] of server: [", this.serverHost, "]");
        return Observable
                    .fromPromise(axios.request(config))
                    .retry(3)
                    .do((resp: any) => {
                        console.log("returned from call for resource: ", resource, JSON.stringify(resp.data));
                    })
                    .map((resp: any) => resp.data);
    }

    private manageResponse<T>(observable: Observable<T>, resource: string, observer: Observer<T>|null): Observable<T> {
        if (observer) {
            observable.first().subscribe(
                (value: T)=> {
                    observer.next(value);
                },
                (error: any) => {
                    console.error("call to: ", resource, "failed:", error);
                    observer.error(error);
                }
            );
        }
        return observable;
    }

    get<T>(resource: string, observer: Observer<T>|null = null): Observable<T> {
        return this.manageResponse(this.request<T>(resource, 'get'), resource, observer);
    }


    post<T>(resource: string, payload: T, observer: Observer<T>|null = null): Observable<T> {
        return this.manageResponse(this.request<T>(resource, 'post', payload), resource, observer);
    }
}
