import React, { Component } from "react"
import { Link } from "react-router"

import {default as Select} from 'react-virtualized-select'
require('react-virtualized/styles.css')
require('react-select/dist/react-select.css')
require('react-virtualized-select/styles.css')

class ClassList extends Component {
    constructor(props) {
        super(props)
        this.state = {pickedItems: {}}
        this.updatePickedItems = this.updatePickedItems.bind(this)
        this.checkItem = this.checkItem.bind(this)
    }

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
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps['items']) {
            this.updatePickedItems(nextProps['items'])
        }
    }

    checkItem(e) {
        const target = $(e['target'])
        const value = target.attr('value')

        const pickedItems = this.state.pickedItems
        pickedItems[value] = !pickedItems[value]
        this.setState({pickedItems})

        this.props.updatePickedItems(pickedItems)
    }

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
}

export class ClassPicker extends Component {

    constructor(props) {
        super(props)
        this.state = {value: undefined, options: [], items: [], items_dict: {}}

        this.pickedItems = {};
        
        this.onChange = this.onChange.bind(this)
        this.updatePickedItems = this.updatePickedItems.bind(this)
    }
    
    onChange(val) {
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

        this.setState({options})
    }


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
    }

    componentDidMount() {
        this.updateOptions(window.data)

        $('#generate').click(() => {
            this.props.onGenerate(this.getPickedItems())
        })
    }

    updatePickedItems(pickedItems) {
        this.pickedItems = pickedItems
    }

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
}
