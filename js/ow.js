var settingsJson

var abilities = [];
var haDict = {};

var enabledCategories = [];

var questions = {
	'roles': [],
	'cooldown': [],
	'totalhealth': [],
	'hsa': [],
	'movespeed': [],
	'casttime': [],
	'headshots': []
};

var currentAnswer;
var previousQuestion;


/////////////////////
// button elements //
/////////////////////
// Basic
var btnRoles = document.getElementById('btnRoles');
var btnHealthtot = document.getElementById('btnHealthtot');

// Advanced
var btnCooldown = document.getElementById('btnCooldown');
var btnHSA = document.getElementById('btnHSA');

// Tryhard
var btnMovespeed = document.getElementById('btnMovespeed');
var btnCasttime =  document.getElementById('btnCasttime');

// display elements
var qtop = document.getElementById('qtop');
var qimg = document.getElementById('qimg');
var qbot = document.getElementById('qbot');


////////////////////////////
// answer/result elements //
////////////////////////////
var answerDiv = document.getElementById('answerDiv');
var resultOutput = document.getElementById('result');


// initialization
$(document).ready(function() {
	getSettings()
	.then((settingsJson) => {
		this.settingsJson = settingsJson;
		generateCategoryMenu(settingsJson);
	})
	.then(getHeroInfo(this.settingsJson))
	.then((heroInfoJson) => {
		this.heroInfoJson = heroInfoJson;
		getQuestions(this.heroInfoJson);
	})
	//.then(generateQuestion());



	// listen for enter
	$(answerDiv).on('keyup', '.text-answer', function(e) {
		// 48 57
		if (e.keyCode == 13) {
			evalAnswer($(this).val());
		}
	});

	$(answerDiv).on('click', '.btn-answer', function(e) {
		evalAnswer($(this).val());
	});

	$(document).on('keyup', function(e) {
		switch (e.keyCode) {
			case 49:
				$('#btn-1').click();
				break;
			case 50:
				$('#btn-2').click();
				break;
			case 51:
				$('#btn-3').click();
				break;
			case 52:
				$('#btn-4').click();
				break;
			case 53:
				$('#btn-5').click();
				break;
			case 54:
				$('#btn-6').click();
				break;
		}
	});
});

function getSettings() {
	var promise = new Promise((resolve, reject) => {
		$.get('config/settings.json', '', (settingsJson) => {
			resolve(settingsJson);
		})
		.fail(() => {
			reject('Failed to load settings json.');
		});
	});
	return promise;
}

// load json file and generate first question
function getHeroInfo(settingsJson) {
	var promise = new Promise((resolve, reject) => {
		$.get('config/heroes.json', '', function(heroesJson) {
			resolve(heroesJson);
		})
		.fail(() => {
			reject('Failed to load heroes json.');
		});
	});
	return promise;
}

// takes an array
function setCategoriesEnabled(categories) {
	this.enabledCategories = categories;
	var categoryButtons = document.getElementsByClassName('category');
	[].forEach.call(categoryButtons, (categoryButton) => {
		if (this.enabledCategories.indexOf(categoryButton.id.substr(2)) !== -1 && categoryButton.getAttribute('disabled') !== 'disabled') {
			categoryButton.setAttribute('class', 'category btn btn-success active');
		}else{
			categoryButton.setAttribute('class', 'category btn btn-danger');
		}
	});
}

function toggleCategoryEnabled(category) {
	var i = this.enabledCategories.indexOf(category);
	if (i !== -1) {
		delete this.enabledCategories[i];
		this.document.getElementById(`c_${category}`).setAttribute('class', 'category btn btn-danger')
	}else{
		this.enabledCategories.push(category);
		this.document.getElementById(`c_${category}`).setAttribute('class', 'category btn btn-success active');
	}
}

function changeCategorySetButtonStates(categorySetName) {
	var categorySetButtons = document.getElementsByClassName('categorySet');
	[].forEach.call(categorySetButtons, (categorySetButton) => {
		if (categorySetButton.id.substr(3) === categorySetName) {
			categorySetButton.setAttribute('class', 'categorySet btn btn-success active');
		}else{
			categorySetButton.setAttribute('class', 'categorySet btn btn-danger');
		}
	});
}

function generateCategoryMenu(settingsJson) {
	var defaultCategorySet;

	settingsJson.categorySets.forEach((categorySet) => {
		if (categorySet.name === "Default") {
			defaultCategorySet = categorySet;
		}
		createCategorySetElem(settingsJson, categorySet);
	});
	if (defaultCategorySet) {
		setCategoriesEnabled(defaultCategorySet.categories);
		changeCategorySetButtonStates(defaultCategorySet.name);
	}
}


function createCategorySetElem(settingsJson, categorySet) {
	var categorySetButton = document.createElement('btn');
	categorySetButton.id = `cs_${categorySet.name}`;
	categorySetButton.innerText = categorySet.name;

	categorySetButton.setAttribute('class', 'categorySet btn btn-danger');
	categorySetButton.setAttribute('style', 'margin-left: 5px; margin-right: 5px;');
	
	if (categorySet.categories.length === 0) {
		categorySetButton.setAttribute('disabled', 'disabled');
	}else{
		categorySetButton.onclick = () => {
			setCategoriesEnabled(categorySet.categories);
			changeCategorySetButtonStates(categorySet.name);
			generateQuestion();
		};

		if (categorySet.display) {
			createCategoryElem(settingsJson, categorySet);
		}
	}
	document.getElementById('categorySetButtons').appendChild(categorySetButton);	
}


function createCategoryElem(settingsJson, categorySet) {

	var categorySetButtons = document.createElement('div');
	categorySetButtons.setAttribute('class', 'col-md-4');
	categorySetName = document.createElement('h2');
	categorySetName.innerText = categorySet.name;
	categorySetButtons.appendChild(categorySetName);

	categorySet.categories.forEach((categoryName) => {
		var category = settingsJson.categories[categoryName];
		var categoryButton = document.createElement('btn');
		categoryButton.id = `c_${categoryName}`;
		categoryButton.innerText = category.fullName;

		categoryButton.setAttribute('class', 'category btn btn-danger');
		categoryButton.setAttribute('style', 'margin-left: 5px; margin-right: 5px;');

		categoryButton.onclick = () => {
			toggleCategoryEnabled(categoryName);
			generateQuestion();
		}

		categorySetButtons.appendChild(categoryButton);
	});
	document.getElementById('categorySets').appendChild(categorySetButtons);
}


function evalAnswer(answer) {
	if (answer == currentAnswer) {
		resultOutput.innerHTML = currentAnswer + ' is correct!';
		resultOutput.setAttribute('style', 'background-color: #0B0;');
	}else{
		resultOutput.innerHTML = 'Wrong.<br>Correct answer: ' + currentAnswer;
		resultOutput.setAttribute('style', 'background-color: #B00;');
	}
	generateQuestion();
}

// generate random question
function generateQuestion() {
	if (enabledCategories.length == 0) {
		return;
	}else{

	}
	//do {
		var category = pickRandomProperty(enabledCategories);
		var question = choose(questions[enabledCategories[category]]);
	//} while (question == previousQuestion);

	previousQuestion = question;

	switch(category) {
		case 'cooldown':
			qtop.innerHTML = _top('What is the', 'Cooldown', 'of');
			qimg.setAttribute('src', 'img/' + question['abilityimage']);
			qbot.innerHTML = _bot(question['abilityname']);
			break;
		case 'roles':
			qtop.innerHTML = _top('What is the', 'Role', 'of');
			qimg.setAttribute('src', 'img/' + question['heroimage']);
			qbot.innerHTML = _bot(question['heroname']);
			break;
		case 'totalhealth':
			qtop.innerHTML = _top('What is the', 'Total Health', 'of');
			qimg.setAttribute('src', 'img/' + question['heroimage']);
			qbot.innerHTML = _bot(question['heroname']);
			break;
		case 'hsa':
			var color;
			var noun;
			switch (question['type']) {
				case 'health':
					color = 'text-danger';
					noun = 'Health';
					break;
				case 'shield':
					color = 'text-primary';
					noun = 'Shield';
					break;
				case 'armor':
					color = 'text-warning';
					noun = 'Armor';
					break;
			}
			qtop.innerHTML = _top('What is the', noun, 'of', color);
			qimg.setAttribute('src', 'img/' + question['heroimage']);
			qbot.innerHTML = _bot(question['heroname']);
			break;
		case 'headshots':
			qtop.innerHTML = _top('Are', 'headshots', 'enabled on');
			qimg.setAttribute('src', 'img/' + question['abilityimage']);
			qbot.innerHTML = _bot(question['abilityname']);
			break;
		default:
			qtop.innerHTML = _top('Who is the', 'Most garbage', 'developer?');
			qimg.setAttribute('src', 'img/csgraduate.png');
			qbot.innerHTML = '<small>I don\'t actually have a CS degree</small>';
			break;
	}
//	console.log(category);
//	console.log(question);

	setAnswerInputMarkup(category, question);

	currentAnswer = question['answer'];
	console.log(question);
}

// helper function to generate top question text html
function _top(a, b, c, color='text-active') {
	return '<p>' + a + '<span class=\'' + color + '\'> <i>' + b + '</i> </span>' + c + '</p>';
}

// helper element to generate bottom question element
function _bot(text) {
	return '<p><span class="text-primary">' + text + '</span>?</p>';
}

// set the markup for the answer input depending on the type of answer
function setAnswerInputMarkup(category, question) {
	switch (category) {
		case 'cooldown':
			answerDiv.setAttribute('class', 'input-group');
			answerDiv.innerHTML = answerTextHtml('Cooldown', 'Seconds');
			break;
		case 'roles':
			answerDiv.setAttribute('class', 'btn-group');
			answerDiv.innerHTML = answerBtnHtml(1, 'Offense', 'Offense', 'btn-danger');
			answerDiv.innerHTML += answerBtnHtml(2, 'Defense', 'Defense', 'btn-primary');
			answerDiv.innerHTML += answerBtnHtml(3, 'Tank', 'Tank', 'btn-warning');
			answerDiv.innerHTML += answerBtnHtml(4, 'Support', 'Support', 'btn-info');
			break;
		case 'totalhealth':
			answerDiv.setAttribute('class', 'input-group');
			answerDiv.innerHTML = answerTextHtml('Total health', 'Hit points');
			break;
		case 'hsa':
			answerDiv.setAttribute('class', 'input-group');
			answerDiv.innerHTML = answerTextHtml(question['type'], 'Hit points');
			break;
		case 'headshots':
			answerDiv.setAttribute('class', 'btn-group');
			answerDiv.innerHTML = answerBtnHtml(1, 'yes', 'Yes', 'btn-success');
			answerDiv.innerHTML += answerBtnHtml(2, 'no', 'No', 'btn-danger');
			break;
		default:
			answerDiv.innerHTML = '<h1><p><span class="text-warning">You\'re seeing this because I have either made a mistake or because I have not implemented this type of question. Sorry.</span></p></h1>';
			break;
	}

	answerDiv.childNodes[0].focus();
}

function answerTextHtml(placeholder, valuetype) {
	var html = '<input type="text" class="text-answer form-control" placeholder="' + placeholder + '">';
	html += '<span class="input-group-addon">' + valuetype + '</span>';
	return html;
}

function answerBtnHtml(n, value, text, color) {
	return  '<button id="btn-' + n + '" class="btn-answer btn ' + color + '" value="' + value + '">' + text + '</button>';
}


function getQuestions(heroes) {
	var question;
	var hero;
	var template;
	var ability;
	var attribute;
	for (var i in heroes) {
		hero = heroes[i];
		template = getBasicHeroObj(hero);

		var question = getBasicHeroObj(hero);
		question['answer'] = hero['role'];
		questions['roles'].push(question);

		var question = getBasicHeroObj(hero);
		// weakly typed languages please
		question['answer'] = parseInt(hero['health']) + parseInt(hero['armor']) + parseInt(hero['shield']);
		questions['totalhealth'].push(question);

		var question = getBasicHeroObj(hero);
		question['answer'] = hero['health'];
		question['type'] = 'health';
		questions['hsa'].push(question);

		var question = getBasicHeroObj(hero);
		question['answer'] = hero['armor'];
		question['type'] = 'armor';
		questions['hsa'].push(question);

		var question = getBasicHeroObj(hero);
		question['answer'] = hero['shield'];
		question['type'] = 'shield';
		questions['hsa'].push(question);

		for (var j in hero['abilities']) {
			ability = hero['abilities'][j];
			var question = getBasicHeroObj(hero);
			if ('cooldown' in ability['attributes']) {
				question['answer'] = ability['attributes']['cooldown'];
				question['abilityimage'] = ability['image'];
				question['abilityname'] = ability['name'];
				questions['cooldown'].push(question);
			}
			var question = getBasicHeroObj(hero);
			if ('headshots' in ability['attributes']) {
				question['answer'] = ability['attributes']['headshots'] === 'true' ? 'yes' : 'no';
				question['abilityimage'] = ability['image'];
				question['abilityname'] = ability['name'];
				questions['headshots'].push(question);
			}
		}
	}
}

function getBasicHeroObj(hero) {
	return {'heroname': hero['name'], 'heroimage': hero['image']};
}


function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}


function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}
