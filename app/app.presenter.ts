export interface IHeroList
{
    showHeroes(heroes: Hero[]);
}
export class AppPresenter
{
    constructor(hl: IHeroList, heroService: HeroService) {
        hl.loadEvent.subscribe((e) => console.log("event",e));
        hl.loadEvent.subscribe(() => heroService
                    .getHeroes()
                    .subscribe(heroes => hl.showHeroes(heroes)))
    }
}