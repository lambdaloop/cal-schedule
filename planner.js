var Queue = require('./Queue.js');

/*
 This should plan the schedules, given some candidate classes.
 */

/* finds the intersection of
 * two arrays in a simple fashion.
 *
 * params must already be sorted
 * from http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
 */
function intersect_safe(a, b)
{
    var ai=0, bi=0;
    var result = [];

    while( ai < a.length && bi < b.length )
    {
        if      (a[ai] < b[bi] ){ ai++; }
        else if (a[ai] > b[bi] ){ bi++; }
        else /* they're equal */
        {
            result.push(a[ai]);
            ai++;
            bi++;
        }
    }

    return result;
}

function timeToMinutes(time) {
    var s = time.split(':');
    return parseInt(s[0]) * 60 + parseInt(s[1]);
}


function ScheduleTime(days, startTime, endTime) {
    this.days = days.split("").slice();
    this.days.sort();

    this.startTime = timeToMinutes(startTime);
    this.endTime = timeToMinutes(endTime);

    this.overlaps = function(b) {
        var days = intersect_safe(this.days, b.days);
        if(days.length == 0) {
            return false;
        } else {
            return (this.startTime <= b.endTime) && (b.startTime <= this.endTime);
        }
    };
}

function schedulesOverlap(a, b) {
    return a.overlaps(b);
}

// constraints
// [class, class, class], find a time for each class
// {0: .., 1: ..., x: ..}, pick only one section out of 0, 1, .., x
// {LEC: [...], DIS: [...]}, pick exactly one of each in LEC, DIS, ...

function addScheduleTime(sections) {
    for(var section in sections) {
        var components = sections[section];
        for(var comp in components) {
            var rows = components[comp];
            for(var i = 0; i < rows.length; i += 1) {
                var row = rows[i];
                row['ScheduleTime'] = new ScheduleTime(row['Meeting Days'], row['Start Time'], row['End Time']);
                rows[i] = row;
            }
        }
    }
    return sections;
}

function classSections(classes) {
    var out = [];

    for(var i = 0; i < classes.length; i += 1) {
        var sections = classes[i]['data']['sections'];
        sections = addScheduleTime(sections);
        out.push(sections);
    }
    console.log(out);
    return out;
}

// picked = [[c1, c2], [c3, c4], ...]
// items = [c1, c2, c3]

function checkOverlap(stime, picked, items) {
    for(var i = 0; i < items.length; i += 1) {
        var item = items[i];
        if(item['ScheduleTime'].overlaps(stime)) {
            return true;
        }
    }
    for(var i = 0; i < picked.length; i += 1) {
        for(var j = 0; j < picked[i].length; j += 1) {
            var item = picked[i][j];
            if(item['ScheduleTime'].overlaps(stime)) {
                return true;
            }
        }
    }

    return false;
}

function possibleCombos(sections, picked) {
    // all possible combinations of classes
    // lists possibilities, given picked so far (exclude overlapping times)
    var possible = [];

    for(var section in sections) {
        var components = sections[section];
        var keys = Object.keys(components);

        // state is picked, key_ix

        var q = new Queue();
        q.enqueue([[], 0]);


        while(!q.isEmpty()) {
            var state = q.dequeue();
            var items = state[0];
            var key_ix = state[1];

            if(key_ix >= keys.length) {
                possible.push(items);
                continue;
            }

            var comp = keys[key_ix];
            var rows = components[comp];

            for(var i = 0; i < rows.length; i += 1) {
                var row = rows[i];
                if(!checkOverlap(row['ScheduleTime'], picked, items)) {
                    var items_new = items.slice();
                    items_new.push(row);
                    var state_new = [items_new, key_ix + 1];
                    q.enqueue(state_new);
                }
            }

        }
    }

    return possible;
}

function proposePossible(classes) {
    if(classes.length == 0) {
        return [];
    }

    // state is (picked, next_index)

    var possible = [];

    var q = new Queue();

    var state = [[], 0];
    q.enqueue(state);

    while(!q.isEmpty()) {
        state = q.dequeue();
        var picked = state[0].slice();
        var ix = state[1];
        if(ix >= classes.length) {
            possible.push(picked);
            continue;
        }

        var sections = classes[ix];
        var combos = possibleCombos(sections, picked);

        for(var i = 0; i < combos.length; i += 1) {
            var combo = combos[i];
            var picked_new = picked.slice();
            picked_new.push(combo);
            var state_new = [picked_new, ix+1];
            q.enqueue(state_new);
        }
    }

    return possible;
}

function possibleCalendars(classes) {
    var csections = classSections(classes);
    return proposePossible(csections);
}

module.exports = {
    possibleCalendars: possibleCalendars
};
