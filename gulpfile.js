/*
Gulpfile.js file for the tutorial:
Using Gulp, SASS and Browser-Sync for your front end web development - DESIGNfromWITHIN
http://designfromwithin.com/blog/gulp-sass-browser-sync-front-end-dev

Steps:

1. Install gulp globally:
npm install --global gulp

2. Type the following after navigating in your project folder:
npm install gulp gulp-util gulp-sass gulp-uglify gulp-rename gulp-minify-css gulp-notify gulp-concat gulp-plumber browser-sync --save-dev

3. Move this file in your project folder

4. Setup your vhosts or just use static server (see 'Prepare Browser-sync for localhost' below)

5. Type 'Gulp' and ster developing
*/

/* Needed gulp config */
var gulp = require('gulp'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    rigger = require('gulp-rigger'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

    
/* Jade task */
gulp.task('jade', function() {
  return gulp
    .src('src/jade/*.jade')
//  .src('src/jade/**.jade')                  // for not pretty
    .pipe(jade({
      pretty: true
    }))
//  .pipe(gulp.dest('src/compiled/html/'))    // for not pretty
    .pipe(gulp.dest('web'))
});
    
/* Scripts task */
gulp.task('scripts', function() {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    'src/js/build.js'
    ])
    .pipe(rigger())
    .pipe(concat('build.js'))
    .pipe(gulp.dest('src/compiled/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('web/build'))
    .pipe(reload({stream:true}));
});
    
/* Vendor scripts task */
gulp.task('vendor', function() {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    'bower_components/jquery/dist/jquery.min.js',
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('src/js/vendor/'))
    .pipe(reload({stream:true}));
});

/* Stylus task */
gulp.task('stylus', function () {  
  return gulp.src('src/stylus/build.styl')
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(gulp.dest('src/compiled/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('web/build'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

/* Clean */
gulp.task('clean', function() {
  return gulp.src([
      'web/*.*', 
      'web/*/', 
      'src/compiled/*.*', 
      'src/compiled/*/'
  ], {
      read: false // more performance
    })
    .pipe(clean());
});

/* Reload task */
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function() {
    browserSync.init(['web/build/*.css', 'web/build/*.js'], {
        /*
        I like to use a vhost, WAMP guide: https://www.kristengrote.com/blog/articles/how-to-set-up-virtual-hosts-using-wamp, XAMP guide: http://sawmac.com/xampp/virtualhosts/
        */
        // proxy: 'your_dev_site.url'
        /* For a static server you would use this: */
        
        server: {
            baseDir: 'web'
        }
        
    });
});

/* Watch stylus, js, jade and html files, doing different things with each. */
gulp.task('default', ['stylus', 'vendor', 'scripts', 'jade', 'browser-sync'], function () {
    /* Watch stylus, run the stylus task on change. */
    gulp.watch(['src/stylus/*.styl'], ['stylus']);
    /* Watch app.js file, run the scripts task on change. */
    gulp.watch(['src/js/*.js', 'src/js/*/*.js', 'src/js/*/*/*.js'], ['scripts']);
    /* Watch .jade fiels */
    gulp.watch(['src/jade/*.jade'], ['jade']);
    /* Watch .html files, run the bs-reload task on change. */
    gulp.watch(['web/*.html'], ['bs-reload']);
});