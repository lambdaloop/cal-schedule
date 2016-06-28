import 'babel-polyfill'

import { combineReducers } from 'redux'


function selectSections(course, section_id) {
    let out = Object.assign({}, course)
    let sections = out.data.sections
    for(const key in sections) {
        let section_types = sections[key]
        for(let section_type in section_types) {
            for(let section of section_types[section_type]) {
                if(section_id === undefined || section['Class Number'] == section_id ) {
                    section.selected = !section.selected
                }
            }
        }
    }
    return course
}

function course(state = {}, action) {
    switch(action.type) {
    case 'ADD_COURSE':
        return {
            course: selectSections(action.course),
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
    case 'TOGGLE_SECTION':
        if(state.id !== action.course_id) {
            return state
        } else {
            return {
                course: selectSections(state.course, action.section_id),
                id: state.id,
                selected: state.selected
            }
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

    case 'TOGGLE_SECTION':
        return {
            picked: state.picked.map( c => course(c, action) ),
            ids: state.ids
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
