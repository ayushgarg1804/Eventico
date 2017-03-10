import requests as rq
import json

token = "token=JUEUY62BK5ZOWANSKAJX"

parameters = "location.address=New Delhi, India&location.within=50km&sort_by=best"
url = "https://www.eventbriteapi.com/v3/events/search/?"
expansions = "expand=logo,venue,organizer,format,category,subcategory,bookmark_info"
response = rq.get(url + parameters + '&' + expansions + '&' + token)

#Requires saving paginated responses