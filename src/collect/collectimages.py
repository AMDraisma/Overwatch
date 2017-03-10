"""Collects images for heroes and abilities from blizzard servers"""
import urllib
import os
import json


HEROES = []
HERO_ABILITIES = {}
ABILITY_TYPES = {}

PATH = "/var/www/games/ow/img/"
if not os.path.exists(PATH):
    os.mkdir(PATH)
BASE_HERO_IMG_URL = "https://blzgdapipro-a.akamaihd.net/hero/"

JSON_RAW = open('config/heroes.json', 'r').read()

HEROES = json.loads(JSON_RAW)

for hero in HEROES:
    shortname = hero['image'][:-4]
    base_hero_url = BASE_HERO_IMG_URL + shortname + "/"
    hero_img_url = base_hero_url + "hero-select-portrait.png"
    print(hero_img_url)
    for ability in hero['abilities']:
        ability_img_url = BASE_HERO_IMG_URL + "ability-{}/icon-ability.png"
        print(ability_img_url)
    #urllib.urlretrieve(url, PATH + hero['image'])
