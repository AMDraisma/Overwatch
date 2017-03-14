/// <reference path="_reference.ts" />

let settings: quiz.Settings;
let gameMaster: quiz.GameMaster;

let questionDiv: HTMLDivElement;
let categorySetDiv: HTMLDivElement;
let categoryDiv: HTMLDivElement;

let answerDiv: HTMLDivElement;
let resultDiv: HTMLDivElement;

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

function populateAnswerElement(q: quiz.Question) {
    answerDiv.innerHTML = "";

    let choiceBtn: HTMLButtonElement;
    let input: HTMLInputElement;
    let span: HTMLSpanElement;

    switch (q.category.answerType) {
        case 'yesno':
            answerDiv.className = "btn-group";

            choiceBtn = (document.createElement('btn') as HTMLButtonElement);
            choiceBtn.className = "btn btn-success";
            choiceBtn.innerText = "Yes";
            choiceBtn.onclick = () => {
                answer(q, "yes");
            }
            answerDiv.appendChild(choiceBtn);

            choiceBtn = (document.createElement('btn') as HTMLButtonElement);
            choiceBtn.className = "btn btn-danger";
            choiceBtn.innerText = "No";
            choiceBtn.onclick = () => {
                answer(q, "no");
            }
            answerDiv.appendChild(choiceBtn);

            break;

        case 'numeric':
            answerDiv.className = "input-group";

            input = document.createElement('input');
            input.type = "text";
            input.className = "form-control";
            input.onkeyup = (e) => {
                if (e.keyCode === 13) {
                    answer(q, input.value);
                }
            }
            answerDiv.appendChild(input);
            input.focus();

            span = document.createElement('span');
            span.className = "input-group-addon";
            span.innerText = q.category.unit;
            answerDiv.appendChild(span);

            break;

        case 'choice':
            answerDiv.className = "btn-group";

            for (let choice in q.category.choices) {
                choice = q.category.choices[choice];
                choiceBtn = (document.createElement('btn') as HTMLButtonElement);
                choiceBtn.className = "btn btn-primary";
                choiceBtn.innerText = choice;
                choiceBtn.onclick = () => {
                    answer(q, choice);
                }
                answerDiv.appendChild(choiceBtn);
            }

            break;
            
        default:
            answerDiv.innerText = "Answertype not defined";
            break;
    }
}

function showAnswerResult(correct: boolean, answer: string) {
    resultDiv.className = "";
    void resultDiv.offsetWidth;
    resultDiv.className = 'result ';
    resultDiv.className += correct ? 'result-correct' : 'result-wrong';
    resultDiv.innerHTML = correct ? `${answer} is correct!` : `Wrong! Correct answer is: ${answer}`;
}

function answer(q: quiz.Question, a: string) {
    a === q.answer ? showAnswerResult(true, q.answer) : showAnswerResult(false, q.answer);
    refresh();
}

function refresh() {
    let q: quiz.Question = gameMaster.GenerateQuestion(enabledCategories);
    displayQuestion(q, questionDiv);
    populateAnswerElement(q);
}


$(document).ready(() => {
    questionDiv = (document.getElementById('questionDiv') as HTMLDivElement);
    categorySetDiv = (document.getElementById('categorySetDiv') as HTMLDivElement);
    categoryDiv = (document.getElementById('categoryDiv') as HTMLDivElement);
    
    answerDiv = (document.getElementById('answerDiv') as HTMLDivElement);
    resultDiv = (document.getElementById('resultDiv') as HTMLDivElement);

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
