import {ics} from './lib/ics.js'

export function exportCalendar(calendar) {
    console.log(calendar)

    var cal = ics()
    cal.addEvent("Test", "This is an event",
                 "Evans 330", '8/27/2016 5:30 pm', '8/27/2013 6:00 pm')
    cal.addEvent("Another test", "This is another event",
                 "VLSB 2060", '8/27/2016 5:30 pm', '8/27/2013 6:00 pm')
    cal.download("test")
}
