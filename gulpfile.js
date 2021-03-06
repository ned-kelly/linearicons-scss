var gulp = require('gulp'),
    sass = require('gulp-sass'),
    ttf2eot = require('gulp-ttf2eot'),
    ttf2woff = require('gulp-ttf2woff')
    ttf2woff2 = require('gulp-ttf2woff2'),
    ttf2svg = require('ttf2svg'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    shell = require('gulp-shell'),
    runSequence = require('run-sequence').use(gulp);

var lineariScrFont = './src/Linearicons/Font/Linearicons.ttf',
    lineariCssFile = './src/Linearicons/Font/demo-files/demo.css',
    fontDistDir = './dist/fonts/linearicons/'

//run default gulp tasks
gulp.task('default', ['deploy-font', 'deploy-css']);

//run font tasks
gulp.task('deploy-font', function(callback){
    runSequence('copy-src-ttf-font', 'ttf2eot', 'ttf2woff', 'ttf2woff2');
})

//run sass tasks
gulp.task('deploy-css', function(callback){
    runSequence('generate-icons-from-src-css', 'sass2css', 'compress-css');
})

//copy linearicon src ttf font to dist
gulp.task('copy-src-ttf-font', function(){
    return gulp.src(lineariScrFont)
    .pipe(gulp.dest(fontDistDir ))
});

//convert ttf to eot,woff,woff2
gulp.task('ttf2eot', function(){
    return gulp.src([ fontDistDir + '*.ttf'])
    .pipe(ttf2eot())
    .pipe(gulp.dest( fontDistDir ));
});

//convert ttf to woff and woff2
gulp.task('ttf2woff', function(){
    return gulp.src([ fontDistDir + '*.ttf'])
    .pipe(ttf2woff())
    .pipe(gulp.dest( fontDistDir ));
});

//convert ttf to woff2
gulp.task('ttf2woff2', function(){
    return gulp.src([ fontDistDir + '*.ttf'])
    .pipe(ttf2woff2())
    .pipe(gulp.dest( fontDistDir ));
});

//generate scss icons from src css file
gulp.task('generate-icons-from-src-css', function(){
    return gulp.src(lineariCssFile)
    .pipe(shell([
        'grep -A 3 "\\.icon-" ./src/Linearicons/Font/demo-files/demo.css | sed "s,.icon-,.#{\\$linearico-css-prefix}-," > ./src/scss/_icons.scss'
        ]));
});


//sass to css
gulp.task('sass2css', function(){
     return gulp.src('./src/scss/linearicons.scss')
     .pipe(sass()).on('error', function (error) {
            console.error('' + error);
            this.emit('end');
        })
     .pipe(gulp.dest('./dist/css/'))
});

//minify css
gulp.task('compress-css', function(){
     return gulp.src('./dist/css/linearicons.css')
     .pipe(minifycss())
     .pipe(rename('linearicons.min.css'))
     .pipe(gulp.dest('./dist/css/'))
});