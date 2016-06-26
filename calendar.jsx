import React, { Component } from "react"

function timeToMinutes(time) {
    var s = time.split(':');
    return parseInt(s[0]) * 60 + parseInt(s[1]);
}

// from colorbrewer2.org
var COLORS = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462',
              '#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'];

class Section extends Component {
    render() {
        const {section} = this.props

        const courseTitle = `${section['Subject']} ${section['Catalog Number']}`
        const sectionTitle = `${section["Course Component"]} ${section["Section"]}`


        return (
            <div className="Section"
                 style={{
                     backgroundColor: section['Color'],
                     top: this.props.top + "%",
                     height: this.props.height + "%",
                     position: "absolute"
                 }}>
              {courseTitle}
              <br/>
              {sectionTitle}
              <br/>
              {section["Start Time"]} to {section["End Time"]}
            </div>
        )
    }
}

class CalendarDayColumn extends Component {
    getPercentPosition(time, props) {
        let minute = timeToMinutes(time)
        return 100 * (minute - props.minMinute) / (props.maxMinute - props.minMinute)
    }

    render() {
        if(!this.props.hasSaturday && this.props.day == 'S') {
            return <div></div>
        }

        let saturdayClass = 'CalendarDayColumnWithoutSaturday'
        if(this.props.hasSaturday) {
            saturdayClass = 'CalendarDayColumnWithSaturday'
        }

        const courseElements = this.props.sections.map( (section) => {
            const top = this.getPercentPosition(section["Start Time"], this.props)
            const bottom = this.getPercentPosition(section["End Time"], this.props)
            const height = bottom - top

            return <Section section={section} top={top} height={height} />
        })

        return (
            <div className={"CalendarDayColumn " + saturdayClass} >
              <div className="CalendarDayTitle"> {this.props.day} </div>
              <div className="CalendarDaySections">
                {courseElements}
              </div>
            </div>
        );
    }
}

class Calendar extends Component {

    getSections(courses) {
        let out = []

        let index = 0;

        for(let course of courses) {
            const color = COLORS[index % COLORS.length]

            for(let section of course) {
                section['Index'] = index
                section['Color'] = color
                out.push(section)
            }

            index += 1
        }

        return out
    }

    render() {
        const sections = this.getSections(this.props.courses)

        let dayElements = {}

        const days = 'MTWRFS'.split('')
        for(const day of days) {
            dayElements[day] = []
        }

        let minMinute = null;
        let maxMinute = null;

        for(let section of sections) {
            const meetingDays = section['Meeting Days'].split('')

            for(let day of meetingDays) {

                let startMinute = timeToMinutes(section['Start Time'])
                let endMinute = timeToMinutes(section['End Time'])

                if(minMinute === null || startMinute < minMinute) {
                    minMinute = startMinute
                }
                if(maxMinute === null || endMinute > maxMinute) {
                    maxMinute = endMinute
                }

                dayElements[day].push(section)
            }
        }

        let hasSaturday = false
        if(dayElements['S'].length > 0) {
            hasSaturday = true
        }

        let dayColumns = days.map(function(day) {
            return (
                <CalendarDayColumn day={day} hasSaturday={hasSaturday}
                                   sections={dayElements[day]}
                                   minMinute={minMinute} maxMinute={maxMinute}
                                   />
            )
        })

        return (
            <div className="Calendar">
              {dayColumns}
            </div>
        )
    }
}

export class Calendars extends Component {
    componentDidMount() {
        this.unsubscribe = window.store.subscribe(() => this.forceUpdate())
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    render() {
        const state = window.store.getState()
        const { calendars } = state

        if(calendars.length == 0) {
            return (
                <div className="Calendars">
                  No possible calendars
                </div>
            )
        }

        const calendar = calendars[0]

        return (
            <div className="Calendars">
              <Calendar courses={calendar} />
            </div>
        )
    }
}
