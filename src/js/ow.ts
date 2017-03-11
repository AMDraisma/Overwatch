/// <reference path="_reference.ts" />

let settings: quiz.ISettings;
let heroData: quiz.IHero[];
let questionFormat: quiz.IQuestionType[];

let enabledCategories: quiz.ICategory[];

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
 * Displays the question 
 * 
 * @param {quiz.Question} q 
 */
function displayQuestion(q: quiz.Question, div: HTMLDivElement) {
    div.innerHTML = `<p class="question-text">What is the <span class="text-primary">${q.attribute}</span> of</p>`;
    div.innerHTML += `<img src="${settings.imagePath}/${getQuestionImage(q)}" class="question-img">`;
    div.innerHTML += `<p class="question-text"><span class="text-primary">${q.hero.name}</span></p>`;
}


$(document).ready(() => {
    questionDiv = (document.getElementById('questionDiv') as HTMLDivElement);

    quiz.getSettings()
    .then((data: quiz.ISettings) => {
        settings = data;
        enabledCategories = [settings.categories[2]];
    })
    .then(quiz.getHeroData)
    .then((data: quiz.IHero[]) => {
        heroData = data;

        let q: quiz.Question = quiz.GameMaster.GenerateQuestion(heroData, enabledCategories);
        displayQuestion(q, questionDiv);
    });
    
});
