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
        public static GenerateQuestion(heroes: IHero[], categories: ICategory[]): Question {
            let q: Question = new Question;

            q.hero = GameMaster.PickRandom<IHero>(heroes);
            let category: ICategory = GameMaster.PickRandom<ICategory>(categories);
            q.attribute = category.fullName;
            // TODO: neat, but need what this is an answer to
            q.answer = GameMaster.PickAnswerFromPath(q.hero, category.path);
            console.log(q);
            return q;
        }

        private static PickRandom<T>(arr: T[]): T {
            return arr[Math.floor(Math.random()*arr.length)];
        }

        private static PickAnswerFromPath(obj: any, path: string): {[value: string]: string} {
            let splitpath: string[] = [];
            let i: number = path.indexOf('/');

            if (i > 0) {
                splitpath[0] = path.substr(0, i);
                splitpath[1] = path.substr(i+1);
                
                if (splitpath[0] in obj) {
                    return GameMaster.PickAnswerFromPath(obj[splitpath[0]], splitpath[1]);
                }
                if (splitpath[0] === '*') {
                    let subSelection: any
                    let answer: any;
                    // TODO: dear god think of something better
                    while (answer === undefined) {
                        subSelection = GameMaster.PickRandom<any>(obj)
                        answer = GameMaster.PickAnswerFromPath(subSelection, splitpath[1]);
                    }
                    return answer;
                }
                if (splitpath[0].indexOf('|') != -1) {
                    let choice = GameMaster.PickRandom<string>(splitpath[0].split('|'))
                    let subSelection = obj[choice];
                    return GameMaster.PickAnswerFromPath(subSelection, splitpath[1]);
                }
            }else{
                return obj[path];
            }
        }
    }
}