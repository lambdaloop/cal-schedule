#!/usr/bin/env python2

import json

with open('schedule.json', 'r') as f:
    schedule = json.load(f)

header = schedule['header']
data = schedule['data']

data_d = [dict(zip(header, d)) for d in data]
data_d = [d for d in data_d if d['Start Time'] != '0:00' and d['Start Time'] != '']

classes = {}

for row in data_d:
    if row['Start Time'] == row['End Time'] and \
       row['Start Time'] == '0:00' or row['Start Time'] == '':
        continue

    if row['Course Component'] == 'GRP':
        continue
    
    # key = (row['Subject'], row['Catalog Number'], row['Course Title'])
    # key = (row['Subject'], row['Catalog Number'])
    key = '{} {}'.format(row['Subject'], row['Catalog Number'])
    
    if key not in classes:
        classes[key] = []
        
    classes[key].append(row)

with open('schedule-grouped.json', 'w') as f:
    json.dump(classes, f, sort_keys=True)
