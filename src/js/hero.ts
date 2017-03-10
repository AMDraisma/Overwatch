/// <reference path="_reference.ts" />

namespace quiz {
    export enum abilityType {
        weapon,
        oneshot,
        channel,
        concentration,
        ultimate
    }

    export interface IAbility {
        name: string;
        type: quiz.abilityType;
        attributes: {[value: string]: string};
    }

    export interface IAttributes {
        abilities: IAbility[];
    }

    export interface IHero {
        name: string;
        abilities: IAbility[];
        health: string;
        shield: string;
        armor: string;
        [attribute: string]: any;
    }

    export function getHeroData(): Promise<quiz.IHero[]> {
        let promise = new Promise((resolve: Function , reject: Function ) => {
            $.get('config/heroes.json').then((heroData) => {
                resolve(heroData);
            })
            .fail(() => {
                reject('Failed to load hero json.');
            });
        });
        return promise;
    }
}
