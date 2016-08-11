import {Hero} from "../app/hero";

describe("first test", () => {
    it('has name', () => {
        let hero:Hero = {id: 2, name: 'Super Cat'}; //structural type
        expect(hero.name).toEqual('Super Cat');
    });
});
