# -*- coding: utf-8 -*-
# @Author: Ayush Garg
# @Date:   2017-03-10 12:42:26
# @Last Modified by:   Ayush Garg
# @Last Modified time: 2017-03-16 20:09:03

import requests as rq
import json
import os

token = "token=JUEUY62BK5ZOWANSKAJX"

parameters = "location.address=New Delhi, India&location.within=50km&sort_by=best"
url = "https://www.eventbriteapi.com/v3/events/search/?"
expansions = "expand=logo,venue,organizer,format,category,subcategory,bookmark_info"
response = rq.get(url + parameters + '&' + expansions + '&' + token)

#Requires saving paginated responses : done

res = response.json()
num_pages = res['pagination']['page_count']
print num_pages
dirpath = '../Json/'
if not os.path.exists(dirpath):
	os.makedirs(dirpath)

with open(dirpath + 'Events_page_1.json', 'w') as file:
	json.dump(res, file)

for page in range(2, num_pages + 1):
    res = rq.get(url + parameters + '&' + expansions + '&' + token, params={'page': page}).json()
    print page
    with open(dirpath + 'Events_page_' + str(page) + '.json', 'w') as file:
		json.dump(res, file)