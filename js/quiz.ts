/// <reference path="_reference.ts" />

namespace quiz{
    export interface IHeroData {
        heroes: IHero[];
    }

    export class Question {
        public hero: IHero;
        public attribute: string;
        public ability: IAbility;
        public abilityAttribute: {[value: string]: string};
        public answer: any;

        public getIsAbility(): boolean {
            return !this.ability === undefined;
        }
    }

    export class GameMaster {
        public static GenerateQuestion(heroes: IHero[], categories: string[]): Question {
            let q: Question = new Question;

            q.hero = GameMaster.PickRandom<IHero>(heroes);
            q.attribute = GameMaster.PickRandom<string>(categories);
            q.ability = GameMaster.PickRandom<IAbility>(q.hero.abilities);
            if (q.attribute in q.ability) {
                q.answer = q.ability.attributes[q.attribute];
            }else{
                q.answer = q.hero[q.attribute];
            }
            return q;
        }

        private static PickRandom<T>(arr: T[]): T {
            return arr[Math.floor(Math.random()*arr.length)];
        }
    }
}