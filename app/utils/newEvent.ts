import {Subject} from "rxjs/Rx";
import {SubscriptionFunction, CompleteCallback, ErrorCallback, SubscriptionCallback} from "./global";
export function newEvent<T>(subject: Subject<T>, name:string="not specified"):SubscriptionFunction<T>
{
    return (okFunction: SubscriptionCallback<T>, errorFunction?: ErrorCallback, completeFunction?: CompleteCallback) =>
        subject.subscribe.call(subject, (value:T) => {
            console.log("arrived value in event named: [",name,"] value: [", value, "]");
            return okFunction(value);
        }, (error:any) => {
            console.error("arrived error in event named: [",name,"] value: [", error, "]")
            return errorFunction(error);
        }, completeFunction);
}
