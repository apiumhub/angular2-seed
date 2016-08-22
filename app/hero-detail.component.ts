import { Component, Input } from '@angular/core';
import { Hero } from './hero';
import {Subject} from "rxjs/Subject";
import {newEvent} from "./utils/newEvent";
import {HeroService} from "./hero.service";
import {HeroDetailPresenter} from "./herodetail.presenter";
import {IChangedHero} from "./herodetail.presenter";
@Component({
  selector: 'my-hero-detail',
  template: `
    <div *ngIf="hero">
      <h2>{{hero.name}} details!</h2>
      <div><label>id: </label>{{hero.id}}</div>
      <div>
        <label>name: </label>
        <input [(ngModel)]="hero.name" placeholder="name"/>
        <button (click)="clicked()">Save</button>
      </div>
    </div>
  `,
  providers: [HeroService]
})
export class HeroDetailComponent implements IChangedHero {
  @Input()
  hero: Hero;

  onSave: Subject<Hero>;
  changedHero:Function;

  constructor(private heroService: HeroService) {
    this.onSave = new Subject<Hero>();
    this.changedHero = newEvent(this.onSave);
    new HeroDetailPresenter(this, heroService)
  }
  clicked() {
    this.onSave.next(this.hero);
  }
}

