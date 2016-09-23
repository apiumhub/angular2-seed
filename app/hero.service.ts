import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Optional } from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/observable/dom/ajax';
import 'rxjs/observable/fromPromise';
import 'rxjs/observable/defer';
import 'rxjs/operator/retry';
import 'rxjs/operator/merge';
import {newEvent} from './utils/newEvent'
import { Hero } from './hero';
import {Observer} from "rxjs/Observer";
import {AjaxObservable} from "rxjs/observable/dom/AjaxObservable";
import axios from 'axios';
import {Subscription} from "rxjs/Subscription";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Server, AxiosGateway} from './utils/gateways'
import {SubscriptionFunction} from './utils/global'



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
export interface IHeroService
{
    loadHeroes():Observable<Hero[]>;
    heroes: SubscriptionFunction<Hero[]>;
}

@Injectable()
export class HeroService implements IHeroService{
    heroesRefreshed:Subject<Hero[]>
    heroes:SubscriptionFunction<Hero[]>

    //private server: Server;

    onHeroSaved:Subject<Hero>;
    public savedHero:Function;

    constructor(@Optional() private server?:Server) {
        this.server = this.server || Server.local();
        this.heroesRefreshed = new Subject<Hero[]>();
        this.heroes = newEvent(this.heroesRefreshed)
        this.onHeroSaved = new Subject<Hero>();
        this.savedHero = newEvent(this.onHeroSaved)
    }

    protected getServer():Server
    {
        return this.server = this.server || Server.local();
    }

    getHeroes() {
        return Promise.resolve(HEROES).then((heroes) => this.heroesRefreshed.next(heroes));
    }

    saveHero(hero:Hero):any {
        console.log(hero);
        this.getServer().post<Hero>('/hero', hero, this.onHeroSaved);
    }

    loadHeroes():Observable<Hero[]> {
        return this.getServer().get<Hero[]>('/heroes', this.heroesRefreshed);
    }
}

//array map extension
