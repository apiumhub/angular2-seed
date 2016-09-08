/**
 * Created by christian on 8/09/16.
 */
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
export abstract class Server {
    static local(): Server {
        return new AxiosGateway('http://localhost:3004/');
    }
};
//endregion
export class AxiosGateway implements Server {
    constructor(private serverHost='http://localhost:3004/') {

    }

    get<T>(resource:string):Observable<T> {
        const subject = new BehaviorSubject<string>('/');
        subject.next(resource);
        return subject
            .flatMap(resource => Observable.fromPromise(axios.request({
                baseURL: this.serverHost,
                timeout: 1000,
                method: 'get',
                headers: {'X-Custom-Header': 'foobar'},
                url: resource
            }))).retry(3)
            .do((resp) => {
                console.log("returned from call for resource: ", resource, JSON.stringify(resp));
            })
            .map((resp) => resp.data);
    }
}
