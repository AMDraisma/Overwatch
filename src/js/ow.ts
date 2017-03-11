/// <reference path="_reference.ts" />

let settings: quiz.Settings;

let gameMaster: quiz.GameMaster;

let questionDiv: HTMLDivElement;
let categorySetDiv: HTMLDivElement;
let categoryDiv: HTMLDivElement;

let enabledCategories: {[category: string]: quiz.ICategory} = {};

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

function populateCategoryControls(
    settings: quiz.ISettings,
    categorySetDiv: HTMLDivElement,
    categoryDiv: HTMLDivElement
) {
    let categorySet: quiz.ICategorySet;
    let categorySetButton: HTMLButtonElement;
    let category: quiz.ICategory;
    let categoryName: string;
    let categoryButtonContainer: HTMLDivElement;
    let categoryButton: HTMLButtonElement;
    for (let categorySetName in settings.categorySets) {
        categorySet = settings.categorySets[categorySetName];
        
        categorySetButton = document.createElement('button');
        categorySetButton.className = 'btn btn-danger'
        categorySetButton.id = `quiz-cat-set-${categorySetName}`
        categorySetButton.innerText = categorySetName;
        categorySetButton.onclick = () => {
            switchCategorySet(categorySetName);
            refresh();
        }

        categorySetDiv.appendChild(categorySetButton);
        
        if (categorySet.display) {
            categoryButtonContainer = document.createElement('div');
            categoryButtonContainer.className = 'col-md-4';
            categoryButtonContainer.innerHTML = `<p class="category-title">${categorySetName}</p>`;

            for (let categoryIndex in categorySet.categories) {
                categoryName = categorySet.categories[categoryIndex];
                
                category = settings.categories[categoryName];

                categoryButton = document.createElement('button');
                categoryButton.className = 'btn btn-danger'
                categoryButton.id = `quiz-cat-${categoryName}`
                categoryButton.innerText = category.fullName;
                categoryButton.onclick = function() {
                    let categoryName = this.id.substr(this.id.lastIndexOf('-')+1);
                    toggleCategory(categoryName);
                    refresh();
                }

                categoryButtonContainer.appendChild(categoryButton);
            }

            categoryDiv.appendChild(categoryButtonContainer);
        }
    }
}

function toggleCategory(categoryName: string) {
    if (categoryName in enabledCategories) {
        delete enabledCategories[categoryName];
        document.getElementById(`quiz-cat-${categoryName}`).className = "btn btn-danger";
    }else{
        enabledCategories[categoryName] = settings.categories[categoryName];
        document.getElementById(`quiz-cat-${categoryName}`).className = "btn btn-success";
    }
}

function setCategory(categoryName: string, enable: boolean) {
    if (enable !== (categoryName in enabledCategories)) {
        toggleCategory(categoryName);
    }
}

function switchCategorySet(enabledCategorySetName: string) {
    for (let categoryName in settings.categories) {
        if (settings.categorySets[enabledCategorySetName].categories.indexOf(categoryName) !== -1) {
            setCategory(categoryName, true);
        }else{
            setCategory(categoryName, false);
        }
    }
    for (let categorySetName in settings.categorySets) {
        if (categorySetName === enabledCategorySetName) {
            document.getElementById(`quiz-cat-set-${categorySetName}`).className = "btn btn-success";
        }else {
            document.getElementById(`quiz-cat-set-${categorySetName}`).className = "btn btn-danger";
        }
    }
}

function refresh() {
    let q: quiz.Question = gameMaster.GenerateQuestion(enabledCategories);
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
        questionTypes = settings.questionText;
    })
    // generate category controls
    .then(() => {
        populateCategoryControls(settings, categoryDiv, categorySetDiv);
        switchCategorySet('Default');
    })
    // load hero data
    .then(quiz.getHeroData)
    .then((data: quiz.IHero[]) => {
        heroData = data;
        gameMaster = new quiz.GameMaster(heroData, questionTypes);
    })
    // generate new question and display
    .then(() => {
        refresh();
    });
});
