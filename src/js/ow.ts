/// <reference path="_reference.ts" />

let settings: quiz.Settings;

let gameMaster: quiz.GameMaster;

let questionDiv: HTMLDivElement;
let categorySetDiv: HTMLDivElement;
let categoryDiv: HTMLDivElement;

let enabledCategories: {[category: string]: quiz.ICategory};

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

function populateCategoryControls(categories: {[category: string]: quiz.ICategory}, div: HTMLDivElement) {

}

function populateCategorySetControls(categorySets: {[categorySet: string]: quiz.ICategorySet}, div: HTMLDivElement) {

}

function toggleCategory(categoryName: string) {
    if (categoryName in enabledCategories) {
        delete enabledCategories[categoryName];
    }else{
        enabledCategories[categoryName] = settings.categories[categoryName];
    }
}

function refresh() {
    let q: quiz.Question = gameMaster.GenerateQuestion();
    displayQuestion(q, questionDiv);
}


$(document).ready(() => {
    questionDiv = (document.getElementById('questionDiv') as HTMLDivElement);
    categorySetDiv = (document.getElementById('categorySetDiv') as HTMLDivElement);
    categoryDiv = (document.getElementById('categoryDiv') as HTMLDivElement);

    let heroData: quiz.IHero[];
    let questionTypes: {[questionType: string]: quiz.IQuestionText}

    // load settings
    quiz.Settings.GetSettings()
    .then((data: quiz.Settings) => {
        settings = new quiz.Settings(data);
        enabledCategories = settings.getCategoryObjectFromSet(settings.categorySets['Default'])
        questionTypes = settings.questionText;
    })
    // generate category controls
    .then(() => {
        populateCategoryControls(settings.categories, categoryDiv);
        populateCategorySetControls(settings.categorySets, categoryDiv);
    })
    // load hero data
    .then(quiz.getHeroData)
    .then((data: quiz.IHero[]) => {
        heroData = data;
        gameMaster = new quiz.GameMaster(heroData, enabledCategories, questionTypes);
    })
    // generate new question and display
    .then(() => {
        refresh();
    });
});
