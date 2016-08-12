import {Hero} from '../app/hero';

describe("first test", () => {
    it('has name', () => {
        let hero:Hero = new Hero(); //structural type
        expect(hero.name).toEqual('Super Cat');
    });
});
