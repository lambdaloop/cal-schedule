import 'babel-polyfill'

import { combineReducers } from 'redux'


function course(state = {}, action) {
    switch(action.type) {
    case 'ADD_COURSE':
        return {
            course: action.course,
            id: action.id,
            selected: (action.selected === undefined ? true : action.selected)
        }
    case 'TOGGLE_COURSE':
        if(state.id !== action.id) {
            return state
        } else {
            let newState = Object.assign({}, state, {
                selected: !state.selected
            })
            return newState
        }
    default:
        return state
    }
}

function courses(state = {picked: [], ids: {}}, action) {
    switch(action.type) {
    case 'ADD_COURSE':
        if(state.ids[action.id]) {
            return state;
        } else {
            let ids = Object.assign({}, state.ids)
            ids[action.id] = true

            return {
                picked: state.picked.concat([ course(undefined, action) ]),
                ids
            }
        }
    case 'TOGGLE_COURSE':
        return {
            picked: state.picked.map( c => course(c, action) ),
            ids: state.ids
        }
    case 'REMOVE_COURSE':
        let ids = Object.assign({}, state.ids)
        delete ids[action.id]
        
        return {
            picked: state.picked.filter( c => c.id != action.id ),
            ids: ids
        }
        
    default:
        return state
    }
}

function calendars(state = {calendars: [], index: undefined}, action) {
    switch(action.type) {
    case 'SET_CALENDARS':
        return {
            calendars: action.calendars,
            index: 0
        }
    case 'NEXT_CALENDAR_INDEX':
        return Object.assign({}, state, {
            index: Math.min(state.index + 1, state.calendars.length - 1)
        })
    case 'PREV_CALENDAR_INDEX':
        return Object.assign({}, state, {
            index: Math.max(state.index - 1, 0)
        })
    case 'SET_CALENDAR_INDEX':
        return Object.assign({}, state, {
            index: action.index
        })
    default:
        return state;
    }
}

export const reducer = combineReducers({
    courses,
    calendars
})
