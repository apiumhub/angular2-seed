export interface IHeroList
{
    showHeroes(heroes: Hero[]);
}
export class AppPresenter
{
    constructor(heroesListView: IHeroList, heroService: HeroService) {
        //hl.loadEvent.subscribe((e) => console.log("event",e));
        heroesListView.loadEvent.subscribe(() => heroService.getHeroes())
        heroService.heroesRefreshed.subscribe(heroes => heroesListView.showHeroes(heroes))
    }
}