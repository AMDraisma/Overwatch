var gulp = require('gulp');
var runSequence = require('run-sequence');
var minify = require('gulp-minify');
var inject = require('gulp-inject');
var typescript = require('gulp-tsc');

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
    gulp.src(['src/js/*'], {base: 'src'})
        //.pipe(minify())
        .pipe(gulp.dest(`${wwwroot}`));
    gulp.src(['src/config/*'], {base: 'src'})
        .pipe(gulp.dest(`${wwwroot}`));
    cb();
});


// compile typescript
gulp.task('tsc', (cb) => {
    gulp.src([`${wwwroot}/js/*.ts`])
        .pipe(typescript({
            "module": "commonjs",
            "target": "ES6",
            "noimplicitany": true,
            "sourcemap": true
        }))
        .pipe(gulp.dest(`${wwwroot}/js`))
    cb();
});

// inject dependencies
gulp.task('insertjs', function(cb){
    return gulp.src(`${wwwroot}/index.html`) //file with tags for injection
        .pipe(inject(gulp.src([`${wwwroot}/lib/${libs}/**/${libs}.min.js`, `${wwwroot}/js/*.js`], {base: wwwroot}), {
                starttag: '<!-- gulp:js -->',
                endtag: '<!-- endgulp -->',
                relative:true
            }
        ))
        .pipe(gulp.dest(wwwroot)); //where index.html will be saved. Same dir for overwrite old one
    cb();
});

gulp.task('insertcss', function(cb){
    return gulp.src(`${wwwroot}/index.html`) //file with tags for injection
        .pipe(inject(gulp.src([`${wwwroot}/lib/*/**/*.css`], {base: wwwroot}), {
                starttag: '<!-- gulp:css -->',
                endtag: '<!-- endgulp -->',
                relative:true
            }
        ))
        .pipe(gulp.dest(wwwroot)); //where index.html will be saved. Same dir for overwrite old one
    cb();
});

gulp.task('default', () => {
    runSequence('npm:copy', 'ow:copy', 'tsc', 'insertjs', 'insertcss');
});