import {Hero} from '../app/hero';
import {Subject} from 'rxjs/Rx';

describe("first test", () => {
    it('has name', () => {
        let hero:Hero = {id: 2, name: 'Super Cat'}; //structural type
        expect(hero.name).toEqual('Super Cat');
        let a = new Subject();
        a.subscribe(()=>console.log("hola 4"));
        a.next({})
    });
});
