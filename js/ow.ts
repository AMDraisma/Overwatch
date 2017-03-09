/// <reference path="hero.ts" />
/// <reference path="quiz.ts" />

let heroData: quiz.IHeroData;

function getHeroData () {
    $.get("/config/heroes.json").then((data) => {
        heroData = JSON.parse(data);
    });
}


$(document).ready(() => {

});