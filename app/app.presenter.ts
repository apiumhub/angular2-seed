import {Hero} from './hero';
import {HeroService} from './hero.service';
export interface IHeroList {
    showHeroes(heroes:Hero[]);
    whenLoad(fun);
}
export class AppPresenter {
    constructor(heroesListView:IHeroList, heroService:HeroService) {
        //hl.loadEvent.subscribe((e) => console.log("event",e));
        heroesListView.whenLoad(() => heroService.getHeroes())
        heroService.whenHeroesRefresh(heroes => heroesListView.showHeroes(heroes))
    }
}