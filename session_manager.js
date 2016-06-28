import Cookies from 'js-cookie'

export function loadCookieData() {
    let courses = Cookies.get('courses')
    if(!courses) {
        return
    }
    courses = JSON.parse(courses)
    for(const c of courses) {
        const course = {
            data: window.data[c.id],
            label: c.id,
            value: c.id
        }
        
        window.store.dispatch({
            type: 'ADD_COURSE',
            course: course,
            id: c.id,
            selected: c.selected
        })
    }
    // console.log(JSON.parse(courses))
}

export function storeCookieData() {
    const state = window.store.getState()
    const courses = state.courses.picked

    const out = courses.map(course => { return {
        id: course.id,
        selected: course.selected
    } } )

    const str = JSON.stringify(out)
    console.log(str)
    
    Cookies.set('courses', str, { expires: 365, path: '' });
}
