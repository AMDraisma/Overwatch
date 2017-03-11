var gulp = require('gulp');
var runSequence = require('run-sequence');
var minify = require('gulp-minify');
var inject = require('gulp-inject');
var typescript = require('gulp-tsc');
var sourcemaps = require('gulp-sourcemaps');


var wwwroot = './wwwroot'
var libs = '{bootstrap,jquery}'

// npm dependencies
gulp.task('npm:copy', (cb) => {
    gulp.src([`node_modules/${libs}/dist/*`, `node_modules/${libs}/dist/**/*`], {base: 'node_modules'})
        .pipe(gulp.dest(`${wwwroot}/lib/`));
    cb();
});


// overwatch stuff
gulp.task('ow:copy', (cb) => {
    gulp.src(['src/*.html'], {base: 'src'})
        .pipe(gulp.dest(`${wwwroot}`));
    gulp.src(['src/css/*.css'], {base: 'src'})
        .pipe(gulp.dest(`${wwwroot}`));
    gulp.src(['src/config/*'], {base: 'src'})
        .pipe(gulp.dest(`${wwwroot}`));
    cb();
});


// compile typescript
gulp.task('tsc', (cb) => {
    gulp.src([`src/js/*.ts`])
        .pipe(typescript({
            "module": "commonjs",
            "target": "ES6",
            "noimplicitany": true,
            "sourcemap": false
        }))
        .pipe(gulp.dest(`${wwwroot}/js`));
    cb();
});

// inject dependencies
gulp.task('insertjs', function(cb){
    return gulp.src(`${wwwroot}/index.html`)
        .pipe(inject(gulp.src([`${wwwroot}/lib/${libs}/**/${libs}.min.js`, `${wwwroot}/js/*.js`], {base: wwwroot}), {
                starttag: '<!-- gulp:js -->',
                endtag: '<!-- endgulp -->',
                relative:true
            }
        ))
        .pipe(gulp.dest(wwwroot));
    cb();
});

gulp.task('insertcss', function(cb){
    return gulp.src(`${wwwroot}/index.html`)
        .pipe(inject(gulp.src([`${wwwroot}/lib/*/**/*.css`, `${wwwroot}/css/*.css`], {base: wwwroot}), {
                starttag: '<!-- gulp:css -->',
                endtag: '<!-- endgulp -->',
                relative:true
            }
        ))
        .pipe(gulp.dest(wwwroot));
    cb();
});

gulp.task('deploy', () => {
    runSequence('npm:copy', 'ow:copy', 'tsc', 'insertjs', 'insertcss');
});
