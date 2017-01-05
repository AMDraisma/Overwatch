import json

f = open("abilities.txt", 'w')

json_string = open("heroes.json").read()

json_parsed = json.loads(json_string)

for hero in json_parsed:
	for ability in hero["abilities"]:
		f.write(ability["name"]+"\n")
