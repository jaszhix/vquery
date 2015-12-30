var gulp = require("gulp"),
    browserSync = require("browser-sync"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    mochaPhantomJS = require("gulp-mocha-phantomjs");

gulp.task("browser-sync", function () {
    "use strict";
    browserSync({
        server: {
            //serve tests and the root as base dirs
            baseDir: ["./test/", "./"],
            //make tests.html the index file
            index: "tests.html"
        }
    });
});

gulp.task("browserify", function() {
    "use strict";
    return browserify("./test/index.js")
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        .on("error", function (err) {
            console.log(err.toString());
            this.emit("end");
        })
        .pipe(source("tests-browserify.js"))
        .pipe(gulp.dest("tmp/"))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task("test", function () {
    "use strict";
    return gulp.src("./test/tests.html")
        .pipe(mochaPhantomJS());
});

gulp.task("serve", ["browserify", "browser-sync"], function () {
    "use strict";
    //when tests.js changes, browserify code and execute tests
    gulp.watch(["test/tests.js", "src/text-changer.js"], ["browserify", "test"]);
});
