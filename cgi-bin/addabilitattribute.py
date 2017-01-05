import json
from sys import argv

if len(argv) < 2:
	print "aaaaaaaaaaa"
else:
	editattr = argv[1]
	if len(argv) > 2:
		skip = argv[2]

	json_string = open('heroes.json').read()

	json_parsed = json.loads(json_string)

	for hero in json_parsed:
		for ability in hero["abilities"]:
			if ability["type"] not in skip:
				input = raw_input("Set {} of {} to: ".format(editattr, ability["name"]))
				if len(input) > 0:
					if editattr in ability["attributes"]:
						print "Updating attribute"
					else:
						print "Adding attribute"
					ability['attributes'][editattr] = input
				else:
					print "passing"

	print json_parsed[0]

	f = open('newJson.json', 'w').write(json.dumps(json_parsed))
