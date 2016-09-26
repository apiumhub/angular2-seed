import "reflect-metadata";
import {HeroService} from "../app/hero.service";
import {Hero} from "../app/hero";
import {expect} from "chai";
import {Server} from "../app/utils/gateways";
describe("HeroService", () => {
	const testHeroes: Hero[]= [
	  {id: 11, name: 'Mr. Nice'},
	  {id: 12, name: 'Narco'},
	  {id: 13, name: 'Bombasto'},
	  {id: 14, name: 'Celeritas'},
	  {id: 15, name: 'Magneta'},
	  {id: 16, name: 'RubberMan'},
	  {id: 17, name: 'Dynama'},
	  {id: 18, name: 'Dr IQ'},
	  {id: 19, name: 'Magma'},
	  {id: 20, name: 'Tornado'}
	];
	var sut:HeroService
	beforeEach(() => {
		sut=new HeroService(Server.local());
	})
	describe("called", () => {
		it("should get heroes from (fake) server", (done) => {
			sut.heroes((heroes:Hero[]) => {
				expect(heroes).to.eql(testHeroes);
				done();
			});
			sut.loadHeroes();
		});;
	})
	describe("post call", ()=>{
		it("should post and return", (done) =>{
			const testHero:Hero={id: 11, name: 'Mr. Nice'};
			sut.savedHero((hero:Hero) => {
				expect(hero).to.eql(testHero);
				done();
			});
			sut.saveHero(testHero);
		});
	});
});
