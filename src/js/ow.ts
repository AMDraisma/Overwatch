/// <reference path="_reference.ts" />

let settings: quiz.ISettings;

let gameMaster: quiz.GameMaster;

let questionDiv: HTMLDivElement;

/**
 * reduces hero or ability name to fit image filenames
 * 
 * @param {string} name name of hero or ability
 * @returns {string} 
 */
function reduceName(name: string): string {
    return name.replace(' ', '-').replace('.', '').toLowerCase();
}


/**
 * generates name of image for hero or ability
 * 
 * @param {quiz.Question} q question
 * @returns {string} 
 */
function getQuestionImage(q: quiz.Question): string {
    let heroName: string = reduceName(q.hero.name);
    if (q.getIsAbility()) {
        return `${heroName}-ability-${reduceName(q.ability.name)}.png`;
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
function parseQuestionText(q: quiz.Question, text: string): string {
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

/**
 * Displays the question 
 * 
 * @param {quiz.Question} q 
 */
function displayQuestion(q: quiz.Question, div: HTMLDivElement) {
    div.innerHTML = `<p class="question-text">${parseQuestionText(q, q.text.questionHeader)}</p>`;
    div.innerHTML += `<img src="${settings.imagePath}/${getQuestionImage(q)}" class="question-img">`;
    div.innerHTML += `<p class="question-text">${parseQuestionText(q, q.text.questionFooter)}</p>`;
}


$(document).ready(() => {
    questionDiv = (document.getElementById('questionDiv') as HTMLDivElement);

    let heroData: quiz.IHero[];
    let questionTypes: {[questionType: string]: quiz.IQuestionText}
    let enabledCategories: quiz.ICategory[];

    quiz.getSettings()
    .then((data: quiz.ISettings) => {
        settings = data;
        enabledCategories = [settings.categories[3]];
        questionTypes = settings.questionText;
    })
    .then(quiz.getHeroData)
    .then((data: quiz.IHero[]) => {
        heroData = data;
        gameMaster = new quiz.GameMaster(heroData, enabledCategories, questionTypes);
    })
    .then(() => {
        let q: quiz.Question = gameMaster.GenerateQuestion();
        displayQuestion(q, questionDiv);
    });
});
