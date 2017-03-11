/// <reference path="_reference.ts" />


namespace quiz {
     /**
     * Question class, holding names of atrributes/abilities and answers
     * 
     * @export
     * @class Question
     */
    export class Question {
        public categoryName: string;
        public text: IQuestionText;
        public hero: IHero;
        public ability: IAbility;
        public abilityAttribute: {[value: string]: string};
        public answer: any;
        [attribute: string]: any;

        /**
         * reduces hero or ability name to fit image filenames
         * 
         * @param {string} name name of hero or ability
         * @returns {string} 
         */
        public static ReduceName(name: string): string {
            return name.replace(' ', '-').replace('.', '').toLowerCase();
        }


        /**
         * generates name of image for hero or ability
         * 
         * @param {quiz.Question} q question
         * @returns {string} 
         */
        public static GetQuestionImage(q: quiz.Question): string {
            let heroName: string = Question.ReduceName(q.hero.name);
            if (q.getIsAbility()) {
                return `${heroName}-ability-${Question.ReduceName(q.ability.name)}.png`;
            }else{
                return `${heroName}.png`;
            }
        }

        /**
         * Parses a question text according to questiontype
         * 
         * @param {quiz.Question} q question
         * @param {string} questionPart header or footer of question text
         * @returns {string} 
         */
        public static ParseQuestionText(q: quiz.Question, text: string): string {
            var text: string = text;
            let i: number = -1;
            let j: number = -1;

            let qSubselection: any;
            let qPath: string[];

            do {
                i = text.indexOf('{');
                j = text.indexOf('}');
                if (j > i) {
                    qPath = text.substr(i+1, j-i-1).split('.');
                    qSubselection = q;
                    for (let field in qPath) {
                        qSubselection = qSubselection[qPath[field]];
                    }
                    
                    text = text.replace(text.substr(i, j-i+1), qSubselection)
                }else{
                    break;
                }
            } while (i !== -1)
            return text;
        }

        public getIsAbility(): boolean {
            return this.ability !== undefined;
        }
    }
}
