import {ics} from './lib/ics.js'

const DAY_STARTDATES = {
    'M': '8/29/2016',
    'T': '8/30/2016',
    'W': '8/24/2016',
    'R': '8/25/2016',
    'F': '8/26/2016',
    'S': '8/27/2016'
}

function getStartDate(days) {
    let daysW = days.replace('M', '').replace('T', '')
    if(daysW.length == 0) {
        daysW = days
    }
    const firstDay = daysW[0]
    return DAY_STARTDATES[firstDay]
}

const DAY_MAP = {
    'M': 'MO',
    'T': 'TU',
    'W': 'WE',
    'R': 'TH',
    'F': 'FR',
    'S': 'SA'
}

export function exportCalendar(calendar) {
    console.log(calendar)

    var cal = ics()
    for(const sections of calendar) {
        for(const section of sections) {
            console.log(section)

            let byday = section['Meeting Days'].split('').map(d => DAY_MAP[d])
            const startDate = getStartDate(section['Meeting Days'])
            const startTime = startDate + ' ' + section['Start Time']
            const endTime = startDate + ' ' + section['End Time']

            cal.addEvent(section.Key + " " + section["Course Component"], // title
                         "", // details
                         section.Facility, // location
                         startTime, // start time
                         endTime, // end time
                         {
                             freq: 'WEEKLY',
                             until: '12/4/2016',
                             byday: byday
                         })
        }
    }
    cal.download("schedule")
}
