import { combineReducers } from 'redux'
import objectAssignDeep from 'object-assign-deep'
import objectAssign from 'object-assign-deep'


function selectSections(course, section_id, set) {
    let out = objectAssignDeep({}, course)
    let sections = out.data.sections
    for(const key in sections) {
        let section_types = sections[key]
        for(let section_type in section_types) {
            for(let section of section_types[section_type]) {
                if(section_id === undefined || section['Class Number'] == section_id ) {
                    if(set === undefined) {
                        section.selected = !section.selected
                    } else {
                        section.selected = set
                    }
                }
            }
        }
    }
    return out
}

function setEnrollmentSection(course, section_id, enrollment) {
    let out = objectAssignDeep({}, course)
    let sections = out.data.sections
    for(const key in sections) {
        let section_types = sections[key]
        for(let section_type in section_types) {
            for(let section of section_types[section_type]) {
                if(section['Class Number'] == section_id ) {
                    section.enrollment = enrollment
                }
            }
        }
    }
    return out
}

function course(state = {}, action) {
    console.log(action)
    switch(action.type) {
    case 'ADD_COURSE':
        return {
            course: selectSections(action.course, undefined, true),
            id: action.id,
            selected: (action.selected === undefined ? true : action.selected)
        }
    case 'TOGGLE_COURSE':
        if(state.id !== action.id) {
            return state
        } else {
            return objectAssign({}, state, {
                selected: !state.selected
            })
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
    case 'ENROLLMENT_SECTION':
        if(state.id !== action.course_id) {
            return state
        } else {
            return {
                course: setEnrollmentSection(state.course, action.section_id, action.enrollment),
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
            let ids = objectAssignDeep({}, state.ids)
            ids[action.id] = true

            return {
                picked: state.picked.concat([ course(undefined, action) ]),
                ids
            }
        }
    case 'REMOVE_COURSE':
        let ids = objectAssignDeep({}, state.ids)
        delete ids[action.id]
        
        return {
            picked: state.picked.filter( c => c.id != action.id ),
            ids: ids
        }

    case 'TOGGLE_COURSE':
    case 'ENROLLMENT_SECTION':
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
        return objectAssignDeep({}, state, {
            index: Math.min(state.index + 1, state.calendars.length - 1)
        })
    case 'PREV_CALENDAR_INDEX':
        return objectAssignDeep({}, state, {
            index: Math.max(state.index - 1, 0)
        })
    case 'SET_CALENDAR_INDEX':
        return objectAssignDeep({}, state, {
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
