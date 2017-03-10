var gulp = require('gulp');
var runSequence = require('run-sequence');
var minify = require('gulp-minify');

var wwwroot = "./wwwroot"


// npm dependencies
gulp.task("npm:copy", (cb) => {
    gulp.src(["node_modules/*/dist/**/*"], {base: "node_modules"})
        .pipe(gulp.dest(`.${wwwroot}/lib/`));
    cb();
});


// overwatch stuff
gulp.task("ow:copy", (cb) => {
    gulp.src(["src/*.html"], {base: "src"})
        .pipe(gulp.dest(`.${wwwroot}/`));
    gulp.src(["src/js/*.js"], {base: "src/js"})
        //.pipe(minify())
        .pipe(gulp.dest(`.${wwwroot}/js`));
    gulp.src(["src/config/*"], {base: "src/config"})
        .pipe(gulp.dest(`.${wwwroot}/config`));
    cb();
});

// inject dependencies
gulp.task('npm:insertfiles', function(cb){
    return gulp.src(`.${wwwroot}/index.html`) //file with tags for injection
        .pipe(inject(gulp.src([`.${wwwroot}/lib/**/*.min.js`, `.${wwwroot}/lib/*.css`], {read: false}), {
                starttag: '<!-- npm:{{ext}} -->',
                endtag: '<!-- endnpm -->',
                relative:true
            }
        ))
        .pipe(gulp.dest('./src')); //where index.html will be saved. Same dir for overwrite old one
})
gulp.task('ow:insertfiles', function(cb){
    return gulp.src(`.${wwwroot}/index.html`) //file with tags for injection
        .pipe(inject(gulp.src([`.${wwwroot}/js/*.js`], {read: false}), {
                starttag: '<!-- ow:{{ext}} -->',
                endtag: '<!-- endow -->',
                relative:true
            }
        ))
        .pipe(gulp.dest('./src')); //where index.html will be saved. Same dir for overwrite old one
})


gulp.task('npm:buildlib', (callback) => {
    runSequence('npm:copy', 'ow:copy', callback);
})

gulp.task('default', () => {
    runSequence('npm:buildlib');
})