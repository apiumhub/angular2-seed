import {Subject} from "rxjs/Rx";
import {SubscriptionFunction, CompleteCallback, ErrorCallback, SubscriptionCallback} from "./global";
export function newEvent<T>(subject: Subject<T>):SubscriptionFunction<T>
{
    return (okFunction: SubscriptionCallback<T>, errorFunction?: ErrorCallback, completeFunction?: CompleteCallback) =>
        subject.subscribe.bind(subject, (value:T) => {
            console.log("arrived value in event: [", value, "]");
            return okFunction(value)
        }, (error:any) => {
            console.error("arrived error in event: ", error)
            return errorFunction(error);
        }, completeFunction);
}
