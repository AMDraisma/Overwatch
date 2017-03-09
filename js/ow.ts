/// <reference path="_reference.ts" />

let settings: quiz.ISettings;
let heroData: quiz.IHero[];

let questionHeader: HTMLElement = document.getElementById('qheader');
let questionFooter: HTMLElement = document.getElementById('qfooter');

let questionImage: HTMLElement = document.getElementById('qimg');

function getHeroData () {
    let promise = new Promise((resolve: Function , reject: Function ) => {
        $.get('/config/heroes.json').then((heroData) => {
            resolve(heroData);
        })
        .fail(() => {
            reject('Failed to load hero json.');
        });
    });
    return promise;
}

function displayHeroQuestion(q: quiz.Question) {
    questionHeader.innerHTML = `<p>What is the <span class="text-primary">${q.attribute}</span> of</p>`;
    questionImage.setAttribute('src', `${settings['imgpath']}`);
}

function displayAbilityQuestion(q: quiz.Question) {

}


$(document).ready(() => {
    getSettings()
    .then((settings) => {

    })
    .then(getHeroData)
    .then((data: quiz.IHero[]) => {
        heroData = data;

        let q: quiz.Question = quiz.GameMaster.GenerateQuestion(heroData, ['health', 'shield', 'armor']);
        q.getIsAbility() ? displayAbilityQuestion(q) : displayHeroQuestion(q); 
    });
    
});