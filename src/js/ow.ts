/// <reference path="_reference.ts" />

let settings: quiz.Settings;

let gameMaster: quiz.GameMaster;

let questionDiv: HTMLDivElement;

let enabledCategories: quiz.ICategory[];

/**
 * Displays the question 
 * 
 * @param {quiz.Question} q 
 */
function displayQuestion(q: quiz.Question, div: HTMLDivElement) {
    div.innerHTML = `<p class="question-text">${quiz.Question.ParseQuestionText(q, q.text.questionHeader)}</p>`;
    div.innerHTML += `<img src="${settings.imagePath}/${quiz.Question.GetQuestionImage(q)}" class="question-img">`;
    div.innerHTML += `<p class="question-text">${quiz.Question.ParseQuestionText(q, q.text.questionFooter)}</p>`;
}

function populateControls() {

}

function populateCategoryControls() {

}

function populateCategoryGroupControls() {

}


$(document).ready(() => {
    questionDiv = (document.getElementById('questionDiv') as HTMLDivElement);

    let heroData: quiz.IHero[];
    let questionTypes: {[questionType: string]: quiz.IQuestionText}

    quiz.Settings.GetSettings()
    .then((data: quiz.Settings) => {
        settings = new quiz.Settings(data);
        enabledCategories = settings.getCategoryListFromSet(settings.categorySets['Default'])
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
