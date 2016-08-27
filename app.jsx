import React, { Component } from "react"
import ReactDOM from "react-dom"
import { Router, Route, IndexRoute, Link } from "react-router"
import { hashHistory } from "react-router"
import { createStore } from 'redux'
import objectAssignDeep from 'object-assign-deep'

require('./style.less')

import { possibleCalendars } from './planner.js'
import { ClassDetails } from './class_details.jsx'
import { ClassPicker } from './class_picker.jsx'
import { Calendars } from './calendar.jsx'
import { reducer } from './reducers.js'
import { loadCookieData } from './session_manager.js'

var DATA = null

function loadJSON(callback) {
    const xobj = new XMLHttpRequest()
    xobj.overrideMimeType("application/json")
    xobj.open('GET', 'data/schedule_grouped.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = () => {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText)
        }
    }
    xobj.send(null)
}


function fetchData(callback) {
    // Parse JSON string into object
    loadJSON(response => {
        DATA = JSON.parse(response)
        window.data = DATA
        console.log('data loaded!')
        callback()
    })
}


const store = createStore(reducer)
store.subscribe(() => {
    console.log('state')
    console.log(store.getState())
})


class Home extends Component {
    render() {
        return <div>Welcome to the scheduler! Pick some classes on the left to start</div>
    }
}

function filterSections(course) {
    let out = objectAssignDeep({}, course)
    let sections = out.data.sections

    for(const key in sections) {
        let section_types = sections[key]
        for(let section_type in section_types) {
            section_types[section_type] = section_types[section_type].filter( s => s.selected)
            if(section_types[section_type].length == 0) {
                delete section_types[section_type]
            }
        }
        if(Object.keys(sections[key]).length == 0) {
            delete sections[key]
        }
    }
    return out
}

export function getPickedItems() {
    let courses = window.store.getState().courses.picked
    return courses.filter(item => {
        return item['selected']
    }).map(item => {
        return filterSections(item['course'])
    })
}


class App extends Component {
    constructor(props) {
        super(props)
        this.onGenerate = this.onGenerate.bind(this)
    }

    onGenerate() {
        let items = getPickedItems();
        const calendars = possibleCalendars(items)
        window.store.dispatch({
            type: 'SET_CALENDARS',
            calendars: calendars
        })
        window.location = '#/calendar'
    }

    render() {
        return (
            <div className="App">
              <ClassPicker onGenerate={this.onGenerate} />
              <div className="SideView">
                {this.props.children}
              </div>
            </div>
        )
    }
}

/* ReactDOM.render(<App/>, document.getElementById('app')); */

function render() {
    ReactDOM.render((
        <Router history={hashHistory}>
          <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="/class/:course" component={ClassDetails}/>
            <Route path="/calendar" component={Calendars}/>
          </Route>
        </Router>
    ), document.getElementById('app'))
}


$(document).ready(() => {
    window.location = '#/'
    window.store = store
    fetchData(() => {
        loadCookieData()
        render()
    });
})
