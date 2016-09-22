/**
 * Created by christian on 22/09/16.
 */
import R = require("ramda");
/**
 * a function to change a property that is a Map in an immutable way
 * @param object:V  the object to change
 * @param prop:string[] the property (nested).If it is person.directFamily.children has to be ['directFamily', 'children']
 * @param toAppend:T an object with as key the key and as value the object to append, like {key: string, value: T}
 * @returns {V}
 */
export function changePropertyMap<T, V>(object:V, prop: string[], toAppend:{key: string, value: T}):V
{
    const lens = R.lensPath(prop);
    const newObj = R.set(lens, R.assoc(
        toAppend.key,
        toAppend.value
        , <T[]> R.view(lens, object)), object);
    return newObj;
}
export function appendToProperty<T, V>(object:V, prop:string[], toAppend:T):V {
    const lens = R.lensPath(prop);
    const newObj = R.set(lens, R.append(toAppend
        , <T[]> R.view(lens, object)), object);
    return newObj;
}
export function changeProperty<T,V>(object: V, prop: string[], value:T):V
{
    const lens = R.lensPath(prop);
    return R.set(lens, value, object);
}
export class StringKeyedMap<T> { [key: string]: T;};
export class IntKeyedMap<T> { [key: number]: T;};
export type AnyMap=StringKeyedMap<any>;

