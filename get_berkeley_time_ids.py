#!/usr/bin/env python2

import requests
from bs4 import BeautifulSoup
import json
import re
from multiprocessing import Pool
import sys

print('getting class ids...')
html = requests.get('http://www.berkeleytime.com/enrollment').text
soup = BeautifulSoup(html, 'html.parser')

options = soup.find_all('option')
options = [opt.attrs for opt in options]

print('getting section ids...')

def get_section_ids(class_id):
    url = 'http://www.berkeleytime.com/enrollment/sections/{}/'.format(class_id)
    text = requests.get(url).text
    sections = json.loads(text)
    fall_sections = [x for x in sections if (x['semester'], x['year']) == ('fall', '2016')]
    if len(fall_sections) == 0:
        return {}
    fall_sections = fall_sections[0]['sections']
    section_ids = [(s['section_number'].strip('0'), s['section_id']) for s in fall_sections]
    return dict(section_ids)

def process_option(d):
    if 'data-title' not in d:
        return (None, None)

    title = d['data-title']
    sub, _, num = title.rpartition(' ')
    sub = re.sub('[^A-Z]', '', sub)
    title = '{} {}'.format(sub, num)

    class_id = int(d['value'])
    section_ids = None

    count = 0
    
    while section_ids is None and count < 3:
        try:
            section_ids = get_section_ids(class_id)
        except ValueError:
            section_ids = None
            count += 1

    if section_ids is None:
        print(d)
            
    value = {'class_id': class_id, 'section_ids': section_ids}
    return (title, value)

btime_ids = dict()

p = Pool(16)
results = p.imap_unordered(process_option, options)

print('')

for i, kv in enumerate(results):
    print '\r{}/{}'.format(i+1, len(options)),
    sys.stdout.flush()
    
    key, value = kv
    if key is not None:
        btime_ids[key] = value

with open('data/berkeley_time_ids.json', 'w') as f:
    json.dump(btime_ids, f, sort_keys=True)
