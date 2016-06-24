import React, { Component } from "react"
import ReactDOM from "react-dom"
import { Router, Route, IndexRoute, Link } from "react-router"
import { hashHistory } from "react-router"


require('./style.less')


import { possibleCalendars } from './planner.js'
import { ClassDetails } from './class_details.jsx'
import { ClassPicker } from './class_picker.jsx'
import { Calendar } from './calendar.jsx'

var DATA = null

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


function fetchData(callback) {
    // Parse JSON string into object
    loadJSON(response => {
        DATA = JSON.parse(response)
        window.data = DATA
        callback()
    })
}



class Home extends Component {
    render() {
        return <div>Welcome to the scheduler! Pick some classes on the left to start</div>
    }
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {calendars: []}
        this.onGenerate = this.onGenerate.bind(this)
    }
    
    onGenerate(items) {
        const calendars = possibleCalendars(items)
    }

    render() {
        const children = React.cloneElement(this.props.children,
                                            {
                                                data: DATA
                                            })
        
        return (
            <div>
              <ClassPicker data={DATA} onGenerate={this.onGenerate} />
              <div className="SideView">
                {children}
              </div>
            </div>
        )
    }
}

/* ReactDOM.render(<App/>, document.getElementById('app')); */

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


$(document).ready(() => {
    window.location = '#/'
    fetchData(render);
})


