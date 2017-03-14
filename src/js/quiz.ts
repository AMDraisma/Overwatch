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
        private questionText: {[questionText: string]: IQuestionText};

        public constructor(
            heroes: IHero[],
            questionTypes: {[questionText: string]: IQuestionText}
        ) {
            this.heroes = heroes;
            this.questionText = questionTypes;
        }

        public GenerateQuestion(categories: {[category: string]: quiz.ICategory}): Question {
            let q: Question = new Question();

            let category: ICategory;
            do {
                q.hero = GameMaster.PickRandom<IHero>(this.heroes);
                category = GameMaster.PickRandomProperty<ICategory>(categories);
                if (GameMaster.GetObjectHasPath(q.hero, category.path)) {
                    q.category = category;
                }
            } while (q.category === undefined);

            q.text = this.questionText[category.questionTextName];

            GameMaster.FillQuestion(q.hero, q.category.path, q);
            
            return q;
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
                    let subSelection: any = obj;
                    // TODO: dear god think of something better
                    while (question.answer === undefined) {
                        subSelection = GameMaster.PickRandom<any>(obj)
                        GameMaster.FillQuestion(subSelection, splitpath[1], question);
                    }
                    // may not be just ability in future
                    question.ability = subSelection;
                    return question;
                }
            }else{
                // for now we mandate that | can only be used at leaves.
                if (path.indexOf('|') !== -1) {
                    let choice = GameMaster.PickRandom<string>(path.split('|'))
                    question.attribute = choice;
                    question.answer = obj[choice];
                }else{
                    question.attribute = path;
                    question.answer = obj[path];
                }
                return question;
            }
        }

        /**
         * Function that returns true if path exists in object.
         * 
         * @param obj 
         * @param path 
         */
        private static GetObjectHasPath(obj: any, path: string): boolean {
            let i: number = path.indexOf('/');
            let splitpath: string[] = [];

            if (i !== -1) {
                splitpath[0] = path.substr(0, i);
                splitpath[1] = path.substr(i+1);
                if (splitpath[0] === '*') {
                    for (let key in obj) {
                        if (GameMaster.GetObjectHasPath(obj[key], splitpath[1])) {
                            return true;
                        }
                    }
                    return false;
                }
                if (splitpath[0].indexOf('|') !== -1) {
                    for (let key in splitpath[0].split('|')) {
                        if (GameMaster.GetObjectHasPath(obj[key], splitpath[1])) {
                            return true;
                        }
                    }
                    return false;
                }
                if (splitpath[0] in obj) {
                    return GameMaster.GetObjectHasPath(obj[splitpath[0]], splitpath[1]);
                }else{
                    return false;
                }
            }else{
                if (path.indexOf('|') !== -1) {
                    for (let key in path.split('|')) {
                        if (key in obj) {
                            return true;
                        }
                    }
                }else{
                    return (path in obj);
                }
            }
            return false;
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
            return arr[Math.random()*arr.length << 0];
        }

        /**
         * Picks a random property from an object
         * 
         * @private
         * @static
         * @template T 
         * @param {{[index: string]: T}} object 
         * @returns {T} 
         * 
         * @memberOf GameMaster
         */
        private static PickRandomProperty<T>(object: {[index: string]: T}): T {
            let keys = Object.keys(object);
            return object[keys[Math.random() * keys.length << 0]]
        }
    }
}
