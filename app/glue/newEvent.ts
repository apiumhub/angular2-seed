import {Observable} from "rxjs/Rx";
import {SubscriptionFunction, CompleteCallback, ErrorCallback, SubscriptionCallback} from "./global";
export function newEvent<T>(observable: Observable<T>, name:string="event name not specified"):SubscriptionFunction<T>
{
    return (okFunction: SubscriptionCallback<T>, errorFunction?: ErrorCallback, completeFunction?: CompleteCallback) =>
        observable.subscribe.call(observable, (value:T) => {
            console.log("arrived value in event named: [",name,"] value: [", value, "]");
            return okFunction(value);
        }, (error:any) => {
            console.error("arrived error in event named: [",name,"] value: [", error, "]")
            return errorFunction(error);
        }, completeFunction);
}
