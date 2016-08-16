import {HeroService} from "./hero.service";
import {HeroDetailComponent} from "./hero-detail.component";
export class HeroDetailPresenter
{
  constructor(view: HeroDetailComponent, model: HeroService)
  {
      view.changedHero((hero) => model.saveHero(hero))
  }
}