import React from "react"
import ReactDOM from "react-dom"
import { Router, Route, IndexRoute, Link } from "react-router"
import { browserHistory, hashHistory } from "react-router"

import {default as Select} from 'react-virtualized-select'
require('react-virtualized/styles.css')
require('react-select/dist/react-select.css')
require('react-virtualized-select/styles.css')

require('./style.less')


import planner from './planner.js'
const possibleCalendars = planner.possibleCalendars

function loadJSON(callback) {
    const xobj = new XMLHttpRequest()
    xobj.overrideMimeType("application/json")
    xobj.open('GET', 'schedule-grouped.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = () => {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText)
        }
    }
    xobj.send(null)
}

var DATA = null


const dict_zip = (key_array, val_array) => {
    if (key_array.length === val_array.length) {
        const obj = {}
        const len = key_array.length

        for (let i = 0;i < len; i++) {
            obj[key_array[i]] = val_array[i]
        }
        return obj
    } else {
        console.log("dict_zip bad args length")
    }
}


const ClassList = React.createClass({
    getInitialState() {
        return {pickedItems: {}}
    },

    updatePickedItems(items) {
        const pickedItems = this.state.pickedItems
        for(let i=0; i < items.length; i += 1) {
            const value = items[i]['value']
            if(pickedItems[value] === undefined) {
                pickedItems[value] = true
            }
        }
        this.setState({pickedItems})

        this.props.updatePickedItems(pickedItems)
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps['items']) {
            this.updatePickedItems(nextProps['items'])
        }
    },

    checkItem(e) {
        const target = $(e['target'])
        const value = target.attr('value')

        const pickedItems = this.state.pickedItems
        pickedItems[value] = !pickedItems[value]
        this.setState({pickedItems})

        this.props.updatePickedItems(pickedItems)
    },

    render() {
        const items = this.props.items.map(item => {
            const d = item['data']['info']
            const value = item['value']
            const title = `${d['Subject']} ${d['Catalog Number']}`
            const name = d['Course Title']
            const checked = this.state.pickedItems[value]

            const url = `/class/${value.replace(' ', '-')}`

            return (
                <div key={value}>
                    <input type="checkbox" value={value}
                           checked={checked} onChange={this.checkItem}/>
                    <span>{title} -- {name}</span> <Link to={url}>(sections)</Link>
                </div>
            )
        })

        return (
            <div className="ClassList">
                <div> Classes </div>
                <div>
                    {items}
                </div>
            </div>
        )
    }
})

const ClassPicker = React.createClass({
    onChange(val) {
        console.log(val)
        if(val == null) {
            this.setState({value: undefined})
        } else {
            const items = this.state.items
            const items_dict = this.state.items_dict
            if(!items_dict[val['value']]) {
                items_dict[val['value']] = val
                items.push(val)
            }
            this.setState({value: undefined, items, items_dict})
        }
    },

    updateOptions(data) {
        const options = []
        const rows = Object.keys(data)

        const titles = {}

        for(let i=0; i < rows.length; i += 1) {
            const d = data[rows[i]]['info']
            const title = `${d['Subject']} ${d['Catalog Number']}`
            const option = {value: rows[i], label: title, data: data[rows[i]]}
            options.push(option)
        }

        this.setState({options})
        console.log('loaded')
    },


    getInitialState() {
        return {value: undefined, options: [], items: [], items_dict: {}}
    },

    getPickedItems() {
        const out = []
        const pickedItems = this.pickedItems
        const items = this.state.items

        for(let i=0; i < items.length; i += 1) {
            const item = items[i]
            const value = item['value']
            if(pickedItems[value]) {
                out.push(item)
            }
        }
        return out
    },

    componentDidMount() {
        this.updateOptions(DATA)

        $('#generate').click(() => {
            this.props.onGenerate(this.getPickedItems())
        })
    },

    updatePickedItems(pickedItems) {
        this.pickedItems = pickedItems
    },

    render() {
        const options = this.state.options
        return (
            <div className="ClassPicker">
                <Select value={this.state.value}
                        options={options}
                        onChange={this.onChange}
                />
                <ClassList items={this.state.items} updatePickedItems={this.updatePickedItems} />
                <button id="generate" type="button">Generate schedules!</button>
            </div>
        )
    }
})


const Calendar = React.createClass({
    render() {
        return (
            <div className="Calendar">
                Calendar
            </div>
        )
    }
})

const Home = React.createClass({
    render() {
        return <div>Welcome to the scheduler! Pick some classes on the left to start</div>
    }
})

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

const ClassSection = React.createClass({
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
                        <tr>
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
})

const ClassDetails = React.createClass({
    render() {
        let course_id = this.props.params.course
        course_id = course_id.replace('-', ' ')

        const course = DATA[course_id]
        console.log(course)

        return (
            <div>
                <div>{course_id}</div>
                <ClassSection sections={course['sections']} />
            </div>
        )
    }
})

const App = React.createClass({
    componentDidMount() {
    },

    getInitialState() {
        return {calendars: []}
    },

    onGenerate(items) {
        const calendars = possibleCalendars(items)
        this.setState({calendars})
    },

    render() {
        const children = React.cloneElement(this.props.children,
                                          {
                                              calendars: this.state.calendars,
                                              items: this.state.items
                                          })
        
        return (
            <div>
                <ClassPicker onGenerate={this.onGenerate} />
                <div className="SideView">
                    {children}
                </div>
            </div>
        )
    }
})

const render = () => {
    ReactDOM.render((
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="/class/:course" component={ClassDetails}/>
                <Route path="/calendar" component={Calendar}/>
            </Route>
        </Router>
    ), document.getElementById('app'))
}
/* ReactDOM.render(<App/>, document.getElementById('app')); */

function fetchData() {
    // Parse JSON string into object
    loadJSON(response => {
        DATA = JSON.parse(response)
        window.data = DATA
        render()
    })
}



$(document).ready(() => {
    window.location = '#/'
    fetchData()
})
