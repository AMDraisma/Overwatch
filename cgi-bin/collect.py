import urllib
from time import sleep


heroes = []
hero_abilites = {}
ability_types = {}

path = "/var/www/misc/ow/img/"
f = open(path + "heroes.txt")
amt = 0
fixme = 0

for line in f:
	if line.startswith('!'):
		hero = line[1:].rstrip()
		heroes.append(hero)
		hero_abilites[hero] = []
	else:
		if line.startswith("//") or len(line) < 2:
			pass
		else:
			ability = line.rstrip()[1:]
			amt += 1
			hero_abilites[hero].append(ability)
			if line.startswith('@'):
				ability_types[ability] = "weapon"
			elif line.startswith('#'):
				ability_types[ability] = "ability"
			elif line.startswith('$'):
				ability_types[ability] = "special"
			elif line.startswith('%'):
				ability_types[ability] = "ultimate"
			else:
				print "FIX: {}".format(line.rstrip())
				fixme += 1
				ability_types[ability] = "fixme"

print "found {} abilities. {} need to be fixed".format(amt, fixme)

done = 1

for hero in heroes:
	for ability in hero_abilites[hero]:
#		print "{}-{}-{}.png".format(hero, ability_types[ability], ability)
		url = "https://blzgdapipro-a.akamaihd.net/hero/{}/ability-{}/icon-ability.png".format(hero, ability)
		print "downloading ability image {}/{}: {}-ability-{}".format(done, amt, hero, ability)

		try:
			urllib.urlretrieve(url, path + "{}-ability-{}.png".format(hero, ability))
			done += 1
			sleep(0.5)
		except(any):
			print "could not retrieve {}".format(url)
