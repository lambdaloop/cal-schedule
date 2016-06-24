var React = require("react");
var ReactDOM = require("react-dom");
var router = require("react-router");

var Router = router.Router;
var Route = router.Route;
var IndexRoute = router.IndexRoute;
var Link = router.Link;

var browserHistory = router.browserHistory;
var hashHistory = router.hashHistory;


/* var Select = require('react-select');
   require('react-select/dist/react-select.css'); */

var Select = require('react-virtualized-select').default;
require('react-virtualized/styles.css');
require('react-select/dist/react-select.css');
require('react-virtualized-select/styles.css');

require('./style.less');


var planner = require('./planner.js');
var possibleCalendars = planner.possibleCalendars;

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'schedule-grouped.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

var DATA = null;


var dict_zip = function (key_array, val_array) {
    if (key_array.length === val_array.length) {
        var obj = {};
        var len = key_array.length;

        for (var i = 0;i < len; i++) {
            obj[key_array[i]] = val_array[i];
        }
        return obj;
    } else {
        console.log("dict_zip bad args length");
    }
}


var ClassList = React.createClass({
    getInitialState: function() {
        return {pickedItems: {}}
    },

    updatePickedItems: function(items) {
        var pickedItems = this.state.pickedItems;
        for(var i=0; i < items.length; i += 1) {
            var value = items[i]['value'];
            if(pickedItems[value] === undefined) {
                pickedItems[value] = true;
            }
        }
        this.setState({pickedItems: pickedItems});

        this.props.updatePickedItems(pickedItems);
    },

    componentWillReceiveProps: function(nextProps) {
        if(nextProps['items']) {
            this.updatePickedItems(nextProps['items']);
        }
    },

    checkItem: function(e) {
        var target = $(e['target']);
        var value = target.attr('value');

        var pickedItems = this.state.pickedItems;
        pickedItems[value] = !pickedItems[value];
        this.setState({pickedItems: pickedItems});

        this.props.updatePickedItems(pickedItems);
    },

    render: function() {
        var items = this.props.items.map(function(item) {
            var d = item['data']['info'];
            var value = item['value'];
            var title = d['Subject'] + ' ' + d['Catalog Number'];
            var name = d['Course Title'];
            var checked = this.state.pickedItems[value];

            var url = "/class/" + value.replace(' ', '-');

            return (
                <div key={value}>
                    <input type="checkbox" value={value}
                           checked={checked} onChange={this.checkItem}/>
                    <span>{title} -- {name}</span> <Link to={url}>(sections)</Link>
                </div>
            );
        }.bind(this));

        return (
            <div className="ClassList">
                <div> Classes </div>
                <div>
                    {items}
                </div>
            </div>
        );
    }
});

var ClassPicker = React.createClass({
    onChange: function(val) {
        console.log(val);
        if(val == null) {
            this.setState({value: undefined});
        } else {
            var items = this.state.items;
            var items_dict = this.state.items_dict;
            if(!items_dict[val['value']]) {
                items_dict[val['value']] = val;
                items.push(val);
            }
            this.setState({value: undefined, items: items, items_dict: items_dict});
        }
    },

    updateOptions: function(data) {
        var options = [];
        var rows = Object.keys(data);

        var titles = {};

        for(var i=0; i < rows.length; i += 1) {
            var d = data[rows[i]]['info'];
            var title = d['Subject'] + ' ' + d['Catalog Number'];
            var option = {value: rows[i], label: title, data: data[rows[i]]};
            options.push(option);
        }

        this.setState({options: options});
        console.log('loaded');
    },


    getInitialState: function() {
        return {value: undefined, options: [], items: [], items_dict: {}};
    },

    getPickedItems: function() {
        var out = [];
        var pickedItems = this.pickedItems;
        var items = this.state.items;

        for(var i=0; i < items.length; i += 1) {
            var item = items[i];
            var value = item['value'];
            if(pickedItems[value]) {
                out.push(item);
            }
        }
        return out;
    },

    componentDidMount: function() {
        this.updateOptions(DATA);

        $('#generate').click(function() {
            this.props.onGenerate(this.getPickedItems());
        }.bind(this));
    },

    updatePickedItems: function(pickedItems) {
        this.pickedItems = pickedItems;
    },

    render: function() {
        var options = this.state.options;
        return (
            <div className="ClassPicker">
                <Select value={this.state.value}
                        options={options}
                        onChange={this.onChange}
                />
                <ClassList items={this.state.items} updatePickedItems={this.updatePickedItems} />
                <button id="generate" type="button">Generate schedules!</button>
            </div>
        );
    }
});


var Calendar = React.createClass({
    render: function() {
        return (
            <div className="Calendar">
                Calendar
            </div>
        );
    }
});

var Home = React.createClass({
    render: function() {
        return <div>Welcome to the scheduler! Pick some classes on the left to start</div>
    }
});

function sortedComps(comps_in) {
    var comps = comps_in.slice();
    var ordering = ['LEC', 'SEM', 'LAB']
    comps.sort(function(a, b) {
        if(a == b) return 0;

        for(var i = 0; i < ordering.length; i += 1) {
            var c = ordering[i];
            if(a == c) return -1;
            else if(b == c) return 1;
        }

        if(a < b) return -1;
        else return 1;
    });
    return comps;
}

var ClassSection = React.createClass({
    render: function() {
        var sectionNumber = this.props.sectionNumber;
        var sections = this.props.sections;

        var rows = [];

        for(var sec in sections) {
            var section = sections[sec];

            var comps = Object.keys(section);
            comps = sortedComps(comps);

            for(var i = 0; i < comps.length; i += 1) {
                var comp = comps[i];
                section[comp].map(function(item) {
                    var out = (
                        <tr>
                            <td>
                                <input type="checkbox" onChange={this.checkItem} />
                            </td>
                            <td>{item["Class Number"]}</td>
                            <td>{item["Course Component"]} {item["Section"]}</td>
                            <td>{item["Meeting Days"]}</td>
                            <td>{item["Start Time"]} -- {item["End Time"]}</td>
                            <td>{item["Instructor Name"]}</td>
                        </tr>
                    );
                    rows.push(out);
                });
            }
        }

        return (
            <table className="ClassSection">
                <tbody>
                    <tr>
                        <th><input type="checkbox" onChange={this.checkItem} /></th>
                        <th>CCN</th>
                        <th>Section</th>
                        <th>Days</th>
                        <th>Time</th>
                        <th>Instructor</th>
                    </tr>
                    {rows}
                </tbody>
            </table>
        );
    }
});

var ClassDetails = React.createClass({
    render: function() {
        var course_id = this.props.params.course;
        course_id = course_id.replace('-', ' ');

        var course = DATA[course_id];
        console.log(course);

        return (
            <div>
                <div>{course_id}</div>
                <ClassSection sections={course['sections']} />
            </div>
        );
    }
});

var App = React.createClass({
    componentDidMount: function() {
    },

    getInitialState: function() {
        return {calendars: []};
    },

    onGenerate: function(items) {
        var calendars = possibleCalendars(items);
        this.setState({calendars: calendars});
    },

    render: function() {
        var children = React.cloneElement(this.props.children,
                                          {
                                              calendars: this.state.calendars,
                                              items: this.state.items
                                          });
        
        return (
            <div>
                <ClassPicker onGenerate={this.onGenerate} />
                <div className="SideView">
                    {children}
                </div>
            </div>
        );
    }
});


function fetchData() {
    // Parse JSON string into object
    loadJSON(function(response) {
        DATA = JSON.parse(response);
        window.data = DATA;
        render();
    }.bind(this));
}


function render() {
    ReactDOM.render((
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="/class/:course" component={ClassDetails}/>
                <Route path="/calendar" component={Calendar}/>
            </Route>
        </Router>
    ), document.getElementById('app'));
}
/* ReactDOM.render(<App/>, document.getElementById('app')); */

$(document).ready(function() {
    window.location = '#/';
    fetchData();
});
