'use strict';

//---------//
// Imports //
//---------//

var ptr = require('promise-task-runner')
    , PromiseTask = ptr.PromiseTask
    , PromiseTaskContainer = ptr.PromiseTaskContainer
    , gulp = require('gulp')
    , bPromise = require('bluebird')
    , bFs = require('fs-bluebird')
    , bRimraf = bPromise.promisify(require('rimraf'));


//------//
// Init //
//------//

var ptc = new PromiseTaskContainer();
var environments = {
    dev: 'dev'
    , test: 'test'
    , prod: 'prod'
};

//-------//
// Tasks //
//-------//

var clean = new PromiseTask()
    .id('clean')
    .task(function() {
        var env = this.globalArgs().env;
        return bRimraf(env)
            .then(function() {
                console.log(env + ' cleaned');
                return bFs.mkdir(env);
            });
    });
var copyHtml = new PromiseTask()
    .id('copyHtml')
    .dependencies(clean)
    .task(function() {
        var env = this.globalArgs().env;
        console.log('html copied into ' + env);
        gulp.src('src/**/*.html')
            .pipe(gulp.dest(env));
    });

ptc.addTasks(clean, copyHtml);


//---------//
// Exports //
//---------//

module.exports = ptc;
