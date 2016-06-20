/*
  This should plan the schedules, given some candidate classes.

*/


// organize constraints
// [class, class, class], find a time for each class
// {0: .., 1: ..., x: ..}, pick only one section out of 0, 1, .., x
// {LEC: [...], DIS: [...]}, pick exactly one of each in LEC, DIS, ...


function classSections(classes) {
    var out = [];

    for(var i = 0; i < classes.length; i += 1) {
        var sections = classes[i]['data']['sections'];
        out.push(sections);
    }
    console.log(out);
    return out;
}

module.exports = {
    convertToConstraint: classSections
};
