import os
import random


def get_random_line(file_name):
	total_bytes = os.stat(file_name).st_size 
	random_point = random.randint(0, total_bytes)
	file = open(file_name)
	file.seek(random_point)
	file.readline() # skip this line to clear the partial line
	return file.readline()


print get_random_line("/var/www/misc/ow/cgi-bin/generatedfacts.txt")
