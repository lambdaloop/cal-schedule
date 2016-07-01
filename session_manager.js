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

        for(const section_id of c.unselectedSections) {
            window.store.dispatch({
                type: 'TOGGLE_SECTION',
                course_id: c.id,
                section_id: section_id
            })
        }
    }
    // console.log(JSON.parse(courses))
}

function getUnselectedSections(course) {
    let out = []
    let sections = course.data.sections

    for(const key in sections) {
        let section_types = sections[key]
        for(let section_type in section_types) {
            for(let section of section_types[section_type]) {
                if(!section.selected) {
                    out.push(section['Class Number'])
                }
            }
        }
    }

    return out
}

export function storeCookieData() {
    const state = window.store.getState()
    const courses = state.courses.picked

    const out = courses.map(course => { return {
        id: course.id,
        selected: course.selected,
        unselectedSections: getUnselectedSections(course.course)
    } } )

    console.log(out)

    const str = JSON.stringify(out)
    console.log(str)

    Cookies.set('courses', str, { expires: 365, path: '' });
}
