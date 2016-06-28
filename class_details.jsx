import React, { Component } from "react"

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
                            <input type="checkbox" />
                          </td>
                          <td>{item["Class Number"]}</td>
                          <td>{item["Course Component"]} {item["Section"]}</td>
                          <td>{item["Meeting Days"]}</td>
                          <td>{item["Start Time"]} -- {item["End Time"]}</td>
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
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>CCN</th>
                  <th>Section</th>
                  <th>Days</th>
                  <th>Time</th>
                  <th>Instructor</th>
                </tr>
                {rows}
              </tbody>
            </table>
        )
    }
}

export class ClassDetails extends Component {
    render() {
        let course_id = this.props.params.course
        course_id = course_id.replace('-', ' ')

        const data = window.data;
        const course = data[course_id]

        return (
            <div className="ClassDetails">
              <div>{course_id}</div>
              <ClassSection sections={course['sections']} />
            </div>
        )
    }
}
