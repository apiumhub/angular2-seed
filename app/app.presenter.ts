import {Hero} from './hero';
import {HeroService} from './hero.service';
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";
export interface IHeroList {
    showHeroes(heroes:Hero[]): void;
    whenLoad:Function;
}
export class AppPresenter {
    constructor(heroesListView:IHeroList, heroService:HeroService) {
        //hl.loadEvent.subscribe((e) => console.log("event",e));
        heroesListView.whenLoad(() => heroService.getHeroes());
        heroService.heroes((heroes:Hero[]) => heroesListView.showHeroes(heroes));
    }
}