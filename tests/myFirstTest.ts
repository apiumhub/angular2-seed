import {Hero} from "../app/hero";
import {Subject, Observable, BehaviorSubject} from "rxjs/Rx";
import {expect} from "chai";
import {StringKeyedMap, changePropertyMap, appendToProperty, changeProperty, mapFromDTO} from "../app/glue/global";
import "rxjs/add/observable/dom/webSocket";
import "rxjs/add/observable/fromPromise";
import axios from "axios";
import {WebSocketSubject} from "../app/glue/gateways";
import arrayContaining = jasmine.arrayContaining;

describe("first test", () => {
    it('has name', () => {
        let hero: Hero = {id: 3, name: 'Super Cat'}; //structural type
        expect(hero.name).to.equal('Super Cat');
    });
    it("can subscribe", () => {
        let a = new Subject();
        a.subscribe(()=>console.log("hola 2"));
        a.next({})
    });
    describe("rambda", () => {


        describe("lenses", () => {
            it("should work", (done) => {
                const aPerson: any = {
                    'name': 'beppe',
                    'father': {
                        'name': 'gianluigi',
                        'age': 65
                    }
                }

                const aNewPerson = changeProperty(aPerson, ['father', 'age'], 66);
                expect(aNewPerson).to.eql({
                    'name': 'beppe',
                    'father': {
                        'name': 'gianluigi',
                        'age': 66
                    }
                })
                done();
            });
            ;
        })
        ;
        describe("append", () => {
            describe("on deep object with collection", () => {
                it("should work", function (done) {
                    const aPerson: any = {
                        'name': 'beppe',
                        'father': {
                            'name': 'gianluigi',
                            'age': 65
                        },
                        'directFamily': {
                            'children': []
                        }
                    }

                    const aNewPerson = appendToProperty(aPerson, ['directFamily', 'children'], {'name': 'roby'});
                    expect(aNewPerson).to.eql({
                        'name': 'beppe',
                        'father': {
                            'name': 'gianluigi',
                            'age': 65
                        },

                        'directFamily': {
                            'children': [{
                                'name': 'roby'
                            }]
                        },
                    })
                    done();
                });
                ;
            })
            ;
            describe("map object", ()=> {
                describe("in constructor", ()=> {
                    it("should work", (done) => {
                        class StructType {
                            name: string;
                            surname: string;
                        }
                        class NonStructType {
                            name: string;
                            surname: string;

                            static fromDTO(dto: StructType): NonStructType {
                                const instance = new NonStructType();
                                return mapFromDTO(dto, instance);
                            }

                            toDto(): StructType {
                                return {name: "tu", surname: "tutu"};
                            }
                        }
                        const obj: StructType = {name: "yo", surname: "yoyo"};
                        const obj2 = NonStructType.fromDTO(obj);
                        expect(obj2.name).to.eql("yo");
                        expect(obj2.surname).to.eql("yoyo");
                        done();
                    });
                });
            });
        })

    })

    describe("typescript", () => {
        describe("mixins", () => {
            it("should work", function (done) {
                class Trait1 {
                    hello(): string {
                        return "hello"
                    }
                }
                class Trait2 {
                    world(): string {
                        return "world"
                    }
                }
                class Mixin implements Trait1, Trait2 {
                    hello(): string {
                        return "";
                    }

                    world(): string {
                        return "";
                    }

                }
                function applyMixins(derivedCtor: any, baseCtors: any[]) {
                    baseCtors.forEach(baseCtor => {
                        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                            derivedCtor.prototype[name] = baseCtor.prototype[name];
                        });
                    });
                }

                applyMixins(Mixin, [Trait1, Trait2]);
                const inst = new Mixin();
                expect(inst.hello() + " " + inst.world()).to.eql("hello world");
                done();
            });
            ;
        })
        ;
        describe("map types", () => {
            it("should work", (done) => {
                const aPerson: any = {
                    'name': 'beppe',
                    'father': {
                        'name': 'gianluigi',
                        'age': 65
                    },
                    'directFamily': {
                        'children': new StringKeyedMap()
                    }
                }

                const newPerson = changePropertyMap(aPerson, ['directFamily', 'children'], {
                    key: 'roby',
                    value: {name: 'roby'}
                })
                expect(newPerson).to.eql({
                    'name': 'beppe',
                    'father': {
                        'name': 'gianluigi',
                        'age': 65
                    },
                    'directFamily': {
                        'children': {
                            'roby': {'name': 'roby'}
                        }
                    }
                })
                done();
            });
            ;
        })

    })
    describe("rx", ()=> {
        describe("wired but not called", ()=> {
            it("should wire correctly", (done) => {

                const subject = new Subject<any>();
                const obs = subject
                    .flatMap(
                        (value: any)=>Observable.fromPromise(axios.request({
                            baseURL: 'http://localhost:3004/',
                            timeout: 1000,
                            method: 'get',
                            url: 'test-resource'
                        })))
                obs.do((response: any)=> {
                    console.log(response.data);
                    expect(response.data).to.eql([{}])
                }).subscribe(()=>done());
                subject.next("");
            });
        });
        describe("BehaviorSubject", ()=> {
            describe("has initial value", ()=> {
                describe("and flatMap called", ()=> {
                    it("replays initial value", function (done) {
                        const subject = new BehaviorSubject("A");
                        subject.first().subscribe((value)=> {
                            expect(value).to.eql("A");
                            done();
                        });
                        subject.next("B");
                    });
                });
            });
        });
        describe("Subject", ()=> {
            describe("has initial value", ()=> {
                it("should NOT replay initial value", (done) => {
                    const subject = new Subject<string>();
                    subject.first().subscribe((value: string)=> {
                        expect(value).to.not.eql("A");
                        done();
                    });
                    subject.next("B");
                });
            });
        });
        describe("join", ()=> {
            describe("many subjects", ()=> {
                it("join them all", (done)=> {
                    const subj1 = new Subject<string>();
                    const subj2 = new Subject<string>();
                    const subj3 = new Subject<string>();
                    const subjects: Observable<string>[] = [subj1, subj2, subj3];
                    const finalObservable: Observable<string> = subjects.reduce((prev: Observable<string>, curr: Observable<string>)=>prev.merge(curr));
                    let values: string[] = [];
                    finalObservable.subscribe((value: string)=> {
                        console.log(value);
                        values.push(value);
                    });
                    subj1.next("A");
                    subj2.next("B");
                    subj3.next("C");
                    expect(values.join()).to.eql("A,B,C");
                    done();
                })
            })
        });
        describe("hot observable", ()=> {
            it("should run map even if not subscribed (are lazy)", (done) => {
                const subj = new Subject<string>();
                const hotObs = subj.do((value: string)=> {
                    console.log(value);
                    expect(value).to.eql("hola");
                    done();
                }).publish(); //creates a new ConnectableObservable
                hotObs.refCount();
                hotObs.connect(); //internally a subscribe
                subj.next("hola");
            });
        });
        describe("slow integration test: connected to websocket", ()=> {
            it("should generate a stream", (done) => {
                if (!WebSocket) done();
                const websocket = new WebSocketSubject<string>("ws://echo.websocket.org/");
                websocket.asObservable().first().subscribe((value: any)=> {
                    console.log(value);
                    expect(value).to.eql("hola websocket 1");
                });
                websocket.asObservable().elementAt(1).subscribe((value: any)=> {
                    console.log(value);
                    expect(value).to.eql("hola websocket 2");
                    done();
                });
                websocket.send(()=>"hola websocket 1");
                setTimeout(()=>websocket.send(()=>"hola websocket 2"), 500);
            });
        });
    });
});
