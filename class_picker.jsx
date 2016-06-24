import React, { Component } from "react"
import { Link } from "react-router"

import {default as Select} from 'react-virtualized-select'
require('react-virtualized/styles.css')
require('react-select/dist/react-select.css')
require('react-virtualized-select/styles.css')

class ClassList extends Component {
    constructor(props) {
        super(props)
        this.checkItem = this.checkItem.bind(this)
    }

    componentDidMount() {
        this.unsubscribe = window.store.subscribe(() => this.forceUpdate())
    }

    componentWillUnmount() {
        this.unsubscribe()
    }
   
    checkItem(e) {
        const target = $(e['target'])
        const value = target.attr('value')

        window.store.dispatch({
            type: 'TOGGLE_COURSE',
            id: value
        })
    }

    render() {
        console.log('items: ')
        console.log(this.props.items)

        const items = this.props.items.map(item => {
            const d = item['course']['data']['info']
            const value = item['id']
            const title = `${d['Subject']} ${d['Catalog Number']}`
            const name = d['Course Title']
            const checked = item['selected']

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
}

export class ClassPicker extends Component {

    constructor(props) {
        super(props)
        this.updateOptions(window.data)
        this.onChange = this.onChange.bind(this)
    }

    componentDidMount() {
        this.unsubscribe = window.store.subscribe(() => this.forceUpdate())

        $('#generate').click(this.props.onGenerate)
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    onChange(val) {
        if(val == null) {
            return
        }

        window.store.dispatch({
            type: 'ADD_COURSE',
            course: val,
            id: val['value']
        })
    }

    updateOptions(data) {
        const options = []
        const rows = Object.keys(data)

        for(let i=0; i < rows.length; i += 1) {
            const d = data[rows[i]]['info']
            const title = `${d['Subject']} ${d['Catalog Number']}`
            const option = {value: rows[i], label: title, data: data[rows[i]]}
            options.push(option)
        }

        this.options = options
    }

    render() {
        const options = this.options
        var state = window.store.getState()
        console.log(state.courses)

        return (
            <div className="ClassPicker">
              <Select value={undefined}
                      options={options}
                      onChange={this.onChange}
                      />
              <ClassList items={state.courses.picked}  />
              <button id="generate" type="button">Generate schedules!</button>
            </div>
        )
    }
}
