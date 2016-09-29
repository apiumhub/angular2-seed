import "reflect-metadata";
import {HeroService} from "../app/hero.service";
import {Hero} from "../app/hero";
import {expect} from "chai";
import {Subject} from 'rxjs'
import {Server, AxiosGateway} from "../app/glue/gateways";

describe("AxiosGateway", ()=>{
	describe("two call", ()=>{
		it("each call sends its response", (done)=>{
			let counter=0;
			const subj=new Subject<Hero[]>();
			subj.subscribe(()=>{
				counter++;
				expect(counter).to.be.lte(2);
				if (counter==2) setTimeout(()=>done(), 500);
			})
			const server = new AxiosGateway();
			server.get("/heroes", subj);
			server.get("/heroes", subj);
		})
	})
});
