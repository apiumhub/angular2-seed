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
@Injectable()
export class AxiosGateway implements Server {

    constructor(private serverHost:string = 'http://localhost:3004/') {
    }


    private request<T>(resource: string, method: string, data: T|null = null, headers: any = {'X-Custom-Header': 'foobar'}): [Observable<T>,any] {
        var config: any = {
            baseURL: this.serverHost,
            timeout: 1000,
            method: method,
            headers: headers,
            url: resource,
            data: data
        };
        console.log("calling resource [", resource, "] of server: [", this.serverHost, "]");
        const promise=axios.request(config);
        return [Observable
                    .fromPromise(promise)
                    .retry(3)
                    .do((resp: any) => {
                        console.log("returned from call for resource: ", resource, JSON.stringify(resp.data));
                    })
                    .map((resp: any) => resp.data), promise];
    }

    private manageResponse<T>(tuple:[Observable<T>, any], resource: string, observer: Observer<T>|null): Observable<T> {
        const observable:Observable<T> = tuple[0];
        const promise = tuple[1];
        if (observer) {
            observable.first().subscribe(
                (value: T)=> {
                    observer.next(value);
                },
                (error: any) => {
                    console.error("call to: ", resource, "failed:", error);
                    observer.error(error);
                },
                () => {if (promise.abort) promise.abort();} //TODO: axio does not abort promise
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
export interface IObservablePipeline<T,V>
{
    subscribe(cb: ((value: T) => void)):Subscription;
    asObservable():Observable<T>;
}
export interface IObserverPipeline<T,V>
{
    run(resource:V):void;
    next(resource:V):void;
}
export interface IResourcePipeline<T> extends IObservablePipeline<T,string>, IObserverPipeline<T,string>
{
}
export class OnlyLatestFilteredCall<T> implements IResourcePipeline<T>
{
    private continuousLoadPipeline:Subject<string>=new Subject<string>();
    private observable: ObservableInput<T>;

    constructor(call: (value: string, index: number) => ObservableInput<T>, observer?:Observer<T>){
        this.observable=this.continuousLoadPipeline
            .switchMap(call);
        if (observer) {
            let obs=<Observable<T>> this.observable;
            obs.subscribe(observer); //TODO: leaking subscription
        }
    }

    run(resource:string) {
        this.continuousLoadPipeline.next(resource);
    }

    next(resource: string): void {
        this.run(resource);
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

export class WebSocketSubject<T> implements IResourcePipeline<T> {

    private websocket: WebSocket;
    private obs: Observable<{}>;
    private open: boolean = false;
    private toBeSent: Function[] = [];

    constructor(url: string) {
        this.websocket = new WebSocket(url);
        this.obs = Observable.fromEvent(this.websocket, "message")
            .map((event: any)=>event.data);
        this.websocket.onopen = (ev: Event)=> {
            console.log("websocket to [", url, "] opened!");
            this.open = true;
            this.toBeSent.map((cb: ()=>string)=>this.websocket.send(cb()));
        }
    }

    subscribe(cb: (value: any)=>void) {
        return this.obs.subscribe(cb);
    }

    send(message: ()=>string): void {
        console.log("sending through ws: ", message());
        if (this.open == false) {
            this.toBeSent.push(message);
            return;
        }
        this.websocket.send(message());
    }

    run(resource: string): void {
        this.send(()=>resource);
    }

    next(resource: string): void {
        this.send(()=>resource);
    }

    asObservable<T>(): Observable<T> {
        return <Observable<T>>this.obs;
    }
}
