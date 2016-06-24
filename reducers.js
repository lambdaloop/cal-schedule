import 'babel-polyfill'

import { combineReducers } from 'redux'


function course(state = {}, action) {
    switch(action.type) {
    case 'ADD_COURSE':
        return {
            course: action.course,
            id: action.id,
            selected: true
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
            let ids = Object.assign({}, state.ids);
            ids[action.id] = true;

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
    default:
        return state
    }
}

export const reducer = combineReducers({
    courses
})


