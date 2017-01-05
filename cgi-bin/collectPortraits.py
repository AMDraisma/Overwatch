import urllib, json
from time import sleep


heroes = []
hero_abilites = {}
ability_types = {}

path = "/var/www/misc/ow/img/"

json_string = open('cgi-bin/heroes.json').read()

heroes = json.loads(json_string)

for hero in heroes:
	shortname = hero['image'][:-4]
	url = "https://blzgdapipro-a.akamaihd.net/hero/{}/hero-select-portrait.png".format(shortname)
	urllib.urlretrieve(url, path + hero['image'])

