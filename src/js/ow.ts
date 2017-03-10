/// <reference path="_reference.ts" />

let settings: quiz.ISettings;
let heroData: quiz.IHero[];

let enabledCategories: quiz.ICategory[];

let questionHeader: HTMLElement = document.getElementById('qheader');
let questionFooter: HTMLElement = document.getElementById('qfooter');

let questionImage: HTMLElement = document.getElementById('qimg');

function displayQuestion(q: quiz.Question) {
    questionHeader.innerHTML = `<p>What is the <span class="text-primary">${q.attribute}</span> of</p>`;

    let heroImageName = q.hero.name.replace(' ', '-').toLowerCase();
    questionImage.setAttribute('src', `${settings.imagePath}/${heroImageName}.png`);

    questionFooter.innerHTML = `<p><span class="text-primary">${q.hero.name}</span></p>`
}


$(document).ready(() => {
    quiz.getSettings()
    .then((data: quiz.ISettings) => {
        settings = data;
        enabledCategories = [settings.categories[1]];
    })
    .then(quiz.getHeroData)
    .then((data: quiz.IHero[]) => {
        heroData = data;

        let q: quiz.Question = quiz.GameMaster.GenerateQuestion(heroData, enabledCategories);
        // displayQuestion(q);
    });
    
});
