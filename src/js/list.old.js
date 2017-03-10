$(document).ready(function() {
	var listDiv = document.getElementById('list');

	$.get("config/heroes.json", "", function(data) {
		for (var i in data) {
			hero = data[i];
			// every hero gets their own very special div
			var heroDiv = document.createElement('div');
			heroDiv.setAttribute('class', 'row panel panel-default');

		    var color = "#aaa";
    		switch (hero['role']) {
        		case 'Offense':
            		color = "#400";
	            	break;
    	    	case 'Defense':
        		    color = "#004";
    	        	break;
		        case 'Tank':
    	        	color = "#440";
        		    break;
	    	    case 'Support':
    		        color = "#044";
	        	    break;
	        	default:
        	    	color = "#404";
    	        	break;
    		}
			heroDiv.setAttribute('style', 'background-color: ' + color);

			listDiv.appendChild(heroDiv);

			heroDiv.appendChild(picHTML(hero));

			heroDiv.appendChild(heroHTML(hero));
		}
	});
});

// generate hero picture html
function picHTML(hero) {
	var picElement = document.createElement('div');
	picElement.setAttribute('class', 'col-sm-2 text-center');
	//picElement.setAttribute('style', 'padding-left: 0px;');

	var color = "#555";
	switch (hero['role']) {
		case 'Offense':
			color = "#600";
			break;
		case 'Defense':
			color = "#006";
			break;
		case 'Tank':
			color = "#660";
			break;
		case 'Support':
			color = "#066";
			break;
		default:
			color = "#606";
			break;
	}
	picElement.setAttribute('style', 'padding-left: 0px; padding-right: 0px; background-color: ' + color);


	var heroNameDiv = document.createElement('div');
	heroNameDiv.setAttribute('class', 'text-center');
	var heroName = document.createElement('h1');
	heroName.innerHTML = hero['name'];
	heroNameDiv.appendChild(heroName);
	picElement.appendChild(heroNameDiv);

	var heroPicture = document.createElement('img');
	heroPicture.setAttribute('class', 'img-rounded');
	heroPicture.setAttribute('style', 'width: 100%');
	heroPicture.setAttribute('src', 'img/' + hero['image']);
	picElement.appendChild(heroPicture);

	return picElement;
}

// generate hero panel html
function heroHTML(hero) {
	var heroBody = document.createElement('div');
	heroBody.setAttribute('class', 'col-sm-6');

	heroBody.appendChild(abilitiesHTML(hero['abilities']));

	return heroBody;
}

function abilitiesHTML(abilities) {
	var abilityTable = document.createElement('table');
	abilityTable.setAttribute('class', 'table');
	var abilityTableHeader = document.createElement('tr');
	abilityTableHeader.innerHTML = '<th></th><th>Type</th><th>Name</th><th><span class="glyphicon glyphicon-refresh"></span></th>';
	abilityTable.appendChild(abilityTableHeader);

	for (i in abilities) {
		var ability = abilities[i];
		var abilityRow = document.createElement('tr');
		abilityRow.setAttribute('style', 'padding: 5px;');

		var abilityIcon = document.createElement('td');
		abilityIcon.setAttribute('class', 'text-center');
		abilityIcon.setAttribute('style', 'width: 300px;');
		abilityIcon.innerHTML = '<img style="width: auto; max-height: 70px;" src="img/' + ability['image'] + '">';
		abilityRow.appendChild(abilityIcon);

		var abilityType = document.createElement('td');
		abilityType.innerText = ability['type'];
		abilityRow.appendChild(abilityType);

		var abilityName = document.createElement('td');
		abilityName.innerText = ability['name'];
		abilityRow.appendChild(abilityName);

		var abilityCooldown = document.createElement('td');
		var cooldown = 'cooldown' in ability['attributes'] ? ability['attributes']['cooldown'] +'s' : 'n/a';
		abilityCooldown.innerHTML = cooldown;
		abilityRow.appendChild(abilityCooldown);

		abilityTable.appendChild(abilityRow);
	}
	return abilityTable;
}
