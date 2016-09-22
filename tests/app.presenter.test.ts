import {expect} from 'chai';
import {AppPresenter, IHeroList} from '../app/app.presenter'
import {Hero} from "../app/hero";
import * as sinon from 'sinon';
import {IHeroService} from "../app/hero.service";
import SinonSpy = Sinon.SinonSpy;


describe("appPresenter", ()=> {
    describe("view loads", ()=> {
        it("should load heroes", (done)=> {
            const heroes:Hero[]= [{id: 11, name: 'Mr. Nice'}]
            const myViewMock: IHeroList = <IHeroList> <any> ({});
            myViewMock.showHeroes = sinon.stub();
            myViewMock.whenLoad = (cb: Function)=> {
                return cb();
            }
            const myService: IHeroService = <IHeroService> <any> {};
            myService.heroes = (cb: Function)=> {
                return cb(heroes);
            }
            myService.loadHeroes = sinon.stub();
            new AppPresenter(myViewMock, myService);
            sinon.assert.alwaysCalledWith(<SinonSpy> myService.loadHeroes);
            sinon.assert.alwaysCalledWith(<SinonSpy> myViewMock.showHeroes, heroes);
            done();
        })
    })
});