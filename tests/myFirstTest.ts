import {Hero} from '../app/hero';
import {Subject} from 'rxjs/Rx';
import {expect} from 'chai';

describe("first test", () => {
    it('has name', () => {
        let hero:Hero = {id: 3, name: 'Super Cat'}; //structural type
        expect(hero.name).to.equal('Super Cat');
    });
    it("can subscribe", function()
    {
        let a = new Subject();
        a.subscribe(()=>console.log("hola 2"));
        a.next({})
    });
});
