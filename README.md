# Cal Planner

Remember when https://ninjacourses.com/ used to have Berkeley data and you could
plan your schedule on it? Maybe not, but I do, and it was great.

Sadly, they dropped support, and we are left with
[CalCentral's schedule planner](https://berkeley.collegescheduler.com/spa#).
It's usable, but still I preferred the more streamlined ninja courses. So this
my ninjacourses clone to help plan courses for Fall 2016.

You can find it hosted here:
http://lambdaloop.github.io/cal-schedule

## Technicals

### Overview & Setup
I tried to use some new tech with this, so this is built with:

- [React](https://facebook.github.io/react/)
- [webpack](https://webpack.github.io/)
- [ES6](https://github.com/lukehoban/es6features)
- [Redux](https://github.com/reactjs/redux)

Moving to Redux and ES6 definitely made the architecture and code cleaner.

For scraping the pdfs, I used the excellent [Tabula](http://tabula.technology/). After downloading the schedules from http://schedule.berkeley.edu/ , I ran the following to get CSVs that I could then process with Python:
``` shell
java -jar tabula-0.9.0-SNAPSHOT-jar-with-dependencies.jar "Fall 2016 Grad Schedule of Classes.pdf"  -f CSV  -g -r -o grad_schedule.csv --pages all
java -jar tabula-0.9.0-SNAPSHOT-jar-with-dependencies.jar "Fall 2016 Undergrad Schedule of Classes.pdf"  -f CSV  -g -r -o undergrad_schedule.csv --pages all
```

### Development
To develop, you need to get the latest npm packages, and then recompile the app with webpack:

``` shell
npm install
wepback
```
For development, I recommend using webpack-dev-server, which auto-refreshes the webpage whenever you save.
This is what I ran when developing:
``` shell
webpack-dev-server --progress --colors --output-public-path=build
```
Once you've compiled the sources, you open the app by opening `index.html` in the browser of your choice.

### Deployment

Github wants something in the gh-pages branch for deployment. I refactored the whole process into the `deploy.sh` script.
So I just run `bash deploy.sh` to deploy the latest code online.

## Contributing

I welcome pull requests! If you make one, I only ask you to try to use the latest ES6 syntax, and to avoid semicolons.

## Thanks

Thanks to Ronald Kwan who built a schedule searcher from the same PDFs some time ago:
http://rkwan.gitlab.io/cal-schedule/
This inspired me to build my own website as well (with the same name because it was good).
