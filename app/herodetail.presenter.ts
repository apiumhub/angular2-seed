import {HeroService} from "./hero.service";
import {HeroDetailComponent} from "./hero-detail.component";
import {Hero} from "./hero";
export class HeroDetailPresenter
{
  constructor(view: HeroDetailComponent, model: HeroService)
  {
      view.changedHero((hero: Hero) => model.saveHero(hero))
  }
}