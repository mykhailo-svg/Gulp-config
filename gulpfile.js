const {src, dest , watch , series, parallel} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const cssConcat = require('gulp-concat');
const ESuglify = require('gulp-uglify');
const clean = require('gulp-clean');



const avif = require('gulp-avif');
const webp = require('gulp-webp');





const plugin = require('gulp-load-plugins')();

const tinyPng = require('gulp-tinypng')





const newer = require('gulp-newer');

const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');

const include = require('gulp-include');

const browserSync = require('browser-sync').create();




function concat() {

        return src('app/scss/style_components/components.scss')
    .pipe(cssConcat('app/scss/style.scss'))
    .pipe(gulp.dest('app'));
    
    

    
}


// function pages() {
//     return src('app/pages/*.html')
//     .pipe(include({
//         includePaths:'app/components'
//     }))
//     .pipe(dest('app'))
    
// }
   







function pages() {
    return src('app/pages/*.html')

    .pipe(include({
        includePaths:'app/components'
    }))
    .pipe(dest('app'))

    .pipe(browserSync.stream())
} 


function styleConcat() {
    return src('app/scss/*.*')

    .pipe(include({
        includePaths:'app/scss/style_components/*.scss'
    }))

    
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(dest('app/css'))

    .pipe(browserSync.stream())
} 


function scriptsConcat() {

    return src('app/js/js_src/*.*')

    .pipe(include({
        includePaths:'app/js/js_src/js_components/*.js'
    }))

    
    .pipe(ESuglify())
    .pipe(dest('app/js'))


    

    .pipe(browserSync.stream())

    
}





function fonts() {

    return src('app/fonts/src/*.*')
    
    .pipe(fonter({
        formats:['woff','ttf']
    }))
    
    .pipe(src('app/fonts/*.ttf'))

    .pipe(ttf2woff2())

    .pipe(dest('app/fonts'))

    
    
}












function images() {
    return src(['app/img/src/*.*','!app/img/src/*.svg'])
    
    
    // .pipe(newer('app/img/dist'))
    // .pipe(avif({ quality:50 }))
    // .pipe(src('app/img/src/*.*'))

    // .pipe(newer('app/img/dist'))
    // .pipe(webp())
    .pipe(src('app/img/src/*.*'))

    .pipe(newer('app/img'))
    .pipe(tinyPng('8RZH5XvTv3BxhPPRjDKdwh3930vnGFdQ'))
    .pipe(dest('app/img/'))

    
}


function to_webp() {
    return src(['app/img/webp-src/*.*'])
    
    
    
    .pipe(src('app/img/webp-src/*.*'))

    .pipe(newer('app/img'))
    .pipe(webp())
   

   
    .pipe(dest('app/img'))

    
}

function to_avif() {
    return src(['app/img/avif-src/*.*'])

    .pipe(src('app/img/avif-src/*.*'))
    
    .pipe(avif({ quality:80 }))
    .pipe(dest('app/img'))
}



function scripts() {
    return src('app/js/js_src/*.*')

    .pipe(include({
        includePaths:'app/js/js_src/js_components/*.js'
    }))

    
    .pipe(ESuglify())
    .pipe(dest('app/js'))


    

    .pipe(browserSync.stream())
}
 




function styles() {

    return src('app/scss/*.*')

    .pipe(include({
        includePaths:'app/scss/style_components/*.scss'
    }))

    
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(dest('app/css'))

    .pipe(browserSync.stream())
    
}


function watching() {
    watch(['app/fonts/'],fonts)
    watch(['app/scss/' , 'app/scss/style_components/'],styles)

  
    watch(['app/js/js_src/*.js' , 'app/js/js_src/js_components/*.js']).on('change' , browserSync.reload)
    watch(['app/js/js_src/*.js' , 'app/js/js_src/js_components/*.js'],scripts)
    watch(['app/img/src'],images)
    watch(['app/img/webp-src/'], to_webp)
    watch(['app/img/avif-src/'], to_avif)
    watch(['app/components/*' , 'app/pages/*'], pages)
    watch(['app/*.html']).on('change' , browserSync.reload)
}








function cleanDist() {

    return src('dist')
    .pipe(clean())

    
}

function build() {
    return src([
        'app/*.html',
        'app/css/*.css',
        'app/js/*.js',
        'app/img/*.*',
        'app/fonts/*.*',

       
    ], {base:'app'})
    .pipe(dest('dist'))

    
}


function browsersync() {

    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });

    
}


exports.styles = styles;
exports.fonts = fonts;

exports.images = images;
exports.to_webp = to_webp;
exports.to_avif = to_avif;


exports.scripts = scripts;

exports.scriptsConcat = scriptsConcat;



exports.watching = watching;

exports.browsersync = browsersync;

exports.pages = pages;


exports.styleConcat = styleConcat;



exports.build = series(cleanDist, build);

exports.default = parallel(browsersync,pages,watching);