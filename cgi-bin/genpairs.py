import json

fo = open('cgi-bin/pairs.txt', 'w')
json_string = open('cgi-bin/heroes.json').read()

heroes = json.loads(json_string)

