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

export interface Gateway {
    get<T>(resource:string):Observable<T>;
};
export class AxiosGateway implements Gateway {
    get<T>(resource:string):Observable<T> {
        const subject = new BehaviorSubject<string>('/');
        subject.next(resource);
        return subject
            .flatMap(resource => Observable.fromPromise(axios.request({
                baseURL: 'http://localhost:3004/',
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
