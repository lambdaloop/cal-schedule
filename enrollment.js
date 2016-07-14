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

export function fetchEnrollment(course) {
    const bid = course.info.Berkeleytime
    if(!bid) {
        return
    }
    
    $.get(SERVER_URL + '/section_ids?course_id=' + bid)
    
    fetchSectionIDs(course.info.Berkeleytime, (enrollment) => {
        console.log(sectionIDs)
        if(!sectionIDs) {
            return
        }
        
        let sections = course.sections
        for(const key in sections) {
            let section_types = sections[key]
            for(let section_type in section_types) {
                for(let section of section_types[section_type]) {
                    console.log(section)
                }
            }
        }
    })
}

