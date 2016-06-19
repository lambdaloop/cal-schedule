/*
  This should plan the schedules, given some candidate classes.
*/


// constraint language
// ["and", X, Y]
// ["or", X, Y]

function classConstraint(classItem) {

    return classItem;
}

function classesConstraint(classes) {
    var out = ["and"];

    for(var i = 0; i < classes.length; i += 1) {
        var constraint = classConstraint(classes[i]);
        out.push(constraint);
    }
    console.log(out);
    return out;
}

module.exports = {
    convertToConstraint: classesConstraint
};
