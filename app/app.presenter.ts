import {Hero} from './hero';
import {HeroService} from './hero.service';
export interface IHeroList {
    showHeroes(heroes:Hero[]);
    loadEvent;
}
export class AppPresenter {
    constructor(heroesListView:IHeroList, heroService:HeroService) {
        //hl.loadEvent.subscribe((e) => console.log("event",e));
        heroesListView.loadEvent.subscribe(() => heroService.getHeroes())
        heroService.heroesRefreshed.subscribe(heroes => heroesListView.showHeroes(heroes))
    }
}