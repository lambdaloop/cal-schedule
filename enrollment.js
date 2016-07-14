function getSectionIDs(sections) {
    if(!sections) {
        return null
    } else {
        let out = {}
        for(const section of sections) {
            out[section.section_number] = section.section_id
        }
        return out
    }
}

function fetchSectionIDs(bid, callback) {
    if(!bid) {
        callback(null)
        return null
    }
    console.log(bid)

    const url = "http://www.berkeleytime.com/enrollment/sections/" + bid + '/'
    $.ajax({
        url: url,
        crossDomain: true,
        dataType: 'json'
    }).done((data) => {
        console.log(data)
        const sections = data.filter(s => s.semester == 'fall' && s.year == '2016')
        if(sections.length == 0) {
            callback(null)
        } else {
            const sectionIDs = getSectionIDs(sections[0].sections)
            callback(sectionIDs)
        }
    })
}

const SERVER_URL = 'https://calplanner.herokuapp.com'

let COURSES_FETCHING = {}

export function fetchEnrollment(course) {
    const bid = course.info.Berkeleytime
    if(!bid || COURSES_FETCHING[bid]) {
        return
    }

    COURSES_FETCHING[bid] = true

    $.get(SERVER_URL + '/section_ids?course_id=' + bid)
        .done(data => {
            console.log(data)

            if(data.status != 'success') {
                return
            }

            const sectionIDs = data.data
            if(!sectionIDs) {
                return
            }

            let sections = course.sections
            for(const key in sections) {
                let section_types = sections[key]
                for(let section_type in section_types) {
                    for(let section of section_types[section_type]) {
                        if(section.enrollment) {
                            continue
                        }

                        if(sectionIDs[section.Section]) {

                            $.get(SERVER_URL + '/section_enrollment?section_id=' + sectionIDs[section.Section])
                                .done(data => {
                                    if(data.status == 'success') {
                                        window.store.dispatch({
                                            type: 'ENROLLMENT_SECTION',
                                            section_id: section['Class Number'],
                                            course_id: section['Key'],
                                            enrollment: data.data
                                        })
                                    }
                                })
                        } else {
                            window.store.dispatch({
                                type: 'ENROLLMENT_SECTION',
                                section_id: section['Class Number'],
                                course_id: section['Key'],
                                enrollment: 'none'
                            })
                        }
                    }
                }
            }
        })

}
