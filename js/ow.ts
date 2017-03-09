/// <reference path="_reference.ts" />

let heroData: quiz.IHero[];

let questionHeader = $("#qheader");
let questionFooter = $("$qfooter");

let questionImage = $("qimg");

function getSettings() {
	let promise = new Promise((resolve: Function, reject: Function) => {
		$.get('config/settings.json', '', (settingsJson) => {
			resolve(settingsJson);
		})
		.fail(() => {
			reject('Failed to load settings json.');
		});
	});
	return promise;
}

function getHeroData () {
    let promise = new Promise((resolve: Function , reject: Function ) => {
        $.get("/config/heroes.json").then((heroData) => {
            //heroData = JSON.parse(data);
            let q: quiz.Question = quiz.GameMaster.GenerateQuestion(heroData, ["health", "shield", "armor"]);
            q.getIsAbility() ? displayAbilityQuestion(q) : displayHeroQuestion(q);
            resolve();
        })
        .fail(() => {
            reject("Failed to load settings json.");
        });
    });
    return promise;
}

function displayHeroQuestion(q: quiz.Question) {

}

function displayAbilityQuestion(q: quiz.Question) {

}


$(document).ready(() => {
    getHeroData();
});