import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/observable/dom/ajax';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/retry';
import {newEvent} from './utils/newEvent'
import { Hero } from './hero';
import {Observer} from "rxjs/Observer";
import {AjaxObservable} from "rxjs/observable/dom/AjaxObservable";
import axios from 'axios';
import {Subscription} from "rxjs/Subscription";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export const HEROES:Hero[] = [
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
    heroesRefreshed:Subject<Hero[]>
    heroes:Function

    onHeroSaved:Subject<Hero>;
    private savedHero:Function;

    constructor() {
        this.heroesRefreshed = new Subject<Hero[]>();
        this.heroes = newEvent(this.heroesRefreshed)
        this.onHeroSaved = new Subject<Hero>();
        this.savedHero = newEvent(this.onHeroSaved)
    }

    getHeroes() {
        return Promise.resolve(HEROES).then((heroes) => this.heroesRefreshed.next(heroes));
    }

    saveHero(hero:Hero):any {
        console.log(hero);
        this.onHeroSaved.next(hero)
    }

    loadHeroes():Subscription {
        var responseStream = new BehaviorSubject('/')
                .flatMap(requestUrl => Observable.fromPromise(axios.create({
                                baseURL: 'http://localhost:3004/',
                                timeout: 1000,
                                headers: {'X-Custom-Header': 'foobar'}
                            }).get(requestUrl)));
        responseStream.next('/heroes');
        return responseStream
                .retry(3)
                .do((resp) => {console.log(JSON.stringify(resp));})
                .map((resp) => resp.data )
                .subscribe(
                  (heroes: Hero[]) => {return this.heroesRefreshed.next(heroes)},
                  (err:Error) => console.log('Error: ' + err),
                  () => console.log('Completed'));
    }
}
//array map extension
