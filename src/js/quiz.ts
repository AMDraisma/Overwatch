/// <reference path="_reference.ts" />

namespace quiz{

    /**
     * Question class, holding names of atrributes/abilities and answers
     * 
     * @export
     * @class Question
     */
    export class Question {
        public type: IQuestionType;
        public hero: IHero;
        public attribute: string;
        public ability: IAbility;
        public abilityAttribute: {[value: string]: string};
        public answer: any;

        public getIsAbility(): boolean {
            return this.ability !== undefined;
        }
    }

    /**
     * Gamemaster handles generation of questions
     * 
     * @export
     * @class GameMaster
     */
    export class GameMaster {
        public static GenerateQuestion(heroes: IHero[], categories: ICategory[]): Question {
            let q: Question = new Question();

            q.hero = GameMaster.PickRandom<IHero>(heroes);
            let category: ICategory = GameMaster.PickRandom<ICategory>(categories);
            GameMaster.FillQuestion(q.hero, category.path, q);
            console.log(q);
            return q;
        }

        /**
         * picks a random element T from an array of T elements
         * 
         * @private
         * @static
         * @template T 
         * @param {T[]} arr array of elements T
         * @returns {T} random element T
         * 
         * @memberOf GameMaster
         */
        private static PickRandom<T>(arr: T[]): T {
            return arr[Math.floor(Math.random()*arr.length)];
        }

        /**
         * Takes a question and fills it with answer, attribute, ability etc based on path defined
         * in settings.json
         * 
         * @private
         * @static
         * @param {*} obj hero object
         * @param {string} path path string from settings.json
         * @param {Question} question question to be filled
         * @returns {Question} 
         * 
         * @memberOf GameMaster
         */
        private static FillQuestion(obj: any, path: string, question: Question): Question {
            let splitpath: string[] = [];
            let i: number = path.indexOf('/');

            if (i > 0) {
                splitpath[0] = path.substr(0, i);
                splitpath[1] = path.substr(i+1);

                if (splitpath[0] in obj) {
                    return GameMaster.FillQuestion(obj[splitpath[0]], splitpath[1], question);
                }
                if (splitpath[0] === '*') {
                    let subSelection: any
                    let t: number = 0;
                    // TODO: dear god think of something better
                    while (question.answer === undefined && t < 10) {
                        t+=1;
                        subSelection = GameMaster.PickRandom<any>(obj)
                        GameMaster.FillQuestion(subSelection, splitpath[1], question);
                    }
                    question.ability = subSelection;
                    return question;
                }
                if (splitpath[0].indexOf('|') !== -1) {
                    let choice = GameMaster.PickRandom<string>(splitpath[0].split('|'))
                    let subSelection = obj[choice];
                    return GameMaster.FillQuestion(subSelection, splitpath[1], question);
                }
            }else{
                question.attribute = path;
                question.answer = obj[path];
                return question;
            }
        }
    }
}
