import {HeroService} from "./hero.service";
import {HeroDetailComponent} from "./hero-detail.component";
import {Hero} from "./hero";
import {Observable} from "rxjs/Observable";
export interface IChangedHero
{
    changedHero: Function;
}
export class HeroDetailPresenter
{
  constructor(view: HeroDetailComponent, model: HeroService)
  {
      view.changedHero((hero: Hero) => model.saveHero(hero))
  }
}