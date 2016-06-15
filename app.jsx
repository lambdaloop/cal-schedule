var React = require("react");
var ReactDOM = require("react-dom");
var router = require("react-router");

var Router = router.Router;
var Route = router.Route;
var browserHistory = router.browserHistory;
var hashHistory = router.hashHistory;


/* var Select = require('react-select');
   require('react-select/dist/react-select.css'); */

var Select = require('react-virtualized-select').default;
require('react-virtualized/styles.css');
require('react-select/dist/react-select.css');
require('react-virtualized-select/styles.css');

function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'schedule.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

var dict_zip = function (key_array, val_array) {
    if (key_array.length === val_array.length) {
        var obj = {};
        var len = key_array.length;

        for (var i = 0;i<len;i++) {
            obj[key_array[i]] = val_array[i];
        }
        return obj;
    } else {
        console.log("dict_zip bad args length");
    }
}


var App = React.createClass({
    onChange: function(val) {
        console.log(val);
        if(val == null) {
            this.setState({value: undefined});
        } else {
            var items = this.state.items;
            items.push(val);
            this.setState({value: val['value'], items: items});
        }
    },

    updateOptions: function(data) {
        var options = [];
        var header = data['header'];
        var rows = data['data'];

        var titles = {};
        
        for(var i=0; i < rows.length; i += 1) {
            var d = dict_zip(header, rows[i]);
            var title = d['Subject'] + ' ' + d['Catalog Number'] + ' -- ' + d['Course Title'];
            /* var title = d['Subject']; */
            var option = {value: d['Class Number'], label: title, course: d};
            if(!titles[title]) {
                options.push(option);
                titles[title] = true;
            }
        }

        this.setState({options: options});
        console.log('loaded');
    },

    componentDidMount: function() {
        this.loadData();
    },
    
    loadData: function() {
        // Parse JSON string into object
        loadJSON(function(response) {
            var data = JSON.parse(response);
            window.data = data;
            this.setState({'data': data});
            this.updateOptions(data);
        }.bind(this));
    },

    getInitialState: function() {
        return {data: null, value: undefined, options: [], items: []};
    },
    
    render: function() {
        var options = this.state.options;

        var items = this.state.items.map(function(item) {
            return (
                <div>
                    {item['label']}
                </div>
            );
        });
        
        return (
            <div>
                <Select value={this.state.value}
                        options={options}
                        onChange={this.onChange} />
                <div>
                    {items}
                </div>
            </div>
        );
    }
});


/* ReactDOM.render((
   <Router history={hashHistory}>
   <Route path="/" component={App} />
   </Router>
   ), document.getElementById('app')) */

ReactDOM.render(<App/>, document.getElementById('app'));
