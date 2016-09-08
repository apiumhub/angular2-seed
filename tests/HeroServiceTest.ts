import 'reflect-metadata';
import {HeroService} from "../app/hero.service";
describe("HeroService", () => {
	describe("called", () => {
		it("should get heroes from (fake) server", (done) => {
			const sut=new HeroService();
			done();
		});;
	})
});
