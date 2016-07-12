
export function fetchEnrollment(course) {

    let sections = course.sections
    for(const key in sections) {
        let section_types = sections[key]
        for(let section_type in section_types) {
            for(let section of section_types[section_type]) {
                console.log(section)
            }
        }
    }

}
