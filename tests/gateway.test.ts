import "reflect-metadata";
import {Hero} from "../app/hero";
import {expect} from "chai";
import {Subject} from "rxjs";
import {AxiosGateway, OnlyLatestCallFilter} from "../app/glue/gateways";

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
	describe("used with sequenced pipeline", ()=>{
		describe("done two calls", ()=>{
			it("just the second one responds", (done) =>{
				let counter=0;
				const server = new AxiosGateway();
				const subj=new Subject<Hero[]>();
				subj.subscribe(()=>{
					counter++;
					expect(counter).to.be.lte(1);
					if (counter==1) setTimeout(()=>done(), 500);
				})
				const pipeline=new OnlyLatestCallFilter<Hero[]>(
					(resource:string)=>server.get(resource),
					subj
				)
				pipeline.run("/heroes");
				pipeline.run("/heroes");
			});
		});
	});
});
