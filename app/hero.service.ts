import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import {newEvent} from './utils/newEvent'

import { Hero } from './hero';
import {Observer} from "rxjs/Observer";
export const HEROES: Hero[] = [
  {id: 11, name: 'Mr. Nice'},
  {id: 12, name: 'Narco'},
  {id: 13, name: 'Bombasto'},
  {id: 14, name: 'Celeritas'},
  {id: 15, name: 'Magneta'},
  {id: 16, name: 'RubberMan'},
  {id: 17, name: 'Dynama'},
  {id: 18, name: 'Dr IQ'},
  {id: 19, name: 'Magma'},
  {id: 20, name: 'Tornado'}
];
@Injectable()
export class HeroService {
    heroesRefreshed: Subject<Hero[]>
    whenHeroesRefresh: Function

    constructor(){
        this.heroesRefreshed=new Subject<Hero[]>();
        this.whenHeroesRefresh=newEvent(this.heroesRefreshed)
    }
    getHeroes() {
        return Promise.resolve(HEROES).then((heroes) => this.heroesRefreshed.next(heroes));
    }

}