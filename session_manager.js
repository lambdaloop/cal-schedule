import Cookies from 'js-cookie'

export function loadCookieData() {
    let courses = Cookies.get('courses')
    if(!courses) {
        return
    }
    courses = JSON.parse(courses)
    for(const c of courses) {
        console.log(c)

        
        let course = {
            label: c.id,
            value: c.id
        }

        if(c.custom) {
            course.data = c.data
            course.custom = true
        } else {
            course.data = window.data[c.id]
        }

        window.store.dispatch({
            type: 'ADD_COURSE',
            course: course,
            id: c.id,
            selected: c.selected
        })

        if(!c.unselectedSections) {
            continue;
        }

        for(const section_id of c.unselectedSections) {
            window.store.dispatch({
                type: 'TOGGLE_SECTION',
                course_id: c.id,
                section_id: section_id
            })
        }
    }
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

    const out = courses.map(course => {
        let c = {
            id: course.id,
            selected: course.selected,
            unselectedSections: getUnselectedSections(course.course)
        }
        if(course.course.custom) {
            c.data = course.course.data
            c.custom = true
        }
        return c
    } )

    const str = JSON.stringify(out)

    Cookies.set('courses', str, { expires: 365, path: '' });
}
