import {Hero} from './hero';
import {HeroService, IHeroService} from './hero.service';
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";
export interface IHeroList {
    showHeroes(heroes:Hero[]): void;
    whenLoad:Function;
}
export class AppPresenter {
    constructor(heroesListView:IHeroList, heroService:IHeroService) {
        //hl.loadEvent.subscribe((e) => console.log("event",e));
        heroesListView.whenLoad(() => heroService.loadHeroes());
        heroService.heroes((heroes:Hero[]) => heroesListView.showHeroes(heroes));
    }
}