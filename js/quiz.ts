/// <reference path="hero.ts" />

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
    }

    export class GameMaster {
        private categories: string[] = [];

        public generateQuestion(heroes: IHero[]): Question {
            let q: Question = new Question;

            q.hero = GameMaster.PickRandom<IHero>(heroes);
            q.attribute = GameMaster.PickRandom<string>(this.categories);
            q.ability = GameMaster.PickRandom<IAbility>(q.hero.abilities);
            if (q.attribute in q.ability) {
                q.answer = q.ability.attributes[q.attribute];
            }else{
                q.answer = q.hero[q.attribute];
            }
            return q;
        }

        private static PickRandom<T>(arr: T[]): T {
            // this does not feel right
            return arr[Math.random()*100%arr.length];
        }
    }
}