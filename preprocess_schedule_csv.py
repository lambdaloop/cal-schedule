import csv
import json

header = ['Semester', 'Class Number', 'Subject', 'Catalog Number',
          'Section', 'Course Component', 'Course Title',
          'Units', 'Facility', 'Meeting Days',
          'Start Time', 'End Time', 'Instructor Name']

reader_f = open('data/grad_schedule.csv', 'r')
reader = csv.reader(reader_f)

data = []

for row in reader:
    if len(row) < 2 or row[1] == '':
        continue
    data.append(row)

reader_f = open('data/undergrad_schedule.csv', 'r')
reader = csv.reader(reader_f)

for row in reader:
    if len(row) < 2 or row[1] == '':
        continue
    data.append(row)

dd = {
    'header': header,
    'data': data
}
    
with open('data/schedule_new.json', 'w') as f:
    json.dump(dd, f)
