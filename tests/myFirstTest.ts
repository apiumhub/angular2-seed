import {Hero} from '../app/hero';
import {Subject} from 'rxjs/Rx';
import {expect} from 'chai';
import * as R from 'ramda';
import arrayContaining = jasmine.arrayContaining;
import {StringKeyedMap, changePropertyMap, appendToProperty, changeProperty} from "../app/utils/global";





describe("first test", () => {
    it('has name', () => {
        let hero:Hero = {id: 3, name: 'Super Cat'}; //structural type
        expect(hero.name).to.equal('Super Cat');
    });
    it("can subscribe", function () {
        let a = new Subject();
        a.subscribe(()=>console.log("hola 2"));
        a.next({})
    });
    describe("rambda", () => {


        describe("lenses", () => {
            it("should work", (done) => {
                const aPerson:any = {
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
                    const aPerson:any = {
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
        })

    })

    describe("typescript", () => {
        describe("mixins", () => {
            it("should work", function (done) {
                class Trait1 {
                    hello():string {
                        return "hello"
                    }
                }
                class Trait2 {
                    world():string {
                        return "world"
                    }
                }
                class Mixin implements Trait1, Trait2 {
                    hello():string {
                        return "";
                    }

                    world():string {
                        return "";
                    }

                }
                function applyMixins(derivedCtor:any, baseCtors:any[]) {
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
                const aPerson:any = {
                    'name': 'beppe',
                    'father': {
                        'name': 'gianluigi',
                        'age': 65
                    },
                    'directFamily': {
                        'children': new StringKeyedMap()
                    }
                }

                const newPerson=changePropertyMap(aPerson, ['directFamily', 'children'], {key: 'roby', value:{name: 'roby'}})
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


});
