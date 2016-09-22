import {Hero} from '../app/hero';
import {Subject} from 'rxjs/Rx';
import {expect} from 'chai';
import * as R from 'ramda';
import arrayContaining = jasmine.arrayContaining;

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
                const lens = R.lensPath(['father', 'age']);
                const aNewPerson = R.set(lens, 66, aPerson);
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

                    function appendToProperty<T, V>(prop:string[], toAppend:T, object:V):V {
                        const lens = R.lensPath(prop);
                        const newObj = R.set(lens, R.append(toAppend
                            , <T[]> R.view(lens, object)), object);
                        return newObj;
                    }

                    const aNewPerson = appendToProperty(['directFamily', 'children'], {'name': 'roby'}, aPerson);
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
                class StringKeyedMap<T> { [key: string]: T;};
                class IntKeyedMap<T> { [key: number]: T;};
                type AnyMap=StringKeyedMap<any>;
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
                function changePropertyMap<T, V>(prop: string[], toAppend:{key: string, value: T}, object:V):V
                {
                    const lens = R.lensPath(prop);
                    const newObj = R.set(lens, R.assoc(
                        toAppend.key,
                        toAppend.value
                        , <T[]> R.view(lens, object)), object);
                    return newObj;
                }
                const newPerson=changePropertyMap(['directFamily', 'children'], {key: 'roby', value:{name: 'roby'}}, aPerson)
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
