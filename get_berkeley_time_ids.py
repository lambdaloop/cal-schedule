#!/usr/bin/env python2

import requests
from bs4 import BeautifulSoup
import json
import re

html = requests.get('http://www.berkeleytime.com/enrollment').text
soup = BeautifulSoup(html, 'html.parser')

options = soup.find_all('option')

btime_ids = dict()

for opt in options:
    d = opt.attrs
    if 'data-title' in d:
        title = d['data-title']
        sub, _, num = title.rpartition(' ')
        sub = re.sub('[^A-Z]', '', sub)
        title = '{} {}'.format(sub, num)

        btime_ids[title] = int(d['value'])

with open('data/berkeley_time_ids.json', 'w') as f:
    json.dump(btime_ids, f, sort_keys=True)
