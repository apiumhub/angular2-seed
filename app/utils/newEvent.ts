import {Observable, Subject} from 'rxjs/Rx';
export function newEvent(subject: Subject<any>)
{
    return subject.subscribe.bind(subject);
}
