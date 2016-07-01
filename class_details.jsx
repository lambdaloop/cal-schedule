import React, { Component } from "react"
import { storeCookieData } from './session_manager.js'

function sortedComps(comps_in) {
    const comps = comps_in.slice()
    const ordering = ['LEC', 'SEM', 'LAB']
    comps.sort((a, b) => {
        if(a == b) return 0

        for(let i = 0; i < ordering.length; i += 1) {
            const c = ordering[i]
            if(a == c) return -1
            else if(b == c) return 1
        }

        if(a < b) return -1
        else return 1
    })
    return comps
}

export class ClassSection extends Component {
    constructor(props) {
        super(props)
        this.checkItem = this.checkItem.bind(this)
    }

    checkItem(e) {
        const target = $(e['target'])
        const value = target.attr('value')

        const d = this.props.info
        const key = d['Key']

        window.store.dispatch({
            type: 'TOGGLE_SECTION',
            course_id: key,
            section_id: value
        })
        storeCookieData()
    }

    render() {

        const sections = this.props.sections

        const rows = []

        for(const sec in sections) {
            const section = sections[sec]

            let comps = Object.keys(section)
            comps = sortedComps(comps)

            for(let i = 0; i < comps.length; i += 1) {
                const comp = comps[i]
                section[comp].map(item => {
                    const out = (
                        <tr key={item["Class Number"]}>
                          <td>
                            <input checked={item["selected"]} value={item["Class Number"]} type="checkbox" onChange={this.checkItem} />
                          </td>
                          <td>{item["Class Number"]}</td>
                          <td>{item["Course Component"]} {item["Section"]}</td>
                          <td>{item["Meeting Days"]}</td>
                          <td className="TimeColumn">{item["Start Time"]} &mdash; {item["End Time"]}</td>
                          <td>{item["Instructor Name"]}</td>
                        </tr>
                    )
                    rows.push(out)
                })
            }
        }

        return (
            <table className="ClassSection">
              <tbody>
                <tr className="HeaderRow">
                  <th></th>
                  <th>CCN</th>
                  <th>Section</th>
                  <th>Days</th>
                  <th className="TimeColumn">Time</th>
                  <th>Instructor</th>
                </tr>
                {rows}
              </tbody>
            </table>
        )
    }
}

export class ClassDetails extends Component {
    componentDidMount() {
        this.unsubscribe = window.store.subscribe(() => this.forceUpdate())
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    render() {
        let course_id = this.props.params.course
        course_id = course_id.replace('-', ' ')

        const state = window.store.getState()
        const possible_courses = state.courses.picked.filter(c => c.id == course_id)

        if(possible_courses.length != 1) {
            // shouldn't be here
            window.location = '#/'
            return (
                <div className="ClassDetails">
                </div>
            )
        }

        const course = possible_courses[0]['course']['data']
        const info = course['info']


        return (
            <div className="ClassDetails">
              <div className="ClassTitle">{course_id} &mdash; {info['Course Title']}</div>
              <ClassSection sections={course['sections']} info={course['info']} />
            </div>
        )
    }
}
