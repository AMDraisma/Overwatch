/// <reference path="_reference.ts" />

namespace quiz{

    /**
     * Gamemaster handles generation of questions
     * 
     * @export
     * @class GameMaster
     */
    export class GameMaster {
        private heroes: IHero[];
        private categories: ICategory[];
        private questionText: {[questionText: string]: IQuestionText};

        public constructor(
            heroes: IHero[],
            categories: ICategory[],
            questionTypes: {[questionText: string]: IQuestionText}
        ) {
            this.heroes = heroes;
            this.categories = categories;
            this.questionText = questionTypes;
        }

        public GenerateQuestion(): Question {
            let q: Question = new Question();

            q.hero = GameMaster.PickRandom<IHero>(this.heroes);
            let category: ICategory = GameMaster.PickRandom<ICategory>(this.categories);
            q.categoryName = category.fullName;
            q.text = this.questionText[category.questionTextName];

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
                    let t: number = 20;
                    // TODO: dear god think of something better
                    while (question.answer === undefined && t > 0) {
                        t-=1;
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
                question.answer = obj[path];
                return question;
            }
        }
    }
}
